<script lang="ts">
	import { Search, X } from 'lucide-svelte';
	import type { UserInfo } from '@/backend';

	import Button from '#/ui/button/button.svelte';

	import * as Popover from '#/ui/popover';
	import UserNameAvatar from '#/user-name-avatar.svelte';

	interface Props {
		users: UserInfo[];
		value?: string | null;
		onChange?: (userId: string) => void;
		onSearchChange?: (search: string) => void;
		currentUser?: UserInfo;
		disabled?: boolean;
		isLoading?: boolean;
		clearable?: boolean;
		readonly?: boolean;
	}

	let {
		users,
		value = $bindable(),
		onChange,
		onSearchChange,
		currentUser,
		disabled = false,
		isLoading = false,
		clearable = true,
		readonly = false
	}: Props = $props();

	let searchInput = $state('');
	let isSelectingUser = $state(false);
	let inputElement: HTMLInputElement | undefined = $state();
	let popoverOpen = $state(false);

	const closePopoverAndSelectUser = (user: UserInfo) => {
		// CRITICAL: Set isSelectingUser FIRST before any state changes
		// This prevents any pending events from triggering search
		isSelectingUser = true;

		// Close popover
		popoverOpen = false;

		// Then handle selection
		handleSelectUser(user);
	};

	const handleSelectUser = (user: UserInfo) => {
		if (readonly) return;

		// isSelectingUser should already be true from closePopoverAndSelectUser
		// but set it again to be safe
		isSelectingUser = true;

		// Update the selection
		value = user.id;
		onChange?.(user.id);

		// Clear search input
		searchInput = '';
		if (inputElement) {
			inputElement.value = '';
		}

		// Reset flag after event loop so no pending events trigger search
		setTimeout(() => {
			isSelectingUser = false;
		}, 0);
	};

	const handleClearSelection = (e: Event) => {
		if (readonly) return;
		e.stopPropagation();
		e.preventDefault();
		value = undefined;
		onChange?.(undefined as any);
	};

	const handleSearchInputChange = (newValue: string) => {
		if (readonly) return;

		// Skip all search logic when user is being selected
		if (isSelectingUser) {
			return;
		}

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

	const handleTriggerClick = (e: Event) => {
		if (readonly) {
			e.preventDefault();
		}
	};
</script>

<Popover.Root bind:open={popoverOpen}>
	<div class="relative">
		<Popover.Trigger onclick={handleTriggerClick}>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class="flex min-h-14 w-full items-center justify-between p-2 text-sm"
					{disabled}
				>
					{#if currentUser}
						<UserNameAvatar user={currentUser} />
					{:else}
						<span class="text-muted-foreground">Select a user...</span>
					{/if}
				</Button>
			{/snippet}
		</Popover.Trigger>
		{#if value && clearable && !readonly}
			<div class="absolute top-0 right-0 bottom-0 flex flex-col justify-center px-2">
				<Button variant="ghost" size="icon-sm" onclick={handleClearSelection} {disabled}>
					<X />
				</Button>
			</div>
		{/if}
	</div>

	<Popover.Content class="w-[16rem] p-0" side="bottom" align="start">
		<div class="flex h-[22rem] flex-col gap-2 p-2">
			<div class="flex items-center gap-2 rounded-md border border-input px-3 py-2">
				<Search class="h-4 w-4 text-muted-foreground" />
				<input
					bind:this={inputElement}
					type="text"
					placeholder="Search users..."
					value={searchInput}
					onchange={(e) => handleSearchInputChange((e.target as HTMLInputElement).value)}
					oninput={(e) => handleSearchInputChange((e.target as HTMLInputElement).value)}
					disabled={!popoverOpen}
					class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
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
								onclick={() => closePopoverAndSelectUser(user)}
								class="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-accent hover:text-accent-foreground"
							>
								<UserNameAvatar {user} />
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
