(() => {
  const canvas = document.querySelector('.particle-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const main = canvas.parentElement;
  const sections = [...main.querySelectorAll(':scope > section')];
  const portrait = main.querySelector('.avatar-stage');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const staticPreview = new URLSearchParams(location.search).has('static');
  const tau = 2 * Math.PI;
  const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);

  // Seed positions once so each point retains its identity through every morph.
  let seed = 14561;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const rotateX = ([x, y, z], angle) => [
    x, y * Math.cos(angle) - z * Math.sin(angle), y * Math.sin(angle) + z * Math.cos(angle)
  ];
  const rotateZ = ([x, y, z], angle) => [
    x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle), z
  ];
  const rotateY = ([x, y, z], angle) => [
    x * Math.cos(angle) + z * Math.sin(angle), y, z * Math.cos(angle) - x * Math.sin(angle)
  ];

  function orb(u, v, w) {
    const angle = u * tau;
    const z = (2 * v - 1) * (w < .27 ? .37 : 1);
    const ring = Math.sqrt(1 - z * z);
    const wave = Math.sin(angle * 7 + z * 10) * .025;
    const radius = 1 + wave + (w - .5) * .055;
    return [Math.cos(angle) * ring * radius, Math.sin(angle) * ring * radius, z * radius];
  }

  function orbit(u, v, w) {
    const angle = u * tau;
    const cross = v * tau;
    const tube = .105 + .095 * w;
    const r = .89 + tube * Math.cos(cross);
    return rotateZ(rotateX([r * Math.cos(angle), r * Math.sin(angle), tube * Math.sin(cross)], .81), -.35);
  }

  function helix(u, v, w) {
    const angle = u * tau * 2.2;
    const strand = v < .5 ? -1 : 1;
    const radius = w > .26 ? strand * (.40 + .09 * w) : (v - .5) * .82;
    return rotateZ([u * 2.45 - 1.225, Math.sin(angle) * radius, Math.cos(angle) * radius], -.54);
  }

  function cube(u, v, w) {
    const face = Math.floor(u * 6);
    const axis = Math.floor(face / 2);
    const side = face % 2 ? .63 : -.63;
    const a = v * 1.26 - .63;
    const b = w > .42 ? (w > .71 ? .62 : -.62) : w * 3 - .63;
    const point = [a, b, side];
    if (axis === 0) point.push(point.shift());
    if (axis === 1) point.unshift(point.pop());
    return rotateZ(rotateX(rotateY(point, .62), .46), .17);
  }

  function diamond(u, v, w) {
    const facet = Math.floor(u * 4);
    const angle = facet * Math.PI / 2;
    const drop = 1 - Math.sqrt(v);
    const edge = lerp(.08, .92, w);
    const radius = .82 * (1 - drop);
    const x = radius * (Math.cos(angle) * edge + Math.cos(angle + Math.PI / 2) * (1 - edge));
    const z = radius * (Math.sin(angle) * edge + Math.sin(angle + Math.PI / 2) * (1 - edge));
    return rotateZ(rotateY([x, (u * 4 % 1 < .5 ? 1 : -1) * drop * 1.18, z], .35), -.18);
  }

  function infinity(u, v, w) {
    const angle = u * tau;
    const width = .75 + v * .28;
    return rotateZ([
      Math.cos(angle) * 1.26 * width,
      Math.sin(angle * 2) * .43 * width + (w - .5) * .14,
      Math.sin(angle) * .36 + (w - .5) * .13
    ], -.28);
  }

  const forms = [orb, orbit, helix, cube, diamond, infinity];
  const particles = Array.from({ length: 4740 }, () => {
    const u = random(), v = random(), w = random();
    const dust = random() < .22;
    const radius = 1.07 + Math.pow(w, 1.6) * 1.63;
    const dustPoint = [Math.cos(u * tau) * radius, Math.sin(u * tau) * radius * .73, v - .5];
    return {
      targets: dust ? forms.map(() => dustPoint) : forms.map(form => form(u, v, w)),
      dust, size: .48 + Math.pow(random(), 2.8) * 1.95,
      shade: random(), phase: random() * tau, offsetX: 0, offsetY: 0
    };
  });

  // The world layer sits between section backgrounds and their content.
  let palette, glowColors;
  let width = 0, height = 0, density = 1, count = 0, frame = 0;
  let sectionTops = [], portraitBox, mainBottom = 0, scrollLimit = 0;
  let pointer, scroll = window.scrollY, previousFrame = 0, elapsed = 0;
  let sceneIndex = 0, sceneChanged = true, lastPaint = 0;

  const driftDuration = 2.8;
  let driftStarted = 0;
  let driftAngle = Math.random() * tau;
  let driftFrom = { x: 0, y: 0 };
  let driftTo = nextDriftPoint();

  function nextDriftPoint() {
    driftAngle += 1.6 + Math.random() * 2.2;
    const radius = .72 + Math.random() * .28;
    return { x: Math.cos(driftAngle) * radius, y: Math.sin(driftAngle) * radius };
  }

  function drift() {
    if (elapsed - driftStarted >= driftDuration) {
      driftStarted += driftDuration;
      driftFrom = driftTo;
      driftTo = nextDriftPoint();
    }
    const t = ease((elapsed - driftStarted) / driftDuration);
    return { x: lerp(driftFrom.x, driftTo.x, t), y: lerp(driftFrom.y, driftTo.y, t) };
  }

  function measure() {
    const offset = window.scrollY;
    sectionTops = sections.map(section => section.getBoundingClientRect().top + offset);
    mainBottom = main.getBoundingClientRect().bottom + offset;
    scrollLimit = document.documentElement.scrollHeight - window.innerHeight;
    const box = portrait.getBoundingClientRect();
    portraitBox = { center: box.left + box.width / 2, top: box.top + offset, width: box.width, height: box.height };
    sceneChanged = true;
    schedule();
  }

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    density = Math.min(devicePixelRatio || 1, width < 680 ? 1.5 : 1.75);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    ctx.setTransform(density, 0, 0, density, 0, 0);
    count = width < 680 ? 2080 : width < 1080 ? 3250 : particles.length;
    const heroBounds = sections[0].getBoundingClientRect();
    if (heroBounds.height) measure();
  }

  function viewportScene(still) {
    let from = 0, to = 0, t = 0;
    for (let i = 1; i < sectionTops.length; i++) {
      const finish = Math.min(sectionTops[i] - height * .27, scrollLimit);
      const start = Math.min(sectionTops[i] - height * .89, finish - height * .35);
      if (scroll <= start) break;
      to = i;
      if (scroll < finish) {
        t = ease((scroll - start) / (finish - start));
        break;
      }
      from = to;
    }
    if (still) {
      from = to = t >= .5 ? to : from;
      t = 0;
    }
    return { from, to, t };
  }

  function pose(index, still) {
    const narrow = width < 981;
    if (!index) {
      return {
        x: narrow ? portraitBox.center + Math.min(width * .14, 54) : portraitBox.center + 62,
        y: clamp(portraitBox.top + portraitBox.height * .47 - (still ? 0 : scroll), height * .25, height * .67),
        size: narrow ? Math.min(width * .43, 236) : Math.min(width * .183, height * .33, 278)
      };
    }
    const left = narrow ? .30 : .235;
    const x = index % 2 === 1 ? left : 1 - left;
    const y = still ? height * .45 : clamp(sectionTops[index] - scroll + 58, height * .32, height * .77);
    return { x: width * x, y, size: narrow ? Math.min(width * .30, 184) : Math.min(width * .168, height * .29, 250) };
  }

  function paintAura(x, y, radius, alpha) {
    const halo = ctx.createRadialGradient(x, y, radius * .15, x, y, radius * 1.65);
    halo.addColorStop(0, glowColors.ambient);
    halo.addColorStop(.52, glowColors.ambientEdge);
    halo.addColorStop(1, 'transparent');
    ctx.globalAlpha = alpha;
    ctx.fillStyle = halo;
    ctx.fillRect(x - radius * 1.65, y - radius * 1.65, radius * 3.3, radius * 3.3);
  }

  function paintRim(x, y, radius, alpha) {
    const glow = ctx.createRadialGradient(x, y, radius * .82, x, y, radius * 1.08);
    glow.addColorStop(0, 'transparent');
    glow.addColorStop(.58, glowColors.rim);
    glow.addColorStop(.72, glowColors.rimEdge);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.globalAlpha = alpha;
    ctx.fillRect(x - radius * 1.08, y - radius * 1.08, radius * 2.16, radius * 2.16);
  }

  function render(still, { from, to, t }, step) {
    ctx.clearRect(0, 0, width, height);
    const start = pose(from, still), end = pose(to, still);
    const size = lerp(start.size, end.size, t);
    const morph = Math.sin(t * Math.PI);
    const offset = still ? { x: 0, y: 0 } : drift();
    const driftWidth = Math.min(width * .078, 86);
    const driftHeight = Math.min(height * .075, 66);
    const x = clamp(lerp(start.x, end.x, t) + offset.x * driftWidth, size * .74, width - size * .74);
    const y = clamp(lerp(start.y, end.y, t) + offset.y * driftHeight + morph * height * .08, size * .62, height - size * .62);
    const sway = Math.sin(elapsed * .28) * .16;
    const cos = Math.cos(sway), sin = Math.sin(sway);
    const fade = clamp((mainBottom - scroll) / (height * .67));
    const orbStrength = lerp(from === 0 ? 1 : 0, to === 0 ? 1 : 0, t);
    const opacity = fade * lerp(.70, .97, orbStrength);
    const bottom = Math.min(height, mainBottom - scroll);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, bottom);
    ctx.clip();
    paintAura(x, y, size, opacity);
    if (orbStrength > .01) paintRim(x, y, size, opacity * orbStrength);
    const hoverRadius = width < 980 ? 73 : 118;
    const cursor = !still && pointer;
    const smoothing = 1 - Math.exp(-step * 11);
    const displayScale = width < 680 ? .85 : 1;

    for (let i = 0; i < count; i++) {
      const point = particles[i];
      const a = point.targets[from], b = point.targets[to];
      const travel = ease(clamp(t + morph * (point.shade - .5) * .28));
      const px = lerp(a[0], b[0], travel) + morph * Math.cos(point.phase) * .27;
      const py = lerp(a[1], b[1], travel) + morph * Math.sin(point.phase) * .25;
      const pz = lerp(a[2], b[2], travel);
      const z = pz * cos - px * sin;
      const perspective = 1 + z * .10;
      const flutter = Math.sin(elapsed * (.65 + point.shade * .55) + point.phase);
      const homeX = x + ((px * cos + pz * sin) * perspective + flutter * .014) * size;
      const homeY = y + (py * perspective + flutter * .011) * size;
      let repelX = 0, repelY = 0, force = 0;
      if (cursor) {
        const dx = homeX - cursor.x, dy = homeY - cursor.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < hoverRadius * hoverRadius) {
          const distance = Math.sqrt(distanceSquared);
          force = (1 - distance / hoverRadius) ** 2;
          const impulse = (point.dust ? 125 : 87) * force;
          repelX = impulse * dx / Math.max(8, distance);
          repelY = impulse * dy / Math.max(8, distance);
        }
      }
      point.offsetX = still ? 0 : lerp(point.offsetX, repelX, smoothing);
      point.offsetY = still ? 0 : lerp(point.offsetY, repelY, smoothing);
      const drawX = homeX + point.offsetX, drawY = homeY + point.offsetY;
      if (drawX < -3 || drawX > width + 3 || drawY < -3 || drawY > bottom + 3) continue;

      const rim = 1 - clamp(Math.abs(z) * 1.38);
      const particleSize = point.size * displayScale * (perspective + force * .42);
      const strength = point.dust ? .22 : .48 + rim * orbStrength * .33;
      const brightness = clamp(strength * (.67 + .25 * flutter + .23 * perspective) + force * .5);
      ctx.globalAlpha = brightness * opacity;
      ctx.fillStyle = palette[point.dust ? 1 : Math.min(4, Math.floor((point.shade * .72 + (py + 1) * .12) * 5))];
      if (!point.dust && particleSize > 1.8) {
        // A broad soft pixel around the brightest grains keeps the rim luminous.
        ctx.globalAlpha *= .23;
        ctx.fillRect(drawX - particleSize, drawY - particleSize, particleSize * 2, particleSize * 2);
        ctx.globalAlpha = brightness * opacity;
      }
      ctx.fillRect(drawX - particleSize / 2, drawY - particleSize / 2, particleSize, particleSize);
    }
    ctx.restore();
  }

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    if (!width || !height || !portraitBox || scroll >= mainBottom) {
      if (width && height) ctx.clearRect(0, 0, width, height);
      previousFrame = 0;
      return;
    }

    const still = reduce.matches || staticPreview;
    const scene = viewportScene(still);
    const interval = width < 680 ? 33 : 22;
    if (sceneChanged || (!still && now - lastPaint >= interval) || scene.from !== sceneIndex) {
      const step = previousFrame ? clamp((now - previousFrame) / 1000, 0, .064) : 1 / 40;
      if (!still) elapsed += step;
      previousFrame = now;
      lastPaint = now;
      sceneIndex = scene.from;
      render(still, scene, step);
      sceneChanged = false;
    }
    if (!still) schedule();
  }

  function theme() {
    const style = getComputedStyle(main);
    const color = name => style.getPropertyValue(name).trim();
    palette = ['--primary', '--ring', '--chart-3', '--chart-4', '--chart-5'].map(color);
    glowColors = {
      ambient: color('--primary') + '24',
      ambientEdge: color('--ring') + '14',
      rim: color('--brand-cyan') + '24',
      rimEdge: color('--brand-lime') + '24'
    };
    sceneChanged = true;
    schedule();
  }

  main.classList.add('has-particle-field');
  resize();
  theme();
  new ResizeObserver(measure).observe(main);
  new MutationObserver(theme).observe(document.documentElement, { attributeFilter: ['data-theme'] });
  window.addEventListener('resize', resize, { passive:true });
  window.addEventListener('scroll', () => {
    scroll = window.scrollY;
    schedule();
  }, { passive:true });
  window.addEventListener('pointermove', event => {
    if (finePointer.matches && event.pointerType !== 'touch') {
      pointer = event.target instanceof Element && main.contains(event.target)
        ? { x: event.clientX, y: event.clientY } : null;
    }
  }, { passive:true });
  window.addEventListener('pointerout', event => {
    if (!event.relatedTarget) pointer = null;
  }, { passive:true });
  window.addEventListener('blur', () => { pointer = null; });
  const syncMotion = () => {
    pointer = null;
    previousFrame = 0;
    sceneChanged = true;
    schedule();
  };
  finePointer.addEventListener('change', syncMotion);
  reduce.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
})();
