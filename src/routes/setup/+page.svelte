<script lang="ts">
	import TimeZoneSelector from '#/time-zone-selector.svelte';
	import * as Card from '#/ui/card';
	import Spinner from '#/ui/spinner/spinner.svelte';
	import Button from '#/ui/button/button.svelte';
	import Input from '#/ui/input/input.svelte';
	import Label from '#/ui/label/label.svelte';

	import { setupCreate } from './setup.remote';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let timezone = $state('');
	let username = $state('');
	let password = $state('');
</script>

<div class="space-y-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>Zeitzone setzen</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-6">
			<div class="grid gap-2">
				<Label for="username">Zeitzone</Label>
				<TimeZoneSelector bind:value={timezone} />
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Superuser einrichten</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-6">
			<div class="grid gap-2">
				<Label for="username">Username</Label>
				<Input id="username" bind:value={username} disabled={!!setupCreate.pending} required />
			</div>
			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input
					id="password"
					type="password"
					bind:value={password}
					disabled={!!setupCreate.pending}
					required
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<div class="flex justify-end">
		<Button
			variant="default"
			disabled={!!setupCreate.pending}
			onclick={async () => {
				try {
					await setupCreate({
						username,
						password,
						timezone
					});
					toast.info('Application Einrichtung erfolgreich');

          await goto("/login");
				} catch (error: any) {
          console.log(JSON.stringify(error))
          toast.error(`Fehler beim einrichten: ${error?.body?.message ?? "Unbekannt"}`);
          return;
				}
			}}
		>
			{#if !!setupCreate.pending}
				<Spinner />
			{/if}
			Jetzt einrichten
		</Button>
	</div>
</div>
