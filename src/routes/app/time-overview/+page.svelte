<script lang="ts">
	import type { PageData } from './$types';
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

	import { ListChecks, X } from 'lucide-svelte';

	import Button from '#/ui/button/button.svelte';
	import RangeCalendar from '#/ui/range-calendar/range-calendar.svelte';

	import * as ButtonGroup from '#/ui/button-group';
	import { goto } from '$app/navigation';
	import { getUserById } from './time-overview.remote';

	let { data }: { data: PageData } = $props();
	let { userId } = data;

	let todayDate = $state(today(getLocalTimeZone()));
	let minDate = $derived(todayDate.set({ day: 1, month: 1 }));
	let maxDate = $derived(todayDate);

	let dateRange: {
		start: CalendarDate | undefined;
		end: CalendarDate | undefined;
	} = $state({
		start: todayDate.set({ day: 1 }),
		end: todayDate
	});

	let canShow = $derived.by(() => {
		if (dateRange.start === undefined || dateRange.end === undefined) return false;
		return dateRange.start <= dateRange.end;
	});
</script>

{#await getUserById(userId)}
	<div class="text-muted-foreground">Loading...</div>
{:then user}
	<div class="flex flex-col gap-6">
		<div class="flex flex-col items-start gap-2">
			<RangeCalendar
				bind:value={dateRange}
				class="rounded-md border"
				numberOfMonths={2}
				fixedWeeks
				captionLayout="dropdown"
				minValue={minDate}
				maxValue={maxDate}
			/>
			<div class="flex flex-wrap gap-2">
				<ButtonGroup.Root>
          <Button
						size="sm"
						variant="outline"
						onclick={() => {
							dateRange = { start: todayDate.subtract({ weeks: 1 }), end: todayDate };
						}}
					>
						1 Woche
					</Button>
					<Button
						size="sm"
						variant="outline"
						onclick={() => {
							dateRange = { start: todayDate.set({ day: 1 }), end: todayDate };
						}}
					>
						Dieser Monat
					</Button>
					<Button size="sm" variant="outline">Letzter Monat</Button>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button size="sm" variant="outline">Dieser Monat</Button>
					<Button size="sm" variant="outline">Bis Heute</Button>
				</ButtonGroup.Root>
				<ButtonGroup.Root>
					<Button
						size="sm"
						variant="outline"
						onclick={() => {
							dateRange = { start: undefined, end: undefined };
						}}
					>
						<X />
						Deselektieren
					</Button>
				</ButtonGroup.Root>
			</div>
		</div>

		<svelte:boundary>
			{@const fmtDate = (cd: CalendarDate) => `${cd.day}.${cd.month}.${cd.year}`}
			<div>
				{#if dateRange.start === undefined && dateRange.end === undefined}
					...
				{:else}
					<b>{dateRange.start !== undefined ? fmtDate(dateRange.start) : '...'}</b> &ndash;
					<b>{dateRange.end !== undefined ? fmtDate(dateRange.end) : '...'}</b>
				{/if}
			</div>
		</svelte:boundary>

		<div class="flex">
			<Button
				onclick={() => {
					if (canShow) {
						goto(`/app/time-overview/${dateRange.start}..${dateRange.end}?user_id=${user.id}`);
					}
				}}
				disabled={!canShow}
			>
				<ListChecks />
				Auswerten
			</Button>
		</div>
	</div>
{/await}
