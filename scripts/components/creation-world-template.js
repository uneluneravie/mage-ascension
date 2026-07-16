function creationWorldTemplate() {
  return `
<section class="panel creation-world-panel" hidden>
      <h2>Quem você é no mundo</h2>
      <div class="creation-world-columns">
        <div class="creation-world-column">
          <h3>Como lida com magia</h3>
          <label>Por que você acredita em magia?
            <textarea rows="2" data-field="world.magic.belief"></textarea>
          </label>
          <label>Como você usa magia?
            <textarea rows="2" data-field="world.magic.method"></textarea>
          </label>
          <label>Você usa materiais, símbolos, preparos, crenças? Tem uma ferramenta padrão?
            <textarea rows="2" data-field="world.magic.tools"></textarea>
          </label>
          <label>Como sua magia se parece (estilo)?
            <textarea rows="2" data-field="world.magic.style"></textarea>
          </label>
          <label>Como você se juntou ao coven? Qual relacionamento que você tem com os demais membros?
            <textarea rows="2" data-field="world.magic.coven"></textarea>
          </label>
        </div>
        <div class="creation-world-column">
          <h3>Como lida com a “realidade”</h3>
          <label>O que você faz da vida?
            <textarea rows="2" data-field="world.reality.life"></textarea>
          </label>
          <label>Você tem uma profissão?
            <textarea rows="2" data-field="world.reality.profession"></textarea>
          </label>
          <label>Tem amigos / família?
            <textarea rows="2" data-field="world.reality.relationships"></textarea>
          </label>
          <label>Onde você mora?
            <textarea rows="2" data-field="world.reality.home"></textarea>
          </label>
          <label>Que lugares costuma habitar?
            <textarea rows="2" data-field="world.reality.places"></textarea>
          </label>
        </div>
      </div>
    </section>
  `;
}
