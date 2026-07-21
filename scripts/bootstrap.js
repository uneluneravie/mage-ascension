function init() {
  document.querySelectorAll('[data-dots]').forEach(makeDots);
  makeHealth();
  bindFields();
  bindNumberSteppers();
  bindLevelEditor();
  bindLineage();
  bindCoven();
  loadCoven();
  bindAiQuestions();
  bindCharacterImageUpload();
  populatePriorityControls();
  bindPriorityControls();
  setCreationMode(false);
  document.getElementById('newCharacterBtn').addEventListener('click', startNewCharacter);
  document.getElementById('loadGitSheetsBtn').addEventListener('click', loadGitSheetList);
  document.getElementById('localSheetInput').addEventListener('change', e => loadLocalSheet(e.target.files[0]));
  document.getElementById('newLineageBtn')?.addEventListener('click', startNewLineage);
  document.getElementById('loadGitLineageBtn')?.addEventListener('click', openLineageLoadModal);
  document.getElementById('localLineageInput')?.addEventListener('change', e => loadLocalLineage(e.target.files[0]));
  document.getElementById('closeLineageLoadModal')?.addEventListener('click', closeLineageLoadModal);
  document.getElementById('loadBtn')?.addEventListener('click', openSheetModal);
  document.getElementById('closeSheetModal').addEventListener('click', closeSheetModal);
  document.getElementById('openBackgroundsModalBtn')?.addEventListener('click', openBackgroundsModal);
  document.getElementById('closeBackgroundsModal')?.addEventListener('click', closeBackgroundsModal);
  document.querySelectorAll('[data-backgrounds-modal-tab]').forEach(tab => {
    tab.addEventListener('click', () => selectBackgroundsModalTab(tab.dataset.backgroundsModalTab));
  });
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
  document.getElementById('backgroundsModal')?.addEventListener('click', e => {
    if (e.target.id === 'backgroundsModal') closeBackgroundsModal();
  });
  document.getElementById('githubModal').addEventListener('click', e => {
    if (e.target.id === 'githubModal') closeGithubModal();
  });
  document.getElementById('aiModal').addEventListener('click', e => {
    if (e.target.id === 'aiModal') closeAiModal();
  });
  document.getElementById('lineageLoadModal')?.addEventListener('click', e => {
    if (e.target.id === 'lineageLoadModal') closeLineageLoadModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSheetModal();
      closeBackgroundsModal();
      closeGithubModal();
      closeAiModal();
      closeLineageLoadModal();
      closeLineageDeathModal();
      closeLineageReviveModal();
      closeCharacterImageRemoveModal();
      closeCovenItemModal();
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
