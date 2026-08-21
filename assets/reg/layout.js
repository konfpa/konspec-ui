register(
  {
    id: 'app-shell', name: 'App shell', category: 'layout',
    description: 'The page skeleton: an icon rail that expands to a labelled sidebar, a topbar carrying the hamburger, breadcrumb, command palette and account menu, and a single scrolling main column. Everything else in the app renders inside the main column.',
    when: 'Every signed-in page. Auth and error pages are the only screens that do not use it.',
    notes: [
      'Nothing inside the sidebar changes class when the rail narrows. Each row is a fixed 32px icon box at a fixed offset followed by a label the row clips, so collapsing is a width transition and nothing else. Switching rows to lg:justify-center lg:px-0 on collapse — the obvious way to write it — relays out every row on the first frame while the sidebar is still 256px wide, and the create button visibly flashes full width before it shrinks.',
      'The geometry is what makes that work: the nav container is px-3 and every row is px-1.5, so a 32px icon box starts at 18px and centres at 34px — the centre of the 68px rail. The icon lands in the same place expanded and collapsed without a single conditional class.',
      'One hamburger does both jobs. Below lg it opens the off-canvas sheet; above lg it collapses the rail. It is never hidden, and its accessible name and aria-expanded follow whichever job it is currently doing, which is why the breakpoint is tracked in state via matchMedia rather than assumed.',
      'Labels and counts fade with opacity, never with lg:hidden. Opacity does not affect layout, so the fade runs alongside the width transition instead of snapping the row before it.',
      'The off-canvas transform is scoped with max-lg:, not cancelled with lg:translate-x-0. Both work, but the cancelling form depends on Tailwind emitting the lg variant after the unvariant class, so it fails silently and completely the moment the class string is rewritten and the cancel is dropped — the sidebar slides off the desktop while lg:static still reserves its column, which looks like the sidebar vanishing rather than like a transform. Scoped, the transform cannot reach the desktop at all.',
      'The mobile sheet is full-bleed below sm and a 288px drawer above it, and sidebar\'s off-canvas variant and topbar\'s trigger variant carry the same two widths. A shell that answered this differently from the sidebar component would leave the framework contradicting itself at the one width where the answer matters most.',
      'The server clock seeds from a timestamp the server rendered and ticks from that seed, never from new Date(). It exists to show the clock a posting date and a period cut-off are judged against, and a row that quietly displays the workstation\'s clock instead is worse than no row at all — it is confidently wrong on exactly the machine whose time was set incorrectly. Reseed it from an X-Server-Time header on htmx swaps so a tab left open overnight cannot drift.',
      'The rail tooltip is one shared element positioned from the hovered row\'s own rect, not a tooltip inside each row. Rows clip their labels and the nav is a scroll container, so a tooltip rendered inside a row is clipped twice over and never appears. It is fixed-positioned outside the sidebar, and the sidebar is the only ancestor with a transform, which is what keeps fixed meaning fixed.',
      'Rail tooltips fire on focus as well as hover. A collapsed rail is a column of icons, and a label that only a mouse can reach is not a label.',
      'The topbar search is the command palette trigger, not a second search. One search on the page means ⌘K and the click reach the same thing.',
      'Rotation and other bindings go on a wrapping <span>, never on <i data-lucide>. Lucide replaces the <i> with an <svg> and any binding on it dies.',
      'Sidebar state persists under the localStorage key kon-sidebar. The [ shortcut drives the same toggle() as the hamburger and is ignored while focus is in an input, textarea or select.',
      'Only the <main> scrolls. The shell root is h-[720px] here so it previews in a box — as a real page put h-screen overflow-hidden on <body> and drop the wrapper border.',
      'x-cloak on the sidebar, or it renders at its expanded width for one frame before Alpine reads kon-sidebar and the rail jumps shut on every load.'
    ],
    anatomy: [
      ['Icon rail', 'The 68px column the sidebar collapses to. Always visible above lg; it is the sidebar, narrowed, not a separate component.'],
      ['Sidebar', '256px expanded on the desktop. Below lg it leaves the flow: a full-bleed sheet under sm, a 288px drawer between sm and lg.'],
      ['Rail tooltip', 'One shared element, shown on hover and on focus while the rail is collapsed, carrying the label the row is clipping.'],
      ['Hamburger', 'In the topbar. Opens the off-canvas sheet below lg, collapses the rail above it. Never hidden.'],
      ['Breadcrumb', 'In the topbar, left of the search. The trail to the current page, with the leaf carrying aria-current.'],
      ['Command palette', 'The topbar search field is its trigger and shows the ⌘K hint on its face.'],
      ['Account menu', 'The avatar opens a real menu carrying the signed-in identity, settings and Sign out.'],
      ['Server clock', 'The foot of the sidebar. The server\'s date and time, on the same icon-box geometry as every nav row, so it collapses to a clock icon in the rail rather than to an empty strip.'],
      ['Main', 'The single scrolling column. Everything else in the application renders inside it.'],
      ['Backdrop', 'Between sm and lg only. Below sm the sheet covers the page, so there is nothing left to dim and it is hidden rather than drawn under an opaque sheet.']
    ],
    behaviour: [
      'Only <main> scrolls. The shell itself is a fixed-height flex frame, so the rail and topbar never move.',
      'Collapsing animates width alone. No row changes its padding, its justification or its display, so nothing reflows mid-transition.',
      'The hamburger toggles the rail above lg and the off-canvas sheet below it, and reports the state of whichever it is driving.',
      'Sidebar state persists under kon-sidebar, so it survives a reload.',
      '[ toggles the sidebar, and is ignored while focus is in an input, textarea or select.',
      '⌘K and Ctrl+K open the command palette from anywhere; Escape closes it and returns focus where it came from.',
      'Crossing the lg breakpoint closes the off-canvas sheet, so the page never lands wide with a mobile drawer still open.',
      'Below sm the sheet is full-bleed and no backdrop remains to tap, so the close button and Escape are the only ways out. Between sm and lg it is a 288px drawer over a backdrop that still dismisses on tap.'
    ],
    a11y: [
      'A skip link to <main> comes first in the DOM, so the keyboard is not walked through the whole nav on every page.',
      'The sidebar is a <nav> with an accessible name, so it can be skipped as a landmark.',
      'The hamburger is a real button whose aria-expanded and aria-label describe the job it is doing at the current width, not a fixed label that is wrong half the time.',
      'Collapsed labels are clipped, not removed, so the DOM and the tab order do not change shape and every rail item keeps its accessible name.',
      'The palette is a combobox: focus stays in the input and the highlight is carried by aria-activedescendant. The account menu is a menu: real focus moves between its items.',
      'The off-canvas sidebar is a real dialog while it is open below lg. x-trap.noscroll holds focus inside it and returns it to the hamburger on close, and role=dialog with aria-modal is bound rather than static, so the same element is a plain nav landmark on the desktop where it is not modal and must not claim to be.',
      'Below sm the close button is the only pointer route out, so it is a 36px target rather than an icon with padding around it.'
    ],
    related: ['sidebar', 'topbar', 'command-palette', 'dropdown', 'page-header'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div class="relative flex h-[720px] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 text-[14px]/5 text-zinc-900"
     x-data="{
       sidebar: true, nav: false, wide: false,
       init() {
         this.sidebar = localStorage.getItem('kon-sidebar') !== '0';
         const mq = window.matchMedia('(min-width: 1024px)');
         this.wide = mq.matches;
         mq.addEventListener('change', e => { this.wide = e.matches; if (e.matches) this.nav = false });
         this.$watch('sidebar', v => localStorage.setItem('kon-sidebar', v ? '1' : '0'));
       },
       toggle() { this.wide ? this.sidebar = !this.sidebar : this.nav = !this.nav },
       // one shared tooltip, positioned from the row's own rect. The rail clips
       // its labels and the nav is a scroll container, so a tooltip rendered
       // inside a row is clipped by both — this one lives outside the sidebar.
       tip: '', tipX: 0, tipY: 0, tipOn: false,
       showTip(el, label) {
         if (this.sidebar || !this.wide) return;
         const r = el.getBoundingClientRect();
         // anchor to the rail's edge, not the row's, so the gap does not depend
         // on the row's own padding
         this.tip = label; this.tipX = this.$refs.rail.getBoundingClientRect().right + 8;
         this.tipY = r.top + r.height / 2;
         this.tipOn = true;
       },
       hideTip() { this.tipOn = false }
     }"
     @keydown.escape.window="nav = false"
     @keydown.window="if ($event.key === '[' && !/^(input|textarea|select)$/i.test($event.target.tagName)) toggle()">

  <a href="#kon-main" class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-60 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-[13px]/5 focus:font-medium focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">Skip to content</a>

  <!-- ── sidebar ──────────────────────────────────────────────────────────
       Nothing inside here changes class when the rail narrows. Every row is
       a fixed 32px icon box at a fixed offset followed by a label that the
       row's own overflow-hidden clips, so collapsing is a width transition
       and nothing else. Switching a row to justify-center and px-0 on
       collapse — the obvious way to write this — relays out the row on the
       first frame while the sidebar is still 256px wide, which is why the
       create button used to flash full width before it shrank. -->
  <aside x-cloak x-ref="rail"
         aria-label="Sections"
         x-trap.noscroll="!wide && nav"
         :role="wide ? null : 'dialog'"
         :aria-modal="!wide && nav ? 'true' : null"
         class="absolute inset-y-0 left-0 z-40 flex w-full shrink-0 sm:w-72 flex-col overflow-hidden border-r border-zinc-200 bg-white shadow-lg transition-[width,transform] duration-200 ease-out lg:static lg:shadow-none"
         :class="[ sidebar ? 'lg:w-64' : 'lg:w-[68px]', nav ? 'translate-x-0' : 'max-lg:-translate-x-full' ]">

    <div class="flex h-14 shrink-0 items-center gap-2.5 overflow-hidden px-3">
      <span class="flex w-8 shrink-0 items-center justify-center">
        <span class="flex size-8 items-center justify-center rounded-lg bg-zinc-700 text-[13px]/5 font-semibold text-white">K</span>
      </span>
      <span class="min-w-0 flex-1 truncate text-[16px]/6 font-semibold transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Konspec Operations</span>
      <button type="button" @click="nav = false" aria-label="Close navigation"
              class="-mr-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 lg:hidden">
        <i data-lucide="x" class="size-5"></i>
      </button>
    </div>

    <div class="px-3 pb-3">
      <button @mouseenter="showTip($el, 'New purchase order')" @mouseleave="hideTip()" @focus="showTip($el, 'New purchase order')" @blur="hideTip()" type="button"
              class="flex h-10 w-full items-center gap-2.5 overflow-hidden rounded-lg bg-zinc-700 px-1.5 text-[13px]/5 font-medium whitespace-nowrap text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="plus" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate text-left transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">New purchase order</span>
      </button>
    </div>

    <nav aria-label="Procurement" class="min-h-0 flex-1 space-y-0.5 overflow-x-hidden overflow-y-auto px-3 pb-3">
      <p class="overflow-hidden px-1.5 pt-2 pb-1 text-[11px]/4 font-semibold tracking-wider whitespace-nowrap text-zinc-500 uppercase transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Procurement</p>

      <a @mouseenter="showTip($el, 'Overview')" @mouseleave="hideTip()" @focus="showTip($el, 'Overview')" @blur="hideTip()" href="#" aria-current="page"
         class="flex h-9 items-center gap-2.5 overflow-hidden rounded-lg bg-zinc-100 px-1.5 text-[13px]/5 font-medium whitespace-nowrap text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="layout-dashboard" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Overview</span>
      </a>
      <a @mouseenter="showTip($el, 'Purchase orders')" @mouseleave="hideTip()" @focus="showTip($el, 'Purchase orders')" @blur="hideTip()" href="#"
         class="flex h-9 items-center gap-2.5 overflow-hidden rounded-lg px-1.5 text-[13px]/5 whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="file-text" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Purchase orders</span>
        <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300 transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">148</span>
      </a>
      <a @mouseenter="showTip($el, 'Requisitions')" @mouseleave="hideTip()" @focus="showTip($el, 'Requisitions')" @blur="hideTip()" href="#"
         class="flex h-9 items-center gap-2.5 overflow-hidden rounded-lg px-1.5 text-[13px]/5 whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="clipboard-list" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Requisitions</span>
        <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300 transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">62</span>
      </a>
      <a @mouseenter="showTip($el, 'Goods receipt')" @mouseleave="hideTip()" @focus="showTip($el, 'Goods receipt')" @blur="hideTip()" href="#"
         class="flex h-9 items-center gap-2.5 overflow-hidden rounded-lg px-1.5 text-[13px]/5 whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="truck" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Goods receipt</span>
        <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300 transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">27</span>
      </a>
      <a @mouseenter="showTip($el, 'Approvals')" @mouseleave="hideTip()" @focus="showTip($el, 'Approvals')" @blur="hideTip()" href="#"
         class="flex h-9 items-center gap-2.5 overflow-hidden rounded-lg px-1.5 text-[13px]/5 whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="check-square" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Approvals</span>
        <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300 transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">4</span>
      </a>

      <p class="overflow-hidden px-1.5 pt-4 pb-1 text-[11px]/4 font-semibold tracking-wider whitespace-nowrap text-zinc-500 uppercase transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Master data</p>

      <a @mouseenter="showTip($el, 'Vendors')" @mouseleave="hideTip()" @focus="showTip($el, 'Vendors')" @blur="hideTip()" href="#"
         class="flex h-9 items-center gap-2.5 overflow-hidden rounded-lg px-1.5 text-[13px]/5 whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="building-2" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Vendors</span>
        <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300 transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">187</span>
      </a>
      <a @mouseenter="showTip($el, 'Materials')" @mouseleave="hideTip()" @focus="showTip($el, 'Materials')" @blur="hideTip()" href="#"
         class="flex h-9 items-center gap-2.5 overflow-hidden rounded-lg px-1.5 text-[13px]/5 whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="package" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Materials</span>
      </a>
      <a @mouseenter="showTip($el, 'Rate contracts')" @mouseleave="hideTip()" @focus="showTip($el, 'Rate contracts')" @blur="hideTip()" href="#"
         class="flex h-9 items-center gap-2.5 overflow-hidden rounded-lg px-1.5 text-[13px]/5 whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="scale" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">Rate contracts</span>
      </a>
    </nav>

    <!-- Server clock. It seeds from a timestamp the server rendered and ticks
         from that, never from new Date() — the point of the row is the clock
         the posting date and the period cut-off are judged against, and the
         browser's clock is the one thing that must not decide it. Replace the
         seed with the server's own ISO stamp: Django {{ now|date:"c" }}.
         Reseed it on htmx swaps so a tab left open overnight cannot drift. -->
    <div class="shrink-0 overflow-hidden border-t border-zinc-200 px-3 py-2"
         x-data="{
           t: new Date('2026-08-21T14:35:09+05:30'),
           timer: null,
           init() { this.timer = setInterval(() => this.t = new Date(this.t.getTime() + 1000), 1000) },
           destroy() { clearInterval(this.timer) },
           seed(iso) { this.t = new Date(iso) },
           get day() { return this.t.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }) },
           get clock() { return this.t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
         }"
         @htmx:after-swap.camel.window="if ($event.detail.xhr) { const h = $event.detail.xhr.getResponseHeader('X-Server-Time'); if (h) seed(h) }">
      <div @mouseenter="showTip($el, 'Server time')" @mouseleave="hideTip()"
           class="flex items-center gap-2.5 overflow-hidden rounded-lg px-1.5 py-1 whitespace-nowrap">
        <span class="flex w-8 shrink-0 items-center justify-center"><i data-lucide="clock" class="size-[18px] text-zinc-500"></i></span>
        <span class="min-w-0 flex-1 transition-opacity duration-150" :class="!sidebar && 'lg:opacity-0'">
          <span class="block truncate text-[12px]/4 tabular-nums text-zinc-600"><span x-text="day"></span> · <span x-text="clock"></span></span>
          <span class="block truncate text-[11px]/4 text-zinc-500">Server time</span>
        </span>
      </div>
    </div>
  </aside>

  <div x-show="tipOn" x-cloak aria-hidden="true"
       :style="'left:' + tipX + 'px; top:' + tipY + 'px'"
       class="pointer-events-none fixed z-50 -translate-y-1/2 rounded-md bg-zinc-900 px-2 py-1 text-[11px]/4 whitespace-nowrap text-white"
       x-text="tip"></div>

  <div x-show="nav" x-cloak @click="nav = false" class="absolute inset-0 z-30 hidden bg-zinc-900/40 sm:block lg:hidden"></div>

  <!-- ── main column ──────────────────────────────────────────────────── -->
  <div class="flex min-w-0 flex-1 flex-col">
    <header class="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-3 lg:gap-3 lg:px-5">

      <!-- one control, two jobs: it opens the off-canvas sheet below lg and
           collapses the rail above it, which is why it is never hidden -->
      <button type="button" @click="toggle()" x-ref="ham"
              :aria-expanded="wide ? sidebar : nav"
              aria-controls="kon-sidebar"
              :aria-label="wide ? (sidebar ? 'Collapse sidebar' : 'Expand sidebar') : 'Open navigation'"
              :title="wide ? 'Collapse sidebar  [' : 'Open navigation  ['"
              class="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="menu" class="size-5"></i>
      </button>

      <nav aria-label="Breadcrumb" class="hidden min-w-0 items-center gap-1.5 text-[13px]/5 text-zinc-600 sm:flex">
        <a href="#" class="truncate hover:text-zinc-900">Procurement</a>
        <span aria-hidden="true" class="text-zinc-400">/</span>
        <span class="truncate font-medium text-zinc-900" aria-current="page">Overview</span>
      </nav>

      <div class="ml-auto flex items-center gap-1.5 lg:gap-2">

        <!-- command palette — the topbar search is the palette's trigger, so
             there is one search on the page and ⌘K and the click reach it -->
        <div x-data="{
               open: false, q: '', ai: 0,
               groups: [
                 { name: 'Actions', items: [
                   { id: 'new-po',    label: 'New purchase order', icon: 'plus',          key: 'N' },
                   { id: 'post-grn',  label: 'Post goods receipt', icon: 'package-check', key: 'G' },
                   { id: 'approvals', label: 'Go to my approvals', icon: 'check-check',   key: 'A' }
                 ] },
                 { name: 'Recent records', items: [
                   { id: 'po-0451', label: 'PO-2026-0451 — Sudarshan Chemicals', sub: 'Methyl ethyl ketone · 4 lines', icon: 'file-text', amount: '₹18,42,000' },
                   { id: 'po-0431', label: 'PO-2026-0431 — Privi Speciality', sub: 'Isopropyl alcohol', flag: 'overdue 6 days', icon: 'file-text', amount: '₹6,48,900' },
                   { id: 'ven-aarti', label: 'Aarti Industries', sub: 'Vendor · rate contract to 31 March 2027', icon: 'building-2' }
                 ] }
               ],
               match(g) {
                 const s = this.q.trim().toLowerCase();
                 if (!s) return g.items;
                 return g.items.filter(o => (o.label + ' ' + (o.sub || '') + ' ' + (o.flag || '') + ' ' + g.name).toLowerCase().includes(s));
               },
               get list() { return this.groups.flatMap(g => this.match(g)); },
               rowId(o) { return 'cp-' + o.id; },
               get activeId() { return this.open && this.list[this.ai] ? this.rowId(this.list[this.ai]) : null; },
               scroll() { this.$nextTick(() => { const el = document.getElementById(this.activeId); if (el) el.scrollIntoView({ block: 'nearest' }); }); },
               show() { this.open = true; this.q = ''; this.ai = 0; },
               hide() { this.open = false; this.q = ''; this.ai = 0; },
               move(n) {
                 if (!this.list.length) return;
                 this.ai = Math.min(this.list.length - 1, Math.max(0, this.ai + n));
                 this.scroll();
               },
               pick(o) { this.hide(); },
               commit() { const o = this.list[this.ai]; if (o) this.pick(o); }
             }"
             @keydown.window.meta.k.prevent="show()"
             @keydown.window.ctrl.k.prevent="show()"
             @keydown.escape.window="hide()">

          <button type="button" @click="show()" aria-label="Search Konspec Operations"
                  class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-[13px]/5 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:w-56 md:px-3 xl:w-72">
            <i data-lucide="search" class="size-4 shrink-0 text-zinc-600"></i>
            <span class="hidden flex-1 text-left md:block">Search or jump to</span>
            <kbd class="hidden rounded border border-zinc-200 px-1.5 text-[11px]/4 md:block">⌘K</kbd>
          </button>

          <div x-show="open" x-cloak x-trap.noscroll="open"
               class="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/30 px-3 pt-16 sm:pt-24">
            <div role="dialog" aria-modal="true" aria-label="Command palette" @click.outside="hide()"
                 class="w-full max-w-xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

              <div class="flex items-center gap-2 border-b border-zinc-100 px-3">
                <i data-lucide="search" class="size-4 shrink-0 text-zinc-600"></i>
                <label for="cp-q" class="sr-only">Search orders, vendors and actions</label>
                <input id="cp-q" x-model="q" type="text" role="combobox" autocomplete="off" autofocus
                       aria-autocomplete="list" aria-controls="cp-list"
                       :aria-expanded="open" :aria-activedescendant="activeId"
                       placeholder="Search orders, vendors, actions…"
                       @input="ai = 0"
                       @keydown.arrow-down.prevent="move(1)"
                       @keydown.arrow-up.prevent="move(-1)"
                       @keydown.enter.prevent="commit()"
                       class="w-full min-w-0 bg-transparent py-3 text-[14px]/5 outline-none placeholder:text-zinc-500">
                <button type="button" @click="hide()" class="rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">Esc</button>
              </div>

              <div id="cp-list" role="listbox" aria-label="Results" class="max-h-80 overflow-y-auto pb-1">
                <template x-for="g in groups" :key="g.name">
                  <div role="group" :aria-label="g.name" x-show="match(g).length">
                    <p aria-hidden="true"
                       class="sticky top-0 z-10 border-b border-zinc-100 bg-white px-3 py-1.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase"
                       x-text="g.name"></p>
                    <template x-for="o in match(g)" :key="o.id">
                      <div :id="rowId(o)" role="option"
                           @mousedown.prevent @click="pick(o)" @mousemove="ai = list.findIndex(x => x.id === o.id)"
                           :class="list[ai] && list[ai].id === o.id ? 'bg-zinc-100' : ''"
                           class="flex items-center gap-2.5 px-3 py-2 text-[13px]/5">
                        <span class="flex size-4 shrink-0 items-center justify-center text-zinc-600">
                          <i :data-lucide="o.icon" class="size-4"></i>
                        </span>
                        <span class="min-w-0 flex-1">
                          <span class="block truncate" x-text="o.label"></span>
                          <span x-show="o.sub" class="block truncate text-[12px]/4 text-zinc-500"><span x-text="o.sub"></span><span
                                x-show="o.flag" class="font-medium text-red-600"> · <span x-text="o.flag"></span></span></span>
                        </span>
                        <span x-show="o.amount" class="hidden shrink-0 text-[12px]/4 tabular-nums text-zinc-600 sm:block" x-text="o.amount"></span>
                        <kbd x-show="o.key" class="shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500" x-text="o.key"></kbd>
                      </div>
                    </template>
                  </div>
                </template>
              </div>

              <div x-show="!list.length" x-cloak class="px-4 py-6 text-center">
                <p class="text-[13px]/5 font-medium">Nothing matches “<span x-text="q"></span>”</p>
                <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">Try an order number — PO-2026-0451 — or a vendor name.</p>
              </div>

              <div class="flex items-center gap-3 border-t border-zinc-100 px-3 py-2 text-[11px]/4 text-zinc-500">
                <span><kbd class="rounded border border-zinc-200 px-1 py-0.5">↑↓</kbd> move</span>
                <span><kbd class="rounded border border-zinc-200 px-1 py-0.5">↵</kbd> open</span>
                <span class="ml-auto">Konspec Operations</span>
              </div>

              <p role="status" class="sr-only"
                 x-text="open ? (list.length === 1 ? '1 result' : list.length + ' results') : ''"></p>
            </div>
          </div>
        </div>

        <button type="button" aria-label="Notifications, 3 unread"
                class="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="bell" class="size-[18px]"></i>
          <span class="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-600 ring-2 ring-white"></span>
        </button>

        <!-- account menu -->
        <div class="relative"
             x-data="{
               open: false,
               items() { return [...this.$refs.menu.querySelectorAll('[role=menuitem]')] },
               show(last = false) {
                 this.open = true;
                 this.$nextTick(() => requestAnimationFrame(() => {
                   const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
                 }));
               },
               close(toTrigger = true) {
                 if (!this.open) return;
                 this.open = false;
                 if (toTrigger) this.$refs.trigger.focus();
               },
               move(step) {
                 const i = this.items(), at = i.indexOf(document.activeElement);
                 i[(at + step + i.length) % i.length]?.focus();
               },
               edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() }
             }"
             @click.outside="close(false)"
             @keydown.escape="if (open) { $event.stopPropagation(); close() }">
          <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
                  @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
                  :aria-expanded="open" aria-haspopup="true" aria-label="Account — Akshay Prabhu"
                  class="flex size-8 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">AP</button>

          <div x-ref="panel" x-show="open" x-cloak
               @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
               @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
               @keydown.tab="close(false)"
               class="absolute right-0 z-40 mt-1 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

            <div class="flex items-start gap-2.5 px-3 py-2">
              <span aria-hidden="true" class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[13px]/5 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">AP</span>
              <div class="min-w-0">
                <p class="truncate text-[13px]/5 font-medium">Akshay Prabhu</p>
                <p class="truncate text-[12px]/4 text-zinc-500">akshay.prabhu@konspec.com</p>
                <p class="mt-0.5 truncate text-[12px]/4 text-zinc-500">Ambernath plant · Level 2 approver</p>
              </div>
            </div>

            <div role="separator" class="my-1 h-px bg-zinc-100"></div>

            <div x-ref="menu" role="menu" aria-label="Account">
              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <i data-lucide="user" class="size-4 text-zinc-600"></i>Your profile
              </button>
              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <i data-lucide="bell" class="size-4 text-zinc-600"></i>Notification settings
              </button>
              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <i data-lucide="building-2" class="size-4 text-zinc-600"></i>Switch plant
                <span class="ml-auto shrink-0 text-[12px]/4 text-zinc-500">Ambernath</span>
              </button>

              <div role="separator" class="my-1 h-px bg-zinc-100"></div>

              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <i data-lucide="life-buoy" class="size-4 text-zinc-600"></i>Help and support
              </button>

              <div role="separator" class="my-1 h-px bg-zinc-100"></div>

              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <i data-lucide="log-out" class="size-4 text-zinc-600"></i>Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main id="kon-main" class="min-h-0 flex-1 overflow-auto">
      <div class="mx-auto max-w-[1600px] space-y-4 p-4 pb-16 lg:p-6">

        <!-- the actions take their own line below sm; side by side at 390px the
             title is squeezed to a third of the width and wraps under them -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div class="min-w-0 sm:flex-1">
            <h1 class="text-[24px]/7 font-semibold tracking-tight">Procurement overview</h1>
            <p class="mt-1 text-[13px]/5 text-zinc-600">Live commitments, receipts and vendor performance · FY 2026–27</p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <button type="button" disabled
                    class="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium text-zinc-400">Export</button>
            <button type="button"
                    class="rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">New purchase order</button>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-xl border border-zinc-200 bg-white p-4">
            <p class="text-[13px]/5 text-zinc-600">Open commitment</p>
            <p class="mt-2 text-[24px]/7 font-semibold tracking-tight tabular-nums">₹1,66,40,000</p>
            <p class="mt-2 text-[12px]/4 text-zinc-500">Across 148 purchase orders</p>
          </div>
          <div class="rounded-xl border border-zinc-200 bg-white p-4">
            <p class="text-[13px]/5 text-zinc-600">Awaiting GRN</p>
            <p class="mt-2 text-[24px]/7 font-semibold tracking-tight tabular-nums">27</p>
            <p class="mt-2 flex items-center gap-1.5 text-[12px]/4 text-zinc-500"><span aria-hidden="true" class="size-1.5 rounded-full bg-amber-500"></span>9 past the promised date</p>
          </div>
          <div class="rounded-xl border border-zinc-200 bg-white p-4">
            <p class="text-[13px]/5 text-zinc-600">Pending my approval</p>
            <p class="mt-2 text-[24px]/7 font-semibold tracking-tight tabular-nums">4</p>
            <p class="mt-2 text-[12px]/4 text-zinc-500">Oldest raised 3 days ago</p>
          </div>
          <div class="rounded-xl border border-zinc-200 bg-white p-4">
            <p class="text-[13px]/5 text-zinc-600">Vendors on hold</p>
            <p class="mt-2 text-[24px]/7 font-semibold tracking-tight tabular-nums">3</p>
            <p class="mt-2 flex items-center gap-1.5 text-[12px]/4 text-zinc-500"><span aria-hidden="true" class="size-1.5 rounded-full bg-red-600"></span>2 for expired documents</p>
          </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-3">

          <div class="rounded-xl border border-zinc-200 bg-white xl:col-span-2">
            <div class="flex items-center gap-3 border-b border-zinc-200 px-4 py-3">
              <h2 class="text-[16px]/6 font-semibold">Recent purchase orders</h2>
              <a href="#" class="ml-auto text-[13px]/5 text-zinc-900 underline underline-offset-2">All 148</a>
            </div>

            <table class="hidden w-full text-[13px]/5 md:table">
              <thead>
                <tr class="border-b border-zinc-200 bg-zinc-100 text-left text-zinc-600">
                  <th scope="col" class="px-4 py-2 font-medium">PO</th>
                  <th scope="col" class="px-4 py-2 font-medium">Vendor</th>
                  <th scope="col" class="px-4 py-2 font-medium">Promised</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">Value</th>
                  <th scope="col" class="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100">
                <tr class="hover:bg-zinc-50">
                  <td class="px-4 py-2.5"><a href="#" class="font-medium text-zinc-900 underline underline-offset-2">PO-2026-0451</a></td>
                  <td class="px-4 py-2.5 text-zinc-600">Sudarshan Chemicals</td>
                  <td class="px-4 py-2.5 tabular-nums text-zinc-600">02 Sep 2026</td>
                  <td class="px-4 py-2.5 text-right font-medium tabular-nums">₹18,42,000</td>
                  <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"><span aria-hidden="true" class="size-1.5 rounded-full bg-zinc-400"></span>Open</span></td>
                </tr>
                <tr class="hover:bg-zinc-50">
                  <td class="px-4 py-2.5"><a href="#" class="font-medium text-zinc-900 underline underline-offset-2">PO-2026-0450</a></td>
                  <td class="px-4 py-2.5 text-zinc-600">Deepak Nitrite</td>
                  <td class="px-4 py-2.5 tabular-nums text-zinc-600">29 Aug 2026</td>
                  <td class="px-4 py-2.5 text-right font-medium tabular-nums">₹7,15,500</td>
                  <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"><span aria-hidden="true" class="size-1.5 rounded-full bg-amber-500"></span>Awaiting approval</span></td>
                </tr>
                <tr class="hover:bg-zinc-50">
                  <td class="px-4 py-2.5"><a href="#" class="font-medium text-zinc-900 underline underline-offset-2">PO-2026-0448</a></td>
                  <td class="px-4 py-2.5 text-zinc-600">Aarti Industries</td>
                  <td class="px-4 py-2.5 tabular-nums text-zinc-600">26 Aug 2026</td>
                  <td class="px-4 py-2.5 text-right font-medium tabular-nums">₹24,90,000</td>
                  <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"><span aria-hidden="true" class="size-1.5 rounded-full bg-emerald-600"></span>Received</span></td>
                </tr>
                <tr class="hover:bg-zinc-50">
                  <td class="px-4 py-2.5"><a href="#" class="font-medium text-zinc-900 underline underline-offset-2">PO-2026-0445</a></td>
                  <td class="px-4 py-2.5 text-zinc-600">Navin Fluorine</td>
                  <td class="px-4 py-2.5 tabular-nums text-zinc-600">21 Aug 2026</td>
                  <td class="px-4 py-2.5 text-right font-medium tabular-nums">₹11,08,750</td>
                  <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"><span aria-hidden="true" class="size-1.5 rounded-full bg-amber-500"></span>Part received</span></td>
                </tr>
                <tr class="hover:bg-zinc-50">
                  <td class="px-4 py-2.5"><a href="#" class="font-medium text-zinc-900 underline underline-offset-2">PO-2026-0443</a></td>
                  <td class="px-4 py-2.5 text-zinc-600">Clean Science</td>
                  <td class="px-4 py-2.5 tabular-nums text-zinc-600">20 Aug 2026</td>
                  <td class="px-4 py-2.5 text-right font-medium tabular-nums">₹5,94,000</td>
                  <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"><span aria-hidden="true" class="size-1.5 rounded-full bg-zinc-400"></span>Open</span></td>
                </tr>
                <tr class="hover:bg-zinc-50">
                  <td class="px-4 py-2.5"><a href="#" class="font-medium text-zinc-900 underline underline-offset-2">PO-2026-0441</a></td>
                  <td class="px-4 py-2.5 text-zinc-600">Atul Ltd</td>
                  <td class="px-4 py-2.5 tabular-nums text-zinc-600">19 Aug 2026</td>
                  <td class="px-4 py-2.5 text-right font-medium tabular-nums">₹9,30,000</td>
                  <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"><span aria-hidden="true" class="size-1.5 rounded-full bg-amber-500"></span>Awaiting approval</span></td>
                </tr>
                <tr class="hover:bg-zinc-50">
                  <td class="px-4 py-2.5"><a href="#" class="font-medium text-zinc-900 underline underline-offset-2">PO-2026-0438</a></td>
                  <td class="px-4 py-2.5 text-zinc-600">Fine Organics</td>
                  <td class="px-4 py-2.5 tabular-nums text-zinc-600">18 Aug 2026</td>
                  <td class="px-4 py-2.5 text-right font-medium tabular-nums">₹2,17,600</td>
                  <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"><span aria-hidden="true" class="size-1.5 rounded-full bg-emerald-600"></span>Received</span></td>
                </tr>
                <tr class="hover:bg-zinc-50">
                  <td class="px-4 py-2.5"><a href="#" class="font-medium text-zinc-900 underline underline-offset-2">PO-2026-0431</a></td>
                  <td class="px-4 py-2.5 text-zinc-600">Privi Speciality</td>
                  <td class="px-4 py-2.5 tabular-nums text-zinc-600">15 Aug 2026 <span class="text-red-600">· 6 days late</span></td>
                  <td class="px-4 py-2.5 text-right font-medium tabular-nums">₹6,48,900</td>
                  <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"><span aria-hidden="true" class="size-1.5 rounded-full bg-red-600"></span>Overdue</span></td>
                </tr>
              </tbody>
            </table>
            <!-- 390px: the table becomes one card per order -->
            <ul class="divide-y divide-zinc-100 md:hidden">
              <li class="flex items-start gap-3 px-4 py-3">
                <span class="min-w-0 flex-1">
                  <a href="#" class="block truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">PO-2026-0451</a>
                  <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">Sudarshan Chemicals · 02 Sep 2026</span>
                </span>
                <span class="shrink-0 text-right">
                  <span class="block text-[13px]/5 font-medium tabular-nums">₹18,42,000</span>
                  <span class="mt-1 inline-flex items-center gap-1.5 text-[11px]/4 text-zinc-600"><span aria-hidden="true" class="size-1.5 rounded-full bg-zinc-400"></span>Open</span>
                </span>
              </li>
              <li class="flex items-start gap-3 px-4 py-3">
                <span class="min-w-0 flex-1">
                  <a href="#" class="block truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">PO-2026-0450</a>
                  <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">Deepak Nitrite · 29 Aug 2026</span>
                </span>
                <span class="shrink-0 text-right">
                  <span class="block text-[13px]/5 font-medium tabular-nums">₹7,15,500</span>
                  <span class="mt-1 inline-flex items-center gap-1.5 text-[11px]/4 text-zinc-600"><span aria-hidden="true" class="size-1.5 rounded-full bg-amber-500"></span>Awaiting approval</span>
                </span>
              </li>
              <li class="flex items-start gap-3 px-4 py-3">
                <span class="min-w-0 flex-1">
                  <a href="#" class="block truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">PO-2026-0431</a>
                  <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">Privi Speciality · 15 Aug 2026</span>
                </span>
                <span class="shrink-0 text-right">
                  <span class="block text-[13px]/5 font-medium tabular-nums">₹6,48,900</span>
                  <span class="mt-1 inline-flex items-center gap-1.5 text-[11px]/4 text-zinc-600"><span aria-hidden="true" class="size-1.5 rounded-full bg-red-600"></span>Overdue</span>
                </span>
              </li>
            </ul>

            <div class="flex items-center gap-3 border-t border-zinc-200 px-4 py-2.5 text-[12px]/4 text-zinc-500">
              <span class="tabular-nums">Showing 8 of 148</span>
              <a href="#" class="ml-auto text-zinc-900 underline underline-offset-2">Open the register</a>
            </div>

          </div>

          <div class="space-y-4">
            <div class="rounded-xl border border-zinc-200 bg-white">
              <div class="flex items-center gap-3 border-b border-zinc-200 px-4 py-3">
                <h2 class="text-[16px]/6 font-semibold">Waiting on you</h2>
                <span class="ml-auto rounded-full bg-zinc-200 px-2 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">4</span>
              </div>
              <ul class="divide-y divide-zinc-100">
                <li class="px-4 py-3">
                  <div class="flex items-start gap-3">
                    <span class="min-w-0 flex-1">
                      <a href="#" class="block truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">PO-2026-0450</a>
                      <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">Deepak Nitrite · raised 3 days ago</span>
                    </span>
                    <span class="shrink-0 text-[13px]/5 font-medium tabular-nums">₹7,15,500</span>
                  </div>
                  <div class="mt-2 flex gap-2">
                    <button type="button" class="rounded-lg bg-zinc-700 px-2.5 py-1.5 text-[12px]/4 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve</button>
                    <button type="button" class="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[12px]/4 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Return</button>
                  </div>
                </li>
                <li class="px-4 py-3">
                  <div class="flex items-start gap-3">
                    <span class="min-w-0 flex-1">
                      <a href="#" class="block truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">PO-2026-0441</a>
                      <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">Atul Ltd · raised 5 days ago</span>
                    </span>
                    <span class="shrink-0 text-[13px]/5 font-medium tabular-nums">₹9,30,000</span>
                  </div>
                  <div class="mt-2 flex gap-2">
                    <button type="button" class="rounded-lg bg-zinc-700 px-2.5 py-1.5 text-[12px]/4 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve</button>
                    <button type="button" class="rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[12px]/4 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Return</button>
                  </div>
                </li>
              </ul>
            </div>

            <div class="rounded-xl border border-zinc-200 bg-white">
              <div class="border-b border-zinc-200 px-4 py-3">
                <h2 class="text-[16px]/6 font-semibold">Latest activity</h2>
              </div>
              <ul class="divide-y divide-zinc-100">
                <li class="flex gap-2.5 px-4 py-3">
                  <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
                  <span class="min-w-0">
                    <span class="block text-[13px]/5">Sudarshan Chemicals raised the rate on MEK by 4%</span>
                    <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-500">12 minutes ago</span>
                  </span>
                </li>
                <li class="flex gap-2.5 px-4 py-3">
                  <i data-lucide="check-circle-2" class="mt-0.5 size-4 shrink-0 text-emerald-600"></i>
                  <span class="min-w-0">
                    <span class="block text-[13px]/5">PO-2026-0448 fully received against GRN-3391</span>
                    <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-500">1 hour ago</span>
                  </span>
                </li>
                <li class="flex gap-2.5 px-4 py-3">
                  <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
                  <span class="min-w-0">
                    <span class="block text-[13px]/5">PO-2026-0431 is 6 days past its promised date</span>
                    <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-500">Yesterday, 17:20</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>` }
    ]
  },

  {
    id: 'page-header', name: 'Page header', category: 'layout',
    description: 'The top block of a page: where it sits in the app, what it is, what state it is in, and what you can do to it. One h1 per page and it lives here.',
    when: 'Every page rendered inside app-shell, as the first thing in the main column. The split with topbar is settled and it is worth stating plainly: the topbar is the application chrome — which console, which context, what you can search, who you are signed in as — and this band is the page, which is why the h1, the record\'s status and its primary action are down here and never up there. The one exception is topbar\'s compact bar, a full-height editor such as a BOM sheet or a rate-contract editor where the document fills the column, there is no page header at all, and the bar carries the document name and its Save; that is not a second h1, it is the only one. Tabs in the band are the real tabs component switching views of one record — a row that loads a different record is navigation and belongs in sidebar. Signed-out screens use auth-page and failed ones error-page, and neither has a page header.',
    notes: [
      'This is a band, not a screen, so it does not preview in an h-[640px] frame the way app-shell and list-detail do. Each snippet\'s wrapper stands in for the main column: a zinc-100 page ground with the band across the top and a sliver of page under it. To make it real, keep the <header> exactly as written, drop the wrapper\'s rounded-xl, border and overflow-hidden, and make it the first child of <main> so it runs edge to edge; the mx-auto max-w-[1600px] gutter inside it is the one the page body already uses, and the band and the content below it have to share it or the title sits a few pixels off the first card.',
      'One h1 per document and it is this one. Every card under it is h2 and h3, and topbar carries no title on a screen that has a page header. Two h1 elements is a document with two titles as far as a heading outline is concerned, and the outline is how a screen reader user decides what the page is.',
      'Exactly one primary button, and it is last in the DOM as well as last on the right, so it is announced in the order it is drawn. Overflow goes into a dropdown, never into a second filled button — two graphite buttons side by side and the user has to read both to work out which is the ordinary path, which is the one thing the fill was there to say.',
      'The trail belongs to the topbar or to this band, decided once for the application and never both. Rendered in both places it is on screen twice, and the second copy is the one that goes stale. Where it lives here it sits above the title rather than beside it, and the h1 repeating the last crumb is correct: the crumb is navigation and the h1 is the page.',
      'One level deep, use a back link and not a trail of two. A trail whose only ancestor is the register you just came from is ceremony, and the back link gives a bigger target on a phone for the same information.',
      'Tabs in the band are the tabs component copied verbatim — role="tablist", aria-selected, roving tabindex, arrow keys — joined to the bottom edge with -mb-px over the header\'s border-b. A row of styled buttons that looks like tabs promises a screen reader that arrows switch panels and Tab jumps into one, and then neither happens. The tab row is the only thing in this band allowed to scroll sideways, because tabs says a second line of tabs reads as a different control.',
      'Never put overflow-hidden on the band to tidy a corner. The actions cluster opens a dropdown out of the bottom of it, and clipped to the band\'s own height that menu opens as a sliver that reads as a script that failed to load.',
      'Status here is the badge component\'s locked pill and nothing else: bg-zinc-200, ring-zinc-300, zinc-700 text, and a 6px dot carrying the colour. A header is the most tempting place in the application to paint a red Overdue field, and it is the same defect as everywhere else — the shape stops meaning anything and the word stops being read.',
      'Below md the actions restack under the title. They are never scrolled sideways and never hidden on mobile only; an action that will not fit moves into the menu, where it is still reachable. Hiding it outright means the phone build of the screen cannot do something the laptop build can, and nobody finds out until somebody is standing at a weighbridge.',
      'A sticky band needs an opaque background of its own, a bottom border drawn as border-transparent from the first frame with only its colour changing, and the same h1 element in both states. Add the border on scroll and every row below moves down a pixel and the page twitches under the cursor; swap the h1 for a smaller sibling and the accessibility tree loses and regains the page title on every scroll.',
      'Bind the scroll listener to the element that actually scrolls. Inside app-shell that is <main>, because the shell is a fixed-height flex frame where the document never scrolls at all — a listener on window there simply never fires, the band silently never condenses, and nothing reports an error.',
      'The filter row narrows the list below it and never leaves the page; the topbar\'s search crosses records and navigates. Both on one screen need different placeholders — Filter 1,438 orders here, Search orders, vendors, materials up there — or somebody types a PO number into the wrong box and reports the order missing.'
    ],
    anatomy: [
      ['Band', 'A <header> inside <main>: white, edge to edge across the column, over a border-zinc-200 bottom rule, with its content in the same mx-auto gutter as the page body. Never overflow-hidden.'],
      ['Trail', 'The breadcrumb <nav aria-label="Breadcrumb"> above the title, or a single back link one level deep. Present here only if the topbar does not carry it.'],
      ['Title', 'The one h1 in the document, at text-[24px]/7 tracking-tight. It repeats the last crumb, and that repetition is the point.'],
      ['Status', 'The badge component\'s pill beside the title — one graphite shape, colour only in the dot, and the word readable without it.'],
      ['Meta', 'The line or <dl> under the title that identifies the record: vendor, plant, dates, value. Figures take tabular-nums so the band does not shift as they change.'],
      ['Actions', 'The cluster on the right, ordered so the primary is last. One filled button, the rest bordered, and anything beyond about three inside a dropdown.'],
      ['Tabs', 'Optional, joined to the band\'s bottom edge with -mb-px. Views of the same record only; the panel below is on the page ground, outside the band.'],
      ['Filter row', 'Optional second row inside the band on a register: a search form, the narrow selects, and the chips and result count that say what is currently applied.']
    ],
    behaviour: [
      'The band does not stick by default. On a long record the actions are repeated at the foot of the form instead, which costs nothing and leaves the whole column to the record.',
      'Where it does stick, it condenses once at a fixed threshold read off the scroller. The condensed band is shorter than the threshold, so shrinking it cannot pull the scroll position back under the threshold and start it oscillating.',
      'Actions wrap under the title below md. Nothing in the band scrolls sideways except the tab row, and no action is dropped on a narrow screen — it moves into the menu.',
      'The overflow menu holds every secondary action at every width and promotes the two or three most used out of it at lg. Both copies are in the DOM and the inactive one is display:none, so it is out of the tab order and out of the accessibility tree as well as off the screen.',
      'Tabs switch the panel below in place. The trail, the title, the status and the actions do not change, because it is the same record either way.',
      'The filter row narrows the list underneath and never navigates. Removing a chip re-runs the query, Clear all removes every one of them, and the count beside them is the answer to what is currently applied.',
      'Record paging — 12 of 34 with a chevron either side — walks the list the user arrived from. It sits leftmost in the cluster, furthest from the primary, because it acts on the list rather than on the record.',
      'Meta figures are tabular-nums, so a header does not reflow when a value is edited and the amount changes width.'
    ],
    a11y: [
      'The title is a real h1 and there is exactly one in the document, giving the page a single unambiguous top-level heading for the outline to hang off.',
      'The band is a <header> inside <main>, which makes it a section header and not the banner landmark. The banner is the topbar\'s, and giving this one role="banner" produces two banners and a landmark list nobody can navigate.',
      'The breadcrumb is a <nav aria-label="Breadcrumb"> with aria-current="page" on the last crumb, and its name differs from the sidebar\'s Main. Two navs with the same name are two identical rows in the landmark list.',
      'Tabs carry the full pattern: role="tablist" with a name, aria-selected and aria-controls on each tab, aria-labelledby back from each panel, roving tabindex, and arrow, Home and End all calling preventDefault.',
      'Status is a word as well as a dot, and the dot is aria-hidden. A coloured disc announces nothing at all, so a pill whose only content is colour is an empty element to a screen reader.',
      'The filter row is a <form role="search"> holding a labelled input — sr-only is fine, absent is not — and each chip\'s remove button names what it removes, so a list of six buttons called Remove is not what gets read out.',
      'The overflow menu follows dropdown exactly: aria-haspopup="menu", aria-expanded bound, real focus moved item to item with tabindex="-1", Escape closing back to the trigger. Its item list is filtered on offsetParent, or the keyboard walks into an item that lg:hidden has already removed from the screen and focus() is a silent no-op.',
      'The action cluster is in the same order in the DOM as on screen, so the primary is announced last and not read out first by accident.',
      'Focus is an outline, never a ring, and the band\'s bottom edge is a real border. Both survive forced-colours mode, where every box-shadow is dropped.'
    ],
    related: ['breadcrumbs', 'tabs', 'badge', 'button-group', 'dropdown', 'topbar', 'app-shell'],
    variants: [
      { id: 'default', name: 'Title and actions', code:
`<!-- The band is not a screen, so it does not preview in an h-[640px] frame the
     way app-shell does. This wrapper stands in for the main column: a zinc-100
     page ground with the band across the top and a sliver of the page under it.
     To ship it, keep the <header> exactly as written, drop the wrapper's
     rounded-xl, border and overflow-hidden, and make it the first child of
     <main>. The mx-auto max-w-[1600px] gutter is the page body's gutter and the
     two have to match, or the title sits a few pixels off the first card.

     A top-level register has no parent, so there is no trail. Two actions, and
     only the last is filled — the primary is last in the DOM as well as last on
     the right, so it is announced in the order it is drawn. -->
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
  <header class="border-b border-zinc-200 bg-white">
    <div class="mx-auto flex max-w-[1600px] flex-wrap items-start justify-between gap-x-6 gap-y-3 px-4 py-4 lg:px-6">
      <div class="min-w-0">
        <h1 class="text-[24px]/7 font-semibold tracking-tight">Purchase orders</h1>
        <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">1,438 orders across 6 plants · ₹18,42,60,000 committed</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="download" class="size-4"></i>Export
        </button>
        <button type="button" class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="plus" class="size-4"></i>New order
        </button>
      </div>
    </div>
  </header>

  <p class="mx-auto max-w-[1600px] px-4 py-6 text-[13px]/5 text-zinc-500 lg:px-6">The order register renders below the band, in this gutter.</p>
</div>` },

      { id: 'trail', name: 'With a breadcrumb', code:
`<!-- The trail sits above the title, not beside it, and the h1 repeats the last
     crumb. That repetition is correct: the crumb is navigation and the h1 is the
     page. Copy the trail from breadcrumbs — an <ol>, the separators aria-hidden,
     aria-current="page" on the last item, which is a <span> and not a link.

     Render this here only if the topbar does not carry a trail. One of the two,
     decided once for the application; on screen twice, the second one is the one
     that goes stale. -->
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
  <header class="border-b border-zinc-200 bg-white">
    <div class="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">
      <nav aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center gap-1.5 text-[12px]/4">
          <li><a href="#" class="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Procurement</a></li>
          <li aria-hidden="true" class="text-zinc-500">/</li>
          <li><a href="#" class="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Goods receipt</a></li>
          <li aria-hidden="true" class="text-zinc-500">/</li>
          <li><span aria-current="page" class="font-medium tabular-nums text-zinc-900">GRN-26-0418</span></li>
        </ol>
      </nav>

      <div class="mt-2 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div class="min-w-0">
          <h1 class="text-[24px]/7 font-semibold tracking-tight tabular-nums">GRN-26-0418</h1>
          <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Against PO-24-1187 · Sharma Steel &amp; Alloys · received 18 Aug 2026 at Silvassa · 9 lines</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="printer" class="size-4"></i>Print
          </button>
          <button type="button" class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="check" class="size-4"></i>Post to ledger
          </button>
        </div>
      </div>
    </div>
  </header>

  <p class="mx-auto max-w-[1600px] px-4 py-6 text-[13px]/5 text-zinc-500 lg:px-6">The receipt lines render below the band, in this gutter.</p>
</div>` },

      { id: 'record', name: 'Record header', code:
`<!-- A purchase order detail header: the trail, the number as the title, the
     state, and the five facts that identify the record. The status pill is
     badge's locked shape — one graphite pill, colour only in the 6px dot, the
     word readable with the dot ignored — and Approved takes amber because it
     means waiting on someone, not because it is good news.

     The facts are a real <dl>. Written as one middot-joined sentence they are a
     string; as a definition list each value has a name that survives being read
     out on its own. Every figure is tabular-nums so the band does not reflow
     when the order is amended and the value changes width. -->
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
  <header class="border-b border-zinc-200 bg-white">
    <div class="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">
      <nav aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center gap-1.5 text-[12px]/4">
          <li><a href="#" class="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Procurement</a></li>
          <li aria-hidden="true" class="text-zinc-500">/</li>
          <li><a href="#" class="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Purchase orders</a></li>
          <li aria-hidden="true" class="text-zinc-500">/</li>
          <li><span aria-current="page" class="font-medium tabular-nums text-zinc-900">PO-24-1187</span></li>
        </ol>
      </nav>

      <div class="mt-2 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 class="text-[24px]/7 font-semibold tracking-tight tabular-nums">PO-24-1187</h1>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
            </span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>3 lines past promise
            </span>
          </div>

          <dl class="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1.5 text-[13px]/5">
            <div class="flex items-baseline gap-1.5">
              <dt class="text-zinc-500">Vendor</dt>
              <dd class="font-medium text-zinc-900">Sharma Steel &amp; Alloys</dd>
            </div>
            <div class="flex items-baseline gap-1.5">
              <dt class="text-zinc-500">Plant</dt>
              <dd class="font-medium text-zinc-900">Silvassa</dd>
            </div>
            <div class="flex items-baseline gap-1.5">
              <dt class="text-zinc-500">Raised</dt>
              <dd class="font-medium tabular-nums text-zinc-900">04 Aug 2026</dd>
            </div>
            <div class="flex items-baseline gap-1.5">
              <dt class="text-zinc-500">Promised</dt>
              <dd class="font-medium tabular-nums text-zinc-900">22 Aug 2026</dd>
            </div>
            <div class="flex items-baseline gap-1.5">
              <dt class="text-zinc-500">Value</dt>
              <dd class="font-semibold tabular-nums text-zinc-900">₹18,42,000</dd>
            </div>
          </dl>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="printer" class="size-4"></i>Print
          </button>
          <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="pencil" class="size-4"></i>Amend
          </button>
          <button type="button" class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="truck" class="size-4"></i>Record GRN
          </button>
        </div>
      </div>
    </div>
  </header>

  <p class="mx-auto max-w-[1600px] px-4 py-6 text-[13px]/5 text-zinc-500 lg:px-6">The order lines and the receipt history render below the band.</p>
</div>` },

      { id: 'tabs', name: 'With tabs', code:
`<!-- Tabs joined to the band's bottom edge. -mb-px on the tab row pulls it one
     pixel down over the header's border-b, so the active tab's underline meets
     the rule instead of floating above it.

     This is the tabs component copied verbatim, not a lookalike: role="tablist"
     with a name, aria-selected and aria-controls out, aria-labelledby back,
     roving tabindex so Tab enters the row once, and arrow, Home and End all
     preventing default. A row of styled buttons that merely looks like this
     promises a screen reader that arrows switch panels, and then nothing does.

     The tab row is the one thing in this band allowed to scroll sideways —
     four tabs do not fit 390px and a second line of tabs reads as a different
     control. Its scrollbar is hidden and the focus outline takes a negative
     offset, because a positive one is clipped by the scroller. -->
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100"
     x-id="['ph-tab', 'ph-panel']"
     x-data="{
       tab: 'orders',
       items: [
         { id: 'orders',   label: 'Open orders', count: 12 },
         { id: 'rates',    label: 'Rate contracts', count: 6 },
         { id: 'receipts', label: 'Receipts' },
         { id: 'ledger',   label: 'Ledger' }
       ],
       tabEls() { return Array.from(this.$refs.list.querySelectorAll('[role=tab]')); },
       move(step) {
         const n = this.items.length;
         const i = this.items.findIndex(t => t.id === this.tab);
         this.pick(this.items[(i + step + n) % n].id);
       },
       pick(id) {
         this.tab = id;
         this.$nextTick(() => {
           const el = this.tabEls().find(e => e.dataset.tab === id);
           if (el) el.focus();
         });
       }
     }">
  <header class="border-b border-zinc-200 bg-white">
    <div class="mx-auto max-w-[1600px] px-4 pt-4 lg:px-6">
      <nav aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center gap-1.5 text-[12px]/4">
          <li><a href="#" class="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Master data</a></li>
          <li aria-hidden="true" class="text-zinc-500">/</li>
          <li><a href="#" class="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Vendors</a></li>
          <li aria-hidden="true" class="text-zinc-500">/</li>
          <li><span aria-current="page" class="font-medium text-zinc-900">Gujarat Polymers Ltd</span></li>
        </ol>
      </nav>

      <div class="mt-2 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 class="text-[24px]/7 font-semibold tracking-tight">Gujarat Polymers Ltd</h1>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Approved vendor
            </span>
          </div>
          <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">V-0412 · GSTIN 24AACCG1234F1ZP · Vapi, Gujarat · onboarded 11 Mar 2021</p>
        </div>
        <button type="button" class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="plus" class="size-4"></i>New order
        </button>
      </div>

      <div x-ref="list" role="tablist" aria-label="Vendor sections"
           @keydown.arrow-right.prevent="move(1)"
           @keydown.arrow-left.prevent="move(-1)"
           @keydown.home.prevent="pick(items[0].id)"
           @keydown.end.prevent="pick(items[items.length - 1].id)"
           class="-mb-px mt-4 flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <template x-for="t in items" :key="t.id">
          <button type="button" role="tab" :data-tab="t.id"
                  :id="$id('ph-tab', t.id)" :aria-controls="$id('ph-panel', t.id)"
                  :aria-selected="tab === t.id ? 'true' : 'false'"
                  :tabindex="tab === t.id ? 0 : -1"
                  @click="pick(t.id)"
                  class="flex shrink-0 items-center gap-2 rounded-t border-b-2 pb-2.5 text-[13px]/5 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
                  :class="tab === t.id ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">
            <span x-text="t.label"></span>
            <template x-if="t.count">
              <span class="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300" x-text="t.count"></span>
            </template>
          </button>
        </template>
      </div>
    </div>
  </header>

  <div class="mx-auto max-w-[1600px] px-4 py-5 text-[13px]/5 lg:px-6">
    <div role="tabpanel" tabindex="0" :id="$id('ph-panel', 'orders')" :aria-labelledby="$id('ph-tab', 'orders')"
         x-show="tab === 'orders'"
         class="rounded-lg tabular-nums text-zinc-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      12 open orders, ₹41,86,400 committed. Oldest is PO-24-0996, promised 09 Aug 2026.
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('ph-panel', 'rates')" :aria-labelledby="$id('ph-tab', 'rates')"
         x-show="tab === 'rates'" x-cloak
         class="rounded-lg tabular-nums text-zinc-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      6 rate contracts, 2 expiring before 31 Oct 2026. HDPE granules held at ₹94.50 per kg.
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('ph-panel', 'receipts')" :aria-labelledby="$id('ph-tab', 'receipts')"
         x-show="tab === 'receipts'" x-cloak
         class="rounded-lg tabular-nums text-zinc-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      48 GRNs posted this financial year, 3 short-received and 1 rejected at QC.
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('ph-panel', 'ledger')" :aria-labelledby="$id('ph-tab', 'ledger')"
         x-show="tab === 'ledger'" x-cloak
         class="rounded-lg tabular-nums text-zinc-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      Outstanding ₹7,12,340 against 4 invoices. Oldest is 62 days, terms are 45 from GRN.
    </div>
  </div>
</div>` },

      { id: 'filters', name: 'With a filter row', code:
`<!-- A register band: the title row, then a second row inside the band holding
     the query and what it currently is. This box filters the list underneath and
     never leaves the page, which is why its placeholder says Filter 1,438
     orders and the topbar's says Search orders, vendors, materials. Give them
     the same words and somebody types a PO number into the wrong one and
     reports the order missing.

     Below md the row restacks: the search takes the full width and the two
     selects share a line. Nothing here scrolls sideways.

     Each chip's remove button names what it removes, because six buttons all
     called Remove is what a screen reader reads out otherwise. The count is
     plain text and not a live region — it changes on a page of results, not on
     a keystroke. -->
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100"
     x-data="{ q: '' }">
  <header class="border-b border-zinc-200 bg-white">
    <div class="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">
      <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div class="min-w-0">
          <h1 class="text-[24px]/7 font-semibold tracking-tight">Goods receipt notes</h1>
          <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Every receipt posted against a Konspec plant since 1 Apr 2026</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="download" class="size-4"></i>Export
          </button>
          <button type="button" class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="plus" class="size-4"></i>New GRN
          </button>
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
        <form role="search" @submit.prevent class="md:max-w-sm md:flex-1">
          <label for="ph-grn-q" class="sr-only">Filter goods receipt notes</label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
            <input id="ph-grn-q" x-ref="q" x-model="q" type="search" enterkeyhint="search"
                   autocomplete="off" spellcheck="false"
                   @keydown.escape="if (q) { $event.stopPropagation(); q = '' }"
                   placeholder="Filter 1,438 receipts"
                   class="w-full min-w-0 bg-transparent px-2 py-2 text-[13px]/5 outline-none placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none">
            <button type="button" x-show="q" x-cloak @click="q = ''; $refs.q.focus()" aria-label="Clear the receipt filter"
                    class="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="x" class="size-4"></i>
            </button>
          </div>
        </form>

        <div class="grid grid-cols-2 gap-2 md:flex md:shrink-0">
          <div>
            <label for="ph-grn-status" class="sr-only">Status</label>
            <select id="ph-grn-status" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium focus:border-zinc-700 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15 md:w-auto">
              <option>Status: all</option>
              <option selected>Status: awaiting QC</option>
              <option>Status: posted</option>
              <option>Status: rejected</option>
            </select>
          </div>
          <div>
            <label for="ph-grn-plant" class="sr-only">Plant</label>
            <select id="ph-grn-plant" class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium focus:border-zinc-700 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15 md:w-auto">
              <option>Plant: all</option>
              <option selected>Plant: Silvassa</option>
              <option>Plant: Vapi</option>
              <option>Plant: Daman</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-1 pl-3 pr-1.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          Status: awaiting QC
          <button type="button" aria-label="Remove filter Status: awaiting QC" class="rounded-full p-0.5 text-zinc-600 hover:bg-white hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="x" class="size-3"></i></button>
        </span>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-1 pl-3 pr-1.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          Plant: Silvassa
          <button type="button" aria-label="Remove filter Plant: Silvassa" class="rounded-full p-0.5 text-zinc-600 hover:bg-white hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="x" class="size-3"></i></button>
        </span>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-1 pl-3 pr-1.5 text-[12px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">
          Received after 01 Aug 2026
          <button type="button" aria-label="Remove filter Received after 01 Aug 2026" class="rounded-full p-0.5 text-zinc-600 hover:bg-white hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="x" class="size-3"></i></button>
        </span>
        <button type="button" class="rounded text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Clear all</button>
        <span class="ml-auto text-[12px]/4 tabular-nums text-zinc-600">27 of 1,438 receipts · 4,182 lines</span>
      </div>
    </div>
  </header>

  <p class="mx-auto max-w-[1600px] px-4 py-6 text-[13px]/5 text-zinc-500 lg:px-6">The 27 matching receipts render below the band.</p>
</div>` },

      { id: 'back', name: 'Back link and record paging', code:
`<!-- One level deep there is nothing to trace, so a trail of two crumbs is
     ceremony. A back link says the same thing in less space and gives a bigger
     target on a phone. It is an <a> with a real href, not a history.back()
     button — the record is often opened in a new tab from the register, and
     there is no history to go back to in that tab.

     The pager walks the list the user arrived from, so it sits leftmost in the
     cluster, furthest from the primary: it acts on the list, not on this record.
     Its arrows carry names that say what they step through, because Previous
     and Next on their own are the same two words as every other pager on the
     screen. -->
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
  <header class="border-b border-zinc-200 bg-white">
    <div class="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">
      <a href="#" class="inline-flex items-center gap-1.5 rounded text-[13px]/5 text-zinc-600 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="chevron-left" class="size-4"></i>QC results
      </a>

      <div class="mt-2 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 class="text-[24px]/7 font-semibold tracking-tight tabular-nums">QC-26-3341</h1>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Passed
            </span>
          </div>
          <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Batch B-26-0914 · HDPE granules, natural · 12 of 12 parameters within spec · tested 18 Aug 2026 at Vapi lab</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-white p-0.5">
            <button type="button" aria-label="Previous QC result in this list"
                    class="flex size-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="chevron-left" class="size-4"></i>
            </button>
            <span class="px-1.5 text-[12px]/4 tabular-nums text-zinc-600">12 of 34</span>
            <button type="button" aria-label="Next QC result in this list"
                    class="flex size-8 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="chevron-right" class="size-4"></i>
            </button>
          </div>
          <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="printer" class="size-4"></i>Certificate
          </button>
          <button type="button" class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="package-check" class="size-4"></i>Release batch
          </button>
        </div>
      </div>
    </div>
  </header>

  <p class="mx-auto max-w-[1600px] px-4 py-6 text-[13px]/5 text-zinc-500 lg:px-6">The twelve tested parameters and their limits render below the band.</p>
</div>` },

      { id: 'sticky', name: 'Sticky and condensing', code:
`<!-- The expensive form, and the one to reach for only on a record long enough
     that the actions are out of sight at the foot of it. Everything else repeats
     the actions at the bottom of the form instead, which costs nothing.

     Three rules hold it together. The bottom border is drawn as
     border-transparent from the first frame and only its colour changes — add
     the border on scroll and every row below moves down a pixel and the page
     twitches under the cursor. The band carries an opaque bg-white, because a
     transparent sticky element slides legible text under legible text. And the
     h1 is the same element in both states, changing only its size class: swap
     it for a smaller sibling and the accessibility tree loses and regains the
     page title on every scroll.

     The listener is on the element that actually scrolls. Here that is the
     preview wrapper; inside app-shell it is <main>, because the shell is a
     fixed-height flex frame where the document never scrolls at all and a
     listener on window never fires. It condenses once at a fixed threshold, and
     since the condensed band is shorter than that threshold, shrinking it can
     never pull the scroll position back under and start it oscillating.

     To ship it: keep the <header> as written, drop the wrapper's height,
     overflow, rounding and border, and move @scroll onto whichever element
     scrolls on that page. -->
<div class="h-[420px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-100"
     x-data="{ shrunk: false }"
     @scroll.self="shrunk = $event.target.scrollTop > 56">
  <header class="sticky top-0 z-20 border-b border-transparent bg-white transition-colors"
          :class="shrunk && 'border-zinc-200'">
    <div class="mx-auto max-w-[1600px] px-4 transition-all duration-150 lg:px-6"
         :class="shrunk ? 'py-2' : 'py-4'">
      <nav aria-label="Breadcrumb" x-show="!shrunk">
        <ol class="flex flex-wrap items-center gap-1.5 text-[12px]/4">
          <li><a href="#" class="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Procurement</a></li>
          <li aria-hidden="true" class="text-zinc-500">/</li>
          <li><a href="#" class="text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Requisitions</a></li>
          <li aria-hidden="true" class="text-zinc-500">/</li>
          <li><span aria-current="page" class="font-medium tabular-nums text-zinc-900">REQ-26-0771</span></li>
        </ol>
      </nav>

      <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2" :class="!shrunk && 'mt-2'">
        <div class="min-w-0 grow basis-72">
          <div class="flex min-w-0 items-center gap-x-3">
            <h1 class="min-w-0 truncate font-semibold tracking-tight tabular-nums transition-all duration-150"
                :class="shrunk ? 'text-[16px]/6' : 'text-[24px]/7'">REQ-26-0771</h1>
            <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Awaiting level 2
            </span>
          </div>
          <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600" x-show="!shrunk">Raised 16 Aug 2026 by Nilesh Patil · Silvassa maintenance · 24 lines · ₹6,84,200</p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2">
          <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="corner-up-left" class="size-4"></i>Send back
          </button>
          <button type="button" class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="check" class="size-4"></i>Approve
          </button>
        </div>
      </div>
    </div>
  </header>

  <div class="mx-auto max-w-[1600px] space-y-2 px-4 py-4 lg:px-6">
    <p class="text-[13px]/5 text-zinc-500">Scroll this panel — the band condenses once, past 56 pixels.</p>
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px]/5 tabular-nums">Line 1 · Bearing 6205-2RS · 40 nos · ₹18,400</div>
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px]/5 tabular-nums">Line 2 · V-belt B-88 · 24 nos · ₹9,120</div>
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px]/5 tabular-nums">Line 3 · Hydraulic hose 1/2 in · 60 m · ₹42,600</div>
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px]/5 tabular-nums">Line 4 · Gearbox oil EP-320 · 8 drums · ₹1,04,000</div>
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px]/5 tabular-nums">Line 5 · Proximity switch M18 · 16 nos · ₹27,840</div>
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px]/5 tabular-nums">Line 6 · SS 304 sheet 2 mm · 1,200 kg · ₹2,88,000</div>
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px]/5 tabular-nums">Line 7 · Welding electrode 3.15 mm · 90 kg · ₹16,650</div>
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[13px]/5 tabular-nums">Line 8 · Safety harness · 12 nos · ₹38,400</div>
  </div>
</div>` },

      { id: 'overflow', name: 'Actions in a menu', code:
`<!-- Six actions on a record, and never two filled buttons: the primary stays a
     real button at every width and everything else collapses. At lg the two most
     used are lifted out of the menu as bordered buttons; below lg they are back
     inside it and only More and Record GRN are on the row. Nothing is dropped —
     an action missing from the phone build is a job the phone cannot do, and
     nobody finds that out until somebody is standing at a weighbridge.

     Both copies of Print and Amend sit in the DOM, and that is safe only because
     hidden and lg:flex compile to display:none, which takes the inactive copy out
     of the accessibility tree as well as off the screen. It is also why items()
     filters on offsetParent: querySelectorAll returns the hidden twins too, and
     focus() on a display:none element is a silent no-op that leaves the arrow
     keys apparently dead.

     No overflow-hidden on the band. The menu opens out of the bottom of it, and
     clipped to the band's own height it renders as a sliver that reads as a
     script that failed to load. That is also why this preview wrapper does not
     clip: the rounded-t-xl on the <header> and the deep bottom padding are the
     frame giving the menu somewhere to open, and both come off on a real page.
     The destructive item is last, under a real role="separator". -->
<div class="rounded-xl border border-zinc-200 bg-zinc-100">
  <header class="rounded-t-xl border-b border-zinc-200 bg-white">
    <div class="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">
      <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 class="text-[24px]/7 font-semibold tracking-tight tabular-nums">PO-24-1206</h1>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
            </span>
          </div>
          <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Gujarat Polymers Ltd · Daman · promised 12 Aug 2026 · 9 days late · ₹7,64,500</p>
        </div>

        <div class="flex flex-wrap items-center gap-2"
             x-data="{
               open: false,
               items() { return [...this.$refs.menu.querySelectorAll('[role=menuitem]')].filter(el => el.offsetParent !== null) },
               show(last = false) {
                 this.open = true;
                 this.$nextTick(() => requestAnimationFrame(() => {
                   const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
                 }));
               },
               close(toTrigger = true) {
                 if (!this.open) return;
                 this.open = false;
                 if (toTrigger) this.$refs.trigger.focus();
               },
               move(step) {
                 const i = this.items(), at = i.indexOf(document.activeElement);
                 i[(at + step + i.length) % i.length]?.focus();
               },
               edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() }
             }"
             @click.outside="close(false)"
             @keydown.escape="if (open) { $event.stopPropagation(); close() }">

          <button type="button" class="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 lg:flex">
            <i data-lucide="printer" class="size-4"></i>Print
          </button>
          <button type="button" class="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 lg:flex">
            <i data-lucide="pencil" class="size-4"></i>Amend
          </button>

          <div class="relative">
            <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
                    @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
                    :aria-expanded="open" aria-haspopup="menu" aria-label="More actions for PO-24-1206"
                    class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="more-horizontal" class="size-4"></i><span class="hidden sm:inline">More</span>
            </button>

            <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Purchase order actions"
                 @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
                 @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
                 @keydown.tab="close(false)"
                 class="absolute right-0 top-full z-40 mt-1 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 lg:hidden">
                <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print
              </button>
              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 lg:hidden">
                <i data-lucide="pencil" class="size-4 text-zinc-600"></i>Amend
              </button>
              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <i data-lucide="copy" class="size-4 text-zinc-600"></i>Duplicate order
              </button>
              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <i data-lucide="mail" class="size-4 text-zinc-600"></i>Chase the vendor
              </button>

              <div role="separator" class="my-1 h-px bg-zinc-100"></div>

              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <i data-lucide="circle-x" class="size-4"></i>Cancel order
              </button>
            </div>
          </div>

          <button type="button" class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="truck" class="size-4"></i>Record GRN
          </button>
        </div>
      </div>
    </div>
  </header>

  <p class="mx-auto max-w-[1600px] px-4 pb-56 pt-6 text-[13px]/5 text-zinc-500 lg:px-6">Narrow the window past lg and Print and Amend move into the menu.</p>
</div>` }
    ]
  },

  {
    id: 'card', name: 'Card', category: 'layout',
    description: 'A bordered white panel that groups one thing. A header names it, the body holds the content, and an optional footer carries totals or actions.',
    when: 'Grouping related content on a page. Do not nest cards — if a card needs sections inside it, those are dividers.',
    notes: [
      'Panels are rounded-xl; controls inside them stay rounded-lg. A card inside a card is always a layout mistake.',
      'Header is px-5 py-3.5, body px-5 py-4, footer px-5 py-3. The header is tighter than the body on purpose: it holds one line of 20px text, and py-4 makes it taller than the content it names.',
      'A card holding a table takes no body padding at all. The table sits flush so its rules meet the card\'s edges; padding leaves the header row floating inside a border it does not touch.',
      'Shadows are for things floating over the page — menus, popovers, modals. A card sitting on the page uses a border, never a shadow.',
      'overflow-hidden on the panel only when nothing inside it needs to escape. A card containing a dropdown or a popover must round its own header and footer instead, or the menu is clipped.',
      'Cards in a row size to their content. items-start, not items-stretch — equal heights across a row leave dead space that reads as missing data.'
    ],
    anatomy: [
      ['Panel', 'rounded-xl, white, zinc-200 border. Never a shadow — shadows mean the thing is floating above the page.'],
      ['Header', 'px-5 py-3.5 on a bordered strip: the title, an optional one-line subtitle, and any header action.'],
      ['Title', 'A heading at the level the page outline implies — usually h2 or h3, never chosen for its size.'],
      ['Body', 'px-5 py-4, or no padding at all when the content is a table or a divided list.'],
      ['Divider', 'border-zinc-100 between sections inside a card that already has a zinc-200 border of its own.'],
      ['Footer', 'px-5 py-3 on a zinc-100 strip above a top border, for totals or the actions that finish the card.']
    ],
    behaviour: [
      'Cards do not nest. If a card needs sections inside it, those are dividers.',
      'Panels are rounded-xl and controls inside them stay rounded-lg, so the shapes stay in a hierarchy.',
      'A card holding a table drops its body padding entirely, or the table\'s rules stop meeting the card\'s edges.',
      'The header stays present even when the card holds one thing — an unnamed panel is hard to refer to.',
      'Card height is driven by content. Forcing equal heights across a row leaves dead space that reads as missing data.',
      'A card that is entirely clickable is one link around the whole panel, and then it contains no other links or buttons — a control inside a link is unreachable by keyboard and ambiguous by mouse.'
    ],
    a11y: [
      'The card title is a heading at the level the page outline implies, usually h2 or h3.',
      'A card is a section, not a landmark, so it needs no role — the heading is what makes it navigable.',
      'A clickable card makes the whole panel the link rather than only the title, so the target is the size of the card.',
      'A clickable card holds no nested links or buttons; if it needs a second action, the card is not the link and the title is.',
      'Dividers are borders, not <hr>, so they are not announced as separators inside a list of fields.',
      'Footer actions sit inside the card in the DOM as well as visually, so their context is clear when read out of order.'
    ],
    related: ['stat-card', 'table', 'separator'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-3.5">
    <h2 class="text-[14px]/5 font-semibold">Delivery terms</h2>
  </div>
  <div class="px-5 py-4">
    <dl class="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      <div>
        <dt class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Incoterm</dt>
        <dd class="mt-0.5 text-[14px]/5">FOR Silvassa plant</dd>
      </div>
      <div>
        <dt class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Lead time</dt>
        <dd class="mt-0.5 text-[14px]/5 tabular-nums">14 days from PO release</dd>
      </div>
      <div>
        <dt class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Payment</dt>
        <dd class="mt-0.5 text-[14px]/5">45 days from GRN</dd>
      </div>
      <div>
        <dt class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Freight</dt>
        <dd class="mt-0.5 text-[14px]/5">Vendor scope, included in rate</dd>
      </div>
    </dl>
  </div>
</div>` },
      { id: 'actions', name: 'With header actions', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-5 py-3.5">
    <div class="min-w-0">
      <h2 class="text-[14px]/5 font-semibold">Attached documents</h2>
      <p class="text-[12px]/4 text-zinc-600">Quotation, drawing and test certificate</p>
    </div>
    <div class="flex items-center gap-2">
      <button class="inline-flex h-8 items-center rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100">Download all</button>
      <button class="inline-flex h-8 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
        <i data-lucide="upload" class="size-4"></i>Attach
      </button>
    </div>
  </div>
  <ul class="divide-y divide-zinc-100">
    <li class="flex items-center gap-3 px-5 py-3">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-[13px]/5 font-medium">quotation-sharma-aug.pdf</span>
        <span class="block text-[11px]/4 text-zinc-500">248 KB · uploaded 04 Aug by Akshay Prabhu</span>
      </span>
      <a href="#" class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">View</a>
    </li>
    <li class="flex items-center gap-3 px-5 py-3">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300"><i data-lucide="ruler" class="size-4 text-zinc-600"></i></span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-[13px]/5 font-medium">drg-fab-2211-rev-c.pdf</span>
        <span class="block text-[11px]/4 text-zinc-500">1.4 MB · uploaded 05 Aug by Nilesh Patil</span>
      </span>
      <a href="#" class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">View</a>
    </li>
  </ul>
</div>` },
      { id: 'stats', name: 'Split stats footer', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-3.5">
    <h2 class="text-[14px]/5 font-semibold">Order value</h2>
    <p class="text-[12px]/4 text-zinc-600">PO-24-1187 · 9 lines · Sharma Steel &amp; Alloys</p>
  </div>
  <div class="px-5 py-4">
    <p class="text-[24px]/7 font-semibold tracking-tight tabular-nums">₹18,42,000</p>
    <p class="mt-2 text-[12px]/4 text-zinc-600">Inclusive of 18% GST · freight in vendor scope</p>
    <div class="mt-4">
      <div class="flex items-center justify-between text-[12px]/4"><span class="text-zinc-600">Received against this order</span><span class="font-medium tabular-nums">62%</span></div>
      <div class="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100"><div class="h-full rounded-full bg-zinc-700" style="width:62%"></div></div>
    </div>
  </div>
  <div class="grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-200 text-center">
    <div class="px-3 py-3">
      <p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Received</p>
      <p class="mt-1 text-[16px]/6 font-semibold tabular-nums">₹11,42,040</p>
    </div>
    <div class="px-3 py-3">
      <p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Invoiced</p>
      <p class="mt-1 text-[16px]/6 font-semibold tabular-nums">₹9,80,000</p>
    </div>
    <div class="px-3 py-3">
      <p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Balance</p>
      <p class="mt-1 text-[16px]/6 font-semibold tabular-nums">₹6,99,960</p>
    </div>
  </div>
</div>` },
      { id: 'section', name: 'Section card', code:
`<div class="rounded-xl border border-zinc-200 bg-white px-5 py-5">
  <h2 class="text-[16px]/6 font-semibold">Approval policy</h2>
  <p class="mt-1 max-w-prose text-[13px]/5 text-zinc-600">
    Who has to sign off before an order is released to the vendor. Changes apply to orders raised from tomorrow onward.
  </p>
  <div class="mt-4 space-y-3 border-t border-zinc-100 pt-4">
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="checkbox" checked class="mt-0.5 size-4 rounded accent-zinc-700">
      <span>Require a second approver above ₹5,00,000
        <span class="mt-0.5 block text-[12px]/4 text-zinc-500">Currently routed to Nilesh Patil, Head of Procurement</span>
      </span>
    </label>
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="checkbox" checked class="mt-0.5 size-4 rounded accent-zinc-700">
      <span>Block release when the vendor has no active rate contract
        <span class="mt-0.5 block text-[12px]/4 text-zinc-500">14 vendors would be affected today</span>
      </span>
    </label>
  </div>
</div>` },

      { id: 'table', name: 'Holding a table', code:
`<!-- The one case where the body takes no padding. The table sits flush so its
     rules run into the card's border and the header row meets the corners; add
     px-5 py-4 here and the whole table floats inside an edge it never touches.

     The footer is the totals row. It belongs in the card rather than the table
     because it is a summary of the query, not another record. -->
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-5 py-3.5">
    <div class="min-w-0">
      <h2 class="text-[14px]/5 font-semibold">Order lines</h2>
      <p class="text-[12px]/4 text-zinc-600">4 of 9 lines · PO-24-1187</p>
    </div>
    <button type="button" class="inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100">
      <i data-lucide="download" class="size-4 text-zinc-600"></i>Export
    </button>
  </div>

  <table class="w-full table-fixed text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-100 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="px-5 py-2 font-medium">Item</th>
        <th scope="col" class="hidden w-24 px-5 py-2 text-right font-medium sm:table-cell">Qty</th>
        <th scope="col" class="w-32 px-5 py-2 text-right font-medium">Value</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="truncate px-5 py-2.5">MS angle 50×50×6</td>
        <td class="hidden px-5 py-2.5 text-right tabular-nums sm:table-cell">1,200 kg</td>
        <td class="px-5 py-2.5 text-right tabular-nums">₹6,84,000</td>
      </tr>
      <tr class="border-b border-zinc-100">
        <td class="truncate px-5 py-2.5">MS plate 8mm</td>
        <td class="hidden px-5 py-2.5 text-right tabular-nums sm:table-cell">860 kg</td>
        <td class="px-5 py-2.5 text-right tabular-nums">₹5,16,000</td>
      </tr>
      <tr class="border-b border-zinc-100">
        <td class="truncate px-5 py-2.5">Channel 100×50</td>
        <td class="hidden px-5 py-2.5 text-right tabular-nums sm:table-cell">440 kg</td>
        <td class="px-5 py-2.5 text-right tabular-nums">₹3,08,000</td>
      </tr>
      <tr>
        <td class="truncate px-5 py-2.5">Flat 40×6</td>
        <td class="hidden px-5 py-2.5 text-right tabular-nums sm:table-cell">390 kg</td>
        <td class="px-5 py-2.5 text-right tabular-nums">₹1,95,000</td>
      </tr>
    </tbody>
  </table>

  <div class="flex items-center justify-between border-t border-zinc-200 bg-zinc-100 px-5 py-3">
    <span class="text-[12px]/4 text-zinc-600">Subtotal, 4 of 9 lines</span>
    <span class="text-[14px]/5 font-semibold tabular-nums">₹17,03,000</span>
  </div>
</div>` },

      { id: 'clickable', name: 'The whole card is a link', code:
`<!-- One anchor around the whole panel, so the target is the size of the card
     rather than the size of its title.

     It therefore contains no other link or button. A control nested inside an
     anchor cannot be reached by keyboard and is ambiguous by mouse; if the card
     needs a second action, the card stops being the link and the title becomes
     one instead.

     The chevron is aria-hidden — the accessible name is already the whole
     card's text, and "chevron right" adds nothing to it. -->
<div class="grid max-w-2xl items-start gap-3 sm:grid-cols-2">
  <a href="#" class="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-400">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="truncate text-[14px]/5 font-semibold tabular-nums">PO-24-1187</h3>
        <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Gujarat Polymers Ltd</p>
      </div>
      <i data-lucide="chevron-right" class="size-4 shrink-0 text-zinc-500 transition group-hover:text-zinc-900" aria-hidden="true"></i>
    </div>
    <div class="mt-3 flex items-center justify-between gap-2">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
      </span>
      <span class="text-[13px]/5 font-medium tabular-nums">₹4,82,000</span>
    </div>
  </a>

  <a href="#" class="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-400">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="truncate text-[14px]/5 font-semibold tabular-nums">PO-24-1186</h3>
        <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Konkan Fabricators</p>
      </div>
      <i data-lucide="chevron-right" class="size-4 shrink-0 text-zinc-500 transition group-hover:text-zinc-900" aria-hidden="true"></i>
    </div>
    <div class="mt-3 flex items-center justify-between gap-2">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
      </span>
      <span class="text-[13px]/5 font-medium tabular-nums">₹1,15,400</span>
    </div>
  </a>
</div>` },

      { id: 'grid', name: 'A row of cards', code:
`<!-- items-start is the whole point. A grid stretches its children to the
     tallest by default, which pads the short cards with dead space at the
     bottom and makes them read as though data is missing.

     Let them size to their content and the ragged bottom edge is honest. -->
<div class="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
  <div class="rounded-xl border border-zinc-200 bg-white">
    <div class="border-b border-zinc-200 px-5 py-3.5">
      <h3 class="text-[14px]/5 font-semibold">Vendor</h3>
    </div>
    <div class="px-5 py-4 text-[13px]/5">
      <p class="font-medium">Gujarat Polymers Ltd</p>
      <p class="mt-0.5 text-zinc-600">Vapi, Gujarat</p>
      <p class="mt-2 text-zinc-600">GSTIN <span class="tabular-nums">24AABCG1234M1Z5</span></p>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-200 bg-white">
    <div class="border-b border-zinc-200 px-5 py-3.5">
      <h3 class="text-[14px]/5 font-semibold">Delivery</h3>
    </div>
    <div class="px-5 py-4 text-[13px]/5">
      <p>FOR Silvassa plant</p>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-200 bg-white">
    <div class="border-b border-zinc-200 px-5 py-3.5">
      <h3 class="text-[14px]/5 font-semibold">Approvals</h3>
    </div>
    <div class="divide-y divide-zinc-100 text-[13px]/5">
      <div class="flex items-center gap-3 px-5 py-2.5">
        <span class="inline-flex size-7 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-medium text-zinc-600 ring-1 ring-inset ring-zinc-300" aria-hidden="true">NP</span>
        <span class="min-w-0 flex-1 truncate">Nilesh Patil</span>
        <span class="text-[12px]/4 tabular-nums text-zinc-500">14 Aug</span>
      </div>
      <div class="flex items-center gap-3 px-5 py-2.5">
        <span class="inline-flex size-7 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-medium text-zinc-600 ring-1 ring-inset ring-zinc-300" aria-hidden="true">RD</span>
        <span class="min-w-0 flex-1 truncate">Ritu Deshpande</span>
        <span class="text-[12px]/4 tabular-nums text-zinc-500">15 Aug</span>
      </div>
    </div>
  </div>
</div>` },

      { id: 'empty', name: 'With nothing in it', code:
`<!-- A card whose body is empty still keeps its header, because the header is
     what the rest of the page refers to. What changes is the body: it says what
     would be here and offers the one action that would put something in it.

     No border and no fill on the inner block — a dashed box inside a bordered
     card is a card inside a card. -->
<div class="max-w-md rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-3.5">
    <h2 class="text-[14px]/5 font-semibold">Attached documents</h2>
  </div>
  <div class="px-5 py-10 text-center">
    <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="paperclip" class="size-5 text-zinc-600"></i>
    </span>
    <p class="mt-3 text-[14px]/5 font-medium">No documents yet</p>
    <p class="mx-auto mt-1 max-w-[34ch] text-[13px]/5 text-zinc-600">
      The quotation and drawing are usually attached before the order goes to the vendor.
    </p>
    <button type="button" class="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
      <i data-lucide="upload" class="size-4"></i>Attach a document
    </button>
  </div>
</div>` },

      { id: 'django', name: 'Django loop', code:
`<!-- One card per record, and the empty case handled by {% empty %} rather than
     by a separate {% if %} further up the template — the two get out of step
     otherwise, and the page renders an empty grid with a heading over it.

     get_absolute_url on the model, not a hard-coded path, so the card keeps
     working when the URL conf moves. Nothing else in the card is a link. -->
<div class="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
  {% for order in orders %}
    <a href="{{ order.get_absolute_url }}"
       class="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-400">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="truncate text-[14px]/5 font-semibold tabular-nums">{{ order.number }}</h3>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">{{ order.vendor.name }}</p>
        </div>
        <i data-lucide="chevron-right" class="size-4 shrink-0 text-zinc-500 transition group-hover:text-zinc-900" aria-hidden="true"></i>
      </div>
      <div class="mt-3 flex items-center justify-between gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full {{ order.status|status_dot }}" aria-hidden="true"></span>{{ order.get_status_display }}
        </span>
        <span class="text-[13px]/5 font-medium tabular-nums">₹{{ order.value|intcomma }}</span>
      </div>
    </a>
  {% empty %}
    <div class="rounded-xl border border-zinc-200 bg-white px-5 py-10 text-center sm:col-span-2 lg:col-span-3">
      <p class="text-[14px]/5 font-medium">No orders match this filter</p>
      <p class="mx-auto mt-1 max-w-[38ch] text-[13px]/5 text-zinc-600">Clear the filters, or widen the date range.</p>
    </div>
  {% endfor %}
</div>` }
    ]
  },

  {
    id: 'separator', name: 'Separator', category: 'layout',
    description: 'The rule that divides content. Almost always a border on the thing beside it rather than an element of its own, and almost always silent to a screen reader.',
    when: 'Between two blocks of the same weight and the same width where nothing else says one has ended — the rows of a list, a footer that totals what is above it, the destructive item at the foot of a menu. Not between a heading and its body, and not between sections that already sit in separate cards: those are already separated, and a line there is decoration pretending to be structure.',
    notes: [
      'Most of the time the right separator is no separator. Whitespace groups content perfectly well and costs nothing to read — a card title and its body are told apart by mt-1 and a weight change, with no rule between them. A line earns its place only when two blocks are the same size, the same width and adjacent, which is why the ones in this library are nearly all inside a card. Rule off every paragraph and the page reads as a form from 1998; by the fourth rule none of them means anything.',
      'The common divider is decorative and carries no role. There is nothing to announce and nothing to hide: a border is not an element at all, and a bare div is not a separator. Measured in Chrome\'s accessibility tree, divide-y, border-t and <div class="h-px bg-zinc-200"> all resolve to a generic node with no name, which is exactly right. aria-hidden on a border is noise for the same reason. The semantic cases are two, and both are narrow: a menu, where role="separator" is what tells a screen reader the destructive item is in a group of its own, and running prose where the subject genuinely changes, which is <hr>.',
      '<hr> is already the whole component under this stack, and is still the wrong tag for a list. Preflight zeroes its margins and gives it height 0 with border-top-width 1px, so <hr class="border-zinc-200"> measures exactly 1px tall and full width with no margin, and resolves to role="separator" with orientation horizontal — there is no h-px, no border-t and no role left to add. What it is wrong for is rows: forty <hr>s down a table of order lines announce forty separators nobody asked for, which is what the card entry means when it says dividers are borders.',
      'divide-y on the parent is the default, and it has exactly one failure. Tailwind v4 compiles divide-y to a border-bottom on & > :not(:last-child) — a DOM position, not a visibility. Hiding a middle row or the first row is therefore correct: measured, a four-row card went from 181px to 136px with the middle row x-shown away and the two remaining rules landed between the visible rows. Hiding the LAST row is not: the row above it is still not :last-child, keeps its border, and the card ends on a rule with nothing under it — measured 137px against 136px, and the extra pixel is the stray line. x-if is no better, because Alpine leaves the <template> in the DOM and the template takes the :last-child slot; measured, two visible rows still drew two rules. So put anything conditional outside the divided group with a border of its own, or render it server-side where {% if %} really does remove the node.',
      'A border on each child fails at the other end, and a border on a group member is worse. Per-child border-t survives a hidden last row and breaks on a hidden first one — measured 92px against 91px, the extra pixel being a rule across the top of the panel with nothing above it. It also does not survive being pasted anywhere else: the rule belongs to the row, so the row takes a line with it into whatever container it lands in, which divide-y never does. The sharpest version of this is the dropdown menu, which currently hangs its divider off the destructive button: measured with the two items above it conditionally hidden, the border still paints 5px below the panel\'s top edge — a rule introducing nothing. A separator that belongs to a group is its own element, not a border on one of the members.',
      'A standalone element between rows is the worst of the three. It needs the same condition as the row it introduces and nobody remembers to give it one: measured, hiding the row between two standalone rules left both in the document one pixel apart, at y 558 and y 559, which paints as a 2px band. Standalone is for a menu or a toolbar, where the separator is semantic and belongs to the group rather than to a row.',
      'Two shades and the rule is the length of the line. A horizontal rule inside a card that already has a zinc-200 border is divide-zinc-100 or border-zinc-100 — the registry does this in 15 of 15 divide-y uses. A full-width strip that changes what the region is — a card header, a footer that totals, a sticky action bar — is border-zinc-200, because it is an edge and not a divider. Every vertical rule is zinc-200 regardless: a horizontal rule is 300px of ink and zinc-100 carries it, a vertical one is 16px and zinc-100 vanishes. Never a zinc-100 rule on the zinc-100 page ground — measured, the line and the surface compute to the identical colour, so it is not low contrast, it is absent. On white at devicePixelRatio 1 a zinc-100 rule paints rgb(244,244,245) against rgb(255,255,255) and a zinc-200 rule paints rgb(228,228,231); that first one is already at the floor, which is why it only ever sits on white.',
      'A rule is not a tinted shape, so it takes no ring. The ring exists to hold the edge of a filled shape against the surface behind it, and a line one pixel tall is entirely edge. Measured: ring-1 ring-inset ring-zinc-300 on a 1px rule adds no height at all and simply repaints the whole line zinc-300, so the only thing it changed was the shade you already chose; without ring-inset it paints a 3px sandwich of zinc-300, zinc-200, zinc-300 where a 1px divider was wanted.',
      'A vertical rule has no height of its own. In flex items-center — every toolbar and meta line here — a bare w-px div measured 0px tall and painted nothing at all. h-5 is the answer beside controls: a fixed 20px whatever the neighbours do, so a row holding a 13px label and a 24px figure does not grow a rule as tall as the figure. self-stretch is the answer when the rule should run the whole row: measured 28px in a row whose tallest item was 28px, which means it tracks whichever neighbour got taller. Add shrink-0 either way, or flex takes the pixel back when the row is tight. For a fixed set of columns, divide-x on the grid is simpler than any of this and cannot be left behind by a hidden child.',
      'A labelled rule is a heading with decoration, not a separator with a label. Put the text in the h2 or h3 the page outline already wants and make the two lines aria-hidden spans with flex-1 — measured, the label then appears in the accessibility tree as a level-3 heading and the lines appear nowhere, which is what somebody skimming by heading needs. A role="separator" carrying aria-label reads the same words out but adds nothing to the outline. The exception is a label that names a choice rather than a section — the "or" between two ways of signing in — which is plain text between two hidden lines and no role at all.',
      'A 1px rule is 1 CSS pixel at every density, and only fractional densities soften it. Measured off the rendered pixels: at devicePixelRatio 1 every form — h-px, border-t and <hr> alike — paints one device row at full strength; at 2 it paints two device rows at full strength; at 1.5 it paints one full row plus one half-strength row, and which side gets the soft row depends on where the rule landed in the layout, so two rules in the same card can blur on opposite edges. Nothing disappears and nothing needs a fix. It is one more reason zinc-100 only ever sits on white: at 1.5 its soft row measured rgb(249,249,250), six values off the background.'
    ],
    anatomy: [
      ['Rule', 'One CSS pixel of colour and nothing else — border-t border-zinc-100 on the block below it, or h-px bg-zinc-100 as an element where the line has to stand alone.'],
      ['Divided group', 'divide-y divide-zinc-100 on the parent of a set of rows. The rule belongs to the list, so a row carries no line out with it.'],
      ['Strip', 'border-t border-zinc-200 on a block that ends a region — a totals bar, a footer, a conditional summary. Darker than a divider because it is an edge.'],
      ['Vertical rule', 'h-5 w-px shrink-0 bg-zinc-200 between clusters in a toolbar, or divide-x divide-zinc-200 across a fixed grid of columns.'],
      ['Label', 'The middle of a labelled rule: a real heading, with flex-1 aria-hidden spans either side carrying the line.'],
      ['Menu separator', 'The one that is semantic. role="separator" as its own element inside role="menu", my-1 h-px bg-zinc-100, sitting above the destructive item.']
    ],
    behaviour: [
      'A rule is 1px at every zoom and every density. It never scales with the text around it and never carries a second weight for emphasis.',
      'A horizontal rule inside a card runs the full width of the card, which means the padding belongs to the rows and not to the group holding them. Put the padding on the parent and every rule is inset by it, which reads as a crack in the card rather than a divider across it.',
      'A divided group\'s rules are on the parent, so hiding a row moves the remaining lines and does not leave one behind — except at the last row, which is why a conditional block sits outside the group with its own border.',
      'A vertical rule takes its height from a utility, never from its neighbours. Given none, it renders at zero and disappears.',
      'Nothing is focusable, nothing responds to hover, and nothing animates. A separator that can be dragged is a splitter, which is a different control and not one this library has.',
      'At 390px every form here holds without scrolling sideways: the toolbar rule stays 20px, the three-column divide-x grid stays three columns, and a labelled rule keeps a visible line on both sides of the label.'
    ],
    a11y: [
      'The default divider has no role at all. It is a border, or a div with a background and no name, and it resolves to a generic node — silent, which is correct for a line that only groups things visually.',
      'Never put aria-hidden on a border. There is no element to hide, and on a bare div it is redundant with having no name.',
      'role="separator" is for a menu or a toolbar, where a screen reader has no other way to learn that the items above and below it are different groups. Verified in the tree: the menu exposes menuitem, menuitem, separator, menuitem.',
      'A vertical separator that is genuinely semantic adds aria-orientation="vertical", which resolves as orientation vertical. A decorative one adds nothing.',
      'The label on a labelled rule is a heading, so it lands in the page outline; the lines beside it are aria-hidden and land nowhere.',
      'Do not put a separator inside a list. role="list" permits listitem children, and an <li role="separator"> is exposed by Chrome as a separator sitting among the items — divide the list with divide-y and leave the list a list.',
      '<hr> already carries role="separator" with a horizontal orientation, which is why it belongs where the subject changes and not between forty rows.'
    ],
    related: ['card', 'dropdown', 'button-group'],
    variants: [
      { id: 'default', name: 'Horizontal rule', code:
`<!-- The common divider is a border on the block below it, and it carries no
     role. A line between two paragraphs of the same section groups them for the
     eye; announced as a separator it is one more thing to step over. Measured,
     this rule resolves to a generic node with no name, which is right, and
     needs no aria-hidden because there is no element to hide.

     zinc-100 because the card around it is already zinc-200. On the page ground
     the two would be the identical colour and the line would not be faint, it
     would be missing.

     The <hr> is the other case and the rarer one: the subject changes. Under
     preflight it is already a 1px full-width rule with no margins and already
     role="separator" — border-zinc-200 sets its colour and there is nothing
     else to add. Use it where you would start a new heading, never between the
     rows of a list. -->
<div class="max-w-md rounded-xl border border-zinc-200 bg-white p-5">
  <h2 class="text-[16px]/6 font-semibold">Payment terms</h2>
  <p class="mt-1 text-[13px]/5 text-zinc-600">45 days from GRN, against a clean receipt note.</p>

  <div class="mt-4 border-t border-zinc-100 pt-4">
    <p class="text-[13px]/5 text-zinc-600">Retention of 5% is released after the trial run is signed off.</p>
  </div>

  <hr class="my-5 border-zinc-200">

  <h3 class="text-[13px]/5 font-medium">Amendment history</h3>
  <p class="mt-1 text-[12px]/4 text-zinc-500">Two revisions since release, both to the delivery date.</p>
</div>` },

      { id: 'rows', name: 'Rows in a card', code:
`<!-- divide-y on the parent, not a border on each row. The rule then belongs to
     the list rather than to the row, so a row pasted into another container
     does not take a stray line with it.

     Tailwind v4 compiles divide-y to a border-bottom on & > :not(:last-child),
     which is a DOM position and not a visibility. Hiding a middle row is
     therefore fine — measured, the container went 181px to 136px and the
     remaining rules landed between the visible rows. Hiding the last row is
     not: the row above it is still not :last-child, so it keeps its border and
     the card ends on a rule with nothing under it. Measured 137px against
     136px, and the extra pixel is that line. An x-if does not help either,
     because Alpine leaves the <template> in the DOM and the template takes the
     :last-child slot.

     So the conditional block sits outside the divided group and brings its own
     border. It is border-zinc-200 rather than zinc-100 because it is a strip
     that ends the card, the same weight as the header above it, not another
     row. x-cloak because it is hidden at first paint. -->
<div class="max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white" x-data="{ cancelled: false }">
  <div class="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3.5">
    <h2 class="text-[14px]/5 font-semibold">Order lines</h2>
    <button type="button" @click="cancelled = !cancelled"
            class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2"
            x-text="cancelled ? 'Hide cancelled' : 'Show cancelled'">Show cancelled</button>
  </div>

  <dl class="divide-y divide-zinc-100 text-[13px]/5">
    <div class="flex items-center justify-between gap-4 px-5 py-2.5">
      <dt class="min-w-0 truncate text-zinc-600">MS angle 50×50×6</dt>
      <dd class="shrink-0 tabular-nums">₹6,84,000</dd>
    </div>
    <div class="flex items-center justify-between gap-4 px-5 py-2.5">
      <dt class="min-w-0 truncate text-zinc-600">MS plate 8mm</dt>
      <dd class="shrink-0 tabular-nums">₹5,16,000</dd>
    </div>
    <div class="flex items-center justify-between gap-4 px-5 py-2.5">
      <dt class="min-w-0 truncate text-zinc-600">Channel 100×50</dt>
      <dd class="shrink-0 tabular-nums">₹3,08,000</dd>
    </div>
  </dl>

  <div x-show="cancelled" x-cloak
       class="border-t border-zinc-200 bg-zinc-100 px-5 py-2.5 text-[12px]/4 text-zinc-600">
    2 cancelled lines worth <span class="tabular-nums">₹1,04,000</span>, not counted above.
  </div>
</div>` },

      { id: 'vertical', name: 'Vertical', code:
`<!-- A vertical rule has no height of its own. In flex items-center a bare
     w-px div measured 0px tall and painted nothing; h-5 gives it a fixed 20px
     that does not grow when a neighbour does. shrink-0 keeps flex from taking
     the pixel back when the row is tight.

     zinc-200, not zinc-100. This line is 20px long against a horizontal rule's
     300px, and zinc-100 at that length is invisible.

     Neither rule carries a role. The clusters either side are already named by
     role="group" and an aria-label, which tells a screen reader far more than a
     separator between them would; the line is what the eye uses to see the
     grouping the label already states.

     For a fixed set of columns, divide-x on the grid is the whole job — no
     heights to manage and no element that can be left behind by a hidden
     child. -->
<div class="space-y-3">
  <div class="flex max-w-md flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2">
    <div role="group" aria-label="Row height" class="flex items-center gap-1">
      <button type="button" aria-label="Compact rows" aria-pressed="true"
              class="flex size-8 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="align-justify" class="size-4 text-zinc-700"></i>
      </button>
      <button type="button" aria-label="Comfortable rows" aria-pressed="false"
              class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
        <i data-lucide="menu" class="size-4"></i>
      </button>
    </div>

    <div class="h-5 w-px shrink-0 bg-zinc-200"></div>

    <div role="group" aria-label="Export" class="flex items-center gap-1">
      <button type="button" aria-label="Download CSV"
              class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
        <i data-lucide="download" class="size-4"></i>
      </button>
      <button type="button" aria-label="Print"
              class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
        <i data-lucide="printer" class="size-4"></i>
      </button>
    </div>
  </div>

  <div class="grid max-w-md grid-cols-3 divide-x divide-zinc-200 rounded-xl border border-zinc-200 bg-white text-center">
    <div class="px-3 py-3">
      <p class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Received</p>
      <p class="mt-1 text-[16px]/6 font-semibold tabular-nums">₹11,42,040</p>
    </div>
    <div class="px-3 py-3">
      <p class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Invoiced</p>
      <p class="mt-1 text-[16px]/6 font-semibold tabular-nums">₹9,80,000</p>
    </div>
    <div class="px-3 py-3">
      <p class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Balance</p>
      <p class="mt-1 text-[16px]/6 font-semibold tabular-nums">₹6,99,960</p>
    </div>
  </div>
</div>` },

      { id: 'labelled', name: 'With a label', code:
`<!-- The label is a heading, not a separator with a name. It says what follows,
     which is what a heading is for, and it then appears in the page outline for
     anyone skimming by heading — measured, this one resolves as a level-3
     heading while the two lines beside it resolve to nothing at all. Wrapping
     the row in role="separator" with an aria-label reads the same words out and
     leaves the outline empty.

     flex-1 on the lines and shrink-0 on the label: the label keeps its width
     and the lines take whatever is left, so at 390px there is still a visible
     rule on both sides rather than one line and a stub.

     The second one is the exception — a label that names a choice rather than a
     section. "or" is plain text with no role, because that is exactly what it
     is; only the lines are hidden. -->
<div class="max-w-md rounded-xl border border-zinc-200 bg-white p-5">
  <p class="text-[13px]/5 text-zinc-600">Nine lines released to the vendor on 04 Aug 2026.</p>

  <div class="mt-5 flex items-center gap-3">
    <span class="h-px flex-1 bg-zinc-200" aria-hidden="true"></span>
    <h3 class="shrink-0 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Amendments</h3>
    <span class="h-px flex-1 bg-zinc-200" aria-hidden="true"></span>
  </div>

  <p class="mt-3 text-[13px]/5 text-zinc-600">Rev C moved the delivery date to 28 Aug 2026.</p>

  <div class="mt-5 flex items-center gap-3">
    <span class="h-px flex-1 bg-zinc-200" aria-hidden="true"></span>
    <span class="shrink-0 text-[12px]/4 text-zinc-500">or</span>
    <span class="h-px flex-1 bg-zinc-200" aria-hidden="true"></span>
  </div>
</div>` },

      { id: 'menu', name: 'Inside a menu', code:
`<!-- The one place the separator is real. A menu is a list of peers, and the
     only thing saying Cancel order is not another Print is the line above it —
     so that line has to be in the accessibility tree too. Measured, the panel
     exposes menuitem, menuitem, separator, menuitem.

     It is its own element, not a border-t on the destructive button. Hang it
     off the button and it belongs to the button: measured with the items above
     it conditionally hidden, the border still painted 5px below the panel's top
     edge, introducing nothing. As its own element it can be dropped in the same
     {% if %} as the item it introduces.

     zinc-100 and full bleed, my-1 for the breathing room the items already have
     through their padding. The panel is the zinc-200 edge; the divider inside
     it is a step lighter, the same as in any card. -->
<div class="relative max-w-xs" x-data="{ open: false }" @click.outside="open = false">
  <button type="button" @click="open = !open" :aria-expanded="open" aria-haspopup="menu"
          class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="ellipsis" class="size-4 text-zinc-600"></i>Actions
  </button>

  <div x-show="open" x-cloak role="menu" aria-label="Order actions"
       class="absolute left-0 z-40 mt-1 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
      <i data-lucide="pencil" class="size-4 text-zinc-600"></i>Amend
    </button>
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
      <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print
    </button>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100">
      <i data-lucide="trash-2" class="size-4"></i>Cancel order
    </button>
  </div>
</div>` },

      { id: 'django', name: 'Django partial', code:
`<!-- Two shapes, one file. What is worth centralising is not the div — it is
     the shade rule, that a horizontal rule inside a bordered panel is zinc-100
     and a vertical one is zinc-200. The fortieth template to need a divider is
     the one that gets it wrong.

     The tag is for the standalone cases only: a menu, a toolbar. A divided list
     needs no tag at all, because there is nothing to repeat — it is one class
     on the wrapper.

     And the server is the only place divide-y is safe on a list that can
     change. {% if %} removes the node, so :last-child lands on the last row
     that actually rendered. Alpine cannot do this: x-show leaves the row in the
     DOM and x-if leaves the <template> in the DOM, and either way the rule
     above the hidden row is stranded at the bottom of the card.

     # templatetags/ui.py
     @register.inclusion_tag('ui/_separator.html')
     def separator(orientation='horizontal'):
         return {'vertical': orientation == 'vertical'}

     # templates/ui/_separator.html
     {% if vertical %}
       <div role="separator" aria-orientation="vertical" class="h-5 w-px shrink-0 bg-zinc-200"></div>
     {% else %}
       <div role="separator" class="my-1 h-px bg-zinc-100"></div>
     {% endif %} -->
{% load humanize ui %}

<div role="menu" aria-label="Order actions"
     class="w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
  {% for action in order.menu_actions %}
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
      <i data-lucide="{{ action.icon }}" class="size-4 text-zinc-600"></i>{{ action.label }}
    </button>
  {% endfor %}

  {# the separator sits in the same if-block as the item it introduces #}
  {% if order.can_cancel %}
    {% separator %}
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100">
      <i data-lucide="trash-2" class="size-4"></i>Cancel order
    </button>
  {% endif %}
</div>

<dl class="mt-4 divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white text-[13px]/5">
  {% for line in order.active_lines %}
    <div class="flex items-center justify-between gap-4 px-5 py-2.5">
      <dt class="min-w-0 truncate text-zinc-600">{{ line.item }}</dt>
      <dd class="shrink-0 tabular-nums">₹{{ line.value|intcomma }}</dd>
    </div>
  {% empty %}
    <p class="py-4 text-center text-[13px]/5 text-zinc-500">No open lines on this order.</p>
  {% endfor %}
</dl>` }
    ]
  },

  {
    id: 'carousel', name: 'Carousel', category: 'layout',
    description: 'A horizontal rail of items that snaps one item at a time. CSS scroll snap does the moving; the arrows and the counter are the only JavaScript.',
    when: 'A set of items that will not fit and does not need comparing: photographs against an inspection, drawings on a job, a strip of cards on a phone where the desktop layout is a grid. Never for anything that has to be read in full or compared across rows — that is a table or a grid, and both show everything at once.',
    notes: [
      'No autoplay, ever. Nothing moves unless a person moved it. A rail that advances on a timer pulls the row out from under the cursor mid-read, and there is no rotation speed that is right for two different readers.',
      'The engine is CSS scroll snap, never a translated track. snap-x snap-mandatory overflow-x-auto on the rail, snap-start shrink-0 on each item. Touch, trackpad, keyboard and find-in-page all work before a line of JavaScript is written; a transform track has to reimplement every one of them and gets most of them wrong.',
      'This is the one component allowed to scroll sideways on a phone. The rule holds everywhere else. It is allowed here because the scroll is the component, it snaps, and the next item peeks so nobody has to guess there is more.',
      'Every item stays in the DOM and none of them is aria-hidden. Offscreen is not hidden — Ctrl+F must find the sixth card and the tab order must reach the link inside it.',
      'It is a scrolling region, not an ARIA carousel. The rail takes role="group", an accessible name and tabindex="0", because a scrollable region that cannot be focused cannot be scrolled by keyboard at all. aria-roledescription="carousel" describes the rotating banner this deliberately is not.',
      'A counter reads "item i of n" and is only honest when one item fills the rail. With two or three visible it is a lie — drop it and let the arrows and the peek carry it. Dots have the same constraint, and stop being aimable past about six.',
      'The counter is not a live region. It would fire on every frame of a swipe. Nothing needs announcing: every slide is already in the DOM and reachable, so nothing is being hidden from a screen reader.',
      'Arrows are a pointer affordance, hidden below md where the gesture is a swipe and a 32px target beside a thumb is a miss. They disable at the ends instead of wrapping — a rail that jumps back to the first item hides the fact that the last one was the last one.',
      'Scroll by a measured delta, never by clientWidth. The target item\'s getBoundingClientRect minus the rail\'s, less the rail\'s scroll-padding, lands exactly on the snap point at every breakpoint. Paging by container width drifts the moment an item is a fraction of it, and drops the last partial page.',
      'Filter <template> out before counting items. Alpine leaves the x-for template in the DOM as an element child, so children.length comes back one too many and a six-photo gallery counts to seven.',
      'Smooth scrolling has to check prefers-reduced-motion itself. behavior: "smooth" ignores the media query, so read it and pass "auto" instead.',
      'The scrollbar is hidden on the rail: the peek, the arrows and the counter already say it scrolls, and a classic scrollbar adds 15px of grey under every row on Windows. It takes both [scrollbar-width:none] and [&::-webkit-scrollbar]:hidden — Firefox honours the first, Chrome and Safari the second.'
    ],
    anatomy: [
      ['Rail', 'The scroll container: flex, snap-x snap-mandatory, overflow-x-auto, tabindex="0" and a name. Everything else is optional.'],
      ['Item', 'snap-start shrink-0 with a declared width — w-72 for a strip of records, basis-[86%] sm:basis-1/2 for a gallery that peeks.'],
      ['Peek', 'The sliver of the next item left visible by sizing items under 100%. It is the affordance; without it a rail reads as a static panel.'],
      ['Arrows', 'A disabled-at-the-ends pair, hidden below md. Either in the header beside the title, or overlaid on an image.'],
      ['Indicator', 'A counter or a row of dots, and only when one item fills the rail. Both are optional; neither is a live region.'],
      ['Header', 'The title and the controls on one line above the rail, or the card header when the rail lives inside a card.']
    ],
    behaviour: [
      'Nothing moves on its own. There is no autoplay, no pause control, and no timer to get wrong.',
      'Dragging, swiping, a trackpad and shift+wheel all move the rail natively, and it settles on a snap point.',
      'The arrows step one item and stop at the ends. They never wrap.',
      'Arrow keys step the rail when the rail itself has focus, and are left alone when focus is inside an item, so a field inside a card still takes its own keystrokes.',
      'The active index is read back from scroll position, not tracked separately, so a swipe, an arrow click and a tab into an offscreen item all agree.',
      'Below md the arrows are gone and the gesture is the whole interface, which is why the peek and the snap are not optional.'
    ],
    a11y: [
      'The rail is focusable with tabindex="0" and carries role="group" plus an accessible name — a scrollable region with no tab stop is unreachable by keyboard.',
      'No aria-roledescription="carousel" and no slide roles. This is a scrolling list of real content, and describing it as a carousel promises rotation semantics that do not exist here.',
      'Offscreen items are never aria-hidden and never removed. They stay findable, tabbable and readable in DOM order.',
      'Arrow buttons carry aria-label ("Previous purchase order", not "Previous") and are genuinely disabled at the ends, not just faded.',
      'The counter is plain text. Making it a live region turns one swipe into a stream of announcements for no information a reader cannot already get.',
      'Dots are buttons with a label naming the destination, and the current one carries aria-current, so the set is usable without seeing which is filled.'
    ],
    related: ['card', 'attachment', 'pagination'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div x-data="{
       i: 0, n: 0, atStart: true, atEnd: true,
       slides() { return Array.from(this.$refs.rail.children).filter(el => el.localName !== 'template'); },
       pad() { return parseFloat(getComputedStyle(this.$refs.rail).scrollPaddingLeft) || 0; },
       sync() {
         const r = this.$refs.rail, s = this.slides(), edge = r.getBoundingClientRect().left + this.pad();
         this.n = s.length;
         this.atStart = r.scrollLeft < 2;
         this.atEnd = r.scrollLeft > r.scrollWidth - r.clientWidth - 2;
         const near = s.map((el, k) => [Math.abs(el.getBoundingClientRect().left - edge), k]).sort((a, b) => a[0] - b[0]);
         this.i = near.length ? near[0][1] : 0;
       },
       go(k) {
         const r = this.$refs.rail, s = this.slides(), el = s[Math.min(Math.max(k, 0), s.length - 1)];
         if (!el) return;
         r.scrollBy({ left: el.getBoundingClientRect().left - r.getBoundingClientRect().left - this.pad(),
                      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
       }
     }"
     x-init="sync()"
     @resize.window.debounce="sync()">

  <div class="mb-3 flex items-center justify-between gap-3">
    <h3 class="text-[14px]/5 font-semibold">Orders awaiting approval</h3>
    <div class="hidden items-center gap-1 md:flex">
      <button type="button" @click="go(i - 1)" :disabled="atStart" aria-label="Previous orders"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>
      <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="More orders"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </div>

  <div x-ref="rail" @scroll.passive="sync()" tabindex="0" role="group" aria-label="Orders awaiting approval"
       @keydown.arrow-right="if ($event.target === $refs.rail) { $event.preventDefault(); go(i + 1); }"
       @keydown.arrow-left="if ($event.target === $refs.rail) { $event.preventDefault(); go(i - 1); }"
       class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

    <article class="w-72 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-[14px]/5 font-semibold">PO-24-1187</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Gujarat Polymers Ltd</p>
        </div>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
        </span>
      </div>
      <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Value</dt>
          <dd class="text-[12px]/4 font-medium tabular-nums">₹18,42,000</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
          <dd class="text-[12px]/4 tabular-nums">28 Aug 2026</dd>
        </div>
      </dl>
    </article>

    <article class="w-72 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-[14px]/5 font-semibold">PO-24-1191</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Nashik Steel Traders</p>
        </div>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
        </span>
      </div>
      <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Value</dt>
          <dd class="text-[12px]/4 font-medium tabular-nums">₹4,68,500</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
          <dd class="text-[12px]/4 tabular-nums text-red-600">11 Aug 2026</dd>
        </div>
      </dl>
    </article>

    <article class="w-72 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-[14px]/5 font-semibold">PO-24-1194</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Sharma Extrusions</p>
        </div>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
        </span>
      </div>
      <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Value</dt>
          <dd class="text-[12px]/4 font-medium tabular-nums">₹96,750</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
          <dd class="text-[12px]/4 tabular-nums">04 Sep 2026</dd>
        </div>
      </dl>
    </article>

    <article class="w-72 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-[14px]/5 font-semibold">PO-24-1198</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Deshpande Traders</p>
        </div>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Closed
        </span>
      </div>
      <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Value</dt>
          <dd class="text-[12px]/4 font-medium tabular-nums">₹2,31,900</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
          <dd class="text-[12px]/4 tabular-nums">02 Aug 2026</dd>
        </div>
      </dl>
    </article>

    <article class="w-72 shrink-0 snap-start rounded-xl border border-zinc-200 bg-white p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-[14px]/5 font-semibold">PO-24-1203</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Gujarat Polymers Ltd</p>
        </div>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-600 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full bg-zinc-400" aria-hidden="true"></span>Draft
        </span>
      </div>
      <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Value</dt>
          <dd class="text-[12px]/4 font-medium tabular-nums">₹7,04,200</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
          <dd class="text-[12px]/4 text-zinc-500">Not set</dd>
        </div>
      </dl>
    </article>
  </div>
</div>` },
      { id: 'peek', name: 'Peek', code:
`<div x-data="{
       i: 0, n: 0, atStart: true, atEnd: true,
       slides() { return Array.from(this.$refs.rail.children).filter(el => el.localName !== 'template'); },
       pad() { return parseFloat(getComputedStyle(this.$refs.rail).scrollPaddingLeft) || 0; },
       sync() {
         const r = this.$refs.rail, s = this.slides(), edge = r.getBoundingClientRect().left + this.pad();
         this.n = s.length;
         this.atStart = r.scrollLeft < 2;
         this.atEnd = r.scrollLeft > r.scrollWidth - r.clientWidth - 2;
         const near = s.map((el, k) => [Math.abs(el.getBoundingClientRect().left - edge), k]).sort((a, b) => a[0] - b[0]);
         this.i = near.length ? near[0][1] : 0;
       },
       go(k) {
         const r = this.$refs.rail, s = this.slides(), el = s[Math.min(Math.max(k, 0), s.length - 1)];
         if (!el) return;
         r.scrollBy({ left: el.getBoundingClientRect().left - r.getBoundingClientRect().left - this.pad(),
                      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
       }
     }"
     x-init="sync()"
     @resize.window.debounce="sync()">

  <div class="mb-3 flex items-baseline justify-between gap-3">
    <div class="min-w-0">
      <h3 class="text-[14px]/5 font-semibold">Other orders on this supplier</h3>
      <p class="mt-0.5 text-[12px]/4 text-zinc-600">Gujarat Polymers Ltd, last six months</p>
    </div>
    <div class="hidden shrink-0 items-center gap-1 md:flex">
      <button type="button" @click="go(i - 1)" :disabled="atStart" aria-label="Previous orders"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>
      <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="More orders"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </div>

  <div x-ref="rail" @scroll.passive="sync()" tabindex="0" role="group" aria-label="Other orders on Gujarat Polymers Ltd"
       @keydown.arrow-right="if ($event.target === $refs.rail) { $event.preventDefault(); go(i + 1); }"
       @keydown.arrow-left="if ($event.target === $refs.rail) { $event.preventDefault(); go(i - 1); }"
       class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

    <a href="#" class="group shrink-0 basis-[86%] snap-start rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:bg-zinc-50 sm:basis-1/2 xl:basis-1/3">
      <p class="text-[14px]/5 font-semibold group-hover:underline group-hover:underline-offset-2">PO-24-1163</p>
      <p class="mt-1 text-[12px]/4 text-zinc-600">HDPE granules, 12 MT · Silvassa plant</p>
      <p class="mt-3 text-[16px]/6 font-semibold tabular-nums">₹9,12,400</p>
      <p class="mt-1 text-[12px]/4 text-zinc-500 tabular-nums">Received 22 Mar 2026</p>
    </a>

    <a href="#" class="group shrink-0 basis-[86%] snap-start rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:bg-zinc-50 sm:basis-1/2 xl:basis-1/3">
      <p class="text-[14px]/5 font-semibold group-hover:underline group-hover:underline-offset-2">PO-24-1179</p>
      <p class="mt-1 text-[12px]/4 text-zinc-600">Masterbatch, black · Silvassa plant</p>
      <p class="mt-3 text-[16px]/6 font-semibold tabular-nums">₹1,86,000</p>
      <p class="mt-1 text-[12px]/4 text-zinc-500 tabular-nums">Received 08 May 2026</p>
    </a>

    <a href="#" class="group shrink-0 basis-[86%] snap-start rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:bg-zinc-50 sm:basis-1/2 xl:basis-1/3">
      <p class="text-[14px]/5 font-semibold group-hover:underline group-hover:underline-offset-2">PO-24-1185</p>
      <p class="mt-1 text-[12px]/4 text-zinc-600">HDPE granules, 8 MT · Silvassa plant</p>
      <p class="mt-3 text-[16px]/6 font-semibold tabular-nums">₹6,08,300</p>
      <p class="mt-1 text-[12px]/4 text-zinc-500 tabular-nums">Received 19 Jun 2026</p>
    </a>

    <a href="#" class="group shrink-0 basis-[86%] snap-start rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:bg-zinc-50 sm:basis-1/2 xl:basis-1/3">
      <p class="text-[14px]/5 font-semibold group-hover:underline group-hover:underline-offset-2">PO-24-1186</p>
      <p class="mt-1 text-[12px]/4 text-zinc-600">Antioxidant additive · Silvassa plant</p>
      <p class="mt-3 text-[16px]/6 font-semibold tabular-nums">₹74,150</p>
      <p class="mt-1 text-[12px]/4 text-zinc-500 tabular-nums">Received 30 Jun 2026</p>
    </a>

    <a href="#" class="group shrink-0 basis-[86%] snap-start rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:bg-zinc-50 sm:basis-1/2 xl:basis-1/3">
      <p class="text-[14px]/5 font-semibold group-hover:underline group-hover:underline-offset-2">PO-24-1187</p>
      <p class="mt-1 text-[12px]/4 text-zinc-600">HDPE granules, 15 MT · Silvassa plant</p>
      <p class="mt-3 text-[16px]/6 font-semibold tabular-nums">₹18,42,000</p>
      <p class="mt-1 text-[12px]/4 text-zinc-500 tabular-nums">Received 04 Aug 2026</p>
    </a>
  </div>
</div>` },

      { id: 'dots', name: 'Dots', code:
`<div x-data="{
       i: 0, n: 0, atStart: true, atEnd: true,
       slides() { return Array.from(this.$refs.rail.children).filter(el => el.localName !== 'template'); },
       pad() { return parseFloat(getComputedStyle(this.$refs.rail).scrollPaddingLeft) || 0; },
       sync() {
         const r = this.$refs.rail, s = this.slides(), edge = r.getBoundingClientRect().left + this.pad();
         this.n = s.length;
         this.atStart = r.scrollLeft < 2;
         this.atEnd = r.scrollLeft > r.scrollWidth - r.clientWidth - 2;
         const near = s.map((el, k) => [Math.abs(el.getBoundingClientRect().left - edge), k]).sort((a, b) => a[0] - b[0]);
         this.i = near.length ? near[0][1] : 0;
       },
       go(k) {
         const r = this.$refs.rail, s = this.slides(), el = s[Math.min(Math.max(k, 0), s.length - 1)];
         if (!el) return;
         r.scrollBy({ left: el.getBoundingClientRect().left - r.getBoundingClientRect().left - this.pad(),
                      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
       }
     }"
     x-init="sync()"
     @resize.window.debounce="sync()">

  <div x-ref="rail" @scroll.passive="sync()" tabindex="0" role="group" aria-label="Plant notices"
       @keydown.arrow-right="if ($event.target === $refs.rail) { $event.preventDefault(); go(i + 1); }"
       @keydown.arrow-left="if ($event.target === $refs.rail) { $event.preventDefault(); go(i - 1); }"
       class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

    <article class="flex shrink-0 basis-full snap-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="wrench" class="size-4 text-zinc-600"></i>
      </span>
      <div class="min-w-0">
        <p class="text-[14px]/5 font-semibold">Extruder line 2 shutdown, 24 to 26 August</p>
        <p class="mt-1 text-[13px]/5 text-zinc-600">Planned gearbox replacement. Compounding orders due that week move to line 4, so expect a two day slip on anything scheduled after the 23rd.</p>
        <p class="mt-2 text-[12px]/4 text-zinc-500">Maintenance · Sanjay More · 12 Aug 2026</p>
      </div>
    </article>

    <article class="flex shrink-0 basis-full snap-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="file-text" class="size-4 text-zinc-600"></i>
      </span>
      <div class="min-w-0">
        <p class="text-[14px]/5 font-semibold">Purchase orders above ₹5,00,000 need a second approval</p>
        <p class="mt-1 text-[13px]/5 text-zinc-600">From 1 September the second approver is the cost centre head, not Finance. Orders already raised keep the approval they were created with.</p>
        <p class="mt-2 text-[12px]/4 text-zinc-500">Procurement · Nilesh Patil · 09 Aug 2026</p>
      </div>
    </article>

    <article class="flex shrink-0 basis-full snap-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="truck" class="size-4 text-zinc-600"></i>
      </span>
      <div class="min-w-0">
        <p class="text-[14px]/5 font-semibold">Gate timings for inward material</p>
        <p class="mt-1 text-[13px]/5 text-zinc-600">Unloading now closes at 18:00 instead of 20:00. Vehicles reporting after 18:00 are held overnight and weighed the next morning.</p>
        <p class="mt-2 text-[12px]/4 text-zinc-500">Stores · Meera Joshi · 01 Aug 2026</p>
      </div>
    </article>
  </div>

  <div class="mt-3 flex items-center justify-center gap-1">
    <button type="button" @click="go(0)" :aria-current="i === 0 ? 'true' : 'false'" aria-label="Notice 1, extruder line 2 shutdown"
            class="flex size-6 items-center justify-center rounded-md focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="h-1.5 rounded-full transition-all" :class="i === 0 ? 'w-4 bg-zinc-700' : 'w-1.5 bg-zinc-300'"></span>
    </button>
    <button type="button" @click="go(1)" :aria-current="i === 1 ? 'true' : 'false'" aria-label="Notice 2, second approval limit"
            class="flex size-6 items-center justify-center rounded-md focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="h-1.5 rounded-full transition-all" :class="i === 1 ? 'w-4 bg-zinc-700' : 'w-1.5 bg-zinc-300'"></span>
    </button>
    <button type="button" @click="go(2)" :aria-current="i === 2 ? 'true' : 'false'" aria-label="Notice 3, gate timings"
            class="flex size-6 items-center justify-center rounded-md focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="h-1.5 rounded-full transition-all" :class="i === 2 ? 'w-4 bg-zinc-700' : 'w-1.5 bg-zinc-300'"></span>
    </button>
  </div>
</div>` },
      { id: 'photo', name: 'Photo gallery', code:
`<div x-data="{
       i: 0, n: 0, atStart: true, atEnd: true,
       slides() { return Array.from(this.$refs.rail.children).filter(el => el.localName !== 'template'); },
       pad() { return parseFloat(getComputedStyle(this.$refs.rail).scrollPaddingLeft) || 0; },
       sync() {
         const r = this.$refs.rail, s = this.slides(), edge = r.getBoundingClientRect().left + this.pad();
         this.n = s.length;
         this.atStart = r.scrollLeft < 2;
         this.atEnd = r.scrollLeft > r.scrollWidth - r.clientWidth - 2;
         const near = s.map((el, k) => [Math.abs(el.getBoundingClientRect().left - edge), k]).sort((a, b) => a[0] - b[0]);
         this.i = near.length ? near[0][1] : 0;
       },
       go(k) {
         const r = this.$refs.rail, s = this.slides(), el = s[Math.min(Math.max(k, 0), s.length - 1)];
         if (!el) return;
         r.scrollBy({ left: el.getBoundingClientRect().left - r.getBoundingClientRect().left - this.pad(),
                      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
       }
     }"
     x-init="sync()"
     @resize.window.debounce="sync()">

  <div class="relative">
    <!-- the zinc-100 wells stand in for <img class="h-full w-full object-cover">, as written out in the Django variant -->
    <div x-ref="rail" @scroll.passive="sync()" tabindex="0" role="group" aria-label="Photographs on inspection QC-24-0412"
         @keydown.arrow-right="if ($event.target === $refs.rail) { $event.preventDefault(); go(i + 1); }"
         @keydown.arrow-left="if ($event.target === $refs.rail) { $event.preventDefault(); go(i - 1); }"
         class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      <figure class="shrink-0 basis-full snap-start overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div class="flex aspect-video items-center justify-center bg-zinc-100">
          <i data-lucide="image" class="size-6 text-zinc-500"></i>
        </div>
        <figcaption class="border-t border-zinc-200 px-4 py-2.5">
          <p class="truncate text-[13px]/5 font-medium">Consignment on the weighbridge</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-500 tabular-nums">gate-inward-01.jpg · 04 Aug 2026 09:12 IST</p>
        </figcaption>
      </figure>

      <figure class="shrink-0 basis-full snap-start overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div class="flex aspect-video items-center justify-center bg-zinc-100">
          <i data-lucide="image" class="size-6 text-zinc-500"></i>
        </div>
        <figcaption class="border-t border-zinc-200 px-4 py-2.5">
          <p class="truncate text-[13px]/5 font-medium">Bag markings against the packing list</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-500 tabular-nums">gate-inward-02.jpg · 04 Aug 2026 09:18 IST</p>
        </figcaption>
      </figure>

      <figure class="shrink-0 basis-full snap-start overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div class="flex aspect-video items-center justify-center bg-zinc-100">
          <i data-lucide="image" class="size-6 text-zinc-500"></i>
        </div>
        <figcaption class="border-t border-zinc-200 px-4 py-2.5">
          <p class="truncate text-[13px]/5 font-medium">Torn bag, third pallet from the tail</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-500 tabular-nums">gate-inward-03.jpg · 04 Aug 2026 09:24 IST</p>
        </figcaption>
      </figure>

      <figure class="shrink-0 basis-full snap-start overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div class="flex aspect-video items-center justify-center bg-zinc-100">
          <i data-lucide="image" class="size-6 text-zinc-500"></i>
        </div>
        <figcaption class="border-t border-zinc-200 px-4 py-2.5">
          <p class="truncate text-[13px]/5 font-medium">Moisture reading at sampling</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-500 tabular-nums">qc-sample-01.jpg · 04 Aug 2026 10:02 IST</p>
        </figcaption>
      </figure>
    </div>

    <button type="button" @click="go(i - 1)" :disabled="atStart" aria-label="Previous photograph"
            class="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-0 md:flex">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>
    <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="Next photograph"
            class="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-0 md:flex">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>

  <div class="mt-2 flex items-center justify-between gap-3">
    <p class="text-[12px]/4 tabular-nums text-zinc-500"><span x-text="i + 1"></span> of <span x-text="n"></span> photographs</p>
    <a href="#" class="inline-flex items-center gap-1.5 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">
      <i data-lucide="download" class="size-3.5"></i>Download all
    </a>
  </div>
</div>` },

      { id: 'thumbnails', name: 'Thumbnail rail', code:
`<div x-data="{
       i: 0, n: 0, atStart: true, atEnd: true,
       slides() { return Array.from(this.$refs.rail.children).filter(el => el.localName !== 'template'); },
       pad() { return parseFloat(getComputedStyle(this.$refs.rail).scrollPaddingLeft) || 0; },
       sync() {
         const r = this.$refs.rail, s = this.slides(), edge = r.getBoundingClientRect().left + this.pad();
         this.n = s.length;
         this.atStart = r.scrollLeft < 2;
         this.atEnd = r.scrollLeft > r.scrollWidth - r.clientWidth - 2;
         const near = s.map((el, k) => [Math.abs(el.getBoundingClientRect().left - edge), k]).sort((a, b) => a[0] - b[0]);
         this.i = near.length ? near[0][1] : 0;
       },
       go(k) {
         const r = this.$refs.rail, s = this.slides(), el = s[Math.min(Math.max(k, 0), s.length - 1)];
         if (!el) return;
         r.scrollBy({ left: el.getBoundingClientRect().left - r.getBoundingClientRect().left - this.pad(),
                      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
       }
     }"
     x-init="sync()"
     @resize.window.debounce="sync()"
     class="overflow-hidden rounded-xl border border-zinc-200 bg-white">

  <div class="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3.5">
    <h3 class="truncate text-[14px]/5 font-semibold">Drawings on JOB-24-0338</h3>
    <p class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">Sheet <span x-text="i + 1"></span> of <span x-text="n"></span></p>
  </div>

  <div x-ref="rail" @scroll.passive="sync()" tabindex="0" role="group" aria-label="Drawing sheets on JOB-24-0338"
       @keydown.arrow-right="if ($event.target === $refs.rail) { $event.preventDefault(); go(i + 1); }"
       @keydown.arrow-left="if ($event.target === $refs.rail) { $event.preventDefault(); go(i - 1); }"
       class="flex snap-x snap-mandatory overflow-x-auto focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <div class="flex aspect-video shrink-0 basis-full snap-start items-center justify-center bg-zinc-100">
      <i data-lucide="file-text" class="size-6 text-zinc-500"></i>
    </div>
    <div class="flex aspect-video shrink-0 basis-full snap-start items-center justify-center bg-zinc-100">
      <i data-lucide="file-text" class="size-6 text-zinc-500"></i>
    </div>
    <div class="flex aspect-video shrink-0 basis-full snap-start items-center justify-center bg-zinc-100">
      <i data-lucide="file-text" class="size-6 text-zinc-500"></i>
    </div>
    <div class="flex aspect-video shrink-0 basis-full snap-start items-center justify-center bg-zinc-100">
      <i data-lucide="file-text" class="size-6 text-zinc-500"></i>
    </div>
  </div>

  <div class="flex items-center gap-2 border-t border-zinc-200 px-3 py-3">
    <button type="button" @click="go(i - 1)" :disabled="atStart" aria-label="Previous sheet"
            class="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-40 md:flex">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>

    <div class="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button type="button" @click="go(0)" :aria-current="i === 0 ? 'true' : 'false'"
              class="shrink-0 rounded-lg border p-1 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="i === 0 ? 'border-zinc-700 bg-zinc-100' : 'border-zinc-200 bg-white hover:bg-zinc-50'">
        <span class="flex h-10 w-16 items-center justify-center rounded bg-zinc-200"><i data-lucide="file-text" class="size-3.5 text-zinc-600"></i></span>
        <span class="mt-1 block w-16 truncate text-[11px]/4 text-zinc-600">GA-01</span>
      </button>
      <button type="button" @click="go(1)" :aria-current="i === 1 ? 'true' : 'false'"
              class="shrink-0 rounded-lg border p-1 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="i === 1 ? 'border-zinc-700 bg-zinc-100' : 'border-zinc-200 bg-white hover:bg-zinc-50'">
        <span class="flex h-10 w-16 items-center justify-center rounded bg-zinc-200"><i data-lucide="file-text" class="size-3.5 text-zinc-600"></i></span>
        <span class="mt-1 block w-16 truncate text-[11px]/4 text-zinc-600">GA-02</span>
      </button>
      <button type="button" @click="go(2)" :aria-current="i === 2 ? 'true' : 'false'"
              class="shrink-0 rounded-lg border p-1 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="i === 2 ? 'border-zinc-700 bg-zinc-100' : 'border-zinc-200 bg-white hover:bg-zinc-50'">
        <span class="flex h-10 w-16 items-center justify-center rounded bg-zinc-200"><i data-lucide="file-text" class="size-3.5 text-zinc-600"></i></span>
        <span class="mt-1 block w-16 truncate text-[11px]/4 text-zinc-600">DET-01</span>
      </button>
      <button type="button" @click="go(3)" :aria-current="i === 3 ? 'true' : 'false'"
              class="shrink-0 rounded-lg border p-1 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="i === 3 ? 'border-zinc-700 bg-zinc-100' : 'border-zinc-200 bg-white hover:bg-zinc-50'">
        <span class="flex h-10 w-16 items-center justify-center rounded bg-zinc-200"><i data-lucide="file-text" class="size-3.5 text-zinc-600"></i></span>
        <span class="mt-1 block w-16 truncate text-[11px]/4 text-zinc-600">BOM-01</span>
      </button>
    </div>

    <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="Next sheet"
            class="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-40 md:flex">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
</div>` },
      { id: 'stats', name: 'Strip on mobile, grid on desktop', code:
`<!-- no JavaScript: below sm it is a snapped strip, from sm up it is an ordinary grid -->
<div role="group" aria-label="This month at Silvassa" tabindex="0"
     class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

  <div class="shrink-0 basis-[78%] snap-start rounded-xl border border-zinc-200 bg-white p-4 sm:basis-auto">
    <p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Orders raised</p>
    <p class="mt-1.5 text-[24px]/8 font-semibold tabular-nums">128</p>
    <p class="mt-1 text-[12px]/4 text-zinc-600 tabular-nums">14 more than July</p>
  </div>

  <div class="shrink-0 basis-[78%] snap-start rounded-xl border border-zinc-200 bg-white p-4 sm:basis-auto">
    <p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Committed value</p>
    <p class="mt-1.5 text-[24px]/8 font-semibold tabular-nums">₹2.41 Cr</p>
    <p class="mt-1 text-[12px]/4 text-zinc-600 tabular-nums">Against a ₹2.75 Cr budget</p>
  </div>

  <div class="shrink-0 basis-[78%] snap-start rounded-xl border border-zinc-200 bg-white p-4 sm:basis-auto">
    <p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Overdue deliveries</p>
    <p class="mt-1.5 flex items-center gap-2 text-[24px]/8 font-semibold tabular-nums">
      <span class="size-2 rounded-full bg-red-600" aria-hidden="true"></span>7
    </p>
    <p class="mt-1 text-[12px]/4 text-zinc-600 tabular-nums">Oldest is 19 days late</p>
  </div>

  <div class="shrink-0 basis-[78%] snap-start rounded-xl border border-zinc-200 bg-white p-4 sm:basis-auto">
    <p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Awaiting approval</p>
    <p class="mt-1.5 text-[24px]/8 font-semibold tabular-nums">12</p>
    <p class="mt-1 text-[12px]/4 text-zinc-600 tabular-nums">4 sitting over a week</p>
  </div>
</div>` },

      { id: 'empty', name: 'Empty', code:
`<div>
  <h3 class="mb-3 text-[14px]/5 font-semibold">Photographs</h3>
  <div class="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center">
    <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="image" class="size-4 text-zinc-600"></i>
    </span>
    <p class="mt-3 text-[14px]/5 font-medium">No photographs on this inspection</p>
    <p class="mx-auto mt-1 max-w-sm text-[13px]/5 text-zinc-600">
      Photos taken at the gate appear here in the order they were uploaded, newest last.
    </p>
    <button type="button" class="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
      <i data-lucide="upload" class="size-4"></i>Add photographs
    </button>
  </div>
</div>` },

      { id: 'django', name: 'Django template', code:
`{% if inspection.photos.exists %}
<div x-data="{
       i: 0, n: 0, atStart: true, atEnd: true,
       slides() { return Array.from(this.$refs.rail.children).filter(el => el.localName !== 'template'); },
       pad() { return parseFloat(getComputedStyle(this.$refs.rail).scrollPaddingLeft) || 0; },
       sync() {
         const r = this.$refs.rail, s = this.slides(), edge = r.getBoundingClientRect().left + this.pad();
         this.n = s.length;
         this.atStart = r.scrollLeft < 2;
         this.atEnd = r.scrollLeft > r.scrollWidth - r.clientWidth - 2;
         const near = s.map((el, k) => [Math.abs(el.getBoundingClientRect().left - edge), k]).sort((a, b) => a[0] - b[0]);
         this.i = near.length ? near[0][1] : 0;
       },
       go(k) {
         const r = this.$refs.rail, s = this.slides(), el = s[Math.min(Math.max(k, 0), s.length - 1)];
         if (!el) return;
         r.scrollBy({ left: el.getBoundingClientRect().left - r.getBoundingClientRect().left - this.pad(),
                      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
       }
     }"
     x-init="sync()"
     @resize.window.debounce="sync()">

  <div class="mb-3 flex items-center justify-between gap-3">
    <h3 class="text-[14px]/5 font-semibold">Photographs</h3>
    <div class="flex items-center gap-2">
      <p class="text-[12px]/4 tabular-nums text-zinc-500"><span x-text="i + 1"></span> of <span x-text="n"></span></p>
      <div class="hidden items-center gap-1 md:flex">
        <button type="button" @click="go(i - 1)" :disabled="atStart" aria-label="Previous photograph"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
          <i data-lucide="chevron-left" class="size-4"></i>
        </button>
        <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="Next photograph"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
          <i data-lucide="chevron-right" class="size-4"></i>
        </button>
      </div>
    </div>
  </div>

  {# the loop is server side, so there is no x-for template for slides() to filter out #}
  <div x-ref="rail" @scroll.passive="sync()" tabindex="0" role="group" aria-label="Photographs on inspection {{ inspection.reference }}"
       @keydown.arrow-right="if ($event.target === $refs.rail) { $event.preventDefault(); go(i + 1); }"
       @keydown.arrow-left="if ($event.target === $refs.rail) { $event.preventDefault(); go(i - 1); }"
       class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {% for photo in inspection.photos.all %}
      <figure class="shrink-0 basis-full snap-start overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <img src="{{ photo.image.url }}" alt="{{ photo.caption }}" loading="lazy" decoding="async"
             class="aspect-video w-full bg-zinc-100 object-cover">
        <figcaption class="border-t border-zinc-200 px-4 py-2.5">
          <p class="truncate text-[13px]/5 font-medium">{{ photo.caption }}</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-500 tabular-nums">
            {{ photo.filename }} · {{ photo.taken_at|date:"d M Y H:i" }} IST
          </p>
        </figcaption>
      </figure>
    {% endfor %}
  </div>
</div>
{% else %}
<div class="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center">
  <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="image" class="size-4 text-zinc-600"></i>
  </span>
  <p class="mt-3 text-[14px]/5 font-medium">No photographs on this inspection</p>
  <p class="mx-auto mt-1 max-w-sm text-[13px]/5 text-zinc-600">Photos taken at the gate appear here in the order they were uploaded.</p>
</div>
{% endif %}` }
    ]
  },

  {
    id: 'list-detail', name: 'List and detail', category: 'layout',
    description: 'A queue on the left and the record being worked on beside it. Arrow keys walk the list, Enter opens the record into the detail pane, and only the two panes scroll — the page behind them does not move.',
    when: 'Working through a queue one record at a time while keeping the queue visible: a QC hold list somebody clears before the shift ends, a GRN approval run, an exceptions list, a vendor ledger read account by account. The test is whether the next record matters. If it does — you read one, decide, and the one under it is the next thing you will read — this is the layout, because the queue never leaves the screen and moving down it costs a keystroke rather than a page load and a Back press. If it does not, reach for data-table: a register is a thing you scan, sort, filter and act on in bulk, and it wants the whole width for the columns being compared rather than a third of it for a queue nobody is walking. The wrong choice shows up immediately in use — a fourteen-column ledger crushed into a 352px queue, or an approval run that costs two navigations a record. Where the record is heavy enough to want the full width and a URL of its own, that is a register plus a record page and it is two screens, not this. Where it is a handful of fields somebody glances at and dismisses, that is a sheet over the register.',
    notes: [
      'The keyboard model is the component, and everything else here follows from it. The list is a real listbox — a ul with role="listbox", li with role="option", one Tab stop, roving tabindex, and the arrow keys owned by the widget. The alternative shape, a list of links with aria-current, is the right one exactly when each record has a URL and clicking one is a navigation; then the browser owns the keys and this entry is not what you want, because a queue that navigates per record is a register and a record page. Picking listbox is picking the promise: nothing here changes the address bar, Enter commits a selection rather than following a link, and Escape gets you back out. Mixing the two — anchors carrying role="option", or li elements pretending to be links — gives a control that announces as one thing and behaves as another, and it is the commonest way this layout is got wrong.',
      'Bind the arrow handler on the listbox, never on the window. A @keydown.window listener for Up and Down eats the caret keys in the search box above the list, so somebody correcting a mistyped PO number watches the selection jump instead of the cursor moving, and every stray Down anywhere on the page walks the queue. Bound on the listbox the problem does not exist: the keys only fire when the list has focus, and .prevent stops the page scrolling underneath at the same time. The one deliberate hand-off runs the other way — Down in the search box moves focus to the first result, because that is the gesture people already expect from a search field over a list, and it is one explicit binding on that input rather than a global listener.',
      'Roving tabindex, not aria-activedescendant. Exactly one option carries tabindex="0" and it is the selected one; the rest carry -1, and moving the selection moves the 0 with it, so tabbing out to the detail and back returns to the record you were on rather than to the top of a queue you had walked forty rows down. aria-activedescendant is the other legal implementation and it costs more than it looks: DOM focus never leaves the container, so :focus-visible cannot style the current option, the browser will not scroll it into view for you, and every one of those has to be rebuilt by hand.',
      'Reveal the selection with el.focus({ preventScroll: true }) followed by scrollIntoView({ block: "nearest" }), in that order and with both arguments. focus() on its own scrolls the option to wherever the browser feels like putting it, which on a long queue is the middle of the pane, so every arrow press jerks the list even when the next row was already visible. "nearest" scrolls by the minimum that brings the row into the box, which is zero for the twenty rows already on screen. Leave the behaviour at auto rather than smooth: holding Down queues an animation per row and the highlight runs ahead of the list it is supposed to be in.',
      'Clamp at the ends; never wrap. A tab strip wraps because it is a closed set of four and there is no last one. A queue is an ordered run with a top and a bottom, and wrapping from the last batch to the first means somebody who has just released the final hold is handed a batch they cleared twenty minutes ago and is invited to decide it again. Down on the last row does nothing, which is the honest answer, and the count in the header is what says there is nothing below it.',
      'aria-selected bound in Alpine writes the string "false" rather than dropping the attribute, and that is deliberate: Alpine 3 preserves exactly four falsy aria attributes — aria-pressed, aria-checked, aria-expanded and aria-selected — because a listbox with the attribute missing from twenty-three options and present on one is a listbox where nothing is unselected, it is a listbox where twenty-three options have no selection state at all. aria-current is not on that list, so :aria-current="sel === i" removes the attribute when false, which is correct for aria-current and would be wrong for aria-selected. Do not assume the two behave alike because they read alike.',
      'Nothing focusable goes inside a role="option". A row action button, a checkbox, an anchor to the vendor — all of them are unreachable, because the listbox is one Tab stop and Tab leaves it. Per-record actions belong in the detail pane, where they are real Tab stops on a record the user has already committed to, and that is the better place for them anyway: a Reject button on a row is a decision taken without reading the record. If the rows genuinely need controls on them, the list is a table with selection and this is data-table.',
      'Both panes are bound with :class and never with x-show, in the object form and not the string form, and the static class attribute carries the initial state. Three separate defects sit behind that one sentence. x-show writes an inline display:none, inline styles beat md:flex, and the detail pane then never comes back on a wide screen once it has been closed on a narrow one. :class does nothing until Alpine boots, so whatever is in the plain class attribute is what the first paint draws — leave the display utility out of it and a phone shows both panes stacked for a frame on every load. And the string form of :class only ever adds classes, so a static hidden survives the binding and beats the flex it adds, which is display:none on a pane that is supposed to be open; the object form is the one that removes a falsy key from classList whether the binding put it there or the template did. Write class="flex … md:flex" with :class="{ hidden: detail, flex: !detail }" on the list and the mirror of it on the detail, and all three go away at once.',
      'Only the two panes scroll and the frame around them does not, which takes min-h-0 on every flex item in the chain. A flex item defaults to min-height:auto, so without it a pane refuses to shrink below its content, the frame grows past its own height, and the whole page scrolls with no scrollbar on either pane — the exact failure this layout exists to avoid, because the queue scrolling away is what makes it a register with a preview stuck to it. Inside the detail pane the record header and the decision bar are shrink-0 and only the body between them scrolls, so the batch number and the Release button are still on screen at line 40.',
      'Selecting a row does not push a history entry. Walking a queue with the arrow keys would write one entry per record, so Back steps the user backwards through the queue a record at a time and never leaves the screen, and by the time they escape they are eleven presses from the page they came from. If the position is worth keeping across a reload — and on a queue somebody works for an hour it is — write it with history.replaceState as ?sel=BN-26-0418 and read it at boot. That is one entry, it survives a refresh and it can be sent to a colleague, and it is the only URL writing this layout should do.',
      'The pane swap is announced by focus, not by a live region on every arrow press. Enter moves focus into the detail region, and because that region is labelled by the record heading its name is read on arrival — "PO-24-1194, Gujarat Polymers Ltd, region" — which is the announcement, delivered by the mechanism that already exists. Making the pane aria-live instead fires it on every arrow key, so walking twenty rows queues twenty polite announcements behind the option names that were already being read, and the sentence that mattered arrives four records late. The role="status" region earns its place only for the swaps focus does not cause: a detail that finishes loading, a selected record dropped by a filter, and a queue that advances by itself after a decision.',
      'Below md the two panes are two screens and the Back control is the only way out of the second one, so it is first in the detail header, it is a real button with words on it, and it is md:hidden rather than removed. Escape does the same job from the keyboard and is bound on the detail pane rather than the window, so it does not fight a dialog opened over it. Both routes return focus to the option that was opened, or the phone user is dropped at the top of the document with the queue somewhere below them. Nothing scrolls sideways at that width: the panes restack, they do not shrink.'
    ],
    anatomy: [
      ['Frame', 'The fixed-height flex column holding everything — h-[640px] here so it previews in a box. The page does not scroll; the panes inside it do.'],
      ['List pane', 'The queue. A fixed 320–352px column at md and up, full width below it, with its own header and its own scroller.'],
      ['List header', 'shrink-0. The h2 that names the queue, the count, and the search or filters when there are any. It does not scroll with the rows.'],
      ['Listbox', 'ul role="listbox" pointed at that h2 with aria-labelledby, owning the arrow keys, Home, End and Enter. min-h-0 flex-1 overflow-y-auto.'],
      ['Option', 'li role="option" carrying aria-selected and a roving tabindex. A status dot, the record identity, one meta line and a figure. Nothing focusable inside it.'],
      ['Detail pane', 'A section labelled by the record heading, so its accessible name changes with the selection. tabindex="-1" so a commit can put focus on it.'],
      ['Detail header', 'shrink-0. The Back control below md, the record number, the vendor, the status, and the actions that decide the record.'],
      ['Status region', 'One role="status" on the frame, in the document from first paint, for the pane changes focus does not cause — a load resolving, a filtered-out selection, a queue advancing after a decision.']
    ],
    behaviour: [
      'Up and Down move the selection and the detail pane follows immediately, because the detail is already on the page and there is nothing to wait for. Home and End jump to the ends of the queue and the ends clamp rather than wrap.',
      'Enter commits: it moves focus into the detail pane, whose region name is the record. Shift+Tab comes straight back to the same option, because the roving tabindex moved with the selection.',
      'The arrow keys are bound on the listbox, so they never fire while focus is in the search box, and .prevent stops the page scrolling under the selection. Space is left to the scroller — selection already follows focus, so there is nothing for it to select.',
      'Clicking a row does what Enter does and also puts DOM focus on the option, so a mouse user who then reaches for the keyboard is where they left the pointer.',
      'Only the panes scroll, and independently. The list keeps its scroll position when the detail changes, so working down a queue never resets it, and the detail scrolls back to its own top on every selection.',
      'Below md the panes are two screens. Picking a record shows the detail and moves focus into it; Back and Escape return to the list with focus on the option that was opened.',
      'Where the detail costs a request, the list stays interactive through it: the arrows keep moving, the skeleton holds the pane at the loaded height, and a response that arrives for a record that is no longer selected is dropped rather than painted.',
      'A decision that removes the record from the queue moves the selection to the record that takes its place and moves focus with it, and says what happened in the status region. Left alone, focus falls to the body from an element that no longer exists.',
      'Filtering the list does not clear the detail. A selected record the filter excludes stays in the pane with a line saying it is outside the current filter, rather than the pane blanking or jumping to whatever is now at the top.'
    ],
    a11y: [
      'One main, one h1, and the two panes are h2s under it: the queue name and the record. The detail heading is what aria-labelledby points at, so the region name changes with the selection and a landmark list says which record is open.',
      'The list is a listbox with an accessible name taken from its heading, exactly one option carrying aria-selected="true" and every other option carrying aria-selected="false". Selection is never signalled by the zinc-100 tint alone.',
      'One Tab stop for the whole queue. The selected option holds tabindex="0" and the rest hold -1, so Tab reaches the list once and lands where the user last was rather than walking twenty-four rows.',
      'No option contains a button, a link or a checkbox. A listbox is one tab stop and a control inside an option is unreachable; record actions live in the detail pane.',
      'The detail pane is tabindex="-1" so Enter can put focus on it. Focus is the announcement of the swap; the pane is not a live region, because one bound to the selection speaks on every arrow key.',
      'The role="status" on the frame exists before anything changes and holds only the sentences focus does not deliver — a load that resolved, a selection outside the filter, a queue that advanced. A region that arrives with its message already inside it has not changed and announces nothing.',
      'Below md the Back control is a real button reading "Back to the queue", not a bare chevron, and Escape from the detail does the same thing. Both return focus to the option that was opened.',
      'The status dot on an option is aria-hidden and the state is a word in the option text, so the queue is readable without colour and the twelve-row column of graphite marks still has one red one in it.',
      'Decision buttons in the detail pane are ordinary Tab stops and carry no single-key shortcut. A layout this keyboard-driven invites one, and a regulated action fired by a stray R is a batch released by a keystroke nobody meant.'
    ],
    related: ['data-table', 'app-shell', 'sheet', 'empty-state', 'skeleton'],
    variants: [
      { id: 'default', name: 'Two panes', code:
`<!-- The reference implementation of the keyboard model, and everything else in
     this entry is a variation on it.

     The list is a listbox, not a set of links, because nothing here changes the
     address bar: Enter commits a selection into the pane beside it. Anchors
     carrying role="option" announce as one thing and behave as another, and are
     the commonest way this layout is got wrong.

     The arrow handler is on the listbox and not on the window. Bound globally it
     eats the caret keys in the search box above the list, so correcting a
     mistyped PO number walks the queue instead of moving the cursor. .prevent
     stops the page scrolling under the selection at the same time.

     reveal() focuses with preventScroll and then scrollIntoView block:"nearest".
     focus() alone scrolls the row to wherever the browser likes, which is the
     middle of the pane, so every press jerks a list that was already showing the
     next twenty rows.

     move() clamps. A tab strip wraps because it is a closed set of four; a queue
     has a bottom, and wrapping hands somebody the order they cleared first.

     Both panes bind with :class in the object form and never with x-show, and
     three things ride on that. x-show writes an inline display:none that beats
     md:flex, so the detail would never come back on a wide screen. The static
     class attribute carries the initial state, or the first paint before Alpine
     boots stacks both panes on a phone. And the object form is what removes a
     falsy key from classList — the string form only adds, so the static hidden
     survives and beats the flex the binding adds, and the pane stays shut.

     min-h-0 on every flex item in the chain is what keeps the frame from
     growing: a flex item defaults to min-height:auto, and without it the panes
     refuse to shrink and the whole page scrolls instead of either of them.

     As a real page: drop the wrapper border and h-[640px], put h-screen
     overflow-hidden on <body>, and render this inside app-shell's main column
     with the shell's own header above it. -->
<main class="flex h-[640px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-[14px]/5 text-zinc-900"
      x-id="['q', 'rec']"
      x-data="{
        sel: 0, detail: false, said: '',
        orders: [
          { po: 'PO-24-1187', vendor: 'Sharma Extrusions', dept: 'Fabrication', value: '₹18,42,000', lines: 9, due: '22 Aug', raised: '04 Aug 2026', buyer: 'Akshay Prabhu', status: 'Overdue', pct: 62, note: '4 of 9 lines received · 9 days past the promised date' },
          { po: 'PO-24-1191', vendor: 'Gujarat Polymers Ltd', dept: 'Compounding', value: '₹7,15,600', lines: 4, due: '28 Aug', raised: '07 Aug 2026', buyer: 'Meera Joshi', status: 'Open', pct: 25, note: '1 of 4 lines received' },
          { po: 'PO-24-1194', vendor: 'Deccan Bearings Pvt Ltd', dept: 'Maintenance', value: '₹2,84,300', lines: 12, due: '01 Sep', raised: '09 Aug 2026', buyer: 'Akshay Prabhu', status: 'Approved', pct: 0, note: 'Nothing received yet · with the plant head since 14 Aug' },
          { po: 'PO-24-1198', vendor: 'Konkan Packaging Co', dept: 'Dispatch', value: '₹1,09,750', lines: 3, due: '18 Aug', raised: '11 Aug 2026', buyer: 'Nilesh Patil', status: 'Closed', pct: 100, note: 'All 3 lines received on 17 Aug' },
          { po: 'PO-24-1203', vendor: 'Nashik Steel Traders', dept: 'Tooling', value: '₹96,750', lines: 2, due: '05 Sep', raised: '12 Aug 2026', buyer: 'Meera Joshi', status: 'Open', pct: 50, note: '1 of 2 lines received' },
          { po: 'PO-24-1207', vendor: 'Qureshi Metals', dept: 'Fabrication', value: '₹5,46,000', lines: 7, due: '09 Sep', raised: '13 Aug 2026', buyer: 'Akshay Prabhu', status: 'Open', pct: 0, note: 'Nothing received yet' },
          { po: 'PO-24-1211', vendor: 'Deshpande Traders', dept: 'Dispatch', value: '₹2,14,300', lines: 5, due: '11 Sep', raised: '14 Aug 2026', buyer: 'Nilesh Patil', status: 'Draft', pct: 0, note: 'Not released to the vendor' }
        ],
        dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
        get rec() { return this.orders[this.sel] },
        move(step) { this.go(Math.min(Math.max(this.sel + step, 0), this.orders.length - 1)) },
        go(i) { this.sel = i; this.reveal() },
        reveal() {
          this.$nextTick(() => {
            const el = this.$refs.list.querySelector('[aria-selected=true]');
            if (!el) return;
            el.focus({ preventScroll: true });
            el.scrollIntoView({ block: 'nearest' });
            this.$refs.body.scrollTop = 0;
          });
        },
        open() { this.detail = true; this.$nextTick(() => this.$refs.detail.focus()) },
        back() { this.detail = false; this.reveal() }
      }">

  <p role="status" class="sr-only" x-text="said"></p>

  <div class="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200 px-4 py-3">
    <div class="min-w-0">
      <h1 class="text-[16px]/6 font-semibold">Goods receipt queue</h1>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">Silvassa · 7 orders awaiting receipt</p>
    </div>
    <button type="button" class="ml-auto inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="sliders-horizontal" class="size-4 text-zinc-600"></i>Filters
    </button>
  </div>

  <div class="flex min-h-0 flex-1">

    <!-- list pane -->
    <section :aria-labelledby="$id('q')"
             class="flex min-h-0 w-full shrink-0 flex-col border-zinc-200 md:flex md:w-80 md:border-r lg:w-[22rem]"
             :class="{ 'hidden': detail, 'flex': !detail }">
      <div class="flex shrink-0 items-baseline justify-between gap-3 border-b border-zinc-200 px-4 py-2.5">
        <h2 :id="$id('q')" class="text-[13px]/5 font-medium">Awaiting receipt</h2>
        <p class="text-[12px]/4 tabular-nums text-zinc-500" x-text="(sel + 1) + ' of ' + orders.length"></p>
      </div>

      <!-- One Tab stop. The selected option holds tabindex 0 and moves it with
           the selection, so tabbing out to the detail and back returns to the
           record you were on rather than to the top of the queue. -->
      <ul x-ref="list" role="listbox" :aria-labelledby="$id('q')"
          @keydown.arrow-down.prevent="move(1)"
          @keydown.arrow-up.prevent="move(-1)"
          @keydown.home.prevent="go(0)"
          @keydown.end.prevent="go(orders.length - 1)"
          @keydown.enter.prevent="open()"
          class="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto">
        <template x-for="(o, i) in orders" :key="o.po">
          <li role="option" :aria-selected="sel === i" :tabindex="sel === i ? 0 : -1"
              @click="go(i); open()"
              class="flex gap-2.5 px-4 py-3 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="sel === i && 'bg-zinc-100'">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true">
              <span class="size-1.5 rounded-full" :class="dot[o.status]"></span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-baseline justify-between gap-3">
                <span class="truncate text-[13px]/5 font-medium" x-text="o.vendor"></span>
                <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600" x-text="o.value"></span>
              </span>
              <span class="mt-0.5 block truncate text-[12px]/4 tabular-nums text-zinc-500">
                <span x-text="o.status"></span> · <span x-text="o.po"></span> · due <span x-text="o.due"></span>
              </span>
            </span>
          </li>
        </template>
      </ul>
    </section>

    <!-- detail pane -->
    <section x-ref="detail" tabindex="-1" :aria-labelledby="$id('rec')"
             class="hidden min-h-0 w-full min-w-0 flex-1 flex-col md:flex focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
             @keydown.escape="back()"
             :class="{ 'hidden': !detail, 'flex': detail }">

      <div class="shrink-0 border-b border-zinc-200 px-4 py-3 lg:px-5">
        <button type="button" @click="back()"
                class="-ml-1 mb-2 inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-[13px]/5 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:hidden">
          <i data-lucide="chevron-left" class="size-4"></i>Back to the queue
        </button>

        <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div class="min-w-0">
            <h2 :id="$id('rec')" class="flex flex-wrap items-center gap-2.5 text-[16px]/6 font-semibold">
              <span class="tabular-nums" x-text="rec.po"></span>
              <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
                <span class="size-1.5 shrink-0 rounded-full" :class="dot[rec.status]" aria-hidden="true"></span><span x-text="rec.status"></span>
              </span>
            </h2>
            <p class="mt-0.5 text-[12px]/4 text-zinc-600" x-text="rec.vendor + ' · ' + rec.dept + ' · raised ' + rec.raised + ' by ' + rec.buyer"></p>
          </div>
          <div class="flex shrink-0 gap-2">
            <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="external-link" class="size-4 text-zinc-600"></i>Full record
            </button>
            <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="package-check" class="size-4"></i>Record GRN
            </button>
          </div>
        </div>
      </div>

      <!-- Only this scrolls. The header above and the record identity in it stay
           on screen at line 40 of a long order. -->
      <div x-ref="body" class="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-5">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Order value</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="rec.value"></dd>
          </div>
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Lines</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="rec.lines"></dd>
          </div>
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Promised</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="rec.due"></dd>
          </div>
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Buyer</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold" x-text="rec.buyer"></dd>
          </div>
        </dl>

        <div class="mt-4 rounded-xl border border-zinc-200 p-4">
          <div class="flex flex-wrap items-baseline justify-between gap-2 text-[12px]/4">
            <span class="text-zinc-600" x-text="rec.note"></span>
            <span class="font-medium tabular-nums" x-text="rec.pct + '% received'"></span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
            <div class="h-full rounded-full bg-zinc-700" :style="'width:' + rec.pct + '%'"></div>
          </div>
        </div>

        <h3 class="mt-5 text-[13px]/5 font-medium">Order lines</h3>
        <div class="mt-2 overflow-hidden rounded-xl border border-zinc-200">
          <table class="w-full text-[13px]/5">
            <thead>
              <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">
                <th scope="col" class="px-3 py-2 font-medium">Material</th>
                <th scope="col" class="px-3 py-2 text-right font-medium">Ordered</th>
                <th scope="col" class="px-3 py-2 text-right font-medium">Received</th>
                <th scope="col" class="px-3 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-zinc-100">
                <td class="px-3 py-2">MS angle 50×50×6</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">420 kg</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">420 kg</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">₹26,208</td>
              </tr>
              <tr class="border-b border-zinc-100">
                <td class="px-3 py-2">MS plate 8 mm</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">180 kg</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">90 kg</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">₹12,798</td>
              </tr>
              <tr>
                <td class="px-3 py-2">Hex bolt M12×60</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">1,200 nos</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">—</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">₹14,220</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="mt-5 text-[13px]/5 font-medium">Recent activity</h3>
        <ul role="list" class="mt-2 space-y-2.5">
          <li class="flex items-start gap-2.5">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
            <p class="text-[13px]/5 tabular-nums text-zinc-600">18 Aug 2026 — partial receipt logged against 4 lines by Nilesh Patil.</p>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
            <p class="text-[13px]/5 tabular-nums text-zinc-600">11 Aug 2026 — delivery date revised from 15 Aug to 22 Aug by the vendor.</p>
          </li>
          <li class="flex items-start gap-2.5">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
            <p class="text-[13px]/5 tabular-nums text-zinc-600">04 Aug 2026 — order released to the vendor by Akshay Prabhu.</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</main>` },

      { id: 'nothing-selected', name: 'Nothing selected yet', code:
`<!-- The state the pane is in before anybody has picked anything, and the
     question underneath it is whether to auto-select the first record at all.

     On a queue with consequences the answer is no. Auto-selecting the top batch
     of an approval run marks it opened, puts a decision in front of somebody who
     has not chosen to look at it, and on a phone opens a record nobody asked for
     over the list they were reading. Auto-select is right only where the detail
     is free, already on the page, and reading it changes nothing — a vendor
     master, a rate contract. Everywhere else the pane starts empty and the first
     arrow key or the first click fills it.

     This is a fifth shading of empty-state, and it deliberately does not offer a
     button. The other four each have one control that answers them; the answer
     here is the list beside it, which is already on screen, already focusable
     and already the thing being pointed at. A "Pick a record" button under the
     sentence would be a control that either does nothing or picks for the user,
     and both of those are worse than the sentence.

     The shape is empty-state's own — one size-10 graphite well, one glyph, a
     heading and a max-w-sm line — and the pane keeps the full height a loaded
     record would take, so nothing moves when one lands.

     The keyboard entry point is the whole reason the hint names a key. With no
     selection the listbox still needs one Tab stop, so the first option carries
     tabindex="0" while sel is null and Down from there selects rather than
     moves. -->
<main class="flex h-[560px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-[14px]/5 text-zinc-900"
      x-id="['q', 'rec']"
      x-data="{
        sel: null, detail: false,
        rows: [
          { id: 'REQ-26-0311', who: 'Meera Joshi', what: 'Compounding · masterbatch, blue', value: '₹4,10,500', age: 'raised 3 days ago', status: 'Approved' },
          { id: 'REQ-26-0314', who: 'Nilesh Patil', what: 'Dispatch · stretch film 500 mm', value: '₹68,400', age: 'raised 2 days ago', status: 'Approved' },
          { id: 'REQ-26-0317', who: 'Akshay Prabhu', what: 'Maintenance · bearing 6208 ZZ', value: '₹22,750', age: 'raised yesterday', status: 'Approved' },
          { id: 'REQ-26-0319', who: 'Meera Joshi', what: 'Fabrication · MS plate 10 mm', value: '₹1,86,200', age: 'raised yesterday', status: 'Approved' },
          { id: 'REQ-26-0322', who: 'Nilesh Patil', what: 'Tooling · carbide insert CNMG', value: '₹94,300', age: 'raised today', status: 'Open' }
        ],
        dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
        move(step) {
          if (this.sel === null) return this.go(0);
          this.go(Math.min(Math.max(this.sel + step, 0), this.rows.length - 1));
        },
        go(i) {
          this.sel = i;
          this.$nextTick(() => {
            const el = this.$refs.list.querySelector('[aria-selected=true]');
            if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'nearest' }) }
          });
        },
        open() { if (this.sel !== null) { this.detail = true; this.$nextTick(() => this.$refs.detail.focus()) } },
        back() { this.detail = false; if (this.sel !== null) this.go(this.sel) }
      }">

  <div class="shrink-0 border-b border-zinc-200 px-4 py-3">
    <h1 class="text-[16px]/6 font-semibold">Requisitions awaiting your approval</h1>
    <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">5 requisitions · oldest raised 3 days ago</p>
  </div>

  <div class="flex min-h-0 flex-1">

    <section :aria-labelledby="$id('q')"
             class="flex min-h-0 w-full shrink-0 flex-col border-zinc-200 md:flex md:w-80 md:border-r lg:w-[22rem]"
             :class="{ 'hidden': detail, 'flex': !detail }">
      <div class="shrink-0 border-b border-zinc-200 px-4 py-2.5">
        <h2 :id="$id('q')" class="text-[13px]/5 font-medium">The queue</h2>
      </div>

      <ul x-ref="list" role="listbox" :aria-labelledby="$id('q')"
          @keydown.arrow-down.prevent="move(1)"
          @keydown.arrow-up.prevent="move(-1)"
          @keydown.home.prevent="go(0)"
          @keydown.end.prevent="go(rows.length - 1)"
          @keydown.enter.prevent="open()"
          class="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto">
        <template x-for="(r, i) in rows" :key="r.id">
          <li role="option" :aria-selected="sel === i"
              :tabindex="sel === i || (sel === null && i === 0) ? 0 : -1"
              @click="go(i); open()"
              class="flex gap-2.5 px-4 py-3 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="sel === i && 'bg-zinc-100'">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true">
              <span class="size-1.5 rounded-full" :class="dot[r.status]"></span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-baseline justify-between gap-3">
                <span class="truncate text-[13px]/5 font-medium tabular-nums" x-text="r.id"></span>
                <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600" x-text="r.value"></span>
              </span>
              <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">
                <span x-text="r.status"></span> · <span x-text="r.who"></span> · <span x-text="r.age"></span>
              </span>
            </span>
          </li>
        </template>
      </ul>
    </section>

    <section x-ref="detail" tabindex="-1" :aria-labelledby="$id('rec')"
             @keydown.escape="back()"
             class="hidden min-h-0 w-full min-w-0 flex-1 flex-col md:flex focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
             :class="{ 'hidden': !detail, 'flex': detail }">

      <!-- Nothing selected. Same box a loaded record would fill, so the pane does
           not change height when one arrives. Below md there is no empty pane to
           show at all — the list is the screen, so "nothing selected" is the list
           itself and the detail only exists once a record has been opened. -->
      <div x-show="sel === null" class="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
          <i data-lucide="file-text" class="size-5 text-zinc-600"></i>
        </span>
        <h2 :id="$id('rec')" class="mt-3 text-[16px]/6 font-semibold">No requisition open</h2>
        <p class="mt-1 max-w-sm text-[13px]/5 text-zinc-600">
          Pick one from the queue and it opens here. Nothing is selected on purpose — approving is a decision, so the first requisition is not put in front of you before you have asked for it.
        </p>
        <p class="mt-3 text-[12px]/4 text-zinc-500">
          Tab to the queue, then <kbd class="rounded border border-zinc-200 bg-zinc-100 px-1.5 text-[11px]/4">↓</kbd> to walk it.
        </p>
      </div>

      <div x-show="sel !== null" x-cloak class="flex min-h-0 flex-1 flex-col">
        <div class="shrink-0 border-b border-zinc-200 px-5 py-4">
          <button type="button" @click="back()"
                  class="-ml-2 mb-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px]/5 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:hidden">
            <i data-lucide="chevron-left" class="size-4"></i>Back to the queue
          </button>
          <h2 :id="$id('rec')" class="text-[16px]/6 font-semibold tabular-nums" x-text="sel === null ? '' : rows[sel].id"></h2>
          <p class="mt-0.5 text-[12px]/4 text-zinc-600" x-text="sel === null ? '' : rows[sel].what + ' · ' + rows[sel].who"></p>
          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="check" class="size-4"></i>Approve
            </button>
            <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              Send back
            </button>
          </div>
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <dl class="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Estimated value</dt>
              <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="sel === null ? '' : rows[sel].value"></dd>
            </div>
            <div>
              <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Raised</dt>
              <dd class="mt-1 text-[13px]/5 font-semibold" x-text="sel === null ? '' : rows[sel].age"></dd>
            </div>
          </dl>
          <p class="mt-4 text-[13px]/5 text-zinc-600">Budget line has ₹12,40,000 uncommitted for the quarter. No rate contract covers this material, so a comparative quote is needed before the order is raised.</p>
        </div>
      </div>
    </section>
  </div>
</main>` },

      { id: 'responsive', name: 'Two screens on a phone', code:
`<!-- The narrow form, where the two panes stop being panes. Below md the list is
     the screen and the detail is the screen; there is no split, because 390px
     divided in two is two columns neither of which holds a record.

     The switch is one boolean bound with the object form of :class. x-show
     writes an inline display:none, inline styles beat md:flex, and the detail
     pane would then never come back on a wide screen once it had been closed on
     a narrow one. The static class attribute repeats the initial state so the
     frame is right on the first paint, before Alpine has booted — and the object
     form is what then corrects it, because the string form only ever adds
     classes and the static hidden would survive to beat the flex it added.

     Three ways out of the detail and all three land in the same place. The Back
     button is md:hidden and first in the header, with words on it rather than a
     bare chevron. Escape is bound on the detail section and not on the window,
     so a dialog opened over it still gets its own Escape first. And both call
     back(), which puts focus on the option that was opened — leave that out and
     the phone user is at the top of the document with the queue somewhere below
     them and no announcement that anything happened.

     Opening moves focus into the detail region, whose accessible name is the
     record heading, so the swap is announced by the mechanism that already
     exists rather than by a live region firing on every arrow key.

     Nothing scrolls sideways. The summary grid is two columns at 390px and four
     from sm; the lines table is a stack of cards below md and a table above it,
     which is the same restack the table entry uses. -->
<main class="flex h-[600px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-[14px]/5 text-zinc-900"
      x-id="['q', 'rec']"
      x-data="{
        sel: 0, detail: false,
        grns: [
          { grn: 'GRN-26-0442', vendor: 'Sharma Extrusions', po: 'PO-24-1187', qty: '12,000 kg', gate: '21 Aug 06:40', status: 'Open', gap: 'Short by 400 kg against the challan' },
          { grn: 'GRN-26-0443', vendor: 'Nashik Steel Traders', po: 'PO-24-1203', qty: '640 kg', gate: '21 Aug 08:15', status: 'Approved', gap: 'Weighbridge slip missing' },
          { grn: 'GRN-26-0444', vendor: 'Gujarat Polymers Ltd', po: 'PO-24-1191', qty: '3,200 kg', gate: '21 Aug 09:02', status: 'Open', gap: 'No exception' },
          { grn: 'GRN-26-0445', vendor: 'Qureshi Metals', po: 'PO-24-1207', qty: '1,850 kg', gate: '21 Aug 10:30', status: 'Overdue', gap: 'Held 4 hours at the gate' },
          { grn: 'GRN-26-0446', vendor: 'Konkan Packaging Co', po: 'PO-24-1198', qty: '900 nos', gate: '21 Aug 11:12', status: 'Closed', gap: 'No exception' }
        ],
        dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
        get rec() { return this.grns[this.sel] },
        move(step) { this.go(Math.min(Math.max(this.sel + step, 0), this.grns.length - 1)) },
        go(i) {
          this.sel = i;
          this.$nextTick(() => {
            const el = this.$refs.list.querySelector('[aria-selected=true]');
            if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'nearest' }) }
          });
        },
        open() { this.detail = true; this.$nextTick(() => this.$refs.detail.focus()) },
        back() { this.detail = false; this.go(this.sel) }
      }">

  <div class="flex shrink-0 items-center gap-3 border-b border-zinc-200 px-4 py-3">
    <div class="min-w-0" :class="detail && 'hidden md:block'">
      <h1 class="text-[16px]/6 font-semibold">Gate receipts</h1>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">Silvassa · 21 Aug 2026 · 5 logged</p>
    </div>
    <!-- The record identity, not a second h1. There is one h1 in the document
         and it is the screen; the record is the detail pane's own h2, and
         repeating it here as a heading would put two h1s in one page. -->
    <div class="min-w-0 md:hidden" :class="detail ? 'block' : 'hidden'">
      <p class="text-[16px]/6 font-semibold tabular-nums" x-text="rec.grn"></p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500" x-text="'Record ' + (sel + 1) + ' of ' + grns.length"></p>
    </div>
  </div>

  <div class="flex min-h-0 flex-1">

    <section :aria-labelledby="$id('q')"
             class="flex min-h-0 w-full shrink-0 flex-col border-zinc-200 md:flex md:w-80 md:border-r"
             :class="{ 'hidden': detail, 'flex': !detail }">
      <div class="flex shrink-0 items-baseline justify-between gap-3 border-b border-zinc-200 px-4 py-2.5">
        <h2 :id="$id('q')" class="text-[13px]/5 font-medium">Today at the gate</h2>
        <p class="text-[12px]/4 tabular-nums text-zinc-500" x-text="(sel + 1) + ' of ' + grns.length"></p>
      </div>

      <ul x-ref="list" role="listbox" :aria-labelledby="$id('q')"
          @keydown.arrow-down.prevent="move(1)"
          @keydown.arrow-up.prevent="move(-1)"
          @keydown.home.prevent="go(0)"
          @keydown.end.prevent="go(grns.length - 1)"
          @keydown.enter.prevent="open()"
          class="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto">
        <template x-for="(g, i) in grns" :key="g.grn">
          <li role="option" :aria-selected="sel === i" :tabindex="sel === i ? 0 : -1"
              @click="go(i); open()"
              class="flex gap-2.5 px-4 py-3 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="sel === i && 'bg-zinc-100'">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true">
              <span class="size-1.5 rounded-full" :class="dot[g.status]"></span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-baseline justify-between gap-3">
                <span class="truncate text-[13px]/5 font-medium tabular-nums" x-text="g.grn"></span>
                <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600" x-text="g.qty"></span>
              </span>
              <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">
                <span x-text="g.status"></span> · <span x-text="g.vendor"></span>
              </span>
              <span class="mt-0.5 block truncate text-[11px]/4 tabular-nums text-zinc-500" x-text="'At the gate ' + g.gate"></span>
            </span>
            <!-- The chevron is decoration on a phone and absent from the option
                 name; the option is the target, and there is no second control
                 inside it to be unreachable. -->
            <span class="flex h-5 shrink-0 items-center text-zinc-400 md:hidden" aria-hidden="true">
              <i data-lucide="chevron-right" class="size-4"></i>
            </span>
          </li>
        </template>
      </ul>
    </section>

    <section x-ref="detail" tabindex="-1" :aria-labelledby="$id('rec')"
             @keydown.escape="back()"
             class="hidden min-h-0 w-full min-w-0 flex-1 flex-col md:flex focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
             :class="{ 'hidden': !detail, 'flex': detail }">

      <div class="shrink-0 border-b border-zinc-200 px-4 py-3 md:px-5">
        <button type="button" @click="back()"
                class="-ml-2 mb-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px]/5 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:hidden">
          <i data-lucide="chevron-left" class="size-4"></i>Back to the queue
        </button>
        <h2 :id="$id('rec')" class="flex flex-wrap items-center gap-2.5 text-[16px]/6 font-semibold">
          <span class="tabular-nums" x-text="rec.grn"></span>
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 shrink-0 rounded-full" :class="dot[rec.status]" aria-hidden="true"></span><span x-text="rec.status"></span>
          </span>
        </h2>
        <p class="mt-0.5 text-[12px]/4 text-zinc-600" x-text="rec.vendor + ' · against ' + rec.po"></p>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-5">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Received</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="rec.qty"></dd>
          </div>
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">At the gate</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="rec.gate"></dd>
          </div>
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Order</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="rec.po"></dd>
          </div>
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Vehicle</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums">MH-15-DQ-4412</dd>
          </div>
        </dl>

        <div class="mt-4 rounded-xl border border-zinc-200 p-4">
          <div class="flex items-start gap-2.5">
            <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
            <div class="min-w-0">
              <p class="text-[13px]/5 font-medium">Exception on this receipt</p>
              <p class="mt-0.5 text-[13px]/5 text-zinc-600" x-text="rec.gap"></p>
            </div>
          </div>
        </div>

        <h3 class="mt-5 text-[13px]/5 font-medium">Lines received</h3>

        <!-- Cards below md, a table from md. The same restack the table entry
             uses, and the reason nothing here scrolls sideways at 390px. -->
        <ul role="list" class="mt-2 space-y-2 md:hidden">
          <li class="rounded-xl border border-zinc-200 p-3">
            <p class="text-[13px]/5 font-medium">HDPE granules, natural</p>
            <dl class="mt-2 grid grid-cols-2 gap-2 text-[12px]/4">
              <div class="flex gap-2"><dt class="text-zinc-600">Challan</dt><dd class="tabular-nums">12,400 kg</dd></div>
              <div class="flex gap-2"><dt class="text-zinc-600">Weighed</dt><dd class="tabular-nums">12,000 kg</dd></div>
            </dl>
          </li>
          <li class="rounded-xl border border-zinc-200 p-3">
            <p class="text-[13px]/5 font-medium">Masterbatch, blue</p>
            <dl class="mt-2 grid grid-cols-2 gap-2 text-[12px]/4">
              <div class="flex gap-2"><dt class="text-zinc-600">Challan</dt><dd class="tabular-nums">200 kg</dd></div>
              <div class="flex gap-2"><dt class="text-zinc-600">Weighed</dt><dd class="tabular-nums">200 kg</dd></div>
            </dl>
          </li>
        </ul>

        <div class="mt-2 hidden overflow-hidden rounded-xl border border-zinc-200 md:block">
          <table class="w-full text-[13px]/5">
            <thead>
              <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">
                <th scope="col" class="px-3 py-2 font-medium">Material</th>
                <th scope="col" class="px-3 py-2 text-right font-medium">Challan</th>
                <th scope="col" class="px-3 py-2 text-right font-medium">Weighed</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-zinc-100">
                <td class="px-3 py-2">HDPE granules, natural</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">12,400 kg</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">12,000 kg</td>
              </tr>
              <tr>
                <td class="px-3 py-2">Masterbatch, blue</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">200 kg</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">200 kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex shrink-0 gap-2 border-t border-zinc-200 px-4 py-3 md:px-5">
        <button type="button" class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:h-9 md:flex-none">
          Raise a debit note
        </button>
        <button type="button" class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:h-9 md:flex-none">
          <i data-lucide="check" class="size-4"></i>Post the receipt
        </button>
      </div>
    </section>
  </div>
</main>` },

      { id: 'search', name: 'Search and filters over the list', code:
`<!-- The list gets a header that filters it, and the interesting problem is what
     happens to the record already in the detail pane when the filter excludes it.

     Three answers are on offer and two of them are wrong. Blanking the pane
     deletes the record somebody is reading because they typed in a box. Jumping
     to the first match opens a record nobody asked for, and on a decision queue
     that is a record put in front of a user without their say-so. The third is
     what this does: keep it, and say so in a line above it. The detail is what
     you are working on; the list is how you found it, and re-filtering the list
     is not an instruction about the record.

     The keyboard hand-off is one binding and it runs one way only. Down in the
     search box moves focus to the first result, because that is the gesture the
     field already implies. The listbox arrows stay on the listbox, so the caret
     keys inside the box are the field's own and typing is never intercepted —
     which is also why there is no type-ahead on the list. A listbox that jumps
     on a keystroke while a search box sits above it is two search boxes, and the
     one that eats letters silently is the one nobody asked for.

     There is no type-ahead and there is no wrap. Escape clears the box and stops
     propagating, so it does not also close a sheet this list is sitting in.

     When the filter matches nothing the rows are replaced by empty-state's
     no-results shape, in the box the rows would have filled, with no create
     button on it — the records exist and the query is hiding them. The count
     line is a role="status" that was on the panel before the first keystroke,
     which is the condition a live region has to meet to be heard at all.

     The pager under the list is pagination's dense form. It pages the queue and
     nothing else: the selection survives it, which is why the detail can still
     be showing a record from page one while page two is on screen. -->
<main class="flex h-[640px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-[14px]/5 text-zinc-900"
      x-id="['q', 'rec']"
      x-data="{
        q: '', plant: 'all', sel: 'BN-26-0418', page: 1, size: 4, detail: false,
        batches: [
          { id: 'BN-26-0411', item: 'HDPE compound, natural', plant: 'Silvassa', qty: '2,400 kg', status: 'Closed', held: 'Released 20 Aug', reason: 'Passed on retest' },
          { id: 'BN-26-0418', item: 'PP copolymer, black', plant: 'Silvassa', qty: '1,800 kg', status: 'Overdue', held: 'On hold 6 days', reason: 'MFI 4.1 against a spec of 2.8–3.6' },
          { id: 'BN-26-0421', item: 'Masterbatch, blue', plant: 'Vapi', qty: '320 kg', status: 'Approved', held: 'On hold 2 days', reason: 'Dispersion rated 3 on the filter test' },
          { id: 'BN-26-0424', item: 'LDPE film grade', plant: 'Silvassa', qty: '5,600 kg', status: 'Open', held: 'On hold 1 day', reason: 'Moisture 0.09% against a limit of 0.05%' },
          { id: 'BN-26-0427', item: 'PP homopolymer, natural', plant: 'Vapi', qty: '3,200 kg', status: 'Open', held: 'On hold 1 day', reason: 'Ash content pending' },
          { id: 'BN-26-0430', item: 'HDPE compound, black', plant: 'Silvassa', qty: '900 kg', status: 'Approved', held: 'On hold today', reason: 'Awaiting the tensile result' }
        ],
        dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
        get matched() {
          const q = this.q.trim().toLowerCase();
          return this.batches.filter(b =>
            (this.plant === 'all' || b.plant === this.plant) &&
            (!q || (b.id + ' ' + b.item).toLowerCase().includes(q)));
        },
        get pages() { return Math.max(1, Math.ceil(this.matched.length / this.size)) },
        get shown() { return this.matched.slice((this.page - 1) * this.size, this.page * this.size) },
        get rec() { return this.batches.find(b => b.id === this.sel) },
        get outside() { return this.rec && !this.matched.some(b => b.id === this.sel) },
        move(step) {
          const list = this.shown;
          const i = list.findIndex(b => b.id === this.sel);
          const next = Math.min(Math.max((i < 0 ? 0 : i + step), 0), list.length - 1);
          if (list[next]) this.go(list[next].id);
        },
        go(id) {
          this.sel = id;
          this.$nextTick(() => {
            const el = this.$refs.list.querySelector('[aria-selected=true]');
            if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'nearest' }) }
          });
        },
        first() { if (this.shown.length) this.go(this.shown[0].id) },
        clear() { this.q = ''; this.plant = 'all'; this.page = 1; this.$refs.q.focus() },
        open() { this.detail = true; this.$nextTick(() => this.$refs.detail.focus()) },
        back() { this.detail = false; this.go(this.sel) }
      }"
      x-effect="if (page > pages) page = pages">

  <div class="shrink-0 border-b border-zinc-200 px-4 py-3">
    <h1 class="text-[16px]/6 font-semibold">Batches on quality hold</h1>
    <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">6 batches held across two plants</p>
  </div>

  <div class="flex min-h-0 flex-1">

    <section :aria-labelledby="$id('q')"
             class="flex min-h-0 w-full shrink-0 flex-col border-zinc-200 md:flex md:w-80 md:border-r lg:w-[22rem]"
             :class="{ 'hidden': detail, 'flex': !detail }">

      <div class="shrink-0 space-y-2.5 border-b border-zinc-200 px-4 py-3">
        <h2 :id="$id('q')" class="sr-only">Held batches</h2>

        <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
          <input x-ref="q" x-model="q" type="search" aria-label="Search held batches"
                 autocomplete="off" spellcheck="false" enterkeyhint="search"
                 @input="page = 1"
                 @keydown.arrow-down.prevent="first()"
                 @keydown.escape="if (q) { $event.stopPropagation(); q = '' }"
                 placeholder="Batch number or material"
                 class="w-full min-w-0 bg-transparent px-2 py-1.5 text-[13px]/5 outline-none placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none">
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          <template x-for="p in ['all', 'Silvassa', 'Vapi']" :key="p">
            <button type="button" @click="plant = p; page = 1" :aria-pressed="plant === p"
                    class="inline-flex h-7 items-center rounded-full px-2.5 text-[12px]/4 font-medium ring-1 ring-inset focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                    :class="plant === p ? 'bg-zinc-700 text-white ring-zinc-700' : 'bg-zinc-200 text-zinc-700 ring-zinc-300 hover:bg-zinc-300'"
                    x-text="p === 'all' ? 'All plants' : p"></button>
          </template>
        </div>

        <p role="status" class="text-[12px]/4 tabular-nums text-zinc-500"
           x-text="matched.length ? matched.length + ' of ' + batches.length + ' batches' : 'No batches match this search'"></p>
      </div>

      <ul x-ref="list" role="listbox" :aria-labelledby="$id('q')"
          x-show="matched.length"
          @keydown.arrow-down.prevent="move(1)"
          @keydown.arrow-up.prevent="move(-1)"
          @keydown.home.prevent="first()"
          @keydown.end.prevent="if (shown.length) go(shown[shown.length - 1].id)"
          @keydown.enter.prevent="open()"
          class="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto">
        <template x-for="b in shown" :key="b.id">
          <li role="option" :aria-selected="sel === b.id" :tabindex="sel === b.id ? 0 : -1"
              @click="go(b.id); open()"
              class="flex gap-2.5 px-4 py-3 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="sel === b.id && 'bg-zinc-100'">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true">
              <span class="size-1.5 rounded-full" :class="dot[b.status]"></span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-baseline justify-between gap-3">
                <span class="truncate text-[13px]/5 font-medium tabular-nums" x-text="b.id"></span>
                <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600" x-text="b.qty"></span>
              </span>
              <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">
                <span x-text="b.status"></span> · <span x-text="b.item"></span>
              </span>
              <span class="mt-0.5 block truncate text-[11px]/4 text-zinc-500" x-text="b.plant + ' · ' + b.held"></span>
            </span>
          </li>
        </template>
      </ul>

      <!-- Same box the rows would have filled, and no create button on it: the
           batches exist and the query is hiding them. -->
      <div x-show="!matched.length" x-cloak class="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
          <i data-lucide="search-x" class="size-5 text-zinc-600"></i>
        </span>
        <h3 class="mt-3 text-[14px]/5 font-semibold">No batches match</h3>
        <p class="mt-1 text-[12px]/4 text-zinc-600">The search covers the batch number and the material. The plant filter is still on.</p>
        <button type="button" @click="clear()"
                class="mt-3 inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Clear the search and filters
        </button>
      </div>

      <nav aria-label="Held batch pages" class="flex shrink-0 items-center justify-between gap-2 border-t border-zinc-200 px-3 py-2">
        <p class="text-[12px]/4 tabular-nums text-zinc-500" x-text="'Page ' + page + ' of ' + pages"></p>
        <div class="flex gap-1">
          <button type="button" aria-label="Previous page of held batches" @click="page = Math.max(page - 1, 1)" :disabled="page === 1"
                  class="flex size-7 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="chevron-left" class="size-4"></i>
          </button>
          <button type="button" aria-label="Next page of held batches" @click="page = Math.min(page + 1, pages)" :disabled="page === pages"
                  class="flex size-7 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="chevron-right" class="size-4"></i>
          </button>
        </div>
      </nav>
    </section>

    <section x-ref="detail" tabindex="-1" :aria-labelledby="$id('rec')"
             @keydown.escape="back()"
             class="hidden min-h-0 w-full min-w-0 flex-1 flex-col md:flex focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
             :class="{ 'hidden': !detail, 'flex': detail }">
      <div class="shrink-0 border-b border-zinc-200 px-4 py-3 md:px-5 md:py-4">
        <button type="button" @click="back()"
                class="-ml-2 mb-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px]/5 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:hidden">
          <i data-lucide="chevron-left" class="size-4"></i>Back to the queue
        </button>
        <h2 :id="$id('rec')" class="flex flex-wrap items-center gap-2.5 text-[16px]/6 font-semibold">
          <span class="tabular-nums" x-text="rec.id"></span>
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 shrink-0 rounded-full" :class="dot[rec.status]" aria-hidden="true"></span><span x-text="rec.status"></span>
          </span>
        </h2>
        <p class="mt-0.5 text-[12px]/4 text-zinc-600" x-text="rec.item + ' · ' + rec.plant + ' · ' + rec.qty"></p>
      </div>

      <!-- The record stays put when the filter drops it, and a line says why it
           is no longer in the list beside it. Blanking the pane deletes what
           somebody is reading because they typed in a box. -->
      <p x-show="outside" x-cloak role="status"
         class="flex shrink-0 items-start gap-2 border-b border-zinc-200 bg-zinc-100 px-5 py-2.5 text-[12px]/4 text-zinc-600">
        <i data-lucide="filter" class="mt-px size-3.5 shrink-0 text-zinc-600"></i>
        <span><span class="font-medium text-zinc-900" x-text="rec.id"></span> is still open here but is outside the current search and filters.</span>
      </p>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div class="rounded-xl border border-zinc-200 p-4">
          <div class="flex items-start gap-2.5">
            <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
            <div class="min-w-0">
              <p class="text-[13px]/5 font-medium">Why this batch is held</p>
              <p class="mt-0.5 text-[13px]/5 tabular-nums text-zinc-600" x-text="rec.reason"></p>
            </div>
          </div>
        </div>

        <h3 class="mt-5 text-[13px]/5 font-medium">Lab results</h3>
        <div class="mt-2 overflow-hidden rounded-xl border border-zinc-200">
          <table class="w-full text-[13px]/5">
            <thead>
              <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">
                <th scope="col" class="px-3 py-2 font-medium">Parameter</th>
                <th scope="col" class="px-3 py-2 text-right font-medium">Spec</th>
                <th scope="col" class="px-3 py-2 text-right font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-zinc-100">
                <td class="px-3 py-2">Melt flow index, g/10 min</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">2.8 – 3.6</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">4.1</td>
              </tr>
              <tr class="border-b border-zinc-100">
                <td class="px-3 py-2">Moisture, %</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">≤ 0.05</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">0.03</td>
              </tr>
              <tr>
                <td class="px-3 py-2">Ash content, %</td>
                <td class="px-3 py-2 text-right tabular-nums text-zinc-600">≤ 0.20</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">0.14</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</main>` },

      { id: 'three-pane', name: 'Filters, list and detail', code:
`<!-- Three panes, three scrollers, and the rule that makes it work is that each
     one is a Tab stop of its own and none of them steals the others' keys. The
     filter rail is a set of ordinary radios and checkboxes walked by Tab; the
     list is a listbox walked by the arrows; the detail is a region focus lands
     on when a record is committed. Give the rail arrow-key navigation too and
     the user has three widgets that all answer Down and no way to know which one
     has it.

     The rail is an <aside> with a name, because at three landmarks in a row the
     landmark list is how somebody moves between them. Its width is fixed at
     14rem: a filter column that flexes gets wider on a 27-inch screen and puts
     forty pixels between a checkbox and its label.

     Three panes need real width, so the rail is hidden below lg rather than
     squeezed. What replaces it is not nothing: the filters that are set show as
     chips in the list header, and the Filters button opens the drawer component
     over the list at that width. A rail that silently disappears takes the state
     it holds with it, and the user cannot tell why the list is short.

     Only the panes scroll. The frame is a fixed-height flex row and every child
     in the chain carries min-h-0, or the panes refuse to shrink, the frame grows
     past its own height and the page scrolls instead of any of them.

     As a real page: drop h-[640px] and the wrapper border, put h-screen
     overflow-hidden on <body>, and let the rail sit beside app-shell's sidebar
     rather than inside it — one is where you are in the application and the
     other is what you are looking at in this screen. -->
<main class="flex h-[640px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-[14px]/5 text-zinc-900"
      x-id="['q', 'rec']"
      x-data="{
        sel: 0, detail: false, view: 'mine', tones: { Overdue: true, Approved: true, Open: true },
        entries: [
          { id: 'INV-26-2210', vendor: 'Sharma Extrusions', amount: '₹18,42,000', due: '22 Aug', age: '46 days', status: 'Overdue', po: 'PO-24-1187', match: 'Three-way match failed: invoiced 12,400 kg against a receipt of 12,000 kg' },
          { id: 'INV-26-2214', vendor: 'Gujarat Polymers Ltd', amount: '₹7,15,600', due: '28 Aug', age: '31 days', status: 'Approved', po: 'PO-24-1191', match: 'Matched to the receipt, awaiting the plant head' },
          { id: 'INV-26-2219', vendor: 'Deccan Bearings Pvt Ltd', amount: '₹2,84,300', due: '01 Sep', age: '18 days', status: 'Open', po: 'PO-24-1194', match: 'Matched to the receipt' },
          { id: 'INV-26-2223', vendor: 'Nashik Steel Traders', amount: '₹96,750', due: '05 Sep', age: '12 days', status: 'Open', po: 'PO-24-1203', match: 'Matched to the receipt' },
          { id: 'INV-26-2227', vendor: 'Qureshi Metals', amount: '₹5,46,000', due: '09 Sep', age: '9 days', status: 'Overdue', po: 'PO-24-1207', match: 'Three-way match failed: rate is ₹4.20 a kg above the contract' },
          { id: 'INV-26-2231', vendor: 'Konkan Packaging Co', amount: '₹1,09,750', due: '11 Sep', age: '6 days', status: 'Approved', po: 'PO-24-1198', match: 'Matched to the receipt, awaiting finance' }
        ],
        dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
        get rows() { return this.entries.filter(e => this.tones[e.status]) },
        get rec() { return this.rows[this.sel] || this.rows[0] },
        move(step) { this.go(Math.min(Math.max(this.sel + step, 0), this.rows.length - 1)) },
        go(i) {
          this.sel = i;
          this.$nextTick(() => {
            const el = this.$refs.list.querySelector('[aria-selected=true]');
            if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'nearest' }) }
          });
        },
        open() { this.detail = true; this.$nextTick(() => this.$refs.detail.focus()) },
        back() { this.detail = false; this.go(this.sel) }
      }"
      x-effect="if (sel > rows.length - 1) sel = Math.max(rows.length - 1, 0)">

  <div class="shrink-0 border-b border-zinc-200 px-4 py-3">
    <h1 class="text-[16px]/6 font-semibold">Vendor invoices to clear</h1>
    <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">6 invoices · ₹35,94,400 outstanding</p>
  </div>

  <div class="flex min-h-0 flex-1">

    <!-- filters -->
    <aside aria-label="Invoice filters" class="hidden w-56 shrink-0 flex-col border-r border-zinc-200 lg:flex">
      <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <fieldset>
          <legend class="text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Saved views</legend>
          <div class="mt-2 space-y-1.5">
            <label class="flex items-center gap-2.5 text-[13px]/5">
              <input type="radio" name="ld-view" value="mine" x-model="view" class="size-4 shrink-0 accent-zinc-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span>Waiting on me</span>
            </label>
            <label class="flex items-center gap-2.5 text-[13px]/5">
              <input type="radio" name="ld-view" value="plant" x-model="view" class="size-4 shrink-0 accent-zinc-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span>Silvassa, all buyers</span>
            </label>
            <label class="flex items-center gap-2.5 text-[13px]/5">
              <input type="radio" name="ld-view" value="mismatch" x-model="view" class="size-4 shrink-0 accent-zinc-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span>Failed three-way match</span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend class="text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Status</legend>
          <div class="mt-2 space-y-1.5">
            <template x-for="s in ['Overdue', 'Approved', 'Open']" :key="s">
              <label class="flex items-center gap-2.5 text-[13px]/5">
                <input type="checkbox" :checked="tones[s]" @change="tones[s] = $event.target.checked" class="size-4 shrink-0 rounded accent-zinc-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="flex items-center gap-2">
                  <span class="size-1.5 shrink-0 rounded-full" :class="dot[s]" aria-hidden="true"></span>
                  <span x-text="s"></span>
                </span>
                <span class="ml-auto text-[12px]/4 tabular-nums text-zinc-500" x-text="entries.filter(e => e.status === s).length"></span>
              </label>
            </template>
          </div>
        </fieldset>

        <fieldset>
          <legend class="text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Ageing</legend>
          <div class="mt-2 space-y-1.5">
            <label class="flex items-center gap-2.5 text-[13px]/5">
              <input type="checkbox" class="size-4 shrink-0 rounded accent-zinc-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span>Over 30 days</span>
            </label>
            <label class="flex items-center gap-2.5 text-[13px]/5">
              <input type="checkbox" class="size-4 shrink-0 rounded accent-zinc-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span>Over 60 days</span>
            </label>
          </div>
        </fieldset>
      </div>
    </aside>

    <!-- list -->
    <section :aria-labelledby="$id('q')"
             class="flex min-h-0 w-full shrink-0 flex-col border-zinc-200 md:flex md:w-80 md:border-r lg:w-[22rem]"
             :class="{ 'hidden': detail, 'flex': !detail }">
      <div class="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-zinc-200 px-4 py-2.5">
        <h2 :id="$id('q')" class="text-[13px]/5 font-medium">Invoices</h2>
        <p class="text-[12px]/4 tabular-nums text-zinc-500" x-text="rows.length + ' shown'"></p>
        <!-- Below lg the rail is gone, so what it holds shows here and the
             Filters button opens the drawer over the list. -->
        <button type="button" class="ml-auto inline-flex h-7 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 lg:hidden">
          <i data-lucide="sliders-horizontal" class="size-3.5 text-zinc-600"></i>Filters
          <span class="rounded-full bg-zinc-200 px-1.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300" x-text="Object.values(tones).filter(Boolean).length"></span>
        </button>
      </div>

      <ul x-ref="list" role="listbox" :aria-labelledby="$id('q')"
          @keydown.arrow-down.prevent="move(1)"
          @keydown.arrow-up.prevent="move(-1)"
          @keydown.home.prevent="go(0)"
          @keydown.end.prevent="go(rows.length - 1)"
          @keydown.enter.prevent="open()"
          class="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto">
        <template x-for="(e, i) in rows" :key="e.id">
          <li role="option" :aria-selected="sel === i" :tabindex="sel === i ? 0 : -1"
              @click="go(i); open()"
              class="flex gap-2.5 px-4 py-3 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="sel === i && 'bg-zinc-100'">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true">
              <span class="size-1.5 rounded-full" :class="dot[e.status]"></span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-baseline justify-between gap-3">
                <span class="truncate text-[13px]/5 font-medium tabular-nums" x-text="e.id"></span>
                <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600" x-text="e.amount"></span>
              </span>
              <span class="mt-0.5 block truncate text-[12px]/4 tabular-nums text-zinc-500">
                <span x-text="e.status"></span> · <span x-text="e.vendor"></span> · <span x-text="e.age"></span>
              </span>
            </span>
          </li>
        </template>
      </ul>
    </section>

    <!-- detail -->
    <section x-ref="detail" tabindex="-1" :aria-labelledby="$id('rec')"
             @keydown.escape="back()"
             class="hidden min-h-0 w-full min-w-0 flex-1 flex-col md:flex focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
             :class="{ 'hidden': !detail, 'flex': detail }">
      <div class="shrink-0 border-b border-zinc-200 px-4 py-3 md:px-5 md:py-4">
        <button type="button" @click="back()"
                class="-ml-2 mb-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px]/5 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:hidden">
          <i data-lucide="chevron-left" class="size-4"></i>Back to the queue
        </button>
        <h2 :id="$id('rec')" class="flex flex-wrap items-center gap-2.5 text-[16px]/6 font-semibold">
          <span class="tabular-nums" x-text="rec.id"></span>
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 shrink-0 rounded-full" :class="dot[rec.status]" aria-hidden="true"></span><span x-text="rec.status"></span>
          </span>
        </h2>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="rec.vendor + ' · against ' + rec.po"></p>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <dl class="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Invoice value</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="rec.amount"></dd>
          </div>
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Payable by</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="rec.due"></dd>
          </div>
          <div>
            <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Ageing</dt>
            <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="rec.age"></dd>
          </div>
        </dl>

        <div class="mt-4 rounded-xl border border-zinc-200 p-4">
          <p class="text-[13px]/5 font-medium">Three-way match</p>
          <p class="mt-0.5 text-[13px]/5 tabular-nums text-zinc-600" x-text="rec.match"></p>
        </div>

        <h3 class="mt-5 text-[13px]/5 font-medium">Ledger entries</h3>
        <div class="mt-2 overflow-hidden rounded-xl border border-zinc-200">
          <table class="w-full text-[13px]/5">
            <thead>
              <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">
                <th scope="col" class="px-3 py-2 font-medium">Posted</th>
                <th scope="col" class="px-3 py-2 font-medium">Account</th>
                <th scope="col" class="px-3 py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-zinc-100">
                <td class="px-3 py-2 tabular-nums">14 Aug 2026</td>
                <td class="px-3 py-2">Raw material purchases</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">₹15,61,017</td>
              </tr>
              <tr class="border-b border-zinc-100">
                <td class="px-3 py-2 tabular-nums">14 Aug 2026</td>
                <td class="px-3 py-2">Input GST receivable</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">₹2,80,983</td>
              </tr>
              <tr>
                <td class="px-3 py-2 tabular-nums">14 Aug 2026</td>
                <td class="px-3 py-2">Sundry creditors</td>
                <td class="px-3 py-2 text-right font-medium tabular-nums">₹18,42,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex shrink-0 gap-2 border-t border-zinc-200 px-5 py-3">
        <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Query with the vendor
        </button>
        <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="check" class="size-4"></i>Clear for payment
        </button>
      </div>
    </section>
  </div>
</main>` },

      { id: 'loading', name: 'Detail loading, list still live', code:
`<!-- The pane costs a request and the queue does not stop while it is in flight.
     Three things have to be true for that to work.

     The list stays interactive. The arrows keep moving, the options keep their
     roving tabindex, and nothing is disabled — disabling the list while the
     detail loads takes the control away from the person holding it, and on a
     slow connection that is the whole session.

     Out-of-order responses are dropped. Every request carries a token and the
     handler returns unless its token is still the current one, so arrowing
     three records down in half a second paints the third record and not
     whichever request happened to come back last. Without it the pane and the
     selection disagree and the user is reading the wrong batch under the right
     heading, which is the worst failure this layout has.

     What the page already knows is drawn for real. The batch number, the
     material and the status came from the row that was clicked, so they are on
     the header the whole time — grey them out and the pane flashes its own title
     away and lands it again, which reads as a navigation that went wrong. Only
     the three regions waiting on the query are skeleton, each at the height the
     loaded version takes, so nothing moves on arrival.

     One aria-busy on the pane, one sr-only role="status" outside the pulse
     wrappers, and each wrapper carries its own aria-hidden and
     motion-reduce:animate-none. The status region is where this layout does need
     a live region: the pane resolves without focus moving, so nothing else would
     say it had. -->
<main class="flex h-[600px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-[14px]/5 text-zinc-900"
      x-id="['q', 'rec']"
      x-data="{
        sel: 1, detail: false, loading: false, token: 0, said: '',
        batches: [
          { id: 'BN-26-0411', item: 'HDPE compound, natural', qty: '2,400 kg', status: 'Closed' },
          { id: 'BN-26-0418', item: 'PP copolymer, black', qty: '1,800 kg', status: 'Overdue' },
          { id: 'BN-26-0421', item: 'Masterbatch, blue', qty: '320 kg', status: 'Approved' },
          { id: 'BN-26-0424', item: 'LDPE film grade', qty: '5,600 kg', status: 'Open' },
          { id: 'BN-26-0427', item: 'PP homopolymer, natural', qty: '3,200 kg', status: 'Open' }
        ],
        dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
        get rec() { return this.batches[this.sel] },
        move(step) { this.go(Math.min(Math.max(this.sel + step, 0), this.batches.length - 1)) },
        go(i) { this.sel = i; this.reveal(); this.load() },
        reveal() {
          this.$nextTick(() => {
            const el = this.$refs.list.querySelector('[aria-selected=true]');
            if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'nearest' }) }
          });
        },
        open() { this.detail = true; this.$nextTick(() => this.$refs.detail.focus()) },
        back() { this.detail = false; this.reveal() },
        load() {
          const t = ++this.token;
          this.loading = true;
          this.said = '';
          setTimeout(() => {
            if (t !== this.token) return;
            this.loading = false;
            this.said = this.rec.id + ' loaded, ' + this.rec.item;
          }, 1400);
        }
      }">

  <p role="status" class="sr-only" x-text="said"></p>

  <div class="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200 px-4 py-3">
    <div class="min-w-0">
      <h1 class="text-[16px]/6 font-semibold">Batch traceability</h1>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">Silvassa · 5 batches in the last 24 hours</p>
    </div>
    <button type="button" @click="load()"
            class="ml-auto inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="refresh-cw" class="size-4 text-zinc-600"></i>Reload the pane
    </button>
  </div>

  <div class="flex min-h-0 flex-1">

    <section :aria-labelledby="$id('q')"
             class="flex min-h-0 w-full shrink-0 flex-col border-zinc-200 md:flex md:w-80 md:border-r"
             :class="{ 'hidden': detail, 'flex': !detail }">
      <div class="flex shrink-0 items-baseline justify-between gap-3 border-b border-zinc-200 px-4 py-2.5">
        <h2 :id="$id('q')" class="text-[13px]/5 font-medium">Batches</h2>
        <p class="text-[12px]/4 tabular-nums text-zinc-500" x-text="(sel + 1) + ' of ' + batches.length"></p>
      </div>

      <!-- Not disabled while the pane loads. Arrow away and the request in
           flight is abandoned by its token, not by taking the keys away. -->
      <ul x-ref="list" role="listbox" :aria-labelledby="$id('q')"
          @keydown.arrow-down.prevent="move(1)"
          @keydown.arrow-up.prevent="move(-1)"
          @keydown.home.prevent="go(0)"
          @keydown.end.prevent="go(batches.length - 1)"
          @keydown.enter.prevent="open()"
          class="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto">
        <template x-for="(b, i) in batches" :key="b.id">
          <li role="option" :aria-selected="sel === i" :tabindex="sel === i ? 0 : -1"
              @click="go(i); open()"
              class="flex gap-2.5 px-4 py-3 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="sel === i && 'bg-zinc-100'">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true">
              <span class="size-1.5 rounded-full" :class="dot[b.status]"></span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-baseline justify-between gap-3">
                <span class="truncate text-[13px]/5 font-medium tabular-nums" x-text="b.id"></span>
                <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600" x-text="b.qty"></span>
              </span>
              <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">
                <span x-text="b.status"></span> · <span x-text="b.item"></span>
              </span>
            </span>
          </li>
        </template>
      </ul>
    </section>

    <section x-ref="detail" tabindex="-1" :aria-labelledby="$id('rec')" :aria-busy="loading"
             @keydown.escape="back()"
             class="hidden min-h-0 w-full min-w-0 flex-1 flex-col md:flex focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
             :class="{ 'hidden': !detail, 'flex': detail }">

      <!-- Drawn for real through the wait: all of it came from the row. -->
      <div class="shrink-0 border-b border-zinc-200 px-4 py-3 md:px-5 md:py-4">
        <button type="button" @click="back()"
                class="-ml-2 mb-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px]/5 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:hidden">
          <i data-lucide="chevron-left" class="size-4"></i>Back to the queue
        </button>
        <h2 :id="$id('rec')" class="flex flex-wrap items-center gap-2.5 text-[16px]/6 font-semibold">
          <span class="tabular-nums" x-text="rec.id"></span>
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 shrink-0 rounded-full" :class="dot[rec.status]" aria-hidden="true"></span><span x-text="rec.status"></span>
          </span>
        </h2>
        <p class="mt-0.5 text-[12px]/4 text-zinc-600" x-text="rec.item + ' · ' + rec.qty"></p>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">

        <!-- loading -->
        <div x-show="loading">
          <div class="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            <div>
              <p class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Produced</p>
              <div class="mt-1.5 flex h-5 items-center" aria-hidden="true"><div class="h-2.5 w-24 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div></div>
            </div>
            <div>
              <p class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Line</p>
              <div class="mt-1.5 flex h-5 items-center" aria-hidden="true"><div class="h-2.5 w-16 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div></div>
            </div>
            <div>
              <p class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Shift</p>
              <div class="mt-1.5 flex h-5 items-center" aria-hidden="true"><div class="h-2.5 w-20 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div></div>
            </div>
            <div>
              <p class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Operator</p>
              <div class="mt-1.5 flex h-5 items-center" aria-hidden="true"><div class="h-2.5 w-28 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div></div>
            </div>
          </div>

          <h3 class="mt-5 text-[13px]/5 font-medium">Consumed against this batch</h3>
          <div class="mt-2 overflow-hidden rounded-xl border border-zinc-200">
            <table class="w-full text-[13px]/5">
              <thead>
                <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">
                  <th scope="col" class="px-3 py-2 font-medium">Material</th>
                  <th scope="col" class="px-3 py-2 text-right font-medium">Lot</th>
                  <th scope="col" class="px-3 py-2 text-right font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
                <tr class="border-b border-zinc-100">
                  <td class="px-3 py-2"><div class="flex h-5 items-center"><div class="h-2.5 w-40 rounded bg-zinc-200"></div></div></td>
                  <td class="px-3 py-2"><div class="flex h-5 items-center justify-end"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
                  <td class="px-3 py-2"><div class="flex h-5 items-center justify-end"><div class="h-2.5 w-16 rounded bg-zinc-200"></div></div></td>
                </tr>
                <tr class="border-b border-zinc-100">
                  <td class="px-3 py-2"><div class="flex h-5 items-center"><div class="h-2.5 w-32 rounded bg-zinc-200"></div></div></td>
                  <td class="px-3 py-2"><div class="flex h-5 items-center justify-end"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
                  <td class="px-3 py-2"><div class="flex h-5 items-center justify-end"><div class="h-2.5 w-14 rounded bg-zinc-200"></div></div></td>
                </tr>
                <tr>
                  <td class="px-3 py-2"><div class="flex h-5 items-center"><div class="h-2.5 w-36 rounded bg-zinc-200"></div></div></td>
                  <td class="px-3 py-2"><div class="flex h-5 items-center justify-end"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
                  <td class="px-3 py-2"><div class="flex h-5 items-center justify-end"><div class="h-2.5 w-16 rounded bg-zinc-200"></div></div></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="mt-5 text-[13px]/5 font-medium">Where it went</h3>
          <div class="mt-2 animate-pulse space-y-2.5 motion-reduce:animate-none" aria-hidden="true">
            <div class="flex items-start gap-2.5">
              <span class="flex h-5 shrink-0 items-center"><span class="size-1.5 rounded-full bg-zinc-300"></span></span>
              <div class="flex h-5 flex-1 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
            </div>
            <div class="flex items-start gap-2.5">
              <span class="flex h-5 shrink-0 items-center"><span class="size-1.5 rounded-full bg-zinc-300"></span></span>
              <div class="flex h-5 flex-1 items-center"><div class="h-2.5 w-3/4 rounded bg-zinc-200"></div></div>
            </div>
          </div>
        </div>

        <!-- loaded -->
        <div x-show="!loading" x-cloak>
          <dl class="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            <div>
              <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Produced</dt>
              <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums">19 Aug 2026</dd>
            </div>
            <div>
              <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Line</dt>
              <dd class="mt-1 text-[13px]/5 font-semibold tabular-nums">EX-04</dd>
            </div>
            <div>
              <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Shift</dt>
              <dd class="mt-1 text-[13px]/5 font-semibold">B</dd>
            </div>
            <div>
              <dt class="text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Operator</dt>
              <dd class="mt-1 text-[13px]/5 font-semibold">R. Kadam</dd>
            </div>
          </dl>

          <h3 class="mt-5 text-[13px]/5 font-medium">Consumed against this batch</h3>
          <div class="mt-2 overflow-hidden rounded-xl border border-zinc-200">
            <table class="w-full text-[13px]/5">
              <thead>
                <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">
                  <th scope="col" class="px-3 py-2 font-medium">Material</th>
                  <th scope="col" class="px-3 py-2 text-right font-medium">Lot</th>
                  <th scope="col" class="px-3 py-2 text-right font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-zinc-100">
                  <td class="px-3 py-2">PP copolymer resin</td>
                  <td class="px-3 py-2 text-right tabular-nums text-zinc-600">LOT-8841</td>
                  <td class="px-3 py-2 text-right font-medium tabular-nums">1,620 kg</td>
                </tr>
                <tr class="border-b border-zinc-100">
                  <td class="px-3 py-2">Carbon black masterbatch</td>
                  <td class="px-3 py-2 text-right tabular-nums text-zinc-600">LOT-8802</td>
                  <td class="px-3 py-2 text-right font-medium tabular-nums">126 kg</td>
                </tr>
                <tr>
                  <td class="px-3 py-2">Antioxidant blend</td>
                  <td class="px-3 py-2 text-right tabular-nums text-zinc-600">LOT-8790</td>
                  <td class="px-3 py-2 text-right font-medium tabular-nums">54 kg</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="mt-5 text-[13px]/5 font-medium">Where it went</h3>
          <ul role="list" class="mt-2 space-y-2.5">
            <li class="flex items-start gap-2.5">
              <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
              <p class="text-[13px]/5 tabular-nums text-zinc-600">1,200 kg issued to work order WO-26-0912 on 20 Aug 2026.</p>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
              <p class="text-[13px]/5 tabular-nums text-zinc-600">600 kg still in stores at Silvassa, bin C-14.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</main>` },

      { id: 'qc-hold', name: 'QC hold queue, worked one batch at a time', code:
`<!-- The assembled screen, and the whole reason the layout exists: eleven batches
     on hold, a decision on each, and the next one already on screen.

     Deciding removes the record from the queue, and that is the part everybody
     gets wrong. Focus is on an option that is about to stop existing, and when
     it does the browser drops focus to the body — the user is at the top of the
     document with the queue somewhere below them and nothing said about it. So
     decide() splices, clamps the selection to what is left, moves focus onto the
     record that took its place, and writes what happened into the status region.
     That last one is not decoration: the pane changed without focus moving into
     it, so the region is the only thing that says which batch is now open.

     No single-key shortcuts on the decision buttons. A layout this keyboard-
     driven invites them, and R for release is a regulated batch cleared by a
     keystroke somebody meant for the search box. The buttons are ordinary Tab
     stops in the detail pane, on a record the user has already committed to by
     pressing Enter, and Release is the one filled button on the screen.

     The tabs across the detail are the underline form from the tabs entry, and
     they are a widget with their own arrow keys — which is safe here only
     because the listbox arrows are bound on the listbox and not on the window.
     Two widgets answering Down at once is what a global handler produces.

     Pass and Fail on the results table are the semantic colour table, not the
     status mapping. A lab verdict is not a record status, so it does not take
     one of the five locked words — but it takes the same graphite pill and the
     same two shades those words would have used, emerald-600 for success and
     red-600 for danger, so nothing new is invented and nothing is reinterpreted.

     Progress is stated rather than implied. "3 of 11 decided" in the list header
     is what tells somebody whether the shift ends before the queue does, and it
     is the reason the count is written out instead of left to the length of a
     scrollbar.

     As a real page: drop the border and h-[640px], put h-screen overflow-hidden
     on <body>, and render this in app-shell's main column. -->
<main class="flex h-[640px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-[14px]/5 text-zinc-900"
      x-id="['q', 'rec', 'tab', 'panel']"
      x-data="{
        sel: 0, detail: false, decided: 3, tab: 'results', said: '',
        queue: [
          { id: 'BN-26-0418', item: 'PP copolymer, black', qty: '1,800 kg', held: '6 days', status: 'Overdue', line: 'EX-04', made: '15 Aug 2026', reason: 'Melt flow index out of specification', results: [ ['Melt flow index, g/10 min', '2.8 – 3.6', '4.1', 'Fail'], ['Moisture, %', '≤ 0.05', '0.03', 'Pass'], ['Ash content, %', '≤ 0.20', '0.14', 'Pass'], ['Tensile strength, MPa', '≥ 24.0', '25.6', 'Pass'] ] },
          { id: 'BN-26-0421', item: 'Masterbatch, blue', qty: '320 kg', held: '2 days', status: 'Approved', line: 'CM-01', made: '19 Aug 2026', reason: 'Dispersion rated 3 on the filter test', results: [ ['Dispersion rating', '≤ 2', '3', 'Fail'], ['Moisture, %', '≤ 0.10', '0.06', 'Pass'], ['Colour ΔE', '≤ 1.0', '0.4', 'Pass'] ] },
          { id: 'BN-26-0424', item: 'LDPE film grade', qty: '5,600 kg', held: '1 day', status: 'Open', line: 'EX-02', made: '20 Aug 2026', reason: 'Moisture above the drying limit', results: [ ['Moisture, %', '≤ 0.05', '0.09', 'Fail'], ['Melt flow index, g/10 min', '0.8 – 1.2', '1.0', 'Pass'], ['Ash content, %', '≤ 0.20', '0.11', 'Pass'] ] },
          { id: 'BN-26-0427', item: 'PP homopolymer, natural', qty: '3,200 kg', held: '1 day', status: 'Open', line: 'EX-04', made: '20 Aug 2026', reason: 'Ash content result outstanding', results: [ ['Ash content, %', '≤ 0.20', 'Pending', 'Open'], ['Melt flow index, g/10 min', '2.8 – 3.6', '3.2', 'Pass'], ['Moisture, %', '≤ 0.05', '0.02', 'Pass'] ] },
          { id: 'BN-26-0430', item: 'HDPE compound, black', qty: '900 kg', held: 'today', status: 'Approved', line: 'CM-02', made: '21 Aug 2026', reason: 'Tensile result outstanding', results: [ ['Tensile strength, MPa', '≥ 24.0', 'Pending', 'Open'], ['Moisture, %', '≤ 0.05', '0.04', 'Pass'], ['Carbon black, %', '2.0 – 2.6', '2.3', 'Pass'] ] }
        ],
        dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
        verdict: { Pass: 'bg-emerald-600', Fail: 'bg-red-600', Open: 'bg-zinc-500' },
        get rec() { return this.queue[this.sel] },
        move(step) { this.go(Math.min(Math.max(this.sel + step, 0), this.queue.length - 1)) },
        go(i) {
          this.sel = i; this.tab = 'results';
          this.$nextTick(() => {
            const el = this.$refs.list.querySelector('[aria-selected=true]');
            if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'nearest' }) }
            if (this.$refs.body) this.$refs.body.scrollTop = 0;
          });
        },
        open() { this.detail = true; this.$nextTick(() => this.$refs.detail.focus()) },
        back() { this.detail = false; this.go(this.sel) },
        decide(word) {
          const gone = this.rec.id;
          this.queue.splice(this.sel, 1);
          this.decided++;
          if (!this.queue.length) { this.said = gone + ' ' + word + '. The hold queue is clear.'; this.detail = false; return }
          this.sel = Math.min(this.sel, this.queue.length - 1);
          this.said = gone + ' ' + word + '. ' + this.rec.id + ', ' + this.rec.item + ', is now open. ' + this.queue.length + ' left on hold.';
          this.go(this.sel);
        }
      }">

  <p role="status" class="sr-only" x-text="said"></p>

  <div class="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200 px-4 py-3">
    <div class="min-w-0">
      <h1 class="text-[16px]/6 font-semibold">Quality holds</h1>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">Silvassa · shift B · 21 Aug 2026</p>
    </div>
    <p class="ml-auto shrink-0 text-[12px]/4 tabular-nums text-zinc-600"
       x-text="decided + ' decided · ' + queue.length + ' left'"></p>
  </div>

  <div class="flex min-h-0 flex-1">

    <section :aria-labelledby="$id('q')"
             class="flex min-h-0 w-full shrink-0 flex-col border-zinc-200 md:flex md:w-80 md:border-r lg:w-[22rem]"
             :class="{ 'hidden': detail, 'flex': !detail }">
      <div class="flex shrink-0 items-baseline justify-between gap-3 border-b border-zinc-200 px-4 py-2.5">
        <h2 :id="$id('q')" class="text-[13px]/5 font-medium">On hold</h2>
        <p class="text-[12px]/4 tabular-nums text-zinc-500" x-text="queue.length ? (sel + 1) + ' of ' + queue.length : 'none left'"></p>
      </div>

      <ul x-ref="list" role="listbox" :aria-labelledby="$id('q')"
          x-show="queue.length"
          @keydown.arrow-down.prevent="move(1)"
          @keydown.arrow-up.prevent="move(-1)"
          @keydown.home.prevent="go(0)"
          @keydown.end.prevent="go(queue.length - 1)"
          @keydown.enter.prevent="open()"
          class="min-h-0 flex-1 divide-y divide-zinc-100 overflow-y-auto">
        <template x-for="(b, i) in queue" :key="b.id">
          <li role="option" :aria-selected="sel === i" :tabindex="sel === i ? 0 : -1"
              @click="go(i); open()"
              class="flex gap-2.5 px-4 py-3 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="sel === i && 'bg-zinc-100'">
            <span class="flex h-5 shrink-0 items-center" aria-hidden="true">
              <span class="size-1.5 rounded-full" :class="dot[b.status]"></span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex items-baseline justify-between gap-3">
                <span class="truncate text-[13px]/5 font-medium tabular-nums" x-text="b.id"></span>
                <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600" x-text="b.qty"></span>
              </span>
              <span class="mt-0.5 block truncate text-[12px]/4 text-zinc-500">
                <span x-text="b.status"></span> · <span x-text="b.item"></span>
              </span>
              <span class="mt-0.5 block truncate text-[11px]/4 tabular-nums text-zinc-500" x-text="'Held ' + b.held + ' · line ' + b.line"></span>
            </span>
          </li>
        </template>
      </ul>

      <!-- The queue drains. Nothing-yet rather than no-results: this is a scope
           somebody emptied by working through it, and the create action would be
           putting a batch back on hold, which is not what finishing looks like. -->
      <div x-show="!queue.length" x-cloak class="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
          <i data-lucide="check-circle-2" class="size-5 text-emerald-600"></i>
        </span>
        <h3 class="mt-3 text-[14px]/5 font-semibold">Nothing left on hold</h3>
        <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-600" x-text="'All ' + decided + ' batches decided this shift.'"></p>
      </div>
    </section>

    <section x-ref="detail" tabindex="-1" :aria-labelledby="$id('rec')"
             @keydown.escape="back()"
             class="hidden min-h-0 w-full min-w-0 flex-1 flex-col md:flex focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
             :class="{ 'hidden': !detail, 'flex': detail }">

      <template x-if="queue.length">
        <div class="flex min-h-0 flex-1 flex-col">

          <div class="shrink-0 border-b border-zinc-200 px-4 py-3 lg:px-5">
            <button type="button" @click="back()"
                    class="-ml-2 mb-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px]/5 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:hidden">
              <i data-lucide="chevron-left" class="size-4"></i>Back to the queue
            </button>
            <h2 :id="$id('rec')" class="flex flex-wrap items-center gap-2.5 text-[16px]/6 font-semibold">
              <span class="tabular-nums" x-text="rec.id"></span>
              <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
                <span class="size-1.5 shrink-0 rounded-full" :class="dot[rec.status]" aria-hidden="true"></span><span x-text="rec.status"></span>
              </span>
            </h2>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="rec.item + ' · ' + rec.qty + ' · line ' + rec.line + ' · made ' + rec.made"></p>
          </div>

          <div class="shrink-0 border-b border-zinc-200 px-4 lg:px-5">
            <div x-ref="tabs" role="tablist" aria-label="Batch sections"
                 @keydown.arrow-right.prevent="tab = tab === 'results' ? 'deviation' : tab === 'deviation' ? 'history' : 'results'; $nextTick(() => $refs.tabs.querySelector('[aria-selected=true]').focus())"
                 @keydown.arrow-left.prevent="tab = tab === 'results' ? 'history' : tab === 'history' ? 'deviation' : 'results'; $nextTick(() => $refs.tabs.querySelector('[aria-selected=true]').focus())"
                 class="-mb-px flex gap-6">
              <template x-for="t in [{ id: 'results', label: 'Lab results' }, { id: 'deviation', label: 'Deviation' }, { id: 'history', label: 'History' }]" :key="t.id">
                <button type="button" role="tab" :id="$id('tab', t.id)" :aria-controls="$id('panel', t.id)"
                        :aria-selected="tab === t.id" :tabindex="tab === t.id ? 0 : -1"
                        @click="tab = t.id"
                        class="shrink-0 rounded-t border-b-2 pb-2.5 pt-3 text-[13px]/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                        :class="tab === t.id ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'"
                        x-text="t.label"></button>
              </template>
            </div>
          </div>

          <div x-ref="body" class="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-5">

            <div role="tabpanel" :id="$id('panel', 'results')" :aria-labelledby="$id('tab', 'results')" x-show="tab === 'results'">
              <div class="overflow-hidden rounded-xl border border-zinc-200">
                <table class="w-full text-[13px]/5">
                  <thead>
                    <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">
                      <th scope="col" class="px-3 py-2 font-medium">Parameter</th>
                      <th scope="col" class="px-3 py-2 text-right font-medium">Specification</th>
                      <th scope="col" class="px-3 py-2 text-right font-medium">Result</th>
                      <th scope="col" class="px-3 py-2 font-medium">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template x-for="r in rec.results" :key="r[0]">
                      <tr class="border-b border-zinc-100 last:border-0">
                        <td class="px-3 py-2" x-text="r[0]"></td>
                        <td class="px-3 py-2 text-right tabular-nums text-zinc-600" x-text="r[1]"></td>
                        <td class="px-3 py-2 text-right font-medium tabular-nums" x-text="r[2]"></td>
                        <td class="px-3 py-2">
                          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
                            <span class="size-1.5 shrink-0 rounded-full" :class="verdict[r[3]]" aria-hidden="true"></span><span x-text="r[3]"></span>
                          </span>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>

            <div role="tabpanel" :id="$id('panel', 'deviation')" :aria-labelledby="$id('tab', 'deviation')" x-show="tab === 'deviation'" x-cloak>
              <div class="rounded-xl border border-zinc-200 p-4">
                <div class="flex items-start gap-2.5">
                  <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
                  <div class="min-w-0">
                    <p class="text-[13px]/5 font-medium">Why this batch is held</p>
                    <p class="mt-0.5 text-[13px]/5 text-zinc-600" x-text="rec.reason"></p>
                  </div>
                </div>
              </div>
              <p class="mt-4 text-[13px]/5 text-zinc-600">A deviation note is required before release. Releasing on concession records the out-of-specification result against the batch and against the customer order it is allocated to.</p>
            </div>

            <div role="tabpanel" :id="$id('panel', 'history')" :aria-labelledby="$id('tab', 'history')" x-show="tab === 'history'" x-cloak>
              <ul role="list" class="space-y-2.5">
                <li class="flex items-start gap-2.5">
                  <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-amber-500"></span></span>
                  <p class="text-[13px]/5 tabular-nums text-zinc-600" x-text="'Held ' + rec.held + ' ago by S. Rane, quality.'"></p>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
                  <p class="text-[13px]/5 tabular-nums text-zinc-600">Retest requested on the failing parameter, sample drawn from three bags.</p>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
                  <p class="text-[13px]/5 tabular-nums text-zinc-600" x-text="'Produced ' + rec.made + ' on line ' + rec.line + ', shift B.'"></p>
                </li>
              </ul>
            </div>
          </div>

          <!-- Ordinary Tab stops and no shortcut key. A regulated release fired
               by a stray R is the reason this layout does not get one. -->
          <div class="flex shrink-0 flex-wrap items-center gap-2 border-t border-zinc-200 px-4 py-3 lg:px-5">
            <button type="button" @click="decide('rejected')"
                    class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="alert-circle" class="size-4 text-red-600"></i>Reject the batch
            </button>
            <button type="button" @click="decide('kept on hold')"
                    class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              Extend the hold
            </button>
            <button type="button" @click="decide('released')"
                    class="ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="check" class="size-4"></i>Release
            </button>
          </div>
        </div>
      </template>

      <template x-if="!queue.length">
        <div class="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
            <i data-lucide="check-circle-2" class="size-5 text-emerald-600"></i>
          </span>
          <h2 :id="$id('rec')" class="mt-3 text-[16px]/6 font-semibold">The hold queue is clear</h2>
          <p class="mt-1 max-w-sm text-[13px]/5 text-zinc-600">Every batch held at Silvassa has been decided this shift. New holds appear here as the lab posts results.</p>
        </div>
      </template>
    </section>
  </div>
</main>` }
    ]
  },

  {
    id: 'form-page', name: 'Form page', category: 'layout',
    description: 'The layout a create or edit screen uses: one h1, the fields grouped in cards, a validation summary that links to every field that failed, and Save and Cancel where the user can always reach them.',
    when: 'One record being created or edited — a purchase order, a vendor, a rate contract, a work order. Under about six fields it belongs in a dialog instead, and a record nobody may change is the read-only variant rather than a form of disabled inputs. The line against questionnaire is what the page collects: a questionnaire is one question shape repeated down a sheet — the same three tiles against eighteen parameters — and it is built to be scanned as a column and countersigned, so it never hides an answer and never steps. A form page is a set of unrelated fields that together are one record, and it is built to be filled once and saved. A screen that lists records is data-table.',
    notes: [
      'The validation summary is the component. On a failed submit it lists every error as a real link to the offending control\'s own id, focus moves to it, and each field carries a bound aria-invalid and an aria-describedby pointing at its own message. A long form that only paints borders red hides half its errors below the fold, and the browser\'s own bubble reports one field at a time and disappears on the next keystroke.',
      'Re-focus the summary on every failed submit, not only the first, and rebuild the count each time. Pressing Save a second time against the same three errors has to do something visible: a summary already on screen that neither moves focus nor changes reads as a button that stopped working, and the user presses it four more times.',
      'The summary entry links to the control, never to the field wrapper. A fragment moves focus only when the target is focusable, so href="#po-vendor-block" scrolls the field into view and leaves the keyboard up in the summary, and the next Tab restarts from there rather than from the field that is wrong.',
      'The dirty guard is armed by input and change and by nothing else. Tabbing through a form to read it is not an edit, and a guard armed by focus fires on Cancel when nothing was typed — after which people learn to press Discard without reading, and it protects nothing. Clear the flag before a successful save navigates, or the form raises the dialog on its own Save.',
      'The submit button is not disabled while the request is in flight. The control that was just pressed is the one that would go dead, and a browser moves focus off a disabled element to the body, so the keyboard user who pressed Save is now at the top of the document. Guard the handler instead, put aria-busy on the action bar and inert on the fields — and keep the button outside the inert region, because inert on an ancestor of the focused control loses focus exactly the way disabled does.',
      'Say the required convention once, at the top, and back it with the required attribute. An asterisk with no key is a symbol nobody was given the meaning of, and twelve of them on thirteen fields is wallpaper — on a form that is mostly required the marking moves to the exceptions and the word Optional goes in their labels. The marker itself is aria-hidden decoration in every case.',
      'One h1, and it is in the page header. Cards below it are h2 and groups inside them h3. A fieldset is for a genuine group — two fields that are one question, a set of radios, one editable line — and never for the whole form: every enclosing legend is announced before every control inside it, so a form wrapped in one legend introduces each of its fields twice and a nested pair three times.',
      'Two columns are for short related fields, and anything long spans both with sm:col-span-2. Every field keeps its reserved message line whether or not it has anything to say, because a grid row is as tall as its tallest cell — one field growing 22px on submit moves its neighbour, every row below it, and the Save button out from under the pointer at the exact moment the user is reading to find out what went wrong. Every field in the grid also takes min-w-0: a grid item will not shrink below its intrinsic minimum, and a <select> is as wide as its longest option, so one vendor name pushes the whole track past the card and the field beside it goes with it.',
      'Save is on the right with Cancel to its left, and nothing destructive joins them. Delete belongs on the record, not in the editor: the two buttons sit 8px apart and one of them cannot be undone.',
      'A read screen is a description list, not a form of disabled inputs. Disabled drops the value to zinc-400, takes it out of the tab order and out of the POST, and promises an edit that is not on offer; readonly leaves a value nobody may change looking pixel for pixel like a field. View and edit are the same page in two modes, with the same sections in the same order, so nothing has to be found twice.',
      'A line grid restacks to one card per line below md and never scrolls sideways. A row of inputs narrower than the screen is unfillable on a phone — the cell being typed into is off screen the moment the keyboard slides up — and each line needs its own group name, because a column header is not a label and eleven controls called Quantity are eleven controls nobody can tell apart.',
      'The snippet root is a bounded scroller — h-[640px], rounded-xl, border-zinc-200 — so a whole screen previews in a box, and the guard dialog is absolute inset-0 against that frame. As a real page it is the app shell\'s <main>: drop the wrapper\'s height and border, keep the max-width and the padding, let the sticky bar stick to the viewport, and make the dialog fixed inset-0.'
    ],
    anatomy: [
      ['Page header', 'The page-header component unchanged: breadcrumb, the one h1, the record\'s status pill, and the actions. Never sticky — on a long form the actions are repeated in the bar at the foot.'],
      ['Required key', 'One 12px line under the header saying which way the marking runs on this form. Said once, and never an asterisk with no key beside it.'],
      ['Validation summary', 'alert\'s form-errors shape: role="alert", tabindex="-1", one link per error pointing at the control\'s id. Focused after every failed submit, and it draws its own focus outline because nothing else says the page moved.'],
      ['Section card', 'A card per group of fields — h2 in the header, the field grid in the body. Cards are the sections and dividers are the subsections; they do not nest.'],
      ['Field', 'The field component and nothing hand-rolled inside it: label, control wrapper, one message paragraph with a stable id, a bound aria-invalid. The controls are input, input-group, select, textarea, checkbox, radio, combobox and attachment as they are written in those entries.'],
      ['Group', 'A fieldset with a legend where two or more controls are one question — a tax registration pair, a freight-terms radio set, one editable line. The grid goes on a div inside it, never on the fieldset.'],
      ['Action bar', 'Cancel then Save, button\'s ghost and primary. Opaque, top-bordered, stuck to the bottom of the scrolling column, and on a long form it is the only copy of Save the user can always reach.'],
      ['Unsaved-changes guard', 'The dirty flag on the component root, the alert-dialog it opens on Cancel or an in-app link, and the beforeunload handler that covers a real navigation away.']
    ],
    behaviour: [
      'Submit validates, and on a failure the summary renders above the fields, focus moves to it, and every entered value is still in place. Nothing is cleared, nothing is reordered, and the count in the summary is rebuilt on every attempt.',
      'A field goes aria-invalid at the same moment its message swaps from help text to the error, and both clear the moment the value is corrected — the paragraph never changes id, so aria-describedby is never rewritten and never dangles.',
      'Save is guarded rather than disabled while the request is in flight. A second press returns from the handler, the fields go inert, the action bar goes aria-busy, and the button keeps focus and its width. The spinner appears at 500ms, so a save that answers first never paints one.',
      'The dirty flag is set by input and change events bubbling out of the controls. While it is set, Cancel and any in-app link route through the unsaved-changes dialog, and beforeunload covers closing the tab; a successful save clears it before it navigates.',
      'Two columns collapse to one below sm in DOM order, and a line grid restacks to one card per line below md. Nothing on the page scrolls sideways at 390px.',
      'The action bar sticks to the bottom of the scrolling column and is opaque with a top border. Transparent, the last field scrolls under it and reads as clipped; absent, the user scrolls back up past nine fields to find Save.',
      'The side rail reads and the form acts. Its totals recompute from the same state the fields are bound to, so the summary and the values can never disagree; the moment the user has to operate something in the rail, that control belongs in the form.',
      'A stepped form validates one step at a time and moves focus to the new step\'s heading. Steps already passed are links back, steps ahead are not, and the review step shows every answer with an edit route to the step that holds it.',
      'Read mode and edit mode are the same page with the same sections in the same order. Switching to edit moves focus to the first field; leaving edit with nothing changed returns without a dialog.'
    ],
    a11y: [
      'One <main>, one <h1> in the page header, cards as h2 and groups inside them h3. The heading outline is the form\'s table of contents, and on a long form it is how anybody skims it without a mouse.',
      'The summary is role="alert" with tabindex="-1" and is focused after every failed submit. It carries a visible focus outline of its own — a programmatic focus that draws nothing tells a sighted keyboard user the page did not move.',
      'Every summary entry is a real <a href> to the control\'s id, so the fragment lands focus inside the control and the next Tab continues from the field that is wrong.',
      'aria-invalid is bound to the same state the red border is drawn from and written as the string "true" or "false" — hardcoded once it survives the correction and the field is announced invalid for the rest of the session.',
      'aria-describedby points at one message paragraph whose id never changes. A permanent unit or format hint is a second id written before it, because the list is read in the order the ids are written and not in DOM order.',
      'A cross-field error goes under the group, is pointed at by aria-describedby on the fieldset, and sets aria-invalid on each input inside it — the implicit role of a fieldset is group, which is not a widget, so the flag is ignored there.',
      'Every control in a line grid is inside a fieldset whose sr-only legend names the line, so the eleventh quantity box is announced as line 11 rather than as another field called Quantity.',
      'Removing a line, leaving a step or closing the guard dialog moves focus deliberately, and focus that follows a reveal needs a frame as well as a tick. A removed or hidden control drops focus to <body> and the next Tab restarts at the top of the document; and at $nextTick the panel x-show is about to unhide is still display:none, so .focus() on it is a silent no-op that measures as correct and leaves the keyboard where it was.',
      'The side rail is an <aside> with an accessible name and the in-page section list is a <nav> with one, so both can be identified and skipped; the required key and the section headings are what a screen reader uses to plan the form, not the asterisks.'
    ],
    related: ['field', 'page-header', 'alert', 'card', 'button'],
    variants: [
      { id: 'two-column', name: 'Two columns and a guarded exit', code:
`<!-- The whole screen: page header, one h1, the required key stated once, two
     cards of fields, and an action bar that sticks to the bottom of the
     scrolling column.

     The dirty flag is armed by input and change and by nothing else. Focus is
     not an edit — arm it on focusin and tabbing through the form to read it
     leaves the guard set, so Cancel raises a dialog about changes nobody made,
     and after the third time people press Discard without reading it.

     send() clears the flag before it navigates, or the form raises the
     unsaved-changes dialog against its own Save.

     beforeunload covers the tab closing and a real navigation away. The browser
     ignores any string you return, so there is nothing to write there — the
     preventDefault is the whole handler, and it only prompts because a person
     actually typed something. -->
<div class="relative h-[640px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900"
     x-data="{
       dirty: false, leaving: false,
       arm(e) { if (e.target.matches('input, select, textarea')) this.dirty = true },
       cancel() { if (this.dirty) { this.leaving = true } else { this.$refs.cancel.focus() } },
       discard() { this.dirty = false; this.leaving = false; this.$nextTick(() => this.$refs.cancel.focus()) },
       send() { this.dirty = false }
     }"
     @beforeunload.window="if (dirty) $event.preventDefault()">

  <main class="mx-auto max-w-4xl p-4 pb-6 lg:p-6">

    <!-- page-header, unchanged -->
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
          <a href="#" class="hover:text-zinc-900">Procurement</a>
          <span class="text-zinc-500">/</span>
          <a href="#" class="hover:text-zinc-900">Purchase orders</a>
          <span class="text-zinc-500">/</span>
          <span class="font-medium text-zinc-900">New</span>
        </nav>
        <h1 class="mt-1.5 text-[24px]/7 font-semibold tracking-tight">New purchase order</h1>
        <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Silvassa plant · FY 2026–27 · raised by Akshay Prabhu</p>
      </div>
      <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-600 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 rounded-full bg-zinc-400" aria-hidden="true"></span>Draft
      </span>
    </div>

    <form class="mt-5" @input="arm($event)" @change="arm($event)" @submit.prevent="send()">

      <!-- said once, and backed by the required attribute on every control -->
      <p class="text-[12px]/4 text-zinc-600">
        Every field is required unless its label says <span class="font-medium text-zinc-900">Optional</span>.
      </p>

      <div class="mt-3 space-y-4">

        <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 class="text-[16px]/6 font-semibold">Order</h2>
          </div>
          <div class="px-5 py-4">
            <div class="grid gap-4 sm:grid-cols-2">

              <div class="min-w-0">
                <label for="tc-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <select id="tc-vendor" name="vendor" required aria-describedby="tc-vendor-msg"
                          class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                    <option value="">Choose a vendor</option>
                    <option value="v-0288">Sharma Steel &amp; Alloys — VEN-0288</option>
                    <option value="v-0142">Gujarat Polymers Ltd — VEN-0142</option>
                    <option value="v-0219">Deccan Fasteners Pvt Ltd — VEN-0219</option>
                  </select>
                </div>
                <p id="tc-vendor-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
                  Only vendors with a live rate contract are listed.
                </p>
              </div>

              <div class="min-w-0">
                <label for="tc-centre" class="mb-1.5 block text-[13px]/5 font-medium">Cost centre</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <select id="tc-centre" name="cost_centre" required
                          class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                    <option value="">Choose a cost centre</option>
                    <option value="cc-1200">Fabrication — Silvassa</option>
                    <option value="cc-1100">Injection moulding — Silvassa</option>
                    <option value="cc-2200">Maintenance — Vapi</option>
                  </select>
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>

              <div class="min-w-0 sm:col-span-2">
                <label for="tc-title" class="mb-1.5 block text-[13px]/5 font-medium">Order title</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <input id="tc-title" name="title" required aria-describedby="tc-title-msg"
                         value="MS angles and plates — August lot"
                         class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                </div>
                <p id="tc-title-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
                  Printed on the order and used as the subject of the vendor email.
                </p>
              </div>

              <div class="min-w-0">
                <label for="tc-value" class="mb-1.5 block text-[13px]/5 font-medium">Estimated value (₹)</label>
                <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <span aria-hidden="true" class="flex items-center pl-3 text-[14px]/5 text-zinc-600">₹</span>
                  <input id="tc-value" name="value" required inputmode="decimal" value="18,42,000"
                         aria-describedby="tc-value-msg"
                         class="min-w-0 flex-1 bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
                  <span aria-hidden="true" class="flex items-center pr-3 text-[14px]/5 text-zinc-500">.00</span>
                </div>
                <p id="tc-value-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">
                  Above ₹5,00,000 this goes to a second approver.
                </p>
              </div>

              <div class="min-w-0">
                <label for="tc-ref" class="mb-1.5 flex items-baseline gap-2 text-[13px]/5 font-medium">
                  Buyer reference
                  <span aria-hidden="true" class="font-normal text-zinc-500">Optional</span>
                </label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <input id="tc-ref" name="buyer_ref" aria-describedby="tc-ref-msg"
                         class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
                </div>
                <p id="tc-ref-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
                  Quoted back on the vendor invoice.
                </p>
              </div>

            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 class="text-[16px]/6 font-semibold">Delivery</h2>
          </div>
          <div class="px-5 py-4">
            <div class="grid gap-4 sm:grid-cols-2">

              <div class="min-w-0">
                <label for="tc-need" class="mb-1.5 block text-[13px]/5 font-medium">Required by</label>
                <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <i data-lucide="calendar" aria-hidden="true" class="ml-3 size-4 shrink-0 self-center text-zinc-500"></i>
                  <input id="tc-need" name="required_by" type="date" required value="2026-09-04"
                         class="min-w-0 flex-1 bg-transparent px-2 py-2 text-[14px]/5 tabular-nums outline-none">
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>

              <div class="min-w-0 sm:col-span-2">
                <div class="mb-1.5 flex items-baseline justify-between gap-3">
                  <label for="tc-ship" class="text-[13px]/5 font-medium">Delivery address</label>
                  <button type="button" class="shrink-0 text-[12px]/4 text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                    Same as plant
                  </button>
                </div>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <textarea id="tc-ship" name="ship_to" rows="3" required aria-describedby="tc-ship-msg"
                            class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none">Konspec Industries, Plot 214, Silvassa Industrial Estate, Dadra and Nagar Haveli 396230</textarea>
                </div>
                <p id="tc-ship-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
                  Printed on the order and on the gate pass.
                </p>
              </div>

              <!-- a genuine group: three answers to one question, and no single
                   control for a <label for> to point at. The grid is on a div
                   inside the fieldset, never on the fieldset itself. -->
              <fieldset class="min-w-0 sm:col-span-2" aria-describedby="tc-freight-msg">
                <legend class="mb-2 text-[13px]/5 font-medium">Freight terms</legend>
                <div class="grid gap-2 sm:grid-cols-3">
                  <label class="flex items-start gap-2.5 text-[14px]/5">
                    <input type="radio" name="freight" value="exw" required class="mt-0.5 size-4 shrink-0 accent-zinc-700">
                    <span>Ex works</span>
                  </label>
                  <label class="flex items-start gap-2.5 text-[14px]/5">
                    <input type="radio" name="freight" value="for" checked required class="mt-0.5 size-4 shrink-0 accent-zinc-700">
                    <span>FOR Silvassa</span>
                  </label>
                  <label class="flex items-start gap-2.5 text-[14px]/5">
                    <input type="radio" name="freight" value="cif" required class="mt-0.5 size-4 shrink-0 accent-zinc-700">
                    <span>Delivered, duty paid</span>
                  </label>
                </div>
                <p id="tc-freight-msg" class="mt-2 min-h-4 text-[12px]/4 text-zinc-500">
                  Described on the fieldset, so it is read once on entry rather than once per arrow key.
                </p>
              </fieldset>

              <div class="sm:col-span-2">
                <label class="flex items-start gap-2.5 text-[14px]/5">
                  <input type="checkbox" name="notify" checked class="mt-0.5 size-4 shrink-0 rounded accent-zinc-700">
                  <span>Email the vendor when this order is approved
                    <span class="mt-0.5 block text-[12px]/4 text-zinc-500">Goes to purchase@sharmasteel.in</span>
                  </span>
                </label>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- opaque, top-bordered, stuck to the bottom of the scrolling column.
           Transparent, the last field scrolls under it and reads as clipped. -->
      <div class="sticky bottom-0 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <p class="text-[12px]/4 tabular-nums text-zinc-600">
          <span x-show="!dirty">Draft saved at 14:02. Nothing changed since.</span>
          <span x-show="dirty" x-cloak class="flex items-center gap-1.5 font-medium text-zinc-900">
            <i data-lucide="pencil" class="size-3.5 shrink-0 text-zinc-600"></i>Unsaved changes
          </span>
        </p>
        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button type="button" x-ref="cancel" @click="cancel()"
                  class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Cancel</button>
          <button type="button"
                  class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Save draft</button>
          <button type="submit"
                  class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Send for approval</button>
        </div>
      </div>
    </form>
  </main>

  <!-- three answers, because forcing a two-way choice makes people pick the
       destructive one to get out. absolute inset-0 against the preview frame;
       fixed inset-0 as a real page. -->
  <div x-show="leaving" x-cloak x-trap.noscroll="leaving" @keydown.escape.window="leaving = false"
       class="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="tc-leave-t" aria-describedby="tc-leave-b"
         class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-lg">
      <h2 id="tc-leave-t" class="text-[16px]/6 font-semibold">Leave without saving?</h2>
      <p id="tc-leave-b" class="mt-1.5 text-[13px]/5 text-zinc-600">
        This draft has changes that have not been saved. Leaving now loses them.
      </p>
      <div class="mt-5 flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="leaving = false"
                class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Keep editing</button>
        <button type="button" @click="discard()"
                class="inline-flex h-9 items-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Discard changes</button>
        <button type="button" @click="send(); leaving = false"
                class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save and leave</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'side-rail', name: 'A summary rail beside the fields', code:
`<!-- The rail reads and the form acts. Its figures are computed from the same
     state the fields are bound to, so the summary and the values cannot
     disagree — a rail fed from its own copy of the numbers is a rail that goes
     stale on the one edit nobody re-checked.

     The moment the user has to operate something in the rail, that control
     belongs in the form. A rail with a button in it is a second form standing
     beside the first, and Tab reaches it after every field on the page.

     The rail is an <aside> with an accessible name so it can be skipped, and it
     comes after the form in the DOM as well as to the right of it, so the tab
     order is the form and then its context.

     lg:sticky lg:self-start is what keeps the total in view down a long form.
     Without self-start the aside stretches to the row height and sticky has
     nothing to travel inside.

     The commitment total is an <output>, not a disabled input: nobody was ever
     going to edit it. aria-live="off" because it recomputes on every keystroke,
     and an <output> is a live region by default. -->
<div class="h-[640px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900"
     x-data="{
       qty: 45000, rate: 118.40, freight: 0.85,
       get goods() { return Number(this.qty) * Number(this.rate) },
       get carriage() { return Number(this.qty) * Number(this.freight) },
       get gst() { return (this.goods + this.carriage) * 0.18 },
       money(n) { return '₹' + (isFinite(n) ? n : 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
     }">

  <main class="mx-auto max-w-6xl p-4 pb-6 lg:p-6">

    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
          <a href="#" class="hover:text-zinc-900">Master data</a>
          <span class="text-zinc-500">/</span>
          <a href="#" class="hover:text-zinc-900">Rate contracts</a>
          <span class="text-zinc-500">/</span>
          <span class="font-medium text-zinc-900">New</span>
        </nav>
        <h1 class="mt-1.5 text-[24px]/7 font-semibold tracking-tight">New rate contract</h1>
        <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Gujarat Polymers Ltd · VEN-0142 · Vapi, Gujarat</p>
      </div>
    </div>

    <p class="mt-4 text-[12px]/4 text-zinc-600">
      Every field is required unless its label says <span class="font-medium text-zinc-900">Optional</span>.
    </p>

    <div class="mt-3 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">

      <form class="min-w-0 space-y-4">
        <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 class="text-[16px]/6 font-semibold">Commitment</h2>
          </div>
          <div class="px-5 py-4">
            <div class="grid gap-4 sm:grid-cols-2">

              <div class="min-w-0 sm:col-span-2">
                <label for="sr-material" class="mb-1.5 block text-[13px]/5 font-medium">Material</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <select id="sr-material" name="material" required aria-describedby="sr-material-msg"
                          class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                    <option value="">Choose a material</option>
                    <option value="m-hdpe" selected>HDPE granules — natural, grade M60075</option>
                    <option value="m-ldpe">LDPE granules — grade 24FS040</option>
                    <option value="m-ppcp">PP copolymer — black, grade 3120MA</option>
                  </select>
                </div>
                <p id="sr-material-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
                  One material per contract. A second grade is a second contract.
                </p>
              </div>

              <div class="min-w-0">
                <label for="sr-qty" class="mb-1.5 block text-[13px]/5 font-medium">Committed quantity (kg)</label>
                <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <input id="sr-qty" name="qty" required inputmode="numeric" x-model.number="qty"
                         aria-describedby="sr-qty-msg"
                         class="min-w-0 flex-1 bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
                  <span aria-hidden="true" class="flex items-center pr-3 text-[14px]/5 text-zinc-600">kg</span>
                </div>
                <p id="sr-qty-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">
                  Whole kilograms. 1 MT is 1,000.
                </p>
              </div>

              <div class="min-w-0">
                <label for="sr-rate" class="mb-1.5 block text-[13px]/5 font-medium">Rate per kg (₹)</label>
                <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <span aria-hidden="true" class="flex items-center pl-3 text-[14px]/5 text-zinc-600">₹</span>
                  <input id="sr-rate" name="rate" required inputmode="decimal" x-model.number="rate"
                         aria-describedby="sr-rate-msg"
                         class="min-w-0 flex-1 bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
                </div>
                <p id="sr-rate-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">
                  Last agreed ₹114.20 on 12 Mar 2026.
                </p>
              </div>

              <div class="min-w-0">
                <label for="sr-freight" class="mb-1.5 block text-[13px]/5 font-medium">Carriage per kg (₹)</label>
                <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <span aria-hidden="true" class="flex items-center pl-3 text-[14px]/5 text-zinc-600">₹</span>
                  <input id="sr-freight" name="freight" required inputmode="decimal" x-model.number="freight"
                         class="min-w-0 flex-1 bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>

              <div class="min-w-0">
                <label for="sr-terms" class="mb-1.5 block text-[13px]/5 font-medium">Payment terms</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <select id="sr-terms" name="terms" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                    <option value="">Choose the terms</option>
                    <option value="grn30" selected>30 days from GRN</option>
                    <option value="inv45">45 days from invoice</option>
                    <option value="del">Against delivery</option>
                  </select>
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>

              <div class="min-w-0">
                <label for="sr-from" class="mb-1.5 block text-[13px]/5 font-medium">Effective from</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <input id="sr-from" name="from" type="date" required value="2026-09-01"
                         class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>

              <div class="min-w-0">
                <label for="sr-to" class="mb-1.5 block text-[13px]/5 font-medium">Effective to</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <input id="sr-to" name="to" type="date" required value="2027-03-31"
                         class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>

              <div class="min-w-0 sm:col-span-2">
                <label for="sr-notes" class="mb-1.5 flex items-baseline gap-2 text-[13px]/5 font-medium">
                  Notes for the buyer
                  <span aria-hidden="true" class="font-normal text-zinc-500">Optional</span>
                </label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <textarea id="sr-notes" name="notes" rows="3" aria-describedby="sr-notes-msg"
                            class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500"
                            placeholder="Escalation contact, packing requirement, test certificate"></textarea>
                </div>
                <p id="sr-notes-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
                  Shown to the buyer on every order raised against this contract.
                </p>
              </div>

            </div>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
            <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Cancel</button>
            <button type="submit" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save contract</button>
          </div>
        </div>
      </form>

      <aside aria-labelledby="sr-rail-h" class="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">

        <div class="rounded-xl border border-zinc-200 bg-white px-4 py-4">
          <h2 id="sr-rail-h" class="text-[13px]/5 font-semibold">What this contract commits</h2>
          <dl class="mt-3 space-y-2.5 text-[13px]/5">
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-zinc-600">Goods</dt>
              <dd><output aria-live="off" class="font-medium tabular-nums" x-text="money(goods)">₹53,28,000.00</output></dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-zinc-600">Carriage</dt>
              <dd><output aria-live="off" class="font-medium tabular-nums" x-text="money(carriage)">₹38,250.00</output></dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-zinc-600">GST at 18%</dt>
              <dd><output aria-live="off" class="font-medium tabular-nums" x-text="money(gst)">₹9,65,925.00</output></dd>
            </div>
            <div class="flex items-baseline justify-between gap-3 border-t border-zinc-100 pt-2.5">
              <dt class="font-medium">Total commitment</dt>
              <dd><output aria-live="off" class="text-[16px]/6 font-semibold tabular-nums" x-text="money(goods + carriage + gst)">₹63,32,175.00</output></dd>
            </div>
          </dl>
          <p class="mt-3 text-[12px]/4 tabular-nums text-zinc-500">
            Recomputed from the fields as they are typed. Nothing here is posted — the server multiplies the same numbers again.
          </p>
        </div>

        <div class="rounded-xl border border-zinc-200 bg-white px-4 py-4">
          <h3 class="text-[13px]/5 font-semibold">Gujarat Polymers Ltd</h3>
          <dl class="mt-3 space-y-2.5 text-[13px]/5">
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-zinc-600">Average rate paid</dt><dd class="font-medium tabular-nums">₹121.75</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-zinc-600">Bought last 90 days</dt><dd class="font-medium tabular-nums">38,200 kg</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-zinc-600">On-time delivery</dt><dd class="font-medium tabular-nums">91%</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-zinc-600">Open commitment</dt><dd class="font-medium tabular-nums">₹27,10,400</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-xl border border-zinc-200 bg-white px-4 py-4">
          <h3 class="text-[13px]/5 font-semibold">Approval route</h3>
          <ol class="mt-3 space-y-3 text-[13px]/5">
            <li class="flex items-start gap-2.5">
              <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">1</span>
              <span>Ritu Deshpande <span class="block text-[12px]/4 text-zinc-500">Purchase — any value</span></span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">2</span>
              <span>Anil Kulkarni <span class="block text-[12px]/4 tabular-nums text-zinc-500">Plant head — above ₹25,00,000</span></span>
            </li>
          </ol>
        </div>

        <!-- alert's shape: neutral body, colour only in the icon -->
        <div class="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
          <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
          <p class="text-[13px]/5 text-zinc-700">
            The current contract for HDPE granules runs to 31 Aug 2026. Saving this one supersedes it from 01 Sep.
          </p>
        </div>
      </aside>
    </div>
  </main>
</div>` },

      { id: 'sections', name: 'A long form with an in-page nav', code:
`<!-- Five sections and a rail that says where you are in them. The rail is a
     <nav> with a name, not a tablist: every section stays on the page, Ctrl+F
     finds all of it, and it prints in one pass. A form that hides four of five
     sections behind tabs is a form nobody can proofread before signing.

     Each link is a real <a href="#sec-…"> and each target is a <section> with
     tabindex="-1". A fragment moves focus only when the target is focusable, so
     without the tabindex the page scrolls and the keyboard stays in the rail —
     the next Tab then walks back down the nav instead of into the fields.

     scroll-mt-4 keeps the heading off the top edge of the scroller when the
     fragment lands.

     The spy reads position out of the DOM on scroll rather than tracking it
     separately, so a click, a wheel and a Tab into an off-screen field all
     agree. It is scoped to $el, not to document, because two copies of a
     snippet on one page would otherwise fight over the same section ids.

     Below lg the rail is gone. There is one column on a phone and the fields
     own it; the section headings and the scroll are the navigation, and a rail
     folded into a sideways strip above the form is the one thing this system
     does not allow. -->
<div class="h-[640px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900"
     x-data="{
       active: 'sec-identity',
       spy() {
         const line = this.$el.getBoundingClientRect().top + 96;
         let cur = '';
         this.$el.querySelectorAll('section[id]').forEach(s => { if (s.getBoundingClientRect().top <= line) cur = s.id });
         this.active = cur || 'sec-identity';
       }
     }"
     @scroll="spy()">

  <main class="mx-auto max-w-5xl p-4 pb-6 lg:p-6">

    <div class="min-w-0">
      <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
        <a href="#" class="hover:text-zinc-900">Master data</a>
        <span class="text-zinc-500">/</span>
        <a href="#" class="hover:text-zinc-900">Vendors</a>
        <span class="text-zinc-500">/</span>
        <span class="font-medium text-zinc-900">New</span>
      </nav>
      <h1 class="mt-1.5 text-[24px]/7 font-semibold tracking-tight">Onboard a vendor</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">Five sections. Nothing is sent to the vendor until the whole form is saved.</p>
    </div>

    <p class="mt-4 text-[12px]/4 text-zinc-600">
      Every field is required unless its label says <span class="font-medium text-zinc-900">Optional</span>.
    </p>

    <div class="mt-3 lg:grid lg:items-start lg:gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">

      <nav aria-label="Sections of this form" class="hidden lg:sticky lg:top-6 lg:block lg:self-start">
        <ul class="space-y-0.5 border-l border-zinc-200 text-[13px]/5">
          <li><a href="#sec-identity" :aria-current="active === 'sec-identity'"
                 class="-ml-px block border-l-2 py-1.5 pl-3"
                 :class="active === 'sec-identity' ? 'border-zinc-700 font-medium text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">Identity</a></li>
          <li><a href="#sec-tax" :aria-current="active === 'sec-tax'"
                 class="-ml-px block border-l-2 py-1.5 pl-3"
                 :class="active === 'sec-tax' ? 'border-zinc-700 font-medium text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">Tax registration</a></li>
          <li><a href="#sec-bank" :aria-current="active === 'sec-bank'"
                 class="-ml-px block border-l-2 py-1.5 pl-3"
                 :class="active === 'sec-bank' ? 'border-zinc-700 font-medium text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">Banking</a></li>
          <li><a href="#sec-contact" :aria-current="active === 'sec-contact'"
                 class="-ml-px block border-l-2 py-1.5 pl-3"
                 :class="active === 'sec-contact' ? 'border-zinc-700 font-medium text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">Contacts</a></li>
          <li><a href="#sec-docs" :aria-current="active === 'sec-docs'"
                 class="-ml-px block border-l-2 py-1.5 pl-3"
                 :class="active === 'sec-docs' ? 'border-zinc-700 font-medium text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">Documents</a></li>
        </ul>
      </nav>

      <form class="min-w-0 space-y-4">

        <section id="sec-identity" tabindex="-1" aria-labelledby="sec-identity-h"
                 class="scroll-mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 id="sec-identity-h" class="text-[16px]/6 font-semibold">Identity</h2>
          </div>
          <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <div class="min-w-0 sm:col-span-2">
              <label for="sc-name" class="mb-1.5 block text-[13px]/5 font-medium">Registered name</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="sc-name" name="name" required value="Baroda Fasteners Pvt Ltd" aria-describedby="sc-name-msg"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              </div>
              <p id="sc-name-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">Exactly as it appears on the GST certificate.</p>
            </div>
            <div class="min-w-0">
              <label for="sc-type" class="mb-1.5 block text-[13px]/5 font-medium">Constitution</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <select id="sc-type" name="constitution" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                  <option value="">Choose one</option>
                  <option value="pvt" selected>Private limited</option>
                  <option value="llp">LLP</option>
                  <option value="prop">Proprietorship</option>
                </select>
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
            <div class="min-w-0">
              <label for="sc-cat" class="mb-1.5 block text-[13px]/5 font-medium">Supply category</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <select id="sc-cat" name="category" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                  <option value="">Choose one</option>
                  <option value="raw">Raw material</option>
                  <option value="hw" selected>Hardware and fasteners</option>
                  <option value="svc">Services</option>
                </select>
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
          </div>
        </section>

        <section id="sec-tax" tabindex="-1" aria-labelledby="sec-tax-h"
                 class="scroll-mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 id="sec-tax-h" class="text-[16px]/6 font-semibold">Tax registration</h2>
          </div>
          <div class="px-5 py-4">
            <!-- two fields that are one question: characters 3 to 12 of the
                 GSTIN are the PAN, so a mismatch belongs to the pair and not to
                 whichever of the two was touched last. -->
            <fieldset aria-describedby="sc-tax-msg">
              <legend class="mb-2 text-[13px]/5 font-medium">GST and PAN</legend>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="min-w-0">
                  <label for="sc-pan" class="mb-1.5 block text-[12px]/4 text-zinc-600">PAN</label>
                  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                    <input id="sc-pan" name="pan" required value="AABCB4417K"
                           class="w-full bg-transparent px-3 py-2 text-[14px]/5 uppercase tabular-nums outline-none">
                  </div>
                </div>
                <div class="min-w-0">
                  <label for="sc-gstin" class="mb-1.5 block text-[12px]/4 text-zinc-600">GSTIN</label>
                  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                    <input id="sc-gstin" name="gstin" required maxlength="15" value="24AABCB4417K1ZQ"
                           class="w-full bg-transparent px-3 py-2 text-[14px]/5 uppercase tabular-nums outline-none">
                  </div>
                </div>
              </div>
              <p id="sc-tax-msg" class="mt-2 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">
                15 characters. Characters 3 to 12 have to be the PAN above.
              </p>
            </fieldset>
            <div class="mt-4">
              <label class="flex items-start gap-2.5 text-[14px]/5">
                <input type="checkbox" name="msme" checked class="mt-0.5 size-4 shrink-0 rounded accent-zinc-700">
                <span>Registered under MSME
                  <span class="mt-0.5 block text-[12px]/4 text-zinc-500">Payment terms are capped at 45 days by statute.</span>
                </span>
              </label>
            </div>
          </div>
        </section>

        <section id="sec-bank" tabindex="-1" aria-labelledby="sec-bank-h"
                 class="scroll-mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 id="sec-bank-h" class="text-[16px]/6 font-semibold">Banking</h2>
          </div>
          <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <div class="min-w-0">
              <label for="sc-acct" class="mb-1.5 block text-[13px]/5 font-medium">Account number</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="sc-acct" name="account" required inputmode="numeric" value="50200041188207"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
            <div class="min-w-0">
              <label for="sc-ifsc" class="mb-1.5 block text-[13px]/5 font-medium">IFSC</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="sc-ifsc" name="ifsc" required maxlength="11" value="HDFC0001842" aria-describedby="sc-ifsc-msg"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 uppercase tabular-nums outline-none">
              </div>
              <p id="sc-ifsc-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">HDFC Bank, Alkapuri, Vadodara.</p>
            </div>
          </div>
        </section>

        <section id="sec-contact" tabindex="-1" aria-labelledby="sec-contact-h"
                 class="scroll-mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 id="sec-contact-h" class="text-[16px]/6 font-semibold">Contacts</h2>
          </div>
          <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <div class="min-w-0">
              <label for="sc-person" class="mb-1.5 block text-[13px]/5 font-medium">Sales contact</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="sc-person" name="contact" required value="Mehul Trivedi"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
            <div class="min-w-0">
              <label for="sc-phone" class="mb-1.5 block text-[13px]/5 font-medium">Phone</label>
              <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <span id="sc-phone-cc" class="flex shrink-0 items-center rounded-l-[7px] border-r border-zinc-200 bg-zinc-100 px-3 text-[14px]/5 tabular-nums text-zinc-600">+91</span>
                <input id="sc-phone" name="phone" required inputmode="tel" value="98250 41187" aria-describedby="sc-phone-cc"
                       class="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
            <div class="min-w-0 sm:col-span-2">
              <label for="sc-email" class="mb-1.5 block text-[13px]/5 font-medium">Email for purchase orders</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="sc-email" name="email" type="email" required value="sales@barodafasteners.in" aria-describedby="sc-email-msg"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              </div>
              <p id="sc-email-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">Every approved order is sent here automatically.</p>
            </div>
          </div>
        </section>

        <section id="sec-docs" tabindex="-1" aria-labelledby="sec-docs-h"
                 class="scroll-mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 id="sec-docs-h" class="text-[16px]/6 font-semibold">Documents</h2>
          </div>
          <div class="px-5 py-4" x-data="{ depth: 0 }">
            <label class="mb-1.5 block text-[13px]/5 font-medium">GST certificate and cancelled cheque</label>
            <div @dragenter.prevent="depth++" @dragleave.prevent="depth--" @dragover.prevent @drop.prevent="depth = 0"
                 class="rounded-lg border border-dashed px-4 py-5 transition"
                 :class="depth > 0 ? 'border-zinc-700 bg-white' : 'border-zinc-200 bg-zinc-100'">
              <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
                <i data-lucide="upload" class="size-5 shrink-0 text-zinc-600"></i>
                <span class="text-[13px]/5 text-zinc-600">Drag files here or</span>
                <input type="file" id="sc-files" name="documents" multiple class="peer sr-only">
                <label for="sc-files"
                       class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 peer-focus-visible:border-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
                  Browse files
                </label>
                <span class="text-[12px]/4 text-zinc-500">PDF or JPG · up to 10 MB each</span>
              </div>
            </div>
            <ul class="mt-2 space-y-2">
              <li class="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[13px]/5 font-medium">gst-certificate-24aabcb4417k1zq.pdf</p>
                  <p class="text-[12px]/4 tabular-nums text-zinc-500">312 KB · queued · not yet uploaded</p>
                </div>
                <button type="button" aria-label="Remove gst-certificate-24aabcb4417k1zq.pdf"
                        class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-red-600">
                  <i data-lucide="x" class="size-4"></i>
                </button>
              </li>
            </ul>
          </div>
        </section>

        <div class="sticky bottom-0 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3">
          <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Cancel</button>
          <button type="submit" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Create vendor</button>
        </div>
      </form>
    </div>
  </main>
</div>` },

      { id: 'invalid', name: 'After a failed submit', code:
`<!-- The variant the rest of the entry is built around. Press Save and four
     things happen at once: the summary renders above the fields, focus moves
     into it, every failing control goes aria-invalid, and every failing
     message paragraph swaps its help text for the error. Correct a field and
     all four unwind together, because they are four readings of one getter.

     Every entry is a real <a href> to the control's own id. A fragment moves
     focus only when the target is focusable, so linking to the field wrapper
     scrolls the field into view and leaves the keyboard in the summary — the
     user then Tabs from the summary rather than from the field that is wrong.

     The summary is re-focused on every failed submit, not only the first. Press
     Save again with the same four errors and something has to happen; a panel
     already on screen that neither moves nor changes reads as a button that
     stopped working, and the next thing anybody does is press it four more
     times.

     It carries its own focus outline. tabindex="-1" plus .focus() with nothing
     drawn is a page that moved for a screen reader and did not move for anybody
     watching it.

     role="alert" is here for the case where it appears; the focus move is the
     half that can be relied on. A live region that is already in the document
     with its text in it announces nothing.

     The form is novalidate. The browser's own bubble reports one control at a
     time, points at whatever it decides is first, and is gone on the next
     keystroke — across six fields on a scrolling page that is not a summary,
     it is a guessing game. Validate in one place and report in one place.

     Errors are recomputed live once submitted, and not before. Telling somebody
     their half-typed GSTIN is fourteen characters while they are on the ninth
     is noise. -->
<div class="h-[640px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900"
     x-data="{
       submitted: false, saved: false, ordered: '2026-08-16',
       // focus after a reveal needs a frame as well as a tick: at
       // $nextTick the panel x-show is about to unhide is still
       // display:none, and .focus() on an unrendered element is a
       // silent no-op that leaves the keyboard where it was.
       focusAfterReveal(get) { this.$nextTick(() => requestAnimationFrame(() => { const el = get(); if (el) el.focus() })) },
       f: { vendor: '', promised: '2026-08-02', qty: '2,000.5', pan: 'AAACG4171B', gstin: '24AAACG9902B1ZP' },
       get errors() {
         const e = [];
         if (!this.f.vendor) e.push({ id: 'iv-vendor', label: 'Vendor', msg: 'choose the vendor this amendment is raised against.' });
         if (this.f.promised && this.f.promised < this.ordered)
           e.push({ id: 'iv-promised', label: 'Promised delivery', msg: 'cannot be before the order date, 16 Aug 2026.' });
         const n = Number(String(this.f.qty).replace(/,/g, ''));
         if (!Number.isInteger(n) || n <= 0)
           e.push({ id: 'iv-qty', label: 'Order quantity', msg: 'enter a whole number of kilograms greater than zero.' });
         if (this.f.gstin.slice(2, 12).toUpperCase() !== this.f.pan.toUpperCase())
           e.push({ id: 'iv-gstin', label: 'GSTIN and PAN', msg: 'characters 3 to 12 of the GSTIN have to be the PAN.' });
         return e;
       },
       get shown() { return this.submitted ? this.errors : [] },
       bad(id) { return this.shown.some(x => x.id === id) },
       msg(id) { const x = this.shown.find(y => y.id === id); return x ? x.msg : '' },
       save() {
         this.submitted = true;
         if (this.errors.length) { this.saved = false; this.focusAfterReveal(() => this.$refs.summary); return }
         this.saved = true;
       }
     }">

  <main class="mx-auto max-w-4xl p-4 pb-6 lg:p-6">

    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
          <a href="#" class="hover:text-zinc-900">Procurement</a>
          <span class="text-zinc-500">/</span>
          <a href="#" class="hover:text-zinc-900">Purchase orders</a>
          <span class="text-zinc-500">/</span>
          <span class="font-medium tabular-nums text-zinc-900">PO-24-1187</span>
        </nav>
        <h1 class="mt-1.5 text-[24px]/7 font-semibold tracking-tight">Amend PO-24-1187</h1>
        <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Raised 16 Aug 2026 · Fabrication — Silvassa · ₹18,42,000</p>
      </div>
      <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
      </span>
    </div>

    <form novalidate class="mt-5" @submit.prevent="save()">

      <div x-show="submitted && errors.length" x-cloak role="alert" tabindex="-1" x-ref="summary"
           class="mb-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">
        <div class="flex items-start gap-3">
          <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
          <div class="min-w-0">
            <p class="text-[13px]/5 font-medium tabular-nums"
               x-text="'This amendment was not saved — ' + errors.length + (errors.length === 1 ? ' field needs' : ' fields need') + ' attention.'">
              This amendment was not saved — 4 fields need attention.
            </p>
            <ul class="mt-2 space-y-1 text-[12px]/4 text-zinc-600">
              <template x-for="e in errors" :key="e.id">
                <li>
                  <!-- the href is the control's id, never the wrapper's -->
                  <a :href="'#' + e.id" class="font-medium text-zinc-900 underline underline-offset-2" x-text="e.label"></a>
                  <span x-text="' — ' + e.msg"></span>
                </li>
              </template>
            </ul>
            <p class="mt-2 text-[12px]/4 text-zinc-500">Everything you typed is still here. Nothing was cleared.</p>
          </div>
        </div>
      </div>

      <div x-show="saved" x-cloak role="alert"
           class="mb-4 flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <i data-lucide="check-circle-2" class="mt-0.5 size-4 shrink-0 text-emerald-600"></i>
        <p class="text-[13px]/5 font-medium tabular-nums">Amendment saved against PO-24-1187.</p>
      </div>

      <p class="text-[12px]/4 text-zinc-600">
        Every field is required unless its label says <span class="font-medium text-zinc-900">Optional</span>.
      </p>

      <div class="mt-3 space-y-4">
        <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 class="text-[16px]/6 font-semibold">Order</h2>
          </div>
          <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">

            <div class="min-w-0">
              <label for="iv-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</label>
              <div class="rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
                   :class="bad('iv-vendor') ? 'border-red-600 focus-within:outline-red-600/15'
                                            : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
                <select id="iv-vendor" name="vendor" x-model="f.vendor"
                        aria-describedby="iv-vendor-msg" :aria-invalid="bad('iv-vendor') ? 'true' : 'false'"
                        class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                  <option value="">Choose a vendor</option>
                  <option value="v-0288">Sharma Steel &amp; Alloys — VEN-0288</option>
                  <option value="v-0142">Gujarat Polymers Ltd — VEN-0142</option>
                  <option value="v-0219">Deccan Fasteners Pvt Ltd — VEN-0219</option>
                </select>
              </div>
              <p id="iv-vendor-msg" class="mt-1.5 min-h-4 text-[12px]/4">
                <span x-show="!bad('iv-vendor')" class="block text-zinc-500">Changing the vendor voids the approval and re-runs it.</span>
                <span x-show="bad('iv-vendor')" x-cloak class="flex items-start gap-1.5 font-medium text-red-600">
                  <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
                  <span x-text="msg('iv-vendor')"></span>
                </span>
              </p>
            </div>

            <div class="min-w-0">
              <label for="iv-promised" class="mb-1.5 block text-[13px]/5 font-medium">Promised delivery</label>
              <div class="flex items-stretch rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
                   :class="bad('iv-promised') ? 'border-red-600 focus-within:outline-red-600/15'
                                              : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
                <i data-lucide="calendar" aria-hidden="true" class="ml-3 size-4 shrink-0 self-center text-zinc-500"></i>
                <input id="iv-promised" name="promised" type="date" x-model="f.promised"
                       aria-describedby="iv-promised-msg" :aria-invalid="bad('iv-promised') ? 'true' : 'false'"
                       class="min-w-0 flex-1 bg-transparent px-2 py-2 text-[14px]/5 tabular-nums outline-none">
              </div>
              <p id="iv-promised-msg" class="mt-1.5 min-h-4 text-[12px]/4">
                <span x-show="!bad('iv-promised')" class="block tabular-nums text-zinc-500">Moving this date re-runs the ageing on the register.</span>
                <span x-show="bad('iv-promised')" x-cloak class="flex items-start gap-1.5 font-medium text-red-600">
                  <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
                  <span class="tabular-nums" x-text="msg('iv-promised')"></span>
                </span>
              </p>
            </div>

            <div class="min-w-0">
              <label for="iv-qty" class="mb-1.5 block text-[13px]/5 font-medium">Order quantity</label>
              <div class="flex items-stretch rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
                   :class="bad('iv-qty') ? 'border-red-600 focus-within:outline-red-600/15'
                                         : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
                <input id="iv-qty" name="qty" inputmode="numeric" x-model="f.qty"
                       aria-describedby="iv-qty-unit iv-qty-msg" :aria-invalid="bad('iv-qty') ? 'true' : 'false'"
                       class="min-w-0 flex-1 bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
                <!-- two ids, and they are read in the order they are written:
                     "kilograms, enter a whole number", never the other way. -->
                <span id="iv-qty-unit" class="flex items-center pr-3 text-[14px]/5 text-zinc-600">kg</span>
              </div>
              <p id="iv-qty-msg" class="mt-1.5 min-h-4 text-[12px]/4">
                <span x-show="!bad('iv-qty')" class="block tabular-nums text-zinc-500">Ordered 2,000 kg. 1,240 kg already received.</span>
                <span x-show="bad('iv-qty')" x-cloak class="flex items-start gap-1.5 font-medium text-red-600">
                  <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
                  <span class="tabular-nums" x-text="msg('iv-qty')"></span>
                </span>
              </p>
            </div>

            <div class="min-w-0">
              <label for="iv-lot" class="mb-1.5 flex items-baseline gap-2 text-[13px]/5 font-medium">
                Heat or lot number
                <span aria-hidden="true" class="font-normal text-zinc-500">Optional</span>
              </label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="iv-lot" name="lot" value="HT-4471-B"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>

          </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 class="text-[16px]/6 font-semibold">Vendor tax details</h2>
          </div>
          <div class="px-5 py-4">
            <!-- a cross-field error: it belongs to the pair, so it is described
                 from the fieldset and the invalid flag goes on both inputs.
                 aria-invalid on a fieldset does nothing — role group is not a
                 widget. -->
            <fieldset aria-describedby="iv-gstin-msg">
              <legend class="mb-2 text-[13px]/5 font-medium">GST and PAN</legend>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="min-w-0">
                  <label for="iv-pan" class="mb-1.5 block text-[12px]/4 text-zinc-600">PAN</label>
                  <div class="rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
                       :class="bad('iv-gstin') ? 'border-red-600 focus-within:outline-red-600/15'
                                               : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
                    <input id="iv-pan" name="pan" x-model="f.pan" maxlength="10"
                           :aria-invalid="bad('iv-gstin') ? 'true' : 'false'"
                           class="w-full bg-transparent px-3 py-2 text-[14px]/5 uppercase tabular-nums outline-none">
                  </div>
                </div>
                <div class="min-w-0">
                  <label for="iv-gstin" class="mb-1.5 block text-[12px]/4 text-zinc-600">GSTIN</label>
                  <div class="rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
                       :class="bad('iv-gstin') ? 'border-red-600 focus-within:outline-red-600/15'
                                               : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
                    <input id="iv-gstin" name="gstin" x-model="f.gstin" maxlength="15"
                           :aria-invalid="bad('iv-gstin') ? 'true' : 'false'"
                           class="w-full bg-transparent px-3 py-2 text-[14px]/5 uppercase tabular-nums outline-none">
                  </div>
                </div>
              </div>
              <p id="iv-gstin-msg" class="mt-2 min-h-4 text-[12px]/4">
                <span x-show="!bad('iv-gstin')" class="block tabular-nums text-zinc-500">15 characters, as printed on the vendor's certificate.</span>
                <span x-show="bad('iv-gstin')" x-cloak class="flex items-start gap-1.5 font-medium text-red-600">
                  <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
                  <span class="tabular-nums" x-text="msg('iv-gstin')"></span>
                </span>
              </p>
            </fieldset>
          </div>
        </div>
      </div>

      <div class="sticky bottom-0 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <p class="text-[12px]/4 tabular-nums text-zinc-600" x-show="submitted && errors.length" x-cloak
           x-text="errors.length + ' of 6 fields still need attention.'"></p>
        <div class="ml-auto flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button type="button" class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Cancel</button>
          <button type="submit" class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save amendment</button>
        </div>
      </div>
    </form>
  </main>
</div>` },

      { id: 'sticky-actions', name: 'An action bar that never scrolls away', code:
`<!-- The bar is a sibling of the scroller, not a child of it, so it is out of
     the scroll entirely rather than sticking near the end of it. The frame is a
     flex column: <main> takes min-h-0 flex-1 overflow-y-auto, the bar takes
     shrink-0, and the fields scroll under a bar that has never moved.

     That puts the submit button outside the <form>, which is what the form
     attribute is for: form="wo-form" on the button submits the form with that
     id from anywhere on the page. Without it the bar is three buttons that
     submit nothing and Enter in a field is the only thing that works.

     Do not disable the button while the request is in flight. The control
     somebody just pressed is the one that would go dead, and a browser moves
     focus off a disabled element to <body> — so the keyboard user who pressed
     Save is now at the top of the document. Guard the handler instead: a press
     while busy returns, which stops the double post without taking the control
     away from the person holding it.

     inert goes on the fields and stops at the bar. A scrim blocks a mouse and
     nothing else — Tab still walks into controls that are about to be replaced.
     Put inert on an ancestor of the focused button instead and it loses focus
     exactly the way disabled does, which is the bug it was meant to fix. Alpine
     treats inert as boolean, so a false value removes the attribute rather than
     writing inert="false", which is a truthy string.

     The ring appears at 500ms, because the delay lives in the bound class over
     a delay-0 base. Left in the base class it would delay the fade out too, and
     the ring would still be turning after the save had landed. Most saves
     answer first and it never paints.

     The button label does not change and the button does not move. A label that
     swaps to "Saving…" is a different width, and the row reflows under the
     cursor on the click that caused it.

     Below sm the three buttons go full width and stack, in DOM order. Two 36px
     buttons side by side at 390px is a thumb-sized problem. -->
<div class="flex h-[640px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900"
     x-data="{
       busy: false, t: null,
       save() {
         if (this.busy) return;
         this.busy = true;
         clearTimeout(this.t);
         this.t = setTimeout(() => this.busy = false, 1800);
       }
     }">

  <main class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto max-w-4xl p-4 pb-6 lg:p-6">

      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="min-w-0">
          <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
            <a href="#" class="hover:text-zinc-900">Production</a>
            <span class="text-zinc-500">/</span>
            <a href="#" class="hover:text-zinc-900">Work orders</a>
            <span class="text-zinc-500">/</span>
            <span class="font-medium tabular-nums text-zinc-900">WO-26-0318</span>
          </nav>
          <h1 class="mt-1.5 text-[24px]/7 font-semibold tracking-tight">Edit work order WO-26-0318</h1>
          <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Injection moulding — Silvassa · planned 12 Sep 2026</p>
        </div>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
        </span>
      </div>

      <p class="mt-4 text-[12px]/4 text-zinc-600">
        Every field is required unless its label says <span class="font-medium text-zinc-900">Optional</span>.
      </p>

      <form id="wo-form" class="mt-3" @submit.prevent="save()">
        <!-- inert on the fields, and it stops here. The bar below is outside
             this element, so the button keeps focus through the whole save. -->
        <div class="space-y-4" :inert="busy">

          <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div class="border-b border-zinc-200 px-5 py-3.5">
              <h2 class="text-[16px]/6 font-semibold">Plan</h2>
            </div>
            <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">
              <div class="min-w-0 sm:col-span-2">
                <label for="sa-item" class="mb-1.5 block text-[13px]/5 font-medium">Item</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <select id="sa-item" name="item" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                    <option value="">Choose an item</option>
                    <option value="fg-2210" selected>FG-2210 — crate 600 × 400, HDPE natural</option>
                    <option value="fg-2214">FG-2214 — crate 600 × 400, HDPE blue</option>
                    <option value="fg-3180">FG-3180 — pallet 1200 × 1000</option>
                  </select>
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>
              <div class="min-w-0">
                <label for="sa-qty" class="mb-1.5 block text-[13px]/5 font-medium">Planned quantity</label>
                <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <input id="sa-qty" name="planned" required inputmode="numeric" value="4,800" aria-describedby="sa-qty-unit sa-qty-msg"
                         class="min-w-0 flex-1 bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
                  <span id="sa-qty-unit" class="flex items-center pr-3 text-[14px]/5 text-zinc-600">nos</span>
                </div>
                <p id="sa-qty-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">1,320 built so far on this order.</p>
              </div>
              <div class="min-w-0">
                <label for="sa-machine" class="mb-1.5 block text-[13px]/5 font-medium">Machine</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <select id="sa-machine" name="machine" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                    <option value="">Choose a machine</option>
                    <option value="im-04" selected>IM-04 — 650T Ferromatik</option>
                    <option value="im-07">IM-07 — 450T Milacron</option>
                  </select>
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>
              <div class="min-w-0">
                <label for="sa-start" class="mb-1.5 block text-[13px]/5 font-medium">Planned start</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <input id="sa-start" name="start" type="date" required value="2026-09-12"
                         class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>
              <div class="min-w-0">
                <label for="sa-end" class="mb-1.5 block text-[13px]/5 font-medium">Planned finish</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <input id="sa-end" name="end" type="date" required value="2026-09-16"
                         class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div class="border-b border-zinc-200 px-5 py-3.5">
              <h2 class="text-[16px]/6 font-semibold">Shift and supervision</h2>
            </div>
            <div class="px-5 py-4">
              <fieldset aria-describedby="sa-shift-msg">
                <legend class="mb-2 text-[13px]/5 font-medium">Shift</legend>
                <div class="grid gap-2 sm:grid-cols-3">
                  <label class="flex items-start gap-2.5 text-[14px]/5">
                    <input type="radio" name="shift" value="a" checked required class="mt-0.5 size-4 shrink-0 accent-zinc-700">
                    <span class="tabular-nums">A — 06:00 to 14:00</span>
                  </label>
                  <label class="flex items-start gap-2.5 text-[14px]/5">
                    <input type="radio" name="shift" value="b" required class="mt-0.5 size-4 shrink-0 accent-zinc-700">
                    <span class="tabular-nums">B — 14:00 to 22:00</span>
                  </label>
                  <label class="flex items-start gap-2.5 text-[14px]/5 text-zinc-500">
                    <input type="radio" name="shift" value="c" disabled class="mt-0.5 size-4 shrink-0 accent-zinc-700">
                    <span class="tabular-nums">C — 22:00 to 06:00</span>
                  </label>
                </div>
                <p id="sa-shift-msg" class="mt-2 min-h-4 text-[12px]/4 text-zinc-500">
                  C shift is not manned on this line. The option keeps its place rather than disappearing.
                </p>
              </fieldset>

              <div class="mt-4">
                <label for="sa-super" class="mb-1.5 block text-[13px]/5 font-medium">Supervisor</label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15 sm:max-w-sm">
                  <select id="sa-super" name="supervisor" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                    <option value="">Choose a supervisor</option>
                    <option value="ak" selected>Anil Kulkarni</option>
                    <option value="fq">Farida Qureshi</option>
                  </select>
                </div>
                <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
              </div>

              <div class="mt-4">
                <label for="sa-note" class="mb-1.5 flex items-baseline gap-2 text-[13px]/5 font-medium">
                  Instructions for the shift
                  <span aria-hidden="true" class="font-normal text-zinc-500">Optional</span>
                </label>
                <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                  <textarea id="sa-note" name="note" rows="3" aria-describedby="sa-note-msg"
                            class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none">Purge with natural before the run. First-off sample to the lab before 200 shots.</textarea>
                </div>
                <p id="sa-note-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">Printed on the job card at the machine.</p>
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white" x-data="{ depth: 0 }">
            <div class="border-b border-zinc-200 px-5 py-3.5">
              <h2 class="text-[16px]/6 font-semibold">Attachments</h2>
            </div>
            <div class="px-5 py-4">
              <div @dragenter.prevent="depth++" @dragleave.prevent="depth--" @dragover.prevent @drop.prevent="depth = 0"
                   class="rounded-lg border border-dashed px-4 py-5 transition"
                   :class="depth > 0 ? 'border-zinc-700 bg-white' : 'border-zinc-200 bg-zinc-100'">
                <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
                  <i data-lucide="upload" class="size-5 shrink-0 text-zinc-600"></i>
                  <span class="text-[13px]/5 text-zinc-600">Drag files here or</span>
                  <input type="file" id="sa-files" name="attachments" multiple class="peer sr-only">
                  <label for="sa-files"
                         class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 peer-focus-visible:border-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
                    Browse files
                  </label>
                  <span class="text-[12px]/4 text-zinc-500">PDF or JPG · up to 10 MB each</span>
                </div>
              </div>
              <ul class="mt-2 space-y-2">
                <li class="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[13px]/5 font-medium">mould-setting-sheet-fg2210-rev4.pdf</p>
                    <p class="text-[12px]/4 tabular-nums text-zinc-500">186 KB · Anil Kulkarni · 02 Sep 2026</p>
                  </div>
                  <a href="#" aria-label="Download mould-setting-sheet-fg2210-rev4.pdf"
                     class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                    <i data-lucide="download" class="size-4"></i>
                  </a>
                  <button type="button" aria-label="Remove mould-setting-sheet-fg2210-rev4.pdf"
                          class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-red-600">
                    <i data-lucide="x" class="size-4"></i>
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </form>
    </div>
  </main>

  <div :aria-busy="busy" class="shrink-0 border-t border-zinc-200 bg-white px-4 py-3 lg:px-6">
    <div class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700 opacity-0 transition-opacity delay-0"
              :class="busy && 'opacity-100 delay-500'" aria-hidden="true"></span>
        <p role="status" class="text-[12px]/4 tabular-nums text-zinc-600"
           x-text="busy ? 'Saving WO-26-0318…' : 'Last saved 11:42 by Anil Kulkarni'">Last saved 11:42 by Anil Kulkarni</p>
      </div>
      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <button type="button" class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Cancel</button>
        <button type="button" class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Save and add another</button>
        <!-- outside the form, so it names the form it submits -->
        <button type="submit" form="wo-form"
                class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save changes</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'line-items', name: 'An editable line grid', code:
`<!-- One set of markup that is a five-column grid above md and one card per
     line below it. Two copies — a <table> for the desktop and a list for the
     phone — is the obvious build and it is wrong here: every control would need
     two ids, and duplicate ids break every <label for> and every focus call on
     the page. One line, one id, restacked by grid-cols.

     Each line is a <fieldset> with an sr-only legend naming it, which is what
     turns eleven controls called Quantity into "line 4, Quantity". Labelling
     each cell "Quantity, line 4" instead means the visible label below md reads
     the line number twice. No padding on the fieldset — a rendered legend is
     laid out in the block-start border area, so padding-top applies below it —
     and the grid goes on a div inside.

     The column headings above md are aria-hidden. They are a visual ruler for
     a grid that is not a table; left readable they are a stray row of words
     announced before the first field.

     Removing a line destroys the button that was pressed, and a browser drops
     focus from a removed element to <body>, so the next Tab restarts at the top
     of the document. The handler moves focus to the next line's remove button,
     or to Add line when the last one goes. Adding a line focuses the new line's
     first field, because a row that appears with focus still on the button is a
     row nobody typed into.

     The names are a Django formset — lines-0-material, lines-1-qty — and the
     management form is what makes them arrive as a formset rather than as
     unrelated keys. TOTAL_FORMS is bound, because it is the count after the
     user finished adding and deleting.

     The totals are <output>, not disabled inputs: nobody was ever going to edit
     them. aria-live="off" because they recompute on every keystroke. -->
<div class="h-[640px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900"
     x-data="{
       seq: 3,
       lines: [
         { id: 1, mat: 'ms-ang', qty: 4200, rate: 62.40 },
         { id: 2, mat: 'ms-plt', qty: 1800, rate: 58.90 },
         { id: 3, mat: 'hw-bolt', qty: 600, rate: 18.50 }
       ],
       cat: { 'ms-ang': 'MS angle 50 × 50 × 6 mm', 'ms-plt': 'MS plate 10 mm, IS 2062 E250', 'hw-bolt': 'HT bolt M16 × 60, grade 8.8', '': 'Not chosen' },
       value(l) { return Number(l.qty || 0) * Number(l.rate || 0) },
       get goods() { return this.lines.reduce((s, l) => s + this.value(l), 0) },
       get gst() { return this.goods * 0.18 },
       money(n) { return '₹' + (isFinite(n) ? n : 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
       add() {
         const l = { id: ++this.seq, mat: '', qty: 0, rate: 0 };
         this.lines.push(l);
         this.$nextTick(() => { const el = document.getElementById('li-mat-' + l.id); if (el) el.focus() });
       },
       remove(i) {
         const near = this.lines[i + 1] || this.lines[i - 1];
         this.lines.splice(i, 1);
         this.$nextTick(() => {
           const el = near ? document.getElementById('li-del-' + near.id) : this.$refs.add;
           if (el) el.focus();
         });
       }
     }">

  <main class="mx-auto max-w-5xl p-4 pb-6 lg:p-6">

    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
          <a href="#" class="hover:text-zinc-900">Procurement</a>
          <span class="text-zinc-500">/</span>
          <a href="#" class="hover:text-zinc-900">Purchase orders</a>
          <span class="text-zinc-500">/</span>
          <span class="font-medium text-zinc-900">New</span>
        </nav>
        <h1 class="mt-1.5 text-[24px]/7 font-semibold tracking-tight">New purchase order</h1>
        <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Sharma Steel &amp; Alloys · VEN-0288 · Fabrication — Silvassa</p>
      </div>
    </div>

    <p class="mt-4 text-[12px]/4 text-zinc-600">
      Every field is required unless its label says <span class="font-medium text-zinc-900">Optional</span>.
    </p>

    <form class="mt-3 space-y-4">

      <input type="hidden" name="lines-TOTAL_FORMS" :value="lines.length">
      <input type="hidden" name="lines-INITIAL_FORMS" value="3">
      <input type="hidden" name="lines-MIN_NUM_FORMS" value="1">
      <input type="hidden" name="lines-MAX_NUM_FORMS" value="50">

      <div class="rounded-xl border border-zinc-200 bg-white">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3.5">
          <h2 class="text-[16px]/6 font-semibold">Order lines</h2>
          <p class="text-[12px]/4 tabular-nums text-zinc-600" x-text="lines.length + (lines.length === 1 ? ' line' : ' lines')">3 lines</p>
        </div>

        <div aria-hidden="true"
             class="hidden gap-2 border-b border-zinc-200 px-4 py-2 text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600 md:grid md:grid-cols-[minmax(0,1fr)_7rem_7rem_7.5rem_2.25rem]">
          <span>Material</span>
          <span class="text-right">Quantity</span>
          <span class="text-right">Rate</span>
          <span class="text-right">Line value</span>
          <span></span>
        </div>

        <div>
          <template x-for="(l, i) in lines" :key="l.id">
            <fieldset class="border-b border-zinc-100 last:border-0">
              <legend class="sr-only" x-text="'Line ' + (i + 1)"></legend>

              <div class="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_7rem_7rem_7.5rem_2.25rem] md:items-start md:gap-2 md:py-2">

                <div>
                  <label :for="'li-mat-' + l.id" class="mb-1 block text-[12px]/4 text-zinc-600 md:sr-only">Material</label>
                  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                    <select :id="'li-mat-' + l.id" :name="'lines-' + i + '-material'" x-model="l.mat" required
                            class="w-full bg-transparent px-3 py-1.5 text-[14px]/5 outline-none md:text-[13px]/5">
                      <option value="">Choose a material</option>
                      <option value="ms-ang">MS angle 50 × 50 × 6 mm</option>
                      <option value="ms-plt">MS plate 10 mm, IS 2062 E250</option>
                      <option value="hw-bolt">HT bolt M16 × 60, grade 8.8</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label :for="'li-qty-' + l.id" class="mb-1 block text-[12px]/4 text-zinc-600 md:sr-only">Quantity (kg)</label>
                  <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                    <input :id="'li-qty-' + l.id" :name="'lines-' + i + '-qty'" x-model.number="l.qty" required inputmode="numeric"
                           class="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-right text-[14px]/5 tabular-nums outline-none md:text-[13px]/5">
                    <span aria-hidden="true" class="flex items-center pr-2 text-[12px]/4 text-zinc-500">kg</span>
                  </div>
                </div>

                <div>
                  <label :for="'li-rate-' + l.id" class="mb-1 block text-[12px]/4 text-zinc-600 md:sr-only">Rate per kg (₹)</label>
                  <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                    <span aria-hidden="true" class="flex items-center pl-2 text-[12px]/4 text-zinc-500">₹</span>
                    <input :id="'li-rate-' + l.id" :name="'lines-' + i + '-rate'" x-model.number="l.rate" required inputmode="decimal"
                           class="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-right text-[14px]/5 tabular-nums outline-none md:text-[13px]/5">
                  </div>
                </div>

                <div class="flex items-baseline justify-between gap-3 md:block md:pt-2 md:text-right">
                  <label :for="'li-val-' + l.id" class="text-[12px]/4 text-zinc-600 md:sr-only">Line value</label>
                  <output :id="'li-val-' + l.id" aria-live="off"
                          class="text-[14px]/5 font-medium tabular-nums md:text-[13px]/5"
                          x-text="money(value(l))"></output>
                </div>

                <div class="md:pt-0.5">
                  <button type="button" :id="'li-del-' + l.id" @click="remove(i)"
                          :aria-label="'Remove line ' + (i + 1) + ' — ' + cat[l.mat]"
                          class="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white text-[13px]/5 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-red-600 md:size-9 md:w-auto md:border-transparent">
                    <i data-lucide="trash-2" class="size-4"></i>
                    <span class="md:hidden">Remove this line</span>
                  </button>
                </div>

              </div>
            </fieldset>
          </template>
        </div>

        <!-- empty-state's shape: what to do, not "No lines" -->
        <div x-show="!lines.length" x-cloak class="px-4 py-10 text-center">
          <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
            <i data-lucide="package" class="size-5 text-zinc-600"></i>
          </span>
          <p class="mt-3 text-[14px]/5 font-semibold">No lines on this order yet</p>
          <p class="mx-auto mt-1 max-w-[46ch] text-[12px]/4 text-zinc-600">
            An order needs at least one line before it can be sent for approval. Add the material, the quantity and the agreed rate.
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-3">
          <button type="button" x-ref="add" @click="add()"
                  class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100">
            <i data-lucide="plus" class="size-4"></i>Add line
          </button>
          <dl class="w-full space-y-1.5 text-[13px]/5 sm:w-64">
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-zinc-600">Goods</dt>
              <dd><output aria-live="off" class="font-medium tabular-nums" x-text="money(goods)"></output></dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-zinc-600">GST at 18%</dt>
              <dd><output aria-live="off" class="font-medium tabular-nums" x-text="money(gst)"></output></dd>
            </div>
            <div class="flex items-baseline justify-between gap-3 border-t border-zinc-100 pt-1.5">
              <dt class="font-medium">Order value</dt>
              <dd><output aria-live="off" class="text-[16px]/6 font-semibold tabular-nums" x-text="money(goods + gst)"></output></dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div class="border-b border-zinc-200 px-5 py-3.5">
          <h2 class="text-[16px]/6 font-semibold">Delivery</h2>
        </div>
        <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">
          <div class="min-w-0">
            <label for="li-need" class="mb-1.5 block text-[13px]/5 font-medium">Required by</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="li-need" name="required_by" type="date" required value="2026-09-04"
                     class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
            </div>
            <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
          </div>
          <div class="min-w-0">
            <label for="li-terms" class="mb-1.5 block text-[13px]/5 font-medium">Payment terms</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <select id="li-terms" name="terms" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                <option value="">Choose the terms</option>
                <option value="grn30" selected>30 days from GRN</option>
                <option value="inv45">45 days from invoice</option>
              </select>
            </div>
            <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
          </div>
        </div>
      </div>

      <div class="sticky bottom-0 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Cancel</button>
        <button type="button" class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Save draft</button>
        <button type="submit" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Send for approval</button>
      </div>
    </form>
  </main>
</div>` },

      { id: 'wizard', name: 'Stepped, with a review at the end', code:
`<!-- Steps are for a process that is genuinely sequential — where step 3 cannot
     be answered until step 2 is, or where the set of questions in step 3
     depends on the answer in step 2. A long form that is merely long is the
     sectioned variant instead: hiding four fifths of a vendor record behind
     Next costs the person who knows the form by heart three page transitions
     to do what scrolling does for free, and it stops anyone noticing that two
     answers contradict each other.

     The step list is an <ol> and not a tablist. These are stages of one task,
     not views of one record, so they take aria-current="step"; passed steps are
     buttons back and steps ahead are plain text, because a wizard that lets you
     jump to step 4 first is a form with a confusing layout.

     The form is novalidate and each step validates itself. A required control
     inside a display:none panel makes the whole form unsubmittable — the
     browser refuses with "An invalid form control is not focusable" in the
     console and nothing at all on screen, because it cannot scroll to a control
     it is not painting. Hidden steps keep their values and still post; that is
     the point, and it is also why the guard has to be script.

     Every step change moves focus to the new step's heading, which is
     tabindex="-1" for that reason. Without it focus stays on Next, which has
     just changed what it means, and a screen reader is told nothing happened.

     The review step is the whole justification for the pattern: it shows every
     answer at once with a route back to the step that owns each one, so the
     thing a wizard hides is visible before anybody commits it.

     Below sm the labelled steps do not fit, so they collapse to a rail and a
     line of text. They never scroll sideways. -->
<div class="h-[640px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900"
     x-data="{
       step: 1, last: 4,
       // focus after a reveal needs a frame as well as a tick: at
       // $nextTick the panel x-show is about to unhide is still
       // display:none, and .focus() on an unrendered element is a
       // silent no-op that leaves the keyboard where it was.
       focusAfterReveal(get) { this.$nextTick(() => requestAnimationFrame(() => { const el = get(); if (el) el.focus() })) },
       names: ['Identity', 'Tax and banking', 'Contacts', 'Review'],
       f: { name: 'Coimbatore Castings Ltd', kind: 'pvt', gstin: '33AAJCC8811N1ZD', ifsc: 'ICIC0000481',
            person: 'S. Raghunathan', email: 'accounts@coimbatorecastings.in' },
       bad: [],
       check(n) {
         const b = [];
         if (n === 1 && !this.f.name.trim()) b.push('Registered name');
         if (n === 2 && this.f.gstin.trim().length !== 15) b.push('GSTIN');
         if (n === 3 && !this.f.email.includes('@')) b.push('Email');
         this.bad = b;
         return !b.length;
       },
       go(n) {
         if (n < 1 || n > this.last) return;
         if (n > this.step && !this.check(this.step)) return;
         this.bad = [];
         this.step = n;
         this.focusAfterReveal(() => this.$refs['h' + n]);
       }
     }">

  <main class="mx-auto max-w-3xl p-4 pb-6 lg:p-6">

    <div class="min-w-0">
      <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
        <a href="#" class="hover:text-zinc-900">Master data</a>
        <span class="text-zinc-500">/</span>
        <a href="#" class="hover:text-zinc-900">Vendors</a>
        <span class="text-zinc-500">/</span>
        <span class="font-medium text-zinc-900">New</span>
      </nav>
      <h1 class="mt-1.5 text-[24px]/7 font-semibold tracking-tight">Onboard a vendor</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">Nothing is created until the review step is confirmed.</p>
    </div>

    <!-- above sm: the whole route. Below sm: a rail and one line of text. -->
    <nav aria-label="Onboarding steps" class="mt-5">
      <ol class="hidden items-center gap-2 sm:flex">
        <template x-for="(n, i) in names" :key="n">
          <li class="flex min-w-0 flex-1 items-center gap-2">
            <button type="button" @click="go(i + 1)" :disabled="i + 1 > step"
                    :aria-current="step === i + 1 ? 'step' : false"
                    class="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left enabled:hover:bg-zinc-200 disabled:text-zinc-500 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px]/4 font-semibold tabular-nums ring-1 ring-inset"
                    :class="step > i + 1 ? 'bg-zinc-700 text-white ring-zinc-700'
                                         : (step === i + 1 ? 'bg-zinc-200 text-zinc-900 ring-zinc-300' : 'bg-white text-zinc-500 ring-zinc-200')"
                    x-text="i + 1"></span>
              <span class="min-w-0 truncate text-[13px]/5" :class="step === i + 1 ? 'font-semibold text-zinc-900' : ''" x-text="n"></span>
            </button>
            <span x-show="i < names.length - 1" class="h-px w-4 shrink-0 bg-zinc-200" aria-hidden="true"></span>
          </li>
        </template>
      </ol>

      <div class="sm:hidden">
        <p class="text-[13px]/5 font-medium tabular-nums" x-text="'Step ' + step + ' of ' + last + ' · ' + names[step - 1]"></p>
        <div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-200">
          <div class="h-full rounded-full bg-zinc-700 transition-all" :style="'width: ' + (step / last * 100) + '%'"></div>
        </div>
      </div>
    </nav>

    <form novalidate class="mt-4" @submit.prevent="go(step + 1)">

      <div x-show="bad.length" x-cloak role="alert"
           class="mb-4 flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
        <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
        <p class="text-[13px]/5 font-medium" x-text="'This step is not finished — check ' + bad.join(' and ') + '.'"></p>
      </div>

      <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">

        <div x-show="step === 1">
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 x-ref="h1" tabindex="-1" class="text-[16px]/6 font-semibold focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">Identity</h2>
          </div>
          <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <div class="min-w-0 sm:col-span-2">
              <label for="wz-name" class="mb-1.5 block text-[13px]/5 font-medium">Registered name</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="wz-name" name="name" x-model="f.name" aria-describedby="wz-name-msg"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              </div>
              <p id="wz-name-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">Exactly as it appears on the GST certificate.</p>
            </div>
            <div class="min-w-0">
              <label for="wz-kind" class="mb-1.5 block text-[13px]/5 font-medium">Constitution</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <select id="wz-kind" name="constitution" x-model="f.kind" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                  <option value="pvt">Private limited</option>
                  <option value="llp">LLP</option>
                  <option value="prop">Proprietorship</option>
                </select>
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
          </div>
        </div>

        <div x-show="step === 2" x-cloak>
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 x-ref="h2" tabindex="-1" class="text-[16px]/6 font-semibold focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">Tax and banking</h2>
          </div>
          <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <div class="min-w-0">
              <label for="wz-gstin" class="mb-1.5 block text-[13px]/5 font-medium">GSTIN</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="wz-gstin" name="gstin" x-model="f.gstin" maxlength="15" aria-describedby="wz-gstin-msg"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 uppercase tabular-nums outline-none">
              </div>
              <p id="wz-gstin-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">15 characters, as printed on the certificate.</p>
            </div>
            <div class="min-w-0">
              <label for="wz-ifsc" class="mb-1.5 block text-[13px]/5 font-medium">IFSC</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="wz-ifsc" name="ifsc" x-model="f.ifsc" maxlength="11"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 uppercase tabular-nums outline-none">
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
          </div>
        </div>

        <div x-show="step === 3" x-cloak>
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 x-ref="h3" tabindex="-1" class="text-[16px]/6 font-semibold focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">Contacts</h2>
          </div>
          <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <div class="min-w-0">
              <label for="wz-person" class="mb-1.5 block text-[13px]/5 font-medium">Sales contact</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="wz-person" name="contact" x-model="f.person"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
            <div class="min-w-0">
              <label for="wz-email" class="mb-1.5 block text-[13px]/5 font-medium">Email for purchase orders</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="wz-email" name="email" type="email" x-model="f.email" aria-describedby="wz-email-msg"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              </div>
              <p id="wz-email-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">Every approved order is sent here automatically.</p>
            </div>
          </div>
        </div>

        <div x-show="step === 4" x-cloak>
          <div class="border-b border-zinc-200 px-5 py-3.5">
            <h2 x-ref="h4" tabindex="-1" class="text-[16px]/6 font-semibold focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">Review</h2>
            <p class="mt-0.5 text-[12px]/4 text-zinc-600">Everything you entered, in one place, before anything is created.</p>
          </div>
          <div class="divide-y divide-zinc-100">
            <div class="flex items-start justify-between gap-4 px-5 py-3">
              <dl class="min-w-0 grid flex-1 gap-2 text-[13px]/5 sm:grid-cols-2">
                <div><dt class="text-zinc-600">Registered name</dt><dd class="font-medium" x-text="f.name"></dd></div>
                <div><dt class="text-zinc-600">Constitution</dt><dd class="font-medium" x-text="({ pvt: 'Private limited', llp: 'LLP', prop: 'Proprietorship' })[f.kind]"></dd></div>
              </dl>
              <button type="button" @click="go(1)" class="shrink-0 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Edit identity</button>
            </div>
            <div class="flex items-start justify-between gap-4 px-5 py-3">
              <dl class="min-w-0 grid flex-1 gap-2 text-[13px]/5 sm:grid-cols-2">
                <div><dt class="text-zinc-600">GSTIN</dt><dd class="font-medium tabular-nums" x-text="f.gstin"></dd></div>
                <div><dt class="text-zinc-600">IFSC</dt><dd class="font-medium tabular-nums" x-text="f.ifsc"></dd></div>
              </dl>
              <button type="button" @click="go(2)" class="shrink-0 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Edit tax and banking</button>
            </div>
            <div class="flex items-start justify-between gap-4 px-5 py-3">
              <dl class="min-w-0 grid flex-1 gap-2 text-[13px]/5 sm:grid-cols-2">
                <div><dt class="text-zinc-600">Sales contact</dt><dd class="font-medium" x-text="f.person"></dd></div>
                <div><dt class="text-zinc-600">Email</dt><dd class="font-medium" x-text="f.email"></dd></div>
              </dl>
              <button type="button" @click="go(3)" class="shrink-0 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Edit contacts</button>
            </div>
          </div>
          <div class="border-t border-zinc-200 px-5 py-4">
            <label class="flex items-start gap-2.5 text-[14px]/5">
              <input type="checkbox" name="confirm" class="mt-0.5 size-4 shrink-0 rounded accent-zinc-700">
              <span>I have checked the GST certificate and the cancelled cheque against these details
                <span class="mt-0.5 block text-[12px]/4 text-zinc-500">Recorded against your name on the vendor record.</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button type="button" @click="go(step - 1)" x-show="step > 1" x-cloak
                class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">
          <i data-lucide="chevron-left" class="size-4"></i>Back
        </button>
        <div class="ml-auto flex items-center gap-2">
          <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Save and finish later</button>
          <button type="submit" x-show="step < last"
                  class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
            Next<i data-lucide="chevron-right" class="size-4"></i>
          </button>
          <button type="button" x-show="step === last" x-cloak
                  class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
            <i data-lucide="check" class="size-4"></i>Create vendor
          </button>
        </div>
      </div>
    </form>
  </main>
</div>` },

      { id: 'readonly', name: 'The same record in read mode', code:
`<!-- The other half of every edit screen, and the one that gets built as a form
     full of disabled inputs. It should not be a form at all.

     disabled drains the value to zinc-400, takes the control out of the tab
     order and out of the POST, and promises an edit that is not on offer.
     readonly is worse in a different direction: it leaves a value nobody may
     change looking pixel for pixel like a field, and it still submits.
     A record you are reading is a <dl> — a term and a value, selectable,
     copyable, findable, and at full contrast because the value is the point.

     View and edit are the same page with the same sections in the same order,
     so nothing has to be found twice and the eye does not re-learn the record
     between modes. Only the field block changes shape.

     Switching to edit moves focus to the first field; without it the keyboard
     is still on the Edit button, which has just been replaced. Leaving edit
     with nothing changed returns straight to view and puts focus back on Edit —
     a dialog about changes nobody made is one people learn to dismiss, and then
     it does not protect the case it exists for.

     The status pill is the locked mapping: one graphite shape, and a 6px dot
     carrying the state. A column of tinted pills reads as a traffic light and
     stops meaning anything by the twelfth row.

     Attachments in read mode keep Download and lose Remove. A control that
     cannot act is a control that should not be drawn. -->
<div class="relative h-[640px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-900"
     x-data="{
       mode: 'view', dirty: false, leaving: false,
       // focus after a reveal needs a frame as well as a tick: at
       // $nextTick the panel x-show is about to unhide is still
       // display:none, and .focus() on an unrendered element is a
       // silent no-op that leaves the keyboard where it was.
       focusAfterReveal(get) { this.$nextTick(() => requestAnimationFrame(() => { const el = get(); if (el) el.focus() })) },
       arm(e) { if (e.target.matches('input, select, textarea')) this.dirty = true },
       edit() { this.mode = 'edit'; this.focusAfterReveal(() => this.$refs.first) },
       view() { this.mode = 'view'; this.dirty = false; this.leaving = false; this.focusAfterReveal(() => this.$refs.edit) },
       cancel() { if (this.dirty) { this.leaving = true } else { this.view() } }
     }">

  <main class="mx-auto max-w-4xl p-4 pb-6 lg:p-6">

    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0">
        <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
          <a href="#" class="hover:text-zinc-900">Procurement</a>
          <span class="text-zinc-500">/</span>
          <a href="#" class="hover:text-zinc-900">Purchase orders</a>
          <span class="text-zinc-500">/</span>
          <span class="font-medium tabular-nums text-zinc-900">PO-24-1194</span>
        </nav>
        <h1 class="mt-1.5 flex flex-wrap items-center gap-2.5 text-[24px]/7 font-semibold tracking-tight">
          Gujarat Polymers Ltd
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
          </span>
        </h1>
        <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">PO-24-1194 · raised 02 Aug 2026 by Ritu Deshpande · ₹27,10,400</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100">
          <i data-lucide="printer" class="size-4"></i>Print
        </button>
        <button type="button" x-ref="edit" @click="edit()" x-show="mode === 'view'"
                class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-3.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
          <i data-lucide="pencil" class="size-4"></i>Amend order
        </button>
      </div>
    </div>

    <div class="mt-5 space-y-4">

      <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3.5">
          <h2 class="text-[16px]/6 font-semibold">Order</h2>
          <p x-show="mode === 'edit'" x-cloak class="text-[12px]/4 text-zinc-600">
            Every field is required unless its label says <span class="font-medium text-zinc-900">Optional</span>.
          </p>
        </div>

        <!-- read mode: a description list. No inputs, no disabled boxes. -->
        <dl x-show="mode === 'view'" class="grid gap-4 px-5 py-4 text-[13px]/5 sm:grid-cols-2">
          <div>
            <dt class="text-zinc-600">Vendor</dt>
            <dd class="mt-0.5 text-[14px]/5 font-medium">Gujarat Polymers Ltd <span class="font-normal tabular-nums text-zinc-600">· VEN-0142</span></dd>
          </div>
          <div>
            <dt class="text-zinc-600">Cost centre</dt>
            <dd class="mt-0.5 text-[14px]/5 font-medium">Compounding — Silvassa</dd>
          </div>
          <div>
            <dt class="text-zinc-600">Order title</dt>
            <dd class="mt-0.5 text-[14px]/5 font-medium">HDPE granules — Q2 call-off</dd>
          </div>
          <div>
            <dt class="text-zinc-600">Order value</dt>
            <dd class="mt-0.5 text-[14px]/5 font-medium tabular-nums">₹27,10,400.00</dd>
          </div>
          <div>
            <dt class="text-zinc-600">Promised delivery</dt>
            <dd class="mt-0.5 flex items-center gap-1.5 text-[14px]/5 font-medium tabular-nums">
              02 Aug 2026
              <i data-lucide="alert-circle" class="size-3.5 shrink-0 text-red-600"></i>
              <span class="text-[12px]/4 font-normal text-zinc-600">19 days overdue</span>
            </dd>
          </div>
          <div>
            <dt class="text-zinc-600">Payment terms</dt>
            <dd class="mt-0.5 text-[14px]/5 font-medium tabular-nums">30 days from GRN</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-zinc-600">Delivery address</dt>
            <dd class="mt-0.5 text-[14px]/5">Konspec Industries, Plot 214, Silvassa Industrial Estate, Dadra and Nagar Haveli 396230</dd>
          </div>
        </dl>

        <!-- edit mode: the same six values, the same order, now as fields -->
        <form x-show="mode === 'edit'" x-cloak @input="arm($event)" @change="arm($event)" @submit.prevent="view()">
          <div class="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <div class="min-w-0">
              <label for="ro-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <select id="ro-vendor" x-ref="first" name="vendor" required aria-describedby="ro-vendor-msg"
                        class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                  <option value="v-0142" selected>Gujarat Polymers Ltd — VEN-0142</option>
                  <option value="v-0288">Sharma Steel &amp; Alloys — VEN-0288</option>
                </select>
              </div>
              <p id="ro-vendor-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">Changing the vendor voids the approval.</p>
            </div>
            <div class="min-w-0">
              <label for="ro-centre" class="mb-1.5 block text-[13px]/5 font-medium">Cost centre</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <select id="ro-centre" name="cost_centre" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                  <option value="cc-1300" selected>Compounding — Silvassa</option>
                  <option value="cc-1200">Fabrication — Silvassa</option>
                </select>
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
            <div class="min-w-0">
              <label for="ro-title" class="mb-1.5 block text-[13px]/5 font-medium">Order title</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="ro-title" name="title" required value="HDPE granules — Q2 call-off"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>

            <!-- the one value that is genuinely locked: allotted by the plant
                 and carried by the order for life. readonly, not disabled, so
                 it stays in the tab order, stays selectable, and still posts. -->
            <div class="min-w-0">
              <label for="ro-number" class="mb-1.5 block text-[13px]/5 font-medium">Order number</label>
              <div class="rounded-lg border border-zinc-200 bg-zinc-100">
                <input id="ro-number" name="number" readonly value="PO-24-1194" aria-describedby="ro-number-msg"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
              </div>
              <p id="ro-number-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">Allotted 02 Aug 2026. It stays with the order.</p>
            </div>

            <div class="min-w-0">
              <label for="ro-promised" class="mb-1.5 block text-[13px]/5 font-medium">Promised delivery</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <input id="ro-promised" name="promised" type="date" required value="2026-08-02" aria-describedby="ro-promised-msg"
                       class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
              </div>
              <p id="ro-promised-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">Moving this date re-runs the ageing on the register.</p>
            </div>
            <div class="min-w-0">
              <label for="ro-terms" class="mb-1.5 block text-[13px]/5 font-medium">Payment terms</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <select id="ro-terms" name="terms" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                  <option value="grn30" selected>30 days from GRN</option>
                  <option value="inv45">45 days from invoice</option>
                </select>
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
            <div class="min-w-0 sm:col-span-2">
              <label for="ro-ship" class="mb-1.5 block text-[13px]/5 font-medium">Delivery address</label>
              <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <textarea id="ro-ship" name="ship_to" rows="3" required
                          class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none">Konspec Industries, Plot 214, Silvassa Industrial Estate, Dadra and Nagar Haveli 396230</textarea>
              </div>
              <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
            <button type="button" @click="cancel()"
                    class="inline-flex h-9 items-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Cancel</button>
            <button type="submit"
                    class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save amendment</button>
          </div>
        </form>
      </div>

      <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div class="border-b border-zinc-200 px-5 py-3.5">
          <h2 class="text-[16px]/6 font-semibold">Attachments</h2>
        </div>
        <ul class="divide-y divide-zinc-100">
          <li class="flex items-center gap-3 px-5 py-3">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[13px]/5 font-medium">quotation-gujarat-polymers-jul.pdf</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">248 KB · Ritu Deshpande · 28 Jul 2026</p>
            </div>
            <a href="#" aria-label="Download quotation-gujarat-polymers-jul.pdf"
               class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
              <i data-lucide="download" class="size-4"></i>
            </a>
          </li>
          <li class="flex items-center gap-3 px-5 py-3">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="sheet" class="size-4 text-zinc-600"></i></span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[13px]/5 font-medium">rate-comparison-q2.xlsx</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">54 KB · Anil Kulkarni · 26 Jul 2026</p>
            </div>
            <a href="#" aria-label="Download rate-comparison-q2.xlsx"
               class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
              <i data-lucide="download" class="size-4"></i>
            </a>
          </li>
        </ul>
      </div>

      <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div class="border-b border-zinc-200 px-5 py-3.5">
          <h2 class="text-[16px]/6 font-semibold">History</h2>
        </div>
        <ol class="divide-y divide-zinc-100 text-[13px]/5">
          <li class="flex items-start gap-3 px-5 py-3">
            <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-600" aria-hidden="true"></span>
            <p class="min-w-0 flex-1">Delivery date passed with 0 of 22,000 kg received<span class="block text-[12px]/4 tabular-nums text-zinc-500">03 Aug 2026 · system</span></p>
          </li>
          <li class="flex items-start gap-3 px-5 py-3">
            <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true"></span>
            <p class="min-w-0 flex-1">Approved and emailed to sales@gujaratpolymers.in<span class="block text-[12px]/4 tabular-nums text-zinc-500">02 Aug 2026 at 16:20 · Anil Kulkarni</span></p>
          </li>
          <li class="flex items-start gap-3 px-5 py-3">
            <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-zinc-400" aria-hidden="true"></span>
            <p class="min-w-0 flex-1">Raised as a draft<span class="block text-[12px]/4 tabular-nums text-zinc-500">02 Aug 2026 at 11:04 · Ritu Deshpande</span></p>
          </li>
        </ol>
      </div>
    </div>
  </main>

  <div x-show="leaving" x-cloak x-trap.noscroll="leaving" @keydown.escape.window="leaving = false"
       class="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="ro-leave-t" aria-describedby="ro-leave-b"
         class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-lg">
      <h2 id="ro-leave-t" class="text-[16px]/6 font-semibold">Discard this amendment?</h2>
      <p id="ro-leave-b" class="mt-1.5 text-[13px]/5 tabular-nums text-zinc-600">
        PO-24-1194 has changes that have not been saved. Going back to the record loses them.
      </p>
      <div class="mt-5 flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="leaving = false"
                class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Keep editing</button>
        <button type="button" @click="view()"
                class="inline-flex h-9 items-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Discard changes</button>
      </div>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'auth-page', name: 'Auth page', category: 'layout',
    description: 'The signed-out screen: one centred card, the fewest fields that will do, and nothing else on the page. Sign in, the second factor after it, and every screen the user lands on when one of the two fails.',
    when: 'Sign in, the one-time code, forgot password, set a new password, an SSO handoff and a locked account. This and error-page are the only two screens in the system that do not use app-shell — anything the user reaches after signing in renders inside the shell instead. For a session that expired while the user was working, use dialog over the page they were on rather than throwing them back here and losing it.',
    notes: [
      'One message for both halves of a failed sign-in, and no attempt counter beside it. "That email address and password do not match an active account" covers a wrong password and an address with no account behind it; "Password incorrect" tells whoever is guessing that the address is live, and "2 attempts left" says the same thing more slowly, because only an account that exists has a counter to run down. If a lockout has to be mentioned at all, it is scoped to what is in front of you — "too many attempts from this device" — never to the account.',
      'Forgot password answers identically whether or not the account exists: "If an account exists for that address, we have sent a link." Same words, same screen, and the send happens off the request, because an endpoint that answers instantly for an unknown address and 400ms later for a real one is the same leak measured with a stopwatch. Never render "no account with that email", and never skip the confirmation screen for an address that did not match.',
      'It is a real <form> with a real <button type="submit">. That is what makes Enter submit from any field, what makes the browser offer to save the credential, and what makes a password manager fill it at all. A div listening for a click is the defect that ends with people keeping the password in a text file and pasting it in, because autofill never fires and they stop expecting it to.',
      'autocomplete is the contract with the password manager and every token is exact: username on the identifier, current-password on sign-in, new-password on both boxes of a reset, one-time-code on the second factor. autocomplete="email" on the identifier is the near miss that looks right — it is a contact-detail token, it does not pair with a password field, and managers that key on the pair fill neither. The name attribute matters as much, because the heuristics that run when the tokens are missing look for username and password.',
      'A reset form with no username in it saves the new password against nothing, and the user finds out weeks later when the manager offers them the old one. Render the account as a readonly input on the locked surface carrying autocomplete="username". Hiding it with display:none is worse than leaving it out — several managers skip fields they cannot see, so the form measures as correct and behaves as though the field is absent.',
      'The one-time code is one input, never six boxes. Six boxes fight everything the platform already does: iOS and Android autofill drop all six digits into the first box, a paste puts six characters in one box and nothing in the rest, and moving backwards across a boundary needs keydown handling that gets the Android soft keyboard wrong. One input with inputmode="numeric" and autocomplete="one-time-code" gets the numeric keypad, the SMS suggestion strip and paste for free.',
      'Do not auto-submit when the sixth character lands. Autofill delivers all six at once and the submit races a user who is still fixing the fourth digit, and a code that was rejected because it was submitted half-corrected costs another trip to the authenticator. The submit stays a button the user presses.',
      'A failed submit puts an alert above the form, marks the offending fields aria-invalid, and moves focus to the alert. All three, not one of them: a role="alert" that is already in the DOM at first paint is announced by nothing, because a live region reports mutations and a page load is not one. Focus is what guarantees it is read on a full POST; the role is what covers the htmx swap where the page does not reload.',
      'aria-invalid is bound to the state that paints the red border, and it clears the moment the value is edited. Written once from a server render it survives the correction, and the field then announces as invalid for the rest of the session while its border is grey again — which is worse than never marking it, because the user has no way to find out what is still wrong.',
      'No shell, and no navigation. No sidebar, no topbar, no search, no product menu, no marketing footer. Every extra link on a signed-out page is a route into an application the user cannot reach yet, and each one is a 302 back to this screen with a next parameter that has to be right or it becomes an open redirect.',
      'The card is max-w-sm and centred, and the page never goes full bleed. Two fields stretched across 1440px read as a filter bar, and the eye has to travel the whole width to check a label against the box under it. Nothing scrolls sideways at 390px either, which is the second reason the code is one input rather than a row of six that a 320px screen cannot hold.',
      'The root here is a bounded preview: min-h-[560px] inside a rounded-xl border. As a real page, drop that border, move bg-zinc-100 onto <body>, and make the frame min-h-svh so the card centres in the viewport. min-h-screen is the wrong unit on a phone — 100vh is the height with the browser chrome hidden, so the footer line sits behind the address bar until somebody scrolls a page that has nothing to scroll.'
    ],
    anatomy: [
      ['Frame', 'The whole viewport: bg-zinc-100, one centred column, and nothing else. No shell, no nav, no landmark other than the main below it.'],
      ['Brand mark', 'The product name above the card. It is how the user tells an internal system from a page that looks like one, so it names the system rather than decorating it.'],
      ['Card', 'One white rounded-xl panel at max-w-sm, px-6 py-6. Everything the screen does is inside it.'],
      ['Heading and lede', 'The h1 naming the step — Sign in, Check your email, Enter your code — and one sentence saying what to do next. Never the product name; that is the mark above.'],
      ['Alert slot', 'Directly above the fields, and empty until something fails. The neutral alert card: white, zinc-200 border, colour only in the icon, tabindex="-1" so focus can land on it.'],
      ['Field stack', 'The fewest fields that will do, each a field block — label, bordered wrapper carrying the focus outline, control with its autocomplete token, and a reserved message line so the card does not grow when one errors.'],
      ['Primary action', 'One full-width submit at the foot of the fields. There is exactly one action on an auth screen; anything else on the card is a link.'],
      ['Escape hatch', 'The last block in the card and the line under it: forgot password, back to sign in, the IT address, and the 11px note that the system is internal and activity is logged.']
    ],
    behaviour: [
      'Autofocus lands once, on the first field the user still has to fill — the address on sign in, the code on the second factor, the new password on a reset — and nothing moves focus again on its own.',
      'Enter submits from any field, because the button is a real submit. This is also what makes the browser offer to save the credential, so it is not a convenience.',
      'On failure the alert appears above the form, focus moves to it, and both credential fields are marked invalid. Editing either field clears its mark; the alert stays until the next submit, because it describes an attempt that did happen.',
      'The submit goes busy and disabled on click. A double click on a sign-in POST is a second authentication attempt, and it is counted against the lockout by a server that cannot tell it from a retry.',
      'Password rules on a reset validate as the user types, once the field has been touched, and the requirement list is plain text pointed at by aria-describedby. Making it a live region announces three rules on every keystroke and the user turns the screen reader down rather than the feature off.',
      'Resend, on the check-your-email screen and on the code screen, is rate limited by a visible countdown and the countdown is plain text. A per-second live region is a stream of announcements carrying one fact.',
      'The reveal control keeps focus on itself after it is pressed and says the new state in words in an sr-only status line, because the only other thing announcing it is an icon.',
      'An SSO-only domain never renders a password box. The address routes the request to the identity provider, and a password field there would collect a secret the application then throws away.',
      'Nothing scrolls sideways at 390px. The card is max-w-sm inside px-4, the code is one input, and the two-button rows stack rather than shrink.'
    ],
    a11y: [
      'One <main> and one <h1> per screen, and the h1 names the step rather than the product. There is no shell here, so a missing main leaves the page with no landmark at all and nothing for a screen reader to jump to.',
      'Every control has a real <label for>. A placeholder is not a label — it disappears on the first keystroke, which is exactly when somebody wants to check they are typing in the right box.',
      'The error alert is role="alert" with tabindex="-1" and takes focus when the attempt fails. The role covers the case where the markup is swapped in; the focus covers the case where the page reloaded and the region was present at first paint, which announces nothing.',
      'aria-invalid is bound to the string "true" or "false" from the same state that draws the red border, and what is wrong is written out in text. A red border alone reaches nobody, and it is gone entirely in forced-colours mode.',
      'The reveal button changes its accessible name between Show password and Hide password and carries no aria-pressed. Writing both gives "Hide password, pressed", which reads as though hiding is the thing currently switched on.',
      'The new-password requirement list is pointed at by aria-describedby on the field so it is read on entry, and it is not a live region.',
      'The code input carries inputmode="numeric", autocomplete="one-time-code" and a description saying how many digits, so the field can be filled without seeing the six underscores that suggest it.',
      'Countdown figures are plain text with no live region, and the button they gate says what it is waiting for rather than being disabled with no explanation.',
      'The IT address is a real mailto link and any support reference is selectable text, so it can be copied into a ticket by somebody who cannot get past this screen to raise one in the app.'
    ],
    related: ['field', 'input', 'button', 'alert', 'checkbox', 'error-page'],
    variants: [
      { id: 'signin', name: 'Sign in', code:
`<!-- The tokens are the whole component. autocomplete="username" on the
     identifier and autocomplete="current-password" on the secret is the pair a
     password manager matches on; autocomplete="email" is the near miss that
     looks right, does not pair with anything, and quietly fills neither field.
     name="username" and name="password" carry the same weight, because the
     heuristics that run when the tokens are absent look for those two words —
     and they are what Django's AuthenticationForm posts.

     It is a real form with a real submit, so Enter works from either field and
     the browser offers to save what was typed. Add {% csrf_token %} inside the
     form and keep the hidden next input; validate next server-side against a
     list of allowed paths, or it is an open redirect on the one page that is
     reachable without signing in.

     No sign-up link. Konspec accounts are created by IT, so the dead end is the
     support address rather than a register page that would 403 anyone who
     reached it. -->
<div class="flex min-h-[560px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-10 text-[14px]/5 text-zinc-900"
     x-data="{ show: false, busy: false }">
  <main class="w-full max-w-sm">

    <div class="flex items-center justify-center gap-2.5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-zinc-700 text-[14px]/5 font-semibold text-white">K</span>
      <span class="text-[16px]/6 font-semibold">Konspec Operations</span>
    </div>

    <form method="post" action="/accounts/login/" @submit="busy = true"
          class="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-6">
      <h1 class="text-[20px]/7 font-semibold tracking-tight">Sign in</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">Use your Konspec Industries email address.</p>

      <input type="hidden" name="next" value="/procurement/orders/">

      <div class="mt-5">
        <label for="si-username" class="mb-1.5 block text-[13px]/5 font-medium">Work email</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="si-username" name="username" type="email" autocomplete="username" required autofocus
                 spellcheck="false" autocapitalize="none" placeholder="you@konspec.com"
                 class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
        </div>
      </div>

      <div class="mt-4">
        <div class="mb-1.5 flex items-baseline justify-between gap-3">
          <label for="si-password" class="text-[13px]/5 font-medium">Password</label>
          <a href="/accounts/password_reset/" class="shrink-0 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Forgot password</a>
        </div>
        <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="si-password" name="password" :type="show ? 'text' : 'password'" autocomplete="current-password"
                 required spellcheck="false"
                 class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none">
          <button type="button" @click="show = !show" :aria-label="show ? 'Hide password' : 'Show password'"
                  class="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
            <span x-show="!show" class="flex"><i data-lucide="eye" class="size-4"></i></span>
            <span x-show="show" x-cloak class="flex"><i data-lucide="eye-off" class="size-4"></i></span>
          </button>
        </div>
        <p role="status" class="sr-only" x-text="show ? 'Password is visible' : ''"></p>
      </div>

      <label class="mt-4 flex items-start gap-2.5 text-[13px]/5">
        <input type="checkbox" name="remember" value="1" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Keep me signed in on this device</span>
      </label>

      <!-- disabled is what stops the second click; aria-busy is what says why.
           A double-click here is a second authentication attempt, and the
           server counts it against the lockout as though it were a retry. -->
      <button type="submit" :disabled="busy" :aria-busy="busy"
              class="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 disabled:hover:bg-zinc-700">
        <span x-show="busy" x-cloak class="flex"><i data-lucide="loader-circle" class="size-4 animate-spin"></i></span>
        <span class="grid">
          <span class="col-start-1 row-start-1" :class="busy &amp;&amp; 'invisible'">Sign in</span>
          <span class="col-start-1 row-start-1" :class="!busy &amp;&amp; 'invisible'" aria-hidden="true">Signing in…</span>
        </span>
      </button>

      <p class="mt-4 border-t border-zinc-100 pt-4 text-[12px]/4 text-zinc-600">
        Accounts are created by IT.
        <a href="mailto:it@konspec.com" class="font-medium text-zinc-900 underline underline-offset-2">Email it@konspec.com</a>
        if you do not have one.
      </p>
    </form>

    <p class="mt-4 text-center text-[11px]/4 text-zinc-500">Konspec Industries · internal system · activity is logged</p>
  </main>
</div>` },

      { id: 'failed', name: 'Failed credentials', code:
`<!-- One message for both halves. It does not say which of the address and the
     password was wrong, and there is no "2 attempts left" beside it, because a
     counter only exists for an account that exists — the counter is the leak,
     told slowly. The lockout sentence is scoped to the device in front of you,
     which is true of any address typed into it and therefore says nothing about
     this one.

     Three things happen on failure and all three are needed. The alert appears
     above the form; the two fields go aria-invalid; focus moves to the alert. A
     role="alert" sitting in the DOM at first paint is announced by nothing at
     all — a live region reports mutations and a page load is not one — so on a
     server-rendered failure the focus is the announcement, and the role is what
     covers an htmx swap where the page never reloads. On a real POST render,
     add x-init="$el.focus()" to the alert; here the focus moves on submit
     instead, so a gallery of variants does not fight over the caret.

     aria-invalid clears as soon as the value is edited, and the alert does not.
     The mark describes this value; the alert describes an attempt that
     happened. Bind the mark to a string — written once by the server it
     survives the correction, and the field then announces as invalid all
     session while its border is grey again. -->
<div class="flex min-h-[560px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-10 text-[14px]/5 text-zinc-900"
     x-data="{
       failed: true, edited: false, show: false,
       get bad() { return this.failed &amp;&amp; !this.edited },
       fail() {
         this.failed = false;
         this.edited = false;
         this.$nextTick(() => { this.failed = true; this.$nextTick(() => this.$refs.err.focus()) });
       }
     }">
  <main class="w-full max-w-sm">

    <div class="flex items-center justify-center gap-2.5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-zinc-700 text-[14px]/5 font-semibold text-white">K</span>
      <span class="text-[16px]/6 font-semibold">Konspec Operations</span>
    </div>

    <form method="post" action="/accounts/login/" @submit.prevent="fail()"
          class="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-6">
      <h1 class="text-[20px]/7 font-semibold tracking-tight">Sign in</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">Use your Konspec Industries email address.</p>

      <div x-show="failed" x-ref="err" role="alert" tabindex="-1"
           class="mt-4 flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 outline-none">
        <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
        <div class="min-w-0">
          <p class="text-[13px]/5 font-medium">That email address and password do not match an active account.</p>
          <p class="mt-0.5 text-[12px]/4 text-zinc-600">Repeated failures lock sign-in from this device for 15 minutes.</p>
        </div>
      </div>

      <div class="mt-4">
        <label for="sf-username" class="mb-1.5 block text-[13px]/5 font-medium">Work email</label>
        <div class="rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
             :class="bad ? 'border-red-600 focus-within:outline-red-600/15'
                         : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
          <input id="sf-username" name="username" type="email" autocomplete="username" required
                 spellcheck="false" autocapitalize="none" value="akshay.prabhu@konspec.com"
                 @input="edited = true" :aria-invalid="bad ? 'true' : 'false'"
                 class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none">
        </div>
      </div>

      <div class="mt-4">
        <div class="mb-1.5 flex items-baseline justify-between gap-3">
          <label for="sf-password" class="text-[13px]/5 font-medium">Password</label>
          <a href="/accounts/password_reset/" class="shrink-0 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Forgot password</a>
        </div>
        <div class="flex items-center rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
             :class="bad ? 'border-red-600 focus-within:outline-red-600/15'
                         : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
          <input id="sf-password" name="password" :type="show ? 'text' : 'password'" autocomplete="current-password"
                 required spellcheck="false" value="silvassa-2026"
                 @input="edited = true" :aria-invalid="bad ? 'true' : 'false'"
                 class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none">
          <button type="button" @click="show = !show" :aria-label="show ? 'Hide password' : 'Show password'"
                  class="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
            <span x-show="!show" class="flex"><i data-lucide="eye" class="size-4"></i></span>
            <span x-show="show" x-cloak class="flex"><i data-lucide="eye-off" class="size-4"></i></span>
          </button>
        </div>
        <p role="status" class="sr-only" x-text="show ? 'Password is visible' : ''"></p>
      </div>

      <button type="submit"
              class="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Sign in</button>

      <p class="mt-4 border-t border-zinc-100 pt-4 text-[12px]/4 text-zinc-600">
        Locked out or on a new device?
        <a href="mailto:it@konspec.com" class="font-medium text-zinc-900 underline underline-offset-2">Email it@konspec.com</a>
      </p>
    </form>

    <p class="mt-4 text-center text-[11px]/4 text-zinc-500">Konspec Industries · internal system · activity is logged</p>
  </main>
</div>` },

      { id: 'forgot', name: 'Forgot password', code:
`<!-- The one screen where the wording is the security control. Whatever is
     typed here, the next screen says the same sentence: "If an account exists
     for that address, we have sent a link." No "we could not find that email",
     no different button state for a known address, and the send queued off the
     request so a stopwatch cannot tell the two apart either.

     The field still carries autocomplete="username" and name="username". It is
     the account identifier, not a contact field, and the manager the user keeps
     it in should offer it here the same way it does on sign in.

     The Entra note is the honest exception and it leaks nothing: it is a fact
     about the domain, not about the address. Somebody who signs in through SSO
     has no password to reset, and without this line they type their address,
     get the confirmation screen, and wait for an email that will never come. -->
<div class="flex min-h-[560px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-10 text-[14px]/5 text-zinc-900"
     x-data="{ busy: false }">
  <main class="w-full max-w-sm">

    <div class="flex items-center justify-center gap-2.5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-zinc-700 text-[14px]/5 font-semibold text-white">K</span>
      <span class="text-[16px]/6 font-semibold">Konspec Operations</span>
    </div>

    <form method="post" action="/accounts/password_reset/" @submit="busy = true"
          class="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-6">
      <h1 class="text-[20px]/7 font-semibold tracking-tight">Reset your password</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">Enter your work email and we will send a link to set a new one.</p>

      <div class="mt-4 flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5">
        <i data-lucide="info" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
        <p class="text-[12px]/4 text-zinc-600">
          Accounts on <span class="font-medium text-zinc-900">konspec.com</span> that sign in through Microsoft Entra ID have no password here — reset it in Entra instead.
        </p>
      </div>

      <div class="mt-4">
        <label for="fg-username" class="mb-1.5 block text-[13px]/5 font-medium">Work email</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="fg-username" name="username" type="email" autocomplete="username" required autofocus
                 spellcheck="false" autocapitalize="none" placeholder="you@konspec.com"
                 aria-describedby="fg-username-help"
                 class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
        </div>
        <p id="fg-username-help" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
          If an account exists for that address, a link goes to it. We do not say either way.
        </p>
      </div>

      <button type="submit" :disabled="busy" :aria-busy="busy"
              class="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 disabled:hover:bg-zinc-700">
        <span x-show="busy" x-cloak class="flex"><i data-lucide="loader-circle" class="size-4 animate-spin"></i></span>
        <span class="grid">
          <span class="col-start-1 row-start-1" :class="busy &amp;&amp; 'invisible'">Email me a reset link</span>
          <span class="col-start-1 row-start-1" :class="!busy &amp;&amp; 'invisible'" aria-hidden="true">Sending…</span>
        </span>
      </button>

      <p class="mt-4 border-t border-zinc-100 pt-4 text-[12px]/4">
        <a href="/accounts/login/" class="inline-flex items-center gap-1.5 font-medium text-zinc-900 underline underline-offset-2">
          <i data-lucide="arrow-left" class="size-3.5"></i>Back to sign in
        </a>
      </p>
    </form>

    <p class="mt-4 text-center text-[11px]/4 text-zinc-500">Konspec Industries · internal system · activity is logged</p>
  </main>
</div>` },

      { id: 'sent', name: 'Check your email', code:
`<!-- This screen renders for every address, including one with no account
     behind it. That is the whole point of it: it is the only answer the reset
     endpoint gives, so nothing on it may be conditional on whether the account
     exists. Echoing the address back is fine — the user typed it — but the
     sentence stays "if an account exists".

     The icon well is bg-zinc-200 with ring-zinc-300 like every other tinted
     shape in the system. It does not take a tint of its own because the state
     is not an error, and a green or amber disc here would be colour used as
     decoration.

     Resend is a real form POST behind a visible countdown, and the countdown is
     plain text. Making it a live region announces one fact sixty times. The
     button is disabled while it runs, which is only acceptable because the
     figure beside it says exactly what it is waiting for. -->
<div class="flex min-h-[480px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-10 text-[14px]/5 text-zinc-900"
     x-data="{ left: 45 }"
     x-init="setInterval(() => { if (left &gt; 0) left-- }, 1000)">
  <main class="w-full max-w-sm">

    <div class="flex items-center justify-center gap-2.5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-zinc-700 text-[14px]/5 font-semibold text-white">K</span>
      <span class="text-[16px]/6 font-semibold">Konspec Operations</span>
    </div>

    <div class="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-6 text-center">
      <span class="mx-auto flex size-11 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="mail-check" class="size-5 text-zinc-600"></i>
      </span>

      <h1 class="mt-4 text-[20px]/7 font-semibold tracking-tight">Check your email</h1>
      <p class="mt-2 text-[13px]/5 text-zinc-600">
        If an account exists for <span class="font-medium text-zinc-900">akshay.prabhu@konspec.com</span>, we have sent a link to it.
      </p>

      <dl class="mt-5 space-y-2 rounded-lg border border-zinc-200 px-4 py-3 text-left">
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Link expires</dt>
          <dd class="text-[12px]/4 font-medium tabular-nums">30 minutes after sending</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Uses</dt>
          <dd class="text-[12px]/4 font-medium tabular-nums">Once</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Sender</dt>
          <dd class="text-[12px]/4 font-medium">no-reply@konspec.com</dd>
        </div>
      </dl>

      <p class="mt-4 text-[12px]/4 text-zinc-500">Nothing after a minute? Check the junk folder before resending — a second link cancels the first.</p>

      <form method="post" action="/accounts/password_reset/" class="mt-4">
        <input type="hidden" name="username" value="akshay.prabhu@konspec.com">
        <button type="submit" :disabled="left &gt; 0"
                class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:hover:bg-zinc-200">
          <span x-show="left === 0" x-cloak>Resend the link</span>
          <span x-show="left &gt; 0" class="tabular-nums">Resend in <span x-text="left"></span>s</span>
        </button>
      </form>

      <p class="mt-4 border-t border-zinc-100 pt-4 text-[12px]/4">
        <a href="/accounts/login/" class="inline-flex items-center gap-1.5 font-medium text-zinc-900 underline underline-offset-2">
          <i data-lucide="arrow-left" class="size-3.5"></i>Back to sign in
        </a>
      </p>
    </div>

    <p class="mt-4 text-center text-[11px]/4 text-zinc-500">Konspec Industries · internal system · activity is logged</p>
  </main>
</div>` },

      { id: 'reset', name: 'Set a new password', code:
`<!-- The readonly account field is the load-bearing part and it is the one
     everybody leaves out. A password manager saves a credential as a pair, so a
     form carrying only two new-password boxes saves the new secret against
     nothing and offers the old one back a fortnight later. Rendering the
     username hidden with display:none does not fix it — several managers skip
     fields they cannot see — so it is a real readonly input on the locked
     surface, visible, labelled, and carrying autocomplete="username".

     Both boxes are autocomplete="new-password". Using current-password on the
     first makes the manager fill it with the password being replaced.

     The rules are a checklist, not a strength meter. A meter puts length,
     character classes and a dictionary check on one 0–100 scale and then cannot
     say which of them is failing; the checklist is the same information with
     the answer attached. It is pointed at by aria-describedby so it is read on
     entry, and it is deliberately not a live region — three rules re-announced
     on every keystroke is a reason to switch the screen reader off.

     The submit stays enabled. A disabled button with no explanation is a dead
     end for anybody who cannot see which rule is still grey; the form validates
     and says so. -->
<div class="flex min-h-[560px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-10 text-[14px]/5 text-zinc-900"
     x-data="{
       pw: '', pw2: '', show: false, touched: false,
       get long() { return this.pw.length &gt;= 12 },
       get mixed() { return /[a-zA-Z]/.test(this.pw) &amp;&amp; /[0-9]/.test(this.pw) },
       get fresh() { return this.pw.length &gt; 0 &amp;&amp; this.pw.toLowerCase().indexOf('konspec') === -1 },
       get mismatch() { return this.touched &amp;&amp; this.pw2.length &gt; 0 &amp;&amp; this.pw !== this.pw2 }
     }">
  <main class="w-full max-w-sm">

    <div class="flex items-center justify-center gap-2.5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-zinc-700 text-[14px]/5 font-semibold text-white">K</span>
      <span class="text-[16px]/6 font-semibold">Konspec Operations</span>
    </div>

    <form method="post" action="/accounts/reset/set-password/"
          class="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-6">
      <h1 class="text-[20px]/7 font-semibold tracking-tight">Set a new password</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">This link works once and expires at 14:20 IST.</p>

      <div class="mt-5">
        <label for="rp-username" class="mb-1.5 block text-[13px]/5 font-medium">Account</label>
        <div class="rounded-lg border border-zinc-200 bg-zinc-100">
          <input id="rp-username" name="username" type="email" value="akshay.prabhu@konspec.com"
                 autocomplete="username" readonly aria-describedby="rp-username-help"
                 class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none">
        </div>
        <p id="rp-username-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Taken from the link. This is the credential your password manager will update.</p>
      </div>

      <div class="mt-4">
        <label for="rp-pw" class="mb-1.5 block text-[13px]/5 font-medium">New password</label>
        <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="rp-pw" name="new_password1" :type="show ? 'text' : 'password'" x-model="pw"
                 autocomplete="new-password" required minlength="12" spellcheck="false"
                 aria-describedby="rp-rules"
                 class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none">
          <button type="button" @click="show = !show" :aria-label="show ? 'Hide password' : 'Show password'"
                  class="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
            <span x-show="!show" class="flex"><i data-lucide="eye" class="size-4"></i></span>
            <span x-show="show" x-cloak class="flex"><i data-lucide="eye-off" class="size-4"></i></span>
          </button>
        </div>
        <p role="status" class="sr-only" x-text="show ? 'Password is visible' : ''"></p>

        <ul id="rp-rules" class="mt-2 space-y-1 text-[12px]/4 text-zinc-600">
          <li class="flex items-start gap-2">
            <span class="mt-px flex size-3.5 shrink-0 items-center justify-center">
              <span x-show="long" x-cloak class="flex"><i data-lucide="check" class="size-3.5 text-emerald-600"></i></span>
              <span x-show="!long" class="size-1.5 rounded-full bg-zinc-400"></span>
            </span>
            <span>At least 12 characters</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-px flex size-3.5 shrink-0 items-center justify-center">
              <span x-show="mixed" x-cloak class="flex"><i data-lucide="check" class="size-3.5 text-emerald-600"></i></span>
              <span x-show="!mixed" class="size-1.5 rounded-full bg-zinc-400"></span>
            </span>
            <span>Letters and at least one number</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="mt-px flex size-3.5 shrink-0 items-center justify-center">
              <span x-show="fresh" x-cloak class="flex"><i data-lucide="check" class="size-3.5 text-emerald-600"></i></span>
              <span x-show="!fresh" class="size-1.5 rounded-full bg-zinc-400"></span>
            </span>
            <span>Does not contain "konspec"</span>
          </li>
        </ul>
      </div>

      <div class="mt-4">
        <label for="rp-pw2" class="mb-1.5 block text-[13px]/5 font-medium">Confirm new password</label>
        <div class="rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
             :class="mismatch ? 'border-red-600 focus-within:outline-red-600/15'
                              : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
          <input id="rp-pw2" name="new_password2" :type="show ? 'text' : 'password'" x-model="pw2"
                 @blur="touched = true" autocomplete="new-password" required minlength="12" spellcheck="false"
                 aria-describedby="rp-pw2-msg" :aria-invalid="mismatch ? 'true' : 'false'"
                 class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none">
        </div>
        <p id="rp-pw2-msg" class="mt-1.5 min-h-4 text-[12px]/4">
          <span x-show="!mismatch" class="block text-zinc-500">Type it a second time so a typo cannot lock you out.</span>
          <span x-show="mismatch" x-cloak class="flex items-start gap-1.5 font-medium text-red-600">
            <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>The two passwords do not match.
          </span>
        </p>
      </div>

      <button type="submit"
              class="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save and sign in</button>

      <p class="mt-4 border-t border-zinc-100 pt-4 text-[12px]/4 text-zinc-600">
        Every other device signed in as this account is signed out when the password changes.
      </p>
    </form>

    <p class="mt-4 text-center text-[11px]/4 text-zinc-500">Konspec Industries · internal system · activity is logged</p>
  </main>
</div>` },

      { id: 'otp', name: 'One-time code', code:
`<!-- One input, six digits. Six separate boxes is the version everybody builds
     and it fights the platform on every axis: iOS and Android drop the whole
     code into whichever box is focused, a paste puts six characters in one box
     and nothing in the others, and moving backwards across a boundary needs
     keydown handling that gets the Android soft keyboard wrong. A single input
     with inputmode="numeric" and autocomplete="one-time-code" gets the numeric
     keypad, the SMS suggestion strip and paste without a line of JavaScript.
     It is also the only version that fits on a 320px screen.

     No auto-submit on the sixth character. Autofill delivers all six at once
     and would race a user still fixing the fourth digit, and a code rejected
     because it was submitted half-corrected costs another trip to the
     authenticator app. The submit is a button somebody presses.

     Naming the factor is safe here — the password already proved who this is —
     and it is what stops the user hunting through three apps for a code. -->
<div class="flex min-h-[520px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-10 text-[14px]/5 text-zinc-900"
     x-data="{ code: '', left: 28 }"
     x-init="setInterval(() => { if (left &gt; 0) left-- }, 1000)">
  <main class="w-full max-w-sm">

    <div class="flex items-center justify-center gap-2.5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-zinc-700 text-[14px]/5 font-semibold text-white">K</span>
      <span class="text-[16px]/6 font-semibold">Konspec Operations</span>
    </div>

    <form method="post" action="/accounts/two-factor/" class="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-6">
      <h1 class="text-[20px]/7 font-semibold tracking-tight">Enter your code</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">
        Open Microsoft Authenticator on <span class="font-medium text-zinc-900">Pixel 7a</span> and read the 6-digit code for Konspec Operations.
      </p>

      <div class="mt-5">
        <label for="ot-code" class="mb-1.5 block text-[13px]/5 font-medium">6-digit code</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="ot-code" name="code" x-model="code" @input="code = code.replace(/[^0-9]/g, '')"
                 inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}"
                 maxlength="6" minlength="6" required autofocus
                 spellcheck="false" autocapitalize="none" autocorrect="off"
                 aria-describedby="ot-code-help"
                 class="w-full min-w-0 bg-transparent px-3 py-2.5 text-center font-mono text-[20px]/7 tabular-nums outline-none">
        </div>
        <p id="ot-code-help" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums"
           :class="left === 0 ? 'font-medium text-amber-700' : 'text-zinc-500'">
          <span x-show="left &gt; 0">Six digits. This code expires in <span x-text="left"></span>s.</span>
          <span x-show="left === 0" x-cloak class="flex items-center gap-1.5">
            <i data-lucide="alert-triangle" class="size-3.5 shrink-0"></i>That code has expired — read the next one.
          </span>
        </p>
      </div>

      <label class="mt-3 flex items-start gap-2.5 text-[13px]/5">
        <input type="checkbox" name="trust_device" value="1" aria-describedby="ot-trust-help"
               class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Do not ask for a code on this device for 30 days</span>
      </label>
      <p id="ot-trust-help" class="mt-1 pl-[26px] text-[12px]/4 text-zinc-500">Only on a device nobody else uses. A shared plant terminal is not one.</p>

      <button type="submit"
              class="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Verify and continue</button>

      <div class="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-[12px]/4">
        <p>
          <a href="/accounts/two-factor/recovery/" class="font-medium text-zinc-900 underline underline-offset-2">Use a recovery code instead</a>
          <span class="text-zinc-600"> — the 10 codes issued when you set up the authenticator.</span>
        </p>
        <p>
          <a href="/accounts/logout/" class="font-medium text-zinc-900 underline underline-offset-2">Sign in as someone else</a>
          <span class="text-zinc-600"> — signed in as akshay.prabhu@konspec.com.</span>
        </p>
      </div>
    </form>

    <p class="mt-4 text-center text-[11px]/4 text-zinc-500">Konspec Industries · internal system · activity is logged</p>
  </main>
</div>` },

      { id: 'sso', name: 'Single sign-on only', code:
`<!-- Where the domain mandates SSO, do not render a password box. A field that
     collects a secret the application will discard is worse than no field: the
     user's manager saves it, the value is now in a second place, and the next
     rotation leaves a stale copy behind. The address is still collected,
     because it routes the request to the right tenant and it is what the
     manager fills.

     Say why, and say it in one line. "Sign-in is managed by IT" with no further
     explanation reads as an outage to somebody who signed in with a password
     last week.

     The vendor portal line is the escape hatch. Contractors and vendors are not
     in Entra, so without it every one of them mails IT to ask why the password
     box has gone. One primary action, one route out, nothing else. -->
<div class="flex min-h-[480px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-10 text-[14px]/5 text-zinc-900"
     x-data="{ busy: false }">
  <main class="w-full max-w-sm">

    <div class="flex items-center justify-center gap-2.5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-zinc-700 text-[14px]/5 font-semibold text-white">K</span>
      <span class="text-[16px]/6 font-semibold">Konspec Operations</span>
    </div>

    <form method="post" action="/accounts/sso/start/" @submit="busy = true"
          class="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-6">
      <h1 class="text-[20px]/7 font-semibold tracking-tight">Sign in</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">
        <span class="font-medium text-zinc-900">konspec.com</span> signs in through Microsoft Entra ID. There is no separate password for this system.
      </p>

      <input type="hidden" name="next" value="/procurement/orders/">

      <div class="mt-5">
        <label for="so-username" class="mb-1.5 block text-[13px]/5 font-medium">Work email</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="so-username" name="username" type="email" autocomplete="username" required autofocus
                 spellcheck="false" autocapitalize="none" placeholder="you@konspec.com"
                 aria-describedby="so-username-help"
                 class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
        </div>
        <p id="so-username-help" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">Used to pick the right tenant. You will type your password on the Microsoft page.</p>
      </div>

      <button type="submit" :disabled="busy" :aria-busy="busy"
              class="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 disabled:hover:bg-zinc-700">
        <span x-show="!busy" class="flex"><i data-lucide="shield-check" class="size-4"></i></span>
        <span x-show="busy" x-cloak class="flex"><i data-lucide="loader-circle" class="size-4 animate-spin"></i></span>
        <span class="grid">
          <span class="col-start-1 row-start-1" :class="busy &amp;&amp; 'invisible'">Continue with Microsoft Entra ID</span>
          <span class="col-start-1 row-start-1" :class="!busy &amp;&amp; 'invisible'" aria-hidden="true">Redirecting…</span>
        </span>
      </button>

      <div class="mt-5 flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5">
        <i data-lucide="building-2" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
        <p class="text-[12px]/4 text-zinc-600">
          Vendors and contractors are not in Entra ID and still sign in with a password on the
          <a href="https://vendors.konspec.com/" class="font-medium text-zinc-900 underline underline-offset-2">vendor portal</a>.
        </p>
      </div>

      <p class="mt-4 border-t border-zinc-100 pt-4 text-[12px]/4 text-zinc-600">
        Entra ID unreachable from a plant network?
        <a href="mailto:it@konspec.com" class="font-medium text-zinc-900 underline underline-offset-2">Email it@konspec.com</a>
      </p>
    </form>

    <p class="mt-4 text-center text-[11px]/4 text-zinc-500">Konspec Industries · internal system · activity is logged</p>
  </main>
</div>` },

      { id: 'locked', name: 'Locked out', code:
`<!-- The lock is on the device, not on the account, and the wording has to keep
     it there. "This account is locked" confirms the account exists to whoever
     was guessing at it; "too many sign-in attempts from this device" is true of
     any address typed into this browser and says nothing about any of them. The
     figure counts down from the same throttle the server is enforcing, so the
     user is not sitting on a screen that lies about when it will let them back.

     Reset is the primary action rather than Wait, because it is the one route
     that does not require the countdown to finish — and it is the honest guess
     about why somebody failed four times in a row.

     A password that expired on a rotation is a different screen: it is not a
     failure, the user is already authenticated, and it routes straight to the
     reset variant with the old password as the first field.

     The reference is selectable text. Somebody stuck here cannot raise a ticket
     in the app, so the one identifier support will ask for has to be copyable
     off this page. -->
<div class="flex min-h-[480px] items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-10 text-[14px]/5 text-zinc-900"
     x-data="{ left: 822 }"
     x-init="setInterval(() => { if (left &gt; 0) left-- }, 1000)">
  <main class="w-full max-w-sm">

    <div class="flex items-center justify-center gap-2.5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-zinc-700 text-[14px]/5 font-semibold text-white">K</span>
      <span class="text-[16px]/6 font-semibold">Konspec Operations</span>
    </div>

    <div class="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-6 text-center">
      <span class="mx-auto flex size-11 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="lock" class="size-5 text-zinc-600"></i>
      </span>

      <h1 class="mt-4 text-[20px]/7 font-semibold tracking-tight">Sign-in is paused</h1>
      <p class="mt-2 text-[13px]/5 text-zinc-600">
        Too many sign-in attempts from this device. Sign-in from here is blocked for 15 minutes, whichever address is used.
      </p>

      <p class="mt-4 rounded-lg border border-zinc-200 px-4 py-3 text-[24px]/7 font-semibold tabular-nums tracking-tight"
         x-text="Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0')">13:42</p>
      <p class="mt-1.5 text-[12px]/4 text-zinc-500">Until this device may try again</p>

      <div class="mt-5 space-y-2">
        <a href="/accounts/password_reset/"
           class="inline-flex h-10 w-full items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Reset your password instead</a>
        <a href="mailto:it@konspec.com?subject=Sign-in%20blocked%20(SEC-4471)"
           class="inline-flex h-10 w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Email IT to unblock now</a>
      </div>

      <p class="mt-4 border-t border-zinc-100 pt-4 text-left text-[12px]/4 text-zinc-600">
        Quote reference <span class="font-mono font-medium tabular-nums text-zinc-900 select-all">SEC-4471</span> —
        IT can see the attempts against it without needing your password.
      </p>
    </div>

    <p class="mt-4 text-center text-[11px]/4 text-zinc-500">Konspec Industries · internal system · activity is logged</p>
  </main>
</div>` }
    ]
  },

  {
    id: 'error-page', name: 'Error page', category: 'layout',
    description: 'The whole screen the user gets when the page could not be produced at all. It says what failed in their own terms, whether anything they did was saved, and gives one way back into an application whose navigation is not on this page.',
    when: 'The response is not the page that was asked for: a route that does not exist, a record this account may not open, a view that raised, a service that is down for maintenance, a session that had already expired when the request went out, or a navigation that never reached the server. It owns the viewport, because there is no working page left to put a message inside — this and auth-page are the only two screens in the system that do not render inside app-shell, which is exactly why the way back has to be drawn on the page itself. Reach for empty-state instead the moment the page around the failure still works: a register that came back with no rows, one panel whose fragment 500ed while the topbar, the sidebar and the rest of the record are still on screen, a table the account may not read inside a record it may. The test is what is still usable. If the user can still navigate, still read the record, still press Cancel, the failure is a region and it belongs to empty-state\'s error or permission variant; if the failure is the response, it is this. Getting it the wrong way round costs both ways — a full error screen thrown up because one dashboard tile timed out destroys eleven tiles that loaded fine, and an inline empty state standing in for a 500 leaves somebody on a page that looks like it worked.',
    notes: [
      'There is no shell on this page, and that is the whole design problem. No sidebar, no topbar, no breadcrumb, no search — app-shell\'s own when says error and auth screens are the two that do not use it, and the reason is not aesthetic: the shell reads the nav, the counts and the signed-in user out of context that the failing request may not have, and a sidebar of live counts drawn around a 500 claims data nobody could read. What replaces it has to be on the page: the wordmark is a real link to the console root, one primary action goes to the nearest thing that still works, and one secondary route reaches support. That is the entire navigation. No search box, no illustration, no third filled button — anything else, the support address and who is signed in included, is a line of footer text.',
      'The support reference is the point of the 500 and it is the part that gets left out. It is tabular-nums, it is selectable, and it has a copy button beside it, because an error the user cannot quote is an error nobody can act on: "it broke this afternoon" and a screenshot of a graphite page is not a ticket anyone can search. The same string goes into the mailto subject on the secondary action, so the user who will not copy anything still gets it into the message. Generate the code in the handler and write it to the log before the page renders — a code minted in the browser matches nothing on the server, which is worse than no code at all because support will spend twenty minutes grepping for it.',
      'Never put a traceback, an exception message or a query on this screen. IntegrityError: duplicate key value violates unique constraint "grn_number_key" tells the user nothing they can act on and tells everyone else the table names; Django\'s own 403 handler passes {{ exception }} into the template and it is whatever string the raising view happened to type, which is internal wording written for a log. Say what failed in the user\'s terms — the receipt did not post — and put the traceback in the log next to the reference code, which is what the reference code is for.',
      'Say whether anything was saved. It is the question the user is actually asking and the one most error pages never answer, so they answer it themselves by re-keying a goods receipt that in fact posted. Write it as a fact — the receipt was not posted and nothing was written to the ledger — or, where the outcome genuinely cannot be known from the handler, say that and say how to check: open GRN-24-0912 in the register and look for a posting line. A cheerful "please try again" over an operation that half completed is how a plant ends up with two receipts against one challan.',
      'The primary action is a GET forward to the nearest page that works, never history.back() and never a reload. Back returns to the request that just failed, and after a failed POST the browser offers to submit the form a second time, which is the same defect the page is apologising for. The nearest thing that works is usually the register the record sits in — back to goods receipts, not back to the home page, which throws away everything the user knew about where they were.',
      'Never replace a page holding unsaved input with an error screen. A submit that fails leaves the form exactly where it is with an alert above it and the values still in the fields; swapping the whole document for an error page discards half an hour of a GRN somebody was keying line by line, and no amount of wording on the replacement makes that back. This screen is for a navigation that failed, not for a submission that failed — that is alert, over the form that is still there.',
      'A 403 names the scope and the person who opens it, and the decision about whether to send a 403 at all is made per model. Access is granted by Nilesh Patil, Head of Procurement, not by "your administrator", or the page is a dead end wearing a sentence. But note what a 403 admits: it confirms the record exists. Where the existence of a record is itself confidential — a disciplinary file, a vendor under negotiation — the handler returns 404 and the user gets the not-found screen, because a 403 on that URL and a 404 on the next one is an enumeration oracle.',
      'A 503 carries a Retry-After header and states a clock time, not "shortly". A window with a real end is the difference between a plant supervisor waiting and a plant supervisor phoning IT. Derive the countdown from a server-rendered <time datetime> rather than from a literal in the markup, or a machine whose clock is twenty minutes out reports a time nobody agrees with. Handle the overrun: past the stated time the screen says the work is running late and offers a check, never a negative number and never a counter frozen at zero. Nothing on this page reloads itself on a timer while somebody is reading it — reacting to the browser\'s own online event is a different thing, because that is a real signal rather than a guess.',
      'The icon well stays graphite on every one of these screens — bg-zinc-200 with ring-1 ring-inset ring-zinc-300 — and the tone lives in the glyph and in the words, exactly as in alert and empty-state. No red field, no amber field, no -50 tint. A full page of red for a two-minute 502 makes a transient blip look like data loss, and a 404, which is nobody\'s fault and usually a stale link in an email, would then need a colour of its own to say it is not an emergency.',
      'It is still a real document with a real outline: one <main>, one <h1>, and the h1 is the sentence rather than the number. "Error 500" as a heading is a status line promoted by font size — it belongs above the heading as an 11px label, small and muted, for the support call. Nothing is autofocused, because the browser already starts at the top of a freshly loaded document and an autofocused primary action turns a stray Enter left over from the last page into a navigation nobody asked for. Each snippet root here is a bounded preview — min-h-[560px] with rounded-xl border border-zinc-200 — so it renders in a box on this page; as a real page, drop the wrapper border and the rounded corners and put min-h-screen on the root. Unlike app-shell there is nothing to overflow-hidden: the error page scrolls with the document, which is what keeps a long 403 explanation and the actions under it reachable on a 720px laptop.',
      'Announce it. A document load reads the <title>, so the title states the failure first — "Page not found · Konspec Operations" — and not the route that failed. An error screen swapped into the page by htmx is silent: nothing reloads, no title is read, and the h1 that explains everything is never spoken, so the user is left with their last announcement and a page that stopped responding. Put role="alert" on the message block in that case and move focus to the h1, which carries tabindex="-1" for exactly this, so the heading is read and the tab order restarts at the top of the message rather than wherever the destroyed page left it.',
      'These are Django\'s handler templates and the three do not have the same powers. 404.html is rendered with the request and receives {{ request_path }}; 403.html receives {{ exception }}; 500.html is rendered by django.views.defaults.server_error as template.render() with no context and no request, so every variable on it resolves to an empty string and the incident id cannot be templated at all — either everything on that page is literal, or you register your own handler500 that renders with context. Tags still work in all three, so {% url %} and {% static %} are safe. Do not {% extends "base.html" %} on any of them: base.html reads the nav, the counts and the user out of context the failing request may not have, and a 500 template that raises while rendering drops the user on Django\'s own bare error page instead.',
    ],
    anatomy: [
      ['Wordmark', 'The only navigation on the page: a real link to the console root, because the sidebar that normally carries that link is not rendered. It also says which system the user is looking at, which matters when the screen arrives from a bookmark.'],
      ['Icon well', 'size-12 rounded-full bg-zinc-200 with ring-1 ring-inset ring-zinc-300 round a size-5 glyph. Graphite on every variant; only the glyph takes a tone, and it is aria-hidden.'],
      ['Status line', 'The code — Error 404, Error 503 — at text-[11px]/4 uppercase above the heading. Supporting detail for the support call, and never the heading itself.'],
      ['Headline', 'The page\'s single h1, in the user\'s words rather than the protocol\'s, and the same sentence the <title> leads with. Carries tabindex="-1" so a swapped-in screen can move focus to it.'],
      ['Explanation', 'What it means for them, whether anything was saved, and what to do next, in a max-w-md line so it wraps to two or three readable lines instead of one wide one.'],
      ['Reference', 'The thing support needs: the requested path on a 404, the incident id on a 500, the window on a 503. tabular-nums, selectable, break-all so it wraps at 390px, and with a copy button wherever it is a code somebody has to quote.'],
      ['Actions', 'One primary anchor to the nearest page that works, and one secondary route — support, sign-in, a retry. They stack full width below sm.'],
      ['Footer line', 'Who is signed in and how to reach IT, as text. On a shared plant terminal the signed-in address is the line that tells somebody the session that failed was not theirs.']
    ],
    behaviour: [
      'It is the whole viewport and it renders outside app-shell, so the wordmark, the primary action and the support route are the only ways off the screen.',
      'The primary action is a GET forward to a working page — the register the record sat in — never history.back() and never a reload, both of which return to the request that failed and can re-post a form.',
      'The copy of the explanation states whether anything was written, or states that it cannot be known and gives the record to check.',
      'A 500 shows a reference code and nothing about the internals. The code is selectable, has a copy button that confirms, and is repeated in the support mailto so it reaches the ticket either way.',
      'A 503 counts down to a server-rendered clock time and switches to running-late plus a check action once that time passes. Nothing on the page reloads itself on a timer.',
      'The offline screen retries in place: the action swaps to a busy state, the attempt count and the time of the last attempt update on the same screen, and the browser\'s online event enables the way back rather than navigating out from under whoever is reading.',
      'A session that expired routes back to sign-in carrying the page the user was on as next, encoded, and never redirects on its own.',
      'Below sm the two actions stack full width, the reference block wraps with break-all rather than scrolling sideways, and the header drops to the wordmark alone.',
      'Loaded as a document the <title> announces it; swapped in by htmx it carries role="alert" and moves focus to the h1, because a swap reads no title and reloads nothing.'
    ],
    a11y: [
      'One <main> and one <h1>, and the h1 is the sentence rather than the status code. The code sits above it as an 11px label, so the heading list reads "This page does not exist" and not "404".',
      'The <title> states the failure first — "Page not found · Konspec Operations" — because on a full page load that string is the announcement and the h1 is only read once somebody navigates to it.',
      'Nothing is autofocused on a document load. Focus starts where the browser puts it, at the top, and an autofocused primary action turns a keystroke left over from the previous page into a navigation.',
      'Where the screen arrives by htmx swap, the message block takes role="alert" and focus moves to the h1 carrying tabindex="-1". A swap reads no title, so without both the page silently stops being the page the user was on.',
      'role="alert" belongs only on the swapped case. On a freshly loaded document it competes with the title being read and duplicates it.',
      'The glyph is decoration and is aria-hidden, including alert-circle on the 500. What makes the screen an error is the wording; colour is not available to everyone reading it and is not a message.',
      'The reference is selectable text in the page, never an image and never a title attribute. The copy button carries a name that changes to confirm and writes its confirmation into an sr-only aria-live="polite" line, because a swapped icon announces nothing.',
      'The countdown on the maintenance screen is plain text and not a live region. A two-hour window announced every thirty seconds buries every other thing on the page.',
      'Every action is a real <a> or <button> with a name that says where it goes — "Back to goods receipts", "Sign in again" — reachable by Tab and wearing focus-visible:outline-3 focus-visible:outline-offset-2. No rings anywhere, because forced-colours mode drops every box-shadow and these users are already having a bad afternoon.'
    ],
    related: ['empty-state', 'auth-page', 'app-shell', 'alert'],
    variants: [
      { id: '404', name: '404 not found', code:
`<!-- The route resolved to nothing. The single most useful thing on the screen
     is the path that was asked for, because the usual cause is a link in an
     email older than the last numbering change, and seeing the old prefix is
     what tells the user that.

     The path is selectable and break-all: an unbroken 60-character URL is the
     one string on this page that will push a 390px screen sideways.

     The primary action goes to the register the record would have been in, not
     to the home page. Back to purchase orders keeps everything the user knew
     about where they were; back to the dashboard throws it away.

     No shell, so the wordmark is the only navigation and it is a real link. No
     search box: the register the button lands on has one, and it has the
     filters that go with it. -->
<div class="flex min-h-[560px] flex-col rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-5 text-[14px]/5 text-zinc-900">

  <header class="flex items-center justify-between gap-3">
    <a href="/" class="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[13px]/5 font-semibold text-white" aria-hidden="true">K</span>
      <span class="text-[14px]/5 font-semibold">Konspec Operations</span>
    </a>
    <p class="hidden text-[12px]/4 text-zinc-500 sm:block">Silvassa · procurement</p>
  </header>

  <main class="flex flex-1 items-center justify-center py-10">
    <div class="w-full max-w-md text-center">
      <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="file-question" class="size-5 text-zinc-600" aria-hidden="true"></i>
      </span>

      <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Error 404</p>
      <h1 tabindex="-1" class="mt-1 text-[20px]/7 font-semibold tracking-tight">This page does not exist</h1>
      <p class="mx-auto mt-2 max-w-md text-[14px]/5 text-zinc-600">
        Nothing is served at this address. PO-24-9910 was either cancelled before it was approved, or the link came from an email older than the numbering change, when Silvassa orders moved to the KIS/PO/24 series.
      </p>

      <p class="mt-4 inline-block max-w-full break-all rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-left text-[12px]/4">
        <span class="select-all font-mono text-zinc-600">/orders/PO-24-9910/</span>
      </p>

      <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a href="/orders/"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
          Back to purchase orders
        </a>
        <a href="mailto:it@konspec.com?subject=Broken%20link%20%2Forders%2FPO-24-9910%2F"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Report the link
        </a>
      </div>
    </div>
  </main>

  <footer class="border-t border-zinc-200 pt-4 text-center text-[11px]/4 text-zinc-500">
    Signed in as akshay.prabhu@konspec.com · IT support
    <a href="mailto:it@konspec.com" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">it@konspec.com</a>
    · ext 4102
  </footer>
</div>` },

      { id: '403', name: '403 permission denied', code:
`<!-- The record exists and this account may not open it, which is a different
     screen from the one that says nothing is there. It has to answer two
     questions or it is a dead end: which scope is closed, and who opens it. A
     name and a role, never "your administrator".

     Sending a 403 at all is a decision made per model, because a 403 admits the
     record exists. Where existence is itself confidential the handler returns
     404 and the user gets the not-found screen instead.

     The secondary route is the request for access, addressed to the person the
     paragraph just named, with the cost centre and the order already in the
     subject so the mail that arrives is actionable.

     The signed-in address is in the footer and it is doing real work here: on a
     shared terminal in QC the commonest cause of a 403 is that the last person
     never signed out, and the way out of that is the second link, not the
     first. -->
<div class="flex min-h-[560px] flex-col rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-5 text-[14px]/5 text-zinc-900">

  <header class="flex items-center justify-between gap-3">
    <a href="/" class="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[13px]/5 font-semibold text-white" aria-hidden="true">K</span>
      <span class="text-[14px]/5 font-semibold">Konspec Operations</span>
    </a>
    <p class="hidden text-[12px]/4 text-zinc-500 sm:block">Silvassa · procurement</p>
  </header>

  <main class="flex flex-1 items-center justify-center py-10">
    <div class="w-full max-w-md text-center">
      <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="lock" class="size-5 text-zinc-600" aria-hidden="true"></i>
      </span>

      <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Error 403</p>
      <h1 tabindex="-1" class="mt-1 text-[20px]/7 font-semibold tracking-tight">You cannot open this order</h1>
      <p class="mx-auto mt-2 max-w-md text-[14px]/5 text-zinc-600">
        PO-24-1187 belongs to the Fabrication cost centre. Your account reads Moulding and Dispatch only, so the order is there and it is not yours to open.
      </p>
      <p class="mx-auto mt-3 max-w-md text-[13px]/5 text-zinc-600">
        Read access to Fabrication is granted by Nilesh Patil, Head of Procurement, on the cost centre access form. It takes a working day.
      </p>

      <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a href="/orders/"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
          Back to your purchase orders
        </a>
        <a href="mailto:nilesh.patil@konspec.com?subject=Fabrication%20cost%20centre%20access%20%E2%80%94%20PO-24-1187"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Request Fabrication access
        </a>
      </div>
    </div>
  </main>

  <footer class="border-t border-zinc-200 pt-4 text-center text-[11px]/4 text-zinc-500">
    Signed in as akshay.prabhu@konspec.com ·
    <a href="/accounts/login/" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">sign in as someone else</a>
  </footer>
</div>` },

      { id: '500', name: '500 with a support reference', code:
`<!-- The reference code is the component. Everything else on this screen is
     apology; the code is the only part that makes the failure actionable, so it
     is tabular-nums, it is selectable, it has a copy button, and it is repeated
     in the support mailto for the user who copies nothing.

     It is minted in the handler and written to the log before the page renders.
     A code generated in the browser matches nothing on the server, which is
     worse than no code, because support then spends twenty minutes grepping for
     a string that was never logged.

     The second paragraph answers the question the user is actually asking:
     whether the receipt posted. Answer it as a fact or say it cannot be known
     and name the record to check. "Please try again" over an operation that
     half completed is how a plant books one delivery twice.

     Nothing about the internals reaches this page. The traceback is in the log
     beside the code.

     The copy button swaps its icon, which is announced by nothing, so the
     confirmation is an sr-only live region and the button's own name changes
     with it. Two spans with x-show, never a binding on the <i> — createIcons()
     replaces that node and takes the binding with it.

     The well is graphite and the tone is the glyph alone. A red screen for a
     failure that changed nothing makes a two-minute fault look like data loss. -->
<div class="flex min-h-[560px] flex-col rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-5 text-[14px]/5 text-zinc-900"
     x-data="{ done: false, t: null,
               copy() { navigator.clipboard?.writeText(this.$refs.ref.textContent.trim());
                        this.done = true;
                        clearTimeout(this.t);
                        this.t = setTimeout(() => this.done = false, 2000) } }">

  <header class="flex items-center justify-between gap-3">
    <a href="/" class="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[13px]/5 font-semibold text-white" aria-hidden="true">K</span>
      <span class="text-[14px]/5 font-semibold">Konspec Operations</span>
    </a>
  </header>

  <main class="flex flex-1 items-center justify-center py-10">
    <div class="w-full max-w-md text-center">
      <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="alert-circle" class="size-5 text-red-600" aria-hidden="true"></i>
      </span>

      <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Error 500</p>
      <h1 tabindex="-1" class="mt-1 text-[20px]/7 font-semibold tracking-tight">The goods receipt did not post</h1>
      <p class="mx-auto mt-2 max-w-md text-[14px]/5 text-zinc-600">
        Something on our side failed while writing GRN-24-0912. Nothing reached the item ledger and no stock moved, so the receipt can be entered again from the register against the same challan.
      </p>

      <div class="mx-auto mt-5 max-w-sm rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-left">
        <p class="text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Support reference</p>
        <div class="mt-1.5 flex items-center gap-2">
          <span x-ref="ref" class="min-w-0 flex-1 select-all break-all font-mono text-[13px]/5 font-medium tabular-nums">INC-2608-4471</span>
          <button type="button" @click="copy()" :aria-label="done ? 'Reference copied' : 'Copy the support reference'"
                  class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <span x-show="!done"><i data-lucide="copy" class="size-4 text-zinc-600" aria-hidden="true"></i></span>
            <span x-show="done" x-cloak><i data-lucide="check" class="size-4 text-emerald-600" aria-hidden="true"></i></span>
          </button>
          <span class="sr-only" aria-live="polite" x-text="done ? 'Reference copied' : ''"></span>
        </div>
        <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Logged 21 Aug 2026 at 14:07 IST. Quote it and IT opens the exact failure.</p>
      </div>

      <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a href="/grn/"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
          Back to goods receipts
        </a>
        <a href="mailto:it@konspec.com?subject=INC-2608-4471%20%E2%80%94%20goods%20receipt%20failed"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Email IT with this reference
        </a>
      </div>
    </div>
  </main>

  <footer class="border-t border-zinc-200 pt-4 text-center text-[11px]/4 text-zinc-500">
    IT support · it@konspec.com · ext 4102 · weekdays 08:00–20:00 IST
  </footer>
</div>` },

      { id: 'maintenance', name: '503 scheduled maintenance', code:
`<!-- Planned, so the screen states a window with a real end. "Back shortly" is
     what makes a plant supervisor phone IT; a clock time is what makes them
     wait.

     The absolute time is server-rendered into <time datetime> and the countdown
     is derived from it, not written in the markup twice. On a real page the
     init line is
       until = new Date($refs.back.dateTime).getTime()
     and nothing else changes; here it is offset from now so the preview does
     not go stale in a fortnight.

     The overrun branch is the half everybody forgets. Once the stated time
     passes the copy changes to say the work is running late and offers a check,
     rather than counting into negative numbers or freezing at zero — both of
     which read as a page that has stopped being maintained by anyone.

     Nothing reloads on a timer. A page that refreshes itself every thirty
     seconds while somebody is reading the window is a page they cannot finish
     reading.

     Say what is not affected. In a plant that is most of the operation: the
     weighbridge and the DCS do not go down with the console, and receipts taken
     on paper are keyed in afterwards against the same challan.

     The countdown is not a live region. Announcing a two-hour window every
     thirty seconds buries everything else on the screen. -->
<div class="flex min-h-[560px] flex-col rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-5 text-[14px]/5 text-zinc-900"
     x-data="{
       until: 0, left: '', late: false, checking: false,
       tick() {
         const ms = this.until - Date.now();
         this.late = ms <= 0;
         const m = Math.max(0, Math.round(ms / 60000));
         this.left = m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60) + ' min' : m + ' min';
       },
       check() { this.checking = true; setTimeout(() => this.checking = false, 1400) }
     }"
     x-init="until = Date.now() + 42 * 60000; tick(); setInterval(() => tick(), 30000);
             $nextTick(() => { $refs.back.dateTime = new Date(until).toISOString();
                               $refs.back.textContent = new Date(until).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST' })">

  <header class="flex items-center justify-between gap-3">
    <span class="inline-flex items-center gap-2.5">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[13px]/5 font-semibold text-white" aria-hidden="true">K</span>
      <span class="text-[14px]/5 font-semibold">Konspec Operations</span>
    </span>
    <p class="hidden text-[12px]/4 text-zinc-500 sm:block">Retry-After: 2520</p>
  </header>

  <main class="flex flex-1 items-center justify-center py-10">
    <div class="w-full max-w-md text-center">
      <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="wrench" class="size-5 text-zinc-600" aria-hidden="true"></i>
      </span>

      <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Error 503</p>
      <h1 tabindex="-1" class="mt-1 text-[20px]/7 font-semibold tracking-tight">Closed for the quarterly upgrade</h1>

      <p class="mx-auto mt-2 max-w-md text-[14px]/5 text-zinc-600" x-show="!late">
        The database is being upgraded. Everything posted before 01:00 is safe and nothing can be entered until the console is back.
      </p>
      <p class="mx-auto mt-2 max-w-md text-[14px]/5 text-zinc-600" x-show="late" x-cloak>
        The upgrade is running past its window. Nothing is lost and nothing can be entered yet — IT is on it, and the console comes back on its own.
      </p>

      <p class="mt-4 inline-block rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px]/4 tabular-nums text-zinc-600">
        Window 01:00–<time x-ref="back" datetime="2026-08-23T03:00:00+05:30" class="font-medium text-zinc-900">03:00 IST</time>
        <span x-show="!late"> · about <span class="font-medium text-zinc-900" x-text="left"></span> from now</span>
        <span x-show="late" x-cloak> · running late</span>
      </p>

      <p class="mx-auto mt-4 max-w-md text-[13px]/5 text-zinc-600">
        The Gate 2 weighbridge terminal and the plant DCS are not affected. Take receipts on paper against the delivery challan and key them in afterwards.
      </p>

      <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <!-- on a real page this is @click="location.reload()" -->
        <button type="button" @click="check()" :disabled="checking" :aria-busy="checking"
                class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
          <span x-show="checking" x-cloak class="flex size-4 animate-spin items-center justify-center"><i data-lucide="loader-circle" class="size-4" aria-hidden="true"></i></span>
          <span x-text="checking ? 'Checking' : 'Check again'">Check again</span>
        </button>
        <a href="tel:+912602640102"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Call the IT desk
        </a>
      </div>
    </div>
  </main>

  <footer class="border-t border-zinc-200 pt-4 text-center text-[11px]/4 text-zinc-500">
    Planned work KIS-CHG-2026-118 · notified 18 Aug to all plant heads
  </footer>
</div>` },

      { id: 'offline', name: 'Network failure, retried in place', code:
`<!-- The request never reached the server, so there is no status code to show
     and no incident for support to look up. What there is instead is a retry
     that resolves on this screen: press it, the button goes busy, the attempt
     count and the time of the last attempt update in place, and either the
     connection is back or the same screen says so again.

     The browser's own online event is a real signal and this screen listens to
     it. What it does not do is navigate when it fires: coming back online while
     somebody is reading enables the way back and says the connection returned.
     Reloading out from under them is how a person loses the sentence that told
     them what to do.

     The third paragraph exists because of the rule this screen depends on: a
     page holding unsaved input is never replaced with an error screen. If the
     user was typing, they are still on that page, looking at an alert. This
     screen is for a navigation that failed, so it can say plainly that nothing
     was being saved.

     This is the one variant that arrives by swap rather than by document load —
     nothing loaded, so nothing read a title. The message block carries
     role="alert" and x-init moves focus to the h1, which has tabindex="-1", so
     the heading is spoken and Tab restarts at the top of the message instead of
     wherever the abandoned page left it. -->
<div class="flex min-h-[560px] flex-col rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-5 text-[14px]/5 text-zinc-900"
     x-data="{
       state: 'offline', tries: 2, last: '14:07',
       retry() {
         this.state = 'checking';
         setTimeout(() => {
           this.tries++;
           this.last = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
           this.state = navigator.onLine ? 'online' : 'offline';
         }, 1200)
       }
     }"
     x-init="$nextTick(() => $refs.h1.focus())"
     @online.window="state = 'online'"
     @offline.window="state = 'offline'">

  <header class="flex items-center justify-between gap-3">
    <span class="inline-flex items-center gap-2.5">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[13px]/5 font-semibold text-white" aria-hidden="true">K</span>
      <span class="text-[14px]/5 font-semibold">Konspec Operations</span>
    </span>
  </header>

  <main class="flex flex-1 items-center justify-center py-10">
    <div class="w-full max-w-md text-center" role="alert">
      <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <span x-show="state !== 'online'"><i data-lucide="wifi-off" class="size-5 text-amber-700" aria-hidden="true"></i></span>
        <span x-show="state === 'online'" x-cloak><i data-lucide="wifi" class="size-5 text-emerald-600" aria-hidden="true"></i></span>
      </span>

      <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">No connection</p>
      <h1 x-ref="h1" tabindex="-1" class="mt-1 text-[20px]/7 font-semibold tracking-tight"
          x-text="state === 'online' ? 'The connection is back' : 'This page could not be reached'">This page could not be reached</h1>

      <p class="mx-auto mt-2 max-w-md text-[14px]/5 text-zinc-600" x-show="state !== 'online'">
        The browser could not reach operations.konspec.internal. The shop-floor Wi-Fi drops at the far end of the moulding bay; the wired points in QC and stores hold.
      </p>
      <p class="mx-auto mt-2 max-w-md text-[14px]/5 text-zinc-600" x-show="state === 'online'" x-cloak>
        The network is back. Open the receipt register again and carry on where you left off.
      </p>

      <p class="mx-auto mt-3 max-w-md text-[13px]/5 text-zinc-600">
        Nothing was being saved. This screen replaced a page you were reading, not a form you were filling — anything half-typed is still on the page it was typed into.
      </p>

      <p class="mt-4 text-[12px]/4 tabular-nums text-zinc-500">
        <span x-text="tries"></span> attempts · last at <span x-text="last"></span>
      </p>

      <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button type="button" @click="retry()" :disabled="state === 'checking'" :aria-busy="state === 'checking'"
                class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
          <span x-show="state === 'checking'" x-cloak class="flex size-4 animate-spin items-center justify-center"><i data-lucide="loader-circle" class="size-4" aria-hidden="true"></i></span>
          <span x-text="state === 'checking' ? 'Trying' : 'Try again'">Try again</span>
        </button>
        <a href="/grn/" x-show="state === 'online'" x-cloak
           class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Back to goods receipts
        </a>
      </div>
    </div>
  </main>

  <footer class="border-t border-zinc-200 pt-4 text-center text-[11px]/4 text-zinc-500">
    Wi-Fi faults go to the plant network desk on ext 4180, not to IT support
  </footer>
</div>` },

      { id: 'expired', name: 'Session expired', code:
`<!-- Not an error the user caused and not one support can help with, so the
     screen has exactly one job: get them signed in again and back to the page
     they were on. The primary action carries next, encoded, so the round trip
     ends where it started rather than on the dashboard.

     Encoding is not optional. A next holding a query string — a filtered
     register, a ledger scoped to a date range — loses everything after the
     first ampersand unencoded, and the user lands on an unfiltered list
     believing their filters were forgotten. The server then has to validate it
     as a same-origin relative path (Django has url_has_allowed_host_and_scheme
     for exactly this), or the login page will forward anyone who is sent a
     crafted link to any host on the internet.

     Say when it expired and say what that cost. Somebody who was typing wants
     to know whether it is still there, and it is not.

     Nothing redirects on its own. A five-second bounce to the sign-in page
     takes the explanation away before it has been read and lands a screen
     reader in the middle of a form it was never told about.

     The second link is the shared-terminal case, and on a plant floor it is the
     common one: the address in the message is not always the address of the
     person now standing at the screen. -->
<div class="flex min-h-[560px] flex-col rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-5 text-[14px]/5 text-zinc-900"
     x-data="{ next: '/grn/GRN-24-0912/?tab=lines' }">

  <header class="flex items-center justify-between gap-3">
    <span class="inline-flex items-center gap-2.5">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[13px]/5 font-semibold text-white" aria-hidden="true">K</span>
      <span class="text-[14px]/5 font-semibold">Konspec Operations</span>
    </span>
    <p class="hidden text-[12px]/4 text-zinc-500 sm:block">Session timeout 30 min</p>
  </header>

  <main class="flex flex-1 items-center justify-center py-10">
    <div class="w-full max-w-md text-center">
      <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="log-out" class="size-5 text-zinc-600" aria-hidden="true"></i>
      </span>

      <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Signed out</p>
      <h1 tabindex="-1" class="mt-1 text-[20px]/7 font-semibold tracking-tight">Your session has expired</h1>
      <p class="mx-auto mt-2 max-w-md text-[14px]/5 text-zinc-600">
        Konspec Operations signs you out after 30 minutes without activity. Yours ended at 14:02, so this request was made without a session behind it.
      </p>
      <p class="mx-auto mt-3 max-w-md text-[13px]/5 text-zinc-600">
        Signing in again returns you to GRN-24-0912. Anything typed into that screen and not saved has gone with the session.
      </p>

      <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a :href="'/accounts/login/?next=' + encodeURIComponent(next)"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
          Sign in and go back to GRN-24-0912
        </a>
        <a href="/accounts/login/"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Sign in as someone else
        </a>
      </div>
    </div>
  </main>

  <footer class="border-t border-zinc-200 pt-4 text-center text-[11px]/4 text-zinc-500">
    The expired session belonged to akshay.prabhu@konspec.com · shared terminals sign out after 5 minutes
  </footer>
</div>` },

      { id: 'django', name: 'Django handler templates', code:
`<!-- templates/404.html, and the shape 403.html takes as well. Three things
     make these files different from every other template in the project.

     They do not {% extends "base.html" %}. base.html reads the nav, the counts
     and the signed-in user out of context, and the request that just failed may
     have none of it; a base that raises while rendering the error page drops
     the user on Django's own bare page instead. So each handler is a whole
     document with its own <head>:

       <title>Page not found · Konspec Operations</title>

     The failure leads the title, because on a document load that string is the
     announcement — the h1 is only read once somebody navigates to it.

     What context each one gets differs, and it is the trap. page_not_found
     renders with the request and passes {{ request_path }}; permission_denied
     passes {{ exception }}, which is whatever string the raising view typed and
     is written for a log, so it is never printed raw. server_error is
     template.render() with no context and no request at all: no context
     processors run, {{ user.email }} and {{ request.path }} both come out as
     empty strings, and the incident id cannot be templated. Either every value
     on 500.html is literal, or you register your own handler500 that renders
     with a context of its own. Tags do not need context, so {% url %} and
     {% static %} keep working in all three — which is what keeps the way back
     from being a hard-coded path.

     And none of them render at all until DEBUG is False, which is why they are
     the templates that ship broken. -->
<div class="flex min-h-[560px] flex-col rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-5 text-[14px]/5 text-zinc-900">

  <header class="flex items-center gap-2.5">
    <a href="{% url 'dashboard' %}" class="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[13px]/5 font-semibold text-white" aria-hidden="true">K</span>
      <span class="text-[14px]/5 font-semibold">Konspec Operations</span>
    </a>
  </header>

  <main class="flex flex-1 items-center justify-center py-10">
    <div class="w-full max-w-md text-center">
      <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="file-question" class="size-5 text-zinc-600" aria-hidden="true"></i>
      </span>

      <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Error 404</p>
      <h1 tabindex="-1" class="mt-1 text-[20px]/7 font-semibold tracking-tight">This page does not exist</h1>
      <p class="mx-auto mt-2 max-w-md text-[14px]/5 text-zinc-600">
        Nothing is served at this address. The record may have been cancelled, or the link may be older than the last change to the numbering series.
      </p>

      {# request_path is already URL-quoted by page_not_found; escape it anyway and never mark it safe #}
      <p class="mt-4 inline-block max-w-full break-all rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-left text-[12px]/4">
        <span class="select-all font-mono text-zinc-600">{{ request_path }}</span>
      </p>

      <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a href="{% url 'orders:list' %}"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
          Back to purchase orders
        </a>
        <a href="mailto:it@konspec.com?subject=Broken%20link"
           class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Report the link
        </a>
      </div>
    </div>
  </main>

  {# on 500.html this whole footer is literal text: no user, no context, no variables #}
  <footer class="border-t border-zinc-200 pt-4 text-center text-[11px]/4 text-zinc-500">
    {% if user.is_authenticated %}Signed in as {{ user.email }} · {% endif %}IT support · it@konspec.com · ext 4102
  </footer>
</div>` }
    ]
  }
);
