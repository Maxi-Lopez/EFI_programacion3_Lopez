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
              Nexusgamer nació en 2026 de la pasión compartida por la tecnología y los videojuegos.
              Lo que comenzó como un pequeño emprendimiento entre amigos apasionados por armar PCs,
              hoy es una tienda de referencia para quienes buscan componentes de calidad, asesoramiento
              honesto y una experiencia de compra pensada por y para gamers.
            </p>
            <p className="mb-4">
              Entendemos que cada build es única: desde la estación de trabajo para desarrollo
              hasta la máquina definitiva para gaming competitivo en 4K. Por eso curamos un catálogo
              con las mejores marcas, stock real y precios competitivos, respaldados por garantía oficial.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-8">
            <h2 className="font-display text-2xl font-semibold text-ink mb-4">Nuestra Misión</h2>
            <p className="mb-4">
              Democratizar el acceso a hardware de alto rendimiento en Argentina, ofreciendo no solo
              productos, sino el conocimiento necesario para que cada cliente tome la mejor decisión
              según su uso y presupuesto.
            </p>
            <p className="mb-4">
              Creemos que el soporte técnico no termina en la venta. Nuestro equipo está disponible
              para asesorar en la compatibilidad de componentes, resolver dudas de armado y brindar
              soporte post-venta real, porque sabemos que la confianza se construye con hechos.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-8">
            <h2 className="font-display text-2xl font-semibold text-ink mb-4">Valores</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li><strong className="text-ink">Transparencia:</strong> Stock real, precios claros, sin letras chicas.</li>
              <li><strong className="text-ink">Calidad:</strong> Solo trabajamos con distribuidores oficiales y marcas de primer nivel.</li>
              <li><strong className="text-ink">Comunidad:</strong> Escuchamos a nuestros clientes y mejoramos continuamente.</li>
              <li><strong className="text-ink">Pasión:</strong> Somos gamers, desarrolladores y entusiastas. Hablamos tu idioma.</li>
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
      </div>
    </main>
  );
}