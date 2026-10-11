import type { MetadataRoute } from "next";

// Web app manifest: makes Thynk installable as an app (home screen / desktop) with the mascot icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Thynk: Train your brain",
    short_name: "Thynk",
    description: "Bite-sized puzzles, logic and math challenges that make you a faster, clearer thynker.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0f1110",
    theme_color: "#0f1110",
    categories: ["education", "games", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Log in", url: "/auth/login", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Create account", url: "/auth/signup", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
