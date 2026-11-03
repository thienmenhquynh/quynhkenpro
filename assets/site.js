/* ============================================================
   Quỳnh Ken · site.js — dùng chung cho index.html và du-an.html
   ============================================================ */
(function () {
  var root = document.documentElement;
  var I18N = window.I18N;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  // ?static: chỉ để chụp kiểm thử — bỏ animation, hiện trạng thái cuối
  var STATIC = /[?&]static\b/.test(location.search);
  // ?freeze=2.76: chỉ để chụp kiểm thử — đóng băng animation tên tại giây đó
  var FZ = /[?&]freeze=([\d.]+)/.exec(location.search);
  if (FZ) { var fz = document.createElement('style'); fz.textContent = '.hero-name, .hero-name *, .hero-name *::before, .hero-name *::after { animation-play-state:paused !important; animation-delay:-' + FZ[1] + 's !important; }'; document.head.appendChild(fz); }

  I18N.init();

  /* ---------- Theme: luôn mở ở Light; Dark chỉ khi người xem chọn, không ghi nhớ ---------- */
  var themeBtn = $('.theme-toggle');
  function themeLabel() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', I18N.t(dark ? 'ui.toLight' : 'ui.toDark'));
  }
  themeBtn.addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') !== 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeLabel();
    if (window.gsap && !reduce.matches) {
      gsap.fromTo(themeBtn.querySelectorAll('svg'), { rotation: -90, scale: 0.6 },
        { rotation: 0, scale: 1, duration: 0.2, ease: 'power2.out', overwrite: true });
    }
  });

  /* ---------- Ngôn ngữ VN / EN ---------- */
  $$('.lang [data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-pressed') === 'true') return;
      I18N.set(b.getAttribute('data-lang'));
    });
  });

  /* ---------- Menu mobile ---------- */
  var nav = $('#nav'), menuBtn = $('.menu-btn'), menu = $('#mobile-menu');
  function menuLabel() { menuBtn.setAttribute('aria-label', I18N.t(nav.classList.contains('is-open') ? 'ui.menuClose' : 'ui.menu')); }
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuLabel();
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !e.target.closest('#mobile-menu') && !e.target.closest('.menu-btn')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 981px)').addEventListener('change', function () { setMenu(false); });

  document.addEventListener('langchange', function () {
    themeLabel(); menuLabel();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
  themeLabel(); menuLabel();

  /* ---------- Bộ lọc danh mục (trang Dự án) ---------- */
  var segBtns = $$('.seg [data-filter]');
  segBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      segBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var shown = [];
      $$('.area').forEach(function (a) {
        var on = f === 'all' || a.getAttribute('data-area') === f;
        a.hidden = !on;
        if (on) shown.push(a);
      });
      if (window.gsap) {
        if (reduce.matches) gsap.set(shown, { autoAlpha: 1, y: 0 });
        else gsap.fromTo(shown, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out', overwrite: true });
        gsap.set($$('.prods li'), { autoAlpha: 1, x: 0 });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }
    });
  });

  /* ---------- Nền hero: đường đua, 5 mốc CP và vệt sáng ---------- */
  (function () {
    var svg = $('.hero-track'), path = $('#hero-trail');
    if (!svg || !path || !path.getTotalLength) return;
    var NS = 'http://www.w3.org/2000/svg';
    var L = path.getTotalLength(), SEG = L * 0.14;
    var cps = [
      { f: 0.20, code: 'CP1', year: '2015', name: 'VCCorp' },
      { f: 0.31, code: 'CP2', year: '2019', name: 'Funtap' },
      { f: 0.41, code: 'CP3', year: '2021', key: 'race.remote', name: 'Từ xa' },
      { f: 0.49, code: 'CP4', year: '2022', name: 'KiotViet' },
      { f: 0.60, code: 'CP5', year: '2025', name: 'NetSpace' },
      { f: 0.70, code: 'CP6', year: '???', next: true, name: 'Hành trình tiếp theo ???' }
    ];
    var box = svg.viewBox.baseVal, cx = box.width / 2, cy = box.height / 2;
    var g = $('#hero-cps');
    cps.forEach(function (c) {
      var pt = path.getPointAtLength(c.f * L);
      var dx = pt.x - cx, dy = pt.y - cy, d = Math.hypot(dx, dy) || 1;
      var lx = pt.x + dx / d * 30, ly = pt.y + dy / d * 30;          // nhãn đặt phía ngoài đường đua
      var anchor = Math.abs(dx) < 60 ? 'middle' : (dx > 0 ? 'start' : 'end');
      var m = document.createElementNS(NS, 'g'); m.setAttribute('class', 'cp-mark' + (c.next ? ' is-next' : ''));
      m.innerHTML = (c.next ? '<circle class="ring" r="9" cx="' + pt.x + '" cy="' + pt.y + '"/>' : '') + '<circle r="7" cx="' + pt.x + '" cy="' + pt.y + '"/>' +
        '<text x="' + lx + '" y="' + (ly - 4) + '" text-anchor="' + anchor + '">' + c.code + ' · ' + c.year + '</text>' +
        '<text class="n" x="' + lx + '" y="' + (ly + 18) + '" text-anchor="' + anchor + '">' + c.name + '</text>';
      g.appendChild(m); c.el = m; c.nameEl = m.querySelector('.n');
    });
    function names() { cps.forEach(function (c) {
      if (c.key) c.nameEl.textContent = I18N.lang === 'en' ? 'Remote' : 'Từ xa';
      if (c.next) c.nameEl.textContent = I18N.lang === 'en' ? 'Next journey ???' : 'Hành trình tiếp theo ???';
    }); }
    names(); document.addEventListener('langchange', names);

    var head = $('#hero-head'), live = $('#race-live'), last = -1;
    path.style.strokeDasharray = SEG + ' ' + L;
    function render(p) {                                          // p: vị trí đầu vệt sáng, 0..1
      var at = (p * L) % L;
      path.style.strokeDashoffset = -(at - SEG);
      var pt = path.getPointAtLength(at); head.setAttribute('cx', pt.x); head.setAttribute('cy', pt.y);
      var hit = -1;
      cps.forEach(function (c, i) { var on = p >= c.f; c.el.classList.toggle('is-hit', on); if (on) hit = i; });
      if (hit !== last && hit > -1) {
        last = hit; var c = cps[hit];
        live.textContent = c.code + ' · ' + c.nameEl.textContent;
        if (window.gsap && !reduce.matches) gsap.fromTo(live, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out', overwrite: true });
      }
    }
    svg.classList.add('ready');
    var still = 0.64;                                             // đứng yên sau CP5 (không GSAP / giảm chuyển động)
    if (!window.gsap || reduce.matches || STATIC) { render(still); return; }
    var st = { p: 0 };
    var lap = gsap.to(st, { p: 0.98, duration: 11, ease: 'none', repeat: -1, repeatDelay: 1.2,
      onUpdate: function () { render(st.p); }, onRepeat: function () { last = -1; } });
    render(0);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es[0].isIntersecting ? lap.resume() : lap.pause(); }).observe($('.hero'));
    }
  })();

  /* ---------- Tấm BIB: dòng vai trò gõ như code ---------- */
  (function () {
    var el = $('#role-type'); if (!el) return;
    var roles = (el.getAttribute('data-roles') || 'Product Manager|Product Owner').split('|');
    if (reduce.matches || STATIC) { el.textContent = roles[0]; return; }
    var r = 0, n = roles[0].length, del = true;
    function tick() {
      var w = roles[r];
      if (del) { n--; if (n <= 0) { n = 0; del = false; r = (r + 1) % roles.length; } }
      else { n++; if (n >= roles[r].length) { del = true; el.textContent = roles[r]; return setTimeout(tick, 1800); } }
      el.textContent = (del ? w : roles[r]).slice(0, n);
      setTimeout(tick, del ? 38 : 75);
    }
    setTimeout(tick, 1800);                                    // giữ chữ đầu một nhịp rồi mới xoá
  })();

  /* ---------- Case study (trang Dự án): bộ lọc + trình xem kiểu Behance ---------- */
  var workLinks = $$('a.work-link');   // thẻ NetSpace (div) không mở trình xem
  var viewer = $('#viewer');
  if ($$('.work').length) {
    var wState = { domain: 'all', plat: 'all' };
    var wEmpty = $('.works-empty');
    function applyWorks() {
      var shown = [];
      $$('.works-list .work, .pcard[data-domain]').forEach(function (w) {
        var on = (wState.domain === 'all' || w.getAttribute('data-domain') === wState.domain) &&
                 (wState.plat === 'all' || (w.getAttribute('data-plat') || '').split(' ').indexOf(wState.plat) !== -1);
        w.hidden = !on; if (on) shown.push(w);
      });
      var featuredTitle = $('#works-title');
      if (featuredTitle) featuredTitle.parentElement.hidden = !$('.pcard[data-domain]:not([hidden])');
      if (wEmpty) wEmpty.hidden = shown.length > 0;
      if (window.gsap) {
        if (reduce.matches) gsap.set(shown, { autoAlpha: 1, y: 0 });
        else gsap.fromTo(shown, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', overwrite: true });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }
    }
    var wList = $('.works-list');
    var wItems = wList ? [].slice.call(wList.children) : [];
    wItems.forEach(function (li, i) { li.setAttribute('data-idx', i); });
    function titleOf(li) { var t = li.querySelector('.work-title'); return t ? t.textContent.trim() : ''; }
    function sortWorks(mode) {
      var arr = wItems.slice();
      if (mode === 'az' || mode === 'za') arr.sort(function (a, b) { var r = titleOf(a).localeCompare(titleOf(b), 'vi', { sensitivity: 'base' }); return mode === 'az' ? r : -r; });
      else if (mode === 'result') arr.sort(function (a, b) { return (b.querySelector('.work-stat') ? 1 : 0) - (a.querySelector('.work-stat') ? 1 : 0) || a.getAttribute('data-idx') - b.getAttribute('data-idx'); });
      else arr.sort(function (a, b) { return a.getAttribute('data-idx') - b.getAttribute('data-idx'); });
      // sản phẩm chưa có ảnh luôn nằm cuối
      arr.sort(function (a, b) { return (a.classList.contains('is-locked') ? 1 : 0) - (b.classList.contains('is-locked') ? 1 : 0); });
      arr.forEach(function (li) { wList.appendChild(li); });
      workLinks = $$('a.work-link');
    }
    var fD = $('#f-domain'), fP = $('#f-plat'), fS = $('#f-sort');
    if (fD) fD.addEventListener('change', function () { wState.domain = fD.value; applyWorks(); });
    if (fP) fP.addEventListener('change', function () { wState.plat = fP.value; applyWorks(); });
    if (fS) fS.addEventListener('change', function () { sortWorks(fS.value); applyWorks(); });

    if (viewer && typeof viewer.showModal === 'function') {
      var CDN = 'https://mir-s3-cdn-cf.behance.net/project_modules/';
      var vIdx = 0, lastFocus = null, vMode = 'works', fIdx = 0;
      var pcards = $$('.pcard');
      var vEl = { code: $('#vw-code'), title: $('#vw-title'), sub: $('#vw-sub'), col: $('#vw-col'), scroll: $('#vw-scroll'), count: $('#vw-count') };
      function visibleWorks() { return workLinks.filter(function (a) { return !a.closest('.work').hidden; }); }
      function fill(a) {
        var list = visibleWorks();
        vEl.code.textContent = a.getAttribute('data-code');
        vEl.title.textContent = a.querySelector('.work-title').textContent;
        vEl.sub.innerHTML = a.querySelector('.work-sub').innerHTML;
        setCount(seqPos({ w: a }));
      }
      /* Thứ tự xem liền mạch: các product (pcard) trước, rồi tới các case study đang hiển thị */
      function seq() {
        return pcards.filter(function (c) { return !c.hidden && c.querySelector('.br-view'); }).map(function (c) { return { p: c }; })
          .concat(visibleWorks().map(function (a) { return { w: a }; }));
      }
      function seqPos(x) {
        var list = seq();
        for (var k = 0; k < list.length; k++) if ((x.p && list[k].p === x.p) || (x.w && list[k].w === x.w)) return k;
        return 0;
      }
      function setCount(k) { vEl.count.textContent = (k + 1) + ' / ' + seq().length; }
      /* Link demo ở đầu trang xem trước (ẩn khi sản phẩm không có bản demo công khai) */
      var vDemo = $('#vw-demo'), vDemoLabel = $('#vw-demo-label'), vDemoUrl = $('#vw-demo-url');
      function setDemo(url) {
        if (!vDemo) return;
        var ok = url && /^https?:/.test(url);
        vDemo.hidden = !ok;
        if (!ok) return;
        var be = /behance\.net/.test(url), en = I18N.lang === 'en';
        vDemo.href = url;
        vDemoLabel.textContent = be ? (en ? 'View on Behance' : 'Xem trên Behance') : (en ? 'Open live demo' : 'Xem demo trực tiếp');
        vDemoUrl.textContent = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      }
      /* Mô tả + con số của sản phẩm ở đầu trang xem trước */
      var vInfo = $('#vw-info'), vInfoD = $('#vw-info-d'), vStats = $('#vw-stats'), vInfoR = $('#vw-info-r'), vProfile = $('#vw-profile'), vKey = null;
      function setInfo(key) {
        vKey = key;
        if (!vInfo) return;
        var all = window.PRODUCT_DETAILS || {}, it = all[key] && all[key][I18N.lang === 'en' ? 'en' : 'vi'];
        vInfo.hidden = !it;
        if (!it) return;
        vInfoD.textContent = it.d;
        if (vProfile) {
          vProfile.replaceChildren();
          var en = I18N.lang === 'en';
          function paragraph(label, text) {
            if (!text) return;
            var p = document.createElement('p'), b = document.createElement('b');
            b.textContent = label + ': ';
            p.appendChild(b); p.appendChild(document.createTextNode(text));
            vProfile.appendChild(p);
          }
          paragraph(en ? 'Who it is for' : 'Đối tượng', it.a);
          paragraph(en ? 'Problem' : 'Bài toán', it.problem);
          if (it.f && it.f.length) {
            var heading = document.createElement('h3'), list = document.createElement('ul');
            heading.textContent = en ? 'Key features' : 'Tính năng nổi bật';
            it.f.forEach(function (text) { var li = document.createElement('li'); li.textContent = text; list.appendChild(li); });
            vProfile.appendChild(heading); vProfile.appendChild(list);
          }
          if (it.cases && it.cases.length) {
            var casesHeading = document.createElement('h3');
            casesHeading.textContent = 'Case study'; vProfile.appendChild(casesHeading);
            it.cases.forEach(function (item) {
              paragraph(item.name, item.text);
              if (item.url && /^https:\/\//.test(item.url)) {
                var link = document.createElement('a');
                link.href = item.url; link.target = '_blank'; link.rel = 'noopener';
                link.textContent = (en ? 'Visit ' : 'Khám phá ') + item.name + ' ↗';
                vProfile.appendChild(link);
              }
            });
          }
          if (it.source) {
            var source = document.createElement('p'), sourceLink = document.createElement('a');
            source.className = 'profile-source'; sourceLink.href = it.source;
            sourceLink.target = '_blank'; sourceLink.rel = 'noopener';
            sourceLink.textContent = en ? 'NetSpace product profile · 3 Nov 2026' : 'Hồ sơ sản phẩm NetSpace · 03/11/2026';
            source.appendChild(sourceLink);
            source.appendChild(document.createTextNode(en ? ' — figures and outcomes reported in the profile.' : ' — số liệu và kết quả theo công bố trong hồ sơ.'));
            vProfile.appendChild(source);
          }
        }
        vStats.innerHTML = '';
        it.s.forEach(function (x) {
          var li = document.createElement('li'), b = document.createElement('b'), sp = document.createElement('span');
          b.textContent = x[0]; sp.textContent = x[1]; li.appendChild(b); li.appendChild(sp); vStats.appendChild(li);
        });
        vStats.hidden = !it.s.length;
        vInfoR.textContent = it.r || ''; vInfoR.hidden = !it.r;
      }
      document.addEventListener('langchange', function () { if (viewer.open && vKey) setInfo(vKey); });
      function fillFeat(i) {
        var card = pcards[i];
        vEl.code.textContent = card.querySelector('.feat-url').textContent;
        vEl.title.textContent = card.querySelector('.pc-name').textContent;
        vEl.sub.textContent = card.querySelector('.pc-lead').textContent;
        setCount(seqPos({ p: card }));
      }
      function openFeat(i, start) {
        vMode = 'feat'; fIdx = i;
        setInfo(pcards[i].getAttribute('aria-labelledby'));
        var live = pcards[i].querySelector('.pc-live');
        setDemo(live ? live.getAttribute('href') : pcards[i].getAttribute('data-demo'));
        vEl.col.classList.add('is-feat');
        var card = pcards[i];
        fillFeat(i);
        vEl.col.innerHTML = '';
        var detailCover = card.getAttribute('data-detail-cover');
        if (detailCover) {
          var coverFigure = document.createElement('figure'), coverImage = new Image(), coverCaption = document.createElement('figcaption');
          coverFigure.className = 'vw-fig'; coverImage.src = detailCover;
          coverImage.alt = card.querySelector('.pc-name').textContent;
          coverCaption.textContent = I18N.lang === 'en' ? 'Product overview' : 'Tổng quan sản phẩm';
          coverFigure.appendChild(coverImage); coverFigure.appendChild(coverCaption); vEl.col.appendChild(coverFigure);
        }
        var tabs = [].slice.call(card.querySelectorAll('.feat-item'));
        var target = null;
        tabs.forEach(function (t, k) {
          var src = document.getElementById(t.getAttribute('aria-controls'));
          var fig = document.createElement('figure'); fig.className = 'vw-fig';
          var img = new Image(); img.src = src.getAttribute('src'); img.alt = src.alt; img.decoding = 'async';
          var cap = document.createElement('figcaption');
          cap.innerHTML = '<span class="code">' + ('0' + (k + 1)).slice(-2) + '</span> ' + t.querySelector('.fi-title').textContent;
          fig.appendChild(img); fig.appendChild(cap); vEl.col.appendChild(fig);
          if (k === (start || 0)) target = fig;
          var ex = t.getAttribute('data-extra'), exk = (t.getAttribute('data-extra-i18n') || '').split('|');
          if (ex) ex.split('|').forEach(function (pair, j) {
            var bits = pair.split('~'), label = (window.I18N && I18N.lang === 'en' && I18N.t && I18N.t(exk[j])) || bits[1];
            var f2 = document.createElement('figure'); f2.className = 'vw-fig';
            var im2 = new Image(); im2.src = bits[0]; im2.alt = label; im2.decoding = 'async'; im2.loading = 'lazy';
            var c2 = document.createElement('figcaption');
            c2.innerHTML = '<span class="code">' + ('0' + (k + 1)).slice(-2) + '</span> ' + t.querySelector('.fi-title').textContent + ' · ' + label;
            f2.appendChild(im2); f2.appendChild(c2); vEl.col.appendChild(f2);
          });
        });
        vEl.scroll.scrollTop = 0;
        if (!viewer.open) { lastFocus = document.activeElement; viewer.showModal(); document.body.classList.add('vw-lock'); }
        if (target && start) setTimeout(function () { vEl.scroll.scrollTop = target.offsetTop - 24; }, 60);
        if (window.gsap && !reduce.matches) gsap.fromTo(vEl.col, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', overwrite: true });
      }
      pcards.forEach(function (card, i) {
        var view = card.querySelector('.br-view');
        if (!view) return;
        function go() {
          var tabs = [].slice.call(card.querySelectorAll('.feat-item'));
          var cur = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
          openFeat(i, Math.max(0, cur));
        }
        view.addEventListener('click', go);
        view.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      });
      function openWork(a) {
        vMode = 'works';
        setInfo(a.getAttribute('data-code'));
        setDemo(a.hasAttribute('data-demo') ? a.getAttribute('data-demo') : a.getAttribute('href'));
        vEl.col.classList.remove('is-feat');
        vIdx = workLinks.indexOf(a);
        fill(a);
        var title = a.querySelector('.work-title').textContent;
        vEl.col.innerHTML = '';
        // data-rows="3-5,6-8": gom các ảnh (đánh số từ 1) thành một hàng nhiều cột
        var rows = (a.getAttribute('data-rows') || '').split(',').filter(Boolean).map(function (r) { var b = r.split('-'); return [Number(b[0]), Number(b[1] || b[0])]; });
        var rowEl = null, rowEnd = 0;
        (a.getAttribute('data-images') || '').split(',').filter(Boolean).forEach(function (f, i) {
          var n = i + 1;
          var img = new Image();
          img.src = /^(https?:|assets\/)/.test(f) ? f : CDN + f;
          img.alt = title + ' — ' + (I18N.lang === 'en' ? 'image ' : 'ảnh ') + n;
          img.decoding = 'async';
          if (i > 1) img.loading = 'lazy';
          if (!rowEl) {
            var r = rows.filter(function (x) { return x[0] === n; })[0];
            if (r && r[1] > r[0]) { rowEl = document.createElement('div'); rowEl.className = 'vw-row'; rowEl.style.setProperty('--cols', r[1] - r[0] + 1); rowEnd = r[1]; vEl.col.appendChild(rowEl); }
          }
          (rowEl || vEl.col).appendChild(img);
          if (rowEl && n >= rowEnd) rowEl = null;
        });
        vEl.scroll.scrollTop = 0;
        if (!viewer.open) { lastFocus = document.activeElement; viewer.showModal(); document.body.classList.add('vw-lock'); }
        if (window.gsap && !reduce.matches) gsap.fromTo(vEl.col, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', overwrite: true });
      }
      function step(d) {
        var list = seq();
        if (!list.length) return;
        var cur = seqPos(vMode === 'feat' ? { p: pcards[fIdx] } : { w: workLinks[vIdx] });
        var nx = list[(cur + d + list.length) % list.length];
        if (nx.p) openFeat(pcards.indexOf(nx.p), 0); else openWork(nx.w);
      }
      /* Bấm ảnh trong trang xem trước để xem toàn màn hình; ← → chuyển ảnh, Esc đóng */
      var lb = document.createElement('div'), lbImg = new Image(), lbCap = document.createElement('p'), lbList = [], lbIdx = 0;
      lb.className = 'vw-lb'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = '<button class="btn btn-icon vw-lb-close" type="button" aria-label="Đóng"><svg class="ico" aria-hidden="true"><use href="#i-x"/></svg></button>' +
        '<button class="btn btn-icon vw-lb-nav" type="button" data-lb="-1" aria-label="Ảnh trước"><svg class="ico" aria-hidden="true"><use href="#i-chev-l"/></svg></button>' +
        '<div class="vw-lb-stage"></div>' +
        '<button class="btn btn-icon vw-lb-nav" type="button" data-lb="1" aria-label="Ảnh sau"><svg class="ico" aria-hidden="true"><use href="#i-chev-r"/></svg></button>';
      lbCap.className = 'vw-lb-cap';
      lb.querySelector('.vw-lb-stage').appendChild(lbImg);
      lb.appendChild(lbCap);
      viewer.appendChild(lb);
      function lbShow(k) {
        lbIdx = (k + lbList.length) % lbList.length;
        var im = lbList[lbIdx], fc = im.closest('figure') && im.closest('figure').querySelector('figcaption');
        lbImg.src = im.currentSrc || im.src; lbImg.alt = im.alt;
        lbCap.textContent = (fc ? fc.textContent + ' · ' : '') + (lbIdx + 1) + ' / ' + lbList.length;
        lb.querySelector('.vw-lb-stage').scrollTop = 0;
      }
      function lbOpen(im) {
        lbList = $$('img', vEl.col);
        lb.hidden = false; viewer.classList.add('lb-open');
        lbShow(lbList.indexOf(im));
        lb.querySelector('.vw-lb-close').focus();
      }
      function lbClose() { lb.hidden = true; viewer.classList.remove('lb-open'); }
      vEl.col.addEventListener('click', function (e) { var im = e.target.closest('img'); if (im) lbOpen(im); });
      lb.addEventListener('click', function (e) {
        var nav = e.target.closest('[data-lb]');
        if (nav) lbShow(lbIdx + Number(nav.getAttribute('data-lb')));
        else if (e.target.closest('.vw-lb-close') || !e.target.closest('img')) lbClose();
      });
      viewer.addEventListener('cancel', function (e) { if (!lb.hidden) { e.preventDefault(); lbClose(); } });
      workLinks.forEach(function (a) {
        a.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;   // giữ mở tab mới như link thường
          e.preventDefault(); openWork(a);
        });
      });
      $$('[data-vw]', viewer).forEach(function (b) { b.addEventListener('click', function () { step(Number(b.getAttribute('data-vw'))); }); });
      $('.vw-close', viewer).addEventListener('click', function () { viewer.close(); });
      viewer.addEventListener('close', function () { lbClose(); document.body.classList.remove('vw-lock'); if (lastFocus) lastFocus.focus(); });
      viewer.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        if (!lb.hidden) lbShow(lbIdx + d); else step(d);
      });
      document.addEventListener('langchange', function () { if (viewer.open) { if (vMode === 'feat') fillFeat(fIdx); else fill(workLinks[vIdx]); } });
    }
  }

  /* ============================================================
     Motion — GSAP
     - Chỉ transform + autoAlpha; ease power2/3.out, không bounce/elastic.
     - Mỗi khối chạy một lần khi cuộn tới; prefers-reduced-motion: không chạy gì.
     - CDN lỗi → không có window.gsap → trang vẫn hiện đủ, cảnh 3D đứng yên.
     ============================================================ */
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.6 });
  // Chỉ để chụp kiểm thử headless (?motion-test): bỏ lag smoothing để thời gian ảo chạy đủ
  if (/[?&]motion-test\b/.test(location.search)) gsap.ticker.lagSmoothing(0);

  // Đếm số: "15.000+" / "15,000+" → đếm từ 0, giữ hậu tố. Bỏ qua dạng khoảng "28–30".
  function countUp(el, vars) {
    var text = el.textContent.trim();
    var m = text.match(/^([\d.,]+)(.*)$/);
    if (!m || /^[–-]/.test(m[2])) return null;
    var target = parseInt(m[1].replace(/[.,]/g, ''), 10);
    var suffix = m[2];
    var obj = { v: 0 };
    return gsap.to(obj, Object.assign({
      v: target, duration: 1.2, ease: 'power2.out',
      onUpdate: function () {
        var fmt = new Intl.NumberFormat(I18N.lang === 'en' ? 'en-US' : 'vi-VN');
        el.textContent = fmt.format(Math.round(obj.v)) + suffix;
      },
      onComplete: function () { var f = I18N.final(el); if (f != null) el.innerHTML = f; else el.textContent = text; }
    }, vars));
  }
  function exists(s) { return document.querySelector(s) !== null; }

  var mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    if (STATIC) return;

    /* ---- Hero (trang chủ) ---- */
    if (exists('.hero')) {
      var hero = gsap.timeline({ defaults: { autoAlpha: 0, y: 24 } });
      hero
        .from('.hero .hello', { y: 8, duration: 0.4 })
        .from('.hero h1', { y: 32, duration: 0.8 }, '<0.1')
        .from('.hero-role', { x: -16, y: 0, duration: 0.5 }, '<0.35')
        .from('.hero .lead-strong', {}, '<0.25')
        .from('.hero .btn-row .btn', { y: 16, stagger: 0.08 }, '<0.2')
        .from('.split', { y: 12, stagger: 0.06, duration: 0.5 }, '<0.1')
        .from('.hero-dots', { y: 0, duration: 1.2, ease: 'power2.out' }, 0)
        .from('.runner-card', { y: 48, rotationX: 10, duration: 0.9 }, 0.3)
        .from('.plate', { y: 16, duration: 0.5 }, 0.85);
      $$('.split .num').forEach(function (el) {
        var t = countUp(el, { paused: true });
        if (t) hero.add(t.play(), 0.6);
      });

      // Card nghiêng nhẹ theo con trỏ (chỉ chuột/trackpad)
      var heroEl = $('.hero'), card = $('.runner-card');
      if (card && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var rY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        var rX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        gsap.set('.hero-track', { xPercent: -50, yPercent: -50, x: 0, y: 0 });   // giữ căn giữa theo % khi GSAP điều khiển transform
        var tX = gsap.quickTo('.hero-track', 'x', { duration: 0.9, ease: 'power3.out' });
        heroEl.addEventListener('pointermove', function (e) {
          var r = heroEl.getBoundingClientRect();
          var nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
          rY(nx * 8); rX(ny * -6); tX(nx * -24);
        });
        heroEl.addEventListener('pointerleave', function () { rY(0); rX(0); tX(0); });
      }
    }
  });

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    if (STATIC) return;

    /* ---- Lộ trình: từng chặng "chạy" lần lượt ---- */
    if (exists('.course')) {
      gsap.set('.cp-bar', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.cp > :not(.cp-bar)', { autoAlpha: 0, y: 8 });
      ScrollTrigger.create({
        trigger: '.course', start: 'top 92%', once: true,
        onEnter: function () {
          gsap.timeline({ delay: 0.2 })
            .to('.cp-bar', { scaleX: 1, duration: 0.45, stagger: 0.14, ease: 'power2.inOut' })
            .to('.cp > :not(.cp-bar)', { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.03 }, 0.1);
        }
      });
    }

    /* ---- Đầu trang Dự án ---- */
    if (exists('.page-head')) {
      gsap.timeline({ defaults: { autoAlpha: 0, y: 20 } })
        .from('.page-head .crumbs, .page-head .eyebrow', { stagger: 0.06, duration: 0.5 })
        .from('.page-head h1', { y: 28, duration: 0.8 }, '<0.05')
        .from('.page-head .lead', {}, '<0.2')
        .from('.page-stats > div', { stagger: 0.08 }, '<0.1');
    }

    /* ---- Tiêu đề section ---- */
    gsap.utils.toArray('.sec-head, .pf-intro').forEach(function (head) {
      gsap.from(head.children, { autoAlpha: 0, y: 20, stagger: 0.1, scrollTrigger: { trigger: head, start: 'top 85%', once: true } });
    });

    /* ---- Thẻ: hiện theo lô (set ẩn trước rồi to — tránh nháy ở mép màn hình) ---- */
    var cards = '.codewin, .cap, .area, .skill, .side-card, .job, .seg, .work';
    if ($$(cards).length) {
      gsap.set(cards, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(cards, {
        start: 'top 88%', once: true,
        onEnter: function (batch) { gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.08, overwrite: true }); }
      });
    }

    /* ---- Bảng thành tích ---- */
    if (exists('.board-wrap')) {
      gsap.set('.board-bar', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.board tbody tr', { autoAlpha: 0, y: 20 });
      ScrollTrigger.create({
        trigger: '.board-wrap', start: 'top 85%', once: true,
        onEnter: function () {
          var tl = gsap.timeline();
          tl.to('.board-bar', { scaleX: 1, duration: 0.8, ease: 'power2.inOut' })
            .to('.board tbody tr', { autoAlpha: 1, y: 0, stagger: 0.09 }, 0.1);
          $$('.board .big').forEach(function (el, i) {
            var t = countUp(el, { paused: true });
            if (t) tl.add(t.play(), 0.2 + i * 0.09);
          });
        }
      });
    }

    /* ---- % kỹ năng: thanh chạy + số đếm khi cuộn tới ---- */
    $$('.sk-meter').forEach(function (m) {
      var bar = m.querySelector('.sk-bar i'), val = m.querySelector('.sk-val');
      var tl = gsap.timeline({ scrollTrigger: { trigger: m, start: 'top 90%', once: true } });
      tl.from(bar, { scaleX: 0, duration: 1, ease: 'power2.inOut' });
    });

    /* ---- Số pet-tech ---- */
    var pet = $('.pet-num');
    if (pet) countUp(pet, { scrollTrigger: { trigger: pet, start: 'top 88%', once: true } });

    /* ---- Sản phẩm trong từng mảng ---- */
    gsap.utils.toArray('.area').forEach(function (area) {
      gsap.from(area.querySelectorAll('.prods li'), { autoAlpha: 0, x: -8, duration: 0.4, stagger: 0.04, scrollTrigger: { trigger: area, start: 'top 85%', once: true } });
    });

    /* ---- Kinh nghiệm: đường tiến độ theo cuộn ---- */
    if (exists('.timeline')) {
      gsap.fromTo('.track-fill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: 0.4 } });
    }

    /* ---- Vạch đích ---- */
    if (exists('.closing')) {
      gsap.timeline({ scrollTrigger: { trigger: '.closing', start: 'top 80%', once: true } })
        .from('.finish-line', { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power2.inOut' })
        .from('.closing-copy > *', { autoAlpha: 0, y: 24, stagger: 0.08 }, 0.15)
        .from('.contact-cards a', { autoAlpha: 0, x: 24, stagger: 0.07 }, 0.25);
    }

    gsap.from('.stripe', { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power2.inOut', scrollTrigger: { trigger: 'footer', start: 'top 95%', once: true } });
  });
})();

/* Logo ở header: bấm trên chính trang chủ → làm mới trang, về đầu trang */
(function () {
  var logo = document.querySelector('.nav .wordmark');
  if (!logo) return;
  logo.addEventListener('click', function (e) {
    var target = new URL(logo.href, location.href);
    var here = location.pathname.replace(/(index\.html|\/)$/, '');
    var there = target.pathname.replace(/(index\.html|\/)$/, '');
    if (here !== there || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    location.replace(location.pathname + location.search);
  });
})();

/* Dự án nổi bật: switcher danh sách + ảnh trong khung trình duyệt (tự chuyển, dừng khi rê chuột / focus) */
[].forEach.call(document.querySelectorAll('.feat'), function (root) {
  var tabs = [].slice.call(root.querySelectorAll('.feat-item'));
  var url = root.querySelector('.feat-url');
  var mock = root.querySelector('.br-mock');
  /* Mô tả của tab đang chọn hiện ngay dưới ảnh */
  var stage = root.querySelector('.feat-stage');
  var caption = document.createElement('p');
  caption.className = 'feat-caption';
  caption.setAttribute('aria-live', 'polite');
  if (stage) stage.appendChild(caption);
  function syncCaption() {
    var d = tabs[idx] && tabs[idx].querySelector('.fi-desc');
    caption.innerHTML = d ? d.innerHTML : '';
  }
  document.addEventListener('langchange', syncCaption);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var STATIC = /[?&]static\b/.test(location.search);
  var MS = 7000, idx = 0, timer = null, paused = false;
  root.style.setProperty('--feat-ms', MS + 'ms');

  function show(i, focus) {
    if (i === idx && !focus) return;
    var prev = idx; idx = (i + tabs.length) % tabs.length;
    tabs.forEach(function (t, k) {
      var on = k === idx;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (on) { p.hidden = false; void p.offsetWidth; p.classList.add('is-on'); }
      else if (k === prev) { p.classList.remove('is-on'); setTimeout(function () { if (tabs[idx] !== t) p.hidden = true; }, 520); }
      else { p.classList.remove('is-on'); p.hidden = true; }
    });
    url.textContent = tabs[idx].getAttribute('data-url');
    if (mock) mock.hidden = !tabs[idx].hasAttribute('data-mock');
    syncCaption();
    if (focus) tabs[idx].focus();
    restart();
  }
  syncCaption();
  function restart() {
    clearTimeout(timer);
    if (!root.classList.contains('is-auto')) return;
    var bar = tabs[idx].querySelector('.fi-bar');
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    if (!paused) timer = setTimeout(function () { show(idx + 1); }, MS);
  }
  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { show(k); });
    t.addEventListener('keydown', function (e) {
      var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); show(idx + d, true); }
      else if (e.key === 'Home') { e.preventDefault(); show(0, true); }
      else if (e.key === 'End') { e.preventDefault(); show(tabs.length - 1, true); }
    });
  });
  function pause(on) { paused = on; root.classList.toggle('is-paused', on); if (on) clearTimeout(timer); else restart(); }
  root.addEventListener('mouseenter', function () { pause(true); });
  root.addEventListener('mouseleave', function () { pause(false); });
  root.addEventListener('focusin', function () { pause(true); });
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) pause(false); });
  if (!reduce.matches && !STATIC && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { root.classList.add('is-auto'); restart(); }
        else { root.classList.remove('is-auto'); clearTimeout(timer); }
      });
    }, { threshold: 0.35 }).observe(root);
  }
});

/* Thẻ dự án nổi bật đổi dark/light theo theme của trang */
(function () {
  var html = document.documentElement;
  var els = document.querySelectorAll('[data-theme-follow]');
  if (!els.length) return;
  function sync() { var t = html.getAttribute('data-theme') || 'dark'; [].forEach.call(els, function (el) { el.setAttribute('data-theme', t); }); }
  sync();
  new MutationObserver(sync).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
})();
