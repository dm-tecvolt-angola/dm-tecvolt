import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projetos de Instalações Elétricas e Segurança",
  description:
    "Conheça projetos da DM-TECVOLT em instalações elétricas, CCTV, videovigilância, cerca elétrica, videoporteiro, manutenção técnica e segurança eletrónica em Angola.",

  keywords: [
    "projetos elétricos Angola",
    "projetos de segurança eletrónica Angola",
    "CCTV Angola",
    "videovigilância Angola",
    "cerca elétrica Angola",
    "videoporteiro Angola",
    "instalação elétrica Cabinda",
    "segurança eletrónica Cabinda",
    "manutenção técnica Angola",
    "DM-TECVOLT",
  ],

  openGraph: {
    title: "Projetos | DM-TECVOLT",
    description:
      "Conheça projetos e soluções da DM-TECVOLT em instalações elétricas e segurança eletrónica.",
    url: "https://dm-tecvolt.vercel.app/projetos",
    siteName: "DM-TECVOLT",
    type: "website",
  },
};

const projetos = [
  {
    categoria: "CCTV",
    titulo: "Sistema de Videovigilância",
    imagem: "/images/projetos/cctv.jpeg",
    descricao:
      "Instalação e configuração de sistema de câmaras de segurança para monitorização e proteção de instalações.",
  },
  {
    categoria: "Instalação Elétrica",
    titulo: "Instalação Elétrica",
    imagem: "/images/projetos/eletrica.jpeg",
    descricao:
      "Execução de instalação elétrica com organização e distribuição adequada dos circuitos, priorizando segurança e qualidade.",
  },
  {
    categoria: "Segurança",
    titulo: "Proteção Perimetral",
    imagem: "/images/projetos/cerca.jpeg",
    descricao:
      "Implementação de solução de segurança perimetral para aumentar a proteção de residências, empresas e instalações.",
  },
  {
    categoria: "Videoporteiro",
    titulo: "Sistema de Videoporteiro",
    imagem: "/images/projetos/videoport.jpeg",
    descricao:
      "Instalação de sistema de videoporteiro para comunicação, identificação de visitantes e controlo de acesso.",
  },
  {
    categoria: "Manutenção",
    titulo: "Manutenção Técnica",
    imagem: "/images/projetos/manutencao.jpeg",
    descricao:
      "Diagnóstico e manutenção preventiva e corretiva de equipamentos e instalações técnicas.",
  },
  {
    categoria: "Segurança Eletrónica",
    titulo: "Solução Integrada de Segurança",
    imagem: "/images/projetos/seguranca.jpg",
    descricao:
      "Implementação de equipamentos e soluções de segurança eletrónica adaptados às necessidades de cada cliente.",
  },
];

export default function ProjetosPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-semibold text-blue-200">
            Portfólio da DM-TECVOLT
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Projetos de instalações elétricas e segurança eletrónica
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Conheça alguns dos tipos de projetos e trabalhos realizados pela
            DM-TECVOLT em instalações elétricas, CCTV, videovigilância,
            segurança eletrónica, proteção perimetral, videoporteiro e
            manutenção técnica.
          </p>
        </div>
      </section>

      {/* Projetos */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projetos.map((projeto) => (
              <article
                key={projeto.titulo}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Fotografia */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={projeto.imagem}
                    alt={`${projeto.titulo} - DM-TECVOLT`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Informações */}
                <div className="p-7">
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    {projeto.categoria}
                  </span>

                  <h2 className="mt-5 text-2xl font-bold">
                    {projeto.titulo}
                  </h2>

                  <p className="mt-4 leading-7 text-gray-600">
                    {projeto.descricao}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Chamada para ação */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Tem um projeto em mente?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Fale com a DM-TECVOLT e apresente-nos o seu projeto. Podemos
            analisar a sua necessidade e indicar uma solução adequada.
          </p>

          <Link
            href="/solicitar-servico"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-500"
          >
            Solicitar Serviço
          </Link>
        </div>
      </section>
    </main>
  );
}