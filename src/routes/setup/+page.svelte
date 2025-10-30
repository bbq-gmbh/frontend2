<script lang="ts">
	import * as Card from '#/ui/card';
	import * as Tabs from '#/ui/tabs';

	import TimeZoneSelector from '#/time-zone-selector.svelte';
	import Spinner from '#/ui/spinner/spinner.svelte';
	import Button from '#/ui/button/button.svelte';
	import Input from '#/ui/input/input.svelte';
	import Label from '#/ui/label/label.svelte';

	import { setupCreate } from './setup.remote';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { ArrowRight } from 'lucide-svelte';

	let timezone = $state('');
	let username = $state('');
	let password = $state('');

	let tabIndex = $state('0');
</script>

<Tabs.Root bind:value={tabIndex} class="min-h-[30rem]">
	<Tabs.List>
		<Tabs.Trigger value="0">Start</Tabs.Trigger>
		<Tabs.Trigger value="1">Zeitzone</Tabs.Trigger>
		<Tabs.Trigger value="2">Account</Tabs.Trigger>
		<Tabs.Trigger value="3">Überprüfen</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="0" class="flex flex-col">
		<Card.Root class="grow">
			<Card.Header>
				<Card.Title>Zeiterfassungsanwendung einrichten</Card.Title>
			</Card.Header>
			<Card.Content class="flex grow flex-col gap-6">
				<Button class="mt-auto self-end" onclick={() => (tabIndex = '1')}>
					Weiter
					<ArrowRight />
				</Button>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="1" class="flex flex-col">
		<Card.Root class="grow">
			<Card.Header>
				<Card.Title>Zeitzone</Card.Title>
			</Card.Header>
			<Card.Content class="flex grow flex-col gap-6">
				<div class="grid grid-cols-2">
					<Label for="username">Zeitzone</Label>
					<div class="ml-auto">
						<TimeZoneSelector bind:value={timezone} />
					</div>
				</div>
				<Button class="mt-auto self-end" onclick={() => (tabIndex = '2')}>
					Weiter
					<ArrowRight />
				</Button>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>

<div class="hidden space-y-6">
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
					toast.success('Application Einrichtung erfolgreich');

					await goto('/login');
				} catch (error: any) {
					console.log(JSON.stringify(error));
					toast.error(`Fehler beim einrichten: ${error?.body?.message ?? 'Unbekannt'}`);
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
