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

export default function AdminPage() {
  const router = useRouter();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [novoPedidoAviso, setNovoPedidoAviso] = useState(false);

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

  const cliente = clientes.find((item) => item.id === id);

  if (!cliente) {
    setErro("Pedido não encontrado.");
    return;
  }

  const estadoAnterior = cliente.estado || "Pendente";

  if (estadoAnterior === novoEstado) {
    return;
  }

  // Atualizar o estado do pedido
  const { error: erroAtualizacao } = await supabase
    .from("clientes")
    .update({ estado: novoEstado })
    .eq("id", id);

  if (erroAtualizacao) {
    console.error(
      "Erro ao alterar estado:",
      erroAtualizacao
    );

    setErro("Não foi possível alterar o estado do pedido.");
    return;
  }

  // Guardar alteração no histórico
  const { error: erroHistorico } = await supabase
    .from("historico_pedidos")
    .insert({
      cliente_id: id,
      estado_anterior: estadoAnterior,
      estado_novo: novoEstado,
      administrador_id: user.id,
    });

  if (erroHistorico) {
    console.error(
      "Erro ao guardar histórico:",
      erroHistorico
    );

    setErro(
      "O estado foi atualizado, mas não foi possível guardar o histórico."
    );
  }

  // Atualizar a lista apresentada no painel
  setClientes((pedidosAtuais) =>
    pedidosAtuais.map((clienteAtual) =>
      clienteAtual.id === id
        ? {
            ...clienteAtual,
            estado: novoEstado,
          }
        : clienteAtual
    )
  );
}
  function enviarAtualizacaoWhatsApp(cliente: Cliente) {
    let numero = cliente.telefone.replace(/\D/g, "");

    if (numero.startsWith("0")) {
      numero = "244" + numero.substring(1);
    }

    if (!numero.startsWith("244")) {
      numero = "244" + numero;
    }

    const estado = cliente.estado || "Pendente";

    const mensagem = encodeURIComponent(
      `Olá, ${cliente.nome}! 👋

Aqui é a DM-TECVOLT.

Informamos que o estado do seu pedido de serviço foi atualizado.

🔧 Serviço: ${cliente.servico}
📍 Localização: ${cliente.municipio}, ${cliente.provincia}
📌 Estado: ${estado}

Obrigado por confiar nos serviços da DM-TECVOLT.

Caso tenha alguma dúvida, estamos à disposição.`
    );

    const url = `https://wa.me/${numero}?text=${mensagem}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

 useEffect(() => {
  carregarPedidos();

  const canal = supabase
    .channel("novos-pedidos-admin")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "clientes",
      },
      (payload) => {
        const novoPedido = payload.new as Cliente;
        setNovoPedidoAviso(true);

setTimeout(() => {
  setNovoPedidoAviso(false);
}, 5000);

        setClientes((pedidosAtuais) => {
          const jaExiste = pedidosAtuais.some(
            (cliente) => cliente.id === novoPedido.id
          );

          if (jaExiste) {
            return pedidosAtuais;
          }

          return [novoPedido, ...pedidosAtuais];
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(canal);
  };
}, []);

  function formatarData(data: string) {
    return new Date(data).toLocaleString("pt-PT", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const textoPesquisa = pesquisa.toLowerCase().trim();

    const correspondePesquisa =
      cliente.nome.toLowerCase().includes(textoPesquisa) ||
      cliente.telefone.toLowerCase().includes(textoPesquisa) ||
      cliente.servico.toLowerCase().includes(textoPesquisa) ||
      cliente.municipio.toLowerCase().includes(textoPesquisa);

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

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {novoPedidoAviso && (
  <div className="fixed right-6 top-6 z-50 rounded-xl bg-green-600 px-6 py-4 text-white shadow-xl">
    <div className="font-bold">
      🔔 Novo pedido recebido!
    </div>

    <div className="mt-1 text-sm text-green-100">
      Um novo pedido foi adicionado ao painel.
    </div>
  </div>
)}
      {/* CABEÇALHO */}
      <section className="bg-blue-700 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-semibold text-blue-200">
            Administração
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Pedidos de serviço
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="text-blue-100">
              Gestão dos pedidos recebidos pela DM-TECVOLT.
            </p>

            <button
              onClick={terminarSessao}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
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
                placeholder="Nome, telefone, serviço ou município..."
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
                <option value="Pendente">Pendente</option>
                <option value="Em análise">Em análise</option>
                <option value="Em execução">Em execução</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* ATUALIZAR */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={carregarPedidos}
              disabled={carregando}
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {carregando ? "A carregar..." : "Atualizar pedidos"}
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
              <div className="w-full overflow-x-auto rounded-2xl">
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
                        Pedido
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Data
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr
                        key={cliente.id}
                        className="border-t border-gray-200 align-top hover:bg-gray-50"
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
                              className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
                            >
                              📞 Ligar
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                enviarAtualizacaoWhatsApp(cliente)
                              }
                              className="rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-200"
                            >
                              💬 WhatsApp
                            </button>
                          </div>
                        </td>

                        {/* SERVIÇO */}
                        <td className="px-6 py-5">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
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

                        {/* PEDIDO */}
                        <td className="max-w-xs px-6 py-5">
                          <p className="whitespace-normal leading-6 text-gray-600">
                            {cliente.descricao}
                          </p>
                        </td>

                        {/* DATA */}
                        <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                          {formatarData(cliente.created_at)}
                        </td>

                        {/* ESTADO */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-3">
                            <select
                              value={cliente.estado || "Pendente"}
                              onChange={(e) =>
                                alterarEstado(
                                  cliente.id,
                                  e.target.value
                                )
                              }
                              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            >
                              <option value="Pendente">
                                Pendente
                              </option>

                              <option value="Em análise">
                                Em análise
                              </option>

                              <option value="Em execução">
                                Em execução
                              </option>

                              <option value="Concluído">
                                Concluído
                              </option>

                              <option value="Cancelado">
                                Cancelado
                              </option>
                            </select>

                            <button
                              type="button"
                              onClick={() =>
                                enviarAtualizacaoWhatsApp(cliente)
                              }
                              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                              💬 Enviar atualização
                            </button>
                          </div>
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
    </main>
  );
}