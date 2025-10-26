<script lang="ts">
	import * as Table from '#/ui/table';
	import * as DropdownMenu from '#/ui/dropdown-menu';

	import { Checkbox } from '#/ui/checkbox';
	import UserAvatar from '#/user-avatar.svelte';
	import UserNameAvatar from '#/user-name-avatar.svelte';
	import type { User } from '@/types/auth';
	import { Ellipsis, Pencil, Trash2 } from 'lucide-svelte';
	import Button from '#/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { combinePaths } from '@/utils';

	const { users }: { users: User[] } = $props();
</script>

{#snippet userRow(user: User)}
	<Table.Row>
		<Table.Cell>
			<div class="px-2">
				<Checkbox />
			</div>
		</Table.Cell>
		<Table.Cell>
			<div class="flex justify-between px-2">
				<button
					class="flex w-[16rem] flex-col justify-around rounded-md border-0 p-1 hover:bg-muted"
					onclick={() => {
						goto(combinePaths('/app/users', user.id));
					}}
				>
					<UserNameAvatar {user} />
				</button>
				<div>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button variant="ghost" size="icon">
								<Ellipsis />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" side="bottom">
							<DropdownMenu.Group>
								<DropdownMenu.Item>
									<Pencil />
									Anpassen
								</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item class="text-destructive">
									<Trash2 class="text-destructive" />
									Löschen
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		</Table.Cell>
	</Table.Row>
{/snippet}

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
				{@render userRow(user)}
			{/each}
		</Table.Body>
	</Table.Root>
</div>
