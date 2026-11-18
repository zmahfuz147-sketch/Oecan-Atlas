/* whales-page.js — page-specific interactions for the whales & dolphins page */
(() => {
    "use strict";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ============ NAV ============ */
    const nav = document.getElementById("siteNav");
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");

    const closeMenu = () => {
        if (!navToggle || !navMenu) return;
        navToggle.classList.remove("is-open");
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation menu");
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.classList.toggle("is-open", !isOpen);
            navMenu.classList.toggle("is-open", !isOpen);
            navToggle.setAttribute("aria-expanded", String(!isOpen));
            navToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
        });
        navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
        document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
        document.addEventListener("click", (event) => { if (nav && !nav.contains(event.target)) closeMenu(); });
    }

    /* ============ PROGRESS BAR ============ */
    const progressFill = document.getElementById("progressFill");

    const updateScrollUI = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        if (progressFill) progressFill.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
        if (nav) nav.classList.toggle("is-deep", window.scrollY > 35);
    };

    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    window.addEventListener("resize", updateScrollUI, { passive: true });

    /* ============ HERO CTA ============ */
    const exploreButton = document.getElementById("exploreBtn");
    const countSection = document.getElementById("count");
    if (exploreButton && countSection) {
        exploreButton.addEventListener("click", () => {
            countSection.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        });
    }

    /* ============ BACK TO TOP ============ */
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
        });
    }

    /* ============ GLOBAL BUBBLES ============ */
    const bubbleContainer = document.getElementById("bubbles");
    if (bubbleContainer && !reducedMotion) {
        for (let i = 0; i < 16; i += 1) {
            const bubble = document.createElement("span");
            const size = 5 + Math.round(Math.random() * 15);
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.round(Math.random() * 100)}%`;
            bubble.style.animationDuration = `${14 + Math.random() * 18}s`;
            bubble.style.animationDelay = `${-Math.random() * 24}s`;
            bubble.style.setProperty("--o", `${0.16 + Math.random() * 0.24}`);
            bubble.style.setProperty("--dx", `${Math.round(Math.random() * 60 - 30)}px`);
            bubbleContainer.appendChild(bubble);
        }
    }

    /* ============ MARINE SNOW ============ */
    const snowContainer = document.getElementById("marineSnow");
    if (snowContainer && !reducedMotion) {
        for (let i = 0; i < 30; i += 1) {
            const flake = document.createElement("span");
            flake.className = "snow-flake";
            const size = 1 + Math.random() * 2.5;
            flake.style.width = `${size}px`;
            flake.style.height = `${size}px`;
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.top = `${-10 - Math.random() * 20}%`;
            flake.style.opacity = `${0.2 + Math.random() * 0.4}`;
            flake.style.animationDuration = `${10 + Math.random() * 16}s`;
            flake.style.animationDelay = `${-Math.random() * 22}s`;
            snowContainer.appendChild(flake);
        }
    }

    /* ============ SCENE AMBIENT BUBBLES ============ */
    const buildSceneBubbles = (containerId, count) => {
        const container = document.getElementById(containerId);
        if (!container || reducedMotion) return;
        for (let i = 0; i < count; i += 1) {
            const bubble = document.createElement("span");
            const size = 3 + Math.random() * 7;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animationDuration = `${9 + Math.random() * 9}s`;
            bubble.style.animationDelay = `${-Math.random() * 12}s`;
            container.appendChild(bubble);
        }
    };
    buildSceneBubbles("chaseBubbles", 12);
    buildSceneBubbles("disturbBubbles", 14);

    /* ============ BUBBLE TRAIL FOR THE DISTURBANCE DOLPHIN ============ */
    const disturbStage = document.querySelector(".disturb-stage");
    const disturbDolphin = disturbStage ? disturbStage.querySelector(".disturb-dolphin") : null;

    if (disturbStage && disturbDolphin && !reducedMotion) {
        const spawnTrailBubble = () => {
            const stageRect = disturbStage.getBoundingClientRect();
            const dRect = disturbDolphin.getBoundingClientRect();
            // only spawn if the dolphin is inside the stage and visible
            if (dRect.bottom < stageRect.top || dRect.top > stageRect.bottom) return;

            const bubble = document.createElement("span");
            bubble.className = "trail-bubble";
            const size = 4 + Math.random() * 6;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            // Spawn near the dolphin's body, biased toward its tail
            bubble.style.left = `${dRect.left - stageRect.left + dRect.width * (0.3 + Math.random() * 0.5)}px`;
            bubble.style.top = `${dRect.top - stageRect.top + dRect.height * (0.3 + Math.random() * 0.5)}px`;
            bubble.style.animationDuration = `${1.2 + Math.random() * 0.9}s`;
            disturbStage.appendChild(bubble);
            window.setTimeout(() => bubble.remove(), 2200);
        };

        // spawn a short burst every ~220ms
        window.setInterval(spawnTrailBubble, 220);
    }

    /* ============ NEWSLETTER ============ */
    const newsletterForm = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("emailInput");
    const formMessage = document.getElementById("formMsg");
    if (newsletterForm && emailInput && formMessage) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!emailInput.checkValidity()) {
                emailInput.setAttribute("aria-invalid", "true");
                formMessage.textContent = "Please enter a valid email address.";
                formMessage.classList.remove("is-success");
                formMessage.classList.add("is-error");
                emailInput.focus();
                return;
            }
            emailInput.removeAttribute("aria-invalid");
            formMessage.textContent = "Thanks! This front-end demo does not send or store email addresses.";
            formMessage.classList.remove("is-error");
            formMessage.classList.add("is-success");
            newsletterForm.reset();
        });
    }

    /* ============ CUSTOM CURSOR ============ */
    const cursorDot = document.getElementById("cursorDot");
    const cursorRing = document.getElementById("cursorRing");
    if (!reducedMotion && window.matchMedia("(pointer: fine)").matches && cursorDot && cursorRing) {
        document.body.classList.add("has-cursor");
        document.addEventListener("mousemove", (event) => {
            cursorDot.style.transform = `translate3d(${event.clientX - 4}px, ${event.clientY - 4}px, 0)`;
            cursorRing.style.transform = `translate3d(${event.clientX - 19}px, ${event.clientY - 19}px, 0)`;
        });
        document.querySelectorAll("a, button, input").forEach((el) => {
            el.addEventListener("mouseenter", () => cursorRing.classList.add("is-active"));
            el.addEventListener("mouseleave", () => cursorRing.classList.remove("is-active"));
        });
        document.addEventListener("mousedown", () => cursorRing.classList.add("is-down"));
        document.addEventListener("mouseup", () => cursorRing.classList.remove("is-down"));
    }

    /* ============ GSAP REVEALS ============ */
    const gsapLib = window.gsap;
    const scrollTriggerPlugin = window.ScrollTrigger;
    if (gsapLib && scrollTriggerPlugin && !reducedMotion) {
        gsapLib.registerPlugin(scrollTriggerPlugin);

        gsapLib.utils.toArray("[data-reveal]").forEach((el) => {
            gsapLib.from(el, {
                opacity: 0,
                y: 26,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true }
            });
        });

        gsapLib.utils.toArray("[data-reveal-group]").forEach((group) => {
            gsapLib.from(group.children, {
                opacity: 0,
                y: 24,
                duration: 0.65,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: { trigger: group, start: "top 88%", once: true }
            });
        });

        // Subtle scene parallax: the whale body and dolphin bob a touch more
        gsapLib.utils.toArray(".scene-stage").forEach((stage) => {
            gsapLib.to(stage, {
                backgroundPositionY: "30%",
                ease: "none",
                scrollTrigger: {
                    trigger: stage,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });
    }
})();