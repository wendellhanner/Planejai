import { redirect } from "next/navigation";

export default function Home() {
  // Redirect from root to login page
  redirect("/login");
}
