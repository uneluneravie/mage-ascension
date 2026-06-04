const state = {};
const healthLevels = ['Escoriado', 'Machucado', 'Ferido', 'Ferido Gravemente', 'Espancado', 'Aleijado', 'Incapacitado'];
const healthOptions = ['', 'OK', '-1', '-2', '-5', 'X'];
const sheetsManifest = 'fichas/index.json';
const sheetsHandleDbName = 'mage-ascension-sheets';
const sheetsHandleStoreName = 'handles';
const sheetsDirHandleKey = 'fichas';
let currentSheetFile = '';
let sheetsDirHandle = null;

function setPath(obj, path, value) {
  const keys = path.split('.');
  let ref = obj;
  keys.slice(0, -1).forEach(k => ref = ref[k] ??= {});
  ref[keys.at(-1)] = value;
}
function getPath(obj, path, fallback = '') {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback;
}

function isDotSectionEditable(container) {
  return container.closest('.panel')?.classList.contains('dot-editing');
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
      if (!isDotSectionEditable(container)) return;
      const current = Number(getPath(state, path, 0));
      setPath(state, path, current === i ? 0 : i);
      renderDots(container);
    });
    dots.appendChild(dot);
  }
  renderDots(container);
}

function setDotSectionEditing(panel, editable) {
  const button = panel.querySelector('.section-edit-btn');
  panel.classList.toggle('dot-editing', editable);
  button.innerHTML = editable ? '&#10003;' : '&#9998;';
  button.title = editable ? 'Confirmar edicao' : 'Editar secao';
  button.setAttribute('aria-label', button.title);
  panel.querySelectorAll('.dot').forEach(dot => {
    dot.disabled = !editable;
  });
}

function makeDotSectionEditors() {
  document.querySelectorAll('.panel').forEach(panel => {
    if (!panel.querySelector('[data-dots]') || panel.querySelector('.section-edit-btn')) return;
    panel.classList.add('dot-panel');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'section-edit-btn no-print';
    button.addEventListener('click', () => {
      setDotSectionEditing(panel, !panel.classList.contains('dot-editing'));
    });

    panel.appendChild(button);
    setDotSectionEditing(panel, false);
  });
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

function clearState() {
  Object.keys(state).forEach(k => delete state[k]);
}

function sheetTitle() {
  return getPath(state, 'identity.name', 'mage-personagem').trim() || 'mage-personagem';
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
  makeDotSectionEditors();
  makeHealth();
  bindFields();
  document.getElementById('loadBtn').addEventListener('click', openSheetModal);
  document.getElementById('closeSheetModal').addEventListener('click', closeSheetModal);
  document.getElementById('sheetModal').addEventListener('click', e => {
    if (e.target.id === 'sheetModal') closeSheetModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSheetModal();
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
