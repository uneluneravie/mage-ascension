async function loadSheetList() {
  const list = document.getElementById('sheetList');
  list.innerHTML = '';
  setSheetModalStatus('Carregando fichas...');

  try {
    const response = await fetch(`${sheetsManifest}?v=${Date.now()}`);
    if (!response.ok) throw new Error('manifest');
    const entries = (await response.json()).map(normalizeSheetEntry).filter(entry => entry.file);

    if (!entries.length) {
      setSheetModalStatus('Nenhuma ficha encontrada em fichas/index.json.');
      return;
    }

    entries.forEach(entry => {
      const button = document.createElement('button');
      const name = document.createElement('span');
      const file = document.createElement('small');
      button.type = 'button';
      button.className = 'sheet-list-btn';
      name.textContent = entry.name;
      file.textContent = entry.file;
      button.append(name, file);
      button.addEventListener('click', () => loadSheetFromFolder(entry.file));
      list.appendChild(button);
    });
    setSheetModalStatus('');
  } catch (err) {
    setSheetModalStatus('Nao foi possivel ler fichas/index.json.');
  }
}

async function loadSheetFromFolder(fileName) {
  setSheetModalStatus('Carregando ficha...');
  try {
    const response = await fetch(`${sheetUrl(fileName)}?v=${Date.now()}`);
    if (!response.ok) throw new Error('sheet');
    applySheetData(await response.json(), fileName, 'fichas');
    await loadLineageFromUrl('fichas');
    closeSheetModal();
  } catch (err) {
    setSheetModalStatus('Nao foi possivel carregar essa ficha.');
  }
}

function openSheetModal() {
  document.getElementById('sheetModal').hidden = false;
  loadSheetList();
}

function closeSheetModal() {
  document.getElementById('sheetModal').hidden = true;
}

function closeStartModal() {
  document.getElementById('startModal').hidden = true;
}

function setStartModalStatus(message) {
  document.getElementById('startModalStatus').textContent = message;
}

function populatePrioritySelect(select, options, selected) {
  select.innerHTML = '';
  Object.entries(options).forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });
  select.value = selected;
}

function populatePriorityControls() {
  const settings = creationSettings();
  const attributeLabels = { physical: 'Físicos', social: 'Sociais', mental: 'Mentais' };
  const abilityLabels = { talents: 'Talentos', skills: 'Perícias', knowledges: 'Conhecimentos' };
  populatePrioritySelect(document.getElementById('attributePrimary'), attributeLabels, settings.attributePriorities.primary);
  populatePrioritySelect(document.getElementById('attributeSecondary'), attributeLabels, settings.attributePriorities.secondary);
  populatePrioritySelect(document.getElementById('attributeTertiary'), attributeLabels, settings.attributePriorities.tertiary);
  populatePrioritySelect(document.getElementById('abilityPrimary'), abilityLabels, settings.abilityPriorities.primary);
  populatePrioritySelect(document.getElementById('abilitySecondary'), abilityLabels, settings.abilityPriorities.secondary);
  populatePrioritySelect(document.getElementById('abilityTertiary'), abilityLabels, settings.abilityPriorities.tertiary);
}

function normalizePrioritySelects(kind, changedSelect) {
  const selects = Array.from(document.querySelectorAll(`[data-priority-kind="${kind}"]`));
  const available = kind === 'attributes' ? Object.keys(creationGroups.attributes) : Object.keys(creationGroups.abilities);
  const used = new Set();

  selects.forEach(select => {
    if (select !== changedSelect && select.value === changedSelect.value) {
      const replacement = available.find(value => !used.has(value) && value !== changedSelect.value);
      if (replacement) select.value = replacement;
    }
    used.add(select.value);
  });
}

function syncPriorityState() {
  const settings = creationSettings();
  settings.attributePriorities = {
    primary: document.getElementById('attributePrimary').value,
    secondary: document.getElementById('attributeSecondary').value,
    tertiary: document.getElementById('attributeTertiary').value
  };
  settings.abilityPriorities = {
    primary: document.getElementById('abilityPrimary').value,
    secondary: document.getElementById('abilitySecondary').value,
    tertiary: document.getElementById('abilityTertiary').value
  };
}

function bindPriorityControls() {
  document.querySelectorAll('[data-priority-kind]').forEach(select => {
    select.addEventListener('change', () => {
      normalizePrioritySelects(select.dataset.priorityKind, select);
      syncPriorityState();
      setFreebies(Math.max(0, 15 - creationFreebieSpend()));
      renderCreationSummary();
      updateAllDotCosts();
    });
  });
}

function renderCreationSummary() {
  const summary = document.getElementById('creationSummary');
  if (!summary) return;

  if (!creationMode) {
    summary.innerHTML = '';
    return;
  }

  const attrRows = Object.keys(creationGroups.attributes).map(group => `${group}: ${spentInPriorityPool(creationGroups.attributes[group][0])}/${priorityBudget('attributes', group)}`);
  const abilityRows = Object.keys(creationGroups.abilities).map(group => `${group}: ${spentInPriorityPool(creationGroups.abilities[group][0])}/${priorityBudget('abilities', group)}`);
  const lineageBonus = Object.keys(state.creation?.lineageSphereBonus || {}).length ? '<span>Linhagem aplicada</span>' : '';
  summary.innerHTML = `
    <span>Freebies: ${freebies()}</span>
    <span>Atributos ${attrRows.join(' · ')}</span>
    <span>Habilidades ${abilityRows.join(' · ')}</span>
    <span>Backgrounds ${sumPaths(backgroundPaths)}/7</span>
    <span>Arcana + Esferas + FV ${arcanaSpherePoolSpent()}/6</span>
    ${lineageBonus}
  `;
  updateLineageSphereBonusButton();
}

function setCreationMode(enabled) {
  creationMode = enabled;
  creationSettings().mode = enabled;
  document.getElementById('creationPanel').hidden = !enabled;
  document.getElementById('resourceLabel').textContent = enabled ? 'Freebies' : 'Experiência';
  const resourceInput = document.getElementById('experienceInput');
  if (resourceInput) {
    resourceInput.max = enabled ? '15' : '';
    resourceInput.min = '0';
  }
  populatePriorityControls();
  setLevelEditing(enabled);
  renderCreationSummary();
}

function startNewCharacter() {
  clearAiPreview();
  clearState();
  clearLineageState();
  pendingCharacterImage = null;
  pendingCharacterImageRemovalPath = '';
  currentSheetAssetBaseUrl = 'fichas';
  currentSheetFile = '';
  state.creation = {
    mode: true,
    attributePriorities: { ...creationDefaults.attributePriorities },
    abilityPriorities: { ...creationDefaults.abilityPriorities }
  };
  dotPaths().forEach(path => setPath(state, path, 0));
  Object.values(creationGroups.attributes).flat().forEach(path => setPath(state, path, 1));
  setPath(state, 'advantages.arcana', 1);
  setPath(state, 'identity.experience', 15);
  setPath(state, 'health.damage', []);
  setPath(state, 'health.level', healthLevels[0].value);
  addLineageMember(false);
  setCreationMode(true);
  renderFields();
  renderLineage();
  closeStartModal();
}

async function loadGitSheetList() {
  const list = document.getElementById('gitSheetList');
  list.innerHTML = '';
  setStartModalStatus('Carregando fichas do GitHub...');

  try {
    const response = await fetch(`${githubRawBase}/fichas/index.json?v=${Date.now()}`);
    if (!response.ok) throw new Error('manifest');
    const entries = (await response.json()).map(normalizeSheetEntry).filter(entry => entry.file);
    entries.forEach(entry => {
      const button = document.createElement('button');
      const name = document.createElement('span');
      const file = document.createElement('small');
      button.type = 'button';
      button.className = 'sheet-list-btn';
      name.textContent = entry.name;
      file.textContent = entry.file;
      button.append(name, file);
      button.addEventListener('click', () => loadSheetFromGithub(entry.file));
      list.appendChild(button);
    });
    setStartModalStatus(entries.length ? '' : 'Nenhuma ficha encontrada no GitHub.');
  } catch (err) {
    setStartModalStatus('Não foi possível carregar as fichas do GitHub.');
  }
}

async function loadSheetFromGithub(fileName) {
  setStartModalStatus('Carregando ficha...');
  try {
    const url = `${githubRawBase}/fichas/${fileName.split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('sheet');
    const data = await response.json();
    console.log('[github load] Ficha carregada', {
      fileName,
      url,
      data
    });
    applySheetData(data, fileName, `${githubRawBase}/fichas`);
    await loadLineageFromGithub();
    closeStartModal();
  } catch (err) {
    setStartModalStatus('Não foi possível carregar essa ficha.');
  }
}

async function loadLocalSheet(file) {
  if (!file) return;
  try {
    applySheetData(JSON.parse(await file.text()), file.name, 'fichas');
    closeStartModal();
  } catch (err) {
    setStartModalStatus('Arquivo JSON inválido.');
  }
}
