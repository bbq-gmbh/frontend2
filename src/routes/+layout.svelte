<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '@/assets/favicon.svg';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<!-- Navigation bar -->
<nav class="bg-white shadow dark:bg-gray-800">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex space-x-8">
				<div class="flex flex-shrink-0 items-center">
					<a href="/" class="text-xl font-bold text-gray-900 dark:text-white"> Auth App </a>
				</div>
				<div class="flex items-center space-x-4">
					<a
						href="/"
						class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
					>
						Home
					</a>
					{#if data.user}
						<a
							href="/protected"
							class="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
						>
							Protected
						</a>
					{/if}
				</div>
			</div>
			<div class="flex items-center space-x-4">
				{#if data.user}
					<span class="text-sm text-gray-700 dark:text-gray-300">
						Hello, <span class="font-semibold">
							{#if data.user.employee}
								{data.user.employee.first_name} {data.user.employee.last_name}
							{:else}
								{data.user.username}
							{/if}
						</span>
					</span>
					<a
						href="/change-password"
						class="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-500"
					>
						Change Password
					</a>
					<form method="POST" action="/logout">
						<button
							type="submit"
							class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
						>
							Logout
						</button>
					</form>
				{:else}
					<a
						href="/login"
						class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
					>
						Login
					</a>
					<a
						href="/register"
						class="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500"
					>
						Register
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>

{@render children?.()}
