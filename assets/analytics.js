/* Amplitude — project "quynhken.pro".
   Không chạy trên localhost; bỏ qua khi trình duyệt bật Do Not Track.
   Không bật Session Replay; không theo dõi nội dung form. */
(function () {
  'use strict';
  var KEY = '16ef0ed37f9b19dfe3135c65bcb96c4e';
  window.nsTrack = function () {};
  var host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || /\.localhost$/.test(host)) return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1') return;
  var s = document.createElement('script');
  s.src = 'https://cdn.amplitude.com/script/' + KEY + '.js';
  s.async = true;
  s.onload = function () {
    try {
      window.amplitude.init(KEY, {
        fetchRemoteConfig: true,
        autocapture: { pageViews: true, sessions: true, fileDownloads: true, elementInteractions: true, formInteractions: false, attribution: true }
      });
      window.nsTrack = function (name, props) { try { window.amplitude.track(name, props); } catch (e) {} };
    } catch (e) {}
  };
  document.head.appendChild(s);
})();
