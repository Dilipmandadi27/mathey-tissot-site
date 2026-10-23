
gsap.registerPlugin(ScrollTrigger);

// ---------- Lenis smooth scroll ----------
let lenis = null;
try {
  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    infinite: false,
    gestureOrientation: 'vertical',
    normalizeWheel: true,
    smoothWheel: true,
  });
} catch (e) {
  lenis = null;
}

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
}
gsap.ticker.lagSmoothing(0);

// ---------- 1. HERO ----------
const initHeroAnimations = () => {
  const video = document.querySelector('.bg-video');
  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');
  const cta = document.querySelector('.hero-cta-group');
  const nav = document.querySelector('.nav');
  const heroText = document.querySelector('.hero-text-bg');
  const details = document.querySelector('.hero-details');

  gsap.set(video, { scale: 1.7, opacity: 0 });
  gsap.set([title, subtitle, cta], { y: 40, opacity: 0 });
  gsap.set(nav, { y: -100, opacity: 0 });
  gsap.set(heroText, { scale: 0.5, opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to(video, { opacity: 1, scale: 1.35, duration: 2.5, ease: 'power2.out' })
    .to(heroText, { scale: 1, opacity: 1, duration: 2 }, '-=2')
    .to(title, { y: 0, opacity: 1, duration: 1.2 }, '-=1.5')
    .to(subtitle, { y: 0, opacity: 1, duration: 1.2 }, '-=0.9')
    .to(cta, { y: 0, opacity: 1, duration: 1.2 }, '-=0.9')
    .to(nav, { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, '-=1');

  // scroll-driven
  gsap.to(video, {
    scale: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to(details, {
    y: -150,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to(heroText, {
    y: -250,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
  });
};

// ---------- 2. PRODUCT REVEAL ----------
const initProductRevealAnimations = () => {
  const section = document.querySelector('.product-reveal');
  const watch = document.querySelector('.product-reveal-watch');
  const title = document.querySelector('.product-reveal-title');
  const subtitle = document.querySelector('.product-reveal-subtitle');
  const cta = document.querySelector('.product-reveal-cta-group');
  const details = document.querySelector('.product-reveal-details');
  const text = document.querySelector('.product-reveal-text-bg');

  gsap.set(watch, { opacity: 0, y: 50, rotation: -5 });
  gsap.set([title, subtitle, cta], { opacity: 0, y: 40 });

  const enterTl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' },
  });
  enterTl
    .to(watch, { opacity: 1, y: 0, rotation: 0, duration: 1.6, ease: 'power4.out' })
    .to(title, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=1.1')
    .to(subtitle, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.8')
    .to(cta, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.8');

  gsap.to(watch, {
    rotation: 20,
    scale: 1.3,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1.5 },
  });
  gsap.to(details, {
    y: -150,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to(text, {
    y: -250,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1.2 },
  });
};

// ---------- 3. COLLECTION (variant switcher) ----------
const initEthosAnimations = () => {
  const section = document.querySelector('.ethos');
  const bgImgs = gsap.utils.toArray('.ethos-bg-img');

  bgImgs.forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1, yPercent: 0 },
      {
        scale: 1.1,
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });

  const variants = {
    bl: document.querySelector('.ethos-main.variant-bl'),
    rs: document.querySelector('.ethos-main.variant-rs'),
  };
  const bgMap = {
    bl: document.querySelector('.ethos-bg-bl'),
    rs: document.querySelector('.ethos-bg-rs'),
  };

  let current = 'bl';
  let busy = false;

  // entrance for initially-active variant
  gsap.fromTo(
    variants.bl.querySelectorAll('.ethos-alt-title, .ethos-alt-subtitle, .ethos-description, .ethos-next-btn'),
    { opacity: 0, x: -60 },
    {
      opacity: 1, x: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' },
    }
  );
  gsap.fromTo(
    variants.bl.querySelector('.ethos-watch-img'),
    { opacity: 0, x: 150 },
    {
      opacity: 1, x: 0, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' },
    }
  );

  // scroll parallax on watch images
  document.querySelectorAll('.ethos-watch-img').forEach((img) => {
    gsap.to(img, {
      yPercent: -6,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  const switchTo = (target) => {
    if (busy || target === current) return;
    busy = true;
    const from = variants[current];
    const to = variants[target];
    const outEls = from.querySelectorAll('.ethos-text-side, .ethos-watch-img');
    const inEls = to.querySelectorAll('.ethos-text-side, .ethos-watch-img');

    const tl = gsap.timeline({ onComplete: () => { busy = false; } });
    tl.to(outEls, { opacity: 0, x: (i) => (i === 0 ? -100 : -150), duration: 0.6, ease: 'power2.in' })
      .add(() => {
        from.classList.remove('active');
        to.classList.add('active');
        bgMap[current].classList.remove('active');
        bgMap[target].classList.add('active');
      })
      .fromTo(
        inEls,
        { opacity: 0, x: (i) => (i === 0 ? 100 : 150) },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }
      );
    gsap.set(outEls, { clearProps: 'opacity,transform' });
    current = target;
  };

  document.querySelectorAll('.ethos-next-btn').forEach((btn) => {
    const go = () => switchTo(btn.dataset.target);
    btn.addEventListener('click', go);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
};

// ---------- 4. CRAFTSMANSHIP (canvas frame scrub) ----------
const initDismantleAnimations = () => {
  const FRAME_COUNT = 152;
  const canvas = document.getElementById('dismantle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const section = document.querySelector('.dismantle');
  const header = document.querySelector('.dismantle-header');

  const images = new Array(FRAME_COUNT);
  let loaded = 0;
  const pad = (n) => String(n).padStart(3, '0');

  // fractional interpolation between adjacent frames = smooth scrub
  const drawFrame = (pos) => {
    const i = Math.min(Math.floor(pos), FRAME_COUNT - 1);
    const j = Math.min(i + 1, FRAME_COUNT - 1);
    const frac = pos - i;
    const a = images[i], b = images[j];
    if (!a || !a.complete || !a.naturalWidth) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
    if (frac > 0.01 && b && b.complete && b.naturalWidth) {
      ctx.globalAlpha = frac;
      ctx.drawImage(b, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  };

  // rAF-throttled draws so scrub redraws never outpace vsync
  let rafId = null;
  let lastPos = -1;
  const scheduleDraw = (pos) => {
    lastPos = pos;
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      drawFrame(lastPos);
    });
  };

  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      loaded++;
      if (i === 0) drawFrame(0);
    };
    img.onerror = () => { loaded++; };
    img.src = `assets/photo/v3/ezgif-frame-${pad(i + 1)}.jpg`;
    images[i] = img;
  }

  const state = { frame: 0 };
  gsap.to(state, {
    frame: FRAME_COUNT - 1,
    ease: 'none',
    onUpdate: () => scheduleDraw(state.frame),
    scrollTrigger: {
      trigger: section,
      start: 'top 40%',
      end: 'bottom bottom',
      scrub: 1.2,
    },
  });

  gsap.to(header, {
    x: -150,
    opacity: 0,
    ease: 'power2.in',
    scrollTrigger: { trigger: section, start: 'top 45%', end: 'top 10%', scrub: 1 },
  });
};

// ---------- 5. NAV hide/show on scroll ----------
const initNavScroll = () => {
  const nav = document.querySelector('.nav');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 120) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastY = y;
  }, { passive: true });
};

// ---------- 6. MODAL + anchor smooth-scroll ----------
const initModal = () => {
  const modal = document.getElementById('reserve-modal');
  const closeBtn = document.getElementById('modal-close');
  const form = document.getElementById('reserve-form');

  const open = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  };
  const close = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lenis.start();
  };

  document.querySelectorAll('.open-reserve-modal').forEach((btn) => btn.addEventListener('click', open));
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      // Netlify captures the POST natively; keep default submission.
      e.stopPropagation();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initProductRevealAnimations();
  initEthosAnimations();
  initDismantleAnimations();
  initNavScroll();
  initModal();
});

window.addEventListener('error', () => {
  gsap.set('section, nav, .hero-content *', { clearProps: 'opacity,visibility' });
  document.querySelectorAll('.bg-video').forEach(v => { v.style.opacity = 1; });
});
