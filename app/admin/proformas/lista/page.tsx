"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Proforma = {
  id: number;
  numero: string;
  cliente_nome: string;
  cliente_nif: string | null;
  cliente_telefone: string | null;
  tipo_documento: string | null;
  subtotal: number;
  desconto: number;
  aplicar_iva: boolean;
  taxa_iva: number;
  valor_iva: number;
  total: number;
  modo_pagamento: string | null;
  estado: string | null;
  data_emissao: string;
  data_validade: string | null;
  created_at: string;
};

function formatarKz(valor: number | null | undefined) {
  return (
    new Intl.NumberFormat("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(valor || 0)) + " Kz"
  );
}

function formatarData(data: string | null) {
  if (!data) return "-";

  return new Date(data).toLocaleDateString("pt-PT");
}

function classeEstado(estado: string | null) {
  switch (estado) {
    case "Emitida":
      return "bg-green-100 text-green-700";

    case "Anulada":
      return "bg-red-100 text-red-700";

    case "Rascunho":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function ListaProformasPage() {
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  async function carregarProformas() {
    setCarregando(true);
    setErro("");

    const {
      data: { user },
      error: erroUsuario,
    } = await supabase.auth.getUser();

    if (erroUsuario || !user) {
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("proformas")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(
        "Erro ao carregar Proformas:",
        error
      );

      setErro(
        "Não foi possível carregar as Proformas."
      );

      setCarregando(false);
      return;
    }

    setProformas((data || []) as Proforma[]);
    setCarregando(false);
  }

  useEffect(() => {
    carregarProformas();
  }, []);

  const proformasFiltradas = proformas.filter(
    (proforma) => {
      const pesquisaNormalizada =
        pesquisa.toLowerCase().trim();

      const correspondePesquisa =
        proforma.numero
          ?.toLowerCase()
          .includes(pesquisaNormalizada) ||
        proforma.cliente_nome
          ?.toLowerCase()
          .includes(pesquisaNormalizada) ||
        proforma.cliente_nif
          ?.toLowerCase()
          .includes(pesquisaNormalizada) ||
        proforma.cliente_telefone
          ?.toLowerCase()
          .includes(pesquisaNormalizada);

      const correspondeEstado =
        filtroEstado === "Todos" ||
        (proforma.estado || "Rascunho") ===
          filtroEstado;

      return (
        correspondePesquisa &&
        correspondeEstado
      );
    }
  );

  const totalProformas = proformas.length;

  const totalRascunhos = proformas.filter(
    (proforma) =>
      (proforma.estado || "Rascunho") ===
      "Rascunho"
  ).length;

  const totalEmitidas = proformas.filter(
    (proforma) =>
      proforma.estado === "Emitida"
  ).length;

  const totalAnuladas = proformas.filter(
    (proforma) =>
      proforma.estado === "Anulada"
  ).length;

  const valorTotal = proformas.reduce(
    (total, proforma) =>
      total + Number(proforma.total || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* CABEÇALHO */}

      <section className="bg-blue-700 py-10 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-semibold text-blue-200">
            Administração
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Faturas Proforma
              </h1>

              <p className="mt-2 text-blue-100">
                Consulte e acompanhe as Proformas
                criadas pela DM-TECVOLT.
              </p>
            </div>

            <Link
              href="/admin/proformas"
              className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
            >
              + Nova Proforma
            </Link>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          {/* ESTATÍSTICAS */}

          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Total de Proformas
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-700">
                {totalProformas}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Rascunhos
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {totalRascunhos}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Emitidas
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {totalEmitidas}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Valor total
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-700">
                {formatarKz(valorTotal)}
              </p>
            </div>
          </div>

          {/* PESQUISA */}

          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="pesquisa"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Pesquisar Proforma
                </label>

                <input
                  id="pesquisa"
                  type="text"
                  value={pesquisa}
                  onChange={(e) =>
                    setPesquisa(e.target.value)
                  }
                  placeholder="Número, cliente, NIF ou telefone..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="estado"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Filtrar por estado
                </label>

                <select
                  id="estado"
                  value={filtroEstado}
                  onChange={(e) =>
                    setFiltroEstado(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Todos">
                    Todos
                  </option>

                  <option value="Rascunho">
                    Rascunho
                  </option>

                  <option value="Emitida">
                    Emitida
                  </option>

                  <option value="Anulada">
                    Anulada
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ATUALIZAR */}

          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={carregarProformas}
              disabled={carregando}
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {carregando
                ? "A carregar..."
                : "Atualizar Proformas"}
            </button>
          </div>

          {/* ERRO */}

          {erro && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {erro}
            </div>
          )}

          {/* CARREGANDO */}

          {carregando ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">
                A carregar Proformas...
              </p>
            </div>
          ) : proformas.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">📄</div>

              <h2 className="mt-4 text-2xl font-bold">
                Nenhuma Proforma encontrada
              </h2>

              <p className="mt-2 text-gray-500">
                As Proformas que criares aparecerão
                aqui.
              </p>

              <Link
                href="/admin/proformas"
                className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-600"
              >
                Criar primeira Proforma
              </Link>
            </div>
          ) : proformasFiltradas.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">🔎</div>

              <h2 className="mt-4 text-2xl font-bold">
                Nenhum resultado
              </h2>

              <p className="mt-2 text-gray-500">
                Não encontramos Proformas com os
                filtros selecionados.
              </p>
            </div>
          ) : (
            /* TABELA */

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Número
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Cliente
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Data
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Pagamento
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Total
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
                    {proformasFiltradas.map(
                      (proforma) => (
                        <tr
                          key={proforma.id}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-5">
                            <span className="font-bold text-blue-700">
                              {proforma.numero}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="font-semibold">
                              {proforma.cliente_nome}
                            </div>

                            {proforma.cliente_nif && (
                              <div className="mt-1 text-sm text-gray-500">
                                NIF:{" "}
                                {proforma.cliente_nif}
                              </div>
                            )}

                            {proforma.cliente_telefone && (
                              <div className="mt-1 text-sm text-gray-500">
                                {proforma.cliente_telefone}
                              </div>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">
                            {formatarData(
                              proforma.data_emissao
                            )}
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-600">
                            {proforma.modo_pagamento ||
                              "Integral"}
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 font-bold">
                            {formatarKz(
                              proforma.total
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-sm font-semibold ${classeEstado(
                                proforma.estado
                              )}`}
                            >
                              {proforma.estado ||
                                "Rascunho"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <Link
                              href={`/admin/proformas/${proforma.id}`}
                              className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
                            >
                              👁️ Ver
                            </Link>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RESUMO */}

          {!carregando &&
            proformas.length > 0 && (
              <div className="mt-6 text-sm text-gray-500">
                A mostrar{" "}
                <strong className="text-gray-900">
                  {proformasFiltradas.length}
                </strong>{" "}
                de{" "}
                <strong className="text-gray-900">
                  {proformas.length}
                </strong>{" "}
                Proforma(s).
              </div>
            )}
        </div>
      </section>
    </main>
  );
}