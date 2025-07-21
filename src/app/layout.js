import "./globals.css";
import Navigation from "../components/Navigation";
import BottomNavigation from "../components/BottomNavigation";
import SwipeNavigation from "../components/SwipeNavigation";
import { ThemeProvider } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

export const metadata = {
  title: "Portfolio - Hocine IRATNI",
  description: "Portfolio professionnel - BTS SIO SISR",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="antialiased bg-theme text-theme">
        <ThemeProvider>
          <Navigation />
          <ThemeToggle />
          <main className="pt-16 pb-20 md:pb-0 bg-theme min-h-screen relative overflow-x-hidden">
            {children}
          </main>
          <BottomNavigation />
          <SwipeNavigation />
        </ThemeProvider>
      </body>
    </html>
  );
}