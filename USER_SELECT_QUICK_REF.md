# UserSelect & UserSearchSelect - Quick Reference

## Files

- **Remote Functions**: `src/routes/app/users/user-select.remote.ts`
  - `searchUsersRemote` - Search with pagination
  - `getUserByIdRemote` - Fetch single user

- **Components**:
  - `src/lib/components/user-select.svelte` - Base select component
  - `src/lib/components/user-search-select.svelte` - Remote search wrapper

## Import Paths

```svelte
import {UserSelect} from '@/components/user-select.svelte'; import {UserSearchSelect} from '@/components/user-search-select.svelte';
import {searchUsersRemote} from '@/routes/app/users/user-select.remote';
```

## Minimal Example

```svelte
<script>
	import UserSearchSelect from '@/components/user-search-select.svelte';
	import { searchUsersRemote } from '@/routes/app/users/user-select.remote';

	let userId = $state('');
</script>

<UserSearchSelect remote={searchUsersRemote} bind:value={userId} />
```

## Props Reference

### UserSelect

| Prop             | Type                       | Required | Description                         |
| ---------------- | -------------------------- | -------- | ----------------------------------- |
| `users`          | `UserInfo[]`               | ✓        | List of users to display            |
| `value`          | `string`                   | -        | Selected user ID (bindable)         |
| `onChange`       | `(id: string) => void`     | -        | Selection change callback           |
| `onSearchChange` | `(search: string) => void` | -        | Search input change callback        |
| `currentUser`    | `UserInfo`                 | -        | User object to show in trigger      |
| `disabled`       | `boolean`                  | -        | Disable component (default: false)  |
| `isLoading`      | `boolean`                  | -        | Show loading state (default: false) |

### UserSearchSelect

| Prop          | Type                       | Required | Description                        |
| ------------- | -------------------------- | -------- | ---------------------------------- |
| `remote`      | `(params) => Promise<...>` | ✓        | Async search function              |
| `value`       | `string`                   | -        | Selected user ID (bindable)        |
| `onChange`    | `(id: string) => void`     | -        | Selection change callback          |
| `currentUser` | `UserInfo`                 | -        | User object to show in trigger     |
| `disabled`    | `boolean`                  | -        | Disable component (default: false) |

## Remote Function Signature

```typescript
type RemoteFunction = (params: Record<string, any>) => Promise<PagedResultListUserInfo | undefined>;

// For searchUsersRemote, params will be:
{ q?: string; page?: number }

// Returns:
{ page: UserInfo[]; total: number }
```

## Behavior

### UserSelect

- Client-side filtering by username, first name, last name
- Instant results
- No debounce

### UserSearchSelect

- Remote API calls
- 300ms debounce on search
- Auto-fetches initial user on mount if value provided
- Max 20 results per search

## Styling

- Uses Tailwind CSS + shadcn/ui components
- Dialog-based modal interface
- Search icon from lucide-svelte
- Clear button with X icon overlay

## Notes

- `value` represents the selected user ID (UUID)
- `currentUser` is the `UserInfo` object displayed in the trigger
- Clearing selection sets `value` to `undefined`
- Component is fully accessible and keyboard-navigable via bits-ui
