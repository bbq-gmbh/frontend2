<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import type { PageData } from './$types';

	import AbsenceEntriesCalendar from '#/absence-entries/absence-entries-calendar.svelte';
	import AbsenceEntriesList from '#/absence-entries/absence-entries-list.svelte';

	let { data }: { data: PageData } = $props();
	let { user } = data;

	let selectedDay: CalendarDate = $state(today(getLocalTimeZone()));
	let selectedDayDate: Date | undefined = $derived(
		selectedDay ? selectedDay.toDate('Europe/Berlin') : undefined
	);
</script>

<div class="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(36rem,1fr))]">
	<AbsenceEntriesCalendar bind:value={selectedDay} />
	<AbsenceEntriesList
		selectedDay={selectedDayDate}
		user_id={user.id}
		asSuperuser={false}
		readonly={false}
	/>
	<!-- <div class="flex flex-wrap gap-2">
		<Button variant="outline" class="ml-auto">
			<Plus />
			Neu erstellen
		</Button>
	</div>

	<div class="flex flex-wrap gap-2">
		<Button variant="outline" class="ml-auto">
			<Plus />
			Neu erstellen
		</Button>
	</div> -->
</div>
