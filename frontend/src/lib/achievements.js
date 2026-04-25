// Achievement / sticker definitions, computed from progress data.
import { ACTIVITIES } from "@/lib/data";

export const ACHIEVEMENTS = [
  { id: "first-tap",        label: "First Tap",       desc: "Made the very first tap",        sticker: "Sparkles", color: "#F2CA7E", check: (p) => (p.totalTaps || 0) >= 1 },
  { id: "ten-taps",         label: "Curious Mind",    desc: "10 taps in total",                sticker: "Star",     color: "#9CBFA7", check: (p) => (p.totalTaps || 0) >= 10 },
  { id: "fifty-taps",       label: "Tap Champion",    desc: "50 taps in total",                sticker: "Trophy",   color: "#E89D8A", check: (p) => (p.totalTaps || 0) >= 50 },
  { id: "abc-explorer",     label: "ABC Explorer",    desc: "Tapped letters 5 times",          sticker: "Type",     color: "#A1BCE3", check: (p) => (p.activities?.alphabet?.taps || 0) >= 5 },
  { id: "number-friend",    label: "Number Friend",   desc: "Counted 5 times",                  sticker: "Hash",     color: "#F2CA7E", check: (p) => (p.activities?.numbers?.taps || 0) >= 5 },
  { id: "color-lover",      label: "Color Lover",     desc: "Tried 5 colors",                   sticker: "Palette",  color: "#F0B8C6", check: (p) => (p.activities?.colors?.taps || 0) >= 5 },
  { id: "shape-spotter",    label: "Shape Spotter",   desc: "Solved 5 shape rounds",            sticker: "Shapes",   color: "#A1BCE3", check: (p) => (p.activities?.shapes?.taps || 0) >= 5 },
  { id: "animal-friend",    label: "Animal Friend",   desc: "Met 5 animals",                    sticker: "Rabbit",   color: "#F0B8C6", check: (p) => (p.activities?.animals?.taps || 0) >= 5 },
  { id: "tiny-singer",      label: "Tiny Singer",     desc: "Played a rhyme",                   sticker: "Music",    color: "#9CBFA7", check: (p) => (p.activities?.rhymes?.taps || 0) >= 1 },
  { id: "puzzler",          label: "Puzzler",         desc: "Solved 3 puzzles",                 sticker: "Puzzle",   color: "#E89D8A", check: (p) => (p.activities?.puzzle?.taps || 0) >= 3 },
  { id: "all-rounder",      label: "All Rounder",     desc: "Visited all activities",           sticker: "Crown",    color: "#F2CA7E",
    check: (p) => ACTIVITIES.every(a => (p.activities?.[a.id]?.opens || 0) >= 1) },
];

export const computeAchievements = (progress) => {
  return ACHIEVEMENTS.map(a => ({ ...a, earned: !!a.check(progress) }));
};
