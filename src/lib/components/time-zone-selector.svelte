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
	let {
		value = $bindable(''),
		name,
		...restProps
	}: { value?: string; name?: string; [key: string]: any } = $props();
	let triggerRef = $state<HTMLButtonElement>(null!);

	let selectedValue = $derived(timezones.find((f) => f === value));

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

{#if name}
	<input type="hidden" {name} {value} />
{/if}

<Popover.Root bind:open {...restProps}>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class="w-[14rem] justify-between"
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || 'Zeitzone auswählen...'}
				<ChevronsUpDownIcon class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[14rem] p-0">
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
