register(
  {
    id: 'table', name: 'Table', category: 'data',
    description: 'Rows of records with a sortable header. The workhorse of every register screen — order lists, GRN lists, ledgers.',
    when: 'More than about five records with more than two attributes each. For two or three fields per record a definition list reads better.',
    notes: [
      'Money and quantity cells get tabular-nums and text-right so digits line up. Text cells stay left.',
      'Status pills use the locked mapping: Open graphite, Approved amber, Overdue red, Closed emerald, Draft muted zinc. Do not reinterpret it per screen.',
      'Below md the table must not scroll sideways — render the same rows as stacked cards instead.',
      'The sort indicator belongs inside the <th> button, not beside the table. Only one column is sorted at a time.',
      'Selection state is an array of PO numbers on the component root. Nothing outside the snippet is read.'
    ],
    anatomy: [
      ['Header cell', 'A button inside the <th>, carrying the label and the sort indicator. The button is what is clickable, not the cell.'],
      ['Row', 'One record. Hover tints it zinc-50; selection tints it zinc-100 so the two states stay distinguishable.'],
      ['Numeric cell', 'tabular-nums and text-right, so digits stack into a readable column.'],
      ['Status cell', 'A pill from the locked mapping, and the only colour in the row.'],
      ['Action cell', 'Right-aligned, shrink-0, holding the row menu. Never wider than it needs to be.'],
      ['Stacked card', 'The same record rendered as a card below md, because a table that scrolls sideways on a phone is unusable.']
    ],
    behaviour: [
      'One column is sorted at a time, and the indicator sits in that column\'s header, never floating beside the table.',
      'Clicking a sorted header reverses it; clicking a different header moves the sort and resets to ascending.',
      'Selection lives as an array of record ids on the component root, so nothing outside the snippet has to be wired up.',
      'The header checkbox reflects three states — none, some, all — and \'some\' is indeterminate, not unchecked.',
      'Below md the table becomes stacked cards showing the same fields in the same order. It does not scroll sideways and columns are not hidden silently.',
      'Row hover and row selection are visually distinct, because a user scanning a selection needs to tell them apart.'
    ],
    a11y: [
      'Header cells are <th scope="col">, so a screen reader can name the column when reading a cell.',
      'The sortable header is a real button inside the <th>, and the <th> carries aria-sort reflecting the current direction.',
      'Each row checkbox has a label naming its record — twelve checkboxes all labelled "Select" are useless.',
      'The stacked-card layout carries the same information, not a reduced subset, so a phone user is not given less data.',
      'Row actions are reachable by keyboard; a menu that only appears on hover is invisible to anyone who cannot hover.'
    ],
    related: ['pagination', 'empty-state', 'skeleton'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5">
          <button class="flex items-center gap-1 text-[11px]/4 font-medium tracking-wider text-zinc-900 uppercase">
            PO number <i data-lucide="chevron-up" class="size-3.5"></i>
          </button>
        </th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Department</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Status</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Due</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="px-4 py-2.5">Sharma Extrusions</td>
        <td class="px-4 py-2.5 text-zinc-600">Fabrication</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹18,42,000</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-900">
            <span class="size-1.5 rounded-full bg-zinc-700"></span>Open
          </span>
        </td>
        <td class="px-4 py-2.5 text-right text-zinc-600 tabular-nums">12 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1191</td>
        <td class="px-4 py-2.5">Nashik Steel Traders</td>
        <td class="px-4 py-2.5 text-zinc-600">Dispatch</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹4,68,500</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-700">
            <span class="size-1.5 rounded-full bg-amber-500"></span>Approved
          </span>
        </td>
        <td class="px-4 py-2.5 text-right text-zinc-600 tabular-nums">19 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1194</td>
        <td class="px-4 py-2.5">Gujarat Polymers Ltd</td>
        <td class="px-4 py-2.5 text-zinc-600">Compounding</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹27,10,400</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-700">
            <span class="size-1.5 rounded-full bg-red-600"></span>Overdue
          </span>
        </td>
        <td class="px-4 py-2.5 text-right text-zinc-600 tabular-nums">02 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1203</td>
        <td class="px-4 py-2.5">Sharma Extrusions</td>
        <td class="px-4 py-2.5 text-zinc-600">Tooling</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹96,750</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-700">
            <span class="size-1.5 rounded-full bg-emerald-600"></span>Closed
          </span>
        </td>
        <td class="px-4 py-2.5 text-right text-zinc-600 tabular-nums">28 Jul</td>
      </tr>
      <tr class="hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1206</td>
        <td class="px-4 py-2.5">Nashik Steel Traders</td>
        <td class="px-4 py-2.5 text-zinc-600">Maintenance</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹1,32,900</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-600">
            <span class="size-1.5 rounded-full bg-zinc-400" aria-hidden="true"></span>Draft
          </span>
        </td>
        <td class="px-4 py-2.5 text-right text-zinc-500 tabular-nums">—</td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'selection', name: 'With selection', code:
`<div x-data="{ all: ['PO-24-1187','PO-24-1191','PO-24-1194'], sel: [] }"
     class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <div x-show="sel.length" x-cloak
       class="flex flex-wrap items-center gap-3 border-b border-zinc-200 bg-zinc-100 px-4 py-2">
    <span class="text-[13px]/5 font-medium"><span x-text="sel.length"></span> selected</span>
    <div class="flex flex-wrap items-center gap-2">
      <button class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve</button>
      <button class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">Export</button>
      <button class="rounded-lg px-3 py-1.5 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Cancel orders</button>
    </div>
    <button @click="sel = []" class="ml-auto text-[13px]/5 text-zinc-600 underline underline-offset-2">Clear</button>
  </div>
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="w-10 px-4 py-2.5">
          <input type="checkbox" aria-label="Select all orders" class="size-4 rounded accent-zinc-700"
                 :checked="sel.length === all.length"
                 @change="sel = $event.target.checked ? [...all] : []">
        </th>
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100" :class="sel.includes('PO-24-1187') ? 'bg-zinc-100' : 'hover:bg-zinc-100'">
        <td class="px-4 py-2.5">
          <input type="checkbox" value="PO-24-1187" x-model="sel" aria-label="Select PO-24-1187" class="size-4 rounded accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="px-4 py-2.5">Sharma Extrusions</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹18,42,000</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-900">
            <span class="size-1.5 rounded-full bg-zinc-700"></span>Open
          </span>
        </td>
      </tr>
      <tr class="border-b border-zinc-100" :class="sel.includes('PO-24-1191') ? 'bg-zinc-100' : 'hover:bg-zinc-100'">
        <td class="px-4 py-2.5">
          <input type="checkbox" value="PO-24-1191" x-model="sel" aria-label="Select PO-24-1191" class="size-4 rounded accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1191</td>
        <td class="px-4 py-2.5">Nashik Steel Traders</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹4,68,500</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-700">
            <span class="size-1.5 rounded-full bg-amber-500"></span>Approved
          </span>
        </td>
      </tr>
      <tr :class="sel.includes('PO-24-1194') ? 'bg-zinc-100' : 'hover:bg-zinc-100'">
        <td class="px-4 py-2.5">
          <input type="checkbox" value="PO-24-1194" x-model="sel" aria-label="Select PO-24-1194" class="size-4 rounded accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1194</td>
        <td class="px-4 py-2.5">Gujarat Polymers Ltd</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹27,10,400</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-700">
            <span class="size-1.5 rounded-full bg-red-600"></span>Overdue
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'dense', name: 'Dense', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-3 py-1.5 font-medium">PO number</th>
        <th scope="col" class="px-3 py-1.5 font-medium">Vendor</th>
        <th scope="col" class="px-3 py-1.5 font-medium">Dept</th>
        <th scope="col" class="px-3 py-1.5 text-right font-medium">Amount</th>
        <th scope="col" class="px-3 py-1.5 text-right font-medium">Due</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-3 py-1.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="px-3 py-1.5">Sharma Extrusions</td>
        <td class="px-3 py-1.5 text-zinc-600">Fabrication</td>
        <td class="px-3 py-1.5 text-right tabular-nums">₹18,42,000</td>
        <td class="px-3 py-1.5 text-right text-zinc-600 tabular-nums">12 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-3 py-1.5 font-medium tabular-nums">PO-24-1191</td>
        <td class="px-3 py-1.5">Nashik Steel Traders</td>
        <td class="px-3 py-1.5 text-zinc-600">Dispatch</td>
        <td class="px-3 py-1.5 text-right tabular-nums">₹4,68,500</td>
        <td class="px-3 py-1.5 text-right text-zinc-600 tabular-nums">19 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-3 py-1.5 font-medium tabular-nums">PO-24-1194</td>
        <td class="px-3 py-1.5">Gujarat Polymers Ltd</td>
        <td class="px-3 py-1.5 text-zinc-600">Compounding</td>
        <td class="px-3 py-1.5 text-right tabular-nums">₹27,10,400</td>
        <td class="px-3 py-1.5 text-right text-red-600 tabular-nums">02 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-3 py-1.5 font-medium tabular-nums">PO-24-1199</td>
        <td class="px-3 py-1.5">Nashik Steel Traders</td>
        <td class="px-3 py-1.5 text-zinc-600">Maintenance</td>
        <td class="px-3 py-1.5 text-right tabular-nums">₹1,32,900</td>
        <td class="px-3 py-1.5 text-right text-zinc-600 tabular-nums">22 Aug</td>
      </tr>
      <tr class="hover:bg-zinc-100">
        <td class="px-3 py-1.5 font-medium tabular-nums">PO-24-1203</td>
        <td class="px-3 py-1.5">Sharma Extrusions</td>
        <td class="px-3 py-1.5 text-zinc-600">Tooling</td>
        <td class="px-3 py-1.5 text-right tabular-nums">₹96,750</td>
        <td class="px-3 py-1.5 text-right text-zinc-600 tabular-nums">28 Jul</td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'responsive', name: 'Responsive', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <table class="hidden w-full text-[13px]/5 md:table">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Department</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Due</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="px-4 py-2.5">Sharma Extrusions</td>
        <td class="px-4 py-2.5 text-zinc-600">Fabrication</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹18,42,000</td>
        <td class="px-4 py-2.5 text-right text-zinc-600 tabular-nums">12 Aug</td>
      </tr>
      <tr class="hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1194</td>
        <td class="px-4 py-2.5">Gujarat Polymers Ltd</td>
        <td class="px-4 py-2.5 text-zinc-600">Compounding</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹27,10,400</td>
        <td class="px-4 py-2.5 text-right text-red-600 tabular-nums">02 Aug</td>
      </tr>
    </tbody>
  </table>

  <ul class="divide-y divide-zinc-100 md:hidden">
    <li class="px-4 py-3">
      <div class="flex items-baseline justify-between gap-3">
        <span class="text-[14px]/5 font-medium tabular-nums">PO-24-1187</span>
        <span class="text-[14px]/5 tabular-nums">₹18,42,000</span>
      </div>
      <p class="mt-0.5 text-[13px]/5 text-zinc-600">Sharma Extrusions · Fabrication</p>
      <div class="mt-2 flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-900">
          <span class="size-1.5 rounded-full bg-zinc-700"></span>Open
        </span>
        <span class="text-[12px]/4 text-zinc-500 tabular-nums">Due 12 Aug</span>
      </div>
    </li>
    <li class="px-4 py-3">
      <div class="flex items-baseline justify-between gap-3">
        <span class="text-[14px]/5 font-medium tabular-nums">PO-24-1194</span>
        <span class="text-[14px]/5 tabular-nums">₹27,10,400</span>
      </div>
      <p class="mt-0.5 text-[13px]/5 text-zinc-600">Gujarat Polymers Ltd · Compounding</p>
      <div class="mt-2 flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 text-zinc-700">
          <span class="size-1.5 rounded-full bg-red-600"></span>Overdue
        </span>
        <span class="text-[12px]/4 text-zinc-500 tabular-nums">Due 02 Aug</span>
      </div>
    </li>
  </ul>
</div>` }
    ]
  },

  {
    id: 'pagination', name: 'Pagination', category: 'data',
    description: 'Moves through a long register a page at a time, and says where you are in it.',
    when: 'Any list the server pages. Always show the range and the total — "Next" with no count tells the user nothing.',
    notes: [
      'Simple prev/next is enough below about ten pages. Numbers only earn their space when someone needs to jump.',
      'The current page gets aria-current="page". Disabled ends are real disabled buttons, not removed ones, so the control does not jump.'
    ],
    anatomy: [
      ['Range', '"Showing 21–40 of 1,438" — where you are and how much there is. Not optional.'],
      ['Previous / next', 'The controls people actually use. Disabled at the ends rather than removed.'],
      ['Page numbers', 'Only when someone genuinely needs to jump. Below about ten pages they are noise.'],
      ['Current page', 'Marked with aria-current and a solid graphite fill, so it reads as position and not as a button to press.'],
      ['Page size', 'Optional select. Changing it returns to page one, because page 7 of the old size means nothing at the new one.']
    ],
    behaviour: [
      'Ends disable rather than disappear, so the control keeps its width and the buttons stay under the cursor.',
      'Changing the page size resets to the first page and says how many rows are now shown.',
      'The range text updates with the page, and is the only thing that tells the user how much is left.',
      'Page numbers collapse with an ellipsis rather than growing without limit past about ten pages.',
      'The control sits below the table and inside the same panel, so it does not drift away from what it pages.'
    ],
    a11y: [
      'The whole control is a <nav> with aria-label="Pagination", so it can be skipped.',
      'The current page carries aria-current="page".',
      'Disabled ends are real disabled buttons, skipped by Tab and announced as unavailable.',
      'Every number is a link or button with an accessible name of the form "Page 4", never a bare digit.',
      'The range line is real text, not a title attribute, so it is read out with the rest of the page.'
    ],
    related: ['table', 'empty-state', 'dropdown'],
    variants: [
      { id: 'simple', name: 'Simple', code:
`<div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5">
  <p class="text-[13px]/5 text-zinc-600 tabular-nums">1–10 of 148 orders</p>
  <div class="flex items-center gap-2">
    <button disabled class="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[13px]/5 font-medium text-zinc-400">
      <i data-lucide="chevron-left" class="size-4"></i>Previous
    </button>
    <button class="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">
      Next<i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
</div>` },

      { id: 'numbered', name: 'Numbered', code:
`<nav aria-label="Order register pages" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5">
  <p class="text-[13px]/5 text-zinc-600 tabular-nums">31–40 of 148 orders</p>
  <div class="flex items-center gap-1">
    <button aria-label="Previous page" class="flex size-8 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-100">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>
    <button class="size-8 rounded-lg text-[13px]/5 tabular-nums hover:bg-zinc-100">1</button>
    <button class="size-8 rounded-lg text-[13px]/5 tabular-nums hover:bg-zinc-100">2</button>
    <button class="size-8 rounded-lg text-[13px]/5 tabular-nums hover:bg-zinc-100">3</button>
    <button aria-current="page" class="size-8 rounded-lg bg-zinc-700 text-[13px]/5 font-medium text-white tabular-nums">4</button>
    <button class="size-8 rounded-lg text-[13px]/5 tabular-nums hover:bg-zinc-100">5</button>
    <span class="px-1 text-[13px]/5 text-zinc-500">…</span>
    <button class="size-8 rounded-lg text-[13px]/5 tabular-nums hover:bg-zinc-100">15</button>
    <button aria-label="Next page" class="flex size-8 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-100">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
</nav>` },

      { id: 'page-size', name: 'With page size', code:
`<div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5">
  <div class="flex items-center gap-2">
    <label for="page-size" class="text-[13px]/5 text-zinc-600">Rows per page</label>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
      <select id="page-size" class="bg-transparent px-2 py-1.5 text-[13px]/5 tabular-nums outline-none">
        <option>10</option>
        <option selected>25</option>
        <option>50</option>
        <option>100</option>
      </select>
    </div>
  </div>
  <div class="flex flex-wrap items-center gap-3">
    <p class="text-[13px]/5 text-zinc-600 tabular-nums">26–50 of 148 orders</p>
    <div class="flex items-center gap-1">
      <button aria-label="Previous page" class="flex size-8 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-100">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>
      <button aria-label="Next page" class="flex size-8 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-100">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'stat-card', name: 'Stat card', category: 'data',
    description: 'One number that matters, with the label above it and the change since last period below.',
    when: 'The top strip of a dashboard. Not for a number nobody acts on — a tile per metric is how dashboards become wallpaper.',
    notes: [
      'The delta colour states whether the movement is good, not whether it is up. Rising overdue value is red even though the arrow points up.',
      'Always say what the delta is measured against. "+12%" alone is unreadable.',
      '<template x-for> does not work inside <svg>, so sparkline points are written out in the markup.'
    ],
    anatomy: [
      ['Label', 'What the number is, in 11px uppercase. Above the figure, because you read the label first.'],
      ['Figure', 'The number itself, tabular-nums, at the display step. The largest thing in the card.'],
      ['Delta', 'The change and what it is measured against. "+12% vs July", never a bare "+12%".'],
      ['Sparkline', 'Optional shape of the last few periods. Points are written out in the markup, since x-for cannot run inside an svg.'],
      ['Surface', 'A white card with a zinc border. No shadow — a dashboard of shadowed tiles reads as a toy.']
    ],
    behaviour: [
      'The delta colour states whether the movement is good, not whether it points up. Rising overdue value is red with an up arrow.',
      'A card with no delta is still valid; a delta with no comparison period is not.',
      'Figures align across a row of cards because they all use tabular-nums at the same step.',
      'The card is a link only if there is somewhere to go; a card that looks clickable and is not is worse than a plain one.',
      'Four cards is the practical ceiling in a row. More than that and nobody reads any of them.'
    ],
    a11y: [
      'Label and figure are one readable unit — a <dl> pairing, not two unrelated blocks.',
      'The delta arrow is decorative; the sign and the word carry the meaning for anyone who cannot see the colour.',
      'The sparkline is aria-hidden. It shows shape, not value, and the figure beside it is the actual data.',
      'If the card links somewhere, the whole card is the link, so the target is not a 12px arrow.',
      'Nothing in the card depends on colour alone to say whether the movement is good.'
    ],
    related: ['progress', 'card', 'table'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div class="rounded-xl border border-zinc-200 bg-white p-4">
  <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open order value</p>
  <p class="mt-1.5 text-[24px]/7 tracking-tight font-semibold tabular-nums">₹1,84,20,000</p>
  <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4">
    <span class="inline-flex items-center gap-1 font-medium text-emerald-600">
      <i data-lucide="trending-up" class="size-3.5"></i>8.4%
    </span>
    <span class="text-zinc-500">vs. last month</span>
  </p>
</div>` },

      { id: 'sparkline', name: 'With sparkline', code:
`<div class="rounded-xl border border-zinc-200 bg-white p-4">
  <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Orders raised — 12 weeks</p>
  <div class="mt-1.5 flex items-end justify-between gap-4">
    <div>
      <p class="text-[24px]/7 tracking-tight font-semibold tabular-nums">148</p>
      <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium text-emerald-600">
          <i data-lucide="trending-up" class="size-3.5"></i>11</span>
        <span class="text-zinc-500">vs. previous 12 weeks</span>
      </p>
    </div>
    <svg viewBox="0 0 120 36" class="h-9 w-30 shrink-0 text-zinc-500" fill="none" aria-hidden="true">
      <polyline points="0,28 11,24 22,26 33,18 44,21 55,14 66,16 77,9 88,12 99,7 110,10 120,4"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></polyline>
    </svg>
  </div>
</div>` },

      { id: 'grid', name: 'Grid of four', code:
`<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
  <div class="rounded-xl border border-zinc-200 bg-white p-4">
    <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open orders</p>
    <p class="mt-1.5 text-[24px]/7 tracking-tight font-semibold tabular-nums">148</p>
    <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4">
      <span class="inline-flex items-center gap-1 font-medium text-emerald-600"><i data-lucide="trending-up" class="size-3.5"></i>11</span>
      <span class="text-zinc-500">vs. last month</span>
    </p>
  </div>
  <div class="rounded-xl border border-zinc-200 bg-white p-4">
    <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open value</p>
    <p class="mt-1.5 text-[24px]/7 tracking-tight font-semibold tabular-nums">₹1,84,20,000</p>
    <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4">
      <span class="inline-flex items-center gap-1 font-medium text-emerald-600"><i data-lucide="trending-up" class="size-3.5"></i>8.4%</span>
      <span class="text-zinc-500">vs. last month</span>
    </p>
  </div>
  <div class="rounded-xl border border-zinc-200 bg-white p-4">
    <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Overdue</p>
    <p class="mt-1.5 text-[24px]/7 tracking-tight font-semibold tabular-nums">₹27,10,400</p>
    <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4">
      <span class="inline-flex items-center gap-1 font-medium text-red-600"><i data-lucide="trending-up" class="size-3.5"></i>3 orders</span>
      <span class="text-zinc-500">past due date</span>
    </p>
  </div>
  <div class="rounded-xl border border-zinc-200 bg-white p-4">
    <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Awaiting approval</p>
    <p class="mt-1.5 text-[24px]/7 tracking-tight font-semibold tabular-nums">9</p>
    <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4">
      <span class="inline-flex items-center gap-1 font-medium text-zinc-600"><i data-lucide="minus" class="size-3.5"></i>No change</span>
      <span class="text-zinc-500">since 12 Aug</span>
    </p>
  </div>
</div>` }
    ]
  },

  {
    id: 'progress', name: 'Progress', category: 'data',
    description: 'How far along something is — receipt against an order, a step in a workflow, a fill level in a row.',
    when: 'A quantity that moves toward a known total. For work with no known end use a spinner instead.',
    notes: [
      'Use role="progressbar" with aria-valuenow / aria-valuemin / aria-valuemax so the number is announced.',
      'The bar is graphite by default. When it tracks a record that has a status, take the colour from the locked status mapping — an overdue order gets a red bar — never colour it to make it look livelier.',
      'The percentage text is not optional — a bar alone cannot be read precisely.'
    ],
    anatomy: [
      ['Track', 'A 4px zinc-100 rail, rounded-full, that clips the fill.'],
      ['Fill', 'Graphite by default, width set as a percentage, with a transition so it moves rather than jumps.'],
      ['Label', 'The numbers behind the bar — "7,800 of 12,000 kg" — because a bar alone cannot be read precisely.'],
      ['Percentage', 'tabular-nums, so it does not shift the layout as it counts up.'],
      ['Segments', 'For a workflow with named stages, one block per stage rather than a continuous bar.']
    ],
    behaviour: [
      'The fill transitions its width; it never animates from zero on every render, which would read as a reload.',
      'A bar tracking a record with a status takes its colour from the locked status mapping — an overdue order gets a red bar.',
      'Work with no known total gets a spinner, not a bar. A bar implies an end.',
      'Values over 100% clamp visually but the number stays truthful, so over-receipt is visible rather than hidden.',
      'The segmented form marks the current stage distinctly from both the done ones and the ones still to come.'
    ],
    a11y: [
      'role="progressbar" with aria-valuenow, aria-valuemin and aria-valuemax, so the value is announced.',
      'aria-label names what is progressing — "Receipt against PO-24-1187", not "Progress".',
      'The percentage is real text beside the bar, not conveyed by the fill width alone.',
      'The segmented form uses a list, so the number of stages is announced.',
      'Colour never carries the state by itself; the label says which stage the work is at.'
    ],
    related: ['stat-card', 'attachment', 'skeleton'],
    variants: [
      { id: 'bar', name: 'Bar with label', code:
`<div class="rounded-xl border border-zinc-200 bg-white p-4">
  <div class="flex items-baseline justify-between gap-3">
    <p class="text-[13px]/5 font-medium">Receipt against PO-24-1187</p>
    <p class="text-[13px]/5 tabular-nums">68%</p>
  </div>
  <div class="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100"
       role="progressbar" aria-label="Receipt against PO-24-1187" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
    <div class="h-full rounded-full bg-zinc-700" style="width: 68%"></div>
  </div>
  <p class="mt-1.5 text-[12px]/4 text-zinc-500 tabular-nums">₹12,52,560 received of ₹18,42,000 · Sharma Extrusions</p>
</div>` },

      { id: 'steps', name: 'Segmented', code:
`<div class="rounded-xl border border-zinc-200 bg-white p-4">
  <div class="flex items-baseline justify-between gap-3">
    <p class="text-[13px]/5 font-medium">Lines received</p>
    <p class="text-[13px]/5 text-zinc-600 tabular-nums">6 of 14</p>
  </div>
  <div class="mt-2 flex gap-1" role="progressbar" aria-label="Lines received" aria-valuenow="6" aria-valuemin="0" aria-valuemax="14">
    <span class="h-2 flex-1 rounded-full bg-zinc-700"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-700"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-700"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-700"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-700"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-700"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-100"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-100"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-100"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-100"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-100"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-100"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-100"></span>
    <span class="h-2 flex-1 rounded-full bg-zinc-100"></span>
  </div>
  <p class="mt-1.5 text-[12px]/4 text-zinc-500">Last GRN 12 Aug · Nashik Steel Traders</p>
</div>` },

      { id: 'inline', name: 'Inline mini bar', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Received</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="px-4 py-2.5">Sharma Extrusions</td>
        <td class="px-4 py-2.5">
          <span class="flex items-center gap-2">
            <span class="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100"
                  role="progressbar" aria-label="Received against PO-24-1187" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
              <span class="block h-full rounded-full bg-zinc-700" style="width: 68%"></span>
            </span>
            <span class="text-[12px]/4 text-zinc-600 tabular-nums">68%</span>
          </span>
        </td>
      </tr>
      <tr>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1194</td>
        <td class="px-4 py-2.5">Gujarat Polymers Ltd</td>
        <td class="px-4 py-2.5">
          <span class="flex items-center gap-2">
            <span class="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100"
                  role="progressbar" aria-label="Received against PO-24-1194" aria-valuenow="12" aria-valuemin="0" aria-valuemax="100">
              <span class="block h-full rounded-full bg-red-600" style="width: 12%"></span>
            </span>
            <span class="text-[12px]/4 text-red-600 tabular-nums">12%</span>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>` }
    ]
  },

  {
    id: 'empty-state', name: 'Empty state', category: 'data',
    description: 'What a list shows when it has nothing in it. Says why it is empty and what to do next.',
    when: 'Every list, table and search result. An empty table with only a header reads as a bug.',
    notes: [
      'Nothing-yet and no-matches are different states and must not share one message. One offers a create action, the other offers to clear the filter.',
      'A load failure is not an empty state in disguise — say it failed and offer Retry, never "No orders found".',
      'Keep it inside the panel that would have held the rows, so the page does not reflow when data arrives.'
    ],
    anatomy: [
      ['Icon', 'A single muted glyph. It sets the tone; it carries no information.'],
      ['Headline', 'What is true right now, in one sentence. "No orders match these filters", not "No data".'],
      ['Explanation', 'Why it is empty, when that is not obvious from the headline.'],
      ['Action', 'The one thing to do next — create the first record, or clear the filter. Different per state.'],
      ['Container', 'The panel that would have held the rows, so the page does not reflow when data arrives.']
    ],
    behaviour: [
      'Nothing-yet and no-matches are different states with different actions and must never share a message.',
      'A load failure is not an empty state. It says the load failed and offers Retry, never "No orders found".',
      'The action matches the cause: clear the filter when filtered, create a record when genuinely new.',
      'It occupies the same box the data would have, so arriving data does not shift the page under the cursor.',
      'A first-run empty state is worth more effort than any other, because it is the first thing a new user sees.'
    ],
    a11y: [
      'The headline is a real heading at the level the surrounding page implies.',
      'The icon is aria-hidden — it is decoration and repeating it adds nothing.',
      'The action is a button or link, reachable by keyboard, not a clickable div.',
      'When the empty state replaces a table after a filter, the change is announced rather than only rendered.',
      'The error variant says what failed in words, since a red icon alone is not a message.'
    ],
    related: ['table', 'skeleton', 'alert'],
    variants: [
      { id: 'no-results', name: 'No results', code:
`<div class="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
  <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="search-x" class="size-5 text-zinc-600"></i>
  </span>
  <p class="mt-3 text-[16px]/6 font-semibold">No orders match these filters</p>
  <p class="mx-auto mt-1 max-w-sm text-[13px]/5 text-zinc-600">Vendor is Gujarat Polymers Ltd, status is Overdue and the date range is 01–12 Aug. Widen one of them.</p>
  <button class="mt-4 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Clear filters</button>
</div>` },

      { id: 'nothing-yet', name: 'Nothing created yet', code:
`<div class="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
  <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="file-text" class="size-5 text-zinc-600"></i>
  </span>
  <p class="mt-3 text-[16px]/6 font-semibold">No purchase orders yet</p>
  <p class="mx-auto mt-1 max-w-sm text-[13px]/5 text-zinc-600">Orders raised for Fabrication, Compounding, Dispatch, Maintenance and Tooling will appear here.</p>
  <button class="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
    <i data-lucide="plus" class="size-4"></i>New purchase order
  </button>
</div>` },

      { id: 'error', name: 'Error loading', code:
`<div class="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
  <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="alert-circle" class="size-5 text-red-600"></i>
  </span>
  <p class="mt-3 text-[16px]/6 font-semibold">Could not load the order register</p>
  <p class="mx-auto mt-1 max-w-sm text-[13px]/5 text-zinc-600">The request timed out after 30 seconds. Nothing was changed.</p>
  <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
    <button class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
      <i data-lucide="rotate-cw" class="size-4"></i>Retry
    </button>
    <a href="#" class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">Report this</a>
  </div>
</div>` }
    ]
  },

  {
    id: 'skeleton', name: 'Skeleton', category: 'data',
    description: 'Grey blocks in the shape of the content that is loading.',
    when: 'A load you expect to take more than about 300ms and whose layout you already know. For a short or unknown-shape load, use a spinner.',
    notes: [
      'The skeleton must match the real layout — same number of rows, same column widths — or the page jumps when data lands.',
      'Mark the container aria-busy="true" and aria-hidden the blocks, so a screen reader is not read a wall of nothing.',
      'animate-pulse only. A custom shimmer keyframe would not survive being pasted into another page.'
    ],
    anatomy: [
      ['Block', 'A zinc-100 rectangle at the size of the thing it stands in for, with animate-pulse.'],
      ['Row group', 'Blocks arranged in the real layout — same row count, same column widths.'],
      ['Container', 'Marked aria-busy while loading, so the state is known and not merely drawn.'],
      ['Variation', 'Slightly different widths on text lines, because a stack of identical bars does not read as text.']
    ],
    behaviour: [
      'The skeleton matches the real layout exactly, or the page jumps when the data lands.',
      'It appears only for loads expected to run past about 300ms; below that it is a flash of noise.',
      'It is replaced by content, never faded into it — a cross-fade makes the arrival harder to notice, not easier.',
      'animate-pulse only. A custom shimmer keyframe would not survive being pasted into another page.',
      'For a load whose shape is unknown, a spinner is honest and a skeleton is a guess.'
    ],
    a11y: [
      'The container carries aria-busy="true" so the wait is announced.',
      'The blocks themselves are aria-hidden, so a screen reader is not read a wall of nothing.',
      'Real content replaces the skeleton in the same container, so focus position survives the swap.',
      'Nothing in the skeleton is focusable — a Tab landing on a grey rectangle is a dead end.',
      'The animation respects prefers-reduced-motion, since a pulsing page is a problem for some readers.'
    ],
    related: ['empty-state', 'table', 'progress'],
    variants: [
      { id: 'text', name: 'Text lines', code:
`<div class="animate-pulse rounded-xl border border-zinc-200 bg-white p-4" aria-busy="true" aria-label="Loading order details">
  <div class="h-3 w-32 rounded bg-zinc-200"></div>
  <div class="mt-3 h-2.5 w-full rounded bg-zinc-200"></div>
  <div class="mt-2 h-2.5 w-full rounded bg-zinc-200"></div>
  <div class="mt-2 h-2.5 w-2/3 rounded bg-zinc-200"></div>
</div>` },

      { id: 'table', name: 'Table rows', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white" aria-busy="true" aria-label="Loading order register">
  <div class="animate-pulse">
    <div class="flex items-center gap-4 border-b border-zinc-200 px-4 py-2.5">
      <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      <div class="h-2.5 w-32 rounded bg-zinc-200"></div>
      <div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div>
    </div>
    <div class="flex items-center gap-4 border-b border-zinc-100 px-4 py-3">
      <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      <div class="h-2.5 w-40 rounded bg-zinc-200"></div>
      <div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div>
    </div>
    <div class="flex items-center gap-4 border-b border-zinc-100 px-4 py-3">
      <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      <div class="h-2.5 w-28 rounded bg-zinc-200"></div>
      <div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div>
    </div>
    <div class="flex items-center gap-4 border-b border-zinc-100 px-4 py-3">
      <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      <div class="h-2.5 w-36 rounded bg-zinc-200"></div>
      <div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div>
    </div>
    <div class="flex items-center gap-4 px-4 py-3">
      <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      <div class="h-2.5 w-32 rounded bg-zinc-200"></div>
      <div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div>
    </div>
  </div>
</div>` },

      { id: 'card', name: 'Card', code:
`<div class="animate-pulse rounded-xl border border-zinc-200 bg-white p-4" aria-busy="true" aria-label="Loading vendor summary">
  <div class="flex items-center gap-3">
    <div class="size-10 rounded-full bg-zinc-200"></div>
    <div class="flex-1">
      <div class="h-3 w-40 rounded bg-zinc-200"></div>
      <div class="mt-2 h-2.5 w-24 rounded bg-zinc-200"></div>
    </div>
  </div>
  <div class="mt-4 h-7 w-36 rounded bg-zinc-200"></div>
  <div class="mt-4 flex gap-2">
    <div class="h-8 w-24 rounded-lg bg-zinc-200"></div>
    <div class="h-8 w-20 rounded-lg bg-zinc-200"></div>
  </div>
</div>` }
    ]
  }
);
