register(
  {
    id: 'app-shell', name: 'App shell', category: 'layout',
    description: 'The page skeleton: collapsible sidebar, topbar, and a single scrolling main column. Everything else in the app is rendered inside the main column.',
    when: 'Every signed-in page. Auth and error pages are the only screens that do not use it.',
    notes: [
      'The collapse control puts its icon in a fixed 68px box at the left of a full-width strip, so the icon centre is at the same coordinates expanded and collapsed. Do not centre the icon in the strip — the second click misses when the sidebar narrows.',
      'The collapsed rail is 68px so a 40px hit area still has 14px of padding either side. Labels hide with lg:hidden, they are not removed from the DOM.',
      'Rotation goes on a wrapping <span>, never on <i data-lucide>. Lucide replaces the <i> with an <svg> and any binding on it dies.',
      'Sidebar state persists under the localStorage key kon-sidebar. The [ shortcut is ignored while focus is in an input, textarea or select.',
      'Only the <main> scrolls. The shell root is h-[640px] here so it previews in a box — as a real page put h-screen overflow-hidden on <body> and drop the wrapper border.',
      'Below lg the sidebar is off-canvas with a backdrop; the topbar menu button is the only way to open it, so never hide that button on mobile.'
    ],
    anatomy: [
      ['Sidebar', '255px expanded, a 68px rail collapsed. Off-canvas with a backdrop below lg.'],
      ['Collapse control', 'A full-width strip whose icon sits in a fixed 68px box at the left, so the aim point does not move between states.'],
      ['Topbar', 'Search, notifications, account, and the menu button that is the only way to open the sidebar on a phone.'],
      ['Main', 'The single scrolling column. Everything else in the application renders inside it.'],
      ['Backdrop', 'Below lg only, dimming the main column while the off-canvas sidebar is open.']
    ],
    behaviour: [
      'Only <main> scrolls. The shell itself is a fixed-height flex frame, so the sidebar and topbar never move.',
      'The collapse control keeps its icon at identical coordinates in both states — a control that moves out from under the cursor feels broken even when every click lands.',
      'Collapsed labels hide with lg:hidden rather than being removed, so the DOM and the tab order do not change shape.',
      'Sidebar state persists under the localStorage key kon-sidebar, so it survives a reload.',
      'The [ shortcut toggles the sidebar, and is ignored while focus is in an input, textarea or select.',
      'Below lg the sidebar is off-canvas over a backdrop, which is why the topbar menu button must never be hidden on mobile.'
    ],
    a11y: [
      'The sidebar is a <nav> with an accessible name, so it can be skipped as a landmark.',
      'The collapse control is a real button with aria-expanded reflecting the state.',
      'Collapsed items keep an accessible name even with the label visually hidden, or the rail becomes a column of unnamed icons.',
      'The off-canvas sidebar traps focus while open on mobile and returns it to the menu button on close.',
      'A skip link to <main> comes first in the DOM, so the keyboard is not walked through the whole nav on every page.'
    ],
    related: ['sidebar-nav', 'topbar', 'page-header'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div class="relative flex h-[640px] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 text-[14px]/5 text-zinc-900"
     x-data="{ sidebar: true, nav: false }"
     x-init="sidebar = localStorage.getItem('kon-sidebar') !== '0';
             $watch('sidebar', v => localStorage.setItem('kon-sidebar', v ? '1' : '0'))"
     @keydown.escape.window="nav = false"
     @keydown.window="if ($event.key === '[' && !/^(input|textarea|select)$/i.test($event.target.tagName)) sidebar = !sidebar">

  <!-- sidebar -->
  <aside class="absolute inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-zinc-200 bg-white transition-all duration-200 lg:static lg:translate-x-0"
         :class="[ sidebar ? 'w-64' : 'w-64 lg:w-[68px]', nav ? 'translate-x-0' : '-translate-x-full' ]">

    <div class="flex h-14 shrink-0 items-center gap-2.5 px-4">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-[13px]/5 font-semibold text-white">K</span>
      <span class="min-w-0 flex-1 truncate text-[16px]/6 font-semibold" :class="!sidebar && 'lg:hidden'">Konspec Operations</span>
      <button @click="nav = false" aria-label="Close navigation" class="rounded-md p-1 text-zinc-600 hover:bg-zinc-100 lg:hidden">
        <i data-lucide="x" class="size-4"></i>
      </button>
    </div>

    <div class="px-3 pb-3">
      <button class="flex w-full items-center gap-2.5 rounded-lg bg-zinc-700 px-3 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800"
              :class="!sidebar && 'lg:justify-center lg:px-0'">
        <i data-lucide="plus" class="size-4 shrink-0"></i><span :class="!sidebar && 'lg:hidden'">New purchase order</span>
      </button>
    </div>

    <nav class="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3">
      <p class="px-2 pb-1 pt-2 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500" :class="!sidebar && 'lg:hidden'">Procurement</p>

      <a href="#" aria-current="page" class="group relative flex min-h-9 items-center gap-3 rounded-lg bg-zinc-100 px-2.5 py-2 text-[13px]/5 font-medium text-zinc-900"
         :class="!sidebar && 'lg:justify-center lg:px-0'">
        <i data-lucide="layout-dashboard" class="size-[18px] shrink-0"></i>
        <span class="flex-1 truncate" :class="!sidebar && 'lg:hidden'">Overview</span>
        <span x-show="!sidebar" class="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px]/4 text-white group-hover:lg:block">Overview</span>
      </a>
      <a href="#" class="group relative flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
         :class="!sidebar && 'lg:justify-center lg:px-0'">
        <i data-lucide="file-text" class="size-[18px] shrink-0"></i>
        <span class="flex-1 truncate" :class="!sidebar && 'lg:hidden'">Purchase orders</span>
        <span class="rounded-full bg-white px-1.5 text-[11px]/4 tabular-nums text-zinc-600 ring-1 ring-zinc-200" :class="!sidebar && 'lg:hidden'">148</span>
        <span x-show="!sidebar" class="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px]/4 text-white group-hover:lg:block">Purchase orders</span>
      </a>
      <a href="#" class="group relative flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
         :class="!sidebar && 'lg:justify-center lg:px-0'">
        <i data-lucide="clipboard-list" class="size-[18px] shrink-0"></i>
        <span class="flex-1 truncate" :class="!sidebar && 'lg:hidden'">Requisitions</span>
        <span class="rounded-full bg-white px-1.5 text-[11px]/4 tabular-nums text-zinc-600 ring-1 ring-zinc-200" :class="!sidebar && 'lg:hidden'">62</span>
        <span x-show="!sidebar" class="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px]/4 text-white group-hover:lg:block">Requisitions</span>
      </a>
      <a href="#" class="group relative flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
         :class="!sidebar && 'lg:justify-center lg:px-0'">
        <i data-lucide="truck" class="size-[18px] shrink-0"></i>
        <span class="flex-1 truncate" :class="!sidebar && 'lg:hidden'">Goods receipt</span>
        <span class="rounded-full bg-white px-1.5 text-[11px]/4 tabular-nums text-zinc-600 ring-1 ring-zinc-200" :class="!sidebar && 'lg:hidden'">27</span>
        <span x-show="!sidebar" class="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px]/4 text-white group-hover:lg:block">Goods receipt</span>
      </a>

      <p class="px-2 pb-1 pt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500" :class="!sidebar && 'lg:hidden'">Master data</p>

      <a href="#" class="group relative flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
         :class="!sidebar && 'lg:justify-center lg:px-0'">
        <i data-lucide="building-2" class="size-[18px] shrink-0"></i>
        <span class="flex-1 truncate" :class="!sidebar && 'lg:hidden'">Vendors</span>
        <span class="rounded-full bg-white px-1.5 text-[11px]/4 tabular-nums text-zinc-600 ring-1 ring-zinc-200" :class="!sidebar && 'lg:hidden'">187</span>
        <span x-show="!sidebar" class="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px]/4 text-white group-hover:lg:block">Vendors</span>
      </a>
      <a href="#" class="group relative flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
         :class="!sidebar && 'lg:justify-center lg:px-0'">
        <i data-lucide="package" class="size-[18px] shrink-0"></i>
        <span class="flex-1 truncate" :class="!sidebar && 'lg:hidden'">Materials</span>
        <span x-show="!sidebar" class="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px]/4 text-white group-hover:lg:block">Materials</span>
      </a>
      <a href="#" class="group relative flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
         :class="!sidebar && 'lg:justify-center lg:px-0'">
        <i data-lucide="scale" class="size-[18px] shrink-0"></i>
        <span class="flex-1 truncate" :class="!sidebar && 'lg:hidden'">Rate contracts</span>
        <span x-show="!sidebar" class="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px]/4 text-white group-hover:lg:block">Rate contracts</span>
      </a>
    </nav>

    <div class="shrink-0 border-t border-zinc-200">
      <button class="flex w-full items-center gap-2.5 px-3 py-3 text-left hover:bg-zinc-100" :class="!sidebar && 'lg:justify-center lg:px-0'">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[11px]/4 font-semibold text-zinc-900">AP</span>
        <span class="min-w-0 flex-1" :class="!sidebar && 'lg:hidden'">
          <span class="block truncate text-[13px]/5 font-medium">Akshay Prabhu</span>
          <span class="block truncate text-[11px]/4 text-zinc-500">Level 2 approver</span>
        </span>
      </button>

      <!-- the icon sits in a 68px box, so its centre does not move when the rail narrows -->
      <button @click="sidebar = !sidebar" aria-label="Toggle sidebar"
              :title="sidebar ? 'Collapse sidebar  [' : 'Expand sidebar  ['"
              class="hidden h-11 w-full items-center border-t border-zinc-200 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 lg:flex">
        <span class="flex h-11 w-[68px] shrink-0 items-center justify-center">
          <span class="flex transition-transform" :class="!sidebar && 'rotate-180'"><i data-lucide="chevrons-left" class="size-4"></i></span>
        </span>
        <span class="flex-1 text-left" :class="!sidebar && 'lg:hidden'">Collapse</span>
        <kbd class="mr-3 rounded border border-zinc-200 bg-zinc-100 px-1.5 text-[11px]/4 text-zinc-500" :class="!sidebar && 'lg:hidden'">[</kbd>
      </button>
    </div>
  </aside>

  <div x-show="nav" x-cloak @click="nav = false" class="absolute inset-0 z-30 bg-zinc-900/40 lg:hidden"></div>

  <!-- main column -->
  <div class="flex min-w-0 flex-1 flex-col">
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3 lg:px-5">
      <button @click="nav = true" aria-label="Open navigation"
              class="-ml-1 flex size-10 shrink-0 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden">
        <i data-lucide="menu" class="size-5"></i>
      </button>
      <nav aria-label="Breadcrumb" class="hidden items-center gap-1.5 text-[13px]/5 text-zinc-600 sm:flex">
        <a href="#" class="hover:text-zinc-900">Procurement</a><span class="text-zinc-500">/</span><span class="font-medium text-zinc-900">Overview</span>
      </nav>
      <div class="ml-auto flex items-center gap-2">
        <div class="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15 md:flex">
          <i data-lucide="search" class="size-4 text-zinc-600"></i>
          <input aria-label="Search" placeholder="Search orders, vendors, materials" class="w-40 bg-transparent text-[13px]/5 outline-none placeholder:text-zinc-500 xl:w-64">
        </div>
        <button aria-label="Notifications" class="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="bell" class="size-[18px]"></i>
          <span class="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-600 ring-2 ring-white"></span>
        </button>
        <button class="flex size-8 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[11px]/4 font-semibold text-zinc-900">AP</button>
      </div>
    </header>

    <main class="min-h-0 flex-1 overflow-auto">
      <div class="mx-auto max-w-[1600px] space-y-4 p-4 pb-16 lg:p-6">
        <div>
          <h1 class="text-[24px]/7 font-semibold tracking-tight">Procurement overview</h1>
          <p class="mt-1 text-[13px]/5 text-zinc-600">Live commitments, receipts and vendor performance · FY 2026–27</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-zinc-200 bg-white p-4">
            <p class="text-[13px]/5 text-zinc-600">Open commitment</p>
            <p class="mt-2 text-[24px]/7 font-semibold tracking-tight tabular-nums">₹1,66,40,000</p>
            <p class="mt-2 text-[12px]/4 text-zinc-500">Across 148 purchase orders</p>
          </div>
          <div class="rounded-xl border border-zinc-200 bg-white p-4">
            <p class="text-[13px]/5 text-zinc-600">Awaiting GRN</p>
            <p class="mt-2 text-[24px]/7 font-semibold tracking-tight tabular-nums">27</p>
            <p class="mt-2 text-[12px]/4 text-zinc-500">9 past the promised date</p>
          </div>
          <div class="rounded-xl border border-zinc-200 bg-white p-4">
            <p class="text-[13px]/5 text-zinc-600">Pending my approval</p>
            <p class="mt-2 text-[24px]/7 font-semibold tracking-tight tabular-nums">4</p>
            <p class="mt-2 text-[12px]/4 text-zinc-500">Oldest raised 3 days ago</p>
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
    description: 'The top block of a page: where it sits in the app, what it is, and what you can do to it. One h1 per page and it lives here.',
    when: 'Every page inside the app shell. Skip the breadcrumb only on top-level pages that have no parent.',
    notes: [
      'Exactly one primary button. Everything else is secondary or a menu.',
      'Actions wrap below the title on narrow screens — never scroll them sideways or hide them behind a menu on mobile only.',
      'Tabs change what is shown on the same record. If a tab loads a different record, it is navigation and belongs in the sidebar.'
    ],
    anatomy: [
      ['Breadcrumb', 'Where this page sits. Omitted only on top-level pages that have no parent.'],
      ['Title', 'The one h1 on the page. It lives here and nowhere else.'],
      ['Meta', 'Status, reference number, amount — what identifies this record at a glance.'],
      ['Actions', 'Exactly one primary button; everything else secondary or inside a menu.'],
      ['Tabs', 'Optional, and only for views of the same record. A tab that loads a different record is navigation.']
    ],
    behaviour: [
      'One h1 per page, and this is it. Cards below use h2 and h3.',
      'Actions wrap below the title on narrow screens. They are never scrolled sideways and never hidden behind a menu on mobile only.',
      'Tabs change what is shown about the same record. If a tab loads a different record it belongs in the sidebar.',
      'The header does not stick. On a long record the actions are repeated at the bottom of the form instead.',
      'Meta values use tabular-nums so a header does not shift as the record\'s amount changes.'
    ],
    a11y: [
      'The title is a real h1, giving the page a single unambiguous top-level heading.',
      'The breadcrumb is a <nav> with aria-label="Breadcrumb" and marks the current page with aria-current.',
      'Tabs are a tablist with roles and arrow-key movement, not a row of styled links.',
      'The action cluster reads in the same order it is drawn, so the primary action is not announced first by accident.',
      'Status in the meta line is text as well as colour.'
    ],
    related: ['breadcrumbs', 'tabs', 'app-shell'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div class="flex flex-wrap items-end justify-between gap-4">
  <div class="min-w-0">
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
      <a href="#" class="hover:text-zinc-900">Procurement</a>
      <span class="text-zinc-500">/</span>
      <a href="#" class="hover:text-zinc-900">Purchase orders</a>
      <span class="text-zinc-500">/</span>
      <span class="font-medium text-zinc-900">PO-24-1187</span>
    </nav>
    <h1 class="mt-1.5 text-[24px]/7 font-semibold tracking-tight">Sharma Steel &amp; Alloys</h1>
    <p class="mt-1 text-[13px]/5 text-zinc-600">PO-24-1187 · raised 04 Aug 2026 by Akshay Prabhu · Fabrication</p>
  </div>
  <div class="flex flex-wrap items-center gap-2">
    <button class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
      <i data-lucide="printer" class="size-4"></i>Print
    </button>
    <button class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
      <i data-lucide="pencil" class="size-4"></i>Amend
    </button>
    <button class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
      <i data-lucide="truck" class="size-4"></i>Record GRN
    </button>
  </div>
</div>` },
      { id: 'tabs', name: 'With tabs', code:
`<div class="border-b border-zinc-200" x-data="{ tab: 'lines' }">
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="min-w-0">
      <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
        <a href="#" class="hover:text-zinc-900">Master data</a>
        <span class="text-zinc-500">/</span>
        <span class="font-medium text-zinc-900">Gujarat Polymers Ltd</span>
      </nav>
      <h1 class="mt-1.5 flex items-center gap-2.5 text-[24px]/7 font-semibold tracking-tight">
        Gujarat Polymers Ltd
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700">
          <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Approved vendor
        </span>
      </h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">V-0412 · GSTIN 24AACCG1234F1ZP · Vapi, Gujarat</p>
    </div>
    <button class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
      <i data-lucide="plus" class="size-4"></i>New order
    </button>
  </div>

  <div class="-mb-px mt-4 flex gap-1 overflow-x-auto">
    <button @click="tab = 'lines'" class="shrink-0 border-b-2 px-3 py-2.5 text-[13px]/5"
            :class="tab === 'lines' ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">Open orders</button>
    <button @click="tab = 'rates'" class="flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-[13px]/5"
            :class="tab === 'rates' ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">
      Rate contracts <span class="rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-1.5 text-[11px]/4 tabular-nums text-zinc-700">6</span>
    </button>
    <button @click="tab = 'grn'" class="shrink-0 border-b-2 px-3 py-2.5 text-[13px]/5"
            :class="tab === 'grn' ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">Receipts</button>
    <button @click="tab = 'docs'" class="shrink-0 border-b-2 px-3 py-2.5 text-[13px]/5"
            :class="tab === 'docs' ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">Documents</button>
  </div>
</div>` },
      { id: 'filters', name: 'With filters and count', code:
`<div>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="min-w-0">
      <h1 class="text-[24px]/7 font-semibold tracking-tight">Purchase orders</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">Every order raised against a Konspec plant or project</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
        <i data-lucide="download" class="size-4"></i>Export
      </button>
      <button class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
        <i data-lucide="plus" class="size-4"></i>New order
      </button>
    </div>
  </div>

  <div class="mt-4 flex flex-wrap items-center gap-2">
    <span class="flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 py-1 pl-3 pr-1.5 text-[12px]/4 font-medium">
      Status: Overdue
      <button aria-label="Remove status filter" class="rounded-full p-0.5 text-zinc-600 hover:bg-white hover:text-zinc-900"><i data-lucide="x" class="size-3"></i></button>
    </span>
    <span class="flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 py-1 pl-3 pr-1.5 text-[12px]/4 font-medium">
      Plant: Silvassa
      <button aria-label="Remove plant filter" class="rounded-full p-0.5 text-zinc-600 hover:bg-white hover:text-zinc-900"><i data-lucide="x" class="size-3"></i></button>
    </span>
    <span class="flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 py-1 pl-3 pr-1.5 text-[12px]/4 font-medium">
      Value over ₹5,00,000
      <button aria-label="Remove value filter" class="rounded-full p-0.5 text-zinc-600 hover:bg-white hover:text-zinc-900"><i data-lucide="x" class="size-3"></i></button>
    </span>
    <button class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Clear all</button>
    <span class="ml-auto text-[12px]/4 tabular-nums text-zinc-600">34 of 148 orders · ₹2,18,64,500</span>
  </div>
</div>` }
    ]
  },

  {
    id: 'card', name: 'Card', category: 'layout',
    description: 'A bordered white panel that groups one thing. A header row names it, the body holds the content, and an optional footer carries totals or actions.',
    when: 'Grouping related content on a page. Do not nest cards — if a card needs sections inside it, use dividers.',
    notes: [
      'Panels are rounded-xl; controls inside them stay rounded-lg. A card inside a card is always a layout mistake.',
      'Card padding is px-5 py-4 for the header and px-5 py-4 for the body. Tables sit flush with no body padding at all, so the header row and the borders line up.',
      'Shadows are for things floating over the page — menus, popovers, modals. A card on the page uses a border, never a shadow.'
    ],
    anatomy: [
      ['Panel', 'rounded-xl, white, with a zinc-200 border. Never a shadow — shadows are for things floating over the page.'],
      ['Header', 'px-5 py-4 with the title and any header action, on a bordered strip.'],
      ['Body', 'px-5 py-4. A table sits flush with no body padding at all, so its borders line up with the card\'s.'],
      ['Divider', 'border-zinc-100 between sections inside a card that already has a border.'],
      ['Footer', 'Totals or actions on a zinc-100 strip, separated by a top border.']
    ],
    behaviour: [
      'Cards do not nest. If a card needs sections inside it, those are dividers.',
      'Panels are rounded-xl and controls inside them stay rounded-lg, so the shapes stay in a hierarchy.',
      'A card holding a table drops its body padding entirely, or the table\'s rules stop meeting the card\'s edges.',
      'The header stays present even when the card holds one thing — an unnamed panel is hard to refer to.',
      'Card height is driven by content. Forcing equal heights across a row leaves dead space that reads as missing data.'
    ],
    a11y: [
      'The card title is a heading at the level the page outline implies, usually h2 or h3.',
      'A card is a section, not a landmark, so it does not need a role — the heading is what makes it navigable.',
      'A clickable card makes the whole panel the link rather than only the title.',
      'Dividers are borders, not <hr>, so they are not announced as separators inside a list of fields.',
      'Footer actions are inside the card in the DOM as well as visually, so their context is clear.'
    ],
    related: ['stat-card', 'table', 'page-header'],
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
      <button class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">Download all</button>
      <button class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
        <i data-lucide="upload" class="size-4"></i>Attach
      </button>
    </div>
  </div>
  <ul class="divide-y divide-zinc-100">
    <li class="flex items-center gap-3 px-5 py-3">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-[13px]/5 font-medium">quotation-sharma-aug.pdf</span>
        <span class="block text-[11px]/4 text-zinc-500">248 KB · uploaded 04 Aug by Akshay Prabhu</span>
      </span>
      <a href="#" class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">View</a>
    </li>
    <li class="flex items-center gap-3 px-5 py-3">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="ruler" class="size-4 text-zinc-600"></i></span>
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
</div>` }
    ]
  },

  {
    id: 'list-detail', name: 'List and detail', category: 'layout',
    description: 'A scrolling list on the left and the selected record on the right. Picking a row swaps the right pane without leaving the page.',
    when: 'Triage work where you read many records in a row — approvals, receipts, open orders. Use a plain table instead when people come to compare rows, not to work through them.',
    notes: [
      'Below lg only one pane is on screen. Bind both panes with :class rather than x-show — x-show writes an inline display:none that beats lg:block, so the detail pane would never come back on a wide screen.',
      'The Back button is the only way out of the detail on mobile. Keep it lg:hidden and keep it first in the detail header.',
      'The list pane gets its own max-h and overflow-y-auto so it scrolls independently of the page.',
      'Selecting a row must not change the page URL for the list. If the detail deserves its own URL, this is two pages, not this pattern.'
    ],
    anatomy: [
      ['List pane', 'Left, with its own max-h and overflow-y-auto so it scrolls independently of the page.'],
      ['Row', 'One record, tinted zinc-100 when it is the selected one.'],
      ['Detail pane', 'Right, showing the selected record in full.'],
      ['Back button', 'lg:hidden and first in the detail header. On mobile it is the only way out of the detail.'],
      ['Selection state', 'The selected id on the component root; both panes bind to it.']
    ],
    behaviour: [
      'Picking a row swaps the right pane without leaving the page, which is the whole reason to choose this over a table.',
      'Below lg only one pane is on screen at a time and the Back button returns to the list.',
      'Both panes bind with :class, never x-show — x-show writes an inline display:none that beats lg:block, so the detail pane would never come back on a wide screen.',
      'Selecting a row does not change the URL. If the detail deserves its own URL, this is two pages and not this pattern.',
      'The list keeps its scroll position when the detail changes, so working down a queue does not reset it.'
    ],
    a11y: [
      'Rows are buttons or links, not clickable divs, so the list is walkable by keyboard.',
      'The selected row carries aria-current, so position is announced and not only tinted.',
      'Choosing a row moves focus into the detail pane on mobile, where the list is no longer visible.',
      'The Back button is a real button with a text label, not a bare chevron.',
      'The detail pane is a labelled region so it can be jumped to directly.'
    ],
    related: ['table', 'drawer', 'app-shell'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white"
     x-data="{
       sel: 0,
       detail: false,
       orders: [
         { po: 'PO-24-1187', vendor: 'Sharma Steel &amp; Alloys', dept: 'Fabrication', value: '₹18,42,000', lines: 9, due: '22 Aug', raised: '04 Aug 2026', status: 'Overdue', pct: 62, buyer: 'Akshay Prabhu', grn: '4 of 9 lines received' },
         { po: 'PO-24-1191', vendor: 'Gujarat Polymers Ltd', dept: 'Moulding', value: '₹7,15,600', lines: 4, due: '28 Aug', raised: '07 Aug 2026', status: 'Open', pct: 25, buyer: 'Meera Joshi', grn: '1 of 4 lines received' },
         { po: 'PO-24-1194', vendor: 'Deccan Bearings Pvt Ltd', dept: 'Maintenance', value: '₹2,84,300', lines: 12, due: '01 Sep', raised: '09 Aug 2026', status: 'Approved', pct: 0, buyer: 'Akshay Prabhu', grn: 'Nothing received yet' },
         { po: 'PO-24-1198', vendor: 'Konkan Packaging Co', dept: 'Dispatch', value: '₹1,09,750', lines: 3, due: '18 Aug', raised: '11 Aug 2026', status: 'Closed', pct: 100, buyer: 'Nilesh Patil', grn: 'All 3 lines received' }
       ]
     }">
  <div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">

    <!-- list pane -->
    <div class="min-w-0 border-zinc-200 lg:border-r" :class="detail ? 'hidden lg:block' : 'block'">
      <div class="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
        <div class="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <i data-lucide="search" class="size-4 shrink-0 text-zinc-600"></i>
          <input aria-label="Search orders" placeholder="Search orders or vendors" class="w-full bg-transparent text-[13px]/5 outline-none placeholder:text-zinc-500">
        </div>
        <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">4 open</span>
      </div>

      <div class="max-h-[460px] overflow-y-auto">
        <template x-for="(o, i) in orders" :key="o.po">
          <button @click="sel = i; detail = true"
                  class="flex w-full gap-3 border-b border-zinc-100 px-4 py-3 text-left hover:bg-zinc-100"
                  :class="sel === i && 'bg-zinc-100/70 shadow-[inset_3px_0_0_0_var(--color-zinc-700)]'">
            <span class="mt-1.5 size-2 shrink-0 rounded-full"
                  :class="{ 'bg-red-600': o.status === 'Overdue', 'bg-zinc-500': o.status === 'Open', 'bg-amber-500': o.status === 'Approved', 'bg-emerald-600': o.status === 'Closed' }"></span>
            <span class="min-w-0 flex-1">
              <span class="flex items-baseline justify-between gap-2">
                <span class="truncate text-[14px]/5 font-medium" x-text="o.vendor"></span>
                <span class="shrink-0 text-[13px]/5 font-medium tabular-nums" x-text="o.value"></span>
              </span>
              <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-600" x-text="o.po + ' · ' + o.lines + ' lines · ' + o.dept"></span>
              <span class="mt-1.5 flex items-center gap-2">
                <!-- one class for every state; the colour is already in the dot above -->
                <span class="rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300"
                      x-text="o.status"></span>
                <span class="text-[11px]/4 text-zinc-500" x-text="'due ' + o.due"></span>
              </span>
            </span>
          </button>
        </template>
      </div>
    </div>

    <!-- detail pane -->
    <div class="min-w-0" :class="detail ? 'block' : 'hidden lg:block'">
      <div class="border-b border-zinc-200 px-5 py-4">
        <button @click="detail = false" class="mb-3 flex items-center gap-1.5 text-[13px]/5 font-medium text-zinc-600 hover:text-zinc-900 lg:hidden">
          <i data-lucide="chevron-left" class="size-4"></i>Back to orders
        </button>
        <p class="text-[12px]/4 tabular-nums text-zinc-600" x-text="orders[sel].po"></p>
        <h3 class="mt-0.5 text-[16px]/6 font-semibold" x-text="orders[sel].vendor"></h3>
        <p class="mt-0.5 text-[12px]/4 text-zinc-600" x-text="orders[sel].dept + ' · raised ' + orders[sel].raised + ' by ' + orders[sel].buyer"></p>
        <div class="mt-3 flex gap-2">
          <button class="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Open full record</button>
          <button class="flex-1 rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Record GRN</button>
        </div>
      </div>

      <div class="grid grid-cols-3 divide-x divide-zinc-200 border-b border-zinc-200 text-center">
        <div class="px-2 py-3"><p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Value</p><p class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="orders[sel].value"></p></div>
        <div class="px-2 py-3"><p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Lines</p><p class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="orders[sel].lines"></p></div>
        <div class="px-2 py-3"><p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Due</p><p class="mt-1 text-[13px]/5 font-semibold tabular-nums" x-text="orders[sel].due"></p></div>
      </div>

      <div class="border-b border-zinc-200 px-5 py-4">
        <div class="flex items-center justify-between text-[12px]/4">
          <span class="text-zinc-600" x-text="orders[sel].grn"></span>
          <span class="font-medium tabular-nums" x-text="orders[sel].pct + '%'"></span>
        </div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
          <div class="h-full rounded-full bg-zinc-700 transition-all" :style="'width:' + orders[sel].pct + '%'"></div>
        </div>
      </div>

      <div class="px-5 py-4">
        <p class="text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Line items</p>
        <table class="mt-3 w-full text-left text-[13px]/5">
          <thead class="text-[11px]/4 uppercase tracking-wider text-zinc-500">
            <tr>
              <th scope="col" class="pb-2 font-medium">Material</th>
              <th scope="col" class="pb-2 text-right font-medium">Qty</th>
              <th scope="col" class="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-zinc-100"><td class="py-2">MS Angle 50×50×6</td><td class="py-2 text-right tabular-nums text-zinc-600">420 kg</td><td class="py-2 text-right font-medium tabular-nums">₹26,208</td></tr>
            <tr class="border-t border-zinc-100"><td class="py-2">MS Plate 8 mm</td><td class="py-2 text-right tabular-nums text-zinc-600">180 kg</td><td class="py-2 text-right font-medium tabular-nums">₹12,798</td></tr>
            <tr class="border-t border-zinc-100"><td class="py-2">Hex bolt M12×60</td><td class="py-2 text-right tabular-nums text-zinc-600">1,200 nos</td><td class="py-2 text-right font-medium tabular-nums">₹14,220</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'form-page', name: 'Form page', category: 'layout',
    description: 'The layout a create or edit screen uses: fields in a card, and the Save and Cancel actions where the user can always reach them.',
    when: 'Any create or edit screen with more than about four fields. A short form belongs in a modal instead.',
    notes: [
      'Save is on the right, Cancel to its left. Never put a destructive action in the same cluster — delete lives on the record, not in the editor.',
      'The sticky footer needs a solid bg-white and a top border, otherwise fields scroll under it and read as clipped.',
      'Two columns are for short related fields. Anything long — descriptions, addresses, line tables — spans both with sm:col-span-2.',
      'The side rail is context, never a control. If the user has to act on it, it belongs in the form.'
    ],
    anatomy: [
      ['Header', 'The page title and what is being edited.'],
      ['Field grid', 'Two columns for short related fields; anything long spans both with sm:col-span-2.'],
      ['Side rail', 'Context only — who raised it, when, what it links to. Never a control.'],
      ['Sticky footer', 'Save and Cancel, on a solid white bar with a top border so fields do not read as clipped beneath it.'],
      ['Error summary', 'Above the fields when a submit fails, linking to each field that needs attention.']
    ],
    behaviour: [
      'Save sits right with Cancel to its left. A destructive action never joins that cluster — delete lives on the record, not in the editor.',
      'The footer is sticky and opaque. A transparent one lets fields scroll under it and look cut off.',
      'Long content spans both columns. A description squeezed into one column of a two-column grid is unreadable.',
      'The side rail is context. The moment the user has to act on it, it belongs in the form.',
      'A failed submit returns the user to the top with a summary, and every entered value is still there.'
    ],
    a11y: [
      'The form is a real <form> with a submit button, so Enter submits from any field.',
      'The error summary takes focus when it appears and each entry links to its field\'s id.',
      'The field grid follows DOM order, so the visual order and the tab order match.',
      'The sticky footer does not overlap the last field when focused, or keyboard users cannot see what they are typing.',
      'Required fields are marked in the label and backed by the required attribute.'
    ],
    related: ['field', 'modal', 'page-header'],
    variants: [
      { id: 'two-column', name: 'Two columns with sticky actions', code:
`<form class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <div class="border-b border-zinc-200 px-5 py-3.5">
    <h2 class="text-[14px]/5 font-semibold">New purchase order</h2>
    <p class="text-[12px]/4 text-zinc-600">Fields marked <span class="text-red-600">*</span> are required</p>
  </div>

  <div class="max-h-[420px] overflow-y-auto px-5 py-5">
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label for="fp-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor <span class="text-red-600">*</span></label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <select id="fp-vendor" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option>Sharma Steel &amp; Alloys</option>
            <option>Gujarat Polymers Ltd</option>
            <option>Deccan Bearings Pvt Ltd</option>
          </select>
        </div>
      </div>
      <div>
        <label for="fp-dept" class="mb-1.5 block text-[13px]/5 font-medium">Cost centre <span class="text-red-600">*</span></label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <select id="fp-dept" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option>Fabrication — Silvassa</option>
            <option>Moulding — Silvassa</option>
            <option>Maintenance — Vapi</option>
          </select>
        </div>
      </div>
      <div>
        <label for="fp-need" class="mb-1.5 block text-[13px]/5 font-medium">Required by <span class="text-red-600">*</span></label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <input id="fp-need" type="date" value="2026-09-04" class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
        </div>
      </div>
      <div>
        <label for="fp-value" class="mb-1.5 block text-[13px]/5 font-medium">Estimated value</label>
        <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
          <input id="fp-value" value="18,42,000" class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
        </div>
        <p class="mt-1.5 text-[12px]/4 text-zinc-500">Above ₹5,00,000 this needs a second approver.</p>
      </div>
      <div class="sm:col-span-2">
        <label for="fp-title" class="mb-1.5 block text-[13px]/5 font-medium">Order title <span class="text-red-600">*</span></label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <input id="fp-title" value="MS angles and plates — August lot" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
        </div>
      </div>
      <div class="sm:col-span-2">
        <label for="fp-ship" class="mb-1.5 block text-[13px]/5 font-medium">Delivery address</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <textarea id="fp-ship" rows="3" class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none">Konspec Industries, Plot 214, Silvassa Industrial Estate, Dadra &amp; Nagar Haveli 396230</textarea>
        </div>
      </div>
      <div class="sm:col-span-2">
        <label class="flex items-start gap-2.5 text-[14px]/5">
          <input type="checkbox" checked class="mt-0.5 size-4 rounded accent-zinc-700">
          <span>Email the vendor when this order is approved
            <span class="mt-0.5 block text-[12px]/4 text-zinc-500">Goes to purchase@sharmasteel.in</span>
          </span>
        </label>
      </div>
    </div>
  </div>

  <div class="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-white px-5 py-3">
    <p class="text-[12px]/4 text-zinc-500">Last saved as draft 14:02</p>
    <div class="flex items-center gap-2">
      <button type="button" class="rounded-lg px-4 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-100">Cancel</button>
      <button type="button" class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Save draft</button>
      <button type="submit" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Send for approval</button>
    </div>
  </div>
</form>` },
      { id: 'side-rail', name: 'With help rail', code:
`<form class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
  <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
    <div class="border-b border-zinc-200 px-5 py-3.5">
      <h2 class="text-[14px]/5 font-semibold">Rate contract</h2>
      <p class="text-[12px]/4 text-zinc-600">Gujarat Polymers Ltd · V-0412</p>
    </div>
    <div class="space-y-4 px-5 py-5">
      <div>
        <label for="rc-material" class="mb-1.5 block text-[13px]/5 font-medium">Material <span class="text-red-600">*</span></label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <select id="rc-material" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option>HDPE granules — natural</option>
            <option>PP copolymer — black</option>
          </select>
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="rc-rate" class="mb-1.5 block text-[13px]/5 font-medium">Rate per kg <span class="text-red-600">*</span></label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
            <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
            <input id="rc-rate" value="118.40" class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
          </div>
        </div>
        <div>
          <label for="rc-qty" class="mb-1.5 block text-[13px]/5 font-medium">Committed quantity</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
            <input id="rc-qty" value="45,000 kg" class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
          </div>
        </div>
        <div>
          <label for="rc-from" class="mb-1.5 block text-[13px]/5 font-medium">Valid from</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
            <input id="rc-from" type="date" value="2026-09-01" class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
          </div>
        </div>
        <div>
          <label for="rc-to" class="mb-1.5 block text-[13px]/5 font-medium">Valid to</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
            <input id="rc-to" type="date" value="2027-03-31" class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
          </div>
        </div>
      </div>
      <div>
        <label for="rc-notes" class="mb-1.5 block text-[13px]/5 font-medium">Notes for the buyer</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <textarea id="rc-notes" rows="3" class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500" placeholder="Escalation contact, packing requirement, test certificate"></textarea>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end gap-2 border-t border-zinc-200 px-5 py-3">
      <button type="button" class="rounded-lg px-4 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-100">Cancel</button>
      <button type="submit" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save contract</button>
    </div>
  </div>

  <aside class="space-y-4">
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-4">
      <h3 class="text-[13px]/5 font-semibold">How rates are applied</h3>
      <p class="mt-1.5 text-[13px]/5 text-zinc-600">
        A purchase order raised inside the validity window picks this rate automatically. Buyers can override it, and the override is logged against the order.
      </p>
    </div>
    <div class="rounded-xl border border-zinc-200 bg-white px-4 py-4">
      <h3 class="text-[13px]/5 font-semibold">Last three months</h3>
      <dl class="mt-3 space-y-2.5 text-[13px]/5">
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-zinc-600">Average rate paid</dt><dd class="font-medium tabular-nums">₹121.75</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-zinc-600">Quantity bought</dt><dd class="font-medium tabular-nums">38,200 kg</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-zinc-600">On-time delivery</dt><dd class="font-medium tabular-nums">91%</dd>
        </div>
      </dl>
    </div>
    <!-- neutral body, colour only in the icon — same as the alert component -->
    <div class="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <i data-lucide="alert-triangle" class="mt-px size-4 shrink-0 text-amber-700"></i>
      <p class="text-[13px]/5 text-zinc-700">The existing contract for HDPE granules runs to 31 Aug 2026. Saving this one supersedes it.</p>
    </div>
  </aside>
</form>` }
    ]
  },

  {
    id: 'auth-page', name: 'Auth page', category: 'layout',
    description: 'The signed-out screen: one centred card, the fewest fields that will do, and nothing else on the page.',
    when: 'Sign in, password reset, set a new password. No sidebar, no topbar, no search.',
    notes: [
      'This is the shape of Django registration/login.html. The error block maps to {{ form.non_field_errors }}, the fields to {{ form.username }} and {{ form.password }}, and the form needs {% csrf_token %} plus a hidden next input.',
      'Never say which of the two was wrong. One message for a bad email and a bad password.',
      'Autofocus the first field and set autocomplete — email on the username, current-password on the password — or password managers will not fill it.',
      'No sign-up link. Konspec accounts are created by IT, so the dead end is the support line, not a register page.'
    ],
    anatomy: [
      ['Card', 'One centred panel, and nothing else on the page.'],
      ['Error block', 'Above the fields. Maps to {{ form.non_field_errors }}.'],
      ['Fields', 'The fewest that will do, with autocomplete set so password managers can fill them.'],
      ['Submit', 'Full width. There is only one action on this page.'],
      ['Support link', 'The dead end when sign-in fails. There is no sign-up link, because accounts are created by IT.']
    ],
    behaviour: [
      'Never say which of the two was wrong. One message covers a bad email and a bad password.',
      'The first field is autofocused, so the user can start typing immediately.',
      'autocomplete is set — email on the username, current-password on the password — or password managers will not fill it.',
      'No shell: no sidebar, no topbar, no search. The page has exactly one job.',
      'This is the shape of Django\'s registration/login.html, and the form posts with {% csrf_token %}.'
    ],
    a11y: [
      'Both fields have real labels, not placeholders.',
      'The error block is role="alert" so a failed attempt is announced, since the page otherwise looks unchanged.',
      'The submit button is a real submit, so Enter works from either field.',
      'Autofocus lands on the first field and does not steal focus later.',
      'The support link is reachable by keyboard and reads as a destination, not as decoration.'
    ],
    related: ['field', 'form-page', 'error-page'],
    variants: [
      { id: 'signin', name: 'Sign in', code:
`<div class="flex min-h-[560px] items-center justify-center bg-zinc-100 px-4 py-10">
  <div class="w-full max-w-sm">
    <div class="flex items-center justify-center gap-2.5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-zinc-700 text-[14px]/5 font-semibold text-white">K</span>
      <span class="text-[16px]/6 font-semibold">Konspec Operations</span>
    </div>

    <form class="mt-6 rounded-xl border border-zinc-200 bg-white px-6 py-6">
      <h1 class="text-[20px]/7 font-semibold tracking-tight">Sign in</h1>
      <p class="mt-1 text-[13px]/5 text-zinc-600">Use your Konspec Industries email address.</p>

      <!-- neutral body, colour only in the icon. A red field behind red text is
           harder to read than the message is urgent. -->
      <div class="mt-4 flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5">
        <i data-lucide="alert-circle" class="mt-px size-4 shrink-0 text-red-600"></i>
        <p class="text-[13px]/5 text-zinc-700">That email and password do not match an active account. Two attempts left before the account is locked for 15 minutes.</p>
      </div>

      <div class="mt-4">
        <label for="auth-email" class="mb-1.5 block text-[13px]/5 font-medium">Work email</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <input id="auth-email" type="email" autocomplete="email" autofocus value="akshay.prabhu@konspec.com"
                 class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
        </div>
      </div>

      <div class="mt-3.5">
        <div class="mb-1.5 flex items-baseline justify-between gap-3">
          <label for="auth-password" class="text-[13px]/5 font-medium">Password</label>
          <a href="#" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Forgot password</a>
        </div>
        <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15"
             x-data="{ show: false }">
          <input id="auth-password" :type="show ? 'text' : 'password'" autocomplete="current-password" value="0000000000"
                 class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
          <button type="button" @click="show = !show" class="px-3 text-zinc-600 hover:text-zinc-900"
                  :aria-label="show ? 'Hide password' : 'Show password'">
            <span x-show="!show"><i data-lucide="eye" class="size-4"></i></span>
            <span x-show="show" x-cloak><i data-lucide="eye-off" class="size-4"></i></span>
          </button>
        </div>
      </div>

      <label class="mt-4 flex items-center gap-2.5 text-[13px]/5">
        <input type="checkbox" checked class="size-4 rounded accent-zinc-700">Keep me signed in on this device
      </label>

      <button type="submit" class="mt-5 w-full rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Sign in</button>

      <p class="mt-4 border-t border-zinc-100 pt-4 text-[12px]/4 text-zinc-600">
        No account yet? Accounts are created by IT.
        <a href="mailto:it@konspec.com" class="font-medium text-zinc-900 underline underline-offset-2">Email it@konspec.com</a>
      </p>
    </form>

    <p class="mt-4 text-center text-[11px]/4 text-zinc-500">Konspec Industries · internal system · activity is logged</p>
  </div>
</div>` }
    ]
  },

  {
    id: 'error-page', name: 'Error page', category: 'layout',
    description: 'What the user sees when the page cannot be shown. Says what happened, what it means for them, and gives one way back.',
    when: '404, 403 and 500 handlers. For a failure inside a page that otherwise works, use an inline empty or error state instead.',
    notes: [
      'One primary action back to somewhere that works, one secondary link to support. No search box, no illustration.',
      'Show the reference the support team needs — the requested path on a 404, the incident id on a 500. Never show a traceback.',
      'On 403 say which permission is missing and who grants it, otherwise the user has nowhere to go.',
      'In Django these are templates/404.html, 403.html and 500.html. 500.html renders with no context processors, so it can use no template variables at all.'
    ],
    anatomy: [
      ['Code', 'The status, small and muted. It is for the support call, not for the user.'],
      ['Headline', 'What happened, in the user\'s terms. "This page does not exist", not "404 Not Found".'],
      ['Explanation', 'What it means for them and what to do about it.'],
      ['Reference', 'The requested path on a 404, the incident id on a 500. Never a traceback.'],
      ['Actions', 'One primary way back to somewhere that works, one secondary link to support.']
    ],
    behaviour: [
      'One way back and one way to ask for help. No search box, no illustration.',
      'A 403 names the missing permission and who grants it, or the user has nowhere to go.',
      'A 500 shows an incident id the support team can look up, and nothing about the internals.',
      'These are whole-page handlers. A failure inside a page that otherwise works is an inline empty or error state.',
      'Django\'s 500.html renders with no context processors, so it can use no template variables at all — every value on it must be literal.'
    ],
    a11y: [
      'The headline is the page\'s h1, so the page has a proper title in the outline.',
      'The status code is not the heading; it is supporting detail beside a sentence in words.',
      'The primary action is a real link to a working page, not a history-back button that may loop.',
      'Colour is not used to convey severity — the wording does that.',
      'The reference is selectable text so it can be copied into a support ticket.'
    ],
    related: ['empty-state', 'alert', 'auth-page'],
    variants: [
      { id: '404', name: '404 not found', code:
`<div class="flex min-h-[420px] items-center justify-center bg-zinc-200 px-4 py-12">
  <div class="max-w-md text-center">
    <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-white ring-1 ring-zinc-300">
      <i data-lucide="file-question" class="size-5 text-zinc-600"></i>
    </span>
    <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Error 404</p>
    <h1 class="mt-1 text-[20px]/7 font-semibold tracking-tight">This page does not exist</h1>
    <p class="mt-2 text-[14px]/5 text-zinc-600">
      Nothing is served at <span class="font-medium text-zinc-900">/orders/PO-24-9910/</span>. The order may have been deleted, or the link may be out of date.
    </p>
    <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
      <a href="#" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Back to purchase orders</a>
      <a href="mailto:it@konspec.com" class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200">Contact support</a>
    </div>
  </div>
</div>` },
      { id: '403', name: '403 permission denied', code:
`<div class="flex min-h-[420px] items-center justify-center bg-zinc-200 px-4 py-12">
  <div class="max-w-md text-center">
    <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-white ring-1 ring-zinc-300">
      <i data-lucide="lock" class="size-5 text-zinc-600"></i>
    </span>
    <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Error 403</p>
    <h1 class="mt-1 text-[20px]/7 font-semibold tracking-tight">You cannot open this order</h1>
    <p class="mt-2 text-[14px]/5 text-zinc-600">
      PO-24-1187 belongs to the Fabrication cost centre. Your account has read access to Moulding and Dispatch only.
    </p>
    <p class="mt-3 text-[13px]/5 text-zinc-600">
      Access is granted by Nilesh Patil, Head of Procurement.
    </p>
    <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
      <a href="#" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Back to overview</a>
      <a href="mailto:it@konspec.com" class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200">Request access</a>
    </div>
    <p class="mt-6 text-[11px]/4 text-zinc-500">Signed in as akshay.prabhu@konspec.com</p>
  </div>
</div>` },
      { id: '500', name: '500 server error', code:
`<div class="flex min-h-[420px] items-center justify-center bg-zinc-100 px-4 py-12">
  <div class="max-w-md text-center">
    <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="alert-circle" class="size-5 text-red-600"></i>
    </span>
    <p class="mt-4 text-[11px]/4 font-semibold uppercase tracking-wider text-zinc-500">Error 500</p>
    <h1 class="mt-1 text-[20px]/7 font-semibold tracking-tight">Something broke on our side</h1>
    <p class="mt-2 text-[14px]/5 text-zinc-600">
      The page could not be built. Nothing you did was saved, so it is safe to try again in a minute.
    </p>
    <p class="mt-4 inline-block rounded-lg bg-white px-3 py-1.5 text-[12px]/4 tabular-nums text-zinc-600 ring-1 ring-zinc-200">
      Reference INC-8342 · 19 Aug 2026 14:07 IST
    </p>
    <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
      <a href="#" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Back to overview</a>
      <a href="mailto:it@konspec.com" class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Contact support</a>
    </div>
    <p class="mt-6 text-[11px]/4 text-zinc-500">Quote the reference and IT can find the exact failure.</p>
  </div>
</div>` }
    ]
  }
);
