(() => {
  const canvas = document.querySelector('.galaxy-core-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const core = canvas.parentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const staticPreview = new URLSearchParams(location.search).has('static');
  const turn = Math.PI * 2;
  const tilt = -.27;
  const leanX = Math.cos(tilt), leanY = Math.sin(tilt);
  const minimumFrameGap = 1000 / 26;
  let width = 0, height = 0, frame = 0, elapsed = 0, previous = 0;
  let colors, visible = false, needsPaint = true, painted = false;

  let seed = 104891;
  const random = () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const bell = () => random() + random() + random() - 1.5;

  function makeStar() {
    const halo = random() < .13;
    const radius = halo ? Math.pow(random(), .53) * 1.12 : .045 + Math.pow(random(), .78) * .96;
    const arm = Math.floor(random() * 2);
    const angle = halo ? random() * turn : arm * Math.PI + radius * 5.5 + bell() * (.34 + radius * 1.28);
    const roll = random();
    return {
      radius, angle,
      lift: bell() * (halo ? .35 : .06),
      tone: roll < .13 ? 2 : roll > .67 ? 1 : 0,
      alpha: (.15 + Math.pow(random(), 1.85) * .69) * (halo ? .36 : 1 - radius * .51),
      size: .43 + Math.pow(random(), 3.7) * 1.49,
      phase: random() * turn
    };
  }

  const stars = Array.from({ length: 5100 }, makeStar);
  const nebulae = Array.from({ length: 46 }, (_, index) => {
    const radius = .16 + Math.floor(index / 2) * .034 + random() * .03;
    return {
      radius,
      angle: index % 2 * Math.PI + radius * 5.5 + bell() * .18,
      width: .059 + radius * .068,
      warm: index % 8 === 0
    };
  });

  function point(radius, angle, lift, size) {
    const across = Math.cos(angle) * radius;
    const along = Math.sin(angle) * radius;
    const up = along * .43 + lift * .9;
    const depth = along * .9 - lift * .43;
    const scale = size * (1 + depth * .17);
    return {
      x: width * .5 + (across * leanX - up * leanY) * scale,
      y: height * .51 + (across * leanY + up * leanX) * scale,
      depth
    };
  }

  function cloud(x, y, radius, flattened, color, opacity) {
    context.save();
    context.translate(x, y);
    context.rotate(tilt);
    context.scale(1, flattened);
    const glow = context.createRadialGradient(0, 0, 0, 0, 0, radius);
    glow.addColorStop(0, color);
    glow.addColorStop(1, 'transparent');
    context.globalAlpha = opacity;
    context.fillStyle = glow;
    context.fillRect(-radius, -radius, radius * 2, radius * 2);
    context.restore();
  }

  function paint(still) {
    context.clearRect(0, 0, width, height);
    const radius = Math.min(width * .437, height * .71);
    const time = still ? 0 : elapsed;
    const rotation = .86 + time * .085;
    const centerX = width * .5, centerY = height * .51;
    const dark = colors.dark;
    cloud(centerX, centerY, radius * .93, .51, colors.star, dark ? .16 : .10);
    cloud(centerX, centerY, radius * .48, .51, colors.warm, dark ? .16 : .11);
    nebulae.forEach(nebula => {
      const knot = point(nebula.radius, nebula.angle + rotation, 0, radius);
      const opacity = (dark ? .11 : .069) * (1 + knot.depth * .46);
      cloud(knot.x, knot.y, radius * nebula.width, .61, nebula.warm ? colors.warm : colors.star, opacity);
    });

    const count = width < 470 ? 3000 : width < 680 ? 3900 : stars.length;
    for (let i = 0; i < count; i++) {
      const star = stars[i];
      const drift = Math.sin(time * .21 + star.radius * 4) * .025;
      const { x, y, depth } = point(star.radius, star.angle + rotation + drift, star.lift, radius);
      const twinkle = .81 + Math.sin(star.phase + time * .85) * .19;
      const size = (star.size + depth * .19) * (width < 470 ? .81 : 1);
      if (size <= 0) continue;
      const opacity = Math.min(.92, star.alpha * twinkle * (1 + depth * .35));
      context.fillStyle = colors.particles[star.tone];
      if (star.size > 1.37) {
        context.globalAlpha = opacity * .16;
        context.fillRect(x - size, y - size, size * 2, size * 2);
      }
      context.globalAlpha = opacity;
      context.fillRect(x - size / 2, y - size / 2, size, size);
    }
    context.globalAlpha = 1;

    // The tight core lights up the inner disk without obscuring its arms.
    cloud(centerX, centerY, radius * .28, .58, colors.star, dark ? .46 : .27);
    cloud(centerX, centerY, radius * .145, .75, colors.deep, dark ? .38 : .19);
    cloud(centerX, centerY, radius * .092, .87, colors.ice, .9);
    cloud(centerX, centerY, radius * .043, .29, colors.ice, .94);
  }

  function schedule() {
    if (!frame && visible && !document.hidden && width && height) frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const still = staticPreview || reduce.matches;
    if (needsPaint || (!still && now - previous >= minimumFrameGap)) {
      if (!still && previous) elapsed += Math.min((now - previous) / 1000, .08);
      previous = now;
      paint(still);
      needsPaint = false;
      if (!painted) {
        painted = true;
        core.classList.add('has-galaxy-canvas');
      }
    }
    if (!still) schedule();
  }

  function resize() {
    width = core.clientWidth;
    height = core.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, width < 470 ? 1.4 : 1.6);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    needsPaint = true;
    schedule();
  }

  function readTheme() {
    const style = getComputedStyle(core);
    const token = name => style.getPropertyValue(name).trim();
    const star = token('--galaxy-star'), warm = token('--galaxy-warm'), deep = token('--galaxy-deep');
    colors = {
      star, warm, deep,
      ice: token('--brand-cyan-50'),
      dark: document.documentElement.dataset.theme === 'dark',
      particles: [star, deep, warm]
    };
    needsPaint = true;
    schedule();
  }

  function resume() {
    previous = 0;
    needsPaint = true;
    schedule();
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    resume();
  }, { rootMargin:'64px' }).observe(core);
  new ResizeObserver(resize).observe(core);
  new MutationObserver(readTheme).observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
  reduce.addEventListener('change', resume);
  document.addEventListener('visibilitychange', resume);
  readTheme();
  resize();
})();
