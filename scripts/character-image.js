function imageExtensionFromMime(mimeType) {
  const ext = String(mimeType).split('/')[1]?.toLowerCase() || 'png';
  return ext === 'jpeg' ? 'jpg' : ext.replace(/[^a-z0-9]/g, '') || 'png';
}

function dataUrlMime(dataUrl) {
  return String(dataUrl).match(/^data:([^;,]+)/)?.[1] || 'image/png';
}

function characterImageFileName() {
  const currentPath = getPath(state, 'identity.image', '');
  const currentExt = currentPath.split('.').pop()?.toLowerCase();
  const pendingExt = pendingCharacterImage?.extension;
  return `${snakeCase(sheetTitle())}.${pendingExt || currentExt || 'png'}`;
}

function characterImageRelativePath() {
  return `imagens/${characterImageFileName()}`;
}

function assetUrl(baseUrl, fileName) {
  if (/^(?:https?:|data:|blob:)/i.test(fileName)) return fileName;
  const encodedPath = fileName.split('/').map(encodeURIComponent).join('/');
  return `${baseUrl.replace(/\/$/, '')}/${encodedPath}`;
}

function characterImageSource() {
  if (pendingCharacterImage?.dataUrl) return pendingCharacterImage.dataUrl;
  const imagePath = getPath(state, 'identity.image', '');
  return imagePath ? assetUrl(currentSheetAssetBaseUrl, imagePath) : '';
}

function renderCharacterImage() {
  const frame = document.getElementById('characterImagePicker');
  const preview = document.getElementById('characterImagePreview');
  const placeholder = document.getElementById('characterImagePlaceholder');
  const removeButton = document.getElementById('removeCharacterImageBtn');
  if (!preview || !placeholder) return;

  const source = characterImageSource();
  const hasImage = Boolean(source);
  preview.hidden = !hasImage;
  placeholder.hidden = hasImage;
  frame?.classList.toggle('has-image', hasImage);
  if (removeButton) removeButton.hidden = !hasImage;
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

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('invalid-image'));
    image.src = dataUrl;
  });
}

async function cropImageFileToSquareDataUrl(file) {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);
  const size = Math.min(image.naturalWidth || image.width, image.naturalHeight || image.height);
  const sourceX = Math.max(0, ((image.naturalWidth || image.width) - size) / 2);
  const sourceY = Math.max(0, ((image.naturalHeight || image.height) - size) / 2);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  context.drawImage(image, sourceX, sourceY, size, size, 0, 0, size, size);
  return canvas.toDataURL('image/png');
}

function dataUrlBase64(dataUrl) {
  return String(dataUrl).split(',')[1] || '';
}

function openCharacterImageRemoveModal() {
  if (!characterImageSource()) return;
  document.getElementById('characterImageRemoveModal').hidden = false;
}

function closeCharacterImageRemoveModal() {
  document.getElementById('characterImageRemoveModal').hidden = true;
}

function queueCharacterImageRemoval(previousPath, replacementPath = '') {
  if (previousPath && previousPath !== replacementPath) {
    pendingCharacterImageRemovalPath = previousPath;
  }
}

function removeCharacterImage() {
  queueCharacterImageRemoval(getPath(state, 'identity.image', ''));
  pendingCharacterImage = null;
  if (state.identity) delete state.identity.image;
  document.getElementById('characterImageInput').value = '';
  closeCharacterImageRemoveModal();
  renderCharacterImage();
}

async function bindCharacterImageUpload() {
  const picker = document.getElementById('characterImagePicker');
  const input = document.getElementById('characterImageInput');
  const removeButton = document.getElementById('removeCharacterImageBtn');
  if (!input) return;

  picker?.addEventListener('click', () => input.click());
  picker?.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    input.click();
  });
  removeButton?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    openCharacterImageRemoveModal();
  });
  removeButton?.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    openCharacterImageRemoveModal();
  });
  document.getElementById('closeCharacterImageRemoveModal')?.addEventListener('click', closeCharacterImageRemoveModal);
  document.getElementById('cancelCharacterImageRemoveBtn')?.addEventListener('click', closeCharacterImageRemoveModal);
  document.getElementById('confirmCharacterImageRemoveBtn')?.addEventListener('click', removeCharacterImage);
  document.getElementById('characterImageRemoveModal')?.addEventListener('click', event => {
    if (event.target.id === 'characterImageRemoveModal') closeCharacterImageRemoveModal();
  });

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      input.value = '';
      alert('Selecione um arquivo de imagem.');
      return;
    }

    try {
      const dataUrl = await cropImageFileToSquareDataUrl(file);
      const previousImagePath = getPath(state, 'identity.image', '');
      pendingCharacterImage = {
        dataUrl,
        extension: imageExtensionFromMime(dataUrlMime(dataUrl))
      };
      const nextImagePath = characterImageRelativePath();
      queueCharacterImageRemoval(previousImagePath, nextImagePath);
      setPath(state, 'identity.image', nextImagePath);
      renderCharacterImage();
    } catch (err) {
      input.value = '';
      alert('Não foi possível carregar essa imagem.');
    }
  });
}

function ensureCharacterImagePath() {
  if (!pendingCharacterImage) return '';
  const imagePath = characterImageRelativePath();
  setPath(state, 'identity.image', imagePath);
  return imagePath;
}
