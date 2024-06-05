"use client"

import Link from "next/link";

// Navbar component with links to app pages
export const Navbar = () => {
  return (
    <nav>
      <h1>Financial Tracker</h1>
      <Link href="/">Dashboard</Link>
      <Link href="/transactions">Transactions</Link>
    </nav>
  );
};
