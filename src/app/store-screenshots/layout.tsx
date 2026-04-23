import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store screenshots",
  robots: { index: false, follow: false },
};

export default function StoreScreenshotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
