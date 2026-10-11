// Sidebar pages. Only Home exists so far; the rest show a "coming soon" toast.

export type NavItem = {
  id: string;
  label: string;
  /** Shorter label for the mobile bottom nav. */
  short?: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
};

/** Main "Learn" pages, listed directly in the sidebar. */
export const LEARN_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/home", icon: <HomeIcon /> },
  { id: "brain", label: "Brain Training", short: "Brain", icon: <BrainIcon /> },
  { id: "math", label: "Math", href: "/math", badge: "New", icon: <MathIcon /> },
  { id: "games", label: "Games", icon: <GamesIcon /> },
  { id: "iq", label: "IQ Test", icon: <BulbIcon /> },
];

/** Personal pages, tucked behind the "You" menu. */
export const YOU_ITEMS: NavItem[] = [
  { id: "progress", label: "My Progress", icon: <ChartIcon /> },
  { id: "leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
  { id: "streak", label: "Streak & Achievements", icon: <FlameIcon /> },
  { id: "profile", label: "Profile", icon: <UserIcon /> },
  { id: "settings", label: "Settings", icon: <GearIcon /> },
];

export const YOU_ICON = <UsersIcon />;

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg className="size-[22px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function HomeIcon() {
  return (
    <Icon>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9v11h5v-6h4v6h5V9" />
    </Icon>
  );
}
function BrainIcon() {
  return (
    <Icon>
      <path d="M9.5 3A3 3 0 0 0 6.6 6.8 3 3 0 0 0 4.5 12a3 3 0 0 0 2 5.2A3 3 0 0 0 12 18.5V4.6A2.5 2.5 0 0 0 9.5 3z" />
      <path d="M14.5 3a3 3 0 0 1 2.9 3.8 3 3 0 0 1 2.1 5.2 3 3 0 0 1-2 5.2 3 3 0 0 1-5.5 1.3" />
    </Icon>
  );
}
function MathIcon() {
  return (
    <Icon>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7.5 9h4M9.5 7v4M13.5 9h3.5M7.5 15.5l3 3M10.5 15.5l-3 3M13.5 15.5h3.5M13.5 18h3.5" />
    </Icon>
  );
}
function GamesIcon() {
  return (
    <Icon>
      <path d="M6.5 7h11a4 4 0 0 1 3.9 4.8l-1 4.9a2.2 2.2 0 0 1-3.9.9L15 16H9l-1.5 1.6a2.2 2.2 0 0 1-3.9-.9l-1-4.9A4 4 0 0 1 6.5 7z" />
      <path d="M8 10v3M6.5 11.5h3" />
      <circle cx="15.5" cy="10.5" r="0.6" fill="currentColor" />
      <circle cx="17" cy="12.5" r="0.6" fill="currentColor" />
    </Icon>
  );
}
function BulbIcon() {
  return (
    <Icon>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.1 1.3 1.1 2.2h5c0-.9.3-1.6 1.1-2.2A6 6 0 0 0 12 3z" />
    </Icon>
  );
}
function ChartIcon() {
  return (
    <Icon>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Icon>
  );
}
function TrophyIcon() {
  return (
    <Icon>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5" />
    </Icon>
  );
}
function FlameIcon() {
  return (
    <Icon>
      <path d="M12 22a7 7 0 0 0 7-7c0-4-3-6.5-4-10-2.5 1.5-3.5 4-3.5 6-1-.5-2-2-2-3.5C6.5 9.5 5 12 5 15a7 7 0 0 0 7 7z" />
    </Icon>
  );
}
function UsersIcon() {
  return (
    <Icon>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
    </Icon>
  );
}
function UserIcon() {
  return (
    <Icon>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
  );
}
function GearIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </Icon>
  );
}
