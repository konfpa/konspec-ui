register(
  {
    id: 'label', name: 'Label', category: 'forms',
    description: 'The name of a control, bound to it with for and id or by wrapping it. The smallest component here, and the one that is most often drawn rather than connected.',
    when: 'Every control that has visible text naming it. A group of controls takes a legend instead, and a control with no text at all — an icon-only button, a bare filter — takes an aria-label. Label, help text and error together are the field component; this entry is only the name.',
    notes: [
      'There are exactly two bindings and they are not interchangeable. for and id names a control that sits outside the label element, which is every text input, select and textarea, because the box is not inside the sentence that names it. Wrapping is for a checkbox, a radio or a switch, where the control and its text are one row and the point of the label is that the whole row is the target. Choosing by taste rather than by shape is how a checkbox ends up with a 16px hit area and a text field ends up inside a label it does not need.',
      'for accepts only a labelable element — button, input, meter, output, progress, select, textarea. Point it at a div, a span, a fieldset or a contenteditable and nothing happens: no error, no warning, no console message, and the markup validates. There is one symptom and it is worth knowing, because it is the cheapest test in this entry: click the label text. If focus does not land in the control, or the box does not toggle, the binding is broken — a mistyped for, a duplicated id, a control that ended up outside the label it was meant to be inside. Every one of those is findable at the mouse in a second rather than in a screen reader an hour later.',
      'ids are per document, not per component, and for binds to the first element carrying the id. A row loop that renders id="qty" on every line makes every label in the table focus line one. Django is a quieter version of the same problem: auto_id gives id_vendor to the field in both forms on a page, so the second form\'s label drives the first form\'s input. Prefix the ids with something that varies — the record id, the form prefix — and never with a bare index.',
      'A label is a name, not a description. Everything inside the label element is concatenated into the accessible name, so a two-line explanation is read back in full every time focus lands on the control, and again on every keystroke of an arrow key through a radio group. Help text lives outside the label and is attached with aria-describedby, which is announced once and after the name.',
      'Nothing interactive goes inside a label. A link, a button or a second control inside it is clicked, the click bubbles to the label, and the label forwards it to its own control — so the link both navigates and toggles the checkbox, or the button both fires and steals focus into the field. A trailing action on the label row is a sibling of the label inside a flex row, never a child of it.',
      'The accessible name has a precedence order and label is not at the top of it: aria-labelledby beats aria-label beats the label element beats placeholder beats title. Writing aria-label on a control that already has a visible label replaces the visible words with a string nobody can see, and if the two disagree, voice control fails — a user saying the words on screen addresses a control that is not called that. Use one, and when there is visible text, that is the one.',
      'The red asterisk is decoration unless the required attribute is on the control. It also has no business in the accessible name, so it carries aria-hidden="true" and required does the announcing — otherwise the field is called "Vendor star" and every screen reader pronounces the glyph differently. Explain the convention once at the top of the form, and mark whichever set is smaller: on a form where eleven of twelve fields are required, marking the one optional field is the honest version.',
      'A group of controls cannot take a label. A radio group or a set of related checkboxes is a fieldset whose first child is a legend, and the legend has to be the first child or it is not the group\'s name — a stray div above it demotes it to ordinary text and the group is announced with no question attached. There is no for on a legend and none is needed; the fieldset is the scope.',
      'peer- reaches forward to siblings, has- reaches down from an ancestor, and which one is available is decided by the order of the markup, not by preference. In the label-above-control layout the label comes first, so peer-disabled on it never matches anything and quietly does nothing; the wrapper around both takes has-[:disabled] instead. In the checkbox and toggle shapes the painted part follows the input, which is exactly why those use peer-disabled and peer-checked.',
      'has-[:read-only] is a trap. The CSS :read-only pseudo-class matches every element that is not user-alterable, which is every div, span and paragraph on the page, so a wrapper containing any of them matches always and the read-only styling is permanently on. Match the attribute instead, has-[[readonly]], or write the classes outright when readonly is a server-rendered fact rather than a state that changes.',
      'Disabled greys the label; read-only does not. A disabled control has a value nobody may change and often nobody needs to read, so the whole row drains to zinc-500. A read-only control has a value that still matters and still has to be copied out of, so only the surface goes to bg-zinc-100 and the label stays at full weight. Dim both and you have told the user the order number does not matter.',
      'A form label is text-[13px]/5 font-medium in the default text colour. The 11px uppercase tracking-wider label is a column header and a record caption, not a form control name — put it on an eight-field form and the form reads as eight section headings with a box under each.'
    ],
    anatomy: [
      ['Text', 'The name of the control and nothing else. text-[13px]/5 font-medium, mb-1.5 block above a field, or inline inside a wrapping label.'],
      ['Binding', 'for pointing at the control\'s id, or containment. One or the other on every control; a label that only sits above one is a paragraph.'],
      ['Required marker', 'A red asterisk with aria-hidden="true", backed by the required attribute on the control and explained once at the top of the form.'],
      ['Trailing slot', 'A hint, a count or an action on the same baseline as the label, as a sibling in a flex row. Outside the label element, always — a description would join the name and an action would be swallowed by it.'],
      ['Legend', 'What a fieldset uses instead of a label. First child of the fieldset, or it is not the group\'s name.'],
      ['Hidden label', 'A real label with sr-only when the control has a visible name in its surroundings, or aria-label when there is no text at all. Never a placeholder.'],
      ['Description', 'The 12px zinc-500 line under the control, outside the label, attached with aria-describedby so it is announced after the name rather than as part of it.']
    ],
    behaviour: [
      'Clicking the label moves focus into the control. On a checkbox, a radio or a switch it toggles as well, which is the whole reason those are wrapped rather than bound by id — the row becomes the target and a 16px box stops being the hit area.',
      'The pointer follows the same split. The base rule gives cursor: pointer only to a label whose direct child is a checkbox or a radio, because that is the only case where clicking the text does something. A for-bound label over a text field keeps the text cursor, since all a click does there is move focus, and it stays selectable text.',
      'Wrapping the control in a div for layout inside the label breaks the pointer without breaking anything else. The rule matches label:has(> input[type="checkbox"]), so the input has to stay the label\'s direct child; put the flex on the label itself.',
      'A disabled control turns the whole row to cursor: not-allowed through label:has(> input:disabled), so the row says no before it is clicked rather than after.',
      'The label never reports state. It names the setting, not its position — "Auto-approve orders under ₹50,000", not "Enabled" — because a name that changes with the value is announced as a contradiction the moment the two disagree.',
      'A label wraps rather than truncates. Truncating the name of a field hides the part that distinguishes it from the field above, and the middle of a long label is usually where that lives.',
      'At 390px a horizontal form goes back to labels above their controls. A two-column layout at phone width leaves a name in a 90px gutter wrapping to four lines beside a box that is barely wider.',
      'Two labels pointing at one id are both read, in document order, as one name. That is occasionally useful for a unit after a field, and much more often it is a copy-paste that has left a field called "Quantity Quantity".'
    ],
    a11y: [
      'Every control has an accessible name before it has anything else. Without one it is announced as "edit, blank" — the role and nothing about what it is for — and a form of them is unusable in a way no amount of visual polish addresses.',
      'The name comes from a visible label wherever there is visible text, so that what a voice-control user says matches what they see. aria-label is for the case where there is genuinely no text: an icon-only button, a bare filter in a toolbar. It names the action, not the icon.',
      'sr-only on a real label is honest when the surroundings already name the control — a search box in a toolbar headed "Purchase orders" — and dishonest when it is hiding a name a sighted user also needs. The placeholder is never the substitute: some screen readers do fall back to it, which is why the pattern looks like it works, and then it disappears the moment anything is typed, sits at a contrast nobody chose, and is gone by the time the field is being checked over.',
      'Help text is attached with aria-describedby and stays out of the label element. Inside it, the whole sentence becomes part of the name and is repeated on every focus and every arrow-key pass.',
      'A fieldset with a legend is the only way to name a group. Browsers already announce an option\'s position — "45 days from invoice date, radio button, 2 of 3" — and without the legend, 2 of 3 of what is a guess.',
      'The required attribute is what announces a field as required. The asterisk is aria-hidden and exists for the eye; on its own it is a red star with no meaning attached to it.',
      'Disabled uses the disabled attribute, which takes the control out of the Tab order and out of the POST. There is no read-only checkbox — readonly does nothing on one — so a locked flag is rendered as text, with a hidden input beside it if the value still has to travel.',
      'title is not a label. It does not appear on a touch device, it does not appear on keyboard focus, and where it is announced at all it is announced last and inconsistently.'
    ],
    related: ['field', 'input', 'checkbox'],
    variants: [
      { id: 'default', name: 'Bound with for and id', code:
`<!-- for and id rather than wrapping, because the box is not inside the sentence
     that names it. Wrapping a text input in its label works, but it buys
     nothing: the click already only moves focus, and it makes the label a
     container that layout then has to fight.

     The help line sits outside the label and is reached with aria-describedby.
     Inside the label it would join the accessible name, and every time focus
     landed in the field the user would hear the field name plus the whole
     sentence about vendor emails.

     The label keeps the text cursor. The base rule gives the pointer only to a
     label directly wrapping a checkbox or a radio, and this one is neither —
     clicking it focuses the field, which is not the same promise. -->
<div data-kui="label/default" class="max-w-xl">
  <label for="lb-title" class="mb-1.5 block text-[13px]/5 font-medium">Order title</label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <input id="lb-title" name="title" value="MS angles and plates — August lot"
           aria-describedby="lb-title-help"
           class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
  </div>
  <p id="lb-title-help" class="mt-1.5 text-[12px]/4 text-zinc-500">
    Shown on the printed order and in vendor emails.
  </p>
</div>` },

      { id: 'required', name: 'Required and optional', code:
`<!-- The asterisk carries aria-hidden="true" and the required attribute does the
     announcing. Left visible to a screen reader the field is called "Vendor
     star", and every reader pronounces the glyph differently — asterisk, star,
     nothing at all. Left without required it is a red mark with no behaviour
     under it: the form submits empty and the mark was decoration.

     The convention is explained once, above the fields, not beside each of
     them. A form that repeats "required" twelve times has spent twelve lines
     saying what one line says.

     Mark the smaller set. Here two of three are required so the asterisks are
     fewer; on a form where eleven of twelve are, the honest version marks the
     one that is optional and says so at the top instead. Whichever way round,
     the word Optional is plain zinc-500 and not a second colour — optional is
     not a data state. -->
<div data-kui="label/required" class="max-w-xl">
  <p class="mb-4 text-[12px]/4 text-zinc-500">
    Fields marked <span class="text-red-600">*</span> are required.
  </p>

  <div class="space-y-4">
    <div>
      <label for="lb-req-vendor" class="mb-1.5 block text-[13px]/5 font-medium">
        Vendor <span aria-hidden="true" class="text-red-600">*</span>
      </label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <select id="lb-req-vendor" name="vendor" required class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
          <option>Gujarat Polymers Ltd</option>
          <option>Sharma Extrusions Pvt Ltd</option>
        </select>
      </div>
    </div>

    <div>
      <label for="lb-req-date" class="mb-1.5 block text-[13px]/5 font-medium">
        Required by <span aria-hidden="true" class="text-red-600">*</span>
      </label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <input id="lb-req-date" name="required_by" type="date" value="2026-09-04" required
               class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
      </div>
    </div>

    <div>
      <!-- no attribute to back it, so no mark; the word carries it instead -->
      <label for="lb-req-ref" class="mb-1.5 flex items-baseline gap-1.5 text-[13px]/5 font-medium">
        Vendor reference
        <span class="font-normal text-zinc-500">Optional</span>
      </label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <input id="lb-req-ref" name="vendor_ref" placeholder="Their quotation number"
               class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
      </div>
    </div>
  </div>
</div>` },

      { id: 'wrapping', name: 'Wrapping a checkbox', code:
`<!-- Wrapped, not bound with for. Both make the text clickable, but only
     wrapping makes the padding clickable too, and the padding is most of the
     row: the box is 16px against the 24px WCAG 2.2 asks for, and it is the
     label's own py-1 and gap that close the gap.

     The input is the label's direct child. Wrapping it in a div for layout
     still toggles correctly, so nothing appears broken — but the base cursor
     rule matches label:has(> input[type="checkbox"]) and the pointer silently
     goes. Put the flex on the label itself.

     items-start with mt-0.5 on the box, because the second row wraps to two
     lines at 390px and items-center would float a 16px square against the
     middle of the block. -->
<div data-kui="label/wrapping" class="max-w-xl space-y-2">
  <label class="flex items-start gap-2.5 py-1 text-[14px]/5">
    <input type="checkbox" name="notify" value="buyer" checked
           class="mt-0.5 size-4 shrink-0 accent-zinc-700">
    <span>Email Ritu Deshpande when this GRN is posted</span>
  </label>

  <label class="flex items-start gap-2.5 py-1 text-[14px]/5">
    <input type="checkbox" name="notify" value="qc" checked
           class="mt-0.5 size-4 shrink-0 accent-zinc-700">
    <span class="tabular-nums">Hold the lot for QC until the lab clears batch 24-0912</span>
  </label>
</div>` },

      { id: 'legend', name: 'A legend for a group', code:
`<!-- A label names one control. This is three, and the question they answer
     belongs to the set — so it is a legend inside a fieldset, and there is no
     for on it because the fieldset is the scope.

     The legend is the first child of the fieldset. Wrap it in a div for
     alignment, or put anything above it, and it is no longer the group's name:
     it renders as ordinary text and the group is announced with no question
     attached. Browsers already say "Passed, radio button, 1 of 3"; without the
     legend, 1 of 3 of what is a guess.

     The help line under the group is one line for the whole set, not one per
     option — per-option help attaches to its own option with
     aria-describedby, and is read back on every arrow-key pass. -->
<fieldset data-kui="label/legend" class="max-w-xl">
  <legend class="mb-2 text-[13px]/5 font-medium tabular-nums">Lab result — batch 24-0912</legend>

  <div class="space-y-2">
    <label class="flex items-start gap-2.5 py-1 text-[14px]/5">
      <input type="radio" name="lb-qc" value="pass" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Passed — release to stores</span>
    </label>
    <label class="flex items-start gap-2.5 py-1 text-[14px]/5">
      <input type="radio" name="lb-qc" value="deviation" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Passed on deviation — needs the plant head</span>
    </label>
    <label class="flex items-start gap-2.5 py-1 text-[14px]/5">
      <input type="radio" name="lb-qc" value="reject" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Rejected — raise a debit note</span>
    </label>
  </div>

  <p class="mt-2 text-[12px]/4 text-zinc-500">Locks the lot against issue until a result is recorded.</p>
</fieldset>` },

      { id: 'trailing', name: 'With a hint and an action', code:
`<!-- Two things on the label's baseline and neither of them is inside the label
     element, for two different reasons.

     The hint is a description, so inside the label it would join the accessible
     name and "GSTIN, 15 characters, state code first" would be read back every
     time focus landed in the field. It sits in the row and is pointed at with
     aria-describedby, which is announced once, after the name.

     The button is worse than verbose inside a label. The click would bubble to
     the label and the label would forward it to its own control, so pressing
     Copy from master would fire the action and then throw focus into the input
     — two things from one press, and the second one undoes the first. Sibling
     in the flex row, never a child.

     items-baseline rather than items-center, so the 13px label and the 12px
     hint sit on one line of text instead of being centred against each
     other. -->
<div data-kui="label/trailing" class="max-w-xl">
  <div class="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
    <label for="lb-gstin" class="text-[13px]/5 font-medium">Vendor GSTIN</label>
    <div class="flex items-baseline gap-3">
      <span id="lb-gstin-hint" class="text-[12px]/4 tabular-nums text-zinc-500">15 characters</span>
      <button type="button" class="text-[12px]/4 text-zinc-900 underline underline-offset-2">Copy from master</button>
    </div>
  </div>

  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <input id="lb-gstin" name="gstin" value="24AACCG1234M1ZP" maxlength="15"
           aria-describedby="lb-gstin-hint"
           class="w-full bg-transparent px-3 py-2 font-mono text-[14px]/5 tabular-nums uppercase outline-none">
  </div>
</div>` },

      { id: 'hidden', name: 'Hidden and absent labels', code:
`<!-- Three controls in one strip and three different answers.

     The search box has a real label with sr-only. The card is already headed
     Purchase orders and the icon says search, so a visible name would repeat
     what is on screen twice — but the element is still there, still bound with
     for, and clicking the icon still focuses the field. The placeholder is an
     example of the format, not the name. Some readers do fall back to it when
     nothing else is there, which is exactly why placeholder-as-label looks like
     it works: it survives the screen-reader check and then vanishes the moment
     anything is typed, at a contrast nobody chose.

     The select takes aria-label instead. There is no text to hide, its options
     already read as Status, and an sr-only label here would be a second name
     for the same string.

     The icon-only button has no text at all, so aria-label is the only name it
     can have — and it names the action, Export, not the icon, download. Do not
     add aria-label to the search box as well: it would replace the visible
     label with a string nobody can see, and a voice-control user saying the
     words on screen would be addressing a control that is not called that. -->
<div data-kui="label/hidden" class="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5">
  <h3 class="mr-auto text-[13px]/5 font-medium">Purchase orders</h3>

  <label for="lb-search" class="sr-only">Search purchase orders</label>
  <div class="flex min-w-40 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <i data-lucide="search" class="size-4 shrink-0 text-zinc-400"></i>
    <input id="lb-search" name="q" placeholder="PO number or vendor"
           class="w-full bg-transparent py-1.5 text-[13px]/5 outline-none">
  </div>

  <select aria-label="Status" class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[13px]/5 focus-visible:border-zinc-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <option>All statuses</option>
    <option>Open</option>
    <option>Overdue</option>
  </select>

  <button type="button" aria-label="Export to CSV"
          class="rounded-lg border border-zinc-200 bg-white p-1.5 hover:bg-zinc-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <i data-lucide="download" class="size-4 text-zinc-600"></i>
  </button>
</div>` },

      { id: 'states', name: 'Disabled and read-only', code:
`<!-- has- and peer- are not a choice, they are decided by the order of the
     markup. The label comes first in the top two rows, so peer-disabled on it
     matches nothing at all and fails silently — peer only reaches forward to
     siblings. has-[:disabled] on the wrapper around both is the one that works.
     In the switch row the painted track follows the input, so peer-disabled is
     correct there, which is why the checkbox and toggle entries use it and this
     one mostly does not.

     Deriving it beats writing text-zinc-500 on the label by hand: the moment
     disabled becomes a server-rendered condition, a hardcoded class is a grey
     label on a live field.

     Read-only greys the surface and not the label. The value still matters and
     still has to be copied out, so it stays at full contrast — dim it and you
     have said the order number does not count. And it is written outright, not
     with has-[:read-only]: the CSS :read-only pseudo-class matches every
     element that is not user-alterable, which includes the label and the
     paragraph inside the wrapper, so the wrapper matches always. Match the
     attribute — has-[[readonly]] — or write the classes, as here. -->
<div data-kui="label/states" class="max-w-xl space-y-5">
  <div class="has-[:disabled]:text-zinc-500">
    <label for="lb-off" class="mb-1.5 block text-[13px]/5 font-medium">Rate contract</label>
    <div class="rounded-lg border border-zinc-200 bg-white has-[:disabled]:bg-zinc-100">
      <input id="lb-off" value="RC-2026-014 — Gujarat Polymers Ltd" disabled
             class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums disabled:text-zinc-400">
    </div>
    <p class="mt-1.5 text-[12px]/4">Changed on the contract, not on the order.</p>
  </div>

  <div>
    <label for="lb-ro" class="mb-1.5 block text-[13px]/5 font-medium">Order number</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">
      <input id="lb-ro" value="PO-24-1187" readonly
             class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
    </div>
    <p class="mt-1.5 text-[12px]/4 text-zinc-500">Allotted on save. Quote it on the invoice.</p>
  </div>

  <label class="flex items-start gap-2.5 py-1 text-[14px]/5 has-[:disabled]:text-zinc-500">
    <input type="checkbox" checked disabled class="mt-0.5 size-4 shrink-0 accent-zinc-700">
    <span class="tabular-nums">Three-way match against the invoice — compulsory above ₹10,00,000</span>
  </label>

  <label class="flex items-center justify-between gap-4 py-1 has-[:disabled]:text-zinc-500">
    <span class="text-[14px]/5">Auto-approve — locked by plant policy</span>
    <input type="checkbox" role="switch" checked disabled class="peer sr-only">
    <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-disabled:opacity-60 forced-colors:border">
      <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm forced-colors:border"></span>
    </span>
  </label>
</div>` },

      { id: 'horizontal', name: 'Dense horizontal form', code:
`<!-- Labels in a left gutter, and the binding is still for and id — the grid
     puts the two cells side by side but they are not nested, so wrapping was
     never available here. This is the layout that most often ends up with a
     label that is merely near its control.

     sm:pt-2 on each label matches the input's py-2, so the two sit on the same
     line of text. items-center would centre a one-line label against a control
     that is 38px tall and leave it a pixel or two low, which is visible down a
     column of six.

     Below sm the whole thing stacks and the label goes back above its control.
     A 10rem gutter at 390px leaves the name wrapping to four lines beside a box
     barely wider than it, and the eye stops being able to pair them. -->
<div data-kui="label/horizontal" class="max-w-2xl divide-y divide-zinc-100 rounded-xl border border-zinc-300 bg-white">
  <div class="px-4 py-3">
    <h3 class="text-[13px]/5 font-medium">Order defaults — Gujarat Polymers Ltd</h3>
  </div>

  <div class="space-y-3 px-4 py-3 sm:space-y-2.5">
    <div class="sm:grid sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start sm:gap-4">
      <label for="lb-h-terms" class="mb-1.5 block text-[13px]/5 font-medium sm:mb-0 sm:pt-2">Payment terms</label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <select id="lb-h-terms" name="terms" class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
          <option>45 days from invoice date</option>
          <option>30 days from GRN</option>
        </select>
      </div>
    </div>

    <div class="sm:grid sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start sm:gap-4">
      <label for="lb-h-limit" class="mb-1.5 block text-[13px]/5 font-medium sm:mb-0 sm:pt-2">Approval limit</label>
      <div class="flex items-center rounded-lg border border-zinc-200 bg-white pl-3 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <span class="shrink-0 text-[14px]/5 text-zinc-500">₹</span>
        <input id="lb-h-limit" name="limit" value="50,000" inputmode="numeric"
               class="w-full bg-transparent px-2 py-2 text-[14px]/5 tabular-nums outline-none">
      </div>
    </div>

    <div class="sm:grid sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start sm:gap-4">
      <label for="lb-h-buyer" class="mb-1.5 block text-[13px]/5 font-medium sm:mb-0 sm:pt-2">Default buyer</label>
      <div>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="lb-h-buyer" name="buyer" aria-describedby="lb-h-buyer-help" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option>Ritu Deshpande</option>
            <option>Anil Kulkarni</option>
          </select>
        </div>
        <p id="lb-h-buyer-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Help text lives in the control column, not the label gutter.</p>
      </div>
    </div>
  </div>
</div>` },

      { id: 'caption', name: 'What is not a label', code:
`<!-- These captions name values, not controls, so none of them is a label
     element. A label with no control is bound to nothing: the click behaviour
     does nothing, some screen readers skip it entirely because a label is
     announced with the thing it names rather than on its own, and the next
     person to touch the file assumes there is an input somewhere and goes
     looking for it. dt and dd say what this actually is — a list of terms and
     their values.

     The other half of the same mistake is a real control sitting under text
     that was never bound to it. It looks identical on screen. It is announced
     as "edit, blank", and clicking the words does nothing, which is the
     cheapest way to catch it.

     These captions are 11px uppercase tracking-wider, which is the record
     caption and the column header. Form control names are 13px font-medium in
     the ordinary text colour — swap the two and an eight-field form reads as
     eight section headings with a box under each. -->
<dl data-kui="label/caption" class="grid max-w-xl grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-zinc-300 bg-white p-4 sm:grid-cols-3">
  <div>
    <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Order</dt>
    <dd class="mt-0.5 text-[13px]/5 tabular-nums">PO-24-1187</dd>
  </div>
  <div>
    <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Raised</dt>
    <dd class="mt-0.5 text-[13px]/5 tabular-nums">16 Aug 2026</dd>
  </div>
  <div>
    <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Value</dt>
    <dd class="mt-0.5 text-[13px]/5 tabular-nums">₹18,42,000</dd>
  </div>
  <div class="col-span-2">
    <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Vendor</dt>
    <dd class="mt-0.5 text-[13px]/5">Gujarat Polymers Ltd</dd>
  </div>
  <div>
    <dt class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Status</dt>
    <dd class="mt-0.5">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 rounded-full bg-amber-500"></span>Approved
      </span>
    </dd>
  </div>
</dl>` }
    ]
  },

  {
    id: 'field', name: 'Field', category: 'forms',
    description: 'Label, control, help text and error in one block. This is the unit every form is built from, and the thing that owns the wiring between the four.',
    when: 'Every form control, including the ones that are not inputs — a radio group, a checkbox set, a read-only value. This is the wrapper and the wiring, not the control: the box you type in is input, the bare element is label, and the page they sit on is form-page.',
    notes: [
      'The error replaces the help text, it does not stack under it, and the cheapest way to guarantee that is one message paragraph with one stable id whose contents swap. Two elements means two ids, and then aria-describedby has to be recomputed every time the state changes; get that wrong in one direction and the control describes a paragraph that is no longer on screen, get it wrong in the other and the user hears the format hint while the field is telling them in red that they broke it.',
      'aria-describedby is a list of ids and it is read in the order the ids are written, not the order the elements sit in the DOM. A field with a permanent unit and a swapping message is aria-describedby="qty-unit qty-msg" — put them the other way round and the announcement is "not a whole number, kilograms". An id in that list with no element behind it is dropped in silence, which is why the message paragraph is always rendered and only its contents change.',
      'Reserve the message line rather than letting it appear. An empty paragraph collapses to nothing, so mt-1.5 min-h-4 holds exactly the 22px a one-line message takes and the field is the same height valid and invalid. Without it a submit that fails on four fields lifts the Save button out from under the pointer, and in a two-column grid a single error grows the whole row and drags every field below it down the page.',
      'aria-invalid is bound, never written once. A static aria-invalid="true" from a server render is still there after the user has fixed the value, and a control announced as invalid while its message reads as help is worse than one that says nothing. Bind it as a string — :aria-invalid="bad ? \'true\' : \'false\'" — because aria-invalid="false" is the correct valid state and not an attribute to be removed.',
      'The required attribute is what announces required; the red asterisk is decoration and carries aria-hidden="true", or the field is called "Vendor star" every time focus lands on it. On a select, required only bites when the placeholder option has value="" — a select whose first option is a real vendor is never empty and never invalid, so the constraint reads as satisfied on a form nobody has touched. Which way round the marking runs is a decision about the form and not the field: twelve of thirteen fields carrying an asterisk is wallpaper, so on a form that is mostly required the marking moves to the exceptions and the word Optional goes in their labels. Either way it is said once at the top and never beside every field.',
      'The label stays zinc-900 on error. The border goes red and the message goes red, and that is two signals for one fact already; a red label makes three, and it collides with the red asterisk beside it so the user cannot tell whether the field is required or wrong. This is also the reason the asterisk is the only red in the system that is not a data state — it gets that licence exactly once, in a label, and nothing else in the block may take it.',
      'A <label for> needs something labelable to point at, and a group of radios or checkboxes has no such element. Wrapping a <label> round the whole group is worse than doing nothing: a label associates with the first labelable element inside it, so clicking what looks like the group heading silently selects the first option. Use a fieldset with a legend, and let every control inside keep its own label.',
      'A fieldset cannot be trusted as a flex or grid container — Safari has only recently allowed display on it and the legend is laid out by rules of its own — so the fieldset stays a block and the grid goes on a plain div inside it. Do not nest fieldsets either: every enclosing legend is announced on every control, so two levels means the user hears the group name twice before each field.',
      'aria-invalid on a fieldset does nothing. The implicit role is group, which is not a widget, so a cross-field error goes in a paragraph under the group, is pointed at by aria-describedby on the fieldset, and the invalid flag is set on each input inside it. An error that belongs to one field belongs under that field; only an error about the combination — a GSTIN that does not contain its own PAN — belongs to the group.',
      'Read-only is not disabled. readonly keeps the control in the tab order, keeps its value selectable, and still posts it; disabled does none of the three, so a disabled field quietly drops out of the POST and a server that reads absence as a change wipes the value. A number the form computes rather than collects is not a control at all — it is an <output>, which is labelable so <label for> still works, and which is a live region, so a total that recomputes on every keystroke is announced on every keystroke unless you turn that off.',
      'In Django the mapping is direct but the details bite. {{ field.errors }} renders a <ul class="errorlist">, so the message paragraph takes {{ field.errors.0 }}; {{ field.help_text }} goes in the same paragraph in the else branch. The aria-describedby id depends on auto_id, so it is set on the widget in the form\'s __init__ rather than written in the template, and aria-invalid comes from whether field.errors is truthy at render time — never from a hardcoded attribute.',
      'A trailing action beside the label is a <button type="button">, and it lives outside the <label>. A bare <button> in a form defaults to type="submit", so "Same as plant address" submits the half-filled order the first time somebody presses Enter in a field. Inside the label, the click is forwarded to the control and the button becomes part of the field\'s accessible name.'
    ],
    anatomy: [
      ['Label', 'A real <label for> bound to the control\'s id, carrying the required or optional marking. For a group of controls there is nothing to point at and this becomes a legend instead.'],
      ['Control wrapper', 'The bordered box that owns the border colour and the focus outline, so a prefix, a unit or an icon sits inside the indicator rather than beside it. The control inside it takes outline-none.'],
      ['Control', 'The input, select, textarea, radio group or output. The field does not care which — it cares that it has an id, a name and a description.'],
      ['Message slot', 'One paragraph with one stable id, holding either the help text or the error and never both. mt-1.5 min-h-4 so it occupies a line whether or not it has anything in it.'],
      ['Required marker', 'A red asterisk with aria-hidden="true", backed by the required attribute. Flips to an Optional word in the label on a form where most fields are required.'],
      ['Legend', 'The name of a group of controls, on a fieldset. It names the question; the labels inside name the answers, and it does not replace them.'],
      ['Trailing action', 'A type="button" on the label row, right-aligned — Same as plant address, Clear, Look up. Outside the label, so it neither submits nor joins the field\'s name.'],
      ['Locked surface', 'bg-zinc-100 with no focus outline, for a value that cannot be typed into. Read-only keeps zinc-900 text because the value still matters; disabled drops to zinc-400.']
    ],
    behaviour: [
      'The error replaces the help text in the same paragraph, so aria-describedby never has to change and the block never grows. The help text has done its job by the time the error exists — it described a format that has now been broken, and repeating it under the error is two sentences about the same mistake.',
      'Validation runs on blur and only then goes live. Telling somebody their half-typed GSTIN is fourteen characters long while they are on the ninth is noise; once the field has errored it revalidates on every keystroke so the message clears the moment it stops being true.',
      'That order is also what makes the description work. aria-describedby is read when focus arrives, not when the text changes, so an error written on blur is already in place when the user tabs back to fix it, and a message that clears while focus is inside the field needs no announcement — the next thing they hear is the field with no error attached.',
      'The field is the same height in both states because the message line is reserved. Nothing in a form moves on submit, and in a grid a row does not grow under one bad field and push the rest of the form down.',
      'A horizontal field collapses to stacked on container width, not viewport width, so the same field is two columns in a page and one column in a sheet 380px wide. Sized off the viewport it stays two columns inside a narrow panel and the label column squeezes to four characters.',
      'In a two-column grid the tab order is DOM order. Anything long — an address, a description, a line table — spans both columns rather than being crushed into one, and at 390px everything is one column and has to still read top to bottom without a connecting word between two halves of a pair.',
      'A group error sits under the group and a field error sits under its field. Putting a cross-field error under whichever of the two the user touched last makes the same mistake report itself in two different places on two different visits.',
      'Read-only renders on the locked surface and still submits; disabled renders drained and does not. A value the form derives is rendered as text with its label, never as a disabled input — a greyed box says "you may not edit this yet", and a computed total is not something anybody was ever going to edit.',
      'In Django the same block round-trips: the error paragraph is {{ field.errors.0 }}, the help paragraph is {{ field.help_text }}, and a failed POST comes back with every entered value still in place.'
    ],
    a11y: [
      'The label is bound with for/id, and the target has to be a labelable element — input, select, textarea, output, button, meter, progress. A label that merely sits above a div of radios is connected to nothing, and one wrapped round them is connected to the first radio only.',
      'The control carries aria-describedby pointing at the message paragraph, whose id never changes. Extra permanent description — a unit, a format — is a second id in the same list, written before the message so it is announced before it.',
      'aria-invalid is a bound attribute, set to the string "true" or "false" from the same state the red border is drawn from. Written once in markup it goes stale the first time the value is corrected, and the control is then announced as invalid for the rest of the session.',
      'required is what makes the field announce as required. The asterisk is aria-hidden="true" decoration, and on a select the required attribute only means anything when the placeholder option has an empty value.',
      'A set of controls is a fieldset with a legend, described with aria-describedby on the fieldset so the help is read once on entry rather than once per arrow key. aria-invalid on the fieldset is ignored — role group is not a widget — so it goes on the inputs.',
      'The error is real text under the field. Never a title attribute, never a tooltip, never colour alone: a red border with no words is invisible in forced-colours mode and meaningless to anybody who cannot see red.',
      'An <output> is a live region by default, so a derived total announces itself every time it changes. That is right for a value recomputed on a discrete action and wrong for one recomputed per keystroke, where aria-live="off" leaves it as plain text with a label.',
      'The error summary at the top of a failed form is a separate component and takes focus on submit. This block does not shout — a per-field live region turns a five-error form into five overlapping announcements.'
    ],
    related: ['label', 'input', 'form-page'],
    variants: [
      { id: 'default', name: 'With help text', code:
`<!-- The help text is a paragraph with an id, not a placeholder. A placeholder
     disappears the moment typing starts, which is exactly when the format
     matters, and it is not a description — it is the value the browser shows
     when there isn't one.

     The id is on the paragraph and aria-describedby points at it. Help text
     that merely sits under the field is read only if somebody happens to
     browse past it, and never when they tab into the control.

     The asterisk carries aria-hidden. required is what announces required; the
     asterisk is how you find the field by scanning, and without the hidden flag
     the field introduces itself as "Order title star". -->
<div data-kui="field/default" class="max-w-sm">
  <label for="fd-title" class="mb-1.5 block text-[13px]/5 font-medium">
    Order title <span aria-hidden="true" class="text-red-600">*</span>
  </label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <input id="fd-title" name="title" required aria-describedby="fd-title-msg"
           value="MS angles and plates — August lot"
           class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
  </div>
  <p id="fd-title-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
    Printed on the order and used as the subject of the vendor email.
  </p>
</div>` },

      { id: 'error', name: 'Error replaces the help text', code:
`<!-- One paragraph, one id, and the contents swap. The alternative — a help
     element and an error element with an id each — means aria-describedby has
     to be rewritten on every state change, and the two ways of getting that
     wrong are both silent: describe the hidden one and the user hears the
     format hint while the field is red, describe an id that is not rendered
     and the whole description is dropped without a word.

     mt-1.5 min-h-4 is the reserved line. An empty paragraph collapses to zero,
     so without it the field grows 22px the moment it errors and a form that
     fails on four fields lifts Save out from under the pointer.

     Validation waits for blur, then goes live, which lines up with how
     descriptions are read: aria-describedby is announced when focus arrives,
     so an error written on blur is already there when they tab back.

     aria-invalid is bound, and bound to a string — written once in the markup
     it survives the correction and the field stays invalid all session, and
     aria-invalid="false" is the valid state rather than a missing attribute.
     The icon sits inside x-show rather than x-if: Lucide hydrates once at load
     and never sees markup x-if inserts later. -->
<div data-kui="field/error" class="max-w-sm"
     x-data="{ gstin: '24AAACG4171B1Z', touched: true,
               get bad() { return this.touched && this.gstin.trim().length !== 15 } }">
  <label for="fe-gstin" class="mb-1.5 block text-[13px]/5 font-medium">
    GSTIN <span aria-hidden="true" class="text-red-600">*</span>
  </label>

  <div class="rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
       :class="bad ? 'border-red-600 focus-within:outline-red-600/15'
                   : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
    <input id="fe-gstin" name="gstin" required maxlength="15"
           x-model="gstin" @blur="touched = true"
           aria-describedby="fe-gstin-msg"
           :aria-invalid="bad ? 'true' : 'false'"
           class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
  </div>

  <p id="fe-gstin-msg" class="mt-1.5 min-h-4 text-[12px]/4">
    <span x-show="!bad" x-cloak class="block text-zinc-500">15 characters, as printed on the vendor's certificate.</span>
    <span x-show="bad" x-cloak class="flex items-start gap-1.5 font-medium text-red-600">
      <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
      <span x-text="gstin.trim().length + ' of 15 characters. Check it against the certificate.'"></span>
    </span>
  </p>
</div>` },

      { id: 'required', name: 'Required and optional', code:
`<!-- Which one you mark depends on the ratio, and it is a decision about the
     form rather than about the field. Two required out of nine: mark them.
     Seven out of nine: an asterisk on seven fields is wallpaper, so the marking
     moves to the exceptions and the word Optional goes in their labels.

     Either way it is stated once at the top and never repeated beside every
     field, and either way it is backed by the required attribute — the asterisk
     and the word are both aria-hidden decoration that only helps a person
     scanning the form for what they still have to fill in.

     The select is the trap in this variant. required on a select does nothing
     unless the first option has value="" — a select whose first option is a
     real vendor is never empty, so the constraint is satisfied on a form
     nobody has touched and the field submits whatever happened to be first. -->
<div data-kui="field/required" class="max-w-sm space-y-6">
  <div>
    <p class="mb-3 text-[12px]/4 text-zinc-600">
      Two of the nine fields on this form are required. <span aria-hidden="true" class="text-red-600">*</span> marks them.
    </p>

    <div class="space-y-4">
      <div>
        <label for="fq-vendor" class="mb-1.5 block text-[13px]/5 font-medium">
          Vendor <span aria-hidden="true" class="text-red-600">*</span>
        </label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="fq-vendor" name="vendor" required aria-describedby="fq-vendor-msg"
                  class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option value="">Choose a vendor</option>
            <option value="v-0412">Gujarat Polymers Ltd</option>
            <option value="v-0288">Sharma Steel &amp; Alloys</option>
            <option value="v-0517">Deccan Bearings Pvt Ltd</option>
          </select>
        </div>
        <p id="fq-vendor-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
          The empty first option is what makes required mean anything here.
        </p>
      </div>

      <div>
        <label for="fq-ref" class="mb-1.5 block text-[13px]/5 font-medium">Buyer reference</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="fq-ref" name="buyer_ref" aria-describedby="fq-ref-msg"
                 class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
        </div>
        <p id="fq-ref-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
          No marker, because it is not required and most of this form is not.
        </p>
      </div>
    </div>
  </div>

  <div class="border-t border-zinc-200 pt-6">
    <p class="mb-3 text-[12px]/4 text-zinc-600">
      Seven of the nine are required on the approval form, so the marking moves to the three that are not.
    </p>

    <div class="space-y-4">
      <div>
        <label for="fq-approver" class="mb-1.5 block text-[13px]/5 font-medium">Second approver</label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="fq-approver" name="approver" required
                  class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option value="">Choose an approver</option>
            <option value="rd">Ritu Deshpande — purchase</option>
            <option value="ak">Anil Kulkarni — stores</option>
          </select>
        </div>
        <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
      </div>

      <div>
        <label for="fq-note" class="mb-1.5 flex items-baseline gap-2 text-[13px]/5 font-medium">
          Note to the approver
          <span aria-hidden="true" class="font-normal text-zinc-500">Optional</span>
        </label>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <input id="fq-note" name="note" aria-describedby="fq-note-msg"
                 class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
        </div>
        <p id="fq-note-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
          Goes into the approval mail above the order lines.
        </p>
      </div>
    </div>
  </div>
</div>` },

      { id: 'horizontal', name: 'Label in a left column', code:
`<!-- A settings form reads better with the label beside the control, and it
     collapses on container width rather than viewport width. sm: is the wrong
     breakpoint here: the same block goes into a sheet 380px wide on a 1440px
     screen, sm: is still true there, and the label column squeezes to four
     characters while the select loses half its text. @container on the wrapper
     and @md: on the rows measures the space the field actually has.

     The label column is top-aligned with @md:pt-2, matching the py-2 on the
     control, not centred — a two-line label centred against a 36px input floats
     away from the field it names.

     The message lives in the control column, never under the label. Under the
     label it lines up with nothing, and on a field that errors it appears on
     the opposite side of the form from the red border it belongs to. -->
<div data-kui="field/horizontal" class="@container max-w-2xl"
     x-data="{ limit: '750000', touched: true,
               get bad() { return this.touched && Number(this.limit) > 500000 } }">
  <div class="space-y-4">

    <div class="@md:grid @md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] @md:gap-4">
      <label for="fh-terms" class="mb-1.5 block text-[13px]/5 font-medium @md:mb-0 @md:pt-2">Payment terms</label>
      <div>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="fh-terms" name="terms" aria-describedby="fh-terms-msg"
                  class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option>30 days from GRN</option>
            <option>45 days from invoice</option>
            <option>Against delivery</option>
          </select>
        </div>
        <p id="fh-terms-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
          Applies to new orders. Open orders keep the terms they were raised on.
        </p>
      </div>
    </div>

    <div class="@md:grid @md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] @md:gap-4">
      <label for="fh-limit" class="mb-1.5 block text-[13px]/5 font-medium @md:mb-0 @md:pt-2">Credit limit</label>
      <div>
        <div class="flex items-center rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
             :class="bad ? 'border-red-600 focus-within:outline-red-600/15'
                         : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
          <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
          <input id="fh-limit" name="credit_limit" inputmode="numeric"
                 x-model="limit" @blur="touched = true"
                 aria-describedby="fh-limit-msg"
                 :aria-invalid="bad ? 'true' : 'false'"
                 class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
        </div>
        <p id="fh-limit-msg" class="mt-1.5 min-h-4 text-[12px]/4">
          <span x-show="!bad" x-cloak class="block tabular-nums text-zinc-500">Orders above the limit go to a second approver.</span>
          <span x-show="bad" x-cloak class="flex items-start gap-1.5 font-medium text-red-600">
            <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
            <span class="tabular-nums">Above ₹5,00,000 the limit is set by finance, not here.</span>
          </span>
        </p>
      </div>
    </div>

    <div class="@md:grid @md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] @md:gap-4">
      <label for="fh-centre" class="mb-1.5 block text-[13px]/5 font-medium @md:mb-0 @md:pt-2">Default cost centre</label>
      <div>
        <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="fh-centre" name="cost_centre"
                  class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
            <option>Moulding — Silvassa</option>
            <option>Fabrication — Silvassa</option>
            <option>Maintenance — Vapi</option>
          </select>
        </div>
        <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
      </div>
    </div>

  </div>
</div>` },

      { id: 'group', name: 'Fieldset with a legend', code:
`<!-- Two fields that are one question, and an error that belongs to neither of
     them on its own: characters 3 to 12 of a GSTIN are the PAN, so the mismatch
     is a property of the pair. Reported under whichever field the user touched
     last, the same mistake shows up in two different places on two different
     visits.

     The grid is on a div inside the fieldset, not on the fieldset. display on a
     fieldset has only recently become reliable and the legend is laid out by
     rules of its own; making the fieldset a grid container is how a legend ends
     up as a grid item in the first cell.

     aria-invalid on the fieldset is ignored — its implicit role is group, which
     is not a widget — so the flag goes on both inputs and the description goes
     on the fieldset, where it is read once on entry rather than once per field.

     The legend names the question. Every input inside still needs its own
     label; a legend does not stand in for one, and two fields under one legend
     with no labels are announced as "Tax registration, edit" twice. -->
<fieldset data-kui="field/group" class="max-w-md" aria-describedby="fg-msg">
  <legend class="mb-2 text-[13px]/5 font-medium">
    Tax registration <span aria-hidden="true" class="text-red-600">*</span>
  </legend>

  <div class="grid gap-3 sm:grid-cols-2">
    <div>
      <label for="fg-pan" class="mb-1.5 block text-[12px]/4 text-zinc-600">PAN</label>
      <div class="rounded-lg border border-red-600 bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15">
        <input id="fg-pan" name="pan" value="AAACG4171B" required aria-invalid="true"
               class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums uppercase outline-none">
      </div>
    </div>
    <div>
      <label for="fg-gstin" class="mb-1.5 block text-[12px]/4 text-zinc-600">GSTIN</label>
      <div class="rounded-lg border border-red-600 bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15">
        <input id="fg-gstin" name="gstin" value="24AAACG9902B1ZP" required aria-invalid="true"
               class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums uppercase outline-none">
      </div>
    </div>
  </div>

  <p id="fg-msg" class="mt-2 flex items-start gap-1.5 min-h-4 text-[12px]/4 font-medium text-red-600">
    <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
    <span class="tabular-nums">Characters 3 to 12 of the GSTIN are the PAN. This pair reads AAACG9902B against AAACG4171B.</span>
  </p>
</fieldset>` },

      { id: 'choice', name: 'Around a radio group', code:
`<!-- There is no element for a <label for> to point at. A radio group is four
     inputs and a question, and the question is not attached to any one of them.
     Wrapping a <label> round the whole block is the tempting fix and it is
     actively harmful: a label associates with the first labelable element
     inside it, so clicking what looks like the group heading selects "Accept in
     full" without a word about it.

     fieldset and legend is the whole answer, and every radio inside keeps its
     own label because the legend names the question, not the answers.

     The description sits on the fieldset rather than on each input. Repeated on
     the inputs it is read again on every arrow key, so moving through four
     options plays the same sentence four times.

     The locked option keeps its place and goes disabled rather than
     disappearing. A list that changes length is one nobody can scan by
     position. -->
<fieldset data-kui="field/choice" class="max-w-md" aria-describedby="fc-msg">
  <legend class="mb-2 text-[13px]/5 font-medium">
    Receipt outcome <span aria-hidden="true" class="text-red-600">*</span>
  </legend>

  <div class="space-y-2">
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="radio" name="outcome" value="accept" checked required
             class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Accept in full — 2,000 kg</span>
    </label>
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="radio" name="outcome" value="short" required
             class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Accept short — record what arrived and keep the balance open</span>
    </label>
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="radio" name="outcome" value="hold" required
             class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Hold for inspection</span>
    </label>
    <label class="flex items-start gap-2.5 text-[14px]/5 text-zinc-500">
      <input type="radio" name="outcome" value="reject" disabled
             class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="tabular-nums">Reject — needs a QC result against GRN-24-0912</span>
    </label>
  </div>

  <p id="fc-msg" class="mt-2 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">
    Posts against PO-24-1187. Short receipts leave the balance open for a second GRN.
  </p>
</fieldset>` },

      { id: 'action', name: 'Trailing action and a unit', code:
`<!-- Two affordances that both want to live in the field and belong in
     different places.

     The action goes on the label row, right-aligned. Under the control it
     competes with the help text for the same 22px and disappears the moment the
     field errors. It is type="button" — a bare <button> in a form is a submit
     button, so "Same as plant" sends the half-filled order the first time
     somebody presses Enter in a field — and it sits outside the <label>,
     because inside it the click is forwarded to the control and the button's
     text joins the field's accessible name.

     The unit sits inside the border, so it is inside the focus outline and
     reads as part of the value rather than as a word next to the box. It is the
     one case where aria-describedby holds two ids, and the order they are
     written in is the order they are read in: "fa-qty-unit fa-qty-msg" gives
     "kilograms, whole kilograms only", the other way round gives "whole
     kilograms only, kilograms". DOM order has nothing to do with it. -->
<div data-kui="field/action" class="max-w-sm space-y-5" x-data="{ addr: '' }">

  <div>
    <div class="mb-1.5 flex items-baseline justify-between gap-3">
      <label for="fa-ship" class="text-[13px]/5 font-medium">Delivery address</label>
      <button type="button" class="shrink-0 text-[12px]/4 text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15"
              @click="addr = 'Konspec Industries, Plot 214, Silvassa Industrial Estate, Dadra and Nagar Haveli 396230'">
        Same as plant
      </button>
    </div>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <textarea id="fa-ship" name="ship_to" rows="3" x-model="addr" aria-describedby="fa-ship-msg"
                class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none"></textarea>
    </div>
    <p id="fa-ship-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
      Printed on the order and on the gate pass.
    </p>
  </div>

  <div>
    <label for="fa-qty" class="mb-1.5 block text-[13px]/5 font-medium">Order quantity</label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="fa-qty" name="qty" value="2,000" inputmode="numeric"
             aria-describedby="fa-qty-unit fa-qty-msg"
             class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
      <span id="fa-qty-unit" class="pr-3 text-[14px]/5 text-zinc-600">kg</span>
    </div>
    <p id="fa-qty-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">
      Whole kilograms. The rate contract quotes per kg, so 1 MT is 1,000.
    </p>
  </div>

</div>` },

      { id: 'grid', name: 'Two columns, one field spanning', code:
`<!-- Every field in the grid keeps its message line whether or not it has
     anything to say, and that is the whole point of the variant. Grid rows are
     sized by their tallest cell, so one field growing 22px on submit does not
     just move itself — it moves its neighbour's neighbour, every row below it,
     and the Save button. Reserve the line and the error swaps in without a
     pixel of movement anywhere on the page.

     The price is 22px of nothing under the fields with no help text. That is
     the trade, and it is worth it on any form that validates, because the
     alternative is a page that rearranges itself at the exact moment the user
     is reading it to find out what went wrong.

     Anything long spans both columns. A delivery note squeezed into one column
     of a two-column grid wraps every four words.

     Tab order is DOM order and nothing here reorders visually, so what the eye
     follows and what Tab follows are the same. At 390px it is one column, which
     is why the dates are labelled Effective from and Effective to rather than
     one date and the word "to" between them. -->
<div data-kui="field/grid" class="max-w-2xl"
     x-data="{ rate: '118.40', floor: 95, touched: true,
               get bad() { return this.touched && Number(this.rate) < this.floor } }">
  <div class="grid gap-4 sm:grid-cols-2">

    <div class="sm:col-span-2">
      <label for="fx-material" class="mb-1.5 block text-[13px]/5 font-medium">
        Material <span aria-hidden="true" class="text-red-600">*</span>
      </label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <select id="fx-material" name="material" required
                class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
          <option value="">Choose a material</option>
          <option value="m-hdpe">HDPE granules — natural, grade M60075</option>
          <option value="m-ldpe">LDPE granules — grade 24FS040</option>
        </select>
      </div>
      <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
    </div>

    <div>
      <label for="fx-rate" class="mb-1.5 block text-[13px]/5 font-medium">
        Rate per kg <span aria-hidden="true" class="text-red-600">*</span>
      </label>
      <div class="flex items-center rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2"
           :class="bad ? 'border-red-600 focus-within:outline-red-600/15'
                       : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-zinc-700/15'">
        <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
        <input id="fx-rate" name="rate" inputmode="decimal" required
               x-model="rate" @blur="touched = true"
               aria-describedby="fx-rate-msg"
               :aria-invalid="bad ? 'true' : 'false'"
               class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
      </div>
      <p id="fx-rate-msg" class="mt-1.5 min-h-4 text-[12px]/4">
        <span x-show="!bad" x-cloak class="block tabular-nums text-zinc-500">Last agreed ₹114.20 on 12 Mar 2026.</span>
        <span x-show="bad" x-cloak class="flex items-start gap-1.5 font-medium text-red-600">
          <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>
          <span class="tabular-nums">Below the ₹95.00 floor for this grade.</span>
        </span>
      </p>
    </div>

    <div>
      <label for="fx-moq" class="mb-1.5 block text-[13px]/5 font-medium">Minimum order</label>
      <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <input id="fx-moq" name="moq" value="500" inputmode="numeric" aria-describedby="fx-moq-unit"
               class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
        <span id="fx-moq-unit" class="pr-3 text-[14px]/5 text-zinc-600">kg</span>
      </div>
      <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
    </div>

    <div>
      <label for="fx-from" class="mb-1.5 block text-[13px]/5 font-medium">Effective from</label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <input id="fx-from" name="from" type="date" value="2026-09-01"
               class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
      </div>
      <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
    </div>

    <div>
      <label for="fx-to" class="mb-1.5 block text-[13px]/5 font-medium">Effective to</label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <input id="fx-to" name="to" type="date" value="2027-03-31"
               class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
      </div>
      <p class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500"></p>
    </div>

    <div class="sm:col-span-2">
      <label for="fx-remarks" class="mb-1.5 block text-[13px]/5 font-medium">Remarks</label>
      <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <textarea id="fx-remarks" name="remarks" rows="3" aria-describedby="fx-remarks-msg"
                  class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none">Rate held against the Q3 tender. Freight to Silvassa included.</textarea>
      </div>
      <p id="fx-remarks-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
        Spans both columns — in one column of two it wraps every four words.
      </p>
    </div>

  </div>
</div>` },

      { id: 'readonly', name: 'Read-only and derived', code:
`<!-- Three things that all look like "a field you cannot type in" and are not
     the same thing.

     Read-only is still a field. readonly keeps it in the tab order, keeps the
     value selectable, and still posts it. disabled does none of those, so a
     disabled order number drops out of the POST and a server that reads absence
     as a change clears it. The locked surface — bg-zinc-100, no focus outline —
     is what says you cannot type here; the zinc-900 text is what says the value
     still matters.

     A derived number is not a control at all. Drawing it as a disabled input
     promises an edit that will never be allowed; it is <output>, which is one
     of the labelable elements, so <label for> still binds to it and the value
     keeps a real name.

     <output> is a live region by default. That is right for a total that
     changes on a discrete action and wrong for one that recomputes on every
     keystroke, which is why this one carries aria-live="off" and is read on
     focus like any other described value. -->
<div data-kui="field/readonly" class="max-w-sm space-y-5"
     x-data="{ qty: 2000, rate: 118.40,
               get total() { return this.qty * this.rate } }">

  <div>
    <label for="fr-no" class="mb-1.5 block text-[13px]/5 font-medium">Order number</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">
      <input id="fr-no" name="number" readonly value="PO-24-1187" aria-describedby="fr-no-msg"
             class="w-full bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
    </div>
    <p id="fr-no-msg" class="mt-1.5 min-h-4 text-[12px]/4 tabular-nums text-zinc-500">
      Allotted when the draft was created on 16 Aug 2026. It stays with the order.
    </p>
  </div>

  <div class="grid grid-cols-2 gap-3">
    <div>
      <label for="fr-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity</label>
      <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <input id="fr-qty" name="qty" inputmode="numeric" x-model.number="qty" aria-describedby="fr-qty-unit"
               class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
        <span id="fr-qty-unit" class="pr-3 text-[14px]/5 text-zinc-600">kg</span>
      </div>
    </div>
    <div>
      <label for="fr-rate" class="mb-1.5 block text-[13px]/5 font-medium">Rate per kg</label>
      <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
        <input id="fr-rate" name="rate" inputmode="decimal" x-model.number="rate"
               class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
      </div>
    </div>
  </div>

  <div class="border-t border-zinc-200 pt-3">
    <div class="flex items-baseline justify-between gap-3">
      <label for="fr-total" class="text-[13px]/5 font-medium">Line value</label>
      <output id="fr-total" for="fr-qty fr-rate" aria-live="off" aria-describedby="fr-total-msg"
              class="text-[14px]/5 font-semibold tabular-nums"
              x-text="'₹' + total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })">₹2,36,800.00</output>
    </div>
    <p id="fr-total-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
      Quantity times rate. Nothing is posted for it — the server multiplies the same two numbers again.
    </p>
  </div>

  <div>
    <label for="fr-contract" class="mb-1.5 block text-[13px]/5 font-medium text-zinc-500">Rate contract</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">
      <input id="fr-contract" disabled value="Not applicable — spot purchase" aria-describedby="fr-contract-msg"
             class="w-full bg-transparent px-3 py-2 text-[14px]/5 text-zinc-400">
    </div>
    <p id="fr-contract-msg" class="mt-1.5 min-h-4 text-[12px]/4 text-zinc-500">
      Disabled, so it is out of the tab order and out of the POST. Read-only would have submitted this text as the contract.
    </p>
  </div>

</div>` }
    ]
  },

  {
    id: 'input', name: 'Input', category: 'forms',
    description: 'Single-line text entry. The border lives on the wrapper, not on the control, so an icon, a unit or a clear button sits inside the focus outline instead of beside it.',
    when: 'One line of anything — a title, a rupee amount, a reference code, a search box over a register. More than one line is a textarea, one record out of a list is a combobox, and a fixed set under about fifteen options is a native select.',
    notes: [
      'The border, the fill and the focus outline all belong to the wrapper; the input inside it is bg-transparent with outline-none and paints nothing. This is the whole design. Put the border on the <input> and every icon, unit and clear button ends up outside the ring, which means the focused field is a box with things floating next to it rather than one object — and a ₹ sitting outside the outline reads as a label, not as part of the value.',
      'outline-none on the control is legal here only because the wrapper draws the outline for it. Tailwind resolves outline-style through a variable, so outline-none on the same element that carries focus-visible:outline-3 kills the style while leaving the width and the colour set: it measures as styled in devtools and renders as nothing on screen. The rule is one element per outline — the wrapper takes focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15, the control takes outline-none, and neither takes both.',
      'Every input in a flex wrapper needs min-w-0. An <input> has an intrinsic min-content width of roughly twenty characters from its size attribute, so in a flex row it refuses to shrink past that and pushes the suffix, the clear button or the unit out through the right edge of the border. Nothing looks wrong at desktop width; at 390px the ₹ is outside the box. w-full sets the preferred width, min-w-0 is what lets it give way.',
      'Height comes from padding against the line box, never from an h- class. py-2 on a 20px leading is a 36px control and py-1.5 is 32px, and both are a whole number of line boxes. Set h-9 on the input instead and the text is centred by the flex row rather than by its own padding, so the moment the wrapper gains a taller child — a 28px button, a two-line prefix — the baseline moves and the caret sits off-centre against the icon beside it.',
      'type="number" is the wrong control for a rupee amount and for every other number this system takes. The scroll wheel edits a focused number input in Chrome and Safari, so a rate changes silently when somebody scrolls the page past it. Grouping separators are not valid, so 18,42,000 makes the field invalid and .value comes back as an empty string — the digits are on screen and unreadable to script. The decimal separator is the browser\'s locale, so the same keystroke means 1.5 and 15 in two different browsers. And the spinner is two 12px targets nobody has ever deliberately pressed. Write type="text" with inputmode="decimal" and parse on the server.',
      'Indian grouping is not thousands grouping. A naive three-digit regex turns 1842000 into 1,842,000, which is wrong on an order printed in Silvassa; the lakh and crore grouping is 18,42,000 and Intl.NumberFormat with the en-IN locale is what produces it. Group for display only — post the raw digits from a hidden input, because the server should never have to guess which separators a string came dressed in.',
      'Disabled and read-only are different states and must not look the same, and the difference that matters is not visual: a disabled control is not submitted with the form. Lock a field by disabling it and its value vanishes from the POST, so the server sees a blank where the locked value used to be and writes the blank. readonly submits, stays in the Tab order and stays copyable. Disable a field only when there is genuinely nothing to send.',
      'They do share one surface, though: bg-zinc-100 with no resting focus ring, because neither can be typed into. Only the text separates them — zinc-900 for read-only, whose value still matters and still has to be read off the screen and copied, zinc-400 for disabled, whose value does not. Read-only keeps a focus outline on its wrapper, because read-only is still focusable and a keyboard user has to see where they have landed. A read-only field left white, bordered and focus-ringed is pixel for pixel an editable one, and the only way to find out otherwise is to click into it and get nothing back.',
      'An invalid wrapper has to state its red border in the focused form as well as the resting one. focus-within:border-zinc-700 and has-[:user-invalid]:border-red-600 have the same specificity, so which one wins is decided by the order Tailwind happens to emit them in — and if the grey one wins, focusing a wrong field repaints it as a normal field while the error text is still under it. Write has-[:user-invalid]:focus-within:border-red-600 as well and the question stops being a question.',
      'Prefer :user-invalid to :invalid for anything the browser can check itself. :invalid matches from first paint, so a required field is red before it has been touched and the form opens covered in errors nobody has made yet. :user-invalid waits until the field has been interacted with and left, which is the same rule Field states in prose. It needs a real pattern or type or required to fire — CSS cannot invalidate a field the HTML says is fine.',
      'A trailing button inside the wrapper must hand focus back to the input when it removes itself. A clear button that disappears the instant it is pressed takes the focus with it, and focus resets to the document body, which puts a keyboard user back at the top of the page with no way to know it happened. Clear the value, then focus the field.',
      'Placeholder text is an example of the format and never a label. It leaves the moment typing starts, it is zinc-500 against white so it fails contrast as a permanent label anyway, and a form of unlabelled fields is unreadable the second time someone opens it with half the values already filled in.'
    ],
    anatomy: [
      ['Wrapper', 'The bordered box, and the owner of everything visible: the border, the fill, the radius and the focus outline. Everything the field needs sits inside it, which is the reason the border is here and not on the control.'],
      ['Control', 'A transparent, borderless <input> with outline-none, w-full and min-w-0. It carries the name, the type, the inputmode and the value, and no visual styling other than the text.'],
      ['Leading icon', 'size-4 zinc-600 at ml-3, shrink-0. Decorative and always a duplicate of the label — a magnifier next to a field called Search says nothing the label has not already said, and is there to make the box findable in a toolbar.'],
      ['Prefix or suffix', 'A fixed unit inside the ring — ₹, %, kg, per MT. It is not part of the value that posts, so the server has to know the unit independently; it is on screen so the number is not read bare.'],
      ['Trailing button', 'A size-7 button flush inside the right edge: clear a search, show a password, open a picker. It is inside the outline, it is type="button", and it returns focus to the input when it acts.'],
      ['Focus outline', 'focus-within on the wrapper — border zinc-700 plus a 3px zinc-700/15 halo at offset 2. An outline rather than a ring, because forced-colours mode drops every box-shadow.'],
      ['Help or error', '12px under the box, pointed at by aria-describedby. The error replaces the help text rather than stacking under it, so the block keeps its height and the form does not jump on submit.']
    ],
    behaviour: [
      'The focus outline goes on the wrapper through focus-within and never on the input, so clicking anywhere in the box — the icon, the unit, the empty space to the right of the text — focuses the field and lights the whole object at once.',
      'Numbers are right-aligned with tabular-nums. A column of amounts whose digits do not line up cannot be scanned for magnitude, and proportional figures change width as they are typed, which shifts the unit beside them on every keystroke.',
      'An amount groups on blur and ungroups on focus. Editing a string with separators in it means counting commas to find the right digit; editing 1842000 does not. The grouped form is what the field shows at rest and a hidden input carries the raw digits that post.',
      'Validation the browser can do itself runs on :user-invalid, so it fires when the field is left rather than while it is being typed into, and clears again as soon as the value is right. Validation the server does arrives as aria-invalid plus real text, and revalidates the same way once the user starts correcting it.',
      'A clear button exists only while there is something to clear, and pressing it puts focus back in the field so typing can continue. Escape clears the field too, and stops propagating, or clearing a search inside a sheet also closes the sheet.',
      'Disabled leaves the Tab order and is not submitted. Read-only stays in the Tab order, stays selectable, and is submitted — which is why locking a value is readonly and never disabled.',
      'A password field toggles its own type and nothing else. The button keeps focus so the change of state is announced, and a live region says the password is now visible, because the caret moving back into the field would swallow the announcement.',
      'At 390px the wrapper keeps its shape: the input shrinks, the icon and the unit stay at their natural width, and the row never scrolls sideways. This only holds because the control carries min-w-0.'
    ],
    a11y: [
      'Every input has a real <label> bound with for/id. A placeholder is not a label and neither is a heading above the field; both leave the control with no accessible name the moment there is a value in it.',
      'aria-describedby points at the help text, and at the error text when there is one. A unit shown as a prefix belongs in that description too — "18,42,000" announced without the rupee is a number with no idea what it counts.',
      'A server-rendered error sets aria-invalid="true" on the control and the message is real text under the box, tied by id. A red border is not a state and a title attribute is not a message; neither reaches a screen reader and neither survives forced-colours mode.',
      'Disabled uses the disabled attribute, which removes the control from the Tab order and from the form data. Read-only uses readonly, which keeps it reachable so the value can be read and copied — and keeps a visible focus outline for exactly that reason.',
      'The trailing button is type="button", has an aria-label that names what it does to this field rather than "Clear", and is reachable by keyboard. A div with a click handler on it is not any of those things.',
      'type and inputmode are set for the value, not for the validation. type="email" and inputmode="decimal" change the keyboard a phone offers, which is most of the accessibility gain either of them ever delivers, and inputmode is the safe half — it changes the keyboard without changing how the value is parsed.',
      'The focus outline reads against white and against zinc-100, sits outside the border at offset 2 so it is never confused with the border itself, and is an outline rather than a ring so forced-colours mode cannot drop it.'
    ],
    related: ['field', 'textarea', 'combobox'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- The border, the fill and the focus outline are on the wrapper. The input
     inside it is bg-transparent with outline-none and draws nothing at all.

     outline-none on the control is only legal because of that. Tailwind
     resolves outline-style through a variable, so writing outline-none on the
     same element that carries focus-visible:outline-3 sets the width and the
     colour and then removes the style — it inspects as styled and renders as
     nothing. One element per outline: here it is the wrapper.

     w-full makes the whole box a click target rather than just the text.
     min-w-0 is what lets the input shrink at 390px; without it an input holds
     a min-content width of about twenty characters and pushes anything beside
     it out through the border. -->
<div data-kui="input/default" class="max-w-xl">
  <label for="in-title" class="mb-1.5 block text-[13px]/5 font-medium">Order title <span class="text-red-600">*</span></label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <input id="in-title" name="title" value="MS angles and plates — August lot"
           aria-describedby="in-title-help"
           class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
  </div>
  <p id="in-title-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Printed on the order and used as the subject of the vendor email.</p>
</div>` },

      { id: 'sizes', name: 'Two heights', code:
`<!-- Two sizes and no more. 36px is the form field; 32px is the dense one, for
     a toolbar or the filter row above a register, where the field sits in a
     line of 13px controls and a 36px box is taller than everything beside it.

     Both heights come from padding against the line box, never from an h-
     class. py-2 on a 20px leading is 36px and py-1.5 is 32px, and both are a
     whole number of line boxes. h-9 on the input looks identical until the
     wrapper gains a taller child, at which point the flex row centres the text
     instead of its own padding doing it and the caret drifts off the icon
     beside it by a pixel or two.

     The dense field also drops to 13px text. Keeping 14px inside a 32px box
     leaves 6px of padding, and the descenders start touching the border. -->
<div data-kui="input/sizes" class="max-w-xl space-y-5">
  <div>
    <label for="in-h36" class="mb-1.5 block text-[13px]/5 font-medium">36px — the form field</label>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="in-h36" value="Gujarat Polymers Ltd"
             class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none">
    </div>
  </div>

  <div>
    <p class="mb-1.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">32px — the filter row over a register</p>
    <div class="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5">
      <div class="flex min-w-0 flex-1 items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <i data-lucide="search" class="ml-2.5 size-4 shrink-0 text-zinc-600"></i>
        <label for="in-h32" class="sr-only">Filter purchase orders</label>
        <input id="in-h32" placeholder="Filter 1,438 orders"
               class="w-full min-w-0 bg-transparent px-2 py-1.5 text-[13px]/5 outline-none placeholder:text-zinc-500">
      </div>
      <button type="button" class="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-[13px]/5 font-medium hover:bg-zinc-100">
        <i data-lucide="sliders-horizontal" class="size-4 text-zinc-600"></i>Filters
      </button>
    </div>
  </div>
</div>` },

      { id: 'icon', name: 'Icon and unit', code:
`<!-- Both of these are the argument for the border being on the wrapper. The
     magnifier and the ₹ sit inside the focus outline, so a focused field is
     one object; move the border onto the input and they are two things next to
     each other, and the ₹ starts reading as a label rather than as part of the
     number.

     The icon is shrink-0 and the input is min-w-0. Reverse them and flex
     squeezes the 16px icon to nothing while the input holds its twenty
     character min-content width, which is the failure that only shows up at
     390px.

     A unit rendered as text is not submitted. What posts is the number alone,
     so the server has to know that this field is rupees and that one is
     percent — the prefix tells the user, not the endpoint. -->
<div data-kui="input/icon" class="max-w-xl space-y-5">
  <div>
    <label for="in-search" class="mb-1.5 block text-[13px]/5 font-medium">Find a vendor</label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
      <input id="in-search" placeholder="Name, GSTIN or vendor code"
             class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
    </div>
  </div>

  <div>
    <label for="in-tol" class="mb-1.5 block text-[13px]/5 font-medium">Receipt tolerance</label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="in-tol" name="tolerance" value="2" inputmode="decimal" aria-describedby="in-tol-help"
             class="w-full min-w-0 bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
      <span class="pr-3 text-[14px]/5 text-zinc-600">%</span>
    </div>
    <p id="in-tol-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Over-receipt allowed against the ordered quantity.</p>
  </div>

  <div>
    <label for="in-code" class="mb-1.5 block text-[13px]/5 font-medium">Item code</label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <span class="pl-3 font-mono text-[13px]/5 text-zinc-500">KSP-</span>
      <input id="in-code" name="item_code" value="4471029" inputmode="numeric" spellcheck="false"
             class="w-full min-w-0 bg-transparent py-2 pr-3 pl-1 font-mono text-[13px]/5 tabular-nums outline-none">
    </div>
  </div>
</div>` },

      { id: 'amount', name: 'Rupee amounts and quantities', code:
`<!-- type="number" is the wrong control for money, and the reasons are not
     cosmetic. The scroll wheel edits a focused number input in Chrome and
     Safari, so a rate changes when somebody scrolls the page past it and
     nothing on screen says it happened. Grouping separators are not a valid
     number, so 18,42,000 makes the field invalid and .value comes back as an
     empty string — the digits are visible and unreadable to script. The
     decimal separator follows the browser locale, so one keystroke means 1.5
     in one browser and 15 in another. And the spinner is two 12px targets.

     type="text" with inputmode="decimal" gives the phone the numeric keypad,
     which was the only part of type="number" worth having, and leaves the
     parsing where it belongs.

     Grouping is Indian, not thousands: a three-digit regex produces 1,842,000,
     which is wrong on an order printed in Silvassa. toLocaleString with en-IN
     gives 18,42,000. It groups on blur and ungroups on focus, because editing
     a string with commas in it means counting commas to find the digit you
     want. The hidden input is what posts — never the formatted string. -->
<div data-kui="input/amount" class="max-w-xl space-y-5"
     x-data="{
       amount: '18,42,000',
       strip() { this.amount = this.amount.replace(/[^0-9.]/g, ''); },
       group() {
         const n = Number(this.amount.replace(/[^0-9.]/g, ''));
         if (!this.amount.trim() || Number.isNaN(n)) return;
         this.amount = n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
       },
       get raw() { return this.amount.replace(/[^0-9.]/g, ''); }
     }">
  <div>
    <label for="in-amt" class="mb-1.5 block text-[13px]/5 font-medium">Order value <span class="text-red-600">*</span></label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
      <input id="in-amt" x-model="amount" @focus="strip()" @blur="group()"
             inputmode="decimal" autocomplete="off" aria-describedby="in-amt-help"
             class="w-full min-w-0 bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
    </div>
    <!-- the digits, with nothing dressed onto them -->
    <input type="hidden" name="order_value" :value="raw">
    <p id="in-amt-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">
      Rupees, excluding GST. Posted as <span class="font-mono" x-text="raw || '0'"></span>.
    </p>
  </div>

  <div>
    <label for="in-qty" class="mb-1.5 block text-[13px]/5 font-medium">Quantity ordered</label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="in-qty" name="qty" value="12.500" inputmode="decimal" aria-describedby="in-qty-help"
             class="w-full min-w-0 bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
      <span class="pr-3 shrink-0 text-[14px]/5 text-zinc-600">MT</span>
    </div>
    <p id="in-qty-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Three decimal places. 12.500 MT against a contracted 15.000 MT.</p>
  </div>
</div>` },

      { id: 'search', name: 'Search with a clear button', code:
`<!-- Two things about the clear button. It only exists while there is a value,
     because a permanently visible X on an empty box is a control that does
     nothing. And it hands focus back to the input when it acts: it removes
     itself the instant it is pressed, and focus on a removed element resets to
     the document body, which drops a keyboard user at the top of the page with
     nothing to tell them it happened.

     type="search" is here for the phone keyboard and the browser's own history
     behaviour, but WebKit and Chrome draw their own cancel button inside it,
     so without the appearance-none on ::-webkit-search-cancel-button the field
     shows two X's side by side.

     Escape clears the field and stops propagating. A search box inside a sheet
     or a dialog shares Escape with the panel around it, and without the stop
     the first press both clears the query and closes the panel. -->
<div data-kui="input/search" class="max-w-xl" x-data="{ q: 'gujarat polymers' }">
  <label for="in-q" class="mb-1.5 block text-[13px]/5 font-medium">Search purchase orders</label>

  <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
    <input id="in-q" x-ref="q" x-model="q" type="search" enterkeyhint="search"
           autocomplete="off" spellcheck="false" aria-describedby="in-q-help"
           @keydown.escape="if (q) { $event.stopPropagation(); q = '' }"
           placeholder="Order number, vendor or item"
           class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none">

    <button type="button" x-show="q" x-cloak
            @click="q = ''; $refs.q.focus()" aria-label="Clear the order search"
            class="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
      <i data-lucide="x" class="size-4"></i>
    </button>
  </div>

  <p id="in-q-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">
    <span x-show="!q" x-cloak>Searches open and closed orders back to 1 Apr 2025.</span>
    <span x-show="q" x-cloak>7 of 1,438 orders match. Escape clears the box.</span>
  </p>

  <div class="mt-3 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white" x-show="q" x-cloak>
    <p class="px-4 py-2.5 text-[13px]/5 tabular-nums">PO-24-1187 · Gujarat Polymers Ltd · ₹18,42,000</p>
    <p class="px-4 py-2.5 text-[13px]/5 tabular-nums">PO-24-1163 · Gujarat Polymers Ltd · ₹4,10,500</p>
  </div>
</div>` },

      { id: 'error', name: 'Invalid, and clearing as it is fixed', code:
`<!-- The error was put there by the server, so it is aria-invalid plus real
     text tied by id — not a red border, which reaches nobody, and not a title
     attribute, which reaches nobody either.

     Two things this variant is here to show. The invalid wrapper drops
     focus-within:border-zinc-700 entirely: leave it in and focusing a wrong
     field repaints it grey, so the box says fixed while the message under it
     still says broken. And once a field has errored it revalidates as the
     value is corrected, so the message clears the moment it stops being true
     rather than waiting for another round trip.

     The help line is always occupied — help text when valid, the error when
     not — so the block keeps its height and the fields below it do not jump
     as the user types. -->
<div data-kui="input/error" class="max-w-xl"
     x-data="{
       rate: '51,800',
       touched: true,
       floor: 52400,
       get n() { return Number(this.rate.replace(/[^0-9.]/g, '')); },
       get bad() { return this.touched && (!this.rate.trim() || this.n < this.floor); }
     }">
  <label for="in-rate" class="mb-1.5 block text-[13px]/5 font-medium">Rate per MT <span class="text-red-600">*</span></label>

  <div class="flex items-center rounded-lg bg-white border"
       :class="bad ? 'border-red-600 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15'
                   : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15'">
    <span class="pl-3 text-[14px]/5" :class="bad ? 'text-red-600' : 'text-zinc-600'">₹</span>
    <input id="in-rate" name="rate" x-model="rate" @blur="touched = true"
           inputmode="decimal" autocomplete="off"
           :aria-invalid="bad ? 'true' : null"
           aria-describedby="in-rate-msg"
           class="w-full min-w-0 bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
  </div>

  <p id="in-rate-msg" class="mt-1.5 text-[12px]/4 tabular-nums" :class="bad ? 'font-medium text-red-600' : 'text-zinc-500'">
    <span x-show="!bad" x-cloak>Contracted floor is ₹52,400 per MT until 31 Mar 2027.</span>
    <span x-show="bad" x-cloak class="flex items-center gap-1.5">
      <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>Below the contracted floor of ₹52,400 per MT.
    </span>
  </p>
</div>` },

      { id: 'format', name: 'Format-constrained fields', code:
`<!-- pattern is checked by the browser, and :user-invalid is what draws the
     result. Not :invalid — that matches from first paint, so a required field
     is red before anyone has touched it and a create form opens covered in
     errors nobody has made. :user-invalid waits until the field has been
     interacted with and left.

     The red rules have to be written in their focused form as well.
     focus-within:border-zinc-700 and has-[:user-invalid]:border-red-600 carry
     the same specificity, so which one wins comes down to the order Tailwind
     emitted them in; stacking has-[:user-invalid]:focus-within:border-red-600
     settles it rather than leaving it to chance.

     uppercase is a paint. The value posted is exactly what was typed, so a
     field that looks like GRN-24-0912 can post grn-24-0912 and fail a pattern
     of [A-Z]{3} while the screen shows a perfectly good code. The blur handler
     is what makes the value agree with the rendering.

     type="date" always posts yyyy-mm-dd whatever it displays, and what it
     displays is the browser's locale — so the hint says what the date means,
     not what it should look like. -->
<div data-kui="input/format" class="max-w-xl space-y-5" x-data="{ ref: 'GRN-24-0912' }">
  <div>
    <label for="in-ref" class="mb-1.5 block text-[13px]/5 font-medium">GRN reference</label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15 has-[:user-invalid]:border-red-600 has-[:user-invalid]:focus-within:border-red-600 has-[:user-invalid]:focus-within:outline-red-600/15">
      <input id="in-ref" name="grn_ref" x-model="ref" @blur="ref = ref.toUpperCase().trim()"
             pattern="GRN-[0-9]{2}-[0-9]{4}"
             title="Three letters, two digits, four digits — GRN-24-0912"
             autocomplete="off" spellcheck="false" aria-describedby="in-ref-help"
             placeholder="GRN-24-0912"
             class="w-full min-w-0 bg-transparent px-3 py-2 font-mono text-[13px]/5 uppercase tabular-nums outline-none placeholder:normal-case placeholder:text-zinc-500">
    </div>
    <p id="in-ref-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Top right of the receipt note, as GRN-24-0912.</p>
  </div>

  <div>
    <label for="in-date" class="mb-1.5 block text-[13px]/5 font-medium">Invoice date</label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="in-date" name="invoice_date" type="date" value="2026-08-16"
             max="2026-08-21" aria-describedby="in-date-help"
             class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
    </div>
    <p id="in-date-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">The date on the vendor invoice, not the date it was received. Cannot be in the future.</p>
  </div>
</div>` },

      { id: 'password', name: 'Password with show and hide', code:
`<!-- The reveal button keeps focus after it is pressed. Sending focus back to
     the field is the friendlier-looking choice and it is wrong: the only thing
     announcing the change of state is the button's own name changing, and a
     name change on an element nobody is on is announced by nothing. The live
     region below is what pays for keeping focus on the button — it says the
     password is visible in words, so the state is not carried by an icon.

     The label changes and aria-pressed is absent. Writing both gives "Hide
     password, pressed", which reads as though hiding is what is currently
     switched on. Pick one; a changing name is the one that survives being read
     out of context.

     The eye is swapped by two wrapping spans, never by a binding on the <i>.
     createIcons() replaces the <i> with an <svg> and takes x-show with it, so
     the icon that was hidden stays on screen forever.

     Edge draws a reveal control of its own inside every password field, so
     that browser shows two eyes in this box. The utility that looks like the
     fix, [&::-ms-reveal]:hidden, is not one: Tailwind drops any selector
     carrying an ::-ms- pseudo-element, so the class compiles to nothing at all
     and inspects as a class that is simply there. ::-webkit-search-cancel-button
     survives the same treatment, which is what makes this easy to get wrong.
     Suppressing Edge's control needs a rule in the application stylesheet, and
     until somebody decides it is worth one, the second eye stays. -->

<div data-kui="input/password" class="max-w-xl" x-data="{ show: false }">
  <label for="in-pw" class="mb-1.5 block text-[13px]/5 font-medium">Password</label>

  <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <input id="in-pw" name="password" x-ref="pw" :type="show ? 'text' : 'password'"
           value="silvassa-2026" autocomplete="current-password" spellcheck="false"
           aria-describedby="in-pw-help"
           class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 outline-none">

    <button type="button" @click="show = !show"
            :aria-label="show ? 'Hide password' : 'Show password'"
            class="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
      <span x-show="!show" class="flex"><i data-lucide="eye" class="size-4"></i></span>
      <span x-show="show" x-cloak class="flex"><i data-lucide="eye-off" class="size-4"></i></span>
    </button>
  </div>

  <p id="in-pw-help" class="mt-1.5 text-[12px]/4 text-zinc-500">At least 12 characters. Used for the vendor portal, not for the ERP.</p>

  <p role="status" class="sr-only" x-text="show ? 'Password is visible' : ''"></p>
</div>` },

      { id: 'disabled', name: 'Disabled and read-only', code:
`<!-- These are not two shades of the same state. A disabled control is not
     submitted with the form, so locking a value by disabling it deletes it
     from the POST and the server writes the blank it received. readonly
     submits, stays in the Tab order and stays selectable. Lock with readonly;
     disable only when there is genuinely nothing to send.

     They do share a surface, and deliberately: bg-zinc-100 with no resting
     ring reads as a field that is closed. What separates them is the text —
     zinc-400 for disabled, whose value does not matter, zinc-900 for
     read-only, whose value still has to be read off the screen and copied.

     Only the read-only wrapper takes a focus outline, because only read-only
     is focusable, and a keyboard user landing in a field with no indicator has
     no idea where they are. A read-only value left on white with a border and
     a focus ring is pixel for pixel an editable field, and the only way to
     find out otherwise is to click into it and get nothing back. -->
<div data-kui="input/disabled" class="max-w-xl space-y-5">
  <div>
    <label for="in-off" class="mb-1.5 block text-[13px]/5 font-medium text-zinc-500">Rate contract</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">
      <input id="in-off" disabled value="Locked by policy" aria-describedby="in-off-help"
             class="w-full min-w-0 bg-transparent px-3 py-2 text-[14px]/5 text-zinc-400">
    </div>
    <p id="in-off-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Nothing is sent for this field. It is set on the contract itself.</p>
  </div>

  <div>
    <label for="in-ro" class="mb-1.5 block text-[13px]/5 font-medium">Order number</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="in-ro" name="order_no" readonly value="PO-24-1187" aria-describedby="in-ro-help"
             class="w-full min-w-0 bg-transparent px-3 py-2 font-mono text-[13px]/5 tabular-nums outline-none">
    </div>
    <p id="in-ro-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Allotted on 16 Aug 2026 and submitted with the form. Select it to copy.</p>
  </div>
</div>` }
    ]
  },

  {
    id: 'input-group', name: 'Input group', category: 'forms',
    description: 'One text field and the things that qualify it — a unit, a currency, a scope select, an action — inside a single bordered enclosure that draws one focus outline for all of them.',
    when: 'When a value is only complete with something attached to it: a quantity that needs a unit, a number that needs a currency, a search that needs a scope, a code that needs an Add line beside it. If you can delete the text field and the rest still makes sense, it was never a group — it is a button group with a box parked next to it.',
    notes: [
      'The border and the focus outline live on the wrapper and nothing inside draws its own. focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15 on the enclosure, outline-none on the field. Put the outline on the input instead and it is drawn inside the border the input shares with everything else, so the ₹ and the unit select sit outside the indicator and the group stops looking like one field and starts looking like a box with two things stuck to it. This is the one place outline-none is allowed, and it is allowed because something else is drawing the outline for that control.',
      'Exactly one child may delegate its outline to the wrapper, and it is the text field. Every other focusable child — a copy button, a fused select, a submit — keeps an indicator of its own, drawn inset with focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700. Give an addon the ordinary outward halo and the right-hand end of the group shows two rounded boxes two pixels apart, one round the button and one round the enclosure it is flush against. Give it nothing and the enclosure lights up identically whether the caret is in the field or on the button beside it, which is the same as having no indicator at all. The wrapper halo says the keyboard is in this group; the inset outline says which part.',
      'items-stretch on the wrapper, and never a height on an addon. The height of the whole group is set once, by the field\'s own padding, and every addon takes it by stretching. Write h-8 on a button inside a 38px enclosure and you get a 3px strip of white above and below it, a border-l that stops short of both edges, and a hover fill floating in the middle of the row. The price of items-stretch is that every text addon has to carry flex items-center of its own, or its glyph sits against the top edge of a box it is supposed to be centred in.',
      'min-w-0 on the field, always. An <input> carries an intrinsic minimum width of roughly twenty characters and a flex item will not shrink below its intrinsic minimum, so a group with a select on one end and a button on the other does not get narrow at 390px — it gets wider than the screen and drags the page sideways with it. min-w-0 flex-1 is the entire fix and it is invisible until somebody opens the page on a phone.',
      'A passive addon takes no divider and an interactive one always does. ₹, .00, % and a leading icon are part of the value being read, so a rule between them and the number would say they are a separate control. A button or a select is a separate control, so it takes a border-l or border-r in border-zinc-200 — the same weight as the enclosure\'s own edge, because a lighter internal rule inside a 38px box reads as a smudge rather than a join. This is the rule the attached strip in button-group follows, and for the same reason.',
      'A child flush against the inner edge takes rounded-*-[7px], not rounded-*-lg. The enclosure is 8px with a 1px border, so its inner curve is 7px; an 8px corner on the child leaves a white crescent in each corner that nobody sees until the child is filled or hovered. A child inside a padded bar — a button in a block-end footer — is not flush and takes the ordinary rounded-lg. And never reach for overflow-hidden to tidy any of this up: the enclosure has to let an addon\'s menu out of it, and clipping the group to 38px leaves the menu invisible with nothing on screen to explain why.',
      'A text prefix is not a label and must never be the only thing naming the field. ₹ says nothing about which amount this is, and a prefix reading KIL/26-27/ is a format rather than a name. Every group carries a real label, and where the enclosure holds more than one control every control carries one: a fused unit select with no label of its own is announced as an unnamed combobox, and the wrapper\'s border names nothing.',
      'A fixed prefix is not in the value. The input posts what was typed and nothing else, so KIL/26-27/ has to be prepended on the server or carried in a hidden input beside the field. Leave it out and the record is saved with a bare serial where an invoice number should be, while the person entering it watched a full invoice number on screen the whole time and has no reason to check.',
      'A trailing unit is decoration or it is content, and the difference is whether the label already says it. The suffix span is a sibling of the input, not part of its accessible name, so it is silent by default — somebody typing 40 into a field called Quantity never learns it is MT. Either the label carries the unit, "Quantity (MT)", and the visible span takes aria-hidden so a label-wrapped group does not read it twice, or the span keeps an id and aria-describedby points at it. What is not allowed is the unit existing only as pixels.',
      'The red edge in an error state belongs to the wrapper. border-red-600 on the input draws the rule round the number alone and leaves the currency and the unit outside it in zinc, so the error looks like it belongs to a part of the group rather than to the value. The border stays red-600 while the group has focus — leaving focus-within:border-zinc-700 in place beside it erases the error the instant somebody clicks in to fix it, which is the one moment they are looking at it — and only the halo changes colour, to red-600/15. aria-invalid goes on the control that is actually wrong, which may be the select and not the number; mark both and one mistake is reported twice.',
      'Two addons and a field is the ceiling, because the group is the one component that adds width in three places at once. A scoped select, a box, a submit and a clear is four things and it does not fit 390px: the button label goes first, then the button becomes an icon, then the group gives up and puts its controls on a line of their own under the field. Nothing in this component scrolls sideways, and a native select is as wide as its longest option, so the options are codes — MT, +91, All — and never spelled-out words.',
      'Disabled and read-only apply to the enclosure, not to the field inside it. Grey the wrapper to bg-zinc-100, drop the focus-within border change, and then decide each addon separately: one that reads the value stays live, because copying a locked GRN number is exactly what a locked GRN number is for, and one that changes the value goes disabled with the field. A live Apply button on a dead field is a button that posts an empty value.'
    ],
    anatomy: [
      ['Enclosure', 'The bordered flex row. It owns the border, the focus outline and the height, and it is the only thing in the component that is not a control.'],
      ['Field', 'The text input or textarea, borderless and transparent with outline-none, min-w-0 flex-1 so it takes every pixel the addons do not.'],
      ['Passive addon', 'A currency, a unit, a fixed prefix or a decorative icon. aria-hidden or referenced by aria-describedby, flex items-center, and no divider between it and the field.'],
      ['Control addon', 'A button or a select inside the enclosure. Takes a divider, an accessible name of its own, and an inset focus outline, because focus-within cannot say which of two controls the keyboard is on.'],
      ['Divider', 'border-l or border-r in border-zinc-200 between the field and a control addon. One rule, the same weight as the enclosure, and none at all against a filled button where the colour change is the join.'],
      ['Block addon', 'A header or footer bar inside the enclosure, above or below a textarea, separated by a full-width border-zinc-200 rule. This is what the wrapper border buys that a bordered control cannot.'],
      ['Message', 'Help text or an error under the group, pointed at with aria-describedby. The error replaces the help text rather than stacking under it.']
    ],
    behaviour: [
      'The field fills everything the addons leave, so there is almost nowhere in the enclosure to click and miss. The slivers of padding beside a passive addon genuinely do nothing, and that is the price of not wrapping the whole group in a <label> — do that and the suffix text joins the field\'s accessible name and "40" comes back as "Quantity kilograms kg".',
      'Tab order is DOM order. A leading scope select is reached before the box and a trailing submit after it, which is why the scope select is written first rather than placed first — order-first would look right and tab backwards.',
      'Enter in the field does whatever the trailing button does. Inside a form the button is type="submit" and this is already true; standalone the field needs the key bound, because typing a code and pressing Enter is the gesture people use and reaching for a button beside the box is not.',
      'A clear button that only exists while there is text destroys itself on the click that fires it. Put focus back in the field in the same handler or it falls to <body> and the next Tab restarts from the top of the page.',
      'A copy button that swaps its icon has told nobody anything. The confirmation is a live region, the button\'s own accessible name changes with the icon, and both revert on a timer so the next copy is not silent.',
      'A group never wraps. It is one object, so below sm it either drops an addon or becomes a field with its controls on a line under it, and it never becomes two rows of a broken enclosure with the wrong corners rounded on four of the pieces.',
      'A textarea inside an enclosure takes resize-none and gets its height from rows. Its resize grabber renders in its own bottom-right corner, which is now in the middle of the box above the footer bar — a drag handle floating over nothing.',
      'Two focusable children mean two indicators at once, nested rather than side by side: the enclosure keeps its halo because the keyboard is inside the group, and the inset outline picks out the control. Anyone who finds that noisy is reading it as two boxes, which is what the inset offset exists to prevent.'
    ],
    a11y: [
      'The field has a real label bound with for/id, visible or sr-only, and so does every other control in the enclosure. A prefix is not a label, a placeholder is not a label and disappears on the first keystroke, and an icon is not a label — a magnifying glass says the field is a search, not what is being searched.',
      'Decorative icons take aria-hidden. An icon-only button takes an aria-label naming the verb and the object — "Copy GRN number", "Search purchase orders, GRNs and vendors" — because a page with three search boxes otherwise hands a screen-reader user three buttons called Search and no way to tell them apart.',
      'A unit or currency in a suffix is announced by nothing on its own. Either the label carries it and the visible span is aria-hidden, or the span has an id and aria-describedby on the field points at it. A value read back without its unit is a different value.',
      'Only the field writes outline-none, and only because the wrapper draws its outline. Every other focusable child keeps an indicator, inset so it does not stack a second box on the enclosure\'s own. The wrapper indicator is an outline rather than a ring, so it survives forced-colours mode where box-shadows are dropped; the border and the internal dividers survive it too, because they are borders.',
      'aria-invalid goes on the control that is wrong and on nothing else. The message is real text under the group, referenced by aria-describedby, not a colour and not a title attribute, and no addon inside the group turns red with it — a red ₹ reads as a negative amount and a red MT reads as the wrong unit.',
      'Confirmations that arrive without a page change go through role="status" or aria-live: Copied, Applied, added as line 4. A swapped icon and a changed fill are announced by nothing, and the person who cannot see them is the one who most needs to know the click landed.',
      'Read-only keeps the field in the tab order so its value can be selected and copied; disabled takes it out. The locked surface, bg-zinc-100 with no live border, is what says so on screen — a read-only value left white and bordered is pixel for pixel an editable field until somebody clicks into it and nothing happens.',
      'A group wrapped in role="group" with an aria-label is announced once on entry and does not name anything inside it. That is an addition to the individual labels, never a replacement for them.'
    ],
    related: ['input', 'button-group', 'field'],
    variants: [
      { id: 'default', name: 'Prefix and suffix', code:
`<!-- Two prefixes doing two different jobs, and the difference is whether the
     text is information.

     ₹ and .00 are decoration. The label already says the field is in rupees and
     .00 says nothing at all, so both spans are aria-hidden and the input posts
     a bare number. KIL/26-27/ is information — it is the first half of the
     invoice number and the label does not say it — so it keeps an id and
     aria-describedby points at it.

     The fixed prefix is not in the value either way. The input posts the serial
     alone, so a hidden input carries the series and the server joins them.
     Leave that out and the record is saved as 0148 while the person entering it
     watched a full invoice number on screen the whole time.

     The tinted prefix is bg-zinc-100 with a divider and no ring. It is a region
     of the enclosure rather than a shape floating on it: three of its edges are
     the wrapper's own border and the fourth is the divider, so a ring inside it
     would draw a second rule one pixel in from the first. Neither ₹ nor .00
     takes a divider — a rule there would say the glyph is a control. -->
<div data-kui="input-group/default" class="max-w-xl space-y-5">
  <div>
    <label for="ig1-value" class="mb-1.5 block text-[13px]/5 font-medium">Order value (₹)</label>
    <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <span aria-hidden="true" class="flex items-center pl-3 text-[14px]/5 text-zinc-600">₹</span>
      <input id="ig1-value" name="value" inputmode="decimal" value="18,42,000"
             class="min-w-0 flex-1 bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
      <span aria-hidden="true" class="flex items-center pr-3 text-[14px]/5 text-zinc-500">.00</span>
    </div>
    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Excluding GST. PO-24-1187, Gujarat Polymers Ltd.</p>
  </div>

  <div>
    <label for="ig1-inv" class="mb-1.5 block text-[13px]/5 font-medium">Invoice number</label>
    <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <span id="ig1-inv-series" class="flex shrink-0 items-center rounded-l-[7px] border-r border-zinc-200 bg-zinc-100 px-3 text-[14px]/5 tabular-nums text-zinc-600">KIL/26-27/</span>
      <input id="ig1-inv" name="invoice_serial" value="0148" inputmode="numeric"
             aria-describedby="ig1-inv-series ig1-inv-help"
             class="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
      <input type="hidden" name="invoice_series" value="KIL/26-27/">
    </div>
    <p id="ig1-inv-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">The series is fixed for the financial year. Type the serial only.</p>
  </div>
</div>` },

      { id: 'icon', name: 'Leading icon', code:
`<!-- The icon is decoration and has to be built as decoration: aria-hidden, no
     divider, no hover, nothing focusable. There is no in-between state where a
     glyph is quietly clickable — the moment it does something it becomes a
     button, and a button owes a divider, an accessible name and a focus
     indicator of its own.

     self-center is not optional. The wrapper is items-stretch, and although a
     lucide <svg> with a width and a height set does not stretch, the class list
     is copied onto whatever it replaces and a bare span around it would. One
     class here is cheaper than finding out later why the icon is welded to the
     top edge.

     The second group is the reason nothing sits at the right-hand end of a date
     field. type="date" renders the browser's own picker button inside the
     control, hard against its right edge, and an addon there lands on top of
     it. The left end is free, which is why the decorative calendar goes there —
     it names the field at a glance and opens nothing. -->
<div data-kui="input-group/icon" class="max-w-xl space-y-5">
  <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <label for="ig2-q" class="sr-only">Search purchase orders</label>
    <i data-lucide="search" aria-hidden="true" class="ml-3 size-4 shrink-0 self-center text-zinc-500"></i>
    <input id="ig2-q" type="text" placeholder="Order number, vendor or item"
           class="min-w-0 flex-1 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
  </div>

  <div>
    <label for="ig2-date" class="mb-1.5 block text-[13px]/5 font-medium">Promised delivery date</label>
    <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <i data-lucide="calendar" aria-hidden="true" class="ml-3 size-4 shrink-0 self-center text-zinc-500"></i>
      <input id="ig2-date" name="promised" type="date" value="2026-08-16"
             class="min-w-0 flex-1 bg-transparent px-2 py-2 text-[14px]/5 tabular-nums outline-none">
    </div>
    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Ordered 02 Aug 2026. Moving this date re-runs the ageing on the register.</p>
  </div>
</div>` },

      { id: 'button', name: 'Trailing icon button', code:
`<!-- Both of these are buttons rather than glyphs, and they are built as
     buttons: a divider on the left, an aria-label naming the verb and the
     object, and an inset focus outline.
     focus-visible:outline-2 focus-visible:-outline-offset-2 draws the indicator
     inside the enclosure. The ordinary outward halo would sit two pixels
     outside the button and one pixel outside the wrapper it is flush against,
     so the right-hand end of the group would carry two rounded boxes at once.
     The enclosure still lights up through focus-within, and that is correct:
     the halo says the keyboard is in this group, the inset outline says which
     part of it.

     The first group is read-only, so the enclosure takes the locked surface the
     input entry uses — a read-only value on white with a live border is pixel
     for pixel an editable field. The copy button inside it stays live, because
     copying does not change the value; a unit select in the same enclosure
     would go disabled with the field.

     Copy swaps its icon, which is announced by nothing, so the confirmation is
     a live region and the button's own name changes with it. The two icons are
     spans carrying x-show rather than one :data-lucide binding, because
     createIcons() replaces the <i> and anything bound on it goes too.

     Clear destroys itself: the click empties the field, the button disappears
     with the text, and focus lands on <body> unless the same handler puts it
     back. The button is visible at first paint here because the filter starts
     with a value in it — start it empty and it needs x-cloak, or it flashes on
     screen for one frame before Alpine boots and takes it away. -->
<div data-kui="input-group/button" class="max-w-xl space-y-5">
  <div>
    <label for="ig3-grn" class="mb-1.5 block text-[13px]/5 font-medium">GRN number</label>
    <div class="flex items-stretch rounded-lg border border-zinc-200 bg-zinc-100 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15"
         x-data="{ done: false, t: null,
                   copy() { navigator.clipboard?.writeText(this.$refs.grn.value);
                            this.done = true;
                            clearTimeout(this.t);
                            this.t = setTimeout(() => this.done = false, 2000) } }">
      <input id="ig3-grn" x-ref="grn" readonly value="GRN-24-0912"
             class="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
      <button type="button" @click="copy()" :aria-label="done ? 'GRN number copied' : 'Copy GRN number'"
              class="flex shrink-0 items-center rounded-r-[7px] border-l border-zinc-200 px-3 hover:bg-zinc-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
        <span x-show="!done"><i data-lucide="copy" class="size-4 text-zinc-600"></i></span>
        <span x-show="done" x-cloak><i data-lucide="check" class="size-4 text-emerald-600"></i></span>
      </button>
      <span class="sr-only" aria-live="polite" x-text="done ? 'GRN number copied' : ''"></span>
    </div>
    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Posted 16 Aug 2026 against PO-24-1187. Numbering is set by the plant.</p>
  </div>

  <div x-data="{ q: 'HDPE-BLM' }">
    <label for="ig3-filter" class="mb-1.5 block text-[13px]/5 font-medium">Filter the item ledger</label>
    <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <i data-lucide="search" aria-hidden="true" class="ml-3 size-4 shrink-0 self-center text-zinc-500"></i>
      <input id="ig3-filter" x-ref="filter" x-model="q" placeholder="Item code or description"
             class="min-w-0 flex-1 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
      <button type="button" x-show="q.length > 0" @click="q = ''; $refs.filter.focus()"
              aria-label="Clear the item ledger filter"
              class="flex shrink-0 items-center rounded-r-[7px] border-l border-zinc-200 px-3 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
        <i data-lucide="x" class="size-4 text-zinc-600"></i>
      </button>
    </div>
  </div>
</div>` },

      { id: 'select', name: 'A select fused to the field', code:
`<!-- Two controls under one border, which is the case the focus rules were
     written for. The number delegates its outline to the wrapper; the select
     cannot, or focus-within would light the same enclosure whichever of the two
     the keyboard was on and nothing would say which. The select keeps an inset
     outline of its own.

     Both controls carry a name, because a quantity without a unit is not a
     quantity, and both carry a label — the wrapper's border names nothing, and
     a select with no label of its own is announced as an unnamed combobox.

     The select is shrink-0 and its options are codes. A native select is as
     wide as its longest option and that width comes straight off the field:
     spell out "Metric tonnes" and at 390px the quantity box is four characters
     across.

     The number is right of the select in one group and left of it in the other,
     and that is not a preference. A unit follows its quantity and a country
     code precedes its number; reverse either and the value reads back as
     something nobody would write down. -->
<div data-kui="input-group/select" class="max-w-xl space-y-5">
  <div>
    <label for="ig4-qty" class="mb-1.5 block text-[13px]/5 font-medium">Receipt quantity</label>
    <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="ig4-qty" name="qty" inputmode="decimal" value="42.500"
             class="min-w-0 flex-1 bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
      <label for="ig4-uom" class="sr-only">Unit of measure</label>
      <select id="ig4-uom" name="uom"
              class="shrink-0 rounded-r-[7px] border-l border-zinc-200 bg-transparent py-2 pr-2 pl-3 text-[14px]/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
        <option>MT</option>
        <option>kg</option>
        <option>nos</option>
        <option>L</option>
      </select>
    </div>
    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Ordered 42.500 MT on rate contract RC-26-041.</p>
  </div>

  <div>
    <label for="ig4-phone" class="mb-1.5 block text-[13px]/5 font-medium">Vendor contact number</label>
    <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <label for="ig4-cc" class="sr-only">Country code</label>
      <select id="ig4-cc" name="country_code"
              class="shrink-0 rounded-l-[7px] border-r border-zinc-200 bg-zinc-100 py-2 pr-2 pl-3 text-[14px]/5 tabular-nums text-zinc-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
        <option>+91</option>
        <option>+971</option>
        <option>+65</option>
      </select>
      <input id="ig4-phone" name="phone" type="tel" inputmode="tel" value="98250 41163"
             class="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px]/5 tabular-nums outline-none">
    </div>
    <p class="mt-1.5 text-[12px]/4 text-zinc-500">Ritu Deshpande, Gujarat Polymers Ltd. Used for despatch confirmations.</p>
  </div>
</div>` },

      { id: 'action', name: 'A trailing action button', code:
`<!-- Add line is the group's action, so it is filled, and a filled child takes
     no divider — the colour change is the join. A border-zinc-200 rule against
     zinc-700 reads as a crack in the fill rather than a seam, which is why the
     split button in button-group uses a border one step off its own fill
     instead.

     Its focus indicator inverts to white. The shape is unchanged, still 2px and
     still inset; only the colour moves, because zinc-700 on zinc-700 is not an
     indicator.

     Enter has to do what the button does. This is a form and the button is
     type="submit", so Enter already fires it. Standalone the field needs the
     key bound, because typing a code and pressing Enter is the gesture and
     reaching for the button beside the box is not.

     Apply, in the second group, is not filled. There is one primary button on a
     screen and it is never a field's helper: an outline addon says this does
     something to the field, a filled one says this is what the page is for, and
     two filled groups on one form makes both of them wrong. -->
<div data-kui="input-group/action" class="max-w-xl space-y-5">
  <form @submit.prevent="add()"
        x-data="{ code: '', lines: 3, msg: '',
                  add() { const c = this.code.trim().toUpperCase();
                          if (!c) return;
                          this.lines++;
                          this.msg = c + ' added as line ' + this.lines + ' of PO-24-1187.';
                          this.code = '' } }">
    <label for="ig5-code" class="mb-1.5 block text-[13px]/5 font-medium">Add an item to this order</label>
    <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="ig5-code" name="item_code" x-model="code" placeholder="Item code, e.g. HDPE-BLM-5502"
             class="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
      <button type="submit" :disabled="!code.trim()"
              class="inline-flex shrink-0 items-center gap-2 rounded-r-[7px] bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white disabled:bg-zinc-200 disabled:text-zinc-400">
        <i data-lucide="plus" class="size-4"></i>Add line
      </button>
    </div>
    <p role="status" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500"
       x-text="msg || 'PO-24-1187 has 3 lines. Rates come from RC-26-041.'"></p>
  </form>

  <div x-data="{ pct: '2.5', applied: false }">
    <label for="ig5-pct" class="mb-1.5 block text-[13px]/5 font-medium">Line discount (%)</label>
    <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <input id="ig5-pct" name="discount" x-model="pct" inputmode="decimal"
             @keydown.enter.prevent="applied = true"
             class="min-w-0 flex-1 bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
      <span aria-hidden="true" class="flex items-center pr-3 pl-1 text-[14px]/5 text-zinc-500">%</span>
      <button type="button" @click="applied = true"
              class="inline-flex shrink-0 items-center rounded-r-[7px] border-l border-zinc-200 px-3 text-[13px]/5 font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
        Apply
      </button>
    </div>
    <p role="status" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">
      <span x-show="!applied">Applies to all 3 lines. The vendor sees the net rate, not the discount.</span>
      <span x-show="applied" x-cloak class="flex items-center gap-1.5">
        <i data-lucide="check" class="size-3.5 shrink-0 text-emerald-600"></i>Applied. Order value is now ₹17,96,950.
      </span>
    </p>
  </div>
</div>` },

      { id: 'search', name: 'Scoped search', code:
`<!-- Three controls in one enclosure, and the DOM order is the tab order:
     scope, box, submit. Writing the scope select last and floating it left with
     order-first would look right and tab backwards, which nobody notices until
     somebody uses the keyboard.

     type="search" earns its place on a phone, where it labels the return key
     Search — and Chrome draws its own clear cross inside the control, which is
     why this group does not add one. Two crosses in one enclosure, one of them
     yours and one of them not, is worse than none at all.

     role="search" goes on the form. The wrapper is a border and has no
     semantics to give away.

     The submit is icon-only so it carries the whole name, and the name says
     what is being searched. A screen full of search boxes otherwise hands a
     screen-reader user four buttons called Search and no way to tell them
     apart.

     The scope options are one word each because the select is as wide as its
     longest one, and every pixel it takes comes off the box at 390px. -->
<form data-kui="input-group/search" role="search" action="/search/" class="max-w-xl">
  <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <label for="ig6-scope" class="sr-only">Search in</label>
    <select id="ig6-scope" name="scope"
            class="shrink-0 rounded-l-[7px] border-r border-zinc-200 bg-zinc-100 py-2 pr-2 pl-3 text-[13px]/5 font-medium text-zinc-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
      <option value="all">All</option>
      <option value="po">Orders</option>
      <option value="grn">GRNs</option>
      <option value="vendors">Vendors</option>
    </select>

    <label for="ig6-q" class="sr-only">Search orders, GRNs and vendors</label>
    <input id="ig6-q" name="q" type="search" placeholder="PO-24-1187, HDPE, Gujarat Polymers"
           class="min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">

    <button type="submit" aria-label="Search orders, GRNs and vendors"
            class="flex shrink-0 items-center rounded-r-[7px] border-l border-zinc-200 px-3 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
      <i data-lucide="search" class="size-4 text-zinc-600"></i>
    </button>
  </div>
  <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Scoping is what keeps 1,438 open orders out of a vendor lookup.</p>
</form>` },

      { id: 'textarea', name: 'Textarea with a footer', code:
`<!-- The block addons are the whole reason the border sits on the wrapper. A
     header bar above the box and an action bar below it are inside the same
     rule and the same focus outline, so the thing reads as one field with
     furniture rather than a textarea with two toolbars parked against it.

     resize-none, and rows sets the height. A textarea inside an enclosure keeps
     its resize grabber in its own bottom-right corner, which is now in the
     middle of the box directly above the footer bar — a drag handle floating
     over nothing.

     The bars are padded, so the controls inside them are not flush against the
     enclosure's inner edge and take ordinary rounded-lg corners. The 7px corner
     is only for a child pressed against that edge.

     Every control in both bars is focusable, so every one takes the inset
     outline, and the enclosure lights up through focus-within for all of them.
     That is what focus-within is for here: it says the keyboard is inside this
     field, and the inset outline says which control.

     Enter writes a newline, because that is what the key is for in a textarea.
     Ctrl or Cmd plus Enter posts, and the hint says so rather than leaving it
     to be discovered — and the hint is hidden below sm, because a phone has no
     Ctrl key. -->
<div data-kui="input-group/textarea" class="max-w-xl" x-data="{ text: '' }">
  <label for="ig7-note" class="mb-1.5 block text-[13px]/5 font-medium">Remark on GRN-24-0912</label>

  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-zinc-200 px-3 py-2">
      <span class="flex items-center gap-2">
        <label for="ig7-kind" class="text-[12px]/4 text-zinc-500">Type</label>
        <select id="ig7-kind" name="kind"
                class="rounded-lg bg-transparent py-0.5 pr-1 text-[13px]/5 font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
          <option>Shortage</option>
          <option>Damage in transit</option>
          <option>Quality hold</option>
          <option>General</option>
        </select>
      </span>
      <span class="text-[12px]/4 tabular-nums text-zinc-500">16 Aug 2026 · Ritu Deshpande</span>
    </div>

    <textarea id="ig7-note" name="body" rows="4" x-model="text"
              @keydown.ctrl.enter="if (text.trim()) $refs.post.click()"
              @keydown.meta.enter="if (text.trim()) $refs.post.click()"
              placeholder="What was short, by how much, and what the vendor has promised"
              class="block w-full resize-none bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500"></textarea>

    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-200 px-3 py-2">
      <button type="button"
              class="inline-flex items-center gap-1.5 rounded-lg px-1 py-0.5 text-[13px]/5 text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
        <i data-lucide="paperclip" class="size-4"></i>Attach the weighbridge slip
      </button>

      <span class="flex items-center gap-2">
        <span class="hidden text-[12px]/4 text-zinc-500 sm:inline">
          <kbd class="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px]/3 text-zinc-600">Ctrl</kbd>
          <kbd class="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px]/3 text-zinc-600">Enter</kbd>
        </span>
        <button type="button" x-ref="post" :disabled="!text.trim()"
                class="inline-flex h-8 shrink-0 items-center rounded-lg bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white disabled:bg-zinc-200 disabled:text-zinc-400">
          Post remark
        </button>
      </span>
    </div>
  </div>

  <p class="mt-1.5 text-[12px]/4 text-zinc-500">Goes on the receipt, visible to the buyer and to stores. It cannot be edited afterwards.</p>
</div>` },

      { id: 'error', name: 'Error on the enclosure', code:
`<!-- The red edge belongs to the wrapper, because the wrapper is the field. Put
     border-red-600 on the input and the rule is drawn round the number alone,
     leaving the unit select outside it in zinc — an error that looks like it
     belongs to one part of a value rather than to the value.

     The border stays red-600 while the group has focus. The obvious version,
     focus-within:border-zinc-700 left in place beside it, wipes the error the
     instant somebody clicks in to fix it, which is the one moment they are
     looking at it. Only the halo changes, from zinc-700/15 to red-600/15.

     aria-invalid is on the control that is wrong and on nothing else. Here the
     number is out of range and MT is the right unit, so the select is
     untouched; mark both and one mistake is reported as two.

     Nothing else inside goes red. The divider stays zinc-200 because it
     separates two controls and has no opinion about the value, and a red unit
     would read as the wrong unit the way a red ₹ reads as a negative amount.
     The red text is the message under the box, and it says the number it is
     comparing against — "invalid" tells nobody what to type instead. -->
<div data-kui="input-group/error" class="max-w-xl">
  <label for="ig8-qty" class="mb-1.5 block text-[13px]/5 font-medium">Receipt quantity <span class="text-red-600">*</span></label>

  <div class="flex items-stretch rounded-lg border border-red-600 bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15">
    <input id="ig8-qty" name="qty" inputmode="decimal" value="4,200.000"
           aria-invalid="true" aria-describedby="ig8-qty-err"
           class="min-w-0 flex-1 bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
    <label for="ig8-uom" class="sr-only">Unit of measure</label>
    <select id="ig8-uom" name="uom"
            class="shrink-0 rounded-r-[7px] border-l border-zinc-200 bg-transparent py-2 pr-2 pl-3 text-[14px]/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
      <option>MT</option>
      <option>kg</option>
    </select>
  </div>

  <p id="ig8-qty-err" class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
    <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>
    <span class="tabular-nums">Over PO-24-1187 by 4,157.500 MT. The order is for 42.500 MT and over-receipt is capped at 2%.</span>
  </p>
</div>` },

      { id: 'dense', name: 'In a table filter row', code:
`<!-- Dense means less padding, not a smaller target. py-1.5 against a 13px/5
     line takes the group to 34px, the same height the dense buttons in a
     register toolbar take, and that is still comfortably over the 24px WCAG 2.2
     asks for. Go below it and a native select has nowhere left to draw its
     chevron and starts clipping the option text instead.

     Nothing in a filter row has a visible label — the column headings under it
     are what name the filters — so every control carries an sr-only one. The
     magnifying glass is not a label and neither is the placeholder, which is
     gone the moment anybody types.

     The row wraps and never scrolls. flex-wrap with basis-56 on the search box
     gives three groups on a desktop and three full-width rows at 390px; a
     filter bar that scrolls sideways hides filters that are already applied,
     which is the one thing a filter bar must never do. min-w-0 is what lets the
     search box shrink at all — without it the input holds its intrinsic
     twenty-character width and pushes the row past the screen. -->
<div data-kui="input-group/dense" class="flex flex-wrap items-center gap-2">
  <div class="flex min-w-0 flex-1 basis-56 items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <label for="ig9-q" class="sr-only">Search the item ledger</label>
    <i data-lucide="search" aria-hidden="true" class="ml-2.5 size-4 shrink-0 self-center text-zinc-500"></i>
    <input id="ig9-q" type="text" placeholder="Item or vendor"
           class="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[13px]/5 outline-none placeholder:text-zinc-500">
  </div>

  <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <label for="ig9-min" class="sr-only">Minimum value in rupees</label>
    <span aria-hidden="true" class="flex items-center pl-2.5 text-[13px]/5 text-zinc-600">₹</span>
    <input id="ig9-min" name="min_value" inputmode="numeric" placeholder="Min"
           class="w-24 min-w-0 bg-transparent px-2 py-1.5 text-right text-[13px]/5 tabular-nums outline-none placeholder:text-zinc-500">
  </div>

  <div class="flex items-stretch rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <label for="ig9-qty" class="sr-only">Minimum quantity</label>
    <input id="ig9-qty" name="min_qty" inputmode="decimal" placeholder="Qty"
           class="w-20 min-w-0 bg-transparent px-2.5 py-1.5 text-right text-[13px]/5 tabular-nums outline-none placeholder:text-zinc-500">
    <label for="ig9-uom" class="sr-only">Unit of measure</label>
    <select id="ig9-uom" name="uom"
            class="shrink-0 rounded-r-[7px] border-l border-zinc-200 bg-zinc-100 py-1.5 pr-1.5 pl-2 text-[13px]/5 text-zinc-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-zinc-700">
      <option>MT</option>
      <option>kg</option>
      <option>nos</option>
    </select>
  </div>
</div>

<p class="mt-2 text-[12px]/4 tabular-nums text-zinc-500">1,438 ledger entries. Filters apply as they are typed.</p>` }
    ]
  },

  {
    id: 'select', name: 'Select', category: 'forms',
    description: 'One answer out of a short fixed list. A real <select>, styled through its wrapper the way an input is, and an Alpine listbox only for the rows an <option> cannot hold.',
    when: 'A field whose answer is one of a dozen known values — a status, a unit, a plant, a GST rate, a state, a payment term. The native element is the default and stays the default to about fifteen options: it submits, it binds to a Django ChoiceField, it gets the platform picker on a phone and typeahead on a desktop, and none of that is code you own. Move to the Alpine listbox in this entry only when the row has to carry something an <option> cannot hold — a second line, a status dot. The moment somebody has to type to find the value it is not a select at all, it is a combobox, and that entry is next door.',
    notes: [
      'The native <select> is the default, and the bar for replacing it is high. One element gives you form participation, a Django ChoiceField binding, the platform\'s own picker on a phone, desktop typeahead, the keyboard, forced-colours mode and a popup that is allowed to escape the viewport — none of which is yours to maintain. A hand-built listbox for eight states throws all of it away and buys sixty lines of keyboard handling that has to be right the first time. The three controls divide cleanly: a native select for a short list of strings, the Alpine listbox for a short list whose rows need more than a string, a combobox the moment the list is long enough that somebody has to type. Choosing by which one looks nicer is how a phone ends up with a 240px scrolling div where the OS wheel should have been.',
      'appearance-none is the whole styling trade and it comes with a chevron you now own. Leave appearance alone and the browser draws its own arrow, so a chevron of yours sits beside it and the control has two. Take appearance-none and the select has no arrow at all, so one is drawn on top of it — absolutely positioned inside the wrapper, with pr-9 on the select so a long vendor name never runs underneath. A select standing alone in a toolbar can legitimately keep the platform arrow and skip all of this; a select in a form takes appearance-none so it is the same object as the inputs above it.',
      'The drawn chevron must be pointer-events-none, on a wrapping span. It sits over the right end of the control, which is exactly where people click to open a select, so without it the click lands on the span and the list never opens — and the defect reads as "the dropdown only opens sometimes", because clicking the text still works. It goes on the span rather than on the <i data-lucide> for the same reason everything else does: createIcons() replaces the <i> with an <svg>, and a class on a span is one you never have to think about again.',
      'The border and the focus outline live on the wrapper, through focus-within, exactly as they do for an input. The select itself is transparent with outline-none, which is the one carve-out rule 8 allows — a field whose wrapper draws the outline for it. Put the border on the select instead and there is nothing for the chevron to be positioned against, invalid and disabled have to restyle three elements rather than one, and a form of mixed controls stops lining up because the select is measuring its own box and the input beside it is measuring a different one.',
      '<select> has no value attribute. The selected option is the one carrying selected, and <select value="{{ order.vendor_id }}"> parses, renders, passes review and does nothing at all — the field then posts whatever option happens to be first, which for a vendor list means every untouched order goes to whoever sorts first alphabetically. Server-side you put selected on the matching option; in script you set .value; in Alpine you use x-model. And x-model overwrites selected at boot, because Alpine writes the model into the control on init, so a value rendered by the server and an x-data initialised to something else disagree silently and the model wins.',
      'A placeholder option is value="" plus disabled plus selected, and the select is required. Each part does one job. The empty value is what lets required fire, because constraint validation counts an empty value as missing. selected is what makes it the initial state — leave it off and the browser selects the first enabled option, so a form nobody touched submits a real vendor and reads as though somebody chose it. disabled is what stops the user selecting it back once they have moved off. hidden drops the row out of the open list where it is honoured and is ignored where it is not, which is the only reason it is safe to write. A placeholder with a real value — "none", "0" — defeats required and leaves the server knowing that one of its own choices means no choice.',
      'You cannot style the option list, and the time spent trying is the single biggest waste on this component. An <option> holds text: HTML inside one is stripped to its characters, padding and radius do nothing, and on macOS and iOS the list is drawn by the operating system where even a background colour is ignored. Chromium\'s appearance: base-select changes this in one engine and needs CSS this system does not allow. If the row has to carry a second line, an icon or a coloured dot, that is the signal to move to the Alpine listbox — not to fight the platform, and not to fake a dot with a bullet character, which is announced as "black circle" and cannot take a colour anyway.',
      '<optgroup> is a heading, never a value. It is not selectable, it nests exactly one level, and it carries a label attribute and nothing else — no count, no icon, no second line. The placeholder option goes before the first group rather than inside one, or it becomes a member of that group and is announced as one. Wanting more out of the grouping than a single word is the same signal as wanting more out of the row: the native element has run out.',
      'readonly does nothing on a select. It parses, it looks right in the markup and it leaves a fully working control that anybody can change. The only lock is disabled, and a disabled control does not submit — so a read-only value that still has to reach the server needs a hidden input beside it, or, in Django, disabled=True on the form field, which makes the field ignore request.POST and clean from initial instead. That leaves the text colour to separate the two states the way it does on an input: zinc-900 for a value that still matters and still has to be read off the screen, zinc-400 for one that does not. The read-only box also drops the chevron, because an arrow promises a list that will not open.',
      'Never <select multiple>. Adding a second value needs ctrl-click or cmd-click, which nothing on screen says, and one ordinary click on a row wipes every other choice the user had made. Its height is fixed by the size attribute, so it either scrolls at six rows or takes over the form, and the selection cannot be read without scrolling the box — the answer to "which plants did I pick" is not on screen. Under about ten options the replacement is a checkbox group, where every choice and every state is visible at once and no modifier key is involved; above that it is a combobox multi with chips in the field. If one is inherited, Django needs MultipleChoiceField, whose widget reads the POST with getlist; a plain ChoiceField takes the last value and drops the rest without erroring.',
      'Nothing on the page can know whether a native select is open. There is no open event and no state to bind to, so a chevron that rotates on :focus is lying — the control stays focused after the list has closed, and the arrow then points up at nothing. Leave the drawn chevron still. Rotation belongs to the Alpine listbox, which owns the open flag and can tell the truth about it.',
      'The Alpine listbox moves real focus onto the option, one tabindex="-1" at a time, and draws the indicator with a plain :focus outline. That is the dropdown menu\'s model rather than the combobox\'s, and the difference is where focus has to live: a combobox keeps focus in its text box so typing keeps working, which forces it to point at a row with aria-activedescendant and to mint a stable id for every option — the two things the combobox entry documents most carefully. A select has no text box, so the option itself can be the focused thing, .focus() scrolls it into view inside the scrolling panel for nothing, and the outline is a real focus outline that no code has to remember to paint. It also has to reimplement typeahead, or it is strictly worse than the element it replaced: typing "gu" on a focused native select jumps to Gujarat Polymers, and on a hand-built listbox it does nothing at all — a loss that never shows up in review because everyone testing it is using a mouse.'
    ],
    anatomy: [
      ['Wrapper', 'The bordered box, relative so the chevron has something to be positioned against. It owns the border, the focus outline through focus-within, and the restyle for invalid and disabled — one element, not three.'],
      ['Select', 'The real control. appearance-none, transparent, outline-none because the wrapper draws the outline for it, and pr-9 so the value never runs under the chevron. name, required and disabled all live here.'],
      ['Chevron', 'A 16px Lucide icon inside an absolutely positioned pointer-events-none span, inset-y-0 so it centres regardless of the control height. Decorative, aria-hidden, and it never rotates.'],
      ['Placeholder option', 'value="" disabled selected hidden, before the first optgroup. It is the thing required tests, not a label — the label is a real <label for>.'],
      ['Option group', 'An <optgroup label="…">. One level, never selectable, text only. A group that needs a count or an icon is the signal to leave the native element.'],
      ['Help text or error', 'A 12px line under the box, pointed at with aria-describedby. The error replaces the help text rather than stacking under it, so the block keeps its height.'],
      ['Trigger', 'The Alpine listbox only: a button carrying the current value and the chevron, aria-haspopup="listbox", aria-expanded bound to the open flag, and named by aria-labelledby because a <label for> does not name a button. The hidden input beside it is what posts.'],
      ['Option row', 'The Alpine listbox only: role="option" with tabindex="-1", aria-selected on the committed value alone, data-value and data-label for the keyboard to read, and everything past the first line aria-hidden under an explicit aria-label.']
    ],
    behaviour: [
      'A native select opens the platform\'s own control — a popup list on a desktop, a wheel or a sheet on a phone. Nothing on the page draws it, nothing can position it, nothing can style it and nothing can tell when it closed.',
      'Typing on a focused native select jumps to the first option starting with those letters, and pressing the same letter again cycles through the ones that share it. It is free, it is why a list of eight states needs nothing else, and it is the first thing a hand-built replacement loses.',
      'A filter select applies on change. There is no Apply button, for the same reason a settings switch has no Save: put one there and half the users press it and half do not, and the two groups get different lists out of the same gesture.',
      'The Alpine listbox opens onto the option that is already selected rather than the first, so the list starts where the value is. Arrow keys move real focus and clamp at both ends, Home and End jump to them, Enter or Space commits, Escape closes and returns focus to the trigger, Tab closes and moves on.',
      'Typeahead in the Alpine listbox mirrors the native one: a buffer that clears after 600ms, the same letter twice cycling through the options that start with it, and a search that wraps round the end of the list even though the arrow keys clamp — a search that clamped would find nothing for "r" while the focus sat at the bottom.',
      'Committing closes the popup, writes the label into the trigger and puts focus back on it. A single-select popup that stays open after a choice reads as a click that was missed.',
      'The child of a cascade is cleared before it is refilled and stays disabled until its parent has a value. A child still holding the previous parent\'s options posts a rate contract belonging to a different vendor, and nothing catches it until the server does.',
      'Disabled and read-only both refuse the pointer and neither submits on its own. Only the text colour tells them apart, and the read-only one carries a hidden input so its value still reaches the server.',
      'At 390px every select is full width with the chevron inside it, and a filter row becomes a two-column grid rather than a strip that scrolls sideways.'
    ],
    a11y: [
      'Every select has a real <label for>. A placeholder option is not a label: it disappears the moment anything is chosen, and it is never read as the name of the field.',
      'Help text and errors are real elements pointed at with aria-describedby, and an invalid select carries aria-invalid="true". Never a title attribute, and never Tailwind\'s invalid: variant on a required select — :invalid matches from first paint, so a blank form comes up red before anybody has done anything wrong.',
      'A native select needs nothing else. Its role, its value, its expanded state and its whole keyboard come from the element, and every aria-* attribute added on top of it is either a duplicate or a lie waiting to go stale.',
      'A <label for> does not contribute to the accessible name of a <button>, so the Alpine listbox names its trigger with aria-labelledby pointing at two ids — the field name and the element holding the current value. Left as a plain label, twelve of these on one form all announce as "Gujarat Polymers Ltd, button" with nothing saying which field is which.',
      'The popup is role="listbox" with an accessible name, every row is role="option", and aria-selected marks the committed value only. Focus is real focus, roving with tabindex="-1", because there is no text box that focus has to stay in.',
      'A two-line row takes an explicit aria-label and everything decorative inside it is aria-hidden, or the row is read as one run: the vendor name, then a GSTIN spelled out character by character, then a date.',
      'The status dot is aria-hidden and the status word is in the label. Colour is not a name, and in forced-colours mode the dot is the first thing to go.',
      'The result count on a filter bar is a role="status" that was in the document before the number changed. A live region rendered inside an x-show block with its text already in it announces nothing on the one change that mattered.'
    ],
    related: ['combobox', 'field', 'dropdown'],
    variants: [
      { id: 'default', name: 'Native select', code:
`<!-- appearance-none is the whole trade. Leave it off and the browser draws its
     own arrow, so a chevron of yours sits beside it and the control has two.
     Take it and the select has no arrow at all, so one is drawn on top —
     absolutely positioned against the wrapper, with pr-9 on the select so a
     long vendor name never runs underneath.

     The chevron span carries pointer-events-none. It sits over the right end of
     the control, which is exactly where people click to open a select, and
     without it the click lands on the span and nothing happens. The defect
     reads as "the dropdown only opens sometimes", because clicking the text
     still works. It goes on the wrapping span rather than the <i>, because
     createIcons() replaces the <i> with an <svg> and a class on a span is one
     nobody has to think about again.

     inset-y-0 with flex items-center rather than a top-1/2 translate: it
     centres at any control height without knowing what that height is.

     The border and the focus outline live on the wrapper as they do for an
     input, so this and the fields above it are the same object at the same
     height. outline-none on the select is the carve-out rule 8 allows. -->
<div data-kui="select/default" class="max-w-sm">
  <label for="sel-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor <span class="text-red-600">*</span></label>

  <div class="relative rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <!-- the value is the option carrying selected. There is no value attribute
         on <select>: written there it renders, it validates, and it does
         nothing, and the field posts whichever option came first. -->
    <select id="sel-vendor" name="vendor" required aria-describedby="sel-vendor-help"
            class="block w-full min-w-0 appearance-none bg-transparent py-2 pr-9 pl-3 text-[14px]/5 outline-none">
      <option value="gujarat-polymers" selected>Gujarat Polymers Ltd</option>
      <option value="sharma-extrusions">Sharma Extrusions</option>
      <option value="nashik-steel">Nashik Steel Traders</option>
      <option value="deccan-fasteners">Deccan Fasteners Pvt Ltd</option>
      <option value="konkan-chemicals">Konkan Chemicals Pvt Ltd</option>
      <option value="baroda-fasteners">Baroda Fasteners</option>
    </select>

    <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-600">
      <i data-lucide="chevron-down" class="size-4"></i>
    </span>
  </div>

  <p id="sel-vendor-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">
    Six vendors hold a live rate contract for this item. Typing g on the focused control jumps to Gujarat.
  </p>
</div>` },

      { id: 'groups', name: 'Groups and a placeholder', code:
`<!-- Four attributes on one option and each does exactly one job.

     value="" is what lets required fire, because constraint validation counts
     an empty value as missing. selected is what makes it the initial state —
     leave it off and the browser selects the first enabled option instead, so
     a form nobody touched posts HDPE granules and reads as though somebody
     chose them. disabled is what stops anyone selecting it back once they have
     moved off it. hidden drops the row out of the open list where it is
     honoured and is ignored where it is not, which is the only reason it is
     safe to write at all.

     A placeholder with a real value — "none", "0" — defeats required and leaves
     the server knowing that one of its own choices means no choice.

     The placeholder sits before the first optgroup, not inside one. Inside, it
     is a member of Polymers and is announced as one.

     <optgroup> is a heading and never a value. One level, a label attribute and
     nothing else: no count, no icon, no second line. Wanting any of those is
     the signal to move to the listbox variants below. -->
<div data-kui="select/groups" class="max-w-sm">
  <label for="sel-item" class="mb-1.5 block text-[13px]/5 font-medium">Item <span class="text-red-600">*</span></label>

  <div class="relative rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <select id="sel-item" name="item" required aria-describedby="sel-item-help"
            class="block w-full min-w-0 appearance-none bg-transparent py-2 pr-9 pl-3 text-[14px]/5 outline-none">
      <option value="" disabled selected hidden>Choose an item</option>

      <optgroup label="Polymers">
        <option value="ITM-1042">HDPE granules — natural</option>
        <option value="ITM-1078">LDPE granules — 22FA002</option>
        <option value="ITM-1091">Masterbatch — white 60%</option>
      </optgroup>

      <optgroup label="Fasteners">
        <option value="ITM-3310">M12 hex bolt — 8.8 zinc</option>
        <option value="ITM-3344">M12 nylock nut — 8.8 zinc</option>
      </optgroup>

      <optgroup label="Packaging">
        <option value="ITM-5120">HDPE liner — 25 kg</option>
        <option value="ITM-5140">Stretch film — 23 micron</option>
      </optgroup>
    </select>

    <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-600">
      <i data-lucide="chevron-down" class="size-4"></i>
    </span>
  </div>

  <p id="sel-item-help" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">
    Seven items across three groups. Above about fifteen this becomes a combobox, because the answer stops being findable by scrolling.
  </p>
</div>` },

      { id: 'states', name: 'Disabled, read-only, invalid', code:
`<!-- readonly does nothing on a select. It parses, it looks right in the markup,
     and it leaves a fully working control that anybody can change. The only
     lock is disabled — and a disabled control does not submit, so a read-only
     value that still has to reach the server needs a hidden input beside it.

     Which leaves the text colour to separate the two, exactly as it does on an
     input: zinc-900 for a value that still matters and still has to be read off
     the screen, zinc-400 for one that does not. Both sit on bg-zinc-100 with no
     focus outline, because neither can be operated.

     The read-only box drops the chevron and takes pr-3 back. An arrow says a
     list will open; this one will not, and the box then reads as a control that
     broke rather than as a field with its answer already in it.

     Invalid is drawn on the wrapper and announced by the select: aria-invalid
     plus aria-describedby pointing at the error paragraph, which replaces the
     help text rather than stacking under it. Do not reach for the invalid:
     variant here — :invalid matches from first paint, so every required select
     on a blank form comes up red before anybody has done anything wrong. -->
<div data-kui="select/states" class="max-w-sm space-y-6">

  <div>
    <label for="sel-off" class="mb-1.5 block text-[13px]/5 font-medium text-zinc-500">Currency</label>
    <div class="relative rounded-lg border border-zinc-200 bg-zinc-100">
      <select id="sel-off" name="currency" disabled aria-describedby="sel-off-help"
              class="block w-full min-w-0 appearance-none bg-transparent py-2 pr-9 pl-3 text-[14px]/5 text-zinc-400 outline-none">
        <option selected>INR — Indian rupee</option>
      </select>
      <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
        <i data-lucide="chevron-down" class="size-4"></i>
      </span>
    </div>
    <p id="sel-off-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Domestic orders are raised in rupees. There is nothing else to pick.</p>
  </div>

  <div>
    <label for="sel-ro" class="mb-1.5 block text-[13px]/5 font-medium">Plant</label>
    <!-- no chevron, so no pr-9 and nothing to position: a plain bordered box -->
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">
      <select id="sel-ro" disabled aria-describedby="sel-ro-help"
              class="block w-full min-w-0 appearance-none bg-transparent px-3 py-2 text-[14px]/5 text-zinc-900 outline-none">
        <option selected>Silvassa — Unit II</option>
      </select>
    </div>
    <!-- the disabled control posts nothing, so the value travels here -->
    <input type="hidden" name="plant" value="silvassa-2">
    <p id="sel-ro-help" class="mt-1.5 tabular-nums text-[12px]/4 text-zinc-500">Fixed when GRN-24-0912 was posted against this order.</p>
  </div>

  <div>
    <label for="sel-bad" class="mb-1.5 block text-[13px]/5 font-medium">Payment terms <span class="text-red-600">*</span></label>
    <div class="relative rounded-lg border border-red-600 bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15">
      <select id="sel-bad" name="terms" required aria-invalid="true" aria-describedby="sel-bad-err"
              class="block w-full min-w-0 appearance-none bg-transparent py-2 pr-9 pl-3 text-[14px]/5 outline-none">
        <option value="" disabled selected hidden>Choose payment terms</option>
        <option value="advance">100% advance</option>
        <option value="net-30">Net 30 days</option>
        <option value="net-60">Net 60 days</option>
        <option value="net-90">Net 90 days</option>
      </select>
      <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-600">
        <i data-lucide="chevron-down" class="size-4"></i>
      </span>
    </div>
    <p id="sel-bad-err" class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
      <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>
      Gujarat Polymers Ltd is on Net 30 in its rate contract. Anything longer needs finance to approve it.
    </p>
  </div>
</div>` },

      { id: 'multiple', name: 'Native multiple, and what replaces it', code:
`<!-- This one is here so it can be refused with the reasons to hand.

     A native multiple select needs ctrl-click or cmd-click to add a second
     value, which nothing on screen says, and one ordinary click on a row wipes
     everything else the user had picked. Its height is the size attribute, so
     it either scrolls at six rows or takes over the form. And the selection can
     only be read by scrolling the box, so the answer to "which plants did I
     pick" is not on screen at the moment it is being asked.

     appearance-none does almost nothing here — a multiple select is already a
     list box rather than a popup — so the border goes straight on the element,
     the focus outline with it, and there is no chevron and no wrapper to hang
     one on. That is the one place in this entry where the wrapper is wrong.

     Under about ten options the replacement is a checkbox group: every choice
     and every state visible at once, no modifier key, and the same name
     repeated. Above ten it is a combobox multi with chips in the field. Both
     post the same shape, so it is a template change and not a data one, and
     Django needs MultipleChoiceField either way — its widget reads the POST
     with getlist, and a plain ChoiceField takes the last value and silently
     drops the rest. -->
<div data-kui="select/multiple" class="max-w-sm space-y-6">

  <div>
    <label for="sel-multi" class="mb-1.5 block text-[13px]/5 font-medium">Plants — the control to avoid</label>
    <select id="sel-multi" name="plant_native" multiple size="5" aria-describedby="sel-multi-help"
            class="block w-full min-w-0 rounded-lg border border-zinc-200 bg-white px-1 py-1 text-[14px]/5 focus:border-zinc-700 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">
      <option value="silvassa-1" selected>Silvassa — Unit I</option>
      <option value="silvassa-2">Silvassa — Unit II</option>
      <option value="vadodara">Vadodara</option>
      <option value="nashik">Nashik</option>
      <option value="coimbatore">Coimbatore</option>
      <option value="rajkot">Rajkot</option>
    </select>
    <p id="sel-multi-help" class="mt-1.5 text-[12px]/4 text-zinc-500">
      Nothing here says that a plain click discards the other five, and nothing here shows the selection once the box has scrolled.
    </p>
  </div>

  <fieldset class="border-t border-zinc-200 pt-5">
    <legend class="mb-2 text-[13px]/5 font-medium">Plants — what to write instead</legend>
    <div class="space-y-2">
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="checkbox" name="plant" value="silvassa-1" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Silvassa — Unit I</span>
      </label>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="checkbox" name="plant" value="silvassa-2" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Silvassa — Unit II</span>
      </label>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="checkbox" name="plant" value="vadodara" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Vadodara</span>
      </label>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="checkbox" name="plant" value="nashik" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Nashik</span>
      </label>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="checkbox" name="plant" value="coimbatore" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Coimbatore</span>
      </label>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="checkbox" name="plant" value="rajkot" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Rajkot</span>
      </label>
    </div>
    <p class="mt-2 text-[12px]/4 text-zinc-500">Six boxes, six states, no modifier key, and request.POST.getlist reads it exactly the same way.</p>
  </fieldset>
</div>` },

      { id: 'filter', name: 'Dense, in a filter bar', code:
`<!-- A filter select applies on change. There is no Apply button, for the same
     reason a settings switch has no Save: put one there and half the users
     press it and half do not, and the two groups get different lists out of the
     same gesture.

     The empty option here is a real choice, not a placeholder. "All statuses"
     is selectable and carries no disabled, because clearing a filter is a thing
     people do; a form field\'s placeholder is the opposite. Confuse the two and
     you get either a filter that cannot be cleared or a form that submits its
     own prompt.

     Dense is 34px — py-1.5 on 13px/5 text, chevron at right-2.5 and pr-8. It is
     the only second size, and it exists because a filter row sits above a table
     of 13px cells where a 38px control is taller than everything around it.

     The count is the confirmation, so it is a role="status" in the document
     from first paint — a live region rendered inside an x-show block, with its
     text already in it, announces nothing on the change that mattered. It is
     visible text rather than sr-only because a filter bar owes the number to
     everybody.

     At 390px the three selects are a two-column grid, not a row that scrolls.
     min-w-0 on each, or a long vendor name pushes the grid past the viewport. -->
<div data-kui="select/filter" x-data="{
       status: '', vendor: '', plant: '',
       orders: [
         { no: 'PO-24-1187', vendor: 'gujarat-polymers', vname: 'Gujarat Polymers Ltd', plant: 'silvassa', status: 'overdue', amount: '₹18,42,000', due: '02 Aug 2026' },
         { no: 'PO-24-1192', vendor: 'sharma-extrusions', vname: 'Sharma Extrusions', plant: 'silvassa', status: 'open', amount: '₹4,68,500', due: '28 Aug 2026' },
         { no: 'PO-24-1203', vendor: 'gujarat-polymers', vname: 'Gujarat Polymers Ltd', plant: 'nashik', status: 'approved', amount: '₹96,750', due: '31 Aug 2026' },
         { no: 'PO-24-1211', vendor: 'nashik-steel', vname: 'Nashik Steel Traders', plant: 'nashik', status: 'open', amount: '₹2,14,300', due: '04 Sep 2026' },
         { no: 'PO-24-1218', vendor: 'konkan-chemicals', vname: 'Konkan Chemicals Pvt Ltd', plant: 'vadodara', status: 'closed', amount: '₹1,32,900', due: '19 Aug 2026' },
         { no: 'PO-24-1224', vendor: 'sharma-extrusions', vname: 'Sharma Extrusions', plant: 'vadodara', status: 'overdue', amount: '₹7,80,000', due: '11 Aug 2026' },
         { no: 'PO-24-1231', vendor: 'nashik-steel', vname: 'Nashik Steel Traders', plant: 'silvassa', status: 'approved', amount: '₹55,400', due: '06 Sep 2026' },
         { no: 'PO-24-1240', vendor: 'konkan-chemicals', vname: 'Konkan Chemicals Pvt Ltd', plant: 'nashik', status: 'open', amount: '₹12,05,600', due: '14 Sep 2026' }
       ],
       get rows() {
         return this.orders.filter(o =>
           (!this.status || o.status === this.status) &&
           (!this.vendor || o.vendor === this.vendor) &&
           (!this.plant || o.plant === this.plant));
       },
       get applied() { return [this.status, this.vendor, this.plant].filter(Boolean).length; },
       clear() { this.status = ''; this.vendor = ''; this.plant = ''; },
       dot(s) { return { overdue: 'bg-red-600', approved: 'bg-amber-500', closed: 'bg-emerald-600', open: 'bg-zinc-500' }[s]; },
       name(s) { return { overdue: 'Overdue', approved: 'Approved', closed: 'Closed', open: 'Open' }[s]; }
     }">

  <div class="rounded-xl border border-zinc-200 bg-white px-3 py-3">
    <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">

      <div class="min-w-0">
        <label for="sf-status" class="sr-only">Status</label>
        <div class="relative rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="sf-status" x-model="status"
                  class="block w-full min-w-0 appearance-none bg-transparent py-1.5 pr-8 pl-2.5 text-[13px]/5 outline-none">
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="approved">Approved</option>
            <option value="overdue">Overdue</option>
            <option value="closed">Closed</option>
          </select>
          <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-zinc-600">
            <i data-lucide="chevron-down" class="size-3.5"></i>
          </span>
        </div>
      </div>

      <div class="min-w-0">
        <label for="sf-vendor" class="sr-only">Vendor</label>
        <div class="relative rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="sf-vendor" x-model="vendor"
                  class="block w-full min-w-0 appearance-none bg-transparent py-1.5 pr-8 pl-2.5 text-[13px]/5 outline-none">
            <option value="">All vendors</option>
            <option value="gujarat-polymers">Gujarat Polymers Ltd</option>
            <option value="sharma-extrusions">Sharma Extrusions</option>
            <option value="nashik-steel">Nashik Steel Traders</option>
            <option value="konkan-chemicals">Konkan Chemicals Pvt Ltd</option>
          </select>
          <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-zinc-600">
            <i data-lucide="chevron-down" class="size-3.5"></i>
          </span>
        </div>
      </div>

      <div class="col-span-2 min-w-0 sm:col-span-1">
        <label for="sf-plant" class="sr-only">Plant</label>
        <div class="relative rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
          <select id="sf-plant" x-model="plant"
                  class="block w-full min-w-0 appearance-none bg-transparent py-1.5 pr-8 pl-2.5 text-[13px]/5 outline-none">
            <option value="">All plants</option>
            <option value="silvassa">Silvassa</option>
            <option value="nashik">Nashik</option>
            <option value="vadodara">Vadodara</option>
          </select>
          <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-zinc-600">
            <i data-lucide="chevron-down" class="size-3.5"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-zinc-100 pt-2.5">
      <p role="status" class="text-[12px]/4 tabular-nums text-zinc-600"
         x-text="rows.length === orders.length
                   ? orders.length + ' purchase orders'
                   : rows.length + ' of ' + orders.length + ' purchase orders'"></p>
      <button type="button" x-show="applied" x-cloak @click="clear()"
              class="text-[12px]/4 tabular-nums text-zinc-900 underline underline-offset-2">
        Clear <span x-text="applied"></span> filters
      </button>
    </div>
  </div>

  <div class="mt-3 divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
    <template x-for="o in rows" :key="o.no">
      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-2.5">
        <div class="min-w-0">
          <p class="text-[13px]/5 font-medium tabular-nums" x-text="o.no"></p>
          <p class="mt-0.5 truncate text-[12px]/4 text-zinc-500" x-text="o.vname"></p>
        </div>
        <div class="flex shrink-0 items-center gap-2.5">
          <span class="text-[13px]/5 tabular-nums" x-text="o.amount"></span>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[11px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full" :class="dot(o.status)"></span>
            <span x-text="name(o.status)"></span>
          </span>
        </div>
      </div>
    </template>

    <div x-show="!rows.length" x-cloak class="px-4 py-6 text-center">
      <p class="text-[13px]/5 font-medium">No purchase order matches these filters</p>
      <p class="mt-1 tabular-nums text-[12px]/4 text-zinc-500">Clear one of the three and eight orders come back.</p>
    </div>
  </div>
</div>` },

      { id: 'rich', name: 'Listbox with two-line rows', code:
`<!-- The case the native element cannot reach. An <option> holds text and
     nothing else — HTML inside one is stripped to its characters — and a second
     line is what tells two vendors called Sharma apart.

     The keyboard moves real focus onto the option, tabindex="-1" at a time, and
     the indicator is a plain :focus outline. That is the dropdown menu\'s model
     rather than the combobox\'s, and the difference is where focus has to live:
     a combobox keeps focus in its text box so typing keeps working, which
     forces it to point at a row with aria-activedescendant and to mint a stable
     id per option. A select has no text box, so the option can be the focused
     thing — .focus() scrolls it into view inside the panel for free, and the
     outline is real, with a negative offset because the list scrolls.

     Typeahead is not optional. Typing gu on a focused native select jumps to
     Gujarat; a hand-built listbox that drops that is worse than what it
     replaced, and nobody notices in review because everyone is using a mouse.
     The buffer clears after 600ms, the same letter twice cycles, and the search
     wraps although the arrows clamp — clamped, r finds nothing from the bottom.

     A <label for> does not name a <button>, so the label is a span and the
     trigger takes aria-labelledby with two ids. The trigger shows one line: the
     second belongs to the list, and in the closed control it makes every field
     in the form a different height. -->
<div data-kui="select/rich" class="relative max-w-md"
     x-data="{
       open: false, sel: 'sharma-extrusions', buf: '', timer: null,
       options: [
         { id: 'gujarat-polymers', label: 'Gujarat Polymers Ltd', code: 'VEN-0142', gstin: '24AABCG1122F1Z8' },
         { id: 'sharma-extrusions', label: 'Sharma Extrusions', code: 'VEN-0187', gstin: '27AABCS9012K1Z5' },
         { id: 'sharma-polymers', label: 'Sharma Polymers and Compounds', code: 'VEN-0192', gstin: '24AABCS4471D1ZM' },
         { id: 'nashik-steel', label: 'Nashik Steel Traders', code: 'VEN-0203', gstin: '27AACCN4455P1ZR' },
         { id: 'deccan-fasteners', label: 'Deccan Fasteners Pvt Ltd', code: 'VEN-0219', gstin: '27AAECD7788M1ZT' },
         { id: 'konkan-chemicals', label: 'Konkan Chemicals Pvt Ltd', code: 'VEN-0244', gstin: '27AAGCK2266H1ZW' },
         { id: 'coimbatore-castings', label: 'Coimbatore Castings Ltd', code: 'VEN-0266', gstin: '33AAJCC8811N1ZD' }
       ],
       get chosen() { return this.options.find(o => o.id === this.sel) || null; },
       rows() { return [...this.$refs.list.querySelectorAll('[role=option]')]; },
       show(last = false) {
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => {
           const r = this.rows();
           const at = r.findIndex(el => el.dataset.value === this.sel);
           (at > -1 ? r[at] : (last ? r[r.length - 1] : r[0]))?.focus();
         }));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false; this.buf = '';
         if (toTrigger) this.$refs.trigger.focus();
       },
       move(step) {
         const r = this.rows(), at = r.indexOf(document.activeElement);
         r[Math.min(r.length - 1, Math.max(0, at + step))]?.focus();
       },
       edge(last) { const r = this.rows(); (last ? r[r.length - 1] : r[0])?.focus(); },
       take(el) { if (!el) return; this.sel = el.dataset.value; this.close(); },
       commit() { const a = document.activeElement; if (a) this.take(a.closest('[role=option]')); },
       type(k) {
         clearTimeout(this.timer);
         this.timer = setTimeout(() => { this.buf = ''; }, 600);
         this.buf += k.toLowerCase();
         const r = this.rows(), at = r.indexOf(document.activeElement);
         const from = this.buf.length > 1 ? Math.max(at, 0) : at + 1;
         for (let i = 0; i < r.length; i++) {
           const el = r[(from + i) % r.length];
           if (el.dataset.label.toLowerCase().startsWith(this.buf)) { el.focus(); return; }
         }
       }
     }"
     @click.outside="close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }">

  <span id="lb-vendor-label" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</span>

  <button type="button" x-ref="trigger" aria-haspopup="listbox" :aria-expanded="open"
          aria-labelledby="lb-vendor-label lb-vendor-value"
          @click="open ? close(false) : show()"
          @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
          class="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white py-2 pr-2.5 pl-3 text-left focus-visible:border-zinc-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <span class="flex min-w-0 flex-1 items-baseline gap-2">
      <span id="lb-vendor-value" class="min-w-0 truncate text-[14px]/5" x-text="chosen ? chosen.label : 'Choose a vendor'"></span>
      <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500" x-text="chosen ? chosen.code : ''"></span>
    </span>
    <span class="flex shrink-0 transition-transform motion-reduce:transition-none" :class="open && 'rotate-180'">
      <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
    </span>
  </button>

  <!-- what actually posts. The field is still a ChoiceField on the server; only
       the widget changed, and only the server can say whether the id is real. -->
  <input type="hidden" name="vendor" :value="sel">

  <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Seven approved vendors. The GSTIN is on the row because two of them are called Sharma.</p>

  <div x-show="open" x-cloak
       class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

    <div x-ref="list" role="listbox" aria-labelledby="lb-vendor-label"
         class="max-h-72 overflow-y-auto py-1"
         @click="take($event.target.closest('[role=option]'))"
         @keydown.arrow-down.prevent="move(1)"
         @keydown.arrow-up.prevent="move(-1)"
         @keydown.home.prevent="edge(false)"
         @keydown.end.prevent="edge(true)"
         @keydown.enter.prevent="commit()"
         @keydown.space.prevent="buf ? type(' ') : commit()"
         @keydown.tab="close(false)"
         @keydown="if ($event.key.length === 1 && $event.key !== ' ' && !$event.ctrlKey && !$event.metaKey && !$event.altKey) { $event.preventDefault(); type($event.key) }">

      <template x-for="o in options" :key="o.id">
        <!-- the whole row gets one aria-label. Left alone it is read as a single
             run: the name, then a GSTIN spelled out character by character. The
             label is the name and the code; the rest is aria-hidden and stays on
             screen for the people reading it. -->
        <div role="option" tabindex="-1" :data-value="o.id" :data-label="o.label"
             :aria-selected="o.id === sel" :aria-label="o.label + ', ' + o.code"
             class="flex items-start gap-3 px-3 py-2 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <span class="min-w-0 flex-1" aria-hidden="true">
            <span class="flex items-baseline justify-between gap-3">
              <span class="min-w-0 truncate text-[13px]/5 font-medium" x-text="o.label"></span>
              <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500" x-text="o.code"></span>
            </span>
            <span class="mt-0.5 block truncate font-mono text-[12px]/4 text-zinc-500" x-text="o.gstin"></span>
          </span>
          <span class="mt-0.5 flex size-4 shrink-0 items-center justify-center" x-show="o.id === sel" x-cloak>
            <i data-lucide="check" class="size-4 text-zinc-600"></i>
          </span>
        </div>
      </template>
    </div>
  </div>
</div>` },

      { id: 'status', name: 'Listbox with a status dot', code:
`<!-- The dot is the entire reason this is not a native select. An <option>
     holds text, so the only way to get a mark into one is a character —
     "● Rejected" — which is announced as "black circle, Rejected" and whose
     colour cannot be set at all. That is the boundary, not a limitation to
     work around.

     Colour lives in the dot and nowhere else, and the dot is aria-hidden: the
     status word is already in the label, and a 6px disc is not a name. Drop the
     word and keep the colour and the field says nothing to anybody reading it
     without colour vision, in forced-colours mode, or out loud.

     The trigger repeats the dot so the closed control carries the same fact as
     the open list, and its accessible name still comes from the two ids in
     aria-labelledby rather than from anything inside the button.

     Same keyboard as the vendor list: roving real focus, Home and End, Enter or
     Space to commit, Escape back to the trigger, and a typeahead buffer that
     clears after 600ms so r jumps to Rejected the way it would have in the
     element this replaced.

     Ticks drawn inside template x-for do not exist when createIcons() first
     runs, so the page needs the guarded re-hydration loop or they come up
     empty. The x-show goes on the wrapping span, never on the <i>. -->
<div data-kui="select/status" class="relative max-w-sm"
     x-data="{
       open: false, sel: 'accepted', buf: '', timer: null,
       options: [
         { id: 'accepted', label: 'Accepted', dot: 'bg-emerald-600', note: 'Goes to stock' },
         { id: 'deviation', label: 'Accepted with deviation', dot: 'bg-amber-500', note: 'Needs QA sign-off' },
         { id: 'rejected', label: 'Rejected', dot: 'bg-red-600', note: 'Debit note raised' },
         { id: 'lab', label: 'Awaiting lab', dot: 'bg-zinc-400', note: 'Held in quarantine' }
       ],
       get chosen() { return this.options.find(o => o.id === this.sel) || null; },
       rows() { return [...this.$refs.list.querySelectorAll('[role=option]')]; },
       show(last = false) {
         this.open = true;
         this.$nextTick(() => requestAnimationFrame(() => {
           const r = this.rows();
           const at = r.findIndex(el => el.dataset.value === this.sel);
           (at > -1 ? r[at] : (last ? r[r.length - 1] : r[0]))?.focus();
         }));
       },
       close(toTrigger = true) {
         if (!this.open) return;
         this.open = false; this.buf = '';
         if (toTrigger) this.$refs.trigger.focus();
       },
       move(step) {
         const r = this.rows(), at = r.indexOf(document.activeElement);
         r[Math.min(r.length - 1, Math.max(0, at + step))]?.focus();
       },
       edge(last) { const r = this.rows(); (last ? r[r.length - 1] : r[0])?.focus(); },
       take(el) { if (!el) return; this.sel = el.dataset.value; this.close(); },
       commit() { const a = document.activeElement; if (a) this.take(a.closest('[role=option]')); },
       type(k) {
         clearTimeout(this.timer);
         this.timer = setTimeout(() => { this.buf = ''; }, 600);
         this.buf += k.toLowerCase();
         const r = this.rows(), at = r.indexOf(document.activeElement);
         const from = this.buf.length > 1 ? Math.max(at, 0) : at + 1;
         for (let i = 0; i < r.length; i++) {
           const el = r[(from + i) % r.length];
           if (el.dataset.label.toLowerCase().startsWith(this.buf)) { el.focus(); return; }
         }
       }
     }"
     @click.outside="close(false)"
     @keydown.escape="if (open) { $event.stopPropagation(); close() }">

  <span id="lb-qc-label" class="mb-1.5 block text-[13px]/5 font-medium tabular-nums">QC disposition — GRN-24-0912, line 3</span>

  <button type="button" x-ref="trigger" aria-haspopup="listbox" :aria-expanded="open"
          aria-labelledby="lb-qc-label lb-qc-value"
          @click="open ? close(false) : show()"
          @keydown.arrow-down.prevent="show()" @keydown.arrow-up.prevent="show(true)"
          class="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white py-2 pr-2.5 pl-3 text-left focus-visible:border-zinc-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
    <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full" :class="chosen ? chosen.dot : 'bg-zinc-400'"></span>
    <span id="lb-qc-value" class="min-w-0 flex-1 truncate text-[14px]/5" x-text="chosen ? chosen.label : 'Not dispositioned'"></span>
    <span class="flex shrink-0 transition-transform motion-reduce:transition-none" :class="open && 'rotate-180'">
      <i data-lucide="chevron-down" class="size-4 text-zinc-600"></i>
    </span>
  </button>

  <input type="hidden" name="disposition" :value="sel">

  <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">450 kg of HDPE granules — natural, received 16 Aug 2026 against PO-24-1187.</p>

  <div x-show="open" x-cloak
       class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

    <div x-ref="list" role="listbox" aria-labelledby="lb-qc-label"
         class="max-h-72 overflow-y-auto py-1"
         @click="take($event.target.closest('[role=option]'))"
         @keydown.arrow-down.prevent="move(1)"
         @keydown.arrow-up.prevent="move(-1)"
         @keydown.home.prevent="edge(false)"
         @keydown.end.prevent="edge(true)"
         @keydown.enter.prevent="commit()"
         @keydown.space.prevent="buf ? type(' ') : commit()"
         @keydown.tab="close(false)"
         @keydown="if ($event.key.length === 1 && $event.key !== ' ' && !$event.ctrlKey && !$event.metaKey && !$event.altKey) { $event.preventDefault(); type($event.key) }">

      <template x-for="o in options" :key="o.id">
        <div role="option" tabindex="-1" :data-value="o.id" :data-label="o.label"
             :aria-selected="o.id === sel" :aria-label="o.label + ' — ' + o.note"
             class="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-700">
          <span aria-hidden="true" class="size-1.5 shrink-0 rounded-full" :class="o.dot"></span>
          <span class="min-w-0 flex-1 truncate text-[13px]/5" aria-hidden="true" x-text="o.label"></span>
          <span class="shrink-0 text-[12px]/4 text-zinc-500" aria-hidden="true" x-text="o.note"></span>
          <span class="flex size-4 shrink-0 items-center justify-center" x-show="o.id === sel" x-cloak>
            <i data-lucide="check" class="size-4 text-zinc-600"></i>
          </span>
        </div>
      </template>
    </div>
  </div>
</div>` },

      { id: 'cascade', name: 'Options loaded by htmx', code:
`<!-- The child select\'s options come from the server because the parent\'s value
     decides them. htmx needs no hx-include: an element that triggers a request
     contributes its own value.

     hx-target is the child <select> with hx-swap="innerHTML", so the fragment
     is nothing but <option> rows. Target the wrapper instead and the server has
     to re-send the border, the chevron and the label, and the two copies of
     that markup drift apart within a month. Swapping innerHTML also resets the
     child to whatever ends up first, so the fragment leads with the disabled
     placeholder again or the field quietly posts the first rate contract of the
     new vendor.

     One owner for the disabled attribute. htmx has hx-disabled-elt and Alpine
     has :disabled; both writing it is a race whose loser is whichever ran last,
     and the field ends up locked with nothing in flight. Alpine owns it here.

     Two chevron spans rather than one with a swapped :data-lucide — both are in
     the document at first paint so Lucide hydrates both. Changing data-lucide
     on an <svg> already hydrated re-renders nothing under the guarded loop.

     An empty answer is a real answer: a vendor with no live contract sends one
     disabled option saying so, and the child stays required so nothing can be
     submitted past it. An empty fragment leaves a select with no options at
     all, which is a 20px sliver nobody can explain. -->
<div data-kui="select/cascade" class="max-w-md space-y-4"
     x-data="{ vendor: '', loading: false, count: 0 }"
     @htmx:before-request.camel="loading = true"
     @htmx:after-request.camel="loading = false"
     @htmx:after-swap.camel="count = $refs.contract.querySelectorAll('option[data-live]').length">

  <div>
    <label for="cs-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor <span class="text-red-600">*</span></label>
    <div class="relative rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <select id="cs-vendor" name="vendor" required x-model="vendor"
              hx-get="/rate-contracts/options/" hx-trigger="change"
              hx-target="#cs-contract" hx-swap="innerHTML"
              class="block w-full min-w-0 appearance-none bg-transparent py-2 pr-9 pl-3 text-[14px]/5 outline-none">
        <option value="" disabled selected hidden>Choose a vendor</option>
        <option value="gujarat-polymers">Gujarat Polymers Ltd</option>
        <option value="sharma-extrusions">Sharma Extrusions</option>
        <option value="nashik-steel">Nashik Steel Traders</option>
        <option value="konkan-chemicals">Konkan Chemicals Pvt Ltd</option>
      </select>
      <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-600">
        <i data-lucide="chevron-down" class="size-4"></i>
      </span>
    </div>
  </div>

  <div>
    <label for="cs-contract" class="mb-1.5 block text-[13px]/5 font-medium">Rate contract <span class="text-red-600">*</span></label>
    <div class="relative rounded-lg border border-zinc-200 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15"
         :class="!vendor || loading ? 'bg-zinc-100' : 'bg-white'">
      <select id="cs-contract" x-ref="contract" name="rate_contract" required
              :disabled="!vendor || loading" aria-describedby="cs-contract-status"
              class="block w-full min-w-0 appearance-none bg-transparent py-2 pr-9 pl-3 text-[14px]/5 outline-none disabled:text-zinc-400">
        <option value="" disabled selected hidden>Choose a vendor first</option>
      </select>

      <span aria-hidden="true" x-show="!loading"
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
        <i data-lucide="chevron-down" class="size-4"></i>
      </span>
      <span aria-hidden="true" x-show="loading" x-cloak
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-600">
        <i data-lucide="loader-circle" class="size-4 animate-spin"></i>
      </span>
    </div>

    <!-- in the document from first paint, outside anything x-show hides -->
    <p id="cs-contract-status" role="status" class="mt-1.5 text-[12px]/4 tabular-nums"
       :class="vendor && !loading && !count ? 'font-medium text-amber-700' : 'text-zinc-500'"
       x-text="loading
                 ? 'Loading rate contracts'
                 : (!vendor
                     ? 'Pick a vendor and its live rate contracts load here.'
                     : (count
                         ? count + ' live rate contracts for this vendor.'
                         : 'No live rate contract for this vendor. Raise one before ordering.'))"></p>
  </div>
</div>` },

      { id: 'django', name: 'Django form field', code:
`<!-- forms.py
     class OrderForm(forms.Form):
         # ChoiceField renders the <select> and, more to the point, validates
         # the POSTed value against choices. That check is the only thing
         # between a DOM anybody can edit and the database — which is also why
         # the listbox variants above are still ChoiceFields on the server, just
         # with HiddenInput on them.
         vendor = forms.ChoiceField(
             choices=[('', 'Choose a vendor')] + VENDOR_CHOICES,
             widget=PlaceholderSelect(attrs={
                 'class': 'block w-full min-w-0 appearance-none bg-transparent '
                          'py-2 pr-9 pl-3 text-[14px]/5 outline-none'}),
             help_text='Only vendors with a live rate contract are listed.')

         # Nested choices are what render <optgroup>. One level and no more.
         item = forms.ChoiceField(choices=[
             ('', 'Choose an item'),
             ('Polymers',  [('ITM-1042', 'HDPE granules — natural'),
                            ('ITM-1078', 'LDPE granules — 22FA002')]),
             ('Fasteners', [('ITM-3310', 'M12 hex bolt — 8.8 zinc')])])

         # disabled=True is the server half of the locked field: the widget
         # renders disabled AND the field ignores request.POST for this key
         # entirely, cleaning from initial instead. That is why a Django form
         # does not need the hidden input the plain-HTML read-only field needs —
         # nothing is trusted from the browser for it at all.
         plant = forms.ChoiceField(choices=PLANT_CHOICES, disabled=True)

         # Multiple. The widget is what parses the POST: SelectMultiple calls
         # data.getlist(name). A plain ChoiceField calls data.get(name), takes
         # the last value and drops the rest without erroring.
         plants = forms.MultipleChoiceField(choices=PLANT_CHOICES, required=False)

         def __init__(self, *args, **kwargs):
             super().__init__(*args, **kwargs)
             # aria-invalid and aria-describedby cannot be decided in the
             # template — the widget attrs are fixed before it renders — and
             # this is the only place that knows both the errors and the ids.
             for name in self.fields:
                 bf, attrs = self[name], self.fields[name].widget.attrs
                 attrs['aria-describedby'] = bf.auto_id + ('-err' if bf.errors else '-help')
                 if bf.errors:
                     attrs['aria-invalid'] = 'true'

     widgets.py
         class PlaceholderSelect(forms.Select):
             # Django renders its empty choice as a plain selectable option that
             # submits an empty string. required catches it, but only after a
             # round trip, and the user can select it back afterwards.
             # create_option is the only hook that reaches a single <option>.
             def create_option(self, name, value, *args, **kwargs):
                 option = super().create_option(name, value, *args, **kwargs)
                 if value in ('', None):
                     option['attrs']['disabled'] = True
                     option['attrs']['hidden'] = True
                 return option

     views.py
         def contract_options(request):
             rows = RateContract.objects.filter(
                 vendor__slug=request.GET.get('vendor', ''), is_live=True)
             # the fragment only: options, and nothing around them
             return render(request, 'orders/_contract_options.html', {'rows': rows})

     urls.py
         path('rate-contracts/options/', views.contract_options,
              name='contract-options'),

     The widget renders the <select> and only the <select>. The wrapper, the
     chevron and the focus outline are template markup, so {{ form.vendor }} on
     its own is never the whole field — which is the one thing that catches
     everybody who has used a crispy-forms style renderer before. -->
<form data-kui="select/django" method="post" class="max-w-md space-y-5">
  {% csrf_token %}

  <div>
    <label for="{{ form.vendor.id_for_label }}" class="mb-1.5 block text-[13px]/5 font-medium">
      {{ form.vendor.label }} <span class="text-red-600">*</span>
    </label>

    <div class="relative rounded-lg bg-white {% if form.vendor.errors %}border border-red-600 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15{% else %}border border-zinc-200 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15{% endif %}">
      {{ form.vendor }}
      <span aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-600">
        <i data-lucide="chevron-down" class="size-4"></i>
      </span>
    </div>

    {% if form.vendor.errors %}
      <p id="{{ form.vendor.auto_id }}-err" class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
        <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>{{ form.vendor.errors.0 }}
      </p>
    {% else %}
      <p id="{{ form.vendor.auto_id }}-help" class="mt-1.5 text-[12px]/4 text-zinc-500">{{ form.vendor.help_text }}</p>
    {% endif %}
  </div>

  {# disabled=True on the field: it renders disabled, it posts nothing, and the #}
  {# form cleans it from initial regardless of what the browser sends. No       #}
  {# hidden input, and no chevron — nothing here is going to open.              #}
  <div>
    <label for="{{ form.plant.id_for_label }}" class="mb-1.5 block text-[13px]/5 font-medium">{{ form.plant.label }}</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">{{ form.plant }}</div>
    <p id="{{ form.plant.auto_id }}-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Set on the rate contract. It changes there, not here.</p>
  </div>

  <button type="submit" class="inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">
    Raise order
  </button>
</form>

{# orders/_contract_options.html — the whole response for the cascade variant. #}
{# It leads with the placeholder again, because hx-swap="innerHTML" on a       #}
{# <select> resets the selection to whatever ends up first. The empty case is  #}
{# a disabled option that says so, never an empty fragment.                    #}
{% if rows %}
  <option value="" disabled selected hidden>Choose a rate contract</option>
  {% for r in rows %}
    <option value="{{ r.pk }}" data-live>{{ r.number }} — {{ r.rate }}/kg to {{ r.valid_to|date:"d M Y" }}</option>
  {% endfor %}
{% else %}
  <option value="" disabled selected>No live rate contract for this vendor</option>
{% endif %}` }
    ]
  },

  {
    id: 'textarea', name: 'Textarea', category: 'forms',
    description: 'Multi-line text entry. Same bordered wrapper as the input, a height measured in rows, and a counter when there is a limit worth showing.',
    when: 'Free text longer than a line — notes, remarks, an address, a reason for a revision.',
    notes: [
      'Give the control block. A textarea is inline-block by default, so it sits on a text baseline and leaves a 5px strip of wrapper below it that looks like a rendering bug.',
      'Set the height with rows, never with an h- class. h-[100px] against a 20px leading is 4.2 lines, and the fifth line is sliced in half along its x-height.',
      'Preflight already sets resize: vertical, so resize-y is redundant and resize-x is a layout bug waiting to happen. The only resize class worth writing is resize-none, on a box whose height is owned by script.',
      'Never leave a read-only box white, bordered and ringed. It is then pixel for pixel an editable field, and the only way to find out otherwise is to click into it and get nothing back. Read-only takes bg-zinc-100, the same locked surface disabled uses, and drops the resting ring. It keeps a focus outline: read-only is still in the tab order precisely so the value can be copied, and a keyboard user has to see where they have landed.',
      'Enter inserts a newline. Never bind Enter to submit — the one key someone needs to write a second line must not post the form.',
      'maxlength truncates a paste in silence. Use it only when the limit is the column width, and say the number in the help text before it is reached; otherwise count past the limit and block the submit, so the user can see what has to go.',
      'Set the height back to auto before reading scrollHeight, or an auto-growing box grows and never shrinks — scrollHeight cannot report less than the height already set.',
      'Re-measure an auto-growing box on resize. Its height was computed at whatever width it had when it was first painted, and that is the wrong height at 390px.',
      'The counter is tabular-nums. Proportional digits change width as they count and the label beside them shifts on every keystroke.'
    ],
    anatomy: [
      ['Wrapper', 'The bordered box, and what owns the focus ring. Same as the input, which is why a footer row can sit inside the ring.'],
      ['Control', 'A borderless, transparent, block-level textarea with outline-none. Its height comes from rows.'],
      ['Label row', 'The label on the left, the counter on the right, on one line above the box, so the counter costs no vertical space.'],
      ['Counter', '11px mono tabular-nums, counting down. zinc-500, amber-700 inside the last 20, red-600 once it is over.'],
      ['Footer', 'An optional row inside the ring: a hint on the left, the submit on the right. This is what the wrapper border buys.'],
      ['Help or error', '12px under the box. The error replaces the help text rather than stacking under it, exactly as in Field.']
    ],
    behaviour: [
      'The height is a number of rows, so the box is always a whole number of lines and nothing is ever half-visible at the bottom.',
      'Enter inserts a newline and never submits. Where a submit shortcut is genuinely wanted, it is Ctrl or Cmd plus Enter, and it is written in the hint rather than left to be discovered.',
      'The counter counts down, not up: what is left is the number the writer is deciding against. It turns amber inside the last 20 characters and red once it is over, and the submit disables while it is over.',
      'An auto-growing box grows with its content up to a ceiling, then stops and scrolls. Without the ceiling a long paste pushes the submit button off the screen.',
      'Resize is vertical only, so a textarea can never be dragged wider than the form it sits in. An auto-growing box drops the handle entirely, because script and the drag would fight over the same height.',
      'Read-only and disabled share one locked surface, bg-zinc-100 with no resting ring, because both are boxes you cannot type into. Only read-only takes a focus outline, because only read-only is focusable. The text is what separates them: zinc-900 for read-only, whose value still matters and still has to be copyable, zinc-400 for disabled, whose value does not. A read-only field left white, bordered and ringed says nothing at all until someone clicks into it and nothing happens.'
    ],
    a11y: [
      'A real label bound with for/id. A placeholder is not a label, and in a box this size it disappears the moment anyone starts typing.',
      'aria-describedby points at the help text, at the error when there is one, and at the counter, so the limit is announced with the field and not left as a number floating beside it.',
      'The visible counter is aria-hidden and mirrored in a polite live region that stays empty until the last 20 characters, then updates on a debounce. Announcing a count on every keystroke makes the field unusable with a screen reader.',
      'Over the limit sets aria-invalid on the control, and the reason is real text under the box, not a colour and not a title attribute.',
      'Never a contenteditable div. A real textarea brings keyboard support, IME composition, spellcheck, undo and form submission with it, and none of that is worth reimplementing.',
      'The focus ring sits on the wrapper via focus-within, so it stays visible against both white and zinc-100 and never leaves the footer row outside it.'
    ],
    related: ['field', 'input', 'form-page'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div data-kui="textarea/default" class="max-w-xl">
  <label for="ta-notes" class="mb-1.5 block text-[13px]/5 font-medium">Delivery instructions</label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <textarea id="ta-notes" name="notes" rows="4"
              placeholder="Gate timings, unloading contact, anything the driver needs to know"
              aria-describedby="ta-notes-help"
              class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500"></textarea>
  </div>
  <p id="ta-notes-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Printed on the delivery challan.</p>
</div>` },

      { id: 'sizes', name: 'Sizes', code:
`<!-- Three heights, and rows is what sets all three. A pixel height cuts the
     last line in half: h-[100px] against a 20px leading is 4.2 lines. -->
<div data-kui="textarea/sizes" class="max-w-xl space-y-5">
  <div>
    <label for="ta-2" class="mb-1.5 block text-[13px]/5 font-medium">Two rows — a remark inside a table row or a dialog</label>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <textarea id="ta-2" rows="2" class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">Short shipped by 40 kg, balance promised Friday.</textarea>
    </div>
  </div>

  <div>
    <label for="ta-4" class="mb-1.5 block text-[13px]/5 font-medium">Four rows — the default for a form field</label>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <textarea id="ta-4" rows="4" class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">Konspec Industries
Plot 214, Silvassa Industrial Estate
Dadra &amp; Nagar Haveli 396230</textarea>
    </div>
  </div>

  <div>
    <label for="ta-10" class="mb-1.5 block text-[13px]/5 font-medium">Ten rows — the page is the field</label>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <textarea id="ta-10" rows="10" class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none" placeholder="Scope of work"></textarea>
    </div>
  </div>
</div>` },

      { id: 'counter', name: 'With a counter', code:
`<!-- A soft limit: typing past it is allowed, submitting past it is not. A hard
     maxlength would swallow the tail of a paste without saying so. -->
<div data-kui="textarea/counter" class="max-w-xl"
     x-data="{
       text: 'Rate revised after the vendor withdrew the August discount.',
       limit: 180,
       t: null,
       announce: '',
       get left() { return this.limit - this.text.length; },
       get over() { return this.left < 0; },
       get msg() { return this.over ? Math.abs(this.left) + ' over the limit' : this.left + ' left'; },
       get tone() { return this.over ? 'text-red-600' : this.left <= 20 ? 'text-amber-700' : 'text-zinc-500'; },
       say(m) { clearTimeout(this.t); this.t = setTimeout(() => this.announce = m, 700); }
     }"
     x-effect="say(left <= 20 ? msg : '')">
  <div class="mb-1.5 flex items-baseline justify-between gap-3">
    <label for="ta-reason" class="text-[13px]/5 font-medium">Reason for revision <span class="text-red-600">*</span></label>
    <span id="ta-reason-count" aria-hidden="true"
          class="shrink-0 font-mono text-[11px]/4 tabular-nums" :class="tone" x-text="msg"></span>
  </div>

  <div class="rounded-lg bg-white border"
       :class="over ? 'border-red-600 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15'
                    : 'border-zinc-200 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15'">
    <textarea id="ta-reason" name="reason" rows="4" x-model="text"
              :aria-invalid="over ? 'true' : null"
              aria-describedby="ta-reason-help ta-reason-count"
              class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none"></textarea>
  </div>

  <p id="ta-reason-help" class="mt-1.5 text-[12px]/4" :class="over ? 'font-medium text-red-600' : 'text-zinc-500'">
    <span x-show="!over">Goes on the amendment record, visible to the vendor. 180 characters.</span>
    <span x-show="over" x-cloak class="flex items-center gap-1.5">
      <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>Too long to fit on the amendment record.
    </span>
  </p>

  <!-- silent until it matters, then debounced, so a screen reader is not read a
       running count on every keystroke -->
  <span class="sr-only" aria-live="polite" x-text="announce"></span>
</div>` },

      { id: 'autogrow', name: 'Auto-growing', code:
`<!-- Grows with the content up to a ceiling, then scrolls. Chromium and Safari
     can do this in one class, field-sizing-content, but Firefox cannot yet, so
     this is the version that ships.

     Two things break it: reading scrollHeight without resetting the height to
     auto first (it can never report less than the height already set, so the
     box only ever grows), and never re-measuring, which leaves a box sized at
     desktop width still that tall at 390px. -->
<div data-kui="textarea/autogrow" class="max-w-xl"
     x-data="{
       grow() {
         const t = this.$refs.ta;
         t.style.height = 'auto';
         t.style.height = t.scrollHeight + 'px';
       }
     }"
     x-init="$nextTick(() => grow())"
     @resize.window.debounce="grow()">
  <label for="ta-grow" class="mb-1.5 block text-[13px]/5 font-medium">Inspection remarks</label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <textarea id="ta-grow" name="remarks" x-ref="ta" rows="2" @input="grow()"
              placeholder="Type — the box follows"
              class="block max-h-54 w-full resize-none overflow-y-auto bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">Material received against GRN-24-0912.
Two bundles show mill scale on the outer face.
Held pending the test certificate.</textarea>
  </div>
  <p class="mt-1.5 text-[12px]/4 text-zinc-500">Stops growing at 10 rows and scrolls after that.</p>
</div>` },

      { id: 'toolbar', name: 'With a footer', code:
`<!-- The footer sits inside the ring, which is the whole reason the border is on
     the wrapper and not on the control. Ctrl or Cmd plus Enter posts; a bare
     Enter writes a newline, because that is what the key is for. -->
<div data-kui="textarea/toolbar" class="max-w-xl" x-data="{ text: '' }">
  <div class="rounded-xl border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <label for="ta-note" class="sr-only">Add a note to this order</label>
    <textarea id="ta-note" name="body" rows="3" x-model="text"
              @keydown.ctrl.enter="if (text.trim()) $refs.post.click()"
              @keydown.meta.enter="if (text.trim()) $refs.post.click()"
              placeholder="Add a note for whoever picks this up next"
              class="block w-full resize-none bg-transparent px-3.5 pt-3 text-[14px]/5 outline-none placeholder:text-zinc-500"></textarea>

    <div class="flex items-center justify-between gap-3 px-3.5 pb-3 pt-1.5">
      <span class="min-w-0 text-[12px]/4 text-zinc-500">
        Visible to everyone on this order
        <!-- a phone has no Ctrl key, so the hint goes rather than truncates -->
        <span class="hidden sm:inline">
          <kbd class="ml-1 rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px]/3 text-zinc-600">Ctrl</kbd>
          <kbd class="rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[10px]/3 text-zinc-600">Enter</kbd>
        </span>
      </span>
      <button type="submit" x-ref="post" :disabled="!text.trim()"
              class="inline-flex h-8 shrink-0 items-center rounded-lg border border-transparent bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400">
        Post note
      </button>
    </div>
  </div>
</div>` },

      { id: 'error', name: 'With error', code:
`<div data-kui="textarea/error" class="max-w-xl">
  <label for="ta-bad" class="mb-1.5 block text-[13px]/5 font-medium">Rejection reason <span class="text-red-600">*</span></label>
  <div class="rounded-lg border border-red-600 bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15">
    <textarea id="ta-bad" name="reason" rows="4" aria-invalid="true" aria-describedby="ta-bad-err"
              class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none"></textarea>
  </div>
  <!-- the error replaces the help text, it does not stack under it -->
  <p id="ta-bad-err" class="mt-1.5 flex items-center gap-1.5 text-[12px]/4 font-medium text-red-600">
    <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>A reason is required before an order can be rejected.
  </p>
</div>` },

      { id: 'disabled', name: 'Disabled and read-only', code:
`<div data-kui="textarea/disabled" class="max-w-xl space-y-5">
  <div>
    <label for="ta-off" class="mb-1.5 block text-[13px]/5 font-medium text-zinc-500">Terms and conditions</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">
      <textarea id="ta-off" rows="3" disabled
                class="block w-full resize-none bg-transparent px-3 py-2 text-[14px]/5 text-zinc-400">Set by the rate contract. Editable only on the contract itself.</textarea>
    </div>
  </div>

  <div>
    <!-- Same locked surface as disabled, and deliberately so: a filled, ringless
         box reads as a field that is closed. The only thing separating the two
         is the text, zinc-900 here against zinc-400 above, because a read-only
         value still matters and still has to be selectable and copyable. On a
         white bordered box with a focus ring, nothing says read-only until you
         click into it and nothing happens. -->
    <label for="ta-ro" class="mb-1.5 block text-[13px]/5 font-medium">Vendor reply</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">
      <textarea id="ta-ro" rows="3" readonly
                class="block w-full resize-none bg-transparent px-3 py-2 text-[14px]/5 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">Balance 40 kg dispatched on 18 August by Gati, LR 4471029.
Test certificate follows by email.</textarea>
    </div>
  </div>
</div>` },

      { id: 'django', name: 'Django form field', code:
`<!-- The border being on the wrapper is what keeps the error state in the
     template. The widget class is written once in forms.py and never has to be
     rewritten in __init__ to add a red border, because the red border is not on
     the widget.

     # forms.py
     class OrderNoteForm(forms.ModelForm):
         class Meta:
             model = OrderNote
             fields = ['body']
             widgets = {
                 'body': forms.Textarea(attrs={
                     'rows': 4,
                     'placeholder': 'Add a note for whoever picks this up next',
                     'class': 'block w-full bg-transparent px-3 py-2 text-[14px]/5 '
                              'outline-none placeholder:text-zinc-500',
                 })
             }

     A max_length on the model renders as maxlength on the widget, which
     truncates a paste in silence. Either drop it from the widget and let
     clean() reject the value with a message, or say the number in help_text
     before anyone reaches it. form.body.field.max_length is the number. -->
<form data-kui="textarea/django" method="post" class="max-w-xl">
  {% csrf_token %}
  <div>
    <label for="{{ form.body.id_for_label }}" class="mb-1.5 block text-[13px]/5 font-medium">
      {{ form.body.label }}{% if form.body.field.required %} <span class="text-red-600">*</span>{% endif %}
    </label>

    <div class="rounded-lg bg-white {% if form.body.errors %}border border-red-600 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15{% else %}border border-zinc-200 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15{% endif %}">
      {{ form.body }}
    </div>

    {% if form.body.errors %}
      <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4 font-medium text-red-600">
        <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>{{ form.body.errors.0 }}
      </p>
    {% elif form.body.help_text %}
      <p class="mt-1.5 text-[12px]/4 text-zinc-500">{{ form.body.help_text }}</p>
    {% endif %}
  </div>

  <button type="submit" class="mt-4 inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Post note</button>
</form>` }
    ]
  },

  {
    id: 'checkbox', name: 'Checkbox', category: 'forms',
    description: 'An independent on or off — one flag, a set of options, or the row selection a register\'s bulk actions run on. A real native box wearing accent-zinc-700.',
    when: 'A choice that does not depend on the ones beside it, and any list someone acts on several rows of at once. For one of a set use a radio group, and for a setting that applies the moment it is touched use a toggle.',
    notes: [
      'Every box here is a real <input type="checkbox"> with accent-zinc-700, and nothing uses appearance-none. Repainting the box yourself costs three things in one go: the mixed glyph, which no CSS brings back; the platform focus ring on a 16px target; and forced-colours mode, where a restyled box renders as an empty square with no tick in it. accent-color changes the fill and the tick and keeps all of it.',
      'While appearance is auto the box ignores border-radius and border-*, so the rounded in a size-4 rounded accent-zinc-700 is inert — it is not doing the thing its name promises, and nobody finds that out until they try to reshape the box with it. A size and accent-* are the whole styling surface; wanting more than that means appearance-none, which costs what the rule above costs.',
      'indeterminate is a JS property with no matching attribute, so it cannot be written in markup and never survives a server render. A page that comes back with two of five boxes ticked shows a select-all that reads as plain unchecked until script sets it — bind it with x-effect on the element itself, not on the component root, where $refs is not populated yet at init.',
      'Do not add aria-checked="mixed" to a native box. The indeterminate property already maps to mixed, aria-checked belongs to a role="checkbox" widget you built yourself, and an attribute set once outlives the property that keeps changing — which is how a select-all ends up announced as mixed long after everything was ticked.',
      'A select-all gets no name and no value. It is a control over the list, not a field in the form: indeterminate changes nothing about what is submitted, so a mixed select-all with a name posts exactly as if it were plainly ticked or plainly absent.',
      'An unticked box submits nothing at all — the name simply does not appear in the POST. Django reads that absence as False, which is only safe while the form renders every field it cleans; a POST assembled from a subset of the fields silently clears every boolean it left out. A group of boxes sharing a name arrives as a list, so read it with request.POST.getlist(\'notify\') — .get() returns the last one and drops the rest.',
      'forms.BooleanField is required=True by default, and on a checkbox that means "must be ticked". A flag that is allowed to be off is required=False, or the form comes back invalid with "This field is required" the first time someone leaves it alone.',
      'The label wraps the box as its direct child. The base cursor rule matches label:has(> input[type="checkbox"]), so wrapping the box in a div for layout drops the pointer without a word — put the flex on the label itself. The label is also what makes the target big enough: 16px of box is under the 24px WCAG 2.2 asks for, and padding on the label is what closes the gap.',
      'Help text goes outside the label, aligned to the text with pl-[26px], and is pointed at with aria-describedby. Anything inside the label is part of the box\'s accessible name, so a two-line explanation gets read back in full every time focus lands on the box. The same applies to a link — a link inside the label toggles the box when it is clicked.',
      'Never write outline-none on a box. The focus-within halo that text fields use is a wrapper trick; a 3px ring around a 16px square lands on top of the square and reads as a smudge. Keep the UA ring, and where a whole tile has to show focus put it on the tile with has-[:focus-visible].',
      'A select-all means this page, not the query behind it. Say the number out loud — "5 of 5 on this page" — and make selecting the other 4,312 a separate, deliberate click. A bulk approve that quietly took every match is not recoverable by pressing Undo.',
      'Paint the selected row with has-[:checked] rather than a second copy of the state, so the tint cannot disagree with the box. Guard the hover tint with [&:not(:has(:checked))] while you are there: hover and selected are one class each at equal specificity, so without the guard which one wins on a hovered selected row is decided by the order Tailwind emits the variants in.',
      'Never render the same rows twice with the same name — the desktop table and the stacked cards below md are both in the DOM, one of them display:none, and a display:none checkbox still posts. Either the boxes carry no name and the selection is Alpine state, as it is here, or one list is rendered and restyled.'
    ],
    anatomy: [
      ['Box', 'A real input type="checkbox", size-4 accent-zinc-700 shrink-0. No wrapper, no appearance-none, no substitute.'],
      ['Label', 'Wrapping the box as its direct child, so the text is part of the target. items-start with mt-0.5 on the box the moment the text can run to two lines — items-center floats a 16px square against the middle of a three-line block.'],
      ['Help text', 'A 12px zinc-500 line outside the label, indented to the text with pl-[26px] and named by aria-describedby.'],
      ['Group', 'A fieldset with a legend, one name repeated across the options, and one help line under the whole group rather than one under every row.'],
      ['Select-all', 'A box with no name and no value of its own. It reads all, some or none off the count, and writes indeterminate back through script.'],
      ['Selected row', 'bg-zinc-100 through has-[:checked], so the tint is the box\'s own state and not a second copy of it.'],
      ['Bulk bar', 'The strip above the rows once something is selected: how many, what will happen to them, and the way back out.']
    ],
    behaviour: [
      'Clicking anywhere on the label toggles the box, so the target is the whole row and not the 16px square. Text merely sitting beside the box leaves a target that misses on a phone.',
      'A select-all reads three states off the count — none, some, all — and the middle one is indeterminate rather than unchecked. Ticking it takes every row on the page and nothing beyond it; unticking it releases only those rows.',
      'Shift-clicking runs from the last box touched to the one clicked and applies the state of the box clicked, so a run can be cleared the same way it was set. The handler clears the text selection the browser draws across the rows at the same time.',
      'The selection is an array of record ids on the component root, so the count, the row tint and the bulk bar cannot drift apart, and re-sorting the rows does not lose it.',
      'The bulk bar appears only once something is selected, names the number it will act on, and is x-cloaked so it is not on screen for the first frame.',
      'A group posts its name once for every ticked box and not at all when none are ticked. The difference between "none of them" and "the field was never on this form" comes from the form definition on the server, never from the request.',
      'A disabled option keeps its place in the list rather than disappearing, so a policy locking one does not change the shape of a set people have learned to scan.'
    ],
    a11y: [
      'Every box has a name of its own. In a register that is aria-label naming the record — "Select PO-24-1187" — because twelve boxes all called "Select" say nothing about which row the cursor is on.',
      'A set of related boxes is a fieldset with a legend, or every option is announced with no question attached to it.',
      'The mixed state is the indeterminate property on a native input, which is already mapped to mixed. Nothing here writes aria-checked, and nothing needs to.',
      'No box carries outline-none. The UA focus ring is the only indicator that survives forced-colours mode, and on a 16px control there is no room to draw a better one.',
      'Disabled uses the disabled attribute, which drops the box out of the Tab order and out of the POST. There is no read-only checkbox — readonly does nothing on one — so a value that must not change is rendered as text, and one that must still be submitted gets a hidden input beside it.',
      'The selected count is plain text and not a live region. The box announces its own state on every toggle already; a live count makes that two announcements per keystroke and a stream of them on a shift-click.',
      'An error is real text under the group, referenced with aria-describedby, and a required single box carries both required and aria-invalid. A red asterisk on its own is decoration.'
    ],
    related: ['radio', 'toggle', 'table'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- The help text sits outside the label. Inside it, it becomes part of the
     box's accessible name, and the whole sentence is read back every time focus
     lands on the box. -->
<div data-kui="checkbox/default" class="max-w-xl">
  <label class="flex items-start gap-2.5 text-[14px]/5">
    <input type="checkbox" id="cb-notify" name="notify_vendor" value="1" checked
           aria-describedby="cb-notify-help"
           class="mt-0.5 size-4 shrink-0 accent-zinc-700">
    <span>Email the vendor when this order is approved</span>
  </label>
  <p id="cb-notify-help" class="mt-1 pl-[26px] text-[12px]/4 text-zinc-500">
    Goes to the contact on the rate contract, with the order PDF attached.
  </p>
</div>` },

      { id: 'group', name: 'Group', code:
`<!-- One name across the group. Two ticks post notify twice; no ticks post
     nothing at all, and the server reads that absence off the form definition
     rather than off the request. -->
<fieldset data-kui="checkbox/group" class="max-w-xl">
  <legend class="mb-2 text-[13px]/5 font-medium">Notify when this order is approved</legend>

  <div class="space-y-2">
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="checkbox" name="notify" value="buyer" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Ritu Deshpande — buyer</span>
    </label>
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="checkbox" name="notify" value="stores" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Anil Kulkarni — stores</span>
    </label>
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="checkbox" name="notify" value="vendor" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Gujarat Polymers Ltd — vendor</span>
    </label>
    <!-- locked, and still in its place: dropping it would change the shape of a
         list people scan by position -->
    <label class="flex items-start gap-2.5 text-[14px]/5 text-zinc-500">
      <input type="checkbox" name="notify" value="plant_head" disabled class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="tabular-nums">Plant head — orders above ₹10,00,000 only</span>
    </label>
  </div>

  <!-- one help line under the group, never one under each option -->
  <p class="mt-2 text-[12px]/4 text-zinc-500">Everyone ticked gets the approved order as a PDF within the hour.</p>
</fieldset>` },

      { id: 'indeterminate', name: 'Select all and mixed', code:
`<!-- indeterminate is a property, not an attribute. It cannot be written in
     markup, so a fieldset rendered server-side with two of four lines ticked
     comes back with a select-all that reads as plainly unchecked. x-effect sits
     on the element itself rather than on the fieldset, because $refs is not
     populated when the root initialises.

     The select-all carries no name: indeterminate changes nothing about what is
     submitted, so a mixed box with a name posts as if it were simply ticked. -->
<fieldset data-kui="checkbox/indeterminate" class="max-w-xl"
          x-data="{
            lines: ['hdpe', 'ldpe', 'mb', 'ao'],
            sel: ['hdpe', 'mb'],
            get every() { return this.sel.length === this.lines.length; },
            get some() { return this.sel.length > 0 && !this.every; },
            toggleAll(on) { this.sel = on ? [...this.lines] : []; }
          }">
  <legend class="mb-2 text-[13px]/5 font-medium tabular-nums">Lines to receive on GRN-24-0912</legend>

  <div class="flex items-center justify-between gap-3 border-b border-zinc-200 pb-2">
    <label class="flex items-center gap-2.5 text-[13px]/5 font-medium">
      <input type="checkbox" aria-label="Select all four lines"
             :checked="every" x-effect="$el.indeterminate = some"
             @change="toggleAll($event.target.checked)"
             class="size-4 shrink-0 accent-zinc-700">
      <span>All lines</span>
    </label>
    <!-- the count sits outside the label, or it becomes part of the box's name
         and is read back in full on every toggle -->
    <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500" x-text="sel.length + ' of 4 selected'"></span>
  </div>

  <div class="mt-2 space-y-2">
    <label class="flex items-center gap-2.5 text-[13px]/5">
      <input type="checkbox" name="line" value="hdpe" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0 flex-1 truncate">HDPE granules — grade M60075</span>
      <span class="shrink-0 tabular-nums text-zinc-600">2,000 kg</span>
    </label>
    <label class="flex items-center gap-2.5 text-[13px]/5">
      <input type="checkbox" name="line" value="ldpe" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0 flex-1 truncate">LDPE granules — grade 24FS040</span>
      <span class="shrink-0 tabular-nums text-zinc-600">800 kg</span>
    </label>
    <label class="flex items-center gap-2.5 text-[13px]/5">
      <input type="checkbox" name="line" value="mb" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0 flex-1 truncate">Masterbatch, black</span>
      <span class="shrink-0 tabular-nums text-zinc-600">120 kg</span>
    </label>
    <label class="flex items-center gap-2.5 text-[13px]/5">
      <input type="checkbox" name="line" value="ao" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0 flex-1 truncate">Antioxidant AO-168</span>
      <span class="shrink-0 tabular-nums text-zinc-600">25 kg</span>
    </label>
  </div>
</fieldset>` },

      { id: 'cards', name: 'Option tiles', code:
`<!-- No Alpine at all. :has() paints the tile from the box's own state, so the
     tint can never disagree with what is ticked, and has-[:focus-visible] puts
     the focus indication where it can actually be seen — a 3px halo drawn round
     a 16px square lands on top of the square.

     The hover tint carries the [&:not(:has(:checked))] guard: hover and selected
     are one class each at equal specificity, and without it which one paints a
     hovered selected tile depends on the order Tailwind emits the variants. -->
<fieldset data-kui="checkbox/cards">
  <legend class="mb-2 text-[13px]/5 font-medium">Send with the vendor email</legend>

  <div class="grid gap-2 sm:grid-cols-3">
    <label class="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-zinc-700/15">
      <input type="checkbox" name="enclose" value="po" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0">
        <span class="block text-[13px]/5 font-medium">Purchase order</span>
        <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-500">PDF · 2 pages</span>
      </span>
    </label>

    <label class="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-zinc-700/15">
      <input type="checkbox" name="enclose" value="drawings" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0">
        <span class="block text-[13px]/5 font-medium">Drawing set</span>
        <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-500">PDF · 14 sheets</span>
      </span>
    </label>

    <label class="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-zinc-700/15">
      <input type="checkbox" name="enclose" value="contract" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0">
        <span class="block text-[13px]/5 font-medium">Rate contract extract</span>
        <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-500">Valid to 31 Mar 2025</span>
      </span>
    </label>
  </div>
</fieldset>` },

      { id: 'filters', name: 'Filter list', code:
`<!-- A facet list: one repeated name, a count against each option, and a ceiling
     on the height so twenty vendors do not push the register off the screen. The
     vendor name truncates and the count is shrink-0, so nothing reflows at
     390px and the digits still line up. -->
<div data-kui="checkbox/filters" class="max-w-xs rounded-xl border border-zinc-300 bg-white"
     x-data="{ sel: ['gujarat-polymers', 'sharma-extrusions'] }">
  <div class="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-2.5">
    <h3 class="text-[13px]/5 font-medium">Vendor</h3>
    <button type="button" x-show="sel.length" x-cloak @click="sel = []"
            class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600 underline underline-offset-2">
      Clear <span x-text="sel.length"></span>
    </button>
  </div>

  <fieldset class="max-h-56 overflow-y-auto px-4 py-3">
    <legend class="sr-only">Filter orders by vendor</legend>
    <div class="space-y-2">
      <label class="flex items-center gap-2.5 text-[13px]/5">
        <input type="checkbox" name="vendor" value="gujarat-polymers" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1 truncate">Gujarat Polymers Ltd</span>
        <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">128</span>
      </label>
      <label class="flex items-center gap-2.5 text-[13px]/5">
        <input type="checkbox" name="vendor" value="sharma-extrusions" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1 truncate">Sharma Extrusions</span>
        <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">96</span>
      </label>
      <label class="flex items-center gap-2.5 text-[13px]/5">
        <input type="checkbox" name="vendor" value="nashik-steel" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1 truncate">Nashik Steel Traders</span>
        <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">74</span>
      </label>
      <label class="flex items-center gap-2.5 text-[13px]/5">
        <input type="checkbox" name="vendor" value="silvassa-packaging" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1 truncate">Silvassa Packaging and Allied Products</span>
        <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">41</span>
      </label>
      <label class="flex items-center gap-2.5 text-[13px]/5">
        <input type="checkbox" name="vendor" value="konkan-chemicals" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1 truncate">Konkan Chemicals Pvt Ltd</span>
        <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">18</span>
      </label>
      <label class="flex items-center gap-2.5 text-[13px]/5">
        <input type="checkbox" name="vendor" value="baroda-fasteners" x-model="sel" class="size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1 truncate">Baroda Fasteners</span>
        <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">9</span>
      </label>
    </div>
  </fieldset>

  <div class="border-t border-zinc-200 px-4 py-2.5">
    <p class="text-[12px]/4 tabular-nums text-zinc-500"
       x-text="sel.length ? sel.length + ' of 6 vendors' : 'No vendor filter · all 1,438 orders'"></p>
  </div>
</div>` },

      { id: 'table', name: 'Row selection', code:
`<!-- Selection is an array of PO numbers on the root, and the row tint is
     has-[:checked] reading the box itself, so the two cannot drift apart.

     The boxes carry no name on purpose: the table and the stacked cards are both
     in the DOM below md, one of them display:none, and a display:none checkbox
     still posts. Two renderings of one row with one name post that row twice.

     Shift-click runs from the last box touched to the one clicked and takes the
     state of the box clicked, so a run can be cleared as easily as set. The
     browser draws a text selection across the rows while it does that, which the
     handler clears.

     Select-all means this page. The other 4,312 are a second, deliberate click,
     because a bulk approve that quietly took every match cannot be undone. -->
<div data-kui="checkbox/table" class="overflow-hidden rounded-xl border border-zinc-300 bg-white"
     x-data="{
       ids: ['PO-24-1187', 'PO-24-1191', 'PO-24-1194', 'PO-24-1203', 'PO-24-1206'],
       sel: ['PO-24-1191'],
       last: null,
       scope: 'page',
       get every() { return this.sel.length === this.ids.length; },
       get some() { return this.sel.length > 0 && !this.every; },
       has(id) { return this.sel.includes(id); },
       set(id, on) {
         const at = this.sel.indexOf(id);
         if (on && at < 0) this.sel.push(id);
         if (!on && at > -1) this.sel.splice(at, 1);
       },
       pick(i, e) {
         const on = e.target.checked;
         const from = (e.shiftKey && this.last !== null) ? this.last : i;
         for (let k = Math.min(from, i); k <= Math.max(from, i); k++) this.set(this.ids[k], on);
         if (e.shiftKey) window.getSelection().removeAllRanges();
         this.last = i;
         this.scope = 'page';
       },
       page(on) { this.sel = on ? [...this.ids] : []; this.last = null; this.scope = 'page'; },
       clear() { this.sel = []; this.last = null; this.scope = 'page'; }
     }">

  <div x-show="sel.length" x-cloak
       class="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-zinc-200 bg-zinc-100 px-4 py-2">
    <span class="text-[13px]/5 font-medium tabular-nums">
      <span x-show="scope === 'page'"><span x-text="sel.length"></span> of 5 on this page selected</span>
      <span x-show="scope === 'query'" x-cloak>All 4,312 matching orders selected</span>
    </span>
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve</button>
      <button type="button" class="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">Export</button>
      <button type="button" class="rounded-lg px-3 py-1.5 text-[13px]/5 font-medium text-red-600 hover:bg-zinc-100">Cancel orders</button>
    </div>
    <button type="button" x-show="every && scope === 'page'" x-cloak @click="scope = 'query'"
            class="text-[13px]/5 tabular-nums text-zinc-900 underline underline-offset-2">Select all 4,312 matching orders</button>
    <button type="button" @click="clear()" class="ml-auto shrink-0 text-[13px]/5 text-zinc-600 underline underline-offset-2">Clear</button>
  </div>

  <table class="hidden w-full text-[13px]/5 md:table">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="w-10 px-4 py-2.5">
          <input type="checkbox" aria-label="Select all 5 orders on this page"
                 :checked="every" x-effect="$el.indeterminate = some"
                 @change="page($event.target.checked)"
                 class="size-4 accent-zinc-700">
        </th>
        <th scope="col" class="px-4 py-2.5 font-medium">PO number</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Amount</th>
        <th scope="col" class="px-4 py-2.5 font-medium">Status</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Due</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
        <td class="px-4 py-2.5">
          <input type="checkbox" aria-label="Select PO-24-1187"
                 :checked="has('PO-24-1187')" @click="pick(0, $event)" class="size-4 accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187</td>
        <td class="px-4 py-2.5">Sharma Extrusions</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹18,42,000</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-600">12 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
        <td class="px-4 py-2.5">
          <input type="checkbox" aria-label="Select PO-24-1191"
                 :checked="has('PO-24-1191')" @click="pick(1, $event)" class="size-4 accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1191</td>
        <td class="px-4 py-2.5">Nashik Steel Traders</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹4,68,500</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-600">19 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
        <td class="px-4 py-2.5">
          <input type="checkbox" aria-label="Select PO-24-1194"
                 :checked="has('PO-24-1194')" @click="pick(2, $event)" class="size-4 accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1194</td>
        <td class="px-4 py-2.5">Gujarat Polymers Ltd</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹27,10,400</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-600">02 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
        <td class="px-4 py-2.5">
          <input type="checkbox" aria-label="Select PO-24-1203"
                 :checked="has('PO-24-1203')" @click="pick(3, $event)" class="size-4 accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1203</td>
        <td class="px-4 py-2.5">Sharma Extrusions</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹96,750</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Closed
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-600">28 Jul</td>
      </tr>
      <tr class="[&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
        <td class="px-4 py-2.5">
          <input type="checkbox" aria-label="Select PO-24-1206"
                 :checked="has('PO-24-1206')" @click="pick(4, $event)" class="size-4 accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1206</td>
        <td class="px-4 py-2.5">Nashik Steel Traders</td>
        <td class="px-4 py-2.5 text-right tabular-nums">₹1,32,900</td>
        <td class="px-4 py-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-600 ring-1 ring-inset ring-zinc-300">
            <span class="size-1.5 rounded-full bg-zinc-400" aria-hidden="true"></span>Draft
          </span>
        </td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-500">—</td>
      </tr>
    </tbody>
  </table>

  <!-- below md the same five records, as cards. Same fields, same order, no
       sideways scroll, and the select-all comes with them. -->
  <div class="border-b border-zinc-200 px-4 py-2.5 md:hidden">
    <label class="flex items-center gap-2.5 text-[13px]/5 font-medium">
      <input type="checkbox" aria-label="Select all 5 orders on this page"
             :checked="every" x-effect="$el.indeterminate = some"
             @change="page($event.target.checked)"
             class="size-4 shrink-0 accent-zinc-700">
      <span class="tabular-nums">All 5 on this page</span>
    </label>
  </div>
  <ul class="divide-y divide-zinc-100 md:hidden">
    <li class="[&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
      <label class="flex items-start gap-3 px-4 py-3">
        <input type="checkbox" aria-label="Select PO-24-1187"
               :checked="has('PO-24-1187')" @click="pick(0, $event)" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="flex items-baseline justify-between gap-3">
            <span class="text-[14px]/5 font-medium tabular-nums">PO-24-1187</span>
            <span class="shrink-0 text-[14px]/5 tabular-nums">₹18,42,000</span>
          </span>
          <span class="mt-0.5 block text-[13px]/5 text-zinc-600">Sharma Extrusions</span>
          <span class="mt-2 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-zinc-500" aria-hidden="true"></span>Open
            </span>
            <span class="text-[12px]/4 tabular-nums text-zinc-500">Due 12 Aug</span>
          </span>
        </span>
      </label>
    </li>
    <li class="[&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
      <label class="flex items-start gap-3 px-4 py-3">
        <input type="checkbox" aria-label="Select PO-24-1191"
               :checked="has('PO-24-1191')" @click="pick(1, $event)" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="flex items-baseline justify-between gap-3">
            <span class="text-[14px]/5 font-medium tabular-nums">PO-24-1191</span>
            <span class="shrink-0 text-[14px]/5 tabular-nums">₹4,68,500</span>
          </span>
          <span class="mt-0.5 block text-[13px]/5 text-zinc-600">Nashik Steel Traders</span>
          <span class="mt-2 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>Approved
            </span>
            <span class="text-[12px]/4 tabular-nums text-zinc-500">Due 19 Aug</span>
          </span>
        </span>
      </label>
    </li>
    <li class="[&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
      <label class="flex items-start gap-3 px-4 py-3">
        <input type="checkbox" aria-label="Select PO-24-1194"
               :checked="has('PO-24-1194')" @click="pick(2, $event)" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="flex items-baseline justify-between gap-3">
            <span class="text-[14px]/5 font-medium tabular-nums">PO-24-1194</span>
            <span class="shrink-0 text-[14px]/5 tabular-nums">₹27,10,400</span>
          </span>
          <span class="mt-0.5 block text-[13px]/5 text-zinc-600">Gujarat Polymers Ltd</span>
          <span class="mt-2 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-red-600" aria-hidden="true"></span>Overdue
            </span>
            <span class="text-[12px]/4 tabular-nums text-zinc-500">Due 02 Aug</span>
          </span>
        </span>
      </label>
    </li>
    <li class="[&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
      <label class="flex items-start gap-3 px-4 py-3">
        <input type="checkbox" aria-label="Select PO-24-1203"
               :checked="has('PO-24-1203')" @click="pick(3, $event)" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="flex items-baseline justify-between gap-3">
            <span class="text-[14px]/5 font-medium tabular-nums">PO-24-1203</span>
            <span class="shrink-0 text-[14px]/5 tabular-nums">₹96,750</span>
          </span>
          <span class="mt-0.5 block text-[13px]/5 text-zinc-600">Sharma Extrusions</span>
          <span class="mt-2 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-700 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-emerald-600" aria-hidden="true"></span>Closed
            </span>
            <span class="text-[12px]/4 tabular-nums text-zinc-500">Due 28 Jul</span>
          </span>
        </span>
      </label>
    </li>
    <li class="[&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
      <label class="flex items-start gap-3 px-4 py-3">
        <input type="checkbox" aria-label="Select PO-24-1206"
               :checked="has('PO-24-1206')" @click="pick(4, $event)" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span class="min-w-0 flex-1">
          <span class="flex items-baseline justify-between gap-3">
            <span class="text-[14px]/5 font-medium tabular-nums">PO-24-1206</span>
            <span class="shrink-0 text-[14px]/5 tabular-nums">₹1,32,900</span>
          </span>
          <span class="mt-0.5 block text-[13px]/5 text-zinc-600">Nashik Steel Traders</span>
          <span class="mt-2 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-[12px]/4 text-zinc-600 ring-1 ring-inset ring-zinc-300">
              <span class="size-1.5 rounded-full bg-zinc-400" aria-hidden="true"></span>Draft
            </span>
            <span class="text-[12px]/4 tabular-nums text-zinc-500">No due date</span>
          </span>
        </span>
      </label>
    </li>
  </ul>
</div>` },

      { id: 'states', name: 'Disabled, locked and invalid', code:
`<div data-kui="checkbox/states" class="max-w-xl space-y-5">
  <!-- disabled: out of the Tab order and out of the POST -->
  <div>
    <label class="flex items-start gap-2.5 text-[14px]/5 text-zinc-500">
      <input type="checkbox" disabled class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Auto-close the order on a full GRN</span>
    </label>
    <p class="mt-1 pl-[26px] text-[12px]/4 text-zinc-500">Locked by plant policy. It changes on the rate contract, not here.</p>
  </div>

  <!-- ticked and locked. disabled submits nothing at all, so a value that is
       already true and still has to reach the server travels in a hidden input
       beside the box. -->
  <div>
    <label class="flex items-start gap-2.5 text-[14px]/5 text-zinc-500">
      <input type="checkbox" checked disabled class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Three-way match against the invoice</span>
    </label>
    <input type="hidden" name="three_way_match" value="1">
    <p class="mt-1 pl-[26px] text-[12px]/4 tabular-nums text-zinc-500">Compulsory above ₹10,00,000.</p>
  </div>

  <!-- There is no read-only checkbox: readonly does nothing on one, so a box
       left readonly is a box anyone can still tick. A value nobody may change is
       not a control — render it. -->
  <div>
    <p class="text-[13px]/5 font-medium text-zinc-600">Partial receipt</p>
    <p class="mt-1 flex items-center gap-2 text-[14px]/5">
      <i data-lucide="check" class="size-4 shrink-0 text-zinc-600"></i>
      Allowed — set when the order was released
    </p>
  </div>

  <!-- required and unticked. The asterisk is decoration; required and
       aria-invalid are what is actually announced. -->
  <div>
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="checkbox" id="cb-declare" name="declared" required
             aria-invalid="true" aria-describedby="cb-declare-err"
             class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="tabular-nums">I have counted this material against GRN-24-0912 <span class="text-red-600">*</span></span>
    </label>
    <p id="cb-declare-err" class="mt-1 flex items-start gap-1.5 pl-[26px] text-[12px]/4 font-medium text-red-600">
      <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>
      The declaration has to be ticked before the GRN can be posted.
    </p>
  </div>
</div>` },

      { id: 'django', name: 'Django form field', code:
`<!-- forms.py
     class ApprovalForm(forms.Form):
         # required=True on a BooleanField means "must be ticked", so a flag that
         # is allowed to be off is required=False. Left at the default, the form
         # comes back invalid with "This field is required" the first time
         # somebody leaves the box alone.
         notify_vendor = forms.BooleanField(
             required=False, initial=True,
             label='Email the vendor when this order is approved',
             help_text='Goes to the contact on the rate contract.',
             widget=forms.CheckboxInput(attrs={
                 'class': 'mt-0.5 size-4 shrink-0 accent-zinc-700',
             }))

         notify = forms.MultipleChoiceField(
             required=False, choices=NOTIFY_CHOICES, label='Also notify',
             widget=forms.CheckboxSelectMultiple(attrs={
                 'class': 'mt-0.5 size-4 shrink-0 accent-zinc-700',
             }))

     An unticked box sends nothing at all — the name is simply absent from the
     POST, and CheckboxInput.value_from_datadict reads that absence as False.
     That is only safe while the form renders every field it cleans: a POST
     assembled from a subset of the fields clears every boolean it left out.

     Loop the bound field rather than printing {{ form.notify }}. The widget
     brings its own wrapper markup — a div per option since Django 4.0, a ul
     before that — and no amount of attrs will lay it out. Each iteration yields
     the input as {{ choice.tag }} and its text as {{ choice.choice_label }}. -->
<form data-kui="checkbox/django" method="post" class="max-w-xl">
  {% csrf_token %}

  <div>
    <label class="flex items-start gap-2.5 text-[14px]/5">
      {{ form.notify_vendor }}<span>{{ form.notify_vendor.label }}</span>
    </label>
    {% if form.notify_vendor.help_text %}
      <p class="mt-1 pl-[26px] text-[12px]/4 text-zinc-500">{{ form.notify_vendor.help_text }}</p>
    {% endif %}
  </div>

  <fieldset class="mt-5">
    <legend class="mb-2 text-[13px]/5 font-medium">{{ form.notify.label }}</legend>
    <div class="space-y-2">
      {% for choice in form.notify %}
        <label class="flex items-start gap-2.5 text-[14px]/5">
          {{ choice.tag }}<span>{{ choice.choice_label }}</span>
        </label>
      {% endfor %}
    </div>
    {% if form.notify.errors %}
      <p class="mt-2 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
        <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>{{ form.notify.errors.0 }}
      </p>
    {% endif %}
  </fieldset>

  <!-- Row selection is one repeated name, read back with
       request.POST.getlist('ids'). .get('ids') returns the last one and drops
       every other tick on the page. This list is rendered once — render it a
       second time for a phone layout and every ticked row posts twice, because a
       display:none checkbox still submits. -->
  <fieldset class="mt-5">
    <legend class="mb-2 text-[13px]/5 font-medium">Orders to approve</legend>
    <div class="space-y-2">
      {% for order in page_obj %}
        <label class="flex items-center gap-2.5 text-[13px]/5">
          <input type="checkbox" name="ids" value="{{ order.number }}"
                 {% if order.number in selected %}checked{% endif %}
                 class="size-4 shrink-0 accent-zinc-700">
          <span class="min-w-0 flex-1 truncate tabular-nums">{{ order.number }} · {{ order.vendor }}</span>
          <span class="shrink-0 tabular-nums text-zinc-600">₹{{ order.amount }}</span>
        </label>
      {% endfor %}
    </div>
  </fieldset>

  <button type="submit" class="mt-4 inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Approve selected</button>
</form>` }
    ]
  },

  {
    id: 'radio', name: 'Radio', category: 'forms',
    description: 'One of a set, and exactly one. Real native radios wearing accent-zinc-700, where the shared name is the group and the only way to mean none is an option that says so.',
    when: 'A question with one answer and a handful of options worth showing at once — payment terms, who inspects, which order a GRN is raised against. Options that do not exclude each other are checkboxes; a setting that applies the moment it is touched is a toggle; past about seven options, or with labels longer than a few words, it is a select.',
    notes: [
      'The name is the group. Not the fieldset, not the layout — grouping is by name within the form, so two fieldsets sharing a name are one question, and one typo in one option\'s name makes that option independently selectable. Nothing looks wrong until two are on at once and the POST carries an answer nobody chose.',
      'Every option carries a value. A radio without one posts on, exactly like every other option in the group, so the server receives priority=on and has no way to tell which of the three was picked — and the bug survives testing, because the field is present and the form validates.',
      'A radio cannot be unticked. Clicking the chosen option again does nothing, and a Clear button that unchecks it in script leaves the group posting no key at all, which the server cannot tell apart from a question nobody was asked. If "none", "any" or "not required" is a real answer it is an option with a value of its own; if the answer is genuinely independent it was a checkbox.',
      'Arrow keys move and select in one action, so a keyboard user passes through every option on the way to the one they want. Never hang anything irreversible off the change event — a group that fires a save, a fetch or a recalculation per keystroke fires it three times before the intended answer lands.',
      'Roving focus is native. The group is one Tab stop, the arrows wrap at both ends and skip disabled options, and none of it needs a line of code. Adding role="radio", aria-checked or tabindex to native inputs replaces working behaviour with a hand-written copy of it — that machinery belongs to the segmented track in button-group, whose options are buttons and have no semantics of their own.',
      'With nothing checked, the group is still one Tab stop and Tab lands on the first option. Checking one by default moves the tab target to it and changes what a bare POST means: everybody who never read the question has now answered it. Preselect the safe, common case, and preselect nothing at all when the choice has consequences.',
      'required on any one option applies to the whole group — the browser will not submit until something in it is checked. An unanswered group posts nothing: the key is absent, not empty, so a server that reads request.POST.get(\'priority\') gets None and a form field that was never rendered looks identical to a question that was skipped.',
      'Never disable a whole group to mean read-only. There is no readonly on a radio, and disabled options are excluded from submission, so a locked group posts nothing and clears the stored value on the next save. Render the settled answer as text, and add a hidden input beside it when it still has to travel.',
      'A register picks one row with one name across every row, and a nested list needs the line id inside the name — name="qc_{{ line.id }}" — or every line in the table becomes one group and the whole GRN can only have one result. Unlike a checkbox register the rows cannot be rendered twice for a phone layout: two copies sharing a name are a single group, and the checked option in the display:none copy wins.',
      'Keep the input in an option tile. A tile that hides its radio with sr-only and paints the choice as a tint alone loses the mark entirely in forced-colours mode, where the tint is not rendered — and the tint is exactly what has-[:checked] should be reading off the box, not replacing it.',
      'size-4 accent-zinc-700 shrink-0 and nothing else. rounded-full on a radio is inert — while appearance is auto the control ignores border-radius, and the box is already a circle — and appearance-none costs what the checkbox page says it costs.',
      'Django\'s RadioSelect has rendered a <div> per option since 4.0, a <ul><li> before that, so printing the field hands you that wrapper and no amount of attrs will lay it out. attrs are inherited by every option and also land on that wrapper div, which is how a size-4 class ends up sizing the container as well as the inputs. Loop the bound field instead.'
    ],
    anatomy: [
      ['Option', 'A real input type="radio", size-4 accent-zinc-700 shrink-0. No appearance-none, no rounded-full, no substitute drawn in CSS.'],
      ['Name', 'One string repeated across every option. This is what makes them exclusive — the fieldset is presentation, the name is the group.'],
      ['Value', 'What that option posts. Mandatory on every one of them: without it each option submits on and the answers are indistinguishable.'],
      ['Group', 'A fieldset whose legend is the question. Radios are never alone, so this is not optional the way it is for a single checkbox.'],
      ['Label', 'Wrapping the input as its direct child, so the text is part of the target and the row is not a 16px hit.'],
      ['Description', 'A 12px zinc-500 line per option, outside the label, indented with pl-[26px] and named by aria-describedby. Group-level help sits under the fieldset instead.'],
      ['Chosen tile', 'has-[:checked]:bg-zinc-100 with has-[:checked]:border-zinc-700, reading the box\'s own state so the tint cannot disagree with the answer.']
    ],
    behaviour: [
      'The group is one Tab stop. Tab enters on the checked option, or on the first when none is checked, and the next Tab leaves the group entirely rather than walking through the rest of it.',
      'Arrow keys move focus and change the answer together, wrapping past both ends and stepping over disabled options. Space is not needed and does nothing extra.',
      'Clicking the chosen option again leaves it chosen. The only way out of an answer is another answer, which is why "none" has to be one of them.',
      'Choosing one option releases the previous one silently — there is no intermediate state, so a group can never post two values or an empty one.',
      'A group with nothing checked submits no key at all. The difference between "none of them" and "the field was never on this form" comes from the form definition on the server, never from the request.',
      'A disabled option keeps its place and its explanation. Dropping it changes the shape of a list people scan by position, and re-enabling it later shifts every option below it.',
      'In a register the choice is the row, so there is no select-all and no bulk bar: the action beneath applies to exactly one record, and it is named in the footer so the answer is readable without hunting for the filled dot.'
    ],
    a11y: [
      'The fieldset and its legend are the question. Browsers already group the inputs by name and announce each option\'s position — "45 days from invoice date, radio button, 2 of 3" — but the group has no name at all without the legend, and "2 of 3" of what is then anybody\'s guess.',
      'No role="radiogroup", no role="radio", no aria-checked, no tabindex. Native radios carry all of it, and declaring the roles by hand means owning the roving tabindex and the arrow keys by hand too.',
      'Per-option help sits outside the label and is pointed at with aria-describedby. Inside the label it becomes part of that option\'s accessible name and is read back in full every time the arrow keys pass over it — three times on the way to the third option.',
      'required goes on every option in the group, not just the first, because only the focused option\'s own attribute is announced. Django does this for you: RadioSelect inherits attrs into each input.',
      'An error is real text under the group, referenced by aria-describedby from every option and paired with aria-invalid on each, since focus lands on one radio and only that one\'s description is read out.',
      'A radio in a register carries an aria-label naming the record — "Raise the GRN against PO-24-1187" — because ten radios all called "Select" say nothing about which row the cursor is on.',
      'No option carries outline-none. On a 16px control there is no room to draw a better focus ring than the UA one, and it is the only indicator that survives forced-colours mode.'
    ],
    related: ['checkbox', 'toggle', 'field'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- One name across the three options is the entire mechanism. Mistype it on
     one of them and that option quietly stops excluding the others.

     Nothing is preselected: this goes on the printed order, so it is a choice
     somebody has to make rather than one that makes itself for anybody who
     never read the question. -->
<fieldset data-kui="radio/default" class="max-w-xl">
  <legend class="mb-2 text-[13px]/5 font-medium">Payment terms</legend>

  <div class="space-y-2">
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="radio" name="terms" value="grn30" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="tabular-nums">30 days from GRN</span>
    </label>
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="radio" name="terms" value="inv45" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="tabular-nums">45 days from invoice date</span>
    </label>
    <label class="flex items-start gap-2.5 text-[14px]/5">
      <input type="radio" name="terms" value="advance" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span>Advance against proforma</span>
    </label>
  </div>

  <!-- one help line under the group; per-option help goes under its own option -->
  <p class="mt-2 text-[12px]/4 text-zinc-500">Printed on the order. Anything outside these three needs an amendment to the rate contract.</p>
</fieldset>` },

      { id: 'descriptions', name: 'Options with a description', code:
`<!-- Each description sits outside its label. Inside it, it becomes part of that
     option's accessible name, and the whole sentence is read back every time the
     arrow keys pass over the option — which, in a group, is on the way to every
     option after it. -->
<fieldset data-kui="radio/descriptions" class="max-w-xl">
  <legend class="mb-2 text-[13px]/5 font-medium">How this order is priced</legend>

  <div class="space-y-3">
    <div>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="radio" id="rd-rc" name="pricing" value="contract" checked
               aria-describedby="rd-rc-help"
               class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Rate contract</span>
      </label>
      <p id="rd-rc-help" class="mt-1 pl-[26px] text-[12px]/4 tabular-nums text-zinc-500">
        RC-2024-11 with Gujarat Polymers Ltd, valid to 31 Mar 2025. Rates are locked and the buyer cannot edit them.
      </p>
    </div>

    <div>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="radio" id="rd-qt" name="pricing" value="quotation"
               aria-describedby="rd-qt-help"
               class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Against a quotation</span>
      </label>
      <p id="rd-qt-help" class="mt-1 pl-[26px] text-[12px]/4 tabular-nums text-zinc-500">
        QT-24-0388, received 04 Aug. Expires 30 days from receipt.
      </p>
    </div>

    <div>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="radio" id="rd-manual" name="pricing" value="manual"
               aria-describedby="rd-manual-help"
               class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Manual rate</span>
      </label>
      <p id="rd-manual-help" class="mt-1 pl-[26px] text-[12px]/4 tabular-nums text-zinc-500">
        Needs a second approval above ₹2,00,000 and a reason on the order.
      </p>
    </div>
  </div>
</fieldset>` },

      { id: 'cards', name: 'Option tiles', code:
`<!-- No Alpine. :has() paints each tile from its own radio, so the tint is the
     answer rather than a second copy of it, and has-[:focus-visible] puts the
     focus indication somewhere it can be seen — a 3px halo drawn round a 16px
     circle lands on top of the circle.

     The radio stays visible inside the tile. Hidden with sr-only, the only mark
     of what was chosen is the tint, and forced-colours mode does not paint it.

     The hover tint carries the [&:not(:has(:checked))] guard: hover and chosen
     are one class each at equal specificity, and without it which one wins on a
     hovered chosen tile depends on the order Tailwind emits the variants. -->
<fieldset data-kui="radio/cards">
  <legend class="mb-2 text-[13px]/5 font-medium">Inspection before dispatch</legend>

  <div class="grid gap-2 sm:grid-cols-3">
    <label class="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-zinc-700/15">
      <input type="radio" name="inspection" value="vendor" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0">
        <span class="block text-[13px]/5 font-medium">At vendor works</span>
        <span class="mt-0.5 block text-[12px]/4 text-zinc-500">Gujarat Polymers Ltd, Vapi</span>
      </span>
    </label>

    <label class="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-zinc-700/15">
      <input type="radio" name="inspection" value="gate" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0">
        <span class="block text-[13px]/5 font-medium">At the plant gate</span>
        <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-500">Adds 1 day to the receipt</span>
      </span>
    </label>

    <label class="flex items-start gap-2.5 rounded-xl border border-zinc-200 bg-white p-3 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-zinc-700/15">
      <input type="radio" name="inspection" value="third_party" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0">
        <span class="block text-[13px]/5 font-medium">Third-party agency</span>
        <span class="mt-0.5 block text-[12px]/4 tabular-nums text-zinc-500">₹12,000 per visit, billed to the order</span>
      </span>
    </label>
  </div>
</fieldset>` },

      { id: 'inline', name: 'On one row', code:
`<!-- A row only works while every label is a word or two and the set is short.
     It wraps rather than scrolls at 390px, which is the whole reason gap-y is
     set as well as gap-x.

     Four one-word options that filter the view the moment they are touched are
     the segmented track in button-group instead; this shape is for a value that
     is part of the form and is saved with it. -->
<fieldset data-kui="radio/inline">
  <legend class="mb-2 text-[13px]/5 font-medium">Quantity unit</legend>

  <div class="flex flex-wrap gap-x-5 gap-y-2">
    <label class="flex items-center gap-2.5 text-[14px]/5">
      <input type="radio" name="uom" value="kg" checked class="size-4 shrink-0 accent-zinc-700">
      <span>kg</span>
    </label>
    <label class="flex items-center gap-2.5 text-[14px]/5">
      <input type="radio" name="uom" value="mt" class="size-4 shrink-0 accent-zinc-700">
      <span>MT</span>
    </label>
    <label class="flex items-center gap-2.5 text-[14px]/5">
      <input type="radio" name="uom" value="nos" class="size-4 shrink-0 accent-zinc-700">
      <span>Nos</span>
    </label>
    <label class="flex items-center gap-2.5 text-[14px]/5">
      <input type="radio" name="uom" value="ltr" class="size-4 shrink-0 accent-zinc-700">
      <span>Litres</span>
    </label>
  </div>

  <p class="mt-2 text-[12px]/4 text-zinc-500">Applies to every line on this order. Changing it does not convert the quantities already entered.</p>
</fieldset>` },

      { id: 'none', name: 'When none is an answer', code:
`<!-- A radio cannot be unticked. Clicking "Gujarat Polymers Ltd" a second time
     leaves it chosen, and a Clear button that unchecks it in script leaves the
     group posting no key at all — which the server cannot tell apart from a
     filter that was never on the page.

     So the way out is an option. "Any vendor" carries a value like every other
     option, is the checked default, and is the only thing that makes this group
     clearable at all. -->
<fieldset data-kui="radio/none" class="max-w-xs">
  <legend class="mb-2 text-[13px]/5 font-medium">Vendor</legend>

  <div class="space-y-2">
    <label class="flex items-center gap-2.5 text-[13px]/5">
      <input type="radio" name="vendor" value="" checked class="size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0 flex-1 truncate">Any vendor</span>
      <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">1,438</span>
    </label>
    <label class="flex items-center gap-2.5 text-[13px]/5">
      <input type="radio" name="vendor" value="gujarat-polymers" class="size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0 flex-1 truncate">Gujarat Polymers Ltd</span>
      <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">128</span>
    </label>
    <label class="flex items-center gap-2.5 text-[13px]/5">
      <input type="radio" name="vendor" value="sharma-extrusions" class="size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0 flex-1 truncate">Sharma Extrusions</span>
      <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">96</span>
    </label>
    <label class="flex items-center gap-2.5 text-[13px]/5">
      <input type="radio" name="vendor" value="silvassa-packaging" class="size-4 shrink-0 accent-zinc-700">
      <span class="min-w-0 flex-1 truncate">Silvassa Packaging and Allied Products</span>
      <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">41</span>
    </label>
  </div>

  <!-- The empty value is deliberate: it posts vendor= rather than nothing, so
       the view can tell "cleared the filter" from "never sent one". -->
  <p class="mt-2 text-[12px]/4 text-zinc-500">One vendor at a time. To compare two, use the checkbox filter list.</p>
</fieldset>` },

      { id: 'table', name: 'Picking one record', code:
`<!-- One name across every row is what makes this pick-one. Give each row its
     own name and every row becomes independently selectable; put a radio group
     inside each row of a nested list and the name needs the line id in it, or
     the whole table is one group.

     The rows are rendered once and columns drop out below md. A checkbox
     register can render a second copy for phones and keep the selection in
     Alpine, but a radio group cannot: two copies sharing a name are one group,
     and the checked option in the display:none copy is the one that wins.

     No select-all and no bulk bar. The answer is a single record, so it is named
     in the footer instead — the filled dot alone is not readable at a glance. -->
<div data-kui="radio/table" class="overflow-hidden rounded-xl border border-zinc-300 bg-white"
     x-data="{ po: 'PO-24-1191' }">
  <table class="w-full text-[13px]/5">
    <thead>
      <tr class="border-b border-zinc-200 text-left text-[11px]/4 font-medium tracking-wider text-zinc-600 uppercase">
        <th scope="col" class="w-10 px-4 py-2.5"><span class="sr-only">Raise against</span></th>
        <th scope="col" class="px-4 py-2.5 font-medium">Order</th>
        <th scope="col" class="hidden px-4 py-2.5 font-medium md:table-cell">Vendor</th>
        <th scope="col" class="px-4 py-2.5 text-right font-medium">Pending</th>
        <th scope="col" class="hidden px-4 py-2.5 text-right font-medium md:table-cell">Due</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-100 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
        <td class="px-4 py-2.5">
          <input type="radio" name="grn_against" value="PO-24-1187" x-model="po"
                 aria-label="Raise the GRN against PO-24-1187"
                 class="size-4 accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1187
          <span class="mt-0.5 block font-normal text-zinc-600 md:hidden">Sharma Extrusions</span>
        </td>
        <td class="hidden px-4 py-2.5 md:table-cell">Sharma Extrusions</td>
        <td class="px-4 py-2.5 text-right tabular-nums">2,000 kg</td>
        <td class="hidden px-4 py-2.5 text-right tabular-nums text-zinc-600 md:table-cell">12 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
        <td class="px-4 py-2.5">
          <input type="radio" name="grn_against" value="PO-24-1191" x-model="po"
                 aria-label="Raise the GRN against PO-24-1191"
                 class="size-4 accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1191
          <span class="mt-0.5 block font-normal text-zinc-600 md:hidden">Nashik Steel Traders</span>
        </td>
        <td class="hidden px-4 py-2.5 md:table-cell">Nashik Steel Traders</td>
        <td class="px-4 py-2.5 text-right tabular-nums">18 MT</td>
        <td class="hidden px-4 py-2.5 text-right tabular-nums text-zinc-600 md:table-cell">19 Aug</td>
      </tr>
      <tr class="border-b border-zinc-100 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
        <td class="px-4 py-2.5">
          <input type="radio" name="grn_against" value="PO-24-1194" x-model="po"
                 aria-label="Raise the GRN against PO-24-1194"
                 class="size-4 accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums">PO-24-1194
          <span class="mt-0.5 block font-normal text-zinc-600 md:hidden">Gujarat Polymers Ltd</span>
        </td>
        <td class="hidden px-4 py-2.5 md:table-cell">Gujarat Polymers Ltd</td>
        <td class="px-4 py-2.5 text-right tabular-nums">4,500 kg</td>
        <td class="hidden px-4 py-2.5 text-right tabular-nums text-zinc-600 md:table-cell">02 Aug</td>
      </tr>
      <!-- closed to receipt, and still in its place: dropping the row would
           change the shape of a list people scan by position -->
      <tr class="[&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:bg-zinc-100">
        <td class="px-4 py-2.5">
          <input type="radio" name="grn_against" value="PO-24-1203" disabled
                 aria-label="PO-24-1203, fully received, cannot be picked"
                 class="size-4 accent-zinc-700">
        </td>
        <td class="px-4 py-2.5 font-medium tabular-nums text-zinc-500">PO-24-1203
          <span class="mt-0.5 block font-normal text-zinc-500 md:hidden">Sharma Extrusions</span>
        </td>
        <td class="hidden px-4 py-2.5 text-zinc-500 md:table-cell">Sharma Extrusions</td>
        <td class="px-4 py-2.5 text-right tabular-nums text-zinc-500">Fully received</td>
        <td class="hidden px-4 py-2.5 text-right tabular-nums text-zinc-500 md:table-cell">—</td>
      </tr>
    </tbody>
  </table>

  <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-zinc-200 bg-zinc-100 px-4 py-2.5">
    <span class="text-[13px]/5 tabular-nums">Raising GRN against <span class="font-medium" x-text="po"></span></span>
    <button type="button" class="shrink-0 rounded-lg bg-zinc-700 px-3 py-1.5 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Continue</button>
  </div>
</div>` },

      { id: 'states', name: 'Default, locked and invalid', code:
`<div data-kui="radio/states" class="max-w-xl space-y-6">
  <!-- A checked default is also the tab target, and it is what a bare POST
       carries for everybody who never read the question. That is right for the
       ordinary case and wrong for a consequential one. -->
  <fieldset>
    <legend class="mb-2 text-[13px]/5 font-medium">Freight</legend>
    <div class="space-y-2">
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="radio" name="freight" value="for" checked class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>FOR destination — included in the rate</span>
      </label>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="radio" name="freight" value="exworks" class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Ex works — we arrange the vehicle</span>
      </label>
      <!-- disabled: out of the Tab order, skipped by the arrow keys, and out of
           the POST. It keeps its place and says why. -->
      <div>
        <label class="flex items-start gap-2.5 text-[14px]/5 text-zinc-500">
          <input type="radio" name="freight" value="topay" disabled class="mt-0.5 size-4 shrink-0 accent-zinc-700">
          <span>To pay</span>
        </label>
        <p class="mt-1 pl-[26px] text-[12px]/4 text-zinc-500">Not available on this rate contract.</p>
      </div>
    </div>
  </fieldset>

  <!-- Settled, and not editable here. Disabling the group would be worse than
       useless: disabled options submit nothing, so the stored value is cleared
       on the next save. The answer is rendered, and travels in a hidden input. -->
  <div>
    <p class="text-[13px]/5 font-medium text-zinc-600">Inspection</p>
    <p class="mt-1 flex items-center gap-2 text-[14px]/5">
      <i data-lucide="check" class="size-4 shrink-0 text-zinc-600"></i>
      At vendor works — fixed when the order was released
    </p>
    <input type="hidden" name="inspection" value="vendor">
  </div>

  <!-- Unanswered and required. required goes on every option, because only the
       focused one's attribute is announced, and the error is referenced from
       every option for the same reason. The asterisk is decoration. -->
  <fieldset>
    <legend class="mb-2 text-[13px]/5 font-medium">QC result for GRN-24-0912 <span class="text-red-600">*</span></legend>
    <div class="space-y-2">
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="radio" name="qc" value="pass" required aria-invalid="true" aria-describedby="rd-qc-err"
               class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Passed — release to stores</span>
      </label>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="radio" name="qc" value="deviation" required aria-invalid="true" aria-describedby="rd-qc-err"
               class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Passed on deviation — needs a plant head note</span>
      </label>
      <label class="flex items-start gap-2.5 text-[14px]/5">
        <input type="radio" name="qc" value="reject" required aria-invalid="true" aria-describedby="rd-qc-err"
               class="mt-0.5 size-4 shrink-0 accent-zinc-700">
        <span>Rejected — raise a debit note</span>
      </label>
    </div>
    <p id="rd-qc-err" class="mt-2 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
      <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>
      Pick a result. An unanswered group posts nothing at all, so the GRN cannot be saved half-decided.
    </p>
  </fieldset>
</div>` },

      { id: 'django', name: 'Django form field', code:
`<!-- forms.py
     class GrnForm(forms.Form):
         QC = [('pass', 'Passed — release to stores'),
               ('deviation', 'Passed on deviation — needs a plant head note'),
               ('reject', 'Rejected — raise a debit note')]

         # ChoiceField is required=True by default, which is usually right here:
         # an unanswered group posts no key at all, value_from_datadict reads it
         # as None and the form comes back with "This field is required".
         #
         # Leave initial off for a consequential choice. An initial= is checked
         # on first render, which makes it the tab target and makes it the answer
         # for everybody who submits without reading the question.
         qc = forms.ChoiceField(
             choices=QC, label='QC result',
             widget=forms.RadioSelect(attrs={
                 'class': 'mt-0.5 size-4 shrink-0 accent-zinc-700',
             }))

         # "Not required" is an option with a value of its own. A radio cannot be
         # unticked, so required=False buys nothing on its own — it only means
         # the form tolerates the empty POST that a group nobody touched sends.
         # With an option checked by default the group always posts, and "no
         # inspection" arrives as a decision rather than as silence.
         INSPECTION = [('none', 'Not required'),
                       ('gate', 'At the plant gate'),
                       ('third_party', 'Third-party agency')]

         inspection = forms.ChoiceField(
             choices=INSPECTION, initial='none', label='Inspection',
             widget=forms.RadioSelect(attrs={
                 'class': 'mt-0.5 size-4 shrink-0 accent-zinc-700',
             }))

     Loop the bound field rather than printing {{ form.qc }}. RadioSelect brings
     its own wrapper — a <div> per option since Django 4.0, a <ul><li> before
     that — and attrs will not lay it out: they are inherited into every option
     and also copied onto that wrapping div, so a size-4 class sizes the
     container as well as the inputs.

     Each iteration yields {{ choice.tag }} and {{ choice.choice_label }}, and
     {{ choice.id_for_label }} is that option's own id. On the field itself
     RadioSelect.id_for_label returns an empty string on purpose — a label
     pointing at the group would toggle the first option — so the question is a
     <legend>, never a <label for>.

     required is inherited into every option, which is what the browser needs to
     block the submit and what a screen reader needs to announce on whichever
     option has focus. -->
<form data-kui="radio/django" method="post" class="max-w-xl">
  {% csrf_token %}

  <fieldset>
    <legend class="mb-2 text-[13px]/5 font-medium">
      {{ form.qc.label }}{% if form.qc.field.required %} <span class="text-red-600">*</span>{% endif %}
    </legend>
    <div class="space-y-2">
      {% for choice in form.qc %}
        <label class="flex items-start gap-2.5 text-[14px]/5">
          {{ choice.tag }}<span>{{ choice.choice_label }}</span>
        </label>
      {% endfor %}
    </div>
    {% if form.qc.errors %}
      <p id="qc-err" class="mt-2 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
        <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>{{ form.qc.errors.0 }}
      </p>
    {% endif %}
  </fieldset>

  <fieldset class="mt-6">
    <legend class="mb-2 text-[13px]/5 font-medium">{{ form.inspection.label }}</legend>
    <div class="space-y-2">
      {% for choice in form.inspection %}
        <label class="flex items-start gap-2.5 text-[14px]/5">
          {{ choice.tag }}<span>{{ choice.choice_label }}</span>
        </label>
      {% endfor %}
    </div>
  </fieldset>

  <!-- A register picks one record with one name across every row, read back
       with request.POST.get('grn_against') — .getlist() is the checkbox idiom
       and returns a one-item list here. Render this list once: a second copy
       for a phone layout shares the name, so the two are a single group and the
       checked option in the display:none copy is the one that posts. -->
  <fieldset class="mt-6">
    <legend class="mb-2 text-[13px]/5 font-medium">Raise the GRN against</legend>
    <div class="space-y-2">
      {% for order in orders %}
        <label class="flex items-center gap-2.5 text-[13px]/5">
          <input type="radio" name="grn_against" value="{{ order.number }}"
                 {% if order.number == chosen %}checked{% endif %}
                 {% if order.fully_received %}disabled{% endif %}
                 required class="size-4 shrink-0 accent-zinc-700">
          <span class="min-w-0 flex-1 truncate tabular-nums">{{ order.number }} · {{ order.vendor }}</span>
          <span class="shrink-0 tabular-nums text-zinc-600">{{ order.pending }}</span>
        </label>
      {% endfor %}
    </div>
  </fieldset>

  <button type="submit" class="mt-4 inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Post GRN</button>
</form>` }
    ]
  },

  {
    id: 'toggle', name: 'Toggle', category: 'forms',
    description: 'A setting that takes effect the moment it is touched. A real checkbox carrying role="switch", with the track and the thumb beside it painted by peer-checked utilities.',
    when: 'A preference that applies at once and is undone just as fast: notifications on a vendor account, a filter over a register, a flag on a rate contract. If the change only lands when a Save button is pressed it is a checkbox, and if it has to be confirmed before it happens it is a button.',
    notes: [
      'Every switch here is a real <input type="checkbox"> with role="switch", hidden with sr-only peer, and the track and thumb are siblings painted by peer-checked. A <button role="switch"> is the other legal shape and it is the wrong one for a setting: it does not submit, it does not bind to a Django BooleanField, and it makes you write aria-checked and keep it in step by hand. The input gets the space bar, the label, form participation and the checked-to-aria-checked mapping for nothing.',
      'Never write aria-checked on the input. role="switch" on a native checkbox already maps the checked property onto it, and an attribute written once in markup does not move when the control does — which is how a switch ends up announced as off for the rest of the session. aria-checked is required only on the button form, and forbidden here.',
      'peer reaches siblings, not descendants. The thumb lives inside the track, so its travel is written on the track as peer-checked:[&>span]:translate-x-4. The obvious fix — wrapping input, track and thumb in a span so all three are siblings — moves the input one level down and silently drops the pointer, because the base cursor rule matches label:has(> input[type="checkbox"]). Keep the input as the label\'s direct child and reach the thumb through the track.',
      'The off track is a shape, so it takes a fill and a ring: bg-zinc-200 ring-1 ring-inset ring-zinc-300. A bg-zinc-100 track measures 1.00 against the zinc-100 page and vanishes, and on white it is a smudge with no edge. On is bg-zinc-700 with peer-checked:ring-zinc-700 — a solid shape needs no ring, and matching the ring to the fill is how you get that without the geometry changing between states.',
      'Focus is an outline, not a ring. The track has already spent its ring on the tinted edge, and ring-3 would replace it — a 3px inset halo eating the middle of a 20px pill at the exact moment the edge disappears. peer-focus-visible darkens the existing ring to zinc-700 and adds outline-3 outline-offset-2 outline-zinc-700/15 outside the pill, which is the same border-plus-halo the input wears, stacks with the ring, and is the one focus indicator that survives forced-colours mode.',
      'Never transition-all. The thumb takes transition-transform and the track transition-colors; nothing else moves. transition-all also picks up the focus outline, so the indicator fades in over 150ms and reads as no indicator at all to somebody tabbing through a settings list. Both carry motion-reduce:transition-none — a switch that jumps is still a switch.',
      'The state cannot be colour alone. In forced-colours mode every background is dropped, so bg-zinc-700 and bg-zinc-200 render identically; what survives is the thumb sitting at one end or the other, plus forced-colors:border on the track and the thumb to give the pill and the disc an edge. Do not put ON and OFF lettering inside the track either — it does not fit at 36×20, it does not translate, and it is the position that is doing the work.',
      'A switch inside a form with a Save button is a checkbox drawn wrong. The whole promise of the shape is that touching it is the write; put it above a Save and half the users will press Save and half will not, and the two groups get different results from the same gesture. Either the control writes on change, or it is a checkbox.',
      'No "Are you sure?" on a switch. A confirmation dialog says the action is worth stopping for, and anything worth stopping for is a button with a verb on it — Deactivate vendor, not a switch labelled Active. A switch is for settings whose undo is the same gesture as the do.',
      'Because it writes on change it owes an answer. htmx posts on change, the browser has already painted the new position, so the only work left is the undo: revert checked on a failed request and say so in the row. hx-sync="this:replace" aborts a write still in flight so two toggles inside a second cannot land out of order. A switch that silently lost the write is worse than a slow one, because the screen now disagrees with the database and nothing on it says so.',
      'The label names the setting; the switch carries the state. "Enabled" beside a switch that is off is a contradiction read aloud — announced, it comes out "Enabled, switch, off". Write what the setting does — "Email the buyer when an order is approved" — and let the position say whether it is happening.',
      'There is no mixed state. A checkbox has indeterminate; a switch has two positions and nothing to draw a third with, so a master switch over a group is not a select-all — it is a setting of its own ("send email at all") and the dependants keep their values while it is off. Clear them instead and turning the master back on hands the user a blank slate they have to rebuild from memory.'
    ],
    anatomy: [
      ['Track', 'The 36×20 pill: relative h-5 w-9, bg-zinc-200 with ring-1 ring-inset ring-zinc-300 off, bg-zinc-700 with a matching ring on. It owns the focus indicator, because the input it belongs to is sr-only and paints nothing.'],
      ['Thumb', 'An absolutely positioned size-4 white disc at top-0.5 left-0.5, moved to translate-x-4 by the track\'s peer-checked:[&>span] rule. Its position is the state; the fill only agrees with it.'],
      ['Input', 'A real checkbox with role="switch", class="peer sr-only", and a name if anything is ever going to submit it. Direct child of the label, before the track, or neither the peer selectors nor the pointer work.'],
      ['Label', 'Wraps the input and names the setting, not its state. It is also the target: the track is 20px tall and WCAG 2.2 asks for 24, so the label is the full width of the row and carries the padding that closes the gap.'],
      ['Help text', 'A 12px zinc-500 line outside the label, indented past the switch with pr-13 — the track plus the gap — and pointed at with aria-describedby. Inside the label it joins the switch\'s accessible name and is read back in full on every toggle.'],
      ['Status line', 'The row\'s answer: last changed, Saving, Saved, or Not saved with a way to try again. role="status", because the revert after a failed write is programmatic and a programmatic change to checked is announced by nothing.'],
      ['Row', 'Label left, switch right, one setting per row, divided by border-zinc-100 inside a bordered card. The switch is shrink-0 so a long setting name wraps rather than squeezing the pill.']
    ],
    behaviour: [
      'Touching it is the write. There is no Save button on a page of switches and no dirty state to track — the change is sent on change, and the row says what happened to it.',
      'The optimistic paint is free: the track and thumb are drawn from the input\'s own checked state, so the switch has already moved before the request leaves. All the code does is undo it — the failure handler flips checked back and the row reports it.',
      'A failed write reverts the switch to the value the server still holds and says so in words, with a Try again that re-applies what the user actually asked for rather than re-posting the reverted value.',
      'Two toggles inside a second are one intent, not two. hx-sync="this:replace" drops the request still in flight so the last position is the one the server ends on; without it the replies can land out of order and the row settles on the older one.',
      'Disabled and pending look nothing alike. Disabled drains the whole control to 60% and refuses the pointer; pending stays at full strength, still takes another toggle, and says Saving in the row. Drain a pending switch and you have told the user it is locked when it is not, and hidden which way they just set it.',
      'A master switch turns its dependants off without clearing them, so switching it back on restores the set somebody chose rather than an empty one. The dependants stay visible and disabled rather than disappearing — a list that changes length is a list nobody can scan by position.',
      'At 390px the row keeps its shape: the setting name wraps, the switch stays 36px on the right, and the help text runs under the name. Nothing scrolls sideways and nothing stacks the switch under its own label, where it stops looking like it belongs to it.'
    ],
    a11y: [
      'role="switch" on the native input is what makes it announce on and off instead of checked and unchecked. The checked property maps to aria-checked by itself, so nothing here writes aria-checked, and nothing should — an attribute set once in markup goes stale the first time the control moves.',
      'The label wraps the input and names the setting rather than its state. Help text stays outside the label and is attached with aria-describedby, or the whole explanation becomes part of the accessible name and is read back on every toggle.',
      'A switch on a record needs a name of its own: aria-label="Only overdue" on a filter, aria-label="Active — Gujarat Polymers Ltd" in a list. Twelve switches all called Active say nothing about which row the cursor is on.',
      'The focus indicator lives on the track, because the input is sr-only and paints nothing itself. It is an outline with an offset rather than a ring, so it stacks with the tinted edge and survives forced-colours mode, where box-shadows are dropped. Nothing here writes outline-none.',
      'The status line is a role="status" region. The user hears their own toggle, but the revert after a failed write is script setting checked, and a programmatic change is announced by nothing — without the live region the only sign the setting did not stick is a pixel moving back.',
      'State never rests on colour. Forced-colours mode drops the fills and both tracks render the same, so the thumb\'s position carries it, with forced-colors:border on the track and the thumb so the pill and the disc still have edges.',
      'Disabled uses the disabled attribute, which takes the switch out of the Tab order, and it keeps its position so the setting is still readable. A value nobody may ever change is not a dead switch — it is text, the way a locked checkbox is.'
    ],
    related: ['checkbox', 'radio', 'field'],
    variants: [
      { id: 'default', name: 'Default', code:
`<!-- A real checkbox with role="switch", sr-only so nothing of it is painted,
     and peer so the track beside it can read its state. The input is the
     label's direct child: move it into a wrapper to make the thumb a sibling
     and the base cursor rule, label:has(> input[type="checkbox"]), stops
     matching. peer only reaches siblings, so the thumb's travel is written on
     the track instead, as peer-checked:[&>span]:translate-x-4.

     The help text sits outside the label. Inside it, it joins the switch's
     accessible name and is read back in full on every toggle. pr-13 is the
     track plus the gap, so the sentence lines up under the setting name. -->
<div data-kui="toggle/default" class="max-w-xl">
  <label class="flex items-start justify-between gap-4 py-1">
    <span class="text-[14px]/5 tabular-nums">Auto-approve orders under ₹50,000</span>
    <input type="checkbox" role="switch" id="sw-auto" name="auto_approve" value="1" checked
           aria-describedby="sw-auto-help" class="peer sr-only">
    <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
      <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
    </span>
  </label>
  <p id="sw-auto-help" class="mt-1 pr-13 text-[12px]/4 text-zinc-500">
    Gujarat Polymers Ltd only. Applies from the next order — there is nothing to save.
  </p>
</div>` },

      { id: 'sizes', name: 'Sizes', code:
`<!-- Two sizes and no more. 36×20 is the settings row; 28×16 is for a toolbar
     or a table header, where the switch sits in a line of 13px controls and the
     full-size pill is taller than everything beside it.

     Neither track is a target on its own — 20px and 16px are both under the
     24px WCAG 2.2 asks for. The label is the target, and the padding on it is
     what closes the gap: py-1 round the small one takes the row to 24px, and a
     settings row is taller than that already. -->
<div data-kui="toggle/sizes" class="max-w-xl space-y-4">
  <label class="flex items-center justify-between gap-4 py-1">
    <span class="text-[14px]/5 tabular-nums">Default — 36×20, one setting per row</span>
    <input type="checkbox" role="switch" checked class="peer sr-only">
    <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
      <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
    </span>
  </label>

  <label class="flex items-center justify-between gap-3 py-1">
    <span class="text-[13px]/5 tabular-nums">Small — 28×16, in a toolbar or a table header</span>
    <input type="checkbox" role="switch" checked class="peer sr-only">
    <span class="relative h-4 w-7 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-3 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
      <span class="absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
    </span>
  </label>
</div>` },

      { id: 'list', name: 'Settings list', code:
`<!-- A page of switches has no Save button, and the header says so once rather
     than once per row. Each row is a label naming the setting — never its state
     — with the explanation outside the label and pointed at by
     aria-describedby.

     One locked row keeps its place and its position. Dropping it would change
     the shape of a list people scan by position, and repainting it to the off
     fill would say the setting is off when it is on and out of their hands. -->
<div data-kui="toggle/list" class="max-w-xl rounded-xl border border-zinc-300 bg-white">
  <div class="border-b border-zinc-200 px-4 py-3">
    <h3 class="text-[13px]/5 font-medium">Notifications — Gujarat Polymers Ltd</h3>
    <p class="mt-0.5 text-[12px]/4 text-zinc-500">Each switch applies as you set it. There is nothing to save.</p>
  </div>

  <div class="divide-y divide-zinc-100">
    <div class="px-4 py-2.5">
      <label class="flex items-start justify-between gap-4 py-1">
        <span class="text-[14px]/5">Email the vendor when an order is approved</span>
        <input type="checkbox" role="switch" name="notify_approved" value="1" checked
               aria-describedby="sw-approved-help" class="peer sr-only">
        <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
          <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
        </span>
      </label>
      <p id="sw-approved-help" class="mt-1 pr-13 text-[12px]/4 text-zinc-500">Goes to the contact on the rate contract, with the order PDF attached.</p>
    </div>

    <div class="px-4 py-2.5">
      <label class="flex items-start justify-between gap-4 py-1">
        <span class="text-[14px]/5">Email the buyer when a GRN is posted</span>
        <input type="checkbox" role="switch" name="notify_grn" value="1" checked
               aria-describedby="sw-grn-help" class="peer sr-only">
        <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
          <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
        </span>
      </label>
      <p id="sw-grn-help" class="mt-1 pr-13 text-[12px]/4 text-zinc-500">Short receipts are flagged in the same mail.</p>
    </div>

    <div class="px-4 py-2.5">
      <label class="flex items-start justify-between gap-4 py-1">
        <span class="text-[14px]/5 tabular-nums">Warn 30 days before the rate contract expires</span>
        <input type="checkbox" role="switch" name="notify_contract" value="1"
               aria-describedby="sw-contract-help" class="peer sr-only">
        <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
          <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
        </span>
      </label>
      <p id="sw-contract-help" class="mt-1 pr-13 text-[12px]/4 tabular-nums text-zinc-500">Current contract runs to 31 Mar 2027.</p>
    </div>

    <div class="px-4 py-2.5">
      <label class="flex items-start justify-between gap-4 py-1 has-[:disabled]:text-zinc-500">
        <span class="text-[14px]/5">Three-way match against the invoice</span>
        <input type="checkbox" role="switch" checked disabled
               aria-describedby="sw-match-help" class="peer sr-only">
        <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
          <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
        </span>
      </label>
      <p id="sw-match-help" class="mt-1 pr-13 text-[12px]/4 tabular-nums text-zinc-500">Compulsory above ₹10,00,000. It changes on the rate contract, not here.</p>
    </div>
  </div>

  <div class="border-t border-zinc-200 px-4 py-2.5">
    <p class="text-[12px]/4 tabular-nums text-zinc-500">Last changed 16 Aug 2026, 11:04 by Ritu Deshpande</p>
  </div>
</div>` },

      { id: 'group', name: 'Master and dependants', code:
`<!-- A switch has no third position, so a master over a group is not a
     select-all and never reads as mixed. It is a setting of its own — send
     email at all — and the dependants keep their values while it is off, so
     switching it back on restores the set somebody chose rather than an empty
     one.

     The dependants stay on screen and go disabled rather than disappearing: a
     list that changes length under the pointer is a list nobody can scan by
     position. peer-disabled:opacity-60 drains the whole switch in one go, which
     is why the drain sits on the track and not on the thumb inside it. -->
<fieldset data-kui="toggle/group" class="max-w-xl rounded-xl border border-zinc-300 bg-white" x-data="{ email: true }">
  <legend class="sr-only">Email notifications for Gujarat Polymers Ltd</legend>

  <div class="px-4 py-2.5">
    <label class="flex items-start justify-between gap-4 py-1">
      <span class="text-[14px]/5 font-medium">Email notifications</span>
      <input type="checkbox" role="switch" x-model="email"
             aria-describedby="sw-master-help" class="peer sr-only">
      <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
        <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
      </span>
    </label>
    <p id="sw-master-help" class="mt-1 pr-13 text-[12px]/4 text-zinc-500">
      Off stops every mail below without forgetting which of them were on.
    </p>
  </div>

  <div class="space-y-3.5 border-t border-zinc-100 px-4 py-3.5">
    <label class="flex items-center justify-between gap-4 py-1 has-[:disabled]:text-zinc-500">
      <span class="text-[13px]/5">Order approved</span>
      <input type="checkbox" role="switch" checked :disabled="!email" class="peer sr-only">
      <span class="relative h-4 w-7 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-3 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
        <span class="absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
      </span>
    </label>

    <label class="flex items-center justify-between gap-4 py-1 has-[:disabled]:text-zinc-500">
      <span class="text-[13px]/5">GRN posted against an order</span>
      <input type="checkbox" role="switch" checked :disabled="!email" class="peer sr-only">
      <span class="relative h-4 w-7 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-3 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
        <span class="absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
      </span>
    </label>

    <label class="flex items-center justify-between gap-4 py-1 has-[:disabled]:text-zinc-500">
      <span class="text-[13px]/5 tabular-nums">Payment due inside 3 days</span>
      <input type="checkbox" role="switch" :disabled="!email" class="peer sr-only">
      <span class="relative h-4 w-7 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-3 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
        <span class="absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
      </span>
    </label>
  </div>
</fieldset>` },

      { id: 'inline', name: 'In a toolbar', code:
`<!-- A filter is the honest inline switch: it applies the moment it is touched,
     the register below re-runs, and the count is the confirmation. A filter
     that only takes effect on an Apply button is a checkbox, and drawing it as
     a switch promises a write that never happens.

     The small track is 16px tall, so the label carries py-1.5 to bring the
     target to 28px. aria-label is not needed here — the text beside it is the
     label, and it names the filter rather than its state. -->
<div data-kui="toggle/inline" class="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5">
  <h3 class="text-[13px]/5 font-medium">Purchase orders</h3>
  <span class="text-[12px]/4 tabular-nums text-zinc-500">1,438 open · 84 overdue</span>

  <label class="ml-auto inline-flex items-center gap-2.5 py-1.5 text-[13px]/5">
    <span>Only overdue</span>
    <input type="checkbox" role="switch" name="overdue" value="1"
           hx-get="/orders/" hx-trigger="change" hx-target="#po-rows" hx-swap="innerHTML"
           hx-push-url="true" class="peer sr-only">
    <span class="relative h-4 w-7 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-3 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
      <span class="absolute top-0.5 left-0.5 size-3 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
    </span>
  </label>
</div>

<div id="po-rows" class="mt-3 rounded-xl border border-zinc-300 bg-white px-4 py-3">
  <p class="text-[13px]/5 tabular-nums text-zinc-600">PO-24-1187 · Gujarat Polymers Ltd · ₹18,42,000</p>
</div>` },

      { id: 'states', name: 'On, off, locked, saving, failed', code:
`<!-- Five rows, and the point of the last two is that they look nothing alike.
     Disabled drains the whole control to 60% and refuses the pointer, because
     nobody may move it. Pending stays at full strength and still takes another
     toggle, because it is a write in flight, not a locked control — drain it
     and you have told the user it is locked when it is not, and hidden which
     way they just set it.

     The locked row is on and stays on. Repainting a locked switch to the off
     fill would say the setting is off when it is on and out of their hands.

     The handlers behind Saving and Not saved are in the htmx variant; here the
     rows are pinned so both states can be read side by side. -->
<div data-kui="toggle/states" class="max-w-xl divide-y divide-zinc-100 rounded-xl border border-zinc-300 bg-white">
  <div class="px-4 py-2.5">
    <label class="flex items-center justify-between gap-4 py-1">
      <span class="text-[14px]/5">On — the setting is in force</span>
      <input type="checkbox" role="switch" checked class="peer sr-only">
      <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
        <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
      </span>
    </label>
  </div>

  <div class="px-4 py-2.5">
    <label class="flex items-center justify-between gap-4 py-1">
      <span class="text-[14px]/5">Off — a shape with a fill and a ring, not a gap</span>
      <input type="checkbox" role="switch" class="peer sr-only">
      <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
        <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
      </span>
    </label>
  </div>

  <div class="px-4 py-2.5">
    <label class="flex items-start justify-between gap-4 py-1 has-[:disabled]:text-zinc-500">
      <span class="text-[14px]/5">Locked — on, and not yours to change</span>
      <input type="checkbox" role="switch" checked disabled
             aria-describedby="sw-locked-help" class="peer sr-only">
      <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
        <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
      </span>
    </label>
    <p id="sw-locked-help" class="mt-1 pr-13 text-[12px]/4 tabular-nums text-zinc-500">Set by plant policy above ₹10,00,000.</p>
  </div>

  <div class="px-4 py-2.5">
    <label class="flex items-start justify-between gap-4 py-1">
      <span class="text-[14px]/5">Saving — moved, and the write is still out</span>
      <input type="checkbox" role="switch" checked aria-busy="true" class="peer sr-only">
      <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
        <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
      </span>
    </label>
    <p role="status" class="mt-1 flex items-center gap-1.5 pr-13 text-[12px]/4 text-zinc-500">
      <i data-lucide="loader-circle" class="size-3.5 shrink-0 animate-spin"></i>Saving
    </p>
  </div>

  <div class="px-4 py-2.5">
    <label class="flex items-start justify-between gap-4 py-1">
      <span class="text-[14px]/5">Failed — reverted, and said so</span>
      <input type="checkbox" role="switch" class="peer sr-only">
      <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
        <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
      </span>
    </label>
    <p role="status" class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 pr-13 text-[12px]/4 font-medium text-red-600">
      <span class="flex items-center gap-1.5"><i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>Not saved — the setting is unchanged</span>
      <button type="button" class="font-normal text-zinc-900 underline underline-offset-2">Try again</button>
    </p>
  </div>
</div>` },

      { id: 'htmx', name: 'Saved on change', code:
`<!-- htmx does the writing, because Alpine does not fetch. The optimistic paint
     is free: the track reads the input's own checked state, so the switch has
     already moved before the request leaves. The only code here is the undo.

     want is captured before the request, so Try again re-applies what the user
     asked for rather than re-posting the value the failure reverted to.

     hx-sync="this:replace" drops a write still in flight, so two toggles inside
     a second cannot land out of order and settle on the older reply.
     hx-swap="none" because the row already looks the way it should; the
     response only has to say whether it worked.

     One endpoint per setting is what makes the POST readable. An unticked
     checkbox posts nothing at all, so a body carrying only this field says off
     by its absence — the same absence inside a twelve-field form cannot be told
     from a field that was never rendered. Django also needs the CSRF token on
     the request; that is in the django variant.

     The status line is role="status" because the revert is script setting
     checked, and a programmatic change is announced by nothing. Without it the
     only sign the setting did not stick is a pixel moving back. -->
<div data-kui="toggle/htmx" class="max-w-xl rounded-xl border border-zinc-300 bg-white px-4 py-2.5"
     x-data="{ state: 'idle', want: true }"
     @htmx:before-request.camel="want = $refs.sw.checked; state = 'saving'"
     @htmx:after-request.camel="
       if ($event.detail.successful) { state = 'saved' }
       else { $refs.sw.checked = !want; state = 'failed' }">

  <label class="flex items-start justify-between gap-4 py-1">
    <span class="text-[14px]/5 tabular-nums">Auto-approve orders under ₹50,000</span>
    <input type="checkbox" role="switch" x-ref="sw" name="on" value="1" checked
           hx-post="/vendors/gujarat-polymers/settings/auto-approve/"
           hx-trigger="change" hx-swap="none" hx-sync="this:replace"
           class="peer sr-only">
    <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
      <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
    </span>
  </label>

  <p role="status" class="mt-1 pr-13 text-[12px]/4">
    <span x-show="state === 'idle'" class="tabular-nums text-zinc-500">Last changed 16 Aug 2026, 11:04 by Ritu Deshpande</span>

    <span x-show="state === 'saving'" x-cloak class="flex items-center gap-1.5 text-zinc-500">
      <i data-lucide="loader-circle" class="size-3.5 shrink-0 animate-spin"></i>Saving
    </span>

    <span x-show="state === 'saved'" x-cloak class="flex items-center gap-1.5 text-zinc-600">
      <i data-lucide="check" class="size-3.5 shrink-0 text-emerald-600"></i>Saved
    </span>

    <span x-show="state === 'failed'" x-cloak class="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-red-600">
      <span class="flex items-center gap-1.5">
        <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>Not saved — the setting is unchanged
      </span>
      <button type="button" class="font-normal text-zinc-900 underline underline-offset-2"
              @click="$refs.sw.checked = want; $refs.sw.dispatchEvent(new Event('change'))">Try again</button>
    </span>
  </p>
</div>` },

      { id: 'django', name: 'Django settings endpoint', code:
`<!-- forms.py
     class SettingForm(forms.Form):
         # required=False, always. On a BooleanField required=True means "must
         # be ticked", so a flag that is allowed to be off comes back invalid
         # with "This field is required" the first time somebody switches it off.
         on = forms.BooleanField(required=False)

     urls.py
         path('vendors/<slug:slug>/settings/<slug:key>/', views.vendor_setting,
              name='vendor-setting'),

     views.py
         @require_POST
         def vendor_setting(request, slug, key):
             vendor = get_object_or_404(Vendor, slug=slug)
             if key not in EDITABLE_SETTINGS:          # never setattr a POST key
                 return HttpResponseBadRequest()
             form = SettingForm(request.POST)
             form.is_valid()
             setattr(vendor, key, form.cleaned_data['on'])
             vendor.save(update_fields=[key])
             # 204 leaves the row alone: the browser painted the new position
             # before the request left. Anything 4xx or 5xx and the row's
             # after-request handler puts the switch back where it was.
             return HttpResponse(status=204)

     One endpoint per setting is what makes the absence readable: an unticked
     box posts nothing at all, and a body carrying only "on" says off by
     omission. There is deliberately no <form> and no Save button here — a
     switch above a Save is a checkbox that has been drawn wrong, and half the
     users will press Save and half will not.

     {{ form.on }} would render the bare input and you would still be writing
     the track and thumb around it, so the widget only exists to carry the
     attributes:

         widget=forms.CheckboxInput(attrs={
             'role': 'switch', 'class': 'peer sr-only',
             'hx-trigger': 'change', 'hx-swap': 'none', 'hx-sync': 'this:replace',
         })

     hx-headers sits on the card so every switch inside it sends the CSRF token;
     htmx will not find one without a form to read it from. -->
<div data-kui="toggle/django" class="max-w-xl divide-y divide-zinc-100 rounded-xl border border-zinc-300 bg-white"
     hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
  {% for setting in settings %}
    <div class="px-4 py-2.5"
         x-data="{ state: 'idle', want: false }"
         @htmx:before-request.camel="want = $refs.sw.checked; state = 'saving'"
         @htmx:after-request.camel="
           if ($event.detail.successful) { state = 'saved' }
           else { $refs.sw.checked = !want; state = 'failed' }">

      <label class="flex items-start justify-between gap-4 py-1 has-[:disabled]:text-zinc-500">
        <span class="text-[14px]/5 tabular-nums">{{ setting.label }}</span>
        <input type="checkbox" role="switch" x-ref="sw" name="on" value="1"
               {% if setting.on %}checked{% endif %}{% if setting.locked %} disabled{% endif %}
               aria-describedby="sw-{{ setting.key }}-help"
               hx-post="{% url 'vendor-setting' vendor.slug setting.key %}"
               hx-trigger="change" hx-swap="none" hx-sync="this:replace"
               class="peer sr-only">
        <span class="relative h-5 w-9 shrink-0 rounded-full bg-zinc-200 ring-1 ring-inset ring-zinc-300 transition-colors peer-checked:bg-zinc-700 peer-checked:ring-zinc-700 peer-checked:[&>span]:translate-x-4 peer-focus-visible:ring-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15 peer-disabled:opacity-60 motion-reduce:transition-none forced-colors:border">
          <span class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none forced-colors:border"></span>
        </span>
      </label>

      <p id="sw-{{ setting.key }}-help" class="mt-1 pr-13 text-[12px]/4 tabular-nums text-zinc-500">{{ setting.help }}</p>

      <p role="status" class="pr-13 text-[12px]/4">
        <span x-show="state === 'saving'" x-cloak class="mt-1 flex items-center gap-1.5 text-zinc-500">
          <i data-lucide="loader-circle" class="size-3.5 shrink-0 animate-spin"></i>Saving
        </span>
        <span x-show="state === 'saved'" x-cloak class="mt-1 flex items-center gap-1.5 text-zinc-600">
          <i data-lucide="check" class="size-3.5 shrink-0 text-emerald-600"></i>Saved
        </span>
        <span x-show="state === 'failed'" x-cloak class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-red-600">
          <span class="flex items-center gap-1.5">
            <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>Not saved — the setting is unchanged
          </span>
          <button type="button" class="font-normal text-zinc-900 underline underline-offset-2"
                  @click="$refs.sw.checked = want; $refs.sw.dispatchEvent(new Event('change'))">Try again</button>
        </span>
      </p>
    </div>
  {% endfor %}
</div>` }
    ]
  },

  {
    id: 'combobox', name: 'Combobox', category: 'forms',
    description: 'A text box that filters a list of records and commits one of them. The typing is a search; what reaches the server is a hidden input under it.',
    when: 'A field whose answer is one record out of more than about fifteen — a vendor, a cost centre, an item code. Below fifteen a native select costs no JavaScript and behaves correctly on a phone. For moving around the application rather than filling in a field, use the command palette: a palette navigates, a combobox posts.',
    notes: [
      'The visible box carries no name. It is a search field, not the value: name it vendor and the half-typed "guj" posts beside the vendor id, and request.POST[\'vendor\'] is whichever of the two the browser serialised last. One hidden input under the field is what submits, and in a multiselect it is one hidden input per value all sharing the name, read back with request.POST.getlist.',
      'Closing without committing restores the query to the label of the value still selected. Without that somebody types "nash", clicks away, and the field reads Nashik over a hidden value of gujarat-polymers — a field lying about itself, which no server validation catches because the POST is internally consistent.',
      'aria-activedescendant needs a real id on a real node. Inside template x-for the id is derived from the option — :id="\'cb-vendor-\' + o.id" — never from the loop index, because filtering renumbers the rows and the attribute then names whichever record moved into that slot. Key the loop on the same field or Alpine reuses nodes and the id and the row drift apart. The prefix belongs to the field, so a second combobox on the page needs a second prefix or both write the same ids.',
      'The popup is x-show, never x-if. aria-activedescendant may only reference a node that exists; under x-if the listbox is not in the document until the first open, and the attribute dangles for anything that reads the field before then.',
      'Never close on @blur. Blur fires on mousedown, before the click on the option is dispatched, so the row is hidden out from under the pointer and nothing is selectable by mouse at all — the defect reads as "clicking an option does nothing". Close on @click.outside on the root, which runs after the click has landed, and put @mousedown.prevent on the row so focus never leaves the input in the first place.',
      'aria-selected marks what is committed, not what the arrow keys are on. Bind it to the selection and let aria-activedescendant carry the highlight. Bound to the active index instead, every row arrowed past is announced as selected, which in a multiselect cannot be told apart from having actually ticked it.',
      'Alpine keeps aria-expanded and aria-selected when they are false and removes aria-activedescendant when it is null, which is what ARIA wants in both cases. So :aria-expanded="open" is correct and :aria-expanded="open ? \'true\' : \'false\'" is noise, and a getter returning null for the active id removes the attribute rather than leaving aria-activedescendant="" pointing at nothing.',
      'Escape stops propagating only while the list is open. Unconditional, it swallows the keystroke the surrounding dialog or sheet is waiting for, and that panel can no longer be dismissed from inside the field. First Escape closes the list, second Escape reaches the panel.',
      'Enter is prevented only while the list is open. An unconditional .prevent takes form submission away from the keyboard, and a two-field form whose first field is a combobox can then only be submitted by finding the button with a mouse.',
      'Arrow keys clamp at both ends, they do not wrap. Wrapping hides the fact that the list ended, and with a create row pinned last it lands on "Add new vendor" every time somebody overshoots the bottom. Home and End jump to the ends of the list while it is open and belong to the caret while it is closed, so they are prevented conditionally too.',
      'Focus alone does not open the list. Opening on @focus means tabbing through a form pops a listbox open at every combobox in it, and on a phone it fires as the keyboard slides up. Click, arrow keys and typing open it.',
      'The active row is scrolled into view with scrollIntoView({ block: \'nearest\' }) inside $nextTick. Plain scrollIntoView() scrolls the page as well as the list and drags the whole document under the field; behavior: \'smooth\' animates one row at a time and falls behind a held-down arrow key until the highlight is somewhere nobody can see.',
      'Zero matches renders an empty state naming the query, not an empty box. A popup that opens onto nothing reads as a component that broke rather than a search that found nothing.',
      'The result count is a role="status" that is in the document from first paint, outside the popup. A live region inserted with its text already in it announces nothing — the region has to exist before the content changes — so a count rendered inside the x-show popup is silent on the one keystroke that mattered.',
      'Disabling a combobox has to reach the hidden input. disabled on the search box only stops the typing; the hidden input has no appearance of its own and posts regardless, so a field somebody was told they could not change still submits its value. There is no read-only combobox either: readonly leaves the box focusable, the chevron still opens the list, and readonly means nothing at all on an option row. A value nobody may change is rendered as text with a hidden input beside it.',
      'A disabled option is aria-disabled, and aria-disabled blocks nothing. The arrow keys have to step over it and the click handler has to return early, or the row is unreachable by keyboard and fully clickable by mouse. It keeps its place in the list rather than disappearing, so a locked vendor does not change the shape of a set people scan by position.',
      'Select all takes what the filter is showing and the button says the number: "Select all 4 matching" with a query typed, "Select all 9" without one. A bulk control that quietly reaches past the rows on screen is the select-all-approves-4,312-orders problem again — people can only verify what they can see. Clear is deliberately not scoped the same way: it releases everything and its label carries the total, because a Clear that only released the matching rows would leave "3 selected" standing over a list with nothing ticked in it and no way back to the other three.',
      'A multiselect field has to show what is in it. A count alone — 3 / 9 in the corner of the box — is a selection nobody can see without opening the popup first, and it reads as a control that did not register the click. Chips in the field are the answer, and select-all is the one control that can fill the field with them, so it shows one name and collapses everything past it into a "+8 more" pill that opens the list. Two chips is one too many: at 390px the field is 300px wide, two names and the search input do not fit on one line, and the box grew a row at exactly two selections and shrank again at three. The cap hides nothing from the keyboard: every option, listed or not, is a row in the popup with its own tick, and toggling it there is what releases it.',
      'The search input inside a chip field needs a small minimum and a placeholder it never drops. flex-1 min-w-24 reserves 96px that the chips cannot leave room for, so the input is pushed onto a line of its own — and with the placeholder blanked out because there are chips to look at instead, that line renders as an empty row inside the box and reads as a rendering fault rather than a search field. min-w-16 plus a placeholder that never blanks is what keeps it a search field wherever it lands.',
      'The popup is left-0 right-0 under the field, never a fixed width. w-96 on a field inside a 390px viewport hangs off the right edge with nothing to scroll it back. An ancestor carrying overflow-hidden clips the panel instead — a card, a table wrapper — so the field needs position: relative and no clipping ancestor between it and the popup.',
      'Nothing inside role="option" may be focusable, so the tick on a multiselect row is a drawn square and not a real checkbox. A real box there is a tab stop inside a widget that is meant to have none, and if it carries a name it posts the value a second time beside the hidden input.',
      'Lucide icons inside template x-for do not exist when createIcons() first runs, because Alpine renders the rows after DOMContentLoaded. The page needs the guarded re-hydration loop — a MutationObserver calling createIcons() only while document.querySelector("[data-lucide]:not(svg)") finds something — or the ticks and the chip crosses come up empty. Bind x-show on a wrapping span, never on the <i>.',
      'htmx\'s trigger filter binds to the event name, not to the end of the spec: input[this.value.length > 1] changed delay:300ms. Written as input changed delay:300ms[…] it is parsed as part of the modifier and the floor never applies. And below that floor nothing fires at all, so deleting back to one character has to clear the rows in script or last search\'s answer stays on screen under a query that no longer produced it.',
      'In Django the multiselect field needs a widget whose value_from_datadict calls getlist — forms.MultipleHiddenInput or forms.SelectMultiple. A ModelMultipleChoiceField handed a plain HiddenInput reads the POST with .get(), which returns the last hidden input and drops every other vendor the user picked. Seed the option list with json_script and never interpolate a queryset into an x-data attribute: one vendor called M/s D\'Souza Traders ends the attribute early and the component stops parsing.'
    ],
    anatomy: [
      ['Field', 'The bordered box. It owns the focus ring through focus-within, as the input does, so the icon, the chips and the clear button sit inside the ring.'],
      ['Search input', 'role="combobox" with aria-autocomplete="list", aria-controls, aria-expanded and aria-activedescendant. It has no name — it is the search, not the value.'],
      ['Hidden input', 'What actually posts. One for a single select; one per value sharing a name for a multiselect.'],
      ['Popup', 'An absolutely positioned panel pinned to both edges of the field, x-show and x-cloak, holding a scrolling listbox.'],
      ['Option', 'role="option" with a stable id and aria-selected. The active row is tinted bg-zinc-100 and named by aria-activedescendant, which is a different fact from being selected.'],
      ['Chip', 'A committed value in a multiselect field: the graphite pill with its ring, a truncating label, and a remove button whose accessible name says which vendor it removes.'],
      ['Empty state', 'What the popup shows at zero matches — the query quoted back and the way out of it.'],
      ['Live region', 'A sr-only role="status" outside the popup, in the document from first paint, carrying the number of matches.']
    ],
    behaviour: [
      'Typing filters, and the first keystroke moves the highlight to the first match, so Enter always takes the row at the top of the list.',
      'Opening does not filter to the value already in the box. The query counts as a filter only once the user has typed, or a committed vendor reopens to a list of exactly one row.',
      'Arrow down and up move the highlight and clamp at the ends. Enter commits, Escape closes without committing and leaves focus in the input, Tab closes and moves on.',
      'The highlight follows the mouse as well as the keyboard, so the row under the pointer and the row Enter would take are never two different rows.',
      'A single select closes on commit and writes the label back into the box. A multiselect stays open, clears the query, and leaves the highlight on the row just toggled.',
      'Backspace on an empty query removes the last chip. It fires only when the query is empty, so it never eats a character somebody was still deleting.',
      'Select all applies to the rows the filter is showing and says how many that is; Clear releases everything and says how many that is.',
      'Selected values are chips in the field, not a number beside it. Where a bulk control can select nine at once the field shows one name and collapses everything past it into a pill, so the box holds a single row at every count and every width rather than growing one when the pill appears. The popup is where the whole selection is legible and every row can be toggled off.',
      'Remote options are fetched by htmx on a debounced input with a two-character floor. Alpine never fetches: it owns the open state and the keyboard, and because htmx replaced the rows without telling Alpine, the keyboard reads the option elements out of the DOM rather than out of an array.',
      'A value that is not in the list is offered as the last row whenever there is a query and no exact match, and it posts as text in a second field rather than as an invented id.'
    ],
    a11y: [
      'The input is role="combobox" with aria-expanded, aria-controls naming the listbox, aria-autocomplete="list" and aria-activedescendant naming the active option.',
      'The popup is role="listbox" with an accessible name, every row is role="option" with aria-selected, and a multiselect listbox carries aria-multiselectable="true".',
      'Focus never leaves the input. The highlight moves through aria-activedescendant, which is why every option needs a stable id and why no row is a tab stop.',
      'The number of matches is announced from a role="status" that was in the document before the count changed.',
      'Every chip remove button names its own option — "Remove Nashik Steel Traders" — because twelve buttons all called Remove say nothing about which one the cursor is on.',
      'Grouped options sit in role="group" with an aria-label, and the visible sticky heading is aria-hidden: the group is already named, and a bare paragraph is not a permitted child of a listbox.',
      'Escape closes the list and leaves focus in the input, and stops propagating only while the list is open, so a second Escape still reaches the dialog around it.',
      'A disabled field disables the hidden input as well as the box. An invalid field sets aria-invalid="true" and points aria-describedby at real text under it, never at a title attribute.'
    ],
    related: ['input', 'checkbox', 'command-palette'],
    variants: [
      { id: 'default', name: 'Single select', code:
`<!-- The box is a search field and carries no name. Name it vendor and the
     half-typed "guj" posts beside the vendor id, and the server reads whichever
     of the two came last. The hidden input is the field.

     close() writes the committed label back into the box, so the field cannot
     end up reading "nash" over a hidden value of gujarat-polymers.

     Escape and Enter are both conditional. Escape stops propagating only while
     the list is open, or it swallows the keystroke a surrounding dialog is
     waiting for; Enter is prevented only while the list is open, or the field
     takes form submission away from the keyboard. -->
<div data-kui="combobox/default" class="relative max-w-sm"
     x-data="{
       open: false, typed: false, q: 'Gujarat Polymers Ltd', sel: 'gujarat-polymers', ai: 0,
       options: [
         { id: 'gujarat-polymers', label: 'Gujarat Polymers Ltd', meta: 'VEN-0142' },
         { id: 'sharma-extrusions', label: 'Sharma Extrusions', meta: 'VEN-0187' },
         { id: 'nashik-steel', label: 'Nashik Steel Traders', meta: 'VEN-0203' },
         { id: 'deccan-fasteners', label: 'Deccan Fasteners Pvt Ltd', meta: 'VEN-0219' },
         { id: 'silvassa-packaging', label: 'Silvassa Packaging and Allied Products', meta: 'VEN-0231' },
         { id: 'konkan-chemicals', label: 'Konkan Chemicals Pvt Ltd', meta: 'VEN-0244' },
         { id: 'baroda-fasteners', label: 'Baroda Fasteners', meta: 'VEN-0258' },
         { id: 'coimbatore-castings', label: 'Coimbatore Castings Ltd', meta: 'VEN-0266' }
       ],
       get list() {
         if (!this.typed) return this.options;
         const s = this.q.trim().toLowerCase();
         return this.options.filter(o => (o.label + ' ' + o.meta).toLowerCase().includes(s));
       },
       get chosen() { return this.options.find(o => o.id === this.sel) || null; },
       rowId(o) { return 'cb-vendor-' + o.id; },
       get activeId() { return this.open && this.list[this.ai] ? this.rowId(this.list[this.ai]) : null; },
       scroll() { this.$nextTick(() => { const el = document.getElementById(this.activeId); if (el) el.scrollIntoView({ block: 'nearest' }); }); },
       show() {
         if (this.open) return;
         this.open = true; this.typed = false;
         this.ai = Math.max(0, this.list.findIndex(o => o.id === this.sel));
         this.scroll();
       },
       close() { this.open = false; this.typed = false; this.q = this.chosen ? this.chosen.label : ''; },
       move(n) {
         if (!this.open) { this.show(); return; }
         if (!this.list.length) return;
         this.ai = Math.min(this.list.length - 1, Math.max(0, this.ai + n));
         this.scroll();
       },
       edge(end) { if (!this.list.length) return; this.ai = end ? this.list.length - 1 : 0; this.scroll(); },
       pick(o) { this.sel = o.id; this.close(); this.$refs.q.focus(); },
       commit() { const o = this.list[this.ai]; if (o) this.pick(o); },
       clear() { this.sel = null; this.q = ''; this.typed = false; this.open = false; this.$refs.q.focus(); }
     }"
     @click.outside="close()"
     @keydown.escape="if (open) { $event.stopPropagation(); close(); $refs.q.focus() }">

  <label for="cb-vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor <span class="text-red-600">*</span></label>

  <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>

    <!-- no @focus handler: opening on focus pops a listbox at every combobox
         somebody tabs through, and fires as the keyboard slides up on a phone.
         Click, arrows and typing open it. -->
    <input id="cb-vendor" x-ref="q" x-model="q" type="text" role="combobox" autocomplete="off"
           aria-autocomplete="list" aria-controls="cb-vendor-list" aria-describedby="cb-vendor-help"
           :aria-expanded="open" :aria-activedescendant="activeId"
           placeholder="Search 248 approved vendors"
           @click="show()"
           @input="typed = true; open = true; ai = 0"
           @keydown.arrow-down.prevent="move(1)"
           @keydown.arrow-up.prevent="move(-1)"
           @keydown.home="if (open) { $event.preventDefault(); edge(false) }"
           @keydown.end="if (open) { $event.preventDefault(); edge(true) }"
           @keydown.enter="if (open) { $event.preventDefault(); commit() }"
           @keydown.tab="close()"
           class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">

    <button type="button" x-show="sel" x-cloak @click="clear()" aria-label="Clear the selected vendor"
            class="mr-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
      <i data-lucide="x" class="size-4"></i>
    </button>

    <!-- the rotation goes on a wrapping span. createIcons() replaces the <i>
         with an <svg> and takes any binding on it with it. -->
    <button type="button" tabindex="-1" aria-hidden="true" @click="open ? close() : (show(), $refs.q.focus())"
            class="mr-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100">
      <span class="flex transition-transform motion-reduce:transition-none" :class="open && 'rotate-180'">
        <i data-lucide="chevron-down" class="size-4"></i>
      </span>
    </button>
  </div>

  <!-- what actually posts -->
  <input type="hidden" name="vendor" :value="sel || ''">

  <p id="cb-vendor-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Only vendors with a live rate contract are listed.</p>

  <!-- outside the popup and in the document from first paint. A live region
       inserted with its text already in it announces nothing. -->
  <p role="status" class="sr-only"
     x-text="open ? (list.length === 1 ? '1 vendor matches' : list.length + ' vendors match') : ''"></p>

  <div x-show="open" x-cloak
       class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

    <div id="cb-vendor-list" role="listbox" aria-label="Approved vendors" class="max-h-64 overflow-y-auto py-1">
      <template x-for="(o, i) in list" :key="o.id">
        <div :id="rowId(o)" role="option" :aria-selected="o.id === sel"
             @mousedown.prevent @click="pick(o)" @mousemove="ai = i"
             :class="i === ai ? 'bg-zinc-100' : ''"
             class="flex items-center gap-2.5 px-3 py-2 text-[13px]/5">
          <span class="min-w-0 flex-1 truncate" x-text="o.label"></span>
          <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500" x-text="o.meta"></span>
          <span class="flex size-4 shrink-0 items-center justify-center" x-show="o.id === sel" x-cloak>
            <i data-lucide="check" class="size-4 text-zinc-600"></i>
          </span>
        </div>
      </template>
    </div>

    <!-- an empty popup reads as a component that broke; this reads as a search
         that found nothing -->
    <div x-show="!list.length" x-cloak class="px-4 py-6 text-center">
      <p class="text-[13px]/5 font-medium">No vendor matches “<span x-text="q"></span>”</p>
      <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">Check the spelling, or search by vendor code — VEN-0142.</p>
    </div>
  </div>
</div>` },

      { id: 'multi', name: 'Multiselect with chips', code:
`<!-- One hidden input per value, all sharing the name, which Django reads with
     request.POST.getlist('vendor'). .get() returns the last one and drops every
     other vendor the user picked.

     The chips wrap inside the field and every label truncates, so a name like
     Silvassa Packaging and Allied Products cannot push the box wider than the
     390px viewport it is sitting in.

     Each remove button names its own vendor: twelve buttons all called Remove
     say nothing about which chip the cursor is on. They are real tab stops,
     which is the price of being reachable at all — Backspace on an empty query
     is the fast way out. -->
<div data-kui="combobox/multi" class="relative max-w-md"
     x-data="{
       open: false, typed: false, q: '', ai: 0,
       sel: ['gujarat-polymers', 'nashik-steel'],
       options: [
         { id: 'gujarat-polymers', label: 'Gujarat Polymers Ltd', meta: 'VEN-0142' },
         { id: 'sharma-extrusions', label: 'Sharma Extrusions', meta: 'VEN-0187' },
         { id: 'nashik-steel', label: 'Nashik Steel Traders', meta: 'VEN-0203' },
         { id: 'deccan-fasteners', label: 'Deccan Fasteners Pvt Ltd', meta: 'VEN-0219' },
         { id: 'silvassa-packaging', label: 'Silvassa Packaging and Allied Products', meta: 'VEN-0231' },
         { id: 'konkan-chemicals', label: 'Konkan Chemicals Pvt Ltd', meta: 'VEN-0244' },
         { id: 'baroda-fasteners', label: 'Baroda Fasteners', meta: 'VEN-0258' },
         { id: 'coimbatore-castings', label: 'Coimbatore Castings Ltd', meta: 'VEN-0266' }
       ],
       get list() {
         if (!this.typed) return this.options;
         const s = this.q.trim().toLowerCase();
         return this.options.filter(o => (o.label + ' ' + o.meta).toLowerCase().includes(s));
       },
       has(id) { return this.sel.includes(id); },
       label(id) { const o = this.options.find(x => x.id === id); return o ? o.label : id; },
       rowId(o) { return 'cb-rfq-' + o.id; },
       get activeId() { return this.open && this.list[this.ai] ? this.rowId(this.list[this.ai]) : null; },
       scroll() { this.$nextTick(() => { const el = document.getElementById(this.activeId); if (el) el.scrollIntoView({ block: 'nearest' }); }); },
       show() { if (!this.open) { this.open = true; this.typed = false; this.ai = 0; this.scroll(); } },
       close() { this.open = false; this.typed = false; this.q = ''; },
       move(n) {
         if (!this.open) { this.show(); return; }
         if (!this.list.length) return;
         this.ai = Math.min(this.list.length - 1, Math.max(0, this.ai + n));
         this.scroll();
       },
       edge(end) { if (!this.list.length) return; this.ai = end ? this.list.length - 1 : 0; this.scroll(); },
       toggle(o) {
         this.sel = this.has(o.id) ? this.sel.filter(v => v !== o.id) : [...this.sel, o.id];
         this.q = ''; this.typed = false;
         this.ai = Math.max(0, this.list.findIndex(x => x.id === o.id));
         this.$refs.q.focus();
       },
       drop(id) { this.sel = this.sel.filter(v => v !== id); this.$refs.q.focus(); },
       commit() { const o = this.list[this.ai]; if (o) this.toggle(o); }
     }"
     @click.outside="close()"
     @keydown.escape="if (open) { $event.stopPropagation(); close(); $refs.q.focus() }">

  <label for="cb-rfq" class="mb-1.5 block text-[13px]/5 font-medium">Send this RFQ to</label>

  <div @click="$refs.q.focus(); show()"
       class="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">

    <template x-for="id in sel" :key="id">
      <span class="inline-flex max-w-full items-center gap-1 rounded-full bg-zinc-200 py-0.5 pr-1 pl-2.5 text-[12px]/4 ring-1 ring-inset ring-zinc-300">
        <span class="min-w-0 truncate" x-text="label(id)"></span>
        <button type="button" :aria-label="'Remove ' + label(id)" @click.stop="drop(id)"
                class="flex size-4 shrink-0 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-300 hover:text-zinc-900">
          <i data-lucide="x" class="size-3"></i>
        </button>
      </span>
    </template>

    <input id="cb-rfq" x-ref="q" x-model="q" type="text" role="combobox" autocomplete="off"
           aria-autocomplete="list" aria-controls="cb-rfq-list" aria-describedby="cb-rfq-count"
           :aria-expanded="open" :aria-activedescendant="activeId"
           :placeholder="sel.length ? 'Search' : 'Search vendors'"
           @input="typed = true; open = true; ai = 0"
           @keydown.arrow-down.prevent="move(1)"
           @keydown.arrow-up.prevent="move(-1)"
           @keydown.home="if (open) { $event.preventDefault(); edge(false) }"
           @keydown.end="if (open) { $event.preventDefault(); edge(true) }"
           @keydown.enter="if (open) { $event.preventDefault(); commit() }"
           @keydown.backspace="if (!q && sel.length) { $event.preventDefault(); sel = sel.slice(0, -1) }"
           @keydown.tab="close()"
           class="min-w-16 flex-1 bg-transparent px-1 py-1 text-[14px]/5 outline-none placeholder:text-zinc-500">
  </div>

  <!-- one hidden input per value, all sharing the name -->
  <template x-for="id in sel" :key="'post-' + id">
    <input type="hidden" name="vendor" :value="id">
  </template>

  <div class="mt-1.5 flex items-start justify-between gap-3">
    <p id="cb-rfq-count" class="text-[12px]/4 tabular-nums text-zinc-500"
       x-text="sel.length ? sel.length + ' of 8 vendors selected' : 'No vendor selected — the RFQ will not be sent'"></p>
    <button type="button" x-show="sel.length" x-cloak @click="sel = []"
            class="shrink-0 text-[12px]/4 tabular-nums text-zinc-900 underline underline-offset-2">
      Clear all <span x-text="sel.length"></span>
    </button>
  </div>

  <p role="status" class="sr-only"
     x-text="open ? (list.length === 1 ? '1 vendor matches' : list.length + ' vendors match') : ''"></p>

  <div x-show="open" x-cloak
       class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

    <div id="cb-rfq-list" role="listbox" aria-multiselectable="true" aria-label="Approved vendors"
         class="max-h-64 overflow-y-auto py-1">
      <template x-for="(o, i) in list" :key="o.id">
        <!-- the tick is a drawn square, not an input. Nothing inside
             role="option" may be focusable, and a real checkbox carrying a name
             here would post every ticked vendor a second time. -->
        <div :id="rowId(o)" role="option" :aria-selected="has(o.id)"
             @mousedown.prevent @click="toggle(o)" @mousemove="ai = i"
             :class="i === ai ? 'bg-zinc-100' : ''"
             class="flex items-center gap-2.5 px-3 py-2 text-[13px]/5">
          <span class="flex size-4 shrink-0 items-center justify-center rounded"
                :class="has(o.id) ? 'bg-zinc-700 text-white' : 'bg-white ring-1 ring-inset ring-zinc-300'">
            <span class="flex" x-show="has(o.id)" x-cloak><i data-lucide="check" class="size-3"></i></span>
          </span>
          <span class="min-w-0 flex-1 truncate" x-text="o.label"></span>
          <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500" x-text="o.meta"></span>
        </div>
      </template>
    </div>

    <div x-show="!list.length" x-cloak class="px-4 py-6 text-center">
      <p class="text-[13px]/5 font-medium">No vendor matches “<span x-text="q"></span>”</p>
      <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">Search by vendor code instead — VEN-0142.</p>
    </div>
  </div>
</div>` },

      { id: 'select-all', name: 'Select all, scoped to the filter', code:
`<!-- Select all takes the rows the filter is showing, and the button says the
     number out loud: "Select all 4 matching" with a query typed, "Select all 9"
     without one. A bulk control that quietly reaches past what is on screen is
     the same defect as a select-all that approves 4,312 orders when five are
     visible — people can only verify what they can see.

     Clear is deliberately not scoped the same way. It releases everything and
     its label carries the total, because a Clear that only released the
     matching rows would leave "3 selected" standing over a list with nothing
     ticked in it, and no route back to the other three.

     The line under the buttons only appears while a query is typed, so the
     asymmetry is on screen rather than in the documentation. -->
<div data-kui="combobox/select-all" class="relative max-w-md"
     x-data="{
       open: false, typed: false, q: '', ai: 0,
       sel: ['cc-1200', 'cc-3100'],
       options: [
         { id: 'cc-1100', label: 'Injection moulding', meta: 'CC-1100' },
         { id: 'cc-1200', label: 'Extrusion', meta: 'CC-1200' },
         { id: 'cc-1300', label: 'Blow moulding', meta: 'CC-1300' },
         { id: 'cc-2100', label: 'Tool room', meta: 'CC-2100' },
         { id: 'cc-2200', label: 'Maintenance', meta: 'CC-2200' },
         { id: 'cc-3100', label: 'Quality lab', meta: 'CC-3100' },
         { id: 'cc-3200', label: 'Stores', meta: 'CC-3200' },
         { id: 'cc-4100', label: 'Dispatch', meta: 'CC-4100' },
         { id: 'cc-5100', label: 'Plant administration', meta: 'CC-5100' }
       ],
       get filtering() { return this.typed && this.q.trim().length > 0; },
       get list() {
         if (!this.filtering) return this.options;
         const s = this.q.trim().toLowerCase();
         return this.options.filter(o => (o.label + ' ' + o.meta).toLowerCase().includes(s));
       },
       get allShown() { return this.list.length > 0 && this.list.every(o => this.sel.includes(o.id)); },
       cap: 1,
       get chips() { return this.sel.length > this.cap ? this.sel.slice(0, 1) : this.sel; },
       get extra() { return this.sel.length - this.chips.length; },
       has(id) { return this.sel.includes(id); },
       label(id) { const o = this.options.find(x => x.id === id); return o ? o.label : id; },
       drop(id) { this.sel = this.sel.filter(v => v !== id); this.$refs.q.focus(); },
       rowId(o) { return 'cb-cc-' + o.id; },
       get activeId() { return this.open && this.list[this.ai] ? this.rowId(this.list[this.ai]) : null; },
       scroll() { this.$nextTick(() => { const el = document.getElementById(this.activeId); if (el) el.scrollIntoView({ block: 'nearest' }); }); },
       show() { if (!this.open) { this.open = true; this.typed = false; this.ai = 0; this.scroll(); } },
       close() { this.open = false; this.typed = false; this.q = ''; },
       move(n) {
         if (!this.open) { this.show(); return; }
         if (!this.list.length) return;
         this.ai = Math.min(this.list.length - 1, Math.max(0, this.ai + n));
         this.scroll();
       },
       toggle(o) {
         this.sel = this.has(o.id) ? this.sel.filter(v => v !== o.id) : [...this.sel, o.id];
         this.$refs.q.focus();
       },
       takeShown() { this.sel = [...new Set([...this.sel, ...this.list.map(o => o.id)])]; this.$refs.q.focus(); },
       clearAll() { this.sel = []; this.$refs.q.focus(); },
       commit() { const o = this.list[this.ai]; if (o) this.toggle(o); }
     }"
     @click.outside="close()"
     @keydown.escape="if (open) { $event.stopPropagation(); close(); $refs.q.focus() }">

  <label for="cb-cc" class="mb-1.5 block text-[13px]/5 font-medium">Cost centres this expense is split across</label>

  <!-- Select all is the control that produces a wall of chips, so the field
       lists one name and collapses everything past it into a +N more pill
       that opens the list. The cap is one, not two: a 390px viewport gives this
       field 300px, and two names plus the search input do not fit on one line —
       measured, the box stood at 42px with one selection, grew to 68px at two,
       and dropped back to 42px at three, which reads as the field flinching. One
       chip plus the pill holds one row at every count and every width here.

       Nothing is hidden from the keyboard by the cap: every option, listed or
       not, is a row in the popup with its own tick, and toggling it there is
       what releases it. A field carrying only a count — 3 / 9 — is what this
       replaced, and it left a selection nobody could see without opening the
       popup first. -->
  <div @click="$refs.q.focus(); show()"
       class="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">

    <template x-for="id in chips" :key="id">
      <span class="inline-flex max-w-full items-center gap-1 rounded-full bg-zinc-200 py-0.5 pr-1 pl-2.5 text-[12px]/4 ring-1 ring-inset ring-zinc-300">
        <span class="min-w-0 truncate" x-text="label(id)"></span>
        <button type="button" :aria-label="'Remove ' + label(id)" @click.stop="drop(id)"
                class="flex size-4 shrink-0 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-300 hover:text-zinc-900">
          <i data-lucide="x" class="size-3"></i>
        </button>
      </span>
    </template>

    <button type="button" x-show="extra" x-cloak @click.stop="$refs.q.focus(); show()"
            :aria-label="extra + ' more selected — open the list to see all ' + sel.length"
            class="inline-flex shrink-0 items-center rounded-full bg-zinc-200 px-2.5 py-0.5 text-[12px]/4 tabular-nums text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span x-text="'+' + extra + ' more'"></span>
    </button>

    <input id="cb-cc" x-ref="q" x-model="q" type="text" role="combobox" autocomplete="off"
           aria-autocomplete="list" aria-controls="cb-cc-list" aria-describedby="cb-cc-count"
           :aria-expanded="open" :aria-activedescendant="activeId"
           :placeholder="sel.length ? 'Search' : 'Search cost centres'"
           @input="typed = true; open = true; ai = 0"
           @keydown.arrow-down.prevent="move(1)"
           @keydown.arrow-up.prevent="move(-1)"
           @keydown.enter="if (open) { $event.preventDefault(); commit() }"
           @keydown.backspace="if (!q && sel.length) { $event.preventDefault(); sel = sel.slice(0, -1) }"
           @keydown.tab="close()"
           class="min-w-16 flex-1 bg-transparent px-1 py-1 text-[14px]/5 outline-none placeholder:text-zinc-500">
  </div>

  <template x-for="id in sel" :key="'post-' + id">
    <input type="hidden" name="cost_centre" :value="id">
  </template>

  <p id="cb-cc-count" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500"
     x-text="sel.length ? sel.length + ' of 9 cost centres selected' : 'No cost centre selected — the expense stays unallocated'"></p>

  <p role="status" class="sr-only"
     x-text="open ? (list.length === 1 ? '1 cost centre matches' : list.length + ' cost centres match') : ''"></p>

  <div x-show="open" x-cloak
       class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-zinc-200 px-3 py-2">
      <button type="button" @mousedown.prevent @click="takeShown()" :disabled="allShown"
              class="text-[12px]/4 font-medium tabular-nums text-zinc-900 underline underline-offset-2 disabled:text-zinc-400 disabled:no-underline">
        <span x-text="filtering ? 'Select all ' + list.length + ' matching' : 'Select all ' + options.length"></span>
      </button>
      <button type="button" @mousedown.prevent @click="clearAll()" :disabled="!sel.length"
              class="text-[12px]/4 tabular-nums text-zinc-600 underline underline-offset-2 disabled:text-zinc-400 disabled:no-underline">
        <span x-text="'Clear all ' + sel.length"></span>
      </button>
    </div>

    <p x-show="filtering" x-cloak
       class="border-b border-zinc-200 bg-zinc-100 px-3 py-1.5 text-[12px]/4 tabular-nums text-zinc-600"
       x-text="'Select all takes the ' + list.length + ' rows shown. The other ' + (options.length - list.length) + ' are left as they are, and Clear releases all ' + sel.length + '.'"></p>

    <div id="cb-cc-list" role="listbox" aria-multiselectable="true" aria-label="Cost centres"
         class="max-h-64 overflow-y-auto py-1">
      <template x-for="(o, i) in list" :key="o.id">
        <div :id="rowId(o)" role="option" :aria-selected="has(o.id)"
             @mousedown.prevent @click="toggle(o)" @mousemove="ai = i"
             :class="i === ai ? 'bg-zinc-100' : ''"
             class="flex items-center gap-2.5 px-3 py-2 text-[13px]/5">
          <span class="flex size-4 shrink-0 items-center justify-center rounded"
                :class="has(o.id) ? 'bg-zinc-700 text-white' : 'bg-white ring-1 ring-inset ring-zinc-300'">
            <span class="flex" x-show="has(o.id)" x-cloak><i data-lucide="check" class="size-3"></i></span>
          </span>
          <span class="min-w-0 flex-1 truncate" x-text="o.label"></span>
          <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500" x-text="o.meta"></span>
        </div>
      </template>
    </div>

    <div x-show="!list.length" x-cloak class="px-4 py-6 text-center">
      <p class="text-[13px]/5 font-medium">No cost centre matches “<span x-text="q"></span>”</p>
      <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">Cost centres run from CC-1100 upwards.</p>
    </div>
  </div>
</div>` },

      { id: 'groups', name: 'Grouped options', code:
`<!-- The keyboard runs over one flattened list in the order the rows are drawn,
     not group by group. Index within a group and arrow-down at the bottom of
     Maharashtra has nowhere to go: the highlight sticks there and Gujarat is
     unreachable without a mouse.

     Each group is role="group" with an aria-label, because a listbox may only
     contain options and groups. The visible heading is aria-hidden — the group
     is already named, and the heading would otherwise be read as a row.

     A sticky heading needs a background of its own. Left transparent, the rows
     scroll straight through the text and neither is readable. A group whose
     options are all filtered out goes with its heading. -->
<div data-kui="combobox/groups" class="relative max-w-md"
     x-data="{
       open: false, typed: false, q: 'Nashik Steel Traders', sel: 'nashik-steel', ai: 0,
       groups: [
         { state: 'Maharashtra', options: [
           { id: 'sharma-extrusions', label: 'Sharma Extrusions', meta: 'Nashik' },
           { id: 'nashik-steel', label: 'Nashik Steel Traders', meta: 'Nashik' },
           { id: 'deccan-fasteners', label: 'Deccan Fasteners Pvt Ltd', meta: 'Pune' },
           { id: 'konkan-chemicals', label: 'Konkan Chemicals Pvt Ltd', meta: 'Ratnagiri' }
         ] },
         { state: 'Gujarat', options: [
           { id: 'gujarat-polymers', label: 'Gujarat Polymers Ltd', meta: 'Vadodara' },
           { id: 'baroda-fasteners', label: 'Baroda Fasteners', meta: 'Vadodara' },
           { id: 'rajkot-forge', label: 'Rajkot Forge and Machining', meta: 'Rajkot' }
         ] },
         { state: 'Tamil Nadu', options: [
           { id: 'coimbatore-castings', label: 'Coimbatore Castings Ltd', meta: 'Coimbatore' },
           { id: 'madurai-rubber', label: 'Madurai Rubber Works', meta: 'Madurai' }
         ] }
       ],
       get all() { return this.groups.flatMap(g => g.options); },
       match(g) {
         if (!this.typed) return g.options;
         const s = this.q.trim().toLowerCase();
         return g.options.filter(o => (o.label + ' ' + o.meta + ' ' + g.state).toLowerCase().includes(s));
       },
       get list() { return this.groups.flatMap(g => this.match(g)); },
       rowId(o) { return 'cb-state-' + o.id; },
       get activeId() { return this.open && this.list[this.ai] ? this.rowId(this.list[this.ai]) : null; },
       scroll() { this.$nextTick(() => { const el = document.getElementById(this.activeId); if (el) el.scrollIntoView({ block: 'nearest' }); }); },
       show() {
         if (this.open) return;
         this.open = true; this.typed = false;
         this.ai = Math.max(0, this.list.findIndex(o => o.id === this.sel));
         this.scroll();
       },
       close() {
         this.open = false; this.typed = false;
         const o = this.all.find(x => x.id === this.sel);
         this.q = o ? o.label : '';
       },
       move(n) {
         if (!this.open) { this.show(); return; }
         if (!this.list.length) return;
         this.ai = Math.min(this.list.length - 1, Math.max(0, this.ai + n));
         this.scroll();
       },
       pick(o) { this.sel = o.id; this.close(); this.$refs.q.focus(); },
       commit() { const o = this.list[this.ai]; if (o) this.pick(o); }
     }"
     @click.outside="close()"
     @keydown.escape="if (open) { $event.stopPropagation(); close(); $refs.q.focus() }">

  <label for="cb-state" class="mb-1.5 block text-[13px]/5 font-medium">Ship-from vendor</label>

  <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
    <input id="cb-state" x-ref="q" x-model="q" type="text" role="combobox" autocomplete="off"
           aria-autocomplete="list" aria-controls="cb-state-list"
           :aria-expanded="open" :aria-activedescendant="activeId"
           placeholder="Search a vendor or a state"
           @click="show()"
           @input="typed = true; open = true; ai = 0"
           @keydown.arrow-down.prevent="move(1)"
           @keydown.arrow-up.prevent="move(-1)"
           @keydown.enter="if (open) { $event.preventDefault(); commit() }"
           @keydown.tab="close()"
           class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
  </div>

  <input type="hidden" name="vendor" :value="sel || ''">

  <p role="status" class="sr-only"
     x-text="open ? (list.length === 1 ? '1 vendor matches' : list.length + ' vendors match') : ''"></p>

  <div x-show="open" x-cloak
       class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

    <div id="cb-state-list" role="listbox" aria-label="Vendors by state" class="max-h-72 overflow-y-auto pb-1">
      <template x-for="g in groups" :key="g.state">
        <div role="group" :aria-label="g.state" x-show="match(g).length">
          <p aria-hidden="true"
             class="sticky top-0 z-10 border-b border-zinc-100 bg-white px-3 py-1.5 text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase"
             x-text="g.state"></p>
          <template x-for="o in match(g)" :key="o.id">
            <div :id="rowId(o)" role="option" :aria-selected="o.id === sel"
                 @mousedown.prevent @click="pick(o)" @mousemove="ai = list.findIndex(x => x.id === o.id)"
                 :class="list[ai] && list[ai].id === o.id ? 'bg-zinc-100' : ''"
                 class="flex items-center gap-2.5 px-3 py-2 text-[13px]/5">
              <span class="min-w-0 flex-1 truncate" x-text="o.label"></span>
              <span class="shrink-0 text-[12px]/4 text-zinc-500" x-text="o.meta"></span>
              <span class="flex size-4 shrink-0 items-center justify-center" x-show="o.id === sel" x-cloak>
                <i data-lucide="check" class="size-4 text-zinc-600"></i>
              </span>
            </div>
          </template>
        </div>
      </template>
    </div>

    <div x-show="!list.length" x-cloak class="px-4 py-6 text-center">
      <p class="text-[13px]/5 font-medium">No vendor matches “<span x-text="q"></span>”</p>
      <p class="mt-1 text-[12px]/4 text-zinc-500">Try a state — Maharashtra, Gujarat, Tamil Nadu.</p>
    </div>
  </div>
</div>` },

      { id: 'rich', name: 'Two-line options', code:
`<!-- A second line is what makes two vendors called Sharma tell each other
     apart. It carries the identifying facts — code, GSTIN, last order — and
     nothing decorative.

     Every row gets an explicit aria-label, because left alone a screen reader
     reads the whole cell as one run: the name, then a GSTIN spelled out
     character by character, then a date, then an amount. The label is the name
     and the code; the rest is aria-hidden and stays on screen for the people
     reading it.

     Below sm the GSTIN is dropped rather than wrapped. Three facts on a 390px
     row is one too many, and the vendor code is the one people search by. -->
<div data-kui="combobox/rich" class="relative max-w-lg"
     x-data="{
       open: false, typed: false, q: 'Sharma Extrusions', sel: 'sharma-extrusions', ai: 0,
       options: [
         { id: 'sharma-extrusions', label: 'Sharma Extrusions', code: 'VEN-0187', gstin: '27AABCS9012K1Z5', last: '14 Aug 2026', spend: '₹18,42,000' },
         { id: 'sharma-polymers', label: 'Sharma Polymers and Compounds', code: 'VEN-0192', gstin: '24AABCS4471D1ZM', last: '02 Aug 2026', spend: '₹6,90,400' },
         { id: 'nashik-steel', label: 'Nashik Steel Traders', code: 'VEN-0203', gstin: '27AACCN4455P1ZR', last: '19 Aug 2026', spend: '₹4,68,500' },
         { id: 'deccan-fasteners', label: 'Deccan Fasteners Pvt Ltd', code: 'VEN-0219', gstin: '27AAECD7788M1ZT', last: '28 Jul 2026', spend: '₹96,750' },
         { id: 'konkan-chemicals', label: 'Konkan Chemicals Pvt Ltd', code: 'VEN-0244', gstin: '27AAGCK2266H1ZW', last: '11 Jun 2026', spend: '₹1,32,900' },
         { id: 'coimbatore-castings', label: 'Coimbatore Castings Ltd', code: 'VEN-0266', gstin: '33AAJCC8811N1ZD', last: '04 Mar 2026', spend: '₹27,10,400' }
       ],
       get list() {
         if (!this.typed) return this.options;
         const s = this.q.trim().toLowerCase();
         return this.options.filter(o => (o.label + ' ' + o.code + ' ' + o.gstin).toLowerCase().includes(s));
       },
       get chosen() { return this.options.find(o => o.id === this.sel) || null; },
       rowId(o) { return 'cb-rich-' + o.id; },
       get activeId() { return this.open && this.list[this.ai] ? this.rowId(this.list[this.ai]) : null; },
       scroll() { this.$nextTick(() => { const el = document.getElementById(this.activeId); if (el) el.scrollIntoView({ block: 'nearest' }); }); },
       show() {
         if (this.open) return;
         this.open = true; this.typed = false;
         this.ai = Math.max(0, this.list.findIndex(o => o.id === this.sel));
         this.scroll();
       },
       close() { this.open = false; this.typed = false; this.q = this.chosen ? this.chosen.label : ''; },
       move(n) {
         if (!this.open) { this.show(); return; }
         if (!this.list.length) return;
         this.ai = Math.min(this.list.length - 1, Math.max(0, this.ai + n));
         this.scroll();
       },
       pick(o) { this.sel = o.id; this.close(); this.$refs.q.focus(); },
       commit() { const o = this.list[this.ai]; if (o) this.pick(o); }
     }"
     @click.outside="close()"
     @keydown.escape="if (open) { $event.stopPropagation(); close(); $refs.q.focus() }">

  <label for="cb-rich" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</label>

  <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <i data-lucide="building-2" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
    <input id="cb-rich" x-ref="q" x-model="q" type="text" role="combobox" autocomplete="off"
           aria-autocomplete="list" aria-controls="cb-rich-list"
           :aria-expanded="open" :aria-activedescendant="activeId"
           placeholder="Name, vendor code or GSTIN"
           @click="show()"
           @input="typed = true; open = true; ai = 0"
           @keydown.arrow-down.prevent="move(1)"
           @keydown.arrow-up.prevent="move(-1)"
           @keydown.enter="if (open) { $event.preventDefault(); commit() }"
           @keydown.tab="close()"
           class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
  </div>

  <input type="hidden" name="vendor" :value="sel || ''">

  <p role="status" class="sr-only"
     x-text="open ? (list.length === 1 ? '1 vendor matches' : list.length + ' vendors match') : ''"></p>

  <div x-show="open" x-cloak
       class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

    <div id="cb-rich-list" role="listbox" aria-label="Vendors" class="max-h-80 overflow-y-auto py-1">
      <template x-for="(o, i) in list" :key="o.id">
        <div :id="rowId(o)" role="option" :aria-selected="o.id === sel" :aria-label="o.label + ', ' + o.code"
             @mousedown.prevent @click="pick(o)" @mousemove="ai = i"
             :class="i === ai ? 'bg-zinc-100' : ''"
             class="flex items-start gap-3 px-3 py-2">
          <span class="min-w-0 flex-1" aria-hidden="true">
            <span class="flex items-baseline justify-between gap-3">
              <span class="min-w-0 truncate text-[13px]/5 font-medium" x-text="o.label"></span>
              <span class="shrink-0 text-[13px]/5 tabular-nums text-zinc-600" x-text="o.spend"></span>
            </span>
            <span class="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px]/4 tabular-nums text-zinc-500">
              <span x-text="o.code"></span>
              <span class="hidden sm:inline">·</span>
              <span class="hidden font-mono sm:inline" x-text="o.gstin"></span>
              <span>·</span>
              <span x-text="'last order ' + o.last"></span>
            </span>
          </span>
          <span class="mt-0.5 flex size-4 shrink-0 items-center justify-center" x-show="o.id === sel" x-cloak>
            <i data-lucide="check" class="size-4 text-zinc-600"></i>
          </span>
        </div>
      </template>
    </div>

    <div x-show="!list.length" x-cloak class="px-4 py-6 text-center">
      <p class="text-[13px]/5 font-medium">No vendor matches “<span x-text="q"></span>”</p>
      <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">A GSTIN search needs all 15 characters.</p>
    </div>
  </div>
</div>` },

      { id: 'remote', name: 'Options fetched with htmx', code:
`<!-- htmx makes the request; Alpine never fetches. Alpine owns open, the
     highlight and the keyboard, htmx owns the rows.

     Because htmx replaced the rows without telling Alpine, there is no array to
     index into. The keyboard reads the option elements out of the DOM on every
     move and paints the highlight itself; an Alpine array here goes stale the
     moment the first response lands. That also means the ids come from the
     server, and they still have to be unique — aria-activedescendant points at
     one of them.

     The filter binds to the event name, not to the end of the spec:
     input[this.value.length > 1] changed delay:300ms. Written the other way
     round it is parsed as part of the modifier and the two-character floor
     never applies. delay is a debounce, not a throttle, and hx-sync
     this:replace drops a request still in flight so two keystrokes inside
     300ms cannot settle on the older reply.

     Below the floor nothing fires at all, so deleting back to one character
     clears the rows in script — otherwise last search's answer sits there under
     a query that did not produce it.

     The search box is named q, never vendor. The value is the hidden input, and
     a Django form ignores a POST key it has no field for. -->
<div data-kui="combobox/remote" class="relative max-w-md"
     x-data="{
       open: false, loading: false, failed: false, searched: false, empty: false,
       ai: 0, aid: null, sel: '', label: '', term: '',
       rows() { return Array.from(this.$refs.list.querySelectorAll('[role=option]:not([aria-disabled=true])')); },
       paint() {
         const r = this.rows();
         r.forEach((el, i) => el.classList.toggle('bg-zinc-100', i === this.ai));
         const el = r[this.ai];
         this.aid = el ? el.id : null;
         if (el) el.scrollIntoView({ block: 'nearest' });
       },
       move(n) {
         if (!this.open) { this.open = true; return; }
         const r = this.rows();
         if (!r.length) return;
         this.ai = Math.min(r.length - 1, Math.max(0, this.ai + n));
         this.paint();
       },
       take(el) {
         if (!el) return;
         this.sel = el.dataset.value; this.label = el.dataset.label; this.term = this.label;
         this.rows().forEach(r => r.setAttribute('aria-selected', r === el));
         this.$refs.q.value = this.label;
         this.open = false; this.aid = null;
         this.$refs.q.focus();
       },
       commit() { this.take(this.rows()[this.ai]); },
       changed(v) {
         this.term = v; this.open = true; this.failed = false;
         if (v.trim().length < 2) { this.searched = false; this.empty = false; this.$refs.list.innerHTML = ''; }
       },
       close() { this.open = false; this.aid = null; this.term = this.label; this.$refs.q.value = this.label; }
     }"
     @click.outside="close()"
     @keydown.escape="if (open) { $event.stopPropagation(); close(); $refs.q.focus() }"
     @htmx:before-request.camel="loading = true; failed = false; open = true"
     @htmx:after-request.camel="loading = false; if (!$event.detail.successful) failed = true"
     @htmx:after-swap.camel="searched = true; ai = 0; $nextTick(() => { empty = rows().length === 0; paint() })">

  <label for="cb-remote" class="mb-1.5 block text-[13px]/5 font-medium">Vendor</label>

  <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
    <input id="cb-remote" x-ref="q" type="text" name="q" role="combobox" autocomplete="off"
           aria-autocomplete="list" aria-controls="cb-remote-list"
           :aria-expanded="open" :aria-activedescendant="aid"
           placeholder="Type two characters to search"
           hx-get="/vendors/search/"
           hx-trigger="input[this.value.length > 1] changed delay:300ms"
           hx-target="#cb-remote-list" hx-swap="innerHTML" hx-sync="this:replace"
           @click="open = true"
           @input="changed($event.target.value)"
           @keydown.arrow-down.prevent="move(1)"
           @keydown.arrow-up.prevent="move(-1)"
           @keydown.enter="if (open) { $event.preventDefault(); commit() }"
           @keydown.tab="close()"
           class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
    <span class="mr-3 flex size-4 shrink-0 items-center justify-center" x-show="loading" x-cloak>
      <i data-lucide="loader-circle" class="size-4 animate-spin text-zinc-600"></i>
    </span>
  </div>

  <input type="hidden" name="vendor" :value="sel">

  <p role="status" class="sr-only"
     x-text="loading ? 'Searching vendors' : (searched ? (empty ? 'No vendor matches' : 'Vendors listed') : '')"></p>

  <div x-show="open" x-cloak
       class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

    <!-- htmx swaps the rows in here. One delegated handler, so the fragment the
         server sends carries no behaviour of its own — only data-value and
         data-label. -->
    <div id="cb-remote-list" x-ref="list" role="listbox" aria-label="Vendors"
         class="max-h-64 overflow-y-auto py-1 empty:hidden"
         @click="take($event.target.closest('[role=option]'))"
         @mousemove="const el = $event.target.closest('[role=option]'); if (el) { ai = rows().indexOf(el); paint() }"></div>

    <div x-show="!searched && !loading" x-cloak class="px-4 py-6 text-center">
      <p class="text-[13px]/5 tabular-nums text-zinc-600">Type two characters to search 248 vendors.</p>
    </div>

    <div x-show="loading" x-cloak class="px-4 py-6 text-center">
      <p class="flex items-center justify-center gap-2 text-[13px]/5 text-zinc-500">
        <i data-lucide="loader-circle" class="size-4 shrink-0 animate-spin"></i>Searching
      </p>
    </div>

    <div x-show="searched && empty && !loading && !failed" x-cloak class="px-4 py-6 text-center">
      <p class="text-[13px]/5 font-medium">No vendor matches “<span x-text="term"></span>”</p>
      <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">248 vendors searched by name, code and GSTIN.</p>
    </div>

    <div x-show="failed" x-cloak class="px-4 py-6 text-center">
      <p class="flex items-center justify-center gap-1.5 text-[13px]/5 font-medium text-red-600">
        <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>The vendor search did not answer
      </p>
      <p class="mt-1 text-[12px]/4 text-zinc-500">Type another character to try again.</p>
    </div>
  </div>
</div>` },

      { id: 'create', name: 'A value that is not in the list', code:
`<!-- The create row is a real option: last in the list, reachable by arrow key,
     committed by Enter. It appears only when there is a query and no exact
     match, so it never sits under a list somebody is still reading.

     It posts as text in a second field, never as an invented id. Send
     vendor=new-konkan-industries and the server cannot tell a record that
     exists from one that does not; send an empty vendor with vendor_new set and
     the view knows to create one, and can put it behind whatever approval a new
     vendor needs.

     This is also why the arrows clamp rather than wrap. A list that wrapped
     would land on Add new vendor every time somebody overshot the bottom. -->
<div data-kui="combobox/create" class="relative max-w-md"
     x-data="{
       open: false, typed: false, q: '', sel: '', fresh: '', ai: 0,
       options: [
         { id: 'gujarat-polymers', label: 'Gujarat Polymers Ltd', meta: 'VEN-0142' },
         { id: 'sharma-extrusions', label: 'Sharma Extrusions', meta: 'VEN-0187' },
         { id: 'nashik-steel', label: 'Nashik Steel Traders', meta: 'VEN-0203' },
         { id: 'konkan-chemicals', label: 'Konkan Chemicals Pvt Ltd', meta: 'VEN-0244' }
       ],
       get term() { return this.q.trim(); },
       get found() {
         if (!this.typed) return this.options;
         const s = this.term.toLowerCase();
         return this.options.filter(o => (o.label + ' ' + o.meta).toLowerCase().includes(s));
       },
       get creating() {
         return this.term.length > 0 &&
                !this.options.some(o => o.label.toLowerCase() === this.term.toLowerCase());
       },
       get list() {
         return this.creating ? [...this.found, { id: '__new', label: this.term, isNew: true }] : this.found;
       },
       rowId(o) { return 'cb-new-' + o.id; },
       get activeId() { return this.open && this.list[this.ai] ? this.rowId(this.list[this.ai]) : null; },
       scroll() { this.$nextTick(() => { const el = document.getElementById(this.activeId); if (el) el.scrollIntoView({ block: 'nearest' }); }); },
       show() { if (!this.open) { this.open = true; this.typed = false; this.ai = 0; this.scroll(); } },
       close() {
         this.open = false; this.typed = false;
         const o = this.options.find(x => x.id === this.sel);
         this.q = o ? o.label : this.fresh;
       },
       move(n) {
         if (!this.open) { this.show(); return; }
         if (!this.list.length) return;
         this.ai = Math.min(this.list.length - 1, Math.max(0, this.ai + n));
         this.scroll();
       },
       pick(o) {
         if (o.isNew) { this.sel = ''; this.fresh = o.label; }
         else { this.sel = o.id; this.fresh = ''; }
         this.close();
         this.$refs.q.focus();
       },
       commit() { const o = this.list[this.ai]; if (o) this.pick(o); }
     }"
     @click.outside="close()"
     @keydown.escape="if (open) { $event.stopPropagation(); close(); $refs.q.focus() }">

  <label for="cb-new" class="mb-1.5 block text-[13px]/5 font-medium">Vendor on the quotation</label>

  <div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
    <input id="cb-new" x-ref="q" x-model="q" type="text" role="combobox" autocomplete="off"
           aria-autocomplete="list" aria-controls="cb-new-list" aria-describedby="cb-new-help"
           :aria-expanded="open" :aria-activedescendant="activeId"
           placeholder="Search, or type a new vendor name"
           @click="show()"
           @input="typed = true; open = true; ai = 0"
           @keydown.arrow-down.prevent="move(1)"
           @keydown.arrow-up.prevent="move(-1)"
           @keydown.enter="if (open) { $event.preventDefault(); commit() }"
           @keydown.tab="close()"
           class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
  </div>

  <!-- an id for a record that exists, or the raw text for one that does not.
       Never a made-up id. -->
  <input type="hidden" name="vendor" :value="sel">
  <input type="hidden" name="vendor_new" :value="fresh">

  <p id="cb-new-help" class="mt-1.5 text-[12px]/4" :class="fresh ? 'text-amber-700' : 'text-zinc-500'"
     x-text="fresh ? 'New vendor — this order cannot be released until purchase approves it.' : 'Pick an approved vendor, or add one and send it for approval.'"></p>

  <p role="status" class="sr-only"
     x-text="open ? (found.length === 1 ? '1 vendor matches' : found.length + ' vendors match') : ''"></p>

  <div x-show="open" x-cloak
       class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

    <div id="cb-new-list" role="listbox" aria-label="Vendors" class="max-h-64 overflow-y-auto py-1">
      <template x-for="(o, i) in list" :key="o.id">
        <div :id="rowId(o)" role="option" :aria-selected="!o.isNew && o.id === sel"
             @mousedown.prevent @click="pick(o)" @mousemove="ai = i"
             :class="[i === ai ? 'bg-zinc-100' : '', o.isNew ? 'border-t border-zinc-100' : '']"
             class="flex items-center gap-2.5 px-3 py-2 text-[13px]/5">
          <span class="flex size-4 shrink-0 items-center justify-center" x-show="o.isNew" x-cloak>
            <i data-lucide="plus" class="size-4 text-zinc-600"></i>
          </span>
          <span class="min-w-0 flex-1 truncate"
                x-text="o.isNew ? 'Add new vendor: “' + o.label + '”' : o.label"></span>
          <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500" x-show="!o.isNew" x-text="o.meta"></span>
        </div>
      </template>
    </div>
  </div>
</div>` },

      { id: 'states', name: 'Disabled, locked, invalid', code:
`<div data-kui="combobox/states" class="max-w-md space-y-7">

  <!-- Disabled reaches the hidden input too. disabled on the search box only
       stops the typing; the hidden input has no appearance of its own and posts
       whatever it holds, so a field somebody was told they cannot change still
       submits its value. The three fields here carry different names only
       because they sit in one example — in a real form all three are vendor. -->
  <div>
    <label for="cb-off" class="mb-1.5 block text-[13px]/5 font-medium text-zinc-500">Vendor</label>
    <div class="flex items-center rounded-lg border border-zinc-200 bg-zinc-100">
      <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-400"></i>
      <!-- no aria-controls: there is no popup in the document to point it at,
           and aria-controls naming an id that does not exist is worse than
           leaving it off -->
      <input id="cb-off" type="text" disabled value="Gujarat Polymers Ltd"
             role="combobox" aria-expanded="false"
             class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 text-zinc-400">
      <span class="mr-3 flex size-4 shrink-0 items-center justify-center">
        <i data-lucide="chevron-down" class="size-4 text-zinc-400"></i>
      </span>
    </div>
    <input type="hidden" name="vendor_disabled" value="gujarat-polymers" disabled>
    <p class="mt-1.5 text-[12px]/4 text-zinc-500">Set on the rate contract. It changes there, not here.</p>
  </div>

  <!-- A locked value is rendered, not made read-only. There is no read-only
       combobox: readonly leaves the box focusable, the chevron still opens the
       list, and readonly means nothing at all on an option row. The value still
       has to reach the server, so a hidden input goes with the text. -->
  <div>
    <p class="text-[13px]/5 font-medium text-zinc-600">Vendor</p>
    <p class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]/5">
      <i data-lucide="lock" class="size-4 shrink-0 text-zinc-600"></i>
      Gujarat Polymers Ltd
      <span class="text-[12px]/4 tabular-nums text-zinc-500">VEN-0142</span>
    </p>
    <input type="hidden" name="vendor_locked" value="gujarat-polymers">
    <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">Fixed when GRN-24-0912 was posted against this order.</p>
  </div>

  <!-- Invalid, with two locked rows in the list. The red border is drawn;
       aria-invalid and aria-describedby are what gets announced. -->
  <div class="relative"
       x-data="{
         open: false, typed: false, q: 'Bhiwandi Traders', sel: '', ai: 0,
         options: [
           { id: 'gujarat-polymers', label: 'Gujarat Polymers Ltd', meta: 'VEN-0142', blocked: false },
           { id: 'sharma-extrusions', label: 'Sharma Extrusions', meta: 'VEN-0187', blocked: false },
           { id: 'nashik-steel', label: 'Nashik Steel Traders', meta: 'VEN-0203', blocked: true },
           { id: 'konkan-chemicals', label: 'Konkan Chemicals Pvt Ltd', meta: 'VEN-0244', blocked: true },
           { id: 'baroda-fasteners', label: 'Baroda Fasteners', meta: 'VEN-0258', blocked: false }
         ],
         get list() {
           if (!this.typed) return this.options;
           const s = this.q.trim().toLowerCase();
           return this.options.filter(o => (o.label + ' ' + o.meta).toLowerCase().includes(s));
         },
         get chosen() { return this.options.find(o => o.id === this.sel) || null; },
         rowId(o) { return 'cb-bad-' + o.id; },
         get activeId() { return this.open && this.list[this.ai] ? this.rowId(this.list[this.ai]) : null; },
         scroll() { this.$nextTick(() => { const el = document.getElementById(this.activeId); if (el) el.scrollIntoView({ block: 'nearest' }); }); },
         next(from, step) {
           for (let i = from + step; i >= 0 && i < this.list.length; i += step) {
             if (!this.list[i].blocked) return i;
           }
           return from < 0 ? 0 : from;
         },
         show() { if (!this.open) { this.open = true; this.typed = false; this.ai = this.next(-1, 1); this.scroll(); } },
         close() { this.open = false; this.typed = false; this.q = this.chosen ? this.chosen.label : ''; },
         move(step) {
           if (!this.open) { this.show(); return; }
           if (!this.list.length) return;
           this.ai = this.next(this.ai, step);
           this.scroll();
         },
         pick(o) { if (o.blocked) return; this.sel = o.id; this.close(); this.$refs.q.focus(); },
         commit() { const o = this.list[this.ai]; if (o) this.pick(o); }
       }"
       @click.outside="close()"
       @keydown.escape="if (open) { $event.stopPropagation(); close(); $refs.q.focus() }">

    <label for="cb-bad" class="mb-1.5 block text-[13px]/5 font-medium">Vendor <span class="text-red-600">*</span></label>

    <div class="flex items-center rounded-lg border border-red-600 bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15">
      <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
      <input id="cb-bad" x-ref="q" x-model="q" type="text" role="combobox" autocomplete="off"
             aria-autocomplete="list" aria-controls="cb-bad-list"
             aria-invalid="true" aria-describedby="cb-bad-err"
             :aria-expanded="open" :aria-activedescendant="activeId"
             @click="show()"
             @input="typed = true; open = true; ai = 0"
             @keydown.arrow-down.prevent="move(1)"
             @keydown.arrow-up.prevent="move(-1)"
             @keydown.enter="if (open) { $event.preventDefault(); commit() }"
             @keydown.tab="close()"
             class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 outline-none">
    </div>

    <input type="hidden" name="vendor" :value="sel">

    <p id="cb-bad-err" class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
      <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>
      Pick a vendor from the list. Typed text is not a vendor.
    </p>

    <p role="status" class="sr-only"
       x-text="open ? (list.length === 1 ? '1 vendor matches' : list.length + ' vendors match') : ''"></p>

    <div x-show="open" x-cloak
         class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

      <!-- aria-disabled announces the state and blocks nothing at all. next()
           steps over the blocked rows and pick() returns early, or the row is
           unreachable by keyboard and fully clickable by mouse. It keeps its
           place in the list: dropping it changes the shape of a set people scan
           by position. -->
      <div id="cb-bad-list" role="listbox" aria-label="Vendors" class="max-h-64 overflow-y-auto py-1">
        <template x-for="(o, i) in list" :key="o.id">
          <div :id="rowId(o)" role="option" :aria-selected="o.id === sel" :aria-disabled="o.blocked"
               @mousedown.prevent @click="pick(o)" @mousemove="if (!o.blocked) ai = i"
               :class="[i === ai && !o.blocked ? 'bg-zinc-100' : '', o.blocked ? 'text-zinc-400' : '']"
               class="flex items-center gap-2.5 px-3 py-2 text-[13px]/5">
            <span class="min-w-0 flex-1 truncate" x-text="o.label"></span>
            <span class="shrink-0 text-[12px]/4 text-zinc-500" x-show="o.blocked" x-cloak>Rate contract expired</span>
            <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500" x-show="!o.blocked" x-text="o.meta"></span>
          </div>
        </template>
      </div>

      <div x-show="!list.length" x-cloak class="px-4 py-6 text-center">
        <p class="text-[13px]/5 font-medium">No vendor matches “<span x-text="q"></span>”</p>
        <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-500">Two of these five are locked until their rate contract is renewed.</p>
      </div>
    </div>
  </div>
</div>` },

      { id: 'django', name: 'Django form field', code:
`<!-- forms.py
     class RfqForm(forms.Form):
         # Single select. The widget is never rendered — the template below draws
         # the field — but the field still validates the id against the queryset,
         # which is the only thing between a hidden input and any primary key
         # somebody cares to type into it with the dev tools open.
         vendor = forms.ModelChoiceField(
             queryset=Vendor.objects.filter(is_active=True),
             widget=forms.HiddenInput,
             label='Vendor')

         # Multiselect. The widget matters here even unrendered, because it is
         # what parses the POST. MultipleHiddenInput.value_from_datadict calls
         # data.getlist(name); a plain HiddenInput calls data.get(name), which
         # returns the last hidden input and drops every other vendor the user
         # picked. SelectMultiple works, for the same reason.
         recipients = forms.ModelMultipleChoiceField(
             queryset=Vendor.objects.filter(is_active=True),
             widget=forms.MultipleHiddenInput,
             required=False,
             label='Send this RFQ to')

     views.py
         def rfq_new(request):
             form = RfqForm(request.POST or None)
             vendors = list(Vendor.objects.filter(is_active=True)
                                          .values('id', 'name', 'code'))
             return render(request, 'rfq/new.html',
                           {'form': form, 'vendors': vendors})

         def vendor_search(request):
             q = request.GET.get('q', '').strip()
             hits = (Vendor.objects.filter(is_active=True)
                     .filter(Q(name__icontains=q) | Q(code__icontains=q)
                             | Q(gstin__icontains=q))[:20]
                     if len(q) > 1 else Vendor.objects.none())
             # the fragment only: no base template, no <html>
             return render(request, 'rfq/_vendor_options.html', {'hits': hits})

     urls.py
         path('rfq/new/', views.rfq_new, name='rfq-new'),
         path('vendors/search/', views.vendor_search, name='vendor-search'),

     The options go through json_script. Never interpolate a queryset into an
     x-data attribute: one vendor called M/s D'Souza Traders ends the attribute
     early and the whole component stops parsing. json_script escapes for
     exactly that and leaves the JSON somewhere Alpine can read it.

     The search endpoint is a GET and needs no CSRF token. A combobox that has
     to POST its search — a long query, a complex filter set — needs
     hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}' on the input, or Django
     answers 403. -->

{{ vendors|json_script:"vendor-options" }}
{{ form.recipients.value|default:''|json_script:"rfq-recipients" }}

<form data-kui="combobox/django" method="post" class="max-w-md">
  {% csrf_token %}

  <div class="relative"
       x-data="{
         open: false, typed: false, ai: 0, q: '',
         sel: '{{ form.vendor.value|default:'' }}',
         options: JSON.parse(document.getElementById('vendor-options').textContent),
         get list() {
           if (!this.typed) return this.options;
           const s = this.q.trim().toLowerCase();
           return this.options.filter(o => (o.name + ' ' + o.code).toLowerCase().includes(s));
         },
         get chosen() { return this.options.find(o => String(o.id) === String(this.sel)) || null; },
         rowId(o) { return 'dj-vendor-' + o.id; },
         get activeId() { return this.open && this.list[this.ai] ? this.rowId(this.list[this.ai]) : null; },
         scroll() { this.$nextTick(() => { const el = document.getElementById(this.activeId); if (el) el.scrollIntoView({ block: 'nearest' }); }); },
         show() {
           if (this.open) return;
           this.open = true; this.typed = false;
           this.ai = Math.max(0, this.list.findIndex(o => String(o.id) === String(this.sel)));
           this.scroll();
         },
         close() { this.open = false; this.typed = false; this.q = this.chosen ? this.chosen.name : ''; },
         move(n) {
           if (!this.open) { this.show(); return; }
           if (!this.list.length) return;
           this.ai = Math.min(this.list.length - 1, Math.max(0, this.ai + n));
           this.scroll();
         },
         pick(o) { this.sel = o.id; this.close(); this.$refs.q.focus(); },
         commit() { const o = this.list[this.ai]; if (o) this.pick(o); }
       }"
       x-init="q = chosen ? chosen.name : ''"
       @click.outside="close()"
       @keydown.escape="if (open) { $event.stopPropagation(); close(); $refs.q.focus() }">

    <label for="{{ form.vendor.id_for_label }}-q" class="mb-1.5 block text-[13px]/5 font-medium">
      {{ form.vendor.label }} <span class="text-red-600">*</span>
    </label>

    <div class="flex items-center rounded-lg bg-white {% if form.vendor.errors %}border border-red-600 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-red-600/15{% else %}border border-zinc-200 focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15{% endif %}">
      <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
      <!-- the search box has no name. Give it the field's name and the typed
           text posts beside the id, and the form cleans whichever came last. -->
      <input id="{{ form.vendor.id_for_label }}-q" x-ref="q" x-model="q" type="text"
             role="combobox" autocomplete="off" aria-autocomplete="list"
             aria-controls="dj-vendor-list"
             {% if form.vendor.errors %}aria-invalid="true" aria-describedby="dj-vendor-err"{% endif %}
             :aria-expanded="open" :aria-activedescendant="activeId"
             placeholder="Search vendors"
             @click="show()"
             @input="typed = true; open = true; ai = 0"
             @keydown.arrow-down.prevent="move(1)"
             @keydown.arrow-up.prevent="move(-1)"
             @keydown.enter="if (open) { $event.preventDefault(); commit() }"
             @keydown.tab="close()"
             class="w-full min-w-0 bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
    </div>

    <!-- the field itself: one hidden input, named for the bound field -->
    <input type="hidden" name="{{ form.vendor.html_name }}" :value="sel">

    {% if form.vendor.errors %}
      <p id="dj-vendor-err" class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
        <i data-lucide="alert-circle" class="mt-0.5 size-3.5 shrink-0"></i>{{ form.vendor.errors.0 }}
      </p>
    {% endif %}

    <p role="status" class="sr-only"
       x-text="open ? (list.length === 1 ? '1 vendor matches' : list.length + ' vendors match') : ''"></p>

    <div x-show="open" x-cloak
         class="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
      <div id="dj-vendor-list" role="listbox" aria-label="{{ form.vendor.label }}" class="max-h-64 overflow-y-auto py-1">
        <template x-for="(o, i) in list" :key="o.id">
          <div :id="rowId(o)" role="option" :aria-selected="String(o.id) === String(sel)"
               @mousedown.prevent @click="pick(o)" @mousemove="ai = i"
               :class="i === ai ? 'bg-zinc-100' : ''"
               class="flex items-center gap-2.5 px-3 py-2 text-[13px]/5">
            <span class="min-w-0 flex-1 truncate" x-text="o.name"></span>
            <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500" x-text="o.code"></span>
          </div>
        </template>
      </div>
      <div x-show="!list.length" x-cloak class="px-4 py-6 text-center">
        <p class="text-[13px]/5 font-medium">No vendor matches “<span x-text="q"></span>”</p>
      </div>
    </div>
  </div>

  <!-- The multiselect posts one hidden input per value, all sharing html_name,
       which is what MultipleHiddenInput.value_from_datadict reads with getlist.
       The initial selection comes out of the bound field through json_script
       for the same escaping reason. The field and the popup are the multi
       variant, unchanged. -->
  <div class="mt-6" x-data="{ sel: JSON.parse(document.getElementById('rfq-recipients').textContent) || [] }">
    <template x-for="id in sel" :key="id">
      <input type="hidden" name="{{ form.recipients.html_name }}" :value="id">
    </template>
    <p class="text-[12px]/4 tabular-nums text-zinc-500" x-text="sel.length + ' vendors will receive this RFQ'"></p>
  </div>

  <button type="submit" class="mt-5 inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Send RFQ</button>
</form>

<!-- rfq/_vendor_options.html — the whole response for the remote variant, and
     nothing around it, because hx-swap is innerHTML. The ids come from the
     server and still have to be unique: aria-activedescendant on the input
     points at one of them. -->
{% for v in hits %}
  <div id="cb-remote-{{ v.pk }}" role="option" aria-selected="false"
       data-value="{{ v.pk }}" data-label="{{ v.name }}"
       class="flex items-center gap-2.5 px-3 py-2 text-[13px]/5">
    <span class="min-w-0 flex-1 truncate">{{ v.name }}</span>
    <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">{{ v.code }}</span>
  </div>
{% endfor %}` }
    ]
  },

  {
    id: 'attachment', name: 'Attachment', category: 'forms',
    description: 'The documents hanging off a record — a drop zone over the list of what is already there. Every file shows its type, size, who attached it and when.',
    when: 'Any record people staple paperwork to: quotations against an order, a signed GRN, a delivery photo, an invoice PDF. For a single file that is really just one field of a form, use the single-file variant rather than a whole panel.',
    notes: [
      'Keep a real <input type="file"> and hide it with sr-only, never display:none or hidden. A display:none input cannot be focused, so the keyboard can never reach the upload control at all.',
      'Make the label the peer of the hidden input and put the focus ring on the label with peer-focus-visible. Otherwise the input takes focus invisibly and the keyboard user has no idea where they are.',
      'Both @dragover.prevent and @drop.prevent are required. Without them the browser leaves the page and opens the dropped file, losing whatever was typed into the form.',
      'Count drag depth with dragenter/dragleave, do not use a boolean. dragleave fires every time the pointer crosses into a child element, so a boolean makes the highlight flicker as the file passes over the icon and the text.',
      'Never fake the progress bar. An animation that reaches 100% before the bytes do produces a user who navigates away mid-upload. Drive it from the real upload progress event, and if you cannot, show an indeterminate state instead of a number.',
      'Show the size and the type limit before the file is chosen, not as an error afterwards. "PDF or JPG, up to 10 MB" prevents the failure; "File too large" only reports it.',
      'A rejected file stays on screen with its reason. Silently dropping it means the user believes it uploaded.',
      'Removing a file that is already saved on the server is destructive and gets an alert dialog. Removing one that is still queued is not, and must not ask.',
      'The filename is the one thing users recognise, so it truncates and never wraps — truncate on a min-w-0 flex child, with the size and the controls shrink-0 beside it.'
    ],
    anatomy: [
      ['Drop zone', 'A dashed panel wrapping the hidden input and its label. Carries the drag handlers and the type and size limit.'],
      ['Input', 'A real <input type="file">, sr-only, and the peer of the label so focus is visible.'],
      ['File row', 'Icon, name, size, who and when, then the controls. The name flexes and truncates; everything else is shrink-0.'],
      ['State', 'A progress bar while uploading, a red reason line when rejected, nothing at all once it is stored.'],
      ['Controls', 'Download and remove. Remove is the only one that can be destructive.']
    ],
    behaviour: [
      'Dragging a file over the zone highlights it; the highlight survives the pointer crossing child elements.',
      'Dropping or picking adds the file to the list immediately, in an uploading state, so the user sees it was accepted before it finishes.',
      'A file that fails validation joins the list too, marked with the reason, and does not count towards the upload.',
      'Progress reflects real bytes. Reaching 100% swaps the bar for the stored metadata line.',
      'Removing a queued file happens straight away; removing a stored one goes through an alert dialog first.',
      'The panel is useful with nothing in it — the empty state says what to attach and why, not just "No files".'
    ],
    a11y: [
      'The file input is a real input, focusable, and reachable by keyboard alone.',
      'The label is bound with for/id, so pressing Enter or Space on it opens the file picker.',
      'The focus ring is on the label via peer-focus-visible, because the input itself is visually hidden.',
      'Each remove button carries aria-label naming its file — five buttons all labelled "Remove" are useless in a list.',
      'Upload progress uses role="progressbar" with aria-valuenow, so it is announced rather than only drawn.',
      'The rejection reason sits in the row it belongs to and is referenced by the row, not left as loose red text nearby.'
    ],
    related: ['input', 'field', 'alert-dialog'],
    variants: [
      { id: 'default', name: 'Drop zone and list', code:
`<div data-kui="attachment/default" x-data="{ depth: 0 }">
  <label class="mb-1.5 block text-[13px]/5 font-medium">Attachments</label>

  <div @dragenter.prevent="depth++" @dragleave.prevent="depth--" @dragover.prevent @drop.prevent="depth = 0"
       class="rounded-lg border border-dashed px-4 py-5 transition"
       :class="depth > 0 ? 'border-zinc-700 bg-zinc-50' : 'border-zinc-200 bg-zinc-100'">
    <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
      <i data-lucide="upload" class="size-5 shrink-0 text-zinc-600"></i>
      <span class="text-[13px]/5 text-zinc-600">Drag files here or</span>
      <input type="file" id="po-files" name="attachments" multiple class="peer sr-only">
      <label for="po-files"
             class="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 peer-focus-visible:border-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
        Browse files
      </label>
      <span class="text-[12px]/4 text-zinc-500">PDF, JPG or XLSX · up to 10 MB each</span>
    </div>
  </div>

  <ul class="mt-2 space-y-2">
    <li class="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-[13px]/5 font-medium">quotation-sharma-extrusions-aug.pdf</p>
        <p class="text-[12px]/4 text-zinc-500">248 KB · Ritu Deshpande · 19 Aug 2024</p>
      </div>
      <a href="#" aria-label="Download quotation-sharma-extrusions-aug.pdf"
         class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
        <i data-lucide="download" class="size-4"></i>
      </a>
      <button type="button" aria-label="Remove quotation-sharma-extrusions-aug.pdf"
              class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-red-600">
        <i data-lucide="x" class="size-4"></i>
      </button>
    </li>
    <li class="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="sheet" class="size-4 text-zinc-600"></i></span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-[13px]/5 font-medium">rate-comparison-q3.xlsx</p>
        <p class="text-[12px]/4 text-zinc-500">54 KB · Anil Kulkarni · 14 Aug 2024</p>
      </div>
      <a href="#" aria-label="Download rate-comparison-q3.xlsx"
         class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
        <i data-lucide="download" class="size-4"></i>
      </a>
      <button type="button" aria-label="Remove rate-comparison-q3.xlsx"
              class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-red-600">
        <i data-lucide="x" class="size-4"></i>
      </button>
    </li>
  </ul>
</div>` },

      { id: 'empty', name: 'Nothing attached', code:
`<!-- Say what to attach and why. "No files" is a fact, not an instruction. -->
<div data-kui="attachment/empty" x-data="{ depth: 0 }">
  <label class="mb-1.5 block text-[13px]/5 font-medium">Attachments</label>
  <div @dragenter.prevent="depth++" @dragleave.prevent="depth--" @dragover.prevent @drop.prevent="depth = 0"
       class="rounded-lg border border-dashed px-4 py-8 text-center transition"
       :class="depth > 0 ? 'border-zinc-700 bg-zinc-50' : 'border-zinc-200 bg-zinc-100'">
    <i data-lucide="paperclip" class="mx-auto size-6 text-zinc-500"></i>
    <p class="mt-3 text-[14px]/5 font-semibold">No documents on this order yet</p>
    <p class="mx-auto mt-1 max-w-[42ch] text-[12px]/4 text-zinc-600">
      Approvals above ₹10,00,000 need the vendor quotation attached before the plant head can sign off.
    </p>
    <input type="file" id="empty-files" name="attachments" multiple class="peer sr-only">
    <label for="empty-files"
           class="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/30">
      <i data-lucide="upload" class="size-4"></i>Attach a document
    </label>
    <p class="mt-3 text-[12px]/4 text-zinc-500">PDF, JPG or XLSX · up to 10 MB each</p>
  </div>
</div>` },

      { id: 'uploading', name: 'Uploading', code:
`<!-- The number comes from the real XHR progress event. If you cannot get it,
     drop the percentage and show an indeterminate bar instead of inventing one. -->
<ul data-kui="attachment/uploading" class="space-y-2">
  <li class="rounded-lg border border-zinc-200 bg-white px-3 py-2">
    <div class="flex items-center gap-3">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
      <div class="min-w-0 flex-1">
        <p class="truncate text-[13px]/5 font-medium">signed-grn-1142.pdf</p>
        <p class="text-[12px]/4 text-zinc-500">1.8 MB of 4.2 MB</p>
      </div>
      <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-600">43%</span>
      <button type="button" aria-label="Cancel upload of signed-grn-1142.pdf"
              class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-red-600">
        <i data-lucide="x" class="size-4"></i>
      </button>
    </div>
    <div role="progressbar" aria-valuenow="43" aria-valuemin="0" aria-valuemax="100"
         aria-label="Uploading signed-grn-1142.pdf"
         class="mt-2 h-1 overflow-hidden rounded-full bg-zinc-200">
      <div class="h-full rounded-full bg-zinc-700 transition-[width] duration-300" style="width: 43%"></div>
    </div>
  </li>
  <li class="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="image" class="size-4 text-zinc-600"></i></span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-[13px]/5 font-medium">delivery-gate-photo.jpg</p>
      <p class="text-[12px]/4 text-zinc-500">1.1 MB · Ritu Deshpande · just now</p>
    </div>
    <i data-lucide="check-circle-2" class="size-4 shrink-0 text-emerald-600"></i>
  </li>
</ul>` },

      { id: 'rejected', name: 'Rejected file', code:
`<!-- The rejected file stays visible with its reason. Removing it from the list
     silently is how users end up believing something uploaded when it did not. -->
<ul data-kui="attachment/rejected" class="space-y-2">
  <li class="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-[13px]/5 font-medium">quotation-sharma-extrusions-aug.pdf</p>
      <p class="text-[12px]/4 text-zinc-500">248 KB · Ritu Deshpande · 19 Aug 2024</p>
    </div>
    <button type="button" aria-label="Remove quotation-sharma-extrusions-aug.pdf"
            class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-red-600">
      <i data-lucide="x" class="size-4"></i>
    </button>
  </li>
  <li class="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file" class="size-4 text-zinc-500"></i></span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-[13px]/5 font-medium text-zinc-600 line-through">plant-layout-revised.dwg</p>
      <p id="reject-dwg" class="mt-0.5 flex items-center gap-1.5 text-[12px]/4 font-medium text-red-600">
        <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>
        DWG is not accepted. Attach a PDF export instead.
      </p>
    </div>
    <button type="button" aria-label="Dismiss plant-layout-revised.dwg" aria-describedby="reject-dwg"
            class="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
      <i data-lucide="x" class="size-4"></i>
    </button>
  </li>
</ul>` },

      { id: 'readonly', name: 'Read only', code:
`<!-- No upload rights. Do not render a disabled drop zone — remove it, and let
     the list stand on its own. -->
<div data-kui="attachment/readonly" class="overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <div class="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
    <h3 class="text-[13px]/5 font-medium">Attachments</h3>
    <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">3 files · 2.4 MB</span>
  </div>
  <ul class="divide-y divide-zinc-100">
    <li class="flex items-center gap-3 px-4 py-2.5">
      <i data-lucide="file-text" class="size-4 shrink-0 text-zinc-500"></i>
      <a href="#" class="min-w-0 flex-1 truncate text-[13px]/5 text-zinc-900 underline underline-offset-2">quotation-sharma-extrusions-aug.pdf</a>
      <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">248 KB</span>
    </li>
    <li class="flex items-center gap-3 px-4 py-2.5">
      <i data-lucide="sheet" class="size-4 shrink-0 text-zinc-500"></i>
      <a href="#" class="min-w-0 flex-1 truncate text-[13px]/5 text-zinc-900 underline underline-offset-2">rate-comparison-q3.xlsx</a>
      <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">54 KB</span>
    </li>
    <li class="flex items-center gap-3 px-4 py-2.5">
      <i data-lucide="image" class="size-4 shrink-0 text-zinc-500"></i>
      <a href="#" class="min-w-0 flex-1 truncate text-[13px]/5 text-zinc-900 underline underline-offset-2">delivery-gate-photo.jpg</a>
      <span class="shrink-0 text-[12px]/4 tabular-nums text-zinc-500">2.1 MB</span>
    </li>
  </ul>
</div>` },

      { id: 'single', name: 'Single file field', code:
`<!-- One file, inside a form, where a whole panel would be out of proportion. -->
<div data-kui="attachment/single">
  <label for="grn-scan" class="mb-1.5 block text-[13px]/5 font-medium">
    Signed GRN <span class="text-red-600">*</span>
  </label>
  <div class="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
    <div class="min-w-0 flex-1">
      <p class="truncate text-[13px]/5 font-medium">signed-grn-1142.pdf</p>
      <p class="text-[12px]/4 text-zinc-500">4.2 MB · attached just now</p>
    </div>
    <input type="file" id="grn-scan" name="grn_scan" class="peer sr-only">
    <label for="grn-scan"
           class="shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 peer-focus-visible:border-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
      Replace
    </label>
  </div>
  <p class="mt-1.5 text-[12px]/4 text-zinc-500">PDF or JPG, up to 10 MB.</p>
</div>` },

      { id: 'images', name: 'Image grid', code:
`<!-- Photographs are recognised by sight, not by filename. Show them. -->
<div data-kui="attachment/images">
  <div class="flex items-end justify-between gap-3">
    <label class="text-[13px]/5 font-medium">Delivery photographs</label>
    <span class="text-[12px]/4 tabular-nums text-zinc-500">4 of 10</span>
  </div>
  <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
    <div class="group relative aspect-4/3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
      <div class="flex h-full items-center justify-center"><i data-lucide="image" class="size-5 text-zinc-500"></i></div>
      <button type="button" aria-label="Remove gate-in-truck.jpg"
              class="absolute right-1 top-1 flex size-6 items-center justify-center rounded-md bg-white/90 text-zinc-600 opacity-0 transition hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100">
        <i data-lucide="x" class="size-3.5"></i>
      </button>
      <p class="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-zinc-900/70 to-transparent px-2 pb-1 pt-4 text-[11px]/4 text-white">gate-in-truck.jpg</p>
    </div>
    <div class="group relative aspect-4/3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
      <div class="flex h-full items-center justify-center"><i data-lucide="image" class="size-5 text-zinc-500"></i></div>
      <button type="button" aria-label="Remove unloading-bay-3.jpg"
              class="absolute right-1 top-1 flex size-6 items-center justify-center rounded-md bg-white/90 text-zinc-600 opacity-0 transition hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100">
        <i data-lucide="x" class="size-3.5"></i>
      </button>
      <p class="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-zinc-900/70 to-transparent px-2 pb-1 pt-4 text-[11px]/4 text-white">unloading-bay-3.jpg</p>
    </div>
    <div class="group relative aspect-4/3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
      <div class="flex h-full items-center justify-center"><i data-lucide="image" class="size-5 text-zinc-500"></i></div>
      <button type="button" aria-label="Remove weighbridge-slip.jpg"
              class="absolute right-1 top-1 flex size-6 items-center justify-center rounded-md bg-white/90 text-zinc-600 opacity-0 transition hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100">
        <i data-lucide="x" class="size-3.5"></i>
      </button>
      <p class="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-zinc-900/70 to-transparent px-2 pb-1 pt-4 text-[11px]/4 text-white">weighbridge-slip.jpg</p>
    </div>
    <div>
      <input type="file" id="photo-add" name="photos" accept="image/*" multiple class="peer sr-only">
      <label for="photo-add"
             class="flex aspect-4/3 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-zinc-700 hover:bg-zinc-50 peer-focus-visible:border-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
        <i data-lucide="plus" class="size-5"></i>
        <span class="text-[12px]/4 font-medium">Add photo</span>
      </label>
    </div>
  </div>
</div>` },

      { id: 'django', name: 'Django ClearableFileInput', code:
`<!-- Drop-in replacement for {{ form.attachment }} when the field is a FileField.
     Django's ClearableFileInput renders exactly three things: the current file
     link, a clear checkbox named <field>-clear, and the new file input. Keep all
     three names or the POST does not clear the file.

     {% if form.attachment.value %} … {% endif %} guards the first two. -->
<div data-kui="attachment/django">
  <label for="id_attachment" class="mb-1.5 block text-[13px]/5 font-medium">Attachment</label>

  <div class="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
    <a href="/media/po/quotation-sharma-aug.pdf" class="min-w-0 flex-1 truncate text-[13px]/5 text-zinc-900 underline underline-offset-2">quotation-sharma-aug.pdf</a>
    <label class="flex shrink-0 items-center gap-2 text-[12px]/4 text-zinc-600">
      <input type="checkbox" name="attachment-clear" id="attachment-clear_id"
             class="size-4 rounded border-zinc-200 text-zinc-700">
      Clear
    </label>
  </div>

  <div class="mt-2">
    <input type="file" name="attachment" id="id_attachment" class="peer sr-only">
    <label for="id_attachment"
           class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 peer-focus-visible:border-zinc-700 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zinc-700/15">
      <i data-lucide="upload" class="size-4"></i>Choose a replacement
    </label>
  </div>

  <p class="mt-1.5 text-[12px]/4 text-zinc-500">Uploading a new file replaces the current one.</p>
  <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4 font-medium text-red-600">
    <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>
    Remember enctype="multipart/form-data" on the &lt;form&gt;, or request.FILES arrives empty.
  </p>
</div>` }
    ]
  },

  {
    id: 'calendar', name: 'Calendar', category: 'forms',
    description: 'A month grid for picking a date or a range. Monday-first, tabular figures, and the same graphite selection the rest of the system uses.',
    when: 'Choosing a date the user has to see in context — a delivery date next to the weekend, a range that spans a month end. For a date of birth or anything typed from memory, an input is faster than a grid.',
    notes: [
      'The week starts on Monday. Every Indian office runs Monday to Saturday, and a Sunday-first grid puts the weekend at both ends of the row where nobody reads it.',
      'Days are tabular-nums inside a fixed square, so the columns line up and 1 sits under 8 sits under 15. Proportional figures make the grid lean.',
      'Leading and trailing cells are blank, not greyed-out neighbouring dates. A muted date is still a date: it invites a click, and at the contrast it needs to read as muted it fails AA anyway.',
      'Today is the chip treatment — bg-zinc-200 with ring-zinc-300 — and the selected day is solid zinc-700. Today is a fact about the calendar; selection is a fact about the form, and the solid fill outranks the tint.',
      'The grid is one Tab stop. Arrows move by day, Up and Down by week, PageUp and PageDown by month, Home and End to the ends of the week. Without that a month is 31 tab stops.',
      'Changing month carries the focused day with it. The roving tabindex sits on one date, so if the view moves and the focus does not, the month on screen contains no tabbable day and the grid drops out of the Tab order entirely — measured at zero tab stops after paging away.',
      'A range is two values and one grid. Never two separate single pickers side by side — the user can then set an end before its start, and something has to reject it after the fact.'
    ],
    anatomy: [
      ['Header', 'Month and year, with a previous and next control either side. The label is aria-live so changing month is announced, not just drawn.'],
      ['Column headers', 'Two-letter weekday names, Mo through Su, as real th scope="col".'],
      ['Day cell', 'A size-9 square button carrying the full date as its accessible name — "Friday, 14 August 2026", not "14".'],
      ['Today', 'bg-zinc-200 with ring-zinc-300 and aria-current="date".'],
      ['Selection', 'Solid zinc-700. In a range, the two endpoints are solid and the days between take a zinc-200 band behind them.'],
      ['Presets', 'A column beside the grid for the ranges people actually pick — this month, last 30 days, this financial year.']
    ],
    behaviour: [
      'Clicking a day selects it. In a range, the first click sets the start, the second sets the end, and a third starts over.',
      'Picking an end date before the start swaps them rather than refusing — the user has said which two days they mean.',
      'Arrow keys move focus and month, so arrowing off the end of August lands on 1 September with the view following.',
      'A picker closes on selection, on Escape, and on a click outside; a range picker stays open until both ends are set.',
      'Disabled dates are skipped by nothing — they keep their place in the grid so the shape of the month does not change, but they cannot be focused or clicked.',
      'The financial year preset runs April to March, because that is what the year means in an Indian ledger.'
    ],
    a11y: [
      'The grid is a real table with th scope="col" for the weekdays, so row and column position is available without sight.',
      'Each day button is named with its full date. "14" on its own is meaningless when read out of the grid.',
      'Today carries aria-current="date" and the selected day aria-pressed, which are different facts and both worth announcing.',
      'The month label is aria-live="polite", so moving month is announced rather than silently redrawn.',
      'A roving tabindex makes the whole month one Tab stop; only the focused day is reachable with Tab.',
      'Disabled days are real disabled buttons, so they are skipped by the keyboard and announced as unavailable.'
    ],
    related: ['input', 'field', 'button'],
    variants: [
      { id: 'month', name: 'Month grid', code:
`<!-- The primitive. Everything else here is this grid with something round it.

     Nothing stores a Date. State is a year, a month and ISO strings; every Date
     is built inside a method and thrown away. Alpine wraps state in a reactive
     Proxy, and a proxied Date throws "Illegal invocation" the moment you call
     getDate() on it — the proxy forwards properties, not a Date's internal
     slots. weeks() therefore hands the template plain { iso, day, dow } objects
     so no template expression ever touches a Date method.

     today is assembled from getFullYear/getMonth/getDate, not from
     toISOString(), which is UTC — in IST that reports yesterday until 05:30.

     Monday first: (getDay() + 6) % 7 moves Sunday from 0 to 6, which is where
     the weekend belongs in an office that works Saturdays. -->
<div data-kui="calendar/month" class="inline-block rounded-xl border border-zinc-300 bg-white p-3"
     x-data="{
       focus: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       sel: null,
       vy: new Date().getFullYear(),
       vm: new Date().getMonth(),
       today: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       head: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
       iso(y, m, d) { return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'); },
       parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
       title(o) { return new Date(this.vy, this.vm + o, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }); },
       long(s) { return this.parse(s).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); },
       fmt(s) { return s ? this.parse(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; },
       weeks(o) {
         const y = this.vy, m = this.vm + o;
         const lead = (new Date(y, m, 1).getDay() + 6) % 7;
         const total = new Date(y, m + 1, 0).getDate();
         const cells = [];
         for (let i = 0; i < lead; i++) cells.push(null);
         for (let d = 1; d <= total; d++) {
           const dt = new Date(y, m, d);
           cells.push({ iso: this.iso(dt.getFullYear(), dt.getMonth(), d), day: d, dow: dt.getDay() });
         }
         while (cells.length % 7) cells.push(null);
         const out = [];
         for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
         return out;
       },
       shift(n) { const v = new Date(this.vy, this.vm + n, 1); this.vy = v.getFullYear(); this.vm = v.getMonth(); this.clamp(); },
       clamp() {
         if (!this.focus) return;
         const f = this.parse(this.focus);
         if (f.getFullYear() === this.vy && f.getMonth() === this.vm) return;
         const last = new Date(this.vy, this.vm + 1, 0).getDate();
         this.focus = this.iso(this.vy, this.vm, Math.min(f.getDate(), last));
       },
       move(n) {
         const f = this.parse(this.focus);
         f.setDate(f.getDate() + n);
         this.focus = this.iso(f.getFullYear(), f.getMonth(), f.getDate());
         this.vy = f.getFullYear(); this.vm = f.getMonth();
         this.$nextTick(() => { const b = this.$refs.grid.querySelector('[data-focus]'); if (b) b.focus(); });
       },
       cls(s) {
         if (s === this.sel) return 'bg-zinc-700 font-medium text-white hover:bg-zinc-800';
         if (s === this.today) return 'bg-zinc-200 font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-300';
         return 'text-zinc-900 hover:bg-zinc-200';
       }
     }">
  <div class="flex items-center justify-between pb-2">
    <button type="button" @click="shift(-1)" aria-label="Previous month"
            class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>
    <span class="text-[13px]/5 font-medium tabular-nums" aria-live="polite" x-text="title(0)"></span>
    <button type="button" @click="shift(1)" aria-label="Next month"
            class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
  <table x-ref="grid" class="border-collapse"
           @keydown.arrow-left.prevent="move(-1)"  @keydown.arrow-right.prevent="move(1)"
             @keydown.arrow-up.prevent="move(-7)"    @keydown.arrow-down.prevent="move(7)"
             @keydown.home.prevent="move(-((parse(focus).getDay() + 6) % 7))"
             @keydown.end.prevent="move(6 - ((parse(focus).getDay() + 6) % 7))"
             @keydown.page-up.prevent="shift(-1)"    @keydown.page-down.prevent="shift(1)">
    <caption class="sr-only" x-text="'Calendar, ' + title(0)"></caption>
    <thead>
      <tr>
        <template x-for="h in head" :key="h">
          <th scope="col" class="size-9 text-[11px]/4 font-medium text-zinc-500" x-text="h"></th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template x-for="(week, wi) in weeks(0)" :key="wi">
        <tr>
          <template x-for="(c, ci) in week" :key="ci">
            <td class="p-0">
              <template x-if="c">
                <button type="button" @click="sel = c.iso; focus = c.iso"
                        :aria-label="long(c.iso)" :aria-pressed="c.iso === sel"
                        :aria-current="c.iso === today ? 'date' : null"
                        :tabindex="c.iso === focus ? 0 : -1"
                        :data-focus="c.iso === focus ? '1' : null"
                        class="inline-flex size-9 items-center justify-center rounded-lg text-[13px]/5 tabular-nums"
                        :class="cls(c.iso)" x-text="c.day"></button>
              </template>
              <template x-if="!c"><span class="block size-9"></span></template>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</div>` },

      { id: 'picker', name: 'Date picker', code:
`<!-- A field that opens the grid. The trigger shows the date the way it is read
     — 14 Aug 2026 — while a hidden input carries the ISO string that posts, so
     the display format and the wire format never have to agree.

     x-trap keeps Tab inside the panel and returns focus to the trigger on
     close. Choosing a day closes it, because a single date is finished the
     moment it is picked. -->
<div data-kui="calendar/picker" class="relative max-w-xs"
     x-data="{
       open: false,
       focus: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       sel: null,
       vy: new Date().getFullYear(),
       vm: new Date().getMonth(),
       today: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       head: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
       iso(y, m, d) { return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'); },
       parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
       title(o) { return new Date(this.vy, this.vm + o, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }); },
       long(s) { return this.parse(s).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); },
       fmt(s) { return s ? this.parse(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; },
       weeks(o) {
         const y = this.vy, m = this.vm + o;
         const lead = (new Date(y, m, 1).getDay() + 6) % 7;
         const total = new Date(y, m + 1, 0).getDate();
         const cells = [];
         for (let i = 0; i < lead; i++) cells.push(null);
         for (let d = 1; d <= total; d++) {
           const dt = new Date(y, m, d);
           cells.push({ iso: this.iso(dt.getFullYear(), dt.getMonth(), d), day: d, dow: dt.getDay() });
         }
         while (cells.length % 7) cells.push(null);
         const out = [];
         for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
         return out;
       },
       shift(n) { const v = new Date(this.vy, this.vm + n, 1); this.vy = v.getFullYear(); this.vm = v.getMonth(); this.clamp(); },
       clamp() {
         if (!this.focus) return;
         const f = this.parse(this.focus);
         if (f.getFullYear() === this.vy && f.getMonth() === this.vm) return;
         const last = new Date(this.vy, this.vm + 1, 0).getDate();
         this.focus = this.iso(this.vy, this.vm, Math.min(f.getDate(), last));
       },
       move(n) {
         const f = this.parse(this.focus);
         f.setDate(f.getDate() + n);
         this.focus = this.iso(f.getFullYear(), f.getMonth(), f.getDate());
         this.vy = f.getFullYear(); this.vm = f.getMonth();
         this.$nextTick(() => { const b = this.$refs.grid.querySelector('[data-focus]'); if (b) b.focus(); });
       },
       pick(s) { this.sel = s; this.focus = s; this.open = false; this.$nextTick(() => this.$refs.trigger.focus()); },
       cls(s) {
         if (s === this.sel) return 'bg-zinc-700 font-medium text-white hover:bg-zinc-800';
         if (s === this.today) return 'bg-zinc-200 font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-300';
         return 'text-zinc-900 hover:bg-zinc-200';
       }
     }" @click.outside="open = false" @keydown.escape.window="open = false">
  <span id="due-label" class="mb-1.5 block text-[13px]/5 font-medium">Due date</span>
  <input type="hidden" name="due_date" :value="sel">

  <button type="button" x-ref="trigger" @click="open = !open"
          aria-labelledby="due-label" :aria-expanded="open" aria-haspopup="dialog"
          class="inline-flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 hover:bg-zinc-100">
    <span class="tabular-nums" :class="sel ? 'text-zinc-900' : 'text-zinc-500'" x-text="sel ? fmt(sel) : 'Select a date'"></span>
    <i data-lucide="calendar" class="size-4 shrink-0 text-zinc-600"></i>
  </button>

  <div x-show="open" x-cloak x-trap="open" role="dialog" aria-label="Choose a due date"
       class="absolute left-0 z-40 mt-1 rounded-xl border border-zinc-200 bg-white p-3 shadow-lg">
    <div class="flex items-center justify-between pb-2">
      <button type="button" @click="shift(-1)" aria-label="Previous month"
              class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
        <i data-lucide="chevron-left" class="size-4"></i>
      </button>
      <span class="text-[13px]/5 font-medium tabular-nums" aria-live="polite" x-text="title(0)"></span>
      <button type="button" @click="shift(1)" aria-label="Next month"
              class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
        <i data-lucide="chevron-right" class="size-4"></i>
      </button>
    </div>
    <table x-ref="grid" class="border-collapse"
             @keydown.arrow-left.prevent="move(-1)"  @keydown.arrow-right.prevent="move(1)"
             @keydown.arrow-up.prevent="move(-7)"    @keydown.arrow-down.prevent="move(7)"
             @keydown.home.prevent="move(-((parse(focus).getDay() + 6) % 7))"
             @keydown.end.prevent="move(6 - ((parse(focus).getDay() + 6) % 7))"
             @keydown.page-up.prevent="shift(-1)"    @keydown.page-down.prevent="shift(1)">
      <caption class="sr-only" x-text="'Calendar, ' + title(0)"></caption>
      <thead>
        <tr>
          <template x-for="h in head" :key="h">
            <th scope="col" class="size-9 text-[11px]/4 font-medium text-zinc-500" x-text="h"></th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template x-for="(week, wi) in weeks(0)" :key="wi">
          <tr>
            <template x-for="(c, ci) in week" :key="ci">
              <td class="p-0">
                <template x-if="c">
                  <button type="button" @click="pick(c.iso)"
                          :aria-label="long(c.iso)" :aria-pressed="c.iso === sel"
                          :aria-current="c.iso === today ? 'date' : null"
                          :tabindex="c.iso === focus ? 0 : -1"
                          :data-focus="c.iso === focus ? '1' : null"
                          class="inline-flex size-9 items-center justify-center rounded-lg text-[13px]/5 tabular-nums"
                          :class="cls(c.iso)" x-text="c.day"></button>
                </template>
                <template x-if="!c"><span class="block size-9"></span></template>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2">
      <button type="button" @click="sel = null" class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Clear</button>
      <button type="button" @click="vy = new Date().getFullYear(); vm = new Date().getMonth(); pick(today)"
              class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Today</button>
    </div>
  </div>
</div>` },

      { id: 'range', name: 'Date range', code:
`<!-- Two months, one state. A range is two values on one grid, never two single
     pickers side by side — that lets someone set an end before its start and
     leaves something else to reject it afterwards.

     First click sets the start, second the end, third starts over. An end
     before its start swaps them rather than refusing: the user has said which
     two days they mean and the order is an implementation detail.

     The band sits on the td and the endpoints on the button, so one continuous
     stripe runs behind the row while the two ends stay round. Today keeps only
     a ring here, not a fill — a zinc-200 chip inside a zinc-200 band is
     invisible. -->
<div data-kui="calendar/range" class="inline-block rounded-xl border border-zinc-300 bg-white p-3"
     x-data="{
       vy: new Date().getFullYear(),
       vm: new Date().getMonth(),
       today: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       head: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
       iso(y, m, d) { return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'); },
       parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
       title(o) { return new Date(this.vy, this.vm + o, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }); },
       long(s) { return this.parse(s).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); },
       fmt(s) { return s ? this.parse(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; },
       weeks(o) {
         const y = this.vy, m = this.vm + o;
         const lead = (new Date(y, m, 1).getDay() + 6) % 7;
         const total = new Date(y, m + 1, 0).getDate();
         const cells = [];
         for (let i = 0; i < lead; i++) cells.push(null);
         for (let d = 1; d <= total; d++) {
           const dt = new Date(y, m, d);
           cells.push({ iso: this.iso(dt.getFullYear(), dt.getMonth(), d), day: d, dow: dt.getDay() });
         }
         while (cells.length % 7) cells.push(null);
         const out = [];
         for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
         return out;
       },
       shift(n) { const v = new Date(this.vy, this.vm + n, 1); this.vy = v.getFullYear(); this.vm = v.getMonth(); this.clamp(); },
       clamp() {
         if (!this.focus) return;
         const f = this.parse(this.focus);
         if (f.getFullYear() === this.vy && f.getMonth() === this.vm) return;
         const last = new Date(this.vy, this.vm + 1, 0).getDate();
         this.focus = this.iso(this.vy, this.vm, Math.min(f.getDate(), last));
       },
       start: null, end: null, hover: null,
       pick(s) {
         if (!this.start || (this.start && this.end)) { this.start = s; this.end = null; return; }
         if (s < this.start) { this.end = this.start; this.start = s; } else { this.end = s; }
         this.hover = null;
       },
       tail() { return this.end || this.hover; },
       isEnd(s) { return s === this.start || s === this.end; },
       span() { return (this.start && this.end) ? Math.round((this.parse(this.end) - this.parse(this.start)) / 86400000) + 1 : 0; },
       band(s) {
         const t = this.tail();
         if (!this.start || !t || this.start === t) return '';
         const lo = this.start < t ? this.start : t, hi = this.start < t ? t : this.start;
         if (s < lo || s > hi) return '';
         if (s === lo) return 'bg-zinc-200 rounded-l-lg';
         if (s === hi) return 'bg-zinc-200 rounded-r-lg';
         return 'bg-zinc-200';
       },
       cls(s) {
         if (this.isEnd(s)) return 'bg-zinc-700 font-medium text-white hover:bg-zinc-800';
         if (s === this.today) return 'font-medium text-zinc-900 ring-1 ring-inset ring-zinc-400 hover:bg-zinc-300';
         return 'text-zinc-900 hover:bg-zinc-200';
       }
     }">
  <div class="flex items-center justify-between pb-2">
    <button type="button" @click="shift(-1)" aria-label="Previous month"
            class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>
    <span class="text-[13px]/5 font-medium tabular-nums" aria-live="polite" x-text="fmt(start) + ' – ' + fmt(end)"></span>
    <button type="button" @click="shift(1)" aria-label="Next month"
            class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
  <div class="flex flex-col gap-5 lg:flex-row" @mouseleave="hover = null">
    <template x-for="o in [0, 1]" :key="o">
      <div :class="o === 1 && 'hidden lg:block'">
        <p class="pb-1 text-center text-[12px]/4 font-medium text-zinc-600" x-text="title(o)"></p>
        <table class="border-collapse">
          <caption class="sr-only" x-text="'Calendar, ' + title(o)"></caption>
          <thead>
            <tr>
              <template x-for="h in head" :key="h">
                <th scope="col" class="size-9 text-[11px]/4 font-medium text-zinc-500" x-text="h"></th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template x-for="(week, wi) in weeks(o)" :key="wi">
              <tr>
                <template x-for="(c, ci) in week" :key="ci">
                  <td class="p-0" :class="c && band(c.iso)">
                    <template x-if="c">
                      <button type="button" @click="pick(c.iso)" @mouseenter="if (start && !end) hover = c.iso"
                              :aria-label="long(c.iso)" :aria-pressed="isEnd(c.iso)"
                              :aria-current="c.iso === today ? 'date' : null"
                              class="inline-flex size-9 items-center justify-center rounded-lg text-[13px]/5 tabular-nums"
                              :class="cls(c.iso)" x-text="c.day"></button>
                    </template>
                    <template x-if="!c"><span class="block size-9"></span></template>
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>
  </div>
  <div class="mt-3 flex items-center justify-between border-t border-zinc-200 pt-2">
    <span class="text-[12px]/4 tabular-nums text-zinc-500" x-text="span() ? span() + ' days' : 'Pick a start and an end'"></span>
    <button type="button" @click="start = null; end = null; hover = null"
            class="text-[12px]/4 font-medium text-zinc-900 underline underline-offset-2">Clear</button>
  </div>
</div>` },

      { id: 'jump', name: 'Jumping to a distant month', code:
`<!-- Chevrons are fine for next week and useless for March 2019 — that is 84
     clicks. The header doubles as two selects, so any month in a twelve-year
     window is one gesture.

     The year list is built around the current year rather than hard-coded, so
     this markup does not quietly expire. -->
<div data-kui="calendar/jump" class="inline-block rounded-xl border border-zinc-300 bg-white p-3"
     x-data="{
       focus: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       sel: null,
       months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
       years: (() => { const y = new Date().getFullYear(); const a = []; for (let i = y - 8; i <= y + 3; i++) a.push(i); return a; })(),
       vy: new Date().getFullYear(),
       vm: new Date().getMonth(),
       today: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       head: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
       iso(y, m, d) { return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'); },
       parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
       title(o) { return new Date(this.vy, this.vm + o, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }); },
       long(s) { return this.parse(s).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); },
       fmt(s) { return s ? this.parse(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; },
       weeks(o) {
         const y = this.vy, m = this.vm + o;
         const lead = (new Date(y, m, 1).getDay() + 6) % 7;
         const total = new Date(y, m + 1, 0).getDate();
         const cells = [];
         for (let i = 0; i < lead; i++) cells.push(null);
         for (let d = 1; d <= total; d++) {
           const dt = new Date(y, m, d);
           cells.push({ iso: this.iso(dt.getFullYear(), dt.getMonth(), d), day: d, dow: dt.getDay() });
         }
         while (cells.length % 7) cells.push(null);
         const out = [];
         for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
         return out;
       },
       shift(n) { const v = new Date(this.vy, this.vm + n, 1); this.vy = v.getFullYear(); this.vm = v.getMonth(); this.clamp(); },
       clamp() {
         if (!this.focus) return;
         const f = this.parse(this.focus);
         if (f.getFullYear() === this.vy && f.getMonth() === this.vm) return;
         const last = new Date(this.vy, this.vm + 1, 0).getDate();
         this.focus = this.iso(this.vy, this.vm, Math.min(f.getDate(), last));
       },
       move(n) {
         const f = this.parse(this.focus);
         f.setDate(f.getDate() + n);
         this.focus = this.iso(f.getFullYear(), f.getMonth(), f.getDate());
         this.vy = f.getFullYear(); this.vm = f.getMonth();
         this.$nextTick(() => { const b = this.$refs.grid.querySelector('[data-focus]'); if (b) b.focus(); });
       },
       cls(s) {
         if (s === this.sel) return 'bg-zinc-700 font-medium text-white hover:bg-zinc-800';
         if (s === this.today) return 'bg-zinc-200 font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-300';
         return 'text-zinc-900 hover:bg-zinc-200';
       }
     }">
  <div class="flex items-center gap-1.5 pb-2">
    <button type="button" @click="shift(-1)" aria-label="Previous month"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>

    <label for="cal-month" class="sr-only">Month</label>
    <select id="cal-month" x-model.number="vm" @change="$nextTick(() => clamp())"
            class="h-8 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-2 text-[13px]/5 font-medium focus:border-zinc-700 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">
      <template x-for="(m, i) in months" :key="m">
        <option :value="i" x-text="m"></option>
      </template>
    </select>

    <label for="cal-year" class="sr-only">Year</label>
    <select id="cal-year" x-model.number="vy" @change="$nextTick(() => clamp())"
            class="h-8 shrink-0 rounded-lg border border-zinc-200 bg-white px-2 text-[13px]/5 font-medium tabular-nums focus:border-zinc-700 focus:outline-3 focus:outline-offset-2 focus:outline-zinc-700/15">
      <template x-for="y in years" :key="y">
        <option :value="y" x-text="y"></option>
      </template>
    </select>

    <button type="button" @click="shift(1)" aria-label="Next month"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
  <table x-ref="grid" class="border-collapse"
           @keydown.arrow-left.prevent="move(-1)"  @keydown.arrow-right.prevent="move(1)"
             @keydown.arrow-up.prevent="move(-7)"    @keydown.arrow-down.prevent="move(7)"
             @keydown.page-up.prevent="shift(-1)"    @keydown.page-down.prevent="shift(1)">
    <caption class="sr-only" x-text="'Calendar, ' + title(0)"></caption>
    <thead>
      <tr>
        <template x-for="h in head" :key="h">
          <th scope="col" class="size-9 text-[11px]/4 font-medium text-zinc-500" x-text="h"></th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template x-for="(week, wi) in weeks(0)" :key="wi">
        <tr>
          <template x-for="(c, ci) in week" :key="ci">
            <td class="p-0">
              <template x-if="c">
                <button type="button" @click="sel = c.iso; focus = c.iso"
                        :aria-label="long(c.iso)" :aria-pressed="c.iso === sel"
                        :aria-current="c.iso === today ? 'date' : null"
                        :tabindex="c.iso === focus ? 0 : -1"
                        :data-focus="c.iso === focus ? '1' : null"
                        class="inline-flex size-9 items-center justify-center rounded-lg text-[13px]/5 tabular-nums"
                        :class="cls(c.iso)" x-text="c.day"></button>
              </template>
              <template x-if="!c"><span class="block size-9"></span></template>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</div>` },

      { id: 'constrained', name: 'Limits and blocked dates', code:
`<!-- A delivery date: not in the past, not more than 90 days out, and not on a
     Sunday or a plant holiday. The rules live in one predicate, so the grid,
     the keyboard and any later validation cannot disagree about them.

     Blocked days keep their square. Removing them would reshape the month and
     move every date after them into a different column.

     why() puts the reason into the accessible name, because a disabled button
     announces "unavailable" and never says why. -->
<div data-kui="calendar/constrained" class="inline-block rounded-xl border border-zinc-300 bg-white p-3"
     x-data="{
       focus: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       sel: null,
       holidays: ['2026-10-02', '2026-11-08', '2026-12-25'],
       vy: new Date().getFullYear(),
       vm: new Date().getMonth(),
       today: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       head: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
       iso(y, m, d) { return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'); },
       parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
       title(o) { return new Date(this.vy, this.vm + o, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }); },
       long(s) { return this.parse(s).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); },
       fmt(s) { return s ? this.parse(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; },
       weeks(o) {
         const y = this.vy, m = this.vm + o;
         const lead = (new Date(y, m, 1).getDay() + 6) % 7;
         const total = new Date(y, m + 1, 0).getDate();
         const cells = [];
         for (let i = 0; i < lead; i++) cells.push(null);
         for (let d = 1; d <= total; d++) {
           const dt = new Date(y, m, d);
           cells.push({ iso: this.iso(dt.getFullYear(), dt.getMonth(), d), day: d, dow: dt.getDay() });
         }
         while (cells.length % 7) cells.push(null);
         const out = [];
         for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
         return out;
       },
       shift(n) { const v = new Date(this.vy, this.vm + n, 1); this.vy = v.getFullYear(); this.vm = v.getMonth(); this.clamp(); },
       clamp() {
         if (!this.focus) return;
         const f = this.parse(this.focus);
         if (f.getFullYear() === this.vy && f.getMonth() === this.vm) return;
         const last = new Date(this.vy, this.vm + 1, 0).getDate();
         this.focus = this.iso(this.vy, this.vm, Math.min(f.getDate(), last));
       },
       move(n) {
         const f = this.parse(this.focus);
         f.setDate(f.getDate() + n);
         this.focus = this.iso(f.getFullYear(), f.getMonth(), f.getDate());
         this.vy = f.getFullYear(); this.vm = f.getMonth();
         this.$nextTick(() => { const b = this.$refs.grid.querySelector('[data-focus]'); if (b) b.focus(); });
       },
       max: (() => { const t = new Date(); t.setDate(t.getDate() + 90); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       blocked(s, dow) { return s < this.today || s > this.max || dow === 0 || this.holidays.includes(s); },
       why(s, dow) {
         if (s < this.today) return ' — in the past';
         if (s > this.max) return ' — beyond the 90 day window';
         if (dow === 0) return ' — Sunday, plant closed';
         if (this.holidays.includes(s)) return ' — plant holiday';
         return '';
       },
       cls(s) {
         if (s === this.sel) return 'bg-zinc-700 font-medium text-white hover:bg-zinc-800';
         if (s === this.today) return 'bg-zinc-200 font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-300';
         return 'text-zinc-900 hover:bg-zinc-200';
       }
     }">
  <div class="flex items-center justify-between pb-2">
    <button type="button" @click="shift(-1)" aria-label="Previous month"
            class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
      <i data-lucide="chevron-left" class="size-4"></i>
    </button>
    <span class="text-[13px]/5 font-medium tabular-nums" aria-live="polite" x-text="title(0)"></span>
    <button type="button" @click="shift(1)" aria-label="Next month"
            class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
      <i data-lucide="chevron-right" class="size-4"></i>
    </button>
  </div>
  <table x-ref="grid" class="border-collapse"
           @keydown.arrow-left.prevent="move(-1)"  @keydown.arrow-right.prevent="move(1)"
             @keydown.arrow-up.prevent="move(-7)"    @keydown.arrow-down.prevent="move(7)"
             @keydown.page-up.prevent="shift(-1)"    @keydown.page-down.prevent="shift(1)">
    <caption class="sr-only" x-text="'Calendar, ' + title(0)"></caption>
    <thead>
      <tr>
        <template x-for="h in head" :key="h">
          <th scope="col" class="size-9 text-[11px]/4 font-medium text-zinc-500" x-text="h"></th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template x-for="(week, wi) in weeks(0)" :key="wi">
        <tr>
          <template x-for="(c, ci) in week" :key="ci">
            <td class="p-0">
              <template x-if="c">
                <button type="button" @click="sel = c.iso; focus = c.iso"
                        :disabled="blocked(c.iso, c.dow)"
                        :aria-label="long(c.iso) + why(c.iso, c.dow)" :aria-pressed="c.iso === sel"
                        :aria-current="c.iso === today ? 'date' : null"
                        :tabindex="c.iso === focus ? 0 : -1"
                        :data-focus="c.iso === focus ? '1' : null"
                        class="inline-flex size-9 items-center justify-center rounded-lg text-[13px]/5 tabular-nums"
                        :class="cls(c.iso)" x-text="c.day"></button>
              </template>
              <template x-if="!c"><span class="block size-9"></span></template>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
  <p class="mt-2 max-w-[17rem] text-[12px]/4 text-zinc-500">Sundays and plant holidays are closed. Delivery can be booked up to 90 days ahead.</p>
</div>` },

      { id: 'presets', name: 'Range with presets', code:
`<!-- Nobody clicks their way to "last 30 days". The preset column is what gets
     used; the grid is there for the once a month it is not enough.

     The financial year runs April to March, so before April "This FY" starts in
     the previous calendar year — m < 3 is the whole rule. Getting that wrong is
     a bug that only appears in Q1 and only to accounts.

     Picking a day in the grid clears the preset label, because the range is no
     longer the thing the preset named. -->
<div data-kui="calendar/presets" class="relative inline-block"
     x-data="{
       open: false,
       vy: new Date().getFullYear(),
       vm: new Date().getMonth(),
       today: (() => { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); })(),
       head: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
       iso(y, m, d) { return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'); },
       parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
       title(o) { return new Date(this.vy, this.vm + o, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }); },
       long(s) { return this.parse(s).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); },
       fmt(s) { return s ? this.parse(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; },
       weeks(o) {
         const y = this.vy, m = this.vm + o;
         const lead = (new Date(y, m, 1).getDay() + 6) % 7;
         const total = new Date(y, m + 1, 0).getDate();
         const cells = [];
         for (let i = 0; i < lead; i++) cells.push(null);
         for (let d = 1; d <= total; d++) {
           const dt = new Date(y, m, d);
           cells.push({ iso: this.iso(dt.getFullYear(), dt.getMonth(), d), day: d, dow: dt.getDay() });
         }
         while (cells.length % 7) cells.push(null);
         const out = [];
         for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
         return out;
       },
       shift(n) { const v = new Date(this.vy, this.vm + n, 1); this.vy = v.getFullYear(); this.vm = v.getMonth(); this.clamp(); },
       clamp() {
         if (!this.focus) return;
         const f = this.parse(this.focus);
         if (f.getFullYear() === this.vy && f.getMonth() === this.vm) return;
         const last = new Date(this.vy, this.vm + 1, 0).getDate();
         this.focus = this.iso(this.vy, this.vm, Math.min(f.getDate(), last));
       },
       start: null, end: null, hover: null,
       pick(s) {
         if (!this.start || (this.start && this.end)) { this.start = s; this.end = null; return; }
         if (s < this.start) { this.end = this.start; this.start = s; } else { this.end = s; }
         this.hover = null;
       },
       tail() { return this.end || this.hover; },
       isEnd(s) { return s === this.start || s === this.end; },
       span() { return (this.start && this.end) ? Math.round((this.parse(this.end) - this.parse(this.start)) / 86400000) + 1 : 0; },
       band(s) {
         const t = this.tail();
         if (!this.start || !t || this.start === t) return '';
         const lo = this.start < t ? this.start : t, hi = this.start < t ? t : this.start;
         if (s < lo || s > hi) return '';
         if (s === lo) return 'bg-zinc-200 rounded-l-lg';
         if (s === hi) return 'bg-zinc-200 rounded-r-lg';
         return 'bg-zinc-200';
       },
       cls(s) {
         if (this.isEnd(s)) return 'bg-zinc-700 font-medium text-white hover:bg-zinc-800';
         if (s === this.today) return 'font-medium text-zinc-900 ring-1 ring-inset ring-zinc-400 hover:bg-zinc-300';
         return 'text-zinc-900 hover:bg-zinc-200';
       }
       ,
       presets: ['Today', 'Last 7 days', 'Last 30 days', 'This month', 'Last month', 'This FY'],
       preset: null,
       apply(name) {
         const t = new Date(), y = t.getFullYear(), m = t.getMonth(), d = t.getDate();
         let a, b;
         if (name === 'Today')        { a = new Date(y, m, d); b = new Date(y, m, d); }
         if (name === 'Last 7 days')  { a = new Date(y, m, d - 6); b = new Date(y, m, d); }
         if (name === 'Last 30 days') { a = new Date(y, m, d - 29); b = new Date(y, m, d); }
         if (name === 'This month')   { a = new Date(y, m, 1); b = new Date(y, m + 1, 0); }
         if (name === 'Last month')   { a = new Date(y, m - 1, 1); b = new Date(y, m, 0); }
         if (name === 'This FY')      { a = new Date(m < 3 ? y - 1 : y, 3, 1); b = new Date(y, m, d); }
         this.start = this.iso(a.getFullYear(), a.getMonth(), a.getDate());
         this.end = this.iso(b.getFullYear(), b.getMonth(), b.getDate());
         this.preset = name;
         this.vy = a.getFullYear(); this.vm = a.getMonth();
       },
       tap(s) { this.preset = null; this.pick(s); }
     }" @click.outside="open = false" @keydown.escape.window="open = false">
  <button type="button" @click="open = !open" :aria-expanded="open" aria-haspopup="dialog"
          class="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100">
    <i data-lucide="calendar-range" class="size-4 text-zinc-600"></i>
    <span class="tabular-nums" x-text="preset || (start ? fmt(start) + ' – ' + fmt(end) : 'Select period')"></span>
    <i data-lucide="chevron-down" class="size-3.5 text-zinc-600"></i>
  </button>

  <div x-show="open" x-cloak x-trap="open" role="dialog" aria-label="Choose a reporting period"
       class="absolute left-0 z-40 mt-1 flex flex-col rounded-xl border border-zinc-200 bg-white shadow-lg sm:flex-row">
    <div class="flex shrink-0 gap-1 overflow-x-auto border-b border-zinc-200 p-2 sm:w-44 sm:flex-col sm:gap-0.5 sm:overflow-visible sm:border-r sm:border-b-0">
      <template x-for="p in presets" :key="p">
        <button type="button" @click="apply(p)" :aria-pressed="preset === p"
                class="inline-flex h-8 shrink-0 items-center rounded-lg px-3 text-left text-[13px]/5 whitespace-nowrap"
                :class="preset === p ? 'bg-zinc-700 font-medium text-white' : 'text-zinc-900 hover:bg-zinc-200'">
          <span x-text="p"></span>
        </button>
      </template>
    </div>

    <div class="p-3">
      <div class="flex items-center justify-between pb-2">
        <button type="button" @click="shift(-1)" aria-label="Previous month"
                class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
          <i data-lucide="chevron-left" class="size-4"></i>
        </button>
        <span class="text-[13px]/5 font-medium tabular-nums" aria-live="polite" x-text="fmt(start) + ' – ' + fmt(end)"></span>
        <button type="button" @click="shift(1)" aria-label="Next month"
                class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900">
          <i data-lucide="chevron-right" class="size-4"></i>
        </button>
      </div>
      <div class="flex flex-col gap-5 lg:flex-row" @mouseleave="hover = null">
        <template x-for="o in [0, 1]" :key="o">
          <div :class="o === 1 && 'hidden lg:block'">
            <p class="pb-1 text-center text-[12px]/4 font-medium text-zinc-600" x-text="title(o)"></p>
            <table class="border-collapse">
              <caption class="sr-only" x-text="'Calendar, ' + title(o)"></caption>
              <thead>
                <tr>
                  <template x-for="h in head" :key="h">
                    <th scope="col" class="size-9 text-[11px]/4 font-medium text-zinc-500" x-text="h"></th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <template x-for="(week, wi) in weeks(o)" :key="wi">
                  <tr>
                    <template x-for="(c, ci) in week" :key="ci">
                      <td class="p-0" :class="c && band(c.iso)">
                        <template x-if="c">
                          <button type="button" @click="tap(c.iso)" @mouseenter="if (start && !end) hover = c.iso"
                                  :aria-label="long(c.iso)" :aria-pressed="isEnd(c.iso)"
                                  :aria-current="c.iso === today ? 'date' : null"
                                  class="inline-flex size-9 items-center justify-center rounded-lg text-[13px]/5 tabular-nums"
                                  :class="cls(c.iso)" x-text="c.day"></button>
                        </template>
                        <template x-if="!c"><span class="block size-9"></span></template>
                      </td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </template>
      </div>
      <div class="mt-3 flex items-center justify-between gap-3 border-t border-zinc-200 pt-3">
        <span class="text-[12px]/4 tabular-nums text-zinc-500" x-text="span() ? span() + ' days' : 'No period set'"></span>
        <div class="flex items-center gap-2">
          <button type="button" @click="start = null; end = null; preset = null"
                  class="inline-flex h-8 items-center rounded-lg border border-zinc-200 bg-white px-3 text-[13px]/5 font-medium hover:bg-zinc-100">Clear</button>
          <button type="button" @click="open = false" :disabled="!start || !end"
                  class="inline-flex h-8 items-center rounded-lg border border-transparent bg-zinc-700 px-3 text-[13px]/5 font-medium text-white hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400">Apply</button>
        </div>
      </div>
    </div>
  </div>
</div>` },

      { id: 'native', name: 'The native input', code:
`<!-- Reach for this first. On a phone it opens the OS date wheel, which beats
     any grid rendered in a page; it validates, it respects the device locale,
     and it posts an ISO string that Django parses with no format setting at all.

     Use the grid instead when the choice depends on seeing the month — a
     delivery date next to the weekend, a range across a month end. Use this
     when the user already knows the date. -->
<div data-kui="calendar/native" class="max-w-xs">
  <label for="grn-date" class="mb-1.5 block text-[13px]/5 font-medium">GRN date</label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
    <input type="date" id="grn-date" name="grn_date" value="2026-08-14" max="2026-12-31"
           class="h-9 w-full bg-transparent px-3 text-[14px]/5 tabular-nums outline-none">
  </div>
  <p class="mt-1.5 text-[12px]/4 text-zinc-500">Cannot be later than the invoice date.</p>
</div>` },

      { id: 'django', name: 'Django form fields', code:
`<!-- Two named inputs, one clean(). The values that post are ISO strings, which
     is the one format DateField parses without touching DATE_INPUT_FORMATS.

     # forms.py
     class PeriodForm(forms.Form):
         start = forms.DateField(input_formats=['%Y-%m-%d'])
         end   = forms.DateField(input_formats=['%Y-%m-%d'])

         def clean(self):
             c = super().clean()
             if c.get('start') and c.get('end') and c['start'] > c['end']:
                 raise ValidationError('The period ends before it starts.')
             return c

     The clean() check is not optional even though the widget prevents it — a
     POST does not have to come from this page. :min on the end input is a
     convenience for the user, never a guarantee to the view. -->
<form data-kui="calendar/django" method="get" class="max-w-md"
      x-data="{
        start: '2026-04-01', end: '2026-08-20',
        parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
        fmt(s) { return s ? this.parse(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; },
        span() { return (this.start && this.end) ? Math.round((this.parse(this.end) - this.parse(this.start)) / 86400000) + 1 : 0; }
      }">
  <fieldset>
    <legend class="mb-1.5 text-[13px]/5 font-medium">Reporting period</legend>

    <div class="flex items-center gap-2">
      <div class="flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <label for="id_start" class="sr-only">Start date</label>
        <input type="date" id="id_start" name="start" x-model="start"
               class="h-9 w-full bg-transparent px-3 text-[14px]/5 tabular-nums outline-none">
      </div>
      <span class="text-[13px]/5 text-zinc-500" aria-hidden="true">to</span>
      <div class="flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
        <label for="id_end" class="sr-only">End date</label>
        <input type="date" id="id_end" name="end" x-model="end" :min="start"
               class="h-9 w-full bg-transparent px-3 text-[14px]/5 tabular-nums outline-none">
      </div>
    </div>

    <p class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500" aria-live="polite"
       x-text="span() ? fmt(start) + ' to ' + fmt(end) + ' · ' + span() + ' days' : 'Both dates are required.'"></p>
  </fieldset>

  <button type="submit" class="mt-4 inline-flex h-9 items-center rounded-lg border border-transparent bg-zinc-700 px-4 text-[13px]/5 font-medium text-white hover:bg-zinc-800">Run report</button>
</form>` }
    ]
  },

  {
    id: 'questionnaire', name: 'Questionnaire', category: 'forms',
    description: 'A run of questions answered in order on one page — a QC checklist, a vendor assessment, a safety audit. One fieldset per question, the question text as its legend, and three equal tiles carrying the answer so a column of them can be read at a glance.',
    when: 'A fixed set of questions somebody works through and signs: incoming material inspection, a safety audit before a GRN is posted, a vendor onboarding assessment. One question that happens to have options is a radio group, not a questionnaire. A set of unrelated fields that describe one record is a form page.',
    notes: [
      'A questionnaire is one <form> of <fieldset>s, one per question, and the question text is the <legend>. It is not a <label>, because the answer is almost always a radio group and a group has no single control for a label to point at — a <label for> has to name one of the options, so clicking the question text silently ticks that one. Django says the same thing in code: RadioSelect.id_for_label returns an empty string on purpose. The exception is a follow-up whose answer is exactly one control — a remark, a measured value — which takes a real <label for> and no fieldset at all.',
      'Do not put padding on a fieldset, and do not make one a flex or grid row. The rendered legend is laid out in the fieldset\'s block-start border area rather than in its content box, so padding-top applies below the legend and the legend is not a flex item at all: give a question block px-4 py-3 and the question renders flush against the top edge, and try to sit the question beside its answers with flex and the question jumps above the row. The legend goes on its own line and the answers go under it.',
      'Answers belong in a fixed grid, not in a row of loose radios. Three inline radios ragged to their own label widths give a different left edge on every question, and a sheet of eighteen of them reads as noise; the same three as an equal grid-cols-3 put the chosen tile in the same place on every row, so Fail is always the middle position and a column of tiles can be scanned for failures without reading a word. It is the toggle argument — the position carries the state — applied to a checklist.',
      'Every question\'s name carries the parameter, never the answer type. name="qc_certificate", name="qc_moisture" — not name="result" repeated down the sheet, which makes eighteen parameters into one radio group eighteen options long where answering the second one clears the first. Nothing looks wrong at the moment it breaks; the sheet just refuses to hold more than one answer and the POST carries one key.',
      'Not applicable is an answer with a value of its own, never the absence of one. An unanswered radio group posts no key at all, so "this parameter does not apply to this material" and "nobody reached this line" arrive at the server identically, and a sheet that cannot tell those apart cannot be audited. The same goes for a multi-select: "None of the above" is an explicit value, because zero ticked boxes and a question that was never rendered are the same empty POST.',
      'Nothing is preselected. A checklist that arrives with every parameter already reading Pass is signed off by inertia — the inspector scrolls to the bottom and presses the button — and the record cannot distinguish an answer somebody gave from a default nobody read. Preselect only where the safe answer is also the overwhelmingly common one and being wrong about it costs nothing, which on an inspection sheet is never.',
      'A conditional follow-up needs disabled as well as x-show. x-show is display:none, and a display:none input is still in the form and still posts: hide a remark box that already has text in it and the fail note travels with a POST that says the parameter passed. Bind :disabled to the inverse of the show condition and the field leaves the submission the moment it leaves the screen. Disabled also bars the control from constraint validation, which is the second half of the fix — a plain required attribute inside a hidden block makes the form unsubmittable with "An invalid form control is not focusable" in the console and nothing at all on screen, because the browser cannot scroll to a control it is not painting.',
      'Progress counts the questions that are on screen now, and the denominator moves. With three follow-ups that only exist on a fail, a fixed denominator of eighteen can never reach the end on a clean sheet, and a fixed fifteen shows "16 of 15 answered" the moment one fails. Both read as a bug in the counter rather than as the truth about the sheet. Derive both numbers from the same state the questions render from, and keep the bar small — it is a footnote on the header, not the largest object on the page.',
      'Never disable the submit button until the sheet is complete. A dead button says the form is not ready and nothing about which of eighteen parameters is missing, so the user scrolls the whole sheet looking for the gap. Leave it live, let the submit fail, and answer with a summary that names every unanswered question and links into it. That summary is the whole mechanism — the browser\'s own required validation reports one control at a time in a bubble that vanishes, which is useless across eighteen questions.',
      'Saving as you go and one submit at the end owe the user different things. Save-as-you-go — the right choice for a sheet filled on a phone at an unloading bay — owes a per-answer acknowledgement and a draft that survives the tab closing, and it owes the distinction between saved and signed: a draft with every answer in it is still not an inspection until somebody attests to it. One submit at the end owes every entered value back on a failed submit; a sheet that returns blank after twenty answers is filled in once and then never again.',
      'A questionnaire is not a wizard and never hides answered questions. The reviewer who countersigns has to read all eighteen answers at once and compare them against the material; a one-question-at-a-time flow makes that eighteen clicks, breaks Ctrl-F, prints as a single question, and stops anyone noticing that questions 4 and 11 contradict each other. It also costs the inspector who knows the sheet by heart eighteen page transitions to do what scrolling does for free.',
      'Colour goes on the consequence, never on the row. A fail is already legible from the tile that is filled, so tinting the whole question red adds nothing and turns a sheet with four failures into a wall of colour where none of them stands out — and a fill is the first thing forced-colours mode drops. Spend the red on one short line saying what the fail causes, and only on the rows where it causes something. An observed value outside its spec is amber-700, because it is a warning about a number and not yet a verdict.'
    ],
    anatomy: [
      ['Question block', 'A <fieldset> per question, unpadded and never a flex row, holding the question and its answers. It carries the id the failed-submit summary links to.'],
      ['Question text', 'The <legend>: the parameter and the criterion it is judged against. It sits on its own line, because a rendered legend cannot be laid out beside anything.'],
      ['Answer tiles', 'An equal grid-cols-3 of labels, each wrapping a real radio — Pass, Fail, N/A. Equal columns are what give every row the same left edge and put Fail in the same place on all of them.'],
      ['Criterion', 'One short 12px zinc-500 line under the question: the spec, the tolerance, the document it is checked against. Referenced from every option, so it has to stay to one line.'],
      ['Follow-up', 'The question that only exists under one answer, indented behind a left rule. x-show to hide it and :disabled to take it out of the POST and out of validation together.'],
      ['Progress line', 'A 4px rail no wider than the count beside it, plus the jump to the first gap. Both numbers derive from the same state the questions render from.'],
      ['Unanswered summary', 'The panel a failed submit renders above the sheet: how many are missing and a link to each, taking focus when it appears.'],
      ['Sign-off', 'The attestation at the foot — what is certified, by whom, when — and the countersignature the GRN waits on. A required checkbox before signing, plain text after.']
    ],
    behaviour: [
      'Every question is on screen at once, in order, and answering one does not move the page. Nothing collapses when it is answered, because the reviewer has to be able to read the answered ones.',
      'The chosen tile is painted from its own radio with has-[:checked], so the tint is the answer rather than a second copy of it, and the radio stays visible inside the tile — hidden with sr-only the only mark left is the tint, which forced-colours mode does not paint.',
      'The progress line counts answered against applicable, and the denominator moves when a conditional follow-up appears or goes. A section with one fail in it legitimately reads "of 5" where a clean one reads "of 4".',
      'A conditional follow-up appears directly under the answer that caused it, is enabled while it is visible and disabled the moment it is not, so what is on screen and what is in the POST are always the same set of questions.',
      'An observed value outside its spec range warns and does not block. The measurement is the point of the sheet, and a control that refuses out-of-range numbers gets an in-range number typed into it instead.',
      'Submit is always live. A failed submit renders the summary above the sheet, moves focus to it, and every entry in it links to a question block that can take focus, so the next Tab enters that group.',
      'Every answer survives a failed submit, and where the sheet saves as it goes each answer is written on change and the header says draft until it is signed. The draft is not the inspection.',
      'A signed sheet renders its answers as text rather than as frozen controls, and reopening is a named action that is logged rather than an edit in place.',
      'At 390px the three tiles stay on one line and the question wraps above them. Nothing scrolls sideways and no row splits its answer across two lines.'
    ],
    a11y: [
      'The <legend> is the question. Browsers group radios by name and announce position within the group already — "Fail, radio button, 2 of 3" — but with no legend the group has no name, and "2 of 3" of what is left to the listener to guess.',
      'The criterion is referenced with aria-describedby from every option, not from the fieldset, because focus lands on one radio and only that radio\'s description is read. That is also why it has to be one short line: it is read out again on every arrow keypress on the way through the group.',
      'The tile is the target and the label text inside it is the option\'s name, so nothing here needs aria-label and the hit area is the whole 100px cell rather than the 16px circle. Focus is shown on the tile with has-[:focus-visible] and an outline, because a 3px indicator drawn round a 16px radio lands on top of the radio.',
      'An unanswered required question sets aria-invalid on every option in the group and points every option at the same error paragraph. Marking only the first option leaves the message unread for anybody who arrows onto the second.',
      'The progress rail is role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax and an aria-label naming what is progressing. It is not a live region — announcing "4 of 5" after every answer talks over the control the user just operated.',
      'The failed-submit summary takes focus and does not also carry role="alert". Focusing it is what reads it; a live region on top of that reads the whole list twice, the first time before the user has any idea where they are.',
      'Each summary entry links to the question block, which carries tabindex="-1". Without the tabindex the fragment scrolls the question into view but leaves focus on the summary, so the next Tab walks down the rest of the links instead of entering the group. Linking to the first radio instead does move focus, but scrolls that control to the top of the viewport with its own question above the fold.',
      'Settled answers are text. There is no read-only radio or checkbox, and a disabled group is both silent about why it is locked and absent from the POST, so a signed sheet is rendered rather than frozen.'
    ],
    related: ['radio', 'field', 'form-page'],
    variants: [
      { id: 'question', name: 'One question', code:
`<!-- The question is the <legend> of a <fieldset>, not a <label>. The answer is
     a radio group and a group has no single control to point at, so a
     <label for> would have to name one of the three options — and clicking the
     question text would then tick that one. Django agrees in code:
     RadioSelect.id_for_label returns an empty string on purpose.

     Three equal tiles rather than three inline radios. Inline, each option is
     as wide as its own word, so every question on a sheet gets a different left
     edge; equal columns put Fail in the same place on every row and let a
     column of them be scanned without reading.

     Nothing is preselected, and N/A is an option with a value. Neither is a
     detail: a parameter that arrives reading Pass is signed off by whoever
     scrolls past it, and an unanswered group posts no key at all, so "does not
     apply to this material" and "nobody reached this line" would be the same
     empty POST. -->
<fieldset data-kui="questionnaire/question" class="max-w-xl">
  <legend>
    <span class="block text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase tabular-nums">Question 3 of 18</span>
    <span class="mt-1.5 block text-[14px]/5 font-medium">Test certificate received, and the lot number on it matches every bag</span>
  </legend>

  <p id="qq-crit" class="mt-1.5 text-[12px]/4 tabular-nums text-zinc-500">Must be for lot 24-HD-118, dated on or before 16 Aug 2026.</p>

  <div class="mt-3 grid max-w-sm grid-cols-3 gap-2">
    <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
      <input type="radio" name="qc_certificate" value="pass" required aria-describedby="qq-crit" class="size-4 shrink-0 accent-zinc-700">
      <span>Pass</span>
    </label>
    <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
      <input type="radio" name="qc_certificate" value="fail" required aria-describedby="qq-crit" class="size-4 shrink-0 accent-zinc-700">
      <span>Fail</span>
    </label>
    <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
      <input type="radio" name="qc_certificate" value="na" required aria-describedby="qq-crit" class="size-4 shrink-0 accent-zinc-700">
      <span>N/A</span>
    </label>
  </div>
</fieldset>` },

      { id: 'run', name: 'A run of questions', code:
`<!-- No Alpine and no card. A run of questions is five fieldsets and a light
     rule between them; the frame belongs to the sheet that holds them, not to
     the questions, and has-[:checked] paints each tile from its own radio so
     there is no state to keep in step.

     The tiles are what make this readable. Every row gives its answers the same
     grid, so the filled tile lands in one of three fixed positions and the
     failure on the third row is visible from across the room without a red row,
     a badge or a word of explanation. That is the toggle argument — position
     carries the state — applied to a checklist.

     No question numbers. A "1." in front of a wrapping question sets up a
     second left edge that nothing else on the row lines up with, and the number
     only earns its place where something has to refer back to it, which is the
     failed-submit summary.

     The fieldsets are not flex rows and carry no padding. A rendered legend is
     laid out in the fieldset's block-start border area rather than in its
     content box, so it is not a flex item and the fieldset's own padding-top
     lands underneath it — put the question on its own line and the spacing on
     the fieldset's margins. -->
<div data-kui="questionnaire/run" class="max-w-2xl divide-y divide-zinc-100">
  <fieldset class="py-4 first:pt-0 last:pb-0">
    <legend class="text-[13px]/5 font-medium">Bag markings — grade, lot and net weight legible on every bag</legend>
    <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_marking" value="pass" checked class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_marking" value="fail" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_marking" value="na" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
      </label>
    </div>
  </fieldset>

  <fieldset class="py-4 first:pt-0 last:pb-0">
    <legend class="text-[13px]/5 font-medium">Bags sealed, no tears and no damp patches on the pallet</legend>
    <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_seal" value="pass" checked class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_seal" value="fail" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_seal" value="na" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
      </label>
    </div>
  </fieldset>

  <fieldset class="py-4 first:pt-0 last:pb-0">
    <legend class="text-[13px]/5 font-medium">Test certificate lot number matches the bags</legend>
    <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_cert" value="pass" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_cert" value="fail" checked class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_cert" value="na" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
      </label>
    </div>
  </fieldset>

  <fieldset class="py-4 first:pt-0 last:pb-0">
    <legend class="text-[13px]/5 font-medium tabular-nums">Moisture on the hand-held meter at or below 0.05%</legend>
    <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_moisture" value="pass" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_moisture" value="fail" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_moisture" value="na" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
      </label>
    </div>
  </fieldset>

  <fieldset class="py-4 first:pt-0 last:pb-0">
    <legend class="text-[13px]/5 font-medium tabular-nums">Retention sample of 500 g drawn and labelled</legend>
    <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_sample" value="pass" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_sample" value="fail" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qr_sample" value="na" checked class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
      </label>
    </div>
  </fieldset>
</div>` },

      { id: 'observation', name: 'Measured against a spec', code:
`<!-- The spec sits beside the box before anything is typed into it, not in an
     error message after the limit has been broken. A range that only appears
     once it is exceeded is a rule the inspector had to guess at, and the guess
     is what gets written down.

     Out of spec warns and does not block. The measurement is the entire point
     of the sheet — a control that refuses an out-of-range number gets an
     in-range number typed into it instead, and the reading that mattered is
     gone. It is amber-700 rather than red because it is a fact about a number
     and not a verdict: whether 0.46 is accepted, accepted on deviation or
     rejected is a separate question with a separate answer, and this sheet does
     not decide it.

     type="number" gives a numeric keypad on a phone and silently drops anything
     that is not a number, which is why the empty string is tested on its own —
     a blank field is unanswered, not zero.

     The rows are written out rather than looped. A <template x-for> would be
     shorter, but Lucide hydrates once at load and an icon rendered later by
     Alpine stays a bare <i>, so the warning icon inside the loop never
     appears. -->
<div data-kui="questionnaire/observation" class="max-w-xl space-y-5"
     x-data="{
       thickness: '2.42', mfi: '0.46',
       out(v, lo, hi) { const n = parseFloat(v); return v !== '' && !isNaN(n) && (lo > n || n > hi) }
     }">

  <div>
    <label for="qo-thk" class="block text-[13px]/5 font-medium">Sheet thickness after extrusion</label>
    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <div class="flex w-32 items-center rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15"
           :class="out(thickness, 2.35, 2.55) ? 'border-amber-700' : 'border-zinc-200 focus-within:border-zinc-700'">
        <input id="qo-thk" name="obs_thickness" type="number" step="0.01" inputmode="decimal"
               x-model="thickness" aria-describedby="qo-spec-thk"
               class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
        <span class="pr-3 text-[13px]/5 text-zinc-600">mm</span>
      </div>
      <span id="qo-spec-thk" class="text-[12px]/4 tabular-nums text-zinc-500">Spec 2.35 – 2.55 mm</span>
    </div>
  </div>

  <div>
    <label for="qo-mfi" class="block text-[13px]/5 font-medium tabular-nums">Melt flow index at 190 °C / 2.16 kg</label>
    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <div class="flex w-32 items-center rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15"
           :class="out(mfi, 0.28, 0.42) ? 'border-amber-700' : 'border-zinc-200 focus-within:border-zinc-700'">
        <input id="qo-mfi" name="obs_mfi" type="number" step="0.01" inputmode="decimal"
               x-model="mfi" aria-describedby="qo-spec-mfi"
               class="w-full bg-transparent px-3 py-2 text-right text-[14px]/5 tabular-nums outline-none">
      </div>
      <span id="qo-spec-mfi" class="text-[12px]/4 tabular-nums text-zinc-500">Spec 0.28 – 0.42 g/10 min</span>
    </div>
    <p x-show="out(mfi, 0.28, 0.42)" x-cloak class="mt-2 flex items-start gap-1.5 text-[12px]/4 font-medium tabular-nums text-amber-700">
      <i data-lucide="alert-triangle" class="mt-px size-3.5 shrink-0"></i>Above the upper limit. Recorded as measured — accepting it is a separate answer.
    </p>
  </div>
</div>` },

      { id: 'conditional', name: 'Follow-up on a fail', code:
`<!-- The trap this variant exists for: x-show is display:none, and a
     display:none input is still in the form and still posts. Answer Fail, type
     the note, change the answer back to Pass, and without the disabled binding
     the sheet submits qc_ppe=pass alongside a note describing the failure —
     worse than either answer alone, because the record now contradicts itself
     and nothing on screen showed it happen.

     :disabled bound to the inverse of the show condition fixes both halves at
     once. A disabled control is excluded from submission and is also barred
     from constraint validation, which is why required beside it can stay a
     plain static attribute. Written the other way round, a required field
     inside a display:none block makes the form silently unsubmittable: the
     browser logs "An invalid form control is not focusable" and shows the user
     nothing, because it cannot scroll to a control it is not painting.

     The follow-up is a <label for>, not a fieldset with a legend, because its
     answer is exactly one control. It sits immediately after the answer that
     revealed it so the next Tab lands on it, and it is indented behind a rule
     rather than dropped into a tinted panel — the rule says "this belongs to
     the question above" without adding a second slab to the page.

     It counts as a question, which is why the eyebrow above says 5 while it is
     open and 4 when it is not. A denominator that ignores conditionals either
     cannot be reached on a clean sheet or is exceeded on a failed one. -->
<div data-kui="questionnaire/conditional" class="max-w-xl" x-data="{ ppe: 'fail' }">
  <fieldset>
    <legend>
      <span class="block text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase tabular-nums">
        Safety audit · question 7 of <span x-text="ppe === 'fail' ? 5 : 4"></span>
      </span>
      <span class="mt-1.5 block text-[14px]/5 font-medium">Every person on the unloading bay was wearing helmet, safety shoes and hi-vis</span>
    </legend>

    <div class="mt-3 grid max-w-sm grid-cols-3 gap-2">
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qc_ppe" value="pass" x-model="ppe" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qc_ppe" value="fail" x-model="ppe" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
      </label>
      <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
        <input type="radio" name="qc_ppe" value="na" x-model="ppe" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
      </label>
    </div>
  </fieldset>

  <div x-show="ppe === 'fail'" x-cloak class="mt-4 border-l-2 border-zinc-200 pl-4">
    <label for="qf-note" class="block text-[13px]/5 font-medium">
      Who was missing what, and what was done <span class="text-red-600">*</span>
    </label>
    <div class="mt-1.5 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-zinc-700/15">
      <textarea id="qf-note" name="qc_ppe_note" rows="3" required :disabled="ppe !== 'fail'"
                aria-describedby="qf-note-help"
                placeholder="Two unloaders from Sharma Transport, no safety shoes. Sent to the gate store."
                class="w-full resize-y bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500"></textarea>
    </div>
    <p id="qf-note-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Goes to the safety officer and onto the contractor gate pass record.</p>
  </div>
</div>` },

      { id: 'scale', name: 'Rating on a scale', code:
`<!-- Radios with numbers on them, not stars. A star has no defined meaning, so
     three stars from one assessor and three from another are not the same
     judgement; it announces as "3 stars" with no scale attached; half stars
     claim a precision nobody measured; and the whole widget needs its keyboard
     behaviour written by hand, which is exactly the machinery a native radio
     group already has and gets right.

     Both ends are worded and the words sit under the row rather than inside the
     tiles, so five tiles stay five equal squares and still fit at 390px. An
     unworded scale is a mood, and the midpoint of an unworded scale is where
     every assessor who does not want to commit puts the answer.

     The anchors are referenced only from the two options they describe. Attach
     them to all five and the sentence is read out again on every arrow keypress
     across the group.

     Not applicable sits below a rule and outside the scale, because it is not a
     low score. Folded in as a sixth tile it joins the ordering and starts
     getting averaged with the rest. -->
<fieldset data-kui="questionnaire/scale" class="max-w-lg">
  <legend>
    <span class="block text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Vendor assessment · Deccan Bearings Pvt Ltd</span>
    <span class="mt-1.5 block text-[14px]/5 font-medium">Documentation control — drawings, test certificates and revision history</span>
  </legend>

  <div class="mt-3 grid grid-cols-5 gap-2">
    <label class="flex flex-col items-center gap-1.5 rounded-lg border border-zinc-200 bg-white py-2.5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
      <input type="radio" name="va_docs" value="1" aria-describedby="qs-low" class="size-4 shrink-0 accent-zinc-700">
      <span class="text-[13px]/5 tabular-nums">1</span>
    </label>
    <label class="flex flex-col items-center gap-1.5 rounded-lg border border-zinc-200 bg-white py-2.5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
      <input type="radio" name="va_docs" value="2" class="size-4 shrink-0 accent-zinc-700">
      <span class="text-[13px]/5 tabular-nums">2</span>
    </label>
    <label class="flex flex-col items-center gap-1.5 rounded-lg border border-zinc-200 bg-white py-2.5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
      <input type="radio" name="va_docs" value="3" checked class="size-4 shrink-0 accent-zinc-700">
      <span class="text-[13px]/5 tabular-nums">3</span>
    </label>
    <label class="flex flex-col items-center gap-1.5 rounded-lg border border-zinc-200 bg-white py-2.5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
      <input type="radio" name="va_docs" value="4" class="size-4 shrink-0 accent-zinc-700">
      <span class="text-[13px]/5 tabular-nums">4</span>
    </label>
    <label class="flex flex-col items-center gap-1.5 rounded-lg border border-zinc-200 bg-white py-2.5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
      <input type="radio" name="va_docs" value="5" aria-describedby="qs-high" class="size-4 shrink-0 accent-zinc-700">
      <span class="text-[13px]/5 tabular-nums">5</span>
    </label>
  </div>

  <div class="mt-2 flex justify-between gap-4 text-[12px]/4 text-zinc-500">
    <span id="qs-low" class="max-w-[45%]">1 — No controlled documents</span>
    <span id="qs-high" class="max-w-[45%] text-right">5 — Controlled and audited</span>
  </div>

  <label class="mt-4 flex items-center gap-2.5 border-t border-zinc-100 pt-3.5 text-[13px]/5">
    <input type="radio" name="va_docs" value="na" class="size-4 shrink-0 accent-zinc-700">
    <span>Not applicable — supplies to our drawing only</span>
  </label>
</fieldset>` },

      { id: 'multi', name: 'Several answers, one exclusive', code:
`<!-- The exclusive option clears the others; it never disables them. A disabled
     checkbox that is still ticked shows a tick on screen and posts nothing, so
     the audit record ends up saying no PPE was worn while the page in front of
     the auditor lists three items. Clearing is honest — what is on screen is
     what posts.

     x-model is not used. The exclusivity has to run after the box has changed,
     and both x-model and an @change handler listen to the same change event, so
     which one wins is the order Alpine happens to bind them in. :checked plus
     one @change per box is explicit and cannot race itself.

     "None of the above" is a value, not zero ticks. No ticked boxes post no key
     at all, which is the same POST as a question that was never on the form, so
     without the explicit option there is no way to record that somebody looked
     at the bay and found nobody in PPE. -->
<fieldset data-kui="questionnaire/multi" class="max-w-md"
          x-data="{
            ppe: ['helmet', 'shoes'],
            toggle(v) {
              if (this.ppe.includes(v)) { this.ppe = this.ppe.filter(x => x !== v) }
              else if (v === 'none') { this.ppe = ['none'] }
              else { this.ppe = this.ppe.filter(x => x !== 'none').concat(v) }
            }
          }">
  <legend class="text-[14px]/5 font-medium">Which PPE was actually in use on the unloading bay</legend>
  <p id="qm-help" class="mt-1.5 text-[12px]/4 text-zinc-500">Observed in use, not what is stocked at the gate.</p>

  <div class="mt-3 space-y-2.5">
    <label class="flex items-center gap-2.5 text-[14px]/5">
      <input type="checkbox" name="audit_ppe" value="helmet" aria-describedby="qm-help"
             :checked="ppe.includes('helmet')" @change="toggle('helmet')"
             class="size-4 shrink-0 accent-zinc-700">
      <span>Helmets</span>
    </label>
    <label class="flex items-center gap-2.5 text-[14px]/5">
      <input type="checkbox" name="audit_ppe" value="shoes" aria-describedby="qm-help"
             :checked="ppe.includes('shoes')" @change="toggle('shoes')"
             class="size-4 shrink-0 accent-zinc-700">
      <span>Safety shoes</span>
    </label>
    <label class="flex items-center gap-2.5 text-[14px]/5">
      <input type="checkbox" name="audit_ppe" value="gloves" aria-describedby="qm-help"
             :checked="ppe.includes('gloves')" @change="toggle('gloves')"
             class="size-4 shrink-0 accent-zinc-700">
      <span>Cut-resistant gloves</span>
    </label>
    <label class="flex items-center gap-2.5 text-[14px]/5">
      <input type="checkbox" name="audit_ppe" value="vis" aria-describedby="qm-help"
             :checked="ppe.includes('vis')" @change="toggle('vis')"
             class="size-4 shrink-0 accent-zinc-700">
      <span>Hi-vis jackets</span>
    </label>
  </div>

  <div class="mt-3.5 border-t border-zinc-100 pt-3.5">
    <label class="flex items-center gap-2.5 text-[14px]/5">
      <input type="checkbox" name="audit_ppe" value="none" aria-describedby="qm-none-help"
             :checked="ppe.includes('none')" @change="toggle('none')"
             class="size-4 shrink-0 accent-zinc-700">
      <span>None of the above</span>
    </label>
    <p id="qm-none-help" class="mt-1.5 pl-[26px] text-[12px]/4 text-zinc-500">Clears the four above. Nobody in PPE is an answer; an empty question is not.</p>
  </div>
</fieldset>` },

      { id: 'sheet', name: 'The whole sheet', code:
`<!-- The one variant where the frame is the point: a sheet is a document, so it
     gets a header naming the record it is about and a footer saying when it was
     last written. Every other shape on this page is the questions on their own,
     because a card round three radios is a card round nothing.

     The progress rail is 4px and no wider than the sentence beside it. A
     full-width graphite bar is the heaviest object on any page it appears on,
     and it is describing five questions the reader can already see.

     Submit is not disabled while questions are unanswered. A dead button says
     the sheet is not ready and nothing about which line is missing, so the
     count and the jump carry that instead — and when the submit does fail, the
     summary in the next variant is what answers it. The jump reads data-open
     off the questions themselves and focuses the first control inside the first
     one, because a fieldset is not focusable and focusing the control is what
     makes the focus ring visible.

     One red line, on the one row that causes something. A sheet where every
     failed row is tinted is a wall of colour with nothing standing out in
     it. -->
<form data-kui="questionnaire/sheet" class="max-w-2xl overflow-hidden rounded-xl border border-zinc-300 bg-white"
      x-data="{
        a: { marking: 'pass', seal: 'pass', cert: 'fail', moisture: '', sample: '' },
        get total() { return Object.keys(this.a).length },
        get done() { return Object.values(this.a).filter(v => v !== '').length }
      }">

  <div class="border-b border-zinc-200 px-5 py-4">
    <h2 class="text-[16px]/6 font-semibold">Incoming inspection — GRN-24-0912</h2>
    <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-600">HDPE granules, natural · lot 24-HD-118 · Gujarat Polymers Ltd · 16 Aug 2026</p>

    <div class="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
      <div class="h-1 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-200"
           role="progressbar" aria-label="Parameters answered on GRN-24-0912"
           :aria-valuenow="done" aria-valuemin="0" :aria-valuemax="total">
        <div class="h-full rounded-full bg-zinc-700 transition-[width] motion-reduce:transition-none"
             :style="'width: ' + Math.round(done / total * 100) + '%'"></div>
      </div>
      <p class="text-[12px]/4 tabular-nums text-zinc-600">
        <span x-text="done"></span> of <span x-text="total"></span> answered
      </p>
      <button type="button" x-show="done !== total" x-cloak
              @click="$root.querySelector('[data-open] input')?.focus()"
              class="ml-auto text-[12px]/4 text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">
        Go to the first gap
      </button>
    </div>
  </div>

  <div class="divide-y divide-zinc-100 px-5">
    <fieldset class="py-4" :data-open="a.marking === ''">
      <legend class="text-[13px]/5 font-medium">Bag markings — grade, lot and net weight legible on every bag</legend>
      <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_marking" value="pass" x-model="a.marking" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_marking" value="fail" x-model="a.marking" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_marking" value="na" x-model="a.marking" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="py-4" :data-open="a.seal === ''">
      <legend class="text-[13px]/5 font-medium">Bags sealed, no tears and no damp patches on the pallet</legend>
      <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_seal" value="pass" x-model="a.seal" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_seal" value="fail" x-model="a.seal" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_seal" value="na" x-model="a.seal" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="py-4" :data-open="a.cert === ''">
      <legend class="text-[13px]/5 font-medium">Test certificate lot number matches the bags</legend>
      <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_cert" value="pass" x-model="a.cert" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_cert" value="fail" x-model="a.cert" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_cert" value="na" x-model="a.cert" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
        </label>
      </div>
      <p x-show="a.cert === 'fail'" x-cloak class="mt-2.5 flex items-start gap-1.5 text-[12px]/4 font-medium tabular-nums text-red-600">
        <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>Raises a non-conformance against GRN-24-0912.
      </p>
    </fieldset>

    <fieldset class="py-4" :data-open="a.moisture === ''">
      <legend class="text-[13px]/5 font-medium tabular-nums">Moisture on the hand-held meter at or below 0.05%</legend>
      <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_moisture" value="pass" x-model="a.moisture" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_moisture" value="fail" x-model="a.moisture" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_moisture" value="na" x-model="a.moisture" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="py-4" :data-open="a.sample === ''">
      <legend class="text-[13px]/5 font-medium tabular-nums">Retention sample of 500 g drawn and labelled</legend>
      <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_sample" value="pass" x-model="a.sample" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_sample" value="fail" x-model="a.sample" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-[13px]/5 [&:not(:has(:checked))]:hover:bg-zinc-50 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qs_sample" value="na" x-model="a.sample" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
        </label>
      </div>
    </fieldset>
  </div>

  <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-zinc-200 px-5 py-3.5">
    <p class="text-[12px]/4 tabular-nums text-zinc-500">Draft saved 11:04 · Ritu Deshpande</p>
    <button type="submit" class="rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Review and sign</button>
  </div>
</form>` },

      { id: 'invalid', name: 'Submitted with gaps', code:
`<!-- The submit was live and it failed, which is the design. Disabling the
     button until the sheet is complete says the form is not ready and nothing
     about which of eighteen parameters is missing, so the user scrolls the
     whole sheet hunting for the gap. The browser's own required validation is
     no better here: it reports one control at a time in a bubble that
     disappears, and the seventeen behind it stay invisible.

     The summary takes focus and deliberately does not carry role="alert".
     Focusing it is what reads it; a live region on top of that reads the whole
     list twice, the first time before the user has any idea where they are.

     Each entry links to the question block, which carries tabindex="-1".
     Without the tabindex the fragment scrolls the question into view but leaves
     focus on the summary, so the next Tab walks down the rest of the links
     instead of entering the group. Linking to the first radio instead does move
     focus, but scrolls that control to the top of the viewport with its own
     question above the fold.

     This is also the one place a question number earns its keep, because the
     link and the row it points at have to be recognisably the same thing.

     aria-invalid and the aria-describedby go on every option in the group, not
     just the first. Only the focused radio's attributes are announced, so
     marking one leaves the message unread for anybody who arrows onto the
     second. -->
<div data-kui="questionnaire/invalid" class="max-w-2xl">
  <div id="qv-summary" tabindex="-1" class="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5">
    <i data-lucide="alert-circle" class="mt-0.5 size-4 shrink-0 text-red-600"></i>
    <div class="min-w-0">
      <h2 class="text-[13px]/5 font-medium tabular-nums">Not signed — 2 of 18 parameters are unanswered</h2>
      <p class="mt-1 text-[12px]/4 text-zinc-600">Everything you have already answered is still here. Nothing was submitted.</p>
      <ul class="mt-2.5 space-y-1.5 text-[13px]/5 tabular-nums">
        <li><a href="#qv-q4" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Q4 · Moisture on the hand-held meter</a></li>
        <li><a href="#qv-q9" class="text-zinc-900 underline underline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-zinc-700/15">Q9 · Pallet count against the delivery challan</a></li>
      </ul>
    </div>
  </div>

  <div class="mt-5 divide-y divide-zinc-100">
    <fieldset id="qv-q4" tabindex="-1" class="py-4 first:pt-0">
      <legend class="text-[13px]/5 font-medium tabular-nums">
        Q4 · Moisture on the hand-held meter at or below 0.05% <span class="text-red-600">*</span>
      </legend>
      <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
        <label class="flex items-center justify-center gap-2 rounded-lg border border-red-600 bg-white px-2 py-2 text-[13px]/5 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qv_moisture" value="pass" required aria-invalid="true" aria-describedby="qv-q4-err" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-red-600 bg-white px-2 py-2 text-[13px]/5 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qv_moisture" value="fail" required aria-invalid="true" aria-describedby="qv-q4-err" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-red-600 bg-white px-2 py-2 text-[13px]/5 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qv_moisture" value="na" required aria-invalid="true" aria-describedby="qv-q4-err" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
        </label>
      </div>
      <p id="qv-q4-err" class="mt-2.5 flex items-start gap-1.5 text-[12px]/4 font-medium text-red-600">
        <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>If the meter was not available, that is N/A — not blank.
      </p>
    </fieldset>

    <fieldset id="qv-q9" tabindex="-1" class="py-4">
      <legend class="text-[13px]/5 font-medium tabular-nums">
        Q9 · Pallet count matches the delivery challan <span class="text-red-600">*</span>
      </legend>
      <div class="mt-2.5 grid max-w-sm grid-cols-3 gap-2">
        <label class="flex items-center justify-center gap-2 rounded-lg border border-red-600 bg-white px-2 py-2 text-[13px]/5 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qv_pallets" value="pass" required aria-invalid="true" aria-describedby="qv-q9-err" class="size-4 shrink-0 accent-zinc-700"><span>Pass</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-red-600 bg-white px-2 py-2 text-[13px]/5 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qv_pallets" value="fail" required aria-invalid="true" aria-describedby="qv-q9-err" class="size-4 shrink-0 accent-zinc-700"><span>Fail</span>
        </label>
        <label class="flex items-center justify-center gap-2 rounded-lg border border-red-600 bg-white px-2 py-2 text-[13px]/5 has-[:checked]:border-zinc-700 has-[:checked]:bg-zinc-100 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-zinc-700/15">
          <input type="radio" name="qv_pallets" value="na" required aria-invalid="true" aria-describedby="qv-q9-err" class="size-4 shrink-0 accent-zinc-700"><span>N/A</span>
        </label>
      </div>
      <p id="qv-q9-err" class="mt-2.5 flex items-start gap-1.5 text-[12px]/4 font-medium tabular-nums text-red-600">
        <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>Challan DC-8871 says 14 pallets.
      </p>
    </fieldset>
  </div>
</div>` },

      { id: 'signed', name: 'Signed off', code:
`<!-- Nothing here is a form control. A signed sheet built out of disabled
     inputs looks right and posts nothing, so any other action on the page
     re-saves the record with every answer cleared — and there is no readonly on
     a radio or a checkbox to reach for instead. Rendered as text it also
     prints, which is the form this sheet is actually filed in, and it is the
     reason a questionnaire never hides answered questions behind a wizard: the
     countersigner has to read all of them at once.

     Two signatures, and the second is what the GRN is waiting on. Both are the
     same graphite pill — only the 6px dot separates signed from waiting,
     because a column of tinted pills stops meaning anything and the dot is
     readable at a glance.

     The attestation is kept verbatim rather than reduced to a boolean. What was
     certified, by whom and when is the record; "attested = true" is not.
     Reopening is a named action that gets logged against the GRN, never an edit
     in place. -->
<div data-kui="questionnaire/signed" class="max-w-2xl overflow-hidden rounded-xl border border-zinc-300 bg-white">
  <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-zinc-200 px-5 py-4">
    <div class="min-w-0">
      <h2 class="text-[16px]/6 font-semibold">Incoming inspection — GRN-24-0912</h2>
      <p class="mt-1 text-[12px]/4 tabular-nums text-zinc-600">HDPE granules, natural · lot 24-HD-118 · 18 parameters · 1 failed</p>
    </div>
    <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
      <span class="size-1.5 shrink-0 rounded-full bg-emerald-600"></span>Signed
    </span>
  </div>

  <dl class="divide-y divide-zinc-100 px-5">
    <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
      <dt class="min-w-0 flex-1 text-[13px]/5 text-zinc-600">Bag markings legible on every bag</dt>
      <dd class="shrink-0 text-[13px]/5 font-medium">Pass</dd>
    </div>
    <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
      <dt class="min-w-0 flex-1 text-[13px]/5 text-zinc-600">Bags sealed, no tears or damp patches</dt>
      <dd class="shrink-0 text-[13px]/5 font-medium">Pass</dd>
    </div>
    <div class="py-3">
      <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <dt class="min-w-0 flex-1 text-[13px]/5 text-zinc-600">Test certificate lot number matches the bags</dt>
        <dd class="shrink-0 text-[13px]/5 font-medium">Fail</dd>
      </div>
      <dd class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 tabular-nums text-red-600">
        <i data-lucide="alert-circle" class="mt-px size-3.5 shrink-0"></i>NC-24-0117 raised — certificate is for lot 24-HD-116.
      </dd>
    </div>
    <div class="py-3">
      <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <dt class="min-w-0 flex-1 text-[13px]/5 tabular-nums text-zinc-600">Melt flow index, spec 0.28 – 0.42 g/10 min</dt>
        <dd class="shrink-0 text-[13px]/5 font-medium tabular-nums">0.46 g/10 min</dd>
      </div>
      <dd class="mt-1.5 flex items-start gap-1.5 text-[12px]/4 text-amber-700">
        <i data-lucide="alert-triangle" class="mt-px size-3.5 shrink-0"></i>Accepted on deviation.
      </dd>
    </div>
    <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
      <dt class="min-w-0 flex-1 text-[13px]/5 text-zinc-600">Retention sample drawn and labelled</dt>
      <dd class="shrink-0 text-[13px]/5 text-zinc-500">N/A</dd>
    </div>
  </dl>

  <div class="grid gap-6 border-t border-zinc-200 px-5 py-4 sm:grid-cols-2">
    <div>
      <p class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Inspected by</p>
      <p class="mt-2 text-[14px]/5 font-medium">Ritu Deshpande</p>
      <p class="mt-0.5 text-[12px]/4 tabular-nums text-zinc-500">QC, Silvassa · 16 Aug 2026, 11:42</p>
      <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-600">
        &ldquo;I inspected the material listed above on 16 Aug 2026 and the results are as recorded.&rdquo;
      </p>
    </div>

    <div>
      <p class="text-[11px]/4 font-medium tracking-wider text-zinc-500 uppercase">Countersigned by</p>
      <p class="mt-2 text-[14px]/5 text-zinc-500">Sandeep Kulkarni</p>
      <p class="mt-0.5 text-[12px]/4 text-zinc-500">Plant head</p>
      <span class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-1 text-[11px]/4 font-medium text-zinc-700 ring-1 ring-inset ring-zinc-300">
        <span class="size-1.5 shrink-0 rounded-full bg-amber-500"></span>Waiting
      </span>
      <p class="mt-2 text-[12px]/4 tabular-nums text-zinc-600">GRN-24-0912 cannot be posted to stores until this is signed.</p>
    </div>
  </div>
</div>` }
    ]
  },

);
