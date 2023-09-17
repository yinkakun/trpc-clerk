import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './trpc';

// example router
export const exampleRouter = router({
	sayHello: publicProcedure
		.input(
			z.object({
				name: z.string(),
			})
		)
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.name}`,
			};
		}),
});

// example protected procedure
export const exampleProtectedRouter = router({
	// this is accessible only if the user is authenticated
	getSecret: protectedProcedure.query(({ ctx }) => {
		return {
			secret: `User ID: ${ctx.user.id}`,
		};
	}),
});

// app router
export const appRouter = router({
	example: exampleRouter,
	protectedExample: exampleProtectedRouter,
});

export type AppRouter = typeof appRouter;
