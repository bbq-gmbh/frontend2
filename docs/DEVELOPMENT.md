# Development Guide

## Code Style & Standards

### TypeScript

- Use strict type checking
- Prefer explicit types over `any`
- Use interfaces for public APIs
- Use types for internal utilities

```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  // ...
}
```

### Component Development

#### Naming Conventions

- Components: `PascalCase` (e.g., `UserCard.svelte`)
- Props: `camelCase` (e.g., `userName`)
- Stores: `camelCase` (e.g., `userStore`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_TIMEOUT`)

#### Component Structure

```svelte
<script lang="ts">
  import type { Props } from './Component';
  
  // Props
  let { className = '', ...rest }: Props = $props();
  
  // State
  let isOpen = $state(false);
  
  // Derived
  let isValid = $derived(value.length > 0);
  
  // Functions
  function handleClick() {
    // ...
  }
</script>

<div class={className} onclick={handleClick} {...rest}>
  {#if isOpen}
    <slot />
  {/if}
</div>

<style module>
  div {
    /* Component styles */
  }
</style>
```

### Formatting & Linting

Run before committing:

```bash
# Format code
npm run format

# Check formatting
npm run lint

# Type checking
npm run check
```

## File Organization

### Route Structure

```
routes/
├── +layout.svelte          # Root layout
├── +page.svelte            # Home page
├── app/
│   ├── +layout.svelte      # App layout (nested)
│   ├── +page.svelte        # App home
│   └── dashboard/
│       ├── +page.svelte    # Dashboard page
│       └── +page.server.ts # Dashboard load
└── login/
    ├── +page.svelte        # Login page
    └── +page.server.ts     # Login handlers
```

### Component Organization

```
lib/components/
├── ui/                      # Base UI components
│   ├── Button.svelte
│   ├── Card.svelte
│   └── Input.svelte
├── forms/                   # Form components
│   ├── LoginForm.svelte
│   └── UserForm.svelte
└── shared/                  # Shared components
    ├── Header.svelte
    ├── Sidebar.svelte
    └── Footer.svelte
```

## Working with API Data

### Page Load with Data

```typescript
// +page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/users/${params.id}`
  );
  
  if (!response.ok) {
    error(response.status, 'Failed to load user');
  }
  
  return {
    user: await response.json()
  };
};
```

### Using Data in Components

```svelte
<script lang="ts">
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
</script>

<h1>{data.user.name}</h1>
```

## Error Handling

### Server-side Errors

```typescript
import { error } from '@sveltejs/kit';

export const load = async () => {
  try {
    const data = await fetchData();
    return data;
  } catch (err) {
    error(500, 'Failed to load data');
  }
};
```

### Client-side Errors

```svelte
<script>
  let message = '';
  
  async function handleSubmit() {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        message = 'Failed to submit';
      }
    } catch (err) {
      message = 'Network error';
    }
  }
</script>
```

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

- Unit tests in `*.test.ts` files
- Component tests for interactive elements
- Mock API responses

## Debugging

### Development Tools

- Browser DevTools for client-side debugging
- VS Code Debugger for server-side code
- Svelte DevTools browser extension

### Logging

```typescript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

## Performance Considerations

- Lazy load components when possible
- Use `preload` for critical data
- Optimize images and assets
- Use code splitting for routes
- Monitor bundle size

## Common Tasks

### Adding a New Page

1. Create route directory: `src/routes/new-page/`
2. Add `+page.svelte` for the page component
3. Add `+page.server.ts` if data loading needed
4. Add styling and logic

### Adding a New Component

1. Create file: `src/lib/components/NewComponent.svelte`
2. Follow component structure conventions
3. Export types if needed
4. Import and use in pages

### Connecting to API Endpoint

1. Add endpoint in `src/lib/backend/`
2. Add types in `src/lib/types/`
3. Use in component or page load
4. Handle errors appropriately

## Git Workflow

- Branch naming: `feature/`, `bugfix/`, `docs/`
- Commit messages: descriptive and concise
- Run format and lint before pushing
- Ensure type checking passes

```bash
npm run format && npm run check && git push
```
