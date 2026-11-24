/* One lifecycle-aware typewriter for the hero and portrait role. */
(function () {
  'use strict';
  var hero = document.querySelector('.hero'), role = document.querySelector('.hero-role [data-i18n]'), portraitRole = document.getElementById('role-type');
  if (!hero || !role || !portraitRole) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)'), isStatic = /[?&]static\b/.test(location.search);
  var accessible = document.createElement('span'); accessible.className = 'sr-only';
  role.setAttribute('aria-hidden', 'true'); role.parentElement.appendChild(accessible);
  var roles = [], index = 0, length = 0, deleting = true, timer = 0, visible = true;
  function fullRole() { return roles[index]; }
  function publish() {
    portraitRole.dataset.fullRole = fullRole();
    document.dispatchEvent(new CustomEvent('herorolechange', { detail: { role: fullRole() } }));
  }
  function paint() {
    var text = Array.from(fullRole()).slice(0, length).join('');
    role.textContent = text || '\u00a0'; portraitRole.textContent = text || '\u00a0';
  }
  function active() { return visible && !document.hidden && !reduce.matches && !isStatic; }
  function schedule(delay) { clearTimeout(timer); timer = active() ? setTimeout(tick, delay) : 0; }
  function tick() {
    if (!active()) return;
    var total = Array.from(fullRole()).length;
    if (deleting) {
      length = Math.max(0, length - 1); paint();
      if (!length) { index = (index + 1) % roles.length; deleting = false; publish(); schedule(240); }
      else schedule(38);
    } else {
      length = Math.min(total, length + 1); paint();
      if (length === total) { deleting = true; schedule(2200); } else schedule(72);
    }
  }
  function reset() {
    clearTimeout(timer);
    var original = window.I18N && I18N.final(role) || role.textContent;
    accessible.textContent = original;
    var first = original.split('·')[0].trim();
    roles = [first].concat((portraitRole.getAttribute('data-roles') || 'Product Manager|Product Owner').split('|')).filter(function (r, i, all) { return r && all.indexOf(r) === i; });
    index = 0; length = Array.from(first).length; deleting = true; paint(); publish(); sync();
  }
  function sync() {
    clearTimeout(timer); timer = 0; hero.dataset.heroTextMotion = String(active());
    if (!active()) { length = Array.from(fullRole()).length; deleting = true; paint(); }
    else schedule(1800);
  }
  document.addEventListener('langchange', reset); reduce.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }).observe(hero);
  reset();
})();
