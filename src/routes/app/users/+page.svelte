<script lang="ts">
	import { Button } from '#/ui/button';
	import { Plus } from 'lucide-svelte';

	import DataTable from './data-table.svelte';
	import { getUsers } from './users.remote';

	let page = $state(0);

	let users = $derived(await getUsers({ page }));
</script>

<div class="flex flex-wrap gap-2">
	<Button variant="outline" class="ml-auto">
		<Plus />
		Neu erstellen
	</Button>
</div>

<div class="my-2 space-y-4">
	{#if users}
		<DataTable users={users.page} />
	{/if}
</div>
