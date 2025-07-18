import "./globals.css";
import Navigation from "../components/Navigation";

export const metadata = {
  title: "Portfolio - Hocine IRATNI",
  description: "Portfolio professionnel - BTS SIO SISR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}