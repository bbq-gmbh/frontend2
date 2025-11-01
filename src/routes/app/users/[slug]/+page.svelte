<script lang="ts">
	import { Check, IdCardLanyard, Pen, Save, Star, UserIcon, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	import * as InputGroup from '#/ui/input-group';
	import * as AlertDialog from '#/ui/alert-dialog';
	import * as Card from '#/ui/card';

	import Button from '#/ui/button/button.svelte';
	import { Input } from '#/ui/input';
	import Label from '#/ui/label/label.svelte';
	import type { LayoutData, PageData } from './$types';
	import UserNameAvatar from '#/user-name-avatar.svelte';

	import { editUser } from './user.remote';
	import { Spinner } from '#/ui/spinner';
	import Switch from '#/ui/switch/switch.svelte';
	import { Badge } from '#/ui/badge';

	const { data, ldata }: { data: PageData, ldata: LayoutData } = $props();
	const { user } = data;
  const { pathUserId } = ldata;

  

	let editing = $state(false);
</script>

<div class="mb-4 flex gap-2">
	<UserNameAvatar {user} />
	{#if !editing}
		<Button
			variant="outline"
			class="ml-auto"
			onclick={() => {
				editing = true;
			}}
		>
			<Pen />
			Edit
		</Button>
	{:else}
		<AlertDialog.Root>
			<AlertDialog.Trigger class="ml-auto">
				{#snippet child({ props })}
					<Button {...props} variant="outline">
						<Save />
						Speichen
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
									username: 'snu_pingas'
								});
								toast.success('Änderungen erfolgreich gespeichert');
								editing = false;
							} catch (error) {
								toast.error('Fehler beim Speichern der Änderungen');
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
		<Button
			variant="outline"
			onclick={() => {
				editing = false;
			}}
		>
			<X />
			Abbrechen
		</Button>
	{/if}
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
					<InputGroup.Input value={user.username} readonly={!editing} />
					<InputGroup.Addon align="inline-end">
						{#if !editing}
							<UserIcon />
						{:else if true}
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
				<!-- <Label>Ist Superuser</Label>
				<InputGroup.Root>
					<InputGroup.Input value={user.is_superuser} disabled={editing} readonly />
					<InputGroup.Addon align="inline-end">
						<Star />
					</InputGroup.Addon>
				</InputGroup.Root> -->
				<Switch disabled={editing} bind:checked={() => user.is_superuser, () => {}} />
				<Label class="flex gap-1 items-center">
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
			<Card.Title>Angestellter</Card.Title>
		</Card.Header>
		<Card.Content class="max-w-[40rem] space-y-6">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label>Vorname</Label>
					<InputGroup.Root>
						<InputGroup.Input
							value={user.employee?.first_name}
							disabled={!user.employee}
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
							value={user.employee?.first_name}
							disabled={!user.employee}
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
		</Card.Content>
	</Card.Root>
</div>
