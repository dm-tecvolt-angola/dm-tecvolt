"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { provincias, municipiosPorProvincia } from "@/data/angola";

export default function SolicitarServicoPage() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [provincia, setProvincia] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [servico, setServico] = useState("");
  const [descricao, setDescricao] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  // =========================================================
  // WHATSAPP OFICIAL DA DM-TECVOLT
  // Número: 949 450 344
  // =========================================================
  const WHATSAPP_EMPRESA = "244949450344";

  // =========================================================
  // NORMALIZAR TELEFONE DO CLIENTE
  // =========================================================
  function normalizarTelefone(numero: string) {
    let telefoneLimpo = numero.replace(/\D/g, "");

    if (telefoneLimpo.startsWith("244")) {
      return `+${telefoneLimpo}`;
    }

    if (telefoneLimpo.startsWith("9")) {
      return `+244${telefoneLimpo}`;
    }

    return `+244${telefoneLimpo}`;
  }

  // =========================================================
  // ABRIR WHATSAPP DA EMPRESA
  // =========================================================
  function abrirWhatsApp() {
    const telefoneCliente = normalizarTelefone(telefone);

    const texto = `Olá, DM-TECVOLT! 👋

Acabei de enviar um pedido de serviço através do vosso site.

👤 Nome: ${nome}
📞 Telefone: ${telefoneCliente}
📋 Serviço: ${servico}
📍 Província: ${provincia}
📍 Município: ${municipio}

📝 Descrição:
${descricao}

Fico a aguardar o contacto da equipa da DM-TECVOLT.

Obrigado.`;

    const urlWhatsApp = `https://wa.me/${WHATSAPP_EMPRESA}?text=${encodeURIComponent(
      texto
    )}`;

    window.open(urlWhatsApp, "_blank");
  }

  // =========================================================
  // ENVIAR PEDIDO
  // =========================================================
  async function enviarPedido(e: React.FormEvent) {
    e.preventDefault();

    setMensagem("");
    setSucesso(false);

    // Verificar campos obrigatórios
    if (
      !nome.trim() ||
      !telefone.trim() ||
      !provincia ||
      !municipio ||
      !servico ||
      !descricao.trim()
    ) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    setEnviando(true);

    try {
      const telefoneNormalizado = normalizarTelefone(telefone);

      // =====================================================
      // GUARDAR PEDIDO NO SUPABASE
      // =====================================================
      const { error } = await supabase.from("clientes").insert({
        nome: nome.trim(),
        telefone: telefoneNormalizado,
        provincia,
        municipio,
        servico,
        descricao: descricao.trim(),
        estado: "pendente",
      });

      if (error) {
        console.error("Erro ao guardar pedido:", error);

        setMensagem(
          "Não foi possível enviar o pedido. Por favor, tente novamente."
        );

        setEnviando(false);
        return;
      }

      // =====================================================
      // PEDIDO GRAVADO COM SUCESSO
      // =====================================================
      setSucesso(true);

      // Abrir WhatsApp da empresa
      setTimeout(() => {
        abrirWhatsApp();
      }, 500);
    } catch (error) {
      console.error("Erro inesperado:", error);

      setMensagem(
        "Ocorreu um erro inesperado. Por favor, tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  // =========================================================
  // PÁGINA DE CONFIRMAÇÃO
  // =========================================================
  if (sucesso) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
            {/* ÍCONE DE SUCESSO */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl text-green-600">✓</span>
            </div>

            {/* TÍTULO */}
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Pedido recebido!
            </h1>

            {/* MENSAGEM */}
            <p className="mb-3 text-lg text-gray-700">
              Obrigado pelo contacto.
            </p>

            <p className="mb-8 text-gray-600">
              A <strong>DM-TECVOLT</strong> recebeu o seu pedido de serviço e
              entrará em contacto consigo em breve.
            </p>

            {/* WHATSAPP */}
            <div className="mb-6 rounded-xl bg-green-50 p-5 text-left">
              <h2 className="mb-2 font-semibold text-green-800">
                💬 Confirmação pelo WhatsApp
              </h2>

              <p className="text-sm text-green-700">
                O WhatsApp da DM-TECVOLT foi aberto com uma mensagem preparada
                com os dados do seu pedido.
              </p>

              <p className="mt-2 text-sm text-green-700">
                Verifique a mensagem e clique em <strong>Enviar</strong>.
              </p>
            </div>

            {/* BOTÃO WHATSAPP */}
            <button
              onClick={abrirWhatsApp}
              className="w-full rounded-xl bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700"
            >
              💬 Abrir WhatsApp da DM-TECVOLT
            </button>

            {/* NOVO PEDIDO */}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Fazer outro pedido
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // FORMULÁRIO
  // =========================================================
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* CABEÇALHO */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Solicitar Serviço
          </h1>

          <p className="mt-3 text-gray-600">
            Preencha o formulário e a equipa da DM-TECVOLT entrará em
            contacto consigo.
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form
          onSubmit={enviarPedido}
          className="rounded-2xl bg-white p-6 shadow-lg md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* =================================================
                NOME
            ================================================= */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Nome completo
              </label>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o seu nome"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* =================================================
                TELEFONE
            ================================================= */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Telefone / WhatsApp
              </label>

              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex.: 949450344"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* =================================================
                PROVÍNCIA
            ================================================= */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Província
              </label>

              <select
                value={provincia}
                onChange={(e) => {
                  setProvincia(e.target.value);
                  setMunicipio("");
                }}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Selecione a província</option>

                {provincias.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* =================================================
                MUNICÍPIO
            ================================================= */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Município
              </label>

              <select
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                disabled={!provincia}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-100"
              >
                <option value="">
                  {provincia
                    ? "Selecione o município"
                    : "Primeiro selecione a província"}
                </option>

                {provincia &&
                  municipiosPorProvincia[
                    provincia as keyof typeof municipiosPorProvincia
                  ]?.map((item: string) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>

            {/* =================================================
                SERVIÇO
            ================================================= */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
                Serviço pretendido
              </label>

              <select
                value={servico}
                onChange={(e) => setServico(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Selecione um serviço</option>

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

            {/* =================================================
                DESCRIÇÃO
            ================================================= */}
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium text-gray-700">
                Descrição do serviço
              </label>

              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Explique brevemente o serviço que pretende..."
                rows={6}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* =================================================
              MENSAGEM DE ERRO
          ================================================= */}
          {mensagem && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {mensagem}
            </div>
          )}

          {/* =================================================
              BOTÃO ENVIAR
          ================================================= */}
          <button
            type="submit"
            disabled={enviando}
            className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "A enviar pedido..." : "Enviar pedido"}
          </button>

          {/* INFORMAÇÃO */}
          <p className="mt-4 text-center text-sm text-gray-500">
            Após o envio, o WhatsApp da DM-TECVOLT será aberto para facilitar
            o acompanhamento do seu pedido.
          </p>
        </form>
      </div>
    </main>
  );
}