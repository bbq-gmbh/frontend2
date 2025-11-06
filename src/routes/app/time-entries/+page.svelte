<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import type { PageData } from './$types';

	import { Plus } from 'lucide-svelte';

	import Calendar from '#/time-entries/time-entries-calendar.svelte';
	import { Button } from '#/ui/button';

	import * as Card from '#/ui/card';
	import * as ButtonGroup from '#/ui/button-group';

	import TimeEntriesCalendar from '#/time-entries/time-entries-calendar.svelte';
	import TimeEntriesList from '#/time-entries/time-entries-list.svelte';

	let { data }: { data: PageData } = $props();
	let { userId, superuser, readonly } = data;

	let selectedDay: CalendarDate = $state(today(getLocalTimeZone()));
	let selectedDayDate: Date | undefined = $derived(
		selectedDay ? selectedDay.toDate('Europe/Berlin') : undefined
	);
</script>

<div class="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(36rem,1fr))]">
	<TimeEntriesCalendar bind:value={selectedDay} />
	<TimeEntriesList
		selectedDay={selectedDayDate}
		user_id={userId}
		asSuperuser={superuser}
		{readonly}
	/>
</div>
