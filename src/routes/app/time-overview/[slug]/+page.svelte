<script lang="ts">
	import type { PageData } from './$types';

	import { CalendarDate, parseDate } from '@internationalized/date';

	import * as Card from '#/ui/card';
	import * as Table from '#/ui/table';

	import { calculateOverview, getEmployeeById, getUserById } from '../time-overview.remote';
	import UserNameAvatar from '#/user-name-avatar.svelte';
	import { Badge } from '#/ui/badge';
	import { TriangleAlert } from 'lucide-svelte';

	const dateTimeFormatted = new Intl.DateTimeFormat('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	let { data }: { data: PageData } = $props();
	let { userId, dateRangeStr } = data;

	let dateRange = $derived({
		start: parseDate(dateRangeStr.start),
		end: parseDate(dateRangeStr.end)
	});

	function formatDate(date: CalendarDate) {
		return `${date.day}.${date.month}.${date.year}`;
	}

	function toDateRangeStr(start: CalendarDate, end: CalendarDate) {
		return `${formatDate(start)} – ${formatDate(end)}`;
	}

	let calcOverview = $derived(
		calculateOverview({
			user_id: userId,
			date_start: dateRangeStr.start,
			date_end: dateRangeStr.end
		})
	);

	function weekDayToGerman(d: number) {
		const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
		return days[d];
	}

	const allAbsenceTypes = {
		vacation: { label: 'Urlaub', className: 'bg-green-600 dark:bg-green-400' },
		sickness: { label: 'Krankheit', className: 'bg-indigo-600 dark:bg-indigo-400' },
		other: { label: 'Other', className: 'bg-yellow-600 dark:bg-yellow-400' }
	};

	const allEntryTypes = {
		arrival: { label: 'Kommen', className: 'bg-green-600 dark:bg-green-400' },
		departure: { label: 'Gehen', className: 'bg-indigo-600 dark:bg-indigo-400' }
	};
</script>

{#await calcOverview}
	<div class="text-muted-foreground">Loading...</div>
{:then { weeks, dayAmount, user, employee, serverStore, warnungen, total }}
	<div class="space-y-6">
		<Card.Root class="max-w-[40rem]">
			<Card.Header>
				<Card.Title>Zeitübersicht {toDateRangeStr(dateRange.start, dateRange.end)}</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-6">
				<UserNameAvatar {user} />

				<div class="flex flex-wrap gap-x-8 gap-y-6">
					<div class="flex flex-col text-sm">
						<div>Zeitraum</div>
						<div class="text-xl">
							{dayAmount} Tage
						</div>
					</div>

					<div class="flex flex-col text-sm">
						<div>Arbeitstage</div>
						<div class="text-xl">
							{total.totalRegularWorkdays} Tage
						</div>
					</div>
				</div>

				<div class="flex flex-wrap gap-x-8 gap-y-6">
					<div class="flex flex-col text-sm">
						<div>Reguläre Arbeitszeit (Mo-Fr)</div>
						<div class="text-lg">
							{employee.hour_model} Stunden täglich
						</div>
					</div>

					<div class="flex flex-col text-sm">
						<div>Reguläre Pausenzeit</div>
						<div class="text-lg">
							{employee.pause_time_minutes} Minuten täglich
						</div>
					</div>
				</div>

				<div class="flex flex-wrap gap-x-8 gap-y-6">
					<div class="flex flex-col text-sm">
						<div>Arbeitszeit</div>
						<div class="text-xl">
							{total.totalHoursWorked} Stunden
						</div>
					</div>

					<div class="flex flex-col text-sm">
						<div>Überstunden</div>
						<svelte:boundary>
							{@const warnungColor = (h: number) => {
								if (Math.abs(h) >= warnungen.rot) return 'dark:text-red-400 text-red-600';
								if (Math.abs(h) >= warnungen.gelb) return 'dark:text-yellow-400 text-yellow-600';
								return '';
							}}
							<div class={`text-xl font-bold ${warnungColor(total.totalOverTimeHours)}`}>
								{total.totalOverTimeHours} Stunden
							</div>
						</svelte:boundary>
					</div>
				</div>

				<div class="flex flex-wrap gap-x-8 gap-y-6">
					<div class="flex flex-col text-sm">
						<div>Abwesenheiten</div>
						<div class="text-xl">
							{#if total.totalAbsenceDays == 0}
								&ndash;
							{:else}
								{total.totalAbsenceDays} Tage
							{/if}
						</div>
					</div>

					<div class="flex flex-col text-sm">
						<div>Krankheitstage</div>
						<div class="text-xl">
							{#if total.totalSickdays == 0}
								&ndash;
							{:else}
								{total.totalSickdays} Tage
							{/if}
						</div>
					</div>

					<div class="flex flex-col text-sm">
						<div>Urlaubstage</div>
						<div class="text-xl">
							{#if total.totalVacationDays == 0}
								&ndash;
							{:else}
								{total.totalVacationDays} Tage
							{/if}
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="bg-transparent">
			<Card.Header>
				<Card.Title>Abeitszeiteinträge</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-6">
				{#each Object.entries(weeks) as [weekNumber, days]}
					<div class="flex flex-col gap-4">
						<h2 class="text-2xl">KW {weekNumber}</h2>
						{#each days as day}
							{#if (day.isWeekday && !day.isHoliday) || day.violatesRestPeriod || day.violatesSunday || day.violatesWorkHours || day.violatesWorkTimeLimit || day.timeEntries.length + day.absenceEntries.length > 0}
								<div class="flex flex-col gap-2">
									<div>
										<span>
											{weekDayToGerman(day.weekDay)}
										</span>

										{#if day.workTime > 0}
											<span class="text-muted-foreground">
												(Arbeitszeit: {day.workTime}; Pausenzeit: {day.pauseTime})
											</span>
										{/if}
									</div>
									{#if day.timeEntries.length + day.absenceEntries.length > 0}
										<div class="flex flex-col gap-2">
											{#if day.absenceEntries.length > 0}
												<div class="flex flex-col overflow-x-auto rounded-lg border">
													<Table.Root>
														<Table.Header>
															<Table.Row class="h-12">
																<Table.Head class="px-4">Typ</Table.Head>
																<Table.Head class="px-2">Beginn</Table.Head>
																<Table.Head class="px-2">Ende</Table.Head>
																<Table.Head class="pr-2 pl-4">Erstellt am</Table.Head>
																<Table.Head class="pr-4 pl-2">Erstellt von</Table.Head>
															</Table.Row>
														</Table.Header>
														<Table.Body>
															{#each day.absenceEntries as absenceEntry}
																<Table.Row class="h-12">
																	<Table.Cell class="px-4">
																		<Badge
																			class={allAbsenceTypes[absenceEntry.entry_type].className}
																		>
																			{allAbsenceTypes[absenceEntry.entry_type].label}
																		</Badge>
																	</Table.Cell>
																	<Table.Cell class="px-2">
																		<span class="font-bold">
																			{new Date(absenceEntry.date_begin).toLocaleDateString(
																				'de-DE'
																			)}
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
																				{dateTimeFormatted.format(
																					new Date(absenceEntry.created_at + 'Z')
																				)}
																			</span>
																		{/if}
																	</Table.Cell>
																	<Table.Cell class="w-full min-w-[10rem] pr-4 pl-2">
																		<div>
																			<svelte:boundary>
																				{#await getUserById(absenceEntry.created_by) then user}
																					<UserNameAvatar {user} />
																				{/await}
																			</svelte:boundary>
																		</div>
																	</Table.Cell>
																</Table.Row>
															{/each}
														</Table.Body>
													</Table.Root>
												</div>
											{/if}

											{#if day.timeEntries.length > 0}
												<div class="flex flex-col overflow-x-auto rounded-lg border">
													<Table.Root>
														<Table.Header>
															<Table.Row class="h-12">
																<Table.Head class="px-4">Typ</Table.Head>
																<Table.Head class="px-2">Zeit</Table.Head>
																<Table.Head class="pr-2 pl-4">Erstellt am</Table.Head>
																<Table.Head class="pr-4 pl-2">Erstellt von</Table.Head>
															</Table.Row>
														</Table.Header>
														<Table.Body>
															{#each day.timeEntries as timeEntry}
																<Table.Row class="h-12">
																	<Table.Cell class="px-4">
																		<Badge class={allEntryTypes[timeEntry.entry_type]?.className}>
																			{allEntryTypes[timeEntry.entry_type]?.label}
																		</Badge>
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
																				{dateTimeFormatted.format(
																					new Date(timeEntry.created_at + 'Z')
																				)}
																			</span>
																		{/if}
																	</Table.Cell>
																	<Table.Cell class="w-full min-w-[10rem] pr-4 pl-2">
																		<div>
																			<svelte:boundary>
																				{#await getUserById(timeEntry.created_by) then user}
																					<UserNameAvatar {user} />
																				{/await}
																			</svelte:boundary>
																		</div>
																	</Table.Cell>
																</Table.Row>
															{/each}
														</Table.Body>
													</Table.Root>
												</div>
											{/if}
										</div>
									{:else if day.isWeekday && !day.isHoliday}
										<div class="flex flex-col gap-2">
											<span class="flex items-center gap-4 text-sm">
												<TriangleAlert size={18} />
												Keine erfasste Arbeitszeit
											</span>
										</div>
									{/if}
									{#if day.violatesRestPeriod || day.violatesSunday || day.violatesWorkHours || day.violatesWorkTimeLimit}
										<div class="flex flex-col gap-2">
											<div class="flex gap-1 px-1">
												{#if day.violatesSunday === true}
													<span class="flex items-center gap-4 text-sm">
														<TriangleAlert size={18} class="text-red-600 dark:text-red-400" />
														Arbeitszeit ist an einem Sonntag
													</span>
												{/if}
												{#if day.violatesRestPeriod === true}
													<span class="flex items-center gap-4 text-sm">
														<TriangleAlert size={18} class="text-red-600 dark:text-red-400" />
														Ruhezeit wurde nicht eingehalten
													</span>
												{/if}
												{#if day.violatesWorkHours === true}
													<span class="flex items-center gap-4 text-sm">
														<TriangleAlert size={18} class="text-red-600 dark:text-red-400" />
														Arbeitszeit war außerhalb des erlaubten Zeitraumes
													</span>
												{/if}
												{#if day.violatesWorkTimeLimit === true}
													<span class="flex items-center gap-4 text-sm">
														<TriangleAlert size={18} class="text-red-600 dark:text-red-400" />
														Arbeitszeit an dem Tag überschritten
													</span>
												{/if}
											</div>
										</div>
									{/if}
								</div>
							{/if}
						{/each}
					</div>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
{/await}
