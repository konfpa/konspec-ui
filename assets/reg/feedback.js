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
`<div data-kui="alert/tags" class="flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="info" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">Rate contract with Sharma Extrusions expires on 30 Sep 2024.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Orders raised after that date will price at the spot rate.</p>
  </div>
</div>

<div class="mt-2 flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="check-circle-2" class="mt-0.5 size-4 shrink-0 text-emerald-600"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">PO-24-1187 emailed to Sharma Extrusions.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Sent by Ritu Deshpande, 19 Aug 2024 at 11:42.</p>
  </div>
</div>

<div class="mt-2 flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">GRN pending for 3 orders older than 30 days.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Nashik Steel Traders, Gujarat Polymers Ltd, Sharma Extrusions.</p>
  </div>
</div>

<div class="mt-2 flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3" role="alert">
  <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">Order value <span class="tabular-nums">₹18,42,000</span> exceeds your approval limit.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Anything above ₹10,00,000 goes to the plant head.</p>
  </div>
</div>` },

      { id: 'compact', name: 'Compact', code:
`<!-- One line, 32px tall. For a table toolbar or a card header, where a
     three-line alert would push the data below the fold. -->
<div data-kui="alert/compact" class="flex items-center gap-2.5 rounded-lg border border-zinc-300 bg-white px-3 py-2">
  <i data-lucide="alert-triangle" class="size-3.5 shrink-0 text-amber-700"></i>
  <p class="min-w-0 flex-1 truncate text-[12px]/4">Showing the first 200 of <span class="tabular-nums">1,438</span> matching rows.</p>
  <a href="#" class="shrink-0 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Narrow the filters</a>
</div>` },

      { id: 'dismissible', name: 'Dismissible', code:
`<div data-kui="alert/dismissible" x-data="{ show: true }" x-show="show" x-cloak
     class="flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
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
`<div data-kui="alert/action" class="flex flex-wrap items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
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
<div data-kui="alert/records" class="rounded-lg border border-zinc-300 bg-white px-4 py-3" role="alert">
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
<div data-kui="alert/progress" class="rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <div class="flex items-start gap-3">
    <i data-lucide="loader-2" class="mt-0.5 size-4 shrink-0 animate-spin text-zinc-500"></i>
    <div class="min-w-0 flex-1">
      <p class="text-[13px]/5 font-medium">Importing the August rate card.</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-600">1,240 of 3,100 rows · you can leave this page, it keeps running.</p>
    </div>
    <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">40%</span>
  </div>
  <div class="mt-3 h-1 overflow-hidden rounded-full bg-zinc-200">
    <div class="h-full rounded-full bg-zinc-700 transition-[width] duration-500" style="width: 40%"></div>
  </div>
</div>` },

      { id: 'banner', name: 'Page banner', code:
`<!-- Full-bleed, above the application header, outside the content column.
     Graphite — never red. A red bar across the top reads as an outage. -->
<div data-kui="alert/banner" x-data="{ show: true }" x-show="show" x-cloak
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
<div data-kui="alert/form-errors" role="alert" tabindex="-1" x-data x-init="$el.focus()"
     class="rounded-lg border border-zinc-300 bg-white px-4 py-3 outline-none">
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
<div data-kui="alert/django" x-data="{ show: true }" x-show="show" x-cloak
     class="flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
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
    description: 'A short confirmation that an action the user just took has finished, pushed into a live region pinned to the bottom-left and gone a few seconds later. It reports an outcome; it is never where the outcome is recorded.',
    when: 'The user pressed something, it worked, and there is nothing further to do about it — saved, posted, exported, emailed, a line removed with an undo window. The line against an alert is not severity and it is not length: an alert belongs to the page and states a condition that is still true when you look away — three invoices unmatched, a contract expiring, an import running — so it stays until the condition or the user removes it, and it lives in the page next to the thing it is about. A toast belongs to an action that has already completed and states something that was true for one moment, so it can leave on a timer without taking anything with it. Ask what the message is attached to: if it is attached to a record or a screen, it is an alert; if it is attached to a keypress, it is a toast. Anything the user has to read, act on or copy down — a failure, a validation summary, a reference number they need — is an alert even when it was a keypress that produced it, because a timer must never be the thing that decides they have finished reading. And a decision to take is neither: that is an alert dialog.',
    notes: [
      'The live region has to be in the DOM before the first toast is appended, empty, from first paint. This is the defect the component exists to prevent. Assistive technology monitors a region from the moment it exists, so a div carrying role="status" that is created in the same frame as its first message is treated as content that was always there and announces nothing at all — it renders perfectly, it passes every visual review, and it is silent for the people it is for. Render the empty region in the base template, last thing before </body>, and push into it.',
      'Two regions, both empty at first paint: role="status" aria-live="polite" for ordinary confirmations and a second one carrying role="alert" aria-live="assertive" for failures. Do not rewrite aria-live on one region per message — the value is read when the region is registered, so the change lands after the announcement it was meant to change. And never point everything at the assertive region: assertive interrupts whatever is being read, so a save confirmation cuts off the sentence the user was listening to.',
      'An error or a destructive outcome never auto-dismisses. A message that reports a failure is a message somebody has to act on, and a timer that removes it is a timer deciding they finished reading. Hard-code it in the push handler — ms: 0 for the danger tone whatever the caller passed — rather than trusting every call site.',
      'The region box is pointer-events-none and each toast inside it is pointer-events-auto. Without it the empty region is an invisible strip across the bottom of the page that swallows every click landing on it, and the bug reads as "the footer links stopped working".',
      'The timer pauses on hover and on focus-within, and restarts from full when the pointer or focus leaves. Resuming with 400ms left is not a resume — the user looked away mid-sentence and the toast is gone before they look back.',
      'Under prefers-reduced-motion the timer does not run at all, for anything with words in it. It is the only signal the browser gives you that content vanishing on its own is unwelcome, and WCAG 2.2.1 wants a way to turn a time limit off. The toast stays until the user dismisses it, which costs nothing because dismiss is already there. Put motion-reduce:transition-none and motion-reduce:duration-0 on both x-transition class lists as well, so it arrives in place instead of travelling.',
      'A toast is never the only place an outcome is reported, because it disappears. The durable copy is the thing that changed — the row now showing Posted, the status pill on the record, the line in the activity log, the GRN that now exists. Write the toast last, after the screen behind it already says the same thing, and check the screen still makes sense with the toast deleted.',
      'Cap the stack at three and drop the oldest. Six toasts cover the bottom-left corner of the page, nobody reads past the second, and the region announces all six in a queue that outlasts the reason for it. If six things happened, one toast should say so and link to the list.',
      'One toast per action, not one per row the action wrote. Approving eleven orders raises "11 orders approved" with a link, never eleven confirmations racing each other out of the corner.',
      'A toast is appended after lucide.createIcons() has already run, so its <i> hydrates into nothing. Re-run createIcons() in $nextTick after the push, guarded on document.querySelector("[data-lucide]:not(svg)") — the generated <svg> keeps its data-lucide attribute, so an unguarded call repaints every icon on the page. Give the wrapping span its own size-4 box so the toast does not reflow when the glyph arrives, and put the tone colour on that span: createIcons() replaces the <i>, taking any :class bound on it. A spinner inside a toast is the border ring, never a Lucide loader, for the same reason.',
      'An undo toast lives exactly as long as the server will accept the undo, and not a second either side. Longer and the button is a lie by the time it is pressed; shorter and the offer expires while the user is still looking at it. Eight seconds is the usual pairing, and Undo posts to a real endpoint — it is not a client-side rollback of what the server already wrote.',
      'Bottom-left, and nothing else. Bottom-right collides with the sheet, the drawer handle and the row action menus that open downward; top-right is where the browser puts its own notifications. Below sm the region is inset-x-4 and the toast is one full-width card, so nothing scrolls sideways at 390px. A confirmation that has to survive a full page load is not a toast at all — it is the Django messages block rendered by the server into the next page.'
    ],
    anatomy: [
      ['Polite region', 'A fixed, empty, pointer-events-none flex column at the bottom-left, carrying role="status" aria-live="polite". It ships in the base template and is never created on demand. Ordinary toasts are appended into it.'],
      ['Assertive region', 'A second empty region beside the first, carrying role="alert" aria-live="assertive". Failures only. It exists at first paint too, because the error case is the one where a silent region costs the most.'],
      ['Toast', 'pointer-events-auto, rounded-xl, white, border-zinc-200, shadow-lg. One per outcome, appended at the end so the stack grows upward from the bottom edge.'],
      ['Icon', 'size-4, the only colour in the component, on a wrapping span that owns both the colour class and the box. The same four tones as an alert, from the same table — a toast is an alert with a timer, not a different language.'],
      ['Message', 'One line, past tense, naming the record: "GRN 4417 posted", never "Success". It is text content inside the region, which is what gets announced.'],
      ['Meta', 'Optional second line — vendor, quantity, value, who did it. text-[12px]/4 text-zinc-600, tabular-nums on the figures.'],
      ['Action', 'At most one, and almost always Undo or a link to the record that was just created. A real button or a real anchor, and whatever it does is reachable somewhere permanent as well.'],
      ['Dismiss', 'A 28px icon button with aria-label="Dismiss". Always present, because every toast has to be removable before its timer runs and the error toast has no timer at all.']
    ],
    behaviour: [
      'A toast appears after the action it reports has finished, never before, and never as a promise that something is about to happen.',
      'It auto-dismisses after about five seconds; an undo toast holds for eight, matching the server window; an error toast has no timer and waits for the user.',
      'Hover or focus inside a toast clears its timer, and leaving restarts it from full rather than resuming what was left.',
      'Under prefers-reduced-motion no timer is set at all and the toast arrives in place rather than travelling up from the edge.',
      'Toasts stack in one column from the bottom edge, newest nearest the bottom, so DOM order is the order things happened and that is the order the region reads them.',
      'The stack is capped at three. A fourth push removes the oldest, and the count of what was dropped points at the durable list.',
      'A pending toast is patched in place when the request settles — same id, same node, text and icon swapped — so the stack does not reshuffle under the pointer and the region announces the change rather than a second toast.',
      'Dismiss all appears once more than one toast is open. It sits above the stack and outside the live region, so its own arrival is not announced as a message.',
      'Nothing about a toast blocks the page: no backdrop, no focus move, no pointer events outside the cards themselves.'
    ],
    a11y: [
      'The region is in the document at page load with nothing in it. A region created together with its first message announces nothing, which is the single most common way a toast is shipped broken — it looks right on every screen and is silent on every screen reader.',
      'Ordinary toasts go into role="status" aria-live="polite" and are announced at the next pause. Failures go into a separate role="alert" aria-live="assertive" region and interrupt, which is the only case that earns an interruption.',
      'The message is text content inside the region, not an aria-label on the toast. A live region reports the content that changed inside it, and a name is not content. The default aria-relevant covers additions and text and not removals, which is what makes a toast expiring silent and an in-place update announced.',
      'The tone icon is decorative and unlabelled. The wording says what happened and how it went, so nothing depends on telling amber from red.',
      'Focus never moves to a toast when it appears. The user is usually still in the form that raised it, and a stolen caret loses their place; the toast is reached by Tab, which is why the region is the last thing in the body.',
      'The timer pauses on focusin as well as on hover, so a keyboard user tabbing towards Undo does not watch it vanish on the way, and it does not run at all under prefers-reduced-motion.',
      'Dismissing a toast destroys the element focus is on, which drops focus to <body>. The handler checks $event.detail === 0 — a click event with detail 0 came from Enter or Space, not a pointer — and only then returns focus to the control that raised the toast, so a mouse click does not cause a focus jump nobody asked for.',
      'The dismiss button carries aria-label="Dismiss" and the dismiss-all button carries its count in its text, because both are otherwise an icon or a bare number.',
      'Nothing in a toast is the only route to anything. Undo also exists on the record, the link also exists in the register, and the outcome is on the screen behind the toast before the toast is raised.'
    ],
    related: ['alert', 'alert-dialog', 'spinner'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- The region is in the page before anything is pushed into it, and that is
     the whole component. A role="status" div created in the same frame as its
     first toast announces nothing: the region is only monitored from the moment
     it exists, and content present when it appears counts as content that was
     always there. Render this empty div once in the base template, last thing
     before </body>, and push into it from anywhere.

     pointer-events-none on the region, pointer-events-auto on the card. Without
     it the empty region is an invisible strip across the bottom of the page that
     eats every click that lands on it.

     Lucide has already run by the time a toast is pushed, so the new <i> is
     hydrated in $nextTick, guarded on the un-hydrated selector — the generated
     <svg> keeps its data-lucide, so an unguarded call repaints every icon on the
     page. The span around it carries the size-4 box and the colour: createIcons()
     replaces the <i> and anything bound on it goes with it. -->
<div data-kui="toast/default" x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       push(t) {
         const n = { id: ++this.seq, ms: 5000, timer: 0, ...t };
         this.toasts.push(n);
         this.$nextTick(() => {
           if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
           this.start(n);
         });
         return n.id;
       },
       start(t) {
         if (!t || !t.ms || this.still) return;
         clearTimeout(t.timer);
         t.timer = setTimeout(() => this.close(t.id), t.ms);
       },
       pause(t) { clearTimeout(t.timer); },
       close(id) {
         const t = this.toasts.find(x => x.id === id);
         if (t) clearTimeout(t.timer);
         this.toasts = this.toasts.filter(x => x.id !== id);
       }
     }">

  <button type="button" x-ref="fire"
          @click="push({ text: 'PO-24-1187 saved', meta: '6 lines · ₹4,82,000' })"
          class="rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Save order
  </button>

  <!-- ships empty, at page load, exactly like this -->
  <div role="status" aria-live="polite"
       class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <template x-for="t in toasts" :key="t.id">
      <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
           @mouseenter="pause(t)" @mouseleave="start(t)"
           @focusin="pause(t)" @focusout="start(t)"
           x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:enter-start="translate-y-2 opacity-0"
           x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:leave-end="translate-y-2 opacity-0">
        <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
        <div class="min-w-0 flex-1">
          <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` },

      { id: 'tones', name: 'Four tones, two regions', code:
`<!-- The same four tones as an alert, from the same table: info zinc-500,
     success emerald-600, warning amber-700, danger red-600. The tone is the
     icon and nothing else — no tinted card, no coloured border.

     Two regions, both empty at first paint. Ordinary toasts go into the polite
     one and wait for a pause; danger goes into the assertive one and interrupts.
     Rewriting aria-live on a single region per message does not work, because
     the value is read when the region is registered — the change lands after the
     announcement it was meant to change. Routing everything through assertive is
     the same mistake in reverse: a save confirmation cutting off the sentence
     someone was listening to.

     push() forces ms: 0 on the danger tone whatever the call site asked for. A
     failure is not removed by a timer. -->
<div data-kui="toast/tones" x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       icon: { info: 'info', success: 'check-circle-2', warning: 'alert-triangle', danger: 'alert-circle' },
       hue: { info: 'text-zinc-500', success: 'text-emerald-600', warning: 'text-amber-700', danger: 'text-red-600' },
       push(t) {
         const n = { id: ++this.seq, tone: 'info', ms: 5000, timer: 0, ...t };
         if (n.tone === 'danger') n.ms = 0;
         this.toasts.push(n);
         this.$nextTick(() => {
           if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
           this.start(n);
         });
       },
       start(t) { if (t && t.ms && !this.still) { clearTimeout(t.timer); t.timer = setTimeout(() => this.close(t.id), t.ms); } },
       pause(t) { clearTimeout(t.timer); },
       close(id) {
         const t = this.toasts.find(x => x.id === id);
         if (t) clearTimeout(t.timer);
         this.toasts = this.toasts.filter(x => x.id !== id);
       },
       bucket(name) { return this.toasts.filter(t => (t.tone === 'danger') === (name === 'danger')); }
     }">

  <div class="flex flex-wrap gap-2">
    <button type="button" x-ref="fire" @click="push({ tone: 'info', text: 'Rate card refreshed', meta: 'August 2024 · 3,100 rows' })"
            class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Info</button>
    <button type="button" @click="push({ tone: 'success', text: 'PO-24-1187 emailed to Sharma Extrusions', meta: 'Sent 11:42' })"
            class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Success</button>
    <button type="button" @click="push({ tone: 'warning', text: 'Saved, but 2 lines are over the rate contract', meta: 'MS plate 10 mm · MS angle 50×50' })"
            class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Warning</button>
    <button type="button" @click="push({ tone: 'danger', text: 'PO-24-1187 could not be emailed', meta: 'The vendor has no contact address on file' })"
            class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Danger</button>
  </div>

  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <!-- both regions are in the DOM from first paint, both empty -->
    <div role="alert" aria-live="assertive" class="flex flex-col gap-2">
      <template x-for="t in bucket('danger')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             @mouseenter="pause(t)" @mouseleave="start(t)" @focusin="pause(t)" @focusout="start(t)"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0" :class="hue[t.tone]"><i :data-lucide="icon[t.tone]" class="size-4"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss" @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>

    <div role="status" aria-live="polite" class="flex flex-col gap-2">
      <template x-for="t in bucket('polite')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             @mouseenter="pause(t)" @mouseleave="start(t)" @focusin="pause(t)" @focusout="start(t)"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0" :class="hue[t.tone]"><i :data-lucide="icon[t.tone]" class="size-4"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss" @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>
  </div>
</div>` },

      { id: 'undo', name: 'With undo action', code:
`<!-- Eight seconds, because that is how long the server will accept the undo.
     The two numbers are one number: hold the toast longer than the window and
     the button is a lie by the time it is pressed; shorter and the offer expires
     while it is still on the screen.

     Undo posts to a real endpoint — hx-post="/orders/1187/lines/4/restore/" —
     it is not a client-side rollback of something the server already wrote. And
     it is a shortcut, not the only route: the removed line is still on the
     order's history page after the toast has gone.

     The timer clears on focusin as well as on hover, so tabbing towards Undo
     does not make it disappear on the way, and it never runs at all under
     prefers-reduced-motion. -->
<div data-kui="toast/undo" x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       push(t) {
         const n = { id: ++this.seq, ms: 8000, timer: 0, ...t };
         this.toasts.push(n);
         this.$nextTick(() => {
           if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
           this.start(n);
         });
       },
       start(t) { if (t && t.ms && !this.still) { clearTimeout(t.timer); t.timer = setTimeout(() => this.close(t.id), t.ms); } },
       pause(t) { clearTimeout(t.timer); },
       close(id) {
         const t = this.toasts.find(x => x.id === id);
         if (t) clearTimeout(t.timer);
         this.toasts = this.toasts.filter(x => x.id !== id);
       }
     }">

  <button type="button" x-ref="fire"
          @click="push({ text: 'Line 4 removed from PO-24-1187', meta: 'MS plate 10 mm · 4.200 MT · ₹1,08,400' })"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="trash-2" class="size-4 text-zinc-600"></i>Remove line
  </button>

  <div role="status" aria-live="polite"
       class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <template x-for="t in toasts" :key="t.id">
      <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
           @mouseenter="pause(t)" @mouseleave="start(t)"
           @focusin="pause(t)" @focusout="start(t)"
           x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:enter-start="translate-y-2 opacity-0"
           x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:leave-end="translate-y-2 opacity-0">
        <span class="mt-0.5 flex size-4 shrink-0 text-zinc-500"><i data-lucide="trash-2" class="size-4"></i></span>
        <div class="min-w-0 flex-1">
          <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="shrink-0 rounded-sm text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Undo
        </button>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` },

      { id: 'link', name: 'Link to the record', code:
`<!-- The record was created somewhere the user is not. The toast says so and
     offers the way there, as a real anchor: middle-click, ctrl-click and open
     in new tab all have to work, which is the whole reason it is not a button
     with a location.href handler on it.

     The link is a shortcut, never the only route. The GRN is in the register
     the moment it exists, so a toast that expires unread costs nothing — which
     is exactly the test for whether a message may be a toast at all.

     Ten seconds rather than five, because the user has to read the number,
     decide, and travel to a target that is not under the pointer. -->
<div data-kui="toast/link" x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       push(t) {
         const n = { id: ++this.seq, ms: 10000, timer: 0, ...t };
         this.toasts.push(n);
         this.$nextTick(() => {
           if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
           this.start(n);
         });
       },
       start(t) { if (t && t.ms && !this.still) { clearTimeout(t.timer); t.timer = setTimeout(() => this.close(t.id), t.ms); } },
       pause(t) { clearTimeout(t.timer); },
       close(id) {
         const t = this.toasts.find(x => x.id === id);
         if (t) clearTimeout(t.timer);
         this.toasts = this.toasts.filter(x => x.id !== id);
       }
     }">

  <button type="button" x-ref="fire"
          @click="push({ text: 'GRN 4417 created', meta: 'Against PO-24-1187 · Nashik Steel Traders', href: '/grn/4417/', cta: 'Open GRN 4417' })"
          class="rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Create GRN
  </button>

  <div role="status" aria-live="polite"
       class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <template x-for="t in toasts" :key="t.id">
      <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
           @mouseenter="pause(t)" @mouseleave="start(t)"
           @focusin="pause(t)" @focusout="start(t)"
           x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:enter-start="translate-y-2 opacity-0"
           x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:leave-end="translate-y-2 opacity-0">
        <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
        <div class="min-w-0 flex-1">
          <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 text-zinc-600" x-text="t.meta"></p>
          <a :href="t.href" x-text="t.cta"
             class="mt-1.5 inline-block rounded-sm text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"></a>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` },

      { id: 'error', name: 'Error, no timer', code:
`<!-- ms: 0, and it is forced in push() rather than left to the call site. A
     message reporting a failure is a message somebody has to act on, and a
     timer removing it is a timer deciding they have finished reading.

     role="alert" aria-live="assertive" on a region that was already in the DOM.
     This is the case where a region created on demand costs the most: it renders
     perfectly and announces nothing, and the person who most needed to hear that
     the export failed is the one who does not.

     Even so, a toast is not where a failure is recorded. The export row behind
     this says Failed with the reason on it, and this toast is the fact that it
     happened while the user was looking somewhere else. Anything the user has to
     copy down or work from belongs in an alert on the page. -->
<div data-kui="toast/error" x-data="{
       toasts: [], seq: 0,
       push(t) {
         this.toasts.push({ id: ++this.seq, ms: 0, ...t });
         this.$nextTick(() => { if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons(); });
       },
       close(id) { this.toasts = this.toasts.filter(x => x.id !== id); }
     }">

  <button type="button" x-ref="fire"
          @click="push({ text: 'The August ledger export failed', meta: 'Row 1,842 · posting date is outside the open period' })"
          class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Export ledger
  </button>

  <div role="alert" aria-live="assertive"
       class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <template x-for="t in toasts" :key="t.id">
      <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
           x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:enter-start="translate-y-2 opacity-0"
           x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:leave-end="translate-y-2 opacity-0">
        <span class="mt-0.5 flex size-4 shrink-0 text-red-600"><i data-lucide="alert-circle" class="size-4"></i></span>
        <div class="min-w-0 flex-1">
          <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          <a href="/exports/" class="mt-1.5 inline-block rounded-sm text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            Open the export log
          </a>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` },

      { id: 'stack', name: 'Stack, capped at three', code:
`<!-- Three, and a fourth push drops the oldest. Six toasts cover the corner of
     the page, nobody reads past the second, and the region queues six
     announcements that outlast the reason for any of them.

     Dropping is not losing. Every confirmation is also a line in the activity
     log, so the counter above the stack points at the durable copy rather than
     pretending the cap has no cost. If six things really happened, one toast
     saying "6 orders approved" with a link is the better message.

     Newest is appended last and sits nearest the bottom edge, so DOM order is
     the order things happened, which is the order the region reads them.

     start() is handed the object that was just pushed, never toasts.at(-1).
     Two pushes in the same tick queue two $nextTick callbacks that both run
     after both pushes, so both would look at the same last element: one toast
     gets its timer set twice and the other never gets one at all, and it sits
     in the corner until the page is reloaded. -->

<div data-kui="toast/stack" x-data="{
       toasts: [], seq: 0, cap: 3, dropped: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       push(t) {
         const n = { id: ++this.seq, ms: 5000, timer: 0, ...t };
         this.toasts.push(n);
         while (this.toasts.length > this.cap) { this.dropped++; this.close(this.toasts[0].id); }
         this.$nextTick(() => {
           if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
           this.start(n);
         });
       },
       start(t) { if (t && t.ms && !this.still) { clearTimeout(t.timer); t.timer = setTimeout(() => this.close(t.id), t.ms); } },
       pause(t) { clearTimeout(t.timer); },
       close(id) {
         const t = this.toasts.find(x => x.id === id);
         if (t) clearTimeout(t.timer);
         this.toasts = this.toasts.filter(x => x.id !== id);
       }
     }">

  <button type="button" x-ref="fire"
          @click="push({ text: 'PO-24-1' + (180 + seq) + ' approved', meta: '₹' + (3 + seq) + ',26,500 · Nashik Steel Traders' })"
          class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Approve next order
  </button>

  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <!-- outside the live region: a counter is not a message, and announcing it
         on every push would read the same sentence four times -->
    <p x-show="dropped" x-cloak class="pointer-events-auto self-start rounded-lg bg-zinc-200 px-2.5 py-1 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span class="tabular-nums" x-text="dropped"></span> more in the
      <a href="/activity/" class="rounded-sm font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">activity log</a>
    </p>

    <div role="status" aria-live="polite" class="flex flex-col gap-2">
      <template x-for="t in toasts" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             @mouseenter="pause(t)" @mouseleave="start(t)" @focusin="pause(t)" @focusout="start(t)"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>
  </div>
</div>` },

      { id: 'pending', name: 'Pending, then resolved', code:
`<!-- One toast, patched in place. The same id and the same node: the text and
     the icon are swapped when the request settles, so the stack does not
     reshuffle under the pointer and the region announces the change rather than
     a second message. The default aria-relevant covers text changes, which is
     what makes updating in place work at all.

     No timer while it is pending — a toast that expires with the request still
     in flight leaves the user with no answer either way. The timer is set when
     the reply lands, and only if the reply is good news.

     The spinner is the border ring, not a Lucide loader. An <i data-lucide> has
     no box until createIcons() has run over it, which is exactly what an element
     appended after page load cannot count on.

     Two seconds of waiting belongs here. A job that outlives the request belongs
     in an alert on the page with a progress bar, because the user will navigate
     away and the toast will not survive it. -->
<div data-kui="toast/pending" x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       push(t) {
         const n = { id: ++this.seq, tone: 'pending', ms: 0, timer: 0, ...t };
         this.toasts.push(n);
         this.$nextTick(() => { if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons(); });
         return n.id;
       },
       settle(id, patch) {
         const t = this.toasts.find(x => x.id === id);
         if (!t) return;
         Object.assign(t, patch);
         this.$nextTick(() => {
           if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
           this.start(t);
         });
       },
       start(t) { if (t && t.ms && !this.still) { clearTimeout(t.timer); t.timer = setTimeout(() => this.close(t.id), t.ms); } },
       pause(t) { clearTimeout(t.timer); },
       close(id) {
         const t = this.toasts.find(x => x.id === id);
         if (t) clearTimeout(t.timer);
         this.toasts = this.toasts.filter(x => x.id !== id);
       },
       post() {
         const id = this.push({ text: 'Posting GRN 4417', meta: 'Against PO-24-1187' });
         setTimeout(() => this.settle(id, { tone: 'success', text: 'GRN 4417 posted', meta: '12.480 MT received · ₹4,26,500', ms: 5000 }), 2000);
       }
     }">

  <button type="button" x-ref="fire" @click="post()"
          class="rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Post GRN
  </button>

  <div role="status" aria-live="polite"
       class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <template x-for="t in toasts" :key="t.id">
      <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
           @mouseenter="pause(t)" @mouseleave="start(t)" @focusin="pause(t)" @focusout="start(t)"
           x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:enter-start="translate-y-2 opacity-0"
           x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:leave-end="translate-y-2 opacity-0">
        <template x-if="t.tone === 'pending'">
          <span class="mt-0.5 size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700" aria-hidden="true"></span>
        </template>
        <template x-if="t.tone === 'success'">
          <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
        </template>
        <div class="min-w-0 flex-1">
          <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` },

      { id: 'dismiss-all', name: 'Dismiss all', code:
`<!-- The control appears at two toasts and sits above the stack, outside the
     live region. Inside it, its own arrival would be announced as a message and
     the count changing would be announced again on every push.

     Escape is bound on window, not on the region. Nothing inside a toast holds
     focus unless the user tabbed into it, so a region-scoped keydown would only
     work in the one case that needed it least. It removes toasts and nothing
     else, so a dialog closing on the same keypress loses nothing.

     Clearing the stack destroys the element focus is on. $event.detail === 0
     means the click came from Enter or Space rather than a pointer, and only
     then is focus put back on the control that raised the toasts — a mouse user
     gets no focus jump they did not ask for. -->
<div data-kui="toast/dismiss-all" x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       push(t) {
         const n = { id: ++this.seq, ms: 6000, timer: 0, ...t };
         this.toasts.push(n);
         this.$nextTick(() => {
           if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
           this.start(n);
         });
       },
       start(t) { if (t && t.ms && !this.still) { clearTimeout(t.timer); t.timer = setTimeout(() => this.close(t.id), t.ms); } },
       pause(t) { clearTimeout(t.timer); },
       close(id) {
         const t = this.toasts.find(x => x.id === id);
         if (t) clearTimeout(t.timer);
         this.toasts = this.toasts.filter(x => x.id !== id);
       },
       closeAll() { this.toasts.forEach(t => clearTimeout(t.timer)); this.toasts = []; }
     }"
     @keydown.escape.window="closeAll()">

  <button type="button" x-ref="fire"
          @click="push({ text: 'Batch B-2411' + seq + ' released', meta: 'QC passed · 480 kg' })"
          class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Release batch
  </button>

  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <button type="button" x-show="toasts.length > 1" x-cloak
            @click="closeAll(); if ($event.detail === 0) $refs.fire.focus()"
            class="pointer-events-auto self-start rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium text-zinc-600 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      Dismiss all <span class="tabular-nums" x-text="toasts.length"></span>
    </button>

    <div role="status" aria-live="polite" class="flex flex-col gap-2">
      <template x-for="t in toasts" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             @mouseenter="pause(t)" @mouseleave="start(t)" @focusin="pause(t)" @focusout="start(t)"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>
  </div>
</div>` },

      { id: 'posting', name: 'Posting a GRN', code:
`<!-- The assembled case. Post the receipt, the toast confirms it, Undo reverses
     it inside the window the server allows.

     The card behind the toast is the point. Posting flips the row to Closed with
     the GRN number on it before the toast is raised, and undoing flips it back,
     so the toast is a convenience over a screen that is already correct. Delete
     the toast from this snippet and nothing is lost except the shortcut — that
     is the test for whether an outcome may be reported in a toast at all.

     Eight seconds, matching the server's undo window. Hovering or tabbing into
     the toast clears the timer; under prefers-reduced-motion no timer is set and
     it waits to be dismissed.

     Status colour is the locked mapping and lives in the dot: zinc-500 Open,
     emerald-600 Closed. The pill around it never changes. -->
<div data-kui="toast/posting" class="max-w-xl"
     x-data="{
       posted: false, grn: null, toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       post() {
         this.posted = true; this.grn = 4417;
         this.push({ text: 'GRN ' + this.grn + ' posted against PO-24-1187', meta: 'Nashik Steel Traders · 12.480 MT · ₹4,26,500' });
       },
       undo(id) {
         this.posted = false; this.grn = null;
         this.close(id);
       },
       push(t) {
         const n = { id: ++this.seq, ms: 8000, timer: 0, ...t };
         this.toasts.push(n);
         this.$nextTick(() => {
           if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
           this.start(n);
         });
       },
       start(t) { if (t && t.ms && !this.still) { clearTimeout(t.timer); t.timer = setTimeout(() => this.close(t.id), t.ms); } },
       pause(t) { clearTimeout(t.timer); },
       close(id) {
         const t = this.toasts.find(x => x.id === id);
         if (t) clearTimeout(t.timer);
         this.toasts = this.toasts.filter(x => x.id !== id);
       }
     }">

  <div class="rounded-xl border border-zinc-300 bg-white">
    <div class="flex flex-wrap items-center gap-3 border-b border-zinc-200 px-4 py-3">
      <div class="min-w-0 flex-1">
        <h3 class="text-[16px]/6 font-semibold">Receipt against PO-24-1187</h3>
        <p class="mt-0.5 text-[12px]/4 text-zinc-600">Nashik Steel Traders · gate entry 20 Aug 2024, 09:15</p>
      </div>
      <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 rounded-full" :class="posted ? 'bg-emerald-600' : 'bg-zinc-500'" aria-hidden="true"></span>
        <span x-text="posted ? 'Closed' : 'Open'"></span>
      </span>
    </div>

    <dl class="divide-y divide-zinc-100 text-[13px]/5">
      <div class="flex items-center justify-between gap-4 px-4 py-2.5">
        <dt class="text-zinc-600">MS plate 10 mm</dt>
        <dd class="shrink-0 tabular-nums">12.480 MT</dd>
      </div>
      <div class="flex items-center justify-between gap-4 px-4 py-2.5">
        <dt class="text-zinc-600">Receipt value</dt>
        <dd class="shrink-0 tabular-nums">₹4,26,500</dd>
      </div>
      <div class="flex items-center justify-between gap-4 px-4 py-2.5">
        <dt class="text-zinc-600">GRN</dt>
        <dd class="shrink-0">
          <a x-show="posted" x-cloak :href="'/grn/' + grn + '/'" class="rounded-sm tabular-nums text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15" x-text="grn"></a>
          <span x-show="!posted" class="text-zinc-500">Not posted</span>
        </dd>
      </div>
    </dl>

    <div class="flex justify-end gap-2 border-t border-zinc-200 px-4 py-3">
      <button type="button" x-ref="fire" @click="post()" :disabled="posted"
              class="rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Post GRN
      </button>
    </div>
  </div>

  <!-- empty at first paint, and never created on demand -->
  <div role="status" aria-live="polite"
       class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <template x-for="t in toasts" :key="t.id">
      <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
           @mouseenter="pause(t)" @mouseleave="start(t)"
           @focusin="pause(t)" @focusout="start(t)"
           x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:enter-start="translate-y-2 opacity-0"
           x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:leave-end="translate-y-2 opacity-0">
        <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
        <div class="min-w-0 flex-1">
          <p class="text-[13px]/5 font-medium" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button"
                @click="undo(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="shrink-0 rounded-sm text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Undo
        </button>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` }
    ]
  },

  {
    id: 'alert-dialog', name: 'Alert dialog', category: 'feedback',
    description: 'A dialog that interrupts to ask one question with two answers. Unlike a plain dialog it does not dismiss on a backdrop click — the user has to choose.',
    when: 'Anything destructive, irreversible, or expensive to undo: deleting a record, closing an order, discarding unsaved work, acting on a selection. If the answer does not matter much, do not interrupt at all.',
    notes: [
      'No @click.self on the backdrop. A dialog dismisses on a stray backdrop click; an alert dialog must not — the user is being asked a question and a misplaced click is not an answer.',
      'Escape still closes, and it means cancel. Taking that away makes the dialog a trap, which is a worse failure than an accidental dismissal.',
      'role="alertdialog", not role="dialog". It tells a screen reader to announce the body immediately instead of waiting for the user to navigate to it — which only works if aria-describedby points at that body.',
      'x-trap.noscroll does three jobs: it traps Tab inside the dialog, it returns focus to the trigger on close, and it locks the page behind. Without it Tab walks straight out into the page underneath, which is still fully interactive.',
      'The focus trap lands on the first focusable element, so order the DOM to make that the safe one — Cancel, or the input in a typed confirmation. Focus must never open on the button that deletes something, even though it is the last one visually.',
      'Name the record in the heading. "Are you sure?" tells the user nothing about what they are about to lose.',
      'Say what else goes with it. If deleting the order also deletes a GRN and two approvals, that belongs in the dialog, not in a toast afterwards.',
      'The confirm button repeats the verb — "Delete order", never "OK". Someone who reads only the buttons still knows what is about to happen.'
    ],
    anatomy: [
      ['Backdrop', 'Dims the page and centres the panel. It carries no click handler at all — that is the whole difference from a dialog.'],
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
    related: ['dialog', 'alert', 'sheet'],
    variants: [
      { id: 'confirm', name: 'Confirm', code:
`<div data-kui="alert-dialog/confirm" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Close order</button>

  <!-- no @click.self here, and that is deliberate: the backdrop does not answer for the user -->
  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="close-title" aria-describedby="close-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
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
`<div data-kui="alert-dialog/destructive" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Delete order</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="del-title" aria-describedby="del-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
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
<div data-kui="alert-dialog/typed" x-data="{ open: false, typed: '', target: 'SHARMA-EXT' }">
  <button type="button" @click="open = true; typed = ''"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Delete vendor</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="wipe-title" aria-describedby="wipe-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <h2 id="wipe-title" class="text-[16px]/6 font-semibold">Delete Sharma Extrusions</h2>
      <p id="wipe-body" class="mt-1.5 text-[13px]/5 text-zinc-600">
        <span class="font-medium text-red-600">34 orders, 61 invoices and the rate contract</span>
        are attached to this vendor and go with it. There is no recycle bin and no undo.
      </p>

      <div class="mt-4">
        <label for="wipe-code" class="mb-1.5 block text-[13px]/5 font-medium">
          Type <code class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px]/4" x-text="target"></code> to confirm
        </label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
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
<div data-kui="alert-dialog/bulk" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve 12 selected</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="bulk-title" aria-describedby="bulk-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
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
<div data-kui="alert-dialog/unsaved" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Leave page</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="leave-title" aria-describedby="leave-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
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
    id: 'dialog', name: 'Dialog', category: 'feedback',
    description: 'A centred, dismissible panel over a dimmed page. Use it to take a handful of fields without leaving the list.',
    when: 'Short forms and anything the user can walk away from. A form longer than about six fields belongs on its own page; a record to read belongs in a sheet; a question that must be answered belongs in an alert dialog.',
    notes: [
      'Close on escape and on a backdrop click with @click.self. A dialog with no way out except the button is a trap.',
      'A native picker inside the panel needs no guard against the escape handler. A select popup and a date picker both swallow Escape whole: the popup closes and no keydown reaches the page at all, so @keydown.escape.window never fires and the panel stays open. A second Escape then closes the panel, which is the same two-stage handling the combobox does deliberately. Measured in Chromium against a select and an input[type=date] opened with showPicker. Do not add a guard that skips Escape when the target is a picker field: that would break Escape closing the panel while such a field merely has focus, which works today.',
      'x-cloak on the overlay, otherwise it flashes over the page on load.',
      'x-trap.noscroll on the backdrop, exactly as the alert dialog uses it: Tab stays inside the panel, focus returns to the trigger on close, and the page behind stops scrolling. @click.self sits on the same element and still fires — the focus plugin runs with allowOutsideClick, and a click on the backdrop is inside the trap anyway.',
      'x-trap opens focus on the first element inside the panel carrying autofocus, and on the first focusable element when there is none. Put autofocus on the first field when the panel exists to be typed into; leave it off when the panel is only read, and focus lands on the close button, which is the safe one.',
      'A dialog is dismissible by definition. The moment a stray backdrop click would lose the user something, it is an alert dialog and it belongs in that component instead.'
    ],
    anatomy: [
      ['Backdrop', 'A zinc-900/40 field that dims the page and carries @click.self to dismiss, plus x-trap.noscroll to hold focus and lock the page behind.'],
      ['Panel', 'Centred, rounded-xl, max-w-md for a form and max-w-lg when the body scrolls. Capped at 80vh in every variant.'],
      ['Header', 'The title and a close button, on a bordered strip that does not scroll.'],
      ['Body', 'The fields, or the content. This is the only part that scrolls.'],
      ['Footer', 'Cancel and the primary action, right-aligned on a zinc-100 strip that does not scroll.']
    ],
    behaviour: [
      'Escape closes, a backdrop click closes, and the close button closes. All three, always.',
      'Opening moves focus into the panel: onto the first field where there is one to fill in, otherwise onto the close button.',
      'Tab and Shift+Tab cycle inside the panel only. Nothing behind it is reachable while it is open.',
      'Closing returns focus to the control that opened it, so the keyboard does not lose its place.',
      'In the scrolling variant only the body moves; the header and footer stay, so the primary action never scrolls out of reach.',
      'Every panel is capped at 80vh with the body scrolling inside it, so a dialog never grows past the viewport on a laptop or in landscape on a phone.',
      'The page behind does not scroll while the dialog is open, and it does not jump sideways when its scrollbar goes — x-trap.noscroll pads for the width it removes.',
      'A form longer than about six fields belongs on a page. A dialog that scrolls a long form is a page in a costume.'
    ],
    a11y: [
      'role="dialog" with aria-modal="true" and aria-labelledby pointing at the heading.',
      'Focus moves into the panel on open and returns to the trigger on close — x-trap from @alpinejs/focus does both, the same as the alert dialog.',
      'Focus is trapped inside while it is open, so Tab cannot walk out into the page underneath, which is still fully rendered.',
      'A form dialog opens on its first field, marked with autofocus, which x-trap honours. A read-only one opens on the close button.',
      'The close button carries aria-label="Close".',
      'Escape works from anywhere inside the panel, including from within a focused input.'
    ],
    related: ['alert-dialog', 'sheet', 'form-page'],
    variants: [
      { id: 'form', name: 'Form dialog', code:
`<div data-kui="dialog/form" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
    <i data-lucide="plus" class="size-4"></i>Record GRN
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="grn-title"
         class="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="grn-title" class="text-[16px]/6 font-semibold">Record GRN</h2>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">PO-24-1187 · Sharma Extrusions</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div>
          <label for="grn-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity received <span class="text-red-600">*</span></label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <!-- x-trap opens focus on [autofocus] if the panel has one, otherwise on the close button -->
            <input id="grn-qty" autofocus value="4,200" class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
            <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
          </div>
          <p class="mt-1.5 text-[12px]/4 text-zinc-500">Ordered 12,000 kg, received 7,800 kg so far.</p>
        </div>

        <div class="mt-4">
          <label for="grn-date" class="mb-1.5 block text-[13px]/5 font-medium">Receipt date <span class="text-red-600">*</span></label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <input id="grn-date" type="date" value="2024-08-19" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
          </div>
        </div>
      </div>

      <div class="flex shrink-0 flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Save</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'scrolling', name: 'Scrolling body', code:
`<!-- Header and footer stay put, only the middle scrolls. max-h on the panel,
     overflow-y on the body, and min-h-0 so the flex child is allowed to shrink. -->
<div data-kui="dialog/scrolling" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Review 6 lines</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="lines-title"
         class="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
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

      { id: 'reference', name: 'Reference panel', code:
`<!-- Read-only, nothing to submit, so the only control is a close button. -->
<div data-kui="dialog/reference" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="keyboard" class="size-4"></i>Shortcuts
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="keys-title"
         class="flex max-h-[80vh] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <h2 id="keys-title" class="text-[16px]/6 font-semibold">Keyboard shortcuts</h2>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
      <dl class="min-h-0 flex-1 overflow-y-auto px-5 py-2">
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
    id: 'sheet', name: 'Sheet', category: 'feedback',
    description: 'A panel that slides in from the right over the page. Shows a record, or the filters for a list, without losing the user\'s place in it.',
    when: 'Reading or filtering while the list stays behind. If the user has to edit a lot, send them to a page instead — a sheet is too narrow for a long form.',
    notes: [
      'Full width below sm, fixed width above it. A 448px sheet on a 390px phone is a horizontal scrollbar.',
      'The body scrolls, the header and footer do not. overflow-y-auto goes on the middle section only.',
      'Escape and backdrop both close it, same as a dialog.',
      'x-trap.noscroll on the backdrop, the same as the dialog and the alert dialog: Tab stays inside the panel, focus returns to the row that opened it on close, and the list behind stops scrolling.',
      'motion-reduce:transition-none and motion-reduce:duration-0 ride along on both x-transition class lists. Alpine puts the panel in its final position by removing translate-x-full itself rather than waiting on a transitionend, so killing the transition still lands the sheet open — it just gets there in one frame. duration-0 is the second half of it: Alpine reads the computed transition-duration to decide how long to hold the element before hiding it, so without it the backdrop would sit on screen for another 150ms after the panel had already gone.',
      'None of the transition classes are in the stylesheet when the page first paints, because they live in x-transition attributes and the browser build scans class attributes only. That is not a defect and it does not want a safelist. Tailwind compiles a class when Alpine writes it onto the element, and Alpine holds translate-x-full on the panel for a frame before taking it off again, which is long enough for the rule to exist before the start style is read. Measured on this page: ten eased frames between 100% and 0 with motion allowed, and two values with nothing in between under prefers-reduced-motion. Check it by reading the translate property and not transform, because Tailwind v4 compiles translate-x-full to the independent translate property and transform stays none the whole way, which reads as a dead animation when it is nothing of the sort.'
    ],
    anatomy: [
      ['Backdrop', 'The same dimmed field as a dialog, dismissing on @click.self and carrying x-trap.noscroll to hold focus and lock the list behind.'],
      ['Panel', 'Anchored right, full height, full width below sm and a fixed width above it.'],
      ['Header', 'The record\'s name and a close button. Fixed.'],
      ['Body', 'The only scrolling section — overflow-y-auto goes here and nowhere else.'],
      ['Footer', 'The actions for the record. Fixed, so they are reachable from anywhere in a long body.']
    ],
    behaviour: [
      'It slides in from the right and the list stays visible behind it, which is the whole point of choosing a sheet.',
      'Full width below sm. A 448px panel on a 390px phone is a horizontal scrollbar.',
      'Escape and a backdrop click both close it, the same as a dialog.',
      'The body scrolls independently; the header and footer do not move.',
      'Tab stays inside the panel while it is open. The list behind is visible but not reachable, and it does not scroll.',
      'Under prefers-reduced-motion the panel appears in place instead of sliding across.',
      'For heavy editing, send the user to a page. A sheet is too narrow for a long form and they will fight the width.'
    ],
    a11y: [
      'role="dialog" with aria-modal="true", labelled by the record name in the header.',
      'Focus enters the panel on open and returns to the row that opened it on close — x-trap does both.',
      'Focus is trapped while open, or Tab walks into the list behind and the user is lost.',
      'Focus lands on the close button, the first focusable element in the panel and the one that costs nothing to press.',
      'The close button carries aria-label="Close".',
      'The slide transition respects prefers-reduced-motion, through motion-reduce:transition-none and motion-reduce:duration-0 on both x-transition class lists. The panel still ends up open and in place; it just does not travel.'
    ],
    related: ['dialog', 'list-detail', 'table'],
    variants: [
      { id: 'record', name: 'Record detail', code:
`<div data-kui="sheet/record" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Open PO-24-1187</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-200 bg-white shadow-lg sm:w-[28rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <p class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase tabular-nums">PO-24-1187</p>
          <h2 id="sheet-title" class="mt-0.5 truncate text-[16px]/6 font-semibold">MS angles and plates — August lot</h2>
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
          <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
            <div class="h-full rounded-full bg-zinc-700" style="width: 65%"></div>
          </div>
          <p class="mt-2 text-[12px]/4 text-zinc-500">Last receipt GRN 1142 on 16 Aug 2024.</p>
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">Print order</button>
        <button type="button" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Record GRN</button>
      </div>
    </div>
  </div>
</div>` },
      { id: 'filters', name: 'Filters', code:
`<div data-kui="sheet/filters" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="sliders-horizontal" class="size-4"></i>Filters
    <span class="rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-1.5 text-[11px]/4 font-medium tabular-nums">2</span>
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="filters-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
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
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
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
            <div class="min-w-[8rem] flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="f-from" type="date" value="2024-08-01" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            </div>
            <span class="text-[13px]/5 text-zinc-500">to</span>
            <div class="min-w-[8rem] flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="f-to" aria-label="Raised to" type="date" value="2024-08-31" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            </div>
          </div>
        </div>

        <div class="mt-4">
          <label for="f-min" class="mb-1.5 block text-[13px]/5 font-medium">Minimum value</label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
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
    id: 'drawer', name: 'Drawer', category: 'feedback',
    description: 'A panel that rises from the bottom edge, sized to its content and capped short of the viewport. The phone-shaped place to put a short action list or a quick filter, because the bottom of the screen is where the thumb already is.',
    when: 'Mobile-first screens that need a few actions, a quick filter, or a short list picked from. On a desktop reach for a sheet, which comes in from the right, or a dialog, which centres — a bar across the bottom of a wide window is not a panel, it is a shelf.',
    notes: [
      'The grab handle is a visual affordance and nothing more. There is no drag or swipe handler in this markup: the panel closes on a backdrop click, on Escape, or on a control inside it. Ship it as decoration or ship a real gesture, but do not tell the user to pull something that does not move.',
      'Cap the height with max-h-[calc(100dvh-6rem)] and let the body scroll inside via min-h-0 flex-1 overflow-y-auto. A panel that reaches the top of the screen has stopped being a panel, and a page deserves a URL.',
      'dvh, not vh. On a phone the browser chrome comes and goes and vh does not notice, so a vh-capped panel spends half its life under the address bar.',
      'The same backdrop idiom as dialog and sheet — x-trap.noscroll for the focus trap, the return of focus and the scroll lock, @click.self to dismiss, escape on the window. There is nothing special about being at the bottom.',
      'translate-y-full is the start and the end state, and motion-reduce:transition-none plus motion-reduce:duration-0 ride along on both x-transition class lists. The second one matters as much as the first: Alpine reads the computed transition-duration to decide how long to keep the element on screen before hiding it, so without it the backdrop lingers after the panel has gone.',
      'Full width and flush to the bottom edge, rounded on the top two corners only, with sm:max-w-md so it does not stretch into a stripe on a laptop. The bottom corners are square because there is nothing behind them.',
      'Rows in an action list are buttons at py-3, not py-1.5 menu items. This is being tapped by a thumb, not clicked by a mouse.'
    ],
    anatomy: [
      ['Backdrop', 'The same dimmed field as a dialog, dismissing on @click.self and carrying x-trap.noscroll. items-end is the only difference — it parks the panel on the bottom edge.'],
      ['Handle', 'A 36×4 zinc-300 bar centred above the header, aria-hidden. It says "this thing came from the bottom"; it does not do anything.'],
      ['Panel', 'Full width, rounded-t-2xl, as tall as its content and never taller than calc(100dvh-6rem).'],
      ['Header', 'The record or the question, and a close button. Does not scroll.'],
      ['Body', 'The actions or the fields. The only scrolling section, and only once the content outgrows the cap.'],
      ['Footer', 'Present when there is something to apply or cancel. Fixed, so the primary action never scrolls out from under the thumb.']
    ],
    behaviour: [
      'It rises from the bottom edge, and the page it came from stays visible above it.',
      'The panel is as tall as its content. Past calc(100dvh-6rem) it stops growing and the body scrolls inside, with the handle, header and footer staying put.',
      'Escape closes it, a backdrop click closes it, and the controls inside close it. Dragging the handle does not, because nothing is bound to a drag.',
      'Opening moves focus into the panel: onto the control marked autofocus where there is one, otherwise onto the close button.',
      'Tab and Shift+Tab cycle inside the panel only, and the page behind does not scroll while it is open.',
      'Closing returns focus to the control that opened it.',
      'Under prefers-reduced-motion the panel appears in place instead of rising.',
      'Above sm the panel stops at max-w-md and centres, still on the bottom edge. If that looks wrong on the screen you are building, the screen wanted a sheet or a dialog.'
    ],
    a11y: [
      'role="dialog" with aria-modal="true" and aria-labelledby pointing at the heading.',
      'x-trap.noscroll moves focus into the panel on open, keeps Tab inside it, and returns focus to the trigger on close.',
      'The filter panel opens on its first control through autofocus, which x-trap honours. The action list has nothing to type into, so focus lands on the close button, which is the one that costs nothing to press.',
      'The close button carries aria-label="Close".',
      'The handle is aria-hidden="true". Announcing it would promise a gesture that is not implemented.',
      'Escape closes the panel from anywhere inside it, including from within a focused field.',
      'The rise respects prefers-reduced-motion through motion-reduce:transition-none and motion-reduce:duration-0 on both x-transition class lists. The panel still ends up open and in place; it just does not travel.'
    ],
    related: ['sheet', 'dialog', 'dropdown'],
    variants: [
      { id: 'actions', name: 'Action list', code:
`<div data-kui="drawer/actions" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="ellipsis" class="size-4"></i>PO-24-1187
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="po-actions-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-y-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-y-full"
         class="flex max-h-[calc(100dvh-6rem)] w-full flex-col rounded-t-2xl border-t border-zinc-200 bg-white shadow-lg sm:max-w-md">

      <div class="flex shrink-0 justify-center pt-2.5 pb-1">
        <div class="h-1 w-9 rounded-full bg-zinc-300" aria-hidden="true"></div>
      </div>

      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-5 pt-2 pb-3">
        <div class="min-w-0">
          <h2 id="po-actions-title" class="text-[16px]/6 font-semibold">PO-24-1187</h2>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Sharma Extrusions · <span class="tabular-nums">₹18,42,000</span> · Approved</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-2">
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100">
          <i data-lucide="package-check" class="size-4 shrink-0 text-zinc-500"></i>Record GRN
        </button>
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100">
          <i data-lucide="printer" class="size-4 shrink-0 text-zinc-500"></i>Print order
        </button>
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100">
          <i data-lucide="send" class="size-4 shrink-0 text-zinc-500"></i>Email to vendor
        </button>
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100">
          <i data-lucide="copy" class="size-4 shrink-0 text-zinc-500"></i>Duplicate as new order
        </button>
        <div class="my-1 border-t border-zinc-100"></div>
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 text-red-700 hover:bg-red-50">
          <i data-lucide="ban" class="size-4 shrink-0"></i>Cancel order
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'filter', name: 'Quick filter', code:
`<div data-kui="drawer/filter" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="sliders-horizontal" class="size-4"></i>Filters
    <span class="rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 px-1.5 text-[11px]/4 font-medium tabular-nums">1</span>
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="quick-filter-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-y-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-y-full"
         class="flex max-h-[calc(100dvh-6rem)] w-full flex-col rounded-t-2xl border-t border-zinc-200 bg-white shadow-lg sm:max-w-md">

      <div class="flex shrink-0 justify-center pt-2.5 pb-1">
        <div class="h-1 w-9 rounded-full bg-zinc-300" aria-hidden="true"></div>
      </div>

      <div class="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-100 px-5 pt-2 pb-3">
        <h2 id="quick-filter-title" class="text-[16px]/6 font-semibold">Filter orders</h2>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div>
          <label for="bs-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <select id="bs-vendor" autofocus class="w-full bg-transparent px-3 py-2.5 text-[14px]/5 outline-none">
              <option>All vendors</option>
              <option selected>Sharma Extrusions</option>
              <option>Nashik Steel Traders</option>
              <option>Gujarat Polymers Ltd</option>
            </select>
          </div>
        </div>

        <fieldset class="mt-4">
          <legend class="mb-2 text-[13px]/5 font-medium">Status</legend>
          <label class="flex items-center gap-3 py-2 text-[14px]/5"><input type="radio" name="bs-status" checked class="size-4 accent-zinc-700">Any status</label>
          <label class="flex items-center gap-3 py-2 text-[14px]/5"><input type="radio" name="bs-status" class="size-4 accent-zinc-700">Open</label>
          <label class="flex items-center gap-3 py-2 text-[14px]/5"><input type="radio" name="bs-status" class="size-4 accent-zinc-700">Awaiting approval</label>
          <label class="flex items-center gap-3 py-2 text-[14px]/5"><input type="radio" name="bs-status" class="size-4 accent-zinc-700">Overdue</label>
        </fieldset>

        <label class="mt-2 flex items-center gap-3 py-2 text-[14px]/5">
          <input type="checkbox" checked class="size-4 rounded accent-zinc-700">Only orders raised by me
        </label>
      </div>

      <div class="flex shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" class="rounded-lg px-4 py-2.5 text-[13px]/5 font-medium text-zinc-900 hover:bg-white">Reset</button>
        <button type="button" @click="open = false"
                class="flex-1 rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Show 24 orders</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'long', name: 'Longer than the cap', code:
`<!-- More rows than the cap allows, so the body scrolls and everything else holds still. -->
<div data-kui="drawer/long" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="plus" class="size-4"></i>Add a line
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="material-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-y-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-y-full"
         class="flex max-h-[calc(100dvh-6rem)] w-full flex-col rounded-t-2xl border-t border-zinc-200 bg-white shadow-lg sm:max-w-md">

      <div class="flex shrink-0 justify-center pt-2.5 pb-1">
        <div class="h-1 w-9 rounded-full bg-zinc-300" aria-hidden="true"></div>
      </div>

      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-5 pt-2 pb-3">
        <div class="min-w-0">
          <h2 id="material-title" class="text-[16px]/6 font-semibold">Choose a material</h2>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Rates from the Sharma Extrusions contract</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-2">
        <template x-for="m in [
          { name: 'MS angle 50×50×6', rate: '₹57.00' },
          { name: 'MS angle 65×65×6', rate: '₹58.50' },
          { name: 'MS plate 10 mm', rate: '₹78.00' },
          { name: 'MS plate 12 mm', rate: '₹78.40' },
          { name: 'MS channel 100×50', rate: '₹67.85' },
          { name: 'MS channel 125×65', rate: '₹69.10' },
          { name: 'MS flat 40×6', rate: '₹70.00' },
          { name: 'MS flat 50×8', rate: '₹70.60' },
          { name: 'MS round bar 20 mm', rate: '₹70.00' },
          { name: 'MS round bar 25 mm', rate: '₹70.90' },
          { name: 'MS square tube 40×40', rate: '₹37.80' },
          { name: 'MS square tube 50×50', rate: '₹38.40' }
        ]" :key="m.name">
          <button type="button" @click="open = false"
                  class="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-3 text-left hover:bg-zinc-100">
            <span class="min-w-0 truncate text-[14px]/5" x-text="m.name"></span>
            <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600"><span x-text="m.rate"></span> / kg</span>
          </button>
        </template>
      </div>

      <div class="flex shrink-0 justify-end border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-100">Cancel</button>
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
<div data-kui="badge/status" class="flex flex-wrap items-center gap-2">
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
<div data-kui="badge/inline" class="max-w-md rounded-xl border border-zinc-300 bg-white p-4">
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
<div data-kui="badge/sizes" class="flex flex-wrap items-center gap-4">
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
<div data-kui="badge/icon" class="flex flex-wrap items-center gap-2">
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
<div data-kui="badge/filter" class="flex flex-wrap items-center gap-2" x-data="{ on: ['overdue'] }">
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
<div data-kui="badge/removable" class="flex flex-wrap items-center gap-2" x-data="{ tags: ['Sharma Extrusions', 'Open', '₹1,00,000+'] }">
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
<div data-kui="badge/count" class="flex flex-wrap items-center gap-4">
  <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    Pending approval
    <span class="rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium tabular-nums ring-1 ring-inset ring-zinc-300">12</span>
  </button>

  <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100">
    Overdue
    <span class="rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">3</span>
  </button>

  <button type="button" aria-label="Notifications, 99 or more unread"
          class="relative flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100">
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
<div data-kui="badge/table" class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <table class="w-full table-fixed text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
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
        <tr class="border-b border-zinc-100 bg-zinc-50">
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
<span data-kui="badge/django" class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
  <span class="size-1.5 rounded-full {{ order.status|status_dot }}" aria-hidden="true"></span>
  {{ order.get_status_display }}
</span>` }
    ]
  },

  {
    id: 'tooltip', name: 'Tooltip', category: 'feedback',
    description: 'A short dark bubble that names the control under the pointer or under the keyboard. It carries a label and nothing else — no controls, no facts that are not already somewhere the user can reach without hovering.',
    when: 'A control that has no visible text and needs one word saying what it does: an icon button in a row of them, a rail item, an abbreviated column header, a cell whose text had to be truncated. The three neighbours draw the boundary and it is worth being exact about, because all three are a small floating panel and only one of them is this. A tooltip is the name of a control — hover or focus, text only, nothing in it to reach, and it may hold nothing the user cannot get another way. A hovercard is hover as well but it is a preview of a record: a white panel, several facts, one link, and it pays for being reachable with an open delay, a close delay and a pointer bridge. A popover is click, and it contains focusable, operable things — a filter, a column list, an inline edit. A tooltip that holds a button is a popover drawn wrong; a tooltip that holds four figures about a record is a hovercard drawn wrong; and a hovercard used to name an icon button is a tooltip drawn at four times the weight, which then cannot be dismissed with Escape because nobody built that for a label. The sidebar rail is the largest single consumer of this component and its icon items are the canonical case.',
    notes: [
      'Never the native title attribute. It has no keyboard route at all — a title never appears on focus, so every icon button labelled that way is unnamed for anyone driving with a keyboard. Its delay is roughly a second and cannot be shortened, it self-destructs after about five while the user is still reading it, it is invisible on touch, it cannot be styled or positioned, and it renders under the pointer where it covers the next control along. It is also read three different ways by three screen readers — as the name when nothing else supplies one, as a description when something does, and skipped entirely by readers configured to ignore it. Write the bubble.',
      'Which naming attribute you use depends on whether the trigger already has a name, and getting it backwards is the defect this component exists to prevent. The trigger has no visible text and the bubble text is its name: aria-labelledby at the bubble id, or aria-label on the trigger with the bubble aria-hidden. The trigger already has a name — visible text, or an aria-label saying something the bubble does not repeat — and the bubble adds to it: aria-describedby. aria-describedby on a bare icon button gives a control announced as "button", with its actual name arriving late as a description or not at all; an aria-label plus a bubble the name is also computed from gives a control announced twice.',
      'Do not add and remove the naming attribute as the bubble shows and hides. Name and description computation reaches referenced elements that are display:none on purpose, so aria-labelledby at a hidden bubble names the button for the whole session, which is what you want — the button is not nameless between hovers. Toggling the attribute instead makes some readers re-announce the control every time the pointer crosses it.',
      'Nothing in a tooltip may be interactive, and pointer-events-none on the bubble is what enforces it rather than decorates it. Without it the bubble eats the hover of whatever it covers and flickers as the pointer crosses; with it, a link inside is unclickable and a screen reader user has been told about something that does not work. This is also why a tooltip needs none of the hovercard\'s machinery — no open bridge, no close delay, no hoverable panel — because nothing in it can be reached, and the moment something can, it stopped being a tooltip.',
      'It opens on focus-visible, not on focus. Bound to plain focus, every click on an icon button leaves a bubble hanging over the toolbar until the pointer moves somewhere else, because a click focuses the button. Test $event.target.matches(\':focus-visible\') in the handler; the pseudo-class is the browser\'s own judgement about whether the user is driving by keyboard, and reimplementing it from key events is how you end up with a tooltip that appears after a drag.',
      'It must open on the keyboard at all. A tooltip wired to hover alone is a name that only exists for people using a mouse, and on a bare icon button that means the control has no name for anyone else. This is the half of the sidebar rail that gets forgotten, because it is invisible to anyone testing with a pointer.',
      'Escape hides it and focus stays exactly where it was. Bind it on window and do not stopPropagation. The window scope is needed because a tooltip opened by the pointer has no focus inside it, so a root-scoped keydown never fires and there is nothing to dismiss it with — WCAG 1.4.13 dismissible. Not stopping it is the deliberate difference from a popover: a tooltip is a label, not a layer, so an Escape that hides the bubble and also closes the dialog around it is one press doing what the user meant, while swallowing it at the tooltip makes the dialog undismissable whenever the pointer happens to rest on a toolbar icon.',
      'Delay opening by about 150ms and close immediately. The delay stops a pointer crossing a toolbar on its way somewhere else from firing five bubbles; no close delay is correct here precisely because there is nothing to travel into. A row of controls shares one delay group: once any tooltip in the group has opened, the next one opens at once, and the group goes cold again a second or so after the pointer leaves it. Without the group, moving one button along a toolbar re-pays the 150ms every time and the labels lag behind the pointer.',
      'Handlers go on the trigger, not on a wrapper. The hovercard watches its wrapper because the pointer is meant to be allowed into the panel and mouseleave has to mean "left both"; here the bubble cannot be entered, so the trigger is the whole surface worth tracking and mouseenter, mouseleave, focus and blur bind straight to it. The one exception is a disabled control, which fires no pointer events at all, and there the wrapper takes them back.',
      'The bubble is absolutely positioned inside the trigger\'s own wrapper and never portalled or position:fixed. That makes an overflow-hidden ancestor the standing trap — the card wrapper around a table clips every bubble at the row it opens on, and truncate on the cell clips the bubble as well as the text. Round the header cells instead of clipping the card, and put the bubble on a side that fits rather than reaching for fixed. Fixed brings the containing-block problem with it, and it also has to be repositioned on every scroll, which is a lot of machinery for a label.',
      'On touch it never appears, and no scroll pins it. The bubble travels with its row and goes with it, and there is no pinned state and no dismiss button. Everything that follows from that is one rule: a tooltip may not be the only place a fact lives. The spec limit, the shortcut, the reason a button is disabled — each of them is in the tooltip as a shortcut to something already on the page or one click away, never as its home.',
      'Keep it to a few words on one line, whitespace-nowrap. If it wants a sentence it is help text under the field; if it wants a heading and figures it is a hovercard; if it wants a link it is a popover. A tooltip that wraps to three lines is covering the controls either side of the one it names.'
    ],
    anatomy: [
      ['Wrapper', 'relative inline-flex around the trigger and the bubble. It owns the Alpine state and the window Escape binding, and it is deliberately not what the pointer is tracked on — the trigger is.'],
      ['Trigger', 'The real button, link or header control. It carries the pointer and focus handlers, the naming attribute, and aria-keyshortcuts when the bubble shows a key. It works with the bubble never appearing.'],
      ['Bubble', 'bg-zinc-900, rounded-lg, px-2 py-1, text-[12px]/4 white, whitespace-nowrap, pointer-events-none, z-40, x-cloak. role="tooltip" when it is exposed, aria-hidden when the trigger already carries the same string.'],
      ['Gap', 'A plain mb-1.5 or ml-1.5 on the bubble. Unlike the hovercard\'s pt-2 bridge this is an ordinary margin, because the pointer never has to cross it — the moment it does, the component is the wrong one.'],
      ['Arrow', 'Optional. A size-2 square rotated 45 degrees in the same zinc-900, tucked half under the bubble edge. It lives inside the bubble so pointer-events-none covers it, and it is dropped whenever the bubble has been shifted independently of the trigger.'],
      ['Shortcut', 'A kbd inside the bubble, aria-hidden, in the same plain wording the dropdown uses — Ctrl D, not a glyph. The machine form goes in aria-keyshortcuts on the trigger.'],
      ['Delay group', 'One x-data on a toolbar or a table holding the open id and a warm flag, so the first label in a row costs 150ms and the rest are instant.'],
      ['Clip probe', 'An x-ref on the truncated text and a scrollWidth against clientWidth read at hover time, so a cell that fits shows no bubble at all.']
    ],
    behaviour: [
      'The pointer arriving on the trigger opens it after about 150ms; the pointer leaving closes it at once. There is no close delay and no way to keep it open, because there is nothing in it to reach.',
      'Focus-visible opens it immediately and blur closes it. A click that happens to focus the button does not open it, so pressing an icon button does not leave a label sitting over the toolbar.',
      'Escape hides it from anywhere on the page and leaves focus on the trigger. The user can carry on tabbing without having lost their place, and pressing Escape again does whatever the page would have done anyway.',
      'The bubble never takes the pointer. Hovering the space it occupies hovers whatever is underneath, which is usually the row behind it.',
      'Within a delay group the first label waits out the delay and every label after it appears the instant the pointer arrives, until the pointer has been off the group for about a second.',
      'Two bubbles can be on screen at once — one where focus is and one under the pointer — and that is correct rather than a bug to serialise away. They are answering two different questions.',
      'A truncated cell opens a bubble only when the text is actually clipped, and the measurement is taken at hover rather than at init, because column widths change with the viewport and a flag computed once goes stale on the first resize.',
      'On a touch device nothing opens: there is no hover, and a tap goes to the control. The label is the same one that is in the accessible name, so the tap target is still named.',
      'Nothing pins it. It is not sticky on scroll, it has no close button, and it disappears the moment the pointer or focus moves — which is the whole reason it may not hold anything that has to be read.'
    ],
    a11y: [
      'aria-describedby when the trigger already has an accessible name and the bubble adds to it; aria-labelledby, or an aria-label with the bubble aria-hidden, when the bubble is the name. Backwards, the first case produces a control whose name is read twice and the second a control announced as "button" with no name at all.',
      'The naming attribute is written once in the markup and left there. A reference resolves through an element that x-show has at display:none, so the button is named while the bubble is invisible; toggling the attribute with the visibility makes readers re-announce the control on every pass of the pointer.',
      'The bubble carries role="tooltip" when it is the thing being referenced, and aria-hidden="true" when the trigger already holds the same string. It is never both exposed and duplicated.',
      'The bubble is never focusable and holds nothing focusable. It adds no tab stops, so a toolbar of eight tooltipped icon buttons is still eight tab stops, and a register of fifty rows adds none at all.',
      'It opens on focus-visible as well as hover. Content available only on hover does not exist for a keyboard user, and when that content is the name of an icon button, neither does the button. The single exception is a truncated cell, where the bubble is a second copy of a string the reader already has in full, and adding a tab stop per row to reveal it costs more than it returns.',
      'Escape dismisses it without moving the pointer and without moving focus; it does not vanish on a timer; and it does not obscure the control it names, since it sits clear of the trigger and takes no pointer events. Those are the three halves of WCAG 1.4.13 for content shown on hover, met by a component small enough that the third one costs nothing.',
      'A shortcut in the bubble is aria-hidden and the key goes in aria-keyshortcuts on the trigger, the same split the dropdown uses. Glyphs left in an accessible name are read literally — a name ending in "place of interest sign" is a riddle, not a label.',
      'A truncated cell already contains its full text in the DOM, because truncation is visual only. The bubble repeating it is aria-hidden and there is no aria-describedby: a reader gets the whole string once, from the cell.',
      'A control that is genuinely disabled is out of the tab order, so a tooltip on it can never be reached by keyboard. Where the reason matters, keep the button focusable with aria-disabled="true" and neutralise the click; where it does not, put the reason in help text rather than behind a hover.'
    ],
    related: ['hovercard', 'popover', 'button'],
    variants: [
      { id: 'icon', name: 'On an icon button', code:
`<!-- Two icon buttons, two naming recipes, and they are not interchangeable.

     Left: the bubble is the name. aria-labelledby points at the bubble id and
     the button carries no aria-label of its own, so there is exactly one copy
     of the string. A referenced element is read even while x-show has it at
     display:none — name computation reaches hidden nodes deliberately — so the
     button is named all session, not only while the bubble is up.

     Right: the name lives in aria-label and the bubble is aria-hidden. Two
     copies of one string, which is what the sidebar rail does and is right
     while the string is short and static.

     What is wrong is one button wearing an aria-label AND a bubble its name is
     computed from: that control is announced twice. Equally wrong is
     aria-describedby on a button with no other name — it reads as "button",
     and the name turns up late as a description or not at all.

     The handlers sit on the button, not on the wrapper. A hovercard watches
     its wrapper because the pointer is meant to get into the panel; nothing
     here can be entered, so the trigger is the whole surface being tracked.
     Escape is bound on window, because a tooltip opened by the pointer has no
     focus inside it and a root-scoped keydown would never fire. -->
<div data-kui="tooltip/icon" class="flex items-center gap-3">

  <span class="relative inline-flex"
        x-data="{
          open: false, timer: 0,
          show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
          hide() { clearTimeout(this.timer); this.open = false }
        }"
        @keydown.escape.window="hide()">
    <button type="button" aria-labelledby="tt-duplicate"
            @mouseenter="show()" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show(0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="copy" class="size-4"></i>
    </button>
    <span id="tt-duplicate" role="tooltip" x-show="open" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Duplicate order</span>
  </span>

  <span class="relative inline-flex"
        x-data="{
          open: false, timer: 0,
          show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
          hide() { clearTimeout(this.timer); this.open = false }
        }"
        @keydown.escape.window="hide()">
    <button type="button" aria-label="Print order"
            @mouseenter="show()" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show(0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="printer" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Print order</span>
  </span>

</div>` },

      { id: 'placement', name: 'Four placements', code:
`<!-- Top is the default and the other three are answers to a specific
     obstruction, not a taste.

     Top — the resting cursor and the hand holding the mouse cover what is
     below and to the right of the hotspot, so a bubble under the trigger is
     the one place it is least readable.

     Right — a vertical icon rail. There is nothing above or below an item but
     the next item, so a top bubble covers the thing the pointer is travelling
     towards. This is what the sidebar rail uses.

     Bottom — a control in the top row of a card or a topbar, where above the
     trigger is off the card and behind the page header.

     Left — the last button of a right-aligned action column, where a centred
     bubble runs past the edge of the card and takes the page sideways with it.

     One x-data for all four, because a pointer is only ever in one place and
     an open id is cheaper than four booleans. Escape is bound once, on the
     root, with .window so it fires whether or not anything here has focus. -->
<div data-kui="tooltip/placement" class="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white p-10"
     x-data="{
       open: null, timer: 0,
       show(id, d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = id, d) },
       hide() { clearTimeout(this.timer); this.open = null }
     }"
     @keydown.escape.window="hide()">

  <span class="relative inline-flex">
    <button type="button" aria-labelledby="tt-place-top"
            @mouseenter="show('top')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('top', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="arrow-up" class="size-4"></i>
    </button>
    <span id="tt-place-top" role="tooltip" x-show="open === 'top'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Top — the default</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-labelledby="tt-place-right"
            @mouseenter="show('right')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('right', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="arrow-right" class="size-4"></i>
    </button>
    <span id="tt-place-right" role="tooltip" x-show="open === 'right'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute top-1/2 left-full z-40 ml-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Right — icon rails</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-labelledby="tt-place-bottom"
            @mouseenter="show('bottom')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('bottom', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="arrow-down" class="size-4"></i>
    </button>
    <span id="tt-place-bottom" role="tooltip" x-show="open === 'bottom'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute top-full left-1/2 z-40 mt-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Bottom — topbars</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-labelledby="tt-place-left"
            @mouseenter="show('left')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('left', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="arrow-left" class="size-4"></i>
    </button>
    <span id="tt-place-left" role="tooltip" x-show="open === 'left'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute top-1/2 right-full z-40 mr-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Left — the last column</span>
  </span>

</div>` },

      { id: 'truncated', name: 'Only when the text is clipped', code:
`<!-- A tooltip on every cell in the column is a column that flashes at the
     pointer for no reason. Measure the text at hover — scrollWidth against
     clientWidth on the truncating element — and open nothing when it fits.
     The second row here fits and never shows a bubble.

     Measure at hover and not at x-init. Column widths change with the
     viewport, with the sidebar collapsing and with the user dragging a column,
     so a flag computed once is wrong by the first resize. The comparison
     carries a one-pixel tolerance because both properties are rounded to
     integers and a cell that fits exactly measures as clipped often enough to
     matter.

     No aria-describedby and the bubble is aria-hidden. Truncation is a
     CSS effect: the whole string is in the DOM and a screen reader already
     reads all of it. Wiring the bubble into the name would read it twice.

     This is the one tooltip here with no keyboard route, and deliberately so.
     A tabindex="0" on the cell text would put a tab stop on every row of the
     register — fifty stops on something that is not a control — to reveal a
     string a reader was already given in full. Everywhere else the bubble is
     the only copy of a name, so focus has to open it; here it is a second
     copy, so the pointer is enough.

     The card is not overflow-hidden — that is what clips a bubble at the row
     it opens on — so the header cells are rounded instead. truncate on the
     cell itself would clip it too, which is why the ellipsis lives on an inner
     span and the positioned wrapper around it does no clipping of its own. -->
<div data-kui="tooltip/truncated" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, timer: 0,
       show(id, el, d = 150) {
         clearTimeout(this.timer);
         if (el.scrollWidth <= el.clientWidth + 1) return;
         this.timer = setTimeout(() => this.open = id, d);
       },
       hide() { clearTimeout(this.timer); this.open = null }
     }"
     @keydown.escape.window="hide()">
  <table class="w-full table-fixed text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="rounded-tl-xl px-4 py-2 font-medium sm:w-32">Order</th>
        <th scope="col" class="rounded-tr-xl px-4 py-2 font-medium">Line description</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="px-4 py-2.5">
          <span class="relative block">
            <span x-ref="long"
                  @mouseenter="show('long', $refs.long)" @mouseleave="hide()"
                  class="block truncate text-zinc-600">MS angles 50×50×6 and plates 10 mm, IS 2062 E250 BR, Waluj plant August lot</span>
            <span aria-hidden="true" x-show="open === 'long'" x-cloak x-transition.opacity.duration.100ms
                  class="pointer-events-none absolute top-full left-0 z-40 mt-1.5 max-w-sm rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 text-white">MS angles 50×50×6 and plates 10 mm, IS 2062 E250 BR, Waluj plant August lot</span>
          </span>
        </td>
      </tr>
      <tr>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1163</td>
        <td class="px-4 py-2.5">
          <span class="relative block">
            <span x-ref="short"
                  @mouseenter="show('short', $refs.short)" @mouseleave="hide()"
                  class="block truncate text-zinc-600">HR coil 2.5 mm</span>
            <span aria-hidden="true" x-show="open === 'short'" x-cloak x-transition.opacity.duration.100ms
                  class="pointer-events-none absolute top-full left-0 z-40 mt-1.5 max-w-sm rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 text-white">HR coil 2.5 mm</span>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'shortcut', name: 'With a keyboard shortcut', code:
`<!-- These buttons already have names — "Save draft" is written on one and in
     the aria-label of the other — so the bubble is a description and not a
     label. It is aria-hidden in full, and the key goes in aria-keyshortcuts on
     the trigger, which is the same split the dropdown's shortcut hints use.
     Glyphs are the reason: a screen reader reads ⌘ as "place of interest sign",
     so a key left in the accessible name turns Save draft into a riddle.
     aria-keyshortcuts takes the machine form and the platform words it.

     Ctrl and not ⌘, because these are Windows desktops in a plant office.

     Do not hint a shortcut nothing is bound to. The window handler is the
     promise this bubble makes:

       @keydown.window.ctrl.s.prevent="save()"

     And the tooltip is not where a shortcut is discovered — it cannot be
     reached on a phone and nobody hovers a button hunting for keys. The same
     accelerators belong in the record's action menu, which is where people
     actually read them. -->
<div data-kui="tooltip/shortcut" class="flex flex-wrap items-center gap-3"
     x-data="{
       open: null, timer: 0,
       show(id, d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = id, d) },
       hide() { clearTimeout(this.timer); this.open = null }
     }"
     @keydown.escape.window="hide()">

  <span class="relative inline-flex">
    <button type="button" aria-describedby="tt-save" aria-keyshortcuts="Control+S"
            @mouseenter="show('save')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('save', 0)" @blur="hide()"
            class="flex items-center gap-2 rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="save" class="size-4"></i>Save draft
    </button>
    <span id="tt-save" role="tooltip" x-show="open === 'save'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">
      Save without posting
      <kbd aria-hidden="true" class="rounded border border-zinc-700 px-1 text-[11px]/4 text-zinc-400">Ctrl S</kbd>
    </span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-label="Search orders" aria-describedby="tt-search" aria-keyshortcuts="Control+K"
            @mouseenter="show('search')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('search', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="search" class="size-4"></i>
    </button>
    <span id="tt-search" role="tooltip" x-show="open === 'search'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">
      Search orders
      <kbd aria-hidden="true" class="rounded border border-zinc-700 px-1 text-[11px]/4 text-zinc-400">Ctrl K</kbd>
    </span>
  </span>

</div>` },

      { id: 'disabled', name: 'On a disabled control', code:
`<!-- A disabled button fires no pointer events, so mouseenter on it never
     happens and a tooltip bound to the button is dead markup. Two ways out,
     and they are not equal.

     Left, the wrapper trick: the handlers move to the span around the button,
     which is not disabled and does see the pointer. The button stays properly
     disabled. Do not put tabindex="0" on that span to "fix" the keyboard — it
     adds a tab stop announced as nothing, in front of a control that cannot be
     operated. This form is pointer-only by construction, which is fine when
     the reason is a reminder rather than news.

     Right, and the better answer whenever the reason actually matters: leave
     the button enabled in the DOM, mark it aria-disabled="true" and neutralise
     the click. It keeps its tab stop, it is announced as dimmed, the tooltip
     opens on focus like any other, and aria-describedby carries the reason
     into the name computation. The disabled: variants do not apply to it, so
     the flat look is written as plain classes.

     Either way the reason is on the page as well. A rule that decides whether
     somebody can post a receipt is not something to hide behind a hover. -->
<div data-kui="tooltip/disabled" class="flex flex-wrap items-center gap-3">

  <span class="relative inline-flex"
        x-data="{
          open: false, timer: 0,
          show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
          hide() { clearTimeout(this.timer); this.open = false }
        }"
        @mouseenter="show()" @mouseleave="hide()"
        @keydown.escape.window="hide()">
    <button type="button" disabled aria-describedby="tt-void"
            class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium text-zinc-400 disabled:pointer-events-none">
      <i data-lucide="ban" class="size-4"></i>Void GRN
    </button>
    <span id="tt-void" role="tooltip" x-show="open" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Already invoiced — voiding is closed</span>
  </span>

  <span class="relative inline-flex"
        x-data="{
          open: false, timer: 0,
          show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
          hide() { clearTimeout(this.timer); this.open = false }
        }"
        @keydown.escape.window="hide()">
    <button type="button" aria-disabled="true" aria-describedby="tt-post"
            @click.prevent
            @mouseenter="show()" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show(0)" @blur="hide()"
            class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="check-circle-2" class="size-4"></i>Post to stock
    </button>
    <span id="tt-post" role="tooltip" x-show="open" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Needs a Level 2 approver</span>
  </span>

</div>` },

      { id: 'table', name: 'In a dense table cell', code:
`<!-- Abbreviated column headers are the one place a tooltip earns its keep in
     a register: MFI and Ash mean nothing to a new joiner and spelling them out
     would make the header three lines deep on a table that already has eight
     columns.

     The trigger is a real button, not a span with a dotted underline. Anything
     that shows content on hover has to be reachable on focus, and only a real
     control is. The underline is decoration-dotted rather than solid so it does
     not read as a link — this one does not navigate.

     Each header button already has a name, the abbreviation itself, so the
     bubble is a description: aria-describedby, never aria-labelledby, or the
     header is announced as the whole method sentence in every row summary.

     Bubbles hang below the header because there is nothing above it but the
     card edge, and the card is not overflow-hidden — rounded header cells
     instead — or every one of them is clipped at the top row.

     The spec limits are printed under the table, which is what makes the
     tooltip on the failing result legal. It is a shortcut to something already
     on the page, not the only copy of it. -->
<div data-kui="tooltip/table" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, timer: 0,
       show(id, d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = id, d) },
       hide() { clearTimeout(this.timer); this.open = null }
     }"
     @keydown.escape.window="hide()">
  <table class="w-full text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="rounded-tl-xl px-3 py-2 font-medium">Batch</th>
        <th scope="col" class="px-3 py-2 text-right font-medium">
          <span class="relative inline-flex">
            <button type="button" aria-describedby="tt-mfi"
                    @mouseenter="show('mfi')" @mouseleave="hide()"
                    @focus="if ($event.target.matches(':focus-visible')) show('mfi', 0)" @blur="hide()"
                    class="underline decoration-dotted underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">MFI</button>
            <span id="tt-mfi" role="tooltip" x-show="open === 'mfi'" x-cloak x-transition.opacity.duration.100ms
                  class="pointer-events-none absolute top-full right-0 z-40 mt-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tracking-normal whitespace-nowrap text-white normal-case">Melt flow index, g/10 min at 190 °C</span>
          </span>
        </th>
        <th scope="col" class="px-3 py-2 text-right font-medium">
          <span class="relative inline-flex">
            <button type="button" aria-describedby="tt-ash"
                    @mouseenter="show('ash')" @mouseleave="hide()"
                    @focus="if ($event.target.matches(':focus-visible')) show('ash', 0)" @blur="hide()"
                    class="underline decoration-dotted underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Ash</button>
            <span id="tt-ash" role="tooltip" x-show="open === 'ash'" x-cloak x-transition.opacity.duration.100ms
                  class="pointer-events-none absolute top-full right-0 z-40 mt-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tracking-normal whitespace-nowrap text-white normal-case">Residue on ignition, % by mass</span>
          </span>
        </th>
        <th scope="col" class="rounded-tr-xl px-3 py-2 font-medium">Result</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-3 py-1.5 font-medium tabular-nums">B-2608-14</td>
        <td class="px-3 py-1.5 text-right tabular-nums">2.41</td>
        <td class="px-3 py-1.5 text-right tabular-nums">0.62</td>
        <td class="px-3 py-1.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Pass
          </span>
        </td>
      </tr>
      <tr class="border-b border-zinc-100">
        <td class="px-3 py-1.5 font-medium tabular-nums">B-2608-15</td>
        <td class="px-3 py-1.5 text-right tabular-nums">3.18</td>
        <td class="px-3 py-1.5 text-right tabular-nums">0.71</td>
        <td class="px-3 py-1.5">
          <span class="relative inline-flex">
            <button type="button" aria-label="Failed" aria-describedby="tt-fail"
                    @mouseenter="show('fail')" @mouseleave="hide()"
                    @focus="if ($event.target.matches(':focus-visible')) show('fail', 0)" @blur="hide()"
                    class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Fail
            </button>
            <span id="tt-fail" role="tooltip" x-show="open === 'fail'" x-cloak x-transition.opacity.duration.100ms
                  class="pointer-events-none absolute bottom-full left-0 z-40 mb-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums whitespace-nowrap text-white">MFI 3.18 is over the 3.00 limit</span>
          </span>
        </td>
      </tr>
      <tr>
        <td class="px-3 py-1.5 font-medium tabular-nums">B-2608-16</td>
        <td class="px-3 py-1.5 text-right tabular-nums">2.87</td>
        <td class="px-3 py-1.5 text-right tabular-nums">0.58</td>
        <td class="px-3 py-1.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Pass
          </span>
        </td>
      </tr>
    </tbody>
  </table>
  <p class="border-t border-zinc-100 px-3 py-2 text-[12px]/4 tabular-nums text-zinc-500">Spec: MFI 2.00–3.00 g/10 min · Ash 0.80 % max</p>
</div>` },

      { id: 'arrow', name: 'With an arrow', code:
`<!-- The arrow is a size-2 square in the same zinc-900, rotated 45 degrees and
     pulled half under the bubble edge so only its point shows. It lives inside
     the bubble, which is what makes pointer-events-none cover it as well.

     Two things it does not survive. The bubble may not be overflow-hidden —
     that clips the half that is showing, and a bubble with a flat nub on it
     looks like a rendering fault. And it only holds while the bubble is
     centred on the trigger: the moment the bubble is shifted sideways to clear
     a viewport edge, the arrow is pointing at nothing and the honest fix is to
     drop it, not to reposition it. That is the same rule the popover follows.

     Use it where the trigger is one of several close together and the bubble
     could plausibly belong to a neighbour. On a lone button it is 8px of
     decoration on a component whose entire job is to be read and gone. -->
<div data-kui="tooltip/arrow" class="flex items-center justify-center rounded-xl border border-zinc-300 bg-white p-10">
  <span class="relative inline-flex"
        x-data="{
          open: false, timer: 0,
          show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
          hide() { clearTimeout(this.timer); this.open = false }
        }"
        @keydown.escape.window="hide()">
    <button type="button" aria-labelledby="tt-arrow"
            @mouseenter="show()" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show(0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="paperclip" class="size-4"></i>
    </button>
    <span id="tt-arrow" role="tooltip" x-show="open" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">
      Attach a document
      <span aria-hidden="true" class="absolute top-full left-1/2 -mt-1 size-2 -translate-x-1/2 rotate-45 bg-zinc-900"></span>
    </span>
  </span>
</div>` },

      { id: 'delay-group', name: 'Delay group along a toolbar', code:
`<!-- One x-data for the whole toolbar, holding the open id and a warm flag.

     The first label costs 400ms, which is what stops a pointer crossing the
     toolbar on its way to the scrollbar from firing five bubbles. Every label
     after it opens at once, because the user has already asked this row of
     buttons a question and re-paying the delay on each one leaves the labels
     trailing the pointer by half a step. The group goes cold 800ms after the
     pointer leaves, so coming back to it later pays the delay again.

     This is the case a per-button x-data cannot serve. The warm flag has to be
     shared, and sharing it by writing to a parent scope from a nested x-data
     silently creates a shadowing own property on the child instead. One
     component over the whole toolbar, and open holds an id rather than each
     button holding a boolean.

     Focus opens with no delay and warms the group too: a Tab lands on one
     button deliberately and waiting 400ms after a keypress reads as lag.

     The five buttons are written out rather than looped with x-for, because
     the icon name would have to become :data-lucide — a binding on the one
     node createIcons() is about to replace with an svg. -->

<div data-kui="tooltip/delay-group" class="inline-flex items-center gap-1 rounded-xl border border-zinc-300 bg-white p-1"
     x-data="{
       open: null, warm: false, timer: 0, cool: 0,
       show(id, now = false) {
         clearTimeout(this.timer); clearTimeout(this.cool);
         if (now || this.warm) { this.open = id; this.warm = true; return }
         this.timer = setTimeout(() => { this.open = id; this.warm = true }, 400);
       },
       hide() {
         clearTimeout(this.timer);
         this.open = null;
         this.cool = setTimeout(() => this.warm = false, 800);
       }
     }"
     @keydown.escape.window="hide()">

  <span class="relative inline-flex">
    <button type="button" aria-label="Bold"
            @mouseenter="show('bold')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('bold', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="bold" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'bold'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Bold</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-label="Italic"
            @mouseenter="show('italic')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('italic', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="italic" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'italic'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Italic</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-label="Bulleted list"
            @mouseenter="show('list')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('list', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="list" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'list'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Bulleted list</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-label="Insert link"
            @mouseenter="show('link')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('link', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="link" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'link'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Insert link</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-label="Clear formatting"
            @mouseenter="show('clear')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('clear', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="eraser" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'clear'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Clear formatting</span>
  </span>

</div>` },

      { id: 'row-actions', name: 'A row action bar', code:
`<!-- The assembled case: a GRN register whose rows each end in four icon
     buttons, and the tooltips are the only thing naming them.

     One delay group over the whole table, not one per row. The pointer travels
     down a column of action bars as readily as along one, and a group that
     ends at the row boundary re-pays the delay on every row.

     The open id is composite — the GRN number and the action — because the
     same four actions repeat on every row and a bare action id would light up
     four bubbles at once.

     Placement changes on the last button in the bar. The first three take the
     default top; the last one would put a centred bubble past the right edge
     of the card, so it goes left instead. Nothing here is position:fixed and
     nothing measures the viewport: in a fixed-width action column the overflow
     is known at build time, and a placement chosen once beats a clamp computed
     on every open.

     The card is not overflow-hidden. Header cells are rounded instead, or the
     top row's bubbles are cut off at the header rule.

     Below sm the action bar folds to a single menu button. Four 36px targets
     and a value column do not fit in 390px, and the answer is never a table
     that scrolls sideways — the dropdown behind that button carries the same
     four actions with their names written out, which is also the touch route
     to everything these tooltips say. -->
<div data-kui="tooltip/row-actions" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, warm: false, timer: 0, cool: 0,
       show(id, now = false) {
         clearTimeout(this.timer); clearTimeout(this.cool);
         if (now || this.warm) { this.open = id; this.warm = true; return }
         this.timer = setTimeout(() => { this.open = id; this.warm = true }, 400);
       },
       hide() {
         clearTimeout(this.timer);
         this.open = null;
         this.cool = setTimeout(() => this.warm = false, 800);
       },
       rows: [
         { id: 'GRN-2608-041', po: 'PO-24-1187', vendor: 'Gujarat Polymers Ltd', value: '₹18,42,000', dot: 'bg-emerald-600', status: 'Closed' },
         { id: 'GRN-2608-040', po: 'PO-24-1186', vendor: 'Konkan Fabricators', value: '₹1,15,400', dot: 'bg-zinc-500', status: 'Open' },
         { id: 'GRN-2608-039', po: 'PO-24-1185', vendor: 'Deshpande Traders', value: '₹96,750', dot: 'bg-amber-500', status: 'Approved' }
       ]
     }"
     @keydown.escape.window="hide()">
  <table class="w-full text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="rounded-tl-xl px-4 py-2 font-medium">Receipt</th>
        <th scope="col" class="hidden px-4 py-2 font-medium md:table-cell">Vendor</th>
        <th scope="col" class="px-4 py-2 font-medium">Status</th>
        <th scope="col" class="hidden px-4 py-2 text-right font-medium sm:table-cell">Value</th>
        <th scope="col" class="rounded-tr-xl px-4 py-2 text-right font-medium"><span class="sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>
      <template x-for="r in rows" :key="r.id">
        <tr class="border-b border-zinc-100 last:border-0">
          <td class="px-4 py-2 font-medium tabular-nums" x-text="r.id"></td>
          <td class="hidden px-4 py-2 text-zinc-600 md:table-cell" x-text="r.vendor"></td>
          <td class="px-4 py-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full" :class="r.dot" aria-hidden="true"></span><span x-text="r.status"></span>
            </span>
          </td>
          <td class="hidden px-4 py-2 text-right tabular-nums sm:table-cell" x-text="r.value"></td>
          <td class="px-4 py-2">
            <div class="hidden items-center justify-end gap-0.5 sm:flex">

              <span class="relative inline-flex">
                <button type="button" :aria-label="'Open ' + r.id"
                        @mouseenter="show(r.id + ':open')" @mouseleave="hide()"
                        @focus="if ($event.target.matches(':focus-visible')) show(r.id + ':open', true)" @blur="hide()"
                        class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                  <i data-lucide="eye" class="size-4"></i>
                </button>
                <span aria-hidden="true" x-show="open === r.id + ':open'" x-cloak x-transition.opacity.duration.100ms
                      class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Open receipt</span>
              </span>

              <span class="relative inline-flex">
                <button type="button" :aria-label="'Print ' + r.id"
                        @mouseenter="show(r.id + ':print')" @mouseleave="hide()"
                        @focus="if ($event.target.matches(':focus-visible')) show(r.id + ':print', true)" @blur="hide()"
                        class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                  <i data-lucide="printer" class="size-4"></i>
                </button>
                <span aria-hidden="true" x-show="open === r.id + ':print'" x-cloak x-transition.opacity.duration.100ms
                      class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Print gate pass</span>
              </span>

              <span class="relative inline-flex">
                <button type="button" :aria-label="'Attach a document to ' + r.id"
                        @mouseenter="show(r.id + ':attach')" @mouseleave="hide()"
                        @focus="if ($event.target.matches(':focus-visible')) show(r.id + ':attach', true)" @blur="hide()"
                        class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                  <i data-lucide="paperclip" class="size-4"></i>
                </button>
                <span aria-hidden="true" x-show="open === r.id + ':attach'" x-cloak x-transition.opacity.duration.100ms
                      class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Attach a document</span>
              </span>

              <span class="relative inline-flex">
                <button type="button" :aria-label="'More actions on ' + r.id"
                        @mouseenter="show(r.id + ':more')" @mouseleave="hide()"
                        @focus="if ($event.target.matches(':focus-visible')) show(r.id + ':more', true)" @blur="hide()"
                        class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                  <i data-lucide="more-horizontal" class="size-4"></i>
                </button>
                <span aria-hidden="true" x-show="open === r.id + ':more'" x-cloak x-transition.opacity.duration.100ms
                      class="pointer-events-none absolute top-1/2 right-full z-40 mr-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">More actions</span>
              </span>

            </div>

            <div class="flex justify-end sm:hidden">
              <button type="button" :aria-label="'Actions on ' + r.id"
                      class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <i data-lucide="more-vertical" class="size-4"></i>
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</div>` }
    ]
  },

  {
    id: 'hovercard', name: 'Hovercard', category: 'feedback',
    description: 'A card of record detail that opens under a link on hover or focus, after a deliberate delay, and stays open long enough to be read and clicked.',
    when: 'Previewing the record behind a link without leaving the register — the vendor on a PO row, the person who approved it, the order a GRN was raised against. Never for anything the user has to see: hover does not exist on a touch screen, so every fact in the card must also be at the far end of the link. To name an icon-only button, use a tooltip.',
    notes: [
      'This is not a tooltip and must not be built like one. A tooltip is the accessible name of a control, rendered as a zinc-900 bubble, aria-hidden, pointer-events-none, and holding nothing anyone has to read. A hovercard is a white rounded-xl panel with a zinc-200 border and a shadow, it is interactive, and it holds content — which is exactly why it needs the delays, the keyboard route and the dismiss that a tooltip does not.',
      'Open on a delay of 300–500ms. Without one, dragging the pointer diagonally across a column of twelve PO links opens and closes twelve cards on the way to the scrollbar, and the register strobes.',
      'Close on a delay of 150–250ms as well. The pointer has to cross from the trigger into the panel, and it is off both for a frame or two while it does. No close delay means the card can never be reached, only glimpsed — this is WCAG 1.4.13 hoverable, not a nicety.',
      'The gap between trigger and panel is padding on the positioned wrapper, never a margin. A margin is dead space that belongs to nothing, so mouseleave fires as the pointer crosses it; padding on the wrapper keeps the pointer inside the subtree the whole way and the hover never breaks.',
      'Never pointer-events-none on the panel. A hovercard is meant to be clicked into, which is what makes the hover bridge and the close delay load-bearing rather than polish — a tooltip gets away without them precisely because nothing in it can be reached.',
      'Escape closes it, and it is bound on window rather than on the wrapper. A card opened by the pointer has no focus inside it, so a wrapper-scoped keydown never fires and there is no way to dismiss it at all — WCAG 1.4.13 dismissible.',
      'Focus opens it too, through @focusin and @focusout on the wrapper. focus and blur do not bubble, so binding those on the wrapper silently does nothing; and a hovercard with no focus route is a card the keyboard can never see, which is why a tooltip may not hold content and this may.',
      'Open on focus with no delay. The delay exists to survive a pointer travelling across a column; a Tab key lands on one trigger deliberately and waiting 350ms after it reads as lag.',
      'One card open at a time, announced with a window CustomEvent carrying the root element — every other card closes when it hears one that is not itself. The delays alone very nearly serialise it, and very nearly is how two cards end up overlapping on a slow render.',
      'The table wrapper cannot be overflow-hidden or the panel is clipped at the first row it opens on. Round the header cells instead. The same trap is any ancestor carrying transform, filter or will-change: it becomes the containing block, so a position:fixed panel anchors to the row rather than to the viewport, and truncate on the cell clips the panel too.',
      'left-0 anchors the panel to the trigger, so it only survives 390px while the trigger starts its own line — a name halfway through a sentence puts a 320px panel half off the screen and the page scrolls sideways. Either give the trigger the start of a line, which is what a table cell and a labelled field already do, or clamp the panel with a translate as the placement variant does. Never let it size itself down to fit.',
      'Fetch at most once per trigger and keep the result. hx-trigger fires the request, a loaded flag stops the second one, and hx-sync="this:drop" throws away a request that arrives while one is in flight. A card that refetches on every pass of the pointer turns a 50-row register into a load test.',
      'On touch, guard the hover handlers with matchMedia(\'(hover: hover) and (pointer: fine)\'). A tap fires a synthetic mouseenter, so an unguarded card opens on the tap that was meant to follow the link, and then nothing closes it.'
    ],
    anatomy: [
      ['Wrapper', 'relative inline-block. It owns the state and every handler, because mouseleave has to mean "left the trigger and the panel", and only their common parent knows that.'],
      ['Trigger', 'A real link to the record, or a real button. It works with the card never opening, and it keeps its own accessible name.'],
      ['Bridge', 'pt-2 or pb-2 on the positioned wrapper, not mt-2 on the panel. It is the strip the pointer crosses, and it has to belong to the component.'],
      ['Panel', 'The positioned wrapper\'s child: w-80, max-w-[calc(100vw_-_1.5rem)], rounded-xl, white, border-zinc-200, shadow-lg, z-40. A card that floats, not a tooltip bubble.'],
      ['Identity', 'The first line of the panel — the record number or the person\'s name — with the status pill or presence dot beside it.'],
      ['Figures', 'A dl of two to four facts, dt in zinc-600, dd in zinc-900 and tabular-nums. More than four and the thing being previewed is a page.'],
      ['Action', 'At most one, at the foot. It exists on the destination page as well, so nothing is lost when the card never opens.']
    ],
    behaviour: [
      'Hover opens after about 350ms and closes about 200ms after the pointer has left both the trigger and the panel, so the pointer can travel between them and a pass across the column opens nothing.',
      'Focus opens it immediately, tabbing into the panel keeps it open, and tabbing out of the panel closes it — the card a keyboard user can see is the card they can reach.',
      'Escape closes it from anywhere on the page and leaves focus where it was. Nothing closes it on a timer: it stays until the pointer leaves, focus leaves or Escape is pressed.',
      'Only one card is open at a time. Opening one closes the rest through a window event, with no store to keep in sync.',
      'Fetched content is requested on first open and never again. A failed fetch is the exception — it leaves the flag unset, so the next open retries.',
      'Near the bottom of the viewport it flips above the trigger, and near an edge it shifts sideways to stay inside it. It never resizes to fit, because a card that changes shape by position is unreadable at speed.',
      'On a touch device hover never fires. The card opens from an explicit control or not at all, and the link underneath still goes to the record.'
    ],
    a11y: [
      'The trigger is a real link or button with its own accessible name, and the card is supplementary. Everything in it is on the page the link goes to, because touch has no hover and neither does a screen reader.',
      'Never aria-describedby the panel. describedby flattens the whole card — heading, pill, four figures and a button — into one run-on string read after the link\'s name, repeated on every focus, and the button inside it stops being a button.',
      'No aria-expanded on a link trigger. Expanded and collapsed describe a control that reveals content when it is activated, and this one navigates: a reader told "collapsed" will press Enter and leave the page. aria-expanded plus aria-controls is correct only when the trigger is a button whose sole job is opening the card, as in the touch variant.',
      'The panel is not aria-hidden. It sits immediately after the trigger in the DOM and opens on focusin, so a keyboard user tabs from the link straight into what is now on the screen; hiding a visible, focusable panel from the tree strands focus somewhere the reader is told does not exist.',
      'While closed, x-show sets display:none, so nothing inside the panel is a tab stop. Fifty rows of hovercards add no tab stops to the register at all.',
      'Escape dismisses without moving the pointer, the card stays open while the pointer is over it, and it never disappears on its own — the three halves of WCAG 1.4.13 for content shown on hover.',
      'Status inside the card follows the fixed dot mapping and the dot is aria-hidden; the word beside it is what carries the state, so the meaning does not live in a colour.'
    ],
    related: ['tooltip', 'dropdown', 'card'],
    variants: [
      { id: 'default', name: 'On a record link', code:
`<!-- The wrapper around the table is not overflow-hidden. That is the first
     thing that goes wrong with a hovercard in a register: the panel is clipped
     at the row it opens on and looks like a rendering bug. Round the header
     cells instead, and leave the panel free to escape.

     Two rows carry a card so the delay is testable: drag the pointer across
     both and nothing should open. -->
<div data-kui="hovercard/default" class="rounded-xl border border-zinc-300 bg-white">
  <table class="w-full text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="rounded-tl-xl px-4 py-2 font-medium">Order</th>
        <th scope="col" class="hidden px-4 py-2 font-medium sm:table-cell">Vendor</th>
        <th scope="col" class="rounded-tr-xl px-4 py-2 text-right font-medium">Value</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5">
          <span class="relative inline-block"
                x-data="{
                  open: false, timer: 0,
                  show(d = 350) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                      this.open = true;
                      window.dispatchEvent(new CustomEvent('hovercard-open', { detail: this.$root }));
                    }, d);
                  },
                  hide() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = false, 200); },
                  shut() { clearTimeout(this.timer); this.open = false; }
                }"
                @mouseenter="show()" @mouseleave="hide()"
                @focusin="show(0)" @focusout="hide()"
                @keydown.escape.window="shut()"
                @hovercard-open.window="if ($event.detail !== $root) shut()">

            <a href="/orders/1187/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums">PO-24-1187</a>

            <!-- pt-2 on this wrapper, never mt-2 on the panel: the gap has to
                 belong to the component or the pointer leaves it crossing -->
            <div x-show="open" x-cloak x-transition.opacity.duration.150ms
                 class="absolute top-full left-0 z-40 pt-2">
              <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-4 shadow-lg">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-[14px]/5 font-semibold tabular-nums">PO-24-1187</p>
                    <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Gujarat Polymers Ltd</p>
                  </div>
                  <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
                    <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
                  </span>
                </div>
                <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Value</dt>
                    <dd class="text-[12px]/4 font-medium tabular-nums">₹18,42,000</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
                    <dd class="text-[12px]/4 tabular-nums">28 Aug 2026</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Received</dt>
                    <dd class="text-[12px]/4 tabular-nums">2 of 3 GRNs</dd>
                  </div>
                </dl>
                <p class="mt-3 border-t border-zinc-100 pt-3 text-[12px]/4 text-zinc-500 tabular-nums">Raised by Ritu Deshpande · 12 Aug 2026</p>
              </div>
            </div>
          </span>
        </td>
        <td class="hidden px-4 py-2.5 text-zinc-600 sm:table-cell">Gujarat Polymers Ltd</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹18,42,000</td>
      </tr>

      <tr>
        <td class="px-4 py-2.5">
          <span class="relative inline-block"
                x-data="{
                  open: false, timer: 0,
                  show(d = 350) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                      this.open = true;
                      window.dispatchEvent(new CustomEvent('hovercard-open', { detail: this.$root }));
                    }, d);
                  },
                  hide() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = false, 200); },
                  shut() { clearTimeout(this.timer); this.open = false; }
                }"
                @mouseenter="show()" @mouseleave="hide()"
                @focusin="show(0)" @focusout="hide()"
                @keydown.escape.window="shut()"
                @hovercard-open.window="if ($event.detail !== $root) shut()">

            <a href="/orders/1191/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums">PO-24-1191</a>

            <div x-show="open" x-cloak x-transition.opacity.duration.150ms
                 class="absolute top-full left-0 z-40 pt-2">
              <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-4 shadow-lg">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-[14px]/5 font-semibold tabular-nums">PO-24-1191</p>
                    <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Nashik Steel Traders</p>
                  </div>
                  <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
                    <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
                  </span>
                </div>
                <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Value</dt>
                    <dd class="text-[12px]/4 font-medium tabular-nums">₹6,04,750</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
                    <dd class="text-[12px]/4 tabular-nums">02 Aug 2026</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Received</dt>
                    <dd class="text-[12px]/4 tabular-nums">0 of 2 GRNs</dd>
                  </div>
                </dl>
                <p class="mt-3 border-t border-zinc-100 pt-3 text-[12px]/4 text-zinc-500 tabular-nums">Raised by Sanjay More · 18 Aug 2026</p>
              </div>
            </div>
          </span>
        </td>
        <td class="hidden px-4 py-2.5 text-zinc-600 sm:table-cell">Nashik Steel Traders</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹6,04,750</td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'vendor', name: 'Vendor card', code:
`<!-- The richest a hovercard is allowed to get: who they are, what state the
     relationship is in, four figures and one way in. Past that the answer is
     the vendor page, which is where the link already goes.

     The initials circle is a tinted shape, so it carries its ring, and it is
     aria-hidden because the name is written beside it.

     The pill says Active, not Approved. The five fixed statuses describe what a
     record is doing, and Approved is amber there because it means waiting on
     someone; a vendor on the approved list is not waiting for anything. Reusing
     the word with a different dot is how one screen ends up contradicting the
     next, so the standing of a person or a party takes emerald the way the
     presence dot does, and the record words are left to records. -->
<div data-kui="hovercard/vendor" class="rounded-xl border border-zinc-300 bg-white p-4">
  <p class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Vendor</p>
  <span class="relative mt-1 inline-block"
        x-data="{
          open: false, timer: 0,
          show(d = 350) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.open = true;
              window.dispatchEvent(new CustomEvent('hovercard-open', { detail: this.$root }));
            }, d);
          },
          hide() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = false, 200); },
          shut() { clearTimeout(this.timer); this.open = false; }
        }"
        @mouseenter="show()" @mouseleave="hide()"
        @focusin="show(0)" @focusout="hide()"
        @keydown.escape.window="shut()"
        @hovercard-open.window="if ($event.detail !== $root) shut()">

    <a href="/vendors/142/" class="font-medium text-zinc-900 underline underline-offset-2">Gujarat Polymers Ltd</a>

    <div x-show="open" x-cloak x-transition.opacity.duration.150ms
         class="absolute top-full left-0 z-40 pt-2">
      <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-4 shadow-lg">
        <div class="flex items-start gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[13px]/5 font-medium text-zinc-600 ring-1 ring-inset ring-zinc-300" aria-hidden="true">GP</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-[14px]/5 font-semibold">Gujarat Polymers Ltd</p>
            <div class="mt-1 flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
                <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Active
              </span>
              <span class="text-[12px]/4 text-zinc-500 tabular-nums">V-0142 · Vapi</span>
            </div>
          </div>
        </div>

        <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-zinc-100 pt-3">
          <div>
            <dt class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Open orders</dt>
            <dd class="mt-0.5 text-[13px]/5 font-medium tabular-nums">4</dd>
          </div>
          <div>
            <dt class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Outstanding</dt>
            <dd class="mt-0.5 text-[13px]/5 font-medium tabular-nums">₹42,18,500</dd>
          </div>
          <div>
            <dt class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Terms</dt>
            <dd class="mt-0.5 text-[13px]/5 tabular-nums">45 days</dd>
          </div>
          <div>
            <dt class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">On time</dt>
            <dd class="mt-0.5 text-[13px]/5 tabular-nums">92%</dd>
          </div>
        </dl>

        <div class="mt-3 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
          <span class="truncate text-[12px]/4 text-zinc-500 tabular-nums">GSTIN 24AABCG1234F1Z5</span>
          <a href="/vendors/142/" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100">
            Open vendor<i data-lucide="arrow-right" class="size-3.5 text-zinc-600"></i>
          </a>
        </div>
      </div>
    </div>
  </span>
  <p class="mt-2 text-[12px]/4 text-zinc-500 tabular-nums">3 lines short · delivery due 28 Aug 2026</p>
</div>` },

      { id: 'user', name: 'Person card', code:
`<!-- The trigger is the avatar and the name together inside one link, so the
     tab order gets one stop and not two. The presence dot says something about
     the person and never about a record — record state belongs on a badge,
     where the colour mapping is fixed.

     The label sits above the trigger rather than beside it. left-0 anchors the
     panel to the trigger, so a trigger that starts halfway along a line puts a
     320px panel halfway off a 390px screen; starting its own line is the
     cheapest way to be sure it does not. Where the trigger genuinely has to sit
     inside a sentence, use the clamp from the placement variant. -->
<div data-kui="hovercard/user">
  <p class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Approved by</p>
  <span class="relative mt-1 inline-block"
        x-data="{
          open: false, timer: 0,
          show(d = 350) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.open = true;
              window.dispatchEvent(new CustomEvent('hovercard-open', { detail: this.$root }));
            }, d);
          },
          hide() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = false, 200); },
          shut() { clearTimeout(this.timer); this.open = false; }
        }"
        @mouseenter="show()" @mouseleave="hide()"
        @focusin="show(0)" @focusout="hide()"
        @keydown.escape.window="shut()"
        @hovercard-open.window="if ($event.detail !== $root) shut()">

    <a href="/people/ritu-deshpande/" class="inline-flex items-center gap-2 rounded-lg py-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="flex size-6 items-center justify-center rounded-full bg-zinc-200 text-[11px]/4 font-medium text-zinc-600 ring-1 ring-inset ring-zinc-300" aria-hidden="true">RD</span>
      <span class="font-medium text-zinc-900 underline underline-offset-2">Ritu Deshpande</span>
    </a>

    <div x-show="open" x-cloak x-transition.opacity.duration.150ms
         class="absolute top-full left-0 z-40 pt-2">
      <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
        <div class="flex items-start gap-3">
          <span class="relative shrink-0">
            <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 text-[13px]/5 font-medium text-zinc-600 ring-1 ring-inset ring-zinc-300" aria-hidden="true">RD</span>
            <span class="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-emerald-600 ring-2 ring-white" aria-hidden="true"></span>
          </span>
          <div class="min-w-0">
            <p class="truncate text-[14px]/5 font-semibold">Ritu Deshpande</p>
            <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Purchase Manager · Waluj plant</p>
            <p class="mt-0.5 text-[12px]/4 text-zinc-500">Online</p>
          </div>
        </div>

        <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
          <div class="flex items-baseline justify-between gap-3">
            <dt class="text-[12px]/4 text-zinc-600">Approves up to</dt>
            <dd class="text-[12px]/4 font-medium tabular-nums">₹5,00,000</dd>
          </div>
          <div class="flex items-baseline justify-between gap-3">
            <dt class="text-[12px]/4 text-zinc-600">Waiting on her</dt>
            <dd class="text-[12px]/4 tabular-nums">3 orders</dd>
          </div>
        </dl>

        <div class="mt-3 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
          <span class="truncate text-[12px]/4 text-zinc-500 tabular-nums">+91 98220 41187</span>
          <a href="mailto:ritu.deshpande@konspec.in" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100">
            <i data-lucide="mail" class="size-3.5 text-zinc-600"></i>Email
          </a>
        </div>
      </div>
    </div>
  </span>
</div>` },

      { id: 'placement', name: 'Flipping and clamping', code:
`<!-- Two triggers, one at each end of the row. The right-hand one would hang
     off the screen if the panel simply opened left-aligned, and near the foot
     of a long register both of them would open below the fold.

     place() runs inside $nextTick, after x-show has restored display, which is
     the first moment the panel can be measured and still before the browser
     paints — so the flip costs no visible jump. It shifts the panel rather
     than changing its width: a card that is a different shape depending on
     where it opened cannot be read at speed.

     The shift is written as left, not as a translate, and that is not a
     preference. x-transition caches the element's transform when it starts and
     restores it when it finishes, so a bound :style transform on the same
     element is overwritten the moment the fade ends — and because dx has not
     changed since Alpine last read it, the binding never re-runs to correct it.
     Measured at 390px: the clamp computed dx -195 and the card sat correctly on
     screen for one frame, then settled at translateX(0) and hung 183px past the
     right edge for as long as it stayed open. left is not a transform, so the
     transition does not touch it and the fade and the clamp can coexist. The
     other way out is to keep the transform on this element and move x-show and
     x-transition to a child, which costs a wrapper. -->
<div data-kui="hovercard/placement" class="flex items-center justify-between gap-4"
     x-data="{ orders: [
       { id: 'PO-24-1187', vendor: 'Gujarat Polymers Ltd', value: '₹18,42,000', due: '28 Aug 2026' },
       { id: 'PO-24-1191', vendor: 'Nashik Steel Traders',  value: '₹6,04,750',  due: '02 Aug 2026' }
     ] }">
  <template x-for="po in orders" :key="po.id">
    <span class="relative inline-block"
          x-data="{
            open: false, timer: 0, up: false, dx: 0,
            place() {
              const r = this.$root.getBoundingClientRect(), p = this.$refs.panel, m = 12;
              this.up = r.bottom + p.offsetHeight > innerHeight - m && r.top - p.offsetHeight > m;
              this.dx = Math.round(Math.max(m, Math.min(r.left, innerWidth - m - p.offsetWidth)) - r.left);
            },
            show(d = 350) {
              clearTimeout(this.timer);
              this.timer = setTimeout(() => {
                this.open = true;
                this.$nextTick(() => this.place());
                window.dispatchEvent(new CustomEvent('hovercard-open', { detail: this.$root }));
              }, d);
            },
            hide() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = false, 200); },
            shut() { clearTimeout(this.timer); this.open = false; }
          }"
          @mouseenter="show()" @mouseleave="hide()"
          @focusin="show(0)" @focusout="hide()"
          @keydown.escape.window="shut()"
          @hovercard-open.window="if ($event.detail !== $root) shut()"
          @resize.window.debounce="open && place()">

      <a :href="'/orders/' + po.id + '/'" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums" x-text="po.id"></a>

      <div x-ref="panel" x-show="open" x-cloak x-transition.opacity.duration.150ms
           :class="up ? 'bottom-full pb-2' : 'top-full pt-2'"
           :style="'left: ' + dx + 'px'"
           class="absolute left-0 z-40">
        <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
          <p class="truncate text-[14px]/5 font-semibold tabular-nums" x-text="po.id"></p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600" x-text="po.vendor"></p>
          <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-[12px]/4 text-zinc-600">Value</dt>
              <dd class="text-[12px]/4 font-medium tabular-nums" x-text="po.value"></dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
              <dd class="text-[12px]/4 tabular-nums" x-text="po.due"></dd>
            </div>
          </dl>
          <p class="mt-3 border-t border-zinc-100 pt-3 text-[12px]/4 text-zinc-500">Opens above the trigger near the foot of the page, and shifts left rather than off the edge.</p>
        </div>
      </div>
    </span>
  </template>
</div>` },

      { id: 'htmx', name: 'Fetched on first open', code:
`<!-- Alpine decides when the card is open; htmx does the fetching, because
     Alpine does not fetch. The request is a custom event Alpine dispatches at
     the moment the card actually opens, not on mouseenter — mouseenter fires
     350ms before there is a card, and a register full of triggers would fetch
     every row the pointer passed over.

     loaded is what stops the second request. It is set from htmx:afterSwap, so
     a failed fetch leaves it false and the next open tries again, while a
     successful one is never fetched a second time for the life of the page.
     Alpine's .camel modifier is what turns htmx:after-swap in the attribute
     into the htmx:afterSwap the library really dispatches.

     hx-sync="this:drop" throws away a request raised while one is in flight,
     which is what a pointer leaving and returning inside 300ms produces. -->
<div data-kui="hovercard/htmx" class="rounded-xl border border-zinc-300 bg-white p-4">
  <p class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Short receipt against</p>
  <div class="mt-1">
    <span class="relative inline-block"
          x-data="{
            open: false, timer: 0, loaded: false, failed: false,
            show(d = 350) {
              clearTimeout(this.timer);
              this.timer = setTimeout(() => {
                this.open = true;
                if (!this.loaded) this.$refs.body.dispatchEvent(new CustomEvent('hovercard-fetch'));
                window.dispatchEvent(new CustomEvent('hovercard-open', { detail: this.$root }));
              }, d);
            },
            hide() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = false, 200); },
            shut() { clearTimeout(this.timer); this.open = false; }
          }"
          @mouseenter="show()" @mouseleave="hide()"
          @focusin="show(0)" @focusout="hide()"
          @keydown.escape.window="shut()"
          @hovercard-open.window="if ($event.detail !== $root) shut()"
          @htmx:after-swap.camel="loaded = true; failed = false"
          @htmx:response-error.camel="failed = true">

      <a href="/orders/1187/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums">PO-24-1187</a>

      <div x-show="open" x-cloak x-transition.opacity.duration.150ms
           class="absolute top-full left-0 z-40 pt-2">
        <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-4 shadow-lg">

          <!-- the skeleton is the panel's own content until the response
               replaces it, and it is the shape of the answer, so the card does
               not resize under the pointer when the data lands -->
          <div x-ref="body" x-show="!failed"
               hx-get="/orders/1187/card/" hx-trigger="hovercard-fetch"
               hx-swap="innerHTML" hx-sync="this:drop"
               aria-busy="true">
            <div class="animate-pulse" aria-hidden="true">
              <div class="h-3 w-28 rounded bg-zinc-200"></div>
              <div class="mt-2 h-2.5 w-40 rounded bg-zinc-200"></div>
              <div class="mt-4 space-y-2 border-t border-zinc-100 pt-3">
                <div class="h-2.5 w-full rounded bg-zinc-200"></div>
                <div class="h-2.5 w-2/3 rounded bg-zinc-200"></div>
              </div>
            </div>
          </div>

          <div x-show="failed" x-cloak class="flex items-start gap-2.5">
            <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
            <div class="min-w-0">
              <p class="text-[13px]/5 font-medium">Could not load this order</p>
              <button type="button"
                      @click="failed = false; $refs.body.dispatchEvent(new CustomEvent('hovercard-fetch'))"
                      class="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100">
                <i data-lucide="rotate-ccw" class="size-3.5 text-zinc-600"></i>Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    </span>
  </div>
  <p class="mt-2 text-[12px]/4 text-zinc-500 tabular-nums">2 of 3 GRNs posted · last receipt 16 Aug 2026</p>
</div>` },

      { id: 'loading', name: 'Loading', code:
`<!-- The panel's own content before the response lands, standing on its own
     here so the state can be read at full size. The trigger, the delays and
     the positioning are in the default and htmx variants; this is the fragment
     the swap replaces.

     The skeleton is the shape of the card that is coming — a title line, a
     subtitle, a pill and two figures — because the panel is under the pointer,
     and one that grows when the data lands moves the thing being read out from
     under it, or shrinks away from the cursor and closes itself. -->
<div data-kui="hovercard/loading" class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg"
     aria-busy="true" aria-label="Loading order PO-24-1187">
  <div class="animate-pulse" aria-hidden="true">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <div class="h-3 w-28 rounded bg-zinc-200"></div>
        <div class="mt-2 h-2.5 w-40 rounded bg-zinc-200"></div>
      </div>
      <div class="h-5 w-20 shrink-0 rounded-full bg-zinc-200"></div>
    </div>
    <div class="mt-4 space-y-2 border-t border-zinc-100 pt-3">
      <div class="flex items-center justify-between gap-3">
        <div class="h-2.5 w-16 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      </div>
      <div class="flex items-center justify-between gap-3">
        <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
        <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
      </div>
    </div>
  </div>
</div>` },

      { id: 'error', name: 'Failed to load', code:
`<!-- The panel when the fetch failed, on its own for the same reason as the
     skeleton above.

     A hovercard that fails has to say so inside the panel. It cannot fall back
     to closing itself, because the pointer is still on the trigger and the card
     would simply reopen. Two ways out, and the second is the important one —
     the link was always the real route to this record, and it still works when
     the preview does not. Neutral card, colour only in the icon, exactly as an
     alert. -->
<div data-kui="hovercard/error" class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
  <div class="flex items-start gap-2.5">
    <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
    <div class="min-w-0">
      <p class="text-[13px]/5 font-medium tabular-nums">Could not load PO-24-1187</p>
      <p class="mt-1 text-[12px]/4 text-zinc-600">The preview timed out. The order itself is fine.</p>
    </div>
  </div>
  <div class="mt-3 flex items-center gap-2 border-t border-zinc-100 pt-3">
    <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100">
      <i data-lucide="rotate-ccw" class="size-3.5 text-zinc-600"></i>Try again
    </button>
    <a href="/orders/1187/" class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">
      Open the order
    </a>
  </div>
</div>` },

      { id: 'mobile', name: 'On touch', code:
`<!-- There is no hover on a touch screen, and a tap fires a synthetic
     mouseenter, so an unguarded card opens on the tap meant for the link and
     then has nothing to close it. Read the media query once at init and let it
     decide which interface the row gets.

     On touch the trigger becomes a real disclosure button, and that is the one
     place aria-expanded and aria-controls belong: the button's only job is the
     panel, so expanded and collapsed are true statements about it. The link
     beside it is untouched and still goes to the order — the card is never the
     only route to anything in it.

     The panel is in normal flow here rather than floating. At 390px a floating
     card covers the row it came from; in flow it pushes the page down and
     nothing is hidden behind it. That is also why the hover target is the whole
     row rather than the link alone: trigger and panel share one box, so there
     is no gap for the pointer to fall through and no bridge to build. -->
<div data-kui="hovercard/mobile" class="rounded-xl border border-zinc-300 bg-white p-4"
     x-data="{
       open: false, timer: 0,
       fine: matchMedia('(hover: hover) and (pointer: fine)').matches,
       show(d = 350) {
         clearTimeout(this.timer);
         this.timer = setTimeout(() => {
           this.open = true;
           window.dispatchEvent(new CustomEvent('hovercard-open', { detail: this.$root }));
         }, d);
       },
       hide() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = false, 200); },
       shut() { clearTimeout(this.timer); this.open = false; }
     }"
     @mouseenter="fine && show()" @mouseleave="fine && hide()"
     @focusin="fine && show(0)" @focusout="fine && hide()"
     @keydown.escape.window="shut()"
     @click.outside="shut()"
     @hovercard-open.window="if ($event.detail !== $root) shut()">

  <div class="flex items-center justify-between gap-3">
    <a href="/orders/1187/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums">PO-24-1187</a>
    <button type="button" x-show="!fine" x-cloak
            @click="open ? shut() : show(0)"
            :aria-expanded="open ? 'true' : 'false'" aria-controls="po-1187-preview"
            aria-label="Preview PO-24-1187"
            class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100">
      <i data-lucide="info" class="size-4"></i>
    </button>
  </div>

  <div id="po-1187-preview" x-show="open" x-cloak x-collapse class="mt-3 border-t border-zinc-100 pt-3">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="truncate text-[13px]/5 font-medium">Gujarat Polymers Ltd</p>
        <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600 tabular-nums">Raised 12 Aug 2026 · V-0142</p>
      </div>
      <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
      </span>
    </div>
    <dl class="mt-3 space-y-1.5">
      <div class="flex items-baseline justify-between gap-3">
        <dt class="text-[12px]/4 text-zinc-600">Value</dt>
        <dd class="text-[12px]/4 font-medium tabular-nums">₹18,42,000</dd>
      </div>
      <div class="flex items-baseline justify-between gap-3">
        <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
        <dd class="text-[12px]/4 tabular-nums">28 Aug 2026</dd>
      </div>
    </dl>
  </div>
</div>` },

      { id: 'django', name: 'Django register row', code:
`<!-- One row of a register, and the partial the card is fetched from. The same
     template renders the panel for htmx and for a direct request, so the
     preview and the page cannot drift apart.

     # views.py
     def order_card(request, pk):
         order = get_object_or_404(
             Order.objects.select_related('vendor', 'raised_by'), pk=pk
         )
         return render(request, 'orders/_hovercard.html', {'order': order})

     # urls.py
     path('orders/<int:pk>/card/', order_card, name='order-card'),

     select_related is not a tidy-up here. The card names the vendor and the
     person who raised the order, so without it every hovered row costs three
     queries, and a user running the pointer down a page of fifty makes a
     hundred and fifty.

     Nothing in the block carries an id, which is what makes it safe inside a
     for loop. The moment a hovercard names its panel — aria-controls, or an
     htmx hx-target — the id needs {{ order.pk }} in it on every row, and
     duplicate ids are the failure that follows a copy-paste into a loop.

     Give the view the same cache headers as any other read-only partial. A
     hovercard is the one component a user can fire fifty times in ten seconds
     without meaning to. -->
{% for order in page_obj %}
  <tr data-kui="hovercard/django" class="border-b border-zinc-200">
    <td class="px-4 py-2.5">
      <span class="relative inline-block"
            x-data="{
              open: false, timer: 0, loaded: false,
              show(d = 350) {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                  this.open = true;
                  if (!this.loaded) this.$refs.body.dispatchEvent(new CustomEvent('hovercard-fetch'));
                  window.dispatchEvent(new CustomEvent('hovercard-open', { detail: this.$root }));
                }, d);
              },
              hide() { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = false, 200); },
              shut() { clearTimeout(this.timer); this.open = false; }
            }"
            @mouseenter="show()" @mouseleave="hide()"
            @focusin="show(0)" @focusout="hide()"
            @keydown.escape.window="shut()"
            @hovercard-open.window="if ($event.detail !== $root) shut()"
            @htmx:after-swap.camel="loaded = true">

        <a href="{% url 'order-detail' order.pk %}" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums">{{ order.number }}</a>

        <div x-show="open" x-cloak x-transition.opacity.duration.150ms
             class="absolute top-full left-0 z-40 pt-2">
          <div x-ref="body"
               hx-get="{% url 'order-card' order.pk %}" hx-trigger="hovercard-fetch"
               hx-swap="innerHTML" hx-sync="this:drop"
               class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
            <div class="animate-pulse" aria-hidden="true">
              <div class="h-3 w-28 rounded bg-zinc-200"></div>
              <div class="mt-2 h-2.5 w-40 rounded bg-zinc-200"></div>
            </div>
          </div>
        </div>
      </span>
    </td>
    <td class="hidden px-4 py-2.5 text-zinc-600 sm:table-cell">{{ order.vendor.name }}</td>
    <td class="px-4 py-2.5 text-right tabular-nums">₹{{ order.value|intcomma }}</td>
  </tr>
{% endfor %}

{# orders/_hovercard.html — swapped into the panel, and rendered on its own
   when someone opens the URL directly. status_dot is the filter the badge
   component defines; it is the single place the status colour is decided. #}
{% load humanize ui %}
<div class="flex items-start justify-between gap-3">
  <div class="min-w-0">
    <p class="truncate text-[14px]/5 font-semibold tabular-nums">{{ order.number }}</p>
    <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">{{ order.vendor.name }}</p>
  </div>
  <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full {{ order.status|status_dot }}" aria-hidden="true"></span>{{ order.get_status_display }}
  </span>
</div>
<dl class="mt-3 space-y-1.5 border-t border-zinc-200 pt-3">
  <div class="flex items-baseline justify-between gap-3">
    <dt class="text-[12px]/4 text-zinc-600">Value</dt>
    <dd class="text-[12px]/4 font-medium tabular-nums">₹{{ order.value|intcomma }}</dd>
  </div>
  <div class="flex items-baseline justify-between gap-3">
    <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
    <dd class="text-[12px]/4 tabular-nums">{{ order.delivery_date|date:"d M Y" }}</dd>
  </div>
  <div class="flex items-baseline justify-between gap-3">
    <dt class="text-[12px]/4 text-zinc-600">Received</dt>
    <dd class="text-[12px]/4 tabular-nums">{{ order.received_count }} of {{ order.line_count }} GRNs</dd>
  </div>
</dl>
<p class="mt-3 border-t border-zinc-200 pt-3 text-[12px]/4 text-zinc-500 tabular-nums">Raised by {{ order.raised_by.get_full_name }} · {{ order.raised_on|date:"d M Y" }}</p>` }
    ]
  },

  {
    id: 'popover', name: 'Popover', category: 'feedback',
    description: 'A panel of controls anchored to a button and opened by a click. It holds things you focus and operate — a filter, a column list, a date range, a two-field edit — and the page behind it keeps working.',
    when: 'A handful of controls that belong to one button and are not worth a page, a sheet or a modal: the filter behind a Filters button, the column list behind a Columns button, a date range, an inline edit of one cell. The three neighbours draw the boundary. A tooltip is hover, text only, no focus and nothing to operate. A hovercard is hover as well — a preview of a record you read and at most click once. A popover is click, and it contains focusable, operable things. A dialog is what you reach for when the page behind must stop: a decision that has to be made, or a form long enough that losing it to a stray click is a real loss. A popover that opens on hover is a hovercard drawn wrong, and a popover holding a decision that must be made is a dialog drawn wrong.',
    notes: [
      'It opens on click and on nothing else. The hovercard next door opens on hover and pays for it with a 350ms open delay, a 200ms close delay, a padding bridge for the pointer to cross and a media query so a tap does not fire a synthetic mouseenter. A popover needs none of that, and the reason is not that it is simpler: it is that a click is an intent and a pointer passing over a column is not. Wire a popover to mouseenter and you get a filter form that opens because somebody was on their way to the scrollbar, and then takes their next click as a field. The same difference is why the gap between trigger and panel is a plain mt-1.5 here: the hovercard has to make that gap part of its own subtree, as padding on a wrapper, or mouseleave fires as the pointer crosses it, and a popover depends on the pointer staying nowhere at all.',
      'It is not modal, so it does not get a focus trap. No x-trap, no x-trap.noscroll, no backdrop. The page behind stays visible, stays scrollable and stays clickable, and trapping focus inside a panel while all of that is true is the worst of both: the user can see the register behind the filter, can click a row in it, and yet Tab refuses to go there. If the answer is that the page behind genuinely must stop, the component is a dialog and it belongs in that entry.',
      'It closes two ways and needs both. Click-outside alone leaves a keyboard user who tabs off the last field standing on the page with the panel still open behind them, and nothing to shut it but a click they were not going to make. Focus-out alone never fires for the commonest dismissal there is — a click on empty page background, which is not focusable, so no focusout with a real relatedTarget is ever produced. One handler covers the pointer leaving, the other covers focus leaving, and each is blind to the other\'s case.',
      'Guard the focus-out on $event.relatedTarget being truthy. Opening a native select popup or a date picker inside the panel moves focus out of the document into browser chrome, and Chromium reports that as focusout with relatedTarget null; so does alt-tabbing to another window, and so does a click on something unfocusable. Close on a bare focusout and the filter panel disappears the instant somebody opens the status select inside it, which is the single most common way this component is shipped broken. The rule is: close only when focus landed on a real element and that element is outside the root. Everything else is click-outside\'s job.',
      'Everything the popover owns has to stay inside the root element, because @click.outside decides by DOM containment and not by what is on the screen. Render the panel into a portal at the end of body, as a React popover would, and every click inside it is an outside click and the panel closes on its own first field. The same containment is what makes the DOM order right: the panel sits immediately after the trigger, so Tab from the trigger walks into the panel and Shift+Tab from the first field walks back to the trigger without a single tabindex. Move it and the keyboard order stops matching what is on the screen, which for a non-modal panel is the whole accessibility story.',
      'Escape closes and returns focus to the trigger, bound on the root with $event.stopPropagation(), not on window. The hovercard binds Escape on window because a card opened by the pointer has no focus inside it and a root-scoped keydown would never fire; a popover always has focus inside it, so the root scope works and is the better one — a window binding fires for panels the user is not in, and closes a popover behind an open dialog. stopPropagation is what keeps a popover inside a sheet from taking the sheet down with it on one keypress.',
      'Escape inside a nested control must not reach the popover. Any child that handles Escape itself — a search box that clears on Escape, a nested combobox, an inner disclosure — stops the event when it acts on it and lets it through when it does not: the pattern is a conditional stopPropagation, the same one the dropdown uses, not an unconditional .stop that makes the panel undismissable while the cursor is in a text field. Native pickers need no guard at all and must not be given one: a select popup and a date picker swallow Escape whole, so the first press closes the picker and no keydown reaches the page, and the second press closes the panel. That is correct two-stage behaviour, and a guard written to skip Escape when the target is a date field would break the case that already works — Escape closing the panel while such a field merely has focus.',
      'Focus moves into the panel on open and back to the trigger on close, and the panel carries tabindex="-1" so the first move has somewhere to land. Without it focus() on the panel is a silent no-op and the keyboard is still on the trigger, so Escape goes to the page and Tab walks into the panel one element at a time from outside — which happens to look right and is not. Move focus on requestAnimationFrame inside $nextTick, never in $nextTick alone: x-show has not written display when $nextTick runs, and focus() on a display:none element does nothing and reports nothing. Where the panel exists to be typed into, focus the first field instead of the panel; where it is read and operated by pointer, focus the panel itself.',
      'The trigger carries aria-expanded bound to the state and aria-controls pointing at the panel id. It does not carry aria-haspopup="menu". haspopup="menu" is a promise that Down and Up walk a list of role="menuitem" elements, and a screen reader user who is told "menu" and presses Down in a filter form gets silence; the honest value is aria-haspopup="dialog" and it is optional, while aria-expanded is not. The panel is role="dialog" with a label — non-modal, so no aria-modal — which is what makes a reader announce entering and leaving it. role="menu" here would be a lie in the other direction.',
      'Clamp and flip rather than resize, and measure after the panel is displayed. A 320px panel anchored left-0 to a trigger sitting at the right of a 390px screen hangs 200px off the edge and the page scrolls sideways; the fix is a translateX computed from getBoundingClientRect against innerWidth with a 12px margin, and a flip to bottom-full when there is no room below and there is room above. Never let the panel size itself down to fit: a filter form that is 320px wide on one trigger and 190px on the next is a different control each time it opens. This is the same maths as the hovercard\'s placement variant, deliberately, because two positioning strategies in one system is one too many. What the hovercard must not be copied on is the element the transition sits on: a panel positioned by a bound :style may not also carry x-transition, and this is measured rather than theoretical. The transition writes its own style attribute over the element while it runs — transform: scale(1) among other things — and on finish restores the attribute it cached before it started, which is the position from the last time the panel was closed. The bound value is now stale in the DOM and the binding will not correct it, because dx has not changed since Alpine last evaluated it, so nothing re-runs the effect. Observed on a right-aligned 320px panel at 390px: dx computed correctly as -180 on the first frame, the style attribute settled back to translateX(0px) four frames later, and the panel sat 135px off the right edge for the rest of its life. Either drop the transition from the panel, which is what the clamped, flipped and fixed variants here do, or move the :style onto a positioner wrapper and leave the transition on the panel inside it. A click-opened panel loses very little by appearing at once; a fade is worth having on a hovercard because hover is ambient, and worth nothing on a control the user deliberately pressed.',
      'A popover in a register cannot be position: absolute inside a cell whose ancestor clips. overflow-hidden on the table wrapper cuts the panel off at the row it opened on, and so does overflow-x-auto on a table too wide to fold down. Two ways out: drop the clipping and round the header cells instead, which is what the hovercard does, or make the panel position: fixed and drive left and top from the trigger\'s rect, which is what an editor inside a scroller has to do. Fixed brings its own trap: any ancestor carrying transform, filter, backdrop-filter, contain or will-change becomes the containing block, and the panel then anchors to that element instead of the viewport and lands somewhere nobody predicted. A fixed panel also has to be repositioned on scroll — both the window\'s and the scroller\'s, since scroll does not bubble — or it detaches from the cell it belongs to.',
      'Decide once whether the panel writes as it is touched or on an Apply button, and never both. Light dismiss means a click anywhere loses whatever is in the panel, so a panel that batches must reseed its draft from the committed values every time it opens, or the second open shows an edit the user already walked away from. A column picker applies live because its effect is visible in the table behind the open panel and there is nothing to confirm; a filter batches because every keystroke would re-run a query. Something that must not be lost to a stray click does not belong in a popover at all — that is what a dialog is, and a destructive confirm inside a light-dismiss panel is an alert-dialog drawn wrong.'
    ],
    anatomy: [
      ['Root', 'relative inline-block. It owns open, the handlers and both refs, because click-outside, focus-out and Escape all have to mean "left the trigger and the panel", and only their common parent knows that. Put @click.outside on the panel instead and the trigger counts as outside, so it closes on mousedown and reopens on click and can never be shut by its own button.'],
      ['Trigger', 'A real button with :aria-expanded and aria-controls, x-ref="trigger" so close() can hand focus back, and a chevron or an icon that says something is behind it. It is a button and not a link, because it reveals rather than navigates.'],
      ['Panel', 'The disclosed thing: role="dialog", tabindex="-1", an id, aria-labelledby or aria-label, x-cloak, w-80 with max-w-[calc(100vw_-_1.5rem)], rounded-xl, white, border-zinc-200, shadow-lg, z-40. Immediately after the trigger in the DOM, never portalled.'],
      ['Title', 'A 13px medium line at the head of the panel, and the target of aria-labelledby. A panel with no title takes aria-label instead; a panel with neither is announced as "dialog" and nothing else.'],
      ['Body', 'The controls. Fields wear the same bordered wrapper as everywhere else, with focus-within drawing the outline. Past about five controls the answer is a sheet or a page, because a popover has no scroll of its own and should not grow one.'],
      ['Footer', 'Only on a panel that batches: Clear on the left as underlined text, Apply on the right as the primary. On a zinc-100 strip inside the panel, which needs the panel to be overflow-hidden — and overflow-hidden is what clips an arrow, so a panel gets a footer or an arrow, not both.'],
      ['Arrow', 'Optional. A size-3 rotated square tucked half under the panel edge, bg-white with border-t and border-l so its two visible sides continue the panel border. Its left is computed from the trigger centre after the clamp, and it is dropped outright whenever the panel stops being anchored to the trigger.']
    ],
    behaviour: [
      'A click on the trigger opens it and a second click closes it. Hover does nothing at all, on any device, which is the one property that makes a popover work identically with a mouse, a keyboard and a thumb.',
      'Opening moves focus into the panel — onto the first field when there is something to fill in, onto the panel itself when there is not — and closing puts focus back on the trigger. Focus is not trapped in between: Tab leaves the panel into the page, and leaving is one of the ways it closes.',
      'It closes on a click outside the root, on focus landing outside the root, on Escape, and on the panel\'s own Apply or Cancel. It does not close on a scroll, on a timer, or because focus went somewhere that is not an element — a native select popup and a date picker both count as that.',
      'Escape closes it and stops there. An Escape a nested control has already acted on never reaches the popover, and an Escape the popover acts on never reaches a sheet or dialog around it.',
      'One popover is open at a time, and @click.outside does it with no store: a click on a second trigger is a click outside the first, so the first closes and the second opens in the same gesture.',
      'Near the right edge the panel shifts left to stay inside the viewport with a 12px margin, and near the foot of the page it flips above the trigger. It never changes width to fit, and the arrow is dropped in every case where the panel has been moved independently of the trigger.',
      'A panel with an Apply button holds a draft. Light dismiss discards it, reopening reseeds it from what was committed, and Clear resets the draft without closing the panel or writing anything.',
      'A panel whose body is fetched requests it on the click that opens it and keeps the result. There is no open delay to wait out, so unlike a hovercard it can fetch on open without a gate, and the skeleton is the shape of the answer so the panel does not resize when the response lands.',
      'At 390px an anchored panel that would be wider than the screen becomes a bottom sheet instead of a clipped popover. It is still non-modal and still light-dismiss; a sheet at the bottom of the screen that needs a backdrop and a trap is a drawer.'
    ],
    a11y: [
      'The trigger is a button carrying :aria-expanded bound to the state and aria-controls naming the panel id. Bound, not written once — an aria-expanded="false" left in the markup says collapsed for the rest of the session.',
      'It is not aria-haspopup="menu". That value promises arrow-key navigation over role="menuitem" children, and a form has none, so the user is told how to drive something that will not respond. aria-haspopup="dialog" is the accurate value and is optional; the required half is aria-expanded.',
      'The panel is role="dialog" with aria-labelledby pointing at its title, or aria-label when it has no title. There is no aria-modal, because it is not modal — writing aria-modal="true" hides the whole page behind it from the accessibility tree while it is still visible, clickable and scrollable.',
      'The panel carries tabindex="-1" so focus can be moved onto it programmatically, and nothing sets outline-none on it. When the popover was opened from the keyboard the panel matches :focus-visible and takes the outline, which is the only paint that says where focus went; when it was opened by a click it does not match and nothing is drawn.',
      'Focus moves in on open and back to the trigger on close, and is not trapped in between. Tab out of the last field goes to whatever follows the trigger on the page, which is correct for a non-modal panel and is also one of the dismissals — the focus-out handler closes it on the way past.',
      'Escape dismisses from anywhere inside the panel, including from inside a focused field, and returns focus to the trigger. A native picker takes the first Escape for itself and the panel takes the second; that is two presses by design and not a bug to code around.',
      'While closed the panel is display:none through x-show, so nothing inside it is a tab stop and a register of fifty inline editors adds fifty tab stops of triggers and none of fields.',
      'Status inside the panel follows the fixed dot mapping and the dot is aria-hidden, with the word beside it carrying the state, so nothing in the panel means something only by being a colour.'
    ],
    related: ['hovercard', 'dialog', 'dropdown'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- The whole contract in one panel: click to open, focus moves in, Escape or
     a click outside or focus leaving closes it, and focus goes back to the
     trigger.

     Two handlers do the closing and both are needed. @click.outside catches the
     pointer being put down on the page, which is the common dismissal and never
     produces a focusout with a real relatedTarget because page background is
     not focusable. @focusout catches Tab walking out of the panel, which
     produces no click at all. The guard on $event.relatedTarget is what keeps
     the panel open when focus leaves the document altogether — a native picker,
     another window, a click on something unfocusable — because none of those
     mean the user is finished with the panel.

     Focus is moved on requestAnimationFrame inside $nextTick. x-show has not
     written display when $nextTick runs, and focus() on a display:none element
     is a silent no-op that leaves the caret on the trigger.

     The panel keeps tabindex="-1" and no outline-none. Opened from the keyboard
     it matches :focus-visible and takes the outline, which is the only thing on
     screen that says focus moved; opened by a click it does not match and
     nothing is painted. -->
<div data-kui="popover/default" class="relative inline-block"
     x-data="{
       open: false,
       show() {
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs.panel.focus()));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false;
         if (toTrigger) this.$refs.trigger.focus();
       }
     }"
     @click.outside="close(false)"
     @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }">

  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          :aria-expanded="open" aria-controls="pop-det"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="building-2" class="size-4 text-zinc-600"></i>Gujarat Polymers Ltd
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>

  <div id="pop-det" x-ref="panel" x-show="open" x-cloak x-transition.opacity.duration.100ms
       role="dialog" tabindex="-1" aria-labelledby="pop-det-title"
       class="absolute top-full left-0 z-40 mt-1.5 w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p id="pop-det-title" class="truncate text-[13px]/5 font-medium">Gujarat Polymers Ltd</p>
        <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">V-0142 · Vapi, Gujarat</p>
      </div>
      <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Active
      </span>
    </div>

    <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
      <div class="flex items-baseline justify-between gap-3">
        <dt class="text-[12px]/4 text-zinc-600">GSTIN</dt>
        <dd class="text-[12px]/4 font-medium tabular-nums">24AABCG1234F1Z5</dd>
      </div>
      <div class="flex items-baseline justify-between gap-3">
        <dt class="text-[12px]/4 text-zinc-600">Payment terms</dt>
        <dd class="text-[12px]/4 tabular-nums">45 days</dd>
      </div>
      <div class="flex items-baseline justify-between gap-3">
        <dt class="text-[12px]/4 text-zinc-600">Open orders</dt>
        <dd class="text-[12px]/4 tabular-nums">4 · ₹42,18,500</dd>
      </div>
    </dl>

    <!-- two focusable things in the panel is what makes this a popover and not
         a hovercard: a hovercard is read, this is operated -->
    <div class="mt-3 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
      <button type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="copy" class="size-3.5 text-zinc-600"></i>Copy GSTIN
      </button>
      <a href="/vendors/142/" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Open vendor</a>
    </div>
  </div>
</div>` },

      { id: 'filter', name: 'Filter with Apply', code:
`<!-- The panel batches: nothing is written until Apply, because every keystroke
     here would re-run a query over the register. That makes the draft the
     hardest part of the component, not the positioning.

     show() reseeds draft from applied every single time. Light dismiss means a
     click on the page throws the panel's contents away, so without the reseed
     the next open shows the edit the user already walked away from, and Apply
     then commits something they abandoned.

     The status select is the reason @focusout is guarded. Opening a native
     select popup takes focus out of the document and Chromium reports
     focusout with relatedTarget null; close on that and the panel vanishes the
     instant anyone touches the first field in it. Choosing an option produces
     no document click either, so @click.outside is safe here — it is only
     unsafe for a child rendered outside the root, which is why nothing in this
     component is ever portalled.

     Focus opens on the first field rather than on the panel, because the panel
     exists to be filled in. Shift+Tab from it lands back on the trigger with no
     tabindex written anywhere, and that only works because the panel is the
     trigger's next sibling in the DOM.

     The footer sits on a zinc-100 strip, so the panel is overflow-hidden and
     the panel padding moves onto the sections. That is also why this variant
     has no arrow: overflow-hidden clips one. -->
<div data-kui="popover/filter" class="relative inline-block"
     x-data="{
       open: false,
       applied: { status: 'all', min: '', max: '', overdue: false },
       draft: { status: 'all', min: '', max: '', overdue: false },
       count() {
         let n = 0;
         if (this.applied.status !== 'all') n++;
         if (this.applied.min || this.applied.max) n++;
         if (this.applied.overdue) n++;
         return n;
       },
       show() {
         this.draft = Object.assign({}, this.applied);
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs.status.focus()));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false;
         if (toTrigger) this.$refs.trigger.focus();
       },
       apply() { this.applied = Object.assign({}, this.draft); this.close() },
       clear() { this.draft = { status: 'all', min: '', max: '', overdue: false }; this.$refs.status.focus() }
     }"
     @click.outside="close(false)"
     @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }">

  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          :aria-expanded="open" aria-controls="pop-flt"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="filter" class="size-4 text-zinc-600"></i>Filters
    <span x-show="count() > 0" x-cloak
          class="inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium text-zinc-700 tabular-nums ring-1 ring-inset ring-zinc-300"
          x-text="count()"></span>
  </button>

  <div id="pop-flt" x-ref="panel" x-show="open" x-cloak x-transition.opacity.duration.100ms
       role="dialog" tabindex="-1" aria-labelledby="pop-flt-title"
       class="absolute top-full left-0 z-40 mt-1.5 w-80 max-w-[calc(100vw_-_1.5rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

    <div class="space-y-3 px-4 py-3.5">
      <p id="pop-flt-title" class="text-[13px]/5 font-medium">Filter purchase orders</p>

      <div>
        <label for="flt-status" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">Status</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="flt-status" x-ref="status" x-model="draft.status" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option value="all">Any status</option>
            <option value="open">Open</option>
            <option value="approved">Approved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div>
        <span class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">Order value</span>
        <div class="flex items-center gap-2">
          <div class="flex flex-1 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <span class="pl-3 text-[13px]/5 text-zinc-500">₹</span>
            <input id="flt-min" x-model="draft.min" inputmode="numeric" placeholder="0" aria-label="Minimum order value"
                   class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
          </div>
          <span class="text-[12px]/4 text-zinc-500">to</span>
          <div class="flex flex-1 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <span class="pl-3 text-[13px]/5 text-zinc-500">₹</span>
            <input id="flt-max" x-model="draft.max" inputmode="numeric" placeholder="Any" aria-label="Maximum order value"
                   class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
          </div>
        </div>
      </div>

      <label class="flex items-center gap-2.5 py-1 text-[13px]/5">
        <input id="flt-overdue" type="checkbox" x-model="draft.overdue" class="size-4 shrink-0 accent-zinc-700">
        Only orders past their delivery date
      </label>
    </div>

    <div class="flex items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-100 px-4 py-2.5">
      <button type="button" @click="clear()" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Clear</button>
      <button type="button" @click="apply()"
              class="rounded-lg bg-zinc-700 px-3.5 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Apply</button>
    </div>
  </div>
</div>

<p class="mt-3 text-[12px]/4 tabular-nums text-zinc-500">1,438 orders · nothing is filtered until Apply is pressed.</p>` },

      { id: 'columns', name: 'Column picker', code:
`<!-- The opposite decision from the filter next door, and for a reason that is
     visible on screen: the effect of a checkbox here is the table behind the
     open panel changing shape, so there is nothing to confirm and an Apply
     button would only make the user press it to see what they already saw.

     The search box is where a nested Escape gets settled. Escape with text in
     the box clears the box and stops there; Escape with the box empty is left
     alone and travels up to the root handler, which closes the panel. An
     unconditional .stop makes the popover undismissable for as long as the
     cursor is in a text field, which is the failure this pattern exists to
     avoid — it is the same conditional stopPropagation the dropdown uses.

     The last remaining column disables its own checkbox. A table with no
     columns renders as a stack of empty rows and looks like a data failure, and
     the user has no way back because the thing they would click is gone.

     x-show on a <td> sets display:none on the cell, which removes it from the
     row properly; every row hides the same cell so the header and body stay in
     step.

     Vendor and Raised on additionally carry hidden sm:table-cell, because four
     columns of this table measure 386px and a 390px screen has about 344px to
     give it — measured, it pushed the whole page 42px sideways. Two things
     decide the same cell, so it is worth being exact about which wins, and the
     four combinations are not symmetrical:

       picker off, any width   → Alpine writes an inline display:none, which
                                 beats any class, so the cell is gone
       picker on, below sm     → Alpine removes the display property entirely
                                 rather than writing table-cell, so the hidden
                                 class governs and the cell is still gone
       picker on, sm and up    → no inline style, sm:table-cell wins, visible
       first paint, picker on  → Alpine has not run, so the class alone decides

     The rule that falls out: hidden wins in every case except picker-on above
     the breakpoint. It only works because Alpine's show path is
     removeProperty('display') and not display = 'table-cell'. Had it written a
     value the inline style would beat the breakpoint and the table would
     overflow again the moment somebody toggled a column off and back on.

     shown() is left counting what the picker holds, not what is on the screen,
     so at 390px it reads 4 of 5 while two of those four are not rendered. That
     is the honest count: the picker is a saved view preference that travels
     with the user to a desktop, and the last-column guard is protecting them
     from saving a table with no columns in it — not from a narrow window, which
     is temporary and which they cannot fix from inside this panel anyway.

     One x-data covers the table and the popover, because the checkboxes and the
     cells are the same state. That makes the popover wrapper no longer the
     x-data root, so the focus-out test is $el and not $root: $root here is the
     whole block including the table, and focus moving from the panel into a row
     would test as still inside and never close the panel. Every other variant
     has the handlers on the root and the two are the same element. -->

<div data-kui="popover/columns" x-data="{
       open: false, q: '',
       cols: [
         { key: 'po', label: 'Order', on: true },
         { key: 'vendor', label: 'Vendor', on: true },
         { key: 'raised', label: 'Raised on', on: false },
         { key: 'value', label: 'Value', on: true },
         { key: 'status', label: 'Status', on: true }
       ],
       on(k) { return this.cols.find(c => c.key === k).on },
       shown() { return this.cols.filter(c => c.on).length },
       list() { return this.cols.filter(c => c.label.toLowerCase().includes(this.q.toLowerCase())) },
       show() {
         this.q = '';
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs.panel.focus()));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false;
         if (toTrigger) this.$refs.trigger.focus();
       }
     }">

  <div class="mb-3 flex items-center justify-between gap-3">
    <h3 class="text-[13px]/5 font-medium">Purchase orders</h3>

    <div class="relative inline-block"
         @click.outside="close(false)"
         @focusout="if ($event.relatedTarget && !$el.contains($event.relatedTarget)) close(false)"
         @keydown.escape="if (open) { $event.stopPropagation(); close() }">
      <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
              :aria-expanded="open" aria-controls="pop-col"
              class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="columns-3" class="size-4 text-zinc-600"></i>Columns
        <span class="text-[12px]/4 tabular-nums text-zinc-500" x-text="shown() + ' of ' + cols.length"></span>
      </button>

      <div id="pop-col" x-ref="panel" x-show="open" x-cloak x-transition.opacity.duration.100ms
           role="dialog" tabindex="-1" aria-labelledby="pop-col-title"
           class="absolute top-full right-0 z-40 mt-1.5 w-64 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-3 shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

        <p id="pop-col-title" class="text-[13px]/5 font-medium">Columns</p>
        <p class="mt-0.5 text-[12px]/4 text-zinc-500">Each change applies to the table at once.</p>
        <p class="mt-0.5 text-[12px]/4 text-zinc-500 sm:hidden">Vendor and Raised on are off on a screen this narrow, whatever is ticked here.</p>

        <div class="mt-2.5 flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <i data-lucide="search" class="ml-2.5 size-3.5 shrink-0 text-zinc-500"></i>
          <input id="col-q" type="text" x-model="q" placeholder="Find a column" aria-label="Find a column"
                 @keydown.escape="if (q) { $event.stopPropagation(); q = '' }"
                 class="w-full bg-transparent px-2 py-1.5 text-[13px]/5 outline-none">
        </div>

        <div class="mt-2 space-y-0.5">
          <template x-for="c in list()" :key="c.key">
            <label class="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-[13px]/5 hover:bg-zinc-100 has-[:disabled]:text-zinc-500">
              <input type="checkbox" x-model="c.on" :disabled="c.on && shown() === 1" class="size-4 shrink-0 accent-zinc-700">
              <span x-text="c.label"></span>
            </label>
          </template>
          <p x-show="list().length === 0" x-cloak class="px-1.5 py-2 text-[12px]/4 text-zinc-500">No column matches that.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="rounded-xl border border-zinc-300 bg-white">
    <table class="w-full text-left text-[13px]/5">
      <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
        <tr>
          <th scope="col" x-show="on('po')" class="px-4 py-2 font-medium">Order</th>
          <th scope="col" x-show="on('vendor')" class="hidden px-4 py-2 font-medium sm:table-cell">Vendor</th>
          <th scope="col" x-show="on('raised')" x-cloak class="hidden px-4 py-2 font-medium sm:table-cell">Raised on</th>
          <th scope="col" x-show="on('value')" class="px-4 py-2 text-right font-medium">Value</th>
          <th scope="col" x-show="on('status')" class="px-4 py-2 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-zinc-100">
          <td x-show="on('po')" class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
          <td x-show="on('vendor')" class="hidden px-4 py-2.5 text-zinc-600 sm:table-cell">Gujarat Polymers Ltd</td>
          <td x-show="on('raised')" x-cloak class="hidden px-4 py-2.5 tabular-nums text-zinc-600 sm:table-cell">12 Aug 2026</td>
          <td x-show="on('value')" class="px-4 py-2.5 text-right tabular-nums">₹18,42,000</td>
          <td x-show="on('status')" class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
            </span>
          </td>
        </tr>
        <tr>
          <td x-show="on('po')" class="px-4 py-2.5 font-medium tabular-nums">PO-24-1191</td>
          <td x-show="on('vendor')" class="hidden px-4 py-2.5 text-zinc-600 sm:table-cell">Nashik Steel Traders</td>
          <td x-show="on('raised')" x-cloak class="hidden px-4 py-2.5 tabular-nums text-zinc-600 sm:table-cell">18 Aug 2026</td>
          <td x-show="on('value')" class="px-4 py-2.5 text-right tabular-nums">₹6,04,750</td>
          <td x-show="on('status')" class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>` },

      { id: 'date-range', name: 'Date range', code:
`<!-- Two native date inputs, which is exactly where a popover that closes on a
     bare focusout falls apart. Clicking the calendar glyph in an
     input[type=date] opens browser chrome, focus leaves the document, and
     Chromium reports focusout with relatedTarget null; the guard on
     relatedTarget is the whole reason this panel survives being used.

     Escape is two presses here and that is correct, not a bug. The open picker
     swallows the first one whole — the popup closes and no keydown reaches the
     page at all — and the second reaches the root handler and closes the panel.
     Do not add a guard that skips Escape when the target is a date field: that
     would break Escape closing the panel while such a field merely has focus,
     which works today.

     The presets are buttons and not radios. A preset is an action that writes
     both fields, not a value the form holds — pick one and then nudge From by a
     day and the radio is still lit next to a range it no longer describes.

     Apply is the only write. The trigger label is the committed range, so a
     panel dismissed by a click on the page leaves the label saying what the
     register is actually showing. -->
<div data-kui="popover/date-range" class="relative inline-block"
     x-data="{
       open: false,
       applied: { from: '2026-08-01', to: '2026-08-31', label: '01 Aug 2026 – 31 Aug 2026' },
       draft: { from: '2026-08-01', to: '2026-08-31' },
       preset(from, to) { this.draft.from = from; this.draft.to = to; this.$refs.from.focus() },
       fmt(v) {
         const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
         const p = v.split('-');
         return p[2] + ' ' + m[Number(p[1]) - 1] + ' ' + p[0];
       },
       show() {
         this.draft = { from: this.applied.from, to: this.applied.to };
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs.from.focus()));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false;
         if (toTrigger) this.$refs.trigger.focus();
       },
       apply() {
         this.applied = { from: this.draft.from, to: this.draft.to,
                          label: this.fmt(this.draft.from) + ' – ' + this.fmt(this.draft.to) };
         this.close();
       }
     }"
     @click.outside="close(false)"
     @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }">

  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          :aria-expanded="open" aria-controls="pop-dt"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium tabular-nums hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="calendar" class="size-4 text-zinc-600"></i>
    <span x-text="applied.label">01 Aug 2026 – 31 Aug 2026</span>
  </button>

  <div id="pop-dt" x-ref="panel" x-show="open" x-cloak x-transition.opacity.duration.100ms
       role="dialog" tabindex="-1" aria-labelledby="pop-dt-title"
       class="absolute top-full left-0 z-40 mt-1.5 w-80 max-w-[calc(100vw_-_1.5rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

    <div class="space-y-3 px-4 py-3.5">
      <p id="pop-dt-title" class="text-[13px]/5 font-medium">Delivery date between</p>

      <div class="flex flex-wrap gap-1.5">
        <button type="button" @click="preset('2026-08-01', '2026-08-31')"
                class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">This month</button>
        <button type="button" @click="preset('2026-07-22', '2026-08-21')"
                class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[12px]/4 font-medium tabular-nums hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Last 30 days</button>
        <button type="button" @click="preset('2026-07-01', '2026-09-30')"
                class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Q2 FY 26-27</button>
      </div>

      <div class="flex items-end gap-2">
        <div class="min-w-0 flex-1">
          <label for="dt-from" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">From</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <input id="dt-from" x-ref="from" type="date" x-model="draft.from" :max="draft.to"
                   class="w-full bg-transparent px-2.5 py-2 text-[13px]/5 tabular-nums outline-none">
          </div>
        </div>
        <span class="pb-2.5 text-[12px]/4 text-zinc-500">to</span>
        <div class="min-w-0 flex-1">
          <label for="dt-to" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">To</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <input id="dt-to" type="date" x-model="draft.to" :min="draft.from"
                   class="w-full bg-transparent px-2.5 py-2 text-[13px]/5 tabular-nums outline-none">
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-100 px-4 py-2.5">
      <button type="button" @click="close()" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Cancel</button>
      <button type="button" @click="apply()"
              class="rounded-lg bg-zinc-700 px-3.5 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Apply</button>
    </div>
  </div>
</div>` },

      { id: 'inline-edit', name: 'Inline edit in a scrolling table', code:
`<!-- The register scrolls sideways at 390px, so the wrapper is overflow-x-auto,
     and that is what an absolutely positioned panel inside a cell cannot
     survive: the scroller is its clipping ancestor and the panel is cut off at
     the edge of the table. overflow-hidden on the wrapper does the same thing
     one row down. Either drop the clipping and round the header cells by hand,
     which is what the hovercard does, or make the panel position: fixed — which
     is the only answer when the container genuinely has to scroll.

     Fixed brings its own trap. Any ancestor carrying transform, filter,
     backdrop-filter, contain or will-change becomes the containing block, and
     the panel then anchors to that element instead of the viewport and lands
     somewhere nobody predicted. Nothing above these cells may take a transform.

     A fixed panel has no anchor of its own, so place() computes left and top
     from the trigger's rect and re-runs on scroll. scroll does not bubble, so
     the window listener never hears the table's own scrollbar; the scroller
     dispatches its own event, which does bubble, and every open panel listens
     for it. Repositioning rather than closing is deliberate — closing on scroll
     throws away what the user has typed.

     left and top are a bound :style, so these panels carry no x-transition —
     a transition restores the style attribute it cached before it ran, which
     would pin the panel at the position it had on the previous open and leave
     it there after a scroll. The placement variant has the measurement.

     htmx does the writing, because Alpine does not fetch. The response replaces
     the cell text only, so nothing about the row is rebuilt and the trigger the
     panel belongs to survives the swap; Alpine closes the panel and hands focus
     back to that trigger on a successful request, and leaves it open with the
     text intact on a failure. -->
<div data-kui="popover/inline-edit" class="overflow-x-auto rounded-xl border border-zinc-300 bg-white"
     x-data @scroll="$dispatch('rail-scroll')">
  <table class="w-full min-w-[34rem] text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="px-4 py-2 font-medium">Item</th>
        <th scope="col" class="px-4 py-2 text-right font-medium">Qty</th>
        <th scope="col" class="px-4 py-2 text-right font-medium">Rate</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2 text-zinc-600">MS angle 50×50×6</td>
        <td class="px-4 py-2 text-right tabular-nums">12,000 kg</td>
        <td class="px-4 py-2 text-right"
            x-data="{
              open: false, x: 0, y: 0,
              place() {
                const r = this.$refs.trigger.getBoundingClientRect(), p = this.$refs.panel, m = 12;
                this.x = Math.round(Math.max(m, Math.min(r.right - p.offsetWidth, innerWidth - m - p.offsetWidth)));
                this.y = Math.round(r.bottom + p.offsetHeight + m > innerHeight && r.top - p.offsetHeight > m
                                    ? r.top - p.offsetHeight - 6 : r.bottom + 6);
              },
              show() {
                this.open = true;
                this.$nextTick(() => requestAnimationFrame(() => { this.place(); this.$refs.rate.focus(); this.$refs.rate.select() }));
              },
              close(toTrigger = true) {
                if (!this.open) return;
                this.open = false;
                if (toTrigger) this.$refs.trigger.focus();
              }
            }"
            @click.outside="close(false)"
            @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
            @keydown.escape="if (open) { $event.stopPropagation(); close() }"
            @scroll.window="open && place()"
            @rail-scroll.window="open && place()"
            @resize.window.debounce="open && place()"
            @htmx:after-request.camel="if ($event.detail.successful) close()">

          <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
                  :aria-expanded="open" aria-controls="pop-ed1" aria-label="Edit rate for MS angle 50×50×6"
                  class="-mr-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <span id="ed1-val" class="tabular-nums">₹57.00</span>
            <i data-lucide="pencil" class="size-3.5 text-zinc-500"></i>
          </button>

          <div id="pop-ed1" x-ref="panel" x-show="open" x-cloak
               :style="'left: ' + x + 'px; top: ' + y + 'px'"
               role="dialog" tabindex="-1" aria-labelledby="pop-ed1-title"
               class="fixed z-40 w-64 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <form hx-post="/orders/1187/lines/1/rate/" hx-target="#ed1-val" hx-swap="innerHTML">
              <p id="pop-ed1-title" class="text-[12px]/4 font-medium text-zinc-600">Rate per kg</p>
              <div class="mt-1.5 flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <span class="pl-3 text-[13px]/5 text-zinc-500">₹</span>
                <input x-ref="rate" name="rate" value="57.00" inputmode="decimal" aria-label="Rate per kg"
                       class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
              </div>
              <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Rate contract RC-118 · ₹54.00 to ₹60.00</p>
              <div class="mt-2.5 flex items-center justify-end gap-2">
                <button type="button" @click="close()" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Cancel</button>
                <button type="submit"
                        class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[12px]/4 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save</button>
              </div>
            </form>
          </div>
        </td>
      </tr>

      <tr>
        <td class="px-4 py-2 text-zinc-600">MS plate 10 mm</td>
        <td class="px-4 py-2 text-right tabular-nums">4,000 kg</td>
        <td class="px-4 py-2 text-right"
            x-data="{
              open: false, x: 0, y: 0,
              place() {
                const r = this.$refs.trigger.getBoundingClientRect(), p = this.$refs.panel, m = 12;
                this.x = Math.round(Math.max(m, Math.min(r.right - p.offsetWidth, innerWidth - m - p.offsetWidth)));
                this.y = Math.round(r.bottom + p.offsetHeight + m > innerHeight && r.top - p.offsetHeight > m
                                    ? r.top - p.offsetHeight - 6 : r.bottom + 6);
              },
              show() {
                this.open = true;
                this.$nextTick(() => requestAnimationFrame(() => { this.place(); this.$refs.rate.focus(); this.$refs.rate.select() }));
              },
              close(toTrigger = true) {
                if (!this.open) return;
                this.open = false;
                if (toTrigger) this.$refs.trigger.focus();
              }
            }"
            @click.outside="close(false)"
            @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
            @keydown.escape="if (open) { $event.stopPropagation(); close() }"
            @scroll.window="open && place()"
            @rail-scroll.window="open && place()"
            @resize.window.debounce="open && place()"
            @htmx:after-request.camel="if ($event.detail.successful) close()">

          <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
                  :aria-expanded="open" aria-controls="pop-ed2" aria-label="Edit rate for MS plate 10 mm"
                  class="-mr-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <span id="ed2-val" class="tabular-nums">₹78.00</span>
            <i data-lucide="pencil" class="size-3.5 text-zinc-500"></i>
          </button>

          <div id="pop-ed2" x-ref="panel" x-show="open" x-cloak
               :style="'left: ' + x + 'px; top: ' + y + 'px'"
               role="dialog" tabindex="-1" aria-labelledby="pop-ed2-title"
               class="fixed z-40 w-64 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <form hx-post="/orders/1187/lines/2/rate/" hx-target="#ed2-val" hx-swap="innerHTML">
              <p id="pop-ed2-title" class="text-[12px]/4 font-medium text-zinc-600">Rate per kg</p>
              <div class="mt-1.5 flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <span class="pl-3 text-[13px]/5 text-zinc-500">₹</span>
                <input x-ref="rate" name="rate" value="78.00" inputmode="decimal" aria-label="Rate per kg"
                       class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
              </div>
              <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Rate contract RC-118 · ₹74.00 to ₹82.00</p>
              <div class="mt-2.5 flex items-center justify-end gap-2">
                <button type="button" @click="close()" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Cancel</button>
                <button type="submit"
                        class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[12px]/4 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save</button>
              </div>
            </form>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'arrow', name: 'Arrow, and when to drop it', code:
`<!-- The arrow is a size-3 square rotated 45 degrees, half above the panel edge,
     with border-t and border-l so its two visible sides continue the panel
     border and its white fill covers the length of panel border it sits on. It
     is a child of the panel, so a panel that is overflow-hidden clips it — which
     is why a panel with a tinted footer strip cannot have one.

     The part that is always got wrong: the arrow must be positioned against the
     trigger, not against the panel. The moment the clamp shifts the panel left
     to keep it on screen, an arrow at a fixed left travels with the panel and
     points at empty space, and it points confidently, which is worse than not
     being there. ax is the trigger centre expressed in the panel's own
     coordinates after the shift, clamped 14px in from either end so it never
     hangs off a rounded corner.

     Drop the arrow entirely in three cases, because in all three there is no
     honest place to put it: when the panel flips above the trigger and you have
     not swapped the borders to border-b and border-r; when the panel becomes
     full-width or a bottom sheet at 390px, where it spans the screen and the
     trigger could be anywhere along it; and when the panel is position: fixed
     and repositioned on scroll, where the arrow has to be recomputed on every
     scroll frame for a decoration nobody is reading.

     An arrow earns its place only when the panel is small and there is more
     than one thing it could plausibly belong to — here, one figure in a column
     of figures. On a Filters button at the top of a page, drop it.

     No x-transition on the panel, for the reason spelled out in the placement
     variant: a transition and a bound :style on one element do not compose, and
     the transition wins by restoring a cached style attribute after the clamp
     has already run. The arrow\'s own :style is safe, because the arrow is a
     child and has no transition of its own. -->
<div data-kui="popover/arrow" class="flex items-center justify-between gap-4 rounded-xl border border-zinc-300 bg-white px-4 py-3">
  <div class="min-w-0">
    <p class="truncate text-[13px]/5 font-medium">MS angle 50×50×6</p>
    <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">GRN-24-4471 · 12,000 kg</p>
  </div>

  <div class="relative shrink-0"
       x-data="{
         open: false, dx: 0, ax: 0,
         place() {
           const r = this.$root.getBoundingClientRect(), p = this.$refs.panel, m = 12;
           this.dx = Math.round(Math.max(m, Math.min(r.left, innerWidth - m - p.offsetWidth)) - r.left);
           this.ax = Math.round(Math.min(Math.max(r.width / 2 - this.dx, 14), p.offsetWidth - 14));
         },
         show() {
           this.open = true;
           this.$nextTick(() => requestAnimationFrame(() => { this.place(); this.$refs.panel.focus() }));
         },
         close(toTrigger = true) {
           if (!this.open) return;
           this.open = false;
           if (toTrigger) this.$refs.trigger.focus();
         }
       }"
       @click.outside="close(false)"
       @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
       @keydown.escape="if (open) { $event.stopPropagation(); close() }"
       @resize.window.debounce="open && place()">

    <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
            :aria-expanded="open" aria-controls="pop-arw"
            class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px]/5 font-medium tabular-nums hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      ₹6,98,400
      <i data-lucide="info" class="size-3.5 text-zinc-500"></i>
    </button>

    <div id="pop-arw" x-ref="panel" x-show="open" x-cloak
         :style="'transform: translateX(' + dx + 'px)'"
         role="dialog" tabindex="-1" aria-labelledby="pop-arw-title"
         class="absolute top-full left-0 z-40 mt-1.5 w-64 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

      <span :style="'left: ' + ax + 'px'"
            class="absolute -top-1.5 size-3 -translate-x-1/2 rotate-45 border-t border-l border-zinc-200 bg-white"
            aria-hidden="true"></span>

      <p id="pop-arw-title" class="text-[13px]/5 font-medium">Landed cost</p>
      <dl class="mt-2 space-y-1.5">
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Basic</dt>
          <dd class="text-[12px]/4 tabular-nums">₹6,84,000</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Freight</dt>
          <dd class="text-[12px]/4 tabular-nums">₹9,200</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3">
          <dt class="text-[12px]/4 text-zinc-600">Unloading</dt>
          <dd class="text-[12px]/4 tabular-nums">₹5,200</dd>
        </div>
        <div class="flex items-baseline justify-between gap-3 border-t border-zinc-100 pt-1.5">
          <dt class="text-[12px]/4 font-medium">Landed</dt>
          <dd class="text-[12px]/4 font-medium tabular-nums">₹6,98,400</dd>
        </div>
      </dl>
      <a href="/grn/4471/costing/" class="mt-2.5 inline-block text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Costing sheet</a>
    </div>
  </div>
</div>` },

      { id: 'placement', name: 'Right-aligned and flipped', code:
`<!-- Two triggers at the ends of a toolbar. The left one aligns its panel to the
     trigger's left edge; the right one aligns to the trigger's right edge,
     which is what end is for — a 320px panel opened left-aligned from a
     right-hand button hangs off the screen and the page scrolls sideways, and
     at 390px both of them do.

     One function covers all four cases. want is where the panel would like to
     start; the Math.max/Math.min pair pulls it back inside the viewport with a
     12px margin; the result is applied as a translateX rather than a change of
     width, because a filter panel that is 320px wide on one trigger and 190px
     on the next is a different control each time it opens. up flips the panel
     above the trigger when there is no room below and there is room above,
     which is the case at the foot of a long register.

     place() runs inside requestAnimationFrame inside $nextTick, because that is
     the first moment x-show has written display and the panel can be measured
     at all — offsetWidth is 0 in $nextTick alone, and the clamp then computes
     against a zero-width panel and moves nothing.

     There is no x-transition on these panels and there must not be. The
     transition writes its own style attribute over the element while it runs
     and restores the cached one when it finishes, which throws away the
     translate the clamp just applied; and the binding does not put it back,
     because dx has not changed since Alpine last read it, so no effect re-runs.
     Measured here at 390px: dx was correct at -180 on the first frame and the
     attribute settled back to translateX(0px) four frames later, leaving the
     right-hand panel 135px off the screen. Where a fade is wanted alongside a
     clamp, the :style goes on a positioner wrapper and the transition stays on
     the panel inside it — never both on one element.

     This is deliberately the same maths as the hovercard's placement variant.
     Two positioning strategies in one system is one too many; the difference
     between the components is what opens them, not where they land. -->
<div data-kui="popover/placement" class="flex items-center justify-between gap-4">
  <div class="relative"
       x-data="{
         open: false, end: false, up: false, dx: 0,
         place() {
           const r = this.$root.getBoundingClientRect(), p = this.$refs.panel, m = 12;
           const want = this.end ? r.right - p.offsetWidth : r.left;
           this.dx = Math.round(Math.max(m, Math.min(want, innerWidth - m - p.offsetWidth)) - r.left);
           this.up = r.bottom + p.offsetHeight > innerHeight - m && r.top - p.offsetHeight > m;
         },
         show() {
           this.open = true;
           this.$nextTick(() => requestAnimationFrame(() => { this.place(); this.$refs.panel.focus() }));
         },
         close(toTrigger = true) {
           if (!this.open) return;
           this.open = false;
           if (toTrigger) this.$refs.trigger.focus();
         }
       }"
       @click.outside="close(false)"
       @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
       @keydown.escape="if (open) { $event.stopPropagation(); close() }"
       @resize.window.debounce="open && place()">

    <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
            :aria-expanded="open" aria-controls="pop-plc-a"
            class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="align-left" class="size-4 text-zinc-600"></i>Aligned to the start
    </button>

    <div id="pop-plc-a" x-ref="panel" x-show="open" x-cloak
         :class="up ? 'bottom-full mb-1.5' : 'top-full mt-1.5'"
         :style="'transform: translateX(' + dx + 'px)'"
         role="dialog" tabindex="-1" aria-labelledby="pop-plc-a-title"
         class="absolute left-0 z-40 w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p id="pop-plc-a-title" class="text-[13px]/5 font-medium">Start aligned</p>
      <p class="mt-1 text-[12px]/4 text-zinc-600">The panel starts at the trigger's left edge, and shifts right only if that would put it off the left of the screen.</p>
      <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">Flips above the trigger near the foot of the page.</p>
    </div>
  </div>

  <div class="relative"
       x-data="{
         open: false, end: true, up: false, dx: 0,
         place() {
           const r = this.$root.getBoundingClientRect(), p = this.$refs.panel, m = 12;
           const want = this.end ? r.right - p.offsetWidth : r.left;
           this.dx = Math.round(Math.max(m, Math.min(want, innerWidth - m - p.offsetWidth)) - r.left);
           this.up = r.bottom + p.offsetHeight > innerHeight - m && r.top - p.offsetHeight > m;
         },
         show() {
           this.open = true;
           this.$nextTick(() => requestAnimationFrame(() => { this.place(); this.$refs.panel.focus() }));
         },
         close(toTrigger = true) {
           if (!this.open) return;
           this.open = false;
           if (toTrigger) this.$refs.trigger.focus();
         }
       }"
       @click.outside="close(false)"
       @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
       @keydown.escape="if (open) { $event.stopPropagation(); close() }"
       @resize.window.debounce="open && place()">

    <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
            :aria-expanded="open" aria-controls="pop-plc-b"
            class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="align-right" class="size-4 text-zinc-600"></i>Aligned to the end
    </button>

    <div id="pop-plc-b" x-ref="panel" x-show="open" x-cloak
         :class="up ? 'bottom-full mb-1.5' : 'top-full mt-1.5'"
         :style="'transform: translateX(' + dx + 'px)'"
         role="dialog" tabindex="-1" aria-labelledby="pop-plc-b-title"
         class="absolute left-0 z-40 w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <p id="pop-plc-b-title" class="text-[13px]/5 font-medium">End aligned</p>
      <p class="mt-1 text-[12px]/4 text-zinc-600">The panel ends at the trigger's right edge. left-0 plus a translate rather than right-0, so one clamp covers both alignments.</p>
      <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">At 390px both panels land 12px from the edge and nothing scrolls sideways.</p>
    </div>
  </div>
</div>` },

      { id: 'responsive', name: 'Sheet at 390px', code:
`<!-- A 320px panel anchored under a trigger on a 390px screen has 35px of slack,
     so it is always clamped, always nearly full width, and always covering the
     row it came from. Below sm the panel stops pretending to be anchored and
     becomes a bottom sheet: fixed to the bottom edge, full width, rounded on
     the top corners only. From sm up the same element is the ordinary anchored
     popover, which is why this is a class swap and not a second component.

     It stays non-modal in both shapes. No backdrop, no focus trap, the page
     behind still scrolls, and it still closes on a click outside, on focus
     leaving and on Escape. A panel at the bottom of a phone screen that needs a
     backdrop and a trap is a drawer, and that is a different entry — the test
     is whether the page behind must stop, not where the panel sits.

     The arrow is dropped below sm, and there is no version of it that would
     work: the sheet spans the screen and the trigger could be anywhere along
     it, so there is nothing for it to point at.

     Buttons in the footer go full width below sm and auto above it. A 44px
     target across the width of the sheet is what the thumb is reaching for; the
     same button 90px wide in the corner of a phone screen is the commonest
     mis-tap in an internal tool.

     fixed inset-x-0 bottom-0 depends on no ancestor carrying a transform,
     filter or will-change. One of those and the sheet anchors to that element
     instead of the viewport, and it lands halfway up the page. -->
<div data-kui="popover/responsive" class="relative inline-block"
     x-data="{
       open: false,
       show() {
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs.plant.focus()));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false;
         if (toTrigger) this.$refs.trigger.focus();
       }
     }"
     @click.outside="close(false)"
     @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }">

  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          :aria-expanded="open" aria-controls="pop-sh"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="sliders-horizontal" class="size-4 text-zinc-600"></i>Narrow the GRN list
  </button>

  <div id="pop-sh" x-ref="panel" x-show="open" x-cloak x-transition.opacity.duration.100ms
       role="dialog" tabindex="-1" aria-labelledby="pop-sh-title"
       class="fixed inset-x-0 bottom-0 z-40 w-full overflow-hidden rounded-t-2xl border border-zinc-300 bg-white shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:mt-1.5 sm:w-80 sm:max-w-[calc(100vw_-_1.5rem)] sm:rounded-xl">

    <div class="flex justify-center pt-2 sm:hidden">
      <span class="h-1 w-10 rounded-full bg-zinc-300" aria-hidden="true"></span>
    </div>

    <div class="space-y-3 px-4 py-3.5">
      <p id="pop-sh-title" class="text-[14px]/5 font-medium sm:text-[13px]/5">Narrow the GRN list</p>

      <div>
        <label for="sh-plant" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">Plant</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="sh-plant" x-ref="plant" class="w-full bg-transparent px-3 py-2.5 text-[14px]/5 outline-none sm:py-2">
            <option>All plants</option>
            <option selected>Waluj</option>
            <option>Chakan</option>
            <option>Vapi</option>
          </select>
        </div>
      </div>

      <div>
        <label for="sh-from" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">Posted on or after</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="sh-from" type="date" value="2026-08-01" class="w-full bg-transparent px-3 py-2.5 text-[14px]/5 tabular-nums outline-none sm:py-2">
        </div>
      </div>

      <label class="flex items-center gap-2.5 py-1 text-[14px]/5 sm:text-[13px]/5">
        <input type="checkbox" checked class="size-4 shrink-0 accent-zinc-700">
        Short receipts only
      </label>
    </div>

    <div class="flex flex-col-reverse gap-2 border-t border-zinc-200 bg-zinc-100 px-4 py-3 pb-4 sm:flex-row sm:items-center sm:justify-between sm:py-2.5">
      <button type="button" @click="close()"
              class="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-[12px]/4 sm:underline sm:underline-offset-2 sm:hover:bg-transparent">Cancel</button>
      <button type="button" @click="close()"
              class="w-full rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:w-auto sm:px-3.5 sm:py-1.5">Apply</button>
    </div>
  </div>
</div>` },

      { id: 'htmx', name: 'Body fetched on first open', code:
`<!-- The click that opens the panel is also the click that fetches it, and that
     is the whole difference from the hovercard next door. A hovercard has to
     wait out a 350ms gate before it may fetch, because mouseenter fires for
     every row a pointer crosses on its way to the scrollbar and a register of
     fifty would issue fifty requests. A click is an intent, so there is nothing
     to gate and the request goes out at once.

     loaded is what stops the second request, and it is set from htmx:afterSwap
     rather than from show(), so a failed fetch leaves it false and the next open
     tries again while a successful one is never fetched twice for the life of
     the page. Alpine's .camel modifier turns htmx:after-swap in the attribute
     into the htmx:afterSwap the library really dispatches.
     hx-sync="this:drop" throws away a request raised while one is in flight,
     which is what closing and reopening inside 300ms produces.

     The skeleton is the shape of the answer — three rows of a match, not a grey
     rectangle — because the panel is anchored to a trigger and one that grows
     when the data lands pushes the bottom of itself past the fold, or shrinks
     out from under the pointer. It is aria-hidden, so the sr-only line beside it
     is what a reader entering the dialog is told while it is busy; without that
     the panel announces its title and then silence.

     Focus is put on the panel and not on anything inside it, because at the
     moment focus moves there is nothing inside it yet. It stays on the panel
     after the swap: moving focus when a response lands takes the caret away
     from wherever the user had already tabbed to. -->
<div data-kui="popover/htmx" class="relative inline-block"
     x-data="{
       open: false, loaded: false, failed: false,
       show() {
         this.open = true;
         if (!this.loaded) this.$refs.body.dispatchEvent(new CustomEvent('popover-fetch'));
         this.$nextTick(() => requestAnimationFrame(() => this.$refs.panel.focus()));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false;
         if (toTrigger) this.$refs.trigger.focus();
       },
       retry() { this.failed = false; this.$refs.body.dispatchEvent(new CustomEvent('popover-fetch')) }
     }"
     @click.outside="close(false)"
     @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }"
     @htmx:after-swap.camel="loaded = true; failed = false"
     @htmx:response-error.camel="failed = true">

  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          :aria-expanded="open" aria-controls="pop-hx"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="git-compare" class="size-4 text-zinc-600"></i>Three-way match
    <span class="text-[12px]/4 tabular-nums text-zinc-500">GRN-24-4471</span>
  </button>

  <div id="pop-hx" x-ref="panel" x-show="open" x-cloak x-transition.opacity.duration.100ms
       role="dialog" tabindex="-1" aria-labelledby="pop-hx-title"
       class="absolute top-full left-0 z-40 mt-1.5 w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

    <p id="pop-hx-title" class="text-[13px]/5 font-medium tabular-nums">Match · GRN-24-4471</p>

    <div x-ref="body" x-show="!failed"
         hx-get="/grn/4471/match/" hx-trigger="popover-fetch"
         hx-swap="innerHTML" hx-sync="this:drop"
         :aria-busy="!loaded"
         class="mt-3 border-t border-zinc-100 pt-3">
      <span x-show="!loaded" class="sr-only">Loading the three-way match</span>
      <div class="animate-pulse" aria-hidden="true">
        <div class="flex items-center justify-between gap-3">
          <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
          <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
        </div>
        <div class="mt-2.5 flex items-center justify-between gap-3">
          <div class="h-2.5 w-16 rounded bg-zinc-200"></div>
          <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
        </div>
        <div class="mt-2.5 flex items-center justify-between gap-3">
          <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
          <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
        </div>
      </div>
    </div>

    <div x-show="failed" x-cloak class="mt-3 border-t border-zinc-100 pt-3">
      <div class="flex items-start gap-2.5">
        <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
        <div class="min-w-0">
          <p class="text-[13px]/5 font-medium">Could not load the match</p>
          <p class="mt-1 text-[12px]/4 text-zinc-600">The receipt itself is fine.</p>
        </div>
      </div>
      <div class="mt-2.5 flex items-center gap-2">
        <button type="button" @click="retry()"
                class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="rotate-ccw" class="size-3.5 text-zinc-600"></i>Try again
        </button>
        <a href="/grn/4471/" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Open the GRN</a>
      </div>
    </div>
  </div>
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
<div data-kui="avatar/sizes" class="flex flex-wrap items-center gap-4">
  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[11px]/4 font-medium text-zinc-600" aria-label="Ritu Deshpande" role="img">RD</span>
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-label="Ritu Deshpande" role="img">RD</span>
  <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[14px]/5 font-medium text-zinc-600" aria-label="Ritu Deshpande" role="img">RD</span>
</div>` },

      { id: 'self', name: 'The signed-in user', code:
`<!-- Graphite marks you, and nobody else. If every avatar is filled, the
     distinction it exists to make has gone. -->
<div data-kui="avatar/self" class="flex flex-wrap items-center gap-4">
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[13px]/5 font-medium text-white" aria-label="Ritu Deshpande, you" role="img">RD</span>
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-label="Sanjay More" role="img">SM</span>
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-label="Imran Qureshi" role="img">IQ</span>
</div>` },

      { id: 'with-name', name: 'With name and role', code:
`<!-- The name is written, so the circle is aria-hidden. Otherwise a screen
     reader announces "RD Ritu Deshpande". -->
<div data-kui="avatar/with-name" class="flex items-center gap-3">
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
<div data-kui="avatar/stacked" class="flex items-center -space-x-5" role="img"
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
<table data-kui="avatar/in-row" class="w-full table-fixed">
  <tbody class="divide-y divide-zinc-200">
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
<div data-kui="avatar/presence" class="flex flex-wrap items-center gap-6">
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
<div data-kui="avatar/menu" class="flex justify-end">
  <div class="relative inline-block" x-data="{ open: false }" @click.outside="open = false">
  <button type="button" @click="open = !open" :aria-expanded="open" aria-haspopup="menu"
          class="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-zinc-100">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[12px]/4 font-medium text-white" aria-hidden="true">RD</span>
    <span class="hidden text-[13px]/5 font-medium sm:block">Ritu Deshpande</span>
    <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>

  <div x-show="open" x-cloak role="menu"
       class="absolute right-0 z-40 mt-1 w-56 overflow-hidden rounded-xl border border-zinc-300 bg-white py-1 shadow-lg">
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
<div data-kui="avatar/placeholder" class="flex flex-wrap items-center gap-6">
  <div class="flex items-center gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-zinc-300 text-zinc-500" aria-hidden="true">
      <i data-lucide="user" class="size-4"></i>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 text-zinc-600">Unassigned</p>
      <p class="truncate text-[12px]/4 text-zinc-500">PO-24-1191 · raised 18 Aug</p>
    </div>
  </div>
  <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="user-plus" class="size-4 text-zinc-600"></i>Assign approver
  </button>
</div>` }
    ]
  }
);
