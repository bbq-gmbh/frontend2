<script lang="ts">
	import Button from '#/ui/button/button.svelte';
	import { Input } from '#/ui/input';
	import { Label } from '#/ui/label';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { getServerStore, setServerStoreGleitzeitwarnung } from './settings.remote';
	import { toast } from 'sonner';

	let props: { data: PageData } = $props();

	let valueYellow: number | undefined = $state(undefined);
	let valueRed: number | undefined = $state(undefined);
</script>

<div class="max-w-[20rem] space-y-6">
	{#await getServerStore() then store}
		{#if store}
			<div class="space-y-2">
				<Label>Gleitzeit Warnung Gelb</Label>
				<Input
					value={store.gleitzeit_warnung_gelb !== undefined ? store.gleitzeit_warnung_gelb : '-'}
					type="text"
					readonly
					disabled
				/>
			</div>

			<div class="space-y-2">
				<Label>Gleitzeit Warnung Rot</Label>
				<Input
					value={store.gleitzeit_warnung_rot !== undefined ? store.gleitzeit_warnung_rot : '-'}
					type="text"
					readonly
					disabled
				/>
			</div>
		{/if}
	{/await}

	<div class="space-y-2">
		<Label>Neu Gleitzeit Warnung Gelb</Label>
		<Input bind:value={valueYellow} type="text" />
	</div>

	<div class="space-y-2">
		<Label>Neu Gleitzeit Warnung Rot</Label>
		<Input bind:value={valueRed} type="text" />
	</div>

	<Button
		onclick={async () => {
			try {
				await setServerStoreGleitzeitwarnung({
					s1: valueYellow as any,
					s2: valueRed as any
				});

				toast.success('Abwesendheitseintrag erfolgreich erstellt');

				await getServerStore().refresh();
			} catch (error) {
				toast.error(
					`Fehler beim Erstellen vom Abwesendheitseintrag: ${(error as any).body?.message ?? 'Unknown Error'}`
				);
			}
		}}
	>
		Speichern
	</Button>
</div>
