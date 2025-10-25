<script lang="ts">
	import { ChevronsUpDownIcon } from 'lucide-svelte';

	import * as Avatar from '#/ui/avatar/index.js';
	import * as DropdownMenu from '#/ui/dropdown-menu/index.js';
	import * as Sidebar from '#/ui/sidebar/index.js';
	import { useSidebar } from '#/ui/sidebar/index.js';

	import type { User } from '@/types/auth';

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
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Fallback class="rounded-lg">
								{#if !!user.employee}
									{user.employee.first_name.substring(0, 1)}
									{user.employee.last_name.substring(0, 1)}
								{:else}
									{user.username.substring(0, 2)}
								{/if}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							{#if !!user.employee}
								<span class="truncate font-medium">
									{user.employee.first_name}&nbsp;
									{user.employee.last_name}
								</span>
								<span class="truncate text-xs">{user.username}</span>
							{:else}
								<span class="truncate font-medium">
									{user.username}
								</span>
							{/if}
						</div>
						<ChevronsUpDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
