export default function ContactosPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">

          <p className="font-semibold text-blue-200">
            Fale connosco
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Contacte a DM-TECVOLT
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Tem dúvidas, precisa de um orçamento ou pretende solicitar um
            serviço? Entre em contacto connosco e apresente-nos o seu projeto.
          </p>

        </div>
      </section>


      {/* CONTACTOS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {/* TELEFONE */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📞
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Telefone
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Entre em contacto connosco por telefone para obter
                informações sobre os nossos serviços.
              </p>

              <div className="mt-4 space-y-2">
                <a
                  href="tel:+244949450344"
                  className="block font-semibold text-blue-700 hover:underline"
                >
                  +244 949 450 344
                </a>

                <a
                  href="tel:+244972329802"
                  className="block font-semibold text-blue-700 hover:underline"
                >
                  +244 972 329 802
                </a>
              </div>

            </div>


            {/* WHATSAPP */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                💬
              </div>

              <h2 className="mt-5 text-xl font-bold">
                WhatsApp
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Fale diretamente connosco pelo WhatsApp para solicitar
                informações ou apresentar o seu projeto.
              </p>

              <div className="mt-4 space-y-2">

                <a
                  href="https://wa.me/244949450344"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-semibold text-green-700 hover:underline"
                >
                  WhatsApp — 949 450 344
                </a>

                <a
                  href="https://wa.me/244972329802"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-semibold text-green-700 hover:underline"
                >
                  WhatsApp — 972 329 802
                </a>

              </div>

            </div>


            {/* EMAIL */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                ✉️
              </div>

              <h2 className="mt-5 text-xl font-bold">
                E-mail
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Envie-nos uma mensagem por e-mail para informações,
                orçamentos ou outros assuntos.
              </p>

              <a
                href="mailto:delfinongomamabuana03@gmail.com"
                className="mt-4 block break-all font-semibold text-blue-700 hover:underline"
              >
                delfinongomamabuana03@gmail.com
              </a>

            </div>


            {/* LOCALIZAÇÃO */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📍
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Localização
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Estamos localizados em Cabinda e atendemos clientes
                e projetos em diferentes localidades de Angola.
              </p>

              <p className="mt-4 font-semibold leading-7 text-blue-700">
                Angola
                <br />
                Cabinda
                <br />
                Bairro Povo Grande
                <br />
                Rua das Forças Armadas
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ATENDIMENTO */}
      <section className="bg-gray-50 py-20">

        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:items-center">

          {/* TEXTO */}
          <div>

            <p className="font-semibold text-blue-700">
              Atendimento
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Estamos prontos para ouvir o seu projeto
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Explique-nos o que pretende realizar. A nossa equipa poderá
              analisar a sua necessidade e indicar a solução mais adequada
              para o seu projeto.
            </p>

            <a
              href="/solicitar-servico"
              className="mt-8 inline-block rounded-lg bg-blue-700 px-7 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Solicitar Serviço
            </a>

          </div>


          {/* INFORMAÇÕES */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <h3 className="text-2xl font-bold">
              Por que contactar a DM-TECVOLT?
            </h3>

            <ul className="mt-6 space-y-4">

              {[
                "Atendimento profissional",
                "Soluções adaptadas ao projeto",
                "Foco na segurança e qualidade",
                "Serviços elétricos e segurança eletrónica",
                "Análise das necessidades do cliente",
                "Compromisso com cada projeto",
              ].map((item) => (

                <li
                  key={item}
                  className="flex items-center gap-3 text-gray-700"
                >

                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    ✓
                  </span>

                  {item}

                </li>

              ))}

            </ul>

          </div>

        </div>

      </section>


      {/* HORÁRIO */}
      <section className="py-20">

        <div className="mx-auto max-w-4xl px-6">

          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-10">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              🕐
            </div>

            <h2 className="mt-5 text-3xl font-bold">
              Horário de atendimento
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              Para melhor atendimento, recomendamos entrar em contacto
              durante o nosso horário de funcionamento.
            </p>

            <div className="mx-auto mt-8 max-w-md space-y-3 text-left">

              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="font-medium">
                  Segunda a Sexta
                </span>

                <span className="font-semibold text-blue-700">
                  08:00 – 17:00
                </span>
              </div>

              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="font-medium">
                  Sábado
                </span>

                <span className="font-semibold text-blue-700">
                  08:00 – 13:00
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">
                  Domingo
                </span>

                <span className="font-semibold text-gray-500">
                  Encerrado
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="bg-gray-950 py-16 text-white">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="text-3xl font-bold md:text-4xl">
            Precisa de uma solução profissional?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Solicite um serviço e apresente-nos os detalhes do seu projeto.
          </p>

          <a
            href="/solicitar-servico"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-500"
          >
            Solicitar Serviço
          </a>

        </div>

      </section>

    </main>
  );
}