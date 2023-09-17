import { Env } from '.';
import { Clerk } from '@clerk/backend';
import { initTRPC, inferAsyncReturnType, TRPCError } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

interface Context extends FetchCreateContextFnOptions {
	env: Env;
}

// context holds data that all of your tRPC procedures will have access to
export const createContext = async ({ req, env }: Context) => {
	const clerk = Clerk({ apiKey: env.CLERK_API_KEY });
	const userId = req.headers.get('authorization');

	// if there is no session token, return null
	if (!userId) return { session: null };

	// otherwise, get the session
	const user = await clerk.users.getUser(userId);
	return {
		user,
	};
};

// initialize tRPC
const t = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthenticated = t.middleware(({ ctx, next }) => {
	if (!ctx.user?.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

	return next({
		ctx: {
			user: ctx.user,
		},
	});
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
