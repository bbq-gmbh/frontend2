import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { pathUserId } = await parent();
  
  if (!pathUserId) {
    error(404, 'User not found');
  }

  return {
    pathUserId
  }
};
