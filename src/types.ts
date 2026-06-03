export type BirdGroup = "Songbirds" | "Raptors" | "Waterfowl" | "Seabirds" | "Waders" | "Gamebirds" | "Woodland";
export type Habitat = "Gardens" | "Woodlands" | "Wetlands" | "Coast" | "Farmland" | "Moorland" | "Urban";
export type Diet = "Seeds" | "Insects" | "Fish" | "Small mammals" | "Omnivore" | "Plants";
export type Conservation = "Green" | "Amber" | "Red";
export type Migratory = "Resident" | "Summer visitor" | "Winter visitor" | "Passage migrant";

export interface BirdCard {
  id: string;
  name: string;
  group: BirdGroup;
  habitat: Habitat;
  diet: Diet;
  conservation: Conservation;
  migratory: Migratory;
  rarity: number;
  wingspan: number;
  clutch: number;
  clue: string;
}

export type RoundStyle = "IDENTIFY" | "TRUE_FALSE" | "HABITAT" | "HIGHER_LOWER" | "RARITY_SWEEP" | "FINAL";

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
}

export interface Player {
  id: string;
  name: string;
  score: number;
  stats: PlayerStats;
  binoculars: number;
}

export interface Question {
  bird: BirdCard;
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
}

export interface GameState {
  phase: "intro" | "setup" | "playing" | "gameOver";
  players: Player[];
  activePlayerIndex: number;
  currentRound: number;
  questionNumber: number;
  usedBirdIds: string[];
  lastResult?: string;
}
