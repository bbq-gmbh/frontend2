<script lang="ts">
	import type { LayoutData } from './$types';

	import MainLayout from '#/layout/main-layout.svelte';

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<MainLayout user={data.user}>
	{@render children?.()}
</MainLayout>
