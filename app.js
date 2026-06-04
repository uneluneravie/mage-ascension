const state = {};
const healthLevels = ['Escoriado', 'Machucado', 'Ferido', 'Ferido Gravemente', 'Espancado', 'Aleijado', 'Incapacitado'];
const healthOptions = ['', 'OK', '-1', '-2', '-5', 'X'];

function setPath(obj, path, value) {
  const keys = path.split('.');
  let ref = obj;
  keys.slice(0, -1).forEach(k => ref = ref[k] ??= {});
  ref[keys.at(-1)] = value;
}
function getPath(obj, path, fallback = '') {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback;
}

function makeDots(container) {
  const path = container.dataset.dots;
  const label = container.dataset.label;
  const max = Number(container.dataset.max || 5);
  container.className = 'dot-row';
  container.innerHTML = `<span class="dot-label">${label}</span><span class="dots"></span>`;
  const dots = container.querySelector('.dots');
  for (let i = 1; i <= max; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.title = `${label}: ${i}`;
    dot.addEventListener('click', () => {
      const current = Number(getPath(state, path, 0));
      setPath(state, path, current === i ? 0 : i);
      renderDots(container);
    });
    dots.appendChild(dot);
  }
  renderDots(container);
}
function renderDots(container) {
  const value = Number(getPath(state, container.dataset.dots, 0));
  container.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('filled', idx < value);
  });
}

function makeHealth() {
  const holder = document.getElementById('health');
  holder.innerHTML = '';
  healthLevels.forEach(level => {
    const label = document.createElement('label');
    label.textContent = level;
    const select = document.createElement('select');
    healthOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt; option.textContent = opt || 'limpo';
      select.appendChild(option);
    });
    select.dataset.field = `health.${level}`;
    select.addEventListener('change', e => setPath(state, e.target.dataset.field, e.target.value));
    label.appendChild(select);
    holder.appendChild(label);
  });
}

function bindFields() {
  document.querySelectorAll('[data-field]').forEach(el => {
    el.addEventListener('input', e => setPath(state, e.target.dataset.field, e.target.value));
    el.addEventListener('change', e => setPath(state, e.target.dataset.field, e.target.value));
  });
}
function renderFields() {
  document.querySelectorAll('[data-field]').forEach(el => { el.value = getPath(state, el.dataset.field, ''); });
  document.querySelectorAll('[data-dots]').forEach(renderDots);
}

function saveJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  const name = getPath(state, 'identity.name', 'mage-personagem').trim().replace(/[^a-z0-9_-]+/gi, '-') || 'mage-personagem';
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-ficha.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function loadJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      Object.keys(state).forEach(k => delete state[k]);
      Object.assign(state, data);
      renderFields();
    } catch (err) {
      alert('Não foi possível carregar o JSON. Verifique se o arquivo é válido.');
    }
  };
  reader.readAsText(file);
}

function init() {
  document.querySelectorAll('[data-dots]').forEach(makeDots);
  makeHealth();
  bindFields();
  document.getElementById('saveBtn').addEventListener('click', saveJson);
  document.getElementById('loadJson').addEventListener('change', e => e.target.files[0] && loadJson(e.target.files[0]));
  document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Limpar todos os campos da ficha?')) {
      Object.keys(state).forEach(k => delete state[k]);
      renderFields();
    }
  });
}
init();
