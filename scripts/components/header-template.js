function shellHeaderTemplate() {
  return `
<header class="hero">
      <div>
        <h2>Mage: The Ascension</h2>
      </div>
      <div class="actions no-print">
        <button id="saveBtn" class="icon-btn" type="button" aria-label="Salvar ficha" title="Salvar ficha">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 3h14l2 2v16H3V3h2z"></path>
            <path d="M7 3v6h10V3"></path>
            <path d="M7 21v-8h10v8"></path>
          </svg>
        </button>
        <button id="githubUploadBtn" class="icon-btn" type="button" aria-label="Enviar para GitHub" title="Enviar para GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <path d="m8.6 10.5 6.8-4"></path>
            <path d="m8.6 13.5 6.8 4"></path>
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
