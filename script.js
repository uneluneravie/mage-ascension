const character = {
  name: 'Nome do Mago', player: 'Jogador(a)', chronicle: 'Crônica',
  nature: '', demeanor: '', tradition: '', essence: '', concept: '', cabal: ''
};

const attributes = {
  Físicos: ['Força', 'Destreza', 'Vigor'],
  Sociais: ['Carisma', 'Manipulação', 'Aparência'],
  Mentais: ['Percepção', 'Inteligência', 'Raciocínio']
};

const abilities = {
  Talentos: ['Prontidão', 'Esportes', 'Briga', 'Esquiva', 'Empatia', 'Expressão', 'Intimidação', 'Liderança', 'Manha', 'Subterfúgio'],
  Perícias: ['Ofícios', 'Condução', 'Etiqueta', 'Armas de Fogo', 'Meditação', 'Armas Brancas', 'Performance', 'Furtividade', 'Sobrevivência', 'Tecnologia'],
  Conhecimentos: ['Acadêmicos', 'Computador', 'Cosmologia', 'Enigmas', 'Investigação', 'Direito', 'Linguística', 'Medicina', 'Ocultismo', 'Ciência']
};

const spheres = ['Correspondência', 'Entropia', 'Forças', 'Vida', 'Matéria', 'Mente', 'Primórdio', 'Espírito', 'Tempo'];

function dots(count = 5, filled = 0) {
  return `<div class="dots">${Array.from({length: count}, (_, i) => `<span class="dot ${i < filled ? 'filled' : ''}"></span>`).join('')}</div>`;
}

function trait(name, filled = 0) {
  return `<div class="trait"><div><label>${name}</label><div class="line"></div></div>${dots(5, filled)}</div>`;
}

function panel(title, body, cls = '') {
  return `<section class="panel ${cls}"><h2>${title}</h2>${body}</section>`;
}

function field(label) {
  return `<div class="field"><label>${label}</label><div class="line"></div></div>`;
}

function render() {
  const sheet = document.querySelector('#sheet');
  sheet.innerHTML = `
    <header class="header">
      <h1>Mage</h1>
      <p>The Ascension · Ficha de Personagem</p>
    </header>

    <div class="grid">
      ${panel('Identidade', `<div class="field-grid">${['Nome','Jogador(a)','Crônica','Natureza','Comportamento','Tradição','Essência','Conceito','Cabal'].map(field).join('')}</div>`, 'wide')}

      ${panel('Atributos', `<div class="columns">${Object.entries(attributes).map(([group, list]) => `<div><h2>${group}</h2>${list.map((x, i) => trait(x, i === 0 ? 1 : 0)).join('')}</div>`).join('')}</div>`, 'wide')}

      ${panel('Habilidades', `<div class="columns">${Object.entries(abilities).map(([group, list]) => `<div><h2>${group}</h2>${list.map(x => trait(x)).join('')}</div>`).join('')}</div>`, 'wide')}

      ${panel('Esferas', `<div class="spheres">${spheres.map(x => trait(x)).join('')}</div>`, 'double')}
      ${panel('Arete, Vontade e Quintessência', `${trait('Arete', 1)}${trait('Vontade', 1)}${trait('Quintessência')}${trait('Paradoxo')}`, 'half')}

      ${panel('Antecedentes', ['Avatar','Biblioteca','Contatos','Destino','Influência','Mentor','Recursos','Sonho','Talismã'].map(x => trait(x)).join(''), 'double')}
      ${panel('Ressonância', ['Dinâmica','Estática','Entrópica'].map(x => trait(x)).join(''), 'half')}

      ${panel('Vitalidade', `<div class="health">${['Escoriado','Machucado','Ferido','Ferido Gravemente','Espancado','Aleijado','Incapacitado'].map((h, i) => `<div class="health-row"><span>${h}</span><div class="box-line"></div><strong>${i === 0 ? '0' : '-' + i}</strong></div>`).join('')}</div>`, 'double')}
      ${panel('Foco / Paradigma', `<div class="notes">Paradigma, práticas, instrumentos, estilo de magia...</div>`, 'half')}

      ${panel('Anotações', `<div class="notes">Aliados, inimigos, rote, efeitos favoritos, méritos, defeitos e histórico.</div>`, 'wide')}
    </div>
  `;
}

render();
