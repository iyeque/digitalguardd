// Static datasets used by all activities
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
  const examples = {
    A: "Apple", B: "Ball", C: "Cat", D: "Dog", E: "Egg",
    F: "Fish", G: "Goat", H: "Hat", I: "Ice", J: "Jam",
    K: "Kite", L: "Lion", M: "Moon", N: "Nest", O: "Owl",
    P: "Pig", Q: "Queen", R: "Rabbit", S: "Sun", T: "Tree",
    U: "Umbrella", V: "Van", W: "Whale", X: "Xylophone", Y: "Yarn", Z: "Zebra",
  };
  return { letter, word: examples[letter] };
});

export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const COLORS = [
  { name: "Red",    hex: "#E89D8A", border: "#D1826E" },
  { name: "Yellow", hex: "#F2CA7E", border: "#D9B064" },
  { name: "Green",  hex: "#9CBFA7", border: "#82A88D" },
  { name: "Blue",   hex: "#A1BCE3", border: "#89A6CF" },
  { name: "Pink",   hex: "#F0B8C6", border: "#D89AAD" },
  { name: "Purple", hex: "#C4B0DD", border: "#A893C7" },
];

export const SHAPES = ["Circle", "Square", "Triangle", "Star", "Heart", "Hexagon"];

export const ANIMALS = [
  { name: "Lion",     sound: "Roar",      emoji: "Roar!",       image: "https://static.prod-images.emergentagent.com/jobs/4631f13f-6176-4f1a-9a11-cb34afa695b5/images/0e5359b9824203f784b90aa650415a974ebd906b6d220a79147f00194e0a05f9.png" },
  { name: "Elephant", sound: "Trumpet",   emoji: "Pawooo!",     image: "https://static.prod-images.emergentagent.com/jobs/4631f13f-6176-4f1a-9a11-cb34afa695b5/images/6f4d789fc63387ba798aff9b7456829be84201e4c8211bdc09af56aa663cba49.png" },
  { name: "Pig",      sound: "Oink",      emoji: "Oink oink!",  image: "https://static.prod-images.emergentagent.com/jobs/4631f13f-6176-4f1a-9a11-cb34afa695b5/images/bb6cb955ed4a6625a07cb8a16d593e36df8fc6d2eb5a460238e1c0e8b00b1a8e.png" },
  { name: "Cow",      sound: "Moo",       emoji: "Moo!",        image: null },
  { name: "Duck",     sound: "Quack",     emoji: "Quack!",      image: null },
  { name: "Sheep",    sound: "Baa",       emoji: "Baaa!",       image: null },
  { name: "Cat",      sound: "Meow",      emoji: "Meow!",       image: null },
  { name: "Dog",      sound: "Woof",      emoji: "Woof!",       image: null },
  { name: "Horse",    sound: "Neigh",     emoji: "Neigh!",      image: null },
  { name: "Frog",     sound: "Ribbit",    emoji: "Ribbit!",     image: null },
  { name: "Bee",      sound: "Buzz",      emoji: "Bzzz!",       image: null },
  { name: "Owl",      sound: "Hoot",      emoji: "Hoo hoo!",    image: null },
  { name: "Monkey",   sound: "Ooh ooh",   emoji: "Ooh ooh aah!",image: null },
  { name: "Bear",     sound: "Growl",     emoji: "Grrr!",       image: null },
];

export const RHYMES = [
  {
    title: "Twinkle Twinkle Little Star",
    lines: [
      "Twinkle, twinkle, little star,",
      "How I wonder what you are.",
      "Up above the world so high,",
      "Like a diamond in the sky.",
      "Twinkle, twinkle, little star,",
      "How I wonder what you are.",
    ],
  },
  {
    title: "The Itsy Bitsy Spider",
    lines: [
      "The itsy bitsy spider climbed up the water spout.",
      "Down came the rain and washed the spider out.",
      "Out came the sun and dried up all the rain,",
      "And the itsy bitsy spider climbed up the spout again.",
    ],
  },
  {
    title: "Old MacDonald Had a Farm",
    lines: [
      "Old MacDonald had a farm, E-I-E-I-O.",
      "And on his farm he had a cow, E-I-E-I-O.",
      "With a moo moo here, and a moo moo there,",
      "Here a moo, there a moo, everywhere a moo moo.",
      "Old MacDonald had a farm, E-I-E-I-O.",
    ],
  },
  {
    title: "Baa Baa Black Sheep",
    lines: [
      "Baa, baa, black sheep, have you any wool?",
      "Yes sir, yes sir, three bags full.",
      "One for the master, one for the dame,",
      "One for the little boy who lives down the lane.",
    ],
  },
];

export const ACTIVITIES = [
  { id: "alphabet", title: "ABC",     subtitle: "Letters & sounds",   path: "/abc",     colorClass: "wood-card-sage",    icon: "Type" },
  { id: "trace",    title: "Tracing", subtitle: "Trace each letter",  path: "/trace",   colorClass: "wood-card-coral",   icon: "PenLine" },
  { id: "numbers",  title: "1 2 3",   subtitle: "Count with me",      path: "/123",     colorClass: "wood-card-mustard", icon: "Hash" },
  { id: "colors",   title: "Colors",  subtitle: "Tap to learn",       path: "/colors",  colorClass: "wood-card-pink",    icon: "Palette" },
  { id: "shapes",   title: "Shapes",  subtitle: "Match the shape",    path: "/shapes",  colorClass: "wood-card-blue",    icon: "Shapes" },
  { id: "puzzle",   title: "Puzzles", subtitle: "Drag and drop",      path: "/puzzle",  colorClass: "wood-card-mustard", icon: "Puzzle" },
  { id: "animals",  title: "Animals", subtitle: "What do they say?",  path: "/animals", colorClass: "wood-card-pink",    icon: "Rabbit" },
  { id: "rhymes",   title: "Rhymes",  subtitle: "Sing along",         path: "/rhymes",  colorClass: "wood-card-sage",    icon: "Music" },
];
