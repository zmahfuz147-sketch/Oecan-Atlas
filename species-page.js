/* ==========================================================================
   OceanAtlas — species-page.js
   Powers the dedicated species profile page (species.html?id=...).
   ========================================================================== */
(() => {
  'use strict';

  const DATA = window.OCEAN_SPECIES_DATA;
  if (!DATA) return;

  const { SPECIES, byId, ZONE_META, STATUS_META, iconHTML, badgeHTML } = DATA;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const FINE_POINTER = !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches);
  const HAS_GSAP = typeof window.gsap !== 'undefined';

  function getSelectedSpecies() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return (id && byId[id]) ? byId[id] : SPECIES[0];
  }

  function renderProfile(sp) {
    document.title = `${sp.name} (${sp.sci}) — OceanAtlas`;

    $('#spCounter').textContent = `Species ${String(sp.index + 1).padStart(2, '0')} of ${SPECIES.length}`;
    $('#spIcon').innerHTML = iconHTML(sp);
    $('#spTitle').textContent = sp.name;
    $('#spSci').textContent = sp.sci;
    $('#spBadges').innerHTML = badgeHTML(sp);
    $('#spHook').textContent = sp.fact;
    $('#spOverview').textContent = sp.overview;

    const statusInfo = STATUS_META[sp.status];
    $('#spVitals').innerHTML = `
      <div class="vital-box"><dt>Typical Size</dt><dd>${sp.size}</dd></div>
      <div class="vital-box"><dt>Depth Range</dt><dd>${sp.depth}</dd></div>
      <div class="vital-box"><dt>Primary Diet</dt><dd>${sp.diet}</dd></div>
      <div class="vital-box"><dt>Typical Lifespan</dt><dd>${sp.lifespan}</dd></div>
      <div class="vital-box"><dt>IUCN Status</dt><dd>${statusInfo.label}</dd></div>
      <div class="vital-box"><dt>Geographic Range</dt><dd>${sp.region}</dd></div>
    `;

    // Depth gauge percentage (scaled against 7,000 m max species range)
    const pct = clamp((sp.maxDepth / 7000) * 100, 4, 100);
    const zoneMeta = ZONE_META[sp.zone];
    $('#spDepthCaption').innerHTML =
      `Primary habitat: <strong>${sp.zone} Zone</strong> (${zoneMeta.depthLabel}) · Recorded down to <strong>${sp.depth}</strong>.`;

    const fill = $('#spDepthFill');
    if (HAS_GSAP && !REDUCED) {
      window.gsap.fromTo(fill, { width: '0%' }, { width: `${pct.toFixed(1)}%`, duration: 1.1, ease: 'power3.out', delay: 0.2 });
    } else {
      fill.style.width = `${pct.toFixed(1)}%`;
    }

    // Biology facts cards
    $('#spFactsList').innerHTML = sp.facts.map((fact, idx) => `
      <li class="fact-tile">
        <span class="fact-num">0${idx + 1}</span>
        <p>${fact}</p>
      </li>
    `).join('');

    // Conservation
    $('#spConservation').textContent = sp.conservation;
    $('#spNote').textContent = sp.note
      ? `Note: ${sp.note}`
      : `Population trend: ${sp.trend}. Values & status summarized for education from IUCN Red List & NOAA.`;

    // Jump selector
    const select = $('#speciesJumpSelect');
    select.innerHTML = SPECIES.map((item) =>
      `<option value="${item.id}"${item.id === sp.id ? ' selected' : ''}>${item.emoji || '🌊'} ${item.name}</option>`
    ).join('');
    select.onchange = () => {
      window.location.href = `species.html?id=${encodeURIComponent(select.value)}`;
    };

    // Prev / Next links
    const prevSp = SPECIES[(sp.index - 1 + SPECIES.length) % SPECIES.length];
    const nextSp = SPECIES[(sp.index + 1) % SPECIES.length];

    const prevLink = $('#prevSpeciesLink');
    prevLink.href = `species.html?id=${encodeURIComponent(prevSp.id)}`;
    $('#prevSpeciesName').textContent = `${prevSp.emoji || '🌊'} ${prevSp.name}`;

    const nextLink = $('#nextSpeciesLink');
    nextLink.href = `species.html?id=${encodeURIComponent(nextSp.id)}`;
    $('#nextSpeciesName').textContent = `${nextSp.name} ${nextSp.emoji || '🌊'}`;
  }

  function initChrome() {
    const toggle = $('#navToggle');
    const menu = $('#navMenu');
    toggle.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      toggle.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    const progressFill = $('#progressFill');
    window.addEventListener('scroll', () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = clamp(window.scrollY / max, 0, 1);
      if (progressFill) progressFill.style.transform = `scaleX(${p.toFixed(4)})`;
    }, { passive: true });

    if (REDUCED) return;

    // Bubbles
    const bubblesHost = $('#bubbles');
    if (bubblesHost) {
      for (let i = 0; i < 18; i++) {
        const s = document.createElement('span');
        const size = 6 + Math.random() * 18;
        s.style.width = `${size.toFixed(1)}px`;
        s.style.height = `${size.toFixed(1)}px`;
        s.style.left = `${(Math.random() * 100).toFixed(1)}%`;
        s.style.animationDuration = `${(14 + Math.random() * 16).toFixed(1)}s`;
        s.style.animationDelay = `${(-Math.random() * 20).toFixed(1)}s`;
        s.style.setProperty('--dx', `${((Math.random() - 0.5) * 80).toFixed(0)}px`);
        s.style.setProperty('--o', (0.18 + Math.random() * 0.35).toFixed(2));
        bubblesHost.appendChild(s);
      }
    }

    // Custom cursor
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
        document.addEventListener('pointerover', (e) => {
          if (e.target.closest('a, button, select')) ring.classList.add('is-active');
        });
        document.addEventListener('pointerout', (e) => {
          if (e.target.closest('a, button, select')) ring.classList.remove('is-active');
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

    if (HAS_GSAP) {
      window.gsap.from('[data-reveal]', {
        y: 28, opacity: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out', clearProps: 'transform'
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const sp = getSelectedSpecies();
    renderProfile(sp);
    initChrome();
  });
})();