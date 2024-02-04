import { DM_Sans } from "next/font/google";
import "./globals.css";
// import Bot from "./components/Bot/Bot.js";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
const inter = DM_Sans({ subsets: ["latin"] });
export const metadata = {
  title: "Font Lab",
  description: "Fuse your fav fonts <3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      

        <Footer />
      </body>
    </html>
  );
}
