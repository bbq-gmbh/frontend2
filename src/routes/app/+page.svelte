<div class="flex flex-1 flex-col gap-4">
	<div class="grid auto-rows-min gap-4 md:grid-cols-5">
		{#each Array.from({ length: 10 }) as _, index (index)}
			<div class="aspect-square rounded-xl bg-muted/50"></div>
		{/each}
	</div>
</div>
