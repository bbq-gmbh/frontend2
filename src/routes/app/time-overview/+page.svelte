<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

	import type { PageData } from './$types';

	import TimeOverviewCalendar from '#/time-overview/time-overview-calendar.svelte';
	import TimeOverview from '#/time-overview/time-overview.svelte';

	let { data }: { data: PageData } = $props();

	let todayDate = $state(today(getLocalTimeZone()));

	let dateRange: { start: CalendarDate | undefined; end: CalendarDate | undefined } = $state({
		start: todayDate.set({ day: 1 }),
		end: todayDate
	});
</script>

<div class="flex flex-col gap-8">
	<TimeOverviewCalendar bind:dateRange />
	<!-- <TimeOverview
		user_id={data.userId}
		dateRange={dateRange.start !== undefined && dateRange.end !== undefined
			? (dateRange as { start: CalendarDate; end: CalendarDate })
			: undefined}
	/> -->
</div>
