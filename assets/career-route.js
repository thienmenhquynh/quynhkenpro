(() => {
  const route = document.querySelector('.career-route');
  const main = route.parentElement;
  const hero = main.querySelector('.hero');
  const portraitTrack = hero.querySelector('.hero-track');
  const sections = [...main.querySelectorAll(':scope > section')].slice(1, -1);
  const finish = main.querySelector('.finish-line');
  const paths = [...route.querySelectorAll('path')];
  const progress = route.querySelector('.career-route-progress');
  const runner = route.querySelector('.career-route-runner');
  const checkpoints = route.querySelector('.career-route-checkpoints');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const staticPreview = new URLSearchParams(location.search).has('static');

  let length, top, lastY, samples, stops, turnEnd;
  let layoutDirty = true;
  let frame = 0;

  function measure() {
    const bounds = main.getBoundingClientRect();
    const heroEnd = hero.getBoundingClientRect().bottom - bounds.top;
    const track = portraitTrack.getBoundingClientRect();
    const firstWrap = sections[0].querySelector('.wrap');
    const wrap = firstWrap.getBoundingClientRect();
    const gutter = parseFloat(getComputedStyle(firstWrap).paddingLeft);
    const lane = wrap.left - bounds.left + gutter / 2;
    const wide = bounds.width > 980;
    const startX = wide ? track.left + track.width / 2 - bounds.left : bounds.width - lane;
    const startY = wide ? Math.min(track.top + track.height * .931 - bounds.top, heroEnd - 24) : heroEnd - 17;

    const finishBox = finish.getBoundingClientRect();
    const finishY = finishBox.top - bounds.top + finishBox.height / 2;
    const endX = Math.min(bounds.width - lane, lane + 210);
    // Use the gaps around the sections for both turns, leaving the text columns clear.
    const d = [
      `M ${startX} ${startY}`,
      `C ${startX} ${heroEnd + 10}, ${lane} ${heroEnd - 24}, ${lane} ${heroEnd + 32}`,
      `V ${finishY - 20}`,
      `Q ${lane} ${finishY + 1}, ${lane + 22} ${finishY + 1}`,
      `L ${endX} ${finishY + 2}`
    ].join(' ');
    paths.forEach(path => path.setAttribute('d', d));

    const points = sections.map(section => {
      const content = section.querySelector('.wrap').getBoundingClientRect();
      return { x: lane, y: content.top - bounds.top + 14 };
    });
    points.push({ x: endX, y: finishY + 2 });
    checkpoints.replaceChildren(...points.map(({ x, y }) => {
      const circle = document.createElementNS(route.namespaceURI, 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 3.5);
      return circle;
    }));

    length = progress.getTotalLength();
    progress.style.strokeDasharray = `${length} ${length}`;
    top = bounds.top + window.scrollY;
    lastY = finishY + 2;
    stops = points.map(point => point.y);
    // Sample once after layout so scrolling only needs a lookup and one SVG point.
    const count = Math.ceil(length / 8);
    samples = Array.from({ length: count + 1 }, (_, i) => progress.getPointAtLength(length * i / count).y);
    turnEnd = samples.findIndex(y => y >= heroEnd + 32);
    route.classList.add('is-ready');
  }

  function render() {
    frame = 0;
    if (layoutDirty) {
      measure();
      layoutDirty = false;
    }
    if (reduced.matches || staticPreview) {
      route.classList.add('is-static');
      route.classList.remove('is-finished');
      checkpoints.querySelectorAll('.is-passed').forEach(circle => circle.classList.remove('is-passed'));
      return;
    }
    route.classList.remove('is-static');

    // Give the two long sideways turns enough scroll distance to read as motion.
    const y = window.scrollY + window.innerHeight * .72 - top;
    const turnY = samples[turnEnd];
    const target = y > lastY - 32
      ? lastY - 32 + Math.min(1, (y - lastY + 32) / 132) * 32
      : y;
    let low = 0;
    let high = samples.length - 1;
    while (high - low > 1) {
      const mid = Math.floor((low + high) / 2);
      if (samples[mid] <= target) low = mid;
      else high = mid;
    }
    const fraction = Math.max(0, Math.min(1, (target - samples[low]) / Math.max(.001, samples[high] - samples[low])));
    let distance = length * (low + fraction) / (samples.length - 1);
    if (y < turnY) {
      const turnProgress = Math.max(0, Math.min(1, (y - turnY + 150) / 150));
      distance = length * turnEnd / (samples.length - 1) * turnProgress;
    }
    const point = progress.getPointAtLength(distance);
    progress.style.strokeDashoffset = length - distance;
    runner.setAttribute('cx', point.x);
    runner.setAttribute('cy', point.y);
    checkpoints.querySelectorAll('circle').forEach((circle, i) => {
      circle.classList.toggle('is-passed', point.y + .01 >= stops[i]);
    });
    route.classList.toggle('is-finished', target >= lastY);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  const observer = new ResizeObserver(() => {
    layoutDirty = true;
    schedule();
  });
  observer.observe(main);
  observer.observe(hero);
  sections.forEach(section => observer.observe(section));
  window.addEventListener('scroll', () => {
    if (!reduced.matches && !staticPreview) schedule();
  }, { passive: true });
  reduced.addEventListener('change', schedule);
  schedule();
})();
