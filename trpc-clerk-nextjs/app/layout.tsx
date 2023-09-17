import "@/app/globals.css";
import { headers } from "next/headers";
import { AppProvider } from "@/app/provider";
import { ClerkProvider, auth } from "@clerk/nextjs";

export const metadata = {
  title: "Next.js 13 + Clerk + tRPC",
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Props) {
  const { userId } = auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AppProvider headers={headers()} userId={userId}>
            {children}
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
