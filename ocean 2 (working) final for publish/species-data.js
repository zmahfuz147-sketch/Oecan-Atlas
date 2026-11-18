/* ==========================================================================
   OceanAtlas — species-data.js
   Shared dataset of all 20 marine species for index.html and species.html
   ========================================================================== */
window.OCEAN_SPECIES_DATA = (() => {
  'use strict';

  const ICON_SVGS = {
    manta: `<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M50 24 C46 17 39 14 34 16 C37 19 39 22 40 25 C26 29 10 41 5 56 C19 51 34 51 44 56 C46 62 48 67 50 72 C52 67 54 62 56 56 C66 51 81 51 95 56 C90 41 74 29 60 25 C61 22 63 19 66 16 C61 14 54 17 50 24 Z"/><path d="M49 70 L49.4 92 L50.6 92 L51 70 Z"/></svg>`,
    orca: `<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M8 56 Q22 34 50 32 Q76 32 90 48 Q80 50 72 56 Q56 66 34 64 Q18 62 8 56 Z"/><path d="M44 32 Q46 16 54 10 Q52 22 55 32 Z"/><path d="M8 56 Q2 52 0 44 Q8 46 12 48 Q12 42 18 38 Q14 48 12 54 Z"/><path d="M56 58 Q52 68 44 72 Q50 62 52 56 Z"/><ellipse cx="72" cy="43" rx="7" ry="3.4" fill="#eaf6ff" opacity="0.9" transform="rotate(-10 72 43)"/><path d="M30 62 Q50 66 66 58 Q54 64 38 64 Z" fill="#eaf6ff" opacity="0.75"/></svg>`,
    hammerhead: `<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M6 30 Q4 30 4 33 L4 45 Q4 48 7 48 L14 46 L14 32 Z"/><path d="M14 36 Q40 28 62 33 Q78 37 90 48 Q76 52 62 50 Q42 55 16 45 Z"/><path d="M46 31 Q50 19 58 15 Q54 25 57 31 Z"/><path d="M88 46 L97 35 L93 48 L97 60 Z"/><path d="M34 48 Q32 56 26 60 Q31 51 31 47 Z"/><circle cx="9" cy="44" r="1.8" fill="#041d3d"/></svg>`,
    dugong: `<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M14 50 Q20 36 40 34 Q66 32 80 44 Q86 50 84 56 Q70 64 46 64 Q26 62 14 56 Q10 53 14 50 Z"/><path d="M15 49 Q8 51 6 58 Q12 61 19 58 Q16 54 15 49 Z"/><path d="M83 48 Q91 42 97 38 Q93 49 97 60 Q91 56 83 55 Z"/><path d="M36 58 Q34 66 27 70 Q33 60 33 56 Z"/><circle cx="21" cy="46" r="2" fill="#041d3d"/></svg>`,
    anglerfish: `<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path d="M20 50 Q24 30 46 28 Q70 28 82 46 Q86 54 80 60 Q64 72 42 68 Q26 64 20 50 Z"/><path d="M82 46 L94 38 L90 50 L94 60 Z"/><path d="M40 28 Q34 14 24 12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="23" cy="12" r="7.5" fill="#f4d58d" opacity="0.25"/><circle cx="23" cy="12" r="4.5" fill="#f4d58d"/><path d="M21 50 L24 57 L27 51 L30 58 L33 52 L36 59 L39 53" stroke="#eaf6ff" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="58" cy="42" r="4" fill="#eaf6ff"/><circle cx="59" cy="42" r="2" fill="#041d3d"/></svg>`,
    nautilus: `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 16 C74 16 88 34 84 56 C80 74 62 84 44 80 C28 77 18 63 22 48 C25 36 36 30 46 31 C56 33 62 41 60 50 C59 57 51 62 45 60" stroke="currentColor" stroke-width="6.5" stroke-linecap="round"/><path d="M22 52 L12 58 M23 60 L14 68 M28 68 L20 77" stroke="#f4d58d" stroke-width="3.5" stroke-linecap="round"/></svg>`
  };

  const ZONE_META = {
    Sunlight: { emoji: '☀️', cls: 'zone-sunlight', depthLabel: '0 – 200 m (Epipelagic)' },
    Twilight: { emoji: '🌆', cls: 'zone-twilight', depthLabel: '200 – 1,000 m (Mesopelagic)' },
    Midnight: { emoji: '🌑', cls: 'zone-midnight', depthLabel: '1,000 – 4,000 m (Bathypelagic)' },
    Abyss:    { emoji: '🕳️', cls: 'zone-abyss', depthLabel: '4,000 – 6,000 m (Abyssopelagic)' },
    Coastal:  { emoji: '🏖️', cls: 'zone-coastal', depthLabel: '0 – 200 m (Neritic / Shelf)' }
  };

  const STATUS_META = {
    LC: { label: 'Least Concern', cls: 'status-lc' },
    VU: { label: 'Vulnerable', cls: 'status-vu' },
    EN: { label: 'Endangered', cls: 'status-en' },
    CR: { label: 'Critically Endangered', cls: 'status-cr' }
  };

  const SPECIES = [
    {
      id: 'blue-whale', name: 'Blue Whale', sci: 'Balaenoptera musculus',
      emoji: '🐋', zone: 'Sunlight', status: 'EN',
      fact: 'The largest animal ever known — up to 30 m and 180 tonnes, yet it feeds on krill the size of your finger.',
      depth: '0–500 m', maxDepth: 500, size: 'Up to 30 m · 180 t', diet: 'Krill — up to 4 t/day',
      lifespan: '80–90 years', region: 'All major oceans (except Arctic)', trend: 'Increasing slowly',
      overview: 'Blue whales are baleen giants that roam the open ocean following seasonal blooms of krill. Despite outweighing the largest known dinosaurs, they move with effortless grace and play a vital role in fertilising surface waters with nutrient-rich plumes that boost phytoplankton growth.',
      facts: [
        'Its heart weighs around 180 kg — roughly the size of a bumper car — and its tongue can weigh as much as an elephant.',
        'Calls reach 188 decibels, among the loudest sounds made by any animal, and can travel hundreds of kilometres.',
        'A nursing calf gains about 90 kg every single day on its mother’s fat-rich milk.'
      ],
      conservation: 'Commercial whaling reduced blue whale numbers by up to 90% in the 20th century. Today, vessel strikes, underwater shipping noise, and climate-driven shifts in krill abundance remain their primary threats.'
    },
    {
      id: 'great-white', name: 'Great White Shark', sci: 'Carcharodon carcharias',
      emoji: '🦈', zone: 'Sunlight', status: 'VU',
      fact: 'Can sense a single drop of blood in ~100 litres of water and breach fully out of the sea when hunting seals.',
      depth: '0–1,200 m', maxDepth: 1200, size: '4–6 m · up to 2 t', diet: 'Seals, sea lions, fish, rays',
      lifespan: '70+ years', region: 'Temperate & subtropical coastal seas', trend: 'Decreasing',
      overview: 'As apex predators of coastal and pelagic waters, great white sharks regulate marine ecosystems by keeping seal and sea lion populations healthy and balanced. Specialized electroreceptors in their snout detect the faint bioelectric fields of prey muscle contractions.',
      facts: [
        'Carries around 300 serrated teeth arranged in conveyor-belt rows that replace themselves throughout life.',
        'Sharks are older than trees — their lineage predates forests by more than 100 million years.',
        'Can keep its body warmer than the surrounding water, boosting speed and hunting power in cold seas.'
      ],
      conservation: 'Slow growth and late maturity make great whites highly vulnerable to accidental bycatch in commercial gillnets and longlines, as well as illegal trophy and fin trade.'
    },
    {
      id: 'giant-pacific-octopus', name: 'Giant Pacific Octopus', sci: 'Enteroctopus dofleini',
      emoji: '🐙', zone: 'Coastal', status: 'LC',
      fact: 'Three hearts, blue blood, and ~500 million neurons — two-thirds of them spread through its eight arms.',
      depth: '0–2,000 m', maxDepth: 2000, size: 'Arm span up to 6 m · 50 kg', diet: 'Crabs, clams, shrimp, fish',
      lifespan: '3–5 years', region: 'North Pacific Rim (Japan to California)', trend: 'Stable',
      overview: 'Renowned for problem-solving intelligence, tool use, and instant colour-changing camouflage, the giant Pacific octopus inhabits rocky dens from tide pools down to deep continental shelves.',
      facts: [
        'Can squeeze through any gap larger than its beak — the only hard part of its body.',
        'Each sucker can taste and smell what it touches, so it literally flavours the world by touch.',
        'Edits its own RNA to adapt its nervous system to cold water — a trick rare in the animal kingdom.'
      ],
      conservation: 'Currently listed as Least Concern, though local populations are sensitive to coastal pollution, warming waters, and trap fisheries.'
    },
    {
      id: 'staghorn-coral', name: 'Staghorn Coral', sci: 'Acropora cervicornis',
      emoji: '🪸', zone: 'Coastal', status: 'CR',
      fact: 'One of the fastest-growing corals (up to 20 cm a year) — and one of the first to bleach when water warms.',
      depth: '0–30 m', maxDepth: 30, size: 'Colonies up to 2 m wide', diet: 'Symbiotic algae + plankton',
      lifespan: 'Decades to centuries (clonal)', region: 'Caribbean, Bahamas & Florida Keys', trend: 'Decreasing',
      overview: 'Named for its antler-like branches, staghorn coral builds complex three-dimensional reef thickets that shelter juvenile fish, lobsters, and sea turtles while buffering coastlines against storm surge.',
      facts: [
        'Corals are animals, not plants — each branch is a colony of thousands of tiny polyps sharing a skeleton.',
        'Coral reefs cover under 1% of the seafloor yet shelter around 25% of all marine species.',
        'Broken fragments can regrow into new colonies — the basis of coral nursery restoration projects.'
      ],
      conservation: 'Populations have declined by over 80% since the 1970s due to white-band disease, marine heatwaves, ocean acidification, and coastal runoff.'
    },
    {
      id: 'green-sea-turtle', name: 'Green Sea Turtle', sci: 'Chelonia mydas',
      emoji: '🐢', zone: 'Coastal', status: 'EN',
      fact: 'Adults are vegetarians, grazing seagrass meadows that bury carbon up to 35× faster than rainforests.',
      depth: '0–40 m', maxDepth: 40, size: '1–1.5 m · 190 kg', diet: 'Seagrass & marine algae',
      lifespan: '70+ years', region: 'Tropical & subtropical oceans worldwide', trend: 'Decreasing',
      overview: 'By cropping seagrass blades like underwater gardeners, green sea turtles keep coastal seagrass meadows productive and healthy—boosting carbon sequestration and nursery habitats for fish.',
      facts: [
        'Named for the green colour of its fat, not its shell.',
        'Females navigate back to the very beach where they hatched to lay their own eggs, decades later.',
        'Sand temperature decides hatchling sex — warming beaches are skewing populations heavily female.'
      ],
      conservation: 'Protected internationally, yet threatened by entanglement in fishing gear, coastal development on nesting beaches, boat strikes, and plastic ingestion.'
    },
    {
      id: 'clownfish', name: 'Clown Anemonefish', sci: 'Amphiprion ocellaris',
      emoji: '🐠', zone: 'Coastal', status: 'LC',
      fact: 'A special mucus coat lets it live among anemone stings that would paralyse almost any other fish.',
      depth: '1–15 m', maxDepth: 15, size: '8–11 cm', diet: 'Algae, copepods, zooplankton',
      lifespan: '6–10 years', region: 'Eastern Indian Ocean & Western Pacific', trend: 'Stable',
      overview: 'Living in tight-knit social hierarchies inside host sea anemones, clown anemonefish rarely venture more than a metre from their stinging sanctuary.',
      facts: [
        'All clownfish are born male — the dominant fish in a group transforms into the breeding female.',
        'The partnership is mutual: the anemone shelters the fish, and the fish feeds and cleans the anemone.',
        'Parents fan their eggs with their fins to keep them oxygenated until they hatch.'
      ],
      conservation: 'While globally common, localized reefs face pressure from aquarium-trade collection and anemone bleaching during marine heatwaves.'
    },
    {
      id: 'manta-ray', name: 'Giant Oceanic Manta', sci: 'Mobula birostris',
      svg: 'manta', zone: 'Sunlight', status: 'EN',
      fact: 'Has the largest brain-to-body ratio of any fish — and may recognise itself in a mirror.',
      depth: '0–1,000 m', maxDepth: 1000, size: 'Wingspan up to 7 m · 2 t', diet: 'Zooplankton & small fish',
      lifespan: '40+ years', region: 'Tropical & subtropical open oceans', trend: 'Decreasing',
      overview: 'Gliding through open blue water like underwater birds, giant oceanic mantas funnel plankton-rich water into wide mouths using unfurled cephalic fins.',
      facts: [
        'Every manta’s belly spot pattern is unique, like a fingerprint — researchers ID individuals from photos.',
        'Somersaults backwards through plankton clouds to keep feeding in one rich patch.',
        'Visits reef “cleaning stations” where small fish pick parasites from its skin and gills.'
      ],
      conservation: 'Reproducing only once every few years with a single pup, manta populations are severely threatened by targeted gill-plate fisheries and net entanglement.'
    },
    {
      id: 'orca', name: 'Orca', sci: 'Orcinus orca',
      svg: 'orca', zone: 'Sunlight', status: 'EN',
      fact: 'An apex predator with culture — pods pass hunting techniques and vocal dialects down the generations.',
      depth: '0–1,000 m', maxDepth: 1000, size: '6–9 m · up to 6 t', diet: 'Fish, seals, sharks, whales',
      lifespan: '50–90 years', region: 'Every ocean from poles to equator', trend: 'Varies by ecotype',
      overview: 'The largest member of the dolphin family, orcas live in matrilineal pods led by experienced grandmothers, exhibiting distinct cultural ecotypes with specialized diets and hunting strategies.',
      facts: [
        'The second-most widespread mammal on Earth after humans — found from polar ice to tropical seas.',
        'Each pod has its own call repertoire, almost like a family language.',
        'There is no verified record of a wild orca fatally attacking a human.'
      ],
      conservation: 'Chemical pollutants (PCBs) accumulated in blubber, prey depletion (such as Chinook salmon), and vessel noise endanger distinct regional pods.',
      note: 'Global IUCN status is Data Deficient; distinct populations such as Southern Resident orcas are Endangered / Critically Endangered.'
    },
    {
      id: 'atolla-jelly', name: 'Alarm Jellyfish', sci: 'Atolla wyvillei',
      emoji: '🪼', zone: 'Midnight', status: 'LC',
      fact: 'When attacked, it spins a pinwheel of blue light — a “burglar alarm” that summons a bigger predator to eat its attacker.',
      depth: '1,000–4,000 m', maxDepth: 4000, size: 'Bell up to 15 cm', diet: 'Copepods & small crustaceans',
      lifespan: 'Unknown (deep pelagic)', region: 'Deep oceans worldwide', trend: 'Stable',
      overview: 'A crown jellyfish of the pitch-black bathypelagic zone, Atolla uses bioluminescence not to attract prey, but as a dazzling defensive light show to draw larger hunters toward whatever is biting it.',
      facts: [
        'Its deep-red body is effectively invisible in the deep, where red wavelengths never reach.',
        'Its alarm display inspired engineers to build an “e-jelly” light lure that helped film a giant squid alive.',
        'Bioluminescence is the most common form of communication on the planet — most deep-sea animals can glow.'
      ],
      conservation: 'Widespread throughout the deep ocean, though future deep-sea mining plumes could disrupt midwater bioluminescent signaling.'
    },
    {
      id: 'giant-squid', name: 'Giant Squid', sci: 'Architeuthis dux',
      svg: null, emoji: '🦑', zone: 'Twilight', status: 'LC',
      fact: 'Eyes the size of dinner plates (~27 cm) — the largest in the animal kingdom — scan the gloom for approaching sperm whales.',
      depth: '300–1,000 m', maxDepth: 1000, size: 'Up to 12–13 m · 275 kg', diet: 'Deep-sea fish & other squid',
      lifespan: '3–5 years', region: 'Deep continental slopes worldwide', trend: 'Stable',
      overview: 'For centuries the inspiration for Kraken legends, the giant squid stalks the twilight zone using two long feeding tentacles tipped with serrated sucker rings.',
      facts: [
        'Was first filmed alive in its natural habitat only in 2012 — we know the Moon’s surface better.',
        'Sperm whales surface carrying circular sucker scars from battles with giant squid in the dark.',
        'Moves by jet propulsion, drawing water into its mantle and blasting it out through a steerable funnel.'
      ],
      conservation: 'Rarely encountered alive; warming midwater temperatures and expanding low-oxygen zones may compress its twilight habitat.'
    },
    {
      id: 'scalloped-hammerhead', name: 'Scalloped Hammerhead', sci: 'Sphyrna lewini',
      svg: 'hammerhead', zone: 'Coastal', status: 'CR',
      fact: 'Its wide “hammer” spreads sensors apart, giving stereo smell and a sharper read of electric fields hidden in the sand.',
      depth: '0–1,000 m', maxDepth: 1000, size: '2.5–4 m · 150 kg', diet: 'Reef fish, stingrays, squid',
      lifespan: '30+ years', region: 'Warm temperate & tropical seas', trend: 'Decreasing',
      overview: 'Recognisable by the notched front edge of its wide cephalofoil head, the scalloped hammerhead gathers in dramatic daytime schools around seamounts before dispersing at night to hunt.',
      facts: [
        'Schools by day in groups of hundreds, then hunts alone at night.',
        'The hammer acts like a hydrofoil, letting it pivot with startling tightness.',
        'Populations have fallen by more than 80% in some regions, mainly for the fin trade.'
      ],
      conservation: 'Critically Endangered globally due to intense fishing pressure for its large fins and high mortality when caught as bycatch.'
    },
    {
      id: 'dugong', name: 'Dugong', sci: 'Dugong dugon',
      svg: 'dugong', zone: 'Coastal', status: 'VU',
      fact: 'The “sea cow” — the ocean’s only strictly plant-eating mammal, grazing up to 40 kg of seagrass a day.',
      depth: '0–10 m', maxDepth: 10, size: '2.5–3 m · 400 kg', diet: 'Seagrass roots & leaves',
      lifespan: '70+ years', region: 'Warm coastal waters from East Africa to Australia', trend: 'Decreasing',
      overview: 'Closely related to manatees and elephants, dugongs spend their lives in shallow, sheltered bays uprooting seagrass with flexible, bristle-covered upper lips.',
      facts: [
        'Its closest living relatives are elephants — look at the fingernail-like flippers and gentle eyes.',
        'Sailors cradling calves at the surface likely inspired centuries of mermaid legends.',
        'Can live 70+ years, and leaves feeding trails in seagrass meadows visible from the air.'
      ],
      conservation: 'Vulnerable to seagrass meadow destruction from coastal dredging, agricultural runoff, boat propellers, and accidental net entanglement.'
    },
    {
      id: 'dumbo-octopus', name: 'Dumbo Octopus', sci: 'Grimpoteuthis spp.',
      emoji: '🐙', zone: 'Abyss', status: 'LC',
      fact: 'Flaps ear-like fins to hover above the seafloor — the deepest-living octopus, filmed below 6,900 m.',
      depth: '3,000–7,000 m', maxDepth: 7000, size: '20–30 cm', diet: 'Polychaete worms, copepods, isopods',
      lifespan: '3–5 years', region: 'Abyssal plains & trenches worldwide', trend: 'Stable',
      overview: 'Unlike coastal octopuses that crawl over reefs, umbrella octopuses of the genus Grimpoteuthis pulse their webbed arms and flap ear-like mantle fins to drift calmly above the abyssal mud.',
      facts: [
        'Swallows prey whole rather than tearing it apart like shallow-water octopuses.',
        'Females carry eggs at several stages of development at once, ready for whenever conditions are right.',
        'Has no ink sac — there is no point in a smokescreen where nobody can see.'
      ],
      conservation: 'Protected naturally by extreme depth, though deep-seabed mineral exploration poses emerging long-term risks to abyssal habitats.'
    },
    {
      id: 'humpback-anglerfish', name: 'Humpback Anglerfish', sci: 'Melanocetus johnsonii',
      svg: 'anglerfish', zone: 'Midnight', status: 'LC',
      fact: 'Dangles a glowing lure lit by symbiotic bacteria; tiny males fuse permanently onto females and share their bloodstream.',
      depth: '1,000–4,000 m', maxDepth: 4000, size: 'Female ~18 cm · male ~3 cm', diet: 'Deep-sea fish & crustaceans',
      lifespan: 'Unknown', region: 'Tropical to temperate bathypelagic seas', trend: 'Stable',
      overview: 'Built for ambush in a food-scarce world, the black seadevil uses a modified dorsal spine tipped with bioluminescent bacteria to coax curious prey directly toward needle-like teeth.',
      facts: [
        'An expandable stomach lets it swallow prey as large as itself — meals are rare in the deep.',
        'The male becomes a parasitic mate: he bites on, fuses, and shrinks to little more than a sperm provider.',
        'Some deep-sea anglers have “ultra-black” skin that absorbs over 99.5% of the light that hits it.'
      ],
      conservation: 'Found across all major ocean basins at depths well below commercial fishing gear.'
    },
    {
      id: 'leatherback-turtle', name: 'Leatherback Sea Turtle', sci: 'Dermochelys coriacea',
      emoji: '🐢', zone: 'Sunlight', status: 'VU',
      fact: 'The largest living turtle, sporting a flexible leathery shell so it can dive past 1,000 metres in search of jellyfish.',
      depth: '0–1,200 m', maxDepth: 1200, size: 'Up to 2.2 m · 700 kg', diet: 'Jellyfish & salps',
      lifespan: '45–50+ years', region: 'Global oceans (subpolar to tropical)', trend: 'Decreasing',
      overview: 'The sole surviving member of a family dating back over 100 million years, the leatherback crosses entire ocean basins between tropical nesting beaches and cold, jellyfish-rich feeding grounds.',
      facts: [
        'Counter-current blood vessels in its flippers retain body heat, letting it forage in chilly subpolar seas.',
        'Backwards-pointing spines lining its throat prevent slippery jellyfish from escaping.',
        'Floating plastic bags look almost identical to jellyfish underwater and are a leading cause of mortality.'
      ],
      conservation: 'Longline and driftnet bycatch, plastic bag ingestion, and poaching of eggs on nesting beaches remain critical threats.'
    },
    {
      id: 'sea-otter', name: 'Sea Otter', sci: 'Enhydra lutris',
      emoji: '🦦', zone: 'Coastal', status: 'EN',
      fact: 'Packs up to 150,000 hairs per square centimetre — the densest fur on Earth — instead of insulating blubber.',
      depth: '0–50 m', maxDepth: 50, size: '1.2–1.4 m · 45 kg', diet: 'Sea urchins, clams, crabs, abalone',
      lifespan: '15–20 years', region: 'North Pacific coasts (Russia, Alaska, California)', trend: 'Recovering slowly',
      overview: 'A classic keystone species, sea otters keep kelp forests thriving by eating voracious sea urchins that would otherwise mow down underwater kelp canopies.',
      facts: [
        'Uses favourite stones tucked into underarm skin pockets as anvils to crack open shellfish.',
        'By devouring kelp-eating sea urchins, otters protect underwater kelp forests that lock away carbon.',
        'They often wrap themselves in kelp fronds or hold paws while sleeping so currents do not drift them apart.'
      ],
      conservation: 'Hunted nearly to extinction during the maritime fur trade, sea otters now face oil spill vulnerability, shark bites, and coastal runoff.'
    },
    {
      id: 'coelacanth', name: 'West Indian Coelacanth', sci: 'Latimeria chalumnae',
      emoji: '🐟', zone: 'Twilight', status: 'CR',
      fact: 'Thought extinct for 66 million years until a live specimen was hauled up off South Africa in 1938.',
      depth: '150–700 m', maxDepth: 700, size: 'Up to 2 m · 90 kg', diet: 'Deep-reef fish & squid',
      lifespan: 'Up to 100 years', region: 'Western Indian Ocean (Comoros, South Africa, Madagascar)', trend: 'Decreasing',
      overview: 'Often called a living fossil, this ancient lobe-finned fish boasts an intracranial hinge joint that lets it widen its gape and a sensitive rostral organ in its snout to detect electrical fields.',
      facts: [
        'Its fleshy, paired lobe-fins move in an alternating trot-like rhythm that previews the limbs of land vertebrates.',
        'Females carry developing pups for up to five years — the longest known gestation of any vertebrate.',
        'Individuals can live nearly a century, resting inside volcanic underwater caves by day.'
      ],
      conservation: 'Critically Endangered with fewer than 1,000 mature individuals estimated; deep-water shark gillnets pose a severe accidental bycatch threat.'
    },
    {
      id: 'chambered-nautilus', name: 'Chambered Nautilus', sci: 'Nautilus pompilius',
      svg: 'nautilus', zone: 'Twilight', status: 'VU',
      fact: 'Controls buoyancy like a living submarine by pumping gas and fluid across spiral shell chambers.',
      depth: '100–700 m', maxDepth: 700, size: 'Shell up to 20 cm', diet: 'Crustaceans, fish & carrion',
      lifespan: '15–20 years', region: 'Indo-Pacific coral reef drop-offs', trend: 'Decreasing',
      overview: 'The only living cephalopod with an external chambered shell, the nautilus migrates vertically up steep reef slopes at night to scavenge using keen chemical senses.',
      facts: [
        'Its lineage has cruised Earth’s oceans for roughly 500 million years — long before dinosaurs existed.',
        'Unlike squids and octopuses, a nautilus has up to 90 suckerless tentacles and simple pinhole eyes.',
        'Overharvesting for its pearly iridescent shell has severely reduced wild populations.'
      ],
      conservation: 'Listed under CITES Appendix II to curb international trade in its decorative mother-of-pearl shells.'
    },
    {
      id: 'humpback-whale', name: 'Humpback Whale', sci: 'Megaptera novaeangliae',
      emoji: '🐳', zone: 'Sunlight', status: 'LC',
      fact: 'Males compose complex, evolving songs lasting up to 20 minutes that spread across entire ocean basins.',
      depth: '0–300 m', maxDepth: 300, size: 'Up to 16 m · 36 t', diet: 'Krill & small schooling fish',
      lifespan: '45–50 years', region: 'All major oceans (polar to tropical)', trend: 'Increasing',
      overview: 'Famous for acrobatic breaches and ultra-long pectoral fins, humpback whales undertake some of the longest mammal migrations on Earth—up to 8,000 km each way between polar feeding grounds and tropical nurseries.',
      facts: [
        'Groups cooperate using “bubble-net feeding” — blowing rings of bubbles to herd fish into tight balls.',
        'Bumpy tubercles along the front edge of their extra-long fins improve lift and tight turning agility.',
        'Since commercial whaling ended, humpback populations have staged one of conservation’s greatest comebacks.'
      ],
      conservation: 'A major conservation success story, though entanglement in lobster/crab pot lines and ship collisions still require active management.'
    },
    {
      id: 'yeti-crab', name: 'Yeti Crab', sci: 'Kiwa hirsuta',
      emoji: '🦀', zone: 'Abyss', status: 'LC',
      fact: 'Farms gardens of white bacteria on its furry claws by waving them over warm hydrothermal vent fluids.',
      depth: '2,200–2,600 m', maxDepth: 2600, size: 'Up to 15 cm', diet: 'Sulfur-oxidising bacteria',
      lifespan: 'Unknown', region: 'Pacific-Antarctic Ridge hydrothermal vents', trend: 'Stable',
      overview: 'In an ecosystem powered by Earth’s internal heat rather than sunlight, the yeti crab grows hair-like setae covered in filamentous bacteria that detoxify vent minerals and serve as its primary food source.',
      facts: [
        'Discovered in 2005 along the Pacific-Antarctic Ridge, it represents an entirely new family of squat lobsters.',
        'Living in permanent darkness, it has no functional eyes and relies on chemical and thermal cues.',
        'Dense clusters crowd tightly around mineral chimneys where temperatures hover just above freezing.'
      ],
      conservation: 'Restricted to fragile deep-sea hydrothermal vent fields, making habitat protection around vent ecosystems vital.'
    }
  ];

  const byId = {};
  SPECIES.forEach((sp, idx) => {
    sp.index = idx;
    byId[sp.id] = sp;
  });

  const iconHTML = (sp) =>
    sp.svg && ICON_SVGS[sp.svg] ? ICON_SVGS[sp.svg] : (sp.emoji || '🐟');

  const badgeHTML = (sp) => {
    const z = ZONE_META[sp.zone];
    const s = STATUS_META[sp.status];
    return `<span class="badge ${z.cls}">${z.emoji} ${sp.zone}</span>` +
           `<span class="badge ${s.cls}">${s.label}</span>`;
  };

  return { SPECIES, byId, ZONE_META, STATUS_META, iconHTML, badgeHTML };
})();