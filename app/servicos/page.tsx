import Image from "next/image";
const servicos = [
  {
    numero: "01",
    titulo: "Instalações Elétricas",
    imagem: "/images/servicos/eletrica.jpeg",
    descricao:
      "Execução e manutenção de instalações elétricas residenciais, comerciais e industriais, com foco em segurança e qualidade.",
    itens: [
      "Instalações elétricas",
      "Quadros elétricos",
      "Iluminação",
      "Manutenção elétrica",
    ],
  },
  {
    numero: "02",
    titulo: "CCTV e Videovigilância",
    imagem: "/images/servicos/cctv.jpeg",
    descricao:
      "Instalação de sistemas de videovigilância para monitorização e proteção de residências, empresas e estabelecimentos.",
    itens: [
      "Câmaras de segurança",
      "DVR e NVR",
      "Monitorização remota",
      "Configuração de sistemas",
    ],
  },
  {
    numero: "03",
    titulo: "Cerca Elétrica",
    imagem: "/images/servicos/cerca.jpeg",
    descricao:
      "Soluções de proteção perimetral para aumentar a segurança de residências, empresas e instalações.",
    itens: [
      "Instalação de cerca elétrica",
      "Eletrificadores",
      "Manutenção",
      "Proteção perimetral",
    ],
  },
  {
    numero: "04",
    titulo: "Videoporteiro",
    imagem: "/images/servicos/videoporteiro.jpeg",
    descricao:
      "Instalação de sistemas de comunicação e controlo de acesso para maior segurança e comodidade.",
    itens: [
      "Videoporteiros",
      "Intercomunicadores",
      "Controlo de acesso",
      "Configuração",
    ],
  },
  {
    numero: "05",
    titulo: "Manutenção Técnica",
    imagem: "/images/servicos/manutencao.jpeg",
    descricao:
      "Diagnóstico, manutenção preventiva e corretiva de instalações e equipamentos técnicos.",
    itens: [
      "Diagnóstico de avarias",
      "Manutenção preventiva",
      "Manutenção corretiva",
      "Reparações",
    ],
  },
  {
    numero: "06",
    titulo: "Segurança Eletrónica",
    imagem: "/images/servicos/seguranca.jpg",
    descricao:
      "Soluções integradas de segurança eletrónica para proteção de pessoas, património e instalações.",
    itens: [
      "Sistemas de segurança",
      "Controlo de acesso",
      "Alarmes",
      "Integração de soluções",
    ],
  },
];
export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-semibold text-blue-200">
            Nossos serviços
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-bold md:text-5xl">
            Soluções profissionais para energia, segurança e tecnologia
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Na DM-TECVOLT desenvolvemos soluções técnicas adaptadas às
            necessidades de cada cliente, desde instalações elétricas até
            sistemas modernos de segurança eletrónica.
          </p>
        </div>
      </section>

      {/* Lista de serviços */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {servicos.map((servico) => (
              <article
                key={servico.numero}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="relative h-56 w-full overflow-hidden rounded-xl">
  <Image
    src={servico.imagem}
    alt={servico.titulo}
    fill
    className="object-cover transition duration-500 group-hover:scale-105"
  />
</div>

                  <span className="text-4xl font-bold text-gray-100 transition group-hover:text-blue-100">
                    {servico.numero}
                  </span>
                </div>

                <h2 className="mt-7 text-2xl font-bold">
                  {servico.titulo}
                </h2>

                <p className="mt-4 leading-7 text-gray-600">
                  {servico.descricao}
                </p>

                <ul className="mt-6 space-y-3">
                  {servico.itens.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        ✓
                      </span>

                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Processo */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="font-semibold text-blue-700">
              Como trabalhamos
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Do pedido à execução
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                numero: "01",
                titulo: "Pedido",
                texto: "O cliente apresenta a sua necessidade.",
              },
              {
                numero: "02",
                titulo: "Avaliação",
                texto: "Analisamos o projeto e identificamos a melhor solução.",
              },
              {
                numero: "03",
                titulo: "Execução",
                texto: "A nossa equipa realiza o trabalho com responsabilidade.",
              },
              {
                numero: "04",
                titulo: "Entrega",
                texto: "Entregamos a solução e verificamos o seu funcionamento.",
              },
            ].map((etapa) => (
              <div
                key={etapa.numero}
                className="rounded-xl bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
                  {etapa.numero}
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {etapa.titulo}
                </h3>

                <p className="mt-3 leading-6 text-gray-600">
                  {etapa.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Precisa de um destes serviços?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Envie o seu pedido e explique-nos o que precisa. A DM-TECVOLT
            analisará a sua necessidade.
          </p>

          <a
            href="/solicitar-servico"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-500"
          >
            Solicitar Serviço
          </a>
        </div>
      </section>
    </main>
  );
}