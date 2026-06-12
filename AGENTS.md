# Diretrizes Do Projeto

Este projeto e uma ficha editavel de Mage: The Ascension feita com HTML, CSS e JavaScript nativo. O refactor planejado deve preservar o comportamento atual, mas reorganizar os arquivos principais em modulos menores, testaveis e mais faceis de manter.

Antes de qualquer refactor funcional, consulte e rode os testes descritos em `testes/AGENTS.md`.

## Objetivo Do Refactor

O refactor deve quebrar os arquivos principais atuais em responsabilidades claras:

- `index.html`: deve deixar de concentrar toda a estrutura visual da ficha em um unico arquivo grande.
- `app.js`: deve deixar de concentrar estado, regras, renderizacao, eventos, persistencia e integracoes externas no mesmo arquivo.

A prioridade e reduzir acoplamento sem alterar regras da ficha, formato dos JSONs, nomes de campos publicos ou fluxos de usuario.

## Estrutura Atual

- `index.html`: casca da pagina; carrega o shell visual, prompt e modulos JS em ordem.
- `app.js`: ponte de compatibilidade para ferramentas antigas; a aplicacao real fica em `scripts/`.
- `scripts/components/`: componentes e modulos visuais.
- `scripts/integrations/`: integracoes externas e persistencia fora do fluxo principal.
- `scripts/bootstrap.js`: inicializacao e binding final da aplicacao.
- `scripts/config.js`: estado global e constantes compartilhadas.
- `scripts/state-utils.js`: helpers de estado, custos, freebies e regras compartilhadas.

## Organizacao Do HTML

O HTML deve ser separado em modulos visuais e componentes reutilizaveis.

Diretrizes:

- Componentes repetidos ou conceitualmente independentes devem sair do `index.html`.
- O `index.html` deve ficar responsavel por montar a pagina e carregar os scripts/estilos necessarios.
- Blocos grandes da ficha devem virar modulos visuais, por exemplo:
  - cabecalho e acoes principais;
  - identidade e imagem do personagem;
  - saude;
  - painel de criacao;
  - esferas e vantagens;
  - atributos;
  - habilidades;
  - notas, foco magico e laboratorio;
  - linhagem;
  - modais.
- Controles reutilizaveis devem virar componentes, por exemplo:
  - linha de bolinhas;
  - stepper numerico;
  - modal base;
  - lista de fichas;
  - seletor/upload de arquivo;
  - linha de membro da linhagem.
- Mantenha atributos de estado e seletores estaveis enquanto houver testes ou codigo dependendo deles, especialmente `id`, `data-field`, `data-dots`, `data-lineage-*` e atributos de acessibilidade.
- Nao mova texto visivel ou estrutura sem ajustar os testes funcionais correspondentes.

## Organizacao Do JavaScript

O `app.js` deve ser quebrado por funcionalidade. Cada modulo deve ter responsabilidade clara e dependencia explicita.

Diretrizes:

- Evite novo estado global espalhado. Prefira um modulo central de estado ou injeção explicita de dependencias.
- Regras puras devem ficar separadas de renderizacao e eventos de DOM.
- Funcoes de regra devem ser exportaveis/testaveis sem exigir uma pagina carregada.
- Eventos de UI devem ser registrados em modulos de binding, perto da area funcional correspondente.
- Renderizacao deve ficar separada das regras de calculo.
- Serializacao deve preservar compatibilidade com os JSONs atuais.

Separacao sugerida:

- `state.js`: estado principal, helpers de `getPath`, `setPath`, clone e reset.
- `config.js`: constantes da ficha, listas de campos, custos, niveis de saude, paths de esferas/backgrounds.
- `identity.js`: nome, cronica, experiencia/freebies e nome de arquivo.
- `dots.js`: renderizacao e interacao generica de bolinhas.
- `xp.js`: custos de XP, custos de criacao, pools, limites e freebies.
- `creation.js`: modo de criacao, prioridades, resumo e snapshot.
- `health.js`: dano, cura, normalizacao, niveis e penalidades.
- `lineage.js`: estado da linhagem, membros, XP/rating, morte, reviver e bonus herdado.
- `images.js`: upload, corte, preview, caminhos e remocao de imagem.
- `fields.js`: binding/render de campos `data-field` e steppers numericos.
- `serialization.js`: `sheetJson`, `lineageJson`, compatibilidade legado e snapshots.
- `sheets.js`: carregar ficha local/GitHub raw, manifestos e aplicacao de dados.
- `ai.js`: perguntas, prompt, preview, commit e rollback de sugestoes.
- `modals.js`: abrir/fechar modais, Escape e backdrop.
- `autosave.js`: timer, comparacao de conteudo, feedback e reenvio.
- `app.js`: bootstrap/orquestracao, idealmente pequeno.

Essa lista e uma direcao, nao uma obrigacao rigida de nomes. Se a estrutura final usar nomes diferentes, mantenha a mesma separacao de responsabilidades.

## Integracoes Externas

Qualquer integracao externa deve ser centralizada em arquivos `.js` separados do fluxo principal da ficha.

Diretrizes:

- GitHub deve ficar isolado em modulo proprio, por exemplo `integrations/github.js` ou `github.js`.
- File System Access API deve ficar isolada em modulo proprio, por exemplo `integrations/local-files.js`.
- Clipboard deve ficar atras de uma funcao pequena e mockavel.
- Fetch de manifestos/fichas remotas deve ficar em camada propria, sem espalhar URLs e chamadas pela UI.
- Modulos de integracao devem expor funcoes pequenas, com entradas e saidas claras.
- UI nao deve montar manualmente detalhes da API externa quando puder chamar uma funcao de servico.
- Tokens, PATs e dados sensiveis nunca devem ser persistidos. A regra atual do GitHub continua valendo: salvar apenas usuario, repositorio, branch e pasta; nao salvar PAT.

## Contratos Que Nao Devem Quebrar Sem Migração

Preserve estes contratos durante o refactor:

- Formato dos JSONs das fichas.
- Formato dos JSONs de linhagem.
- Campos `identity`, `attributes`, `abilities`, `spheres`, `advantages`, `backgrounds`, `health`, `creation`, `creationSnapshot`, `ai`.
- Compatibilidade com `health.level` legado.
- Compatibilidade com linhagem embutida legada em `state.lineage`.
- Manifestos `fichas/index.json` e `fichas/linhagens/index.json`.
- Caminhos de imagem em `imagens/*.png|jpg`.
- Nomes de arquivos gerados por `snake_case`.
- Fluxos de salvar local, upload GitHub, autosave, preview de IA, morte/reviver linhagem e bonus de linhagem.

Se algum contrato precisar mudar, implemente migracao e testes antes de alterar o formato persistido.

## Diretrizes De Teste Para Refactor

- Antes de mover codigo, rode os testes existentes relevantes.
- Ao extrair uma regra para modulo proprio, adicione ou mova testes unitarios para cobrir essa regra diretamente.
- Ao extrair UI/componente, mantenha ou adicione teste funcional para o fluxo do usuario.
- Alteracao pequena/local: rode apenas os testes relacionados ao local alterado. Se ainda nao existirem testes para cobrir, crie cobertura automatizada de pelo menos 90% do codigo afetado.
- Alteracao major: rode todos os testes em `testes/index.html`.
- O refactor so deve ser considerado concluido quando os fluxos listados em `testes/AGENTS.md` continuarem passando ou tiverem testes atualizados para o novo contrato.

## Estilo De Implementacao

- Prefira mudancas pequenas e verificaveis.
- Mova codigo antes de reescrever comportamento.
- Evite misturar refactor estrutural com mudanca de regra.
- Preserve nomes publicos ate que os testes estejam adaptados.
- Mantenha comentarios apenas onde a regra nao for obvia.
- Nao introduza framework ou build step sem necessidade clara.
- Se for introduzido um runner ou bundler, documente o comando aqui e em `testes/AGENTS.md`.
