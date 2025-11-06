<script lang="ts">
	import { getLocalTimeZone, today } from '@internationalized/date';

	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { CalendarDate } from '@internationalized/date';

	import { Button } from '#/ui/button';

	import * as ButtonGroup from '#/ui/button-group';
	import * as Card from '#/ui/card';

	let { value = $bindable(today(getLocalTimeZone())) }: { value: CalendarDate } = $props();

	let monthDateTimeFormat = new Intl.DateTimeFormat('de-DE', { month: 'long' });

	let calendar;

	// let value = $state(today(getLocalTimeZone()));

	let todayDate = $state(today(getLocalTimeZone()));
	let minDate = $derived(todayDate.set({ day: 1, month: 1 }));
	let maxDate = $derived(todayDate.set({ year: todayDate.year + 1 }));
</script>

<div class="flex flex-col gap-6">
	<div>
		<Card.Root class="bg-transparent">
			<Card.Content class="flex justify-center">
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
			</Card.Content>
		</Card.Root>
	</div>
</div>
