/* Shared behaviour for every component page. A page sets window.COMPONENT_ID and
   includes this file; nothing else differs between one component page and another. */
function componentPage() {
  return {
    id: window.COMPONENT_ID,
    spec: window.SPEC,
    copied: null,
    tab: {},                 // variant id -> 'preview' | 'code'
    width: 'full',           // 'full' | 'mobile'

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

    mode(v) { return this.tab[v.id] || 'preview'; },
    setMode(v, m) { this.tab[v.id] = m; },

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
