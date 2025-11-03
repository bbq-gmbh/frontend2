<script lang="ts">
	import { Search, X } from 'lucide-svelte';
	import type { UserInfo } from '@/backend';
	import UserNameAvatar from '#/user-name-avatar.svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '#/ui/popover';

	interface Props {
		users: UserInfo[];
		value?: string | null;
		onChange?: (userId: string) => void;
		onSearchChange?: (search: string) => void;
		currentUser?: UserInfo;
		disabled?: boolean;
		isLoading?: boolean;
	}

	let {
		users,
		value = $bindable(),
		onChange,
		onSearchChange,
		currentUser,
		disabled = false,
		isLoading = false
	}: Props = $props();

	let searchInput = $state('');

	const handleSelectUser = (user: UserInfo) => {
		value = user.id;
		onChange?.(user.id);
		searchInput = '';
	};

	const handleClearSelection = (e: Event) => {
		e.stopPropagation();
		e.preventDefault();
		value = undefined;
		onChange?.(undefined as any);
	};

	const handleSearchInputChange = (newValue: string) => {
		searchInput = newValue;
		onSearchChange?.(newValue);

		// Clear results when search input is empty
		if (!newValue.trim()) {
			users = [];
		}
	};

	const filteredUsers = $derived.by(() => {
		if (!searchInput) return users;
		const query = searchInput.toLowerCase();
		return users.filter(
			(user) =>
				user.username.toLowerCase().includes(query) ||
				user.employee?.first_name?.toLowerCase().includes(query) ||
				user.employee?.last_name?.toLowerCase().includes(query)
		);
	});
</script>

<Popover>
	<div class="relative">
		<PopoverTrigger
			class="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			{disabled}
		>
			<div class="flex flex-1 items-center">
				{#if currentUser}
					<UserNameAvatar user={currentUser} />
				{:else}
					<span class="text-muted-foreground">Select a user...</span>
				{/if}
			</div>
		</PopoverTrigger>
		{#if value}
			<button
				class="absolute top-1/2 right-2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded hover:bg-accent"
				onclick={handleClearSelection}
				{disabled}
				tabindex={disabled ? -1 : 0}
			>
				<X class="h-4 w-4" />
			</button>
		{/if}
	</div>

	<PopoverContent class="w-[16rem] p-0">
		<div class="flex h-[25rem] flex-col gap-2 p-2">
			<div class="flex items-center gap-2 rounded-md border border-input px-3 py-2">
				<Search class="h-4 w-4 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search users..."
					value={searchInput}
					onchange={(e) => handleSearchInputChange((e.target as HTMLInputElement).value)}
					oninput={(e) => handleSearchInputChange((e.target as HTMLInputElement).value)}
					class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
				/>
			</div>

			<div class="min-h-0 flex-1 overflow-y-auto rounded-md border border-input">
				{#if isLoading}
					<div class="flex items-center justify-center py-8">
						<div class="text-sm text-muted-foreground">Loading...</div>
					</div>
				{:else if searchInput.trim() === '' && filteredUsers.length === 0}
					<div class="flex items-center justify-center py-8">
						<div class="text-sm text-muted-foreground">Type in to search</div>
					</div>
				{:else if filteredUsers.length === 0}
					<div class="flex items-center justify-center py-8">
						<div class="text-sm text-muted-foreground">No users found</div>
					</div>
				{:else}
					<div class="space-y-1 p-1">
						{#each filteredUsers as user (user.id)}
							<button
								onclick={() => handleSelectUser(user)}
								class="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
							>
								<UserNameAvatar {user} />
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</PopoverContent>
</Popover>
