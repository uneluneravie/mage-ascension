const state = {};
const lineageState = {
  name: '',
  spheres: {},
  sphereExperience: {},
  members: []
};
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
const maxHealthBoxes = 7;
const damageTypes = [
  {
    key: 'bashing',
    label: 'Contusão',
    symbol: '/',
    examples: ['soco', 'queda leve', 'paulada', 'cansaço extremo']
  },
  {
    key: 'lethal',
    label: 'Letal',
    symbol: 'X',
    examples: ['faca', 'espada', 'mordida', 'tiro']
  },
  {
    key: 'aggravated',
    label: 'Agravado',
    symbol: '*',
    examples: ['fogo sobrenatural', 'ataques de monstros', 'magia extremamente destrutiva', 'certas maldições']
  }
];
const damageSeverity = {
  '*': 3,
  X: 2,
  '/': 1
};
const chronicleOptions = ['Idade Média', 'Urbana', 'Futurista'];
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

  'advantages.arcana': 'Capacidade de impor vontade à realidade e realizar magia.',
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
  'advantages.arcana': 8,
  'advantages.willpower': 1
};
const creationCosts = {
  attributes: 5,
  abilities: 2,
  backgrounds: 1,
  spheres: 7,
  'advantages.arcana': 4,
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
const autosaveIntervalMs = 15 * 60 * 1000;
let currentSheetFile = '';
let sheetsDirHandle = null;
let levelEditMode = false;
let creationMode = false;
let autosaveTimer = null;
let autosaveTickTimer = null;
let autosaveNextAt = 0;
let autosaveLastSavedJson = '';
let autosaveAuth = null;
let aiPreviewState = null;
let pendingLineageDeathId = null;
let pendingCharacterImage = null;


function imageExtensionFromFile(file) {
  const fromName = file.name.split('.').pop()?.toLowerCase() || '';
  const fromType = file.type.split('/')[1]?.toLowerCase() || '';
  const ext = fromName || fromType || 'jpg';
  return ext === 'jpeg' ? 'jpg' : ext.replace(/[^a-z0-9]/g, '') || 'jpg';
}

function characterImageFileName() {
  const currentPath = getPath(state, 'identity.image', '');
  const currentExt = currentPath.split('.').pop()?.toLowerCase();
  const pendingExt = pendingCharacterImage?.extension;
  return `${snakeCase(sheetTitle())}.${pendingExt || currentExt || 'jpg'}`;
}

function characterImageRelativePath() {
  return `imagens/${characterImageFileName()}`;
}

function characterImageSource() {
  if (pendingCharacterImage?.dataUrl) return pendingCharacterImage.dataUrl;
  const imagePath = getPath(state, 'identity.image', '');
  return imagePath ? sheetUrl(imagePath) : '';
}

function renderCharacterImage() {
  const preview = document.getElementById('characterImagePreview');
  const placeholder = document.getElementById('characterImagePlaceholder');
  if (!preview || !placeholder) return;

  const source = characterImageSource();
  preview.hidden = !source;
  placeholder.hidden = Boolean(source);
  if (source) preview.src = source;
  else preview.removeAttribute('src');
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function dataUrlBase64(dataUrl) {
  return String(dataUrl).split(',')[1] || '';
}

async function bindCharacterImageUpload() {
  const input = document.getElementById('characterImageInput');
  if (!input) return;

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      input.value = '';
      alert('Selecione um arquivo de imagem.');
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    pendingCharacterImage = {
      dataUrl,
      extension: imageExtensionFromFile(file)
    };
    setPath(state, 'identity.image', characterImageRelativePath());
    renderCharacterImage();
  });
}

function ensureCharacterImagePath() {
  if (!pendingCharacterImage) return '';
  const imagePath = characterImageRelativePath();
  setPath(state, 'identity.image', imagePath);
  return imagePath;
}

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

function arcanaSpherePoolSpent() {
  return Math.max(0, Number(getPath(state, 'advantages.arcana', 1)) - 1) + sumPaths(spherePaths) + Number(getPath(state, 'advantages.willpower', 0));
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
    for (let i = 0; i < valueOf(path); i++) sharedPoolItems.push(creationCosts.spheres);
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

function setLevelEditing(editable) {
  if (aiPreviewState) editable = false;
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
  const path = container.dataset.dots;
  const value = Number(effectiveValue(path, 0));
  container.classList.toggle('ai-suggested', isAiSuggestionChanged(path));
  container.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('filled', idx < value);
    dot.classList.toggle('ai-suggested', isAiSuggestionChanged(path) && idx < value);
  });
  setDotCost(container);
}

function makeHealth() {
  const buttons = document.getElementById('healthDamageButtons');
  const boxes = document.getElementById('healthBoxes');
  buttons.innerHTML = '';
  boxes.innerHTML = '';

  damageTypes.forEach(type => {
    const group = document.createElement('span');
    group.className = 'health-type-actions';
    const label = document.createElement('span');
    label.className = 'health-type-label';
    label.title = `${type.label}\nExemplos: ${type.examples.join(', ')}`;
    const symbol = document.createElement('span');
    symbol.className = 'health-type-symbol';
    symbol.textContent = type.symbol;
    label.append(symbol, document.createTextNode(type.label));

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'health-damage-btn';
    button.setAttribute('aria-label', `Aplicar dano ${type.label}`);
    button.appendChild(healthIcon('damage'));
    button.addEventListener('click', () => applyHealthDamage(type.symbol));

    const healButton = document.createElement('button');
    healButton.type = 'button';
    healButton.className = 'health-heal-btn';
    healButton.setAttribute('aria-label', `Curar dano ${type.label}`);
    healButton.dataset.healSymbol = type.symbol;
    healButton.appendChild(healthIcon('heal'));
    healButton.addEventListener('click', () => healHealthDamage(type.symbol));

    group.append(label, button, healButton);
    buttons.appendChild(group);
  });

  for (let i = 0; i < maxHealthBoxes; i++) {
    const box = document.createElement('span');
    box.className = 'health-box';
    box.setAttribute('role', 'checkbox');
    box.setAttribute('aria-readonly', 'true');
    box.setAttribute('aria-checked', 'false');
    boxes.appendChild(box);
  }

  renderHealthDamage();
}

function healthIcon(kind) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');

  if (kind === 'heal') {
    const plus = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    plus.setAttribute('d', 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z');
    svg.appendChild(plus);
    return svg;
  }

  const burst = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  burst.setAttribute('d', 'M12 2l2.1 5.2L19 4l-1.3 5.8L23 12l-5.3 2.2L19 20l-4.9-3.2L12 22l-2.1-5.2L5 20l1.3-5.8L1 12l5.3-2.2L5 4l4.9 3.2L12 2z');
  svg.appendChild(burst);
  return svg;
}


function legacyHealthDamage() {
  const level = getPath(state, 'health.level', healthLevels[0].value);
  const count = Math.max(0, healthLevels.findIndex(item => item.value === level));
  return Array.from({ length: Math.min(count, maxHealthBoxes) }, () => '/');
}

function normalizedHealthDamage(source = state) {
  const damage = getPath(source, 'health.damage', null);
  if (!Array.isArray(damage)) return source === state ? legacyHealthDamage() : [];
  return damage
    .filter(symbol => damageTypes.some(type => type.symbol === symbol))
    .sort((a, b) => damageSeverity[b] - damageSeverity[a])
    .slice(0, maxHealthBoxes);
}

function currentHealthLevel(damage) {
  return healthLevels[Math.min(damage.length, healthLevels.length - 1)] || healthLevels[0];
}

function healthStatusText(level) {
  return level.label;
}

function renderHealthPenalty(level) {
  const penalty = document.getElementById('healthPenalty');
  if (!penalty) return;

  if (level.blocked) {
    penalty.textContent = '☠';
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
  penalty.querySelector('span').textContent = level.dicePenalty;
}

function applyHealthDamage(symbol) {
  if (aiPreviewState) {
    renderFields();
    return;
  }

  const damage = normalizedHealthDamage();
  if (damage.length >= maxHealthBoxes) return;
  damage.push(symbol);
  damage.sort((a, b) => damageSeverity[b] - damageSeverity[a]);
  setPath(state, 'health.damage', damage);
  setPath(state, 'health.level', currentHealthLevel(damage).value);
  renderHealthDamage();
}

function healHealthDamage(symbol) {
  if (aiPreviewState) {
    renderFields();
    return;
  }

  const damage = normalizedHealthDamage();
  const index = damage.indexOf(symbol);
  if (index < 0) return;
  damage.splice(index, 1);
  damage.sort((a, b) => damageSeverity[b] - damageSeverity[a]);
  setPath(state, 'health.damage', damage);
  setPath(state, 'health.level', currentHealthLevel(damage).value);
  renderHealthDamage();
}

function renderHealthDamage() {
  const damage = aiPreviewState && hasPath(aiPreviewState, 'health.damage')
    ? normalizedHealthDamage(aiPreviewState)
    : normalizedHealthDamage();
  const isSuggested = isAiSuggestionChanged('health.damage');
  const control = document.querySelector('.health-control');
  const status = document.getElementById('healthStatus');
  const level = currentHealthLevel(damage);

  control?.classList.toggle('ai-suggested', isSuggested);
  document.querySelectorAll('.health-damage-btn').forEach(button => {
    button.disabled = Boolean(aiPreviewState) || damage.length >= maxHealthBoxes;
  });
  document.querySelectorAll('.health-heal-btn').forEach(button => {
    button.disabled = Boolean(aiPreviewState) || !damage.includes(button.dataset.healSymbol);
  });
  if (status) status.textContent = healthStatusText(level);
  renderHealthPenalty(level);
  document.querySelectorAll('.health-box').forEach((box, idx) => {
    const symbol = damage[idx] || '';
    box.textContent = symbol;
    box.classList.toggle('is-filled', Boolean(symbol));
    box.setAttribute('aria-checked', symbol ? 'true' : 'false');
  });
}

function ensureHealthDamage() {
  const damage = normalizedHealthDamage();
  setPath(state, 'health.damage', damage);
  setPath(state, 'health.level', currentHealthLevel(damage).value);
}

function bindFields() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const updateField = e => {
      if (aiPreviewState) {
        renderFields();
        return;
      }
      let value = e.target.type === 'number' ? Number(e.target.value || e.target.dataset.numberDefault || 0) : e.target.value;
      if (creationMode && e.target.dataset.field === 'identity.experience') {
        value = Math.min(15, Math.max(0, value));
        e.target.value = value;
      }
      setPath(state, e.target.dataset.field, value);
      if (e.target.dataset.field === 'identity.name') {
        e.target.setCustomValidity('');
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
    const fallback = el.dataset.numberDefault || '';
    el.value = effectiveValue(el.dataset.field, fallback);
    el.classList.toggle('ai-suggested-field', isAiSuggestionChanged(el.dataset.field));
    el.disabled = Boolean(aiPreviewState);
  });
  document.querySelectorAll('[data-stepper]').forEach(button => {
    button.disabled = Boolean(aiPreviewState);
  });
  document.querySelectorAll('[data-dots]').forEach(renderDots);
  renderCharacterImage();
  renderHealthDamage();
  updateAllDotCosts();
  renderCreationSummary();
}

function clearLineageState() {
  lineageState.name = '';
  lineageState.spheres = {};
  lineageState.sphereExperience = {};
  lineageState.members = [];
  pendingLineageDeathId = null;
}

function lineageName() {
  return (lineageState.name || getPath(state, 'identity.lineage', '')).trim();
}

function lineageFileName() {
  return `${snakeCase(lineageName())}.json`;
}

function lineageRelativePath() {
  return `linhagens/${lineageFileName()}`;
}

function lineageHasData() {
  return Boolean(
    lineageName()
    || Object.values(lineageState.spheres).some(value => Number(value) > 0)
    || lineageState.members.some(member => member.name || member.chronicle || member.dead)
  );
}

function ensureLineageMember() {
  if (!lineageState.members.length) addLineageMember(false);
}

function addLineageMember(render = true) {
  lineageState.members.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: '',
    chronicle: '',
    dead: false
  });
  if (render) renderLineageMembers();
}

function ratingToXp(rating) {
  const value = Math.max(0, Number(rating) || 0);
  const full = Math.floor(value);
  const fraction = value - full;
  let total = 0;
  for (let level = 1; level <= full; level++) total += level * 7;
  if (fraction > 0) total += fraction * (full + 1) * 7;
  return total;
}

function legacyLineageRatingToXp(rating) {
  const value = Math.max(0, Number(rating) || 0);
  const full = Math.floor(value);
  const fraction = value - full;
  let total = 0;
  for (let level = 1; level <= full; level++) total += level * 7;
  if (fraction > 0) total += value * 7;
  return total;
}

function xpToRating(xp) {
  let remaining = Math.max(0, Number(xp) || 0) / 7;
  let level = 0;

  while (remaining >= level + 1) {
    level += 1;
    remaining -= level;
  }

  if (!remaining) return level;
  return level + remaining / (level + 1);
}

function lineageSphereXp(key) {
  if (Object.prototype.hasOwnProperty.call(lineageState.sphereExperience, key)) {
    return Number(lineageState.sphereExperience[key]) || 0;
  }
  return legacyLineageRatingToXp(lineageState.spheres[key] || 0);
}

function roundedRating(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function syncLineageSpheresFromExperience() {
  spherePaths.forEach(path => {
    const key = path.split('.')[1];
    if (Object.prototype.hasOwnProperty.call(lineageState.sphereExperience, key)) {
      lineageState.spheres[key] = roundedRating(xpToRating(lineageState.sphereExperience[key]));
    }
  });
}

function creationSphereRating(characterData, key) {
  const current = Number(characterData?.spheres?.[key] || 0);
  const snapshotValue = characterData?.creationSnapshot?.spheres?.[key];
  if (snapshotValue !== undefined && snapshotValue !== null) {
    return Math.min(current, Math.max(0, Number(snapshotValue) || 0));
  }
  return current > 0 ? 1 : 0;
}

function characterSphereDeathXp(characterData, key) {
  const current = Number(characterData?.spheres?.[key] || 0);
  const createdWith = creationSphereRating(characterData, key);
  return Math.max(0, ratingToXp(current) - ratingToXp(createdWith));
}

function absorbCharacterSpheresIntoLineage(characterData) {
  spherePaths.forEach(path => {
    const key = path.split('.')[1];
    const gainedXp = characterSphereDeathXp(characterData, key) / 2;
    if (!gainedXp) return;

    const totalXp = lineageSphereXp(key) + gainedXp;
    lineageState.sphereExperience[key] = totalXp;
    lineageState.spheres[key] = roundedRating(xpToRating(totalXp));
  });
}

function githubSheetsRawBase() {
  const settings = getGithubSettings();
  const repo = settings.repo || defaultGithubRepo;
  const branch = settings.branch || 'main';
  const sheetsPath = cleanGitHubPath(settings.sheetsPath || 'fichas');
  return `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(branch)}/${sheetsPath.split('/').map(encodeURIComponent).join('/')}`;
}

function lineageMemberSheetFileName(member) {
  const name = (member?.name || '').trim();
  if (!name) throw new Error('member-name-missing');
  return /\.json$/i.test(name) ? name : `${snakeCase(name)}.json`;
}

async function fetchLineageMemberSheet(member) {
  const fileName = lineageMemberSheetFileName(member);
  const response = await fetch(`${githubSheetsRawBase()}/${fileName.split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`);
  if (!response.ok) throw new Error('member-sheet-not-found');
  return response.json();
}

function makeLineageDots(container) {
  const key = container.dataset.lineageDots;
  const label = container.dataset.label;
  const path = `spheres.${key}`;
  const description = fieldDescriptions[path] || '';
  const symbol = sphereSymbols[path] || '';
  container.className = 'lineage-dot-row';
  container.innerHTML = '<span class="dot-label"></span><span class="dots"></span>';

  const labelElement = container.querySelector('.dot-label');
  if (symbol) {
    const symbolElement = document.createElement('span');
    symbolElement.className = 'sphere-symbol';
    symbolElement.textContent = symbol;
    labelElement.append(symbolElement, document.createTextNode(label));
  } else {
    labelElement.textContent = label;
  }
  if (description) labelElement.title = description;

  const dots = container.querySelector('.dots');
  for (let i = 1; i <= 5; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.title = `${label}: ${i}`;
    dot.setAttribute('aria-label', `${label}: ${i}`);
    dot.disabled = true;
    dots.appendChild(dot);
  }
  renderLineageDots(container);
}

function renderLineageDots(container) {
  const value = Number(lineageState.spheres[container.dataset.lineageDots] || 0);
  container.querySelectorAll('.dot').forEach((dot, idx) => {
    const filled = idx + 1 <= value;
    const partial = Math.max(0, Math.min(1, value - idx));
    dot.classList.toggle('filled', filled);
    if (!filled && partial > 0) {
      dot.style.background = `linear-gradient(to right, var(--gold) ${partial * 100}%, transparent ${partial * 100}%)`;
    } else {
      dot.style.background = '';
    }
  });
}

function renderLineageMembers() {
  const list = document.getElementById('lineageMembers');
  if (!list) return;
  list.innerHTML = '';
  ensureLineageMember();

  lineageState.members.forEach(member => {
    const row = document.createElement('div');
    row.className = 'lineage-member-row';
    row.dataset.memberId = member.id;

    const nameWrap = document.createElement('span');
    nameWrap.className = 'lineage-member-name';
    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Nome';
    nameInput.value = member.name || '';
    nameInput.addEventListener('input', () => {
      member.name = nameInput.value;
    });
    nameWrap.appendChild(nameInput);
    if (member.dead) {
      const memoriam = document.createElement('span');
      memoriam.className = 'lineage-memoriam';
      memoriam.textContent = 'in memorium';
      nameWrap.appendChild(memoriam);
    }

    const chronicleInput = document.createElement('select');
    chronicleOptions.forEach(optionValue => {
      const option = document.createElement('option');
      option.value = optionValue;
      option.textContent = optionValue === 'Urbana' ? 'Urbano' : optionValue;
      chronicleInput.appendChild(option);
    });
    chronicleInput.value = chronicleOptions.includes(member.chronicle) ? member.chronicle : chronicleOptions[0];
    member.chronicle = chronicleInput.value;
    chronicleInput.addEventListener('change', () => {
      member.chronicle = chronicleInput.value;
    });

    const deathButton = document.createElement('button');
    deathButton.type = 'button';
    deathButton.className = 'lineage-death-btn no-print';
    deathButton.textContent = '☠';
    deathButton.title = 'Marcar morte';
    deathButton.setAttribute('aria-label', `Marcar morte de ${member.name || 'personagem'}`);
    deathButton.disabled = Boolean(member.dead);
    deathButton.addEventListener('click', () => openLineageDeathModal(member.id));

    row.append(nameWrap, chronicleInput, deathButton);
    list.appendChild(row);
  });
}

function renderLineage() {
  const nameInput = document.getElementById('lineageNameInput');
  lineageState.name = getPath(state, 'identity.lineage', lineageState.name || '');
  if (nameInput) nameInput.value = lineageState.name;
  document.querySelectorAll('[data-lineage-dots]').forEach(renderLineageDots);
  renderLineageMembers();
}

function bindLineage() {
  document.querySelectorAll('[data-lineage-dots]').forEach(makeLineageDots);
  document.getElementById('lineageNameInput')?.addEventListener('input', event => {
    lineageState.name = event.target.value;
    setPath(state, 'identity.lineage', lineageState.name);
    event.target.setCustomValidity('');
  });
  document.getElementById('addLineageMemberBtn')?.addEventListener('click', () => addLineageMember());
  document.getElementById('closeLineageDeathModal')?.addEventListener('click', closeLineageDeathModal);
  document.getElementById('cancelLineageDeathBtn')?.addEventListener('click', closeLineageDeathModal);
  document.getElementById('confirmLineageDeathBtn')?.addEventListener('click', confirmLineageDeath);
  document.getElementById('lineageDeathModal')?.addEventListener('click', event => {
    if (event.target.id === 'lineageDeathModal') closeLineageDeathModal();
  });
  renderLineage();
}

function openLineageDeathModal(memberId) {
  pendingLineageDeathId = memberId;
  document.getElementById('lineageDeathModal').hidden = false;
}

function closeLineageDeathModal() {
  pendingLineageDeathId = null;
  document.getElementById('lineageDeathModal').hidden = true;
}

async function confirmLineageDeath() {
  const member = lineageState.members.find(item => item.id === pendingLineageDeathId);
  if (!member) {
    closeLineageDeathModal();
    return;
  }

  const button = document.getElementById('confirmLineageDeathBtn');
  if (button) button.disabled = true;

  try {
    const characterData = await fetchLineageMemberSheet(member);
    absorbCharacterSpheresIntoLineage(characterData);
    member.dead = true;
    closeLineageDeathModal();
    renderLineageMembers();
    document.querySelectorAll('[data-lineage-dots]').forEach(renderLineageDots);
  } catch (err) {
    console.error('[lineage] Nao foi possivel absorver as esferas do personagem.', err);
    alert('Nao foi possivel carregar a ficha desse personagem no GitHub. A morte nao foi confirmada.');
  } finally {
    if (button) button.disabled = false;
  }
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

function requireLineageName(onError = () => {}) {
  if (!lineageHasData() || lineageName()) return true;

  const nameInput = document.getElementById('lineageNameInput');
  const message = 'Preencha o nome da linhagem antes de salvar seus dados.';
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
  clearAiPreview();
  clearState();
  clearLineageState();
  pendingCharacterImage = null;
  Object.assign(state, data);
  if (data.lineage && typeof data.lineage === 'object') {
    lineageState.name = data.lineage.name || data.identity?.lineage || '';
    lineageState.spheres = { ...(data.lineage.spheres || {}) };
    lineageState.sphereExperience = { ...(data.lineage.sphereExperience || {}) };
    syncLineageSpheresFromExperience();
    lineageState.members = Array.isArray(data.lineage.members) ? data.lineage.members : [];
    delete state.lineage;
  }
  currentSheetFile = fileName;
  setCreationMode(Boolean(data.creation?.mode));
  renderFields();
  renderLineage();
}

function applyLineageData(data) {
  clearLineageState();
  lineageState.name = data.name || lineageName();
  lineageState.spheres = { ...(data.spheres || {}) };
  lineageState.sphereExperience = { ...(data.sphereExperience || {}) };
  syncLineageSpheresFromExperience();
  lineageState.members = Array.isArray(data.members)
    ? data.members.map(member => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: member.name || '',
      chronicle: member.chronicle || '',
      dead: Boolean(member.dead || member.status === 'dead' || member.inMemoriam)
    }))
    : [];
  if (lineageState.name) setPath(state, 'identity.lineage', lineageState.name);
  renderLineage();
}

async function loadLineageFromUrl(baseUrl) {
  if (!lineageName()) return;
  try {
    const response = await fetch(`${baseUrl}/linhagens/${lineageFileName().split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`);
    if (!response.ok) return;
    applyLineageData(await response.json());
  } catch (err) {
    console.warn('[lineage] Nao foi possivel carregar a linhagem.', err);
  }
}

async function loadLineageFromGithub() {
  await loadLineageFromUrl(githubSheetsRawBase());
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

function sheetJson() {
  ensureHealthDamage();
  ensureCharacterImagePath();
  ensureCreationSnapshot();
  if (lineageName()) setPath(state, 'identity.lineage', lineageName());
  delete state.lineage;
  return JSON.stringify(state, null, 2);
}

function creationSnapshotData() {
  return {
    capturedAt: new Date().toISOString(),
    identity: cloneData(getPath(state, 'identity', {})),
    attributes: cloneData(getPath(state, 'attributes', {})),
    abilities: cloneData(getPath(state, 'abilities', {})),
    spheres: cloneData(getPath(state, 'spheres', {})),
    advantages: cloneData(getPath(state, 'advantages', {})),
    backgrounds: cloneData(getPath(state, 'backgrounds', {})),
    creation: cloneData(getPath(state, 'creation', {}))
  };
}

function ensureCreationSnapshot() {
  if (!state.creationSnapshot || state.creation?.mode) {
    state.creationSnapshot = creationSnapshotData();
  }
}

function lineageData() {
  const sphereExperience = Object.fromEntries(spherePaths.map(path => {
    const key = path.split('.')[1];
    return [key, lineageSphereXp(key)];
  }));

  return {
    name: lineageName(),
    spheres: Object.fromEntries(spherePaths.map(path => {
      const key = path.split('.')[1];
      return [key, Number(lineageState.spheres[key] || 0)];
    })),
    sphereExperience,
    members: lineageState.members
      .filter(member => member.name || member.chronicle || member.dead)
      .map(member => ({
        name: member.name || '',
        chronicle: member.chronicle || '',
        status: member.dead ? 'dead' : 'alive',
        dead: Boolean(member.dead)
      }))
  };
}

function lineageJson() {
  return JSON.stringify(lineageData(), null, 2);
}

function currentSheetName() {
  return currentSheetFile || sheetFileName();
}

function formatDuration(ms) {
  const minutes = Math.max(0, Math.ceil(ms / 60000));
  return `${minutes} min`;
}

function setAutosaveFeedback(message, isError = false) {
  const feedback = document.getElementById('autosaveFeedback');
  feedback.textContent = message;
  feedback.classList.toggle('is-error', isError);
  if (message) {
    window.setTimeout(() => {
      if (feedback.textContent === message) feedback.textContent = '';
    }, 6000);
  }
}

function updateAutosaveCountdown() {
  const indicator = document.getElementById('autosaveIndicator');
  const countdown = document.getElementById('autosaveCountdown');

  if (!autosaveAuth) {
    indicator.hidden = true;
    return;
  }

  indicator.hidden = false;
  countdown.textContent = `Autosave em ${formatDuration(autosaveNextAt - Date.now())}`;
}

function scheduleAutosave() {
  if (!autosaveAuth) return;
  window.clearTimeout(autosaveTimer);
  autosaveNextAt = Date.now() + autosaveIntervalMs;
  updateAutosaveCountdown();
  autosaveTimer = window.setTimeout(runAutosave, autosaveIntervalMs);
}

function startAutosave(auth) {
  autosaveAuth = auth;
  window.clearInterval(autosaveTickTimer);
  autosaveTickTimer = window.setInterval(updateAutosaveCountdown, 1000);
  scheduleAutosave();
}

async function uploadSheetToGithub({ repo, branch, sheetsPath, token }, fileName, content, message) {
  const sheetPath = joinGitHubPath(sheetsPath, fileName);
  await upsertGitHubFile(repo, branch, sheetPath, content, message, token);
  await updateGitHubManifest(repo, branch, sheetsPath, fileName, token);
  currentSheetFile = fileName;
  return sheetPath;
}

async function uploadLineageToGithub(auth, message) {
  if (!lineageHasData() || !lineageName()) return '';
  const lineagePath = joinGitHubPath(auth.sheetsPath, lineageRelativePath());
  await upsertGitHubFile(auth.repo, auth.branch, lineagePath, lineageJson(), message, auth.token);
  return lineagePath;
}

async function runAutosave() {
  if (!autosaveAuth) return;

  try {
    ensureHealthDamage();
    ensureNumberDefaults();
    const content = sheetJson();
    const lineageContent = lineageHasData() && lineageName() ? lineageJson() : '';
    const autosaveContent = `${content}\n---lineage---\n${lineageContent}\n---image---\n${pendingCharacterImage?.dataUrl || ''}`;
    if (autosaveContent === autosaveLastSavedJson) {
      console.log('[autosave] Nenhuma alteração para enviar.');
      scheduleAutosave();
      return;
    }

    const fileName = currentSheetName();
    const sheetPath = await uploadSheetToGithub(
      autosaveAuth,
      fileName,
      content,
      `Autosave ficha ${fileName}`
    );
    const lineagePath = await uploadLineageToGithub(autosaveAuth, `Autosave linhagem ${lineageFileName()}`);
    const imagePath = await uploadCharacterImageToGithub(autosaveAuth, `Autosave imagem ${characterImageFileName()}`);
    autosaveLastSavedJson = `${content}\n---lineage---\n${lineageContent}\n---image---\n`;
    document.getElementById('githubUploadBtn').title = imagePath
      ? `Ficha enviada para ${autosaveAuth.repo}/${sheetPath} e ${imagePath}`
      : lineagePath
      ? `Ficha enviada para ${autosaveAuth.repo}/${sheetPath} e ${lineagePath}`
      : `Ficha enviada para ${autosaveAuth.repo}/${sheetPath}`;
    console.log(`[autosave] Ficha salva com sucesso em ${autosaveAuth.repo}/${sheetPath}.`);
    setAutosaveFeedback('Ficha salva com sucesso.');
  } catch (err) {
    console.error('[autosave] Falha ao salvar ficha.', err);
    setAutosaveFeedback('Falha no autosave.', true);
  } finally {
    scheduleAutosave();
  }
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
  summary.innerHTML = `
    <span>Freebies: ${freebies()}</span>
    <span>Atributos ${attrRows.join(' · ')}</span>
    <span>Habilidades ${abilityRows.join(' · ')}</span>
    <span>Backgrounds ${sumPaths(backgroundPaths)}/7</span>
    <span>Arcana + Esferas + FV ${arcanaSpherePoolSpent()}/6</span>
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
  clearAiPreview();
  clearState();
  clearLineageState();
  pendingCharacterImage = null;
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
    const response = await fetch(`${githubRawBase}/fichas/${fileName.split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`);
    if (!response.ok) throw new Error('sheet');
    applySheetData(await response.json(), fileName);
    await loadLineageFromGithub();
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

function storeAiQuestionValues() {
  const answers = {};
  document.querySelectorAll('[data-ai-question]').forEach(input => {
    const key = input.dataset.aiQuestion;
    answers[key] = input.value.trim();
    setPath(state, `ai.${key}`, answers[key]);
  });
  return answers;
}

function openAiModal() {
  showAiQuestionPanel();
  document.querySelectorAll('[data-ai-question]').forEach(input => {
    const key = input.dataset.aiQuestion;
    input.value = getPath(state, `ai.${key}`, '');
  });
  document.getElementById('aiPromptOutput').value = '';
  document.getElementById('aiJsonInput').value = '';
  setAiModalStatus('');
  document.getElementById('aiModal').hidden = false;
}

function closeAiModal() {
  document.getElementById('aiModal').hidden = true;
}

function aiAnswers() {
  return {
    RESPOSTA_1: getPath(state, 'ai.problemApproach', ''),
    RESPOSTA_2: getPath(state, 'ai.scenePreference', ''),
    RESPOSTA_3: getPath(state, 'ai.desiredCapability', ''),
    RESPOSTA_4: getPath(state, 'ai.powerOrVersatility', ''),
    RESPOSTA_5: getPath(state, 'ai.currentWeakness', '')
  };
}

function characterSheetForPrompt() {
  return JSON.stringify(state, null, 2);
}

function setAiModalStatus(message) {
  document.getElementById('aiModalStatus').textContent = message;
}

function clearAiPromptOutput() {
  document.getElementById('aiPromptOutput').value = '';
  resetCopyAiPromptButton();
  setAiModalStatus('');
}

function resetCopyAiPromptButton() {
  const button = document.getElementById('copyAiPromptBtn');
  if (!button) return;
  window.clearTimeout(button._feedbackTimer);
  button.textContent = 'Copiar prompt';
  button.classList.remove('copied');
}

function setCopyAiPromptFeedback(message) {
  const button = document.getElementById('copyAiPromptBtn');
  if (!button) return;
  window.clearTimeout(button._feedbackTimer);
  button.textContent = message;
  button.classList.add('copied');
  button._feedbackTimer = window.setTimeout(resetCopyAiPromptButton, 2200);
}

function showAiQuestionPanel() {
  document.getElementById('aiQuestionPanel').hidden = false;
  document.getElementById('aiResultPanel').hidden = true;
  setAiModalStatus('');
}

function showAiResultPanel() {
  document.getElementById('aiQuestionPanel').hidden = true;
  document.getElementById('aiResultPanel').hidden = false;
  setAiModalStatus('');
}

function extractJsonText(value) {
  const text = value.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return text;
}

function normalizeAiSuggestion(data) {
  const suggestion = cloneData(data);
  delete suggestion._xpAnalysis;
  return suggestion;
}

function updateAiPreviewActions() {
  const isPreviewing = Boolean(aiPreviewState);
  if (!document.getElementById('saveBtn')) return;
  document.getElementById('sheet')?.classList.toggle('ai-preview-active', isPreviewing);
  document.getElementById('saveBtn').hidden = isPreviewing;
  document.getElementById('githubUploadBtn').hidden = isPreviewing;
  document.getElementById('commitAiPreviewBtn').hidden = !isPreviewing;
  document.getElementById('rollbackAiPreviewBtn').hidden = !isPreviewing;
}

function setAiPreview(data) {
  aiPreviewState = normalizeAiSuggestion(data);
  setLevelEditing(false);
  updateAiPreviewActions();
  renderFields();
}

function clearAiPreview() {
  aiPreviewState = null;
  updateAiPreviewActions();
  if (document.querySelector('[data-field]')) renderFields();
}

function previewAiJson() {
  try {
    const text = extractJsonText(document.getElementById('aiJsonInput').value);
    if (!text) {
      setAiModalStatus('Cole o JSON retornado pela IA.');
      return;
    }
    const suggestion = JSON.parse(text);
    setAiPreview(suggestion);
    closeAiModal();
    setAutosaveFeedback('Alterações sugeridas em pré-visualização.');
  } catch (err) {
    setAiModalStatus('JSON inválido. Cole apenas o JSON retornado pela IA.');
    console.error('[ai] JSON retornado invalido.', err);
  }
}

function commitAiPreview() {
  if (!aiPreviewState) return;
  clearState();
  Object.assign(state, cloneData(aiPreviewState));
  aiPreviewState = null;
  setCreationMode(Boolean(state.creation?.mode));
  updateAiPreviewActions();
  renderFields();
  setAutosaveFeedback('Alterações sugeridas aplicadas.');
}

function rollbackAiPreview() {
  if (!aiPreviewState) return;
  aiPreviewState = null;
  updateAiPreviewActions();
  renderFields();
  setAutosaveFeedback('Alterações sugeridas descartadas.');
}

async function loadAiPromptTemplate() {
  if (typeof window.aiPromptTemplate === 'string' && window.aiPromptTemplate.trim()) {
    return window.aiPromptTemplate;
  }
  throw new Error('prompt-template-missing');
}

async function generateAiPrompt(event) {
  event.preventDefault();
  setAiModalStatus('Gerando prompt...');
  storeAiQuestionValues();

  try {
    let prompt = await loadAiPromptTemplate();
    const replacements = {
      ...aiAnswers(),
      JSON_DA_FICHA_ATUAL: characterSheetForPrompt()
    };

    Object.entries(replacements).forEach(([key, value]) => {
      prompt = prompt.replaceAll(`{{${key}}}`, value || 'Não informado.');
    });

    document.getElementById('aiPromptOutput').value = prompt;
    setAiModalStatus('Prompt gerado. Respostas armazenadas na ficha.');
    console.log('[ai] Prompt gerado para chat genérico.');
  } catch (err) {
    setAiModalStatus('Não foi possível carregar prompt.js.');
    console.error('[ai] Falha ao gerar prompt.', err);
  }
}

async function copyAiPrompt() {
  const output = document.getElementById('aiPromptOutput');
  if (!output.value.trim()) {
    setAiModalStatus('Gere o prompt antes de copiar.');
    return;
  }

  try {
    await navigator.clipboard.writeText(output.value);
    setCopyAiPromptFeedback('Copiado');
    setAiModalStatus('Prompt copiado.');
  } catch (err) {
    output.select();
    setCopyAiPromptFeedback('Selecionado');
    setAiModalStatus('Selecione e copie o prompt manualmente.');
  }
}

function bindAiQuestions() {
  document.querySelectorAll('[data-ai-question]').forEach(input => {
    input.addEventListener('input', () => {
      setPath(state, `ai.${input.dataset.aiQuestion}`, input.value);
      clearAiPromptOutput();
    });
  });
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

async function putGitHubFileBase64(repo, branch, path, base64Content, message, token, currentSha = null) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const body = {
    message,
    content: base64Content,
    branch
  };

  if (currentSha) body.sha = currentSha;

  return githubRequest(`https://api.github.com/repos/${repo}/contents/${encodedPath}`, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function putGitHubFile(repo, branch, path, content, message, token, currentSha = null) {
  return putGitHubFileBase64(repo, branch, path, textToBase64(content), message, token, currentSha);
}

async function upsertGitHubFile(repo, branch, path, content, message, token) {
  const existingFile = await getGitHubFile(repo, branch, path, token);
  await putGitHubFile(repo, branch, path, content, message, token, existingFile?.sha || null);
}

async function upsertGitHubFileBase64(repo, branch, path, base64Content, message, token) {
  const existingFile = await getGitHubFile(repo, branch, path, token);
  await putGitHubFileBase64(repo, branch, path, base64Content, message, token, existingFile?.sha || null);
}

async function uploadCharacterImageToGithub(auth, message) {
  if (!pendingCharacterImage) return '';
  const imagePath = ensureCharacterImagePath();
  const githubPath = joinGitHubPath(auth.sheetsPath, imagePath);
  await upsertGitHubFileBase64(auth.repo, auth.branch, githubPath, dataUrlBase64(pendingCharacterImage.dataUrl), message, auth.token);
  pendingCharacterImage = null;
  return githubPath;
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
  if (!requireLineageName(setGithubModalStatus)) return;
  ensureHealthDamage();
  ensureNumberDefaults();

  const user = document.getElementById('githubUser').value.trim();
  const token = document.getElementById('githubPat').value.trim();
  const repo = document.getElementById('githubRepo').value.trim();
  const branch = document.getElementById('githubBranch').value.trim();
  const sheetsPath = cleanGitHubPath(document.getElementById('githubSheetsPath').value || 'fichas');
  const fileName = currentSheetName();

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

    setGithubModalStatus('Enviando ficha...');
    const auth = { user, token, repo, branch, sheetsPath };
    const sheetPath = await uploadSheetToGithub(
      auth,
      fileName,
      sheetJson(),
      `Atualiza ficha ${fileName}`
    );
    const lineagePath = await uploadLineageToGithub(auth, `Atualiza linhagem ${lineageFileName()}`);
    const imagePath = await uploadCharacterImageToGithub(auth, `Atualiza imagem ${characterImageFileName()}`);
    autosaveLastSavedJson = `${sheetJson()}\n---lineage---\n${lineagePath ? lineageJson() : ''}\n---image---\n`;
    startAutosave(auth);
    document.getElementById('githubPat').value = '';
    document.getElementById('githubUploadBtn').title = imagePath
      ? `Ficha enviada para ${repo}/${sheetPath} e ${imagePath}`
      : lineagePath
        ? `Ficha enviada para ${repo}/${sheetPath} e ${lineagePath}`
        : `Ficha enviada para ${repo}/${sheetPath}`;
    const extraUploads = [
      lineagePath ? `Linhagem enviada para ${repo}/${lineagePath}` : '',
      imagePath ? `Imagem enviada para ${repo}/${imagePath}` : ''
    ].filter(Boolean).join('. ');
    setGithubModalStatus(extraUploads
      ? `Ficha enviada para ${repo}/${sheetPath}. ${extraUploads}.`
      : `Ficha enviada para ${repo}/${sheetPath}.`);
    setAutosaveFeedback('Ficha salva com sucesso.');
    console.log(`[github] Ficha salva com sucesso em ${repo}/${sheetPath}. Autosave ativado.`);
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

function downloadJsonFile(fileName, content) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

async function writeLocalJsonFile(fileName, content) {
  const fileHandle = await sheetsDirHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

async function writeLocalCharacterImage() {
  if (!pendingCharacterImage) return '';
  const imageDirHandle = await sheetsDirHandle.getDirectoryHandle('imagens', { create: true });
  const imagePath = ensureCharacterImagePath();
  const imageFileName = imagePath.split('/').pop();
  const fileHandle = await imageDirHandle.getFileHandle(imageFileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(await (await fetch(pendingCharacterImage.dataUrl)).blob());
  await writable.close();
  return imagePath;
}

async function writeLocalLineageFile(fileName, content) {
  const lineageDirHandle = await sheetsDirHandle.getDirectoryHandle('linhagens', { create: true });
  const fileHandle = await lineageDirHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

async function saveJson() {
  if (!requireCharacterName()) return;
  if (!requireLineageName()) return;
  ensureHealthDamage();
  ensureNumberDefaults();

  const fileName = currentSheetFile || sheetFileName();
  const content = sheetJson();
  const lineageShouldSave = lineageHasData() && lineageName();
  const nextLineageFileName = lineageShouldSave ? lineageFileName() : '';
  const nextLineageJson = lineageShouldSave ? lineageJson() : '';

  try {
    await ensureSheetsDirHandle();
    await writeLocalJsonFile(fileName, content);
    await writeLocalCharacterImage();
    if (lineageShouldSave) {
      await writeLocalLineageFile(nextLineageFileName, nextLineageJson);
    }
    currentSheetFile = fileName;
    await updateLocalManifest(fileName);
    document.getElementById('saveBtn').title = lineageShouldSave
      ? `Ficha salva em fichas/${fileName} e linhagens/${nextLineageFileName}`
      : `Ficha salva em fichas/${fileName}`;
  } catch (err) {
    if (err.name === 'AbortError') return;
    downloadJsonFile(fileName, content);
    if (lineageShouldSave) downloadJsonFile(nextLineageFileName, nextLineageJson);
  }
}

function init() {
  document.querySelectorAll('[data-dots]').forEach(makeDots);
  makeHealth();
  bindFields();
  bindNumberSteppers();
  bindLevelEditor();
  bindLineage();
  bindAiQuestions();
  bindCharacterImageUpload();
  populatePriorityControls();
  bindPriorityControls();
  document.getElementById('newCharacterBtn').addEventListener('click', startNewCharacter);
  document.getElementById('loadGitSheetsBtn').addEventListener('click', loadGitSheetList);
  document.getElementById('localSheetInput').addEventListener('change', e => loadLocalSheet(e.target.files[0]));
  document.getElementById('loadBtn')?.addEventListener('click', openSheetModal);
  document.getElementById('closeSheetModal').addEventListener('click', closeSheetModal);
  document.getElementById('githubUploadBtn').addEventListener('click', openGithubModal);
  document.getElementById('closeGithubModal').addEventListener('click', closeGithubModal);
  document.getElementById('aiIntegrationBtn').addEventListener('click', openAiModal);
  document.getElementById('closeAiModal').addEventListener('click', closeAiModal);
  document.getElementById('aiForm').addEventListener('submit', generateAiPrompt);
  document.getElementById('copyAiPromptBtn').addEventListener('click', copyAiPrompt);
  document.getElementById('receiveAiJsonBtn').addEventListener('click', showAiResultPanel);
  document.getElementById('backToAiQuestionsBtn').addEventListener('click', showAiQuestionPanel);
  document.getElementById('previewAiJsonBtn').addEventListener('click', previewAiJson);
  document.getElementById('commitAiPreviewBtn').addEventListener('click', commitAiPreview);
  document.getElementById('rollbackAiPreviewBtn').addEventListener('click', rollbackAiPreview);
  updateAiPreviewActions();
  document.getElementById('githubForm').addEventListener('submit', uploadJsonToGithub);
  document.getElementById('sheetModal').addEventListener('click', e => {
    if (e.target.id === 'sheetModal') closeSheetModal();
  });
  document.getElementById('githubModal').addEventListener('click', e => {
    if (e.target.id === 'githubModal') closeGithubModal();
  });
  document.getElementById('aiModal').addEventListener('click', e => {
    if (e.target.id === 'aiModal') closeAiModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSheetModal();
      closeGithubModal();
      closeAiModal();
      closeLineageDeathModal();
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
