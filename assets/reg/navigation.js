register(
  {
    id: 'tabs', name: 'Tabs', category: 'navigation',
    description: 'Switches between views of the same record without leaving the page. The panel below changes; the row above is a widget, not a menu, and the keyboard has to know the difference.',
    when: 'Two to seven sibling views of one thing — an order and its lines, receipts and history. If the views are unrelated, use the sidebar instead. If each view is its own URL, this is navigation and belongs in the django variant.',
    notes: [
      'role="tab" only when the panel is in this document. If each tab is a URL, it is a nav of links with aria-current="page", and nothing else. Putting role="tab" on a link promises a screen reader that arrows will switch panels and Tab will jump into one, and then neither happens.',
      'A tab carries aria-selected, not aria-current. They look interchangeable and are not: aria-current marks where you are in a set of destinations, aria-selected marks which of several panels is showing.',
      'Exactly one tab in the tab order — the selected one gets tabindex 0, the rest get -1. Without this roving tabindex, Tab walks every tab in the row and the panel is seven presses away, which is the opposite of what the pattern exists to do.',
      'Bind the arrow keys. A tablist without them is a row of buttons that only works with a mouse, whatever the roles say.',
      'Activate automatically only when the panels are already in the page. A tab that fetches uses manual activation, or arrowing from the first tab to the seventh fires seven requests and the user reads whichever one lands last.',
      'Generate the ids with $id(). Static ids look fine until a second copy of the same tab set lands on one page, and then two tabs point aria-controls at one panel and nothing reports an error.',
      'Never wrap the row onto a second line. It scrolls sideways, with the next tab peeking, because a second line of tabs reads as a different control.',
      'Do not colour the inactive tabs. They are text-zinc-600 and nothing else; the active one is the only one carrying weight.',
      'Counts go in a pill on the tab, not in the label, and the pill is tabular-nums so the row does not jitter when a number changes.',
      'x-cloak on every panel that is not the one showing at first paint, or all of them are visible for the moment before Alpine boots.'
    ],
    anatomy: [
      ['Tablist', 'The row itself, holding the arrow-key bindings and a label that says what the set is for.'],
      ['Tab', 'A button when the panel is in this document, a link when the tab is a URL. The two are not interchangeable.'],
      ['Active marker', 'A 2px zinc-900 underline plus the weight change, and nothing else. Inactive tabs are text-zinc-600.'],
      ['Count or dot', 'A tabular-nums pill for a number, a 6px dot for a state. Colour on the dot only, per the status rule.'],
      ['Panel', 'The region below, tied to its tab by id in both directions, and focusable so it can be reached when it holds no controls.'],
      ['Overflow', 'The scrolling strip a long row becomes on a narrow screen, with the active tab scrolled into view rather than left off the edge.']
    ],
    behaviour: [
      'Only the active tab carries weight and colour. Tinting the inactive ones destroys the one distinction the control exists to make.',
      'Two to seven tabs. Past that the row stops being scannable, and views that numerous are usually unrelated, which makes them sidebar entries.',
      'Left and right arrows move between tabs, Home and End jump to the ends, and Tab leaves the row entirely and lands in the panel. That last one is the whole point of the pattern: seven tabs cost one Tab press, not seven.',
      'Activation is automatic when the panels are local, so an arrow both moves and switches. When a tab fetches its panel, the arrow moves focus only and Enter or Space commits, which a native button already does.',
      'The row scrolls rather than wraps, and moving by keyboard brings the tab into view. A focused tab off the edge of the strip is a focus ring nobody can see.',
      'Switching does not reload and does not lose the panel scroll position. Where the tab is part of the record\'s address it goes in the query string with replaceState, not pushState, so Back leaves the record instead of undoing a tab.'
    ],
    a11y: [
      'role="tablist" on the row, role="tab" on each control, role="tabpanel" on each region, and an aria-label on the tablist naming the set.',
      'Each tab carries aria-selected and aria-controls; each panel carries aria-labelledby pointing back. Both directions, or the panel is announced without its name.',
      'Roving tabindex: the selected tab is 0, every other tab is -1, so Tab enters the row once and leaves into the panel.',
      'Arrow keys move, Home and End jump, and every one of them calls preventDefault so the page does not scroll underneath.',
      'The panel takes tabindex="0" so it is reachable when it contains nothing focusable, which is most panels made of text.',
      'Ids come from $id(), so two tab sets on one page cannot cross-wire their aria-controls.'
    ],
    related: ['page-header', 'accordion', 'sidebar-nav'],
    variants: [
      { id: 'underline', name: 'Underline', code:
`<!-- The default. Automatic activation, because all four panels are already in
     the page and there is nothing to wait for.

     tabEls() filters on [role=tab] rather than reading children: x-for leaves a
     <template> in the DOM and it counts as an element child. -->
<div x-id="['tab', 'panel']"
     x-data="{
       tab: 'lines',
       items: [
         { id: 'summary',  label: 'Summary' },
         { id: 'lines',    label: 'Lines',    count: 14 },
         { id: 'receipts', label: 'Receipts', count: 3 },
         { id: 'history',  label: 'History' }
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
  <div class="border-b border-zinc-200">
    <div x-ref="list" role="tablist" aria-label="Purchase order sections"
         @keydown.arrow-right.prevent="move(1)"
         @keydown.arrow-left.prevent="move(-1)"
         @keydown.home.prevent="pick(items[0].id)"
         @keydown.end.prevent="pick(items[items.length - 1].id)"
         class="-mb-px flex gap-6">
      <template x-for="t in items" :key="t.id">
        <button type="button" role="tab" :data-tab="t.id"
                :id="$id('tab', t.id)" :aria-controls="$id('panel', t.id)"
                :aria-selected="tab === t.id ? 'true' : 'false'"
                :tabindex="tab === t.id ? 0 : -1"
                @click="pick(t.id)"
                class="flex shrink-0 items-center gap-2 rounded-t border-b-2 pb-2.5 text-[13px]/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="tab === t.id ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'">
          <span x-text="t.label"></span>
          <template x-if="t.count">
            <span class="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300" x-text="t.count"></span>
          </template>
        </button>
      </template>
    </div>
  </div>

  <div class="pt-4 text-[14px]/5">
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'summary')" :aria-labelledby="$id('tab', 'summary')"
         x-show="tab === 'summary'" x-cloak
         class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p class="text-zinc-600">PO-24-1187 raised for Gujarat Polymers Ltd on 4 August, payment 45 days from GRN.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'lines')" :aria-labelledby="$id('tab', 'lines')"
         x-show="tab === 'lines'"
         class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p>14 lines, <span class="font-medium tabular-nums">₹18,42,000</span> before tax.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'receipts')" :aria-labelledby="$id('tab', 'receipts')"
         x-show="tab === 'receipts'" x-cloak
         class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p class="text-zinc-600">3 GRNs posted, 2 lines still short.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'history')" :aria-labelledby="$id('tab', 'history')"
         x-show="tab === 'history'" x-cloak
         class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p class="text-zinc-600">Approved by R. Menon on 5 August, revised once.</p>
    </div>
  </div>
</div>` },

      { id: 'pill', name: 'Pill', code:
`<!-- Same widget, different marker: a white pill on a zinc-100 track instead of
     an underline. Reach for it when the tabs filter a list rather than section a
     record, and when the row has to sit beside other controls without a rule
     running under it. -->
<div x-id="['tab', 'panel']"
     x-data="{
       tab: 'open',
       items: [
         { id: 'open',     label: 'Open' },
         { id: 'awaiting', label: 'Awaiting GRN' },
         { id: 'closed',   label: 'Closed' }
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
  <div x-ref="list" role="tablist" aria-label="Order status"
       @keydown.arrow-right.prevent="move(1)"
       @keydown.arrow-left.prevent="move(-1)"
       @keydown.home.prevent="pick(items[0].id)"
       @keydown.end.prevent="pick(items[items.length - 1].id)"
       class="inline-flex rounded-lg bg-zinc-100 p-1">
    <template x-for="t in items" :key="t.id">
      <button type="button" role="tab" :data-tab="t.id"
              :id="$id('tab', t.id)" :aria-controls="$id('panel', t.id)"
              :aria-selected="tab === t.id ? 'true' : 'false'"
              :tabindex="tab === t.id ? 0 : -1"
              @click="pick(t.id)"
              class="rounded-md px-3 py-1.5 text-[13px]/5 whitespace-nowrap focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="tab === t.id ? 'bg-white font-medium text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'"
              x-text="t.label"></button>
    </template>
  </div>

  <div class="pt-4 text-[14px]/5">
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'open')" :aria-labelledby="$id('tab', 'open')"
         x-show="tab === 'open'" class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p>48 orders open, <span class="tabular-nums">₹4,12,60,000</span> committed.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'awaiting')" :aria-labelledby="$id('tab', 'awaiting')"
         x-show="tab === 'awaiting'" x-cloak class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p class="text-zinc-600">27 orders delivered but not yet receipted.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'closed')" :aria-labelledby="$id('tab', 'closed')"
         x-show="tab === 'closed'" x-cloak class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p class="text-zinc-600">73 orders closed this quarter.</p>
    </div>
  </div>
</div>` },

      { id: 'scrollable', name: 'Scrollable', code:
`<!-- Seven tabs on a phone. The strip scrolls and the next tab peeks, which is
     what stops it reading as a row that broke.

     focus() scrolls a hidden element into view on both axes, which on a long
     page means the whole document jumps to the tab strip. So focus with
     preventScroll and do the horizontal scroll by hand, on the strip only. -->
<div x-id="['tab', 'panel']"
     x-data="{
       tab: 'grn',
       items: [
         { id: 'overview', label: 'Overview' },
         { id: 'po',       label: 'Purchase orders' },
         { id: 'req',      label: 'Requisitions' },
         { id: 'grn',      label: 'Goods receipt' },
         { id: 'inv',      label: 'Invoices' },
         { id: 'vendors',  label: 'Vendors' },
         { id: 'rc',       label: 'Rate contracts' }
       ],
       tabEls() { return Array.from(this.$refs.list.querySelectorAll('[role=tab]')); },
       init() { this.$nextTick(() => this.reveal(this.tab)); },
       move(step) {
         const n = this.items.length;
         const i = this.items.findIndex(t => t.id === this.tab);
         this.pick(this.items[(i + step + n) % n].id);
       },
       pick(id) {
         this.tab = id;
         this.$nextTick(() => {
           const el = this.tabEls().find(e => e.dataset.tab === id);
           if (el) el.focus({ preventScroll: true });
           this.reveal(id);
         });
       },
       /* scrollIntoView by hand, so only the strip moves and the neighbour
          still peeks by 16px */
       reveal(id) {
         const s = this.$refs.strip, el = this.tabEls().find(e => e.dataset.tab === id);
         if (!el) return;
         const a = el.getBoundingClientRect(), b = s.getBoundingClientRect();
         if (a.left < b.left + 16) s.scrollBy({ left: a.left - b.left - 16 });
         else if (a.right > b.right - 16) s.scrollBy({ left: a.right - b.right + 16 });
       }
     }">
  <div x-ref="strip" class="overflow-x-auto border-b border-zinc-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <div x-ref="list" role="tablist" aria-label="Procurement sections"
         @keydown.arrow-right.prevent="move(1)"
         @keydown.arrow-left.prevent="move(-1)"
         @keydown.home.prevent="pick(items[0].id)"
         @keydown.end.prevent="pick(items[items.length - 1].id)"
         class="-mb-px flex w-max gap-6">
      <template x-for="t in items" :key="t.id">
        <button type="button" role="tab" :data-tab="t.id"
                :id="$id('tab', t.id)" :aria-controls="$id('panel', 'all')"
                :aria-selected="tab === t.id ? 'true' : 'false'"
                :tabindex="tab === t.id ? 0 : -1"
                @click="pick(t.id)"
                class="shrink-0 whitespace-nowrap rounded-t border-b-2 pb-2.5 text-[13px]/5 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-zinc-700/15"
                :class="tab === t.id ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'"
                x-text="t.label"></button>
      </template>
    </div>
  </div>

  <!-- one panel whose contents change, so aria-labelledby follows the selection -->
  <div role="tabpanel" tabindex="0" :id="$id('panel', 'all')" :aria-labelledby="$id('tab', tab)"
       class="rounded-lg pt-4 text-[14px]/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <p class="text-zinc-600">Showing
      <span class="font-medium text-zinc-900" x-text="items.find(t => t.id === tab).label"></span>.
      On a narrow screen, drag the strip or use the arrow keys.</p>
  </div>
</div>` },

      { id: 'vertical', name: 'Vertical', code:
`<!-- For a settings page, where the labels are phrases rather than nouns and the
     list is long enough that a row would scroll. Up and down arrows instead of
     left and right, and aria-orientation says so.

     The marker is the same 2px zinc-900 rule the horizontal variants use, only
     turned on its side. The zinc-100 fill is the second half of the statement
     and never the whole of it: drop these tabs onto the zinc-100 page surface
     and a fill-only marker measures 1.00 against its background, which is not
     faint but invisible. -->
<div x-id="['tab', 'panel']"
     x-data="{
       tab: 'approvals',
       items: [
         { id: 'general',   label: 'General' },
         { id: 'approvals', label: 'Approval limits' },
         { id: 'numbering', label: 'Document numbering' },
         { id: 'tax',       label: 'Tax and HSN' },
         { id: 'users',     label: 'Users and roles' }
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
     }"
     class="grid gap-6 sm:grid-cols-[190px_minmax(0,1fr)]">
  <div x-ref="list" role="tablist" aria-orientation="vertical" aria-label="Settings sections"
       @keydown.arrow-down.prevent="move(1)"
       @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="pick(items[0].id)"
       @keydown.end.prevent="pick(items[items.length - 1].id)"
       class="flex flex-col gap-0.5">
    <template x-for="t in items" :key="t.id">
      <button type="button" role="tab" :data-tab="t.id"
              :id="$id('tab', t.id)" :aria-controls="$id('panel', t.id)"
              :aria-selected="tab === t.id ? 'true' : 'false'"
              :tabindex="tab === t.id ? 0 : -1"
              @click="pick(t.id)"
              class="rounded-r-lg border-l-2 px-3 py-2 text-left text-[13px]/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="tab === t.id ? 'border-zinc-900 bg-zinc-100 font-medium text-zinc-900' : 'border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'"
              x-text="t.label"></button>
    </template>
  </div>

  <div class="min-w-0 text-[14px]/5">
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'general')" :aria-labelledby="$id('tab', 'general')"
         x-show="tab === 'general'" x-cloak class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <h3 class="text-[14px]/5 font-semibold">General</h3>
      <p class="mt-1.5 text-zinc-600">Company name, registered address and the financial year start.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'approvals')" :aria-labelledby="$id('tab', 'approvals')"
         x-show="tab === 'approvals'" class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <h3 class="text-[14px]/5 font-semibold">Approval limits</h3>
      <p class="mt-1.5 text-zinc-600">Orders above <span class="font-medium tabular-nums text-zinc-900">₹5,00,000</span> need a second approval.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'numbering')" :aria-labelledby="$id('tab', 'numbering')"
         x-show="tab === 'numbering'" x-cloak class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <h3 class="text-[14px]/5 font-semibold">Document numbering</h3>
      <p class="mt-1.5 text-zinc-600">PO-YY-nnnn, reset every financial year.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'tax')" :aria-labelledby="$id('tab', 'tax')"
         x-show="tab === 'tax'" x-cloak class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <h3 class="text-[14px]/5 font-semibold">Tax and HSN</h3>
      <p class="mt-1.5 text-zinc-600">Default GST rate per HSN code, applied when a line has none of its own.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'users')" :aria-labelledby="$id('tab', 'users')"
         x-show="tab === 'users'" x-cloak class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <h3 class="text-[14px]/5 font-semibold">Users and roles</h3>
      <p class="mt-1.5 text-zinc-600">14 users, 4 roles. Buyers cannot approve their own orders.</p>
    </div>
  </div>
</div>` },

      { id: 'url', name: 'Linkable', code:
`<!-- The tab becomes part of the record's address, so a link to "the receipts of
     PO-24-1187" exists and a reload lands where you left.

     replaceState, not pushState. With pushState, Back walks the user through
     every tab they touched before it finally leaves the record, which is not
     what Back means to anyone. If a tab genuinely is a place you can go back
     to, it is a page, and that is the django variant. -->
<div x-id="['tab', 'panel']"
     x-data="{
       tab: 'lines',
       items: [
         { id: 'lines',    label: 'Lines' },
         { id: 'receipts', label: 'Receipts' },
         { id: 'history',  label: 'History' }
       ],
       tabEls() { return Array.from(this.$refs.list.querySelectorAll('[role=tab]')); },
       init() {
         const q = new URLSearchParams(location.search).get('tab');
         if (this.items.some(t => t.id === q)) this.tab = q;
       },
       move(step) {
         const n = this.items.length;
         const i = this.items.findIndex(t => t.id === this.tab);
         this.pick(this.items[(i + step + n) % n].id);
       },
       pick(id) {
         this.tab = id;
         const u = new URL(location.href);
         u.searchParams.set('tab', id);
         history.replaceState(null, '', u);
         this.$nextTick(() => {
           const el = this.tabEls().find(e => e.dataset.tab === id);
           if (el) el.focus();
         });
       }
     }">
  <div class="border-b border-zinc-200">
    <div x-ref="list" role="tablist" aria-label="Purchase order sections"
         @keydown.arrow-right.prevent="move(1)"
         @keydown.arrow-left.prevent="move(-1)"
         @keydown.home.prevent="pick(items[0].id)"
         @keydown.end.prevent="pick(items[items.length - 1].id)"
         class="-mb-px flex gap-6">
      <template x-for="t in items" :key="t.id">
        <button type="button" role="tab" :data-tab="t.id"
                :id="$id('tab', t.id)" :aria-controls="$id('panel', t.id)"
                :aria-selected="tab === t.id ? 'true' : 'false'"
                :tabindex="tab === t.id ? 0 : -1"
                @click="pick(t.id)"
                class="shrink-0 rounded-t border-b-2 pb-2.5 text-[13px]/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="tab === t.id ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'"
                x-text="t.label"></button>
      </template>
    </div>
  </div>

  <div class="pt-4 text-[14px]/5">
    <template x-for="t in items" :key="t.id">
      <div role="tabpanel" tabindex="0" :id="$id('panel', t.id)" :aria-labelledby="$id('tab', t.id)"
           x-show="tab === t.id" x-cloak
           class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <p class="text-zinc-600">
          <span class="font-medium text-zinc-900" x-text="t.label"></span> of PO-24-1187.
          The address now ends <code class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px]/4 text-zinc-600" x-text="'?tab=' + t.id"></code>.
        </p>
      </div>
    </template>
  </div>
</div>` },

      { id: 'lazy', name: 'Server-loaded panels', code:
`<!-- Manual activation, because each tab is a request. With automatic
     activation, arrowing from the first tab to the fourth fires four fetches
     and the user reads whichever one happens to land last. So the arrows move
     focus only, and Enter or Space commits — which a real <button> already does
     for free, so there is nothing to bind.

     cursor is where focus is, tab is what is showing. Only in automatic
     activation are those the same thing, which is why the other variants can
     get away with one variable.

     The hx- attributes and the panel id are written out rather than generated
     with $id(): htmx reads them when it processes the element, and that is not
     guaranteed to be after Alpine has bound them. Two of these on one page need
     their ids changed by hand. -->
<div x-data="{
       tab: 'summary',
       cursor: 'summary',
       items: [
         { id: 'summary',  label: 'Summary' },
         { id: 'lines',    label: 'Lines' },
         { id: 'receipts', label: 'Receipts' },
         { id: 'history',  label: 'History' }
       ],
       tabEls() { return Array.from(this.$refs.list.querySelectorAll('[role=tab]')); },
       move(step) {
         const n = this.items.length;
         const i = this.items.findIndex(t => t.id === this.cursor);
         this.focusTab(this.items[(i + step + n) % n].id);
       },
       focusTab(id) {
         this.cursor = id;
         this.$nextTick(() => {
           const el = this.tabEls().find(e => e.dataset.tab === id);
           if (el) el.focus();
         });
       },
       pick(id) { this.tab = id; this.cursor = id; }
     }">
  <div class="border-b border-zinc-200">
    <div x-ref="list" role="tablist" aria-label="Purchase order sections"
         @keydown.arrow-right.prevent="move(1)"
         @keydown.arrow-left.prevent="move(-1)"
         @keydown.home.prevent="focusTab(items[0].id)"
         @keydown.end.prevent="focusTab(items[items.length - 1].id)"
         class="-mb-px flex gap-6">
      <template x-for="t in items" :key="t.id">
        <button type="button" role="tab" :data-tab="t.id"
                :id="'po-tab-' + t.id" aria-controls="po-panel"
                :aria-selected="tab === t.id ? 'true' : 'false'"
                :tabindex="cursor === t.id ? 0 : -1"
                @click="pick(t.id)"
                :hx-get="'/orders/1187/' + t.id + '/'"
                hx-target="#po-panel" hx-swap="innerHTML" hx-indicator="#po-panel"
                class="shrink-0 rounded-t border-b-2 pb-2.5 text-[13px]/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="tab === t.id ? 'border-zinc-900 font-semibold text-zinc-900' : 'border-transparent text-zinc-600 hover:text-zinc-900'"
                x-text="t.label"></button>
      </template>
    </div>
  </div>

  <!-- hx-indicator puts .htmx-request on this panel for the length of the
       request, which is enough to fade it without any custom CSS -->
  <div id="po-panel" role="tabpanel" tabindex="0" :aria-labelledby="'po-tab-' + tab" aria-live="polite"
       class="rounded-lg pt-4 text-[14px]/5 transition-opacity [&.htmx-request]:opacity-40 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <p class="text-zinc-600">Summary renders with the page. Every other tab is fetched from
      <code class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px]/4">/orders/1187/&lt;tab&gt;/</code>
      and swapped in here.</p>
  </div>
</div>` },

      { id: 'states', name: 'Count, flag and unavailable', code:
`<!-- Three things a tab has to be able to say: how many, something needs you,
     and not yet.

     The red dot follows the status rule — colour lives in a 6px marker, never
     in a field of colour behind the label. The unavailable tab keeps
     aria-disabled so it is still announced and still explains itself, but the
     arrows skip it, because arrowing onto something you cannot open is a dead
     end with no way to know why. It also drops aria-controls: there is no panel
     to point at, and a reference to an id that is not in the document is worse
     than no reference at all. -->
<div x-id="['tab', 'panel']"
     x-data="{
       tab: 'lines',
       items: [
         { id: 'lines',    label: 'Lines',    count: 14 },
         { id: 'receipts', label: 'Receipts', count: 3, flag: '2 lines short' },
         { id: 'invoices', label: 'Invoices', off: 'No invoice until a GRN is posted' }
       ],
       open() { return this.items.filter(t => !t.off); },
       tabEls() { return Array.from(this.$refs.list.querySelectorAll('[role=tab]')); },
       move(step) {
         const list = this.open(), n = list.length;
         const i = list.findIndex(t => t.id === this.tab);
         this.pick(list[(i + step + n) % n].id);
       },
       pick(id) {
         if (this.items.find(t => t.id === id).off) return;
         this.tab = id;
         this.$nextTick(() => {
           const el = this.tabEls().find(e => e.dataset.tab === id);
           if (el) el.focus();
         });
       }
     }">
  <div class="border-b border-zinc-200">
    <div x-ref="list" role="tablist" aria-label="Purchase order sections"
         @keydown.arrow-right.prevent="move(1)"
         @keydown.arrow-left.prevent="move(-1)"
         @keydown.home.prevent="pick(open()[0].id)"
         @keydown.end.prevent="pick(open()[open().length - 1].id)"
         class="-mb-px flex gap-6">
      <template x-for="t in items" :key="t.id">
        <button type="button" role="tab" :data-tab="t.id"
                :id="$id('tab', t.id)"
                :aria-selected="tab === t.id ? 'true' : 'false'"
                :aria-disabled="t.off ? 'true' : null"
                :aria-controls="t.off ? null : $id('panel', t.id)"
                :tabindex="tab === t.id ? 0 : -1"
                @click="pick(t.id)"
                class="flex shrink-0 items-center gap-2 rounded-t border-b-2 pb-2.5 text-[13px]/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="t.off ? 'cursor-not-allowed border-transparent text-zinc-400'
                              : tab === t.id ? 'border-zinc-900 font-semibold text-zinc-900'
                                             : 'border-transparent text-zinc-600 hover:text-zinc-900'">
          <span x-text="t.label"></span>
          <template x-if="t.count">
            <span class="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300" x-text="t.count"></span>
          </template>
          <template x-if="t.flag">
            <span class="flex items-center gap-1.5">
              <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>
              <span class="sr-only" x-text="t.flag"></span>
            </span>
          </template>
          <template x-if="t.off">
            <i data-lucide="lock" class="size-3.5 text-zinc-400"></i>
          </template>
        </button>
      </template>
    </div>
  </div>

  <div class="pt-4 text-[14px]/5">
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'lines')" :aria-labelledby="$id('tab', 'lines')"
         x-show="tab === 'lines'" class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p>14 lines, <span class="font-medium tabular-nums">₹18,42,000</span> before tax.</p>
    </div>
    <div role="tabpanel" tabindex="0" :id="$id('panel', 'receipts')" :aria-labelledby="$id('tab', 'receipts')"
         x-show="tab === 'receipts'" x-cloak class="rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p class="text-zinc-600">3 GRNs posted. Two lines are short against the ordered quantity.</p>
    </div>
  </div>

  <p class="mt-3 flex items-center gap-1.5 text-[12px]/4 text-zinc-500">
    <i data-lucide="lock" class="size-3.5 shrink-0"></i>Invoices opens once a GRN is posted.
  </p>
</div>` },

      { id: 'django', name: 'Tabs that are pages', code:
`<!-- When each tab is its own URL and its own view, this is not a tablist at
     all. It is a nav of links that happens to be drawn as tabs, and the
     difference is not cosmetic: role="tab" would promise a screen reader that
     the arrows move between panels in this document and that Tab jumps into
     one, and then neither is true, because every click is a page load.

     So: <a> not <button>, aria-current="page" not aria-selected, no roles, no
     roving tabindex, no key bindings. The browser already knows how to move
     between links.

     Choose this over the Alpine variants when the panel is expensive, when the
     tab has to be bookmarkable and back-navigable, or when the server already
     has a view per section. Choose the Alpine ones when the panels are cheap
     and the record is one thing.

     # urls.py
     path('orders/<int:pk>/<slug:section>/', OrderDetail.as_view(), name='order-detail')

     # views.py — section comes straight out of the URL, so the template needs
     # no if-chain to work out which tab is on
     class OrderDetail(DetailView):
         def get_context_data(self, **kw):
             return super().get_context_data(**kw) | {'section': self.kwargs['section']} -->
<nav aria-label="Purchase order sections" class="border-b border-zinc-200">
  <div class="-mb-px flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {% for key, label in sections %}
      <a href="{% url 'order-detail' order.pk key %}"
         {% if key == section %}aria-current="page"{% endif %}
         class="shrink-0 whitespace-nowrap rounded-t border-b-2 pb-2.5 text-[13px]/5 {% if key == section %}border-zinc-900 font-semibold text-zinc-900{% else %}border-transparent text-zinc-600 hover:text-zinc-900{% endif %}">
        {{ label }}
      </a>
    {% endfor %}
  </div>
</nav>

<div class="pt-4 text-[14px]/5">
  {% block section %}{% endblock %}
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
    <div class="hidden w-64 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15 lg:flex">
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
    related: ['collapsible', 'tabs', 'card'],
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
    id: 'collapsible', name: 'Collapsible', category: 'navigation',
    description: 'One trigger and one panel. The standalone disclosure — show more, an advanced section at the foot of a form, a filter bar that folds away.',
    when: 'A single region worth hiding by default and cheap to open: extra fields under a summary, advanced options, a filter panel above a register, an audit trail nobody reads. The moment there are two or more of these stacked and their headings read as a set, it is an accordion — that component owns the group, the single-open rule and the heading outline, and a row of separate collapsibles pretending to be one is the thing it exists to stop. Never collapse something the user has to act on to finish the task in front of them.',
    notes: [
      'x-collapse comes from the Alpine collapse plugin, and the plugin has to be on the page before Alpine core. Without it the directive is not an error — it is ignored, and the panel toggles with the plain x-show underneath it, which snaps instead of animating. The failure looks like a styling problem and it is a script tag.',
      'Never put padding or a border on the element x-collapse animates. box-sizing is border-box, so height:0 cannot go below padding-top + padding-bottom + the borders — the panel bottoms out at that height and x-show then removes it in one frame, which reads as a snap at the end of a smooth close. Padding, borders and background go on an inner div; the animated element carries nothing but the directive and its id.',
      'That inner div takes padding, not margin. A margin on the first or last child collapses straight through the animated wrapper, so the height the plugin measures is short by the margin and the panel clips its own content until the next toggle.',
      'A trigger inside a <form> needs type="button". The default is submit, so the first click on Advanced options posts a half-filled order instead of opening anything, and the bug only shows up once the collapsible is dropped into a real form.',
      'The trigger goes above the panel and has a fixed height. Below the panel it is pushed down by the whole height of what just opened and the second click lands in the middle of the new content; growing when open it moves under a stationary cursor. h-9 or h-12 on the trigger and it stays where it was clicked.',
      'The rotation binds to a wrapping <span>, never to the <i data-lucide>. createIcons() replaces that element with an <svg> and every binding on it dies with it. The span is flex because a transform needs a block-level box in Tailwind v4.',
      'aria-expanded on the trigger, aria-controls carrying the panel id, and the panel actually carrying that id. Two out of three is the usual state of this component in the wild and it announces a button that expands nothing. When there is no panel in the DOM at all — a locked section — drop aria-controls rather than pointing it at an id that does not exist.',
      'x-cloak on a panel that starts closed, and never on one that starts open. Alpine boots after the HTML paints: without it a closed panel is on screen for the first frames, and with it an open panel stays hidden until the script lands.',
      '<details> and x-collapse do not combine. The browser owns the open attribute and drops the content to display:none the instant it changes, so there is no frame left to animate a height in and the two fight over the same element. Pick one: <details> for a panel that needs no script, Alpine for one that animates or is driven from elsewhere.',
      'A collapsed panel is not a permission boundary. x-show renders the markup and hides it, so a cost breakup behind a trigger is in the page source of every user who can load the page. Gate it in the view — do not render what this user may not read.',
      'A collapsed panel still submits. display:none inputs post exactly like visible ones, so anything typed into an advanced section and then folded away still reaches the server. That is usually what you want; it stops being what you want the moment the trigger is used to mean "these settings do not apply".',
      'The closed state has to say what is inside it. A trigger reading Filters over a register showing 218 of 1,438 rows is how someone reports a missing order that was never missing — put the count of active filters on the trigger, or keep the applied chips outside the panel where folding it cannot hide them.',
      'Find-in-page does not reach an x-show panel. Ctrl-F walks rendered text, and display:none is not rendered, so a term inside a closed Alpine panel simply does not exist as far as the browser is concerned. Chrome and Safari do open a closed <details> to reveal a match — which is the argument for the native variant whenever the panel holds reference text someone will search.',
      'x-show writes display inline, so a plain class cannot override it. A panel that has to be open at md and up needs the important modifier — md:block!, with the bang at the end in Tailwind v4 — and that instance drops x-collapse, because the plugin writes an inline height too and the panel would sit at 0 on desktop.',
      'One x-data for the pair. A trigger with its own x-data and a panel with another are two independent copies of open that never see each other; the state belongs on the nearest ancestor of both.',
      'Seed the trigger label rather than leaving the x-text span empty. x-text overwrites whatever is inside the element, so <span x-text="open ? \'Show less\' : \'Show more\'">Show more</span> reads correctly on the first paint and the button is not a blank strip until Alpine boots.'
    ],
    anatomy: [
      ['Root', 'One x-data holding open, on the nearest element that contains both the trigger and the panel.'],
      ['Trigger', 'A real button at a fixed height, above the panel, carrying type="button", aria-expanded and aria-controls.'],
      ['Summary', 'What the closed row still says — a count, an amount, how many filters are on. Without it the trigger is a door with nothing written on it.'],
      ['Indicator', 'A chevron in a flex span, rotated by a class on the span. Optional when the trigger label already flips between Show and Hide — two indicators say the same thing twice.'],
      ['Panel', 'The element x-collapse animates. It carries the id, x-show, x-cloak and nothing else: no padding, no border, no background.'],
      ['Body', 'The inner div holding the padding, the divider and the content, so the panel can genuinely reach height 0.']
    ],
    behaviour: [
      'The trigger toggles one panel and nothing else. There is no group, no single-open rule and no coordination with anything beside it — that is the accordion.',
      'The trigger does not move between states. Its height is fixed and it sits above the panel, so a second click lands on the same control the first one did.',
      'The panel animates its height over 200ms and finishes at height auto, so content that arrives afterwards — an htmx swap, a row added — reflows instead of being clipped.',
      'A panel that starts closed carries x-cloak; one that starts open must not. The default state is a decision about what this record is for, not a habit.',
      'Fields inside a collapsed panel are still in the form and still post. Closing the section hides it; it does not clear it.',
      'A locked section shows its trigger disabled with a reason beside it, and its content is not in the document at all.',
      'A section with nothing in it is not a collapsible. Render the one line that says so, rather than a control that opens onto nothing.'
    ],
    a11y: [
      'The trigger is a button, never a div with a click handler, and inside a form it is type="button".',
      'aria-expanded is bound to the state, not written once. aria-controls names the panel id, and the panel carries it.',
      'Panel ids are unique on the page. Rendered in a loop they take the record key — col-lines-1187 — or the second trigger points at the first panel and both rows open the same thing.',
      'An icon-only trigger is named for what it opens — "GST breakup" — not for what it does. Expand is what the aria-expanded state already says.',
      'The chevron is decorative and carries no label. The trigger text is the accessible name.',
      '<summary> is already exposed as a button with an expanded state. Adding role, aria-expanded or aria-controls to it overwrites something the browser keeps correct for free.',
      'A disabled trigger uses the disabled attribute, so it leaves the Tab order, and the reason it is locked is text beside it rather than a title attribute.'
    ],
    related: ['accordion', 'card', 'tabs'],
    variants: [
      { id: 'default', name: 'Show more', code:
`<!-- The trigger sits above the panel. Below it, opening pushes the trigger down
     by the whole height of what appeared and the second click lands in the
     middle of the content; at a fixed h-9 above it, the control does not move.

     The animated div carries no padding and no border — border-box means
     height:0 cannot go below them, so the close would bottom out at the padding
     and then vanish in one frame. The dl inside takes both. -->
<div class="max-w-xl rounded-xl border border-zinc-200 bg-white p-4" x-data="{ open: false }">
  <div class="flex items-baseline justify-between gap-3">
    <p class="min-w-0 truncate text-[14px]/5 font-medium tabular-nums">PO-24-1187 — Gujarat Polymers Ltd</p>
    <p class="shrink-0 text-[14px]/5 tabular-nums">₹18,42,000</p>
  </div>
  <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Released 04/08/2026 · 6 lines · Vasai plant</p>

  <button type="button" @click="open = !open" :aria-expanded="open" aria-controls="col-po-1187"
          class="mt-3 inline-flex h-9 items-center gap-1.5 text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">
    <span x-text="open ? 'Show less' : 'Show 6 more fields'">Show 6 more fields</span>
    <span class="flex transition-transform" :class="open && 'rotate-180'">
      <i data-lucide="chevron-down" class="size-4"></i>
    </span>
  </button>

  <div id="col-po-1187" x-show="open" x-cloak x-collapse.duration.200ms>
    <dl class="grid gap-x-6 gap-y-2.5 border-t border-zinc-100 pt-3 text-[14px]/5 sm:grid-cols-2">
      <div><dt class="text-[12px]/4 text-zinc-600">Deliver to</dt><dd>Site store — Vasai plant</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Promised date</dt><dd class="tabular-nums">22/08/2026</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Payment terms</dt><dd class="tabular-nums">45 days from GRN</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Freight</dt><dd class="tabular-nums">₹14,500 — to pay</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Vendor GSTIN</dt><dd class="tabular-nums">24AABCG1429P1ZK</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Buyer</dt><dd>R. Menon — Indirect materials</dd></div>
    </dl>
  </div>
</div>` },

      { id: 'advanced', name: 'Advanced options', code:
`<!-- type="button" is load-bearing. A button inside a form defaults to submit,
     so without it the first click on Advanced options posts a half-filled order
     rather than opening anything.

     The count on the trigger is what the closed row says about itself. Four
     fields nobody can see is four fields nobody knows are there, and the ones
     that already differ from the default are exactly the ones somebody has to
     be told about.

     Everything inside still posts. display:none inputs submit like any other,
     so folding this section away hides it — it does not clear it. -->
<form class="max-w-xl" x-data="{ open: false }">
  <div class="space-y-4">
    <div>
      <label for="ao-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <input id="ao-vendor" name="vendor" value="Gujarat Polymers Ltd"
               class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
      </div>
    </div>
    <div>
      <label for="ao-date" class="mb-1.5 block text-[13px]/5 font-medium">Required by</label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <input id="ao-date" name="required_by" type="date" value="2026-08-22"
               class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
      </div>
    </div>
  </div>

  <div class="mt-5 rounded-xl border border-zinc-200 bg-white">
    <button type="button" @click="open = !open" :aria-expanded="open" aria-controls="col-advanced"
            class="flex h-12 w-full items-center gap-3 px-4 text-left">
      <i data-lucide="sliders-horizontal" class="size-4 shrink-0 text-zinc-600"></i>
      <span class="flex-1 text-[14px]/5 font-medium">Advanced options</span>
      <span class="inline-flex items-center rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">4 fields</span>
      <span class="flex transition-transform" :class="open && 'rotate-180'">
        <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
      </span>
    </button>

    <div id="col-advanced" x-show="open" x-cloak x-collapse.duration.200ms>
      <div class="space-y-4 border-t border-zinc-100 px-4 py-4">
        <div>
          <label for="ao-freight" class="mb-1.5 block text-[13px]/5 font-medium">Freight terms</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <select id="ao-freight" name="freight" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              <option>To pay — vendor arranges</option>
              <option selected>Paid — included in rate</option>
              <option>Ex-works — we collect</option>
            </select>
          </div>
        </div>
        <div>
          <label for="ao-tol" class="mb-1.5 block text-[13px]/5 font-medium">Receipt tolerance</label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <input id="ao-tol" name="tolerance" value="2" inputmode="decimal"
                   class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
            <span class="pr-3 text-[14px]/5 text-zinc-600">%</span>
          </div>
          <p class="mt-1 text-[12px]/4 text-zinc-500">Over-receipt allowed against the ordered quantity.</p>
        </div>
        <label class="flex items-start gap-2.5 text-[14px]/5">
          <input type="checkbox" name="inspection" value="1" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
          <span>Hold for inspection before the GRN is posted</span>
        </label>
        <div>
          <label for="ao-note" class="mb-1.5 block text-[13px]/5 font-medium">Remarks printed on the order</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <textarea id="ao-note" name="remarks" rows="3"
                      class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500"
                      placeholder="Mill test certificate per heat number.">Mill test certificate per heat number.</textarea>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button type="submit" class="mt-4 inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Release order</button>
</form>` },

      { id: 'filters', name: 'Filter panel', code:
`<!-- Two things keep a folded filter panel honest. The count on the trigger, so
     the closed row admits the register is filtered; and the applied chips
     outside the panel, so folding it cannot hide what is applied. Without both,
     someone reports a missing purchase order that was never missing — it was
     three filters away.

     The result count sits beside the trigger for the same reason: 218 of 1,438
     is the sentence that stops the phone call. -->
<div class="rounded-xl border border-zinc-200 bg-white"
     x-data="{
       open: false,
       active: [
         { id: 'vendor', label: 'Vendor: Gujarat Polymers' },
         { id: 'status', label: 'Status: Awaiting GRN' },
         { id: 'value',  label: 'Value: above ₹5,00,000' }
       ],
       drop(id) { this.active = this.active.filter(f => f.id !== id); }
     }">
  <div class="flex h-12 items-center gap-3 px-4">
    <button type="button" @click="open = !open" :aria-expanded="open" aria-controls="col-filters"
            class="-mx-2 flex h-9 items-center gap-2 rounded-lg px-2 text-[13px]/5 font-medium hover:bg-zinc-100">
      <i data-lucide="sliders-horizontal" class="size-4 shrink-0 text-zinc-600"></i>
      Filters
      <span x-show="active.length"
            class="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300"
            x-text="active.length">3</span>
      <span class="flex transition-transform" :class="open && 'rotate-180'">
        <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
      </span>
    </button>
    <p class="ml-auto shrink-0 text-[13px]/5 tabular-nums text-zinc-600"
       x-text="active.length ? '218 of 1,438 orders' : '1,438 orders'">218 of 1,438 orders</p>
  </div>

  <!-- outside the panel on purpose: closing the filters must not hide them -->
  <div x-show="active.length" class="flex flex-wrap items-center gap-2 border-t border-zinc-100 px-4 py-2.5">
    <template x-for="f in active" :key="f.id">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pl-2.5 pr-1 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span x-text="f.label"></span>
        <button type="button" @click="drop(f.id)" :aria-label="'Remove filter ' + f.label"
                class="flex size-4 items-center justify-center rounded-full hover:bg-zinc-300">
          <i data-lucide="x" class="size-3"></i>
        </button>
      </span>
    </template>
    <button type="button" @click="active = []" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Clear all</button>
  </div>

  <div id="col-filters" x-show="open" x-cloak x-collapse.duration.200ms>
    <div class="border-t border-zinc-100 px-4 py-4">
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <label for="fl-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <select id="fl-vendor" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              <option>All vendors</option>
              <option selected>Gujarat Polymers Ltd</option>
              <option>Sharma Extrusions</option>
              <option>Nashik Steel Traders</option>
            </select>
          </div>
        </div>
        <div>
          <label for="fl-status" class="mb-1.5 block text-[13px]/5 font-medium">Status</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <select id="fl-status" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              <option>Any status</option>
              <option>Open</option>
              <option selected>Awaiting GRN</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
        <div>
          <label for="fl-value" class="mb-1.5 block text-[13px]/5 font-medium">Value above</label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
            <input id="fl-value" value="5,00,000" inputmode="numeric"
                   class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
          </div>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Apply filters</button>
        <button type="button" @click="open = false" class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Cancel</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'native', name: 'No JavaScript', code:
`<!-- <details> and <summary>, and nothing else. What this buys:

     It works before Alpine boots and with scripting off, so no x-cloak and no
     first-paint flash. The summary is already exposed as a button with an
     expanded state, so there is nothing to wire and nothing to keep in sync —
     adding role, aria-expanded or aria-controls here overwrites something the
     browser gets right for free. And Ctrl-F reaches inside it: Chrome and
     Safari open a closed <details> to reveal a find-in-page match, which an
     x-show panel can never do, because display:none text is not text as far as
     the browser is concerned.

     What it costs: no height animation. <details> and x-collapse do not
     combine — the browser owns the open attribute and drops the content to
     display:none the instant it changes, leaving no frame to animate in, and
     the two end up fighting over the same element. The open state also cannot
     be driven from anywhere else on the page without script, and anything
     interactive inside the summary toggles the panel when it is clicked.

     So: reference text somebody may search — an audit trail, terms, a policy
     note. Use the Alpine version when the panel holds form controls, when the
     trigger lives somewhere else, or when the movement is worth the plugin.

     list-none plus the webkit pseudo removes the disclosure triangle; display
     flex on the summary already does it in Chrome, and Safari needs the
     pseudo. group-open on the wrapping span is what rotates the chevron —
     still a span, never the <i>, because Lucide replaces that element. -->
<details class="group max-w-xl rounded-xl border border-zinc-200 bg-white">
  <summary class="flex h-12 list-none items-center gap-3 px-4 [&::-webkit-details-marker]:hidden">
    <i data-lucide="history" class="size-4 shrink-0 text-zinc-600"></i>
    <span class="flex-1 text-[14px]/5 font-medium">Audit trail</span>
    <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">7 events</span>
    <span class="flex shrink-0 transition-transform group-open:rotate-180">
      <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
    </span>
  </summary>

  <div class="border-t border-zinc-100 px-4 py-3">
    <ol class="space-y-3 text-[13px]/5">
      <li class="flex gap-3">
        <span class="w-20 shrink-0 tabular-nums text-zinc-500">11/08/2026</span>
        <span class="min-w-0">GRN-3391 posted against 4 lines — <span class="text-zinc-600">S. Kulkarni, stores</span></span>
      </li>
      <li class="flex gap-3">
        <span class="w-20 shrink-0 tabular-nums text-zinc-500">09/08/2026</span>
        <span class="min-w-0">Delivery date moved to 22/08/2026 — <span class="text-zinc-600">vendor email</span></span>
      </li>
      <li class="flex gap-3">
        <span class="w-20 shrink-0 tabular-nums text-zinc-500">04/08/2026</span>
        <span class="min-w-0">Order released — <span class="text-zinc-600">R. Menon</span></span>
      </li>
      <li class="flex gap-3">
        <span class="w-20 shrink-0 tabular-nums text-zinc-500">02/08/2026</span>
        <span class="min-w-0">Approved at <span class="tabular-nums">₹18,42,000</span> — <span class="text-zinc-600">A. Deshmukh, plant head</span></span>
      </li>
      <li class="flex gap-3">
        <span class="w-20 shrink-0 tabular-nums text-zinc-500">01/08/2026</span>
        <span class="min-w-0">Raised from requisition REQ-24-0884 — <span class="text-zinc-600">R. Menon</span></span>
      </li>
    </ol>
  </div>
</details>` },

      { id: 'card', name: 'Inside a card', code:
`<!-- The header and the footer are outside the panel, so the number this card is
     about is on screen in both states. Collapse the body and the row still says
     which invoice it is and what it comes to — collapse the total with it and
     the closed card is a label with no value.

     This one starts open, so it must not carry x-cloak: x-cloak would hold it
     hidden until Alpine boots and the card would assemble itself in front of
     the user.

     The trigger is icon-only, so its name says what it opens rather than what
     it does — aria-expanded already announces expanded or collapsed, and a
     button called "Expand" in a page with four of them names nothing. -->
<div class="max-w-xl rounded-xl border border-zinc-200 bg-white" x-data="{ open: true }">
  <div class="flex min-h-14 items-center gap-3 px-4 py-3">
    <div class="min-w-0 flex-1">
      <h3 class="truncate text-[16px]/6 font-semibold">GST breakup</h3>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">Invoice INV-7741 · 12/08/2026 · Gujarat Polymers Ltd</p>
    </div>
    <button type="button" @click="open = !open" :aria-expanded="open" aria-controls="col-gst"
            aria-label="GST breakup"
            class="-mr-1 flex size-9 shrink-0 items-center justify-center rounded-lg hover:bg-zinc-100">
      <span class="flex transition-transform" :class="open && 'rotate-180'">
        <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
      </span>
    </button>
  </div>

  <div id="col-gst" x-show="open" x-collapse.duration.200ms>
    <dl class="divide-y divide-zinc-100 border-t border-zinc-100 px-4 text-[14px]/5">
      <div class="flex items-center justify-between gap-3 py-2.5">
        <dt class="text-zinc-600">Taxable value</dt><dd class="tabular-nums">₹18,42,000.00</dd>
      </div>
      <div class="flex items-center justify-between gap-3 py-2.5">
        <dt class="text-zinc-600">CGST @ 9%</dt><dd class="tabular-nums">₹1,65,780.00</dd>
      </div>
      <div class="flex items-center justify-between gap-3 py-2.5">
        <dt class="text-zinc-600">SGST @ 9%</dt><dd class="tabular-nums">₹1,65,780.00</dd>
      </div>
      <div class="flex items-center justify-between gap-3 py-2.5">
        <dt class="text-zinc-600">Round off</dt><dd class="tabular-nums">₹0.40</dd>
      </div>
    </dl>
  </div>

  <div class="flex items-center justify-between gap-3 border-t border-zinc-200 px-4 py-3">
    <span class="text-[13px]/5 font-medium">Invoice total</span>
    <span class="text-[16px]/6 font-semibold tabular-nums">₹21,73,560</span>
  </div>
</div>` },

      { id: 'controlled', name: 'Trigger outside the panel', code:
`<!-- One x-data, on the nearest element that contains both. A trigger with its
     own x-data and a panel with another are two copies of open that never see
     each other — the button toggles a variable nothing is watching, and the
     panel never moves.

     No chevron here. The label already flips between Show and Hide, and a
     rotating arrow beside it is the same fact twice.

     With the trigger away from the panel, aria-controls is the only thing tying
     them together and it is doing real work. Keep the panel after the trigger
     in document order so Tab reaches it next. -->
<div x-data="{ open: false }" class="space-y-4">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div class="min-w-0">
      <h2 class="text-[20px]/7 font-semibold tracking-tight">GRN-3391</h2>
      <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Gujarat Polymers Ltd · posted 11/08/2026</p>
    </div>
    <button type="button" @click="open = !open" :aria-expanded="open" aria-controls="col-lines"
            class="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">
      <i data-lucide="list" class="size-4 shrink-0 text-zinc-600"></i>
      <span x-text="open ? 'Hide line detail' : 'Show line detail'">Show line detail</span>
    </button>
  </div>

  <div class="rounded-xl border border-zinc-200 bg-white">
    <dl class="grid grid-cols-2 gap-x-6 gap-y-3 px-4 py-3 sm:grid-cols-4">
      <div><dt class="text-[12px]/4 text-zinc-600">Lines</dt><dd class="text-[14px]/5 tabular-nums">4</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Received</dt><dd class="text-[14px]/5 tabular-nums">8,400 kg</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Short</dt><dd class="text-[14px]/5 tabular-nums">200 kg</dd></div>
      <div><dt class="text-[12px]/4 text-zinc-600">Value</dt><dd class="text-[14px]/5 tabular-nums">₹6,18,400</dd></div>
    </dl>

    <div id="col-lines" x-show="open" x-cloak x-collapse.duration.200ms>
      <ul class="divide-y divide-zinc-100 border-t border-zinc-100">
        <li class="flex items-baseline gap-3 px-4 py-3">
          <span class="min-w-0 flex-1 truncate text-[13px]/5">HDPE granules — grade M60075</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">8,400 kg</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹5,04,000</span>
        </li>
        <li class="flex items-baseline gap-3 px-4 py-3">
          <span class="min-w-0 flex-1 truncate text-[13px]/5">Masterbatch — white 20%</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">300 kg</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹72,000</span>
        </li>
        <li class="flex items-baseline gap-3 px-4 py-3">
          <span class="min-w-0 flex-1 truncate text-[13px]/5">Antioxidant additive</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">40 kg</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹28,400</span>
        </li>
        <li class="flex items-baseline gap-3 px-4 py-3">
          <span class="min-w-0 flex-1 truncate text-[13px]/5">Packing — HDPE liner bags</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">168 nos</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹14,000</span>
        </li>
      </ul>
    </div>
  </div>
</div>` },

      { id: 'states', name: 'Locked, empty and open on desktop', code:
`<div class="max-w-xl space-y-4">
  <!-- Locked. The trigger is disabled, so it leaves the Tab order, and the
       reason sits beside it as text rather than in a title attribute nobody on
       a touchscreen will ever see. No chevron — a chevron promises something
       opens.

       There is no panel in the document at all, so there is no aria-controls
       either: pointing it at an id that does not exist is worse than omitting
       it. The content is absent because a collapsed panel is not a permission
       boundary — x-show renders the markup and hides it, and a cost breakup
       behind a trigger is in the page source of everyone who can load the
       page. This one is gated in the view. -->
  <div class="rounded-xl border border-zinc-200 bg-white">
    <button type="button" disabled aria-expanded="false"
            class="flex h-12 w-full items-center gap-3 px-4 text-left text-zinc-500">
      <i data-lucide="lock" class="size-4 shrink-0"></i>
      <span class="flex-1 text-[14px]/5 font-medium">Cost breakup</span>
    </button>
    <p class="border-t border-zinc-100 px-4 py-2.5 text-[12px]/4 text-zinc-500">
      Category managers and above. Raise a request with the buying desk.
    </p>
  </div>

  <!-- Empty. A collapsible with nothing behind it is a control that opens onto
       a blank panel, and the only way to find that out is to click it. Say the
       answer on the closed row and drop the control. -->
  <div class="rounded-xl border border-zinc-200 bg-white px-4 py-3">
    <p class="text-[14px]/5 font-medium">Amendments</p>
    <p class="mt-1 flex items-center gap-2 text-[13px]/5 text-zinc-600">
      <i data-lucide="minus" class="size-4 shrink-0 text-zinc-500"></i>
      None since this order was released on 04/08/2026.
    </p>
  </div>

  <!-- Collapsed on a phone, open at md and up, where there is room for it.
       x-show writes display inline and a plain class cannot beat an inline
       style, so the desktop override is the important modifier — md:block! in
       Tailwind v4, where the bang goes on the end of the utility and not the
       front.

       That instance drops x-collapse. The plugin writes an inline height as
       well, and md:block! would then show a panel sitting at height 0.

       The trigger is md:hidden and a plain heading takes its place at md, so
       desktop is not left with an unlabelled block of text. -->
  <div class="rounded-xl border border-zinc-200 bg-white" x-data="{ open: false }">
    <h3 class="hidden h-12 items-center px-4 text-[14px]/5 font-medium md:flex">Payment and freight terms</h3>
    <button type="button" @click="open = !open" :aria-expanded="open" aria-controls="col-terms"
            class="flex h-12 w-full items-center gap-3 px-4 text-left md:hidden">
      <span class="flex-1 text-[14px]/5 font-medium">Payment and freight terms</span>
      <span class="flex transition-transform" :class="open && 'rotate-180'">
        <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
      </span>
    </button>
    <div id="col-terms" x-show="open" x-cloak class="md:block!">
      <div class="border-t border-zinc-100 px-4 py-3 text-[14px]/5 text-zinc-600 md:border-t-0 md:pt-0">
        45 days from GRN posting, 2% early-payment discount inside 10 days.
        Freight paid and included in the rate. Debit note raised on any short
        receipt beyond the 2% tolerance.
      </div>
    </div>
  </div>
</div>` },

      { id: 'django', name: 'Server-rendered', code:
`{# templates/orders/_collapsible.html

   Three things the server decides that the browser cannot.

   1. Whether the panel starts open. Rendered in the x-data, and the x-cloak
      goes on only when it starts closed — a panel that starts open and carries
      x-cloak stays hidden until Alpine boots, which is the exact flash x-cloak
      exists to prevent.

   2. Whether the panel exists at all. A collapsed panel is not a permission
      boundary: x-show renders the markup and hides it, so a cost breakup behind
      a trigger is in the page source of every user who can load the page. The
      {% if perms %} is what actually withholds it.

   3. The panel id. Rendered in a loop it takes the record key, or the second
      trigger's aria-controls points at the first panel and both rows open the
      same thing. #}

<div class="rounded-xl border border-zinc-200 bg-white"
     x-data="{ open: {% if section_open %}true{% else %}false{% endif %} }">
  <button type="button" @click="open = !open" :aria-expanded="open"
          aria-controls="col-lines-{{ order.pk }}"
          class="flex h-12 w-full items-center gap-3 px-4 text-left">
    <span class="flex-1 text-[14px]/5 font-medium">Order lines</span>
    <span class="text-[12px]/4 tabular-nums text-zinc-500">{{ order.lines.count }} lines · ₹{{ order.total|floatformat:0 }}</span>
    <span class="flex transition-transform" :class="open && 'rotate-180'">
      <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
    </span>
  </button>

  <div id="col-lines-{{ order.pk }}" x-show="open"
       {% if not section_open %}x-cloak{% endif %} x-collapse.duration.200ms>
    <ul class="divide-y divide-zinc-100 border-t border-zinc-100">
      {% for line in order.lines.all %}
        <li class="flex items-baseline gap-3 px-4 py-3">
          <span class="min-w-0 flex-1 truncate text-[13px]/5">{{ line.item }}</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">{{ line.qty }} {{ line.uom }}</span>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹{{ line.amount|floatformat:0 }}</span>
        </li>
      {% endfor %}
    </ul>
  </div>
</div>

{# The panel a user may not read is not rendered, hidden or otherwise. #}
{% if perms.purchasing.view_cost %}
  <div class="mt-4 rounded-xl border border-zinc-200 bg-white" x-data="{ open: false }">
    <button type="button" @click="open = !open" :aria-expanded="open"
            aria-controls="col-cost-{{ order.pk }}"
            class="flex h-12 w-full items-center gap-3 px-4 text-left">
      <span class="flex-1 text-[14px]/5 font-medium">Cost breakup</span>
      <span class="flex transition-transform" :class="open && 'rotate-180'">
        <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
      </span>
    </button>
    <div id="col-cost-{{ order.pk }}" x-show="open" x-cloak x-collapse.duration.200ms>
      <div class="border-t border-zinc-100 px-4 py-3 text-[14px]/5">
        {% include 'orders/_cost_breakup.html' %}
      </div>
    </div>
  </div>
{% endif %}

{# A filter panel has to survive the reload its own Apply button causes, so the
   open state is a GET parameter and not Alpine state — Alpine is reconstructed
   from scratch on every page load and remembers nothing.

   views.py
       context['filters_open'] = bool(request.GET.get('f') or form.has_changed())

   The hidden f=1 keeps the panel open through the submit; the count on the
   trigger is what the closed row says, and without it a filtered register reads
   as the whole register. #}
<form method="get" class="mt-4 rounded-xl border border-zinc-200 bg-white"
      x-data="{ open: {% if filters_open %}true{% else %}false{% endif %} }">
  <input type="hidden" name="f" value="1">
  <div class="flex h-12 items-center gap-3 px-4">
    <button type="button" @click="open = !open" :aria-expanded="open" aria-controls="col-filters"
            class="-mx-2 flex h-9 items-center gap-2 rounded-lg px-2 text-[13px]/5 font-medium hover:bg-zinc-100">
      <i data-lucide="sliders-horizontal" class="size-4 shrink-0 text-zinc-600"></i>
      Filters
      {% if active_filters %}
        <span class="inline-flex items-center rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">{{ active_filters|length }}</span>
      {% endif %}
      <span class="flex transition-transform" :class="open && 'rotate-180'">
        <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
      </span>
    </button>
    <p class="ml-auto shrink-0 text-[13px]/5 tabular-nums text-zinc-600">{{ page_obj.paginator.count }} of {{ total_orders }} orders</p>
  </div>
  <div id="col-filters" x-show="open" {% if not filters_open %}x-cloak{% endif %} x-collapse.duration.200ms>
    <div class="border-t border-zinc-100 px-4 py-4">
      {{ form.as_div }}
      <button type="submit" class="mt-4 inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Apply filters</button>
    </div>
  </div>
</form>

{# A panel expensive enough to be worth not rendering until it is opened.
   Alpine does not fetch — htmx does. intersect fires the first time the element
   is genuinely on screen, and a display:none element never intersects, so the
   request goes out on the first open and once only.

   urls.py
       path('orders/<int:pk>/audit/', OrderAudit.as_view(), name='order-audit')

   Keep the placeholder roughly the height of what replaces it. x-collapse
   finishes the panel at height auto, so a swap landing after the animation
   reflows correctly, but one landing inside those 200ms leaves the panel
   measuring the placeholder. #}
<div class="mt-4 rounded-xl border border-zinc-200 bg-white" x-data="{ open: false }">
  <button type="button" @click="open = !open" :aria-expanded="open"
          aria-controls="col-audit-{{ order.pk }}"
          class="flex h-12 w-full items-center gap-3 px-4 text-left">
    <span class="flex-1 text-[14px]/5 font-medium">Audit trail</span>
    <span class="text-[12px]/4 tabular-nums text-zinc-500">{{ order.events.count }} events</span>
    <span class="flex transition-transform" :class="open && 'rotate-180'">
      <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
    </span>
  </button>
  <div id="col-audit-{{ order.pk }}" x-show="open" x-cloak x-collapse.duration.200ms>
    <div class="border-t border-zinc-100 px-4 py-3"
         hx-get="{% url 'order-audit' order.pk %}" hx-trigger="intersect once" hx-swap="innerHTML">
      <p class="text-[13px]/5 text-zinc-500">Loading the audit trail…</p>
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
      'A palette is a combobox, not a menu, because it has a text box. A menu moves real focus between its items; a combobox keeps real focus in the input and points at the active row with aria-activedescendant. So the rows are not buttons and not links: nothing inside role="option" may be focusable, and a row that is a tab stop puts the caret outside the search box the moment somebody presses Tab.',
      'The palette is a dialog as well as a combobox. It covers the page with a dimmed overlay, so it takes role="dialog", aria-modal="true" and a name, and it has to hold focus to earn them: aria-modal on a panel Tab can walk out of tells a screen reader the page behind is inert while the keyboard proves it is not. The two go in together or neither does.',
      'x-trap.noscroll on the overlay does the focusing, the returning and the scroll lock, so show() sets three fields and focuses nothing itself. The trap opens on [autofocus], which is why the query input carries one: without it the trap lands on the first tabbable node, which is the Esc button. Do not also focus by hand. x-show has not written display when $nextTick runs, so focus() on the input is a silent no-op, and a bare requestAnimationFrame beats Alpine\'s flush, so a hand-rolled call would be racing the trap for the same element and losing on its own terms.',
      'The row id is derived from the record — :id="\'cp-\' + o.id" — never from the loop index, because filtering renumbers the rows and aria-activedescendant then names whichever record moved into that slot. Key the loop on the same field or Alpine reuses nodes and the id and the row drift apart. The prefix belongs to the palette, so a second one on the page needs a second prefix or both write the same ids.',
      'Closing returns focus to whatever opened the palette, which is not always the trigger — ⌘K fires from wherever the caret already was. x-trap captures document.activeElement when it activates and puts it back on close, so this needs no bookkeeping of its own. Without that, every dismissal drops a keyboard user at the top of the document.',
      'The letters on the action rows are the application\'s own shortcuts, shown so people learn them. The palette does not listen for them, and must not: inside a search box, N types an N.'
    ],
    anatomy: [
      ['Overlay', 'A dimmed field with the panel near the top, not centred — the list grows downward. It carries x-trap.noscroll, so it is what holds focus and locks the page behind.'],
      ['Input', 'role="combobox", focused on open and holding real focus the whole time the palette is up. The query is cleared on close so the next open starts fresh.'],
      ['Group', 'Results split by kind — actions, records — each under a small label. role="group" named by that label, and a group with no matches leaves with its heading.'],
      ['Result', 'One row, role="option" and not a tab stop, with the active one tinted. The keyboard drives which is active.'],
      ['Empty state', 'What the list shows at zero matches — the query quoted back, not an empty panel.'],
      ['Live region', 'A sr-only role="status" inside the dialog, carrying the number of matches. It sits inside because aria-modal hides everything outside the dialog from a screen reader.'],
      ['Footer', 'The key legend. Nobody learns arrow keys and Enter from nothing.']
    ],
    behaviour: [
      'Everything reachable here is also reachable by clicking. The palette is an accelerator, never a hiding place.',
      'Both Cmd-K and Ctrl-K open it, and both need .prevent — the browser binds Cmd-K to the address bar.',
      'Opening moves focus into the query input, and Tab stays inside the panel, so nothing behind the overlay is reachable until it closes.',
      'Typing filters both groups at once, and every keystroke puts the highlight back on the first match, so Enter always takes the row at the top of the list.',
      'Arrow down and up move the active row over the flattened list in the order the rows are drawn, not group by group, and clamp at both ends rather than wrapping. Enter takes the active row, Escape closes.',
      'The highlight follows the mouse as well as the keyboard, so the row under the pointer and the row Enter would take are never two different rows.',
      'A group whose rows are all filtered out goes with its heading, and when nothing matches at all the list is replaced by an empty state naming the query.',
      'Closing clears the query, so reopening does not present the previous search as if it were current, and puts focus back on whatever opened the palette.',
      'On a three-page application, skip it entirely — nobody will learn the shortcut.'
    ],
    a11y: [
      'The input is role="combobox" with aria-autocomplete="list", aria-expanded, aria-controls naming the list and aria-activedescendant naming the active row.',
      'The list is role="listbox" with an accessible name and every row is role="option". No row carries aria-selected: a palette commits nothing — a row is fired and the palette closes — so the only state a row has is being the active one, and aria-activedescendant is what carries that.',
      'Real focus never leaves the input. The highlight moves through aria-activedescendant, which is why every row needs a stable id derived from the record and why no row is a tab stop.',
      'Each group is role="group" named by its heading, and the visible heading is aria-hidden — the group is already named, and a bare paragraph is not a permitted child of a listbox.',
      'The number of matches is announced from a role="status" inside the dialog. Outside it the announcement would never arrive, because aria-modal="true" takes everything outside the dialog out of the accessibility tree.',
      'The overlay is role="dialog" with aria-modal="true", named "Command palette", so the rest of the page is out of the accessibility tree while it is open.',
      'Focus is trapped in the panel and cannot reach the page behind. The trap opens on the query input because it carries autofocus, rather than on the Esc button, which is the first tabbable node.',
      'Escape closes and returns focus to whatever opened the palette, captured by x-trap at the moment it activated.',
    ],
    related: ['combobox', 'sidebar-nav', 'dropdown'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- A palette has a text box, so it is a combobox and not a menu: real focus
     stays in the input and the highlight is carried by aria-activedescendant.
     That is why the rows are divs with role="option" rather than buttons —
     nothing inside an option may be focusable.

     Row ids come from the record, never from the loop index. Filtering
     renumbers the rows, and an index-derived id leaves aria-activedescendant
     naming whichever record moved into that slot.

     x-trap does the focusing and the returning, which is why show() sets
     three fields and nothing else. It opens focus on [autofocus], so the
     caret lands in the query rather than on the Esc button, and it restores
     document.activeElement on close, which matters because ⌘K fires from
     wherever the caret already was and the trigger is not always what opened
     the palette. Focusing by hand here would race the trap: x-show has not
     written display when $nextTick runs, so focus() on the input is a silent
     no-op.

     The letters on the action rows are the application's own shortcuts, shown
     so people learn them. The palette does not listen for them: inside a
     search box, N has to type an N. -->
<div x-data="{
       open: false, q: '', ai: 0,
       groups: [
         { name: 'Actions', items: [
           { id: 'new-po',    label: 'New purchase order', icon: 'plus',          key: 'N' },
           { id: 'post-grn',  label: 'Post goods receipt', icon: 'package-check', key: 'G' },
           { id: 'approvals', label: 'Go to my approvals', icon: 'check-check',   key: 'A' }
         ] },
         { name: 'Recent records', items: [
           { id: 'po-1187', label: 'PO-24-1187 — Gujarat Polymers Ltd', sub: 'HDPE granules · 14 lines', icon: 'file-text', amount: '₹18,42,000' },
           { id: 'po-1179', label: 'PO-24-1179 — Sharma Steel Traders', sub: 'MS angle 50×50×6', flag: 'overdue 9 days', icon: 'file-text', amount: '₹2,74,900' },
           { id: 'ven-deccan', label: 'Deccan Fasteners Pvt Ltd', sub: 'Vendor · rate contract to 31 March 2027', icon: 'building-2' }
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

  <button type="button" @click="show()"
          class="flex w-full max-w-sm items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 text-zinc-500 hover:bg-zinc-100">
    <i data-lucide="search" class="size-4 text-zinc-600"></i>
    <span class="flex-1 text-left">Search Konspec Operations</span>
    <kbd class="rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4">⌘K</kbd>
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
            <!-- a sticky heading with no background of its own lets the rows
                 scroll through the text and neither is readable -->
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

      <!-- an empty panel reads as a component that broke; this reads as a
           search that found nothing -->
      <div x-show="!list.length" x-cloak class="px-4 py-6 text-center">
        <p class="text-[13px]/5 font-medium">Nothing matches “<span x-text="q"></span>”</p>
        <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">Try an order number — PO-24-1187 — or a vendor name.</p>
      </div>

      <div class="flex items-center gap-3 border-t border-zinc-100 px-3 py-2 text-[11px]/4 text-zinc-500">
        <span><kbd class="rounded border border-zinc-200 px-1 py-0.5">↑↓</kbd> move</span>
        <span><kbd class="rounded border border-zinc-200 px-1 py-0.5">↵</kbd> open</span>
        <span class="ml-auto">Konspec Operations</span>
      </div>

      <!-- inside the dialog, because aria-modal hides everything outside it
           from a screen reader, and a live region it cannot see announces
           nothing at all. -->
      <p role="status" class="sr-only"
         x-text="open ? (list.length === 1 ? '1 result' : list.length + ' results') : ''"></p>
    </div>
  </div>
</div>` }
    ]
  }
);
