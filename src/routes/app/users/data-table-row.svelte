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
	import { Spinner } from '#/ui/spinner';

	import { deleteUser } from './users.remote';
	import { toast } from 'svelte-sonner';

	const { user }: { user: User } = $props();

	let deleteDialogOpen = $state(false);
</script>

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
				<DropdownMenu.Root bind:open={deleteDialogOpen}>
					<DropdownMenu.Trigger class="data-[state=open]:bg-muted">
						{#snippet child({ props })}
							<Button {...props} variant="ghost" size="icon">
								<Ellipsis />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" side="bottom">
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<Pencil />
								Anpassen
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item class="w-full text-destructive" closeOnSelect={false}>
								{#snippet child({ props })}
									<AlertDialog.Root>
										<AlertDialog.Trigger {...props}>
											<Trash2 class="text-destructive" />
											Löschen
										</AlertDialog.Trigger>
										<AlertDialog.Content>
											<AlertDialog.Header>
												<AlertDialog.Title>
													Benutzer
													<span class="font-mono">{user.username}</span>
													wirklich löschen?
												</AlertDialog.Title>
												<AlertDialog.Description>
													Diese Aktion ist permanent und kann nicht rückgängig gemacht werden.
												</AlertDialog.Description>
											</AlertDialog.Header>
											<AlertDialog.Footer>
												<AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel>
												<svelte:boundary>
													<AlertDialog.Action
														class="bg-destructive"
														disabled={!!deleteUser.pending}
														onclick={async () => {
															try {
																await deleteUser(user.id);
																toast.success('Nice bro');
                                deleteDialogOpen = false;
															} catch (error) {
																toast.error('Fucked up');
															}
														}}
													>
														{#if !!deleteUser.pending}
															<Spinner />
														{/if}
														Irreversibel Löschen
													</AlertDialog.Action>
												</svelte:boundary>
											</AlertDialog.Footer>
										</AlertDialog.Content>
									</AlertDialog.Root>
								{/snippet}
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</Table.Cell>
</Table.Row>
