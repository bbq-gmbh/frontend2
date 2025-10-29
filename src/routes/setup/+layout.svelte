<script lang="ts">
	let { children }: { children: any } = $props();
</script>

<div class="flex justify-center min-h-svh p-4 items-center">
	<div class="max-w-[32rem] grow">
		{@render children?.()}
	</div>
</div>
