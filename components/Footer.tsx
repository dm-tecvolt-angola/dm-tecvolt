import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Empresa */}
          <div>
            <h3 className="text-lg font-bold text-white">
              DM-TECVOLT
            </h3>

            <p className="mt-3 leading-7">
              Venda e Serviço (SU), LDA
            </p>

            <p className="mt-3 leading-7">
              Soluções elétricas, segurança eletrónica e manutenção técnica.
            </p>
          </div>

          {/* Contactos */}
          <div>
            <h3 className="text-lg font-bold text-white">
              Contactos
            </h3>

            <div className="mt-4 space-y-3">
              <a
                href="tel:+244949450344"
                className="block transition hover:text-white"
              >
                📞 +244 949 450 344
              </a>

              <a
                href="tel:+244972329802"
                className="block transition hover:text-white"
              >
                📞 +244 972 329 802
              </a>

              <a
                href="https://wa.me/244949450344"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition hover:text-white"
              >
                💬 WhatsApp — 949 450 344
              </a>

              <a
                href="https://wa.me/244972329802"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition hover:text-white"
              >
                💬 WhatsApp — 972 329 802
              </a>

              <a
                href="mailto:delfinongomamabuana03@gmail.com"
                className="block break-all transition hover:text-white"
              >
                ✉️ delfinongomamabuana03@gmail.com
              </a>
            </div>
          </div>

          {/* Localização */}
          <div>
            <h3 className="text-lg font-bold text-white">
              Onde estamos
            </h3>

            <p className="mt-4 leading-7">
              📍 Angola
              <br />
              Cabinda
              <br />
              Bairro Povo Grande
              <br />
              Rua das Forças Armadas
            </p>

            <Link
              href="/contactos"
              className="mt-5 inline-block font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Ver página de contactos →
            </Link>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} DM-TECVOLT. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}