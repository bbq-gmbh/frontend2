<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

	import { ListChecks, X } from 'lucide-svelte';

	import Button from '#/ui/button/button.svelte';
	import RangeCalendar from '#/ui/range-calendar/range-calendar.svelte';

	import * as ButtonGroup from '#/ui/button-group';

	let todayDate = $state(today(getLocalTimeZone()));
	let minDate = $derived(todayDate.set({ day: 1, month: 1 }));
	let maxDate = $derived(todayDate);

	let {
		dateRange = $bindable()
	}: {
		dateRange: {
			start: CalendarDate | undefined;
			end: CalendarDate | undefined;
		};
	} = $props();

	$inspect(dateRange);
</script>

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
			<b>{dateRange.start !== undefined ? fmtDate(dateRange.start) : 'XX.XX.XXXX'}</b> &ndash;
			<b>{dateRange.end !== undefined ? fmtDate(dateRange.end) : 'XX.XX.XXXX'}</b>
		</div>
	</svelte:boundary>

	<div class="flex">
		<Button
			onclick={() => {
				dateRange = { start: undefined, end: undefined };
			}}
		>
			<ListChecks />
			Auswerten
		</Button>
	</div>
</div>
