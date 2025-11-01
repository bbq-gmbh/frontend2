<script lang="ts">
	import { Button } from '#/ui/button';
	import DataTable from './data-table.svelte';

	import { getUsers } from './users.remote';

	let page = $state(0);

	let users = $derived(await getUsers({ page }));
</script>

<h1 class="mb-2 text-3xl font-extrabold">User</h1>

<div class="my-2 space-y-4">
  {#if users}
  <DataTable
		users={users.page}
	/>
  {/if}
</div>
