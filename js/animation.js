import { createTimeline, scrambleText } from 'https://esm.sh/animejs';

// --- Splash Screen Logic ---
const initSplash = () => {
  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.innerHTML = `
    <div class="splash-content">
      <span class="splash-logo">C1 STINT</span>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    #splash-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0d0d0d;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: opacity 0.8s ease, visibility 0.8s;
    }
    .splash-content {
      text-align: center;
    }
    .splash-logo {
      font-family: 'Courier New', monospace;
      font-size: 24px;
      font-weight: 700;
      color: #00e5ff;
      letter-spacing: 8px;
      opacity: 0;
      transform: translateY(20px);
      animation: splashFadeIn 1.2s forwards ease-out;
      display: inline-block;
    }
    @keyframes splashFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .splash-hidden {
      opacity: 0;
      visibility: hidden;
    }
  `;
  
  document.head.appendChild(style);
  document.body.prepend(splash);
  
  // Scramble animation for the splash logo
  const logo = splash.querySelector('.splash-logo');
  const logoTl = createTimeline();
  logoTl.add(logo, {
    innerHTML: scrambleText({
      text: 'C1 STINT',
      duration: 1000,
      cursor: '░▒▓█',
    }),
  }, { delay: 300 });
  
  return splash;
};

// --- Scramble Animation Logic ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const tl = createTimeline();
      
      tl.add(target, {
        innerHTML: scrambleText({
          duration: 800,
          cursor: '░▒▓█',
        }),
      });

      observer.unobserve(target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const splash = initSplash();
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.classList.add('splash-hidden');
      
      // Target all common text elements, but avoid parents of .scramble to preserve <br>
      const textElements = document.querySelectorAll('h1, h2, p, li, .badge, .title, .desc, .scramble');
      textElements.forEach(el => {
        if (!el.closest('header') && !el.closest('footer')) {
          // Only observe if it doesn't contain other elements that are also being scrambled
          if (!el.querySelector('.scramble')) {
            observer.observe(el);
          } else {
            // If it contains .scramble elements, observe the children instead
            el.querySelectorAll('.scramble').forEach(child => observer.observe(child));
          }
        }
      });
    }, 1800); // Slightly longer to allow splash logo animation to complete
  });
});
