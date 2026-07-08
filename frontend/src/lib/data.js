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

export const AVATARS = [
  { id: "rabbit", emoji: "🐰", label: "Rabbit" },
  { id: "panda",  emoji: "🐼", label: "Panda" },
  { id: "cat",    emoji: "🐱", label: "Cat" },
  { id: "dog",    emoji: "🐶", label: "Dog" },
  { id: "lion",   emoji: "🦁", label: "Lion" },
  { id: "fox",    emoji: "🦊", label: "Fox" },
  { id: "monkey", emoji: "🐵", label: "Monkey" },
  { id: "bear",   emoji: "🐻", label: "Bear" },
];

export const AI_MODELS = {
  "en-US": { name: "English (Amy)" },
  "es-ES": { name: "Español (Sharvard)" },
  "fr-FR": { name: "Français (Siwis)" },
  "sw-KE": { name: "Kiswahili (Lanier)" },
  "ar-SA": { name: "العربية (Kareem)" },
  "de-DE": { name: "Deutsch (Thorsten)" }
};

export const ANIMALS = [
  { name: "Lion",     sound: "Roar",            emoji: "🦁" },
  { name: "Tiger",    sound: "Grrr",            emoji: "🐯" },
  { name: "Elephant", sound: "Trumpet",         emoji: "🐘" },
  { name: "Pig",      sound: "Oink",            emoji: "🐷" },
  { name: "Cow",      sound: "Moo",             emoji: "🐮" },
  { name: "Duck",     sound: "Quack",           emoji: "🦆" },
  { name: "Sheep",    sound: "Baa",             emoji: "🐑" },
  { name: "Cat",      sound: "Meow",            emoji: "🐱" },
  { name: "Dog",      sound: "Woof",            emoji: "🐶" },
  { name: "Horse",    sound: "Neigh",           emoji: "🐴" },
  { name: "Chicken",  sound: "Cluck",           emoji: "🐔" },
  { name: "Rooster",  sound: "Cock-a-doodle-doo", emoji: "🐓" },
  { name: "Frog",     sound: "Ribbit",          emoji: "🐸" },
  { name: "Bee",      sound: "Bzzz",            emoji: "🐝" },
  { name: "Owl",      sound: "Hoo hoo",         emoji: "🦉" },
  { name: "Monkey",   sound: "Ooh ooh aah aah", emoji: "🐵" },
  { name: "Bear",     sound: "Growl",           emoji: "🐻" },
  { name: "Mouse",    sound: "Squeak",          emoji: "🐭" },
  { name: "Snake",    sound: "Hiss",            emoji: "🐍" },
  { name: "Bird",     sound: "Chirp",           emoji: "🐦" },
  { name: "Penguin",  sound: "Honk",            emoji: "🐧" },
  { name: "Kangaroo", sound: "Boing",           emoji: "🦘" },
  { name: "Whale",    sound: "Splash",          emoji: "🐳" },
  { name: "Dolphin",  sound: "Click click",      emoji: "🐬" },
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
  { id: "stories",  title: "Stories", subtitle: "Read me a story",    path: "/stories", colorClass: "wood-card-blue",    icon: "BookOpen" },
  { id: "sketch",   title: "Sketch",  subtitle: "Draw anything",      path: "/sketch",  colorClass: "wood-card-coral",   icon: "PenLine" },
];
