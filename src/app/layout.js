import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const head = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-head" });
const body = Figtree({ subsets: ["latin"], variable: "--f-body" });

export const metadata = {
  title: "Nexusgamer",
  description: "Panel de administración - Productos, Categorías, Marcas, Ventas, Compras",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${head.variable} ${body.variable}`}>
      <body className="bg-field font-sans text-slate-800 antialiased min-h-screen">
        <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">{children}</main>
      </body>
    </html>
  );
}