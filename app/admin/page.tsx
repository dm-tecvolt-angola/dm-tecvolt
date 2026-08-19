"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Cliente = {
  id: number;
  created_at: string;
  nome: string;
  telefone: string;
  email: string | null;
  provincia: string;
  municipio: string;
  servico: string;
  descricao: string;
  estado: string | null;
};

const estados = [
  "Pendente",
  "Em análise",
  "Em execução",
  "Concluído",
  "Cancelado",
];

export default function AdminPage() {
  const router = useRouter();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [pedidoSelecionado, setPedidoSelecionado] =
    useState<Cliente | null>(null);

  async function terminarSessao() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  async function carregarPedidos() {
    setCarregando(true);
    setErro("");

    const {
      data: { user },
      error: erroUsuario,
    } = await supabase.auth.getUser();

    if (erroUsuario || !user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar pedidos:", error);
      setErro("Não foi possível carregar os pedidos.");
      setCarregando(false);
      return;
    }

    setClientes(data || []);
    setCarregando(false);
  }

  async function alterarEstado(id: number, novoEstado: string) {
    setErro("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error } = await supabase
      .from("clientes")
      .update({ estado: novoEstado })
      .eq("id", id);

    if (error) {
      console.error("Erro ao alterar estado:", error);
      setErro("Não foi possível alterar o estado do pedido.");
      return;
    }

    setClientes((pedidosAtuais) =>
      pedidosAtuais.map((cliente) =>
        cliente.id === id
          ? { ...cliente, estado: novoEstado }
          : cliente
      )
    );

    setPedidoSelecionado((pedidoAtual) =>
      pedidoAtual && pedidoAtual.id === id
        ? { ...pedidoAtual, estado: novoEstado }
        : pedidoAtual
    );
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  function formatarData(data: string) {
    return new Date(data).toLocaleString("pt-PT", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  function numeroWhatsApp(telefone: string) {
    let numero = telefone.replace(/\D/g, "");

    if (numero.startsWith("0")) {
      numero = `244${numero.substring(1)}`;
    }

    if (!numero.startsWith("244")) {
      numero = `244${numero}`;
    }

    return numero;
  }

  function abrirWhatsApp(cliente: Cliente) {
    const numero = numeroWhatsApp(cliente.telefone);

    const mensagem = encodeURIComponent(
      `Olá ${cliente.nome}, aqui é a DM-TECVOLT. Recebemos o seu pedido de ${cliente.servico} para ${cliente.municipio}, ${cliente.provincia}. Estamos a dar seguimento ao seu pedido. Em breve entraremos em contacto consigo. Obrigado!`
    );

    window.open(
      `https://wa.me/${numero}?text=${mensagem}`,
      "_blank"
    );
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const textoPesquisa = pesquisa.toLowerCase().trim();

    const correspondePesquisa =
      cliente.nome.toLowerCase().includes(textoPesquisa) ||
      cliente.telefone.toLowerCase().includes(textoPesquisa) ||
      cliente.servico.toLowerCase().includes(textoPesquisa) ||
      cliente.municipio.toLowerCase().includes(textoPesquisa) ||
      cliente.provincia.toLowerCase().includes(textoPesquisa);

    const correspondeEstado =
      filtroEstado === "Todos" ||
      (cliente.estado || "Pendente") === filtroEstado;

    return correspondePesquisa && correspondeEstado;
  });

  const totalPedidos = clientes.length;

  const totalPendentes = clientes.filter(
    (cliente) => (cliente.estado || "Pendente") === "Pendente"
  ).length;

  const totalAnalise = clientes.filter(
    (cliente) => cliente.estado === "Em análise"
  ).length;

  const totalExecucao = clientes.filter(
    (cliente) => cliente.estado === "Em execução"
  ).length;

  const totalConcluidos = clientes.filter(
    (cliente) => cliente.estado === "Concluído"
  ).length;

  const totalCancelados = clientes.filter(
    (cliente) => cliente.estado === "Cancelado"
  ).length;

  function classeEstado(estado: string | null) {
    switch (estado) {
      case "Em análise":
        return "bg-orange-100 text-orange-700";

      case "Em execução":
        return "bg-purple-100 text-purple-700";

      case "Concluído":
        return "bg-green-100 text-green-700";

      case "Cancelado":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* CABEÇALHO */}
      <section className="bg-blue-700 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-blue-200">
                Administração
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Pedidos de serviço
              </h1>

              <p className="mt-3 text-blue-100">
                Gestão dos pedidos recebidos pela DM-TECVOLT.
              </p>
            </div>

            <button
              onClick={terminarSessao}
              className="w-fit rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Terminar sessão
            </button>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          {/* ESTATÍSTICAS */}
          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total de pedidos
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-700">
                {totalPedidos}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Pendentes
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {totalPendentes}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Em análise
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                {totalAnalise}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Em execução
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {totalExecucao}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Concluídos
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {totalConcluidos}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Cancelados
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {totalCancelados}
              </p>
            </div>
          </div>

          {/* PESQUISA E FILTRO */}
          <div className="mb-6 grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2">
            <div>
              <label
                htmlFor="pesquisa"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Pesquisar pedido
              </label>

              <input
                id="pesquisa"
                type="text"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Nome, telefone, serviço, província ou município..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="filtroEstado"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Filtrar por estado
              </label>

              <select
                id="filtroEstado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Todos">Todos</option>

                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ATUALIZAR */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={carregarPedidos}
              disabled={carregando}
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando ? "A carregar..." : "↻ Atualizar pedidos"}
            </button>
          </div>

          {/* ERRO */}
          {erro && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {erro}
            </div>
          )}

          {/* CARREGAMENTO */}
          {carregando ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">
                A carregar pedidos...
              </p>
            </div>
          ) : clientes.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">📭</div>

              <h2 className="mt-4 text-2xl font-bold">
                Nenhum pedido encontrado
              </h2>

              <p className="mt-2 text-gray-500">
                Os pedidos enviados pelos clientes aparecerão aqui.
              </p>
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">🔎</div>

              <h2 className="mt-4 text-2xl font-bold">
                Nenhum resultado
              </h2>

              <p className="mt-2 text-gray-500">
                Não encontramos pedidos com os filtros selecionados.
              </p>
            </div>
          ) : (
            /* LISTA DE PEDIDOS */
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Cliente
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Contacto
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Serviço
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Localização
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Data
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Estado
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr
                        key={cliente.id}
                        className="border-t border-gray-200 align-top transition hover:bg-gray-50"
                      >
                        {/* CLIENTE */}
                        <td className="px-6 py-5">
                          <div className="font-semibold text-gray-900">
                            {cliente.nome}
                          </div>

                          {cliente.email && (
                            <div className="mt-1 text-sm text-gray-500">
                              {cliente.email}
                            </div>
                          )}
                        </td>

                        {/* CONTACTO */}
                        <td className="px-6 py-5">
                          <div className="font-medium">
                            {cliente.telefone}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <a
                              href={`tel:${cliente.telefone}`}
                              className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                            >
                              📞 Ligar
                            </a>

                            <button
                              onClick={() => abrirWhatsApp(cliente)}
                              className="rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-200"
                            >
                              💬 WhatsApp
                            </button>
                          </div>
                        </td>

                        {/* SERVIÇO */}
                        <td className="px-6 py-5">
                          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                            {cliente.servico}
                          </span>
                        </td>

                        {/* LOCALIZAÇÃO */}
                        <td className="px-6 py-5">
                          <div className="font-medium">
                            {cliente.municipio}
                          </div>

                          <div className="text-sm text-gray-500">
                            {cliente.provincia}
                          </div>
                        </td>

                        {/* DATA */}
                        <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                          {formatarData(cliente.created_at)}
                        </td>

                        {/* ESTADO */}
                        <td className="px-6 py-5">
                          <select
                            value={cliente.estado || "Pendente"}
                            onChange={(e) =>
                              alterarEstado(
                                cliente.id,
                                e.target.value
                              )
                            }
                            className={`rounded-lg border border-transparent px-3 py-2 text-sm font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${classeEstado(
                              cliente.estado
                            )}`}
                          >
                            {estados.map((estado) => (
                              <option key={estado} value={estado}>
                                {estado}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* AÇÕES */}
                        <td className="px-6 py-5">
                          <button
                            onClick={() =>
                              setPedidoSelecionado(cliente)
                            }
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                          >
                            👁 Ver detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MODAL DE DETALHES */}
      {pedidoSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPedidoSelecionado(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CABEÇALHO DO MODAL */}
            <div className="flex items-start justify-between border-b border-gray-200 p-6">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Pedido #{pedidoSelecionado.id}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {pedidoSelecionado.nome}
                </h2>
              </div>

              <button
                onClick={() => setPedidoSelecionado(null)}
                className="rounded-full bg-gray-100 px-3 py-2 text-gray-700 transition hover:bg-gray-200"
                aria-label="Fechar detalhes"
              >
                ✕
              </button>
            </div>

            {/* DETALHES */}
            <div className="space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Cliente
                  </p>

                  <p className="mt-1 font-semibold">
                    {pedidoSelecionado.nome}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Telefone
                  </p>

                  <p className="mt-1 font-semibold">
                    {pedidoSelecionado.telefone}
                  </p>
                </div>

                {pedidoSelecionado.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      E-mail
                    </p>

                    <p className="mt-1 break-all font-semibold">
                      {pedidoSelecionado.email}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Serviço
                  </p>

                  <p className="mt-1 font-semibold text-blue-700">
                    {pedidoSelecionado.servico}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Província
                  </p>

                  <p className="mt-1 font-semibold">
                    {pedidoSelecionado.provincia}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Município
                  </p>

                  <p className="mt-1 font-semibold">
                    {pedidoSelecionado.municipio}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Data do pedido
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatarData(pedidoSelecionado.created_at)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Estado
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold ${classeEstado(
                      pedidoSelecionado.estado
                    )}`}
                  >
                    {pedidoSelecionado.estado || "Pendente"}
                  </span>
                </div>
              </div>

              {/* DESCRIÇÃO */}
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm font-medium text-gray-500">
                  Descrição do pedido
                </p>

                <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
                  {pedidoSelecionado.descricao}
                </p>
              </div>

              {/* AÇÕES */}
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Contactar cliente
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`tel:${pedidoSelecionado.telefone}`}
                    className="flex flex-1 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
                  >
                    📞 Ligar
                  </a>

                  <button
                    onClick={() =>
                      abrirWhatsApp(pedidoSelecionado)
                    }
                    className="flex flex-1 items-center justify-center rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500"
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>

              {/* ALTERAR ESTADO */}
              <div>
                <label
                  htmlFor="estadoDetalhes"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Alterar estado do pedido
                </label>

                <select
                  id="estadoDetalhes"
                  value={pedidoSelecionado.estado || "Pendente"}
                  onChange={(e) =>
                    alterarEstado(
                      pedidoSelecionado.id,
                      e.target.value
                    )
                  }
                  className={`w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${classeEstado(
                    pedidoSelecionado.estado
                  )}`}
                >
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <button
                onClick={() => setPedidoSelecionado(null)}
                className="w-full rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
