import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";
import {Navbar} from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Financial Tracker with Data Visualization",
  description: "Track transactions, set up budgets, and chart and export it all",
};

export default function RootLayout({ children }) {
  return (
    // Redux store
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
