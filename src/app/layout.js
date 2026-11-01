import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const head = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-head" });
const body = Figtree({ subsets: ["latin"], variable: "--f-body" });

export const metadata = {
  title: "Inventario",
  description: "Panel para administrar artículos y proveedores",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${head.variable} ${body.variable}`}>
      <body className="bg-field font-sans text-slate-800 antialiased">
        <Sidebar />
        <div className="md:pl-60">
          <main className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
