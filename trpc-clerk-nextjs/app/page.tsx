"use client";
import { trpc } from "./trpc";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const greet = trpc.example.sayHello.useQuery(
    {
      name: "John Doe",
    },
    {
      enabled: false,
    }
  );

  const getProtectedSecret = trpc.protectedExample.getSecret.useQuery(
    undefined,
    {
      enabled: false,
    }
  );

  return (
    <div className="h-screen w-full flex items-center justify-center gap-2 flex-col">
      <UserButton afterSignOutUrl="/" showName />

      <div className="flex flex-col gap-4 w-full max-w-xl">
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-md justify-between">
          <div>
            {getProtectedSecret.data
              ? getProtectedSecret.data?.secret
              : "************"}
          </div>
          <button
            onClick={() => getProtectedSecret.refetch()}
            className="bg-blue-500 hover:bg-blue-600 duration-200 p-2 rounded-md text-white px-3 py-2 text-sm font-medium w-[200px] grow-0 shrink-0"
          >
            {getProtectedSecret.isFetching ? "Loading..." : "Get Secret"}
          </button>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-md justify-between">
          <div>{greet.data ? greet.data?.greeting : "************"}</div>
          <button
            onClick={() => greet.refetch()}
            className="bg-blue-500 hover:bg-blue-600 duration-200 p-2 rounded-md text-white px-3 py-2 text-sm font-medium w-[200px] grow-0 shrink-0"
          >
            {greet.isFetching ? "Loading..." : "Say Hello"}
          </button>
        </div>
      </div>
    </div>
  );
}
