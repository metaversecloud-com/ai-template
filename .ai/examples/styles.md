## Topia SDK Styles Reference

This document outlines the approved CSS classes and styling patterns to use when developing with the Topia SDK.

### Core Principles

1. **Prioritize using SDK-provided CSS classes** from https://sdk-style.s3.amazonaws.com/styles-3.0.2.css
2. **Avoid using custom CSS classes or utility frameworks** but if you need to then use only Tailwind and not Bootstrap, etc.
3. **Do not use inline styles** unless absolutely necessary for dynamic positioning
4. **Add the `rtsdk` class to the root element** of your application (already in place in index.html)

### Typography

```tsx
// Headings
<h1 className="h1">Heading 1</h1>
<h2 className="h2">Heading 2</h2>
<h3 className="h3">Heading 3</h3>
<h4 className="h4">Heading 4</h4>

// Text alignment
<p className="text-left">Left aligned text</p>
<p className="text-center">Center aligned text</p>
<p className="text-right">Right aligned text</p>

// Text variants
<p className="p1">Standard body text</p>
<p className="p2 text-success">Medium green body text</p>
<p className="p3 text-error">Small red body text</p>
<p className="p4">XSmall body text</p>
```

### State Classes

```tsx
// For selected items (use with other components)
<div className="card selected">...</div>

// For disabled items
<div className="disabled">...</div>

// For active states
<div className="active">...</div>

// For error states
<div className="error">...</div>
```

### Buttons

```tsx
// Primary button
<button className="btn">Primary Action</button>

// Secondary button
<button className="btn btn-outline">Secondary Action</button>

// Tertiary/text button
<button className="btn btn-text">Text Button</button>

// Error state
<button className="btn btn-danger">Button with error</button>

// Icon button with SVG icon
<button className="btn btn-icon">
  <img src="https://sdk-style.s3.amazonaws.com/icons/edit.svg" />
</button>

```

### Form Elements

```tsx
// Standard input field
<label className="label">Text Input</label>
<input className="input" type="text" placeholder="placeholder" />

// Input field with character count and helper text
<div className="input-group">
  <label className="label">Text Input with Character Count</label>
  <input className="input" type="text" maxlength="10" />
  <span className="input-char-count">0/10</span>
  <p className="p3">A maximum of 10 characters is allowed.</p>
</div>

// Form element with error state
<label className="label">Error</label>
<input className="input input-error" type="text" value="error" />
<p className="p3 text-error">An error has occurred</p>

// Textarea for multi-line input
<label className="label">Textarea</label>
<textarea className="input" rows="5" maxlength="120"></textarea>

// Checkbox input with label
<label className="label">
  <input className="input-checkbox" type="checkbox" />
  Checkboxes
</label>

// Radio button input with label
<label className="label">
  <input className="input-radio" type="radio" name="radio" />
  Radio Button
</label>
```

### Card Components

```tsx
// Standard card
<div className="card">
  <div className="card-image">
    <img src="image-url.jpg" alt="Description" />
  </div>
  <div className="card-details">
    <h3 className="card-title">Title</h3>
    <p className="card-description p2">Description text</p>
    <div className="card-actions">
      <div className="tooltip">
        <span className="tooltip-content">Edit</span>
        <button className="btn btn-icon">
          <img src="https://sdk-style.s3.amazonaws.com/icons/edit.svg" />
        </button>
      </div>
      <div className="tooltip">
        <span className="tooltip-content">Settings</span>
        <button className="btn btn-icon">
          <img src="https://sdk-style.s3.amazonaws.com/icons/cog.svg" />
        </button>
      </div>
      <div className="tooltip">
        <span className="tooltip-content">Info</span>
        <button className="btn btn-icon">
          <img src="https://sdk-style.s3.amazonaws.com/icons/info.svg" />
        </button>
      </div>
    </div>
  </div>
</div>

// Small card variant
<div className="card small">...</div>

// Horizontal card variant
<div className="card horizontal">...</div>

// Success card variant (for showing success states)
<div className="card success">...</div>

// Error card variant (for showing error states)
<div className="card danger">...</div>
```

### Layout Classes

```tsx
// Flex container for row layout
<div className="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Flex container for column layout
<div className="flex-col">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Flex container with centered items
<div className="flex items-center justify-center">
  <div>Centered content</div>
</div>

// Container with set width
<div className="container">
  <p>Content with standard width</p>
</div>

// Grid layout
<div className="grid">
  <div>Grid Item 1</div>
  <div>Grid Item 2</div>
  <div>Grid Item 3</div>
  <div>Grid Item 4</div>
</div>
```

### Modals

```tsx
// Modal with hidden state and action buttons
<div id="modalExample" className="modal-container hidden">
  <div className="modal">
    <h4 className="h4">Modal title (h4)</h4>
    <p className="p2">Modal description</p>
    <div className="actions">
      <button className="btn btn-outline">Outline</button>
      <button className="btn" id="close">
        Close
      </button>
    </div>
  </div>
</div>
```

### Important Usage Notes

```tsx
// IMPORTANT: React components should use className (not class)
<div className="card">...</div> // ✅ Correct in React
<div class="card">...</div> // ❌ Incorrect in React (use in HTML only)

// Combining multiple classes
<button className="btn btn-outline">Multiple Classes</button>

// Using state modifier classes
<div className="card selected">State-modified card</div>

// Using text variant with color modifier
<p className="p2 text-success">Success message</p>
```

### Available Utility Classes

- Text colors: `text-success`, `text-error`, `text-warning`, `text-muted`
- Text alignment: `text-left`, `text-center`, `text-right`
- Spacing: `mt-1`, `mb-2`, `mx-auto`, `py-3` (m=margin, p=padding, x=horizontal, y=vertical)
- Display: `hidden`, `block`, `inline`, `inline-block`
- Position: `relative`, `absolute`, `fixed`

Remember to always prefer using the SDK-provided classes rather than creating custom styles or using utility frameworks like Tailwind. The classes documented here are specifically designed to work with the Topia SDK and maintain consistent styling across applications.
