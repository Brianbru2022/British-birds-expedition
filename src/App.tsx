import { useEffect, useMemo, useState } from "react";
import {
  activateDoublePoints,
  activateShield,
  applyAnswer,
  BIRD_DATASET,
  createFreshGame,
  createPlayers,
  gainBinoculars,
  getRound,
  makeQuestion,
  removeActionCardAt,
  removeWrongChoices,
  ROUNDS,
  spendGear,
  useBinoculars,
} from "./game";
import type { ActionCard, GameState, PlayerGear, Question } from "./types";
import { clearGame, loadGame, saveGame } from "./utils/storage";

function buildQuestion(state: GameState): Question | null {
  return state.phase === "playing" && state.players.length > 0 ? makeQuestion(state) : null;
}

export default function App() {
  const [savedGame, setSavedGame] = useState<GameState | null>(() => loadGame());
  const [game, setGame] = useState<GameState>(() => createFreshGame());
  const [names, setNames] = useState<string[]>(["Player 1", "Player 2"]);
  const [question, setQuestion] = useState<Question | null>(() => buildQuestion(game));
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
    const nextQuestion = buildQuestion(game);
    setQuestion(nextQuestion);
    setVisibleChoices(nextQuestion?.choices ?? []);
  }, [game.phase, game.currentRound, game.questionNumber, game.activePlayerIndex]);

  const filteredGuide = useMemo(() => {
    const query = guideQuery.trim().toLowerCase();
    return BIRD_DATASET.filter((bird) => {
      if (!query) return true;
      return [bird.name, bird.scientificName, bird.group, bird.habitat, bird.diet, bird.conservation, bird.migratory]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(query));
    }).slice(0, 100);
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

  function spendAndRedraw(current: GameState, note: string, gear: keyof PlayerGear): GameState {
    const updated = spendGear(current, gear, note);
    if (updated === current) return current;
    const replacement = makeQuestion(updated);
    setQuestion(replacement);
    setVisibleChoices(replacement.choices);
    return updated;
  }

  function handleUseGear(gear: keyof PlayerGear) {
    if (!question || !activePlayer) return;

    if (gear === "binoculars") {
      setGame((current) => {
        const result = useBinoculars(current, question, visibleChoices);
        setVisibleChoices(result.choices);
        return result.state;
      });
      return;
    }

    if (gear === "sonic") {
      setGame((current) => spendGear(current, "sonic", `Sonic sweep: ${question.bird.name} is ${question.bird.group}, diet ${question.bird.diet.toLowerCase()}.`));
      return;
    }

    if (gear === "thermal") {
      setGame((current) => spendGear(current, "thermal", `Thermal scope: ${question.bird.name} favours ${question.bird.habitat.toLowerCase()} and is marked ${question.bird.migratory}.`));
      return;
    }

    if (gear === "lures") {
      setGame((current) => spendAndRedraw(current, `${activePlayer.name} used a Golden Lure to redraw the question.`, "lures"));
      return;
    }

    if (gear === "shields") {
      setGame((current) => {
        const player = current.players[current.activePlayerIndex];
        if (!player || player.gear.shields <= 0) return current;
        const spent = spendGear(current, "shields", `${player.name} activated a Guard Shield for this turn.`);
        return { ...spent, shieldedPlayerId: player.id };
      });
    }
  }

  function playCard(card: ActionCard, index: number) {
    if (!question) return;

    if (card.kind === "double_points") {
      setGame((current) => activateDoublePoints(current, index));
      return;
    }

    if (card.kind === "protect_streak") {
      setGame((current) => activateShield(current, index));
      return;
    }

    if (card.kind === "gain_binoculars") {
      setGame((current) => gainBinoculars(current, index));
      return;
    }

    if (card.kind === "remove_wrong") {
      setGame((current) => removeActionCardAt(current, index, `${activePlayer?.name ?? "Player"} used Sharp Eyes to remove two wrong options.`));
      setVisibleChoices((current) => removeWrongChoices(question, current, 2));
      return;
    }

    if (card.kind === "swap_options") {
      setGame((current) => {
        const updated = removeActionCardAt(current, index, `${activePlayer?.name ?? "Player"} followed a Fresh Trail to a new question.`);
        const replacement = makeQuestion(updated);
        setQuestion(replacement);
        setVisibleChoices(replacement.choices);
        return updated;
      });
      return;
    }

    if (card.kind === "reveal_family") {
      setGame((current) => removeActionCardAt(
        current,
        index,
        `Field note: ${question.bird.name} is ${question.bird.group}; habitat ${question.bird.habitat}; diet ${question.bird.diet.toLowerCase()}.`,
      ));
    }
  }

  if (game.phase === "intro") {
    return (
      <main className="shell hero">
        <section className="panel hero-card">
          <p className="eyebrow">British Field Ornithology Guild</p>
          <h1>British Birds Expedition</h1>
          <p className="lead">
            A pass-and-play expedition quiz with species data, working gear, action cards, rarity rounds, and saved progress.
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
            <span><strong>Gear + Cards</strong> phase 2</span>
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
          <p className="muted">Each player starts with working gear and two action cards.</p>
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
                <small>{player.stats.correctAnswers}/{player.stats.totalAnswers} correct · best streak {player.stats.bestStreak}</small>
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
              <small>streak {player.streak} · {player.stats.correctAnswers}/{player.stats.totalAnswers}</small>
            </li>
          ))}
        </ol>
        <button className="ghost" onClick={() => setGuideOpen(true)}>Field guide</button>
        <button className="ghost danger" onClick={() => { clearGame(); setGame(createFreshGame()); }}>Quit expedition</button>
      </aside>

      <section className="panel question-card">
        <p className="eyebrow">Question {game.questionNumber} · {activePlayer?.name}'s turn</p>
        <h1>{question?.prompt}</h1>
        <div className="bird-meta">
          {question && <span>{question.bird.scientificName ?? question.bird.group} · rarity {question.bird.rarity}/5</span>}
          {game.doublePointsPlayerId === activePlayer?.id && <strong>Double points armed</strong>}
          {game.shieldedPlayerId === activePlayer?.id && <strong>Shield armed</strong>}
        </div>
        <div className="choice-grid">
          {visibleChoices.map((choice) => (
            <button key={choice} onClick={() => answer(choice)}>{choice}</button>
          ))}
        </div>

        {activePlayer && (
          <div className="tool-panel">
            <h3>Expedition gear</h3>
            <div className="tool-row">
              <GearButton label="Binoculars" count={activePlayer.gear.binoculars} onClick={() => handleUseGear("binoculars")} disabled={visibleChoices.length <= 2} />
              <GearButton label="Sonic" count={activePlayer.gear.sonic} onClick={() => handleUseGear("sonic")} />
              <GearButton label="Thermal" count={activePlayer.gear.thermal} onClick={() => handleUseGear("thermal")} />
              <GearButton label="Lure" count={activePlayer.gear.lures} onClick={() => handleUseGear("lures")} />
              <GearButton label="Shield" count={activePlayer.gear.shields} onClick={() => handleUseGear("shields")} />
            </div>
            <h3>Action cards</h3>
            <div className="card-row">
              {activePlayer.cardsInHand.length === 0 && <span className="muted">No cards left.</span>}
              {activePlayer.cardsInHand.map((card, index) => (
                <button className="action-card" key={`${card.kind}-${index}`} onClick={() => playCard(card, index)}>
                  <span>{card.icon}</span>
                  <strong>{card.name}</strong>
                  <small>{card.description}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="tool-row footer-row">
          <span>{round.points} point{round.points === 1 ? "" : "s"} for a correct answer</span>
        </div>
        {game.lastResult && <p className="result-note">{game.lastResult}</p>}
      </section>
      {guideOpen && <FieldGuide query={guideQuery} setQuery={setGuideQuery} birds={filteredGuide} onClose={() => setGuideOpen(false)} />}
    </main>
  );
}

function GearButton({ label, count, disabled, onClick }: { label: string; count: number; disabled?: boolean; onClick: () => void }) {
  return (
    <button className="secondary gear-button" onClick={onClick} disabled={count <= 0 || disabled}>
      <strong>{label}</strong>
      <span>{count}</span>
    </button>
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
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search species, scientific name, group, habitat, diet..." />
        <div className="guide-grid">
          {birds.map((bird) => (
            <article className="bird-tile" key={bird.id} style={{ borderColor: bird.color ?? "rgba(255,255,255,0.2)" }}>
              <strong>{bird.name}</strong>
              {bird.scientificName && <em>{bird.scientificName}</em>}
              <span>{bird.group} · {bird.habitat} · {bird.diet}</span>
              <small>{bird.conservation} list · {bird.migratory} · rarity {bird.rarity}/5 · {bird.wingspan}cm wingspan</small>
              <p>{bird.clue}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
