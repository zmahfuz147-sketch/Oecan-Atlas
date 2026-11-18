/* OceanAtlas interactive world map. All state and helpers are private to this IIFE. */
(() => {
    "use strict";

    const mapApp = document.querySelector(".map-app");
    const mapSvg = document.getElementById("map-world");
    const mapViewport = document.getElementById("map-viewport");
    const mapContent = document.getElementById("map-world-content");
    const mapGrid = document.getElementById("map-graticule");
    const mapLand = document.getElementById("map-landmasses");
    const mapVisuals = document.getElementById("map-region-visuals");
    const mapButtonsLayer = document.getElementById("map-hotspot-layer");
    const mapStatus = document.getElementById("map-map-status");
    const mapAnnouncer = document.getElementById("map-announcer");
    const mapDataNode = document.getElementById("map-region-data");

    if (!mapApp || !mapSvg || !mapViewport || !mapContent || !mapGrid || !mapLand || !mapVisuals || !mapButtonsLayer) {
        console.warn("OceanAtlas map: required map elements are missing. Use the region links below the map.");
        return;
    }

    let mapRegions = [];
    try {
        mapRegions = mapDataNode ? JSON.parse(mapDataNode.textContent || "[]") : [];
    } catch (error) {
        console.error("OceanAtlas map data is invalid JSON.", error);
        mapRegions = [];
    }

    const mapRequiredFields = ["id", "name", "tagline", "seas", "deepestPoint", "species", "topThreat", "funFact", "page", "lat", "lon"];
    mapRegions = Array.isArray(mapRegions) ? mapRegions.filter((region) =>
        region && mapRequiredFields.every((field) => Object.prototype.hasOwnProperty.call(region, field)) &&
        Array.isArray(region.species) && Number.isFinite(Number(region.lat)) && Number.isFinite(Number(region.lon))
    ) : [];

    const mapSvgNS = "http://www.w3.org/2000/svg";
    const mapReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mapInitialView = { x: 0, y: 0, w: 1200, h: 600 };
    let mapView = { ...mapInitialView };
    let mapSelectedId = null;
    let mapActiveTween = null;
    let mapPointerState = new Map();
    let mapDrag = null;
    let mapPinch = null;

    const mapElements = {
        empty: document.getElementById("map-empty-state"),
        details: document.getElementById("map-region-details"),
        name: document.getElementById("map-region-name"),
        kicker: document.getElementById("map-region-kicker"),
        tagline: document.getElementById("map-region-tagline"),
        seas: document.getElementById("map-region-seas"),
        deepest: document.getElementById("map-region-deepest"),
        species: document.getElementById("map-region-species"),
        threat: document.getElementById("map-region-threat"),
        fact: document.getElementById("map-region-fact"),
        open: document.getElementById("map-open-region"),
        zoomIn: document.getElementById("map-zoom-in"),
        zoomOut: document.getElementById("map-zoom-out"),
        reset: document.getElementById("map-reset")
    };

    /* Equirectangular projection: longitude -180..180 => x 0..1200; latitude 90..-90 => y 0..600. */
    const mapProject = (latitude, longitude) => ({
        x: ((Number(longitude) + 180) / 360) * 1200,
        y: ((90 - Number(latitude)) / 180) * 600
    });

    const mapSvgElement = (tag, attrs = {}) => {
        const node = document.createElementNS(mapSvgNS, tag);
        Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
        return node;
    };

    const mapSetStatus = (message) => {
        if (mapStatus) mapStatus.textContent = message;
    };

    const mapBuildGrid = () => {
        const gridFragment = document.createDocumentFragment();
        for (let latitude = -60; latitude <= 80; latitude += 20) {
            const points = [];
            for (let longitude = -180; longitude <= 180; longitude += 5) {
                points.push(mapProject(latitude, longitude));
            }
            const d = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
            gridFragment.appendChild(mapSvgElement("path", { d, class: "map-graticule-line" }));
        }
        for (let longitude = -150; longitude <= 180; longitude += 30) {
            const points = [];
            for (let latitude = -85; latitude <= 85; latitude += 5) points.push(mapProject(latitude, longitude));
            const d = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
            gridFragment.appendChild(mapSvgElement("path", { d, class: "map-graticule-line" }));
        }
        mapGrid.appendChild(gridFragment);
    };

    /* Simplified continent outlines, stored as [longitude, latitude] pairs. */
    const mapLandShapes = [
        { name: "North America", points: [[-168,70],[-150,72],[-135,68],[-128,58],[-132,51],[-124,42],[-117,32],[-105,25],[-97,18],[-83,9],[-78,25],[-65,45],[-53,55],[-60,66],[-85,73],[-115,78],[-145,75]] },
        { name: "Greenland", points: [[-53,83],[-28,81],[-20,72],[-31,61],[-48,59],[-62,68]] },
        { name: "South America", points: [[-81,12],[-72,10],[-58,7],[-47,1],[-35,-8],[-42,-22],[-52,-34],[-61,-48],[-70,-56],[-76,-39],[-79,-18]] },
        { name: "Europe and Asia", points: [[-10,36],[-8,48],[5,55],[20,60],[33,58],[43,66],[60,72],[86,76],[112,72],[137,65],[160,58],[178,52],[166,43],[150,38],[139,34],[128,28],[119,17],[110,7],[99,5],[91,17],[80,8],[75,20],[65,25],[55,23],[47,30],[39,36],[30,39],[25,45],[13,44],[4,41]] },
        { name: "Africa", points: [[-17,35],[2,37],[20,33],[34,30],[43,12],[40,-8],[31,-24],[20,-35],[10,-34],[1,-20],[-7,-2],[-15,13]] },
        { name: "Arabian Peninsula", points: [[35,31],[50,29],[57,21],[52,13],[43,12],[39,19]] },
        { name: "India", points: [[67,25],[88,27],[91,20],[84,7],[78,5],[72,17]] },
        { name: "Southeast Asian mainland", points: [[92,22],[105,22],[109,14],[105,5],[99,1],[94,9]] },
        { name: "Japan", points: [[130,32],[134,35],[139,40],[143,44],[145,41],[141,35],[137,31]] },
        { name: "Philippines", points: [[119,19],[123,20],[126,13],[124,6],[120,8],[117,14]] },
        { name: "Indonesia", points: [[95,5],[106,5],[115,-2],[124,-4],[131,-7],[140,-8],[137,-4],[127,1],[116,3],[107,1],[98,0]] },
        { name: "Madagascar", points: [[49,-12],[51,-17],[49,-25],[46,-23],[45,-16]] },
        { name: "Australia", points: [[113,-11],[126,-12],[139,-11],[153,-22],[151,-37],[137,-43],[120,-35],[114,-24]] },
        { name: "New Guinea", points: [[131,-2],[145,-2],[151,-7],[143,-10],[135,-8]] },
        { name: "New Zealand North", points: [[172,-35],[178,-38],[176,-41],[171,-40]] },
        { name: "New Zealand South", points: [[166,-42],[173,-44],[170,-47],[167,-46]] },
        { name: "Antarctica", points: [[-180,-68],[-155,-72],[-125,-70],[-95,-74],[-60,-70],[-25,-73],[10,-69],[45,-74],[80,-70],[115,-73],[150,-69],[180,-71],[180,-90],[-180,-90]] }
    ];

    const mapBuildLand = () => {
        const fragment = document.createDocumentFragment();
        mapLandShapes.forEach((shape) => {
            const points = shape.points.map(([longitude, latitude]) => mapProject(latitude, longitude));
            const d = points.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ") + " Z";
            fragment.appendChild(mapSvgElement("path", { d, class: "map-land-shape", "aria-label": shape.name }));
        });
        mapLand.appendChild(fragment);
    };

    const mapClamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const mapRenderView = () => {
        mapSvg.setAttribute("viewBox", `${mapView.x} ${mapView.y} ${mapView.w} ${mapView.h}`);
        mapPositionHotspotButtons();
    };

    const mapPositionHotspotButtons = () => {
        if (!mapSvg.getScreenCTM) return;
        const matrix = mapSvg.getScreenCTM();
        const rect = mapViewport.getBoundingClientRect();
        if (!matrix || !rect.width || !rect.height) return;
        mapButtonsLayer.querySelectorAll(".map-hotspot-button").forEach((button) => {
            const lat = Number(button.dataset.lat);
            const lon = Number(button.dataset.lon);
            const point = mapSvg.createSVGPoint();
            const projected = mapProject(lat, lon);
            point.x = projected.x;
            point.y = projected.y;
            const screen = point.matrixTransform(matrix);
            button.style.left = `${screen.x - rect.left}px`;
            button.style.top = `${screen.y - rect.top}px`;
        });
    };

    const mapStopTween = () => {
        if (mapActiveTween && typeof mapActiveTween.kill === "function") mapActiveTween.kill();
        mapActiveTween = null;
    };

    const mapApplyView = (x, y, width) => {
        const w = mapClamp(width, 320, mapInitialView.w);
        const h = w / 2;
        mapView = {
            x: mapClamp(x, 0, mapInitialView.w - w),
            y: mapClamp(y, 0, mapInitialView.h - h),
            w,
            h
        };
        mapRenderView();
    };

    const mapFlyTo = (region) => {
        if (!region) return;
        mapStopTween();
        const point = mapProject(region.lat, region.lon);
        const width = 470;
        const target = {
            x: mapClamp(point.x - width / 2, 0, mapInitialView.w - width),
            y: mapClamp(point.y - width / 4, 0, mapInitialView.h - width / 2),
            w: width
        };
        if (mapReducedMotion || !window.gsap || typeof window.gsap.to !== "function") {
            mapApplyView(target.x, target.y, target.w);
            return;
        }
        const proxy = { x: mapView.x, y: mapView.y, w: mapView.w };
        mapActiveTween = window.gsap.to(proxy, {
            x: target.x,
            y: target.y,
            w: target.w,
            duration: 1.05,
            ease: "power2.inOut",
            onUpdate: () => mapApplyView(proxy.x, proxy.y, proxy.w),
            onComplete: () => { mapActiveTween = null; }
        });
        if (document.hidden && mapActiveTween && mapActiveTween.pause) mapActiveTween.pause();
    };

    const mapFillSpecies = (items) => {
        const list = mapElements.species;
        if (!list) return;
        list.replaceChildren();
        (Array.isArray(items) ? items.slice(0, 3) : []).forEach((species) => {
            const item = document.createElement("li");
            const emoji = document.createElement("span");
            const name = document.createElement("span");
            emoji.className = "map-species-emoji";
            emoji.setAttribute("aria-hidden", "true");
            emoji.textContent = typeof species.emoji === "string" ? species.emoji : "🌊";
            name.textContent = typeof species.name === "string" ? species.name : "Species name unavailable";
            item.append(emoji, name);
            list.appendChild(item);
        });
        if (!list.children.length) {
            const item = document.createElement("li");
            item.textContent = "Species information unavailable.";
            list.appendChild(item);
        }
    };

    const mapSelectRegion = (region, options = {}) => {
        if (!region) return;
        const sameSelection = mapSelectedId === region.id;
        mapSelectedId = region.id;

        if (mapElements.empty) mapElements.empty.hidden = true;
        if (mapElements.details) mapElements.details.hidden = false;
        if (mapElements.name) mapElements.name.textContent = region.name;
        if (mapElements.kicker) {
            const index = mapRegions.findIndex((item) => item.id === region.id) + 1;
            mapElements.kicker.textContent = `REGION ${String(index).padStart(2, "0")} / ${String(mapRegions.length).padStart(2, "0")}`;
        }
        if (mapElements.tagline) mapElements.tagline.textContent = region.tagline;
        if (mapElements.seas) mapElements.seas.textContent = region.seas;
        if (mapElements.deepest) mapElements.deepest.textContent = region.deepestPoint;
        if (mapElements.threat) mapElements.threat.textContent = region.topThreat;
        if (mapElements.fact) mapElements.fact.textContent = region.funFact;
        mapFillSpecies(region.species);

        if (mapElements.open) {
            mapElements.open.href = region.page;
            mapElements.open.removeAttribute("aria-disabled");
        }

        mapVisuals.querySelectorAll(".map-region-visual").forEach((visual) => {
            visual.classList.toggle("map-selected", visual.dataset.regionId === region.id);
        });
        mapButtonsLayer.querySelectorAll(".map-hotspot-button").forEach((button) => {
            const active = button.dataset.regionId === region.id;
            button.classList.toggle("map-hotspot-active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        if (mapAnnouncer) mapAnnouncer.textContent = `${region.name} selected. ${region.tagline}`;
        mapSetStatus(`Selected: ${region.name}`);

        if (options.zoom && !sameSelection) mapFlyTo(region);
        if (options.updateHash && window.location.hash !== `#${region.id}`) {
            window.location.hash = region.id;
        }
    };

    const mapBuildMarkers = () => {
        const visualFragment = document.createDocumentFragment();
        const buttonFragment = document.createDocumentFragment();
        mapRegions.forEach((region) => {
            const point = mapProject(region.lat, region.lon);
            const visual = mapSvgElement("g", { class: "map-region-visual", "data-region-id": region.id });
            visual.appendChild(mapSvgElement("circle", { cx: point.x, cy: point.y, r: 18, class: "map-region-halo" }));
            visual.appendChild(mapSvgElement("circle", { cx: point.x, cy: point.y, r: 13, class: "map-region-pulse" }));
            visual.appendChild(mapSvgElement("circle", { cx: point.x, cy: point.y, r: 5.5, class: "map-region-core" }));
            const label = mapSvgElement("text", { x: point.x, y: point.y - 19, class: "map-region-label" });
            label.textContent = region.name.replace(" · ", " ").replace(" & Bay of Bengal", "");
            visual.appendChild(label);
            visualFragment.appendChild(visual);

            const button = document.createElement("button");
            button.type = "button";
            button.className = "map-hotspot-button";
            button.dataset.regionId = region.id;
            button.dataset.lat = String(region.lat);
            button.dataset.lon = String(region.lon);
            button.setAttribute("aria-label", `Select ${region.name}`);
            button.setAttribute("aria-pressed", "false");
            const hiddenLabel = document.createElement("span");
            hiddenLabel.className = "map-visually-hidden";
            hiddenLabel.textContent = region.name;
            button.appendChild(hiddenLabel);
            button.addEventListener("click", () => mapSelectRegion(region, { updateHash: true, zoom: true }));
            buttonFragment.appendChild(button);
        });
        mapVisuals.appendChild(visualFragment);
        mapButtonsLayer.appendChild(buttonFragment);
        mapPositionHotspotButtons();
    };

    const mapFindByHash = () => {
        const id = window.location.hash.replace(/^#/, "").trim();
        if (!id) return;
        const region = mapRegions.find((item) => item.id === id);
        if (region && mapSelectedId !== region.id) mapSelectRegion(region, { updateHash: false, zoom: true });
    };

    const mapZoomAt = (clientX, clientY, factor) => {
        mapStopTween();
        const rect = mapViewport.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = mapClamp((clientX - rect.left) / rect.width, 0, 1);
        const py = mapClamp((clientY - rect.top) / rect.height, 0, 1);
        const centerX = mapView.x + px * mapView.w;
        const centerY = mapView.y + py * mapView.h;
        const nextW = mapClamp(mapView.w * factor, 320, mapInitialView.w);
        const scale = nextW / mapView.w;
        const nextX = centerX - (centerX - mapView.x) * scale;
        const nextY = centerY - (centerY - mapView.y) * scale;
        mapApplyView(nextX, nextY, nextW);
    };

    const mapPointerDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const mapPointerMidpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

    mapViewport.addEventListener("wheel", (event) => {
        event.preventDefault();
        mapZoomAt(event.clientX, event.clientY, event.deltaY < 0 ? 0.86 : 1.16);
    }, { passive: false });

    mapViewport.addEventListener("pointerdown", (event) => {
        if (event.target.closest(".map-hotspot-button, .map-control-button")) return;
        mapViewport.setPointerCapture(event.pointerId);
        mapPointerState.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (mapPointerState.size === 1) {
            mapDrag = { x: event.clientX, y: event.clientY, startX: mapView.x, startY: mapView.y, moved: false };
            mapViewport.classList.add("map-is-dragging");
        } else if (mapPointerState.size === 2) {
            const points = Array.from(mapPointerState.values());
            mapDrag = null;
            mapPinch = {
                distance: mapPointerDistance(points[0], points[1]),
                view: { ...mapView },
                midpoint: mapPointerMidpoint(points[0], points[1])
            };
        }
    });

    mapViewport.addEventListener("pointermove", (event) => {
        if (!mapPointerState.has(event.pointerId)) return;
        mapPointerState.set(event.pointerId, { x: event.clientX, y: event.clientY });
        const rect = mapViewport.getBoundingClientRect();
        if (mapPointerState.size >= 2 && mapPinch) {
            const points = Array.from(mapPointerState.values());
            const distance = mapPointerDistance(points[0], points[1]);
            if (distance > 0 && mapPinch.distance > 0) {
                const midpoint = mapPointerMidpoint(points[0], points[1]);
                const startRatioX = (mapPinch.midpoint.x - rect.left) / rect.width;
                const startRatioY = (mapPinch.midpoint.y - rect.top) / rect.height;
                const anchorX = mapPinch.view.x + startRatioX * mapPinch.view.w;
                const anchorY = mapPinch.view.y + startRatioY * mapPinch.view.h;
                const nextW = mapClamp(mapPinch.view.w * mapPinch.distance / distance, 320, mapInitialView.w);
                const midX = (midpoint.x - rect.left) / rect.width;
                const midY = (midpoint.y - rect.top) / rect.height;
                mapApplyView(anchorX - midX * nextW, anchorY - midY * (nextW / 2), nextW);
            }
            return;
        }
        if (mapDrag) {
            const dx = event.clientX - mapDrag.x;
            const dy = event.clientY - mapDrag.y;
            if (Math.abs(dx) + Math.abs(dy) > 4) mapDrag.moved = true;
            mapApplyView(mapDrag.startX - dx * mapView.w / rect.width, mapDrag.startY - dy * mapView.h / rect.height, mapView.w);
        }
    });

    const mapEndPointer = (event) => {
        mapPointerState.delete(event.pointerId);
        if (mapPointerState.size < 2) mapPinch = null;
        if (mapPointerState.size === 0) {
            mapDrag = null;
            mapViewport.classList.remove("map-is-dragging");
        } else if (mapPointerState.size === 1) {
            const remaining = Array.from(mapPointerState.values())[0];
            mapDrag = { x: remaining.x, y: remaining.y, startX: mapView.x, startY: mapView.y, moved: true };
        }
    };
    ["pointerup", "pointercancel"].forEach((type) => mapViewport.addEventListener(type, mapEndPointer));

    if (mapElements.zoomIn) mapElements.zoomIn.addEventListener("click", () => {
        const rect = mapViewport.getBoundingClientRect();
        mapZoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 0.78);
    });
    if (mapElements.zoomOut) mapElements.zoomOut.addEventListener("click", () => {
        const rect = mapViewport.getBoundingClientRect();
        mapZoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.28);
    });
    if (mapElements.reset) mapElements.reset.addEventListener("click", () => {
        mapStopTween();
        mapApplyView(mapInitialView.x, mapInitialView.y, mapInitialView.w);
    });

    window.addEventListener("hashchange", mapFindByHash);
    window.addEventListener("resize", mapPositionHotspotButtons, { passive: true });
    if (window.ResizeObserver) {
        const observer = new ResizeObserver(mapPositionHotspotButtons);
        observer.observe(mapViewport);
    }

    document.addEventListener("visibilitychange", () => {
        mapApp.classList.toggle("map-paused", document.hidden);
        if (mapActiveTween && typeof mapActiveTween.pause === "function") {
            if (document.hidden) mapActiveTween.pause();
            else mapActiveTween.resume();
        }
    });

    if (!mapRegions.length) {
        mapSetStatus("Map data unavailable. Use the region directory below.");
        console.warn("OceanAtlas map: no valid region data found.");
    } else {
        mapBuildGrid();
        mapBuildLand();
        mapBuildMarkers();
        mapSetStatus(`${mapRegions.length} regions ready · select a marker`);
        mapRenderView();
        mapFindByHash();
    }
})();