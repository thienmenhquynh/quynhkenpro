/* Project views share the existing cards, filters and detail viewer. */
(function () {
  'use strict';
  var root = document.getElementById('case-study');
  if (!root) return;
  var tabs = root.querySelector('.project-view-tabs');
  if (!tabs) return;
  var buttons = Array.from(tabs.querySelectorAll('[data-view]'));
  var panels = {
    current: document.getElementById('project-current'),
    lark: document.getElementById('project-lark'),
    gantt: document.getElementById('project-gantt')
  };
  var viewToolbar = root.querySelector('.project-toolbar');
  var empty = root.querySelector('.works-empty');
  var home = document.getElementById('project-tools-home');
  var shared = document.getElementById('project-shared-tools');
  var summary = document.getElementById('project-view-summary');
  var domainSelect = document.getElementById('f-domain');
  var platformSelect = document.getElementById('f-plat');
  var sortSelect = document.getElementById('f-sort');
  var view = 'current';
  var collapsed = new Set();
  var stickyFrame = 0;
  function syncStickyHeaders() {
    stickyFrame = 0;
    var navHeight = parseFloat(getComputedStyle(root).getPropertyValue('--nav-height')) || 62;
    var stickyTop = navHeight + viewToolbar.getBoundingClientRect().height;
    root.style.setProperty('--project-sticky-top', stickyTop + 'px');
    if (view !== 'gantt') return;
    var scroller = panels.gantt.querySelector('.project-gantt-scroll');
    var table = panels.gantt.querySelector('table');
    if (!scroller || !table) return;
    var header = table.tHead, headerHeight = header.getBoundingClientRect().height;
    var box = scroller.getBoundingClientRect();
    var offset = Math.max(0, Math.min(stickyTop - box.top, table.offsetHeight - headerHeight));
    header.querySelectorAll('th').forEach(function (cell) { cell.style.transform = 'translateY(' + offset + 'px)'; });
    table.querySelectorAll('.project-gantt-group').forEach(function (row) {
      var rowBox = row.getBoundingClientRect(), bodyBox = row.parentElement.getBoundingClientRect();
      var shift = Math.max(0, Math.min(stickyTop + headerHeight - rowBox.top, bodyBox.bottom - rowBox.top - rowBox.height));
      row.firstElementChild.style.transform = 'translateY(' + shift + 'px)';
    });
  }
  function scheduleStickyHeaders() {
    if (!stickyFrame) stickyFrame = requestAnimationFrame(syncStickyHeaders);
  }
  var dateParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Saigon', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  function part(name) { return Number(dateParts.find(function (item) { return item.type === name; }).value); }
  var today = new Date(Date.UTC(part('year'), part('month') - 1, part('day')));
  var ganttAnchor = new Date(today), ganttScale = 'quarter';
  var dayMs = 86400000;
  // Dated events explicitly listed in docs/netspace-products.md. No inferred product schedules.
  var milestones = {
    RACE: [
      { date: '2026-10-24', name: 'Vân Sơn Hidden Charm 2026' },
      { date: '2026-11-29', name: 'Yên Tử Heritage Marathon 2026' },
      { date: '2026-12-19', name: 'Trà Cổ Half Marathon' }
    ]
  };
  var groups = [
    { key: 'media', vi: 'Báo chí – Truyền thông', en: 'Press & media' },
    { key: 'event', vi: 'Sự kiện', en: 'Events' },
    { key: 'kol', vi: 'MCN / KOL', en: 'MCN / KOL' },
    { key: 're', vi: 'Bất động sản', en: 'Real estate' },
    { key: 'archive', vi: 'Dự án khác', en: 'Other projects' }
  ];
  var sources = Array.from(root.querySelectorAll('.pcards .pcard, .works-list > .work'));
  function english() { return window.I18N && I18N.lang === 'en'; }
  function label(vi, en) { return english() ? en : vi; }
  function text(source, selector) {
    var element = source.querySelector(selector);
    return element ? element.textContent.trim() : '';
  }
  function element(tag, className, value) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (value != null) el.textContent = value;
    return el;
  }
  function groupName(key) {
    var group = groups.find(function (g) { return g.key === key; }) || groups[4];
    return english() ? group.en : group.vi;
  }
  function records() {
    return sources.map(function (source, index) {
      var featured = source.classList.contains('pcard');
      var target = source.querySelector(featured ? '.br-view' : 'a.work-link');
      var image = source.querySelector(featured ? '.fp.is-on' : '.work-media img');
      return {
        source: source, target: target, index: index,
        code: featured ? source.getAttribute('aria-labelledby').replace('pc-', '').toUpperCase() : (source.querySelector('[data-code]') || source).getAttribute('data-code') || text(source, '.work-code'),
        name: text(source, featured ? '.pc-name' : '.work-title'),
        description: text(source, featured ? '.pc-lead' : '.work-sub'),
        domain: source.getAttribute('data-domain') || 'archive',
        platform: source.getAttribute('data-plat') || 'web',
        image: image ? image.getAttribute('src') : '',
        result: !!source.querySelector('.work-stat, .fi-stat'),
        available: !!target
      };
    }).filter(function (record) {
      return (domainSelect.value === 'all' || record.domain === domainSelect.value) &&
        (platformSelect.value === 'all' || record.platform.split(' ').indexOf(platformSelect.value) !== -1);
    }).sort(function (a, b) {
      var mode = sortSelect.value;
      if (mode === 'az' || mode === 'za') {
        var order = a.name.localeCompare(b.name, english() ? 'en' : 'vi', { sensitivity: 'base' });
        return mode === 'az' ? order : -order;
      }
      if (mode === 'result') return Number(b.result) - Number(a.result) || a.index - b.index;
      return a.index - b.index;
    });
  }
  function chip(record) {
    var badge = element('span', 'project-domain-chip', groupName(record.domain));
    badge.dataset.domain = record.domain;
    return badge;
  }
  function open(record) {
    if (record.target) record.target.click();
  }
  function recordButton(record) {
    var button = element('button', 'project-record-link', record.name);
    button.type = 'button'; button.disabled = !record.available;
    button.dataset.projectCode = record.code;
    if (!record.available) button.title = label('Đang cập nhật ảnh', 'Screens coming soon');
    button.addEventListener('click', function () { open(record); });
    return button;
  }
  function platform(record) { return record.platform === 'web' ? 'Web' : record.platform === 'app' ? 'App' : 'Web · App'; }
  function fitLarkTable() {
    var table = panels.lark.querySelector('table');
    if (!table) return;
    var mode = matchMedia('(max-width:600px)').matches ? 'mobile' : matchMedia('(max-width:980px)').matches ? 'compact' : 'full';
    table.dataset.layout = mode;
    table.querySelectorAll('.project-group-row th').forEach(function (cell) { cell.colSpan = mode === 'mobile' ? 2 : mode === 'compact' ? 4 : 6; });
  }
  function renderLark(data) {
    var wrapper = element('div', 'project-table-scroll');
    wrapper.tabIndex = 0; wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', label('Bảng dự án theo lĩnh vực', 'Projects grouped by domain'));
    var table = element('table', 'project-lark-table');
    var caption = element('caption', 'sr-only', label('Danh sách dự án', 'Project list'));
    table.appendChild(caption);
    var head = element('thead'), header = element('tr');
    ['#', label('Mã', 'Code'), label('Sản phẩm', 'Product'), label('Lĩnh vực', 'Domain'), label('Nền tảng', 'Platform'), label('Mô tả', 'Description')].forEach(function (title) {
      var th = element('th', '', title); th.scope = 'col'; header.appendChild(th);
    });
    head.appendChild(header); table.appendChild(head);
    groups.forEach(function (group) {
      var items = data.filter(function (record) { return record.domain === group.key; });
      if (!items.length) return;
      var body = element('tbody'), groupRow = element('tr', 'project-group-row'), groupCell = element('th');
      groupCell.colSpan = 6; groupCell.scope = 'rowgroup';
      var toggle = element('button', 'project-group-toggle'); toggle.type = 'button';
      var closed = collapsed.has(group.key);
      toggle.setAttribute('aria-expanded', String(!closed));
      var arrow = element('span', 'project-group-arrow'); arrow.setAttribute('aria-hidden', 'true');
      toggle.appendChild(arrow); toggle.appendChild(chip({ domain: group.key }));
      toggle.appendChild(element('span', 'project-group-count', items.length + label(' dự án', ' projects')));
      groupCell.appendChild(toggle); groupRow.appendChild(groupCell); body.appendChild(groupRow);
      var rows = [];
      items.forEach(function (record, index) {
        var row = element('tr', 'project-data-row'); row.hidden = closed;
        row.appendChild(element('td', 'project-row-number', index + 1));
        row.appendChild(element('td', 'project-code-cell', record.code));
        var name = element('td', 'project-name-cell'); name.appendChild(recordButton(record));
        name.appendChild(element('span', 'project-mobile-meta', record.code + ' · ' + platform(record))); row.appendChild(name);
        var domain = element('td'); domain.appendChild(chip(record)); row.appendChild(domain);
        row.appendChild(element('td', 'project-platform-cell', platform(record)));
        row.appendChild(element('td', 'project-description-cell', record.description));
        rows.push(row); body.appendChild(row);
      });
      toggle.addEventListener('click', function () {
        var closing = toggle.getAttribute('aria-expanded') === 'true';
        if (closing) collapsed.add(group.key); else collapsed.delete(group.key);
        toggle.setAttribute('aria-expanded', String(!closing));
        rows.forEach(function (row) { row.hidden = closing; });
      });
      table.appendChild(body);
    });
    wrapper.appendChild(table); panels.lark.replaceChildren(wrapper); fitLarkTable();
  }
  function dateLabel(date, options) {
    return new Intl.DateTimeFormat(english() ? 'en-GB' : 'vi-VN', Object.assign({ timeZone: 'UTC' }, options)).format(date);
  }
  function ganttRange() {
    var year = ganttAnchor.getUTCFullYear(), month = ganttAnchor.getUTCMonth();
    var start, end, unit;
    if (ganttScale === 'week') {
      start = new Date(ganttAnchor); start.setUTCDate(start.getUTCDate() - (start.getUTCDay() + 6) % 7);
      end = new Date(start.getTime() + 7 * dayMs); unit = 96;
    } else if (ganttScale === 'month') {
      start = new Date(Date.UTC(year, month, 1)); end = new Date(Date.UTC(year, month + 1, 1)); unit = 24;
    } else if (ganttScale === 'year') {
      start = new Date(Date.UTC(year, 0, 1)); end = new Date(Date.UTC(year + 1, 0, 1)); unit = 3;
    } else {
      start = new Date(Date.UTC(year, Math.floor(month / 3) * 3, 1)); end = new Date(Date.UTC(year, Math.floor(month / 3) * 3 + 3, 1)); unit = 8;
    }
    return { start: start, end: end, days: Math.round((end - start) / dayMs), unit: unit };
  }
  function renderGantt(data) {
    var range = ganttRange(), width = range.days * range.unit;
    var toolbar = element('div', 'project-gantt-tools');
    var navigation = element('div', 'project-gantt-navigation');
    function navigateButton(value, title, action) {
      var button = element('button', 'project-gantt-control', value); button.type = 'button';
      button.setAttribute('aria-label', title); button.addEventListener('click', action); navigation.appendChild(button);
    }
    function shift(direction) {
      if (ganttScale === 'week') ganttAnchor.setUTCDate(ganttAnchor.getUTCDate() + direction * 7);
      else ganttAnchor = new Date(Date.UTC(ganttAnchor.getUTCFullYear(), ganttAnchor.getUTCMonth() + direction * (ganttScale === 'year' ? 12 : ganttScale === 'quarter' ? 3 : 1), 1));
      render();
    }
    navigateButton('‹', label('Khoảng trước', 'Previous period'), function () { shift(-1); });
    navigation.appendChild(element('b', 'project-gantt-range', dateLabel(range.start, { day: 'numeric', month: 'short', year: 'numeric' }) + ' – ' + dateLabel(new Date(range.end - dayMs), { day: 'numeric', month: 'short', year: 'numeric' })));
    navigateButton('›', label('Khoảng sau', 'Next period'), function () { shift(1); });
    navigateButton(label('Hôm nay', 'Today'), label('Về hôm nay', 'Go to today'), function () { ganttAnchor = new Date(today); render(); });
    toolbar.appendChild(navigation);
    var scales = element('div', 'project-gantt-scales'); scales.setAttribute('role', 'group'); scales.setAttribute('aria-label', label('Thang thời gian', 'Time scale'));
    [['week', 'Tuần', 'Week'], ['month', 'Tháng', 'Month'], ['quarter', 'Quý', 'Quarter'], ['year', 'Năm', 'Year']].forEach(function (scale) {
      var button = element('button', 'project-gantt-control', label(scale[1], scale[2])); button.type = 'button';
      button.dataset.scale = scale[0]; button.setAttribute('aria-pressed', String(ganttScale === scale[0]));
      button.addEventListener('click', function () { ganttScale = scale[0]; render(); }); scales.appendChild(button);
    });
    toolbar.appendChild(scales);
    var note = element('p', 'project-gantt-note', label('Các mốc lấy từ hồ sơ sản phẩm. Ngày bắt đầu, kết thúc và tiến độ chưa được cung cấp.', 'Milestones come from the product profile. Start dates, end dates and progress have not been provided.'));
    var scroller = element('div', 'project-gantt-scroll'); scroller.tabIndex = 0;
    scroller.setAttribute('role', 'region'); scroller.setAttribute('aria-label', label('Tiến độ dự án theo thời gian', 'Project timeline'));
    var table = element('table', 'project-gantt-table'); table.style.setProperty('--timeline-width', width + 'px');
    var head = element('thead'), header = element('tr');
    [label('Sản phẩm', 'Product'), label('Tiến độ', 'Progress')].forEach(function (title, index) {
      var th = element('th', index === 0 ? 'gantt-name' : 'gantt-progress', title); th.scope = 'col'; header.appendChild(th);
    });
    function track() {
      var area = element('div', 'project-gantt-track'); area.style.width = width + 'px'; area.style.setProperty('--day-width', range.unit + 'px');
      if (today >= range.start && today < range.end) {
        var line = element('span', 'project-gantt-today'); line.style.left = ((today - range.start) / dayMs * range.unit) + 'px';
        line.setAttribute('aria-hidden', 'true'); area.appendChild(line);
      }
      return area;
    }
    var timelineHead = element('th', 'gantt-timeline'); timelineHead.scope = 'col';
    var ticks = track(); ticks.classList.add('project-gantt-ticks');
    var cursor = new Date(Date.UTC(range.start.getUTCFullYear(), range.start.getUTCMonth(), 1));
    while (cursor < range.end) {
      var monthLabel = element('span', 'project-gantt-month', dateLabel(cursor, { month: 'short', year: 'numeric' }));
      monthLabel.style.left = Math.max(0, (cursor - range.start) / dayMs * range.unit) + 'px'; ticks.appendChild(monthLabel);
      cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
    }
    for (var day = 0; day < range.days; day += ganttScale === 'week' ? 1 : ganttScale === 'year' ? 30 : 7) {
      var tickDate = new Date(range.start.getTime() + day * dayMs);
      var tick = element('span', 'project-gantt-tick', dateLabel(tickDate, { day: 'numeric', month: 'numeric' }));
      tick.style.left = (day * range.unit + 4) + 'px'; ticks.appendChild(tick);
    }
    timelineHead.appendChild(ticks); header.appendChild(timelineHead); head.appendChild(header); table.appendChild(head);
    groups.forEach(function (group) {
      var items = data.filter(function (record) { return record.domain === group.key; });
      if (!items.length) return;
      var body = element('tbody'), groupRow = element('tr', 'project-gantt-group');
      var groupCell = element('th'); groupCell.colSpan = 3; groupCell.scope = 'rowgroup';
      var groupLabel = element('span', 'project-gantt-group-label');
      groupLabel.appendChild(chip({ domain: group.key })); groupLabel.appendChild(element('span', 'project-group-count', ' · ' + items.length));
      groupCell.appendChild(groupLabel); groupRow.appendChild(groupCell); body.appendChild(groupRow);
      items.forEach(function (record) {
        var row = element('tr', 'project-gantt-row');
        var name = element('td', 'gantt-name'); name.appendChild(element('span', 'code', record.code)); name.appendChild(recordButton(record)); row.appendChild(name);
        var progress = element('td', 'gantt-progress', '—'); progress.setAttribute('aria-label', label('Chưa cập nhật tiến độ', 'Progress not provided')); row.appendChild(progress);
        var timeline = element('td', 'gantt-timeline'), lane = track();
        var events = milestones[record.code] || [], inRange = events.filter(function (item) { var date = new Date(item.date + 'T00:00:00Z'); return date >= range.start && date < range.end; });
        if (!inRange.length) lane.appendChild(element('span', 'project-gantt-unscheduled', events.length ? label('Không có mốc trong khoảng này', 'No milestones in this period') : label('Chưa có lịch', 'Not scheduled')));
        inRange.forEach(function (item) {
          var date = new Date(item.date + 'T00:00:00Z'), position = (date - range.start) / dayMs * range.unit;
          var milestone = element('button', 'project-gantt-milestone'); milestone.type = 'button';
          milestone.style.left = position + 'px'; if (position > width - 150) milestone.classList.add('align-end');
          var title = item.name + ' · ' + dateLabel(date, { day: 'numeric', month: 'numeric', year: 'numeric' });
          milestone.title = title; milestone.setAttribute('aria-label', title);
          milestone.appendChild(element('span', 'project-gantt-diamond', '◆')); milestone.appendChild(element('span', 'project-gantt-event-name', item.name));
          milestone.addEventListener('click', function () { open(record); }); lane.appendChild(milestone);
        });
        timeline.appendChild(lane); row.appendChild(timeline); body.appendChild(row);
      });
      table.appendChild(body);
    });
    scroller.appendChild(table); panels.gantt.replaceChildren(toolbar, note, scroller);
  }
  function render() {
    if (view === 'current') return;
    var data = records();
    summary.textContent = data.length + label(' dự án · Nhóm theo lĩnh vực', ' projects · Grouped by domain');
    if (view === 'lark') renderLark(data);
    else if (view === 'gantt') renderGantt(data);
    scheduleStickyHeaders();
  }
  function select(next, focus) {
    if (!Object.prototype.hasOwnProperty.call(panels, next)) return;
    var restoreTabFocus = focus || tabs.contains(document.activeElement);
    view = next;
    root.dataset.projectView = view;
    buttons.forEach(function (button) {
      var selected = button.dataset.view === view;
      button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
    });
    Object.keys(panels).forEach(function (name) { panels[name].hidden = name !== view; });
    shared.hidden = view === 'current'; summary.hidden = view === 'current';
    if (view === 'current') { home.after(viewToolbar); viewToolbar.after(empty); }
    else { shared.appendChild(viewToolbar); shared.appendChild(empty); }
    render();
    if (restoreTabFocus) buttons.find(function (button) { return button.dataset.view === view; }).focus();
    try { localStorage.setItem('qk-project-view', view); } catch (error) { /* Storage may be disabled. */ }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  buttons.forEach(function (button, index) {
    button.addEventListener('click', function () { select(button.dataset.view); });
    button.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next != null) { event.preventDefault(); select(buttons[next].dataset.view, true); }
    });
  });
  [domainSelect, platformSelect, sortSelect].forEach(function (control) { control.addEventListener('change', render); });
  document.addEventListener('langchange', render);
  window.addEventListener('resize', fitLarkTable);
  window.addEventListener('resize', scheduleStickyHeaders);
  window.addEventListener('scroll', scheduleStickyHeaders, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(scheduleStickyHeaders).observe(viewToolbar);
  tabs.hidden = false;
  var saved = 'current';
  try { saved = localStorage.getItem('qk-project-view') || 'current'; } catch (error) { /* Use current view. */ }
  select(Object.prototype.hasOwnProperty.call(panels, saved) ? saved : 'current');
})();
