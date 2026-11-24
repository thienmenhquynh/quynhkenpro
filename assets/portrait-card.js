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
  rotor.appendChild(front); rotor.appendChild(back); card.appendChild(rotor);
  card.classList.add('is-collectible');
  function syncContent() {
    back.querySelector('.portrait-back-bib').textContent = front.querySelector('.plate-bib small').textContent;
    back.querySelector('.portrait-back-number').textContent = Array.from(front.querySelector('.plate-bib').childNodes).filter(function (n) { return n.nodeType === 3; }).map(function (n) { return n.textContent.trim(); }).join('');
    back.querySelector('.portrait-back-name').textContent = front.querySelector('.plate .headline').textContent;
    back.querySelector('.portrait-back-role').textContent = front.querySelector('.role-type').textContent;
    var stats = back.querySelector('.portrait-back-stats'); stats.replaceChildren();
    hero.querySelectorAll('.split').forEach(function (source) {
      var stat = document.createElement('div'), value = document.createElement('b'), label = document.createElement('span');
      value.textContent = source.querySelector('.num').textContent; label.textContent = source.querySelector('p').textContent;
      stat.appendChild(value); stat.appendChild(label); stats.appendChild(stat);
    });
  }
  syncContent(); document.addEventListener('langchange', syncContent);
  var visible = true;
  function syncMotion() { card.dataset.cardMotion = String(visible && !document.hidden && !motion.matches && !isStatic); }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; syncMotion(); }).observe(card);
  }
  motion.addEventListener('change', syncMotion); document.addEventListener('visibilitychange', syncMotion); syncMotion();
})();
