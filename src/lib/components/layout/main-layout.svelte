<script lang="ts">
	import * as Breadcrumb from '#/ui/breadcrumb/index.js';
	import * as Sidebar from '#/ui/sidebar/index.js';
	import { Separator } from '#/ui/separator/index.js';

	import AppSidebar from '#/layout/app-sidebar.svelte';
	import ThemeToggle from '#/theme-toggle.svelte';
	import type { User } from '@/types/auth';

	let { children, user }: { children: any; user: User } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar {user} />
	<Sidebar.Inset>
		<header class="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
			<Sidebar.Trigger />
			<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="/settings">Settings</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="/account">Accounts</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Account</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div class="ml-auto flex">
				<ThemeToggle />
			</div>
		</header>
    <div class="p-4">
		{@render children?.()}
    </div>
	</Sidebar.Inset>
</Sidebar.Provider>
