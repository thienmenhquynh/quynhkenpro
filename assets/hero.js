/* Decorative SVG only; no canvas, network requests or input listeners. */
(function () {
  'use strict';
  var sections = Array.from(document.querySelectorAll('.hero,.page-head,.cs-hero'));
  if (!sections.length) return;
  var paths = [
    'M520 100H770L834 164H1060L1124 100H1440',
    'M440 650H760L830 580H1180L1260 660H1440',
    'M860 0V120L924 184V324L994 394H1440',
    'M1140 0V232L1204 296H1440',
    'M1440 488H1280L1224 544H1030L966 608V780',
    'M680 780V710L744 646H860',
    'M1440 200H1320L1256 136H1160'
  ];
  var nodes = [[834,164],[1124,100],[830,580],[1180,580],[924,324],[1204,296],[1224,544],[744,646],[1256,136]];
  sections.forEach(function (section) {
    var layer = document.createElement('div');
    layer.className = 'hero-tech'; layer.setAttribute('aria-hidden','true');
    var wires = paths.map(function (path) { return '<path class="wire" d="' + path + '"/>'; }).join('');
    var pulses = [paths[0],paths[1]].map(function (path) { return '<path class="pulse" d="' + path + '"/>'; }).join('');
    var points = nodes.map(function (point,index) { return '<circle class="' + (index % 3 ? 'junction' : 'node') + '" cx="' + point[0] + '" cy="' + point[1] + '" r="' + (index % 3 ? 2 : 5) + '"/>'; }).join('');
    layer.innerHTML = '<span class="hero-brand-field"></span><svg class="hero-circuit" viewBox="0 0 1440 780" preserveAspectRatio="xMidYMid slice" focusable="false"><circle class="halo" cx="1124" cy="100" r="90"/><circle class="halo" cx="830" cy="580" r="110"/>' + wires + pulses + points + '</svg>';
    section.prepend(layer);
  });
  if (!('IntersectionObserver' in window)) return;
  var visible = new Set();
  function sync() { sections.forEach(function (section) { section.dataset.heroActive = String(visible.has(section) && !document.hidden); }); }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
    sync();
  });
  sections.forEach(function (section) { observer.observe(section); });
  document.addEventListener('visibilitychange',sync);
})();
