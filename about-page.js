(function () {
    "use strict";

    const page = document.querySelector(".about-page");
    const depthDisplay = document.getElementById("about-current-depth");

    if (!page) {
        return;
    }

    const depthSections = Array.from(
        page.querySelectorAll("[data-about-depth]")
    );

    const reducedMotion = window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;


    /* ==========================================
       DEPTH COUNTER
    ========================================== */

    if (depthDisplay && depthSections.length > 0) {

        const updateDepth = (section) => {
            if (!section) {
                return;
            }

            const depth = section.getAttribute("data-about-depth");

            if (depth) {
                depthDisplay.textContent = depth;
            }
        };


        if ("IntersectionObserver" in window) {

            const depthObserver = new IntersectionObserver(
                (entries) => {

                    const visibleSections = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort(
                            (first, second) =>
                                second.intersectionRatio - first.intersectionRatio
                        );

                    if (visibleSections.length > 0) {
                        updateDepth(visibleSections[0].target);
                    }

                },
                {
                    root: null,
                    rootMargin: "-40% 0px -40% 0px",
                    threshold: 0
                }
            );

            depthSections.forEach((section) => {
                depthObserver.observe(section);
            });

        } else {

            const updateDepthFromScroll = () => {

                const viewportMiddle = window.innerHeight / 2;

                let closestSection = null;
                let closestDistance = Infinity;

                depthSections.forEach((section) => {

                    const rect = section.getBoundingClientRect();

                    const sectionMiddle = rect.top + rect.height / 2;
                    const distance = Math.abs(viewportMiddle - sectionMiddle);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestSection = section;
                    }

                });

                updateDepth(closestSection);

            };

            window.addEventListener("scroll", updateDepthFromScroll, {
                passive: true
            });

            window.addEventListener("resize", updateDepthFromScroll);

            updateDepthFromScroll();

        }

    }


    /* ==========================================
       GSAP SCROLL ANIMATIONS
    ========================================== */

    const gsap = window.gsap;
    const scrollTrigger = window.ScrollTrigger;

    if (reducedMotion || !gsap || !scrollTrigger) {
        return;
    }

    gsap.registerPlugin(scrollTrigger);


    /* ==========================================
       FADE-UP ON SCROLL
    ========================================== */

    const revealElements = page.querySelectorAll(".about-reveal");

    revealElements.forEach((element) => {

        gsap.fromTo(
            element,
            {
                y: 24,
                autoAlpha: 0
            },
            {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                ease: "power2.out",
                clearProps: "transform,opacity,visibility",

                scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    once: true
                }
            }
        );

    });


    /* ==========================================
       BACKGROUND DARKENS WITH SCROLL
    ========================================== */

    const underwaterArea = page.querySelector(".about-depths");

    if (underwaterArea) {

        gsap.to(underwaterArea, {
            "--about-depth-progress": 0.28,
            ease: "none",

            scrollTrigger: {
                trigger: underwaterArea,
                start: "top bottom",
                end: "bottom bottom",
                scrub: 0.5
            }
        });

    }

})();