register(
  {
    id: 'tabs', name: 'Tabs', category: 'navigation',
    description: 'Switches between views of the same record without leaving the page. The panel below changes; the URL and the page title do not have to.',
    when: 'Two to seven sibling views of one thing — an order and its lines, receipts and history. If the views are unrelated, use the sidebar instead.',
    notes: [
      'The active tab is the only one carrying weight. Do not colour the inactive tabs — they are text-zinc-600 and nothing else.',
      'Counts belong in a pill on the tab, not in the label text. Keep them tabular-nums so the row does not jitter when a number changes.',
      'On a narrow screen tabs scroll sideways. Never wrap them onto a second line — the second line reads as a different control.'
    ],
    anatomy: [
      ['Tablist', 'The row itself, with a bottom border that the active tab\'s marker sits on.'],
      ['Tab', 'A button, not a link, when the panel is on the same page.'],
      ['Active marker', 'A 2px zinc-900 underline plus the weight change. The inactive tabs are text-zinc-600 and nothing else.'],
      ['Count', 'A pill on the tab, tabular-nums, so the row does not jitter when a number changes.'],
      ['Panel', 'The region below, tied to its tab by id.']
    ],
    behaviour: [
      'Only the active tab carries weight and colour. Tinting the inactive ones destroys the distinction the control exists to make.',
      'Two to seven tabs. Past that the row stops being scannable and the views are probably unrelated.',
      'On a narrow screen the row scrolls sideways. It never wraps — a second line reads as a different control.',
      'Counts live in a pill rather than in the label text, so the label stays a stable width.',
      'Switching tabs does not reload the page and does not lose scroll position in the panel below.'
    ],
    a11y: [
      'role="tablist" on the row, role="tab" on each control, role="tabpanel" on the region.',
      'Each tab carries aria-selected and aria-controls pointing at its panel.',
      'Left and right arrows move between tabs; Tab moves out of the row entirely, which is the whole point of the pattern.',
      'Only the active tab is in the tab order — the others are reached with the arrows.',
      'The panel is labelled by its tab with aria-labelledby, so its context is announced.'
    ],
    related: ['page-header', 'accordion', 'sidebar-nav'],
    variants: [
      { id: 'underline', name: 'Underline', code:
`<div x-data="{ tab: 'lines' }">
  <div class="border-b border-zinc-200">
    <nav class="-mb-px flex gap-6" aria-label="Purchase order sections">
      <button @click="tab = 'summary'" :aria-current="tab === 'summary' ? 'page' : false"
              class="border-b-2 pb-2.5 text-[13px]/5"
              :class="tab === 'summary' ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">
        Summary
      </button>
      <button @click="tab = 'lines'" :aria-current="tab === 'lines' ? 'page' : false"
              class="flex items-center gap-2 border-b-2 pb-2.5 text-[13px]/5"
              :class="tab === 'lines' ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">
        Lines
        <span class="rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-1.5 py-0.5 text-[11px]/4 tabular-nums text-zinc-700">14</span>
      </button>
      <button @click="tab = 'receipts'" :aria-current="tab === 'receipts' ? 'page' : false"
              class="flex items-center gap-2 border-b-2 pb-2.5 text-[13px]/5"
              :class="tab === 'receipts' ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">
        Receipts
        <span class="rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-1.5 py-0.5 text-[11px]/4 tabular-nums text-zinc-700">3</span>
      </button>
      <button @click="tab = 'history'" :aria-current="tab === 'history' ? 'page' : false"
              class="border-b-2 pb-2.5 text-[13px]/5"
              :class="tab === 'history' ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">
        History
      </button>
    </nav>
  </div>

  <div class="pt-4 text-[14px]/5">
    <div x-show="tab === 'summary'" x-cloak>
      <p class="text-zinc-600">PO-24-1187 raised for Gujarat Polymers Ltd on 4 August, payment 45 days from GRN.</p>
    </div>
    <div x-show="tab === 'lines'">
      <p>14 lines, <span class="tabular-nums font-medium">₹18,42,000</span> before tax.</p>
    </div>
    <div x-show="tab === 'receipts'" x-cloak>
      <p class="text-zinc-600">3 GRNs posted, 2 lines still short.</p>
    </div>
    <div x-show="tab === 'history'" x-cloak>
      <p class="text-zinc-600">Approved by R. Menon on 5 August, revised once.</p>
    </div>
  </div>
</div>` },
      { id: 'pill', name: 'Pill', code:
`<div x-data="{ tab: 'open' }">
  <div class="inline-flex rounded-lg bg-zinc-100 p-1" role="tablist" aria-label="Order status">
    <button @click="tab = 'open'" :aria-current="tab === 'open' ? 'page' : false"
            class="rounded-md px-3 py-1.5 text-[13px]/5"
            :class="tab === 'open' ? 'bg-white font-medium text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      Open
    </button>
    <button @click="tab = 'awaiting'" :aria-current="tab === 'awaiting' ? 'page' : false"
            class="rounded-md px-3 py-1.5 text-[13px]/5"
            :class="tab === 'awaiting' ? 'bg-white font-medium text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      Awaiting GRN
    </button>
    <button @click="tab = 'closed'" :aria-current="tab === 'closed' ? 'page' : false"
            class="rounded-md px-3 py-1.5 text-[13px]/5"
            :class="tab === 'closed' ? 'bg-white font-medium text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      Closed
    </button>
  </div>

  <div class="pt-4 text-[14px]/5">
    <p x-show="tab === 'open'">48 orders open, <span class="tabular-nums">₹4,12,60,000</span> committed.</p>
    <p x-show="tab === 'awaiting'" x-cloak class="text-zinc-600">27 orders delivered but not yet receipted.</p>
    <p x-show="tab === 'closed'" x-cloak class="text-zinc-600">73 orders closed this quarter.</p>
  </div>
</div>` },
      { id: 'scrollable', name: 'Scrollable', code:
`<div x-data="{ tab: 'grn' }">
  <div class="overflow-x-auto border-b border-zinc-200">
    <nav class="-mb-px flex w-max gap-6" aria-label="Procurement sections">
      <template x-for="t in [
        { id: 'overview', label: 'Overview' },
        { id: 'po', label: 'Purchase orders' },
        { id: 'req', label: 'Requisitions' },
        { id: 'grn', label: 'Goods receipt' },
        { id: 'inv', label: 'Invoices' },
        { id: 'vendors', label: 'Vendors' },
        { id: 'rc', label: 'Rate contracts' }
      ]" :key="t.id">
        <button @click="tab = t.id" :aria-current="tab === t.id ? 'page' : false"
                class="shrink-0 border-b-2 pb-2.5 text-[13px]/5 whitespace-nowrap"
                :class="tab === t.id ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'"
                x-text="t.label"></button>
      </template>
    </nav>
  </div>
  <p class="pt-4 text-[14px]/5 text-zinc-600">Showing <span class="font-medium text-zinc-900" x-text="tab"></span> — swipe the tab strip on a narrow screen.</p>
</div>` }
    ]
  },

  {
    id: 'breadcrumbs', name: 'Breadcrumbs', category: 'navigation',
    description: 'The path from the section root down to the record on screen. The last crumb says where you are and is not a link.',
    when: 'Any page two or more levels deep. One level deep does not need a trail — it needs a back link, which is the last variant here.',
    notes: [
      'The separator is a slash, always. There is no chevron variant and no icon variant; a trail that reads "Home / Procurement / PO-24-1187" in one file and uses chevrons in another is two components pretending to be one.',
      'The last crumb is plain text with aria-current="page". Making it a link to itself is a dead control, and users click it and get nothing.',
      'Never truncate the last crumb. It is the one that says where you are. Truncate the middle, or collapse it into an overflow menu.',
      'The trail is the information hierarchy, not the browsing history. It does not change based on how the user arrived, so two people on the same record see the same trail.',
      'Crumbs are not underlined, unlike every other link in the system. Five underlined links in a row is a fence, not a path; the muted colour and the hover carry it instead.'
    ],
    anatomy: [
      ['Trail', 'A <nav aria-label="Breadcrumb"> holding an ordered list, because the order is the information and a screen reader needs to be able to skip it.'],
      ['Crumb', 'A link to an ancestor page, text-zinc-600, darkening to zinc-900 on hover.'],
      ['Separator', 'A zinc-400 slash. Decorative and aria-hidden, so it is never read aloud.'],
      ['Current crumb', 'Plain text in zinc-900 font-medium, never a link, carrying aria-current="page".'],
      ['Overflow', 'A menu holding the collapsed middle of a long trail, behind an ellipsis button.'],
      ['Trailing controls', 'Anything that belongs to the record rather than the page — a status pill, a copy-id button. They sit after the last crumb, never inside it.']
    ],
    behaviour: [
      'The last crumb is the current page and is not a link. A link to the page you are on is a dead control.',
      'The last crumb is never truncated or collapsed — it is the one that says where you are.',
      'A long trail collapses its middle into an overflow menu rather than wrapping onto two lines.',
      'Below sm the trail collapses to the parent and the current page. Four crumbs at 390px either wrap or push the page sideways, and both are worse than showing two.',
      'The trail reflects the hierarchy, not the history, so it does not change based on how the user arrived.',
      'Crumb labels match the titles of the pages they point at, so following one is not a surprise.'
    ],
    a11y: [
      'A <nav> with aria-label="Breadcrumb", so assistive technology can identify it and skip past it.',
      'An ordered list inside, because the sequence carries the meaning.',
      'Separators are aria-hidden, or a screen reader reads "slash" between every crumb.',
      'The current page carries aria-current="page" — that, not the styling, is what announces it.',
      'The overflow button has an aria-label naming how many levels it hides, because an ellipsis says nothing on its own.',
      'The browser\'s own focus ring is left alone on crumb links; nothing here overrides outline.'
    ],
    related: ['page-header', 'tabs', 'sidebar-nav'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- Three levels, which is the common case. The separator is aria-hidden so a
     screen reader reads "Home, Procurement, Purchase orders" rather than
     spelling out a slash between each one. -->
<nav aria-label="Breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5 text-[13px]/5">
    <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Home</a></li>
    <li aria-hidden="true" class="text-zinc-500">/</li>
    <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Procurement</a></li>
    <li aria-hidden="true" class="text-zinc-500">/</li>
    <li><span aria-current="page" class="font-medium text-zinc-900">Purchase orders</span></li>
  </ol>
</nav>` },

      { id: 'record', name: 'On a record', code:
`<!-- A record page. The status and the copy button belong to the record, not to
     the trail, so they sit after the last crumb rather than inside it — putting
     them inside makes the accessible name of the current page read
     "PO-24-1187 Awaiting GRN Copy order number". -->
<nav aria-label="Breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5 text-[13px]/5">
    <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Home</a></li>
    <li aria-hidden="true" class="text-zinc-500">/</li>
    <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Procurement</a></li>
    <li aria-hidden="true" class="text-zinc-500">/</li>
    <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Purchase orders</a></li>
    <li aria-hidden="true" class="text-zinc-500">/</li>
    <li class="flex items-center gap-2">
      <span aria-current="page" class="font-medium tabular-nums text-zinc-900">PO-24-1187</span>
      <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Awaiting GRN
      </span>
      <button type="button" aria-label="Copy order number" class="text-zinc-600 hover:text-zinc-900">
        <i data-lucide="copy" class="size-3.5"></i>
      </button>
    </li>
  </ol>
</nav>` },

      { id: 'truncated', name: 'Long labels', code:
`<!-- Vendor and project names run long. The middle crumbs truncate; the last one
     never does. min-w-0 on the <li> is what makes truncate work at all inside a
     flex row — without it the item refuses to shrink below its content. -->
<nav aria-label="Breadcrumb">
  <ol class="flex flex-nowrap items-center gap-1.5 text-[13px]/5">
    <li class="shrink-0"><a href="#" class="text-zinc-600 hover:text-zinc-900">Home</a></li>
    <li aria-hidden="true" class="shrink-0 text-zinc-500">/</li>
    <li class="min-w-0 max-w-[14ch] shrink">
      <a href="#" title="Procurement &amp; stores" class="block truncate text-zinc-600 hover:text-zinc-900">Procurement &amp; stores</a>
    </li>
    <li aria-hidden="true" class="shrink-0 text-zinc-500">/</li>
    <li class="min-w-0 max-w-[18ch] shrink">
      <a href="#" title="Gujarat Polymers Ltd — annual rate contract" class="block truncate text-zinc-600 hover:text-zinc-900">Gujarat Polymers Ltd — annual rate contract</a>
    </li>
    <li aria-hidden="true" class="shrink-0 text-zinc-500">/</li>
    <li class="shrink-0"><span aria-current="page" class="font-medium tabular-nums text-zinc-900">PO-24-1187</span></li>
  </ol>
</nav>` },

      { id: 'overflow', name: 'Collapsed middle', code:
`<!-- Past four levels the middle collapses behind an ellipsis rather than
     wrapping onto a second line. The button says how many levels it hides,
     because an ellipsis on its own announces nothing.

     @click.stop on the button and the panel keeps the document-level handler
     from closing this menu the moment it opens. -->
<nav aria-label="Breadcrumb" x-data="{ open: false }" @click.outside="open = false" @keydown.escape.window="open = false">
  <ol class="flex flex-wrap items-center gap-1.5 text-[13px]/5">
    <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Home</a></li>
    <li aria-hidden="true" class="text-zinc-500">/</li>
    <li class="relative">
      <button type="button" @click.stop="open = !open"
              aria-label="Show 3 hidden levels" :aria-expanded="open" aria-haspopup="menu"
              class="rounded-md px-1.5 py-0.5 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">…</button>
      <div x-show="open" x-cloak @click.stop role="menu"
           class="absolute left-0 z-40 mt-1 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <a href="#" role="menuitem" class="block truncate px-3 py-2 text-[13px]/5 hover:bg-zinc-100">Procurement</a>
        <a href="#" role="menuitem" class="block truncate px-3 py-2 text-[13px]/5 hover:bg-zinc-100">Purchase orders</a>
        <a href="#" role="menuitem" class="block truncate px-3 py-2 text-[13px]/5 hover:bg-zinc-100">Gujarat Polymers Ltd</a>
      </div>
    </li>
    <li aria-hidden="true" class="text-zinc-500">/</li>
    <li><a href="#" class="tabular-nums text-zinc-600 hover:text-zinc-900">PO-24-1187</a></li>
    <li aria-hidden="true" class="text-zinc-500">/</li>
    <li><span aria-current="page" class="font-medium text-zinc-900">Line 4 — MS angle 50×50×6</span></li>
  </ol>
</nav>` },

      { id: 'responsive', name: 'On a phone', code:
`<!-- The same trail twice, and only one is ever visible. Below sm everything
     between the root and the parent is dropped and the parent takes a back
     chevron, because four crumbs at 390px either wrap onto two lines or push
     the page sideways.

     Both copies sit in the DOM, and that is safe here only because hidden and
     sm:hidden compile to display:none, which takes the inactive one out of the
     accessibility tree as well as off the screen. Hide one with opacity or
     visibility instead and a screen reader reads the path twice. -->
<div>
  <!-- phone: parent and current only -->
  <nav aria-label="Breadcrumb" class="sm:hidden">
    <ol class="flex items-center gap-1.5 text-[13px]/5">
      <li class="flex items-center gap-1">
        <i data-lucide="chevron-left" class="size-3.5 text-zinc-600"></i>
        <a href="#" class="text-zinc-600 hover:text-zinc-900">Purchase orders</a>
      </li>
      <li aria-hidden="true" class="text-zinc-500">/</li>
      <li class="min-w-0"><span aria-current="page" class="block truncate font-medium tabular-nums text-zinc-900">PO-24-1187</span></li>
    </ol>
  </nav>

  <!-- sm and up: the full trail -->
  <nav aria-label="Breadcrumb" class="hidden sm:block">
    <ol class="flex flex-wrap items-center gap-1.5 text-[13px]/5">
      <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Home</a></li>
      <li aria-hidden="true" class="text-zinc-500">/</li>
      <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Procurement</a></li>
      <li aria-hidden="true" class="text-zinc-500">/</li>
      <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Purchase orders</a></li>
      <li aria-hidden="true" class="text-zinc-500">/</li>
      <li><span aria-current="page" class="font-medium tabular-nums text-zinc-900">PO-24-1187</span></li>
    </ol>
  </nav>
</div>` },

      { id: 'page-header', name: 'Above a page title', code:
`<!-- Where a trail actually lives. It sits above the title, not beside it, and
     the title repeats the last crumb — that repetition is correct: the crumb is
     navigation and the h1 is the page. -->
<div class="rounded-xl border border-zinc-200 bg-white px-5 py-4">
  <nav aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1.5 text-[13px]/5">
      <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Home</a></li>
      <li aria-hidden="true" class="text-zinc-500">/</li>
      <li><a href="#" class="text-zinc-600 hover:text-zinc-900">Procurement</a></li>
      <li aria-hidden="true" class="text-zinc-500">/</li>
      <li><span aria-current="page" class="font-medium tabular-nums text-zinc-900">PO-24-1187</span></li>
    </ol>
  </nav>

  <div class="mt-2 flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 class="text-[20px]/7 font-semibold tracking-tight tabular-nums">PO-24-1187</h1>
      <p class="mt-0.5 text-[13px]/5 text-zinc-600">Gujarat Polymers Ltd · raised 14 Aug 2026 · 6 lines</p>
    </div>
    <div class="flex shrink-0 items-center gap-2">
      <button type="button" class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">Export</button>
      <button type="button" class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve</button>
    </div>
  </div>
</div>` },

      { id: 'back', name: 'One level deep', code:
`<!-- Not a breadcrumb, and that is the point. One level deep there is nothing to
     trace, so a trail of two is ceremony. A back link says the same thing in
     less space and gives a bigger target on a phone. -->
<a href="#" class="inline-flex items-center gap-1.5 text-[13px]/5 text-zinc-600 hover:text-zinc-900">
  <i data-lucide="chevron-left" class="size-4"></i>Purchase orders
</a>` },

      { id: 'django', name: 'Django template', code:
`<!-- The trail comes from the view as a list of (label, url) pairs, with the
     last entry carrying no url. forloop.last is what decides which crumb is
     plain text, so the template never has to be told twice where it is.

     # views.py
     context['crumbs'] = [
         ('Home', reverse('home')),
         ('Procurement', reverse('procurement:index')),
         ('Purchase orders', reverse('po:list')),
         (order.number, None),
     ]

     Build it in the view, not in the template. A trail assembled from
     request.path is browsing history wearing a hierarchy's clothes. -->
<nav aria-label="Breadcrumb">
  <ol class="flex flex-wrap items-center gap-1.5 text-[13px]/5">
    {% for label, url in crumbs %}
      {% if not forloop.first %}<li aria-hidden="true" class="text-zinc-500">/</li>{% endif %}
      <li>
        {% if forloop.last %}
          <span aria-current="page" class="font-medium text-zinc-900">{{ label }}</span>
        {% else %}
          <a href="{{ url }}" class="text-zinc-600 hover:text-zinc-900">{{ label }}</a>
        {% endif %}
      </li>
    {% endfor %}
  </ol>
</nav>` }
    ]
  },

  {
    id: 'sidebar-nav', name: 'Sidebar nav', category: 'navigation',
    description: 'The vertical navigation list that lives inside an app shell. This is the list only — the shell, its header and the scroll container belong to the layout.',
    when: 'The primary navigation of a console with more than about five destinations. For two or three destinations use tabs in the topbar.',
    notes: [
      'Exactly one item carries aria-current="page". The bg-zinc-100 tint is the visual half of the same statement — never one without the other.',
      'Counts are right-aligned and tabular-nums so the column of numbers stays straight.',
      'In the rail, the tooltip is a sibling span positioned to the right. Do not put the hover binding on the <i data-lucide> — Lucide swaps that element for an <svg> and the binding is lost.',
      'The rail is 68px so a 40px target keeps 14px either side. Below that the icons start colliding with the edge.'
    ],
    anatomy: [
      ['Group', 'An 11px uppercase label over a set of items. Present once the list passes about six entries.'],
      ['Item', 'Icon, label, and an optional right-aligned count.'],
      ['Active item', 'bg-zinc-100 plus aria-current="page" — the visual and the semantic halves of one statement.'],
      ['Count', 'Right-aligned and tabular-nums, so the numbers form a straight column.'],
      ['Rail tooltip', 'A sibling span shown on hover when the sidebar is collapsed. Never bound on the <i data-lucide>, which Lucide replaces.']
    ],
    behaviour: [
      'Exactly one item is current at a time, and it carries both the tint and aria-current — never one without the other.',
      'In the 68px rail, labels are hidden with lg:hidden rather than removed, so the DOM and the tab order do not change.',
      'The rail is 68px so a 40px target keeps 14px either side; below that the icons start colliding with the edge.',
      'Hovering a rail item reveals its name in a tooltip, because a column of unlabelled icons is unusable to a new user.',
      'Groups do not collapse. A navigation list that hides its own items adds a click to every journey.'
    ],
    a11y: [
      'The list is a <nav> with an accessible name, so it is a landmark.',
      'The current item carries aria-current="page", which is what a screen reader uses — the tint is for everyone else.',
      'Collapsed items keep an accessible name even with the label visually hidden.',
      'Counts are part of the item\'s accessible name — "Approvals, 12" rather than an unattached number.',
      'Group labels are real headings or list captions, so the structure is announced rather than only drawn.'
    ],
    related: ['app-shell', 'topbar', 'tabs'],
    variants: [
      { id: 'expanded', name: 'Expanded', code:
`<nav aria-label="Main" class="w-60 shrink-0 rounded-xl border border-zinc-200 bg-white p-2">
  <p class="px-2 pt-1 pb-1.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Operations</p>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="layout-dashboard" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Overview</span>
  </a>
  <a href="#" aria-current="page" class="flex items-center gap-2.5 rounded-lg bg-zinc-100 px-2 py-2 text-[13px]/5 font-medium">
    <i data-lucide="file-text" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Purchase orders</span>
    <span class="text-[11px]/4 tabular-nums text-zinc-600">148</span>
  </a>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="clipboard-list" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Requisitions</span>
    <span class="text-[11px]/4 tabular-nums text-zinc-600">62</span>
  </a>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="package-check" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Goods receipt</span>
    <span class="text-[11px]/4 tabular-nums text-zinc-600">27</span>
  </a>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="receipt" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Invoices</span>
    <span class="rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-1.5 py-0.5 text-[11px]/4 font-medium tabular-nums text-zinc-700">9</span>
  </a>

  <p class="px-2 pt-4 pb-1.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Master data</p>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="building-2" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Vendors</span>
    <span class="text-[11px]/4 tabular-nums text-zinc-600">187</span>
  </a>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="boxes" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Materials</span>
  </a>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="file-signature" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Rate contracts</span>
  </a>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="chart-no-axes-column" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Analytics</span>
  </a>

  <p class="px-2 pt-4 pb-1.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Saved views</p>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <span class="size-1.5 shrink-0 rounded-full bg-red-600"></span>
    <span class="flex-1 truncate">Overdue over 7 days</span>
    <span class="text-[11px]/4 tabular-nums text-zinc-600">18</span>
  </a>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <span class="size-1.5 shrink-0 rounded-full bg-amber-500"></span>
    <span class="flex-1 truncate">Awaiting GRN</span>
    <span class="text-[11px]/4 tabular-nums text-zinc-600">27</span>
  </a>
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <span class="size-1.5 shrink-0 rounded-full bg-zinc-400"></span>
    <span class="flex-1 truncate">My approvals</span>
    <span class="text-[11px]/4 tabular-nums text-zinc-600">6</span>
  </a>
</nav>` },
      { id: 'rail', name: 'Rail', code:
`<nav aria-label="Main" class="w-[68px] shrink-0 rounded-xl border border-zinc-200 bg-white py-2">
  <div class="group relative flex justify-center">
    <a href="#" aria-label="Overview" class="flex size-10 items-center justify-center rounded-lg hover:bg-zinc-100">
      <i data-lucide="layout-dashboard" class="size-4 text-zinc-600"></i>
    </a>
    <span class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block">Overview</span>
  </div>

  <div class="group relative mt-1 flex justify-center">
    <a href="#" aria-current="page" aria-label="Purchase orders"
       class="relative flex size-10 items-center justify-center rounded-lg bg-zinc-100">
      <i data-lucide="file-text" class="size-4 text-zinc-900"></i>
      <span class="absolute -top-0.5 -right-0.5 rounded-full bg-zinc-700 px-1.5 text-[11px]/4 tabular-nums text-white">148</span>
    </a>
    <span class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block">Purchase orders — 148</span>
  </div>

  <div class="group relative mt-1 flex justify-center">
    <a href="#" aria-label="Requisitions" class="flex size-10 items-center justify-center rounded-lg hover:bg-zinc-100">
      <i data-lucide="clipboard-list" class="size-4 text-zinc-600"></i>
    </a>
    <span class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block">Requisitions — 62</span>
  </div>

  <div class="group relative mt-1 flex justify-center">
    <a href="#" aria-label="Goods receipt" class="flex size-10 items-center justify-center rounded-lg hover:bg-zinc-100">
      <i data-lucide="package-check" class="size-4 text-zinc-600"></i>
    </a>
    <span class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block">Goods receipt — 27</span>
  </div>

  <div class="group relative mt-1 flex justify-center">
    <a href="#" aria-label="Invoices" class="relative flex size-10 items-center justify-center rounded-lg hover:bg-zinc-100">
      <i data-lucide="receipt" class="size-4 text-zinc-600"></i>
      <span class="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-600"></span>
    </a>
    <span class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block">Invoices — 9 on hold</span>
  </div>

  <div class="my-2 border-t border-zinc-100"></div>

  <div class="group relative flex justify-center">
    <a href="#" aria-label="Vendors" class="flex size-10 items-center justify-center rounded-lg hover:bg-zinc-100">
      <i data-lucide="building-2" class="size-4 text-zinc-600"></i>
    </a>
    <span class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block">Vendors — 187</span>
  </div>

  <div class="group relative mt-1 flex justify-center">
    <a href="#" aria-label="Analytics" class="flex size-10 items-center justify-center rounded-lg hover:bg-zinc-100">
      <i data-lucide="chart-no-axes-column" class="size-4 text-zinc-600"></i>
    </a>
    <span class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block">Analytics</span>
  </div>
</nav>` },
      { id: 'nested', name: 'With nested children', code:
`<nav aria-label="Main" class="w-60 shrink-0 rounded-xl border border-zinc-200 bg-white p-2"
     x-data="{ open: 'orders' }">
  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="layout-dashboard" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Overview</span>
  </a>

  <button @click="open = open === 'orders' ? '' : 'orders'" :aria-expanded="open === 'orders'"
          class="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="file-text" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Purchase orders</span>
    <span class="text-[11px]/4 tabular-nums text-zinc-600">148</span>
    <span class="flex transition-transform" :class="open === 'orders' && 'rotate-180'">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-500"></i>
    </span>
  </button>
  <div x-show="open === 'orders'" class="ml-[26px] border-l border-zinc-100 pl-2">
    <a href="#" aria-current="page" class="flex items-center gap-2 rounded-lg bg-zinc-100 px-2 py-1.5 text-[13px]/5 font-medium">
      <span class="flex-1">Awaiting GRN</span>
      <span class="text-[11px]/4 tabular-nums text-zinc-600">27</span>
    </a>
    <a href="#" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px]/5 hover:bg-zinc-100">
      <span class="flex-1">Overdue over 7 days</span>
      <span class="text-[11px]/4 tabular-nums text-zinc-600">18</span>
    </a>
    <a href="#" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px]/5 hover:bg-zinc-100">
      <span class="flex-1">My approvals</span>
      <span class="text-[11px]/4 tabular-nums text-zinc-600">6</span>
    </a>
    <a href="#" class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px]/5 hover:bg-zinc-100">
      <span class="flex-1">Closed</span>
    </a>
  </div>

  <button @click="open = open === 'vendors' ? '' : 'vendors'" :aria-expanded="open === 'vendors'"
          class="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="building-2" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Vendors</span>
    <span class="text-[11px]/4 tabular-nums text-zinc-600">187</span>
    <span class="flex transition-transform" :class="open === 'vendors' && 'rotate-180'">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-500"></i>
    </span>
  </button>
  <div x-show="open === 'vendors'" x-cloak class="ml-[26px] border-l border-zinc-100 pl-2">
    <a href="#" class="block rounded-lg px-2 py-1.5 text-[13px]/5 hover:bg-zinc-100">Approved</a>
    <a href="#" class="block rounded-lg px-2 py-1.5 text-[13px]/5 hover:bg-zinc-100">Pending KYC</a>
    <a href="#" class="block rounded-lg px-2 py-1.5 text-[13px]/5 hover:bg-zinc-100">Rate contracts</a>
  </div>

  <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px]/5 hover:bg-zinc-100">
    <i data-lucide="boxes" class="size-4 text-zinc-600"></i>
    <span class="flex-1">Materials</span>
  </a>
</nav>` }
    ]
  },

  {
    id: 'topbar', name: 'Topbar', category: 'navigation',
    description: 'The application header above the page content: where you are, what you can search, and who you are signed in as.',
    when: 'Every screen in the console. The page title and the primary action for the record belong in the page header below it, not here.',
    notes: [
      'The hamburger is lg:hidden and only ever opens the sidebar. It is not a second menu with its own items.',
      'Sticky needs an explicit background — sticky top-0 bg-white — or the content scrolls through it.',
      'A notification dot means unread, not a count. If the number matters, show the number.',
      'Below lg the search field collapses to an icon button. Do not shrink the input instead; it stops being usable around 200px.'
    ],
    anatomy: [
      ['Menu button', 'lg:hidden. The only way to open the sidebar on a phone, so it is never hidden there.'],
      ['Search', 'A wide input above lg, collapsing to an icon button below it.'],
      ['Notifications', 'A bell with a dot for unread. A dot means unread; if the number matters, show the number.'],
      ['Account', 'The avatar and the menu behind it.'],
      ['Surface', 'sticky top-0 with an explicit bg-white, or content scrolls straight through it.']
    ],
    behaviour: [
      'The hamburger only ever opens the sidebar. It is not a second menu with its own items.',
      'Sticky positioning needs an explicit background. Without one the topbar is transparent and content scrolls through it.',
      'Below lg the search collapses to an icon button rather than shrinking — an input stops being usable around 200px.',
      'The page title and the record\'s primary action belong in the page header below, not up here.',
      'The notification dot indicates unread state only. A count replaces it when the quantity is actionable.'
    ],
    a11y: [
      'The topbar is a <header> landmark, distinct from the sidebar\'s <nav>.',
      'The menu button has aria-label and aria-expanded reflecting the sidebar state.',
      'Search is a real labelled input inside a form, so Enter submits it.',
      'The unread dot is backed by text in the button\'s accessible name — "Notifications, unread" — since a dot announces nothing.',
      'The account menu follows the dropdown pattern: aria-haspopup, arrow keys and Escape.'
    ],
    related: ['app-shell', 'sidebar-nav', 'dropdown'],
    variants: [
      { id: 'default', name: 'Default', code:
`<header class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-3 sm:px-4">
  <button class="flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-zinc-100 lg:hidden" aria-label="Open navigation">
    <i data-lucide="menu" class="size-4"></i>
  </button>

  <nav aria-label="Breadcrumb" class="min-w-0">
    <ol class="flex items-center gap-1.5 text-[13px]/5">
      <li class="hidden sm:block"><a href="#" class="text-zinc-600 hover:text-zinc-900">Procurement</a></li>
      <li aria-hidden="true" class="hidden text-zinc-500 sm:block">/</li>
      <li><span aria-current="page" class="truncate font-medium">Purchase orders</span></li>
    </ol>
  </nav>

  <div class="ml-auto flex items-center gap-2">
    <button class="flex size-9 items-center justify-center rounded-lg hover:bg-zinc-100 lg:hidden" aria-label="Search">
      <i data-lucide="search" class="size-4 text-zinc-600"></i>
    </button>
    <div class="hidden w-64 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15 lg:flex">
      <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
      <label for="topbar-search" class="sr-only">Search orders, vendors and materials</label>
      <input id="topbar-search" placeholder="Search orders, vendors…"
             class="w-full bg-transparent px-2 py-1.5 text-[14px]/5 outline-none placeholder:text-zinc-500">
      <kbd class="mr-2 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">⌘K</kbd>
    </div>

    <span class="hidden items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2.5 py-1 text-[11px]/4 font-medium text-zinc-700 sm:flex">
      <span class="size-1.5 rounded-full bg-emerald-600"></span>Synced 2 min ago
    </span>

    <button class="relative flex size-9 items-center justify-center rounded-lg hover:bg-zinc-100" aria-label="Notifications, unread">
      <i data-lucide="bell" class="size-4 text-zinc-600"></i>
      <span class="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-600 ring-2 ring-white"></span>
    </button>

    <button class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[12px]/4 font-medium" aria-label="Account — Rajesh Menon">
      RM
    </button>
  </div>
</header>` },
      { id: 'compact', name: 'Compact', code:
`<header class="flex h-12 items-center gap-3 border-b border-zinc-200 bg-white px-3 sm:px-4">
  <h1 class="truncate text-[16px]/6 font-semibold">Konspec Operations</h1>
  <div class="ml-auto flex items-center gap-2">
    <button class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">Export</button>
    <button class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
      <i data-lucide="plus" class="size-4"></i><span class="hidden sm:inline">New order</span>
    </button>
  </div>
</header>` }
    ]
  },

  {
    id: 'accordion', name: 'Accordion', category: 'navigation',
    description: 'Sections of content that collapse to their heading. The heading is a button that toggles the panel below it.',
    when: 'Long forms broken into stages, or reference detail most people will not open. Never hide something the user has to act on.',
    notes: [
      'x-collapse needs the Alpine collapse plugin loaded before Alpine core. Without it the directive is ignored and the panel never shows — drop x-collapse and the plain x-show still works, it just snaps open instead of animating.',
      'The rotate binding goes on a wrapping <span>, never on the <i data-lucide>. Lucide replaces that element with an <svg> and the binding dies with it.',
      'Rotation needs a block-level box in Tailwind v4 — the wrapping span is flex for that reason.',
      'Give the header a fixed height. If it grows when open, the second click lands somewhere else.',
      'Every panel needs an id, and its button needs aria-controls pointing at it. Without that pairing a screen reader announces a button that expands nothing.',
      'Never put padding on the element x-collapse animates. box-sizing is border-box, so height:0 cannot go below the padding — the panel bottoms out at the padding height and then x-show removes it in a single frame, which reads as a snap. Put the padding on an inner div.'
    ],
    anatomy: [
      ['Root', 'Holds the open state. One x-data for the whole group when only one panel may be open, one per item when several may.'],
      ['Header', 'A real button at a fixed height, wrapped in a heading element so the group appears in the document outline.'],
      ['Indicator', 'A chevron in a flex span. The rotation class goes on the span, never on the icon.'],
      ['Panel', 'The collapsible region, carrying an id the header points at through aria-controls.'],
      ['Meta', 'Optional right-aligned summary — a count, an amount, a status — so the row is useful while closed.']
    ],
    behaviour: [
      'Clicking the header toggles its own panel. Clicking an open header closes it.',
      'In single-open mode, opening one panel closes the others. Track the open item by id, not by index, so reordering does not move the open state.',
      'A panel that starts closed needs x-cloak. A panel that starts open must not have it, or it stays hidden until Alpine boots.',
      'The header height does not change between states, so a second click always lands on the same control.'
    ],
    a11y: [
      'The header is a button, never a div with a click handler.',
      'aria-expanded reflects the open state and is bound, not hardcoded.',
      'aria-controls on the button matches the id on the panel.',
      'Wrap the header in h3, or whichever level fits the page outline, so screen readers can jump between sections.',
      'The chevron is decorative and carries no label — the heading text alone says what the section is.'
    ],
    related: ['tabs', 'card', 'drawer'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div class="rounded-xl border border-zinc-200 bg-white" x-data="{ open: true }">
  <h3>
    <button @click="open = !open" :aria-expanded="open" aria-controls="acc-delivery"
            class="flex h-12 w-full items-center gap-3 px-4 text-left">
      <span class="flex-1 text-[14px]/5 font-medium">Delivery and freight</span>
      <span class="text-[12px]/4 text-zinc-500">3 of 3 filled</span>
      <span class="flex transition-transform" :class="open && 'rotate-180'">
        <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
      </span>
    </button>
  </h3>
  <div id="acc-delivery" x-show="open" class="border-t border-zinc-100 px-4 py-3 text-[14px]/5">
    <dl class="grid gap-2 sm:grid-cols-2">
      <div><dt class="text-[12px]/4 text-zinc-600">Deliver to</dt><dd>Site store — Vasai plant</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Promised date</dt><dd class="tabular-nums">22 August 2026</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Freight</dt><dd class="tabular-nums">₹14,500 — to pay</dd></div>
    </dl>
  </div>
</div>` },

      { id: 'single', name: 'Single-open', code:
`<div class="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white" x-data="{ open: 'terms' }">
  <div>
    <h3>
      <button @click="open = open === 'terms' ? '' : 'terms'" :aria-expanded="open === 'terms'" aria-controls="acc-terms"
              class="flex h-12 w-full items-center gap-3 px-4 text-left">
        <span class="flex-1 text-[14px]/5 font-medium">Payment terms</span>
        <span class="flex transition-transform" :class="open === 'terms' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
        </span>
      </button>
    </h3>
    <div id="acc-terms" x-show="open === 'terms'" x-collapse.duration.200ms>
      <div class="px-4 pb-3 text-[14px]/5 text-zinc-600">
        45 days from GRN posting. 2% early-payment discount inside 10 days.
      </div>
    </div>
  </div>
  <div>
    <h3>
      <button @click="open = open === 'tax' ? '' : 'tax'" :aria-expanded="open === 'tax'" aria-controls="acc-tax"
              class="flex h-12 w-full items-center gap-3 px-4 text-left">
        <span class="flex-1 text-[14px]/5 font-medium">Tax and GST</span>
        <span class="flex transition-transform" :class="open === 'tax' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
        </span>
      </button>
    </h3>
    <div id="acc-tax" x-show="open === 'tax'" x-cloak x-collapse.duration.200ms>
      <div class="px-4 pb-3 text-[14px]/5 text-zinc-600">
        IGST 18% on <span class="tabular-nums">₹18,42,000</span>. Vendor GSTIN 24AABCG1429P1ZK verified 12 July.
      </div>
    </div>
  </div>
  <div>
    <h3>
      <button @click="open = open === 'qc' ? '' : 'qc'" :aria-expanded="open === 'qc'" aria-controls="acc-qc"
              class="flex h-12 w-full items-center gap-3 px-4 text-left">
        <span class="flex-1 text-[14px]/5 font-medium">Inspection</span>
        <span class="flex transition-transform" :class="open === 'qc' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
        </span>
      </button>
    </h3>
    <div id="acc-qc" x-show="open === 'qc'" x-cloak x-collapse.duration.200ms>
      <div class="px-4 pb-3 text-[14px]/5 text-zinc-600">
        Mill test certificate required per heat number. Reject on hardness outside 190–240 BHN.
      </div>
    </div>
  </div>
</div>` },

      { id: 'cards', name: 'Bordered card list', code:
`<div x-data="{ open: 'grn-3391' }" class="space-y-2">
  <div class="rounded-xl border border-zinc-200 bg-white">
    <h3>
      <button @click="open = open === 'grn-3391' ? '' : 'grn-3391'" :aria-expanded="open === 'grn-3391'" aria-controls="acc-grn-3391"
              class="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
          <i data-lucide="package-check" class="size-4 text-zinc-600"></i>
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[14px]/5 font-medium">GRN-3391 — Gujarat Polymers Ltd</span>
          <span class="block text-[12px]/4 text-zinc-600">Posted 11 August · 4 lines</span>
        </span>
        <span class="hidden text-[13px]/5 tabular-nums sm:block">₹6,18,400</span>
        <span class="flex transition-transform" :class="open === 'grn-3391' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
        </span>
      </button>
    </h3>
    <div id="acc-grn-3391" x-show="open === 'grn-3391'" class="border-t border-zinc-100 px-4 py-3 text-[14px]/5 text-zinc-600">
      HDPE granules 8,400 kg received against 8,600 kg ordered. Short-closed by R. Menon.
    </div>
  </div>

  <div class="rounded-xl border border-zinc-200 bg-white">
    <h3>
      <button @click="open = open === 'grn-3388' ? '' : 'grn-3388'" :aria-expanded="open === 'grn-3388'" aria-controls="acc-grn-3388"
              class="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
          <i data-lucide="package-check" class="size-4 text-zinc-600"></i>
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[14px]/5 font-medium">GRN-3388 — Sharma Steel Traders</span>
          <span class="block text-[12px]/4 text-zinc-600">Posted 8 August · 2 lines</span>
        </span>
        <span class="hidden text-[13px]/5 tabular-nums sm:block">₹2,74,900</span>
        <span class="flex transition-transform" :class="open === 'grn-3388' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
        </span>
      </button>
    </h3>
    <div id="acc-grn-3388" x-show="open === 'grn-3388'" x-cloak class="border-t border-zinc-100 px-4 py-3 text-[14px]/5 text-zinc-600">
      MS angle 50×50×6 — 12.4 t accepted, mill test certificates on file.
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'command-palette', name: 'Command palette', category: 'navigation',
    description: 'A ⌘K overlay for jumping to a record or firing an action by typing. It is a shortcut over the navigation, never the only route to something.',
    when: 'Consoles a person lives in all day with many destinations and records. Skip it on a three-page app — nobody will learn the shortcut.',
    notes: [
      'Everything reachable here must also be reachable by clicking. The palette is an accelerator, not a hiding place.',
      'Both ⌘K and Ctrl-K must work, and both need .prevent — the browser binds ⌘K to the address bar.',
      'x-cloak on the overlay, otherwise it paints over the page on first load.',
      'Autofocus the input when it opens with $nextTick, and clear the query on close so the next open starts fresh.'
    ],
    anatomy: [
      ['Overlay', 'A dimmed field with the panel near the top, not centred — the list grows downward.'],
      ['Input', 'Autofocused on open, with the query cleared on close so the next open starts fresh.'],
      ['Group', 'Results split by kind — records, actions, destinations — each under a small label.'],
      ['Result', 'One row, with the active one tinted. The keyboard drives which is active.'],
      ['Footer', 'The key legend. Nobody learns arrow keys and Enter from nothing.']
    ],
    behaviour: [
      'Everything reachable here is also reachable by clicking. The palette is an accelerator, never a hiding place.',
      'Both Cmd-K and Ctrl-K open it, and both need .prevent — the browser binds Cmd-K to the address bar.',
      'The input is focused on open with $nextTick, because focusing an element that x-show has not revealed yet does nothing.',
      'Arrow keys move the active result, Enter takes it, Escape closes.',
      'Closing clears the query, so reopening does not present the previous search as if it were current.',
      'On a three-page application, skip it entirely — nobody will learn the shortcut.'
    ],
    a11y: [
      'The input is a combobox with aria-expanded and aria-controls pointing at the list.',
      'The list is role="listbox" and each result role="option", with the active one marked aria-selected.',
      'aria-activedescendant tracks the active row, so focus stays in the input while the highlight moves.',
      'The result count is announced on change, or a keyboard user cannot tell that typing narrowed anything.',
      'Escape closes and returns focus to whatever opened the palette.'
    ],
    related: ['dropdown', 'topbar', 'sidebar-nav'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div x-data="{ open: false, q: '' }"
     @keydown.window.meta.k.prevent="open = true; $nextTick(() => $refs.q.focus())"
     @keydown.window.ctrl.k.prevent="open = true; $nextTick(() => $refs.q.focus())"
     @keydown.escape.window="open = false; q = ''">

  <button @click="open = true; $nextTick(() => $refs.q.focus())"
          class="flex w-full max-w-sm items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 text-zinc-500 hover:bg-zinc-100">
    <i data-lucide="search" class="size-4 text-zinc-600"></i>
    <span class="flex-1 text-left">Search Konspec Operations</span>
    <kbd class="rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4">⌘K</kbd>
  </button>

  <div x-show="open" x-cloak class="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/30 px-3 pt-16 sm:pt-24">
    <div @click.outside="open = false; q = ''"
         class="w-full max-w-xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

      <div class="flex items-center gap-2 border-b border-zinc-100 px-3">
        <i data-lucide="search" class="size-4 shrink-0 text-zinc-600"></i>
        <label for="cp-q" class="sr-only">Search orders, vendors and actions</label>
        <input id="cp-q" x-ref="q" x-model="q" placeholder="Search orders, vendors, actions…"
               class="w-full bg-transparent py-3 text-[14px]/5 outline-none placeholder:text-zinc-500">
        <button @click="open = false; q = ''" class="rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">Esc</button>
      </div>

      <div class="max-h-80 overflow-y-auto py-1">
        <p class="px-3 pt-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Actions</p>
        <button class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
          <i data-lucide="plus" class="size-4 text-zinc-600"></i>
          <span class="flex-1">New purchase order</span>
          <kbd class="rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">N</kbd>
        </button>
        <button class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
          <i data-lucide="package-check" class="size-4 text-zinc-600"></i>
          <span class="flex-1">Post goods receipt</span>
          <kbd class="rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">G</kbd>
        </button>
        <button class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
          <i data-lucide="check-check" class="size-4 text-zinc-600"></i>
          <span class="flex-1">Go to my approvals</span>
          <kbd class="rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">A</kbd>
        </button>

        <p class="px-3 pt-3 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Recent orders</p>
        <button class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
          <i data-lucide="file-text" class="size-4 shrink-0 text-zinc-600"></i>
          <span class="min-w-0 flex-1">
            <span class="block truncate">PO-24-1187 — Gujarat Polymers Ltd</span>
            <span class="block truncate text-[12px]/4 text-zinc-500">HDPE granules · 14 lines</span>
          </span>
          <span class="hidden shrink-0 text-[12px]/4 tabular-nums text-zinc-600 sm:block">₹18,42,000</span>
        </button>
        <button class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
          <i data-lucide="file-text" class="size-4 shrink-0 text-zinc-600"></i>
          <span class="min-w-0 flex-1">
            <span class="block truncate">PO-24-1179 — Sharma Steel Traders</span>
            <span class="block truncate text-[12px]/4 text-zinc-500">MS angle 50×50×6 · <span class="font-medium text-red-600">overdue 9 days</span></span>
          </span>
          <span class="hidden shrink-0 text-[12px]/4 tabular-nums text-zinc-600 sm:block">₹2,74,900</span>
        </button>
        <button class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
          <i data-lucide="building-2" class="size-4 shrink-0 text-zinc-600"></i>
          <span class="min-w-0 flex-1">
            <span class="block truncate">Deccan Fasteners Pvt Ltd</span>
            <span class="block truncate text-[12px]/4 text-zinc-500">Vendor · rate contract to 31 March 2027</span>
          </span>
        </button>
      </div>

      <div class="flex items-center gap-3 border-t border-zinc-100 px-3 py-2 text-[11px]/4 text-zinc-500">
        <span><kbd class="rounded border border-zinc-200 px-1 py-0.5">↑↓</kbd> move</span>
        <span><kbd class="rounded border border-zinc-200 px-1 py-0.5">↵</kbd> open</span>
        <span class="ml-auto">Konspec Operations</span>
      </div>
    </div>
  </div>
</div>` }
    ]
  }
);
