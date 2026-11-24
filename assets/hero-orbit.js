(() => {
  const stage = document.querySelector('[data-galaxy-orbit]');
  if (!stage) return;

  const products = stage.querySelector('.galaxy-products');
  const cards = [...products.children];
  const toggle = stage.querySelector('.galaxy-motion');
  const core = stage.querySelector('.galaxy-core');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const staticView = new URLSearchParams(location.search).has('static');
  const turn = 2 * Math.PI;
  let angle = -1.06;
  let horizontal = 0, vertical = 0, tilt = 0;
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
      const scale = .79 + depth * .21;
      const x = horizontal * side;
      const y = Math.sin(phase) * vertical + side * tilt;
      card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale}) rotate(${side * 5}deg)`;
      card.style.zIndex = depth < .31 ? '2' : String(4 + Math.round(depth * 9));
      card.style.setProperty('--orbit-opacity', String(.74 + depth * .26));
    });
  }

  function tick(now) {
    if (last) angle = (angle + Math.min(now - last, 60) * turn / 33000) % turn;
    last = now;
    paint();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    const still = staticView || motion.matches;
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
    paint();
    if (!paused && !hovered && !focused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const height = stage.clientHeight;
    horizontal = Math.max(0, stage.clientWidth - core.offsetLeft - cards[0].offsetWidth / 2 - 8);
    vertical = Math.max(0, Math.min(height * .28, core.offsetTop - cards[0].offsetHeight / 2 - 11));
    tilt = height * .035;
    sync();
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
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('langchange', labels);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }).observe(stage);
  }
  new ResizeObserver(resize).observe(stage);
  labels();
  resize();
})();
