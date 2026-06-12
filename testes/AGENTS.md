# Guia De Testes

Esta pasta concentra os testes automatizados da ficha de Mage: The Ascension.

- `unitarios/`: testes de regras puras, normalizacao de dados, calculos e serializacao.
- `funcionais/`: testes de fluxos de usuario no navegador, integracao entre UI, estado e persistencia.
- `test-harness.js`: runner minimo usado pelas suites.
- `testes.css`: estilos dos runners.

## Como Rodar

Este projeto ainda nao usa dependencias de build/teste. Os testes rodam direto no navegador, como o proprio app.

Abra:

- `testes/unitarios/index.html` para rodar a suite unitaria.
- `testes/funcionais/index.html` para rodar a suite funcional.
- `testes/index.html` para rodar todas as suites.

O resultado aparece no topo da pagina. O titulo da aba tambem muda para `PASS ...` ou `FAIL ...`.

Para gerar um arquivo de log que possa ser lido depois por agentes/codigo, rode o servidor de testes a partir da raiz do projeto:

```powershell
python testes/serve-tests.py
```

Depois abra `http://127.0.0.1:8765/testes/index.html`. Ao concluir, o runner grava `testes/test-results.json`. Se a pagina for aberta por `file://` ou por outro servidor estatico, o log ainda aparece na tela, fica em `localStorage` e pode ser baixado pelo link `Baixar log`.

Regra geral:

- Alteracao pequena/local: rode apenas os testes relacionados ao local alterado. Se ainda nao existirem testes que cubram esse comportamento, crie cobertura automatizada para pelo menos 90% do codigo.
- Alteracao major: rode todos os testes unitarios e funcionais.
- Correcao de bug: adicione primeiro um teste que falhe com o bug atual, depois implemente a correcao e rode os testes relacionados.
- Mudanca em regra compartilhada, serializacao, salvamento, carregamento, linhagem, XP/freebies ou integracao de IA: trate como alteracao de risco ampliado e rode tambem os fluxos funcionais principais.

## Fluxos Da Ficha

### Inicializacao

A ficha deve renderizar a UI principal sem erro: campos de identidade, controles de saude, bolinhas de atributos, habilidades, esferas, vantagens, paineis de linhagem, modais e acoes principais. As bolinhas devem iniciar bloqueadas fora do modo de edicao, a saude deve iniciar sem dano e os campos numericos devem ter defaults consistentes.

### Identidade

Inclui nome do personagem, cronica e experiencia/freebies. O nome e obrigatorio para salvar ou enviar ao GitHub. O nome tambem define o titulo da ficha e o arquivo em `snake_case`, removendo acentos e caracteres especiais.

### Imagem Do Personagem

Inclui upload, validacao de tipo de arquivo, corte quadrado, preview, persistencia em `identity.image`, remocao por modal de confirmacao, escrita local/GitHub e remocao da imagem antiga quando houver substituicao.

### Campos Livres

Inclui notas, foco magico e laboratorio. Os campos devem atualizar o estado conforme o usuario digita, carregar corretamente a partir de JSON e manter textos longos e quebras de linha na serializacao.

### Bolinhas E Edicao De Niveis

Inclui atributos, habilidades, antecedentes, esferas, Arcana e Forca de Vontade. Fora do modo de edicao, bolinhas nao alteram estado. No modo de edicao, clique aumenta ou reduz niveis, calcula custo, consome ou devolve XP e respeita maximos.

### Custos De XP

Custos atuais:

- Atributos: `4 * nivel comprado`.
- Habilidades: `2 * nivel comprado`.
- Antecedentes: `1 * nivel comprado`.
- Esferas: `7 * nivel comprado`.
- Arcana: `8 * nivel comprado`.
- Forca de Vontade: `1 * nivel comprado`.

Os testes unitarios devem cobrir aumento, reducao, custo zero, maximo e XP insuficiente.

### Criacao De Personagem

Novo personagem entra em modo de criacao, usa `Freebies` no lugar de experiencia, inicia com 15 freebies, atributos em 1, Arcana em 1, demais niveis em 0 e saude limpa. O painel de prioridades deve aparecer e o resumo deve refletir pools e gastos.

### Prioridades De Criacao

Inclui prioridades primaria, secundaria e terciaria para atributos e habilidades. Os selects nao devem permitir duplicidade efetiva. Orcamentos atuais:

- Atributos: 7, 5 e 3.
- Habilidades: 13, 9 e 5.

Mudancas de prioridade devem sincronizar `state.creation`, recalcular freebies e atualizar o resumo.

### Limites E Freebies Na Criacao

Esferas nao podem exceder Arcana. Arcana nao pode cair abaixo da maior esfera comprada. O pool compartilhado de Arcana, Esferas e Forca de Vontade tem 6 pontos iniciais. Backgrounds tem 7 pontos iniciais. Gastos acima desses limites devem consumir freebies.

### Saude

Inclui dano contusivo `/`, letal `X` e agravado `*`, ordenados por severidade. A ficha deve aplicar dano, curar por tipo, limitar a 7 caixas, atualizar nivel de saude, penalidade de dados, estado incapacitado e compatibilidade com o formato legado baseado em `health.level`.

### Linhagem

Inclui nome da linhagem, arquivo em `linhagens/nome.json`, membros, cronica do membro, status vivo/morto e persistencia separada da ficha. A ficha deve bloquear salvamento de linhagem com dados mas sem nome.

### XP E Rating Da Linhagem

Inclui conversao entre rating e XP, suporte a rating fracionario, suporte legado, render de bolinhas parciais e exibicao de XP formatado. Quando `sphereExperience` existir, ele deve ser a fonte principal e sincronizar `spheres`.

### Morte E Heranca Da Linhagem

Ao confirmar morte de um membro, a ficha do personagem deve ser buscada no GitHub, o XP ganho depois da criacao deve ser calculado, metade deve ser transferida para a linhagem e a contribuicao deve ficar registrada no membro. Reviver um membro deve remover exatamente a contribuicao registrada.

### Bonus De Linhagem Na Criacao

O botao de herdar esferas da linhagem so deve ficar disponivel no modo de criacao, com pool inicial concluido, freebies zerados, linhagem carregada e XP suficiente. A aplicacao deve aumentar esferas ate o nivel compravel, registrar `creation.lineageSphereBonus` e nao duplicar bonus em aplicacoes futuras.

### Carregamento De Fichas

Inclui carregar JSON local, carregar lista local via `fichas/index.json`, carregar do GitHub raw e carregar linhagem associada. Deve normalizar manifestos com strings ou objetos, lidar com JSON invalido, falha de rede/manifesto e migrar o formato legado de linhagem embutida.

### Salvamento Local

Inclui File System Access API, fallback por download, escrita de JSON da ficha, escrita de linhagem, escrita/remocao de imagem e atualizacao de `fichas/index.json`. AbortError do seletor de pasta nao deve disparar download.

### Upload Para GitHub

Inclui modal de credenciais, validacao de repositorio, Contents API, upsert de ficha, upsert de linhagem, upsert/remocao de imagem, remocao de arquivo antigo ao renomear ficha e atualizacao de manifestos. Usuario, repositorio, branch e pasta podem ser salvos no `localStorage`; PAT nao deve ser persistido.

### Autosave

Autosave e ativado apos upload manual para GitHub. Deve mostrar countdown, comparar conteudo atual com o ultimo salvo, evitar envio quando nada mudou, enviar ficha/linhagem/imagem quando houver mudanca, mostrar feedback e reagendar apos sucesso ou erro.

### Integracao De IA

Inclui perguntas salvas em `state.ai`, geracao de prompt via `window.aiPromptTemplate`, copia para clipboard, recebimento de JSON, extracao de JSON em texto livre ou bloco fenced, preview, confirmacao e rollback. Durante preview, salvar/GitHub devem ficar ocultos e campos, bolinhas, steppers e saude devem ficar bloqueados.

### Serializacao E Compatibilidade

`sheetJson` deve normalizar saude, garantir defaults numericos, garantir `creationSnapshot`, sincronizar `identity.lineage`, remover `state.lineage` legado e produzir JSON parseavel. `lineageJson` deve incluir nome, esferas, XP por esfera e membros filtrados com status e contribuicoes.

### Modais E Navegacao

Inclui modal inicial, fichas, GitHub, IA, carregar linhagem, morte, reviver e remover imagem. Todos devem fechar por botao, backdrop quando aplicavel e Escape. Cancelamentos devem limpar estados pendentes.

### Acessibilidade E Estado Visual

Inclui `aria-label`, `role=checkbox`, `aria-checked`, estados disabled, classes de sugestao da IA e classes de bonus de linhagem. Mudancas funcionais devem preservar sinais visuais e atributos acessiveis que comunicam estado.
