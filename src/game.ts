import { BIRD_DATASET } from "./data/birds";
import { ROUNDS } from "./data/rounds";
import type { ActionCard, BirdCard, GameState, Player, PlayerGear, Question, RoundDefinition } from "./types";
import { sample, shuffle } from "./utils/random";

export const QUESTIONS_PER_ROUND = 3;

const STARTING_GEAR: PlayerGear = {
  binoculars: 2,
  sonic: 1,
  thermal: 1,
  lures: 1,
  shields: 1,
};

export const ACTION_DECK: ActionCard[] = [
  {
    kind: "reveal_family",
    name: "Family Field Note",
    description: "Reveal the active bird's group, habitat, and diet.",
    icon: "🪶",
  },
  {
    kind: "double_points",
    name: "Double Sighting",
    description: "Double the points for your next correct answer.",
    icon: "✨",
  },
  {
    kind: "protect_streak",
    name: "Expedition Shield",
    description: "Protect your current streak if your next answer is wrong.",
    icon: "🛡️",
  },
  {
    kind: "remove_wrong",
    name: "Sharp Eyes",
    description: "Remove two wrong options from the current question.",
    icon: "👁️",
  },
  {
    kind: "swap_options",
    name: "Fresh Trail",
    description: "Redraw the whole question with a valid new answer set.",
    icon: "🔄",
  },
  {
    kind: "gain_binoculars",
    name: "Borrowed Binoculars",
    description: "Gain one extra binocular use.",
    icon: "🔭",
  },
];

function randomId(prefix: string, index: number): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${prefix}-${index + 1}-${Date.now()}`;
}

export function drawActionCards(count: number): ActionCard[] {
  return sample(ACTION_DECK, count).map((card) => ({ ...card }));
}

export function createFreshGame(): GameState {
  return {
    phase: "intro",
    players: [],
    activePlayerIndex: 0,
    currentRound: 1,
    questionNumber: 1,
    usedBirdIds: [],
  };
}

export function createPlayers(names: string[]): Player[] {
  return names
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((name, index) => ({
      id: randomId("player", index),
      name,
      score: 0,
      streak: 0,
      gear: { ...STARTING_GEAR },
      cardsInHand: drawActionCards(2),
      stats: { correctAnswers: 0, totalAnswers: 0, bestStreak: 0 },
    }));
}

export function getRound(state: GameState): RoundDefinition {
  return ROUNDS[Math.min(state.currentRound - 1, ROUNDS.length - 1)];
}

function activePlayer(state: GameState): Player | undefined {
  return state.players[state.activePlayerIndex];
}

function updateActivePlayer(state: GameState, updater: (player: Player) => Player, note?: string): GameState {
  const player = activePlayer(state);
  if (!player) return state;
  return {
    ...state,
    players: state.players.map((item) => (item.id === player.id ? updater(item) : item)),
    lastResult: note ?? state.lastResult,
  };
}

function getAvailableBirds(usedBirdIds: string[]): BirdCard[] {
  const used = new Set(usedBirdIds);
  const fresh = BIRD_DATASET.filter((bird) => !used.has(bird.id));
  return fresh.length >= 12 ? fresh : BIRD_DATASET;
}

function optionPool(answer: string, values: readonly string[], count = 4): string[] {
  const uniqueWrong = [...new Set(values.filter((value) => value !== answer))];
  return shuffle([answer, ...sample(uniqueWrong, count - 1)]);
}

function choiceValues<K extends keyof BirdCard>(key: K): string[] {
  return [...new Set(BIRD_DATASET.map((bird) => String(bird[key])))];
}

function makeTrueFalseQuestion(bird: BirdCard): Question {
  const truthful = Math.random() > 0.5;
  const wrongBird = sample(BIRD_DATASET.filter((item) => item.group !== bird.group && item.habitat !== bird.habitat), 1)[0] ?? bird;
  const statement = truthful
    ? `${bird.name} is a ${bird.group.toLowerCase()} species associated with ${bird.habitat.toLowerCase()}.`
    : `${bird.name} is a ${wrongBird.group.toLowerCase()} species associated with ${wrongBird.habitat.toLowerCase()}.`;
  return {
    bird,
    prompt: statement,
    choices: ["True", "False"],
    answer: truthful ? "True" : "False",
    explanation: `${bird.name} is classed as ${bird.group} and linked with ${bird.habitat}. ${bird.clue}`,
  };
}

function makeRaritySweepQuestion(): Question {
  const rarityLevels = shuffle([1, 2, 3, 4, 5] as const).slice(0, 4);
  const sweep = rarityLevels.map((rarity) => sample(BIRD_DATASET.filter((bird) => bird.rarity === rarity), 1)[0]).filter(Boolean);
  const rarest = [...sweep].sort((a, b) => b.rarity - a.rarity)[0];
  return {
    bird: rarest,
    prompt: "Choose the rarest bird in this sweepstake.",
    choices: shuffle(sweep.map((bird) => bird.name)),
    answer: rarest.name,
    explanation: `${rarest.name} has rarity ${rarest.rarity}/5 in this rule set.`,
  };
}

export function makeQuestion(state: GameState): Question {
  const round = getRound(state);
  const [bird] = sample(getAvailableBirds(state.usedBirdIds), 1);

  switch (round.style) {
    case "HABITAT":
      return {
        bird,
        prompt: `Where would you most expect to encounter ${bird.name}?`,
        choices: optionPool(bird.habitat, choiceValues("habitat")),
        answer: bird.habitat,
        explanation: `${bird.name} is linked with ${bird.habitat}. ${bird.clue}`,
      };
    case "GROUP":
      return {
        bird,
        prompt: `Which bird group does ${bird.name} belong to?`,
        choices: optionPool(bird.group, choiceValues("group")),
        answer: bird.group,
        explanation: `${bird.name} is classed as ${bird.group}.`,
      };
    case "DIET":
      return {
        bird,
        prompt: `What is ${bird.name}'s primary diet in this field guide?`,
        choices: optionPool(bird.diet, choiceValues("diet")),
        answer: bird.diet,
        explanation: `${bird.name} is listed with a primary diet of ${bird.diet.toLowerCase()}.`,
      };
    case "CONSERVATION":
      return {
        bird,
        prompt: `What is the conservation status for ${bird.name} in this guide?`,
        choices: optionPool(bird.conservation, choiceValues("conservation"), 3),
        answer: bird.conservation,
        explanation: `${bird.name} is marked ${bird.conservation}.`,
      };
    case "MIGRATION":
      return {
        bird,
        prompt: `What seasonal status is listed for ${bird.name}?`,
        choices: optionPool(bird.migratory, choiceValues("migratory")),
        answer: bird.migratory,
        explanation: `${bird.name} is marked as ${bird.migratory}.`,
      };
    case "TRUE_FALSE":
      return makeTrueFalseQuestion(bird);
    case "HIGHER_LOWER": {
      const comparison = sample(BIRD_DATASET.filter((item) => item.id !== bird.id), 1)[0];
      const hasHigherWingspan = bird.wingspan >= comparison.wingspan;
      return {
        bird,
        prompt: `Does ${bird.name} have a larger average wingspan than ${comparison.name} (${comparison.wingspan}cm)?`,
        choices: ["Higher or equal", "Lower"],
        answer: hasHigherWingspan ? "Higher or equal" : "Lower",
        explanation: `${bird.name}: ${bird.wingspan}cm average wingspan. ${comparison.name}: ${comparison.wingspan}cm.`,
      };
    }
    case "CLUTCH": {
      const comparison = sample(BIRD_DATASET.filter((item) => item.id !== bird.id), 1)[0];
      const hasHigherClutch = bird.clutch > comparison.clutch;
      return {
        bird,
        prompt: `Does ${bird.name} usually have a larger clutch than ${comparison.name} (${comparison.clutch} eggs)?`,
        choices: ["Larger clutch", "Smaller or equal clutch"],
        answer: hasHigherClutch ? "Larger clutch" : "Smaller or equal clutch",
        explanation: `${bird.name}: ${bird.clutch} eggs. ${comparison.name}: ${comparison.clutch} eggs.`,
      };
    }
    case "RARITY_SWEEP":
      return makeRaritySweepQuestion();
    case "FINAL":
      return {
        bird,
        prompt: `Final clue: ${bird.clue}`,
        choices: optionPool(bird.name, BIRD_DATASET.map((item) => item.name)),
        answer: bird.name,
        explanation: `${bird.name}${bird.scientificName ? ` (${bird.scientificName})` : ""} belongs to ${bird.group}.`,
      };
    case "IDENTIFY":
    default:
      return {
        bird,
        prompt: `Identify the bird: ${bird.clue}`,
        choices: optionPool(bird.name, BIRD_DATASET.map((item) => item.name)),
        answer: bird.name,
        explanation: `${bird.name}${bird.scientificName ? ` (${bird.scientificName})` : ""} belongs to ${bird.group}.`,
      };
  }
}

export function applyAnswer(state: GameState, question: Question, selectedAnswer: string): GameState {
  const round = getRound(state);
  const player = activePlayer(state);
  if (!player) return state;

  const correct = selectedAnswer === question.answer;
  const doubleActive = state.doublePointsPlayerId === player.id;
  const shieldActive = state.shieldedPlayerId === player.id;
  const pointsGained = correct ? round.points * (doubleActive ? 2 : 1) : 0;

  const nextPlayers = state.players.map((item) => {
    if (item.id !== player.id) return item;
    const nextStreak = correct ? item.streak + 1 : shieldActive ? item.streak : 0;
    return {
      ...item,
      score: item.score + pointsGained,
      streak: nextStreak,
      stats: {
        correctAnswers: item.stats.correctAnswers + (correct ? 1 : 0),
        totalAnswers: item.stats.totalAnswers + 1,
        bestStreak: Math.max(item.stats.bestStreak, nextStreak),
      },
    };
  });

  const nextQuestionNumber = state.questionNumber + 1;
  const endRound = nextQuestionNumber > QUESTIONS_PER_ROUND;
  const nextRound = endRound ? state.currentRound + 1 : state.currentRound;
  const nextPlayerIndex = (state.activePlayerIndex + 1) % Math.max(1, state.players.length);
  const resultText = correct
    ? `${player.name} scored ${pointsGained} point${pointsGained === 1 ? "" : "s"}${doubleActive ? " with Double Sighting" : ""}.`
    : `${player.name} missed${shieldActive ? ", but Expedition Shield protected their streak" : ""}.`;

  return {
    ...state,
    players: nextPlayers,
    activePlayerIndex: nextPlayerIndex,
    currentRound: nextRound,
    questionNumber: endRound ? 1 : nextQuestionNumber,
    usedBirdIds: [...state.usedBirdIds, question.bird.id],
    phase: nextRound > ROUNDS.length ? "gameOver" : "playing",
    doublePointsPlayerId: doubleActive ? undefined : state.doublePointsPlayerId,
    shieldedPlayerId: shieldActive ? undefined : state.shieldedPlayerId,
    lastResult: `${resultText} ${question.explanation}`,
  };
}

export function spendGear(state: GameState, gearName: keyof PlayerGear, note: string): GameState {
  const player = activePlayer(state);
  if (!player || player.gear[gearName] <= 0) return state;
  return updateActivePlayer(
    state,
    (item) => ({ ...item, gear: { ...item.gear, [gearName]: item.gear[gearName] - 1 } }),
    note,
  );
}

export function useBinoculars(state: GameState, question: Question, visibleChoices: readonly string[]): { state: GameState; choices: string[] } {
  const player = activePlayer(state);
  if (!player || player.gear.binoculars <= 0 || visibleChoices.length <= 2) return { state, choices: [...visibleChoices] };
  const wrongChoices = visibleChoices.filter((choice) => choice !== question.answer);
  const removed = sample(wrongChoices, 1)[0];
  return {
    state: spendGear(state, "binoculars", `${player.name} used binoculars to remove one wrong option.`),
    choices: visibleChoices.filter((choice) => choice !== removed),
  };
}

export function removeWrongChoices(question: Question, visibleChoices: readonly string[], count: number): string[] {
  const wrongChoices = visibleChoices.filter((choice) => choice !== question.answer);
  const removed = new Set(sample(wrongChoices, Math.min(count, Math.max(0, visibleChoices.length - 2))));
  return visibleChoices.filter((choice) => !removed.has(choice));
}

export function removeActionCardAt(state: GameState, index: number, note?: string): GameState {
  return updateActivePlayer(
    state,
    (player) => ({ ...player, cardsInHand: player.cardsInHand.filter((_, cardIndex) => cardIndex !== index) }),
    note,
  );
}

export function activateDoublePoints(state: GameState, cardIndex: number): GameState {
  const player = activePlayer(state);
  if (!player) return state;
  return { ...removeActionCardAt(state, cardIndex, `${player.name} primed Double Sighting.`), doublePointsPlayerId: player.id };
}

export function activateShield(state: GameState, cardIndex: number): GameState {
  const player = activePlayer(state);
  if (!player) return state;
  return { ...removeActionCardAt(state, cardIndex, `${player.name} activated Expedition Shield.`), shieldedPlayerId: player.id };
}

export function gainBinoculars(state: GameState, cardIndex: number): GameState {
  const player = activePlayer(state);
  if (!player) return state;
  const afterCard = removeActionCardAt(state, cardIndex);
  return updateActivePlayer(
    afterCard,
    (item) => ({ ...item, gear: { ...item.gear, binoculars: item.gear.binoculars + 1 } }),
    `${player.name} gained one extra binocular use.`,
  );
}

export { BIRD_DATASET, ROUNDS };
