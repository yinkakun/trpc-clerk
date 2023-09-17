import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../trpc-clerk-cloudflare-worker/src/router";

export const trpc = createTRPCReact<AppRouter>();
