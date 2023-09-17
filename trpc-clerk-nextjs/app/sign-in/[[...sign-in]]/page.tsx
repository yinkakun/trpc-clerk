import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
}
