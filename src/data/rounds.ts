import type { RoundDefinition } from "../types";

export const ROUNDS: RoundDefinition[] = [
  { id: 1, title: "Garden ID Warm-up", style: "IDENTIFY", points: 2, blurb: "Pick the bird from a clean multiple-choice clue." },
  { id: 2, title: "Habitat Hunch", style: "HABITAT", points: 2, blurb: "Match the species to its likely habitat." },
  { id: 3, title: "True or False Trail", style: "TRUE_FALSE", points: 2, blurb: "Spot the false field-note." },
  { id: 4, title: "Wingspan Duel", style: "HIGHER_LOWER", points: 3, blurb: "Judge whether the expedition bird has a bigger wingspan." },
  { id: 5, title: "Family Finder", style: "GROUP", points: 3, blurb: "Use behaviour and habitat clues to spot the bird family." },
  { id: 6, title: "Wetland Sweep", style: "HABITAT", points: 3, blurb: "Separate reeds, coast, farmland, and woods." },
  { id: 7, title: "Migration Map", style: "MIGRATION", points: 3, blurb: "Choose the seasonal movement pattern." },
  { id: 8, title: "Coastal Calls", style: "IDENTIFY", points: 3, blurb: "A sea-watch style identification round." },
  { id: 9, title: "Clutch Size Clash", style: "CLUTCH", points: 4, blurb: "Compare clutch sizes and take the point." },
  { id: 10, title: "Conservation Checkpoint", style: "CONSERVATION", points: 4, blurb: "Learn which birds need the most help." },
  { id: 11, title: "Woodland Wander", style: "HABITAT", points: 4, blurb: "Focus on woodland, garden, and edge species." },
  { id: 12, title: "Feathered Families", style: "GROUP", points: 4, blurb: "Use group clues to identify the card." },
  { id: 13, title: "Farmland Forage", style: "DIET", points: 4, blurb: "Track what birds forage for across fields and hedges." },
  { id: 14, title: "Diet Detective", style: "DIET", points: 5, blurb: "Check whether the diet clue fits." },
  { id: 15, title: "Expedition Midpoint", style: "IDENTIFY", points: 5, blurb: "A broader mixed clue challenge." },
  { id: 16, title: "Rare Visitor Watch", style: "RARITY_SWEEP", points: 5, blurb: "Choose the rarest bird in the sweepstake." },
  { id: 17, title: "Passage Migrants", style: "MIGRATION", points: 5, blurb: "A late-game seasonal challenge." },
  { id: 18, title: "Big Bird or Small Bird", style: "HIGHER_LOWER", points: 5, blurb: "Risk a call on size and wingspan." },
  { id: 19, title: "Rarity Sweepstake", style: "RARITY_SWEEP", points: 6, blurb: "Fixed: this round scores by rarity, not clutch size." },
  { id: 20, title: "Grand Finale", style: "FINAL", points: 8, blurb: "Final mixed expedition challenge." },
];
