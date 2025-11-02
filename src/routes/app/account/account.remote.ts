import { command } from '$app/server';
import { withAuthClient } from '@/server/auth';

import * as sdk from '@/backend/sdk.gen';

export const logoutFromAllDevices = command(async () => {
	const { client } = withAuthClient();

	sdk.logoutAllSessions({ client });
});
