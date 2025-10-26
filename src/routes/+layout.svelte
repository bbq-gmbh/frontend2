<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	import favicon from '@/assets/favicon.svg';
	import { Toaster } from '#/ui/sonner';

	let { children }: { children: any } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<Toaster position="bottom-right" />

{@render children?.()}
