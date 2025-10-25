import type { PageServerLoad } from './$types';
import { requireAuthSuperuser } from '@/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
  requireAuthSuperuser(locals);

  return {
    user: locals.user!!,
    accessToken: locals.accessToken!!
  };
};
