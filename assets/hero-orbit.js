(() => {
  const stage = document.querySelector('[data-galaxy-orbit]');
  if (!stage) return;

  const products = stage.querySelector('.galaxy-products');
  const cards = [...products.children];
  const toggle = stage.querySelector('.galaxy-motion');
  const core = stage.querySelector('.galaxy-core');
  const scene = stage.querySelector('.galaxy-scene');
  const portrait = stage.querySelector('.hero-portrait');
  const wide = matchMedia('(min-width:981px)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const staticView = new URLSearchParams(location.search).has('static');
  const turn = 2 * Math.PI;
  let angle = -1.06;
  let horizontal = 0, vertical = 0;
  let frame = 0, last = 0, visible = true;
  let hovered = false, focused = false, paused = false;

  function labels() {
    const english = document.documentElement.lang === 'en';
    products.setAttribute('aria-label', english ? 'Selected products' : 'Sản phẩm tiêu biểu');
    toggle.setAttribute('aria-label', english ? 'Pause product orbit' : 'Tạm dừng chuyển động sản phẩm');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.title = paused
      ? english ? 'Resume product orbit' : 'Tiếp tục chuyển động sản phẩm'
      : toggle.getAttribute('aria-label');
  }

  function paint() {
    cards.forEach((card, index) => {
      const phase = angle + index * turn / cards.length;
      const depth = (Math.sin(phase) + 1) / 2;
      const side = Math.cos(phase);
      const scale = .88 + depth * .12;
      const x = horizontal * side;
      const y = Math.sin(phase) * vertical;
      card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`;
      card.style.zIndex = String(Math.round(depth * 9));
      card.style.setProperty('--orbit-opacity', String(.86 + depth * .14));
    });
  }

  function tick(now) {
    if (last) angle = (angle + Math.min(now - last, 60) * turn / 46500) % turn;
    last = now;
    paint();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    const still = staticView || motion.matches || !wide.matches || stage.clientWidth < 540;
    stage.classList.toggle('is-orbit-ready', !still);
    toggle.hidden = still;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (still) {
      cards.forEach(card => {
        card.style.removeProperty('transform');
        card.style.removeProperty('z-index');
        card.style.removeProperty('--orbit-opacity');
      });
      return;
    }
    const pad = cards[0].offsetWidth / 2 + 12;
    const x = core.offsetLeft;
    horizontal = Math.min(x - portrait.offsetLeft - portrait.offsetWidth - pad, scene.clientWidth - x - pad);
    vertical = Math.min(core.offsetTop, scene.clientHeight - core.offsetTop) - cards[0].offsetHeight / 2 - 23;
    paint();
    if (!paused && !hovered && !focused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    labels();
    sync();
  });

  products.addEventListener('pointerover', event => {
    if (!hover.matches || event.pointerType === 'touch' || hovered || !event.target.closest('.galaxy-card')) return;
    hovered = true;
    sync();
  });

  products.addEventListener('pointerout', event => {
    if (!hovered || (event.relatedTarget instanceof Element && event.relatedTarget.closest('.galaxy-card'))) return;
    hovered = false;
    sync();
  });

  products.addEventListener('focusin', () => {
    focused = true;
    sync();
  });

  products.addEventListener('focusout', event => {
    if (products.contains(event.relatedTarget)) return;
    focused = false;
    sync();
  });

  hover.addEventListener('change', () => {
    hovered = false;
    sync();
  });
  motion.addEventListener('change', sync);
  wide.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('langchange', labels);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }).observe(stage);
  }
  new ResizeObserver(sync).observe(stage);
  labels();
  sync();
})();
