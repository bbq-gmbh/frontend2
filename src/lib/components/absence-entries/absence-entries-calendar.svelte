<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';
	import Holidays from 'date-holidays';

	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { CalendarDate } from '@internationalized/date';

	import { Button } from '#/ui/button';

	import * as ButtonGroup from '#/ui/button-group';
	import * as Card from '#/ui/card';

	let holidays = new Holidays('DE', 'BW', {
		timezone: 'Europe/Berlin',
		types: ['public'],
		languages: 'DE'
	});

	let {
		value = $bindable(today(getLocalTimeZone())),
		asSuperuser
	}: { value: CalendarDate; asSuperuser: boolean } = $props();

	let calendar;

	let todayDate = $state(today(getLocalTimeZone()));
	let minDate = $derived(todayDate.set({ day: 1, month: 1 }));
	let maxDate = $derived(todayDate.set({ year: todayDate.year + 1 }));
</script>

<div class="flex flex-col gap-6">
	<div>
		<div>
			<div class="flex justify-start">
				<div class="flex flex-col gap-2">
					<Calendar
						bind:this={calendar}
						type="single"
						bind:value
						class="rounded-lg border shadow-sm"
						numberOfMonths={1}
						captionLayout="dropdown"
						fixedWeeks
						minValue={minDate}
						maxValue={maxDate}
						locale="de-DE"
						isDateUnavailable={(date) => {
							if (asSuperuser === true) return false;
							const d = date.toDate('Europe/Berlin');
							return holidays.isHoliday(d) != false || d.getDay() === 0;
						}}
					/>

					<div class="flex justify-end">
						<ButtonGroup.Root>
							<Button
								variant="outline"
								onclick={() => {
									value = todayDate;
								}}>Heute</Button
							>
						</ButtonGroup.Root>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
