<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import * as Sidebar from '#/ui/sidebar';
	import NavUser from './nav-user.svelte';
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
	<Sidebar.Content></Sidebar.Content>
	<Sidebar.Footer></Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
