# My Cozy Bookshelf — Plano do Projeto

> Este documento é a fonte de verdade do projeto. Antes de implementar qualquer coisa,
> a IA deve ler este plano e seguir as decisões aqui descritas. Em caso de dúvida
> que não esteja respondida aqui, pergunte antes de inventar.

## 1. Contexto

- O projeto nasceu como **"ajuda.me"**: uma lojinha de livros de autoajuda feita em HTML e JavaScript puro.
- Agora ele está sendo reescrito como um projeto **fullstack**: **Java Spring Boot** (backend) + **React** (frontend).
- **A ideia central mudou: NÃO É MAIS UMA LOJA DE LIVROS.**
- O nome agora é **"My Cozy Bookshelf"** (não usar mais "ajuda.me" em lugar nenhum).

## 2. A nova proposta

O My Cozy Bookshelf é uma **estante privada**: cada usuário cadastra os livros que leu
e escreve as **reflexões** que teve com cada um deles.

- É pessoal e privado: cada usuário vê apenas os próprios livros e reflexões.
- A visualização dos livros **simula uma prateleira real**, como se os livros estivessem de fato numa estante.
- O tom é acolhedor, calmo e íntimo, como um cantinho de leitura.

### O que NÃO existe mais (não implementar)

- Carrinho de compras, preços, checkout, pagamento
- Promoções, descontos, selos de "% OFF", banners de lançamento
- Catálogo de venda / vitrine de loja

## 3. Identidade visual

### Mascote
- O **camaleão** continua sendo a identidade visual principal (logo no header e ilustração grande nas telas de login/cadastro).
- Arquivo: `AI Guide/Assets/camaleao.png`

### Paleta de cores
Manter a paleta original. **Só é permitido mudar a cor de fundo e detalhes específicos.**
O azul menta, o verde e o marrom são obrigatórios.

| Papel                          | Cor (aprox., tirada das referências) |
|--------------------------------|--------------------------------------|
| Azul menta (header)            | `#8BF5D7`                            |
| Azul (fundo login/cadastro)    | `#6ADCE4`                            |
| Verde (botões / inputs)        | `#91EBC8`, `#A0D6B2`                 |
| Verde-menta claro (cards)      | `#D3F4ED`, `#C0FFF1`                 |
| Marrom (moldura dos cards)     | `#B4A588`                            |
| Marrom (texto / títulos)       | `#756456`                            |
| Texto do header (verde escuro) | `#56756C`                            |
| Bege (fundo da home, borda do header) | `#E9E1D4`, `#D9D5A3`          |

> Os valores acima são uma base; ajustes finos de tom são permitidos, desde que a paleta continue reconhecível.

### Modo demonstração
- Para quem visita o site (ex.: portfólio), o botão **"ver demonstração"** (no início e no login) abre uma estante de exemplo com usuário "visitante", livros com capa, reflexões e uma reflexão fixada.
- A estante de demonstração é recriada do zero a cada entrada e mostra uma faixa avisando que é uma demonstração, com o botão "criar minha estante".
- Os livros ficam em `frontend/src/services/demoData.ts` e as capas em `frontend/public/demo/` (versões reduzidas das imagens de `AI Guide/Assets/`). Resumos e reflexões são textos próprios, não trechos dos livros.

### Tema escuro
- O site tem **tema claro e escuro**. Ele começa no tema do sistema e o usuário troca no botão de sol/lua do header; a escolha fica salva.
- O escuro é um "cantinho de leitura à noite": fundos em marrom-escuro quente, header em verde-menta escuro, e o **menta, o verde e o marrom continuam sendo a identidade** (botões verdes, textos de destaque em menta, madeira da estante e rodapé marrons).
- As cores ficam em variáveis CSS em `frontend/src/index.css` (`:root` e `:root[data-theme='dark']`). Telas e componentes novos devem usar essas variáveis, nunca cores fixas, para funcionar nos dois temas.
- As capas dos livros (inclusive o placeholder) têm as mesmas cores nos dois temas.

### Plantas
- Manter algumas plantas decorativas (vasos pendurados e vasinhos), como no projeto original.
- Arquivos: `AI Guide/Assets/plantar.png` (vaso pendurado) e `AI Guide/Assets/plantar2.png` (vasinho).

### Tipografia
- Fonte **Quicksand** (Google Fonts) — ver `AI Guide/Assets/font.css`.
- Textos em minúsculas e com tom carinhoso, como no original ("oi amigo, que bom ter você de volta!").

### Voz do projeto: todo livro tem um aprendizado
A ideia central da identidade é que **todo livro ensina alguma coisa**, não só os de autoajuda ou psicologia.
O site deve inspirar o usuário a buscar aprendizado também em romances, fantasias, clássicos etc.

Frases-guia (usar com moderação, em poucos lugares escolhidos, nunca em toda tela):
- **"todo livro tem um aprendizado"**: título do início para quem não está logado e mensagem da estante vazia
- **"temos algo a aprender com todos os livros"**: frase do rodapé
- **"escreva aqui o que você aprendeu"**: subtítulo da seção de reflexões do livro
- **"não precisa terminar o livro pra refletir"**: dica ao marcar um livro como *lendo* e na página de um livro em leitura

Onde a ideia aparece na prática:
- **Perguntas de inspiração no campo de reflexão** (`frontend/src/utils/prompts.ts`): mudam conforme o gênero do livro (ficção, não ficção ou geral) e o botão **"me dá uma ideia"** sorteia outra. Ex.: para ficção, "qual personagem te ensinou alguma coisa?".
- **Estados vazios**: estante vazia e livro sem reflexão convidam a pensar no que o livro ensinou.
- **O camaleão**: ele muda de cor conforme o lugar e "pega um pouquinho da cor de cada livro que lê", ou seja, cada livro deixa algo nele. Essa frase aparece com o mascote no início.
- **Modo demonstração**: os livros de ficção mostram reflexões com aprendizados, não só sentimentos.

### Estilo
- **Tudo arredondado e fofo** (cantos bem arredondados em cards, botões, inputs, livros).
- **Simples e minimalista**, sem excessos, sem elementos sobrando.
- **Flat**: evitar gradientes pesados, sombras fortes e efeitos chamativos (sombras suaves são ok).

## 4. Telas

As referências visuais do projeto original estão em `AI Guide/References/`
(`home.png`, `login.png`, `signin.png`).

### Header (todas as telas)
- **Manter igual ao original**: fundo azul menta, camaleão + nome à esquerda, links à direita, borda inferior bege.
- Trocar o nome para "My Cozy Bookshelf".
- **Remover o botão de carrinho de compras.**
- **Adicionar mais botões** de navegação. Sugestão: `início`, `minha estante`, `adicionar livro`, `login` (ou `sair`, quando logado).

### Tela inicial (home)
- **Não mostra mais promoções** nem carrossel de livros à venda.
- É **personalizável**: o usuário fixa no início uma reflexão, podendo:
  - escolher uma das suas reflexões já escritas como favorita, **ou**
  - escrever uma reflexão nova só para fixar ali.
- Manter o clima do original: fundo claro, plantas decorativas, card central arredondado.
- A reflexão fixada é o **card principal** do início. Logo abaixo, menor, fica o carrossel **"lembranças da estante"**:
  - mostra as outras reflexões do usuário (nunca a fixada), das mais novas para as mais antigas, com a capa e o título do livro; clicar abre o livro;
  - troca sozinho devagar (a cada ~8 s, com fade suave) e pausa com o mouse em cima, com foco do teclado ou quando o sistema pede "reduzir movimento";
  - tem setinhas e bolinhas para navegar (acima de 8 reflexões, um contador "3 / 17" no lugar das bolinhas);
  - só aparece quando há 2 ou mais reflexões para mostrar.

### Login
- **Quase igual ao original** (`login.png`): camaleão grande à esquerda, card com moldura marrom à direita.
- Apenas ajustes necessários para melhorar a qualidade visual (alinhamento, espaçamentos, link "criar conta" estilizado na paleta em vez do azul padrão do navegador, etc.).

### Cadastro (criar conta)
- **Quase igual ao original** (`signin.png`): mesmos campos (nome, email, senha com mínimo de 8 dígitos, confirmar senha).
- Mesma regra: só ajustes para melhorar a qualidade visual.

### Adicionar livro
- Formulário para cadastrar um livro que o usuário leu.
- O cadastro deve ser rápido: só o obrigatório precisa ser preenchido na hora. Os campos opcionais podem ser preenchidos no cadastro ou adicionados/editados depois.
- **Busca automática de livros**: enquanto o usuário digita o título, aparecem sugestões ("é algum desses?"). Escolher uma preenche título, autor, capa, número de páginas e gênero (traduzido para português). O resumo **não** é preenchido, porque ele deve ser escrito com as palavras do usuário.
  - Fonte: **Google Books** primeiro; se falhar ou não achar nada, **Open Library** (`frontend/src/services/bookSearch.ts`).
  - Chave opcional do Google em `VITE_GOOGLE_BOOKS_API_KEY` (`frontend/.env.local`, ver `.env.example`). Sem chave funciona, mas o Google divide a cota por IP.
  - A busca é só uma ajuda: dá para ignorar e preencher tudo à mão.

| Campo             | Obrigatório no cadastro? | Observação                                       |
|-------------------|--------------------------|--------------------------------------------------|
| Título            | **sim**                  | único campo obrigatório                          |
| Capa              | não                      | imagem (URL ou upload); sem capa → placeholder   |
| Autor             | não                      |                                                  |
| Resumo            | não                      | texto curto sobre o livro                        |
| Reflexão          | não                      | o que o usuário sentiu/aprendeu com o livro      |
| Número de páginas | não                      | número inteiro positivo                          |
| Gênero            | não                      |                                                  |
| Tags              | não                      | várias por livro, criadas livremente             |
| Estrelas          | não                      | avaliação de 1 a 5                               |
| Leitura           | já vem marcado "lido"    | "lendo" ou "lido", sempre visível no formulário |

**Capa placeholder:** quando o livro não tem capa, o site mostra uma capa padrão fofinha
no estilo do projeto (flat, arredondada, nas cores da paleta, com um detalhe como o camaleão
ou uma plantinha) e o título do livro escrito nela. O placeholder é gerado no frontend, e no
banco a capa fica vazia. Assim que o usuário adicionar uma capa, ela substitui o placeholder.

### Biblioteca / minha estante
- Mostra todos os livros cadastrados pelo usuário **como se estivessem numa prateleira real** (livros lado a lado em prateleiras de madeira, no estilo fofo/flat do site).
- O usuário pode **procurar livros pelo título** e **filtrar por gênero ou por tags** (sem diferenciar maiúsculas nem acentos). Só os livros encontrados ficam na prateleira.
- Ao clicar em um livro, o usuário consegue ver/editar as reflexões daquele livro e completar ou editar os campos opcionais (autor, resumo, páginas, gênero, tags, estrelas).
- Livros que estão sendo lidos têm uma **fitinha de marcador** na capa, e o filtro da estante também tem **leitura: lendo / lido**. O cabeçalho mostra quantos estão "lendo agora".

### Leitura em andamento e reflexão final
- **Não é preciso terminar o livro para refletir.** Ao cadastrar, o usuário escolhe **lendo** ou **lido**, e pode ir anotando reflexões enquanto lê.
- Toda reflexão aceita uma **página** opcional: a página onde a pessoa parou ou a que fez ela pensar naquilo. Ela aparece como "p. 87" na reflexão e no carrossel do início.
- Na página de um livro em leitura aparece o status **lendo** e o botão **"terminei a leitura"**. Ele abre uma janelinha (pop-up) com o camaleão pedindo a **reflexão final** do livro, com perguntas próprias ("o que esse livro te ensinou, do começo ao fim?").
  - A reflexão final é opcional: dá para "concluir sem reflexão" e escrever depois. Cancelar ou apertar Esc não conclui a leitura.
  - Ao concluir, o livro passa a **lido em <data>**, e a reflexão final fica destacada na lista.
- Na edição do livro dá para voltar para "lendo", e a data de conclusão é apagada.

## 5. MVP

Escopo do MVP (por enquanto é só isso):

1. Cadastro e login de usuário
2. Header novo (sem carrinho, com mais botões)
3. Adicionar livro (só o título é obrigatório; demais campos opcionais)
4. Biblioteca com visual de prateleira (com busca por título e filtros de gênero e tags)
5. Tela inicial personalizada com a reflexão fixada

Tudo que estiver fora dessa lista fica para depois — não implementar sem pedido explícito.

## 6. Stack técnica

| Pasta       | Stack                                                              |
|-------------|--------------------------------------------------------------------|
| `backend/`  | Java 21, Spring Boot 4.1, Spring Data JPA, MySQL, Flyway, Actuator |
| `frontend/` | React + Vite + TypeScript                                          |

- O schema do banco é versionado pelo Flyway (`backend/src/main/resources/db/migration`); o Hibernate fica em `validate`.
- O Vite encaminha `/api/*` para o backend em `localhost:8080`.

### Modelo de dados (rascunho)
- **Usuário**: nome, email, senha (hash).
- **Livro**: pertence a um usuário.
  - Obrigatórios: título, data de cadastro (automática).
  - Opcionais (nullable): capa (URL ou upload), autor, resumo, número de páginas, gênero, estrelas (1–5).
  - Tags: relação muitos-para-muitos (um livro tem várias tags; tags pertencem ao usuário).
- **Reflexão**: pertence a um livro; texto, data, página (opcional) e se é a reflexão final.
- **Leitura do livro**: status `lendo`/`lido` (livros sem status contam como lidos) e data de conclusão.
- **Reflexão fixada na home**: referência a uma reflexão existente **ou** um texto livre escrito só para o início.

## 7. Regras para a IA

- Sempre seguir este plano; se um pedido contrariar o plano, avisar antes de fazer.
- Nunca reintroduzir elementos de loja (carrinho, preço, promoção).
- Nunca usar o nome "ajuda.me".
- Respeitar a paleta, o camaleão, as plantas e o estilo arredondado, fofo, minimalista e flat.
- Textos da interface em português, em minúsculas e com tom acolhedor.
