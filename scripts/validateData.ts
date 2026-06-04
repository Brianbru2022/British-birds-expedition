import { BIRD_DATASET } from "../src/data/birds";
import { ROUNDS } from "../src/data/rounds";

const failures: string[] = [];
const ids = new Set<string>();
const names = new Set<string>();

for (const bird of BIRD_DATASET) {
  if (ids.has(bird.id)) failures.push(`Duplicate bird id: ${bird.id}`);
  ids.add(bird.id);

  if (names.has(bird.name)) failures.push(`Duplicate bird name: ${bird.name}`);
  names.add(bird.name);

  if (bird.rarity < 1 || bird.rarity > 5) failures.push(`Bad rarity for ${bird.name}`);
  if (bird.wingspan <= 0) failures.push(`Bad wingspan for ${bird.name}`);
  if (bird.clutch <= 0) failures.push(`Bad clutch for ${bird.name}`);
}

if (ROUNDS.length !== 20) failures.push(`Expected 20 rounds, found ${ROUNDS.length}`);
if (BIRD_DATASET.length < 300) failures.push(`Expected at least 300 species cards, found ${BIRD_DATASET.length}`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${BIRD_DATASET.length} species cards and ${ROUNDS.length} rounds.`);
