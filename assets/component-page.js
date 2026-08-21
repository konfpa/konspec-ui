/* Shared behaviour for every component page. A page sets window.COMPONENT_ID and
   includes this file; nothing else differs between one component page and another. */
function componentPage() {
  return {
    id: window.COMPONENT_ID,
    spec: window.SPEC,
    copied: null,
    tab: {},                 // variant id -> 'preview' | 'code'
    width: 'full',           // 'full' | 'mobile'
    surfaceChoice: null,     // null = follow the category, else 'white' | 'page'

    /* Which background a preview sits on, by category, because a component
       demoed on the wrong surface is a lie about where it lives. A card, a
       table, an alert and a page shell all sit on the zinc-100 page; a field, a
       button and a tab row sit on a white surface inside it. Getting this wrong
       is not cosmetic: a zinc-100 pill track on a zinc-100 panel measures 1.00
       against its background, which is not faint but identical, and the control
       vanishes. The toggle is there so both can be checked on purpose. */
    surfaceByCategory: { data: 'page', feedback: 'page', layout: 'page' },
    get surface() {
      return this.surfaceChoice || this.surfaceByCategory[this.c.category] || 'white';
    },
    get previewBg() { return this.surface === 'page' ? 'bg-zinc-100' : 'bg-white'; },

    get c() { return window.REGISTRY.components.find(x => x.id === this.id); },
    get category() { return this.spec.categories.find(k => k.id === this.c.category); },
    get siblings() { return window.REGISTRY.components.filter(x => x.category === this.c.category); },
    get relatedComponents() {
      const index = window.INDEX || [];
      return (this.c.related || [])
        .map(rid => window.REGISTRY.components.find(x => x.id === rid))
        .filter(Boolean)
        .map(r => ({ ...r, href: (index.find(i => i.id === r.id) || {}).page ? r.id + '.html' : null }));
    },

    mode(v) { return this.tab[v.id] || (v.id === 'django' || v.id === 'setup' ? 'code' : 'preview'); },
    setMode(v, m) { this.tab[v.id] = m; },

    /* Undo the preview boxing on the root element only, so the markup gets a
       real viewport instead of a card. Every later class="" in the snippet is
       left alone; only the first one is the wrapper. */
    fullPageCode(code) {
      return code.replace(/class="([^"]*)"/, (m, cls) => 'class="' + cls
        .replace(/\bmin-h-\[\d+px\]/g, 'min-h-screen')
        .replace(/\bh-\[\d+px\]/g, 'h-screen')
        .replace(/\brounded-xl\b/g, '')
        .replace(/\bborder border-zinc-200\b/g, '')
        .replace(/\s+/g, ' ').trim() + '"');
    },

    /* Opened as a blob rather than a written file: the page has no build step,
       and the document is the same one the 390px frame uses, so the two can
       never drift into showing different things. */
    openFullPage(v) {
      const html = this.previewDoc(this.fullPageCode(v.code));
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    },
    /* The standalone document a preview runs in. Shared by the 390px frame and
       by the full-page view so the two can never render different things. */
    previewDoc(code) {
      const abs = p => new URL(p, document.baseURI).href;
      const theme = document.querySelector('style[type="text/tailwindcss"]');
      /* A frame is a whole document, so it does not inherit the page's Chart.js
         or its defaults. Copy both in, but only for a variant that draws, so
         nothing else pays for a library it never calls. */
      const defaults = document.getElementById('chart-defaults');
      const chartDefaults = defaults ? '<script>' + defaults.textContent + '<\/script>' : '';
      return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="${abs('../assets/fonts.css')}">
<script src="https://unpkg.com/@tailwindcss/browser@4"></script>
<style type="text/tailwindcss">${theme ? theme.textContent : ''}</style>
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/focus@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
${/<canvas/.test(code) ? '<script src="https://unpkg.com/chart.js@4.4.7/dist/chart.umd.js"><\/script>' + chartDefaults : ''}
</head>
<body class="${this.previewBg} font-sans text-[14px]/5 text-zinc-900 antialiased">
${code}
<script>
(function () {
  let queued = false;
  const draw = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (window.lucide && document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
    });
  };
  document.addEventListener('DOMContentLoaded', draw);
  document.addEventListener('alpine:initialized', () => {
    draw();
    new MutationObserver(draw).observe(document.body, { childList: true, subtree: true });
  });
})();
</script>
</body></html>`;
    },

    /* Renders one variant inside a 390px-wide iframe.
       Clamping a wrapper to 390px is not a mobile preview: Tailwind's sm:/md:/lg:
       variants are viewport media queries, so a narrowed wrapper still got the
       desktop layout - a grid where the markup asks for a scrolling strip. An
       iframe is the only element that gives the markup a viewport of its own. */
    frame(el, code) {
      el.srcdoc = this.previewDoc(code);

      el.addEventListener('load', () => {
        const win = el.contentWindow, body = win.document.body;
        const fit = () => { el.style.height = Math.ceil(body.getBoundingClientRect().height) + 'px'; };
        fit();
        new win.ResizeObserver(fit).observe(body);
        win.addEventListener('resize', fit);
        /* Tailwind's browser build compiles after load; nothing resizes the body
           when the sheet lands, so measure again once it has. */
        [60, 300, 900].forEach(t => win.setTimeout(fit, t));
      }, { once: true });
    },

    async copy(text, key) {
      try { await navigator.clipboard.writeText(text); }
      catch (e) {
        const t = document.createElement('textarea');
        t.value = text; document.body.appendChild(t); t.select();
        document.execCommand('copy'); t.remove();
      }
      this.copied = key;
      setTimeout(() => { if (this.copied === key) this.copied = null; }, 1800);
    },

    /* the whole component as markdown — description, rules, behaviour, a11y, markup */
    forAgent() {
      const c = this.c, L = [];
      L.push('## ' + c.name + '  `' + c.id + '`', '', c.description, '', '**When to use:** ' + c.when);
      if (c.notes && c.notes.length) { L.push('', '**Rules**'); c.notes.forEach(n => L.push('- ' + n)); }
      if (c.behaviour && c.behaviour.length) { L.push('', '**Behaviour**'); c.behaviour.forEach(n => L.push('- ' + n)); }
      if (c.a11y && c.a11y.length) { L.push('', '**Accessibility**'); c.a11y.forEach(n => L.push('- ' + n)); }
      c.variants.forEach(v => L.push('', '### ' + v.name + ' (`' + v.id + '`)', '', '```html', v.code, '```'));
      return L.join('\n');
    }
  };
}

/* Lucide hydration.
   createIcons() leaves data-lucide on the <svg> it produces, so a naive
   "re-run on every mutation" observer re-renders every icon forever and the
   DOM never settles — which stutters any animation running at the time.
   Guard on there being an un-hydrated element, and the loop terminates. */
(function () {
  let queued = false;
  const pending = () => document.querySelector('[data-lucide]:not(svg)');
  const draw = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (window.lucide && pending()) lucide.createIcons();
    });
  };
  document.addEventListener('DOMContentLoaded', draw);
  document.addEventListener('alpine:initialized', () => {
    draw();
    new MutationObserver(draw).observe(document.body, { childList: true, subtree: true });
  });
})();
