import "./globals.css";
import Navigation from "../components/Navigation";
import BottomNavigation from "../components/BottomNavigation";
import { ThemeProvider } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

export const metadata = {
  title: "Portfolio - Hocine IRATNI",
  description: "Portfolio professionnel - BTS SIO SISR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="antialiased bg-theme text-theme">
        <ThemeProvider>
          <Navigation />
          <ThemeToggle />
          <main className="pt-16 bg-theme min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}