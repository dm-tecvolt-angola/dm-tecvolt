import Image from "next/image";
import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">

          <p className="mb-3 font-semibold text-blue-200">
            Sobre a DM-TECVOLT
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            Soluções técnicas com profissionalismo, segurança e confiança
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Somos uma empresa dedicada à prestação de serviços técnicos,
            instalações elétricas e soluções de segurança eletrónica para
            clientes residenciais, comerciais e empresariais.
          </p>

        </div>
      </section>

      {/* QUEM SOMOS */}
      <section className="py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">

          <div>
            <p className="font-semibold text-blue-700">
              Quem somos
            </p>

            <h2 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
              DM-TECVOLT, Venda e Serviço (SU), LDA
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              A DM-TECVOLT atua na área de soluções elétricas e segurança
              eletrónica, oferecendo serviços técnicos orientados para a
              qualidade, segurança e satisfação dos nossos clientes.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Trabalhamos com responsabilidade e procuramos desenvolver
              soluções adequadas às necessidades de cada projeto, desde
              instalações elétricas até sistemas modernos de videovigilância,
              proteção perimetral, videoporteiro e outras soluções de
              segurança eletrónica.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/servicos"
                className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
              >
                Conhecer os serviços
              </Link>

              <Link
                href="/solicitar-servico"
                className="rounded-lg border border-blue-700 px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
              >
                Solicitar Serviço
              </Link>
            </div>
          </div>

          {/* IMAGEM */}
          <div className="relative h-80 overflow-hidden rounded-2xl shadow-xl md:h-[440px]">
            <Image
              src="/images/projetos/eletrica.jpeg"
              alt="Projeto de instalação elétrica realizado pela DM-TECVOLT"
              fill
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>

        </div>
      </section>

      {/* ÁREAS DE ATUAÇÃO */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">
            <p className="font-semibold text-blue-700">
              Áreas de atuação
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              O que fazemos
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              Desenvolvemos soluções técnicas para melhorar a segurança,
              eficiência e funcionamento das instalações dos nossos clientes.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                ⚡
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Instalações Elétricas
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Instalações elétricas residenciais, comerciais e industriais,
                manutenção e organização de sistemas elétricos.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📹
              </div>

              <h3 className="mt-5 text-xl font-bold">
                CCTV e Videovigilância
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Sistemas de câmaras para monitorização e proteção de
                residências, empresas e estabelecimentos.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🛡️
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Segurança Eletrónica
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Soluções de segurança eletrónica adaptadas às necessidades
                específicas de cada instalação.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🔒
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Cerca Elétrica
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Proteção perimetral para aumentar a segurança de residências,
                empresas e outras instalações.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📞
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Videoporteiro
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Sistemas de comunicação e controlo de acesso para melhorar a
                segurança e comodidade.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🔧
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Manutenção Técnica
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Diagnóstico, manutenção preventiva, manutenção corretiva e
                reparação de equipamentos e instalações.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* MISSÃO, VISÃO E VALORES */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">
            <p className="font-semibold text-blue-700">
              O que nos orienta
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Missão, visão e valores
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {/* MISSÃO */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🎯
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Missão
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Prestar serviços técnicos de qualidade, oferecendo soluções
                elétricas e de segurança que respondam às necessidades dos
                nossos clientes.
              </p>

            </div>

            {/* VISÃO */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🚀
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Visão
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Tornar-nos uma referência em soluções elétricas e segurança
                eletrónica, reconhecida pela qualidade, confiança e inovação.
              </p>

            </div>

            {/* VALORES */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                🤝
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Valores
              </h3>

              <p className="mt-4 leading-7 text-gray-600">
                Responsabilidade, profissionalismo, segurança, qualidade,
                honestidade, inovação e compromisso com o cliente.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-gray-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-10 md:grid-cols-3">

            <div>
              <div className="text-3xl">✓</div>

              <h3 className="mt-4 text-xl font-bold">
                Compromisso
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Procuramos cumprir cada projeto com responsabilidade e
                atenção às necessidades do cliente.
              </p>
            </div>

            <div>
              <div className="text-3xl">🛡️</div>

              <h3 className="mt-4 text-xl font-bold">
                Segurança
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                A segurança das pessoas, equipamentos e instalações está no
                centro das nossas soluções.
              </p>
            </div>

            <div>
              <div className="text-3xl">⚙️</div>

              <h3 className="mt-4 text-xl font-bold">
                Soluções adequadas
              </h3>

              <p className="mt-3 leading-7 text-gray-400">
                Procuramos desenvolver soluções de acordo com as características
                e necessidades de cada projeto.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="text-3xl font-bold md:text-4xl">
            Vamos trabalhar no seu projeto?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Entre em contacto com a DM-TECVOLT para conhecer as nossas
            soluções e solicitar um serviço.
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

    </main>
  );
}