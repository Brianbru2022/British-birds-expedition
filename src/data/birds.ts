import type { BirdCard, BirdGroup, Habitat, Diet, Conservation, Migratory, RoundDefinition } from "../types";

const RAW_SPECIES = String.raw`European Robin
Eurasian Blue Tit
Great Tit
Coal Tit
Long-tailed Tit
Goldfinch
Chaffinch
Greenfinch
Eurasian Bullfinch
House Sparrow
Common Starling
Eurasian Blackbird
Song Thrush
Eurasian Wren
Dunnock
Eurasian Blackcap
Barn Swallow
Common House Martin
Common Swift
Eurasian Jay
Eurasian Magpie
Eurasian Jackdaw
Rook
Carrion Crow
Common Raven
Goldcrest
Common Firecrest
Eurasian Skylark
Meadow Pipit
Pied Wagtail
Grey Wagtail
Eurasian Nuthatch
Eurasian Treecreeper
Common Nightingale
Bearded Reedling
Woodlark
Corn Bunting
Common Waxwing
Barn Owl
Tawny Owl
Little Owl
Golden Eagle
Peregrine Falcon
Common Kestrel
Eurasian Sparrowhawk
Common Buzzard
Red Kite
Osprey
Hen Harrier
Merlin
Short-eared Owl
Mute Swan
Mallard
Tufted Duck
Eurasian Teal
Common Shelduck
Canada Goose
Grey Heron
Little Egret
Common Kingfisher
Great Cormorant
Atlantic Puffin
Common Guillemot
Razorbill
European Herring Gull
Black-headed Gull
Black-legged Kittiwake
Northern Gannet
Northern Fulmar
Great Crested Grebe
Eurasian Coot
Common Moorhen
Eurasian Curlew
Common Redshank
Northern Lapwing
Eurasian Oystercatcher
Dunlin
Pied Avocet
Common Snipe
Eurasian Woodcock
Grey Plover
Common Ringed Plover
Ruddy Turnstone
Common Woodpigeon
Stock Dove
Eurasian Collared Dove
Common Pheasant
Red-legged Partridge
Grey Partridge
Common Cuckoo
European Green Woodpecker
Great Spotted Woodpecker
Lesser Spotted Woodpecker
European Nightjar
Eurasian Hoopoe
Common Quail
Eurasian Bittern
Eurasian Wryneck
Golden Oriole
Corncrake
Sand Martin
Willow Warbler
Common Chiffchaff
Wood Warbler
Sedge Warbler
Eurasian Reed Warbler
Garden Warbler
Lesser Whitethroat
Common Whitethroat
Grasshopper Warbler
Spotted Flycatcher
Pied Flycatcher
Common Redstart
Black Redstart
Whinchat
European Stonechat
Northern Wheatear
Ring Ouzel
Redwing
Fieldfare
Mistle Thrush
Tree Pipit
Rock Pipit
Water Pipit
Yellow Wagtail
Tree Sparrow
Lesser Redpoll
Eurasian Siskin
Eurasian Linnet
Brambling
Hawfinch
European Serin
Common Crossbill
Yellowhammer
Reed Bunting
Cirl Bunting
Dartford Warbler
Cetti's Warbler
Marsh Warbler
Crested Tit
Marsh Tit
Willow Tit
Red-backed Shrike
Great Grey Shrike
Waxwing
Rock Dove
Spotted Crake
Rock Ptarmigan
European Honey Buzzard
Eurasian Hobby
Northern Goshawk
Eurasian Marsh Harrier
Montagu's Harrier
White-tailed Eagle
Long-eared Owl
Eurasian Eagle-Owl
Rough-legged Buzzard
Lesser Kestrel
Honey Buzzard
Black Kite
Pallid Harrier
Snowy Owl
Red-footed Falcon
Whooper Swan
Tundra Swan
Greylag Goose
Pink-footed Goose
Brent Goose
Barnacle Goose
Common Eider
Eurasian Wigeon
Gadwall
Northern Shoveler
Northern Pintail
Common Pochard
Common Goldeneye
Red-breasted Merganser
Mandarin Duck
Common Tern
Arctic Tern
Little Tern
Sandwich Tern
Great Skua
Arctic Skua
Black Guillemot
Manx Shearwater
European Storm Petrel
European Shag
Bar-tailed Godwit
Black-tailed Godwit
Whimbrel
Little Ringed Plover
European Golden Plover
Red Knot
Sanderling
Purple Sandpiper
Common Greenshank
Ruff
Common Chaffinch
European Greenfinch
Firecrest
Darnford Warbler
Bohemian Waxwing
Snow Bunting
Lapland Bunting
Great Reed Warbler
Savir's Warbler
Zitting Cisticola
Eurasian Penduline Tit
Barred Warbler
Aquatic Warbler
Bluethroat
Common Teal
Garganey
Red-crested Pochard
Greater Scaup
Velvet Scoter
Common Scoter
Long-tailed Duck
Smew
Goosander
Ruddy Duck
Egyptian Goose
Shoveler Mallard
Garganey Teal
Green-winged Teal
Blue-winged Teal
American Wigeon
Ring-necked Duck
Ferruginous Duck
Surf Scoter
King Eider
Steller's Eider
White-headed Duck
Hooded Merganser
Buffelhead
Eurasian Kestrel
Great Grey Owl
Gyrfalcon
Marsh Harrier
Eleonora's Falcon
Amur Falcon
Scops Owl
Boreal Owl
Pygmy Owl
Saker Falcon
Lanner Falcon
Egyptian Vulture
Griffon Vulture
Cinereous Vulture
Short-toed Snake Eagle
Lesser Spotted Eagle
Black-winged Stilt
Spotted Redshank
Spoon-billed Sandpiper
Little Stint
Temminck's Stint
Jack Snipe
Ringed Plover
Eurasian Dotterel
Common Sandpiper
Green Sandpiper
Wood Sandpiper
Stone-curlew
Pectoral Sandpiper
Curlew Sandpiper
Broad-billed Sandpiper
Buff-breasted Sandpiper
Red-necked Phalarope
Grey Phalarope
Great Snipe
Lesser Yellowlegs
Greater Yellowlegs
Marsh Sandpiper
Eurasian Shag
Leach's Storm Petrel
Little Auk
Little Grebe
Black-necked Grebe
Red-necked Grebe
Slavonian Grebe
Red-throated Diver
Black-throated Diver
Great Northern Diver
Cory's Shearwater
Sooty Shearwater
Balearic Shearwater
Roseate Tern
Black Tern
White-winged Tern
Sabine's Gull
Lesser Black-backed Gull
Great Black-backed Gull
Glaucous Gull
Iceland Gull
Mediterranean Gull
Little Gull
Pomarine Skua
Long-tailed Skua
Caspian Tern
White-tailed Tropicbird
Magnificent Frigatebird
Red-billed Tropicbird
Wilson's Storm Petrel
Green Woodpecker
Middle Spotted Woodpecker
Black Woodpecker
Grey-headed Woodpecker
Syrian Woodpecker
White-backed Woodpecker
Three-toed Woodpecker
Acorn Woodpecker
Northern Flicker
Gilded Flicker
Red-headed Woodpecker
Pileated Woodpecker
Downy Woodpecker
Hairy Woodpecker
Red-cockaded Woodpecker
Arizona Woodpecker
Ladder-backed Woodpecker
Nuttall's Woodpecker
Lewis's Woodpecker
Red-breasted Sapsucker
Red-naped Sapsucker
Yellow-bellied Sapsucker
Williamson's Sapsucker
Gila Woodpecker
Golden-fronted Woodpecker
Red-bellied Woodpecker
Stripe-backed Woodpecker
Rufous-tailed Woodpecker
Crimson-crested Woodpecker
Guayaquil Woodpecker
Blond-crested Woodpecker
Helmeted Woodpecker
Okinawa Woodpecker
Smoky-brown Woodpecker
Little Woodpecker
Golden-green Woodpecker
Lita Woodpecker
White Woodpecker
Woodpigeon
Turtle Dove
Collared Dove
Diamond Dove
Mourning Dove
Zebra Dove
Inca Dove
Common Ground Dove
Water Rail
Chukar Partridge
Golden Pheasant
Lady Amherst's Pheasant
Red Grouse
Black Grouse
Western Capercaillie
Crested Partridge
King Quail
Bobwhite Quail
California Quail
Gambel's Quail
Mountain Quail
Helmeted Guineafowl
Indian Peafowl
Wild Turkey
Common Woodcock
Baillon's Crake
Sora Crake
Allen's Gallinule
Purple Swamphen
Lesser Moorhen
Crested Guineafowl
Reeves's Pheasant
Mikado Pheasant
Swinhoe's Pheasant
Silver Pheasant
Gray Junglefowl
Red Junglefowl
Green Junglefowl
Ruffed Grouse
Spruce Grouse
Sharp-tailed Grouse
Greater Prairie-Chicken
Lesser Prairie-Chicken
Greater Sage-Grouse
Gunnison Sage-Grouse
Spur-winged Goose`;

const GROUP_KEYWORDS: Array<[RegExp, BirdGroup]> = [
  [/(eagle|falcon|hawk|harrier|buzzard|kestrel|kite|osprey|owl)/i, "Raptors"],
  [/(duck|goose|swan|teal|wigeon|pochard|scaup|scoter|eider|merganser|shelduck|mallard)/i, "Waterfowl"],
  [/(gull|tern|skua|fulmar|petrel|shearwater|puffin|guillemot|auk|gannet|cormorant|shag|kittiwake)/i, "Seabirds"],
  [/(sandpiper|plover|godwit|curlew|snipe|redshank|greenshank|ruff|stilt|avocet|oystercatcher|lapwing|turnstone|phalarope|dowitcher|whimbrel|knot)/i, "Waders"],
  [/(pheasant|partridge|quail|grouse|ptarmigan|prairie-chicken|junglefowl|guineafowl)/i, "Gamebirds"],
  [/(woodpecker|kingfisher|nuthatch|treecreeper|cuckoo|nightjar|waxwing|roller|hoopoe)/i, "Woodland"],
];

const CONSERVATION: Conservation[] = ["Green", "Amber", "Green", "Amber", "Red"];
const MIGRATORY: Migratory[] = ["Resident", "Summer visitor", "Winter visitor", "Passage migrant"];

function groupFor(name: string): BirdGroup {
  return GROUP_KEYWORDS.find(([pattern]) => pattern.test(name))?.[1] ?? "Songbirds";
}

function habitatFor(group: BirdGroup, index: number): Habitat {
  if (group === "Waterfowl") return "Wetlands";
  if (group === "Seabirds") return "Coast";
  if (group === "Waders") return index % 3 === 0 ? "Coast" : "Wetlands";
  if (group === "Raptors") return index % 2 === 0 ? "Moorland" : "Farmland";
  if (group === "Gamebirds") return index % 2 === 0 ? "Farmland" : "Moorland";
  if (group === "Woodland") return "Woodlands";
  return (["Gardens", "Woodlands", "Farmland", "Urban"] as Habitat[])[index % 4];
}

function dietFor(group: BirdGroup, name: string): Diet {
  if (group === "Raptors") return "Small mammals";
  if (group === "Seabirds" || /kingfisher|cormorant|heron|egret|gannet/i.test(name)) return "Fish";
  if (group === "Waterfowl") return "Plants";
  if (/finch|bunting|sparrow|crossbill|siskin|linnet|redpoll|goldfinch|greenfinch|chaffinch/i.test(name)) return "Seeds";
  if (group === "Gamebirds") return "Omnivore";
  return "Insects";
}

function wingspanFor(group: BirdGroup, index: number): number {
  const base = group === "Raptors" ? 105 : group === "Waterfowl" ? 78 : group === "Seabirds" ? 92 : group === "Waders" ? 54 : group === "Gamebirds" ? 55 : group === "Woodland" ? 38 : 24;
  return base + (index % 17) * 3;
}

function clueFor(bird: Omit<BirdCard, "clue">): string {
  return `${bird.name} is usually linked with ${bird.habitat.toLowerCase()} habitats, a ${bird.diet.toLowerCase()} diet, and ${bird.migratory.toLowerCase()} behaviour.`;
}

export const BIRD_DATASET: BirdCard[] = RAW_SPECIES.split("\n").filter(Boolean).map((name, index) => {
  const group = groupFor(name);
  const bird = {
    id: `b${String(index + 1).padStart(3, "0")}`,
    name,
    group,
    habitat: habitatFor(group, index),
    diet: dietFor(group, name),
    conservation: CONSERVATION[index % CONSERVATION.length],
    migratory: MIGRATORY[index % MIGRATORY.length],
    rarity: (index % 5) + 1,
    wingspan: wingspanFor(group, index),
    clutch: 2 + (index % 8),
  } satisfies Omit<BirdCard, "clue">;

  return { ...bird, clue: clueFor(bird) };
});

export const ROUNDS: RoundDefinition[] = [
  { id: 1, title: "Garden ID Warm-up", style: "IDENTIFY", points: 2, blurb: "Pick the bird from a clean multiple-choice clue." },
  { id: 2, title: "Habitat Hunch", style: "HABITAT", points: 2, blurb: "Match the species to its likely habitat." },
  { id: 3, title: "True or False Trail", style: "TRUE_FALSE", points: 2, blurb: "Spot the false field-note." },
  { id: 4, title: "Wingspan Duel", style: "HIGHER_LOWER", points: 3, blurb: "Judge whether the expedition bird has a bigger wingspan." },
  { id: 5, title: "Raptor Watch", style: "IDENTIFY", points: 3, blurb: "Raptors and lookalikes test observation skills." },
  { id: 6, title: "Wetland Sweep", style: "HABITAT", points: 3, blurb: "Separate reeds, coast, farmland, and woods." },
  { id: 7, title: "Migration Map", style: "TRUE_FALSE", points: 3, blurb: "Check whether the seasonal clue sounds right." },
  { id: 8, title: "Coastal Calls", style: "IDENTIFY", points: 3, blurb: "A sea-watch style identification round." },
  { id: 9, title: "Clutch Size Clash", style: "HIGHER_LOWER", points: 4, blurb: "Compare breeding clues and take the point." },
  { id: 10, title: "Conservation Checkpoint", style: "TRUE_FALSE", points: 4, blurb: "Learn which birds need the most help." },
  { id: 11, title: "Woodland Wander", style: "HABITAT", points: 4, blurb: "Focus on woodland, garden, and edge species." },
  { id: 12, title: "Feathered Families", style: "IDENTIFY", points: 4, blurb: "Use group clues to identify the card." },
  { id: 13, title: "Farmland Forage", style: "HABITAT", points: 4, blurb: "Track birds across fields, hedges, and barns." },
  { id: 14, title: "Diet Detective", style: "TRUE_FALSE", points: 5, blurb: "Check whether the diet clue fits." },
  { id: 15, title: "Expedition Midpoint", style: "IDENTIFY", points: 5, blurb: "A broader mixed clue challenge." },
  { id: 16, title: "Rare Visitor Watch", style: "RARITY_SWEEP", points: 5, blurb: "Choose the rarest bird in the sweepstake." },
  { id: 17, title: "Passage Migrants", style: "TRUE_FALSE", points: 5, blurb: "A late-game seasonal challenge." },
  { id: 18, title: "Big Bird or Small Bird", style: "HIGHER_LOWER", points: 5, blurb: "Risk a call on size and wingspan." },
  { id: 19, title: "Rarity Sweepstake", style: "RARITY_SWEEP", points: 6, blurb: "Fixed: this round now scores by rarity, not clutch size." },
  { id: 20, title: "Grand Finale", style: "FINAL", points: 8, blurb: "Final mixed expedition challenge." },
];
