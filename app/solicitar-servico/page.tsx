"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import { provincias, municipiosPorProvincia } from "@/data/angola";

type Pedido = {
  nome: string;
  telefone: string;
  provincia: string;
  municipio: string;
  servico: string;
  descricao: string;
};

export default function SolicitarServicoPage() {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  const [provinciaSelecionada, setProvinciaSelecionada] = useState("");
  const [municipioSelecionado, setMunicipioSelecionado] = useState("");

  const [pedido, setPedido] = useState<Pedido | null>(null);

  async function enviarPedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEnviando(true);
    setErro("");

    const form = event.currentTarget;
    const dados = new FormData(form);

    const nome = String(dados.get("nome") || "").trim();
    const telefone = String(dados.get("telefone") || "").trim();
    const provincia = String(dados.get("provincia") || "").trim();
    const municipio = String(dados.get("municipio") || "").trim();
    const servico = String(dados.get("servico") || "").trim();
    const descricao = String(dados.get("descricao") || "").trim();

   const { error } = await supabase
  .from("clientes")
  .insert({
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

    const novoPedido: Pedido = {
      nome,
      telefone,
      provincia,
      municipio,
      servico,
      descricao,
    };

    setPedido(novoPedido);
    setEnviado(true);
    setEnviando(false);

    form.reset();

    setProvinciaSelecionada("");
    setMunicipioSelecionado("");

    /*
     * Número do pedido criado no Supabase.
     */
   const numeroPedido = "Pedido recebido";
    /*
     * Limpar o número do cliente.
     */
    let numeroWhatsApp = telefone.replace(/\D/g, "");

    /*
     * Se o cliente escrever 9XXXXXXXX,
     * acrescentamos o código de Angola.
     */
    if (numeroWhatsApp.startsWith("9")) {
      numeroWhatsApp = "244" + numeroWhatsApp;
    }

    /*
     * Se escrever 09XXXXXXXX,
     * retiramos o zero e acrescentamos +244.
     */
    if (numeroWhatsApp.startsWith("0")) {
      numeroWhatsApp = "244" + numeroWhatsApp.substring(1);
    }

    /*
     * Caso ainda não tenha o código 244.
     */
    if (!numeroWhatsApp.startsWith("244")) {
      numeroWhatsApp = "244" + numeroWhatsApp;
    }

    /*
     * Mensagem que será aberta no WhatsApp.
     */
    const mensagem = encodeURIComponent(
      `Olá, ${nome}! 👋

A DM-TECVOLT confirma que recebeu o seu pedido de serviço.

📋 Número do pedido: ${numeroPedido}

🔧 Serviço: ${servico}

📍 Localização:
Província: ${provincia}
Município: ${municipio}

📝 Descrição:
${descricao}

📌 Estado: PENDENTE

A nossa equipa irá analisar o seu pedido e entrará em contacto consigo em breve.

Obrigado por escolher a DM-TECVOLT.`
    );

    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

    /*
     * Abre automaticamente o WhatsApp.
     */
    window.open(urlWhatsApp, "_blank");
  }

  function abrirWhatsAppNovamente() {
    if (!pedido) return;

    let numeroWhatsApp = pedido.telefone.replace(/\D/g, "");

    if (numeroWhatsApp.startsWith("9")) {
      numeroWhatsApp = "244" + numeroWhatsApp;
    }

    if (numeroWhatsApp.startsWith("0")) {
      numeroWhatsApp = "244" + numeroWhatsApp.substring(1);
    }

    if (!numeroWhatsApp.startsWith("244")) {
      numeroWhatsApp = "244" + numeroWhatsApp;
    }

    const mensagem = encodeURIComponent(
      `Olá, ${pedido.nome}! 👋

A DM-TECVOLT confirma que recebeu o seu pedido de serviço.

🔧 Serviço: ${pedido.servico}

📍 Localização:
Província: ${pedido.provincia}
Município: ${pedido.municipio}

📝 Descrição:
${pedido.descricao}

📌 Estado: PENDENTE

A nossa equipa irá analisar o seu pedido e entrará em contacto consigo em breve.

Obrigado por escolher a DM-TECVOLT.`
    );

    window.open(
      `https://wa.me/${numeroWhatsApp}?text=${mensagem}`,
      "_blank"
    );
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

              /* CONFIRMAÇÃO */
              <div className="py-12 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                  ✓
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  Pedido recebido!
                </h2>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
                  Obrigado pelo contacto. O seu pedido foi enviado com
                  sucesso para a DM-TECVOLT.
                </p>

                <div className="mx-auto mt-8 max-w-xl rounded-xl border border-green-200 bg-green-50 p-5 text-left">

                  <p className="font-semibold text-green-800">
                    💬 Confirmação pelo WhatsApp
                  </p>

                  <p className="mt-2 text-sm leading-6 text-green-700">
                    Abrimos o WhatsApp com uma mensagem de confirmação
                    preparada para si.
                  </p>

                  <p className="mt-2 text-sm font-medium text-green-700">
                    Basta verificar a mensagem e clicar em Enviar.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={abrirWhatsAppNovamente}
                  className="mt-6 w-full rounded-lg bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-500"
                >
                  💬 Abrir confirmação no WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEnviado(false);
                    setErro("");
                    setPedido(null);
                  }}
                  className="mt-4 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-600"
                >
                  Enviar outro pedido
                </button>

              </div>

            ) : (

              /* FORMULÁRIO */
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

                  <p className="mt-2 text-sm text-gray-500">
                    Este número será utilizado para abrir a confirmação no WhatsApp.
                  </p>

                </div>

                {/* Localização */}
                <div className="grid gap-6 md:grid-cols-2">

                  {/* Província */}
                  <div>

                    <label
                      htmlFor="provincia"
                      className="mb-2 block font-medium"
                    >
                      Província
                    </label>

                    <select
                      id="provincia"
                      name="provincia"
                      required
                      value={provinciaSelecionada}
                      onChange={(e) => {
                        setProvinciaSelecionada(e.target.value);
                        setMunicipioSelecionado("");
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    >

                      <option value="" disabled>
                        Selecione a província
                      </option>

                      {provincias.map((provincia) => (
                        <option
                          key={provincia}
                          value={provincia}
                        >
                          {provincia}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* Município */}
                  <div>

                    <label
                      htmlFor="municipio"
                      className="mb-2 block font-medium"
                    >
                      Município
                    </label>

                    <select
                      id="municipio"
                      name="municipio"
                      required
                      value={municipioSelecionado}
                      onChange={(e) =>
                        setMunicipioSelecionado(e.target.value)
                      }
                      disabled={!provinciaSelecionada}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >

                      <option value="" disabled>
                        {provinciaSelecionada
                          ? "Selecione o município"
                          : "Selecione primeiro a província"}
                      </option>

                      {provinciaSelecionada &&
                        municipiosPorProvincia[
                          provinciaSelecionada as keyof typeof municipiosPorProvincia
                        ]?.map((municipio: string) => (
                          <option
                            key={municipio}
                            value={municipio}
                          >
                            {municipio}
                          </option>
                        ))}

                    </select>

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
                  {enviando
                    ? "A enviar pedido..."
                    : "Enviar Pedido"}
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