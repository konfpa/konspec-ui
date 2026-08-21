register(
  {
    id: 'table', name: 'Table', category: 'data',
    description: 'Rows of records with a sortable header. The workhorse of every register screen — order lists, GRN lists, ledgers.',
    when: 'More than about five records with more than two attributes each. For two or three fields per record a definition list reads better. This is the table itself; when the screen wants a search box, paging and a selection around it, that assembled register is data-table.',
    notes: [
      'Money and quantity cells get tabular-nums and text-right so digits line up. Text cells stay left.',
      'Status pills use the locked mapping: Open graphite, Approved amber, Overdue red, Closed emerald, Draft muted zinc. Do not reinterpret it per screen.',
      'Below md the table must not scroll sideways — render the same rows as stacked cards instead.',
      'The sort indicator belongs inside the <th> button, not beside the table. Only one column is sorted at a time.',
      'Selection state is an array of PO numbers on the component root. Nothing outside the snippet is read.',
      'The sort chevron is a plain icon inside a span, and the span is what carries the state. createIcons() replaces the <i> with an <svg>, and any binding written on the icon goes with it.',
      'A panel holding a row menu cannot be overflow-hidden, or the menu on the bottom row is cut off at the panel edge. Once the clipping is gone the hover tint has to move onto the cells, because a tinted <tr> fills the rounded corners back in with a square.'
    ],
    anatomy: [
      ['Header cell', 'A button inside the <th>. The button carries the label and the sort chevron and is the thing clicked; the <th> carries scope and aria-sort.'],
      ['Row', 'One record. Where rows can be selected the selected tint is zinc-100 and hover a step lighter, so the two states never read as one.'],
      ['Numeric cell', 'tabular-nums and text-right, so digits stack into a readable column.'],
      ['Status cell', 'A pill from the locked mapping, and the only colour in the row.'],
      ['Action cell', 'Right-aligned and no wider than it needs to be, holding the row menu trigger.'],
      ['Row menu', 'A real menu on a real button: it opens on click, its items take focus one at a time, and Escape closes it back onto the trigger.'],
      ['Stacked card', 'The same record rendered as a card below md, because a table that scrolls sideways on a phone is unusable.']
    ],
    behaviour: [
      'Sorting lives in the default variant. Clicking a header sorts by that column ascending, clicking the sorted header reverses it, and the rows are really reordered. The other four variants carry no sort at all: take the state out of the default and put it where the screen needs it.',
      'One column is sorted at a time, and the indicator sits in that column\'s header, never floating beside the table.',
      'Selection lives as an array of record ids on the component root, so nothing outside the snippet has to be wired up.',
      'The header checkbox reflects three states — none, some, all — and \'some\' is indeterminate, not unchecked. indeterminate is a property, so it is written with x-effect on the box itself.',
      'The row menu opens on click rather than on hover, moves real focus between its items with the arrow keys, and closes on Escape or on a choice, handing focus back to the trigger.',
      'Below md the table becomes stacked cards showing the same fields in the same order. It does not scroll sideways and columns are not hidden silently.',
      'Where rows can be selected, hover and selection are different tints, because a user scanning a selection needs to tell them apart.'
    ],
    a11y: [
      'Header cells are <th scope="col">, so a screen reader can name the column when reading a cell.',
      'A sortable header is a real button inside the <th>, and that <th> carries aria-sort — ascending or descending on the sorted column, none on the other sortable ones. A column that does not sort is a plain <th> and carries no aria-sort at all.',
      'The chevron is decorative: Lucide marks the svg it generates aria-hidden, so the direction is announced from aria-sort and from nowhere else.',
      'Each row checkbox has a label naming its record — twelve checkboxes all labelled "Select" are useless.',
      'The stacked-card layout carries the same information, not a reduced subset, so a phone user is not given less data.',
      'Row actions are reachable by keyboard: the trigger is a button with aria-haspopup and aria-expanded, the panel is a role="menu" whose items take real focus, and nothing here appears only on hover, which would be invisible to anyone who cannot hover.'
    ],
    related: ['data-table', 'empty-state', 'skeleton'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- The chevron is a static Lucide icon inside a span, and the span is what
     carries the state: createIcons() replaces the <i> with an <svg>, so a
     binding written on the icon itself is thrown away on hydration. It is
     invisible rather than absent on the unsorted columns, so the header labels
     do not shift when the sort moves. -->
<div data-kui="table/default" x-data="{
       col: 'po', dir: 'asc',
       rows: [
         { po: 'PO-24-1187', vendor: 'Sharma Extrusions', dept: 'Fabrication', amount: 1842000, status: 'Open', due: '12 Aug' },
         { po: 'PO-24-1191', vendor: 'Nashik Steel Traders', dept: 'Dispatch', amount: 468500, status: 'Approved', due: '19 Aug' },
         { po: 'PO-24-1194', vendor: 'Gujarat Polymers Ltd', dept: 'Compounding', amount: 2710400, status: 'Overdue', due: '02 Aug' },
         { po: 'PO-24-1203', vendor: 'Sharma Extrusions', dept: 'Tooling', amount: 96750, status: 'Closed', due: '28 Jul' },
         { po: 'PO-24-1206', vendor: 'Nashik Steel Traders', dept: 'Maintenance', amount: 132900, status: 'Draft', due: '—' }
       ],
       dot: { Open: 'bg-zinc-700', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
       sortBy(c) { this.dir = this.col === c && this.dir === 'asc' ? 'desc' : 'asc'; this.col = c },
       ariaSort(c) { return this.col === c ? (this.dir === 'asc' ? 'ascending' : 'descending') : 'none' },
       money(n) { return '₹' + n.toLocaleString('en-IN') },
       get sorted() {
         const c = this.col, s = this.dir === 'asc' ? 1 : -1;
         return [...this.rows].sort((a, b) => s * (typeof a[c] === 'number' ? a[c] - b[c] : String(a[c]).localeCompare(b[c])));
       }
     }"
     class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" :aria-sort="ariaSort('po')" class="px-4 py-2.5">
          <button type="button" @click="sortBy('po')" class="flex items-center gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900" :class="col === 'po' && 'text-zinc-900'">
            PO number
            <span class="invisible" :class="{ 'invisible': col !== 'po', 'rotate-180': ariaSort('po') === 'descending' }"><i data-lucide="chevron-up" class="size-3.5"></i></span>
          </button>
        </th>
        <th scope="col" :aria-sort="ariaSort('vendor')" class="px-4 py-2.5">
          <button type="button" @click="sortBy('vendor')" class="flex items-center gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900" :class="col === 'vendor' && 'text-zinc-900'">
            Vendor
            <span class="invisible" :class="{ 'invisible': col !== 'vendor', 'rotate-180': ariaSort('vendor') === 'descending' }"><i data-lucide="chevron-up" class="size-3.5"></i></span>
          </button>
        </th>
        <th scope="col" class="px-4 py-2.5 font-medium">Department</th>
        <th scope="col" :aria-sort="ariaSort('amount')" class="px-4 py-2.5">
          <button type="button" @click="sortBy('amount')" class="flex w-full items-center justify-end gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900" :class="col === 'amount' && 'text-zinc-900'">
            Amount
            <span class="invisible" :class="{ 'invisible': col !== 'amount', 'rotate-180': ariaSort('amount') === 'descending' }"><i data-lucide="chevron-up" class="size-3.5"></i></span>
          </button>
        </th>
        <th scope="col" class="px-4 py-2.5 font-medium">Status</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Due</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in sorted" :key="r.po">
        <tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-100">
          <td class="px-4 py-2.5 font-medium tabular-nums" x-text="r.po"></td>
          <td class="px-4 py-2.5" x-text="r.vendor"></td>
          <td class="px-4 py-2.5 text-zinc-600" x-text="r.dept"></td>
          <td class="px-4 py-2.5 text-right tabular-nums" x-text="money(r.amount)"></td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 shrink-0 rounded-full" :class="dot[r.status]" aria-hidden="true"></span><span x-text="r.status"></span>
            </span>
          </td>
          <td class="px-4 py-2.5 text-right text-zinc-600 tabular-nums" x-text="r.due"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>` },

      { id: 'selection', name: 'With selection', code:
`<div data-kui="table/selection" x-data="{ all: ['PO-24-1187','PO-24-1191','PO-24-1194'], sel: [] }"
     class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <div x-show="sel.length" x-cloak
       class="flex flex-wrap items-center gap-3 border-b border-zinc-200 bg-zinc-100 px-4 py-2">
    <span class="text-[13px]/5 font-medium"><span x-text="sel.length"></span> selected</span>
    <div class="flex flex-wrap items-center gap-2">
      <button class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve</button>
      <button class="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">Export</button>
      <button class="rounded-lg px-3 py-1.5 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Cancel orders</button>
    </div>
    <button @click="sel = []" class="ml-auto text-[13px]/5 text-zinc-600 underline underline-offset-2">Clear</button>
  </div>
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="w-10 px-4 py-2.5">
          <input type="checkbox" aria-label="Select all three orders" class="size-4 rounded accent-zinc-700"
                 :checked="sel.length === all.length"
                 x-effect="$el.indeterminate = sel.length > 0 && sel.length < all.length"
                 @change="sel = $event.target.checked ? [...all] : []">
        </th>
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100" :class="sel.includes('PO-24-1187') ? 'bg-zinc-100' : 'hover:bg-zinc-50'">
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
      <tr class="border-b border-zinc-100" :class="sel.includes('PO-24-1191') ? 'bg-zinc-100' : 'hover:bg-zinc-50'">
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
      <tr :class="sel.includes('PO-24-1194') ? 'bg-zinc-100' : 'hover:bg-zinc-50'">
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

      { id: 'row-actions', name: 'Row actions', code:
`<!-- The panel is not overflow-hidden, because a row menu opening out of the
     last row has to be allowed to leave it. That leaves the corners to the
     rows: the hover tint is painted on the cells rather than on the <tr>, and
     the two cells at the bottom take the panel radius, or the last row fills
     the rounded corners in with a square of zinc-100.

     Each row owns its menu state, and the menu moves real focus between its
     items one tabindex="-1" at a time — the same idiom as the dropdown
     component. items() is read out of the DOM on every keystroke, so a row
     whose Approve is hidden by a permission check drops out of the keyboard
     order with it. -->
<div data-kui="table/row-actions" x-data="{
       rows: [
         { po: 'PO-24-1187', vendor: 'Sharma Extrusions', amount: '₹18,42,000', status: 'Open', dot: 'bg-zinc-700' },
         { po: 'PO-24-1191', vendor: 'Nashik Steel Traders', amount: '₹4,68,500', status: 'Approved', dot: 'bg-amber-500' },
         { po: 'PO-24-1194', vendor: 'Gujarat Polymers Ltd', amount: '₹27,10,400', status: 'Overdue', dot: 'bg-red-600' }
       ]
     }"
     class="rounded-xl border border-zinc-300 bg-white">
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Status</th>
        <th scope="col" class="w-12 px-4 py-2.5"><span class="sr-only">Row actions</span></th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in rows" :key="r.po">
        <tr class="border-b border-zinc-100 last:border-0 hover:[&>td]:bg-zinc-100 [&:last-child>td:first-child]:rounded-bl-xl [&:last-child>td:last-child]:rounded-br-xl">
          <td class="px-4 py-2 font-medium tabular-nums" x-text="r.po"></td>
          <td class="px-4 py-2" x-text="r.vendor"></td>
          <td class="px-4 py-2 text-right tabular-nums" x-text="r.amount"></td>
          <td class="px-4 py-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 shrink-0 rounded-full" :class="r.dot" aria-hidden="true"></span><span x-text="r.status"></span>
            </span>
          </td>
          <td class="w-12 px-4 py-2 text-right">
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
                   }
                 }"
                 @click.outside="close(false)"
                 @keydown.escape="if (open) { $event.stopPropagation(); close() }">
              <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
                      @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
                      :aria-expanded="open" aria-haspopup="menu" :aria-label="'Actions for ' + r.po"
                      class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
                <i data-lucide="more-horizontal" class="size-4"></i>
              </button>
              <div x-show="open" x-cloak x-ref="menu" role="menu" :aria-label="'Actions for ' + r.po"
                   @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
                   @keydown.tab="close(false)"
                   class="absolute right-0 z-40 mt-1 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 text-left shadow-lg">
                <button type="button" role="menuitem" tabindex="-1" @click="close()"
                        class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                  <i data-lucide="eye" class="size-4 text-zinc-600"></i>Open order
                </button>
                <button type="button" role="menuitem" tabindex="-1" @click="close()"
                        class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                  <i data-lucide="check" class="size-4 text-zinc-600"></i>Approve
                </button>

                <div role="separator" class="my-1 h-px bg-zinc-100"></div>

                <button type="button" role="menuitem" tabindex="-1" @click="close()"
                        class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                  <i data-lucide="x" class="size-4"></i>Cancel order
                </button>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</div>` },

      { id: 'dense', name: 'Dense', code:
`<div data-kui="table/dense" class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
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
`<div data-kui="table/responsive" class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
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
    id: 'data-table', name: 'Data table', category: 'data',
    description: 'The register screen assembled: a table with a search box, sortable headers, column visibility, row selection and a pager, all running off one array of records.',
    when: 'The main list screen of a module — the order register, the GRN register, the vendor list. If all you want is rows on a page, use table; this is table with working state around it, and every control it shows is one you then have to point at something real.',
    notes: [
      'Where the register holds its own data, every control is real state on the component root: the search filters the array, the column boxes hide cells, the headers reorder rows and the footer cuts the page out of the result. A toolbar whose controls do nothing is worse than no toolbar.',
      'The footer states the range and the total. "Next" with no count tells the user nothing.',
      'A filter that matches nothing has to say so. A register that filters to zero rows and shows a bare header reads as broken.',
      'indeterminate is a property with no matching attribute, so a select-all cannot be rendered mixed by the server. Bind it with x-effect on the box itself, not on the component root where $refs is not populated yet.',
      'The select-all covers the rows on the page in front of you and nothing beyond it. Say so in its label — "Select all" over a paged register is a promise the box does not keep.',
      'The panel cannot be overflow-hidden while the toolbar holds a menu, or the menu is clipped at the panel edge. The footer strip is what keeps the tinted rows off the rounded corners.',
      'Sort the filtered set and then cut the page out of it, in that order. Paging a sorted copy of the unfiltered array is how a register ends up showing rows that do not match the search.'
    ],
    anatomy: [
      ['Toolbar', 'The strip above the header row: search on the left, column visibility on the right. Filters live here, inside the panel, never floating above it.'],
      ['Search box', 'Filters the records as they are typed and returns to page one, because page 4 of a two-row result shows nothing.'],
      ['Column menu', 'A popover of checkboxes rather than a role="menu", because its items are settings and not commands. Hiding a column drops its header, its cells and the same field from the card layout.'],
      ['Bulk bar', 'Appears only when something is selected, carrying the count and the actions that apply to it, between the toolbar and the header row.'],
      ['Select-all', 'A box with no name and no value. It reads none, some or all off the rows on this page and writes indeterminate back through script.'],
      ['Sortable header', 'A button inside a <th>, and the <th> is what carries aria-sort. The chevron marks the sorted column and points the way the sort runs.'],
      ['Footer', 'The range, the total and the page position, with the ends disabled rather than removed so the control keeps its width.'],
      ['Empty state', 'What fills the panel when the filter matches nothing: what was searched for, and the way back out of it.']
    ],
    behaviour: [
      'The full register carries all of it — search, sort, column visibility, selection and paging. The compact one drops selection and the column menu and keeps search, sort and paging. The server-paged one holds no state at all: its search is a GET form, its headers and pager are links carrying q, sort and page, and htmx swaps the same panel back in.',
      'The search filters on every keystroke and resets to page one. The rows are filtered first, then sorted, then sliced into a page, so the pager can never disagree with the filter.',
      'Clicking a header sorts by that column ascending; clicking the sorted header reverses it. One column is sorted at a time and the rows are genuinely reordered.',
      'Hiding a column from the menu removes its header and its cells, and drops the same field from the card layout below md.',
      'Selection is an array of record ids on the root. It survives sorting, filtering and paging, so the count in the bulk bar is the whole selection while the header checkbox speaks only for the page in front of you.',
      'The header checkbox reads none, some or all off the rows on this page, and \'some\' is indeterminate rather than unchecked. Ticking it adds that page to the selection; unticking it releases only that page.',
      'When the filter matches nothing the rows are replaced by an empty state that names what was searched for and offers a control that clears it.',
      'The footer states the range and the total, and its ends disable rather than disappear so the buttons stay under the cursor.',
      'Below md the full register renders its rows as cards carrying the same fields and the same checkbox, while the compact and server-paged tables are three columns and stand at 390px as they are. The select-all stays in the table header, so at that width rows are selected one at a time.'
    ],
    a11y: [
      'The search box carries an aria-label saying what it searches. A magnifier icon is not a label.',
      'Sortable headers are buttons inside <th scope="col">, and the <th> carries aria-sort — ascending or descending on the sorted column, none on the rest.',
      'The column menu trigger carries aria-haspopup and aria-expanded, and Escape closes the popover and puts focus back on the trigger. The popover is a labelled group of checkboxes, not a role="menu".',
      'Every row checkbox is labelled with its PO number, and the select-all says how many rows on this page it covers.',
      'The select-all is a native box carrying the indeterminate property, which is already mapped to mixed. Nothing here writes aria-checked.',
      'The footer is a <nav> with a label, its range is real text rather than a title attribute, and the ends are real disabled buttons that Tab skips.',
      'Below md each card in the full register is one label wrapped round its checkbox, so the whole card is the target, and the box keeps an explicit aria-label so its name stays the PO number instead of the whole card.'
    ],
    related: ['table', 'pagination', 'dropdown'],
    variants: [
      { id: 'default', name: 'Full register', code:
`<!-- Everything the toolbar claims to do, it does: the search filters the array,
     the column boxes hide cells, the headers sort the rows and the footer pages
     what is left. Nothing outside this snippet is read or written.

     indeterminate is a property with no matching attribute, so the select-all
     cannot be rendered mixed by a server and is bound with x-effect on the
     element itself. It speaks for the rows on this page only, which is what
     its label says; the count in the bulk bar is the whole selection, which
     survives paging and filtering.

     The panel is not overflow-hidden: the column menu opens out of it. -->
<div data-kui="data-table/default" x-data="{
       q: '', col: 'po', dir: 'asc', page: 1, size: 5, sel: [],
       cols: { dept: true, status: true, due: true },
       rows: [
         { po: 'PO-24-1187', vendor: 'Sharma Extrusions', dept: 'Fabrication', amount: 1842000, status: 'Open', due: '12 Aug' },
         { po: 'PO-24-1191', vendor: 'Nashik Steel Traders', dept: 'Dispatch', amount: 468500, status: 'Approved', due: '19 Aug' },
         { po: 'PO-24-1194', vendor: 'Gujarat Polymers Ltd', dept: 'Compounding', amount: 2710400, status: 'Overdue', due: '02 Aug' },
         { po: 'PO-24-1199', vendor: 'Nashik Steel Traders', dept: 'Maintenance', amount: 132900, status: 'Open', due: '22 Aug' },
         { po: 'PO-24-1203', vendor: 'Sharma Extrusions', dept: 'Tooling', amount: 96750, status: 'Closed', due: '28 Jul' },
         { po: 'PO-24-1207', vendor: 'Gujarat Polymers Ltd', dept: 'Compounding', amount: 5460000, status: 'Approved', due: '30 Aug' },
         { po: 'PO-24-1211', vendor: 'Sharma Extrusions', dept: 'Fabrication', amount: 214300, status: 'Overdue', due: '05 Aug' },
         { po: 'PO-24-1214', vendor: 'Nashik Steel Traders', dept: 'Dispatch', amount: 78900, status: 'Draft', due: '—' },
         { po: 'PO-24-1218', vendor: 'Gujarat Polymers Ltd', dept: 'Tooling', amount: 1290500, status: 'Open', due: '08 Sep' },
         { po: 'PO-24-1221', vendor: 'Sharma Extrusions', dept: 'Maintenance', amount: 43200, status: 'Closed', due: '31 Jul' }
       ],
       dot: { Open: 'bg-zinc-700', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
       money(n) { return '₹' + n.toLocaleString('en-IN') },
       sortBy(c) { this.dir = this.col === c && this.dir === 'asc' ? 'desc' : 'asc'; this.col = c; this.page = 1 },
       ariaSort(c) { return this.col === c ? (this.dir === 'asc' ? 'ascending' : 'descending') : 'none' },
       get filtered() {
         const q = this.q.trim().toLowerCase(), c = this.col, s = this.dir === 'asc' ? 1 : -1;
         return this.rows
           .filter(r => !q || (r.po + ' ' + r.vendor + ' ' + r.dept).toLowerCase().includes(q))
           .sort((a, b) => s * (typeof a[c] === 'number' ? a[c] - b[c] : String(a[c]).localeCompare(b[c])));
       },
       get pages() { return Math.max(1, Math.ceil(this.filtered.length / this.size)) },
       get shown() { return this.filtered.slice((this.page - 1) * this.size, this.page * this.size) },
       get from() { return this.filtered.length ? (this.page - 1) * this.size + 1 : 0 },
       get to() { return Math.min(this.page * this.size, this.filtered.length) },
       get every() { return this.shown.length > 0 && this.shown.every(r => this.sel.includes(r.po)) },
       get some() { return !this.every && this.shown.some(r => this.sel.includes(r.po)) },
       toggleAll(on) {
         const ids = this.shown.map(r => r.po);
         this.sel = on ? [...new Set([...this.sel, ...ids])] : this.sel.filter(id => !ids.includes(id));
       }
     }"
     class="rounded-xl border border-zinc-300 bg-white">

  <div class="flex flex-wrap items-center gap-3 border-b border-zinc-200 px-4 py-3">
    <div class="flex min-w-48 flex-1 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
      <input type="search" x-model="q" @input="page = 1" aria-label="Search the order register"
             placeholder="Search PO, vendor or department"
             class="w-full bg-transparent px-2 py-1.5 text-[13px]/5 outline-none placeholder:text-zinc-500">
    </div>

    <div class="relative" x-data="{ open: false }" @click.outside="open = false"
         @keydown.escape="if (open) { open = false; $refs.colTrigger.focus() }">
      <button type="button" x-ref="colTrigger" @click="open = !open" :aria-expanded="open" aria-haspopup="true"
              class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">
        <i data-lucide="columns-3" class="size-4 text-zinc-600"></i>Columns
        <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
      </button>
      <div x-show="open" x-cloak role="group" aria-label="Columns shown"
           class="absolute right-0 z-40 mt-1 w-44 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
        <label class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px]/5 hover:bg-zinc-100">
          <input type="checkbox" x-model="cols.dept" class="size-4 shrink-0 accent-zinc-700">Department
        </label>
        <label class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px]/5 hover:bg-zinc-100">
          <input type="checkbox" x-model="cols.status" class="size-4 shrink-0 accent-zinc-700">Status
        </label>
        <label class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px]/5 hover:bg-zinc-100">
          <input type="checkbox" x-model="cols.due" class="size-4 shrink-0 accent-zinc-700">Due
        </label>
      </div>
    </div>
  </div>

  <div x-show="sel.length" x-cloak class="flex flex-wrap items-center gap-3 border-b border-zinc-200 bg-zinc-100 px-4 py-2">
    <span class="text-[13px]/5 font-medium"><span x-text="sel.length"></span> selected</span>
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve</button>
      <button type="button" class="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-50">Export</button>
    </div>
    <button type="button" @click="sel = []" class="ml-auto text-[13px]/5 text-zinc-900 underline underline-offset-2">Clear</button>
  </div>

  <table x-show="filtered.length" class="hidden w-full text-[13px]/5 md:table">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="w-10 px-4 py-2.5">
          <input type="checkbox" :aria-label="'Select the ' + shown.length + ' orders on this page'"
                 :checked="every" x-effect="$el.indeterminate = some" @change="toggleAll($event.target.checked)"
                 class="size-4 shrink-0 accent-zinc-700">
        </th>
        <th scope="col" :aria-sort="ariaSort('po')" class="px-4 py-2.5">
          <button type="button" @click="sortBy('po')" class="flex items-center gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900" :class="col === 'po' && 'text-zinc-900'">
            PO number
            <span class="invisible" :class="{ 'invisible': col !== 'po', 'rotate-180': ariaSort('po') === 'descending' }"><i data-lucide="chevron-up" class="size-3.5"></i></span>
          </button>
        </th>
        <th scope="col" :aria-sort="ariaSort('vendor')" class="px-4 py-2.5">
          <button type="button" @click="sortBy('vendor')" class="flex items-center gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900" :class="col === 'vendor' && 'text-zinc-900'">
            Vendor
            <span class="invisible" :class="{ 'invisible': col !== 'vendor', 'rotate-180': ariaSort('vendor') === 'descending' }"><i data-lucide="chevron-up" class="size-3.5"></i></span>
          </button>
        </th>
        <th x-show="cols.dept" scope="col" class="px-4 py-2.5 font-medium">Department</th>
        <th scope="col" :aria-sort="ariaSort('amount')" class="px-4 py-2.5">
          <button type="button" @click="sortBy('amount')" class="flex w-full items-center justify-end gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900" :class="col === 'amount' && 'text-zinc-900'">
            Amount
            <span class="invisible" :class="{ 'invisible': col !== 'amount', 'rotate-180': ariaSort('amount') === 'descending' }"><i data-lucide="chevron-up" class="size-3.5"></i></span>
          </button>
        </th>
        <th x-show="cols.status" scope="col" class="px-4 py-2.5 font-medium">Status</th>
        <th x-show="cols.due" scope="col" class="px-4 py-2.5 text-right font-medium">Due</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in shown" :key="r.po">
        <tr class="border-b border-zinc-100 last:border-0" :class="sel.includes(r.po) ? 'bg-zinc-100' : 'hover:bg-zinc-50'">
          <td class="px-4 py-2.5">
            <input type="checkbox" :value="r.po" x-model="sel" :aria-label="'Select ' + r.po" class="size-4 shrink-0 accent-zinc-700">
          </td>
          <td class="px-4 py-2.5 font-medium tabular-nums" x-text="r.po"></td>
          <td class="px-4 py-2.5" x-text="r.vendor"></td>
          <td x-show="cols.dept" class="px-4 py-2.5 text-zinc-600" x-text="r.dept"></td>
          <td class="px-4 py-2.5 text-right tabular-nums" x-text="money(r.amount)"></td>
          <td x-show="cols.status" class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 shrink-0 rounded-full" :class="dot[r.status]" aria-hidden="true"></span><span x-text="r.status"></span>
            </span>
          </td>
          <td x-show="cols.due" class="px-4 py-2.5 text-right text-zinc-600 tabular-nums" x-text="r.due"></td>
        </tr>
      </template>
    </tbody>
  </table>

  <ul x-show="filtered.length" class="divide-y divide-zinc-100 md:hidden">
    <template x-for="r in shown" :key="r.po">
      <li class="px-4 py-3" :class="sel.includes(r.po) && 'bg-zinc-100'">
        <label class="flex items-start gap-3">
          <input type="checkbox" :value="r.po" x-model="sel" :aria-label="'Select ' + r.po" class="mt-1 size-4 shrink-0 accent-zinc-700">
          <span class="min-w-0 flex-1">
            <span class="flex items-baseline justify-between gap-3">
              <span class="text-[14px]/5 font-medium tabular-nums" x-text="r.po"></span>
              <span class="text-[14px]/5 tabular-nums" x-text="money(r.amount)"></span>
            </span>
            <span class="mt-0.5 block text-[13px]/5 text-zinc-600" x-text="cols.dept ? r.vendor + ' · ' + r.dept : r.vendor"></span>
            <span class="mt-2 flex flex-wrap items-center gap-2">
              <span x-show="cols.status" class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
                <span class="size-1.5 shrink-0 rounded-full" :class="dot[r.status]" aria-hidden="true"></span><span x-text="r.status"></span>
              </span>
              <span x-show="cols.due" class="text-[12px]/4 text-zinc-500 tabular-nums" x-text="'Due ' + r.due"></span>
            </span>
          </span>
        </label>
      </li>
    </template>
  </ul>

  <div x-show="!filtered.length" x-cloak class="px-6 py-12 text-center">
    <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="search-x" class="size-5 text-zinc-600"></i>
    </span>
    <p class="mt-3 text-[16px]/6 font-semibold">No orders match this search</p>
    <p class="mx-auto mt-1 max-w-sm text-[13px]/5 text-zinc-600">Nothing in the register matches <span class="font-medium text-zinc-900" x-text="q"></span>. Search on a PO number, a vendor or a department.</p>
    <button type="button" @click="q = ''; page = 1" class="mt-4 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Clear the search</button>
  </div>

  <nav aria-label="Register pages" class="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-2.5">
    <p class="text-[13px]/5 text-zinc-600 tabular-nums"
       x-text="filtered.length ? from + '–' + to + ' of ' + filtered.length + ' orders' : 'No orders to show'"></p>
    <div class="flex items-center gap-2">
      <span class="text-[13px]/5 text-zinc-600 tabular-nums" x-text="'Page ' + page + ' of ' + pages"></span>
      <button type="button" @click="page--" :disabled="page === 1"
              class="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[13px]/5 font-medium enabled:hover:bg-zinc-100 disabled:text-zinc-400">
        <i data-lucide="chevron-left" class="size-4"></i>Previous
      </button>
      <button type="button" @click="page++" :disabled="page === pages"
              class="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[13px]/5 font-medium enabled:hover:bg-zinc-100 disabled:text-zinc-400">
        Next<i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </nav>
</div>` },

      { id: 'compact', name: 'Compact', code:
`<div data-kui="data-table/compact" x-data="{
       q: '', col: 'vendor', dir: 'asc', page: 1, size: 4,
       rows: [
         { po: 'PO-24-1187', vendor: 'Sharma Extrusions', amount: 1842000 },
         { po: 'PO-24-1191', vendor: 'Nashik Steel Traders', amount: 468500 },
         { po: 'PO-24-1194', vendor: 'Gujarat Polymers Ltd', amount: 2710400 },
         { po: 'PO-24-1199', vendor: 'Nashik Steel Traders', amount: 132900 },
         { po: 'PO-24-1203', vendor: 'Sharma Extrusions', amount: 96750 },
         { po: 'PO-24-1207', vendor: 'Gujarat Polymers Ltd', amount: 5460000 }
       ],
       money(n) { return '₹' + n.toLocaleString('en-IN') },
       sortBy(c) { this.dir = this.col === c && this.dir === 'asc' ? 'desc' : 'asc'; this.col = c; this.page = 1 },
       ariaSort(c) { return this.col === c ? (this.dir === 'asc' ? 'ascending' : 'descending') : 'none' },
       get filtered() {
         const q = this.q.trim().toLowerCase(), c = this.col, s = this.dir === 'asc' ? 1 : -1;
         return this.rows
           .filter(r => !q || (r.po + ' ' + r.vendor).toLowerCase().includes(q))
           .sort((a, b) => s * (typeof a[c] === 'number' ? a[c] - b[c] : String(a[c]).localeCompare(b[c])));
       },
       get pages() { return Math.max(1, Math.ceil(this.filtered.length / this.size)) },
       get shown() { return this.filtered.slice((this.page - 1) * this.size, this.page * this.size) },
       get from() { return this.filtered.length ? (this.page - 1) * this.size + 1 : 0 },
       get to() { return Math.min(this.page * this.size, this.filtered.length) }
     }"
     class="overflow-hidden rounded-xl border border-zinc-300 bg-white">

  <div class="border-b border-zinc-200 px-3 py-2.5">
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
      <input type="search" x-model="q" @input="page = 1" aria-label="Search orders" placeholder="Search PO or vendor"
             class="w-full bg-transparent px-2 py-1.5 text-[13px]/5 outline-none placeholder:text-zinc-500">
    </div>
  </div>

  <table x-show="filtered.length" class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" :aria-sort="ariaSort('po')" class="px-3 py-1.5">
          <button type="button" @click="sortBy('po')" class="flex items-center gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900" :class="col === 'po' && 'text-zinc-900'">
            PO number
            <span class="invisible" :class="{ 'invisible': col !== 'po', 'rotate-180': ariaSort('po') === 'descending' }"><i data-lucide="chevron-up" class="size-3.5"></i></span>
          </button>
        </th>
        <th scope="col" :aria-sort="ariaSort('vendor')" class="px-3 py-1.5">
          <button type="button" @click="sortBy('vendor')" class="flex items-center gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900" :class="col === 'vendor' && 'text-zinc-900'">
            Vendor
            <span class="invisible" :class="{ 'invisible': col !== 'vendor', 'rotate-180': ariaSort('vendor') === 'descending' }"><i data-lucide="chevron-up" class="size-3.5"></i></span>
          </button>
        </th>
        <th scope="col" :aria-sort="ariaSort('amount')" class="px-3 py-1.5">
          <button type="button" @click="sortBy('amount')" class="flex w-full items-center justify-end gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900" :class="col === 'amount' && 'text-zinc-900'">
            Amount
            <span class="invisible" :class="{ 'invisible': col !== 'amount', 'rotate-180': ariaSort('amount') === 'descending' }"><i data-lucide="chevron-up" class="size-3.5"></i></span>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in shown" :key="r.po">
        <tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-100">
          <td class="px-3 py-1.5 font-medium tabular-nums" x-text="r.po"></td>
          <td class="px-3 py-1.5" x-text="r.vendor"></td>
          <td class="px-3 py-1.5 text-right tabular-nums" x-text="money(r.amount)"></td>
        </tr>
      </template>
    </tbody>
  </table>

  <p x-show="!filtered.length" x-cloak class="px-3 py-8 text-center text-[13px]/5 text-zinc-600">
    No orders match <span class="font-medium text-zinc-900" x-text="q"></span>.
  </p>

  <nav aria-label="Register pages" class="flex items-center justify-between gap-3 border-t border-zinc-200 px-3 py-2">
    <p class="text-[13px]/5 text-zinc-600 tabular-nums"
       x-text="filtered.length ? from + '–' + to + ' of ' + filtered.length : '0 of 0'"></p>
    <div class="flex items-center gap-1">
      <button type="button" @click="page--" :disabled="page === 1" aria-label="Previous page"
              class="flex size-7 items-center justify-center rounded-lg border border-zinc-200 enabled:hover:bg-zinc-100 disabled:text-zinc-400">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>
      <button type="button" @click="page++" :disabled="page === pages" aria-label="Next page"
              class="flex size-7 items-center justify-center rounded-lg border border-zinc-200 enabled:hover:bg-zinc-100 disabled:text-zinc-400">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </nav>
</div>` },

      { id: 'server', name: 'Server-paged', code:
`<!-- Nothing here filters or sorts. The register is the server's, and this is
     only the controls and where they are wired: every one of them is a GET
     carrying q, sort and page, and htmx swaps the same #register div back in.
     They are links and a real form first, so the screen still works with the
     swap turned off, which is also what makes the browser Back button behave.

     The view hands the template one entry per sortable column — its aria value
     and the query string that would sort by it next — because working that out
     in the template means writing the same comparison three times and getting
     aria-sort and the chevron out of step with each other.

     Selection is deliberately absent: which rows are ticked is client state and
     does not survive a swap. Reach for the full register when you need it. -->

{# orders/register.html #}
<div data-kui="data-table/server" id="register" class="rounded-xl border border-zinc-300 bg-white">

  <form method="get" action="{% url 'order-register' %}"
        class="flex flex-wrap items-center gap-3 border-b border-zinc-200 px-4 py-3">
    <div class="flex min-w-48 flex-1 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
      <input type="search" name="q" value="{{ q }}" aria-label="Search the order register"
             placeholder="Search PO, vendor or department"
             hx-get="{% url 'order-register' %}" hx-trigger="input changed delay:300ms, search"
             hx-include="closest form" hx-target="#register" hx-swap="outerHTML" hx-push-url="true"
             class="w-full bg-transparent px-2 py-1.5 text-[13px]/5 outline-none placeholder:text-zinc-500">
    </div>
    <input type="hidden" name="sort" value="{{ sort }}">
    <button type="submit" class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">Search</button>
  </form>

  {% if page_obj %}
    <table class="w-full text-[13px]/5">
      <thead>
        <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
          {% for c in columns %}
            <th scope="col" aria-sort="{{ c.aria }}" class="px-4 py-2.5 {% if c.numeric %}text-right{% endif %}">
              <a href="?{{ c.query }}" hx-get="?{{ c.query }}" hx-target="#register" hx-swap="outerHTML" hx-push-url="true"
                 class="flex items-center gap-1 text-[11px]/4 font-medium tracking-wider uppercase hover:text-zinc-900 {% if c.numeric %}justify-end{% endif %} {% if c.aria != 'none' %}text-zinc-900{% endif %}">
                {{ c.label }}
                {% if c.aria != 'none' %}
                  <span class="{% if c.aria == 'descending' %}rotate-180{% endif %}"><i data-lucide="chevron-up" class="size-3.5"></i></span>
                {% endif %}
              </a>
            </th>
          {% endfor %}
        </tr>
      </thead>
      <tbody>
        {% for o in page_obj %}
          <tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-100">
            <td class="px-4 py-2.5 font-medium tabular-nums">{{ o.number }}</td>
            <td class="px-4 py-2.5">{{ o.vendor.name }}</td>
            <td class="px-4 py-2.5 text-right tabular-nums">₹{{ o.amount|intcomma }}</td>
          </tr>
        {% endfor %}
      </tbody>
    </table>

    <nav aria-label="Register pages" class="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-2.5">
      <p class="text-[13px]/5 text-zinc-600 tabular-nums">
        {{ page_obj.start_index }}–{{ page_obj.end_index }} of {{ page_obj.paginator.count }} orders
      </p>
      <div class="flex items-center gap-2">
        <span class="text-[13px]/5 text-zinc-600 tabular-nums">Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}</span>
        {% if page_obj.has_previous %}
          <a href="?{{ prev_query }}" hx-get="?{{ prev_query }}" hx-target="#register" hx-swap="outerHTML" hx-push-url="true"
             class="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">
            <i data-lucide="chevron-left" class="size-4"></i>Previous
          </a>
        {% else %}
          <button type="button" disabled class="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[13px]/5 font-medium text-zinc-400">
            <i data-lucide="chevron-left" class="size-4"></i>Previous
          </button>
        {% endif %}
        {% if page_obj.has_next %}
          <a href="?{{ next_query }}" hx-get="?{{ next_query }}" hx-target="#register" hx-swap="outerHTML" hx-push-url="true"
             class="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">
            Next<i data-lucide="chevron-right" class="size-4"></i>
          </a>
        {% else %}
          <button type="button" disabled class="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-[13px]/5 font-medium text-zinc-400">
            Next<i data-lucide="chevron-right" class="size-4"></i>
          </button>
        {% endif %}
      </div>
    </nav>
  {% else %}
    <div class="px-6 py-12 text-center">
      <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="search-x" class="size-5 text-zinc-600"></i>
      </span>
      <p class="mt-3 text-[16px]/6 font-semibold">No orders match this search</p>
      <p class="mx-auto mt-1 max-w-sm text-[13px]/5 text-zinc-600">Nothing in the register matches <span class="font-medium text-zinc-900">{{ q }}</span>. Search on a PO number, a vendor or a department.</p>
      <a href="{% url 'order-register' %}" hx-get="{% url 'order-register' %}" hx-target="#register" hx-swap="outerHTML" hx-push-url="true"
         class="mt-4 inline-block rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Clear the search</a>
    </div>
  {% endif %}
</div>

{# orders/views.py — the three query strings the template renders, built once

   def register(request):
       q = request.GET.get('q', '')
       sort = request.GET.get('sort', 'number')
       orders = Order.objects.filter(...).order_by(sort)
       page_obj = Paginator(orders, 25).get_page(request.GET.get('page'))
       columns = [column('number', 'PO number', sort, q),
                  column('vendor__name', 'Vendor', sort, q),
                  column('amount', 'Amount', sort, q, numeric=True)]
       ...

   where column() returns {'label', 'query', 'aria', 'numeric'} — query being
   urlencode({'q': q, 'sort': '-field' if already ascending on it else 'field'}),
   and aria being 'ascending', 'descending' or 'none'. #}` }
    ]
  },

  {
      id: 'pagination', name: 'Pagination', category: 'data',
      description: 'Moves through a long register a page at a time, and says where you are in it. The range and the total are the component; the arrows are only what you do about them.',
      when: 'A list that is cut into pages, by the server or on the client — the order register, a ledger, a GRN list. Below about ten pages the numbers are noise and the simple form is the whole component, because nobody jumps on a nine-page register. Above about a hundred pages, paging by number has stopped being navigation at all: nobody finds a record by walking to page 74, and what the screen actually needs is a filter, a date range or a search box. A feed that only grows downwards — an activity log, a comment thread — takes the load-more form, and takes it knowing what a cursor list gives up. When the pager belongs to an assembled register that also has a search box and sortable headers, data-table already contains one and a second pager under it is two controls fighting over the same state.',
      notes: [
        'The number row is a fixed count of slots at every page, not a window that grows. Seven is the working size: first, a gap or a page, three around the current one, a gap or a page, last — and the two gaps are slots, the same square as a page button. Measured across all fifteen pages of a 148-row register, the row came back 276px at every one of them, and across a 58-page one it came back 276px again. Let the row grow from three slots at the start to seven in the middle and the control changes width as somebody pages through it, which means Next slides out from under the pointer between the first click and the second. That is the whole reason truncation exists here; hiding pages is a side effect.',
        'Every slot is a fixed square — size-9, size-7 in the dense form — and never a min-width that the digits push wider. A cell sized to its content is one width on page 9 and another on page 10, so the row still moves as you walk it even with the slot count pinned. Measured at text-[13px]/5 with tabular-nums, a 144-page register renders 1 … 99 100 101 … 144 in seven 36px squares with scrollWidth equal to clientWidth on every one of them, so three digits fit with room either side. Four do not, which is the same 999-page ceiling above which paging by number was already the wrong control. tabular-nums goes on the buttons as well as on the range line: proportional figures inside a fixed square sit off-centre by a different amount on 1 than on 8, so a row of page numbers wanders even when every box is the same size.',
        'Each gap carries its own key. Measured in Alpine 3: an x-for over [1, "…", 4, 5, 6, "…", 15] keyed on the slot value renders six items rather than seven — the first ellipsis is dropped, because the second one claims the same key and the loop reuses the node. The row comes back one square narrow and the width rule fails silently in the one place it matters most. Two keys, gap-start and gap-end, and the count holds.',
        'The ellipsis is a character, not a control. It is aria-hidden, it is not a button, and it does not expand into the pages it stands for: an ellipsis that unfolds into five more numbers on click is the width change this component exists to prevent, arriving on purpose. Somebody who needs page 34 of 58 needs a filter, and the way to give them one is not to hide it behind a full stop three times over.',
        'The current page stays an enabled button. Disable it to show it cannot be pressed and the click that got you there blurs the element under the cursor — the browser drops focus from a disabled element to the body, so a keyboard user who pressed Page 5 is now at the top of the document with the register somewhere below them. It is a real button that sets the page it is already on, which costs nothing and keeps the focus where the user put it.',
        'Ends disable rather than disappear, and disabling them is not free either. Previous going away on page one shifts Next left by the width of a button, so the control under the pointer on the second click is not the one that was there on the first. Write enabled:hover: rather than hover:, or the disabled button still lights up under the cursor and reads as pressable. And an anchor cannot be disabled — aria-disabled on an <a href> leaves it focusable and clickable and lies about it — so a link-based pager swaps its edge control for a real <button disabled>, exactly as the server variant of data-table does.',
        'Do not disable the controls while a page is in flight. The button somebody just pressed is the one that would be disabled, so focus falls to the body mid-request and the second press that would have fetched the page after this one goes nowhere. Mark the nav aria-busy, leave the buttons alone, and guard the handler so a press while busy returns — that stops the double fetch without taking the control away from the person holding it. Measured through a full idle-busy-idle cycle: focus stayed on Next for the whole 1.4s request, and aria-busy came off by itself when the rows landed, because Alpine removes a false aria-busy rather than writing the string "false".',
        'The range and the total are not decoration and not optional. "Next" on its own is a rumour: it does not say whether there are two more rows or two thousand, which is the one fact that decides whether somebody pages or goes back and filters. Where the count is genuinely expensive — a COUNT over a partitioned ledger — say "of about 1,400" and mean it, or drop to prev/next with no total at all. Never render "of 0" while the count is still being fetched; a register that says it is empty and then fills in is a bug report. The separator between the two ends of the range is an en dash — 21–40, not 21-40 — because in tabular figures a hyphen sits low and short enough to read as a minus sign in a ledger.',
        'The page number belongs in the URL. A register paged only in Alpine loses your place the moment somebody opens a record and presses Back, and it cannot be sent to a colleague, bookmarked or reloaded — the three things people do with a list they have worked to get to. Client state is for the demo and for a table inside a dialog; a register screen carries ?page= and ?size= and reads them at boot.',
        'Changing the page size returns to page one, always. Page 7 at 25 rows is rows 151–175 and page 7 at 100 rows is rows 601–700, so keeping the number means somebody who wanted to see more rows is now four hundred rows further down a list they were reading. Recompute the range and say the new one; do not try to keep the first visible row in view, because that is a scroll position and this control does not own it.',
        'Below md the number row is gone and a "Page 3 of 12" line takes its place beside prev and next. Seven squares plus two labelled buttons plus a range line do not fit in 390px and the failure is a sideways scroll on the footer of a table that has just been restacked into cards to avoid exactly that. The controls stay 36px at that width even where the desktop form is dense — density is a mouse affordance and a phone is a thumb.',
        'Load-more is not pagination wearing a different button. It appends, so there is no page to link to, no Back to press, and printing gives you whatever had been loaded when somebody hit print; the count line has to change from a range to "Showing 24 of 47" because there is no longer a window, only a depth. Infinite scroll on top of it is worse still: it swallows the footer, and the footer is where the totals and the export live.'
      ],
      anatomy: [
        ['Nav', 'A real <nav> with an aria-label naming the register it pages. It is a navigation landmark so it can be jumped to and skipped, and the label is what tells two pagers on one screen apart.'],
        ['Range', '"21–40 of 1,438 orders" — where you are and how much there is, in a role="status" so a page change is announced and not only drawn. Real text, tabular-nums, an en dash, and never a title attribute.'],
        ['Page list', 'A ul role="list" of fixed slots, hidden below md. Preflight has already removed list-style, and WebKit reads that as "not a list", so the role goes back on by hand.'],
        ['Page button', 'A fixed square — size-9, size-7 dense — carrying tabular-nums, an accessible name of the form "Page 4", and aria-current="page" when it is the one you are on. The current one is filled graphite and stays enabled.'],
        ['Gap', 'The ellipsis slot. Same square as a page so the row keeps its width, aria-hidden, not focusable and not a button.'],
        ['Previous / next', 'The controls people actually use. h-9 labelled on the default form, size-9 icon-only where the row is tight, and real disabled buttons at the ends rather than removed ones.'],
        ['Page size', 'A native select labelled "Rows per page". Changing it resets to page one and rewrites the range.'],
        ['Position', '"Page 3 of 12", md:hidden. What stands in for the number row at 390px, so nothing scrolls sideways and the user still knows where they are.']
      ],
      behaviour: [
        'The number row is seven slots wide at every page. The pages inside it change; the width does not, so no button moves under the pointer between two clicks.',
        'The ends disable rather than disappear, and where the control that was pressed disables itself the focus moves to its opposite number instead of falling to the body.',
        'The current page is marked with aria-current and filled graphite, and pressing it does nothing but stay where it is.',
        'The range line updates with the page and is announced, because the rows underneath swap in silence.',
        'Changing the page size returns to page one and the range recomputes against the new size.',
        'While a page is in flight the nav is aria-busy, the buttons stay enabled, a second press is ignored, and the spinner beside the range appears only after 500ms so a fast page never flickers.',
        'Below md the number row is replaced by "Page 3 of 12" beside prev and next, and the range wraps onto its own line rather than the footer scrolling sideways.',
        'Load-more appends rather than replaces: the count says how many are shown of how many exist, and when the last batch lands the button is replaced by the total and focus moves to the count.',
        'Paging changes nothing else. The sort, the filter and the selection live above this control and survive it, which is why the range can say "filtered from 1,438" and be believed.'
      ],
      a11y: [
        'The control is a <nav> carrying an aria-label that names the register — "Order register pages". Two pagers on a screen carry two different labels, or the landmark list has two identical entries in it.',
        'The current page carries aria-current="page" and is not identified by the graphite fill alone. It stays an enabled button, because disabling the element that was just activated blurs it and drops focus to the body.',
        'Every page control has an accessible name of the form "Page 4", never a bare digit, and the name contains the visible digit so a voice-control user saying "click 4" still hits it. "Go to results 61 through 80" is a name that no longer contains its own label.',
        'The ellipsis is aria-hidden and is not in the tab order. It stands for pages that are not on offer, and a focus stop that leads nowhere is worse than the gap it marks.',
        'Disabled ends are real disabled buttons — skipped by Tab, announced as unavailable. An <a href> cannot be disabled, so a link pager renders a <button disabled> at the edge rather than an anchor wearing aria-disabled, which stays clickable.',
        'The range is text inside a role="status", present in the document before it changes, so paging is announced. The region holds the range and nothing else; a spinner beside it is aria-hidden and contributes no words.',
        'aria-busy goes on the nav while a page is being fetched, so the state is known and not merely drawn, and the content being replaced takes inert so Tab cannot walk into rows that are on their way out.',
        'Below md the number row is display:none and therefore out of the accessibility tree entirely, and the "Page 3 of 12" line that replaces it is real text — nothing that carried a name disappears without something saying the same thing.',
        'The page size select has a real <label for>, and changing it announces the new range through the same status region rather than moving focus.'
      ],
      related: ['data-table', 'table', 'empty-state', 'spinner'],
      variants: [
        { id: 'simple', name: 'Simple', code:
`<!-- Prev, next, and the sentence that makes them mean anything. Below about ten
     pages this is the whole component — numbers earn their space only when
     somebody has a reason to jump, and on a fifteen-page register nobody does.

     "Next" on its own is a rumour. It does not say whether two rows are left or
     two thousand, which is the fact that decides whether somebody pages or goes
     back and filters. The range and the total are the component.

     The range sits in a role="status" because paging swaps the rows underneath
     in silence: the visual answer arrives and the spoken one never does. The
     region is in the document before its text changes, which is the condition a
     live region has to meet, and the fallback text inside it is the state at
     first paint so nothing is announced on load.

     The ends disable rather than disappear. Remove Previous on page one and Next
     slides left by a button width, so the control under the pointer on the second
     click is not the one that was there on the first. enabled:hover: rather than
     hover:, or the disabled button still lights up under the cursor.

     Pressing Previous into page one disables Previous, and a browser blurs a
     disabled element to the body — so the handler hands focus to Next. Without
     it the keyboard user is at the top of the document with no way back but Tab. -->
<nav data-kui="pagination/simple" aria-label="Order register pages"
     x-data="{
       page: 3, size: 10, total: 148,
       get pages() { return Math.max(1, Math.ceil(this.total / this.size)) },
       get from() { return this.total ? (this.page - 1) * this.size + 1 : 0 },
       get to() { return Math.min(this.page * this.size, this.total) },
       prev() { this.page--; if (this.page === 1) this.$refs.next.focus() },
       next() { this.page++; if (this.page === this.pages) this.$refs.prev.focus() }
     }"
     class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-2.5">

  <p role="status" class="text-[13px]/5 tabular-nums text-zinc-600"
     x-text="from + '–' + to + ' of ' + total + ' orders'">21–30 of 148 orders</p>

  <div class="flex items-center gap-2">
    <button type="button" x-ref="prev" @click="prev()" :disabled="page === 1"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="chevron-left" class="size-4"></i>Previous
    </button>
    <button type="button" x-ref="next" @click="next()" :disabled="page === pages"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      Next<i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
</nav>` },

        { id: 'numbered', name: 'Numbered with truncation', code:
`<!-- The window is seven slots at every page and that is the point of it. First,
     a gap or a page, three around the current one, a gap or a page, last — walk
     from page 1 to page 15 and the row is seven squares wide the whole way, so
     Next never slides out from under the pointer between two clicks. A window
     that grows from three slots at the start to seven in the middle hides the
     same pages and moves every button while doing it.

     Each slot is a fixed square rather than a min-width the digits push wider,
     because a content-sized cell is one width on page 9 and another on page 10
     and the row still wanders with the count pinned. size-9 at text-[13px]/5
     tabular-nums holds three digits with room either side, which is the same
     999-page ceiling past which paging by number was already the wrong control.

     The two gaps carry distinct keys. Measured: :key="s" over
     [1, '…', 4, 5, 6, '…', 15] renders six items, not seven — the first ellipsis
     is dropped because the second claims the same key and the loop reuses its
     node — and the row comes back a square narrow, which is the width rule this
     variant exists for failing quietly.

     The ellipsis is a character. It is aria-hidden, it is not a button, and it
     does not expand — an ellipsis that unfolds into five more numbers is the
     width change, arriving on purpose. Somebody hunting page 34 of 58 needs the
     filter, and the filter is not hidden behind a full stop.

     The current page stays enabled. Disable it to show it cannot be pressed and
     the click that got you there blurs the element under the cursor, because a
     browser drops focus from a disabled element to the body.

     Below md the row is display:none and "Page 4 of 15" stands in its place.
     Seven squares and two buttons and a range do not fit in 390px, and the
     failure is a sideways scroll under a table that was restacked to avoid one. -->
<nav data-kui="pagination/numbered" aria-label="Order register pages"
     x-data="{
       page: 4, size: 10, total: 148,
       get pages() { return Math.max(1, Math.ceil(this.total / this.size)) },
       get from() { return this.total ? (this.page - 1) * this.size + 1 : 0 },
       get to() { return Math.min(this.page * this.size, this.total) },
       get slots() {
         const n = this.pages, p = this.page;
         if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
         if (p <= 4) return [1, 2, 3, 4, 5, 'gap-end', n];
         if (p >= n - 3) return [1, 'gap-start', n - 4, n - 3, n - 2, n - 1, n];
         return [1, 'gap-start', p - 1, p, p + 1, 'gap-end', n];
       },
       go(n) { this.page = Math.min(Math.max(n, 1), this.pages) }
     }"
     class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-2.5">

  <p role="status" class="text-[13px]/5 tabular-nums text-zinc-600"
     x-text="from + '–' + to + ' of ' + total + ' orders'">31–40 of 148 orders</p>

  <div class="flex items-center gap-2">
    <span class="text-[13px]/5 tabular-nums text-zinc-600 md:hidden" x-text="'Page ' + page + ' of ' + pages">Page 4 of 15</span>

    <button type="button" aria-label="Previous page" @click="go(page - 1)" :disabled="page === 1"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>

    <ul role="list" class="hidden items-center gap-1 md:flex">
      <template x-for="s in slots" :key="s">
        <li>
          <template x-if="typeof s === 'number'">
            <button type="button" @click="go(s)" :aria-label="'Page ' + s" :aria-current="s === page ? 'page' : false"
                    class="flex size-9 items-center justify-center rounded-lg text-[13px]/5 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                    :class="s === page ? 'bg-zinc-700 font-medium text-white' : 'hover:bg-zinc-100'"
                    x-text="s"></button>
          </template>
          <template x-if="typeof s !== 'number'">
            <span aria-hidden="true" class="flex size-9 items-center justify-center text-[13px]/5 text-zinc-500">…</span>
          </template>
        </li>
      </template>
    </ul>

    <button type="button" aria-label="Next page" @click="go(page + 1)" :disabled="page === pages"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
</nav>` },

        { id: 'range', name: 'The range line', code:
`<!-- The half of the component that is not a button, in the five states a real
     register puts it through. It is the only thing on the strip that says how
     much is left, so every one of these is worth getting right.

     "21–40 of 1,438 orders" and not "Showing 21–40 of 1,438". The verb adds a
     word to a line that is read a hundred times a day and says nothing the
     numbers had not already said; the noun is what earns its place, because
     "of 1,438" alone leaves the reader to remember what is being counted.

     An en dash between the two ends, not a hyphen. A hyphen joins, a dash spans,
     and in tabular figures the hyphen sits low and short enough to read as a
     minus in a ledger.

     Filtering keeps both numbers. "148 orders · filtered from 1,438" is what
     stops somebody concluding the register has lost fourteen hundred records,
     and it is the line that makes a search box safe to leave switched on.

     A count that is genuinely expensive gets an honest "about". A register that
     renders "of 0" while the count is still in flight, and fills it in a second
     later, is a bug report from whoever saw it first.

     One page of results does not get a range at all. "1–14 of 14 orders" is
     three numbers to say fourteen. -->
<div data-kui="pagination/range" class="max-w-xl space-y-2">
  <div class="rounded-xl border border-zinc-300 bg-white px-4 py-2.5">
    <p class="text-[13px]/5 tabular-nums text-zinc-600">21–40 of 1,438 orders</p>
    <p class="mt-1 text-[12px]/4 text-zinc-500">The ordinary case. Where you are, how much there is, and what is being counted.</p>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white px-4 py-2.5">
    <p class="text-[13px]/5 tabular-nums text-zinc-600">21–40 of 148 orders <span class="text-zinc-500">· filtered from 1,438</span></p>
    <p class="mt-1 text-[12px]/4 text-zinc-500">A filter is on. Both totals stay, or the register looks like it has lost 1,290 records.</p>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white px-4 py-2.5">
    <p class="text-[13px]/5 tabular-nums text-zinc-600">All 14 orders</p>
    <p class="mt-1 text-[12px]/4 text-zinc-500">One page. A range of 1–14 of 14 is three numbers to say fourteen.</p>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white px-4 py-2.5">
    <p class="text-[13px]/5 tabular-nums text-zinc-600">21–40 of about 1,400 orders</p>
    <p class="mt-1 text-[12px]/4 text-zinc-500">The count is a slow scan over a partitioned ledger. Say "about" rather than block the page on an exact figure nobody is reading.</p>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white px-4 py-2.5">
    <p class="text-[13px]/5 text-zinc-600">No orders match this filter</p>
    <p class="mt-1 text-[12px]/4 text-zinc-500">Zero is a sentence, not "0–0 of 0". The rows above it are an empty-state, and the pager keeps its ends disabled rather than vanishing.</p>
  </div>
</div>` },

        { id: 'page-size', name: 'With page size', code:
`<!-- The size select and the pager are one control and read left to right: how
     much is on a page, where in the register that page falls, and the arrows.
     They keep that order at every width — swapping the halves below md moves the
     thing somebody is about to press.

     Changing the size returns to page one, always. Page 7 at 25 rows is rows
     151–175 and page 7 at 100 rows is rows 601–700, so keeping the number sends
     somebody who asked to see more rows four hundred rows further down a list
     they were in the middle of reading. The range recomputes and the status
     region says the new one; nothing tries to hold the scroll position, because
     this control does not own it.

     A real <select> in a bordered wrapper, with a real <label for>. The wrapper
     draws the focus outline, which is the one case where outline-none on the
     control itself is allowed — the outline belongs to the enclosure, and
     leaving it on the select as well would draw two.

     x-model.number, not x-model. A select yields a string, so page arithmetic on
     it silently concatenates: '25' * 3 is 75 but (page - 1) * '25' + 1 is fine
     while total / '25' is fine and '25' + 1 is '251'. One of those turns up. -->
<nav data-kui="pagination/page-size" aria-label="Order register pages"
     x-data="{
       page: 2, size: 25, total: 148,
       get pages() { return Math.max(1, Math.ceil(this.total / this.size)) },
       get from() { return this.total ? (this.page - 1) * this.size + 1 : 0 },
       get to() { return Math.min(this.page * this.size, this.total) },
       go(n) { this.page = Math.min(Math.max(n, 1), this.pages) }
     }"
     class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-2.5">

  <div class="flex items-center gap-2">
    <label for="pager-size" class="text-[13px]/5 text-zinc-600">Rows per page</label>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <select id="pager-size" x-model.number="size" @change="page = 1"
              class="h-9 bg-transparent px-2 text-[13px]/5 tabular-nums outline-none">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <p role="status" class="text-[13px]/5 tabular-nums text-zinc-600"
       x-text="from + '–' + to + ' of ' + total + ' orders'">26–50 of 148 orders</p>
    <div class="flex items-center gap-1">
      <span class="mr-1 text-[13px]/5 tabular-nums text-zinc-600" x-text="'Page ' + page + ' of ' + pages">Page 2 of 6</span>
      <button type="button" aria-label="Previous page" @click="go(page - 1)" :disabled="page === 1"
              class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>
      <button type="button" aria-label="Next page" @click="go(page + 1)" :disabled="page === pages"
              class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </div>
</nav>` },

        { id: 'dense', name: 'Under a dense table', code:
`<!-- A dense table gets a dense footer or the strip under it is taller than four
     of its own rows. The rows here are px-3 py-1.5, the pager takes size-7 icon
     buttons and a text-[12px]/4 range, and the whole strip comes in under 40px.

     Density is a mouse affordance. Below md the controls go back to size-9,
     because 28px is a target for a pointer and not for a thumb, and the table
     above has restacked into something with room for them. size-9 md:size-7 is
     the whole of that rule and it is written once, on the button.

     No numbers at this size. Seven 28px squares in a strip this tight read as a
     row of specks, and a dense table is a thing you scan rather than a register
     you navigate — the position line carries what somebody actually needs.

     The panel is not overflow-hidden, so the focus outline at offset-2 is not
     clipped by the rounded corner. Where a panel has to clip, the pager's
     buttons take focus-visible:-outline-offset-2 instead and draw inside. -->
<div data-kui="pagination/dense" class="max-w-xl rounded-xl border border-zinc-300 bg-white"
     x-data="{
       page: 1, size: 4,
       rows: [
         { batch: 'BR-26-0881', item: 'HDPE compound, natural', kg: 4200, status: 'Closed' },
         { batch: 'BR-26-0882', item: 'HDPE compound, black 5%', kg: 3850, status: 'Closed' },
         { batch: 'BR-26-0883', item: 'LLDPE film grade', kg: 2600, status: 'Open' },
         { batch: 'BR-26-0884', item: 'Masterbatch, blue', kg: 480, status: 'Open' },
         { batch: 'BR-26-0885', item: 'HDPE compound, natural', kg: 4200, status: 'Approved' },
         { batch: 'BR-26-0886', item: 'Regrind, mixed', kg: 1750, status: 'Overdue' },
         { batch: 'BR-26-0887', item: 'LLDPE film grade', kg: 2600, status: 'Draft' },
         { batch: 'BR-26-0888', item: 'Masterbatch, white', kg: 320, status: 'Open' },
         { batch: 'BR-26-0889', item: 'HDPE compound, black 5%', kg: 3850, status: 'Closed' },
         { batch: 'BR-26-0890', item: 'Regrind, mixed', kg: 1750, status: 'Open' }
       ],
       dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
       get pages() { return Math.max(1, Math.ceil(this.rows.length / this.size)) },
       get shown() { return this.rows.slice((this.page - 1) * this.size, this.page * this.size) },
       get from() { return (this.page - 1) * this.size + 1 },
       get to() { return Math.min(this.page * this.size, this.rows.length) },
       go(n) { this.page = Math.min(Math.max(n, 1), this.pages) }
     }">

  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-3 py-1.5">Batch</th>
        <th scope="col" class="px-3 py-1.5">Item</th>
        <th scope="col" class="px-3 py-1.5 text-right">Kg</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in shown" :key="r.batch">
        <tr class="border-b border-zinc-100 last:border-0 hover:bg-zinc-100">
          <td class="px-3 py-1.5 font-medium tabular-nums" x-text="r.batch"></td>
          <td class="px-3 py-1.5">
            <span class="flex items-center gap-2">
              <span class="size-1.5 shrink-0 rounded-full" :class="dot[r.status]" aria-hidden="true"></span>
              <span class="sr-only" x-text="r.status"></span>
              <span class="truncate text-zinc-600" x-text="r.item"></span>
            </span>
          </td>
          <td class="px-3 py-1.5 text-right tabular-nums" x-text="r.kg.toLocaleString('en-IN')"></td>
        </tr>
      </template>
    </tbody>
  </table>

  <nav aria-label="Batch register pages" class="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 px-3 py-1.5">
    <p role="status" class="text-[12px]/4 tabular-nums text-zinc-500"
       x-text="from + '–' + to + ' of ' + rows.length + ' batches'">1–4 of 10 batches</p>
    <div class="flex items-center gap-1">
      <span class="mr-1 text-[12px]/4 tabular-nums text-zinc-500" x-text="'Page ' + page + ' of ' + pages">Page 1 of 3</span>
      <button type="button" aria-label="Previous page" @click="go(page - 1)" :disabled="page === 1"
              class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:size-7">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>
      <button type="button" aria-label="Next page" @click="go(page + 1)" :disabled="page === pages"
              class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 md:size-7">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </nav>
</div>` },

        { id: 'edges', name: 'Disabled at the ends', code:
`<!-- Four pages, so both ends are one click away and the rule is visible rather
     than described. First and Previous go dead together on page one; Next and
     Last go dead together on page four.

     They disable rather than disappear. Take Previous out of the DOM on page one
     and everything to its right slides left by 36px plus a gap, so the button
     under the pointer on the second click is not the one that was there on the
     first — the user pages twice and lands somewhere they did not ask for.

     enabled:hover: rather than hover:. A plain hover: on a disabled button still
     paints zinc-100 under the cursor, which is the one signal that says a
     control can be pressed, offered by a control that cannot.

     Focus is the half of this that gets missed. A browser blurs a disabled
     element to the body, so pressing Previous into page one drops the keyboard
     user at the top of the document with the register somewhere below them. Each
     handler checks whether the control it lives on has just gone dead and hands
     focus to its opposite number — Previous to Next, Last to Previous. Nothing
     moves for a mouse; everything is preserved for a keyboard.

     First and Last earn their place on a register deep enough that Last is a
     real question — "what is the oldest thing in here". On a five-page list they
     are two more controls saying what Previous and Next already said. -->
<nav data-kui="pagination/edges" aria-label="Receipt register pages"
     x-data="{
       page: 2, pages: 4,
       first() { this.page = 1; this.$refs.next.focus() },
       prev() { this.page--; if (this.page === 1) this.$refs.next.focus() },
       next() { this.page++; if (this.page === this.pages) this.$refs.prev.focus() },
       last() { this.page = this.pages; this.$refs.prev.focus() }
     }"
     class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-2.5">

  <p role="status" class="text-[13px]/5 tabular-nums text-zinc-600"
     x-text="((page - 1) * 25 + 1) + '–' + Math.min(page * 25, 94) + ' of 94 receipts'">26–50 of 94 receipts</p>

  <div class="flex items-center gap-1">
    <button type="button" aria-label="First page" @click="first()" :disabled="page === 1"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="chevrons-left" class="size-4"></i>
    </button>
    <button type="button" x-ref="prev" aria-label="Previous page" @click="prev()" :disabled="page === 1"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>
    <span class="px-2 text-[13px]/5 tabular-nums text-zinc-600" x-text="'Page ' + page + ' of ' + pages">Page 2 of 4</span>
    <button type="button" x-ref="next" aria-label="Next page" @click="next()" :disabled="page === pages"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
    <button type="button" aria-label="Last page" @click="last()" :disabled="page === pages"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="chevrons-right" class="size-4"></i>
    </button>
  </div>
</nav>` },

        { id: 'loading', name: 'While a page is in flight', code:
`<!-- The state between the click and the rows. The nav goes aria-busy, the table
     above goes inert, and the buttons stay exactly as they were.

     Do not disable the controls while the fetch is running. The button somebody
     just pressed is the one that would be disabled, and a browser blurs a
     disabled element to the body — so the keyboard user who pressed Next is now
     at the top of the document and the second press that would have fetched the
     page after this one goes nowhere. Guard the handler instead: a press while
     busy returns, which stops the double fetch without taking the control away
     from the person holding it.

     The ring is the spinner component's, borders and not a Lucide loader, and
     it is aria-hidden. It appears at 500ms, not at zero: the delay lives in the
     bound class with a delay-0 base, because a delay left in the base class
     delays the fade out as well and the ring is still turning half a second
     after the rows have landed. Most page fetches answer first and it never
     paints, which is what stops a register flickering on every click.

     Measured through one cycle: computed opacity was 0 at 100ms into a 1.4s
     fetch, 1 by 900ms, and back to 0 as the rows landed. Focus stayed on Next
     the whole way, and aria-busy came off by itself, because Alpine removes a
     false aria-busy rather than writing the string "false".

     It holds its box while invisible — opacity, never x-show — so the row does
     not widen when it arrives and take the button out from under the cursor.

     The announcement is the range, not the wait. It is already a role="status",
     it already changes when the page lands, and a second region saying "Loading"
     is a second thing talking over the first. The ring is for the eye.

     inert on the rows, not on the nav. A scrim stops a mouse and nothing else —
     Tab still walks into rows that are being replaced and Enter still fires a
     row action against them. Alpine treats inert as a boolean attribute, so a
     false value removes it rather than writing inert="false", which is a truthy
     string that would leave the table permanently unreachable. -->
<div data-kui="pagination/loading" class="max-w-xl rounded-xl border border-zinc-300 bg-white"
     x-data="{
       page: 2, pages: 6, size: 3, total: 18, busy: false, t: null,
       get from() { return (this.page - 1) * this.size + 1 },
       get to() { return Math.min(this.page * this.size, this.total) },
       get rows() { return [0, 1, 2].map(i => 'GRN-26-0' + (440 + (this.page - 1) * 3 + i)) },
       go(n) {
         if (this.busy || n < 1 || n > this.pages) return;
         this.busy = true;
         clearTimeout(this.t);
         this.t = setTimeout(() => { this.page = n; this.busy = false }, 1400);
       }
     }">

  <div :inert="busy">
    <table class="w-full text-[13px]/5">
      <thead>
        <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
          <th scope="col" class="px-4 py-2.5">Receipt</th>
          <th scope="col" class="px-4 py-2.5">Vendor</th>
        </tr>
      </thead>
      <tbody>
        <template x-for="g in rows" :key="g">
          <tr class="border-b border-zinc-100 last:border-0">
            <td class="px-4 py-2.5 font-medium tabular-nums" x-text="g"></td>
            <td class="px-4 py-2.5 text-zinc-600">Sharma Extrusions</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <nav aria-label="Receipt register pages" :aria-busy="busy"
       class="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-2.5">
    <div class="flex items-center gap-2">
      <span class="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700 opacity-0 transition-opacity delay-0"
            :class="busy && 'opacity-100 delay-500'" aria-hidden="true"></span>
      <p role="status" class="text-[13px]/5 tabular-nums text-zinc-600"
         x-text="from + '–' + to + ' of ' + total + ' receipts'">4–6 of 18 receipts</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-[13px]/5 tabular-nums text-zinc-600" x-text="'Page ' + page + ' of ' + pages">Page 2 of 6</span>
      <button type="button" @click="go(page - 1)" :disabled="page === 1"
              class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="chevron-left" class="size-4"></i>Previous
      </button>
      <button type="button" @click="go(page + 1)" :disabled="page === pages"
              class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Next<i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </nav>
</div>` },

        { id: 'load-more', name: 'Load more', code:
`<!-- Appending rather than paging, and it is a different component wearing the
     same footer. There is no window any more, only a depth, so the count line
     changes from a range to "Showing 6 of 21" and nothing here says "page".

     Know what it gives up before reaching for it. There is no page number to put
     in the URL, so the record somebody opens cannot be returned to with Back;
     the list cannot be sent to a colleague at the depth they reached; and
     printing gives you whatever happened to be loaded when they pressed print.
     That is acceptable for a feed nobody cites — an activity log, a comment
     thread — and wrong for a register somebody has to work from.

     Do not put infinite scroll on top of it. Auto-loading swallows the footer,
     and the footer is where the totals, the export and the page size live.

     The count is a role="status", so each batch is announced. Without it the
     rows arrive below the fold in silence and the only feedback is that the
     button moved down the page.

     Focus is the trap. When the last batch lands the button is replaced by a
     line of text, and a browser drops focus from a removed element to the body —
     so the handler moves focus to the count, which is tabindex="-1" for exactly
     that reason and is also the sentence that says what just happened. -->
<div data-kui="pagination/load-more" class="max-w-md rounded-xl border border-zinc-300 bg-white"
     x-data="{
       shown: 6, step: 6, total: 21,
       get rows() { return Array.from({ length: this.shown }, (_, i) => ({
         id: 'ENT-26-' + (3140 + i),
         who: ['Ritu Deshpande', 'Amit Kulkarni', 'Farida Qureshi'][i % 3],
         what: ['Approved PO-24-1187', 'Posted GRN-26-0442', 'Raised debit note DN-26-0117'][i % 3]
       })) },
       more() {
         const wasLast = this.shown + this.step >= this.total;
         this.shown = Math.min(this.shown + this.step, this.total);
         if (wasLast) this.$refs.count.focus();
       }
     }">

  <ul role="list" class="divide-y divide-zinc-100">
    <template x-for="r in rows" :key="r.id">
      <li class="flex items-start gap-2.5 px-4 py-2.5 text-[13px]/5">
        <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-400"></span></span>
        <span class="min-w-0 flex-1">
          <span class="block text-zinc-900" x-text="r.what"></span>
          <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-500" x-text="r.who + ' · ' + r.id"></span>
        </span>
      </li>
    </template>
  </ul>

  <div class="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-2.5">
    <p role="status" x-ref="count" tabindex="-1"
       class="text-[13px]/5 tabular-nums text-zinc-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
       x-text="shown >= total ? 'All ' + total + ' entries shown' : 'Showing ' + shown + ' of ' + total + ' entries'">Showing 6 of 21 entries</p>
    <button type="button" x-show="shown < total" @click="more()"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="chevron-down" class="size-4"></i>
      <span x-text="'Load ' + Math.min(step, total - shown) + ' more'">Load 6 more</span>
    </button>
  </div>
</div>` },

        { id: 'footer', name: 'Order register footer', code:
`<!-- The assembled thing: 1,438 purchase orders, 58 pages at 25 rows, every
     control wired to the same three numbers. Page to 58 and back and the number
     row is seven squares wide the whole way — that is the fixed window doing its
     job, and it is the reason Next is still under the pointer on the tenth click.

     Both gaps carry their own key. A slot list with '…' in it twice, keyed on
     the slot value, renders six squares instead of seven — measured — and the
     width rule fails quietly in the one variant where it matters most.

     The size select resets to page one. Page 30 at 25 rows is row 726; page 30
     at 100 rows is row 2,901, which is past the end of this register, so keeping
     the number would land somebody on an empty page after asking to see more.

     Below md the seven squares are display:none and "Page 12 of 58" stands in
     for them, the range wraps to its own line, and the footer of a table that
     was restacked into cards does not scroll sideways on its own.

     In a real screen the three numbers come from the server and the page goes in
     the URL — ?page=12&size=25 — so a record opened from row four can be closed
     with Back and land on page 12 again. Client state is what this snippet
     demonstrates and what a register screen should not ship. -->
<div data-kui="pagination/footer" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       page: 12, size: 25,
       rows: Array.from({ length: 1438 }, (_, i) => ({
         po: 'PO-24-' + (1187 + i),
         vendor: ['Sharma Extrusions', 'Nashik Steel Traders', 'Gujarat Polymers Ltd', 'Qureshi Metals'][i % 4],
         amount: 42000 + (i * 81371) % 5400000,
         status: ['Open', 'Approved', 'Overdue', 'Closed', 'Draft'][i % 5]
       })),
       dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
       money(n) { return '₹' + n.toLocaleString('en-IN') },
       get total() { return this.rows.length },
       get pages() { return Math.max(1, Math.ceil(this.total / this.size)) },
       get shown() { return this.rows.slice((this.page - 1) * this.size, (this.page - 1) * this.size + 4) },
       get from() { return this.total ? (this.page - 1) * this.size + 1 : 0 },
       get to() { return Math.min(this.page * this.size, this.total) },
       get slots() {
         const n = this.pages, p = this.page;
         if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
         if (p <= 4) return [1, 2, 3, 4, 5, 'gap-end', n];
         if (p >= n - 3) return [1, 'gap-start', n - 4, n - 3, n - 2, n - 1, n];
         return [1, 'gap-start', p - 1, p, p + 1, 'gap-end', n];
       },
       go(n) { this.page = Math.min(Math.max(n, 1), this.pages) },
       prev() { this.page--; if (this.page === 1) this.$refs.next.focus() },
       next() { this.page++; if (this.page === this.pages) this.$refs.prev.focus() }
     }">

  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5">PO number</th>
        <th scope="col" class="hidden px-4 py-2.5 sm:table-cell">Vendor</th>
        <th scope="col" class="px-4 py-2.5">Status</th>
        <th scope="col" class="px-4 py-2.5 text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in shown" :key="r.po">
        <tr class="border-b border-zinc-100 hover:bg-zinc-100">
          <td class="px-4 py-2.5 font-medium tabular-nums" x-text="r.po"></td>
          <td class="hidden px-4 py-2.5 text-zinc-600 sm:table-cell" x-text="r.vendor"></td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 shrink-0 rounded-full" :class="dot[r.status]" aria-hidden="true"></span><span x-text="r.status"></span>
            </span>
          </td>
          <td class="px-4 py-2.5 text-right tabular-nums" x-text="money(r.amount)"></td>
        </tr>
      </template>
      <tr>
        <td colspan="4" class="px-4 py-2.5 text-[12px]/4 text-zinc-500 tabular-nums">…and 21 more rows on this page</td>
      </tr>
    </tbody>
  </table>

  <nav aria-label="Order register pages" class="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-2.5">

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div class="flex items-center gap-2">
        <label for="order-pager-size" class="text-[13px]/5 text-zinc-600">Rows</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="order-pager-size" x-model.number="size" @change="page = 1"
                  class="h-9 bg-transparent px-2 text-[13px]/5 tabular-nums outline-none">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      <p role="status" class="text-[13px]/5 tabular-nums text-zinc-600"
         x-text="from.toLocaleString('en-IN') + '–' + to.toLocaleString('en-IN') + ' of ' + total.toLocaleString('en-IN') + ' orders'">276–300 of 1,438 orders</p>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-[13px]/5 tabular-nums text-zinc-600 md:hidden" x-text="'Page ' + page + ' of ' + pages">Page 12 of 58</span>

      <button type="button" x-ref="prev" aria-label="Previous page" @click="prev()" :disabled="page === 1"
              class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>

      <ul role="list" class="hidden items-center gap-1 md:flex">
        <template x-for="s in slots" :key="s">
          <li>
            <template x-if="typeof s === 'number'">
              <button type="button" @click="go(s)" :aria-label="'Page ' + s" :aria-current="s === page ? 'page' : false"
                      class="flex size-9 items-center justify-center rounded-lg text-[13px]/5 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                      :class="s === page ? 'bg-zinc-700 font-medium text-white' : 'hover:bg-zinc-100'"
                      x-text="s"></button>
            </template>
            <template x-if="typeof s !== 'number'">
              <span aria-hidden="true" class="flex size-9 items-center justify-center text-[13px]/5 text-zinc-500">…</span>
            </template>
          </li>
        </template>
      </ul>

      <button type="button" x-ref="next" aria-label="Next page" @click="next()" :disabled="page === pages"
              class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
  </nav>
</div>` }
      ]
    },

  {
    id: 'stat-card', name: 'Stat card', category: 'data',
    description: 'One number that matters, with the label above it and the change since the last period below. The tile a dashboard strip is made of, and the answer whenever the data is a single current value rather than a shape.',
    when: 'A number somebody acts on: open order value at the top of the procurement dashboard, overdue value, GRNs posted today, QC holds. It is also the right answer where a chart is the reflex — a one-bar bar chart and a two-slice donut are both a stat card that took a canvas to say one number. Reach for something else when the number has no audience, because a tile per metric is exactly how a dashboard becomes wallpaper; when the point is the shape rather than the level, which is the chart entry; and when the number is one cell of a comparison across vendors or plants, which is a table. A tile that nobody has ever opened the register from is a tile to delete.',
    notes: [
      'A delta is three things and drops none of them: an arrow, a signed number, and the period it is measured against. "+8.4%" on its own is not a fact — against last month, against the same month last year and against budget are three different stories, and the tile is silently claiming one of them. The three carriers are redundant on purpose. The arrow is what the eye picks up scanning four tiles, the sign is what survives a screen reader and forced-colours mode, and the tone is the third copy rather than the only one. Drop the sign and the whole delta is riding on an aria-hidden icon and a hue, which is the same failure twice.',
      'Up is not good. Direction and desirability are two independent facts and they live in two different places on the tile — the arrow follows the number, the tone follows whether the movement was wanted. Overdue value, scrap rate, QC holds, rework hours and days-to-close all read better falling, so their rising case is trending-up in red-600 and their falling case is trending-down in emerald-600, which looks wrong for exactly as long as it takes to read the label. Put the direction of good on the metric and not in the renderer: a good: "down" field on the record and a tone chosen by delta > 0 === (good === "up"). A template that paints from Math.sign(delta) is correct for revenue and quietly congratulates the buyer on every one of these.',
      'Flat is graphite. Emerald means finished, posted, sent — a metric that has not moved has not achieved anything, so it takes the minus icon, the words "No change", and zinc-600. Give the same treatment to movement under the noise floor of the measure: a 0.4% shift in open order value between two Tuesdays is one release note landing early, not a trend, and printing it to two decimal places to make it look like something is how a strip ends up green every morning and unread by Thursday. Pick the floor per metric — it is not the same for a count of nine approvals and for a crore of committed value.',
      'The figure takes tabular-nums, and this is the one place the general charting advice runs the other way. Proportional figures do set a large standalone number more tightly, and a stat card is never standalone: four tiles across collapse to one column below sm, at which point the figures are a column of numbers and have to align down the left edge, and any tile fed by a poll or an htmx swap reflows its own figure on every refresh while 1 and 8 are different widths. Both are the ordinary case here, not the exception. tabular-nums on the figure, on the delta and on any timestamp beside them.',
      'The unit is not part of the number. The rupee mark, the percent sign, "kg", "orders", "days" all sit one step down at text-[13px]/5 in zinc-500, baseline-aligned to the figure. A suffix set at 24px semibold is four characters of constant competing with three characters of data, and across a row it starts every figure at a different x so nothing lines up with anything. Compact the value rather than growing it — ₹1.84 Cr, not ₹1,84,20,000 — and leave the exact figure in the register the tile links to, which is where anyone who needs all eight digits is going next anyway.',
      'The label names the metric and its scope, and the strip says when it was read. "Open order value" is three different numbers depending on whether it means all plants or Silvassa, and whether it is live or from the 06:00 batch. A tile nobody can reconcile against the register gets reconciled by hand exactly once, disagrees by a lakh, and is never trusted again. Scope goes into the label or the line under it; the as-of time goes on the strip once rather than on all four tiles, where it would be four chances to disagree with itself.',
      'The tile is a plain div and carries no hover state unless the whole tile navigates. A border that darkens under the cursor is a promise of a destination, and a strip where two of four tiles keep that promise teaches people to stop trying any of them. When it does navigate it is one anchor around the whole tile, with the graphite focus outline and nothing else focusable inside it: a button nested in an anchor cannot be reached from the keyboard and is ambiguous with a mouse. If the tile needs a second action then the tile stops being the link and the label becomes one.',
      'Four across is the ceiling, and it is a ceiling on meaning rather than on width. Everything on a dashboard is somebody\'s most important number, so a strip of four becomes a strip of seven without anyone deciding to, and at seven nobody reads any of them — the fifth tile is a request to demote one of the first four, not to widen the row. Restack rather than shrink: grid-cols-1, sm:grid-cols-2, xl:grid-cols-4. A strip that scrolls sideways on a phone hides the tile that was the reason for the screen, and it is the tile on the right that goes.',
      'The sparkline is shape, and it is the chart entry\'s sparkline rather than a second one written here. Hand-writing the points into an inline svg is the obvious shortcut and it is a dead end: <template x-for> is parsed in the SVG namespace and has no .content, so those points can never be bound to the data and stay hand-written while the figure above them updates every morning. The chart entry already reads its colour out of a real class in the DOM and waits a frame for Tailwind\'s browser build to compile it; copy that block. With no axis and no labels a sparkline states direction and volatility and nothing else, so the figure beside it is the data and the canvas gets role="img" with a sentence naming both ends of the range.',
      'The loading state is a skeleton in the tile\'s own shape, not a spinner. The layout is known before the data is — label, figure, delta — so there is nothing for a ring to be honest about, and a ring centred in a tile collapses the box to the height of the ring and shuffles the whole page under the strip, twice, on every load. Use the skeleton entry\'s blocks at this tile\'s measurements and do not build a second set here. Each grey bar sits in a box the height of the line it stands in for, so the strip measures the same before and after the data lands.',
      'Zero and no data are different tiles. Zero overdue orders is a fact, it is good news, and it renders as 0 with its delta intact. No data is the absence of a fact — the QC register timed out, the plant has not posted since the cut-over, the metric did not exist before April — and it renders as an em dash at the figure\'s size with one line saying which of those it was. Printing 0 for a failed read is the failure that gets acted on: somebody sees zero holds, stops checking, and the line runs a shift on material that was never released.',
      'Colour in a tile is only ever the delta tone and a status dot. No tinted card, no coloured left border, no red tile for the bad metric. A field of colour behind a number shouts louder than the overdue rows it is describing, and the moment one tile is red the graphite ones read as switched off. This is the alert rule arriving on a dashboard, and it is the reason the delta tone still means something when it appears.'
    ],
    anatomy: [
      ['Tile', 'rounded-xl border border-zinc-300 bg-white p-4, and no shadow. The border already separates it from the zinc-100 page; a strip of shadowed tiles reads as a toy and stacks badly at 390px.'],
      ['Label', 'text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600, above the figure because the label is what you read first. It names the metric and its scope, not just the metric.'],
      ['Figure', 'The number, at text-[24px]/7 font-semibold tracking-tight tabular-nums. The largest thing in the tile and the only thing at that step, so the eye lands on it without being told to.'],
      ['Unit', 'The currency mark, the percent sign or the noun, at text-[13px]/5 in zinc-500 and baseline-aligned to the figure. Sized separately, always, so the digits across a row start at the same x.'],
      ['Delta', 'The arrow, the signed magnitude and the tone, at text-[12px]/4 font-medium tabular-nums. Emerald when the movement was wanted, red-600 when it was not, zinc-600 when there was none worth reporting.'],
      ['Comparison', 'The clause naming what the delta is measured against — "vs. July", "vs. previous 12 weeks", "since 12 Aug" — in zinc-500 beside the delta. Part of the delta, not a caption under it.'],
      ['Trend', 'The optional twelve-point sparkline, drawn by the chart entry on a canvas with role="img". Shape only: it carries no scale and never stands in for the figure.'],
      ['Strip', 'The grid the tiles sit in — grid-cols-1, sm:grid-cols-2, xl:grid-cols-4, gap-3 — carrying the section heading and the as-of time once for all of them.']
    ],
    behaviour: [
      'The delta states direction with an arrow and a sign, and desirability with the tone, from two different fields. A rising overdue value shows an up arrow in red and a falling one a down arrow in emerald.',
      'A tile with no delta is valid; a delta with no comparison period is not. The period is part of the delta, not a caption beneath it.',
      'Small counts move in absolute terms, not percent. Nine approvals becoming twelve is "+3", because "+33%" on a base of nine claims a precision the number does not have.',
      'Figures align across the strip because every one is tabular-nums at the same step, and they stay aligned when four tiles become one column at 390px.',
      'The tile is inert unless the whole tile navigates — no hover, no pointer, no chevron. When it is a link the anchor wraps everything and holds the only focus stop inside the tile.',
      'Loading draws a skeleton at the tile\'s own measurements, so the strip is the same height before and after the data lands and nothing below it moves.',
      'No data shows an em dash and says why. Zero shows 0 and keeps its delta, because zero is an answer.',
      'A status value is the word plus the locked dot, at the heading step rather than the figure step, because a status is read and a number is scanned.',
      'Four across, restacking at sm and below, and nothing scrolls sideways. The fifth metric is a decision about which of the four to demote.'
    ],
    a11y: [
      'Each tile is a dt and dd pair inside a dl, so the label and the figure are one unit in the accessibility tree instead of two adjacent orphans. The delta is a second dd under the same dt.',
      'The arrow is aria-hidden and the sign is real text, so "+8.4% vs. July" still reads with the icon and the colour both gone. Nothing in a tile depends on colour alone.',
      'A metric where up is bad says so in words — "Overdue value" beside "+₹4.10 L vs. 12 Aug" is unambiguous without the red, which matters because red is exactly what forced-colours mode takes away.',
      'The sparkline canvas takes role="img" and an aria-label naming both ends of the range and the shape between them. It is not aria-hidden: that sentence is the only route to the trend for anyone not reading the picture.',
      'When the tile navigates, the anchor wraps the whole tile and its accessible name is the tile\'s own text — "Overdue value, ₹27.10 L, up ₹4.10 L vs. 12 Aug". Nothing else inside is focusable, so Tab walks the strip one tile at a time.',
      'Focus is an outline and never a ring: focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15. A ring compiles to a box-shadow and forced-colours mode drops every box-shadow.',
      'The loading tile carries aria-busy="true" and its grey blocks are aria-hidden, so the tile is announced as waiting rather than read out as a wall of nothing.',
      'A no-data tile spells out "No data" as sr-only text beside the aria-hidden em dash, because an em dash resolves to nothing and a silent tile is indistinguishable from a missing one.',
      'A figure that refreshes in place goes in a role="status" only when the refresh is something the user asked for. A tile polling on a timer stays silent, because a live region firing every thirty seconds makes the rest of the page unusable.'
    ],
    related: ['card', 'chart', 'skeleton', 'progress'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- The plain tile: what the number is, the number, and when it was read. No
     delta, because not every metric has a comparable previous period and a tile
     is allowed to be one fact.

     It is a <div> and it has no hover state. A border that darkens under the
     cursor promises a destination and this tile has none — the dashboard variant
     below is the case where the whole tile navigates.

     dt then dd, so the label and the figure are one unit in the accessibility
     tree rather than two paragraphs that happen to be adjacent.

     The rupee mark is its own span one step down. Set it at 24px semibold and
     four tiles in a row start their digits at four different x positions, which
     is the whole reason the figure is tabular-nums in the first place. -->
<div data-kui="stat-card/default" class="max-w-xs rounded-xl border border-zinc-300 bg-white p-4">
  <dl>
    <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open order value · all plants</dt>
    <dd class="mt-1.5 flex items-baseline gap-1">
      <span class="text-[13px]/5 font-medium text-zinc-500">₹</span>
      <span class="text-[24px]/7 font-semibold tracking-tight tabular-nums">1.84 Cr</span>
    </dd>
  </dl>
  <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">Read at 09:00 from the order register</p>
</div>` },

      { id: 'delta', name: 'With a delta', code:
`<!-- Three tiles, three deltas, and the middle one is the reason this variant
     exists.

     Direction and desirability are separate. The arrow follows the number; the
     tone follows whether the movement was wanted. Orders raised going up is
     emerald with an up arrow. Overdue value going up is red with an up arrow —
     same direction, opposite news — and a template that picks the tone from
     Math.sign(delta) gets it exactly backwards while looking correct on the
     first tile. Carry good: "down" on the metric and choose the tone with
     delta > 0 === (good === "up").

     Every delta here is an arrow, a sign and a period. The arrow is aria-hidden,
     so the sign is what is left for a screen reader and for forced-colours mode,
     where the emerald and the red are both gone. The period is not optional:
     "+11" against what?

     The third tile is flat, and flat is graphite with a minus — never a green
     zero. Emerald means something finished; nothing finished here. The same
     applies below the noise floor of the measure: 0.4% on committed value is
     one release note landing early and is reported as no change.

     Note the second delta is absolute rather than percent. On a base of nine
     approvals "+33%" claims a precision nine records do not have. -->
<div data-kui="stat-card/delta" class="grid gap-3 sm:grid-cols-3">

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Orders raised</dt>
      <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">148</dd>
      <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium tabular-nums text-emerald-600">
          <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+11
        </span>
        <span class="text-zinc-500">vs. July</span>
      </dd>
    </dl>
  </div>

  <!-- up is bad. Same arrow as the tile on the left, opposite tone, and the
       label is what makes it legible with no tone at all. -->
  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Overdue value</dt>
      <dd class="mt-1.5 flex items-baseline gap-1">
        <span class="text-[13px]/5 font-medium text-zinc-500">₹</span>
        <span class="text-[24px]/7 font-semibold tracking-tight tabular-nums">27.10 L</span>
      </dd>
      <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium tabular-nums text-red-600">
          <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+₹4.10 L
        </span>
        <span class="text-zinc-500">vs. 12 Aug</span>
      </dd>
    </dl>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Awaiting approval</dt>
      <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">9</dd>
      <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium text-zinc-600">
          <i data-lucide="minus" class="size-3.5" aria-hidden="true"></i>No change
        </span>
        <span class="text-zinc-500">since 12 Aug</span>
      </dd>
    </dl>
  </div>
</div>` },

      { id: 'sparkline', name: 'With a sparkline', code:
`<!-- The chart entry's sparkline, dropped into a tile. It needs that entry's page
     setup — Chart.js 4 pinned, in the head, before this markup.

     Do not hand-roll the points into an inline <svg> instead. <template x-for>
     is parsed in the SVG namespace and has no .content, so the points cannot be
     bound to anything and stay hand-written while the figure above them changes
     every morning. This block also already solves reading the colour out of the
     DOM rather than writing a hex into JS.

     The hidden swatch is the palette. It has to be a real class attribute:
     Tailwind never sees a class name written inside x-init or a JS string.

     The sparkline is shape. With no axis and no labels it says direction and
     volatility and nothing else, which is why the figure is beside it and why
     the canvas takes role="img" with a sentence naming both ends of the range —
     that sentence is the only route to the trend for anyone not reading the
     picture. The last point is the only one with a radius, so "where we are now"
     is marked without putting a number on every week. -->
<div data-kui="stat-card/sparkline" class="max-w-xs rounded-xl border border-zinc-300 bg-white p-4"
     x-data="{
       chart: null,
       init() { this.wait(() => this.draw()); },
       /* Tailwind's browser build compiles after first paint, so a class can
          still be uncompiled when Alpine initialises and getComputedStyle hands
          back transparent. With a compiled stylesheet this passes on the first
          frame and costs nothing. */
       wait(fn) {
         getComputedStyle(this.$refs.tone).backgroundColor !== 'rgba(0, 0, 0, 0)'
           ? fn()
           : requestAnimationFrame(() => this.wait(fn));
       },
       draw() {
         Chart.defaults.font.family = getComputedStyle(this.$root).fontFamily;
         const tone = getComputedStyle(this.$refs.tone).backgroundColor;
         const data = [112, 121, 108, 130, 124, 137, 129, 141, 136, 144, 137, 148];
         this.chart = new Chart(this.$refs.canvas, {
           type: 'line',
           data: {
             labels: ['w1','w2','w3','w4','w5','w6','w7','w8','w9','w10','w11','w12'],
             datasets: [{
               data,
               borderColor: tone, backgroundColor: tone,
               borderWidth: 2, tension: 0.35, fill: false,
               pointRadius: c => c.dataIndex === data.length - 1 ? 2.5 : 0,
               pointHoverRadius: 0
             }]
           },
           options: {
             responsive: true, maintainAspectRatio: false,
             scales: { x: { display: false }, y: { display: false } },
             plugins: { tooltip: { enabled: false } }
           }
         });
       },
       destroy() { this.chart && this.chart.destroy(); }
     }">

  <span x-ref="tone" class="hidden bg-zinc-800" aria-hidden="true"></span>

  <dl>
    <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Orders raised · 12 weeks</dt>
    <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">148</dd>
    <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
      <span class="inline-flex items-center gap-1 font-medium tabular-nums text-emerald-600">
        <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+11
      </span>
      <span class="text-zinc-500">vs. previous 12 weeks</span>
    </dd>
  </dl>

  <div class="mt-3 h-10">
    <canvas x-ref="canvas" role="img"
            aria-label="Orders raised per week over twelve weeks, rising from 112 to 148 with a dip to 108 in week three and no week below 108 after it."></canvas>
  </div>
</div>` },

      { id: 'grid', name: 'Grid of four', code:
`<!-- Four across is the ceiling. Not a width limit — a limit on how many numbers
     anybody reads before deciding the strip is decoration. The fifth metric is a
     request to demote one of these four.

     grid-cols-1 · sm:grid-cols-2 · xl:grid-cols-4, so the strip restacks rather
     than shrinking or scrolling sideways. When it is one column the four figures
     are a column of numbers down the left edge, which is the reason every one of
     them is tabular-nums even though each is a standalone display figure.

     Three of the four deltas are emerald, red and graphite for three different
     reasons: something wanted went up, something unwanted went up, and something
     did not move. Read the labels rather than the colours and it still works. -->
<div data-kui="stat-card/grid" class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open orders</dt>
      <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">148</dd>
      <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium tabular-nums text-emerald-600">
          <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+11
        </span>
        <span class="text-zinc-500">vs. July</span>
      </dd>
    </dl>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open order value</dt>
      <dd class="mt-1.5 flex items-baseline gap-1">
        <span class="text-[13px]/5 font-medium text-zinc-500">₹</span>
        <span class="text-[24px]/7 font-semibold tracking-tight tabular-nums">1.84 Cr</span>
      </dd>
      <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium tabular-nums text-emerald-600">
          <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+8.4%
        </span>
        <span class="text-zinc-500">vs. July</span>
      </dd>
    </dl>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Overdue value</dt>
      <dd class="mt-1.5 flex items-baseline gap-1">
        <span class="text-[13px]/5 font-medium text-zinc-500">₹</span>
        <span class="text-[24px]/7 font-semibold tracking-tight tabular-nums">27.10 L</span>
      </dd>
      <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium tabular-nums text-red-600">
          <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+₹4.10 L
        </span>
        <span class="text-zinc-500">vs. 12 Aug</span>
      </dd>
    </dl>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Awaiting approval</dt>
      <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">9</dd>
      <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium text-zinc-600">
          <i data-lucide="minus" class="size-3.5" aria-hidden="true"></i>No change
        </span>
        <span class="text-zinc-500">since 12 Aug</span>
      </dd>
    </dl>
  </div>
</div>` },

      { id: 'status', name: 'Value is a status', code:
`<!-- Some tiles answer "what state is it in" rather than "how many". The value is
     a word, and the shape of the tile does not change: label above, value at the
     display slot, the qualifying line below.

     The word is set at text-[20px]/7 rather than 24px, because a status is read
     and a number is scanned, and it is zinc-900 like every other value. The
     colour is in the dot, from the locked mapping — red-600 for the alarm state,
     amber-500 for waiting on somebody, emerald-600 for finished. That is the
     badge rule at tile scale.

     It is a dot and not a pill. A status pill blown up to the display step is a
     lozenge with four words of padding round two words of data, and a row of them
     reads as a traffic light rather than as three tiles. The dot does the same
     job at 8px and leaves the word legible.

     Every dot is aria-hidden. The word is the data — remove the colour entirely
     and "Held", "Awaiting release" and "Filed" still say everything. -->
<div data-kui="stat-card/status" class="grid gap-3 sm:grid-cols-3">

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Compounding line 3</dt>
      <dd class="mt-1.5 flex items-center gap-2">
        <span class="size-2 shrink-0 rounded-full bg-red-600" aria-hidden="true"></span>
        <span class="text-[20px]/7 font-semibold tracking-tight">Held</span>
      </dd>
    </dl>
    <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">Since 09:40 · batch B-24-0912</p>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Batch B-24-0918</dt>
      <dd class="mt-1.5 flex items-center gap-2">
        <span class="size-2 shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>
        <span class="text-[20px]/7 font-semibold tracking-tight">Awaiting release</span>
      </dd>
    </dl>
    <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">Melt flow logged 08:15 · with QC 1 h 12 m</p>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">GSTR-1 · July</dt>
      <dd class="mt-1.5 flex items-center gap-2">
        <span class="size-2 shrink-0 rounded-full bg-emerald-600" aria-hidden="true"></span>
        <span class="text-[20px]/7 font-semibold tracking-tight">Filed</span>
      </dd>
    </dl>
    <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">11 Aug · ARN AA2708240094317</p>
  </div>
</div>` },

      { id: 'dense', name: 'Dense strip', code:
`<!-- The dense form, for the strip that sits above a register where the table is
     the subject and the numbers are context. One card holding four cells instead
     of four cards: at this size four separate borders and four gaps is more
     furniture than data.

     The rules are hairlines drawn by gap-px over a zinc-100 background rather
     than by divide-x. divide-x has to be undone at every breakpoint where the
     column count changes, and it draws nothing between the two rows at 390px;
     the gap paints both axes at any column count and reflows nothing, because a
     1px gap is a gap and not a border.

     The figure drops to text-[16px]/6 and takes no tracking-tight — that pairing
     starts at 20px. The delta comes up onto the same line as the figure and
     loses its own comparison clause, which moves to one line under the whole
     strip. Four copies of "vs. July" at 11px is four chances to disagree with
     itself and nothing gained.

     Below sm it is two columns, not one: at this size two 16px figures fit side
     by side on a 390px screen, and eight rows of one number each is a list
     nobody scrolls. -->
<div data-kui="stat-card/dense" class="max-w-3xl">
  <div class="overflow-hidden rounded-xl border border-zinc-200">
    <dl class="grid grid-cols-2 gap-px bg-zinc-100 sm:grid-cols-4">

      <div class="bg-white px-3 py-2.5">
        <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open</dt>
        <dd class="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          <span class="text-[16px]/6 font-semibold tabular-nums">148</span>
          <span class="inline-flex items-center gap-0.5 text-[11px]/4 font-medium tabular-nums text-emerald-600">
            <i data-lucide="trending-up" class="size-3" aria-hidden="true"></i>+11
          </span>
        </dd>
      </div>

      <div class="bg-white px-3 py-2.5">
        <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Overdue</dt>
        <dd class="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          <span class="text-[16px]/6 font-semibold tabular-nums">12</span>
          <span class="inline-flex items-center gap-0.5 text-[11px]/4 font-medium tabular-nums text-red-600">
            <i data-lucide="trending-up" class="size-3" aria-hidden="true"></i>+3
          </span>
        </dd>
      </div>

      <div class="bg-white px-3 py-2.5">
        <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Value</dt>
        <dd class="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          <span class="text-[16px]/6 font-semibold tabular-nums">₹1.84 Cr</span>
          <span class="inline-flex items-center gap-0.5 text-[11px]/4 font-medium tabular-nums text-emerald-600">
            <i data-lucide="trending-up" class="size-3" aria-hidden="true"></i>+8.4%
          </span>
        </dd>
      </div>

      <div class="bg-white px-3 py-2.5">
        <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Awaiting</dt>
        <dd class="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          <span class="text-[16px]/6 font-semibold tabular-nums">9</span>
          <span class="inline-flex items-center gap-0.5 text-[11px]/4 font-medium text-zinc-600">
            <i data-lucide="minus" class="size-3" aria-hidden="true"></i>Flat
          </span>
        </dd>
      </div>
    </dl>
  </div>
  <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">All plants · change vs. July · read at 09:12</p>
</div>` },

      { id: 'loading', name: 'Loading', code:
`<!-- A skeleton, not a spinner. The layout is known before the data is — label,
     figure, delta — so there is nothing for a ring to be honest about, and a ring
     centred in a tile collapses the box to the height of the ring and shuffles
     the page under the strip twice per load.

     The blocks come from the skeleton entry; nothing new is invented here. What
     is specific to this tile is the measurement. Each bar sits inside a box the
     height of the line it stands in for — h-4 for the 16px label line, h-7 for
     the 28px figure, h-4 for the delta — so the loading tile and the loaded tile
     are the same height to the pixel and the strip does not resize when the data
     lands. A stack of bare bars at h-2.5 is 18px shorter and every load ends with
     the page jumping.

     aria-busy is on the tile, the bars are aria-hidden, and x-cloak keeps the
     loaded state from flashing before Alpine boots. x-init runs the cycle once
     so the example resolves; in an application the swap is what clears it. -->
<div data-kui="stat-card/loading" class="max-w-sm"
     x-data="{ busy: true, run() { this.busy = true; setTimeout(() => this.busy = false, 1800) } }"
     x-init="run()">

  <div class="rounded-xl border border-zinc-300 bg-white p-4" :aria-busy="busy">

    <!-- loading -->
    <div x-show="busy" class="animate-pulse">
      <div class="flex h-4 items-center" aria-hidden="true">
        <div class="h-2.5 w-28 rounded bg-zinc-200"></div>
      </div>
      <div class="mt-1.5 flex h-7 items-center" aria-hidden="true">
        <div class="h-5 w-32 rounded bg-zinc-200"></div>
      </div>
      <div class="mt-2 flex h-4 items-center" aria-hidden="true">
        <div class="h-2.5 w-36 rounded bg-zinc-200"></div>
      </div>
      <p role="status" class="sr-only">Loading open order value</p>
    </div>

    <!-- loaded -->
    <dl x-show="!busy" x-cloak>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open order value</dt>
      <dd class="mt-1.5 flex h-7 items-baseline gap-1">
        <span class="text-[13px]/5 font-medium text-zinc-500">₹</span>
        <span class="text-[24px]/7 font-semibold tracking-tight tabular-nums">1.84 Cr</span>
      </dd>
      <dd class="mt-2 flex h-4 flex-wrap items-center gap-x-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium tabular-nums text-emerald-600">
          <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+8.4%
        </span>
        <span class="text-zinc-500">vs. July</span>
      </dd>
    </dl>
  </div>

  <button type="button" @click="run()"
          class="mt-3 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Load again
  </button>
</div>` },

      { id: 'empty', name: 'Zero and no data', code:
`<!-- Two tiles that look similar and mean opposite things.

     Zero is a fact. Zero QC holds is good news, it renders as 0 at the full
     figure step, and it keeps its delta — the delta is the interesting part,
     because two holds cleared since Tuesday is what somebody wanted to know.

     No data is the absence of a fact: the register timed out, the plant has not
     posted since the cut-over, the metric did not exist before April. It renders
     as an em dash at the figure's size, in zinc-400 so it does not read as a
     value, with one line saying which of those it was. There is no delta,
     because there is nothing to compare.

     Printing 0 for a failed read is the defect this variant exists to stop.
     Somebody sees zero holds, stops checking, and a shift runs on material that
     was never released. The two states have to be told apart at a glance.

     The em dash is aria-hidden with an sr-only "No data" beside it. An em dash
     resolves to nothing in the accessibility tree, and a tile that announces its
     label and then falls silent is indistinguishable from a tile that failed to
     render. -->
<div data-kui="stat-card/empty" class="grid gap-3 sm:grid-cols-2">

  <!-- zero: a real answer -->
  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">QC holds open</dt>
      <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">0</dd>
      <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
        <span class="inline-flex items-center gap-1 font-medium tabular-nums text-emerald-600">
          <i data-lucide="trending-down" class="size-3.5" aria-hidden="true"></i>-2
        </span>
        <span class="text-zinc-500">vs. 12 Aug</span>
      </dd>
    </dl>
  </div>

  <!-- no data: no answer -->
  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <dl>
      <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Scrap rate · Silvassa</dt>
      <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight text-zinc-400">
        <span aria-hidden="true">—</span><span class="sr-only">No data</span>
      </dd>
    </dl>
    <p class="mt-2 flex items-start gap-1.5 text-[12px]/4 text-zinc-600">
      <i data-lucide="info" class="mt-0.5 size-3.5 shrink-0 text-zinc-500" aria-hidden="true"></i>
      <span>Silvassa has posted no production batches since the 12 Aug cut-over.</span>
    </p>
  </div>
</div>` },

      { id: 'dashboard', name: 'Procurement strip', code:
`<!-- The strip as it actually ships, at the top of the procurement dashboard.

     The heading and the as-of line belong to the strip, not to the tiles. Four
     copies of "read at 09:12" is four chances for the tiles to disagree about
     when they were read, and the scope — three plants — is the same for all of
     them.

     Every tile here is an anchor, because every one of these numbers has a
     register behind it and the tile is how people get there. That is the only
     reason any of them carries hover:border-zinc-400. Where a metric has no
     destination the tile stays a <div> with no hover at all, and you do not fake
     one for consistency: a strip where two of four tiles keep the promise trains
     people to stop trying any of them.

     One anchor per tile, wrapping everything, and nothing else focusable inside
     it — a button nested in an anchor cannot be reached from the keyboard and is
     ambiguous with a mouse. Tab therefore walks the strip in four stops, and each
     accessible name is the whole tile: "Overdue value, ₹27.10 L, up ₹4.10 L vs.
     12 Aug".

     Focus is an outline, never a ring. ring-* is a box-shadow and forced-colours
     mode drops every box-shadow, which takes the focus indicator away from the
     people who need it most.

     The chevron is aria-hidden and sits in the label row rather than beside the
     figure, so it never shifts the number. It is a Lucide <i> carrying a plain
     group-hover: class and no Alpine binding — createIcons() replaces the <i>
     with an <svg> and keeps the class attribute, but it would destroy an
     x-bind:class written on it.

     Two of the four deltas are red and both point up. Overdue value rising and
     QC holds rising are unwelcome; the arrow follows the number and the tone
     follows the metric's own direction of good. -->
<div data-kui="stat-card/dashboard" class="max-w-5xl space-y-3">

  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <h2 class="text-[16px]/6 font-semibold">Procurement</h2>
    <p class="text-[12px]/4 tabular-nums text-zinc-500">Silvassa, Vapi and Daman · read at 09:12</p>
  </div>

  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

    <a href="#" class="group block rounded-xl border border-zinc-300 bg-white p-4 transition hover:border-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <dl>
        <dt class="flex items-center justify-between gap-2 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
          <span>Open orders</span>
          <i data-lucide="chevron-right" class="size-3.5 shrink-0 text-zinc-400 transition group-hover:text-zinc-700" aria-hidden="true"></i>
        </dt>
        <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">148</dd>
        <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
          <span class="inline-flex items-center gap-1 font-medium tabular-nums text-emerald-600">
            <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+11
          </span>
          <span class="text-zinc-500">vs. July</span>
        </dd>
      </dl>
    </a>

    <a href="#" class="group block rounded-xl border border-zinc-300 bg-white p-4 transition hover:border-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <dl>
        <dt class="flex items-center justify-between gap-2 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
          <span>Overdue value</span>
          <i data-lucide="chevron-right" class="size-3.5 shrink-0 text-zinc-400 transition group-hover:text-zinc-700" aria-hidden="true"></i>
        </dt>
        <dd class="mt-1.5 flex items-baseline gap-1">
          <span class="text-[13px]/5 font-medium text-zinc-500">₹</span>
          <span class="text-[24px]/7 font-semibold tracking-tight tabular-nums">27.10 L</span>
        </dd>
        <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
          <span class="inline-flex items-center gap-1 font-medium tabular-nums text-red-600">
            <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+₹4.10 L
          </span>
          <span class="text-zinc-500">vs. 12 Aug</span>
        </dd>
      </dl>
    </a>

    <a href="#" class="group block rounded-xl border border-zinc-300 bg-white p-4 transition hover:border-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <dl>
        <dt class="flex items-center justify-between gap-2 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
          <span>GRNs posted today</span>
          <i data-lucide="chevron-right" class="size-3.5 shrink-0 text-zinc-400 transition group-hover:text-zinc-700" aria-hidden="true"></i>
        </dt>
        <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">12</dd>
        <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
          <span class="inline-flex items-center gap-1 font-medium tabular-nums text-emerald-600">
            <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+4
          </span>
          <span class="text-zinc-500">vs. same time yesterday</span>
        </dd>
      </dl>
    </a>

    <a href="#" class="group block rounded-xl border border-zinc-300 bg-white p-4 transition hover:border-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <dl>
        <dt class="flex items-center justify-between gap-2 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
          <span>QC holds open</span>
          <i data-lucide="chevron-right" class="size-3.5 shrink-0 text-zinc-400 transition group-hover:text-zinc-700" aria-hidden="true"></i>
        </dt>
        <dd class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">3</dd>
        <dd class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[12px]/4">
          <span class="inline-flex items-center gap-1 font-medium tabular-nums text-red-600">
            <i data-lucide="trending-up" class="size-3.5" aria-hidden="true"></i>+2
          </span>
          <span class="text-zinc-500">since yesterday</span>
        </dd>
      </dl>
    </a>
  </div>
</div>` }
    ]
  },

  {
    id: 'chart', name: 'Chart', category: 'data',
    description: 'Chart.js on a canvas, wearing this system\'s colours. The legend is HTML and doubles as the palette the canvas paints from, so a swatch and the line it names cannot drift apart.',
    when: 'A shape a column of numbers will not show: a trend across months, a composition, a ranking. If the reader needs the exact figure, the table is the answer and the chart sits above it.',
    notes: [
      'Chart.js 4 from a CDN, pinned to an exact version. It is the only runtime dependency beyond Alpine and Lucide, and it earns its place: a hand-rolled SVG chart is a year of edge cases, from tick density and label collision to stacking and retina canvases.',
      'A canvas cannot take a class, so read every colour out of the DOM at init: the series from the legend swatches, the grid from the card border, the tick text from the legend text. Never type a hex.',
      'Do not read --color-zinc-400 off :root either. Tailwind v4 tree-shakes theme variables it cannot see used, so in an app that uses zinc-400 nowhere else that lookup returns an empty string and Chart.js silently paints black. Naming the class inside x-init does not save you: the scanner reads class attributes, not strings in JavaScript, so the utility is never generated in the first place.',
      'The legend is HTML above the canvas, and it is also the palette. One item per series, each with a bg-* swatch that init reads back. There is one definition of the colour, so the square and the line it names cannot disagree.',
      'No colour in a chart, ever. This is the alert rule and the status pill rule applied to a field of shapes: an alert is a white card with colour only in its icon, a status pill is graphite with a single coloured dot, and a chart is graphite with none. Red across the top of every bar is a field of colour, and it shouts louder than the seven overdue orders it is reporting. The red dot belongs on the pill beside the record.',
      'A stroke and a fill are different problems, the same split the token table already makes between amber-700 in a component and amber-500 in a dot. A 2px line needs the dark end and takes zinc-800. Fills are large areas and come from zinc-200, zinc-500 and zinc-800, three steps apart so that neighbours separate; a single-series bar takes zinc-600. Filling half a chart with zinc-800 puts a slab of black on the page, which is why the dark end is reserved for strokes and for the smallest series.',
      'The darkest step goes to the series that matters, which is almost always the smallest one. Weight follows importance rather than volume: 72 closed orders are the pale bulk along the bottom and 7 overdue are the dark cap on top, and the cap is the only reason anyone opened the chart.',
      'The canvas needs a parent with a height, and maintainAspectRatio: false. Given neither, Chart.js measures the box it has just drawn into, grows, measures again, and the canvas expands every frame until the tab is unusable.',
      'destroy() the chart when Alpine tears the component down. Chart.js keeps a registry keyed on the canvas element, so re-rendering the same markup without it throws "Canvas is already in use".',
      'sr-only goes on a div wrapping the fallback table, never on the table itself. A table treats width: 1px as a minimum and grows to fit its content, and since sr-only is absolutely positioned that runaway width becomes page-level horizontal scroll. Measured at 390px it added 105px of sideways scroll to the page.',
      'A canvas is a picture with no text in it. Every chart takes role="img" and a one-line aria-label that states the trend, and repeats its numbers as text: an sr-only table, or a legend that already carries the values the way the donut does. Without one of the two a screen reader gets nothing at all.',
      'Animation is 250ms, and off entirely under prefers-reduced-motion. A dashboard that replays a grow-from-zero sweep on every filter change is a dashboard nobody filters twice.',
      'No gradients, no shadows, and no truncated axis on a bar chart. Starting bars at anything but zero exaggerates the difference the chart exists to report.',
      'Format ticks in the units the reader uses. A y-axis of 1800000 is arithmetic; 18.0L is the number they would have said out loud.'
    ],
    anatomy: [
      ['Frame', 'The card. Its zinc-200 border is also where the chart reads its grid colour.'],
      ['Legend', 'An HTML list above the canvas, one item per series. It is the palette, the accessible key, and the only place a series colour is written.'],
      ['Plot box', 'A wrapper with an explicit height. The canvas fills it; without it the chart grows without bound.'],
      ['Canvas', 'role="img" with an aria-label summarising the shape, because nothing inside a canvas is readable.'],
      ['Fallback table', 'The same numbers, sr-only, immediately after the canvas.'],
      ['Footnote', 'Source and period, in tertiary text. A chart with no stated period is a chart nobody can check.']
    ],
    behaviour: [
      'Colours resolve at init from the rendered DOM, so the chart matches whatever the stylesheet actually shipped.',
      'The chart is responsive: it fills the plot box and redraws on resize, which is why the box owns the height and the canvas never does.',
      'Hovering anywhere on a column reports every series at that point, rather than only the segment under the cursor.',
      'Animation runs for 250ms once, and not at all when the reader has asked for reduced motion.',
      'Tearing down the component destroys the Chart instance, so previews and htmx swaps can re-render the same markup safely.',
      'With no data the component renders an empty state, never an empty grid. Axes with nothing in them read as a chart that failed to load.'
    ],
    a11y: [
      'The canvas carries role="img" and an aria-label that says what the chart shows, not that it is a chart.',
      'Every chart repeats its numbers as real text: an sr-only table with proper headers right after the canvas, or a legend carrying the values, which is why the donut needs no table.',
      'The legend is HTML, so its labels are text a screen reader can announce and a browser can find. The Chart.js canvas legend is turned off system wide for that reason.',
      'Nothing is told apart by hue, because there is no hue: the ramp is lightness only, which is the one channel every reader has. The legend still names each series in text and the fallback table still carries every value.',
      'Three fills is the ceiling, and the arithmetic sets it. zinc-200, zinc-500 and zinc-800 clear 3:1 against the neighbour they touch, at 3.81 and 3.08; a fourth grey squeezed in between drops a pair below 3:1 and the two segments stop separating. The palest step is 1.27:1 against the white card, so the bottom of a stacked bar is defined by the axis rather than by its own edge. That is the one edge that does not clear, and the fallback table is what pays for it.',
      'Tooltips are pointer sugar and never the only place a value appears.'
    ],
    related: ['stat-card', 'table', 'progress'],
    variants: [
      { id: 'setup', name: 'Page setup', code:
`<!-- once per page, in the head, after Alpine and before your charts.
     Pin the version: Chart.js ships breaking changes in minors. -->
<script data-kui="chart/setup" src="https://unpkg.com/chart.js@4.4.7/dist/chart.umd.js"></script>
<script>
  /* Behaviour only. Nothing here reads the DOM: a head script runs before the
     stylesheet has been applied, so getComputedStyle would hand back Times.
     The font face is read per chart at init, where the colours are read too. */
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.displayColors = false;
  Chart.defaults.plugins.tooltip.padding = 8;
  Chart.defaults.animation = matchMedia('(prefers-reduced-motion: reduce)').matches
    ? false
    : { duration: 250 };
</script>` },

      { id: 'line', name: 'Line', code:
`<div data-kui="chart/line" class="rounded-xl border border-zinc-300 bg-white p-5"
     x-data="{
       chart: null,
       init() { this.wait(() => this.draw()); },
       /* Tailwind's browser build compiles after first paint, so a class can
          still be uncompiled when Alpine initialises and getComputedStyle
          hands back transparent. Check every swatch, not the first: they do
          not all land in the same pass. With a compiled stylesheet this
          passes on the first frame and costs nothing. */
       wait(fn) {
         const probes = Array.from(this.$refs.legend.querySelectorAll('[data-series]'));
         probes.every(el => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)')
           ? fn()
           : requestAnimationFrame(() => this.wait(fn));
       },
       draw() {
         Chart.defaults.font.family = getComputedStyle(this.$root).fontFamily;
         const grid = getComputedStyle(this.$root).borderTopColor;
         const ink  = getComputedStyle(this.$refs.legend).color;
         const tone = Array.from(this.$refs.legend.querySelectorAll('[data-series]'))
                           .map(el => getComputedStyle(el).backgroundColor);
         this.chart = new Chart(this.$refs.canvas, {
           type: 'line',
           data: {
             labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
             datasets: [{
               label: 'Committed value',
               data: [1420000, 1680000, 2310000, 1890000, 2040000, 2470000, 2260000, 2410000],
               borderColor: tone[0], backgroundColor: tone[0],
               borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.3
             }]
           },
           options: {
             responsive: true, maintainAspectRatio: false,
             interaction: { mode: 'index', intersect: false },
             scales: {
               x: { grid: { display: false }, border: { color: grid }, ticks: { color: ink } },
               y: {
                 beginAtZero: true,
                 grid: { color: grid }, border: { display: false },
                 ticks: { color: ink, padding: 8, callback: v => (v / 100000).toFixed(1).replace('.0', '') + 'L' }
               }
             },
             plugins: {
               tooltip: { callbacks: { label: c => '₹' + c.parsed.y.toLocaleString('en-IN') } }
             }
           }
         });
       },
       destroy() { this.chart && this.chart.destroy(); }
     }">

  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <h3 class="text-[14px]/5 font-semibold">Committed value by month</h3>
    <p class="text-[12px]/4 tabular-nums text-zinc-500">Silvassa plant · 2026</p>
  </div>

  <ul x-ref="legend" class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]/4 text-zinc-600">
    <li class="flex items-center gap-1.5">
      <span data-series class="size-2 rounded-full bg-zinc-800" aria-hidden="true"></span>Committed value
    </li>
  </ul>

  <div class="mt-4 h-64">
    <canvas x-ref="canvas" role="img"
            aria-label="Committed value by month, rising from ₹14.2 lakh in January to ₹24.1 lakh in August, with a dip in April."></canvas>
  </div>

  <div class="sr-only">
    <table>
      <caption>Committed value by month, Silvassa plant, 2026</caption>
      <thead><tr><th scope="col">Month</th><th scope="col">Committed value</th></tr></thead>
      <tbody>
        <tr><th scope="row">January</th><td>₹14,20,000</td></tr>
        <tr><th scope="row">February</th><td>₹16,80,000</td></tr>
        <tr><th scope="row">March</th><td>₹23,10,000</td></tr>
        <tr><th scope="row">April</th><td>₹18,90,000</td></tr>
        <tr><th scope="row">May</th><td>₹20,40,000</td></tr>
        <tr><th scope="row">June</th><td>₹24,70,000</td></tr>
        <tr><th scope="row">July</th><td>₹22,60,000</td></tr>
        <tr><th scope="row">August</th><td>₹24,10,000</td></tr>
      </tbody>
    </table>
  </div>
</div>` },

      { id: 'bar', name: 'Grouped bar', code:
`<div data-kui="chart/bar" class="rounded-xl border border-zinc-300 bg-white p-5"
     x-data="{
       chart: null,
       init() { this.wait(() => this.draw()); },
       /* Tailwind's browser build compiles after first paint, so a class can
          still be uncompiled when Alpine initialises and getComputedStyle
          hands back transparent. Check every swatch, not the first: they do
          not all land in the same pass. With a compiled stylesheet this
          passes on the first frame and costs nothing. */
       wait(fn) {
         const probes = Array.from(this.$refs.legend.querySelectorAll('[data-series]'));
         probes.every(el => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)')
           ? fn()
           : requestAnimationFrame(() => this.wait(fn));
       },
       draw() {
         Chart.defaults.font.family = getComputedStyle(this.$root).fontFamily;
         const grid = getComputedStyle(this.$root).borderTopColor;
         const ink  = getComputedStyle(this.$refs.legend).color;
         const tone = Array.from(this.$refs.legend.querySelectorAll('[data-series]'))
                           .map(el => getComputedStyle(el).backgroundColor);
         this.chart = new Chart(this.$refs.canvas, {
           type: 'bar',
           data: {
             labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug'],
             datasets: [
               { label: 'Raised',   data: [92, 104, 118, 111, 128], backgroundColor: tone[0], borderRadius: 4, maxBarThickness: 22 },
               { label: 'Received', data: [88, 96, 109, 104, 117],  backgroundColor: tone[1], borderRadius: 4, maxBarThickness: 22 }
             ]
           },
           options: {
             responsive: true, maintainAspectRatio: false,
             interaction: { mode: 'index', intersect: false },
             scales: {
               x: { grid: { display: false }, border: { color: grid }, ticks: { color: ink } },
               y: { beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { color: ink, padding: 8 } }
             }
           }
         });
       },
       destroy() { this.chart && this.chart.destroy(); }
     }">

  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <h3 class="text-[14px]/5 font-semibold">Orders raised against received</h3>
    <p class="text-[12px]/4 tabular-nums text-zinc-500">Last five months</p>
  </div>

  <ul x-ref="legend" class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]/4 text-zinc-600">
    <li class="flex items-center gap-1.5">
      <span data-series class="size-2 rounded-full bg-zinc-600" aria-hidden="true"></span>Raised
    </li>
    <li class="flex items-center gap-1.5">
      <span data-series class="size-2 rounded-full bg-zinc-300" aria-hidden="true"></span>Received
    </li>
  </ul>

  <div class="mt-4 h-64">
    <canvas x-ref="canvas" role="img"
            aria-label="Orders raised against orders received, April to August. Raised runs slightly ahead of received in every month, by between 4 and 11 orders."></canvas>
  </div>

  <div class="sr-only">
    <table>
      <caption>Orders raised against received, April to August 2026</caption>
      <thead><tr><th scope="col">Month</th><th scope="col">Raised</th><th scope="col">Received</th></tr></thead>
      <tbody>
        <tr><th scope="row">April</th><td>92</td><td>88</td></tr>
        <tr><th scope="row">May</th><td>104</td><td>96</td></tr>
        <tr><th scope="row">June</th><td>118</td><td>109</td></tr>
        <tr><th scope="row">July</th><td>111</td><td>104</td></tr>
        <tr><th scope="row">August</th><td>128</td><td>117</td></tr>
      </tbody>
    </table>
  </div>
</div>` },
      { id: 'horizontal', name: 'Ranking', code:
`<div data-kui="chart/horizontal" class="rounded-xl border border-zinc-300 bg-white p-5"
     x-data="{
       chart: null,
       init() { this.wait(() => this.draw()); },
       /* Tailwind's browser build compiles after first paint, so a class can
          still be uncompiled when Alpine initialises and getComputedStyle
          hands back transparent. Check every swatch, not the first: they do
          not all land in the same pass. With a compiled stylesheet this
          passes on the first frame and costs nothing. */
       wait(fn) {
         const probes = Array.from(this.$refs.legend.querySelectorAll('[data-series]'));
         probes.every(el => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)')
           ? fn()
           : requestAnimationFrame(() => this.wait(fn));
       },
       draw() {
         Chart.defaults.font.family = getComputedStyle(this.$root).fontFamily;
         const grid = getComputedStyle(this.$root).borderTopColor;
         const ink  = getComputedStyle(this.$refs.legend).color;
         const tone = Array.from(this.$refs.legend.querySelectorAll('[data-series]'))
                           .map(el => getComputedStyle(el).backgroundColor);
         this.chart = new Chart(this.$refs.canvas, {
           type: 'bar',
           data: {
             labels: ['Gujarat Polymers Ltd', 'Nashik Steel Traders', 'Sharma Extrusions', 'Deshpande Traders', 'Vasai Packaging'],
             datasets: [{
               label: 'Committed value',
               data: [4820000, 3140000, 2270000, 1480000, 910000],
               backgroundColor: tone[0], borderRadius: 4, maxBarThickness: 18
             }]
           },
           options: {
             indexAxis: 'y',
             responsive: true, maintainAspectRatio: false,
             scales: {
               x: {
                 beginAtZero: true,
                 grid: { color: grid }, border: { display: false },
                 ticks: { color: ink, callback: v => (v / 100000).toFixed(1).replace('.0', '') + 'L' }
               },
               y: { grid: { display: false }, border: { color: grid }, ticks: { color: ink } }
             },
             plugins: {
               tooltip: { callbacks: { label: c => '₹' + c.parsed.x.toLocaleString('en-IN') } }
             }
           }
         });
       },
       destroy() { this.chart && this.chart.destroy(); }
     }">

  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <h3 class="text-[14px]/5 font-semibold">Top suppliers by committed value</h3>
    <p class="text-[12px]/4 tabular-nums text-zinc-500">Financial year 2026-27, to date</p>
  </div>

  <ul x-ref="legend" class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]/4 text-zinc-600">
    <li class="flex items-center gap-1.5">
      <span data-series class="size-2 rounded-full bg-zinc-600" aria-hidden="true"></span>Committed value
    </li>
  </ul>

  <div class="mt-4 h-64">
    <canvas x-ref="canvas" role="img"
            aria-label="Top five suppliers by committed value. Gujarat Polymers leads at ₹48.2 lakh, ahead of Nashik Steel Traders at ₹31.4 lakh."></canvas>
  </div>

  <div class="sr-only">
    <table>
      <caption>Top suppliers by committed value, financial year 2026-27 to date</caption>
      <thead><tr><th scope="col">Supplier</th><th scope="col">Committed value</th></tr></thead>
      <tbody>
        <tr><th scope="row">Gujarat Polymers Ltd</th><td>₹48,20,000</td></tr>
        <tr><th scope="row">Nashik Steel Traders</th><td>₹31,40,000</td></tr>
        <tr><th scope="row">Sharma Extrusions</th><td>₹22,70,000</td></tr>
        <tr><th scope="row">Deshpande Traders</th><td>₹14,80,000</td></tr>
        <tr><th scope="row">Vasai Packaging</th><td>₹9,10,000</td></tr>
      </tbody>
    </table>
  </div>
</div>` },

      { id: 'stacked', name: 'Stacked by status', code:
`<div data-kui="chart/stacked" class="rounded-xl border border-zinc-300 bg-white p-5"
     x-data="{
       chart: null,
       init() { this.wait(() => this.draw()); },
       /* Tailwind's browser build compiles after first paint, so a class can
          still be uncompiled when Alpine initialises and getComputedStyle
          hands back transparent. Check every swatch, not the first: they do
          not all land in the same pass. With a compiled stylesheet this
          passes on the first frame and costs nothing. */
       wait(fn) {
         const probes = Array.from(this.$refs.legend.querySelectorAll('[data-series]'));
         probes.every(el => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)')
           ? fn()
           : requestAnimationFrame(() => this.wait(fn));
       },
       draw() {
         Chart.defaults.font.family = getComputedStyle(this.$root).fontFamily;
         const grid = getComputedStyle(this.$root).borderTopColor;
         const ink  = getComputedStyle(this.$refs.legend).color;
         const tone = Array.from(this.$refs.legend.querySelectorAll('[data-series]'))
                           .map(el => getComputedStyle(el).backgroundColor);
         this.chart = new Chart(this.$refs.canvas, {
           type: 'bar',
           data: {
             labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug'],
             datasets: [
               { label: 'Closed',  data: [53, 57, 66, 61, 72], backgroundColor: tone[0], maxBarThickness: 28 },
               { label: 'Open',    data: [35, 41, 47, 41, 49], backgroundColor: tone[1], maxBarThickness: 28 },
               { label: 'Overdue', data: [4, 6, 5, 9, 7],      backgroundColor: tone[2], maxBarThickness: 28 }
             ]
           },
           options: {
             responsive: true, maintainAspectRatio: false,
             interaction: { mode: 'index', intersect: false },
             scales: {
               x: { stacked: true, grid: { display: false }, border: { color: grid }, ticks: { color: ink } },
               y: { stacked: true, beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { color: ink, padding: 8 } }
             }
           }
         });
       },
       destroy() { this.chart && this.chart.destroy(); }
     }">

  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <h3 class="text-[14px]/5 font-semibold">Orders by status</h3>
    <p class="text-[12px]/4 tabular-nums text-zinc-500">Last five months</p>
  </div>

  <!-- Graphite only. Overdue takes the darkest step because it is the series
       that matters, not because it is an alarm colour: colour never becomes a
       field in this system. Approved is folded into Open, since three fills is
       all a neutral ramp can separate. -->
  <ul x-ref="legend" class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]/4 text-zinc-600">
    <li class="flex items-center gap-1.5">
      <span data-series class="size-2 rounded-full bg-zinc-200" aria-hidden="true"></span>Closed
    </li>
    <li class="flex items-center gap-1.5">
      <span data-series class="size-2 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
    </li>
    <li class="flex items-center gap-1.5">
      <span data-series class="size-2 rounded-full bg-zinc-800" aria-hidden="true"></span>Overdue
    </li>
  </ul>

  <div class="mt-4 h-64">
    <canvas x-ref="canvas" role="img"
            aria-label="Orders by status, April to August. Volume grows from 92 to 128 a month, and overdue orders peak at 9 in July before falling to 7."></canvas>
  </div>

  <div class="sr-only">
    <table>
      <caption>Orders by status, April to August 2026</caption>
      <thead><tr><th scope="col">Month</th><th scope="col">Closed</th><th scope="col">Open</th><th scope="col">Overdue</th><th scope="col">Total</th></tr></thead>
      <tbody>
        <tr><th scope="row">April</th><td>53</td><td>35</td><td>4</td><td>92</td></tr>
        <tr><th scope="row">May</th><td>57</td><td>41</td><td>6</td><td>104</td></tr>
        <tr><th scope="row">June</th><td>66</td><td>47</td><td>5</td><td>118</td></tr>
        <tr><th scope="row">July</th><td>61</td><td>41</td><td>9</td><td>111</td></tr>
        <tr><th scope="row">August</th><td>72</td><td>49</td><td>7</td><td>128</td></tr>
      </tbody>
    </table>
  </div>
</div>` },

      { id: 'donut', name: 'Donut', code:
`<div data-kui="chart/donut" class="rounded-xl border border-zinc-300 bg-white p-5"
     x-data="{
       chart: null,
       init() { this.wait(() => this.draw()); },
       /* Tailwind's browser build compiles after first paint, so a class can
          still be uncompiled when Alpine initialises and getComputedStyle
          hands back transparent. Check every swatch, not the first: they do
          not all land in the same pass. With a compiled stylesheet this
          passes on the first frame and costs nothing. */
       wait(fn) {
         const probes = Array.from(this.$refs.legend.querySelectorAll('[data-series]'));
         probes.every(el => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)')
           ? fn()
           : requestAnimationFrame(() => this.wait(fn));
       },
       draw() {
         Chart.defaults.font.family = getComputedStyle(this.$root).fontFamily;
         const tone = Array.from(this.$refs.legend.querySelectorAll('[data-series]'))
                           .map(el => getComputedStyle(el).backgroundColor);
         const ring = getComputedStyle(this.$root).backgroundColor;
         this.chart = new Chart(this.$refs.canvas, {
           type: 'doughnut',
           data: {
             labels: ['Closed', 'Open', 'Overdue'],
             datasets: [{ data: [72, 49, 7], backgroundColor: tone, borderColor: ring, borderWidth: 2 }]
           },
           options: {
             responsive: true, maintainAspectRatio: false, cutout: '68%',
             plugins: { tooltip: { callbacks: { label: c => c.label + ': ' + c.parsed + ' orders' } } }
           }
         });
       },
       destroy() { this.chart && this.chart.destroy(); }
     }">

  <h3 class="text-[14px]/5 font-semibold">Open order book</h3>
  <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">As at 20 Aug 2026</p>

  <div class="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
    <div class="relative h-40 w-40 shrink-0">
      <canvas x-ref="canvas" role="img"
              aria-label="Open order book of 128 orders: 72 closed, 49 open and 7 overdue."></canvas>
      <!-- the total is HTML over the canvas, not painted into it, so it is text -->
      <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-[20px]/7 font-semibold tabular-nums">128</span>
        <span class="text-[11px]/4 text-zinc-500">orders</span>
      </div>
    </div>

    <!-- the legend carries the values, so this chart needs no sr-only table -->
    <ul x-ref="legend" class="w-full min-w-0 flex-1 divide-y divide-zinc-100 text-[13px]/5 text-zinc-600">
      <li class="flex items-center justify-between gap-3 py-1.5">
        <span class="flex min-w-0 items-center gap-2">
          <span data-series class="size-2 shrink-0 rounded-full bg-zinc-200" aria-hidden="true"></span>
          <span class="truncate">Closed</span>
        </span>
        <span class="shrink-0 font-medium tabular-nums text-zinc-900">72</span>
      </li>
      <li class="flex items-center justify-between gap-3 py-1.5">
        <span class="flex min-w-0 items-center gap-2">
          <span data-series class="size-2 shrink-0 rounded-full bg-zinc-500" aria-hidden="true"></span>
          <span class="truncate">Open</span>
        </span>
        <span class="shrink-0 font-medium tabular-nums text-zinc-900">49</span>
      </li>
      <li class="flex items-center justify-between gap-3 py-1.5">
        <span class="flex min-w-0 items-center gap-2">
          <span data-series class="size-2 shrink-0 rounded-full bg-zinc-800" aria-hidden="true"></span>
          <span class="truncate">Overdue</span>
        </span>
        <span class="shrink-0 font-medium tabular-nums text-zinc-900">7</span>
      </li>
    </ul>
  </div>
</div>` },
      { id: 'sparkline', name: 'Sparkline', code:
`<div data-kui="chart/sparkline" class="max-w-xs rounded-xl border border-zinc-300 bg-white p-4"
     x-data="{
       chart: null,
       init() { this.wait(() => this.draw()); },
       /* Tailwind's browser build compiles after first paint, so a class can
          still be uncompiled when Alpine initialises and getComputedStyle
          hands back transparent. Check every swatch, not the first: they do
          not all land in the same pass. With a compiled stylesheet this
          passes on the first frame and costs nothing. */
       wait(fn) {
         getComputedStyle(this.$refs.tone).backgroundColor !== 'rgba(0, 0, 0, 0)'
           ? fn()
           : requestAnimationFrame(() => this.wait(fn));
       },
       draw() {
         Chart.defaults.font.family = getComputedStyle(this.$root).fontFamily;
         const tone = getComputedStyle(this.$refs.tone).backgroundColor;
         this.chart = new Chart(this.$refs.canvas, {
           type: 'line',
           data: {
             labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
             datasets: [{ data: [124, 138, 119, 156, 141, 168, 203, 187, 196, 224, 231, 241],
                          borderColor: tone, borderWidth: 2, pointRadius: 0, tension: 0.35, fill: false }]
           },
           options: {
             responsive: true, maintainAspectRatio: false,
             scales: { x: { display: false }, y: { display: false } },
             plugins: { tooltip: { enabled: false } }
           }
         });
       },
       destroy() { this.chart && this.chart.destroy(); }
     }">

  <!-- a sparkline has no legend, so the palette is a hidden swatch. It has to be a
       real class attribute: Tailwind never sees a class name written inside x-init. -->
  <span x-ref="tone" class="hidden bg-zinc-800" aria-hidden="true"></span>

  <p class="text-[11px]/4 uppercase tracking-wider text-zinc-500">Committed value</p>
  <div class="mt-1.5 flex items-end justify-between gap-3">
    <p class="text-[24px]/8 font-semibold tabular-nums">₹2.41 Cr</p>
    <p class="pb-1 text-[12px]/4 tabular-nums text-zinc-600">+14% YoY</p>
  </div>

  <div class="mt-3 h-10">
    <canvas x-ref="canvas" role="img"
            aria-label="Committed value over the last twelve months, rising from ₹1.24 crore to ₹2.41 crore, with the steepest climb in March."></canvas>
  </div>
</div>` },

      { id: 'empty', name: 'Empty', code:
`<div data-kui="chart/empty" class="rounded-xl border border-zinc-300 bg-white p-5">
  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <h3 class="text-[14px]/5 font-semibold">Committed value by month</h3>
    <p class="text-[12px]/4 tabular-nums text-zinc-500">Silvassa plant · 2026</p>
  </div>

  <!-- no data means no axes. An empty grid reads as a chart that failed to load. -->
  <div class="mt-4 flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 px-6 text-center">
    <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="chart-line" class="size-4 text-zinc-600"></i>
    </span>
    <p class="mt-3 text-[14px]/5 font-medium">Nothing committed yet this year</p>
    <p class="mt-1 max-w-sm text-[13px]/5 text-zinc-600">
      The first approved order will plot here. Draft orders are not counted.
    </p>
  </div>
</div>` },

      { id: 'django', name: 'Django template', code:
`{# json_script escapes the payload and puts it in a script tag the browser will
   not execute. Never interpolate JSON into an attribute: one apostrophe in a
   supplier name ends the attribute and takes the page with it. #}
{{ spend_by_month|json_script:"spend-by-month" }}

<div data-kui="chart/django" class="rounded-xl border border-zinc-300 bg-white p-5"
     x-data="{
       chart: null,
       init() { this.wait(() => this.draw()); },
       /* Tailwind's browser build compiles after first paint, so a class can
          still be uncompiled when Alpine initialises and getComputedStyle
          hands back transparent. Check every swatch, not the first: they do
          not all land in the same pass. With a compiled stylesheet this
          passes on the first frame and costs nothing. */
       wait(fn) {
         const probes = Array.from(this.$refs.legend.querySelectorAll('[data-series]'));
         probes.every(el => getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)')
           ? fn()
           : requestAnimationFrame(() => this.wait(fn));
       },
       draw() {
         Chart.defaults.font.family = getComputedStyle(this.$root).fontFamily;
         const rows = JSON.parse(document.getElementById('spend-by-month').textContent);
         const grid = getComputedStyle(this.$root).borderTopColor;
         const ink  = getComputedStyle(this.$refs.legend).color;
         const tone = Array.from(this.$refs.legend.querySelectorAll('[data-series]'))
                           .map(el => getComputedStyle(el).backgroundColor);
         this.chart = new Chart(this.$refs.canvas, {
           type: 'line',
           data: {
             labels: rows.map(r => r.month),
             datasets: [{
               label: 'Committed value', data: rows.map(r => r.value),
               borderColor: tone[0], backgroundColor: tone[0],
               borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, tension: 0.3
             }]
           },
           options: {
             responsive: true, maintainAspectRatio: false,
             interaction: { mode: 'index', intersect: false },
             scales: {
               x: { grid: { display: false }, border: { color: grid }, ticks: { color: ink } },
               y: { beginAtZero: true, grid: { color: grid }, border: { display: false },
                    ticks: { color: ink, padding: 8, callback: v => (v / 100000).toFixed(1).replace('.0', '') + 'L' } }
             },
             plugins: { tooltip: { callbacks: { label: c => '₹' + c.parsed.y.toLocaleString('en-IN') } } }
           }
         });
       },
       destroy() { this.chart && this.chart.destroy(); }
     }">

  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <h3 class="text-[14px]/5 font-semibold">Committed value by month</h3>
    <p class="text-[12px]/4 tabular-nums text-zinc-500">{{ plant.name }} · {{ year }}</p>
  </div>

  <ul x-ref="legend" class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]/4 text-zinc-600">
    <li class="flex items-center gap-1.5">
      <span data-series class="size-2 rounded-full bg-zinc-800" aria-hidden="true"></span>Committed value
    </li>
  </ul>

  <div class="mt-4 h-64">
    <canvas x-ref="canvas" role="img" aria-label="{{ chart_summary }}"></canvas>
  </div>

  <div class="sr-only">
    <table>
      <caption>Committed value by month, {{ plant.name }}, {{ year }}</caption>
      <thead><tr><th scope="col">Month</th><th scope="col">Committed value</th></tr></thead>
      <tbody>
        {% for row in spend_by_month %}
          <tr><th scope="row">{{ row.month }}</th><td>₹{{ row.value|intcomma }}</td></tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</div>` }
    ]
  },

  {
    id: 'progress', name: 'Progress', category: 'data',
    description: 'The determinate wait. A graphite rail filled to the fraction of a known total that is done — receipt against an order, lines closed on a GRN, quantity built against a plan — with the two figures written out beside it.',
    when: 'Work whose end is a number you already hold: 7,800 kg of 12,000, 6 lines of 14, stage 4 of 6. The fraction is the whole justification for the shape, so if you cannot name the denominator you cannot draw the bar — a report the server is still assembling, a filter that may return four rows or four thousand, a save you are waiting on, all of those are the spinner, which says that work is in flight and deliberately says nothing about how much is left. The two are not interchangeable and the failure is one-directional: a spinner where a bar belonged wastes a number you had, while a bar where a spinner belonged invents one you did not, and a rail sitting at a made-up 40% is read as a promise. Where the total arrives partway through — a job that counts its rows before it processes them — run the spinner first and swap in the bar at the moment the denominator exists. A bar that the user can drag is a slider, not this.',
    notes: [
      'The fill width is an inline style="width: 68%" and that is not a lapse in a utility-class system. Tailwind compiles its stylesheet out of the literal strings it finds in the source text, so a utility exists only if somebody wrote it down: class="w-[{{ pct }}%]" scans as the token w-[{{, emits no rule at all, and the fill renders zero wide — an empty rail rather than an error, which is why it reaches production. Safelisting w-[0%] through w-[100%] buys 101 classes that still cannot express 68.4, and there is no build step here to safelist in. A width that lives in a database row cannot be a class name. Colour stays a class, because the colour is a token and only the width is data.',
      'It is a div with role="progressbar", never a native <progress>. The element paints through three incompatible pseudo trees — ::-webkit-progress-bar and ::-webkit-progress-value in Blink, ::-moz-progress-bar in Gecko — none of which a utility class can reach, so styling one means writing the custom CSS this system does not have, and an unstyled <progress> is a different shape in every browser on the floor. It also carries an implicit indeterminate state that switches on the moment the value attribute is absent, so a template that renders <progress max="100"> while the figure is still null paints a browser-default animation nobody chose and nobody can turn off.',
      'A progressbar is output. No tabindex, no keyboard handler, no click target, no hover state — a Tab landing on it is a stop with nothing to do at it, and a screen reader user who arrives there has been sent somewhere they cannot act. If the figure is something the user sets rather than something the system reports, it is a slider or a number input and it belongs in forms. The link out to the detail is the record number in the text beside the bar, which has a readable name.',
      'All four of aria-valuenow, aria-valuemin, aria-valuemax and a name, every time. The two bounds default to 0 and 100 when omitted, which is true and still wrong to lean on: assistive tech computes the announcement as a percentage of the three numbers, so a bar counting lines with aria-valuenow="6" and no aria-valuemax is read out as six per cent instead of forty-three. The name says what is progressing — aria-labelledby pointed at the heading that is already on screen, or aria-label="Receipt against PO-24-1187" where there is no heading. "Progress" names none of the four bars in a panel.',
      'aria-valuetext when the reading is not a percentage, and only then. "6 of 14 lines received" is what the figure means; 43% is what the arithmetic makes of it. But a bar that genuinely is a percentage gets no valuetext at all, because supplying one replaces a string the browser has localised with one hardcoded in English, and an internal tool with a Marathi screen reader on it loses the translation for nothing.',
      'Over the total clamps the drawing and never the number. Over-receipt and over-production are ordinary in a plant — 12,480 kg built against a plan of 12,000 — and a bar has nowhere to put the extra, so the fill caps at 100% and the overshoot is carried in words: amber-500 on the bar, and a line that says over by 480 kg. aria-valuenow clamps to aria-valuemax as well, since a valuenow outside its own range is invalid ARIA and browsers differ on whether they report it, drop it or recompute it; the true figure goes in aria-valuetext and in the visible text where nothing can round it away. A bar sitting at a flat 100% otherwise looks identical whether it landed exactly or ran 4% past.',
      'Colour is state, and a bar takes it from the dot-or-bar column of the semantic table, not the column beside it: bg-emerald-600, bg-amber-500, bg-red-600. text-amber-700 is the shade for a 1.5px stroke somebody has to read, and it goes muddy as a 6px block; amber-500 is the shade for a disc or a bar, and it is illegible as a stroke. Same meaning, two weights, and picking the wrong one is not a near miss. The default is graphite and stays graphite: 68% received is not a warning, it is a Tuesday, and colouring every bar to make the panel look livelier spends the three colours that were meant to mean something.',
      'The percentage sits outside the bar. There is no room inside a 4px rail, and inside a 20px one the text crosses the fill boundary as the value climbs, so the same string is white on graphite at one end and zinc-700 on zinc-100 at the other and its contrast is a function of the data. Outside it goes on the baseline of the heading, right-aligned, tabular-nums, so a figure counting 8 to 68 to 100 does not shuffle the row it sits in.',
      'A bar is not a live region and never takes aria-live. An import that repaints the value every 200ms queues several hundred announcements that arrive minutes behind the work and talk over everything else on the page. If a long job is worth announcing, announce milestones — the same role="status" the spinner uses, written once every ten per cent, "1,240 of 3,100 rows" — and leave the bar to be read on demand.',
      'The width transitions when the value changes and never on the way in, and it is dropped under prefers-reduced-motion. Server-rendered markup carries the final width in the style attribute at first paint, so there is no starting value to move from and nothing animates — transition-[width] exists for the case where Alpine or an htmx swap changes a width that was already there. A bar written at width: 0 and driven up by x-init replays the whole fill on every navigation, and a receipt that is 68% done reads as a job restarting each time somebody opens the page. motion-reduce:transition-none then belongs on this component and is forbidden on the spinner, which is one reason applied twice: the bar\'s movement is decoration over a value that is correct at both ends of it, while the spinner\'s rotation is the only thing a spinner says, so removing that one leaves a static broken ring. The test is whether the motion carries the information.',
      'A tiny non-zero value has to paint something. 40 kg received against 12,000 is 0.33%, which is under a pixel on any rail narrower than 300px, so the fill rounds away and an order that has started looks exactly like one that has not. min-w-[2px] on the fill puts a floor under the drawing without touching the number. The zero case renders no fill element at all rather than a floored one, so nothing and almost-nothing stay two different pictures.',
      'A stacked bar is three parts at the outside. Good, rework and scrap is a stack; six purchase categories is a chart, and squeezing them into an 8px rail produces four segments under two pixels wide that cannot be pointed at, told apart or read. Past three parts, or where the parts need naming on the bar itself, it is the stacked variant of chart. Every stack carries a legend list with the real figures under it, because the one thing nobody can do with a stacked bar is read a value off it.'
    ],
    anatomy: [
      ['Track', 'The rail the fill runs in: h-1 to h-2, rounded-full, bg-zinc-200, overflow-hidden so a fill at any width is clipped to the rail\'s own corners. This is the element that carries role="progressbar" and the three aria values, because it is the thing whose extent means something.'],
      ['Fill', 'h-full with the width in an inline style and the colour in a class. Graphite by default, a semantic fill only when the record\'s state says so. min-w-[2px] so a fraction of a per cent still marks the rail, transition-[width] duration-300 so a changed value moves rather than jumps, motion-reduce:transition-none because that movement is decoration.'],
      ['Name', 'What is progressing, in text — the heading the bar sits under, tied to it with aria-labelledby, or an aria-label where there is no heading. Never the word "Progress".'],
      ['Reading', 'The two figures with their unit — "7,800 of 12,000 kg", "₹12,52,560 received of ₹18,42,000" — on the line under the bar, tabular-nums. The bar shows the shape of the answer; this is the answer.'],
      ['Percentage', 'The derived figure, on the heading baseline, right-aligned, tabular-nums. Optional where the reading already says everything, and omitted entirely when the scale is not a percentage.'],
      ['Segments', 'One block per stage in a flex gap-1 row for a run of named steps: graphite for done, zinc-400 for the one in progress, zinc-200 for the ones still ahead. Three greys, no semantic colour — the stage is a position, not a state.'],
      ['Legend', 'The list under a stacked bar: a swatch in the segment\'s own fill, the part name, the quantity. It is the accessible carrier of the numbers, since one progressbar cannot report three of them.'],
      ['Arc', 'The radial form. Two SVG circles at r="15.9155", whose circumference is 100 to three places, so stroke-dasharray="68 100" is the percentage written literally with no arithmetic in the template.']
    ],
    behaviour: [
      'The width comes out of the data as an inline style and the colour comes out of a class. Nothing about the fill is a Tailwind arbitrary value, because the value is not known when the stylesheet is compiled.',
      'It is graphite unless the record it tracks has a state. A quota over its limit turns red-600, an over-receipt turns amber-500, a finished run turns emerald-600, and everything else — most bars, most of the time — stays zinc-700.',
      'Past the total it clamps the drawing at 100% and leaves the number alone. The overshoot is stated in words beside the bar, so the difference between exactly met and 4% over survives.',
      'Zero paints an empty rail and nothing else. Anything above zero paints at least 2px, so started and not started are never the same picture.',
      'A changed value transitions its width over 300ms and a first paint does not, because the final width is already in the markup. Under prefers-reduced-motion the transition is dropped and the value is unaffected.',
      'Nothing in it is focusable, clickable or hoverable. The bar reports; the link beside it acts.',
      'It does not announce itself as it moves. A long job announces milestones through a separate role="status", so a screen reader is not reading percentages for four minutes.',
      'With no total there is no bar. The unknown phase is a spinner, and the bar replaces it at the moment a denominator exists — appearing at its real value, not at zero with a run-up.',
      'At 390px the row restacks: the bar goes full width, the figures drop under it, and the register becomes cards. A mini bar in a cell is the first thing to go, because 96px of rail in a 390px row is what forces the sideways scroll.'
    ],
    a11y: [
      'role="progressbar" on the track, with aria-valuenow, aria-valuemin and aria-valuemax all written out. The bounds are not left to default, because the announcement is computed from all three and a bar counting to 14 with the implicit maximum of 100 is announced at a seventh of its real value.',
      'The accessible name says what is progressing. aria-labelledby onto the heading already on the page where there is one, so the string is not maintained twice, and aria-label naming the record where there is not.',
      'aria-valuetext where the scale is not per cent — "6 of 14 lines received", "Stage 4 of 6, receipt in progress" — and no valuetext at all where it is, so the browser\'s own localised percentage is left in place.',
      'aria-valuenow is clamped into its declared range even when the real figure is outside it, because a value outside aria-valuemin and aria-valuemax is invalid and browsers disagree on what to do with it. The true figure lives in aria-valuetext and in the visible line, where nothing can drop it.',
      'The bar takes no tabindex and no keyboard. It is a reported value, not a control, and a slider role would promise an interaction that does not exist.',
      'No aria-live on the bar. A value that repaints every few hundred milliseconds under a live region generates announcements faster than they can be spoken; milestones go into a separate role="status" that is in the document before the job starts.',
      'A stacked bar is aria-hidden and the legend under it is the real content, because role="progressbar" can report exactly one value and a stack has three. Hiding the shape and exposing the list is the same trade the checklist marker makes: colour and shape for the eye, the words for the data.',
      'A segmented run is one progressbar over the whole strip, not one per block. Six progressbars in a row are announced as six separate waits; one with aria-valuenow="3", aria-valuemax="6" and a valuetext naming the current stage is the one fact somebody wanted.',
      'Colour is never the only carrier. A breached quota says "over limit" in text beside the red fill, and an over-receipt says by how much, so the state survives a greyscale screen, a forced-colours theme and a screen reader alike.'
    ],
    related: ['spinner', 'stat-card', 'chart', 'skeleton'],
    variants: [
      { id: 'bar', name: 'Bar with a label', code:
`<!-- The whole component. A zinc-100 rail with overflow-hidden, a graphite fill
     inside it, and the two figures written out underneath.

     The width is an inline style and has to be. Tailwind compiles its stylesheet
     out of the literal strings in the source, so class="w-[{{ pct }}%]" scans as
     the token w-[{{ and emits no rule — the fill comes back zero wide, which
     renders as an empty rail rather than as an error and is why it ships. A
     width that lives in a database row cannot be a class name. The colour stays
     a class, because the colour is a token and only the width is data.

     role="progressbar" goes on the track, since the track is the element whose
     extent means something, and it is named by pointing aria-labelledby at the
     heading that is already on screen rather than repeating the string in an
     aria-label where the two can drift.

     No aria-valuetext here: this bar really is a percentage, and supplying one
     would replace a string the browser localises with English typed by hand.

     min-w-[2px] so that a receipt of 40 kg against 12,000 — 0.33%, under a pixel
     — still marks the rail. transition-[width] is for the case where Alpine or an
     htmx swap moves an existing value; on first paint the final width is already
     in the attribute, so nothing animates and the bar does not replay itself on
     every navigation. motion-reduce drops the movement because the movement is
     decoration over a value that is correct at both ends — the opposite call to
     the spinner, whose rotation is the only thing it says. -->
<div data-kui="progress/bar" class="rounded-xl border border-zinc-300 bg-white p-4">
  <div class="flex items-baseline justify-between gap-3">
    <h3 id="pg-po1187" class="text-[13px]/5 font-medium">Receipt against PO-24-1187</h3>
    <p class="text-[13px]/5 tabular-nums">68%</p>
  </div>
  <div class="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200"
       role="progressbar" aria-labelledby="pg-po1187"
       aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
    <div class="h-full min-w-[2px] rounded-full bg-zinc-700 transition-[width] duration-300 motion-reduce:transition-none"
         style="width: 68%"></div>
  </div>
  <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">₹12,52,560 received of ₹18,42,000 · Sharma Extrusions · last GRN 12 Aug</p>
</div>` },

      { id: 'bare', name: 'Bar on its own', code:
`<!-- No percentage beside it, because the figure above it is already the reading.
     The bar is the shape of the number, not a second copy of it, and a KPI tile
     that prints 8,240 and then 69% next to a rail has said the same thing three
     times.

     Dropping the label does not drop the name. Each of these points
     aria-labelledby at the heading it sits under, so the bar is announced as
     "Quota used, 69%" and not as "progress bar, 69%" — which is what a bar with
     no name at all comes back as, three times over on this card, with nothing to
     tell them apart.

     Three heights and that is the scale. h-1 under a figure, where the bar is a
     footnote to something already stated; h-1.5 in a list row, where it shares a
     line with text; h-2 as the subject of its own panel. Nothing thicker — past
     8px the rail stops reading as a measurement and starts reading as a chart,
     and the empty part of it becomes a block of colour on the card. -->
<div data-kui="progress/bare" class="grid gap-4 sm:grid-cols-3">

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <h3 id="pg-bare-quota" class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Quota used</h3>
    <p class="mt-1.5 text-[24px]/7 font-semibold tracking-tight tabular-nums">8,240</p>
    <p class="text-[12px]/4 tabular-nums text-zinc-500">of 12,000 GRN lines, August</p>
    <div class="mt-2.5 h-1 overflow-hidden rounded-full bg-zinc-200"
         role="progressbar" aria-labelledby="pg-bare-quota"
         aria-valuenow="69" aria-valuemin="0" aria-valuemax="100">
      <div class="h-full min-w-[2px] rounded-full bg-zinc-700" style="width: 69%"></div>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <h3 id="pg-bare-store" class="text-[13px]/5 font-medium">Store 2 capacity</h3>
    <div class="mt-2 flex items-center gap-3">
      <div class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-200"
           role="progressbar" aria-labelledby="pg-bare-store"
           aria-valuenow="41" aria-valuemin="0" aria-valuemax="100">
        <div class="h-full min-w-[2px] rounded-full bg-zinc-700" style="width: 41%"></div>
      </div>
      <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">41%</span>
    </div>
    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">1,640 of 4,000 pallet positions</p>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <h3 id="pg-bare-empty" class="text-[13px]/5 font-medium">Receipt against PO-24-1211</h3>
    <div class="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200"
         role="progressbar" aria-labelledby="pg-bare-empty"
         aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
      <!-- zero renders no fill at all, not a fill floored to 2px, so nothing
           and almost-nothing stay two different pictures -->
    </div>
    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Nothing received yet · raised 18 Aug</p>
  </div>
</div>` },

      { id: 'steps', name: 'Segmented', code:
`<!-- Two things wear this shape and they are not the same thing. The top strip is
     a run of named stages, where the interesting fact is which stage. The bottom
     one is a count of identical units, where the interesting fact is how many.

     Three greys and no semantic colour. A stage is a position in a sequence, not
     a state — an order at "PO issued" is not a warning — so done is zinc-700, the
     stage in progress is zinc-400 and the ones ahead are zinc-100. Reaching for
     amber on the current block spends a colour that has to mean "waiting" when
     the register renders it in a status dot two lines down.

     One progressbar over the whole strip, not one per block. Six progressbars in
     a row are announced as six separate waits; one, with aria-valuenow="3",
     aria-valuemax="6" and a valuetext naming the stage, is the fact somebody
     wanted. The blocks inside it need no aria of their own — the children of a
     progressbar are presentational.

     aria-valuetext is doing real work in both: without it the top strip is read
     out as 50% and the bottom as 43%, which are arithmetically true and are not
     what either bar is about.

     The stage names are hidden below sm rather than shrunk. Six labels across
     390px is either six sideways-scrolling columns or six truncations reading
     "Rai…", and the summary line under the strip already names the one that
     matters. -->
<div data-kui="progress/steps" class="space-y-4">

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <div class="flex items-baseline justify-between gap-3">
      <h3 id="pg-seg-stage" class="text-[13px]/5 font-medium">PR-24-0338 · Requisition to payment</h3>
      <p class="text-[13px]/5 tabular-nums text-zinc-600">Stage 4 of 6</p>
    </div>

    <div class="mt-2.5 flex gap-1"
         role="progressbar" aria-labelledby="pg-seg-stage"
         aria-valuenow="3" aria-valuemin="0" aria-valuemax="6"
         aria-valuetext="Stage 4 of 6, receipt in progress">
      <span class="h-2 flex-1 rounded-full bg-zinc-700"></span>
      <span class="h-2 flex-1 rounded-full bg-zinc-700"></span>
      <span class="h-2 flex-1 rounded-full bg-zinc-700"></span>
      <span class="h-2 flex-1 rounded-full bg-zinc-400"></span>
      <span class="h-2 flex-1 rounded-full bg-zinc-200"></span>
      <span class="h-2 flex-1 rounded-full bg-zinc-200"></span>
    </div>

    <div class="mt-1.5 hidden gap-1 sm:flex" aria-hidden="true">
      <span class="min-w-0 flex-1 truncate text-[11px]/4 text-zinc-500">Raised</span>
      <span class="min-w-0 flex-1 truncate text-[11px]/4 text-zinc-500">Approved</span>
      <span class="min-w-0 flex-1 truncate text-[11px]/4 text-zinc-500">PO issued</span>
      <span class="min-w-0 flex-1 truncate text-[11px]/4 font-medium text-zinc-900">Receipt</span>
      <span class="min-w-0 flex-1 truncate text-[11px]/4 text-zinc-500">Invoiced</span>
      <span class="min-w-0 flex-1 truncate text-[11px]/4 text-zinc-500">Paid</span>
    </div>

    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500 sm:mt-2">Receipt in progress since 09 Aug · Sharma Extrusions · next, invoice against GRN</p>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <div class="flex items-baseline justify-between gap-3">
      <h3 id="pg-seg-lines" class="text-[13px]/5 font-medium">Lines received on PO-24-1203</h3>
      <p class="text-[13px]/5 tabular-nums text-zinc-600">6 of 14</p>
    </div>
    <div class="mt-2.5 flex gap-1"
         role="progressbar" aria-labelledby="pg-seg-lines"
         aria-valuenow="6" aria-valuemin="0" aria-valuemax="14"
         aria-valuetext="6 of 14 lines received">
      <span class="h-1.5 flex-1 rounded-full bg-zinc-700"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-700"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-700"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-700"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-700"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-700"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-200"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-200"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-200"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-200"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-200"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-200"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-200"></span>
      <span class="h-1.5 flex-1 rounded-full bg-zinc-200"></span>
    </div>
    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Last GRN 12 Aug · Nashik Steel Traders · 8 lines open</p>
  </div>
</div>` },

      { id: 'inline', name: 'In a register row', code:
`<!-- A column of bars is read down, not across, so every rail is the same fixed
     w-24 and every fill starts at the same x. Let them size to the column and a
     row with a longer vendor name gets a shorter bar, which puts two orders at
     the same 68% at two different widths and makes the column unreadable at
     exactly the job it exists for.

     h-1.5 and no thicker. The bar is one cell of a 40px row and it competes with
     the number beside it; an 8px rail down a register reads as a bar chart
     somebody laid over the table.

     Every row is its own progressbar and every one is named for its own record —
     aria-label="Received against PO-24-1194", not "Received" repeated four times.
     There is no heading per row to point aria-labelledby at, so the label is
     written out here.

     PO-24-1211 is at 3%: 360 kg of 12,000. min-w-[2px] is what keeps that row
     distinguishable from PO-24-1218 at zero, which renders an empty rail and no
     fill element at all. Without the floor both are a bare track and the register
     says an order that has started has not.

     PO-24-1194 is over its ordered quantity. The fill clamps at 100% and
     aria-valuenow clamps to 100 with it, because a valuenow past valuemax is
     invalid ARIA; the true 104% is in aria-valuetext and in the amber figure, so
     nothing rounds the overshoot away.

     Below md the table goes and cards take over. 96px of rail plus a percentage
     plus a vendor name in a 390px row is what forces the sideways scroll rule to
     be broken, so on a phone the bar goes full width under the record and the
     figures sit above it. -->
<div data-kui="progress/inline" class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <table class="hidden w-full text-[13px]/5 md:table">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Received</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Quantity</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="px-4 py-2.5">Sharma Extrusions</td>
        <td class="px-4 py-2.5">
          <span class="flex items-center gap-2">
            <span class="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-200"
                  role="progressbar" aria-label="Received against PO-24-1187"
                  aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
              <span class="block h-full min-w-[2px] rounded-full bg-zinc-700" style="width: 68%"></span>
            </span>
            <span class="text-[12px]/4 tabular-nums text-zinc-600">68%</span>
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-600">8,160 / 12,000 kg</td>
      </tr>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1194</td>
        <td class="px-4 py-2.5">Gujarat Polymers Ltd</td>
        <td class="px-4 py-2.5">
          <span class="flex items-center gap-2">
            <span class="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-200"
                  role="progressbar" aria-label="Received against PO-24-1194"
                  aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"
                  aria-valuetext="104% received, over by 320 kg">
              <span class="block h-full min-w-[2px] rounded-full bg-amber-500" style="width: 100%"></span>
            </span>
            <span class="text-[12px]/4 tabular-nums text-zinc-600">104%</span>
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-600">8,320 / 8,000 kg</td>
      </tr>
      <tr class="border-b border-zinc-100 hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1211</td>
        <td class="px-4 py-2.5">Nashik Steel Traders</td>
        <td class="px-4 py-2.5">
          <span class="flex items-center gap-2">
            <span class="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-200"
                  role="progressbar" aria-label="Received against PO-24-1211"
                  aria-valuenow="3" aria-valuemin="0" aria-valuemax="100">
              <span class="block h-full min-w-[2px] rounded-full bg-zinc-700" style="width: 3%"></span>
            </span>
            <span class="text-[12px]/4 tabular-nums text-zinc-600">3%</span>
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-600">360 / 12,000 kg</td>
      </tr>
      <tr class="hover:bg-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1218</td>
        <td class="px-4 py-2.5">Aurangabad Castings</td>
        <td class="px-4 py-2.5">
          <span class="flex items-center gap-2">
            <span class="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-200"
                  role="progressbar" aria-label="Received against PO-24-1218"
                  aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></span>
            <span class="text-[12px]/4 tabular-nums text-zinc-500">0%</span>
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-600">0 / 2,400 kg</td>
      </tr>
    </tbody>
  </table>

  <ul role="list" class="divide-y divide-zinc-100 md:hidden">
    <li class="px-4 py-3">
      <div class="flex items-baseline justify-between gap-3">
        <span class="text-[14px]/5 font-medium tabular-nums">PO-24-1187</span>
        <span class="text-[13px]/5 tabular-nums text-zinc-600">68%</span>
      </div>
      <p class="mt-0.5 text-[13px]/5 text-zinc-600">Sharma Extrusions</p>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"
           role="progressbar" aria-label="Received against PO-24-1187"
           aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
        <div class="h-full min-w-[2px] rounded-full bg-zinc-700" style="width: 68%"></div>
      </div>
      <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">8,160 of 12,000 kg received</p>
    </li>
    <li class="px-4 py-3">
      <div class="flex items-baseline justify-between gap-3">
        <span class="text-[14px]/5 font-medium tabular-nums">PO-24-1194</span>
        <span class="text-[13px]/5 tabular-nums text-zinc-600">104%</span>
      </div>
      <p class="mt-0.5 text-[13px]/5 text-zinc-600">Gujarat Polymers Ltd</p>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"
           role="progressbar" aria-label="Received against PO-24-1194"
           aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"
           aria-valuetext="104% received, over by 320 kg">
        <div class="h-full min-w-[2px] rounded-full bg-amber-500" style="width: 100%"></div>
      </div>
      <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">8,320 of 8,000 kg received · over by 320 kg</p>
    </li>
  </ul>
</div>` },

      { id: 'tones', name: 'Over a limit', code:
`<!-- The three cases where a bar stops being graphite, and the one where it does
     not. Colour here is the record's state, taken from the dot-or-bar column of
     the semantic table — bg-emerald-600, bg-amber-500, bg-red-600 — and never
     from the column beside it. text-amber-700 is the shade for a 1.5px stroke you
     have to read and it goes muddy as a 6px block; amber-500 is the shade for a
     disc or a bar and it is illegible as a stroke. The figures beside the bars
     take the reading shades, which is why the breached row is text-red-600 above
     a bg-red-600 fill.

     Delhi Traders sits at 41% and stays zinc-700. Most bars on most screens are
     that row, and colouring them to fill out the palette is what makes the red
     one on the last row stop being noticed.

     Colour is never the only carrier. Every row says its state in words —
     "within limit", "approaching limit", "over limit" — because the fill is
     invisible to a screen reader, indistinguishable in greyscale, and dropped in
     forced-colours mode, which is three separate ways to lose the one fact the
     panel exists to show.

     The bar is graphite again the moment the breach is cleared. A red rail is a
     description of what the account is doing now, not a mark against it. -->
<div data-kui="progress/tones" class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <div class="border-b border-zinc-200 px-4 py-3">
    <h2 class="text-[14px]/5 font-semibold">Credit limit utilisation</h2>
    <p class="mt-0.5 text-[12px]/4 text-zinc-500">Outstanding against sanctioned limit · as at 20 Aug</p>
  </div>
  <ul role="list" class="divide-y divide-zinc-100">

    <li class="px-4 py-3">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 id="pg-tone-a" class="text-[13px]/5 font-medium">Delhi Traders Pvt Ltd</h3>
        <p class="text-[13px]/5 tabular-nums text-zinc-600">41%</p>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"
           role="progressbar" aria-labelledby="pg-tone-a"
           aria-valuenow="41" aria-valuemin="0" aria-valuemax="100">
        <div class="h-full min-w-[2px] rounded-full bg-zinc-700" style="width: 41%"></div>
      </div>
      <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">₹8,20,000 of ₹20,00,000 · within limit</p>
    </li>

    <li class="px-4 py-3">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 id="pg-tone-b" class="text-[13px]/5 font-medium">Gujarat Polymers Ltd</h3>
        <p class="text-[13px]/5 tabular-nums text-amber-700">92%</p>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"
           role="progressbar" aria-labelledby="pg-tone-b"
           aria-valuenow="92" aria-valuemin="0" aria-valuemax="100">
        <div class="h-full min-w-[2px] rounded-full bg-amber-500" style="width: 92%"></div>
      </div>
      <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">₹13,80,000 of ₹15,00,000 · approaching limit, ₹1,20,000 left</p>
    </li>

    <li class="px-4 py-3">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 id="pg-tone-c" class="text-[13px]/5 font-medium">Nashik Steel Traders</h3>
        <p class="text-[13px]/5 tabular-nums text-red-600">118%</p>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"
           role="progressbar" aria-labelledby="pg-tone-c"
           aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"
           aria-valuetext="118% of limit, over by 1,44,000 rupees">
        <div class="h-full min-w-[2px] rounded-full bg-red-600" style="width: 100%"></div>
      </div>
      <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">₹9,44,000 of ₹8,00,000 · over limit by ₹1,44,000, new orders blocked</p>
    </li>

    <li class="px-4 py-3">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 id="pg-tone-d" class="text-[13px]/5 font-medium">Aurangabad Castings</h3>
        <p class="text-[13px]/5 tabular-nums text-zinc-600">0%</p>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"
           role="progressbar" aria-labelledby="pg-tone-d"
           aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
      <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4 tabular-nums text-zinc-500">
        <i data-lucide="check-circle-2" class="size-3.5 shrink-0 text-emerald-600"></i>Settled in full on 14 Aug · ₹0 of ₹6,00,000
      </p>
    </li>
  </ul>
</div>` },

      { id: 'stacked', name: 'Stacked', code:
`<!-- One total split three ways. The segments are a flex row inside the same
     overflow-hidden rounded-full track, each with its width in an inline style,
     and the part of the total that is not yet built is simply track showing
     through — a fourth grey segment for "remaining" would say the same thing
     twice and take a colour to say it.

     Three parts at the outside. Six purchase categories in an 8px rail produce
     segments under two pixels wide that cannot be pointed at, told apart or read;
     past three, or where the parts need naming on the bar itself, it is the
     stacked variant of chart.

     The bar is aria-hidden and the legend is the real content. role="progressbar"
     reports exactly one value and a stack has three, so a progressbar over the
     whole thing would have to pick one and silently drop the other two. Hiding
     the shape and exposing a list is the same trade the checklist marker makes:
     colour and shape for the eye, the words for the data. A screen reader gets
     "list, 3 items — Good, 8,940 kilograms, 74.5%" and so on, which is more than
     anybody can read off the bar.

     The legend swatches carry the segment fills exactly, so a swatch and the
     block it names cannot drift. They are aria-hidden because the row already
     names its part in text.

     The swatches are solid shapes and take no ring — the ring rule is for tinted
     shapes, and a pale ring around a 10px emerald square looks like a rendering
     fault. -->
<div data-kui="progress/stacked" class="max-w-lg rounded-xl border border-zinc-300 bg-white p-4">
  <div class="flex items-baseline justify-between gap-3">
    <h3 class="text-[13px]/5 font-medium">PRD-24-0417 · quantity built</h3>
    <p class="text-[13px]/5 tabular-nums text-zinc-600">9,540 of 12,000 kg</p>
  </div>

  <div class="mt-2.5 flex h-2 overflow-hidden rounded-full bg-zinc-200" aria-hidden="true">
    <div class="h-full bg-emerald-600" style="width: 74.5%"></div>
    <div class="h-full bg-amber-500" style="width: 3.5%"></div>
    <div class="h-full bg-red-600" style="width: 1.5%"></div>
  </div>

  <ul role="list" class="mt-3 space-y-1.5">
    <li class="flex items-center gap-2.5">
      <span class="size-2.5 shrink-0 rounded-sm bg-emerald-600" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 text-[13px]/5">Good</span>
      <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">8,940 kg</span>
      <span class="w-12 shrink-0 text-right text-[13px]/5 tabular-nums text-zinc-500">74.5%</span>
    </li>
    <li class="flex items-center gap-2.5">
      <span class="size-2.5 shrink-0 rounded-sm bg-amber-500" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 text-[13px]/5">Held for rework</span>
      <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">420 kg</span>
      <span class="w-12 shrink-0 text-right text-[13px]/5 tabular-nums text-zinc-500">3.5%</span>
    </li>
    <li class="flex items-center gap-2.5">
      <span class="size-2.5 shrink-0 rounded-sm bg-red-600" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 text-[13px]/5">Scrapped</span>
      <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">180 kg</span>
      <span class="w-12 shrink-0 text-right text-[13px]/5 tabular-nums text-zinc-500">1.5%</span>
    </li>
    <li class="flex items-center gap-2.5 border-t border-zinc-100 pt-1.5">
      <span class="size-2.5 shrink-0 rounded-sm bg-zinc-100 ring-1 ring-inset ring-zinc-300" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 text-[13px]/5 text-zinc-600">Still to build</span>
      <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">2,460 kg</span>
      <span class="w-12 shrink-0 text-right text-[13px]/5 tabular-nums text-zinc-500">20.5%</span>
    </li>
  </ul>
</div>` },

      { id: 'radial', name: 'Radial meter', code:
`<!-- Use this once per screen or not at all. A ring is worse than a rail at the
     job a bar is usually doing: two rings side by side cannot be compared, a
     column of them cannot be scanned, and the shape costs 112px of height to
     carry one number that a 4px rail under a figure carries for free. It earns
     its place in exactly one place — a single headline figure that stands alone,
     where the ring is the tile rather than a decoration inside it.

     r="15.9155" is the whole trick: the circumference is 2πr = 100.000 to three
     places, so stroke-dasharray="68 100" is the percentage written literally and
     there is no arithmetic in the template to get wrong. -rotate-90 puts the
     start at twelve o'clock; the default transform origin is the centre, so no
     origin utility is needed.

     Butt caps, not round. stroke-linecap="round" paints a visible dot at
     dasharray="0 100", so a plant that has despatched nothing shows a mark saying
     it has started.

     The track is stroke-zinc-200, one step darker than the zinc-100 a rail uses.
     At 4px on white, zinc-100 reads as a groove; at 9px it is a wide pale band
     that vanishes into a white card, which is the same reason the spinner's ring
     takes zinc-200.

     The colours are stroke-* classes, not a conic-gradient. A gradient needs the
     hex written into the style attribute, and arbitrary values are for one-off
     sizes and never for colour — the width comes out of the data, the colour
     comes out of the token table.

     role and the values go on the wrapper and the svg is aria-hidden, because
     Firefox has historically mishandled ARIA on inline SVG roots and because the
     percentage in the middle is a real text node either way. -->
<div data-kui="progress/radial" class="flex max-w-xs flex-col items-center rounded-xl border border-zinc-300 bg-white p-5 text-center">
  <h3 id="pg-radial" class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Despatch against plan</h3>

  <div class="relative mt-3 flex size-28 items-center justify-center"
       role="progressbar" aria-labelledby="pg-radial"
       aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
    <svg viewBox="0 0 36 36" class="size-28 -rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r="15.9155" stroke-width="3" class="fill-none stroke-zinc-200"></circle>
      <circle cx="18" cy="18" r="15.9155" stroke-width="3" stroke-dasharray="68 100" class="fill-none stroke-zinc-700"></circle>
    </svg>
    <span class="absolute text-[24px]/7 font-semibold tracking-tight tabular-nums">68%</span>
  </div>

  <p class="mt-3 text-[13px]/5 tabular-nums">8,160 of 12,000 kg despatched</p>
  <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">August plan · Nashik · 9 working days left</p>
</div>` },

      { id: 'indeterminate', name: 'When the total is not known yet', code:
`<!-- The handoff. One job, two shapes, and the thing that decides which is
     whether a denominator exists yet.

     While the import is still counting rows there is no bar, and there is no
     indeterminate bar to fall back on either. ARIA does define one — role=
     "progressbar" with aria-valuenow omitted — but drawing it needs a chunk that
     slides along the rail, and stock Tailwind has no keyframe that does that:
     animate-pulse fades opacity, animate-bounce translates on Y, animate-spin
     rotates. Writing the keyframe means the custom CSS this system does not
     have. And the cheap substitute is worse than nothing — a full-width rail
     under animate-pulse is a bar sitting at 100% that happens to be breathing,
     which is a value, and a wrong one. So the unknown phase is the spinner, which
     is the component whose entire job is to say that work is in flight without
     claiming how much of it is left.

     The bar appears at its real value, not at zero with a run-up. The rows that
     were already processed while the count finished are progress that happened,
     and replaying the fill from zero is the same defect as animating a
     server-rendered bar in on every page load.

     The spinner's ring is aria-hidden and the announcement is the text inside the
     role="status", which is on the panel and outside both branches so it survives
     the swap between them. The bar itself takes no aria-live — a value repainting
     every 400ms under a live region queues announcements faster than they can be
     spoken — so the status carries milestones only, at every 25%.

     x-cloak on the branch hidden at first paint, because Alpine boots after the
     HTML renders and without it the bar flashes under the spinner on load. -->
<div data-kui="progress/indeterminate" class="max-w-md rounded-xl border border-zinc-300 bg-white p-4"
     x-data="{
       phase: 'counting', done: 0, total: 0, said: 0, timer: null,
       pct() { return this.total ? Math.round(this.done / this.total * 100) : 0 },
       run() {
         clearInterval(this.timer);
         this.phase = 'counting'; this.done = 0; this.total = 0; this.said = 0;
         setTimeout(() => {
           this.total = 3100; this.done = 240; this.phase = 'running';
           this.timer = setInterval(() => {
             this.done = Math.min(this.total, this.done + 290);
             if (this.pct() >= this.said + 25) this.said = Math.floor(this.pct() / 25) * 25;
             if (this.done >= this.total) { clearInterval(this.timer); this.phase = 'done' }
           }, 400);
         }, 2400);
       }
     }"
     x-init="run()"
     :aria-busy="phase !== 'done'">

  <div class="flex items-baseline justify-between gap-3">
    <h3 id="pg-import" class="text-[13px]/5 font-medium">Importing the August rate card</h3>
    <button type="button" @click="run()" :disabled="phase !== 'done'"
            class="shrink-0 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 disabled:text-zinc-400 disabled:no-underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      Run again
    </button>
  </div>

  <!-- no total yet: a spinner, and not a bar at a number nobody has -->
  <div x-show="phase === 'counting'" class="mt-3 flex items-center gap-3">
    <span class="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    <span class="text-[13px]/5 text-zinc-600">Counting the rows in the upload</span>
  </div>

  <!-- the total exists: the bar takes over, at the value the job is actually at -->
  <div x-show="phase !== 'counting'" x-cloak class="mt-3">
    <div class="h-1.5 overflow-hidden rounded-full bg-zinc-200"
         role="progressbar" aria-labelledby="pg-import"
         :aria-valuenow="done" aria-valuemin="0" :aria-valuemax="total"
         :aria-valuetext="done.toLocaleString('en-IN') + ' of ' + total.toLocaleString('en-IN') + ' rows imported'">
      <div class="h-full min-w-[2px] rounded-full transition-[width] duration-300 motion-reduce:transition-none"
           :class="phase === 'done' ? 'bg-emerald-600' : 'bg-zinc-700'"
           :style="'width: ' + pct() + '%'"></div>
    </div>
    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">
      <span x-text="done.toLocaleString('en-IN')"></span> of <span x-text="total.toLocaleString('en-IN')"></span> rows ·
      <span x-text="phase === 'done' ? 'finished' : 'you can leave this page, it keeps running'"></span>
    </p>
  </div>

  <!-- milestones only. On the panel, outside both branches, so it is in the
       document before either message lands. -->
  <p role="status" class="sr-only"
     x-text="phase === 'counting' ? 'Counting the rows in the upload'
             : phase === 'done' ? 'Import finished, 3,100 rows'
             : said + ' per cent imported'"></p>
</div>` },

      { id: 'production', name: 'A production order', code:
`<!-- The assembled case: one order, three of these shapes, each doing the job the
     others cannot.

     The headline bar is quantity against plan, and it is over. The fill clamps at
     100% and aria-valuenow clamps to aria-valuemax with it, because a valuenow
     outside its declared range is invalid ARIA and browsers disagree on whether
     to report it, drop it or recompute it. The real 104% is in aria-valuetext, in
     the amber figure and in the line under the bar, so the difference between
     landing exactly on plan and running 480 kg past it survives everywhere. The
     bar is amber-500 rather than emerald-600: this run is not simply finished,
     there is 480 kg of unplanned stock to account for.

     The stack under it is the quality split, aria-hidden with the legend beside
     it carrying the figures, because one progressbar cannot report three values.

     The operations are their own register: fixed w-24 rails so the column can be
     read down, and a grid that puts the bar on its own line below sm rather than
     shrinking it. The bar in the last row is zinc-700 at 0%, which renders as a
     bare rail — a step that has not started, not a step at 2px.

     Nothing in the panel is focusable except the link out to the order, which is
     the record number in text. A progressbar is output, and Tab has nothing to do
     inside one. -->
<div data-kui="progress/production" class="max-w-3xl overflow-hidden rounded-xl border border-zinc-300 bg-white">

  <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-zinc-200 px-4 py-3">
    <div class="min-w-0">
      <h2 class="text-[16px]/6 font-semibold tabular-nums">PRD-24-0417</h2>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">HDPE drum 200 L, natural · Line 2, Nashik · released 11 Aug</p>
    </div>
    <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
    </span>
  </div>

  <div class="border-b border-zinc-200 px-4 py-4">
    <div class="flex items-baseline justify-between gap-3">
      <h3 id="pg-prd-qty" class="text-[13px]/5 font-medium">Quantity built against plan</h3>
      <p class="text-[13px]/5 tabular-nums text-amber-700">104%</p>
    </div>
    <div class="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200"
         role="progressbar" aria-labelledby="pg-prd-qty"
         aria-valuenow="12000" aria-valuemin="0" aria-valuemax="12000"
         aria-valuetext="12,480 kg of 12,000 planned, over by 480 kg">
      <div class="h-full min-w-[2px] rounded-full bg-amber-500 transition-[width] duration-300 motion-reduce:transition-none"
           style="width: 100%"></div>
    </div>
    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">12,480 kg built of 12,000 planned · over by 480 kg, awaiting a variance note before closure</p>
  </div>

  <div class="border-b border-zinc-200 px-4 py-4">
    <h3 class="text-[13px]/5 font-medium">Quality split</h3>
    <div class="mt-2.5 flex h-2 overflow-hidden rounded-full bg-zinc-200" aria-hidden="true">
      <div class="h-full bg-emerald-600" style="width: 95.2%"></div>
      <div class="h-full bg-amber-500" style="width: 3.4%"></div>
      <div class="h-full bg-red-600" style="width: 1.4%"></div>
    </div>
    <ul role="list" class="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-3">
      <li class="flex items-center gap-2.5">
        <span class="size-2.5 shrink-0 rounded-sm bg-emerald-600" aria-hidden="true"></span>
        <span class="min-w-0 flex-1 text-[13px]/5">Good</span>
        <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">11,880 kg</span>
      </li>
      <li class="flex items-center gap-2.5">
        <span class="size-2.5 shrink-0 rounded-sm bg-amber-500" aria-hidden="true"></span>
        <span class="min-w-0 flex-1 text-[13px]/5">Rework</span>
        <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">420 kg</span>
      </li>
      <li class="flex items-center gap-2.5">
        <span class="size-2.5 shrink-0 rounded-sm bg-red-600" aria-hidden="true"></span>
        <span class="min-w-0 flex-1 text-[13px]/5">Scrap</span>
        <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">180 kg</span>
      </li>
    </ul>
  </div>

  <div class="px-4 py-4">
    <h3 class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Operations</h3>
    <ul role="list" class="mt-2.5 divide-y divide-zinc-100">

      <li class="grid gap-x-4 gap-y-1.5 py-2.5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <span class="text-[13px]/5">10 · Blow moulding</span>
        <span class="flex items-center gap-2 sm:order-3">
          <span class="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-200"
                role="progressbar" aria-label="Operation 10, blow moulding"
                aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
            <span class="block h-full rounded-full bg-emerald-600" style="width: 100%"></span>
          </span>
          <span class="w-10 shrink-0 text-right text-[12px]/4 tabular-nums text-zinc-600">100%</span>
        </span>
        <span class="text-[12px]/4 tabular-nums text-zinc-500 sm:order-2 sm:pr-4">12,480 / 12,000 kg</span>
      </li>

      <li class="grid gap-x-4 gap-y-1.5 py-2.5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <span class="text-[13px]/5">20 · Neck trimming</span>
        <span class="flex items-center gap-2 sm:order-3">
          <span class="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-200"
                role="progressbar" aria-label="Operation 20, neck trimming"
                aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
            <span class="block h-full rounded-full bg-emerald-600" style="width: 100%"></span>
          </span>
          <span class="w-10 shrink-0 text-right text-[12px]/4 tabular-nums text-zinc-600">100%</span>
        </span>
        <span class="text-[12px]/4 tabular-nums text-zinc-500 sm:order-2 sm:pr-4">12,480 / 12,480 kg</span>
      </li>

      <li class="grid gap-x-4 gap-y-1.5 py-2.5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <span class="text-[13px]/5">30 · Leak test</span>
        <span class="flex items-center gap-2 sm:order-3">
          <span class="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-200"
                role="progressbar" aria-label="Operation 30, leak test"
                aria-valuenow="62" aria-valuemin="0" aria-valuemax="100">
            <span class="block h-full min-w-[2px] rounded-full bg-zinc-700" style="width: 62%"></span>
          </span>
          <span class="w-10 shrink-0 text-right text-[12px]/4 tabular-nums text-zinc-600">62%</span>
        </span>
        <span class="text-[12px]/4 tabular-nums text-zinc-500 sm:order-2 sm:pr-4">7,740 / 12,480 kg</span>
      </li>

      <li class="grid gap-x-4 gap-y-1.5 py-2.5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <span class="text-[13px]/5 text-zinc-600">40 · Labelling and palletising</span>
        <span class="flex items-center gap-2 sm:order-3">
          <span class="h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-200"
                role="progressbar" aria-label="Operation 40, labelling and palletising"
                aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></span>
          <span class="w-10 shrink-0 text-right text-[12px]/4 tabular-nums text-zinc-500">0%</span>
        </span>
        <span class="text-[12px]/4 tabular-nums text-zinc-500 sm:order-2 sm:pr-4">0 / 12,480 kg</span>
      </li>
    </ul>

    <p class="mt-3 text-[12px]/4 text-zinc-500">
      Reported by Ritu Deshpande · <a href="#" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">open the order</a>
    </p>
  </div>
</div>` }
    ]
  },

  {
      id: 'empty-state', name: 'Empty state', category: 'data',
      description: 'What a region shows when it has nothing to draw. Four different situations wearing one shape — nothing created yet, nothing matching the query, nothing this account may see, and nothing that loaded — and the whole job of the component is saying which one it is.',
      when: 'Any region that renders a collection and can render none of it: a register, a search result, a list of attachments, a panel of recent activity, the lines on a draft order. It is not the component for a page that cannot be shown at all — a 404, a 403 on the record itself or a 500 is error-page, which owns the whole viewport and the way back into the app. It is not the component for a wait, either: rows that have not arrived yet are a skeleton or a spinner, and an empty state shown while the request is still in flight tells the user there is nothing there and then contradicts itself a moment later. Reach for it the instant a count is known to be zero, and not before.',
      notes: [
        'There are four empties and they are not interchangeable. Nothing-yet is a table with no rows in it at all, and it offers the create action. No-results is a table with rows in it that the query excluded, and it offers to widen or clear the query. No-permission is a table with rows in it that this account may not read, and it names the permission and the person who grants it. Error is a table whose rows nobody has seen, because the request failed, and it says what failed and offers Retry. Using the wrong one is the defect this entry exists to prevent, and every one of the four is a defect somebody shipped: a create button under a filtered register, a "no results" over a permission failure, and a timeout rendered as "No orders found" have all been in production.',
        'Never offer create in a no-results state. The rows exist; the filter is hiding them. A buyer who searches for an order by the wrong number, gets "No purchase orders found" with a New purchase order button under it and takes the offer has now raised the same order twice, and the duplicate is discovered at three-way match a fortnight later. The test is mechanical and belongs in the view, not in the template: if the unfiltered count for this scope is greater than zero, the state is no-results and the create button is not on the page. The mirror of it is the same rule read backwards — never offer "Clear filters" on a nothing-yet, where with no predicates set the control does nothing when it is pressed, and a control that does nothing when it is pressed reads as a broken page rather than an empty one.',
        'A load failure is not an empty state in disguise. "No goods receipts found" after a 30-second timeout tells the user their receipts are gone, and the honest ones then go and re-enter them. The error variant says what failed, says whether anything was changed — which is the question anybody who just pressed Save is actually asking — and offers Retry as a real button. A view that raises must render the failed fragment into the same slot at the same height rather than 500ing, or the spinner above it turns forever.',
        'A permission failure is not an empty state in disguise either, and it is the one most often mislabelled, because the query genuinely does return zero rows once the row-level filter has run. Showing that as "No orders yet" is a lie that costs a support ticket: the user creates a record to fill the emptiness, cannot see it afterwards either, and now believes the save failed. Say which scope is closed, say who opens it — a name and a role, not "your administrator" — and show no create action at all.',
        'The empty state is announced, not only drawn. Filtering a register to zero swaps one silent block of markup for another, and to a screen-reader user the rows simply stop existing with nothing said. Put a role="status" on the panel that survives the swap, in the document before the filter is ever touched, and write the count into it — "No goods receipts match these filters" landing in a region that was already there is the thing that gets read. A role="status" that arrives inside the empty state with its message already in it has not changed, so it announces nothing at all.',
        'Never make the results region itself aria-live. It fires on every re-render, so narrowing 128 receipts to 40 reads forty rows aloud before the user has finished typing, and the one sentence that mattered is buried in the middle of it. One short status line outside the rows carries the count for every state, empty or not. role="alert" is worse again: assertive interrupts the person still typing into the search box that caused it.',
        'It occupies the box the rows would have. A panel that collapses from 420px to 140px when a filter matches nothing drags everything below it up under the cursor, and the next click lands on whatever moved into that place. Give the slot the min-height the loaded panel has, and give the empty state the panel\'s own padding rather than a margin that a sibling can collapse against.',
        'Inside a table the empty state is a single <td colspan> row in the <tbody>, never a div dropped after the </table>. A sibling div is outside the table in the accessibility tree, so somebody reading the table with table navigation walks a table of zero rows and is never told why; the colspan cell is a row and gets read in place. The colspan has to equal the number of columns actually rendered, so where a column-visibility menu exists it is bound and not typed — a hardcoded colspan="6" under four visible columns stretches the cell past the header and the panel edge lands in the middle of the sentence. Keep the header row above it when the emptiness is a query result — the sort and the column choices are still in force and the header is where the user goes to undo them — and drop the whole table when the scope has genuinely never held a record, where a row of column names describing nothing is the empty table that reads as a bug.',
        'The icon well is bg-zinc-200 with ring-1 ring-inset ring-zinc-300 in all four states, the error one included. There is no red well, no amber well and no -50 tint anywhere in this component: a full panel of red behind a timeout shouts louder than the overdue rows it is failing to show, and it makes a transient network fault look like data loss. The tone lives in the glyph and in the words — alert-circle in text-red-600 on the same graphite disc every other state uses.',
        'One action, and which action it is carries the meaning. A second route is allowed and is a link, never a second filled button — two graphite buttons side by side make the user choose before they have read why they are choosing. Past two, the empty state has become a menu, and a menu is what the toolbar above it already is.',
        'The headline states what is true in the words of the register it sits in. "No goods receipts on 21 Aug" is a fact somebody can act on; "No data" is the variable name. The explanation underneath says why, and where a query caused it, it echoes the query — the string that was typed, the chips that are set, the date scope in force — because with five controls above the panel the user cannot otherwise tell which one is holding the rows back.',
        'No illustration. A 200px drawing of an empty box is the largest thing on a screen that is by definition telling somebody nothing happened, it has to be redrawn for every state, and it says less than the sentence it is pushing below the fold. One size-10 well, one glyph, and the words.'
      ],
      anatomy: [
        ['Slot', 'The box inside the panel that the rows would have filled, carrying the panel\'s own padding and the loaded panel\'s min-height, so nothing moves when data arrives.'],
        ['Icon well', 'size-10 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 round a size-5 glyph. Graphite in every state; only the glyph takes a tone, and only in the error case.'],
        ['Headline', 'One sentence of fact, as a real heading one level below the panel\'s title. Names the register and the scope: "No goods receipts on 21 Aug", not "No data".'],
        ['Explanation', 'Why it is empty and what would change it, in a max-w-sm line of zinc-600 so it wraps into two readable lines rather than one wide one.'],
        ['Query echo', 'The predicates that produced the emptiness, rendered as they were set — the typed string, the filter chips, the date scope. Only in the no-results states; a nothing-yet has no query to show.'],
        ['Action', 'The one control that answers the state: create for nothing-yet, clear for no-results, Retry for error, and none at all for no-permission.'],
        ['Secondary route', 'A link beside the action — Request access, Report this, Show this week. Text with an underline, so it does not compete with the button.'],
        ['Status region', 'A role="status" on the panel above the rows, present before any filter is touched, holding the count. This is what announces the emptiness; the block of markup below it announces nothing.']
      ],
      behaviour: [
        'The state is chosen from the counts, not from the render. Zero rows after a query with predicates is no-results; zero rows with no predicates is nothing-yet; zero rows because the scope is closed is no-permission; zero rows because nothing answered is error.',
        'The action follows the state. Create appears only where there is genuinely nothing to find, clear appears only where something is being hidden, Retry appears only where a request failed, and the permission state offers no action on the data at all.',
        'The message names the register and the scope, and echoes the query that emptied it, so the user can see which of the controls above the panel is the one to reach for.',
        'It fills the box the rows would have filled. The panel keeps its height, so arriving data does not shift the page under the cursor and a filter that matches nothing does not drag the footer up the screen.',
        'Inside a table it is one row with one full-width cell, and the colspan tracks the columns actually rendered rather than the columns that were designed.',
        'The header row survives a query-driven empty, because the sort and the column choices are still in force and still the way out, and disappears entirely on a register that has never held a record.',
        'The count is written into a status region that was on the page before the filter changed, so the emptiness is spoken as well as drawn.',
        'It does not appear while a request is in flight. The skeleton or the spinner holds the slot until a count is known, because an empty state that flashes for 300ms on every keystroke says "nothing found" and is wrong every time.',
        'At 390px it keeps the same order — well, headline, explanation, action — with the action full-width under the text rather than beside it, and the table header it replaces is hidden rather than scrolled sideways.'
      ],
      a11y: [
        'The headline is a real heading at the level the surrounding panel implies — h3 under an h2 panel title — so it appears in the heading list and somebody jumping by heading lands on the explanation of why the panel is bare.',
        'The icon is decoration and is aria-hidden. The alert-circle in the error state is aria-hidden too: what makes it an error is the sentence, not the glyph, exactly as in an alert.',
        'The announcement is text content arriving inside a role="status" that already existed, never an aria-label and never a region that arrives with its message in it. A region that was not there before the filter ran has nothing to report.',
        'The results region is not itself a live region. Making the tbody aria-live reads every row of every re-render aloud, and role="alert" on the empty state interrupts the user mid-keystroke in the search box that triggered it.',
        'Inside a table the empty state is a <td colspan> in a real <tr>, so table navigation reaches it. A div after the table is outside the table for anyone reading it as a grid.',
        'The action is a real <button> or <a> with a name that says what it does — "Clear the search", "Log a goods receipt", "Retry" — reachable by Tab and carrying focus-visible:outline-3, never a clickable div.',
        'The error state says what failed and whether anything was changed in words. Colour on the glyph is not a message and is not available to everyone reading the screen.',
        'The permission state names the scope and the person who grants access, and offers no control the account cannot use. A disabled create button is a dead Tab stop that explains nothing.',
        'Where the empty state replaces the rows, focus is not moved into it. Somebody who has just typed into the search box is still typing, and pulling focus out of the field loses the keystroke.'
      ],
      related: ['data-table', 'skeleton', 'error-page'],
      variants: [
        { id: 'nothing-yet', name: 'Nothing created yet', code:
`<!-- The genuinely new register: no rows, and no query hiding any. This is the
     only one of the four that offers to create something, and it offers it as
     the one filled button on the panel.

     No "Clear filters" here. With no predicates set the control does nothing
     when it is pressed, and a control that does nothing reads as a broken page
     rather than an empty one.

     The second line is doing real work on a first run — it says what will land
     in this panel and what will not, which is the only teaching moment the
     screen gets. Draft orders not counting is the kind of thing a user
     otherwise discovers by raising one and watching nothing appear.

     The well is graphite, as it is in all four states. Nothing in this
     component takes a tint. -->
<div data-kui="empty-state/nothing-yet" class="rounded-xl border border-zinc-300 bg-white">
  <div class="border-b border-zinc-200 px-4 py-3">
    <h2 class="text-[14px]/5 font-semibold">Purchase orders</h2>
  </div>

  <div class="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
    <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="clipboard-list" class="size-5 text-zinc-600"></i>
    </span>
    <h3 class="mt-3 text-[16px]/6 font-semibold">No purchase orders yet</h3>
    <p class="mt-1 max-w-sm text-[13px]/5 text-zinc-600">
      Orders raised against the Silvassa cost centres — Fabrication, Compounding, Dispatch, Maintenance and Tooling — appear here as soon as they are approved. Drafts stay in your own list until then.
    </p>
    <button type="button"
            class="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
      <i data-lucide="plus" class="size-4"></i>New purchase order
    </button>
  </div>
</div>` },

        { id: 'no-results', name: 'No search results', code:
`<!-- One predicate: the string somebody typed. The empty state echoes it back,
     because with a search box, a column menu and a date range above the panel
     the user cannot otherwise tell which of the three is holding the rows.

     There is no create button on this panel and there must never be one. The
     rows exist; the search is hiding them. A buyer who mistypes a PO number,
     is told no purchase orders were found and takes the New order offer has
     raised the same order twice, and the duplicate surfaces at three-way match
     a fortnight later. The mechanical test belongs in the view: unfiltered
     count greater than zero means this state, and this state has no create.

     Say what the search covers. "No results" leaves somebody retyping the same
     string; naming the three fields it searches is what makes the second
     attempt land.

     The status line above the table is the announcement, and it is on the panel
     rather than inside the empty block so it is in the document before the
     first keystroke. Clearing the search puts the rows back and the same region
     reports the new count. -->
<div data-kui="empty-state/no-results" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       q: 'PO-24-9910',
       rows: [
         { po: 'PO-24-1187', vendor: 'Sharma Extrusions', item: 'HDPE granules' },
         { po: 'PO-24-1194', vendor: 'Gujarat Polymers Ltd', item: 'Masterbatch, blue' },
         { po: 'PO-24-1203', vendor: 'Nashik Steel Traders', item: 'MS angle 50x50' }
       ],
       get shown() {
         const q = this.q.trim().toLowerCase();
         return this.rows.filter(r => !q || (r.po + ' ' + r.vendor + ' ' + r.item).toLowerCase().includes(q));
       }
     }">

  <div class="flex flex-wrap items-center gap-3 border-b border-zinc-200 px-4 py-3">
    <div class="flex min-w-48 flex-1 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
      <input type="search" x-model="q" aria-label="Search the order register"
             placeholder="Search PO, vendor or material"
             class="w-full bg-transparent px-2 py-1.5 text-[13px]/5 outline-none placeholder:text-zinc-500">
    </div>
    <p role="status" class="text-[12px]/4 text-zinc-500 tabular-nums"
       x-text="shown.length ? shown.length + ' of ' + rows.length + ' orders' : 'No orders match this search'"></p>
  </div>

  <ul x-show="shown.length" x-cloak class="divide-y divide-zinc-100 text-[13px]/5">
    <template x-for="r in shown" :key="r.po">
      <li class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-4 py-2.5">
        <span class="font-medium tabular-nums" x-text="r.po"></span>
        <span class="text-zinc-600" x-text="r.vendor + ' · ' + r.item"></span>
      </li>
    </template>
  </ul>

  <div x-show="!shown.length" class="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
    <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="search-x" class="size-5 text-zinc-600"></i>
    </span>
    <h3 class="mt-3 text-[16px]/6 font-semibold">No orders match this search</h3>
    <p class="mt-1 max-w-sm text-[13px]/5 text-zinc-600">
      Nothing in the register matches <span class="font-medium text-zinc-900" x-text="q"></span>. The search covers the PO number, the vendor and the material description.
    </p>
    <button type="button" @click="q = ''"
            class="mt-4 inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      Clear the search
    </button>
  </div>
</div>` },

        { id: 'filtered', name: 'Behind an active filter set', code:
`<!-- Four predicates instead of one, so echoing the query means rendering the
     chips. Each is removable on its own, because the usual cause is one filter
     out of four and clearing all of them throws away the three that were right.

     The count is the sentence that does the work: 128 receipts are in the
     register and none of them match. That is a different fact from an empty
     register, and it is the fact that stops somebody logging a receipt that has
     already been logged. No create button, for the same reason as no-results.

     Clear-all is the secondary route and it is a link, not a second filled
     button — two graphite buttons side by side make the user choose before they
     have read why they are choosing.

     The role="status" sits on the toolbar, above the swap. It was in the
     document before any chip was touched, so writing the new count into it is a
     change a screen reader reports. Put it inside the empty block instead and
     it arrives with its message already in it, which is not a change and is
     announced to nobody. -->
<div data-kui="empty-state/filtered" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       filters: ['Gujarat Polymers Ltd', 'Gate 2', 'Rejected at QC', '01–12 Aug'],
       total: 128
     }">

  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200 px-4 py-3">
    <h2 class="text-[14px]/5 font-semibold">Goods receipts</h2>
    <p role="status" class="text-[12px]/4 text-zinc-500 tabular-nums"
       x-text="filters.length ? '0 of ' + total + ' receipts match these filters' : total + ' receipts'"></p>
  </div>

  <div x-show="filters.length" class="flex flex-wrap items-center gap-2 border-b border-zinc-100 bg-zinc-100 px-4 py-2">
    <template x-for="f in filters" :key="f">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-1 pl-2.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span x-text="f"></span>
        <button type="button" @click="filters = filters.filter(x => x !== f)" :aria-label="'Remove the filter ' + f"
                class="flex size-4 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-300 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-3"></i>
        </button>
      </span>
    </template>
  </div>

  <div x-show="filters.length" class="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
    <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="filter-x" class="size-5 text-zinc-600"></i>
    </span>
    <h3 class="mt-3 text-[16px]/6 font-semibold">No receipts match these filters</h3>
    <p class="mt-1 max-w-sm text-[13px]/5 text-zinc-600">
      There are <span class="font-medium text-zinc-900 tabular-nums" x-text="total"></span> receipts in the register. All four filters above are in force — drop one and the list widens.
    </p>
    <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
      <button type="button" @click="filters = filters.slice(0, filters.length - 1)"
              class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Drop the date range
      </button>
      <button type="button" @click="filters = []"
              class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Clear all filters
      </button>
    </div>
  </div>

  <div x-show="!filters.length" x-cloak class="flex min-h-64 items-center justify-center px-6 py-12 text-center">
    <p class="text-[13px]/5 text-zinc-600 tabular-nums">All 128 receipts would render here.</p>
  </div>
</div>` },

        { id: 'error', name: 'The load failed', code:
`<!-- Not an empty state in disguise. "No goods receipts found" after a
     thirty-second timeout tells somebody their receipts are gone, and the
     conscientious ones go and enter them again.

     Three things belong in the copy and only the first is usually written.
     What failed, in words. Whether anything was changed, which is the question
     anybody who has just pressed Save is actually asking. And a reference that
     support can search for, because "it broke" and a timestamp is not a ticket.

     The well is graphite here as everywhere else — bg-zinc-200 with a zinc-300
     ring — and the tone is the glyph alone at text-red-600. A red field behind
     the text shouts louder than the overdue rows it is failing to show, and it
     makes a transient network fault look like data loss.

     Retry is a real button and it resolves. Pressing it hands the slot to a
     spinner at the height the panel already had, and the spinner hands it back
     to the rows. A retry that leaves the ring turning is the failure mode this
     variant exists to close: at forty seconds a turning ring is
     indistinguishable from a hung page, and the only move left is a reload,
     which on a form means posting it twice. -->
<div data-kui="empty-state/error" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       state: 'failed',
       retry() { this.state = 'busy'; setTimeout(() => this.state = 'ok', 1400) }
     }"
     :aria-busy="state === 'busy'">

  <div class="border-b border-zinc-200 px-4 py-3">
    <h2 class="text-[14px]/5 font-semibold">Goods receipts</h2>
  </div>

  <div x-show="state === 'failed'" class="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
    <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="alert-circle" class="size-5 text-red-600"></i>
    </span>
    <h3 class="mt-3 text-[16px]/6 font-semibold">The receipt register did not load</h3>
    <p class="mt-1 max-w-sm text-[13px]/5 text-zinc-600">
      The request timed out after 30 seconds. Nothing was changed and no receipt was lost — this is the list failing to read, not the records failing to exist.
    </p>
    <p class="mt-1 text-[12px]/4 text-zinc-500 tabular-nums">Reference 8f21c4 · 21 Aug 2026, 11:04</p>
    <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
      <button type="button" @click="retry()"
              class="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30">
        <i data-lucide="rotate-cw" class="size-4"></i>Retry
      </button>
      <a href="mailto:it@konspec.com?subject=Receipt%20register%208f21c4"
         class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Report this
      </a>
    </div>
  </div>

  <div x-show="state === 'busy'" x-cloak class="flex min-h-64 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
    <span class="size-8 shrink-0 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    <p class="text-[13px]/5 text-zinc-600">Loading the receipt register</p>
  </div>

  <div x-show="state === 'ok'" x-cloak class="min-h-64">
    <ul class="divide-y divide-zinc-100 text-[13px]/5">
      <li class="flex flex-wrap items-baseline justify-between gap-x-4 px-4 py-2.5">
        <span class="font-medium tabular-nums">GRN-26-0442</span><span class="text-zinc-600">Sharma Extrusions · 12,000 kg</span>
      </li>
      <li class="flex flex-wrap items-baseline justify-between gap-x-4 px-4 py-2.5">
        <span class="font-medium tabular-nums">GRN-26-0443</span><span class="text-zinc-600">Nashik Steel Traders · 640 kg</span>
      </li>
    </ul>
  </div>

  <p role="status" class="sr-only"
     x-text="state === 'busy' ? 'Retrying the receipt register' : state === 'ok' ? 'Receipt register loaded, 2 receipts' : ''"></p>
</div>` },

        { id: 'permission', name: 'Nothing you may see', code:
`<!-- The state most often mislabelled, because the query really does return
     zero rows once the row-level filter has run, and "No orders yet" is what
     falls out of a template that only counts. It is a lie that costs a ticket:
     the user raises an order to fill the emptiness, cannot see that one either,
     and concludes the save failed.

     Three things make it usable. Which scope is closed — cost centres by name,
     not "this data". What the account can see instead, so the sentence ends
     somewhere useful. And who grants access, as a person and a role: "your
     administrator" is not somewhere anybody can walk to.

     No create button, and not a disabled one either. A disabled control is a
     dead Tab stop that explains nothing; the explanation is the paragraph. The
     only action here is a route to the person who can change the answer, and it
     is a link because it leaves the application. -->
<div data-kui="empty-state/permission" class="rounded-xl border border-zinc-300 bg-white">
  <div class="border-b border-zinc-200 px-4 py-3">
    <h2 class="text-[14px]/5 font-semibold">Purchase orders · Fabrication</h2>
  </div>

  <div class="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
    <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="lock" class="size-5 text-zinc-600"></i>
    </span>
    <h3 class="mt-3 text-[16px]/6 font-semibold">You cannot see orders for Fabrication</h3>
    <p class="mt-1 max-w-sm text-[13px]/5 text-zinc-600">
      There are orders in this register. Your account reads the Moulding and Dispatch cost centres only, so none of them are shown here and no count is given.
    </p>
    <p class="mt-2 max-w-sm text-[13px]/5 text-zinc-600">
      Access to Fabrication is granted by Nilesh Patil, Head of Procurement.
    </p>
    <div class="mt-4 flex flex-wrap items-center justify-center gap-3">
      <a href="mailto:nilesh.patil@konspec.com?subject=Access%20to%20Fabrication%20orders"
         class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="mail" class="size-4 text-zinc-600"></i>Request access
      </a>
      <a href="#" class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Go to Moulding
      </a>
    </div>
    <p class="mt-6 text-[11px]/4 text-zinc-500">Signed in as akshay.prabhu@konspec.com</p>
  </div>
</div>` },

        { id: 'in-table', name: 'Inside the table body', code:
`<!-- One <tr> with one full-width <td colspan>, inside the <tbody>. Not a div
     after the </table>: a sibling div is outside the table in the
     accessibility tree, so somebody reading with table navigation walks a table
     of zero rows and is never told why. As a cell it is a row, and it is read
     in place.

     The colspan is bound, not typed. Hide the Received column from the menu and
     a hardcoded colspan="4" stretches the cell one column past the header, so
     the panel edge lands in the middle of the sentence. It is bound to the
     count of columns actually rendered and cannot drift from them.

     The header row stays, because the emptiness here is a query result: the
     sort and the column choices are still in force and the header is where the
     user goes to undo them. On a register that has never held a record the
     whole table goes instead — a row of column names describing nothing is the
     empty table that reads as a bug.

     Below md the header is hidden rather than scrolled. Four columns do not fit
     at 390px, and with the thead gone the table is one row of one cell, which
     does. Restacking, not sideways scroll.

     Padding, not a margin: py-12 on the cell keeps the panel at the height it
     had with rows in it, and cannot collapse against a sibling. -->
<div data-kui="empty-state/in-table" class="overflow-hidden rounded-xl border border-zinc-300 bg-white"
     x-data="{ cols: { received: true, status: true },
               get span() { return 2 + (this.cols.received ? 1 : 0) + (this.cols.status ? 1 : 0) } }">

  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200 px-4 py-3">
    <h2 class="text-[14px]/5 font-semibold">Goods receipts</h2>
    <div class="ml-auto flex flex-wrap items-center gap-3 text-[12px]/4">
      <label class="flex items-center gap-2">
        <input type="checkbox" x-model="cols.received" class="size-4 shrink-0 accent-zinc-700">Received
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" x-model="cols.status" class="size-4 shrink-0 accent-zinc-700">Status
      </label>
    </div>
  </div>

  <table class="w-full text-[13px]/5">
    <thead class="hidden md:table-header-group">
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">GRN number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th x-show="cols.received" scope="col" class="px-4 py-2.5 text-right font-medium">Received</th>
        <th x-show="cols.status" scope="col" class="px-4 py-2.5 font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td :colspan="span" class="px-6 py-12 text-center">
          <span class="mx-auto flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
            <i data-lucide="search-x" class="size-5 text-zinc-600"></i>
          </span>
          <h3 class="mt-3 text-[16px]/6 font-semibold">No receipts in this date range</h3>
          <p class="mx-auto mt-1 max-w-sm text-[13px]/5 text-zinc-600">
            Nothing was received at Silvassa between 01 and 12 Aug. The last receipt before that window was GRN-26-0431 on 28 Jul.
          </p>
          <button type="button"
                  class="mt-4 inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            Widen to the last 90 days
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>` },

        { id: 'compact', name: 'In a small panel', code:
`<!-- A size-10 well, a 16px headline, two lines of explanation and a 36px
     button is roughly 200px of content, which is more than a dashboard tile
     has. Compact drops the well to size-8, the headline to 13px, the
     explanation to one line and the action to a link, and the whole thing sits
     in about 110px.

     What it does not drop is the distinction between the states. The first tile
     has nothing yet and offers the create route; the second has rows that a
     filter is hiding and offers to clear it; the third failed and offers Retry.
     Shrinking the box is not a reason to collapse four messages into "No data".

     No min-height here. A tile sized to a fixed grid row already has its height
     from the grid, and adding one on top of it is how a dashboard ends up with
     one tile taller than the three beside it. -->
<div data-kui="empty-state/compact" class="grid gap-4 sm:grid-cols-3">

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <h3 class="text-[13px]/5 font-medium">Pending QC</h3>
    <div class="mt-3 flex flex-col items-center py-4 text-center">
      <span class="flex size-8 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="flask-conical" class="size-4 text-zinc-600"></i>
      </span>
      <p class="mt-2 text-[13px]/5 font-medium">Nothing awaiting QC</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-500">Batches land here when the gate posts a receipt.</p>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <h3 class="text-[13px]/5 font-medium">Overdue orders</h3>
    <div class="mt-3 flex flex-col items-center py-4 text-center">
      <span class="flex size-8 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="filter-x" class="size-4 text-zinc-600"></i>
      </span>
      <p class="mt-2 text-[13px]/5 font-medium">None for Dispatch</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-500">Seven overdue across the other cost centres.</p>
      <button type="button"
              class="mt-2 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Show all cost centres
      </button>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <h3 class="text-[13px]/5 font-medium">Committed value</h3>
    <div class="mt-3 flex flex-col items-center py-4 text-center">
      <span class="flex size-8 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="alert-circle" class="size-4 text-red-600"></i>
      </span>
      <p class="mt-2 text-[13px]/5 font-medium">This tile did not load</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-500">The figure is unavailable, not zero.</p>
      <button type="button"
              class="mt-2 inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="rotate-cw" class="size-3.5 text-zinc-600"></i>Retry
      </button>
    </div>
  </div>
</div>` },

        { id: 'inline-create', name: 'Empty list with an inline add', code:
`<!-- The lines of a draft order, before anybody has added one. The affordance
     sits where the first line will land, so when the row arrives the eye does
     not have to move and the button steps down to the next empty position
     rather than disappearing.

     It is a real <button> that happens to be drawn as a dashed row, not a
     dashed div with a click handler. Full width, control height, and it takes
     the focus outline every other button here takes — a dashed rectangle with
     no tab stop in it is a control nobody can reach.

     A dashed border, not a solid one, and this is the one place in the system
     that earns it: the outline is a slot waiting to be filled rather than an
     object, and a solid bordered row at the foot of a list reads as a record
     that is already there.

     One sentence above it, no icon well. The panel title says what the list is
     and the button says what to do, so a glyph between them is a third thing
     saying nothing. Once there are lines the sentence goes and the button
     stays. -->
<div data-kui="empty-state/inline-create" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{ lines: [] }">

  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-zinc-200 px-4 py-3">
    <h2 class="text-[14px]/5 font-semibold">Order lines</h2>
    <p role="status" class="text-[12px]/4 text-zinc-500 tabular-nums"
       x-text="lines.length ? lines.length + ' lines' : 'No lines on this order yet'"></p>
  </div>

  <ul x-show="lines.length" x-cloak role="list" class="divide-y divide-zinc-100 text-[13px]/5">
    <template x-for="l in lines" :key="l.no">
      <li class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-4 py-2.5">
        <span class="tabular-nums"><span class="font-medium" x-text="'Line ' + l.no"></span> · <span x-text="l.item"></span></span>
        <span class="text-zinc-600 tabular-nums" x-text="l.qty"></span>
      </li>
    </template>
  </ul>

  <div class="p-4">
    <p x-show="!lines.length" class="mb-3 text-center text-[13px]/5 text-zinc-600">
      An order needs at least one line before it can be sent to the vendor. Rates come from the Sharma Extrusions contract dated 04 Apr 2026.
    </p>
    <button type="button"
            @click="lines.push({ no: (lines.length + 1) * 10, item: 'HDPE granules, natural', qty: '2,000 kg' })"
            class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-[13px]/5 font-medium text-zinc-600 hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="plus" class="size-4"></i>Add the first line
    </button>
  </div>
</div>` },

        { id: 'register', name: 'The GRN register, nothing today', code:
`<!-- Assembled: the Silvassa gate at 11:04 on a day nothing has arrived. Three
     receipts were logged yesterday, so this is not a new register and it is not
     a filter hiding anything either — it is a scope with nothing in it, and
     that is a fifth shading of nothing-yet with its own two answers. Widen the
     scope, or log the receipt that is standing at the gate.

     Both answers are on the panel and only one of them is filled. Log a goods
     receipt is the create action and it is safe here in a way it never is under
     a filtered register: the scope is a day, the count for that day is zero,
     and nothing is being hidden that a second receipt could duplicate.

     The status region is the sentence beside the title. It was rendered with
     the panel, before any scope button was pressed, so writing the new count
     into it is a change and gets read out. The scope buttons are the segmented
     control from the button-group entry, copied rather than reinvented: a real
     radiogroup with one Tab stop, a roving tabindex and aria-checked, so which
     day is showing is announced and not only tinted.

     The empty state replaces the table rather than sitting inside it, because
     the emptiness is the scope and not a query — there is no sort and no column
     choice to preserve, so a header row over it would be four column names
     describing a day on which nothing happened.

     The footer keeps its place and says "No receipts to show" rather than
     disappearing, so the panel holds its height and the pager does not jump up
     under the cursor when the scope changes. Below md the rows are cards; at
     390px nothing here scrolls sideways. -->
<div data-kui="empty-state/register" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       scope: 'today',
       all: {
         today: [],
         yesterday: [
           { grn: 'GRN-26-0442', vendor: 'Sharma Extrusions', qty: '12,000 kg', status: 'Closed' },
           { grn: 'GRN-26-0443', vendor: 'Nashik Steel Traders', qty: '640 kg', status: 'Open' },
           { grn: 'GRN-26-0444', vendor: 'Gujarat Polymers Ltd', qty: '3,200 kg', status: 'Approved' }
         ]
       },
       dot: { Open: 'bg-zinc-500', Approved: 'bg-amber-500', Overdue: 'bg-red-600', Closed: 'bg-emerald-600', Draft: 'bg-zinc-400' },
       get rows() { return this.all[this.scope] },
       get label() { return this.scope === 'today' ? '21 Aug' : '20 Aug' }
     }">

  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200 px-4 py-3">
    <div class="min-w-0">
      <h2 class="text-[14px]/5 font-semibold">Goods receipts · Silvassa</h2>
      <p role="status" class="mt-0.5 text-[12px]/4 text-zinc-500 tabular-nums"
         x-text="rows.length ? rows.length + ' receipts on ' + label : 'No goods receipts on ' + label"></p>
    </div>
    <div role="radiogroup" aria-label="Date scope" x-ref="grp"
         @keydown.arrow-right.prevent="scope = scope === 'today' ? 'yesterday' : 'today'; $nextTick(() => $refs.grp.querySelector('[aria-checked=true]').focus())"
         @keydown.arrow-left.prevent="scope = scope === 'today' ? 'yesterday' : 'today'; $nextTick(() => $refs.grp.querySelector('[aria-checked=true]').focus())"
         class="ml-auto inline-flex rounded-lg bg-zinc-200 p-0.5">
      <button type="button" role="radio" @click="scope = 'today'"
              :aria-checked="scope === 'today'" :tabindex="scope === 'today' ? 0 : -1"
              class="inline-flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="scope === 'today' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">Today</button>
      <button type="button" role="radio" @click="scope = 'yesterday'"
              :aria-checked="scope === 'yesterday'" :tabindex="scope === 'yesterday' ? 0 : -1"
              class="inline-flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="scope === 'yesterday' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">Yesterday</button>
    </div>
  </div>

  <table x-show="rows.length" x-cloak class="hidden w-full text-[13px]/5 md:table">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">GRN number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Received</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in rows" :key="r.grn">
        <tr class="border-b border-zinc-100 last:border-0">
          <td class="px-4 py-2.5 font-medium tabular-nums" x-text="r.grn"></td>
          <td class="px-4 py-2.5" x-text="r.vendor"></td>
          <td class="px-4 py-2.5 text-right tabular-nums" x-text="r.qty"></td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 shrink-0 rounded-full" :class="dot[r.status]" aria-hidden="true"></span><span x-text="r.status"></span>
            </span>
          </td>
        </tr>
      </template>
    </tbody>
  </table>

  <ul x-show="rows.length" x-cloak role="list" class="divide-y divide-zinc-100 md:hidden">
    <template x-for="r in rows" :key="r.grn">
      <li class="px-4 py-3">
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-[14px]/5 font-medium tabular-nums" x-text="r.grn"></span>
          <span class="text-[14px]/5 tabular-nums" x-text="r.qty"></span>
        </div>
        <p class="mt-0.5 text-[13px]/5 text-zinc-600" x-text="r.vendor"></p>
        <span class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 shrink-0 rounded-full" :class="dot[r.status]" aria-hidden="true"></span><span x-text="r.status"></span>
        </span>
      </li>
    </template>
  </ul>

  <div x-show="!rows.length" class="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
    <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="inbox" class="size-5 text-zinc-600"></i>
    </span>
    <h3 class="mt-3 text-[16px]/6 font-semibold">No goods receipts on 21 Aug</h3>
    <p class="mt-1 max-w-sm text-[13px]/5 text-zinc-600">
      Nothing has come through the Silvassa gate today. Three receipts were logged yesterday, the last of them at 17:40.
    </p>
    <div class="mt-4 flex w-full max-w-xs flex-col items-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">
      <button type="button"
              class="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/30 sm:w-auto">
        <i data-lucide="truck" class="size-4"></i>Log a goods receipt
      </button>
      <button type="button" @click="scope = 'yesterday'"
              class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Show yesterday instead
      </button>
    </div>
  </div>

  <div class="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 px-4 py-2.5">
    <p class="text-[12px]/4 text-zinc-500 tabular-nums"
       x-text="rows.length ? '1–' + rows.length + ' of ' + rows.length + ' receipts' : 'No receipts to show'"></p>
    <p class="text-[12px]/4 text-zinc-500 tabular-nums">Gate closes 18:00</p>
  </div>
</div>` }
      ]
  },

  {
      id: 'skeleton', name: 'Skeleton', category: 'data',
      description: 'Grey blocks standing in the exact box the content will occupy — same rows, same leading, same column widths — so the first paint of a screen whose layout is already known lands without moving.',
      when: 'The first paint of a region whose shape you already know: a register you have rendered a thousand times, a record card, a dashboard strip, the panel behind a deferred fetch. The line against a spinner is not how long the wait is, it is whether you can draw the answer. A skeleton is a promise about the layout, so it is only honest where the layout is fixed before the data arrives; a filter that may return four rows or four thousand has no shape to promise and gets the spinner. The other half of the line is what is already on screen: a skeleton is for a region that is empty, never for a refresh of rows somebody is reading — replacing filled rows with grey bars deletes data mid-read and looks like the record was wiped. That case is the spinner\'s scrim over content that stays. And if you know the total rather than the shape, neither of them is right and progress is.',
      notes: [
        'The skeleton occupies the box the content will occupy. Same number of rows, same leading, same column widths, same paddings, same border on the same wrapper. That is the whole component and everything else here is in service of it: a skeleton that reflows when the data lands is worse than a spinner, because a spinner never promised a layout and this one promised the wrong one. The test is to toggle between the two states with the panel under the cursor and watch whether anything below it moves.',
        'Every bar sits inside a box the height of the line it stands in for, and the bar is centred in it — flex h-5 items-center round an h-2.5 bar for text-[13px]/5, h-6 round h-2.5 for prose at /6, h-4 round h-2 for a 12px caption, h-7 round h-4 for a 24px figure. Stack bare bars with space-y-2 instead and a four-line paragraph measures 72px of skeleton against 96px of text, so the card grows by a line and a half on arrival. This is the marker\'s dot doing the same job for the same reason: the box is derived from the leading, the leading is already written in the class name beside it, and the two cannot drift. A margin tuned by eye is correct for exactly one type size.',
        'The row count is the page size, not a guess. A register that asked for 25 rows draws 25. Where the count genuinely cannot be known — a permission-filtered list, a variable set of exceptions — guess low rather than high: growth pushes down only what is below the panel, while shrinkage pulls the whole page up under a cursor that has already started moving towards something.',
        'Draw for real everything the page already knows. Table headers, tile labels, the section titles, the record number and vendor name that came from the row somebody clicked to get here. None of that is waiting on the query, and greying it out makes the page flash its own headings away and land them again. It also costs the only thing a skeleton is good for over a spinner: with the column headers and the tile labels drawn, somebody can decide where to look before the figures arrive.',
        'Blocks are bg-zinc-200 and carry no ring. zinc-100 is a surface — the page, a selected row, an open menu trigger — so a zinc-100 bar on a white card is one step from invisible and on the page behind it is the identical colour. The ring that every other tinted shape takes is deliberately absent here: a ring draws an edge, and a skeleton bar is ink standing in for text, not a shape you are meant to read the outline of. Twelve ringed bars in a column read as twelve empty input boxes.',
        'The radius of a block is the radius of the thing it replaces. rounded for a line of text, rounded-lg for a control or a button, rounded-full for an avatar or a status pill, and the pill block is h-5 because the real pill is py-0.5 on text-[12px]/4. Give a text bar rounded-full and a paragraph reads as a stack of lozenges, which is a row of badges, which is a different component.',
        'animate-pulse goes on the smallest wrapper that contains nothing but blocks, and it always carries motion-reduce:animate-none. One wrapper over the whole group is what keeps the bars in phase, and the phase problem is real for anything a template inserts a row at a time — forty blocks that started their animations at forty different moments fade against each other and the panel reads as static rather than as a wait. Where real text is interleaved with the blocks, as it is in a form of drawn labels, the classes move down onto each block instead: they all begin in the same paint so they stay in step, and a label that is not loading has no business pulsing. The reduced-motion suppression is where this parts company with the spinner, which must never take it — a stopped ring is a broken ring and the only signal is gone, whereas a stopped skeleton is still an accurate picture of the layout that is coming, and it is a much larger area of the screen moving, which is the motion the preference exists for.',
        'The last line of a paragraph is short, because real paragraphs end mid-line. Three bars at w-full and a fourth at about w-2/5 reads as text; four bars at w-full reads as a table. The widths are written into the markup and never generated — a width randomised per render changes between two paints of the same wait, and Alpine re-evaluating an expression is enough to make the block jump while it is standing still.',
        'A skeleton is a first paint. It belongs in the markup the server sent, or in the region a deferred fetch is about to replace, and it needs no delay floor because it is already the first frame — the reason the panel was deferred is that the query is slow. Reaching for one on a refresh is the mistake: rows that are already rendered get the spinner\'s bg-white/70 scrim over them with the stale figures still legible underneath, and the panel keeps its height through the whole cycle.',
        'Nothing in a skeleton is real, and least of all a control. Never draw a bordered empty input while the values are still coming — it is indistinguishable from a form that is ready, so somebody types into it and the swap eats what they typed. The field is a grey block until the response lands, or the real input is present carrying disabled and the value arrives inside it. The same goes for buttons and links: a block, not a <button>, because a Tab landing on a grey rectangle is a dead end.',
        'Do not draw data-shaped nonsense. A chart skeleton is one flat block at the canvas\'s exact height, never a set of plausible bars — anything shaped like a chart gets read as a chart, and somebody takes a trend off a shape that came out of the markup. Same for a sparkline and a donut. The legend above it is real, because in this system the legend is written in the HTML and is the palette the canvas paints from, so it was never waiting on anything.',
        'aria-busy="true" goes on the container that will hold the real content and survives the swap; aria-hidden="true" goes on the pulse wrapper, so one attribute hides every block inside it; and one sr-only role="status" naming the work sits outside that wrapper, or it is hidden along with the bars and the wait is announced to nobody. Where real labels sit among the blocks the aria-hidden moves down onto the blocks alongside the animation, because hiding the wrapper there would take out the labels too, and those are the only part of the region worth reading while it waits. The container is what is busy, the blocks are what got drawn, and the status is what is said — three jobs, and collapsing any two of them loses one of the three.'
      ],
      anatomy: [
        ['Container', 'The wrapper the loaded content will use — same rounded-xl, same border, same padding — carrying aria-busy="true" while it waits. It is the element the swap replaces the inside of, so the border never appears or disappears on arrival.'],
        ['Pulse wrapper', 'One div carrying animate-pulse motion-reduce:animate-none and aria-hidden="true". Every block is inside it, so they fade in phase and one attribute hides the lot. Where drawn labels are interleaved with the blocks there is no such wrapper and both classes go on each block.'],
        ['Line box', 'flex h-5 items-center — a box exactly one line of the real text tall, holding the bar centred. h-4 for text-[12px]/4, h-5 for text-[13px]/5, h-6 for prose at /6 and for a 16px title, h-7 for a 24px figure.'],
        ['Bar', 'The block itself: h-2.5 w-full rounded bg-zinc-200 for a line of text, h-2 for a caption or an 11px label, h-4 for a display figure. No ring, and the radius is the radius of what it stands in for.'],
        ['Shape block', 'A block standing in for something that is not text — size-8 rounded-full for an avatar, h-5 w-16 rounded-full for a status pill, h-9 rounded-lg for an input or a button, h-64 rounded-lg for a chart canvas.'],
        ['Repeated unit', 'The row, the tile or the list item, written out as many times as the answer will have. Inside a real <table> where the loaded content is a table, so the same layout algorithm sets the same column widths.'],
        ['Known content', 'The parts drawn for real through the wait — table headers, tile labels, the record number, the page title. Not part of the skeleton and not inside the pulse wrapper.'],
        ['Status line', 'One sr-only role="status" saying what is loading, outside the aria-hidden wrapper and in the document before the swap, so the arrival can be announced in the same region.']
      ],
      behaviour: [
        'It holds the box the content will take. The swap changes the ink and nothing else — no row moves, no card resizes, and the scroll position under the panel is still pointing at the same place.',
        'It is replaced by content, never cross-faded into it. A fade makes the arrival harder to notice, not easier, and for the length of the fade the screen is showing data and grey bars at the same opacity.',
        'It pulses in phase from one wrapper, and stops pulsing under prefers-reduced-motion — where it is still a correct picture of what is coming, which is why it may stop and a spinner may not.',
        'What the page already knows stays drawn the whole time: headers, labels, the record number. Only what the query returns is grey.',
        'It is the first frame of an empty region. Content already on screen is covered by a scrim instead, so nobody loses a row they were reading to a wall of grey.',
        'It restacks exactly where the loaded layout restacks. If the table becomes cards below md, the skeleton becomes card-shaped skeletons at the same breakpoint, or the phone gets a promise the tablet keeps.',
        'It resolves. Content replaces it, or the error variant of empty-state replaces it at the same height. Bars still pulsing at forty seconds are indistinguishable from a hung page.',
        'Nothing in it answers a pointer or a key. There is no hover, no focus, no control and no link — the region is inert in fact, not only in appearance.'
      ],
      a11y: [
        'aria-busy="true" sits on the container that is waiting, not on a block. The container is the region whose content is in flight; the bars are only what got drawn in the meantime.',
        'The pulse wrapper takes aria-hidden="true", which hides every block under it with one attribute. Read out, a skeleton is a wall of empty groups with nothing in them, and the count is the only thing it would communicate.',
        'One sr-only role="status" names the work — "Loading the order register", not "Loading" — and it lives outside the aria-hidden wrapper, or it is hidden with the bars and the wait is announced to nobody.',
        'That status region is in the document before the swap and survives it, exactly as the spinner\'s is: a live region that arrives with its message already inside it never changed, so nothing is said. Swap the rows under it, not the panel around it, and the same region can announce the arrival.',
        'Nothing in the skeleton is focusable. No tabindex, no <button>, no <a> — Tab during the wait runs past the region to the next real control instead of stopping on a grey rectangle with no name.',
        'The real content replaces the skeleton inside the same container, so focus that was outside the region is undisturbed and the page does not scroll itself while somebody is reading.',
        'Where the loaded content is a table, the skeleton is a real table with the real <thead> and its scope="col" headers, so the column structure is announced correctly the moment the cells land and no header is rebuilt by the swap.',
        'The animation carries motion-reduce:animate-none on every element that pulses. A large region breathing at 2s is exactly the motion the preference was written for, and the layout it draws is the signal, not the movement.'
      ],
      related: ['spinner', 'empty-state', 'progress'],
      variants: [
        { id: 'text', name: 'Text lines', code:
`<!-- The claim the whole component rests on, made checkable: toggle it and
     nothing below the card moves. The skeleton is four line boxes at h-6 and
     the paragraph is four lines of text-[14px]/6, so both are 96px, and the
     button under them stays where it is.

     Every bar sits inside a box one line tall rather than being stacked with a
     margin. Four h-2.5 bars in a space-y-2 stack measure 72px against the
     paragraph's 96px — the card would grow by a line and a half on arrival.
     h-6 is the leading already written in text-[14px]/6, so the two cannot
     drift apart; a margin picked by eye is right for one type size only.

     The last bar is short. Real paragraphs end mid-line, and four bars at
     w-full is a picture of a table rather than of prose. The widths are written
     into the markup and never generated: a width from Math.random changes
     between two paints of the same wait.

     aria-busy on the card, aria-hidden on the pulse wrapper, and the sr-only
     status outside that wrapper — inside it, it would be hidden along with the
     bars and the wait would be announced to nobody. -->
<div data-kui="skeleton/text" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5" x-data="{ loaded: false }" :aria-busy="!loaded">
  <h3 class="text-[13px]/5 font-medium">Vendor note · Sharma Extrusions</h3>

  <div class="mt-3">
    <p role="status" class="sr-only" x-text="loaded ? 'Vendor note loaded' : 'Loading the vendor note'"></p>

    <div x-show="!loaded" class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div class="flex h-6 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
      <div class="flex h-6 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
      <div class="flex h-6 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
      <div class="flex h-6 items-center"><div class="h-2.5 w-2/5 rounded bg-zinc-200"></div></div>
    </div>

    <p x-show="loaded" x-cloak class="text-[14px]/6 text-zinc-600">Rates hold to 31 Mar 2027 and are quoted ex-works Nashik. Freight is billed at actuals against the transporter's receipt and does not carry the contract discount. Any revision needs a signed amendment.</p>
  </div>

  <button type="button" @click="loaded = !loaded"
          class="mt-4 inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="repeat" class="size-3.5 text-zinc-600"></i><span x-text="loaded ? 'Back to loading' : 'Land the note'">Land the note</span>
  </button>
</div>` },

        { id: 'heading', name: 'Heading and body', code:
`<!-- The same block twice at the same size: the skeleton on the left and what
     it becomes on the right. Read down the two columns and every edge lines up,
     because each bar is inside a box the height of the line it stands in for.

     The ladder, and it is the whole of the sizing rule:
       text-[11px]/4 and text-[12px]/4  ->  h-4 box, h-2 bar
       text-[13px]/5                    ->  h-5 box, h-2.5 bar
       text-[14px]/6 and text-[16px]/6  ->  h-6 box, h-2.5 and h-3 bar
       text-[20px]/7 and text-[24px]/7  ->  h-7 box, h-3.5 and h-4 bar
     The gaps between blocks are the real mt-* values, copied across unchanged.
     There is no space-y-* anywhere in a skeleton: the leading is already inside
     the boxes, and adding a gap on top of it is how the two columns stop
     matching.

     Blocks are bg-zinc-200 with no ring. zinc-100 is a surface — the page, a
     selected row, a table header — so a zinc-100 bar on white is one step from
     invisible. The ring every other tinted shape carries is left off on
     purpose: a ring draws an edge, and twelve edged bars in a column read as
     twelve empty inputs rather than as text. -->
<div data-kui="skeleton/heading" class="grid gap-4 sm:grid-cols-2">

  <div class="rounded-xl border border-zinc-300 bg-white p-5" aria-busy="true">
    <p role="status" class="sr-only">Loading the receipt summary</p>
    <div class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div class="flex h-6 items-center"><div class="h-3 w-44 rounded bg-zinc-200"></div></div>
      <div class="mt-1 flex h-4 items-center"><div class="h-2 w-32 rounded bg-zinc-200"></div></div>
      <div class="mt-4">
        <div class="flex h-5 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
        <div class="flex h-5 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
        <div class="flex h-5 items-center"><div class="h-2.5 w-1/2 rounded bg-zinc-200"></div></div>
      </div>
      <div class="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3">
        <div class="h-5 w-20 shrink-0 rounded-full bg-zinc-200"></div>
        <div class="h-2 w-24 rounded bg-zinc-200"></div>
      </div>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-5">
    <h3 class="text-[16px]/6 font-semibold tabular-nums">GRN-26-0442</h3>
    <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">Posted 16 Aug 2026 · Ritu Deshpande</p>
    <p class="mt-4 text-[13px]/5 text-zinc-600">Short receipt of 600 kg against PO-24-1187. Two bags opened at the gate and 48 kg written off to the debit note.</p>
    <div class="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3">
      <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
      </span>
      <span class="text-[12px]/4 tabular-nums text-zinc-500">2 of 3 lines</span>
    </div>
  </div>
</div>` },

        { id: 'table', name: 'Table rows', code:
`<!-- A real table, with the real thead. The header text is not waiting on
     anything — it comes from the column definition — so it is drawn for real,
     and drawing it does two jobs at once: somebody can decide which column they
     are going to read before the figures land, and the browser's own table
     layout sets the column widths from the same markup it will use for the
     loaded rows, so no column moves on arrival.

     Five rows because the register asked for five. The count is the page size,
     not a guess; where it genuinely cannot be known, guess low, since growth
     pushes down only what is below the panel while shrinkage pulls the whole
     page up under a cursor already moving towards something.

     Each cell carries the same px-4 py-2.5 as the loaded cell and a flex h-5
     box round its bar, so a row is 40px here and 40px full — put the bar
     straight into the cell and the row comes back 30px, which is a quarter of
     the table's height missing across five of them.

     The amount bars are ml-auto to sit in the right-aligned column, and the
     status blocks are h-5 rounded-full because the real pill is py-0.5 on
     text-[12px]/4. The radius of a block is the radius of what it replaces.

     Below md the loaded table restacks into cards, so the skeleton restacks at
     the same breakpoint. A skeleton that keeps its columns on a phone is a
     promise the table does not keep. -->
<div data-kui="skeleton/table" class="overflow-hidden rounded-xl border border-zinc-300 bg-white" aria-busy="true">
  <p role="status" class="sr-only">Loading the order register</p>

  <table class="hidden w-full text-[13px]/5 md:table">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Department</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Status</th>
      </tr>
    </thead>
    <tbody class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-36 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-5 w-16 rounded-full bg-zinc-200"></div></div></td>
      </tr>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-44 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-28 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-24 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-5 w-20 rounded-full bg-zinc-200"></div></div></td>
      </tr>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-32 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-16 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-5 w-16 rounded-full bg-zinc-200"></div></div></td>
      </tr>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-40 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-24 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-5 w-14 rounded-full bg-zinc-200"></div></div></td>
      </tr>
      <tr>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-28 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
        <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-5 w-16 rounded-full bg-zinc-200"></div></div></td>
      </tr>
    </tbody>
  </table>

  <ul class="animate-pulse divide-y divide-zinc-100 motion-reduce:animate-none md:hidden" aria-hidden="true">
    <li class="px-4 py-3">
      <div class="flex h-5 items-center justify-between gap-3">
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
      </div>
      <div class="mt-0.5 flex h-5 items-center"><div class="h-2.5 w-44 rounded bg-zinc-200"></div></div>
      <div class="mt-2 flex h-5 items-center gap-2">
        <div class="h-5 w-16 shrink-0 rounded-full bg-zinc-200"></div>
        <div class="h-2 w-20 rounded bg-zinc-200"></div>
      </div>
    </li>
    <li class="px-4 py-3">
      <div class="flex h-5 items-center justify-between gap-3">
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      </div>
      <div class="mt-0.5 flex h-5 items-center"><div class="h-2.5 w-36 rounded bg-zinc-200"></div></div>
      <div class="mt-2 flex h-5 items-center gap-2">
        <div class="h-5 w-20 shrink-0 rounded-full bg-zinc-200"></div>
        <div class="h-2 w-20 rounded bg-zinc-200"></div>
      </div>
    </li>
    <li class="px-4 py-3">
      <div class="flex h-5 items-center justify-between gap-3">
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-16 rounded bg-zinc-200"></div>
      </div>
      <div class="mt-0.5 flex h-5 items-center"><div class="h-2.5 w-40 rounded bg-zinc-200"></div></div>
      <div class="mt-2 flex h-5 items-center gap-2">
        <div class="h-5 w-16 shrink-0 rounded-full bg-zinc-200"></div>
        <div class="h-2 w-20 rounded bg-zinc-200"></div>
      </div>
    </li>
  </ul>
</div>` },

        { id: 'card', name: 'Card', code:
`<!-- The card's own frame is drawn for real and only its contents are grey. The
     border, the radius, the padding and the divider are structure the page
     already has, so wrapping a skeleton in a plainer box and swapping the whole
     card in is how a border appears out of nowhere on arrival.

     The header row is the loaded header exactly: a size-10 rounded-full block
     for the avatar, a 14px name line and a 12px second line beside it. A block
     standing in for something round is round — a rounded-lg square where a
     circle is coming reads as an icon well, which is a different shape doing a
     different job.

     The figure is h-4 in an h-7 box because the real figure is
     text-[24px]/7. The two action blocks are h-9 rounded-lg, the height and
     radius of the buttons that replace them, and they are divs rather than
     disabled buttons: a Tab during the wait should run past the card, not stop
     on a control that cannot do anything yet. -->
<div data-kui="skeleton/card" class="max-w-sm rounded-xl border border-zinc-300 bg-white" aria-busy="true">
  <p role="status" class="sr-only">Loading the vendor summary</p>

  <div class="animate-pulse p-4 motion-reduce:animate-none" aria-hidden="true">
    <div class="flex items-center gap-3">
      <div class="size-10 shrink-0 rounded-full bg-zinc-200"></div>
      <div class="min-w-0 flex-1">
        <div class="flex h-5 items-center"><div class="h-2.5 w-40 rounded bg-zinc-200"></div></div>
        <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-24 rounded bg-zinc-200"></div></div>
      </div>
      <div class="h-5 w-16 shrink-0 rounded-full bg-zinc-200"></div>
    </div>

    <div class="mt-4 border-t border-zinc-100 pt-3">
      <div class="flex h-4 items-center"><div class="h-2 w-28 rounded bg-zinc-200"></div></div>
      <div class="mt-1.5 flex h-7 items-center"><div class="h-4 w-36 rounded bg-zinc-200"></div></div>
    </div>

    <div class="mt-4 space-y-2">
      <div class="flex h-5 items-center justify-between gap-3">
        <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      </div>
      <div class="flex h-5 items-center justify-between gap-3">
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-16 rounded bg-zinc-200"></div>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <div class="h-9 w-28 rounded-lg bg-zinc-200"></div>
      <div class="h-9 w-24 rounded-lg bg-zinc-200"></div>
    </div>
  </div>
</div>` },

        { id: 'stats', name: 'Stat tiles', code:
`<!-- Four tiles in the dashboard's own grid, at the dashboard's own gap, and the
     labels are real text. The labels come from the dashboard definition and not
     from the query, so they were never waiting: greying them makes the strip
     flash its own headings away and land them again half a second later, and it
     takes away the one thing this state is good for, which is that somebody can
     work out which tile they came to read before the figures arrive.

     Each tile is the loaded tile's geometry, mt-* for mt-*: an 11px uppercase
     label, then mt-1.5 and an h-4 bar in an h-7 box for the text-[24px]/7
     figure, then mt-1.5 and an h-2 bar in an h-4 box for the delta line. Tile
     height is identical loaded and loading, which is what stops the whole page
     below the strip stepping down on arrival.

     Figure widths differ across the tiles because the figures do — a count and
     a rupee value are not the same width, and four identical bars read as a
     placeholder graphic rather than as four numbers.

     The delta never gets a colour here. Red and green say what a record is
     doing and no record has said anything yet; an emerald bar in a skeleton is
     a claim that the number went the right way, made before it was read. -->
<div data-kui="skeleton/stats" class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
  <p role="status" class="sr-only">Loading the order summary figures</p>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open orders</p>
    <div class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div class="mt-1.5 flex h-7 items-center"><div class="h-4 w-16 rounded bg-zinc-200"></div></div>
      <div class="mt-1.5 flex h-4 items-center"><div class="h-2 w-32 rounded bg-zinc-200"></div></div>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Open value</p>
    <div class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div class="mt-1.5 flex h-7 items-center"><div class="h-4 w-40 rounded bg-zinc-200"></div></div>
      <div class="mt-1.5 flex h-4 items-center"><div class="h-2 w-32 rounded bg-zinc-200"></div></div>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Overdue</p>
    <div class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div class="mt-1.5 flex h-7 items-center"><div class="h-4 w-36 rounded bg-zinc-200"></div></div>
      <div class="mt-1.5 flex h-4 items-center"><div class="h-2 w-28 rounded bg-zinc-200"></div></div>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white p-4">
    <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Awaiting approval</p>
    <div class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div class="mt-1.5 flex h-7 items-center"><div class="h-4 w-12 rounded bg-zinc-200"></div></div>
      <div class="mt-1.5 flex h-4 items-center"><div class="h-2 w-24 rounded bg-zinc-200"></div></div>
    </div>
  </div>
</div>` },

        { id: 'list', name: 'List with markers', code:
`<!-- The marker column is the thing to get right. Marks are a column of their
     own and the eye reads down them, so a skeleton whose avatars are a
     different size from the real ones moves every line of text sideways when
     the data lands — the one axis nobody thinks to check.

     size-8 rounded-full for the avatar, matching the avatar entry's size-8, and
     shrink-0 so a wide bar beside it cannot compress the circle into an
     ellipse. Where the loaded list opens with a 6px status dot instead, the
     skeleton keeps the dot as a real size-1.5 zinc-300 disc in the same
     flex h-5 items-center box — a dot is too small to be worth a block, and
     drawing it in zinc-300 rather than a status colour says the state is not
     known yet without claiming one.

     Rows are py-3 on a 40px content block, so a row is 64px loading and 64px
     loaded, and five of them is the page size the list asked for. -->
<div data-kui="skeleton/list" class="max-w-md overflow-hidden rounded-xl border border-zinc-300 bg-white" aria-busy="true">
  <div class="border-b border-zinc-200 px-4 py-3">
    <h3 class="text-[14px]/5 font-semibold">Awaiting your approval</h3>
    <p role="status" class="sr-only">Loading the approvals list</p>
  </div>

  <ul class="animate-pulse divide-y divide-zinc-100 motion-reduce:animate-none" aria-hidden="true">
    <li class="flex items-start gap-3 px-4 py-3">
      <div class="size-8 shrink-0 rounded-full bg-zinc-200"></div>
      <div class="min-w-0 flex-1">
        <div class="flex h-5 items-center"><div class="h-2.5 w-32 rounded bg-zinc-200"></div></div>
        <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-44 rounded bg-zinc-200"></div></div>
      </div>
      <div class="flex h-5 shrink-0 items-center"><div class="h-2.5 w-16 rounded bg-zinc-200"></div></div>
    </li>
    <li class="flex items-start gap-3 px-4 py-3">
      <div class="size-8 shrink-0 rounded-full bg-zinc-200"></div>
      <div class="min-w-0 flex-1">
        <div class="flex h-5 items-center"><div class="h-2.5 w-40 rounded bg-zinc-200"></div></div>
        <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-36 rounded bg-zinc-200"></div></div>
      </div>
      <div class="flex h-5 shrink-0 items-center"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div>
    </li>
    <li class="flex items-start gap-3 px-4 py-3">
      <div class="size-8 shrink-0 rounded-full bg-zinc-200"></div>
      <div class="min-w-0 flex-1">
        <div class="flex h-5 items-center"><div class="h-2.5 w-28 rounded bg-zinc-200"></div></div>
        <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-40 rounded bg-zinc-200"></div></div>
      </div>
      <div class="flex h-5 shrink-0 items-center"><div class="h-2.5 w-16 rounded bg-zinc-200"></div></div>
    </li>
  </ul>

  <div class="border-t border-zinc-200 px-4 py-3">
    <h3 class="text-[14px]/5 font-semibold">Exceptions on this receipt</h3>
  </div>

  <ul class="animate-pulse space-y-2 px-4 pb-4 motion-reduce:animate-none" aria-hidden="true">
    <li class="flex items-start gap-2.5">
      <span class="flex h-5 shrink-0 items-center"><span class="size-1.5 rounded-full bg-zinc-300"></span></span>
      <div class="min-w-0 flex-1">
        <div class="flex h-5 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
      </div>
    </li>
    <li class="flex items-start gap-2.5">
      <span class="flex h-5 shrink-0 items-center"><span class="size-1.5 rounded-full bg-zinc-300"></span></span>
      <div class="min-w-0 flex-1">
        <div class="flex h-5 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
        <div class="flex h-5 items-center"><div class="h-2.5 w-1/3 rounded bg-zinc-200"></div></div>
      </div>
    </li>
    <li class="flex items-start gap-2.5">
      <span class="flex h-5 shrink-0 items-center"><span class="size-1.5 rounded-full bg-zinc-300"></span></span>
      <div class="min-w-0 flex-1">
        <div class="flex h-5 items-center"><div class="h-2.5 w-3/4 rounded bg-zinc-200"></div></div>
      </div>
    </li>
  </ul>
</div>` },

        { id: 'form', name: 'Edit form loading its values', code:
`<!-- The only form worth a skeleton is one whose values are still coming. A
     create form has nothing to wait for and should be rendered.

     Every control is a block and not a bordered empty input, because a bordered
     empty input is indistinguishable from a form that is ready. Somebody starts
     typing the vendor code into it, the response lands, and the swap eats what
     they typed with no error and nothing to recover. The alternative, if the
     shell has to be real, is the real input carrying disabled with the value
     arriving inside it — what is not allowed is the appearance of a control
     that is not one yet.

     The labels are drawn for real, and they are real <label> elements rather
     than bars. Field names are not data; greying them leaves a page of
     unlabelled grey slots that cannot be read at all while it loads, and moves
     the label text sideways when it arrives.

     Because the labels are interleaved with the blocks there is no single pulse
     wrapper here — animate-pulse motion-reduce:animate-none and aria-hidden go
     on each block. They all start in the same paint, so they stay in step, and
     a label that is not loading has no business pulsing.

     Control blocks are h-9 rounded-lg, the input entry's height and radius. The
     textarea block is h-24, three rows plus its padding. The footer buttons are
     h-9 rounded-lg blocks in the real footer, on the real border. Nothing here
     is focusable, so a Tab during the wait leaves the form entirely rather than
     stopping on a rectangle with no accessible name. -->
<div data-kui="skeleton/form" class="max-w-2xl rounded-xl border border-zinc-300 bg-white" aria-busy="true">
  <div class="border-b border-zinc-200 px-5 py-4">
    <h2 class="text-[16px]/6 font-semibold">Edit purchase order</h2>
    <p role="status" class="sr-only">Loading the purchase order for editing</p>
  </div>

  <div class="p-5">
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-[13px]/5 font-medium text-zinc-600">Vendor</label>
        <div class="h-9 animate-pulse rounded-lg bg-zinc-200 motion-reduce:animate-none" aria-hidden="true"></div>
      </div>
      <div>
        <label class="mb-1.5 block text-[13px]/5 font-medium text-zinc-600">Plant</label>
        <div class="h-9 animate-pulse rounded-lg bg-zinc-200 motion-reduce:animate-none" aria-hidden="true"></div>
      </div>
      <div>
        <label class="mb-1.5 block text-[13px]/5 font-medium text-zinc-600">Order date</label>
        <div class="h-9 animate-pulse rounded-lg bg-zinc-200 motion-reduce:animate-none" aria-hidden="true"></div>
      </div>
      <div>
        <label class="mb-1.5 block text-[13px]/5 font-medium text-zinc-600">Delivery date</label>
        <div class="h-9 animate-pulse rounded-lg bg-zinc-200 motion-reduce:animate-none" aria-hidden="true"></div>
      </div>
      <div class="sm:col-span-2">
        <label class="mb-1.5 block text-[13px]/5 font-medium text-zinc-600">Delivery address</label>
        <div class="h-24 animate-pulse rounded-lg bg-zinc-200 motion-reduce:animate-none" aria-hidden="true"></div>
        <div class="mt-1.5 flex h-4 items-center" aria-hidden="true"><div class="h-2 w-48 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div></div>
      </div>
    </div>
  </div>

  <div class="flex items-center justify-end gap-2 border-t border-zinc-200 px-5 py-3">
    <div class="h-9 w-24 animate-pulse rounded-lg bg-zinc-200 motion-reduce:animate-none" aria-hidden="true"></div>
    <div class="h-9 w-28 animate-pulse rounded-lg bg-zinc-200 motion-reduce:animate-none" aria-hidden="true"></div>
  </div>
</div>` },

        { id: 'chart', name: 'Chart panel', code:
`<!-- One flat block at the canvas's exact height, and no bars.

     A skeleton that draws plausible bars or a plausible line is showing data.
     Anything chart-shaped gets read as a chart, and somebody takes a trend off
     a shape that came out of a template — which is a worse failure than a slow
     load, because it is silent and it is wrong. The same applies to a donut and
     to a sparkline: flat block, real height, nothing inside it.

     The height is not guessed. The loaded canvas is h-64 inside this card, so
     the block is h-64, and the card is the same height in both states.

     The title and the legend are drawn for real. In this system the legend is
     HTML and doubles as the palette the canvas reads its colours out of at
     init, so it was written into the page and was never waiting on the series.
     Drawing it now also means the reader knows what the chart is going to be
     about before it is.

     Nothing here is an svg. A skeleton built out of <template x-for> inside an
     svg does not render at all — the template is parsed in the SVG namespace
     and has no .content — and it would be a fake series if it did. -->
<div data-kui="skeleton/chart" class="rounded-xl border border-zinc-300 bg-white" aria-busy="true">
  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
    <div>
      <h2 class="text-[16px]/6 font-semibold">Receipts against orders</h2>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">Apr 2026 to Aug 2026 · all plants</p>
    </div>
    <ul class="flex flex-wrap items-center gap-x-4 gap-y-1">
      <li class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
        <span class="size-2 shrink-0 rounded-full bg-zinc-700" aria-hidden="true"></span>Ordered
      </li>
      <li class="flex items-center gap-1.5 text-[12px]/4 text-zinc-600">
        <span class="size-2 shrink-0 rounded-full bg-zinc-400" aria-hidden="true"></span>Received
      </li>
    </ul>
  </div>

  <div class="p-4">
    <p role="status" class="sr-only">Loading the receipts chart</p>
    <div class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div class="h-64 rounded-lg bg-zinc-200"></div>
    </div>
  </div>
</div>` },

        { id: 'record', name: 'Purchase order detail loading', code:
`<!-- The assembled case, and the point of it is which parts are grey.

     Everything on the record header is drawn for real: the breadcrumbs, the PO
     number, the vendor and the status pill all came from the row somebody
     clicked to get here, so the page already had them before it asked the
     server for anything. Grey them out and the screen flashes the title away
     and lands it again, which reads as a navigation that went wrong. Drawn,
     they answer the first question — am I on the right record — while the body
     is still coming.

     Only the three regions that need a query are skeleton, and each is inside
     the card it will fill, at the card's own padding and on the card's own
     border, so no frame appears out of nowhere. The lines table gets its real
     thead and four rows because the order has four lines; the header gives the
     columns their widths before the cells exist.

     One aria-busy, on the main region that is waiting, and one sr-only
     role="status" for the whole screen. Three regions loading together are one
     wait, and three live regions would talk over each other so that only the
     last to resolve is ever heard. Each pulse wrapper carries its own
     aria-hidden and its own motion-reduce:animate-none.

     Below lg the rail drops under the main column and every card keeps its
     full width — the skeleton restacks exactly where the loaded page does, or
     the phone gets a promise the laptop keeps. -->
<div data-kui="skeleton/record" class="bg-zinc-100 p-4 sm:p-6">
  <nav aria-label="Breadcrumb" class="mb-3">
    <ol class="flex flex-wrap items-center gap-1.5 text-[12px]/4 text-zinc-600">
      <li><a href="#" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Purchasing</a></li>
      <li aria-hidden="true"><i data-lucide="chevron-right" class="size-3.5 text-zinc-400"></i></li>
      <li><a href="#" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Purchase orders</a></li>
      <li aria-hidden="true"><i data-lucide="chevron-right" class="size-3.5 text-zinc-400"></i></li>
      <li aria-current="page" class="tabular-nums">PO-24-1187</li>
    </ol>
  </nav>

  <div class="flex flex-wrap items-start justify-between gap-3">
    <div class="min-w-0">
      <div class="flex flex-wrap items-center gap-2.5">
        <h1 class="text-[24px]/7 font-semibold tracking-tight tabular-nums">PO-24-1187</h1>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 shrink-0 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
        </span>
      </div>
      <p class="mt-1 text-[13px]/5 text-zinc-600">Sharma Extrusions · Fabrication</p>
    </div>
    <div class="flex shrink-0 gap-2">
      <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print
      </button>
      <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="check" class="size-4"></i>Approve
      </button>
    </div>
  </div>

  <div class="mt-4 grid gap-4 lg:grid-cols-3" aria-busy="true">
    <p role="status" class="sr-only">Loading purchase order PO-24-1187</p>

    <div class="space-y-4 lg:col-span-2">

      <!-- summary. The four labels are the record's own field names and are
           drawn; only the values are waiting. -->
      <div class="rounded-xl border border-zinc-300 bg-white p-4">
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Raised on</p>
            <div class="mt-1.5 flex h-5 items-center" aria-hidden="true"><div class="h-2.5 w-24 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div></div>
          </div>
          <div>
            <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Due</p>
            <div class="mt-1.5 flex h-5 items-center" aria-hidden="true"><div class="h-2.5 w-20 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div></div>
          </div>
          <div>
            <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Buyer</p>
            <div class="mt-1.5 flex h-5 items-center" aria-hidden="true"><div class="h-2.5 w-28 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div></div>
          </div>
          <div>
            <p class="text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Order value</p>
            <div class="mt-1.5 flex h-5 items-center" aria-hidden="true"><div class="h-2.5 w-24 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div></div>
          </div>
        </div>
      </div>

      <!-- lines. Real thead, four rows because the order has four lines, and
           the totals row is drawn because the footer is structure. -->
      <div class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
        <div class="border-b border-zinc-200 px-4 py-3">
          <h2 class="text-[14px]/5 font-semibold">Order lines</h2>
        </div>
        <table class="hidden w-full text-[13px]/5 md:table">
          <thead>
            <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
              <th scope="col" class="px-4 py-2.5 font-medium">Line</th>
              <th scope="col" class="px-4 py-2.5 font-medium">Item</th>
              <th scope="col" class="px-4 py-2.5 text-right font-medium">Qty</th>
              <th scope="col" class="px-4 py-2.5 text-right font-medium">Rate</th>
              <th scope="col" class="px-4 py-2.5 text-right font-medium">Value</th>
            </tr>
          </thead>
          <tbody class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
            <tr class="border-b border-zinc-100">
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-6 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-48 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-14 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-16 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
            </tr>
            <tr class="border-b border-zinc-100">
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-6 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-40 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-12 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-16 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
            </tr>
            <tr class="border-b border-zinc-100">
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-6 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-56 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-14 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-14 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-16 rounded bg-zinc-200"></div></div></td>
            </tr>
            <tr>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-6 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="h-2.5 w-36 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-12 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-16 rounded bg-zinc-200"></div></div></td>
              <td class="px-4 py-2.5"><div class="flex h-5 items-center"><div class="ml-auto h-2.5 w-20 rounded bg-zinc-200"></div></div></td>
            </tr>
          </tbody>
        </table>

        <ul class="animate-pulse divide-y divide-zinc-100 motion-reduce:animate-none md:hidden" aria-hidden="true">
          <li class="px-4 py-3">
            <div class="flex h-5 items-center justify-between gap-3">
              <div class="h-2.5 w-40 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
            </div>
            <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-32 rounded bg-zinc-200"></div></div>
          </li>
          <li class="px-4 py-3">
            <div class="flex h-5 items-center justify-between gap-3">
              <div class="h-2.5 w-36 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
            </div>
            <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-28 rounded bg-zinc-200"></div></div>
          </li>
          <li class="px-4 py-3">
            <div class="flex h-5 items-center justify-between gap-3">
              <div class="h-2.5 w-44 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-16 rounded bg-zinc-200"></div>
            </div>
            <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-32 rounded bg-zinc-200"></div></div>
          </li>
          <li class="px-4 py-3">
            <div class="flex h-5 items-center justify-between gap-3">
              <div class="h-2.5 w-32 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
            </div>
            <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-24 rounded bg-zinc-200"></div></div>
          </li>
        </ul>

        <div class="flex items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-100 px-4 py-2.5">
          <span class="text-[13px]/5 font-medium">Order total</span>
          <div class="flex h-5 items-center" aria-hidden="true">
            <div class="h-2.5 w-24 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- the rail. Receipts against this order, four rows of a list that has
         not answered yet. -->
    <div class="space-y-4">
      <div class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
        <div class="border-b border-zinc-200 px-4 py-3">
          <h2 class="text-[14px]/5 font-semibold">Receipts</h2>
        </div>
        <ul class="animate-pulse divide-y divide-zinc-100 motion-reduce:animate-none" aria-hidden="true">
          <li class="flex items-start gap-3 px-4 py-3">
            <div class="size-8 shrink-0 rounded-full bg-zinc-200"></div>
            <div class="min-w-0 flex-1">
              <div class="flex h-5 items-center"><div class="h-2.5 w-28 rounded bg-zinc-200"></div></div>
              <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-36 rounded bg-zinc-200"></div></div>
            </div>
          </li>
          <li class="flex items-start gap-3 px-4 py-3">
            <div class="size-8 shrink-0 rounded-full bg-zinc-200"></div>
            <div class="min-w-0 flex-1">
              <div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div>
              <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-40 rounded bg-zinc-200"></div></div>
            </div>
          </li>
          <li class="flex items-start gap-3 px-4 py-3">
            <div class="size-8 shrink-0 rounded-full bg-zinc-200"></div>
            <div class="min-w-0 flex-1">
              <div class="flex h-5 items-center"><div class="h-2.5 w-32 rounded bg-zinc-200"></div></div>
              <div class="mt-0.5 flex h-4 items-center"><div class="h-2 w-28 rounded bg-zinc-200"></div></div>
            </div>
          </li>
        </ul>
      </div>

      <div class="rounded-xl border border-zinc-300 bg-white p-4">
        <h2 class="text-[14px]/5 font-semibold">Terms</h2>
        <div class="animate-pulse mt-3 motion-reduce:animate-none" aria-hidden="true">
          <div class="flex h-5 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
          <div class="flex h-5 items-center"><div class="h-2.5 w-full rounded bg-zinc-200"></div></div>
          <div class="flex h-5 items-center"><div class="h-2.5 w-2/5 rounded bg-zinc-200"></div></div>
        </div>
      </div>
    </div>
  </div>
</div>` }
      ]
  },

  {
    id: 'marker', name: 'Marker', category: 'data',
    description: 'The mark that opens a list item — a dot, a number, an icon or a tinted well — drawn as a real element in a box the height of one line, so it holds its place when the item wraps.',
    when: 'A list whose mark has to carry something ::marker cannot: a chosen size, an icon, a well, a connecting rail, or a state colour. If all it needs is a colour and a size of type, list-disc marker:text-zinc-400 already does it and this component is a wrapper around nothing. A mark that labels a record rather than opening a line is a badge, and a mark in a table cell that says what one row is doing is the badge\'s dot — this is the list case, where the marks are a column of their own and the eye reads down them.',
    notes: [
      'Tailwind preflight already sets list-style: none on every ul and ol, which means every bare list in this system is a list with no marker before anybody writes a class — and WebKit strips the list role from a list whose list-style is none. So role="list" on the ul or ol is not belt and braces here, it is the default state of the stack: without it a nine-line exception list is announced to VoiceOver as nine unrelated paragraphs and the count, which is the one thing a list gives you for free, is gone. Write it on ordered lists too; the ARIA list role covers both and nothing about the ordering is lost.',
      '::marker takes colour, the font properties, line-height, content and white-space, and refuses everything else. No width, no height, no padding, no margin, no background, no border, no position, and no control over the distance between the mark and the text. marker:bg-zinc-200 is valid Tailwind, compiles to valid CSS, ships, and paints nothing at all — which is the failure mode to watch for, because nothing errors. font-size is on the allowed list, so marker:text-[11px]/4 does shrink the disc, but the disc is whatever fraction of the em that font family decided on and the font-size also sizes the marker box, so the first line moves. Scale a bullet that way and it is right on one machine.',
      'items-start, never items-center. On a one-line item the two render identically, which is exactly how items-center gets shipped and stays; on the three-line item three rows down it drops the mark to the optical middle of the whole block and the list loses its left edge. Every item in a register wraps at 390px, so the wrapped case is the normal case and the one-line case is the exception.',
      'A dot sits inside a box the height of one line — flex h-5 items-center for the 20px leading of text-[13px]/5 — and is not pushed down by a margin. A 6px disc on a 20px line wants 7px of offset, 7px is not a step on the scale, and mt-[7px] is correct for exactly one type size and silently wrong the day the list is set at 14px. The box is derived from the leading, and the leading is already written in the class name, so the two cannot drift. An icon marker is the exception and takes size-4 shrink-0 mt-0.5, which is the alert icon exactly and not a coincidence — it is the same mark doing the same job one level down, 16px into a 20px line is 2px of offset, and 2px is a step. Two mechanisms for one alignment reads as an inconsistency, which is why both are written out here rather than reasoned out again per screen.',
      'shrink-0 on the marker box or the first unbroken token in the item — an item code, a GSTIN, a long PO number — compresses the mark instead of wrapping itself, and a 6px dot squeezed to 4px in one row of five is a rendering fault nobody can name. The text column takes min-w-0 for the other half of the same problem: without it truncate never truncates and the row grows past the card.',
      'A number column is fixed-width, text-right and tabular-nums, all three. Proportional figures alone break it — 9 and 11 are different widths in Inter, so the item text starts at two different x positions and the left edge of the list wobbles down the page. The right edge pins the periods, the fixed width pins the text. Do not centre the column: centring splits the difference and moves both edges instead of neither.',
      'A painted number belongs to the record or it does not exist. ::marker recounts when a row is removed; a span written by the template does not, so the moment a list is filtered, sorted or paged the painted numbers are either the record\'s own line numbers, which is correct and the reason to paint them, or a stale copy of a position, which is a bug the buyer finds on the phone when their line 5 and yours are different lines. If the number is only the position, delete the column and use list-decimal.',
      'An icon marker is aria-hidden and the state it carries is a sr-only word beside it. A screen reader reading circle-check, circle-check, circle-check down a nine-item checklist is noise, and the list already announces the count — but hiding the icon without putting the word back deletes the only carrier of Failed, so the two go together and neither is optional. This is the alert rule and the badge rule arriving in a list: colour and shape are for the eye, the word is the data.',
      'A coloured mark means the item\'s state and there are only a few of them in any list. The default is zinc-400, and the locked mapping applies unchanged when the item has a status — zinc-500 open, amber-500 waiting, red-600 overdue, emerald-600 done. One red dot in a column of graphite reads across the room; nine coloured dots read as a decorative pattern and the overdue one is no longer findable. Never colour marks to categorise — a blue dot for freight and a green one for material is decoration wearing the status palette, and it burns the colours that were meant to mean something.',
      'A well around a number or a count is a tinted shape and carries its ring: bg-zinc-200 ring-1 ring-inset ring-zinc-300. Give it bg-zinc-100 and it is the identical colour as the page behind it and as a selected row, so it does not read as low contrast, it reads as absent. The one solid well is the current step, bg-zinc-700 text-white, and a solid shape takes no ring — a pale ring round a dark disc looks like a rendering fault.',
      'The connecting rail on a timeline is a flex child of the marker column, not an absolutely positioned line, and it stops at the last item. Positioned absolutely it needs a left offset that has to be kept in step with the width of the mark by hand, and a 1px rail under an even-width column lands on a half pixel; as a flex child the same flexbox that centres the mark centres the rail, with no number to maintain. A single full-height rail on the list instead of one per item is the other failure: it runs past the last mark by the height of the last item\'s text, which is not a height you can hardcode because that item wraps.',
      'The mark is never the click target and never takes a hover or a focus style. The link is the text of the item, which is a target with a readable name; a 6px disc is 6px of hit area and a screen reader announces it as nothing. A list where the dot is clickable and the label is not is a list that cannot be used from a keyboard.'
    ],
    anatomy: [
      ['List', 'The real ul or ol, carrying role="list" because preflight has already removed list-style and WebKit reads that as "not a list". Ordered content stays an ol even when the numbers are painted by hand.'],
      ['Item', 'flex gap-2.5 with items-start. The gap is the whole distance between the mark and the text — there is no padding on either side of it — so changing the gap is how the indent is tuned, and nothing else touches it.'],
      ['Marker box', 'flex h-5 shrink-0 items-center. A box one line tall that holds the mark on the first line and stays there while the item wraps to three. Its height is the leading of the text beside it; h-5 for text-[13px]/5, h-6 for the 24px leading of prose.'],
      ['Mark', 'The 6px dot, the size-4 Lucide icon, or the figure. aria-hidden when it is decoration, real text when it is a number people quote. zinc-400 by default, and a status colour only when the item has a status.'],
      ['Content', 'min-w-0 flex-1 so long values truncate rather than pushing the card wide. Everything that can be read or clicked lives here, including the item\'s link.'],
      ['Rail', 'w-px flex-1 bg-zinc-200 below the mark in a flex-col marker column, hidden on the last item with group-last:hidden. It fills the item\'s bottom padding, so the gap between two marks is bridged and the gap after the last one is not.'],
      ['Well', 'A size-5 disc round a step number or a count: bg-zinc-200 ring-1 ring-inset ring-zinc-300, or solid bg-zinc-700 for the current step. At 20px it is the line box itself, so it needs no box around it and no offset.']
    ],
    behaviour: [
      'The mark holds the first line when the item wraps. It is centred inside a fixed one-line box rather than against the item, so a three-line exception and a one-line one start at the same y.',
      'The mark never compresses. It is shrink-0 and the text column is min-w-0 and flex-1, so a long unbroken code truncates or wraps and the column of marks stays a straight line.',
      'Numbers come from the record, not from the loop. Filtering the list hides rows and leaves the remaining numbers alone, which is what makes them safe to quote; a counter painted from the index renumbers and two people end up meaning different lines by "line 5".',
      'The rail bridges the gap between two marks and stops under the last one. It is per-item and hidden on the last, so adding or removing items needs no measurement anywhere.',
      'At most a couple of marks in a list are coloured. The list runs zinc-400 and the exceptions are the coloured ones — the colour is the answer to "which of these needs me", and it stops being an answer once most of them have it.',
      'Nesting steps the mark down in size and shade, 6px zinc-500 to 4px zinc-300, and the indent comes from padding on the nested list. Widening the child items\' gap instead detaches each child mark from its own text and the second level stops reading as a list at all.',
      'Nothing here is interactive. The mark takes no hover, no focus and no pointer; the item\'s link is its text.',
      'At 390px the marker column keeps its width and the text wraps under itself, never under the mark. Amounts and dates drop to a second line inside the content column rather than the row scrolling sideways.'
    ],
    a11y: [
      'role="list" on the ul or ol, always, because preflight has already set list-style: none and WebKit drops the list role when it sees that. Without it the item count and the "list of nine items" announcement disappear, and those are the reason the content is a list rather than a stack of divs.',
      'Ordered content keeps its ol even when the numbers are painted, so the order is in the markup and not only in the ink. A ul with hand-written numbers is a set with no order that happens to be printed in one.',
      'Decorative marks are aria-hidden — every dot, every icon, every rail. The dot is the badge\'s dot doing the same job and it is hidden for the same reason: the word beside it is the information.',
      'The state an icon carries is repeated as a sr-only word at the start of the item, so hiding the icon does not delete the only carrier of Failed. Colour is never the sole signal, for the same reason the alert states its severity in words.',
      'A painted number is real text and stays readable, because with list-style already none nothing else will say it and because a step number is what people quote. Chrome will also announce the item\'s position, so the number is heard twice; that is the cheaper of the two mistakes.',
      'The current step in a sequence carries aria-current="step" on the item. Filling its well graphite is the visual half of the same fact and does nothing on its own for anyone who cannot see the fill.',
      'The item\'s link is the text and carries the accessible name — "PO-24-1187, Sharma Extrusions", not "link". Nothing in the marker column is focusable, so the Tab order runs down the labels with no dead stops in it.'
    ],
    related: ['badge', 'progress', 'separator'],
    variants: [
      { id: 'prose', name: 'What ::marker already does', code:
`<!-- Reach for the pseudo first. Tailwind's marker: variant reaches ::marker on
     the list and on every item inside it, so a prose list needs one class and
     no extra elements. Nothing below this line in this entry is worth writing
     if marker:text-zinc-400 was all you needed.

     Preflight has already set list-style: none on every ul and ol, so a prose
     list has to ask for its marker back with list-disc or list-decimal and the
     padding that hangs it outside the text. Bare lists in this system start
     with no marker at all, which is why role="list" matters everywhere else.

     What the pseudo refuses is the reason for the rest of this entry: no width,
     no height, no padding, no background, no position, and no say in the gap.
     marker:bg-zinc-200 compiles, ships and paints nothing. font-size is allowed
     and does shrink the disc, but the disc is whatever fraction of the em the
     font chose and the font-size moves the marker box with it, so sizing a
     bullet that way is right on one machine.

     marker:tabular-nums earns its place on any ordered list that runs past
     nine: outside markers align to their right edge on their own, but
     proportional figures still make 9 and 11 different widths. -->
<div data-kui="marker/prose" class="max-w-md space-y-5 rounded-xl border border-zinc-300 bg-white p-5">
  <div>
    <h3 class="text-[13px]/5 font-medium">Conditions on the rate contract</h3>
    <ul class="mt-2 list-disc space-y-1 pl-5 text-[14px]/6 text-zinc-600 marker:text-zinc-400">
      <li>Rates hold to 31 Mar 2027 and are quoted ex-works Nashik.</li>
      <li>Freight is billed at actuals against the transporter's receipt, and does not carry the contract discount.</li>
      <li>Any revision needs a signed amendment before the next order is raised.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-[13px]/5 font-medium">Order of precedence</h3>
    <ol class="mt-2 list-decimal space-y-1 pl-6 text-[14px]/6 text-zinc-600 marker:tabular-nums marker:text-zinc-500">
      <li>The purchase order and its annexures.</li>
      <li>The rate contract dated 04 Apr 2026.</li>
      <li>The vendor's quotation, to the extent it is not overridden above.</li>
    </ol>
  </div>
</div>` },

      { id: 'dot', name: 'Dot list', code:
`<!-- The replacement, and everything after this is a variation on it. The list
     needs no list-none — preflight took the marker away already — but it does
     need role="list" put back, because WebKit reads a list-style of none as
     "not a list" and VoiceOver then announces four unrelated paragraphs with no
     count in front of them.

     items-start, not items-center. On a one-line item the two are identical,
     which is how items-center gets shipped and survives review; on the last
     item here it drops the dot to the middle of a three-line block and the
     column of marks stops being a straight edge. At 390px every one of these
     wraps, so the wrapped case is the normal one.

     The dot is centred inside a box one line tall rather than pushed down by a
     margin. A 6px disc on a 20px line wants 7px of offset, 7px is not a step on
     the scale, and mt-[7px] is correct for exactly one type size. h-5 is the
     leading of text-[13px]/5, so the box and the text cannot drift apart. -->
<div data-kui="marker/dot" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  <h3 class="text-[13px]/5 font-medium">Exceptions on GRN-26-0442</h3>
  <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">Posted 16 Aug 2026 by Ritu Deshpande</p>

  <ul role="list" class="mt-3 space-y-2 text-[13px]/5 text-zinc-600">
    <li class="flex items-start gap-2.5">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-400"></span></span>
      <span class="min-w-0 tabular-nums">Short receipt of 600 kg against PO-24-1187.</span>
    </li>
    <li class="flex items-start gap-2.5">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-400"></span></span>
      <span class="min-w-0">Lorry receipt number does not match the one on the invoice.</span>
    </li>
    <li class="flex items-start gap-2.5">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-400"></span></span>
      <span class="min-w-0 tabular-nums">Two bags opened at the gate; 48 kg written off and charged back to Sharma Extrusions on debit note DN-26-0117 pending the transporter's reply.</span>
    </li>
  </ul>
</div>` },

      { id: 'numbered', name: 'Numbered lines', code:
`<!-- The numbers are the order's own line numbers, which is the only honest
     reason to paint them. Hide the cancelled line and the list still reads 10,
     20, 40 — the numbers belong to the record, they survive a filter, and the
     buyer quotes them on the phone. Paint them from the loop index instead and
     the same click renumbers everything below it, so their line 40 and yours
     are different lines and neither screen says so. If the number is only a
     position, delete the column and let list-decimal count.

     Fixed w-8, text-right and tabular-nums, all three. Proportional figures
     alone are enough to break it: 90 and 100 are different widths in Inter, so
     the description would start at two different x positions down the column.
     The right edge pins the figures, the fixed width pins the text. Centring
     the column moves both edges instead of neither.

     x-cloak on the row that starts hidden, or it flashes on every load before
     Alpine boots. -->
<div data-kui="marker/numbered" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5" x-data="{ cancelled: false }">
  <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
    <h3 class="text-[13px]/5 font-medium tabular-nums">PO-24-1187 · lines</h3>
    <button type="button" @click="cancelled = !cancelled"
            class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span x-text="cancelled ? 'Hide cancelled line' : 'Show cancelled line'">Show cancelled line</span>
    </button>
  </div>

  <ol role="list" class="mt-3 space-y-2 text-[13px]/5">
    <li class="flex items-start gap-3">
      <span class="w-8 shrink-0 text-right text-[13px]/5 tabular-nums text-zinc-500">10.</span>
      <span class="min-w-0 flex-1 text-zinc-600">HDPE granules, natural, 25 kg bags</span>
      <span class="shrink-0 tabular-nums text-zinc-600">₹2,84,000</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="w-8 shrink-0 text-right text-[13px]/5 tabular-nums text-zinc-500">20.</span>
      <span class="min-w-0 flex-1 text-zinc-600">Masterbatch, black, 5% loading</span>
      <span class="shrink-0 tabular-nums text-zinc-600">₹64,500</span>
    </li>
    <li class="flex items-start gap-3" x-show="cancelled" x-cloak>
      <span class="w-8 shrink-0 text-right text-[13px]/5 tabular-nums text-zinc-400">30.</span>
      <span class="min-w-0 flex-1 text-zinc-500">Anti-slip additive — cancelled 09 Aug 2026</span>
      <span class="shrink-0 tabular-nums text-zinc-500">₹0</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="w-8 shrink-0 text-right text-[13px]/5 tabular-nums text-zinc-500">40.</span>
      <span class="min-w-0 flex-1 text-zinc-600">Stretch film, 23 micron</span>
      <span class="shrink-0 tabular-nums text-zinc-600">₹1,33,500</span>
    </li>
  </ol>

  <p class="mt-3 border-t border-zinc-100 pt-3 text-[12px]/4 tabular-nums text-zinc-500">Line numbers are the order's own and do not renumber.</p>
</div>` },

      { id: 'checklist', name: 'Icon checklist', code:
`<!-- The icon is size-4 shrink-0 mt-0.5, which is the alert icon exactly. 16px
     into a 20px line is 2px of offset and 2px is a step on the scale, so the
     icon takes a margin where the 6px dot took a box — the dot's 7px is not a
     step and mt-[7px] would be right for one type size only.

     Every icon is aria-hidden. Nine items read out as circle-check, circle-
     check, circle-check is noise, and the list already announces its own count.
     But hiding the icon without putting the word back deletes the only carrier
     of Failed, so each item opens with a sr-only word — the two go together and
     neither half is optional on its own.

     Colour lives in the icon and nowhere else: no tinted row, no coloured text,
     no fill behind the line. Three of these six are graphite, which is what
     makes the red one findable. -->
<div data-kui="marker/checklist" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  <h3 class="text-[13px]/5 font-medium">Three-way match — INV-8841</h3>
  <p class="mt-0.5 text-[12px]/4 text-zinc-500">Nashik Steel Traders · checked 16 Aug 2026, 11:04</p>

  <ul role="list" class="mt-3 space-y-2 text-[13px]/5 text-zinc-600">
    <li class="flex items-start gap-2.5">
      <i data-lucide="check-circle-2" class="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true"></i>
      <span class="min-w-0 tabular-nums"><span class="sr-only">Passed — </span>Invoice value ₹4,26,500 matches the order.</span>
    </li>
    <li class="flex items-start gap-2.5">
      <i data-lucide="check-circle-2" class="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true"></i>
      <span class="min-w-0"><span class="sr-only">Passed — </span>GSTIN on the invoice matches the vendor master.</span>
    </li>
    <li class="flex items-start gap-2.5">
      <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden="true"></i>
      <span class="min-w-0 tabular-nums"><span class="sr-only">Failed — </span>Received quantity is 2,400 kg against 3,000 kg invoiced.</span>
    </li>
    <li class="flex items-start gap-2.5">
      <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true"></i>
      <span class="min-w-0 tabular-nums"><span class="sr-only">Waiting — </span>Freight of ₹8,200 is not on the rate contract and needs a buyer's note.</span>
    </li>
    <li class="flex items-start gap-2.5">
      <i data-lucide="circle" class="mt-0.5 size-4 shrink-0 text-zinc-400" aria-hidden="true"></i>
      <span class="min-w-0"><span class="sr-only">Not started — </span>Quality release against the lot certificate.</span>
    </li>
    <li class="flex items-start gap-2.5">
      <i data-lucide="circle" class="mt-0.5 size-4 shrink-0 text-zinc-400" aria-hidden="true"></i>
      <span class="min-w-0"><span class="sr-only">Not started — </span>Approval by the plant head.</span>
    </li>
  </ul>
</div>` },

      { id: 'timeline', name: 'Activity feed with a rail', code:
`<!-- The rail is a flex child of the marker column, not an absolutely
     positioned line. Positioned absolutely it needs a left offset kept in step
     with the width of the mark by hand, and a 1px line under an even-width
     column lands on a half pixel; as a flex child the same items-center that
     centres the dot centres the rail, and there is no number to maintain.

     It stops at the last item, which is the whole difficulty. One full-height
     rail on the list overshoots the last mark by the height of that item's
     text, and that height is not hardcodable because the item wraps. So the
     rail is per-item: flex-1 fills from under the dot to the bottom of the li,
     the li's pb-4 is what it bridges, and group-last:hidden with last:pb-0
     removes both on the final entry.

     Everything in the marker column is aria-hidden. The rail is a picture of
     the fact that these entries are one sequence; the dates say it in words. -->
<div data-kui="marker/timeline" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  <h3 class="text-[13px]/5 font-medium tabular-nums">PO-24-1187 · history</h3>

  <ul role="list" class="mt-3">
    <li class="group flex gap-3 pb-4 last:pb-0">
      <span class="flex shrink-0 flex-col items-center" aria-hidden="true">
        <span class="flex h-5 items-center"><span class="size-1.5 rounded-full bg-emerald-600"></span></span>
        <span class="w-px flex-1 bg-zinc-200 group-last:hidden"></span>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-[13px]/5">GRN-26-0442 posted against the order.</p>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">16 Aug 2026, 11:04 · Ritu Deshpande</p>
      </div>
    </li>
    <li class="group flex gap-3 pb-4 last:pb-0">
      <span class="flex shrink-0 flex-col items-center" aria-hidden="true">
        <span class="flex h-5 items-center"><span class="size-1.5 rounded-full bg-zinc-400"></span></span>
        <span class="w-px flex-1 bg-zinc-200 group-last:hidden"></span>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-[13px]/5">Order emailed to Sharma Extrusions with the annexure attached.</p>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">09 Aug 2026, 16:20 · Ritu Deshpande</p>
      </div>
    </li>
    <li class="group flex gap-3 pb-4 last:pb-0">
      <span class="flex shrink-0 flex-col items-center" aria-hidden="true">
        <span class="flex h-5 items-center"><span class="size-1.5 rounded-full bg-zinc-400"></span></span>
        <span class="w-px flex-1 bg-zinc-200 group-last:hidden"></span>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-[13px]/5 tabular-nums">Approved at ₹4,82,000 by the plant head, above the buyer's own limit.</p>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">08 Aug 2026, 10:12 · Anil Kulkarni</p>
      </div>
    </li>
    <li class="group flex gap-3 pb-4 last:pb-0">
      <span class="flex shrink-0 flex-col items-center" aria-hidden="true">
        <span class="flex h-5 items-center"><span class="size-1.5 rounded-full bg-zinc-400"></span></span>
        <span class="w-px flex-1 bg-zinc-200 group-last:hidden"></span>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-[13px]/5">Raised against the rate contract dated 04 Apr 2026.</p>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">07 Aug 2026, 09:48 · Ritu Deshpande</p>
      </div>
    </li>
  </ul>
</div>` },

      { id: 'register', name: 'Status marks down a register', code:
`<!-- The same 6px dot the badge uses, with no pill round it. The pill exists to
     give a scattered set of states a shared shape; a list already has a shared
     left edge and the marks already form a column, so the pill is weight for
     nothing. The locked mapping is unchanged — zinc-500 open, amber-500
     waiting, red-600 overdue, emerald-600 done.

     Four of the five here are graphite, which is the point. Colour one mark per
     row and the column is a stripe of traffic lights by the twelfth row and the
     overdue one is no longer the thing your eye lands on.

     The dot is aria-hidden and the status is a sr-only word at the front of the
     meta line, so the state is not colour alone. The link is the label, never
     the mark — a 6px disc is 6px of hit area with no accessible name. -->
<div data-kui="marker/register" class="max-w-md overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <div class="border-b border-zinc-200 px-4 py-3">
    <h3 class="text-[13px]/5 font-medium">Orders awaiting receipt</h3>
    <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">5 of 1,438 · sorted by due date</p>
  </div>

  <ul role="list" class="divide-y divide-zinc-100">
    <li class="flex items-start gap-2.5 px-4 py-3">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-red-600"></span></span>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-3">
          <a href="#" class="truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1187 · Sharma Extrusions</a>
          <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">₹4,82,000</span>
        </div>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500"><span class="sr-only">Overdue — </span>Due 12 Aug 2026 · 9 days late</p>
      </div>
    </li>
    <li class="flex items-start gap-2.5 px-4 py-3">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-amber-500"></span></span>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-3">
          <a href="#" class="truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1186 · Konkan Fabricators</a>
          <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">₹1,15,400</span>
        </div>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500"><span class="sr-only">Approved — </span>With the plant head since 14 Aug 2026</p>
      </div>
    </li>
    <li class="flex items-start gap-2.5 px-4 py-3">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-3">
          <a href="#" class="truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1194 · Gujarat Polymers Ltd</a>
          <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">₹18,42,000</span>
        </div>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500"><span class="sr-only">Open — </span>Due 28 Aug 2026 · part received</p>
      </div>
    </li>
    <li class="flex items-start gap-2.5 px-4 py-3">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-3">
          <a href="#" class="truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1201 · Qureshi Metals</a>
          <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">₹2,30,000</span>
        </div>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500"><span class="sr-only">Open — </span>Due 02 Sep 2026</p>
      </div>
    </li>
    <li class="flex items-start gap-2.5 px-4 py-3">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between gap-3">
          <a href="#" class="truncate text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1203 · Deshpande Traders</a>
          <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">₹96,750</span>
        </div>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500"><span class="sr-only">Open — </span>Due 05 Sep 2026</p>
      </div>
    </li>
  </ul>
</div>` },

      { id: 'nested', name: 'Nested list', code:
`<!-- The second level steps down in size and shade — 6px zinc-500 to 4px
     zinc-300 — and not in shape. A hollow ring at 6px is a tinted shape under
     the ring rule, wanting a fill and a ring inside six pixels, and what it
     actually renders is a smudge; two solid dots at two weights read
     immediately and take one class each.

     The indent belongs to the nested ul as pl-5, never to the child items as a
     wider gap. The gap is the distance between a mark and its own text: widen
     it and every child mark floats away from the line it opens, so the second
     level stops looking like a list and starts looking like two columns.

     pl-5 is the parent's 6px mark plus its gap-2.5 rounded to a step, so the
     child marks hang under the parent's text rather than under its mark. Line
     the two levels of mark up with each other instead and the nesting is
     invisible. -->
<div data-kui="marker/nested" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  <h3 class="text-[13px]/5 font-medium">Rejections this month</h3>

  <ul role="list" class="mt-3 space-y-2 text-[13px]/5">
    <li class="flex items-start gap-2.5">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
      <div class="min-w-0 flex-1">
        <p class="tabular-nums">Sharma Extrusions — 3 lots</p>
        <ul role="list" class="mt-1.5 space-y-1.5 pl-5 text-[12px]/4 text-zinc-600">
          <li class="flex items-start gap-2">
            <span class="flex h-4 shrink-0 items-center" aria-hidden="true"><span class="size-1 rounded-full bg-zinc-300"></span></span>
            <span class="min-w-0 tabular-nums">Lot 26-114 · moisture above 0.08%</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="flex h-4 shrink-0 items-center" aria-hidden="true"><span class="size-1 rounded-full bg-zinc-300"></span></span>
            <span class="min-w-0 tabular-nums">Lot 26-119 · melt flow index outside the band on two of five samples, retest pending</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="flex h-4 shrink-0 items-center" aria-hidden="true"><span class="size-1 rounded-full bg-zinc-300"></span></span>
            <span class="min-w-0 tabular-nums">Lot 26-121 · bags torn in transit</span>
          </li>
        </ul>
      </div>
    </li>
    <li class="flex items-start gap-2.5">
      <span class="flex h-5 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-500"></span></span>
      <div class="min-w-0 flex-1">
        <p class="tabular-nums">Nashik Steel Traders — 1 lot</p>
        <ul role="list" class="mt-1.5 space-y-1.5 pl-5 text-[12px]/4 text-zinc-600">
          <li class="flex items-start gap-2">
            <span class="flex h-4 shrink-0 items-center" aria-hidden="true"><span class="size-1 rounded-full bg-zinc-300"></span></span>
            <span class="min-w-0 tabular-nums">Lot 26-108 · mill certificate not supplied</span>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</div>` },

      { id: 'steps', name: 'Steps in wells', code:
`<!-- The well is a tinted shape, so it takes bg-zinc-200 with ring-1 ring-inset
     ring-zinc-300. bg-zinc-100 would be the identical colour as the page and as
     a selected row underneath it, which does not read as low contrast, it reads
     as nothing there at all. The current step is the one solid shape,
     bg-zinc-700, and a solid shape takes no ring — a pale ring round a dark
     disc looks like a rendering fault.

     size-5 is 20px, which is the line box of text-[13px]/5 exactly, so the well
     needs no box around it and no offset. That is the only marker here that is
     its own leading box.

     aria-current="step" carries the same fact as the graphite fill, because the
     fill says nothing to anyone who cannot see it. The step numbers stay real
     text: they are what people quote when a run stalls, and with list-style
     already gone nothing else is going to say them. The done steps swap the
     number for a check and put the word back with sr-only. -->
<div data-kui="marker/steps" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  <h3 class="text-[13px]/5 font-medium tabular-nums">Invoice INV-8841 · payment run</h3>

  <ol role="list" class="mt-3 space-y-3 text-[13px]/5">
    <li class="flex items-start gap-3">
      <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="check" class="size-3 text-emerald-600" aria-hidden="true"></i>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-zinc-600"><span class="sr-only">Done — </span>Invoice received and booked</p>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">14 Aug 2026 · Ritu Deshpande</p>
      </div>
    </li>
    <li class="flex items-start gap-3">
      <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
        <i data-lucide="check" class="size-3 text-emerald-600" aria-hidden="true"></i>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-zinc-600"><span class="sr-only">Done — </span>Matched to GRN-26-0442</p>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">16 Aug 2026 · short by 600 kg</p>
      </div>
    </li>
    <li class="flex items-start gap-3" aria-current="step">
      <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[11px]/4 font-medium tabular-nums text-white">3</span>
      <div class="min-w-0 flex-1">
        <p class="font-medium">Debit note approved</p>
        <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">With Anil Kulkarni since 18 Aug 2026 · ₹8,200</p>
      </div>
    </li>
    <li class="flex items-start gap-3">
      <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-medium tabular-nums text-zinc-600 ring-1 ring-inset ring-zinc-300">4</span>
      <div class="min-w-0 flex-1">
        <p class="text-zinc-500">Released to the payment run</p>
      </div>
    </li>
    <li class="flex items-start gap-3">
      <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-medium tabular-nums text-zinc-600 ring-1 ring-inset ring-zinc-300">5</span>
      <div class="min-w-0 flex-1">
        <p class="text-zinc-500">Paid, 45 days from GRN</p>
      </div>
    </li>
  </ol>
</div>` },

      { id: 'dense', name: 'In a cell and in prose', code:
`<!-- The same two exceptions, in the cell of a register and in the note printed
     under the order, and the marker is not the same size in both. In prose at
     text-[14px]/6 the mark is 6px in an h-6 box; in the cell at text-[12px]/4
     it is 4px in an h-4 box with gap-2 instead of gap-2.5. A 6px dot in a dense
     cell competes with the row rules and the status pill three columns over and
     reads as another status; a 4px dot on a 24px line of prose is a speck of
     dirt. The rule is that the mark tracks the leading it opens, which is why
     the box height is written from the leading every time.

     Two rows here carry a list and two carry a single value. Never make the
     single value a one-item list to keep the column tidy — a list of one is
     announced as "list, 1 item" and the tidiness costs a sentence.

     Vendor drops below sm rather than the table scrolling sideways. -->
<div data-kui="marker/dense" class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <table class="w-full table-fixed text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="px-4 py-2 font-medium sm:w-32">GRN</th>
        <th scope="col" class="hidden px-4 py-2 font-medium sm:table-cell">Vendor</th>
        <th scope="col" class="px-4 py-2 font-medium">Exceptions</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5 align-top font-medium tabular-nums">GRN-26-0442</td>
        <td class="hidden truncate px-4 py-2.5 align-top sm:table-cell">Sharma Extrusions</td>
        <td class="px-4 py-2.5 align-top">
          <ul role="list" class="space-y-1 text-[12px]/4 text-zinc-600">
            <li class="flex items-start gap-2">
              <span class="flex h-4 shrink-0 items-center" aria-hidden="true"><span class="size-1 rounded-full bg-zinc-400"></span></span>
              <span class="min-w-0 tabular-nums">Short by 600 kg</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="flex h-4 shrink-0 items-center" aria-hidden="true"><span class="size-1 rounded-full bg-zinc-400"></span></span>
              <span class="min-w-0">Lorry receipt mismatch</span>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td class="px-4 py-2.5 align-top font-medium tabular-nums">GRN-26-0441</td>
        <td class="hidden truncate px-4 py-2.5 align-top sm:table-cell">Qureshi Metals</td>
        <td class="px-4 py-2.5 align-top text-[12px]/4 text-zinc-500">None</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="mt-3 max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  <h3 class="text-[13px]/5 font-medium tabular-nums">Note printed on GRN-26-0442</h3>
  <ul role="list" class="mt-2 space-y-1.5 text-[14px]/6 text-zinc-600">
    <li class="flex items-start gap-2.5">
      <span class="flex h-6 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-400"></span></span>
      <span class="min-w-0 tabular-nums">Short receipt of 600 kg against a 3,000 kg order line.</span>
    </li>
    <li class="flex items-start gap-2.5">
      <span class="flex h-6 shrink-0 items-center" aria-hidden="true"><span class="size-1.5 rounded-full bg-zinc-400"></span></span>
      <span class="min-w-0">The lorry receipt number does not match the one quoted on the invoice.</span>
    </li>
  </ul>
</div>` }
    ]
  },

  {
    id: 'spinner', name: 'Spinner', category: 'data',
    description: 'The indeterminate wait. A graphite ring that turns while work of unknown length is in flight, and a line of text that says what the work is.',
    when: 'Work whose length you cannot predict and whose answer you cannot draw — a report the server is still assembling, a save you are waiting on, a filter that may return four rows or four thousand. It is the wrong answer twice over: if you know the total, a progress bar can say how far along it is, and if you know the layout coming back, a skeleton can hold its shape so the page does not jump. A spinner over a register you have rendered a thousand times is a skeleton nobody wrote.',
    notes: [
      'The ring is borders, not a Lucide icon. Measured: loader-circle is a 2-unit stroke on a 24-unit viewBox, so it paints 1.33px inside size-4 and 3.33px inside size-10 — the same glyph two and a half times heavier — and a size scale built on it thickens as it grows, while a border width is chosen per size. The second reason matters more. An <i data-lucide> is an empty inline element with no box at all until createIcons() has run over it, and a spinner arriving inside an htmx swap is exactly the case that cannot count on that.',
      'The ring is aria-hidden and the words are the announcement. A turning shape resolves to nothing worth reading, so a spinner that is only a shape is a wait nobody was told about. Real text goes in a role="status" beside it — sr-only where the panel already names what is loading, visible where it does not.',
      'aria-label on a role="status" is a name, not content, and a live region announces content. Resolved in the accessibility tree, a role="status" carrying aria-label="Loading orders" and no children comes back as a status named "Loading orders" with nothing inside it: it appears, nothing within it changed, and nothing is said. The same string as a text node comes back as status: Loading orders, which is the part that gets read.',
      'The live region has to be in the document before the text lands, the same way the combobox match count is. A role="status" that arrives inside an htmx fragment with its message already in it never changed. Put the status on the panel that survives the swap and let the fragment replace only the rows under it.',
      'Never motion-reduce:animate-none on a spinner. Measured under prefers-reduced-motion: reduce, animation-name computes to none and the ring stops as a zinc-200 circle with one graphite quarter — a static broken ring that reads as a rendering fault, and the only sign that anything is still happening is gone. A 20px ring turning once a second is not the large-area motion the preference exists for. The accommodation is the label beside it, which is there for everybody.',
      'Graphite, always. Colour means data state and a wait has no state yet, so a green ring claims success before the server has answered and an amber one raises a warning nobody filed. There is no success spinner and no danger spinner. There is a spinner, and then there is what it resolved into.',
      'Keep the zinc-200 track. It is one step off white and one step off the zinc-100 page, so the circle is visible on both, and it is what makes the graphite quarter read as a position on a ring rather than a stray mark. Three transparent sides leave a bare arc that at 16px looks like a comma somebody typed by accident.',
      'Size and stroke move together: size-4 with border-2, size-5 with border-2, size-8 with border-[3px] — measured 16, 20 and 32px carrying 2, 2 and 3px. border-4 inside size-8 is a ring an eighth of its own diameter and reads as a donut chart rather than a spinner.',
      'The ring is shrink-0 and the label is what wraps. Measured at 390px beside a two-line sentence: a size-8 ring came back 32.0px wide with shrink-0 and 24.5px without it, and a size-4 ring 16.0px against 12.9px. Neither is a smaller spinner — height is untouched, so what you get is an ellipse turning on its long axis. Flex takes width out of whatever will give it, and a circle will.',
      'A spinner never replaces content that is already on screen. Swapping a rendered table for a centred ring throws away the scroll position and the row somebody was reading, and the panel collapses to the height of a ring and a caption, so everything below it jumps up under the cursor. Cover it instead: a bg-white/70 scrim with the ring on top and the rows still legible underneath. Measured across a full idle-busy-idle cycle of the overlay variant, the panel held 218px at every step.',
      'Covering content is not blocking it. A scrim stops the mouse and nothing else — Tab still walks into the stale rows underneath and Enter still fires a row action against data that is being replaced. The content wrapper takes :inert="busy". Verified in Alpine 3.16: inert is on the boolean-attribute list, so a false value removes the attribute rather than writing inert="false", which is a truthy string and would leave the region permanently inert.',
      'aria-busy belongs to the region that is waiting, not to the ring. The ring is what is drawn; the panel is what is busy. Alpine preserves only aria-pressed, aria-checked, aria-expanded and aria-selected when they are false, so :aria-busy="false" removes the attribute outright — correct here, because aria-busy defaults to false, but not a thing to assume of any other aria-* binding.',
      'Below about 300ms a spinner is noise. The request answers before the eye has resolved the shape and all anyone sees is a flicker where the number was. Give every spinner a 500ms floor and most of them never paint at all.',
      'The floor is opacity, not x-show. opacity-0 keeps the box, so nothing moves when the ring arrives; display does not, and a spinner that appears 500ms after the click widens the row and takes the button out from under the cursor at exactly the moment somebody is going for a second one.',
      'The delay belongs in the bound class, not the base class. Left in the base it delays the fade out as well — measured, a spinner written opacity-0 transition-opacity delay-500 with :class="busy && \'opacity-100\'" was still at full opacity 520ms after a 1.6s request had already landed its content, which reads as a panel still loading something it has finished drawing. Base delay-0, bound opacity-100 delay-500, and the same spinner was gone 196ms after the work stopped.',
      'The CSS floor cannot reach the live region. x-text fires the instant the flag flips, so a 120ms request that never painted a ring is still announced as a wait. Holding the announcement back needs a real 500ms timer alongside the class binding.',
      'Do not rebuild a button\'s busy state here. The button entry already holds the label width with a grid overlay so the row cannot reflow mid-click, and keeps the disabled attribute alongside aria-busy so a second click cannot post twice. Inside a button the loader also stays a Lucide icon at size-4: the button owns an icon slot already, and at 16px nobody sees the difference between a 1.33px svg stroke and a 2px border. Above 16px, the ring.',
      'One spinner per region, at the region\'s root. Four rings turning on one screen do not say that four things are loading, they say the page is broken. If the whole screen is waiting, spin the panel that matters and leave the rest alone.',
      'Never cover the whole app shell. A spinner over the topbar and the sidebar takes away the navigation somebody could have used to leave a request that is not coming back. Scope it to the panel doing the work.',
      'A spinner has to resolve. Every one needs a branch that replaces it when the request fails — the error variant of empty-state is what goes in its place. A ring still turning at forty seconds is indistinguishable from a hung page, and the only move left is a reload, which on a form means posting it twice.',
      'Past about ten seconds, say something. The second line goes inside the role="status" that is already there, so the change is what gets announced; a new region beside it is a second thing announcing itself while the first still has nothing new to say.',
      'The label names the work, not the fact of waiting. "Loading" is the message the ring already carries. "Loading purchase orders" is what tells somebody which of the four panels on the screen is the one holding them up.',
      'x-cloak on any spinner hidden at first paint. This is the one component where the flash reads as real: a ring that shows for a frame or two on every page load looks like a load that failed and retried, not like Alpine booting.',
      'Do not reach for htmx\'s .htmx-indicator class to get the floor. htmx injects its own stylesheet, and .htmx-request .htmx-indicator sets the transition shorthand at two classes of specificity, which resets transition-delay to zero. Measured on an element carrying both delay-500 and duration-150: computed transition-delay came back 0s and duration 0.2s — htmx\'s values, not Tailwind\'s. The floor vanishes silently and the indicator flashes on every fast request.'
    ],
    anatomy: [
      ['Ring', 'size-5 rounded-full border-2 border-zinc-200 border-t-zinc-700 animate-spin. The track is the whole circle in zinc-200; border-t-zinc-700 repaints one quarter of it graphite, and animate-spin turns the box at 1s linear. Always shrink-0, always aria-hidden.'],
      ['Label', 'Real text naming the work — "Loading purchase orders", not "Loading". Visible where the panel does not already say it, sr-only where it does.'],
      ['Status region', 'The role="status" the label lives in, in the document before the wait begins, on the element that survives the swap. This is the announcement; the ring contributes nothing to it.'],
      ['Busy region', 'The panel carrying aria-busy="true" while it waits, and :inert="busy" on its content while a scrim covers it.'],
      ['Slot', 'The fixed box the spinner occupies. opacity-0 with the delay in the bound class, never display, so a 500ms floor costs no layout movement.'],
      ['Scrim', 'bg-white/70 over content that stays on screen through a refresh, so the rows underneath read as stale rather than gone.'],
      ['Escalation', 'The second line that appears past about ten seconds, inside the same status region, saying why this one is slow.']
    ],
    behaviour: [
      'It is graphite whatever it is waiting for. Colour describes what a record is doing, and a request in flight has not done anything yet.',
      'It appears at 500ms, not at zero. Most requests answer first and the ring is never painted, which is the point — the floor is what stops a register flickering on every filter change.',
      'It holds its box while it is invisible, so the row does not widen when it arrives and does not narrow when it goes.',
      'It resolves. Content replaces it, or an error replaces it, and past about ten seconds it grows a line saying why it is taking so long. It does not turn forever.',
      'Content already on screen is covered, not replaced, and the covered content goes inert so the keyboard cannot reach rows that are being swapped out.',
      'One per region. A screen with four rings on it reads as broken rather than busy.',
      'The animation keeps running under prefers-reduced-motion, because stopping it removes the only signal. The label beside it is what carries the state without motion.',
      'Inside a button, the button\'s own busy state does the work — the ring starts at size-5 and above, where a button\'s size-4 icon slot has run out.'
    ],
    a11y: [
      'The ring is aria-hidden="true". It is a shape, and a shape announces nothing worth hearing.',
      'The announcement is the text content of a role="status", never an aria-label on the ring — a live region reports what changed inside it, and a name is not content.',
      'The status region exists before the message does. A region that arrives with its text already in it has nothing to announce.',
      'aria-busy="true" sits on the region that is waiting, so the state is known and not merely drawn.',
      'Content under a scrim takes inert, so Tab cannot walk into rows that are about to be replaced and Enter cannot fire an action against them.',
      'The animation is not disabled under prefers-reduced-motion, because a frozen ring is a spinner that has stopped saying anything. The visible or sr-only label is the non-motion signal.',
      'The ten-second escalation is written into the same status region, so the change is announced rather than only rendered.',
      'Nothing inside a spinner is focusable. A Tab landing on a turning ring is a dead end, and there is no action there to take.'
    ],
    related: ['skeleton', 'progress', 'button'],
    variants: [
      { id: 'default', name: 'The spinner', code:
`<!-- The whole component. A zinc-200 track with one quarter repainted graphite by
     border-t-zinc-700, turned by animate-spin at 1s linear.

     It is borders and not a Lucide loader on purpose. A lucide glyph is a 2-unit
     stroke on a 24-unit viewBox, so it paints 1.33px inside size-4 and 3.33px
     inside size-10 — a size scale built on it grows heavier as it grows — and an
     <i data-lucide> has no box at all until createIcons() has run over it, which
     is exactly what a spinner arriving in an htmx swap cannot count on.

     The ring is aria-hidden: a turning shape resolves to nothing worth reading.
     What gets announced is the text inside the role="status", and it is text
     content rather than an aria-label because a live region reports what changed
     inside it and a name is not content. Here it is sr-only, because the panel
     around it already says what is loading. -->
<div data-kui="spinner/default" class="flex items-center gap-3">
  <span class="size-5 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
  <p role="status" class="sr-only">Loading purchase orders</p>
</div>` },

      { id: 'sizes', name: 'Sizes', code:
`<!-- Three, and the stroke moves with the box, because the stroke is what keeps
     them looking like one object. 16/2, 20/2 and 32/3 sit between one eleventh
     and one eighth of the diameter; border-4 inside size-8 is one eighth at four
     times the area and reads as a donut chart.

     Each ring here is aria-hidden with no status beside it, because this is a
     picture of three sizes rather than three things loading. In use, every one of
     them carries its own label. -->
<div data-kui="spinner/sizes" class="flex flex-wrap items-end gap-x-10 gap-y-6">
  <div class="flex flex-col items-center gap-2.5">
    <span class="flex h-8 items-center">
      <span class="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    </span>
    <span class="text-[12px]/4 text-zinc-500">size-4 · in a row or beside a control</span>
  </div>
  <div class="flex flex-col items-center gap-2.5">
    <span class="flex h-8 items-center">
      <span class="size-5 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    </span>
    <span class="text-[12px]/4 text-zinc-500">size-5 · the default, beside a label</span>
  </div>
  <div class="flex flex-col items-center gap-2.5">
    <span class="flex h-8 items-center">
      <span class="size-8 shrink-0 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    </span>
    <span class="text-[12px]/4 text-zinc-500">size-8 · centred in a panel</span>
  </div>
</div>` },

      { id: 'label', name: 'With a label', code:
`<!-- With a visible label the role="status" moves to the row and the label is its
     content. The ring stays aria-hidden and contributes nothing, and there is no
     sr-only copy underneath — the region would then hold both strings and the
     wait would be read out twice.

     Do not name the ring with aria-label instead. Resolved, a role="status" with
     aria-label and no children is a status *named* "Loading orders" whose content
     is empty: it appears, nothing inside it changed, and nothing is said.

     The label names the work. "Loading" is the message the ring already carries;
     "Loading purchase orders" says which of the four panels on the screen is the
     one holding somebody up.

     The ring is shrink-0 and the paragraph is what wraps. Without it, flex takes
     the width out of the circle instead of the sentence — measured at 390px, the
     size-4 ring in the second row came back 12.9px wide against 16px of height,
     which is not a smaller spinner but an ellipse. -->
<div data-kui="spinner/label" class="space-y-6">
  <div class="flex items-center gap-3" role="status">
    <span class="size-5 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    <span class="text-[13px]/5 text-zinc-600">Loading purchase orders</span>
  </div>

  <div class="flex items-start gap-3" role="status">
    <span class="mt-0.5 size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    <p class="text-[13px]/5 text-zinc-600">Assembling the GRN reconciliation for 01 Apr to 12 Aug. That is 14 months of receipts across five plants, so it takes a while.</p>
  </div>
</div>` },

      { id: 'panel', name: 'Centred in a panel', code:
`<!-- A region with nothing in it yet. The box is already the height the loaded
     panel will be, so the rows land without the page shuffling itself — a
     spinner in a box that collapses to its content is why a dashboard reflows
     twice on every load.

     aria-busy is on the panel. The panel is the thing that is waiting; the ring
     is only what is drawn. -->
<div data-kui="spinner/panel" class="flex min-h-64 items-center justify-center rounded-xl border border-zinc-300 bg-white p-6" aria-busy="true">
  <div class="flex flex-col items-center gap-3 text-center">
    <span class="size-8 shrink-0 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    <p role="status" class="text-[13px]/5 text-zinc-600">Loading the order register</p>
  </div>
</div>` },

      { id: 'inline', name: 'Beside a control', code:
`<!-- size-4 next to anything control-height, because a 20px ring beside a 36px
     input is louder than the input.

     None of these is a button, and that is deliberate: a button's busy state is
     already specified in the button entry, which holds the label width with a
     grid overlay so the row cannot reflow mid-click and keeps the disabled
     attribute alongside aria-busy so a second click cannot post twice. Copy that
     one rather than dropping a bare ring into a <button>.

     Each of the three has its own role="status", because each names a different
     piece of work. One region for the page would have them overwriting each
     other, and the last one to finish would be the only one ever announced. -->
<div data-kui="spinner/inline" class="max-w-md space-y-6 rounded-xl border border-zinc-300 bg-white p-4">

  <!-- inside the field's ring, where the input entry puts its icons -->
  <div>
    <label for="sp-gstin" class="mb-1.5 block text-[13px]/5 font-medium">Vendor GSTIN</label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="sp-gstin" value="27AABCS1429B1ZX" class="w-full min-w-0 bg-transparent px-3 py-2 font-mono text-[13px]/5 outline-none">
      <span class="mr-3 size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    </div>
    <p role="status" class="mt-1.5 text-[12px]/4 text-zinc-500">Checking this GSTIN against the GST portal</p>
  </div>

  <!-- in a cell, where the figure will be. Right-aligned into the same column
       the number lands in, so the row does not shift when it arrives. -->
  <div class="border-t border-zinc-100 pt-4">
    <div class="flex items-baseline justify-between gap-4">
      <span class="text-[13px]/5 text-zinc-600">Committed value, all plants</span>
      <span class="flex h-5 items-center">
        <span class="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
      </span>
    </div>
    <p role="status" class="mt-1 text-[12px]/4 text-zinc-500">Recalculating committed value</p>
  </div>

  <!-- a background refresh of something already shown. The stale figure stays
       legible; the ring says a newer one is on its way. -->
  <div class="border-t border-zinc-100 pt-4">
    <p class="text-[20px]/7 font-semibold tracking-tight tabular-nums">1,842</p>
    <div class="mt-1 flex items-center gap-2">
      <span class="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
      <span role="status" class="text-[12px]/4 text-zinc-500">Refreshing open orders, last read 11:04</span>
    </div>
  </div>
</div>` },

      { id: 'overlay', name: 'Over content already on screen', code:
`<!-- A refresh of rows somebody is already reading. Replacing them with a centred
     ring would throw away the scroll position and collapse the panel, so the rows
     stay and a bg-white/70 scrim goes over them.

     The scrim stops the mouse and nothing else, which is why the content wrapper
     takes :inert="busy" — without it Tab walks straight into rows that are being
     replaced and Enter fires their actions against data on the way out. inert is
     a boolean attribute Alpine knows about, so a false value removes it rather
     than writing inert="false", which is a truthy string.

     aria-busy is on the panel, and the sr-only status is outside the scrim so it
     stays in the document across the whole cycle and reports both ends of it.

     busy starts true so the scrim is already there at first paint rather than
     appearing over rows somebody has begun reading, and x-init runs the cycle
     once so it resolves. In an application the swap is what clears it. -->
<div data-kui="spinner/overlay" class="relative overflow-hidden rounded-xl border border-zinc-300 bg-white"
     x-data="{ busy: true, run() { this.busy = true; setTimeout(() => this.busy = false, 2400) } }"
     x-init="run()"
     :aria-busy="busy">

  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
    <p class="text-[14px]/5 font-semibold">Order register</p>
    <button type="button" @click="run()" :disabled="busy"
            class="inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[12px]/4 font-medium hover:bg-zinc-100 disabled:text-zinc-400">
      <i data-lucide="rotate-cw" class="size-3.5 text-zinc-600"></i>Refresh
    </button>
  </div>

  <div :inert="busy">
    <table class="w-full text-[13px]/5">
      <thead>
        <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
          <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
          <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
          <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-zinc-100">
          <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
          <td class="px-4 py-2.5">Sharma Extrusions</td>
          <td class="px-4 py-2.5 text-right tabular-nums">₹18,42,000</td>
        </tr>
        <tr class="border-b border-zinc-100">
          <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1194</td>
          <td class="px-4 py-2.5">Gujarat Polymers Ltd</td>
          <td class="px-4 py-2.5 text-right tabular-nums">₹4,16,500</td>
        </tr>
        <tr>
          <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1203</td>
          <td class="px-4 py-2.5">Nashik Steel Traders</td>
          <td class="px-4 py-2.5 text-right tabular-nums">₹9,07,250</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div x-show="busy" x-cloak class="absolute inset-0 z-10 flex items-center justify-center bg-white/70 px-4">
    <span class="flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-3.5 py-2 shadow-sm">
      <span class="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
      <span class="text-[12px]/4 font-medium text-zinc-600">Refreshing 24 orders</span>
    </span>
  </div>

  <p role="status" class="sr-only" x-text="busy ? 'Refreshing the order register' : 'Order register updated'"></p>
</div>` },

      { id: 'delayed', name: 'The 500ms floor', code:
`<!-- Both buttons run the same request; only one of them is slow enough to be
     worth a spinner. Below about 300ms the ring answers before the eye has
     resolved it and all anyone sees is a flicker where the number was.

     The floor needs no timer. The ring sits at opacity-0 and picks up
     transition-opacity delay-500 only while the flag is on, so the fade does not
     begin until 500ms after the click. A request that answers in 120ms turns the
     flag off again during the delay, the computed opacity goes from 0 to 0, and
     nothing was ever painted. Measured: opacity never left 0 on the fast button
     and reached 1 at 683ms on the slow one.

     The delay is in the bound class, not the base class. Left in the base it
     delays the fade *out* too — measured, the ring was still at full opacity
     520ms after a 1.6s request had landed its content, which reads as a panel
     still loading something it has finished drawing. Written this way it was
     gone 196ms after the work stopped.

     opacity and not x-show, because opacity keeps the box. A spinner that
     appears with display widens the row 500ms after the click and moves the
     button out from under the cursor.

     The floor cannot reach the live region: x-text fires the moment the flag
     flips, so the announcement gets its own 500ms timer. Without it a 120ms
     request that never painted a ring is still announced as a wait. -->
<div data-kui="spinner/delayed" class="rounded-xl border border-zinc-300 bg-white p-4"
     x-data="{
       busy: false, late: false, timer: null,
       run(ms) {
         this.busy = true; this.late = false;
         clearTimeout(this.timer);
         this.timer = setTimeout(() => { this.late = this.busy }, 500);
         setTimeout(() => { this.busy = false; this.late = false; clearTimeout(this.timer) }, ms);
       }
     }">
  <p class="text-[13px]/5 font-medium">Recalculate committed value</p>
  <p class="mt-1 text-[12px]/4 text-zinc-500">One plant answers in 120ms and never shows a ring. All five take 1.6s and do.</p>

  <div class="mt-3 flex flex-wrap items-center gap-3">
    <button type="button" @click="run(120)"
            class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Nashik only</button>
    <button type="button" @click="run(1600)"
            class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">All five plants</button>

    <span class="flex items-center gap-2 opacity-0 transition-opacity delay-0 duration-150"
          :class="busy && 'opacity-100 delay-500'">
      <span class="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
      <span class="text-[13px]/5 text-zinc-600">Recalculating</span>
    </span>
  </div>

  <p role="status" class="sr-only" x-text="late ? 'Recalculating committed value' : ''"></p>
</div>` },

      { id: 'states', name: 'Running, slow, failed', code:
`<!-- A spinner has to resolve. These are the three ends of one wait.

     Past about ten seconds the second line goes *inside* the role="status" that
     is already there, so what gets announced is the change. A second region
     beside it would be a new thing announcing itself while the first still has
     nothing new to say.

     The failure is not a spinner in a different colour — there is no danger
     spinner. The ring is gone and the error variant of empty-state is what
     stands in its place, at the size the panel already was, because a ring still
     turning at forty seconds is indistinguishable from a hung page. -->
<div data-kui="spinner/states" class="grid gap-4 sm:grid-cols-3">

  <div class="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white p-5 text-center" aria-busy="true">
    <span class="size-6 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    <p role="status" class="text-[13px]/5 text-zinc-600">Loading the order register</p>
  </div>

  <div class="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white p-5 text-center" aria-busy="true">
    <span class="size-6 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    <div role="status">
      <p class="text-[13px]/5 text-zinc-600">Loading the order register</p>
      <p class="mt-1 text-[12px]/4 text-zinc-500">Still working. 14 months of receipts is a wide range.</p>
    </div>
  </div>

  <div class="flex min-h-44 flex-col items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white p-5 text-center">
    <span class="flex size-8 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
      <i data-lucide="alert-circle" class="size-4 text-red-600"></i>
    </span>
    <p class="mt-1 text-[13px]/5 font-medium">The register did not load</p>
    <p class="text-[12px]/4 text-zinc-500">Timed out after 30 seconds. Nothing was changed.</p>
    <button type="button" class="mt-1 inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[12px]/4 font-medium hover:bg-zinc-100">
      <i data-lucide="rotate-cw" class="size-3.5 text-zinc-600"></i>Retry
    </button>
  </div>
</div>` },

      { id: 'django', name: 'Django and htmx', code:
`<!-- views.py
     def order_register(request):
         # the page answers immediately with a spinner in the panel, and the
         # panel fetches itself. Nothing on this path waits on the query.
         return render(request, 'orders/register.html')

     def order_register_rows(request):
         try:
             orders = (PurchaseOrder.objects
                       .select_related('vendor')
                       .filter(plant=request.user.plant)
                       .order_by('-raised_on')[:50])
         except DatabaseError:
             # the failure renders the same fragment slot, so the swap always
             # replaces the spinner with something. A view that 500s leaves the
             # ring turning until somebody reloads.
             return render(request, 'orders/_register_failed.html', status=200)
         # the fragment only: no base template, no <html>
         return render(request, 'orders/_register_rows.html', {'orders': orders})

     urls.py
         path('orders/', views.order_register, name='order-register'),
         path('orders/rows/', views.order_register_rows, name='order-register-rows'),

     A deferred load needs no indicator machinery at all. The spinner is what the
     server rendered into the panel and hx-swap="outerHTML" is what removes it, so
     there is nothing to delay: the reason the panel is deferred is that the query
     is slow.

     Do not reach for htmx's .htmx-indicator class for the 500ms floor on the
     refresh. htmx injects its own stylesheet, and .htmx-request .htmx-indicator
     sets the transition shorthand at two classes of specificity, which resets
     transition-delay to zero. Measured on an element carrying both delay-500 and
     duration-150: computed transition-delay came back 0s and duration 0.2s —
     htmx's values, not Tailwind's, and the floor is gone without a warning. Drive
     the opacity off an Alpine flag instead, as below.

     Bind htmx events in kebab case. htmx fires both htmx:beforeRequest and
     htmx:before-request, but the HTML parser lowercases attribute names, so
     @htmx:beforeRequest is stored as @htmx:beforerequest and listens for an event
     nothing dispatches. Verified: with both spellings on one element, only the
     kebab listener ran.

     The listeners sit on the header, not on the panel root, so only requests that
     started at the Refresh button bubble through them. On the root they would also
     catch the deferred first load and put the refresh scrim over the spinner that
     is already there.

     role="status" is on the panel, which survives the swap. A status region that
     arrives inside a fragment with its message already in it never changed, so
     there is nothing for a screen reader to report. -->

{# orders/register.html #}
<div data-kui="spinner/django" id="register" class="relative overflow-hidden rounded-xl border border-zinc-300 bg-white"
     x-data="{ busy: false }" :aria-busy="busy">

  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3"
       @htmx:before-request="busy = true"
       @htmx:after-request="busy = false">
    <h2 class="text-[14px]/5 font-semibold">Order register</h2>
    <button type="button"
            hx-get="{% url 'order-register-rows' %}"
            hx-target="#register-rows" hx-swap="outerHTML"
            class="inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[12px]/4 font-medium hover:bg-zinc-100">
      <i data-lucide="rotate-cw" class="size-3.5 text-zinc-600"></i>Refresh
    </button>
  </div>

  <!-- the deferred first load. This div is the spinner and it is also what
       hx-swap="outerHTML" replaces, so nothing has to remove it. -->
  <div id="register-rows"
       hx-get="{% url 'order-register-rows' %}"
       hx-trigger="load"
       hx-swap="outerHTML"
       class="flex min-h-64 items-center justify-center p-6">
    <div class="flex flex-col items-center gap-3 text-center">
      <span class="size-8 shrink-0 animate-spin rounded-full border-[3px] border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
      <p class="text-[13px]/5 text-zinc-600">Loading the order register</p>
    </div>
  </div>

  <!-- the refresh scrim, over rows that are already on screen -->
  <div x-show="busy" x-cloak class="absolute inset-0 z-10 flex items-center justify-center bg-white/70 px-4">
    <span class="flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-3.5 py-2 shadow-sm">
      <span class="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
      <span class="text-[12px]/4 font-medium text-zinc-600">Refreshing</span>
    </span>
  </div>

  <p role="status" class="sr-only"
     x-text="busy ? 'Refreshing the order register' : ''"></p>
</div>

{# orders/_register_rows.html — the whole response and nothing around it,
   keeping the id so the next Refresh still has a target #}
<div id="register-rows" :inert="busy">
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
      </tr>
    </thead>
    <tbody>
      {% for o in orders %}
        <tr class="border-b border-zinc-200 last:border-0">
          <td class="px-4 py-2.5 font-medium tabular-nums">{{ o.number }}</td>
          <td class="px-4 py-2.5">{{ o.vendor.name }}</td>
          <td class="px-4 py-2.5 text-right tabular-nums">₹{{ o.amount|intcomma }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
</div>

{# orders/_register_failed.html — the spinner resolved into an error, in the
   same slot and at the same height, so the panel does not change size #}
<div id="register-rows" class="flex min-h-64 flex-col items-center justify-center gap-2 p-6 text-center">
  <span class="flex size-8 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="alert-circle" class="size-4 text-red-600"></i>
  </span>
  <p class="mt-1 text-[13px]/5 font-medium">The register did not load</p>
  <p class="text-[12px]/4 text-zinc-500">Nothing was changed.</p>
  <button type="button" hx-get="{% url 'order-register-rows' %}"
          hx-target="#register-rows" hx-swap="outerHTML"
          class="mt-1 inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-[12px]/4 font-medium hover:bg-zinc-100">
    <i data-lucide="rotate-cw" class="size-3.5 text-zinc-600"></i>Retry
  </button>
</div>` }
    ]
  }
);
