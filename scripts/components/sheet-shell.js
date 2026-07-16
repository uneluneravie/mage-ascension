function sheetMainTemplate() {
  return `
  <main class="sheet" id="sheet">
    ${shellHeaderTemplate()}
    ${identityHealthTemplate()}
    ${creationPanelTemplate()}
    ${spheresAdvantagesTemplate()}
    ${attributesTemplate()}
    ${abilitiesTemplate()}
    ${backgroundsTemplate()}
    ${notesFocusTemplate()}
    ${covenantTemplate()}
    ${lineageTemplate()}
    ${creationWorldTemplate()}
  </main>
  `;
}

function appShellTemplate() {
  return `
  ${sheetMainTemplate()}
  ${autosaveIndicatorTemplate()}
  ${backgroundsModalTemplate()}
  ${sheetModalTemplate()}
  ${startModalTemplate()}
  ${githubModalTemplate()}
  ${lineageLoadModalTemplate()}
  ${aiModalTemplate()}
  ${characterImageRemoveModalTemplate()}
  ${lineageDeathModalTemplate()}
  ${lineageReviveModalTemplate()}
  `;
}

function renderAppShell() {
  document.body.insertAdjacentHTML('afterbegin', appShellTemplate());
}
