# Ficha Editavel - Mage: The Ascension

Projeto HTML + CSS + JavaScript nativo, pronto para rodar no GitHub Pages.

## Como usar

1. Abra `index.html` localmente ou publique a pasta no GitHub Pages.
2. Escolha criar um novo personagem, carregar da pasta `fichas` no GitHub ou carregar um JSON do computador.
4. Clique no icone de upload para abrir o modal de fichas.
5. Clique no icone de salvar para salvar a ficha atual na pasta `fichas`.
6. Clique no icone de envio para GitHub para subir a ficha diretamente para um repositorio.

O campo `Nome` do personagem e obrigatorio para salvar localmente ou enviar para o GitHub.

Para fichas novas, o arquivo e criado como `nome_do_personagem.json`, em snake_case minusculo. Para fichas carregadas pelo modal, o mesmo arquivo JSON e atualizado.

## Criacao de personagem

Ao criar um personagem novo, o campo de experiencia vira `Freebies` e comeca em 15. O app habilita os controles de prioridades de Atributos e Habilidades, aplica os pontos iniciais de Atributos, Arcana e Saude, e calcula custos de compra por prioridade, pontos iniciais e Freebies.

Backgrounds usam pontos de bolinha e tambem entram no calculo de criacao.

No GitHub Pages, o navegador nao consegue gravar diretamente no repositorio hospedado. O app usa a File System Access API para gravar em uma pasta local `fichas`; na primeira vez, o navegador pode pedir permissao para essa pasta. Depois disso, a permissao fica salva no navegador e o botao de salvar atualiza/cria o JSON automaticamente.

## Upload para GitHub

O botao de envio abre um modal que exige usuario GitHub e PAT para autenticar a chamada para a API do GitHub. O repositorio padrao e `uneluneravie/mage-ascension`, e tambem e possivel informar branch e pasta das fichas.

O PAT precisa ter permissao de escrita no repositorio. Para tokens fine-grained, conceda acesso ao repositorio escolhido com `Contents: Read and write`. O PAT nao e salvo no navegador; apenas usuario, repositorio, branch e pasta ficam guardados para preencher o modal na proxima vez.

Durante o upload, o app cria ou atualiza `fichas/nome_da_ficha.json` e tambem atualiza `fichas/index.json` para que a ficha apareca no modal de carregamento.

Depois do primeiro envio manual para o GitHub, o app ativa autosave a cada 15 minutos enquanto a pagina estiver aberta. O PAT fica apenas em memoria nessa sessao e o envio automatico so acontece quando houver mudanca real no JSON da ficha.

## Prompt de IA

O botao de integracao de IA ao lado de experiencia/freebies abre um modal com cinco perguntas sobre a evolucao do personagem. Ao clicar em `Gerar prompt`, o app usa o template carregado por `prompt.js`, substitui os campos `{{RESPOSTA_1}}` a `{{RESPOSTA_5}}` e inclui `{{JSON_DA_FICHA_ATUAL}}` com a ficha atual, pronta para copiar em um chat de IA generico.

As respostas ficam armazenadas em `ai` dentro dos dados da ficha e so sao persistidas quando a ficha for salva localmente ou enviada para o GitHub.

Para funcionar no GitHub Pages, mantenha `prompt.js` publicado na raiz do projeto junto com `index.html`. O arquivo deve definir `window.aiPromptTemplate`.

Nao usa frameworks, build ou dependencias externas.
