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
    related: ['page-header', 'accordion', 'sidebar'],
    variants: [
      { id: 'underline', name: 'Underline', code:
`<!-- The default. Automatic activation, because all four panels are already in
     the page and there is nothing to wait for.

     tabEls() filters on [role=tab] rather than reading children: x-for leaves a
     <template> in the DOM and it counts as an element child. -->
<div data-kui="tabs/underline" x-id="['tab', 'panel']"
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
`<!-- Same widget, different marker: a white pill on a zinc-200 track instead of
     an underline. Reach for it when the tabs filter a list rather than section a
     record, and when the row has to sit beside other controls without a rule
     running under it. -->
<div data-kui="tabs/pill" x-id="['tab', 'panel']"
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
       class="inline-flex rounded-lg bg-zinc-200 p-1">
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
<div data-kui="tabs/scrollable" x-id="['tab', 'panel']"
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
<div data-kui="tabs/vertical" x-id="['tab', 'panel']"
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
              :class="tab === t.id ? 'border-zinc-900 bg-zinc-100 font-medium text-zinc-900' : 'border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'"
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
<div data-kui="tabs/url" x-id="['tab', 'panel']"
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
<div data-kui="tabs/lazy" x-data="{
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
<div data-kui="tabs/states" x-id="['tab', 'panel']"
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
<nav data-kui="tabs/django" aria-label="Purchase order sections" class="border-b border-zinc-200">
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
    related: ['page-header', 'tabs', 'sidebar'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- Three levels, which is the common case. The separator is aria-hidden so a
     screen reader reads "Home, Procurement, Purchase orders" rather than
     spelling out a slash between each one. -->
<nav data-kui="breadcrumbs/default" aria-label="Breadcrumb">
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
<nav data-kui="breadcrumbs/record" aria-label="Breadcrumb">
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
<nav data-kui="breadcrumbs/truncated" aria-label="Breadcrumb">
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
<nav data-kui="breadcrumbs/overflow" aria-label="Breadcrumb" x-data="{ open: false }" @click.outside="open = false" @keydown.escape.window="open = false">
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
<div data-kui="breadcrumbs/responsive">
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
<div data-kui="breadcrumbs/page-header" class="rounded-xl border border-zinc-300 bg-white px-5 py-4">
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
<a data-kui="breadcrumbs/back" href="#" class="inline-flex items-center gap-1.5 text-[13px]/5 text-zinc-600 hover:text-zinc-900">
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
<nav data-kui="breadcrumbs/django" aria-label="Breadcrumb">
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
    id: 'menubar', name: 'Menubar', category: 'navigation',
    description: 'A row of menus across the top of a document — File, Edit, View — sharing one tab stop and one keyboard model. A desktop-application affordance, and most internal screens should not have one.',
    when: 'A document-shaped screen with a genuine File / Edit / View set of commands that will not fit in a toolbar: a purchase-order editor, a BOM editor, a rate-contract sheet, a report designer — something somebody sits inside for an hour and edits. Almost nothing else. A register, a dashboard or a list has no document and no File menu; what those need is a topbar carrying the page actions and a dropdown of row actions per record, and painting a menubar over them dresses a CRUD screen up as an application it is not. The test is blunt: if you cannot fill three menus with commands that already exist, you do not have a menubar, you have four buttons pretending.',
    notes: [
      'Reach for this last, not first. A menubar is the right control when the screen is a document and the command set is large enough that a toolbar would need a second row — a purchase-order editor with fifteen line-level commands, a BOM editor, a report designer. It is the wrong control on a register, a dashboard, a settings page or anything whose verbs are Filter, Export and New: there a topbar plus a per-row dropdown says the same thing with a third of the machinery and none of the keyboard model. Fitted to a list screen it costs a tab stop, a hover model and eight roles to hide four buttons that were fine where they were.',
      'The whole bar is one tab stop, not one per menu. Every trigger takes tabindex="-1" except the one the roving focus is currently on, which takes 0. Skip this and a five-menu bar costs five Tab presses to walk past on the way to the document underneath it, on top of the thirty controls already in the form — which is the precise opposite of why the pattern exists. Tab enters the bar once, Left and Right walk the triggers, Down opens, and the next Tab leaves.',
      'Open on hover, but only once a menu is already open. Cold hover-opening a menubar means a pointer travelling diagonally from the sidebar to the first field of the form drops a panel over the document on the way past, and the user has to click somewhere harmless to get rid of it. Once something is open the bar is in menu mode and hovering a sibling switches to it without a click, because that is how the user got a menu open in the first place and clicking each one is tedious. The state that gates it is the open menu itself, so there is no timer and nothing to tune.',
      'When the open menu changes, move focus before the old panel is hidden. Hiding an element that contains document.activeElement drops focus onto <body>, and the next Tab restarts at the top of the document — usually the skip link, occasionally the browser chrome. Every path that changes which menu is open (Left, Right, typeahead, hover-switch) focuses the new trigger synchronously in the handler and only then writes the new open id, which Alpine flushes afterwards. Focus is on a visible element the whole time.',
      'role="menubar" is not navigation. A row of links to other pages is a <nav> of anchors, whatever it looks like — the menu roles promise a command model where arrow keys walk items, Escape closes and Enter fires an action against the thing on screen, and a link that navigates away honours none of that. Put menuitem on a set of links and a screen reader announces a menu of commands and then the first one leaves the page. That control is navigation-menu; this one is for commands.',
      'Disabled items stay in the walk. They take aria-disabled="true" and keep tabindex="-1", never the disabled attribute — a disabled button is not focusable and drops out of the query the arrow keys read the item order from, so the third press of Down lands on Duplicate line in one document and Delete line in another depending on whether there was anything to undo. A menubar is learned by position; commands that come and go destroy that. The item is also where the reason belongs: put "Nothing to undo" in the hint column where the shortcut would go, and the greyed row explains itself instead of being a dead end.',
      'A shortcut hint is aria-keyshortcuts, and the glyphs beside it are decoration. The visible column reads ⌘S or Ctrl S because that is what the user has to press; the attribute takes the formal syntax — aria-keyshortcuts="Control+S" — because that is what assistive technology parses and surfaces in its own shortcut list. Leave the glyphs in the accessible name and the item announces as "Save, command S" with the ⌘ read as whatever the synthesiser makes of an unmapped codepoint, so aria-hidden the span and let the attribute carry it. And the attribute is a claim: if nothing on the page listens for Control+S, do not write it.',
      'Escape closes the panel, returns focus to the trigger, and stops there. The handler is guarded on the open state and calls stopPropagation only when it actually closed something, so a second Escape does nothing here and passes through to whatever is outside — the dialog or the sheet the editor is sitting in. Without the guard the bar silently eats every Escape on the screen, and the only way out of the dialog is the mouse.',
      'Panels are x-cloak and z-40, and no ancestor may be overflow-hidden. Wrapping the editor card in overflow-hidden to keep its corners tidy clips every panel to the height of the bar, and the menu opens as a one-pixel sliver that looks like it failed to load. The panels also cannot be overflow-hidden themselves once anything flies out of them, so the rounded corner is protected by the panel\'s own py-1 instead: an item that never touches the corner never pokes a square tint through it.',
      'Toggling closes, choosing closes, ticking does not. An action item and a radio item both finish a decision the moment they are pressed, so both close the menu and hand focus back to the trigger. A checkbox item does not: nobody opens View to show exactly one column, and a menu that shuts after each tick has to be reopened four times to do one job. Focus stays on the item and aria-checked changes underneath it, which is announced because the item is the focused element.',
      'Below md it collapses to a single Menu button, and it stops being a menubar when it does. A wrapped bar is not a menubar — the second row reads as a separate control and Left and Right no longer match what the eye sees. The collapsed form drops role="menubar" entirely and becomes one button with one role="menu" panel, sections divided by role="group" labels, because a bar with one item in it is a lie told to a screen reader. Both forms are rendered from the same list in the template; maintained as two hand-written copies they drift within a sprint. The panels below md are a separate problem with a separate answer: give each menu wrapper relative max-md:static so that on a phone the panel anchors to the bar instead of to a trigger halfway along it. Anchor it to the trigger and the fourth menu opens 100px off the right of a 390px screen; anchor the last one right-0 to fix that and the first one hangs off the left.',
      'Do not let the menubar be the only route to a command. Save lives in File as an accelerator for the people who learn it, and the Save button at the foot of the form is the one everybody else presses. A command reachable only from a menu on a screen that also has a toolbar has been hidden, not organised, and the first support call is somebody insisting the feature was removed.'
    ],
    anatomy: [
      ['Bar', 'The role="menubar" strip itself, holding the roving-focus state, the typeahead buffer and which menu is open. It is the strip and nothing else — anything in the same row that is not a menu, a status or a Save button, sits outside it.'],
      ['Trigger', 'A button with role="menuitem" and aria-haspopup="menu". One of them carries tabindex="0" and the rest -1. While its menu is open it takes a bg-zinc-100 tint, because focus has moved into the panel and the trigger has no focus ring left to say which menu you are in.'],
      ['Panel', 'Absolutely positioned under its own trigger, z-40, x-cloak, role="menu" and named with the trigger\'s own word. Always left-0: the containing block is what changes on a phone, because the menu wrapper is relative max-md:static and the panel then anchors to the bar rather than to a trigger halfway along it.'],
      ['Item', 'A full-width button, role="menuitem", tabindex="-1", icon left of the label so the labels form one reading column. Real focus moves item to item; nothing here uses aria-activedescendant.'],
      ['Shortcut hint', 'A right-aligned 12px zinc-500 column, aria-hidden, with the real claim carried by aria-keyshortcuts on the item. Also where the reason goes on a disabled item, which is not aria-hidden because it is the explanation.'],
      ['Checkbox and radio item', 'role="menuitemcheckbox" and role="menuitemradio" with aria-checked bound, a fixed size-4 marker slot on the left so the labels stay aligned whether ticked or not, and radios wrapped in a role="group" that names the choice.'],
      ['Submenu', 'A second panel flying out of an item that carries aria-haspopup and aria-expanded of its own. One level deep, never two, and below md it drops beneath its trigger instead of flying off the side of the screen.'],
      ['Collapsed trigger', 'The single Menu button the whole bar becomes below md. Not a menubar of one — a plain menu whose sections are role="group" carrying the names the triggers used to have.']
    ],
    behaviour: [
      'Tab enters the bar once and the next Tab leaves it. Left and Right walk the triggers and wrap, Home and End jump to the ends, Down opens the menu onto its first item and Up opens it onto its last.',
      'Once a menu is open, hovering a sibling trigger switches to it with no click. From cold, hovering a trigger does nothing at all — the bar only enters menu mode when somebody asks it to.',
      'Left and Right from inside an open panel walk the bar rather than the items: the current menu closes, the next one opens, and focus lands on its trigger. It is the same gesture whether a panel is open or not, which is what makes it learnable, and Down enters the panel that is now open.',
      'Escape closes the panel and leaves focus on the trigger. Escape again does nothing and is not swallowed, so it reaches the dialog or sheet the editor may be sitting inside.',
      'Typing a letter on the bar moves to the trigger whose label starts with it, and keeps moving as more letters arrive inside half a second. The typeahead belongs to the bar only — inside an open panel the same keys do nothing, because the item list is short and reading it is faster than guessing at it.',
      'Choosing an action closes the menu and returns focus to the trigger. Ticking a checkbox item leaves the menu open and focus on the item, because View is opened to change three columns and not one.',
      'Disabled items keep their place and their keyboard position, and say why in the column where the shortcut would be. Nothing is removed from a menu because the document is in the wrong state; the map stays the same shape.',
      'Tab from inside a panel closes the menu and continues from the trigger, so the focus order after the bar is the document, not the third item of the File menu.',
      'Below md the bar collapses to one Menu button. It does not wrap, it does not scroll sideways, and it stops carrying menubar roles when it stops being a bar.'
    ],
    a11y: [
      'The strip is role="menubar", each trigger is a button with role="menuitem" and aria-haspopup="menu", and aria-expanded is bound to whether that menu is the open one. The panel is role="menu" and each row role="menuitem", menuitemcheckbox or menuitemradio.',
      'Exactly one trigger is in the tab order at a time: tabindex="0" on the one roving focus is on, -1 on the rest. This is the same roving tabindex a tablist uses and for the same reason — the set is one widget, so it is one stop.',
      'Focus is real focus, moved trigger to trigger and item to item. This is where a menu and a combobox part company: a combobox keeps focus in its text box and points at a row with aria-activedescendant, but a menuitem is the thing being operated, so it has to be the thing focused. It also means no path may ever hide a panel while focus is still inside it.',
      'Each panel is named with aria-label carrying the trigger\'s own word rather than aria-labelledby pointing at the trigger, because ids on a component that can appear twice on one page cross-wire, and the label is one word either way.',
      'Shortcuts are declared with aria-keyshortcuts in its formal syntax — Control+S, Shift+Control+Z — and the visible glyph column is aria-hidden so it does not join the accessible name. An item announces as "Save" with the shortcut exposed as a property, not as "Save command S".',
      'Disabled items use aria-disabled="true" and stay focusable. The disabled attribute would take them out of the tab-free arrow walk as well as out of the pointer, which changes the position of every item below them.',
      'Checkbox and radio items carry aria-checked bound to the state, never written once in markup, and a set of radio items is wrapped in role="group" with an aria-label naming the choice. A visible group heading inside a menu is aria-hidden, because a bare paragraph is not a permitted child of role="menu" and the group is already named.',
      'Anything in the same strip that is not a menu — a save indicator, a Submit button — sits outside the role="menubar" element. A non-menuitem child of a menubar is either dropped from the announced item count or reported as one of the menus, and both are worse than a plain button beside the bar.'
    ],
    related: ['dropdown', 'topbar', 'navigation-menu'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- The whole bar is one tab stop. Every trigger is tabindex -1 except the one
     roving focus is on, so Tab enters the bar once and the next Tab lands in
     the form below rather than on the Edit menu. That is the entire reason the
     menubar roles exist; a row of four ordinary buttons is four stops.

     to(id) is the only way focus moves along the bar, and the order matters:
     set the tab stop, focus the trigger synchronously, and only then write the
     new open id. Alpine flushes x-show after the handler returns, so the old
     panel is still visible at the moment focus lands. Write open first and the
     panel holding document.activeElement is hidden underneath it, focus falls
     to <body>, and the next Tab restarts at the top of the document.

     show() has to defer instead, because it focuses an item in a panel that is
     not displayed yet. $nextTick is too early — x-show has not written display
     when it runs, and focus() on a hidden button is a silent no-op — so the
     call sits in a requestAnimationFrame after it, as in the dropdown.

     Hover switches menus but never opens one: the guard is open !== null.
     Escape only stops propagating when it actually closed something, so a
     second Escape reaches the dialog this editor may be sitting in. -->
<div data-kui="menubar/default" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, at: 'file', typed: '', clock: null,
       trigs() { return [...this.$refs.bar.querySelectorAll('[data-menu]')] },
       items() {
         const p = this.$refs.bar.querySelector('[data-panel=' + this.open + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')] : [];
       },
       to(id) {
         this.at = id;
         this.trigs().find(t => t.dataset.menu === id)?.focus();
         if (this.open !== null) this.open = id;
       },
       show(id, last = false) {
         this.open = id; this.at = id;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       close(back = true) {
         if (this.open === null) return;
         const id = this.open; this.open = null;
         if (back) this.to(id);
       },
       step(n) {
         const t = this.trigs(), i = t.findIndex(e => e.dataset.menu === this.at);
         this.to(t[(i + n + t.length) % t.length].dataset.menu);
       },
       jump(last) { const t = this.trigs(); this.to((last ? t[t.length - 1] : t[0]).dataset.menu) },
       move(n) { const i = this.items(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       type(e) {
         if (!e.target.dataset.menu || e.key === ' ' || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
         clearTimeout(this.clock);
         this.typed += e.key.toLowerCase();
         this.clock = setTimeout(() => { this.typed = '' }, 500);
         const t = this.trigs().find(x => x.textContent.trim().toLowerCase().startsWith(this.typed));
         if (t) { e.preventDefault(); this.to(t.dataset.menu) }
       }
     }"
     @click.outside="close(false)"
     @keydown="type($event)"
     @keydown.escape="if (open !== null) { $event.stopPropagation(); close() }">

  <div x-ref="bar" role="menubar" aria-label="Purchase order commands"
       class="relative flex items-center gap-0.5 border-b border-zinc-100 px-1 py-1">

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="file"
              :aria-expanded="open === 'file'" :tabindex="at === 'file' ? 0 : -1"
              @click="open === 'file' ? close() : show('file')"
              @mouseenter="if (open !== null) to('file')"
              @keydown.arrow-down.prevent="show('file')" @keydown.arrow-up.prevent="show('file', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'file' && 'bg-zinc-200 text-zinc-900'">File</button>

      <div x-show="open === 'file'" x-cloak data-panel="file" role="menu" aria-label="File"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="file-plus" class="size-4 text-zinc-600"></i>New purchase order
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="save" class="size-4 text-zinc-600"></i>Save draft
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="send" class="size-4 text-zinc-600"></i>Submit for approval
        </button>

        <div role="separator" class="my-1 h-px bg-zinc-100"></div>

        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="file-text" class="size-4 text-zinc-600"></i>Export as PDF
        </button>
      </div>
    </div>

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="edit"
              :aria-expanded="open === 'edit'" :tabindex="at === 'edit' ? 0 : -1"
              @click="open === 'edit' ? close() : show('edit')"
              @mouseenter="if (open !== null) to('edit')"
              @keydown.arrow-down.prevent="show('edit')" @keydown.arrow-up.prevent="show('edit', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'edit' && 'bg-zinc-200 text-zinc-900'">Edit</button>

      <div x-show="open === 'edit'" x-cloak data-panel="edit" role="menu" aria-label="Edit"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="undo-2" class="size-4 text-zinc-600"></i>Undo
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="redo-2" class="size-4 text-zinc-600"></i>Redo
        </button>

        <div role="separator" class="my-1 h-px bg-zinc-100"></div>

        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="rows-3" class="size-4 text-zinc-600"></i>Insert line
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="copy" class="size-4 text-zinc-600"></i>Duplicate line
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="search" class="size-4 text-zinc-600"></i>Find item code
        </button>
      </div>
    </div>

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="view"
              :aria-expanded="open === 'view'" :tabindex="at === 'view' ? 0 : -1"
              @click="open === 'view' ? close() : show('view')"
              @mouseenter="if (open !== null) to('view')"
              @keydown.arrow-down.prevent="show('view')" @keydown.arrow-up.prevent="show('view', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'view' && 'bg-zinc-200 text-zinc-900'">View</button>

      <div x-show="open === 'view'" x-cloak data-panel="view" role="menu" aria-label="View"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="columns-3" class="size-4 text-zinc-600"></i>Columns
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="percent" class="size-4 text-zinc-600"></i>Tax breakup
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="history" class="size-4 text-zinc-600"></i>Revision history
        </button>
      </div>
    </div>

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="help"
              :aria-expanded="open === 'help'" :tabindex="at === 'help' ? 0 : -1"
              @click="open === 'help' ? close() : show('help')"
              @mouseenter="if (open !== null) to('help')"
              @keydown.arrow-down.prevent="show('help')" @keydown.arrow-up.prevent="show('help', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'help' && 'bg-zinc-200 text-zinc-900'">Help</button>

      <!-- Every panel is left-0, including this one, and the phone case is
           handled by the wrapper instead: relative max-md:static. Below md the
           menu wrapper stops being a containing block, so left-0 resolves
           against the bar and every menu opens flush under its left edge
           regardless of how far along the bar its trigger sits. Measured at
           390px, a 240px panel hung off a trigger 250px along runs 100px off
           the screen and the page scrolls sideways to find it; right-0 fixes
           that trigger and breaks the first one, which then hangs off the left.
           The wrapper trick has no such asymmetry and needs no per-menu
           class. -->
      <div x-show="open === 'help'" x-cloak data-panel="help" role="menu" aria-label="Help"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="keyboard" class="size-4 text-zinc-600"></i>Keyboard shortcuts
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="scale" class="size-4 text-zinc-600"></i>Approval policy
        </button>
      </div>
    </div>
  </div>

  <div class="px-4 py-3">
    <h2 class="text-[16px]/6 font-semibold tabular-nums">PO-24-1187 — Gujarat Polymers Ltd</h2>
    <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Draft · 14 lines · ₹18,42,000 before tax · raised 16 Aug 2026 by Ritu Deshpande</p>
  </div>
</div>` },

      { id: 'shortcuts', name: 'With shortcut hints', code:
`<!-- The hint column is aria-hidden and the real claim is aria-keyshortcuts on
     the item, in its formal syntax — Control+Shift+Z, not the glyphs. Left in
     the accessible name the item announces as "Redo Ctrl Shift Z" every time
     the arrows pass over it, and on a Mac build the ⌘ is read as whatever the
     synthesiser makes of an unmapped codepoint. The attribute is also a
     promise: it says a handler on this page listens for that chord. If none
     does, do not write it — the screen reader lists the shortcut in its own
     inventory and the user presses it into silence.

     The hints say Ctrl because these people are on Windows. An application
     serving both platforms computes the word once at boot and renders it from
     the list; writing two columns and hiding one is how a menu ends up
     claiming Ctrl S on a Mac.

     The panel is a list of groups rather than a flat list with separator
     elements dropped into it, because the rule is the group boundary. Modelled
     this way a group that empties out — every command in it hidden by a
     permission check — takes its own rule with it. role="group" is a permitted
     child of role="menu"; a bare div is not. -->
<div data-kui="menubar/shortcuts" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, at: 'file', typed: '', clock: null,
       menus: [
         { id: 'file', label: 'File', groups: [
           [ { label: 'New purchase order', icon: 'file-plus', hint: 'Ctrl N', keys: 'Control+N' },
             { label: 'Save draft',         icon: 'save',      hint: 'Ctrl S', keys: 'Control+S' },
             { label: 'Submit for approval', icon: 'send' } ],
           [ { label: 'Print', icon: 'printer', hint: 'Ctrl P', keys: 'Control+P' },
             { label: 'Export as PDF', icon: 'file-text' } ]
         ] },
         { id: 'edit', label: 'Edit', groups: [
           [ { label: 'Undo', icon: 'undo-2', hint: 'Ctrl Z', keys: 'Control+Z' },
             { label: 'Redo', icon: 'redo-2', hint: 'Ctrl Shift Z', keys: 'Shift+Control+Z' } ],
           [ { label: 'Insert line',    icon: 'rows-3', hint: 'Ctrl Enter', keys: 'Control+Enter' },
             { label: 'Duplicate line', icon: 'copy',   hint: 'Ctrl D',     keys: 'Control+D' },
             { label: 'Find item code', icon: 'search', hint: 'Ctrl F',     keys: 'Control+F' } ]
         ] },
         { id: 'view', label: 'View', groups: [
           [ { label: 'Tax breakup',      icon: 'percent' },
             { label: 'Revision history', icon: 'history' } ]
         ] }
       ],
       trigs() { return [...this.$refs.bar.querySelectorAll('[data-menu]')] },
       items() {
         const p = this.$refs.bar.querySelector('[data-panel=' + this.open + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')] : [];
       },
       to(id) {
         this.at = id;
         this.trigs().find(t => t.dataset.menu === id)?.focus();
         if (this.open !== null) this.open = id;
       },
       show(id, last = false) {
         this.open = id; this.at = id;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       close(back = true) {
         if (this.open === null) return;
         const id = this.open; this.open = null;
         if (back) this.to(id);
       },
       step(n) {
         const t = this.trigs(), i = t.findIndex(e => e.dataset.menu === this.at);
         this.to(t[(i + n + t.length) % t.length].dataset.menu);
       },
       jump(last) { const t = this.trigs(); this.to((last ? t[t.length - 1] : t[0]).dataset.menu) },
       move(n) { const i = this.items(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       type(e) {
         if (!e.target.dataset.menu || e.key === ' ' || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
         clearTimeout(this.clock);
         this.typed += e.key.toLowerCase();
         this.clock = setTimeout(() => { this.typed = '' }, 500);
         const t = this.trigs().find(x => x.textContent.trim().toLowerCase().startsWith(this.typed));
         if (t) { e.preventDefault(); this.to(t.dataset.menu) }
       }
     }"
     @click.outside="close(false)"
     @keydown="type($event)"
     @keydown.escape="if (open !== null) { $event.stopPropagation(); close() }">

  <div x-ref="bar" role="menubar" aria-label="Purchase order commands"
       class="relative flex items-center gap-0.5 border-b border-zinc-100 px-1 py-1">
    <template x-for="m in menus" :key="m.id">
      <div class="relative max-md:static">
        <button type="button" role="menuitem" aria-haspopup="menu" :data-menu="m.id"
                :aria-expanded="open === m.id" :tabindex="at === m.id ? 0 : -1"
                @click="open === m.id ? close() : show(m.id)"
                @mouseenter="if (open !== null) to(m.id)"
                @keydown.arrow-down.prevent="show(m.id)" @keydown.arrow-up.prevent="show(m.id, true)"
                @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
                @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
                class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="open === m.id && 'bg-zinc-200 text-zinc-900'" x-text="m.label"></button>

        <div x-show="open === m.id" x-cloak :data-panel="m.id" role="menu" :aria-label="m.label"
             @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
             @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
             @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
             @keydown.tab="close()"
             class="absolute top-full left-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          <template x-for="(g, gi) in m.groups" :key="gi">
            <div role="group" x-show="g.length" class="border-t border-zinc-100 py-1 first:border-t-0">
              <template x-for="it in g" :key="it.label">
                <button type="button" role="menuitem" tabindex="-1" :aria-keyshortcuts="it.keys" @click="close()"
                        class="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                  <span class="flex text-zinc-600"><i :data-lucide="it.icon" class="size-4"></i></span>
                  <span x-text="it.label"></span>
                  <span aria-hidden="true" class="ml-auto shrink-0 pl-6 text-[12px]/4 tabular-nums text-zinc-500" x-text="it.hint"></span>
                </button>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>

  <div class="px-4 py-3">
    <h2 class="text-[16px]/6 font-semibold tabular-nums">PO-24-1187 — Gujarat Polymers Ltd</h2>
    <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Draft · 14 lines · ₹18,42,000 before tax</p>
  </div>
</div>` },

      { id: 'checks', name: 'Checkbox and radio items', code:
`<!-- One View menu carrying both kinds of state, behaving differently on
     purpose. The column toggles are role="menuitemcheckbox" and do not close
     the menu: nobody opens View to show exactly one column, and a menu that
     shuts after every tick is reopened three times to do one job. The density
     options are role="menuitemradio" and do close, because one of a set is a
     finished decision the moment it is made.

     Leaving it open is only safe because focus stays on the item pressed.
     aria-checked changes on the focused element, which is announced; change it
     on an element nobody is on and the tick is silent. Nothing writes
     aria-checked as a literal — bound, or it goes stale the first time the
     item is used and the menu announces the opposite of what it shows.

     Every row starts with a fixed size-4 marker slot, empty or not. Add the
     tick only when checked and the label column shifts 24px as the state
     changes. State is a check and a 6px disc rather than a tinted row, because
     a tinted row cannot be told from the row the arrows are on.

     The visible group headings are aria-hidden — a bare <p> is not a permitted
     child of role="menu", and role="group" already carries the name. -->
<div data-kui="menubar/checks" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, at: 'file', typed: '', clock: null,
       cols: { hsn: true, contract: false, tax: true },
       density: 'comfortable',
       trigs() { return [...this.$refs.bar.querySelectorAll('[data-menu]')] },
       items() {
         const p = this.$refs.bar.querySelector('[data-panel=' + this.open + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')] : [];
       },
       to(id) {
         this.at = id;
         this.trigs().find(t => t.dataset.menu === id)?.focus();
         if (this.open !== null) this.open = id;
       },
       show(id, last = false) {
         this.open = id; this.at = id;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       close(back = true) {
         if (this.open === null) return;
         const id = this.open; this.open = null;
         if (back) this.to(id);
       },
       step(n) {
         const t = this.trigs(), i = t.findIndex(e => e.dataset.menu === this.at);
         this.to(t[(i + n + t.length) % t.length].dataset.menu);
       },
       jump(last) { const t = this.trigs(); this.to((last ? t[t.length - 1] : t[0]).dataset.menu) },
       move(n) { const i = this.items(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       type(e) {
         if (!e.target.dataset.menu || e.key === ' ' || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
         clearTimeout(this.clock);
         this.typed += e.key.toLowerCase();
         this.clock = setTimeout(() => { this.typed = '' }, 500);
         const t = this.trigs().find(x => x.textContent.trim().toLowerCase().startsWith(this.typed));
         if (t) { e.preventDefault(); this.to(t.dataset.menu) }
       }
     }"
     @click.outside="close(false)"
     @keydown="type($event)"
     @keydown.escape="if (open !== null) { $event.stopPropagation(); close() }">

  <div x-ref="bar" role="menubar" aria-label="Bill of materials commands"
       class="relative flex items-center gap-0.5 border-b border-zinc-100 px-1 py-1">

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="file"
              :aria-expanded="open === 'file'" :tabindex="at === 'file' ? 0 : -1"
              @click="open === 'file' ? close() : show('file')"
              @mouseenter="if (open !== null) to('file')"
              @keydown.arrow-down.prevent="show('file')" @keydown.arrow-up.prevent="show('file', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'file' && 'bg-zinc-200 text-zinc-900'">File</button>

      <div x-show="open === 'file'" x-cloak data-panel="file" role="menu" aria-label="File"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="save" class="size-4 text-zinc-600"></i>Save revision
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="sheet" class="size-4 text-zinc-600"></i>Export to Excel
        </button>
      </div>
    </div>

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="view"
              :aria-expanded="open === 'view'" :tabindex="at === 'view' ? 0 : -1"
              @click="open === 'view' ? close() : show('view')"
              @mouseenter="if (open !== null) to('view')"
              @keydown.arrow-down.prevent="show('view')" @keydown.arrow-up.prevent="show('view', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'view' && 'bg-zinc-200 text-zinc-900'">View</button>

      <div x-show="open === 'view'" x-cloak data-panel="view" role="menu" aria-label="View"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

        <div role="group" aria-label="Columns" class="py-1">
          <p aria-hidden="true" class="px-3 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Columns</p>

          <button type="button" role="menuitemcheckbox" tabindex="-1" :aria-checked="cols.hsn" @click="cols.hsn = !cols.hsn"
                  class="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
            <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
              <span x-show="cols.hsn" x-cloak class="flex"><i data-lucide="check" class="size-4"></i></span>
            </span>HSN code
          </button>
          <button type="button" role="menuitemcheckbox" tabindex="-1" :aria-checked="cols.contract" @click="cols.contract = !cols.contract"
                  class="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
            <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
              <span x-show="cols.contract" x-cloak class="flex"><i data-lucide="check" class="size-4"></i></span>
            </span>Rate contract
          </button>
          <button type="button" role="menuitemcheckbox" tabindex="-1" :aria-checked="cols.tax" @click="cols.tax = !cols.tax"
                  class="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
            <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
              <span x-show="cols.tax" x-cloak class="flex"><i data-lucide="check" class="size-4"></i></span>
            </span>Tax breakup
          </button>
        </div>

        <div role="group" aria-label="Density" class="border-t border-zinc-100 py-1">
          <p aria-hidden="true" class="px-3 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Density</p>

          <button type="button" role="menuitemradio" tabindex="-1" :aria-checked="density === 'comfortable'" @click="density = 'comfortable'; close()"
                  class="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
            <span class="flex size-4 shrink-0 items-center justify-center">
              <span x-show="density === 'comfortable'" x-cloak class="size-1.5 rounded-full bg-zinc-700"></span>
            </span>Comfortable
          </button>
          <button type="button" role="menuitemradio" tabindex="-1" :aria-checked="density === 'compact'" @click="density = 'compact'; close()"
                  class="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
            <span class="flex size-4 shrink-0 items-center justify-center">
              <span x-show="density === 'compact'" x-cloak class="size-1.5 rounded-full bg-zinc-700"></span>
            </span>Compact
          </button>
        </div>
      </div>
    </div>

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="help"
              :aria-expanded="open === 'help'" :tabindex="at === 'help' ? 0 : -1"
              @click="open === 'help' ? close() : show('help')"
              @mouseenter="if (open !== null) to('help')"
              @keydown.arrow-down.prevent="show('help')" @keydown.arrow-up.prevent="show('help', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'help' && 'bg-zinc-200 text-zinc-900'">Help</button>

      <div x-show="open === 'help'" x-cloak data-panel="help" role="menu" aria-label="Help"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="keyboard" class="size-4 text-zinc-600"></i>Keyboard shortcuts
        </button>
      </div>
    </div>
  </div>

  <div class="px-4 py-3 text-[13px]/5 tabular-nums text-zinc-600">
    BOM-HDPE-08 · 22 components ·
    <span x-text="density === 'compact' ? 'compact' : 'comfortable'"></span> rows ·
    <span x-text="[cols.hsn && 'HSN', cols.contract && 'rate contract', cols.tax && 'tax'].filter(Boolean).join(', ') || 'no optional columns'"></span>
  </div>
</div>` },

      { id: 'submenu', name: 'With a submenu', code:
`<!-- One level of submenu, never two. Two levels means holding a diagonal
     across two live panels, and the fix for that is a dialog with a search box,
     not a third flyout.

     items() had to grow a filter. querySelectorAll is deep, so the parent
     panel's item list picked up the rows inside the flyout as well and Down
     from Save fell straight into last Tuesday's order. Excluding anything
     inside [data-sub] puts the walk back on the parent's own rows.

     The submenu keys carry .stop as well as .prevent. Every handler here lives
     on an ancestor of the flyout — the panel binds Left and Right to walk the
     bar, the root binds Escape — so without .stop, Left closes the submenu and
     also jumps to the previous menu, and Escape closes two levels in one press.

     move() clears sub, or arrowing past the submenu trigger leaves a flyout on
     screen belonging to a row nobody is on. There is no safe triangle and no
     hover delay, so the flyout is anchored hard against the parent's edge and
     every sibling row closes it on mouseenter. Below md it drops under its
     trigger instead of flying sideways: left-full at 390px puts a 256px panel
     off the right of the screen and the page scrolls to find it. -->
<div data-kui="menubar/submenu" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, sub: null, at: 'file', typed: '', clock: null,
       trigs() { return [...this.$refs.bar.querySelectorAll('[data-menu]')] },
       items() {
         const p = this.$refs.bar.querySelector('[data-panel=' + this.open + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')].filter(e => !e.closest('[data-sub]')) : [];
       },
       subItems() {
         const p = this.$refs.bar.querySelector('[data-sub=' + this.sub + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')] : [];
       },
       to(id) {
         this.at = id; this.sub = null;
         this.trigs().find(t => t.dataset.menu === id)?.focus();
         if (this.open !== null) this.open = id;
       },
       show(id, last = false) {
         this.open = id; this.at = id; this.sub = null;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       close(back = true) {
         if (this.open === null) return;
         const id = this.open; this.open = null; this.sub = null;
         if (back) this.to(id);
       },
       openSub(id) {
         this.sub = id;
         this.$nextTick(() => requestAnimationFrame(() => this.subItems()[0]?.focus()));
       },
       closeSub() {
         const id = this.sub; this.sub = null;
         this.$refs.bar.querySelector('[data-subtrigger=' + id + ']')?.focus();
       },
       step(n) {
         const t = this.trigs(), i = t.findIndex(e => e.dataset.menu === this.at);
         this.to(t[(i + n + t.length) % t.length].dataset.menu);
       },
       jump(last) { const t = this.trigs(); this.to((last ? t[t.length - 1] : t[0]).dataset.menu) },
       move(n) { this.sub = null; const i = this.items(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       edge(last) { this.sub = null; const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       subMove(n) { const i = this.subItems(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       type(e) {
         if (!e.target.dataset.menu || e.key === ' ' || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
         clearTimeout(this.clock);
         this.typed += e.key.toLowerCase();
         this.clock = setTimeout(() => { this.typed = '' }, 500);
         const t = this.trigs().find(x => x.textContent.trim().toLowerCase().startsWith(this.typed));
         if (t) { e.preventDefault(); this.to(t.dataset.menu) }
       }
     }"
     @click.outside="close(false)"
     @keydown="type($event)"
     @keydown.escape="if (open !== null) { $event.stopPropagation(); close() }">

  <div x-ref="bar" role="menubar" aria-label="Purchase order commands"
       class="relative flex items-center gap-0.5 border-b border-zinc-100 px-1 py-1">

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="file"
              :aria-expanded="open === 'file'" :tabindex="at === 'file' ? 0 : -1"
              @click="open === 'file' ? close() : show('file')"
              @mouseenter="if (open !== null) to('file')"
              @keydown.arrow-down.prevent="show('file')" @keydown.arrow-up.prevent="show('file', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'file' && 'bg-zinc-200 text-zinc-900'">File</button>

      <div x-show="open === 'file'" x-cloak data-panel="file" role="menu" aria-label="File"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

        <button type="button" role="menuitem" tabindex="-1" @click="close()" @mouseenter="sub = null"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="file-plus" class="size-4 text-zinc-600"></i>New purchase order
        </button>

        <div class="relative">
          <button type="button" role="menuitem" tabindex="-1" aria-haspopup="menu" data-subtrigger="recent"
                  :aria-expanded="sub === 'recent'"
                  @click="openSub('recent')" @mouseenter="sub = 'recent'"
                  @keydown.arrow-right.prevent.stop="openSub('recent')"
                  class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700"
                  :class="sub === 'recent' && 'bg-zinc-200'">
            <i data-lucide="clock" class="size-4 text-zinc-600"></i>Open recent
            <span class="ml-auto flex text-zinc-600"><i data-lucide="chevron-right" class="size-3.5"></i></span>
          </button>

          <div x-show="sub === 'recent'" x-cloak data-sub="recent" role="menu" aria-label="Open recent"
               @keydown.arrow-down.prevent.stop="subMove(1)" @keydown.arrow-up.prevent.stop="subMove(-1)"
               @keydown.arrow-left.prevent.stop="closeSub()"
               @keydown.escape.stop="closeSub()"
               @keydown.tab="close()"
               class="absolute top-0 left-full z-40 ml-1 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg max-md:top-full max-md:left-0 max-md:mt-1 max-md:ml-0">
            <button type="button" role="menuitem" tabindex="-1" @click="close()"
                    class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px]/5 tabular-nums hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
              <span>PO-24-1187 — Gujarat Polymers</span><span class="shrink-0 text-[12px]/4 text-zinc-500">16 Aug</span>
            </button>
            <button type="button" role="menuitem" tabindex="-1" @click="close()"
                    class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px]/5 tabular-nums hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
              <span>PO-24-1179 — Sharma Steel</span><span class="shrink-0 text-[12px]/4 text-zinc-500">11 Aug</span>
            </button>
            <button type="button" role="menuitem" tabindex="-1" @click="close()"
                    class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px]/5 tabular-nums hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
              <span>PO-24-1166 — Deccan Fasteners</span><span class="shrink-0 text-[12px]/4 text-zinc-500">4 Aug</span>
            </button>
          </div>
        </div>

        <button type="button" role="menuitem" tabindex="-1" @click="close()" @mouseenter="sub = null"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="save" class="size-4 text-zinc-600"></i>Save draft
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()" @mouseenter="sub = null"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print
        </button>
      </div>
    </div>

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="edit"
              :aria-expanded="open === 'edit'" :tabindex="at === 'edit' ? 0 : -1"
              @click="open === 'edit' ? close() : show('edit')"
              @mouseenter="if (open !== null) to('edit')"
              @keydown.arrow-down.prevent="show('edit')" @keydown.arrow-up.prevent="show('edit', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'edit' && 'bg-zinc-200 text-zinc-900'">Edit</button>

      <div x-show="open === 'edit'" x-cloak data-panel="edit" role="menu" aria-label="Edit"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="rows-3" class="size-4 text-zinc-600"></i>Insert line
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="search" class="size-4 text-zinc-600"></i>Find item code
        </button>
      </div>
    </div>
  </div>

  <div class="px-4 py-3">
    <p class="text-[13px]/5 tabular-nums text-zinc-600">PO-24-1187 · 14 lines · ₹18,42,000 before tax</p>
  </div>
</div>` },

      { id: 'states', name: 'Disabled and destructive items', code:
`<!-- Disabled items keep their place in the keyboard walk. They carry
     aria-disabled="true" and keep tabindex="-1", never the disabled attribute:
     a disabled button cannot be focused and drops out of the querySelectorAll
     the arrows read the order from, so the third Down lands on Insert line in
     a document that has been edited and on Duplicate line in one that has not.
     A menubar is learned by position, and a list whose length depends on the
     state of the record is a list nobody can learn.

     Because they stay reachable, they get to explain themselves. The hint
     column on a disabled row carries the reason instead of a shortcut —
     "Nothing to undo", "GRN posted 12 Aug" — and that text is not aria-hidden,
     because unlike a glyph it is the answer to the question the greyed row
     raises. A dead grey row with nothing beside it sends people to the desk.

     opacity-60 drains icon, label and reason in one go rather than three colour
     classes kept in step by hand, and the hover tint is dropped so the pointer
     does not promise a click that does nothing. Focus still shows.

     Void order is last, below its own rule, in red-600, named by its verb
     rather than by its colour, and not adjacent to Print. -->
<div data-kui="menubar/states" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, at: 'file', typed: '', clock: null,
       trigs() { return [...this.$refs.bar.querySelectorAll('[data-menu]')] },
       items() {
         const p = this.$refs.bar.querySelector('[data-panel=' + this.open + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')] : [];
       },
       to(id) {
         this.at = id;
         this.trigs().find(t => t.dataset.menu === id)?.focus();
         if (this.open !== null) this.open = id;
       },
       show(id, last = false) {
         this.open = id; this.at = id;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       close(back = true) {
         if (this.open === null) return;
         const id = this.open; this.open = null;
         if (back) this.to(id);
       },
       step(n) {
         const t = this.trigs(), i = t.findIndex(e => e.dataset.menu === this.at);
         this.to(t[(i + n + t.length) % t.length].dataset.menu);
       },
       jump(last) { const t = this.trigs(); this.to((last ? t[t.length - 1] : t[0]).dataset.menu) },
       move(n) { const i = this.items(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       type(e) {
         if (!e.target.dataset.menu || e.key === ' ' || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
         clearTimeout(this.clock);
         this.typed += e.key.toLowerCase();
         this.clock = setTimeout(() => { this.typed = '' }, 500);
         const t = this.trigs().find(x => x.textContent.trim().toLowerCase().startsWith(this.typed));
         if (t) { e.preventDefault(); this.to(t.dataset.menu) }
       }
     }"
     @click.outside="close(false)"
     @keydown="type($event)"
     @keydown.escape="if (open !== null) { $event.stopPropagation(); close() }">

  <div x-ref="bar" role="menubar" aria-label="Purchase order commands"
       class="relative flex items-center gap-0.5 border-b border-zinc-100 px-1 py-1">

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="file"
              :aria-expanded="open === 'file'" :tabindex="at === 'file' ? 0 : -1"
              @click="open === 'file' ? close() : show('file')"
              @mouseenter="if (open !== null) to('file')"
              @keydown.arrow-down.prevent="show('file')" @keydown.arrow-up.prevent="show('file', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'file' && 'bg-zinc-200 text-zinc-900'">File</button>

      <div x-show="open === 'file'" x-cloak data-panel="file" role="menu" aria-label="File"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="save" class="size-4 text-zinc-600"></i>Save draft
          <span aria-hidden="true" class="ml-auto shrink-0 pl-6 text-[12px]/4 text-zinc-500">Ctrl S</span>
        </button>

        <button type="button" role="menuitem" tabindex="-1" aria-disabled="true" @click.prevent
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 opacity-60 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="send" class="size-4 text-zinc-600"></i>Submit for approval
          <span class="ml-auto shrink-0 pl-6 text-[12px]/4 text-zinc-500">2 lines have no rate</span>
        </button>

        <div role="separator" class="my-1 h-px bg-zinc-100"></div>

        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print
          <span aria-hidden="true" class="ml-auto shrink-0 pl-6 text-[12px]/4 text-zinc-500">Ctrl P</span>
        </button>

        <div role="separator" class="my-1 h-px bg-zinc-100"></div>

        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="ban" class="size-4"></i>Void order
        </button>
      </div>
    </div>

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="edit"
              :aria-expanded="open === 'edit'" :tabindex="at === 'edit' ? 0 : -1"
              @click="open === 'edit' ? close() : show('edit')"
              @mouseenter="if (open !== null) to('edit')"
              @keydown.arrow-down.prevent="show('edit')" @keydown.arrow-up.prevent="show('edit', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'edit' && 'bg-zinc-200 text-zinc-900'">Edit</button>

      <div x-show="open === 'edit'" x-cloak data-panel="edit" role="menu" aria-label="Edit"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" aria-disabled="true" @click.prevent
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 opacity-60 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="undo-2" class="size-4 text-zinc-600"></i>Undo
          <span class="ml-auto shrink-0 pl-6 text-[12px]/4 text-zinc-500">Nothing to undo</span>
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="rows-3" class="size-4 text-zinc-600"></i>Insert line
          <span aria-hidden="true" class="ml-auto shrink-0 pl-6 text-[12px]/4 text-zinc-500">Ctrl Enter</span>
        </button>
        <button type="button" role="menuitem" tabindex="-1" aria-disabled="true" @click.prevent
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 opacity-60 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="trash-2" class="size-4 text-zinc-600"></i>Delete line 6
          <span class="ml-auto shrink-0 pl-6 text-[12px]/4 tabular-nums text-zinc-500">GRN posted 12 Aug</span>
        </button>
      </div>
    </div>

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="help"
              :aria-expanded="open === 'help'" :tabindex="at === 'help' ? 0 : -1"
              @click="open === 'help' ? close() : show('help')"
              @mouseenter="if (open !== null) to('help')"
              @keydown.arrow-down.prevent="show('help')" @keydown.arrow-up.prevent="show('help', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'help' && 'bg-zinc-200 text-zinc-900'">Help</button>

      <div x-show="open === 'help'" x-cloak data-panel="help" role="menu" aria-label="Help"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="scale" class="size-4 text-zinc-600"></i>Approval policy
        </button>
      </div>
    </div>
  </div>

  <div class="px-4 py-3">
    <p class="text-[13px]/5 tabular-nums text-zinc-600">PO-24-1187 · Gujarat Polymers Ltd · 2 of 14 lines have no rate</p>
  </div>
</div>` },

      { id: 'dense', name: 'Dense, embedded in an editor', code:
`<!-- The bar an editor gets when it is a panel inside a bigger screen rather
     than the screen itself — a BOM grid sitting in the right half of a
     list-and-detail, where a 40px strip of chrome above a 300px grid is the
     wrong proportion.

     Only the bar shrinks. The triggers go to 12px on py-1, which lands them at
     exactly 24px — the WCAG 2.2 target minimum and not a pixel under it, which
     is why the padding is py-1 and not py-0.5. The panels stay at their normal
     size, because the reason for the dense bar is the strip, not the menu: a
     28px row in a flyout is harder to hit than a 24px trigger in a fixed strip
     the pointer already knows the position of, and nothing is gained by
     shrinking a panel that only exists while it is being read.

     The panels are still w-56 and still hang below a 32px bar, so they overlap
     the grid underneath. That is what z-40 is for, and it is also why the card
     around the editor cannot be overflow-hidden — clip it and the menu opens
     as a sliver the height of the bar.

     Below md this is the first thing to collapse, not the last: a dense bar is
     already at the target-size floor, so there is nothing left to give. -->
<div data-kui="menubar/dense" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, at: 'file', typed: '', clock: null,
       menus: [
         { id: 'file', label: 'File', items: [
           { label: 'Save revision', icon: 'save', hint: 'Ctrl S', keys: 'Control+S' },
           { label: 'Export to Excel', icon: 'sheet' }
         ] },
         { id: 'edit', label: 'Edit', items: [
           { label: 'Add component', icon: 'plus', hint: 'Ctrl Enter', keys: 'Control+Enter' },
           { label: 'Replace item', icon: 'repeat' },
           { label: 'Recalculate cost', icon: 'calculator', hint: 'F9', keys: 'F9' }
         ] },
         { id: 'view', label: 'View', items: [
           { label: 'Expand all levels', icon: 'chevrons-down-up' },
           { label: 'Scrap and yield', icon: 'percent' }
         ] }
       ],
       trigs() { return [...this.$refs.bar.querySelectorAll('[data-menu]')] },
       items() {
         const p = this.$refs.bar.querySelector('[data-panel=' + this.open + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')] : [];
       },
       to(id) {
         this.at = id;
         this.trigs().find(t => t.dataset.menu === id)?.focus();
         if (this.open !== null) this.open = id;
       },
       show(id, last = false) {
         this.open = id; this.at = id;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       close(back = true) {
         if (this.open === null) return;
         const id = this.open; this.open = null;
         if (back) this.to(id);
       },
       step(n) {
         const t = this.trigs(), i = t.findIndex(e => e.dataset.menu === this.at);
         this.to(t[(i + n + t.length) % t.length].dataset.menu);
       },
       jump(last) { const t = this.trigs(); this.to((last ? t[t.length - 1] : t[0]).dataset.menu) },
       move(n) { const i = this.items(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       type(e) {
         if (!e.target.dataset.menu || e.key === ' ' || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
         clearTimeout(this.clock);
         this.typed += e.key.toLowerCase();
         this.clock = setTimeout(() => { this.typed = '' }, 500);
         const t = this.trigs().find(x => x.textContent.trim().toLowerCase().startsWith(this.typed));
         if (t) { e.preventDefault(); this.to(t.dataset.menu) }
       }
     }"
     @click.outside="close(false)"
     @keydown="type($event)"
     @keydown.escape="if (open !== null) { $event.stopPropagation(); close() }">

  <div x-ref="bar" role="menubar" aria-label="Bill of materials commands"
       class="relative flex h-8 items-center gap-0.5 border-b border-zinc-100 px-1">
    <template x-for="m in menus" :key="m.id">
      <div class="relative max-md:static">
        <button type="button" role="menuitem" aria-haspopup="menu" :data-menu="m.id"
                :aria-expanded="open === m.id" :tabindex="at === m.id ? 0 : -1"
                @click="open === m.id ? close() : show(m.id)"
                @mouseenter="if (open !== null) to(m.id)"
                @keydown.arrow-down.prevent="show(m.id)" @keydown.arrow-up.prevent="show(m.id, true)"
                @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
                @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
                class="rounded px-2 py-1 text-[12px]/4 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="open === m.id && 'bg-zinc-200 text-zinc-900'" x-text="m.label"></button>

        <div x-show="open === m.id" x-cloak :data-panel="m.id" role="menu" :aria-label="m.label"
             @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
             @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
             @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
             @keydown.tab="close()"
             class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          <template x-for="it in m.items" :key="it.label">
            <button type="button" role="menuitem" tabindex="-1" :aria-keyshortcuts="it.keys" @click="close()"
                    class="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
              <span class="flex text-zinc-600"><i :data-lucide="it.icon" class="size-4"></i></span>
              <span x-text="it.label"></span>
              <span aria-hidden="true" class="ml-auto shrink-0 pl-6 text-[12px]/4 tabular-nums text-zinc-500" x-text="it.hint"></span>
            </button>
          </template>
        </div>
      </div>
    </template>
  </div>

  <table class="w-full text-[12px]/4">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-left text-zinc-600">
      <tr><th class="px-3 py-1.5 font-medium">Component</th><th class="px-3 py-1.5 text-right font-medium">Qty</th><th class="px-3 py-1.5 text-right font-medium">Cost</th></tr>
    </thead>
    <tbody class="divide-y divide-zinc-100">
      <tr><td class="px-3 py-1.5">HDPE granules — grade 5200B</td><td class="px-3 py-1.5 text-right tabular-nums">840 kg</td><td class="px-3 py-1.5 text-right tabular-nums">₹92,400</td></tr>
      <tr><td class="px-3 py-1.5">Masterbatch — natural</td><td class="px-3 py-1.5 text-right tabular-nums">18 kg</td><td class="px-3 py-1.5 text-right tabular-nums">₹7,020</td></tr>
      <tr><td class="px-3 py-1.5">Carton 400×300×250</td><td class="px-3 py-1.5 text-right tabular-nums">120 nos</td><td class="px-3 py-1.5 text-right tabular-nums">₹4,560</td></tr>
    </tbody>
  </table>
</div>` },

      { id: 'collapsed', name: 'Collapsed to one button', code:
`<!-- Below md the bar is gone and one Menu button stands in its place. A
     wrapped menubar is not a menubar: the second row reads as a separate
     control, and Left and Right stop matching what the eye sees. Scrolling it
     sideways is worse — the claim of the pattern is that the commands are all
     visible at once.

     The collapsed form drops role="menubar" with the bar. What is left is one
     button and one role="menu", the menu names carried by role="group" labels
     inside it. A menubar with one item in it is a lie: a screen reader
     announces a bar of menus, there is only ever one, and Left and Right do
     nothing when the user tries them. The roles change with the shape.

     Both forms come out of the same menus array, which is the only way they
     stay in step — a command added to File on the desktop bar and forgotten on
     the phone is invisible to exactly the people who cannot find it elsewhere.
     The cost is real: every command exists twice in the DOM, once hidden. Fine
     for four menus of five items, not for forty commands, where the phone
     answer is a page.

     The breakpoint is md, not sm: what overflows is the count, not the width. -->
<div data-kui="menubar/collapsed" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, at: 'file', sheet: false, typed: '', clock: null,
       menus: [
         { id: 'file', label: 'File', items: [
           { label: 'New purchase order', icon: 'file-plus' },
           { label: 'Save draft', icon: 'save' },
           { label: 'Submit for approval', icon: 'send' }
         ] },
         { id: 'edit', label: 'Edit', items: [
           { label: 'Insert line', icon: 'rows-3' },
           { label: 'Duplicate line', icon: 'copy' }
         ] },
         { id: 'view', label: 'View', items: [
           { label: 'Tax breakup', icon: 'percent' },
           { label: 'Revision history', icon: 'history' }
         ] }
       ],
       trigs() { return [...this.$refs.bar.querySelectorAll('[data-menu]')] },
       items() {
         const p = this.$refs.bar.querySelector('[data-panel=' + this.open + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')] : [];
       },
       to(id) {
         this.at = id;
         this.trigs().find(t => t.dataset.menu === id)?.focus();
         if (this.open !== null) this.open = id;
       },
       show(id, last = false) {
         this.open = id; this.at = id;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       close(back = true) {
         if (this.open === null) return;
         const id = this.open; this.open = null;
         if (back) this.to(id);
       },
       step(n) {
         const t = this.trigs(), i = t.findIndex(e => e.dataset.menu === this.at);
         this.to(t[(i + n + t.length) % t.length].dataset.menu);
       },
       jump(last) { const t = this.trigs(); this.to((last ? t[t.length - 1] : t[0]).dataset.menu) },
       move(n) { const i = this.items(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       type(e) {
         if (!e.target.dataset.menu || e.key === ' ' || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
         clearTimeout(this.clock);
         this.typed += e.key.toLowerCase();
         this.clock = setTimeout(() => { this.typed = '' }, 500);
         const t = this.trigs().find(x => x.textContent.trim().toLowerCase().startsWith(this.typed));
         if (t) { e.preventDefault(); this.to(t.dataset.menu) }
       },
       sItems() { return [...this.$refs.sheet.querySelectorAll('[role^=menuitem]')] },
       sShow(last = false) {
         this.sheet = true;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.sItems(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       sClose(back = true) {
         if (!this.sheet) return;
         this.sheet = false;
         if (back) this.$refs.sTrigger.focus();
       },
       sMove(n) { const i = this.sItems(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       sEdge(last) { const i = this.sItems(); (last ? i[i.length - 1] : i[0])?.focus() }
     }"
     @click.outside="close(false); sClose(false)"
     @keydown="type($event)"
     @keydown.escape="
       if (open !== null) { $event.stopPropagation(); close() }
       else if (sheet) { $event.stopPropagation(); sClose() }">

  <div class="flex items-center border-b border-zinc-100 px-1 py-1">

    <div x-ref="bar" role="menubar" aria-label="Purchase order commands" class="relative hidden items-center gap-0.5 md:flex">
      <template x-for="m in menus" :key="m.id">
        <div class="relative max-md:static">
          <button type="button" role="menuitem" aria-haspopup="menu" :data-menu="m.id"
                  :aria-expanded="open === m.id" :tabindex="at === m.id ? 0 : -1"
                  @click="open === m.id ? close() : show(m.id)"
                  @mouseenter="if (open !== null) to(m.id)"
                  @keydown.arrow-down.prevent="show(m.id)" @keydown.arrow-up.prevent="show(m.id, true)"
                  @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
                  @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
                  class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                  :class="open === m.id && 'bg-zinc-200 text-zinc-900'" x-text="m.label"></button>

          <div x-show="open === m.id" x-cloak :data-panel="m.id" role="menu" :aria-label="m.label"
               @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
               @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
               @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
               @keydown.tab="close()"
               class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
            <template x-for="it in m.items" :key="it.label">
              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <span class="flex text-zinc-600"><i :data-lucide="it.icon" class="size-4"></i></span>
                <span x-text="it.label"></span>
              </button>
            </template>
          </div>
        </div>
      </template>
    </div>

    <div class="relative md:hidden">
      <button type="button" x-ref="sTrigger" aria-haspopup="menu" :aria-expanded="sheet"
              @click="sheet ? sClose(false) : sShow()"
              @keydown.arrow-down.prevent="sShow()" @keydown.arrow-up.prevent="sShow(true)"
              class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="sheet && 'bg-zinc-200 text-zinc-900'">
        <i data-lucide="menu" class="size-4"></i>Menu
      </button>

      <div x-show="sheet" x-cloak x-ref="sheet" role="menu" aria-label="Purchase order commands"
           @keydown.arrow-down.prevent="sMove(1)" @keydown.arrow-up.prevent="sMove(-1)"
           @keydown.home.prevent="sEdge(false)" @keydown.end.prevent="sEdge(true)"
           @keydown.tab="sClose()"
           class="absolute top-full left-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <template x-for="m in menus" :key="m.id">
          <div role="group" :aria-label="m.label" class="border-t border-zinc-100 py-1 first:border-t-0">
            <p aria-hidden="true" class="px-3 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase" x-text="m.label"></p>
            <template x-for="it in m.items" :key="it.label">
              <button type="button" role="menuitem" tabindex="-1" @click="sClose()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <span class="flex text-zinc-600"><i :data-lucide="it.icon" class="size-4"></i></span>
                <span x-text="it.label"></span>
              </button>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>

  <div class="px-4 py-3">
    <h2 class="text-[16px]/6 font-semibold tabular-nums">PO-24-1187 — Gujarat Polymers Ltd</h2>
    <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Draft · 14 lines · ₹18,42,000 before tax</p>
  </div>
</div>` },

      { id: 'trailing', name: 'With a trailing status', code:
`<!-- The save indicator and the Submit button are in the same strip and outside
     role="menubar". This is the mistake worth taking seriously: a menubar's
     children are menus, and a child that is not a menuitem is either dropped
     from the announced item count or reported as one of the menus, so the bar
     announces four menus and the fourth is a button that opens nothing. Left
     and Right would walk onto it too, which is the same bug from the keyboard.

     So the strip is a plain flex row holding two things: the role="menubar"
     element, and everything else. ml-auto sits on the trailing block rather
     than on the bar, so the menus stay put when the status text changes length.

     Saved is a status, not a control, and lives in a role="status" so the
     announcement arrives when the autosave lands rather than when somebody
     happens to focus it. The emerald dot is the only colour in the strip.

     At 390px the words drop out and the dot stays, because the dot plus the
     Submit button is the smallest honest version of "saved, and here is what to
     do next". Hiding the button instead would leave the primary action of the
     screen reachable only from the File menu. -->
<div data-kui="menubar/trailing" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, at: 'file', typed: '', clock: null,
       menus: [
         { id: 'file', label: 'File', items: [
           { label: 'Save draft', icon: 'save' },
           { label: 'Print', icon: 'printer' },
           { label: 'Export as PDF', icon: 'file-text' }
         ] },
         { id: 'edit', label: 'Edit', items: [
           { label: 'Insert line', icon: 'rows-3' },
           { label: 'Duplicate line', icon: 'copy' },
           { label: 'Find item code', icon: 'search' }
         ] },
         { id: 'view', label: 'View', items: [
           { label: 'Tax breakup', icon: 'percent' },
           { label: 'Revision history', icon: 'history' }
         ] }
       ],
       trigs() { return [...this.$refs.bar.querySelectorAll('[data-menu]')] },
       items() {
         const p = this.$refs.bar.querySelector('[data-panel=' + this.open + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')] : [];
       },
       to(id) {
         this.at = id;
         this.trigs().find(t => t.dataset.menu === id)?.focus();
         if (this.open !== null) this.open = id;
       },
       show(id, last = false) {
         this.open = id; this.at = id;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       close(back = true) {
         if (this.open === null) return;
         const id = this.open; this.open = null;
         if (back) this.to(id);
       },
       step(n) {
         const t = this.trigs(), i = t.findIndex(e => e.dataset.menu === this.at);
         this.to(t[(i + n + t.length) % t.length].dataset.menu);
       },
       jump(last) { const t = this.trigs(); this.to((last ? t[t.length - 1] : t[0]).dataset.menu) },
       move(n) { const i = this.items(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       type(e) {
         if (!e.target.dataset.menu || e.key === ' ' || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
         clearTimeout(this.clock);
         this.typed += e.key.toLowerCase();
         this.clock = setTimeout(() => { this.typed = '' }, 500);
         const t = this.trigs().find(x => x.textContent.trim().toLowerCase().startsWith(this.typed));
         if (t) { e.preventDefault(); this.to(t.dataset.menu) }
       }
     }"
     @click.outside="close(false)"
     @keydown="type($event)"
     @keydown.escape="if (open !== null) { $event.stopPropagation(); close() }">

  <div class="flex items-center gap-2 border-b border-zinc-100 px-1 py-1">

    <div x-ref="bar" role="menubar" aria-label="Purchase order commands" class="relative flex items-center gap-0.5">
      <template x-for="m in menus" :key="m.id">
        <div class="relative max-md:static">
          <button type="button" role="menuitem" aria-haspopup="menu" :data-menu="m.id"
                  :aria-expanded="open === m.id" :tabindex="at === m.id ? 0 : -1"
                  @click="open === m.id ? close() : show(m.id)"
                  @mouseenter="if (open !== null) to(m.id)"
                  @keydown.arrow-down.prevent="show(m.id)" @keydown.arrow-up.prevent="show(m.id, true)"
                  @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
                  @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
                  class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                  :class="open === m.id && 'bg-zinc-200 text-zinc-900'" x-text="m.label"></button>

          <div x-show="open === m.id" x-cloak :data-panel="m.id" role="menu" :aria-label="m.label"
               @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
               @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
               @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
               @keydown.tab="close()"
               class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
            <template x-for="it in m.items" :key="it.label">
              <button type="button" role="menuitem" tabindex="-1" @click="close()"
                      class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                <span class="flex text-zinc-600"><i :data-lucide="it.icon" class="size-4"></i></span>
                <span x-text="it.label"></span>
              </button>
            </template>
          </div>
        </div>
      </template>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <p role="status" class="flex items-center gap-1.5 text-[12px]/4 tabular-nums text-zinc-600">
        <span class="size-1.5 shrink-0 rounded-full bg-emerald-600"></span>
        <span class="hidden sm:inline">Saved 11:04</span>
        <span class="sr-only sm:hidden">Saved 11:04</span>
      </p>
      <button type="button" class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Submit
      </button>
    </div>
  </div>

  <div class="px-4 py-3">
    <h2 class="text-[16px]/6 font-semibold tabular-nums">PO-24-1187 — Gujarat Polymers Ltd</h2>
    <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Draft · 14 lines · ₹18,42,000 before tax · Ritu Deshpande</p>
  </div>
</div>` },

      { id: 'htmx', name: 'A command that posts', code:
`<!-- htmx does the writing, because Alpine does not fetch. What is different
     about a command fired from a menu all comes from one fact: the control that
     started the request is gone before the response arrives.

     hx-target points at the document region, never at anything inside the
     panel. The click closes the menu, so by the time the reply lands the panel
     is display:none — a swap into it succeeds, changes nothing anyone can see,
     and is thrown away when the menu re-renders. Same for hx-indicator: a
     spinner in a closed menu is one nobody watches, so the busy state is
     painted on the strip under the bar instead.

     The answer has to stay on screen and it has to be announced. role="status"
     does both: the user pressed an item, the menu vanished, and without a live
     region the only evidence is a number changing three lines further down.

     hx-sync="this:drop", not :replace: two toggles of a switch are one intent
     and the later wins, but two presses of Recalculate are one already in flight.

     The @click does not preventDefault — htmx listens for the same click — and
     hx-headers sits on the root, since there is no form to read a token from. -->
<div data-kui="menubar/htmx" class="rounded-xl border border-zinc-300 bg-white"
     hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'
     x-data="{
       open: null, at: 'file', typed: '', clock: null, busy: false, msg: '', ok: true,
       trigs() { return [...this.$refs.bar.querySelectorAll('[data-menu]')] },
       items() {
         const p = this.$refs.bar.querySelector('[data-panel=' + this.open + ']');
         return p ? [...p.querySelectorAll('[role^=menuitem]')] : [];
       },
       to(id) {
         this.at = id;
         this.trigs().find(t => t.dataset.menu === id)?.focus();
         if (this.open !== null) this.open = id;
       },
       show(id, last = false) {
         this.open = id; this.at = id;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
         }));
       },
       close(back = true) {
         if (this.open === null) return;
         const id = this.open; this.open = null;
         if (back) this.to(id);
       },
       step(n) {
         const t = this.trigs(), i = t.findIndex(e => e.dataset.menu === this.at);
         this.to(t[(i + n + t.length) % t.length].dataset.menu);
       },
       jump(last) { const t = this.trigs(); this.to((last ? t[t.length - 1] : t[0]).dataset.menu) },
       move(n) { const i = this.items(), a = i.indexOf(document.activeElement); i[(a + n + i.length) % i.length]?.focus() },
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       type(e) {
         if (!e.target.dataset.menu || e.key === ' ' || e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
         clearTimeout(this.clock);
         this.typed += e.key.toLowerCase();
         this.clock = setTimeout(() => { this.typed = '' }, 500);
         const t = this.trigs().find(x => x.textContent.trim().toLowerCase().startsWith(this.typed));
         if (t) { e.preventDefault(); this.to(t.dataset.menu) }
       }
     }"
     @click.outside="close(false)"
     @keydown="type($event)"
     @keydown.escape="if (open !== null) { $event.stopPropagation(); close() }"
     @htmx:before-request.camel="busy = true; msg = ''"
     @htmx:after-request.camel="
       busy = false; ok = $event.detail.successful;
       msg = ok ? 'Tax recalculated from the rate contract' : 'Could not recalculate — the order is unchanged'">

  <div x-ref="bar" role="menubar" aria-label="Purchase order commands"
       class="relative flex items-center gap-0.5 border-b border-zinc-100 px-1 py-1">

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="file"
              :aria-expanded="open === 'file'" :tabindex="at === 'file' ? 0 : -1"
              @click="open === 'file' ? close() : show('file')"
              @mouseenter="if (open !== null) to('file')"
              @keydown.arrow-down.prevent="show('file')" @keydown.arrow-up.prevent="show('file', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'file' && 'bg-zinc-200 text-zinc-900'">File</button>

      <div x-show="open === 'file'" x-cloak data-panel="file" role="menu" aria-label="File"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="save" class="size-4 text-zinc-600"></i>Save draft
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print
        </button>
      </div>
    </div>

    <div class="relative max-md:static">
      <button type="button" role="menuitem" aria-haspopup="menu" data-menu="edit"
              :aria-expanded="open === 'edit'" :tabindex="at === 'edit' ? 0 : -1"
              @click="open === 'edit' ? close() : show('edit')"
              @mouseenter="if (open !== null) to('edit')"
              @keydown.arrow-down.prevent="show('edit')" @keydown.arrow-up.prevent="show('edit', true)"
              @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
              @keydown.home.prevent="jump(false)" @keydown.end.prevent="jump(true)"
              class="rounded-lg px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'edit' && 'bg-zinc-200 text-zinc-900'">Edit</button>

      <div x-show="open === 'edit'" x-cloak data-panel="edit" role="menu" aria-label="Edit"
           @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
           @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
           @keydown.arrow-right.prevent="step(1)" @keydown.arrow-left.prevent="step(-1)"
           @keydown.tab="close()"
           class="absolute top-full left-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                hx-post="/orders/PO-24-1187/recalculate-tax/"
                hx-target="#mb-po-total" hx-swap="innerHTML" hx-sync="this:drop"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="calculator" class="size-4 text-zinc-600"></i>Recalculate tax
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="search" class="size-4 text-zinc-600"></i>Find item code
        </button>
      </div>
    </div>
  </div>

  <p role="status" class="flex min-h-9 items-center gap-1.5 border-b border-zinc-100 px-4 text-[12px]/4">
    <span x-show="busy" x-cloak class="flex items-center gap-1.5 text-zinc-500">
      <i data-lucide="loader-circle" class="size-3.5 shrink-0 animate-spin"></i>Recalculating tax
    </span>
    <span x-show="!busy && msg" x-cloak class="flex items-center gap-1.5"
          :class="ok ? 'text-zinc-600' : 'font-medium text-red-600'">
      <span class="flex shrink-0" :class="ok && 'text-emerald-600'"><i :data-lucide="ok ? 'check' : 'alert-circle'" class="size-3.5"></i></span>
      <span x-text="msg"></span>
    </span>
    <span x-show="!busy && !msg" class="tabular-nums text-zinc-500">Last recalculated 16 Aug 2026, 11:04</span>
  </p>

  <div class="px-4 py-3">
    <h2 class="text-[16px]/6 font-semibold tabular-nums">PO-24-1187 — Gujarat Polymers Ltd</h2>
    <p id="mb-po-total" class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">14 lines · ₹18,42,000 before tax · IGST 18% ₹3,31,560</p>
  </div>
</div>` }
    ]
  },

  {
    id: 'navigation-menu', name: 'Navigation menu', category: 'navigation',
    description: 'A horizontal bar of links to places, some of which open a panel of more links. Every item is an anchor, so the browser\'s own navigation gestures keep working, and aria-current says which one you are on.',
    when: 'The top-level route map of an application that has more sections than a sidebar can hold at once — Procurement, Inventory, Reports — where a section is worth showing as a panel of its pages rather than a single link. If the items are commands that act on the document in front of you, that is a menubar. If there is one trigger and one list of actions behind it, that is a dropdown. The test is whether an item has a URL: a set of URLs is navigation and belongs here, and anything without one does not.',
    notes: [
      'Every item that goes somewhere is an <a href>. This is the whole component and it is the thing that gets built wrong: a navigation menu assembled out of role="menu" and <button>s looks identical on screen and throws away middle-click, Ctrl-click, Open in new tab, Copy link address, the status bar preview, and the browser\'s own history — every affordance a link gets for free and none of which you can put back. It also tells a screen reader that arrow keys drive the thing and that Tab will step over it in one press, and then neither is true. If it has a URL it is an anchor, and no amount of ARIA makes a button into one.',
      'The panel is a plain container holding a <ul> of links. It is not role="menu" and its links are not role="menuitem". Those roles are a promise that the contents are commands, that the arrows move between them and that the whole panel is one tab stop; a panel of links is none of those, and applying them makes NVDA and VoiceOver stop announcing "link" for things that are links, which is the one word the user needed.',
      'The trigger is a <button>, because it does not navigate — it reveals. aria-expanded belongs on a control that opens something and is a lie on a link, where a reader told "collapsed" presses Enter and leaves the page. The section that the trigger appears to name still needs a route, so the first link inside the panel is the section overview — All of Procurement — and the trigger loses nothing by not being a link itself.',
      'Two delays, and they are different lengths for different reasons. Opening waits about 140ms so a pointer travelling across the bar toward something else does not flash three panels on the way. Closing waits about 280ms so the pointer can leave the trigger, cross the gap and land in the panel without the panel disappearing underneath it — it is off both elements for a frame or two in between. Drop the open delay and the bar strobes; drop the close delay and the panel can be seen but never reached.',
      'Once a panel is open, crossing to a sibling trigger swaps instantly and skips the open delay. The delay exists to filter out a pointer that is passing through, and a pointer already inside an open menu is not passing through — it is reading the bar. Keep the delay in that state and moving between two sections feels like the bar is arguing with you.',
      'The gap between the bar and the panel is padding on the positioned wrapper, never a margin on the panel. A margin is dead space belonging to nothing, so the pointer leaves the component halfway across it and the close timer starts. And the panel drops flush under the bar, full width, so the shortest route from a trigger to it is straight down — indent the panel or offset it sideways and the route becomes a diagonal, the diagonal passes over the next trigger, and that trigger takes the pointer. The cheap fix is the geometry; the expensive one is a safe-triangle hit test, and this system does not want the second. Keep the panel a DOM descendant of the nav while you are at it — mouseleave accounts for an element and its descendants in the tree rather than its box, so a panel inside the nav never fires the nav\'s mouseleave no matter where it is painted, and a panel portalled to the body to escape a clipping ancestor fires it the instant the pointer arrives.',
      'Tab reaches every trigger. This is the line between this and a menubar: a menubar is one widget and takes one tab stop with a roving tabindex inside it, and a navigation bar is a list of destinations that a keyboard user has to be able to walk. Give this a roving tabindex and Tab jumps the entire route map in one press, which is the opposite of what a route map is for.',
      'Focus leaving the whole component closes the panel, and the only way to detect that is @focusout on the root with a containment check on relatedTarget, because blur does not bubble and focusout does. relatedTarget is the element about to receive focus, so !$el.contains($event.relatedTarget) is the question "did focus land outside me". It is null when focus leaves the document entirely — the address bar, another window — and contains(null) is false, so that case closes too, which is correct. Bind blur instead and nothing fires; skip the check and the panel closes while the user is tabbing through its own links.',
      'Guard the hover handlers with matchMedia(\'(hover: hover) and (pointer: fine)\'). A tap on a touch screen fires a synthetic mouseenter and then a click, so an unguarded bar opens the panel on the mouseenter and closes it again on the click, and the section is unreachable by tapping it. The click path has to be the whole story on touch.',
      'aria-current="page" marks the exact page and nothing else; the trigger of the section you are inside takes aria-current="true", which means the current item of a set. They are not interchangeable and a trigger with page on it claims to be a page it has no URL for. aria-selected has no business here at all — that word belongs to a tab, which switches a panel in this document rather than moving you somewhere.',
      'Nav items are not underlined, which is the documented exception to the interactive-text rule and the same exception breadcrumbs take. A row of underlined links reads as a fence rather than a bar; the tint on the current item and the hover carry it instead. Inside a panel the links stay unadorned for the same reason — twelve underlined lines in three columns is a grid of rules.',
      'At 390px this is not a hover bar and must not try to be one. There is no hover to open with, four section names do not fit on one line, and a floating panel over a phone screen needs a dismiss affordance a bar does not have. Ship the disclosure list instead, sm:hidden against hidden sm:block, and accept that they are two pieces of markup rather than one that flexes.'
    ],
    anatomy: [
      ['Bar', 'The <nav aria-label> holding the open state, the two timers, and the mouseleave, focusout, escape and click-outside handlers. It is the common parent of every trigger and every panel, which is the only place that can tell "left the trigger" from "left the component".'],
      ['Link item', 'An <a href> straight to a page, with aria-current="page" when it is that page. No panel, no chevron, no state of its own.'],
      ['Panel trigger', 'A <button> carrying aria-expanded and aria-controls. It looks exactly like a link item apart from the chevron, and the chevron is the only signal that anything is behind it.'],
      ['Bridge', 'pt-2 on the positioned wrapper. The strip the pointer crosses on its way down, and it belongs to the component so crossing it is not leaving.'],
      ['Panel', 'A white rounded-xl bordered surface below the bar, z-40, holding a <ul> of links. Not a role="menu", not focus-trapped, and not scrollable — if it needs to scroll it needs to be a page.'],
      ['Group heading', 'A real <h3> above each column, 11px uppercase zinc-600. It is a heading and not a styled div, because jumping by heading is how a screen reader reads a panel of thirty links.'],
      ['Link description', 'A 12px zinc-600 line under the link label, inside the anchor so the whole block is the target. Six words at most: it joins the accessible name and is read out every time.'],
      ['Featured rail', 'An optional zinc-100 block at the head of the panel holding one promoted destination — a recently opened record. It is first in the DOM only when it is genuinely the most likely next click, because DOM order is keyboard order.']
    ],
    behaviour: [
      'Hover opens after about 140ms and closes about 280ms after the pointer has left the trigger and the panel together. Coming back inside during the close delay cancels it, so a pointer that overshoots the panel edge and returns finds it still there.',
      'With a panel already open, moving to another trigger swaps immediately. Only the first panel of a pass costs the open delay.',
      'Clicking a trigger opens the panel and moves focus onto its first link. That is what makes Enter and Space work with nothing bound to them, because a native button turns both into a click, and it costs a mouse user nothing since focus-visible does not paint for a pointer.',
      'Down on a trigger opens the panel and lands on the first link. Inside the panel there are no arrow keys at all — Tab walks the links, because they are links. Arrow navigation inside would be the one thing that makes it feel like a menu, and it is deliberately absent.',
      'Escape closes the open panel and returns focus to the trigger it belongs to, and it stops propagating so it does not also close the dialog the bar happens to be inside.',
      'Focus leaving the component closes the panel; clicking outside closes it without moving focus, because the user has already put focus somewhere by clicking.',
      'One panel at a time falls out of holding a single id on the root rather than a boolean per item. There is nothing to keep in sync and no way to reach a state with two panels open.',
      'A panel that is fetched is fetched on open, not on mouseenter, and once — the hover delay exists precisely so that dragging a pointer across the bar does not fire three requests. A failed fetch leaves the flag unset so the next open retries.',
      'At 390px the bar is replaced, not reflowed: a stack of disclosure sections, several of which can be open at once, because collapsing one section as another opens moves every link under the thumb.'
    ],
    a11y: [
      'Destinations are <a href> and nothing else. Middle-click, Ctrl-click, Open in new tab and the browser\'s status-bar preview all come from the element being an anchor, and none of them can be reimplemented on a button.',
      'The panel is a plain container of links, not role="menu". Those roles change what a screen reader announces and what it promises about the keyboard, and both promises are false here.',
      'The trigger is a button with aria-expanded bound to the open state and aria-controls pointing at the panel; the panel points back with aria-labelledby, so it is announced with the name of the section it belongs to rather than as an unnamed group.',
      'Every trigger is in the tab order. A roving tabindex is correct for a menubar and wrong here: it would collapse the whole route map into one tab stop.',
      'aria-current="page" on the exact page and aria-current="true" on the trigger of the section you are inside. The tint is the visual echo of the attribute, never the state itself.',
      'Escape closes and hands focus back to the trigger, so the keyboard does not end up on a hidden element or dumped on the body.',
      'Column headings are real <h3> elements so a panel of thirty links can be read by heading instead of link by link.',
      'Focus is an outline with an offset, never a ring, and nothing here writes outline-none. Inside a panel the links are far enough from the edge for a positive offset to sit clear of the border.'
    ],
    related: ['topbar', 'menubar', 'sidebar'],
    variants: [
      { id: 'links', name: 'Link bar', code:
`<!-- The simplest form, and still the component: four destinations, no panels
     and no JavaScript at all. Reach for this first and add a panel only when a
     section has pages worth listing.

     aria-current="page" is the state. The zinc-100 tint is what you see, but it
     is the attribute that is announced, and writing only the tint gives a
     sighted user a marker and everybody else nothing.

     The items are not underlined. That is the exception breadcrumbs take too:
     interactive text is zinc-900 plus an underline everywhere else in this
     system, and four underlined labels in a row read as a fence rather than a
     bar. The hover tint carries it. -->
<nav data-kui="navigation-menu/links" aria-label="Main" class="rounded-xl border border-zinc-300 bg-white p-1">
  <ul class="flex flex-wrap items-center gap-1">
    <li>
      <a href="/dashboard/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Dashboard</a>
    </li>
    <li>
      <a href="/procurement/orders/" aria-current="page" class="block rounded-lg bg-zinc-200 px-3 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Purchase orders</a>
    </li>
    <li>
      <a href="/inventory/grn/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Goods receipt</a>
    </li>
    <li>
      <a href="/vendors/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Vendors</a>
    </li>
  </ul>
</nav>` },

      { id: 'panel', name: 'One panel of links', code:
`<!-- The whole machine, on the smallest thing that needs it. Read this one and
     the rest of the variants are the same root with different panel contents.

     Two delays and they are not the same length. 140ms before opening filters
     out a pointer crossing the bar on its way to the scrollbar; 280ms before
     closing is the grace period in which the pointer leaves the trigger, is
     over nothing for a frame or two, and lands in the panel. The nav's own
     mouseenter clears the pending close, so overshooting the panel edge and
     coming back finds it still open.

     The gap is pt-2 on the positioned wrapper, never mt-2 on the panel: a
     margin belongs to nothing, so the pointer is outside the component halfway
     across it. And because the panel is a DOM child of the nav, mouseleave on
     the nav does not fire when the pointer moves into it — mouseleave counts
     descendants in the tree, not boxes.

     The trigger is a button, not a link, because it reveals rather than
     navigates and aria-expanded on a link is a lie. The page it looks like it
     should point at is the first link inside the panel instead.

     Click opens the panel and moves focus to the first link, which is why
     nothing is bound to Enter or Space: a native button turns both into a
     click. Focus is moved on the animation frame after $nextTick, because
     x-show has not written display yet inside the tick and focus() on a hidden
     element is a silent no-op — the same trap the dropdown documents.

     fine is the touch guard. A tap fires a synthetic mouseenter and then a
     click, so without it the panel opens on the first and closes on the second
     and the section cannot be reached by tapping it. -->
<nav data-kui="navigation-menu/panel" aria-label="Main" class="relative rounded-xl border border-zinc-300 bg-white p-1"
     x-data="{
       open: null,
       timer: 0,
       fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
       hover(id) {
         if (!this.fine) return;
         clearTimeout(this.timer);
         if (this.open) { this.open = id; return }
         this.timer = setTimeout(() => this.open = id, 140);
       },
       leave() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = null, 280) },
       jump(id) {
         clearTimeout(this.timer);
         this.open = id;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs[id + 'Panel']?.querySelector('a')?.focus()));
       },
       shut(back) { clearTimeout(this.timer); this.open = null; if (back) back.focus() }
     }"
     @mouseenter="clearTimeout(timer)"
     @mouseleave="leave()"
     @focusout="if (!$el.contains($event.relatedTarget)) shut()"
     @click.outside="shut()"
     @keydown.escape="if (open) { $event.stopPropagation(); shut($refs[open]) }">
  <ul class="flex flex-wrap items-center gap-1">
    <li>
      <a href="/dashboard/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Dashboard</a>
    </li>

    <li class="relative">
      <button type="button" x-ref="vendors" id="nmp-t-vendors"
              aria-controls="nmp-p-vendors" :aria-expanded="open === 'vendors'"
              @mouseenter="hover('vendors')"
              @click="open === 'vendors' ? shut($refs.vendors) : jump('vendors')"
              @keydown.arrow-down.prevent="jump('vendors')"
              class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'vendors' ? 'bg-zinc-200 font-medium text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'">
        Vendors
        <span class="flex transition-transform motion-reduce:transition-none" :class="open === 'vendors' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
        </span>
      </button>

      <div x-ref="vendorsPanel" x-show="open === 'vendors'" x-cloak
           id="nmp-p-vendors" aria-labelledby="nmp-t-vendors"
           class="absolute top-full left-0 z-40 pt-2">
        <ul class="w-64 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
          <li>
            <a href="/vendors/" class="block rounded-lg px-3 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">All vendors</a>
          </li>
          <li>
            <a href="/vendors/approved/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approved suppliers</a>
          </li>
          <li>
            <a href="/vendors/contracts/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Rate contracts</a>
          </li>
          <li>
            <a href="/vendors/onboarding/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Onboarding queue</a>
          </li>
        </ul>
      </div>
    </li>

    <li>
      <a href="/reports/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reports</a>
    </li>
  </ul>
</nav>` },

      { id: 'columns', name: 'Wide panel, grouped columns', code:
`<!-- Twelve destinations under one trigger, in three columns with a real <h3>
     over each. The headings are the reason this is readable to a screen reader
     at all: thirty links read one at a time is a wall, and heading navigation
     turns it back into three lists. A styled div would look identical and do
     none of that.

     The panel is anchored to the nav, not to the trigger, and takes w-full so
     the shortest route from the trigger down into it is a straight line. Anchor
     a wide panel to its own trigger and it either runs off the right edge or
     has to be shifted back, and the shift is what turns the pointer's route
     into a diagonal that the next trigger steals.

     The description sits inside the anchor so the whole two-line block is the
     target — outside it, the sentence is dead space that looks clickable and
     is not. The cost is that it joins the accessible name, which is why every
     one of them is six words or fewer and says what the page is rather than
     selling it.

     There is no x-transition on the panel. A fade looks considered on a single
     panel and wrong the moment two of them swap, because both are mounted for
     the length of the transition and you get a crossfade of two menus. The
     open delay is what makes it feel deliberate. -->
<nav data-kui="navigation-menu/columns" aria-label="Main" class="relative rounded-xl border border-zinc-300 bg-white p-1"
     x-data="{
       open: null,
       timer: 0,
       fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
       hover(id) {
         if (!this.fine) return;
         clearTimeout(this.timer);
         if (this.open) { this.open = id; return }
         this.timer = setTimeout(() => this.open = id, 140);
       },
       leave() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = null, 280) },
       jump(id) {
         clearTimeout(this.timer);
         this.open = id;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs[id + 'Panel']?.querySelector('a')?.focus()));
       },
       shut(back) { clearTimeout(this.timer); this.open = null; if (back) back.focus() }
     }"
     @mouseenter="clearTimeout(timer)"
     @mouseleave="leave()"
     @focusout="if (!$el.contains($event.relatedTarget)) shut()"
     @click.outside="shut()"
     @keydown.escape="if (open) { $event.stopPropagation(); shut($refs[open]) }">
  <ul class="flex flex-wrap items-center gap-1">
    <li>
      <button type="button" x-ref="modules" id="nmc-t-modules"
              aria-controls="nmc-p-modules" :aria-expanded="open === 'modules'"
              @mouseenter="hover('modules')"
              @click="open === 'modules' ? shut($refs.modules) : jump('modules')"
              @keydown.arrow-down.prevent="jump('modules')"
              class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'modules' ? 'bg-zinc-200 font-medium text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'">
        Modules
        <span class="flex transition-transform motion-reduce:transition-none" :class="open === 'modules' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
        </span>
      </button>
    </li>

    <li>
      <a href="/approvals/" @mouseenter="if (open) shut()"
         class="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Approvals
        <span class="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">4</span>
      </a>
    </li>

    <li>
      <a href="/admin/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Admin</a>
    </li>
  </ul>

  <div x-ref="modulesPanel" x-show="open === 'modules'" x-cloak
       id="nmc-p-modules" aria-labelledby="nmc-t-modules"
       class="absolute top-full left-0 z-40 w-full pt-2">
    <div class="rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
      <div class="grid gap-x-4 gap-y-4 sm:grid-cols-3">
        <div>
          <h3 class="px-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Procurement</h3>
          <ul>
            <li>
              <a href="/procurement/orders/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Purchase orders</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Raised against a rate contract</span>
              </a>
            </li>
            <li>
              <a href="/procurement/requisitions/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Requisitions</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Indents waiting to become orders</span>
              </a>
            </li>
            <li>
              <a href="/procurement/contracts/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Rate contracts</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Agreed prices and their validity</span>
              </a>
            </li>
            <li>
              <a href="/vendors/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Vendors</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Suppliers and their contacts</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="px-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Inventory</h3>
          <ul>
            <li>
              <a href="/inventory/grn/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Goods receipt</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">GRNs against open orders</span>
              </a>
            </li>
            <li>
              <a href="/inventory/stock/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Stock on hand</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Item ledger by store and bin</span>
              </a>
            </li>
            <li>
              <a href="/inventory/transfers/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Transfers</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Vasai to Silvassa movement</span>
              </a>
            </li>
            <li>
              <a href="/inventory/counts/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Stock counts</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Cycle counts and adjustments</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="px-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Reports</h3>
          <ul>
            <li>
              <a href="/reports/consumption/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Consumption</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Issue by project and cost centre</span>
              </a>
            </li>
            <li>
              <a href="/reports/ageing/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Invoice ageing</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Outstanding past agreed terms</span>
              </a>
            </li>
            <li>
              <a href="/reports/price-trend/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Price trend</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Landed rate by item and month</span>
              </a>
            </li>
            <li>
              <a href="/reports/builder/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Saved reports</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Your own and the shared set</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</nav>` },

      { id: 'featured', name: 'Featured rail', code:
`<!-- A promoted destination beside the list — here the record the buyer had
     open before lunch, which in a procurement console is the most likely next
     click by a wide margin.

     The rail is first in the DOM, and that is a decision rather than a layout:
     DOM order is keyboard order, so Down from the trigger lands on the record
     rather than on All of Procurement. That is right only because the record
     really is the likeliest destination. Put anything promotional there and it
     becomes an advertisement standing between a keyboard user and the menu, in
     which case it goes last in the DOM and the grid puts it back on the left
     with sm:order-first — visual order is free to move, tab order is not.

     The rail is bg-zinc-100, a surface, and the pill inside it is bg-zinc-200
     with a zinc-300 ring, one step deeper. Give the pill the surface fill and
     it measures identical against the rail and disappears.

     The rail is a single anchor wrapping four lines, so the whole block is the
     target. Splitting the amount out into a sibling would leave the largest
     thing on the card unclickable, which is exactly the part people aim at. -->
<nav data-kui="navigation-menu/featured" aria-label="Main" class="relative rounded-xl border border-zinc-300 bg-white p-1"
     x-data="{
       open: null,
       timer: 0,
       fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
       hover(id) {
         if (!this.fine) return;
         clearTimeout(this.timer);
         if (this.open) { this.open = id; return }
         this.timer = setTimeout(() => this.open = id, 140);
       },
       leave() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = null, 280) },
       jump(id) {
         clearTimeout(this.timer);
         this.open = id;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs[id + 'Panel']?.querySelector('a')?.focus()));
       },
       shut(back) { clearTimeout(this.timer); this.open = null; if (back) back.focus() }
     }"
     @mouseenter="clearTimeout(timer)"
     @mouseleave="leave()"
     @focusout="if (!$el.contains($event.relatedTarget)) shut()"
     @click.outside="shut()"
     @keydown.escape="if (open) { $event.stopPropagation(); shut($refs[open]) }">
  <ul class="flex flex-wrap items-center gap-1">
    <li>
      <button type="button" x-ref="proc" id="nmf-t-proc"
              aria-controls="nmf-p-proc" :aria-expanded="open === 'proc'"
              @mouseenter="hover('proc')"
              @click="open === 'proc' ? shut($refs.proc) : jump('proc')"
              @keydown.arrow-down.prevent="jump('proc')"
              class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'proc' ? 'bg-zinc-200 font-medium text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'">
        Procurement
        <span class="flex transition-transform motion-reduce:transition-none" :class="open === 'proc' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
        </span>
      </button>
    </li>
    <li>
      <a href="/inventory/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Inventory</a>
    </li>
    <li>
      <a href="/reports/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reports</a>
    </li>
  </ul>

  <div x-ref="procPanel" x-show="open === 'proc'" x-cloak
       id="nmf-p-proc" aria-labelledby="nmf-t-proc"
       class="absolute top-full left-0 z-40 w-full pt-2">
    <div class="rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
      <div class="grid gap-3 sm:grid-cols-3">
        <a href="/procurement/orders/1187/"
           class="block rounded-lg bg-zinc-200 p-3 hover:bg-zinc-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="block text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Back to where you were</span>
          <span class="mt-2 block text-[14px]/5 font-semibold tabular-nums text-zinc-900">PO-24-1187</span>
          <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Gujarat Polymers Ltd</span>
          <span class="mt-2 flex items-center justify-between gap-2">
            <span class="text-[13px]/5 font-medium tabular-nums text-zinc-900">₹18,42,000</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Awaiting GRN
            </span>
          </span>
          <span class="mt-2 block text-[12px]/4 tabular-nums text-zinc-500">Opened 16 Aug 2026, 11:04</span>
        </a>

        <div class="sm:col-span-2">
          <h3 class="px-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Procurement</h3>
          <ul class="grid sm:grid-cols-2">
            <li>
              <a href="/procurement/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">All of Procurement</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">The section overview</span>
              </a>
            </li>
            <li>
              <a href="/procurement/orders/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Purchase orders</span>
                <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-600">31 open, 4 overdue</span>
              </a>
            </li>
            <li>
              <a href="/procurement/requisitions/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Requisitions</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Indents from the sites</span>
              </a>
            </li>
            <li>
              <a href="/procurement/contracts/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Rate contracts</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Agreed prices and validity</span>
              </a>
            </li>
            <li>
              <a href="/vendors/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Vendors</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Suppliers and contacts</span>
              </a>
            </li>
            <li>
              <a href="/procurement/invoices/" class="block rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Invoices</span>
                <span class="mt-0.5 block text-[12px]/4 text-zinc-600">Three-way match queue</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</nav>` },

      { id: 'icons', name: 'Icons per link', code:
`<!-- An icon per row, in a tinted well. The well is a shape, so it takes
     bg-zinc-200 with a zinc-300 ring; bg-zinc-100 would be the surface colour
     and would measure identical against the white panel with nothing to hold
     its edge.

     Every well is the same size and every icon sits in one, including the rows
     where the icon is weak, because the labels only form a readable column if
     their left edge never moves. The moment one row has no well the whole list
     reads as two lists.

     The icons carry no label of their own. Each one repeats what the text
     beside it already says, and a screen reader announcing "package, Stock on
     hand" for six rows in a row is noise. If an icon needs explaining it is
     not naming a destination, and the answer is to drop it rather than to
     search Lucide for something vaguer.

     No Alpine binding goes on the <i data-lucide>. createIcons() replaces that
     element with an <svg> and takes the binding with it; the rotating chevron
     on the trigger is bound on the span around it for the same reason. -->
<nav data-kui="navigation-menu/icons" aria-label="Main" class="relative rounded-xl border border-zinc-300 bg-white p-1"
     x-data="{
       open: null,
       timer: 0,
       fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
       hover(id) {
         if (!this.fine) return;
         clearTimeout(this.timer);
         if (this.open) { this.open = id; return }
         this.timer = setTimeout(() => this.open = id, 140);
       },
       leave() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = null, 280) },
       jump(id) {
         clearTimeout(this.timer);
         this.open = id;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs[id + 'Panel']?.querySelector('a')?.focus()));
       },
       shut(back) { clearTimeout(this.timer); this.open = null; if (back) back.focus() }
     }"
     @mouseenter="clearTimeout(timer)"
     @mouseleave="leave()"
     @focusout="if (!$el.contains($event.relatedTarget)) shut()"
     @click.outside="shut()"
     @keydown.escape="if (open) { $event.stopPropagation(); shut($refs[open]) }">
  <ul class="flex flex-wrap items-center gap-1">
    <li>
      <a href="/dashboard/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Dashboard</a>
    </li>

    <li class="relative">
      <button type="button" x-ref="inv" id="nmi-t-inv"
              aria-controls="nmi-p-inv" :aria-expanded="open === 'inv'"
              @mouseenter="hover('inv')"
              @click="open === 'inv' ? shut($refs.inv) : jump('inv')"
              @keydown.arrow-down.prevent="jump('inv')"
              class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'inv' ? 'bg-zinc-200 font-medium text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'">
        Inventory
        <span class="flex transition-transform motion-reduce:transition-none" :class="open === 'inv' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
        </span>
      </button>

      <div x-ref="invPanel" x-show="open === 'inv'" x-cloak
           id="nmi-p-inv" aria-labelledby="nmi-t-inv"
           class="absolute top-full left-0 z-40 pt-2">
        <ul class="w-72 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
          <li>
            <a href="/inventory/stock/" class="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300">
                <i data-lucide="package" class="size-4 text-zinc-700"></i>
              </span>
              <span class="min-w-0">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Stock on hand</span>
                <span class="block text-[12px]/4 text-zinc-600">By store and bin</span>
              </span>
            </a>
          </li>
          <li>
            <a href="/inventory/grn/" class="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300">
                <i data-lucide="truck" class="size-4 text-zinc-700"></i>
              </span>
              <span class="min-w-0">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Goods receipt</span>
                <span class="block text-[12px]/4 text-zinc-600">Post a GRN against an order</span>
              </span>
            </a>
          </li>
          <li>
            <a href="/inventory/transfers/" class="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300">
                <i data-lucide="arrow-left-right" class="size-4 text-zinc-700"></i>
              </span>
              <span class="min-w-0">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Transfers</span>
                <span class="block text-[12px]/4 text-zinc-600">Vasai to Silvassa</span>
              </span>
            </a>
          </li>
          <li>
            <a href="/inventory/counts/" class="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300">
                <i data-lucide="clipboard-list" class="size-4 text-zinc-700"></i>
              </span>
              <span class="min-w-0">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Stock counts</span>
                <span class="block text-[12px]/4 text-zinc-600">Cycle counts and adjustments</span>
              </span>
            </a>
          </li>
          <li>
            <a href="/inventory/ledger/" class="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300">
                <i data-lucide="file-text" class="size-4 text-zinc-700"></i>
              </span>
              <span class="min-w-0">
                <span class="block text-[13px]/5 font-medium text-zinc-900">Item ledger</span>
                <span class="block text-[12px]/4 text-zinc-600">Every movement, by item</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </li>

    <li>
      <a href="/reports/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reports</a>
    </li>
  </ul>
</nav>` },

      { id: 'mixed', name: 'Links and triggers together', code:
`<!-- Two plain links and two triggers in one bar, which is the ordinary case
     and the one that exercises the hover logic properly. Move the pointer from
     Procurement to Inventory: the second panel replaces the first with no
     delay at all, because hover() skips the timer when something is already
     open. The delay exists to ignore a pointer crossing the bar, and a pointer
     already inside an open menu is not crossing it.

     A plain link carries @mouseenter="if (open) shut()". Without it, sliding
     from an open panel's trigger onto Dashboard leaves the panel hanging over
     the page until the 280ms close timer catches up, and until then the bar
     shows you inside a section you have just left.

     The two kinds of item are deliberately identical apart from the chevron.
     Styling a trigger differently — heavier, or in a different colour — makes
     the bar look like two rows of things stacked on one line, and the user has
     to learn which is which. The chevron is the entire distinction and it is
     enough, because it is the same chevron a dropdown uses.

     Only one panel can be open, and that is a property of the state shape
     rather than of any code: open holds an id or null. A boolean per item
     needs a rule to keep them exclusive, and the rule is what eventually gets
     forgotten in one of the branches. -->
<nav data-kui="navigation-menu/mixed" aria-label="Main" class="relative rounded-xl border border-zinc-300 bg-white p-1"
     x-data="{
       open: null,
       timer: 0,
       fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
       hover(id) {
         if (!this.fine) return;
         clearTimeout(this.timer);
         if (this.open) { this.open = id; return }
         this.timer = setTimeout(() => this.open = id, 140);
       },
       leave() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = null, 280) },
       jump(id) {
         clearTimeout(this.timer);
         this.open = id;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs[id + 'Panel']?.querySelector('a')?.focus()));
       },
       shut(back) { clearTimeout(this.timer); this.open = null; if (back) back.focus() }
     }"
     @mouseenter="clearTimeout(timer)"
     @mouseleave="leave()"
     @focusout="if (!$el.contains($event.relatedTarget)) shut()"
     @click.outside="shut()"
     @keydown.escape="if (open) { $event.stopPropagation(); shut($refs[open]) }">
  <ul class="flex flex-wrap items-center gap-1">
    <li>
      <a href="/dashboard/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Dashboard</a>
    </li>

    <li class="relative">
      <button type="button" x-ref="proc" id="nmm-t-proc"
              aria-controls="nmm-p-proc" :aria-expanded="open === 'proc'"
              @mouseenter="hover('proc')"
              @click="open === 'proc' ? shut($refs.proc) : jump('proc')"
              @keydown.arrow-down.prevent="jump('proc')"
              class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'proc' ? 'bg-zinc-200 font-medium text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'">
        Procurement
        <span class="flex transition-transform motion-reduce:transition-none" :class="open === 'proc' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
        </span>
      </button>

      <div x-ref="procPanel" x-show="open === 'proc'" x-cloak
           id="nmm-p-proc" aria-labelledby="nmm-t-proc"
           class="absolute top-full left-0 z-40 pt-2">
        <ul class="w-64 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
          <li><a href="/procurement/" class="block rounded-lg px-3 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">All of Procurement</a></li>
          <li><a href="/procurement/orders/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Purchase orders</a></li>
          <li><a href="/procurement/requisitions/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Requisitions</a></li>
          <li><a href="/procurement/contracts/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Rate contracts</a></li>
          <li><a href="/vendors/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Vendors</a></li>
        </ul>
      </div>
    </li>

    <li class="relative">
      <button type="button" x-ref="inv" id="nmm-t-inv"
              aria-controls="nmm-p-inv" :aria-expanded="open === 'inv'"
              @mouseenter="hover('inv')"
              @click="open === 'inv' ? shut($refs.inv) : jump('inv')"
              @keydown.arrow-down.prevent="jump('inv')"
              class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'inv' ? 'bg-zinc-200 font-medium text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'">
        Inventory
        <span class="flex transition-transform motion-reduce:transition-none" :class="open === 'inv' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
        </span>
      </button>

      <div x-ref="invPanel" x-show="open === 'inv'" x-cloak
           id="nmm-p-inv" aria-labelledby="nmm-t-inv"
           class="absolute top-full left-0 z-40 pt-2">
        <ul class="w-64 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
          <li><a href="/inventory/" class="block rounded-lg px-3 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">All of Inventory</a></li>
          <li><a href="/inventory/stock/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Stock on hand</a></li>
          <li><a href="/inventory/grn/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Goods receipt</a></li>
          <li><a href="/inventory/transfers/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Transfers</a></li>
        </ul>
      </div>
    </li>

    <li>
      <a href="/reports/" aria-current="page" @mouseenter="if (open) shut()"
         class="block rounded-lg bg-zinc-200 px-3 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reports</a>
    </li>
  </ul>
</nav>` },

      { id: 'current', name: 'Inside the section', code:
`<!-- The bar as it looks from a page inside Procurement, which is where every
     user spends their day and which almost every implementation gets wrong.

     Two different values of aria-current are doing two different jobs here.
     The trigger takes aria-current="true" — the current item of a set — because
     it is the section you are in but it is not a page and has no URL to be
     current for. Writing "page" on it claims a destination that does not
     exist, and a reader following that claim finds a button. Inside the panel,
     the link to the page actually on screen takes aria-current="page". Both
     are marked, neither borrows the other's word, and aria-selected appears
     nowhere: that word belongs to a tab, which swaps a panel in this document
     rather than moving you.

     The trigger keeps its zinc-100 tint whether the panel is open or not, so
     "where I am" and "what is open" are the same colour. They are only ever
     confusable for a moment, since the chevron rotates and the panel is on
     screen, and the alternative — a second marker for the current section — is
     a colour this system does not have.

     The current link inside the panel is tinted the same way rather than
     hidden or disabled. A menu that drops the page you are on changes length
     depending on where you stand, and a list people navigate by position
     cannot move under them. -->
<nav data-kui="navigation-menu/current" aria-label="Main" class="relative rounded-xl border border-zinc-300 bg-white p-1"
     x-data="{
       open: null,
       timer: 0,
       fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
       hover(id) {
         if (!this.fine) return;
         clearTimeout(this.timer);
         if (this.open) { this.open = id; return }
         this.timer = setTimeout(() => this.open = id, 140);
       },
       leave() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = null, 280) },
       jump(id) {
         clearTimeout(this.timer);
         this.open = id;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs[id + 'Panel']?.querySelector('a')?.focus()));
       },
       shut(back) { clearTimeout(this.timer); this.open = null; if (back) back.focus() }
     }"
     @mouseenter="clearTimeout(timer)"
     @mouseleave="leave()"
     @focusout="if (!$el.contains($event.relatedTarget)) shut()"
     @click.outside="shut()"
     @keydown.escape="if (open) { $event.stopPropagation(); shut($refs[open]) }">
  <ul class="flex flex-wrap items-center gap-1">
    <li>
      <a href="/dashboard/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Dashboard</a>
    </li>

    <li class="relative">
      <button type="button" x-ref="proc" id="nmcur-t-proc" aria-current="true"
              aria-controls="nmcur-p-proc" :aria-expanded="open === 'proc'"
              @mouseenter="hover('proc')"
              @click="open === 'proc' ? shut($refs.proc) : jump('proc')"
              @keydown.arrow-down.prevent="jump('proc')"
              class="flex items-center gap-1.5 rounded-lg bg-zinc-200 px-3 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Procurement
        <span class="flex transition-transform motion-reduce:transition-none" :class="open === 'proc' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
        </span>
      </button>

      <div x-ref="procPanel" x-show="open === 'proc'" x-cloak
           id="nmcur-p-proc" aria-labelledby="nmcur-t-proc"
           class="absolute top-full left-0 z-40 pt-2">
        <ul class="w-64 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
          <li><a href="/procurement/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">All of Procurement</a></li>
          <li>
            <a href="/procurement/orders/" aria-current="page"
               class="block rounded-lg bg-zinc-200 px-3 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Purchase orders</a>
          </li>
          <li><a href="/procurement/requisitions/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Requisitions</a></li>
          <li><a href="/procurement/contracts/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Rate contracts</a></li>
          <li><a href="/vendors/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Vendors</a></li>
        </ul>
      </div>
    </li>

    <li>
      <a href="/inventory/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Inventory</a>
    </li>
    <li>
      <a href="/reports/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reports</a>
    </li>
  </ul>
</nav>` },

      { id: 'phone', name: 'On a phone', code:
`<!-- At 390px this stops being a hover bar and becomes a disclosure list, and
     that is a different piece of markup rather than the same one reflowed. In
     an app this carries sm:hidden and the bar carries hidden sm:block; here it
     stands alone so it can be read on its own.

     There is no hover to open with, no room for four section names on one
     line, and no pointer that can travel a bridge. So every open is a tap, and
     all the hover-intent machinery is gone rather than left in place doing
     nothing — code that only runs on a device the component is not on is code
     nobody will ever check.

     Sections push the page down instead of floating over it. A floating panel
     on a phone covers the content and then needs its own dismiss affordance,
     a backdrop and a scroll lock, at which point it is a sheet and should be
     built as one.

     Several sections can be open at once. Closing one as another opens shifts
     every link below it by the height of the section that just collapsed, and
     on a touch screen the finger is already on its way down to a target that
     has moved. That is worth a longer list.

     x-cloak sits on the whole list and on each section body: without it the
     entire route map is on screen for the frame before Alpine boots, which on
     a phone is most of a screenful.

     The menu and close icons are two elements with x-show on the spans around
     them, not one <i> with the name bound. createIcons() replaces the <i> with
     an <svg> and any binding on it goes with the element; a name that never
     changes survives being read once, and one that toggles does not. -->
<div data-kui="navigation-menu/phone" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{ nav: false, open: { proc: true, inv: false, rep: false } }">
  <div class="flex h-12 items-center justify-between gap-3 px-3">
    <span class="text-[13px]/5 font-medium">Operations</span>
    <button type="button" @click="nav = !nav" :aria-expanded="nav" aria-controls="nmph-list"
            class="flex size-9 items-center justify-center rounded-lg hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :aria-label="nav ? 'Close navigation' : 'Open navigation'">
      <span x-show="!nav" class="flex"><i data-lucide="menu" class="size-4 text-zinc-600"></i></span>
      <span x-show="nav" x-cloak class="flex"><i data-lucide="x" class="size-4 text-zinc-600"></i></span>
    </button>
  </div>

  <nav id="nmph-list" aria-label="Main" x-show="nav" x-cloak class="border-t border-zinc-200 p-2">
    <ul class="space-y-0.5">
      <li>
        <a href="/dashboard/" class="block rounded-lg px-3 py-2.5 text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Dashboard</a>
      </li>

      <li>
        <button type="button" @click="open.proc = !open.proc" :aria-expanded="open.proc" aria-controls="nmph-proc"
                class="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Procurement
          <span class="flex transition-transform motion-reduce:transition-none" :class="open.proc && 'rotate-180'">
            <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
          </span>
        </button>
        <ul id="nmph-proc" x-show="open.proc" class="mt-0.5 ml-3 space-y-0.5 border-l border-zinc-200 pl-3">
          <li><a href="/procurement/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">All of Procurement</a></li>
          <li><a href="/procurement/orders/" aria-current="page" class="block rounded-lg bg-zinc-200 px-3 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Purchase orders</a></li>
          <li><a href="/procurement/requisitions/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Requisitions</a></li>
          <li><a href="/vendors/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Vendors</a></li>
        </ul>
      </li>

      <li>
        <button type="button" @click="open.inv = !open.inv" :aria-expanded="open.inv" aria-controls="nmph-inv"
                class="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Inventory
          <span class="flex transition-transform motion-reduce:transition-none" :class="open.inv && 'rotate-180'">
            <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
          </span>
        </button>
        <ul id="nmph-inv" x-show="open.inv" x-cloak class="mt-0.5 ml-3 space-y-0.5 border-l border-zinc-200 pl-3">
          <li><a href="/inventory/stock/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Stock on hand</a></li>
          <li><a href="/inventory/grn/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Goods receipt</a></li>
          <li><a href="/inventory/transfers/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Transfers</a></li>
        </ul>
      </li>

      <li>
        <button type="button" @click="open.rep = !open.rep" :aria-expanded="open.rep" aria-controls="nmph-rep"
                class="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Reports
          <span class="flex transition-transform motion-reduce:transition-none" :class="open.rep && 'rotate-180'">
            <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
          </span>
        </button>
        <ul id="nmph-rep" x-show="open.rep" x-cloak class="mt-0.5 ml-3 space-y-0.5 border-l border-zinc-200 pl-3">
          <li><a href="/reports/consumption/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Consumption</a></li>
          <li><a href="/reports/ageing/" class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Invoice ageing</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</div>` },

      { id: 'htmx', name: 'Fetched on first open', code:
`<!-- The section links are rendered with the page, because they are the same
     for every user in a role and fetching them buys nothing. What is fetched
     is the half that is personal — the records this buyer last had open — and
     that is the only part of a navigation panel that ever justifies a request.
     Fetch the whole panel and you have made the route map depend on the
     network.

     The request goes out when the panel opens, not on mouseenter. This is the
     second job the 140ms hover delay does: without it, dragging the pointer
     across a bar of four sections fires four requests and the user reads
     whichever one lands last.

     Fetching once is an Alpine flag rather than htmx's own once modifier, and
     the difference only shows on a failure. once is spent the moment the
     request is fired, so a 500 leaves the trigger disarmed and the panel holds
     its skeleton for the rest of the session. loaded is set from
     htmx:after-request and only when it succeeded, so the next open retries.
     hx-sync="this:drop" throws away a second request while one is in flight,
     which is what a pointer leaving and re-entering the trigger produces.

     x-effect re-runs when open or loaded changes, which is exactly the trigger
     condition, and dispatching a plain CustomEvent on the button is how Alpine
     hands over to htmx — htmx listens for any event name you give hx-trigger.

     hx-indicator points at the body so .htmx-request fades it for the length
     of the request with no custom CSS.

     There is no CSRF token on this and there should not be: opening a menu is
     a read, so it is a GET, and a navigation panel that needs a token is a
     navigation panel that is writing something. -->
<nav data-kui="navigation-menu/htmx" aria-label="Main" class="relative rounded-xl border border-zinc-300 bg-white p-1"
     x-data="{
       open: null,
       timer: 0,
       loaded: false,
       failed: false,
       fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
       hover(id) {
         if (!this.fine) return;
         clearTimeout(this.timer);
         if (this.open) { this.open = id; return }
         this.timer = setTimeout(() => this.open = id, 140);
       },
       leave() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = null, 280) },
       jump(id) {
         clearTimeout(this.timer);
         this.open = id;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs[id + 'Panel']?.querySelector('a')?.focus()));
       },
       shut(back) { clearTimeout(this.timer); this.open = null; if (back) back.focus() }
     }"
     x-effect="if (open === 'proc' && !loaded) $refs.proc.dispatchEvent(new CustomEvent('nav-open'))"
     @htmx:after-request.camel="
       if ($event.detail.successful) { loaded = true; failed = false } else { failed = true }"
     @mouseenter="clearTimeout(timer)"
     @mouseleave="leave()"
     @focusout="if (!$el.contains($event.relatedTarget)) shut()"
     @click.outside="shut()"
     @keydown.escape="if (open) { $event.stopPropagation(); shut($refs[open]) }">
  <ul class="flex flex-wrap items-center gap-1">
    <li>
      <button type="button" x-ref="proc" id="nmh-t-proc"
              aria-controls="nmh-p-proc" :aria-expanded="open === 'proc'"
              hx-get="/nav/procurement/recent/" hx-target="#nmh-recent"
              hx-swap="innerHTML" hx-trigger="nav-open" hx-sync="this:drop"
              hx-indicator="#nmh-recent"
              @mouseenter="hover('proc')"
              @click="open === 'proc' ? shut($refs.proc) : jump('proc')"
              @keydown.arrow-down.prevent="jump('proc')"
              class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="open === 'proc' ? 'bg-zinc-200 font-medium text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'">
        Procurement
        <span class="flex transition-transform motion-reduce:transition-none" :class="open === 'proc' && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
        </span>
      </button>
    </li>
    <li>
      <a href="/inventory/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Inventory</a>
    </li>
    <li>
      <a href="/reports/" @mouseenter="if (open) shut()"
         class="block rounded-lg px-3 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reports</a>
    </li>
  </ul>

  <div x-ref="procPanel" x-show="open === 'proc'" x-cloak
       id="nmh-p-proc" aria-labelledby="nmh-t-proc"
       class="absolute top-full left-0 z-40 w-full pt-2">
    <div class="rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 class="px-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Procurement</h3>
          <ul>
            <li><a href="/procurement/" class="block rounded-lg px-2 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">All of Procurement</a></li>
            <li><a href="/procurement/orders/" class="block rounded-lg px-2 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Purchase orders</a></li>
            <li><a href="/procurement/requisitions/" class="block rounded-lg px-2 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Requisitions</a></li>
            <li><a href="/vendors/" class="block rounded-lg px-2 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Vendors</a></li>
          </ul>
        </div>

        <div>
          <h3 class="px-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">Recently opened</h3>

          <div id="nmh-recent" class="transition-opacity [&.htmx-request]:opacity-40">
            <div class="space-y-2 p-2" aria-hidden="true">
              <div class="h-4 w-2/3 rounded bg-zinc-200"></div>
              <div class="h-3 w-1/2 rounded bg-zinc-200"></div>
              <div class="h-4 w-3/5 rounded bg-zinc-200"></div>
              <div class="h-3 w-2/5 rounded bg-zinc-200"></div>
            </div>
          </div>

          <p x-show="failed" x-cloak role="status" class="flex flex-wrap items-center gap-x-2 gap-y-1 px-2 pt-1 text-[12px]/4 font-medium text-red-600">
            <span class="flex items-center gap-1.5">
              <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>Could not load your recent records
            </span>
            <button type="button" class="font-normal text-zinc-900 underline underline-offset-2"
                    @click="$refs.proc.dispatchEvent(new CustomEvent('nav-open'))">Try again</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</nav>` }
    ]
  },

  {
    id: 'sidebar', name: 'Sidebar', category: 'navigation',
    description: 'The primary navigation panel of the console: a header, grouped menus with counts and submenus, and a footer for the signed-in user. It has three forms — a 256px panel, a 68px icon rail, and an off-canvas sheet over the page.',
    when: 'Any signed-in screen with more than about five destinations, which in practice means every screen in the console. Below that, put the destinations in the topbar and skip the panel entirely — a sidebar holding four links spends 256px of a laptop to say what a row of tabs says in 40. This entry is the panel; the page skeleton that holds it beside the topbar and the scrolling main column is app-shell.',
    notes: [
      'sidebar is the panel and app-shell is the skeleton, and the split is worth holding. The panel owns its header, its groups, its menu items, its submenus, its footer, and the three forms it takes. The shell owns the fixed-height flex frame, the topbar beside it, the single scrolling main column, the backdrop behind the off-canvas form, and the breakpoint where the rail stops being available. Rebuild the frame inside the panel and you get two elements both claiming the full height, at which point the main column scrolls the sidebar along with it and the footer walks off the bottom of the screen. The two have to agree on exactly three numbers — the expanded width, the rail width, and the breakpoint — and nothing else.',
      'Three states, not two sizes. Expanded is 256px, the rail is 68px, and off-canvas is a 288px sheet over a dimmed page. They do not all exist at the same width: the rail is an lg-and-up state, because a 68px rail on a 390px phone spends a sixth of the screen on a column of icons that has no room for a flyout beside it. Below lg the sidebar is either closed or a modal sheet, which is why the collapse toggle is hidden below lg and the topbar hamburger is not. Ship the rail on a phone and the first bug report is that the menu covers the order it was supposed to open.',
      'The rail is not the same menu narrower. Every label loses its box, and a label with nowhere to go has to become two things at once: a tooltip for the sighted user and an aria-label for everyone else. Doing only the first is the commonest defect in this component — a column of eleven unnamed icons that screen-reads as eleven links called nothing, and that a new joiner navigates by trial and error for a fortnight. Write the aria-label first and the tooltip second, and mark the tooltip aria-hidden so the name is not read twice.',
      'The rail is 68px, not the 48 or 56 other systems use, and the number comes from what has to fit in it: a 40px hit target leaves 14px of clear space either side, and a count pill overhanging the icon box needs somewhere to sit before it touches the border. At 56px the pill clips against the edge and the icons start reading as a strip rather than a column. This is the width app-shell already uses and the width on the reference screen; changing it here and not there produces a sidebar that jumps by 12px the moment it is dropped into the real shell.',
      'Persist the collapsed state, and understand that reading it in Alpine alone guarantees a flash. x-init runs after the first paint, so the browser draws the 256px panel, Alpine reads localStorage, and the panel snaps to 68px on every single navigation — and if the aside carries transition-all, the snap is a 200ms animation the user watches on every page load. There are three honest fixes. A cookie the server reads and stamps as a class in the template is the right one for Django: correct on the first byte, no script involved, and Alpine can read the same cookie so there is one source of truth. A blocking inline script in the head that puts a class on the html element is the fix when there is no server to ask. localStorage read in x-init is the third and it always flashes. Note that @alpinejs/persist is not on the page — llms.txt loads collapse and focus and nothing else — so $persist, which is what everyone reaches for first, is not available here at all. Whichever you pick, gate the transition classes behind a ready flag set in $nextTick, or the correction animates.',
      'The active item is aria-current="page" and bg-zinc-100 together, never one without the other, and exactly one element in the document carries it. bg-zinc-100 is a tinted surface rather than a tinted shape, so it takes no ring. It also has to survive the collapse: in the rail the tint moves onto the 40px icon box, and an active state that only exists in the expanded form means the rail cannot answer the one question navigation exists to answer. The panel is bg-white precisely so the tint has a step to move into — tint the panel itself zinc-100, as several systems do, and the current row measures 1.00 against its own container, which is not low contrast but the identical colour. Hover paints that same tint, so weight is all that is left to separate "you are here" from "the pointer is here": idle rows are font-normal text-zinc-600 and the current row alone is font-medium text-zinc-900. llms.txt files nav items under font-medium and the reference screen does not, and the screen is right — set all twenty rows to 500 and the current one has nothing left to say with.',
      'A section that expands to reveal its pages must open itself when a descendant is the current page, and that seed comes from the server, not from a click. An x-data that starts with an empty open map closes the section the moment the user follows a link inside it, because the click is a full page load and the new document has no memory of what was open — the nav folds up under them on every navigation within the section they are working in. Render the seed: open the section whose child is current, keep any section the user opened by hand in the same persisted store, and never close a sibling when one opens. Sections are not an accordion; a single-open rule adds a click to every journey across the nav. The ancestor itself does not take aria-current="page" — there is one current page per document and it is the leaf, so the parent row gets a visual mark instead, which earns its place only when the section can be closed and is the only signal at all in the rail, where the child list is not on screen.',
      'The rail flyout opens on hover and on focus, and the gap between the rail and the panel is the entire problem. Write the gap as padding on the positioned wrapper — left-full with pl-1 — never as a margin, or the pointer crosses four pixels of dead ground, mouseleave fires, and the flyout closes underneath a cursor that was travelling towards it. mouseleave must also refuse to close while focus is inside the flyout, or tabbing into it and then moving the mouse a pixel throws the keyboard user out of the panel they are in. Escape closes it and returns focus to the rail item, which is the only way back for somebody who is not using a mouse. A scrolling rail clips its own flyouts, because overflow-y:auto forces overflow-x to auto and there is no way to have one axis visible — if the rail has more destinations than fit, the flyout has to be positioned from the trigger rectangle rather than anchored inside the scroller.',
      'The nav is a list of links in the normal Tab order, and it should stay one. Giving it role="menu" and role="menuitem" makes the whole nav a single tab stop with roving arrow-key focus, which sounds like an improvement and is not: it strips the link role, so the announcement no longer says link and the affordances that hang off that go with it; it puts screen readers into application mode, where the reading keys the user already knows stop working; and it promises the behaviour of an action menu — one that closes when you pick something — which a navigation list does not have. Yes, it is longer to tab through. That is what the skip link at the top of the shell is for, and a skip link costs one tab stop rather than every keyboard convention the user has.',
      'The header and footer are shrink-0 and the nav body is min-h-0 flex-1 overflow-y-auto, and min-h-0 is the load-bearing half. A flex item defaults to min-height:auto, so without it the nav refuses to shrink below its content, the column grows past the frame, and the footer is pushed off the bottom edge with no scrollbar anywhere, because nothing ever overflowed. The edges under the header and over the footer are drawn only when there is content behind them: a rule that is always there says the workspace switcher is a separate block from the nav, which is a different claim from the one you meant. Draw both edges from the start as border-transparent and change only the colour, because adding a border on scroll moves every row below it down a pixel and the nav twitches under the cursor. overscroll-contain on the body, or scrolling the nav to its end scrolls the page behind it.',
      'A count in the rail is the case that breaks naive implementations. 148 does not fit in a 40px box, and shrinking it until it does produces four pixels of type nobody reads. The rail carries a two-digit pill capped at 99+, or a plain dot when the number does not matter and only the fact of a queue does, and the quantity moves into the accessible name: aria-label="Goods receipt, 12 awaiting". In the expanded form the count is inside the anchor, so it joins the accessible name for free — which is exactly why it must not be lifted out and absolutely positioned beside the link, where it becomes an unattached number that reads as "148" with nothing to attach it to.',
      'The off-canvas form is modal and has to behave like one: x-trap.noscroll so Tab stays inside it and the list behind stops scrolling, Escape to close, focus back to the topbar button that opened it, and closed on route change — a nav still sitting open over the page it just navigated to is the phone bug everybody ships once. Do not make it full width. Leaving a hundred pixels of dimmed page beside it is the only thing that says you are still on the orders list, and a full-bleed nav is indistinguishable from having navigated to a menu page, which is a place the back button then has to get you out of.'
    ],
    anatomy: [
      ['Header', 'The workspace or plant the user is looking at, as a mark plus a name, and usually a switcher. Fixed — it does not scroll with the nav. In the rail only the 32px mark survives and the switcher becomes a flyout.'],
      ['Group', 'An 11px uppercase label over a set of items, as a real heading id with the list pointed at it by aria-labelledby. Worth having once the nav passes about six entries; below that it is a label on a set of one.'],
      ['Menu item', 'An anchor at min-h-9 holding an 18px icon, a truncating label, and an optional count. Idle is zinc-600 at 400; current is bg-zinc-100, zinc-900 and 500, with aria-current="page".'],
      ['Badge', 'The count on the right of an item. A plain figure when it is only the size of the list, a tinted pill with its ring when it is a queue the user owns, and a 6px dot when the colour is the point. Capped at 99+ and always tabular-nums.'],
      ['Submenu', 'The child list under a section, animated by x-collapse, indented past the icon column and held by a left rule so the descendants read as belonging to the row above them.'],
      ['Rail label', 'What the hidden label becomes at 68px. For a leaf, a sibling span shown on hover and focus-within, aria-hidden because the anchor already carries the same words as an aria-label, and never bound on the i element — Lucide replaces that with an svg and the binding dies with it. For a section, the same slot is a flyout panel at left-full whose gap is padding rather than margin, flipped to bottom-anchored near the foot of the viewport, closing on Escape with focus returned to the rail item.'],
      ['Footer', 'The signed-in user, their role and their plant, as the trigger for the account menu. Fixed. The menu opens upward because there is no room below it, and sideways in the rail because a 224px menu hanging off a 40px avatar looks unattached.'],
      ['Collapse control', 'A full-width strip at the very bottom whose icon sits in a fixed 68px box on the left, so the aim point is at the same coordinates in both states. lg and up only.']
    ],
    behaviour: [
      'Three forms, and which one is available depends on width. At lg and up the panel toggles between 256px and a 68px rail. Below lg there is no rail: the sidebar is closed or it is a modal sheet over the page, opened from the topbar and closed by Escape, by the backdrop, or by following a link.',
      'The collapsed state persists, and it is stamped on the first paint rather than corrected after it. A cookie the server reads is the version with no flash; localStorage read in x-init draws the wrong width for a frame on every navigation.',
      'Exactly one item is current, carrying both bg-zinc-100 and aria-current="page", and it stays current through a collapse — in the rail the tint moves onto the icon box.',
      'A section containing the current page is open when the page loads, and it stays open when the user moves between its children. Opening one section does not close another.',
      'The rail shows a label on hover and on focus. Where an item has children, that becomes a flyout panel, reached by travelling the pointer across a padded bridge, flipped upward near the bottom of the screen, and dismissed with Escape back to the rail item.',
      'The nav body scrolls; the header and footer do not. The edges above and below it appear only when there is something scrolled behind them.',
      'Counts are the size of a queue, not decoration. In the panel they sit inside the anchor; in the rail they collapse to two digits, a 99+ cap, or a dot, with the number moved into the accessible name.',
      'Nothing navigates on hover. Hover reveals a name or a submenu and never changes the page — a nav that loads on hover makes crossing the sidebar to reach the main column a series of accidental page loads.',
      'A permission-filtered nav that is fetched rather than rendered shows a skeleton of the right height in the body only, so the header and footer never move when the real list lands.'
    ],
    a11y: [
      'The panel is a nav landmark with an accessible name, so it can be reached and skipped as a landmark rather than tabbed through. If the topbar also holds a nav, the two names have to differ — Main and Breadcrumb — or a landmark list shows two entries called Navigation.',
      'Group labels are real elements with ids, and each list points at its label with aria-labelledby. The lists carry role="list", because preflight sets list-style:none and Safari drops list semantics from a list with no marker, which takes the item count with it.',
      'aria-current="page" marks the leaf and only the leaf. An ancestor of the current page gets a visual mark and no aria-current — there is one current page per document, and a second one makes both meaningless.',
      'Every rail item keeps an accessible name with its label hidden, and the count goes into that name rather than floating beside it: aria-label="Goods receipt, 12 awaiting" rather than an unattached 12. The visible tooltip is aria-hidden, or the name is announced twice.',
      'The items are links in the ordinary Tab order. role="menu" turns the nav into one tab stop with roving focus, strips the link role, and puts the reader into application mode where its own navigation keys stop working. Length is solved by a skip link, not by rewriting the widget.',
      'The collapse control is a real button with aria-expanded bound to the state and aria-controls naming the panel, and it is hidden below lg where the state it toggles does not exist.',
      'A section trigger is a button with aria-expanded and aria-controls, and the panel carries that id. Ids rendered in a loop take the section key, or the second trigger points at the first panel and both rows open the same list.',
      'The off-canvas form is role="dialog" aria-modal="true" with x-trap.noscroll: focus enters it, stays in it, and returns to the topbar button on close. Focus indicators inside the scrolling body take -outline-offset-2, because a 2px outer offset on a row flush against the scroller is clipped by it.'
    ],
    related: ['app-shell', 'topbar', 'navigation-menu'],
    variants: [
      { id: 'default', name: 'Expanded panel', code:
`<!-- The panel is three rows in a flex column and only the middle one scrolls.
     min-h-0 on the nav is the load-bearing half: a flex item defaults to
     min-height:auto, so without it the nav refuses to shrink below its content,
     the column grows past 560px, and the footer is pushed off the bottom edge —
     with no scrollbar anywhere, because nothing ever overflowed.

     Both edges exist from the first frame as border-transparent and only the
     colour changes. Adding a border on scroll moves every row below it down one
     pixel and the nav twitches under the cursor.

     The panel is bg-white so the active row has a step to move into. Tint the
     panel zinc-100 and bg-zinc-100 on the current item measures 1.00 against its
     own container: not low contrast, the same colour. Hover paints that tint
     too, so weight is what separates "you are here" from "the pointer is here".

     The counts sit inside the anchor, which is why they need no aria work — the
     name is already "Purchase orders, 148". Lift one out into a span positioned
     beside the link and it becomes a number with nothing attached to it. -->
<div data-kui="sidebar/default" class="flex h-[560px] w-64 flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white text-[14px]/5 text-zinc-900"
     x-data="{ scrolled: false, more: true }">

  <div class="flex h-14 shrink-0 items-center gap-2.5 border-b border-transparent px-4 transition-colors"
       :class="scrolled && 'border-zinc-200'">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
    <span class="min-w-0 flex-1">
      <span class="block truncate text-[14px]/5 font-semibold">Operations</span>
      <span class="block truncate text-[11px]/4 text-zinc-500">Vasai plant</span>
    </span>
  </div>

  <nav aria-label="Main" class="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-2"
       @scroll="scrolled = $el.scrollTop > 0; more = $el.scrollHeight - $el.scrollTop - $el.clientHeight > 1">

    <p id="sb1-g1" class="px-2.5 pt-1 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Procurement</p>
    <ul role="list" aria-labelledby="sb1-g1" class="space-y-0.5">
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="layout-dashboard" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Overview</span>
        </a>
      </li>
      <li>
        <a href="#" aria-current="page" class="flex min-h-9 items-center gap-3 rounded-lg bg-zinc-200 px-2.5 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="file-text" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Purchase orders</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">148</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="clipboard-list" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Requisitions</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">62</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="truck" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Goods receipt</span>
          <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">12</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="receipt" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Invoices</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">9</span>
        </a>
      </li>
    </ul>

    <p id="sb1-g2" class="px-2.5 pt-4 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Master data</p>
    <ul role="list" aria-labelledby="sb1-g2" class="space-y-0.5">
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="building-2" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Vendors</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">187</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="package" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Materials</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">2,418</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="scale" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Rate contracts</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">24</span>
        </a>
      </li>
    </ul>

    <p id="sb1-g3" class="px-2.5 pt-4 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Saved views</p>
    <ul role="list" aria-labelledby="sb1-g3" class="space-y-0.5">
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="ml-[3px] size-1.5 shrink-0 rounded-full bg-red-600" aria-hidden="true"></span>
          <span class="min-w-0 flex-1 truncate">Overdue over 7 days</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">18</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="ml-[3px] size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>
          <span class="min-w-0 flex-1 truncate">Awaiting GRN</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">27</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="ml-[3px] size-1.5 shrink-0 rounded-full bg-zinc-400" aria-hidden="true"></span>
          <span class="min-w-0 flex-1 truncate">My approvals</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">4</span>
        </a>
      </li>
    </ul>
  </nav>

  <div class="shrink-0 border-t border-transparent p-2 transition-colors" :class="more && 'border-zinc-200'">
    <button type="button" class="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300">AP</span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-[13px]/5 font-medium">Akshay Prabhu</span>
        <span class="block truncate text-[11px]/4 text-zinc-500">Level 2 approver</span>
      </span>
      <i data-lucide="chevrons-up-down" class="size-4 shrink-0 text-zinc-500"></i>
    </button>
  </div>
</div>` },

      { id: 'counts', name: 'Group labels and counts', code:
`<!-- Three kinds of number and the difference between them is what they are
     asking for. A plain figure is the size of the list — 187 vendors is context,
     not a task. A tinted pill is a queue this user owns and is expected to
     empty; it is a shape, so it takes bg-zinc-200 with its ring rather than the
     zinc-100 surface, which would measure identical to the active row behind it.
     A dot is a state with no useful count, and it is the only place colour is
     allowed to appear in this panel.

     Put a pill on every row and the column reads as a traffic light by the
     eighth item and stops meaning anything. One pill in twelve rows is read.

     99+ is a real cap, not a nicety. Invoices on hold runs to four digits at
     month end, and a four-digit pill pushes the label into a truncation that
     makes half the nav read as "Purchase or…".

     The group action stays visible instead of appearing on hover. A control that
     needs a pointer to exist does not exist on a phone at all, and the opacity-0
     version is worse than useless: it stays in the Tab order, so a keyboard user
     lands on a button that paints nothing. -->
<div data-kui="sidebar/counts" class="flex h-[560px] w-64 flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white text-[14px]/5 text-zinc-900">
  <div class="flex h-14 shrink-0 items-center gap-2.5 border-b border-zinc-200 px-4">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
    <span class="min-w-0 flex-1 truncate text-[14px]/5 font-semibold">Operations</span>
  </div>

  <nav aria-label="Main" class="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-2">
    <div class="flex items-center gap-1 pt-1 pb-1">
      <p id="sb2-g1" class="min-w-0 flex-1 truncate px-2.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">My queues</p>
      <button type="button" aria-label="New purchase order"
              class="flex size-6 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="plus" class="size-3.5"></i>
      </button>
    </div>
    <ul role="list" aria-labelledby="sb2-g1" class="space-y-0.5">
      <li>
        <a href="#" aria-current="page" class="flex min-h-9 items-center gap-3 rounded-lg bg-zinc-200 px-2.5 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="truck" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Awaiting GRN</span>
          <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">12</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="stamp" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Pending my approval</span>
          <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">4</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="receipt" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Invoices on hold</span>
          <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">99+</span>
        </a>
      </li>
    </ul>

    <p id="sb2-g2" class="px-2.5 pt-4 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Registers</p>
    <ul role="list" aria-labelledby="sb2-g2" class="space-y-0.5">
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="file-text" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Purchase orders</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">1,438</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="building-2" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Vendors</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">187</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="book-open" class="size-[18px] shrink-0"></i>
          <span class="min-w-0 flex-1 truncate">Item ledger</span>
        </a>
      </li>
    </ul>

    <p id="sb2-g3" class="px-2.5 pt-4 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Saved views</p>
    <ul role="list" aria-labelledby="sb2-g3" class="space-y-0.5">
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="ml-[3px] size-1.5 shrink-0 rounded-full bg-red-600" aria-hidden="true"></span>
          <span class="min-w-0 flex-1 truncate">Overdue over 7 days</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">18</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="ml-[3px] size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>
          <span class="min-w-0 flex-1 truncate">Rate contracts expiring</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">6</span>
        </a>
      </li>
      <li>
        <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="ml-[3px] size-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true"></span>
          <span class="min-w-0 flex-1 truncate">Closed this month</span>
          <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">212</span>
        </a>
      </li>
    </ul>
  </nav>

  <div class="shrink-0 border-t border-zinc-200 px-4 py-2.5">
    <p class="text-[12px]/4 tabular-nums text-zinc-500">Counts as at 16 Aug 2026, 11:04</p>
  </div>
</div>` },

      { id: 'nested', name: 'Nested children', code:
`<!-- The open map is seeded, not empty. In Django it is rendered — open: { orders:
     {% if section == 'orders' %}true{% else %}false{% endif %}, ... } — because
     the click that moves between the children of a section is a full page load,
     and a map that starts empty folds the section up underneath the user on
     every one of those navigations. That is the bug this variant exists for.

     Opening one section does not close another. A nav is not an accordion: the
     single-open rule saves two rows of height and costs a click on every journey
     across the tree.

     The parent of the current page gets a dot, not aria-current. There is one
     current page per document and it is the leaf.

     x-collapse animates the wrapper, so the wrapper carries nothing but x-show
     and the id: border-box means height:0 cannot go below padding and borders,
     so a panel carrying them bottoms out and then vanishes in one frame. The ul
     inside takes py-1 rather than a margin — a margin on the first child
     collapses through the wrapper and the measured height comes up short by
     exactly that margin, clipping the last row until the next toggle. -->
<div data-kui="sidebar/nested" class="flex h-[560px] w-64 flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white text-[14px]/5 text-zinc-900"
     x-data="{ open: { orders: true, vendors: false, quality: false } }">
  <div class="flex h-14 shrink-0 items-center gap-2.5 border-b border-zinc-200 px-4">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
    <span class="min-w-0 flex-1 truncate text-[14px]/5 font-semibold">Operations</span>
  </div>

  <nav aria-label="Main" class="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-2">
    <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="layout-dashboard" class="size-[18px] shrink-0"></i>
      <span class="min-w-0 flex-1 truncate">Overview</span>
    </a>

    <div>
      <button type="button" @click="open.orders = !open.orders" :aria-expanded="open.orders" aria-controls="sb3-orders"
              class="flex min-h-9 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="file-text" class="size-[18px] shrink-0"></i>
        <span class="min-w-0 flex-1 truncate">Purchase orders</span>
        <span x-show="!open.orders" x-cloak class="size-1.5 shrink-0 rounded-full bg-zinc-700" aria-hidden="true"></span>
        <span class="flex shrink-0 transition-transform motion-reduce:transition-none" :class="open.orders && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-500"></i>
        </span>
      </button>
      <div id="sb3-orders" x-show="open.orders" x-collapse.duration.200ms>
        <ul role="list" class="ml-[26px] space-y-0.5 border-l border-zinc-100 py-1 pl-2">
          <li>
            <a href="#" class="flex min-h-8 items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="min-w-0 flex-1 truncate">All orders</span>
              <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">1,438</span>
            </a>
          </li>
          <li>
            <a href="#" aria-current="page" class="flex min-h-8 items-center gap-2 rounded-lg bg-zinc-200 px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="min-w-0 flex-1 truncate">Awaiting GRN</span>
              <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">12</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex min-h-8 items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="min-w-0 flex-1 truncate">Overdue over 7 days</span>
              <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">18</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex min-h-8 items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="min-w-0 flex-1 truncate">Closed</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div>
      <button type="button" @click="open.vendors = !open.vendors" :aria-expanded="open.vendors" aria-controls="sb3-vendors"
              class="flex min-h-9 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="building-2" class="size-[18px] shrink-0"></i>
        <span class="min-w-0 flex-1 truncate">Vendors</span>
        <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">187</span>
        <span class="flex shrink-0 transition-transform motion-reduce:transition-none" :class="open.vendors && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-500"></i>
        </span>
      </button>
      <div id="sb3-vendors" x-show="open.vendors" x-cloak x-collapse.duration.200ms>
        <ul role="list" class="ml-[26px] space-y-0.5 border-l border-zinc-100 py-1 pl-2">
          <li><a href="#" class="flex min-h-8 items-center rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Approved vendors</a></li>
          <li><a href="#" class="flex min-h-8 items-center rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Pending KYC</a></li>
          <li><a href="#" class="flex min-h-8 items-center rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Rate contracts</a></li>
          <li><a href="#" class="flex min-h-8 items-center rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Vendor performance</a></li>
        </ul>
      </div>
    </div>

    <div>
      <button type="button" @click="open.quality = !open.quality" :aria-expanded="open.quality" aria-controls="sb3-quality"
              class="flex min-h-9 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="flask-conical" class="size-[18px] shrink-0"></i>
        <span class="min-w-0 flex-1 truncate">Quality</span>
        <span class="flex shrink-0 transition-transform motion-reduce:transition-none" :class="open.quality && 'rotate-180'">
          <i data-lucide="chevron-down" class="size-3.5 text-zinc-500"></i>
        </span>
      </button>
      <div id="sb3-quality" x-show="open.quality" x-cloak x-collapse.duration.200ms>
        <ul role="list" class="ml-[26px] space-y-0.5 border-l border-zinc-100 py-1 pl-2">
          <li><a href="#" class="flex min-h-8 items-center rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Inward inspection</a></li>
          <li><a href="#" class="flex min-h-8 items-center rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Lab results</a></li>
          <li><a href="#" class="flex min-h-8 items-center rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Rejections</a></li>
        </ul>
      </div>
    </div>

    <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="package" class="size-[18px] shrink-0"></i>
      <span class="min-w-0 flex-1 truncate">Materials</span>
    </a>
  </nav>

  <div class="shrink-0 border-t border-zinc-200 px-4 py-2.5">
    <p class="text-[12px]/4 text-zinc-500">Sections stay open across a navigation.</p>
  </div>
</div>` },

      { id: 'rail', name: 'Icon rail', code:
`<!-- Two labels for one item and both are compulsory. aria-label on the anchor is
     the real name; the dark bubble is a sibling span marked aria-hidden, or the
     item is announced twice. Ship only the bubble and the rail is eleven links
     called nothing to anyone not looking at it.

     The bubble cannot live on the i element: createIcons() replaces that node
     with an svg and takes every binding written against it along too. And
     group-hover alone is not enough — group-focus-within is what makes the rail
     usable from the keyboard, and it is the half everybody forgets because they
     test with a mouse.

     Counts do not survive at 40px. Two digits fit as a pill overhanging the
     corner and three do not, and the pill needs ring-2 ring-white to hold an
     edge against the icon under it. Anything wider becomes a dot and the
     quantity moves into the aria-label — which is why one reads "Invoices, 148
     on hold" while the dot beside it says nothing.

     This nav deliberately does not scroll: overflow-y:auto forces overflow-x to
     auto, so a scrolling rail clips its own tooltips at the right edge. More
     destinations than fit needs the flyout variant. -->
<div data-kui="sidebar/rail" class="flex h-[560px] w-[68px] flex-col rounded-xl border border-zinc-300 bg-white text-[14px]/5 text-zinc-900">
  <div class="flex h-14 shrink-0 items-center justify-center border-b border-zinc-200">
    <span class="flex size-8 items-center justify-center rounded-lg bg-zinc-700 text-white" aria-hidden="true"><i data-lucide="package" class="size-[18px]"></i></span>
  </div>

  <nav aria-label="Main" class="min-h-0 flex-1 space-y-1 py-2">
    <div class="group relative flex justify-center">
      <a href="#" aria-label="Overview"
         class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="layout-dashboard" class="size-[18px]"></i>
      </a>
      <span aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block group-focus-within:block">Overview</span>
    </div>

    <div class="group relative flex justify-center">
      <a href="#" aria-current="page" aria-label="Purchase orders, 148 open"
         class="relative flex size-10 items-center justify-center rounded-lg bg-zinc-200 text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="file-text" class="size-[18px]"></i>
        <span aria-hidden="true" class="absolute -top-1 -right-1 size-2 rounded-full bg-zinc-700 ring-2 ring-white"></span>
      </a>
      <span aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums whitespace-nowrap text-white group-hover:block group-focus-within:block">Purchase orders — 148 open</span>
    </div>

    <div class="group relative flex justify-center">
      <a href="#" aria-label="Goods receipt, 12 awaiting GRN"
         class="relative flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="truck" class="size-[18px]"></i>
        <span aria-hidden="true" class="absolute -top-1 -right-1 rounded-full bg-zinc-700 px-1 text-[11px]/4 font-medium tabular-nums text-white ring-2 ring-white">12</span>
      </a>
      <span aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums whitespace-nowrap text-white group-hover:block group-focus-within:block">Goods receipt — 12 awaiting</span>
    </div>

    <div class="group relative flex justify-center">
      <a href="#" aria-label="Invoices, 148 on hold"
         class="relative flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="receipt" class="size-[18px]"></i>
        <span aria-hidden="true" class="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-red-600 ring-2 ring-white"></span>
      </a>
      <span aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums whitespace-nowrap text-white group-hover:block group-focus-within:block">Invoices — 148 on hold</span>
    </div>

    <div class="mx-4 border-t border-zinc-100"></div>

    <div class="group relative flex justify-center">
      <a href="#" aria-label="Vendors, 187"
         class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="building-2" class="size-[18px]"></i>
      </a>
      <span aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums whitespace-nowrap text-white group-hover:block group-focus-within:block">Vendors — 187</span>
    </div>

    <div class="group relative flex justify-center">
      <a href="#" aria-label="Materials"
         class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="package" class="size-[18px]"></i>
      </a>
      <span aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block group-focus-within:block">Materials</span>
    </div>

    <div class="group relative flex justify-center">
      <a href="#" aria-label="Rate contracts, 6 expiring"
         class="relative flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="scale" class="size-[18px]"></i>
        <span aria-hidden="true" class="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
      </a>
      <span aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums whitespace-nowrap text-white group-hover:block group-focus-within:block">Rate contracts — 6 expiring</span>
    </div>

    <div class="group relative flex justify-center">
      <a href="#" aria-label="Analytics"
         class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="chart-no-axes-column" class="size-[18px]"></i>
      </a>
      <span aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block group-focus-within:block">Analytics</span>
    </div>
  </nav>

  <div class="shrink-0 border-t border-zinc-200 py-2">
    <div class="group relative flex justify-center">
      <button type="button" aria-label="Account — Akshay Prabhu, Level 2 approver"
              class="flex size-10 items-center justify-center rounded-lg hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex size-8 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300">AP</span>
      </button>
      <span aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block group-focus-within:block">Akshay Prabhu</span>
    </div>
  </div>
</div>` },

      { id: 'flyout', name: 'Rail flyout submenu', code:
`<!-- The gap between the rail and the panel is the whole problem. It is pl-1 on
     the positioned wrapper, never ml-1 on the card: with a margin those four
     pixels are outside the hover region, the pointer crosses dead ground,
     mouseleave fires, and the panel closes underneath a cursor that was
     travelling straight at it. As padding the bridge is part of the thing being
     hovered. mouseleave also refuses to close while focus is inside, or tabbing
     into the flyout and nudging the mouse throws the keyboard user out of it.

     Focus is what puts the flyout in the tab order at all. While it is hidden
     its links are display:none and unreachable, so focusin opening it is the
     only way a keyboard reaches the children of a rail item. Escape closes and
     returns focus to the rail item, because a user left with focus on nothing
     has to tab from the top of the document again; with the pointer still over
     it, it reopens on the next mouse move, which is correct.

     The flip is measured. On open the trigger rectangle is read and the panel
     anchors bottom-0 instead of top-0 when 260px would not fit below it — the
     account menu at the foot of the rail is permanently in that case. And the
     nav does not scroll, because overflow-y:auto would force overflow-x with it
     and clip every panel at the rail edge. -->
<div data-kui="sidebar/flyout" class="flex h-[560px] w-[68px] flex-col rounded-xl border border-zinc-300 bg-white text-[14px]/5 text-zinc-900">
  <div class="flex h-14 shrink-0 items-center justify-center border-b border-zinc-200">
    <span class="flex size-8 items-center justify-center rounded-lg bg-zinc-700 text-white" aria-hidden="true"><i data-lucide="package" class="size-[18px]"></i></span>
  </div>

  <nav aria-label="Main" class="min-h-0 flex-1 py-2">
    <ul role="list" class="space-y-1">
      <li class="relative flex justify-center">
        <a href="#" aria-label="Overview"
           class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="layout-dashboard" class="size-[18px]"></i>
        </a>
      </li>

      <li class="relative flex justify-center" x-data="{ open: false, flip: false }"
          @mouseenter="open = true; flip = $refs.trig.getBoundingClientRect().top + 264 > window.innerHeight"
          @mouseleave="if (!$el.contains(document.activeElement)) open = false"
          @focusin="open = true; flip = $refs.trig.getBoundingClientRect().top + 264 > window.innerHeight"
          @focusout="if (!$el.contains($event.relatedTarget)) open = false"
          @keydown.escape="if (open) { open = false; $refs.trig.focus() }">
        <a href="#" x-ref="trig" aria-current="page" aria-label="Purchase orders, 1,438 — section open"
           class="relative flex size-10 items-center justify-center rounded-lg bg-zinc-200 text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="file-text" class="size-[18px]"></i>
          <span aria-hidden="true" class="absolute -top-1 -right-1 rounded-full bg-zinc-700 px-1 text-[11px]/4 font-medium tabular-nums text-white ring-2 ring-white">12</span>
        </a>

        <div x-show="open" x-cloak class="absolute left-full z-50 w-60 pl-1" :class="flip ? 'bottom-0' : 'top-0'">
          <div class="rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
            <a href="#" class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="file-text" class="size-4 shrink-0 text-zinc-600"></i>Purchase orders
            </a>
            <div class="my-1 border-t border-zinc-100"></div>
            <ul role="list">
              <li><a href="#" class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><span class="min-w-0 flex-1 truncate">All orders</span><span class="shrink-0 text-[11px]/4 tabular-nums">1,438</span></a></li>
              <li><a href="#" class="flex items-center gap-2 rounded-lg bg-zinc-200 px-2.5 py-1.5 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15" aria-current="page"><span class="min-w-0 flex-1 truncate">Awaiting GRN</span><span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">12</span></a></li>
              <li><a href="#" class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><span class="min-w-0 flex-1 truncate">Overdue over 7 days</span><span class="shrink-0 text-[11px]/4 tabular-nums">18</span></a></li>
              <li><a href="#" class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><span class="min-w-0 flex-1 truncate">Closed</span></a></li>
            </ul>
          </div>
        </div>
      </li>

      <li class="relative flex justify-center" x-data="{ open: false, flip: false }"
          @mouseenter="open = true; flip = $refs.trig.getBoundingClientRect().top + 200 > window.innerHeight"
          @mouseleave="if (!$el.contains(document.activeElement)) open = false"
          @focusin="open = true; flip = $refs.trig.getBoundingClientRect().top + 200 > window.innerHeight"
          @focusout="if (!$el.contains($event.relatedTarget)) open = false"
          @keydown.escape="if (open) { open = false; $refs.trig.focus() }">
        <a href="#" x-ref="trig" aria-label="Vendors, 187"
           class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="building-2" class="size-[18px]"></i>
        </a>
        <div x-show="open" x-cloak class="absolute left-full z-50 w-60 pl-1" :class="flip ? 'bottom-0' : 'top-0'">
          <div class="rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
            <a href="#" class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="building-2" class="size-4 shrink-0 text-zinc-600"></i>Vendors
            </a>
            <div class="my-1 border-t border-zinc-100"></div>
            <ul role="list">
              <li><a href="#" class="flex rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Approved vendors</a></li>
              <li><a href="#" class="flex rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Pending KYC</a></li>
              <li><a href="#" class="flex rounded-lg px-2.5 py-1.5 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">Rate contracts</a></li>
            </ul>
          </div>
        </div>
      </li>

      <li class="relative flex justify-center">
        <a href="#" aria-label="Materials"
           class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="package" class="size-[18px]"></i>
        </a>
      </li>
    </ul>
  </nav>

  <!-- permanently in the flipped case: nothing fits below the last row -->
  <div class="shrink-0 border-t border-zinc-200 py-2">
    <div class="relative flex justify-center" x-data="{ open: false }"
         @mouseenter="open = true"
         @mouseleave="if (!$el.contains(document.activeElement)) open = false"
         @focusin="open = true"
         @focusout="if (!$el.contains($event.relatedTarget)) open = false"
         @keydown.escape="if (open) { open = false; $refs.trig.focus() }">
      <button type="button" x-ref="trig" :aria-expanded="open" aria-label="Account — Akshay Prabhu, Level 2 approver"
              class="flex size-10 items-center justify-center rounded-lg hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex size-8 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300">AP</span>
      </button>
      <div x-show="open" x-cloak class="absolute bottom-0 left-full z-50 w-60 pl-1">
        <div class="rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
          <div class="px-2.5 py-2">
            <p class="truncate text-[13px]/5 font-medium">Akshay Prabhu</p>
            <p class="truncate text-[12px]/4 text-zinc-500">Level 2 approver · Vasai plant</p>
          </div>
          <div class="my-1 border-t border-zinc-100"></div>
          <a href="#" class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="user" class="size-4 shrink-0"></i>My profile</a>
          <a href="#" class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="arrow-left-right" class="size-4 shrink-0"></i>Switch plant</a>
          <a href="#" class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="log-out" class="size-4 shrink-0"></i>Sign out</a>
        </div>
      </div>
    </div>
  </div>
</div>` },

      { id: 'collapse', name: 'Collapse and persist', code:
`<!-- Persisting in JavaScript alone guarantees a flash. x-init runs after the
     first paint, so the browser draws 256px, Alpine reads localStorage, and the
     panel snaps to 68px on every navigation. In Django the honest fix is a
     cookie: the view reads kon-sidebar and the template stamps w-64 or w-[68px]
     into the class attribute, so the first byte is right and Alpine reads the
     same cookie rather than a second source of truth. The trade is that the
     width is now server state — one more thing to get wrong in a cached
     response, and Vary: Cookie on every page that uses it. With no server it is
     a blocking head script setting a class on the html element. This variant
     shows the localStorage form because that is what pastes here, and it flashes.

     ready is the other half: without it the correction from the wrong width to
     the right one is animated, so the flash becomes a 200ms slide watched on
     every page load. @alpinejs/persist would do all of this in one directive and
     is not on the page, so $persist is not an option here.

     Labels hide with a plain hidden so the rail can be seen at 390px; inside
     app-shell it is lg:hidden, because below lg there is no rail state at all.
     The control keeps its icon in a fixed 68px box so its centre does not move
     between the two widths — centre it in the strip and the second click misses. -->
<div data-kui="sidebar/collapse" class="flex h-[560px] flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white text-[14px]/5 text-zinc-900"
     x-data="{ expanded: true, ready: false }"
     x-init="expanded = localStorage.getItem('kon-sidebar') !== '0';
             $nextTick(() => ready = true);
             $watch('expanded', v => localStorage.setItem('kon-sidebar', v ? '1' : '0'))"
     @keydown.window="if ($event.key === '[' && !/^(input|textarea|select)$/i.test($event.target.tagName)) expanded = !expanded"
     :class="[ expanded ? 'w-64' : 'w-[68px]', ready && 'transition-all duration-200 motion-reduce:transition-none' ]">

  <div class="flex h-14 shrink-0 items-center gap-2.5 border-b border-zinc-200" :class="expanded ? 'px-4' : 'justify-center'">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
    <span class="min-w-0 flex-1 truncate text-[14px]/5 font-semibold" :class="!expanded && 'hidden'">Operations</span>
  </div>

  <nav id="sb6-nav" aria-label="Main" class="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain py-2" :class="expanded ? 'px-3' : 'px-3.5'">
    <div class="group relative">
      <a href="#" aria-current="page" aria-label="Purchase orders, 148 open"
         class="flex min-h-9 items-center gap-3 rounded-lg bg-zinc-200 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
         :class="expanded ? 'px-2.5' : 'justify-center px-0'">
        <i data-lucide="file-text" class="size-[18px] shrink-0"></i>
        <span class="min-w-0 flex-1 truncate" :class="!expanded && 'hidden'">Purchase orders</span>
        <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600" :class="!expanded && 'hidden'">148</span>
      </a>
      <span x-show="!expanded" x-cloak aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums whitespace-nowrap text-white group-hover:block group-focus-within:block">Purchase orders — 148</span>
    </div>

    <div class="group relative">
      <a href="#" aria-label="Goods receipt, 12 awaiting GRN"
         class="relative flex min-h-9 items-center gap-3 rounded-lg py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
         :class="expanded ? 'px-2.5' : 'justify-center px-0'">
        <i data-lucide="truck" class="size-[18px] shrink-0"></i>
        <span class="min-w-0 flex-1 truncate" :class="!expanded && 'hidden'">Goods receipt</span>
        <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300" :class="!expanded && 'hidden'">12</span>
        <span x-show="!expanded" x-cloak aria-hidden="true" class="absolute top-1 right-1 size-2 rounded-full bg-zinc-700 ring-2 ring-white"></span>
      </a>
      <span x-show="!expanded" x-cloak aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums whitespace-nowrap text-white group-hover:block group-focus-within:block">Goods receipt — 12 awaiting</span>
    </div>

    <div class="group relative">
      <a href="#" aria-label="Vendors, 187"
         class="flex min-h-9 items-center gap-3 rounded-lg py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
         :class="expanded ? 'px-2.5' : 'justify-center px-0'">
        <i data-lucide="building-2" class="size-[18px] shrink-0"></i>
        <span class="min-w-0 flex-1 truncate" :class="!expanded && 'hidden'">Vendors</span>
        <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600" :class="!expanded && 'hidden'">187</span>
      </a>
      <span x-show="!expanded" x-cloak aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums whitespace-nowrap text-white group-hover:block group-focus-within:block">Vendors — 187</span>
    </div>

    <div class="group relative">
      <a href="#" aria-label="Materials"
         class="flex min-h-9 items-center gap-3 rounded-lg py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
         :class="expanded ? 'px-2.5' : 'justify-center px-0'">
        <i data-lucide="package" class="size-[18px] shrink-0"></i>
        <span class="min-w-0 flex-1 truncate" :class="!expanded && 'hidden'">Materials</span>
      </a>
      <span x-show="!expanded" x-cloak aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block group-focus-within:block">Materials</span>
    </div>

    <div class="group relative">
      <a href="#" aria-label="Analytics"
         class="flex min-h-9 items-center gap-3 rounded-lg py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"
         :class="expanded ? 'px-2.5' : 'justify-center px-0'">
        <i data-lucide="chart-no-axes-column" class="size-[18px] shrink-0"></i>
        <span class="min-w-0 flex-1 truncate" :class="!expanded && 'hidden'">Analytics</span>
      </a>
      <span x-show="!expanded" x-cloak aria-hidden="true" class="pointer-events-none absolute top-1/2 left-full z-40 ml-1 hidden -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white group-hover:block group-focus-within:block">Analytics</span>
    </div>
  </nav>

  <div class="shrink-0 border-t border-zinc-200">
    <button type="button" @click="expanded = !expanded" :aria-expanded="expanded" aria-controls="sb6-nav"
            :aria-label="expanded ? 'Collapse sidebar' : 'Expand sidebar'"
            class="flex h-11 w-full items-center text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="flex h-11 w-[68px] shrink-0 items-center justify-center">
        <span class="flex transition-transform motion-reduce:transition-none" :class="!expanded && 'rotate-180'">
          <i data-lucide="chevrons-left" class="size-4"></i>
        </span>
      </span>
      <span class="flex-1 text-left" :class="!expanded && 'hidden'">Collapse</span>
      <kbd class="mr-3 rounded border border-zinc-200 bg-zinc-100 px-1.5 text-[11px]/4 text-zinc-600" :class="!expanded && 'hidden'">[</kbd>
    </button>
  </div>
</div>` },

      { id: 'mobile', name: 'Off-canvas sheet', code:
`<!-- Below lg the sidebar is modal, so it behaves like a dialog and not like a
     narrower panel: x-trap.noscroll holds Tab inside it and stops the register
     behind from scrolling under the thumb, Escape closes it, and focus goes back
     to the button in the topbar that opened it.

     Closing on route change is the part that gets shipped broken. A nav still
     sitting open over the page it just navigated to looks like the tap did
     nothing, so the panel closes on any anchor click inside it and on the htmx
     swap that follows. Both, because one covers a full page load in a browser
     that keeps the DOM alive and the other covers a partial swap.

     288px, not full width. The hundred pixels of dimmed page beside it are the
     only thing saying you are still on the orders list; a full-bleed nav is
     indistinguishable from having navigated to a menu page, and the back button
     then has to get you out of somewhere you never went.

     The overlay is absolute inside this preview box. In app-shell it is fixed
     inset-0 — the shell is the thing that owns the viewport, and a fixed overlay
     rendered here would escape the docs frame and cover the page around it. -->
<div data-kui="sidebar/mobile" class="relative h-[560px] overflow-hidden rounded-xl border border-zinc-300 bg-zinc-100 text-[14px]/5 text-zinc-900"
     x-data="{ nav: false }" @htmx:after-swap.camel.window="nav = false">

  <header class="flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-3">
    <button type="button" @click="nav = true" :aria-expanded="nav" aria-controls="sb7-panel" aria-label="Open navigation"
            class="-ml-1 flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="menu" class="size-5"></i>
    </button>
    <p class="min-w-0 flex-1 truncate text-[14px]/5 font-medium">Purchase orders</p>
    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold ring-1 ring-inset ring-zinc-300">AP</span>
  </header>

  <div class="space-y-3 p-4">
    <div class="rounded-xl border border-zinc-300 bg-white p-4">
      <p class="text-[13px]/5 font-medium tabular-nums">PO-24-1187 · Gujarat Polymers Ltd</p>
      <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">₹18,42,000 · promised 22 Aug 2026</p>
    </div>
    <div class="rounded-xl border border-zinc-300 bg-white p-4">
      <p class="text-[13px]/5 font-medium tabular-nums">PO-24-1191 · Sharma Extrusions</p>
      <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">₹4,26,500 · promised 28 Aug 2026</p>
    </div>
  </div>

  <div x-show="nav" x-cloak x-trap.noscroll="nav" @keydown.escape.window="nav = false" @click.self="nav = false"
       class="absolute inset-0 z-50 flex bg-zinc-900/40">
    <div id="sb7-panel" role="dialog" aria-modal="true" aria-label="Main navigation"
         x-show="nav"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="-translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="-translate-x-full"
         @click="if ($event.target.closest('a[href]')) nav = false"
         class="flex h-full w-full flex-col border-r border-zinc-200 bg-white shadow-lg sm:w-72">

      <div class="flex h-14 shrink-0 items-center gap-2.5 border-b border-zinc-200 px-4">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate text-[14px]/5 font-semibold">Operations</span>
        <button type="button" @click="nav = false" aria-label="Close navigation"
                class="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <nav aria-label="Main" class="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-2">
        <p id="sb7-g1" class="px-2.5 pt-1 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Procurement</p>
        <ul role="list" aria-labelledby="sb7-g1" class="space-y-0.5">
          <li>
            <a href="#" class="flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="layout-dashboard" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Overview</span>
            </a>
          </li>
          <li>
            <a href="#" aria-current="page" class="flex min-h-11 items-center gap-3 rounded-lg bg-zinc-200 px-2.5 py-2 text-[14px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="file-text" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Purchase orders</span>
              <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">148</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="truck" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Goods receipt</span>
              <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">12</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="receipt" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Invoices</span>
              <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">9</span>
            </a>
          </li>
        </ul>

        <p id="sb7-g2" class="px-2.5 pt-4 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Master data</p>
        <ul role="list" aria-labelledby="sb7-g2" class="space-y-0.5">
          <li>
            <a href="#" class="flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="building-2" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Vendors</span>
              <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">187</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="package" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Materials</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-[14px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="scale" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Rate contracts</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="shrink-0 border-t border-zinc-200 p-2">
        <a href="#" class="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold ring-1 ring-inset ring-zinc-300">AP</span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-[13px]/5 font-medium">Akshay Prabhu</span>
            <span class="block truncate text-[11px]/4 text-zinc-500">Level 2 approver</span>
          </span>
        </a>
      </div>
    </div>
  </div>
</div>` },

      { id: 'blocks', name: 'Header switcher and user menu', code:
`<!-- The two menus open in opposite directions and neither choice is cosmetic.
     The switcher hangs below its trigger because there are 480 pixels of nav
     under it. The account menu opens upward from bottom-full because there is
     nothing under it but the bottom of the screen, and a menu anchored downward
     there is a menu whose last three items are off the page.

     Both are anchored inside the panel, so the panel cannot be overflow-hidden.
     Add it to tidy the rounded corners and both menus are cut off at the edge of
     the sidebar.

     One open key, not two booleans. Two independent flags let both menus sit
     open at once, stacked over each other, and the click that should have closed
     the first one opens the second.

     Neither survives the rail as-is: a 240px menu hanging off a 40px avatar
     looks unattached, so at 68px both become right-side flyouts anchored to the
     icon. The switcher marks the selected plant with a check rather than a tint,
     because a tinted row in a menu is the hover state and a permanently tinted
     one reads as permanently hovered. -->
<div data-kui="sidebar/blocks" class="relative flex h-[560px] w-64 flex-col rounded-xl border border-zinc-300 bg-white text-[14px]/5 text-zinc-900"
     x-data="{ menu: '' }" @keydown.escape.window="menu = ''">

  <div class="shrink-0 border-b border-zinc-200 p-2">
    <div class="relative">
      <button type="button" @click="menu = menu === 'plant' ? '' : 'plant'"
              :aria-expanded="menu === 'plant'" aria-haspopup="true" aria-controls="sb8-plant"
              class="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[13px]/5 font-medium">Operations</span>
          <span class="block truncate text-[11px]/4 text-zinc-500">Vasai plant · FY 2026–27</span>
        </span>
        <i data-lucide="chevrons-up-down" class="size-4 shrink-0 text-zinc-500"></i>
      </button>

      <div id="sb8-plant" x-show="menu === 'plant'" x-cloak @click.outside="menu = ''"
           class="absolute top-full right-0 left-0 z-50 mt-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
        <p class="px-2.5 py-1.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Plants</p>
        <button type="button" @click="menu = ''" class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="min-w-0 flex-1 truncate font-medium">Vasai plant</span>
          <i data-lucide="check" class="size-4 shrink-0 text-zinc-600"></i>
        </button>
        <button type="button" @click="menu = ''" class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="min-w-0 flex-1 truncate">Waluj MIDC plant</span>
        </button>
        <button type="button" @click="menu = ''" class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="min-w-0 flex-1 truncate">Silvassa unit</span>
        </button>
        <div class="my-1 border-t border-zinc-100"></div>
        <a href="#" class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="settings" class="size-4 shrink-0"></i>Plant settings
        </a>
      </div>
    </div>
  </div>

  <nav aria-label="Main" class="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-2">
    <a href="#" aria-current="page" class="flex min-h-9 items-center gap-3 rounded-lg bg-zinc-200 px-2.5 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="layout-dashboard" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Overview</span>
    </a>
    <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="file-text" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Purchase orders</span>
      <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">148</span>
    </a>
    <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="truck" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Goods receipt</span>
      <span class="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">12</span>
    </a>
    <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="building-2" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Vendors</span>
      <span class="shrink-0 text-[11px]/4 tabular-nums text-zinc-600">187</span>
    </a>
    <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="package" class="size-[18px] shrink-0"></i><span class="min-w-0 flex-1 truncate">Materials</span>
    </a>
  </nav>

  <div class="relative shrink-0 border-t border-zinc-200 p-2">
    <button type="button" @click="menu = menu === 'user' ? '' : 'user'"
            :aria-expanded="menu === 'user'" aria-haspopup="true" aria-controls="sb8-user"
            class="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300">AP</span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-[13px]/5 font-medium">Akshay Prabhu</span>
        <span class="block truncate text-[11px]/4 text-zinc-500">Level 2 approver</span>
      </span>
      <i data-lucide="chevrons-up-down" class="size-4 shrink-0 text-zinc-500"></i>
    </button>

    <div id="sb8-user" x-show="menu === 'user'" x-cloak @click.outside="menu = ''"
         class="absolute right-2 bottom-full left-2 z-50 mb-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
      <div class="px-2.5 py-2">
        <p class="truncate text-[13px]/5 font-medium">Akshay Prabhu</p>
        <p class="truncate text-[12px]/4 text-zinc-500">akshay.prabhu@konspec.com</p>
      </div>
      <div class="my-1 border-t border-zinc-100"></div>
      <a href="#" class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="user" class="size-4 shrink-0"></i>My profile</a>
      <a href="#" class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="sliders-horizontal" class="size-4 shrink-0"></i>Preferences</a>
      <a href="#" class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="stamp" class="size-4 shrink-0"></i>Approval limits</a>
      <div class="my-1 border-t border-zinc-100"></div>
      <a href="#" class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="log-out" class="size-4 shrink-0"></i>Sign out</a>
    </div>
  </div>
</div>` },

      { id: 'skeleton', name: 'Loading a permission-filtered nav', code:
`<!-- A nav filtered by permission cannot be guessed and then corrected. Render an
     optimistic list and a buyer sees Approvals for half a second before it is
     taken away, which reads as a permissions bug and generates a ticket. So the
     body loads and the frame does not.

     Only the body is skeleton. The workspace and the signed-in user are already
     known to the page that rendered this, so they are drawn for real, and
     keeping them out of the loading state is also what stops the header and
     footer moving when the list lands.

     The block count is a guess, so it is pinned to a guess that cannot hurt: the
     skeleton is exactly as tall as the shortest nav any role gets. Guess high and
     the panel shrinks on arrival; guess low and it grows, but growth inside a
     scrolling body moves nothing outside it.

     aria-busy on the container and aria-hidden on the blocks, plus one sr-only
     role="status" line. Without the live region the arrival is silent — the
     blocks are decorative and the links appear with nothing announcing them.
     Nothing in here is focusable, so a Tab during the wait skips straight past
     to the footer rather than landing on a grey rectangle. -->
<div data-kui="sidebar/skeleton" class="flex h-[560px] w-64 flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white text-[14px]/5 text-zinc-900">
  <div class="flex h-14 shrink-0 items-center gap-2.5 border-b border-zinc-200 px-4">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
    <span class="min-w-0 flex-1 truncate text-[14px]/5 font-semibold">Operations</span>
  </div>

  <div class="min-h-0 flex-1 overflow-y-auto px-3 py-2" aria-busy="true"
       hx-get="/nav/" hx-trigger="load" hx-swap="outerHTML">
    <p class="sr-only" role="status">Loading navigation</p>

    <div class="animate-pulse space-y-0.5 motion-reduce:animate-none" aria-hidden="true">
      <div class="px-2.5 pt-1 pb-2"><div class="h-2 w-20 rounded bg-zinc-200"></div></div>
      <div class="flex min-h-9 items-center gap-3 px-2.5 py-2">
        <div class="size-[18px] shrink-0 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      </div>
      <div class="flex min-h-9 items-center gap-3 px-2.5 py-2">
        <div class="size-[18px] shrink-0 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-32 rounded bg-zinc-200"></div>
        <div class="ml-auto h-2.5 w-6 rounded bg-zinc-200"></div>
      </div>
      <div class="flex min-h-9 items-center gap-3 px-2.5 py-2">
        <div class="size-[18px] shrink-0 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
        <div class="ml-auto h-2.5 w-5 rounded bg-zinc-200"></div>
      </div>
      <div class="flex min-h-9 items-center gap-3 px-2.5 py-2">
        <div class="size-[18px] shrink-0 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-28 rounded bg-zinc-200"></div>
      </div>

      <div class="px-2.5 pt-5 pb-2"><div class="h-2 w-16 rounded bg-zinc-200"></div></div>
      <div class="flex min-h-9 items-center gap-3 px-2.5 py-2">
        <div class="size-[18px] shrink-0 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-16 rounded bg-zinc-200"></div>
        <div class="ml-auto h-2.5 w-6 rounded bg-zinc-200"></div>
      </div>
      <div class="flex min-h-9 items-center gap-3 px-2.5 py-2">
        <div class="size-[18px] shrink-0 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      </div>
      <div class="flex min-h-9 items-center gap-3 px-2.5 py-2">
        <div class="size-[18px] shrink-0 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-28 rounded bg-zinc-200"></div>
      </div>
    </div>
  </div>

  <div class="shrink-0 border-t border-zinc-200 p-2">
    <div class="flex items-center gap-2.5 px-2 py-2">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-300">AP</span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-[13px]/5 font-medium">Akshay Prabhu</span>
        <span class="block truncate text-[11px]/4 text-zinc-500">Level 2 approver</span>
      </span>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'topbar', name: 'Topbar', category: 'navigation',
    description: 'The application header above the page content: the sidebar trigger, the context you are working in, what you can search and who you are signed in as. A real <header> holding a named <nav>, sticky over the column and out of the way of everything that opens above it.',
    when: 'Every signed-in screen in the console, as the top row of app-shell. It answers four questions and no others: which application and context you are in, where in it you are, what you can search, and who you are signed in as. The page title, the record\'s actions and the tabs across a record belong to page-header in the column below. A File / Edit / View command set for a document is a menubar, which sits inside the editor and never merges into this bar. A route map of sections that open panels of pages is navigation-menu, and it lives up here only on an application that has no sidebar at all. This entry is the row; the skeleton that holds it above the single scrolling main column is app-shell.',
    notes: [
      'The sidebar owns the workspace mark and the application name; the topbar shows them only below lg, where the sidebar is off-canvas and nothing else on screen says which application this is. The collapse trigger — 256px down to the 68px rail — belongs to the sidebar\'s own footer strip and exists only at lg and up. The hamburger that opens the off-canvas sheet belongs to the topbar and is lg:hidden. They are two controls with two states at two breakpoints, not one control rendered in two places: wire the hamburger to the collapse state and a phone gets a 68px rail with no room for a flyout beside it, while a laptop gets a modal sheet over a sidebar that was already on screen. The two components agree on one thing only — which of them is visible at which width.',
      'z-30, and the number is decided by what has to pass over the bar rather than by taste. sticky with a z-index makes the header a stacking context, so the z-40 on the account panel inside it only orders that panel against its siblings in the header — against the page, the panel inherits the header\'s 30. That is why the header\'s own value is the one that has to clear content: sticky table heads sit at z-10 and z-20 and everything else in the main column is auto. It must equally not clear a dialog. Every overlay in this system is z-50, and a header at z-50 in a document that renders the dialog before it wins the tie on DOM order and pokes a white strip through the dim. And never put overflow-hidden on the header to tidy a corner: every dropdown in it is then clipped to 56px and opens as a sliver that reads as a script that failed to load.',
      'sticky top-0 only does something when the document scrolls, and inside app-shell it does not. The shell is a fixed-height flex frame where only <main> scrolls, so the header never moves in the first place and sticky, z-30 and the scrolled border are all inert there. Two layouts, and the bar has to know which one it is in: a flex row above a min-h-0 scrolling column inside the shell, a sticky element with a background of its own on a document-scroll page. Nothing breaks visibly when the wrong one ships, which is how a dead scroll listener stays on the page for a year — bind it to the element that actually scrolls, never to window, or the border simply never appears.',
      'Sticky needs an explicit opaque background, and a translucent one is bg-white plus supports-[backdrop-filter]:bg-white/80 backdrop-blur, in that order, never bg-white/80 alone. Where backdrop-filter is off — Firefox with the pref disabled, a reduced-transparency setting, forced colours — the /80 survives and the blur does not, so the register underneath shows through as legible text sliding under legible text. The opaque colour is the base and the translucent one is the enhancement. backdrop-filter also creates a stacking context and a containing block for fixed descendants, which is the second reason the header\'s own z-index is what clears the page, and it costs a composited layer repainted on every scroll frame — so it goes on the header and nowhere else.',
      'A page with a sticky bar needs one base rule: [id] { scroll-margin-top: 88px } — the 56px bar plus a gap. Without it the browser scrolls an anchor target flush to the top of the viewport, which is underneath the header, so following #line-14 out of a form error summary lands on a row the user cannot see and the link reads as broken. It is a rule on [id] rather than scroll-mt-22 sprinkled onto the elements that happen to be link targets today, because the next id somebody adds is a target too and nobody will remember. This is the one line of CSS the system carries, and it is carried precisely because there is no utility that can be put on an element that has not been written yet.',
      'The skip link is the first focusable thing in the document, before the hamburger and before anything else in the bar. It is what makes a twenty-destination sidebar tolerable for a keyboard user, and it is the reason the nav is allowed to stay a plain list of links instead of being rewritten as a menu widget. It needs a target that can take focus: #main carries tabindex="-1", or Chrome and Safari scroll the page and leave focus behind at the top of the document, so the next Tab starts again from the skip link and the user is in a loop. sr-only until focused, then visible — a skip link hidden with display:none is not focusable and is not a skip link.',
      'The search in the bar is navigation and the search over a register is a filter, and one screen carrying both has to make the difference obvious or it becomes the most reliable support call in the application. The bar crosses records and takes you to one; the box above the table narrows the rows in front of you and never leaves the page. Give them the same placeholder and somebody types a PO number into the wrong one and reports the order missing. Placeholder the bar with what it crosses — Search orders, vendors, materials — and the register box with what it filters — Filter 1,438 orders. The moment the bar\'s field starts showing hits under itself it has stopped being a text input and become a combobox, with an owned listbox, aria-activedescendant and rows that are not focusable; that is a different component and it is combobox.',
      'Below lg the field becomes an icon button, not a narrower field. An input under about 200px shows four characters of a placeholder and none of what has been typed into it, and what is being typed is usually a document number somebody is copying off a printout. The button opens either the command palette or a full-width search row that replaces the bar contents while it is open. Both are defensible; using both in one application is not. And if the palette is on the page, only one of the two may claim ⌘K — bind it in both and the browser fires whichever listener registered last, which changes with script order and therefore changes between environments.',
      'Unread is not a data state, so the marker is graphite. The dot on the bell is a solid bg-zinc-700 disc with ring-2 ring-white so it separates from the icon behind it, and red-600 is spent only when what is waiting is genuinely the alarm state — an approval already past its date. Paint the bell red for eleven ordinary notifications and it is red every morning, and on the morning something is actually overdue the mark says nothing it was not already saying. Where the quantity is the thing being acted on, show the figure instead of the dot, cap it at 99+ and set it tabular-nums so the bar does not jitter as it changes. Either way the state belongs in the accessible name — aria-label="Notifications, 3 unread" — because a dot announces nothing at all.',
      'A context switcher changes what every number on the screen means, which is what makes it the opposite of a filter and the reason it sits up here rather than beside them. Company, plant and financial year are read by the server on the next request, so changing one is a page load and not a client-side swap that leaves half the screen showing the previous plant\'s stock. Two consequences follow. A context that is not the default has to be readable without opening anything — a pill in the bar reading FY 2024-25 with an amber dot, permanently — because a financial-year switcher left on last year is how somebody posts a receipt into a closed period and finds out at audit. And a non-production tenant says so in the same slot for the same reason: the sandbox looks exactly like production, which is the whole point of it and the whole danger of it.',
      'The page title and the record\'s primary action live in page-header, in the scrolling column. One h1 per page and it is down there, not up here. The bar is the application — where you are in it, what you can search, which context you are in, who you are — and the column is the record. The single exception is a full-height editor with no page-header at all, a BOM sheet or a rate-contract editor, where the bar carries the document name and its Save; on that screen page-header does not exist. Carry the title in both and the user reads the record name twice and spends 56px of a laptop on the repetition.',
      'Exactly one nav in the document is called Main and it is the sidebar\'s. The nav inside this header is the trail and is called Breadcrumb. A topbar that carries the whole route map because the application has no sidebar takes Main instead, and then there is no sidebar to argue with. Never both — a console with a sidebar of destinations and a navigation-menu of the same destinations across the header is two route maps that drift apart in the first sprint. The trail has the same rule: it belongs to the topbar or to page-header, decided once for the application, because rendered in both it is on screen twice and the second one is the one that is stale.'
    ],
    anatomy: [
      ['Surface', 'A real <header> at h-14, bg-white over a border-zinc-200 bottom rule. sticky top-0 z-30 on a document-scroll page, a plain flex row inside app-shell. Never overflow-hidden, or every panel it opens is clipped to its own height.'],
      ['Skip link', 'The first focusable element in the document. sr-only until focused, then a graphite chip in the top-left, pointing at the #main that carries tabindex="-1".'],
      ['Sidebar trigger', 'The hamburger. lg:hidden, wired to the off-canvas sheet and to nothing else — it is not a second menu, and it does not toggle the rail.'],
      ['Context', 'Company, plant and financial year, as one switcher plus a permanent pill for any context that is not the default. Left of the trail, because it qualifies everything to the right of it.'],
      ['Trail or title', 'Either the breadcrumb <nav aria-label="Breadcrumb">, truncating its middle and never its last crumb, or the document name on an editor screen that has no page-header. One of the two, never both.'],
      ['Search', 'A <form role="search"> holding one labelled input, wide at lg and an icon button below it. It searches the application, not the list underneath, and its placeholder has to say so.'],
      ['Notifications', 'A bell carrying a graphite unread dot, or a capped tabular figure when the count is what gets acted on. The dot is aria-hidden and the state lives in the button\'s name.'],
      ['Account', 'The avatar as the trigger for the account menu. The signed-in email is the first line of the panel, because on a system with a sandbox tenant that is the only question this menu is opened to answer.']
    ],
    behaviour: [
      'The bar is one fixed-height row and its contents never wrap. Below lg pieces are dropped or collapsed to a button — the search, the trail\'s middle, the context label — and nothing is shrunk to fit or scrolled sideways.',
      'Below lg the hamburger opens the sidebar as a modal sheet and focus returns to it on close. At lg and up it is not on screen, and the sidebar\'s own strip owns the collapse.',
      'On a document-scroll page the bar is sticky with an opaque background of its own. Inside app-shell it is a flex row that never moves, and the sticky classes do nothing there.',
      'The scrolled border is drawn from the first frame as border-transparent and only its colour changes. Adding a border on scroll moves every row below it down a pixel and the page twitches under the cursor.',
      'The search crosses records and navigates; it never filters the list below it. Enter submits the form, so the field works with no JavaScript at all.',
      'One panel is open in the bar at a time. The switcher, the notifications and the account menu share a single open key, so opening one closes the others rather than stacking two panels over each other.',
      'Changing company, plant or financial year is a page load. The bar shows the new context because the server rendered it, not because a click updated a label.',
      'The unread mark is a dot when the fact of a queue is the point and a capped figure when the size of it is. It is never both, and it is never red for ordinary traffic.',
      'Nothing in the bar navigates or switches on hover. Hover reveals a name; a click is what changes the page.'
    ],
    a11y: [
      'The bar is a <header> at the top level of the document, which makes it the banner landmark. There is one per page and it is never nested inside <main> — a header inside main is a section header and stops being announced as the page banner.',
      'The skip link is first in the DOM and first in the tab order, and its target carries tabindex="-1" so focus actually moves. Without that the browser scrolls and leaves focus at the top of the document, and the next Tab starts the whole nav again.',
      'The <nav> inside the header has an accessible name of its own — Breadcrumb — and it differs from the sidebar\'s Main. Two navs called the same thing produce a landmark list with two identical rows and no way to tell them apart.',
      'The hamburger is a real button with aria-label, aria-expanded bound to the sheet state and aria-controls naming the panel. It is hidden with lg:hidden, which takes it out of the accessibility tree at widths where the state it toggles does not exist.',
      'The search is a <form role="search"> with a real label — sr-only is fine, absent is not — so Enter submits and the field is reachable as a landmark. Its collapsed form is a button named Search, not an unlabelled magnifier.',
      'The notification state is in the button\'s accessible name and the dot is aria-hidden, because a coloured disc announces nothing. A count in the name reads as "Notifications, 3 unread" rather than as a stray "3".',
      'The account menu follows the dropdown pattern exactly: aria-haspopup="menu", aria-expanded, real focus moved item to item with tabindex="-1" on the items, Escape closing back to the trigger. The name-and-email block is not a menu item and sits outside the role="menu" element.',
      'The context switcher\'s options are role="menuitemradio" with aria-checked bound, wrapped in a role="group" that names the choice — Plant, Financial year. The selected one is marked with a check rather than a tint, because a permanently tinted row in a menu reads as permanently hovered.',
      'Focus is an outline, never a ring, and the bar\'s bottom edge is a real border. Both survive forced-colours mode, where every box-shadow is dropped and a shadow-drawn header edge disappears along with a ring-drawn focus indicator.'
    ],
    related: ['app-shell', 'sidebar', 'breadcrumbs', 'command-palette', 'dropdown', 'page-header'],
    variants: [
      { id: 'default', name: 'Application bar', code:
`<!-- The bar is a real <header> and the trail inside it is a real <nav> with a
     name, so the landmark list reads Banner, Navigation "Breadcrumb", Main
     instead of three unlabelled regions. The sidebar's nav is the one called
     Main; two navs with the same name in one document give a landmark list two
     identical rows and no way to choose between them.

     The skip link is first in the DOM and first in the tab order, and #main
     carries tabindex="-1" because a link to a plain div scrolls the page and
     leaves focus at the top of the document — the next Tab then starts at the
     skip link again and the keyboard user is in a loop.

     z-30 is not a guess. sticky with a z-index makes this element a stacking
     context, so the z-40 on the account panel below only orders it against its
     siblings inside the header; against the page it inherits this 30. So this
     number has to clear the content — sticky table heads at z-10 and z-20 — and
     has to stay under the z-50 that every dialog, sheet and drawer overlay
     takes, or an open dialog is pierced by a white strip.

     Add one base rule to the page while you are here:
       [id] { scroll-margin-top: 88px }
     Without it, following #line-14 out of an error summary scrolls the row to
     the top of the viewport, which is underneath this bar. -->
<div data-kui="topbar/default" class="relative min-h-64 bg-zinc-100 text-[14px]/5 text-zinc-900">
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-[13px]/5 focus:font-medium focus:text-white">Skip to main content</a>

  <header class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-3 sm:px-4">
    <button type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="tb-nav"
            class="-ml-1 flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 lg:hidden">
      <i data-lucide="menu" class="size-5"></i>
    </button>

    <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white lg:hidden"><i data-lucide="package" class="size-[18px]"></i></span>

    <nav aria-label="Breadcrumb" class="min-w-0">
      <ol class="flex items-center gap-1.5 text-[13px]/5">
        <li class="hidden sm:block"><a href="#" class="text-zinc-600 hover:text-zinc-900">Procurement</a></li>
        <li aria-hidden="true" class="hidden text-zinc-400 sm:block">/</li>
        <li class="min-w-0"><span aria-current="page" class="block truncate font-medium">Purchase orders</span></li>
      </ol>
    </nav>

    <div class="ml-auto flex shrink-0 items-center gap-1">
      <button type="button" aria-label="Notifications, 3 unread"
              class="relative flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="bell" class="size-[18px]"></i>
        <span aria-hidden="true" class="absolute top-2 right-2 size-2 rounded-full bg-zinc-700 ring-2 ring-white"></span>
      </button>
      <button type="button" aria-label="Account — Rajesh Menon" aria-haspopup="menu" aria-expanded="false"
              class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        RM
      </button>
    </div>
  </header>

  <main id="main" tabindex="-1" class="p-4">
    <div class="rounded-xl border border-zinc-300 bg-white p-4">
      <p class="text-[13px]/5 font-medium tabular-nums">PO-24-1187 · Gujarat Polymers Ltd</p>
      <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">₹18,42,000 · promised 22 Aug 2026</p>
    </div>
  </main>
</div>` },

      { id: 'search', name: 'Global search', code:
`<!-- This field crosses records and takes you to one. The box above the register
     narrows the rows already on screen and never leaves the page. They are two
     different things and the placeholder is what tells them apart: this one
     names what it crosses, the register's one names what it filters —
     "Filter 1,438 orders". Give both the word Search and somebody types a PO
     number into the wrong one and reports the order missing.

     It is a real <form role="search"> with a real label, so Enter submits and
     the field works with the script off. The border lives on the wrapper and
     the input carries outline-none, so the icon and the ⌘K hint sit inside one
     focus outline instead of beside it. outline-none is only safe because this
     element has no focus outline of its own to silence — put it on the same
     element as a focus-visible:outline-* and Tailwind resolves outline-style
     through a variable and kills the outline while leaving its width set.

     Below lg it becomes a button, not a narrower field. An input under about
     200px shows four characters of a placeholder and none of what was typed,
     and what is typed here is a document number copied off a printout.

     Show hits under the field and this stops being an input: it is a combobox,
     with an owned listbox, aria-activedescendant and rows that cannot be tab
     stops. That is a different component. If the command palette is also on
     this page, only one of the two may bind ⌘K — bind it twice and the winner
     depends on script order. -->
<header data-kui="topbar/search" class="flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-3 text-[14px]/5 text-zinc-900 sm:px-4"
        x-data="{ q: '' }"
        @keydown.window.meta.k.prevent="$refs.q.focus()" @keydown.window.ctrl.k.prevent="$refs.q.focus()">

  <p class="min-w-0 shrink truncate text-[13px]/5 font-medium">Purchase orders</p>

  <button type="button" aria-label="Search the application"
          class="ml-auto flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 lg:hidden">
    <i data-lucide="search" class="size-[18px]"></i>
  </button>

  <form role="search" action="#" class="ml-auto hidden lg:block">
    <label for="tb-search" class="sr-only">Search orders, vendors and materials</label>
    <div class="flex w-80 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <i data-lucide="search" class="ml-2.5 size-4 shrink-0 text-zinc-500"></i>
      <input id="tb-search" x-ref="q" x-model="q" name="q" type="search" autocomplete="off"
             placeholder="Search orders, vendors, materials"
             class="w-full min-w-0 bg-transparent px-2 py-2 text-[13px]/5 outline-none placeholder:text-zinc-500">
      <button type="button" x-show="q" x-cloak @click="q = ''; $refs.q.focus()" aria-label="Clear search"
              class="mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="x" class="size-3.5"></i>
      </button>
      <kbd x-show="!q" aria-hidden="true" class="mr-2 rounded border border-zinc-200 bg-zinc-100 px-1.5 text-[11px]/4 text-zinc-600">⌘K</kbd>
    </div>
  </form>

  <span aria-hidden="true" class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">RM</span>
</header>` },

      { id: 'account', name: 'Notifications and account menu', code:
`<!-- One open key, not two booleans. Two independent flags let both panels sit
     open at once, stacked over each other, and the click that should have
     closed the first one opens the second.

     The two panels are different kinds of thing and are marked up differently.
     Notifications is a list of links to records, so it is a plain div holding a
     <ul> of anchors — role="menu" on it would strip the link role, which is the
     one word the user needed, and promise arrow keys that do not exist. The
     account panel is a set of commands, so it gets role="menu" with real focus
     moved item to item — but the name-and-email block is not a permitted child
     of a menu, so the panel is a plain div and role="menu" starts at the list
     below it.

     The email is why the header block is there. On a tenant that has a sandbox
     twin, the only question this menu is ever opened to answer is which account
     is signed in, and a name alone does not answer it.

     Unread is not a data state, so the dot is graphite. Red is spent on
     overdue, failed and destructive; a bell that is red every morning has
     nothing left to say on the morning something is genuinely late. The dot is
     aria-hidden and the state is in the button's name — a disc announces
     nothing. -->
<header data-kui="topbar/account" class="flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-3 text-[14px]/5 text-zinc-900 sm:px-4"
        x-data="{
          open: '',
          items() { return [...this.$refs.menu.querySelectorAll('[role=menuitem]')] },
          show() {
            this.open = 'account';
            this.$nextTick(() => requestAnimationFrame(() => this.items()[0]?.focus()));
          },
          close(toTrigger = true) {
            if (!this.open) return;
            const was = this.open; this.open = '';
            if (toTrigger && was === 'account') this.$refs.account.focus();
          },
          move(step) {
            const i = this.items(), at = i.indexOf(document.activeElement);
            i[(at + step + i.length) % i.length]?.focus();
          }
        }"
        @click.outside="close(false)"
        @keydown.escape="if (open) { $event.stopPropagation(); close() }">

  <p class="min-w-0 flex-1 truncate text-[13px]/5 font-medium">Goods receipt</p>

  <div class="relative shrink-0">
    <button type="button" @click="open = open === 'bell' ? '' : 'bell'"
            :aria-expanded="open === 'bell'" aria-controls="tb-alerts" aria-label="Notifications, 3 unread"
            class="relative flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :class="open === 'bell' && 'bg-zinc-200 text-zinc-900'">
      <i data-lucide="bell" class="size-[18px]"></i>
      <span aria-hidden="true" class="absolute top-2 right-2 size-2 rounded-full bg-zinc-700 ring-2 ring-white"></span>
    </button>

    <div id="tb-alerts" x-show="open === 'bell'" x-cloak
         class="absolute right-0 z-40 mt-1 w-80 max-w-[calc(100vw-1.5rem)] rounded-xl border border-zinc-200 bg-white shadow-lg">
      <div class="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2">
        <p class="text-[13px]/5 font-medium">Notifications</p>
        <p class="text-[12px]/4 tabular-nums text-zinc-500">3 unread</p>
      </div>
      <ul role="list" class="max-h-72 overflow-y-auto overscroll-contain py-1">
        <li>
          <a href="#" class="flex gap-2.5 px-3 py-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
            <span aria-hidden="true" class="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300"><i data-lucide="alert-circle" class="size-3.5 text-red-600"></i></span>
            <span class="min-w-0">
              <span class="block text-[13px]/5 tabular-nums">PO-24-1187 is 4 days past its promised date</span>
              <span class="block text-[12px]/4 tabular-nums text-zinc-500">Gujarat Polymers Ltd · 2 h ago</span>
            </span>
          </a>
        </li>
        <li>
          <a href="#" class="flex gap-2.5 px-3 py-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
            <span aria-hidden="true" class="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300"><i data-lucide="alert-triangle" class="size-3.5 text-amber-700"></i></span>
            <span class="min-w-0">
              <span class="block text-[13px]/5 tabular-nums">GRN-8842 is waiting on your approval</span>
              <span class="block text-[12px]/4 tabular-nums text-zinc-500">Vasai plant · 5 h ago</span>
            </span>
          </a>
        </li>
        <li>
          <a href="#" class="flex gap-2.5 px-3 py-2 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
            <span aria-hidden="true" class="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300"><i data-lucide="check-circle-2" class="size-3.5 text-emerald-600"></i></span>
            <span class="min-w-0">
              <span class="block text-[13px]/5 tabular-nums">Invoice INV-24-0912 posted to the ledger</span>
              <span class="block text-[12px]/4 tabular-nums text-zinc-500">Sharma Extrusions · yesterday</span>
            </span>
          </a>
        </li>
      </ul>
      <div class="border-t border-zinc-100 px-3 py-2">
        <a href="#" class="text-[13px]/5 text-zinc-900 underline underline-offset-2">All notifications</a>
      </div>
    </div>
  </div>

  <div class="relative shrink-0">
    <button type="button" x-ref="account" @click="open === 'account' ? close(false) : show()"
            @keydown.arrow-down.prevent="show()"
            :aria-expanded="open === 'account'" aria-haspopup="menu" aria-label="Account — Rajesh Menon"
            class="flex size-9 items-center justify-center rounded-full bg-zinc-200 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      RM
    </button>

    <div x-show="open === 'account'" x-cloak
         @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)" @keydown.tab="close(false)"
         class="absolute right-0 z-40 mt-1 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
      <div class="px-3 py-2">
        <p class="truncate text-[13px]/5 font-medium">Rajesh Menon</p>
        <p class="truncate text-[12px]/4 text-zinc-500">rajesh.menon@konspec.com</p>
        <p class="mt-0.5 truncate text-[12px]/4 text-zinc-500">Vasai plant · Procurement</p>
      </div>
      <div role="separator" class="my-1 h-px bg-zinc-100"></div>
      <div x-ref="menu" role="menu" aria-label="Account">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="user" class="size-4 text-zinc-600"></i>Your profile
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="sliders-horizontal" class="size-4 text-zinc-600"></i>Preferences
        </button>
        <div role="separator" class="my-1 h-px bg-zinc-100"></div>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="log-out" class="size-4 text-zinc-600"></i>Sign out
        </button>
      </div>
    </div>
  </div>
</header>` },

      { id: 'toggle', name: 'Sidebar trigger below lg', code:
`<!-- Two controls, two breakpoints, and they are not versions of each other.
     The hamburger lives here, is lg:hidden, and opens the sidebar as a modal
     sheet. The collapse control — 256px to the 68px rail — lives in the
     sidebar's own footer strip and exists only at lg and up. Wire the hamburger
     to the collapse state instead and a phone gets a 68px rail with no room for
     a flyout beside it, while a laptop gets a modal sheet over a sidebar that
     was already on screen.

     The workspace mark follows the same line. The sidebar header owns it, so
     the bar shows it only below lg, where the sidebar is off the screen and
     nothing else says which application this is. Show it in both and the name
     is on screen twice at 1280px.

     The sheet is modal, so it behaves like one: x-trap.noscroll holds Tab
     inside it and stops the register scrolling under the thumb, Escape closes
     it, focus goes back to the hamburger, and it closes on any link inside it
     — a nav still sitting open over the page it just navigated to looks like
     the tap did nothing.

     Inside app-shell this header does not scroll, so it needs no sticky and no
     z-index. The overlay is absolute here because the preview box owns the
     frame; in the real shell it is fixed inset-0. -->
<div data-kui="topbar/toggle" class="relative flex h-[420px] overflow-hidden rounded-xl border border-zinc-300 bg-zinc-100 text-[14px]/5 text-zinc-900"
     x-data="{ nav: false }" @keydown.escape.window="nav = false">

  <aside class="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex">
    <div class="flex h-14 shrink-0 items-center gap-2.5 border-b border-zinc-200 px-4">
      <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
      <span class="min-w-0 flex-1 truncate text-[14px]/5 font-semibold">Operations</span>
    </div>
    <nav aria-label="Main" class="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
      <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="layout-dashboard" class="size-[18px] shrink-0"></i>Overview</a>
      <a href="#" aria-current="page" class="flex min-h-9 items-center gap-3 rounded-lg bg-zinc-200 px-2.5 py-2 text-[13px]/5 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="file-text" class="size-[18px] shrink-0"></i>Purchase orders</a>
      <a href="#" class="flex min-h-9 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]/5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="truck" class="size-[18px] shrink-0"></i>Goods receipt</a>
    </nav>
    <div class="shrink-0 border-t border-zinc-200 px-3 py-2 text-[11px]/4 text-zinc-500">The collapse control lives here, lg and up.</div>
  </aside>

  <div class="flex min-w-0 flex-1 flex-col">
    <header class="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3 sm:px-4">
      <button type="button" x-ref="burger" @click="nav = true" :aria-expanded="nav" aria-controls="tb-sheet" aria-label="Open navigation"
              class="-ml-1 flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 lg:hidden">
        <i data-lucide="menu" class="size-5"></i>
      </button>
      <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white lg:hidden"><i data-lucide="package" class="size-[18px]"></i></span>
      <nav aria-label="Breadcrumb" class="min-w-0">
        <ol class="flex items-center gap-1.5 text-[13px]/5">
          <li class="hidden sm:block"><a href="#" class="text-zinc-600 hover:text-zinc-900">Procurement</a></li>
          <li aria-hidden="true" class="hidden text-zinc-400 sm:block">/</li>
          <li class="min-w-0"><span aria-current="page" class="block truncate font-medium">Purchase orders</span></li>
        </ol>
      </nav>
      <span aria-hidden="true" class="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">RM</span>
    </header>

    <main class="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
      <div class="rounded-xl border border-zinc-300 bg-white p-4">
        <p class="text-[13px]/5 font-medium tabular-nums">PO-24-1187 · Gujarat Polymers Ltd</p>
        <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">₹18,42,000 · promised 22 Aug 2026</p>
      </div>
      <div class="rounded-xl border border-zinc-300 bg-white p-4">
        <p class="text-[13px]/5 font-medium tabular-nums">PO-24-1191 · Sharma Extrusions</p>
        <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">₹4,26,500 · promised 28 Aug 2026</p>
      </div>
    </main>
  </div>

  <div x-show="nav" x-cloak x-trap.noscroll="nav" @click.self="nav = false; $refs.burger.focus()"
       class="absolute inset-0 z-40 flex bg-zinc-900/40 lg:hidden">
    <div id="tb-sheet" role="dialog" aria-modal="true" aria-label="Main navigation"
         @click="if ($event.target.closest('a[href]')) { nav = false; $refs.burger.focus() }"
         class="flex h-full w-full flex-col border-r border-zinc-200 bg-white shadow-lg sm:w-72">
      <div class="flex h-14 shrink-0 items-center gap-2.5 border-b border-zinc-200 px-4">
        <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
        <span class="min-w-0 flex-1 truncate text-[14px]/5 font-semibold">Operations</span>
        <button type="button" @click="nav = false; $refs.burger.focus()" aria-label="Close navigation"
                class="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
      <nav aria-label="Main" class="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-2">
        <a href="#" class="flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="layout-dashboard" class="size-[18px] shrink-0"></i>Overview</a>
        <a href="#" aria-current="page" class="flex min-h-11 items-center gap-3 rounded-lg bg-zinc-200 px-2.5 py-2 font-medium text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="file-text" class="size-[18px] shrink-0"></i>Purchase orders</a>
        <a href="#" class="flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15"><i data-lucide="truck" class="size-[18px] shrink-0"></i>Goods receipt</a>
      </nav>
    </div>
  </div>
</div>` },

      { id: 'context', name: 'Company, plant and financial year', code:
`<!-- This control changes what every number on the screen means, which is what
     makes it the opposite of a filter and the reason it sits up here rather
     than beside them. The server reads company, plant and financial year on the
     next request, so choosing one is a page load — swap it client-side and half
     the screen is still showing the previous plant's stock.

     Two things therefore have to be readable without opening anything. A
     financial year that is not the current one gets a permanent pill with an
     amber dot, because an FY switcher left on last year is how a receipt gets
     posted into a closed period and nobody finds out until audit. And a
     non-production tenant says so in the same slot, because the sandbox looks
     exactly like production — which is the point of it and the danger of it.

     Colour stays in the dot. The pills are the same graphite shape everything
     else in this system uses, and what separates "sandbox" from "last year" is
     which 6px disc is in it.

     The selected option is marked with a check, not a tint: a permanently
     tinted row in a menu reads as permanently hovered. Each set is a
     role="group" with a name, and its rows are role="menuitemradio" with
     aria-checked bound — a screen reader then announces "Vasai plant, 1 of 3,
     selected" rather than three unrelated buttons. -->
<header data-kui="topbar/context" class="flex h-14 items-center gap-2 border-b border-zinc-200 bg-white px-3 text-[14px]/5 text-zinc-900 sm:px-4"
        x-data="{
          open: false,
          plant: 'Vasai',
          fy: '2024-25',
          items() { return [...this.$refs.menu.querySelectorAll('[role=menuitemradio]')] },
          show() { this.open = true; this.$nextTick(() => requestAnimationFrame(() => this.items()[0]?.focus())) },
          close(toTrigger = true) { if (!this.open) return; this.open = false; if (toTrigger) this.$refs.trigger.focus() },
          move(step) { const i = this.items(), at = i.indexOf(document.activeElement); i[(at + step + i.length) % i.length]?.focus() }
        }"
        @click.outside="close(false)"
        @keydown.escape="if (open) { $event.stopPropagation(); close() }">

  <div class="relative min-w-0">
    <button type="button" x-ref="trigger" @click="open ? close(false) : show()" @keydown.arrow-down.prevent="show()"
            :aria-expanded="open" aria-haspopup="menu" aria-controls="tb-ctx"
            class="flex max-w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :class="open && 'bg-zinc-200'">
      <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white"><i data-lucide="package" class="size-[18px]"></i></span>
      <span class="min-w-0">
        <span class="block truncate text-[13px]/5 font-medium">Konspec Polymers Pvt Ltd</span>
        <span class="block truncate text-[11px]/4 tabular-nums text-zinc-500" x-text="plant + ' plant · FY ' + fy">Vasai plant · FY 2024-25</span>
      </span>
      <i data-lucide="chevrons-up-down" class="size-3.5 shrink-0 text-zinc-500"></i>
    </button>

    <div id="tb-ctx" x-show="open" x-cloak
         @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)" @keydown.tab="close(false)"
         class="absolute left-0 z-40 mt-1 w-72 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

      <p class="px-3 pt-1.5 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Company</p>
      <div x-ref="menu">
        <div role="group" aria-label="Company">
          <button type="button" role="menuitemradio" aria-checked="true" tabindex="-1" @click="close()"
                  class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
            <i data-lucide="check" class="size-4 shrink-0 text-zinc-700"></i><span class="min-w-0 flex-1 truncate">Konspec Polymers Pvt Ltd</span>
          </button>
          <button type="button" role="menuitemradio" aria-checked="false" tabindex="-1" @click="close()"
                  class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
            <span aria-hidden="true" class="size-4 shrink-0"></span><span class="min-w-0 flex-1 truncate">Konspec Compounds LLP</span>
          </button>
        </div>

        <div role="separator" class="my-1 h-px bg-zinc-100"></div>
        <p class="px-3 pt-1 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase" aria-hidden="true">Plant</p>
        <div role="group" aria-label="Plant">
          <template x-for="p in ['Vasai', 'Nashik', 'Silvassa']" :key="p">
            <button type="button" role="menuitemradio" :aria-checked="plant === p" tabindex="-1" @click="plant = p; close()"
                    class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
              <span class="flex size-4 shrink-0 items-center justify-center" x-show="plant === p"><i data-lucide="check" class="size-4 text-zinc-700"></i></span>
              <span class="min-w-0 flex-1 truncate" x-text="p + ' plant'">Vasai plant</span>
            </button>
          </template>
        </div>

        <div role="separator" class="my-1 h-px bg-zinc-100"></div>
        <p class="px-3 pt-1 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase" aria-hidden="true">Financial year</p>
        <div role="group" aria-label="Financial year">
          <template x-for="y in ['2026-27', '2025-26', '2024-25']" :key="y">
            <button type="button" role="menuitemradio" :aria-checked="fy === y" tabindex="-1" @click="fy = y; close()"
                    class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 tabular-nums hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
              <span class="flex size-4 shrink-0 items-center justify-center" x-show="fy === y"><i data-lucide="check" class="size-4 text-zinc-700"></i></span>
              <span class="min-w-0 flex-1 truncate" x-text="'FY ' + y">FY 2026-27</span>
              <span class="shrink-0 text-[11px]/4 text-zinc-500" x-show="y === '2026-27'">Current</span>
            </button>
          </template>
        </div>
      </div>

      <div role="separator" class="my-1 h-px bg-zinc-100"></div>
      <p class="px-3 py-1.5 text-[12px]/4 text-zinc-500">Changing any of these reloads the page.</p>
    </div>
  </div>

  <span class="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300 sm:inline-flex">
    <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-amber-500"></span>Sandbox
  </span>

  <span x-show="fy !== '2026-27'"
        class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-amber-500"></span><span x-text="'FY ' + fy">FY 2024-25</span>
  </span>

  <span aria-hidden="true" class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">RM</span>
</header>` },

      { id: 'compact', name: 'Document title and actions', code:
`<!-- This is the one bar allowed to carry a title, and it is allowed because
     the screen underneath has no page-header: a full-height editor — a BOM
     sheet, a rate-contract editor — where the document fills the column and
     there is nowhere else for its name and its Save to go. On a register or a
     dashboard the title and the primary action belong to page-header in the
     scrolling column, and putting them here as well shows the record name twice
     and spends 56px of a laptop saying it.

     h-12 rather than h-14, because an editor is a screen somebody sits inside
     for an hour and every row above the document is a row not spent on it. The
     h1 is here only when it is here and not below; two h1 elements on one page
     is a document with two titles as far as a heading outline is concerned.

     Exactly one primary button. The saved state is text, not a toast — a toast
     for an autosave is a notification of nothing, fired forty times an hour.
     Below sm the button keeps its icon and drops its label; it does not shrink
     and the row does not wrap. -->
<header data-kui="topbar/compact" class="flex h-12 items-center gap-3 border-b border-zinc-200 bg-white px-3 text-[14px]/5 text-zinc-900 sm:px-4">
  <a href="#" aria-label="Back to rate contracts"
     class="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="arrow-left" class="size-4"></i>
  </a>

  <h1 class="min-w-0 flex-1 truncate text-[16px]/6 font-semibold tabular-nums">RC-26-0043 — Gujarat Polymers Ltd</h1>

  <p class="hidden shrink-0 items-center gap-1.5 text-[12px]/4 tabular-nums text-zinc-500 sm:flex">
    <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-emerald-600"></span>Saved 2 min ago
  </p>

  <div class="flex shrink-0 items-center gap-2">
    <button type="button" class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      Preview
    </button>
    <button type="button" class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="check" class="size-4"></i><span class="hidden sm:inline">Submit for approval</span>
    </button>
  </div>
</header>` },

      { id: 'sticky', name: 'Sticky, with a scrolled border', code:
`<!-- The border exists from the first frame as border-transparent and only its
     colour changes. Add the border on scroll and every row below it moves down
     a pixel the moment the page leaves zero, and the whole page twitches under
     the cursor.

     The listener is on the element that scrolls. In this preview and inside
     app-shell that is a div — the shell is a fixed-height flex frame where only
     <main> scrolls, so window.scrollY is always zero there and a @scroll.window
     handler never fires. On a document-scroll page it is the window instead:
     @scroll.window="scrolled = window.scrollY > 0". Nothing looks broken when
     the wrong one ships, which is how the dead listener survives review.

     The translucent surface is bg-white first and
     supports-[backdrop-filter]:bg-white/80 backdrop-blur after it, never
     bg-white/80 on its own: where backdrop-filter is off the /80 stays and the
     blur does not, so the table underneath scrolls through the bar as legible
     text over legible text. backdrop-filter also makes a stacking context and
     costs a composited layer repainted on every scroll frame, so it goes on the
     header and on nothing else.

     Pair this with one base rule on the page:
       [id] { scroll-margin-top: 88px }
     A sticky bar hides the anchor it has just scrolled to, so following
     #line-14 out of an error summary lands on a row underneath this header and
     the link reads as broken. One rule on [id] rather than scroll-mt-22 on the
     elements that happen to be targets today. -->
<div data-kui="topbar/sticky" class="h-[420px] overflow-y-auto overscroll-contain rounded-xl border border-zinc-300 bg-zinc-100 text-[14px]/5 text-zinc-900"
     x-data="{ scrolled: false }" @scroll="scrolled = $el.scrollTop > 0">

  <header class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-transparent bg-white px-3 backdrop-blur transition-colors supports-[backdrop-filter]:bg-white/80 sm:px-4"
          :class="scrolled && 'border-zinc-200'">
    <nav aria-label="Breadcrumb" class="min-w-0">
      <ol class="flex items-center gap-1.5 text-[13px]/5">
        <li class="hidden sm:block"><a href="#" class="text-zinc-600 hover:text-zinc-900">Inventory</a></li>
        <li aria-hidden="true" class="hidden text-zinc-400 sm:block">/</li>
        <li class="min-w-0"><span aria-current="page" class="block truncate font-medium">Batch ledger</span></li>
      </ol>
    </nav>
    <span aria-hidden="true" class="ml-auto flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">RM</span>
  </header>

  <div class="space-y-2 p-4">
    <div id="line-11" class="rounded-xl border border-zinc-300 bg-white px-4 py-3">
      <p class="text-[13px]/5 font-medium tabular-nums">B-26-0411 · LDPE 24FS040</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">1,250.000 kg · received 04/08/2026</p>
    </div>
    <div id="line-12" class="rounded-xl border border-zinc-300 bg-white px-4 py-3">
      <p class="text-[13px]/5 font-medium tabular-nums">B-26-0412 · LDPE 24FS040</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">980.500 kg · received 06/08/2026</p>
    </div>
    <div id="line-13" class="rounded-xl border border-zinc-300 bg-white px-4 py-3">
      <p class="text-[13px]/5 font-medium tabular-nums">B-26-0413 · HDPE 26HD110</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">2,400.000 kg · received 09/08/2026</p>
    </div>
    <div id="line-14" class="rounded-xl border border-zinc-300 bg-white px-4 py-3">
      <p class="text-[13px]/5 font-medium tabular-nums">B-26-0414 · HDPE 26HD110</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">1,875.250 kg · received 11/08/2026</p>
    </div>
    <div id="line-15" class="rounded-xl border border-zinc-300 bg-white px-4 py-3">
      <p class="text-[13px]/5 font-medium tabular-nums">B-26-0415 · PP 26PP220</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">640.000 kg · received 12/08/2026</p>
    </div>
    <div id="line-16" class="rounded-xl border border-zinc-300 bg-white px-4 py-3">
      <p class="text-[13px]/5 font-medium tabular-nums">B-26-0416 · PP 26PP220</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">1,120.750 kg · received 14/08/2026</p>
    </div>
    <p class="pt-2 text-[12px]/4 text-zinc-500">Scroll: the bottom edge appears only once there is something behind it.</p>
  </div>
</div>` },

      { id: 'phone', name: 'At 390px', code:
`<!-- Nothing shrinks and nothing scrolls sideways. Pieces are dropped whole:
     the search becomes a button, the trail keeps its last crumb only, the
     context label goes and the plant survives as a pill under the bar where
     there is room for it. Squeeze the same five things into 390px instead and
     the search field is four characters wide and the avatar is 24px.

     Three things keep their full 40px hit target at this width and are all
     shrink-0: the hamburger, the search button and the avatar. They are the
     controls a thumb aims at, and a 32px target beside a 32px target is two
     mistaps a day.

     The bar stays h-14. It is the anchor for [id] { scroll-margin-top: 88px },
     and a phone-only height means every anchor target on a phone lands under
     the bar by the difference.

     The trail is the parent and the current page, never four crumbs. Four
     crumbs at 390px either wrap onto a second line or push the page sideways,
     and both are worse than showing two. The last crumb is the one that is
     never truncated — it is the one that says where you are. -->
<div data-kui="topbar/phone" class="mx-auto w-[390px] max-w-full overflow-hidden rounded-xl border border-zinc-300 bg-zinc-100 text-[14px]/5 text-zinc-900">
  <header class="flex h-14 items-center gap-2 border-b border-zinc-200 bg-white px-2">
    <button type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="tb-ph-nav"
            class="flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="menu" class="size-5"></i>
    </button>

    <nav aria-label="Breadcrumb" class="min-w-0 flex-1">
      <ol class="flex items-center gap-1.5 text-[13px]/5">
        <li class="min-w-0"><span aria-current="page" class="block truncate font-medium">Goods receipt</span></li>
      </ol>
    </nav>

    <button type="button" aria-label="Search the application"
            class="flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="search" class="size-[18px]"></i>
    </button>

    <button type="button" aria-label="Notifications, 3 unread"
            class="relative flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="bell" class="size-[18px]"></i>
      <span aria-hidden="true" class="absolute top-2 right-2 size-2 rounded-full bg-zinc-700 ring-2 ring-white"></span>
    </button>

    <button type="button" aria-label="Account — Rajesh Menon" aria-haspopup="menu" aria-expanded="false"
            class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      RM
    </button>
  </header>

  <div class="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 bg-white px-3 pb-2">
    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">Vasai plant</span>
    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-amber-500"></span>FY 2024-25
    </span>
  </div>

  <div class="space-y-2 p-3">
    <div class="rounded-xl border border-zinc-300 bg-white px-3 py-2.5">
      <p class="text-[13px]/5 font-medium tabular-nums">GRN-8842 · Gujarat Polymers Ltd</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">4 lines · posted 11/08/2026</p>
    </div>
    <div class="rounded-xl border border-zinc-300 bg-white px-3 py-2.5">
      <p class="text-[13px]/5 font-medium tabular-nums">GRN-8843 · Sharma Extrusions</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">2 lines · awaiting QC</p>
    </div>
  </div>
</div>` },

      { id: 'assembled', name: 'Procurement console header', code:
`<!-- Everything at once, in the order a person reads it: who am I working as
     and in what context, where am I, what can I search, what is waiting for me,
     who am I. Left to right, and nothing in the middle competes with the
     record underneath.

     The bar owns none of the record. There is no page title and no New order
     button up here — page-header carries both, in the column below, and one h1
     per page lives there.

     The sidebar owns the application name at lg and up, so this bar shows the
     mark only below lg. The hamburger is lg:hidden and opens the sheet; the
     collapse control is the sidebar's and never appears here.

     The FY pill is permanent because the year is not the current one. The
     colour is in the 6px dot and the pill is the same graphite shape as every
     other pill in the system — a column of amber pills reads as a warning
     about the page rather than a fact about the context.

     Add to the page around it:
       [id] { scroll-margin-top: 88px } -->
<div data-kui="topbar/assembled" class="relative bg-zinc-100 text-[14px]/5 text-zinc-900" x-data="{ open: '' }" @keydown.escape.window="open = ''">
  <a href="#main-console" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-[13px]/5 focus:font-medium focus:text-white">Skip to main content</a>

  <header class="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-zinc-200 bg-white px-3 sm:px-4"
          @click.outside="open = ''">
    <button type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="console-nav"
            class="-ml-1 flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 lg:hidden">
      <i data-lucide="menu" class="size-5"></i>
    </button>
    <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-white lg:hidden"><i data-lucide="package" class="size-[18px]"></i></span>

    <span class="hidden shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300 md:inline-flex">Vasai plant</span>
    <span class="hidden shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300 md:inline-flex">
      <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-amber-500"></span>FY 2024-25
    </span>

    <nav aria-label="Breadcrumb" class="min-w-0 flex-1">
      <ol class="flex items-center gap-1.5 text-[13px]/5">
        <li class="hidden sm:block"><a href="#" class="text-zinc-600 hover:text-zinc-900">Procurement</a></li>
        <li aria-hidden="true" class="hidden text-zinc-400 sm:block">/</li>
        <li class="hidden sm:block"><a href="#" class="text-zinc-600 hover:text-zinc-900">Purchase orders</a></li>
        <li aria-hidden="true" class="hidden text-zinc-400 sm:block">/</li>
        <li class="min-w-0"><span aria-current="page" class="block truncate font-medium tabular-nums">PO-24-1187</span></li>
      </ol>
    </nav>

    <button type="button" aria-label="Search the application"
            class="flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 lg:hidden">
      <i data-lucide="search" class="size-[18px]"></i>
    </button>

    <form role="search" action="#" class="hidden shrink-0 lg:block">
      <label for="console-search" class="sr-only">Search orders, vendors and materials</label>
      <div class="flex w-64 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <i data-lucide="search" class="ml-2.5 size-4 shrink-0 text-zinc-500"></i>
        <input id="console-search" name="q" type="search" autocomplete="off" placeholder="Search orders, vendors, materials"
               class="w-full min-w-0 bg-transparent px-2 py-2 text-[13px]/5 outline-none placeholder:text-zinc-500">
        <kbd aria-hidden="true" class="mr-2 rounded border border-zinc-200 bg-zinc-100 px-1.5 text-[11px]/4 text-zinc-600">⌘K</kbd>
      </div>
    </form>

    <button type="button" aria-label="Approvals, 3 waiting on you"
            class="relative flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="bell" class="size-[18px]"></i>
      <span aria-hidden="true" class="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-zinc-700 px-1 text-[11px]/4 font-medium tabular-nums text-white ring-2 ring-white">3</span>
    </button>

    <div class="relative shrink-0">
      <button type="button" @click="open = open === 'account' ? '' : 'account'"
              :aria-expanded="open === 'account'" aria-haspopup="menu" aria-label="Account — Rajesh Menon"
              class="flex size-9 items-center justify-center rounded-full bg-zinc-200 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        RM
      </button>
      <div x-show="open === 'account'" x-cloak
           class="absolute right-0 z-40 mt-1 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <div class="px-3 py-2">
          <p class="truncate text-[13px]/5 font-medium">Rajesh Menon</p>
          <p class="truncate text-[12px]/4 text-zinc-500">rajesh.menon@konspec.com</p>
        </div>
        <div role="separator" class="my-1 h-px bg-zinc-100"></div>
        <div role="menu" aria-label="Account">
          <button type="button" role="menuitem" tabindex="-1" @click="open = ''"
                  class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
            <i data-lucide="user" class="size-4 text-zinc-600"></i>Your profile
          </button>
          <button type="button" role="menuitem" tabindex="-1" @click="open = ''"
                  class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
            <i data-lucide="log-out" class="size-4 text-zinc-600"></i>Sign out
          </button>
        </div>
      </div>
    </div>
  </header>

  <main id="main-console" tabindex="-1" class="space-y-4 p-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div class="min-w-0">
        <h1 class="truncate text-[24px]/7 font-semibold tracking-tight tabular-nums">PO-24-1187</h1>
        <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Gujarat Polymers Ltd · ₹18,42,000 · 6 lines</p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-red-600"></span>Overdue
        </span>
        <button type="button" class="rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Record receipt
        </button>
      </div>
    </div>
    <p class="text-[12px]/4 text-zinc-500">The title and the primary action are page-header's, in this column. The bar above carries none of them.</p>
  </main>
</div>` }
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
`<div data-kui="accordion/default" class="rounded-xl border border-zinc-300 bg-white" x-data="{ open: true }">
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
`<div data-kui="accordion/single" class="divide-y divide-zinc-100 rounded-xl border border-zinc-300 bg-white" x-data="{ open: 'terms' }">
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
`<div data-kui="accordion/cards" x-data="{ open: 'grn-3391' }" class="space-y-2">
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
<div data-kui="collapsible/default" class="max-w-xl rounded-xl border border-zinc-300 bg-white p-4" x-data="{ open: false }">
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
<form data-kui="collapsible/advanced" class="max-w-xl" x-data="{ open: false }">
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
<div data-kui="collapsible/filters" class="rounded-xl border border-zinc-300 bg-white"
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
<details data-kui="collapsible/native" class="group max-w-xl rounded-xl border border-zinc-300 bg-white">
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
<div data-kui="collapsible/card" class="max-w-xl rounded-xl border border-zinc-300 bg-white" x-data="{ open: true }">
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
<div data-kui="collapsible/controlled" x-data="{ open: false }" class="space-y-4">
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
`<div data-kui="collapsible/states" class="max-w-xl space-y-4">
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

<div data-kui="collapsible/django" class="rounded-xl border border-zinc-300 bg-white"
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
  <div class="mt-4 rounded-xl border border-zinc-300 bg-white" x-data="{ open: false }">
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
<form method="get" class="mt-4 rounded-xl border border-zinc-300 bg-white"
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
    related: ['combobox', 'sidebar', 'dropdown'],
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
<div data-kui="command-palette/default" x-data="{
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
    <span class="flex-1 text-left">Search Operations</span>
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
        <span class="ml-auto">Operations</span>
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
