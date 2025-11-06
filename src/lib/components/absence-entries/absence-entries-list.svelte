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

	import {
		createAbsenceEntry,
		deleteAbsenceEntry,
		getAbsenceEntriesForDay
	} from './absence-entries.remote';
	import Label from '#/ui/label/label.svelte';
	import { Input } from '#/ui/input';
	import { toast } from 'svelte-sonner';
	import { Spinner } from '#/ui/spinner';
	import type { User } from '@/types/auth';

	const dateTimeFormatted = new Intl.DateTimeFormat('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	const dateFormatter = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Berlin',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

	let {
		selectedDay = $bindable(undefined),
		user_id,
		asSuperuser = false,
		readonly = false
	}: { selectedDay?: Date; user_id: string; asSuperuser: boolean; readonly: boolean } = $props();

	let createNewDialog;
	let createNewDialogOpen = $state(false);

	const allAbsenceTypes = [
		{ value: 'vacation', label: 'Urlaub', className: 'bg-green-600 dark:bg-green-400' },
		{ value: 'sickness', label: 'Krankheit', className: 'bg-indigo-600 dark:bg-indigo-400' },
		{ value: 'other', label: 'Other', className: 'bg-yellow-600 dark:bg-yellow-400' }
	];
	function isAbsenceTypeVisible(val: string) {
		return asSuperuser ? true : val !== 'other';
	}

	let createNewDialogEntryTypeSelected: string | undefined = $state(undefined);
	let createNewDialogDateBegin: string | undefined = $state(undefined);
	let createNewDialogDateEnd: string | undefined = $state(undefined);

	let createNewDialogAllowAdd = $derived.by(() => {
		if (
			createNewDialogEntryTypeSelected === undefined ||
			allAbsenceTypes.find((item) => item.value === createNewDialogEntryTypeSelected) === undefined
		)
			return false;

		if (createNewDialogDateBegin === undefined || createNewDialogDateBegin === '') return false;
		if (createNewDialogDateEnd === undefined || createNewDialogDateEnd === '') return false;

		return true;
	});

	function createNewDialogResetDateBegin() {
		createNewDialogDateBegin = selectedDay ? dateFormatter.format(selectedDay) : undefined;
	}

	function createNewDialogResetDateEnd() {
		createNewDialogDateEnd = selectedDay ? dateFormatter.format(selectedDay) : undefined;
	}

	function createNewDialogSetDateEndBegin() {
		createNewDialogDateEnd = createNewDialogDateBegin;
	}

	function createNewDialogOnClickReset() {
		createNewDialogEntryTypeSelected = undefined;
		createNewDialogResetDateBegin();
		createNewDialogResetDateEnd();
	}
</script>

<div class="flex flex-col gap-6">
	<Card.Root class="bg-transparent p-4">
		<Card.Content class="flex flex-col gap-4 p-0">
			<div class="flex flex-wrap items-center justify-end gap-4">
				<span class="font-bold"> Abwesendheitseinträge </span>
				<span class="mr-auto">
					{selectedDay?.toLocaleDateString('de-DE')}
				</span>
				{#if !readonly}
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
								<Dialog.Title>Neuen Abwesendheitseintrag erstellen</Dialog.Title>
							</Dialog.Header>

							<div class="space-y-2">
								<Label>Eintragsart</Label>
								<Select.Root
									bind:value={createNewDialogEntryTypeSelected}
									type="single"
									disabled={!!createAbsenceEntry.pending}
								>
									<Select.Trigger class="min-w-[14rem]">
										{allAbsenceTypes.find((item) => item.value === createNewDialogEntryTypeSelected)
											?.label ?? 'Eintragsart'}
									</Select.Trigger>
									<Select.Content>
										{#each allAbsenceTypes as i}
											{#if isAbsenceTypeVisible(i.value)}
												<Select.Item value={i.value} label={i.label}>
													{i.label}
												</Select.Item>
											{/if}
										{/each}
									</Select.Content>
								</Select.Root>
							</div>

							<div class="space-y-2">
								<Label>Beginn Datum</Label>
								<InputGroup.Root>
									<InputGroup.Input
										bind:value={createNewDialogDateBegin}
										type="date"
										disabled={!!createAbsenceEntry.pending}
									/>
									<InputGroup.Addon align="inline-end">
										<InputGroup.Button
											onclick={createNewDialogResetDateBegin}
											disabled={!!createAbsenceEntry.pending}
										>
											Heute
										</InputGroup.Button>
									</InputGroup.Addon>
								</InputGroup.Root>
							</div>

							<div class="space-y-2">
								<Label>Ende Datum</Label>
								<InputGroup.Root>
									<InputGroup.Input
										bind:value={createNewDialogDateEnd}
										type="date"
										disabled={!!createAbsenceEntry.pending}
									/>
									<InputGroup.Addon align="inline-end">
										<InputGroup.Button
											onclick={createNewDialogResetDateEnd}
											disabled={!!createAbsenceEntry.pending}
										>
											Heute
										</InputGroup.Button>
										<InputGroup.Button
											onclick={createNewDialogSetDateEndBegin}
											disabled={!!createAbsenceEntry.pending}
										>
											Wie Beginn
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
											disabled={!createNewDialogAllowAdd || !!createAbsenceEntry.pending}
											onclick={async () => {
												try {
													if (
														createNewDialogDateBegin === undefined ||
														createNewDialogDateEnd === undefined
													) {
														toast.error('Unerwarteter Fehler');
														return;
													}

													await createAbsenceEntry({
														user_id,
														date_begin: createNewDialogDateBegin,
														date_end: createNewDialogDateEnd,
														entryType: createNewDialogEntryTypeSelected as any,
														asSuperuser
													});
													createNewDialogOpen = false;

													toast.success('Abwesendheitseintrag erfolgreich erstellt');

													if (selectedDay) {
														await getAbsenceEntriesForDay({
															day: selectedDay,
															user_id: user_id
														}).refresh();
													}
												} catch (error) {
													toast.error(
														`Fehler beim Erstellen vom Abwesendheitseintrag: ${(error as any).body?.message ?? 'Unknown Error'}`
													);
												}
											}}
										>
											{#if !!createAbsenceEntry.pending}
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
				{/if}
			</div>
			<div class="overflow-x-auto rounded-md border border-border whitespace-nowrap">
				{#if selectedDay}
					{#await getAbsenceEntriesForDay({ day: selectedDay, user_id: user_id })}
						<div class="p-4 text-muted-foreground">Loading...</div>
					{:then absenceEntries}
						<Table.Root>
							<Table.Header>
								<Table.Row class="h-12">
									<Table.Head class="px-4">Typ</Table.Head>
									<Table.Head class="px-2">Beginn</Table.Head>
									<Table.Head class="px-2">Ende</Table.Head>
									<Table.Head class="pr-2 pl-4">Erstellt am</Table.Head>
									<Table.Head class="px-2">Erstellt von</Table.Head>
									<Table.Head class="px-4"></Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body class="**:data-[slot=table-cell]:first:w-8">
								{#each absenceEntries as absenceEntryPair}
									{@const absenceEntry = absenceEntryPair.absenceEntry}
									<Table.Row class="h-12">
										<Table.Cell class="px-4">
											{@const absenceType = allAbsenceTypes.find(
												(item) => item.value === absenceEntry.entry_type
											)}
											{#if absenceType}
												<Badge class={absenceType.className}>
													{absenceType.label}
												</Badge>
											{/if}
										</Table.Cell>
										<Table.Cell class="px-2">
											<span class="font-bold">
												{new Date(absenceEntry.date_begin).toLocaleDateString('de-DE')}
											</span>
										</Table.Cell>
										<Table.Cell class="px-2">
											<span class="font-bold">
												{new Date(absenceEntry.date_end).toLocaleDateString('de-DE')}
											</span>
										</Table.Cell>
										<Table.Cell class="pr-2 pl-4">
											{#if absenceEntry.created_at}
												<span class="font-normal">
													{dateTimeFormatted.format(new Date(absenceEntry.created_at))}
												</span>
											{/if}
										</Table.Cell>
										<Table.Cell class="w-full min-w-[10rem] px-2">
											<div>
												{#if absenceEntryPair.createdBy}
													<UserNameAvatar user={absenceEntryPair.createdBy} />
												{/if}
											</div>
										</Table.Cell>

										<Table.Cell class="px-4">
											{#if absenceEntry.id && !readonly}
												<Button
													size="icon-sm"
													variant="ghost"
													onclick={async () => {
														try {
															if (absenceEntry.id === undefined || absenceEntry.id === null) return;

															await deleteAbsenceEntry({
																id: absenceEntry.id,
																asSuperuser
															});

															toast.success('Abwesendheitseintrag erfolgreich gelöscht');

															if (selectedDay) {
																await getAbsenceEntriesForDay({
																	day: selectedDay,
																	user_id: user_id
																}).refresh();
															}
														} catch (error) {
															toast.error(
																`Fehler beim Löschen vom Abwesendheitseintrag: ${(error as any).body?.message ?? 'Unknown Error'}`
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
