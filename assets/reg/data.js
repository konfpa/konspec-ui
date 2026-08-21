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
<div x-data="{
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
     class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
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
<div x-data="{
       rows: [
         { po: 'PO-24-1187', vendor: 'Sharma Extrusions', amount: '₹18,42,000', status: 'Open', dot: 'bg-zinc-700' },
         { po: 'PO-24-1191', vendor: 'Nashik Steel Traders', amount: '₹4,68,500', status: 'Approved', dot: 'bg-amber-500' },
         { po: 'PO-24-1194', vendor: 'Gujarat Polymers Ltd', amount: '₹27,10,400', status: 'Overdue', dot: 'bg-red-600' }
       ]
     }"
     class="rounded-xl border border-zinc-200 bg-white">
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
<div x-data="{
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
     class="rounded-xl border border-zinc-200 bg-white">

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
      <button type="button" class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-50">Export</button>
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
`<div x-data="{
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
     class="overflow-hidden rounded-xl border border-zinc-200 bg-white">

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
<div id="register" class="rounded-xl border border-zinc-200 bg-white">

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
    related: ['data-table', 'table', 'empty-state'],
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
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
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
<script src="https://unpkg.com/chart.js@4.4.7/dist/chart.umd.js"></script>
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
`<div class="rounded-xl border border-zinc-200 bg-white p-5"
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
`<div class="rounded-xl border border-zinc-200 bg-white p-5"
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
`<div class="rounded-xl border border-zinc-200 bg-white p-5"
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
`<div class="rounded-xl border border-zinc-200 bg-white p-5"
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
`<div class="rounded-xl border border-zinc-200 bg-white p-5"
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
`<div class="max-w-xs rounded-xl border border-zinc-200 bg-white p-4"
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
`<div class="rounded-xl border border-zinc-200 bg-white p-5">
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

<div class="rounded-xl border border-zinc-200 bg-white p-5"
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
    related: ['stat-card', 'spinner', 'skeleton'],
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
    related: ['empty-state', 'spinner', 'progress'],
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
<div class="flex items-center gap-3">
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
<div class="flex flex-wrap items-end gap-x-10 gap-y-6">
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
<div class="space-y-6">
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
<div class="flex min-h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white p-6" aria-busy="true">
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
<div class="max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-4">

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
<div class="relative overflow-hidden rounded-xl border border-zinc-200 bg-white"
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
<div class="rounded-xl border border-zinc-200 bg-white p-4"
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
<div class="grid gap-4 sm:grid-cols-3">

  <div class="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white p-5 text-center" aria-busy="true">
    <span class="size-6 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    <p role="status" class="text-[13px]/5 text-zinc-600">Loading the order register</p>
  </div>

  <div class="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white p-5 text-center" aria-busy="true">
    <span class="size-6 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
    <div role="status">
      <p class="text-[13px]/5 text-zinc-600">Loading the order register</p>
      <p class="mt-1 text-[12px]/4 text-zinc-500">Still working. 14 months of receipts is a wide range.</p>
    </div>
  </div>

  <div class="flex min-h-44 flex-col items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white p-5 text-center">
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
<div id="register" class="relative overflow-hidden rounded-xl border border-zinc-200 bg-white"
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
        <tr class="border-b border-zinc-100 last:border-0">
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
          class="mt-1 inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[12px]/4 font-medium hover:bg-zinc-100">
    <i data-lucide="rotate-cw" class="size-3.5 text-zinc-600"></i>Retry
  </button>
</div>` }
    ]
  }
);
