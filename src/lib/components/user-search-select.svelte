<script lang="ts">
	import { onMount } from 'svelte';
	import type { UserInfo, PagedResultListUserInfo } from '@/backend';
	import UserSelect from './user-select.svelte';

	type RemoteFunction = (
		params: Record<string, any>
	) => Promise<PagedResultListUserInfo | undefined>;

	interface Props {
		value?: string | null;
		onChange?: (userId: string) => void;
		remote: RemoteFunction;
		currentUser?: UserInfo;
		disabled?: boolean;
		readonly?: boolean;
	}

	let {
		value = $bindable(),
		onChange,
		remote,
		currentUser,
		disabled = false,
		readonly = false
	}: Props = $props();

	let users = $state<UserInfo[]>([]);
	let isLoading = $state(false);
	let searchTimeout: ReturnType<typeof setTimeout>;

	onMount(async () => {
		// Fetch initial user if value is provided
		if (value && !currentUser) {
			isLoading = true;
			try {
				// Try to fetch via search first (in case getUserById isn't available as a remote)
				const result = await remote({ q: '', page: 0 });
				if (result?.page) {
					const found = result.page.find((u) => u.id === value);
					if (found) {
						currentUser = found;
					}
				}
			} finally {
				isLoading = false;
			}
		}
	});

	const handleSearchChange = async (newSearchValue: string) => {
		// Clear existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// If search is empty, clear immediately
		if (!newSearchValue.trim()) {
			users = [];
			return;
		}

		// Clear old results immediately when starting new search
		users = [];
		isLoading = true;

		// Debounce search
		searchTimeout = setTimeout(async () => {
			try {
				const result = await remote({ q: newSearchValue, page: 0 });
				if (result?.page) {
					users = result.page;
				}
			} finally {
				isLoading = false;
			}
		}, 100);
	};

	const handleSelectUser = (userId: string) => {
		value = userId;
		onChange?.(userId);

		// Find and update currentUser
		const selected = users.find((u) => u.id === userId);
		if (selected) {
			currentUser = selected;
		}
	};
</script>

<UserSelect
	{users}
	bind:value
	onChange={handleSelectUser}
	onSearchChange={handleSearchChange}
	{currentUser}
	{disabled}
	{readonly}
	{isLoading}
/>
