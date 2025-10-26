<script lang="ts">
	import { ChevronsUpDownIcon, LogOutIcon, Star, User as UserIcon } from 'lucide-svelte';

	import * as DropdownMenu from '#/ui/dropdown-menu/index.js';
	import * as Sidebar from '#/ui/sidebar/index.js';
	import { useSidebar } from '#/ui/sidebar/index.js';

	import type { User } from '@/types/auth';
	import UserNameAvatar from '#/user-name-avatar.svelte';

	let { user }: { user: User } = $props();

	const sidebar = useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<UserNameAvatar {user} />
						<ChevronsUpDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="start"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<UserNameAvatar {user} />
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a {...props} href="/app/account">
								<UserIcon />
								Account
							</a>
						{/snippet}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a {...props} href="/logout">
								<LogOutIcon />
								Log out
							</a>
						{/snippet}
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
