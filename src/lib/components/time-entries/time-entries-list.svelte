<script lang="ts">
	import { CalendarDate } from '@internationalized/date';

	import { Plus } from 'lucide-svelte';

	import { Button } from '#/ui/button';
	import { ScrollArea } from '#/ui/scroll-area';
	import { Badge } from '#/ui/badge';

	import * as Card from '#/ui/card';
	import * as Table from '#/ui/table';

	import UserNameAvatar from '#/user-name-avatar.svelte';

	import { getTimeEntriesForDay } from './time-entries.remote';

	let { selectedDay = $bindable(undefined), user_id }: { selectedDay?: Date; user_id: string } =
		$props();
</script>

<div class="flex flex-col gap-6">
	<Card.Root class="bg-transparent p-4">
		<Card.Content class="flex flex-col gap-4 p-0">
			<div class="flex flex-wrap justify-end">
				<Button variant="outline" class="ml-auto">
					<Plus />
					Neu erstellen
				</Button>
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
								</Table.Row>
							</Table.Header>
							<Table.Body class="**:data-[slot=table-cell]:first:w-8">
								{#each timeEntries as timeEntryPair}
									{@const timeEntry = timeEntryPair.timeEntry}
									<Table.Row class="h-12">
										<Table.Cell class="px-4">
											<Badge class="bg-green-600 dark:bg-green-400">{timeEntry.entry_type}</Badge>
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
