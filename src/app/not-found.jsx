import Link from "next/link";
import { Boton } from "@/components/Boton";
import { BotonTema } from "@/components/BotonTema";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
      <h1 className="font-display text-6xl font-semibold text-ink mb-4">404</h1>
      <p className="text-xl text-slate-500 mb-6">Página no encontrada</p>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        La página que buscás no existe o fue movida. Verificá la URL o volvé al catálogo principal.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/productos">
          <Boton variant="primary">Volver al catálogo</Boton>
        </Link>
        <BotonTema />
      </div>
    </div>
  );
}