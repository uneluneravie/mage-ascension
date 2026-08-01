(() => {
const {
  appState,
  assert,
  change,
  click,
  input,
  lineageState,
  loadAppFrame,
  resetApp,
  runTests,
  test,
  tick
} = window.TestHarness;

async function withApp(fn) {
  const { iframe, win, doc } = await loadAppFrame();
  try {
    return await fn(win, doc);
  } finally {
    iframe.remove();
  }
}

function dot(root, path, index) {
  return root.querySelector(`[data-dots="${path}"] .dot:nth-child(${index})`);
}

test('inicializacao renderiza controles principais', () => withApp((win, doc) => {
  assert.equal(doc.querySelectorAll('[data-dots]').length, 77);
  assert.equal(doc.querySelectorAll('[data-dots] .dot').length, 395);
  assert.equal(doc.querySelectorAll('#healthBoxes .health-box').length, 7);
  assert.equal(doc.getElementById('startModal').hidden, false);
  assert.equal(doc.querySelector('.backgrounds-panel').hidden, true);
  assert.equal(doc.getElementById('openBackgroundsModalBtn').hidden, false);
  assert.includes(doc.getElementById('healthStatus').textContent, 'Saud');
}));

test('wiki abre, filtra topicos, destaca resultados e limpa a pesquisa', () => withApp((win, doc) => {
  const modalFullPageLink = doc.querySelector('#wikiModal .wiki-open-page');
  const startFullPageLink = doc.getElementById('openStartWikiBtn');
  assert.equal(modalFullPageLink.getAttribute('href'), 'wiki.html');
  assert.equal(modalFullPageLink.getAttribute('target'), '_blank');
  assert.equal(startFullPageLink.getAttribute('href'), 'wiki.html');
  assert.equal(startFullPageLink.getAttribute('target'), '_blank');
  const fullPageTemplate = win.wikiFullPageTemplate();
  assert.includes(fullPageTemplate, 'id="wikiPage"');
  assert.includes(fullPageTemplate, 'id="wikiTopicMenu"');
  assert.includes(fullPageTemplate, 'id="wikiTopicContent"');

  click(doc.getElementById('openWikiBtn'));
  const modal = doc.getElementById('wikiModal');
  const search = doc.getElementById('wikiSearchInput');
  assert.equal(modal.hidden, false);
  assert.equal(search.type, 'text');
  assert.equal(search.getAttribute('role'), 'searchbox');
  assert.equal(doc.querySelectorAll('#clearWikiSearchBtn').length, 1);
  assert.equal(doc.querySelectorAll('#previousWikiMatchBtn, #nextWikiMatchBtn').length, 2);
  assert.equal(doc.getElementById('previousWikiMatchBtn').disabled, true);
  assert.equal(doc.getElementById('nextWikiMatchBtn').disabled, true);
  assert.equal(doc.querySelectorAll('[data-wiki-topic]').length, 12);
  assert.equal(doc.querySelector('[data-wiki-topic="notes"]'), null);

  input(search, 'teletransporte');
  const visibleTopics = Array.from(doc.querySelectorAll('[data-wiki-topic]')).map(button => button.textContent);
  assert.deepEqual(visibleTopics, ['Esferas']);
  assert.equal(doc.querySelector('[data-wiki-topic="spheres"]').classList.contains('is-active'), true);
  assert.includes(doc.querySelector('.wiki-highlight').textContent.toLowerCase(), 'teletransporte');
  assert.equal(doc.querySelectorAll('.wiki-highlight.is-current').length, 1);
  assert.equal(doc.getElementById('previousWikiMatchBtn').disabled, false);
  assert.equal(doc.getElementById('nextWikiMatchBtn').disabled, false);
  assert.equal(doc.getElementById('clearWikiSearchBtn').hidden, false);

  click(doc.getElementById('previousWikiMatchBtn'));
  let highlights = Array.from(doc.querySelectorAll('.wiki-highlight'));
  assert.equal(highlights[highlights.length - 1].classList.contains('is-current'), true);
  click(doc.getElementById('nextWikiMatchBtn'));
  highlights = Array.from(doc.querySelectorAll('.wiki-highlight'));
  assert.equal(highlights[0].classList.contains('is-current'), true);

  click(doc.getElementById('clearWikiSearchBtn'));
  assert.equal(search.value, '');
  assert.equal(doc.querySelectorAll('[data-wiki-topic]').length, 12);
  assert.equal(doc.querySelector('.wiki-highlight'), null);
  assert.equal(doc.getElementById('previousWikiMatchBtn').disabled, true);
  assert.equal(doc.getElementById('nextWikiMatchBtn').disabled, true);

  click(doc.getElementById('closeWikiModal'));
  assert.equal(modal.hidden, true);
}));

test('nomes dos campos abrem diretamente o topico correspondente da wiki', () => withApp((win, doc) => {
  const strength = doc.querySelector('[data-dots="attributes.strength"] .dot-label');
  assert.equal(strength.getAttribute('title'), null);
  assert.equal(strength.getAttribute('role'), 'link');
  assert.equal(strength.getAttribute('tabindex'), '0');
  click(strength);
  assert.equal(doc.getElementById('wikiModal').hidden, false);
  assert.equal(doc.getElementById('wikiSearchInput').value, 'Força');
  assert.equal(doc.querySelector('[data-wiki-topic="attributes"]').classList.contains('is-active'), true);
  assert(doc.querySelector('.wiki-highlight.is-current'));

  win.closeWikiModal();
  const aggravated = doc.querySelector('.health-type-label[data-wiki-query="Agravado"]');
  assert.equal(aggravated.getAttribute('title'), null);
  click(aggravated);
  assert.equal(doc.getElementById('wikiSearchInput').value, 'Agravado');
  assert.equal(doc.querySelector('[data-wiki-topic="health"]').classList.contains('is-active'), true);
}));

test('wiki agrupa atributos e habilidades como a ficha', () => withApp((win, doc) => {
  click(doc.getElementById('openWikiBtn'));
  click(doc.querySelector('[data-wiki-topic="attributes"]'));
  assert.deepEqual(
    Array.from(doc.querySelectorAll('.wiki-entry-group-title')).map(title => title.textContent),
    ['Físicos', 'Sociais', 'Mentais']
  );

  click(doc.querySelector('[data-wiki-topic="abilities"]'));
  assert.deepEqual(
    Array.from(doc.querySelectorAll('.wiki-entry-group-title')).map(title => title.textContent),
    ['Talentos', 'Perícias', 'Conhecimentos']
  );
  assert.equal(doc.querySelector('[data-wiki-topic="creation"]'), null);
  assert.equal(doc.querySelector('[data-wiki-topic="world"]'), null);
}));

test('wiki exibe combate logo depois de habilidades com fluxo e exemplos', () => withApp((win, doc) => {
  click(doc.getElementById('openWikiBtn'));
  const topics = Array.from(doc.querySelectorAll('[data-wiki-topic]'));
  const abilitiesIndex = topics.findIndex(button => button.dataset.wikiTopic === 'abilities');
  assert.equal(topics[abilitiesIndex + 1].dataset.wikiTopic, 'combat');

  click(doc.querySelector('[data-wiki-topic="combat"]'));
  assert.equal(
    doc.querySelector('.wiki-combat-initiative').nextElementSibling.classList.contains('wiki-combat-flow'),
    true
  );
  assert.equal(doc.querySelectorAll('.wiki-combat-flow > li').length, 4);
  assert.equal(doc.querySelectorAll('.wiki-soak-table tbody tr').length, 3);
  assert.equal(doc.querySelectorAll('.wiki-magic-protection-table tbody tr').length, 3);
  assert.equal(doc.querySelectorAll('.wiki-combat-examples-table tbody tr').length, 4);
  const combatText = doc.getElementById('wikiTopicContent').textContent;
  assert.includes(combatText, 'Força 3 + Briga 2');
  assert.includes(combatText, 'Destreza + Raciocínio');
  assert.includes(combatText, 'quem obtiver mais sucessos age primeiro');
  assert.equal(combatText.includes('Dexterity + Wits'), false);
  assert.includes(combatText, 'Destreza 3 + Armas de Fogo 2');
  assert.includes(combatText, 'Arcana 3 = 3 dados');
  assert.includes(combatText, 'Contusão');
  assert.includes(combatText, 'Agravado');
  assert.includes(combatText, 'não existe uma mecânica universal');
  assert.includes(combatText, 'Matéria, Forças, Primórdio');
  assert.includes(combatText, 'Forças, Espaço, Primórdio, Tempo');
  assert.equal(combatText.includes('Matter, Forces, Prime'), false);
  assert.equal(combatText.includes('Forces, Correspondence, Prime, Time'), false);
}));

test('wiki detalha esferas na ordem da ficha e indexa os niveis', () => withApp((win, doc) => {
  click(doc.getElementById('openWikiBtn'));
  click(doc.querySelector('[data-wiki-topic="spheres"]'));
  const levelSummary = doc.querySelector('.wiki-level-summary');
  assert.equal(levelSummary.querySelector('.wiki-entry-group-title').textContent, 'Resumo por nível');
  assert.equal(levelSummary.querySelectorAll('tbody tr').length, 5);
  assert.includes(levelSummary.textContent, 'Domínio quase ilimitado da Esfera.');
  assert.deepEqual(
    Array.from(doc.querySelectorAll('[data-wiki-sphere]')).map(section => section.dataset.wikiSphere),
    ['spheres.fate', 'spheres.space', 'spheres.spirit', 'spheres.forces', 'spheres.matter',
      'spheres.mind', 'spheres.death', 'spheres.prime', 'spheres.time', 'spheres.life']
  );
  doc.querySelectorAll('[data-wiki-sphere]').forEach(section => {
    assert.equal(section.querySelectorAll('.wiki-level-table tbody tr').length, 5);
    assert(section.querySelector('.wiki-examples-table'));
  });
  assert.includes(
    doc.querySelector('[data-wiki-sphere="spheres.spirit"] .wiki-sphere-definition').textContent,
    'entidade da Sombra'
  );
  assert.includes(
    doc.querySelector('[data-wiki-sphere="spheres.spirit"] .wiki-sphere-definition').textContent,
    'espírito do sofrimento'
  );
  assert.includes(
    doc.querySelector('[data-wiki-sphere="spheres.death"] .wiki-sphere-definition').textContent,
    'eco de uma pessoa morta'
  );
  const forceExamples = doc.querySelector('[data-wiki-sphere="spheres.forces"] .wiki-examples-table');
  assert.equal(forceExamples.querySelectorAll('tbody tr').length, 4);
  assert.includes(forceExamples.textContent, 'Forças ●●● + Primórdio ●●');
  assert.includes(forceExamples.textContent, 'Forças ●●● + Espaço ●●');
  const translatedRequirements = Array.from(
    doc.querySelectorAll('.wiki-examples-table tbody td:nth-child(2)')
  ).map(cell => cell.textContent).join(' ');
  ['Fate', 'Correspondence', 'Spirit', 'Forces', 'Matter', 'Mind', 'Death', 'Prime', 'Time', 'Life']
    .forEach(name => assert.equal(translatedRequirements.includes(name), false));
  ['Destino', 'Espaço', 'Espírito', 'Forças', 'Matéria', 'Mente', 'Morte', 'Primórdio', 'Tempo', 'Vida']
    .forEach(name => assert.includes(translatedRequirements, name));

  input(doc.getElementById('wikiSearchInput'), 'teletransportar pessoas');
  assert.deepEqual(
    Array.from(doc.querySelectorAll('[data-wiki-topic]')).map(button => button.textContent),
    ['Esferas']
  );
  assert(doc.querySelectorAll('.wiki-highlight').length >= 2);
}));

test('wiki exibe conjuracao logo depois de esferas com fluxo, paradoxo e exemplo', () => withApp((win, doc) => {
  click(doc.getElementById('openWikiBtn'));
  const topics = Array.from(doc.querySelectorAll('[data-wiki-topic]'));
  const spheresIndex = topics.findIndex(button => button.dataset.wikiTopic === 'spheres');
  assert.equal(topics[spheresIndex + 1].dataset.wikiTopic, 'spellcasting');

  click(doc.querySelector('[data-wiki-topic="spellcasting"]'));
  assert.equal(doc.querySelectorAll('.wiki-spellcasting-flow > li').length, 6);
  assert.equal(doc.querySelectorAll('.wiki-spellcasting-table').length, 4);
  const content = doc.getElementById('wikiTopicContent').textContent;
  assert.includes(content, '3–6');
  assert.includes(content, 'Falha crítica (Botch)');
  assert.includes(content, 'Prisão Temporal de Fogo');
  assert.includes(content, 'Forças ●●●●');
  assert.includes(content, 'Tempo ●●●●');
  assert.includes(content, 'Diante de Adormecidos');
  assert.includes(content, 'Usando magias e habilidades em conjunto');
  assert.includes(content, 'Magia aprimorando Habilidades');
  assert.includes(content, 'Habilidades viabilizando Magias');
  assert.includes(content, 'Medicina, Ciência, Ocultismo, Ofícios ou Armas de Fogo');
  assert.includes(content, 'Magia em Conjunto (Rituais Cooperativos)');
  assert.includes(content, 'cada sucesso obtido concede +1 dado');
  assert.includes(content, 'Forças ●●●●');
  assert.includes(content, 'Primórdio ●●●');
  assert.includes(content, 'concede +2 dados');
  assert.equal(content.includes('Forces ●●●●'), false);
  assert.equal(content.includes('Prime ●●●'), false);
  assert.equal(content.includes('Time ●●●●'), false);
  assert.equal(content.includes('teste de Arcana'), false);
  assert.equal(content.includes('Medicine'), false);
}));

test('wiki exibe acoes reativas logo depois de conjurar magias', () => withApp((win, doc) => {
  click(doc.getElementById('openWikiBtn'));
  const topics = Array.from(doc.querySelectorAll('[data-wiki-topic]'));
  const castingIndex = topics.findIndex(button => button.dataset.wikiTopic === 'spellcasting');
  assert.equal(topics[castingIndex + 1].dataset.wikiTopic, 'reactions');

  click(doc.querySelector('[data-wiki-topic="reactions"]'));
  const content = doc.getElementById('wikiTopicContent').textContent;
  assert.includes(content, 'Reações (Reflexes)');
  assert.includes(content, 'uma reação por rodada');
  assert.includes(content, 'antes da ação que a desencadeou');
  assert.includes(content, 'magia defensiva');
  assert.includes(content, 'Contramágica (Countermagic)');
  assert.includes(content, 'teste de Arcana');
  assert.includes(content, 'Cada sucesso obtido reduz 1 sucesso');
  assert.equal(content.includes('teste de Arcana'), false);
}));

test('wiki detalha os usos e a recuperacao de forca de vontade', () => withApp((win, doc) => {
  click(doc.getElementById('openWikiBtn'));
  click(doc.querySelector('[data-wiki-topic="advantages"]'));
  const guide = doc.querySelector('[data-wiki-advantage-guide="willpower"]');
  assert.includes(guide.querySelector('.wiki-content-section-title').textContent, 'Força de Vontade (Willpower)');
  assert.equal(guide.querySelectorAll('.wiki-advantage-table tbody tr').length, 6);
  const content = guide.textContent;
  assert.includes(content, 'Força de Vontade temporária');
  assert.includes(content, 'valor permanente');
  assert.includes(content, '1 sucesso automático');
  assert.includes(content, 'magias de Mente');
  assert.includes(content, 'testes de dano ou Absorção');
  assert.equal(content.includes('magias de Mind'), false);
  assert.equal(content.includes('testes de dano ou soak'), false);
}));

test('wiki detalha fontes e usos de quintessencia', () => withApp((win, doc) => {
  click(doc.getElementById('openWikiBtn'));
  click(doc.querySelector('[data-wiki-topic="advantages"]'));
  const guide = doc.querySelector('[data-wiki-advantage-guide="quintessence"]');
  assert.equal(guide.querySelectorAll('.wiki-advantage-table tbody tr').length, 5);
  const content = guide.textContent;
  assert.includes(content, 'Nodos (Nodes)');
  assert.includes(content, 'Tass');
  assert.includes(content, 'Esfera Primórdio');
  assert.includes(content, 'teste de Arcana');
  assert.includes(content, 'Reduzir a dificuldade da magia');
  assert.includes(content, 'Interagir com Primórdio');
  assert.equal(content.includes('teste de Arcana'), false);
  assert.equal(content.includes('Esfera Prime'), false);
}));

test('antecedentes aparecem traduzidos em ordem alfabetica', () => withApp((win, doc) => {
  const labels = Array.from(doc.querySelectorAll('.backgrounds-panel .background-grid [data-dots]'))
    .map(element => element.dataset.label);
  assert.equal(doc.querySelector('.abilities-panel').nextElementSibling, doc.querySelector('.backgrounds-panel'));
  assert.deepEqual(labels, [
    'Aliados',
    'Apoio',
    'Contatos',
    'Espiões',
    'Fama',
    'Influência',
    'Maravilha',
    'Mentor',
    'Patrono',
    'Recursos',
    'Refúgio',
    'Sonho',
    'Vidas Passadas'
  ]);
}));

test('antecedentes de personagem criado ficam somente no modal', () => withApp((win, doc) => {
  resetApp(win, {
    identity: { experience: 100 },
    backgrounds: { allies: 1 },
    aspirations: 'Encontrar um grimorio.',
    obsession: 'Desvendar a Torre.',
    world: {
      magic: { belief: 'O impossivel respondeu.' },
      reality: { profession: 'Bibliotecaria.' }
    }
  });
  assert.equal(doc.querySelector('.backgrounds-panel').hidden, true);
  assert.equal(doc.querySelector('.creation-world-panel').hidden, true);
  assert.equal(doc.querySelector('.notes-focus-section').hidden, false);
  assert.equal(doc.querySelector('.covenant-panel').hidden, false);
  assert.equal(doc.getElementById('openBackgroundsModalBtn').hidden, false);
  click(doc.getElementById('openBackgroundsModalBtn'));
  const modal = doc.getElementById('backgroundsModal');
  assert.equal(modal.hidden, false);
  assert.equal(modal.querySelector('[data-backgrounds-modal-panel="backgrounds"]').hidden, false);
  assert.equal(modal.querySelector('[data-backgrounds-modal-panel="world"]').hidden, true);
  assert.equal(dot(modal, 'backgrounds.allies', 1).getAttribute('aria-checked'), 'true');
  assert.equal(modal.querySelector('[data-field="aspirations"]').value, 'Encontrar um grimorio.');
  assert.equal(modal.querySelector('[data-field="obsession"]').value, 'Desvendar a Torre.');
  input(modal.querySelector('[data-field="aspirations"]'), 'Salvar a mentora.');
  input(modal.querySelector('[data-field="obsession"]'), 'Reabrir o portal.');
  assert.equal(win.getPath(appState(win), 'aspirations'), 'Salvar a mentora.');
  assert.equal(win.getPath(appState(win), 'obsession'), 'Reabrir o portal.');
  click(modal.querySelector('[data-backgrounds-modal-tab="world"]'));
  const worldPanel = modal.querySelector('[data-backgrounds-modal-panel="world"]');
  assert.equal(modal.querySelector('[data-backgrounds-modal-panel="backgrounds"]').hidden, true);
  assert.equal(worldPanel.hidden, false);
  assert.equal(worldPanel.querySelectorAll('textarea[data-field^="world."]').length, 10);
  assert.equal(worldPanel.querySelector('[data-field="world.magic.belief"]').value, 'O impossivel respondeu.');
  assert.equal(worldPanel.querySelector('[data-field="world.reality.profession"]').value, 'Bibliotecaria.');
  input(worldPanel.querySelector('[data-field="world.magic.belief"]'), 'A lua falou primeiro.');
  input(worldPanel.querySelector('[data-field="world.reality.profession"]'), 'Restauradora.');
  assert.equal(win.getPath(appState(win), 'world.magic.belief'), 'A lua falou primeiro.');
  assert.equal(win.getPath(appState(win), 'world.reality.profession'), 'Restauradora.');
  click(doc.getElementById('closeBackgroundsModal'));
  assert.equal(modal.hidden, true);
}));

test('novo personagem entra em modo criacao e fecha modal inicial', () => withApp((win, doc) => {
  click(doc.getElementById('newCharacterBtn'));
  const state = appState(win);
  assert.equal(doc.getElementById('startModal').hidden, true);
  assert.equal(doc.getElementById('creationPanel').hidden, false);
  assert.equal(doc.querySelector('.backgrounds-panel').hidden, false);
  assert.equal(doc.querySelector('.creation-world-panel').hidden, false);
  const sheetSections = Array.from(doc.querySelectorAll('#sheet > section'));
  assert.equal(sheetSections[sheetSections.length - 1], doc.querySelector('.creation-world-panel'));
  assert.equal(doc.querySelector('.notes-focus-section').hidden, true);
  assert.equal(doc.querySelector('.covenant-panel').hidden, true);
  assert.equal(doc.getElementById('openBackgroundsModalBtn').hidden, true);
  assert.equal(doc.getElementById('resourceLabel').textContent, 'Freebies');
  assert.equal(doc.getElementById('experienceInput').value, '15');
  assert.equal(win.getPath(state, 'attributes.strength'), 0);
  assert.equal(win.getPath(state, 'advantages.arcana'), 1);
}));

test('campos de identidade atualizam o estado', () => withApp((win, doc) => {
  resetApp(win);
  input(doc.querySelector('[data-field="identity.name"]'), 'Lari');
  change(doc.querySelector('[data-field="identity.chronicle"]'), 'Futurista');
  input(doc.getElementById('experienceInput'), '12');
  const state = appState(win);
  assert.equal(win.getPath(state, 'identity.name'), 'Lari');
  assert.equal(win.getPath(state, 'identity.chronicle'), 'Futurista');
  assert.equal(win.getPath(state, 'identity.experience'), 12);
}));

test('bolinhas nao mudam fora do modo edicao', () => withApp((win, doc) => {
  resetApp(win, { identity: { experience: 100 }, attributes: { strength: 1 } });
  click(dot(doc, 'attributes.strength', 3));
  assert.equal(win.getPath(appState(win), 'attributes.strength'), 1);
}));

test('editar bolinhas consome XP e permite reduzir devolvendo XP', () => withApp((win, doc) => {
  resetApp(win, { identity: { experience: 100 }, attributes: { strength: 1 } });
  click(doc.getElementById('levelEditBtn'));
  click(dot(doc, 'attributes.strength', 3));
  assert.equal(win.getPath(appState(win), 'attributes.strength'), 3);
  assert.equal(win.getPath(appState(win), 'identity.experience'), 80);
  click(dot(doc, 'attributes.strength', 3));
  assert.equal(win.getPath(appState(win), 'attributes.strength'), 2);
  assert.equal(win.getPath(appState(win), 'identity.experience'), 92);
}));

test('forca de vontade temporaria e livre e limitada pelo valor permanente', () => withApp((win, doc) => {
  resetApp(win, { identity: { experience: 20 }, advantages: { willpower: 3, willpowerTemporary: 3 } });
  const state = appState(win);
  const row = doc.querySelector('[data-dots="advantages.willpower"]');
  assert.equal(row.querySelectorAll('.dot.filled').length, 3);
  assert.equal(dot(doc, 'advantages.willpower', 4).classList.contains('unobtained-permanent-dot'), true);
  click(dot(doc, 'advantages.willpower', 3));
  assert.equal(win.getPath(state, 'advantages.willpowerTemporary'), 2);
  assert.equal(win.getPath(state, 'identity.experience'), 20);
  click(dot(doc, 'advantages.willpower', 3));
  assert.equal(win.getPath(state, 'advantages.willpowerTemporary'), 3);
  click(dot(doc, 'advantages.willpower', 4));
  assert.equal(win.getPath(state, 'advantages.willpower'), 3);
  assert.equal(win.getPath(state, 'advantages.willpowerTemporary'), 3);
}));

test('forca de vontade permanente so aumenta na edicao por XP', () => withApp((win, doc) => {
  resetApp(win, { identity: { experience: 20 }, advantages: { willpower: 3, willpowerTemporary: 2 } });
  const state = appState(win);
  click(doc.getElementById('levelEditBtn'));
  click(dot(doc, 'advantages.willpower', 4));
  assert.equal(win.getPath(state, 'advantages.willpower'), 4);
  assert.equal(win.getPath(state, 'advantages.willpowerTemporary'), 2);
  assert.equal(win.getPath(state, 'identity.experience'), 16);
  click(dot(doc, 'advantages.willpower', 3));
  assert.equal(win.getPath(state, 'advantages.willpower'), 4);
  assert.equal(win.getPath(state, 'advantages.willpowerTemporary'), 3);
  assert.equal(win.getPath(state, 'identity.experience'), 16);
}));

test('forca de vontade comprada na criacao comeca temporariamente cheia', () => withApp((win, doc) => {
  click(doc.getElementById('newCharacterBtn'));
  click(dot(doc, 'advantages.willpower', 3));
  assert.equal(win.getPath(appState(win), 'advantages.willpower'), 3);
  assert.equal(win.getPath(appState(win), 'advantages.willpowerTemporary'), 3);
  assert.equal(doc.querySelectorAll('[data-dots="advantages.willpower"] .dot.filled').length, 3);
}));

test('antecedentes nao sobem por XP depois da criacao', () => withApp((win, doc) => {
  resetApp(win, { identity: { experience: 100 }, backgrounds: { allies: 1 } });
  click(doc.getElementById('openBackgroundsModalBtn'));
  const modal = doc.getElementById('backgroundsModal');
  click(doc.getElementById('levelEditBtn'));
  click(dot(modal, 'backgrounds.allies', 2));
  assert.equal(win.getPath(appState(win), 'backgrounds.allies'), 1);
  assert.equal(win.getPath(appState(win), 'identity.experience'), 100);
  assert.equal(modal.querySelector('[data-dots="backgrounds.allies"] .xp-cost').textContent, '');
}));

test('XP insuficiente bloqueia aumento de nivel', () => withApp((win, doc) => {
  resetApp(win, { identity: { experience: 1 }, attributes: { strength: 1 } });
  click(doc.getElementById('levelEditBtn'));
  click(dot(doc, 'attributes.strength', 2));
  assert.equal(win.getPath(appState(win), 'attributes.strength'), 1);
  assert.includes(doc.getElementById('experienceInput').validationMessage, 'Experi');
}));

test('stepper de quintessencia respeita min e max', () => withApp((win, doc) => {
  resetApp(win, { advantages: { quintessence: 0 } });
  const up = doc.querySelector('[data-stepper="up"][data-target="advantages.quintessence"]');
  const down = doc.querySelector('[data-stepper="down"][data-target="advantages.quintessence"]');
  for (let i = 0; i < 25; i += 1) click(up);
  assert.equal(win.getPath(appState(win), 'advantages.quintessence'), 20);
  for (let i = 0; i < 25; i += 1) click(down);
  assert.equal(win.getPath(appState(win), 'advantages.quintessence'), 0);
}));

test('saude aplica dano por severidade e cura por tipo', () => withApp((win, doc) => {
  resetApp(win);
  const damageButtons = doc.querySelectorAll('.health-damage-btn');
  click(damageButtons[0]);
  click(damageButtons[1]);
  click(damageButtons[2]);
  assert.deepEqual(win.getPath(appState(win), 'health.damage'), ['*', 'X', '/']);
  assert.equal(win.getPath(appState(win), 'health.level'), 'injured');
  assert.equal(doc.querySelector('#healthBoxes .health-box').textContent, '*');
  click(doc.querySelector('[data-heal-symbol="X"]'));
  assert.deepEqual(win.getPath(appState(win), 'health.damage'), ['*', '/']);
}));

test('saude bloqueia oitavo dano', () => withApp((win, doc) => {
  resetApp(win);
  const aggravated = doc.querySelectorAll('.health-damage-btn')[2];
  for (let i = 0; i < 8; i += 1) click(aggravated);
  assert.equal(win.getPath(appState(win), 'health.damage').length, 7);
  assert.equal(aggravated.disabled, true);
}));

test('prioridades de criacao evitam duplicidade efetiva', () => withApp((win, doc) => {
  click(doc.getElementById('newCharacterBtn'));
  change(doc.getElementById('attributeSecondary'), 'physical');
  const values = [
    doc.getElementById('attributePrimary').value,
    doc.getElementById('attributeSecondary').value,
    doc.getElementById('attributeTertiary').value
  ];
  assert.equal(new Set(values).size, 3);
  assert.equal(win.getPath(appState(win), 'creation.attributePriorities.secondary'), 'physical');
}));

test('freebies em criacao sao limitados pelo input', () => withApp((win, doc) => {
  click(doc.getElementById('newCharacterBtn'));
  input(doc.getElementById('experienceInput'), '99');
  assert.equal(doc.getElementById('experienceInput').value, '15');
  assert.equal(win.getPath(appState(win), 'identity.experience'), 15);
}));

test('antecedentes usam pool inicial e limite de criacao', () => withApp((win, doc) => {
  click(doc.getElementById('newCharacterBtn'));
  click(dot(doc, 'backgrounds.allies', 3));
  click(dot(doc, 'backgrounds.contacts', 3));
  click(dot(doc, 'backgrounds.resources', 2));
  assert.equal(win.getPath(appState(win), 'backgrounds.resources'), 2);
  assert.equal(win.getPath(appState(win), 'identity.experience'), 14);
  click(dot(doc, 'backgrounds.resources', 4));
  assert.equal(win.getPath(appState(win), 'backgrounds.resources'), 2);
}));

test('antecedente com ponto abre justificativa persistente', () => withApp((win, doc) => {
  click(doc.getElementById('newCharacterBtn'));
  const field = doc.querySelector('[data-field="backgroundJustifications.allies"]');
  assert.equal(field.hidden, true);
  click(dot(doc, 'backgrounds.allies', 1));
  assert.equal(field.hidden, false);
  input(field, 'Jornalista amigo que cobre a prefeitura.');
  assert.equal(win.getPath(appState(win), 'backgroundJustifications.allies'), 'Jornalista amigo que cobre a prefeitura.');
  click(dot(doc, 'backgrounds.allies', 1));
  assert.equal(field.hidden, true);
  assert.equal(win.getPath(appState(win), 'backgroundJustifications.allies'), 'Jornalista amigo que cobre a prefeitura.');
}));

test('criacao edita aspiracoes e obsessao em antecedentes', () => withApp((win, doc) => {
  click(doc.getElementById('newCharacterBtn'));
  const panel = doc.querySelector('.backgrounds-panel');
  input(panel.querySelector('[data-field="aspirations"]'), 'Conseguir um sanctum seguro.');
  input(panel.querySelector('[data-field="obsession"]'), 'Compreender a voz nos sonhos.');
  assert.equal(win.getPath(appState(win), 'aspirations'), 'Conseguir um sanctum seguro.');
  assert.equal(win.getPath(appState(win), 'obsession'), 'Compreender a voz nos sonhos.');
}));

test('criacao edita quem voce e no mundo', () => withApp((win, doc) => {
  click(doc.getElementById('newCharacterBtn'));
  const panel = doc.querySelector('.creation-world-panel');
  assert.equal(panel.querySelectorAll('textarea[data-field^="world."]').length, 10);
  input(panel.querySelector('[data-field="world.magic.belief"]'), 'Vi o impossivel sobreviver.');
  input(panel.querySelector('[data-field="world.magic.method"]'), 'Canto nomes antigos.');
  input(panel.querySelector('[data-field="world.magic.tools"]'), 'Velas, sal e um espelho rachado.');
  input(panel.querySelector('[data-field="world.magic.style"]'), 'Sombras quentes e marcas douradas.');
  input(panel.querySelector('[data-field="world.magic.coven"]'), 'Foi acolhida apos um ritual falho.');
  input(panel.querySelector('[data-field="world.reality.life"]'), 'Cuida de uma livraria usada.');
  input(panel.querySelector('[data-field="world.reality.profession"]'), 'Restauradora de livros.');
  input(panel.querySelector('[data-field="world.reality.relationships"]'), 'Tem uma irma distante.');
  input(panel.querySelector('[data-field="world.reality.home"]'), 'Mora sobre a livraria.');
  input(panel.querySelector('[data-field="world.reality.places"]'), 'Bibliotecas, sebos e estacoes vazias.');
  assert.equal(win.getPath(appState(win), 'world.magic.belief'), 'Vi o impossivel sobreviver.');
  assert.equal(win.getPath(appState(win), 'world.magic.coven'), 'Foi acolhida apos um ritual falho.');
  assert.equal(win.getPath(appState(win), 'world.reality.profession'), 'Restauradora de livros.');
  assert.equal(win.getPath(appState(win), 'world.reality.places'), 'Bibliotecas, sebos e estacoes vazias.');
}));

test('bonus de linhagem habilita somente quando pre-condicoes existem', () => withApp((win, doc) => {
  click(doc.getElementById('newCharacterBtn'));
  const state = appState(win);
  const lineage = lineageState(win);
  win.setPath(state, 'identity.lineage', 'Casa Teste');
  lineage.name = 'Casa Teste';
  lineage.sphereExperience.life = 42;
  win.setPath(state, 'identity.experience', 0);
  win.setPath(state, 'advantages.arcana', 3);
  win.setPath(state, 'advantages.willpower', 3);
  win.setPath(state, 'spheres.life', 1);
  win.renderFields();
  win.renderLineage();
  const button = doc.getElementById('applyLineageSphereBonusBtn');
  assert.equal(button.hidden, false);
  assert.equal(button.disabled, false);
  click(button);
  assert.equal(win.getPath(state, 'spheres.life'), 3);
  assert.equal(Boolean(win.getPath(state, 'creation.lineageSphereBonus.life')), true);
}));

test('modal de GitHub exige nome do personagem', () => withApp((win, doc) => {
  resetApp(win);
  click(doc.getElementById('githubUploadBtn'));
  assert.equal(doc.getElementById('githubModal').hidden, true);
  assert.includes(doc.querySelector('[data-field="identity.name"]').validationMessage, 'Preencha o nome');
}));

test('modal de GitHub abre com nome e carrega settings sem PAT', () => withApp((win, doc) => {
  win.localStorage.setItem('mage-ascension-github-settings', JSON.stringify({
    user: 'lari',
    repo: 'org/repo',
    branch: 'dev',
    sheetsPath: 'dados/fichas'
  }));
  resetApp(win, { identity: { name: 'Lari' } });
  click(doc.getElementById('githubUploadBtn'));
  assert.equal(doc.getElementById('githubModal').hidden, false);
  assert.equal(doc.getElementById('githubUser').value, 'lari');
  assert.equal(doc.getElementById('githubPat').value, '');
  assert.equal(doc.getElementById('githubRepo').value, 'org/repo');
}));

test('modal de IA gera prompt com respostas e JSON da ficha', async () => withApp(async (win, doc) => {
  resetApp(win, { identity: { name: 'Lari' } });
  win.aiPromptTemplate = 'A={{RESPOSTA_1}} B={{RESPOSTA_4}} JSON={{JSON_DA_FICHA_ATUAL}}';
  click(doc.getElementById('aiIntegrationBtn'));
  input(doc.querySelector('[data-ai-question="problemApproach"]'), 'Investigar');
  change(doc.querySelector('[data-ai-question="powerOrVersatility"]'), 'Mais poderoso');
  doc.getElementById('aiForm').dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
  await tick();
  const prompt = doc.getElementById('aiPromptOutput').value;
  assert.includes(prompt, 'A=Investigar');
  assert.includes(prompt, 'B=Mais poderoso');
  assert.includes(prompt, '"name": "Lari"');
}));

test('preview de IA bloqueia edicao e rollback preserva estado original', () => withApp((win, doc) => {
  resetApp(win, { identity: { name: 'Original', experience: 10 }, attributes: { strength: 1 } });
  click(doc.getElementById('aiIntegrationBtn'));
  click(doc.getElementById('receiveAiJsonBtn'));
  input(doc.getElementById('aiJsonInput'), '{"identity":{"name":"Sugestao","experience":10},"attributes":{"strength":3}}');
  click(doc.getElementById('previewAiJsonBtn'));
  assert.equal(doc.querySelector('[data-field="identity.name"]').value, 'Sugestao');
  assert.equal(doc.querySelector('[data-field="identity.name"]').disabled, true);
  assert.equal(doc.getElementById('saveBtn').hidden, true);
  click(doc.getElementById('rollbackAiPreviewBtn'));
  assert.equal(doc.querySelector('[data-field="identity.name"]').value, 'Original');
  assert.equal(win.getPath(appState(win), 'identity.name'), 'Original');
}));

test('confirmar preview de IA substitui o estado', () => withApp((win, doc) => {
  resetApp(win, { identity: { name: 'Original', experience: 10 } });
  win.setAiPreview({ identity: { name: 'Sugestao', experience: 7 }, _xpAnalysis: { ignored: true } });
  click(doc.getElementById('commitAiPreviewBtn'));
  assert.equal(win.getPath(appState(win), 'identity.name'), 'Sugestao');
  assert.equal(win.getPath(appState(win), '_xpAnalysis', null), null);
  assert.equal(doc.getElementById('saveBtn').hidden, false);
}));

test('carregar ficha local invalida mostra erro', async () => withApp(async (win, doc) => {
  await win.loadLocalSheet({
    text: async () => '{json invalido'
  });
  assert.includes(doc.getElementById('startModalStatus').textContent, 'Arquivo JSON');
}));

test('carregar ficha local valida aplica dados e fecha modal', async () => withApp(async (win, doc) => {
  await win.loadLocalSheet({
    name: 'lari.json',
    text: async () => JSON.stringify({ identity: { name: 'Lari' }, attributes: { strength: 2 } })
  });
  assert.equal(doc.getElementById('startModal').hidden, true);
  assert.equal(doc.querySelector('[data-field="identity.name"]').value, 'Lari');
  assert.equal(win.getPath(appState(win), 'attributes.strength'), 2);
}));

test('salvar sem nome bloqueia antes de acessar filesystem', () => withApp((win, doc) => {
  resetApp(win);
  click(doc.getElementById('saveBtn'));
  assert.includes(doc.querySelector('[data-field="identity.name"]').validationMessage, 'Preencha o nome');
}));

test('salvar baixa diretamente os JSONs da ficha e da linhagem', async () => withApp(async (win, doc) => {
  resetApp(win, { identity: { name: 'Lari', lineage: 'Casa da Lua' } });
  const lineage = lineageState(win);
  lineage.name = 'Casa da Lua';
  lineage.members = [{ id: 'm1', name: 'Lari', chronicle: '', dead: false, lineageContribution: {} }];
  const downloads = [];
  win.downloadJsonFile = (fileName, content) => downloads.push({ fileName, content });
  win.showDirectoryPicker = () => {
    throw new Error('O salvamento por download nao deve abrir o seletor de pasta.');
  };

  await win.saveJson();

  assert.deepEqual(downloads.map(download => download.fileName), ['lari.json', 'casa_da_lua.json']);
  assert.equal(JSON.parse(downloads[0].content).identity.name, 'Lari');
  assert.equal(JSON.parse(downloads[1].content).name, 'Casa da Lua');
}));

test('sincronizacao da linhagem preserva edicao local e incorpora mudanca remota', () => withApp((win) => {
  const lineage = lineageState(win);
  lineage.name = 'Casa da Lua';
  lineage.spheres = { life: 1, time: 1 };
  lineage.sphereExperience = {};
  lineage.members = [];
  win.eval(`githubLineageSyncBase = ${JSON.stringify(lineage)}`);

  lineage.spheres.life = 2;
  win.mergeRemoteLineageData({
    name: 'Casa da Lua',
    spheres: { life: 1, time: 3 },
    sphereExperience: {},
    members: []
  });

  assert.equal(lineage.spheres.life, 2);
  assert.equal(lineage.spheres.time, 3);
}));

test('pull da linhagem bloqueia a secao enquanto busca o GitHub', async () => withApp(async (win, doc) => {
  const lineage = lineageState(win);
  lineage.name = 'Casa da Lua';
  win.setPath(appState(win), 'identity.lineage', 'Casa da Lua');
  win.eval("githubLoadedSheetSource = { sheetsBaseUrl: 'https://example.test/fichas', fileName: 'lari.json' }");
  let releaseFetch;
  win.fetch = () => new Promise(resolve => { releaseFetch = resolve; });

  const pull = win.pullLatestLineage();
  assert.equal(doc.getElementById('lineageSection').getAttribute('aria-busy'), 'true');
  assert.equal(doc.getElementById('lineageNameInput').disabled, true);
  releaseFetch({ ok: true, json: async () => ({ name: 'Casa da Lua', spheres: {}, sphereExperience: {}, members: [] }) });
  await pull;
  assert.equal(doc.getElementById('lineageSection').getAttribute('aria-busy'), 'false');
  assert.equal(doc.getElementById('lineageNameInput').disabled, false);
}));

test('Escape fecha modais abertos', () => withApp((win, doc) => {
  resetApp(win, { identity: { name: 'Lari' } });
  click(doc.getElementById('githubUploadBtn'));
  click(doc.getElementById('aiIntegrationBtn'));
  click(doc.getElementById('openBackgroundsModalBtn'));
  doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(doc.getElementById('githubModal').hidden, true);
  assert.equal(doc.getElementById('aiModal').hidden, true);
  assert.equal(doc.getElementById('backgroundsModal').hidden, true);
}));

test('marcar morte de membro absorve XP da ficha mockada', async () => withApp(async (win, doc) => {
  resetApp(win, { identity: { lineage: 'Casa Teste' } });
  const lineage = lineageState(win);
  lineage.name = 'Casa Teste';
  lineage.members = [{ id: 'm1', name: 'Mago Morto', chronicle: 'Urbana', dead: false, lineageContribution: {} }];
  win.renderLineage();
  win.fetch = async () => ({
    ok: true,
    json: async () => ({
      identity: { name: 'Mago Morto' },
      spheres: { life: 3 },
      creationSnapshot: { spheres: { life: 1 } }
    })
  });
  win.openLineageDeathModal('m1');
  await win.confirmLineageDeath();
  assert.equal(lineage.members[0].dead, true);
  assert.equal(lineage.members[0].lineageContribution.life, 17.5);
  assert.equal(lineage.sphereExperience.life, 17.5);
}));

test('reviver membro remove contribuicao da linhagem', () => withApp((win, doc) => {
  resetApp(win, { identity: { lineage: 'Casa Teste' } });
  const lineage = lineageState(win);
  lineage.name = 'Casa Teste';
  lineage.sphereExperience.life = 17.5;
  lineage.members = [{ id: 'm1', name: 'Mago Morto', chronicle: 'Urbana', dead: true, lineageContribution: { life: 17.5 } }];
  win.renderLineage();
  win.openLineageReviveModal('m1');
  win.confirmLineageRevive();
  assert.equal(lineage.members[0].dead, false);
  assert.deepEqual(lineage.members[0].lineageContribution, {});
  assert.equal(lineage.sphereExperience.life, 0);
}));

runTests();
})();
