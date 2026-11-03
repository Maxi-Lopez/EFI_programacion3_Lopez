import { Suspense } from "react";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { SidebarProvider } from "@/context/SidebarContext";

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
        <ThemeProvider>
          <Suspense fallback={null}>
            <AuthProvider>
              <SidebarProvider>
                <MobileHeader />
                <Sidebar />
                <main className="lg:ml-64 pt-16 lg:pt-0 mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12 w-full">
                  {children}
                </main>
              </SidebarProvider>
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}