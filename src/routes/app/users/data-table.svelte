<script lang="ts">
	import * as Table from '#/ui/table';
	import * as DropdownMenu from '#/ui/dropdown-menu';
	import * as AlertDialog from '#/ui/alert-dialog';

	import { Checkbox } from '#/ui/checkbox';
	import UserNameAvatar from '#/user-name-avatar.svelte';
	import type { User } from '@/types/auth';
	import { Ellipsis, Pencil, Trash2 } from 'lucide-svelte';
	import Button from '#/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { combinePaths } from '@/utils';
	import DataTableRow from './data-table-row.svelte';

	const { users }: { users: User[] } = $props();
</script>

<div class="overflow-hidden rounded-md border">
	<Table.Root>
		<Table.Header class="sticky top-0 z-10 bg-muted">
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
