import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	if (shouldHandleRoute(event.url)) {
		const { user, accessToken } = await validateSession(event.cookies);

		event.locals.user = user;
		event.locals.accessToken = accessToken;
	} else {
		event.locals.user = null;
		event.locals.accessToken = null;
	}

	return resolve(event);
};

function shouldHandleRoute(_url: URL): boolean {
	return true;
}
