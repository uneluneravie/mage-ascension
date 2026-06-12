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

async function removeLocalCharacterImage(replacementPath = '') {
  if (!pendingCharacterImageRemovalPath || pendingCharacterImageRemovalPath === replacementPath) return;
  try {
    const imageDirHandle = await sheetsDirHandle.getDirectoryHandle('imagens');
    const imageFileName = pendingCharacterImageRemovalPath.split('/').pop();
    await imageDirHandle.removeEntry(imageFileName);
  } catch (err) {
    console.warn('[image] Nao foi possivel remover a imagem local.', err);
  } finally {
    pendingCharacterImageRemovalPath = '';
  }
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
    const imagePath = await writeLocalCharacterImage();
    await removeLocalCharacterImage(imagePath);
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
