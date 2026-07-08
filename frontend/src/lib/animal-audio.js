// Free animal sound clips (Wikimedia Commons, public domain / CC0).
// Used as direct <audio> src so they need no CORS headers for playback.
export const ANIMAL_SOUNDS = {
  Lion:     'https://upload.wikimedia.org/wikipedia/commons/4/4c/Lion_roar.ogg',
  Tiger:    'https://upload.wikimedia.org/wikipedia/commons/4/4c/Tiger_roar.ogg',
  Elephant: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Elephant_trumpeting.ogg',
  Pig:      'https://upload.wikimedia.org/wikipedia/commons/3/38/Pig_Oinking.ogg',
  Cow:      'https://upload.wikimedia.org/wikipedia/commons/4/47/Cow_moo_sound.ogg',
  Duck:     'https://upload.wikimedia.org/wikipedia/commons/5/57/Duck_quack.ogg',
  Sheep:    'https://upload.wikimedia.org/wikipedia/commons/c/c0/Sheep_baa.ogg',
  Cat:      'https://upload.wikimedia.org/wikipedia/commons/6/68/Meow.ogg',
  Dog:      'https://upload.wikimedia.org/wikipedia/commons/4/43/Dog_barking_sound.ogg',
  Horse:    'https://upload.wikimedia.org/wikipedia/commons/4/42/Horse_neigh.ogg',
  Chicken:  'https://upload.wikimedia.org/wikipedia/commons/8/86/Chicken_cluck.ogg',
  Rooster:  'https://upload.wikimedia.org/wikipedia/commons/6/6e/Rooster_crow.ogg',
  Frog:     'https://upload.wikimedia.org/wikipedia/commons/7/7e/Frog_ribbit.ogg',
  Bee:      'https://upload.wikimedia.org/wikipedia/commons/e/e5/Bee_buzz.ogg',
};

let audioEl = null;
export const playAnimalSound = (name) => {
  if (!('Audio' in window)) return false;
  const url = ANIMAL_SOUNDS[name];
  if (!url) return false;
  try {
    if (audioEl) { try { audioEl.pause(); } catch (_) {} }
    audioEl = new Audio(url);
    audioEl.volume = 0.9;
    audioEl.play().then(() => true).catch(() => false);
    return true;
  } catch (_) { return false; }
};

export const stopAnimalSound = () => {
  if (audioEl) { try { audioEl.pause(); } catch (_) {} audioEl = null; }
};
