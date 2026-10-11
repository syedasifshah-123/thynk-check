import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { Toaster } from "@/components/toast/toaster";
import "./globals.css";

// Headline serif (Brilliant-style hero headline)
const cofoRobert = localFont({
  src: "../../public/fonts/cofo-robert-medium.3krozkcg6qt-u.woff2",
  weight: "500",
  variable: "--font-cofo-robert",
  display: "swap",
});

// Logo / buttons
const cofoBrilliant = localFont({
  src: [
    { path: "../../public/fonts/cofo-brilliant-regular.0x-1wd4a7iit8.woff2", weight: "400" },
    { path: "../../public/fonts/cofo-brilliant-medium.1vop2d5y_jpw2.woff2", weight: "500" },
    { path: "../../public/fonts/cofo-brilliant-bold.00peqb48xfqwb.woff2", weight: "700" },
  ],
  variable: "--font-cofo-brilliant",
  display: "swap",
});

// Body text
const diatype = localFont({
  src: [
    { path: "../../public/fonts/Diatype-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/Diatype-Bold.woff2", weight: "700" },
  ],
  variable: "--font-diatype",
  display: "swap",
});

// Favicon / app icons come from the file conventions in this folder:
// favicon.ico, icon.png, apple-icon.png, and manifest.ts for the installable PWA.
export const metadata: Metadata = {
  title: "Thynk",
  description: "Train your brain with bite-sized puzzles, logic and math challenges.",
  applicationName: "Thynk",
  appleWebApp: {
    capable: true,
    title: "Thynk",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1110" },
  ],
  viewportFit: "cover",
};

// Runs before first paint: saved choice → otherwise system preference.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${cofoRobert.variable} ${cofoBrilliant.variable} ${diatype.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="bg-grid" aria-hidden="true" />
        {children}
        <Toaster />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
