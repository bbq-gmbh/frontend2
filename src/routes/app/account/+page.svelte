<script lang="ts">
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';

	import { KeyRound, LogOut, Pen, SquarePen, UserIcon, X } from 'lucide-svelte';

	import * as InputGroup from '#/ui/input-group';
	import * as Dialog from '#/ui/dialog';
	import * as Card from '#/ui/card';

	import Button from '#/ui/button/button.svelte';
	import Label from '#/ui/label/label.svelte';

	import UserNameAvatar from '#/user-name-avatar.svelte';

	import { logoutFromAllDevices } from './account.remote';
	import { Input } from '#/ui/input';

	let { data }: { data: PageServerData } = $props();
	let { user } = data;
</script>

<div class="max-w-[40rem] space-y-4">
	<Card.Root class="bg-transparent">
		<Card.Header>
			<Card.Title>Account</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-6">
			<div class="flex flex-wrap items-center gap-4">
				<UserNameAvatar {user} />
				{#if user.is_superuser}
					<Button
						variant="outline"
						size="sm"
						class="ml-auto"
						onclick={() => goto(`/app/users/${user.id}`)}
					>
						<Pen />
						Bearbeiten
					</Button>
				{/if}
			</div>
			<div class="flex flex-col gap-2">
				<Label>Username</Label>
				<InputGroup.Root>
					<InputGroup.Input value={user.username} readonly={true} />
					<InputGroup.Addon align="inline-end">
						<UserIcon />
					</InputGroup.Addon>
				</InputGroup.Root>
			</div>
			<div class="flex flex-col gap-2">
				<Label>Passwort</Label>
				<InputGroup.Root class="gap-1">
					<InputGroup.Input
						value="123456789012345"
						class="mask-r-to-30%"
						type="password"
						readonly={true}
					/>
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button variant="secondary" onclick={() => goto('/change-password')}>
							<SquarePen />
							Passwort ändern
						</InputGroup.Button>
					</InputGroup.Addon>
					<InputGroup.Addon align="inline-end">
						<KeyRound />
					</InputGroup.Addon>
				</InputGroup.Root>
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
								value={user.employee.first_name}
								placeholder="&ndash;"
								readonly={true}
							/>
						</InputGroup.Root>
					</div>
					<div class="space-y-2">
						<Label>Nachname</Label>
						<InputGroup.Root>
							<InputGroup.Input
								value={user.employee.last_name}
								placeholder="&ndash;"
								readonly={true}
							/>
						</InputGroup.Root>
					</div>
				</div>
				<div class="space-y-2">
					<Label>Geburtsdatum</Label>
					<Input
						value={new Date(user.employee.birthday).toLocaleDateString('de-DE')}
						placeholder="&ndash;"
						readonly
					/>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<Card.Root class="bg-transparent">
		<Card.Header>
			<Card.Title>Sessions</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-6">
			<div class="flex flex-wrap gap-2">
				<Dialog.Root>
					<Dialog.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline">
								<LogOut />
								Ausloggen
							</Button>
						{/snippet}
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Ausloggen?</Dialog.Title>
						</Dialog.Header>
						<Dialog.Footer>
							<Dialog.Close>
								<Button variant="outline">
									<X />
									Abbrechen
								</Button>
							</Dialog.Close>
							<Button onclick={() => goto('/logout')}>
								<LogOut />
								Ausloggen
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>

				<Dialog.Root>
					<Dialog.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline">
								<LogOut />
								Überall ausloggen
							</Button>
						{/snippet}
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Von allen Geräten ausloggen?</Dialog.Title>
							<Dialog.Description>
								Nach dieser Aktion werden alle eingeloggten Geräte ausgeloggt.
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer>
							<Dialog.Close>
								<Button variant="outline">
									<X />
									Abbrechen
								</Button>
							</Dialog.Close>
							<Button
								onclick={async () => {
									await logoutFromAllDevices();

									await goto('/login');
								}}
							>
								<LogOut />
								Ausloggen
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</Card.Content>
	</Card.Root>
</div>
