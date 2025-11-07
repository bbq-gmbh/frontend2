# Components Guide

## Component Library

This project uses shadcn/ui components and bits-ui for building the user interface. Components are customizable and accessible by default.

## Available UI Components

### Form Components

- `Button` - Interactive button with variants
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Checkbox` - Boolean selection
- `Radio` - Single selection from options
- `Select` - Dropdown selection
- `Form` - Form wrapper with validation

### Display Components

- `Card` - Container for content
- `Badge` - Label or status indicator
- `Alert` - Important messages or alerts
- `Dialog` - Modal popup
- `Dropdown Menu` - Contextual menu

### Layout Components

- `Header` - Page header
- `Sidebar` - Navigation sidebar
- `Footer` - Page footer
- `Container` - Max-width wrapper

### Navigation Components

- `Navigation Menu` - Main navigation
- `Breadcrumb` - Navigation path
- `Tabs` - Tabbed interface
- `Pagination` - Page navigation

## Using Components

### Basic Button

```svelte
<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  
  function handleClick() {
    console.log('Button clicked');
  }
</script>

<Button onclick={handleClick}>Click Me</Button>
```

### Button with Variants

```svelte
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

### Button Sizes

```svelte
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### Card Component

```svelte
<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import { CardContent, CardHeader, CardTitle } from '$lib/components/ui/Card.svelte';
</script>

<Card>
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Form Input

```svelte
<script lang="ts">
  import Input from '$lib/components/ui/Input.svelte';
  
  let email = '';
  
  function handleChange(e) {
    email = e.target.value;
  }
</script>

<Input 
  type="email"
  placeholder="Enter your email"
  value={email}
  onchange={handleChange}
/>
```

### Dialog/Modal

```svelte
<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/Dialog.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  
  let isOpen = $state(false);
</script>

<Button onclick={() => isOpen = true}>Open Dialog</Button>

<Dialog open={isOpen} onOpenChange={(open) => isOpen = open}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <div>Dialog content here</div>
  </DialogContent>
</Dialog>
```

### Alert

```svelte
<script lang="ts">
  import Alert, { AlertTitle, AlertDescription } from '$lib/components/ui/Alert.svelte';
  import { AlertCircle } from 'lucide-svelte';
</script>

<Alert>
  <AlertCircle />
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>
    This is an alert message.
  </AlertDescription>
</Alert>
```

## Creating Custom Components

### Component Structure

Create `src/lib/components/MyComponent.svelte`:

```svelte
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    variant?: 'default' | 'primary';
  }

  let { title = 'Title', variant = 'default', class: className = '', ...rest }: Props = $props();
</script>

<div class={`component ${variant} ${className}`} {...rest}>
  {#if title}
    <h2>{title}</h2>
  {/if}
  <slot />
</div>

<style module>
  .component {
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .default {
    background: white;
    border: 1px solid #e5e7eb;
  }

  .primary {
    background: #3b82f6;
    color: white;
  }
</style>
```

### Using Custom Component

```svelte
<script lang="ts">
  import MyComponent from '$lib/components/MyComponent.svelte';
</script>

<MyComponent title="My Component" variant="primary">
  Component content
</MyComponent>
```

## Styling Components

### Using Tailwind Classes

```svelte
<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
</script>

<Button class="w-full bg-blue-600">Full Width Button</Button>
```

### Module CSS

```svelte
<style module>
  .container {
    display: flex;
    gap: 1rem;
    padding: 1rem;
  }

  .primary {
    color: #3b82f6;
  }
</style>
```

### CSS Variables

```css
:root {
  --primary: #3b82f6;
  --secondary: #10b981;
  --radius: 0.5rem;
}
```

## Component Props

### Common Props Pattern

```typescript
interface Props extends HTMLAttributes<HTMLElement> {
  // Custom props
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  
  // Spread rest into element
  class?: string;
  // ... other HTML attributes
}
```

## Accessible Components

All shadcn/ui components are built with accessibility in mind:

- Keyboard navigation
- ARIA labels
- Semantic HTML
- Screen reader support

### ARIA Attributes

```svelte
<button
  aria-label="Close dialog"
  aria-pressed={isOpen}
  onclick={handleClose}
>
  ✕
</button>
```

## Icons

Use `lucide-svelte` for icons:

```svelte
<script lang="ts">
  import { Home, Settings, LogOut } from 'lucide-svelte';
</script>

<Home />
<Settings size={24} />
<LogOut class="w-6 h-6" />
```

### Common Icons

- `Home` - Home page
- `Settings` - Settings
- `User` - User profile
- `Bell` - Notifications
- `Menu` - Navigation menu
- `Search` - Search
- `ChevronRight` - Navigation arrow
- `AlertCircle` - Alert
- `CheckCircle` - Success
- `XCircle` - Error
- `Plus` - Add
- `Trash2` - Delete
- `Edit` - Edit
- `Copy` - Copy

## Component Patterns

### Loading State

```svelte
<script lang="ts">
  let loading = $state(false);
  
  async function handleSubmit() {
    loading = true;
    try {
      // Submit logic
    } finally {
      loading = false;
    }
  }
</script>

<Button disabled={loading} onclick={handleSubmit}>
  {loading ? 'Loading...' : 'Submit'}
</Button>
```

### Error State

```svelte
<script lang="ts">
  let error = $state<string | null>(null);
  
  async function loadData() {
    error = null;
    try {
      // Load logic
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    }
  }
</script>

{#if error}
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
{/if}
```

### Slots for Composition

```svelte
<script lang="ts">
  interface Props {
    title?: string;
  }
  
  let { title = '' }: Props = $props();
</script>

<div>
  {#if title}
    <h3>{title}</h3>
  {/if}
  <slot />
  <slot name="footer" />
</div>
```

Usage:

```svelte
<MyComponent title="Header">
  Main content
  <div slot="footer">Footer content</div>
</MyComponent>
```

## Best Practices

1. **Keep components small** - One responsibility per component
2. **Use TypeScript** - Type your props and state
3. **Make components reusable** - Avoid hardcoded values
4. **Document props** - Include JSDoc comments
5. **Test interactions** - Test component behavior
6. **Maintain accessibility** - Use semantic HTML and ARIA
7. **Follow naming conventions** - PascalCase for component names
8. **Export properly** - Make components easy to import

## Troubleshooting

### Component not rendering

- Check imports
- Verify component path
- Check for runtime errors in console

### Styling not applied

- Ensure Tailwind CSS is configured
- Check CSS specificity
- Verify CSS module syntax

### Props not updating

- Use `$state` for reactive properties
- Check component lifecycle
- Ensure props are passed correctly
