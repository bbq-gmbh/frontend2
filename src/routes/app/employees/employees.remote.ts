import { query } from '$app/server';

import * as sdk from '@/backend/sdk.gen';

import { withAuthClient } from '@/server/auth';

const getEmployees = query(async () => {
	const { client } = withAuthClient();

  await sdk.listUsers({
    client,
    query: {
      page: 0,
      page_size: 200,
      is_employee: true
    }
  })
});
