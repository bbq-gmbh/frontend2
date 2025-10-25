<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import { Clock, House, Settings, Users } from 'lucide-svelte';

	import NavUser from './nav-user.svelte';
	import * as Sidebar from '#/ui/sidebar';
	import type { User } from '@/types/auth';

	let {
		ref = $bindable(null),
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: User } = $props();
</script>

<Sidebar.Root bind:ref {...restProps}>
	<Sidebar.Header class="h-16 border-b border-sidebar-border">
		<NavUser {user} />
	</Sidebar.Header>
	<Sidebar.Content>

		<Sidebar.Group>
			<Sidebar.GroupLabel>Allgemein</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a {...props} href="/app">
									<House />
									Start
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
          {#if user.employee}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a {...props} href="/app/time-entries">
									<Clock />
									Zeitbuchung
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
          {/if}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

    {#if user.is_superuser}
    <Sidebar.Group>
			<Sidebar.GroupLabel>Administration</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a {...props} href="/app/users">
									<Users />
									Benutzer
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
    {/if}

	</Sidebar.Content>
	<Sidebar.Footer>

		<Sidebar.Group>
			<Sidebar.GroupLabel>Einstellungen</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a {...props} href="/app/settings">
									<Settings />
									Einstellungen
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

	</Sidebar.Footer>
</Sidebar.Root>
