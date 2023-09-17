"use client";
import React from "react";
import { trpc } from "./trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

interface Props {
  headers: Headers;
  userId: string | null;
  children: React.ReactNode;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AppProvider: React.FC<Props> = (props) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      })
  );

  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: `${API_URL}/trpc`,
          headers() {
            const headers = new Map(props.headers);
            headers.set("x-trpc-source", "nextjs");
            headers.set("authorization", `${props.userId}`);
            return Object.fromEntries(headers);
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          {props.children}
        </ReactQueryStreamedHydration>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
