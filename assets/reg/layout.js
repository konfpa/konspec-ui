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
        <kbd class="mr-3 rounded border border-zinc-200 bg-zinc-100 px-1.5 text-[11px]/4 text-zinc-600" :class="!sidebar && 'lg:hidden'">[</kbd>
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
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>
      <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="More orders"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </div>

  <div x-ref="rail" @scroll.passive="sync()" tabindex="0" role="group" aria-label="Orders awaiting approval"
       @keydown.arrow-right="if ($event.target === $refs.rail) { $event.preventDefault(); go(i + 1); }"
       @keydown.arrow-left="if ($event.target === $refs.rail) { $event.preventDefault(); go(i - 1); }"
       class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

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
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>
      <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="More orders"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </div>

  <div x-ref="rail" @scroll.passive="sync()" tabindex="0" role="group" aria-label="Other orders on Gujarat Polymers Ltd"
       @keydown.arrow-right="if ($event.target === $refs.rail) { $event.preventDefault(); go(i + 1); }"
       @keydown.arrow-left="if ($event.target === $refs.rail) { $event.preventDefault(); go(i - 1); }"
       class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

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
       class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

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
            class="flex size-6 items-center justify-center rounded-md focus-visible:ring-3 focus-visible:ring-zinc-700/15">
      <span class="h-1.5 rounded-full transition-all" :class="i === 0 ? 'w-4 bg-zinc-700' : 'w-1.5 bg-zinc-300'"></span>
    </button>
    <button type="button" @click="go(1)" :aria-current="i === 1 ? 'true' : 'false'" aria-label="Notice 2, second approval limit"
            class="flex size-6 items-center justify-center rounded-md focus-visible:ring-3 focus-visible:ring-zinc-700/15">
      <span class="h-1.5 rounded-full transition-all" :class="i === 1 ? 'w-4 bg-zinc-700' : 'w-1.5 bg-zinc-300'"></span>
    </button>
    <button type="button" @click="go(2)" :aria-current="i === 2 ? 'true' : 'false'" aria-label="Notice 3, gate timings"
            class="flex size-6 items-center justify-center rounded-md focus-visible:ring-3 focus-visible:ring-zinc-700/15">
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
         class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

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
            class="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-0 md:flex">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>
    <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="Next photograph"
            class="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-0 md:flex">
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
       class="flex snap-x snap-mandatory overflow-x-auto focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            class="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-40 md:flex">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>

    <div class="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button type="button" @click="go(0)" :aria-current="i === 0 ? 'true' : 'false'"
              class="shrink-0 rounded-lg border p-1 text-left focus-visible:ring-3 focus-visible:ring-zinc-700/15"
              :class="i === 0 ? 'border-zinc-700 bg-zinc-100' : 'border-zinc-200 bg-white hover:bg-zinc-50'">
        <span class="flex h-10 w-16 items-center justify-center rounded bg-zinc-200"><i data-lucide="file-text" class="size-3.5 text-zinc-600"></i></span>
        <span class="mt-1 block w-16 truncate text-[11px]/4 text-zinc-600">GA-01</span>
      </button>
      <button type="button" @click="go(1)" :aria-current="i === 1 ? 'true' : 'false'"
              class="shrink-0 rounded-lg border p-1 text-left focus-visible:ring-3 focus-visible:ring-zinc-700/15"
              :class="i === 1 ? 'border-zinc-700 bg-zinc-100' : 'border-zinc-200 bg-white hover:bg-zinc-50'">
        <span class="flex h-10 w-16 items-center justify-center rounded bg-zinc-200"><i data-lucide="file-text" class="size-3.5 text-zinc-600"></i></span>
        <span class="mt-1 block w-16 truncate text-[11px]/4 text-zinc-600">GA-02</span>
      </button>
      <button type="button" @click="go(2)" :aria-current="i === 2 ? 'true' : 'false'"
              class="shrink-0 rounded-lg border p-1 text-left focus-visible:ring-3 focus-visible:ring-zinc-700/15"
              :class="i === 2 ? 'border-zinc-700 bg-zinc-100' : 'border-zinc-200 bg-white hover:bg-zinc-50'">
        <span class="flex h-10 w-16 items-center justify-center rounded bg-zinc-200"><i data-lucide="file-text" class="size-3.5 text-zinc-600"></i></span>
        <span class="mt-1 block w-16 truncate text-[11px]/4 text-zinc-600">DET-01</span>
      </button>
      <button type="button" @click="go(3)" :aria-current="i === 3 ? 'true' : 'false'"
              class="shrink-0 rounded-lg border p-1 text-left focus-visible:ring-3 focus-visible:ring-zinc-700/15"
              :class="i === 3 ? 'border-zinc-700 bg-zinc-100' : 'border-zinc-200 bg-white hover:bg-zinc-50'">
        <span class="flex h-10 w-16 items-center justify-center rounded bg-zinc-200"><i data-lucide="file-text" class="size-3.5 text-zinc-600"></i></span>
        <span class="mt-1 block w-16 truncate text-[11px]/4 text-zinc-600">BOM-01</span>
      </button>
    </div>

    <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="Next sheet"
            class="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-40 md:flex">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
</div>` },
      { id: 'stats', name: 'Strip on mobile, grid on desktop', code:
`<!-- no JavaScript: below sm it is a snapped strip, from sm up it is an ordinary grid -->
<div role="group" aria-label="This month at Silvassa" tabindex="0"
     class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-zinc-700/15 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

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
    <button type="button" class="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:ring-3 focus-visible:ring-zinc-700/30">
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
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
          <i data-lucide="chevron-left" class="size-4"></i>
        </button>
        <button type="button" @click="go(i + 1)" :disabled="atEnd" aria-label="Next photograph"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-3 focus-visible:ring-zinc-700/15 disabled:pointer-events-none disabled:opacity-40">
          <i data-lucide="chevron-right" class="size-4"></i>
        </button>
      </div>
    </div>
  </div>

  {# the loop is server side, so there is no x-for template for slides() to filter out #}
  <div x-ref="rail" @scroll.passive="sync()" tabindex="0" role="group" aria-label="Photographs on inspection {{ inspection.reference }}"
       @keydown.arrow-right="if ($event.target === $refs.rail) { $event.preventDefault(); go(i + 1); }"
       @keydown.arrow-left="if ($event.target === $refs.rail) { $event.preventDefault(); go(i - 1); }"
       class="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-zinc-700/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
    related: ['table', 'sheet', 'app-shell'],
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
    when: 'Any create or edit screen with more than about four fields. A short form belongs in a dialog instead.',
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
    related: ['field', 'dialog', 'page-header'],
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
