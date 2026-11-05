import Link from "next/link";
import { Boton } from "@/components/Boton";

export default function SobreNosotrosPage() {
  return (
    <main className="min-h-screen bg-field py-16">
      <div className="max-w-3xl mx-auto px-5 md:px-10">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            La tienda de referencia para gamers y entusiastas de la tecnología
          </p>
        </div>

        <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="bg-surface border border-border rounded-xl p-8">
            <h2 className="font-display text-2xl font-semibold text-ink mb-4">Nuestra Historia</h2>
            <p className="mb-4">
              Nexusgamer nació como un proyecto de la facultad (EFI de Programación III) con la idea de crear una tienda de computación y gaming que sea rápida, segura y fácil de usar.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-8">
            <h2 className="font-display text-2xl font-semibold text-ink mb-4">Nuestra Misión</h2>
            <p className="mb-4">
              Ofrecer componentes de alta calidad (procesadores, placas de video, periféricos) con un enfoque en la experiencia del usuario y la transparencia en los precios.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-8">
            <h2 className="font-display text-2xl font-semibold text-ink mb-4">Valores</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong className="text-ink">Calidad:</strong> Solo trabajamos con marcas reconocidas como Asus, MSI, etc.</li>
              <li><strong className="text-ink">Rapidez:</strong> Envíos en 24hs.</li>
              <li><strong className="text-ink">Soporte:</strong> Atención personalizada.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/productos">
            <Boton variant="primary" size="lg">
              Volver a Productos
            </Boton>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Desarrollado por Maximiliano López para el Examen Final Integrador de Programación III</p>
        </div>
      </div>
    </main>
  );
}