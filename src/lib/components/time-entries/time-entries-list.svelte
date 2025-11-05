<script lang="ts">
	import { CalendarDate } from '@internationalized/date';

	import { Plus, X } from 'lucide-svelte';

	import { Button } from '#/ui/button';
	import { ScrollArea } from '#/ui/scroll-area';
	import { Badge } from '#/ui/badge';

	import * as Card from '#/ui/card';
	import * as Table from '#/ui/table';
	import * as Dialog from '#/ui/alert-dialog';
	import * as Select from '#/ui/select';
	import * as InputGroup from '#/ui/input-group';

	import UserNameAvatar from '#/user-name-avatar.svelte';

	import { createTimeEntry, deleteTimeEntry, getTimeEntriesForDay } from './time-entries.remote';
	import Label from '#/ui/label/label.svelte';
	import { Input } from '#/ui/input';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '#/ui/spinner';
	import type { User } from '@/types/auth';

	const dateFormatter = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Berlin',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

	let {
		selectedDay = $bindable(undefined),
		user_id,
		asSuperuser = false
	}: { selectedDay?: Date; user_id: string; asSuperuser: boolean } = $props();

	let createNewDialog;
	let createNewDialogOpen = $state(false);

	const allEntryTypes = [
		{ value: 'arrival', label: 'Kommen', className: 'bg-green-600 dark:bg-green-400' },
		{ value: 'departure', label: 'Gehen', className: 'bg-indigo-600 dark:bg-indigo-400' }
	];
	let createNewDialogEntryTypeSelected: string | undefined = $state(undefined);
	let createNewDialogDate: string | undefined = $state(undefined);
	let createNewDialogTime: string | undefined = $state(undefined);

	let createNewDialogAllowAdd = $derived.by(() => {
		if (
			createNewDialogEntryTypeSelected === undefined ||
			allEntryTypes.find((item) => item.value === createNewDialogEntryTypeSelected) === undefined
		)
			return false;

		if (createNewDialogDate === undefined || createNewDialogDate === '') return false;
		if (createNewDialogTime === undefined || createNewDialogTime === '') return false;

		return true;
	});

	function createNewDialogResetDate() {
		createNewDialogDate = selectedDay ? dateFormatter.format(selectedDay) : undefined;
	}

	function createNewDialogResetTime() {
		createNewDialogTime = new Date().toLocaleString('en-US', {
			timeZone: 'Europe/Berlin',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	function createNewDialogOnClickReset() {
		createNewDialogEntryTypeSelected = undefined;
		createNewDialogResetDate();
		createNewDialogResetTime();
	}

	//$inspect(createNewDialogDate, createNewDialogTime);
</script>

<div class="flex flex-col gap-6">
	<Card.Root class="bg-transparent p-4">
		<Card.Content class="flex flex-col gap-4 p-0">
			<div class="flex flex-wrap items-center justify-end">
				<span class="mr-auto">
					{selectedDay?.toLocaleDateString('de-DE')}
				</span>
				<Dialog.Root
					bind:this={createNewDialog}
					onOpenChange={(_) => createNewDialogOnClickReset()}
					bind:open={createNewDialogOpen}
				>
					<Dialog.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" class="ml-auto">
								<Plus />
								Neu erstellen
							</Button>
						{/snippet}
					</Dialog.Trigger>
					<Dialog.Content interactOutsideBehavior="close" class="space-y-6">
						<Dialog.Header>
							<Dialog.Title>Neuen Zeiteintrag erstellen</Dialog.Title>
						</Dialog.Header>

						<div class="space-y-2">
							<Label>Eintragsart</Label>
							<Select.Root
								bind:value={createNewDialogEntryTypeSelected}
								type="single"
								disabled={!!createTimeEntry.pending}
							>
								<Select.Trigger class="min-w-[14rem]">
									{allEntryTypes.find((item) => item.value === createNewDialogEntryTypeSelected)
										?.label ?? 'Eintragsart'}
								</Select.Trigger>
								<Select.Content>
									{#each allEntryTypes as i}
										<Select.Item value={i.value} label={i.label}>
											{i.label}
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<div class="space-y-2">
							<Label>Datum</Label>
							<InputGroup.Root>
								<InputGroup.Input
									bind:value={createNewDialogDate}
									type="date"
									disabled={!!createTimeEntry.pending}
								/>
								<InputGroup.Addon align="inline-end">
									<InputGroup.Button
										onclick={createNewDialogResetDate}
										disabled={!!createTimeEntry.pending}
									>
										Heute
									</InputGroup.Button>
								</InputGroup.Addon>
							</InputGroup.Root>
						</div>

						<div class="space-y-2">
							<Label>Uhrzeit</Label>
							<InputGroup.Root>
								<InputGroup.Input
									bind:value={createNewDialogTime}
									type="time"
									disabled={!!createTimeEntry.pending}
								/>
								<InputGroup.Addon align="inline-end">
									<InputGroup.Button
										onclick={createNewDialogResetTime}
										disabled={!!createTimeEntry.pending}
									>
										Jetzt
									</InputGroup.Button>
								</InputGroup.Addon>
							</InputGroup.Root>
						</div>

						<Dialog.Footer>
							<Dialog.Cancel>Abbrechen</Dialog.Cancel>
							<Dialog.Action>
								{#snippet child({ props })}
									<Button
										{...props}
										disabled={!createNewDialogAllowAdd || !!createTimeEntry.pending}
										onclick={async () => {
											try {
												await createTimeEntry({
													user_id,
													dateTime: `${createNewDialogDate}T${createNewDialogTime}Z`,
													entryType: createNewDialogEntryTypeSelected as any,
													asSuperuser
												});
												createNewDialogOpen = false;

												toast.success('Zeiteintrag erfolgreich erstellt');

												if (selectedDay) {
													await getTimeEntriesForDay({
														day: selectedDay,
														user_id: user_id
													}).refresh();
												}
											} catch (error) {
												toast.error(
													`Fehler beim Erstellen vom Zeiteintrag: ${(error as any).body?.message ?? 'Unknown Error'}`
												);
											}
										}}
									>
										{#if !!createTimeEntry.pending}
											<Spinner />
										{:else}
											<Plus />
										{/if}
										Erstellen
									</Button>
								{/snippet}
							</Dialog.Action>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			</div>
			<div class="overflow-x-auto rounded-md border border-border whitespace-nowrap">
				{#if selectedDay}
					{#await getTimeEntriesForDay({ day: selectedDay, user_id: user_id })}
						<div class="p-4 text-muted-foreground">Loading...</div>
					{:then timeEntries}
						<Table.Root>
							<Table.Header>
								<Table.Row class="h-12">
									<Table.Head class="px-4">Typ</Table.Head>
									<Table.Head class="px-2">Zeit</Table.Head>
									<Table.Head class="pr-2 pl-4">Erstellt am</Table.Head>
									<Table.Head class="px-2">Erstellt von</Table.Head>
									<Table.Head class="px-4"></Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body class="**:data-[slot=table-cell]:first:w-8">
								{#each timeEntries as timeEntryPair}
									{@const timeEntry = timeEntryPair.timeEntry}
									<Table.Row class="h-12">
										<Table.Cell class="px-4">
											{@const entryType = allEntryTypes.find(
												(item) => item.value === timeEntry.entry_type
											)}
											{#if entryType}
												<Badge class={entryType.className}>
													{entryType.label}
												</Badge>
											{/if}
										</Table.Cell>
										<Table.Cell class="px-2">
											<span class="font-bold">
												{new Date(timeEntry.date_time).toLocaleTimeString('de-DE', {
													hour: '2-digit',
													minute: '2-digit',
													hour12: false
												})}
											</span>
										</Table.Cell>
										<Table.Cell class="pr-2 pl-4">
											{#if timeEntry.created_at}
												<span class="font-normal">
													{new Date(timeEntry.created_at).toLocaleTimeString('de-DE', {
														hour: '2-digit',
														minute: '2-digit',
														hour12: false
													})}
												</span>
											{/if}
										</Table.Cell>
										<Table.Cell class="w-full px-2">
											<div>
												{#if timeEntryPair.createdBy}
													<UserNameAvatar user={timeEntryPair.createdBy} />
												{/if}
											</div>
										</Table.Cell>

										<Table.Cell class="px-4">
											{#if timeEntry.id}
												<Button
													size="icon-sm" variant="ghost"
													onclick={async () => {
														try {
															if (timeEntry.id === undefined || timeEntry.id === null) return;

															await deleteTimeEntry({
																id: timeEntry.id,
																asSuperuser
															});

															toast.success('Zeiteintrag erfolgreich gelöscht');

															if (selectedDay) {
																await getTimeEntriesForDay({
																	day: selectedDay,
																	user_id: user_id
																}).refresh();
															}
														} catch (error) {
															toast.error(
																`Fehler beim Löschen vom Zeiteintrag: ${(error as any).body?.message ?? 'Unknown Error'}`
															);
														}
													}}
												>
													<X />
												</Button>
											{/if}
										</Table.Cell>
									</Table.Row>
								{/each}

								<!-- <Table.Row class="h-12">
							<Table.Cell class="px-4">
								<Badge class="bg-green-600 dark:bg-green-400">Kommen</Badge>
							</Table.Cell>
							<Table.Cell class="px-2">
								<span class="font-bold"> 10:30 </span>
							</Table.Cell>
							<Table.Cell class="pr-2 pl-4">
								<span class="font-normal"> 10:30 </span>
							</Table.Cell>
							<Table.Cell class="w-full px-2">
								<div>
									<UserNameAvatar
										user={{
											created_at: '',
											id: '',
											is_superuser: false,
											username: 'eric_cartman'
										}}
									/>
								</div>
							</Table.Cell>
						</Table.Row>
						<Table.Row class="h-12">
							<Table.Cell class="px-4">
								<Badge class="bg-indigo-600 dark:bg-indigo-400">Gehen</Badge>
							</Table.Cell>
							<Table.Cell class="px-2">
								<span class="font-bold"> 10:30 </span>
							</Table.Cell>
							<Table.Cell class="pr-2 pl-4">
								<span class="font-normal"> 10:30 </span>
							</Table.Cell>
							<Table.Cell class="w-full px-2">
								<div>
									<UserNameAvatar
										user={{
											created_at: '',
											id: '',
											is_superuser: false,
											username: 'eric_cartman'
										}}
									/>
								</div>
							</Table.Cell>
						</Table.Row> -->
							</Table.Body>
						</Table.Root>
					{/await}
				{:else}
					<div class="p-4 text-muted-foreground">No day selected</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
</div>
