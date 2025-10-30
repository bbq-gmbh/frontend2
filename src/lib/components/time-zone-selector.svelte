<script lang="ts">
	import { tick } from 'svelte';
	import { browser } from '$app/environment';
  
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';

	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
  
	const timezones = Intl.supportedValuesOf('timeZone');

	let open = $state(false);
	let { value = $bindable('') }: { value?: string } = $props();
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(timezones.find((f) => f === value));

	// Auto-detect timezone on client side
	if (browser && !value) {
		value = Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class="w-[200px] justify-between"
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || 'Zeitzone auswählen...'}
				<ChevronsUpDownIcon class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder="Zeitzone suchen..." />
			<Command.List>
				<Command.Empty>Keine Zeitzone gefunden.</Command.Empty>
				<Command.Group value="timezones">
					{#each timezones as timezone (timezone)}
						<Command.Item
							value={timezone}
							onSelect={() => {
								value = timezone;
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn(value !== timezone && 'text-transparent')} />
							{timezone}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
