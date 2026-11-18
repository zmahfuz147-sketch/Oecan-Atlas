(() => {
    "use strict";

    const nav = document.getElementById("siteNav");
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const progressFill = document.getElementById("progressFill");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

        navMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });

        document.addEventListener("click", (event) => {
            if (!nav.contains(event.target)) closeMenu();
        });
    }

    const updateScrollUI = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        if (progressFill) progressFill.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
        if (nav) nav.classList.toggle("is-deep", window.scrollY > 35);
    };

    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    window.addEventListener("resize", updateScrollUI, { passive: true });

    const exploreButton = document.getElementById("exploreBtn");
    const countSection = document.getElementById("count");
    if (exploreButton && countSection) {
        exploreButton.addEventListener("click", () => {
            countSection.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        });
    }

    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
        });
    }

    const bubbleContainer = document.getElementById("bubbles");
    if (bubbleContainer && !reducedMotion) {
        const bubbleCount = 18;
        for (let index = 0; index < bubbleCount; index += 1) {
            const bubble = document.createElement("span");
            const size = 5 + Math.round(Math.random() * 16);
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.round(Math.random() * 100)}%`;
            bubble.style.animationDuration = `${12 + Math.random() * 18}s`;
            bubble.style.animationDelay = `${-Math.random() * 24}s`;
            bubble.style.setProperty("--o", `${0.18 + Math.random() * 0.26}`);
            bubble.style.setProperty("--dx", `${Math.round(Math.random() * 70 - 35)}px`);
            bubbleContainer.appendChild(bubble);
        }
    }

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

    const cursorDot = document.getElementById("cursorDot");
    const cursorRing = document.getElementById("cursorRing");
    if (!reducedMotion && window.matchMedia("(pointer: fine)").matches && cursorDot && cursorRing) {
        document.body.classList.add("has-cursor");
        document.addEventListener("mousemove", (event) => {
            cursorDot.style.transform = `translate3d(${event.clientX - 4}px, ${event.clientY - 4}px, 0)`;
            cursorRing.style.transform = `translate3d(${event.clientX - 19}px, ${event.clientY - 19}px, 0)`;
        });

        document.querySelectorAll("a, button, input").forEach((element) => {
            element.addEventListener("mouseenter", () => cursorRing.classList.add("is-active"));
            element.addEventListener("mouseleave", () => cursorRing.classList.remove("is-active"));
        });
        document.addEventListener("mousedown", () => cursorRing.classList.add("is-down"));
        document.addEventListener("mouseup", () => cursorRing.classList.remove("is-down"));
    }

    const gsapLib = window.gsap;
    const scrollTriggerPlugin = window.ScrollTrigger;
    if (gsapLib && scrollTriggerPlugin && !reducedMotion) {
        gsapLib.registerPlugin(scrollTriggerPlugin);

        gsapLib.to(document.documentElement, {
            "--bg-a": "#041d3d",
            "--bg-b": "#02102a",
            "--bg-c": "#010817",
            ease: "none",
            scrollTrigger: {
                trigger: "main",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });

        gsapLib.utils.toArray("[data-reveal]").forEach((element) => {
            gsapLib.from(element, {
                opacity: 0,
                y: 26,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    once: true
                }
            });
        });

        gsapLib.utils.toArray("[data-reveal-group]").forEach((group) => {
            gsapLib.from(group.children, {
                opacity: 0,
                y: 24,
                duration: 0.65,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: group,
                    start: "top 88%",
                    once: true
                }
            });
        });
    }
})();