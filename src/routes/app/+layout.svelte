<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/state';

	import MainLayout from '#/layout/main-layout.svelte';

	let { children, data }: { children: any; data: LayoutData } = $props();

	const breadcrumbs = $derived(page.data.breadcrumbs);
</script>

<MainLayout user={data.user} {breadcrumbs}>
	{@render children?.()}
</MainLayout>
