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
    related: ['input', 'choice', 'form-page'],
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
    notes: ['Never put the focus ring on the <input> itself — put it on the wrapper with focus-within.'],
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
      'Read-only and disabled look different: read-only keeps normal contrast because the value still matters, disabled is muted because it does not.',
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
    related: ['field', 'choice', 'attachment'],
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
`<div class="rounded-lg border border-zinc-200 bg-zinc-100">
  <input disabled value="Locked value" class="w-full bg-transparent px-3 py-2 text-[14px]/5 text-zinc-400">
</div>

<div class="rounded-lg border border-transparent bg-transparent">
  <input readonly value="PO-24-1187" class="w-full bg-transparent px-3 py-2 font-medium text-[14px]/5 outline-none">
</div>` }
    ]
  },

  {
    id: 'choice', name: 'Checkbox, radio, toggle', category: 'forms',
    description: 'Boolean and single-choice controls. accent-zinc-700 keeps native controls on-theme without custom CSS.',
    when: 'Checkbox for independent options, radio for one-of-many, toggle for a setting that applies immediately.',
    notes: ['A toggle implies the change takes effect at once. If it needs a Save button, use a checkbox instead.'],
    anatomy: [
      ['Control', 'A native checkbox or radio with accent-zinc-700, which keeps it on-theme with no custom CSS at all.'],
      ['Label', 'Wrapping the control, so the text is part of the hit area rather than sitting beside it.'],
      ['Group', 'A fieldset with a legend when the options belong together, which is every radio group.'],
      ['Toggle', 'A styled span pair for a setting that applies immediately, backed by a real checkbox.'],
      ['Help text', 'Under the group, not under each option — repeating it per option makes the list unreadable.']
    ],
    behaviour: [
      'The label wraps the control, so clicking the text toggles it. A label beside the box means a 16px target.',
      'A toggle implies the change takes effect at once. If it needs a Save button it is a checkbox, and calling it a toggle is a lie.',
      'Radios in a group share a name, which is what makes them mutually exclusive — styling does not.',
      'A checkbox that controls others reflects three states, and the middle one is indeterminate rather than unchecked.',
      'Options stack vertically past about three; a horizontal row of five radios is hard to scan and harder to hit.'
    ],
    a11y: [
      'Native controls, so keyboard, screen reader and form submission all work without any extra code.',
      'A radio group is a fieldset with a legend naming the choice, or the options are announced with no question attached.',
      'The toggle is backed by a real checkbox — a div with a click handler is invisible to assistive technology.',
      'accent-color styles the native control without replacing it, which is why the native behaviour survives.',
      'Focus is visible on the control itself, not only on the surrounding label.'
    ],
    related: ['field', 'input', 'table'],
    variants: [
      { id: 'checkbox', name: 'Checkbox and radio', code:
`<fieldset>
  <legend class="mb-2 text-[13px]/5 font-medium">Options</legend>
  <label class="flex items-center gap-2.5 text-[14px]/5">
    <input type="checkbox" checked class="size-4 rounded accent-zinc-700">Email the vendor on approval
  </label>
  <label class="mt-2 flex items-center gap-2.5 text-[14px]/5">
    <input type="checkbox" class="size-4 rounded accent-zinc-700">Allow partial receipt
  </label>
  <label class="mt-2 flex items-center gap-2.5 text-[14px]/5 text-zinc-500">
    <input type="checkbox" disabled class="size-4 rounded">Auto-close on full GRN (locked by policy)
  </label>
</fieldset>

<fieldset class="mt-4">
  <legend class="mb-2 text-[13px]/5 font-medium">Priority</legend>
  <label class="flex items-center gap-2.5 text-[14px]/5"><input type="radio" name="p" checked class="size-4 accent-zinc-700">Standard — 14 days</label>
  <label class="mt-2 flex items-center gap-2.5 text-[14px]/5"><input type="radio" name="p" class="size-4 accent-zinc-700">Expedited — 7 days</label>
</fieldset>` },
      { id: 'toggle', name: 'Toggle', code:
`<label class="flex items-center justify-between gap-3 text-[14px]/5" x-data="{ on: true }">
  <span>Auto-approve under ₹50,000
    <span class="mt-0.5 block text-[12px]/4 text-zinc-500">Applies to this vendor only</span>
  </span>
  <button type="button" @click="on = !on"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
          :class="on ? 'bg-zinc-700' : 'bg-zinc-200'">
    <span class="absolute top-0.5 size-5 rounded-full bg-white shadow transition-all"
          :class="on ? 'left-[22px]' : 'left-0.5'"></span>
  </button>
</label>` }
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
