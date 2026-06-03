import { BIRD_DATASET, ROUNDS } from "./data/birds";
import type { BirdCard, GameState, Player, Question, RoundDefinition } from "./types";
import { sample, shuffle } from "./utils/random";

const QUESTIONS_PER_ROUND = 3;

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
      id: crypto.randomUUID?.() ?? `player-${index + 1}-${Date.now()}`,
      name,
      score: 0,
      stats: { correctAnswers: 0, totalAnswers: 0 },
      binoculars: 2,
    }));
}

export function getRound(state: GameState): RoundDefinition {
  return ROUNDS[Math.min(state.currentRound - 1, ROUNDS.length - 1)];
}

export function isGameComplete(state: GameState): boolean {
  return state.currentRound > ROUNDS.length;
}

function getAvailableBirds(usedBirdIds: string[]): BirdCard[] {
  const used = new Set(usedBirdIds);
  const fresh = BIRD_DATASET.filter((bird) => !used.has(bird.id));
  return fresh.length >= 12 ? fresh : BIRD_DATASET;
}

function optionPool(answer: string, values: string[], count = 4): string[] {
  const uniqueWrong = [...new Set(values.filter((value) => value !== answer))];
  return shuffle([answer, ...sample(uniqueWrong, count - 1)]);
}

export function makeQuestion(state: GameState): Question {
  const round = getRound(state);
  const [bird] = sample(getAvailableBirds(state.usedBirdIds), 1);

  if (round.style === "HABITAT") {
    const choices = optionPool(bird.habitat, BIRD_DATASET.map((item) => item.habitat));
    return {
      bird,
      prompt: `Where would you most expect to encounter ${bird.name}?`,
      choices,
      answer: bird.habitat,
      explanation: bird.clue,
    };
  }

  if (round.style === "TRUE_FALSE") {
    const truthful = Math.random() > 0.5;
    const wrongBird = sample(BIRD_DATASET.filter((item) => item.group !== bird.group), 1)[0] ?? bird;
    const statement = truthful
      ? `${bird.name} is classed here as ${bird.group.toLowerCase()} and often linked with ${bird.habitat.toLowerCase()}.`
      : `${bird.name} is classed here as ${wrongBird.group.toLowerCase()} and mainly linked with ${wrongBird.habitat.toLowerCase()}.`;
    return {
      bird,
      prompt: statement,
      choices: ["True", "False"],
      answer: truthful ? "True" : "False",
      explanation: bird.clue,
    };
  }

  if (round.style === "HIGHER_LOWER") {
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

  if (round.style === "RARITY_SWEEP") {
    const sweep = sample(BIRD_DATASET, 4).sort((a, b) => b.rarity - a.rarity);
    const rarest = sweep[0];
    return {
      bird: rarest,
      prompt: "Choose the rarest bird in this sweepstake.",
      choices: shuffle(sweep.map((item) => item.name)),
      answer: rarest.name,
      explanation: `${rarest.name} has rarity ${rarest.rarity}/5 in this lightweight rule set.`,
    };
  }

  if (round.style === "FINAL") {
    const answer = bird.name;
    return {
      bird,
      prompt: `Final clue: ${bird.clue}`,
      choices: optionPool(answer, BIRD_DATASET.map((item) => item.name)),
      answer,
      explanation: `${bird.name} belongs to ${bird.group}.`,
    };
  }

  return {
    bird,
    prompt: `Identify the bird: ${bird.clue}`,
    choices: optionPool(bird.name, BIRD_DATASET.map((item) => item.name)),
    answer: bird.name,
    explanation: `${bird.name} belongs to ${bird.group}.`,
  };
}

export function applyAnswer(state: GameState, question: Question, selectedAnswer: string): GameState {
  const round = getRound(state);
  const correct = selectedAnswer === question.answer;
  const activePlayer = state.players[state.activePlayerIndex];
  const nextPlayers = state.players.map((player) => {
    if (player.id !== activePlayer.id) return player;
    return {
      ...player,
      score: player.score + (correct ? round.points : 0),
      stats: {
        correctAnswers: player.stats.correctAnswers + (correct ? 1 : 0),
        totalAnswers: player.stats.totalAnswers + 1,
      },
    };
  });

  const nextQuestionNumber = state.questionNumber + 1;
  const endRound = nextQuestionNumber > QUESTIONS_PER_ROUND;
  const nextRound = endRound ? state.currentRound + 1 : state.currentRound;
  const nextPlayerIndex = (state.activePlayerIndex + 1) % Math.max(1, state.players.length);

  return {
    ...state,
    players: nextPlayers,
    activePlayerIndex: nextPlayerIndex,
    currentRound: nextRound,
    questionNumber: endRound ? 1 : nextQuestionNumber,
    usedBirdIds: [...state.usedBirdIds, question.bird.id],
    phase: nextRound > ROUNDS.length ? "gameOver" : "playing",
    lastResult: `${activePlayer.name} ${correct ? "scored" : "missed"}: ${question.explanation}`,
  };
}

export function useBinoculars(state: GameState, question: Question): { state: GameState; choices: string[] } {
  const activePlayer = state.players[state.activePlayerIndex];
  if (!activePlayer || activePlayer.binoculars <= 0 || question.choices.length <= 2) {
    return { state, choices: question.choices };
  }

  const nextPlayers = state.players.map((player) =>
    player.id === activePlayer.id ? { ...player, binoculars: player.binoculars - 1 } : player,
  );
  const wrongChoices = question.choices.filter((choice) => choice !== question.answer);
  const removed = sample(wrongChoices, 1)[0];
  return {
    state: { ...state, players: nextPlayers, lastResult: `${activePlayer.name} used binoculars to remove one wrong option.` },
    choices: question.choices.filter((choice) => choice !== removed),
  };
}

export { BIRD_DATASET, ROUNDS, QUESTIONS_PER_ROUND };
