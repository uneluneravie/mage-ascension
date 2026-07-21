function shellHeaderTemplate() {
  return `
<header class="hero">
      <div>
        <h2>Mage: The Ascension</h2>
      </div>
      <div class="actions no-print">
        <button id="saveBtn" class="icon-btn" type="button" aria-label="Baixar ficha" title="Baixar ficha">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v12"></path>
            <path d="m7 10 5 5 5-5"></path>
            <path d="M5 21h14"></path>
          </svg>
        </button>
        <button id="githubUploadBtn" class="icon-btn" type="button" aria-label="Salvar na nuvem (GitHub)" title="Salvar na nuvem (GitHub)">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 18h10a4 4 0 0 0 .8-7.9A6 6 0 0 0 6.2 8.5 4.8 4.8 0 0 0 7 18z"></path>
            <path d="M12 15V9"></path>
            <path d="m9.5 11.5 2.5-2.5 2.5 2.5"></path>
          </svg>
        </button>
        <button id="commitAiPreviewBtn" class="icon-btn ai-preview-action" type="button" aria-label="Confirmar alterações sugeridas" title="Confirmar alterações sugeridas" hidden>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
        </button>
        <button id="rollbackAiPreviewBtn" class="icon-btn ai-preview-action" type="button" aria-label="Desfazer alterações sugeridas" title="Desfazer alterações sugeridas" hidden>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 7v6h6"></path>
            <path d="M21 17a9 9 0 0 0-15-6.7L3 13"></path>
          </svg>
        </button>
        <!-- <button id="clearBtn" type="button">Limpar</button> -->
      </div>
    </header>
  `;
}
