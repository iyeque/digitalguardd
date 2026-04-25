// English phonics — each letter mapped to its primary short sound.
// Used when phonics mode is enabled in settings.
export const PHONICS = {
  A: "ah",   B: "buh",  C: "kuh",  D: "duh",  E: "eh",
  F: "fff",  G: "guh",  H: "huh",  I: "ih",   J: "juh",
  K: "kuh",  L: "lll",  M: "mmm",  N: "nnn",  O: "ah",
  P: "puh",  Q: "kwuh", R: "rrr",  S: "sss",  T: "tuh",
  U: "uh",   V: "vvv",  W: "wuh",  X: "ks",   Y: "yuh",
  Z: "zzz",
};

export const phoneticsFor = (letter) => PHONICS[letter] || letter;
