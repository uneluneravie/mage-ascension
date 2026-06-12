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
