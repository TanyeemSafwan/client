import { redirect } from "next/navigation";

// proxy.ts normally redirects "/" first; this is the fallback.
export default function Home() {
  redirect("/dashboard");
}
