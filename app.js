const state = {};
const healthLevels = [
  { value: 'healthy', label: 'Saudável', dicePenalty: 0 },
  { value: 'bruised', label: 'Escoriado', dicePenalty: 0 },
  { value: 'hurt', label: 'Machucado', dicePenalty: 1 },
  { value: 'injured', label: 'Ferido', dicePenalty: 1 },
  { value: 'wounded', label: 'Ferido gravemente', dicePenalty: 2 },
  { value: 'mauled', label: 'Espancado', dicePenalty: 2 },
  { value: 'crippled', label: 'Aleijado', dicePenalty: 5 },
  { value: 'incapacitated', label: 'Incapacitado', blocked: true }
];
const fieldDescriptions = {
  'attributes.strength': 'Força física bruta, usada para levantar, empurrar, quebrar e causar dano corporal.',
  'attributes.dexterity': 'Coordenação, precisão e reflexos em ações físicas.',
  'attributes.stamina': 'Resistência física, vigor e capacidade de suportar esforço ou dano.',
  'attributes.charisma': 'Capacidade de inspirar, atrair e conquistar pessoas.',
  'attributes.manipulation': 'Habilidade de influenciar, enganar ou persuadir indiretamente.',
  'attributes.appearance': 'Atratividade física e impacto causado pela presença visual.',
  'attributes.perception': 'Capacidade de notar detalhes, pistas e mudanças no ambiente.',
  'attributes.intelligence': 'Raciocínio lógico, aprendizado e compreensão de conceitos.',
  'attributes.wits': 'Pensamento rápido, improvisação e reação imediata.',

  'abilities.alertness': 'Perceber perigos, sons, movimentos e eventos inesperados.',
  'abilities.athletics': 'Corrida, salto, escalada e desempenho físico geral.',
  'abilities.awareness': 'Sensibilidade a fenômenos sutis, mágicos ou espirituais.',
  'abilities.brawl': 'Combate corpo a corpo sem armas.',
  'abilities.empathy': 'Entender emoções, intenções e estados mentais alheios.',
  'abilities.expression': 'Comunicar ideias por fala, escrita ou arte.',
  'abilities.intimidation': 'Impor medo, pressão ou respeito sobre outros.',
  'abilities.leadership': 'Comandar, coordenar e motivar grupos.',
  'abilities.streetwise': 'Conhecimento das ruas, contatos e submundo urbano.',
  'abilities.subterfuge': 'Mentir, blefar, disfarçar e ocultar intenções.',

  'abilities.crafts': 'Criar, reparar ou modificar objetos manualmente.',
  'abilities.drive': 'Conduzir veículos terrestres com segurança ou habilidade.',
  'abilities.etiquette': 'Conhecer normas sociais e agir adequadamente.',
  'abilities.firearms': 'Usar armas de fogo com precisão.',
  'abilities.meditation': 'Controlar a mente, focar e alcançar estados contemplativos.',
  'abilities.melee': 'Lutar com armas brancas ou improvisadas.',
  'abilities.research': 'Encontrar e analisar informações em fontes diversas.',
  'abilities.stealth': 'Mover-se sem ser percebido ou deixar rastros.',
  'abilities.survival': 'Sobreviver em ambientes hostis e encontrar recursos.',
  'abilities.technology': 'Operar, entender e reparar equipamentos tecnológicos.',

  'abilities.academics': 'Conhecimento formal de história, literatura e humanidades.',
  'abilities.computer': 'Uso avançado de computadores e sistemas digitais.',
  'abilities.cosmology': 'Conhecimento da estrutura mística do universo e dimensões.',
  'abilities.enigmas': 'Resolver mistérios, padrões, códigos e paradoxos.',
  'abilities.esoterica': 'Conhecimento de tradições ocultas e saberes raros.',
  'abilities.investigation': 'Analisar evidências e reconstruir acontecimentos.',
  'abilities.law': 'Conhecimento de leis, normas e sistemas jurídicos.',
  'abilities.medicine': 'Diagnosticar, tratar ferimentos e doenças.',
  'abilities.occult': 'Conhecimento de magia, sobrenatural e práticas ocultistas.',
  'abilities.science': 'Aplicação do método científico e ciências naturais.',

  'spheres.fate': 'Probabilidade, sorte, destino e coincidências.',
  'spheres.space': 'Distância, localização, conexões e teletransporte.',
  'spheres.spirit': 'Espíritos, Umbra e fenômenos espirituais.',
  'spheres.forces': 'Energia, fogo, eletricidade, luz, som e calor.',
  'spheres.matter': 'Matéria inanimada, transformação e transmutação.',
  'spheres.mind': 'Pensamentos, emoções, memória e consciência.',
  'spheres.death': 'Morte, fantasmas, decadência e energia entrópica.',
  'spheres.prime': 'Essência mágica, Quintessence e energia primordial.',
  'spheres.time': 'Passado, futuro, duração e fluxo temporal.',
  'spheres.life': 'Organismos vivos, cura, mutação e biologia.',

  'advantages.arete': 'Capacidade de impor vontade à realidade e realizar magia.',
  'advantages.willpower': 'Determinação mental usada para resistir ou superar desafios.',
  'advantages.quintessence': 'Energia mágica primordial usada para alimentar efeitos.',
  'advantages.paradox': 'Acúmulo da reação da realidade contra magia impossível.',
  'backgrounds.avatar': 'Ligação com seu Avatar.',
  'backgrounds.arcane': 'Dificuldade de ser notado.',
  'backgrounds.contacts': 'Informantes e pessoas que sabem coisas.',
  'backgrounds.destiny': 'Destino importante ligado ao personagem.',
  'backgrounds.dream': 'Fonte de inspiração, visões e orientação.',
  'backgrounds.influence': 'Poder político, social ou institucional.',
  'backgrounds.library': 'Biblioteca mundana ou mágica.',
  'backgrounds.mentor': 'Professor, mestre ou guia.',
  'backgrounds.node': 'Fonte de Quintessência.',
  'backgrounds.resources': 'Dinheiro, bens e acesso material.',
  'backgrounds.wonder': 'Item mágico ou maravilha desperta.'
};
const sphereSymbols = {
  'spheres.fate': '✦',
  'spheres.space': '⌖',
  'spheres.spirit': '☾',
  'spheres.forces': '☀︎',
  'spheres.matter': '■',
  'spheres.mind': '☿',
  'spheres.death': '☠︎',
  'spheres.prime': '✶',
  'spheres.time': '◴',
  'spheres.life': '✚'
};
const xpMultipliers = {
  attributes: 4,
  abilities: 2,
  backgrounds: 1,
  spheres: 7,
  'advantages.arete': 8,
  'advantages.willpower': 1
};
const creationCosts = {
  attributes: 5,
  abilities: 2,
  backgrounds: 1,
  spheres: 7,
  'advantages.arete': 4,
  'advantages.willpower': 1
};
const creationGroups = {
  attributes: {
    physical: ['attributes.strength', 'attributes.dexterity', 'attributes.stamina'],
    social: ['attributes.charisma', 'attributes.manipulation', 'attributes.appearance'],
    mental: ['attributes.perception', 'attributes.intelligence', 'attributes.wits']
  },
  abilities: {
    talents: ['abilities.alertness', 'abilities.athletics', 'abilities.awareness', 'abilities.brawl', 'abilities.empathy', 'abilities.expression', 'abilities.intimidation', 'abilities.leadership', 'abilities.streetwise', 'abilities.subterfuge'],
    skills: ['abilities.crafts', 'abilities.drive', 'abilities.etiquette', 'abilities.firearms', 'abilities.meditation', 'abilities.melee', 'abilities.research', 'abilities.stealth', 'abilities.survival', 'abilities.technology'],
    knowledges: ['abilities.academics', 'abilities.computer', 'abilities.cosmology', 'abilities.enigmas', 'abilities.esoterica', 'abilities.investigation', 'abilities.law', 'abilities.medicine', 'abilities.occult', 'abilities.science']
  }
};
const creationPriorities = {
  attributes: { primary: 7, secondary: 5, tertiary: 3 },
  abilities: { primary: 13, secondary: 9, tertiary: 5 }
};
const creationDefaults = {
  attributePriorities: { primary: 'physical', secondary: 'social', tertiary: 'mental' },
  abilityPriorities: { primary: 'talents', secondary: 'skills', tertiary: 'knowledges' }
};
const backgroundPaths = ['backgrounds.avatar', 'backgrounds.arcane', 'backgrounds.contacts', 'backgrounds.destiny', 'backgrounds.dream', 'backgrounds.influence', 'backgrounds.library', 'backgrounds.mentor', 'backgrounds.node', 'backgrounds.resources', 'backgrounds.wonder'];
const spherePaths = ['spheres.fate', 'spheres.space', 'spheres.spirit', 'spheres.forces', 'spheres.matter', 'spheres.mind', 'spheres.death', 'spheres.prime', 'spheres.time', 'spheres.life'];
const sheetsManifest = 'fichas/index.json';
const githubRawBase = 'https://raw.githubusercontent.com/uneluneravie/mage-ascension/main';
const sheetsHandleDbName = 'mage-ascension-sheets';
const sheetsHandleStoreName = 'handles';
const sheetsDirHandleKey = 'fichas';
const githubSettingsKey = 'mage-ascension-github-settings';
const defaultGithubRepo = 'uneluneravie/mage-ascension';
let currentSheetFile = '';
let sheetsDirHandle = null;
let levelEditMode = false;
let creationMode = false;

function setPath(obj, path, value) {
  const keys = path.split('.');
  let ref = obj;
  keys.slice(0, -1).forEach(k => ref = ref[k] ??= {});
  ref[keys.at(-1)] = value;
}
function getPath(obj, path, fallback = '') {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback;
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

function areteSpherePoolSpent() {
  return Math.max(0, Number(getPath(state, 'advantages.arete', 1)) - 1) + sumPaths(spherePaths) + Number(getPath(state, 'advantages.willpower', 0));
}

function areteSpherePoolRemaining() {
  return Math.max(0, 6 - areteSpherePoolSpent());
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

  const arete = valueOf('advantages.arete');
  const sharedPoolItems = [];
  for (let level = 2; level <= arete; level++) {
    sharedPoolItems.push(level <= 3 ? creationCosts['advantages.arete'] : creationCosts['advantages.arete']);
  }
  spherePaths.forEach(path => {
    for (let i = 0; i < valueOf(path); i++) sharedPoolItems.push(creationCosts.spheres);
  });
  for (let i = 0; i < valueOf('advantages.willpower'); i++) sharedPoolItems.push(creationCosts['advantages.willpower']);
  sharedPoolItems.sort((a, b) => b - a);
  total += sharedPoolItems.slice(6).reduce((sum, cost) => sum + cost, 0);

  return total;
}

function creationLevelLimit(path) {
  if (path.startsWith('spheres.')) return Number(getPath(state, 'advantages.arete', 1));
  return Number(document.querySelector(`[data-dots="${path}"]`)?.dataset.max || 5);
}

function canSetCreationLevel(path, target) {
  if (!creationMode) return true;
  if (target > creationLevelLimit(path)) return false;
  if (path === 'advantages.arete') {
    return target >= Math.max(0, ...spherePaths.map(spherePath => Number(getPath(state, spherePath, 0))));
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

  if (!levelEditMode || !xpMultiplierFor(container.dataset.dots)) {
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

function setLevelEditing(editable) {
  levelEditMode = editable;
  document.getElementById('sheet')?.classList.toggle('level-editing', editable);
  const button = document.getElementById('levelEditBtn');
  if (button) {
    button.classList.toggle('active', editable);
    button.title = editable ? 'Concluir edição de níveis' : 'Editar níveis';
    button.setAttribute('aria-label', button.title);
  }
  document.querySelectorAll('[data-dots]').forEach(container => {
    const editableDots = Boolean(xpMultiplierFor(container.dataset.dots));
    container.querySelectorAll('.dot').forEach(dot => {
      dot.disabled = !editable || !editableDots;
    });
    setDotCost(container);
  });
}

function makeDots(container) {
  const path = container.dataset.dots;
  const label = container.dataset.label;
  const max = Number(container.dataset.max || 5);
  const description = fieldDescriptions[path] || '';
  const symbol = sphereSymbols[path] || '';
  container.className = 'dot-row';
  container.innerHTML = '<span class="dot-label"></span><span class="xp-cost"></span><span class="dots"></span>';
  const labelElement = container.querySelector('.dot-label');
  if (symbol) {
    const symbolElement = document.createElement('span');
    symbolElement.className = 'sphere-symbol';
    symbolElement.textContent = symbol;
    labelElement.append(symbolElement, document.createTextNode(label));
  } else {
    labelElement.textContent = label;
  }
  if (description) {
    labelElement.title = description;
  }
  const dots = container.querySelector('.dots');
  for (let i = 1; i <= max; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.title = `${label}: ${i}`;
    dot.setAttribute('aria-label', `${label}: ${i}`);
    dot.addEventListener('mouseenter', () => {
      if (!isDotSectionEditable(container)) return;
      const current = Number(getPath(state, path, 0));
      const target = current === i ? Math.max(0, i - 1) : i;
      setDotCost(container, target);
    });
    dot.addEventListener('mouseleave', () => setDotCost(container));
    dot.addEventListener('click', () => {
      if (!isDotSectionEditable(container)) return;
      const current = Number(getPath(state, path, 0));
      const target = current === i ? Math.max(0, i - 1) : i;
      if (creationMode && !canSetCreationLevel(path, target)) return;
      const cost = dotChangeCost(path, current, target);
      const experience = currentExperience();

      if (cost > experience) {
        setExperienceError(creationMode ? 'Freebies insuficientes para aumentar esse nível.' : 'Experiência insuficiente para aumentar esse nível.');
        return;
      }

      setPath(state, path, target);
      if (creationMode) {
        setFreebies(experience - cost);
      } else {
        setExperience(experience - cost);
      }
      renderDots(container);
      renderCreationSummary();
      updateAllDotCosts();
    });
    dots.appendChild(dot);
  }
  renderDots(container);
}

function bindLevelEditor() {
  document.getElementById('levelEditBtn')?.addEventListener('click', () => {
    setLevelEditing(!levelEditMode);
  });
  setLevelEditing(false);
}

function renderDots(container) {
  const value = Number(getPath(state, container.dataset.dots, 0));
  container.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('filled', idx < value);
  });
  setDotCost(container);
}

function makeHealth() {
  const select = document.getElementById('healthLevel');
  select.innerHTML = '';
  healthLevels.forEach(level => {
    const option = document.createElement('option');
    option.value = level.value;
    option.textContent = level.label;
    select.appendChild(option);
  });
  select.addEventListener('change', updateHealthPenalty);
  updateHealthPenalty();
}

function updateHealthPenalty() {
  const level = getPath(state, 'health.level', healthLevels[0].value);
  const selected = healthLevels.find(item => item.value === level) || healthLevels[0];
  const penalty = document.getElementById('healthPenalty');

  if (selected.blocked) {
    penalty.textContent = 'impossibilitado';
    penalty.classList.add('is-blocked');
    return;
  }

  penalty.classList.remove('is-blocked');
  penalty.replaceChildren(
    document.createTextNode('↓ '),
    document.createElement('span'),
    document.createTextNode(' '),
    Object.assign(document.createElement('img'), {
      src: 'assets/dice.png',
      alt: 'dado',
      className: 'health-dice'
    })
  );
  penalty.querySelector('span').textContent = selected.dicePenalty;
}

function ensureHealthLevel() {
  if (!getPath(state, 'health.level', '')) {
    setPath(state, 'health.level', healthLevels[0].value);
  }
}

function bindFields() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const updateField = e => {
      let value = e.target.type === 'number' ? Number(e.target.value || e.target.dataset.numberDefault || 0) : e.target.value;
      if (creationMode && e.target.dataset.field === 'identity.experience') {
        value = Math.min(15, Math.max(0, value));
        e.target.value = value;
      }
      setPath(state, e.target.dataset.field, value);
      if (e.target.dataset.field === 'identity.name') {
        e.target.setCustomValidity('');
      }
      if (e.target.dataset.field === 'health.level') {
        updateHealthPenalty();
      }
      if (e.target.dataset.field === 'identity.experience') {
        setExperienceError('');
        updateAllDotCosts();
        renderCreationSummary();
      }
    };
    el.addEventListener('input', updateField);
    el.addEventListener('change', updateField);
  });
}

function bindNumberSteppers() {
  document.querySelectorAll('[data-stepper]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.querySelector(`[data-field="${button.dataset.target}"]`);
      if (!input) return;

      const min = input.min === '' ? -Infinity : Number(input.min);
      const max = input.max === '' ? Infinity : Number(input.max);
      const step = Number(input.step || 1);
      const direction = button.dataset.stepper === 'up' ? 1 : -1;
      const current = Number(input.value || input.dataset.numberDefault || 0);
      const next = Math.min(max, Math.max(min, current + direction * step));

      input.value = next;
      setPath(state, input.dataset.field, next);
    });
  });
}

function ensureNumberDefaults() {
  document.querySelectorAll('[data-number-default]').forEach(input => {
    if (getPath(state, input.dataset.field, '') === '') {
      setPath(state, input.dataset.field, Number(input.dataset.numberDefault));
    }
  });
}

function renderFields() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const fallback = el.dataset.field === 'health.level' ? healthLevels[0].value : el.dataset.numberDefault || '';
    el.value = getPath(state, el.dataset.field, fallback);
  });
  document.querySelectorAll('[data-dots]').forEach(renderDots);
  updateHealthPenalty();
  updateAllDotCosts();
  renderCreationSummary();
}

function clearState() {
  Object.keys(state).forEach(k => delete state[k]);
}

function characterName() {
  return getPath(state, 'identity.name', '').trim();
}

function sheetTitle() {
  return characterName();
}

function requireCharacterName(onError = () => {}) {
  const nameInput = document.querySelector('[data-field="identity.name"]');
  const message = 'Preencha o nome do personagem antes de salvar ou enviar.';

  if (characterName()) {
    nameInput?.setCustomValidity('');
    return true;
  }

  nameInput?.setCustomValidity(message);
  nameInput?.reportValidity();
  nameInput?.focus();
  onError(message);
  return false;
}

function snakeCase(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'mage_personagem';
}

function sheetFileName() {
  return `${snakeCase(sheetTitle())}.json`;
}

function sheetUrl(fileName) {
  return `fichas/${fileName.split('/').map(encodeURIComponent).join('/')}`;
}

function applySheetData(data, fileName = '') {
  clearState();
  Object.assign(state, data);
  currentSheetFile = fileName;
  setCreationMode(Boolean(data.creation?.mode));
  renderFields();
}

function normalizeSheetEntry(entry) {
  if (typeof entry === 'string') return { file: entry, name: entry.replace(/\.json$/i, '') };
  return {
    file: entry.file,
    name: entry.name || entry.title || entry.file?.replace(/\.json$/i, '')
  };
}

function setSheetModalStatus(message) {
  document.getElementById('sheetModalStatus').textContent = message;
}

function setGithubModalStatus(message) {
  document.getElementById('githubModalStatus').textContent = message;
}

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
    applySheetData(await response.json(), fileName);
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
  summary.innerHTML = `
    <span>Freebies: ${freebies()}</span>
    <span>Atributos ${attrRows.join(' · ')}</span>
    <span>Habilidades ${abilityRows.join(' · ')}</span>
    <span>Backgrounds ${sumPaths(backgroundPaths)}/7</span>
    <span>Arete + Esferas + FV ${areteSpherePoolSpent()}/6</span>
  `;
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
  clearState();
  currentSheetFile = '';
  state.creation = {
    mode: true,
    attributePriorities: { ...creationDefaults.attributePriorities },
    abilityPriorities: { ...creationDefaults.abilityPriorities }
  };
  dotPaths().forEach(path => setPath(state, path, 0));
  Object.values(creationGroups.attributes).flat().forEach(path => setPath(state, path, 1));
  setPath(state, 'advantages.arete', 1);
  setPath(state, 'identity.experience', 15);
  setPath(state, 'health.level', healthLevels[0].value);
  setCreationMode(true);
  renderFields();
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
    const response = await fetch(`${githubRawBase}/fichas/${fileName.split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`);
    if (!response.ok) throw new Error('sheet');
    applySheetData(await response.json(), fileName);
    closeStartModal();
  } catch (err) {
    setStartModalStatus('Não foi possível carregar essa ficha.');
  }
}

async function loadLocalSheet(file) {
  if (!file) return;
  try {
    applySheetData(JSON.parse(await file.text()), file.name);
    closeStartModal();
  } catch (err) {
    setStartModalStatus('Arquivo JSON inválido.');
  }
}

function getGithubSettings() {
  try {
    return JSON.parse(localStorage.getItem(githubSettingsKey) || '{}');
  } catch (err) {
    return {};
  }
}

function storeGithubSettings(settings) {
  const { user, repo, branch, sheetsPath } = settings;
  localStorage.setItem(githubSettingsKey, JSON.stringify({ user, repo, branch, sheetsPath }));
}

function openGithubModal() {
  if (!requireCharacterName()) return;

  const settings = getGithubSettings();
  document.getElementById('githubUser').value = settings.user || '';
  document.getElementById('githubPat').value = '';
  document.getElementById('githubRepo').value = settings.repo || defaultGithubRepo;
  document.getElementById('githubBranch').value = settings.branch || 'main';
  document.getElementById('githubSheetsPath').value = settings.sheetsPath || 'fichas';
  setGithubModalStatus('');
  document.getElementById('githubModal').hidden = false;
}

function closeGithubModal() {
  document.getElementById('githubModal').hidden = true;
}

function cleanGitHubPath(path) {
  return path
    .split('/')
    .map(part => part.trim())
    .filter(Boolean)
    .join('/');
}

function joinGitHubPath(...parts) {
  return parts.map(cleanGitHubPath).filter(Boolean).join('/');
}

function textToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
}

function base64ToText(base64) {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function githubRequest(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers
    }
  });

  if (response.status === 404) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.message || 'github-api-error');
  }

  return data;
}

async function verifyGithubUser(user, token) {
  const profile = await githubRequest('https://api.github.com/user', token);
  if (!profile?.login || profile.login.toLowerCase() !== user.toLowerCase()) {
    throw new Error('O PAT informado nao pertence a esse usuario GitHub.');
  }
}

async function getGitHubFile(repo, branch, path, token) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return githubRequest(
    `https://api.github.com/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`,
    token
  );
}

async function putGitHubFile(repo, branch, path, content, message, token, currentSha = null) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const body = {
    message,
    content: textToBase64(content),
    branch
  };

  if (currentSha) body.sha = currentSha;

  return githubRequest(`https://api.github.com/repos/${repo}/contents/${encodedPath}`, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function upsertGitHubFile(repo, branch, path, content, message, token) {
  const existingFile = await getGitHubFile(repo, branch, path, token);
  await putGitHubFile(repo, branch, path, content, message, token, existingFile?.sha || null);
}

async function updateGitHubManifest(repo, branch, sheetsPath, fileName, token) {
  const manifestPath = joinGitHubPath(sheetsPath, 'index.json');
  const manifestFile = await getGitHubFile(repo, branch, manifestPath, token);
  let entries = [];

  try {
    entries = manifestFile?.content ? JSON.parse(base64ToText(manifestFile.content)) : [];
  } catch (err) {
    entries = [];
  }

  if (!entries.some(entry => normalizeSheetEntry(entry).file === fileName)) {
    entries.push({ file: fileName, name: sheetTitle() });
  }

  await putGitHubFile(
    repo,
    branch,
    manifestPath,
    JSON.stringify(entries, null, 2),
    `Atualiza manifesto de fichas`,
    token,
    manifestFile?.sha || null
  );
}

async function uploadJsonToGithub(event) {
  event.preventDefault();

  if (!requireCharacterName(setGithubModalStatus)) return;
  ensureHealthLevel();
  ensureNumberDefaults();

  const user = document.getElementById('githubUser').value.trim();
  const token = document.getElementById('githubPat').value.trim();
  const repo = document.getElementById('githubRepo').value.trim();
  const branch = document.getElementById('githubBranch').value.trim();
  const sheetsPath = cleanGitHubPath(document.getElementById('githubSheetsPath').value || 'fichas');
  const fileName = currentSheetFile || sheetFileName();

  if (!/^[^/\s]+\/[^/\s]+$/.test(repo)) {
    setGithubModalStatus('Informe o repositorio no formato usuario/repositorio.');
    return;
  }

  const submitButton = document.getElementById('githubSubmitBtn');
  submitButton.disabled = true;
  setGithubModalStatus('Autenticando no GitHub...');

  try {
    await verifyGithubUser(user, token);
    storeGithubSettings({ user, repo, branch, sheetsPath });

    const sheetPath = joinGitHubPath(sheetsPath, fileName);
    setGithubModalStatus('Enviando ficha...');
    await upsertGitHubFile(
      repo,
      branch,
      sheetPath,
      JSON.stringify(state, null, 2),
      `Atualiza ficha ${fileName}`,
      token
    );

    setGithubModalStatus('Atualizando indice de fichas...');
    await updateGitHubManifest(repo, branch, sheetsPath, fileName, token);

    currentSheetFile = fileName;
    document.getElementById('githubPat').value = '';
    document.getElementById('githubUploadBtn').title = `Ficha enviada para ${repo}/${sheetPath}`;
    setGithubModalStatus(`Ficha enviada para ${repo}/${sheetPath}.`);
  } catch (err) {
    setGithubModalStatus(err.message || 'Nao foi possivel enviar para o GitHub.');
  } finally {
    submitButton.disabled = false;
  }
}

function openSheetsHandleDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(sheetsHandleDbName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(sheetsHandleStoreName);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getStoredSheetsDirHandle() {
  if (!('indexedDB' in window)) return null;
  const db = await openSheetsHandleDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(sheetsHandleStoreName, 'readonly');
    const request = transaction.objectStore(sheetsHandleStoreName).get(sheetsDirHandleKey);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function storeSheetsDirHandle(handle) {
  if (!('indexedDB' in window)) return;
  const db = await openSheetsHandleDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(sheetsHandleStoreName, 'readwrite');
    transaction.objectStore(sheetsHandleStoreName).put(handle, sheetsDirHandleKey);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
}

async function verifySheetsDirHandle(handle) {
  const options = { mode: 'readwrite' };
  if ((await handle.queryPermission(options)) === 'granted') return true;
  return (await handle.requestPermission(options)) === 'granted';
}

async function ensureSheetsDirHandle() {
  if (!('showDirectoryPicker' in window)) {
    throw new Error('unsupported-file-system-access');
  }

  const storedHandle = sheetsDirHandle || await getStoredSheetsDirHandle();
  if (storedHandle && await verifySheetsDirHandle(storedHandle)) {
    sheetsDirHandle = storedHandle;
    return sheetsDirHandle;
  }

  sheetsDirHandle = await window.showDirectoryPicker({
    id: 'mage-fichas',
    mode: 'readwrite',
    startIn: 'documents'
  });
  await storeSheetsDirHandle(sheetsDirHandle);
  return sheetsDirHandle;
}

async function updateLocalManifest(fileName) {
  if (!sheetsDirHandle) return;

  const manifestHandle = await sheetsDirHandle.getFileHandle('index.json', { create: true });
  let entries = [];
  try {
    const file = await manifestHandle.getFile();
    const text = await file.text();
    entries = text.trim() ? JSON.parse(text) : [];
  } catch (err) {
    entries = [];
  }

  if (!entries.some(entry => normalizeSheetEntry(entry).file === fileName)) {
    entries.push({ file: fileName, name: sheetTitle() });
    const writable = await manifestHandle.createWritable();
    await writable.write(JSON.stringify(entries, null, 2));
    await writable.close();
  }
}

async function saveJson() {
  if (!requireCharacterName()) return;
  ensureHealthLevel();
  ensureNumberDefaults();

  const fileName = currentSheetFile || sheetFileName();
  const content = JSON.stringify(state, null, 2);

  try {
    await ensureSheetsDirHandle();
    const fileHandle = await sheetsDirHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    currentSheetFile = fileName;
    await updateLocalManifest(fileName);
    document.getElementById('saveBtn').title = `Ficha salva em fichas/${fileName}`;
  } catch (err) {
    if (err.name === 'AbortError') return;
    alert('Nao foi possivel salvar automaticamente. O navegador precisa permitir acesso de escrita a pasta fichas.');
  }
}

function init() {
  document.querySelectorAll('[data-dots]').forEach(makeDots);
  makeHealth();
  bindFields();
  bindNumberSteppers();
  bindLevelEditor();
  populatePriorityControls();
  bindPriorityControls();
  document.getElementById('newCharacterBtn').addEventListener('click', startNewCharacter);
  document.getElementById('loadGitSheetsBtn').addEventListener('click', loadGitSheetList);
  document.getElementById('localSheetInput').addEventListener('change', e => loadLocalSheet(e.target.files[0]));
  document.getElementById('loadBtn')?.addEventListener('click', openSheetModal);
  document.getElementById('closeSheetModal').addEventListener('click', closeSheetModal);
  document.getElementById('githubUploadBtn').addEventListener('click', openGithubModal);
  document.getElementById('closeGithubModal').addEventListener('click', closeGithubModal);
  document.getElementById('githubForm').addEventListener('submit', uploadJsonToGithub);
  document.getElementById('sheetModal').addEventListener('click', e => {
    if (e.target.id === 'sheetModal') closeSheetModal();
  });
  document.getElementById('githubModal').addEventListener('click', e => {
    if (e.target.id === 'githubModal') closeGithubModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSheetModal();
      closeGithubModal();
    }
  });
  document.getElementById('saveBtn').addEventListener('click', saveJson);
  document.getElementById('clearBtn')?.addEventListener('click', () => {
    if (confirm('Limpar todos os campos da ficha?')) {
      clearState();
      currentSheetFile = '';
      renderFields();
    }
  });
}
init();
