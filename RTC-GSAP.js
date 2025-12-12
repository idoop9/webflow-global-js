// Create smoother
ScrollSmoother.create({
  wrapper: document.querySelector("#smooth-wrapper"),
  content: document.querySelector("#smooth-content"),
  smooth: 1.3,
  effects: true,
  smoothTouch: 0.1
});

const splitConfig = {
  lines: { duration: 1.5, stagger: 0.15 },
  words: { duration: 1, stagger: 0.1 },
  chars: { duration: 0.4, stagger: 0.01 }
};

function TextScrollReveal() {
  document.querySelectorAll('[data-split="text"]').forEach(heading => {
    const type = heading.dataset.splitReveal || 'lines';
    const typesToSplit =
      type === 'lines' ? ['lines'] :
      type === 'words' ? ['lines', 'words'] : ['lines', 'words', 'chars'];

    SplitText.create(heading, {
      type: typesToSplit.join(', '),
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit(instance) {
        const targets = instance[type];
        const config = splitConfig[type];
        return gsap.from(targets, {
          yPercent: 60,
          autoAlpha: 0,
          duration: config.duration,
          stagger: config.stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            once: true,
            markers: false
          }
        });
      }
    });
  });
}

function HeadingScrollReveal() {
  document.querySelectorAll('[data-split="heading"]').forEach(heading => {
    const type = heading.dataset.splitReveal || 'words';
    const typesToSplit =
      type === 'lines' ? ['lines'] :
      type === 'words' ? ['lines', 'words'] : ['lines', 'words', 'chars'];

    SplitText.create(heading, {
      type: typesToSplit.join(', '),
      mask: 'words',
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit(instance) {
        const targets = instance[type];
        const config = splitConfig[type];
        return gsap.from(targets, {
          yPercent: 80,
          duration: config.duration,
          stagger: config.stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            once: true,
            markers: false
          }
        });
      }
    });
  });
}

HeadingScrollReveal();
TextScrollReveal();
