import Image from "next/image";
import Link from "next/link";

const servicos = [
  {
    title: "CCTV e Videovigilância",
    description:
      "Instalação e configuração de sistemas de câmaras de segurança para residências, empresas e estabelecimentos.",
    image: "/images/servicos/cctv.jpeg",
  },
  {
    title: "Instalações Elétricas",
    description:
      "Soluções elétricas para instalações residenciais, comerciais e industriais, com foco em segurança e qualidade.",
    image: "/images/servicos/eletrica.jpeg",
  },
  {
    title: "Cerca Elétrica",
    description:
      "Sistemas de proteção perimetral para aumentar a segurança de residências, empresas e instalações.",
    image: "/images/servicos/cerca.jpeg",
  },
  {
    title: "Videoporteiro",
    description:
      "Instalação de sistemas modernos de comunicação e controlo de acesso.",
    image: "/images/servicos/videoporteiro.jpeg",
  },
  {
    title: "Manutenção Técnica",
    description:
      "Diagnóstico, manutenção preventiva, manutenção corretiva e reparação de equipamentos e instalações.",
    image: "/images/servicos/manutencao.jpeg",
  },
  {
    title: "Segurança Eletrónica",
    description:
      "Soluções integradas de segurança para proteção de pessoas, património e instalações.",
    image: "/images/servicos/seguranca.jpg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/servicos/eletrica.jpeg"
            alt="Instalações elétricas DM-TECVOLT"
            fill
            priority
            className="object-cover opacity-30"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-36">
          <div className="max-w-4xl">
            <span className="inline-block rounded-full bg-blue-600/90 px-4 py-2 text-sm font-semibold">
              DM-TECVOLT — Venda e Serviço (SU), LDA
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Tecnologia, segurança e energia para o seu projeto.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-200 md:text-xl">
              Soluções profissionais em instalações elétricas, CCTV,
              segurança eletrónica, cerca elétrica, videoporteiro e
              manutenção técnica.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/solicitar-servico"
                className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500"
              >
                Solicitar Serviço
              </Link>

              <Link
                href="#servicos"
                className="rounded-lg border border-white/70 px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-gray-900"
              >
                Ver Serviços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="border-b bg-white py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              ✓
            </div>

            <div>
              <h3 className="font-bold">Qualidade</h3>
              <p className="text-sm text-gray-600">
                Soluções pensadas para durar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              🛡️
            </div>

            <div>
              <h3 className="font-bold">Segurança</h3>
              <p className="text-sm text-gray-600">
                Proteção para pessoas e património
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
              ⚡
            </div>

            <div>
              <h3 className="font-bold">Profissionalismo</h3>
              <p className="text-sm text-gray-600">
                Compromisso com cada projeto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-3xl">
            <p className="font-semibold text-blue-700">
              O que fazemos
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Soluções técnicas para diferentes necessidades
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              A DM-TECVOLT oferece serviços especializados para clientes
              residenciais, comerciais e empresariais.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {servicos.map((servico) => (
              <article
                key={servico.title}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={servico.image}
                    alt={servico.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <h3 className="text-xl font-bold">
                    {servico.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {servico.description}
                  </p>

                  <Link
                    href="/servicos"
                    className="mt-5 inline-block font-semibold text-blue-700 hover:text-blue-600"
                  >
                    Saber mais →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/servicos"
              className="inline-block rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Ver todos os serviços
            </Link>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="bg-gray-50 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-semibold text-blue-700">
              Sobre a DM-TECVOLT
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Soluções técnicas com foco em segurança e qualidade
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Trabalhamos para oferecer soluções adequadas às necessidades
              de cada cliente, combinando conhecimento técnico, equipamentos
              e boas práticas de instalação.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              O nosso objetivo é proporcionar serviços confiáveis e
              profissionais em instalações elétricas e segurança eletrónica.
            </p>

            <Link
              href="/sobre"
              className="mt-7 inline-block rounded-lg border border-blue-700 px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
            >
              Conhecer a empresa
            </Link>
          </div>

          <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg md:h-[420px]">
            <Image
              src="/images/servicos/eletrica.jpeg"
              alt="Instalação elétrica"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* PROJETOS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-blue-700">
                Portfólio
              </p>

              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Projetos e trabalhos
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-gray-600">
                Conheça alguns dos tipos de trabalhos realizados pela
                DM-TECVOLT.
              </p>
            </div>

            <Link
              href="/projetos"
              className="font-semibold text-blue-700 hover:text-blue-600"
            >
              Ver projetos →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="relative h-64 overflow-hidden rounded-2xl">
              <Image
                src="/images/servicos/cctv.jpeg"
                alt="Projeto CCTV"
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="relative h-64 overflow-hidden rounded-2xl">
              <Image
                src="/images/servicos/cerca.jpeg"
                alt="Projeto de cerca elétrica"
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="relative h-64 overflow-hidden rounded-2xl">
              <Image
                src="/images/servicos/videoporteiro.jpeg"
                alt="Projeto de videoporteiro"
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Tem um projeto para realizar?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Fale com a DM-TECVOLT e explique-nos o que precisa. Estamos
            prontos para analisar a melhor solução para o seu projeto.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/solicitar-servico"
              className="rounded-lg bg-white px-7 py-3.5 font-semibold text-blue-700 transition hover:bg-gray-100"
            >
              Solicitar Serviço
            </Link>

            <Link
              href="/contactos"
              className="rounded-lg border border-white px-7 py-3.5 font-semibold text-white transition hover:bg-blue-600"
            >
              Contactar-nos
            </Link>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
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
                Soluções elétricas, segurança eletrónica e manutenção
                técnica.
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

          <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm">
            <p>
              © {new Date().getFullYear()} DM-TECVOLT. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}