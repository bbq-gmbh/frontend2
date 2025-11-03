<script lang="ts">
	let { children }: { children: any } = $props();
</script>

<div class="flex min-h-svh items-center justify-center p-4">
	<div class="max-w-[32rem] grow">
		{@render children?.()}
	</div>
</div>
