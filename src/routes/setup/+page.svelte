<script lang="ts">
	import { z } from 'zod';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	import { ArrowRight, Check, KeyRound, UserIcon, X } from 'lucide-svelte';

	import * as Card from '#/ui/card';
	import * as Tabs from '#/ui/tabs';
	import * as InputGroup from '#/ui/input-group';
	import * as Tooltip from '#/ui/tooltip';

	import TimeZoneSelector from '#/time-zone-selector.svelte';
	import Spinner from '#/ui/spinner/spinner.svelte';
	import Button from '#/ui/button/button.svelte';
	import Input from '#/ui/input/input.svelte';
	import Label from '#/ui/label/label.svelte';

	import { setupCreate } from './setup.remote';

	let timezone = $state('');

	let username = $state('');
	let usernameZod = $derived.by(() => {
		const usernameSchema = z
			.string('Username is required')
			.min(1, 'Username cannot be empty')
			.min(4, 'Username must be at least 4 characters')
			.regex(/^\S+$/, 'Username cannot contain spaces');

		return usernameSchema.safeParse(username);
	});
	let usernameOk = $derived.by(() => {
		if (username.length === 0) return null;
		if (username.length < 4) return false;

		return usernameZod.success;
	});

	let password = $state('');
	let passwordOk = $derived.by(() => {
		if (password.length === 0) return null;
		if (password.length < 8) return false;

		return true;
	});

	let passwordRepeat = $state('');
	let passwordRepeatOk = $derived.by(() => {
		if (passwordRepeat.length === 0) return null;
		if (passwordOk !== true) return null;

		return password === passwordRepeat;
	});

	let submitOk = $derived.by(() => {
		return timezone.length > 0 && usernameOk && passwordOk && passwordRepeatOk;
	});

	let tabIndex = $state('0');
</script>

<form>
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
					<div class="flex flex-col gap-2">
						<div class="flex flex-wrap justify-between gap-x-8 gap-y-2">
							<Label for="timezone">Zeitzone</Label>
							<div>
								<TimeZoneSelector name="timezone" bind:value={timezone} />
							</div>
						</div>
						<p class="text-sm text-muted-foreground">
							Diese Einstellung ist permanent und kann später nicht geändert werden
						</p>
					</div>
					<Button class="mt-auto self-end" onclick={() => (tabIndex = '2')}>
						Weiter
						<ArrowRight />
					</Button>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<Tabs.Content value="2" class="flex flex-col">
			<Card.Root class="grow">
				<Card.Header>
					<Card.Title>Superuser erstellen</Card.Title>
				</Card.Header>
				<Card.Content class="flex grow flex-col gap-6">
					<div class="flex flex-wrap justify-between gap-x-8 gap-y-2">
						<Label for="username">Username</Label>
						<div class="max-w-[16rem] grow">
							<InputGroup.Root>
								<InputGroup.Root>
									<InputGroup.Input name="username" bind:value={username} />
									<InputGroup.Addon align="inline-end">
										{#if username.length === 0}
											<UserIcon />
										{:else if usernameOk}
											<Check class="text-green-600 dark:text-green-400" />
										{:else}
											<Tooltip.Provider>
												<Tooltip.Root>
													<Tooltip.Trigger>
														{#snippet child({ props })}
															<X {...props} class="text-red-600 dark:text-red-400" />
														{/snippet}
													</Tooltip.Trigger>
													{#if usernameZod.error && usernameZod.error.issues.length > 0}
														<Tooltip.Content>
															{usernameZod.error.issues[0].message}
														</Tooltip.Content>
													{/if}
												</Tooltip.Root>
											</Tooltip.Provider>
										{/if}
									</InputGroup.Addon>
								</InputGroup.Root>
							</InputGroup.Root>
						</div>
					</div>

					<div class="flex flex-wrap justify-between gap-x-8 gap-y-2">
						<Label for="password">Passwort</Label>
						<div class="max-w-[16rem] grow">
							<InputGroup.Root>
								<InputGroup.Root>
									<InputGroup.Input name="password" bind:value={password} type="password" />
									<InputGroup.Addon align="inline-end">
										{#if passwordOk === null}
											<KeyRound />
										{:else if passwordOk === true}
											<Check class="text-green-600 dark:text-green-400" />
										{:else}
											<X class="text-red-600 dark:text-red-400" />
										{/if}
									</InputGroup.Addon>
								</InputGroup.Root>
							</InputGroup.Root>
						</div>
					</div>

					<div class="flex flex-wrap justify-between gap-x-8 gap-y-2">
						<Label for="password">Passwort Wiederholen</Label>
						<div class="max-w-[16rem] grow">
							<InputGroup.Root>
								<InputGroup.Root>
									<InputGroup.Input name="password" bind:value={passwordRepeat} type="password" />
									<InputGroup.Addon align="inline-end">
										{#if passwordRepeatOk === null}
											<KeyRound />
										{:else if passwordRepeatOk === true}
											<Check class="text-green-600 dark:text-green-400" />
										{:else if passwordOk === true}
											<X class="text-red-600 dark:text-red-400" />
										{:else}
											<KeyRound />
										{/if}
									</InputGroup.Addon>
								</InputGroup.Root>
							</InputGroup.Root>
						</div>
					</div>

					<Button class="mt-auto self-end" onclick={() => (tabIndex = '3')}>
						Weiter
						<ArrowRight />
					</Button>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<Tabs.Content value="3" class="flex flex-col">
			<Card.Root class="grow">
				<Card.Header>
					<Card.Title>Einrichtung abschließen</Card.Title>
				</Card.Header>
				<Card.Content class="flex grow flex-col gap-6">
					<div class="grid grid-cols-[10rem_auto]">
						<div class="">Zeitzone</div>
						<div class="font-bold">
							{timezone}
						</div>
					</div>
					<div class="grid grid-cols-[10rem_auto]">
						<div class="">Superuser Account</div>
						<div class="font-bold">
							{#if usernameOk}
								{username}
							{/if}
							{#if usernameOk && passwordRepeatOk}
								<div class="text-green-600 dark:text-green-400">&#x2713;</div>
							{:else}
								<div class="text-red-600 dark:text-red-400">&#x2715;</div>
							{/if}
						</div>
					</div>
				</Card.Content>
				<Card.Footer>
					<Button class="ml-auto self-end" type="submit" disabled={!submitOk}>
						<Check />
						Jetzt abschließen
					</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</form>

<!-- <div class="hidden space-y-6">
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
</div> -->
