register(
{
    id: 'button', name: 'Button', category: 'actions',
    description: 'The standard action control. Exactly one primary button per view; everything else is secondary, ghost or a link.',
    when: 'Any action the user takes on this page. Anything that goes to another page is an anchor, not a button.',
    notes: [
      'Tailwind v4 preflight drops cursor:pointer from <button>. One base rule in the page stylesheet restores it for every interactive element — never add cursor-pointer to a button.',
      'Hover is always one step deeper than the button\'s own resting fill: zinc-700 to zinc-800, white to zinc-100, red-600 to red-700. Ghost has no fill of its own, so it hovers to zinc-200 — zinc-100 would be invisible on the zinc-100 page background.',
      'Height is set with h-*, never left to padding, and every variant carries a border — border-transparent on the ones with no visible edge. Padding-derived height cannot match an icon-only button: measured, a bordered secondary came out at 38 against a 36 primary, and a size-9 icon button at 36 against a 38 label. Fixing the height fixes both at once and px-* then controls width alone.',
      'Danger is reserved for destructive actions that cannot be undone. A red Save is a lie about the stakes.',
      'One primary per view. Three solid buttons on a screen have told the user nothing about which one matters.',
      'A submit button is disabled while its request is in flight, and the label does not change width when it does — otherwise the row reflows under the cursor mid-click.'
    ],
    anatomy: [
      ['Label', 'A verb and its object. "Approve order", not "OK" — someone reading only the buttons should know what each one does.'],
      ['Icon', 'Optional, left of the label at size-4. It clarifies the verb; it never replaces it except in an icon-only button.'],
      ['Surface', 'What the variant actually is: solid zinc-700 for primary, white with a zinc-200 border for secondary, red-600 for danger, nothing at all for ghost.'],
      ['Hit area', 'h-7 small, h-9 medium, h-11 large — 28, 36 and 44px. Icon-only is the matching square: size-7, size-9, or size-8 in a dense toolbar beside h-8 labels.'],
      ['Busy state', 'A spinning loader in place of the icon while the request is in flight, with the label in the present participle and the width held.']
    ],
    behaviour: [
      'One primary button per view. A screen with three solid buttons has told the user nothing about which one matters.',
      'A button that submits stays disabled while the request is in flight, or a double click posts twice.',
      'The label does not change width between idle and busy states, so the row does not reflow under the cursor.',
      'Disabled is a real disabled attribute, never a class that only looks disabled — the second kind still fires its handler.',
      'Anything that navigates is an <a>. A button that changes the URL breaks middle-click, open-in-new-tab and the browser\'s own history.',
      'Below sm, buttons in a form or dialog footer go full width and stack. Two 36px buttons side by side on a 390px screen are a thumb-sized problem.',
      'Every button in a row is the same height, which is why height is declared rather than inferred. Mixed heights in a toolbar read as a rendering fault, not as hierarchy.'
    ],
    a11y: [
      'An icon-only button carries aria-label, because its only content is decorative.',
      'The busy state sets aria-busy="true" and keeps the disabled attribute, so the wait is announced and not merely drawn.',
      'Disabled buttons are skipped by Tab and announced as unavailable, which is why the attribute matters more than the styling.',
      'The browser\'s own focus ring is left in place on every variant. Nothing here sets outline:none, and the ghost variant especially depends on it — there is no border to thicken.',
      'A button that only opens something carries aria-expanded and aria-haspopup, so its state is known before it is pressed.',
      'type="button" is explicit on every button inside a <form>, because the default is submit and a stray toolbar button will post the form.'
    ],
    related: ['button-group', 'dropdown', 'alert-dialog'],
    variants: [
      { id: 'variants', name: 'Variants', code:
`<!-- Five, and no others. Primary is the one thing this screen is for; secondary
     is everything else that acts; ghost is for actions dense enough that a
     border each would draw a grid; danger cannot be undone; link navigates. -->
<div class="flex flex-wrap items-center gap-3">
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Primary</button>
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Secondary</button>
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent px-4 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Ghost</button>
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-red-600 px-4 text-[13px]/5 font-medium text-white hover:bg-red-700">Danger</button>
  <a href="#" class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">Link</a>
</div>` },

      { id: 'sizes', name: 'Sizes', code:
`<!-- Three, matched to density rather than to importance. Small belongs in a
     table row or a dense toolbar; large is for the one button on a sign-in card
     or the primary action of a full-page form. Everything else is medium. -->
<div class="flex flex-wrap items-center gap-3">
  <button type="button" class="inline-flex h-7 items-center rounded-md border border-transparent bg-zinc-700 px-2.5 text-[12px]/4 font-medium text-white hover:bg-zinc-800">Small</button>
  <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Medium</button>
  <button type="button" class="inline-flex h-11 items-center rounded-lg border border-transparent bg-zinc-700 px-5 text-[14px]/5 font-medium text-white hover:bg-zinc-800">Large</button>
</div>` },

      { id: 'icons', name: 'With icons', code:
`<!-- An icon sits left of the label and clarifies the verb. A chevron is the
     exception and sits right, because it points at what is about to open.

     Icon-only buttons are square so the hit area stays square, and they carry
     aria-label — the icon is decorative and contributes nothing to the name. -->
<div class="flex flex-wrap items-center gap-3">
  <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
    <i data-lucide="plus" class="size-4"></i>New order
  </button>
  <button type="button" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="download" class="size-4 text-zinc-600"></i>Export
  </button>
  <button type="button" aria-haspopup="menu" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">
    Columns<i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>
  <button type="button" aria-label="Edit order" class="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100">
    <i data-lucide="pencil" class="size-4"></i>
  </button>
  <button type="button" aria-label="More actions" class="inline-flex size-9 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
    <i data-lucide="ellipsis" class="size-4"></i>
  </button>
</div>` },

      { id: 'states', name: 'Idle, busy, disabled', code:
`<!-- The busy button is the same width as the idle one. "Approve" and
     "Approving…" are different lengths, so the label is held at its widest with
     a grid overlay: both strings occupy the same cell, only one is visible, and
     the cell is as wide as the longer of the two. Without that the row shifts
     under the cursor the instant it is clicked.

     Busy keeps disabled as well as aria-busy — aria-busy announces the wait,
     disabled is what actually stops the second click. -->
<div class="flex flex-wrap items-center gap-3" x-data="{ busy: false }">
  <button type="button" @click="busy = true; setTimeout(() => busy = false, 2200)"
          :disabled="busy" :aria-busy="busy"
          class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 disabled:hover:bg-zinc-700">
    <i x-show="!busy" data-lucide="check" class="size-4"></i>
    <i x-show="busy" x-cloak data-lucide="loader-circle" class="size-4 animate-spin"></i>
    <span class="grid">
      <span class="col-start-1 row-start-1" :class="busy && 'invisible'">Approve</span>
      <span class="col-start-1 row-start-1" :class="!busy && 'invisible'" aria-hidden="true">Approving…</span>
    </span>
  </button>

  <button type="button" disabled class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-200 px-4 text-[13px]/5 font-medium text-zinc-400">Disabled</button>
  <button type="button" disabled class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium text-zinc-400">Disabled secondary</button>
</div>` },

      { id: 'link', name: 'Navigating, not acting', code:
`<!-- An anchor that looks like a button. If it changes the URL it must be an
     <a> — a button that calls location.href breaks middle-click, open in new
     tab, copy link address and the back button, all silently.

     inline-flex rather than flex, because an anchor is inline and a bare flex
     would stretch it across the row. -->
<div class="flex flex-wrap items-center gap-3">
  <a href="#" class="inline-flex h-9 items-center gap-2 rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
    <i data-lucide="plus" class="size-4"></i>New purchase order
  </a>
  <a href="#" class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">
    Open in ledger<i data-lucide="arrow-up-right" class="size-3.5 text-zinc-600"></i>
  </a>
</div>` },

      { id: 'full-width', name: 'Full width on a phone', code:
`<!-- A form or dialog footer. Below sm the buttons stack and fill the width;
     from sm they sit inline and right-aligned. flex-col-reverse is deliberate:
     the primary is last in the DOM so it is last in the Tab order, but first on
     screen once stacked, which is where a thumb lands. -->
<div class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  <p class="text-[14px]/5">Approve PO-24-1187 for ₹4,82,000?</p>
  <p class="mt-1 text-[13px]/5 text-zinc-600">Gujarat Polymers Ltd · 6 lines</p>

  <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="button" class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Cancel</button>
    <button type="button" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve</button>
  </div>
</div>` },

      { id: 'toolbar', name: 'In a page header', code:
`<!-- Where the one-primary rule earns its keep. Four actions, one solid. The
     primary sits last, nearest the right edge and the thumb, and matches the
     order a dialog footer uses so the two never contradict each other. -->
<div class="rounded-xl border border-zinc-300 bg-white px-5 py-4">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h1 class="text-[20px]/7 font-semibold tracking-tight tabular-nums">PO-24-1187</h1>
      <p class="mt-0.5 text-[13px]/5 text-zinc-600">Gujarat Polymers Ltd · raised 14 Aug 2026</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="inline-flex h-8 items-center rounded-lg border border-transparent px-3 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200">Cancel order</button>
      <button type="button" aria-label="Print" class="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100">
        <i data-lucide="printer" class="size-4"></i>
      </button>
      <button type="button" class="inline-flex h-8 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100">
        <i data-lucide="download" class="size-4 text-zinc-600"></i>Export
      </button>
      <button type="button" class="inline-flex h-8 items-center rounded-lg border border-transparent bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve</button>
    </div>
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
<form method="post" class="max-w-md rounded-xl border border-zinc-300 bg-white p-5">
  {% csrf_token %}
  <label for="id_remarks" class="mb-1.5 block text-[13px]/5 font-medium">Approval remarks</label>
  <textarea name="remarks" id="id_remarks" rows="3"
            class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[14px]/5 focus:border-zinc-700 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15"></textarea>

  <div class="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
    <button type="submit" name="action" value="draft"
            class="inline-flex h-9 items-center rounded-lg border border-zinc-200 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-100">Save as draft</button>
    <button type="submit" name="action" value="approve"
            class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve</button>
  </div>
</form>` }
    ]
  },

  {
    id: 'button-group', name: 'Button group', category: 'actions',
    description: 'Several controls joined into one object. Two shapes only: a tinted track for choosing one of a set, and a bordered strip for actions that belong together.',
    when: 'When the controls are genuinely related — one date range, one set of row actions. Unrelated buttons sitting near each other are a toolbar, not a group, and get normal gaps.',
    notes: [
      'Two shapes and no third. A tinted track with a white active pill means "pick one of these"; a bordered strip with dividers means "these do different things". Mixing them makes a set of actions look like a choice.',
      'A group where only one can be active is a radio group, not a row of buttons. role="radiogroup", role="radio", aria-checked, arrow keys and a roving tabindex — otherwise the keyboard tabs through every option one at a time and nothing announces which is chosen.',
      'Never wrap a group in overflow-hidden to round its corners. It clips the focus ring off the first and last buttons. Round the end buttons instead.',
      'A group is one object, so it never wraps. Below sm it becomes a select or a menu, not two rows of joined buttons with the join broken.',
      'The divider between attached buttons is a single border-l on every button but the first. Putting a border on all four sides doubles every internal rule to 2px.',
      'Members declare their height with h-*, matching the button component. A strip whose members size themselves from padding ends up 2px out of line with the icon-only button sitting next to it.'
    ],
    anatomy: [
      ['Track', 'For a choice: rounded-lg bg-zinc-200 with p-0.5, so the active pill has somewhere to sit.'],
      ['Active pill', 'bg-white with a shadow, inside the track. White against the tint is what reads as chosen — a darker tint does not.'],
      ['Strip', 'For actions: an inline-flex with a single border-zinc-200 around the outside and border-l between.'],
      ['Divider', 'border-l on every button except the first. One border, not two.'],
      ['End radii', 'Applied to the first and last buttons rather than clipping the container, so focus rings survive.'],
      ['Chevron', 'On a split button, the second half. It opens the menu; the first half does the action without opening anything.']
    ],
    behaviour: [
      'A single-choice group behaves as one Tab stop: Tab enters it, arrow keys move within it, Tab leaves it.',
      'Arrow keys wrap around at both ends, so Left from the first option lands on the last.',
      'Choosing an option applies it immediately. A group with an Apply button beside it is a form, not a group.',
      'A split button\'s main half acts and its chevron half opens; clicking the main half never opens the menu.',
      'Below sm a group of more than three collapses to a select, because a fourth joined button either wraps or scrolls.',
      'Disabled members keep their place in the strip. Removing one on the fly changes which buttons are on the ends and reshapes the whole group.'
    ],
    a11y: [
      'Single choice is role="radiogroup" with role="radio" and aria-checked on each option, plus a roving tabindex so the group is one stop.',
      'The group carries an aria-label naming what is being chosen — "Date range", not "Options".',
      'A group of independent toggles is role="group" with aria-pressed on each, which is a different thing from a radiogroup and must not be confused with it.',
      'Icon-only members each carry aria-label; the group label does not name them.',
      'A split button\'s chevron has its own aria-label and aria-expanded, because "Approve" is already taken by the half beside it.',
      'The focus ring is never clipped — this is why the container is not overflow-hidden.'
    ],
    related: ['button', 'dropdown', 'tabs'],
    variants: [
      { id: 'segmented', name: 'Choosing one of a set', code:
`<!-- A real radiogroup: one Tab stop, arrows to move, aria-checked to announce.
     The roving tabindex is what makes it one stop — every unchecked option is
     tabindex="-1", so Tab skips straight past them.

     The track is bg-zinc-200 and the active pill is white. White on a tint is
     what reads as chosen; a darker tint on a lighter tint does not, and it
     leaves the unchosen options looking disabled. -->
<div role="radiogroup" aria-label="Date range" x-ref="grp"
     x-data="{
       v: 'Week',
       opts: ['Day', 'Week', 'Month', 'Quarter'],
       move(step) {
         const i = (this.opts.indexOf(this.v) + step + this.opts.length) % this.opts.length;
         this.v = this.opts[i];
         this.$nextTick(() => this.$refs.grp.querySelector('[aria-checked=true]').focus());
       }
     }"
     @keydown.arrow-right.prevent="move(1)" @keydown.arrow-left.prevent="move(-1)"
     class="inline-flex rounded-lg bg-zinc-200 p-0.5">
  <template x-for="o in opts" :key="o">
    <button type="button" role="radio" :aria-checked="v === o" :tabindex="v === o ? 0 : -1"
            @click="v = o"
            class="inline-flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium transition"
            :class="v === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      <span x-text="o"></span>
    </button>
  </template>
</div>` },

      { id: 'attached', name: 'Actions that belong together', code:
`<!-- A bordered strip, which says "these do different things" — the opposite of
     the tinted track above. One border around the outside, border-l between,
     and the radii on the end buttons rather than overflow-hidden on the
     container, so the focus ring is not clipped off either end. -->
<div class="inline-flex rounded-lg border border-zinc-300 bg-white">
  <button type="button" class="inline-flex h-8 items-center gap-2 rounded-l-lg px-3 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="pencil" class="size-4 text-zinc-600"></i>Edit
  </button>
  <button type="button" class="inline-flex h-8 items-center gap-2 border-l border-zinc-200 px-3 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="copy" class="size-4 text-zinc-600"></i>Duplicate
  </button>
  <button type="button" class="inline-flex h-8 items-center gap-2 rounded-r-lg border-l border-zinc-200 px-3 text-[13px]/5 font-medium text-red-600 hover:bg-red-50">
    <i data-lucide="trash-2" class="size-4"></i>Delete
  </button>
</div>` },

      { id: 'icon-toolbar', name: 'Icon-only strip', code:
`<!-- Table density and column controls. Square buttons so the hit area is
     square, each with its own aria-label — the group label does not name the
     members, so "Toolbar" on the wrapper would leave three unnamed buttons.

     The pressed one is aria-pressed, not aria-checked: these are independent
     toggles, and only the density one is a choice. -->
<div class="flex flex-wrap items-center gap-3">
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
       @keydown.arrow-right.prevent="move(1)" @keydown.arrow-left.prevent="move(-1)"
       class="inline-flex rounded-lg bg-zinc-200 p-0.5">
    <button type="button" role="radio" :aria-checked="v === 'compact'" :tabindex="v === 'compact' ? 0 : -1"
            @click="v = 'compact'" aria-label="Compact rows"
            class="flex size-8 items-center justify-center rounded-md transition"
            :class="v === 'compact' ? 'bg-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      <i data-lucide="align-justify" class="size-4"></i>
    </button>
    <button type="button" role="radio" :aria-checked="v === 'comfortable'" :tabindex="v === 'comfortable' ? 0 : -1"
            @click="v = 'comfortable'" aria-label="Comfortable rows"
            class="flex size-8 items-center justify-center rounded-md transition"
            :class="v === 'comfortable' ? 'bg-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
      <i data-lucide="menu" class="size-4"></i>
    </button>
  </div>

  <div role="group" aria-label="Table view" class="inline-flex rounded-lg border border-zinc-200 bg-white">
    <button type="button" aria-label="Freeze first column" aria-pressed="true"
            class="flex size-8 items-center justify-center rounded-l-lg bg-zinc-200 hover:bg-zinc-300">
      <i data-lucide="pin" class="size-4"></i>
    </button>
    <button type="button" aria-label="Show totals row" aria-pressed="false"
            class="flex size-8 items-center justify-center border-l border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
      <i data-lucide="sigma" class="size-4"></i>
    </button>
    <button type="button" aria-label="Wrap long text" aria-pressed="false"
            class="flex size-8 items-center justify-center rounded-r-lg border-l border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
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
     half that opens something. The divider is border-zinc-600, one step
     lighter than the fill, because a zinc-200 rule on a dark button reads as a
     crack rather than a join. -->
<div class="relative inline-flex" x-data="{ open: false }"
     @click.outside="open = false" @keydown.escape.window="open = false">
  <button type="button" class="inline-flex h-9 items-center rounded-l-lg bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
    Approve
  </button>
  <button type="button" @click.stop="open = !open"
          aria-label="More approval options" :aria-expanded="open" aria-haspopup="menu"
          class="inline-flex h-9 items-center rounded-r-lg border-l border-zinc-600 bg-zinc-700 px-2 text-white hover:bg-zinc-800">
    <i data-lucide="chevron-down" class="size-4"></i>
  </button>

  <div x-show="open" x-cloak @click.stop role="menu"
       class="absolute top-full right-0 z-40 mt-1 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
      <i data-lucide="check-check" class="size-4 text-zinc-600"></i>Approve and close
    </button>
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
      <i data-lucide="user-round-plus" class="size-4 text-zinc-600"></i>Approve and forward
    </button>
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 border-t border-zinc-200 px-3 py-2 text-left text-[13px]/5 text-red-600 hover:bg-red-50">
      <i data-lucide="circle-x" class="size-4"></i>Reject
    </button>
  </div>
</div>` },

      { id: 'input', name: 'Attached to an input', code:
`<!-- The border lives on the wrapper, not on the input, so there is one rule
     around the pair instead of two abutting ones. The input is transparent and
     borderless inside it, and focus-within moves the ring to the wrapper — put
     it on the input and the ring is drawn inside the border it shares. -->
<div class="flex max-w-md items-stretch rounded-lg border border-zinc-300 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
  <label for="add-part" class="sr-only">Part number</label>
  <input id="add-part" type="text" placeholder="Part number"
         class="w-full min-w-0 rounded-l-lg bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
  <button type="button" class="inline-flex shrink-0 items-center gap-2 rounded-r-lg border-l border-zinc-200 px-3 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="plus" class="size-4 text-zinc-600"></i>Add line
  </button>
</div>` },

      { id: 'vertical', name: 'Stacked', code:
`<!-- For a narrow column where a horizontal strip would not fit. Same rules
     rotated: one border outside, border-t between, radii on the ends. Buttons
     are left-aligned rather than centred, so the labels form a reading column
     the way a menu does. -->
<div role="group" aria-label="Record actions" class="inline-flex w-56 flex-col rounded-lg border border-zinc-300 bg-white">
  <button type="button" class="flex h-9 items-center gap-2.5 rounded-t-lg px-3 text-left text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="file-check-2" class="size-4 text-zinc-600"></i>Record GRN
  </button>
  <button type="button" class="flex h-9 items-center gap-2.5 border-t border-zinc-200 px-3 text-left text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="receipt" class="size-4 text-zinc-600"></i>Attach invoice
  </button>
  <button type="button" class="flex h-9 items-center gap-2.5 border-t border-zinc-200 px-3 text-left text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="history" class="size-4 text-zinc-600"></i>Amendment history
  </button>
  <button type="button" class="flex h-9 items-center gap-2.5 rounded-b-lg border-t border-zinc-200 px-3 text-left text-[13px]/5 font-medium text-red-600 hover:bg-red-50">
    <i data-lucide="circle-x" class="size-4"></i>Cancel order
  </button>
</div>` },

      { id: 'responsive', name: 'On a phone', code:
`<!-- Four joined buttons do not fit a 390px screen, and a group that wraps has
     stopped being one object — the join breaks and two of the four end up with
     the wrong radii. Below sm it is a select instead, which is one tap and
     costs no width at all.

     The two share one x-data, so whichever the user touches, both agree. -->
<div x-data="{
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
          class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium focus:border-zinc-700 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15 sm:hidden">
    <template x-for="o in opts" :key="o"><option :value="o" x-text="o"></option></template>
  </select>

  <div role="radiogroup" aria-label="Date range" x-ref="grp"
       @keydown.arrow-right.prevent="move(1)" @keydown.arrow-left.prevent="move(-1)"
       class="hidden rounded-lg bg-zinc-200 p-0.5 sm:inline-flex">
    <template x-for="o in opts" :key="o">
      <button type="button" role="radio" :aria-checked="v === o" :tabindex="v === o ? 0 : -1" @click="v = o"
              class="inline-flex h-8 items-center rounded-md px-3 text-[13px]/5 font-medium transition"
              :class="v === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'">
        <span x-text="o"></span>
      </button>
    </template>
  </div>
</div>` },

      { id: 'django', name: 'Django filter group', code:
`<!-- A GET form, so the chosen range ends up in the querystring and the page is
     linkable and bookmarkable. Real radio inputs do the work — no JavaScript,
     no roving tabindex to maintain, and the browser gives arrow keys and the
     radiogroup semantics for free.

     The input is sr-only rather than hidden, because display:none takes it out
     of the tab order and off the keyboard entirely. peer-checked styles the
     label that follows it; peer-focus-visible puts the focus ring there too,
     since the input itself cannot be seen.

     # views.py
     rng = request.GET.get('range', 'week')   # 'day' | 'week' | 'month' -->
<form method="get" class="inline-flex rounded-lg bg-zinc-200 p-0.5">
  {% for value, label in ranges %}
    <div>
      <input type="radio" name="range" id="range-{{ value }}" value="{{ value }}"
             {% if value == selected %}checked{% endif %}
             onchange="this.form.submit()" class="peer sr-only">
      <label for="range-{{ value }}"
             class="block rounded-md px-3 py-1.5 text-[13px]/5 font-medium text-zinc-600 transition hover:text-zinc-900 peer-checked:bg-white peer-checked:text-zinc-900 peer-checked:shadow-sm peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
        {{ label }}
      </label>
    </div>
  {% endfor %}
</form>` }
    ]
  },

  {
    id: 'dropdown', name: 'Dropdown menu', category: 'actions',
    description: 'A menu of actions anchored to a trigger. Real focus walks the items one tabindex="-1" at a time; destructive items sit last, below a divider.',
    when: 'Row actions, export options, view settings, account menus — the second to seventh thing you can do to the record on screen, where only the first belongs on the page as a button. More than about seven items means you want a page with a search box, not a longer menu. If it has a text box in it, it is a combobox or a command palette and the keyboard model is the other one.',
    notes: [
      '@click.outside on the root closes the panel, so no document-level handler and no global store is needed to keep one menu open at a time. It fires on a click anywhere else, including on another menu\'s trigger, which is what opens that one and closes this one in the same gesture.',
      'Roving focus is the whole model. Real focus moves from item to item, every item is tabindex="-1", and items() reads the buttons out of the DOM on every keystroke rather than off an array held in x-data. A permission check that drops Approve drops it from the keyboard order for free, and the separator is skipped without being special-cased because it is not a menuitem. Keep the list in JavaScript instead and it goes stale the first time the server renders a shorter menu, and the arrows start landing on an element that is no longer there.',
      'The item focus style is focus:, not focus-visible:. Focus here is moved by script, and a browser that has decided the last interaction was a mouse click will not paint a :focus-visible outline — which is precisely the case where somebody opens the menu with the pointer and then reaches for the arrow keys. The item takes a tint and an inset outline together rather than outline-none plus a tint: a panel with overflow-hidden clips a positive offset, and in forced-colours mode the tint is dropped and the outline is the only thing left.',
      'Only a command item closes the menu. A menuitemcheckbox or a menuitemradio is a setting, and people set more than one of them in a visit — a column picker that closes on the first tick makes the user reopen it four times to hide four columns. A command closes and hands focus back to the trigger; a setting stays open and Escape is what ends the session. Both mistakes are visible within a minute of use, and in opposite directions.',
      'role="menu" has a fixed list of permitted children: menuitem, menuitemcheckbox, menuitemradio, group and separator. A native <input type="checkbox"> is not on it, and neither is the avatar-and-email block at the top of an account menu. There are two legitimate ways out and the choice is a real one: keep role="menu" and use menuitemcheckbox with a bound aria-checked, which is what the checkbox variant does and which keeps the arrow-key model; or drop role="menu" for role="group" and use real inputs with real labels, which is what the data table\'s column picker does and which buys native Tab order and form participation instead. What is not allowed is inputs inside a role="menu", because the role tells the screen reader to expect one thing and the DOM hands it another.',
      'Alpine keeps aria-checked, aria-expanded, aria-pressed and aria-selected on the element when they bind to false and removes every other aria-* attribute that does. So :aria-checked="cols.dept" renders aria-checked="false" rather than vanishing, which is exactly what a menuitemcheckbox needs — an unchecked item with no aria-checked at all is announced as an ordinary menu item, and the user is never told the row is a toggle.',
      'A disabled item takes aria-disabled="true" and keeps its tabindex="-1". The disabled attribute takes it out of the roving walk entirely, so the arrows skip straight past the one item the user came for and nothing ever explains why it is not available. Put the reason on the item, in the item — "Already approved on 16 Aug 2026" under the label — because a tooltip on something you cannot hover on a phone is not an explanation.',
      'The destructive item hands off to an alert dialog, and the order of the handoff is load-bearing: close the menu with focus going back to the trigger first, then set the dialog open. x-trap captures document.activeElement at the moment it activates and restores it on close, so if the dialog opens while focus is still on a menu item that x-show is about to hide, the trap memorises a node that is no longer focusable and Cancel drops the user on <body> at the top of the document.',
      'A submenu needs a delay in both directions and a check on what has focus. Opening on the first pixel of hover means every pass down the menu flashes a panel; closing on the first pixel of hover-out means the diagonal path from the trigger to the panel closes the thing you are travelling to. 120ms in, about 220ms out, and the close is abandoned if the submenu contains document.activeElement — otherwise a keyboard user who has arrowed into the submenu loses it, and their focus with it, the moment the pointer drifts.',
      'Decide which side a submenu opens on by measuring the trigger, never the panel. The panel is display:none until it opens, so getBoundingClientRect on it returns zeros and the test always concludes there is room on the right. Measure the trigger\'s rect, add the panel width you wrote in the class, and compare against innerWidth — and do it before setting open, so the panel is painted on the correct side rather than jumping there a frame later.',
      'Below sm a flyout submenu has nowhere to go. A 208px panel hanging off a 208px panel needs 416px and a phone gives you 390, so the flip that saves you at a desktop right edge only moves the overflow to the left edge. The answer is not a narrower panel, it is a different shape: static and full width inside the parent, indented, on a tinted surface — a drill-down. One set of markup does both, because the positioning is all sm:-prefixed.',
      'Shortcut hints are aria-hidden and the real shortcut goes in aria-keyshortcuts. Glyphs are the reason: VoiceOver reads ⌘ as "place of interest sign" and ⇧ as "upwards white arrow", so the accessible name of Print becomes a small poem. The menu also must not listen for those keys — they are the application\'s global bindings, registered once at window level, and a menu that binds them too fires the action twice whenever it happens to be open.'
    ],
    anatomy: [
      ['Trigger', 'A button carrying a chevron, which is the only signal that anything is hidden behind it, plus aria-haspopup="menu" and a bound aria-expanded. In a table it is an icon and then it needs a name of its own: twelve buttons all called More say nothing about which row the cursor is on.'],
      ['Panel', 'Absolutely positioned, z-40, opening below the trigger and aligned to the edge it has room on — left-0 for a toolbar button, right-0 for a row action or anything else near the right edge. overflow-hidden unless a submenu has to escape it.'],
      ['Item', 'A full-width button with the icon left of the label, so the labels form a single reading column. A shortcut hint or a chevron goes on the right with ml-auto, aria-hidden, and the real shortcut in aria-keyshortcuts.'],
      ['Group label', 'An 11px uppercase line inside a role="group", aria-hidden because the group is already named by aria-label and a bare paragraph is not a permitted child of a menu. A labelled group needs no rule as well — the label is the boundary, and drawing both is two separators for one edge.'],
      ['Separator', 'Its own <div role="separator" class="my-1 h-px bg-zinc-100">, full bleed inside the panel padding. Not a border-t on the item below it: that rule belongs to the item, so it follows it to the top of the panel when whatever sat above is hidden.'],
      ['Checked item', 'role="menuitemcheckbox" or role="menuitemradio" with :aria-checked, and a size-4 slot on the left that either holds a check or is empty. The slot is always there, so the labels do not shift sideways as things are ticked.'],
      ['Submenu', 'A second role="menu" inside a relative wrapper, flying out left or right at sm and up according to a measurement of the trigger, and folding into an indented drill-down below it. Its own arrow-key scope, entered with Right and left with Left.'],
      ['Destructive item', 'Last, below the divider, in red-600 — never adjacent to an item someone reaches for often — and it opens an alert dialog rather than doing the thing.']
    ],
    behaviour: [
      'Clicking the trigger toggles the panel and clicking outside closes it. Down or Up on the trigger also opens it, landing on the first or the last item, so the menu can be reached without a pointer at all.',
      'Escape closes the panel and returns focus to the trigger. Inside a submenu it closes the submenu only and lands back on its trigger, which is why that handler stops propagation.',
      'Choosing a command closes the menu and hands focus back to the trigger — a menu that stays open after a choice reads as though the click was missed, and one that closes onto nothing loses the keyboard its place.',
      'Choosing a setting does not close the menu. Column visibility, sort order and density are all set in runs, and Escape is the end of the run.',
      'Down and Up wrap at both ends, Home and End jump to them, and Tab closes the menu without swallowing the tab, so focus carries on into the page from the trigger.',
      'A submenu opens on Right, Enter or a deliberate hover, and closes on Left, Escape or the pointer leaving for long enough — unless the keyboard is inside it, in which case hover-out does nothing at all.',
      'Only one menu is open at a time. @click.outside handles this without a global store.',
      'A destructive item never acts on the click. It closes the menu, returns focus to the trigger and opens an alert dialog naming the record, so the confirm has somewhere to hand focus back to.',
      'Past about seven items this is the wrong control; the answer is a page with search, not a longer menu.'
    ],
    a11y: [
      'The trigger carries aria-haspopup="menu" and aria-expanded bound to the open state. An icon-only trigger in a register carries aria-label naming the record it acts on.',
      'The panel is role="menu" and each item role="menuitem", role="menuitemcheckbox" or role="menuitemradio". Sections are role="group" with aria-label, and the visible group heading is aria-hidden because it is already the group\'s name and a paragraph is not a permitted child of a menu.',
      'Down and Up move between items and wrap, Home and End jump to the ends, Escape closes and Tab closes without swallowing the tab. The separator is skipped because the walk queries [role=menuitem] rather than stepping through child elements, so it never lands on a line.',
      'Focus is real focus, moved item to item with tabindex="-1" on each. This is where a menu and a combobox part company: a combobox keeps focus in its text box and points at a row with aria-activedescendant, but a menuitem is the thing being operated, so it has to be the thing focused. Down on the trigger opens onto the first item, Up onto the last, and Escape or a choice returns focus to the trigger. Clicking outside closes without moving focus, because the user has already put it somewhere else.',
      'A checkable item carries aria-checked in both states. Bound with :aria-checked it survives being false, because Alpine keeps that attribute rather than removing it — and an unchecked item with the attribute missing is announced as a plain command.',
      'A submenu trigger carries aria-haspopup="menu" and its own aria-expanded, and the submenu is a role="menu" of its own with its own arrow scope. Right opens it onto the first item, Left and Escape close it back onto the trigger.',
      'An unavailable item is aria-disabled="true" and stays in the walk. The disabled attribute would remove it from the keyboard order, so the arrows would skip the item the user is hunting for and nothing would say why it is gone; the reason is written on the item itself.',
      'The destructive item is distinguished by its label as well as its colour, since colour alone is not a signal, and the shortcut hints beside items are aria-hidden with the machine-readable form in aria-keyshortcuts.'
    ],
    related: ['button', 'command-palette', 'separator'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- The divider is its own element, not a border-t on the Delete button.
     Hung off the button it belongs to the button, so an item above it that is
     hidden by a permission check takes the rule to the top of the panel where
     it introduces nothing. As its own element it drops out with the same
     {% if %} as the item it introduces.

     zinc-100, not zinc-200: the panel edge is the zinc-200, and a rule inside
     an already bordered surface is a step lighter. role="separator" is real
     here because the panel is a role="menu" and a menu is a list of peers.

     A menu moves real focus between its items, one tabindex="-1" at a time.
     That is the opposite of the combobox next door, which keeps focus in the
     text box and points at a row with aria-activedescendant, and the two are
     not interchangeable: a menuitem is the thing being operated, so it has to
     be the thing focused. items() reads the buttons out of the DOM on every
     keystroke rather than off a list, so a permission check that drops an item
     drops it from the keyboard order too, and the separator is skipped for
     free because it is not a menuitem. The focused item takes a tint and an
     inset outline rather than outline-none plus a tint: the panel is
     overflow-hidden so a positive offset would be clipped, and in forced
     colours the tint is dropped and the outline is all that is left.

     The opening focus is moved on the next animation frame, not in $nextTick.
     x-show has not written display yet when $nextTick runs: measured, the panel
     was still display none with offsetHeight 0 inside the callback, and
     focus() on a hidden button is a silent no-op that leaves the caret on the
     trigger. It only shows up when the trigger already had focus, because
     otherwise there is nothing to notice: a menu that opens with focus still
     outside it is a menu the arrow keys do not drive. -->
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
          class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="download" class="size-4"></i>Export
    <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>
  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Export options"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute left-0 z-40 mt-1 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
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

     The vendor column goes below sm rather than being scrolled to. Two figures
     and a menu is what fits at 390px, and hiding a column somebody can still
     reach on the record page is better than a table that moves sideways. -->
<div x-data="{
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
                      class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <i data-lucide="more-horizontal" class="size-4"></i>
              </button>

              <div x-show="open" x-cloak x-ref="menu" role="menu" :aria-label="'Actions for ' + r.po"
                   @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
                   @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
                   @keydown.tab="close(false)"
                   class="absolute top-full right-0 z-40 mt-1 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 text-left shadow-lg">
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
     not a name. -->
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
          class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    Actions
    <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Actions on PO-24-1187"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute left-0 z-40 mt-1 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

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
     confirmation that anything happened at all.

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

     The tick slot is a size-4 span that is always present and sometimes empty,
     so the labels do not shift sideways as columns come and go. x-cloak sits on
     every tick, including the ones that start ticked: before Alpine boots,
     x-show has not run and all five would paint at once. -->
<div x-data="{
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
            class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
      <i data-lucide="columns-3" class="size-4 text-zinc-600"></i>Columns
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </button>

    <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Columns shown in the order register"
         @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
         @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
         @keydown.tab="close(false)"
         class="absolute left-0 z-40 mt-1 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

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

     Like the checkbox variant, choosing does not close. These are view
     settings and they are set in runs — sort, then density, then look at the
     result. The trigger label carries the current sort so the setting is
     legible with the menu shut; a settings menu whose trigger says only Sort
     forces it open again to find out what is in force.

     A radio item is not a toggle: clicking the one already chosen sets it to
     itself, it does not clear it. There is no "unsorted" here, so there is
     nothing for a second click to mean, and offering one would just be a way
     to leave the register in a state it cannot render. -->
<div class="relative"
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
          class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="arrow-down-wide-narrow" class="size-4 text-zinc-600"></i>
    <span>Sorted by <span x-text="labels[sort]">Order date</span></span>
    <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Register view"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute left-0 z-40 mt-1 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

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

     Do not label a shortcut nobody has bound yet. A menu is the only place
     most people will ever read them, so a hint here is a promise the window
     handler has to keep. -->
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
          class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="file-text" class="size-4"></i>PO-24-1187
    <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Actions on PO-24-1187"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute left-0 z-40 mt-1 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

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
     indented, on a zinc-100 surface — a drill-down inside the parent panel.
     All the flyout positioning is sm:-prefixed, so one set of markup is both.

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
     Left or Escape steps back out onto the trigger, and its arrow handlers stop
     propagation so the parent does not act on the same key.

     $event.detail === 0 is how a click from Enter is told from a click from the
     mouse. Enter should open the submenu and land on its first item; a real
     click should open it and leave the pointer in charge. Both arrive as click,
     and detail is the click count, which is 0 for a synthesised one. -->
<div class="flex justify-end">
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
            class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
      <i data-lucide="download" class="size-4"></i>Export
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </button>

    <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Export the order register"
         @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
         @keydown.tab="close(false)"
         class="absolute right-0 z-40 mt-1 w-52 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

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
             @keydown.arrow-left.prevent.stop="closeSub(true)"
             @keydown.escape.stop="closeSub(true)"
             @keydown.tab="close(false)"
             :class="flip ? 'sm:right-full sm:mr-1' : 'sm:left-full sm:ml-1'"
             class="mt-1 w-full rounded-lg bg-zinc-100 py-1 sm:absolute sm:top-0 sm:z-50 sm:mt-0 sm:w-52 sm:rounded-xl sm:border sm:border-zinc-200 sm:bg-white sm:shadow-lg">
          <button type="button" role="menuitem" tabindex="-1" @click="close()"
                  class="flex w-full items-center gap-2.5 py-2 pr-3 pl-9 text-left text-[13px]/5 hover:bg-zinc-200 focus:bg-zinc-200 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:pl-3 sm:hover:bg-zinc-100 sm:focus:bg-zinc-100">
            <i data-lucide="user" class="size-4 text-zinc-600"></i>Ritu Deshpande
          </button>
          <button type="button" role="menuitem" tabindex="-1" @click="close()"
                  class="flex w-full items-center gap-2.5 py-2 pr-3 pl-9 text-left text-[13px]/5 hover:bg-zinc-200 focus:bg-zinc-200 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:pl-3 sm:hover:bg-zinc-100 sm:focus:bg-zinc-100">
            <i data-lucide="building-2" class="size-4 text-zinc-600"></i>Vendor contact
          </button>
          <button type="button" role="menuitem" tabindex="-1" @click="close()"
                  class="flex w-full items-center gap-2.5 py-2 pr-3 pl-9 text-left text-[13px]/5 hover:bg-zinc-200 focus:bg-zinc-200 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700 sm:pl-3 sm:hover:bg-zinc-100 sm:focus:bg-zinc-100">
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
     not stop the click either, so the handler has to return early itself.

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
<div class="relative"
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
          class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    Actions
    <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>

  <div x-show="open" x-cloak x-ref="menu" role="menu" aria-label="Actions on PO-24-1187"
       @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
       @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
       @keydown.tab="close(false)"
       class="absolute left-0 z-40 mt-1 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

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
         class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-lg">
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
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Keep the order</button>
        <button type="button" @click="confirm = false"
                class="rounded-lg bg-red-600 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-red-700">Cancel order</button>
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
<div class="flex justify-end">
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
            class="flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[12px]/4 font-medium text-white">RD</span>
      <span class="text-[13px]/5 font-medium">Ritu Deshpande</span>
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </button>

    <div x-show="open" x-cloak
         @keydown.arrow-down.prevent="move(1)" @keydown.arrow-up.prevent="move(-1)"
         @keydown.home.prevent="edge(false)" @keydown.end.prevent="edge(true)"
         @keydown.tab="close(false)"
         class="absolute right-0 z-40 mt-1 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">

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
</div>` }
    ]
  },

  /* ── FORMS ──────────────────────────────────────────────────────────────── */
);
