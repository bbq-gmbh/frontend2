<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmNewPassword = $state('');
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-md">
		<div class="mb-6">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Change Password</h1>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Update your password. You'll be logged out after changing it.
			</p>
		</div>

		<form method="POST" class="space-y-6">
			{#if form?.error}
				<div class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
					<p class="text-sm text-red-800 dark:text-red-200">{form.error}</p>
				</div>
			{/if}

			<div>
				<label
					for="currentPassword"
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					Current Password
				</label>
				<input
					id="currentPassword"
					name="currentPassword"
					type="password"
					required
					bind:value={currentPassword}
					class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
					class:border-red-500={form?.errors?.currentPassword}
					placeholder="Enter your current password"
				/>
				{#if form?.errors?.currentPassword}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">
						{form.errors.currentPassword[0]}
					</p>
				{/if}
			</div>

			<div>
				<label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					New Password
				</label>
				<input
					id="newPassword"
					name="newPassword"
					type="password"
					required
					minlength="8"
					bind:value={newPassword}
					class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
					class:border-red-500={form?.errors?.newPassword}
					placeholder="Enter your new password (min 8 characters)"
				/>
				{#if form?.errors?.newPassword}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">
						{form.errors.newPassword[0]}
					</p>
				{/if}
			</div>

			<div>
				<label
					for="confirmNewPassword"
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					Confirm New Password
				</label>
				<input
					id="confirmNewPassword"
					name="confirmNewPassword"
					type="password"
					required
					minlength="8"
					bind:value={confirmNewPassword}
					class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
					class:border-red-500={form?.errors?.confirmNewPassword}
					placeholder="Confirm your new password"
				/>
				{#if form?.errors?.confirmNewPassword}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">
						{form.errors.confirmNewPassword[0]}
					</p>
				{/if}
			</div>

			<div class="flex gap-4">
				<button
					type="submit"
					class="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					Change Password
				</button>
				<a
					href="/"
					class="flex-1 rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-500"
				>
					Cancel
				</a>
			</div>
		</form>
	</div>
</div>
