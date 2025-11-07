<script lang="ts">
	import * as Card from '#/ui/card';
	import { goto } from '$app/navigation';
	import { Calendar, Clock, ListChecks, User } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { user } = data;
</script>

<div class="flex flex-1 flex-col gap-4">
	<div class="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
		{#if user.employee}
			<Card.Root onclick={() => goto('/app/time-entries')}>
				<Card.Header>
					<Card.Title>Zeitbuchung</Card.Title>
				</Card.Header>
				<Card.Content>
					<Clock size="32" />
				</Card.Content>
			</Card.Root>
			<Card.Root onclick={() => goto('/app/absence-entries')}>
				<Card.Header>
					<Card.Title>Abwesenheit</Card.Title>
				</Card.Header>
				<Card.Content>
					<Calendar size="32" />
				</Card.Content>
			</Card.Root>
			<Card.Root onclick={() => goto('/app/time-overview')}>
				<Card.Header>
					<Card.Title>Zeitübersicht</Card.Title>
				</Card.Header>
				<Card.Content>
					<ListChecks size="32" />
				</Card.Content>
			</Card.Root>
		{/if}
		<Card.Root onclick={() => goto('/app/account')}>
			<Card.Header>
				<Card.Title>Account</Card.Title>
			</Card.Header>
			<Card.Content>
				<User size="32" />
			</Card.Content>
		</Card.Root>
	</div>
</div>
