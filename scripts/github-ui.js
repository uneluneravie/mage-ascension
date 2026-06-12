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
