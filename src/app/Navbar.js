"use client"

import Link from "next/link";

// Navbar component with links to app pages
export const Navbar = () => {
  return (
    <nav className="pl-10 bg-slate-950 pb-5 pt-5">
      <h1>Finance Tracker</h1>
      <Link href="/" className="border-r px-2">Dashboard</Link>
      <Link href="/transactions" className="border-r px-2">Transactions</Link>
      <Link href="/budgets" className="border-r px-2">Budgets</Link>
      <Link href="/users" className="px-2">Users</Link>
    </nav>
  );
};
