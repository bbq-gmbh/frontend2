<script lang="ts">
	import { ChevronsUpDownIcon, LogOutIcon, Star, User as UserIcon } from 'lucide-svelte';

	import * as Avatar from '#/ui/avatar/index.js';
	import * as DropdownMenu from '#/ui/dropdown-menu/index.js';
	import * as Sidebar from '#/ui/sidebar/index.js';
	import { useSidebar } from '#/ui/sidebar/index.js';

	import type { User } from '@/types/auth';
	import { Badge } from '#/ui/badge';

	let { user }: { user: User } = $props();

	const sidebar = useSidebar();
</script>

{#snippet avatar(user: User)}
	<Avatar.Root class="size-8 rounded-full">
		<Avatar.Fallback class="rounded-full font-mono">
			{#if !!user.employee}
				{user.employee.first_name.substring(0, 1)}{user.employee.last_name.substring(0, 1)}
			{:else}
				{user.username.substring(0, 2)}
			{/if}
		</Avatar.Fallback>
	</Avatar.Root>
	<div class="grid flex-1 text-left text-sm leading-tight">
		{#if !!user.employee}
			<span class="truncate font-medium">
				{user.employee.first_name}
				{user.employee.last_name}
				{#if user.is_superuser}
					<Badge variant="outline" class="px-0.5">
						<Star />
					</Badge>
				{/if}
			</span>
			<span class="truncate text-xs">
				<span class="font-mono">{user.username}</span>
			</span>
		{:else}
			<span class="truncate font-medium">
				<span class="font-mono">{user.username}</span>
				{#if user.is_superuser}
					<Badge variant="outline" class="px-0.5">
						<Star />
					</Badge>
				{/if}
			</span>
		{/if}
	</div>
{/snippet}

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
						{@render avatar(user)}
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
						{@render avatar(user)}
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
