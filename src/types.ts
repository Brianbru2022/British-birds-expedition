export type BirdGroup =
  | "Songbirds"
  | "Raptors"
  | "Waterfowl"
  | "Waders"
  | "Seabirds"
  | "Woodland"
  | "Woodpeckers"
  | "Gamebirds"
  | "Pigeons & Game";

export type Habitat = "Gardens" | "Woodlands" | "Coast" | "Coasts" | "Wetlands" | "Moorland" | "Moorlands" | "Farmland" | "Urban";
export type Diet = "Insects" | "Seeds" | "Fish" | "Small mammals" | "Mammals" | "Birds" | "Omnivore" | "Plants";
export type Conservation = "Green" | "Amber" | "Red";
export type Migratory = "Resident" | "Summer visitor" | "Summer Visitor" | "Winter visitor" | "Winter Visitor" | "Passage migrant" | "Passage Migrant";

export interface BirdCard {
  id: string;
  name: string;
  scientificName?: string;
  group: BirdGroup;
  habitat: Habitat;
  diet: Diet;
  conservation: Conservation;
  migratory: Migratory;
  rarity: 1 | 2 | 3 | 4 | 5;
  wingspan: number;
  length?: number;
  weight?: number;
  clutch: number;
  color?: string;
  clue: string;
}

export type RoundStyle =
  | "IDENTIFY"
  | "TRUE_FALSE"
  | "HABITAT"
  | "GROUP"
  | "DIET"
  | "CONSERVATION"
  | "MIGRATION"
  | "HIGHER_LOWER"
  | "CLUTCH"
  | "RARITY_SWEEP"
  | "FINAL";

export interface RoundDefinition {
  id: number;
  title: string;
  style: RoundStyle;
  points: number;
  blurb: string;
}

export interface PlayerStats {
  correctAnswers: number;
  totalAnswers: number;
  bestStreak: number;
}

export interface PlayerGear {
  binoculars: number;
  sonic: number;
  thermal: number;
  lures: number;
  shields: number;
}

export type ActionCardKind =
  | "reveal_family"
  | "double_points"
  | "protect_streak"
  | "remove_wrong"
  | "swap_options"
  | "gain_binoculars";

export interface ActionCard {
  kind: ActionCardKind;
  name: string;
  description: string;
  icon: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  streak: number;
  gear: PlayerGear;
  cardsInHand: ActionCard[];
  stats: PlayerStats;
}

export interface Question {
  bird: BirdCard;
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
  meta?: string;
}

export interface GameState {
  phase: "intro" | "setup" | "playing" | "gameOver";
  players: Player[];
  activePlayerIndex: number;
  currentRound: number;
  questionNumber: number;
  usedBirdIds: string[];
  doublePointsPlayerId?: string;
  shieldedPlayerId?: string;
  lastResult?: string;
}
