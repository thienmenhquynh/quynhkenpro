// Rebuild all CVs with: node docs/cv/generate.mjs
// Requires Node 22+ and Chromium. Set CHROMIUM to override the executable.
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { rm, stat } from 'node:fs/promises';
import { once } from 'node:events';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { en, vi, profiles } from './content.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const inline = (path, type) => 'data:' + type + ';base64,' + readFileSync(join(root, path)).toString('base64');
const portrait = inline('assets/avatar-square.jpg', 'image/jpeg');
const fonts = read('assets/fonts.css').replace(/url\('\.\/([^']+)'\)/g,
  (_, path) => `url('${inline('assets/' + path, 'font/woff2')}')`);
const stylesheet = fonts + read('assets/design-system.css') + read('docs/cv/print.css');
const site = 'https://quynhken.pro';
const email = 'quynhkencv@gmail.com';
const esc = value => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const link = (label, url) => `<a href="${esc(url)}">${esc(label)}</a>`;

function sidebar(locale, profile, secondPage) {
  const labels = locale.labels;
  const part = (title, body) => `<section class="side-section"><h2>${esc(title)}</h2>${body}</section>`;
  const items = entries => '<dl>' + entries.map(([title, body]) =>
    `<div class="side-item"><dt>${esc(title)}</dt><dd>${esc(body)}</dd></div>`).join('') + '</dl>';
  const contact = part(labels.contact, `<address class="contact-list">
    ${link(locale.phone, 'tel:+84356461831')}
    ${link(email, 'mailto:' + email)}
    ${link('LinkedIn · quynh-ken', 'https://www.linkedin.com/in/quynh-ken')}
    ${link('Behance · kenquynh1', 'https://www.behance.net/kenquynh1')}
    ${link('quynhken.pro' + profile.path.split('?')[0].replace(/\/$/, ''), site + profile.path)}
    <span>${esc(locale.city)}</span>
  </address>`);

  if (secondPage) {
    return '<aside class="sidebar">' +
      part(labels.education, items(locale.education)) +
      part(labels.languages, items(locale.languages)) +
      part(labels.extra, items(locale.extra)) +
      part(labels.tools, '<p>' + esc(profile.tools) + '</p>') + '</aside>';
  }
  return `<aside class="sidebar">
    <img class="portrait" src="${portrait}" alt="">
    ${contact}${part(labels.skills, items(profile.skills))}
  </aside>`;
}

function entry({ title, date, link: href, detail, body, result }) {
  const meta = date || detail ? esc(date || detail) : href ? link(...href) : '';
  return `<article class="entry">
    <div class="entry-meta"><h3>${esc(title)}</h3>${meta ? '<p>' + meta + '</p>' : ''}</div>
    <p class="entry-body">${esc(body)}</p>
    ${result ? '<p class="entry-result">' + esc(result) + '</p>' : ''}
  </article>`;
}

const entries = data => data.map(entry).join('');
const section = (title, body) => `<section class="cv-section"><h2>${esc(title)}</h2>${body}</section>`;
const cards = data => '<div class="cards">' + entries(data) + '</div>';

function content(locale, profile) {
  const labels = locale.labels;
  const products = Object.values(locale.products);
  const productCards = profile.type === 'design' ? cards(products) : entries(products);
  const leadership = section(labels.leadership, '<ul class="notes">' +
    (profile.leadership || locale.leadership).map(note => '<li>' + esc(note) + '</li>').join('') + '</ul>');
  const previous = section(labels.previous, entries(locale.history));
  const current = entry({
    title: profile.type === 'design' ? 'NetSpace · Product Manager · Product Design' : 'NetSpace · Product Manager',
    date: locale.present,
    body: profile.current,
  });
  const intro = `<header class="hero">
    <h1>${esc(locale.name)}</h1><p class="alias">${esc(locale.alias)}</p>
    <p class="role">${esc(profile.role)}</p><p class="summary">${esc(profile.summary)}</p>
    <div class="metrics">${profile.stats.map(([number, label]) =>
      `<div class="metric"><strong>${esc(number)}</strong>${esc(label)}</div>`).join('')}</div>
  </header>`;
  const currentSection = section(labels.experience, current);
  const portfolio = section(labels.portfolio, productCards);
  const design = profile.type === 'design';
  const pageOne = intro + currentSection + (design ? previous + leadership : portfolio);
  const pageTwo = design
    ? section(labels.selectedDesign, cards(profile.cases)) + portfolio + section('Cách tôi làm việc', '<p>' + esc(profile.process) + '</p>')
    : (profile.type === 'ai' ? section(labels.method, entries(locale.aiMethod)) : '') +
      leadership + (profile.type === 'product' ? section(labels.domains, cards(locale.domains.map(([title, body]) => ({title, body})))) : '') + previous;
  return [pageOne, pageTwo];
}

function document(profile) {
  const locale = profile.lang === 'en' ? en : vi;
  const sheets = content(locale, profile).map((body, i) => `<div class="sheet">
    <main class="document">
      ${i ? '<p class="page-role">' + esc(locale.name + ' · ' + profile.role) + '</p>' : ''}
      ${body}
    </main>
    ${sidebar(locale, profile, i > 0)}
    <footer class="cv-footer">${link('quynhken.pro' + profile.path.split('?')[0].replace(/\/$/, ''), site + profile.path)}
      <span>${i + 1} / 2</span></footer>
  </div>`).join('');
  return `<!doctype html><html lang="${profile.lang}"><head>
    <meta charset="utf-8">
    <title>CV · ${esc(locale.name)} · ${esc(profile.role)}</title>
    <style>${stylesheet}</style>
    </head><body>${sheets}</body></html>`;
}

function connect(socket) {
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', ({data}) => {
    const message = JSON.parse(data);
    const task = pending.get(message.id);
    if (!task) return;
    pending.delete(message.id);
    if (message.error) task.reject(new Error(message.error.message));
    else task.resolve(message.result);
  });
  return (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, {resolve, reject});
    socket.send(JSON.stringify({id, method, params}));
  });
}

async function print(html, debuggerUrl) {
  const tab = await fetch(debuggerUrl + '/json/new?about:blank', {method:'PUT'}).then(response => response.json());
  const socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, {once:true});
    socket.addEventListener('error', reject, {once:true});
  });
  const command = connect(socket);
  try {
    const {frameTree} = await command('Page.getFrameTree');
    await command('Page.setDocumentContent', {frameId:frameTree.frame.id, html});
    await command('Runtime.evaluate', {expression:'document.fonts.ready', awaitPromise:true});
    const pdf = await command('Page.printToPDF', {printBackground:true, preferCSSPageSize:true});
    return Buffer.from(pdf.data, 'base64');
  } finally {
    socket.close();
    await fetch(debuggerUrl + '/json/close/' + tab.id);
  }
}

const scratch = mkdtempSync(join(tmpdir(), 'quynh-cv-'));
const profileDir = join(scratch, 'chrome');
const browser = spawn(process.env.CHROMIUM || 'chromium', [
  '--headless', '--disable-dev-shm-usage', '--disable-background-networking',
  ...(process.env.CV_DISABLE_CHROMIUM_SANDBOX === '1' ? ['--no-sandbox'] : []),
  '--remote-debugging-port=0', '--user-data-dir=' + profileDir,
], {stdio:'ignore'});
const exited = once(browser, 'exit');
exited.catch(() => {});
try {
  const portFile = join(profileDir, 'DevToolsActivePort');
  for (let attempt = 0; !await stat(portFile).catch(() => null); attempt++) {
    if (attempt === 80 || browser.exitCode !== null) throw new Error('Chromium could not start for PDF export.');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const debuggerUrl = 'http://127.0.0.1:' + readFileSync(portFile, 'utf8').split('\n')[0];
  const chosen = process.argv.slice(2);
  const selected = chosen.length ? profiles.filter(profile => chosen.includes(profile.file)) : profiles;
  if (!selected.length) throw new Error('Specify an existing CV filename or omit arguments to regenerate all four.');
  for (const profile of selected) {
    writeFileSync(join(root, 'assets', profile.file), await print(document(profile), debuggerUrl));
    console.log(profile.file);
  }
} finally {
  browser.kill();
  await exited.catch(() => {});
  await rm(scratch, {recursive:true, force:true, maxRetries:3, retryDelay:150});
}
