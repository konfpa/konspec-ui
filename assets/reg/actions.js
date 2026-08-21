register(
{
    id: 'button', name: 'Button', category: 'actions',
    description: 'The standard action control. Exactly one primary button per view; everything else is secondary, ghost or a link.',
    when: 'Any action the user takes on this page. Anything that goes to another page is an anchor, not a button. A control that writes a setting to the server the moment it is touched is toggle, not a pressed button; a button that only carries a number is a badge; and the drop zone, the list of files and the upload progress around a file picker are attachment.',
    notes: [
      'Tailwind v4 preflight drops cursor:pointer from <button>. One base rule in the page stylesheet restores it for every interactive element — never add cursor-pointer to a button. A <label> acting as a file picker is the one exception: it is neither a button nor a click handler, so the base rule does not reach it.',
      'Hover is one step deeper than the resting fill, except where that step lands on the surface behind it. zinc-700 goes to zinc-800 and red-600 to red-700 anywhere. White and ghost depend on what they sit on: inside a white card they hover to zinc-100, but on the page zinc-100 is the page fill, so both hover to zinc-200 instead. A white button that hovers to zinc-100 on the page does not darken — it dissolves into the page and leaves its border behind, so the hovered control reads as less present than the ones beside it, which is the inverse of what hover is for.',
      'Height is set with h-*, never left to padding, and every variant carries a border — border-transparent on the ones with no visible edge. Padding-derived height cannot match an icon-only button: measured, a bordered secondary came out at 38 against a 36 primary, and a size-9 icon button at 36 against a 38 label. Fixing the height fixes both at once and px-* then controls width alone.',
      'A tinted button is a tinted shape and takes the same edge every chip in the system takes: bg-zinc-200 with border-zinc-300 — the disabled fill, the pressed state of a toggle. On a button that edge is the border rather than a ring, because the border is already declared and there is nothing to reflow.',
      'Danger is reserved for destructive actions that cannot be undone. A red Save is a lie about the stakes.',
      'A destructive button never takes a red fill behind its text on hover. It hovers to zinc-200 like any other ghost sitting on the page — zinc-100 is the page fill itself, so a ghost hovering to it does not change colour at all. bg-red-50 is a tint the token table rejects outright, and a pale red wash under one row of a table reads as a state the record is in rather than as a pointer that happens to be over a button.',
      'One primary per view. Three solid buttons on a screen have told the user nothing about which one matters.',
      'A submit button is disabled while its request is in flight, and the label does not change width when it does — otherwise the row reflows under the cursor mid-click.',
      'A busy state driven by a timer is a demonstration. A busy state driven by the transport — hx-disabled-elt and hx-indicator — is the one that survives a request that fails, times out or is aborted, which is every case a hand-written busy flag forgets to clear.',
      'A button that is off and owes the user a reason takes aria-disabled rather than disabled. A disabled element cannot be focused, cannot be described and fires no pointer events, so the reason cannot reach anybody — not by tab, not by tooltip. aria-disabled announces the same fact and stays reachable; the handler and the view both still have to refuse the action.'
    ],
    anatomy: [
      ['Label', 'A verb and its object. "Approve order", not "OK" — someone reading only the buttons should know what each one does.'],
      ['Icon', 'Optional, left of the label at size-4. It clarifies the verb; it never replaces it except in an icon-only button. Lucide strokes with currentColor, so the icon follows the button\'s text colour without anything bound to it.'],
      ['Surface', 'What the variant actually is: solid zinc-700 for primary, white with a zinc-200 border for secondary, red-600 for danger, nothing at all for ghost.'],
      ['Hit area', 'h-7 small, h-9 medium, h-11 large — 28, 36 and 44px. Icon-only is the matching square: size-7, size-9, or size-8 in a dense toolbar beside h-8 labels.'],
      ['Busy state', 'A spinning loader in place of the icon while the request is in flight, with the label in the present participle and the width held.'],
      ['Pressed state', 'aria-pressed plus the chip fill — bg-zinc-200 with its zinc-300 border. Never the primary fill: zinc-700 says this is the action the screen exists for, and a filter that happens to be on is not that.'],
      ['Reason', 'The line under an unavailable button saying why it is off, tied to it with aria-describedby. A button that is off without one is the most-reported fault in every internal application there has ever been.']
    ],
    behaviour: [
      'One primary button per view. A screen with three solid buttons has told the user nothing about which one matters.',
      'A button that submits stays disabled while the request is in flight, or a double click posts twice.',
      'The label does not change width between idle and busy states, so the row does not reflow under the cursor.',
      'Disabled is a real disabled attribute, never a class that only looks disabled — the second kind still fires its handler.',
      'aria-disabled is the other case and it does not stop the click at all. The handler refuses it and so does the view; the attribute is advice to the screen reader, not a lock.',
      'A two-step confirm changes the word between the presses and disarms itself on Escape and after a few seconds. The same word twice means a double click confirms without ever being asked, and a button left armed on a screen somebody walked away from is a trap.',
      'A toggle keeps its label and moves aria-pressed. A label that flips to the opposite verb is announcing the next action while aria-pressed announces the current one, and together they tell the user the opposite of the truth.',
      'Anything that navigates is an <a>. A button that changes the URL breaks middle-click, open-in-new-tab and the browser\'s own history.',
      'Below sm, buttons in a form or dialog footer go full width and stack. Two 36px buttons side by side on a 390px screen are a thumb-sized problem.',
      'Every button in a row is the same height, which is why height is declared rather than inferred. Mixed heights in a toolbar read as a rendering fault, not as hierarchy.'
    ],
    a11y: [
      'An icon-only button carries aria-label, because its only content is decorative.',
      'The busy state sets aria-busy="true" and keeps the disabled attribute, so the wait is announced and not merely drawn. htmx writes neither, so an htmx submit carries the wait in the disabled attribute it does write and in a role="status" line beside the button.',
      'Disabled buttons are skipped by Tab and announced as unavailable, which is why the attribute matters more than the styling. Use it when nothing needs explaining; use aria-disabled with aria-describedby when something does, because a disabled button cannot be reached to hear it.',
      'Focus is an outline, never a ring: focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 on every variant, including the anchors. A ring compiles to box-shadow and forced-colours mode drops every box-shadow, so the ghost variant — which has no border to thicken — would be left with no focus indication at all for the users who most need it.',
      'A held-width label swap needs no aria-hidden on either string. Tailwind\'s invisible is visibility:hidden, which takes the hidden string out of the accessibility tree as well as off the screen, so the button\'s name is always whichever of the two is showing. Put aria-hidden on the visible one and the button has no accessible name at all while it is busy.',
      'A label that changes under focus that is already on it — the armed state of a confirm, the participle of a busy button — carries aria-live on the button, or the second press is unannounced and the user confirms something they were never asked.',
      'Alpine keeps aria-pressed, aria-checked, aria-expanded and aria-selected on the element when they bind to false and removes every other aria-* that does, so :aria-pressed="false" renders rather than vanishing. That is exactly what an unpressed toggle needs: a button with no aria-pressed at all is announced as an ordinary button and nothing says it has two states.',
      'A button that only opens something carries aria-expanded and aria-haspopup, so its state is known before it is pressed.',
      'A file picker is a <label> for a real <input type="file">, and the input is sr-only rather than hidden — a display:none input cannot be focused, so the control leaves the tab order entirely and the only way to attach a file is with a mouse.',
      'type="button" is explicit on every button inside a <form>, because the default is submit and a stray toolbar button will post the form.'
    ],
    related: ['button-group', 'dropdown', 'alert-dialog', 'toggle', 'attachment', 'badge'],
    variants: [
      { id: 'variants', name: 'Variants', code:
`<!-- Five, and no others. Primary is the one thing this screen is for; secondary
     is everything else that acts; ghost is for actions dense enough that a
     border each would draw a grid; danger cannot be undone; link navigates.

     Every one of them declares the focus outline. The ghost is the reason it is
     declared rather than inherited: it has no border to thicken and no fill to
     darken, so with the outline dropped there is nothing on screen at all to
     say where the keyboard is. -->
<div data-kui="button/variants" class="flex flex-wrap items-center gap-3">
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Primary</button>
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Secondary</button>
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Ghost</button>
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-red-600 px-4 text-[13px]/5 font-medium text-white hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Danger</button>
  <a href="#" class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Link</a>
</div>` },

      { id: 'sizes', name: 'Sizes', code:
`<!-- Three, matched to density rather than to importance. Small belongs in a
     table row or a dense toolbar; large is for the one button on a sign-in card
     or the primary action of a full-page form. Everything else is medium.

     All three are rounded-lg. The radius is a token of the control, not of its
     height — a small button at rounded-md sitting beside a size-7 icon button at
     rounded-lg is two different shapes doing one job, and the mismatch is
     visible at a glance in a toolbar even though neither corner looks wrong on
     its own. -->
<div data-kui="button/sizes" class="flex flex-wrap items-center gap-3">
  <button type="button" class="inline-flex h-7 items-center rounded-lg border border-transparent bg-zinc-700 px-2.5 text-[12px]/4 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Small</button>
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Medium</button>
  <button type="button" class="inline-flex h-11 items-center rounded-lg border border-transparent bg-zinc-700 px-5 text-[14px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Large</button>
</div>` },

      { id: 'icons', name: 'With icons', code:
`<!-- An icon sits left of the label and clarifies the verb. A chevron is the
     exception and sits right, because it points at what is about to open.

     Icon-only buttons are square so the hit area stays square, and they carry
     aria-label — the icon is decorative and contributes nothing to the name.

     The button that opens something carries aria-expanded as well as
     aria-haspopup, and it carries it in the closed state too. aria-haspopup on
     its own says a menu exists; only aria-expanded says whether it is open, and
     a trigger that grows the attribute at the moment it opens has told the user
     nothing before they pressed it. -->
<div data-kui="button/icons" class="flex flex-wrap items-center gap-3">
  <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="plus" class="size-4"></i>New order
  </button>
  <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="download" class="size-4 text-zinc-600"></i>Export
  </button>
  <button type="button" aria-haspopup="menu" aria-expanded="false" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Columns<i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>
  <button type="button" aria-label="Edit order" class="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="pencil" class="size-4"></i>
  </button>
  <button type="button" aria-label="More actions" class="inline-flex size-9 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="ellipsis" class="size-4"></i>
  </button>
</div>` },

      { id: 'states', name: 'Idle, busy, disabled', code:
`<!-- The busy button is the same width as the idle one. "Approve" and
     "Approving…" are different lengths, so the label is held at its widest with
     a grid overlay: both strings occupy the same cell, only one is visible, and
     the cell is as wide as the longer of the two. Without that the row shifts
     under the cursor the instant it is clicked.

     Neither string takes aria-hidden, and that is deliberate rather than an
     omission. invisible is visibility:hidden, which drops the string from the
     accessibility tree as well as from the screen, so the button is named by
     whichever one is showing. Mark the visible one aria-hidden and the button
     has no accessible name at all for the length of the request.

     x-show is on wrapping spans, never on the <i>. createIcons() replaces that
     node with an <svg> and takes every binding on it with it, so an x-show
     written on the icon works until Lucide hydrates and then silently does not.

     Busy keeps disabled as well as aria-busy — aria-busy announces the wait,
     disabled is what actually stops the second click. The fill does not go grey
     while it waits: the only thing that ever disables this button is its own
     request, and a greyed-out button says "you cannot do this" when the truth
     is that you already have.

     Disabled that is not busy is the chip fill, so it takes the chip edge —
     bg-zinc-200 with border-zinc-300, the same pair every tinted shape in the
     system carries. With border-transparent it is a tinted shape with no edge,
     which on the zinc-100 page is one step of fill holding a 36px block on its
     own. -->
<div data-kui="button/states" class="flex flex-wrap items-center gap-3" x-data="{ busy: false }">
  <button type="button" @click="busy = true; setTimeout(() => busy = false, 2200)"
          :disabled="busy" :aria-busy="busy" aria-live="polite"
          class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:hover:bg-zinc-700">
    <span x-show="!busy"><i data-lucide="check" class="size-4"></i></span>
    <span x-show="busy" x-cloak><i data-lucide="loader-circle" class="size-4 animate-spin"></i></span>
    <span class="grid">
      <span class="col-start-1 row-start-1" :class="busy && 'invisible'">Approve</span>
      <span class="col-start-1 row-start-1" :class="!busy && 'invisible'">Approving…</span>
    </span>
  </button>

  <button type="button" disabled class="inline-flex h-9 items-center rounded-lg border border-zinc-300 bg-zinc-200 px-4 text-[13px]/5 font-medium text-zinc-400">Disabled</button>
  <button type="button" disabled class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium text-zinc-400">Disabled secondary</button>
</div>` },

      { id: 'link', name: 'Navigating, not acting', code:
`<!-- An anchor that looks like a button. If it changes the URL it must be an
     <a> — a button that calls location.href breaks middle-click, open in new
     tab, copy link address and the back button, all silently.

     inline-flex rather than flex, because an anchor is inline and a bare flex
     would stretch it across the row. -->
<div data-kui="button/link" class="flex flex-wrap items-center gap-3">
  <a href="#" class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="plus" class="size-4"></i>New purchase order
  </a>
  <a href="#" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Open in ledger<i data-lucide="arrow-up-right" class="size-3.5 text-zinc-600"></i>
  </a>
</div>` },

      { id: 'full-width', name: 'Full width on a phone', code:
`<!-- A form or dialog footer. Below sm the buttons stack and fill the width;
     from sm they sit inline and right-aligned. flex-col-reverse is deliberate:
     the primary is last in the DOM so it is last in the Tab order, but first on
     screen once stacked, which is where a thumb lands. -->
<div data-kui="button/full-width" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  <p class="text-[14px]/5">Approve PO-24-1187 for ₹4,82,000?</p>
  <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Gujarat Polymers Ltd · 6 lines</p>

  <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
    <button type="button" class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve</button>
  </div>
</div>` },

      { id: 'toolbar', name: 'In a page header', code:
`<!-- Where the one-primary rule earns its keep. Four actions, one solid. The
     primary sits last, nearest the right edge and the thumb, and matches the
     order a dialog footer uses so the two never contradict each other.

     Every member is h-8 and the icon-only one is size-8, because a row of
     buttons that size themselves from padding comes out two pixels apart and
     reads as a rendering fault rather than as hierarchy. -->
<div data-kui="button/toolbar" class="rounded-xl border border-zinc-300 bg-white px-5 py-4">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 class="text-[20px]/7 font-semibold tracking-tight tabular-nums">PO-24-1187</h1>
      <p class="mt-0.5 text-[13px]/5 tabular-nums text-zinc-600">Gujarat Polymers Ltd · raised 14 Aug 2026</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="inline-flex h-8 items-center rounded-lg border border-transparent px-3 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel order</button>
      <button type="button" aria-label="Print" class="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="printer" class="size-4"></i>
      </button>
      <button type="button" class="inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="download" class="size-4 text-zinc-600"></i>Export
      </button>
      <button type="button" class="inline-flex h-8 items-center rounded-lg border border-transparent bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve</button>
    </div>
  </div>
</div>` },

      { id: 'destructive', name: 'Three weights of destroy', tagNew: true, code:
`<!-- One verb, three weights, and the weight is set by what the click costs
     rather than by how the row looks. Solid red is the one action a screen
     exists to warn about and cannot be undone. Bordered red is the same act
     from a place where it is not the point of the screen — a footer, a detail
     panel, a settings card. Red text on nothing is a row action, where a border
     each would draw a grid and a filled red button on every row would turn a
     register into a wall of alarm and stop meaning anything by the twelfth row.

     None of the three take a red fill behind the text on hover. Destructive
     hover is hover:bg-zinc-200 like any other ghost on the page. The pale red tint that
     suggests itself here is one the token table rejects by name, and a red wash
     under one row of a table reads as a status the record is in rather than as
     a pointer that happens to be over a button.

     The word carries as much of the warning as the colour does. "Delete
     vendor", "Cancel order", "Remove line" — never "Yes", "Confirm" or "OK",
     which say nothing at all to somebody who cannot see that the button is red.
     Colour is never the only signal. -->
<div data-kui="button/destructive" class="flex flex-wrap items-center gap-3">
  <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-red-600 px-4 text-[13px]/5 font-medium text-white hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="trash-2" class="size-4"></i>Delete vendor
  </button>
  <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="circle-x" class="size-4"></i>Cancel order
  </button>
  <button type="button" class="inline-flex h-8 items-center gap-2 rounded-lg border border-transparent px-3 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="trash-2" class="size-4"></i>Remove line
  </button>
</div>` },

      { id: 'confirm', name: 'Confirm in place', tagNew: true, code:
`<!-- The cheap half of alert-dialog. A dialog is right when the act is
     irreversible and there is something the user has to read first. For a line
     item that can be typed back in ten seconds it is more ceremony than the act
     deserves, and ceremony that is not deserved gets clicked through without
     being read — which is how a modal ends up making the mistake more likely
     rather than less. This asks inside the button itself.

     Three things make it safe rather than merely clever. The armed button says
     a different word, so a double click on the first press cannot sail through
     the second: the second press has to be aimed at a label that was not there
     when the finger started moving. It disarms on Escape and after four
     seconds, so a button left armed on a screen somebody walked away from is
     not a trap for the next person. And the width is held the same way the busy
     state holds it, both strings in one grid cell, so the row does not move
     between the two presses.

     aria-live on the button is what tells a screen reader that the label
     changed under focus that is already sitting on it. Without it the second
     press is unannounced and the user confirms something they were never asked.

     Armed is the solid danger fill rather than a red edge — the token table has
     one destructive shape and this is it. The escalation from white-with-red-
     text to red-with-white-text is the point: the button visibly becomes the
     thing it was only describing.

     In a real screen the second press is where the request goes. Put hx-post
     and hx-confirm-free handling on this button, not on the first press. -->
<div data-kui="button/confirm" class="max-w-md divide-y divide-zinc-100 rounded-xl border border-zinc-300 bg-white">
  <div class="flex items-center justify-between gap-4 px-4 py-3">
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium tabular-nums">HDPE-BLM-45 · 1,200 kg</p>
      <p class="text-[12px]/4 tabular-nums text-zinc-500">Line 4 · ₹1,04,400</p>
    </div>
    <button type="button" aria-live="polite"
            x-data="{ armed: false, t: null,
                      press() {
                        clearTimeout(this.t);
                        if (this.armed) { this.armed = false; return }
                        this.armed = true;
                        this.t = setTimeout(() => this.armed = false, 4000);
                      } }"
            @click="press()"
            @keydown.escape.window="armed = false; clearTimeout(t)"
            class="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border px-3 text-[13px]/5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :class="armed ? 'border-transparent bg-red-600 text-white hover:bg-red-700' : 'border-zinc-200 bg-white text-red-600 hover:bg-zinc-100'">
      <i data-lucide="trash-2" class="size-4"></i>
      <span class="grid">
        <span class="col-start-1 row-start-1" :class="armed && 'invisible'">Remove</span>
        <span class="col-start-1 row-start-1" :class="!armed && 'invisible'">Remove it?</span>
      </span>
    </button>
  </div>

  <div class="flex items-center justify-between gap-4 px-4 py-3">
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium tabular-nums">LDPE-FLM-12 · 400 kg</p>
      <p class="text-[12px]/4 tabular-nums text-zinc-500">Line 5 · ₹38,800</p>
    </div>
    <button type="button" aria-live="polite"
            x-data="{ armed: false, t: null,
                      press() {
                        clearTimeout(this.t);
                        if (this.armed) { this.armed = false; return }
                        this.armed = true;
                        this.t = setTimeout(() => this.armed = false, 4000);
                      } }"
            @click="press()"
            @keydown.escape.window="armed = false; clearTimeout(t)"
            class="inline-flex h-8 shrink-0 items-center gap-2 rounded-lg border px-3 text-[13px]/5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :class="armed ? 'border-transparent bg-red-600 text-white hover:bg-red-700' : 'border-zinc-200 bg-white text-red-600 hover:bg-zinc-100'">
      <i data-lucide="trash-2" class="size-4"></i>
      <span class="grid">
        <span class="col-start-1 row-start-1" :class="armed && 'invisible'">Remove</span>
        <span class="col-start-1 row-start-1" :class="!armed && 'invisible'">Remove it?</span>
      </span>
    </button>
  </div>
</div>` },

      { id: 'toggle', name: 'Pressed', tagNew: true, code:
`<!-- A button that stays down. aria-pressed is the whole component: it lets one
     control carry two states without a second control beside it and without a
     label that changes meaning under the user.

     The label does not change with the state, and this is the mistake worth
     naming. "Show cancelled lines" while pressed means they are showing; a
     button that relabels itself to "Hide cancelled lines" is announcing the
     next action while aria-pressed announces the current one, so a screen
     reader is handed both at once and they contradict each other. Pick one. A
     real toggle keeps its name and moves aria-pressed — that is this. If the
     label has to change, it is two actions rather than a toggle, and it takes
     no aria-pressed at all.

     Alpine keeps aria-pressed on the element when it binds to false, unlike
     most aria-* attributes, so an unpressed button still renders
     aria-pressed="false" and is still announced as a toggle. A button with the
     attribute missing entirely is announced as an ordinary button and nothing
     tells the user it has an off state to come back to.

     Pressed is the chip fill with the chip edge — bg-zinc-200 on border-zinc-300,
     the same tinted shape a selected nav item takes. It is deliberately not the
     primary fill: zinc-700 says "this is the action the screen exists for", and
     a filter that happens to be on is not that.

     These are view state. Anything that writes to the server the moment it is
     touched is the toggle component instead — a real checkbox wearing
     role="switch" — because a switch reads as a setting with a label beside it
     and a pressed button reads as a control you are operating right now. -->
<div data-kui="button/toggle" class="flex flex-wrap items-center gap-3" x-data="{ cancelled: false, mine: true, holds: false }">
  <button type="button" @click="cancelled = !cancelled" :aria-pressed="cancelled"
          class="inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-[13px]/5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
          :class="cancelled ? 'border-zinc-300 bg-zinc-200 text-zinc-900' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'">
    <i data-lucide="eye" class="size-4"></i>Show cancelled lines
  </button>

  <button type="button" @click="holds = !holds" :aria-pressed="holds"
          class="inline-flex h-8 items-center gap-2 rounded-lg border px-3 text-[13px]/5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
          :class="holds ? 'border-zinc-300 bg-zinc-200 text-zinc-900' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'">
    <i data-lucide="filter" class="size-4"></i>QC holds only
  </button>

  <button type="button" @click="mine = !mine" :aria-pressed="mine" aria-label="Only orders I raised"
          class="inline-flex size-8 items-center justify-center rounded-lg border focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
          :class="mine ? 'border-zinc-300 bg-zinc-200 text-zinc-900' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'">
    <i data-lucide="user-round" class="size-4"></i>
  </button>
</div>` },

      { id: 'async', name: 'Submitting to the server', tagNew: true, code:
`<!-- The busy state when there is a real request behind it. The states variant
     fakes the wait with a timer because it has nothing to talk to; here htmx
     owns it, which means the spinner starts when the POST starts and stops when
     it stops — including when it fails, times out or is aborted, which are the
     three endings a hand-written busy flag is always still spinning through.

     hx-disabled-elt is what stops the double post, and it is an attribute
     rather than a handler for the same reason: htmx re-enables the button on
     every outcome, and a @click that sets busy = true only ever remembers the
     happy one.

     hx-indicator puts .htmx-request on the button for the length of the
     request, which is what the group-[.htmx-request] variants read to swap the
     icon and the label. There is no Alpine on this variant at all. The variants
     sit on wrapping spans and never on the <i>: createIcons() replaces that
     node with an <svg> and the class list is the only thing that survives it,
     so the rule holds even where nothing is bound yet.

     The fill does not go grey while it waits. The only thing that ever disables
     this button is its own request, and a greyed-out button says "you cannot do
     this" when the truth is that you already have.

     htmx writes no aria-busy, so the wait is carried by the disabled attribute
     it does write and by the role="status" line under the button, which is also
     where the server\'s answer is swapped in. That answer is a fact about the
     record and belongs on the page; a toast would say it once and take it away.

     Under Django the CSRF token goes in the body — see the django variant — or
     on the form as hx-headers. -->
<form data-kui="button/async"
      hx-post="/orders/PO-24-1187/approve/"
      hx-target="#po-approve-outcome" hx-swap="innerHTML"
      hx-disabled-elt="#po-approve" hx-indicator="#po-approve"
      class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  <p class="text-[14px]/5">Approve PO-24-1187 for ₹4,82,000?</p>
  <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Gujarat Polymers Ltd · 6 lines · raised 14 Aug 2026</p>

  <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>

    <button id="po-approve" type="submit"
            class="group inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:hover:bg-zinc-700">
      <span class="group-[.htmx-request]:hidden"><i data-lucide="check" class="size-4"></i></span>
      <span class="hidden group-[.htmx-request]:inline"><i data-lucide="loader-circle" class="size-4 animate-spin"></i></span>
      <span class="grid">
        <span class="col-start-1 row-start-1 group-[.htmx-request]:invisible">Approve order</span>
        <span class="invisible col-start-1 row-start-1 group-[.htmx-request]:visible">Approving…</span>
      </span>
    </button>
  </div>

  <p id="po-approve-outcome" role="status" class="mt-3 text-[12px]/4 tabular-nums text-zinc-500">
    Not approved yet. Approval posts the commitment to the GL.
  </p>
</form>` },

      { id: 'unavailable', name: 'Off, and why', tagNew: true, code:
`<!-- Why the button is off, said where the user is already looking. A greyed
     button with no reason beside it is the most-reported fault in every
     internal application there has ever been, and the report is always the same
     sentence: "the Approve button does not work."

     Two shapes, and which one you use is decided by whether there is anything
     to say.

     A control that is off because the form has not been filled in yet takes a
     real disabled attribute. Nothing needs explaining — the empty field is the
     explanation — and disabled keeps it out of the tab order where it cannot
     waste a keyboard user\'s time.

     A control that is off because of who you are or what state the record is in
     takes aria-disabled instead, and that is not a softer version of the same
     thing. A disabled element cannot be focused, cannot be described by
     aria-describedby that anyone will ever reach, and fires no pointer events
     at all — so a tooltip on it never opens and a reason inside a title
     attribute reaches nobody. aria-disabled announces the same unavailability
     while leaving the button reachable, which is the entire point: the reason
     is one tab stop away instead of nowhere.

     Because it is reachable it keeps its focus outline and it does not take the
     disabled text colour. zinc-400 is legible only under the exemption disabled
     controls get from the contrast rules, and an aria-disabled button is not
     covered by it.

     aria-disabled does not stop the click, so the handler must. @click.prevent
     and nothing behind it here — which is why the wrapper carries a bare
     x-data, since Alpine only reads directives inside one. A real submit needs
     the same refusal in the view as well, because the attribute is advice to a
     screen reader and the POST is not obliged to take it. -->
<div data-kui="button/unavailable" x-data class="max-w-md divide-y divide-zinc-100 rounded-xl border border-zinc-300 bg-white">
  <div class="p-5">
    <button type="button" aria-disabled="true" aria-describedby="po-approve-why" @click.prevent
            class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-200 px-4 text-[13px]/5 font-medium text-zinc-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="check" class="size-4"></i>Approve order
    </button>
    <p id="po-approve-why" class="mt-2 flex items-start gap-1.5 text-[12px]/4 text-zinc-600">
      <i data-lucide="lock" class="size-3.5 shrink-0 translate-y-px text-zinc-500"></i>
      <span class="tabular-nums">Orders above ₹5,00,000 are approved by the plant head. Ritu Deshpande was notified on 16 Aug 2026.</span>
    </p>
  </div>

  <div class="p-5">
    <button type="button" disabled
            class="inline-flex h-9 items-center rounded-lg border border-zinc-300 bg-zinc-200 px-4 text-[13px]/5 font-medium text-zinc-400">Save changes</button>
    <p class="mt-2 text-[12px]/4 text-zinc-500">Nothing has been edited yet.</p>
  </div>
</div>` },

      { id: 'upload', name: 'Opening the file picker', tagNew: true, code:
`<!-- A file picker is a <label> for a real <input type="file">, never a button
     that calls .click() on a hidden input. The label is what the browser itself
     wires to the picker; a button doing it by script loses the association the
     moment the script does not run, and gains nothing while it does.

     The input is sr-only rather than hidden or display:none, and this is the
     part that is always wrong when it is wrong. A display:none input cannot be
     focused, so the control leaves the tab order entirely and the only way to
     attach a file is with a mouse — a defect that is invisible on the screen it
     was written on. sr-only keeps the input focusable and off the screen, and
     peer-focus-visible paints the outline on the label, which is the part that
     can be seen.

     Each input and its label are wrapped together. peer-* compiles to a general
     sibling combinator, so two pickers left as flat siblings would share one
     peer state and focusing the first input would light up both labels — the
     kind of fault that only shows itself once there are two of something.

     The label carries cursor-pointer, and this is the one place the
     no-cursor-pointer rule does not apply: preflight drops it from <button>,
     and the base rule puts it back for buttons and for click handlers. A
     <label> is neither, so it never had one to lose.

     accept narrows the picker rather than validating anything. It is a hint the
     dialog uses, trivially bypassed, and the view still has to check the type
     and the size of what actually arrived.

     One button is all this is. The list of what is already attached, the drop
     zone, the progress and the rejected file are the attachment component. -->
<div data-kui="button/upload" class="flex flex-wrap items-center gap-4">
  <div class="flex items-center gap-3">
    <input type="file" id="btn-grn-scan" name="grn_scan" accept=".pdf,image/*"
           aria-describedby="btn-grn-scan-hint" class="peer sr-only">
    <label for="btn-grn-scan"
           class="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-200 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
      <i data-lucide="paperclip" class="size-4 text-zinc-600"></i>Attach signed GRN
    </label>
    <p id="btn-grn-scan-hint" class="text-[12px]/4 tabular-nums text-zinc-500">PDF or photo, up to 10 MB.</p>
  </div>

  <div>
    <input type="file" id="btn-po-photos" name="photos" accept="image/*" multiple class="peer sr-only">
    <label for="btn-po-photos"
           class="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
      <i data-lucide="camera" class="size-4"></i>
      <span class="sr-only">Add unloading photos</span>
    </label>
  </div>
</div>` },

      { id: 'django', name: 'Django form submits', code:
`<!-- One form, two outcomes. Both buttons submit; name and value tell the view
     which was pressed, so there is no second form and no JavaScript.

     # views.py
     if 'action' in request.POST:
         if request.POST['action'] == 'approve':  order.approve(request.user)
         elif request.POST['action'] == 'draft':  order.save_draft()

     type="submit" is explicit even though it is the default, because the
     surrounding toolbar buttons all carry type="button" and the difference is
     the whole point. -->
<form data-kui="button/django" method="post" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  {% csrf_token %}
  <label for="id_remarks" class="mb-1.5 block text-[13px]/5 font-medium">Approval remarks</label>
  <textarea name="remarks" id="id_remarks" rows="3"
            class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px]/5 focus:border-zinc-700 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15"></textarea>

  <div class="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="submit" name="action" value="draft"
            class="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save as draft</button>
    <button type="submit" name="action" value="approve"
            class="inline-flex h-9 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve</button>
  </div>
</form>` }
    ]
  },

  {
    id: 'button-group', name: 'Button group', category: 'actions',
    description: 'Several controls joined into one object. Two shapes only: a tinted track for choosing one of a set, and a bordered strip for actions that belong together — or, latched, for filters that can be on at once.',
    when: 'When the controls are genuinely related — one date range, one set of row actions. Unrelated buttons sitting near each other are a toolbar, not a group, and get normal gaps.',
    notes: [
      'Two shapes and no third. A tinted track with a white active pill means "pick one of these"; a bordered strip with dividers means "these do different things". Mixing them makes a set of actions look like a choice.',
      'A group where only one can be active is a radio group, not a row of buttons. role="radiogroup", role="radio", aria-checked, arrow keys and a roving tabindex — otherwise the keyboard tabs through every option one at a time and nothing announces which is chosen.',
      'The track is a tinted shape, so it carries its ring: bg-zinc-200 with ring-1 ring-inset ring-zinc-300, the same as a badge or an avatar. Left bare it is the one shape in the library with a fill and no edge, and on the zinc-100 page it is a single step of grey with nothing holding its outline. The ring is a ring rather than a border precisely so adding it does not change the 36px the track already measures.',
      'The wrapper owns whatever dimension has to line up with something outside the group; the members own the other one. A horizontal strip sits beside a button, so the height goes on the wrapper — h-9 plus the wrapper\'s own border is exactly the 36px of an h-9 button — and the members take it by stretching. Write h-8 on the members instead and the bordered strip measures 34 against a 36 button; write h-9 on them and it measures 38. A vertical strip has no button to match, so it declares w-56 on the wrapper and h-9 on each member. A track is the other arithmetic again: the members carry h-8 and p-0.5 makes up the remaining four pixels.',
      'Never wrap a group in overflow-hidden to round its corners. It clips the focus halo off the first and last options of a track, and it traps a split button\'s menu inside a 36px box with nothing on screen to explain where the menu went. Round the end members instead.',
      'A member flush against the strip\'s inner edge takes rounded-*-[7px], not rounded-*-lg. The wrapper is 8px with a 1px border, so its inner curve is 7px, and an 8px corner on the member leaves a white crescent in each corner that nobody sees until the member is hovered or latched. At rounded-md the same sum gives 5px. This is the input-group rule, and the two components are the same enclosure.',
      'The two shapes take two different focus styles and the difference is whether the member is flush against a border. A track option floats inside padding and takes the ordinary outward halo, focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15. A strip member is flush, so an outward halo draws a second rounded box two pixels outside the wrapper it is already touching; it takes the inset form instead, focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700.',
      'A group is one object, so it never wraps. Below sm it becomes a select or a menu, not two rows of joined buttons with the join broken.',
      'The divider between attached buttons is a single border-l on every button but the first. Putting a border on all four sides doubles every internal rule to 2px.',
      'A count inside an option is text, never a chip. A zinc-200 badge on a zinc-200 track computes to the track and vanishes, and only the white active pill could carry one — so the row of options would change shape as it was used. Plain tabular-nums in zinc-500, a step darker inside the pill, and both halves inside the button so the accessible name comes out as "Overdue 6".',
      'An unavailable member is disabled in a strip and aria-disabled in a track, and the difference is not pedantry. A strip member is an action, so the real attribute is right: it leaves the tab order and the browser announces it as unavailable. A track option is a value, and in a radiogroup the arrow keys move focus and selection together — arrowing onto a disabled option would check it. So it keeps its place and its greying, the walk steps over it, and the reason is written beside the group in text rather than in a title attribute nobody can hover on a phone.',
      'Where the server owns the choice, the group has to be inside the swap. Swap only the table and the pill keeps pointing at the previous filter, which is merely stale until two clicks land close together and the responses come back out of order, at which point the group and the rows disagree. Target the panel, swap outerHTML, and let hx-sync="this:replace" abandon whatever is in flight.'
    ],
    anatomy: [
      ['Track', 'For a choice: rounded-lg bg-zinc-200 with p-0.5 and ring-1 ring-inset ring-zinc-300, so the active pill has somewhere to sit and the tint has an edge.'],
      ['Active pill', 'bg-white with a shadow, inside the track. White against the tint is what reads as chosen — a darker tint does not.'],
      ['Strip', 'For actions: an inline-flex carrying h-* and a single border-zinc-300 around the outside, with border-zinc-200 between.'],
      ['Divider', 'border-l on every button except the first. One border, not two.'],
      ['End radii', 'rounded-*-[7px] on the first and last members rather than overflow-hidden on the container, so focus halos and menus survive and the corners still meet the inner curve.'],
      ['Count', 'A tabular-nums figure inside the option, after the label. Text, never a badge, and inside the button so it joins the accessible name.'],
      ['Latched member', 'A strip member with aria-pressed, filled bg-zinc-200 when on. Several can be on at once, which is what separates it from a track option.'],
      ['Value cell', 'On a stepper, the read-only figure between the two buttons. tabular-nums with a reserved min-w-*, and aria-live, because the buttons are what is focused and the figure is what changed.'],
      ['Chevron', 'On a split button, the second half. It opens the menu; the first half does the action without opening anything.']
    ],
    behaviour: [
      'A single-choice group behaves as one Tab stop: Tab enters it, arrow keys move within it, Tab leaves it. Left and Up step back, Right and Down step forward.',
      'Arrow keys wrap around at both ends, so Left from the first option lands on the last, and they step over any option that is aria-disabled.',
      'A group of latched toggles is not one Tab stop. There is no single value for a roving tabindex to follow, so Tab reaches every member and Space toggles it.',
      'Choosing an option applies it immediately. A group with an Apply button beside it is a form, not a group.',
      'A split button\'s main half acts and its chevron half opens; clicking the main half never opens the menu.',
      'Below sm a group of more than three collapses to a select, because a fourth joined button either wraps or scrolls.',
      'Disabled members keep their place in the strip. Removing one on the fly changes which buttons are on the ends and reshapes the whole group.',
      'A stepper disables its buttons at the limits rather than clamping silently, and reserves the width of its widest value so the plus button does not walk left under the cursor between one click and the next.',
      'Row actions appear on hover and on focus-within, never on hover alone, and they fade rather than unhide — a strip that appears reserves its width, so the last column does not jump as the pointer travels down the register.'
    ],
    a11y: [
      'Single choice is role="radiogroup" with role="radio" and aria-checked on each option, plus a roving tabindex so the group is one stop.',
      'The group carries an aria-label naming what is being chosen — "Date range", not "Options". A group built from native radios takes a fieldset with an sr-only legend instead, because a form is not a radiogroup and aria-label on it names nothing.',
      'A group of independent toggles is role="group" with aria-pressed on each, which is a different thing from a radiogroup and must not be confused with it. Bind it with :aria-pressed — Alpine keeps aria-pressed, aria-checked, aria-expanded and aria-selected when they resolve to false and removes every other aria-* attribute, and a toggle with no aria-pressed at all is announced as a plain button.',
      'Icon-only members each carry aria-label; the group label does not name them. In a register the label names the record as well as the verb, or twelve rows of a button called Print say nothing about which GRN is about to be printed.',
      'A split button\'s chevron has its own aria-label and aria-expanded, because "Approve" is already taken by the half beside it, and the menu it opens uses the dropdown keyboard model — real focus, one tabindex="-1" at a time.',
      'An unavailable action is the disabled attribute; an unavailable choice is aria-disabled="true" with the arrow walk stepping over it, and the reason is real text beside the group.',
      'The focus halo is never clipped — this is why the container is not overflow-hidden — and a flush strip member takes the inset outline instead, so the indicator is one box rather than two.',
      'Where the whole panel is swapped by the server, every radio keeps a stable id. htmx restores focus after a swap by matching the id of the element that had it, so without one, arrowing to the third option lands the caret on <body>.'
    ],
    related: ['button', 'dropdown', 'tabs', 'input-group'],
    variants: [
      { id: 'segmented', name: 'Choosing one of a set', code:
`<!-- A real radiogroup: one Tab stop, arrows to move, aria-checked to announce.
     The roving tabindex is what makes it one stop — every unchecked option is
     tabindex="-1", so Tab skips straight past them. Right and Down step
     forward, Left and Up step back, which is what a radiogroup is expected to
     answer to whichever pair the user reaches for.

     The track is bg-zinc-200 and the active pill is white. White on a tint is
     what reads as chosen; a darker tint on a lighter tint does not, and it
     leaves the unchosen options looking disabled. The track carries
     ring-zinc-300 like every other tinted shape here, because a fill with no
     edge is a step of grey with nothing holding its outline.

     h-8 on the options plus p-0.5 on the track is 36px overall — the height of
     an h-9 button, which is what this sits next to. -->
<div data-kui="button-group/segmented" role="radiogroup" aria-label="Date range" x-ref="grp"
     x-data="{
       v: 'Week',
       opts: ['Day', 'Week', 'Month', 'Quarter'],
       move(step) {
         const i = (this.opts.indexOf(this.v) + step + this.opts.length) % this.opts.length;
         this.v = this.opts[i];
         this.$nextTick(() => this.$refs.grp.querySelector('[aria-checked=true]').focus());
       }
     }"
     @keydown.arrow-right.prevent="move(1)" @keydown.arrow-down.prevent="move(1)"
     @keydown.arrow-left.prevent="move(-1)" @keydown.arrow-up.prevent="move(-1)"
     class="inline-flex rounded-lg bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300">
  <template x-for="o in opts" :key="o">
    <button type="button" role="radio" :aria-checked="v === o" :tabindex="v === o ? 0 : -1"
            @click="v = o"
            class="inline-flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :class="v === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      <span x-text="o"></span>
    </button>
  </template>
</div>` },

      { id: 'attached', name: 'Actions that belong together', code:
`<!-- A bordered strip, which says "these do different things" — the opposite of
     the tinted track above. One border-zinc-300 around the outside, a lighter
     border-zinc-200 between, and the radii on the end buttons rather than
     overflow-hidden on the container, so nothing is clipped off either end.

     The height is declared once, on the wrapper: h-9 plus its own border is
     exactly the 36px of the button standing next to it, and the members take
     it by stretching. Put h-9 on the members and the group comes out 38; put
     h-8 on them and it comes out 34. Both are wrong in a way that only shows
     up when something else is beside it.

     The end members are rounded-*-[7px], not -lg. The wrapper is 8px with a
     1px border, so its inner curve is 7px — an 8px corner on the member leaves
     a white crescent that appears the first time the member is hovered.

     The focus outline on a member is inset. A flush member with the ordinary
     outward halo draws a second rounded box two pixels outside the border it
     is already touching, so the indicator reads as two boxes rather than one.

     Delete is red text on the ordinary zinc hover. The red says destructive;
     a red-50 fill behind it would make the last member of every strip the
     loudest thing in the toolbar. -->
<div data-kui="button-group/attached" role="group" aria-label="Order actions"
     class="inline-flex h-9 items-stretch rounded-lg border border-zinc-300 bg-white">
  <button type="button" class="inline-flex items-center gap-2 rounded-l-[7px] px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
    <i data-lucide="pencil" class="size-4 text-zinc-600"></i>Edit
  </button>
  <button type="button" class="inline-flex items-center gap-2 border-l border-zinc-200 px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
    <i data-lucide="copy" class="size-4 text-zinc-600"></i>Duplicate
  </button>
  <button type="button" class="inline-flex items-center gap-2 rounded-r-[7px] border-l border-zinc-200 px-3 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
    <i data-lucide="trash-2" class="size-4"></i>Delete
  </button>
</div>` },

      { id: 'icon-toolbar', name: 'Icon-only strip', code:
`<!-- Table density and column controls, and the pair is here to show the two
     shapes side by side at the same 36px. The track gets there with p-0.5
     around h-8 options; the strip gets there with h-9 on the wrapper and
     members that stretch. Size the members of a bordered strip directly and
     the two groups sit two pixels out of line with each other.

     Square buttons so the hit area is square, each with its own aria-label —
     the group label does not name the members, so "Toolbar" on the wrapper
     would leave three unnamed buttons.

     The right-hand group is aria-pressed, not aria-checked: freeze, totals and
     wrap are independent of one another and any combination of them is a legal
     state. The left-hand group is a genuine choice and is a radiogroup, which
     is why it is one Tab stop and the other is three. -->
<div data-kui="button-group/icon-toolbar" class="flex flex-wrap items-center gap-3">
  <div role="radiogroup" aria-label="Row density" x-ref="dens"
       x-data="{
         v: 'comfortable',
         opts: ['compact', 'comfortable'],
         move(step) {
           const i = (this.opts.indexOf(this.v) + step + this.opts.length) % this.opts.length;
           this.v = this.opts[i];
           this.$nextTick(() => this.$refs.dens.querySelector('[aria-checked=true]').focus());
         }
       }"
       @keydown.arrow-right.prevent="move(1)" @keydown.arrow-down.prevent="move(1)"
       @keydown.arrow-left.prevent="move(-1)" @keydown.arrow-up.prevent="move(-1)"
       class="inline-flex rounded-lg bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300">
    <button type="button" role="radio" :aria-checked="v === 'compact'" :tabindex="v === 'compact' ? 0 : -1"
            @click="v = 'compact'" aria-label="Compact rows"
            class="flex size-8 items-center justify-center rounded-md transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :class="v === 'compact' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      <i data-lucide="align-justify" class="size-4"></i>
    </button>
    <button type="button" role="radio" :aria-checked="v === 'comfortable'" :tabindex="v === 'comfortable' ? 0 : -1"
            @click="v = 'comfortable'" aria-label="Comfortable rows"
            class="flex size-8 items-center justify-center rounded-md transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :class="v === 'comfortable' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      <i data-lucide="menu" class="size-4"></i>
    </button>
  </div>

  <div role="group" aria-label="Table view" x-data="{ freeze: true, totals: false, wrap: false }"
       class="inline-flex h-9 items-stretch rounded-lg border border-zinc-300 bg-white">
    <button type="button" aria-label="Freeze first column" :aria-pressed="freeze" @click="freeze = !freeze"
            class="flex w-9 items-center justify-center rounded-l-[7px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700"
            :class="freeze ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'">
      <i data-lucide="pin" class="size-4"></i>
    </button>
    <button type="button" aria-label="Show totals row" :aria-pressed="totals" @click="totals = !totals"
            class="flex w-9 items-center justify-center border-l border-zinc-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700"
            :class="totals ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'">
      <i data-lucide="sigma" class="size-4"></i>
    </button>
    <button type="button" aria-label="Wrap long text" :aria-pressed="wrap" @click="wrap = !wrap"
            class="flex w-9 items-center justify-center rounded-r-[7px] border-l border-zinc-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700"
            :class="wrap ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'">
      <i data-lucide="wrap-text" class="size-4"></i>
    </button>
  </div>
</div>` },

      { id: 'split', name: 'Split button', code:
`<!-- One button, two halves. The left half approves; the right half opens the
     variations. Clicking the left half never opens the menu — that is the whole
     reason for splitting it rather than making the entire thing a dropdown.

     The chevron carries its own aria-label because "Approve" is already the
     name of the half beside it, and its own aria-expanded because it is the
     half that opens something. The divider is border-l-zinc-600, one step
     lighter than the fill, because a zinc-200 rule on a dark button reads as a
     crack rather than a join. Both halves take border border-transparent so
     they measure the same 36px as the plain primary button, which carries a
     border it does not draw for exactly this reason.

     The menu is the dropdown keyboard model, not a list of tabbable buttons:
     every item is tabindex="-1", the arrows move real focus, and Escape hands
     focus back to the chevron. A role="menu" whose items are in the tab order
     tells the screen reader to expect one thing and gives it another.

     The separator is its own element rather than a border-t on Reject. Hung
     off the item it belongs to the item, so a permission check that hides
     Reject takes the rule to the top of the panel where it introduces
     nothing. -->
<div data-kui="button-group/split" class="relative inline-flex"
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
         if (toTrigger) this.$refs.chevron.focus();
       },
       move(step) {
         const i = this.items(), at = i.indexOf(document.activeElement);
         i[(at + step + i.length) % i.length]?.focus();
       }
     }"
     @click.outside="close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }">
  <button type="button" class="inline-flex h-9 items-center rounded-l-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
    Approve
  </button>
  <button type="button" x-ref="chevron" @click.stop="open ? close(false) : show()"
          @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
          aria-label="More approval options" :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex h-9 items-center rounded-r-lg border border-transparent border-l-zinc-600 bg-zinc-700 px-2 text-white hover:bg-zinc-800">
    <i data-lucide="chevron-down" class="size-4"></i>
  </button>

  <div x-show="open" x-cloak x-ref="menu" @click.stop role="menu" aria-label="Approval options"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.tab="close(false)"
       class="absolute top-full right-0 z-40 mt-1 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="check-check" class="size-4 text-zinc-600"></i>Approve and close
    </button>
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="user-round-plus" class="size-4 text-zinc-600"></i>Approve and forward
    </button>
    <div role="separator" class="my-1 h-px bg-zinc-100"></div>
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="circle-x" class="size-4"></i>Reject
    </button>
  </div>
</div>` },

      { id: 'input', name: 'Attached to an input', code:
`<!-- The border lives on the wrapper, not on the input, so there is one rule
     around the pair instead of two abutting ones. The input is transparent and
     borderless inside it, and focus-within moves the halo to the wrapper — put
     it on the input and the halo is drawn inside the border it shares.

     The button keeps an indicator of its own, drawn inset. focus-within cannot
     say which of the two controls the keyboard is on, so without it the
     enclosure lights up identically whether the caret is in the box or on the
     button beside it, which is the same as having no indicator at all. The
     wrapper halo says the keyboard is in this group; the inset outline says
     which part.

     No height anywhere inside. The enclosure is 38px because of the field\'s
     own padding, and the button takes that by stretching — write h-8 on it and
     you get a 3px strip of white above and below, with a border-l that stops
     short of both edges.

     One box and one button is the ceiling for this variant. The moment there
     is a unit, a currency or a second addon, it is an input-group and that is
     the entry to copy. -->
<div data-kui="button-group/input" class="flex max-w-md items-stretch rounded-lg border border-zinc-300 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
  <label for="add-part" class="sr-only">Part number</label>
  <input id="add-part" type="text" placeholder="Part number"
         class="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
  <button type="button" class="inline-flex shrink-0 items-center gap-2 rounded-r-[7px] border-l border-zinc-200 px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
    <i data-lucide="plus" class="size-4 text-zinc-600"></i>Add line
  </button>
</div>` },

      { id: 'vertical', name: 'Stacked', code:
`<!-- For a narrow column where a horizontal strip would not fit. Same rules
     rotated: one border-zinc-300 outside, border-t between, radii on the ends.
     Buttons are left-aligned rather than centred, so the labels form a reading
     column the way a menu does.

     The dimension that has to match something outside the group is width here,
     not height, so w-56 goes on the wrapper and each member declares its own
     h-9. A stacked group is beside nothing, so there is no 36px total to hit.

     Cancel order is red text on the ordinary zinc hover, like every other
     destructive item in the library. A red-50 fill would put the loudest thing
     on the panel at the bottom of a list of routine actions. -->
<div data-kui="button-group/vertical" role="group" aria-label="Record actions" class="inline-flex w-56 flex-col rounded-lg border border-zinc-300 bg-white">
  <button type="button" class="flex h-9 items-center gap-2.5 rounded-t-[7px] px-3 text-left text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
    <i data-lucide="file-check-2" class="size-4 text-zinc-600"></i>Record GRN
  </button>
  <button type="button" class="flex h-9 items-center gap-2.5 border-t border-zinc-200 px-3 text-left text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
    <i data-lucide="receipt" class="size-4 text-zinc-600"></i>Attach invoice
  </button>
  <button type="button" class="flex h-9 items-center gap-2.5 border-t border-zinc-200 px-3 text-left text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
    <i data-lucide="history" class="size-4 text-zinc-600"></i>Amendment history
  </button>
  <button type="button" class="flex h-9 items-center gap-2.5 rounded-b-[7px] border-t border-zinc-200 px-3 text-left text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
    <i data-lucide="circle-x" class="size-4"></i>Cancel order
  </button>
</div>` },

      { id: 'responsive', name: 'On a phone', code:
`<!-- Four joined buttons do not fit a 390px screen, and a group that wraps has
     stopped being one object — the join breaks and two of the four end up with
     the wrong radii. Below sm it is a select instead, which is one tap and
     costs no width at all.

     The two share one x-data, so whichever the user touches, both agree. Only
     one of them is in the accessibility tree at a time, because hidden and
     sm:hidden are display:none rather than opacity — two controls for one
     value, both announced, is worse than the layout problem this solves. -->
<div data-kui="button-group/responsive" x-data="{
       v: 'Week',
       opts: ['Day', 'Week', 'Month', 'Quarter'],
       move(step) {
         const i = (this.opts.indexOf(this.v) + step + this.opts.length) % this.opts.length;
         this.v = this.opts[i];
         this.$nextTick(() => this.$refs.grp.querySelector('[aria-checked=true]').focus());
       }
     }">
  <label for="range-sm" class="sr-only">Date range</label>
  <select id="range-sm" x-model="v"
          class="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium focus:border-zinc-700 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15 sm:hidden">
    <template x-for="o in opts" :key="o"><option :value="o" x-text="o"></option></template>
  </select>

  <div role="radiogroup" aria-label="Date range" x-ref="grp"
       @keydown.arrow-right.prevent="move(1)" @keydown.arrow-down.prevent="move(1)"
       @keydown.arrow-left.prevent="move(-1)" @keydown.arrow-up.prevent="move(-1)"
       class="hidden rounded-lg bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300 sm:inline-flex">
    <template x-for="o in opts" :key="o">
      <button type="button" role="radio" :aria-checked="v === o" :tabindex="v === o ? 0 : -1" @click="v = o"
              class="inline-flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              :class="v === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
        <span x-text="o"></span>
      </button>
    </template>
  </div>
</div>` },

      { id: 'counts', name: 'Segmented control with counts', tagNew: true, code:
`<!-- The count belongs inside the option and not beside it. "Overdue" and "6"
     are one fact, and a badge parked outside the pill is a second thing to
     click and a second thing to line up.

     It is plain tabular-nums text rather than a chip. A zinc-200 chip on a
     zinc-200 track computes to the track and disappears — the identical hex
     twice, which is the failure the ramp exists to prevent — so only the white
     active pill could carry one, and then the row of options would change
     shape every time somebody chose a different one. Text instead: zinc-500
     when the option is resting, one step darker inside the pill.

     Both halves sit inside the button, so the accessible name comes out as
     "Overdue 6", which is exactly what should be announced. And the track is
     sized by its content, never by a fixed w-* — 1,284 is four characters
     wider than 42, and a fixed width truncates one of them. -->
<div data-kui="button-group/counts" role="radiogroup" aria-label="Receipt queue" x-ref="grp"
     x-data="{
       v: 'open',
       opts: [
         { id: 'all',     label: 'All',      n: '1,284' },
         { id: 'open',    label: 'Open',     n: '42' },
         { id: 'hold',    label: 'On hold',  n: '11' },
         { id: 'overdue', label: 'Overdue',  n: '6' }
       ],
       move(step) {
         const at = this.opts.findIndex(o => o.id === this.v);
         this.v = this.opts[(at + step + this.opts.length) % this.opts.length].id;
         this.$nextTick(() => this.$refs.grp.querySelector('[aria-checked=true]').focus());
       }
     }"
     @keydown.arrow-right.prevent="move(1)" @keydown.arrow-down.prevent="move(1)"
     @keydown.arrow-left.prevent="move(-1)" @keydown.arrow-up.prevent="move(-1)"
     class="inline-flex rounded-lg bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300">
  <template x-for="o in opts" :key="o.id">
    <button type="button" role="radio" :aria-checked="v === o.id" :tabindex="v === o.id ? 0 : -1"
            @click="v = o.id"
            class="inline-flex h-8 items-center gap-2 rounded-md px-3 text-[13px]/5 font-medium transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :class="v === o.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      <span x-text="o.label"></span>
      <span class="tabular-nums" :class="v === o.id ? 'text-zinc-600' : 'text-zinc-500'" x-text="o.n"></span>
    </button>
  </template>
</div>` },

      { id: 'toggle-group', name: 'Filters that can be on at once', tagNew: true, code:
`<!-- Not a radiogroup, and the difference is not cosmetic. Several of these are
     on at the same time, so there is no single value for a roving tabindex to
     follow: it is role="group" with aria-pressed on each member, Tab reaches
     every one of them, and Space toggles. Give this the radiogroup treatment
     and the keyboard can only ever reach the last thing that was switched on.

     aria-pressed is bound rather than written, because Alpine keeps
     aria-pressed, aria-checked, aria-expanded and aria-selected on the element
     when they resolve to false and strips every other aria-* attribute that
     does. A toggle with no aria-pressed at all is announced as a plain button
     and nobody is told it latches.

     The latched fill is bg-zinc-200 against the strip\'s white, and the status
     colour stays in the dot. Filling these three buttons red, amber and green
     would turn a filter bar into a traffic light, which is the same mistake as
     a column of tinted status pills.

     The result line is role="status", so the count is announced. A filter that
     only changes the rows tells a screen-reader user nothing. -->
<div data-kui="button-group/toggle-group"
     x-data="{
       on: ['overdue'],
       toggle(f) {
         const i = this.on.indexOf(f);
         i === -1 ? this.on.push(f) : this.on.splice(i, 1);
       },
       counts: { open: 42, hold: 11, overdue: 6 },
       get total() { return this.on.reduce((n, f) => n + this.counts[f], 0) }
     }">
  <div role="group" aria-label="Filter by status" class="inline-flex h-9 items-stretch rounded-lg border border-zinc-300 bg-white">
    <button type="button" @click="toggle('open')" :aria-pressed="on.includes('open')"
            class="inline-flex items-center gap-2 rounded-l-[7px] px-3 text-[13px]/5 font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700"
            :class="on.includes('open') ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'">
      <span class="size-1.5 rounded-full bg-zinc-500"></span>Open
    </button>
    <button type="button" @click="toggle('hold')" :aria-pressed="on.includes('hold')"
            class="inline-flex items-center gap-2 border-l border-zinc-200 px-3 text-[13px]/5 font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700"
            :class="on.includes('hold') ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'">
      <span class="size-1.5 rounded-full bg-amber-500"></span>On hold
    </button>
    <button type="button" @click="toggle('overdue')" :aria-pressed="on.includes('overdue')"
            class="inline-flex items-center gap-2 rounded-r-[7px] border-l border-zinc-200 px-3 text-[13px]/5 font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700"
            :class="on.includes('overdue') ? 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'">
      <span class="size-1.5 rounded-full bg-red-600"></span>Overdue
    </button>
  </div>

  <p role="status" class="mt-2 text-[12px]/4 tabular-nums text-zinc-500"
     x-text="on.length ? total + ' receipts match' : 'No status filter — showing all 1,284 receipts'"></p>
</div>` },

      { id: 'sizes', name: 'Sizes', tagNew: true, code:
`<!-- Three, matched to the button scale: 28, 36 and 44px overall, so a group
     never sits two pixels out of line with the button beside it. The two
     shapes reach those numbers by different arithmetic, and this is the
     variant that records it.

     A strip declares the height on the wrapper, because the wrapper owns the
     border: h-7, h-9 or h-11 plus that 1px border on each side is exactly the
     28, 36 or 44 of a button. A track declares it on the members and lets
     p-0.5 make up the last four pixels: h-6 + 4 = 28, h-8 + 4 = 36, h-10 + 4
     = 44.

     Radii step with the size, and so do the flush inner corners. A 28px strip
     is rounded-md, so its end members are rounded-*-[5px]; a 36 and a 44 are
     rounded-lg and rounded-*-[7px]. Inside a track the pill is one step in
     from the track: rounded on a rounded-md track, rounded-md on a
     rounded-lg one.

     One value drives all three tracks, because the size is the only thing
     changing between them. -->
<div data-kui="button-group/sizes" class="flex flex-col gap-4"
     x-data="{
       v: 'Week',
       opts: ['Day', 'Week', 'Month'],
       move(step, el) {
         const i = (this.opts.indexOf(this.v) + step + this.opts.length) % this.opts.length;
         this.v = this.opts[i];
         this.$nextTick(() => el.querySelector('[aria-checked=true]').focus());
       }
     }">
  <div class="flex flex-wrap items-center gap-3">
    <div role="radiogroup" aria-label="Date range, compact"
         @keydown.arrow-right.prevent="move(1, $event.currentTarget)" @keydown.arrow-left.prevent="move(-1, $event.currentTarget)"
         class="inline-flex rounded-md bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300">
      <template x-for="o in opts" :key="o">
        <button type="button" role="radio" :aria-checked="v === o" :tabindex="v === o ? 0 : -1" @click="v = o"
                class="inline-flex h-6 items-center rounded px-2.5 text-[12px]/4 font-medium transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="v === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
          <span x-text="o"></span>
        </button>
      </template>
    </div>
    <div role="group" aria-label="Row actions, compact" class="inline-flex h-7 items-stretch rounded-md border border-zinc-300 bg-white">
      <button type="button" class="inline-flex items-center rounded-l-[5px] px-2.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">Edit</button>
      <button type="button" class="inline-flex items-center rounded-r-[5px] border-l border-zinc-200 px-2.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">Copy</button>
    </div>
    <span class="text-[12px]/4 tabular-nums text-zinc-500">28px</span>
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <div role="radiogroup" aria-label="Date range, default"
         @keydown.arrow-right.prevent="move(1, $event.currentTarget)" @keydown.arrow-left.prevent="move(-1, $event.currentTarget)"
         class="inline-flex rounded-lg bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300">
      <template x-for="o in opts" :key="o">
        <button type="button" role="radio" :aria-checked="v === o" :tabindex="v === o ? 0 : -1" @click="v = o"
                class="inline-flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="v === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
          <span x-text="o"></span>
        </button>
      </template>
    </div>
    <div role="group" aria-label="Row actions, default" class="inline-flex h-9 items-stretch rounded-lg border border-zinc-300 bg-white">
      <button type="button" class="inline-flex items-center rounded-l-[7px] px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">Edit</button>
      <button type="button" class="inline-flex items-center rounded-r-[7px] border-l border-zinc-200 px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">Copy</button>
    </div>
    <span class="text-[12px]/4 tabular-nums text-zinc-500">36px</span>
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <div role="radiogroup" aria-label="Date range, large"
         @keydown.arrow-right.prevent="move(1, $event.currentTarget)" @keydown.arrow-left.prevent="move(-1, $event.currentTarget)"
         class="inline-flex rounded-lg bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300">
      <template x-for="o in opts" :key="o">
        <button type="button" role="radio" :aria-checked="v === o" :tabindex="v === o ? 0 : -1" @click="v = o"
                class="inline-flex h-10 items-center rounded-md px-4 text-[14px]/5 font-medium transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="v === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
          <span x-text="o"></span>
        </button>
      </template>
    </div>
    <div role="group" aria-label="Row actions, large" class="inline-flex h-11 items-stretch rounded-lg border border-zinc-300 bg-white">
      <button type="button" class="inline-flex items-center rounded-l-[7px] px-4 text-[14px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">Edit</button>
      <button type="button" class="inline-flex items-center rounded-r-[7px] border-l border-zinc-200 px-4 text-[14px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">Copy</button>
    </div>
    <span class="text-[12px]/4 tabular-nums text-zinc-500">44px</span>
  </div>
</div>` },

      { id: 'disabled', name: 'A member that is not available', tagNew: true, code:
`<!-- Two mechanisms, because the two shapes are two different controls.

     In the strip it is the real disabled attribute. The action cannot be
     taken, so the button leaves the tab order and the browser announces it as
     unavailable — a class that only looks disabled still fires its handler.
     It keeps its place in the strip: drop it from the markup instead and the
     member beside it inherits the end radius, so the group changes shape while
     the user is looking at it.

     In the track it is aria-disabled and the arrow walk steps over it. This is
     the opposite of the dropdown rule, and for a reason: in a radiogroup the
     arrows move focus and selection together, so arrowing onto a disabled
     option would check it, which is the one thing that must not happen. It is
     still drawn, still greyed and still in the reading order, so nobody is
     hunting for an option that silently vanished.

     Either way the reason is text under the group, not a title attribute.
     There is nothing to hover on a phone, and a tooltip that never opens is
     an explanation nobody receives. -->
<div data-kui="button-group/disabled" class="flex flex-col gap-4">
  <div>
    <div role="group" aria-label="Receipt actions" class="inline-flex h-9 items-stretch rounded-lg border border-zinc-300 bg-white">
      <button type="button" class="inline-flex items-center gap-2 rounded-l-[7px] px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
        <i data-lucide="pencil" class="size-4 text-zinc-600"></i>Edit
      </button>
      <button type="button" class="inline-flex items-center gap-2 border-l border-zinc-200 px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
        <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print
      </button>
      <button type="button" disabled aria-describedby="post-why"
              class="inline-flex items-center gap-2 rounded-r-[7px] border-l border-zinc-200 px-3 text-[13px]/5 font-medium text-zinc-400 disabled:hover:bg-transparent">
        <i data-lucide="file-check-2" class="size-4"></i>Post to ledger
      </button>
    </div>
    <p id="post-why" class="mt-2 text-[12px]/4 text-zinc-500">Posting needs a QC result against GRN-26-0442.</p>
  </div>

  <div x-data="{
         v: 'Week',
         opts: [
           { id: 'Day',     off: false },
           { id: 'Week',    off: false },
           { id: 'Month',   off: false },
           { id: 'Quarter', off: true }
         ],
         move(step) {
           const live = this.opts.filter(o => !o.off);
           const at = live.findIndex(o => o.id === this.v);
           this.v = live[(at + step + live.length) % live.length].id;
           this.$nextTick(() => this.$refs.grp.querySelector('[aria-checked=true]').focus());
         }
       }">
    <div role="radiogroup" aria-label="Date range" aria-describedby="range-why" x-ref="grp"
         @keydown.arrow-right.prevent="move(1)" @keydown.arrow-down.prevent="move(1)"
         @keydown.arrow-left.prevent="move(-1)" @keydown.arrow-up.prevent="move(-1)"
         class="inline-flex rounded-lg bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300">
      <template x-for="o in opts" :key="o.id">
        <button type="button" role="radio" :aria-checked="v === o.id" :aria-disabled="o.off"
                :tabindex="v === o.id ? 0 : -1" @click="if (!o.off) v = o.id"
                class="inline-flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
                :class="o.off ? 'text-zinc-400' : (v === o.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900')">
          <span x-text="o.id"></span>
        </button>
      </template>
    </div>
    <p id="range-why" class="mt-2 text-[12px]/4 text-zinc-500">Quarterly figures open from 1 October, once Q2 is closed.</p>
  </div>
</div>` },

      { id: 'stepper', name: 'Stepper', tagNew: true, code:
`<!-- Minus, a value, plus. It is one object rather than three controls sitting
     near each other, so it is a strip and takes the strip\'s border, dividers
     and inner radii.

     The value is a display and not a field. The moment it can be typed into,
     the enclosure is an input-group and the focus outline moves to the
     wrapper — this variant is for the case where the only two ways to change
     the number are the two buttons.

     The value cell reserves its width with min-w-14 and tabular-nums. Without
     it, 200% is wider than 75% and the plus button walks left under the cursor
     between one click and the next, which is exactly the control people click
     four times in a row.

     aria-live="polite" on the cell, because what is focused is a button and
     what changed is the figure beside it. Nothing else in the group announces
     the new value.

     The buttons take the real disabled attribute at the limits. A live minus
     at the floor is a button that does nothing and says nothing about why. -->
<div data-kui="button-group/stepper" role="group" aria-label="Drawing zoom"
     x-data="{
       steps: [50, 75, 100, 125, 150, 200],
       z: 100,
       step(d) {
         const next = this.steps[this.steps.indexOf(this.z) + d];
         if (next !== undefined) this.z = next;
       }
     }"
     class="inline-flex h-9 items-stretch rounded-lg border border-zinc-300 bg-white">
  <button type="button" @click="step(-1)" :disabled="z === steps[0]" aria-label="Zoom out"
          class="flex w-9 items-center justify-center rounded-l-[7px] text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700 disabled:text-zinc-400 disabled:hover:bg-transparent">
    <i data-lucide="minus" class="size-4"></i>
  </button>
  <span aria-live="polite" class="flex min-w-14 items-center justify-center border-l border-zinc-200 px-2 text-[13px]/5 font-medium tabular-nums"
        x-text="z + '%'">100%</span>
  <button type="button" @click="step(1)" :disabled="z === steps[steps.length - 1]" aria-label="Zoom in"
          class="flex w-9 items-center justify-center rounded-r-[7px] border-l border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700 disabled:text-zinc-400 disabled:hover:bg-transparent">
    <i data-lucide="plus" class="size-4"></i>
  </button>
</div>` },

      { id: 'row-actions', name: 'Compact actions in a table row', tagNew: true, code:
`<!-- h-7, because a 36px strip in a 40px row leaves two pixels above and below
     it and the register stops reading as a table. Small is the one size that
     is a density decision rather than an importance one, and a row is where
     that decision gets made.

     Revealed on hover and on focus-within, never on hover alone. Keyboard
     users never hover, so a strip that only appears under the pointer is a set
     of actions nobody can reach with a Tab — and because focus-within fires
     the moment the first member is focused, the strip is visible by the time
     anyone can act on it.

     opacity rather than hidden. An invisible strip still occupies its column,
     so the last column does not change width as the pointer travels down the
     register, and the rows do not jitter under the cursor.

     Every member is icon-only, so every member names the record as well as the
     verb. Twelve rows of a button called Print say nothing about which GRN is
     about to come out of the printer, and the row heading is not part of the
     button\'s accessible name. -->
<div data-kui="button-group/row-actions" class="overflow-x-auto rounded-xl border border-zinc-300 bg-white">
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 bg-zinc-50 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">GRN</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Received</th>
        <th scope="col" class="px-4 py-2.5"><span class="sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>
      <tr class="group border-b border-zinc-100 last:border-0">
        <th scope="row" class="px-4 py-2 text-left font-medium tabular-nums">GRN-26-0442</th>
        <td class="px-4 py-2">Sharma Extrusions</td>
        <td class="px-4 py-2 text-right tabular-nums">12,000 kg</td>
        <td class="px-4 py-2 text-right">
          <div role="group" aria-label="Actions for GRN-26-0442"
               class="inline-flex h-7 items-stretch rounded-md border border-zinc-300 bg-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <button type="button" aria-label="Open GRN-26-0442" class="flex w-7 items-center justify-center rounded-l-[5px] text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
              <i data-lucide="eye" class="size-4"></i>
            </button>
            <button type="button" aria-label="Print GRN-26-0442" class="flex w-7 items-center justify-center border-l border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
              <i data-lucide="printer" class="size-4"></i>
            </button>
            <button type="button" aria-label="More actions for GRN-26-0442" aria-haspopup="menu" class="flex w-7 items-center justify-center rounded-r-[5px] border-l border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
              <i data-lucide="ellipsis" class="size-4"></i>
            </button>
          </div>
        </td>
      </tr>
      <tr class="group border-b border-zinc-100 last:border-0">
        <th scope="row" class="px-4 py-2 text-left font-medium tabular-nums">GRN-26-0443</th>
        <td class="px-4 py-2">Nashik Steel Traders</td>
        <td class="px-4 py-2 text-right tabular-nums">640 kg</td>
        <td class="px-4 py-2 text-right">
          <div role="group" aria-label="Actions for GRN-26-0443"
               class="inline-flex h-7 items-stretch rounded-md border border-zinc-300 bg-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <button type="button" aria-label="Open GRN-26-0443" class="flex w-7 items-center justify-center rounded-l-[5px] text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
              <i data-lucide="eye" class="size-4"></i>
            </button>
            <button type="button" aria-label="Print GRN-26-0443" class="flex w-7 items-center justify-center border-l border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
              <i data-lucide="printer" class="size-4"></i>
            </button>
            <button type="button" aria-label="More actions for GRN-26-0443" aria-haspopup="menu" class="flex w-7 items-center justify-center rounded-r-[5px] border-l border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
              <i data-lucide="ellipsis" class="size-4"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'htmx', name: 'Server-driven filter group', tagNew: true, code:
`<!-- The chosen scope is server state, so the server has to be the thing that
     draws the chosen pill. That is why the target is the whole panel and not
     just the rows: swap only the table and the group keeps showing whatever it
     showed before, which is merely stale until two clicks land close together
     and the responses come back out of order — at which point the pill and the
     rows disagree and the pill is the one the user believes.

     Real radios rather than buttons, for the same reason the Django variant
     uses them: arrow keys, the radiogroup semantics and the roving tabindex
     all come free from the browser, and htmx wants a change event anyway. The
     fieldset and its sr-only legend are what name the group — aria-label on a
     form names nothing, because a form is not a radiogroup.

     Arrowing across the group fires a request per option, which is correct and
     wasteful in equal measure. delay:200ms means a held arrow key sends one
     request rather than four, and hx-sync="this:replace" abandons whichever
     one is still in flight.

     Every radio carries a stable id. htmx restores focus after a swap by
     matching the id of the element that had it, so without one, arrowing to
     the third option lands the caret on the body and the next arrow key does
     nothing at all.

     The count line is role="status", so the result of the filter is announced
     rather than merely redrawn.

     # views.py
     scope = request.GET.get('scope', 'open')
     rows = GoodsReceipt.objects.for_scope(scope)
     tpl = 'grn/_panel.html' if request.htmx else 'grn/register.html' -->
<div data-kui="button-group/htmx" id="grn-panel" class="max-w-2xl rounded-xl border border-zinc-300 bg-white">
  <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200 px-4 py-3">
    <div class="min-w-0">
      <h2 class="text-[14px]/5 font-semibold">Goods receipts</h2>
      <p role="status" class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">{{ rows|length }} receipts · {{ scope_label }}</p>
    </div>

    <form class="ml-auto" hx-get="{% url 'grn-register' %}" hx-trigger="change delay:200ms"
          hx-target="#grn-panel" hx-swap="outerHTML" hx-push-url="true" hx-sync="this:replace">
      <fieldset class="inline-flex rounded-lg bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300">
        <legend class="sr-only">Receipt scope</legend>
        {% for value, label in scopes %}
          <div>
            <input type="radio" name="scope" id="grn-scope-{{ value }}" value="{{ value }}"
                   {% if value == scope %}checked{% endif %} class="peer sr-only">
            <label for="grn-scope-{{ value }}"
                   class="flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium text-zinc-600 transition hover:text-zinc-900 peer-checked:bg-white peer-checked:text-zinc-900 peer-checked:shadow-sm peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
              {{ label }}
            </label>
          </div>
        {% endfor %}
      </fieldset>
    </form>
  </div>

  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 bg-zinc-50 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">GRN</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Received</th>
      </tr>
    </thead>
    <tbody>
      {% for r in rows %}
        <tr class="border-b border-zinc-100 last:border-0">
          <th scope="row" class="px-4 py-2 text-left font-medium tabular-nums">{{ r.number }}</th>
          <td class="px-4 py-2">{{ r.vendor }}</td>
          <td class="px-4 py-2 text-right tabular-nums">{{ r.quantity }}</td>
        </tr>
      {% endfor %}
    </tbody>
  </table>
</div>` },

      { id: 'django', name: 'Django filter group', code:
`<!-- A GET form, so the chosen range ends up in the querystring and the page is
     linkable and bookmarkable. Real radio inputs do the work — no JavaScript,
     no roving tabindex to maintain, and the browser gives arrow keys and the
     radiogroup semantics for free.

     The fieldset is what names the group, with an sr-only legend. aria-label
     on the form would name nothing: a form is not a radiogroup, and the
     browser will not treat it as one. Tailwind\'s preflight already strips the
     fieldset\'s own border and padding, so it takes the track classes cleanly.

     The input is sr-only rather than hidden, because display:none takes it out
     of the tab order and off the keyboard entirely. peer-checked styles the
     label that follows it; peer-focus-visible puts the focus halo there too,
     since the input itself cannot be seen.

     h-8 on the label rather than py-1.5, for the same reason every other
     member in this component declares its height: 32 plus the track\'s p-0.5
     is 36, and a member sized by its padding drifts the moment the type scale
     under it changes.

     # views.py
     rng = request.GET.get('range', 'week')   # 'day' | 'week' | 'month' -->
<form data-kui="button-group/django" method="get">
  <fieldset class="inline-flex rounded-lg bg-zinc-200 p-0.5 ring-1 ring-inset ring-zinc-300">
    <legend class="sr-only">Date range</legend>
    {% for value, label in ranges %}
      <div>
        <input type="radio" name="range" id="range-{{ value }}" value="{{ value }}"
               {% if value == selected %}checked{% endif %}
               onchange="this.form.submit()" class="peer sr-only">
        <label for="range-{{ value }}"
               class="flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium text-zinc-600 transition hover:text-zinc-900 peer-checked:bg-white peer-checked:text-zinc-900 peer-checked:shadow-sm peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
          {{ label }}
        </label>
      </div>
    {% endfor %}
  </fieldset>
</form>` }
    ]
  },

  {
    id: 'dropdown', name: 'Dropdown menu', category: 'actions',
    description: 'A menu of actions anchored to a trigger. Real focus walks the items one tabindex="-1" at a time; destructive items sit last, below a divider.',
    when: 'Row actions, export options, view settings, account menus — the second to seventh thing you can do to the record on screen, where only the first belongs on the page as a button. More than about seven items means you want a page with a search box, not a longer menu, and the one list allowed to run past that is a set the user generated themselves, which is capped and scrolled rather than trusted to stay short. If it has a text box in it, it is a combobox or a command palette and the keyboard model is the other one: a menu moves real focus between its items, and the moment a caret has to stay in a field, every rule below stops applying.',
    notes: [
      '@click.outside on the root closes the panel, so no document-level handler and no global store is needed to keep one menu open at a time. It fires on a click anywhere else, including on another menu\'s trigger, which is what opens that one and closes this one in the same gesture.',
      'Roving focus is the whole model. Real focus moves from item to item, every item is tabindex="-1", and items() reads the buttons out of the DOM on every keystroke rather than off an array held in x-data. A permission check that drops Approve drops it from the keyboard order for free, and the separator is skipped without being special-cased because it is not a menuitem. Keep the list in JavaScript instead and it goes stale the first time the server renders a shorter menu, and the arrows start landing on an element that is no longer there.',
      'Anything an item can be hidden by has to be filtered out of the walk, and a breakpoint class is the case that catches people. focus() on a display:none element is a silent no-op, so an item wearing sm:hidden, or an error row sitting behind x-show, leaves the arrows landing on nothing at all and the menu looking dead for one press. Where a variant hides items — the phone sheet, the htmx failure row — items() filters on offsetParent !== null, which is false for anything display:none and costs one property read per keystroke. Where nothing is ever hidden, do not add the filter: it is not free insurance, it is a claim that items come and go.',
      'The item focus style is focus:, not focus-visible:. Focus here is moved by script, and a browser that has decided the last interaction was a mouse click will not paint a :focus-visible outline — which is precisely the case where somebody opens the menu with the pointer and then reaches for the arrow keys. The item takes a tint and an inset outline together rather than outline-none plus a tint: a panel with overflow-hidden clips a positive offset, in forced-colours mode the tint is dropped and the outline is the only thing left, and outline-none in the same class list would silence the outline while leaving its width and colour set, which measures as styled and renders as nothing. The trigger is the other way round — it is reached by Tab, so it takes the ordinary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 halo every control on the page wears.',
      'The panel edge is border-zinc-300, not border-zinc-200. A menu floats over the page, so its border is the Edge token rather than the Border token — white on zinc-100 measures 1.10 and a zinc-200 edge is the first thing that disappears when a screenshot is compressed or a projector washes the room out. Everything drawn inside the panel steps back down: the rule between items is zinc-100, a kbd hint is zinc-200, and a band recessed into the panel is bg-zinc-50 with the item highlight still at bg-zinc-100 above it. Three fills and three borders, each one step apart, and no shape inside a menu ever takes bg-zinc-200 — that is the chip fill, and a menu item wearing it reads as a badge somebody left switched on.',
      'The panel does not fade in, and that is a decision rather than an omission. A menu is opened by a deliberate press and the first thing the user does is read it, so 100ms of opacity is 100ms of unreadable panel; the popover next door reaches the same conclusion for the same reason. Motion here is limited to the chevron, which rotates because it is reporting a state that persists, and it carries motion-reduce:transition-none. Every variant opens and closes the same way, so a screen with a row-action menu and an account menu on it does not have two timings.',
      'Only a command item closes the menu, and the test is whether the choices come in runs rather than what role the item carries. A column picker is four ticks and a density is two clicks, so a menuitemcheckbox and the menuitemradio beside it stay open and Escape ends the run; the register would be reopened four times to hide four columns otherwise. A choice that is exclusive and terminal — the saved view the register is now showing — is a radio that closes, because there is no second choice to make and a panel left standing over the thing it just changed hides the only confirmation there is. Both mistakes are visible within a minute of use, and in opposite directions.',
      'role="menu" has a fixed list of permitted children: menuitem, menuitemcheckbox, menuitemradio, group and separator. A native <input type="checkbox"> is not on it, and neither is the avatar-and-email block at the top of an account menu, a role="status" reporting a fetch, or a <form>. There are two legitimate ways out and the choice is a real one: keep role="menu" and use menuitemcheckbox with a bound aria-checked, which is what the checkbox variant does and which keeps the arrow-key model; or drop role="menu" for role="group" and use real inputs with real labels, which is what the data table\'s column picker does and which buys native Tab order and form participation instead. What is not allowed is inputs inside a role="menu", because the role tells the screen reader to expect one thing and the DOM hands it another. Anything that is genuinely not an item goes outside the role="menu" element and inside the root, which is where the account header, the loading status and the sign-out form all live.',
      'Alpine keeps aria-checked, aria-expanded, aria-pressed and aria-selected on the element when they bind to false and removes every other aria-* attribute that does. So :aria-checked="cols.dept" renders aria-checked="false" rather than vanishing, which is exactly what a menuitemcheckbox needs — an unchecked item with no aria-checked at all is announced as an ordinary menu item, and the user is never told the row is a toggle.',
      'A disabled item takes aria-disabled="true" and keeps its tabindex="-1". The disabled attribute takes it out of the roving walk entirely, so the arrows skip straight past the one item the user came for and nothing ever explains why it is not available. Put the reason on the item, in the item — "Already approved on 16 Aug 2026" under the label — because a tooltip on something you cannot hover on a phone is not an explanation.',
      'A second line under an item goes inside the button, never in aria-describedby. Inside, it joins the accessible name and is read straight after the label, which is the order somebody reading the screen gets it in; in a description it is announced late, in some readers only in verbose mode, and in others twice. Describe every item in the menu or none of them — one item with a consequence written under it in a list of bare labels reads as the only one that has consequences. One line each, and if a line will not fit in one, the menu is standing in for a page.',
      'The destructive item hands off to an alert dialog, and the order of the handoff is load-bearing: close the menu with focus going back to the trigger first, then set the dialog open. x-trap captures document.activeElement at the moment it activates and restores it on close, so if the dialog opens while focus is still on a menu item that x-show is about to hide, the trap memorises a node that is no longer focusable and Cancel drops the user on <body> at the top of the document.',
      'A submenu needs a delay in both directions and a check on what has focus. Opening on the first pixel of hover means every pass down the menu flashes a panel; closing on the first pixel of hover-out means the diagonal path from the trigger to the panel closes the thing you are travelling to. 120ms in, about 220ms out, and the close is abandoned if the submenu contains document.activeElement — otherwise a keyboard user who has arrowed into the submenu loses it, and their focus with it, the moment the pointer drifts.',
      'Decide which side a submenu opens on by measuring the trigger, never the panel. The panel is display:none until it opens, so getBoundingClientRect on it returns zeros and the test always concludes there is room on the right. Measure the trigger\'s rect, add the panel width you wrote in the class, and compare against innerWidth — and do it before setting open, so the panel is painted on the correct side rather than jumping there a frame later. The context menu is the mirror image and proves the rule rather than breaking it: there the thing being placed has no trigger to measure, so its height is read after the panel is displayed, inside the same requestAnimationFrame that moves focus.',
      'Below sm a flyout submenu has nowhere to go. A 208px panel hanging off a 208px panel needs 416px and a phone gives you 390, so the flip that saves you at a desktop right edge only moves the overflow to the left edge. The answer is not a narrower panel, it is a different shape: static and full width inside the parent, indented, on a recessed surface — a drill-down. One set of markup does both, because the positioning is all sm:-prefixed.',
      'Below sm a whole menu can stop being anchored too. A 208px panel hanging off an icon in the last column of a register is legible on a desk and unusable on a phone, where it opens under the thumb and half of it is off the screen; the same items as a sheet across the bottom edge, with a title and 44px rows, are the same menu drawn for the device. It stays light-dismiss and it gets no backdrop and no focus trap — a bottom sheet that needs both is a drawer, and drawer is where that lives.',
      'A menu whose items come from the server fetches on the click that opens it, with hx-trigger="click once" on the trigger, and never on page load: a register of forty rows would otherwise fire forty requests for menus nobody opened. The skeleton in the slot is the shape of the answer, so the panel does not resize under the pointer when the response lands. Focus is the part that needs care — show() runs a frame after the click and finds no menuitems, so it leaves the caret on the trigger, and the after-swap handler is what moves it onto the first item, guarded on the menu still being open and focus still being where show() left it. Without that guard a slow response yanks focus back out of a menu the user has already arrowed into, or into a menu they have already closed.',
      'Type-ahead belongs to a long menu and nowhere else. In a menu of five actions, reading the list is faster than guessing at its first letters, and the handler is one more thing to get wrong; past a dozen items, jumping to the S of a saved view is the only fast way in. Buffer the letters for about half a second, search from the item after the focused one so repeated presses cycle, and let Space through untouched — it has length 1 like every other printable key, and swallowing it stops the focused item being activated from the keyboard at all.',
      'A context menu is an accelerator over actions that are also on a button, exactly as a command palette is an accelerator over navigation. Right-click is a pointer gesture with no keyboard equivalent that anybody uses, and no equivalent at all on a touch screen, so every item in it has to exist in a menu with a real trigger on the same row. A panel placed at the pointer is position: fixed and driven by a bound :style, which brings two conditions with it: it must not also carry x-transition, because the transition writes and then restores its own style attribute over the binding, and it must close on scroll, because viewport coordinates stop describing the row the moment the register moves under it.',
      'Shortcut hints are aria-hidden and the real shortcut goes in aria-keyshortcuts. Glyphs are the reason: VoiceOver reads ⌘ as "place of interest sign" and ⇧ as "upwards white arrow", so the accessible name of Print becomes a small poem. The menu also must not listen for those keys — they are the application\'s global bindings, registered once at window level, and a menu that binds them too fires the action twice whenever it happens to be open.'
    ],
    anatomy: [
      ['Trigger', 'A button carrying a chevron, which is the only signal that anything is hidden behind it, plus aria-haspopup="menu" and a bound aria-expanded. It is inline-flex inside a relative inline-block root, so it is as wide as its label: a block-level flex button stretches to the column it sits in and a menu trigger that spans the page reads as a field. In a table it is an icon and then it needs a name of its own: twelve buttons all called More say nothing about which row the cursor is on.'],
      ['Panel', 'Absolutely positioned from top-full, z-40, opening below the trigger and aligned to the edge it has room on — left-0 for a toolbar button, right-0 for a row action or anything else near the right edge. border-zinc-300, rounded-xl, shadow-lg, py-1, and max-w-[calc(100vw-2rem)] so a 256px panel cannot be wider than a 390px screen with its margins. overflow-hidden unless a submenu has to escape it.'],
      ['Item', 'A full-width button with the icon left of the label, so the labels form a single reading column. A shortcut hint or a chevron goes on the right with ml-auto, aria-hidden, and the real shortcut in aria-keyshortcuts.'],
      ['Description', 'An optional second line inside the item, 12px, zinc-500, on its own row under the label with the icon aligned to the first line. It is part of the accessible name because it is inside the button. All the items in a menu have one or none of them do.'],
      ['Group label', 'An 11px uppercase line inside a role="group", aria-hidden because the group is already named by aria-label and a bare paragraph is not a permitted child of a menu. A labelled group needs no rule as well — the label is the boundary, and drawing both is two separators for one edge.'],
      ['Separator', 'Its own <div role="separator" class="my-1 h-px bg-zinc-100">, full bleed inside the panel padding. Not a border-t on the item below it: that rule belongs to the item, so it follows it to the top of the panel when whatever sat above is hidden.'],
      ['Checked item', 'role="menuitemcheckbox" or role="menuitemradio" with :aria-checked, and a size-4 slot on the left that either holds a check or is empty. The slot is always there, so the labels do not shift sideways as things are ticked.'],
      ['Scroller', 'A max-h on the panel plus overflow-y-auto, for a list the user generates and you therefore cannot keep short. The roving walk scrolls the focused item into view with block: "nearest", and the item outline takes the negative offset so it is not clipped by the scroller it sits flush inside.'],
      ['Submenu', 'A second role="menu" inside a relative wrapper, flying out left or right at sm and up according to a measurement of the trigger, and folding into an indented drill-down below it. Its own arrow-key scope, entered with Right and left with Left.'],
      ['Split trigger', 'The right half of a joined pair: the left half performs the default action and never opens anything, the chevron half owns aria-haspopup, aria-expanded and an aria-label of its own, because the name beside it already belongs to the other button.'],
      ['Loading slot', 'The element an htmx response replaces, holding a skeleton the size of the answer. It sits inside the panel; the role="status" that announces the fetch sits outside the role="menu", because a status is not a permitted child of a menu.'],
      ['Destructive item', 'Last, below the divider, in red-600 on the ordinary zinc-100 hover — never a red tint, and never adjacent to an item someone reaches for often — and it opens an alert dialog rather than doing the thing.']
    ],
    behaviour: [
      'Clicking the trigger toggles the panel and clicking outside closes it. Down or Up on the trigger also opens it, landing on the first or the last item, so the menu can be reached without a pointer at all.',
      'Escape closes the panel and returns focus to the trigger. Inside a submenu it closes the submenu only and lands back on its trigger, which is why that handler stops propagation.',
      'Choosing a command closes the menu and hands focus back to the trigger — a menu that stays open after a choice reads as though the click was missed, and one that closes onto nothing loses the keyboard its place.',
      'Choosing a setting does not close the menu. Column visibility, sort order and density are all set in runs, and Escape is the end of the run. An exclusive, terminal choice is the exception and closes: there is no second view to pick, and a panel left open over the register hides the change it just made.',
      'Down and Up wrap at both ends, Home and End jump to them, and Tab closes the menu without swallowing the tab, so focus carries on into the page from the trigger.',
      'In a long menu, typing letters jumps to the item that starts with them, cycling from the item after the focused one and clearing after about half a second. Space is never taken by the type-ahead, because Space activates the focused item.',
      'A capped menu scrolls inside its panel rather than growing past the viewport, and the arrow keys scroll the focused item into view rather than moving focus off the visible list.',
      'A submenu opens on Right, Enter or a deliberate hover, and closes on Left, Escape or the pointer leaving for long enough — unless the keyboard is inside it, in which case hover-out does nothing at all.',
      'A split button acts on its left half and opens on its chevron. Clicking the label never opens the menu; that is the entire reason for splitting it instead of making the whole control a dropdown.',
      'A right-click inside a register opens the row menu at the pointer, and every item in it is also on that row\'s own trigger. It closes on Escape, on a click anywhere else, and on the page scrolling under it.',
      'Below sm an anchored menu that would be unusable at 390px opens as a sheet on the bottom edge instead, with a title and taller rows. It is still light-dismiss and still gets no backdrop and no trap.',
      'A menu whose items come from the server fetches once, on the click that opens it, shows a skeleton the shape of the answer, and moves focus onto the first item when the response lands. A failed fetch leaves a retry item in the menu rather than an empty panel.',
      'Only one menu is open at a time. @click.outside handles this without a global store.',
      'A destructive item never acts on the click. It closes the menu, returns focus to the trigger and opens an alert dialog naming the record, so the confirm has somewhere to hand focus back to.',
      'Past about seven items this is the wrong control; the answer is a page with search, not a longer menu.'
    ],
    a11y: [
      'The trigger carries aria-haspopup="menu" and aria-expanded bound to the open state, and takes the standard focus-visible outline like any other control. An icon-only trigger in a register carries aria-label naming the record it acts on, and the chevron half of a split button carries its own, because the half beside it has already used the record\'s name.',
      'The panel is role="menu" and each item role="menuitem", role="menuitemcheckbox" or role="menuitemradio". Sections are role="group" with aria-label, and the visible group heading is aria-hidden because it is already the group\'s name and a paragraph is not a permitted child of a menu. Anything that is none of those roles — an account header, a fetch status, a sign-out form — sits outside the role="menu" element.',
      'Down and Up move between items and wrap, Home and End jump to the ends, Escape closes and Tab closes without swallowing the tab. The separator is skipped because the walk queries [role=menuitem] rather than stepping through child elements, so it never lands on a line.',
      'Focus is real focus, moved item to item with tabindex="-1" on each. This is where a menu and a combobox part company: a combobox keeps focus in its text box and points at a row with aria-activedescendant, but a menuitem is the thing being operated, so it has to be the thing focused. Down on the trigger opens onto the first item, Up onto the last, and Escape or a choice returns focus to the trigger. Clicking outside closes without moving focus, because the user has already put it somewhere else.',
      'An item hidden at the current breakpoint, or behind an x-show, is filtered out of the walk on offsetParent, because focus() on a display:none element does nothing and reports nothing — the arrow key appears to have been ignored.',
      'A checkable item carries aria-checked in both states. Bound with :aria-checked it survives being false, because Alpine keeps that attribute rather than removing it — and an unchecked item with the attribute missing is announced as a plain command.',
      'A second line under an item is inside the button, so it is part of the accessible name and is read in the order it is written. It is not aria-describedby, which arrives after a pause, in verbose mode only, or twice.',
      'A submenu trigger carries aria-haspopup="menu" and its own aria-expanded, and the submenu is a role="menu" of its own with its own arrow scope. Right opens it onto the first item, Left and Escape close it back onto the trigger.',
      'Type-ahead in a long menu matches on the item\'s own text and moves real focus, so what a screen reader announces is the item that is now focused and nothing has to be mirrored into a live region.',
      'A right-click menu is never the only route to what is in it. There is no keyboard gesture for it that people use and none at all on a touch screen, so the same items sit on a real trigger in the same row.',
      'An unavailable item is aria-disabled="true" and stays in the walk. The disabled attribute would remove it from the keyboard order, so the arrows would skip the item the user is hunting for and nothing would say why it is gone; the reason is written on the item itself.',
      'The progress of a fetched menu is announced from a role="status" that sits inside the root but outside the role="menu", because a status is not a permitted child of a menu and a skeleton with no text says nothing at all.',
      'The destructive item is distinguished by its label as well as its colour, since colour alone is not a signal, and the shortcut hints beside items are aria-hidden with the machine-readable form in aria-keyshortcuts.'
    ],
    related: ['button', 'button-group', 'popover', 'command-palette', 'separator'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- The divider is its own element, not a border-t on the Delete button.
     Hung off the button it belongs to the button, so an item above it that is
     hidden by a permission check takes the rule to the top of the panel where
     it introduces nothing. As its own element it drops out with the same
     {% if %} as the item it introduces.

     Three fills, three borders, one step apart. The panel floats over the page
     so its edge is border-zinc-300, the Edge token; the rule inside it is
     zinc-100, because a divider inside an already bordered surface is a step
     lighter again; and the focused item is bg-zinc-100, the tint token for a
     highlighted option. Nothing in a menu takes bg-zinc-200 — that is the chip
     fill, and an item wearing it reads as a badge left switched on.
     role="separator" is real here because the panel is a role="menu" and a menu
     is a list of peers.

     The root is relative inline-block and the trigger inline-flex. A block-level
     flex button stretches to whatever column it is dropped into, so a menu
     trigger pasted into a form ends up the width of the page and reads as a
     field rather than a button.

     A menu moves real focus between its items, one tabindex="-1" at a time.
     That is the opposite of the combobox next door, which keeps focus in the
     text box and points at a row with aria-activedescendant, and the two are
     not interchangeable: a menuitem is the thing being operated, so it has to
     be the thing focused. items() reads the buttons out of the DOM on every
     keystroke rather than off a list, so a permission check that drops an item
     drops it from the keyboard order too, and the separator is skipped for
     free because it is not a menuitem. The focused item takes a tint and an
     inset outline rather than outline-none plus a tint: the panel is
     overflow-hidden so a positive offset would be clipped, in forced colours
     the tint is dropped and the outline is all that is left, and outline-none
     beside an outline width silences the outline while leaving it configured.

     The opening focus is moved on the next animation frame, not in $nextTick.
     x-show has not written display yet when $nextTick runs: measured, the panel
     was still display none with offsetHeight 0 inside the callback, and
     focus() on a hidden button is a silent no-op that leaves the caret on the
     trigger. It only shows up when the trigger already had focus, because
     otherwise there is nothing to notice: a menu that opens with focus still
     outside it is a menu the arrow keys do not drive.

     The panel does not fade. It is opened deliberately and read immediately, so
     the only motion is the chevron reporting a state that persists, bound on a
     wrapping span because createIcons() replaces the <i> and takes any :class
     on it with it. -->
<div data-kui="dropdown/default" class="relative inline-block"
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
          :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="download" class="size-4 text-zinc-600"></i>Export
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>
  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Export options"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute top-full left-0 z-40 mt-1 w-52 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="sheet" class="size-4 text-zinc-600"></i>Excel (.xlsx)
    </button>
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="file-text" class="size-4 text-zinc-600"></i>CSV
    </button>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="trash-2" class="size-4"></i>Delete
    </button>
  </div>
</div>` },

      { id: 'row-actions', name: 'Row actions', code:
`<!-- The panel is right-0, and that is not a preference. The trigger sits about
     20px from the right edge of the register; a 192px panel anchored left-0
     would run 170px past it, and on a phone the page would either scroll
     sideways or clip the menu, depending on what the nearest overflow is. The
     rule is that the panel aligns to the edge of the trigger that has the room,
     which for the last column is always the right one.

     Nothing in the chain above the panel may be overflow-hidden either. The
     obvious place to put it is the card that rounds the table corners, and the
     moment you do, the menu on the last row is cut off at the card edge — so
     the wrapper keeps its border and radius and loses the clip, and the row
     hover tint is painted on the cells rather than on the tr so it does not
     square the bottom corners off.

     Each row owns its own x-data, so the state is per row and nothing has to be
     keyed by index. The trigger is an icon, so it needs a name of its own:
     :aria-label="'Actions for ' + r.po", because a register of buttons all
     called More tells a screen reader nothing about which row the cursor is on
     and the row it belongs to is three cells away.

     Cancel order is red text on the same zinc-100 hover as every other item. A
     red fill behind it would be the only field of colour on the screen, and the
     spec spends the red on the Overdue dot instead — colour means what a record
     is doing, not how nervous a button is.

     The vendor column goes below sm rather than being scrolled to. Two figures
     and a menu is what fits at 390px, and hiding a column somebody can still
     reach on the record page is better than a table that moves sideways. -->
<div data-kui="dropdown/row-actions" x-data="{
       rows: [
         { po: 'PO-24-1187', vendor: 'Sharma Extrusions', amount: '18,42,000' },
         { po: 'PO-24-1191', vendor: 'Nashik Steel Traders', amount: '4,68,500' },
         { po: 'PO-24-1194', vendor: 'Gujarat Polymers Ltd', amount: '27,10,400' }
       ]
     }"
     class="rounded-xl border border-zinc-300 bg-white">
  <table class="w-full text-[13px]/5">
    <caption class="sr-only">Purchase orders awaiting approval</caption>
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="hidden px-4 py-2.5 font-medium sm:table-cell">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        <th scope="col" class="w-12 px-2 py-2.5"><span class="sr-only">Row actions</span></th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in rows" :key="r.po">
        <tr class="border-b border-zinc-100 last:border-0 hover:[&>td]:bg-zinc-100">
          <td class="px-4 py-2 font-medium tabular-nums" x-text="r.po"></td>
          <td class="hidden px-4 py-2 sm:table-cell" x-text="r.vendor"></td>
          <td class="px-4 py-2 text-right tabular-nums">₹<span x-text="r.amount"></span></td>
          <td class="w-12 px-2 py-2">
            <div class="relative flex justify-end"
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
                      :aria-expanded="open" aria-haspopup="menu" :aria-label="'Actions for ' + r.po"
                      class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <i data-lucide="more-horizontal" class="size-4"></i>
              </button>

              <div x-show="open" x-cloak x-ref="menu" role="menu" :aria-label="'Actions for ' + r.po"
                   @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
                   @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
                   @keydown.tab="close(false)"
                   class="absolute top-full right-0 z-40 mt-1 w-48 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 text-left shadow-lg">
                <button type="button" role="menuitem" tabindex="-1" @click="close()"
                        class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                  <i data-lucide="eye" class="size-4 text-zinc-600"></i>Open order
                </button>
                <button type="button" role="menuitem" tabindex="-1" @click="close()"
                        class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                  <i data-lucide="check-check" class="size-4 text-zinc-600"></i>Approve
                </button>
                <button type="button" role="menuitem" tabindex="-1" @click="close()"
                        class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                  <i data-lucide="package-check" class="size-4 text-zinc-600"></i>Post GRN
                </button>

                <div role="separator" class="my-1 h-px bg-zinc-100"></div>

                <button type="button" role="menuitem" tabindex="-1" @click="close()"
                        class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
                  <i data-lucide="x-circle" class="size-4"></i>Cancel order
                </button>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</div>` },

      { id: 'groups', name: 'Labelled sections', code:
`<!-- Eleven items in one column is a list nobody reads to the end of. Three
     named sections of three or four is the same eleven items scanned by
     heading, which is the only reason a menu this long is allowed at all.

     The heading is a div inside the role="group", carrying aria-hidden, and the
     group is named with aria-label instead. Two reasons: a bare paragraph is
     not a permitted child of a role="menu", so left announced it is a stray
     node in a list of menuitems; and if the group is named by the heading and
     the heading is also read as content, the section name arrives twice.

     There is no separator between the groups. A label already draws the
     boundary, and a rule as well is two separators for one edge — the panel
     starts to look like a form. The rule is kept for the one place a label
     would be wrong: above the destructive item, where the point is distance,
     not a name.

     The walk does not know the groups exist. items() collects every menuitem in
     the panel in DOM order, so Down runs straight from Print order into Send
     for approval, and Home and End reach the first and last items in the panel
     rather than the ends of a section. That is correct: the groups are there to
     be read, not to be navigated between, and a keyboard model that stopped at
     each heading would make an eleven-item menu longer to cross than the flat
     one it replaced. -->
<div data-kui="dropdown/groups" class="relative inline-block"
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
          :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Actions
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Actions on PO-24-1187"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute top-full left-0 z-40 mt-1 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

    <div role="group" aria-label="Order">
      <div aria-hidden="true" class="px-3 pt-1.5 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Order</div>
      <button type="button" role="menuitem" tabindex="-1" @click="close()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="pencil" class="size-4 text-zinc-600"></i>Edit lines
      </button>
      <button type="button" role="menuitem" tabindex="-1" @click="close()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="copy" class="size-4 text-zinc-600"></i>Duplicate as new PO
      </button>
      <button type="button" role="menuitem" tabindex="-1" @click="close()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print order
      </button>
    </div>

    <div role="group" aria-label="Approval">
      <div aria-hidden="true" class="px-3 pt-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Approval</div>
      <button type="button" role="menuitem" tabindex="-1" @click="close()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="send" class="size-4 text-zinc-600"></i>Send for approval
      </button>
      <button type="button" role="menuitem" tabindex="-1" @click="close()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="user-plus" class="size-4 text-zinc-600"></i>Add an approver
      </button>
    </div>

    <div role="group" aria-label="Records">
      <div aria-hidden="true" class="px-3 pt-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Records</div>
      <button type="button" role="menuitem" tabindex="-1" @click="close()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="paperclip" class="size-4 text-zinc-600"></i>Attach a document
      </button>
      <button type="button" role="menuitem" tabindex="-1" @click="close()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="package-check" class="size-4 text-zinc-600"></i>Goods receipts (3)
      </button>
    </div>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="x-circle" class="size-4"></i>Cancel order
    </button>
  </div>
</div>` },

      { id: 'checkbox-items', name: 'Checkbox items', code:
`<!-- The menu stays open. Hiding four columns means four ticks, and a picker
     that closes on the first one makes the user reopen it three more times.
     Escape is what ends the run, and the count line under the table is the
     confirmation that anything happened at all. The rule is about runs rather
     than roles: a tick is one of several, so it stays; the Reset command below
     is the end of the run, so it closes.

     role="menuitemcheckbox" and a bound :aria-checked, not a real
     <input type="checkbox">. role="menu" permits menuitem, menuitemcheckbox,
     menuitemradio, group and separator and nothing else, so an input inside it
     is a role telling the screen reader to expect one thing while the DOM hands
     it another. The alternative is legitimate and the data table takes it:
     drop role="menu" for role="group", use real labelled inputs, and get native
     Tab order instead of the arrow-key walk. Pick one; there is no version
     where you keep both.

     :aria-checked is safe on false. Alpine removes an aria-* binding that
     evaluates falsy, with four exceptions — aria-checked, aria-expanded,
     aria-pressed and aria-selected — so this one renders aria-checked="false"
     rather than disappearing. If it disappeared, an unticked row would be
     announced as an ordinary command and nothing would say it was a toggle.

     items() collects the checkboxes and the command together, in one
     querySelectorAll with two selectors, because the walk has to cross the
     separator onto Reset. Two queries concatenated would put the command
     before the ticks whatever order they are drawn in; one query returns
     document order, which is what the eye is following.

     The tick slot is a size-4 span that is always present and sometimes empty,
     so the labels do not shift sideways as columns come and go. x-cloak sits on
     every tick, including the ones that start ticked: before Alpine boots,
     x-show has not run and all five would paint at once. -->
<div data-kui="dropdown/checkbox-items" x-data="{
       open: false,
       cols: { vendor: true, dept: false, status: true, due: true, gst: false },
       get shown() { return Object.values(this.cols).filter(Boolean).length + 1 },
       items() { return [...this.$refs.menu.querySelectorAll('[role=menuitemcheckbox],[role=menuitem]')] },
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
     }">
  <div class="relative inline-block"
       @click.outside="close(false)"
       @keydown.escape="if (open) { $event.stopPropagation(); close() }">
    <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
            @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
            :aria-expanded="open" aria-haspopup="menu"
            class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="columns-3" class="size-4 text-zinc-600"></i>Columns
      <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
        <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
      </span>
    </button>

    <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Columns shown in the order register"
         @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
         @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
         @keydown.tab="close(false)"
         class="absolute top-full left-0 z-40 mt-1 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

      <button type="button" role="menuitemcheckbox" tabindex="-1" :aria-checked="cols.vendor" @click="cols.vendor = !cols.vendor"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
          <span x-show="cols.vendor" x-cloak><i data-lucide="check" class="size-4"></i></span>
        </span>Vendor
      </button>

      <button type="button" role="menuitemcheckbox" tabindex="-1" :aria-checked="cols.dept" @click="cols.dept = !cols.dept"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
          <span x-show="cols.dept" x-cloak><i data-lucide="check" class="size-4"></i></span>
        </span>Department
      </button>

      <button type="button" role="menuitemcheckbox" tabindex="-1" :aria-checked="cols.status" @click="cols.status = !cols.status"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
          <span x-show="cols.status" x-cloak><i data-lucide="check" class="size-4"></i></span>
        </span>Status
      </button>

      <button type="button" role="menuitemcheckbox" tabindex="-1" :aria-checked="cols.due" @click="cols.due = !cols.due"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
          <span x-show="cols.due" x-cloak><i data-lucide="check" class="size-4"></i></span>
        </span>Due date
      </button>

      <button type="button" role="menuitemcheckbox" tabindex="-1" :aria-checked="cols.gst" @click="cols.gst = !cols.gst"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
          <span x-show="cols.gst" x-cloak><i data-lucide="check" class="size-4"></i></span>
        </span>GSTIN
      </button>

      <div role="separator" class="my-1 h-px bg-zinc-100"></div>

      <!-- a command, so this one does close: it ends the run rather than
           being another step in it -->
      <button type="button" role="menuitem" tabindex="-1"
              @click="cols = { vendor: true, dept: false, status: true, due: true, gst: false }; close()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="rotate-ccw" class="size-4 text-zinc-600"></i>Reset to default
      </button>
    </div>
  </div>

  <p class="mt-3 text-[13px]/5 tabular-nums text-zinc-600">
    <span x-text="shown"></span> of 6 columns shown in the order register.
  </p>
</div>` },

      { id: 'radio-items', name: 'Radio items', code:
`<!-- Two radio groups in one panel, which is the case that makes the group
     wrapper mandatory rather than decorative. Without role="group" around each
     set, a screen reader sees six menuitemradios in a row and reads the sort
     options and the density options as one choice of six, where picking a
     density would appear to un-pick the sort.

     Like the checkbox variant, choosing does not close, and for the same
     reason: these are view settings and they are set in runs — sort, then
     density, then look at the result. That is a statement about runs and not
     about the role. The saved-view menu in the scrolling variant is radios too
     and it does close, because picking a view is one exclusive choice with
     nothing to follow it and a panel left standing over the register hides the
     only confirmation there is.

     The trigger label carries the current sort so the setting is legible with
     the menu shut; a settings menu whose trigger says only Sort forces it open
     again to find out what is in force.

     A radio item is not a toggle: clicking the one already chosen sets it to
     itself, it does not clear it. There is no "unsorted" here, so there is
     nothing for a second click to mean, and offering one would just be a way
     to leave the register in a state it cannot render. -->
<div data-kui="dropdown/radio-items" class="relative inline-block"
     x-data="{
       open: false,
       sort: 'date', dense: 'comfortable',
       labels: { date: 'Order date', vendor: 'Vendor name', amount: 'Amount', due: 'Due date' },
       items() { return [...this.$refs.menu.querySelectorAll('[role=menuitemradio]')] },
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
          :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="arrow-down-wide-narrow" class="size-4 text-zinc-600"></i>
    <span>Sorted by <span x-text="labels[sort]">Order date</span></span>
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Register view"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute top-full left-0 z-40 mt-1 w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

    <div role="group" aria-label="Sort by">
      <div aria-hidden="true" class="px-3 pt-1.5 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Sort by</div>
      <template x-for="key in ['date', 'vendor', 'amount', 'due']" :key="key">
        <button type="button" role="menuitemradio" tabindex="-1" :aria-checked="sort === key" @click="sort = key"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
            <span x-show="sort === key" x-cloak><i data-lucide="check" class="size-4"></i></span>
          </span><span x-text="labels[key]"></span>
        </button>
      </template>
    </div>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <div role="group" aria-label="Row height">
      <div aria-hidden="true" class="px-3 pt-1 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Row height</div>
      <button type="button" role="menuitemradio" tabindex="-1" :aria-checked="dense === 'compact'" @click="dense = 'compact'"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
          <span x-show="dense === 'compact'" x-cloak><i data-lucide="check" class="size-4"></i></span>
        </span>Compact
      </button>
      <button type="button" role="menuitemradio" tabindex="-1" :aria-checked="dense === 'comfortable'" @click="dense = 'comfortable'"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
          <span x-show="dense === 'comfortable'" x-cloak><i data-lucide="check" class="size-4"></i></span>
        </span>Comfortable
      </button>
    </div>
  </div>
</div>` },

      { id: 'shortcuts', name: 'Shortcut hints', code:
`<!-- The hint is aria-hidden and the shortcut itself lives in
     aria-keyshortcuts. Glyphs are the reason: VoiceOver reads ⌘ as "place of
     interest sign" and ⇧ as "upwards white arrow", so leaving the kbd in the
     accessible name turns Print order into a riddle. aria-keyshortcuts takes
     the machine form — Control+P — and the browser reads it back in whatever
     wording the platform uses.

     The menu does not listen for any of these keys, and must not. They are the
     application's own bindings, registered once at window level, and a menu
     that also binds them fires the action twice whenever it happens to be open:

       @keydown.window.ctrl.p.prevent="printOrder()"

     Ctrl and not ⌘, because these are Windows desktops in a plant office. If
     you do serve both, swap the label from navigator.platform at boot rather
     than printing both — a hint showing two keys teaches neither.

     The kbd is border-zinc-200: it sits inside the panel, so it takes the
     Border token, one step in from the panel's own zinc-300 edge. It is also
     shrink-0, because the label beside it is the part allowed to wrap.

     Do not label a shortcut nobody has bound yet. A menu is the only place
     most people will ever read them, so a hint here is a promise the window
     handler has to keep. -->
<div data-kui="dropdown/shortcuts" class="relative inline-block"
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
          :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="file-text" class="size-4 text-zinc-600"></i>PO-24-1187
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Actions on PO-24-1187"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute top-full left-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

    <button type="button" role="menuitem" tabindex="-1" aria-keyshortcuts="Control+P" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print order
      <kbd aria-hidden="true" class="ml-auto shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">Ctrl P</kbd>
    </button>

    <button type="button" role="menuitem" tabindex="-1" aria-keyshortcuts="Control+D" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="copy" class="size-4 text-zinc-600"></i>Duplicate as new PO
      <kbd aria-hidden="true" class="ml-auto shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">Ctrl D</kbd>
    </button>

    <button type="button" role="menuitem" tabindex="-1" aria-keyshortcuts="Control+E" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="download" class="size-4 text-zinc-600"></i>Export lines
      <kbd aria-hidden="true" class="ml-auto shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">Ctrl E</kbd>
    </button>

    <!-- no hint on this one, because nothing is bound to it. A blank right
         column is honest; an invented key is not -->
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="paperclip" class="size-4 text-zinc-600"></i>Attach a document
    </button>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <button type="button" role="menuitem" tabindex="-1" aria-keyshortcuts="Control+Shift+A" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="send" class="size-4 text-zinc-600"></i>Send for approval
      <kbd aria-hidden="true" class="ml-auto shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px]/4 text-zinc-500">Ctrl Shift A</kbd>
    </button>
  </div>
</div>` },

      { id: 'submenu', name: 'Submenu', code:
`<!-- Two things decide which side this opens on, and neither is a guess.

     At sm and above the panel flies out sideways, and the side is measured
     before it is shown: the trigger's rect plus 216px — the w-52 panel and its
     4px gap, written down because a display:none panel measures 0 and every
     test against it concludes there is room on the right. The measurement runs
     before sub is set, so the panel is painted on the correct side rather than
     jumping there a frame later. The trigger here is right-aligned, so the flip
     is the normal case rather than the edge case.

     Below sm neither side fits. A 208px panel hanging off a 208px panel needs
     416px and a phone gives 390, so flipping only moves the overflow from one
     edge to the other. The shape has to change instead: static, full width,
     indented, on a recessed surface — a drill-down inside the parent panel.
     The surface is bg-zinc-50 and not bg-zinc-100, because a band recessed
     inside a white panel is the Recessed token, and the item highlight inside
     it is the ordinary bg-zinc-100. Draw the band at zinc-100 and the highlight
     has to climb to zinc-200 to be seen, which is the chip fill and reads as a
     badge switched on. Getting the band right means the item classes are the
     same at every width and the sm: overrides on them disappear; all that is
     left prefixed is the positioning.

     Hover intent runs on pointerenter, guarded on pointerType === 'mouse'. On a
     phone a tap synthesises a mouseenter before the click, so an unguarded
     handler opens the submenu on enter and the click then closes it again, and
     the drill-down looks broken. 120ms in stops the panel flashing on every
     pass down the menu; 220ms out is the diagonal from the trigger to the
     panel. The close is abandoned if the submenu contains document.activeElement
     — a keyboard user who has arrowed in must not lose the panel, and their
     focus with it, because the pointer drifted off it.

     items() filters to elements whose nearest role="menu" is this one, so the
     parent's arrow walk stops at the submenu trigger instead of falling through
     into its contents. The submenu is its own scope: Right or Enter enters it,
     Left or Escape steps back out onto the trigger, and its arrow, Home and End
     handlers stop propagation so the parent does not act on the same key. Both
     scopes carry Home and End, and the submenu's reach only its own three
     items — End inside a submenu that jumped to the bottom of the parent panel
     would throw the user out of the thing they had just entered.

     $event.detail === 0 is how a click from Enter is told from a click from the
     mouse. Enter should open the submenu and land on its first item; a real
     click should open it and leave the pointer in charge. Both arrive as click,
     and detail is the click count, which is 0 for a synthesised one. -->
<div data-kui="dropdown/submenu" class="flex justify-end">
  <div class="relative"
       x-data="{
         open: false, sub: false, flip: false, t: null,
         items() {
           const m = this.$refs.menu;
           return [...m.querySelectorAll('[role=menuitem]')].filter(el => el.closest('[role=menu]') === m);
         },
         subItems() { return [...this.$refs.sub.querySelectorAll('[role=menuitem]')] },
         show(last = false) {
           this.open = true;
           this.$nextTick(() => requestAnimationFrame(() => {
             const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus();
           }));
         },
         close(toTrigger = true) {
           if (!this.open) return;
           clearTimeout(this.t); this.sub = false; this.open = false;
           if (toTrigger) this.$refs.trigger.focus();
         },
         move(step) {
           const i = this.items(), at = i.indexOf(document.activeElement);
           i[(at + step + i.length) % i.length]?.focus();
         },
         edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
         openSub(focusFirst) {
           clearTimeout(this.t);
           this.flip = this.$refs.subtrigger.getBoundingClientRect().right + 216 > window.innerWidth;
           this.sub = true;
           if (focusFirst) this.$nextTick(() => requestAnimationFrame(() => this.subItems()[0]?.focus()));
         },
         closeSub(toTrigger = false) {
           clearTimeout(this.t);
           if (!this.sub) return;
           this.sub = false;
           if (toTrigger) this.$refs.subtrigger.focus();
         },
         moveSub(step) {
           const i = this.subItems(), at = i.indexOf(document.activeElement);
           i[(at + step + i.length) % i.length]?.focus();
         },
         edgeSub(last) { const i = this.subItems(); (last ? i[i.length - 1] : i[0])?.focus() },
         hoverIn(e) {
           if (e.pointerType !== 'mouse') return;
           clearTimeout(this.t); this.t = setTimeout(() => this.openSub(false), 120);
         },
         hoverOut(e) {
           if (e.pointerType !== 'mouse') return;
           clearTimeout(this.t);
           this.t = setTimeout(() => {
             if (!this.$refs.sub.contains(document.activeElement)) this.sub = false;
           }, 220);
         }
       }"
       @click.outside="close(false)"
       @keydown.escape="if (open) { $event.stopPropagation(); close() }">

    <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
            @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
            :aria-expanded="open" aria-haspopup="menu"
            class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="download" class="size-4 text-zinc-600"></i>Export
      <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
        <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
      </span>
    </button>

    <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Export the order register"
         @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
         @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
         @keydown.tab="close(false)"
         class="absolute top-full right-0 z-40 mt-1 w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

      <button type="button" role="menuitem" tabindex="-1" @click="close()" @pointerenter="closeSub()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="sheet" class="size-4 text-zinc-600"></i>Excel (.xlsx)
      </button>
      <button type="button" role="menuitem" tabindex="-1" @click="close()" @pointerenter="closeSub()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="file-text" class="size-4 text-zinc-600"></i>CSV
      </button>

      <div class="relative" @pointerenter="hoverIn($event)" @pointerleave="hoverOut($event)">
        <button type="button" role="menuitem" tabindex="-1" x-ref="subtrigger"
                aria-haspopup="menu" :aria-expanded="sub"
                @click="sub ? closeSub(true) : openSub($event.detail === 0)"
                @keydown.arrow-right.prevent.stop="openSub(true)"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <i data-lucide="mail" class="size-4 text-zinc-600"></i>Email a copy to
          <span class="ml-auto flex text-zinc-600 transition-transform motion-reduce:transition-none"
                :class="sub ? 'rotate-90 sm:rotate-0' : ''">
            <i data-lucide="chevron-right" class="size-3.5"></i>
          </span>
        </button>

        <div x-show="sub" x-cloak x-ref="sub" role="menu" aria-label="Email a copy to"
             @keydown.arrow-down.prevent.stop="moveSub(1)" @keydown.arrow-up.prevent.stop="moveSub(-1)"
             @keydown.home.prevent.stop="edgeSub(false)" @keydown.end.prevent.stop="edgeSub(true)"
             @keydown.arrow-left.prevent.stop="closeSub(true)"
             @keydown.escape.stop="closeSub(true)"
             @keydown.tab="close(false)"
             :class="flip ? 'sm:right-full sm:mr-1' : 'sm:left-full sm:ml-1'"
             class="mt-1 w-full rounded-lg bg-zinc-50 py-1 sm:absolute sm:top-0 sm:z-50 sm:mt-0 sm:w-52 sm:rounded-xl sm:border sm:border-zinc-300 sm:bg-white sm:shadow-lg">
          <button type="button" role="menuitem" tabindex="-1" @click="close()"
                  class="flex w-full items-center gap-2.5 py-2 pr-3 pl-9 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:pl-3">
            <i data-lucide="user" class="size-4 text-zinc-600"></i>Ritu Deshpande
          </button>
          <button type="button" role="menuitem" tabindex="-1" @click="close()"
                  class="flex w-full items-center gap-2.5 py-2 pr-3 pl-9 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:pl-3">
            <i data-lucide="building-2" class="size-4 text-zinc-600"></i>Vendor contact
          </button>
          <button type="button" role="menuitem" tabindex="-1" @click="close()"
                  class="flex w-full items-center gap-2.5 py-2 pr-3 pl-9 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:pl-3">
            <i data-lucide="indian-rupee" class="size-4 text-zinc-600"></i>Accounts payable
          </button>
        </div>
      </div>

      <div role="separator" class="my-1 h-px bg-zinc-100"></div>

      <button type="button" role="menuitem" tabindex="-1" @click="close()" @pointerenter="closeSub()"
              class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
        <i data-lucide="calendar-clock" class="size-4 text-zinc-600"></i>Schedule monthly
      </button>
    </div>
  </div>
</div>` },

      { id: 'destructive', name: 'Disabled and destructive', code:
`<!-- The unavailable item is aria-disabled="true" and keeps its tabindex="-1".
     The disabled attribute would take it out of the roving walk, so the arrows
     would jump from Duplicate to Cancel order and the one item the user came
     for would be invisible to the keyboard — with nothing anywhere saying why.
     The reason is written on the item, under the label, because a tooltip on
     something nobody can hover on a phone explains nothing. aria-disabled does
     not stop the click either, so the handler has to answer for it: @click.prevent
     with no expression is the whole handler, and it is deliberate — the item
     stays focusable, stays announced, and does nothing when pressed. It also
     drops hover:bg-zinc-100 while keeping focus:bg-zinc-100, because a tint that
     follows the pointer is a promise the click will do something, while the
     keyboard still needs to see where it is.

     Cancel order is red text on the same zinc-100 hover as everything else.
     No red tint sits behind a menu item in this system: the red is the word and
     the icon, and a coloured field behind them would be the only block of
     colour on a register whose actual alarms are 6px dots.

     The destructive item does not delete anything. It closes the menu, and the
     order of those two steps is the whole trick: close(true) puts focus back on
     the trigger first, then the dialog opens and x-trap captures
     document.activeElement to restore later. Open the dialog first and the trap
     memorises the menu item that x-show is about to hide, so Cancel restores
     focus to a detached node and the caret lands on <body> at the top of the
     document.

     The dialog lives inside the menu's root on purpose. It is a descendant, so
     @click.outside never sees a click on the backdrop as outside, and the menu
     cannot close itself out from under the dialog it opened. Escape is bound
     .window on the dialog and unbound-but-stopped on the menu, so exactly one
     of them answers whichever is up. -->
<div data-kui="dropdown/destructive" class="relative inline-block"
     x-data="{
       open: false, confirm: false,
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
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       ask() { this.close(); this.confirm = true }
     }"
     @click.outside="close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }">
  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
          :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Actions
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Actions on PO-24-1187"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute top-full left-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="eye" class="size-4 text-zinc-600"></i>Open order
    </button>
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="copy" class="size-4 text-zinc-600"></i>Duplicate as new PO
    </button>

    <button type="button" role="menuitem" tabindex="-1" aria-disabled="true" @click.prevent
            class="flex w-full items-start gap-2.5 px-3 py-2 text-left text-[13px]/5 text-zinc-500 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="send" class="mt-0.5 size-4 shrink-0"></i>
      <span>Send for approval
        <span class="block text-[12px]/4 tabular-nums">Approved already, 16 Aug 2026</span>
      </span>
    </button>

    <button type="button" role="menuitem" tabindex="-1" aria-disabled="true" @click.prevent
            class="flex w-full items-start gap-2.5 px-3 py-2 text-left text-[13px]/5 text-zinc-500 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="pencil" class="mt-0.5 size-4 shrink-0"></i>
      <span>Edit lines
        <span class="block text-[12px]/4">Locked once a GRN is posted</span>
      </span>
    </button>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <button type="button" role="menuitem" tabindex="-1" @click="ask()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="x-circle" class="size-4"></i>Cancel order
    </button>
  </div>

  <!-- no @click.self on the backdrop: an alert dialog is a question, and a
       stray click is not an answer. Cancel is first in the DOM so the trap
       opens on it rather than on the button that cancels the order. -->
  <div x-show="confirm" x-cloak x-trap.noscroll="confirm" @keydown.escape.window="confirm = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="dd-cancel-title" aria-describedby="dd-cancel-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <div class="flex items-start gap-3">
        <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
        <div class="min-w-0">
          <h2 id="dd-cancel-title" class="text-[16px]/6 font-semibold">Cancel PO-24-1187</h2>
          <p class="mt-1.5 text-[13px]/5 tabular-nums text-zinc-600">Sharma Extrusions · ₹18,42,000 · raised 04 Aug 2026.</p>
          <p id="dd-cancel-body" class="mt-2 text-[13px]/5 font-medium text-red-600">
            GRN 1142 covers 4 of the 6 lines and stays posted. The vendor is emailed the cancellation. This cannot be undone.
          </p>
        </div>
      </div>
      <div class="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" @click="confirm = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Keep the order</button>
        <button type="button" @click="confirm = false"
                class="rounded-lg bg-red-600 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel order</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'account', name: 'Account menu', code:
`<!-- The name-and-email block is not a menu item and cannot live inside the
     role="menu". A menu permits menuitem, menuitemcheckbox, menuitemradio,
     group and separator, and a div holding an avatar is none of them — dropped
     in anyway it is announced as a stray node in a list of commands, or
     silently skipped, depending on the screen reader. So the panel is a plain
     div that carries the keyboard handlers, the header sits in it as ordinary
     content, and role="menu" starts at the list below. items() reads from
     x-ref="menu", which is the inner list, so the header is outside the walk
     without anything being excluded by hand.

     The avatar in the header is a tinted shape, so it carries its ring:
     bg-zinc-200 with ring-1 ring-inset ring-zinc-300. The one in the trigger is
     solid zinc-700 and needs none — a solid shape has its own edge. Both are
     aria-hidden, because the initials are the name written twice.

     The email is the point of the header. On an application with a test tenant
     and a live one, the only question anybody asks this menu is which account
     they are signed into, and a name alone does not answer it. truncate rather
     than a wrap, because a two-line email pushes the first item off the panel
     on a phone.

     Sign out is a state change, so in Django it is a POST rather than a link.
     A <form> is not a permitted child of role="menu" either, so the form goes
     after the panel and the item points at it:

       <button type="submit" form="signout" role="menuitem" tabindex="-1">
       <form id="signout" method="post" action="{% url 'logout' %}" hidden>{% csrf_token %}</form>

     A GET link would be followed by every link prefetcher and mail scanner that
     ever sees the page, and the user is signed out by a robot. -->
<div data-kui="dropdown/account" class="flex justify-end">
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
            :aria-expanded="open" aria-haspopup="menu"
            class="inline-flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[12px]/4 font-medium text-white">RD</span>
      <span class="text-[13px]/5 font-medium">Ritu Deshpande</span>
      <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
        <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
      </span>
    </button>

    <div x-show="open" x-cloak
         @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
         @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
         @keydown.tab="close(false)"
         class="absolute top-full right-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

      <div class="flex items-start gap-2.5 px-3 py-2">
        <span aria-hidden="true" class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[13px]/5 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">RD</span>
        <div class="min-w-0">
          <p class="truncate text-[13px]/5 font-medium">Ritu Deshpande</p>
          <p class="truncate text-[12px]/4 text-zinc-500">ritu.deshpande@konspec.com</p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-500">Nashik plant · Procurement</p>
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
          <span class="ml-auto shrink-0 text-[12px]/4 text-zinc-500">Nashik</span>
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
</div>` },

      { id: 'split', name: 'Split button trigger', tagNew: true, code:
`<!-- One control, two halves, and the split is the point: the left half does the
     thing 90% of the time and never opens anything, so the common path is one
     click rather than a click, a read and a second click. Fold it into a plain
     dropdown and Approve — the action this screen exists for — becomes an item
     in a list of three. Make the whole thing act on click instead and the
     chevron is a lie.

     The chevron half carries the menu's ARIA on its own: aria-haspopup,
     aria-expanded and an aria-label, because "Approve" is already the
     accessible name of the button touching it and two buttons cannot share one.
     Down and Up open it onto the first or last item exactly as any other
     trigger, so the keyboard never has to find the 32px half.

     button-group/split draws this shape and stops there — one x-data, one
     open flag, no roving focus. This is the same object with the menu the
     dropdown entry owes it: tabindex="-1" items, a walk that reads the DOM,
     Home and End, Escape back to the chevron. Copy this one when the menu has
     more than a label in it; copy that one when you only want the geometry.

     Both halves declare h-9 rather than sizing from padding, because a join is
     visible to the pixel: measured, a padded label half and a padded icon half
     came out 38 against 36 and the seam showed. The divider is border-zinc-600,
     one step lighter than the fill — a zinc-300 rule on a dark button reads as
     a crack rather than a join, which is the opposite of the zinc-300 the panel
     below it takes against the page. -->
<div data-kui="dropdown/split" class="relative inline-flex"
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

  <button type="button"
          class="inline-flex h-9 items-center gap-2 rounded-l-lg bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="check-check" class="size-4"></i>Approve
  </button>

  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
          aria-label="More approval options" :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex h-9 items-center rounded-r-lg border-l border-zinc-600 bg-zinc-700 px-2 text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-4"></i>
    </span>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="More approval options"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute top-full right-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="check-check" class="size-4 text-zinc-600"></i>Approve and close
    </button>
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="user-round-plus" class="size-4 text-zinc-600"></i>Approve and forward
    </button>
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="calendar-clock" class="size-4 text-zinc-600"></i>Approve on the due date
    </button>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="circle-x" class="size-4"></i>Reject with a reason
    </button>
  </div>
</div>` },

      { id: 'descriptions', name: 'Items with descriptions', tagNew: true, code:
`<!-- Four items whose labels do not distinguish them. Release, Refresh and
     Reopen all mean something specific to a production order and something
     different to whoever last used a different ERP, so the consequence goes on
     the item rather than in a training document nobody reads at 6am.

     The second line is inside the button. That makes it part of the accessible
     name, announced straight after the label in the order it is written;
     aria-describedby would put it after a pause, in verbose mode only in some
     readers, and twice in others. It costs nothing here because the description
     is one short clause — anything longer is a page pretending to be a menu.

     Every item has one. A single described item among bare ones reads as the
     only one with consequences, which is exactly backwards: Print is not safer
     than Release, it is just easier to explain.

     items-start rather than items-center, and the icon takes mt-0.5 so it sits
     on the first line rather than floating between the two. The panel is w-80,
     which is as wide as a menu is allowed to get before it stops being anchored
     to its trigger and starts being a panel; max-w keeps it inside a 390px
     screen. The label is 13px zinc-900 and the line under it 12px zinc-500 —
     the same two steps a table cell and its caption take, so a menu of these
     reads at the same rhythm as the record behind it. -->
<div data-kui="dropdown/descriptions" class="relative inline-block"
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
          :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="factory" class="size-4 text-zinc-600"></i>PROD-2611
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Actions on production order PROD-2611"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute top-full left-0 z-40 mt-1 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-start gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="play" class="mt-0.5 size-4 shrink-0 text-zinc-600"></i>
      <span class="min-w-0">Release to the shop floor
        <span class="block text-[12px]/4 text-zinc-500">Locks the BOM and issues components from Nashik stores.</span>
      </span>
    </button>

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-start gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="refresh-cw" class="mt-0.5 size-4 shrink-0 text-zinc-600"></i>
      <span class="min-w-0">Refresh from the BOM
        <span class="block text-[12px]/4 text-zinc-500">Re-reads the routing and discards manual line edits.</span>
      </span>
    </button>

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-start gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="boxes" class="mt-0.5 size-4 shrink-0 text-zinc-600"></i>
      <span class="min-w-0">Post output and consumption
        <span class="block text-[12px]/4 text-zinc-500">Books finished quantity and backflushes the components.</span>
      </span>
    </button>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-start gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="circle-x" class="mt-0.5 size-4 shrink-0"></i>
      <span class="min-w-0">Cancel the order
        <span class="block text-[12px]/4">Returns issued components to stores. Posted output stays posted.</span>
      </span>
    </button>
  </div>
</div>` },

      { id: 'scrolling', name: 'Long list, capped and scrolled', tagNew: true, code:
`<!-- Seven items is the ceiling for a menu you wrote. This is the exception,
     and the exception is narrow: a list the user generates and then keeps. Two
     shared views ship with the register and everything under My views is
     somebody's own saved filter, so the length is not a design decision you get
     to make — it is however many views this buyer has saved since March. Cap it
     and scroll it. Past about a dozen it has stopped being a menu again and
     wants the views page, and the honest fix is that page, not a taller cap.

     The panel is the scroller, so it takes max-h-72 with overflow-y-auto
     instead of overflow-hidden, and the roving walk scrolls what it focuses:
     put() calls scrollIntoView with block "nearest", which moves the list only
     when the item is actually out of view and never re-centres a row that was
     already on screen. Without it, Down past the eighth view moves focus to
     something nobody can see and the panel sits still.

     The item outline is already focus:-outline-offset-2, negative, and this is
     the variant that proves why: a positive offset on an item flush against a
     scroller is clipped along the edge, so the top and bottom rows would show
     three sides of a focus ring.

     Type-ahead earns its place at this length and only at this length. A
     five-item menu is read faster than it is guessed at, and the handler is one
     more thing to get wrong; twelve views deep, N is the only quick way to
     "Nashik — overdue". The buffer clears after half a second, the search
     starts at the item after the focused one so pressing N twice cycles, and
     Space is let through untouched — it is a printable key like any other and
     swallowing it stops the focused item being activated from the keyboard.

     The group headings are sticky with a background of their own. A sticky
     heading that is transparent lets the rows scroll through the text and
     neither is legible; this is the same fix the command palette makes for the
     same reason.

     These are menuitemradios and they do close the menu, which the column
     picker does not. The rule is about runs, not roles: columns are ticked four
     at a time, a view is one exclusive choice with nothing to follow it, and a
     panel left standing over the register hides the only confirmation that the
     view changed. Save current view is a command below the rule, so it closes
     too, and it is the one item here that is not a choice. -->
<div data-kui="dropdown/scrolling" class="relative inline-block"
     x-data="{
       open: false, buf: '', bt: null,
       view: 'overdue',
       labels: {
         all: 'All open orders', approvals: 'Awaiting my approval', overdue: 'Overdue receipts', quarter: 'This quarter',
         nashik: 'Nashik — overdue', vapi: 'Vapi — raw material', capex: 'Capex above ₹5,00,000', fasteners: 'Fasteners rate contract',
         imports: 'Imports awaiting BOE', drafts: 'My drafts', gst: 'GSTIN missing', quality: 'Held at QC'
       },
       items() { return [...this.$refs.menu.querySelectorAll('[role=menuitemradio],[role=menuitem]')] },
       put(el) { if (!el) return; el.focus(); el.scrollIntoView({ block: 'nearest' }) },
       show(last = false) {
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => {
           const i = this.items(); this.put(last ? i[i.length - 1] : i[0]);
         }));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false; this.buf = '';
         if (toTrigger) this.$refs.trigger.focus();
       },
       move(step) {
         const i = this.items(), at = i.indexOf(document.activeElement);
         this.put(i[(at + step + i.length) % i.length]);
       },
       edge(last) { const i = this.items(); this.put(last ? i[i.length - 1] : i[0]) },
       type(e) {
         if (e.key === ' ' || e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
         clearTimeout(this.bt); this.bt = setTimeout(() => { this.buf = '' }, 500);
         this.buf += e.key.toLowerCase();
         const i = this.items(), at = i.indexOf(document.activeElement);
         const from = this.buf.length > 1 ? Math.max(at, 0) : at + 1;
         const order = [...i.slice(from), ...i.slice(0, from)];
         this.put(order.find(el => el.textContent.trim().toLowerCase().startsWith(this.buf)));
       },
       pick(key) { this.view = key; this.close() }
     }"
     @click.outside="close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }">

  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
          :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="list-filter" class="size-4 text-zinc-600"></i>
    <span x-text="labels[view]">Overdue receipts</span>
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Saved views"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)" @keydown="type($event)"
       class="absolute top-full left-0 z-40 mt-1 max-h-72 w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

    <div role="group" aria-label="Shared views">
      <div aria-hidden="true" class="sticky top-0 z-10 bg-white px-3 pt-1.5 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Shared views</div>
      <template x-for="key in ['all', 'approvals', 'overdue', 'quarter']" :key="key">
        <button type="button" role="menuitemradio" tabindex="-1" :aria-checked="view === key" @click="pick(key)"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
            <span x-show="view === key" x-cloak><i data-lucide="check" class="size-4"></i></span>
          </span><span x-text="labels[key]"></span>
        </button>
      </template>
    </div>

    <div role="group" aria-label="My views">
      <div aria-hidden="true" class="sticky top-0 z-10 bg-white px-3 pt-2 pb-1 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">My views</div>
      <template x-for="key in ['nashik', 'vapi', 'capex', 'fasteners', 'imports', 'drafts', 'gst', 'quality']" :key="key">
        <button type="button" role="menuitemradio" tabindex="-1" :aria-checked="view === key" @click="pick(key)"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <span class="flex size-4 shrink-0 items-center justify-center text-zinc-700">
            <span x-show="view === key" x-cloak><i data-lucide="check" class="size-4"></i></span>
          </span><span class="truncate" x-text="labels[key]"></span>
        </button>
      </template>
    </div>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="bookmark" class="size-4 text-zinc-600"></i>Save the current filters as a view
    </button>
  </div>
</div>` },

      { id: 'context-menu', name: 'Right-click on a row', tagNew: true, code:
`<!-- A right-click menu is an accelerator over actions that are also on a
     button, exactly as the command palette is an accelerator over navigation.
     There is no right-click on a touch screen and no keyboard gesture for it
     that anybody actually uses, so every item here is also on the More button
     in the last column — one panel, two ways in, and the keyboard route is the
     button. Ship this as the only way to cancel an order and the order cannot
     be cancelled from a phone.

     One menu serves the whole table rather than one per row. It is positioned
     at the pointer, so it cannot be a child of the row it acts on, and row is
     the piece of state that says which record it is about — that is also what
     names it, :aria-label="'Actions for ' + row.po", because a menu that opens
     under the cursor has lost the one thing that told you which row it belongs
     to. The row itself takes the selected tint while the menu is open for the
     same reason.

     Position is a bound :style on a fixed panel, which brings two conditions.
     It must not also carry x-transition: the transition writes its own style
     attribute over the element and restores the cached one on finish, so the
     panel snaps back to wherever it was last opened. And it must close on
     scroll, because viewport coordinates stop describing the row the moment the
     register moves under them. Note also that any ancestor carrying transform,
     filter or will-change becomes the containing block for a fixed element, and
     the panel then anchors to that instead of the viewport.

     The horizontal clamp is arithmetic done before the panel is shown — the
     w-52 panel plus a 16px margin — because there is nothing to measure yet.
     The vertical flip is the opposite and has to be: the height depends on how
     many items a permission check left in the panel, so it is read inside the
     same requestAnimationFrame that moves focus, one frame after x-show has
     written display. The submenu variant measures its trigger before showing
     for the same underlying reason: measure what exists, never what is still
     display:none.

     The root closes the menu on any left click that did not land inside it, not
     just on clicks outside the table — a right-click on one row followed by a
     left-click on another has to put the menu away. The More button stops its
     own click so that handler does not close the menu it just opened. -->
<div data-kui="dropdown/context-menu"
     x-data="{
       open: false, x: 0, y: 0, row: null, opener: null,
       rows: [
         { po: 'PO-24-1187', vendor: 'Sharma Extrusions', amount: '18,42,000' },
         { po: 'PO-24-1191', vendor: 'Nashik Steel Traders', amount: '4,68,500' },
         { po: 'PO-24-1194', vendor: 'Gujarat Polymers Ltd', amount: '27,10,400' }
       ],
       items() { return [...this.$refs.menu.querySelectorAll('[role=menuitem]')] },
       showAt(cx, cy, r, opener) {
         this.row = r; this.opener = opener;
         this.x = Math.max(8, Math.min(cx, window.innerWidth - 224));
         this.y = cy;
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => {
           const h = this.$refs.menu.offsetHeight;
           if (cy + h > window.innerHeight - 8) this.y = Math.max(8, cy - h);
           this.items()[0]?.focus();
         }));
       },
       fromRow(e, r) { this.showAt(e.clientX, e.clientY, r, e.currentTarget.querySelector('[aria-haspopup]')) },
       fromButton(e, r) {
         const b = e.currentTarget.getBoundingClientRect();
         this.showAt(b.right - 208, b.bottom + 4, r, e.currentTarget);
       },
       close(toOpener = true) {
         if (!this.open) return;
         this.open = false;
         if (toOpener) this.opener?.focus();
       },
       move(step) {
         const i = this.items(), at = i.indexOf(document.activeElement);
         i[(at + step + i.length) % i.length]?.focus();
       },
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() }
     }"
     @click="if (open && !$refs.menu.contains($event.target)) close(false)"
     @click.outside="close(false)"
     @scroll.window="close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }"
     class="rounded-xl border border-zinc-300 bg-white">

  <p class="border-b border-zinc-200 px-4 py-2 text-[12px]/4 text-zinc-500">Right-click a row, or use the button at the end of it.</p>

  <table class="w-full text-[13px]/5">
    <caption class="sr-only">Purchase orders awaiting approval</caption>
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="hidden px-4 py-2.5 font-medium sm:table-cell">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        <th scope="col" class="w-12 px-2 py-2.5"><span class="sr-only">Row actions</span></th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in rows" :key="r.po">
        <tr @contextmenu.prevent="fromRow($event, r)"
            :class="open && row && row.po === r.po ? '[&>td]:bg-zinc-100' : ''"
            class="border-b border-zinc-100 last:border-0 hover:[&>td]:bg-zinc-100">
          <td class="px-4 py-2 font-medium tabular-nums" x-text="r.po"></td>
          <td class="hidden px-4 py-2 sm:table-cell" x-text="r.vendor"></td>
          <td class="px-4 py-2 text-right tabular-nums">₹<span x-text="r.amount"></span></td>
          <td class="w-12 px-2 py-2">
            <div class="flex justify-end">
              <button type="button" @click.stop="fromButton($event, r)"
                      aria-haspopup="menu" :aria-expanded="open && row && row.po === r.po"
                      :aria-label="'Actions for ' + r.po"
                      class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <i data-lucide="more-horizontal" class="size-4"></i>
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>

  <div x-show="open" x-cloak x-ref="menu" role="menu"
       :aria-label="row ? 'Actions for ' + row.po : 'Row actions'"
       :style="'left: ' + x + 'px; top: ' + y + 'px'"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="fixed z-40 w-52 overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="eye" class="size-4 text-zinc-600"></i>Open order
    </button>
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="copy" class="size-4 text-zinc-600"></i>Copy PO number
    </button>
    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="package-check" class="size-4 text-zinc-600"></i>Post GRN
    </button>

    <div role="separator" class="my-1 h-px bg-zinc-100"></div>

    <button type="button" role="menuitem" tabindex="-1" @click="close()"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="x-circle" class="size-4"></i>Cancel order
    </button>
  </div>
</div>` },

      { id: 'responsive', name: 'Sheet below sm', tagNew: true, code:
`<!-- The same menu, twice. At sm and up it is a 224px panel hanging off an icon
     in the last column of a register. Below sm that panel opens under the thumb
     that pressed it, with half of it off the right edge, so the shape changes
     rather than the width: full bleed on the bottom edge, a title saying which
     record it acts on, and 44px rows. Narrow the popover instead and you get a
     menu that is hard to hit and still in the wrong place.

     It stays light-dismiss. No backdrop and no x-trap, because a sheet with a
     scrim and a focus trap is a drawer, and drawer is the entry that owns that
     — dimming the page is a promise that it has stopped, and this page has not.
     What it does get is the title, because a panel pinned to the bottom edge
     has no trigger next to it to say what it belongs to.

     items() filters on offsetParent, and this is the variant that makes that
     mandatory. Cancel exists only below sm and Open in a new tab only above it,
     so at any given width one of them is display:none — and focus() on a
     display:none element is a silent no-op with no error, so the arrow key
     appears to have been ignored and the user presses it again. offsetParent is
     null for anything display:none and costs one property read per item per
     keystroke.

     Everything else is unchanged from the anchored menu: the same roving walk,
     the same Escape back to the trigger, the same role="menu" with the title
     outside it, because a heading is not a permitted child of a menu any more
     than the account header is. -->
<div data-kui="dropdown/responsive" class="flex justify-end">
  <div class="relative"
       x-data="{
         open: false,
         items() {
           return [...this.$refs.menu.querySelectorAll('[role=menuitem]')].filter(el => el.offsetParent !== null);
         },
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
            :aria-expanded="open" aria-haspopup="menu" aria-label="Actions for PO-24-1187"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="more-horizontal" class="size-4"></i>
    </button>

    <div x-show="open" x-cloak
         @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
         @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
         @keydown.tab="close(false)"
         class="fixed inset-x-0 bottom-0 z-40 w-full overflow-hidden rounded-t-2xl border border-zinc-300 bg-white pb-2 shadow-lg sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:bottom-auto sm:mt-1 sm:w-56 sm:max-w-[calc(100vw-2rem)] sm:rounded-xl sm:pb-1">

      <!-- outside the role="menu", like the account header: a heading is not a
           permitted child of a menu. Below sm it is the only thing saying which
           record the sheet acts on; at sm the trigger is beside the panel and
           says it already -->
      <p class="border-b border-zinc-100 px-4 py-3 text-[13px]/5 font-medium tabular-nums sm:hidden">PO-24-1187 · Sharma Extrusions</p>

      <div x-ref="menu" role="menu" aria-label="Actions for PO-24-1187" class="py-1">
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:px-3 sm:py-2">
          <i data-lucide="eye" class="size-4 text-zinc-600"></i>Open order
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:px-3 sm:py-2">
          <i data-lucide="check-check" class="size-4 text-zinc-600"></i>Approve
        </button>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:px-3 sm:py-2">
          <i data-lucide="package-check" class="size-4 text-zinc-600"></i>Post GRN
        </button>

        <!-- a second window is a desk gesture; on a phone it is a tab nobody
             finds again, so it is not offered there -->
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="hidden w-full items-center gap-2.5 px-4 py-3 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:flex sm:px-3 sm:py-2">
          <i data-lucide="external-link" class="size-4 text-zinc-600"></i>Open in a new tab
        </button>

        <div role="separator" class="my-1 h-px bg-zinc-100"></div>

        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13px]/5 text-red-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:px-3 sm:py-2">
          <i data-lucide="x-circle" class="size-4"></i>Cancel order
        </button>

        <!-- there is no trigger visible beside a sheet to press again, and no
             Escape key on a phone: the way out has to be in the sheet -->
        <div role="separator" class="my-1 h-px bg-zinc-100 sm:hidden"></div>
        <button type="button" role="menuitem" tabindex="-1" @click="close()"
                class="flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13px]/5 text-zinc-600 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:hidden">
          <i data-lucide="x" class="size-4"></i>Cancel
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'htmx', name: 'Fetched on first open', tagNew: true, code:
`<!-- Who a purchase order can be assigned to depends on the plant, the approval
     limit and who is on leave this week, so the list is not in the template. It
     is fetched, and the two words that matter in hx-trigger are "click once":
     on the click that opens the menu, so nothing is requested for a menu nobody
     opens, and once, so the eleventh open of the same menu is not the eleventh
     request. In a register of forty rows the difference is forty round trips
     against however many menus somebody actually pressed.

     Alpine does not fetch. It owns open, the roving walk and the two flags the
     panel paints from; htmx owns the request, the target and the swap. The
     moment a component reaches for fetch() inside x-data, both halves start
     needing to know about the other one.

     Focus is the part that goes wrong. show() runs a frame after the click and
     finds no menuitems, because the response has not landed, so it leaves the
     caret on the trigger — correctly, since focus() on nothing does nothing.
     The after-swap handler is what moves it in, and it is guarded twice: only
     if the menu is still open, and only if focus is still exactly where show()
     left it. Without those guards a slow response yanks focus out of a menu the
     user has already arrowed into, or into one they have already closed.

     The skeleton is the shape of the answer — three rows the height of three
     items — so the panel does not resize under the pointer when the list
     arrives. It is aria-hidden, because a div is not a permitted child of
     role="menu"; hidden from the tree the menu is briefly empty rather than
     briefly wrong, and the role="status" outside the menu is what actually says
     something is loading. The status lives outside for the same reason the
     account header does.

     A failure leaves a retry item rather than an empty panel, and the retry
     carries its own hx-get because hx-trigger="click once" has already spent
     the trigger's one request. It is behind x-show, which is why items() filters
     on offsetParent — focus() on a display:none button is a silent no-op and the
     arrow key looks ignored.

     The server returns menu items and nothing else, each one already wearing its
     role and its handler, and Alpine initialises them because they are swapped
     inside this component's root:

       <button type="button" role="menuitem" tabindex="-1" @click="close()"
               class="flex w-full items-center gap-2.5 px-3 py-2 …">Ritu Deshpande</button> -->
<div data-kui="dropdown/htmx" class="relative inline-block"
     x-data="{
       open: false, loaded: false, failed: false,
       items() {
         return [...this.$refs.menu.querySelectorAll('[role=menuitem]')].filter(el => el.offsetParent !== null);
       },
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
       edge(last) { const i = this.items(); (last ? i[i.length - 1] : i[0])?.focus() },
       landed() {
         this.loaded = true; this.failed = false;
         if (this.open && document.activeElement === this.$refs.trigger) {
           this.$nextTick(() => this.items()[0]?.focus());
         }
       }
     }"
     @click.outside="close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }"
     @htmx:after-swap="landed()"
     @htmx:response-error="failed = true"
     @htmx:send-error="failed = true">

  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
          :aria-expanded="open" aria-haspopup="menu"
          hx-get="/orders/PO-24-1187/assignees/" hx-target="#dd-assignees" hx-swap="outerHTML" hx-trigger="click once"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="user-plus" class="size-4 text-zinc-600"></i>Assign to
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Assign PO-24-1187 to"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute top-full left-0 z-40 mt-1 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">

    <!-- three rows the height of three items, so the panel does not resize when
         the answer lands. aria-hidden, because a div is not a permitted child
         of a menu — the role="status" below is what announces the wait -->
    <div id="dd-assignees" aria-hidden="true" class="animate-pulse motion-reduce:animate-none">
      <div class="flex items-center gap-2.5 px-3 py-2"><span class="size-4 rounded-full bg-zinc-100"></span><span class="h-3 w-32 rounded bg-zinc-100"></span></div>
      <div class="flex items-center gap-2.5 px-3 py-2"><span class="size-4 rounded-full bg-zinc-100"></span><span class="h-3 w-40 rounded bg-zinc-100"></span></div>
      <div class="flex items-center gap-2.5 px-3 py-2"><span class="size-4 rounded-full bg-zinc-100"></span><span class="h-3 w-28 rounded bg-zinc-100"></span></div>
    </div>

    <!-- the trigger has spent its one request, so the retry carries its own -->
    <button type="button" role="menuitem" tabindex="-1" x-show="failed" x-cloak
            hx-get="/orders/PO-24-1187/assignees/" hx-target="#dd-assignees" hx-swap="outerHTML"
            class="flex w-full items-start gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
      <i data-lucide="rotate-ccw" class="mt-0.5 size-4 shrink-0 text-zinc-600"></i>
      <span class="min-w-0">Could not load the list
        <span class="block text-[12px]/4 text-zinc-500">Press to try again.</span>
      </span>
    </button>
  </div>

  <!-- outside the role="menu": a status is not a permitted child of one, and a
       skeleton with no text announces nothing at all -->
  <p role="status" class="sr-only"
     x-text="open && !loaded && !failed ? 'Loading the people this order can be assigned to' : ''"></p>
</div>` }
    ]
  },

  /* ── FORMS ──────────────────────────────────────────────────────────────── */
);
