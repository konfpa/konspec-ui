#!/usr/bin/env node
/* Loads every page in a real browser and checks the five things that only exist
   once the page has run. tools/build.js reads the markup; this reads the result.

   The split matters, because the defects that reach users are mostly not
   visible in a class list. A hover that lands on its own surface is a string
   and build.js can see it. An htmx attribute Alpine wrote after load, an icon
   that never hydrated, a live x-trap, an sr-only span that widened the document
   to 510px — none of those are wrong in the source. They are wrong in the DOM,
   and the only way to see them is to build the DOM.

   Run: node tools/sweep.js                 every page
        node tools/sweep.js button table    named components only
        node tools/sweep.js --jobs=8        wider, if the machine has the cores

   Needs `npm install` and `npx playwright install chromium` first. That is a
   contributor's dependency, not a consumer's: nothing in this repo's output
   requires it, and `node tools/build.js` still runs on plain Node with none. */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const jobs = Number((argv.find(a => a.startsWith('--jobs=')) || '').slice(7)) || 4;
const only = argv.filter(a => !a.startsWith('-'));

const DESKTOP = { width: 1280, height: 900 };
const PHONE = { width: 390, height: 844 };

/* ── the server ────────────────────────────────────────────────────────────
   Same charset declarations as serve.py, and for the same reason: a browser
   handed text/plain with no charset falls back to windows-1252 and every em
   dash in the page becomes three characters. Node rather than a spawned Python
   so the sweep is one process to start and one to kill, and on port 0 so two
   sweeps on one machine cannot collide. */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function serve() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
    const file = path.join(root, rel || 'index.html');
    if (!file.startsWith(root)) { res.statusCode = 403; return res.end('forbidden'); }
    fs.readFile(file, (err, body) => {
      if (err) { res.statusCode = 404; return res.end('not found'); }
      res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store');
      res.end(body);
    });
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/* ── settled ───────────────────────────────────────────────────────────────
   Three things have to have happened before any check means anything, and
   `load` guarantees none of them.

   Tailwind is the browser build, so the stylesheet is compiled after the script
   runs rather than fetched, and until it lands every element on the page
   reports no outline and the focus check fails on all of them at once. The
   signal is min-h-screen resolving on the body, because it is a length: a
   colour would do as well but v4 emits oklch, and comparing computed colour
   strings across colour spaces is how this check silently never fired.

   Alpine renders the variants, so before it boots the page is a handful of
   empty <template>s.

   Lucide is deliberately not part of this, though it is the third thing to
   happen: it swaps <i data-lucide> for <svg> on a requestAnimationFrame, and an
   icon that never hydrates is one of the things this file is looking for. Wait
   for it here and that failure arrives as a 60-second timeout instead of as the
   sentence naming the icon, so it gets a short, expendable wait of its own. */
const SETTLED = `(() => {
  const painted = parseFloat(getComputedStyle(document.body).minHeight) > 0;
  const alpine = !!window.Alpine && !!document.querySelector('[x-data]')._x_dataStack;
  return painted && alpine;
})()`;

/* ── the checks ────────────────────────────────────────────────────────────
   Everything below runs inside the page, in one round trip, so a component page
   with 95 controls on it costs one evaluate rather than 95.

   Focus is the reason this file exists. build.js has a focus lint, but it reads
   class strings, and the form that hurts is the one its regex cannot see:
   has-[:focus-visible]:ring-3, where the prefix breaks the match and the ring
   it hides is a box-shadow that forced-colours mode drops entirely. Focusing
   every control and reading the outline back off the rendered box catches that
   however it was written, and does not care which element ended up carrying it.

   Which is the whole difficulty. Half the library draws focus on a WRAPPER by
   design — the input's border, fill and outline all live on the enclosure and
   the control inside is bg-transparent with outline-none, so that an icon or a
   unit sits inside the outline rather than beside it. Read the outline off the
   focused element alone and every one of those reports as broken. So the walk
   goes outwards from the control for as long as the ancestors are still
   reflecting its focus, and takes the first outline it finds.

   Then it blurs and looks again, because an ancestor that draws the same
   outline with nothing focused is not a focus indicator, it is a border that
   happens to be an outline, and every control inside one would otherwise pass
   this check for ever.

   The Tab press before it is not decoration. Chromium decides :focus-visible
   from the modality of the last interaction, so element.focus() on a page
   nobody has touched is treated as a click, no outline is drawn, and every
   control on the page reports as broken. One Tab puts the page in keyboard
   modality and the programmatic focus that follows inherits it. */
const HYDRATED = `!document.querySelector('[data-lucide]:not(svg)')`;

const AUDIT = `(() => {
  const problems = [];

  const pending = [...document.querySelectorAll('[data-lucide]:not(svg)')];
  if (pending.length)
    problems.push(pending.length + ' Lucide icon(s) never hydrated, first is "' +
      pending[0].getAttribute('data-lucide') + '" — the control it names renders empty');

  /* x-cloak inside an x-html preview is expected: Alpine does not walk markup
     it did not render, so the attribute stays and the CSS keeps the element
     hidden, which is what it is for. Anywhere else, a surviving x-cloak means
     Alpine never reached that element, and the page is showing a hole. */
  const cloaked = [...document.querySelectorAll('[x-cloak]')].filter(el => !el.closest('[x-html]'));
  if (cloaked.length)
    problems.push(cloaked.length + ' element(s) still carry x-cloak after Alpine initialised, first is <' +
      cloaked[0].tagName.toLowerCase() + ' ' + (cloaked[0].getAttribute('x-show') || cloaked[0].getAttribute('x-if') || '') + '>');

  const CONTROLS = 'a[href],button,input,select,textarea,summary,[tabindex],[contenteditable=""],[contenteditable="true"]';
  const controls = [...document.querySelectorAll(CONTROLS)].filter(el => {
    if (el.disabled) return false;
    if (el.getAttribute('tabindex') === '-1') return false;   /* not in the tab order, so not this rule's business */
    if (el.type === 'hidden') return false;
    return el.getClientRects().length > 0;                    /* a closed dialog's controls are not on screen */
  });

  const drawn = el => {
    const cs = getComputedStyle(el);
    return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 &&
           !/rgba\\(\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*0\\s*\\)/.test(cs.outlineColor);
  };

  /* the element carrying the outline for this control: itself, or the nearest
     enclosure that is still reflecting its focus */
  const owner = el => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      if (drawn(n)) return n;
      if (!n.parentElement || !n.parentElement.matches(':focus-within')) return null;
    }
    return null;
  };

  const noOutline = [];
  for (const el of controls) {
    el.focus();
    if (document.activeElement !== el) continue;              /* something else took it; not a focus-style failure */
    const box = owner(el);
    if (!box) { noOutline.push(describe(el)); continue; }
    el.blur();
    if (drawn(box)) noOutline.push(describe(el) + ' (outline is drawn unfocused too)');
  }
  if (document.activeElement) document.activeElement.blur();
  if (noOutline.length)
    problems.push(noOutline.length + ' of ' + controls.length +
      ' control(s) draw no focus outline: ' + noOutline.slice(0, 4).join('; ') +
      (noOutline.length > 4 ? '; and ' + (noOutline.length - 4) + ' more' : ''));

  function describe(el) {
    const owner = el.closest('[data-kui]');
    const label = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 30);
    return (owner ? owner.getAttribute('data-kui') + ' ' : '') + '<' + el.tagName.toLowerCase() + '>' + (label ? ' "' + label + '"' : '');
  }

  return { problems, controls: controls.length };
})()`;

/* The page may not scroll sideways, though a region may. Content inside a
   horizontal scroller is therefore not an offender however far it extends —
   the scroller is what the rule asks for — so the walk stops at the first
   ancestor that scrolls or clips, and what is left is the markup that actually
   pushed the document. sr-only is the usual culprit and is invisible by
   definition, so naming the element beats reporting a width nobody can act on. */
const WIDTH = `(() => {
  const w = document.documentElement.scrollWidth;
  if (w <= ${PHONE.width}) return null;
  const contained = el => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement)
      if (/auto|scroll|hidden/.test(getComputedStyle(p).overflowX)) return true;
    return false;
  };
  const over = [...document.querySelectorAll('body *')]
    .filter(el => el.getClientRects().length && el.getBoundingClientRect().right > ${PHONE.width} + 1)
    .filter(el => !contained(el))
    .filter(el => ![...el.children].some(c => c.getClientRects().length && c.getBoundingClientRect().right > ${PHONE.width} + 1))
    .slice(0, 3)
    .map(el => {
      const owner = el.closest('[data-kui]');
      return (owner ? owner.getAttribute('data-kui') + ' ' : '') + '<' + el.tagName.toLowerCase() + '>' +
        ' to ' + Math.round(el.getBoundingClientRect().right) + 'px';
    });
  return 'page is ' + w + 'px wide at ${PHONE.width}px' + (over.length ? ', pushed by ' + over.join(', ') : '');
})()`;

/* Whose file is this? A CDN rate-limiting one build is not a defect in the
   page, and neither is a path a snippet is demonstrating: avatar/photo points
   an <img> at /media/directory/expired-token.jpg precisely so the 404 fires and
   the onerror handler drops back to initials, which is the variant. Only paths
   this repo actually serves — the directories it has — can be its fault. */
const OWN = new Set(fs.readdirSync(root, { withFileTypes: true }).map(e => e.name));
const ours = (url, base) => {
  if (!url || !url.startsWith(base)) return false;
  return OWN.has(url.slice(base.length).replace(/^\//, '').split(/[/?#]/)[0]);
};

/* ── one page ──────────────────────────────────────────────────────────────
   Two loads rather than one resize, because half the library swaps shape at a
   breakpoint and the components that do it in Alpine read matchMedia once, in
   init(). A resized page is a desktop page that has been made narrow; a
   reloaded one is the page a phone actually gets.

   prefers-reduced-motion is on for the same reason CI is: a check that runs
   while a panel is 40% through a fade measures the fade, and does it
   differently on a loaded machine than on an idle one. */
async function sweepOne(browser, base, page, attempt = 0) {
  const problems = [];
  let controls = 0;

  for (const viewport of [DESKTOP, PHONE]) {
    const ctx = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const tab = await ctx.newPage();
    const where = viewport === PHONE ? ' at ' + PHONE.width + 'px' : '';

    tab.on('pageerror', e => problems.push('uncaught ' + (e.message || e).split('\n')[0] + where));
    tab.on('console', m => {
      if (m.type() !== 'error') return;
      if (!ours(m.location().url, base)) return;              /* the 404 console line that comes with a demonstrated one */
      problems.push('console: ' + m.text().split('\n')[0] + where);
    });
    tab.on('response', r => {
      if (r.status() >= 400 && ours(r.url(), base)) problems.push(r.status() + ' on ' + r.url().slice(base.length) + where);
    });

    try {
      await tab.goto(base + '/' + page, { waitUntil: 'load', timeout: 60000 });
      await tab.waitForFunction(SETTLED, null, { timeout: 60000, polling: 100 });
      await tab.waitForFunction(HYDRATED, null, { timeout: 5000, polling: 100 }).catch(() => {});

      if (viewport === DESKTOP) {
        await tab.keyboard.press('Tab');
        const audit = await tab.evaluate(AUDIT);
        controls = audit.controls;
        problems.push(...audit.problems);
      } else {
        const wide = await tab.evaluate(WIDTH);
        if (wide) problems.push(wide);
      }
    } catch (err) {
      await ctx.close();
      /* the CDN scripts make a first failure worth one retry; a second is real */
      if (attempt === 0) return sweepOne(browser, base, page, 1);
      return { page, controls, problems: [...problems, 'did not settle: ' + String(err.message || err).split('\n')[0] + where] };
    }
    await ctx.close();
  }
  return { page, controls, problems };
}

/* ── run ───────────────────────────────────────────────────────────────── */
(async () => {
  let pages = ['index.html', ...fs.readdirSync(path.join(root, 'components')).filter(f => f.endsWith('.html')).sort().map(f => 'components/' + f)];
  if (only.length) {
    pages = pages.filter(p => only.includes(path.basename(p, '.html')));
    if (!pages.length) { console.error('no page matches ' + only.join(', ')); process.exit(1); }
  }

  const server = await serve();
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();

  const queue = pages.slice();
  const results = [];
  let done = 0;
  const tty = process.stdout.isTTY;

  await Promise.all(Array.from({ length: Math.min(jobs, queue.length) }, async () => {
    while (queue.length) {
      const page = queue.shift();
      results.push(await sweepOne(browser, base, page));
      done++;
      if (tty) process.stdout.write('\rswept ' + done + '/' + pages.length + '   ');
    }
  }));
  if (tty) process.stdout.write('\r');

  await browser.close();
  server.close();

  results.sort((a, b) => a.page.localeCompare(b.page));
  const failed = results.filter(r => r.problems.length);
  const controls = results.reduce((n, r) => n + r.controls, 0);

  if (failed.length) {
    console.error('SWEEP failed — ' + failed.reduce((n, r) => n + r.problems.length, 0) +
      ' problem(s) on ' + failed.length + ' of ' + results.length + ' page(s):');
    for (const r of failed) for (const p of [...new Set(r.problems)]) console.error('  ' + path.basename(r.page, '.html') + ': ' + p);
    process.exitCode = 1;
    return;
  }

  console.log('pages swept : ' + results.length);
  console.log('controls    : ' + controls + ', every one drawing a focus outline');
  console.log('widths      : nothing wider than ' + PHONE.width + 'px');
  console.log('icons       : every data-lucide hydrated, nothing left cloaked');
  console.log('console     : clean');
})();
