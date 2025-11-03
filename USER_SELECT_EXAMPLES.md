# UserSelect Components - Complete Usage Guide

## Setup

### Import the components and remote functions:

```svelte
<script lang="ts">
	import UserSelect from '@/components/user-select.svelte';
	import UserSearchSelect from '@/components/user-search-select.svelte';
	import { searchUsersRemote, getUserByIdRemote } from '@/routes/app/users/user-select.remote';
</script>
```

---

## Example 1: Basic UserSelect with Static List

Use this when you have a pre-loaded list of users (e.g., from a database query or store).

```svelte
<script lang="ts">
	import UserSelect from '@/components/user-select.svelte';
	import type { UserInfo } from '@/backend';

	let selectedUserId = $state<string | undefined>();
	let currentUser = $state<UserInfo | undefined>();

	const users: UserInfo[] = [
		{ id: '123', username: 'john_doe', is_superuser: false, created_at: '2024-01-01' },
		{ id: '456', username: 'jane_smith', is_superuser: true, created_at: '2024-01-01' }
		// ...
	];

	const handleUserChange = (userId: string | undefined) => {
		selectedUserId = userId;
		if (userId) {
			currentUser = users.find((u) => u.id === userId);
		} else {
			currentUser = undefined;
		}
	};
</script>

<UserSelect
	{users}
	bind:value={selectedUserId}
	onChange={handleUserChange}
	{currentUser}
	disabled={false}
/>

<p>Selected: {selectedUserId}</p>
```

---

## Example 2: UserSearchSelect with Remote Search

Use this for searching users from a backend API with debouncing.

```svelte
<script lang="ts">
	import UserSearchSelect from '@/components/user-search-select.svelte';
	import { searchUsersRemote } from '@/routes/app/users/user-select.remote';
	import type { UserInfo } from '@/backend';

	let selectedUserId = $state<string | undefined>();
	let currentUser = $state<UserInfo | undefined>();
</script>

<UserSearchSelect
	remote={searchUsersRemote}
	bind:value={selectedUserId}
	onChange={(id) => console.log('Selected:', id)}
	{currentUser}
/>

<p>Selected User ID: {selectedUserId}</p>
{#if currentUser}
	<div>
		<strong>{currentUser.username}</strong>
		{#if currentUser.employee}
			<p>{currentUser.employee.first_name} {currentUser.employee.last_name}</p>
		{/if}
	</div>
{/if}
```

---

## Example 3: In a Form Context

Use in a form to select a user for assignment or relationship.

```svelte
<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { userSchema } from '@/schemas';
	import UserSearchSelect from '@/components/user-search-select.svelte';
	import { searchUsersRemote } from '@/routes/app/users/user-select.remote';
	import type { UserInfo } from '@/backend';

	let data = $props();

	const { form, enhance } = superForm(data.form);

	let supervisorUser = $state<UserInfo | undefined>();
</script>

<form method="POST" use:enhance>
	<label for="supervisor">Supervisor</label>

	<UserSearchSelect
		remote={searchUsersRemote}
		bind:value={form.supervisor_id}
		onChange={(id) => {
			form.supervisor_id = id;
		}}
		currentUser={supervisorUser}
	/>

	<button type="submit">Save</button>
</form>
```

---

## Example 4: Multiple User Selects

Example using multiple instances in the same page.

```svelte
<script lang="ts">
	import UserSearchSelect from '@/components/user-search-select.svelte';
	import { searchUsersRemote } from '@/routes/app/users/user-select.remote';
	import type { UserInfo } from '@/backend';

	let manager = $state<string | undefined>();
	let managerUser = $state<UserInfo | undefined>();

	let reviewer = $state<string | undefined>();
	let reviewerUser = $state<UserInfo | undefined>();

	let approver = $state<string | undefined>();
	let approverUser = $state<UserInfo | undefined>();
</script>

<div class="space-y-4">
	<div>
		<h3>Select Manager</h3>
		<UserSearchSelect remote={searchUsersRemote} bind:value={manager} currentUser={managerUser} />
	</div>

	<div>
		<h3>Select Reviewer</h3>
		<UserSearchSelect remote={searchUsersRemote} bind:value={reviewer} currentUser={reviewerUser} />
	</div>

	<div>
		<h3>Select Approver</h3>
		<UserSearchSelect remote={searchUsersRemote} bind:value={approver} currentUser={approverUser} />
	</div>
</div>
```

---

## Example 5: With Custom Remote Function

Use with a different backend endpoint or custom query logic.

```svelte
<script lang="ts">
	import UserSearchSelect from '@/components/user-search-select.svelte';
	import type { PagedResultListUserInfo, UserInfo } from '@/backend';

	let selectedUserId = $state<string | undefined>();
	let currentUser = $state<UserInfo | undefined>();

	// Custom remote function that filters by department
	const searchByDepartment = async (params: { q?: string; page?: number }) => {
		const response = await fetch(
			`/api/users/search?department=sales&q=${params.q || ''}&page=${params.page || 0}`
		);
		return response.json() as Promise<PagedResultListUserInfo>;
	};
</script>

<UserSearchSelect remote={searchByDepartment} bind:value={selectedUserId} {currentUser} />
```

---

## Example 6: With Loading State

Handle async operations around selection.

```svelte
<script lang="ts">
	import UserSearchSelect from '@/components/user-search-select.svelte';
	import { searchUsersRemote } from '@/routes/app/users/user-select.remote';
	import type { UserInfo } from '@/backend';

	let selectedUserId = $state<string | undefined>();
	let currentUser = $state<UserInfo | undefined>();
	let isSubmitting = $state(false);

	const handleUserChange = async (id: string | undefined) => {
		if (!id) return;

		selectedUserId = id;
		isSubmitting = true;

		try {
			// Example: Make an API call when user is selected
			const response = await fetch(`/api/users/${id}/assign`, {
				method: 'POST'
			});

			if (response.ok) {
				console.log('User assigned successfully');
			}
		} catch (error) {
			console.error('Failed to assign user:', error);
			selectedUserId = undefined;
		} finally {
			isSubmitting = false;
		}
	};
</script>

<UserSearchSelect
	remote={searchUsersRemote}
	bind:value={selectedUserId}
	onChange={handleUserChange}
	{currentUser}
	disabled={isSubmitting}
/>

{#if isSubmitting}
	<p>Assigning user...</p>
{/if}
```

---

## Example 7: Pre-populated Selection

Load and display a user that was previously selected.

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import UserSearchSelect from '@/components/user-search-select.svelte';
	import { searchUsersRemote } from '@/routes/app/users/user-select.remote';
	import type { UserInfo } from '@/backend';

	let assignedUserId = $props<string | undefined>();

	let selectedUserId = $state<string | undefined>(assignedUserId);
	let currentUser = $state<UserInfo | undefined>();

	onMount(async () => {
		// If there's an assigned user ID, fetch its details
		if (selectedUserId) {
			const result = await searchUsersRemote({ q: '', page: 0 });
			if (result?.page) {
				currentUser = result.page.find((u) => u.id === selectedUserId);
			}
		}
	});
</script>

<UserSearchSelect remote={searchUsersRemote} bind:value={selectedUserId} {currentUser} />
```

---

## Props Reference

### UserSelect Props

```svelte
<UserSelect
  users={array}           {/* Required: Array of UserInfo objects */}
  bind:value={userId}     {/* Optional: Selected user ID (UUID string) */}
  onChange={(id) => {}}   {/* Optional: Called when selection changes */}
  onSearchChange={(q) => {}} {/* Optional: Called on search input change */}
  currentUser={user}      {/* Optional: UserInfo object to display in trigger */}
  disabled={false}        {/* Optional: Disable the component */}
  isLoading={false}       {/* Optional: Show loading state */}
/>
```

### UserSearchSelect Props

```svelte
<UserSearchSelect
  remote={asyncFunction}  {/* Required: Async function that returns PagedResultListUserInfo */}
  bind:value={userId}     {/* Optional: Selected user ID (UUID string) */}
  onChange={(id) => {}}   {/* Optional: Called when selection changes */}
  currentUser={user}      {/* Optional: UserInfo object to display in trigger */}
  disabled={false}        {/* Optional: Disable the component */}
/>
```

---

## Key Features

✅ **Reusable**: Use `UserSelect` for any list, `UserSearchSelect` for API-backed search  
✅ **Flexible**: Custom remote functions with any query logic  
✅ **Performant**: 300ms debounce prevents excessive API calls  
✅ **Accessible**: Built on bits-ui with full keyboard navigation  
✅ **Styled**: Latest shadcn/ui Svelte components with Tailwind CSS  
✅ **Type-safe**: Full TypeScript support

---

## Tips & Best Practices

1. **Always provide `currentUser`** - Shows which user is selected in the trigger button
2. **Use `onChange` for side effects** - Update parent state or trigger API calls
3. **Custom remote functions** - Adapt the component to any API endpoint
4. **Pre-load users** when you have a small, fixed list (< 100 users)
5. **Use search** for large user lists or complex filtering needs
6. **Set `disabled={true}`** during form submission to prevent accidental changes
