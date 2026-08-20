register(
  {
    id: 'alert', name: 'Alert', category: 'feedback',
    description: 'An inline notice about the page or the record in front of the user. White card, zinc border, and the only colour is the icon.',
    when: 'A message that belongs to the page and should stay until it is read or dismissed. For a transient confirmation of something the user just did, use a toast.',
    notes: [
      'Do not tint the alert body. bg-red-50 / bg-amber-50 panels shout against the graphite theme — the icon carries the severity on its own.',
      'An alert with no action is just noise. If there is nothing to do about it, put the text where it belongs instead.',
      'Errors coming back from a form belong on the field. A page-level alert may summarise them and link to each field, but it never replaces the field-level message.',
      'The page banner is graphite, never red. It is an emphasis surface, not a severity — a full-bleed red bar reads as an outage even when the message is routine.',
      'role="alert" on markup already in the DOM at page load announces nothing. Put it on alerts that appear in response to an action, and leave it off static page notices.',
      'Never stack more than two alerts above a page. Past that nobody reads any of them — collapse the rest into one alert that links to a list.',
      'Dismiss is browser state only. The alert comes back on the next request unless the server was told about it.'
    ],
    anatomy: [
      ['Icon', 'The only colour in the component, and the whole severity signal. size-4, shrink-0, mt-0.5 so it sits on the first line of text.'],
      ['Title', 'One sentence stating the fact, in sentence case. No "Error:" prefix — the icon already said that.'],
      ['Detail', 'Optional second line: the consequence, the deadline, or who to talk to. text-[12px]/4 text-zinc-600.'],
      ['Action', 'Optional, and at most one. The single thing to do about the message. shrink-0 so it never compresses.'],
      ['Dismiss', 'Optional, and only for alerts that are safe to lose. A 28px icon button on the right with aria-label="Dismiss".']
    ],
    behaviour: [
      'Alerts stack in one region at the top of the content column, newest first, separated by 8px.',
      'The text block flexes and wraps; the icon and the action are shrink-0 and never compress.',
      'The action wraps below the text on narrow screens — the row is flex-wrap and the text block carries a min-width for that reason.',
      'Dismissing hides the alert in the browser. Nothing is sent to the server, so a dismissal that must survive a reload has to be recorded there.',
      'A page banner sits outside the content column, above the application header, and spans the full viewport.',
      'A form error summary takes focus when it renders so the keyboard is already at the problem.'
    ],
    a11y: [
      'Error and warning alerts that appear in response to an action carry role="alert" so they are announced.',
      'The icon is decorative and carries no label — the sentence alone says what happened and how bad it is.',
      'Colour is never the only signal. The wording states the severity as well, for the 8% of men who will not see the difference between the amber and the red icon.',
      'The dismiss button has aria-label="Dismiss" because its only content is an icon.',
      'The form error summary is focusable with tabindex="-1", and every entry links to its field id so the keyboard lands on the input, not near it.'
    ],
    related: ['toast', 'alert-dialog', 'badge'],
    variants: [
      { id: 'tags', name: 'Four severities', code:
`<div class="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
  <i data-lucide="info" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">Rate contract with Sharma Extrusions expires on 30 Sep 2024.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Orders raised after that date will price at the spot rate.</p>
  </div>
</div>

<div class="mt-2 flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
  <i data-lucide="check-circle-2" class="mt-0.5 size-4 shrink-0 text-emerald-600"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">PO-24-1187 emailed to Sharma Extrusions.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Sent by Ritu Deshpande, 19 Aug 2024 at 11:42.</p>
  </div>
</div>

<div class="mt-2 flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
  <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">GRN pending for 3 orders older than 30 days.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Nashik Steel Traders, Gujarat Polymers Ltd, Sharma Extrusions.</p>
  </div>
</div>

<div class="mt-2 flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3" role="alert">
  <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">Order value <span class="tabular-nums">₹18,42,000</span> exceeds your approval limit.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Anything above ₹10,00,000 goes to the plant head.</p>
  </div>
</div>` },

      { id: 'compact', name: 'Compact', code:
`<!-- One line, 32px tall. For a table toolbar or a card header, where a
     three-line alert would push the data below the fold. -->
<div class="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-3 py-2">
  <i data-lucide="alert-triangle" class="size-3.5 shrink-0 text-amber-700"></i>
  <p class="min-w-0 flex-1 truncate text-[12px]/4">Showing the first 200 of <span class="tabular-nums">1,438</span> matching rows.</p>
  <a href="#" class="shrink-0 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Narrow the filters</a>
</div>` },

      { id: 'dismissible', name: 'Dismissible', code:
`<div x-data="{ show: true }" x-show="show" x-cloak
     class="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
  <i data-lucide="info" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
  <div class="min-w-0 flex-1">
    <p class="text-[13px]/5 font-medium">Vendor bank details changed on 12 Aug 2024.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Payments to Nashik Steel Traders now go to HDFC ••4471.</p>
  </div>
  <button type="button" @click="show = false" aria-label="Dismiss"
          class="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
    <i data-lucide="x" class="size-4"></i>
  </button>
</div>` },

      { id: 'action', name: 'With action', code:
`<div class="flex flex-wrap items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
  <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
  <div class="min-w-[16rem] flex-1">
    <p class="text-[13px]/5 font-medium">PO-24-1163 has been waiting for approval for 9 days.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">
      Nashik Steel Traders · <span class="tabular-nums">₹4,26,500</span> ·
      <a href="#" class="text-zinc-900 underline underline-offset-2">open the order</a>
    </p>
  </div>
  <button type="button" class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">Remind approver</button>
</div>` },

      { id: 'records', name: 'With affected records', code:
`<!-- When the message is about a set of rows, name them. "4 invoices failed"
     with no list means someone has to go hunting for which four. -->
<div class="rounded-lg border border-zinc-200 bg-white px-4 py-3" role="alert">
  <div class="flex items-start gap-3">
    <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
    <div class="min-w-0">
      <p class="text-[13px]/5 font-medium">3 invoices could not be matched to a GRN.</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-600">They stay out of the payment run until a GRN is posted against each one.</p>
    </div>
  </div>
  <ul class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3 text-[12px]/4">
    <li class="flex items-center justify-between gap-4">
      <a href="#" class="truncate text-zinc-900 underline underline-offset-2">INV-8841 · Nashik Steel Traders</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹4,26,500</span>
    </li>
    <li class="flex items-center justify-between gap-4">
      <a href="#" class="truncate text-zinc-900 underline underline-offset-2">INV-8836 · Gujarat Polymers Ltd</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹1,18,240</span>
    </li>
    <li class="flex items-center justify-between gap-4">
      <a href="#" class="truncate text-zinc-900 underline underline-offset-2">INV-8829 · Sharma Extrusions</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹87,900</span>
    </li>
  </ul>
</div>` },

      { id: 'progress', name: 'In progress', code:
`<!-- A job the user started that outlives the request. Poll the bar with htmx:
     hx-get="/imports/8841/progress/" hx-trigger="every 2s" hx-swap="outerHTML". -->
<div class="rounded-lg border border-zinc-200 bg-white px-4 py-3">
  <div class="flex items-start gap-3">
    <i data-lucide="loader-2" class="mt-0.5 size-4 shrink-0 animate-spin text-zinc-500"></i>
    <div class="min-w-0 flex-1">
      <p class="text-[13px]/5 font-medium">Importing the August rate card.</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-600">1,240 of 3,100 rows · you can leave this page, it keeps running.</p>
    </div>
    <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">40%</span>
  </div>
  <div class="mt-3 h-1 overflow-hidden rounded-full bg-zinc-100">
    <div class="h-full rounded-full bg-zinc-700 transition-[width] duration-500" style="width: 40%"></div>
  </div>
</div>` },

      { id: 'banner', name: 'Page banner', code:
`<!-- Full-bleed, above the application header, outside the content column.
     Graphite — never red. A red bar across the top reads as an outage. -->
<div x-data="{ show: true }" x-show="show" x-cloak
     class="flex flex-wrap items-center gap-x-3 gap-y-1 bg-zinc-900 px-4 py-2.5 text-white sm:px-6">
  <i data-lucide="wrench" class="size-4 shrink-0 text-zinc-500"></i>
  <p class="min-w-[14rem] flex-1 text-[13px]/5">
    <span class="font-medium">Scheduled maintenance.</span>
    <span class="text-zinc-500">Purchase orders are read-only on Sun 24 Aug, 01:00–03:00 IST.</span>
  </p>
  <a href="#" class="shrink-0 text-[13px]/5 font-medium underline underline-offset-2">What changes</a>
  <button type="button" @click="show = false" aria-label="Dismiss"
          class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-white">
    <i data-lucide="x" class="size-4"></i>
  </button>
</div>` },

      { id: 'form-errors', name: 'Form error summary', code:
`<!-- {{ form.non_field_errors }} plus one line per field that has errors.
     It summarises; it does not replace the message under each input.
     x-init focuses it so the keyboard is already at the problem. -->
<div role="alert" tabindex="-1" x-data x-init="$el.focus()"
     class="rounded-lg border border-zinc-200 bg-white px-4 py-3 outline-none">
  <div class="flex items-start gap-3">
    <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
    <div class="min-w-0">
      <p class="text-[13px]/5 font-medium">This order was not saved — 3 fields need attention.</p>
      <ul class="mt-2 space-y-1 text-[12px]/4 text-zinc-600">
        <li>
          <a href="#id_vendor" class="font-medium text-zinc-900 underline underline-offset-2">Vendor</a>
          — select a vendor.
        </li>
        <li>
          <a href="#id_delivery_date" class="font-medium text-zinc-900 underline underline-offset-2">Delivery date</a>
          — cannot be before the order date.
        </li>
        <li>
          <a href="#id_quantity" class="font-medium text-zinc-900 underline underline-offset-2">Quantity</a>
          — enter a whole number greater than zero.
        </li>
      </ul>
    </div>
  </div>
</div>` },

      { id: 'django', name: 'Django messages block', code:
`<!-- {% if messages %}{% for message in messages %} … {% endfor %}{% endif %}
     Swap the icon and its colour on message.tags: success / warning / error,
     anything else falls through to the neutral info icon. Give error and
     warning role="alert"; success and info do not need it. -->
<div x-data="{ show: true }" x-show="show" x-cloak
     class="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
  <i data-lucide="check-circle-2" class="mt-0.5 size-4 shrink-0 text-emerald-600"></i>
  <p class="min-w-0 flex-1 text-[13px]/5 font-medium">GRN 1142 posted against PO-24-1187.</p>
  <button type="button" @click="show = false" aria-label="Dismiss"
          class="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
    <i data-lucide="x" class="size-4"></i>
  </button>
</div>` }
    ]
  },

  {
    id: 'toast', name: 'Toast', category: 'feedback',
    description: 'A short confirmation that something finished, pinned to the bottom-left and gone a few seconds later.',
    when: 'Saves, posts, exports — anything the user triggered and does not need to act on. Never put an error the user must read in a toast; it will disappear before they get to it.',
    notes: [
      'Auto-hide only works when the toast is dismissable and repeatable. If losing the message costs the user something, use an alert.',
      'Bottom-left keeps it clear of the right-hand drawer and the row action menus.',
      'A toast with an Undo action must not auto-hide faster than the undo window on the server.'
    ],
    anatomy: [
      ['Region', 'A fixed container at the bottom-left, clear of the right-hand drawer and the row action menus.'],
      ['Icon', 'The severity, at size-4. The same palette as an alert, for the same reason.'],
      ['Message', 'One line, past tense, naming what happened. "GRN 1142 posted", not "Success".'],
      ['Action', 'Optional, and almost always Undo. Anything else usually belongs in an alert instead.'],
      ['Dismiss', 'Always present, so a toast can be got rid of before its timer runs out.']
    ],
    behaviour: [
      'It appears after the action it reports, never before, and auto-hides a few seconds later.',
      'An error the user must read never goes in a toast — it will disappear before they reach it. That is an alert.',
      'A toast carrying Undo must not auto-hide sooner than the server\'s undo window, or the offer expires while it is still on screen.',
      'Toasts stack upward, newest at the bottom, and older ones are pushed rather than replaced.',
      'Hovering a toast pauses its timer, because a user reading it is not a user ignoring it.'
    ],
    a11y: [
      'The region is aria-live="polite" so a new toast is announced without interrupting.',
      'An error toast — if one is unavoidable — is role="alert", which interrupts, and should be an alert instead.',
      'The dismiss button has aria-label="Dismiss", since its only content is an icon.',
      'Auto-hide is paused on hover and on focus, so a keyboard user has time to reach the Undo.',
      'Nothing in a toast is the only path to an action. If it matters, it exists somewhere permanent too.'
    ],
    related: ['alert', 'alert-dialog', 'badge'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div x-data="{ show: true }" x-init="setTimeout(() => show = false, 2600)"
     x-show="show" x-cloak
     x-transition:enter="transition ease-out duration-200"
     x-transition:enter-start="opacity-0 translate-y-2"
     x-transition:leave="transition ease-in duration-150"
     x-transition:leave-end="opacity-0 translate-y-2"
     class="fixed bottom-4 left-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-xl border border-zinc-200 bg-white px-3.5 py-3 shadow-lg">
  <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
    <i data-lucide="check" class="size-4 text-emerald-600"></i>
  </span>
  <div class="min-w-0 flex-1">
    <p class="truncate text-[13px]/5 font-medium">PO-24-1187 saved</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-500">Just now</p>
  </div>
  <button type="button" @click="show = false" aria-label="Dismiss"
          class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
    <i data-lucide="x" class="size-4"></i>
  </button>
</div>` },
      { id: 'undo', name: 'With undo action', code:
`<div x-data="{ show: true }" x-init="setTimeout(() => show = false, 6000)"
     x-show="show" x-cloak
     x-transition:enter="transition ease-out duration-200"
     x-transition:enter-start="opacity-0 translate-y-2"
     x-transition:leave="transition ease-in duration-150"
     x-transition:leave-end="opacity-0 translate-y-2"
     class="fixed bottom-4 left-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm items-start gap-3 rounded-xl border border-zinc-200 bg-white px-3.5 py-3 shadow-lg">
  <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
    <i data-lucide="trash-2" class="size-4 text-zinc-600"></i>
  </span>
  <div class="min-w-0 flex-1">
    <p class="truncate text-[13px]/5 font-medium">Line 4 removed from PO-24-1187</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-500">MS plate 10 mm · <span class="tabular-nums">₹1,08,400</span></p>
  </div>
  <button type="button" @click="show = false"
          class="shrink-0 text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2">Undo</button>
</div>` }
    ]
  },

  {
    id: 'alert-dialog', name: 'Alert dialog', category: 'feedback',
    description: 'A dialog that interrupts to ask one question with two answers. Unlike a modal it does not dismiss on a backdrop click — the user has to choose.',
    when: 'Anything destructive, irreversible, or expensive to undo: deleting a record, closing an order, discarding unsaved work, acting on a selection. If the answer does not matter much, do not interrupt at all.',
    notes: [
      'No @click.self on the backdrop. A modal dismisses on a stray backdrop click; an alert dialog must not — the user is being asked a question and a misplaced click is not an answer.',
      'Escape still closes, and it means cancel. Taking that away makes the dialog a trap, which is a worse failure than an accidental dismissal.',
      'role="alertdialog", not role="dialog". It tells a screen reader to announce the body immediately instead of waiting for the user to navigate to it — which only works if aria-describedby points at that body.',
      'x-trap.noscroll does three jobs: it traps Tab inside the dialog, it returns focus to the trigger on close, and it locks the page behind. Without it Tab walks straight out into the page underneath, which is still fully interactive.',
      'The focus trap lands on the first focusable element, so order the DOM to make that the safe one — Cancel, or the input in a typed confirmation. Focus must never open on the button that deletes something, even though it is the last one visually.',
      'Name the record in the heading. "Are you sure?" tells the user nothing about what they are about to lose.',
      'Say what else goes with it. If deleting the order also deletes a GRN and two approvals, that belongs in the dialog, not in a toast afterwards.',
      'The confirm button repeats the verb — "Delete order", never "OK". Someone who reads only the buttons still knows what is about to happen.'
    ],
    anatomy: [
      ['Backdrop', 'Dims the page and centres the panel. It carries no click handler at all — that is the whole difference from a modal.'],
      ['Container', 'role="alertdialog" and aria-modal="true", labelled by the heading and described by the consequence line.'],
      ['Heading', 'The verb and the record, in one line. "Delete PO-24-1187", not "Confirm deletion".'],
      ['Consequence', 'What else changes, and whether it can be undone. The only place colour appears in the dialog.'],
      ['Actions', 'Two, or three when there is a middle answer. Cancel is first in the DOM so it takes focus; the confirm button carries the verb.']
    ],
    behaviour: [
      'Opening moves focus into the dialog and onto the safe action, not the confirm.',
      'Tab and Shift+Tab cycle inside the dialog only. Nothing behind it is reachable.',
      'Escape cancels. A backdrop click does nothing.',
      'Closing returns focus to the control that opened it, so the keyboard does not lose its place.',
      'The page behind does not scroll while the dialog is open.',
      'Where a precondition exists, the confirm button stays genuinely disabled until it is met — not enabled-but-ignored.'
    ],
    a11y: [
      'role="alertdialog" with aria-modal="true", so assistive tech treats the rest of the page as inert.',
      'aria-labelledby points at the heading and aria-describedby at the consequence text. Without the second one the reason is never announced.',
      'Focus enters on the safe action and cannot leave the dialog while it is open.',
      'Focus returns to the trigger when the dialog closes.',
      'Escape closes the dialog from anywhere inside it.',
      'A blocked confirm is a real disabled button, so the keyboard skips it and a screen reader says it is unavailable, rather than it silently doing nothing.'
    ],
    related: ['modal', 'alert', 'drawer'],
    variants: [
      { id: 'confirm', name: 'Confirm', code:
`<div x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Close order</button>

  <!-- no @click.self here, and that is deliberate: the backdrop does not answer for the user -->
  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="close-title" aria-describedby="close-body"
         class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-lg">
      <h2 id="close-title" class="text-[16px]/6 font-semibold">Close PO-24-1187?</h2>
      <p id="close-body" class="mt-1.5 text-[13px]/5 text-zinc-600">
        Sharma Extrusions · <span class="tabular-nums">₹18,42,000</span>. All 6 lines are fully received.
        Closing stops any further GRN against this order. You can reopen it from the order page.
      </p>
      <div class="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Close order</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'destructive', name: 'Destructive', code:
`<div x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Delete order</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="del-title" aria-describedby="del-body"
         class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-lg">
      <div class="flex items-start gap-3">
        <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
        <div class="min-w-0">
          <h2 id="del-title" class="text-[16px]/6 font-semibold">Delete PO-24-1187</h2>
          <p class="mt-1.5 text-[13px]/5 text-zinc-600">
            Nashik Steel Traders · <span class="tabular-nums">₹18,42,000</span> · raised 04 Aug 2024.
          </p>
          <p id="del-body" class="mt-2 text-[13px]/5 font-medium text-red-600">
            GRN 1142 and 2 approvals are linked to this order and will be deleted with it. This cannot be undone.
          </p>
        </div>
      </div>
      <div class="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-red-600 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-red-700">Delete order</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'typed', name: 'Typed confirmation', code:
`<!-- For the small number of actions that cannot be undone at all. Do not reach
     for this every time something is deleted — if every dialog asks for typing,
     people learn to type without reading. -->
<div x-data="{ open: false, typed: '', target: 'SHARMA-EXT' }">
  <button type="button" @click="open = true; typed = ''"
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Delete vendor</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="wipe-title" aria-describedby="wipe-body"
         class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-lg">
      <h2 id="wipe-title" class="text-[16px]/6 font-semibold">Delete Sharma Extrusions</h2>
      <p id="wipe-body" class="mt-1.5 text-[13px]/5 text-zinc-600">
        <span class="font-medium text-red-600">34 orders, 61 invoices and the rate contract</span>
        are attached to this vendor and go with it. There is no recycle bin and no undo.
      </p>

      <div class="mt-4">
        <label for="wipe-code" class="mb-1.5 block text-[13px]/5 font-medium">
          Type <code class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px]/4" x-text="target"></code> to confirm
        </label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
          <input id="wipe-code" x-model="typed" :placeholder="target" autocomplete="off" spellcheck="false"
                 class="w-full bg-transparent px-3 py-2 font-mono text-[14px]/5 outline-none placeholder:text-zinc-500">
        </div>
      </div>

      <div class="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Cancel</button>
        <button type="button" @click="open = false" :disabled="typed !== target"
                class="rounded-lg px-4 py-2 text-[13px]/5 font-medium"
                :class="typed === target ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-zinc-200 text-zinc-500'">
          Delete vendor
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'bulk', name: 'Bulk action', code:
`<!-- Acting on a selection. Say how many, and say which ones will not go
     through — a bulk action that silently skips rows is the worst kind. -->
<div x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve 12 selected</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="bulk-title" aria-describedby="bulk-body"
         class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-lg">
      <h2 id="bulk-title" class="text-[16px]/6 font-semibold">Approve 12 purchase orders</h2>
      <p id="bulk-body" class="mt-1.5 text-[13px]/5 text-zinc-600">
        Total value <span class="font-medium tabular-nums text-zinc-900">₹94,18,600</span>.
        Each vendor is emailed a copy as soon as the order is approved.
      </p>

      <dl class="mt-4 space-y-2 rounded-lg border border-zinc-200 px-4 py-3 text-[13px]/5">
        <div class="flex items-center justify-between gap-4">
          <dt class="flex items-center gap-2 text-zinc-600">
            <i data-lucide="check-circle-2" class="size-4 shrink-0 text-emerald-600"></i>Ready to approve
          </dt>
          <dd class="shrink-0 font-medium tabular-nums">9</dd>
        </div>
        <div class="flex items-center justify-between gap-4">
          <dt class="flex items-center gap-2 text-zinc-600">
            <i data-lucide="alert-triangle" class="size-4 shrink-0 text-amber-700"></i>Above your limit, will route on
          </dt>
          <dd class="shrink-0 font-medium tabular-nums">3</dd>
        </div>
      </dl>

      <div class="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve 12 orders</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'unsaved', name: 'Three answers', code:
`<!-- Discard / Cancel / Save. When there is a middle answer, offer it — forcing
     a two-way choice makes people pick the destructive one to get out. -->
<div x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Leave page</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="leave-title" aria-describedby="leave-body"
         class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-lg">
      <h2 id="leave-title" class="text-[16px]/6 font-semibold">Leave without saving?</h2>
      <p id="leave-body" class="mt-1.5 text-[13px]/5 text-zinc-600">
        PO-24-1187 has 4 unsaved line items and a changed delivery date. Leaving now loses them.
      </p>
      <div class="mt-5 flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Keep editing</button>
        <button type="button" @click="open = false"
                class="rounded-lg px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Discard changes</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save and leave</button>
      </div>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'modal', name: 'Modal', category: 'feedback',
    description: 'A centred, dismissible dialog over a dimmed page. Use it to take a handful of fields without leaving the list.',
    when: 'Short forms and anything the user can walk away from. A form longer than about six fields belongs on its own page; a record to read belongs in a drawer; a question that must be answered belongs in an alert dialog.',
    notes: [
      'Close on escape and on a backdrop click with @click.self. A modal with no way out except the button is a trap.',
      'x-cloak on the overlay, otherwise it flashes over the page on load.',
      'A modal is dismissible by definition. The moment a stray backdrop click would lose the user something, it is an alert dialog and it belongs in that component instead.'
    ],
    related: ['alert-dialog', 'drawer', 'form-page'],
    anatomy: [
      ['Backdrop', 'A zinc-900/40 field that dims the page and carries @click.self to dismiss.'],
      ['Panel', 'Centred, rounded-xl, max-w-md for a form and max-w-lg when the body scrolls.'],
      ['Header', 'The title and a close button, on a bordered strip that does not scroll.'],
      ['Body', 'The fields, or the content. This is the only part that scrolls.'],
      ['Footer', 'Cancel and the primary action, right-aligned on a zinc-100 strip that does not scroll.']
    ],
    behaviour: [
      'Escape closes, a backdrop click closes, and the close button closes. All three, always.',
      'In the scrolling variant only the body moves; the header and footer stay, so the primary action never scrolls out of reach.',
      'The panel is capped at 80vh so it never grows past the viewport on a laptop.',
      'Opening does not shift the page behind it.',
      'A form longer than about six fields belongs on a page. A modal that scrolls a long form is a page in a costume.'
    ],
    a11y: [
      'role="dialog" with aria-modal="true" and aria-labelledby pointing at the heading.',
      'Focus moves into the panel on open and returns to the trigger on close.',
      'Focus is trapped inside while it is open — use x-trap from @alpinejs/focus, the same as the alert dialog.',
      'The close button carries aria-label="Close".',
      'Escape works from anywhere inside the panel, including from within a focused input.'
    ],
    related: ['alert-dialog', 'drawer', 'form-page'],
    variants: [
      { id: 'form', name: 'Form modal', code:
`<div x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
    <i data-lucide="plus" class="size-4"></i>Record GRN
  </button>

  <div x-show="open" x-cloak @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="grn-title"
         class="w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="grn-title" class="text-[16px]/6 font-semibold">Record GRN</h2>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">PO-24-1187 · Sharma Extrusions</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="px-5 py-4">
        <div>
          <label for="grn-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity received <span class="text-red-600">*</span></label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
            <input id="grn-qty" value="4,200" class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
            <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
          </div>
          <p class="mt-1.5 text-[12px]/4 text-zinc-500">Ordered 12,000 kg, received 7,800 kg so far.</p>
        </div>

        <div class="mt-4">
          <label for="grn-date" class="mb-1.5 block text-[13px]/5 font-medium">Receipt date <span class="text-red-600">*</span></label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
            <input id="grn-date" type="date" value="2024-08-19" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'scrolling', name: 'Scrolling body', code:
`<!-- Header and footer stay put, only the middle scrolls. max-h on the panel,
     overflow-y on the body, and min-h-0 so the flex child is allowed to shrink. -->
<div x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Review 6 lines</button>

  <div x-show="open" x-cloak @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="lines-title"
         class="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="lines-title" class="text-[16px]/6 font-semibold">Order lines</h2>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">PO-24-1187 · Sharma Extrusions · 6 lines</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-2">
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS angle 50×50×6</p><p class="text-[12px]/4 text-zinc-600">12,000 kg · received 7,800</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹6,84,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS plate 10 mm</p><p class="text-[12px]/4 text-zinc-600">4,000 kg · received 4,000</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹3,12,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS channel 100×50</p><p class="text-[12px]/4 text-zinc-600">6,500 kg · received 6,500</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹4,41,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS flat 40×6</p><p class="text-[12px]/4 text-zinc-600">2,200 kg · received 2,200</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹1,54,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS round bar 20 mm</p><p class="text-[12px]/4 text-zinc-600">3,100 kg · received 3,100</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹2,17,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS square tube 40×40</p><p class="text-[12px]/4 text-zinc-600">900 kg · received 900</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹34,000</span>
        </div>
      </div>

      <div class="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <span class="text-[13px]/5 text-zinc-600">Total <span class="font-medium tabular-nums text-zinc-900">₹18,42,000</span></span>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Done</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'reference', name: 'Reference sheet', code:
`<!-- Read-only, nothing to submit, so the only control is a close button. -->
<div x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="keyboard" class="size-4"></i>Shortcuts
  </button>

  <div x-show="open" x-cloak @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="keys-title"
         class="w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
      <div class="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <h2 id="keys-title" class="text-[16px]/6 font-semibold">Keyboard shortcuts</h2>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
      <dl class="px-5 py-2">
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
          <dt class="text-[13px]/5 text-zinc-600">Search orders</dt>
          <dd><kbd class="rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[11px]/4 text-zinc-600">/</kbd></dd>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
          <dt class="text-[13px]/5 text-zinc-600">New purchase order</dt>
          <dd><kbd class="rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[11px]/4 text-zinc-600">N</kbd></dd>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
          <dt class="text-[13px]/5 text-zinc-600">Select all rows</dt>
          <dd><kbd class="rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[11px]/4 text-zinc-600">Ctrl A</kbd></dd>
        </div>
        <div class="flex items-center justify-between gap-4 py-2.5">
          <dt class="text-[13px]/5 text-zinc-600">Close this dialog</dt>
          <dd><kbd class="rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[11px]/4 text-zinc-600">Esc</kbd></dd>
        </div>
      </dl>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'drawer', name: 'Drawer', category: 'feedback',
    description: 'A panel that slides in from the right over the page. Shows a record, or the filters for a list, without losing the user\'s place in it.',
    when: 'Reading or filtering while the list stays behind. If the user has to edit a lot, send them to a page instead — a drawer is too narrow for a long form.',
    notes: [
      'Full width below sm, fixed width above it. A 448px drawer on a 390px phone is a horizontal scrollbar.',
      'The body scrolls, the header and footer do not. overflow-y-auto goes on the middle section only.',
      'Escape and backdrop both close it, same as a modal.'
    ],
    anatomy: [
      ['Backdrop', 'The same dimmed field as a modal, dismissing on @click.self.'],
      ['Panel', 'Anchored right, full height, full width below sm and a fixed width above it.'],
      ['Header', 'The record\'s name and a close button. Fixed.'],
      ['Body', 'The only scrolling section — overflow-y-auto goes here and nowhere else.'],
      ['Footer', 'The actions for the record. Fixed, so they are reachable from anywhere in a long body.']
    ],
    behaviour: [
      'It slides in from the right and the list stays visible behind it, which is the whole point of choosing a drawer.',
      'Full width below sm. A 448px panel on a 390px phone is a horizontal scrollbar.',
      'Escape and a backdrop click both close it, the same as a modal.',
      'The body scrolls independently; the header and footer do not move.',
      'For heavy editing, send the user to a page. A drawer is too narrow for a long form and they will fight the width.'
    ],
    a11y: [
      'role="dialog" with aria-modal="true", labelled by the record name in the header.',
      'Focus enters the panel on open and returns to the row that opened it on close.',
      'Focus is trapped while open, or Tab walks into the list behind and the user is lost.',
      'The close button carries aria-label="Close".',
      'The slide transition respects prefers-reduced-motion.'
    ],
    related: ['modal', 'list-detail', 'table'],
    variants: [
      { id: 'record', name: 'Record detail', code:
`<div x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Open PO-24-1187</button>

  <div x-show="open" x-cloak @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="drawer-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-200 bg-white shadow-lg sm:w-[28rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <p class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase tabular-nums">PO-24-1187</p>
          <h2 id="drawer-title" class="mt-0.5 truncate text-[16px]/6 font-semibold">MS angles and plates — August lot</h2>
          <p class="mt-1 truncate text-[12px]/4 text-zinc-600">Sharma Extrusions · raised 04 Aug 2024 by Ritu Deshpande</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <dl class="divide-y divide-zinc-100">
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Status</dt>
            <dd class="text-[13px]/5 font-medium"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700"><span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved</span></dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Order value</dt>
            <dd class="text-[13px]/5 font-medium tabular-nums">₹18,42,000</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Payment terms</dt>
            <dd class="text-[13px]/5 font-medium">45 days from GRN</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Delivery by</dt>
            <dd class="text-[13px]/5 font-medium tabular-nums">28 Aug 2024</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Ship to</dt>
            <dd class="text-right text-[13px]/5 font-medium">Plant 2, Waluj MIDC</dd>
          </div>
        </dl>

        <div class="mt-5 rounded-lg border border-zinc-200 px-4 py-3">
          <div class="flex items-baseline justify-between gap-3">
            <p class="text-[13px]/5 font-medium">Received against GRN</p>
            <p class="text-[13px]/5 font-medium tabular-nums">7,800 / 12,000 kg</p>
          </div>
          <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div class="h-full rounded-full bg-zinc-700" style="width: 65%"></div>
          </div>
          <p class="mt-2 text-[12px]/4 text-zinc-500">Last receipt GRN 1142 on 16 Aug 2024.</p>
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Print order</button>
        <button type="button" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Record GRN</button>
      </div>
    </div>
  </div>
</div>` },
      { id: 'filters', name: 'Filters', code:
`<div x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="sliders-horizontal" class="size-4"></i>Filters
    <span class="rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-1.5 text-[11px]/4 font-medium tabular-nums">2</span>
  </button>

  <div x-show="open" x-cloak @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="filters-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-200 bg-white shadow-lg sm:w-96">

      <div class="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <h2 id="filters-title" class="text-[16px]/6 font-semibold">Filter orders</h2>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <div>
          <label for="f-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
            <select id="f-vendor" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              <option>All vendors</option>
              <option selected>Sharma Extrusions</option>
              <option>Nashik Steel Traders</option>
              <option>Gujarat Polymers Ltd</option>
            </select>
          </div>
        </div>

        <fieldset class="mt-4">
          <legend class="mb-2 text-[13px]/5 font-medium">Status</legend>
          <label class="flex items-center gap-2.5 text-[14px]/5"><input type="checkbox" checked class="size-4 rounded accent-zinc-700">Open</label>
          <label class="mt-2 flex items-center gap-2.5 text-[14px]/5"><input type="checkbox" class="size-4 rounded accent-zinc-700">Approved</label>
          <label class="mt-2 flex items-center gap-2.5 text-[14px]/5"><input type="checkbox" class="size-4 rounded accent-zinc-700">Closed</label>
        </fieldset>

        <div class="mt-4">
          <label for="f-from" class="mb-1.5 block text-[13px]/5 font-medium">Raised between</label>
          <div class="flex flex-wrap items-center gap-2">
            <div class="min-w-[8rem] flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
              <input id="f-from" type="date" value="2024-08-01" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            </div>
            <span class="text-[13px]/5 text-zinc-500">to</span>
            <div class="min-w-[8rem] flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
              <input id="f-to" aria-label="Raised to" type="date" value="2024-08-31" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            </div>
          </div>
        </div>

        <div class="mt-4">
          <label for="f-min" class="mb-1.5 block text-[13px]/5 font-medium">Minimum value</label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
            <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
            <input id="f-min" value="1,00,000" class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
          </div>
        </div>

        <label class="mt-4 flex items-center gap-2.5 text-[14px]/5">
          <input type="checkbox" checked class="size-4 rounded accent-zinc-700">Only orders with a pending GRN
        </label>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" class="rounded-lg px-4 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-white">Reset</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Apply filters</button>
      </div>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'badge', name: 'Badge', category: 'feedback',
    description: 'A small pill that labels a record — status, tag or count. Every pill is the same graphite shape; a 6px dot carries the colour.',
    when: 'One word about what a record is. If it needs a sentence it is not a badge, and if it does something when clicked it is a button wearing a pill.',
    notes: [
      'The status mapping is fixed and lives in the dot: Open zinc-500, Approved amber-500, Overdue red-600, Closed emerald-600, Draft zinc-400. Approved is amber because it is waiting on someone; Closed is green because it is finished. Do not reinterpret it per screen.',
      'The pill itself never takes a hue. bg-zinc-200, ring-zinc-300, text-zinc-700 on all five — a column of tinted pills reads as a traffic light and stops meaning anything by the twelfth row.',
      'The fill is bg-zinc-200 with ring-zinc-300 — the chip fill, the same one an avatar takes. bg-zinc-100 is the surface fill, so a pill wearing it is the identical colour as the selected row underneath it and vanishes into it.',
      'Solid pills take no ring. A graphite or red count badge already has an edge, and a pale ring around a dark pill reads as a rendering fault.',
      'Keep one label per state across the whole app. "Open" in one table and "Pending" in another reads as two different things.',
      'Counts are numbers — tabular-nums, and cap the display at 99+ so the pill cannot widen and reflow its row.',
      'The small size is for table cells and dense toolbars only. Everywhere else is the default size; there is no third.'
    ],
    anatomy: [
      ['Pill', 'rounded-full, bg-zinc-200, the same on every state. It is the shape that says "this is a state"; it is not what says which one.'],
      ['Ring', 'ring-zinc-300, one step deeper than the fill. It is a ring rather than a border so adding it reflows nothing.'],
      ['Dot', 'The 6px marker that carries the state. Not optional on a status pill — without it every state looks the same.'],
      ['Label', 'One word, sentence case, from a fixed vocabulary. Not a sentence and not a number with units.'],
      ['Count', 'tabular-nums, capped at 99+ so the pill cannot grow and reflow its row.'],
      ['Remove', 'Only on tags the user applied. A status is not removable, because it describes the record rather than decorating it.']
    ],
    behaviour: [
      'One label per state across the whole application. "Open" in one table and "Pending" in another reads as two different things.',
      'The dot colour comes from the locked mapping and is not reinterpreted per screen. The pill around it never changes.',
      'Counts cap at 99+ rather than widening, so a row does not reflow when a number crosses a hundred.',
      'A removable tag removes on click without a confirmation — it is cheap to reapply.',
      'A badge that filters is a real button and shows its selected state as a solid fill, not as a slightly darker tint nobody can see.',
      'Badges do not wrap. A row of them scrolls or truncates; a badge broken across two lines stops reading as one object.'
    ],
    a11y: [
      'The label is real text inside the pill, so colour is never the only carrier of the state.',
      'The dot is decorative and aria-hidden; the word beside it is the information.',
      'A count badge on a control is included in that control\'s accessible name — "Notifications, 99 or more unread" — because "bell, 99+" is not a sentence.',
      'A remove control is a real button with aria-label naming its tag.',
      'A filter badge is a button with aria-pressed, so its on state is announced and not merely filled in.',
      'Status pills are not interactive and are not focusable, so they do not appear in the Tab order as dead stops.'
    ],
    related: ['table', 'alert', 'avatar'],
    variants: [
      { id: 'status', name: 'Status pills', code:
`<!-- The locked mapping. One pill class on all five; the dot is the only thing
     that differs. Copy these verbatim, and do not invent a sixth colour for a
     sixth state — add the state to this list or reuse Open. -->
<div class="flex flex-wrap items-center gap-2">
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Closed
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-600 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-zinc-400" aria-hidden="true"></span>Draft
  </span>
</div>` },

      { id: 'inline', name: 'Inline, without the pill', code:
`<!-- The same locked dot with no pill around it. Use this where there is one
     status and nothing to line it up with — a detail header, a card meta line.
     The pill exists to give a column of states a shared left edge; one state on
     its own has no column, so the shape is doing nothing but adding weight. -->
<div class="max-w-md rounded-xl border border-zinc-200 bg-white p-4">
  <div class="flex items-baseline justify-between gap-3">
    <h3 class="text-[16px]/6 font-semibold">PO-24-1187</h3>
    <span class="text-[13px]/5 tabular-nums text-zinc-600">₹4,82,000</span>
  </div>
  <dl class="mt-3 space-y-1.5 text-[13px]/5">
    <div class="flex gap-3">
      <dt class="w-20 shrink-0 text-zinc-600">Supplier</dt>
      <dd>Sharma Extrusions</dd>
    </div>
    <div class="flex gap-3">
      <dt class="w-20 shrink-0 text-zinc-600">Status</dt>
      <dd class="inline-flex items-center gap-2 font-medium text-zinc-700">
        <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
      </dd>
    </div>
    <div class="flex gap-3">
      <dt class="w-20 shrink-0 text-zinc-600">Raised</dt>
      <dd class="tabular-nums">14 Aug 2026</dd>
    </div>
  </dl>
</div>` },

      { id: 'sizes', name: 'Sizes', code:
`<!-- Two sizes and no third. Small is for table cells and dense toolbars, where
     the default pill makes the row taller than its text needs. The dot stays
     1.5 at both sizes — shrinking it is how a state stops being visible. -->
<div class="flex flex-wrap items-center gap-4">
  <div class="flex items-center gap-2">
    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
    </span>
    <span class="text-[12px]/4 text-zinc-600">Small — inside table rows</span>
  </div>
  <div class="flex items-center gap-2">
    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
    </span>
    <span class="text-[12px]/4 text-zinc-600">Default — everywhere else</span>
  </div>
</div>` },

      { id: 'icon', name: 'With an icon', code:
`<!-- An icon belongs on a badge that names a kind, not a state. States already
     have the five colours; a kind has nothing else to distinguish it. -->
<div class="flex flex-wrap items-center gap-2">
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-2.5 pl-2 text-[12px]/4 font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="mail" class="size-3 text-zinc-600"></i>Email
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-2.5 pl-2 text-[12px]/4 font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="phone" class="size-3 text-zinc-600"></i>Phone
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-2.5 pl-2 text-[12px]/4 font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="map-pin" class="size-3 text-zinc-600"></i>Site visit
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-2.5 pl-2 text-[12px]/4 font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="paperclip" class="size-3 text-zinc-600"></i>3 files
  </span>
</div>` },

      { id: 'filter', name: 'Filter chips', code:
`<!-- A badge that does something is a button. Selected is a solid fill, because
     a marginally darker tint is not a state anyone can see across a toolbar.
     aria-pressed carries the same fact to a screen reader. -->
<div class="flex flex-wrap items-center gap-2" x-data="{ on: ['overdue'] }">
  <template x-for="f in [{ id: 'mine', label: 'My orders' }, { id: 'overdue', label: 'Overdue' }, { id: 'unapproved', label: 'Awaiting approval' }, { id: 'month', label: 'This month' }]" :key="f.id">
    <button type="button"
            @click="on = on.includes(f.id) ? on.filter(x => x !== f.id) : [...on, f.id]"
            :aria-pressed="on.includes(f.id)"
            class="rounded-full px-2.5 py-1 text-[12px]/4 font-medium"
            :class="on.includes(f.id)
              ? 'bg-zinc-700 text-white hover:bg-zinc-800'
              : 'bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-100'">
      <span x-text="f.label"></span>
    </button>
  </template>
  <button type="button" x-show="on.length" x-cloak @click="on = []"
          class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Clear</button>
</div>` },

      { id: 'removable', name: 'Removable tag', code:
`<!-- Only for tags the user applied. A status is not removable — it describes
     the record rather than decorating it, and an x on it promises an edit that
     is not going to happen. -->
<div class="flex flex-wrap items-center gap-2" x-data="{ tags: ['Sharma Extrusions', 'Open', '₹1,00,000+'] }">
  <template x-for="tag in tags" :key="tag">
    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-1 pl-2.5 text-[12px]/4 font-medium ring-1 ring-inset ring-zinc-300">
      <span x-text="tag"></span>
      <button type="button" @click="tags = tags.filter(t => t !== tag)" :aria-label="'Remove ' + tag"
              class="flex size-4 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
        <i data-lucide="x" class="size-3"></i>
      </button>
    </span>
  </template>
  <button type="button" x-show="tags.length" x-cloak @click="tags = []"
          class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Clear all</button>
  <p x-show="!tags.length" x-cloak class="text-[12px]/4 text-zinc-600">No filters applied.</p>
</div>` },

      { id: 'count', name: 'Count badge', code:
`<!-- Counts are numbers: tabular-nums, and capped at 99+ so the pill cannot
     widen and shove the rest of the toolbar sideways. The count is part of the
     control's accessible name, not a separate announcement.

     A count is not a state, so it takes no hue — the word next to it already
     says "Overdue". Solid graphite is for the one badge that must be seen from
     across the toolbar, and solid shapes take no ring. -->
<div class="flex flex-wrap items-center gap-4">
  <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    Pending approval
    <span class="rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium tabular-nums ring-1 ring-inset ring-zinc-300">12</span>
  </button>

  <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    Overdue
    <span class="rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">3</span>
  </button>

  <button type="button" aria-label="Notifications, 99 or more unread"
          class="relative flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100">
    <i data-lucide="bell" class="size-4"></i>
    <span class="absolute -top-1.5 -right-1.5 rounded-full bg-zinc-700 px-1.5 text-[11px]/4 font-medium tabular-nums text-white">99+</span>
  </button>
</div>` },

      { id: 'table', name: 'In a table', code:
`<!-- Where a status pill actually lives, and the reason the pill is graphite.
     Read the status column top to bottom: four identical shapes, and the eye
     goes straight to the red dot. Tint the pills instead and the column becomes
     a stripe of colour with nothing standing out of it.

     Supplier and Value drop below sm rather than the table scrolling sideways —
     nothing scrolls sideways on a phone, and table-fixed with declared widths
     has a minimum that a phone cannot meet. The full small-screen treatment,
     where rows become stacked cards, belongs to the table component. -->
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <table class="w-full table-fixed text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-100 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="px-4 py-2 font-medium sm:w-32">Order</th>
        <th scope="col" class="hidden px-4 py-2 font-medium sm:table-cell">Supplier</th>
        <th scope="col" class="px-4 py-2 font-medium sm:w-28">Status</th>
        <th scope="col" class="hidden px-4 py-2 text-right font-medium sm:table-cell sm:w-32">Value</th>
      </tr>
    </thead>
    <tbody>
        <tr class="border-b border-zinc-100">
          <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
          <td class="hidden truncate px-4 py-2.5 sm:table-cell">Sharma Extrusions</td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
            </span>
          </td>
          <td class="hidden px-4 py-2.5 text-right tabular-nums sm:table-cell">₹4,82,000</td>
        </tr>
        <tr class="border-b border-zinc-100 bg-zinc-100">
          <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1186</td>
          <td class="hidden truncate px-4 py-2.5 sm:table-cell">Konkan Fabricators</td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
            </span>
          </td>
          <td class="hidden px-4 py-2.5 text-right tabular-nums sm:table-cell">₹1,15,400</td>
        </tr>
        <tr class="border-b border-zinc-100">
          <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1185</td>
          <td class="hidden truncate px-4 py-2.5 sm:table-cell">Deshpande Traders</td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
            </span>
          </td>
          <td class="hidden px-4 py-2.5 text-right tabular-nums sm:table-cell">₹96,750</td>
        </tr>
        <tr>
          <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1184</td>
          <td class="hidden truncate px-4 py-2.5 sm:table-cell">Qureshi Metals</td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Closed
            </span>
          </td>
          <td class="hidden px-4 py-2.5 text-right tabular-nums sm:table-cell">₹2,30,000</td>
        </tr>
      </tbody>
  </table>
</div>` },

      { id: 'django', name: 'Django status field', code:
`<!-- Because the pill is identical on every state, the template needs one
     lookup and it returns a single colour. Put it in one place — a filter over
     the field's raw value — never repeated per template. Repeating it is
     exactly how one screen ends up amber and another green for the same record.

     # templatetags/ui.py
     DOT = {
         'open':     'bg-zinc-400',
         'approved': 'bg-amber-500',
         'overdue':  'bg-red-600',
         'closed':   'bg-emerald-600',
         'draft':    'bg-zinc-300',
     }

     @register.filter
     def status_dot(value):
         return DOT.get(value, DOT['open'])

     The label comes from get_status_display, so it follows the model's choices
     and reads identically on every screen. -->
{% load ui %}
<span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
  <span class="size-1.5 rounded-full {{ order.status|status_dot }}" aria-hidden="true"></span>
  {{ order.get_status_display }}
</span>` }
    ]
  },

  {
    id: 'tooltip', name: 'Tooltip', category: 'feedback',
    description: 'A dark bubble on hover, done with group-hover alone — no JS, no Alpine.',
    when: 'Naming an icon-only button, or showing the full text of a cell that had to be truncated. Never put anything the user must read in a tooltip; it is invisible on touch and to keyboard users.',
    notes: [
      'The tooltip is not a label. Keep aria-label on the button as well, or screen readers get nothing.',
      'pointer-events-none on the bubble, otherwise it eats the hover of whatever sits under it.',
      'The wrapper needs relative and group; the bubble positions against it.'
    ],
    anatomy: [
      ['Wrapper', 'relative and group. The bubble positions against this, so it has to exist.'],
      ['Trigger', 'The icon button or the truncated cell the tooltip belongs to.'],
      ['Bubble', 'A zinc-900 panel appearing on group-hover, pointer-events-none so it does not eat the hover beneath it.'],
      ['Arrow', 'Optional. A rotated square tucked under the bubble\'s edge.']
    ],
    behaviour: [
      'Hover only, with no JavaScript at all — group-hover does the whole job.',
      'It is invisible on touch and to the keyboard, which is why nothing the user must read may live in one.',
      'The bubble never intercepts the pointer; without pointer-events-none it flickers as the cursor crosses it.',
      'It appears above the trigger by default and flips below only when there is no room.',
      'A tooltip on a truncated cell shows the full text, which means the text must exist in the markup rather than being fetched.'
    ],
    a11y: [
      'The tooltip is not a label. The button keeps its aria-label, or a screen reader gets nothing at all.',
      'The bubble is aria-hidden, because its text is already available through the trigger\'s accessible name.',
      'No essential information lives only in a tooltip — it cannot be reached by touch or by keyboard.',
      'The trigger stays a real button, so it is focusable even though the bubble will not appear on focus.',
      'Truncated text remains available to a screen reader in full, since truncation is visual only.'
    ],
    related: ['button', 'badge', 'table'],
    variants: [
      { id: 'icon', name: 'On an icon button', code:
`<div class="group relative inline-flex">
  <button type="button" aria-label="Duplicate order"
          class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100">
    <i data-lucide="copy" class="size-4"></i>
  </button>
  <span class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
    Duplicate order
  </span>
</div>` },
      { id: 'truncated', name: 'On a truncated table cell', code:
`<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
  <table class="w-full text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-100 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="px-4 py-2 font-medium">Order</th>
        <th scope="col" class="px-4 py-2 font-medium">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="max-w-[14rem] px-4 py-2.5">
          <span class="group relative block">
            <span class="block truncate text-zinc-600">MS angles 50×50×6 and plates 10 mm — Waluj plant, August lot</span>
            <span class="pointer-events-none absolute top-full left-0 z-40 mt-1 max-w-xs rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 text-white opacity-0 transition-opacity group-hover:opacity-100">
              MS angles 50×50×6 and plates 10 mm — Waluj plant, August lot
            </span>
          </span>
        </td>
      </tr>
      <tr>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1163</td>
        <td class="max-w-[14rem] px-4 py-2.5">
          <span class="group relative block">
            <span class="block truncate text-zinc-600">HR coil 2.5 mm × 1250 mm — Nashik Steel Traders, part shipment</span>
            <span class="pointer-events-none absolute top-full left-0 z-40 mt-1 max-w-xs rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 text-white opacity-0 transition-opacity group-hover:opacity-100">
              HR coil 2.5 mm × 1250 mm — Nashik Steel Traders, part shipment
            </span>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>` }
    ]
  },

  {
    id: 'avatar', name: 'Avatar', category: 'feedback',
    description: 'Initials in a circle standing in for a person. There are no photographs in this system, so a zinc tint and two letters is the whole thing.',
    when: 'Naming who raised, approved, or is assigned to a record. Always pair it with the name unless the row genuinely has no width for one — an avatar alone identifies nobody.',
    notes: [
      'Two initials, never one. Two people named Sanjay collide immediately, and a single letter is not a name.',
      'The circle is aria-hidden wherever the name is written beside it, or a screen reader reads "RD Ritu Deshpande" and the initials become noise.',
      'Where the circle stands alone, it needs the full name through aria-label or a title — the letters are meaningless to anyone who does not already know the person.',
      'A stack needs the names on the group, not on the pieces. The +4 chip on its own tells nobody who is in the group.',
      'Never colour avatars by hashing the name. It looks lively and it means nothing, and in this system colour is reserved for record state.',
      'The graphite fill marks the signed-in user and only the signed-in user. If every avatar is graphite the distinction is gone.',
      'shrink-0 on the circle, min-w-0 on the text beside it. Without both, a long name squashes the circle into an ellipse.',
      'Initials come from the server, already computed. Slicing a name in the template gets Indian and single-word names wrong.',
      'The tinted circle is bg-zinc-200, not bg-zinc-100. zinc-100 is the page background, so a zinc-100 avatar has no fill at all wherever it sits on the page, on a selected row, or in a preview panel — the ring alone is left and the initials float inside an outline.',
      'Initials are text and have to clear 4.5:1. zinc-500 on zinc-100 measures 4.39 and fails; zinc-600 on zinc-200 measures 6.08 and passes.',
      'truncate on a name inside a table cell does nothing unless the table is table-fixed. Under the default auto layout the cell grows to fit the name — measured here at 318px stretching to 483px — and pushes the columns to its right off the edge.'
    ],
    anatomy: [
      ['Circle', 'A rounded-full box at size-7, size-9 or size-11. shrink-0 always, or a long name beside it deforms the circle.'],
      ['Initials', 'Two letters, font-medium, one step down from the text they sit beside so they do not shout.'],
      ['Fill', 'bg-zinc-200 with zinc-600 letters for everyone; bg-zinc-700 with white letters for the signed-in user alone.'],
      ['Edge', 'ring-1 ring-inset ring-zinc-300 on the tinted fill. The graphite fill needs none.'],
      ['Ring', 'ring-2 ring-white, used only in a stack, so the overlap reads as separate circles rather than one shape.'],
      ['Overflow chip', 'The +N at the end of a stack. tabular-nums, and the group carries the names it stands for.'],
      ['Presence dot', 'Optional, bottom-right, on a white ring. It says something about the person, never about the record.']
    ],
    behaviour: [
      'The circle is a fixed square at every size, so a row of avatars keeps its rhythm regardless of name length.',
      'Text beside an avatar truncates; the circle never shrinks. That is shrink-0 on the circle and min-w-0 on the text.',
      'A stack overlaps by -space-x-5 and each circle carries a 2px white ring, which is what separates them where they cover each other',
      'The stack shows three or four and rolls the rest into a +N chip. Past that the row stops being scannable.',
      'Initials are supplied by the server. Deriving them in the template mishandles single-word names, three-part names and names where the family name comes first.',
      'Size follows context: size-7 in a table row, size-9 in a list or a card header, size-11 in a record header.'
    ],
    a11y: [
      'Where the name is written beside the avatar, the circle is aria-hidden — the name is already there and the letters would be read twice.',
      'Where the avatar stands alone, it carries the full name through aria-label, because two letters identify nobody.',
      'A stack puts the names on the group as one accessible label, rather than leaving four unlabelled circles and a number.',
      'The +N chip is included in that group label — "and 4 more" — so the count is not an orphaned digit.',
      'Colour carries no information here, so nothing is lost by not seeing it. The graphite fill is a convenience, not a signal.',
      'An avatar that opens a menu is a real button with its own accessible name; the circle itself is never the only clickable thing.'
    ],
    related: ['badge', 'tooltip', 'topbar'],
    variants: [
      { id: 'sizes', name: 'Sizes', code:
`<!-- size-7 in a table row, size-9 in a list or card header, size-11 on a record.
     The text step drops with the circle so the letters never crowd the edge. -->
<div class="flex flex-wrap items-center gap-4">
  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[11px]/4 font-medium text-zinc-600" aria-label="Ritu Deshpande" role="img">RD</span>
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-label="Ritu Deshpande" role="img">RD</span>
  <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[14px]/5 font-medium text-zinc-600" aria-label="Ritu Deshpande" role="img">RD</span>
</div>` },

      { id: 'self', name: 'The signed-in user', code:
`<!-- Graphite marks you, and nobody else. If every avatar is filled, the
     distinction it exists to make has gone. -->
<div class="flex flex-wrap items-center gap-4">
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[13px]/5 font-medium text-white" aria-label="Ritu Deshpande, you" role="img">RD</span>
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-label="Sanjay More" role="img">SM</span>
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-label="Imran Qureshi" role="img">IQ</span>
</div>` },

      { id: 'with-name', name: 'With name and role', code:
`<!-- The name is written, so the circle is aria-hidden. Otherwise a screen
     reader announces "RD Ritu Deshpande". -->
<div class="flex items-center gap-3">
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">RD</span>
  <div class="min-w-0">
    <p class="truncate text-[13px]/5 font-medium">Ritu Deshpande</p>
    <p class="truncate text-[12px]/4 text-zinc-600">Purchase lead · approved PO-24-1187</p>
  </div>
</div>

<div class="mt-3 flex items-center gap-3">
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">SM</span>
  <div class="min-w-0 flex-1">
    <p class="truncate text-[13px]/5 font-medium">Sanjay More</p>
    <p class="truncate text-[12px]/4 text-zinc-600">Stores, Plant 2 · posted GRN 1142</p>
  </div>
  <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">16 Aug</span>
</div>` },

      { id: 'stacked', name: 'Stacked group', code:
`<!-- Circles sit over the ones beneath them and cover most of their initials.
     That is the point: a stack answers "how many and roughly who", not "which
     one is Sanjay". Keeping every pair of letters readable would mean barely
     overlapping at all, and then it reads as a row rather than a group.

     The names are on the group, which is what a screen reader gets. The +N
     chip is last and therefore fully visible, because it is the one part
     that has to be read. -->
<div class="flex items-center -space-x-5" role="img"
     aria-label="Approvers: Ritu Deshpande, Sanjay More, Imran Qureshi and 3 more">
  <span class="flex size-11 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-medium text-zinc-600 ring-2 ring-white" aria-hidden="true">RD</span>
  <span class="flex size-11 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-medium text-zinc-600 ring-2 ring-white" aria-hidden="true">SM</span>
  <span class="flex size-11 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-medium text-zinc-600 ring-2 ring-white" aria-hidden="true">IQ</span>
  <span class="flex size-11 items-center justify-center rounded-full bg-zinc-700 text-[11px]/4 font-medium tabular-nums text-white ring-2 ring-white" aria-hidden="true">+3</span>
</div>` },

      { id: 'in-row', name: 'In a table cell', code:
`<!-- table-fixed is what makes truncate work. Under the default auto layout a
     cell grows to fit its content, so a long name widens the column and pushes
     the amount off the right edge instead of ellipsing. Widths are declared on
     the first row. -->
<table class="w-full table-fixed">
  <tbody class="divide-y divide-zinc-100">
    <tr>
      <td class="w-[7.5rem] py-2.5 pr-4 text-[13px]/5 font-medium tabular-nums">PO-24-1187</td>
      <td class="py-2.5 pr-4">
        <div class="flex items-center gap-2">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[11px]/4 font-medium text-zinc-600" aria-hidden="true">RD</span>
          <span class="min-w-0 truncate text-[13px]/5">Ritu Deshpande</span>
        </div>
      </td>
      <td class="w-[7.5rem] py-2.5 text-right text-[13px]/5 tabular-nums">₹18,42,000</td>
    </tr>
    <tr>
      <td class="py-2.5 pr-4 text-[13px]/5 font-medium tabular-nums">PO-24-1163</td>
      <td class="py-2.5 pr-4">
        <div class="flex items-center gap-2">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[11px]/4 font-medium text-zinc-600" aria-hidden="true">SM</span>
          <span class="min-w-0 truncate text-[13px]/5">Venkataraman Balasubramanian Krishnamurthy</span>
        </div>
      </td>
      <td class="py-2.5 text-right text-[13px]/5 tabular-nums">₹4,26,500</td>
    </tr>
  </tbody>
</table>` },

      { id: 'presence', name: 'With presence', code:
`<!-- The dot says something about the person. It never carries record state —
     that belongs on a badge, where the colour mapping is fixed. -->
<div class="flex flex-wrap items-center gap-6">
  <div class="flex items-center gap-3">
    <span class="relative shrink-0">
      <span class="flex size-9 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">RD</span>
      <span class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-600 ring-2 ring-white"></span>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Ritu Deshpande</p>
      <p class="truncate text-[12px]/4 text-zinc-600">Online</p>
    </div>
  </div>
  <div class="flex items-center gap-3">
    <span class="relative shrink-0">
      <span class="flex size-9 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">SM</span>
      <span class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-zinc-300 ring-2 ring-white"></span>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Sanjay More</p>
      <p class="truncate text-[12px]/4 text-zinc-600">Last seen 16 Aug</p>
    </div>
  </div>
</div>` },

      { id: 'menu', name: 'Account trigger', code:
`<!-- The circle is inside a real button carrying its own name. An avatar that
     is the only clickable thing gives the keyboard nothing to land on. -->
<div class="flex justify-end">
  <div class="relative inline-block" x-data="{ open: false }" @click.outside="open = false">
  <button type="button" @click="open = !open" :aria-expanded="open" aria-haspopup="menu"
          class="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-zinc-100">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[12px]/4 font-medium text-white" aria-hidden="true">RD</span>
    <span class="hidden text-[13px]/5 font-medium sm:block">Ritu Deshpande</span>
    <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>

  <div x-show="open" x-cloak role="menu"
       class="absolute right-0 z-40 mt-1 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
    <div class="border-b border-zinc-200 px-3 py-2">
      <p class="truncate text-[13px]/5 font-medium">Ritu Deshpande</p>
      <p class="truncate text-[12px]/4 text-zinc-600">ritu.deshpande@konspec.com</p>
    </div>
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
      <i data-lucide="user" class="size-4 text-zinc-600"></i>Profile
    </button>
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
      <i data-lucide="settings" class="size-4 text-zinc-600"></i>Preferences
    </button>
    <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 border-t border-zinc-200 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100">
      <i data-lucide="log-out" class="size-4 text-zinc-600"></i>Sign out
    </button>
    </div>
  </div>
</div>` },

      { id: 'placeholder', name: 'Unassigned', code:
`<!-- Nobody is a real state and needs a real rendering. An empty circle reads
     as a loading bug; a dashed one with a verb reads as an invitation. -->
<div class="flex flex-wrap items-center gap-6">
  <div class="flex items-center gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-zinc-300 text-zinc-500" aria-hidden="true">
      <i data-lucide="user" class="size-4"></i>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 text-zinc-600">Unassigned</p>
      <p class="truncate text-[12px]/4 text-zinc-500">PO-24-1191 · raised 18 Aug</p>
    </div>
  </div>
  <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="user-plus" class="size-4 text-zinc-600"></i>Assign approver
  </button>
</div>` }
    ]
  }
);
