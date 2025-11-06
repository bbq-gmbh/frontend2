<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	import {
		Check,
		IdCardLanyard,
		LogOut,
		Pen,
		Save,
		Star,
		UserCog,
		UserIcon,
		X
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	import * as InputGroup from '#/ui/input-group';
	import * as AlertDialog from '#/ui/alert-dialog';
	import * as Card from '#/ui/card';
	import * as Tabs from '#/ui/tabs';

	import Button from '#/ui/button/button.svelte';
	import { Input } from '#/ui/input';
	import Label from '#/ui/label/label.svelte';
	import UserNameAvatar from '#/user-name-avatar.svelte';
	import { Spinner } from '#/ui/spinner';
	import Switch from '#/ui/switch/switch.svelte';
	import { Badge } from '#/ui/badge';

	import {
		convertToEmployee,
		editUser,
		getEmployeeById,
		getUserById,
		getUsernameExists,
		searchEmployeesRemote,
		remoteLogoutAll,
		remoteResetPassword
	} from './user.remote';
	import UserSearchSelect from '#/user-search-select.svelte';

	let { data }: { data: PageData } = $props();
	let { pathUserId, edit } = data;

	let getUser = $derived(getUserById(pathUserId));
	let getEmployee = $derived.by(async () => {
		const user = await getUser;
		if (!user.employee) return undefined;

		return await getEmployeeById(pathUserId);
	});

	let editing = $state(edit);

	let editUsername = $state('');

	let editEmployeeFirstName = $state('');
	let editEmployeeLastName = $state('');

	let editEmployeeSupervisor: string | null | undefined = $state(undefined);

	async function cancelEdit() {
		editing = false;

		await updateEdits();
	}

	async function updateEdits() {
		const user = await getUser;

		editUsername = user.username;

		editEmployeeFirstName = user.employee?.first_name ?? '';
		editEmployeeLastName = user.employee?.last_name ?? '';

		const employee = await getEmployee;

		editEmployeeSupervisor = employee?.supervisor_id;
	}

	onMount(updateEdits);

	let remoteLogoutAllDialogOpen = $state(false);
	let resertPasswordDialogOpen = $state(false);
</script>

{#await getUser then user}
	<div class="mx-auto mb-4 flex justify-end gap-2">
		<div class="mr-auto">
			<UserNameAvatar {user} />
		</div>
		{#if !editing}
			{#if !user.employee}
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline">
								<UserCog />
							</Button>
						{/snippet}
					</AlertDialog.Trigger>
					<AlertDialog.Content class="gap-6">
						<AlertDialog.Header>
							<AlertDialog.Title>Zeiterfassung für diesen Nutzer aktivieren?</AlertDialog.Title>
							<AlertDialog.Description>
								Diese Aktion kann nicht rückgängig gemacht werden.
							</AlertDialog.Description>
						</AlertDialog.Header>

						<form {...convertToEmployee} class="flex flex-col gap-6">
							<div class="flex flex-col gap-4">
								<Input name="user_id" value={user.id} class="hidden" />
								<div class="space-y-2">
									<Label>Vorname</Label>
									<Input {...convertToEmployee.fields.first_name.as('text')} />
								</div>
								<div class="space-y-2">
									<Label>Nachname</Label>
									<Input {...convertToEmployee.fields.last_name.as('text')} />
								</div>
								<div class="space-y-2">
									<Label>Geburtsdatum</Label>
									<Input {...convertToEmployee.fields.birthday.as('date')} />
								</div>
								<div class="space-y-2">
									<Label>Wöchentliche Arbeitszeit</Label>
									<select name="hour_model">
										<option value="6">30 Stunden Woche</option>
										<option value="7">35 Stunden Woche</option>
										<option value="8">40 Stunden Woche</option>
									</select>
								</div>
								<div class="space-y-2">
									<Label>Pausenzeit</Label>
									<Input {...convertToEmployee.fields.pause_time_minutes.as('number')} />
								</div>
								<div class="space-y-2">
									<Label>Beginnt von...</Label>
									<Input {...convertToEmployee.fields.start_from.as('date')} />
								</div>
								{#if convertToEmployee.fields.allIssues()}
									<div class="flex flex-col gap-0.5 text-sm">
										{#each convertToEmployee.fields.allIssues() as issue}
											<div>
												{issue.message}
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<AlertDialog.Footer>
								<AlertDialog.Cancel type="button">Abbrechen</AlertDialog.Cancel>
								<AlertDialog.Action>
									{#snippet child({ props })}
										<Button {...props} type="submit" disabled={!!convertToEmployee.pending}>
											{#if !!convertToEmployee.pending}
												<Spinner />
											{:else}
												<UserCog />
											{/if}
											Umwandeln
										</Button>
									{/snippet}
								</AlertDialog.Action>
							</AlertDialog.Footer>
						</form>
					</AlertDialog.Content>
				</AlertDialog.Root>
			{/if}

			<Button
				variant="outline"
				onclick={() => {
					editing = true;
				}}
			>
				<Pen />
				Bearbeiten
			</Button>
		{:else}
			<AlertDialog.Root>
				<AlertDialog.Trigger class="ml-auto">
					{#snippet child({ props })}
						<Button {...props} variant="outline">
							<Save />
							Speichern
						</Button>
					{/snippet}
				</AlertDialog.Trigger>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Änderungen speichern?</AlertDialog.Title>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel>
						<AlertDialog.Action
							onclick={async () => {
								try {
									await editUser({
										id: user.id,
										username: editUsername,
										employee: user.employee
											? {
													first_name: editEmployeeFirstName,
													last_name: editEmployeeLastName,
													supervisor: editEmployeeSupervisor
												}
											: undefined
									});
									editing = false;
									toast.success('Änderungen erfolgreich gespeichert');
								} catch (error: any) {
									toast.error(
										`Fehler beim Speichern der Änderungen: ${error.body?.message ?? 'Unknown Error'}`
									);
								}
							}}
							disabled={!!editUser.pending}
						>
							{#if !!editUser.pending}
								<Spinner />
							{/if}
							Speichern
						</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
			<Button variant="outline" onclick={cancelEdit}>
				<X />
				Abbrechen
			</Button>
		{/if}
		<Button size="icon" variant="ghost" onclick={() => goto('/app/users')}>
			<X />
		</Button>
	</div>

	<div class="max-w-[40rem] space-y-4">
		<Card.Root class="bg-transparent">
			<Card.Header>
				<Card.Title>Nutzer</Card.Title>
			</Card.Header>
			<Card.Content class="max-w-[40rem] space-y-6">
				<div class="space-y-2">
					<Label>Id</Label>
					<InputGroup.Root>
						<InputGroup.Input value={user.id} disabled={editing} readonly />
						<InputGroup.Addon align="inline-end">
							<IdCardLanyard />
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>
				<div class="space-y-2">
					<Label>Username</Label>
					<InputGroup.Root>
						<InputGroup.Input bind:value={editUsername} readonly={!editing} />
						<InputGroup.Addon align="inline-end">
							{#if !editing || editUsername === user.username}
								<UserIcon />
							{:else if (await getUsernameExists(editUsername)) === false}
								<Check class="text-green-600 dark:text-green-400" />
							{:else}
								<X class="text-red-600 dark:text-red-400" />
							{/if}
						</InputGroup.Addon>
						{#if editing}
							<InputGroup.Addon align="inline-start">
								<Pen />
							</InputGroup.Addon>
						{/if}
					</InputGroup.Root>
				</div>
				<div class="space-y-2">
					<Label>Erstellt am</Label>
					<Input
						value={new Date(user.created_at).toLocaleDateString('de-DE')}
						disabled={editing}
						placeholder="&ndash;"
						readonly
					/>
				</div>
				<div class="flex items-center gap-x-4 gap-y-2">
					<Switch disabled={editing} bind:checked={() => user.is_superuser, () => {}} />
					<Label class="flex items-center gap-1">
						Superuser
						<Badge variant="outline" class="px-0.5">
							<Star />
						</Badge>
					</Label>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="bg-transparent">
			<Card.Header>
				<Card.Title>Sessions</Card.Title>
			</Card.Header>
			<Card.Content class="flex flex-col gap-6">
				<div class="flex flex-wrap gap-2">
					<AlertDialog.Root bind:open={remoteLogoutAllDialogOpen}>
						<AlertDialog.Trigger>
							<Button variant="outline">
								<LogOut />
								Überall ausloggen
							</Button>
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Nutzer von allen Geräten ausloggen?</AlertDialog.Title>
								<AlertDialog.Description>
									Nach dieser Aktion wird der Nutzer von allen Geräten ausgeloggt.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>
									<X />
									Abbrechen
								</AlertDialog.Cancel>
								<AlertDialog.Action
									onclick={async () => {
										try {
											await remoteLogoutAll(user.id);
											remoteLogoutAllDialogOpen = false;

											toast.success('Nutzer erfolgreich überall ausgeloggt');

											if (data.user.id === user.id) goto('/logout');
										} catch (error) {
											toast.error('Nutzer konnte nicht ausgeloggt werden');
										}
									}}
									disabled={!!remoteLogoutAll.pending}
								>
									{#if !!remoteLogoutAll.pending}
										<Spinner />
									{:else}
										<LogOut />
									{/if}
									Ausloggen
								</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>

					<AlertDialog.Root bind:open={resertPasswordDialogOpen}>
						<AlertDialog.Trigger>
							<Button variant="outline">
								<LogOut />
								Passwort zurücksetzen
							</Button>
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Passwort für Nutzer zurücksetzen?</AlertDialog.Title>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>
									<X />
									Abbrechen
								</AlertDialog.Cancel>
								<AlertDialog.Action
									onclick={async () => {
										try {
											const new_password = await remoteResetPassword(user.id);
											resertPasswordDialogOpen = false;

											toast.success('Passwort für Nutzer erfolgreich zurückgesetzt');

											alert(`Neues Passwort:\n\n${new_password}`);

											if (data.user.id === user.id) goto('/logout');
										} catch (error) {
											toast.error('Passwort konnte nicht zurückgesetzt werden');
										}
									}}
									disabled={!!remoteResetPassword.pending}
								>
									{#if !!remoteResetPassword.pending}
										<Spinner />
									{:else}
										<LogOut />
									{/if}
									Passwort zurücksetzen
								</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</div>
			</Card.Content>
		</Card.Root>

		{#if user.employee}
			<Card.Root class="bg-transparent">
				<Card.Header>
					<Card.Title>Person</Card.Title>
				</Card.Header>
				<Card.Content class="max-w-[40rem] space-y-6">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label>Vorname</Label>
							<InputGroup.Root>
								<InputGroup.Input
									bind:value={editEmployeeFirstName}
									placeholder="&ndash;"
									readonly={!editing}
								/>
								{#if editing && !!user.employee}
									<InputGroup.Addon align="inline-start">
										<Pen />
									</InputGroup.Addon>
								{/if}
							</InputGroup.Root>
						</div>
						<div class="space-y-2">
							<Label>Nachname</Label>
							<InputGroup.Root>
								<InputGroup.Input
									bind:value={editEmployeeLastName}
									placeholder="&ndash;"
									readonly={!editing}
								/>
								{#if editing && !!user.employee}
									<InputGroup.Addon align="inline-start">
										<Pen />
									</InputGroup.Addon>
								{/if}
							</InputGroup.Root>
						</div>
					</div>

					<div class="space-y-2">
						<Label>Geburtsdatum</Label>
						<Input
							value={new Date(user.employee.birthday).toLocaleDateString('de-DE')}
							disabled={editing}
							placeholder="&ndash;"
							readonly
						/>
					</div>

					<svelte:boundary>
						{#await getEmployee then employee}
							{@const getSupervisorUser = async () =>
								editEmployeeSupervisor ? await getUserById(editEmployeeSupervisor) : undefined}
							{#if employee}
								<div class="space-y-2">
									<Label>Vorgesetzer</Label>
									<UserSearchSelect
										currentUser={await getSupervisorUser()}
										bind:value={editEmployeeSupervisor}
										remote={searchEmployeesRemote}
										readonly={!editing}
									/>
								</div>
							{/if}
						{/await}
					</svelte:boundary>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
{/await}
