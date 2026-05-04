import { createTimeline, scrambleText } from 'https://esm.sh/animejs';

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      
      // Create a timeline for each element to allow precise control
      const tl = createTimeline();
      
      tl.add(target, {
        innerHTML: scrambleText({
          duration: 800,
          cursor: '░▒▓█',
        }),
      });

      // To avoid repeating the animation every time it scrolls back into view,
      // we unobserve the element.
      observer.unobserve(target);
    }
  });
}, observerOptions);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scramble').forEach(el => {
    observer.observe(el);
  });
});
