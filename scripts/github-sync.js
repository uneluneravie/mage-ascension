function syncClone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function syncEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function mergeGithubValue(base, local, remote) {
  if (syncEqual(local, base)) return syncClone(remote);
  if (syncEqual(remote, base) || syncEqual(local, remote)) return syncClone(local);

  if (Array.isArray(base) && Array.isArray(local) && Array.isArray(remote)) {
    const length = Math.max(base.length, local.length, remote.length);
    return Array.from({ length }, (_, index) => mergeGithubValue(base[index], local[index], remote[index]))
      .filter(value => value !== undefined);
  }

  const objects = [base, local, remote].every(value => value && typeof value === 'object' && !Array.isArray(value));
  if (!objects) return syncClone(local);

  const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);
  return Object.fromEntries(Array.from(keys, key => [key, mergeGithubValue(base[key], local[key], remote[key])])
    .filter(([, value]) => value !== undefined));
}

function setLineageSyncLoading(loading) {
  const section = document.getElementById('lineageSection');
  const indicator = document.getElementById('lineageSyncLoading');
  lineageSyncLoadingCount = Math.max(0, lineageSyncLoadingCount + (loading ? 1 : -1));
  const active = lineageSyncLoadingCount > 0;
  if (section) section.setAttribute('aria-busy', String(active));
  if (indicator) indicator.hidden = !active;
  if (!section) return;
  if (active && !lineageSyncDisabledControls.length) {
    lineageSyncDisabledControls = Array.from(section.querySelectorAll('input, button, textarea, select'))
      .filter(control => control !== indicator)
      .map(control => ({ control, disabled: control.disabled }));
    lineageSyncDisabledControls.forEach(({ control }) => { control.disabled = true; });
  } else if (!active) {
    lineageSyncDisabledControls.forEach(({ control, disabled }) => { control.disabled = disabled; });
    lineageSyncDisabledControls = [];
  }
}

function replaceObject(target, value) {
  Object.keys(target).forEach(key => delete target[key]);
  Object.assign(target, value || {});
}

function mergeRemoteLineageData(remoteData) {
  const base = githubLineageSyncBase || remoteData;
  const merged = mergeGithubValue(base, lineageState, remoteData);
  githubLineageSyncBase = syncClone(remoteData);
  if (syncEqual(merged, lineageState)) return false;
  replaceObject(lineageState, merged);
  syncLineageSpheresFromExperience();
  if (lineageState.name) setPath(state, 'identity.lineage', lineageState.name);
  renderLineage();
  return true;
}

function githubRawFileUrl(baseUrl, relativePath) {
  return `${baseUrl}/${relativePath.split('/').map(encodeURIComponent).join('/')}?v=${Date.now()}`;
}

async function fetchGithubRawJson(baseUrl, relativePath) {
  const response = await fetch(githubRawFileUrl(baseUrl, relativePath), { cache: 'no-store' });
  if (!response.ok) return null;
  return response.json();
}

async function fetchGithubApiJson(auth, relativePath) {
  const file = await getGitHubFile(auth.repo, auth.branch, joinGitHubPath(auth.sheetsPath, relativePath), auth.token);
  return file?.content ? JSON.parse(base64ToText(file.content)) : null;
}

async function pullLatestLineage(auth = null) {
  if (!lineageName()) return false;
  setLineageSyncLoading(true);
  try {
    const relativePath = lineageRelativePath();
    const remote = auth
      ? await fetchGithubApiJson(auth, relativePath)
      : githubLoadedSheetSource
        ? await fetchGithubRawJson(githubLoadedSheetSource.sheetsBaseUrl, relativePath)
        : null;
    return remote ? mergeRemoteLineageData(remote) : false;
  } finally {
    setLineageSyncLoading(false);
  }
}

function clearGithubSyncSource() {
  githubLoadedSheetSource = null;
  githubLineageSyncBase = null;
}

function setGithubSyncSource({ sheetsBaseUrl, lineageData = null }) {
  clearGithubSyncSource();
  githubLoadedSheetSource = { sheetsBaseUrl };
  githubLineageSyncBase = syncClone(lineageData);
  loadCoven();
}
