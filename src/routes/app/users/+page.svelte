<script lang="ts">
	import { Check, Plus, UserPlus, X } from 'lucide-svelte';

	import { Button } from '#/ui/button';
	import { Input } from '#/ui/input';
	import Label from '#/ui/label/label.svelte';

	import * as AlertDialog from '#/ui/alert-dialog';
	import * as InputGroup from '#/ui/input-group';

	import DataTable from './data-table.svelte';
	import { createUser, getUsers } from './users.remote';
	import { passwordSchema, usernameSchema } from '@/schemas/auth';
	import { Spinner } from '#/ui/spinner';
	import { toast } from 'sonner';

	let page = $state(0);

	let createOpen = $state(false);

	let createUsername = $state('');
	let createUsernameValid = $derived.by(() => {
		if (createUsername.length === 0) return null;
		return usernameSchema.safeParse(createUsername).success;
	});

	let createPassword = $state('');
	let createPasswordValid = $derived.by(() => {
		if (createPassword.length === 0) return null;
		return passwordSchema.safeParse(createPassword).success;
	});

	let createPasswordConfirm = $state('');
	let createPasswordConfirmValid = $derived.by(() => {
		if (createPasswordValid === null || createPasswordValid == false) return null;
		return createPasswordConfirm === createPassword;
	});

	function resetInput() {
		createUsername = '';
	}
</script>

<div class="flex flex-wrap gap-2">
	<AlertDialog.Root
		bind:open={createOpen}
		onOpenChange={(o) => {
			if (o) resetInput();
		}}
	>
		<AlertDialog.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" class="ml-auto">
					<Plus />
					Neu erstellen
				</Button>
			{/snippet}
		</AlertDialog.Trigger>
		<AlertDialog.Content class="gap-6" interactOutsideBehavior="close">
			<AlertDialog.Header>
				<AlertDialog.Title>Nutzer erstellen</AlertDialog.Title>
			</AlertDialog.Header>

			<div class="space-y-2">
				<Label>Username</Label>
				<InputGroup.Root>
					<InputGroup.Input
						bind:value={createUsername}
						type="text"
						disabled={!!createUser.pending}
					/>
					{#if createUsernameValid !== null}
						<InputGroup.Addon align="inline-end">
							{#if createUsernameValid}
								<Check class="text-green-600 dark:text-green-400" />
							{:else}
								<X class="text-red-600 dark:text-red-400" />
							{/if}
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
			</div>

			<div class="space-y-2">
				<Label>Passwort</Label>
				<InputGroup.Root>
					<InputGroup.Input
						bind:value={createPassword}
						type="password"
						disabled={!!createUser.pending}
					/>
					{#if createPasswordValid !== null}
						<InputGroup.Addon align="inline-end">
							{#if createPasswordValid}
								<Check class="text-green-600 dark:text-green-400" />
							{:else}
								<X class="text-red-600 dark:text-red-400" />
							{/if}
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
			</div>

			<div class="space-y-2">
				<Label>Passwort Wiederholen</Label>
				<InputGroup.Root>
					<InputGroup.Input
						bind:value={createPasswordConfirm}
						type="password"
						disabled={!!createUser.pending}
					/>
					{#if createPasswordConfirmValid !== null}
						<InputGroup.Addon align="inline-end">
							{#if createPasswordConfirmValid}
								<Check class="text-green-600 dark:text-green-400" />
							{:else}
								<X class="text-red-600 dark:text-red-400" />
							{/if}
						</InputGroup.Addon>
					{/if}
				</InputGroup.Root>
			</div>

			<AlertDialog.Footer>
				<AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel>
				<AlertDialog.Action
					onclick={async () => {
						try {
							await createUser({
								username: createUsername,
								password: createPassword
							});

							toast.success('Nutzer erfolgreich erstellt');

							createOpen = false;

							await getUsers({ page }).refresh();
						} catch (error) {
							toast.error(
								`Fehler beim Erstellen von Nutzer: ${(error as any).body?.message ?? 'Unknown Error'}`
							);
						}
					}}
					disabled={!!createUser.pending}
				>
					{#if !!createUser.pending}
						<Spinner />
					{:else}
						<UserPlus />
					{/if}
					Erstellen
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

<div class="my-2 space-y-4">
	{#await await getUsers({ page }) then users}
		{#if users}
			<DataTable users={users.page} />
		{/if}
	{/await}
</div>
