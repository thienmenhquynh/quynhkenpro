(() => {
  const stage = document.querySelector('[data-galaxy-orbit]');
  if (!stage) return;

  const products = stage.querySelector('.galaxy-products');
  const cards = [...products.querySelectorAll('.galaxy-card')];
  const toggle = stage.querySelector('.galaxy-motion');
  const ring = stage.querySelector('.galaxy-satellites');
  const satellites = [...ring.children];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const staticView = new URLSearchParams(location.search).has('static');
  const turn = 2 * Math.PI;
  const slope = -16 * Math.PI / 180;
  const cos = Math.cos(slope), sin = Math.sin(slope);
  let phase = -.58, radiusX = 0, radiusY = 0;
  let frame = 0, last = 0, visible = true, paused = false;
  let hovered, focused;

  function labels() {
    const english = document.documentElement.lang === 'en';
    products.setAttribute('aria-label', english ? 'Selected products' : 'Sản phẩm tiêu biểu');
    toggle.setAttribute('aria-label', english ? 'Pause orbit' : 'Tạm dừng quỹ đạo');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.title = paused
      ? english ? 'Resume orbit' : 'Tiếp tục quỹ đạo'
      : toggle.getAttribute('aria-label');
  }

  function paint() {
    satellites.forEach((satellite, index) => {
      const angle = phase + index * turn / satellites.length;
      const x = radiusX * Math.cos(angle);
      const y = radiusY * Math.sin(angle);
      const depth = (Math.sin(angle) + 1) / 2;
      satellite.style.opacity = String(.62 + .38 * depth);
      satellite.style.transform = `translate3d(calc(-50% + ${x * cos - y * sin}px), calc(-50% + ${x * sin + y * cos}px), 0) scale(${.70 + .30 * depth})`;
    });
  }

  function tick(now) {
    if (last) phase = (phase + Math.min(now - last, 60) * turn / 40000) % turn;
    last = now;
    paint();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    const canAnimate = !motion.matches && !staticView;
    toggle.hidden = !canAnimate;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    radiusX = ring.clientWidth * .42;
    radiusY = ring.clientHeight * .28;
    paint();
    if (canAnimate && !paused && !hovered && !focused && visible && !document.hidden) {
      frame = requestAnimationFrame(tick);
    }
  }

  function linkSatellite() {
    satellites.forEach((satellite, index) => satellite.classList.toggle('is-linked', cards[index] === (focused || hovered)));
    sync();
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    labels();
    sync();
  });

  function productAt(target) {
    return target instanceof Element ? target.closest('.galaxy-card') : null;
  }

  products.addEventListener('pointerover', event => {
    if (event.pointerType === 'touch') return;
    hovered = productAt(event.target);
    linkSatellite();
  });
  products.addEventListener('pointerout', event => {
    hovered = productAt(event.relatedTarget);
    linkSatellite();
  });
  products.addEventListener('focusin', event => {
    focused = productAt(event.target);
    linkSatellite();
  });
  products.addEventListener('focusout', event => {
    focused = productAt(event.relatedTarget);
    linkSatellite();
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
  new ResizeObserver(sync).observe(stage);
  labels();
  sync();
})();
