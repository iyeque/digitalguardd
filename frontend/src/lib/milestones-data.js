// Curated milestone checklist sourced from CDC, AAP, and Raising Children Network
// Each entry: id, label, category, ageMin (months), ageMax (months)

export const MILESTONE_CATEGORIES = [
  { id: "grossMotor", label: "Gross Motor", emoji: "🏃", color: "#9CBFA7" },
  { id: "fineMotor",  label: "Fine Motor",  emoji: "✏️", color: "#F2CA7E" },
  { id: "cognitive",  label: "Cognitive",  emoji: "🧩", color: "#A1BCE3" },
  { id: "emotional",  label: "Emotional", emoji: "💖", color: "#E89D8A" },
];

export const MILESTONES = [
  // Gross Motor (12-60 months)
  { id: "gm_stands", category: "grossMotor", label: "Stands alone briefly", ageMin: 12, ageMax: 15 },
  { id: "gm_walks", category: "grossMotor", label: "Walks independently", ageMin: 12, ageMax: 15 },
  { id: "gm_runs", category: "grossMotor", label: "Runs with coordination", ageMin: 24, ageMax: 30 },
  { id: "gm_kicks", category: "grossMotor", label: "Kicks a ball forward", ageMin: 24, ageMax: 30 },
  { id: "gm_jumps", category: "grossMotor", label: "Jumps with both feet off ground", ageMin: 24, ageMax: 36 },
  { id: "gm_stairs_up", category: "grossMotor", label: "Walks up stairs alone (both feet per step)", ageMin: 24, ageMax: 30 },
  { id: "gm_stairs_alternate", category: "grossMotor", label: "Walks up/down stairs alternating feet", ageMin: 30, ageMax: 42 },
  { id: "gm_throws", category: "grossMotor", label: "Overarm throws a ball", ageMin: 30, ageMax: 42 },
  { id: "gm_tiptoes", category: "grossMotor", label: "Stands on tiptoes briefly", ageMin: 24, ageMax: 36 },
  { id: "gm_tricycle", category: "grossMotor", label: "Pedals a tricycle", ageMin: 30, ageMax: 42 },
  { id: "gm_balance", category: "grossMotor", label: "Balances on one foot briefly", ageMin: 36, ageMax: 48 },
  { id: "gm_hops", category: "grossMotor", label: "Hops on one foot", ageMin: 48, ageMax: 60 },
  { id: "gm_climbs", category: "grossMotor", label: "Clbs onto/off furniture unassisted", ageMin: 24, ageMax: 30 },

  // Fine Motor (12-60 months)
  { id: "fm_holds_cup", category: "fineMotor", label: "Drinks from cup independently", ageMin: 12, ageMax: 18 },
  { id: "fm_scribbles", category: "fineMotor", label: "Scribbles spontaneously", ageMin: 24, ageMax: 30 },
  { id: "fm_turns_pages", category: "fineMotor", label: "Turns book pages one at a time", ageMin: 24, ageMax: 30 },
  { id: "fm_builds_4", category: "fineMotor", label: "Builds tower of 4+ blocks", ageMin: 24, ageMax: 30 },
  { id: "fm_builds_6", category: "fineMotor", label: "Builds tower of 6+ blocks", ageMin: 30, ageMax: 36 },
  { id: "fm_uses_spoon", category: "fineMotor", label: "Eats with spoon with minor spills", ageMin: 24, ageMax: 30 },
  { id: "fm_buttons", category: "fineMotor", label: "Unbuttons large buttons", ageMin: 30, ageMax: 42 },
  { id: "fm_traces", category: "fineMotor", label: "Traces vertical/horizontal lines", ageMin: 36, ageMax: 48 },
  { id: "fm_cuts", category: "fineMotor", label: "Cuts with scissors (snips paper)", ageMin: 36, ageMax: 48 },
  { id: "fm_draws_person", category: "fineMotor", label: "Draws a person with 2-4 body parts", ageMin: 48, ageMax: 60 },
  { id: "fm_holds_crayon", category: "fineMotor", label: "Holds crayon with fingers (not fist)", ageMin: 30, ageMax: 42 },
  { id: "fm_pours", category: "fineMotor", label: "Pours from small container", ageMin: 24, ageMax: 36 },

  // Cognitive (12-60 months)
  { id: "cg_points_body", category: "cognitive", label: "Points to 2+ body parts when asked", ageMin: 24, ageMax: 30 },
  { id: "cg_names_objects", category: "cognitive", label: "Names familiar objects in pictures", ageMin: 24, ageMax: 30 },
  { id: "cg_follows_2step", category: "cognitive", label: "Follows two-step instructions", ageMin: 24, ageMax: 30 },
  { id: "cg_sorts_shape", category: "cognitive", label: "Sorts objects by shape or color", ageMin: 24, ageMax: 36 },
  { id: "cg_hide_seek_2", category: "cognitive", label: "Finds objects hidden under 2-3 covers", ageMin: 24, ageMax: 30 },
  { id: "cg_plays_2toys", category: "cognitive", label: "Plays with 2+ toys at same time", ageMin: 24, ageMax: 30 },
  { id: "cg_knobs_buttons", category: "cognitive", label: "Tries knobs/buttons/switches on toys", ageMin: 24, ageMax: 30 },
  { id: "cg_counts_3", category: "cognitive", label: "Counts to 3 (may skip numbers)", ageMin: 36, ageMax: 48 },
  { id: "cg_counts_5", category: "cognitive", label: "Counts to 5 accurately", ageMin: 48, ageMax: 60 },
  { id: "cg_knows_colors", category: "cognitive", label: "Names at least 1 color", ageMin: 36, ageMax: 48 },
  { id: "cg_knows_abc", category: "cognitive", label: "Recites some letters of alphabet", ageMin: 36, ageMax: 48 },
  { id: "cg_understands_time", category: "cognitive", label: "Understands basic time concepts (morning/night)", ageMin: 36, ageMax: 48 },
  { id: "cg_compares", category: "cognitive", label: "Understands opposites (big/small, up/down)", ageMin: 36, ageMax: 48 },
  { id: "cg_solves_problems", category: "cognitive", label: "Solves simple problems by trial and error", ageMin: 30, ageMax: 42 },

  // Emotional / Social (12-60 months)
  { id: "em_reciprocal_smile", category: "emotional", label: "Smiles back when you smile", ageMin: 12, ageMax: 18 },
  { id: "em_shares_affection", category: "emotional", label: "Shows affection to familiar people", ageMin: 12, ageMax: 18 },
  { id: "em_plays_alongside", category: "emotional", label: "Plays alongside other children (parallel play)", ageMin: 24, ageMax: 30 },
  { id: "em_shows_empathy", category: "emotional", label: "Notices when others are hurt or upset", ageMin: 24, ageMax: 30 },
  { id: "em_takes_turns", category: "emotional", label: "Takes turns in simple games", ageMin: 30, ageMax: 42 },
  { id: "em_separates", category: "emotional", label: "Handles short separations from caregiver", ageMin: 24, ageMax: 36 },
  { id: "em_tantrums", category: "emotional", label: "Has tantrums when frustrated", ageMin: 24, ageMax: 36 },
  { id: "em_imitates", category: "emotional", label: "Imitates adult behaviors during play", ageMin: 24, ageMax: 30 },
  { id: "em_expresses_feelings", category: "emotional", label: "Expresses a range of emotions (happy, sad, mad)", ageMin: 24, ageMax: 30 },
  { id: "em_wants_independence", category: "emotional", label: "Shows strong desire for independence", ageMin: 24, ageMax: 36 },
  { id: "em_joins_play", category: "emotional", label: "Joins in simple group play", ageMin: 36, ageMax: 48 },
  { id: "em_shows_fear", category: "emotional", label: "Shows fear in new situations", ageMin: 24, ageMax: 36 },
  { id: "em_comforts_others", category: "emotional", label: "Offers comfort to a crying friend", ageMin: 36, ageMax: 48 },
  { id: "em_uses_words_feelings", category: "emotional", label: "Uses words to describe feelings", ageMin: 36, ageMax: 48 },
];

export const DEFAULT_MILESTONES = () => {
  const out = {};
  for (const m of MILESTONES) {
    out[m.id] = {
      status: "not-yet", // not-yet | in-progress | mastered
      date: null,
      note: "",
      photo: null, // base64 data url (small)
    };
  }
  return out;
};

export const STATUS_LABELS = {
  "not-yet": "Not Yet",
  "in-progress": "In Progress",
  "mastered": "Mastered",
};

export const STATUS_COLORS = {
  "not-yet": "#EAE3D9",
  "in-progress": "#F2CA7E",
  "mastered": "#9CBFA7",
};
