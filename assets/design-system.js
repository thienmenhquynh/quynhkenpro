/* Foundation 9tek themes: light and dark. */
(function () {
  'use strict';
  var root = document.documentElement;
  var themes = ['light', 'dark'];
  var preference = null;
  try { preference = localStorage.getItem('qk-theme'); } catch (error) { /* Use the default light theme. */ }
  // Keep the brightness of previously saved high-contrast preferences.
  if (preference === 'hc' || preference === 'hc-dark') {
    preference = preference === 'hc-dark' ? 'dark' : 'light';
    try { localStorage.setItem('qk-theme', preference); } catch (error) { /* Use the migrated theme for this visit. */ }
  }
  if (themes.indexOf(preference) === -1) preference = null;
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
    root.classList.remove('hc', 'hc-dark');
    root.style.colorScheme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = { light: '#F8FAFC', dark: '#0F1113' }[theme];
  }
  window.QKTheme = {
    set: function (theme) {
      if (themes.indexOf(theme) === -1) return;
      preference = theme;
      try { localStorage.setItem('qk-theme', theme); } catch (error) { /* The current selection still works. */ }
      apply(theme);
    },
    get: function () { return root.getAttribute('data-theme'); }
  };
  apply(preference || 'light');
  document.addEventListener('DOMContentLoaded', function () {
    function sync() {
      var en = window.I18N && I18N.lang === 'en';
      var button = document.querySelector('.theme-toggle');
      if (button) {
        var isDark = QKTheme.get() === 'dark';
        button.setAttribute('aria-pressed', String(isDark));
        button.setAttribute('aria-label', en ? (isDark ? 'Switch to light theme' : 'Switch to dark theme') : (isDark ? 'Bật giao diện sáng' : 'Bật giao diện tối'));
      }
    }
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    document.addEventListener('langchange', sync); sync();
  });
})();
