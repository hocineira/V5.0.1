import "./globals.css";
import Navigation from "../components/Navigation";
import { ThemeProvider } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

export const metadata = {
  title: "Portfolio - Hocine IRATNI",
  description: "Portfolio professionnel - BTS SIO SISR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="antialiased bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">
        <ThemeProvider>
          <Navigation />
          <ThemeToggle />
          <main className="pt-16 bg-white dark:bg-slate-900 min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}