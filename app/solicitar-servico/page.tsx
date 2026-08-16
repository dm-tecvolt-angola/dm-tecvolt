"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SolicitarServicoPage() {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function enviarPedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEnviando(true);
    setErro("");

    const form = event.currentTarget;
    const dados = new FormData(form);

    const nome = String(dados.get("nome") || "");
    const telefone = String(dados.get("telefone") || "");
    const provincia = String(dados.get("provincia") || "");
    const municipio = String(dados.get("municipio") || "");
    const servico = String(dados.get("servico") || "");
    const descricao = String(dados.get("descricao") || "");

    const { error } = await supabase.from("clientes").insert({
      nome,
      telefone,
      provincia,
      municipio,
      servico,
      descricao,
      estado: "pendente",
    });

    if (error) {
      console.error(
  "Erro ao enviar pedido:",
  JSON.stringify(error, null, 2)
);
      setErro(
        "Não foi possível enviar o pedido. Verifique a ligação e tente novamente."
      );
      setEnviando(false);
      return;
    }

    setEnviado(true);
    setEnviando(false);
    form.reset();
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Cabeçalho */}
      <section className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-semibold text-blue-200">
            Solicitação de serviço
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Conte-nos o que precisa
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Preencha o formulário abaixo com os detalhes do seu projeto.
            Entraremos em contacto para analisar a sua necessidade.
          </p>
        </div>
      </section>

      {/* Formulário */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
            {enviado ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                  ✓
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  Pedido recebido!
                </h2>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
                  Obrigado pelo contacto. O seu pedido foi enviado com
                  sucesso para a DM-TECVOLT. Entraremos em contacto consigo
                  em breve.
                </p>

                <button
                  onClick={() => {
                    setEnviado(false);
                    setErro("");
                  }}
                  className="mt-8 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-600"
                >
                  Enviar outro pedido
                </button>
              </div>
            ) : (
              <form onSubmit={enviarPedido} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Dados do cliente
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Preencha os seus dados para podermos entrar em contacto.
                  </p>
                </div>

                {/* Nome */}
                <div>
                  <label
                    htmlFor="nome"
                    className="mb-2 block font-medium"
                  >
                    Nome completo
                  </label>

                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    placeholder="Digite o seu nome completo"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label
                    htmlFor="telefone"
                    className="mb-2 block font-medium"
                  >
                    Telefone / WhatsApp
                  </label>

                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    required
                    placeholder="Ex.: +244 9XX XXX XXX"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Localização */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="provincia"
                      className="mb-2 block font-medium"
                    >
                      Província
                    </label>

                    <input
                      id="provincia"
                      name="provincia"
                      type="text"
                      required
                      placeholder="Ex.: Cabinda"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="municipio"
                      className="mb-2 block font-medium"
                    >
                      Município
                    </label>

                    <input
                      id="municipio"
                      name="municipio"
                      type="text"
                      required
                      placeholder="Digite o município"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Serviço */}
                <div>
                  <label
                    htmlFor="servico"
                    className="mb-2 block font-medium"
                  >
                    Serviço pretendido
                  </label>

                  <select
                    id="servico"
                    name="servico"
                    required
                    defaultValue=""
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      Selecione um serviço
                    </option>

                    <option value="CCTV e Videovigilância">
                      CCTV e Videovigilância
                    </option>

                    <option value="Instalações Elétricas">
                      Instalações Elétricas
                    </option>

                    <option value="Cerca Elétrica">
                      Cerca Elétrica
                    </option>

                    <option value="Videoporteiro">
                      Videoporteiro
                    </option>

                    <option value="Manutenção Técnica">
                      Manutenção Técnica
                    </option>

                    <option value="Segurança Eletrónica">
                      Segurança Eletrónica
                    </option>
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label
                    htmlFor="descricao"
                    className="mb-2 block font-medium"
                  >
                    Descrição do pedido
                  </label>

                  <textarea
                    id="descricao"
                    name="descricao"
                    required
                    rows={6}
                    placeholder="Descreva o trabalho que pretende realizar..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Mensagem de erro */}
                {erro && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {erro}
                  </div>
                )}

                {/* Botão */}
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enviando ? "A enviar pedido..." : "Enviar Pedido"}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Os seus dados serão utilizados apenas para responder à sua
                  solicitação.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}