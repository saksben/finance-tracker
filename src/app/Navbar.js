"use client"

import Link from "next/link";

// Navbar component with links to app pages
export const Navbar = () => {
  return (
    <nav className="pl-10 bg-slate-700 pb-5 pt-5">
      <h1>Financial Tracker</h1>
      <Link href="/" className="border-r pl-2 pr-2">Dashboard</Link>
      <Link href="/transactions" className="pl-2">Transactions</Link>
    </nav>
  );
};
