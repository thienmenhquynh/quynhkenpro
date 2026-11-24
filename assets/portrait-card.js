/* Collectible-card finish; existing portrait content remains the front face. */
(function () {
  'use strict';
  var hero = document.querySelector('.hero'), card = document.querySelector('.hero .runner-card');
  if (!hero || !card) return;
  var motion = matchMedia('(prefers-reduced-motion: reduce)');
  var isStatic = /[?&]static\b/.test(location.search);
  var rotor = document.createElement('div'), front = document.createElement('div'), back = document.createElement('div');
  rotor.className = 'portrait-rotor'; front.className = 'portrait-front'; back.className = 'portrait-back';
  back.setAttribute('aria-hidden', 'true');
  while (card.firstChild) front.appendChild(card.firstChild);
  back.innerHTML = '<div class="portrait-back-top"><span class="portrait-back-brand">QK</span><span class="portrait-back-bib"></span></div><div class="portrait-back-identity"><span class="portrait-back-number"></span><strong class="portrait-back-name"></strong><span class="portrait-back-role"></span></div><div class="portrait-back-stats"></div>';
  rotor.appendChild(front); rotor.appendChild(back);
  var hoverLayer = document.createElement('div'); hoverLayer.className = 'portrait-hover';
  hoverLayer.appendChild(rotor); card.appendChild(hoverLayer);
  card.classList.add('is-collectible');
  function syncContent() {
    back.querySelector('.portrait-back-bib').textContent = front.querySelector('.plate-bib small').textContent;
    back.querySelector('.portrait-back-number').textContent = Array.from(front.querySelector('.plate-bib').childNodes).filter(function (n) { return n.nodeType === 3; }).map(function (n) { return n.textContent.trim(); }).join('');
    back.querySelector('.portrait-back-name').textContent = front.querySelector('.plate .headline').textContent;
    back.querySelector('.portrait-back-role').textContent = front.querySelector('.role-type').dataset.fullRole || front.querySelector('.role-type').textContent;
    var stats = back.querySelector('.portrait-back-stats'); stats.replaceChildren();
    hero.querySelectorAll('.split').forEach(function (source) {
      var stat = document.createElement('div'), value = document.createElement('b'), label = document.createElement('span');
      value.textContent = source.querySelector('.num').textContent; label.textContent = source.querySelector('p').textContent;
      stat.appendChild(value); stat.appendChild(label); stats.appendChild(stat);
    });
  }
  syncContent(); document.addEventListener('langchange', syncContent);
  document.addEventListener('herorolechange', function (event) { back.querySelector('.portrait-back-role').textContent = event.detail.role; });
  var metrics = hero.querySelector('.splits');
  if (metrics) new MutationObserver(syncContent).observe(metrics, { subtree: true, childList: true, characterData: true });
  var visible = true, pointerFrame = 0, pointer = null;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  function resetHover() {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0; pointer = null;
    card.dataset.cardHover = 'false'; card.dataset.cardInspect = 'false';
    hoverLayer.style.setProperty('--tilt-x', '0deg'); hoverLayer.style.setProperty('--tilt-y', '0deg');
    hoverLayer.style.setProperty('--tilt-z', '0px');
  }
  function canHover(event) { return !motion.matches && !isStatic && finePointer.matches && event.pointerType !== 'touch'; }
  card.addEventListener('pointerenter', function (event) {
    if (!canHover(event)) return;
    card.dataset.cardHover = 'true';
    // Inspect a resting front without stopping a flip midway through its turn.
    var turn = rotor.getAnimations().find(function (a) { return a.animationName === 'portrait-turn'; });
    var time = turn ? Number(turn.currentTime) % 24000 : 0;
    card.dataset.cardInspect = String(time < 17520 || time >= 23040);
  });
  card.addEventListener('pointermove', function (event) {
    if (!canHover(event)) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(function () {
      pointerFrame = 0;
      if (!pointer) return;
      var box = card.getBoundingClientRect();
      var x = Math.max(-1, Math.min(1, (pointer.x - box.left) / box.width * 2 - 1));
      var y = Math.max(-1, Math.min(1, (pointer.y - box.top) / box.height * 2 - 1));
      hoverLayer.style.setProperty('--tilt-x', (-y * 7).toFixed(2) + 'deg');
      hoverLayer.style.setProperty('--tilt-y', (x * 9).toFixed(2) + 'deg');
      hoverLayer.style.setProperty('--tilt-z', '16px');
      card.style.setProperty('--foil-x', ((x + 1) * 50).toFixed(1) + '%');
    });
  });
  card.addEventListener('pointerleave', resetHover); card.addEventListener('pointercancel', resetHover);
  window.addEventListener('blur', resetHover); finePointer.addEventListener('change', resetHover);
  function syncMotion() {
    var active = visible && !document.hidden && !motion.matches && !isStatic;
    if (!active) resetHover();
    card.dataset.cardMotion = String(active);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; syncMotion(); }).observe(card);
  }
  motion.addEventListener('change', syncMotion); document.addEventListener('visibilitychange', syncMotion); syncMotion();
})();
