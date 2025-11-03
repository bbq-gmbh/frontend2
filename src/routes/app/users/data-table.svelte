<script lang="ts">
	import * as Table from '#/ui/table';

	import { Checkbox } from '#/ui/checkbox';
	import DataTableRow from './data-table-row.svelte';
	import type { UserInfo } from '@/backend';

	let { users }: { users: UserInfo[] } = $props();
</script>

<div class="overflow-hidden rounded-md border">
	<Table.Root>
		<Table.Header class="sticky top-0 z-10">
			<Table.Row>
				<Table.Head>
					<div class="px-2">
						<Checkbox />
					</div>
				</Table.Head>
				<Table.Head>
					<div class="px-2">User</div>
				</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body class="**:data-[slot=table-cell]:first:w-8">
			{#each users as user}
				<DataTableRow {user} />
			{/each}
		</Table.Body>
	</Table.Root>
</div>
