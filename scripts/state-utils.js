function setPath(obj, path, value) {
  const keys = path.split('.');
  let ref = obj;
  keys.slice(0, -1).forEach(k => ref = ref[k] ??= {});
  ref[keys.at(-1)] = value;
}
function getPath(obj, path, fallback = '') {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback;
}

function hasPath(obj, path) {
  const keys = path.split('.');
  let ref = obj;
  for (const key of keys) {
    if (!ref || !Object.prototype.hasOwnProperty.call(ref, key)) return false;
    ref = ref[key];
  }
  return true;
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function effectiveValue(path, fallback = '') {
  if (aiPreviewState && hasPath(aiPreviewState, path)) {
    return getPath(aiPreviewState, path, fallback);
  }
  return getPath(state, path, fallback);
}

function hasAiSuggestion(path) {
  return Boolean(aiPreviewState && hasPath(aiPreviewState, path));
}

function isAiSuggestionChanged(path) {
  if (!hasAiSuggestion(path)) return false;
  return JSON.stringify(getPath(aiPreviewState, path, null)) !== JSON.stringify(getPath(state, path, null));
}

function pathGroup(path, groups) {
  return Object.entries(groups).find(([, paths]) => paths.includes(path))?.[0] || '';
}

function dotPaths() {
  return Array.from(document.querySelectorAll('[data-dots]')).map(container => container.dataset.dots);
}

function sumPaths(paths) {
  return paths.reduce((total, path) => total + Number(getPath(state, path, 0)), 0);
}

function creationSettings() {
  state.creation ??= {
    mode: false,
    attributePriorities: { ...creationDefaults.attributePriorities },
    abilityPriorities: { ...creationDefaults.abilityPriorities }
  };
  state.creation.attributePriorities ??= { ...creationDefaults.attributePriorities };
  state.creation.abilityPriorities ??= { ...creationDefaults.abilityPriorities };
  return state.creation;
}

function priorityBudget(kind, group) {
  const key = kind === 'attributes' ? 'attributePriorities' : 'abilityPriorities';
  const priorities = creationSettings()[key];
  const rank = Object.entries(priorities).find(([, value]) => value === group)?.[0];
  return rank ? creationPriorities[kind][rank] : 0;
}

function spentInPriorityPool(path) {
  if (path.startsWith('attributes.')) {
    const group = pathGroup(path, creationGroups.attributes);
    const paths = creationGroups.attributes[group] || [];
    return Math.max(0, sumPaths(paths) - paths.length);
  }
  if (path.startsWith('abilities.')) {
    const group = pathGroup(path, creationGroups.abilities);
    return sumPaths(creationGroups.abilities[group] || []);
  }
  return 0;
}

function priorityPoolRemaining(path) {
  if (path.startsWith('attributes.')) {
    const group = pathGroup(path, creationGroups.attributes);
    return Math.max(0, priorityBudget('attributes', group) - spentInPriorityPool(path));
  }
  if (path.startsWith('abilities.')) {
    const group = pathGroup(path, creationGroups.abilities);
    return Math.max(0, priorityBudget('abilities', group) - spentInPriorityPool(path));
  }
  return 0;
}

function lineageSphereBonusPoints(path) {
  const key = path.split('.')[1];
  return Math.max(0, Number(state.creation?.lineageSphereBonus?.[key]?.points || 0));
}

function creationSpherePoolValue(path, overrides = {}) {
  const raw = Number(Object.prototype.hasOwnProperty.call(overrides, path) ? overrides[path] : getPath(state, path, 0));
  return Math.max(0, raw - lineageSphereBonusPoints(path));
}

function arcanaSpherePoolSpent(overrides = {}) {
  const arcana = Number(Object.prototype.hasOwnProperty.call(overrides, 'advantages.arcana') ? overrides['advantages.arcana'] : getPath(state, 'advantages.arcana', 1));
  const willpower = Number(Object.prototype.hasOwnProperty.call(overrides, 'advantages.willpower') ? overrides['advantages.willpower'] : getPath(state, 'advantages.willpower', 0));
  return Math.max(0, arcana - 1) + spherePaths.reduce((sum, path) => sum + creationSpherePoolValue(path, overrides), 0) + willpower;
}

function arcanaSpherePoolRemaining() {
  return Math.max(0, 6 - arcanaSpherePoolSpent());
}

function backgroundPoolRemaining() {
  return Math.max(0, 7 - sumPaths(backgroundPaths));
}

function creationCostFor(path) {
  if (path.startsWith('attributes.')) return creationCosts.attributes;
  if (path.startsWith('abilities.')) return creationCosts.abilities;
  if (path.startsWith('backgrounds.')) return creationCosts.backgrounds;
  if (path.startsWith('spheres.')) return creationCosts.spheres;
  return creationCosts[path] || 0;
}

function creationFreebieSpend(overrides = {}) {
  const valueOf = path => Number(Object.prototype.hasOwnProperty.call(overrides, path) ? overrides[path] : getPath(state, path, 0));
  let total = 0;

  Object.entries(creationGroups.attributes).forEach(([group, paths]) => {
    const extra = paths.reduce((sum, path) => sum + Math.max(0, valueOf(path) - 1), 0);
    total += Math.max(0, extra - priorityBudget('attributes', group)) * creationCosts.attributes;
  });

  Object.entries(creationGroups.abilities).forEach(([group, paths]) => {
    const withinLimit = paths.reduce((sum, path) => sum + Math.min(valueOf(path), 3), 0);
    const overLimit = paths.reduce((sum, path) => sum + Math.max(0, valueOf(path) - 3), 0);
    total += Math.max(0, withinLimit - priorityBudget('abilities', group)) * creationCosts.abilities;
    total += overLimit * creationCosts.abilities;
  });

  total += Math.max(0, backgroundPaths.reduce((sum, path) => sum + valueOf(path), 0) - 7) * creationCosts.backgrounds;

  const arcana = valueOf('advantages.arcana');
  const sharedPoolItems = [];
  for (let level = 2; level <= arcana; level++) {
    sharedPoolItems.push(level <= 3 ? creationCosts['advantages.arcana'] : creationCosts['advantages.arcana']);
  }
  spherePaths.forEach(path => {
    for (let i = 0; i < creationSpherePoolValue(path, overrides); i++) sharedPoolItems.push(creationCosts.spheres);
  });
  for (let i = 0; i < valueOf('advantages.willpower'); i++) sharedPoolItems.push(creationCosts['advantages.willpower']);
  sharedPoolItems.sort((a, b) => b - a);
  total += sharedPoolItems.slice(6).reduce((sum, cost) => sum + cost, 0);

  return total;
}

function creationLevelLimit(path) {
  if (path.startsWith('spheres.')) return Number(getPath(state, 'advantages.arcana', 1));
  return Number(document.querySelector(`[data-dots="${path}"]`)?.dataset.max || 5);
}

function canSetCreationLevel(path, target) {
  if (!creationMode) return true;
  if (target > creationLevelLimit(path)) return false;
  if (path === 'advantages.arcana') {
    return target >= Math.max(0, ...spherePaths.map(spherePath => creationSpherePoolValue(spherePath)));
  }
  return true;
}

function freebies() {
  return Number(getPath(state, 'identity.experience', 0)) || 0;
}

function setFreebies(value) {
  setExperience(Math.min(15, Math.max(0, value)));
}

function xpMultiplierFor(path) {
  if (path.startsWith('attributes.')) return xpMultipliers.attributes;
  if (path.startsWith('abilities.')) return xpMultipliers.abilities;
  if (path.startsWith('backgrounds.')) return xpMultipliers.backgrounds;
  if (path.startsWith('spheres.')) return xpMultipliers.spheres;
  return xpMultipliers[path] || 0;
}

function isDotSectionEditable(container) {
  return levelEditMode && Boolean(xpMultiplierFor(container.dataset.dots));
}

function levelChangeCost(path, current, target) {
  const multiplier = xpMultiplierFor(path);
  let total = 0;

  if (!multiplier || current === target) return 0;

  if (target > current) {
    for (let level = current + 1; level <= target; level++) total += multiplier * level;
    return total;
  }

  for (let level = target + 1; level <= current; level++) total += multiplier * level;
  return -total;
}

function sphereNextLevelCost(currentLevel) {
  return xpMultiplierFor('spheres.fate') * (currentLevel + 1);
}

function creationLevelChangeCost(path, current, target) {
  if (current === target) return 0;
  return creationFreebieSpend({ [path]: target }) - creationFreebieSpend();
}

function dotChangeCost(path, current, target) {
  return creationMode ? creationLevelChangeCost(path, current, target) : levelChangeCost(path, current, target);
}

function currentExperience() {
  return Number(getPath(state, 'identity.experience', 0)) || 0;
}

function setExperienceError(message = '') {
  const input = document.getElementById('experienceInput');
  if (!input) return;

  input.setCustomValidity(message);
  if (message) {
    input.reportValidity();
    input.focus();
  }
}

function setExperience(value) {
  const next = Math.max(0, Number(value) || 0);
  setPath(state, 'identity.experience', next);
  const input = document.getElementById('experienceInput');
  if (input) input.value = next;
  setExperienceError('');
}

function setDotCost(container, target = null) {
  const cost = container.querySelector('.xp-cost');
  if (!cost) return;

  if (aiPreviewState || !levelEditMode || !xpMultiplierFor(container.dataset.dots)) {
    cost.textContent = '';
    return;
  }

  const current = Number(getPath(state, container.dataset.dots, 0));
  const max = Number(container.dataset.max || 5);
  const nextTarget = target ?? Math.min(current + 1, max);
  if (creationMode && !canSetCreationLevel(container.dataset.dots, nextTarget)) {
    cost.textContent = 'atingiu o limite por agora :)';
    return;
  }
  const value = dotChangeCost(container.dataset.dots, current, nextTarget);
  const unit = creationMode ? 'FB' : 'XP';

  if (value > 0) {
    cost.textContent = `${value} ${unit}`;
  } else if (value < 0) {
    cost.textContent = `+${Math.abs(value)} ${unit}`;
  } else {
    cost.textContent = current >= max ? 'max' : `0 ${unit}`;
  }
}

function updateAllDotCosts() {
  document.querySelectorAll('[data-dots]').forEach(container => setDotCost(container));
}

function lineageHasSphereExperience() {
  return spherePaths.some(path => lineageSphereXp(path.split('.')[1]) >= sphereNextLevelCost(0));
}

function hasAppliedLineageSphereBonus(path) {
  return Boolean(state.creation?.lineageSphereBonus?.[path.split('.')[1]]);
}

function pendingLineageSphereBonusPaths() {
  return spherePaths.filter(path => lineageSphereXp(path.split('.')[1]) >= sphereNextLevelCost(0) && !hasAppliedLineageSphereBonus(path));
}

function canApplyLineageSphereBonus() {
  return creationMode
    && arcanaSpherePoolSpent() >= 6
    && freebies() === 0
    && Boolean(lineageName())
    && pendingLineageSphereBonusPaths().length > 0;
}

function setLineageBonusStatus(message = '') {
  const status = document.getElementById('lineageBonusStatus');
  if (status) status.textContent = message;
}

function updateLineageSphereBonusButton() {
  const button = document.getElementById('applyLineageSphereBonusBtn');
  if (!button) return;
  button.hidden = !creationMode;
  if (!creationMode) {
    button.disabled = true;
    setLineageBonusStatus('');
    return;
  }
  const enabled = canApplyLineageSphereBonus();
  button.disabled = !enabled;
  button.title = !pendingLineageSphereBonusPaths().length && lineageHasSphereExperience()
    ? 'Bônus de linhagem já aplicado'
    : enabled
      ? 'Aplicar níveis inteiros compráveis pela experiência da linhagem'
      : 'Disponível após concluir a distribuição inicial, gastar os freebies e carregar uma linhagem com experiência';
}
