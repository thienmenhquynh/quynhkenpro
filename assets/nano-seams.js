(() => {
  const canvases = [...document.querySelectorAll('.nano-seam[data-nano-to]')];
  if (!canvases.length) return;

  // Each assembly becomes the starting material for the next section.
  const shapes = {
    orbit: [
      'M-22 0A22 15 0 1 0 22 0A22 15 0 1 0-22 0Z',
      'M-13 0A13 7 0 1 0 13 0A13 7 0 1 0-13 0Z',
      'M-28 0H-21M21 0H28'
    ],
    profile: [
      'M-22-13H22V13H-22ZM-22-6H22',
      'M-16-9h1m4 0h1m4 0h1',
      'M-15 7l4-3-4-3m9 7H7m-5-6h12'
    ],
    milestones: [
      'M-23 9H-9V2H5V-5H19V-12H26',
      'M-13 9a4 4 0 1 0-8 0a4 4 0 1 0 8 0ZM9-5a4 4 0 1 0-8 0a4 4 0 1 0 8 0Z',
      'M-23 14H25'
    ],
    chip: [
      'M-13-12H13V12H-13ZM-6-5H6V5H-6Z',
      'M-22-8h9m-9 8h9m-9 8h9m26-16h9m-9 8h9m-9 8h9',
      'M-8-19v7m8-7v7m8-7v7m-16 24v7m8-7v7m8-7v7'
    ],
    certificate: [
      'M-15-16H5L15-6V16H-15ZM5-16V-6H15',
      'M-8-5h6m-6 6h16m-16 6h7',
      'M6 9a3 3 0 1 0 6 0a3 3 0 1 0-6 0Z'
    ],
    signal: [
      'M-21 10L24-13L10 15L-1 5L-8 12L-8 2Z',
      'M-8 2L24-13L-1 5',
      'M-25 0l-7 4m12 11-6 4'
    ],
    facet: ['M-7 0L0-5L7 0L0 5ZM-7 0H7'],
    module: ['M-5-5H5V5H-5ZM0-8V-5M0 5V8M-8 0H-5M5 0H8']
  };
  const svgNS = 'http://www.w3.org/2000/svg';
  const geometry = Object.fromEntries(Object.entries(shapes).map(([name, parts]) => {
    const outline = new Path2D(parts.join(' '));
    const curves = parts.map(d => {
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d);
      return { path, length: path.getTotalLength() };
    });
    const length = curves.reduce((sum, curve) => sum + curve.length, 0);
    return [name, { outline, curves, length }];
  }));

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const still = new URLSearchParams(location.search).has('static');
  const scenes = [];
  let previous = 'orbit';
  let frame = 0;

  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (from, to, amount) => from + (to - from) * amount;
  const smooth = value => value * value * (3 - 2 * value);
  const seed = value => {
    const wave = Math.sin(value * 127.1 + .63) * 43758.5453;
    return wave - Math.floor(wave);
  };

  function pointsOn(name, count) {
    const { curves, length } = geometry[name];
    return Array.from({ length: count }, (_, index) => {
      let remaining = (index + .5) * length / count;
      for (const curve of curves) {
        if (remaining <= curve.length) return curve.path.getPointAtLength(remaining);
        remaining -= curve.length;
      }
      const last = curves.at(-1);
      return last.path.getPointAtLength(last.length);
    });
  }

  function makeCloud(side, from, to, count, phase) {
    const a = pointsOn(from, count);
    const b = pointsOn(to, count);
    const particles = a.map((point, index) => {
      const random = offset => seed(index + phase + offset);
      return {
        from: point,
        to: b[(index + Math.floor(count / 3)) % count],
        delay: random(7) * .24,
        drift: (random(31) - .5) * 2,
        drop: random(53),
        size: .85 + random(79) * 1.45,
        bright: random(97) > .62,
        prism: random(116) > .86
      };
    });
    return { side, from, to, particles };
  }

  for (const canvas of canvases) {
    const context = canvas.getContext('2d');
    const to = canvas.dataset.nanoTo;
    if (context) {
      const flipped = scenes.length % 2 === 1;
      const left = flipped ? 'module' : 'facet';
      const right = flipped ? 'facet' : 'module';
      scenes.push({
        canvas, context, flipped,
        opensHero: previous === 'orbit',
        clouds: [
          makeCloud(0, previous, to, 96, 0),
          makeCloud(-1, left, right, 18, 200),
          makeCloud(1, right, left, 22, 400)
        ]
      });
    }
    previous = to;
  }

  function drawOutline(context, name, x, y, size, alpha) {
    context.save();
    context.translate(x, y);
    context.scale(size, size);
    context.globalAlpha = alpha;
    context.stroke(geometry[name].outline);
    context.restore();
  }

  function draw(scene, progress) {
    const { context: ctx, width, height, ink, prism, metal, clouds } = scene;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = .85;

    const compact = height < 90;
    const scale = compact ? .75 : 1;
    const shift = Math.min(width * .11, 54) * (scene.flipped ? -1 : 1);
    const origin = scene.opensHero && !compact ? shift * 2.3 : shift;
    const offset = Math.min(width * .22, 103);
    const fromY = height * (compact ? .28 : .23);
    const toY = height * .73;
    const spread = Math.min(width * .24, 114);
    const sourceAlpha = (1 - smooth(clamp(progress / .22))) * .56;
    const targetAlpha = smooth(clamp((progress - .65) / .35)) * .70;

    for (const { side, from, to, particles } of clouds) {
      const size = (side ? 1.15 : 1.46) * scale;
      const startX = width / 2 + origin + side * offset * .48;
      const endX = width / 2 - shift + side * offset;
      const startY = fromY + side * height * .042;
      const endY = toY - side * height * .054;
      ctx.strokeStyle = side ? prism : ink;
      drawOutline(ctx, from, startX, startY, size, sourceAlpha);
      drawOutline(ctx, to, endX, endY, size, targetAlpha);

      for (const particle of particles) {
        const t = clamp((progress - particle.delay) / (1 - particle.delay - .035));
        const travel = smooth(t);
        const scatter = Math.sin(t * Math.PI);
        const x = mix(startX + particle.from.x * size, endX + particle.to.x * size, travel)
          + scatter * particle.drift * spread;
        const y = mix(startY + particle.from.y * size, endY + particle.to.y * size, travel)
          + scatter * (particle.drop - .28) * height * .38;
        const radius = particle.size * scale;
        ctx.fillStyle = particle.prism ? prism : particle.bright ? ink : metal;
        ctx.globalAlpha = (particle.bright || particle.prism ? .86 : .54) + scatter * .11;

        if (particle.bright && scatter > .18) {
          // Shards lengthen downwards only while in flight.
          ctx.fillRect(x - radius / 2, y - radius * scatter * 2.8, radius, radius * (1 + scatter * 2.8));
        } else {
          ctx.beginPath();
          ctx.arc(x, y, radius * .57, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  function resize(scene) {
    const { canvas, context } = scene;
    const bounds = canvas.getBoundingClientRect();
    const density = Math.min(window.devicePixelRatio || 1, 2);
    scene.width = bounds.width;
    scene.height = bounds.height;
    canvas.width = Math.round(bounds.width * density);
    canvas.height = Math.round(bounds.height * density);
    context.setTransform(density, 0, 0, density, 0, 0);
    scene.last = undefined;
  }

  function render() {
    frame = 0;
    const viewHeight = window.innerHeight;
    const staticMode = reduced.matches || still;
    for (const scene of scenes) {
      if (!scene.width || !scene.height) continue;
      const bounds = scene.canvas.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= viewHeight) continue;

      const center = bounds.top + bounds.height / 2;
      const progress = staticMode ? 1 : clamp((viewHeight * .93 - center) / (viewHeight * .39));
      if (scene.last === progress) continue;
      draw(scene, progress);
      scene.last = progress;
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function readTheme() {
    for (const scene of scenes) {
      const theme = getComputedStyle(scene.canvas);
      scene.ink = theme.getPropertyValue('--primary').trim();
      scene.prism = theme.getPropertyValue('--chart-3').trim();
      scene.metal = theme.getPropertyValue('--muted-foreground').trim();
      scene.last = undefined;
    }
    schedule();
  }

  const byCanvas = new Map(scenes.map(scene => [scene.canvas, scene]));
  const observer = new ResizeObserver(entries => {
    for (const { target } of entries) resize(byCanvas.get(target));
    schedule();
  });
  for (const scene of scenes) observer.observe(scene.canvas);

  new MutationObserver(readTheme).observe(document.documentElement, { attributeFilter: ['data-theme'] });
  window.addEventListener('scroll', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
  readTheme();
})();
