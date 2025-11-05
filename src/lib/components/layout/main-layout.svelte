<script lang="ts">
	import * as Breadcrumb from '#/ui/breadcrumb/index.js';
	import * as Sidebar from '#/ui/sidebar/index.js';
	import { Separator } from '#/ui/separator/index.js';

	import AppSidebar from '#/layout/app-sidebar.svelte';
	import ThemeToggle from '#/theme-toggle.svelte';
	import type { User } from '@/types/auth';
	import type { Breadcrumbs } from '@/types/navigation';
	import { combinePaths } from '@/utils';

	let {
		children,
		user,
		breadcrumbs
	}: {
		children: any;
		user: User;
		breadcrumbs: Breadcrumbs;
	} = $props();
</script>

{#snippet breadcrumbList(breadcrumbs: Breadcrumbs)}
	{#if breadcrumbs.length > 0}
		<Breadcrumb.Root>
			<Breadcrumb.List>
				{#each breadcrumbs as breadcrumb, i}
					{#if i == breadcrumbs.length - 1}
						<Breadcrumb.Item>
							<Breadcrumb.Page>{breadcrumb.name}</Breadcrumb.Page>
						</Breadcrumb.Item>
					{:else}
						<Breadcrumb.Item class="hidden md:block">
							{#if !!breadcrumb.path}
								<Breadcrumb.Link href={combinePaths('/app', breadcrumb.path)}>
									{breadcrumb.name}
								</Breadcrumb.Link>
							{:else}
								<Breadcrumb.Page>
									{breadcrumb.name}
								</Breadcrumb.Page>
							{/if}
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
					{/if}
				{/each}
			</Breadcrumb.List>
		</Breadcrumb.Root>
	{/if}
{/snippet}

<Sidebar.Provider>
	<AppSidebar {user} />
	<!-- [scrollbar-gutter:stable_both-edges] -->
	<Sidebar.Inset class="">
		<div class="flex min-h-full flex-col">
			<header
				class="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 z-30"
			>
				<Sidebar.Trigger />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				{@render breadcrumbList(breadcrumbs)}
				<div class="ml-auto flex">
					<ThemeToggle />
				</div>
			</header>
			<div class="flex grow">
				<div class="mx-auto flex max-w-[80rem] grow flex-col">
					<div class="w-full max-w-[80rem] grow space-y-4 p-4">
						{@render children?.()}
					</div>
				</div>
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
