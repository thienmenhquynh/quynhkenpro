/* Foundation 9tek themes: light, dark, hc and hc-dark. */
(function () {
  'use strict';
  var root = document.documentElement;
  var themes = ['light', 'dark', 'hc', 'hc-dark'];
  var contrast = matchMedia('(prefers-contrast: more)');
  var dark = matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  try { preference = localStorage.getItem('qk-theme'); } catch (error) { /* Use system accessibility settings. */ }
  if (themes.indexOf(preference) === -1) preference = null;
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark' || theme === 'hc-dark');
    root.classList.toggle('hc', theme === 'hc');
    root.classList.toggle('hc-dark', theme === 'hc-dark');
    root.style.colorScheme = theme === 'dark' || theme === 'hc-dark' ? 'dark' : 'light';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = { light: '#F8FAFC', dark: '#0F1113', hc: '#FFFFFF', 'hc-dark': '#000000' }[theme];
  }
  function automaticTheme() { return contrast.matches ? (dark.matches ? 'hc-dark' : 'hc') : 'light'; }
  window.QKTheme = {
    set: function (theme) {
      if (themes.indexOf(theme) === -1) return;
      preference = theme;
      try { localStorage.setItem('qk-theme', theme); } catch (error) { /* The current selection still works. */ }
      apply(theme);
    },
    get: function () { return root.getAttribute('data-theme'); }
  };
  apply(preference || automaticTheme());
  function systemChanged() { if (!preference) apply(automaticTheme()); }
  contrast.addEventListener('change', systemChanged); dark.addEventListener('change', systemChanged);
  document.addEventListener('DOMContentLoaded', function () {
    var controls = [];
    function control(className) {
      var label = document.createElement('label'); label.className = 'ds-theme-control ' + className;
      var text = document.createElement('span'), select = document.createElement('select');
      select.className = 'ds-theme-select';
      themes.forEach(function (theme) { var option = document.createElement('option'); option.value = theme; select.appendChild(option); });
      select.addEventListener('change', function () { QKTheme.set(select.value); });
      label.appendChild(text); label.appendChild(select); controls.push({ label: text, select: select });
      return label;
    }
    var menu = document.getElementById('mobile-menu');
    if (menu) menu.appendChild(control('ds-theme-menu'));
    var footer = document.querySelector('footer .wrap');
    if (footer) footer.appendChild(control('ds-theme-footer'));
    function sync() {
      var en = window.I18N && I18N.lang === 'en';
      var labels = en ? ['Light', 'Dark', 'High contrast', 'High contrast dark'] : ['Sáng', 'Tối', 'Tương phản cao', 'Tương phản cao · Tối'];
      controls.forEach(function (item) {
        item.label.textContent = en ? 'Appearance' : 'Giao diện';
        Array.from(item.select.options).forEach(function (option, index) { option.textContent = labels[index]; });
        item.select.value = QKTheme.get();
      });
      var button = document.querySelector('.theme-toggle');
      if (button) {
        var isDark = /dark$/.test(QKTheme.get());
        button.setAttribute('aria-pressed', String(isDark));
        button.setAttribute('aria-label', en ? (isDark ? 'Switch to light theme' : 'Switch to dark theme') : (isDark ? 'Bật giao diện sáng' : 'Bật giao diện tối'));
      }
    }
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    document.addEventListener('langchange', sync); sync();
  });
})();
