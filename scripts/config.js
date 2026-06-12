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
let pendingLineageReviveId = null;
let pendingCharacterImage = null;
let pendingCharacterImageRemovalPath = '';
let currentSheetAssetBaseUrl = 'fichas';
