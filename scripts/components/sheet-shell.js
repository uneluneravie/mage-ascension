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
    ${covenantTemplate()}
    ${notesFocusTemplate()}
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
  ${covenItemModalTemplate()}
  ${lineageDeathModalTemplate()}
  ${lineageReviveModalTemplate()}
  `;
}

function renderAppShell() {
  document.body.insertAdjacentHTML('afterbegin', appShellTemplate());
}
