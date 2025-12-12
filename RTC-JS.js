// Logo Reveal Loader
// Logo Reveal Loader


function initLogoRevealLoader() {
  gsap.registerPlugin(CustomEase, SplitText);
  CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99");

  const wrap = document.querySelector("[data-load-wrap]");
  if (!wrap) return;

  const container = wrap.querySelector("[data-load-container]");
  const bg = wrap.querySelector("[data-load-bg]");
  const progressBar = wrap.querySelector("[data-load-progress]");
  const logo = wrap.querySelector("[data-load-logo]");
  const textElements = Array.from(wrap.querySelectorAll("[data-load-text]"));

  // Reset targets that are * not * split text targets
  const resetTargets = Array.from(
    wrap.querySelectorAll('[data-load-reset]:not([data-load-text])')
  );

  // Main loader timeline
  const loadTimeline = gsap.timeline({
      defaults: {
        ease: "loader",
        duration: 2
      }
    })
    .set(wrap, { display: "block" })
    .to(progressBar, { scaleX: 1 })
    .to(logo, { clipPath: "inset(0% 0% 0% 0%)" }, "<")
    .to(container, { autoAlpha: 0, duration: 0.5 })
    .to(progressBar, { scaleX: 0, transformOrigin: "right center", duration: 0.5 }, "<")
    .add("hideContent", "<")
    .to(bg, { yPercent: -101, duration: 1 }, "hideContent")
    .set(wrap, { display: "none" })

  // If there are items to hide FOUC for, reset them at the start
  if (resetTargets.length) {
    loadTimeline.set(resetTargets, { autoAlpha: 1 }, 0);
  }

  // If there's text items, split them, and add to load timeline
  if (textElements.length >= 2) {
    const firstWord = new SplitText(textElements[0], { type: "lines,chars", mask: "lines" });
    const secondWord = new SplitText(textElements[1], { type: "lines,chars", mask: "lines" });

    // Set initial states of the text elements and letters
    gsap.set([firstWord.chars, secondWord.chars], { autoAlpha: 0, yPercent: 125 });
    gsap.set(textElements, { autoAlpha: 1 });

    // first text in
    loadTimeline.to(firstWord.chars, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.6,
      stagger: { each: 0.02 }
    }, 0);

    // first text out while second text in
    loadTimeline.to(firstWord.chars, {
      autoAlpha: 0,
      yPercent: -125,
      duration: 0.4,
      stagger: { each: 0.02 }
    }, ">+=0.4");

    loadTimeline.to(secondWord.chars, {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.6,
      stagger: { each: 0.02 }
    }, "<");

    // second text out
    loadTimeline.to(secondWord.chars, {
      autoAlpha: 0,
      yPercent: -125,
      duration: 0.4,
      stagger: { each: 0.02 }
    }, "hideContent-=0.5");
  }

}

initLogoRevealLoader();

// Side Navigation with Wipe Effect
// Side Navigation with Wipe Effect
// Side Navigation with Wipe Effect

gsap.registerPlugin(CustomEase);

CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");

gsap.defaults({
  ease: "main",
  duration: 0.7
});

function initSideNavigationWipeEffect() {
  let navWrap = document.querySelector(".nav")
  let state = navWrap.getAttribute("data-nav")
  let overlay = navWrap.querySelector(".overlay")
  let menu = navWrap.querySelector(".menu")
  let bgPanels = navWrap.querySelectorAll(".bg-panel")
  let menuToggles = document.querySelectorAll("[data-menu-toggle]")
  let menuLinks = navWrap.querySelectorAll(".menu-link")
  let fadeTargets = navWrap.querySelectorAll("[data-menu-fade]")
  let menuButton = document.querySelector(".menu-button")
  let menuButtonTexts = menuButton.querySelectorAll("p")
  let menuButtonIcon = menuButton.querySelector(".menu-button-icon")

  let tl = gsap.timeline()

  const openNav = () => {
    navWrap.setAttribute("data-nav", "open")

    tl.clear()
      .set(navWrap, { display: "block" })
      .set(menu, { xPercent: 0 }, "<")
      .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
      .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
      .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
      .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 },
        "<+=0.35")
      .fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, {
        autoAlpha: 1,
        yPercent: 0,
        stagger: 0.04
      }, "<+=0.2")
  }

  const closeNav = () => {
    navWrap.setAttribute("data-nav", "closed")

    tl.clear()
      .to(overlay, { autoAlpha: 0 })
      .to(menu, { xPercent: 120 }, "<")
      .to(menuButtonTexts, { yPercent: 0 }, "<")
      .to(menuButtonIcon, { rotate: 0 }, "<")
      .set(navWrap, { display: "none" })
  }

  // Toggle menu open / close depending on its current state
  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      state = navWrap.getAttribute("data-nav");
      if (state === "open") {
        closeNav();
      } else {
        openNav();
      }
    });
  });

  // If menu is open, you can close it using the "escape" key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navWrap.getAttribute("data-nav") === "open") {
      closeNav();
    }
  });
}

initSideNavigationWipeEffect();

// Hero Flick Cards
// Hero Flick Cards
// Hero Flick Cards

gsap.registerPlugin(Draggable);

function initFlickCards() {
  const sliders = document.querySelectorAll('[data-flick-cards-init]');

  sliders.forEach(slider => {
    const list = slider.querySelector('[data-flick-cards-list]');
    const cards = Array.from(list.querySelectorAll('[data-flick-cards-item]'));
    const total = cards.length;
    let activeIndex = 0;

    const sliderWidth = slider.offsetWidth;
    const threshold = 0.1;

    // Generate draggers inside each card and store references
    const draggers = [];
    cards.forEach(card => {
      const dragger = document.createElement('div');
      dragger.setAttribute('data-flick-cards-dragger', '');
      card.appendChild(dragger);
      draggers.push(dragger);
    });

    // Set initial drag status
    slider.setAttribute('data-flick-drag-status', 'grab');

    function getConfig(i, currentIndex) {
      let diff = i - currentIndex;
      if (diff > total / 2) diff -= total;
      else if (diff < -total / 2) diff += total;

      switch (diff) {
      case 0:
        return { x: 0, y: 0, rot: 0, s: 1, o: 1, z: 5 };
      case 1:
        return { x: 25, y: 1, rot: 10, s: 0.9, o: 1, z: 4 };
      case -1:
        return { x: -25, y: 1, rot: -10, s: 0.9, o: 1, z: 4 };
      case 2:
        return { x: 45, y: 5, rot: 15, s: 0.8, o: 1, z: 3 };
      case -2:
        return { x: -45, y: 5, rot: -15, s: 0.8, o: 1, z: 3 };
      default:
        const dir = diff > 0 ? 1 : -1;
        return { x: 55 * dir, y: 5, rot: 20 * dir, s: 0.6, o: 0, z: 2 };
      }
    }

    function renderCards(currentIndex) {
      cards.forEach((card, i) => {
        const cfg = getConfig(i, currentIndex);
        let status;

        if (cfg.x === 0) status = 'active';
        else if (cfg.x === 25) status = '2-after';
        else if (cfg.x === -25) status = '2-before';
        else if (cfg.x === 45) status = '3-after';
        else if (cfg.x === -45) status = '3-before';
        else status = 'hidden';

        card.setAttribute('data-flick-cards-item-status', status);
        card.style.zIndex = cfg.z;

        gsap.to(card, {
          duration: 0.6,
          ease: 'elastic.out(1.2, 1)',
          xPercent: cfg.x,
          yPercent: cfg.y,
          rotation: cfg.rot,
          scale: cfg.s,
          opacity: cfg.o
        });
      });
    }

    renderCards(activeIndex);

    if (total < 7) {
      console.log('Not minimum of 7 cards');
      return;
    }

    let pressClientX = 0;
    let pressClientY = 0;

    Draggable.create(draggers, {
      type: 'x',
      edgeResistance: 0.8,
      bounds: { minX: -sliderWidth / 2, maxX: sliderWidth / 2 },
      inertia: false,

      onPress() {
        pressClientX = this.pointerEvent.clientX;
        pressClientY = this.pointerEvent.clientY;
        slider.setAttribute('data-flick-drag-status', 'grabbing');
      },

      onDrag() {
        const rawProgress = this.x / sliderWidth;
        const progress = Math.min(1, Math.abs(rawProgress));
        const direction = rawProgress > 0 ? -1 : 1;
        const nextIndex = (activeIndex + direction + total) % total;

        cards.forEach((card, i) => {
          const from = getConfig(i, activeIndex);
          const to = getConfig(i, nextIndex);
          const mix = prop => from[prop] + (to[prop] - from[prop]) * progress;

          gsap.set(card, {
            xPercent: mix('x'),
            yPercent: mix('y'),
            rotation: mix('rot'),
            scale: mix('s'),
            opacity: mix('o')
          });
        });
      },

      onRelease() {
        slider.setAttribute('data-flick-drag-status', 'grab');

        const releaseClientX = this.pointerEvent.clientX;
        const releaseClientY = this.pointerEvent.clientY;
        const dragDistance = Math.hypot(releaseClientX - pressClientX, releaseClientY -
          pressClientY);

        const raw = this.x / sliderWidth;
        let shift = 0;
        if (raw > threshold) shift = -1;
        else if (raw < -threshold) shift = 1;

        if (shift !== 0) {
          activeIndex = (activeIndex + shift + total) % total;
          renderCards(activeIndex);
        }

        gsap.to(this.target, {
          x: 0,
          duration: 0.3,
          ease: 'power1.out'
        });

        if (dragDistance < 4) {
          // Temporarily allow clicks to pass through
          this.target.style.pointerEvents = 'none';

          // Allow the DOM to register pointer-through
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const el = document.elementFromPoint(releaseClientX, releaseClientY);
              if (el) {
                const evt = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: true
                });
                el.dispatchEvent(evt);
              }

              // Restore pointer events
              this.target.style.pointerEvents = 'auto';
            });
          });
        }
      }
    });
  });
}

initFlickCards();

// Logo Wall
// Logo Wall
// Logo Wall
function initLogoWallCycle() {
  const loopDelay = 1.5; // Loop Duration
  const duration = 0.9; // Animation Duration

  document.querySelectorAll('[data-logo-wall-cycle-init]').forEach(root => {
    const list = root.querySelector('[data-logo-wall-list]');
    const items = Array.from(list.querySelectorAll('[data-logo-wall-item]'));

    const shuffleFront = root.getAttribute('data-logo-wall-shuffle') !== 'false';
    const originalTargets = items
      .map(item => item.querySelector('[data-logo-wall-target]'))
      .filter(Boolean);

    let visibleItems = [];
    let visibleCount = 0;
    let pool = [];
    let pattern = [];
    let patternIndex = 0;
    let tl;

    function isVisible(el) {
      return window.getComputedStyle(el).display !== 'none';
    }

    function shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function setup() {
      if (tl) {
        tl.kill();
      }
      visibleItems = items.filter(isVisible);
      visibleCount = visibleItems.length;

      pattern = shuffleArray(
        Array.from({ length: visibleCount }, (_, i) => i)
      );
      patternIndex = 0;

      // remove all injected targets
      items.forEach(item => {
        item.querySelectorAll('[data-logo-wall-target]').forEach(old => old.remove());
      });

      pool = originalTargets.map(n => n.cloneNode(true));

      let front, rest;
      if (shuffleFront) {
        const shuffledAll = shuffleArray(pool);
        front = shuffledAll.slice(0, visibleCount);
        rest = shuffleArray(shuffledAll.slice(visibleCount));
      } else {
        front = pool.slice(0, visibleCount);
        rest = shuffleArray(pool.slice(visibleCount));
      }
      pool = front.concat(rest);

      for (let i = 0; i < visibleCount; i++) {
        const parent =
          visibleItems[i].querySelector('[data-logo-wall-target-parent]') ||
          visibleItems[i];
        parent.appendChild(pool.shift());
      }

      tl = gsap.timeline({ repeat: -1, repeatDelay: loopDelay });
      tl.call(swapNext);
      tl.play();
    }

    function swapNext() {
      const nowCount = items.filter(isVisible).length;
      if (nowCount !== visibleCount) {
        setup();
        return;
      }
      if (!pool.length) return;

      const idx = pattern[patternIndex % visibleCount];
      patternIndex++;

      const container = visibleItems[idx];
      const parent =
        container.querySelector('[data-logo-wall-target-parent]') ||
        container.querySelector('*:has(> [data-logo-wall-target])') ||
        container;
      const existing = parent.querySelectorAll('[data-logo-wall-target]');
      if (existing.length > 1) return;

      const current = parent.querySelector('[data-logo-wall-target]');
      const incoming = pool.shift();

      gsap.set(incoming, { yPercent: 50, autoAlpha: 0 });
      parent.appendChild(incoming);

      if (current) {
        gsap.to(current, {
          yPercent: -50,
          autoAlpha: 0,
          duration,
          ease: "expo.inOut",
          onComplete: () => {
            current.remove();
            pool.push(current);
          }
        });
      }

      gsap.to(incoming, {
        yPercent: 0,
        autoAlpha: 1,
        duration,
        delay: 0.1,
        ease: "expo.inOut"
      });
    }

    setup();

    ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => tl.play(),
      onLeave: () => tl.pause(),
      onEnterBack: () => tl.play(),
      onLeaveBack: () => tl.pause()
    });

    document.addEventListener('visibilitychange', () =>
      document.hidden ? tl.pause() : tl.play()
    );
  });
}

initLogoWallCycle();

// Video Scale
// Video Scale
// Video Scale
gsap.registerPlugin(ScrollTrigger, Flip);

function initFlipOnScroll() {
  let wrapperElements = document.querySelectorAll("[data-flip-element='wrapper']");
  let targetEl = document.querySelector("[data-flip-element='target']");

  let tl;

  function flipTimeline() {
    if (tl) {
      tl.kill();
      gsap.set(targetEl, { clearProps: "all" });
    }

    // Use the first and last wrapper elements for the scroll trigger.
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperElements[0],
        start: "center center",
        endTrigger: wrapperElements[wrapperElements.length - 1],
        end: "center center",
        scrub: 0.25
      }
    });

    // Loop through each wrapper element.
    wrapperElements.forEach(function (element, index) {
      let nextIndex = index + 1;
      if (nextIndex < wrapperElements.length) {
        let nextWrapperEl = wrapperElements[nextIndex];
        // Calculate vertical center positions relative to the document.
        let nextRect = nextWrapperEl.getBoundingClientRect();
        let thisRect = element.getBoundingClientRect();
        let nextDistance = nextRect.top + window.pageYOffset + nextWrapperEl.offsetHeight / 2;
        let thisDistance = thisRect.top + window.pageYOffset + element.offsetHeight / 2;
        let offset = nextDistance - thisDistance;
        // Add the Flip.fit tween to the timeline.
        tl.add(
          Flip.fit(targetEl, nextWrapperEl, {
            duration: offset,
            ease: "none"
          })
        );
      }
    });
  }

  flipTimeline();

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      flipTimeline();
    }, 100);
  });
}

initFlipOnScroll();

// Image Preview Cursor
// Image Preview Cursor
// Image Preview Cursor

function initPreviewFollower() {
  // Find every follower wrap
  const wrappers = document.querySelectorAll('[data-follower-wrap]');

  wrappers.forEach(wrap => {
    const collection = wrap.querySelector('[data-follower-collection]');
    const items = wrap.querySelectorAll('[data-follower-item]');
    const follower = wrap.querySelector('[data-follower-cursor]');
    const followerInner = wrap.querySelector('[data-follower-cursor-inner]');

    let prevIndex = null;
    let firstEntry = true;

    const offset = 100; // The animation distance in %
    const duration = 0.5; // The animation duration of all visual transforms
    const ease = 'power2.inOut';

    // Initialize follower position
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    // Quick setters for x/y
    const xTo = gsap.quickTo(follower, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(follower, 'y', { duration: 0.6, ease: 'power3' });

    // Move all followers on mousemove
    window.addEventListener('mousemove', e => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Enter/leave per item within this wrap
    items.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        const forward = prevIndex === null || index > prevIndex;
        prevIndex = index;

        // animate out existing visuals
        follower.querySelectorAll('[data-follower-visual]').forEach(el => {
          gsap.killTweensOf(el);
          gsap.to(el, {
            yPercent: forward ? -offset : offset,
            duration,
            ease,
            overwrite: 'auto',
            onComplete: () => el.remove()
          });
        });

        // clone & insert new visual
        const visual = item.querySelector('[data-follower-visual]');
        if (!visual) return;
        const clone = visual.cloneNode(true);
        followerInner.appendChild(clone);

        // animate it in (unless it's the very first entry)
        if (!firstEntry) {
          gsap.fromTo(clone, { yPercent: forward ? offset : -offset }, {
            yPercent: 0,
            duration,
            ease,
            overwrite: 'auto'
          });
        } else {
          firstEntry = false;
        }
      });

      item.addEventListener('mouseleave', () => {
        const el = follower.querySelector('[data-follower-visual]');
        if (!el) return;
        gsap.killTweensOf(el);
        gsap.to(el, {
          yPercent: -offset,
          duration,
          ease,
          overwrite: 'auto',
          onComplete: () => el.remove()
        });
      });
    });

    // If pointer leaves the collection, clear any visuals
    collection.addEventListener('mouseleave', () => {
      follower.querySelectorAll('[data-follower-visual]').forEach(el => {
        gsap.killTweensOf(el);
        gsap.delayedCall(duration, () => el.remove());
      });
      firstEntry = true;
      prevIndex = null;
    });
  });
}

initPreviewFollower();

// Momentum Based Hover (Inertia)
// Momentum Based Hover (Inertia)
// Momentum Based Hover (Inertia)

gsap.registerPlugin(InertiaPlugin);

function initMomentumBasedHover() {

  // If this device can’t hover with a fine pointer, stop here
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) { return; }

  // Configuration (tweak these for feel)
  const xyMultiplier = 30; // multiplies pointer velocity for x/y movement
  const rotationMultiplier = 20; // multiplies normalized torque for rotation speed
  const inertiaResistance = 200; // higher = stops sooner

  // Pre-build clamp functions for performance
  const clampXY = gsap.utils.clamp(-1080, 1080);
  const clampRot = gsap.utils.clamp(-60, 60);

  // Initialize each root container
  document.querySelectorAll('[data-momentum-hover-init]').forEach(root => {
    let prevX = 0,
      prevY = 0;
    let velX = 0,
      velY = 0;
    let rafId = null;

    // Track pointer velocity (throttled to RAF)
    root.addEventListener('mousemove', e => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        velX = e.clientX - prevX;
        velY = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        rafId = null;
      });
    });

    // Attach hover inertia to each child element
    root.querySelectorAll('[data-momentum-hover-element]').forEach(el => {
      el.addEventListener('mouseenter', e => {
        const target = el.querySelector('[data-momentum-hover-target]');
        if (!target) return;

        // Compute offset from center to pointer
        const { left, top, width, height } = target.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const offsetX = e.clientX - centerX;
        const offsetY = e.clientY - centerY;

        // Compute raw torque (px²/frame)
        const rawTorque = offsetX * velY - offsetY * velX;

        // Normalize torque so rotation ∝ pointer speed (deg/sec)
        const leverDist = Math.hypot(offsetX, offsetY) || 1;
        const angularForce = rawTorque / leverDist;

        // Calculate and clamp velocities
        const velocityX = clampXY(velX * xyMultiplier);
        const velocityY = clampXY(velY * xyMultiplier);
        const rotationVelocity = clampRot(angularForce * rotationMultiplier);

        // Apply GSAP inertia tween
        gsap.to(target, {
          inertia: {
            x: { velocity: velocityX, end: 0 },
            y: { velocity: velocityY, end: 0 },
            rotation: { velocity: rotationVelocity, end: 0 },
            resistance: inertiaResistance
          }
        });
      });
    });
  });
}

initMomentumBasedHover();

// Footer Parallax Effect
// Footer Parallax Effect
// Footer Parallax Effect

gsap.registerPlugin(ScrollTrigger);

function initFooterParallax() {
  document.querySelectorAll('[data-footer-parallax]').forEach(el => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'clamp(top bottom)',
        end: 'clamp(top top)',
        scrub: true
      }
    });

    const inner = el.querySelector('[data-footer-parallax-inner]');
    const dark = el.querySelector('[data-footer-parallax-dark]');

    if (inner) {
      tl.from(inner, {
        yPercent: -25,
        ease: 'linear'
      });
    }

    if (dark) {
      tl.from(dark, {
        opacity: 0.5,
        ease: 'linear'
      }, '<');
    }
  });
}

initFooterParallax();
