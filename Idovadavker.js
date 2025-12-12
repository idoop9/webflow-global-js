//------------------------------------Lenis------------------------------------
//------------------------------------Lenis------------------------------------
//------------------------------------Lenis------------------------------------

const lenis = new Lenis({
  autoRaf: true
})

// start it
lenis.start()

//------------------------------------MGW017-hero-images------------------------------------
//------------------------------------MGW017-hero-images------------------------------------
//------------------------------------MGW017-hero-images------------------------------------

const medias = document.querySelectorAll('.mwg_effect017 .media')

// Arrays to store GSAP quickTo functions for rotation
const rotToX = []
const rotToY = []

// Initialize GSAP quickTo functions for smooth rotation animations
medias.forEach(el => {
  rotToX.push(gsap.quickTo(el, 'rotationX', { duration: 1, ease: "elastic" }))
  rotToY.push(gsap.quickTo(el, 'rotationY', { duration: 1, ease: "elastic" }))
})

const mousePos = { x: 0, y: 0 } // Object to track the mouse position
window.addEventListener("mousemove", e => {
  // Update mouse position
  mousePos.x = e.clientX
  mousePos.y = e.clientY

  medias.forEach((el, index) => { // Loop through each media element
    const bound = el
      .getBoundingClientRect() // Get the element's bounding box (position and size)

    // Calculate the midpoint of the element
    let midpointX = bound.left + bound.width / 2
    let midpointY = bound.top + bound.height / 2

    // Determine rotation values based on mouse position
    let rotX = (mousePos.y - midpointY) / 15 // Rotation around X-axis
    let rotY = (mousePos.x - midpointX) / 15 // Rotation around Y-axis

    // Apply clamped rotation values with smoothing
    rotToX[index](gsap.utils.clamp(-70, 70, rotX) * -1)
    rotToY[index](gsap.utils.clamp(-70, 70, rotY))
  })
})

//------------------------------------MGW041-hero-text------------------------------------
//------------------------------------MGW041-hero-text------------------------------------
//------------------------------------MGW041-hero-text------------------------------------

const items = document.querySelectorAll('.mwg_effect041 .item')

items.forEach(item => {
  wrapLettersInSpan(item.querySelector('.hidden'))
  wrapLettersInSpan(item.querySelector('.visible'))

  item.addEventListener('mouseover', (e) => {

    if (!gsap.isTweening(item.querySelectorAll('.visible span')) && item.classList
      .contains('hovered')) {
      item.classList.remove('hovered')
    }

    if (e.target.classList.contains('letter')) { // If a letter is hovered
      // Mark the item as hovered
      item.classList.add('hovered')
      // Get the index of the first hovered letter
      const indexHover = getChildIndex(e.target)

      gsap.to(item.querySelectorAll('.visible span'), {
        yPercent: 100, // Moves each element vertically by 100% of its height
        ease: 'back.out(2)', // Slight bounce at the end of the movement
        duration: 0.6, // Total animation duration for each element
        stagger: {
          each: 0.023, // Delay between the start of each element's animation
          from: indexHover // Sets the starting point for the stagger
        }
      })
      gsap.to(item.querySelectorAll('.hidden span'), {
        yPercent: 100, // Moves each element vertically by 100% of its height
        ease: 'back.out(2)', // Slight bounce at the end of the movement
        duration: 0.6, // Total animation duration for each element
        stagger: {
          each: 0.023, // Delay between the start of each element's animation
          from: indexHover // Sets the starting point for the stagger
        },
        onComplete: () => {
          // Reset items
          gsap.set(item.querySelectorAll(
            '.visible span'), { clearProps: 'all' })
          gsap.set(item.querySelectorAll('.hidden span'), { clearProps: 'all' })
        }
      })
    }
  })
})

// UTIL METHODS
/*
function wrapLettersInSpan(element) {
  const text = element.textContent;
  element.innerHTML = text
    .split('')
    .map(char => char === ' ' ? '<span> </span>' : `<span class="letter">${char}</span>`)
    .join('');
}
*/

function wrapLettersInSpan(element) {
  const text = element.textContent;

  element.innerHTML = text
    .split('')
    .map(char => {
      const safeChar = char === ' ' ? '&nbsp;' : char;
      return `<span class="letter">${safeChar}</span>`;
    })
    .join('');
}

// Returns the index of the element relative to all its siblings
function getChildIndex(child) {
  return Array.from(child.parentNode.children).indexOf(child);
}

//------------------------------------MGW041-testimonial Cards------------------------------------
//------------------------------------MGW041-testimonial Cards------------------------------------
//------------------------------------MGW041-testimonial Cards------------------------------------

const container = document.querySelector('.mwg_effect025 .container')
const containerW = container.clientWidth

const cards = document.querySelectorAll('.card')
const cardsLength = cards.length

const cardContent = document.querySelectorAll('.card .content')

let currentPortion = 0 // No portion hovered at the start

cards.forEach(card => {
  gsap.set(card, {
    xPercent: (Math.random() - 0.5) * 10,
    yPercent: (Math.random() - 0.5) * 10,
    rotation: (Math.random() - 0.5) * 20,
  })
})

container.addEventListener("mousemove", e => {
  // Cursor position relative to the left edge of the container
  const mouseX = e.clientX - container.getBoundingClientRect().left
  // Cursor’s horizontal percentage within the container
  const percentage = mouseX / containerW
  // Round the value up to get a valid index
  const activePortion = Math.ceil(percentage * cardsLength)

  // If a new portion is hovered
  if (
    currentPortion !== activePortion &&
    activePortion > 0 &&
    activePortion <= cardsLength
  ) {
    // If a portion was already hovered, reset it
    // -1 to target the correct index in the card set
    if (currentPortion !== 0) { resetPortion(currentPortion - 1) }

    // Update the index of the new portion
    currentPortion = activePortion
    // -1 to target the correct index in the card set
    newPortion(currentPortion - 1)
  }
})

container.addEventListener("mouseleave", () => {
  // -1 to target the correct index in the card set
  resetPortion(currentPortion - 1)
  // No portion is hovered anymore
  currentPortion = 0

  // Recenter all direct child elements of the cards
  gsap.to(cardContent, {
    xPercent: 0,
    ease: 'elastic.out(1, 0.75)',
    duration: 0.8
  })
})

function resetPortion(index) {
  // Last active card
  gsap.to(cards[index], {
    xPercent: (Math.random() - 0.5) * 10,
    yPercent: (Math.random() - 0.5) * 10,
    rotation: (Math.random() - 0.5) * 20,
    scale: 1,
    duration: 0.8,
    ease: 'elastic.out(1, 0.75)',
  })
}

function newPortion(i) {
  gsap.to(cards[i], {
    // Reset transformation attributes
    xPercent: 0,
    yPercent: 0,
    rotation: 0,
    duration: 0.8,
    scale: 1.1,
    ease: 'elastic.out(1, 0.75)' // Elastic movement at the end (out)
  })

  // For each card's child element
  cardContent.forEach((cardContent, index) => {
    // If it's not the active card
    if (index !== i) {
      gsap.to(cardContent, {
        // When index - i < 0, push left
        // When index - i > 0, push right
        // The further (index - i) moves from 0 in both ways, the smaller the displacement
        xPercent: 80 / (index - i),
        ease: 'elastic.out(1, 0.75)',
        duration: 0.8
      })
      // If it is the active card
    } else {
      // Center its child
      gsap.to(cardContent, {
        xPercent: 0,
        ease: 'elastic.out(1, 0.75)',
        duration: 0.8
      })
    }
  })
}

/*
let mm = gsap.matchMedia()

mm.add("(min-width: 770px)", () => {
  const container = document.querySelector('.mwg_effect025 .container')
  if (!container) return

  const containerW = container.clientWidth

  const cards = document.querySelectorAll('.card')
  const cardsLength = cards.length

  const cardContent = document.querySelectorAll('.card .content')

  let currentPortion = 0 // No portion hovered at the start

  cards.forEach(card => {
    gsap.set(card, {
      xPercent: (Math.random() - 0.5) * 10,
      yPercent: (Math.random() - 0.5) * 10,
      rotation: (Math.random() - 0.5) * 20,
    })
  })

  function resetPortion(index) {
    // Last active card
    gsap.to(cards[index], {
      xPercent: (Math.random() - 0.5) * 10,
      yPercent: (Math.random() - 0.5) * 10,
      rotation: (Math.random() - 0.5) * 20,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.75)',
    })
  }

  function newPortion(i) {
    gsap.to(cards[i], {
      // Reset transformation attributes
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      duration: 0.8,
      scale: 1.1,
      ease: 'elastic.out(1, 0.75)' // Elastic movement at the end (out)
    })

    // For each card's child element
    cardContent.forEach((cardContent, index) => {
      // If it's not the active card
      if (index !== i) {
        gsap.to(cardContent, {
          // When index - i < 0, push left
          // When index - i > 0, push right
          // The further (index - i) moves from 0 in both ways, the smaller the displacement
          xPercent: 80 / (index - i),
          ease: 'elastic.out(1, 0.75)',
          duration: 0.8
        })
        // If it is the active card
      } else {
        // Center its child
        gsap.to(cardContent, {
          xPercent: 0,
          ease: 'elastic.out(1, 0.75)',
          duration: 0.8
        })
      }
    })
  }

  const onMouseMove = e => {
    // Cursor position relative to the left edge of the container
    const mouseX = e.clientX - container.getBoundingClientRect().left
    // Cursor’s horizontal percentage within the container
    const percentage = mouseX / containerW
    // Round the value up to get a valid index
    const activePortion = Math.ceil(percentage * cardsLength)

    // If a new portion is hovered
    if (
      currentPortion !== activePortion &&
      activePortion > 0 &&
      activePortion <= cardsLength
    ) {
      // If a portion was already hovered, reset it
      // -1 to target the correct index in the card set
      if (currentPortion !== 0) { resetPortion(currentPortion - 1) }

      // Update the index of the new portion
      currentPortion = activePortion
      // -1 to target the correct index in the card set
      newPortion(currentPortion - 1)
    }
  }

  const onMouseLeave = () => {
    // -1 to target the correct index in the card set
    resetPortion(currentPortion - 1)
    // No portion is hovered anymore
    currentPortion = 0

    // Recenter all direct child elements of the cards
    gsap.to(cardContent, {
      xPercent: 0,
      ease: 'elastic.out(1, 0.75)',
      duration: 0.8
    })
  }

  container.addEventListener("mousemove", onMouseMove)
  container.addEventListener("mouseleave", onMouseLeave)

  // Cleanup when viewport goes below 770px
  return () => {
    container.removeEventListener("mousemove", onMouseMove)
    container.removeEventListener("mouseleave", onMouseLeave)
  }
})
*/
//------------------------------------MGW041-Nav (One Page Progress Navigation)------------------------------------
//------------------------------------MGW041-Nav (One Page Progress Navigation)------------------------------------
//------------------------------------MGW041-Nav (One Page Progress Navigation)------------------------------------

function initProgressNavigation() {
  // Cache the parent container
  let navProgress = document.querySelector('[data-progress-nav-list]');

  // Create or select the moving indicator
  let indicator = navProgress.querySelector('.progress-nav__indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'progress-nav__indicator';
    navProgress.appendChild(indicator);
  }

  // Function to update the indicator based on the active nav link
  function updateIndicator(activeLink) {
    let parentWidth = navProgress.offsetWidth;
    let parentHeight = navProgress.offsetHeight;

    // Get the active link's position relative to the parent
    let parentRect = navProgress.getBoundingClientRect();
    let linkRect = activeLink.getBoundingClientRect();
    let linkPos = {
      left: linkRect.left - parentRect.left,
      top: linkRect.top - parentRect.top
    };

    let linkWidth = activeLink.offsetWidth;
    let linkHeight = activeLink.offsetHeight;

    // Calculate percentage values relative to parent dimensions
    let leftPercent = (linkPos.left / parentWidth) * 100;
    let topPercent = (linkPos.top / parentHeight) * 100;
    let widthPercent = (linkWidth / parentWidth) * 100;
    let heightPercent = (linkHeight / parentHeight) * 100;

    // Update the indicator with a smooth CSS transition (set in your CSS)
    indicator.style.left = leftPercent + '%';
    indicator.style.top = topPercent + '%';
    indicator.style.width = widthPercent + '%';
    indicator.style.height = heightPercent + '%';
  }

  // Get all anchor sections
  let progressAnchors = gsap.utils.toArray('[data-progress-nav-anchor]');

  progressAnchors.forEach((progressAnchor) => {
    let anchorID = progressAnchor.getAttribute('id');

    ScrollTrigger.create({
      trigger: progressAnchor,
      start: '0% 50%',
      end: '100% 50%',
      onEnter: () => {
        let activeLink = navProgress.querySelector('[data-progress-nav-target="#' +
          anchorID + '"]');
        activeLink.classList.add('is--active');
        // Remove 'is--active' class from sibling links
        let siblings = navProgress.querySelectorAll('[data-progress-nav-target]');
        siblings.forEach((sib) => {
          if (sib !== activeLink) {
            sib.classList.remove('is--active');
          }
        });
        updateIndicator(activeLink);
      },
      onEnterBack: () => {
        let activeLink = navProgress.querySelector('[data-progress-nav-target="#' +
          anchorID + '"]');
        activeLink.classList.add('is--active');
        // Remove 'is--active' class from sibling links
        let siblings = navProgress.querySelectorAll('[data-progress-nav-target]');
        siblings.forEach((sib) => {
          if (sib !== activeLink) {
            sib.classList.remove('is--active');
          }
        });
        updateIndicator(activeLink);
      }
    });
  });
}

// Initialize 
initProgressNavigation();

gsap.registerPlugin(ScrollTrigger)

const root = document.querySelector('.mwg_effect022')
const pinHeight = root.querySelector('.pin-height')
const containert = document.querySelector('.mwg_effect022 .container')
const paragraphs = root.querySelectorAll('.paragraph')

paragraphs.forEach(paragraph => {
  wrapWordsInSpan(paragraph)
})

ScrollTrigger.create({
  trigger: pinHeight, // Listens to pin-height
  start: 'top top',
  end: 'bottom bottom',
  pin: containert // The pinned section
})

const tl = gsap.timeline({
  scrollTrigger: { // All tweens of my timeline will have the same scrollTrigger properties
    trigger: pinHeight,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true // Progresses with the scroll
  }
})

paragraphs.forEach((paragraph, index) => {
  if (paragraphs[index + 1]) { // Check if there is a next paragraph
    tl.to(paragraphs[index].querySelectorAll('.word span'), {
      y: '100%', // Disappearance of words from paragraphs[index]
      duration: 1,
      stagger: 0.2,
      ease: 'power4.in',
    }) // Both tweens will play at the same time
    tl.to(paragraphs[index + 1].querySelectorAll('.word span'), {
      y: '0%', // Appearance of words from paragraphs[index+1]
      duration: 1,
      delay: 1,
      stagger: 0.2,
      ease: 'power4.out',
    }, '<') // This means the animation starts at the beginning of the previous tween
  }
})

// UTIL METHOD
function wrapWordsInSpan(element) {
  const text = element.textContent;
  element.innerHTML = text
    .split(' ')
    .map(word => `<span class="word"><span>${word}</span></span>`)
    .join(' ');
}

//------------------------------------Process--MWG031 Scrolling sections Cards------------------------------------
//------------------------------------Process--MWG031 Scrolling sections Cards------------------------------------
//------------------------------------Process--MWG031 Scrolling sections Cards------------------------------------

gsap.to('.scroll', {
  autoAlpha: 0,
  duration: 0.2,
  scrollTrigger: {
    trigger: '.mwg_effect031',
    start: 'top top',
    end: 'top top-=1',
    toggleActions: "play none reverse none"
  }
})

const slides = document.querySelectorAll('.mwg_effect031 .slide')

slides.forEach(slide => {
  const contentWrapper = slide.querySelector('.content-wrapper')
  const content = slide.querySelector('.content31')

  gsap.to(content, {
    rotationZ: (Math.random() - 0.5) * 10, // RotationZ between -5 and 5 degrees
    scale: 0.7, // Slight reduction of the content
    rotationX: 40,
    ease: 'power1.in', // Starts gradually
    scrollTrigger: {
      pin: contentWrapper, // contentWrapper is pinned during the animation
      trigger: slide, // Listens to the slide’s position
      start: 'top 0%', // Starts when its top reaches the top of the viewport
      end: '+=' + window.innerHeight, // Ends 100vh later
      scrub: true // Progresses with the scroll
    }
  })

  gsap.to(content, {
    autoAlpha: 0, // Ends at opacity: 0 and visibility: hidden
    ease: 'power1.in', // Starts gradually
    scrollTrigger: {
      trigger: content, // Listens to the position of content
      start: 'top -80%', // Starts when the top exceeds 80% of the viewport
      end: '+=' + 0.2 * window.innerHeight, // Ends 20% later
      scrub: true // Progresses with the scroll
    }
  })
})

//------------------------------------Footer------------------------------------
//------------------------------------Footer------------------------------------
//------------------------------------Footer------------------------------------

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

//------------------------------------CSS Marquee------------------------------------
//------------------------------------CSS Marquee------------------------------------
//------------------------------------CSS Marquee------------------------------------

// Note: The Javascript is optional. Read the documentation below how to use the CSS Only version.

function initCSSMarquee() {
  const pixelsPerSecond = 75; // Set the marquee speed (pixels per second)
  const marquees = document.querySelectorAll('[data-css-marquee]');

  // Duplicate each [data-css-marquee-list] element inside its container
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });
  });

  // Create an IntersectionObserver to check if the marquee container is in view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.querySelectorAll('[data-css-marquee-list]').forEach(list =>
        list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
      );
    });
  }, { threshold: 0 });

  // Calculate the width and set the animation duration accordingly
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      list.style.animationDuration = (list.offsetWidth / pixelsPerSecond) + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}

// Initialize CSS Marquee
initCSSMarquee();

//------------------------------------CSS Marquee------------------------------------
//------------------------------------CSS Marquee------------------------------------
//------------------------------------CSS Marquee------------------------------------

const root18 = document.querySelector('.mwg_effect018')
const pinHeight18 = root18.querySelector('.pin-height18')
const container18 = root18.querySelector('.container18')
const cards18 = root18.querySelectorAll('.card18')

gsap.to('.scroll', {
  autoAlpha: 0,
  duration: 0.2,
  scrollTrigger: {
    trigger: root18,
    start: 'top top',
    end: 'top top-=1',
    toggleActions: "play none reverse none"
  }
})

ScrollTrigger.create({
  trigger: pinHeight18, // We listen to pinHeight position
  start: 'top top',
  end: 'bottom bottom',
  pin: container18, // We pin our container
  pinSpacing: false, // No extra space is added around the pinned element
  scrub: true // Progresses with the scroll
})

gsap.set(cards18, {
  yPercent: 50, // Translate by half the element’s height
  y: 0.5 * window.innerHeight, // Translate by half the screen’s height
})

const tl18 = gsap.timeline({
  scrollTrigger: {
    trigger: root18, // Based on the root of our component
    start: 'top top', // Starts when the top of root reaches the top of the viewport
    end: 'bottom bottom', // Ends when the bottom of root reaches the bottom of the viewport
    scrub: true, // Progresses with the scroll
  }
})

tl18.to(cards18, {
  yPercent: -50, // Translate by half the element’s height
  y: -0.5 * window.innerHeight, // Translate by half the screen’s height
  duration: 1,
  stagger: 0.12,
  ease: CustomEase.create("custom", "M0,0 C0,0 0.098,0.613 0.5,0.5 0.899,0.386 1,1 1,1 "),
}, 'step') // The other 'step' tweens will start simultaneously in our timeline
tl18.to(cards18, {
  rotation: () => {
    return (Math.random() - 0.5) *
      20
  }, // Method to have a unique value per card
  stagger: 0.12,
  duration: 0.5, // Lasts half as long as the movement tween
  ease: 'power3.out', // Slows down towards the end of the rotation
}, 'step')
tl18.to(cards18, {
  rotation: 0,
  stagger: 0.12,
  duration: 0.5, // Lasts half as long as the movement tween
  ease: 'power3.in', // Slows down at the beginning of the rotation
}, 'step+=0.5') // Starts halfway through the movement tween

///------------------------------------change page title on leave------------------------------------
///------------------------------------change page title on leave------------------------------------
///------------------------------------change page title on leave------------------------------------

const documentTitleStore = document.title;
const documentTitleOnBlur = "Time for a redesign."; // Define your custom title here

// Set original title if user is on the site
window.addEventListener("focus", () => {
  document.title = documentTitleStore;
});

// If user leaves tab, set the alternative title
window.addEventListener("blur", () => {
  document.title = documentTitleOnBlur;
});
