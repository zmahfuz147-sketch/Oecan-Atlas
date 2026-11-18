/* OceanAtlas map region data. Kept inside an IIFE; no global variables are created. */
(() => {
    "use strict";

    const mapRegions = [
        {
            id: "south-asia",
            name: "South Asia & Bay of Bengal",
            tagline: "Monsoon waters, mangrove labyrinths, and one of the world's great river deltas.",
            seas: "Bay of Bengal, northern Indian Ocean, Andaman Sea, and coastal waters of Bangladesh, India, Sri Lanka, and Myanmar.",
            deepestPoint: "Needs verification — the deepest mapped point depends on whether the Andaman Sea and adjacent basins are included.",
            species: [
                { emoji: "🐬", name: "Ganges river dolphin" },
                { emoji: "🐢", name: "Olive ridley sea turtle" },
                { emoji: "🐋", name: "Bryde's whale" }
            ],
            topThreat: "Coastal habitat loss, plastic pollution, overfishing, and pressure on estuaries and mangroves.",
            funFact: "The Sundarbans form a vast mangrove landscape across the Ganges–Brahmaputra delta and provide important habitat for many coastal species.",
            page: "south-asia.html",
            lat: 14,
            lon: 88
        },
        {
            id: "arabian-gulf",
            name: "Arabian Sea & Persian Gulf",
            tagline: "A meeting place of desert coastlines, monsoon currents, and warm, salty seas.",
            seas: "Arabian Sea, Gulf of Oman, Persian Gulf, Gulf of Aden, and adjoining northwestern Indian Ocean.",
            deepestPoint: "Needs verification — the Arabian Sea and Persian Gulf are separate basins with very different maximum depths.",
            species: [
                { emoji: "🦈", name: "Whale shark" },
                { emoji: "🐢", name: "Hawksbill sea turtle" },
                { emoji: "🦭", name: "Dugong" }
            ],
            topThreat: "Marine heatwaves, coral bleaching, coastal development, shipping, and fishing pressure.",
            funFact: "The Persian Gulf is shallow compared with the nearby Arabian Sea, so hot-season conditions can become especially extreme in its waters.",
            page: "arabian-gulf.html",
            lat: 23,
            lon: 58
        },
        {
            id: "east-asia",
            name: "East Asia",
            tagline: "Temperate shelves, island arcs, and deep basins along the western Pacific rim.",
            seas: "East China Sea, Yellow Sea, Sea of Japan (East Sea), and adjacent western North Pacific.",
            deepestPoint: "Approx. 3,742 m in the Japan Basin of the Sea of Japan; representative of that sea, not all East Asian waters.",
            species: [
                { emoji: "🦀", name: "Japanese spider crab" },
                { emoji: "🐟", name: "Japanese anchovy" },
                { emoji: "🐢", name: "Loggerhead sea turtle" }
            ],
            topThreat: "Intensive fishing, coastal reclamation, marine litter, and changing water temperatures.",
            funFact: "The East Asian marginal seas sit beside some of the world's most densely populated coastlines and highly productive fishing grounds.",
            page: "east-asia.html",
            lat: 36,
            lon: 132
        },
        {
            id: "southeast-asia",
            name: "Southeast Asia · Coral Triangle",
            tagline: "A global centre of tropical marine life, coral diversity, and island habitats.",
            seas: "Sulu, Sulawesi, Banda, Flores, Java, and Timor seas, plus surrounding western Pacific and eastern Indian Ocean waters.",
            // Needs verification: reported Emden Deep depths differ by survey and its inclusion depends on the Coral Triangle boundary.
            deepestPoint: "Needs verification — Philippine Trench depth estimates vary substantially by survey; confirm a current bathymetric source before publishing one maximum.",
            species: [
                { emoji: "🐠", name: "Clown anemonefish" },
                { emoji: "🦈", name: "Whale shark" },
                { emoji: "🐢", name: "Hawksbill sea turtle" }
            ],
            topThreat: "Coral bleaching, destructive fishing, coastal development, and sediment or plastic pollution.",
            funFact: "The Coral Triangle spans waters across six countries and is recognised for exceptional coral-reef biodiversity.",
            page: "southeast-asia.html",
            lat: -3,
            lon: 128
        },
        {
            id: "central-asia",
            name: "Central Asia · Caspian & Aral Seas",
            tagline: "Inland waters with unique wildlife and environmental stories far from the open ocean.",
            seas: "Caspian Sea and the shrinking remnants of the Aral Sea; both are landlocked water bodies, not parts of the global ocean.",
            deepestPoint: "Approx. 1,025 m in the Caspian Sea. The Aral Sea's depth has changed dramatically as it has shrunk.",
            species: [
                { emoji: "🦭", name: "Caspian seal" },
                { emoji: "🐟", name: "Beluga sturgeon" },
                { emoji: "🐟", name: "Caspian roach" }
            ],
            topThreat: "Water diversion, habitat fragmentation, pollution, invasive species, and overexploitation.",
            funFact: "The Caspian is the world's largest enclosed inland body of water, while the Aral Sea has lost much of its former area.",
            page: "central-asia.html",
            lat: 40,
            lon: 51
        },
        {
            id: "oceania",
            name: "Oceania · Pacific Islands",
            tagline: "A vast blue neighbourhood of volcanic islands, atolls, reefs, and migrating giants.",
            seas: "Coral Sea, Tasman Sea, South Pacific island waters, and the wider southwest Pacific.",
            deepestPoint: "Approx. 10,817 m at Horizon Deep in the Tonga Trench; a southwest Pacific reference point.",
            species: [
                { emoji: "🐋", name: "Humpback whale" },
                { emoji: "🐢", name: "Green sea turtle" },
                { emoji: "🐚", name: "Giant clam" }
            ],
            topThreat: "Coral bleaching, ocean warming, sea-level rise, plastic pollution, and pressure on reef fisheries.",
            funFact: "Many Pacific island communities depend directly on reefs and lagoons for food, livelihoods, and cultural identity.",
            page: "oceania.html",
            lat: -20,
            lon: 164
        },
        {
            id: "east-africa",
            name: "East Africa · Indian Ocean",
            tagline: "Reef-fringed coasts, seagrass meadows, deep channels, and monsoon-linked marine life.",
            seas: "Western Indian Ocean, Mozambique Channel, Somali Sea, and coastal waters from the Horn of Africa to southern Africa.",
            deepestPoint: "Needs verification — a local East African regional boundary and bathymetric source are required for a defensible maximum.",
            species: [
                { emoji: "🐋", name: "Whale shark" },
                { emoji: "🦭", name: "Dugong" },
                { emoji: "🐟", name: "West Indian Ocean coelacanth" }
            ],
            topThreat: "Coral reef degradation, destructive fishing, mangrove loss, and coastal pollution.",
            funFact: "The Mozambique Channel is an important passage for marine animals moving between tropical and subtropical western Indian Ocean habitats.",
            page: "east-africa.html",
            lat: -7,
            lon: 48
        },
        {
            id: "west-africa",
            name: "West Africa · Atlantic",
            tagline: "Productive upwelling zones, estuaries, mangroves, and broad tropical Atlantic shelves.",
            seas: "Gulf of Guinea, Canary Current region, and eastern tropical North and South Atlantic coastal waters.",
            deepestPoint: "Needs verification — the local maximum depends on how the West African Atlantic region is bounded.",
            species: [
                { emoji: "🐬", name: "Atlantic humpback dolphin" },
                { emoji: "🦭", name: "West African manatee" },
                { emoji: "🐢", name: "Leatherback sea turtle" }
            ],
            topThreat: "Bycatch, overfishing, mangrove and estuary loss, and pollution from coastal settlements.",
            funFact: "Seasonal coastal upwelling off parts of West Africa brings nutrient-rich water toward the surface and helps support productive fisheries.",
            page: "west-africa.html",
            lat: 3,
            lon: -7
        },
        {
            id: "mediterranean",
            name: "Mediterranean Sea",
            tagline: "A semi-enclosed sea where ancient coastlines meet deep basins and unusual biodiversity.",
            seas: "Western, central, and eastern Mediterranean basins, including the Aegean, Adriatic, and Ionian seas.",
            deepestPoint: "Approx. 5,267 m at Calypso Deep in the Ionian Sea.",
            species: [
                { emoji: "🐢", name: "Loggerhead sea turtle" },
                { emoji: "🦭", name: "Mediterranean monk seal" },
                { emoji: "🐙", name: "Common octopus" }
            ],
            topThreat: "Overfishing, invasive species, plastic pollution, habitat damage, and intense warming.",
            funFact: "More than four-fifths of the Mediterranean seafloor lies deeper than the approximate 200 m boundary commonly used to mark the start of the deep sea.",
            page: "mediterranean.html",
            lat: 36,
            lon: 18
        },
        {
            id: "europe",
            name: "Europe · North Sea, Baltic & Atlantic",
            tagline: "A network of shelves, fjords, enclosed seas, and cold-water Atlantic habitats.",
            seas: "North Sea, Baltic Sea, Norwegian Sea, Celtic Sea, Bay of Biscay, and adjacent Northeast Atlantic.",
            deepestPoint: "Needs verification — the deepest point differs substantially depending on whether the Northeast Atlantic and Norwegian Sea are included.",
            species: [
                { emoji: "🐬", name: "Harbour porpoise" },
                { emoji: "🦞", name: "European lobster" },
                { emoji: "🐦", name: "Atlantic puffin" }
            ],
            topThreat: "Fishing pressure, underwater noise, nutrient pollution, habitat alteration, and climate change.",
            funFact: "The Baltic Sea is brackish: river water and limited exchange with the North Sea create salinity conditions unlike those of the open Atlantic.",
            page: "europe.html",
            lat: 55,
            lon: 14
        },
        {
            id: "north-america",
            name: "North America",
            tagline: "From Arctic shelves to temperate coasts and the deep margins of two great oceans.",
            seas: "North Atlantic, Gulf of Mexico, North Pacific, Bering Sea, Gulf of Alaska, and Arctic-adjacent waters.",
            deepestPoint: "Approx. 8,378 m at Brownson Deep in the Puerto Rico Trench (North Atlantic reference).",
            species: [
                { emoji: "🐋", name: "Gray whale" },
                { emoji: "🦦", name: "Sea otter" },
                { emoji: "🐟", name: "Atlantic cod" }
            ],
            topThreat: "Marine heatwaves, fishing impacts, coastal development, oil and shipping risks, and habitat loss.",
            funFact: "The North American Pacific coast spans cold kelp forests, temperate reefs, and the highly productive waters of the California Current.",
            page: "north-america.html",
            lat: 39,
            lon: -132
        },
        {
            id: "caribbean",
            name: "Caribbean Sea",
            tagline: "Warm tropical waters filled with coral reefs, mangroves, seagrass, and island chains.",
            seas: "Caribbean Sea, Yucatán Channel, passages of the Greater and Lesser Antilles, and nearby western tropical Atlantic.",
            deepestPoint: "Approx. 7,535–7,686 m in the Cayman Trough; published values differ by source and survey method.",
            species: [
                { emoji: "🐚", name: "Queen conch" },
                { emoji: "🐢", name: "Hawksbill sea turtle" },
                { emoji: "🪸", name: "Elkhorn coral" }
            ],
            topThreat: "Coral bleaching, hurricanes, coastal development, disease, and overfishing.",
            funFact: "The Caribbean includes the Cayman Trough, a deep submarine feature between Cuba and Jamaica.",
            page: "caribbean.html",
            lat: 16,
            lon: -73
        },
        {
            id: "south-america",
            name: "South America",
            tagline: "A continent of cold upwelling coasts, tropical estuaries, fjords, and sub-Antarctic waters.",
            seas: "Southeast Pacific, Southwest Atlantic, Humboldt Current region, Patagonian shelf, and southern fjords.",
            deepestPoint: "Needs verification — the deepest adjacent trench point varies with the Pacific and Atlantic boundary used for this region.",
            species: [
                { emoji: "🦎", name: "Marine iguana" },
                { emoji: "🐧", name: "Humboldt penguin" },
                { emoji: "🐋", name: "Southern right whale" }
            ],
            topThreat: "Overfishing, bycatch, plastic pollution, warming currents, and damage to coastal habitats.",
            funFact: "The Humboldt Current carries cold, nutrient-rich water northward along the Pacific coast and supports one of the world's major fisheries.",
            page: "south-america.html",
            lat: -25,
            lon: -78
        },
        {
            id: "arctic",
            name: "Arctic Ocean",
            tagline: "A seasonally changing polar ocean shaped by sea ice, long winters, and resilient wildlife.",
            seas: "Chukchi, Beaufort, Barents, Kara, Laptev, East Siberian, and Lincoln seas, plus the central Arctic Basin.",
            deepestPoint: "Approx. 5,551 m at Molloy Hole, based on Five Deeps multibeam bathymetry; a published CTD value is slightly different.",
            species: [
                { emoji: "🦄", name: "Narwhal" },
                { emoji: "🦭", name: "Walrus" },
                { emoji: "🐋", name: "Bowhead whale" }
            ],
            topThreat: "Rapid sea-ice loss, ocean warming, shipping disturbance, and growing industrial pressures.",
            funFact: "The central Arctic Ocean is covered by sea ice for much of the year, but its seasonal retreat is changing access to marine habitats.",
            page: "arctic.html",
            lat: 80,
            lon: 15
        },
        {
            id: "antarctica",
            name: "Antarctica · Southern Ocean",
            tagline: "A vast circumpolar ocean where sea ice, currents, and krill support iconic polar food webs.",
            seas: "Weddell Sea, Ross Sea, Amundsen Sea, Bellingshausen Sea, and the wider Southern Ocean.",
            deepestPoint: "Approx. 7,432 m at Factorian Deep in the South Sandwich Trench.",
            species: [
                { emoji: "🐧", name: "Emperor penguin" },
                { emoji: "🦭", name: "Weddell seal" },
                { emoji: "🦐", name: "Antarctic krill" }
            ],
            topThreat: "Climate change, ocean warming, changing sea ice, and pressures on krill and other marine resources.",
            funFact: "The Antarctic Circumpolar Current flows around the continent and connects the Atlantic, Indian, and Pacific sectors of the Southern Ocean.",
            page: "antarctica.html",
            lat: -72,
            lon: 10
        }
    ];

    // Deepest-point references used for this educational atlas:
    // Five Deeps / Geoscience Data Journal: Arctic Molloy Hole, North Atlantic Brownson Deep,
    // Indian Java Trench, Pacific Tonga and Mariana trenches, and Southern Ocean South Sandwich Trench.
    // BGS public summary reports the Indian Ocean at approx. 7,187 m and Southern Ocean at approx. 7,432 m.
    // Oceana Europe reports Calypso Deep at approx. 5,267 m. NOAA-linked regional material and a
    // 2025 North Atlantic review show that Cayman Trough depth figures vary (approx. 7,535–7,686 m).
    // The Caspian Sea maximum is approx. 1,025 m. Values are approximate and region boundaries matter.

    const mapDataNode = document.getElementById("map-region-data");
    if (mapDataNode) {
        try {
            mapDataNode.textContent = JSON.stringify(mapRegions);
        } catch (error) {
            mapDataNode.textContent = "[]";
            console.error("OceanAtlas map data could not be serialized.", error);
        }
    }
})();