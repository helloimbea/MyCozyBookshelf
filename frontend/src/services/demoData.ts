// Sample shelf for the demo mode. Covers live in public/demo/.
// Titles match the Brazilian editions on the covers; everything else exists in the three languages.
// Summaries and reflections are original texts written for the project (not quotes from the books).
// Fiction books carry reflections with lessons, not just feelings: every book teaches something.
import type { Lang } from '../i18n/context'
import type { GenreKey } from '../i18n/genres'

type L<T = string> = Record<Lang, T>

export type DemoBook = {
  title: string
  author: string
  cover?: string
  genre: GenreKey
  tags: L<string[]>
  stars?: number
  summary?: L
  /** no status = read */
  status?: 'reading'
  reflections: { text: L; page?: number; final?: boolean }[]
  /** the first reflection of this book is pinned to the home page */
  pinned?: boolean
}

export const DEMO_BOOKS: DemoBook[] = [
  {
    title: 'Hábitos Atômicos',
    author: 'James Clear',
    cover: 'atomicos.jpg',
    genre: 'personalDevelopment',
    tags: { en: ['habits', 'productivity'], pt: ['hábitos', 'produtividade'], es: ['hábitos', 'productividad'] },
    stars: 5,
    summary: {
      en: 'how small daily changes, added up over time, build big results.',
      pt: 'como pequenas mudanças diárias, somadas com o tempo, constroem grandes resultados.',
      es: 'cómo pequeños cambios diarios, sumados con el tiempo, construyen grandes resultados.',
    },
    reflections: [
      {
        page: 42,
        text: {
          en: "it's not about the goal, it's about who i want to become, a little bit each day.",
          pt: 'não é sobre a meta, é sobre quem eu quero me tornar, um pouquinho por dia.',
          es: 'no se trata de la meta, sino de quién quiero llegar a ser, un poquito cada día.',
        },
      },
      {
        page: 160,
        text: {
          en: 'i started with 2 minutes of reading before bed. it became my favorite moment of the day.',
          pt: 'comecei com 2 minutos de leitura antes de dormir. já virou meu momento favorito do dia.',
          es: 'empecé con 2 minutos de lectura antes de dormir. ya es mi momento favorito del día.',
        },
      },
      {
        final: true,
        text: {
          en: 'i finished wanting to change just one thing at a time. and going slowly is okay.',
          pt: 'terminei com vontade de mudar uma coisa só de cada vez. e tudo bem ir devagar.',
          es: 'terminé con ganas de cambiar una sola cosa a la vez. e ir despacio está bien.',
        },
      },
    ],
  },
  {
    title: 'A Coragem de Ser Imperfeito',
    author: 'Brené Brown',
    cover: 'coragem.webp',
    genre: 'psychology',
    tags: { en: ['vulnerability', 'courage'], pt: ['vulnerabilidade', 'coragem'], es: ['vulnerabilidad', 'valentía'] },
    stars: 5,
    summary: {
      en: 'on vulnerability, shame and the courage to show up as you are.',
      pt: 'sobre vulnerabilidade, vergonha e a coragem de se mostrar como se é.',
      es: 'sobre la vulnerabilidad, la vergüenza y el valor de mostrarse tal como uno es.',
    },
    reflections: [
      {
        text: {
          en: 'being vulnerable is not weakness. that is exactly where real connection lives.',
          pt: 'ser vulnerável não é fraqueza. é exatamente ali que moram as conexões de verdade.',
          es: 'ser vulnerable no es debilidad. justo ahí viven las conexiones de verdad.',
        },
      },
    ],
    pinned: true,
  },
  {
    title: 'As Coisas que Você Só Vê Quando Desacelera',
    author: 'Haemin Sunim',
    cover: 'desacelera.jpg',
    genre: 'spirituality',
    tags: { en: ['calm', 'mindfulness'], pt: ['calma', 'mindfulness'], es: ['calma', 'mindfulness'] },
    stars: 5,
    summary: {
      en: 'short, gentle texts about calm, relationships and paying attention to the present.',
      pt: 'textos curtos e gentis sobre calma, relações e atenção ao presente.',
      es: 'textos cortos y amables sobre la calma, las relaciones y la atención al presente.',
    },
    reflections: [
      {
        text: {
          en: 'i read one chapter a night, very slowly, just the way the book asks.',
          pt: 'li um capítulo por noite, bem devagar, do jeitinho que o livro pede.',
          es: 'leí un capítulo por noche, bien despacio, tal como el libro lo pide.',
        },
      },
    ],
  },
  {
    title: 'A Coragem de Não Agradar',
    author: 'Ichiro Kishimi & Fumitake Koga',
    cover: 'agradar.jpg',
    genre: 'philosophy',
    tags: { en: ['self-knowledge', 'courage'], pt: ['autoconhecimento', 'coragem'], es: ['autoconocimiento', 'valentía'] },
    stars: 5,
    summary: {
      en: "a dialogue between a philosopher and a young man about alfred adler's psychology and the freedom of not living for other people's approval.",
      pt: 'um diálogo entre um filósofo e um jovem sobre a psicologia de alfred adler e a liberdade de não viver pela aprovação dos outros.',
      es: 'un diálogo entre un filósofo y un joven sobre la psicología de alfred adler y la libertad de no vivir para la aprobación de los demás.',
    },
    reflections: [
      {
        text: {
          en: "i don't need everyone's approval to be on the right path. what a relief.",
          pt: 'eu não preciso da aprovação de todo mundo pra estar no caminho certo. que alívio.',
          es: 'no necesito la aprobación de todo el mundo para estar en el camino correcto. qué alivio.',
        },
      },
    ],
  },
  {
    title: 'Relatos de um Gato Viajante',
    author: 'Hiro Arikawa',
    cover: 'gato-viajante.jpg',
    genre: 'novel',
    tags: { en: ['japan', 'friendship', 'cats'], pt: ['japão', 'amizade', 'gatos'], es: ['japón', 'amistad', 'gatos'] },
    stars: 5,
    summary: {
      en: 'a cat and his owner travel across japan visiting old friends.',
      pt: 'um gato e seu dono atravessam o japão visitando velhos amigos.',
      es: 'un gato y su dueño recorren japón visitando a viejos amigos.',
    },
    reflections: [
      {
        page: 230,
        text: {
          en: 'i cried at this part and wanted to hug every cat in the world.',
          pt: 'chorei nessa parte e fiquei com vontade de abraçar todos os gatos do mundo.',
          es: 'lloré en esta parte y me dieron ganas de abrazar a todos los gatos del mundo.',
        },
      },
      {
        final: true,
        text: {
          en: "i learned that friendship doesn't need words to be whole. and that a goodbye can also be a way of loving.",
          pt: 'aprendi que amizade não precisa de palavras pra ser inteira. e que despedida também pode ser um jeito de amar.',
          es: 'aprendí que la amistad no necesita palabras para estar completa. y que una despedida también puede ser una forma de amar.',
        },
      },
    ],
  },
  {
    title: 'Essencialismo',
    author: 'Greg McKeown',
    cover: 'essencialismo.jpg',
    genre: 'personalDevelopment',
    tags: { en: ['focus', 'productivity'], pt: ['foco', 'produtividade'], es: ['enfoque', 'productividad'] },
    stars: 4,
    summary: {
      en: 'the discipline of doing fewer things, but the right ones.',
      pt: 'a disciplina de fazer menos coisas, mas as coisas certas.',
      es: 'la disciplina de hacer menos cosas, pero las correctas.',
    },
    reflections: [
      {
        text: {
          en: 'saying no to almost everything is what makes room for what really matters.',
          pt: 'dizer não para quase tudo é o que abre espaço para o que importa de verdade.',
          es: 'decir que no a casi todo es lo que abre espacio para lo que de verdad importa.',
        },
      },
    ],
  },
  {
    title: 'A Morte é um Dia que Vale a Pena Viver',
    author: 'Ana Claudia Quintana Arantes',
    cover: 'morte.jpg',
    genre: 'nonFiction',
    tags: { en: ['life', 'care'], pt: ['vida', 'cuidado'], es: ['vida', 'cuidado'] },
    stars: 5,
    summary: {
      en: 'a palliative care doctor talks about death to, deep down, talk about life.',
      pt: 'uma médica de cuidados paliativos fala sobre a morte para, no fundo, falar sobre a vida.',
      es: 'una médica de cuidados paliativos habla de la muerte para, en el fondo, hablar de la vida.',
    },
    reflections: [
      {
        text: {
          en: 'talking about death made me want to live more present. such a beautiful book.',
          pt: 'falar de morte me deu vontade de viver com mais presença. que livro bonito.',
          es: 'hablar de la muerte me dio ganas de vivir con más presencia. qué libro tan bonito.',
        },
      },
    ],
  },
  {
    title: 'Tao Te Ching',
    author: 'Lao-Tzu',
    cover: 'tao-te-ching.jpg',
    genre: 'philosophy',
    tags: { en: ['calm', 'classic'], pt: ['calma', 'clássico'], es: ['calma', 'clásico'] },
    stars: 5,
    summary: {
      en: 'ancient verses on simplicity, balance and the way of things.',
      pt: 'versos antigos sobre simplicidade, equilíbrio e o caminho das coisas.',
      es: 'versos antiguos sobre la sencillez, el equilibrio y el camino de las cosas.',
    },
    reflections: [
      {
        text: {
          en: 'water wins over stone without forcing anything. i want to be a little more like water.',
          pt: 'a água vence a pedra sem fazer força. quero ser um pouco mais água.',
          es: 'el agua vence a la piedra sin hacer fuerza. quiero ser un poco más agua.',
        },
      },
    ],
  },
  {
    title: 'O Palhaço e o Psicanalista',
    author: 'Christian Dunker & Cláudio Thebas',
    cover: 'palhaco.jpg',
    genre: 'psychology',
    tags: { en: ['listening', 'communication'], pt: ['escuta', 'comunicação'], es: ['escucha', 'comunicación'] },
    stars: 4,
    summary: {
      en: 'a light and deep conversation about truly listening to others.',
      pt: 'uma conversa leve e profunda sobre escutar os outros de verdade.',
      es: 'una conversación ligera y profunda sobre escuchar de verdad a los demás.',
    },
    status: 'reading',
    reflections: [
      {
        page: 22,
        text: {
          en: 'listening is not waiting for my turn to talk.',
          pt: 'escutar não é esperar a minha vez de falar.',
          es: 'escuchar no es esperar mi turno para hablar.',
        },
      },
      {
        page: 58,
        text: {
          en: 'the clown listens too: he pays attention to the audience to know what to do. i loved that.',
          pt: 'o palhaço também escuta: presta atenção no público pra saber o que fazer. achei lindo.',
          es: 'el payaso también escucha: presta atención al público para saber qué hacer. me pareció precioso.',
        },
      },
    ],
  },
  {
    title: 'Acolhendo Sua Criança Interior',
    author: 'Stefanie Stahl',
    cover: 'crianca-interior.jpg',
    genre: 'psychology',
    tags: { en: ['self-knowledge', 'childhood'], pt: ['autoconhecimento', 'infância'], es: ['autoconocimiento', 'infancia'] },
    stars: 4,
    summary: {
      en: 'how childhood experiences shape our beliefs and how to care for them as adults.',
      pt: 'como as experiências da infância moldam nossas crenças e como cuidar delas na vida adulta.',
      es: 'cómo las experiencias de la infancia moldean nuestras creencias y cómo cuidarlas en la vida adulta.',
    },
    reflections: [
      {
        text: {
          en: 'some of my reactions make much more sense now. i can treat myself more kindly.',
          pt: 'algumas reações minhas fazem muito mais sentido agora. dá pra me tratar com mais carinho.',
          es: 'algunas de mis reacciones tienen mucho más sentido ahora. puedo tratarme con más cariño.',
        },
      },
    ],
  },
  {
    title: 'Sociedade do Cansaço',
    author: 'Byung-Chul Han',
    cover: 'sociedade-do-cansaco.jpg',
    genre: 'philosophy',
    tags: { en: ['tiredness', 'society'], pt: ['cansaço', 'sociedade'], es: ['cansancio', 'sociedad'] },
    stars: 4,
    summary: {
      en: 'a short essay about the excess of performance and the exhaustion of our time.',
      pt: 'um ensaio curto sobre o excesso de desempenho e o esgotamento do nosso tempo.',
      es: 'un ensayo corto sobre el exceso de rendimiento y el agotamiento de nuestro tiempo.',
    },
    reflections: [
      {
        text: {
          en: 'resting is also a way of resisting.',
          pt: 'descansar também é um jeito de resistir.',
          es: 'descansar también es una forma de resistir.',
        },
      },
    ],
  },
  {
    title: 'Como Fazer Amigos e Influenciar Pessoas',
    author: 'Dale Carnegie',
    cover: 'amigos.jpg',
    genre: 'personalDevelopment',
    tags: { en: ['relationships', 'communication'], pt: ['relações', 'comunicação'], es: ['relaciones', 'comunicación'] },
    stars: 4,
    summary: {
      en: 'a classic about communicating better and building kinder relationships.',
      pt: 'um clássico sobre se comunicar melhor e criar relações mais gentis.',
      es: 'un clásico sobre comunicarse mejor y crear relaciones más amables.',
    },
    reflections: [
      {
        text: {
          en: "remembering people's names and listening carefully already changes so much.",
          pt: 'lembrar o nome das pessoas e ouvir com atenção já muda tanta coisa.',
          es: 'recordar el nombre de las personas y escuchar con atención ya cambia muchísimo.',
        },
      },
    ],
  },
  {
    title: 'Inteligência Social',
    author: 'Daniel Goleman',
    cover: 'inteligencia-social.jpg',
    genre: 'psychology',
    tags: { en: ['relationships', 'communication'], pt: ['relações', 'comunicação'], es: ['relaciones', 'comunicación'] },
    stars: 4,
    summary: {
      en: 'what science says about how we connect and affect each other.',
      pt: 'o que a ciência diz sobre como nos conectamos e afetamos uns aos outros.',
      es: 'lo que dice la ciencia sobre cómo nos conectamos y nos afectamos unos a otros.',
    },
    status: 'reading',
    reflections: [
      {
        page: 34,
        text: {
          en: 'we catch the mood of the people around us without noticing. i want to choose better who i spend my day with.',
          pt: 'a gente pega o humor das pessoas em volta sem perceber. quero escolher melhor com quem passo o dia.',
          es: 'nos contagiamos del humor de quienes nos rodean sin darnos cuenta. quiero elegir mejor con quién paso el día.',
        },
      },
      {
        page: 87,
        text: {
          en: 'truly listening is almost a superpower. writing it down to practice this week.',
          pt: 'ouvir de verdade é quase um superpoder. anotando pra praticar essa semana.',
          es: 'escuchar de verdad es casi un superpoder. lo anoto para practicarlo esta semana.',
        },
      },
    ],
  },
  {
    title: 'O Homem Mais Rico da Babilônia',
    author: 'George S. Clason',
    cover: 'homem-mais-rico.jpg',
    genre: 'finance',
    tags: { en: ['money', 'classic'], pt: ['dinheiro', 'clássico'], es: ['dinero', 'clásico'] },
    stars: 4,
    summary: {
      en: 'parables from ancient babylon about saving, investing and taking care of money.',
      pt: 'parábolas na antiga babilônia sobre poupar, investir e cuidar do dinheiro.',
      es: 'parábolas de la antigua babilonia sobre ahorrar, invertir y cuidar el dinero.',
    },
    reflections: [
      {
        text: {
          en: 'keep a part of everything i earn. that simple, and i never did it.',
          pt: 'guardar uma parte de tudo que eu ganho. simples assim, e eu nunca fazia.',
          es: 'guardar una parte de todo lo que gano. así de simple, y nunca lo hacía.',
        },
      },
    ],
  },
  {
    title: 'A Vida é Curta Demais pra Viver o Mínimo das Coisas',
    author: 'Iandê Albuquerque',
    cover: 'minimo.jpg',
    genre: 'chronicles',
    tags: { en: ['affection', 'courage'], pt: ['afeto', 'coragem'], es: ['afecto', 'valentía'] },
    stars: 4,
    status: 'reading',
    reflections: [
      {
        page: 23,
        text: {
          en: 'a book to read with a coffee nearby and a highlighter in hand.',
          pt: 'um livro pra ler com um café do lado e um marca-texto na mão.',
          es: 'un libro para leer con un café al lado y un marcador en la mano.',
        },
      },
    ],
  },
  {
    title: "Não Faça Tempestade em Copo d'Água",
    author: 'Richard Carlson',
    cover: 'copo.jpg',
    genre: 'selfHelp',
    tags: { en: ['calm', 'anxiety'], pt: ['calma', 'ansiedade'], es: ['calma', 'ansiedad'] },
    stars: 4,
    summary: {
      en: "small reflections so the little things don't take over the day.",
      pt: 'pequenas reflexões para não deixar as coisas pequenas tomarem conta do dia.',
      es: 'pequeñas reflexiones para que las cosas pequeñas no se adueñen del día.',
    },
    reflections: [
      {
        text: {
          en: "almost everything that keeps me up tonight won't matter a year from now.",
          pt: 'quase tudo que me tira o sono hoje não vai importar daqui a um ano.',
          es: 'casi todo lo que hoy me quita el sueño no va a importar dentro de un año.',
        },
      },
    ],
  },
  {
    title: 'Quebrando o Hábito de Ser Você Mesmo',
    author: 'Joe Dispenza',
    cover: 'habito.jpg',
    genre: 'selfHelp',
    tags: { en: ['habits', 'mind'], pt: ['hábitos', 'mente'], es: ['hábitos', 'mente'] },
    stars: 3,
    summary: {
      en: 'about thoughts, emotions and the idea of rebuilding the patterns of the mind.',
      pt: 'sobre pensamentos, emoções e a ideia de reconstruir os padrões da mente.',
      es: 'sobre pensamientos, emociones y la idea de reconstruir los patrones de la mente.',
    },
    status: 'reading',
    reflections: [],
  },
  {
    title: 'Quem Mexeu no Meu Queijo?',
    author: 'Spencer Johnson',
    cover: 'queijo.jpg',
    genre: 'selfHelp',
    tags: { en: ['change'], pt: ['mudança'], es: ['cambio'] },
    stars: 3,
    summary: {
      en: 'a short fable about how we deal with change.',
      pt: 'uma fábula curtinha sobre como lidamos com as mudanças.',
      es: 'una fábula cortita sobre cómo enfrentamos los cambios.',
    },
    status: 'reading',
    reflections: [
      {
        page: 31,
        text: {
          en: 'i saw myself in the character who keeps waiting for the cheese to come back. sometimes it is time to move.',
          pt: 'me reconheci no personagem que fica esperando o queijo voltar. às vezes é hora de sair do lugar.',
          es: 'me reconocí en el personaje que se queda esperando que vuelva el queso. a veces es hora de moverse.',
        },
      },
    ],
  },
  // no cover: these show the placeholder cover
  {
    title: 'O Pequeno Príncipe',
    author: 'Antoine de Saint-Exupéry',
    genre: 'fable',
    tags: { en: ['classic', 'friendship'], pt: ['clássico', 'amizade'], es: ['clásico', 'amistad'] },
    stars: 5,
    reflections: [
      {
        text: {
          en: 'the fox taught me that it is the time we give to someone that makes them unique to us.',
          pt: 'a raposa me ensinou que é o tempo que a gente dedica a alguém que torna essa pessoa única.',
          es: 'el zorro me enseñó que es el tiempo que le dedicamos a alguien lo que lo hace único para nosotros.',
        },
      },
      {
        text: {
          en: 'every time i reread it, i understand something new.',
          pt: 'toda vez que releio, entendo uma coisa nova.',
          es: 'cada vez que lo releo, entiendo algo nuevo.',
        },
      },
    ],
  },
  {
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: 'novel',
    tags: { en: ['classic', 'brazil'], pt: ['clássico', 'brasil'], es: ['clásico', 'brasil'] },
    stars: 4,
    reflections: [
      {
        text: {
          en: 'i learned that every story has more than one side, and that whoever tells it also chooses what to show.',
          pt: 'aprendi que toda história tem mais de um lado, e que quem conta também escolhe o que mostrar.',
          es: 'aprendí que toda historia tiene más de un lado, y que quien la cuenta también elige qué mostrar.',
        },
      },
      {
        text: {
          en: "to this day i don't know what to think of capitu. and i think that's the charm.",
          pt: 'até hoje não sei o que pensar da capitu. e acho que essa é a graça.',
          es: 'hasta hoy no sé qué pensar de capitu. y creo que esa es la gracia.',
        },
      },
    ],
  },
]
