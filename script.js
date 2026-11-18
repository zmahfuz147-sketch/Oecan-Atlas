/* ==========================================================================
   OceanAtlas — script.js
   Uses shared window.OCEAN_SPECIES_DATA so every "Dive deeper →" button
   opens that species' dedicated profile page (species.html?id=...).
   ========================================================================== */
(() => {
  'use strict';

  const {
    SPECIES,
    byId: speciesById,
    iconHTML: speciesIconHTML,
    badgeHTML
  } = window.OCEAN_SPECIES_DATA;

  /* --- 2 · Ocean climate indicators (8 vital signs) --- */
  const CLIMATE_INDICATORS = [
    {
      icon: '🌡️', label: 'Avg. Sea Surface Temperature',
      value: 17.1, decimals: 1, plus: false, suffix: '°C',
      trend: '▲ record highs',
      desc: 'Approximate global mean. 2023–2024 shattered records, with daily highs near 21 °C across the wide ocean band.'
    },
    {
      icon: '🌊', label: 'Sea Level Rise',
      value: 4.5, decimals: 1, plus: false, suffix: 'mm / year',
      trend: '▲ accelerating',
      desc: 'The satellite-era average is ≈ 3.4 mm/yr, but the rate is accelerating — recent years run close to 4.5 mm/yr.'
    },
    {
      icon: '⚗️', label: 'Ocean Acidification',
      value: -0.11, decimals: 2, plus: false, suffix: 'pH since 1850',
      trend: '▲ +30% acidity',
      desc: 'Surface pH has fallen from ≈ 8.21 to ≈ 8.10 since pre-industrial times — about a 30% increase in acidity.'
    },
    {
      icon: '♨️', label: 'Ocean Heat Content',
      value: 15, decimals: 0, plus: true, suffix: 'ZJ / year',
      trend: '▲ 90% of excess heat',
      desc: 'The ocean absorbs ≈ 90% of global warming’s excess heat. Recent annual gains ≈ 15 zettajoules (10²¹ joules).'
    },
    {
      icon: '🧊', label: 'Arctic Sea Ice Trend',
      value: -12.2, decimals: 1, plus: false, suffix: '% / decade',
      trend: '▼ shrinking',
      desc: 'September minimum ice extent is shrinking ≈ 12.2% per decade relative to the 1981–2010 average.'
    },
    {
      icon: '🫧', label: 'Ocean Oxygen Levels',
      value: -2, decimals: 0, plus: false, suffix: '% since 1960',
      trend: '▼ deoxygenation',
      desc: 'The global ocean has lost ≈ 2% of its oxygen since 1960, and the number of coastal “dead zones” has soared.'
    },
    {
      icon: '☀️', label: 'Marine Heatwave Days',
      value: 54, decimals: 0, plus: true, suffix: '% since 1982',
      trend: '▲ frequency doubled',
      desc: 'Prolonged ocean temperature spikes have increased over 50% in annual days, triggering mass coral bleaching and kelp loss.'
    },
    {
      icon: '🌿', label: 'Coastal Blue Carbon Loss',
      value: -35, decimals: 0, plus: false, suffix: '% mangroves lost',
      trend: '▼ vital carbon sinks',
      desc: 'Mangroves, salt marshes and seagrass meadows lock away carbon up to 10× faster than tropical forests, yet roughly a third have vanished.'
    }
  ];

  /* --- 3 · Chart series: 35 yearly samples, 1990 → 2024 --- */
  const CHART_SERIES = {
    temperature: {
      title: 'Sea surface temperature anomaly',
      sub: '°C relative to the 1971–2000 average · approximate',
      unit: '°C', decimals: 2, tickDecimals: 1, plus: true, color: '#ff8f6b',
      values: [0.12, 0.10, 0.08, 0.10, 0.14, 0.18, 0.13, 0.21, 0.38, 0.24,
        0.24, 0.30, 0.33, 0.35, 0.31, 0.36, 0.34, 0.40, 0.38, 0.43,
        0.44, 0.42, 0.46, 0.49, 0.53, 0.58, 0.62, 0.58, 0.56, 0.62,
        0.66, 0.70, 0.74, 0.85, 0.92]
    },
    sealevel: {
      title: 'Global mean sea level',
      sub: 'millimetres relative to 1990 · approximate',
      unit: 'mm', decimals: 0, tickDecimals: 0, plus: true, color: '#53d8fb',
      values: [0, 3, 6, 8, 11, 14, 16, 19, 22, 25,
        28, 31, 34, 38, 41, 44, 48, 51, 55, 59,
        63, 67, 71, 76, 81, 86, 90, 95, 100, 105,
        110, 115, 121, 128, 136]
    },
    ph: {
      title: 'Ocean surface pH (acidification)',
      sub: 'global mean surface pH · lower = more acidic · approximate',
      unit: 'pH', decimals: 3, tickDecimals: 2, plus: false, color: '#7ef0c9',
      values: [8.110, 8.108, 8.107, 8.105, 8.103, 8.101, 8.100, 8.098, 8.096, 8.095,
        8.093, 8.091, 8.090, 8.088, 8.086, 8.084, 8.083, 8.081, 8.079, 8.077,
        8.076, 8.074, 8.072, 8.070, 8.069, 8.067, 8.065, 8.063, 8.062, 8.060,
        8.058, 8.056, 8.055, 8.053, 8.052]
    }
  };
  const CHART_YEARS = Array.from({ length: 35 }, (_, i) => 1990 + i);

  /* --- 5 · Ocean Life Timeline --- */
  const OCEAN_TIMELINE = [
    {
      age: '3.8 Billion Years Ago', era: 'Archean Eon', icon: '🌋',
      title: 'First Life at Hydrothermal Vents',
      desc: 'Long before oxygen filled the sky, single-celled microbes emerged around mineral-rich deep-sea vents, harvesting chemical energy from Earth’s crust.'
    },
    {
      age: '2.4 Billion Years Ago', era: 'Great Oxidation Event', icon: '🦠',
      title: 'Cyanobacteria Breathe Oxygen into the Sea',
      desc: 'Photosynthetic marine microbes began splitting water with sunlight, slowly saturating the oceans and atmosphere with oxygen and turning the sky blue.'
    },
    {
      age: '541 Million Years Ago', era: 'Cambrian Explosion', icon: '🦐',
      title: 'Burst of Complex Marine Body Plans',
      desc: 'Warm, shallow seas erupted with evolutionary innovation — shells, compound eyes, jaws, and arthropods like trilobites established modern ocean food webs.'
    },
    {
      age: '485 Million Years Ago', era: 'Ordovician Radiations', icon: '🪸',
      title: 'First Reef Builders & Jawed Fishes',
      desc: 'Ancient corals, sponges, and bryozoans built vast carbonate reefs while early jawed vertebrates began patrolling open waters.'
    },
    {
      age: '375 Million Years Ago', era: 'Devonian Transition', icon: '🐟',
      title: 'Lobe-Finned Fishes Step Onto Land',
      desc: 'Fish with sturdy, bone-supported fins adapted to shallow coastal swamps — giving rise to all amphibians, reptiles, birds, and mammals.'
    },
    {
      age: '50 Million Years Ago', era: 'Eocene Epoch', icon: '🐋',
      title: 'Mammals Return to the Open Ocean',
      desc: 'Land-dwelling hoofed ancestors evolved streamlined bodies, blowholes, and echolocation, becoming the ancestors of modern whales and dolphins.'
    },
    {
      age: 'Present Day', era: 'Anthropocene Ocean', icon: '🌍',
      title: 'A Crossroads for the Blue Planet',
      desc: 'Human carbon emissions, overfishing, and plastic waste are altering ocean chemistry faster than at any time in millions of years — making stewardship urgent.'
    },
    {
      age: 'Future', era: 'The Next Century', icon: '🫧',
      title: 'The Next Century',
      desc: 'The future of our oceans is uncertain, but with proactive conservation efforts and sustainable practices, we can work towards preserving these vital ecosystems for generations to come.'
    },
    {
      age: '4.4 Billion Years Ago', era: 'Hadean Eon', icon: '💧',
      title: 'The First Oceans Form',
      desc: 'As the molten Earth cooled, water vapor condensed into relentless rainstorms that filled the planet’s basins and created the very first liquid oceans.'
    },
    {
      age: '3.5 Billion Years Ago', era: 'Archean Eon', icon: '🦠',
      title: 'Oxygen-Producing Microbes',
      desc: 'Photosynthetic cyanobacteria began forming ancient reef-like mounds called stromatolites, slowly pumping oxygen into the water and transforming Earth’s atmosphere.'
    },
    {
      age: '250 Million Years Ago', era: 'Triassic Period', icon: '🦖',
      title: 'Marine Reptiles Rule the Seas',
      desc: 'Following the Great Dying, giant predators like ichthyosaurs and plesiosaurs evolved to dominate the Mesozoic oceans alongside spiraling ammonites.'
    },
    {
      age: '66 Million Years Ago', era: 'Cretaceous–Paleogene', icon: '☄️',
      title: 'The Great Marine Reset',
      desc: 'An asteroid impact triggered global ocean acidification and wiped out giant marine reptiles and ammonites, clearing the ecological stage for modern fish and sharks.'
    },
    {
      age: '2.6 Million Years Ago', era: 'Pleistocene Ice Ages', icon: '🧊',
      title: 'Shifting Shorelines & Megafauna',
      desc: 'Repeated glacial cycles locked vast amounts of seawater into ice sheets, dropping sea levels by over 100 meters while giant sharks like Megalodon faded away.'
    }
  ];

  /* --- 6 · Ocean depth zones --- */
  const OCEAN_ZONES = [
    {
      name: 'Sunlight Zone', sub: 'Epipelagic', range: '0 – 200 m',
      light: '100% → 1%', lightPct: 100, bg: ['#0e7fb5', '#0a5c8c'],
      temp: '≈ 20 °C at the surface', pressure: '1–20 atm',
      feature: 'Photosynthesis happens here',
      desc: 'The warm, bright skin of the ocean. Sunlight fuels phytoplankton — microscopic drifters that produce roughly half of Earth’s oxygen and anchor nearly every marine food web. About 90% of all known marine life lives in this thin layer.',
      creatures: 'Whales, tuna, sharks, sea turtles, plankton, most coral reefs'
    },
    {
      name: 'Twilight Zone', sub: 'Mesopelagic', range: '200 – 1,000 m',
      light: '< 1% (faint blue)', lightPct: 12, bg: ['#084a74', '#063455'],
      temp: '≈ 4–20 °C', pressure: '20–100 atm',
      feature: 'Largest animal migration on Earth',
      desc: 'Only a ghost of blue light remains — too weak for photosynthesis. Every night, billions of lanternfish, squid and krill rise from here to feed at the surface, then sink again by dawn: the biggest migration on the planet, repeated daily.',
      creatures: 'Lanternfish, hatchetfish, giant squid, bristlemouths, siphonophores'
    },
    {
      name: 'Midnight Zone', sub: 'Bathypelagic', range: '1,000 – 4,000 m',
      light: '0% sunlight', lightPct: 0, bg: ['#04263f', '#031a2e'],
      temp: '≈ 4 °C', pressure: '100–400 atm',
      feature: 'Bioluminescence rules',
      desc: 'Total, permanent darkness. The only light is made by life itself — flashes, lures and burglar alarms. Food is scarce, so bodies are flabby, mouths enormous, and patience is the top survival strategy. Sperm whales dive here to hunt squid.',
      creatures: 'Anglerfish, gulper eels, vampire squid, alarm jellyfish, sperm whales (visiting)'
    },
    {
      name: 'Abyss', sub: 'Abyssopelagic', range: '4,000 – 6,000 m',
      light: '0%', lightPct: 0, bg: ['#02121f', '#010b16'],
      temp: '≈ 2 °C', pressure: '400–600 atm',
      feature: 'Crushing pressure, near-freezing',
      desc: 'The abyssal plains are the most common landscape on Earth — vast, silent meadows of soft sediment. Life feeds on “marine snow”, a slow drizzle of organic crumbs from above, and on rare windfalls like a whale fall that can sustain an ecosystem for decades.',
      creatures: 'Dumbo octopus, sea pigs, tripod fish, brittle stars, giant amphipods'
    },
    {
      name: 'Trench Zone', sub: 'Hadalpelagic', range: '6,000 m +',
      light: '0%', lightPct: 0, bg: ['#01070f', '#000308'],
      temp: '≈ 1–4 °C', pressure: 'up to 1,100 atm',
      feature: 'Deeper than Everest is tall',
      desc: 'Named after Hades, the hadal zone exists only inside ocean trenches. At Challenger Deep (≈ 10,935 m) the pressure is like balancing 100 elephants on your head — yet snailfish, amphipods and microbes thrive. More people have walked on the Moon than reached its bottom.',
      creatures: 'Hadal snailfish, swarming amphipods, xenophyophores, microbes'
    }
  ];

  /* --- 7 · Threats (flip cards) --- */
  const THREATS = [
    {
      emoji: '🥤', title: 'Plastic Pollution', stat: '≈ 11M tonnes / year',
      hook: 'A truckload of plastic enters the ocean every minute. It never truly disappears — it just gets smaller.',
      back: 'Plastic breaks into microplastics that are now found from Arctic ice to the deepest trench, and inside plankton, fish, seabirds — and us. Over 800 species are harmed by ingestion or entanglement.',
      tip: 'Refuse single-use plastic, carry a bottle and bags, and join one local beach or river cleanup — most ocean plastic starts on land.'
    },
    {
      emoji: '🎣', title: 'Overfishing', stat: '≈ 37% of stocks overfished',
      hook: 'Industrial fleets now fish beyond what the ocean can regenerate, and empty nets echo through food webs.',
      back: 'More than a third of assessed fish stocks are harvested unsustainably. Bycatch — unwanted turtles, sharks, dolphins and juvenile fish — is discarded by the millions of tonnes, and top predators like sharks have declined ~70% since 1970.',
      tip: 'Choose certified sustainable seafood (MSC / ASC labels), eat lower on the food chain, and support marine protected areas.'
    },
    {
      emoji: '🔥', title: 'Ocean Warming', stat: '≈ 90% of excess heat',
      hook: 'The ocean is the planet’s heat sponge — and it is running a fever that fuels bleaching and stronger storms.',
      back: 'Marine heatwaves have roughly doubled in frequency since the 1980s. Warm water bleaches coral, pushes species toward the poles, melts ice from below and supercharges hurricanes. Even if emissions stopped today, the ocean would keep warming for centuries.',
      tip: 'Cut your carbon footprint — cleaner transport, less waste, efficient homes — and vote for climate policy. Every fraction of a degree matters.'
    },
    {
      emoji: '⚗️', title: 'Acidification', stat: '≈ +30% acidity since 1850',
      hook: 'The ocean absorbs about a quarter of our CO₂ — and pays for it in chemistry.',
      back: 'Dissolved CO₂ lowers pH and strips out carbonate ions that oysters, corals, plankton and pteropods need to build shells. It is osteoporosis for the ocean, quietly weakening the base of entire food webs.',
      tip: 'The fix is the same as for warming: less CO₂. Support clean energy, reduce emissions, and protect seagrass and mangroves that lock carbon away.'
    },
    {
      emoji: '🌊', title: 'Sea Level Rise', stat: '≈ 4.5 mm / year',
      hook: 'Rising seas are already affecting coastal communities, and the rate is accelerating.',
      back: 'Global mean sea level has risen about 20 cm since the late 19th century, with the rate of increase accelerating in recent decades. This is due to thermal expansion of seawater and the loss of ice from glaciers and ice sheets.',
      tip: 'Support policies that reduce greenhouse gas emissions and invest in coastal resilience measures.'
    },
    {
      emoji: '🫧', title: 'Chemical and Agricultural Pollution', stat: '≈ 8 million tons annually',
      hook: 'Runoff from farms, cities, and industries carries nutrients and chemicals into the ocean, creating dead zones and harming marine life.',
      back: 'Excess nutrients from fertilizers can lead to algal blooms that deplete oxygen in the water, creating hypoxic zones where marine life cannot survive. Chemical pollutants can accumulate in the food chain, affecting both wildlife and human health.',
      tip: 'Reduce the use of chemical fertilizers and pesticides, support sustainable agriculture, and advocate for better wastewater treatment.'
    },
    {
      emoji: '🧊', title: 'Melting Ice and Habitat Loss', stat: '≈ 13% decline in Arctic sea ice per decade',
      hook: 'Arctic sea ice is melting at an alarming rate, threatening the habitats of polar bears, seals, and other ice-dependent species.',
      back: 'The loss of sea ice reduces the reflective surface of the Arctic, leading to more heat absorption by the ocean and further warming. This creates a feedback loop that accelerates ice loss and impacts global climate patterns.',
      tip: 'Support policies to reduce greenhouse gas emissions and protect Arctic wildlife and ecosystems.'
    },
    {
      emoji: '🌡️', title: 'Climate Change and Ocean Currents', stat: 'Disrupted circulation patterns',
      hook: 'Climate change is altering ocean currents, which can have far-reaching effects on global weather patterns and marine ecosystems.',
      back: 'Ocean currents play a crucial role in regulating Earth’s climate by redistributing heat and nutrients. Changes in these currents due to climate change can lead to more extreme weather events and disrupt marine food webs.',
      tip: 'Support research and policies aimed at understanding and mitigating the impacts of climate change on ocean dynamics.'
    },
  ];

  /* --- 8 · Did-you-know carousel facts --- */
  const OCEAN_FACTS = [
    { emoji: '🌬️', text: 'Every second breath you take comes from the ocean — phytoplankton produce more than half of Earth’s oxygen.', source: 'NOAA Ocean Service' },
    { emoji: '🗺️', text: 'More than 80% of the ocean remains unmapped, unobserved and unexplored. We have better maps of Mars.', source: 'NOAA Ocean Exploration' },
    { emoji: '💙', text: 'A blue whale’s heart weighs about 180 kg, and its tongue alone can weigh as much as an elephant.', source: 'Natural History Museum' },
    { emoji: '🏔️', text: 'Challenger Deep is ≈ 10,935 m down — if you dropped Mount Everest in, its peak would still be over 2 km underwater.', source: 'GEBCO Seabed 2030' },
    { emoji: '🔥', text: 'The ocean has absorbed about 90% of the excess heat from global warming, and roughly a quarter of our CO₂ emissions.', source: 'IPCC AR6' },
    { emoji: '⛰️', text: 'The longest mountain range on Earth is underwater: the mid-ocean ridge system stretches about 65,000 km around the globe.', source: 'NOAA / USGS' },
    { emoji: '✨', text: 'About 76% of deep-sea animals make their own living light through bioluminescence — making it Earth’s most common form of communication.', source: 'MBARI' },
    { emoji: '🔊', text: 'Sound travels roughly 4.3 times faster in seawater than in air — about 1,480 metres per second — allowing whale songs to cross entire ocean basins.', source: 'NOAA Ocean Acoustics' },
    { emoji: '🌋', text: 'Hydrothermal vents on the deep seafloor spew mineral-rich water hotter than 400 °C, yet crushing pressure keeps it from boiling into steam.', source: 'Woods Hole Oceanographic Institution' },
    { emoji: '🌊', text: 'The Great Ocean Conveyor Belt takes roughly 1,000 years to circulate a single drop of water through all the world’s ocean basins.', source: 'NOAA / WHOI' },
    { emoji: '🦑', text: 'The giant squid can grow up to 13 m long, but it was first filmed alive in its natural habitat only in 2012.', source: 'NHK / Discovery Channel' },
    { emoji: '🧬', text: 'The ocean is home to an estimated 2.2 million species, but only about 230,000 have been formally described by science.', source: 'UNESCO / Census of Marine Life' },
    { emoji: '🪸', text: 'Coral reefs occupy less than 1% of the ocean floor, yet they support roughly 25% of all marine species.', source: 'NOAA Coral Reef Conservation Program' }

  ];
  /* ========================================================================
     HELPERS & ENVIRONMENT
     ======================================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const FINE_POINTER = !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches);
  const HAS_GSAP = typeof window.gsap !== 'undefined';
  const HAS_ST = HAS_GSAP && typeof window.ScrollTrigger !== 'undefined';
  if (HAS_ST) window.gsap.registerPlugin(window.ScrollTrigger);

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  const onVisible = (el, cb, start = 'top 85%') => {
    if (!el) return;
    if (HAS_ST) {
      window.ScrollTrigger.create({ trigger: el, start, once: true, onEnter: cb });
    } else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { io.disconnect(); cb(); }
        });
      }, { threshold: 0.2 });
      io.observe(el);
    } else {
      cb();
    }
  };

  /* ========================================================================
     1 · HERO LETTER SPLIT, PARALLAX & BUBBLES
     ======================================================================== */
  function initHero() {
    const title = $('#heroTitle');
    if (title) {
      const text = title.textContent.trim();
      title.setAttribute('aria-label', text);
      let idx = 0;
      title.innerHTML = text.split(/\s+/).map((word) => {
        const letters = [...word].map((ch) =>
          `<span class="letter" style="--i:${idx++}" aria-hidden="true">${ch}</span>`
        ).join('');
        idx++;
        return `<span class="word" aria-hidden="true">${letters}</span>`;
      }).join(' ');
    }

    if (REDUCED) return;

    const bubblesHost = $('#bubbles');
    if (bubblesHost) {
      const count = window.innerWidth < 640 ? 16 : 28;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        const size = 6 + Math.random() * 20;
        s.style.width = `${size.toFixed(1)}px`;
        s.style.height = `${size.toFixed(1)}px`;
        s.style.left = `${(Math.random() * 100).toFixed(1)}%`;
        s.style.animationDuration = `${(12 + Math.random() * 18).toFixed(1)}s`;
        s.style.animationDelay = `${(-Math.random() * 22).toFixed(1)}s`;
        s.style.setProperty('--dx', `${((Math.random() - 0.5) * 90).toFixed(0)}px`);
        s.style.setProperty('--o', (0.2 + Math.random() * 0.42).toFixed(2));
        frag.appendChild(s);
      }
      bubblesHost.appendChild(frag);
    }

    const hero = $('#home');
    const layers = $$('.hero-layer', hero);
    if (hero && layers.length) {
      let tx = 0, ty = 0, cx = 0, cy = 0;
      hero.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });

      (function tick() {
        cx = lerp(cx, tx, 0.06);
        cy = lerp(cy, ty, 0.06);
        layers.forEach((layer) => {
          const d = parseFloat(layer.dataset.depth || '0.2');
          layer.style.transform = `translate3d(${(-cx * d * 42).toFixed(2)}px, ${(-cy * d * 30).toFixed(2)}px, 0)`;
        });
        requestAnimationFrame(tick);
      })();
    }

    if (HAS_ST) {
      window.gsap.to('.hero-wave', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ========================================================================
     CUSTOM CURSOR & 3D CARD TILT / GLOW
     ======================================================================== */
  function initCursorAndTilt() {
    if (REDUCED) return;

    if (FINE_POINTER) {
      const dot = $('#cursorDot');
      const ring = $('#cursorRing');
      if (dot && ring) {
        document.body.classList.add('has-cursor');
        let mx = -100, my = -100, rx = -100, ry = -100;

        window.addEventListener('pointermove', (e) => {
          mx = e.clientX;
          my = e.clientY;
          dot.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
        }, { passive: true });

        window.addEventListener('pointerdown', () => ring.classList.add('is-down'));
        window.addEventListener('pointerup', () => ring.classList.remove('is-down'));

        const interactiveSel = 'a, button, select, input, [role="button"]';
        document.addEventListener('pointerover', (e) => {
          if (e.target.closest(interactiveSel)) ring.classList.add('is-active');
        });
        document.addEventListener('pointerout', (e) => {
          if (e.target.closest(interactiveSel)) ring.classList.remove('is-active');
        });

        (function follow() {
          rx = lerp(rx, mx, 0.17);
          ry = lerp(ry, my, 0.17);
          const half = ring.offsetWidth / 2 || 19;
          ring.style.transform = `translate3d(${(rx - half).toFixed(1)}px, ${(ry - half).toFixed(1)}px, 0)`;
          requestAnimationFrame(follow);
        })();
      }
    }

    if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
      document.addEventListener('pointermove', (e) => {
        const card = e.target.closest('.hoverable');
        if (!card) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
        const rx = (0.5 - py) * 7;
        const ry = (px - 0.5) * 9;
        card.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-5px)`;
      }, { passive: true });

      document.addEventListener('pointerout', (e) => {
        const card = e.target.closest('.hoverable');
        if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
      });
    }
  }

  /* ========================================================================
     NAVIGATION, SCROLL PROGRESS & DEPTH GRADIENT
     ======================================================================== */
  function initNavigation() {
    const nav = $('#siteNav');
    const toggle = $('#navToggle');
    const menu = $('#navMenu');
    const links = $$('.nav-link');
    const progressFill = $('#progressFill');
    const rootStyle = document.documentElement.style;

    const setOpen = (open) => {
      toggle.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
    links.forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    const exploreBtn = $('#exploreBtn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        const target = $('#climate');
        if (target) target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
      });
    }

    const backToTop = $('#backToTop');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
      });
    }

    const DEPTH_STOPS = [
      { p: 0.00, a: [230, 250, 251], b: [127, 220, 236], c: [47, 168, 204] },
      { p: 0.22, a: [38, 152, 186], b: [14, 96, 142], c: [8, 56, 98] },
      { p: 0.55, a: [10, 62, 106], b: [5, 34, 70], c: [3, 18, 44] },
      { p: 1.00, a: [4, 22, 48], b: [2, 11, 28], c: [1, 5, 16] }
    ];
    const mix = (x, y, t) => Math.round(lerp(x, y, t));
    const rgb = (c1, c2, t) => `rgb(${mix(c1[0], c2[0], t)}, ${mix(c1[1], c2[1], t)}, ${mix(c1[2], c2[2], t)})`;

    const sections = ['climate', 'trends', 'species', 'timeline', 'zones', 'threats', 'facts'].map((id) => $(`#${id}`));

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = clamp(window.scrollY / max, 0, 1);

      if (progressFill) progressFill.style.transform = `scaleX(${p.toFixed(4)})`;
      nav.classList.toggle('is-deep', window.scrollY > window.innerHeight * 0.45);

      let s0 = DEPTH_STOPS[0], s1 = DEPTH_STOPS[DEPTH_STOPS.length - 1];
      for (let i = 0; i < DEPTH_STOPS.length - 1; i++) {
        if (p >= DEPTH_STOPS[i].p && p <= DEPTH_STOPS[i + 1].p) {
          s0 = DEPTH_STOPS[i];
          s1 = DEPTH_STOPS[i + 1];
          break;
        }
      }
      const local = s1.p === s0.p ? 0 : (p - s0.p) / (s1.p - s0.p);
      rootStyle.setProperty('--bg-a', rgb(s0.a, s1.a, local));
      rootStyle.setProperty('--bg-b', rgb(s0.b, s1.b, local));
      rootStyle.setProperty('--bg-c', rgb(s0.c, s1.c, local));

      const probe = window.scrollY + window.innerHeight * 0.35;
      let currentId = '';
      sections.forEach((sec) => {
        if (sec && sec.offsetTop <= probe) currentId = sec.id;
      });
      links.forEach((a) => {
        const active = a.getAttribute('href') === `#${currentId}`;
        a.classList.toggle('is-active', active);
        if (active) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ========================================================================
     RENDER — climate cards & animated counters
     ======================================================================== */
  function renderClimate() {
    const grid = $('#climateGrid');
    grid.innerHTML = CLIMATE_INDICATORS.map((c) => `
      <article class="climate-card glass hoverable tilt" data-reveal-item>
        <div class="climate-top">
          <span class="climate-icon" aria-hidden="true">${c.icon}</span>
          <span class="trend-badge">${c.trend}</span>
        </div>
        <h3>${c.label}</h3>
        <p class="climate-value">
          <span class="counter" data-target="${c.value}" data-decimals="${c.decimals}" data-plus="${c.plus}">0</span><span class="climate-suffix">${c.suffix}</span>
        </p>
        <p class="climate-desc">${c.desc}</p>
      </article>`).join('');
  }

  const formatCounter = (v, decimals, plus) =>
    (plus && v > 0 ? '+' : '') + v.toFixed(decimals);

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals, 10) || 0;
    const plus = el.dataset.plus === 'true';
    const dur = 1700;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = clamp((now - t0) / dur, 0, 1);
      el.textContent = formatCounter(target * ease(p), decimals, plus);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatCounter(target, decimals, plus);
    };
    requestAnimationFrame(tick);
  }

  function initCounters() {
    $$('.counter').forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals, 10) || 0;
      const plus = el.dataset.plus === 'true';
      if (REDUCED) { el.textContent = formatCounter(target, decimals, plus); return; }
      el.textContent = formatCounter(0, decimals, plus);
      onVisible(el, () => animateCounter(el), 'top 92%');
    });
  }

  /* ========================================================================
     RENDER — interactive climate SVG chart
     ======================================================================== */
  function initChart() {
    const svg = $('#chartSvg');
    const wrap = $('#chartWrap');
    const tooltip = $('#chartTooltip');
    const select = $('#chartSelect');
    const titleEl = $('#chartTitle');
    const subEl = $('#chartSub');
    const live = $('#chartLive');

    const W = 860, H = 440;
    const PAD = { top: 28, right: 28, bottom: 52, left: 76 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    let activeKey = 'temperature';
    let activeIndex = CHART_YEARS.length - 1;
    let coords = [];

    function draw(key, animate = true) {
      activeKey = key;
      const ds = CHART_SERIES[key];
      titleEl.textContent = ds.title;
      subEl.textContent = ds.sub;
      svg.innerHTML = '';
      tooltip.hidden = true;

      const minRaw = Math.min(...ds.values);
      const maxRaw = Math.max(...ds.values);
      const span = Math.max(0.001, maxRaw - minRaw);
      const min = minRaw - span * 0.1;
      const max = maxRaw + span * 0.1;

      const xAt = (i) => PAD.left + (i / (CHART_YEARS.length - 1)) * plotW;
      const yAt = (v) => PAD.top + (1 - (v - min) / (max - min)) * plotH;

      const defs = svgEl('defs');
      const grad = svgEl('linearGradient', { id: 'areaGrad', x1: '0', y1: '0', x2: '0', y2: '1' });
      grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': ds.color, 'stop-opacity': '0.35' }));
      grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': ds.color, 'stop-opacity': '0.0' }));
      defs.appendChild(grad);
      svg.appendChild(defs);

      for (let t = 0; t <= 4; t++) {
        const val = lerp(min, max, t / 4);
        const y = yAt(val);
        svg.appendChild(svgEl('line', { x1: PAD.left, y1: y, x2: W - PAD.right, y2: y, class: 'chart-grid-line' }));
        const lbl = svgEl('text', { x: PAD.left - 12, y: y + 4, 'text-anchor': 'end', class: 'chart-axis-text' });
        const prefix = ds.plus && val > 0 ? '+' : '';
        lbl.textContent = `${prefix}${val.toFixed(ds.tickDecimals)}`;
        svg.appendChild(lbl);
      }

      CHART_YEARS.forEach((yr, i) => {
        if (yr % 5 !== 0 && i !== CHART_YEARS.length - 1) return;
        const x = xAt(i);
        const lbl = svgEl('text', { x, y: H - PAD.bottom + 26, 'text-anchor': 'middle', class: 'chart-axis-text' });
        lbl.textContent = yr;
        svg.appendChild(lbl);
      });

      coords = ds.values.map((v, i) => ({ x: xAt(i), y: yAt(v), year: CHART_YEARS[i], value: v }));
      const lineD = coords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      const areaD = `${lineD} L${coords[coords.length - 1].x.toFixed(1)},${PAD.top + plotH} L${coords[0].x.toFixed(1)},${PAD.top + plotH} Z`;

      const area = svgEl('path', { d: areaD, fill: 'url(#areaGrad)' });
      const line = svgEl('path', { d: lineD, stroke: ds.color, class: 'chart-line' });
      svg.appendChild(area);
      svg.appendChild(line);

      const crosshair = svgEl('line', {
        x1: 0, y1: PAD.top, x2: 0, y2: PAD.top + plotH,
        class: 'chart-crosshair', visibility: 'hidden'
      });
      const marker = svgEl('circle', {
        cx: 0, cy: 0, r: 6.5, stroke: ds.color,
        class: 'chart-marker', visibility: 'hidden'
      });
      svg.appendChild(crosshair);
      svg.appendChild(marker);

      const hit = svgEl('rect', {
        x: PAD.left, y: PAD.top, width: plotW, height: plotH,
        fill: 'transparent', style: 'cursor: crosshair;'
      });
      svg.appendChild(hit);

      const formatVal = (v) => {
        const prefix = ds.plus && v > 0 ? '+' : '';
        return ds.unit === 'pH' ? `pH ${v.toFixed(ds.decimals)}` : `${prefix}${v.toFixed(ds.decimals)} ${ds.unit}`;
      };

      const showPoint = (idx, announce = false) => {
        activeIndex = clamp(idx, 0, coords.length - 1);
        const p = coords[activeIndex];
        crosshair.setAttribute('x1', p.x);
        crosshair.setAttribute('x2', p.x);
        crosshair.setAttribute('visibility', 'visible');
        marker.setAttribute('cx', p.x);
        marker.setAttribute('cy', p.y);
        marker.setAttribute('visibility', 'visible');

        const formatted = formatVal(p.value);
        tooltip.innerHTML = `<span class="tt-year">${p.year}</span><span class="tt-value">${formatted}</span>`;
        tooltip.style.left = `${(p.x / W) * 100}%`;
        tooltip.style.top = `${(p.y / H) * 100}%`;
        tooltip.hidden = false;
        if (announce && live) live.textContent = `${ds.title}, ${p.year}: ${formatted}`;
      };

      const idxFromClientX = (clientX) => {
        const r = svg.getBoundingClientRect();
        const svgX = ((clientX - r.left) / r.width) * W;
        const ratio = (svgX - PAD.left) / plotW;
        return Math.round(ratio * (CHART_YEARS.length - 1));
      };

      hit.addEventListener('pointermove', (e) => showPoint(idxFromClientX(e.clientX)));
      hit.addEventListener('pointerdown', (e) => showPoint(idxFromClientX(e.clientX), true));
      wrap.addEventListener('pointerleave', () => {
        crosshair.setAttribute('visibility', 'hidden');
        marker.setAttribute('visibility', 'hidden');
        tooltip.hidden = true;
      });

      svg.onkeydown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          showPoint(activeIndex + (e.key === 'ArrowRight' ? 1 : -1), true);
        }
      };

      if (animate && !REDUCED) {
        const len = line.getTotalLength();
        line.style.strokeDasharray = len;
        line.style.strokeDashoffset = len;
        area.style.opacity = '0';
        if (HAS_GSAP) {
          window.gsap.to(line, { strokeDashoffset: 0, duration: 1.25, ease: 'power2.out' });
          window.gsap.to(area, { opacity: 1, duration: 1, delay: 0.25 });
        } else {
          line.style.transition = 'stroke-dashoffset 1.2s ease';
          area.style.transition = 'opacity 0.9s ease 0.2s';
          requestAnimationFrame(() => {
            line.style.strokeDashoffset = '0';
            area.style.opacity = '1';
          });
        }
      }
    }

    select.addEventListener('change', () => draw(select.value, true));
    draw('temperature', false);
    onVisible($('#trends'), () => draw(activeKey, true), 'top 80%');
  }

  /* ========================================================================
     RENDER — species grid, search, filters & active "Dive deeper →" pages
     ======================================================================== */
  const filterState = { query: '', zone: 'all', status: 'all' };

  const speciesMatches = (sp) => {
    const q = filterState.query;
    const text = (sp.name + ' ' + sp.sci + ' ' + sp.fact + ' ' + sp.zone).toLowerCase();
    return (!q || text.includes(q)) &&
      (filterState.zone === 'all' || sp.zone === filterState.zone) &&
      (filterState.status === 'all' || sp.status === filterState.status);
  };

  function updateResultCount(n) {
    $('#resultCount').innerHTML = `Showing <strong>${n}</strong> of <strong>${SPECIES.length}</strong> species`;
  }

  function renderSpecies(animate = false) {
    const grid = $('#speciesGrid');
    const empty = $('#speciesEmpty');
    const matched = SPECIES.filter(speciesMatches);
    updateResultCount(matched.length);

    if (!matched.length) {
      grid.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = matched.map((sp) => {
      const detailUrl = `species.html?id=${encodeURIComponent(sp.id)}`;
      return `
      <article class="species-card glass hoverable tilt" data-id="${sp.id}" data-reveal-item>
        <div class="species-icon" aria-hidden="true">${speciesIconHTML(sp)}</div>
        <h3 class="species-name">${sp.name}</h3>
        <p class="species-sci">${sp.sci}</p>
        <div class="badge-row">${badgeHTML(sp)}</div>
        <p class="species-fact">${sp.fact}</p>
        <a class="card-cta" href="${detailUrl}" aria-label="Dive deeper into ${sp.name}">
          Dive deeper <span class="cta-arrow" aria-hidden="true">→</span>
        </a>
      </article>`;
    }).join('');

    if (animate && HAS_GSAP && !REDUCED) {
      window.gsap.fromTo('#speciesGrid .species-card',
        { opacity: 0, y: 18, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.035, ease: 'power2.out', clearProps: 'transform' }
      );
    }
  }

  function initSpecies() {
    renderSpecies(false);

    const searchInput = $('#speciesSearch');
    const zoneBtns = $$('#zoneFilters .filter-btn');
    const statusBtns = $$('#statusFilters .filter-btn');
    const clearBtn = $('#clearFilters');
    const grid = $('#speciesGrid');

    const pulseBtn = (btn) => {
      if (HAS_GSAP && !REDUCED) {
        window.gsap.fromTo(btn, { scale: 0.91 }, { scale: 1, duration: 0.32, ease: 'back.out(2.2)', clearProps: 'transform' });
      }
    };

    searchInput.addEventListener('input', () => {
      filterState.query = searchInput.value.trim().toLowerCase();
      renderSpecies(true);
    });

    zoneBtns.forEach((btn) => btn.addEventListener('click', () => {
      filterState.zone = btn.dataset.zone;
      zoneBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      pulseBtn(btn);
      renderSpecies(true);
    }));

    statusBtns.forEach((btn) => btn.addEventListener('click', () => {
      filterState.status = btn.dataset.status;
      statusBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      pulseBtn(btn);
      renderSpecies(true);
    }));

    clearBtn.addEventListener('click', () => {
      filterState.query = '';
      filterState.zone = 'all';
      filterState.status = 'all';
      searchInput.value = '';
      zoneBtns.forEach((b, i) => { b.classList.toggle('is-active', i === 0); b.setAttribute('aria-pressed', String(i === 0)); });
      statusBtns.forEach((b, i) => { b.classList.toggle('is-active', i === 0); b.setAttribute('aria-pressed', String(i === 0)); });
      renderSpecies(true);
      searchInput.focus();
    });

    // Clicking anywhere on a species card navigates to its dedicated profile page
    grid.addEventListener('click', (e) => {
      if (e.target.closest('a.card-cta')) return;
      const card = e.target.closest('.species-card');
      if (card && speciesById[card.dataset.id]) {
        window.location.href = `species.html?id=${encodeURIComponent(card.dataset.id)}`;
      }
    });
  }

  /* ========================================================================
     RENDER — Ocean Life Timeline
     ======================================================================== */
  function renderTimeline() {
    const list = $('#timelineList');
    if (!list) return;
    list.innerHTML = OCEAN_TIMELINE.map((item) => `
      <li class="timeline-item" data-reveal-item>
        <span class="timeline-node" aria-hidden="true">${item.icon}</span>
        <article class="timeline-card glass hoverable">
          <div class="timeline-head">
            <span class="timeline-age">${item.age}</span>
            <span class="timeline-era">${item.era}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
        </article>
      </li>`).join('');
  }

  /* ========================================================================
     RENDER — Ocean Depth Zones & Threats Flip Cards
     ======================================================================== */
  function initZonesAndThreats() {
    const zonesWrap = $('#zonesDiagram');
    zonesWrap.innerHTML = OCEAN_ZONES.map((z, i) => `
      <article class="zone${i === 0 ? ' is-open' : ''}" style="--z1:${z.bg[0]};--z2:${z.bg[1]};--light:${z.lightPct}%;">
        <button class="zone-header" type="button" aria-expanded="${i === 0}" aria-controls="zoneBody${i}">
          <span class="zone-depth">${z.range}</span>
          <span class="zone-name">${z.name} <small>${z.sub} · ${z.feature}</small></span>
          <span class="zone-light">Light: ${z.light}</span>
          <svg class="zone-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="zone-body" id="zoneBody${i}">
          <div class="zone-body-inner">
            <div class="zone-body-content">
              <p>${z.desc}</p>
              <ul class="zone-stats">
                <li>🌡️ Temp: ${z.temp}</li>
                <li>🧭 Pressure: ${z.pressure}</li>
                <li>☀️ Sunlight: ${z.light}</li>
              </ul>
              <p class="zone-residents"><strong>Notable life:</strong> ${z.creatures}</p>
              <div class="light-bar" aria-hidden="true"><span></span></div>
            </div>
          </div>
        </div>
      </article>`).join('');

    $$('.zone', zonesWrap).forEach((zone) => {
      const btn = $('.zone-header', zone);
      btn.addEventListener('click', () => {
        const willOpen = !zone.classList.contains('is-open');
        $$('.zone', zonesWrap).forEach((z) => {
          z.classList.remove('is-open');
          $('.zone-header', z).setAttribute('aria-expanded', 'false');
        });
        if (willOpen) {
          zone.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          if (HAS_GSAP && !REDUCED) {
            window.gsap.fromTo($('.zone-body-content', zone),
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
            );
          }
        }
      });
    });

    const threatsGrid = $('#threatsGrid');
    threatsGrid.innerHTML = THREATS.map((t) => `
      <div class="flip-card" role="button" tabindex="0" aria-pressed="false" data-reveal-item
           aria-label="${t.title} (${t.stat}). Activate to flip for details and how you can help.">
        <div class="flip-inner">
          <div class="flip-face flip-front">
            <span class="threat-stat">${t.stat}</span>
            <span class="threat-icon" aria-hidden="true">${t.emoji}</span>
            <h3>${t.title}</h3>
            <p class="threat-hook">${t.hook}</p>
            <span class="flip-hint" aria-hidden="true">↻ Tap or click to flip</span>
          </div>
          <div class="flip-face flip-back">
            <h4>Why it matters</h4>
            <p>${t.back}</p>
            <div class="threat-tip">
              <strong>How you can help</strong>
              ${t.tip}
            </div>
          </div>
        </div>
      </div>`).join('');

    $$('.flip-card', threatsGrid).forEach((card) => {
      const toggleFlip = () => {
        const flipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', String(flipped));
      };
      card.addEventListener('click', toggleFlip);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFlip();
        }
      });
    });
  }

  /* ========================================================================
     RENDER — Did-You-Know Carousel
     ======================================================================== */
  function initCarousel() {
    const root = $('#factsCarousel');
    const track = $('#factsTrack');
    const dotsWrap = $('#factsDots');
    const prev = $('#factPrev');
    const next = $('#factNext');
    const playPause = $('#factsPlayPause');

    track.innerHTML = OCEAN_FACTS.map((f, i) => `
      <figure class="fact-slide" aria-hidden="${i !== 0}">
        <span class="fact-emoji" aria-hidden="true">${f.emoji}</span>
        <blockquote>“${f.text}”</blockquote>
        <figcaption>Source: ${f.source}</figcaption>
      </figure>`).join('');

    dotsWrap.innerHTML = OCEAN_FACTS.map((_, i) => `
      <button class="carousel-dot${i === 0 ? ' is-active' : ''}" type="button"
              data-slide="${i}" aria-label="Show fact ${i + 1} of ${OCEAN_FACTS.length}"
              aria-current="${i === 0}"></button>`).join('');

    const slides = $$('.fact-slide', track);
    const dots = $$('.carousel-dot', dotsWrap);
    let index = 0;
    let userPaused = REDUCED;
    let hovering = false;
    let timer = null;

    const go = (n) => {
      index = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== index)));
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === index);
        d.setAttribute('aria-current', String(i === index));
      });
    };

    const pulseArrow = (btn) => {
      if (HAS_GSAP && !REDUCED) {
        window.gsap.fromTo(btn, { scale: 0.86 }, { scale: 1, duration: 0.35, ease: 'back.out(2.2)', clearProps: 'transform' });
      }
    };

    const syncTimer = () => {
      clearInterval(timer);
      playPause.textContent = userPaused ? '▶ Play' : '⏸ Pause';
      playPause.setAttribute('aria-pressed', String(userPaused));
      if (!userPaused && !hovering) {
        timer = setInterval(() => go(index + 1), 6500);
      }
    };

    prev.addEventListener('click', () => { go(index - 1); pulseArrow(prev); syncTimer(); });
    next.addEventListener('click', () => { go(index + 1); pulseArrow(next); syncTimer(); });
    dots.forEach((d) => d.addEventListener('click', () => { go(Number(d.dataset.slide)); syncTimer(); }));
    playPause.addEventListener('click', () => { userPaused = !userPaused; syncTimer(); });

    root.addEventListener('mouseenter', () => { hovering = true; syncTimer(); });
    root.addEventListener('mouseleave', () => { hovering = false; syncTimer(); });
    root.addEventListener('focusin', () => { hovering = true; syncTimer(); });
    root.addEventListener('focusout', () => { hovering = false; syncTimer(); });

    let startX = 0;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { go(index + (dx < 0 ? 1 : -1)); syncTimer(); }
    });

    syncTimer();
  }

  /* ========================================================================
     NEWSLETTER FORM VALIDATION
     ======================================================================== */
  function initNewsletter() {
    const form = $('#newsletterForm');
    const input = $('#emailInput');
    const msg = $('#formMsg');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      msg.className = 'form-msg';
      input.removeAttribute('aria-invalid');

      if (!val || !emailRe.test(val)) {
        msg.textContent = 'Please enter a valid email address (for example, diver@ocean.org).';
        msg.classList.add('is-error');
        input.setAttribute('aria-invalid', 'true');
        input.classList.remove('shake');
        void input.offsetWidth;
        input.classList.add('shake');
        input.focus();
        return;
      }

      msg.textContent = `Thanks, ${val}! You’re subscribed to our ocean briefing (demo only).`;
      msg.classList.add('is-success');
      form.reset();
    });
  }

  /* ========================================================================
     SCROLL REVEAL CHOREOGRAPHY
     ======================================================================== */
  function initScrollReveals() {
    if (REDUCED) return;

    if (HAS_ST) {
      $$('[data-reveal]').forEach((el) => {
        window.gsap.from(el, {
          y: 34, opacity: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true }
        });
      });

      $$('[data-reveal-group]').forEach((group) => {
        const items = $$('[data-reveal-item]', group);
        if (!items.length) return;
        window.gsap.from(items, {
          y: 38, opacity: 0, scale: 0.96, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: group, start: 'top 84%', once: true }
        });
      });
      return;
    }

    const targets = [...$$('[data-reveal]'), ...$$('[data-reveal-item]')];
    targets.forEach((el) => el.classList.add('pre-reveal'));

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    targets.forEach((el) => io.observe(el));
  }

  /* ========================================================================
     BOOT
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    renderClimate();
    initCounters();
    initChart();
    initSpecies();
    renderTimeline();
    initZonesAndThreats();
    initCarousel();
    initNewsletter();

    initHero();
    initCursorAndTilt();
    initNavigation();
    initScrollReveals();
  });
})();