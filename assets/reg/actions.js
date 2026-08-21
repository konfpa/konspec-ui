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
<div class="max-w-md rounded-xl border border-zinc-200 bg-white p-5">
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
<div class="rounded-xl border border-zinc-200 bg-white px-5 py-4">
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
<form method="post" class="max-w-md rounded-xl border border-zinc-200 bg-white p-5">
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
<div class="inline-flex rounded-lg border border-zinc-200 bg-white">
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
<div class="flex max-w-md items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
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
<div role="group" aria-label="Record actions" class="inline-flex w-56 flex-col rounded-lg border border-zinc-200 bg-white">
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
    description: 'A menu of actions anchored to a trigger. Destructive items sit last, below a divider.',
    when: 'Row actions, export options, account menus. More than about seven items means you want a page, not a menu.',
    notes: ['@click.outside on the root closes the panel, so no document-level handler and no global store is needed to keep one menu open at a time. It fires on a click anywhere else, including on another menu\'s trigger, which is what opens that one and closes this one in the same gesture.'],
    anatomy: [
      ['Trigger', 'A button carrying a chevron, which is the only signal that anything is hidden behind it.'],
      ['Panel', 'Absolutely positioned, z-40, opening below and aligned to the trigger\'s edge.'],
      ['Item', 'A full-width button with the icon left of the label, so the labels form a single reading column.'],
      ['Divider', 'Its own <div role="separator" class="my-1 h-px bg-zinc-100">, full bleed inside the panel padding. Not a border-t on the item below it: that rule belongs to the item, so it follows it to the top of the panel when whatever sat above is hidden.'],
      ['Destructive item', 'Last, below the divider, in red-600 — never adjacent to an item someone reaches for often.']
    ],
    behaviour: [
      'Clicking the trigger toggles the panel and clicking outside closes it. Down or Up on the trigger also opens it, landing on the first or the last item, so the menu can be reached without a pointer at all.',
      'Escape closes the panel and returns focus to the trigger.',
      'Choosing an item closes the menu and hands focus back to the trigger — a menu that stays open after a choice reads as though the click was missed, and one that closes onto nothing loses the keyboard its place.',
      'Only one menu is open at a time. @click.outside handles this without a global store.',
      'Past about seven items this is the wrong control; the answer is a page with search, not a longer menu.'
    ],
    a11y: [
      'The trigger carries aria-haspopup="menu" and aria-expanded bound to the open state.',
      'The panel is role="menu" and each item role="menuitem".',
      'Down and Up move between items and wrap, Home and End jump to the ends, Escape closes and Tab closes without swallowing the tab. The separator is skipped because the walk queries [role=menuitem] rather than stepping through child elements, so it never lands on a line.',
      'Focus is real focus, moved item to item with tabindex="-1" on each. This is where a menu and a combobox part company: a combobox keeps focus in its text box and points at a row with aria-activedescendant, but a menuitem is the thing being operated, so it has to be the thing focused. Down on the trigger opens onto the first item, Up onto the last, and Escape or a choice returns focus to the trigger. Clicking outside closes without moving focus, because the user has already put it somewhere else.',
      'The destructive item is distinguished by its label as well as its colour, since colour alone is not a signal.'
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
</div>` }
    ]
  },

  /* ── FORMS ──────────────────────────────────────────────────────────────── */
);
