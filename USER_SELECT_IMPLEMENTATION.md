# User Select Components - Implementation Summary

## Overview

Created a flexible, reusable user selection system with two components:

1. **`UserSelect`** - Base component for selecting from a predefined list of users
2. **`UserSearchSelect`** - Enhanced wrapper that adds remote search functionality

## Files Created

### 1. Remote Functions (`user-select.remote.ts`)

Location: `/home/cube/source/dhbw/fallstudie/frontend/src/routes/app/users/user-select.remote.ts`

**Exports:**

- `searchUsersRemote(q?: string, page?: number)` - Searches users with pagination (max 20 results)
  - Uses SDK's `searchUsers` endpoint
  - Parameters: `q` (search query), `page` (0-based pagination)
  - Returns: `PagedResultListUserInfo`

- `getUserByIdRemote(userId: string)` - Fetches a single user by ID
  - Uses SDK's `getUserById` endpoint
  - Returns: `UserInfo`

### 2. UserSelect Component (`user-select.svelte`)

Location: `/home/cube/source/dhbw/fallstudie/frontend/src/lib/components/user-select.svelte`

**Purpose:** Base select component for displaying and filtering users from a predefined array

**Props:**

- `users: UserInfo[]` - Array of users to display
- `value?: string` (bindable) - Selected user ID (UUID)
- `onChange?: (userId: string) => void` - Callback when selection changes
- `onSearchChange?: (search: string) => void` - Callback for search input changes
- `currentUser?: UserInfo` - User object to display in trigger
- `disabled?: boolean` - Disable the component
- `isLoading?: boolean` - Show loading state

**Features:**

- Clickable trigger button showing current user (with avatar) or "Select a user..."
- Clear button (X icon) to deselect current user
- Dialog modal with search input
- Locally filtered results (filters by username, first name, last name)
- Scrollable results container (max-height: 320px)
- Uses `UserNameAvatar` for each result
- Debounce not included (use `UserSearchSelect` for that)

### 3. UserSearchSelect Component (`user-search-select.svelte`)

Location: `/home/cube/source/dhbw/fallstudie/frontend/src/lib/components/user-search-select.svelte`

**Purpose:** Enhanced wrapper around `UserSelect` that handles remote searching with debouncing

**Props:**

- `value?: string` (bindable) - Selected user ID (UUID)
- `onChange?: (userId: string) => void` - Callback when selection changes
- `remote: RemoteFunction` - Async function that returns `PagedResultListUserInfo`
- `currentUser?: UserInfo` - User object to display in trigger
- `disabled?: boolean` - Disable the component

**Features:**

- Wraps `UserSelect` and manages remote search logic
- 300ms debounce on search input
- Auto-fetches initial user on mount if `value` provided
- Flexible remote function signature - pass any function matching `(params: Record<string, any>) => Promise<PagedResultListUserInfo | undefined>`
- Automatically updates `currentUser` when selection changes

## Usage Examples

### Basic UserSelect (Static List)

```svelte
<script>
	import { UserSelect } from '@/components';
	import { users } from '@/data';

	let selectedUserId = $state('');
	let currentUser = $state();
</script>

<UserSelect
	{users}
	bind:value={selectedUserId}
	onChange={(id) => {
		currentUser = users.find((u) => u.id === id);
	}}
	{currentUser}
/>
```

### UserSearchSelect (Remote Search)

```svelte
<script>
	import { UserSearchSelect } from '@/components';
	import { searchUsersRemote } from '@/routes/app/users/user-select.remote';

	let selectedUserId = $state('');
	let currentUser = $state();
</script>

<UserSearchSelect
	remote={searchUsersRemote}
	bind:value={selectedUserId}
	onChange={(id) => {
		console.log('Selected user:', id);
	}}
	{currentUser}
/>
```

### With Custom Remote Function

```svelte
<script>
	import { UserSearchSelect } from '@/components';

	let selectedUserId = $state('');

	// Custom remote function with different query params
	const customSearchFn = async (params) => {
		// params will have: { q, page } from component
		return await fetch(`/api/custom-search?q=${params.q}`).then((r) => r.json());
	};
</script>

<UserSearchSelect remote={customSearchFn} bind:value={selectedUserId} />
```

## Component Architecture

```
Dialog (shadcn/bits-ui)
├── DialogTrigger
│   └── Shows current user or "Select a user..."
│       └── Clear button (X) overlay
├── DialogContent
│   ├── DialogHeader with title
│   ├── Search input with debounce
│   └── Scrollable results list
│       └── UserNameAvatar for each user
```

## Key Design Decisions

1. **Two-Component Approach**: Separation of concerns
   - `UserSelect`: Pure UI component, client-side filtering
   - `UserSearchSelect`: Remote integration wrapper

2. **Bindable Value**: Uses Svelte 5 `$bindable()` for two-way binding

3. **Flexible Remote Function**: Accepts any function matching the signature, allowing:
   - Different query parameters
   - Different API endpoints
   - Custom filtering logic

4. **300ms Debounce**: Reduces server requests while typing

5. **Client-Side Filtering in UserSelect**: Instant feedback for pre-loaded lists

6. **Max 20 Results**: Configured in `searchUsersRemote` to keep UI manageable

## Integration Notes

- Uses latest shadcn/ui (Svelte 5) backed by bits-ui
- Imports from `#/` (alias for components)
- Uses `UserNameAvatar` for consistent user display
- Follows existing project patterns from `users.remote.ts`

## Future Enhancements

- Add keyboard navigation (arrow keys)
- Add "create new user" option
- Add selected users counter in large lists
- Add virtual scrolling for very large lists
- Add custom result template support
- Add multi-select variant
