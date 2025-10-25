<script lang="ts">
	import { Button } from '#/ui/button';
	import DataTable from './data-table.svelte';

	import { getUsers } from './users.remote';
</script>

<h1 class="mb-2 text-3xl font-extrabold">User</h1>

<div class="my-2 space-y-2">
	<svelte:boundary>
		<Button
			onclick={async () => {
				await getUsers().refresh();
			}}
			variant="outline"
		>
			refresh
		</Button>
		{#each await getUsers() as res}
			<div>{res.username}</div>
		{/each}

		{#snippet failed(_error, reset)}
			<button onclick={reset}>oops! try again</button>
		{/snippet}
	</svelte:boundary>
</div>

<div class="my-2 space-y-4">
	<DataTable />
</div>
