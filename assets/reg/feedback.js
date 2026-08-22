register(
  {
    id: 'alert', name: 'Alert', category: 'feedback',
    description: 'An inline notice about the page or the record in front of the user. White card, zinc border, and the only colour is the icon.',
    when: 'A message that belongs to the page, or to the record on it, and stays until the condition it describes or the user removes it. The line against a toast is not severity and it is not length — it is what the message is attached to. An alert is attached to something on screen: three invoices unmatched, a rate contract expiring on 30 Sep, an import still running, a limit this order is over. Look away and it is still true, so it must not leave on a timer, and it belongs next to the thing it is about rather than in a corner of the viewport. A toast is attached to a keypress that has already finished, so it can go on its own. The test that settles almost every case: if the user has to read it, act on it, or write something down from it, it is an alert even when a keypress produced it, because a timer must never be the thing that decides they have finished reading. And a message with two answers is neither — that is an alert dialog, which blocks until one of them is chosen.',
    notes: [
      'Do not tint the alert body. bg-red-50 / bg-amber-50 panels shout against the graphite theme — the icon carries the severity on its own.',
      'An alert with no action is just noise. If there is nothing to do about it, put the text where it belongs instead.',
      'Errors coming back from a form belong on the field. A page-level alert may summarise them and link to each field, but it never replaces the field-level message.',
      'The page banner is graphite, never red. It is an emphasis surface, not a severity — a full-bleed red bar reads as an outage even when the message is routine.',
      'role="alert" earns its place on a node that is itself inserted into the page after first paint, and nowhere else. On markup that was in the document when it loaded it announces nothing at all, which includes the two cases that look most like exceptions: a Django messages block after a redirect, and a form re-rendered with its errors. Both are a fresh document, so both are silent, and what announces them is the page load or a deliberate move of focus. It must also never be added to a fragment that lands inside a live region — a live role inside a live region is one message announced twice.',
      'The reliable shape for an alert that arrives without a page load is an empty live region already sitting in the template, written into by the response. Assistive technology watches a region from the moment it is registered, so a region created in the same frame as its first message counts as content that was always there. This is the same defect toast exists to prevent, and the same fix.',
      'Never stack more than two alerts above a page. Past that nobody reads any of them — collapse the rest into one alert that links to a list.',
      'Name at most five records inline. Past five the alert has become a register drawn badly, and the honest move is five plus a link that carries the filter reproducing exactly this set — landing the user on 1,438 unfiltered rows makes them rebuild a query the alert already knew.',
      'Dismiss is browser state only. The alert comes back on the next request unless something durable was told about it. A localStorage key is right for a notice about the application, and wrong for a notice about a record: a record changes and a key cannot know that, so a dismissed "3 invoices unmatched" stays dismissed through the next four that fail. Version the key with the date the notice was issued, or the second edition of a message is invisible to everyone who dismissed the first.',
      'One action, never two. A second button turns a notice into a decision, and a decision with two answers is an alert dialog. The dismiss button is not an action and does not count against this.',
      'An alert that carries an action has four things in its top row — icon, text, action, dismiss — and they do not fit at 390px. The action drops to its own full-width row below the text and the dismiss stays where it was.'
    ],
    anatomy: [
      ['Icon', 'The only colour in the component, and the whole severity signal. size-4, shrink-0, mt-0.5 so it sits on the first line of text.'],
      ['Title', 'One sentence stating the fact, in sentence case. No "Error:" prefix — the icon already said that.'],
      ['Detail', 'Optional second line: the consequence, the deadline, or who to talk to. text-[12px]/4 text-zinc-600.'],
      ['Action', 'Optional, and at most one. The single thing to do about the message. shrink-0 so it never compresses.'],
      ['Dismiss', 'Optional, and only for alerts that are safe to lose. A 28px icon button on the right with aria-label="Dismiss".'],
      ['Record list', 'Optional. The rows the message is about, under a zinc-100 divider, each one a link to the record and each one carrying the figure that made it a problem. Capped at five.'],
      ['Region', 'The empty aria-live div the server writes an alert into. It is part of the page, not part of the alert, and it ships in the template with nothing inside it.']
    ],
    behaviour: [
      'Alerts stack in one region at the top of the content column, newest first, separated by 8px.',
      'The text block flexes and wraps; the icon and the action are shrink-0 and never compress.',
      'The action wraps below the text on narrow screens — the row is flex-wrap and the text block carries a min-width for that reason.',
      'Where the alert also has a dismiss, order utilities put the action after the dismiss above sm and before it below, so the wrap leaves the dismiss on the first row rather than stranding it on a third.',
      'Dismissing hides the alert in the browser. Nothing is sent to the server, so a dismissal that must survive a reload has to be recorded somewhere that does.',
      'An action that destroys something arms in place on the first press and fires on the second, disarming on Escape and after four seconds. The alert has already said what will be lost, so a dialog repeating it back is ceremony that gets clicked through.',
      'A page banner sits outside the content column, above the application header, and spans the full viewport.',
      'A form error summary takes focus when it renders so the keyboard is already at the problem. An alert swapped in by htmx does not — the user may be typing somewhere else, and the alert is on screen and reachable without moving the caret.',
      'A polled alert never sits inside a live region without aria-live="off" on it, or the region reads the percentage out loud every two seconds until the job finishes.'
    ],
    a11y: [
      'Only an alert that is inserted after page load carries role="alert". Static page notices, Django messages and a re-rendered form summary are all in the document at first paint and announce nothing from a role.',
      'The region an alert is swapped into carries aria-live="polite" and aria-atomic="true", and the swap is innerHTML. Polite because the alert stays on the page and nothing is lost by waiting for the sentence in progress to end — assertive is for the toast error region, which is gone in five seconds. Atomic because a swap changes several nodes at once and without it the region reads only the line that changed.',
      'The icon is decorative and carries no label — the sentence alone says what happened and how bad it is.',
      'Colour is never the only signal. The wording states the severity as well, for the 8% of men who will not see the difference between the amber and the red icon.',
      'The dismiss button has aria-label="Dismiss" because its only content is an icon.',
      'The form error summary is focusable with tabindex="-1", and every entry links to its field id so the keyboard lands on the input, not near it.',
      'An action that changes its own label between presses carries aria-live="polite" on the button, or the second press is aimed at a word the user was never told had changed.'
    ],
    related: ['toast', 'alert-dialog', 'badge'],
    variants: [
      { id: 'tags', name: 'Four severities', code:
`<!-- The four tones in the order they turn up on a console screen: neutral,
     finished, waiting, refused. The card is identical in all four — white, a
     zinc-300 edge, the same padding — and the icon is the only thing that
     changes. Tinting the body was tried and reverted: three amber panels down a
     dashboard read as an outage, and the one red panel underneath them stopped
     being the thing anybody looked at first.

     The icon is decorative and unlabelled, so the sentence carries the severity
     on its own. "Order value exceeds your approval limit" says what the red
     circle says. "Something went wrong" needs the icon to be seen, and is
     therefore not a sentence anyone should ship.

     None of these carries role="alert", and that is deliberate rather than an
     omission. All four are conditions that are already true when the page
     renders, and a live role on markup that was in the document at first paint
     announces nothing — it measures as accessible and is silent. The announced
     case is a message that arrives after a request, which is alert/htmx. -->
<div data-kui="alert/tags" class="flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="info" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">Rate contract with Sharma Extrusions expires on 30 Sep 2026.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Orders raised after that date will price at the spot rate.</p>
  </div>
</div>

<div class="mt-2 flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="check-circle-2" class="mt-0.5 size-4 shrink-0 text-emerald-600"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">PO-24-1187 emailed to Sharma Extrusions.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Sent by Ritu Deshpande, 19 Aug 2026 at 11:42.</p>
  </div>
</div>

<div class="mt-2 flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">GRN pending for <span class="tabular-nums">3</span> orders older than 30 days.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Nashik Steel Traders, Gujarat Polymers Ltd, Sharma Extrusions.</p>
  </div>
</div>

<div class="mt-2 flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
  <div class="min-w-0">
    <p class="text-[13px]/5 font-medium">Order value <span class="tabular-nums">₹18,42,000</span> exceeds your approval limit.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Anything above <span class="tabular-nums">₹10,00,000</span> goes to the plant head.</p>
  </div>
</div>` },

      { id: 'compact', name: 'Compact', code:
`<!-- One line, 32px tall. For a table toolbar or a card header, where a
     three-line alert would push the data below the fold.

     The text truncates and the link does not. A row that lets both shrink ends
     up with two half-sentences at 390px and no way to act on either; holding
     the link at its full width and cutting the explanation is the right way
     round, because the explanation is recoverable by widening the window and a
     three-character link target is not. min-w-0 on the paragraph is what makes
     truncate work at all inside a flex row — without it a flex item refuses to
     shrink below its content and the alert pushes the page sideways. -->
<div data-kui="alert/compact" class="flex items-center gap-2.5 rounded-lg border border-zinc-300 bg-white px-3 py-2">
  <i data-lucide="alert-triangle" class="size-3.5 shrink-0 text-amber-700"></i>
  <p class="min-w-0 flex-1 truncate text-[12px]/4">Showing the first 200 of <span class="tabular-nums">1,438</span> matching rows.</p>
  <a href="#" class="shrink-0 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Narrow the filters</a>
</div>` },

      { id: 'dismissible', name: 'Dismissible', code:
`<!-- Dismiss belongs on an alert that is safe to lose and on no other. This one
     is: the bank details have changed whether or not the notice is on screen,
     and the record itself says so.

     What this does not do is remember. The alert is back on the next request,
     because nothing was told about the dismissal — Alpine set a boolean in a
     page that is about to be replaced. That is the right default: an alert
     nobody has acted on returning is a smaller defect than one that vanished
     for good because somebody swatted it on the way to something else. When it
     genuinely has to stay gone, that is alert/remembered.

     The close button is a 28px shape on a white card, so it hovers to the chip
     fill rather than to zinc-100, which is what a white-on-white control needs
     to keep an edge. Negative margins pull it out to the padding so the icon
     sits square in the corner without widening the row. -->
<div data-kui="alert/dismissible" x-data="{ show: true }" x-show="show" x-cloak
     class="flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="info" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
  <div class="min-w-0 flex-1">
    <p class="text-[13px]/5 font-medium">Vendor bank details changed on 12 Aug 2026.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Payments to Nashik Steel Traders now go to HDFC ••4471.</p>
  </div>
  <button type="button" @click="show = false" aria-label="Dismiss"
          class="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="x" class="size-4"></i>
  </button>
</div>` },

      { id: 'remembered', name: 'Dismissed for good', tagNew: true, code:
`<!-- alert/dismissible forgets. This one does not, and the difference is one
     line of localStorage plus a lot of care about what may be kept there.

     A browser key is right for a notice about the application — a policy
     changing, a shortcut worth knowing, a screen moving — because the notice is
     about the tool and the server tracks nothing about it per user. It is wrong
     for a notice about a record. A record changes and a key cannot know that:
     dismiss "3 invoices unmatched" once and it stays dismissed through the next
     four that fail. Anything about a record either has no dismiss at all, or it
     posts one and lets the server decide:

     <button hx-post="/notices/credit-hold/dismiss/"
             hx-target="#notice-credit-hold" hx-swap="delete">

     which is also the only version that still holds when the same person opens
     the console on their phone.

     The key carries the date the notice was issued. Reuse a bare kon-notice-2fa
     and the second edition of that message is invisible to everyone who
     dismissed the first — the people who most need telling.

     init() runs while x-data initialises, before x-show is evaluated, so
     someone who dismissed it never watches it appear and go. x-cloak covers the
     frames before Alpine has booted at all and is not optional here: without it
     the notice flashes on every single page load for exactly the people who
     already said they were finished with it. -->
<div data-kui="alert/remembered"
     x-data="{
       key: 'kon-notice-2fa-2026-10',
       show: true,
       init() { this.show = localStorage.getItem(this.key) !== '1' },
       dismiss() { this.show = false; localStorage.setItem(this.key, '1') }
     }"
     x-show="show" x-cloak
     class="flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="info" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
  <div class="min-w-0 flex-1">
    <p class="text-[13px]/5 font-medium">Two-step sign-in becomes mandatory on 01 Oct 2026.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">
      Register a phone now and nothing changes for you on the day.
      <a href="/account/security/" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Set it up</a>
    </p>
  </div>
  <button type="button" @click="dismiss()" aria-label="Dismiss"
          class="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="x" class="size-4"></i>
  </button>
</div>` },

      { id: 'action', name: 'With action', code:
`<!-- The action is what makes this an alert rather than a sentence somewhere on
     the record. If there is nothing to press, the fact belongs wherever the
     order is already drawn and this component is not the answer.

     One action and no more. A second button turns a notice into a decision, and
     a decision with two answers is alert-dialog — Remind, Escalate and Cancel
     laid across a notice reads as a form the user has to complete before the
     page will let them past. The secondary route lives in the detail line as a
     link, which is why "open the order" is prose here and not a third control.

     flex-wrap plus a min-width on the text block is the whole responsive
     behaviour. Above roughly 480px the button shares the first line; below it
     the text cannot shrink past 16rem, so the button drops to its own row
     instead of compressing to two words per line. shrink-0 keeps its label off
     a second line when it does share the row. The version that also carries a
     dismiss is alert/responsive, because four things in one row is where this
     shape actually breaks. -->
<div data-kui="alert/action" class="flex flex-wrap items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
  <div class="min-w-[16rem] flex-1">
    <p class="text-[13px]/5 font-medium">PO-24-1163 has been waiting for approval for <span class="tabular-nums">9</span> days.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">
      Nashik Steel Traders · <span class="tabular-nums">₹4,26,500</span> ·
      <a href="#" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">open the order</a>
    </p>
  </div>
  <button type="button" class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Remind approver</button>
</div>` },

      { id: 'confirm', name: 'When the action destroys something', tagNew: true, code:
`<!-- An alert that offers to delete something is the worst place in the system
     to put a single press. It sits at the top of the page, it is the first
     thing the eye lands on, and its whole job is to be acted on quickly — so
     the one control on it is pressed before it is read more often than any
     other button in the console.

     alert-dialog is the wrong fix. A dialog is right when there is something
     the user has to read before deciding, and here they have already read it:
     the alert is the sentence the dialog would repeat back at them. A modal
     that says what the screen behind it already says is ceremony, and ceremony
     that is not deserved gets clicked through without being read, which makes
     the mistake more likely rather than less.

     So the alert arms instead. The mechanic is button/confirm, copied rather
     than re-invented, because two implementations of one safety measure drift
     apart and only one of them keeps the aria-live: the armed button says a
     double click on the first press cannot sail through the second; it disarms
     on Escape and after four seconds so nothing is left armed on a screen
     somebody walked away from; and both labels share one grid cell so the row
     does not move between the two presses.

     The alert itself takes no role="alert" — it is a condition the page found
     on load, not an answer to anything. The announcement that matters here is
     the button telling a screen reader its own label changed under focus that
     was already sitting on it. -->
<div data-kui="alert/confirm" class="flex flex-wrap items-start gap-x-3 gap-y-2.5 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
  <div class="min-w-[15rem] flex-1">
    <p class="text-[13px]/5 font-medium">An import that failed on 12 Aug 2026 left <span class="tabular-nums">12</span> draft lines on PR-24-0442.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">They carry no rate and never reach a vendor. Discarding them cannot be undone.</p>
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
      <span class="col-start-1 row-start-1" :class="armed && 'invisible'">Discard drafts</span>
      <span class="col-start-1 row-start-1 tabular-nums" :class="!armed && 'invisible'">Discard 12 lines?</span>
    </span>
  </button>
</div>` },

      { id: 'responsive', name: 'Action and dismiss at 390px', tagNew: true, code:
`<!-- Four things want the first row — icon, text, action, dismiss — and at
     390px there is room for three. Which one leaves is the whole variant.

     The action leaves, and it leaves downward at full width. Sending the
     dismiss away instead was tried and is worse: it is the control that costs
     nothing to press and everything to hunt for, and moving it off the corner
     where every other close button in the console lives makes it unfindable on
     the device where it matters most. Shrinking the text instead gives three
     words a line beside a button, which is not a sentence anybody reads.

     Order utilities are doing the work rather than a second copy of the markup
     behind a breakpoint. The dismiss sits before the action in the source so
     that the wrap lands the way it should on a phone — icon, text and dismiss
     on the first row, action alone on the second — and sm:order-2 and
     sm:order-3 put them back in reading order above the breakpoint, where the
     dismiss belongs on the far right. Duplicating the block with hidden and
     sm:flex instead ships two copies of one button, and the second one is where
     the aria-label goes stale.

     The full-width action spans the whole body rather than indenting to line up
     under the text. An indent needs a width of 100% minus the icon column,
     which is an arbitrary calc that has to be corrected every time the icon
     size changes, and it buys nothing at a width where the button is the only
     thing on its row. -->
<div data-kui="alert/responsive" class="flex flex-wrap items-start gap-x-3 gap-y-2.5 rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <i data-lucide="alert-triangle" class="mt-0.5 size-4 shrink-0 text-amber-700"></i>
  <div class="min-w-[12rem] flex-1">
    <p class="text-[13px]/5 font-medium">The rate contract for HDPE-BLM-45 expires on 30 Sep 2026.</p>
    <p class="mt-0.5 text-[12px]/4 text-zinc-600">Gujarat Polymers Ltd · <span class="tabular-nums">₹96,400</span> per MT until then, spot rate after.</p>
  </div>
  <button type="button" aria-label="Dismiss"
          class="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:order-3">
    <i data-lucide="x" class="size-4"></i>
  </button>
  <button type="button"
          class="inline-flex h-9 w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:order-2 sm:h-8 sm:w-auto">Start the renewal</button>
</div>` },

      { id: 'records', name: 'With affected records', code:
`<!-- When the message is about a set of rows, name them. "3 invoices failed"
     with no list means somebody has to go hunting for which three, and the
     hunting happens in a register that does not have a filter for "the ones
     that failed in the run I just started".

     Each row is the reference and the vendor, then the figure that made it a
     problem, in a tabular column so three amounts can be compared without
     reading them. The link goes to the invoice rather than to a filtered list,
     because at this length the user is going to open all of them.

     This one carries role="alert" and earns it: it is the answer to a payment
     run the user started, inserted into the page after it loaded. Render the
     same alert on every page load instead and the role does nothing at all —
     drop it and let the sentence carry the message.

     Past five rows this shape stops working. That is alert/overflow. -->
<div data-kui="alert/records" class="rounded-lg border border-zinc-300 bg-white px-4 py-3" role="alert">
  <div class="flex items-start gap-3">
    <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
    <div class="min-w-0">
      <p class="text-[13px]/5 font-medium"><span class="tabular-nums">3</span> invoices could not be matched to a GRN.</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-600">They stay out of the payment run until a GRN is posted against each one.</p>
    </div>
  </div>
  <ul class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3 text-[12px]/4">
    <li class="flex items-center justify-between gap-4">
      <a href="/invoices/INV-8841/" class="truncate text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">INV-8841 · Nashik Steel Traders</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹4,26,500</span>
    </li>
    <li class="flex items-center justify-between gap-4">
      <a href="/invoices/INV-8836/" class="truncate text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">INV-8836 · Gujarat Polymers Ltd</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹1,18,240</span>
    </li>
    <li class="flex items-center justify-between gap-4">
      <a href="/invoices/INV-8829/" class="truncate text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">INV-8829 · Sharma Extrusions</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹87,900</span>
    </li>
  </ul>
</div>` },

      { id: 'overflow', name: 'More records than fit', tagNew: true, code:
`<!-- A bulk action that fails on twenty-seven of thirty-four rows. The list
     cannot go in the alert and the count cannot go in on its own.

     Five rows, then a link. Five is where a list stops being readable at a
     glance and starts being a register drawn without a header, and an alert
     that has become a register is one that will grow a sort control next.
     Capping it with overflow-y-auto instead was rejected: a scroller inside an
     alert hides rows behind a bar nobody looks for, and at 390px it is a
     hundred-pixel window onto twenty-seven records.

     The link carries the filter that reproduces exactly this set, which is the
     part that gets skipped. A link to the bare register drops the user into
     1,438 rows and makes them rebuild a query the alert already knew the answer
     to, so the run id goes in the querystring.

     Both counts come off one number on the server. Twenty-seven in the sentence
     and twenty-two in the link is five rows listed above them, and if that
     arithmetic is done twice it will disagree the first time somebody changes
     the cap. Render the list, then write the remainder as total minus its
     length. -->
<div data-kui="alert/overflow" class="rounded-lg border border-zinc-300 bg-white px-4 py-3" role="alert">
  <div class="flex items-start gap-3">
    <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
    <div class="min-w-0">
      <p class="text-[13px]/5 font-medium"><span class="tabular-nums">27</span> of <span class="tabular-nums">34</span> orders were not approved.</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-600">Each is over the approval limit for your role and has gone to the plant head. The other <span class="tabular-nums">7</span> are approved and with the vendor.</p>
    </div>
  </div>
  <ul class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3 text-[12px]/4">
    <li class="flex items-center justify-between gap-4">
      <a href="/orders/PO-24-1187/" class="truncate text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1187 · Gujarat Polymers Ltd</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹18,42,000</span>
    </li>
    <li class="flex items-center justify-between gap-4">
      <a href="/orders/PO-24-1186/" class="truncate text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1186 · Nashik Steel Traders</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹14,90,000</span>
    </li>
    <li class="flex items-center justify-between gap-4">
      <a href="/orders/PO-24-1181/" class="truncate text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1181 · Sharma Extrusions</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹12,45,000</span>
    </li>
    <li class="flex items-center justify-between gap-4">
      <a href="/orders/PO-24-1178/" class="truncate text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1178 · Deccan Fasteners</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹11,08,400</span>
    </li>
    <li class="flex items-center justify-between gap-4">
      <a href="/orders/PO-24-1174/" class="truncate text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1174 · Gujarat Polymers Ltd</a>
      <span class="shrink-0 tabular-nums text-zinc-600">₹10,62,000</span>
    </li>
  </ul>
  <p class="mt-2.5 text-[12px]/4">
    <a href="/orders/?state=over_limit&amp;run=8841"
       class="font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open the remaining <span class="tabular-nums">22</span> in the register</a>
  </p>
</div>` },

      { id: 'progress', name: 'In progress', code:
`<!-- A job the user started that outlives the request. Poll the whole alert with
     htmx: hx-get="/imports/8841/progress/" hx-trigger="every 2s"
     hx-swap="outerHTML", and return the success alert when it is done, so the
     last swap replaces the running alert with the outcome instead of leaving
     both on the page.

     aria-live="off" is the reason this variant is not simply alert/tags with a
     rail under it. Polled into a live region — which is where a swapped alert
     otherwise belongs — this reads the percentage out loud every two seconds
     for as long as the import runs. The one announcement worth making is the
     last one, and that arrives with the alert that replaces this.

     role="progressbar" goes on the track, because the track is the element
     whose extent means something, and it is named by pointing aria-labelledby
     at the sentence already on screen rather than repeating it in an aria-label
     where the two can drift. The width is an inline style and has to be: a
     class built from a template variable is not a literal string in the source,
     so Tailwind emits no rule for it and the fill comes back zero wide.

     The percentage beside the text and the width on the fill are one number.
     Rounding one of them for display and not the other is how a rail ends up
     at 39% under a label reading 40%. -->
<div data-kui="alert/progress" aria-live="off" class="rounded-lg border border-zinc-300 bg-white px-4 py-3">
  <div class="flex items-start gap-3">
    <i data-lucide="loader-circle" class="mt-0.5 size-4 shrink-0 animate-spin text-zinc-500"></i>
    <div class="min-w-0 flex-1">
      <p id="al-import8841" class="text-[13px]/5 font-medium">Importing the August rate card.</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-600"><span class="tabular-nums">1,240</span> of <span class="tabular-nums">3,100</span> rows · you can leave this page, it keeps running.</p>
    </div>
    <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">40%</span>
  </div>
  <div class="mt-3 h-1 overflow-hidden rounded-full bg-zinc-200"
       role="progressbar" aria-labelledby="al-import8841"
       aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
    <div class="h-full min-w-[2px] rounded-full bg-zinc-700 transition-[width] duration-500 motion-reduce:transition-none"
         style="width: 40%"></div>
  </div>
</div>` },

      { id: 'banner', name: 'Page banner', code:
`<!-- Full-bleed, above the application header, outside the content column.
     Graphite and never red: a red bar across the top of every screen reads as
     an outage, and the message it usually carries is a maintenance window
     three days away.

     The text scale inverts on the zinc-900 band. Secondary copy is zinc-400
     here, not the zinc-500 it would be on white — darkening secondary text on a
     dark surface makes it less readable, not more, and zinc-500 on zinc-900 is
     the first thing to disappear on a laptop screen at an angle.

     It dismisses to browser state only, which is right for a window that has
     not started yet and wrong the moment it has. If the banner must stay gone
     across a reload, take the localStorage key from alert/remembered and
     version it with the window, so next month's maintenance is not silently
     hidden from everybody who dismissed this one. -->
<div data-kui="alert/banner" x-data="{ show: true }" x-show="show" x-cloak
     class="flex flex-wrap items-center gap-x-3 gap-y-1 bg-zinc-900 px-4 py-2.5 text-white sm:px-6">
  <i data-lucide="wrench" class="size-4 shrink-0 text-zinc-400"></i>
  <p class="min-w-[14rem] flex-1 text-[13px]/5">
    <span class="font-medium">Scheduled maintenance.</span>
    <span class="text-zinc-400">Purchase orders are read-only on Sun 24 Aug, 01:00–03:00 IST.</span>
  </p>
  <a href="#" class="shrink-0 text-[13px]/5 font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">What changes</a>
  <button type="button" @click="show = false" aria-label="Dismiss"
          class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
    <i data-lucide="x" class="size-4"></i>
  </button>
</div>` },

      { id: 'form-errors', name: 'Form error summary', code:
`<!-- {{ form.non_field_errors }} plus one line per field that has errors. It
     summarises; it never replaces the message under each input, because a
     summary is read once at the top and the correction happens two hundred
     pixels lower with the summary off screen.

     Every entry is an anchor to the field id, not a sentence naming it. The
     keyboard has to land in the input, and "check the delivery date" leaves the
     user to find it themselves in a form of thirty controls.

     What announces this is the focus move, not the role. The page has just been
     re-rendered by a failed POST, so the summary was in the document at first
     paint and role="alert" on it fires nothing — it is kept only because the
     same markup is correct when a swap inserts it. x-init pulls focus to the
     summary, which is what actually reads it out and puts the keyboard one Tab
     from the first broken field.

     tabindex="-1" makes it focusable without adding a stop to the tab order.
     It keeps its focus outline: this is a real focus target, and hiding the
     outline on it is the same defect as hiding one on a button. -->
<div data-kui="alert/form-errors" role="alert" tabindex="-1" x-data x-init="$el.focus()"
     class="rounded-lg border border-zinc-300 bg-white px-4 py-3 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
  <div class="flex items-start gap-3">
    <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
    <div class="min-w-0">
      <p class="text-[13px]/5 font-medium">This order was not saved — <span class="tabular-nums">3</span> fields need attention.</p>
      <ul class="mt-2 space-y-1 text-[12px]/4 text-zinc-600">
        <li>
          <a href="#id_vendor" class="font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Vendor</a>
          — select a vendor.
        </li>
        <li>
          <a href="#id_delivery_date" class="font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Delivery date</a>
          — cannot be before the order date.
        </li>
        <li>
          <a href="#id_quantity" class="font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Quantity</a>
          — enter a whole number greater than zero.
        </li>
      </ul>
    </div>
  </div>
</div>` },

      { id: 'htmx', name: 'Swapped in by the server', tagNew: true, code:
`<!-- The alert that arrives without a page load, and the one variant where the
     accessibility work is not in the alert at all.

     The region ships in the template, empty, from first paint:

     <div id="po-submit-notice" aria-live="polite" aria-atomic="true" class="empty:hidden"></div>

     Nothing between the tags. Assistive technology watches a live region from
     the moment it is registered, so a region created in the same frame as its
     first message counts as content that was always there and announces
     nothing — it renders correctly, it reviews as accessible, and it is silent
     for the people it was added for. :empty also counts a newline as content,
     so a region written across two lines keeps its gap in the column with
     nothing in it. It is drawn here holding a response so the shape is visible;
     the server returns everything from the inner div down.

     hx-swap="innerHTML", never outerHTML. outerHTML replaces the region with
     the response, which unregisters the live region and registers a new one
     that already has the message inside it — the same silence reached from the
     other direction, and it passes review because the alert is plainly on the
     screen.

     Polite, not assertive: this alert stays until it is dealt with, so nothing
     is lost by letting the sentence in progress finish. aria-atomic because the
     swap changes three nodes at once and without it the region reads only the
     line that moved. The fragment carries no role="alert" of its own — a live
     role inside a live region is one message announced twice.

     Focus does not move. The user pressed Submit and may be typing elsewhere by
     now; the alert is on screen and reachable, and taking the caret is a worse
     defect than the one it fixes. -->
<div data-kui="alert/htmx" class="space-y-2">
  <div id="po-submit-notice" aria-live="polite" aria-atomic="true" class="empty:hidden">
    <div class="flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
      <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
      <div class="min-w-0">
        <p class="text-[13px]/5 font-medium">PO-24-1187 was not submitted — Gujarat Polymers Ltd is on credit hold.</p>
        <p class="mt-0.5 text-[12px]/4 text-zinc-600">
          <span class="tabular-nums">₹9,64,300</span> outstanding beyond <span class="tabular-nums">90</span> days.
          <a href="/vendors/gujarat-polymers/ledger/" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open the ledger</a>, or ask accounts to release the hold.
        </p>
      </div>
    </div>
  </div>

  <form hx-post="/orders/PO-24-1187/submit/"
        hx-target="#po-submit-notice" hx-swap="innerHTML"
        hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'
        hx-disabled-elt="#po-submit"
        class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-3">
    <p class="min-w-[12rem] flex-1 text-[13px]/5 tabular-nums text-zinc-600">6 lines · ₹18,42,000 · delivery 04 Sep 2026</p>
    <button id="po-submit" type="submit"
            class="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:hover:bg-zinc-700">Submit for approval</button>
  </form>
</div>` },

      { id: 'django', name: 'Django messages block', code:
`<!-- The messages framework renders after a redirect, which means every message
     in this loop is in a document the browser has just loaded. None of them
     carries role="alert" and none of them should: a live role on markup that
     was there at first paint announces nothing, and adding it produces a block
     that measures as accessible and says nothing to anybody. The page load is
     the announcement. If a failure genuinely has to be read before the user
     goes further, it is not a message — it is alert/form-errors on the form
     that refused, which takes focus.

     The icon and its colour come from one filter over message.tags rather than
     from a chain of {% if %} in the template, so the mapping cannot differ
     between two screens showing the same message. Add the templatetags module
     to Tailwind's content globs: these class names live in Python and nothing
     the scanner already reads mentions them.

     # templatetags/ui.py
     ICON = {'success': 'check-circle-2', 'warning': 'alert-triangle', 'error': 'alert-circle'}
     TONE = {'success': 'text-emerald-600', 'warning': 'text-amber-700', 'error': 'text-red-600'}

     @register.filter
     def message_icon(tags):
         return next((ICON[t] for t in tags.split() if t in ICON), 'info')

     @register.filter
     def message_tone(tags):
         return next((TONE[t] for t in tags.split() if t in TONE), 'text-zinc-500')

     tags is a space-separated string and may carry more than the level — the
     split is what stops "success safe" falling through to the neutral icon.

     Dismiss is browser state and the messages are consumed by the render
     anyway, so there is nothing to record: they do not come back. -->
{% load ui %}
{% if messages %}
<div class="space-y-2">
  {% for message in messages %}
  <div data-kui="alert/django" x-data="{ show: true }" x-show="show" x-cloak
       class="flex items-start gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3">
    <i data-lucide="{{ message.tags|message_icon }}" class="mt-0.5 size-4 shrink-0 {{ message.tags|message_tone }}"></i>
    <p class="min-w-0 flex-1 text-[13px]/5 font-medium">{{ message }}</p>
    <button type="button" @click="show = false" aria-label="Dismiss"
            class="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="x" class="size-4"></i>
    </button>
  </div>
  {% endfor %}
</div>
{% endif %}` }
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
      'A hidden document holds the timer too. A toast raised by a request that finished while the user was in another tab spends its whole five seconds where nobody can see it, and the confirmation is gone before they come back to the page that raised it. Hold on visibilitychange, and start a toast pushed into a hidden tab already held. Hold with a count rather than a flag: hover and focus overlap constantly, and two booleans mean whichever one leaves first restarts a timer the other is still holding.',
      'Bind the pointer hold with pointerenter and pointerleave rather than mouseenter and mouseleave. The pointer pair carries the pen and the finger as well as the mouse, and on a touch screen the browser brackets a tap with it, so a thumb held on the card holds the toast and lifting it releases it. Emulated mouseenter on a phone arrives late, fires once, and often never pairs with a leave, which strands the toast on screen until the page is reloaded.',
      'Give a toast a key when the thing that raises it can raise it again, and patch the toast already holding that key instead of pushing a second. An autosave failing every ten seconds otherwise builds a wall of identical cards, each announcing the same sentence. Patching also means an unchanged message is announced once, because the default aria-relevant reports text that changed and rewriting the same string changes nothing.',
      'A key does not survive a change of region. Whether a message interrupts is decided by the region its node sits in, so a toast cannot be recoloured from failure to confirmation in place — close it and push a new one into the other region, or the confirmation is announced assertively over whatever was being read.',
      'Under prefers-reduced-motion the timer does not run at all, for anything with words in it. It is the only signal the browser gives you that content vanishing on its own is unwelcome, and WCAG 2.2.1 wants a way to turn a time limit off. The toast stays until the user dismisses it, which costs nothing because dismiss is already there. Put motion-reduce:transition-none and motion-reduce:duration-0 on both x-transition class lists as well, so it arrives in place instead of travelling.',
      'A toast is never the only place an outcome is reported, because it disappears. The durable copy is the thing that changed — the row now showing Posted, the status pill on the record, the line in the activity log, the GRN that now exists. Write the toast last, after the screen behind it already says the same thing, and check the screen still makes sense with the toast deleted.',
      'Cap the stack at three and drop the oldest. Six toasts cover the bottom-left corner of the page, nobody reads past the second, and the region announces all six in a queue that outlasts the reason for it. If six things happened, one toast should say so and link to the list.',
      'One toast per action, not one per row the action wrote. Approving eleven orders raises "11 orders approved" with a link, never eleven confirmations racing each other out of the corner.',
      'A toast is appended after lucide.createIcons() has already run, so its <i> hydrates into nothing. Re-run createIcons() in $nextTick after the push, guarded on document.querySelector("[data-lucide]:not(svg)") — the generated <svg> keeps its data-lucide attribute, so an unguarded call repaints every icon on the page. Give the wrapping span its own size-4 box so the toast does not reflow when the glyph arrives, and put the tone colour on that span: createIcons() replaces the <i>, taking any :class bound on it. A spinner inside a toast is the border ring, never a Lucide loader, for the same reason.',
      'An undo toast lives exactly as long as the server will accept the undo, and not a second either side. Longer and the button is a lie by the time it is pressed; shorter and the offer expires while the user is still looking at it. Eight seconds is the usual pairing, and Undo posts to a real endpoint — it is not a client-side rollback of what the server already wrote.',
      'Bottom-left, and nothing else. Bottom-right collides with the sheet, the drawer handle and the row action menus that open downward; top-right is where the browser puts its own notifications. Below sm the region is inset-x-4 and the toast is one full-width card, so nothing scrolls sideways at 390px, and one toast is on screen at a time — a 96px card is a third of a 390px screen and three of them are the screen.',
      'On a phone the bottom edge is where the keyboard is. position: fixed measures against the layout viewport, which the on-screen keyboard does not change, so a toast raised while a field has focus is drawn underneath the keyboard: in the DOM, announced, expiring on time, never seen. window.visualViewport is the only thing that reports the covered strip — window.innerHeight minus its height and offsetTop — and that offset goes on :style, because it is a measurement that changes as the keyboard opens rather than a decision about how the component looks. Where the API is missing the region sits at the bottom as it does today.',
      'A confirmation that has to survive a full page load is not raised by the code that raised the action — post-redirect-get means the message comes back down in the next response. Put it in a data island the server writes and push it from x-init, never as rendered cards: Alpine boots on DOMContentLoaded, after the empty region has been parsed, so a push is a change to a region that already existed, while a card in the template is content that was there when the region appeared and is not reported. And django.contrib.messages is consumed by iterating it, so this block and the alert/django block cannot both be on one page — whichever renders first empties the store and the second draws nothing.',
      'When the server decides there is a message, it says so in an HX-Trigger header and the client owns the presentation. Rendering the card into the response and swapping it into the region puts the timer, the dismiss button and the cap into the template, where four views will spell them four ways — and worse, a swap that targets the region replaces the region node itself, producing a new live region holding a message that was there when it appeared. The region is in the base template, outside every hx-target on the page.'
    ],
    anatomy: [
      ['Polite region', 'A fixed, empty, pointer-events-none flex column at the bottom-left, carrying role="status" aria-live="polite". It ships in the base template and is never created on demand. Ordinary toasts are appended into it.'],
      ['Assertive region', 'A second empty region beside the first, carrying role="alert" aria-live="assertive". Failures only. It exists at first paint too, because the error case is the one where a silent region costs the most.'],
      ['Toast', 'pointer-events-auto, rounded-xl, white, border-zinc-200, shadow-lg. One per outcome, appended at the end so the stack grows upward from the bottom edge.'],
      ['Icon', 'size-4, the only colour in the component, on a wrapping span that owns both the colour class and the box. The same four tones as an alert, from the same table — a toast is an alert with a timer, not a different language.'],
      ['Message', 'One line, past tense, naming the record: "GRN 4417 posted", never "Success". It is text content inside the region, which is what gets announced.'],
      ['Meta', 'Optional second line — vendor, quantity, value, who did it. text-[12px]/4 text-zinc-600, tabular-nums on the figures.'],
      ['Action', 'At most one, and almost always Undo or a link to the record that was just created. A real button or a real anchor, and whatever it does is reachable somewhere permanent as well.'],
      ['Dismiss', 'A 28px icon button with aria-label="Dismiss". Always present, because every toast has to be removable before its timer runs and the error toast has no timer at all. Below sm it is size-11 — 28px is a mouse target and the thumb needs 44 — with negative margins so the card stays the height of the two lines it holds.'],
      ['Message island', 'A script type="application/json" the server writes pending messages into, read once from x-init and pushed after first paint. It is how a message survives a redirect without being rendered into the region, which is the one thing a live region does not report.']
    ],
    behaviour: [
      'A toast appears after the action it reports has finished, never before, and never as a promise that something is about to happen.',
      'It auto-dismisses after about five seconds; an undo toast holds for eight, matching the server window; an error toast has no timer and waits for the user.',
      'Three things hold the timer and all three release it: the pointer over the card, focus inside it, and the document being visible. Leaving restarts from full rather than resuming what was left.',
      'Under prefers-reduced-motion no timer is set at all and the toast arrives in place rather than travelling up from the edge.',
      'Toasts stack in one column from the bottom edge, newest nearest the bottom, so DOM order is the order things happened and that is the order the region reads them.',
      'The stack is capped at three. A fourth push removes the oldest, and the count of what was dropped points at the durable list.',
      'A pending toast is patched in place when the request settles — same id, same node, text and icon swapped — so the stack does not reshuffle under the pointer and the region announces the change rather than a second toast.',
      'Dismiss all appears once more than one toast is open. It sits above the stack and outside the live region, so its own arrival is not announced as a message.',
      'One action that wrote many rows raises at most two toasts — what went through, and what did not. The two halves are separate cards because they are governed by different rules: nine approved is polite and expires, two refused is assertive and waits, and one card forces one rule onto both.',
      'A push carrying a key patches the toast already holding that key rather than adding a second, unless the new tone belongs in the other region, in which case the old one is closed and a new node is pushed.',
      'Below sm one toast is on screen at a time, and the region rides above the on-screen keyboard rather than under it.',
      'Nothing about a toast blocks the page: no backdrop, no focus move, no pointer events outside the cards themselves.'
    ],
    a11y: [
      'The region is in the document at page load with nothing in it. A region created together with its first message announces nothing, which is the single most common way a toast is shipped broken — it looks right on every screen and is silent on every screen reader.',
      'Ordinary toasts go into role="status" aria-live="polite" and are announced at the next pause. Failures go into a separate role="alert" aria-live="assertive" region and interrupt, which is the only case that earns an interruption.',
      'The message is text content inside the region, not an aria-label on the toast. A live region reports the content that changed inside it, and a name is not content. The default aria-relevant covers additions and text and not removals, which is what makes a toast expiring silent and an in-place update announced.',
      'The tone icon is decorative and unlabelled. The wording says what happened and how it went, so nothing depends on telling amber from red.',
      'Focus never moves to a toast when it appears. The user is usually still in the form that raised it, and a stolen caret loses their place; the toast is reached by Tab, which is why the region is the last thing in the body.',
      'The timer pauses on focusin as well as on hover, so a keyboard user tabbing towards Undo does not watch it vanish on the way, and it does not run at all under prefers-reduced-motion.',
      'That pause is not on its own enough to make an action in a toast reachable. The region is the last thing in the body, so the tab stops between the user and Undo may number thirty, and no timer short enough to be a toast is long enough to win that race. What makes the action safe is that it is not a race: the timer is the server\'s undo window rather than a reading estimate, and the same action is on the record after the toast has gone. A toast whose action exists nowhere else is an alert that was written in the wrong component.',
      'Focus returns to the control that raised the toast, and that control is carried on the toast itself rather than read off a single x-ref. One ref names one button; a screen where four controls can raise a toast sends the keyboard back to whichever one the ref happened to be on, which is not where the user was.',
      'Dismissing a toast destroys the element focus is on, which drops focus to <body>. The handler checks $event.detail === 0 — a click event with detail 0 came from Enter or Space, not a pointer — and only then returns focus to the control that raised the toast, so a mouse click does not cause a focus jump nobody asked for.',
      'The dismiss button carries aria-label="Dismiss" and the dismiss-all button carries its count in its text, because both are otherwise an icon or a bare number.',
      'Nothing in a toast is the only route to anything. Undo also exists on the record, the link also exists in the register, and the outcome is on the screen behind the toast before the toast is raised.'
    ],
    related: ['alert', 'alert-dialog', 'spinner', 'progress'],
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
          <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
     failure is not removed by a timer.

     The control focus returns to is carried on the toast as el: $el rather than
     read off a single x-ref. Four buttons can raise a toast here, and one ref
     names one of them — dismiss the danger toast from the keyboard and the caret
     lands on Info, which is not where the user was. -->
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
    <button type="button" @click="push({ tone: 'info', text: 'Rate card refreshed', meta: 'August 2024 · 3,100 rows', el: $el })"
            class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Info</button>
    <button type="button" @click="push({ tone: 'success', text: 'PO-24-1187 emailed to Sharma Extrusions', meta: 'Sent 11:42', el: $el })"
            class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Success</button>
    <button type="button" @click="push({ tone: 'warning', text: 'Saved, but 2 lines are over the rate contract', meta: 'MS plate 10 mm · MS angle 50×50', el: $el })"
            class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Warning</button>
    <button type="button" @click="push({ tone: 'danger', text: 'PO-24-1187 could not be emailed', meta: 'The vendor has no contact address on file', el: $el })"
            class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Danger</button>
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
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss" @click="if ($event.detail === 0 && t.el) t.el.focus(); close(t.id)"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss" @click="if ($event.detail === 0 && t.el) t.el.focus(); close(t.id)"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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

     Undo posts to a real endpoint and it is not a client-side rollback of
     something the server already wrote. hx-swap="none" because the answer is a
     status code: the row it restores is not on this screen, and the toast is
     already leaving. There is no form around this button to carry a CSRF token,
     so under Django the region root takes
     hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'.

     Undo is a shortcut, not the only route: the removed line is still on the
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
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
          <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button"
                hx-post="/orders/1187/lines/4/restore/" hx-swap="none"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="shrink-0 rounded-sm text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Undo
        </button>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` },

      { id: 'held', name: 'Held while nobody can see it', tagNew: true, code:
`<!-- Three things hold the timer and the third is the one that is always
     missing: the pointer, focus, and the document being visible at all. A toast
     raised by a request that finished while the user was in another tab spends
     its whole six seconds in a hidden document — the work happened, the
     confirmation existed, and nobody was ever in a position to see it. The
     timer measures reading time, so it may only run while there is somebody
     there to read.

     holds is a count and not a flag. Hover and focus overlap constantly — the
     pointer sits on the card while the keyboard is in Undo — and two booleans
     mean whichever one leaves first restarts a timer the other is still
     holding. A toast pushed into a hidden tab starts at one hold rather than
     zero, so it is waiting rather than expiring by the time it is looked at.

     pointerenter and pointerleave rather than mouseenter and mouseleave. They
     carry the pen and the finger as well as the mouse, and on a touch screen
     the browser brackets a tap with the pair, so a thumb held on the card holds
     the toast and lifting it releases it. mouseenter on a phone is emulated,
     late, and often never pairs with a leave, which strands the toast on screen
     until the page is reloaded.

     Leaving restarts from full. Resuming with 400ms left is not a resume: the
     user looked away mid-sentence and the toast is gone before they look back. -->
<div data-kui="toast/held" x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       push(t) {
         const n = { id: ++this.seq, ms: 6000, timer: 0, holds: document.hidden ? 1 : 0, ...t };
         this.toasts.push(n);
         this.$nextTick(() => {
           if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons();
           this.start(n);
         });
       },
       start(t) {
         if (!t || !t.ms || this.still || t.holds) return;
         clearTimeout(t.timer);
         t.timer = setTimeout(() => this.close(t.id), t.ms);
       },
       hold(t) { t.holds++; clearTimeout(t.timer); },
       release(t) { t.holds = Math.max(0, t.holds - 1); this.start(t); },
       sleep() { this.toasts.forEach(t => this.hold(t)); },
       wake() { this.toasts.forEach(t => this.release(t)); },
       close(id) {
         const t = this.toasts.find(x => x.id === id);
         if (t) clearTimeout(t.timer);
         this.toasts = this.toasts.filter(x => x.id !== id);
       }
     }"
     @visibilitychange.document="document.hidden ? sleep() : wake()">

  <button type="button" x-ref="fire"
          @click="push({ text: 'Vendor bill 8842 matched to GRN 4417', meta: 'Gujarat Polymers Ltd · ₹12,45,000 · 3-way match clean' })"
          class="rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Match bill
  </button>

  <div role="status" aria-live="polite"
       class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <template x-for="t in toasts" :key="t.id">
      <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
           @pointerenter="hold(t)" @pointerleave="release(t)"
           @focusin="hold(t)" @focusout="release(t)"
           x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:enter-start="translate-y-2 opacity-0"
           x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:leave-end="translate-y-2 opacity-0">
        <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
        <div class="min-w-0 flex-1">
          <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
          <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          <a :href="t.href" x-text="t.cta"
             class="mt-1.5 inline-block rounded-sm text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"></a>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
         this.toasts.push({ id: ++this.seq, ...t, ms: 0 });
         this.$nextTick(() => { if (document.querySelector('[data-lucide]:not(svg)')) lucide.createIcons(); });
       },
       close(id) { this.toasts = this.toasts.filter(x => x.id !== id); }
     }">

  <button type="button" x-ref="fire"
          @click="push({ text: 'The August ledger export failed', meta: 'Row 1,842 · posting date is outside the open period' })"
          class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
          <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          <a href="/exports/" class="mt-1.5 inline-block rounded-sm text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            Open the export log
          </a>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
          class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>
  </div>
</div>` },

      { id: 'bulk', name: 'One action, eleven rows', tagNew: true, code:
`<!-- One toast per action, not one per row the action wrote. Approving eleven
     orders raises two messages at most — what went through and what did not —
     never eleven cards racing each other out of the corner and a live region
     reading them one at a time for half a minute.

     The mixed outcome is two toasts and not one because the halves are governed
     by different rules. Nine approved is a confirmation: polite, five seconds,
     gone. Two refused is a failure: assertive, no timer, and it waits. Writing
     both into one card forces one rule onto both, and the rule that loses is
     always the failure's.

     Neither toast is where the outcome is recorded. The register behind this is
     already filtered and already correct, and both counts are links into it —
     the toast is the fact that it finished, not the list of what it did. The
     screen has to make sense with both cards deleted.

     Two pushes in the same tick, which is exactly the case start(n) exists for:
     both $nextTick callbacks run after both pushes, so a start() that reached
     for the last element would set one toast's timer twice and leave the other
     one running until the page is reloaded. -->
<div data-kui="toast/bulk" x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       push(t) {
         const n = { id: ++this.seq, tone: 'success', ms: 5000, timer: 0, ...t };
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
       bucket(name) { return this.toasts.filter(t => (t.tone === 'danger') === (name === 'danger')); },
       approve() {
         this.push({ tone: 'success', text: '9 of 11 orders approved',
                     meta: '₹1,84,26,500 released · 04 Sep 2026',
                     href: '/orders/?batch=2208&status=approved', cta: 'Open the 9 approved' });
         this.push({ tone: 'danger', text: '2 orders were not approved',
                     meta: 'Above your approval limit of ₹25,00,000 · Gujarat Polymers Ltd, Deccan Fasteners',
                     href: '/orders/?batch=2208&status=refused', cta: 'Open the 2 refused' });
       }
     }">

  <button type="button" x-ref="fire" @click="approve()"
          class="rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Approve <span class="tabular-nums">11</span> selected
  </button>

  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <div role="alert" aria-live="assertive" class="flex flex-col gap-2">
      <template x-for="t in bucket('danger')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0 text-red-600"><i data-lucide="alert-circle" class="size-4"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
            <a :href="t.href" x-text="t.cta"
               class="mt-1.5 inline-block rounded-sm text-[12px]/4 font-medium tabular-nums text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"></a>
          </div>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>

    <div role="status" aria-live="polite" class="flex flex-col gap-2">
      <template x-for="t in bucket('polite')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             @pointerenter="pause(t)" @pointerleave="start(t)" @focusin="pause(t)" @focusout="start(t)"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
            <a :href="t.href" x-text="t.cta"
               class="mt-1.5 inline-block rounded-sm text-[12px]/4 font-medium tabular-nums text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"></a>
          </div>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
          <span class="mt-0.5 size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700 motion-reduce:animate-none" aria-hidden="true"></span>
        </template>
        <template x-if="t.tone === 'success'">
          <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
        </template>
        <div class="min-w-0 flex-1">
          <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` },

      { id: 'retry', name: 'Failed, and offering the retry', tagNew: true, code:
`<!-- A rate typed into a line-item grid saves itself, and the save failed. The
     toast keeps the failure on screen with no timer and offers the one thing
     worth offering: the same request again. Nothing on the order changed, and
     the message says so — a failure that does not say what state the record is
     in leaves the user to guess, and they guess wrong.

     Every push carries a key, and a push whose key is already on screen patches
     that toast instead of adding another. An autosave that fails every ten
     seconds otherwise builds a wall of identical cards, each announcing the
     same sentence, none of them the one the user is reading. Patching also
     means an unchanged message is announced once: the default aria-relevant
     reports text that changed, and rewriting the same string changes nothing.

     A key does not survive a change of region, which is why the danger toast is
     closed rather than patched when the retry succeeds. Whether a message
     interrupts is decided by the region its node sits in, so a node cannot be
     recoloured from failure to confirmation in place — it would be a
     confirmation announced assertively, cutting off whatever was being read.

     Retry is not the only route. The rate is still in the cell, the line is
     still unsaved, and the grid's own Save posts the whole thing. A toast that
     is the only way to recover from an error is an alert that was written in
     the wrong component. -->
<div data-kui="toast/retry" x-data="{
       toasts: [], seq: 0, tries: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       region(tone) { return tone === 'danger' ? 'assertive' : 'polite'; },
       push(t) {
         const old = t.key ? this.toasts.find(x => x.key === t.key) : null;
         if (old && this.region(old.tone) === this.region(t.tone)) {
           clearTimeout(old.timer);
           Object.assign(old, t);
           this.hydrate(old);
           return old.id;
         }
         if (old) this.close(old.id);
         const n = { id: ++this.seq, tone: 'pending', ms: 0, timer: 0, ...t };
         if (n.tone === 'danger') n.ms = 0;
         this.toasts.push(n);
         this.hydrate(n);
         return n.id;
       },
       hydrate(t) {
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
       bucket(name) { return this.toasts.filter(t => this.region(t.tone) === name); },
       save() {
         this.tries++;
         this.push({ key: 'rate', tone: 'pending', ms: 0, text: 'Saving the rate on line 3', meta: 'MS angle 50×50 · ₹58,400 per MT' });
         setTimeout(() => {
           if (this.tries > 1) this.push({ key: 'rate', tone: 'success', ms: 5000, text: 'Rate saved on line 3', meta: 'MS angle 50×50 · ₹58,400 per MT · order total ₹4,82,000' });
           else this.push({ key: 'rate', tone: 'danger', text: 'The rate on line 3 was not saved', meta: 'The server did not answer. Nothing on PO-24-1187 has changed.' });
         }, 1200);
       }
     }">

  <button type="button" x-ref="fire" @click="save()"
          class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Save rate
  </button>

  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <div role="alert" aria-live="assertive" class="flex flex-col gap-2">
      <template x-for="t in bucket('assertive')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0 text-red-600"><i data-lucide="alert-circle" class="size-4"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" @click="save()"
                  class="shrink-0 rounded-sm text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            Retry
          </button>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>

    <div role="status" aria-live="polite" class="flex flex-col gap-2">
      <template x-for="t in bucket('polite')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             @pointerenter="pause(t)" @pointerleave="start(t)" @focusin="pause(t)" @focusout="start(t)"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <template x-if="t.tone === 'pending'">
            <span class="mt-0.5 size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-700 motion-reduce:animate-none" aria-hidden="true"></span>
          </template>
          <template x-if="t.tone === 'success'">
            <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
          </template>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>
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
          class="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Release batch
  </button>

  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <button type="button" x-show="toasts.length > 1" x-cloak
            @click="closeAll(); if ($event.detail === 0) $refs.fire.focus()"
            class="pointer-events-auto self-start rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium text-zinc-600 shadow-sm hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
              class="rounded-lg border border-transparent bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:hover:bg-zinc-200">
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
          <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button"
                @click="undo(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="shrink-0 rounded-sm text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          Undo
        </button>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` },

      { id: 'phone', name: 'Above the keyboard at 390px', tagNew: true, code:
`<!-- The region is anchored to the bottom edge and on a phone the bottom edge
     is where the keyboard is. A gate clerk typing a vehicle number gets a
     confirmation drawn underneath 300px of keyboard: it is in the DOM, it is
     announced, it expires on time, and it was never on screen. position: fixed
     is measured against the layout viewport, which the keyboard does not
     change, so no combination of bottom-* fixes this.

     visualViewport is the only thing that reports the covered strip. The offset
     is data rather than design — a measurement in pixels that changes as the
     keyboard opens and closes — so it goes on :style, and the class list keeps
     the rest. Where the API is missing the toast simply sits at the bottom, as
     it does today.

     One at a time below sm. A 96px card is a third of a 390px screen, and three
     of them are the screen. The cap is the phone equivalent of the stack of
     three, and the reason it costs nothing is the same: the register behind it
     is the durable copy.

     The dismiss button is size-11 here rather than size-7. 28px is a mouse
     target; the thumb needs 44, and the negative margins keep the card the same
     height as the two lines it holds. -->
<div data-kui="toast/phone" class="max-w-sm" x-data="{
       toasts: [], seq: 0, lift: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       track() {
         const vv = window.visualViewport;
         if (!vv) return;
         const fit = () => { this.lift = Math.max(0, window.innerHeight - vv.height - vv.offsetTop); };
         vv.addEventListener('resize', fit);
         vv.addEventListener('scroll', fit);
         fit();
       },
       push(t) {
         const n = { id: ++this.seq, ms: 6000, timer: 0, ...t };
         this.toasts.push(n);
         while (this.toasts.length > 1) this.close(this.toasts[0].id);
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
     }" x-init="track()">

  <label for="tp-vehicle" class="mb-1.5 block text-[13px]/5 font-medium">Vehicle number</label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <input id="tp-vehicle" type="text" value="MH 12 KL 4417" autocomplete="off"
           class="block w-full rounded-lg bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none placeholder:text-zinc-500">
  </div>
  <button type="button" x-ref="fire"
          @click="push({ text: 'Gate entry 2208 saved', meta: 'Gujarat Polymers Ltd · 8.400 MT · 04 Sep 2026' })"
          class="mt-3 w-full rounded-lg bg-zinc-700 px-3 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Save gate entry
  </button>

  <div role="status" aria-live="polite" :style="{ bottom: (lift + 16) + 'px' }"
       class="pointer-events-none fixed inset-x-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <template x-for="t in toasts" :key="t.id">
      <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
           @pointerenter="pause(t)" @pointerleave="start(t)"
           @focusin="pause(t)" @focusout="start(t)"
           x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:enter-start="translate-y-2 opacity-0"
           x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:leave-end="translate-y-2 opacity-0">
        <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
        <div class="min-w-0 flex-1">
          <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
        </div>
        <button type="button" aria-label="Dismiss"
                @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                class="-my-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>
    </template>
  </div>
</div>` },

      { id: 'htmx', name: 'Raised by the server', tagNew: true, code:
`<!-- The server decides there is a message and the client decides how it looks.
     The response to the post carries HX-Trigger with the payload on it:

         HX-Trigger: {"kui:toast": {"tone": "success",
                                    "text": "GRN 4417 posted",
                                    "meta": "12.480 MT received"}}

     htmx dispatches that as a real DOM event on the element that made the
     request, and it bubbles to the region listening on window. The alternative
     — rendering the toast card into the response and swapping it into the
     region — puts the timer, the dismiss button and the stack cap in the
     template, where four views will spell them four ways.

     The region stays in the base template, outside every hx-target on the page.
     Swap into it and htmx replaces the region node itself, which produces a
     brand new live region holding a message that was there when it appeared:
     the silent-region defect, arriving by a different route from the usual one.

     htmx:response-error is listened for as well, because a 500 has no headers
     worth reading and the user still pressed something. It is written with the
     .camel modifier: attribute names are lowercased by the HTML parser, so
     @htmx:responseError.window binds to htmx:responseerror and never fires
     once. hx-disabled-elt keeps the second press off the wire while the first
     is still out, and hx-headers sits on the root because there is no form here
     for htmx to read a CSRF token out of. -->
<div data-kui="toast/htmx" hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}' x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       push(t) {
         const n = { id: ++this.seq, tone: 'success', ms: 5000, timer: 0, ...t };
         if (n.tone === 'danger') n.ms = 0;
         this.toasts.push(n);
         while (this.toasts.length > 3) this.close(this.toasts[0].id);
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
     }"
     @kui:toast.window="push($event.detail)"
     @htmx:response-error.camel.window="push({ tone: 'danger', text: 'GRN 4417 could not be posted', meta: 'The server answered ' + $event.detail.xhr.status + '. Nothing has been received against PO-24-1187.' })">

  <button type="button" x-ref="fire"
          hx-post="/grn/4417/post/" hx-swap="outerHTML" hx-target="#grn-4417-row"
          hx-disabled-elt="this"
          class="rounded-lg bg-zinc-700 px-3 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Post GRN
  </button>

  <!-- the row the server swaps is the durable copy; the toast is the shortcut -->
  <div id="grn-4417-row" class="mt-3 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13px]/5">
    <span class="size-1.5 shrink-0 rounded-full bg-zinc-500" aria-hidden="true"></span>
    <span class="min-w-0 flex-1 truncate tabular-nums">GRN 4417 · Gujarat Polymers Ltd</span>
    <span class="shrink-0 text-zinc-600">Open</span>
  </div>

  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <div role="alert" aria-live="assertive" class="flex flex-col gap-2">
      <template x-for="t in bucket('danger')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0 text-red-600"><i data-lucide="alert-circle" class="size-4"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>

    <div role="status" aria-live="polite" class="flex flex-col gap-2">
      <template x-for="t in bucket('polite')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             @pointerenter="pause(t)" @pointerleave="start(t)" @focusin="pause(t)" @focusout="start(t)"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0 text-emerald-600"><i data-lucide="check-circle-2" class="size-4"></i></span>
          <div class="min-w-0 flex-1">
            <p class="text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
            <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600" x-text="t.meta"></p>
          </div>
          <button type="button" aria-label="Dismiss"
                  @click="close(t.id); if ($event.detail === 0) $refs.fire.focus()"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>
  </div>
</div>` },

      { id: 'django', name: 'Messages after a redirect', tagNew: true, code:
`<!-- The confirmation belongs to an action that finished on the previous
     request. post-redirect-get means the page carrying the message is a fresh
     document, so the message cannot be pushed by the code that raised it — it
     comes back down inside the response and has to be turned into a toast on
     arrival.

     views.py
         messages.success(request, 'GRN 4417 posted against PO-24-1187.')
         return redirect('grn-detail', number=4417)

     The messages go into a data island and not into the region. Render the
     cards server-side and they are content that was present when the region
     first appeared, which is the one thing a live region does not report: it
     paints perfectly and announces nothing. Alpine boots on DOMContentLoaded,
     after the whole document — including the empty region — has been parsed and
     handed to the accessibility tree, so a push from x-init is a change to a
     region that already existed.

     messages is consumed by iterating it. This block and the alert/django block
     cannot both be on one page: whichever renders first empties the store and
     the second one draws nothing. Choose per screen. A confirmation of what the
     user just did is this; a condition that is still true when they look away —
     the period is closed, three invoices are unmatched — is an alert in the
     page, and it is not a toast however it was produced.

     message.tags is the Django tag string, and error maps to danger, which
     routes to the assertive region and takes no timer at all. Anything the user
     has to read, copy or act on should have been messages.error, and error is
     the tag this component refuses to put a timer on.

     Nothing here restores focus on dismiss. The control that raised the message
     was on the request before this one and does not exist any more, so the only
     honest thing to do with the caret is leave it where the user put it. -->
<div data-kui="toast/django" x-data="{
       toasts: [], seq: 0,
       still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
       icon: { info: 'info', debug: 'info', success: 'check-circle-2', warning: 'alert-triangle', danger: 'alert-circle' },
       hue: { info: 'text-zinc-500', debug: 'text-zinc-500', success: 'text-emerald-600', warning: 'text-amber-700', danger: 'text-red-600' },
       drain() {
         const el = document.getElementById('kui-messages');
         if (!el) return;
         JSON.parse(el.textContent).forEach(m => this.push({
           tone: m.tags === 'error' ? 'danger' : (this.icon[m.tags] ? m.tags : 'info'),
           text: m.text
         }));
       },
       push(t) {
         const n = { id: ++this.seq, tone: 'info', ms: 5000, timer: 0, ...t };
         if (n.tone === 'danger') n.ms = 0;
         this.toasts.push(n);
         while (this.toasts.length > 3) this.close(this.toasts[0].id);
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
     }" x-init="drain()">

  {% if messages %}
    <script id="kui-messages" type="application/json">
      [{% for message in messages %}{"tags": "{{ message.tags|escapejs }}", "text": "{{ message|escapejs }}"}{% if not forloop.last %},{% endif %}{% endfor %}]
    </script>
  {% endif %}

  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:left-4 sm:w-96">
    <div role="alert" aria-live="assertive" class="flex flex-col gap-2">
      <template x-for="t in bucket('danger')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0" :class="hue[t.tone]"><i :data-lucide="icon[t.tone]" class="size-4"></i></span>
          <p class="min-w-0 flex-1 text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <button type="button" aria-label="Dismiss" @click="close(t.id)"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>

    <div role="status" aria-live="polite" class="flex flex-col gap-2">
      <template x-for="t in bucket('polite')" :key="t.id">
        <div class="pointer-events-auto flex items-start gap-3 rounded-xl border border-zinc-300 bg-white px-3.5 py-3 shadow-lg"
             @pointerenter="pause(t)" @pointerleave="start(t)" @focusin="pause(t)" @focusout="start(t)"
             x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:enter-start="translate-y-2 opacity-0"
             x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
             x-transition:leave-end="translate-y-2 opacity-0">
          <span class="mt-0.5 flex size-4 shrink-0" :class="hue[t.tone]"><i :data-lucide="icon[t.tone]" class="size-4"></i></span>
          <p class="min-w-0 flex-1 text-[13px]/5 font-medium tabular-nums" x-text="t.text"></p>
          <button type="button" aria-label="Dismiss" @click="close(t.id)"
                  class="-mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>
      </template>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'alert-dialog', name: 'Alert dialog', category: 'feedback',
    description: 'A dialog that interrupts to ask one question the user has to answer before anything else happens. Unlike a plain dialog it does not dismiss on a backdrop click, and unlike an in-place confirm it has room for the reason.',
    when: 'Anything destructive, irreversible, or expensive to undo, where there is something the user has to read before answering: deleting a record, closing an order, posting to the ledger, discarding unsaved work, acting on a selection. Three components sit next to each other and the choice between them is not a matter of taste. A dialog is the ordinary modal — it takes a few fields and it dismisses on a backdrop click, because losing it costs nothing. An alert dialog is the interruption — it is not dismissible by accident, it names what is about to happen, and the page behind it stops until it is answered. button/confirm is the cheap third one — the button arms itself and fires on the second press, with no overlay, no focus move and nothing to read; it is right for removing a line item that can be typed back in ten seconds. Pick by what the user has to read: nothing to read is button/confirm, something to read is this, something to fill in that can be abandoned is dialog. If the answer does not matter much, do not interrupt at all.',
    notes: [
      'No @click.self on the backdrop. A dialog dismisses on a stray backdrop click; an alert dialog must not — the user is being asked a question and a misplaced click is not an answer.',
      'Escape still closes, and it means cancel. Taking that away makes the dialog a trap, which is a worse failure than an accidental dismissal. The one exception is an act already in flight, and it is an exception because there is nothing left for cancel to mean.',
      'role="alertdialog", not role="dialog". It tells a screen reader to announce the body immediately instead of waiting for the user to navigate to it — which only works if aria-describedby points at that body.',
      'x-trap.noscroll does three jobs: it traps Tab inside the dialog, it returns focus to the trigger on close, and it locks the page behind. Without it Tab walks straight out into the page underneath, which is still fully interactive.',
      'The focus trap lands on the first focusable element, so order the DOM to make that the safe one — Cancel, or the field in a dialog that asks for something. Focus must never open on the button that deletes something, even though it is the last one visually.',
      'Name the record in the heading. "Are you sure?" tells the user nothing about what they are about to lose.',
      'Say what else goes with it. If deleting the order also deletes a GRN and two approvals, that belongs in the dialog, not in a toast afterwards.',
      'The confirm button repeats the verb — "Delete order", never "OK". Someone who reads only the buttons still knows what is about to happen.',
      'An act that takes a moment keeps the dialog on screen while it runs. Closing on the click and reporting afterwards through a toast is the shape to avoid: the user is returned to a screen that still shows the old state, with a spinner nowhere, and the outcome arrives somewhere they may already have scrolled away from. Keep the overlay up, disable both answers, say what is happening, and let the server close the dialog when it has actually finished.',
      'While the request is in flight Escape is refused and Cancel is genuinely disabled. Both answers have already been given, and a cancel that does not reach the server is a lie about a write that is already happening. Refuse it visibly — the confirm button says what it is doing — never silently.',
      'A refusal from the server is said inside the dialog, not behind it. The user answered the question here, so the answer to their answer belongs here: closing the dialog to raise an error toast throws away the context that made the question legible and leaves the user to reconstruct what they were doing. The refusal also has to say whether anything was written, because "it failed" and "it failed and nothing changed" are different facts and only one of them is safe to retry.',
      'Where the consequence is a list rather than a sentence, put the list in the dialog and let it scroll. The panel takes the same max-h-[80vh] shape a scrolling dialog uses — fixed head, scrolling body, fixed footer — so the confirm button never scrolls out of reach. A scrolling region is only reachable by keyboard if it is focusable, so it takes tabindex="0" and a name, and it then becomes where focus opens, which is correct: the list is the thing that has to be read.',
      'An act that needs one piece of information before it can proceed still belongs here rather than in a dialog, because the question is still the interruption and the field is only the shape the answer takes. One field, and the field is required; two or more and it is a form, which belongs in a dialog or on a page.',
      'Where a precondition blocks the act, the honest dialog offers no confirm at all. A greyed-out Delete with no way to un-grey it sends the user hunting for the setting that enables it. Say what has to happen first, link to it, and give one button that dismisses.',
      'Three answers where there is genuinely a third. Forcing a two-way choice makes people pick the destructive one to get out of the dialog.'
    ],
    anatomy: [
      ['Backdrop', 'Dims the page and centres the panel. It carries no click handler at all — that is the whole difference from a dialog.'],
      ['Container', 'role="alertdialog" and aria-modal="true", labelled by the heading and described by the consequence line.'],
      ['Heading', 'The verb and the record, in one line. "Delete PO-24-1187", not "Confirm deletion".'],
      ['Consequence', 'What else changes, and whether it can be undone. The only place colour appears in the dialog.'],
      ['Consequence list', 'Where the consequence is more than a sentence — the documents a period lock freezes, the records a delete cascades to. A scrolling region inside a panel that is head, body and footer, carrying tabindex="0" and its own name.'],
      ['Field', 'At most one, when the act cannot proceed without it — a rejection reason, a typed confirmation. It sits above the actions and it is what focus opens on.'],
      ['Status line', 'The recessed line under the consequence that says what is happening now and what has been written so far. role="status" while the act runs.'],
      ['Refusal', 'An always-present role="alert" region above the actions, empty until the server refuses. The card inside it is the neutral alert shape — zinc-50 band, zinc-200 border, colour only in the icon.'],
      ['Actions', 'Two, or three when there is a middle answer, or one when a precondition means there is nothing to confirm. Cancel is first in the DOM so it takes focus; the confirm button carries the verb.']
    ],
    behaviour: [
      'Opening moves focus into the dialog and onto the safe action, not the confirm. Where the dialog has a field or a scrolling list, focus opens there instead — still never on the confirm.',
      'Tab and Shift+Tab cycle inside the dialog only. Nothing behind it is reachable.',
      'Escape cancels. A backdrop click does nothing.',
      'Closing returns focus to the control that opened it, so the keyboard does not lose its place.',
      'The page behind does not scroll while the dialog is open.',
      'Where a precondition exists, the confirm button stays genuinely disabled until it is met — not enabled-but-ignored.',
      'While the act is in flight the dialog stays open, Escape does nothing, Cancel is disabled and the confirm reports what it is doing. It closes when the server says the work is finished, not when the click landed.',
      'A refusal leaves the dialog open, restores both answers, and puts the reason above them. Nothing about the question changes, so the user can read the reason and press again or leave.',
      'Where the act cannot be offered at all, the dialog still opens — with the reason, a route to the thing blocking it, and one button that dismisses.',
      'In the scrolling variant only the consequence list moves. The heading and the actions stay put, so the confirm is reachable from anywhere in the list.'
    ],
    a11y: [
      'role="alertdialog" with aria-modal="true", so assistive tech treats the rest of the page as inert.',
      'aria-labelledby points at the heading and aria-describedby at the consequence text. Without the second one the reason is never announced.',
      'Focus enters on the safe action and cannot leave the dialog while it is open.',
      'Focus returns to the trigger when the dialog closes.',
      'Escape closes the dialog from anywhere inside it, except while an act is in flight, where the refusal is deliberate and visible on the disabled buttons.',
      'A blocked confirm is a real disabled button, so the keyboard skips it and a screen reader says it is unavailable, rather than it silently doing nothing.',
      'A scrolling consequence list carries tabindex="0" and an accessible name. A region that scrolls with the mouse wheel and cannot be reached by Tab is unreachable to a keyboard, and it takes the inset focus outline because the panel clips an outward one.',
      'The in-flight state sets aria-busy on the container and carries a role="status" line saying what is happening. The disabled attribute on both buttons is what a screen reader reports; nothing else on screen says the answers have been taken away.',
      'The refusal region is in the DOM from first paint, empty, carrying role="alert" — the same rule the toast region follows. A live region created in the same frame as its first message is treated as content that was always there and announces nothing.',
      'Where every control in the dialog is disabled at once, x-trap falls back to the element it is on, so focus stays inside the overlay instead of dropping to the page behind it.'
    ],
    related: ['dialog', 'button', 'alert', 'sheet'],
    variants: [
      { id: 'confirm', name: 'One question, two answers', code:
`<!-- The base shape, and every other variant here is this one with something
     added. Three decisions are load-bearing.

     There is no @click.self on the backdrop, and that single omission is the
     whole difference between this component and dialog. The user is being asked
     a question; a click that missed the panel is not an answer to it.

     Escape is still wired, because the alternative is a modal with no keyboard
     exit, and a trap is a worse failure than an accidental dismissal. Escape
     means cancel and nothing else.

     Cancel is first in the DOM and the confirm is last, so the focus trap opens
     on the safe answer. Visually they read left to right, which is the reverse
     of the risk order, and that is fine — the eye reads the primary button on
     the right and the keyboard lands on the harmless one.

     The heading names the record and the button repeats the verb. Someone who
     reads only the two buttons still knows what is about to happen. -->
<div data-kui="alert-dialog/confirm" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Close order</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="close-title" aria-describedby="close-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <h2 id="close-title" class="text-[16px]/6 font-semibold">Close PO-24-1187?</h2>
      <p id="close-body" class="mt-1.5 text-[13px]/5 text-zinc-600">
        Sharma Extrusions · <span class="tabular-nums">₹18,42,000</span>. All 6 lines are fully received.
        Closing stops any further GRN against this order. You can reopen it from the order page.
      </p>
      <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Close order</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'destructive', name: 'What goes with it', code:
`<!-- The same shape carrying the one fact people are most often not told: what
     else disappears. A delete that reads "this cannot be undone" and says
     nothing about the GRN and the two approvals hanging off the record is
     technically true and practically useless — the user finds out what the
     cascade took when they go looking for the GRN a week later.

     Colour is in the icon and in the one line that states the cascade, and
     nowhere else. A dialog with a red band across it shouts at the same volume
     whether it is deleting a draft or a posted order, so the volume stops
     carrying information.

     The confirm is the solid red fill rather than a red-bordered white button.
     There is one destructive shape in this system and this is it; a red outline
     reads as a secondary action, which is exactly wrong for the button that
     does the deleting. -->
<div data-kui="alert-dialog/destructive" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Delete order</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="del-title" aria-describedby="del-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <div class="flex items-start gap-3">
        <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
        <div class="min-w-0">
          <h2 id="del-title" class="text-[16px]/6 font-semibold">Delete PO-24-1187</h2>
          <p class="mt-1.5 text-[13px]/5 tabular-nums text-zinc-600">
            Nashik Steel Traders · ₹18,42,000 · raised 04 Aug 2026.
          </p>
          <p id="del-body" class="mt-2 text-[13px]/5 font-medium text-red-600">
            GRN 1142 and 2 approvals are linked to this order and will be deleted with it. This cannot be undone.
          </p>
        </div>
      </div>
      <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-red-600 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Delete order</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'typed', name: 'Typed confirmation', code:
`<!-- For the small number of actions that cannot be undone at all. Do not reach
     for this every time something is deleted — if every dialog asks for typing,
     people learn to type without reading, and the friction has bought nothing
     except a slower way to make the same mistake.

     The input is first in the DOM, so the trap opens on it rather than on
     Cancel. That is the one case where focus does not land on the safe answer,
     and it is safe because the field is not an answer: nothing happens until
     the string matches and the user then goes looking for the button.

     The confirm carries a real disabled attribute rather than an ignored click.
     A disabled button leaves the tab order and is announced as unavailable; an
     enabled button whose handler quietly returns reads as a broken screen.

     The border and the focus outline are on the wrapper and the input takes
     outline-none, which is the carve-out rule 11 allows — the wrapper draws the
     outline for it. -->
<div data-kui="alert-dialog/typed" x-data="{ open: false, typed: '', target: 'SHARMA-EXT' }">
  <button type="button" @click="open = true; typed = ''"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Delete vendor</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="wipe-title" aria-describedby="wipe-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <h2 id="wipe-title" class="text-[16px]/6 font-semibold">Delete Sharma Extrusions</h2>
      <p id="wipe-body" class="mt-1.5 text-[13px]/5 text-zinc-600">
        <span class="font-medium tabular-nums text-red-600">34 orders, 61 invoices and the rate contract</span>
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

      <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="open = false" :disabled="typed !== target"
                class="rounded-lg border border-transparent bg-red-600 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:hover:bg-zinc-200">
          Delete vendor
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'reason', name: 'Asking for a reason first', tagNew: true, code:
`<!-- The act needs one piece of information before it can happen, and without
     it the act is worthless: a rejection with no reason sends the buyer back to
     the same order with nothing to change. So the question and the field are
     one interruption rather than two screens.

     One field, and it is required. The moment a second field is genuinely
     needed this has stopped being a question and become a form, and a form
     belongs in dialog or on a page — an alert dialog that grew four inputs is a
     modal form wearing an alarm icon, and it loses the one property that made
     it worth interrupting for.

     The select is first in the DOM, so the trap opens on the thing that has to
     be filled in rather than on Cancel. The confirm is genuinely disabled until
     the reason is chosen, and the note is required only for Other, which is the
     one choice that carries no information by itself.

     The note is not a second question, it is the same one — which is why it
     sits under the reason rather than beside it, and why its help text says who
     reads it. A free-text box with no audience named gets filled with "as
     discussed".

     The select takes appearance-none and a drawn chevron on a pointer-events-
     none span, because a select with both the platform arrow and a drawn one
     has two arrows, and a span over the right end of the control swallows the
     click that opens the list. -->
<div data-kui="alert-dialog/reason" x-data="{ open: false, reason: '', note: '' }">
  <button type="button" @click="open = true; reason = ''; note = ''"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reject order</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="rej-title" aria-describedby="rej-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <h2 id="rej-title" class="text-[16px]/6 font-semibold">Reject PO-24-1191</h2>
      <p id="rej-body" class="mt-1.5 text-[13px]/5 tabular-nums text-zinc-600">
        Deccan Fasteners Pvt Ltd · ₹3,84,500 · raised 02 Sep 2026. The order returns to draft and
        Anil Kulkarni is emailed the reason.
      </p>

      <div class="mt-4">
        <label for="rej-reason" class="mb-1.5 block text-[13px]/5 font-medium">
          Reason <span aria-hidden="true" class="text-red-600">*</span>
        </label>
        <div class="relative rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="rej-reason" name="reason" x-model="reason" required
                  class="block w-full min-w-0 appearance-none bg-transparent py-2 pr-9 pl-3 text-[14px]/5 outline-none">
            <option value="" selected disabled hidden>Choose a reason</option>
            <option value="rate">Rate above the running contract</option>
            <option value="qty">Quantity exceeds the indent</option>
            <option value="vendor">Vendor documents expired</option>
            <option value="budget">No budget left on this cost centre</option>
            <option value="other">Other</option>
          </select>
          <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-600">
            <i data-lucide="chevron-down" class="size-4"></i>
          </span>
        </div>
      </div>

      <div class="mt-3">
        <label for="rej-note" class="mb-1.5 block text-[13px]/5 font-medium">
          Note to the buyer
          <span x-show="reason === 'other'" x-cloak aria-hidden="true" class="text-red-600">*</span>
        </label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <textarea id="rej-note" name="note" rows="3" x-model="note" aria-describedby="rej-note-help"
                    :required="reason === 'other'"
                    class="block w-full resize-none bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500"
                    placeholder="Quote the contract rate, or the indent line that does not match."></textarea>
        </div>
        <p id="rej-note-help" class="mt-1.5 text-[12px]/4 text-zinc-500">
          Goes into the rejection email and onto the order history. Required when the reason is Other.
        </p>
      </div>

      <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="open = false"
                :disabled="!reason || (reason === 'other' && note.trim() === '')"
                class="rounded-lg border border-transparent bg-red-600 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:hover:bg-zinc-200">
          Reject order
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'consequences', name: 'Reading the list before answering', tagNew: true, code:
`<!-- When the consequence is a list rather than a sentence. Nine documents go
     read-only and the user is entitled to see which nine before answering,
     which is more than a paragraph can carry and more than a toast afterwards
     can repair.

     The panel becomes the three-part shape a scrolling dialog uses — fixed
     head, scrolling body, fixed footer, capped at 80vh — for one reason: the
     confirm button must never be below the fold. Let the whole panel grow and
     scroll instead and the answer to the question sits somewhere off the bottom
     of a phone, and the user scrolls a list they were not reading to find it.

     min-h-0 on the body is what allows the flex child to shrink. Without it the
     body takes its content height, the panel overflows its own max-h and the
     footer leaves the viewport — the exact defect the max-h was added to
     prevent.

     The scroller carries tabindex="0" and a name. A region that scrolls under
     the wheel and cannot be reached by Tab is unreachable to anyone on a
     keyboard, and this is the one place in the component where that matters
     most, because the list is what the answer depends on. It takes the inset
     focus outline, since the panel is overflow-hidden and would clip an
     outward one.

     That also makes the scroller the first focusable element, so focus opens on
     the list rather than on Cancel. That is the right trade here — the destroy
     button is still last, and the thing the trap lands on is the thing that has
     to be read. -->
<div data-kui="alert-dialog/consequences" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Lock August 2026</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="lock-title" aria-describedby="lock-body"
         class="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="shrink-0 px-5 pt-5 pb-3">
        <h2 id="lock-title" class="text-[16px]/6 font-semibold">Lock the August 2026 period</h2>
        <p id="lock-body" class="mt-1.5 text-[13px]/5 text-zinc-600">
          <span class="tabular-nums">9 documents</span> dated on or before 31 Aug 2026 become read-only and
          no entry can be posted into the period again. Only the finance controller can reopen it.
        </p>
      </div>

      <div tabindex="0" role="group" aria-label="Documents locked by this change"
           class="min-h-0 flex-1 overflow-y-auto border-y border-zinc-200 px-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
        <ul>
          <li class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-[13px]/5 font-medium">GRN 1142 · Nashik Steel Traders</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">Goods receipt · 04 Aug 2026</p>
            </div>
            <span class="shrink-0 text-[13px]/5 tabular-nums">₹18,42,000</span>
          </li>
          <li class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-[13px]/5 font-medium">GRN 1147 · Gujarat Polymers Ltd</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">Goods receipt · 09 Aug 2026</p>
            </div>
            <span class="shrink-0 text-[13px]/5 tabular-nums">₹4,82,000</span>
          </li>
          <li class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-[13px]/5 font-medium">PI-26-0418 · Deccan Fasteners Pvt Ltd</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">Purchase invoice · 12 Aug 2026</p>
            </div>
            <span class="shrink-0 text-[13px]/5 tabular-nums">₹3,84,500</span>
          </li>
          <li class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-[13px]/5 font-medium">PI-26-0421 · Konkan Chemicals Pvt Ltd</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">Purchase invoice · 14 Aug 2026</p>
            </div>
            <span class="shrink-0 text-[13px]/5 tabular-nums">₹96,400</span>
          </li>
          <li class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-[13px]/5 font-medium">TO-26-0092 · Wada to Bhiwandi</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">Transfer order · 18 Aug 2026</p>
            </div>
            <span class="shrink-0 text-[13px]/5 tabular-nums">12.4 MT</span>
          </li>
          <li class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-[13px]/5 font-medium">JV-26-0311 · Freight accrual</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">Journal voucher · 21 Aug 2026</p>
            </div>
            <span class="shrink-0 text-[13px]/5 tabular-nums">₹1,18,750</span>
          </li>
          <li class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-[13px]/5 font-medium">PMT-26-0177 · Baroda Fasteners</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">Vendor payment · 24 Aug 2026</p>
            </div>
            <span class="shrink-0 text-[13px]/5 tabular-nums">₹7,50,000</span>
          </li>
          <li class="flex items-center justify-between gap-4 border-b border-zinc-100 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-[13px]/5 font-medium">GRN 1153 · Sharma Extrusions</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">Goods receipt · 28 Aug 2026</p>
            </div>
            <span class="shrink-0 text-[13px]/5 tabular-nums">₹2,64,300</span>
          </li>
          <li class="flex items-center justify-between gap-4 py-2.5">
            <div class="min-w-0">
              <p class="truncate text-[13px]/5 font-medium">JV-26-0318 · Depreciation, August</p>
              <p class="text-[12px]/4 tabular-nums text-zinc-500">Journal voucher · 31 Aug 2026</p>
            </div>
            <span class="shrink-0 text-[13px]/5 tabular-nums">₹9,42,180</span>
          </li>
        </ul>
      </div>

      <div class="flex shrink-0 flex-col-reverse gap-2 bg-zinc-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-[12px]/4 tabular-nums text-zinc-600">Locked by Ritu Deshpande · takes effect at once</p>
        <div class="flex flex-col-reverse gap-2 sm:flex-row">
          <button type="button" @click="open = false"
                  class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
          <button type="button" @click="open = false"
                  class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Lock the period</button>
        </div>
      </div>
    </div>
  </div>
</div>` },

      { id: 'bulk', name: 'Acting on a selection', code:
`<!-- Acting on a selection. Say how many, and say which ones will not go
     through — a bulk action that silently skips rows is the worst kind of bulk
     action, because the register afterwards looks like it worked and the three
     orders that did not move are indistinguishable from the ones nobody
     selected.

     The breakdown is a dl rather than a sentence, so the counts line up in one
     column and the reader can check that they add to the number in the button.
     The two icons are the only colour: emerald for what will go through, amber
     for what routes on. There is no red here because nothing is being
     destroyed, and using red for "needs a second approval" would spend the
     alarm colour on a normal working day.

     The button repeats the count as well as the verb. "Approve" alone in a
     dialog raised from a register is the one place where the user genuinely may
     not remember whether they had 12 rows or 2 selected. -->
<div data-kui="alert-dialog/bulk" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve 12 selected</button>

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

      <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve 12 orders</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'blocked', name: 'Nothing to confirm', tagNew: true, code:
`<!-- The precondition is not met, so there is no question to ask, and the
     honest dialog says so with no confirm button in it at all.

     The shape to avoid is a greyed-out Delete sitting where the confirm
     normally is. A disabled button is a promise that something would enable it,
     so the user goes hunting: they check their permissions, they log out and
     back in, they ask somebody. Nothing will enable it — the order has a posted
     GRN against it and it never will be deletable while that is true. Removing
     the button entirely is what makes the dialog readable in one pass.

     What replaces it is a route. Each blocker names the record and links to it,
     and the primary action is the first step out of the situation rather than a
     restatement of the problem. A dialog that reports a dead end and offers
     nothing is a dead end with a border around it.

     Close is first in the DOM, so focus opens on the harmless answer, and the
     route is last where the primary action always sits. Both are safe here,
     which is the one dialog in this entry where the DOM order costs nothing.

     It is still role="alertdialog". The interruption and the announced body are
     what the role is for; the number of answers is not part of it, and this
     dialog leans on aria-describedby harder than any of the others because the
     body is the entire content. -->
<div data-kui="alert-dialog/blocked" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Delete order</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="block-title" aria-describedby="block-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <div class="flex items-start gap-3">
        <i data-lucide="lock" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
        <div class="min-w-0">
          <h2 id="block-title" class="text-[16px]/6 font-semibold">PO-24-1189 cannot be deleted</h2>
          <p id="block-body" class="mt-1.5 text-[13px]/5 text-zinc-600">
            Two records are already posted against this order. Deleting it would leave both without a
            parent, so the delete is not offered. Reverse them first, or cancel the order instead —
            a cancelled order keeps its history and stops any further receipt.
          </p>
        </div>
      </div>

      <ul class="mt-4 divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-4">
        <li class="flex items-center justify-between gap-4 py-2.5">
          <div class="min-w-0">
            <p class="truncate text-[13px]/5 font-medium">
              <a href="#" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">GRN 1142</a>
            </p>
            <p class="text-[12px]/4 tabular-nums text-zinc-500">4,200 kg received 28 Aug 2026</p>
          </div>
          <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">₹5,46,000</span>
        </li>
        <li class="flex items-center justify-between gap-4 py-2.5">
          <div class="min-w-0">
            <p class="truncate text-[13px]/5 font-medium">
              <a href="#" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PMT-26-0181</a>
            </p>
            <p class="text-[12px]/4 tabular-nums text-zinc-500">Advance paid 22 Aug 2026</p>
          </div>
          <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">₹2,45,000</span>
        </li>
      </ul>

      <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Close</button>
        <a href="#"
           class="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="undo-2" class="size-4"></i>Reverse GRN 1142
        </a>
      </div>
    </div>
  </div>
</div>` },

      { id: 'running', name: 'While the act runs', tagNew: true, code:
`<!-- The act is irreversible and it takes a few seconds, so the dialog stays up
     for the length of it and cannot be answered twice.

     The shape being rejected is the common one: close on the click, post in the
     background, report with a toast. It returns the user to a screen that still
     shows the old state with nothing spinning on it, and if the post fails the
     failure arrives in a corner of a page they may already have left. Keeping
     the overlay up costs one flag and makes the wait legible.

     Two mechanisms, doing two different jobs. htmx owns what the button looks
     like, because htmx is the only thing that knows every ending a request has
     — done, failed, timed out, aborted — and a hand-rolled busy flag is still
     spinning through three of them. hx-disabled-elt stops the second post for
     the same reason: htmx re-enables on every outcome, and a @click that sets a
     flag only ever remembers the happy one. Alpine owns what the dialog
     refuses, because the dialog is Alpine's. It reads the same request through
     htmx:before-request and htmx:after-request, which htmx dispatches in both
     the camelCase and the kebab-case form, and only the second one is writable
     as an Alpine event name.

     Escape is refused while busy and Cancel is genuinely disabled. Both answers
     have already been given; a cancel that never reaches the server would be a
     lie about a write that is already happening. The refusal is visible — the
     button says Posting — rather than an Escape that silently does nothing.

     While both buttons are disabled there is nothing tabbable left inside, and
     x-trap falls back to the element it is on, so focus stays in the overlay
     instead of dropping into the page behind.

     The confirm does not go grey while it waits. A greyed-out button says you
     cannot do this, when the truth is that you already have.

     The dialog is closed by the server, not by the click: the view answers with
     HX-Trigger: grn-posted once the ledger write has committed. hx-swap="none"
     because there is nothing on this panel to replace — a failure comes back
     the same way and lands in the refused shape below. -->
<div data-kui="alert-dialog/running"
     x-data="{ open: false, busy: false }"
     @htmx:before-request="busy = true"
     @htmx:after-request="busy = false"
     @grn-posted.window="busy = false; open = false">
  <button type="button" @click="open = true"
          class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Post GRN 4417</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="if (!busy) open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="post-title" aria-describedby="post-body"
         :aria-busy="busy"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <h2 id="post-title" class="text-[16px]/6 font-semibold">Post GRN 4417 to stock</h2>
      <p id="post-body" class="mt-1.5 text-[13px]/5 tabular-nums text-zinc-600">
        Nashik Steel Traders · 7,800 kg against PO-24-1187 · ₹10,14,000. Posting writes the stock entry
        and the purchase accrual to the ledger dated 04 Sep 2026. A posted GRN is undone by a credit
        note, never by deleting it.
      </p>

      <p role="status" class="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-[12px]/4 text-zinc-600">
        <span x-show="!busy">Nothing is written until you press Post GRN.</span>
        <span x-show="busy" x-cloak class="flex items-start gap-2">
          <span class="mt-px shrink-0 text-zinc-500"><i data-lucide="loader-circle" class="size-3.5 animate-spin"></i></span>
          <span>Posting to the ledger. This takes a few seconds — leave the dialog open until it finishes.</span>
        </span>
      </p>

      <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" @click="open = false" :disabled="busy"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:hover:bg-zinc-200">Cancel</button>

        <button type="button"
                hx-post="/grn/4417/post/" hx-swap="none" hx-disabled-elt="this"
                class="group inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:hover:bg-zinc-700">
          <span class="group-[.htmx-request]:hidden"><i data-lucide="check" class="size-4"></i></span>
          <span class="hidden group-[.htmx-request]:inline"><i data-lucide="loader-circle" class="size-4 animate-spin"></i></span>
          <span class="grid">
            <span class="col-start-1 row-start-1 group-[.htmx-request]:invisible">Post GRN</span>
            <span class="invisible col-start-1 row-start-1 group-[.htmx-request]:visible">Posting…</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'refused', name: 'The server said no', tagNew: true, code:
`<!-- The user answered and the server refused. The refusal belongs inside this
     dialog, above the same two buttons, and the dialog does not move.

     The shape being rejected is closing on the click and raising an error
     toast. It throws away everything that made the question legible — the
     record, the figures, the consequence line — and hands the user a red
     sentence in a corner with no way back to the decision they were making. It
     also loses the retry: a toast has no confirm button in it, so the user has
     to find the trigger again and read the whole dialog a second time.

     The refusal says whether anything was written. "Could not post" and "could
     not post and nothing was written" are different facts, and only one of them
     is safe to press again — so the line states it, and the confirm changes to
     Try again only because it is safe here. Where a refusal leaves the record
     half-written, the confirm goes away and the dialog becomes the blocked
     shape instead.

     The region carrying the refusal is in the DOM from first paint, empty, with
     role="alert" on it and the card inside it doing the showing. This is the
     toast rule and it exists for the same reason: a live region created in the
     same frame as its first message counts as content that was always there and
     is never announced. Only the card is x-show, so the region itself never
     leaves.

     Nothing else in the dialog changes. aria-describedby still points at the
     consequence line rather than at the refusal — the refusal announces itself,
     and pointing describedby at a node that is empty most of the time gives a
     screen reader nothing to read on open.

     In a real screen the string is the server's, swapped in by htmx or read off
     an HX-Trigger detail; the Alpine here only stands in for it. -->
<div data-kui="alert-dialog/refused" x-data="{ open: false, error: '' }">
  <button type="button" @click="open = true; error = ''"
          class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve PO-24-1187</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="sync-title" aria-describedby="sync-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <h2 id="sync-title" class="text-[16px]/6 font-semibold">Approve PO-24-1187</h2>
      <p id="sync-body" class="mt-1.5 text-[13px]/5 tabular-nums text-zinc-600">
        Sharma Extrusions · ₹18,42,000 · 6 lines. Approving commits the value against the Wada plant
        budget and emails the vendor a copy.
      </p>

      <!-- present and empty from the first paint, which is what makes it announce -->
      <div role="alert" aria-live="assertive">
        <div x-show="error" x-cloak class="mt-4 flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
          <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
          <p class="min-w-0 text-[13px]/5 tabular-nums text-zinc-900" x-text="error"></p>
        </div>
      </div>

      <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button"
                @click="error = 'Approval refused. The budget service did not answer in 30 seconds, so nothing was written and the order is still awaiting approval.'"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <span x-text="error ? 'Try again' : 'Approve order'">Approve order</span>
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'unsaved', name: 'Three answers', code:
`<!-- Discard, keep editing, save. When there is a genuine third answer, offer
     it: forced into two, people pick the destructive one because it is the only
     one that gets them out of the dialog, and the work is gone.

     The three are not equal and the styling says which is which. Keep editing
     is the safe answer and takes focus. Discard is the destructive one and
     carries red text with no fill — a solid red button here would out-shout
     Save, which is the answer most people want. Save and leave is the primary,
     because it is the one that loses nothing.

     Three buttons do not fit on a 390px row, so the footer stacks below sm with
     flex-col-reverse. That puts the primary at the top of the stack under the
     thumb and leaves the DOM order alone, so focus still opens on Keep editing.

     This is the dialog that must not be raised by beforeunload. The browser
     draws its own text for that event and none of this is shown; use it for a
     real page unload and use this for in-app navigation you control. -->
<div data-kui="alert-dialog/unsaved" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Leave page</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="leave-title" aria-describedby="leave-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <h2 id="leave-title" class="text-[16px]/6 font-semibold">Leave without saving?</h2>
      <p id="leave-body" class="mt-1.5 text-[13px]/5 tabular-nums text-zinc-600">
        PO-24-1187 has 4 unsaved line items and a changed delivery date. Leaving now loses them.
      </p>
      <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Keep editing</button>
        <button type="button" @click="open = false"
                class="rounded-lg px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Discard changes</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save and leave</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'django', name: 'Answering with a real POST', tagNew: true, code:
`<!-- The answer is a form submission, and it has to be a POST. The trigger is a
     button that opens the dialog, never an anchor pointing at the delete URL:
     a link that changes state is followed by link prefetch, by a mail scanner
     unrolling the URL in a notification, and by the browser's own preview, and
     each of those deletes the order with nobody pressing anything. GET reads,
     POST writes, and this component exists precisely for the writes worth
     interrupting over.

     {% csrf_token %} sits inside the form. It is not inside the panel by
     accident — a dialog assembled from an include that puts the token outside
     the <form> renders fine and posts a 403 the first time somebody confirms.

     Nothing here reports the outcome, and that is deliberate. The submission
     replaces the whole document, so anything this dialog draws afterwards is
     never seen. The view redirects and django.contrib.messages carries the
     result into the next page, where alert/django renders it. If you want the
     outcome reported without a page change, that is the running variant and
     htmx, not this one.

     The two failure modes both have a shape in this entry. Check the
     precondition in get_context_data and render the blocked shape instead of
     this one, so the confirm is never drawn for a delete that cannot happen;
     catch ProtectedError from on_delete=PROTECT in the view and re-render with
     the refused shape, because a database that refuses after the POST is the
     server saying no.

     Indian digit grouping is not something intcomma does — it groups in
     thousands — so the value arrives already formatted from the model rather
     than through a template filter. -->
<div data-kui="alert-dialog/django" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Delete order</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="alertdialog" aria-modal="true" aria-labelledby="dj-title" aria-describedby="dj-body"
         class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-5 shadow-lg">
      <div class="flex items-start gap-3">
        <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
        <div class="min-w-0">
          <h2 id="dj-title" class="text-[16px]/6 font-semibold">Delete {{ order.number }}</h2>
          <p class="mt-1.5 text-[13px]/5 tabular-nums text-zinc-600">
            {{ order.vendor.name }} · ₹{{ order.total_inr }} · raised {{ order.raised_on|date:"d M Y" }}.
          </p>
          <p id="dj-body" class="mt-2 text-[13px]/5 font-medium text-red-600">
            {% if order.cascade_count %}
              {{ order.cascade_count }} linked record{{ order.cascade_count|pluralize }} will be deleted with it.
            {% endif %}
            This cannot be undone.
          </p>
        </div>
      </div>

      <form method="post" action="{% url 'orders:delete' order.pk %}">
        {% csrf_token %}
        <div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" @click="open = false"
                  class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
          <button type="submit" name="confirm" value="delete"
                  class="rounded-lg bg-red-600 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Delete order</button>
        </div>
      </form>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'dialog', name: 'Dialog', category: 'feedback',
    description: 'A centred, dismissible panel over a dimmed page. Use it to take a handful of fields without leaving the list.',
    when: 'Short forms and anything the user can walk away from. A form longer than about six fields belongs on its own page; a record to read beside the list it came from belongs in a sheet; a short action list on a phone belongs in a drawer; a question that must be answered belongs in an alert dialog.',
    notes: [
      'Close on escape and on a backdrop click with @click.self. A dialog with no way out except the button is a trap.',
      'A native picker inside the panel needs no guard against the escape handler. A select popup and a date picker both swallow Escape whole: the popup closes and no keydown reaches the page at all, so @keydown.escape.window never fires and the panel stays open. A second Escape then closes the panel, which is the same two-stage handling the combobox does deliberately. Measured in Chromium against a select and an input[type=date] opened with showPicker. Do not add a guard that skips Escape when the target is a picker field: that would break Escape closing the panel while such a field merely has focus, which works today.',
      'x-cloak on the overlay, otherwise it flashes over the page on load.',
      'x-trap.noscroll on the backdrop, exactly as the alert dialog uses it: Tab stays inside the panel, focus returns to the trigger on close, and the page behind stops scrolling. @click.self sits on the same element and still fires — the focus plugin runs with allowOutsideClick, and a click on the backdrop is inside the trap anyway.',
      'x-trap opens focus on the first element inside the panel carrying autofocus, and on the first focusable element when there is none. Put autofocus on the first field when the panel exists to be typed into; leave it off when the panel is only read, and focus lands on the close button, which is the safe one.',
      'A dialog is dismissible by definition. The moment a stray backdrop click would lose the user something, it is an alert dialog and it belongs in that component instead. That is the whole boundary: this entry never asks a question with two answers, never confirms and never destroys, and there is no confirm variant here for the same reason there is no second implementation of anything else.',
      'The one exception to dismissible is a write already in flight. While the panel\'s own POST is running, Escape and the backdrop do nothing, because a dismissal there tells the user they cancelled something the server is in the middle of doing. It is not a mode: dismissal comes back the moment the request settles, on every ending, which is why busy is cleared from htmx:afterRequest and never from htmx:afterSwap — a swap only happens when the request succeeded.',
      'The body and the footer of a form dialog are a real <form> and the primary button is its submit, so Enter from any field saves. The header stays outside it, so the close button is not a submit and does not need type="button" to keep it from being one.',
      'htmx does not swap a 4xx. A dialog that posts a form and gets 422 back with the field errors in it sits there doing nothing, and the user presses Save again — allow the swap explicitly in htmx:beforeSwap, or the failure is silent.',
      'Four widths and no others: max-w-sm for something only read, max-w-md for a form, max-w-lg when the body is a list that scrolls, and max-w-3xl only when the content is a comparison that has to be read across. Anything that wants more than 3xl is a page, and a page has a URL somebody can send.',
      'A dialog may open a second dialog, and two deep is the limit. Put .noscroll on the outer trap only: the plugin compensates for the scrollbar it removes by writing a padding onto the documentElement, and a second noscroll activating over the first measures the scrollbar as already gone, writes 0px, and shifts the dimmed page behind by its width — twice, once each way. The focus plugin needs no help with the rest, because focus-trap keeps one shared stack and pauses the outer trap while the inner one is active.',
      'Stop Escape at the inner overlay rather than guarding the outer handler on a flag. Both handlers are on window, so both fire, and by the time the outer one reads the flag the inner one has already cleared it and one keypress closes both panels. @keydown.escape.stop on the inner overlay never lets the event reach window at all.',
      'A step sequence in a dialog is three steps at the outside. Past that the user needs to leave and come back, which means a URL per step and a server that remembers — that is form-page/wizard, not this.'
    ],
    anatomy: [
      ['Backdrop', 'A zinc-900/40 field that dims the page and carries @click.self to dismiss, plus x-trap.noscroll to hold focus and lock the page behind.'],
      ['Panel', 'Centred and rounded-xl, at one of four widths — sm to read, md for a form, lg for a scrolling list, 3xl for a comparison. Capped at 80vh on a laptop, and full height only in the phone variant, which stops being a floating card below sm.'],
      ['Header', 'The title and a close button, on a bordered strip that does not scroll.'],
      ['Body', 'The fields, or the content. This is the only part that scrolls.'],
      ['Footer', 'Cancel and the primary action, right-aligned on a zinc-100 strip that does not scroll. It is also where the status line for a submit in flight lives, in front of the buttons rather than under them.']
    ],
    behaviour: [
      'Escape closes, a backdrop click closes, and the close button closes. All three, always — except while the panel\'s own request is in flight, when none of the three do anything until it settles.',
      'Opening moves focus into the panel: onto the first field where there is one to fill in, otherwise onto the close button.',
      'Tab and Shift+Tab cycle inside the panel only. Nothing behind it is reachable while it is open.',
      'Closing returns focus to the control that opened it, so the keyboard does not lose its place.',
      'Enter from any field in a form dialog saves it, because the body and footer are a real form and the primary button is its submit.',
      'In the scrolling variant only the body moves; the header and footer stay, so the primary action never scrolls out of reach.',
      'Every panel is capped at 80vh with the body scrolling inside it, so a dialog never grows past the viewport on a laptop or in landscape on a phone. Below sm the phone variant drops the cap and fills the screen instead.',
      'The page behind does not scroll while the dialog is open, and it does not jump sideways when its scrollbar goes — x-trap.noscroll pads for the width it removes.',
      'A failed submit leaves the panel open with everything the user typed still in it. The dialog closes on success and on nothing else.',
      'A second dialog opened from the first pauses it: the first is still on screen, dimmed again, and one Escape or one backdrop click closes one panel.',
      'A form longer than about six fields belongs on a page. A dialog that scrolls a long form is a page in a costume.'
    ],
    a11y: [
      'role="dialog" with aria-modal="true" and aria-labelledby pointing at the heading.',
      'Focus moves into the panel on open and returns to the trigger on close — x-trap from @alpinejs/focus does both, the same as the alert dialog.',
      'Focus is trapped inside while it is open, so Tab cannot walk out into the page underneath, which is still fully rendered.',
      'A form dialog opens on its first field, marked with autofocus, which x-trap honours. A read-only one opens on the close button.',
      'The close button carries aria-label="Close".',
      'Escape works from anywhere inside the panel, including from within a focused input.',
      'A panel whose body has not arrived yet is labelled from the first frame, because the title is a fact the row that opened it already knows. The body carries aria-busy and an sr-only line saying what is being fetched; without it a reader entering the panel hears the title and then silence.',
      'The panel carries aria-busy while its own submit is in flight, and the wait is also written into a role="status" line that already exists in the footer. A live region added at the moment it has something to say is a live region that announces nothing.',
      'A failed submit moves focus to the error summary, not to the first bad field: the summary names every field that failed and links to each one, and a field only names itself. Nothing else moves focus on a swap.',
      'Each field the server rejected carries aria-invalid="true" and an aria-describedby pointing at its own message, so the reason is read when focus arrives there from the summary.',
      'In a step sequence the step heading takes focus on every change, through tabindex="-1", and it keeps the standard focus outline because the user pressed a key to get there. The dialog is still labelled by the header title, which does not change between steps.',
      'Escape closes the top dialog only. The inner overlay stops the event, so a stack of two takes two presses.'
    ],
    related: ['alert-dialog', 'sheet', 'drawer', 'form-page'],
    variants: [
      { id: 'form', name: 'Form dialog', code:
`<!-- The body and the footer are a real form, so Enter from either field saves.
     The header sits outside it: the close button inside a form is a submit
     button unless something says otherwise, and the something is easy to forget.

     @submit.prevent is the demo standing in for the POST, the same way the
     buttons in this entry close the panel instead of doing anything. Take it
     off and the form posts to its action, or give the form hx-post and let the
     submitting variant\'s wiring take over.

     The asterisk is aria-hidden and the control carries required. Read out, the
     label was "Quantity received star", and the fact it was trying to convey is
     the one the required attribute already carries properly. The help text is
     wired with aria-describedby rather than left sitting under the field, where
     it is a paragraph a screen reader reaches only if it happens to keep
     reading. -->
<div data-kui="dialog/form" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="plus" class="size-4"></i>Record GRN
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="grn-title"
         class="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="grn-title" class="text-[16px]/6 font-semibold">Record GRN</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">PO-24-1187 · Sharma Extrusions</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <form action="/grn/" method="post" @submit.prevent="open = false" class="flex min-h-0 flex-1 flex-col">
        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div>
            <label for="grn-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity received <span aria-hidden="true" class="text-red-600">*</span></label>
            <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <!-- x-trap opens focus on [autofocus] if the panel has one, otherwise on the close button -->
              <input id="grn-qty" name="quantity" autofocus required inputmode="decimal" value="4,200"
                     aria-describedby="grn-qty-help"
                     class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
              <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
            </div>
            <p id="grn-qty-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Ordered 12,000 kg, received 7,800 kg so far.</p>
          </div>

          <div class="mt-4">
            <label for="grn-date" class="mb-1.5 block text-[13px]/5 font-medium">Receipt date <span aria-hidden="true" class="text-red-600">*</span></label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="grn-date" name="received_on" type="date" required value="2026-08-19" class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
            </div>
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
          <button type="button" @click="open = false"
                  class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
          <button type="submit"
                  class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save</button>
        </div>
      </form>
    </div>
  </div>
</div>` },

      { id: 'scrolling', name: 'Scrolling body', code:
`<!-- Header and footer stay put, only the middle scrolls. max-h on the panel,
     overflow-y on the body, and min-h-0 so the flex child is allowed to shrink.
     The total is in the footer rather than at the end of the list, because a
     figure the user is checking the lines against cannot be the thing they have
     to scroll to reach. -->
<div data-kui="dialog/scrolling" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Review 6 lines</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="lines-title"
         class="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="lines-title" class="text-[16px]/6 font-semibold">Order lines</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">PO-24-1187 · Sharma Extrusions · 6 lines</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-2">
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS angle 50×50×6</p><p class="text-[12px]/4 tabular-nums text-zinc-600">12,000 kg · received 7,800</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹6,84,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS plate 10 mm</p><p class="text-[12px]/4 tabular-nums text-zinc-600">4,000 kg · received 4,000</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹3,12,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS channel 100×50</p><p class="text-[12px]/4 tabular-nums text-zinc-600">6,500 kg · received 6,500</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹4,41,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS flat 40×6</p><p class="text-[12px]/4 tabular-nums text-zinc-600">2,200 kg · received 2,200</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹1,54,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS round bar 20 mm</p><p class="text-[12px]/4 tabular-nums text-zinc-600">3,100 kg · received 3,100</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹2,17,000</span>
        </div>
        <div class="flex items-center justify-between gap-4 py-3">
          <div class="min-w-0"><p class="truncate text-[13px]/5 font-medium">MS square tube 40×40</p><p class="text-[12px]/4 tabular-nums text-zinc-600">900 kg · received 900</p></div>
          <span class="shrink-0 text-[13px]/5 tabular-nums">₹34,000</span>
        </div>
      </div>

      <div class="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <span class="text-[13px]/5 text-zinc-600">Total <span class="font-medium tabular-nums text-zinc-900">₹18,42,000</span></span>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Done</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'reference', name: 'Reference panel', code:
`<!-- Read-only, nothing to submit, so the only control is a close button and
     there is no autofocus anywhere: focus opens on Close, which is the one thing
     in the panel that cannot cost the user anything. max-w-sm, because a list of
     four short pairs stretched to a form's width reads as a form with the fields
     missing. -->
<div data-kui="dialog/reference" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="keyboard" class="size-4"></i>Shortcuts
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="keys-title"
         class="flex max-h-[80vh] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <h2 id="keys-title" class="text-[16px]/6 font-semibold">Keyboard shortcuts</h2>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
</div>` },

      { id: 'submitting', name: 'In flight, and not twice', tagNew: true, code:
`<!-- The dialog stops being dismissible for exactly as long as its own POST is
     running. Escape and the backdrop are gated on busy, and the close button is
     disabled, because a dismissal in that window tells the user they cancelled
     something the server is already doing — and the receipt posts anyway.

     busy is set from htmx:beforeRequest and cleared from htmx:afterRequest, not
     from afterSwap. afterRequest fires on every ending there is, including a
     500, a timeout and an abort, so the panel cannot be left permanently
     undismissable by a request that failed. Closing on success is the same
     event, guarded on detail.successful: a failed submit leaves the panel open
     with everything the user typed still in it.

     Three things stop the second post and they stop different second posts.
     hx-disabled-elt takes the submit button out while the request runs; hx-sync
     with this:drop throws away a submit raised from a field with Enter, which
     the disabled button never sees; and the server is idempotent on the GRN
     number, because neither of the first two survives a lost connection.

     One owner per disabled attribute. htmx disables the button that fires the
     request, and Alpine disables the two that dismiss, because they are off for
     the same reason Escape is and go back on from the same event. Two owners
     writing the same attribute is how a control ends up permanently disabled by
     whichever of them lost the race.

     The fields are not disabled. htmx has already collected the values, so
     disabling them would be safe, and it would still be wrong: a form greying
     out under the user reads as the form being taken away, when the truth is
     that it is being sent.

     The wait is written into a status line that is in the footer at rest with
     nothing in it. A live region created at the moment it has something to say
     is a live region that says nothing. Below sm it takes a line of its own:
     sharing 390px with two buttons either truncates the sentence or leaves the
     primary hanging on a row by itself. -->
<div data-kui="dialog/submitting" x-data="{ open: false, busy: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="package-check" class="size-4"></i>Post GRN
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open"
       @keydown.escape.window="if (!busy) open = false"
       @click.self="if (!busy) open = false"
       @htmx:before-request.camel="busy = true"
       @htmx:after-request.camel="busy = false; if ($event.detail.successful) open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="dsub-title" :aria-busy="busy"
         class="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="dsub-title" class="text-[16px]/6 font-semibold">Post GRN 1142</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">PO-24-1187 · Gujarat Polymers Ltd</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close" :disabled="busy"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:text-zinc-400 disabled:hover:bg-transparent disabled:hover:text-zinc-400">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <form hx-post="/grn/1142/post/" hx-target="#grn-1142-row" hx-swap="outerHTML"
            hx-disabled-elt="#dsub-save" hx-indicator="#dsub-save" hx-sync="this:drop"
            class="flex min-h-0 flex-1 flex-col">
        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div>
            <label for="dsub-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity accepted <span aria-hidden="true" class="text-red-600">*</span></label>
            <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="dsub-qty" name="quantity" autofocus required inputmode="decimal" value="18,400"
                     aria-describedby="dsub-qty-help"
                     class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
              <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
            </div>
            <p id="dsub-qty-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Challan says 18,400 kg. Outstanding on the order is 24,000 kg.</p>
          </div>

          <div class="mt-4">
            <label for="dsub-lr" class="mb-1.5 block text-[13px]/5 font-medium">LR number</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="dsub-lr" name="lr_number" value="VRL/2026/88214" autocomplete="off" spellcheck="false"
                     class="w-full bg-transparent px-3 py-2 font-mono text-[14px]/5 tabular-nums outline-none">
            </div>
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
          <p role="status" class="text-[12px]/4 tabular-nums text-zinc-600"
             :class="busy ? 'w-full sm:mr-auto sm:w-auto' : ''"
             x-text="busy ? 'Posting to the stock ledger…' : ''"></p>
          <button type="button" @click="open = false" :disabled="busy"
                  class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:text-zinc-400 disabled:hover:bg-white">Cancel</button>
          <button id="dsub-save" type="submit"
                  class="group inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <span class="hidden group-[.htmx-request]:inline"><i data-lucide="loader-circle" class="size-4 animate-spin"></i></span>
            <span class="grid">
              <span class="col-start-1 row-start-1 group-[.htmx-request]:invisible">Post receipt</span>
              <span class="invisible col-start-1 row-start-1 group-[.htmx-request]:visible">Posting…</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>` },

      { id: 'errors', name: 'The server said no', tagNew: true, code:
`<!-- What the panel looks like after a submit came back rejected. The dialog is
     still open, every value the user typed is still in it, and the reasons are
     the server's — the outstanding balance and the duplicate LR number are
     facts the browser does not hold and cannot check.

     htmx does not swap a 4xx, so the beforeSwap handler is what makes a 422
     land at all. Without it the server answers, htmx discards the answer, the
     panel sits unchanged and the user presses Save again — the quietest failure
     in this entire component. 422 and nothing else: a 500 is not a form the
     user can fix and must not be pasted into the panel.

     The swap replaces the body, not the panel, so the header, the trap and the
     open state survive it. Replacing the whole panel throws away the Alpine
     component that is holding the dialog open.

     Focus goes to the summary and not to the first bad field. The summary names
     every field that failed and links to each one; a field names only itself,
     and the user arrives at the second problem by surprise. It is the only
     thing on this variant that moves focus after a swap.

     The summary is alert/form-errors with the border one step lighter, because
     inside a white panel zinc-300 is the edge of something sitting on the page
     and this is not. Colour stays in the icon: a red field behind the text
     would shout louder than the quantity that is actually wrong. -->
<div data-kui="dialog/errors" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Record GRN 1143</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       @htmx:before-swap.camel="if ($event.detail.xhr.status === 422) $event.detail.shouldSwap = true"
       @htmx:after-swap.camel="$nextTick(() => $refs.summary && $refs.summary.focus())"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="derr-title"
         class="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="derr-title" class="text-[16px]/6 font-semibold">Record GRN 1143</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">PO-24-1187 · Gujarat Polymers Ltd</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <form hx-post="/grn/1143/" hx-target="#derr-body" hx-swap="innerHTML" class="flex min-h-0 flex-1 flex-col">
        <div id="derr-body" class="min-h-0 flex-1 overflow-y-auto px-5 py-4">

          <div x-ref="summary" role="alert" tabindex="-1"
               class="rounded-lg border border-zinc-200 px-4 py-3 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <div class="flex items-start gap-3">
              <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
              <div class="min-w-0">
                <p class="text-[13px]/5 font-medium tabular-nums">The receipt was not posted — 2 fields need attention.</p>
                <ul class="mt-2 space-y-1 text-[12px]/4 text-zinc-600">
                  <li><a href="#derr-qty" class="font-medium text-zinc-900 underline underline-offset-2">Quantity accepted</a> — <span class="tabular-nums">1,200 kg</span> more than the order has outstanding.</li>
                  <li><a href="#derr-lr" class="font-medium text-zinc-900 underline underline-offset-2">LR number</a> — already booked on GRN 1139.</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <label for="derr-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity accepted <span aria-hidden="true" class="text-red-600">*</span></label>
            <div class="flex items-center rounded-lg border border-red-600 bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15">
              <input id="derr-qty" name="quantity" required inputmode="decimal" value="25,200"
                     aria-invalid="true" aria-describedby="derr-qty-msg"
                     class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
              <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
            </div>
            <p id="derr-qty-msg" class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
              <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
              <span class="tabular-nums">Outstanding on PO-24-1187 is 24,000 kg. Raise an amendment to receive more.</span>
            </p>
          </div>

          <div class="mt-4">
            <label for="derr-lr" class="mb-1.5 block text-[13px]/5 font-medium">LR number</label>
            <div class="rounded-lg border border-red-600 bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15">
              <input id="derr-lr" name="lr_number" value="VRL/2026/88214" autocomplete="off" spellcheck="false"
                     aria-invalid="true" aria-describedby="derr-lr-msg"
                     class="w-full bg-transparent px-3 py-2 font-mono text-[14px]/5 tabular-nums outline-none">
            </div>
            <p id="derr-lr-msg" class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
              <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
              <span class="tabular-nums">Booked on GRN 1139 on 14 Aug 2026.</span>
            </p>
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
          <button type="button" @click="open = false"
                  class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
          <button type="submit"
                  class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Post receipt</button>
        </div>
      </form>
    </div>
  </div>
</div>` },

      { id: 'deferred', name: 'Body fetched after it opens', tagNew: true, code:
`<!-- The panel opens on the click and the body arrives afterwards, because the
     row already knows the item and the balances are a query. Waiting for the
     response before showing anything is the alternative, and it is worse: the
     button appears to do nothing for as long as the request takes.

     The title comes from the row, so the dialog is labelled from the first
     frame. A panel whose aria-labelledby points into content that has not
     arrived is an unlabelled dialog for the length of the request.

     Alpine decides when to fetch and htmx does the fetching, because Alpine
     does not fetch. The request is a custom event dispatched at the moment the
     panel opens. loaded is set from htmx:afterSwap rather than from the click,
     so a failed fetch leaves it false and the next open tries again, while a
     successful one is never fetched twice for the life of the page.

     The skeleton is the shape of the answer — three rows of a balance, not a
     grey rectangle. A centred panel is centred on its own height, so one that
     grows when the data lands moves everything in it, including the close
     button the user was already reaching for. It is aria-hidden, and the
     sr-only line beside it is what a reader entering the panel is told while
     it is busy.

     createIcons runs once at load and never sees markup that arrives in a swap,
     so there is no <i data-lucide> in what the server sends. What comes back is
     rows of words and figures. -->
<div data-kui="dialog/deferred"
     x-data="{
       open: false, loaded: false, failed: false,
       show() {
         this.open = true;
         if (!this.loaded) this.$refs.body.dispatchEvent(new CustomEvent('dialog-fetch'));
       },
       retry() { this.failed = false; this.$refs.body.dispatchEvent(new CustomEvent('dialog-fetch')) }
     }"
     @htmx:after-swap.camel="loaded = true; failed = false"
     @htmx:response-error.camel="failed = true">
  <button type="button" @click="show()"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="warehouse" class="size-4 text-zinc-600"></i>Stock at other plants
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="ddef-title"
         class="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="ddef-title" class="truncate text-[16px]/6 font-semibold">MS angle 50×50×6</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">Item 1042-MSA-5006 · stock as at 21 Aug 2026</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-2">
        <div x-ref="body" x-show="!failed"
             hx-get="/items/1042-MSA-5006/stock/" hx-trigger="dialog-fetch"
             hx-swap="innerHTML" hx-sync="this:drop"
             :aria-busy="!loaded">
          <span x-show="!loaded" class="sr-only">Loading stock at other plants</span>
          <div class="animate-pulse py-1" aria-hidden="true">
            <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3.5">
              <div class="h-2.5 w-32 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
            </div>
            <div class="flex items-center justify-between gap-4 border-b border-zinc-100 py-3.5">
              <div class="h-2.5 w-24 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-16 rounded bg-zinc-200"></div>
            </div>
            <div class="flex items-center justify-between gap-4 py-3.5">
              <div class="h-2.5 w-28 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-20 rounded bg-zinc-200"></div>
            </div>
          </div>
        </div>

        <div x-show="failed" x-cloak class="py-4">
          <div class="flex items-start gap-3">
            <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
            <div class="min-w-0">
              <p class="text-[13px]/5 font-medium">Could not read the plant balances.</p>
              <p class="mt-1 text-[12px]/4 text-zinc-600">The item itself is fine — this is the stock service.</p>
            </div>
          </div>
          <button type="button" @click="retry()"
                  class="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="rotate-ccw" class="size-3.5 text-zinc-600"></i>Try again
          </button>
        </div>
      </div>

      <div class="flex shrink-0 justify-end border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Close</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'steps', name: 'Three steps in one panel', tagNew: true, code:
`<!-- A sequence short enough that leaving and coming back is not a thing anybody
     needs to do. Three steps is the ceiling: past that the user wants a URL per
     step and a server that remembers, which is form-page/wizard.

     The heading of each step takes focus when the step changes, through
     tabindex="-1" on it. Without that, Continue moves the whole body and leaves
     focus on a button that has just relabelled itself, so a keyboard user hears
     nothing and a screen reader user is still standing on step one. It keeps
     the ordinary focus outline rather than hiding it with outline-none: the
     user pressed a key to get here and the mark says where they landed.

     The dialog keeps its name across all three steps. aria-labelledby points at
     the header title, which is the record, not at the step heading, which
     changes — a dialog that renames itself twice mid-flow is announced as three
     different dialogs.

     The rail is progress/steps: one progressbar over the whole strip rather
     than three, with aria-valuetext saying "Step 2 of 3" because the number a
     bar computes on its own is a percentage nobody asked for. Done is zinc-700,
     the step in hand is zinc-400 and what is ahead is zinc-200 — a stage is a
     position in a sequence, not a state, so no colour goes near it.

     The step heading is the 11px uppercase label rather than another 13px
     medium line, because the two field labels under it are 13px medium and a
     heading that measures the same as the things it heads is not a heading.

     The width never changes between steps and the body is capped at the panel
     height, so the dialog grows downward and only until 80vh. Every step is in
     the DOM from the start under x-show, which is why the two that are hidden
     at first paint carry x-cloak. -->
<div data-kui="dialog/steps"
     x-data="{
       open: false, step: 1, last: 3,
       go(n) { this.step = n; this.$nextTick(() => this.$refs.head.focus()) }
     }">
  <button type="button" @click="open = true; step = 1"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="corner-up-left" class="size-4 text-zinc-600"></i>Return to vendor
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="dstep-title"
         class="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="shrink-0 border-b border-zinc-200 px-5 py-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 id="dstep-title" class="text-[16px]/6 font-semibold">Return to Sharma Extrusions</h2>
            <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">GRN 1142 · MS plate 10 mm · <span x-text="'Step ' + step + ' of 3'"></span></p>
          </div>
          <button type="button" @click="open = false" aria-label="Close"
                  class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>

        <div class="mt-3 flex gap-1" role="progressbar" aria-labelledby="dstep-title"
             :aria-valuenow="step" aria-valuemin="1" aria-valuemax="3"
             :aria-valuetext="'Step ' + step + ' of 3'">
          <span class="h-1.5 flex-1 rounded-full" :class="step > 1 ? 'bg-zinc-700' : 'bg-zinc-400'"></span>
          <span class="h-1.5 flex-1 rounded-full" :class="step > 2 ? 'bg-zinc-700' : step === 2 ? 'bg-zinc-400' : 'bg-zinc-200'"></span>
          <span class="h-1.5 flex-1 rounded-full" :class="step === 3 ? 'bg-zinc-400' : 'bg-zinc-200'"></span>
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <h3 x-ref="head" tabindex="-1"
            x-text="step === 1 ? 'What is going back' : step === 2 ? 'How it is going back' : 'Check and raise'"
            class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"></h3>

        <div x-show="step === 1" class="mt-3">
          <label for="dstep-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity returned <span aria-hidden="true" class="text-red-600">*</span></label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <input id="dstep-qty" autofocus required inputmode="decimal" value="640" aria-describedby="dstep-qty-help"
                   class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
            <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
          </div>
          <p id="dstep-qty-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">4,000 kg received on GRN 1142, none issued yet.</p>

          <label for="dstep-reason" class="mt-4 mb-1.5 block text-[13px]/5 font-medium">Reason <span aria-hidden="true" class="text-red-600">*</span></label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <select id="dstep-reason" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
              <option>Thickness under tolerance</option>
              <option>Rust on receipt</option>
              <option>Damaged in transit</option>
              <option>Wrong grade supplied</option>
            </select>
          </div>
        </div>

        <div x-show="step === 2" x-cloak class="mt-3">
          <label for="dstep-lr" class="mb-1.5 block text-[13px]/5 font-medium">Outward LR number</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <input id="dstep-lr" value="VRL/2026/88377" autocomplete="off" spellcheck="false"
                   class="w-full bg-transparent px-3 py-2 font-mono text-[14px]/5 tabular-nums outline-none">
          </div>

          <label for="dstep-date" class="mt-4 mb-1.5 block text-[13px]/5 font-medium">Dispatch date <span aria-hidden="true" class="text-red-600">*</span></label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <input id="dstep-date" type="date" required value="2026-08-23" class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
          </div>
          <p class="mt-1.5 text-[12px]/4 text-zinc-500">The gate pass prints against this date.</p>
        </div>

        <dl x-show="step === 3" x-cloak class="mt-3 divide-y divide-zinc-100">
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Quantity</dt>
            <dd class="text-[13px]/5 font-medium tabular-nums">640 kg</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Reason</dt>
            <dd class="text-right text-[13px]/5 font-medium">Thickness under tolerance</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Outward LR</dt>
            <dd class="text-[13px]/5 font-medium tabular-nums">VRL/2026/88377</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Debit note value</dt>
            <dd class="text-[13px]/5 font-medium tabular-nums">₹49,920</dd>
          </div>
        </dl>
      </div>

      <div class="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" x-show="step > 1" x-cloak @click="go(step - 1)"
                class="mr-auto rounded-lg px-4 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Back</button>
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="step === last ? open = false : go(step + 1)"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <span x-text="step === last ? 'Raise debit note' : 'Continue'"></span>
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'stacked', name: 'A second dialog over the first', tagNew: true, code:
`<!-- The material is not in the list, so the panel that needs it opens the panel
     that creates it. Two deep is the limit — a third is a screen, and a screen
     has a URL somebody can send.

     .noscroll is on the outer trap only. The plugin compensates for the
     scrollbar it removes by writing a padding onto the documentElement; a
     second noscroll activating over the first measures the scrollbar as already
     gone, writes 0px, and the dimmed page behind shifts by its width — then
     back again when the inner panel closes. The inner trap is a plain x-trap.

     Nothing else is needed to make the nesting work. focus-trap keeps one
     shared stack, so activating the inner trap pauses the outer one and
     deactivating it resumes the outer and returns focus to the button that
     opened it.

     Escape is stopped at the inner overlay rather than guarded on a flag in the
     outer handler. Both handlers are on window and both fire, and by the time
     the outer one reads the flag the inner one has already cleared it — one
     press closing both panels. .stop keeps the event off window entirely.

     The inner overlay covers the viewport, so while it is open a click anywhere
     outside the second panel — including over the first — dismisses the second
     and only the second. Its backdrop carries the same zinc-900/40 as the
     first, and the two compound: that deeper field is the only thing telling
     the user the first panel is not what they are working on. -->
<div data-kui="dialog/stacked" x-data="{ open: false, inner: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="plus" class="size-4"></i>Add a line
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="dstack-title"
         class="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="dstack-title" class="text-[16px]/6 font-semibold">Add a line to PO-24-1187</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">Sharma Extrusions · rate contract RC-2026-14</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <label for="dstack-item" class="mb-1.5 block text-[13px]/5 font-medium">Material <span aria-hidden="true" class="text-red-600">*</span></label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="dstack-item" autofocus required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option>MS angle 50×50×6</option>
            <option>MS plate 10 mm</option>
            <option>MS channel 100×50</option>
          </select>
        </div>
        <button type="button" @click="inner = true"
                class="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px]/4 font-medium text-zinc-900 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="plus" class="size-3.5 text-zinc-600"></i>Material not in the list
        </button>

        <label for="dstack-qty" class="mt-4 mb-1.5 block text-[13px]/5 font-medium">Quantity <span aria-hidden="true" class="text-red-600">*</span></label>
        <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="dstack-qty" required inputmode="decimal" value="2,500"
                 class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
          <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
        </div>
      </div>

      <div class="flex shrink-0 flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Add line</button>
      </div>

      <!-- the second panel: plain x-trap, and Escape stops here rather than reaching window -->
      <div x-show="inner" x-cloak x-trap="inner" @keydown.escape.stop="inner = false" @click.self="inner = false"
           class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
        <div role="dialog" aria-modal="true" aria-labelledby="dstack-new-title"
             class="flex max-h-[80vh] w-full max-w-sm flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
          <div class="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
            <h2 id="dstack-new-title" class="text-[16px]/6 font-semibold">New material</h2>
            <button type="button" @click="inner = false" aria-label="Close"
                    class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="x" class="size-4"></i>
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <label for="dstack-new-desc" class="mb-1.5 block text-[13px]/5 font-medium">Description <span aria-hidden="true" class="text-red-600">*</span></label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="dstack-new-desc" autofocus required value="MS flat 60×8"
                     class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            </div>

            <label for="dstack-new-hsn" class="mt-4 mb-1.5 block text-[13px]/5 font-medium">HSN code <span aria-hidden="true" class="text-red-600">*</span></label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="dstack-new-hsn" required inputmode="numeric" value="7216" aria-describedby="dstack-new-hsn-help"
                     class="w-full bg-transparent px-3 py-2 font-mono text-[14px]/5 tabular-nums outline-none">
            </div>
            <p id="dstack-new-hsn-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Sets the GST rate on every order for this material.</p>
          </div>

          <div class="flex shrink-0 flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
            <button type="button" @click="inner = false"
                    class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
            <button type="button" @click="inner = false"
                    class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Create and select</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>` },

      { id: 'wide', name: 'Wide enough to compare', tagNew: true, code:
`<!-- max-w-3xl, and the content is the argument for it. Three quotes against one
     requisition are read across, not down: the rate on one is only a fact next
     to the rate on the other two, and at max-w-md they stack into a list where
     the comparison is something the user has to do from memory.

     3xl is the last width in the entry. Anything that wants more is a screen —
     a comparison of eight quotes, or one with a line-item breakdown per vendor,
     is a page with a URL somebody can send to the approver.

     The tiles are radio/cards, unchanged: :has() paints each tile from its own
     radio, the radio stays visible so forced-colours mode still shows what was
     chosen, and the focus indication is an outline on the tile because a 3px
     ring drawn round a 16px circle lands on top of the circle.

     The rule inside each tile is zinc-300 and not the zinc-100 divider, because
     a chosen tile takes the zinc-200 fill and a zinc-100 line on zinc-200 is a
     line you can only find by looking for it. Zinc-300 holds on both fills, and
     it is the same colour the tinted-shape ring already uses.

     The vendor line under each name is one line and truncates. Wrapped to two
     on the longest name, it pushes that tile's figures a line lower than the
     other two, and rows that do not start at the same height are not a
     comparison — which is the only reason this panel is 3xl in the first place.

     It stacks to one column below sm, which is what makes this legal on a
     phone. It is still a poor thing to do on a phone, and the fix is not in
     this component: a comparison that matters at 390px is a screen of its own. -->
<div data-kui="dialog/wide" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="git-compare" class="size-4 text-zinc-600"></i>Compare 3 quotes
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="dwide-title"
         class="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="dwide-title" class="text-[16px]/6 font-semibold">Award RFQ-26-0142</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">MS plate 10 mm · 40 MT · required at Waluj by 12 Sep 2026</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <fieldset>
          <legend class="mb-2 text-[13px]/5 font-medium">Award the order to</legend>
          <div class="grid gap-2 sm:grid-cols-3">
            <label class="rounded-xl border border-zinc-200 bg-white p-3 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-200 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
              <span class="flex items-start gap-2.5">
                <input type="radio" name="dwide-award" value="gpl" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
                <span class="min-w-0">
                  <span class="block truncate text-[13px]/5 font-medium">Gujarat Polymers Ltd</span>
                  <span class="mt-0.5 block truncate text-[12px]/4 tabular-nums text-zinc-500">Vapi · 18 Aug</span>
                </span>
              </span>
              <dl class="mt-3 space-y-1.5 border-t border-zinc-300 pt-2.5">
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Rate</dt><dd class="text-[13px]/5 font-medium tabular-nums">₹78.40 / kg</dd></div>
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Landed</dt><dd class="text-[13px]/5 font-medium tabular-nums">₹32,68,000</dd></div>
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Delivery</dt><dd class="text-[12px]/4 tabular-nums">08 Sep 2026</dd></div>
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Terms</dt><dd class="text-[12px]/4 tabular-nums">45 days</dd></div>
              </dl>
            </label>

            <label class="rounded-xl border border-zinc-200 bg-white p-3 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-200 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
              <span class="flex items-start gap-2.5">
                <input type="radio" name="dwide-award" value="nst" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
                <span class="min-w-0">
                  <span class="block truncate text-[13px]/5 font-medium">Nashik Steel Traders</span>
                  <span class="mt-0.5 block truncate text-[12px]/4 tabular-nums text-zinc-500">Nashik · 18 Aug</span>
                </span>
              </span>
              <dl class="mt-3 space-y-1.5 border-t border-zinc-300 pt-2.5">
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Rate</dt><dd class="text-[13px]/5 font-medium tabular-nums">₹77.10 / kg</dd></div>
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Landed</dt><dd class="text-[13px]/5 font-medium tabular-nums">₹32,14,000</dd></div>
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Delivery</dt><dd class="flex items-center gap-1.5 text-[12px]/4 tabular-nums"><i data-lucide="alert-triangle" class="size-3.5 shrink-0 text-amber-700"></i>19 Sep 2026</dd></div>
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Terms</dt><dd class="text-[12px]/4 tabular-nums">30 days</dd></div>
              </dl>
            </label>

            <label class="rounded-xl border border-zinc-200 bg-white p-3 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-200 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
              <span class="flex items-start gap-2.5">
                <input type="radio" name="dwide-award" value="sex" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
                <span class="min-w-0">
                  <span class="block truncate text-[13px]/5 font-medium">Sharma Extrusions</span>
                  <span class="mt-0.5 block truncate text-[12px]/4 tabular-nums text-zinc-500">Aurangabad · 19 Aug</span>
                </span>
              </span>
              <dl class="mt-3 space-y-1.5 border-t border-zinc-300 pt-2.5">
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Rate</dt><dd class="text-[13px]/5 font-medium tabular-nums">₹79.90 / kg</dd></div>
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Landed</dt><dd class="text-[13px]/5 font-medium tabular-nums">₹33,04,000</dd></div>
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Delivery</dt><dd class="text-[12px]/4 tabular-nums">05 Sep 2026</dd></div>
                <div class="flex items-baseline justify-between gap-2"><dt class="text-[12px]/4 text-zinc-600">Terms</dt><dd class="text-[12px]/4 tabular-nums">45 days</dd></div>
              </dl>
            </label>
          </div>
        </fieldset>

        <p class="mt-3 text-[12px]/4 tabular-nums text-zinc-500">Quoted against RFQ-26-0142 in August 2026. Landed value includes freight and 18% GST on 40 MT.</p>
      </div>

      <div class="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <a href="/rfq/26-0142/" class="mr-auto text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Open the full comparison</a>
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Award and raise PO</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'phone', name: 'Full screen at 390px', tagNew: true, code:
`<!-- Below sm the panel stops being a card and becomes the screen: no corners,
     no border, no backdrop showing round the edges. A floating panel with 16px
     of dimmed page round it on a 390px phone is 358px of form wearing a frame,
     and the frame is what the fields lose.

     h-dvh on the overlay rather than inset-0 alone. A fixed inset-0 element
     resolves against the large viewport, so on a phone the bottom of it — the
     footer, which is where the primary button lives — sits under the browser
     chrome until the user scrolls the chrome away. dvh tracks the chrome coming
     and going, and it tracks the soft keyboard too: the field carries autofocus,
     the keyboard opens with the panel, and the body scrolls inside whatever
     height is left instead of the footer going under it. Above sm the overlay
     reverts to h-auto and the panel centres as a card again.

     The footer buttons go full width and stack with flex-col-reverse, which
     puts the primary above Cancel without moving it in the DOM: the source
     order is Cancel then Save at every width, so the tab order does not change
     when the layout does. Reversing in CSS is what lets the thumb reach the
     primary first while the keyboard still meets the safe control first.

     This is the shape for a form on a phone. A short list of actions on a phone
     is a drawer — it rises from the bottom edge, where the thumb already is,
     and it does not pretend to be a page. A form long enough to scroll for more
     than a screen and a half is not this either: give it a URL and use
     form-page. -->
<div data-kui="dialog/phone" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="triangle-alert" class="size-4"></i>Report a shortfall
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex h-dvh items-stretch justify-center bg-zinc-900/40 sm:h-auto sm:items-center sm:p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="dphone-title"
         class="flex w-full flex-col overflow-hidden bg-white shadow-lg sm:h-auto sm:max-h-[80vh] sm:max-w-md sm:rounded-xl sm:border sm:border-zinc-300">
      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="dphone-title" class="text-[16px]/6 font-semibold">Report a shortfall</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">GRN 1142 · MS angle 50×50×6</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <form action="/grn/1142/shortfall/" method="post" @submit.prevent="open = false" class="flex min-h-0 flex-1 flex-col">
        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div>
            <label for="dphone-short" class="mb-1.5 block text-[13px]/5 font-medium">Quantity short <span aria-hidden="true" class="text-red-600">*</span></label>
            <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="dphone-short" name="short_qty" autofocus required inputmode="decimal" value="320"
                     aria-describedby="dphone-short-help"
                     class="w-full bg-transparent px-3 py-2.5 text-right text-[14px]/5 tabular-nums outline-none">
              <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
            </div>
            <p id="dphone-short-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Challan 4,200 kg, weighbridge 3,880 kg.</p>
          </div>

          <div class="mt-4">
            <label for="dphone-cause" class="mb-1.5 block text-[13px]/5 font-medium">Cause <span aria-hidden="true" class="text-red-600">*</span></label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <select id="dphone-cause" name="cause" required class="w-full bg-transparent px-3 py-2.5 text-[14px]/5 outline-none">
                <option>Short loaded at vendor works</option>
                <option>Weighbridge difference</option>
                <option>Spillage in transit</option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <label for="dphone-note" class="mb-1.5 block text-[13px]/5 font-medium">Note for the vendor</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <textarea id="dphone-note" name="note" rows="3" class="w-full resize-y bg-transparent px-3 py-2.5 text-[14px]/5 outline-none">Weighbridge slip 88214 attached at the gate.</textarea>
            </div>
          </div>
        </div>

        <div class="flex shrink-0 flex-col-reverse gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3 sm:flex-row sm:justify-end">
          <button type="button" @click="open = false"
                  class="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:w-auto sm:py-2">Cancel</button>
          <button type="submit"
                  class="w-full rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:w-auto sm:py-2">Report shortfall</button>
        </div>
      </form>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'sheet', name: 'Sheet', category: 'feedback',
    description: 'A panel that slides in from the right edge, full height and a fixed width, over a list that stays visible behind it. Where one row of a register is read, amended, or walked one record to the next without giving up your place in the list.',
    when: 'A row of the list behind it — read it, filter the list that produced it, amend a few fields on it, or step through the queue one record at a time. The three panels divide by edge and by job, and the edge is the tell: a sheet comes from the right and is about a row in the list still visible beside it, a dialog centres and interrupts the whole page to take a handful of fields, a drawer rises from the bottom because a thumb is holding the phone. If the user has to edit a lot, send them to a page instead — a sheet is too narrow for a long form and they will fight the width. If they walk more than a handful of records, the screen wanted list-detail, where the queue is beside the record rather than underneath it.',
    notes: [
      'Full width below sm, fixed width above it. A 448px sheet on a 390px phone is a horizontal scrollbar.',
      'Three widths and no more. sm:w-96 for a column of filters, sm:w-[28rem] for a record, sm:w-[32rem] where the body carries lines with figures on the right. Past that the panel has covered the list it exists to leave visible, and the record wanted a page.',
      'The body scrolls, the header and footer do not. overflow-y-auto goes on the middle section only.',
      'Escape and backdrop both close it, same as a dialog — unless there is unsaved work, which is the one case that changes and is the whole subject of the unsaved variant.',
      'x-trap.noscroll on the backdrop, the same as the dialog and the alert dialog: Tab stays inside the panel, focus returns to the row that opened it on close, and the list behind stops scrolling.',
      'The sheet opens on the click, not on the response. Everything in the header came off the row that was clicked — the order number, the vendor, the value — so it can be drawn before anything is fetched, and the body is the only region that waits. Holding the panel shut until the response lands reads as a click that did nothing, and at three seconds it gets clicked a second time.',
      'The swap target is the body, never the panel. An htmx swap that replaces the panel takes out the element x-trap is holding, and the trap is left pointing at a node that is no longer in the document: focus falls to the body and the next Tab walks into the list behind. Swap the inside of the scrolling region and leave the header, the footer and the trap alone.',
      'A sheet with unsaved work has four ways out, not one. Escape, the backdrop, the close button and Cancel are four separate handlers, so guarding three of them leaves the fourth to lose the work — and the fourth is the one the user finds. Write the guard once as a method and call it from all four.',
      'Nested traps stack. @alpinejs/focus bundles one copy of focus-trap and every trap it creates shares one stack, so activating the inner trap pauses the outer one, and deactivating it resumes the outer and returns focus to the control that opened the inner. The inner panel takes plain x-trap without noscroll: the page is already locked by the outer trap, and a second lock would only record the locked state and restore it.',
      'Two levels is the limit, and the second one has to be narrower than the first. A third panel over the second leaves three headers stacked down the right edge, none of which says which record it belongs to, and the way back out is three Escapes deep.',
      'One escape handler and one truth. Two @keydown.escape.window handlers on a stacked sheet both fire on the same press and both levels close, which is a keyboard user pressing Escape once to dismiss the top panel and losing the record underneath it as well. Keep both flags in one x-data on the root and branch inside a single handler.',
      'motion-reduce:transition-none and motion-reduce:duration-0 ride along on both x-transition class lists. Alpine puts the panel in its final position by removing translate-x-full itself rather than waiting on a transitionend, so killing the transition still lands the sheet open — it just gets there in one frame. duration-0 is the second half of it: Alpine reads the computed transition-duration to decide how long to hold the element before hiding it, so without it the backdrop would sit on screen for another 150ms after the panel had already gone.',
      'None of the transition classes are in the stylesheet when the page first paints, because they live in x-transition attributes and the browser build scans class attributes only. That is not a defect and it does not want a safelist. Tailwind compiles a class when Alpine writes it onto the element, and Alpine holds translate-x-full on the panel for a frame before taking it off again, which is long enough for the rule to exist before the start style is read. Measured on this page: ten eased frames between 100% and 0 with motion allowed, and two values with nothing in between under prefers-reduced-motion. Check it by reading the translate property and not transform, because Tailwind v4 compiles translate-x-full to the independent translate property and transform stays none the whole way, which reads as a dead animation when it is nothing of the sort.'
    ],
    anatomy: [
      ['Backdrop', 'The same dimmed field as a dialog, dismissing on @click.self and carrying x-trap.noscroll to hold focus and lock the list behind.'],
      ['Panel', 'Anchored right, full height, full width below sm and a fixed width above it. border-l-zinc-300, the edge token anything sitting over the page takes.'],
      ['Header', 'What the row already knew — the record number, its name, the vendor — and a close button. Fixed, and drawn before the body has loaded anything.'],
      ['Pager', 'Previous, next and the position in the queue — "2 of 3 awaiting approval" — on a second line of the header, where it stays reachable after the body has been scrolled.'],
      ['Body', 'The only scrolling section — overflow-y-auto goes here and nowhere else. The one region that waits on the server, and the only thing a swap replaces.'],
      ['Footer', 'The actions for the record. Fixed, so they are reachable from anywhere in a long body.'],
      ['Guard', 'The alert dialog that stands between a dirty sheet and every one of its exits. It traps focus itself, dims the panel rather than the page, and offers three answers.']
    ],
    behaviour: [
      'It slides in from the right and the list stays visible behind it, which is the whole point of choosing a sheet.',
      'Full width below sm. A 448px panel on a 390px phone is a horizontal scrollbar.',
      'Escape and a backdrop click both close it, the same as a dialog.',
      'The body scrolls independently; the header and footer do not move.',
      'Tab stays inside the panel while it is open. The list behind is visible but not reachable, and it does not scroll.',
      'The panel opens with what the row already knew and the body fills in behind it. While it waits the body carries aria-busy and a skeleton the size of the answer, and the footer actions are drawn disabled rather than left out, so nothing moves when the record lands.',
      'A load that fails says so inside the panel and leaves the panel open. Closing itself would put the user back where they started with nothing said, and the click they are about to make is the same one that just failed.',
      'While there is unsaved work, Escape, the backdrop, the close button and Cancel all raise the same guard instead of closing. Saving clears it, and from then on all four close as usual.',
      'The pager walks the queue without closing the panel: the body changes under a pointer that has not moved, and the list behind does not scroll. Focus still returns to the row that opened the sheet, which after a walk is not the record on screen — mark the row you ended on as current in the list behind, or the keyboard lands back somewhere the user has already left.',
      'A second sheet opens over the first, narrower and on the same edge, with the first still legible beside it. Escape closes the second and leaves the first open.',
      'At 390px the panel is the screen. The title wraps instead of truncating, each pair in the body stacks label over value, and the footer actions become full-width buttons stacked with flex-col-reverse — the commit directly under the record it acts on, the secondary between it and the bottom edge, and the source order unchanged so the keyboard still reaches the safe one first.',
      'Under prefers-reduced-motion the panel appears in place instead of sliding across.',
      'For heavy editing, send the user to a page. A sheet is too narrow for a long form and they will fight the width.'
    ],
    a11y: [
      'role="dialog" with aria-modal="true", labelled by the record name in the header.',
      'Focus enters the panel on open and returns to the row that opened it on close — x-trap does both.',
      'Focus is trapped while open, or Tab walks into the list behind and the user is lost.',
      'Focus lands on the close button, the first focusable element in the panel and the one that costs nothing to press — except where the sheet exists to be typed into, where autofocus on the first field takes it instead and x-trap honours that.',
      'The close button carries aria-label="Close".',
      'aria-busy goes on the scrolling body while it waits, because that is the region that will hold the answer and it survives the swap, and one sr-only role="status" names the record being loaded. The status line sits outside the aria-hidden pulse wrapper, or it is hidden along with the grey bars and the wait is announced to nobody.',
      'The pager announces through an sr-only role="status" carrying the record that has arrived. The h2 is the panel\'s accessible name and is not made a live region: announcing the dialog again on every step buries the one fact that changed.',
      'A pager button that disables itself under the finger drops focus to the body and out of the trap, because that is what a browser does with a disabled element. The handler hands focus to the sibling that is still live before the last step disables it — the same handoff pagination makes at the ends of a register.',
      'The guard over a dirty sheet is role="alertdialog" with aria-describedby on the sentence naming what would be lost, it traps focus itself, and autofocus puts the keyboard on the safe answer. Escape inside it means Keep editing, never Discard.',
      'A stacked sheet keeps both traps: the inner one pauses the outer while it is open and hands focus back to the row in the first panel that opened it. The inner panel is a second role="dialog" with its own aria-labelledby, so it is announced by name rather than as a second copy of the first.',
      'The slide transition respects prefers-reduced-motion, through motion-reduce:transition-none and motion-reduce:duration-0 on both x-transition class lists. The panel still ends up open and in place; it just does not travel.'
    ],
    related: ['dialog', 'drawer', 'alert-dialog', 'list-detail', 'table'],
    variants: [
      { id: 'record', name: 'Record detail', code:
`<!-- The default shape, and the one every other variant is a state of. A row of
     the register was clicked, the panel came in from the right, and the list is
     still there behind it.

     Everything in the header came off that row, so none of it waits on a query:
     the order number, the name of the lot, the vendor and who raised it. The
     body holds the facts that needed reading, as a definition list rather than
     as a form, because nothing here is editable and a row of bordered inputs
     showing values that cannot be changed is the most reliable way to get
     somebody to try.

     The receipt rail is a real progressbar with all three bounds written out
     and a valuetext, because the reading is kilograms and not per cent — a bar
     with aria-valuenow="7800" and the implicit maximum of 100 is announced at
     seventy-eight times its value.

     The footer is fixed so Record GRN is reachable from anywhere in the body.
     Print does not close the sheet: the print dialog opens over it and the
     panel is still the thing being printed from. -->
<div data-kui="sheet/record" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open PO-24-1187</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-[28rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <p class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase tabular-nums">PO-24-1187</p>
          <h2 id="sheet-title" class="mt-0.5 truncate text-[16px]/6 font-semibold">MS angles and plates — August lot</h2>
          <p class="mt-1 truncate text-[12px]/4 text-zinc-600">Sharma Extrusions · raised 04 Aug 2024 by Ritu Deshpande</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <dl class="divide-y divide-zinc-100">
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Status</dt>
            <dd class="text-[13px]/5 font-medium"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300"><span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved</span></dd>
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
            <p id="sheet-grn-progress" class="text-[13px]/5 font-medium">Received against GRN</p>
            <p class="text-[13px]/5 font-medium tabular-nums">7,800 / 12,000 kg</p>
          </div>
          <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200"
               role="progressbar" aria-labelledby="sheet-grn-progress"
               aria-valuenow="7800" aria-valuemin="0" aria-valuemax="12000"
               aria-valuetext="7,800 of 12,000 kg received">
            <div class="h-full min-w-[2px] rounded-full bg-zinc-700" style="width: 65%"></div>
          </div>
          <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">Last receipt GRN 1142 on 16 Aug 2024.</p>
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Print order</button>
        <button type="button" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Record GRN</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'filters', name: 'Filters for the list behind', code:
`<!-- The other thing a sheet is for. The filters belong to the list, so the
     list stays on screen while they are chosen, and the count on the trigger is
     what says the list on screen is not the whole register.

     The panel is narrower than a record sheet — sm:w-96 — because a column of
     fields does not need 448px and the extra width is taken off the list.

     Nothing applies as it is typed. Every control here changes the query, and a
     register that refetches on each keystroke of a vendor name is four requests
     the user did not ask for and a list that moves under a half-finished
     thought. Apply is the commit and Reset is the way back.

     Raised between is a fieldset with a legend rather than a label pointed at
     the first input, or the from field is announced as "Raised between" and the
     to field as nothing at all. The legend names the pair and each input carries
     its own end of it.

     Every field is a wrapper drawing the outline for the control inside it, so
     the ₹ prefix sits inside the focus outline rather than beside it, and the
     control itself takes outline-none — the input-group rule, applied to a
     filter column. -->
<div data-kui="sheet/filters" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="sliders-horizontal" class="size-4"></i>Filters
    <span class="rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium tabular-nums ring-1 ring-inset ring-zinc-300">2</span>
    <span class="sr-only">filters applied</span>
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="filters-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-96">

      <div class="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <h2 id="filters-title" class="text-[16px]/6 font-semibold">Filter orders</h2>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
          <label class="flex items-center gap-2.5 text-[14px]/5"><input type="checkbox" checked class="size-4 accent-zinc-700">Open</label>
          <label class="mt-2 flex items-center gap-2.5 text-[14px]/5"><input type="checkbox" class="size-4 accent-zinc-700">Approved</label>
          <label class="mt-2 flex items-center gap-2.5 text-[14px]/5"><input type="checkbox" class="size-4 accent-zinc-700">Closed</label>
        </fieldset>

        <fieldset class="mt-4">
          <legend class="mb-1.5 text-[13px]/5 font-medium">Raised between</legend>
          <div class="flex flex-wrap items-center gap-2">
            <div class="min-w-[8rem] flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="f-from" aria-label="Raised from" type="date" value="2024-08-01" class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
            </div>
            <span class="text-[13px]/5 text-zinc-500">to</span>
            <div class="min-w-[8rem] flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="f-to" aria-label="Raised to" type="date" value="2024-08-31" class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
            </div>
          </div>
        </fieldset>

        <div class="mt-4">
          <label for="f-min" class="mb-1.5 block text-[13px]/5 font-medium">Minimum value</label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
            <input id="f-min" inputmode="numeric" value="1,00,000" class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
          </div>
        </div>

        <label class="mt-4 flex items-center gap-2.5 text-[14px]/5">
          <input type="checkbox" checked class="size-4 accent-zinc-700">Only orders with a pending GRN
        </label>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" class="rounded-lg px-4 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reset</button>
        <button type="button" @click="open = false"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Apply filters</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'loading', name: 'Open before the record arrives', tagNew: true, code:
`<!-- The panel is open and the record is not here yet. That is a state, not a
     gap: the sheet opens on the click, because a click that produces nothing
     for three seconds gets clicked again, and the second click is what opens
     two sheets or posts two requests.

     What is drawn for real is what the row already knew — the order number, the
     vendor, the line count and the value all came off the row that was clicked,
     so none of them is waiting on anything. Greying them out flashes the record
     away and lands it again, which reads as a navigation that went wrong, and
     it costs the only question the user has at this moment: am I on the right
     order.

     The skeleton is the shape of the definition list that is coming — five
     pairs at the same py-2.5 on the same divide-y, and the receipt card at the
     same padding on the same border — so nothing moves when the values land.
     Bars are bg-zinc-200 and carry no ring: a ring makes each one read as an
     empty input box, and five empty input boxes in a panel is a form.

     The footer actions are drawn and disabled rather than left out. Appearing on
     arrival takes a strip off the bottom of the body, which shortens the scroll
     region under somebody who has already started reading it.

     aria-busy goes on the body, because the body is the region that will hold
     the answer and the attribute has to survive the swap. The sr-only
     role="status" naming the wait is a sibling of the pulse wrapper rather than
     inside it — the wrapper is aria-hidden, and a status inside it is announced
     to nobody. -->
<div data-kui="sheet/loading" x-data="{ open: false }">
  <div class="max-w-md overflow-hidden rounded-xl border border-zinc-300 bg-white">
    <p class="border-b border-zinc-200 px-4 py-2.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Awaiting approval</p>
    <button type="button" @click="open = true"
            class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span class="min-w-0">
        <span class="block truncate text-[13px]/5 font-medium tabular-nums">PO-24-1187</span>
        <span class="block truncate text-[12px]/4 text-zinc-600">Sharma Extrusions · 6 lines</span>
      </span>
      <span class="shrink-0 text-[13px]/5 font-medium tabular-nums">₹18,42,000</span>
    </button>
  </div>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-loading-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-[28rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="sheet-loading-title" class="truncate text-[16px]/6 font-semibold tabular-nums">PO-24-1187</h2>
          <p class="mt-1 truncate text-[12px]/4 tabular-nums text-zinc-600">Sharma Extrusions · 6 lines · ₹18,42,000</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4" aria-busy="true">
        <p role="status" class="sr-only">Loading purchase order PO-24-1187</p>

        <div class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
          <div class="flex h-6 items-center"><div class="h-3 w-56 max-w-full rounded bg-zinc-200"></div></div>

          <div class="mt-3 divide-y divide-zinc-100">
            <div class="flex items-center justify-between gap-4 py-2.5">
              <div class="flex h-5 items-center"><div class="h-2.5 w-14 rounded bg-zinc-200"></div></div>
              <div class="flex h-5 items-center"><div class="h-5 w-20 rounded-full bg-zinc-200"></div></div>
            </div>
            <div class="flex items-center justify-between gap-4 py-2.5">
              <div class="flex h-5 items-center"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div>
              <div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div>
            </div>
            <div class="flex items-center justify-between gap-4 py-2.5">
              <div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div>
              <div class="flex h-5 items-center"><div class="h-2.5 w-28 rounded bg-zinc-200"></div></div>
            </div>
            <div class="flex items-center justify-between gap-4 py-2.5">
              <div class="flex h-5 items-center"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div>
              <div class="flex h-5 items-center"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div>
            </div>
            <div class="flex items-center justify-between gap-4 py-2.5">
              <div class="flex h-5 items-center"><div class="h-2.5 w-16 rounded bg-zinc-200"></div></div>
              <div class="flex h-5 items-center"><div class="h-2.5 w-32 rounded bg-zinc-200"></div></div>
            </div>
          </div>

          <div class="mt-5 rounded-lg border border-zinc-200 px-4 py-3">
            <div class="flex items-center justify-between gap-3">
              <div class="flex h-5 items-center"><div class="h-2.5 w-36 rounded bg-zinc-200"></div></div>
              <div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div>
            </div>
            <div class="mt-2 h-1.5 w-full rounded-full bg-zinc-200"></div>
            <div class="mt-2 flex h-4 items-center"><div class="h-2 w-44 max-w-full rounded bg-zinc-200"></div></div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" disabled
                class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[13px]/5 font-medium text-zinc-400">Print order</button>
        <button type="button" disabled
                class="rounded-lg border border-zinc-300 bg-zinc-200 px-4 py-2 text-[13px]/5 font-medium text-zinc-400">Record GRN</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'failed', name: 'The record did not load', tagNew: true, code:
`<!-- The panel stays open and says what happened. Closing itself is the wrong
     move twice over: the user is looking at the sheet, so the failure would
     happen off screen, and the row they would land back on is the one they
     just clicked, so the next thing they do is click it again.

     Three things belong in the copy and only the first is usually written. What
     failed, in words. Whether anything was changed, which is the question
     anybody who pressed a button is actually asking. And a reference support can
     search for, because "the sheet broke" is not a ticket.

     The footer holds Retry and the way out to the page. Unlike the loading
     state, the record actions are not drawn disabled here — a greyed-out Record
     GRN says the user is not allowed to record one, when the truth is that the
     order was never read. There is no record to act on yet, so there are no
     record actions.

     The link out is the important half. The panel is a convenience over a page
     that already exists, and that page is a fresh request through a different
     path — it works often enough when the fragment does not that it is worth
     offering before the third Retry.

     Graphite well, red glyph, no field of colour. A red panel makes a timeout
     look like the order was lost. -->
<div data-kui="sheet/failed" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open PO-24-1191</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-failed-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-[28rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="sheet-failed-title" class="truncate text-[16px]/6 font-semibold tabular-nums">PO-24-1191</h2>
          <p class="mt-1 truncate text-[12px]/4 tabular-nums text-zinc-600">Gujarat Polymers Ltd · 4 lines · ₹6,18,500</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <div class="flex flex-col items-center py-10 text-center">
          <span class="flex size-10 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300">
            <i data-lucide="alert-circle" class="size-5 text-red-600"></i>
          </span>
          <h3 class="mt-3 text-[14px]/5 font-semibold">This order did not load</h3>
          <p class="mt-1.5 text-[13px]/5 text-zinc-600">
            The request timed out after 30 seconds. Nothing was changed and no approval was recorded — this is the panel failing to read the order, not the order failing to exist.
          </p>
          <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">Reference 8f21c4 · 21 Aug 2026, 11:04</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <a href="/orders/PO-24-1191/"
           class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open the full order</a>
        <button type="button"
                class="inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="rotate-cw" class="size-4"></i>Retry
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'form', name: 'A few fields and a commit', tagNew: true, code:
`<!-- A sheet that is written into rather than read. Four fields is about the
     ceiling: past that the panel is a form page in 448px, and the user is
     scrolling a column while the record it belongs to is hidden behind the
     panel.

     The <form> is inside the panel and wraps the body and the footer both, so
     Save is a real submit button — Enter from any field commits, and the browser
     runs its own validation before anything is posted. The alternative, a
     button in the footer pointing at the form with form="...", needs an id that
     has to stay unique on a page that may render this sheet in every row of a
     register. role="dialog" stays on the panel and not on the form: a form
     carrying a dialog role stops being announced as a form.

     Autofocus is on the first field, which x-trap honours over the close button.
     This panel exists to be typed into, so landing on the X wastes a Tab; a
     panel that only gets read does the opposite, which is the record variant.

     Help text is tied on with aria-describedby rather than being read as part
     of the label. "Revised delivery date Original commitment 28 Aug 2024" is
     not the name of a field.

     Cancel is a button and not a link, and it sits before Save in the source so
     the tab order reaches the safe one first. Neither closes the panel when
     there is unsaved work in it — that guard is the next variant. -->
<div data-kui="sheet/form" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="calendar-clock" class="size-4"></i>Amend delivery
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-form-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-[28rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="sheet-form-title" class="text-[16px]/6 font-semibold">Amend delivery schedule</h2>
          <p class="mt-1 truncate text-[12px]/4 tabular-nums text-zinc-600">PO-24-1187 · Sharma Extrusions · line 4</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="open = false">
        <div class="flex-1 overflow-y-auto px-5 py-4">
          <div>
            <label for="sf-date" class="mb-1.5 block text-[13px]/5 font-medium">Revised delivery date</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="sf-date" type="date" value="2026-09-04" autofocus aria-describedby="sf-date-help"
                     class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
            </div>
            <p id="sf-date-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Original commitment was 28 Aug 2026.</p>
          </div>

          <div class="mt-4">
            <label for="sf-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity moved</label>
            <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="sf-qty" inputmode="decimal" value="4,200" aria-describedby="sf-qty-help"
                     class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
              <span class="border-l border-zinc-200 px-3 py-2 text-[13px]/5 text-zinc-600">kg</span>
            </div>
            <p id="sf-qty-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Of 12,000 kg ordered, 7,800 kg already received.</p>
          </div>

          <div class="mt-4">
            <label for="sf-reason" class="mb-1.5 block text-[13px]/5 font-medium">Reason</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <select id="sf-reason" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
                <option selected>Vendor plant shutdown</option>
                <option>Transport delay</option>
                <option>Raw material short</option>
                <option>Rescheduled by buyer</option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <label for="sf-note" class="mb-1.5 block text-[13px]/5 font-medium">Note to the vendor</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <textarea id="sf-note" rows="3" class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none">Balance to be dispatched ex-Nashik in one lot.</textarea>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
          <button type="button" @click="open = false"
                  class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
          <button type="submit"
                  class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save amendment</button>
        </div>
      </form>
    </div>
  </div>
</div>` },

      { id: 'unsaved', name: 'Leaving with work in it', tagNew: true, code:
`<!-- A sheet has four exits and a dirty one has to guard all four. Escape, the
     backdrop, the close button and Cancel are four separate handlers, so
     guarding three of them leaves the fourth to throw the work away — and since
     the backdrop is the largest click target on the screen, the fourth is the
     one that gets found. attempt() is written once and called from all four.

     The guard is an alert dialog, not a second sheet, and its three answers are
     alert-dialog/unsaved: keep editing, discard, save. A two-way choice is what
     makes people press the destructive one to get out of the panel. What this
     variant owns is not the question, it is the routing of every exit through
     it.

     The scrim covers the panel and not the page. The question is about this
     sheet, and dimming the whole window a second time says the whole window is
     blocked when the list behind was already unreachable.

     It carries its own x-trap, or Tab walks back into the fields underneath the
     question. @alpinejs/focus keeps one stack of traps, so the inner one pauses
     the sheet\'s trap while it is up and hands focus back to the control that
     raised it on the way out. autofocus is on Keep editing: the safe answer is
     where the keyboard should land, and Escape inside the guard means the same
     thing.

     Both flags live in one x-data on the root, so one window handler decides
     what Escape means. Two handlers and a single press closes the guard and the
     sheet together, which is exactly the loss the guard was written to stop.

     dirty starts true here so the state can be read; in a real screen it is set
     by @input on the form, which is also wired below, and cleared by the save. -->
<div data-kui="sheet/unsaved"
     x-data="{
       open: false, dirty: true, ask: false,
       attempt() { this.dirty ? this.ask = true : this.open = false },
       discard() { this.ask = false; this.dirty = false; this.open = false },
       save() { this.ask = false; this.dirty = false; this.open = false }
     }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Edit GRN 1142</button>

  <div x-show="open" x-cloak x-trap.noscroll="open"
       @keydown.escape.window="ask ? ask = false : attempt()" @click.self="attempt()"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-unsaved-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="relative flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-[28rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="sheet-unsaved-title" class="truncate text-[16px]/6 font-semibold tabular-nums">GRN 1142</h2>
          <div class="mt-1.5 flex flex-wrap items-center gap-2">
            <p class="truncate text-[12px]/4 tabular-nums text-zinc-600">PO-24-1187 · received 16 Aug 2026</p>
            <span x-show="dirty" x-cloak
                  class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Unsaved changes
            </span>
          </div>
        </div>
        <button type="button" @click="attempt()" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <form class="flex min-h-0 flex-1 flex-col" @input="dirty = true" @submit.prevent="save()">
        <div class="flex-1 overflow-y-auto px-5 py-4">
          <div>
            <label for="su-qty" class="mb-1.5 block text-[13px]/5 font-medium">Accepted quantity</label>
            <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="su-qty" inputmode="decimal" value="3,940" autofocus aria-describedby="su-qty-help"
                     class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
              <span class="border-l border-zinc-200 px-3 py-2 text-[13px]/5 text-zinc-600">kg</span>
            </div>
            <p id="su-qty-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Challan says 4,000 kg. 60 kg short-received.</p>
          </div>

          <div class="mt-4">
            <label for="su-reason" class="mb-1.5 block text-[13px]/5 font-medium">Short receipt reason</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <textarea id="su-reason" rows="3" class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none">Two bundles rejected at gate — visible rust. Debit note to follow.</textarea>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
          <button type="button" @click="attempt()"
                  class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
          <button type="submit"
                  class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save receipt</button>
        </div>
      </form>

      <div x-show="ask" x-cloak x-trap="ask"
           class="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900/40 p-4">
        <div role="alertdialog" aria-modal="true" aria-labelledby="sheet-unsaved-guard" aria-describedby="sheet-unsaved-guard-body"
             class="w-full max-w-md rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
          <h3 id="sheet-unsaved-guard" class="text-[14px]/5 font-semibold">Close without saving?</h3>
          <p id="sheet-unsaved-guard-body" class="mt-1.5 text-[13px]/5 tabular-nums text-zinc-600">
            GRN 1142 has a changed accepted quantity and a short receipt reason. Closing now loses both.
          </p>
          <div class="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" @click="ask = false" autofocus
                    class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Keep editing</button>
            <button type="button" @click="discard()"
                    class="rounded-lg px-3 py-1.5 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Discard changes</button>
            <button type="button" @click="save()"
                    class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save and close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>` },

      { id: 'walk', name: 'Next record without closing', tagNew: true, code:
`<!-- An approvals queue worked one record at a time. Closing the panel to click
     the next row costs a close, a scroll and a click per record, and thirty
     records in, the user is opening them from the top of the list again because
     they have lost which ones they did.

     The pager is in the header rather than the footer, so it is still on screen
     after the body has been scrolled, and it says where in the queue the record
     is. Approve advances as well as approving, because in a queue the next
     record is what the user wanted anyway; on the last one it closes instead.

     Focus does not move on a step. The pointer and the keyboard both stay on
     the control that was pressed and the body changes underneath — that is what
     makes the walk fast. What does move is the body\'s scroll position, back to
     the top on every step, or record four opens halfway down because record
     three was read to the bottom.

     The ends disable rather than disappear, so nothing shifts sideways between
     two presses, and enabled:hover: keeps a disabled arrow from lighting up
     under the cursor. Pressing into the last record disables the button under
     the finger, and a browser blurs a disabled element to the body — which here
     means out of the focus trap entirely — so the handler hands focus to the
     other arrow first. That is the same handoff pagination makes at the ends of
     a register, and it matters more here because there is a trap to fall out of.

     The announcement is an sr-only role="status", not the h2. The h2 is the
     panel\'s accessible name, and making it live re-announces the whole dialog
     on every step.

     Closing still returns focus to the row that opened the sheet, which after a
     walk is not the record on screen. Mark the row you ended on as current in
     the list behind, or the keyboard lands somewhere the user left ten records
     ago. -->
<div data-kui="sheet/walk"
     x-data="{
       open: false, i: 0,
       rows: [
         { po: 'PO-24-1187', title: 'MS angles and plates — August lot', vendor: 'Sharma Extrusions', raised: '04 Aug 2026', value: '₹18,42,000', terms: '45 days from GRN', due: '28 Aug 2026', ship: 'Plant 2, Waluj MIDC' },
         { po: 'PO-24-1191', title: 'HDPE granules — blow moulding', vendor: 'Gujarat Polymers Ltd', raised: '07 Aug 2026', value: '₹6,18,500', terms: '30 days from invoice', due: '02 Sep 2026', ship: 'Plant 1, Silvassa' },
         { po: 'PO-24-1204', title: 'Bearing housings — machined', vendor: 'Nashik Steel Traders', raised: '11 Aug 2026', value: '₹2,74,300', terms: 'Against delivery', due: '19 Sep 2026', ship: 'Plant 2, Waluj MIDC' }
       ],
       step(d) { this.i += d; this.\$refs.body.scrollTop = 0 },
       prev() { this.step(-1); if (this.i === 0) this.\$refs.next.focus() },
       next() { this.step(1); if (this.i === this.rows.length - 1) this.\$refs.prev.focus() },
       approve() { this.i < this.rows.length - 1 ? this.next() : this.open = false }
     }">
  <div class="max-w-md overflow-hidden rounded-xl border border-zinc-300 bg-white">
    <p class="border-b border-zinc-200 px-4 py-2.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Awaiting approval</p>
    <div class="divide-y divide-zinc-100">
      <template x-for="(r, n) in rows" :key="r.po">
        <button type="button" @click="i = n; open = true"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <span class="min-w-0">
            <span class="block truncate text-[13px]/5 font-medium tabular-nums" x-text="r.po"></span>
            <span class="block truncate text-[12px]/4 text-zinc-600" x-text="r.vendor"></span>
          </span>
          <span class="shrink-0 text-[13px]/5 font-medium tabular-nums" x-text="r.value"></span>
        </button>
      </template>
    </div>
  </div>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-walk-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-[28rem]">

      <div class="border-b border-zinc-200 px-5 py-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase tabular-nums" x-text="rows[i].po">PO-24-1187</p>
            <h2 id="sheet-walk-title" class="mt-0.5 truncate text-[16px]/6 font-semibold" x-text="rows[i].title">MS angles and plates — August lot</h2>
            <p class="mt-1 truncate text-[12px]/4 tabular-nums text-zinc-600" x-text="rows[i].vendor + ' · raised ' + rows[i].raised">Sharma Extrusions · raised 04 Aug 2026</p>
          </div>
          <button type="button" @click="open = false" aria-label="Close"
                  class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>

        <div class="mt-3 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
          <p class="text-[12px]/4 tabular-nums text-zinc-600"><span x-text="i + 1">1</span> of <span x-text="rows.length">3</span> awaiting approval</p>
          <div class="flex items-center gap-1">
            <button type="button" x-ref="prev" @click="prev()" :disabled="i === 0" aria-label="Previous order"
                    class="flex size-7 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="chevron-up" class="size-4"></i>
            </button>
            <button type="button" x-ref="next" @click="next()" :disabled="i === rows.length - 1" aria-label="Next order"
                    class="flex size-7 items-center justify-center rounded-lg border border-zinc-200 bg-white enabled:hover:bg-zinc-100 disabled:text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="chevron-down" class="size-4"></i>
            </button>
          </div>
        </div>
      </div>

      <div x-ref="body" class="flex-1 overflow-y-auto px-5 py-4">
        <p role="status" class="sr-only" x-text="rows[i].po + ', ' + rows[i].title"></p>
        <dl class="divide-y divide-zinc-100">
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Status</dt>
            <dd class="text-[13px]/5 font-medium"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300"><span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Awaiting approval</span></dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Order value</dt>
            <dd class="text-[13px]/5 font-medium tabular-nums" x-text="rows[i].value">₹18,42,000</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Payment terms</dt>
            <dd class="text-[13px]/5 font-medium" x-text="rows[i].terms">45 days from GRN</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Delivery by</dt>
            <dd class="text-[13px]/5 font-medium tabular-nums" x-text="rows[i].due">28 Aug 2026</dd>
          </div>
          <div class="flex items-baseline justify-between gap-4 py-2.5">
            <dt class="text-[13px]/5 text-zinc-600">Ship to</dt>
            <dd class="text-right text-[13px]/5 font-medium" x-text="rows[i].ship">Plant 2, Waluj MIDC</dd>
          </div>
        </dl>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button"
                class="rounded-lg px-4 py-2 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reject</button>
        <button type="button" @click="approve()"
                class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve and next</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'stacked', name: 'A second sheet over the first', tagNew: true, code:
`<!-- The receipt behind a line on the order. Opening it as a page loses the
     order, and opening it in place turns the sheet into a stack of collapsible
     sections that all have to be scrolled past afterwards. A second panel on
     the same edge keeps both: the GRN is the subject and the order it belongs
     to is still legible to the left of it.

     The second panel is narrower than the first, so the first is not completely
     covered. Equal widths and the second one lands exactly on the first, which
     reads as the same panel repainting rather than as a second thing on top.

     Two is the limit. A third leaves three headers stacked down the right edge,
     none of which says which record it belongs to, and the way out is three
     Escapes deep. If the GRN needs its own child, it needed a page.

     Both flags live in one x-data on the root and one window handler decides
     what Escape means, because two @keydown.escape.window handlers both fire on
     one press and close both levels — a keyboard user dismissing the receipt
     loses the order underneath it too.

     The inner trap is plain x-trap with no noscroll. @alpinejs/focus keeps one
     stack of traps, so activating it pauses the outer one and deactivating it
     resumes the outer and returns focus to the row that opened the child. The
     page is already locked by the outer trap; a second lock would only record
     the locked state and restore it.

     The child\'s backdrop is absolute inside the fixed overlay, so it dims the
     order panel as well as the page — the order is context now, not something
     to be clicked — and it is a real @click.self dismiss, the same as the
     first. -->
<div data-kui="sheet/stacked" x-data="{ open: false, child: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open PO-24-1187</button>

  <div x-show="open" x-cloak x-trap.noscroll="open"
       @keydown.escape.window="child ? child = false : open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">

    <div role="dialog" aria-modal="true" aria-labelledby="sheet-stacked-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-[32rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="sheet-stacked-title" class="truncate text-[16px]/6 font-semibold tabular-nums">PO-24-1187</h2>
          <p class="mt-1 truncate text-[12px]/4 tabular-nums text-zinc-600">Sharma Extrusions · 7,800 of 12,000 kg received</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <p class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Receipts against this order</p>
        <div class="mt-2 divide-y divide-zinc-100 overflow-hidden rounded-lg border border-zinc-200">
          <button type="button" @click="child = true"
                  class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <span class="min-w-0">
              <span class="block truncate text-[13px]/5 font-medium tabular-nums">GRN 1142</span>
              <span class="block truncate text-[12px]/4 tabular-nums text-zinc-600">16 Aug 2026 · gate entry 4471</span>
            </span>
            <span class="shrink-0 text-[13px]/5 font-medium tabular-nums">3,940 kg</span>
          </button>
          <button type="button" @click="child = true"
                  class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <span class="min-w-0">
              <span class="block truncate text-[13px]/5 font-medium tabular-nums">GRN 1118</span>
              <span class="block truncate text-[12px]/4 tabular-nums text-zinc-600">09 Aug 2026 · gate entry 4402</span>
            </span>
            <span class="shrink-0 text-[13px]/5 font-medium tabular-nums">3,860 kg</span>
          </button>
        </div>
        <p class="mt-3 text-[12px]/4 tabular-nums text-zinc-500">4,200 kg still to be received against this order.</p>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Record GRN</button>
      </div>
    </div>

    <div x-show="child" x-cloak x-trap="child" @click.self="child = false"
         class="absolute inset-0 z-10 flex justify-end bg-zinc-900/40">
      <div role="dialog" aria-modal="true" aria-labelledby="sheet-stacked-grn"
           x-show="child"
           x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:enter-start="translate-x-full"
           x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
           x-transition:leave-end="translate-x-full"
           class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-96">

        <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
          <div class="min-w-0">
            <h2 id="sheet-stacked-grn" class="truncate text-[16px]/6 font-semibold tabular-nums">GRN 1142</h2>
            <p class="mt-1 truncate text-[12px]/4 tabular-nums text-zinc-600">Against PO-24-1187 · 16 Aug 2026</p>
          </div>
          <button type="button" @click="child = false" aria-label="Close"
                  class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="x" class="size-4"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-5 py-4">
          <dl class="divide-y divide-zinc-100">
            <div class="flex items-baseline justify-between gap-4 py-2.5">
              <dt class="text-[13px]/5 text-zinc-600">Challan quantity</dt>
              <dd class="text-[13px]/5 font-medium tabular-nums">4,000 kg</dd>
            </div>
            <div class="flex items-baseline justify-between gap-4 py-2.5">
              <dt class="text-[13px]/5 text-zinc-600">Accepted</dt>
              <dd class="text-[13px]/5 font-medium tabular-nums">3,940 kg</dd>
            </div>
            <div class="flex items-baseline justify-between gap-4 py-2.5">
              <dt class="text-[13px]/5 text-zinc-600">QC</dt>
              <dd class="text-[13px]/5 font-medium"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300"><span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Passed</span></dd>
            </div>
            <div class="flex items-baseline justify-between gap-4 py-2.5">
              <dt class="text-[13px]/5 text-zinc-600">Inspected by</dt>
              <dd class="text-right text-[13px]/5 font-medium">A. Kulkarni</dd>
            </div>
          </dl>
          <p class="mt-4 text-[12px]/4 text-zinc-500">Two bundles rejected at gate — visible rust. Debit note to follow.</p>
        </div>

        <div class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
          <button type="button" @click="child = false"
                  class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Back to the order</button>
          <a href="/grn/1142/"
             class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open GRN 1142</a>
        </div>
      </div>
    </div>
  </div>
</div>` },

      { id: 'phone', name: 'At 390px', tagNew: true, code:
`<!-- The same sheet where the panel is the whole screen. Three things change and
     all three are about the bottom of the screen being where the hand is.

     The footer stacks and the buttons go full width, because two 96px buttons
     pinned to the right of a 390px panel are a target the thumb has to reach
     across the screen for. flex-col-reverse rather than flex-col so the source
     order does not change with the breakpoint: the secondary action stays first
     in the DOM, where tab order and a screen reader reach it before the commit,
     while on screen the commit sits directly under the record it acts on and
     the secondary takes the bottom edge, which is where a mis-tap lands. Above
     sm the same two go back to a row, primary last.

     The title wraps instead of truncating. At 448px a truncated lot name is a
     minor annoyance; at 390px it eats the part that tells two lots apart, and
     there is no page behind the panel to read it off. A header two lines tall on
     a phone is cheaper than a record nobody can identify.

     Each pair in the body stacks label over value below sm. A baseline row with
     the label left and the value right works down to about 320px of panel and
     then starts hyphenating both halves against each other.

     The close control stays an X and stays top right. A back chevron would be
     the fourth thing on this screen promising the browser\'s back gesture, and
     the sheet is not a history entry — pressing the system back button while it
     is open leaves the application. It grows to 36px below sm, because 28px is a
     mouse target.

     No safe-area padding is written here. This is not a bar pinned to the bottom
     edge of the viewport; it is the foot of a fixed panel, and the browser\'s own
     chrome sits below it. -->
<div data-kui="sheet/phone" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open PO-24-1204</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-phone-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-[28rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-4 py-3.5 sm:px-5 sm:py-4">
        <div class="min-w-0">
          <p class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase tabular-nums">PO-24-1204</p>
          <h2 id="sheet-phone-title" class="mt-0.5 text-[16px]/6 font-semibold">Bearing housings — machined, September lot</h2>
          <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-600">Nashik Steel Traders · raised 11 Aug 2026</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:size-7">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
        <dl class="divide-y divide-zinc-100">
          <div class="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt class="text-[13px]/5 text-zinc-600">Status</dt>
            <dd class="text-[13px]/5 font-medium"><span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300"><span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved</span></dd>
          </div>
          <div class="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt class="text-[13px]/5 text-zinc-600">Order value</dt>
            <dd class="text-[13px]/5 font-medium tabular-nums sm:text-right">₹2,74,300</dd>
          </div>
          <div class="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt class="text-[13px]/5 text-zinc-600">Payment terms</dt>
            <dd class="text-[13px]/5 font-medium sm:text-right">Against delivery, 2% early payment discount inside 7 days</dd>
          </div>
          <div class="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt class="text-[13px]/5 text-zinc-600">Delivery by</dt>
            <dd class="text-[13px]/5 font-medium tabular-nums sm:text-right">19 Sep 2026</dd>
          </div>
          <div class="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <dt class="text-[13px]/5 text-zinc-600">Ship to</dt>
            <dd class="text-[13px]/5 font-medium sm:text-right">Plant 2, Waluj MIDC, Chhatrapati Sambhajinagar</dd>
          </div>
        </dl>
      </div>

      <div class="flex flex-col-reverse gap-2 border-t border-zinc-200 bg-zinc-100 px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
        <button type="button"
                class="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:w-auto sm:py-2">Print order</button>
        <button type="button"
                class="w-full rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:w-auto sm:py-2">Record GRN</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'htmx', name: 'Body fetched on open', tagNew: true, code:
`<!-- Alpine decides when the panel is open; htmx fetches what goes in it,
     because Alpine does not fetch. The request is a custom event dispatched at
     the moment the sheet opens, not on the row\'s mouseenter — a register full of
     rows would fetch every one the pointer crossed on the way to the button.

     The target is the body\'s inner region, and that is the rule this variant
     exists to state. Swap the panel and the swap takes out the element x-trap is
     holding: the trap comes back pointing at a node that is no longer in the
     document, focus falls to the body, and the next Tab walks into the list
     behind. The header, the footer and the trap are Alpine\'s; only the middle is
     the server\'s.

     It fetches on every open, which is where this parts company with the
     hovercard\'s fetch-once. A hovercard is a preview read in the same second it
     was opened; a record sheet is opened, closed, edited elsewhere and opened
     again twenty minutes later, and the second read has to be the current one.
     hx-sync="this:drop" throws away a request raised while one is already in
     flight, which is what a double click on the row produces.

     The skeleton is the body\'s own starting content, so the first open has the
     shape of the answer rather than an empty panel. On a refetch it is not
     re-drawn — the previous values stay legible under aria-busy until the new
     ones land, because replacing rows somebody is reading with grey bars looks
     like the record was wiped.

     failed is set from htmx:response-error and cleared by the next successful
     swap, so a timeout leaves the panel open with a way out of it. Alpine\'s
     .camel modifier is what turns htmx:after-swap in the attribute into the
     htmx:afterSwap the library really dispatches.

     Under Django the fragment is a second template rendered by the same view,
     and the footer\'s POST needs the CSRF token: put it in the body with
     {% csrf_token %} inside the form, or on the form as hx-headers. -->
<div data-kui="sheet/htmx"
     x-data="{
       open: false, busy: false, failed: false,
       show() {
         this.open = true; this.busy = true; this.failed = false;
         this.\$refs.body.dispatchEvent(new CustomEvent('sheet-fetch'));
       }
     }"
     @htmx:after-swap.camel="busy = false; failed = false"
     @htmx:response-error.camel="busy = false; failed = true">

  <button type="button" @click="show()"
          class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open PO-24-1187</button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex justify-end bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="sheet-htmx-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="translate-x-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="translate-x-full"
         class="flex h-full w-full flex-col border-l border-zinc-300 bg-white shadow-lg sm:w-[28rem]">

      <div class="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
        <div class="min-w-0">
          <h2 id="sheet-htmx-title" class="truncate text-[16px]/6 font-semibold tabular-nums">PO-24-1187</h2>
          <p class="mt-1 truncate text-[12px]/4 tabular-nums text-zinc-600">Sharma Extrusions · 6 lines · ₹18,42,000</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-5 py-4">
        <p role="status" class="sr-only" x-text="busy ? 'Loading purchase order PO-24-1187' : ''"></p>

        <div id="sheet-htmx-body" x-ref="body" x-show="!failed" :aria-busy="busy"
             hx-get="/orders/PO-24-1187/sheet/" hx-trigger="sheet-fetch"
             hx-swap="innerHTML" hx-sync="this:drop">
          <div class="animate-pulse motion-reduce:animate-none" aria-hidden="true">
            <div class="flex h-6 items-center"><div class="h-3 w-56 max-w-full rounded bg-zinc-200"></div></div>
            <div class="mt-3 divide-y divide-zinc-100">
              <div class="flex items-center justify-between gap-4 py-2.5">
                <div class="flex h-5 items-center"><div class="h-2.5 w-14 rounded bg-zinc-200"></div></div>
                <div class="flex h-5 items-center"><div class="h-5 w-20 rounded-full bg-zinc-200"></div></div>
              </div>
              <div class="flex items-center justify-between gap-4 py-2.5">
                <div class="flex h-5 items-center"><div class="h-2.5 w-20 rounded bg-zinc-200"></div></div>
                <div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div>
              </div>
              <div class="flex items-center justify-between gap-4 py-2.5">
                <div class="flex h-5 items-center"><div class="h-2.5 w-24 rounded bg-zinc-200"></div></div>
                <div class="flex h-5 items-center"><div class="h-2.5 w-28 rounded bg-zinc-200"></div></div>
              </div>
              <div class="flex items-center justify-between gap-4 py-2.5">
                <div class="flex h-5 items-center"><div class="h-2.5 w-16 rounded bg-zinc-200"></div></div>
                <div class="flex h-5 items-center"><div class="h-2.5 w-32 rounded bg-zinc-200"></div></div>
              </div>
            </div>
          </div>
        </div>

        <div x-show="failed" x-cloak class="flex items-start gap-2.5 rounded-lg border border-zinc-200 px-4 py-3">
          <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
          <div class="min-w-0">
            <p class="text-[13px]/5 font-medium tabular-nums">Could not load PO-24-1187</p>
            <p class="mt-1 text-[12px]/4 text-zinc-600">Nothing was changed. The order itself is fine.</p>
            <button type="button" @click="show()"
                    class="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="rotate-cw" class="size-3.5 text-zinc-600"></i>Try again
            </button>
          </div>
        </div>
      </div>

      <form hx-post="/orders/PO-24-1187/grn/" hx-target="#sheet-htmx-body" hx-swap="innerHTML"
            class="flex flex-wrap justify-end gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Close</button>
        <button type="submit" :disabled="busy || failed"
                class="rounded-lg border border-transparent bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:hover:bg-zinc-200">Record GRN</button>
      </form>
    </div>
  </div>
</div>` }
    ]
  },

  {
    id: 'drawer', name: 'Drawer', category: 'feedback',
    description: 'A panel flush to a horizontal edge of the viewport, sized to its content and capped short of the screen. The phone-shaped place to put a short action list, a quick filter, one record being edited, or the tray a multi-select fills.',
    when: 'Mobile-first screens that need a few actions, a quick filter, a short list picked from, or one field taken without leaving the register. The four edges are already allocated: the bottom is this component, the top is this component when a software keyboard is going to cover the bottom, a full-height panel on the right is a sheet, and a full-height panel on the left is the app shell\'s own off-canvas navigation in sidebar/mobile. The centre is a dialog. On a desktop a bar across the bottom of a wide window is not a panel, it is a shelf — reach for sheet or dialog instead.',
    notes: [
      'The grab handle is a visual affordance and nothing more. There is no drag or swipe handler in this markup: the panel closes on a backdrop click, on Escape, or on a control inside it. Ship it as decoration or ship a real gesture, but do not tell the user to pull something that does not move.',
      'Cap the height with max-h-[calc(100dvh-6rem)] and let the body scroll inside via min-h-0 flex-1 overflow-y-auto. A panel that reaches the top of the screen has stopped being a panel, and a page deserves a URL.',
      'dvh, not vh. On a phone the browser chrome comes and goes and vh does not notice, so a vh-capped panel spends half its life under the address bar. The same unit is what makes the panel behave when the software keyboard opens: dvh shrinks, the cap re-evaluates, the body scrolls, and the footer stays above the keyboard instead of under it.',
      'The same backdrop idiom as dialog and sheet — x-trap.noscroll for the focus trap, the return of focus and the scroll lock, @click.self to dismiss, escape on the window. There is nothing special about being at the bottom.',
      'translate-y-full is the start and the end state, and motion-reduce:transition-none plus motion-reduce:duration-0 ride along on both x-transition class lists. The second one matters as much as the first: Alpine reads the computed transition-duration to decide how long to keep the element on screen before hiding it, so without it the backdrop lingers after the panel has gone.',
      'Full width and flush to the bottom edge, rounded on the top two corners only, with sm:max-w-md so it does not stretch into a stripe on a laptop. The bottom corners are square because there is nothing behind them.',
      'Rows in an action list are buttons at py-3, not py-1.5 menu items. This is being tapped by a thumb, not clicked by a mouse.',
      'Pick the edge by what is going to cover the panel and what is going to press it. A panel of tap targets goes to the bottom, where the thumb already is. A panel whose first control is a text field goes to the top, because the bottom third of a phone belongs to the software keyboard the moment that field takes focus. Moving to the top edge is four swaps that all have to travel together — items-start for items-end, -translate-y-full for translate-y-full, rounded-b-2xl for rounded-t-2xl, border-b for border-t — and the handle is dropped rather than flipped.',
      'A skeleton inside a drawer is holding a size, not filling a wait. The panel is sized by its content and pinned to an edge, so a short placeholder swapped for a long list grows the panel away from that edge and moves everything the user was about to press. Draw the placeholder at the height of the answer.',
      'A drawer with something typed into it does not close on a backdrop click. The backdrop is the easiest gesture on a phone to make by accident — the panel is full-bleed, the thumb rests at the edge of the screen, and the strip above the panel is a live dismiss target the whole time. Track dirty and ask in the drawer\'s own footer.',
      'Do not stack an alert dialog on an open drawer to ask that question. Two nested x-traps both want to return focus on close, and the one that runs last wins, so focus lands on the drawer\'s trigger while the drawer is still open. The footer is already fixed and already under the thumb; put the two answers there. When there is a real third answer — save and close — the whole interaction belongs to alert-dialog/unsaved instead, on a page rather than under a panel.',
      'Not every drawer is a dialog. A tray that reports a selection is a region: no backdrop, no aria-modal, no focus trap, no Escape handler, because the list behind it has to keep working while it is open. Give that shape sticky bottom-0 in the flow of the panel it belongs to rather than fixed inset-x-0 — a fixed tray covers the last row of its own list, and the padding-bottom every screen then grows to compensate never matches its height.'
    ],
    anatomy: [
      ['Backdrop', 'The same dimmed field as a dialog, dismissing on @click.self and carrying x-trap.noscroll. items-end is the only difference — it parks the panel on the bottom edge, and items-start moves it to the top.'],
      ['Handle', 'A 36×4 zinc-300 bar centred above the header, aria-hidden. It says "this thing came from the bottom"; it does not do anything, and a panel that came from the top does not get one.'],
      ['Panel', 'Full width, rounded-t-2xl, as tall as its content and never taller than calc(100dvh-6rem).'],
      ['Header', 'The record or the question, and a close button. Does not scroll.'],
      ['Body', 'The actions or the fields. The only scrolling section, and only once the content outgrows the cap.'],
      ['Footer', 'Present when there is something to apply or cancel. Fixed, so the primary action never scrolls out from under the thumb, and the place the discard question is asked when there is one.'],
      ['Tray', 'The non-modal form of the panel: sticky bottom-0, in the flow of the list it reports on, with a name and a live count instead of a title and a close button.']
    ],
    behaviour: [
      'It rises from the bottom edge, and the page it came from stays visible above it.',
      'The panel is as tall as its content. Past calc(100dvh-6rem) it stops growing and the body scrolls inside, with the handle, header and footer staying put.',
      'Escape closes it, a backdrop click closes it, and the controls inside close it. Dragging the handle does not, because nothing is bound to a drag.',
      'Once anything has been typed into it, neither Escape nor the backdrop closes it. The first press asks the question in the footer and the second backs out of the question, so there is no key that loses the text.',
      'Opening moves focus into the panel: onto the control marked autofocus where there is one, otherwise onto the close button.',
      'Tab and Shift+Tab cycle inside the panel only, and the page behind does not scroll while it is open.',
      'Closing returns focus to the control that opened it.',
      'Content that is fetched arrives into a placeholder the height of the answer, so the panel does not grow under the thumb when the response lands. A request that fails leaves the drawer open and says so inside it.',
      'Under prefers-reduced-motion the panel appears in place instead of rising.',
      'Above sm the panel stops at max-w-md and centres, still on the bottom edge. If that looks wrong on the screen you are building, the screen wanted a sheet or a dialog.',
      'The tray form does none of this. It has no backdrop and no trap, the list behind it stays clickable and scrollable, Escape is left alone, and it goes away when the selection it reports is emptied.'
    ],
    a11y: [
      'role="dialog" with aria-modal="true" and aria-labelledby pointing at the heading.',
      'x-trap.noscroll moves focus into the panel on open, keeps Tab inside it, and returns focus to the trigger on close.',
      'The filter panel opens on its first control through autofocus, which x-trap honours. The action list has nothing to type into, so focus lands on the close button, which is the one that costs nothing to press.',
      'The close button carries aria-label="Close". It is also the first focusable element in every panel here, which is what makes it the correct landing for a drawer whose body has not arrived yet.',
      'The handle is aria-hidden="true". Announcing it would promise a gesture that is not implemented.',
      'Escape closes the panel from anywhere inside it, including from within a focused field — unless the panel is dirty, in which case it asks.',
      'Fetched content lands inside one role="status" region, and the skeleton inside it is aria-hidden. The same region carries the failure, so the wait, the answer and the error are announced by one live region rather than three, and nothing is read out as a row of grey blocks.',
      'A primary action with nothing to act on yet carries the disabled attribute at first paint as well as the Alpine binding, or it is briefly live before Alpine boots.',
      'The discard question is a role="alert" strip in the footer and focus moves to the safe answer, so it is announced and answerable without hunting for it.',
      'The tray is role="region" with an aria-label, never aria-modal, and its count is aria-live="polite" — it changes on every tick, and polite is what keeps that from becoming a stream of interruptions.',
      'The rise respects prefers-reduced-motion through motion-reduce:transition-none and motion-reduce:duration-0 on both x-transition class lists. The panel still ends up open and in place; it just does not travel.'
    ],
    related: ['sheet', 'dialog', 'dropdown', 'alert-dialog'],
    variants: [
      { id: 'actions', name: 'Action list', code:
`<div data-kui="drawer/actions" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-2">
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="package-check" class="size-4 shrink-0 text-zinc-500"></i>Record GRN
        </button>
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="printer" class="size-4 shrink-0 text-zinc-500"></i>Print order
        </button>
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="send" class="size-4 shrink-0 text-zinc-500"></i>Email to vendor
        </button>
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="copy" class="size-4 shrink-0 text-zinc-500"></i>Duplicate as new order
        </button>
        <div class="my-1 border-t border-zinc-100"></div>
        <button type="button" @click="open = false"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 text-red-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="ban" class="size-4 shrink-0"></i>Cancel order
        </button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'filter', name: 'Quick filter', code:
`<div data-kui="drawer/filter" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
        <button type="button" class="rounded-lg px-4 py-2.5 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Reset</button>
        <button type="button" @click="open = false"
                class="flex-1 rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Show 24 orders</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'long', name: 'Longer than the cap', code:
`<!-- More rows than the cap allows, so the body scrolls and everything else holds still. -->
<div data-kui="drawer/long" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
                  class="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-3 text-left hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <span class="min-w-0 truncate text-[14px]/5" x-text="m.name"></span>
            <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600"><span x-text="m.rate"></span> / kg</span>
          </button>
        </template>
      </div>

      <div class="flex shrink-0 justify-end border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'loading', name: 'Fetching what it opens on', tagNew: true, code:
`<!-- The lines of an order are not in the register template, so the drawer opens
     before it has anything to show. Two things are settled here: what fills the
     gap, and why the gap is exactly that tall.

     A drawer is sized by its content and pinned to an edge, so its top edge is
     wherever the content stops. Swap a two-row placeholder for a five-row list
     and the panel grows upward: the footer holds still, everything above it
     jumps, and on a phone that happens under a thumb already on its way down.
     The placeholder is five rows at the height of five real rows for that
     reason alone. It is not scenery for the wait — it is the panel holding its
     size.

     Alpine owns open and htmx owns the request, which is the split the rest of
     the library uses and the reason there is no fetch() in the x-data. The
     request fires on a custom event dispatched when the drawer opens rather
     than from hx-trigger="click", so a drawer nobody opens costs nothing, and
     the loaded flag makes every open after the first free. In a register of
     forty rows that is the difference between forty round trips and however
     many drawers somebody actually pulled up.

     The placeholder is aria-hidden and the wait is carried by role="status" on
     the region around it — the same region the list is swapped into, so the
     wait, the answer and any failure are announced by one live region instead
     of three, and a column of grey blocks is never read out as content.

     The primary carries a real disabled attribute as well as the binding.
     :disabled alone is not applied until Alpine boots, and a button that is
     live for those few frames is one a fast thumb can press before the lines
     it acts on exist.

     x-trap puts focus on the close button, because at that moment it is the
     only focusable thing in the panel. That is the correct landing, and it is
     why the close button is first in the DOM in every drawer here. -->
<div data-kui="drawer/loading" x-data="{ open: false, loaded: false }"
     @htmx:after-swap.camel="loaded = true">
  <button type="button"
          @click="open = true; if (!loaded) $refs.lines.dispatchEvent(new CustomEvent('drawer-fetch'))"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="list" class="size-4"></i>6 lines
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="dw-lines-title"
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
          <h2 id="dw-lines-title" class="text-[16px]/6 font-semibold">Order lines</h2>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">PO-24-1187 · Sharma Extrusions</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto">
        <div x-ref="lines" role="status" :aria-busy="!loaded"
             hx-get="/orders/PO-24-1187/lines/" hx-trigger="drawer-fetch"
             hx-swap="innerHTML" hx-sync="this:drop"
             class="divide-y divide-zinc-100">
          <div class="animate-pulse" aria-hidden="true">
            <div class="flex items-center justify-between gap-4 px-5 py-3.5">
              <div class="h-2.5 w-40 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-14 shrink-0 rounded bg-zinc-200"></div>
            </div>
            <div class="flex items-center justify-between gap-4 px-5 py-3.5">
              <div class="h-2.5 w-32 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-16 shrink-0 rounded bg-zinc-200"></div>
            </div>
            <div class="flex items-center justify-between gap-4 px-5 py-3.5">
              <div class="h-2.5 w-44 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-12 shrink-0 rounded bg-zinc-200"></div>
            </div>
            <div class="flex items-center justify-between gap-4 px-5 py-3.5">
              <div class="h-2.5 w-36 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-16 shrink-0 rounded bg-zinc-200"></div>
            </div>
            <div class="flex items-center justify-between gap-4 px-5 py-3.5">
              <div class="h-2.5 w-28 rounded bg-zinc-200"></div>
              <div class="h-2.5 w-14 shrink-0 rounded bg-zinc-200"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" disabled :disabled="!loaded"
                class="flex-1 rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:hover:bg-zinc-200">Receive all lines</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'error', name: 'The content did not arrive', tagNew: true, code:
`<!-- The same drawer as the one above, after the request for its body failed.
     It is drawn statically so the shape can be read without a server behind it;
     in production this block is what the view renders on the error path and
     htmx swaps into the same region.

     The drawer stays open. Closing itself on a failure is the reflex to
     resist — the user pressed something, the panel appeared and vanished, and
     what that reads as is the press not registering, so they press again and
     fail again. Open, with a sentence in it, is the only honest ending.

     The sentence has two halves and the second is the one people are actually
     asking for: what failed, and whether anything happened to the record. A
     read that timed out changed nothing, and saying so is the difference
     between a retry and a phone call to the plant.

     The primary is gone rather than greyed out. There is nothing to disable —
     you cannot receive lines that never loaded — and a disabled Receive button
     invites the user to keep prodding the one control that cannot work.
     Retry re-requests into the same region, and the link out is the real route
     to this record, which is still there when the panel is not.

     Retry carries its own hx-get and its own target rather than re-firing the
     event the drawer dispatched when it opened. That event is already spent,
     and the flag guarding it may or may not have been set — htmx declines to
     swap a 500 at all, so a failure that arrives as a status code leaves the
     flag alone while one rendered into a 200, like this block, sets it. A
     retry that has to know which of the two happened works on one of them.

     The block sits in the region that said "loading" a moment ago, so the swap
     is what announces it. A role="alert" of its own would fire on first paint
     for anyone who lands with the error already rendered. -->
<div data-kui="drawer/error" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="list" class="size-4"></i>6 lines
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="dw-error-title"
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
          <h2 id="dw-error-title" class="text-[16px]/6 font-semibold">Order lines</h2>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">PO-24-1187 · Sharma Extrusions</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto">
        <div id="dw-error-lines" role="status" class="px-5 py-6">
          <div class="flex items-start gap-2.5">
            <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
            <div class="min-w-0">
              <p class="text-[13px]/5 font-medium">Could not load the lines</p>
              <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-600">The request timed out after 30 seconds. Nothing on PO-24-1187 was changed.</p>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button type="button"
                    hx-get="/orders/PO-24-1187/lines/" hx-target="#dw-error-lines" hx-swap="innerHTML"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="rotate-ccw" class="size-3.5 text-zinc-600"></i>Try again
            </button>
            <a href="/orders/PO-24-1187/" class="text-[13px]/5 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open the order instead</a>
          </div>
        </div>
      </div>

      <div class="flex shrink-0 justify-end border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Close</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'edit', name: 'One line, committed or discarded', tagNew: true, code:
`<!-- A drawer that edits rather than picks. Receiving against a GRN on the shop
     floor is four fields and a decision, which is a page nobody wants on a
     phone and a dialog that would sit under the keyboard on one.

     The dialog is the panel and the form is inside it, not the other way
     round. Wrapping the whole panel in a <form> puts the handle, the heading
     and the close button inside it, and a <button> inside a form with no type
     attribute is a submit button — so the close button posts the GRN. That is
     the defect this shape exists to prevent, and it is invisible until someone
     with a keyboard presses Enter or a tester presses the X. Everything that
     submits is inside the form; everything that describes or dismisses is
     outside it.

     Enter in any field submits, because the form is a real form and the
     footer\'s Save is type="submit". On a phone that matters more than on a
     desk: the software keyboard\'s go key is the shortest route out of the last
     field, and a panel where it does nothing trains people to reach past the
     keyboard for a button it is covering.

     The footer does not scroll. Four fields fit today, and the remarks box is
     one paste of a QC note away from not fitting — at which point Save has to
     still be where the thumb left it.

     Cancel discards without asking, and that is only correct here because
     nothing in this panel is expensive to retype and the row is one tap from
     reopening. The moment the content is prose somebody composed, it is the
     guarded variant instead.

     Quantities are right-aligned with tabular-nums and carry their UOM inside
     the field enclosure, so the figure and its unit share one focus outline
     rather than sitting next to each other in two boxes. -->
<div data-kui="drawer/edit" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="pencil" class="size-4"></i>Edit line 3
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="dw-edit-title"
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
          <h2 id="dw-edit-title" class="truncate text-[16px]/6 font-semibold">MS plate 10 mm</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">GRN 1142 · line 3 of 6 · ordered 12,000 kg</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <form @submit.prevent="open = false" class="flex min-h-0 flex-1 flex-col">
        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div>
            <label for="dw-edit-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity received</label>
            <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="dw-edit-qty" autofocus inputmode="decimal" value="4,200" aria-describedby="dw-edit-qty-help"
                     class="w-full bg-transparent px-3 py-2.5 text-right text-[14px]/5 tabular-nums outline-none">
              <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
            </div>
            <p id="dw-edit-qty-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">7,800 kg received so far against this line.</p>
          </div>

          <div class="mt-4">
            <label for="dw-edit-rejected" class="mb-1.5 block text-[13px]/5 font-medium">Rejected</label>
            <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="dw-edit-rejected" inputmode="decimal" value="120"
                     class="w-full bg-transparent px-3 py-2.5 text-right text-[14px]/5 tabular-nums outline-none">
              <span class="pr-3 text-[13px]/5 text-zinc-600">kg</span>
            </div>
          </div>

          <div class="mt-4">
            <label for="dw-edit-heat" class="mb-1.5 block text-[13px]/5 font-medium">Heat number</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <input id="dw-edit-heat" value="HT-4471" autocomplete="off"
                     class="w-full bg-transparent px-3 py-2.5 text-[14px]/5 tabular-nums outline-none">
            </div>
          </div>

          <div class="mt-4">
            <label for="dw-edit-remarks" class="mb-1.5 block text-[13px]/5 font-medium">Remarks</label>
            <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
              <textarea id="dw-edit-remarks" rows="2" placeholder="Optional"
                        class="w-full resize-none bg-transparent px-3 py-2.5 text-[14px]/5 outline-none"></textarea>
            </div>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
          <button type="button" @click="open = false"
                  class="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
          <button type="submit"
                  class="flex-1 rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save line</button>
        </div>
      </form>
    </div>
  </div>
</div>` },

      { id: 'guarded', name: 'Dirty, and the backdrop is not a way out', tagNew: true, code:
`<!-- A rejection reason is prose somebody composed while standing at a
     receiving bay, and the backdrop is the easiest thing on a phone to press
     by accident: the panel is full-bleed, the thumb rests at the edge of the
     screen, and the strip of dimmed page above it is a live dismiss target for
     as long as the drawer is open. A dismissible drawer over a textarea loses
     that paragraph roughly once a week, and nobody ever reports it as a bug —
     they retype it.

     So dismissal is routed through attempt(). Clean, it closes. Dirty, it puts
     the question in the footer, which is fixed, already under the thumb, and
     already where the two answers would have gone.

     What it does not do is open an alert dialog on top of the drawer. Two
     nested x-traps both want to restore focus when they close, and the one
     that runs last wins, so focus lands back on the drawer\'s trigger while the
     drawer is still open and the next Tab walks off into a page that is still
     behind a scrim. When the question genuinely has three answers — discard,
     keep editing, save and leave — it is not a footer strip and not a drawer:
     that is alert-dialog/unsaved.

     Escape is deliberately unable to lose anything. The first press asks, the
     second press backs out of the question, and there is no third state where
     it closes. A user hammering Escape to get out of a panel is precisely the
     user who has not read the question, which is why the answer they cannot
     reach by mashing a key is the destructive one.

     dirty is set by a delegated @input and @change on the body rather than by a
     handler on each control — typing raises input, the select raises change,
     and a field added next month is covered without anyone remembering to wire
     it. Save clears the flag before closing, or the next open starts dirty.

     The confirm strip is role="alert" so it is announced when it appears, and
     focus moves to Keep editing, which is the safe answer and the one a blind
     press should land on. Both footers carry x-cloak: neither is guaranteed to
     be the one showing at first paint.

     Backing out of the question puts focus back where it came from, and that
     is not a nicety. Keep editing is inside the strip that x-show is about to
     set to display:none, and focus on an element that goes display:none falls
     to the body — inside the trap it is recoverable with a Tab, but the caret
     has still vanished out of a panel the user is standing in. The element is
     remembered before the question is raised and restored after it, with the
     first field as the fallback for the case the question came from a backdrop
     click, which has already blurred to the body by the time it is handled. -->
<div data-kui="drawer/guarded"
     x-data="{
       open: false, dirty: false, confirming: false, was: null,
       attempt() {
         if (this.confirming) return;
         if (!this.dirty) return this.close();
         this.was = document.activeElement;
         this.confirming = true;
         this.$nextTick(() => this.$refs.keep.focus());
       },
       keep() {
         this.confirming = false;
         this.$nextTick(() => {
           const back = this.was && this.$root.contains(this.was) ? this.was : this.$refs.reason;
           back.focus();
         });
       },
       escape() { if (this.confirming) return this.keep(); this.attempt() },
       discard() { this.dirty = false; this.close() },
       save() { this.dirty = false; this.close() },
       close() { this.confirming = false; this.open = false }
     }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="undo-2" class="size-4"></i>Send back
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="escape()" @click.self="attempt()"
       class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="dw-guard-title"
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
          <h2 id="dw-guard-title" class="text-[16px]/6 font-semibold">Send back for revision</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">PO-24-1187 · Gujarat Polymers Ltd · ₹12,45,000</p>
        </div>
        <button type="button" @click="attempt()" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div @input="dirty = true" @change="dirty = true" class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div>
          <label for="dw-guard-reason" class="mb-1.5 block text-[13px]/5 font-medium">Reason</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <select id="dw-guard-reason" x-ref="reason" autofocus class="w-full bg-transparent px-3 py-2.5 text-[14px]/5 outline-none">
              <option>Rate does not match the contract</option>
              <option>Delivery window is too late</option>
              <option>Quantity exceeds the indent</option>
              <option>Vendor is on QC hold</option>
            </select>
          </div>
        </div>

        <div class="mt-4">
          <label for="dw-guard-note" class="mb-1.5 block text-[13px]/5 font-medium">Note to the buyer</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            <textarea id="dw-guard-note" rows="4" aria-describedby="dw-guard-note-help"
                      class="w-full resize-none bg-transparent px-3 py-2.5 text-[14px]/5 outline-none"></textarea>
          </div>
          <p id="dw-guard-note-help" class="mt-1.5 text-[12px]/4 text-zinc-500">The buyer sees this on the order and in the mail that goes out.</p>
        </div>
      </div>

      <div x-show="!confirming" x-cloak
           class="flex shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="attempt()"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="save()"
                class="flex-1 rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Send back</button>
      </div>

      <div x-show="confirming" x-cloak role="alert"
           class="flex shrink-0 flex-col gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-[13px]/5 font-medium">Discard what you have written?</p>
        <div class="flex items-center gap-2">
          <button type="button" x-ref="keep" @click="keep()"
                  class="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:flex-none">Keep editing</button>
          <button type="button" @click="discard()"
                  class="flex-1 rounded-lg px-4 py-2.5 text-[13px]/5 font-medium text-red-700 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:flex-none">Discard</button>
        </div>
      </div>
    </div>
  </div>
</div>` },

      { id: 'top', name: 'Down from the top edge', tagNew: true, code:
`<!-- The same component against the other horizontal edge, and the reason is
     the software keyboard.

     A panel whose first control is a text field cannot live on the bottom edge
     of a phone. Focus the field and the keyboard takes the bottom third of the
     viewport; dvh shrinks, the cap re-evaluates, and the panel is squeezed
     between the top of the keyboard and its own cap with the field, the list
     and the footer all fighting for what is left. Hang the same panel from the
     top and it loses that height off the far end, where there is nothing but
     page.

     So the edge follows two questions: what is going to cover the panel, and
     what is going to press it. A panel of tap targets stays at the bottom,
     where the thumb already is — that is drawer/actions and it should not move.
     A panel you type into goes to the top. The other two edges are not this
     component: a full-height panel from the right is sheet, and a full-height
     panel from the left is the app shell\'s off-canvas navigation, which
     sidebar/mobile owns.

     Four swaps, and they travel together or the panel arrives from the top
     wearing a bottom sheet\'s corners: items-start for items-end,
     -translate-y-full for translate-y-full, rounded-b-2xl for rounded-t-2xl,
     border-b for border-t.

     The handle is gone rather than moved to the bottom of the panel. It is a
     bottom-sheet convention borrowed from platforms that implement the drag;
     on a panel hanging from the top it is a bar pointing at a gesture that has
     neither an implementation nor a convention behind it.

     Scans land newest-first, directly under the field, because the operator is
     watching the place they are typing into and a list that grows away from it
     is a list nobody reads. The count is aria-live="polite": a barcode gun
     fires faster than a screen reader can finish a sentence, and assertive
     would make the panel unusable for the person it is meant to reassure. -->
<div data-kui="drawer/top" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="scan-line" class="size-4"></i>Scan to receive
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="dw-scan-title"
         x-show="open"
         x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:enter-start="-translate-y-full"
         x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
         x-transition:leave-end="-translate-y-full"
         class="flex max-h-[calc(100dvh-6rem)] w-full flex-col rounded-b-2xl border-b border-zinc-200 bg-white shadow-lg sm:max-w-md">

      <div class="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-5 pt-4 pb-3">
        <div class="min-w-0">
          <h2 id="dw-scan-title" class="text-[16px]/6 font-semibold">Scan to receive</h2>
          <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-600">GRN 1142 · PO-24-1187 · Sharma Extrusions</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="shrink-0 px-5 pt-4 pb-3">
        <label for="dw-scan-code" class="mb-1.5 block text-[13px]/5 font-medium">Barcode</label>
        <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <i data-lucide="scan-line" class="ml-3 size-4 shrink-0 text-zinc-500"></i>
          <input id="dw-scan-code" autofocus autocomplete="off" placeholder="Scan or type a bundle tag"
                 class="w-full bg-transparent px-3 py-2.5 text-[14px]/5 tabular-nums outline-none">
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto border-t border-zinc-100">
        <p aria-live="polite" class="bg-zinc-50 px-5 py-2 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase tabular-nums">3 bundles scanned · 3,640 kg</p>
        <ul class="divide-y divide-zinc-100">
          <li class="flex items-center justify-between gap-4 px-5 py-3">
            <span class="min-w-0 truncate text-[13px]/5 tabular-nums">MS plate 10 mm · HT-4471</span>
            <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">1,240 kg</span>
          </li>
          <li class="flex items-center justify-between gap-4 px-5 py-3">
            <span class="min-w-0 truncate text-[13px]/5 tabular-nums">MS plate 10 mm · HT-4470</span>
            <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">1,180 kg</span>
          </li>
          <li class="flex items-center justify-between gap-4 px-5 py-3">
            <span class="min-w-0 truncate text-[13px]/5 tabular-nums">MS angle 50×50×6 · HT-4468</span>
            <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600">1,220 kg</span>
          </li>
        </ul>
      </div>

      <div class="flex shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="open = false"
                class="flex-1 rounded-lg bg-zinc-700 px-4 py-2.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Post 3 bundles</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'persistent', name: 'Stays open beside the page', tagNew: true, code:
`<!-- The tray a multi-select fills, and the one drawer here that is not a
     dialog. Nothing about it is modal: no backdrop, no aria-modal, no x-trap,
     no scroll lock. The list behind it has to stay clickable and scrollable,
     because the entire purpose of the panel is that you carry on ticking rows
     while it is open.

     So it is role="region" with a name. Calling it a dialog and then declining
     to trap focus is worse than either — a screen reader announces a dialog,
     the user expects to be inside something, and Tab walks straight back out
     into the register.

     sticky bottom-0, not fixed inset-x-0. A fixed tray sits over the page and
     covers the last row of the very list it belongs to, which is why every
     screen that has one grows a padding-bottom to compensate and why that
     padding never matches the tray\'s real height once the summary line wraps.
     Sticky keeps the tray in the flow: it rides the bottom of the viewport
     while there is list below it and comes to rest at the end of the list. The
     card it sits in must not carry overflow-hidden, or it becomes the scroll
     container and the tray stops sticking to anything.

     No Escape handler. A non-modal panel that binds a window key is competing
     with every other thing on the page that also has an opinion about Escape,
     and it will win or lose that argument depending on load order.

     No close button either, because the tray is not a thing that is open — it
     is the selection, drawn. Closing it while five orders are still ticked
     would hide the only place on the screen that says so. Clear empties the
     selection and the tray leaves with it.

     It follows that nothing may live only in here. A control that exists
     nowhere else has to be reachable, and this panel is allowed to disappear
     the moment a checkbox is unticked.

     The count is aria-live="polite" and not an alert: it changes on every tick,
     and a register selected across forty rows would otherwise be forty
     interruptions. -->
<div data-kui="drawer/persistent" x-data="{ picked: [] }"
     class="rounded-xl border border-zinc-300 bg-white">
  <div class="border-b border-zinc-200 px-4 py-3">
    <h2 class="text-[13px]/5 font-medium">Orders awaiting your approval</h2>
    <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-600">5 orders · ₹61,84,000 in total</p>
  </div>

  <ul class="divide-y divide-zinc-100">
    <li>
      <label class="flex items-start gap-3 px-4 py-3 hover:bg-zinc-100">
        <input type="checkbox" value="PO-24-1187" x-model="picked" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[13px]/5 font-medium tabular-nums">PO-24-1187 · Sharma Extrusions</span>
          <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-600">₹18,42,000 · raised 04 Sep 2026</span>
        </span>
      </label>
    </li>
    <li>
      <label class="flex items-start gap-3 px-4 py-3 hover:bg-zinc-100">
        <input type="checkbox" value="PO-24-1191" x-model="picked" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[13px]/5 font-medium tabular-nums">PO-24-1191 · Gujarat Polymers Ltd</span>
          <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-600">₹12,45,000 · raised 05 Sep 2026</span>
        </span>
      </label>
    </li>
    <li>
      <label class="flex items-start gap-3 px-4 py-3 hover:bg-zinc-100">
        <input type="checkbox" value="PO-24-1194" x-model="picked" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[13px]/5 font-medium tabular-nums">PO-24-1194 · Nashik Steel Traders</span>
          <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-600">₹8,90,000 · raised 07 Sep 2026</span>
        </span>
      </label>
    </li>
    <li>
      <label class="flex items-start gap-3 px-4 py-3 hover:bg-zinc-100">
        <input type="checkbox" value="PO-24-1198" x-model="picked" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[13px]/5 font-medium tabular-nums">PO-24-1198 · Sharma Extrusions</span>
          <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-600">₹15,20,000 · raised 09 Sep 2026</span>
        </span>
      </label>
    </li>
    <li>
      <label class="flex items-start gap-3 px-4 py-3 hover:bg-zinc-100">
        <input type="checkbox" value="PO-24-1203" x-model="picked" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[13px]/5 font-medium tabular-nums">PO-24-1203 · Baroda Fasteners</span>
          <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-600">₹6,87,000 · raised 11 Sep 2026</span>
        </span>
      </label>
    </li>
  </ul>

  <div x-show="picked.length" x-cloak role="region" aria-label="Selected orders"
       x-transition:enter="transition ease-out duration-200 motion-reduce:transition-none motion-reduce:duration-0"
       x-transition:enter-start="translate-y-full"
       x-transition:leave="transition ease-in duration-150 motion-reduce:transition-none motion-reduce:duration-0"
       x-transition:leave-end="translate-y-full"
       class="sticky bottom-0 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-b-xl border-t border-zinc-200 bg-zinc-100 px-4 py-3">
    <p aria-live="polite" class="min-w-0 flex-1 text-[13px]/5 tabular-nums">
      <span x-text="picked.length"></span> selected
    </p>
    <button type="button" @click="picked = []"
            class="rounded-lg px-3 py-2 text-[13px]/5 font-medium text-zinc-900 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Clear</button>
    <button type="button"
            class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve selected</button>
  </div>
</div>` },

      { id: 'phone', name: 'The whole panel at 390px', tagNew: true, code:
`<!-- Every drawer here is full width below sm, so 390px is not a special case
     of the component — it is the component, and sm:max-w-md is the special
     case. What actually breaks at 390px is everything inside it, so this is
     one panel with each of those decisions taken.

     The footer stacks. "Send back for revision" and "Approve order" measure
     about 330px side by side with their padding, which fits nowhere on a phone
     and truncates into two buttons that both start with a verb and end in an
     ellipsis. flex-col-reverse stacks them and puts the primary on top, with
     Cancel below it, which is the wrong way round for a mouse and the right way
     round for a thumb travelling up from the bottom edge. Both are h-11: 44px,
     because this one is pressed rather than clicked.

     Figures do not sit in a two-column grid. A label and a value on one line
     works until "Approval limit for Ritu Deshpande" meets ₹5,00,000 and one of
     them wraps under the other anyway — so the label is above the value from
     the start, and the value gets the weight. Every one of them is
     tabular-nums, including the dates, so the column of values reads as a
     column.

     The heading truncates and its subtitle truncates separately. A vendor name
     and an order number on one line is two truncations fighting over one
     ellipsis, and the half that loses is always the order number.

     The 6rem the cap holds back is not slack. It is the strip of dimmed page
     above the panel that says this is a panel over a screen and not the screen
     itself — and on a 390×844 phone it is the only such evidence, because
     everything else is edge to edge. -->
<div data-kui="drawer/phone" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:w-auto">
    <i data-lucide="check-check" class="size-4"></i>Review and approve
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="dw-phone-title"
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
          <h2 id="dw-phone-title" class="truncate text-[16px]/6 font-semibold tabular-nums">PO-24-1191</h2>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Gujarat Polymers Ltd · Silvassa 1</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <dl class="space-y-3.5">
          <div>
            <dt class="text-[12px]/4 text-zinc-600">Order value</dt>
            <dd class="mt-0.5 text-[16px]/6 font-semibold tabular-nums">₹12,45,000</dd>
          </div>
          <div>
            <dt class="text-[12px]/4 text-zinc-600">Your approval limit</dt>
            <dd class="mt-0.5 text-[14px]/5 tabular-nums">₹15,00,000</dd>
          </div>
          <div>
            <dt class="text-[12px]/4 text-zinc-600">Lines</dt>
            <dd class="mt-0.5 text-[14px]/5 tabular-nums">4 lines · 26.5 MT of HDPE granules</dd>
          </div>
          <div>
            <dt class="text-[12px]/4 text-zinc-600">Delivery window</dt>
            <dd class="mt-0.5 text-[14px]/5 tabular-nums">18 Sep 2026 to 25 Sep 2026</dd>
          </div>
          <div>
            <dt class="text-[12px]/4 text-zinc-600">Raised by</dt>
            <dd class="mt-0.5 text-[14px]/5 tabular-nums">Ritu Deshpande on 05 Sep 2026</dd>
          </div>
          <div>
            <dt class="text-[12px]/4 text-zinc-600">Vendor GSTIN</dt>
            <dd class="mt-0.5 text-[14px]/5 tabular-nums">24AABCG1234M1ZP</dd>
          </div>
        </dl>
      </div>

      <div class="flex shrink-0 flex-col-reverse gap-2 border-t border-zinc-200 bg-zinc-100 px-5 py-3">
        <button type="button" @click="open = false"
                class="flex h-11 w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Send back for revision</button>
        <button type="button" @click="open = false"
                class="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Approve order</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'django', name: 'Django action drawer', tagNew: true, code:
`<!-- The action list rendered from a template, and the point of it is that the
     panel is not a form. Each row that changes the record is its own tiny POST
     form with its own csrf_token and its own action, because a drawer holds
     four unrelated verbs and one form cannot post to four URLs.

     # views.py
     class OrderActionsView(PermissionRequiredMixin, DetailView):
         model = Order
         permission_required = 'orders.view_order'
         template_name = 'orders/_actions_drawer.html'

     None of these rows is an <a>. Print is, because it reads; Record GRN,
     Email to vendor and Cancel order all mutate, and a link that mutates is a
     link a prefetcher, a crawler or an over-eager browser will follow on its
     own. This is the shape that keeps that impossible rather than unlikely.

     The permission check is {% if perms %} around the row rather than a
     disabled attribute on it, because a user who may not cancel an order is
     not looking at a cancel button that is off — they have no business seeing
     the verb at all. The one exception is the row that is unavailable because
     of the record\'s own state, which is rendered with the reason under it, the
     way button/unavailable does it: that is information, not a permission.

     Every id in the block is suffixed with the order\'s pk. This template is
     rendered once per drawer today and inside a {% for %} the day somebody
     puts an actions drawer on every row of the register, and an
     aria-labelledby pointing at the first of six identical ids is a bug that
     only shows up in a screen reader.

     Django\'s {% url %} tags and the drawer\'s Alpine state do not interact.
     Alpine owns open and nothing else; the server owns every route. -->
{% load humanize %}
<div data-kui="drawer/django" x-data="{ open: false }">
  <button type="button" @click="open = true"
          class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="ellipsis" class="size-4"></i>{{ order.number }}
  </button>

  <div x-show="open" x-cloak x-trap.noscroll="open" @keydown.escape.window="open = false" @click.self="open = false"
       class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40">
    <div role="dialog" aria-modal="true" aria-labelledby="order-actions-title-{{ order.pk }}"
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
          <h2 id="order-actions-title-{{ order.pk }}" class="text-[16px]/6 font-semibold tabular-nums">{{ order.number }}</h2>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">{{ order.vendor.name }} · <span class="tabular-nums">₹{{ order.value|intcomma }}</span> · {{ order.get_status_display }}</p>
        </div>
        <button type="button" @click="open = false" aria-label="Close"
                class="-mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="x" class="size-4"></i>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-2">
        {% if perms.grn.add_grn %}
          <form method="post" action="{% url 'grn-start' order.pk %}">
            {% csrf_token %}
            <button type="submit"
                    class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
              <i data-lucide="package-check" class="size-4 shrink-0 text-zinc-500"></i>Record GRN
            </button>
          </form>
        {% endif %}

        <a href="{% url 'order-print' order.pk %}"
           class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="printer" class="size-4 shrink-0 text-zinc-500"></i>Print order
        </a>

        <form method="post" action="{% url 'order-email' order.pk %}">
          {% csrf_token %}
          <button type="submit"
                  class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="send" class="size-4 shrink-0 text-zinc-500"></i>Email to {{ order.vendor.name }}
          </button>
        </form>

        {% if perms.orders.cancel_order %}
          <div class="my-1 border-t border-zinc-100"></div>
          {% if order.can_cancel %}
            <form method="post" action="{% url 'order-cancel' order.pk %}">
              {% csrf_token %}
              <button type="submit"
                      class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px]/5 text-red-700 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <i data-lucide="ban" class="size-4 shrink-0"></i>Cancel order
              </button>
            </form>
          {% else %}
            <div class="px-3 py-3">
              <button type="button" aria-disabled="true" aria-describedby="cancel-why-{{ order.pk }}" @click.prevent
                      class="flex w-full items-center gap-3 rounded-lg text-left text-[14px]/5 text-zinc-600 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <i data-lucide="ban" class="size-4 shrink-0 text-zinc-500"></i>Cancel order
              </button>
              <p id="cancel-why-{{ order.pk }}" class="mt-1.5 pl-7 text-[12px]/4 tabular-nums text-zinc-600">
                {{ order.received_lines }} of {{ order.line_count }} lines are already received. Cancel the GRNs first.
              </p>
            </div>
          {% endif %}
        {% endif %}
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
      'The pill itself never takes a hue. bg-zinc-200, ring-zinc-300, text-zinc-700 on all five — a column of tinted pills reads as a traffic light and stops meaning anything by the twelfth row. Draft is the one that differs, and only in its text: zinc-600, because it is not real yet.',
      'The fill is bg-zinc-200 with ring-zinc-300 — the chip fill, the same one an avatar takes. bg-zinc-100 is the surface fill, so a pill wearing it is the identical colour as the selected row underneath it and vanishes into it.',
      'Solid pills take no ring. A graphite or red count badge already has an edge, and a pale ring around a dark pill reads as a rendering fault.',
      'Keep one label per state across the whole app. "Open" in one table and "Pending" in another reads as two different things.',
      'Counts are numbers — tabular-nums, and cap the display at 99+ so the pill cannot widen and reflow its row. Cap in the view, not in the template: a filter that prints 99+ has still handed the true number to whatever attribute nobody trimmed.',
      'The small size is for table cells and dense toolbars only. Everywhere else is the default size; there is no third. 11px is the floor — below it the label is not readable, and the answer to a row that cannot hold an 11px pill is a shorter label, not a smaller one.',
      'There is no sixth colour. A record whose state the system does not know takes the pill with no dot in it, and a field that does not apply to this record takes no pill at all. Borrowing the Draft dot for either loses the difference between "somebody started this" and "nobody has told us".',
      'A pill inside a button that hovers to zinc-200 steps to zinc-300 with it. Left alone it is the same fill as the control around it at exactly the moment the pointer is on it, which is when it most needs to be readable.',
      'Badges do not wrap and their labels are never truncated. Where a row of tags will not fit, show the first two and count the rest — a half-word inside a graphite pill reads as a rendering fault rather than as a name that was too long.'
    ],
    anatomy: [
      ['Pill', 'rounded-full, bg-zinc-200, the same on every state. It is the shape that says "this is a state"; it is not what says which one.'],
      ['Ring', 'ring-zinc-300, one step deeper than the fill. It is a ring rather than a border so adding it reflows nothing.'],
      ['Dot', 'The 6px marker that carries the state. Not optional on any of the five — without it they all look the same. Its absence is itself a state, and the only one: the record whose status is not known.'],
      ['Label', 'One word, sentence case, from a fixed vocabulary. Not a sentence and not a number with units.'],
      ['Axis label', 'The zinc-600 word in front of a pill on a record that has more than one state — Approval, Delivery, Payment. Without it two identical graphite pills are one list of one thing.'],
      ['Qualifier', 'The zinc-600 fact beside a pill that the pill is not allowed to hold — how many days past promise, who it is waiting on. It sits outside the shape and takes no dot of its own.'],
      ['Count', 'tabular-nums, capped at 99+ so the pill cannot grow and reflow its row.'],
      ['Remove', 'Only on tags the user applied. A status is not removable, because it describes the record rather than decorating it.'],
      ['Overflow count', 'The +3 that stands for the tags a cell could not hold. A button, because it reveals them; a pill, because it belongs to the set beside it.']
    ],
    behaviour: [
      'One label per state across the whole application. "Open" in one table and "Pending" in another reads as two different things.',
      'The dot colour comes from the locked mapping and is not reinterpreted per screen. The pill around it never changes.',
      'Counts cap at 99+ rather than widening, so a row does not reflow when a number crosses a hundred.',
      'A removable tag removes on click without a confirmation — it is cheap to reapply.',
      'A badge that filters is a real button and shows its selected state as a solid fill, not as a slightly darker tint nobody can see.',
      'Badges do not wrap. A row of them scrolls or truncates; a badge broken across two lines stops reading as one object.',
      'A record carrying more than one state names each axis in front of its pill. The pills stay identical: tinting the approval green so it can be told apart from the delivery trades a naming problem for a traffic light and breaks the mapping every other screen reads.',
      'A count the server owns is polled on the badge, not on the toolbar around it. Swapping the button drops focus and closes anything hanging off it every time the poll fires.'
    ],
    a11y: [
      'The label is real text inside the pill, so colour is never the only carrier of the state.',
      'The dot is decorative and aria-hidden; the word beside it is the information.',
      'A count badge on a control is included in that control\'s accessible name — "Notifications, 99 or more unread" — because "bell, 99+" is not a sentence.',
      'A count the server keeps current cannot live in aria-label. The swap has to rewrite the name, and htmx replaces elements rather than attributes — so the icon button is named from its own contents, an sr-only string beside the digits, and the fragment carries both.',
      'A live region that htmx replaces outright is a new live region, and a new one announces nothing. Target the inside of the badge and leave the element carrying aria-live in place across the swap.',
      'A remove control is a real button with aria-label naming its tag.',
      'A filter badge is a button with aria-pressed, so its on state is announced and not merely filled in.',
      'Status pills are not interactive and are not focusable, so they do not appear in the Tab order as dead stops.',
      'Pills on several axes go in a <dl>, so the second one is announced as "Delivery, Overdue" rather than as "Overdue" with nothing to say what is overdue.',
      'A cell that does not apply is an em dash for the eye and the words "Not applicable" for the accessibility tree. An em dash on its own is announced as nothing at all, which is indistinguishable from a cell the page failed to fill.'
    ],
    related: ['table', 'alert', 'avatar'],
    variants: [
      { id: 'status', name: 'Status pills', code:
`<!-- The locked mapping. One pill class on all five; the dot is the only thing
     that differs. Copy these verbatim, and do not invent a sixth colour for a
     sixth state — add the state to this list or reuse Open.

     Every pill carries whitespace-nowrap. One-word labels never needed it and
     that is exactly why it goes on now: the first two-word state anybody adds —
     "Part received", "Awaiting approval" — breaks across two lines inside a
     narrow column and stops reading as one object. -->
<div data-kui="badge/status" class="flex flex-wrap items-center gap-2">
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Closed
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium whitespace-nowrap text-zinc-600 ring-1 ring-inset ring-zinc-300">
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
    <h3 class="text-[16px]/6 font-semibold tabular-nums">PO-24-1187</h3>
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

      { id: 'unknown', name: 'Nothing to report', tagNew: true, code:
`<!-- The sixth state that keeps getting asked for, and the answer is that there
     is no sixth colour. Two different facts get confused here and they need
     different shapes.

     A record whose status the system genuinely does not have yet keeps the pill
     and loses the dot. The shape still says "this column is a state"; the
     missing marker says the state is missing. A field that does not apply to
     this record takes no pill at all — a pill is the claim that the record is
     in some state, and "not applicable" is the claim that it is in none.

     Neither of them borrows the Draft dot. Draft means somebody started this
     and has not finished it, which is a real state with an owner; unknown means
     nobody has told us. Printing them the same grey loses the one difference
     that decides who gets chased.

     A hollow dot was the other candidate and is not in the system: an unfilled
     6px ring needs a ring colour the token table does not have, and inventing
     one here would put a second edge weight into every status column. -->
<div data-kui="badge/unknown" class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <table class="w-full table-fixed text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="px-4 py-2 font-medium sm:w-32">Order</th>
        <th scope="col" class="hidden px-4 py-2 font-medium sm:table-cell">Supplier</th>
        <th scope="col" class="px-4 py-2 font-medium sm:w-32">ERP status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="hidden truncate px-4 py-2.5 sm:table-cell">Gujarat Polymers Ltd</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
          </span>
        </td>
      </tr>
      <tr class="border-b border-zinc-100 bg-zinc-50">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1186</td>
        <td class="hidden truncate px-4 py-2.5 sm:table-cell">Konkan Fabricators</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium whitespace-nowrap text-zinc-600 ring-1 ring-inset ring-zinc-300">Unknown</span>
        </td>
      </tr>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PR-24-0412</td>
        <td class="hidden truncate px-4 py-2.5 sm:table-cell">Not yet assigned</td>
        <td class="px-4 py-2.5 text-zinc-500">
          <span aria-hidden="true">—</span><span class="sr-only">Not applicable</span>
        </td>
      </tr>
    </tbody>
  </table>
  <p class="border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-[12px]/4 text-zinc-600">
    Unknown means the nightly sync has not answered for that order since 04 Sep 2026. A requisition that was never released has no ERP status to be unknown about.
  </p>
</div>` },

      { id: 'axes', name: 'Two states on one record', tagNew: true, code:
`<!-- A record with more than one state — an approval and a delivery and a
     payment — cannot show them as a row of bare pills. Three identical graphite
     shapes side by side read as one list of one thing, and nothing on screen
     says which of them is the approval.

     Name the axis in front of each pill and the ambiguity is gone. The
     temptation this replaces is tinting the approval green and the delivery red
     so they can be told apart at a glance, which trades a naming problem for a
     traffic light and breaks the mapping every other screen in the app reads.

     It is a <dl>: the axis is the term and the pill is its value, so a screen
     reader landing on the second one hears "Delivery, Overdue" rather than
     "Overdue" with nothing to say what is overdue. The rows wrap and do not
     scroll, because three short pairs fit a phone in two lines. -->
<div data-kui="badge/axes" class="max-w-lg rounded-xl border border-zinc-300 bg-white p-4">
  <h3 class="text-[16px]/6 font-semibold tabular-nums">PO-24-1187</h3>
  <p class="mt-0.5 text-[13px]/5 tabular-nums text-zinc-600">Gujarat Polymers Ltd · 6 lines · ₹12,45,000</p>
  <dl class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px]/4">
    <div class="flex items-center gap-2">
      <dt class="text-zinc-600">Approval</dt>
      <dd>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Closed
        </span>
      </dd>
    </div>
    <div class="flex items-center gap-2">
      <dt class="text-zinc-600">Delivery</dt>
      <dd>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
        </span>
      </dd>
    </div>
    <div class="flex items-center gap-2">
      <dt class="text-zinc-600">Payment</dt>
      <dd>
        <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
          <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
        </span>
      </dd>
    </div>
  </dl>
</div>` },

      { id: 'sizes', name: 'Sizes', code:
`<!-- Two sizes and no third. Small is for table cells and dense toolbars, where
     the default pill makes the row taller than its text needs. The dot stays
     1.5 at both sizes — shrinking it is how a state stops being visible.

     11px is the floor and there is nothing under it. A row too tight for an
     11px pill is asking for a shorter label or a taller row, and a 10px pill
     answers neither: it is unreadable on the laptop screens these registers are
     actually worked on, and the state it carries stops being read at all. -->
<div data-kui="badge/sizes" class="flex flex-wrap items-center gap-4">
  <div class="flex items-center gap-2">
    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
    </span>
    <span class="text-[12px]/4 text-zinc-600">Small — inside table rows</span>
  </div>
  <div class="flex items-center gap-2">
    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
    </span>
    <span class="text-[12px]/4 text-zinc-600">Default — everywhere else</span>
  </div>
</div>` },

      { id: 'icon', name: 'With an icon', code:
`<!-- An icon belongs on a badge that names a kind, not a state. States already
     have the five colours; a kind has nothing else to distinguish it. -->
<div data-kui="badge/icon" class="flex flex-wrap items-center gap-2">
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-2.5 pl-2 text-[12px]/4 font-medium whitespace-nowrap text-zinc-900 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="mail" class="size-3 text-zinc-600"></i>Email
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-2.5 pl-2 text-[12px]/4 font-medium whitespace-nowrap text-zinc-900 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="phone" class="size-3 text-zinc-600"></i>Phone
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-2.5 pl-2 text-[12px]/4 font-medium whitespace-nowrap text-zinc-900 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="map-pin" class="size-3 text-zinc-600"></i>Site visit
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-2.5 pl-2 text-[12px]/4 font-medium whitespace-nowrap text-zinc-900 ring-1 ring-inset ring-zinc-300">
    <i data-lucide="paperclip" class="size-3 text-zinc-600"></i><span class="tabular-nums">3 files</span>
  </span>
</div>` },

      { id: 'filter', name: 'Filter chips', code:
`<!-- A badge that does something is a button. Selected is a solid fill, because
     a marginally darker tint is not a state anyone can see across a toolbar.
     aria-pressed carries the same fact to a screen reader.

     The focus outline is declared on the static class and not on the bound one,
     so it survives whichever branch of :class wins. Written into both branches
     it is two chances to forget it, and the unselected chip — white on the page
     with no fill to darken — is the one that has nothing else to show for
     itself when it does get forgotten. -->
<div data-kui="badge/filter" class="flex flex-wrap items-center gap-2" x-data="{ on: ['overdue'] }">
  <template x-for="f in [{ id: 'mine', label: 'My orders' }, { id: 'overdue', label: 'Overdue' }, { id: 'unapproved', label: 'Awaiting approval' }, { id: 'month', label: 'This month' }]" :key="f.id">
    <button type="button"
            @click="on = on.includes(f.id) ? on.filter(x => x !== f.id) : [...on, f.id]"
            :aria-pressed="on.includes(f.id)"
            class="rounded-full px-2.5 py-1 text-[12px]/4 font-medium whitespace-nowrap focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
            :class="on.includes(f.id)
              ? 'bg-zinc-700 text-white hover:bg-zinc-800'
              : 'bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-200'">
      <span x-text="f.label"></span>
    </button>
  </template>
  <button type="button" x-show="on.length" x-cloak @click="on = []"
          class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Clear</button>
</div>` },

      { id: 'removable', name: 'Removable tag', code:
`<!-- Only for tags the user applied. A status is not removable — it describes
     the record rather than decorating it, and an x on it promises an edit that
     is not going to happen.

     The x is a shape sitting on a zinc-200 track, so it hovers to zinc-300
     rather than to zinc-200: hovering to the fill of the pill it sits in is the
     one hover that makes a control less visible than it was at rest. -->
<div data-kui="badge/removable" class="flex flex-wrap items-center gap-2" x-data="{ tags: ['Sharma Extrusions', 'Open', '₹1,00,000+'] }">
  <template x-for="tag in tags" :key="tag">
    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 py-0.5 pr-1 pl-2.5 text-[12px]/4 font-medium whitespace-nowrap ring-1 ring-inset ring-zinc-300">
      <span x-text="tag"></span>
      <button type="button" @click="tags = tags.filter(t => t !== tag)" :aria-label="'Remove ' + tag"
              class="flex size-4 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-300 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="x" class="size-3"></i>
      </button>
    </span>
  </template>
  <button type="button" x-show="tags.length" x-cloak @click="tags = []"
          class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Clear all</button>
  <p x-show="!tags.length" x-cloak class="text-[12px]/4 text-zinc-600">No filters applied.</p>
</div>` },

      { id: 'overflow', name: 'Tags that do not fit', tagNew: true, code:
`<!-- Badges do not wrap, so in a fixed cell a row of them either pushes the
     column out or breaks across two lines, and a badge on two lines stops
     reading as one object. Show the first two and count the rest.

     Never truncate a badge's own label to buy the space. "Gujarat Polym…" is a
     half-word inside a graphite pill and reads as a rendering fault rather than
     as a name that was too long; at 11px it is not readable as either. The
     whole badge goes and the +3 stands in for it.

     The +3 is a real button because it does something, and it is styled as the
     pills beside it because it is a member of that set. It carries
     aria-expanded and aria-controls pointing at the strip that grows, so the
     press is announced as a disclosure and not as a filter that removed two
     tags. The label under it says how many, since "+3" alone is a fragment. -->
<div data-kui="badge/overflow" class="max-w-sm rounded-xl border border-zinc-300 bg-white p-4"
     x-data="{ all: false, tags: ['Rate approved', 'MSME vendor', 'Site delivery', 'Retention 5%', 'Freight paid'] }">
  <p class="text-[13px]/5 font-medium tabular-nums">PO-24-1187 · Gujarat Polymers Ltd</p>
  <div id="badge-overflow-tags" class="mt-2 flex flex-wrap items-center gap-1.5">
    <template x-for="(tag, i) in tags" :key="tag">
      <span x-show="all || i < 2"
            class="inline-flex items-center rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300"
            x-text="tag"></span>
    </template>
    <button type="button" @click="all = !all" :aria-expanded="all" aria-controls="badge-overflow-tags"
            :aria-label="all ? 'Show fewer tags' : 'Show ' + (tags.length - 2) + ' more tags'"
            class="rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium tabular-nums whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <span x-text="all ? 'Fewer' : '+' + (tags.length - 2)">+3</span>
    </button>
  </div>
</div>` },

      { id: 'count', name: 'Count badge', code:
`<!-- Counts are numbers: tabular-nums, and capped at 99+ so the pill cannot
     widen and shove the rest of the toolbar sideways. The count is part of the
     control's accessible name, not a separate announcement.

     A count is not a state, so it takes no hue — the word next to it already
     says "Overdue". Solid graphite is for the one badge that must be seen from
     across the toolbar, and solid shapes take no ring.

     The pill inside a button steps with it: the button hovers to zinc-200, so
     the pill goes group-hover to zinc-300. Left at zinc-200 it is the exact
     fill of the control around it at the one moment somebody is pointing at
     it, and the count is left holding nothing but its ring. -->
<div data-kui="badge/count" class="flex flex-wrap items-center gap-4">
  <button type="button" class="group flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Pending approval
    <span class="rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300 group-hover:bg-zinc-300">12</span>
  </button>

  <button type="button" class="group flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Overdue
    <span class="rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300 group-hover:bg-zinc-300">3</span>
  </button>

  <button type="button" aria-label="Notifications, 99 or more unread"
          class="relative flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
          </span>
        </td>
        <td class="hidden px-4 py-2.5 text-right tabular-nums sm:table-cell">₹4,82,000</td>
      </tr>
      <tr class="border-b border-zinc-100 bg-zinc-50">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1186</td>
        <td class="hidden truncate px-4 py-2.5 sm:table-cell">Konkan Fabricators</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
          </span>
        </td>
        <td class="hidden px-4 py-2.5 text-right tabular-nums sm:table-cell">₹1,15,400</td>
      </tr>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1185</td>
        <td class="hidden truncate px-4 py-2.5 sm:table-cell">Deshpande Traders</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
          </span>
        </td>
        <td class="hidden px-4 py-2.5 text-right tabular-nums sm:table-cell">₹96,750</td>
      </tr>
      <tr>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1184</td>
        <td class="hidden truncate px-4 py-2.5 sm:table-cell">Qureshi Metals</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Closed
          </span>
        </td>
        <td class="hidden px-4 py-2.5 text-right tabular-nums sm:table-cell">₹2,30,000</td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'header', name: 'Beside a record title', tagNew: true, code:
`<!-- The pill next to a record title, and the fact it is not allowed to hold.
     "Overdue" is the state; "12 days past the promised date" is why anybody
     cares, and it stays outside the shape. A pill that grows to a phrase is no
     longer a fixed shape, so the header stops matching the column the same
     record occupies on the register screen it was opened from.

     The qualifier takes no dot of its own. Two dots on one line is two states
     and there is only one here — the second one would be read as an axis this
     record has and does not.

     The pill follows the heading in the DOM rather than preceding it, so the
     record is named before it is described. Ahead of the title it is announced
     with nothing yet for it to be about. -->
<div data-kui="badge/header" class="border-b border-zinc-300 bg-white px-4 py-4 sm:px-6">
  <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
    <h1 class="text-[20px]/7 font-semibold tracking-tight tabular-nums">PO-24-1187</h1>
    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium whitespace-nowrap text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
    </span>
    <span class="text-[13px]/5 tabular-nums text-zinc-600">12 days past the promised date</span>
  </div>
  <p class="mt-1 text-[13px]/5 tabular-nums text-zinc-600">Gujarat Polymers Ltd · raised 14 Aug 2026 · ₹12,45,000 · 6 lines</p>
</div>` },

      { id: 'htmx', name: 'A count the server keeps current', tagNew: true, code:
`<!-- A queue count goes stale the moment somebody else approves something, and
     a stale count is worse than none: it is the number people decide whether to
     open the screen on at all.

     Poll the badge, not the toolbar around it. hx-get on the count with
     hx-swap="innerHTML" leaves the button, its focus and anything hanging off
     it untouched; polling the button instead drops focus and closes its menu
     every thirty seconds, on a schedule nobody can see. hx-sync="this:drop"
     throws away a poll that arrives while one is still in flight, which is what
     a tab left open on a slow VPN does all afternoon.

     aria-live goes on the span that stays, never on the fragment. htmx replaces
     elements, and a live region that is itself replaced is a new live region —
     new ones announce nothing, so the count updates silently and measures as
     correct.

     The icon button is named from its contents rather than from aria-label,
     which is the whole reason it is shaped this way. A count in aria-label
     cannot be polled: the swap would have to rewrite an attribute on an element
     it is not replacing. An sr-only string beside the digits is part of the
     name, and the server returns both. Re-run lucide.createIcons() after a swap
     that brings in new icons, guarded as the shell already guards it. -->
<div data-kui="badge/htmx" class="flex flex-wrap items-center gap-4">
  <button type="button" class="group flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    Pending approval
    <span aria-live="polite"
          hx-get="/approvals/pending/count/"
          hx-trigger="load, every 30s, approvals:changed from:body"
          hx-swap="innerHTML" hx-sync="this:drop"
          class="rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300 group-hover:bg-zinc-300">12</span>
  </button>

  <button type="button" class="relative flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="bell" class="size-4" aria-hidden="true"></i>
    <span class="sr-only">Notifications</span>
    <span aria-live="polite"
          hx-get="/notifications/count/"
          hx-trigger="load, every 30s" hx-swap="innerHTML" hx-sync="this:drop"
          class="absolute -top-1.5 -right-1.5 rounded-full bg-zinc-700 px-1.5 text-[11px]/4 font-medium tabular-nums text-white">
      <span aria-hidden="true">99+</span><span class="sr-only">, 99 or more unread</span>
    </span>
  </button>
</div>` },

      { id: 'django', name: 'Django status field', code:
`<!-- Because the pill is identical on every state, the template needs one
     lookup and it returns a single colour. Put it in one place — a filter over
     the field's raw value — never repeated per template. Repeating it is
     exactly how one screen ends up amber and another green for the same record.

     Draft is the one state whose text differs as well as its dot: zinc-600
     rather than zinc-700, because it is not real yet. That is why the table
     holds a pair and there are two filters over it rather than one filter and a
     hardcoded text class that quietly gets Draft wrong.

     # templatetags/ui.py
     STATUS = {
         'open':     ('bg-zinc-500',   'text-zinc-700'),
         'approved': ('bg-amber-500',  'text-zinc-700'),
         'overdue':  ('bg-red-600',    'text-zinc-700'),
         'closed':   ('bg-emerald-600','text-zinc-700'),
         'draft':    ('bg-zinc-400',   'text-zinc-600'),
     }

     @register.filter
     def status_dot(value):
         return STATUS.get(value, STATUS['open'])[0]

     @register.filter
     def status_text(value):
         return STATUS.get(value, STATUS['open'])[1]

     The label comes from get_status_display, so it follows the model's choices
     and reads identically on every screen. -->
{% load ui %}
<span data-kui="badge/django" class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium whitespace-nowrap {{ order.status|status_text }} ring-1 ring-inset ring-zinc-300">
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
      'The pointer path is guarded on the pointer type, not on the breakpoint. A touch screen sends a synthetic mouseenter before the click, so an unguarded bubble opens on the tap and then sits over the control the user just pressed until they tap somewhere else — the one place a tooltip can obscure the thing it names. Every show that a pointer can reach goes through one method that tests window.matchMedia(\'(hover: hover) and (pointer: fine)\').matches first, read at call time rather than cached at init, because a tablet in a keyboard dock answers differently from the same tablet out of it. The focus path is never guarded: a keyboard on a touch device is still a keyboard.',
      'Nothing is only in the bubble, and on a touch screen that stops being a principle and becomes the whole design. There is no hover on a phone, so a label that exists only as a tooltip does not exist there at all, and the answer is never a tap-to-open tooltip — that steals the first tap from the control. Below sm the icons become rows with their names written out, or fold into a menu whose items are worded the way the bubbles were. The tooltip is the desktop shorthand for something the phone shows in full.',
      'Escape hides it and focus stays exactly where it was. Bind it on window and do not stopPropagation. The window scope is needed because a tooltip opened by the pointer has no focus inside it, so a root-scoped keydown never fires and there is nothing to dismiss it with — WCAG 1.4.13 dismissible. Not stopping it is the deliberate difference from a popover: a tooltip is a label, not a layer, so an Escape that hides the bubble and also closes the dialog around it is one press doing what the user meant, while swallowing it at the tooltip makes the dialog undismissable whenever the pointer happens to rest on a toolbar icon.',
      'Delay opening by about 150ms and close immediately. The delay stops a pointer crossing a toolbar on its way somewhere else from firing five bubbles; no close delay is correct here precisely because there is nothing to travel into. A row of controls shares one delay group: once any tooltip in the group has opened, the next one opens at once, and the group goes cold again a second or so after the pointer leaves it. Without the group, moving one button along a toolbar re-pays the 150ms every time and the labels lag behind the pointer.',
      'Handlers go on the trigger, not on a wrapper. The hovercard watches its wrapper because the pointer is meant to be allowed into the panel and mouseleave has to mean "left both"; here the bubble cannot be entered, so the trigger is the whole surface worth tracking and mouseenter, mouseleave, focus and blur bind straight to it. The one exception is a disabled control, which fires no pointer events at all, and there the wrapper takes them back.',
      'The bubble is absolutely positioned inside the trigger\'s own wrapper and never portalled or position:fixed. That makes an overflow-hidden ancestor the standing trap — the card wrapper around a table clips every bubble at the row it opens on, and truncate on the cell clips the bubble as well as the text. Round the header cells instead of clipping the card, and put the bubble on a side that fits rather than reaching for fixed. Fixed brings the containing-block problem with it, and it also has to be repositioned on every scroll, which is a lot of machinery for a label.',
      'A scroller clips both axes. overflow-y:auto computes overflow-x to auto as well, so inside a scrolling list or a fixed-height panel there is no side the bubble can leave the box on: one direction is cut off and the other adds a horizontal scrollbar to a list that had none. The bubble goes inside the box, on the row\'s own line, where the only thing it can cover is content that is already there.',
      'Hide it when the anchor moves. A wheel scroll under a stationary pointer drags the row out from under it without firing mouseleave, and the bubble is left naming the row that used to be there — pointing, in a register, at a different order. Bind hide on the scroller and on the window. Hide only what the pointer opened: tabbing to a control scrolls it into view, and a scroll handler that does not check would close the label it just opened on focus.',
      'The bubble is anchored to the side that cannot leave the page, and that is decided in the markup rather than measured at runtime. A centred bubble is only safe with a control either side of the trigger; on the first control of a bar it anchors left-0 and on the last right-0, so it can only ever grow inwards. A bubble that needs more room than 390px allows takes max-w-[calc(100vw-2rem)] and gives up whitespace-nowrap — a nowrap bubble ignores a max width and takes the page sideways with it, which is the one thing rule 16 does not forgive. Nothing here measures the viewport: in a fixed bar the overflow is known when the markup is written, and a placement chosen once beats a clamp recomputed on every open.',
      'On touch it never appears, and no scroll pins it. The bubble travels with its row and goes with it, and there is no pinned state and no dismiss button. Everything that follows from that is one rule: a tooltip may not be the only place a fact lives. The spec limit, the shortcut, the reason a button is disabled — each of them is in the tooltip as a shortcut to something already on the page or one click away, never as its home.',
      'Keep it to a few words on one line, whitespace-nowrap. If it wants a sentence it is help text under the field; if it wants a heading and figures it is a hovercard; if it wants a link it is a popover. A tooltip that wraps to three lines is covering the controls either side of the one it names. Two exceptions, both of which are a second copy of something already on screen rather than a name: the full text of a truncated cell, and the expansion of an abbreviation read inside a sentence.'
    ],
    anatomy: [
      ['Wrapper', 'relative inline-flex around the trigger and the bubble — inline-block when it sits inside a paragraph, because an inline box that breaks across two lines is fragmented and the bubble anchors to the first fragment. It owns the Alpine state and the window Escape binding, and it is deliberately not what the pointer is tracked on — the trigger is.'],
      ['Trigger', 'The real button, link or header control. It carries the pointer and focus handlers, the naming attribute, and aria-keyshortcuts when the bubble shows a key. It works with the bubble never appearing.'],
      ['Bubble', 'bg-zinc-900, rounded-lg, px-2 py-1, text-[12px]/4 white, whitespace-nowrap, pointer-events-none, z-40, x-cloak. role="tooltip" when it is exposed, aria-hidden when the trigger already carries the same string.'],
      ['Gap', 'A plain mb-1.5 or ml-1.5 on the bubble. Unlike the hovercard\'s pt-2 bridge this is an ordinary margin, because the pointer never has to cross it — the moment it does, the component is the wrong one.'],
      ['Arrow', 'Optional. A size-2 square rotated 45 degrees in the same zinc-900, tucked half under the bubble edge. It lives inside the bubble so pointer-events-none covers it, and it is dropped whenever the bubble has been shifted independently of the trigger.'],
      ['Shortcut', 'A kbd inside the bubble, aria-hidden, in the same plain wording the dropdown uses — Ctrl D, not a glyph. The machine form goes in aria-keyshortcuts on the trigger.'],
      ['Pointer guard', 'One over() method between every mouseenter and show(), testing (hover: hover) and (pointer: fine) at call time. It is the only thing standing between a tap and a bubble parked over the button that was tapped.'],
      ['Edge anchor', 'left-0 on the first control of a bar, right-0 on the last, centred only in the middle. Written into the markup, not computed, because the geometry of a fixed bar is known before it renders.'],
      ['Delay group', 'One x-data on a toolbar, a rail or a table holding the open id and a warm flag, so the first label in a row costs 150ms and the rest are instant.'],
      ['Clip probe', 'An x-ref on the truncated text and a scrollWidth against clientWidth read at hover time, so a cell that fits shows no bubble at all.'],
      ['Phone route', 'The same labels written out below sm — icon-and-text rows, or a menu whose items say what the bubbles said. Not part of the tooltip, and the reason the tooltip is allowed to exist.']
    ],
    behaviour: [
      'The pointer arriving on the trigger opens it after about 150ms; the pointer leaving closes it at once. There is no close delay and no way to keep it open, because there is nothing in it to reach.',
      'Focus-visible opens it immediately and blur closes it. A click that happens to focus the button does not open it, so pressing an icon button does not leave a label sitting over the toolbar.',
      'A tap opens nothing. The pointer path tests for a fine pointer that can hover before it starts the timer, so the synthetic mouseenter a touch screen sends ahead of the click is discarded and the tap reaches the control unobstructed.',
      'Escape hides it from anywhere on the page and leaves focus on the trigger. The user can carry on tabbing without having lost their place, and pressing Escape again does whatever the page would have done anyway.',
      'Scrolling closes whatever the pointer opened, on the scroller and on the window both. What focus opened survives, because the browser scrolls a control into view as it focuses it and that scroll would otherwise close the label the same keypress just asked for.',
      'The bubble never takes the pointer. Hovering the space it occupies hovers whatever is underneath, which is usually the row behind it.',
      'Within a delay group the first label waits out the delay and every label after it appears the instant the pointer arrives, until the pointer has been off the group for about a second.',
      'Two bubbles can be on screen at once — one where focus is and one under the pointer — and that is correct rather than a bug to serialise away. They are answering two different questions.',
      'A truncated cell opens a bubble only when the text is actually clipped, and the measurement is taken at hover rather than at init, because column widths change with the viewport and a flag computed once goes stale on the first resize.',
      'On a touch device nothing opens: there is no hover, and a tap goes to the control. The label is the same one that is in the accessible name, so the tap target is still named — and where the label was doing real work, the phone layout writes it out instead of hiding it behind a gesture that does not exist.',
      'Nothing pins it. It is not sticky on scroll, it has no close button, and it disappears the moment the pointer or focus moves — which is the whole reason it may not hold anything that has to be read.'
    ],
    a11y: [
      'aria-describedby when the trigger already has an accessible name and the bubble adds to it; aria-labelledby, or an aria-label with the bubble aria-hidden, when the bubble is the name. Backwards, the first case produces a control whose name is read twice and the second a control announced as "button" with no name at all.',
      'The naming attribute is written once in the markup and left there. A reference resolves through an element that x-show has at display:none, so the button is named while the bubble is invisible; toggling the attribute with the visibility makes readers re-announce the control on every pass of the pointer.',
      'The bubble carries role="tooltip" when it is the thing being referenced, and aria-hidden="true" when the trigger already holds the same string. It is never both exposed and duplicated.',
      'The bubble is never focusable and holds nothing focusable. It adds no tab stops, so a toolbar of eight tooltipped icon buttons is still eight tab stops, and a register of fifty rows adds none at all.',
      'It opens on focus-visible as well as hover. Content available only on hover does not exist for a keyboard user, and when that content is the name of an icon button, neither does the button. The single exception is a truncated cell, where the bubble is a second copy of a string the reader already has in full, and adding a tab stop per row to reveal it costs more than it returns.',
      'Escape dismisses it without moving the pointer and without moving focus; it does not vanish on a timer; and it does not obscure the control it names, since it sits clear of the trigger and takes no pointer events. Those are the three halves of WCAG 1.4.13 for content shown on hover, met by a component small enough that the third one costs nothing. The one way to break the third is an unguarded pointer path on a touch screen, where the bubble opens on the tap and lands on the button that was tapped.',
      'A shortcut in the bubble is aria-hidden and the key goes in aria-keyshortcuts on the trigger, the same split the dropdown uses. Glyphs left in an accessible name are read literally — a name ending in "place of interest sign" is a riddle, not a label.',
      'A truncated cell already contains its full text in the DOM, because truncation is visual only. The bubble repeating it is aria-hidden and there is no aria-describedby: a reader gets the whole string once, from the cell.',
      'A control that is genuinely disabled is out of the tab order, so a tooltip on it can never be reached by keyboard. Where the reason matters, keep the button focusable with aria-disabled="true" and neutralise the click; where it does not, put the reason in help text rather than behind a hover.',
      'Touch and disabled are the same failure twice. A disabled control cannot be hovered or focused; a touch screen cannot hover anything at all. In both cases the bubble is unreachable, so whatever it said has to be on the page as well — which is the test to apply before writing one: read the screen with every tooltip deleted and check that nothing needed has gone with them.'
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
     focus inside it and a root-scoped keydown would never fire.

     Every mouseenter goes through over() rather than straight to show(). A
     touch screen fires a synthetic mouseenter ahead of the click, so without
     the pointer test a tap opens a bubble that then sits over the button that
     was just pressed until something else is tapped — a tooltip obscuring the
     control it names, which is the one thing 1.4.13 does not allow. The media
     query is read inside the method and not cached at init, because a docked
     tablet answers one way and the same tablet undocked answers the other.
     The focus path skips the guard: a keyboard is a keyboard on any hardware. -->
<div data-kui="tooltip/icon" class="flex items-center gap-3">

  <span class="relative inline-flex"
        x-data="{
          open: false, timer: 0,
          over() { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show() },
          show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
          hide() { clearTimeout(this.timer); this.open = false }
        }"
        @keydown.escape.window="hide()">
    <button type="button" aria-labelledby="tt-duplicate"
            @mouseenter="over()" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show(0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="copy" class="size-4"></i>
    </button>
    <span id="tt-duplicate" role="tooltip" x-show="open" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Duplicate order</span>
  </span>

  <span class="relative inline-flex"
        x-data="{
          open: false, timer: 0,
          over() { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show() },
          show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
          hide() { clearTimeout(this.timer); this.open = false }
        }"
        @keydown.escape.window="hide()">
    <button type="button" aria-label="Print order"
            @mouseenter="over()" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show(0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id) },
       show(id, d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = id, d) },
       hide() { clearTimeout(this.timer); this.open = null }
     }"
     @keydown.escape.window="hide()">

  <span class="relative inline-flex">
    <button type="button" aria-labelledby="tt-place-top"
            @mouseenter="over('top')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('top', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="arrow-up" class="size-4"></i>
    </button>
    <span id="tt-place-top" role="tooltip" x-show="open === 'top'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Top — the default</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-labelledby="tt-place-right"
            @mouseenter="over('right')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('right', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="arrow-right" class="size-4"></i>
    </button>
    <span id="tt-place-right" role="tooltip" x-show="open === 'right'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute top-1/2 left-full z-40 ml-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Right — icon rails</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-labelledby="tt-place-bottom"
            @mouseenter="over('bottom')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('bottom', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="arrow-down" class="size-4"></i>
    </button>
    <span id="tt-place-bottom" role="tooltip" x-show="open === 'bottom'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute top-full left-1/2 z-40 mt-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Bottom — topbars</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-labelledby="tt-place-left"
            @mouseenter="over('left')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('left', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="arrow-left" class="size-4"></i>
    </button>
    <span id="tt-place-left" role="tooltip" x-show="open === 'left'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute top-1/2 right-full z-40 mr-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Left — the last column</span>
  </span>

</div>` },

      { id: 'edge', name: 'Anchored so it cannot leave the page', tagNew: true, code:
`<!-- Three bubbles in one card header, each anchored to the side that cannot
     run off the screen, and the choice is made in the markup rather than
     measured at runtime.

     The back button is the first control on the row, so a centred bubble hangs
     half of itself off the left of the card and, at 390px, off the page. It
     takes left-0 and grows inwards.

     Print is in the middle of the group with a control either side of it, and
     that is the only condition under which centring is safe. Nothing about it
     is a default.

     Export is the last control on the row. It takes right-0, and its label is
     long enough that a nowrap bubble would still be wider than the card, so it
     gives up whitespace-nowrap and takes max-w-[calc(100vw-2rem)] instead. A
     nowrap bubble ignores a max width — the box is capped and the line runs
     straight out of it — so the two go together or neither works. This is one
     of the two places the one-line rule bends, and it bends here because the
     alternative is a page that scrolls sideways on a phone.

     All three hang below the row rather than above it. This is a card header,
     and above a card header is the page header — the bottom placement is the
     same decision the topbar makes and has nothing to do with the sides.

     No arrow on the anchored two. An arrow only tells the truth while the
     bubble is centred on the trigger, and pointing it back at a bubble that
     has been shifted is more machinery than a label is worth.

     Nothing here reads getBoundingClientRect. In a bar with a known number of
     controls the overflow is known when the markup is written, and a placement
     chosen once beats a clamp recomputed on every open — which also has to be
     recomputed on resize, on scroll, and on the sidebar collapsing. -->
<div data-kui="tooltip/edge" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, timer: 0,
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id) },
       show(id, d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = id, d) },
       hide() { clearTimeout(this.timer); this.open = null }
     }"
     @keydown.escape.window="hide()">

  <div class="flex items-center gap-2 border-b border-zinc-200 px-3 py-2">

    <span class="relative inline-flex shrink-0">
      <button type="button" aria-label="Back to the register"
              @mouseenter="over('back')" @mouseleave="hide()"
              @focus="if ($event.target.matches(':focus-visible')) show('back', 0)" @blur="hide()"
              class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="arrow-left" class="size-4"></i>
      </button>
      <span aria-hidden="true" x-show="open === 'back'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute top-full left-0 z-40 mt-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Back to the register</span>
    </span>

    <p class="min-w-0 flex-1 truncate text-[13px]/5 font-medium tabular-nums">PO-24-1187 · Gujarat Polymers Ltd</p>

    <span class="relative inline-flex shrink-0">
      <button type="button" aria-label="Print order"
              @mouseenter="over('print')" @mouseleave="hide()"
              @focus="if ($event.target.matches(':focus-visible')) show('print', 0)" @blur="hide()"
              class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="printer" class="size-4"></i>
      </button>
      <span aria-hidden="true" x-show="open === 'print'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute top-full left-1/2 z-40 mt-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Print order</span>
    </span>

    <span class="relative inline-flex shrink-0">
      <button type="button" aria-label="Export the order lines"
              @mouseenter="over('export')" @mouseleave="hide()"
              @focus="if ($event.target.matches(':focus-visible')) show('export', 0)" @blur="hide()"
              class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="download" class="size-4"></i>
      </button>
      <span aria-hidden="true" x-show="open === 'export'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute top-full right-0 z-40 mt-1.5 max-w-[calc(100vw-2rem)] rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 text-white">Export the order lines as a spreadsheet</span>
    </span>

  </div>

  <dl class="grid grid-cols-2 gap-x-4 gap-y-2 px-3 py-3 text-[13px]/5">
    <dt class="text-zinc-500">Order value</dt>
    <dd class="text-right font-medium tabular-nums">₹18,42,000</dd>
    <dt class="text-zinc-500">Delivery window</dt>
    <dd class="text-right tabular-nums">04 Sep 2026 – 11 Sep 2026</dd>
  </dl>

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

     The bubble wraps, which is the exception the one-line rule allows for a
     string that was already too long for its column. It is capped at
     calc(100vw-2rem) and anchored right-0 until sm, because this is the last
     column of the table: a left-anchored bubble on a cell that starts halfway
     across a 390px screen finishes well past the right edge of it, and a
     register that scrolls sideways on a phone is the defect rule 16 names.

     The card is not overflow-hidden — that is what clips a bubble at the row
     it opens on — so the header cells are rounded instead. truncate on the
     cell itself would clip it too, which is why the ellipsis lives on an inner
     span and the positioned wrapper around it does no clipping of its own. -->
<div data-kui="tooltip/truncated" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, timer: 0,
       over(id, el) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id, el) },
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
                  @mouseenter="over('long', $refs.long)" @mouseleave="hide()"
                  class="block truncate text-zinc-600">MS angles 50×50×6 and plates 10 mm, IS 2062 E250 BR, Waluj plant August lot</span>
            <span aria-hidden="true" x-show="open === 'long'" x-cloak x-transition.opacity.duration.100ms
                  class="pointer-events-none absolute top-full right-0 z-40 mt-1.5 max-w-[calc(100vw-2rem)] rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 text-white sm:right-auto sm:left-0 sm:max-w-sm">MS angles 50×50×6 and plates 10 mm, IS 2062 E250 BR, Waluj plant August lot</span>
          </span>
        </td>
      </tr>
      <tr>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1163</td>
        <td class="px-4 py-2.5">
          <span class="relative block">
            <span x-ref="short"
                  @mouseenter="over('short', $refs.short)" @mouseleave="hide()"
                  class="block truncate text-zinc-600">HR coil 2.5 mm</span>
            <span aria-hidden="true" x-show="open === 'short'" x-cloak x-transition.opacity.duration.100ms
                  class="pointer-events-none absolute top-full right-0 z-40 mt-1.5 max-w-[calc(100vw-2rem)] rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 text-white sm:right-auto sm:left-0 sm:max-w-sm">HR coil 2.5 mm</span>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'inline', name: 'A term inside a sentence', tagNew: true, code:
`<!-- An abbreviation being read inside a paragraph, not a control being named.
     The trigger is still a real button — anything that shows content on hover
     has to be reachable on focus, and only a control is — with a dotted
     underline rather than a solid one so it does not read as a link. It
     navigates nowhere.

     The wrapper is inline-block and not inline, and that is the whole reason
     this variant exists. An inline box that breaks across a line is fragmented
     into two boxes, and an absolutely positioned child resolves against the
     first fragment, so a term that lands at the end of a line gets its bubble
     parked at the start of the line above, pointing at nothing. inline-block
     also keeps the term itself from breaking in half, which is why the terms
     wearing one have to be short — a whole clause set inline-block leaves a
     ragged hole in the paragraph.

     aria-describedby, because the button already has a name and that name is
     the abbreviation the user is looking at. labelledby would replace DAP with
     the expansion, and a reader working through the sentence would be given a
     string that is not the one on the page.

     The bubble wraps and is capped, the second of the two places the one-line
     rule bends. An expansion is a phrase; if it needs two sentences it is not
     a tooltip, it is the glossary, and the glossary is linked under the
     paragraph — which is also the only route to any of this on a phone, where
     none of these bubbles exist.

     Not abbr with a title. A title never opens on focus, never opens on touch,
     and is read as the name by some readers and skipped by others. -->
<div data-kui="tooltip/inline" class="max-w-xl rounded-xl border border-zinc-300 bg-white p-4"
     x-data="{
       open: null, timer: 0,
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id) },
       show(id, d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = id, d) },
       hide() { clearTimeout(this.timer); this.open = null }
     }"
     @keydown.escape.window="hide()">

  <h3 class="text-[13px]/5 font-medium">Delivery terms</h3>

  <p class="mt-2 text-[14px]/5 text-zinc-600">Material moves
    <span class="relative inline-block">
      <button type="button" aria-describedby="tt-dap"
              @mouseenter="over('dap')" @mouseleave="hide()"
              @focus="if ($event.target.matches(':focus-visible')) show('dap', 0)" @blur="hide()"
              class="text-zinc-900 underline decoration-dotted underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">DAP</button>
      <span id="tt-dap" role="tooltip" x-show="open === 'dap'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute bottom-full left-0 z-40 mb-1.5 max-w-[calc(100vw-2rem)] rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 text-white sm:max-w-xs">Delivered at place — freight and insurance to the Waluj gate are the vendor\'s</span>
    </span>
    to Waluj in three lots against <span class="tabular-nums">PO-24-1187</span>, all of it
    <span class="relative inline-block">
      <button type="button" aria-describedby="tt-grade"
              @mouseenter="over('grade')" @mouseleave="hide()"
              @focus="if ($event.target.matches(':focus-visible')) show('grade', 0)" @blur="hide()"
              class="text-zinc-900 underline decoration-dotted underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">E250&nbsp;BR</button>
      <span id="tt-grade" role="tooltip" x-show="open === 'grade'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute bottom-full left-0 z-40 mb-1.5 max-w-[calc(100vw-2rem)] rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tabular-nums text-white sm:max-w-xs">IS 2062 grade E250, quality BR — 250 MPa yield, notch tested at 0 °C</span>
    </span>
    to IS 2062, with test certificates against every heat number.</p>

  <p class="mt-3 text-[12px]/4 text-zinc-500">Every incoterm and material grade on this order is written out on the <a href="#" class="text-zinc-900 underline underline-offset-2">Terms tab</a>.</p>

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
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id) },
       show(id, d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = id, d) },
       hide() { clearTimeout(this.timer); this.open = null }
     }"
     @keydown.escape.window="hide()">

  <span class="relative inline-flex">
    <button type="button" aria-describedby="tt-save" aria-keyshortcuts="Control+S"
            @mouseenter="over('save')" @mouseleave="hide()"
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
            @mouseenter="over('search')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('search', 0)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
     operated. This form is pointer-only by construction, and pointer-only
     means mouse-only: it is unreachable from the keyboard and unreachable on a
     phone, which is the same failure a touch device produces on every tooltip
     in this entry, arriving here on a desktop as well.

     Right, and the better answer whenever the reason actually matters: leave
     the button enabled in the DOM, mark it aria-disabled="true" and neutralise
     the click. It keeps its tab stop, it is announced as dimmed, the tooltip
     opens on focus like any other, and aria-describedby carries the reason
     into the name computation. The disabled: variants do not apply to it, so
     the flat look is written as plain classes.

     Either way the reason is printed under the buttons as well, which is what
     the line at the foot of this card is. A rule that decides whether somebody
     can post a receipt is not something to hide behind a hover, and the test
     is to read the card with both bubbles deleted and check that nothing has
     gone with them. -->
<div data-kui="tooltip/disabled" class="max-w-md rounded-xl border border-zinc-300 bg-white p-4">

  <div class="flex flex-wrap items-center gap-3">

    <span class="relative inline-flex"
          x-data="{
            open: false, timer: 0,
            over() { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show() },
            show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
            hide() { clearTimeout(this.timer); this.open = false }
          }"
          @mouseenter="over()" @mouseleave="hide()"
          @keydown.escape.window="hide()">
      <button type="button" disabled aria-describedby="tt-void"
              class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium text-zinc-400 disabled:pointer-events-none">
        <i data-lucide="ban" class="size-4"></i>Void GRN
      </button>
      <span id="tt-void" role="tooltip" x-show="open" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute bottom-full left-0 z-40 mb-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Already invoiced — voiding is closed</span>
    </span>

    <span class="relative inline-flex"
          x-data="{
            open: false, timer: 0,
            over() { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show() },
            show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
            hide() { clearTimeout(this.timer); this.open = false }
          }"
          @keydown.escape.window="hide()">
      <button type="button" aria-disabled="true" aria-describedby="tt-post"
              @click.prevent
              @mouseenter="over()" @mouseleave="hide()"
              @focus="if ($event.target.matches(':focus-visible')) show(0)" @blur="hide()"
              class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium text-zinc-400 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="check-circle-2" class="size-4"></i>Post to stock
      </button>
      <span id="tt-post" role="tooltip" x-show="open" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute bottom-full right-0 z-40 mb-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Needs a Level 2 approver</span>
    </span>

  </div>

  <p class="mt-3 text-[12px]/4 text-zinc-500">GRN-2608-041 was invoiced on 12 Sep 2026, so it can no longer be voided. Posting to stock above ₹10,00,000 is released by a Level 2 approver.</p>

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
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id) },
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
                    @mouseenter="over('mfi')" @mouseleave="hide()"
                    @focus="if ($event.target.matches(':focus-visible')) show('mfi', 0)" @blur="hide()"
                    class="underline decoration-dotted underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">MFI</button>
            <span id="tt-mfi" role="tooltip" x-show="open === 'mfi'" x-cloak x-transition.opacity.duration.100ms
                  class="pointer-events-none absolute top-full right-0 z-40 mt-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 tracking-normal whitespace-nowrap text-white normal-case">Melt flow index, g/10 min at 190 °C</span>
          </span>
        </th>
        <th scope="col" class="px-3 py-2 text-right font-medium">
          <span class="relative inline-flex">
            <button type="button" aria-describedby="tt-ash"
                    @mouseenter="over('ash')" @mouseleave="hide()"
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
                    @mouseenter="over('fail')" @mouseleave="hide()"
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
          over() { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show() },
          show(d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = true, d) },
          hide() { clearTimeout(this.timer); this.open = false }
        }"
        @keydown.escape.window="hide()">
    <button type="button" aria-labelledby="tt-arrow"
            @mouseenter="over()" @mouseleave="hide()"
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

      { id: 'scrolling', name: 'Inside a scrolling list', tagNew: true, code:
`<!-- A queue with a fixed height is where the absolutely-positioned bubble
     runs out of room, and it is worth saying exactly why rather than reaching
     for position:fixed.

     overflow-y:auto computes overflow-x to auto as well. There is no such
     thing as a box that scrolls one axis and lets a child hang out of the
     other, so a bubble placed above, below or right of a row in this list is
     either cut off at the box edge or gives the list a horizontal scrollbar it
     never had. The bubble goes inside the box, on the row it belongs to,
     left of the button — where the only thing it can cover is the row text,
     which is still there when it closes.

     Scrolling hides it. A wheel under a stationary pointer moves the row out
     from under the cursor without firing mouseleave, and the bubble is left
     naming the batch that used to be there — in a queue of near-identical
     numbers, pointing confidently at the wrong record. The handler is bound on
     the scroller and on the window, because the page moves too, and it is
     passive so the list still scrolls at full rate.

     What focus opened survives a scroll, and that distinction is not
     decoration. Tabbing to a row that is half out of view makes the browser
     scroll it into view, which fires scroll a frame after the focus handler
     opened the label — so a scroll handler that closed everything would close
     the label the keypress just asked for, every time, and the queue would be
     unlabelled for exactly the people who need the labels. via records which
     input opened it.

     The header sits outside the scroller so it does not scroll away, and the
     card keeps its rounded corners while the scroller keeps square ones —
     rounding the scroller would clip the first and last row against a curve. -->
<div data-kui="tooltip/scrolling" class="max-w-md rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, via: null, timer: 0,
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id, 'pointer') },
       show(id, how) {
         clearTimeout(this.timer);
         const d = how === 'focus' ? 0 : 150;
         this.timer = setTimeout(() => { this.open = id; this.via = how }, d);
       },
       hide() { clearTimeout(this.timer); this.open = null; this.via = null },
       scrolled() { if (this.via === 'pointer') this.hide() }
     }"
     @scroll.window.passive="scrolled()"
     @keydown.escape.window="hide()">

  <div class="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-2">
    <h3 class="text-[13px]/5 font-medium">Inspection queue</h3>
    <span class="text-[12px]/4 tabular-nums text-zinc-500">6 on hold</span>
  </div>

  <div class="max-h-56 overflow-y-auto" @scroll.passive="scrolled()">

    <div class="flex items-center gap-3 border-b border-zinc-100 px-4 py-2 hover:bg-zinc-100">
      <span class="size-1.5 shrink-0 rounded-full bg-red-600" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 truncate text-[13px]/5"><span class="font-medium tabular-nums">B-2608-14</span> · HDPE blow moulding</span>
      <span class="relative inline-flex shrink-0">
        <button type="button" aria-label="Open the inspection for B-2608-14"
                @mouseenter="over('b14')" @mouseleave="hide()"
                @focus="if ($event.target.matches(':focus-visible')) show('b14', 'focus')" @blur="hide()"
                class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="clipboard-check" class="size-4"></i>
        </button>
        <span aria-hidden="true" x-show="open === 'b14'" x-cloak x-transition.opacity.duration.100ms
              class="pointer-events-none absolute top-1/2 right-full z-40 mr-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Open the inspection</span>
      </span>
    </div>

    <div class="flex items-center gap-3 border-b border-zinc-100 px-4 py-2 hover:bg-zinc-100">
      <span class="size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 truncate text-[13px]/5"><span class="font-medium tabular-nums">B-2608-15</span> · HDPE blow moulding</span>
      <span class="relative inline-flex shrink-0">
        <button type="button" aria-label="Open the inspection for B-2608-15"
                @mouseenter="over('b15')" @mouseleave="hide()"
                @focus="if ($event.target.matches(':focus-visible')) show('b15', 'focus')" @blur="hide()"
                class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="clipboard-check" class="size-4"></i>
        </button>
        <span aria-hidden="true" x-show="open === 'b15'" x-cloak x-transition.opacity.duration.100ms
              class="pointer-events-none absolute top-1/2 right-full z-40 mr-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Open the inspection</span>
      </span>
    </div>

    <div class="flex items-center gap-3 border-b border-zinc-100 px-4 py-2 hover:bg-zinc-100">
      <span class="size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 truncate text-[13px]/5"><span class="font-medium tabular-nums">B-2608-16</span> · LLDPE film grade</span>
      <span class="relative inline-flex shrink-0">
        <button type="button" aria-label="Open the inspection for B-2608-16"
                @mouseenter="over('b16')" @mouseleave="hide()"
                @focus="if ($event.target.matches(':focus-visible')) show('b16', 'focus')" @blur="hide()"
                class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="clipboard-check" class="size-4"></i>
        </button>
        <span aria-hidden="true" x-show="open === 'b16'" x-cloak x-transition.opacity.duration.100ms
              class="pointer-events-none absolute top-1/2 right-full z-40 mr-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Open the inspection</span>
      </span>
    </div>

    <div class="flex items-center gap-3 border-b border-zinc-100 px-4 py-2 hover:bg-zinc-100">
      <span class="size-1.5 shrink-0 rounded-full bg-zinc-500" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 truncate text-[13px]/5"><span class="font-medium tabular-nums">B-2608-17</span> · LLDPE film grade</span>
      <span class="relative inline-flex shrink-0">
        <button type="button" aria-label="Open the inspection for B-2608-17"
                @mouseenter="over('b17')" @mouseleave="hide()"
                @focus="if ($event.target.matches(':focus-visible')) show('b17', 'focus')" @blur="hide()"
                class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="clipboard-check" class="size-4"></i>
        </button>
        <span aria-hidden="true" x-show="open === 'b17'" x-cloak x-transition.opacity.duration.100ms
              class="pointer-events-none absolute top-1/2 right-full z-40 mr-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Open the inspection</span>
      </span>
    </div>

    <div class="flex items-center gap-3 border-b border-zinc-100 px-4 py-2 hover:bg-zinc-100">
      <span class="size-1.5 shrink-0 rounded-full bg-zinc-500" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 truncate text-[13px]/5"><span class="font-medium tabular-nums">B-2608-18</span> · PP copolymer</span>
      <span class="relative inline-flex shrink-0">
        <button type="button" aria-label="Open the inspection for B-2608-18"
                @mouseenter="over('b18')" @mouseleave="hide()"
                @focus="if ($event.target.matches(':focus-visible')) show('b18', 'focus')" @blur="hide()"
                class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="clipboard-check" class="size-4"></i>
        </button>
        <span aria-hidden="true" x-show="open === 'b18'" x-cloak x-transition.opacity.duration.100ms
              class="pointer-events-none absolute top-1/2 right-full z-40 mr-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Open the inspection</span>
      </span>
    </div>

    <div class="flex items-center gap-3 px-4 py-2 hover:bg-zinc-100">
      <span class="size-1.5 shrink-0 rounded-full bg-zinc-500" aria-hidden="true"></span>
      <span class="min-w-0 flex-1 truncate text-[13px]/5"><span class="font-medium tabular-nums">B-2608-19</span> · PP copolymer</span>
      <span class="relative inline-flex shrink-0">
        <button type="button" aria-label="Open the inspection for B-2608-19"
                @mouseenter="over('b19')" @mouseleave="hide()"
                @focus="if ($event.target.matches(':focus-visible')) show('b19', 'focus')" @blur="hide()"
                class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="clipboard-check" class="size-4"></i>
        </button>
        <span aria-hidden="true" x-show="open === 'b19'" x-cloak x-transition.opacity.duration.100ms
              class="pointer-events-none absolute top-1/2 right-full z-40 mr-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Open the inspection</span>
      </span>
    </div>

  </div>
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

     The three middle labels are centred and the two on the ends are not. Bold
     anchors left-0 and Clear formatting right-0, because a centred bubble on
     the first or last button of a bar hangs half of itself off the side of the
     toolbar, and at 390px off the page.

     The five buttons are written out rather than looped with x-for, because
     the icon name would have to become :data-lucide — a binding on the one
     node createIcons() is about to replace with an svg. -->

<div data-kui="tooltip/delay-group" class="inline-flex items-center gap-1 rounded-xl border border-zinc-300 bg-white p-1"
     x-data="{
       open: null, warm: false, timer: 0, cool: 0,
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id) },
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
            @mouseenter="over('bold')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('bold', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="bold" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'bold'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-0 z-40 mb-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Bold</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-label="Italic"
            @mouseenter="over('italic')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('italic', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="italic" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'italic'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Italic</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-label="Bulleted list"
            @mouseenter="over('list')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('list', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="list" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'list'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Bulleted list</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-label="Insert link"
            @mouseenter="over('link')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('link', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="link" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'link'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Insert link</span>
  </span>

  <span class="relative inline-flex">
    <button type="button" aria-label="Clear formatting"
            @mouseenter="over('clear')" @mouseleave="hide()"
            @focus="if ($event.target.matches(':focus-visible')) show('clear', true)" @blur="hide()"
            class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="eraser" class="size-4"></i>
    </button>
    <span aria-hidden="true" x-show="open === 'clear'" x-cloak x-transition.opacity.duration.100ms
          class="pointer-events-none absolute right-0 bottom-full z-40 mb-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Clear formatting</span>
  </span>

</div>` },

      { id: 'rail', name: 'On a collapsed icon rail', tagNew: true, code:
`<!-- The rail is the largest single consumer of this component and the one
     place a screen is entirely dependent on it: eleven destinations, no visible
     text, and a bubble that is the only thing telling a sighted user which is
     which.

     sidebar/rail ships this with no JavaScript at all — group-hover and
     group-focus-within on a wrapper, which is right for a rail of eleven links
     and costs nothing. Two things it cannot do, and this is the swap-in for
     when either matters. A CSS-only bubble has no state to clear, so Escape
     does nothing and the dismissible half of 1.4.13 is simply unmet. And
     group-focus-within fires on any focus, including the focus a click puts on
     the item, so clicking a destination leaves its label sitting over the page
     that has just been navigated to. focus-visible is the whole difference.

     One delay group over the nav, warmed at 150ms rather than the toolbar's
     400ms. A pointer resting on a rail item is nearly always asking what it is;
     a pointer crossing a toolbar is usually on its way somewhere else.

     Right placement is forced, not chosen: above and below a rail item is the
     next rail item. Copy the whole thing to the left edge of the page and it
     stays right — the bubble opens into the content column, which is the one
     direction with room.

     The nav must not scroll. overflow-y:auto forces overflow-x to auto and
     every bubble is then cut off at the 68px edge; more destinations than fit
     is what sidebar/flyout is for.

     The count is a real element on the item and only a shorthand in the bubble.
     Two digits fit the pill and three do not, and the quantity that cannot be
     drawn goes into the aria-label — which is why the anchor is named
     "Approvals, 4 waiting" while the bubble, aria-hidden, says four. -->
<div data-kui="tooltip/rail" class="flex w-[68px] flex-col rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, warm: false, timer: 0, cool: 0,
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id) },
       show(id, now = false) {
         clearTimeout(this.timer); clearTimeout(this.cool);
         if (now || this.warm) { this.open = id; this.warm = true; return }
         this.timer = setTimeout(() => { this.open = id; this.warm = true }, 150);
       },
       hide() {
         clearTimeout(this.timer);
         this.open = null;
         this.cool = setTimeout(() => this.warm = false, 800);
       }
     }"
     @keydown.escape.window="hide()">

  <div class="flex h-14 shrink-0 items-center justify-center border-b border-zinc-200">
    <span class="flex size-8 items-center justify-center rounded-lg bg-zinc-700 text-white" aria-hidden="true"><i data-lucide="package" class="size-[18px]"></i></span>
  </div>

  <nav aria-label="Main" class="space-y-1 py-2">

    <div class="relative flex justify-center">
      <a href="#" aria-label="Overview"
         @mouseenter="over('overview')" @mouseleave="hide()"
         @focus="if ($event.target.matches(':focus-visible')) show('overview', true)" @blur="hide()"
         class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="layout-dashboard" class="size-[18px]"></i>
      </a>
      <span aria-hidden="true" x-show="open === 'overview'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute top-1/2 left-full z-40 ml-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Overview</span>
    </div>

    <div class="relative flex justify-center">
      <a href="#" aria-current="page" aria-label="Purchase orders"
         @mouseenter="over('orders')" @mouseleave="hide()"
         @focus="if ($event.target.matches(':focus-visible')) show('orders', true)" @blur="hide()"
         class="flex size-10 items-center justify-center rounded-lg bg-zinc-200 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="file-text" class="size-[18px]"></i>
      </a>
      <span aria-hidden="true" x-show="open === 'orders'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute top-1/2 left-full z-40 ml-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Purchase orders</span>
    </div>

    <div class="relative flex justify-center">
      <a href="#" aria-label="Goods receipts"
         @mouseenter="over('grn')" @mouseleave="hide()"
         @focus="if ($event.target.matches(':focus-visible')) show('grn', true)" @blur="hide()"
         class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="truck" class="size-[18px]"></i>
      </a>
      <span aria-hidden="true" x-show="open === 'grn'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute top-1/2 left-full z-40 ml-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Goods receipts</span>
    </div>

    <div class="relative flex justify-center">
      <a href="#" aria-label="Approvals, 4 waiting"
         @mouseenter="over('approvals')" @mouseleave="hide()"
         @focus="if ($event.target.matches(':focus-visible')) show('approvals', true)" @blur="hide()"
         class="relative flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="check-circle-2" class="size-[18px]"></i>
        <span aria-hidden="true" class="absolute -top-1 -right-1 rounded-full bg-zinc-700 px-1 text-[11px]/4 tabular-nums text-white ring-2 ring-white">4</span>
      </a>
      <span aria-hidden="true" x-show="open === 'approvals'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute top-1/2 left-full z-40 ml-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Approvals · 4 waiting</span>
    </div>

    <div class="relative flex justify-center">
      <a href="#" aria-label="Vendors"
         @mouseenter="over('vendors')" @mouseleave="hide()"
         @focus="if ($event.target.matches(':focus-visible')) show('vendors', true)" @blur="hide()"
         class="flex size-10 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="building-2" class="size-[18px]"></i>
      </a>
      <span aria-hidden="true" x-show="open === 'vendors'" x-cloak x-transition.opacity.duration.100ms
            class="pointer-events-none absolute top-1/2 left-full z-40 ml-1.5 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Vendors</span>
    </div>

  </nav>
</div>` },

      { id: 'touch', name: 'What the phone gets instead', tagNew: true, code:
`<!-- The only component in this library that a touch device cannot produce at
     all. There is no hover on a phone and a tap belongs to the control, so a
     label that lives only in a bubble does not exist there — and on a register
     of icon buttons that means a screen of unlabelled squares. Tap-to-open is
     not the way out: it spends the first tap on the label and the second on the
     action, and users tap twice on everything from then on.

     So the label stops being a tooltip below sm. The same three actions are
     written out as rows with their names on them, and no bubble is involved.
     Both forms are in the DOM and hidden switches between them, which also
     keeps the one that is not showing out of the accessibility tree — two
     copies of the actions would otherwise be announced on every device.

     The guard in over() is a separate thing from the breakpoint and both are
     needed. A 1280px touch panel on a shop floor gets the icon row, has no
     hover, and still sends a synthetic mouseenter before every tap: without
     the media query that tap opens a bubble which then sits over the button
     that was pressed until something else is touched. Width decides the
     layout; pointer type decides the behaviour; neither substitutes for the
     other. Read at call time, because a tablet in a keyboard dock is a
     different device from the same tablet out of it.

     The focus path is deliberately not guarded. A keyboard attached to a touch
     device is still a keyboard, and a label that refuses to open for it is the
     same defect one layer down. -->
<div data-kui="tooltip/touch" class="max-w-md rounded-xl border border-zinc-300 bg-white p-4"
     x-data="{
       open: null, timer: 0,
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id) },
       show(id, d = 150) { clearTimeout(this.timer); this.timer = setTimeout(() => this.open = id, d) },
       hide() { clearTimeout(this.timer); this.open = null }
     }"
     @keydown.escape.window="hide()">

  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium tabular-nums">GRN-2608-041</p>
      <p class="text-[12px]/4 text-zinc-500">Gujarat Polymers Ltd · 12 Sep 2026</p>
    </div>

    <div class="hidden shrink-0 items-center gap-1 sm:flex">

      <span class="relative inline-flex">
        <button type="button" aria-label="Print gate pass"
                @mouseenter="over('print')" @mouseleave="hide()"
                @focus="if ($event.target.matches(':focus-visible')) show('print', 0)" @blur="hide()"
                class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="printer" class="size-4"></i>
        </button>
        <span aria-hidden="true" x-show="open === 'print'" x-cloak x-transition.opacity.duration.100ms
              class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Print gate pass</span>
      </span>

      <span class="relative inline-flex">
        <button type="button" aria-label="Attach a document"
                @mouseenter="over('attach')" @mouseleave="hide()"
                @focus="if ($event.target.matches(':focus-visible')) show('attach', 0)" @blur="hide()"
                class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="paperclip" class="size-4"></i>
        </button>
        <span aria-hidden="true" x-show="open === 'attach'" x-cloak x-transition.opacity.duration.100ms
              class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Attach a document</span>
      </span>

      <span class="relative inline-flex">
        <button type="button" aria-label="Post to stock"
                @mouseenter="over('post')" @mouseleave="hide()"
                @focus="if ($event.target.matches(':focus-visible')) show('post', 0)" @blur="hide()"
                class="flex size-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
          <i data-lucide="check-circle-2" class="size-4"></i>
        </button>
        <span aria-hidden="true" x-show="open === 'post'" x-cloak x-transition.opacity.duration.100ms
              class="pointer-events-none absolute right-0 bottom-full z-40 mb-1.5 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Post to stock</span>
      </span>

    </div>
  </div>

  <div class="mt-3 grid gap-1 sm:hidden">
    <button type="button" class="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="printer" class="size-4 text-zinc-600"></i>Print gate pass
    </button>
    <button type="button" class="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="paperclip" class="size-4 text-zinc-600"></i>Attach a document
    </button>
    <button type="button" class="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-left text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="check-circle-2" class="size-4 text-zinc-600"></i>Post to stock
    </button>
  </div>

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

     A register scrolls, and a wheel under a stationary pointer moves the row
     out from under it without a mouseleave — leaving a bubble naming the
     receipt that used to be there. The window scroll handler closes what the
     pointer opened and leaves what focus opened alone, because tabbing to a
     row scrolls it into view and that scroll would otherwise close the label
     the same keypress just opened.

     Below sm the action bar folds to a single menu button. Four 36px targets
     and a value column do not fit in 390px, and the answer is never a table
     that scrolls sideways — the dropdown behind that button carries the same
     four actions with their names written out, which is also the touch route
     to everything these tooltips say. -->
<div data-kui="tooltip/row-actions" class="rounded-xl border border-zinc-300 bg-white"
     x-data="{
       open: null, via: null, warm: false, timer: 0, cool: 0,
       over(id) { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) this.show(id) },
       show(id, now = false) {
         clearTimeout(this.timer); clearTimeout(this.cool);
         if (now || this.warm) { this.open = id; this.via = now ? 'focus' : 'pointer'; this.warm = true; return }
         this.timer = setTimeout(() => { this.open = id; this.via = 'pointer'; this.warm = true }, 400);
       },
       hide() {
         clearTimeout(this.timer);
         this.open = null; this.via = null;
         this.cool = setTimeout(() => this.warm = false, 800);
       },
       scrolled() { if (this.via === 'pointer') this.hide() },
       rows: [
         { id: 'GRN-2608-041', po: 'PO-24-1187', vendor: 'Gujarat Polymers Ltd', value: '₹18,42,000', dot: 'bg-emerald-600', status: 'Closed' },
         { id: 'GRN-2608-040', po: 'PO-24-1186', vendor: 'Konkan Fabricators', value: '₹1,15,400', dot: 'bg-zinc-500', status: 'Open' },
         { id: 'GRN-2608-039', po: 'PO-24-1185', vendor: 'Deshpande Traders', value: '₹96,750', dot: 'bg-amber-500', status: 'Approved' }
       ]
     }"
     @scroll.window.passive="scrolled()"
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
                        @mouseenter="over(r.id + ':open')" @mouseleave="hide()"
                        @focus="if ($event.target.matches(':focus-visible')) show(r.id + ':open', true)" @blur="hide()"
                        class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                  <i data-lucide="eye" class="size-4"></i>
                </button>
                <span aria-hidden="true" x-show="open === r.id + ':open'" x-cloak x-transition.opacity.duration.100ms
                      class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Open receipt</span>
              </span>

              <span class="relative inline-flex">
                <button type="button" :aria-label="'Print ' + r.id"
                        @mouseenter="over(r.id + ':print')" @mouseleave="hide()"
                        @focus="if ($event.target.matches(':focus-visible')) show(r.id + ':print', true)" @blur="hide()"
                        class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                  <i data-lucide="printer" class="size-4"></i>
                </button>
                <span aria-hidden="true" x-show="open === r.id + ':print'" x-cloak x-transition.opacity.duration.100ms
                      class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Print gate pass</span>
              </span>

              <span class="relative inline-flex">
                <button type="button" :aria-label="'Attach a document to ' + r.id"
                        @mouseenter="over(r.id + ':attach')" @mouseleave="hide()"
                        @focus="if ($event.target.matches(':focus-visible')) show(r.id + ':attach', true)" @blur="hide()"
                        class="flex size-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                  <i data-lucide="paperclip" class="size-4"></i>
                </button>
                <span aria-hidden="true" x-show="open === r.id + ':attach'" x-cloak x-transition.opacity.duration.100ms
                      class="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[12px]/4 whitespace-nowrap text-white">Attach a document</span>
              </span>

              <span class="relative inline-flex">
                <button type="button" :aria-label="'More actions on ' + r.id"
                        @mouseenter="over(r.id + ':more')" @mouseleave="hide()"
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
      'This is not a tooltip and must not be built like one. A tooltip is the accessible name of a control, rendered as a zinc-900 bubble, aria-hidden, pointer-events-none, and holding nothing anyone has to read. A hovercard is a white rounded-xl panel with a zinc-300 border and a shadow, it is interactive, and it holds content — which is exactly why it needs the delays, the keyboard route and the dismiss that a tooltip does not.',
      'Open on a delay of 300–500ms. Without one, dragging the pointer diagonally across a column of twelve PO links opens and closes twelve cards on the way to the scrollbar, and the register strobes.',
      'Close on a delay of 150–250ms as well. The pointer has to cross from the trigger into the panel, and it is off both for a frame or two while it does. No close delay means the card can never be reached, only glimpsed — this is WCAG 1.4.13 hoverable, not a nicety.',
      'The gap between trigger and panel is padding on the positioned wrapper, never a margin. A margin is dead space that belongs to nothing, so mouseleave fires as the pointer crosses it; padding on the wrapper keeps the pointer inside the subtree the whole way and the hover never breaks.',
      'Never pointer-events-none on the panel. A hovercard is meant to be clicked into, which is what makes the hover bridge and the close delay load-bearing rather than polish — a tooltip gets away without them precisely because nothing in it can be reached.',
      'Escape closes it, and it is bound on window rather than on the wrapper. A card opened by the pointer has no focus inside it, so a wrapper-scoped keydown never fires and there is no way to dismiss it at all — WCAG 1.4.13 dismissible.',
      'Focus opens it too, through @focusin and @focusout on the wrapper. focus and blur do not bubble, so binding those on the wrapper silently does nothing; and a hovercard with no focus route is a card the keyboard can never see, which is why a tooltip may not hold content and this may.',
      'Open on focus with no delay. The delay exists to survive a pointer travelling across a column; a Tab key lands on one trigger deliberately and waiting 350ms after it reads as lag.',
      'One card open at a time, announced with a window CustomEvent carrying the root element — every other card closes when it hears one that is not itself. The delays alone very nearly serialise it, and very nearly is how two cards end up overlapping on a slow render.',
      'The table wrapper cannot be overflow-hidden or the panel is clipped at the first row it opens on. Round the header cells instead. The same trap is any ancestor carrying transform, filter or will-change: it becomes the containing block, so a position:fixed panel anchors to the row rather than to the viewport, and truncate on the cell clips the panel too.',
      'left-0 anchors the panel to the trigger, so it only survives 390px while the trigger starts its own line — a name halfway through a sentence puts a 320px panel half off the screen and the page scrolls sideways. Either give the trigger the start of a line, which is what a table cell and a labelled field already do, or clamp it with a computed left offset, as the placement and trail variants do. Never let it size itself down to fit.',
      'Fetch at most once per trigger and keep the result. hx-trigger fires the request, a loaded flag stops the second one, and hx-sync="this:drop" throws away a request that arrives while one is in flight. A card that refetches on every pass of the pointer turns a 50-row register into a load test.',
      'One fetch per trigger is not one fetch per record. A register that names the same vendor on eight rows has eight triggers and eight loaded flags, so it still asks the server eight times for one answer. The fragment is a GET, so the browser cache settles it: Cache-Control: private, max-age=120 on the view, and Vary: HX-Request beside it — the same URL answers a hovercard with a fragment and a direct visit with a page, and a cache that cannot tell those apart will serve one in place of the other. private and never public: a shared proxy handing one plant\'s rates to another is a data leak wearing a performance fix.',
      'A card that may be a minute old says how old it is. Nothing else on the screen is cached that long, and a figure with no time against it is read as now — which matters here more than anywhere, because a hovercard is the one place a user checks a number without opening the record it belongs to.',
      'htmx swaps 2xx and nothing else, so a preview of a record that is refused or missing must not be returned as the body of a 403 or a 404. The body is discarded, the panel keeps its skeleton until the pointer leaves, and the user is told nothing. Return 200 with the withheld or tombstone fragment and keep the non-2xx statuses for the failures where retrying is the right offer.',
      'A hovercard never scrolls. The panel sits under a resting pointer, so a wheel gesture inside it scrolls the card instead of the register behind it and the register jumps back when the card closes; and reaching a scrollbar inside the panel means crossing the bridge first, which the close delay only barely allows. Where the record is longer than the card, show the first two or three of whatever it is and one line counting the rest. A max-height with the overflow faded out is worse than the count, because it hides content without saying how much.',
      'When the panel is clamped sideways, the clamp belongs on the positioned wrapper that carries the bridge, not on the card inside it. Move it to the card and the pt-2 strip stays under the trigger while the card slides out from over it, so the pointer falls through the gap at exactly the offsets where the clamp was needed — the right-hand end of a 390px line.',
      'A hovercard goes on a reference to a record and on nothing else. A quantity, a rate, a freight line, a description — none of them has a record behind it, and a register where every cell twitches as the pointer crosses it is harder to read than one with no cards at all. The test is whether the thing under the pointer is a link to somewhere.',
      'On touch, guard the hover handlers with matchMedia(\'(hover: hover) and (pointer: fine)\'). A tap fires a synthetic mouseenter, so an unguarded card opens on the tap that was meant to follow the link, and then nothing closes it.'
    ],
    anatomy: [
      ['Wrapper', 'relative inline-block. It owns the state and every handler, because mouseleave has to mean "left the trigger and the panel", and only their common parent knows that.'],
      ['Trigger', 'A real link to the record, or a real button. It works with the card never opening, and it keeps its own accessible name.'],
      ['Bridge', 'pt-2 or pb-2 on the positioned wrapper, not mt-2 on the panel. It is the strip the pointer crosses, and it has to belong to the component.'],
      ['Panel', 'The positioned wrapper\'s child: w-80, max-w-[calc(100vw_-_1.5rem)], rounded-xl, white, border-zinc-300, shadow-lg, z-40. It floats above the page, so it takes the page edge every floating panel in the system takes, not the zinc-200 border used inside a surface.'],
      ['Identity', 'The first line of the panel — the record number or the person\'s name — with the status pill or presence dot beside it.'],
      ['Figures', 'A dl of two to four facts, dt in zinc-600, dd in zinc-900 and tabular-nums. More than four and the thing being previewed is a page.'],
      ['Remainder', 'One line counting what the card did not show — 15 more lines, and what they come to. The panel is not a scroller, so this line is the only honest way to say there is more.'],
      ['Action', 'At most one, at the foot. It exists on the destination page as well, so nothing is lost when the card never opens.']
    ],
    behaviour: [
      'Hover opens after about 350ms and closes about 200ms after the pointer has left both the trigger and the panel, so the pointer can travel between them and a pass across the column opens nothing.',
      'Focus opens it immediately, tabbing into the panel keeps it open, and tabbing out of the panel closes it — the card a keyboard user can see is the card they can reach.',
      'Escape closes it from anywhere on the page and leaves focus where it was. Nothing closes it on a timer: it stays until the pointer leaves, focus leaves or Escape is pressed.',
      'Only one card is open at a time. Opening one closes the rest through a window event, with no store to keep in sync.',
      'Fetched content is requested on first open and never again. A failed fetch is the exception — it leaves the flag unset, so the next open retries. Two triggers on the same record share one request through the browser cache rather than through anything the page keeps.',
      'A record longer than the panel is cut editorially rather than scrolled: the first few lines and a count of the rest. The panel grows no scrollbar and does not change height while it is open.',
      'A record the reader may not see still opens a card. It shows what they may see, says in a sentence what is withheld and who to ask, and offers no retry, because nothing failed. A record that is gone opens one too — what it was, when it went and what replaced it.',
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
      'Status inside the card follows the fixed dot mapping and the dot is aria-hidden; the word beside it is what carries the state, so the meaning does not live in a colour.',
      'Every trigger declares the focus outline itself. The card exists for the pointer, so the one thing that must not be left to the browser default is the indicator that says where the keyboard is — a trigger with no outline is a link that opens a panel nobody can see themselves standing on.',
      'The skeleton is role="status" with aria-busy, and aria-busy is cleared when the swap lands. A div carrying an aria-label and no role is ignored by most readers, and a panel left aria-busy for the life of the page keeps announcing that content is on its way long after it arrived.',
      'A withheld figure is written as a sentence, never simply left out. A card with three facts where a colleague sees five reads as a rendering fault; "Value hidden — plant users see quantities only" reads as a rule, and it is the same sentence the destination page shows.'
    ],
    related: ['tooltip', 'popover', 'dropdown', 'card'],
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

            <a href="/orders/1187/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1187</a>

            <!-- pt-2 on this wrapper, never mt-2 on the panel: the gap has to
                 belong to the component or the pointer leaves it crossing -->
            <div x-show="open" x-cloak x-transition.opacity.duration.150ms
                 class="absolute top-full left-0 z-40 pt-2">
              <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
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

            <a href="/orders/1191/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1191</a>

            <div x-show="open" x-cloak x-transition.opacity.duration.150ms
                 class="absolute top-full left-0 z-40 pt-2">
              <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
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

    <a href="/vendors/142/" class="font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Gujarat Polymers Ltd</a>

    <div x-show="open" x-cloak x-transition.opacity.duration.150ms
         class="absolute top-full left-0 z-40 pt-2">
      <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
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
          <a href="/vendors/142/" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
          <a href="mailto:ritu.deshpande@konspec.in" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <i data-lucide="mail" class="size-3.5 text-zinc-600"></i>Email
          </a>
        </div>
      </div>
    </div>
  </span>
</div>` },

      { id: 'item', name: 'Material on a line-items row', tagNew: true, code:
`<!-- The card previews the material, not the line. Quantity, rate and amount
     are already in the row the pointer is resting on, so putting them in the
     card would spend every figure it has restating what the user is looking
     at. What it adds is what the row cannot hold — what is in stock, what is
     already committed against it, and what it last cost.

     The freight line at the foot carries no card, and that is the rule rather
     than an oversight. A hovercard goes on a reference to a record; freight is
     a charge with nothing behind it, and a register where every cell twitches
     as the pointer crosses it is harder to read than one with no cards at all.

     Dense rows and the same 320px card. Density is the reason the open delay
     matters more here than anywhere: at py-1.5 the pointer crosses four
     triggers in the distance it crosses two in a comfortable table.

     The pill says Active, following the vendor card. The five fixed statuses
     describe what a record is doing and a material is not doing anything; the
     standing of a thing takes emerald and the record words are left to
     records. -->
<div data-kui="hovercard/item" class="rounded-xl border border-zinc-300 bg-white">
  <table class="w-full text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="rounded-tl-xl px-3 py-1.5 font-medium">Item</th>
        <th scope="col" class="px-3 py-1.5 text-right font-medium">Qty</th>
        <th scope="col" class="hidden px-3 py-1.5 text-right font-medium sm:table-cell">Rate</th>
        <th scope="col" class="rounded-tr-xl px-3 py-1.5 text-right font-medium">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-3 py-1.5">
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

            <a href="/items/hdpe-blm-45/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">HDPE-BLM-45</a>

            <div x-show="open" x-cloak x-transition.opacity.duration.150ms
                 class="absolute top-full left-0 z-40 pt-2">
              <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-[14px]/5 font-semibold tabular-nums">HDPE-BLM-45</p>
                    <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600 tabular-nums">Blow moulding granule · 45 MFI</p>
                  </div>
                  <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
                    <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Active
                  </span>
                </div>
                <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">In stock · Waluj</dt>
                    <dd class="text-[12px]/4 font-medium tabular-nums">42.500 MT</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Committed</dt>
                    <dd class="text-[12px]/4 tabular-nums">18.000 MT</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Last rate</dt>
                    <dd class="text-[12px]/4 tabular-nums">₹86.40 / kg</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">HSN</dt>
                    <dd class="text-[12px]/4 tabular-nums">3901 2000</dd>
                  </div>
                </dl>
                <p class="mt-3 border-t border-zinc-100 pt-3 text-[12px]/4 text-zinc-500 tabular-nums">Last received 16 Aug 2026 · Gujarat Polymers Ltd</p>
              </div>
            </div>
          </span>
        </td>
        <td class="px-3 py-1.5 text-right tabular-nums">1.200 MT</td>
        <td class="hidden px-3 py-1.5 text-right tabular-nums sm:table-cell">₹87.00</td>
        <td class="px-3 py-1.5 text-right tabular-nums">₹1,04,400</td>
      </tr>

      <tr class="border-b border-zinc-100">
        <td class="px-3 py-1.5">
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

            <a href="/items/ldpe-flm-12/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">LDPE-FLM-12</a>

            <div x-show="open" x-cloak x-transition.opacity.duration.150ms
                 class="absolute top-full left-0 z-40 pt-2">
              <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-[14px]/5 font-semibold tabular-nums">LDPE-FLM-12</p>
                    <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600 tabular-nums">Film grade · 12 MFI</p>
                  </div>
                  <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
                    <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Active
                  </span>
                </div>
                <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">In stock · Waluj</dt>
                    <dd class="text-[12px]/4 font-medium tabular-nums">3.250 MT</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Committed</dt>
                    <dd class="text-[12px]/4 tabular-nums">3.000 MT</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Last rate</dt>
                    <dd class="text-[12px]/4 tabular-nums">₹97.00 / kg</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">HSN</dt>
                    <dd class="text-[12px]/4 tabular-nums">3901 1010</dd>
                  </div>
                </dl>
                <p class="mt-3 border-t border-zinc-100 pt-3 text-[12px]/4 text-zinc-500 tabular-nums">Last received 02 Aug 2026 · Vapi Polymer Works</p>
              </div>
            </div>
          </span>
        </td>
        <td class="px-3 py-1.5 text-right tabular-nums">0.400 MT</td>
        <td class="hidden px-3 py-1.5 text-right tabular-nums sm:table-cell">₹97.00</td>
        <td class="px-3 py-1.5 text-right tabular-nums">₹38,800</td>
      </tr>

      <tr>
        <td class="px-3 py-1.5 text-zinc-600">Freight · Vapi to Waluj</td>
        <td class="px-3 py-1.5 text-right text-zinc-500 tabular-nums">—</td>
        <td class="hidden px-3 py-1.5 text-right text-zinc-500 tabular-nums sm:table-cell">—</td>
        <td class="px-3 py-1.5 text-right tabular-nums">₹9,500</td>
      </tr>
    </tbody>
  </table>
</div>` },

      { id: 'long', name: 'Too long to preview', tagNew: true, code:
`<!-- Eighteen lines, three of which fit. The panel on its own here, the way
     the skeleton and the failure are, because the decision this variant makes
     is about content and the trigger, delays and positioning are in default.

     It shows the three largest lines rather than the first three. What a
     person checks on hover is whether this is the order they think it is, and
     three lines carrying four fifths of the value answer that; lines 1 to 3 by
     line number answer nothing in particular.

     The panel does not scroll and must not be given the chance. It sits under
     a resting pointer, so a wheel gesture inside it scrolls the card instead
     of the register behind it, and the register jumps back to where it was
     when the card closes. Reaching a scrollbar inside the panel also means
     crossing the bridge first, which the close delay only barely allows. A
     max-height with the overflow faded out is worse than the count: it hides
     content and does not say how much.

     The remainder line carries its own value. "15 more lines" invites exactly
     the question the card was opened to settle; "15 more lines · ₹7,50,000"
     settles it, and the link underneath is where the other fifteen live. -->
<div data-kui="hovercard/long" class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
  <div class="flex items-start justify-between gap-3">
    <div class="min-w-0">
      <p class="truncate text-[14px]/5 font-semibold tabular-nums">PO-24-1193</p>
      <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600">Nashik Steel Traders</p>
    </div>
    <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
    </span>
  </div>

  <dl class="mt-3 flex items-baseline justify-between gap-3 border-t border-zinc-100 pt-3">
    <dt class="text-[12px]/4 text-zinc-600">Order value · 18 lines</dt>
    <dd class="text-[12px]/4 font-medium tabular-nums">₹38,64,300</dd>
  </dl>

  <ul class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
    <li class="flex items-baseline justify-between gap-3">
      <span class="truncate text-[12px]/4 text-zinc-600 tabular-nums">MS Angle 50×50×6 · 24.000 MT</span>
      <span class="shrink-0 text-[12px]/4 tabular-nums">₹14,88,000</span>
    </li>
    <li class="flex items-baseline justify-between gap-3">
      <span class="truncate text-[12px]/4 text-zinc-600 tabular-nums">MS Plate 12 mm · 18.500 MT</span>
      <span class="shrink-0 text-[12px]/4 tabular-nums">₹11,26,250</span>
    </li>
    <li class="flex items-baseline justify-between gap-3">
      <span class="truncate text-[12px]/4 text-zinc-600 tabular-nums">MS Channel 100 · 9.000 MT</span>
      <span class="shrink-0 text-[12px]/4 tabular-nums">₹5,00,050</span>
    </li>
  </ul>

  <div class="mt-3 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
    <span class="truncate text-[12px]/4 text-zinc-500 tabular-nums">15 more lines · ₹7,50,000</span>
    <a href="/orders/1193/" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      All 18 lines<i data-lucide="arrow-right" class="size-3.5 text-zinc-600"></i>
    </a>
  </div>
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

      <a :href="'/orders/' + po.id + '/'" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15" x-text="po.id"></a>

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

      { id: 'trail', name: 'References inside a line of prose', tagNew: true, code:
`<!-- The trigger sits in the middle of a sentence, which is the arrangement
     the entry warns about everywhere else. A table cell and a labelled field
     both give the trigger the start of a line, so left-0 is safe; a reference
     inside running text falls wherever the word falls, and at 390px a word
     near the end of a line anchors a 320px panel most of the way off the
     screen. The clamp is not a refinement here — it is the thing that makes
     this arrangement allowed at all.

     The clamp goes on the positioned wrapper, the element that also carries
     the pt-2 bridge, and never on the card inside it. Put it on the card and
     the strip the pointer crosses stays under the word while the card slides
     out from over it, so the pointer falls through the gap at exactly the
     offsets where the clamp had something to do.

     An open card covers the entries below it, and the answer is not a smaller
     card or a shorter close delay. The answer is that every reference is a
     link before it is a trigger: the entry underneath is still reachable the
     moment the card closes, and it was always reachable by tabbing to it.

     One place() for both jobs, the same one the placement variant explains at
     length, including why the offset is written as left and not as a
     transform. Two positioning strategies in one component is one too many.

     The line of prose is a div and not a p. The panel is a div, and a div
     inside a p closes the p where it starts: the parser ends the paragraph,
     drops the panel out into the list item as a sibling, and the timestamp
     after it becomes a second paragraph. It renders as a layout that broke
     rather than as invalid markup, which is why it survives review. -->
<div data-kui="hovercard/trail" class="rounded-xl border border-zinc-300 bg-white p-4"
     x-data="{ trail: [
       { who: 'Ritu Deshpande', verb: 'approved', id: 'PO-24-1187', href: '/orders/1187/', vendor: 'Gujarat Polymers Ltd', value: '₹18,42,000', due: '28 Aug 2026', at: '12 Aug 2026, 4:20 pm' },
       { who: 'Sanjay More',    verb: 'raised',   id: 'PO-24-1191', href: '/orders/1191/', vendor: 'Nashik Steel Traders',  value: '₹6,04,750',  due: '02 Aug 2026', at: '18 Aug 2026, 11:05 am' },
       { who: 'Meena Iyer',     verb: 'amended',  id: 'PO-24-1179', href: '/orders/1179/', vendor: 'Vapi Polymer Works',    value: '₹2,71,300',  due: '19 Sep 2026', at: '09 Aug 2026, 2:40 pm' }
     ] }">
  <p class="text-[11px]/4 tracking-wider text-zinc-500 uppercase">Activity</p>
  <ul class="mt-2 space-y-2.5">
    <template x-for="e in trail" :key="e.id">
      <li class="flex gap-2.5">
        <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-zinc-300" aria-hidden="true"></span>
        <div class="text-[13px]/5 text-zinc-600">
          <span class="font-medium text-zinc-900" x-text="e.who"></span>
          <span x-text="e.verb"></span>

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

            <a :href="e.href" x-text="e.id" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"></a>

            <div x-ref="panel" x-show="open" x-cloak x-transition.opacity.duration.150ms
                 :class="up ? 'bottom-full pb-2' : 'top-full pt-2'"
                 :style="'left: ' + dx + 'px'"
                 class="absolute left-0 z-40">
              <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 text-left shadow-lg">
                <p class="truncate text-[14px]/5 font-semibold tabular-nums" x-text="e.id"></p>
                <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600" x-text="e.vendor"></p>
                <dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Value</dt>
                    <dd class="text-[12px]/4 font-medium tabular-nums" x-text="e.value"></dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-3">
                    <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
                    <dd class="text-[12px]/4 tabular-nums" x-text="e.due"></dd>
                  </div>
                </dl>
              </div>
            </div>
          </span>

          <span class="text-zinc-500 tabular-nums">· <span x-text="e.at"></span></span>
        </div>
      </li>
    </template>
  </ul>
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
     which is what a pointer leaving and returning inside 300ms produces.

     Two failure events, not one. htmx:responseError is the server answering
     with a status htmx will not swap; htmx:sendError is the network never
     reaching it at all, which on an office wifi is the commoner of the two and
     fires no responseError to go with it. Listen for only the first and a
     dropped connection leaves the skeleton spinning under the pointer for as
     long as the card stays open.

     aria-busy is bound rather than written, because a panel that declares
     itself busy at first paint and never clears it goes on telling a reader
     the content is still arriving for the life of the page. -->
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
          @htmx:response-error.camel="failed = true"
          @htmx:send-error.camel="failed = true">

      <a href="/orders/1187/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1187</a>

      <div x-show="open" x-cloak x-transition.opacity.duration.150ms
           class="absolute top-full left-0 z-40 pt-2">
        <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">

          <!-- the skeleton is the panel's own content until the response
               replaces it, and it is the shape of the answer, so the card does
               not resize under the pointer when the data lands -->
          <div x-ref="body" x-show="!failed"
               hx-get="/orders/1187/card/" hx-trigger="hovercard-fetch"
               hx-swap="innerHTML" hx-sync="this:drop"
               :aria-busy="loaded ? 'false' : 'true'">
            <div role="status">
              <span class="sr-only">Loading PO-24-1187</span>
              <div class="animate-pulse" aria-hidden="true">
                <div class="h-3 w-28 rounded bg-zinc-200"></div>
                <div class="mt-2 h-2.5 w-40 rounded bg-zinc-200"></div>
                <div class="mt-4 space-y-2 border-t border-zinc-100 pt-3">
                  <div class="h-2.5 w-full rounded bg-zinc-200"></div>
                  <div class="h-2.5 w-2/3 rounded bg-zinc-200"></div>
                </div>
              </div>
            </div>
          </div>

          <div x-show="failed" x-cloak class="flex items-start gap-2.5">
            <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
            <div class="min-w-0">
              <p class="text-[13px]/5 font-medium">Could not load this order</p>
              <button type="button"
                      @click="failed = false; $refs.body.dispatchEvent(new CustomEvent('hovercard-fetch'))"
                      class="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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

      { id: 'cached', name: 'One fetch per record, not per row', tagNew: true, code:
`<!-- The loaded flag is per trigger, and a register does not have one trigger
     per record. Two rows naming the same vendor are two triggers with two
     flags, so the flag stops the second request on one row and does nothing
     whatever across rows: a user sweeping a column of forty orders where six
     are placed on one vendor still asks the server six times for one answer.

     The fragment is a GET, so the browser cache is where this belongs, and it
     is the only cache that survives the next page of the register. Two headers
     on the view and both are load-bearing. Cache-Control: private, max-age=120
     — private and never public, because the card carries a rate another plant
     is not entitled to and a shared proxy cannot tell one signed-in user from
     the next. Vary: HX-Request — the same URL answers a hovercard with a
     fragment and a direct visit with a whole page, and a cache that cannot
     tell those apart will hand one to the request that wanted the other.

     Because the answer can now be two minutes old, the fragment stamps itself.
     The stamp is written by the server into the fragment and is not a clock
     read when the swap lands: a client-side stamp on a response that came out
     of the cache says "now" about something made two minutes ago, which is
     worse than no stamp at all.

     Nothing here is an Alpine store keyed on the vendor id. That works until
     the second page of the register, at which point it is holding cards for
     rows nobody can see and has to be invalidated by hand. -->
<div data-kui="hovercard/cached" class="rounded-xl border border-zinc-300 bg-white">
  <table class="w-full text-left text-[13px]/5">
    <thead class="border-b border-zinc-200 bg-zinc-50 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
      <tr>
        <th scope="col" class="rounded-tl-xl px-4 py-2 font-medium">Order</th>
        <th scope="col" class="px-4 py-2 font-medium">Vendor</th>
        <th scope="col" class="rounded-tr-xl px-4 py-2 text-right font-medium">Value</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5 tabular-nums">PO-24-1187</td>
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

            <a href="/vendors/142/" class="font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Gujarat Polymers Ltd</a>

            <div x-show="open" x-cloak x-transition.opacity.duration.150ms
                 class="absolute top-full left-0 z-40 pt-2">
              <div x-ref="body"
                   hx-get="/vendors/142/card/" hx-trigger="hovercard-fetch"
                   hx-swap="innerHTML" hx-sync="this:drop"
                   :aria-busy="loaded ? 'false' : 'true'"
                   class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
                <div role="status">
                  <span class="sr-only">Loading Gujarat Polymers Ltd</span>
                  <div class="animate-pulse" aria-hidden="true">
                    <div class="h-3 w-32 rounded bg-zinc-200"></div>
                    <div class="mt-2 h-2.5 w-24 rounded bg-zinc-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹18,42,000</td>
      </tr>

      <tr class="border-b border-zinc-100">
        <td class="px-4 py-2.5 tabular-nums">PO-24-1191</td>
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

            <a href="/vendors/207/" class="font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Nashik Steel Traders</a>

            <div x-show="open" x-cloak x-transition.opacity.duration.150ms
                 class="absolute top-full left-0 z-40 pt-2">
              <div x-ref="body"
                   hx-get="/vendors/207/card/" hx-trigger="hovercard-fetch"
                   hx-swap="innerHTML" hx-sync="this:drop"
                   :aria-busy="loaded ? 'false' : 'true'"
                   class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
                <div role="status">
                  <span class="sr-only">Loading Nashik Steel Traders</span>
                  <div class="animate-pulse" aria-hidden="true">
                    <div class="h-3 w-32 rounded bg-zinc-200"></div>
                    <div class="mt-2 h-2.5 w-24 rounded bg-zinc-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹6,04,750</td>
      </tr>

      <!-- the same vendor as the first row, so the same URL. This trigger has
           its own loaded flag and knows nothing about the first one; what stops
           the second request is the max-age on the response -->
      <tr>
        <td class="px-4 py-2.5 tabular-nums">PO-24-1196</td>
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

            <a href="/vendors/142/" class="font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Gujarat Polymers Ltd</a>

            <div x-show="open" x-cloak x-transition.opacity.duration.150ms
                 class="absolute top-full left-0 z-40 pt-2">
              <div x-ref="body"
                   hx-get="/vendors/142/card/" hx-trigger="hovercard-fetch"
                   hx-swap="innerHTML" hx-sync="this:drop"
                   :aria-busy="loaded ? 'false' : 'true'"
                   class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
                <div role="status">
                  <span class="sr-only">Loading Gujarat Polymers Ltd</span>
                  <div class="animate-pulse" aria-hidden="true">
                    <div class="h-3 w-32 rounded bg-zinc-200"></div>
                    <div class="mt-2 h-2.5 w-24 rounded bg-zinc-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹4,86,200</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- /vendors/142/card/ returns this, under Cache-Control: private, max-age=120
     and Vary: HX-Request. The last line is the stamp, and it is rendered by the
     view from the moment the figures were read, so a card served out of the
     cache says how old it is rather than claiming to be current. -->
<div class="flex items-start justify-between gap-3">
  <div class="min-w-0">
    <p class="truncate text-[14px]/5 font-semibold">Gujarat Polymers Ltd</p>
    <p class="mt-0.5 truncate text-[12px]/4 text-zinc-600 tabular-nums">V-0142 · Vapi · 45 day terms</p>
  </div>
  <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
    <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Active
  </span>
</div>
<dl class="mt-3 space-y-1.5 border-t border-zinc-100 pt-3">
  <div class="flex items-baseline justify-between gap-3">
    <dt class="text-[12px]/4 text-zinc-600">Open orders</dt>
    <dd class="text-[12px]/4 font-medium tabular-nums">4</dd>
  </div>
  <div class="flex items-baseline justify-between gap-3">
    <dt class="text-[12px]/4 text-zinc-600">Outstanding</dt>
    <dd class="text-[12px]/4 tabular-nums">₹42,18,500</dd>
  </div>
</dl>
<p class="mt-3 border-t border-zinc-100 pt-3 text-[12px]/4 text-zinc-500 tabular-nums">Figures as at 10:42, 22 Aug 2026</p>` },

      { id: 'loading', name: 'Loading', code:
`<!-- The panel's own content before the response lands, standing on its own
     here so the state can be read at full size. The trigger, the delays and
     the positioning are in the default and htmx variants; this is the fragment
     the swap replaces.

     The skeleton is the shape of the card that is coming — a title line, a
     subtitle, a pill and two figures — because the panel is under the pointer,
     and one that grows when the data lands moves the thing being read out from
     under it, or shrinks away from the cursor and closes itself.

     The wait is a role="status" holding a real sr-only sentence, not an
     aria-label on a bare div. A div with a label and no role gives a reader
     nothing to hang the label on and most of them pass over it, so a keyboard
     user who opened the card on focus is told nothing at all while it loads;
     and a live region with no text in it announces nothing when it appears.
     One sentence of hidden text is what is actually read out. aria-busy is
     cleared when the swap lands — see the htmx variant. -->
<div data-kui="hovercard/loading" class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg"
     role="status" aria-busy="true">
  <span class="sr-only">Loading order PO-24-1187</span>
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
     alert.

     This is the server never answering, and it is the only case where Try
     again is an honest offer. A record the reader may not see and a record
     that is gone are the server answering exactly, they come back 200, and
     they are the restricted variant. Drawing them here — red icon, retry
     button — tells a user to press a button that will refuse them twice. -->
<div data-kui="hovercard/error" class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
  <div class="flex items-start gap-2.5">
    <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
    <div class="min-w-0">
      <p class="text-[13px]/5 font-medium tabular-nums">Could not load PO-24-1187</p>
      <p class="mt-1 text-[12px]/4 text-zinc-600">The preview timed out. The order itself is fine.</p>
    </div>
  </div>
  <div class="mt-3 flex items-center gap-2 border-t border-zinc-100 pt-3">
    <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="rotate-ccw" class="size-3.5 text-zinc-600"></i>Try again
    </button>
    <a href="/orders/1187/" class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      Open the order
    </a>
  </div>
</div>` },

      { id: 'restricted', name: 'Refused, and gone', tagNew: true, code:
`<!-- Two answers that are not failures, drawn on their own next to each other
     because the mistake is to draw them the way the error variant is drawn.
     A failure is the server never answering; these are the server answering
     exactly. Neither offers a retry: a refusal refuses again, and a record
     that is no longer live returns the same tombstone every time it is asked.
     What each one offers instead is the thing that leads somewhere — who to
     ask, and what replaced it.

     Both fragments come back with status 200. htmx swaps 2xx and nothing else,
     so a card returned as the body of a 403 or a 404 is discarded and the
     panel keeps its skeleton until the pointer leaves, which tells the one
     user who most needs an explanation nothing at all. Keep the non-2xx
     statuses for the failures where Try again is an honest offer.

     The withheld figures are a sentence rather than an absence. A card with
     three facts where a colleague sees five reads as a rendering fault, and
     the user quietly concludes the data is missing rather than that a rule
     applies to them. What is hidden from the eye is also absent from the
     response: the view builds the reduced fragment and does not render the
     rates behind a class, because a hovercard is a network response and
     anybody can read it.

     Neutral icons in zinc-500, not red. Red says a record is overdue or an
     action failed, and neither is true here — one is a rule and the other is
     history. The link under the trigger still works in both cases and lands on
     the same reduced page or the same tombstone, which is what keeps the card
     supplementary rather than the only place the answer exists. -->
<div data-kui="hovercard/restricted" class="flex flex-wrap items-start gap-4">
  <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
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
        <dt class="text-[12px]/4 text-zinc-600">Delivery</dt>
        <dd class="text-[12px]/4 tabular-nums">28 Aug 2026</dd>
      </div>
      <div class="flex items-baseline justify-between gap-3">
        <dt class="text-[12px]/4 text-zinc-600">Received</dt>
        <dd class="text-[12px]/4 tabular-nums">2 of 3 GRNs</dd>
      </div>
    </dl>
    <div class="mt-3 flex items-start gap-2.5 border-t border-zinc-100 pt-3">
      <i data-lucide="lock" class="mt-0.5 size-3.5 shrink-0 text-zinc-500"></i>
      <p class="text-[12px]/4 text-zinc-600">Values and rates are hidden — plant users see quantities only. Ritu Deshpande can send you the commercial detail.</p>
    </div>
  </div>

  <div class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
    <div class="flex items-start gap-2.5">
      <i data-lucide="info" class="mt-0.5 size-4 shrink-0 text-zinc-500"></i>
      <div class="min-w-0">
        <p class="text-[13px]/5 font-medium tabular-nums">PO-24-1104 was cancelled</p>
        <p class="mt-1 text-[12px]/4 text-zinc-600 tabular-nums">Cancelled by Meena Iyer on 09 Aug 2026, before any receipt was posted.</p>
      </div>
    </div>
    <div class="mt-3 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
      <span class="truncate text-[12px]/4 text-zinc-500">Replaced by</span>
      <a href="/orders/1188/" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px]/4 font-medium tabular-nums hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        PO-24-1188<i data-lucide="arrow-right" class="size-3.5 text-zinc-600"></i>
      </a>
    </div>
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
    <a href="/orders/1187/" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">PO-24-1187</a>
    <button type="button" x-show="!fine" x-cloak
            @click="open ? shut() : show(0)"
            :aria-expanded="open ? 'true' : 'false'" aria-controls="po-1187-preview"
            aria-label="Preview PO-24-1187"
            class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
     @vary_on_headers('HX-Request')
     @cache_control(private=True, max_age=120)
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

     The two decorators are the whole cross-row cache. private, because the
     card carries a price a different plant is not entitled to and a shared
     proxy has no idea. vary_on_headers, because this URL answers a hovercard
     with a fragment and a direct visit with a full page, and a cache that
     cannot tell those apart will serve one where the other was asked for.
     A hovercard is the one component a user can fire fifty times in ten
     seconds without meaning to. -->
{% load humanize %}
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

        <a href="{% url 'order-detail' order.pk %}" class="font-medium text-zinc-900 underline underline-offset-2 tabular-nums focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">{{ order.number }}</a>

        <div x-show="open" x-cloak x-transition.opacity.duration.150ms
             class="absolute top-full left-0 z-40 pt-2">
          <div x-ref="body"
               hx-get="{% url 'order-card' order.pk %}" hx-trigger="hovercard-fetch"
               hx-swap="innerHTML" hx-sync="this:drop"
               :aria-busy="loaded ? 'false' : 'true'"
               class="w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg">
            <div role="status">
              <span class="sr-only">Loading {{ order.number }}</span>
              <div class="animate-pulse" aria-hidden="true">
                <div class="h-3 w-28 rounded bg-zinc-200"></div>
                <div class="mt-2 h-2.5 w-40 rounded bg-zinc-200"></div>
              </div>
            </div>
          </div>
        </div>
      </span>
    </td>
    <td class="hidden px-4 py-2.5 text-zinc-600 sm:table-cell">{{ order.vendor.name }}</td>
    <td class="px-4 py-2.5 text-right tabular-nums">₹{{ order.value|intcomma }}</td>
  </tr>
{% endfor %}

{% comment %} orders/_hovercard.html — swapped into the panel, and rendered on its own
   when someone opens the URL directly. status_dot is the filter the badge
   component defines; it is the single place the status colour is decided. {% endcomment %}
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
      'Clamp and flip rather than resize, and measure after the panel is displayed. A 320px panel anchored left-0 to a trigger sitting at the right of a 390px screen hangs 200px off the edge and the page scrolls sideways; the fix is a translateX computed from getBoundingClientRect against innerWidth with a 12px margin, and a flip to bottom-full when there is no room below and there is room above. Never let the panel size itself down to fit: a filter form that is 320px wide on one trigger and 190px on the next is a different control each time it opens. This is the same maths as the hovercard\'s placement variant, deliberately, because two positioning strategies in one system is one too many. What the hovercard must not be copied on is the element the transition sits on: a panel positioned by a bound :style may not also carry x-transition, and this is measured rather than theoretical. The transition writes its own style attribute over the element while it runs — transform: scale(1) among other things — and on finish restores the attribute it cached before it started, which is the position from the last time the panel was closed. The bound value is now stale in the DOM and the binding will not correct it, because dx has not changed since Alpine last evaluated it, so nothing re-runs the effect. Observed on a right-aligned 320px panel at 390px: dx computed correctly as -180 on the first frame, the style attribute settled back to translateX(0px) four frames later, and the panel sat 135px off the right edge for the rest of its life. Either drop the transition from the panel, which is what every variant here does, or move the :style onto a positioner wrapper and leave the transition on the panel inside it. No panel in this entry fades, and that is a decision rather than an omission: a fade is worth having on a hovercard because hover is ambient, and worth nothing on a control the user deliberately pressed, where 100ms of opacity is 100ms of a panel that cannot be read. The dropdown next door reaches the same conclusion about its menu, and the two components opening at the same speed is what stops a toolbar carrying both from having two timings in it.',
      'A popover in a register cannot be position: absolute inside a cell whose ancestor clips. overflow-hidden on the table wrapper cuts the panel off at the row it opened on, and so does overflow-x-auto on a table too wide to fold down. Two ways out: drop the clipping and round the header cells instead, which is what the hovercard does, or make the panel position: fixed and drive left and top from the trigger\'s rect, which is what an editor inside a scroller has to do. Fixed brings its own trap: any ancestor carrying transform, filter, backdrop-filter, contain or will-change becomes the containing block, and the panel then anchors to that element instead of the viewport and lands somewhere nobody predicted. A fixed panel also has to be repositioned on scroll — both the window\'s and the scroller\'s, since scroll does not bubble — or it detaches from the cell it belongs to.',
      'Decide once whether the panel writes as it is touched or on an Apply button, and never both. Light dismiss means a click anywhere loses whatever is in the panel, so a panel that batches must reseed its draft from the committed values every time it opens, or the second open shows an edit the user already walked away from. A column picker applies live because its effect is visible in the table behind the open panel and there is nothing to confirm; a filter batches because every keystroke would re-run a query. Something that must not be lost to a stray click does not belong in a popover at all — that is what a dialog is, and a destructive confirm inside a light-dismiss panel is an alert-dialog drawn wrong.',
      'Light dismiss and unsaved input are in direct conflict, and the resolution is not to pick one. A panel that throws away a typed note because the user clicked the page is losing work silently, on their own stray gesture, with the empty panel next time as the only evidence; a panel that refuses to close until it is answered is a dialog wearing a popover\'s markup. What works is to separate the accidental dismissals from the deliberate ones. A click outside and focus walking out are accidents, so while the draft differs from what was saved they raise a strip inside the panel instead of closing it. Cancel and Save are deliberate and never ask. Escape asks once and then means the safe half, so the first press raises the strip with focus on Keep editing and the second takes it down again. That does cost the panel its one-press dismissal, and that cost is the line: if more guard than this is wanted, the control was a dialog from the start.',
      'A panel with a write in flight is not dismissable at all. Closing over a POST leaves a request whose answer nobody sees, and the user with no idea whether it landed; so click-outside, focus-out and Escape are all refused while busy, and Escape still stops propagating so the press the popover declined does not close the sheet around it instead. The flag has to come from the transport — set on htmx:beforeRequest, cleared on htmx:afterRequest, which fires on a 2xx, a 4xx, a network failure, a timeout and an abort alike — because a flag driven by anything else is a flag with a path that leaves the panel stuck. And disabling the submit button while it holds focus blurs it: a disabled element is not focusable, the browser drops focus on the body, and a root-scoped Escape then never fires again. Put focus back when the request settles, and only when it has actually left the root.',
      'A value the user may not change is readonly, never disabled. A disabled input is not focusable, so Tab, forms mode in every screen reader and the browser\'s own find all step over it; its value cannot be selected or copied in some engines; and it is not submitted, so a round-tripped form drops the field. readonly keeps every one of those and gives up only the caret. Reserve disabled for a control that is not part of this form, and put the reason on the field with aria-describedby rather than beside it, so it is read at the moment focus lands in the box that will not respond. The trigger stays enabled in the same way and for the same reason: disable it and the explanation has nowhere left to live, since a title attribute has no keyboard route and a tooltip has none on a phone.',
      'Two kinds of message appear inside an open panel and they need different plumbing. One arrives as a node an htmx swap inserts — a server-rendered field error — and role="alert" on it is announced reliably, because insertion is the mutation every reader watches for. The other is revealed by x-show from state Alpine already holds: an unsaved-changes strip, a transport failure with no response to render. That one needs the region to pre-date the text, so the role="alert" element is in the panel from the moment the panel opens and empty, with the strip inside it. A live region created in the same frame as its first message announces nothing at all, which is the same defect the toast entry is built around.',
      'Nothing inside an htmx swap target may carry an Alpine directive. Alpine does not initialise nodes htmx inserts unless the application wires it to, so an x-ref, an x-model or an x-show in swapped content is a binding onto a node that is no longer in the document — and x-ref is the one that bites, because $refs.field keeps resolving, to a detached element, and focus() on it is silent. Keep the panel\'s refs outside the target and find anything inside it by query.',
      'A panel opened from inside a table header inherits the header. A thead sets uppercase, tracking-wider, 11px type and zinc-600 on its whole subtree, and a dialog rendered there comes out as a second header rather than a panel, so it resets all four on itself. This is the only place in the entry where a panel has to undo its surroundings, and it is the reason a container is never allowed to set type on a popover from outside.'
    ],
    anatomy: [
      ['Root', 'relative inline-block. It owns open, the handlers and both refs, because click-outside, focus-out and Escape all have to mean "left the trigger and the panel", and only their common parent knows that. Put @click.outside on the panel instead and the trigger counts as outside, so it closes on mousedown and reopens on click and can never be shut by its own button.'],
      ['Trigger', 'A real button with :aria-expanded and aria-controls, x-ref="trigger" so close() can hand focus back, and a chevron or an icon that says something is behind it. It is a button and not a link, because it reveals rather than navigates.'],
      ['Panel', 'The disclosed thing: role="dialog", tabindex="-1", an id, aria-labelledby or aria-label, x-cloak, w-80 with max-w-[calc(100vw_-_1.5rem)], rounded-xl, white, shadow-lg, z-40. Immediately after the trigger in the DOM, never portalled. Its edge is border-zinc-300 and not the border-zinc-200 that fields and nested strips take, because the panel floats over the page rather than sitting inside a card — white on zinc-100 measures 1.10, and a zinc-200 edge is the first thing to disappear when a screenshot is compressed or a projector washes the room out. Everything drawn inside it steps back down: zinc-200 on the field wrappers, zinc-100 on the rules between sections.'],
      ['Title', 'A 13px medium line at the head of the panel, and the target of aria-labelledby. A panel with no title takes aria-label instead; a panel with neither is announced as "dialog" and nothing else.'],
      ['Body', 'The controls. Fields wear the same bordered wrapper as everywhere else, with focus-within drawing the outline. Past about five controls the answer is a sheet or a page, because a popover has no scroll of its own and should not grow one.'],
      ['Footer', 'Only on a panel that batches: Clear on the left as underlined text, Apply on the right as the primary. On a zinc-100 strip inside the panel, which needs the panel to be overflow-hidden — and overflow-hidden is what clips an arrow, so a panel gets a footer or an arrow, not both.'],
      ['List', 'One control repeated — a column, a vendor, a plant — in a max-h-40 overflow-y-auto strip. This is the exception to the Body\'s five-control limit and the difference is real: five different controls is a form and belongs on a page, while a list of ticks is one decision whose length the user chose by having that many vendors. Past about a dozen it wants a search box, and past about thirty it is a combobox and not a popover at all.'],
      ['Guard', 'On a panel that can be typed into: a strip inside the panel, bg-zinc-50 and full-bleed, holding what is unsaved and the two ways out — Discard as red underlined text, Keep editing as a bordered button. It sits inside a role="alert" element that is in the panel from first open and empty, because a live region and its first message cannot arrive together.'],
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
      'At 390px an anchored panel that would be wider than the screen becomes a bottom sheet instead of a clipped popover. It is still non-modal and still light-dismiss; a sheet at the bottom of the screen that needs a backdrop and a trap is a drawer.',
      'A panel that has been typed into does not close on a stray click or on focus walking out. It raises a strip naming what is unsaved, and the user picks Discard or Keep editing; Cancel and Save are deliberate and are never questioned. The first Escape raises the same strip with focus on Keep editing, and the second takes it back down.',
      'A panel with a request in flight cannot be dismissed by anything: not a click outside, not focus leaving, not Escape. It becomes dismissable again the moment the request settles, whatever it settled as, and focus is put back into the panel if disabling the submit button took it to the body.',
      'A write the server rejects leaves the panel open with the message in it and the typing intact. A write that never reached the server says so in the panel rather than closing over it, and neither case is a toast — a toast for a failure the user can fix in the panel in front of them sends them to look somewhere else.'
    ],
    a11y: [
      'The trigger is a button carrying :aria-expanded bound to the state and aria-controls naming the panel id. Bound, not written once — an aria-expanded="false" left in the markup says collapsed for the rest of the session.',
      'It is not aria-haspopup="menu". That value promises arrow-key navigation over role="menuitem" children, and a form has none, so the user is told how to drive something that will not respond. aria-haspopup="dialog" is the accurate value and is optional; the required half is aria-expanded.',
      'The panel is role="dialog" with aria-labelledby pointing at its title, or aria-label when it has no title. There is no aria-modal, because it is not modal — writing aria-modal="true" hides the whole page behind it from the accessibility tree while it is still visible, clickable and scrollable.',
      'The panel carries tabindex="-1" so focus can be moved onto it programmatically, and nothing sets outline-none on it. When the popover was opened from the keyboard the panel matches :focus-visible and takes the outline, which is the only paint that says where focus went; when it was opened by a click it does not match and nothing is drawn.',
      'Focus moves in on open and back to the trigger on close, and is not trapped in between. Tab out of the last field goes to whatever follows the trigger on the page, which is correct for a non-modal panel and is also one of the dismissals — the focus-out handler closes it on the way past.',
      'Escape dismisses from anywhere inside the panel, including from inside a focused field, and returns focus to the trigger. A native picker takes the first Escape for itself and the panel takes the second; that is two presses by design and not a bug to code around.',
      'While closed the panel is display:none through x-show, so nothing inside it is a tab stop and a register of fifty inline editors adds fifty tab stops of triggers and none of fields.',
      'Status inside the panel follows the fixed dot mapping and the dot is aria-hidden, with the word beside it carrying the state, so nothing in the panel means something only by being a colour.',
      'Every control in the panel takes the focus outline, and the underlined Clear, Cancel and Discard are the ones that get forgotten. A popover is the component a keyboard user tabs straight into, so a text button in it with no outline is a stop where nothing is painted at all — and in forced-colours mode the underline is the only thing left of it.',
      'There is no ARIA property that says a column is filtered. Do not invent one, and do not bind the state into the trigger\'s accessible name — a control that renames itself under the cursor is announced afresh every time the user passes it. The state lives in the ticks inside the panel and in a role="status" line beside the table, which is spoken when the result changes.',
      'A busy panel carries aria-busy bound to the same flag that gates its dismissal, and the wait itself is announced from a role="status" line inside the panel. htmx writes neither, and a label that changes inside a disabled button is announced by nothing.'
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
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="building-2" class="size-4 text-zinc-600"></i>Gujarat Polymers Ltd
    <span :class="open ? 'rotate-180' : ''" class="flex transition-transform motion-reduce:transition-none">
      <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
    </span>
  </button>

  <div id="pop-det" x-ref="panel" x-show="open" x-cloak
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
      <a href="/vendors/142/" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open vendor</a>
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
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="filter" class="size-4 text-zinc-600"></i>Filters
    <span x-show="count() > 0" x-cloak
          class="inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium text-zinc-700 tabular-nums ring-1 ring-inset ring-zinc-300"
          x-text="count()"></span>
  </button>

  <div id="pop-flt" x-ref="panel" x-show="open" x-cloak
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
      <button type="button" @click="clear()" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Clear</button>
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
              class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="columns-3" class="size-4 text-zinc-600"></i>Columns
        <span class="text-[12px]/4 tabular-nums text-zinc-500" x-text="shown() + ' of ' + cols.length"></span>
      </button>

      <div id="pop-col" x-ref="panel" x-show="open" x-cloak
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
            <label class="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-[13px]/5 hover:bg-zinc-200 has-[:disabled]:text-zinc-500">
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

      { id: 'column-filter', name: 'Filter from a column header', tagNew: true, code:
`<!-- The densest arrangement in the entry: the trigger is a 14px funnel inside a
     header cell, and everything about the panel follows from where it is.

     The positioning root is a div inside the th, not the th itself. A header
     cell is sized by the table algorithm, so its box is the whole column — a
     panel anchored left-0 to it starts at the column edge, which on a wide
     Vendor column is nowhere near the funnel the user pressed. Anchored to a
     wrapper around the label and the button, it opens under the button.

     The panel resets four properties it inherits and has no business carrying.
     A thead sets uppercase, tracking-wider, 11px type and zinc-600 on
     everything inside it, and a dialog rendered in that subtree inherits the
     lot: a vendor list in 11px small caps, which reads as a second header. Only
     a panel opened from inside a header has to undo its surroundings, and it is
     the reason a container is never allowed to set type on a popover.

     The card carries no overflow-hidden and the header band carries no fill.
     Those two facts are the same fact: a clipping ancestor cuts the panel off
     at the row it opened on, and the usual reason to clip is a bg-zinc-50
     header whose corners would otherwise square off over the card radius. The
     other way out — rounding the header cells by hand — cannot be used here,
     because first: and last: match the first and last cells in the markup and
     the Order column is display:none below sm, so the corner would be painted
     on a cell nobody can see. Drop the band and keep the popover.

     The rows are markup and the filter only hides them. A tbody built by x-for
     is empty for every frame before Alpine boots, and unlike a panel there is
     no x-cloak to hide that with — the register is the page. The counts beside
     each vendor and the total are the server\'s figures, so the line under the
     table is derived from those rather than from the rows, and there is one
     source for it either way.

     It applies live, for the same reason the column picker does: the effect is
     the register behind the open panel changing, and an Apply button would only
     make the user press it to see what they can already see. What live
     application costs is an announcement. There is no ARIA property that says a
     column is filtered, and binding the state into the button\'s name gives a
     control that renames itself under the cursor, announced afresh on every
     pass; so the count line is a role="status" and the ticks in the panel are
     where the state is read. -->
<div data-kui="popover/column-filter" x-data="{
       open: false,
       picked: [],
       total: 4,
       vendors: [
         { name: 'Aurangabad Castings', n: 0 },
         { name: 'Bharat Fasteners', n: 1 },
         { name: 'Gujarat Polymers Ltd', n: 2 },
         { name: 'Kolhapur Foundry', n: 0 },
         { name: 'Nashik Steel Traders', n: 1 },
         { name: 'Pune Polymers', n: 0 }
       ],
       match(v) { return this.picked.length === 0 || this.picked.includes(v) },
       shown() {
         if (this.picked.length === 0) return this.total;
         return this.vendors.filter(v => this.picked.includes(v.name)).reduce((a, v) => a + v.n, 0);
       },
       show() {
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs.panel.focus()));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false;
         if (toTrigger) this.$refs.trigger.focus();
       }
     }">

  <div class="rounded-xl border border-zinc-300 bg-white">
    <table class="w-full text-left text-[13px]/5">
      <thead class="border-b border-zinc-200 text-[11px]/4 tracking-wider text-zinc-600 uppercase">
        <tr>
          <th scope="col" class="hidden px-3 py-2 font-medium sm:table-cell sm:px-4">Order</th>
          <th scope="col" class="px-3 py-2 font-medium sm:px-4">

            <!-- the popover root: the handlers sit here and not on the x-data
                 element, which is the whole block including the tbody -->
            <div class="relative inline-flex items-center gap-1"
                 @click.outside="close(false)"
                 @focusout="if ($event.relatedTarget && !$el.contains($event.relatedTarget)) close(false)"
                 @keydown.escape="if (open) { $event.stopPropagation(); close() }">
              Vendor
              <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
                      :aria-expanded="open" aria-controls="pop-cf" aria-label="Filter by vendor"
                      class="inline-flex items-center gap-0.5 rounded-md p-1 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
                <span :class="picked.length > 0 ? 'text-zinc-900' : 'text-zinc-500'" class="flex">
                  <i data-lucide="list-filter" class="size-3.5"></i>
                </span>
                <span x-show="picked.length > 0" x-cloak x-text="picked.length" aria-hidden="true"
                      class="text-[11px]/4 font-medium tabular-nums text-zinc-900"></span>
              </button>

              <div id="pop-cf" x-ref="panel" x-show="open" x-cloak
                   role="dialog" tabindex="-1" aria-labelledby="pop-cf-title"
                   class="absolute top-full left-0 z-40 mt-1.5 w-56 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-2 text-left text-[13px]/5 tracking-normal text-zinc-900 normal-case shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

                <div class="flex items-center justify-between gap-3 px-1.5 pt-1 pb-1.5">
                  <p id="pop-cf-title" class="text-[12px]/4 font-medium text-zinc-600">Vendor</p>
                  <button type="button" x-show="picked.length > 0" x-cloak @click="picked = []"
                          class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Clear</button>
                </div>

                <div class="max-h-40 overflow-y-auto">
                  <template x-for="v in vendors" :key="v.name">
                    <label class="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-zinc-100">
                      <input type="checkbox" x-model="picked" :value="v.name" class="size-4 shrink-0 accent-zinc-700">
                      <span class="min-w-0 flex-1 truncate" x-text="v.name"></span>
                      <span class="text-[12px]/4 tabular-nums text-zinc-500" x-text="v.n"></span>
                    </label>
                  </template>
                </div>
              </div>
            </div>
          </th>
          <th scope="col" class="px-3 py-2 text-right font-medium sm:px-4">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-zinc-100" x-show="match('Gujarat Polymers Ltd')">
          <td class="hidden px-3 py-2.5 font-medium tabular-nums sm:table-cell sm:px-4">PO-24-1187</td>
          <td class="px-3 py-2.5 text-zinc-600 sm:px-4">Gujarat Polymers Ltd</td>
          <td class="px-3 py-2.5 text-right tabular-nums sm:px-4">₹18,42,000</td>
        </tr>
        <tr class="border-b border-zinc-100" x-show="match('Nashik Steel Traders')">
          <td class="hidden px-3 py-2.5 font-medium tabular-nums sm:table-cell sm:px-4">PO-24-1191</td>
          <td class="px-3 py-2.5 text-zinc-600 sm:px-4">Nashik Steel Traders</td>
          <td class="px-3 py-2.5 text-right tabular-nums sm:px-4">₹6,04,750</td>
        </tr>
        <tr class="border-b border-zinc-100" x-show="match('Gujarat Polymers Ltd')">
          <td class="hidden px-3 py-2.5 font-medium tabular-nums sm:table-cell sm:px-4">PO-24-1204</td>
          <td class="px-3 py-2.5 text-zinc-600 sm:px-4">Gujarat Polymers Ltd</td>
          <td class="px-3 py-2.5 text-right tabular-nums sm:px-4">₹2,31,900</td>
        </tr>
        <tr x-show="match('Bharat Fasteners')">
          <td class="hidden px-3 py-2.5 font-medium tabular-nums sm:table-cell sm:px-4">PO-24-1210</td>
          <td class="px-3 py-2.5 text-zinc-600 sm:px-4">Bharat Fasteners</td>
          <td class="px-3 py-2.5 text-right tabular-nums sm:px-4">₹94,120</td>
        </tr>
        <tr x-show="shown() === 0" x-cloak>
          <td colspan="3" class="px-3 py-6 text-center text-[12px]/4 text-zinc-500 sm:px-4">No orders from the vendors ticked.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p role="status" class="mt-2 text-[12px]/4 tabular-nums text-zinc-500"
     x-text="shown() + ' of ' + total + ' orders'">4 of 4 orders</p>
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
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium tabular-nums hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="calendar" class="size-4 text-zinc-600"></i>
    <span x-text="applied.label">01 Aug 2026 – 31 Aug 2026</span>
  </button>

  <div id="pop-dt" x-ref="panel" x-show="open" x-cloak
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
      <button type="button" @click="close()" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
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
        <td class="px-4 py-2 tabular-nums text-zinc-600">MS angle 50×50×6</td>
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
                  :aria-expanded="open" aria-controls="pop-ed1"
                  class="relative -mr-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <span class="sr-only">Edit rate for MS angle 50×50×6</span>
            <span id="ed1-val" class="tabular-nums">₹57.00</span>
            <i data-lucide="pencil" class="size-3.5 text-zinc-500"></i>
          </button>

          <div id="pop-ed1" x-ref="panel" x-show="open" x-cloak
               :style="'left: ' + x + 'px; top: ' + y + 'px'"
               role="dialog" tabindex="-1" aria-labelledby="pop-ed1-title"
               class="fixed z-40 w-64 rounded-xl border border-zinc-300 bg-white p-3 text-left shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <form hx-post="/orders/1187/lines/1/rate/" hx-target="#ed1-val" hx-swap="innerHTML">
              <p id="pop-ed1-title" class="text-[12px]/4 font-medium text-zinc-600">Rate per kg</p>
              <div class="mt-1.5 flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <span class="pl-3 text-[13px]/5 text-zinc-500">₹</span>
                <input x-ref="rate" name="rate" value="57.00" inputmode="decimal" aria-label="Rate per kg"
                       class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
              </div>
              <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Rate contract RC-118 · ₹54.00 to ₹60.00</p>
              <div class="mt-2.5 flex items-center justify-end gap-2">
                <button type="button" @click="close()" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
                <button type="submit"
                        class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[12px]/4 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save</button>
              </div>
            </form>
          </div>
        </td>
      </tr>

      <tr>
        <td class="px-4 py-2 tabular-nums text-zinc-600">MS plate 10 mm</td>
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
                  :aria-expanded="open" aria-controls="pop-ed2"
                  class="relative -mr-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <span class="sr-only">Edit rate for MS plate 10 mm</span>
            <span id="ed2-val" class="tabular-nums">₹78.00</span>
            <i data-lucide="pencil" class="size-3.5 text-zinc-500"></i>
          </button>

          <div id="pop-ed2" x-ref="panel" x-show="open" x-cloak
               :style="'left: ' + x + 'px; top: ' + y + 'px'"
               role="dialog" tabindex="-1" aria-labelledby="pop-ed2-title"
               class="fixed z-40 w-64 rounded-xl border border-zinc-300 bg-white p-3 text-left shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
            <form hx-post="/orders/1187/lines/2/rate/" hx-target="#ed2-val" hx-swap="innerHTML">
              <p id="pop-ed2-title" class="text-[12px]/4 font-medium text-zinc-600">Rate per kg</p>
              <div class="mt-1.5 flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
                <span class="pl-3 text-[13px]/5 text-zinc-500">₹</span>
                <input x-ref="rate" name="rate" value="78.00" inputmode="decimal" aria-label="Rate per kg"
                       class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
              </div>
              <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Rate contract RC-118 · ₹74.00 to ₹82.00</p>
              <div class="mt-2.5 flex items-center justify-end gap-2">
                <button type="button" @click="close()" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
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

      { id: 'read-only', name: 'A field the user may not change', tagNew: true, code:
`<!-- Half the panel is live and half of it is settled, which is the ordinary
     state of a line on an approved order — the rate was signed off and the
     delivery date was not.

     The rate is readonly and not disabled, and the difference is the whole
     variant. A disabled input is not focusable, so it is skipped by Tab, by
     forms mode in every screen reader and by the browser's own find; its value
     cannot be selected or copied in some engines; and it is not submitted, so a
     form that round-trips silently drops the field. readonly keeps all four and
     gives up only the caret. Use disabled for a control that is not part of
     this form at all, and readonly for a value that is part of it and settled.

     The reason is aria-describedby from the field rather than a line floating
     near it. Described, it is read the moment focus lands on the locked box,
     which is exactly when the user is asking why nothing is happening; loose
     under the field it is read only by somebody already browsing the panel line
     by line. The link inside the description is the way out, so the panel is
     not a dead end.

     The trigger is not disabled either. Disabling it takes the only route to
     the explanation away, and there is nowhere else to put one — a title
     attribute has no keyboard route and a tooltip has no route on a phone. The
     button opens something and it does that perfectly; what is unavailable is
     the edit, and the panel is where that is said.

     The locked wrapper is bg-zinc-50 — a band recessed into white — and not an
     amber or a red tint. Nothing is wrong here. Something is finished, and
     colour in this system says what a record is doing.

     Focus opens on the delivery date and not on the rate, because the rate is
     the field that does not respond to typing and landing the caret in it is a
     silent way of saying nothing. -->
<div data-kui="popover/read-only" class="flex items-center justify-between gap-4 rounded-xl border border-zinc-300 bg-white px-4 py-3">
  <div class="min-w-0">
    <p class="truncate text-[13px]/5 font-medium tabular-nums">MS plate 10 mm</p>
    <p class="mt-0.5 truncate text-[12px]/4 tabular-nums text-zinc-500">PO-24-1187 · line 2 · 4,000 kg</p>
  </div>

  <div class="relative shrink-0"
       x-data="{
         open: false,
         show() {
           this.open = true;
           this.$nextTick(() => requestAnimationFrame(() => this.$refs.date.focus()));
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
            :aria-expanded="open" aria-controls="pop-ro"
            class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      <i data-lucide="pencil" class="size-3.5 text-zinc-600"></i>Edit line
    </button>

    <div id="pop-ro" x-ref="panel" x-show="open" x-cloak
         role="dialog" tabindex="-1" aria-labelledby="pop-ro-title"
         class="absolute top-full right-0 z-40 mt-1.5 w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 text-left shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

      <p id="pop-ro-title" class="text-[13px]/5 font-medium tabular-nums">PO-24-1187 · line 2</p>

      <div class="mt-3">
        <label for="ro-rate" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">Rate per kg</label>
        <div class="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <span class="pl-3 text-[13px]/5 text-zinc-500">₹</span>
          <input id="ro-rate" name="rate" value="78.00" readonly aria-describedby="ro-rate-why"
                 class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums text-zinc-600 outline-none">
          <span class="flex pr-3 text-zinc-500"><i data-lucide="lock" class="size-3.5"></i></span>
        </div>
        <p id="ro-rate-why" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-600">
          Locked by approval on 16 Aug 2026 · R. Mehta.
          <a href="/orders/1187/amend/" class="font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Raise an amendment</a> to change it.
        </p>
      </div>

      <div class="mt-3">
        <label for="ro-date" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">Promised delivery</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="ro-date" x-ref="date" name="promised" type="date" value="2026-09-04"
                 class="w-full bg-transparent px-2.5 py-2 text-[13px]/5 tabular-nums outline-none">
        </div>
      </div>

      <div class="mt-3.5 flex items-center justify-end gap-3 border-t border-zinc-100 pt-3">
        <button type="button" @click="close()" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
        <button type="button" @click="close()"
                class="rounded-lg bg-zinc-700 px-3.5 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Save</button>
      </div>
    </div>
  </div>
</div>` },

      { id: 'unsaved', name: 'Clicking away from unsaved input', tagNew: true, code:
`<!-- Light dismiss is the whole point of a popover and it is also how somebody
     loses a paragraph they had just typed. Discarding without asking is not a
     small defect: it is silent, it happens on the user's own stray click, and
     the only evidence is the empty panel next time they open it.

     So the two accidental dismissals — the pointer landing on the page, focus
     walking out of the root — stop closing the panel while the draft differs
     from what was saved, and raise a strip inside it instead. Nothing is lost
     and nothing is written; the user chooses. The two deliberate dismissals do
     not ask, because they are not accidents: pressing a button named Cancel is
     already the answer the strip would have been asking for.

     Escape asks once and then means Keep editing, which is the safe half. A
     first press raises the strip and puts focus on Keep editing so Enter does
     the reversible thing; a second press takes the strip down and returns the
     caret to the note. Discard stays one Tab away and is never a keypress the
     user did not aim at. The trade is real and worth stating plainly: a panel
     that guards its content can no longer be dismissed by Escape alone, which
     is one property of a popover given up to keep another. If more guard than
     this is wanted — a backdrop, a trap, a confirm that must be answered — the
     control was a dialog from the start, and two fields that are usually
     abandoned are the reason it is not one here.

     The strip lives inside a role="alert" element that is in the panel from the
     moment the panel opens, empty. A live region created in the same frame as
     its first message announces nothing at all, and this one is revealed by
     x-show rather than inserted by a swap, so the region has to pre-date the
     text. The alert is assertive rather than polite on purpose: it fires when
     the user is already walking away, and a polite announcement waiting for a
     pause is one they will not be there for.

     The trigger closes through the same guard. @click.outside never fires for a
     click on the trigger — it is inside the root — so a trigger wired straight
     to close() is a hole in the guard that only shows up when somebody dismisses
     the panel the way they opened it. -->
<div data-kui="popover/unsaved" class="relative inline-block"
     x-data="{
       open: false, confirming: false,
       saved: { text: '', share: false },
       draft: { text: '', share: false },
       dirty() { return this.draft.text.trim() !== this.saved.text || this.draft.share !== this.saved.share },
       show() {
         this.draft = Object.assign({}, this.saved);
         this.confirming = false;
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => this.$refs.note.focus()));
       },
       guard(fromKey) {
         if (!this.dirty()) { this.close(fromKey); return }
         if (this.confirming) return;
         this.confirming = true;
         if (fromKey) this.$nextTick(() => requestAnimationFrame(() => this.$refs.keep.focus()));
       },
       keep() { this.confirming = false; this.$refs.note.focus() },
       discard() { this.draft = Object.assign({}, this.saved); this.close() },
       save() { this.saved = { text: this.draft.text.trim(), share: this.draft.share }; this.close() },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false;
         this.confirming = false;
         if (toTrigger) this.$refs.trigger.focus();
       }
     }"
     @click.outside="guard(false)"
     @focusout="if ($event.relatedTarget && !$root.contains($event.relatedTarget)) guard(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); confirming ? keep() : guard(true) }">

  <button type="button" x-ref="trigger" @click="open ? guard(false) : show()"
          :aria-expanded="open" aria-controls="pop-un"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="message-square-plus" class="size-4 text-zinc-600"></i>Note on this receipt
    <span x-show="saved.text" x-cloak
          class="inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium text-zinc-700 tabular-nums ring-1 ring-inset ring-zinc-300">1</span>
  </button>

  <div id="pop-un" x-ref="panel" x-show="open" x-cloak
       role="dialog" tabindex="-1" aria-labelledby="pop-un-title"
       class="absolute top-full left-0 z-40 mt-1.5 w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

    <p id="pop-un-title" class="text-[13px]/5 font-medium tabular-nums">Note on GRN-24-4471</p>

    <div class="mt-3">
      <label for="un-note" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">What happened</label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <textarea id="un-note" x-ref="note" x-model="draft.text" rows="2"
                  placeholder="Two bundles short against the challan."
                  class="block w-full resize-none bg-transparent px-3 py-2 text-[14px]/5 outline-none"></textarea>
      </div>
    </div>

    <label class="mt-2.5 flex items-center gap-2.5 py-1 text-[13px]/5">
      <input type="checkbox" x-model="draft.share" class="size-4 shrink-0 accent-zinc-700">
      Copy this note to the vendor portal
    </label>

    <!-- present and empty from the moment the panel opens, so the strip it holds
         is a change to a region rather than a region that arrived with a change -->
    <div role="alert">
      <div x-show="confirming" x-cloak
           class="-mx-4 mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-zinc-200 bg-zinc-50 px-4 py-2.5">
        <p class="flex min-w-0 items-start gap-1.5 text-[12px]/4 font-medium">
          <i data-lucide="alert-triangle" class="mt-px size-3.5 shrink-0 text-amber-700"></i>This note has not been saved.
        </p>
        <div class="ml-auto flex items-center gap-3">
          <button type="button" @click="discard()"
                  class="text-[12px]/4 font-medium text-red-600 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Discard</button>
          <button type="button" x-ref="keep" @click="keep()"
                  class="rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-[12px]/4 font-medium hover:bg-zinc-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Keep editing</button>
        </div>
      </div>
    </div>

    <div class="mt-3.5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
      <button type="button" @click="discard()"
              class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Cancel</button>
      <button type="button" @click="save()" :disabled="!dirty()"
              class="rounded-lg bg-zinc-700 px-3.5 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:opacity-60 disabled:hover:bg-zinc-700">Save note</button>
    </div>
  </div>
</div>` },

      { id: 'saving', name: 'Writing, and the server saying no', tagNew: true, code:
`<!-- The panel below is drawn in the state after a rejection, because that is
     the state this variant exists for. The server's first render of the same
     block is border-zinc-200, aria-invalid="false" and a help line in place of
     the message.

     Three rules, and each one is a defect somebody shipped.

     A panel that is writing cannot be light-dismissed. A click on the page
     while the POST is in flight would close the panel over a request whose
     answer nobody will ever see, and the user is left with no idea whether the
     rejection was recorded. So both pointer dismissals and Escape are refused
     while busy is true. Escape still stops propagating, though — otherwise the
     press the popover declined to act on travels up and closes the sheet around
     it, leaving the request in flight and its panel gone.

     busy is set from htmx:beforeRequest and cleared from htmx:afterRequest, and
     that is what makes it safe to gate on. afterRequest fires on a 2xx, on a
     4xx, on a network failure, on a timeout and on an abort, so there is no
     path that leaves the flag stuck and the panel undismissable. A flag driven
     by anything else — a timer, an optimistic setTimeout — is the one that
     forgets a case.

     Disabling the submit button while it has focus blurs it, because a disabled
     element is not focusable and the browser puts focus on the body. The panel
     is then a dialog with no focus in it, root-scoped Escape never fires again,
     and the user is stuck with a message they cannot dismiss. afterRequest puts
     focus back, and only if it has actually left the root: querySelector for
     the rejected field, falling back to the panel. Never move focus when it is
     still inside — that takes the caret away from wherever the user tabbed to
     while they waited.

     htmx does not swap a 4xx. That is the correct default and it is also why a
     server-rendered field error never appears: the response body is discarded
     and only htmx:responseError fires. One line in beforeSwap opts the 422 back
     in, and isError is deliberately left alone, so afterRequest still reports
     the request as unsuccessful and the panel stays open on it.

     The swap target is the field block, so nothing inside it carries an Alpine
     directive. Alpine does not initialise nodes htmx inserts unless the
     application wires it to, and an x-ref, an x-model or an x-show in swapped
     content is a binding pointing at a node that is no longer in the document.
     The panel's own refs stay outside the target, and the field is found by
     query rather than by ref.

     The message is a role="alert" inside the block the swap replaces, so it
     arrives as an inserted node — which every reader announces. The offline
     line below it is the other kind: Alpine reveals it, so it needs a region
     that was already there, exactly as the unsaved guard does. A transport
     failure has no response to render, which is the whole reason it is drawn
     in the page rather than swapped in.

     Success closes the panel. The response is the same field block re-rendered
     clean, so a second open is not looking at the last rejection, plus an
     hx-swap-oob fragment for the register row behind. A 204 would be tidier and
     is wrong: with nothing to swap, the target keeps the error it had. -->
<div data-kui="popover/saving" class="relative inline-block"
     x-data="{
       open: false, busy: false, offline: false,
       show() {
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => {
           const f = this.$refs.panel.querySelector('[name=qty]');
           if (f) { f.focus(); f.select() }
         }));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false;
         if (toTrigger) this.$refs.trigger.focus();
       }
     }"
     @click.outside="if (!busy) close(false)"
     @focusout="if (!busy && $event.relatedTarget && !$root.contains($event.relatedTarget)) close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); if (!busy) close() }"
     @htmx:before-request.camel="busy = true; offline = false"
     @htmx:send-error.camel="offline = true"
     @htmx:before-swap.camel="if ($event.detail.xhr.status === 422) $event.detail.shouldSwap = true"
     @htmx:after-request.camel="
       busy = false;
       if ($event.detail.successful) close();
       else if (!$root.contains(document.activeElement))
         ($refs.panel.querySelector('[aria-invalid=true]') || $refs.panel).focus()">

  <button type="button" x-ref="trigger" @click="open ? close(false) : show()"
          :aria-expanded="open" aria-controls="pop-sv"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="package-x" class="size-4 text-zinc-600"></i>Record a rejection
  </button>

  <div id="pop-sv" x-ref="panel" x-show="open" x-cloak :aria-busy="busy"
       role="dialog" tabindex="-1" aria-labelledby="pop-sv-title"
       class="absolute top-full left-0 z-40 mt-1.5 w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

    <form hx-post="/grn/4471/lines/2/reject/" hx-target="#sv-qty-field" hx-swap="outerHTML" hx-sync="this:drop">
      <p id="pop-sv-title" class="text-[13px]/5 font-medium tabular-nums">GRN-24-4471 · line 2</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">MS plate 10 mm · 12,000 kg received</p>
      <p role="status" class="sr-only" x-text="busy ? 'Recording the rejection' : ''"></p>

      <div id="sv-qty-field" class="mt-3">
        <label for="sv-qty" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">Rejected quantity</label>
        <div class="flex items-center rounded-lg border border-red-600 bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15">
          <input id="sv-qty" name="qty" value="13000" inputmode="numeric"
                 aria-invalid="true" aria-describedby="sv-qty-msg"
                 class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
          <span class="pr-3 text-[13px]/5 text-zinc-500">kg</span>
        </div>
        <p id="sv-qty-msg" role="alert" class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 font-medium tabular-nums text-red-600">
          <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>Rejected quantity cannot exceed the 12,000 kg received.
        </p>
      </div>

      <div class="mt-3">
        <label for="sv-reason" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">Rejection reason</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="sv-reason" name="reason" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option value="short">Short supply</option>
            <option value="damage" selected>Damaged in transit</option>
            <option value="spec">Off specification</option>
            <option value="docs">Documents not matching</option>
          </select>
        </div>
      </div>

      <div role="alert">
        <div x-show="offline" x-cloak class="mt-3 flex items-start gap-2.5 rounded-lg bg-zinc-100 px-3 py-2.5">
          <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
          <p class="text-[12px]/4">The request did not reach the server. Nothing has been recorded — the panel is still holding what you typed.</p>
        </div>
      </div>

      <div class="mt-3.5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
        <button type="button" @click="close()" :disabled="busy"
                class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:text-zinc-400 disabled:no-underline">Cancel</button>
        <button type="submit" :disabled="busy"
                class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3.5 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 disabled:hover:bg-zinc-700">
          <span x-show="busy" x-cloak class="flex"><i data-lucide="loader-circle" class="size-3.5 animate-spin"></i></span>
          <span class="grid">
            <span class="col-start-1 row-start-1" :class="busy ? 'invisible' : ''">Record rejection</span>
            <span class="invisible col-start-1 row-start-1" :class="busy ? 'visible' : ''">Recording…</span>
          </span>
        </button>
      </div>
    </form>
  </div>
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
    <p class="truncate text-[13px]/5 font-medium tabular-nums">MS angle 50×50×6</p>
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
            class="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px]/5 font-medium tabular-nums hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
      ₹6,98,400
      <i data-lucide="info" class="size-3.5 text-zinc-500"></i>
    </button>

    <div id="pop-arw" x-ref="panel" x-show="open" x-cloak
         :style="'transform: translateX(' + dx + 'px)'"
         role="dialog" tabindex="-1" aria-labelledby="pop-arw-title"
         class="absolute top-full left-0 z-40 mt-1.5 w-64 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-3 text-left shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

      <span :style="'left: ' + ax + 'px'"
            class="absolute -top-1.5 size-3 -translate-x-1/2 rotate-45 border-t border-l border-zinc-300 bg-white"
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
      <a href="/grn/4471/costing/" class="mt-2.5 inline-block text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Costing sheet</a>
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
            class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
            class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="sliders-horizontal" class="size-4 text-zinc-600"></i>Narrow the GRN list
  </button>

  <div id="pop-sh" x-ref="panel" x-show="open" x-cloak
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
              class="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15 sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-[12px]/4 sm:underline sm:underline-offset-2 sm:hover:bg-transparent">Cancel</button>
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
     out from under the pointer. It is aria-hidden, so the whole of what a
     reader is told comes from the role="status" line above it.

     That line sits outside the swap target and is written by x-text rather than
     replaced, which is what makes the failure audible. A region that is swapped
     away by the first response cannot report the second one, and the failure
     block below is revealed by x-show rather than inserted — a node that is
     merely shown is not a mutation every reader announces, while a node the
     swap inserts is. One region, in the panel from the moment the panel opens,
     covers both.

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
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="git-compare" class="size-4 text-zinc-600"></i>Three-way match
    <span class="text-[12px]/4 tabular-nums text-zinc-500">GRN-24-4471</span>
  </button>

  <div id="pop-hx" x-ref="panel" x-show="open" x-cloak
       role="dialog" tabindex="-1" aria-labelledby="pop-hx-title"
       class="absolute top-full left-0 z-40 mt-1.5 w-80 max-w-[calc(100vw_-_1.5rem)] rounded-xl border border-zinc-300 bg-white p-4 shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

    <p id="pop-hx-title" class="text-[13px]/5 font-medium tabular-nums">Match · GRN-24-4471</p>

    <p role="status" class="sr-only"
       x-text="failed ? 'Could not load the three-way match.' : (loaded ? '' : 'Loading the three-way match.')"></p>

    <div x-ref="body" x-show="!failed"
         hx-get="/grn/4471/match/" hx-trigger="popover-fetch"
         hx-swap="innerHTML" hx-sync="this:drop"
         :aria-busy="!loaded"
         class="mt-3 border-t border-zinc-100 pt-3">
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
        <a href="/grn/4471/" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Open the GRN</a>
      </div>
    </div>
  </div>
</div>` },

      { id: 'django', name: 'Django filter form', tagNew: true, code:
`<!-- A real form is the draft. The server renders the panel with the filters
     that are actually applied, so those are the controls' default values, and
     form.reset() on every open restores them — which is exactly the reseed the
     filter variant writes by hand in JavaScript. Light dismiss throws the
     unsubmitted values away and the next open is back to what the register is
     showing. No draft object, no Object.assign, nothing to keep in step.

     It is method="get" and it carries no csrf_token. Django does not check one
     on GET, and a token rendered into a GET form is submitted as a querystring
     parameter — into the address bar, the history, the referer header and every
     link the user pastes into a ticket. The filters belong in the URL; the
     token does not.

     The hidden inputs are the search and the sort the register is already
     using. A GET form submits its own fields and nothing else, so without them
     applying a filter silently clears the search box at the top of the page and
     resets the sort to the default — the commonest bug in a server-rendered
     filter panel, and one that reads as the filter being broken rather than the
     form being incomplete.

     Nothing hard-codes a widget id. auto_id generates them, a prefix or a
     second instance of the form changes them, and a template that writes
     id_status by hand binds its label to whatever else on the page happens to
     own that id. Labels take id_for_label, messages take auto_id, and the panel
     finds its first field to focus by query rather than by ref.

     aria-describedby and aria-invalid are set on the widget in the form's
     __init__ and never written in the template: widget attrs are fixed before
     the template renders, and __init__ is the only place that knows both the
     errors and the generated ids.

     Apply submits and the browser navigates, so the panel's open state does not
     have to survive anything — the next page renders it closed with a fresh
     count on the trigger. That is why a filter that batches suits a
     server-rendered register better than one applied live: there is exactly one
     request per decision, and the URL is the state.

     # forms.py
     class OrderFilterForm(forms.Form):
         status = forms.ChoiceField(
             required=False, label='Status',
             choices=[('', 'Any status')] + PurchaseOrder.Status.choices,
             widget=forms.Select(attrs={
                 'class': 'w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none'}))
         min_value = forms.IntegerField(
             required=False, label='Order value at least',
             widget=forms.NumberInput(attrs={
                 'inputmode': 'numeric',
                 'class': 'w-full bg-transparent px-3 py-2 text-right '
                          'text-[14px]/5 tabular-nums outline-none'}))
         overdue = forms.BooleanField(
             required=False, label='Only orders past their delivery date',
             widget=forms.CheckboxInput(attrs={
                 'class': 'size-4 shrink-0 accent-zinc-700'}))

         def __init__(self, *args, **kwargs):
             kwargs.setdefault('label_suffix', '')
             super().__init__(*args, **kwargs)
             for name in self.fields:
                 bf = self[name]
                 if bf.errors:
                     self.fields[name].widget.attrs.update({
                         'aria-invalid': 'true',
                         'aria-describedby': bf.auto_id + '-err'})

     # views.py
     def order_list(request):
         # request.GET or None, not request.GET: a bare page load would bind an
         # empty form and the panel would open reporting errors for filters
         # nobody has set yet.
         form = OrderFilterForm(request.GET or None)
         active = sum(1 for f in ('status', 'min_value', 'overdue') if request.GET.get(f)) -->
<div data-kui="popover/django" class="relative inline-block"
     x-data="{
       open: false,
       show() {
         this.$refs.form.reset();
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => {
           const f = this.$refs.form.querySelector('select, input:not([type=hidden])');
           (f || this.$refs.panel).focus();
         }));
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
          :aria-expanded="open" aria-controls="pop-dj"
          class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="filter" class="size-4 text-zinc-600"></i>Filters
    {% if active %}
      <span class="inline-flex min-w-5 items-center justify-center rounded-full bg-zinc-200 px-1.5 text-[11px]/4 font-medium text-zinc-700 tabular-nums ring-1 ring-inset ring-zinc-300">{{ active }}</span>
    {% endif %}
  </button>

  <div id="pop-dj" x-ref="panel" x-show="open" x-cloak
       role="dialog" tabindex="-1" aria-labelledby="pop-dj-title"
       class="absolute top-full left-0 z-40 mt-1.5 w-80 max-w-[calc(100vw_-_1.5rem)] overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">

    <form x-ref="form" method="get" action="{% url 'orders:list' %}">
      {# what the register is already showing and this form does not own #}
      <input type="hidden" name="q" value="{{ request.GET.q|default:'' }}">
      <input type="hidden" name="sort" value="{{ request.GET.sort|default:'-raised_on' }}">

      <div class="space-y-3 px-4 py-3.5">
        <p id="pop-dj-title" class="text-[13px]/5 font-medium">Filter purchase orders</p>

        <div>
          <label for="{{ form.status.id_for_label }}" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">{{ form.status.label }}</label>
          <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
            {{ form.status }}
          </div>
        </div>

        <div>
          <label for="{{ form.min_value.id_for_label }}" class="mb-1.5 block text-[12px]/4 font-medium text-zinc-600">{{ form.min_value.label }}</label>
          <div class="rounded-lg bg-white {% if form.min_value.errors %}border border-red-600 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15{% else %}border border-zinc-200 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15{% endif %}">
            {{ form.min_value }}
          </div>
          {% if form.min_value.errors %}
            <p id="{{ form.min_value.auto_id }}-err" class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
              <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>{{ form.min_value.errors.0 }}
            </p>
          {% endif %}
        </div>

        {# the widget is inside the label, so no for attribute and no second #}
        {# copy of the string in the accessible name                        #}
        <label class="flex items-center gap-2.5 py-1 text-[13px]/5">
          {{ form.overdue }}
          {{ form.overdue.label }}
        </label>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-100 px-4 py-2.5">
        <a href="{% url 'orders:list' %}?q={{ request.GET.q|urlencode }}&sort={{ request.GET.sort|default:'-raised_on'|urlencode }}"
           class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Clear</a>
        <button type="submit"
                class="rounded-lg bg-zinc-700 px-3.5 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Apply</button>
      </div>
    </form>
  </div>
</div>` }
    ]
  },

  {
    id: 'avatar', name: 'Avatar', category: 'feedback',
    description: 'Initials in a circle standing in for a person. Nothing in this system uploads a photograph, so a zinc tint and two letters is the component; where the identity provider hands one over, the photograph is a layer painted on top of the letters.',
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
      'Never derive initials from an email address. Every shared vendor mailbox comes out as ST, AC or PU, and a page of them reads as three colleagues who are not people at all. An account with no name takes the icon.',
      'The tinted circle is bg-zinc-200, not bg-zinc-100. zinc-100 is the page background, so a zinc-100 avatar has no fill at all wherever it sits on the page, on a selected row, or in a preview panel — the ring alone is left and the initials float inside an outline.',
      'The white ring on a stacked circle replaces the zinc-300 edge rather than joining it. An element gets one ring, and in a stack the 2px white gap is the stronger edge — it is the whole reason four overlapping circles read as four.',
      'Initials are text and have to clear 4.5:1. zinc-500 on zinc-100 measures 4.39 and fails; zinc-600 on zinc-200 measures 6.08 and passes.',
      'A photograph is never a swap. It arrives from the identity provider, which means it can 404, expire or be refused by the proxy on any given request, and a src that fails after the initials were replaced leaves a broken-image glyph in a circle. The letters stay underneath and the image lies over them.',
      'An organisation is not a person and does not take a circle. Same fill, same ring, rounded-lg instead. An activity feed that mixes a vendor, a nightly integration and three colleagues is unreadable when all five are faces.',
      'Past four, faces stop being read and become texture. Where the column asks how many rather than who, the whole group is one count chip and the names move to its label. A count of one is not a count — draw the person, because "1" has thrown away the only name the column had.',
      'The presence dot is only legible as presence when a word beside it says so. In a register row, where the reader is scanning what records are doing, a green dot on a face reads as Closed — so rows do not carry one.',
      'truncate on a name inside a table cell does nothing unless the table is table-fixed. Under the default auto layout the cell grows to fit the name — measured here at 318px stretching to 483px — and pushes the columns to its right off the edge.'
    ],
    anatomy: [
      ['Circle', 'A rounded-full box at size-7, size-9 or size-11. shrink-0 always, or a long name beside it deforms the circle.'],
      ['Initials', 'Two letters, font-medium, one step down from the text they sit beside so they do not shout.'],
      ['Fill', 'bg-zinc-200 with zinc-600 letters for everyone; bg-zinc-700 with white letters for the signed-in user alone.'],
      ['Edge', 'ring-1 ring-inset ring-zinc-300 on the tinted fill. The graphite fill needs none.'],
      ['Photograph', 'Optional, and only ever from the identity provider. Absolutely positioned over the initials with object-cover, and removed on error rather than replaced.'],
      ['Non-person', 'rounded-lg rather than rounded-full for a vendor or an automated user, with an icon where a person would have initials. One radius token apart, and it survives greyscale, print and a 28px row.'],
      ['Ring', 'ring-2 ring-white, used only in a stack, so the overlap reads as separate circles rather than one shape.'],
      ['Overflow chip', 'The +N at the end of a stack. tabular-nums, and the group carries the names it stands for.'],
      ['Count chip', 'The entire group as one figure, for a column too narrow for faces. tabular-nums, a users icon, and every name on its accessible label.'],
      ['Presence dot', 'Optional, bottom-right, on a white ring. It says something about the person, never about the record.']
    ],
    behaviour: [
      'The circle is a fixed square at every size, so a row of avatars keeps its rhythm regardless of name length.',
      'Text beside an avatar truncates; the circle never shrinks. That is shrink-0 on the circle and min-w-0 on the text.',
      'A stack overlaps by -space-x-5 and each circle carries a 2px white ring, which is what separates them where they cover each other',
      'The stack shows three or four and rolls the rest into a +N chip. Past that the row stops being scannable.',
      'A photograph that fails takes itself out of the DOM and the initials it was covering were never removed, so nothing reflows and nothing renders a broken-image glyph.',
      'Initials are supplied by the server. Deriving them in the template mishandles single-word names, three-part names and names where the family name comes first.',
      'Where there is no name at all — a service account, a shared mailbox — the circle falls back to an icon rather than to letters taken from an address.',
      'Size follows context: size-7 in a table row, size-9 in a list or a card header, size-11 in a record header.'
    ],
    a11y: [
      'Where the name is written beside the avatar, the circle is aria-hidden — the name is already there and the letters would be read twice.',
      'Where the avatar stands alone, it carries the full name through aria-label, because two letters identify nobody.',
      'A stack puts the names on the group as one accessible label, rather than leaving four unlabelled circles and a number.',
      'The +N chip is included in that group label — "and 4 more" — so the count is not an orphaned digit.',
      'A count chip carries the names it stands for. The figure is what is drawn; the label is what is read.',
      'A photograph always takes alt="". The circle around it is already either labelled or hidden, and alt text on the image says the name a second time.',
      'An avatar standing for an organisation or an automated user says so in words. Shape is not announced, so "Tally sync" has to be in the text beside it.',
      'Colour carries no information here, so nothing is lost by not seeing it. The graphite fill is a convenience, not a signal.',
      'An avatar that opens a menu is a real button with its own accessible name; the circle itself is never the only clickable thing.',
      'A trigger whose visible name is hidden below sm has no accessible name at that width — display:none takes the string out of the tree with the pixels. Put the name on the button itself with aria-label, keeping the visible text inside it, so the button is named at every width.'
    ],
    related: ['badge', 'tooltip', 'topbar'],
    variants: [
      { id: 'sizes', name: 'Sizes', code:
`<!-- size-7 in a table row, size-9 in a list or card header, size-11 on a record.
     The text step drops with the circle so the letters never crowd the edge.

     All three stand on their own with no name written beside them, which is why
     each carries role="img" and the full name. Without the label a screen
     reader gets two letters, and two letters are not a person. -->
<div data-kui="avatar/sizes" class="flex flex-wrap items-center gap-4">
  <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[11px]/4 font-medium text-zinc-600" aria-label="Ritu Deshpande" role="img">RD</span>
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-label="Ritu Deshpande" role="img">RD</span>
  <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[14px]/5 font-medium text-zinc-600" aria-label="Ritu Deshpande" role="img">RD</span>
</div>` },

      { id: 'self', name: 'The signed-in user', code:
`<!-- Graphite marks you, and nobody else. If every avatar is filled, the
     distinction it exists to make has gone.

     The filled circle takes no ring. An edge exists to hold a tint apart from
     the surface underneath it, and zinc-700 on zinc-100 is not in any danger of
     being read as the page.

     The label says "you" out loud. The fill is the only thing that carries it
     otherwise, and a fill is exactly the kind of signal that reaches nobody
     using a screen reader and nobody printing the page. -->
<div data-kui="avatar/self" class="flex flex-wrap items-center gap-4">
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[13px]/5 font-medium text-white" aria-label="Ritu Deshpande, you" role="img">RD</span>
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-label="Sanjay More" role="img">SM</span>
  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-label="Imran Qureshi" role="img">IQ</span>
</div>` },

      { id: 'photo', name: 'When the photograph does not arrive', tagNew: true, code:
`<!-- Nothing in this application uploads a photograph. The only ones that exist
     came back from the identity provider with the sign-in, which means the URL
     is somebody else's, it expires, it 404s for the half of the directory that
     never set a picture, and on a plant network the proxy refuses it outright.
     Failure is the ordinary case here, not the edge one.

     So the initials are not a fallback. They are the resting content of the
     circle and the photograph is a layer over them, removed on error. The two
     obvious alternatives both fail in the field: swapping src to a placeholder
     image trades one request that can fail for another, and hiding the img on
     error leaves an empty circle unless something was already underneath it.

     onerror rather than an Alpine @error, and this is the one place inline HTML
     wins outright. An image error fires while the document is still parsing,
     long before Alpine boots, so a listener bound afterwards never hears it and
     the broken-image glyph stays on screen.

     The edge is its own layer. An inset ring is painted under the element's
     content, so ring-1 ring-inset on the circle disappears behind the
     photograph exactly where a pale photograph needs an edge most. The overlay
     span draws it above the image and keeps drawing it after the image is gone.

     alt is empty on all of them. The circle is already aria-hidden because the
     name is written beside it, and alt text here would say the name twice. -->
<div data-kui="avatar/photo" class="space-y-3">
  <div class="flex items-center gap-3">
    <span class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">RD
      <img src="/media/directory/ritu-deshpande.jpg" alt="" onerror="this.remove()" class="absolute inset-0 size-full object-cover">
      <span class="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-zinc-300"></span>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Ritu Deshpande</p>
      <p class="truncate text-[12px]/4 text-zinc-600">Directory photograph</p>
    </div>
  </div>

  <div class="flex items-center gap-3">
    <span class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">SM
      <img src="/media/directory/expired-token.jpg" alt="" onerror="this.remove()" class="absolute inset-0 size-full object-cover">
      <span class="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-zinc-300"></span>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Sanjay More</p>
      <p class="truncate text-[12px]/4 text-zinc-600">Photograph failed to load</p>
    </div>
  </div>

  <div class="flex items-center gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">IQ</span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Imran Qureshi</p>
      <p class="truncate text-[12px]/4 text-zinc-600">No photograph on the account</p>
    </div>
  </div>
</div>` },

      { id: 'derived', name: 'Names that do not give you two initials', tagNew: true, code:
`<!-- The two-word English name is the case that never breaks, and it is roughly
     a third of this directory. The rest of these rows are what the server has
     to answer, and they are the reason the initials are computed once on the
     model rather than sliced out of a name in a template on every screen.

     Three or more words takes the first and the last, because which of them is
     the family name changes by state and the rule cannot depend on knowing.
     A single word takes two letters of itself, since one letter is not a name.
     A company drops its legal suffix first, or a third of the vendor list comes
     out PL. Devanagari takes one akshara per word and steps the text down,
     because two aksharas set wider than two Latin capitals and touch the ring.

     An account with no name at all — a shared mailbox, a service login — takes
     the icon. Letters off the local part would give ST for stores@, AC for
     accounts@ and PU for purchase@, and a page of vendor mailboxes would read
     as three colleagues nobody can find in the directory.

     The company row is square, for the reason avatar/org sets out: it is not a
     person and a circle says it is. -->
<div data-kui="avatar/derived" class="max-w-md divide-y divide-zinc-100 rounded-xl border border-zinc-300 bg-white">
  <div class="flex items-center gap-3 px-4 py-2.5">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">SM</span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Sanjay More</p>
      <p class="truncate text-[12px]/4 text-zinc-600">Two words — the first letter of each</p>
    </div>
  </div>
  <div class="flex items-center gap-3 px-4 py-2.5">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">VK</span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Venkataraman Balasubramanian Krishnamurthy</p>
      <p class="truncate text-[12px]/4 text-zinc-600">Three or more — the first and the last</p>
    </div>
  </div>
  <div class="flex items-center gap-3 px-4 py-2.5">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">SU</span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Sunita</p>
      <p class="truncate text-[12px]/4 text-zinc-600">One word — its first two letters</p>
    </div>
  </div>
  <div class="flex items-center gap-3 px-4 py-2.5">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[12px]/4 font-medium text-zinc-600" aria-hidden="true">रिदे</span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">रितु देशपांडे</p>
      <p class="truncate text-[12px]/4 text-zinc-600">Devanagari — one akshara per word, a step smaller</p>
    </div>
  </div>
  <div class="flex items-center gap-3 px-4 py-2.5">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">GP</span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Gujarat Polymers Ltd</p>
      <p class="truncate text-[12px]/4 text-zinc-600">A company — the legal suffix drops out first</p>
    </div>
  </div>
  <div class="flex items-center gap-3 px-4 py-2.5">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-zinc-600" aria-hidden="true">
      <i data-lucide="at-sign" class="size-4"></i>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">stores@gujaratpolymers.in</p>
      <p class="truncate text-[12px]/4 text-zinc-600">No name — the icon, never letters off the address</p>
    </div>
  </div>
</div>` },

      { id: 'org', name: 'Not a person', tagNew: true, code:
`<!-- An activity trail on a purchase order is not a list of colleagues. Half of
     it is the vendor acknowledging, amending and dispatching, and a good part
     of the rest is the nightly Tally sync posting receipts at 02:00. Draw all
     three as faces and the only way to find out that nobody was at a desk when
     the GRN was posted is to read every line.

     The separator is the radius and nothing else — same box, same fill, same
     ring, rounded-lg instead of rounded-full. It survives greyscale, it
     survives print, and it is still legible in a 28px row, which is more than a
     corner badge or a second colour manages. Colour is not available for this
     at all: it is spoken for by what the record is doing.

     The integration takes an icon where a person takes initials. "TS" in a box
     is the shape of a human being with those initials, and the entire point of
     the row is that there is no such person.

     The shape is not announced, so the words carry it: the actor is named in
     the line, and the circle stays aria-hidden. A vendor never gets a
     photograph slot either — a logo arrives at whatever size the vendor emailed
     it, and the row height goes with it. -->
<div data-kui="avatar/org" class="max-w-md space-y-3">
  <div class="flex items-start gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">GP</span>
    <div class="min-w-0">
      <p class="text-[13px]/5 tabular-nums"><span class="font-medium">Gujarat Polymers Ltd</span> acknowledged PO-24-1187</p>
      <p class="text-[12px]/4 tabular-nums text-zinc-600">04 Sep 2026 · 11:20</p>
    </div>
  </div>
  <div class="flex items-start gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-zinc-600" aria-hidden="true">
      <i data-lucide="bot" class="size-4"></i>
    </span>
    <div class="min-w-0">
      <p class="text-[13px]/5 tabular-nums"><span class="font-medium">Tally sync</span> posted GRN 1142 · 18.400 MT</p>
      <p class="text-[12px]/4 tabular-nums text-zinc-600">05 Sep 2026 · 02:04 · automated</p>
    </div>
  </div>
  <div class="flex items-start gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">SM</span>
    <div class="min-w-0">
      <p class="text-[13px]/5"><span class="font-medium">Sanjay More</span> released the material to production</p>
      <p class="text-[12px]/4 tabular-nums text-zinc-600">05 Sep 2026 · 09:35</p>
    </div>
  </div>
</div>` },

      { id: 'with-name', name: 'With name and role', code:
`<!-- The name is written, so the circle is aria-hidden. Otherwise a screen
     reader announces "RD Ritu Deshpande".

     min-w-0 on the text block is what lets truncate work — a flex child refuses
     to shrink below its content width without it, so the name pushes the
     timestamp off the row instead of ellipsing. -->
<div data-kui="avatar/with-name" class="space-y-3">
  <div class="flex items-center gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">RD</span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Ritu Deshpande</p>
      <p class="truncate text-[12px]/4 tabular-nums text-zinc-600">Purchase lead · approved PO-24-1187</p>
    </div>
  </div>

  <div class="flex items-center gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">SM</span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-[13px]/5 font-medium">Sanjay More</p>
      <p class="truncate text-[12px]/4 tabular-nums text-zinc-600">Stores, Plant 2 · posted GRN 1142</p>
    </div>
    <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">16 Aug</span>
  </div>
</div>` },

      { id: 'stacked', name: 'Stacked group', code:
`<!-- Circles sit over the ones beneath them and cover most of their initials.
     That is the point: a stack answers "how many and roughly who", not "which
     one is Sanjay". Keeping every pair of letters readable would mean barely
     overlapping at all, and then it reads as a row rather than a group.

     The white ring is here instead of the zinc-300 edge, not alongside it. An
     element gets one ring, and in a stack the 2px white gap is the stronger
     edge — without it four overlapping circles are one grey shape.

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

      { id: 'count', name: 'When the count matters more than the faces', tagNew: true, code:
`<!-- A register column asks how many still have to sign. It does not ask whose
     faces they are, and it has about ninety pixels to answer in — four size-7
     circles and a +N chip need a hundred and forty, so the stack either clips
     or takes the width off the vendor name.

     Past four the faces have stopped being read anyway. They become texture:
     the eye counts the shapes and skips the letters, which is the count with
     extra steps and a wider column. Drawing the figure directly is the same
     information at a third of the width.

     Nothing is lost, because the names are on the chip's label. The figure is
     what is drawn and the list is what is read, which is the same split the
     stack makes.

     One approver is drawn as the person, not as a 1. A count of one has thrown
     away the only name the column had, and the circle at that width still
     carries the name on itself.

     Opening the full list belongs to popover or hovercard. This chip is a
     label, so it is a span and not a button — a control that looks pressable
     and does nothing is worse than a plain mark. -->
<div data-kui="avatar/count" class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <table class="w-full table-fixed">
    <caption class="sr-only">Purchase orders awaiting approval</caption>
    <thead>
      <tr class="border-b border-zinc-200 bg-zinc-50 text-left">
        <th scope="col" class="w-[7.5rem] px-3 py-2 text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Order</th>
        <th scope="col" class="px-3 py-2 text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Vendor</th>
        <th scope="col" class="w-24 px-3 py-2 text-[11px]/4 font-medium uppercase tracking-wider text-zinc-600">Approvers</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-zinc-100">
      <tr>
        <td class="px-3 py-2.5 text-[13px]/5 font-medium tabular-nums">PO-24-1187</td>
        <td class="px-3 py-2.5"><span class="block truncate text-[13px]/5">Gujarat Polymers Ltd</span></td>
        <td class="px-3 py-2.5">
          <span role="img" aria-label="6 approvers: Ritu Deshpande, Sanjay More, Imran Qureshi and 3 more"
                class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <i data-lucide="users" class="size-3.5 text-zinc-600"></i><span class="tabular-nums">6</span>
          </span>
        </td>
      </tr>
      <tr>
        <td class="px-3 py-2.5 text-[13px]/5 font-medium tabular-nums">PO-24-1191</td>
        <td class="px-3 py-2.5"><span class="block truncate text-[13px]/5">Shreeji Engineering Works</span></td>
        <td class="px-3 py-2.5">
          <span role="img" aria-label="12 approvers on the capital purchase panel"
                class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <i data-lucide="users" class="size-3.5 text-zinc-600"></i><span class="tabular-nums">12</span>
          </span>
        </td>
      </tr>
      <tr>
        <td class="px-3 py-2.5 text-[13px]/5 font-medium tabular-nums">PO-24-1163</td>
        <td class="px-3 py-2.5"><span class="block truncate text-[13px]/5">Konkan Chemicals Pvt Ltd</span></td>
        <td class="px-3 py-2.5">
          <span role="img" aria-label="Approver: Ritu Deshpande"
                class="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[11px]/4 font-medium text-zinc-600">RD</span>
        </td>
      </tr>
    </tbody>
  </table>
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
     that belongs on a badge, where the colour mapping is fixed.

     It only reads that way because a word is written beside it. Drop the word
     and the same green disc on the same face, in a register of orders, is the
     Closed dot on the record — which is why the table variants carry no
     presence at all. Presence belongs where people are the subject: a member
     list, an assignee picker, the header of a chat panel.

     The dot sits on a white ring so it separates from the tint underneath it at
     any size, and it hangs off the corner rather than inside the circle, where
     it would sit on top of a letter. -->
<div data-kui="avatar/presence" class="flex flex-wrap items-center gap-6">
  <div class="flex items-center gap-3">
    <span class="relative shrink-0">
      <span class="flex size-9 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">RD</span>
      <span class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-600 ring-2 ring-white" aria-hidden="true"></span>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Ritu Deshpande</p>
      <p class="truncate text-[12px]/4 text-zinc-600">Online</p>
    </div>
  </div>
  <div class="flex items-center gap-3">
    <span class="relative shrink-0">
      <span class="flex size-9 items-center justify-center rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 text-[13px]/5 font-medium text-zinc-600" aria-hidden="true">SM</span>
      <span class="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-zinc-300 ring-2 ring-white" aria-hidden="true"></span>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 font-medium">Sanjay More</p>
      <p class="truncate text-[12px]/4 tabular-nums text-zinc-600">Last seen 16 Aug</p>
    </div>
  </div>
</div>` },

      { id: 'menu', name: 'Account trigger', code:
`<!-- The circle is inside a real button carrying its own name. An avatar that
     is the only clickable thing gives the keyboard nothing to land on.

     The name is on the button as an aria-label, not left to the visible span,
     because that span is hidden below sm — and display:none takes the string
     out of the accessibility tree along with the pixels. Without the label the
     button is nameless on every phone. The label repeats the visible text
     rather than replacing it with something shorter, so speech input can still
     act on the words that are on screen.

     The panel here is the smallest thing that demonstrates the trigger. A real
     account menu is dropdown/account, which owns the roving tabindex, the
     Escape handling and the focus return; do not rebuild that here. -->
<div data-kui="avatar/menu" class="flex justify-end">
  <div class="relative inline-block" x-data="{ open: false }" @click.outside="open = false">
    <button type="button" @click="open = !open" :aria-expanded="open" aria-haspopup="menu"
            aria-label="Ritu Deshpande — account menu"
            class="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
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
      <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="user" class="size-4 text-zinc-600"></i>Profile
      </button>
      <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="settings" class="size-4 text-zinc-600"></i>Preferences
      </button>
      <button type="button" role="menuitem" class="flex w-full items-center gap-2.5 border-t border-zinc-200 px-3 py-2 text-left text-[13px]/5 hover:bg-zinc-100 focus-visible:outline-3 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700/15">
        <i data-lucide="log-out" class="size-4 text-zinc-600"></i>Sign out
      </button>
    </div>
  </div>
</div>` },

      { id: 'placeholder', name: 'Unassigned', code:
`<!-- Nobody is a real state and needs a real rendering. An empty circle reads
     as a loading bug; a dashed one with a verb reads as an invitation.

     Dashed and unfilled rather than tinted, because a filled circle with an
     icon in it is how avatar/org draws an automated user — and a queue where
     the unassigned rows look like a system account is worse than one where they
     look like nothing at all. -->
<div data-kui="avatar/placeholder" class="flex flex-wrap items-center gap-6">
  <div class="flex items-center gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-zinc-300 text-zinc-600" aria-hidden="true">
      <i data-lucide="user" class="size-4"></i>
    </span>
    <div class="min-w-0">
      <p class="truncate text-[13px]/5 text-zinc-600">Unassigned</p>
      <p class="truncate text-[12px]/4 tabular-nums text-zinc-500">PO-24-1191 · raised 18 Aug</p>
    </div>
  </div>
  <button type="button" class="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-200 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="user-plus" class="size-4 text-zinc-600"></i>Assign approver
  </button>
</div>` },

      { id: 'django', name: 'One include, four branches', tagNew: true, code:
`<!-- Four things decide what a circle looks like — whether there is a person at
     all, whether that person is you, whether a photograph came back with the
     sign-in, and whether the name is already written beside it. Spread those
     across call sites and every screen gets three of the four right.

     # people/models.py
     LEGAL = {'ltd', 'pvt', 'llp', 'inc', 'co'}

     @property
     def initials(self):
         parts = [p for p in self.display_name.split()
                  if p.strip('.').lower() not in LEGAL]
         if not parts:
             return ''
         if len(parts) == 1:
             return parts[0][:2].upper()
         return (parts[0][0] + parts[-1][0]).upper()

     upper() is a no-op on Devanagari, which is what you want — there is no
     capital form to reach for and forcing one changes nothing. Empty initials
     are the signal to draw the icon, and they are returned rather than guessed,
     because the guess would be letters off an email address.

     # the call sites
     {% include "people/_avatar.html" with person=entry.actor named=True %}
     {% include "people/_avatar.html" with person=order.approver %}

     named is what the caller promises: the full name is written next to this,
     so the circle can go silent. Leaving it off labels the avatar, and that is
     deliberately the safe default — a name read twice is a nuisance, a name
     nobody can reach is a person who cannot be identified at all.

     The photograph is inside the same include so its onerror is not something a
     call site can forget. Django escapes the URL and the name in the attributes
     for free; do not mark either safe. -->
{# people/_avatar.html #}
<span data-kui="avatar/django"
      class="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px]/5 font-medium {% if not person %}border border-dashed border-zinc-300 text-zinc-600{% elif person == request.user %}bg-zinc-700 text-white{% else %}bg-zinc-200 text-zinc-600{% endif %}"
      {% if named %}aria-hidden="true"{% else %}role="img" aria-label="{% if person %}{{ person.display_name }}{% if person == request.user %}, you{% endif %}{% else %}Unassigned{% endif %}"{% endif %}>
  {% if not person %}
    <i data-lucide="user" class="size-4"></i>
  {% elif person.initials %}
    {{ person.initials }}
    {% if person.photo_url %}
      <img src="{{ person.photo_url }}" alt="" onerror="this.remove()" class="absolute inset-0 size-full object-cover">
    {% endif %}
    {% if person != request.user %}
      <span class="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-zinc-300"></span>
    {% endif %}
  {% else %}
    <i data-lucide="at-sign" class="size-4"></i>
    <span class="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-zinc-300"></span>
  {% endif %}
</span>` }
    ]
  },

);
