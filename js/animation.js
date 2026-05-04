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
  
  // Wait for content to be ready, then hide splash and start animations
  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.classList.add('splash-hidden');
      
      // Target all common text elements for scramble effect
      const textElements = document.querySelectorAll('h1, h2, p, li, .badge, .title, .desc, .scramble');
      textElements.forEach(el => {
        // Avoid scrambling the logo or navigation
        if (!el.closest('header') && !el.closest('footer')) {
          observer.observe(el);
        }
      });
    }, 1500); // Show splash for 1.5s
  });
});
