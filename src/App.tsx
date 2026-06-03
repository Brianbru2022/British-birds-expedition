import { useEffect, useMemo, useState } from "react";
import { applyAnswer, BIRD_DATASET, createFreshGame, createPlayers, getRound, makeQuestion, ROUNDS, useBinoculars } from "./game";
import type { GameState, Question } from "./types";
import { clearGame, loadGame, saveGame } from "./utils/storage";

function newQuestion(state: GameState): Question | null {
  return state.phase === "playing" && state.players.length > 0 ? makeQuestion(state) : null;
}

export default function App() {
  const [savedGame, setSavedGame] = useState<GameState | null>(() => loadGame());
  const [game, setGame] = useState<GameState>(() => createFreshGame());
  const [names, setNames] = useState<string[]>(["Player 1", "Player 2"]);
  const [question, setQuestion] = useState<Question | null>(() => newQuestion(game));
  const [visibleChoices, setVisibleChoices] = useState<string[]>([]);
  const [guideQuery, setGuideQuery] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);

  const round = game.phase === "playing" ? getRound(game) : ROUNDS[Math.min(game.currentRound - 1, ROUNDS.length - 1)];
  const activePlayer = game.players[game.activePlayerIndex];
  const leaders = [...game.players].sort((a, b) => b.score - a.score);

  useEffect(() => {
    if (game.phase === "playing") {
      saveGame(game);
      setSavedGame(game);
    }
    if (game.phase === "gameOver") {
      clearGame();
      setSavedGame(null);
    }
  }, [game]);

  useEffect(() => {
    const nextQuestion = newQuestion(game);
    setQuestion(nextQuestion);
    setVisibleChoices(nextQuestion?.choices ?? []);
  }, [game.phase, game.currentRound, game.questionNumber, game.activePlayerIndex]);

  const filteredGuide = useMemo(() => {
    const query = guideQuery.trim().toLowerCase();
    return BIRD_DATASET.filter((bird) =>
      query.length === 0 || [bird.name, bird.group, bird.habitat, bird.diet, bird.conservation].some((value) => value.toLowerCase().includes(query)),
    ).slice(0, 80);
  }, [guideQuery]);

  function startSetup() {
    clearGame();
    setSavedGame(null);
    setGame({ ...createFreshGame(), phase: "setup" });
  }

  function continueGame() {
    const saved = loadGame();
    if (saved) setGame(saved);
  }

  function startGame() {
    const players = createPlayers(names);
    if (players.length < 2) return;
    setGame({ ...createFreshGame(), phase: "playing", players });
  }

  function answer(choice: string) {
    if (!question) return;
    setGame((current) => applyAnswer(current, question, choice));
  }

  function addPlayer() {
    setNames((current) => [...current, `Player ${current.length + 1}`].slice(0, 6));
  }

  function updateName(index: number, value: string) {
    setNames((current) => current.map((name, nameIndex) => (nameIndex === index ? value : name)));
  }

  function removePlayer(index: number) {
    setNames((current) => current.filter((_, nameIndex) => nameIndex !== index));
  }

  function handleUseBinoculars() {
    if (!question) return;
    setGame((current) => {
      const result = useBinoculars(current, question);
      setVisibleChoices(result.choices);
      return result.state;
    });
  }

  if (game.phase === "intro") {
    return (
      <main className="shell hero">
        <section className="panel hero-card">
          <p className="eyebrow">British Field Ornithology Guild</p>
          <h1>British Birds Expedition</h1>
          <p className="lead">
            A stabilised, GitHub-ready pass-and-play quiz build with immutable scoring, Fisher-Yates randomisation, saved games, and a fixed rarity round.
          </p>
          <div className="hero-actions">
            <button onClick={startSetup}>Start new expedition</button>
            <button onClick={continueGame} disabled={!savedGame} className="secondary">
              Continue saved expedition
            </button>
            <button onClick={() => setGuideOpen(true)} className="ghost">Open field guide</button>
          </div>
          <div className="stat-grid">
            <span><strong>{BIRD_DATASET.length}</strong> species cards</span>
            <span><strong>{ROUNDS.length}</strong> rounds</span>
            <span><strong>Local</strong> save/resume</span>
          </div>
        </section>
        {guideOpen && <FieldGuide query={guideQuery} setQuery={setGuideQuery} birds={filteredGuide} onClose={() => setGuideOpen(false)} />}
      </main>
    );
  }

  if (game.phase === "setup") {
    return (
      <main className="shell">
        <section className="panel narrow">
          <p className="eyebrow">Expedition roster</p>
          <h1>Choose your players</h1>
          {names.map((name, index) => (
            <div className="name-row" key={index}>
              <input value={name} onChange={(event) => updateName(index, event.target.value)} aria-label={`Player ${index + 1} name`} />
              <button className="ghost small" onClick={() => removePlayer(index)} disabled={names.length <= 2}>Remove</button>
            </div>
          ))}
          <div className="row-actions">
            <button className="secondary" onClick={addPlayer} disabled={names.length >= 6}>Add player</button>
            <button onClick={startGame}>Begin Round 1</button>
          </div>
          <button className="ghost" onClick={() => setGame(createFreshGame())}>Back</button>
        </section>
      </main>
    );
  }

  if (game.phase === "gameOver") {
    return (
      <main className="shell">
        <section className="panel narrow">
          <p className="eyebrow">Expedition complete</p>
          <h1>Final scores</h1>
          <ol className="leaderboard">
            {leaders.map((player) => (
              <li key={player.id}>
                <span>{player.name}</span>
                <strong>{player.score} pts</strong>
                <small>{player.stats.correctAnswers}/{player.stats.totalAnswers} correct</small>
              </li>
            ))}
          </ol>
          <button onClick={startSetup}>Play again</button>
        </section>
      </main>
    );
  }

  return (
    <main className="shell game-layout">
      <aside className="panel scoreboard">
        <p className="eyebrow">Round {game.currentRound} of {ROUNDS.length}</p>
        <h2>{round.title}</h2>
        <p>{round.blurb}</p>
        <ol className="leaderboard compact">
          {leaders.map((player) => (
            <li key={player.id} className={player.id === activePlayer?.id ? "active" : ""}>
              <span>{player.name}</span>
              <strong>{player.score}</strong>
            </li>
          ))}
        </ol>
        <button className="ghost" onClick={() => setGuideOpen(true)}>Field guide</button>
        <button className="ghost danger" onClick={() => { clearGame(); setGame(createFreshGame()); }}>Quit expedition</button>
      </aside>

      <section className="panel question-card">
        <p className="eyebrow">Question {game.questionNumber} · {activePlayer?.name}'s turn</p>
        <h1>{question?.prompt}</h1>
        <div className="choice-grid">
          {visibleChoices.map((choice) => (
            <button key={choice} onClick={() => answer(choice)}>{choice}</button>
          ))}
        </div>
        <div className="tool-row">
          <button className="secondary" onClick={handleUseBinoculars} disabled={!activePlayer || activePlayer.binoculars <= 0 || visibleChoices.length <= 2}>
            Use binoculars ({activePlayer?.binoculars ?? 0})
          </button>
          <span>{round.points} points for a correct answer</span>
        </div>
        {game.lastResult && <p className="result-note">{game.lastResult}</p>}
      </section>
      {guideOpen && <FieldGuide query={guideQuery} setQuery={setGuideQuery} birds={filteredGuide} onClose={() => setGuideOpen(false)} />}
    </main>
  );
}

type FieldGuideProps = {
  query: string;
  setQuery: (query: string) => void;
  birds: typeof BIRD_DATASET;
  onClose: () => void;
};

function FieldGuide({ query, setQuery, birds, onClose }: FieldGuideProps) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Field guide">
      <section className="panel modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Field guide</p>
            <h2>Species reference</h2>
          </div>
          <button className="ghost" onClick={onClose}>Close</button>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search species, group, habitat, diet..." />
        <div className="guide-grid">
          {birds.map((bird) => (
            <article className="bird-tile" key={bird.id}>
              <strong>{bird.name}</strong>
              <span>{bird.group} · {bird.habitat}</span>
              <small>{bird.conservation} list · rarity {bird.rarity}/5 · {bird.wingspan}cm wingspan</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
