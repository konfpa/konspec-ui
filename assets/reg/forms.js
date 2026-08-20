register(
  {
    id: 'field', name: 'Field', category: 'forms',
    description: 'Label, control, help text and error in one block. This is the unit every form is built from.',
    when: 'Every form input. Do not place a bare <input> in a form without this wrapper.',
    notes: [
      'The error message replaces the help text, it does not stack under it.',
      'Mark required fields with a red asterisk in the label, and say so once at the top of the form.',
      'In Django, the error paragraph maps to {{ field.errors }} and the help paragraph to {{ field.help_text }}.'
    ],
    anatomy: [
      ['Label', 'Bound to the control with for/id. Carries the required asterisk when there is one.'],
      ['Control', 'The input, select or textarea. Never bare — it always sits inside this wrapper.'],
      ['Help text', '12px zinc-400 below the control, explaining the format or the constraint before it is broken.'],
      ['Error', '12px red-600, replacing the help text rather than stacking under it.'],
      ['Required marker', 'A red asterisk in the label, explained once at the top of the form rather than beside every field.']
    ],
    behaviour: [
      'The error replaces the help text. Stacking both makes the block grow and pushes the rest of the form down as the user types.',
      'An error appears after the field is left, not while it is being typed into — validating mid-keystroke tells someone their half-typed entry is wrong.',
      'Once a field has errored, it revalidates as the user corrects it, so the message clears as soon as it is true.',
      'The field keeps its height between valid and invalid states wherever possible, so a form does not jump on submit.',
      'In Django this maps directly: the error paragraph is {{ field.errors }} and the help paragraph is {{ field.help_text }}.'
    ],
    a11y: [
      'The label is bound with for/id — a label that merely sits above the control is not connected to it.',
      'The control carries aria-describedby pointing at the help text, and at the error when there is one.',
      'An invalid control sets aria-invalid="true", so the state is announced and not only drawn in red.',
      'The required marker is backed by the required attribute; a red asterisk alone is decoration.',
      'The error text is real text under the field, never a title attribute or a tooltip.'
    ],
    related: ['input', 'textarea', 'form-page'],
    variants: [
      { id: 'default', name: 'With help text', code:
`<div>
  <label for="title" class="mb-1.5 block text-[13px]/5 font-medium">Order title <span class="text-red-600">*</span></label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
    <input id="title" value="MS angles and plates — August lot"
           class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
  </div>
  <p class="mt-1.5 text-[12px]/4 text-zinc-500">Shown on the printed order and in vendor emails.</p>
</div>` },
      { id: 'error', name: 'With error', code:
`<div>
  <label for="vendor" class="mb-1.5 block text-[13px]/5 font-medium">Vendor <span class="text-red-600">*</span></label>
  <div class="rounded-lg border border-red-600 bg-white focus-within:ring-3 focus-within:ring-red-600/15">
    <select id="vendor" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
      <option>Gujarat Polymers Ltd</option>
    </select>
  </div>
  <p class="mt-1.5 flex items-center gap-1.5 text-[12px]/4 font-medium text-red-600">
    <i data-lucide="alert-circle" class="size-3.5"></i>No active rate contract for this vendor.
  </p>
</div>` }
    ]
  },

  {
    id: 'input', name: 'Input', category: 'forms',
    description: 'Single-line text entry. The border lives on the wrapper so icons and prefixes sit inside the focus ring.',
    when: 'Text, numbers, dates, search.',
    notes: [
      'Never put the focus ring on the <input> itself — put it on the wrapper with focus-within.',
      'Never leave a read-only field white, bordered and ringed. It is then pixel for pixel an editable one, and the only way to find out otherwise is to click into it and get nothing back. Read-only takes the same bg-zinc-100 and dropped ring that disabled takes; the text contrast is what tells them apart.'
    ],
    anatomy: [
      ['Wrapper', 'The bordered box. This is what owns the focus ring, so icons and prefixes sit inside it.'],
      ['Control', 'A borderless, transparent input with outline-none — all the visible styling belongs to the wrapper.'],
      ['Icon', 'Optional, left of the text, size-4 zinc-400. Decorative.'],
      ['Prefix or suffix', 'A fixed unit such as ₹ or kg, sitting inside the ring so it reads as part of the value.'],
      ['Focus ring', 'focus-within on the wrapper: border zinc-700 plus a 3px zinc-700/15 halo.']
    ],
    behaviour: [
      'The focus ring goes on the wrapper via focus-within, never on the input itself, or icons and units end up outside the ring.',
      'Numeric inputs are right-aligned with tabular-nums, so a column of them lines up.',
      'Read-only and disabled share one locked surface, bg-zinc-100 with no focus ring, because neither can be typed into. Only the text separates them: zinc-900 for read-only, whose value still matters and still has to be copyable, zinc-400 for disabled, whose value does not.',
      'Placeholder text is an example of the format, never a replacement for the label.',
      'The control fills the wrapper\'s width, so the whole box is a click target and not just the text.'
    ],
    a11y: [
      'Every input has a real label; a placeholder is not one and disappears as soon as typing starts.',
      'Disabled uses the disabled attribute so the control leaves the Tab order; read-only uses readonly so it stays reachable and its value can be copied.',
      'The focus ring is visible against both white and zinc-100 backgrounds.',
      'Units in a prefix or suffix are part of the field\'s description, so the value is not announced without them.',
      'type is set correctly — email, date, number — so the right keyboard appears on a phone.'
    ],
    related: ['field', 'textarea', 'checkbox'],
    variants: [
      { id: 'default', name: 'Default', code:
`<div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
  <input placeholder="Placeholder" class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
</div>` },
      { id: 'icon', name: 'With icon and prefix', code:
`<div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
  <i data-lucide="search" class="ml-3 size-4 shrink-0 text-zinc-600"></i>
  <input placeholder="Search orders" class="w-full bg-transparent px-2 py-2 text-[14px]/5 outline-none placeholder:text-zinc-500">
</div>

<div class="flex items-center rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
  <span class="pl-3 text-[14px]/5 text-zinc-600">₹</span>
  <input value="18,42,000" class="w-full bg-transparent px-2 py-2 text-right text-[14px]/5 tabular-nums outline-none">
</div>` },
      { id: 'disabled', name: 'Disabled and read-only', code:
`<div class="max-w-xs space-y-5">
  <div>
    <label for="in-off" class="mb-1.5 block text-[13px]/5 font-medium text-zinc-500">Rate contract</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">
      <input id="in-off" disabled value="Locked by policy"
             class="w-full bg-transparent px-3 py-2 text-[14px]/5 text-zinc-400">
    </div>
  </div>

  <div>
    <!-- One locked surface for both, and the text is what separates them. A
         read-only value left on white with a focus ring is indistinguishable
         from an editable field until someone clicks into it and nothing
         happens; filled and ringless, it reads as closed at a glance and still
         reads at full contrast, because the value still matters. -->
    <label for="in-ro" class="mb-1.5 block text-[13px]/5 font-medium">Order number</label>
    <div class="rounded-lg border border-zinc-200 bg-zinc-100">
      <input id="in-ro" readonly value="PO-24-1187"
             class="w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">
    </div>
  </div>
</div>` }
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
      'Never leave a read-only box white, bordered and ringed. It is then pixel for pixel an editable field, and the only way to find out otherwise is to click into it and get nothing back. Read-only takes bg-zinc-100 and drops the focus ring, the same locked surface disabled uses.',
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
      'Read-only and disabled share one locked surface, bg-zinc-100 with no focus ring, because both are boxes you cannot type into. The text is what separates them: zinc-900 for read-only, whose value still matters and still has to be copyable, zinc-400 for disabled, whose value does not. A read-only field left white, bordered and ringed says nothing at all until someone clicks into it and nothing happens.'
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
`<div class="max-w-xl">
  <label for="ta-notes" class="mb-1.5 block text-[13px]/5 font-medium">Delivery instructions</label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
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
<div class="max-w-xl space-y-5">
  <div>
    <label for="ta-2" class="mb-1.5 block text-[13px]/5 font-medium">Two rows — a remark inside a table row or a dialog</label>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
      <textarea id="ta-2" rows="2" class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">Short shipped by 40 kg, balance promised Friday.</textarea>
    </div>
  </div>

  <div>
    <label for="ta-4" class="mb-1.5 block text-[13px]/5 font-medium">Four rows — the default for a form field</label>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
      <textarea id="ta-4" rows="4" class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none">Konspec Industries
Plot 214, Silvassa Industrial Estate
Dadra &amp; Nagar Haveli 396230</textarea>
    </div>
  </div>

  <div>
    <label for="ta-10" class="mb-1.5 block text-[13px]/5 font-medium">Ten rows — the page is the field</label>
    <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
      <textarea id="ta-10" rows="10" class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none" placeholder="Scope of work"></textarea>
    </div>
  </div>
</div>` },

      { id: 'counter', name: 'With a counter', code:
`<!-- A soft limit: typing past it is allowed, submitting past it is not. A hard
     maxlength would swallow the tail of a paste without saying so. -->
<div class="max-w-xl"
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
       :class="over ? 'border-red-600 focus-within:ring-3 focus-within:ring-red-600/15'
                    : 'border-zinc-200 focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15'">
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
<div class="max-w-xl"
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
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
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
<div class="max-w-xl" x-data="{ text: '' }">
  <div class="rounded-xl border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
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
`<div class="max-w-xl">
  <label for="ta-bad" class="mb-1.5 block text-[13px]/5 font-medium">Rejection reason <span class="text-red-600">*</span></label>
  <div class="rounded-lg border border-red-600 bg-white focus-within:ring-3 focus-within:ring-red-600/15">
    <textarea id="ta-bad" name="reason" rows="4" aria-invalid="true" aria-describedby="ta-bad-err"
              class="block w-full bg-transparent px-3 py-2 text-[14px]/5 outline-none"></textarea>
  </div>
  <!-- the error replaces the help text, it does not stack under it -->
  <p id="ta-bad-err" class="mt-1.5 flex items-center gap-1.5 text-[12px]/4 font-medium text-red-600">
    <i data-lucide="alert-circle" class="size-3.5 shrink-0"></i>A reason is required before an order can be rejected.
  </p>
</div>` },

      { id: 'disabled', name: 'Disabled and read-only', code:
`<div class="max-w-xl space-y-5">
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
                class="block w-full resize-none bg-transparent px-3 py-2 text-[14px]/5 outline-none">Balance 40 kg dispatched on 18 August by Gati, LR 4471029.
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
<form method="post" class="max-w-xl">
  {% csrf_token %}
  <div>
    <label for="{{ form.body.id_for_label }}" class="mb-1.5 block text-[13px]/5 font-medium">
      {{ form.body.label }}{% if form.body.field.required %} <span class="text-red-600">*</span>{% endif %}
    </label>

    <div class="rounded-lg bg-white {% if form.body.errors %}border border-red-600 focus-within:ring-3 focus-within:ring-red-600/15{% else %}border border-zinc-200 focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15{% endif %}">
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
<div class="max-w-xl">
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
<fieldset class="max-w-xl">
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
<fieldset class="max-w-xl"
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
<fieldset>
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
<div class="max-w-xs rounded-xl border border-zinc-200 bg-white"
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
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white"
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
      <button type="button" class="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100">Export</button>
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
`<div class="max-w-xl space-y-5">
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
<form method="post" class="max-w-xl">
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
<fieldset class="max-w-xl">
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
<fieldset class="max-w-xl">
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
<fieldset>
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
<fieldset>
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
<fieldset class="max-w-xs">
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
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white"
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
`<div class="max-w-xl space-y-6">
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
<form method="post" class="max-w-xl">
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
<div class="max-w-xl">
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
<div class="max-w-xl space-y-4">
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
<div class="max-w-xl rounded-xl border border-zinc-200 bg-white">
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
<fieldset class="max-w-xl rounded-xl border border-zinc-200 bg-white" x-data="{ email: true }">
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
<div class="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5">
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

<div id="po-rows" class="mt-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
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
<div class="max-w-xl divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
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
<div class="max-w-xl rounded-xl border border-zinc-200 bg-white px-4 py-2.5"
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
<div class="max-w-xl divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white"
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
`<div x-data="{ depth: 0 }">
  <label class="mb-1.5 block text-[13px]/5 font-medium">Attachments</label>

  <div @dragenter.prevent="depth++" @dragleave.prevent="depth--" @dragover.prevent @drop.prevent="depth = 0"
       class="rounded-lg border border-dashed px-4 py-5 transition"
       :class="depth > 0 ? 'border-zinc-700 bg-zinc-50' : 'border-zinc-200 bg-zinc-100'">
    <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
      <i data-lucide="upload" class="size-5 shrink-0 text-zinc-600"></i>
      <span class="text-[13px]/5 text-zinc-600">Drag files here or</span>
      <input type="file" id="po-files" name="attachments" multiple class="peer sr-only">
      <label for="po-files"
             class="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 peer-focus-visible:border-zinc-700 peer-focus-visible:ring-3 peer-focus-visible:ring-zinc-700/15">
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
<div x-data="{ depth: 0 }">
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
           class="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-[13px]/5 font-medium text-white hover:bg-zinc-800 peer-focus-visible:ring-3 peer-focus-visible:ring-zinc-700/30">
      <i data-lucide="upload" class="size-4"></i>Attach a document
    </label>
    <p class="mt-3 text-[12px]/4 text-zinc-500">PDF, JPG or XLSX · up to 10 MB each</p>
  </div>
</div>` },

      { id: 'uploading', name: 'Uploading', code:
`<!-- The number comes from the real XHR progress event. If you cannot get it,
     drop the percentage and show an indeterminate bar instead of inventing one. -->
<ul class="space-y-2">
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
         class="mt-2 h-1 overflow-hidden rounded-full bg-zinc-100">
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
<ul class="space-y-2">
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
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
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
<div>
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
           class="shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 peer-focus-visible:border-zinc-700 peer-focus-visible:ring-3 peer-focus-visible:ring-zinc-700/15">
      Replace
    </label>
  </div>
  <p class="mt-1.5 text-[12px]/4 text-zinc-500">PDF or JPG, up to 10 MB.</p>
</div>` },

      { id: 'images', name: 'Image grid', code:
`<!-- Photographs are recognised by sight, not by filename. Show them. -->
<div>
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
             class="flex aspect-4/3 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-200 bg-zinc-100 text-zinc-600 hover:border-zinc-700 hover:bg-zinc-50 peer-focus-visible:border-zinc-700 peer-focus-visible:ring-3 peer-focus-visible:ring-zinc-700/15">
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
<div>
  <label for="id_attachment" class="mb-1.5 block text-[13px]/5 font-medium">Attachment</label>

  <div class="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100"><i data-lucide="file-text" class="size-4 text-zinc-600"></i></span>
    <a href="/media/po/quotation-sharma-aug.pdf" class="min-w-0 flex-1 truncate text-[13px]/5 text-zinc-900 underline underline-offset-2">quotation-sharma-aug.pdf</a>
    <label class="flex shrink-0 items-center gap-2 text-[12px]/4 text-zinc-600">
      <input type="checkbox" name="attachment-clear" id="attachment-clear_id"
             class="size-4 rounded border-zinc-200 text-zinc-700 focus:ring-zinc-700/15">
      Clear
    </label>
  </div>

  <div class="mt-2">
    <input type="file" name="attachment" id="id_attachment" class="peer sr-only">
    <label for="id_attachment"
           class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[13px]/5 font-medium hover:bg-zinc-100 peer-focus-visible:border-zinc-700 peer-focus-visible:ring-3 peer-focus-visible:ring-zinc-700/15">
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
<div class="inline-block rounded-xl border border-zinc-200 bg-white p-3"
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
<div class="relative max-w-xs"
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
<div class="inline-block rounded-xl border border-zinc-200 bg-white p-3"
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
<div class="inline-block rounded-xl border border-zinc-200 bg-white p-3"
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
            class="h-8 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-2 text-[13px]/5 font-medium outline-none focus:border-zinc-700 focus:ring-3 focus:ring-zinc-700/15">
      <template x-for="(m, i) in months" :key="m">
        <option :value="i" x-text="m"></option>
      </template>
    </select>

    <label for="cal-year" class="sr-only">Year</label>
    <select id="cal-year" x-model.number="vy" @change="$nextTick(() => clamp())"
            class="h-8 shrink-0 rounded-lg border border-zinc-200 bg-white px-2 text-[13px]/5 font-medium tabular-nums outline-none focus:border-zinc-700 focus:ring-3 focus:ring-zinc-700/15">
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
<div class="inline-block rounded-xl border border-zinc-200 bg-white p-3"
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
<div class="relative inline-block"
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
<div class="max-w-xs">
  <label for="grn-date" class="mb-1.5 block text-[13px]/5 font-medium">GRN date</label>
  <div class="rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
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
<form method="get" class="max-w-md"
      x-data="{
        start: '2026-04-01', end: '2026-08-20',
        parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
        fmt(s) { return s ? this.parse(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; },
        span() { return (this.start && this.end) ? Math.round((this.parse(this.end) - this.parse(this.start)) / 86400000) + 1 : 0; }
      }">
  <fieldset>
    <legend class="mb-1.5 text-[13px]/5 font-medium">Reporting period</legend>

    <div class="flex items-center gap-2">
      <div class="flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
        <label for="id_start" class="sr-only">Start date</label>
        <input type="date" id="id_start" name="start" x-model="start"
               class="h-9 w-full bg-transparent px-3 text-[14px]/5 tabular-nums outline-none">
      </div>
      <span class="text-[13px]/5 text-zinc-500" aria-hidden="true">to</span>
      <div class="flex-1 rounded-lg border border-zinc-200 bg-white focus-within:border-zinc-700 focus-within:ring-3 focus-within:ring-zinc-700/15">
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
  }

);
