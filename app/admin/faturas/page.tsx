"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Fatura = {
  id: number;
  numero: string;
  cliente_nome: string | null;
  cliente_nif: string | null;
  total: number;
  estado: string | null;
  data_emissao: string;
  data_vencimento: string | null;
  modo_pagamento: string | null;
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

function obterEstado(fatura: Fatura) {
  return fatura.estado || "Pendente";
}

function classeEstado(estado: string) {
  switch (estado) {
    case "Paga":
      return "bg-green-100 text-green-700";

    case "Parcialmente paga":
      return "bg-blue-100 text-blue-700";

    case "Vencida":
      return "bg-red-100 text-red-700";

    case "Cancelada":
      return "bg-gray-200 text-gray-600";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function FaturasPage() {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  async function carregarFaturas() {
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
      .from("faturas")
      .select(
        "id, numero, cliente_nome, cliente_nif, total, estado, data_emissao, data_vencimento, modo_pagamento"
      )
      .order("data_emissao", {
        ascending: false,
      });

    if (error) {
      console.error("Erro ao carregar faturas:", error);

      setErro("Não foi possível carregar as faturas.");

      setCarregando(false);

      return;
    }

    setFaturas((data || []) as Fatura[]);

    setCarregando(false);
  }

  useEffect(() => {
    carregarFaturas();
  }, []);

  const faturasFiltradas = faturas.filter((fatura) => {
    const texto = pesquisa.toLowerCase().trim();

    const correspondePesquisa =
      !texto ||
      (fatura.numero || "").toLowerCase().includes(texto) ||
      (fatura.cliente_nome || "").toLowerCase().includes(texto) ||
      (fatura.cliente_nif || "").toLowerCase().includes(texto);

    const correspondeEstado =
      filtroEstado === "Todos" ||
      obterEstado(fatura) === filtroEstado;

    return correspondePesquisa && correspondeEstado;
  });

  const totalFaturas = faturas.length;

  const totalPendentes = faturas.filter(
    (fatura) => obterEstado(fatura) === "Pendente"
  ).length;

  const totalPagas = faturas.filter(
    (fatura) => obterEstado(fatura) === "Paga"
  ).length;

  const totalParciais = faturas.filter(
    (fatura) => obterEstado(fatura) === "Parcialmente paga"
  ).length;

  const totalVencidas = faturas.filter(
    (fatura) => obterEstado(fatura) === "Vencida"
  ).length;

  const valorTotal = faturas.reduce(
    (total, fatura) => total + Number(fatura.total || 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">

      <section className="bg-blue-700 py-10 text-white">

        <div className="mx-auto max-w-7xl px-6">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

              <p className="font-semibold text-blue-200">
                Administração
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Faturas
              </h1>

              <p className="mt-2 text-blue-100">
                Gestão das faturas emitidas pela DM-TECVOLT.
              </p>

            </div>

            <Link
              href="/admin"
              className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
            >
              ← Administração
            </Link>

          </div>

        </div>

      </section>

      <section className="py-10">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                Total de faturas
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-700">
                {totalFaturas}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                Pendentes
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {totalPendentes}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                Parcialmente pagas
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {totalParciais}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                Pagas
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {totalPagas}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                Vencidas
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {totalVencidas}
              </p>

            </div>

          </div>

          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Valor total faturado
            </p>

            <p className="mt-2 text-3xl font-black text-blue-700">
              {formatarKz(valorTotal)}
            </p>

          </div>

          <div className="mb-6 grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2">

            <div>

              <label
                htmlFor="pesquisa"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Pesquisar
              </label>

              <input
                id="pesquisa"
                type="text"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Número, cliente ou NIF..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div>

              <label
                htmlFor="estado"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Estado
              </label>

              <select
                id="estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >

                <option value="Todos">
                  Todos
                </option>

                <option value="Pendente">
                  Pendente
                </option>

                <option value="Parcialmente paga">
                  Parcialmente paga
                </option>

                <option value="Paga">
                  Paga
                </option>

                <option value="Vencida">
                  Vencida
                </option>

                <option value="Cancelada">
                  Cancelada
                </option>

              </select>

            </div>

          </div>

          <div className="mb-6 flex justify-end">

            <button
              type="button"
              onClick={carregarFaturas}
              disabled={carregando}
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {carregando
                ? "A carregar..."
                : "↻ Atualizar faturas"}
            </button>

          </div>

          {erro && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {erro}
            </div>
          )}

          {carregando ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

              <p className="text-gray-500">
                A carregar faturas...
              </p>

            </div>

          ) : faturasFiltradas.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                🧾
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                Nenhuma fatura encontrada
              </h2>

              <p className="mt-2 text-gray-500">
                As faturas emitidas a partir das Proformas aparecerão aqui.
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

              <div className="w-full overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                  <thead className="bg-gray-100">

                    <tr>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Fatura
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Cliente
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Data
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold">
                        Total
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Estado
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold">
                        Ação
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {faturasFiltradas.map((fatura) => {

                      const estado = obterEstado(fatura);

                      return (

                        <tr
                          key={fatura.id}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >

                          <td className="px-6 py-5">

                            <div className="font-bold text-blue-700">
                              {fatura.numero}
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                              ID #{fatura.id}
                            </div>

                          </td>

                          <td className="px-6 py-5">

                            <div className="font-semibold">
                              {fatura.cliente_nome ||
                                "Cliente não informado"}
                            </div>

                            {fatura.cliente_nif && (
                              <div className="mt-1 text-sm text-gray-500">
                                NIF: {fatura.cliente_nif}
                              </div>
                            )}

                          </td>

                          <td className="px-6 py-5 text-sm text-gray-600">
                            {formatarData(fatura.data_emissao)}
                          </td>

                          <td className="whitespace-nowrap px-6 py-5 text-right font-bold">
                            {formatarKz(fatura.total)}
                          </td>

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${classeEstado(
                                estado
                              )}`}
                            >
                              {estado}
                            </span>

                          </td>

                          <td className="px-6 py-5 text-right">

                            <Link
                              href={`/admin/faturas/${fatura.id}`}
                              className="inline-block rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
                            >
                              Abrir Fatura
                            </Link>

                          </td>

                        </tr>

                      );

                    })}

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