# Ficha Editavel - Mage: The Ascension

Projeto HTML + CSS + JavaScript nativo, pronto para rodar no GitHub Pages.

## Como usar

1. Abra `index.html` localmente ou publique a pasta no GitHub Pages.
2. Preencha os campos da ficha.
3. Clique no icone de upload para abrir o modal de fichas.
4. O modal lista os arquivos declarados em `fichas/index.json`.
5. Clique no icone de salvar para salvar a ficha atual na pasta `fichas`.

Para fichas novas, o arquivo e criado como `nome_do_personagem.json`, em snake_case minusculo. Para fichas carregadas pelo modal, o mesmo arquivo JSON e atualizado.

No GitHub Pages, o navegador nao consegue gravar diretamente no repositorio hospedado. O app usa a File System Access API para gravar em uma pasta local `fichas`; na primeira vez, o navegador pode pedir permissao para essa pasta. Depois disso, a permissao fica salva no navegador e o botao de salvar atualiza/cria o JSON automaticamente.

Nao usa frameworks, build ou dependencias externas.
