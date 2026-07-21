function normalizeCovenData(data = {}) {
  const pantry = Array.from({ length: 16 }, (_, slot) => {
    const item = Array.isArray(data.pantry) ? data.pantry[slot] : null;
    if (!item || typeof item !== 'object') return null;
    return {
      id: String(item.id || `item-${slot + 1}`),
      name: String(item.name || ''),
      description: String(item.description || ''),
      image: String(item.image || '')
    };
  });
  return {
    name: typeof data.name === 'string' ? data.name : '',
    quintessence: Math.max(0, Number(data.quintessence) || 0),
    paradox: Math.max(0, Number(data.paradox) || 0),
    obolOfTheDead: Math.max(0, Number(data.obolOfTheDead) || 0),
    fame: Math.min(6, Math.max(0, Number(data.fame) || 0)),
    lab: typeof data.lab === 'string' ? data.lab : '',
    pantry,
    lock: data.lock && typeof data.lock === 'object' ? { ...data.lock } : null
  };
}

function covenItemImageSource(item) {
  if (!item) return '';
  if (pendingCovenItemImages[item.id]?.dataUrl) return pendingCovenItemImages[item.id].dataUrl;
  if (!item.image) return '';
  const baseUrl = githubLoadedSheetSource?.sheetsBaseUrl || currentSheetAssetBaseUrl || 'fichas';
  return assetUrl(baseUrl, item.image);
}

function renderCovenPantry() {
  const grid = document.getElementById('covenPantryGrid');
  if (!grid) return;
  grid.replaceChildren();
  covenState.pantry.forEach((item, slot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'coven-pantry-slot';
    button.dataset.covenPantrySlot = slot;
    button.setAttribute('aria-label', item ? `Abrir item ${item.name}` : `Espaço ${slot + 1} vazio`);
    button.disabled = !item && !covenEditMode;
    if (item) {
      button.classList.add('has-item');
      const source = covenItemImageSource(item);
      if (source) {
        const image = document.createElement('img');
        image.src = source;
        image.alt = '';
        button.appendChild(image);
      }
      const name = document.createElement('span');
      name.textContent = item.name;
      button.appendChild(name);
    } else {
      const empty = document.createElement('span');
      empty.className = 'coven-pantry-empty';
      empty.textContent = '+';
      button.appendChild(empty);
    }
    button.addEventListener('click', () => openCovenItemModal(slot));
    grid.appendChild(button);
  });
}

function covenJson() {
  return JSON.stringify(normalizeCovenData(covenState), null, 2);
}

function covenLockIsActive(lock = covenState.lock, now = Date.now()) {
  if (!lock?.expiresAt) return false;
  const expiresAt = Date.parse(lock.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt > now;
}

function covenLockBelongsToSession(lock = covenState.lock) {
  return covenLockIsActive(lock) && lock.sessionId === covenEditorSessionId;
}

function covenGithubPath(auth) {
  return joinGitHubPath(auth.sheetsPath, covenFileName);
}

async function fetchCovenFromGithub(auth = null) {
  if (auth) {
    const file = await getGitHubFile(auth.repo, auth.branch, covenGithubPath(auth), auth.token);
    return {
      file,
      data: file?.content ? normalizeCovenData(JSON.parse(base64ToText(file.content))) : normalizeCovenData()
    };
  }
  const baseUrl = githubLoadedSheetSource?.sheetsBaseUrl || `${githubRawBase}/fichas`;
  const response = await fetch(githubRawFileUrl(baseUrl, covenFileName), { cache: 'no-store' });
  if (!response.ok) return { file: null, data: normalizeCovenData() };
  return { file: null, data: normalizeCovenData(await response.json()) };
}

function replaceCovenState(data) {
  const normalized = normalizeCovenData(data);
  Object.keys(covenState).forEach(key => delete covenState[key]);
  Object.assign(covenState, normalized);
}

function setCovenStatus(message = '', isError = false) {
  const status = document.getElementById('covenLockStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error', isError);
}

function renderCoven() {
  document.querySelectorAll('[data-coven-field]').forEach(control => {
    control.value = covenState[control.dataset.covenField] ?? '';
    control.disabled = !covenEditMode;
  });
  document.querySelectorAll('[data-coven-stepper]').forEach(button => {
    const value = Number(covenState[button.dataset.covenTarget]) || 0;
    const removalUnits = button.dataset.covenTarget === 'paradox' ? 2 : 1;
    const unavailableRemoval = button.dataset.covenStepper === 'down' && value < removalUnits;
    button.disabled = !covenEditMode || unavailableRemoval;
  });
  renderCovenFameDescription();
  const editButton = document.getElementById('covenEditBtn');
  if (editButton) {
    editButton.setAttribute('aria-label', covenEditMode ? 'Concluir edição do coven' : 'Editar coven');
    editButton.title = covenEditMode ? 'Concluir edição do coven' : 'Editar coven';
    editButton.classList.toggle('active', covenEditMode);
  }
  renderCovenPantry();
}

function renderCovenFameDescription() {
  const selected = covenFameLevels.find(item => item.level === Number(covenState.fame)) || covenFameLevels[0];
  const description = document.getElementById('covenFameDescription');
  const select = document.querySelector('[data-coven-field="fame"]');
  if (description) description.textContent = selected.description;
  if (select) select.title = `${selected.classification}: ${selected.description}`;
}

function setCovenItemModalStatus(message = '', isError = false) {
  const status = document.getElementById('covenItemModalStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error', isError);
}

function renderCovenItemModalImage(item) {
  const preview = document.getElementById('covenItemImagePreview');
  const placeholder = document.getElementById('covenItemImagePlaceholder');
  const source = covenItemImageSource(item);
  preview.hidden = !source;
  placeholder.hidden = Boolean(source);
  if (source) preview.src = source;
  else preview.removeAttribute('src');
}

function openCovenItemModal(slot) {
  const item = covenState.pantry[slot];
  if (!item && !covenEditMode) return;
  activeCovenPantrySlot = slot;
  activeCovenItemImageDraft = null;
  const editable = covenEditMode;
  document.getElementById('covenItemModalTitle').textContent = item ? item.name || 'Item da dispensa' : 'Adicionar item à dispensa';
  document.getElementById('covenItemName').value = item?.name || '';
  document.getElementById('covenItemDescription').value = item?.description || '';
  document.getElementById('covenItemName').disabled = !editable;
  document.getElementById('covenItemDescription').disabled = !editable;
  document.getElementById('covenItemImageInput').disabled = !editable;
  document.getElementById('covenItemImagePicker').classList.toggle('is-readonly', !editable);
  document.getElementById('covenItemEditActions').hidden = !editable;
  document.getElementById('covenItemImageInput').value = '';
  setCovenItemModalStatus('');
  renderCovenItemModalImage(item);
  document.getElementById('covenItemModal').hidden = false;
}

function closeCovenItemModal() {
  if (activeCovenItemImageDraft) delete pendingCovenItemImages[activeCovenItemImageDraft.id];
  activeCovenPantrySlot = null;
  activeCovenItemImageDraft = null;
  document.getElementById('covenItemModal').hidden = true;
}

function covenItemId(slot) {
  return covenState.pantry[slot]?.id || `item-${Date.now()}-${slot + 1}`;
}

function covenItemImagePath(itemId, extension = 'png') {
  return `imagens/coven/${snakeCase(itemId)}.${extension}`;
}

async function handleCovenItemImage(file) {
  if (!file || activeCovenPantrySlot === null) return;
  if (!file.type.startsWith('image/')) {
    setCovenItemModalStatus('Selecione um arquivo de imagem.', true);
    return;
  }
  try {
    const dataUrl = await cropImageFileToSquareDataUrl(file);
    const id = covenItemId(activeCovenPantrySlot);
    const extension = imageExtensionFromMime(dataUrlMime(dataUrl));
    pendingCovenItemImages[id] = { dataUrl, extension };
    const existing = covenState.pantry[activeCovenPantrySlot] || { id, name: '', description: '', image: '' };
    activeCovenItemImageDraft = { id, image: covenItemImagePath(id, extension) };
    renderCovenItemModalImage({ ...existing, ...activeCovenItemImageDraft });
    setCovenItemModalStatus('Imagem pronta para upload ao salvar o coven.');
  } catch (err) {
    setCovenItemModalStatus('Não foi possível carregar essa imagem.', true);
  }
}

function saveCovenItem(event) {
  event.preventDefault();
  if (!covenEditMode || activeCovenPantrySlot === null) return;
  const slot = activeCovenPantrySlot;
  const existing = covenState.pantry[slot];
  const name = document.getElementById('covenItemName').value.trim();
  if (!name) return setCovenItemModalStatus('Informe o nome do item.', true);
  covenState.pantry[slot] = {
    id: activeCovenItemImageDraft?.id || existing?.id || covenItemId(slot),
    name,
    description: document.getElementById('covenItemDescription').value.trim(),
    image: activeCovenItemImageDraft?.image || existing?.image || ''
  };
  activeCovenItemImageDraft = null;
  closeCovenItemModal();
  renderCovenPantry();
}

async function uploadPendingCovenItemImages(auth) {
  for (const [itemId, pending] of Object.entries(pendingCovenItemImages)) {
    const item = covenState.pantry.find(candidate => candidate?.id === itemId);
    if (!item?.image) continue;
    const githubPath = joinGitHubPath(auth.sheetsPath, item.image);
    await upsertGitHubFileBase64(
      auth.repo,
      auth.branch,
      githubPath,
      dataUrlBase64(pending.dataUrl),
      `Atualiza imagem do item ${item.name || itemId} do coven`,
      auth.token
    );
    delete pendingCovenItemImages[itemId];
  }
}

function stopCovenEditing(message = '') {
  covenEditMode = false;
  window.clearTimeout(covenLockTimer);
  covenLockTimer = null;
  if (!document.getElementById('covenItemModal')?.hidden) closeCovenItemModal();
  renderCoven();
  setCovenStatus(message);
}

function scheduleCovenLockExpiry() {
  window.clearTimeout(covenLockTimer);
  const delay = Math.max(0, Date.parse(covenState.lock.expiresAt) - Date.now());
  covenLockTimer = window.setTimeout(() => {
    finishCovenEditing({ automatic: true, allowExpiredOwnLock: true });
  }, delay);
}

async function loadCoven(auth = null) {
  try {
    const { data } = await fetchCovenFromGithub(auth);
    if (!covenEditMode) replaceCovenState(data);
    renderCoven();
  } catch (err) {
    console.error('[coven] Não foi possível carregar o coven.', err);
    setCovenStatus('Não foi possível carregar o coven.', true);
  }
}

async function beginCovenEditing() {
  if (!autosaveAuth) {
    setCovenStatus('Ative o autosave com um envio ao GitHub antes de editar o coven.', true);
    return;
  }

  const button = document.getElementById('covenEditBtn');
  button.disabled = true;
  setCovenStatus('Verificando lock do coven...');
  try {
    const { file, data } = await fetchCovenFromGithub(autosaveAuth);
    if (covenLockIsActive(data.lock) && data.lock.sessionId !== covenEditorSessionId) {
      const owner = data.lock.owner ? ` por ${data.lock.owner}` : '';
      replaceCovenState(data);
      renderCoven();
      setCovenStatus(`Coven em edição${owner} até ${new Date(data.lock.expiresAt).toLocaleTimeString('pt-BR')}.`, true);
      return;
    }

    const acquiredAt = new Date();
    data.lock = {
      owner: autosaveAuth.user || autosaveAuth.repo.split('/')[0],
      sessionId: covenEditorSessionId,
      acquiredAt: acquiredAt.toISOString(),
      expiresAt: new Date(acquiredAt.getTime() + covenLockDurationMs).toISOString()
    };
    await putGitHubFile(
      autosaveAuth.repo,
      autosaveAuth.branch,
      covenGithubPath(autosaveAuth),
      JSON.stringify(data, null, 2),
      'Adquire lock de edição do coven',
      autosaveAuth.token,
      file?.sha || null
    );
    replaceCovenState(data);
    covenEditMode = true;
    scheduleCovenLockExpiry();
    renderCoven();
    setCovenStatus('Edição habilitada por até 10 minutos.');
  } catch (err) {
    console.error('[coven] Não foi possível adquirir o lock.', err);
    setCovenStatus('O lock não pôde ser adquirido; releia o coven e tente novamente.', true);
  } finally {
    button.disabled = false;
  }
}

async function finishCovenEditing({ automatic = false, allowExpiredOwnLock = false } = {}) {
  const button = document.getElementById('covenEditBtn');
  button.disabled = true;
  if (automatic) {
    covenEditMode = false;
    if (!document.getElementById('covenItemModal')?.hidden) closeCovenItemModal();
    renderCoven();
  }
  setCovenStatus(automatic
    ? 'Limite de 10 minutos atingido. Salvando o coven automaticamente...'
    : 'Salvando coven e removendo lock...');
  try {
    const { file, data } = await fetchCovenFromGithub(autosaveAuth);
    const ownsRemoteLock = data.lock?.sessionId === covenEditorSessionId
      && (covenLockIsActive(data.lock) || allowExpiredOwnLock);
    if (!ownsRemoteLock) {
      replaceCovenState(data);
      stopCovenEditing(automatic
        ? 'Edição pausada após 10 minutos. O lock mudou antes do salvamento automático; as alterações não foram enviadas.'
        : 'O lock expirou ou pertence a outra sessão; as alterações não foram enviadas.');
      return;
    }
    await uploadPendingCovenItemImages(autosaveAuth);
    const next = normalizeCovenData({ ...covenState, lock: null });
    await putGitHubFile(
      autosaveAuth.repo,
      autosaveAuth.branch,
      covenGithubPath(autosaveAuth),
      JSON.stringify(next, null, 2),
      'Atualiza coven e remove lock de edição',
      autosaveAuth.token,
      file.sha
    );
    replaceCovenState(next);
    stopCovenEditing(automatic
      ? 'Coven salvo automaticamente após 10 minutos. Edição pausada.'
      : 'Coven salvo.');
  } catch (err) {
    console.error('[coven] Não foi possível concluir a edição.', err);
    if (automatic) {
      stopCovenEditing('Edição pausada após 10 minutos, mas o salvamento automático falhou. Reabra a edição para tentar novamente.');
      setCovenStatus('Edição pausada após 10 minutos, mas o salvamento automático falhou. Reabra a edição para tentar novamente.', true);
    } else {
      setCovenStatus('Não foi possível salvar e remover o lock. Tente novamente antes da expiração.', true);
    }
  } finally {
    button.disabled = false;
  }
}

async function uploadCovenToGithub(auth, message = 'Autosave coven') {
  if (!covenEditMode || !covenLockBelongsToSession()) return '';
  const { file, data } = await fetchCovenFromGithub(auth);
  if (!covenLockBelongsToSession(data.lock)) {
    replaceCovenState(data);
    stopCovenEditing('O lock do coven não está mais ativo; alterações não enviadas.');
    return '';
  }
  covenState.lock = data.lock;
  await uploadPendingCovenItemImages(auth);
  await putGitHubFile(auth.repo, auth.branch, covenGithubPath(auth), covenJson(), message, auth.token, file.sha);
  return covenGithubPath(auth);
}

function bindCoven() {
  document.querySelectorAll('[data-coven-field]').forEach(control => {
    control.addEventListener('input', event => {
      if (!covenEditMode) return renderCoven();
      const key = event.target.dataset.covenField;
      covenState[key] = event.target.type === 'number' || key === 'fame' ? Number(event.target.value || 0) : event.target.value;
      if (key === 'fame') renderCovenFameDescription();
    });
  });
  document.querySelectorAll('[data-coven-stepper]').forEach(button => {
    button.addEventListener('click', () => {
      if (!covenEditMode) return;
      if (button.dataset.covenTarget === 'quintessence' || button.dataset.covenTarget === 'paradox') {
        transferCharacterResourceToCoven(button.dataset.covenTarget, button.dataset.covenStepper === 'up' ? 1 : -1);
        return;
      }
      const input = document.querySelector(`[data-coven-field="${button.dataset.covenTarget}"]`);
      const direction = button.dataset.covenStepper === 'up' ? 1 : -1;
      input.value = Math.min(Number(input.max), Math.max(Number(input.min), Number(input.value || 0) + direction));
      input.dispatchEvent(new Event('input', { bubbles: true }));
      renderCoven();
    });
  });
  document.getElementById('covenEditBtn')?.addEventListener('click', () => {
    if (covenEditMode) finishCovenEditing();
    else beginCovenEditing();
  });
  document.getElementById('closeCovenItemModal')?.addEventListener('click', closeCovenItemModal);
  document.getElementById('covenItemModal')?.addEventListener('click', event => {
    if (event.target.id === 'covenItemModal') closeCovenItemModal();
  });
  document.getElementById('covenItemForm')?.addEventListener('submit', saveCovenItem);
  document.getElementById('covenItemImageInput')?.addEventListener('change', event => handleCovenItemImage(event.target.files?.[0]));
  renderCoven();
}

function transferCharacterResourceToCoven(resource, direction) {
  const characterPath = `advantages.${resource}`;
  const characterValue = Number(getPath(state, characterPath, 0)) || 0;
  const covenValue = Number(covenState[resource]) || 0;
  const characterUnits = resource === 'quintessence' ? 2 : 1;
  const covenUnits = resource === 'quintessence' ? 1 : 2;

  if (direction > 0) {
    if (characterValue < characterUnits) {
      setCovenStatus(resource === 'quintessence'
        ? 'O personagem precisa de 2 pontos de Quintessência para transferir 1 ao coven.'
        : 'O personagem precisa de 1 ponto de Paradoxo para transferir 2 ao coven.', true);
      return;
    }
    setPath(state, characterPath, characterValue - characterUnits);
    covenState[resource] = covenValue + covenUnits;
  } else {
    if (covenValue < covenUnits) return;
    if (characterValue + characterUnits > 10) {
      setCovenStatus('O personagem não pode receber a devolução porque atingiria mais de 10 pontos.', true);
      return;
    }
    covenState[resource] = covenValue - covenUnits;
    setPath(state, characterPath, characterValue + characterUnits);
  }

  setCovenStatus('');
  renderFields();
  renderCoven();
}
