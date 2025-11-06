<script lang="ts">
	import * as Table from '#/ui/table';
	import * as ButtonGroup from '#/ui/button-group';

	import UserNameAvatar from '#/user-name-avatar.svelte';

	import { getEmployees } from './employees.remote';
	import Button from '#/ui/button/button.svelte';
	import { Calendar, Clock, ListChecks } from 'lucide-svelte';
	import { goto } from '$app/navigation';
</script>

{#await getEmployees()}
	<span class="text-muted-foreground"> Loading... </span>
{:then users}
	<div class="flex flex-col gap-6">
		<div class="overflow-x-auto rounded-md border border-border whitespace-nowrap">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="px-4">Mitarbeiter</Table.Head>
						<Table.Head class="px-2"></Table.Head>
						<Table.Head class="pr-4 pl-2"></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each users as user}
						{#if user.employee}
							<Table.Row class="h-12">
								<Table.Cell class="w-full min-w-[10rem] px-4">
									<div>
										<UserNameAvatar {user} />
									</div>
								</Table.Cell>
								<Table.Cell class="px-2">
									<ButtonGroup.Root>
										<Button
											variant="outline"
											onclick={() => goto(`/app/time-entries?user_id=${user.id}`)}
										>
											<Clock />
											Zeiteinträge
										</Button>
										<Button
											variant="outline"
											onclick={() => goto(`/app/absence-entries?user_id=${user.id}`)}
										>
											<Calendar />
											Abwesendheitseinträge
										</Button>
									</ButtonGroup.Root>
								</Table.Cell>
								<Table.Cell class="pr-4 pl-2">
									<ButtonGroup.Root>
										<Button
											variant="outline"
											onclick={() => goto(`/app/time-overview?user_id=${user.id}`)}
										>
											<ListChecks />
											Zeitübersicht
										</Button>
									</ButtonGroup.Root>
								</Table.Cell>
							</Table.Row>
						{/if}
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</div>
{:catch error}
	<span>
		Error: {JSON.stringify(error)}
	</span>
{/await}
