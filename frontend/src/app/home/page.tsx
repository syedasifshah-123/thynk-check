import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { HomeView, LogoutButton } from "./home-view";

export const metadata: Metadata = {
  title: "Home · Thynk",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar actions={<LogoutButton />} />
      <HomeView />
    </div>
  );
}
