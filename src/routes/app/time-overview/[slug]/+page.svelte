<script lang="ts">
	import type { PageData } from './$types';

	import { CalendarDate, parseDate } from '@internationalized/date';

	import * as Card from '#/ui/card';

	import { calculateOverview, getEmployeeById, getUserById } from '../time-overview.remote';
	import UserNameAvatar from '#/user-name-avatar.svelte';

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
</script>

{#await calcOverview}
	<div class="text-muted-foreground">Loading...</div>
{:then { days, dayAmount, user, employee, serverStore, warnungen, total }}
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
						<div class={`text-2xl font-bold ${warnungColor(total.totalOverTimeHours)}`}>
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

  <Card.Root class="bg-transparent p-2">

  </Card.Root>
{/await}
