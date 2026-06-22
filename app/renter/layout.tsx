import type { Metadata } from "next";
import "../portal.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function RenterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
