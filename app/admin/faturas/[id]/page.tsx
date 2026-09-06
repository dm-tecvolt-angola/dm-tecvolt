"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ItemFatura = {
  id: number;
  fatura_id: number;
  tipo: string | null;
  codigo: string | null;
  descricao: string;
  quantidade: number;
  preco_unitario: number;
  mao_de_obra: number;
  total: number;
  ordem: number | null;
};

type Fatura = {
  id: number;
  numero: string;
  proforma_id: number | null;

  cliente_id: number | null;
  cliente_nome: string;
  cliente_nif: string | null;
  cliente_telefone: string | null;
  cliente_email: string | null;
  cliente_endereco: string | null;

  tipo_documento: string | null;

  subtotal: number;
  desconto: number;

  aplicar_iva: boolean;
  taxa_iva: number;
  valor_iva: number;

  total: number;

  valor_pago: number;
  saldo: number;

  modo_pagamento: string | null;

  estado: string | null;

  data_emissao: string;
  data_vencimento: string | null;

  observacoes: string | null;

  created_at: string;
};

type Pagamento = {
  id: number;
  fatura_id: number;
  valor: number;
  metodo_pagamento: string;
  referencia: string | null;
  observacoes: string | null;
  data_pagamento: string;
  created_at: string;
};

type ConfiguracaoEmpresa = {
  id: number;

  nome_empresa: string | null;
  nif: string | null;

  endereco: string | null;
  bairro: string | null;
  provincia: string | null;

  telefone1: string | null;
  telefone2: string | null;
  whatsapp: string | null;

  email: string | null;
  website: string | null;

  banco1: string | null;
  conta1: string | null;
  iban1: string | null;

  banco2: string | null;
  conta2: string | null;
  iban2: string | null;

  observacoes: string | null;
};

function formatarKz(valor: number | null | undefined) {
  return (
    new Intl.NumberFormat("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(valor || 0)) + " Kz"
  );
}

function formatarNumero(valor: number | null | undefined) {
  return new Intl.NumberFormat("pt-AO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(valor || 0));
}

function formatarData(data: string | null | undefined) {
  if (!data) return "-";

  return new Date(data).toLocaleDateString("pt-PT");
}

function obterEstadoPagamento(
  total: number,
  valorPago: number
) {
  const totalNumerico = Number(total || 0);
  const pago = Number(valorPago || 0);

  if (pago <= 0) {
    return "Pendente";
  }

  if (pago >= totalNumerico) {
    return "Paga";
  }

  return "Parcialmente paga";
}

export default function FaturaDetalhePage() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [fatura, setFatura] =
    useState<Fatura | null>(null);

  const [empresa, setEmpresa] =
    useState<ConfiguracaoEmpresa | null>(null);

  const [itens, setItens] =
    useState<ItemFatura[]>([]);

  const [pagamentos, setPagamentos] =
    useState<Pagamento[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");

  const [mensagem, setMensagem] =
    useState("");

  const [mostrarPagamento, setMostrarPagamento] =
    useState(false);

  const [salvandoPagamento, setSalvandoPagamento] =
    useState(false);

  const [valorPagamento, setValorPagamento] =
    useState("");

  const [metodoPagamento, setMetodoPagamento] =
    useState("Dinheiro");

  const [referenciaPagamento, setReferenciaPagamento] =
    useState("");

  const [observacoesPagamento, setObservacoesPagamento] =
    useState("");

  async function carregarDados() {
    setCarregando(true);
    setErro("");
    setMensagem("");

    const {
      data: { user },
      error: erroUsuario,
    } = await supabase.auth.getUser();

    if (erroUsuario || !user) {
      window.location.href = "/login";
      return;
    }

    /*
     * EMPRESA
     */

    const {
      data: empresaData,
      error: erroEmpresa,
    } = await supabase
      .from("configuracoes_empresa")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (erroEmpresa) {
      console.error(
        "Erro ao carregar empresa:",
        erroEmpresa
      );

      setErro(
        "Não foi possível carregar os dados da empresa."
      );

      setCarregando(false);
      return;
    }

    if (empresaData) {
      setEmpresa(
        empresaData as ConfiguracaoEmpresa
      );
    }

    /*
     * FATURA
     */

    const {
      data: faturaData,
      error: erroFatura,
    } = await supabase
      .from("faturas")
      .select("*")
      .eq("id", id)
      .single();

    if (erroFatura) {
      console.error(
        "Erro ao carregar fatura:",
        erroFatura
      );

      setErro(
        "Não foi possível carregar esta Fatura."
      );

      setCarregando(false);
      return;
    }

    /*
     * ITENS
     */

    const {
      data: itensData,
      error: erroItens,
    } = await supabase
      .from("fatura_itens")
      .select(
        "id, fatura_id, tipo, codigo, descricao, quantidade, preco_unitario, mao_de_obra, total, ordem"
      )
      .eq("fatura_id", id)
      .order("ordem", {
        ascending: true,
      })
      .order("id", {
        ascending: true,
      });

    if (erroItens) {
      console.error(
        "Erro ao carregar itens:",
        erroItens
      );

      setErro(
        "A Fatura foi encontrada, mas não foi possível carregar os itens."
      );

      setCarregando(false);
      return;
    }

    /*
     * PAGAMENTOS
     */

    const {
      data: pagamentosData,
      error: erroPagamentos,
    } = await supabase
      .from("pagamentos_fatura")
      .select("*")
      .eq("fatura_id", id)
      .order("data_pagamento", {
        ascending: false,
      })
      .order("id", {
        ascending: false,
      });

    if (erroPagamentos) {
      console.error(
        "Erro ao carregar pagamentos:",
        erroPagamentos
      );

      setErro(
        "A Fatura foi encontrada, mas não foi possível carregar os pagamentos."
      );

      setCarregando(false);
      return;
    }

    /*
     * CALCULAR PAGAMENTO REAL
     */

    const listaPagamentos =
      (pagamentosData || []) as Pagamento[];

    const valorPagoCalculado =
      listaPagamentos.reduce(
        (total, pagamento) =>
          total + Number(pagamento.valor || 0),
        0
      );

    const totalFatura =
      Number(faturaData.total || 0);

    const saldoCalculado = Math.max(
      totalFatura - valorPagoCalculado,
      0
    );

    const estadoCalculado =
      obterEstadoPagamento(
        totalFatura,
        valorPagoCalculado
      );

    /*
     * ATUALIZAR FATURA COM OS VALORES
     */

    const { error: erroAtualizacao } =
      await supabase
        .from("faturas")
        .update({
          valor_pago: valorPagoCalculado,
          saldo: saldoCalculado,
          estado: estadoCalculado,
        })
        .eq("id", faturaData.id);

    if (erroAtualizacao) {
      console.warn(
        "Não foi possível atualizar o resumo da fatura:",
        erroAtualizacao
      );
    }

    const faturaAtualizada: Fatura = {
      ...(faturaData as Fatura),
      valor_pago: valorPagoCalculado,
      saldo: saldoCalculado,
      estado: estadoCalculado,
    };

    setFatura(faturaAtualizada);

    setItens(
      (itensData || []) as ItemFatura[]
    );

    setPagamentos(listaPagamentos);

    setCarregando(false);
  }

  /*
   * REGISTAR PAGAMENTO
   */

  async function registarPagamento() {
    if (!fatura) return;

    setErro("");
    setMensagem("");

    const valor = Number(
      String(valorPagamento).replace(",", ".")
    );

    if (!valor || valor <= 0) {
      setErro(
        "Introduza um valor de pagamento válido."
      );
      return;
    }

    const saldoAtual =
      Number(fatura.saldo || 0);

    if (valor > saldoAtual) {
      setErro(
        `O pagamento não pode ser superior ao saldo em dívida de ${formatarKz(
          saldoAtual
        )}.`
      );
      return;
    }

    setSalvandoPagamento(true);

    try {
      const {
        data: { user },
        error: erroUsuario,
      } = await supabase.auth.getUser();

      if (erroUsuario || !user) {
        window.location.href = "/login";
        return;
      }

      /*
       * INSERIR PAGAMENTO
       */

      const {
        error: erroInserir,
      } = await supabase
        .from("pagamentos_fatura")
        .insert({
          fatura_id: fatura.id,

          valor: valor,

          metodo_pagamento:
            metodoPagamento,

          referencia:
            referenciaPagamento.trim() || null,

          observacoes:
            observacoesPagamento.trim() || null,

          data_pagamento:
            new Date().toISOString(),
        });

      if (erroInserir) {
        console.error(
          "Erro ao registar pagamento:",
          erroInserir
        );

        throw new Error(
          erroInserir.message ||
          "Não foi possível registar o pagamento."
        );
      }

      /*
       * RECARREGAR TUDO
       */

      setMostrarPagamento(false);

      setValorPagamento("");
      setReferenciaPagamento("");
      setObservacoesPagamento("");

      setMensagem(
        "Pagamento registado com sucesso."
      );

      await carregarDados();

    } catch (error) {
      console.error(
        "Erro no pagamento:",
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível registar o pagamento."
      );
    } finally {
      setSalvandoPagamento(false);
    }
  }

  /*
   * ELIMINAR PAGAMENTO
   */

  async function eliminarPagamento(
    pagamento: Pagamento
  ) {
    const confirmar = window.confirm(
      `Deseja eliminar este pagamento de ${formatarKz(
        pagamento.valor
      )}?`
    );

    if (!confirmar) return;

    setErro("");
    setMensagem("");

    const {
      error,
    } = await supabase
      .from("pagamentos_fatura")
      .delete()
      .eq("id", pagamento.id);

    if (error) {
      console.error(
        "Erro ao eliminar pagamento:",
        error
      );

      setErro(
        "Não foi possível eliminar o pagamento."
      );

      return;
    }

    setMensagem(
      "Pagamento eliminado com sucesso."
    );

    await carregarDados();
  }

  useEffect(() => {
    if (id) {
      carregarDados();
    }
  }, [id]);

  /*
   * CARREGANDO
   */

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-100 p-10">

        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow-sm">

          <p className="text-gray-500">
            A carregar Fatura...
          </p>

        </div>

      </main>
    );
  }

  /*
   * ERRO
   */

  if (erro && !fatura) {
    return (
      <main className="min-h-screen bg-gray-100 p-10">

        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow-sm">

          <div className="text-5xl">
            ⚠️
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Fatura não encontrada
          </h1>

          <p className="mt-2 text-red-600">
            {erro}
          </p>

          <Link
            href="/admin/faturas"
            className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
          >
            Voltar às Faturas
          </Link>

        </div>

      </main>
    );
  }

  if (!fatura) {
    return null;
  }

  const totalFatura =
    Number(fatura.total || 0);

  const valorPago =
    Number(fatura.valor_pago || 0);

  const saldo =
    Math.max(
      Number(fatura.saldo || 0),
      0
    );

  const percentagemPaga =
    totalFatura > 0
      ? Math.min(
          (valorPago / totalFatura) * 100,
          100
        )
      : 0;

  return (
    <>
      {/* BARRA DE AÇÕES */}

      <div className="no-print sticky top-0 z-50 border-b bg-white shadow-sm">

        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">

          <Link
            href="/admin/faturas"
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
          >
            ← Voltar
          </Link>

          <div className="flex flex-wrap gap-3">

            {saldo > 0 && (
              <button
                type="button"
                onClick={() => {
                  setErro("");
                  setMensagem("");
                  setMostrarPagamento(true);
                }}
                className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
              >
                💰 Registar Pagamento
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                window.print()
              }
              className="rounded-lg bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-600"
            >
              🖨️ Imprimir / PDF
            </button>

          </div>

        </div>

      </div>

      {/* MENSAGEM */}

      {mensagem && (
        <div className="no-print mx-auto mt-5 max-w-5xl rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {mensagem}
        </div>
      )}

      {/* ERRO */}

      {erro && (
        <div className="no-print mx-auto mt-5 max-w-5xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {erro}
        </div>
      )}

      {/* JANELA DE PAGAMENTO */}

      {mostrarPagamento && (
        <div className="no-print fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Registar pagamento
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Fatura Nº {fatura.numero}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setMostrarPagamento(false)
                }
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">
                  Total da fatura
                </span>

                <strong>
                  {formatarKz(totalFatura)}
                </strong>

              </div>

              <div className="mt-2 flex justify-between text-sm">

                <span className="text-gray-500">
                  Já pago
                </span>

                <strong className="text-green-600">
                  {formatarKz(valorPago)}
                </strong>

              </div>

              <div className="mt-2 flex justify-between border-t pt-2">

                <span className="font-semibold">
                  Saldo
                </span>

                <strong className="text-red-600">
                  {formatarKz(saldo)}
                </strong>

              </div>

            </div>

            <div className="mt-5 space-y-4">

              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Valor do pagamento
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorPagamento}
                  onChange={(e) =>
                    setValorPagamento(
                      e.target.value
                    )
                  }
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Método de pagamento
                </label>

                <select
                  value={metodoPagamento}
                  onChange={(e) =>
                    setMetodoPagamento(
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                >

                  <option>
                    Dinheiro
                  </option>

                  <option>
                    Transferência bancária
                  </option>

                  <option>
                    Multicaixa Express
                  </option>

                  <option>
                    BAI Directo
                  </option>

                  <option>
                    TPA
                  </option>

                  <option>
                    Depósito bancário
                  </option>

                  <option>
                    Cheque
                  </option>

                  <option>
                    Outro
                  </option>

                </select>

              </div>

              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Referência
                  <span className="font-normal text-gray-400">
                    {" "}
                    (opcional)
                  </span>
                </label>

                <input
                  type="text"
                  value={referenciaPagamento}
                  onChange={(e) =>
                    setReferenciaPagamento(
                      e.target.value
                    )
                  }
                  placeholder="Ex.: referência da transferência"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Observações
                  <span className="font-normal text-gray-400">
                    {" "}
                    (opcional)
                  </span>
                </label>

                <textarea
                  value={observacoesPagamento}
                  onChange={(e) =>
                    setObservacoesPagamento(
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Observação sobre este pagamento..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setMostrarPagamento(false)
                }
                disabled={salvandoPagamento}
                className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={registarPagamento}
                disabled={salvandoPagamento}
                className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {salvandoPagamento
                  ? "A guardar..."
                  : "Guardar pagamento"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* DOCUMENTO */}

      <main className="min-h-screen bg-gray-100 px-4 py-8 md:px-8">

        <div
          id="documento-fatura"
          className="mx-auto max-w-5xl bg-white p-8 shadow-lg md:p-12"
        >

          {/* CABEÇALHO */}

          <header className="flex flex-col gap-8 border-b-2 border-blue-700 pb-8 md:flex-row md:items-start md:justify-between">

            <div>

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-700 text-2xl font-black text-white">
                DM
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                {empresa?.nome_empresa ||
                  "DM-TECVOLT"}
              </h1>

              {empresa?.endereco && (
                <p className="mt-2 text-sm text-gray-600">
                  {empresa.endereco}
                </p>
              )}

              {(empresa?.bairro ||
                empresa?.provincia) && (

                <p className="text-sm text-gray-600">

                  {empresa.bairro || ""}

                  {empresa.bairro &&
                    empresa.provincia
                    ? ", "
                    : ""}

                  {empresa.provincia || ""}

                </p>
              )}

              {(empresa?.telefone1 ||
                empresa?.telefone2) && (

                <p className="mt-2 text-sm text-gray-600">

                  Tel.:{" "}

                  {empresa.telefone1 || ""}

                  {empresa.telefone1 &&
                    empresa.telefone2
                    ? " / "
                    : ""}

                  {empresa.telefone2 || ""}

                </p>
              )}

              {empresa?.whatsapp && (
                <p className="text-sm text-gray-600">
                  WhatsApp:{" "}
                  {empresa.whatsapp}
                </p>
              )}

              {empresa?.email && (
                <p className="text-sm text-gray-600">
                  Email: {empresa.email}
                </p>
              )}

              {empresa?.website && (
                <p className="text-sm text-gray-600">
                  {empresa.website}
                </p>
              )}

              {empresa?.nif && (
                <p className="text-sm text-gray-600">
                  NIF: {empresa.nif}
                </p>
              )}

            </div>

            <div className="text-left md:text-right">

              <h2 className="text-3xl font-black text-blue-700">
                FATURA
              </h2>

              <p className="mt-3 text-lg font-bold">
                Nº {fatura.numero}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Data de emissão:{" "}
                {formatarData(
                  fatura.data_emissao
                )}
              </p>

              {fatura.data_vencimento && (
                <p className="text-sm text-gray-600">
                  Vencimento:{" "}
                  {formatarData(
                    fatura.data_vencimento
                  )}
                </p>
              )}

              <div
                className={`mt-4 inline-block rounded-full px-4 py-2 text-sm font-bold ${
                  fatura.estado === "Paga"
                    ? "bg-green-100 text-green-700"
                    : fatura.estado ===
                      "Parcialmente paga"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {fatura.estado ||
                  "Pendente"}
              </div>

            </div>

          </header>

          {/* CLIENTE */}

          <section className="mt-8 rounded-xl border border-gray-200 p-5">

            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-700">
              Dados do cliente
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              <div>

                <p className="text-xs font-semibold uppercase text-gray-500">
                  Cliente
                </p>

                <p className="mt-1 font-bold text-gray-900">
                  {fatura.cliente_nome}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase text-gray-500">
                  NIF
                </p>

                <p className="mt-1 text-gray-800">
                  {fatura.cliente_nif ||
                    "Não informado"}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase text-gray-500">
                  Telefone
                </p>

                <p className="mt-1 text-gray-800">
                  {fatura.cliente_telefone ||
                    "Não informado"}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase text-gray-500">
                  Email
                </p>

                <p className="mt-1 text-gray-800">
                  {fatura.cliente_email ||
                    "Não informado"}
                </p>

              </div>

              {fatura.cliente_endereco && (
                <div className="md:col-span-2">

                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Endereço
                  </p>

                  <p className="mt-1 text-gray-800">
                    {fatura.cliente_endereco}
                  </p>

                </div>
              )}

            </div>

          </section>

          {/* ITENS */}

          <section className="mt-8">

            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-700">
              Produtos / Serviços
            </h3>

            <div className="overflow-hidden rounded-xl border border-gray-200">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Código
                    </th>

                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Descrição
                    </th>

                    <th className="px-4 py-4 text-center text-sm font-semibold">
                      Qtd.
                    </th>

                    <th className="px-4 py-4 text-right text-sm font-semibold">
                      Preço unit.
                    </th>

                    <th className="px-4 py-4 text-right text-sm font-semibold">
                      Mão de obra
                    </th>

                    <th className="px-4 py-4 text-right text-sm font-semibold">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {itens.length === 0 ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Nenhum item registado.
                      </td>

                    </tr>

                  ) : (

                    itens.map((item) => (

                      <tr
                        key={item.id}
                        className="border-t border-gray-200"
                      >

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {item.codigo || "-"}
                        </td>

                        <td className="px-4 py-4">

                          <div className="font-medium">
                            {item.descricao}
                          </div>

                          {item.tipo && (
                            <div className="mt-1 text-xs text-gray-500">
                              {item.tipo}
                            </div>
                          )}

                        </td>

                        <td className="px-4 py-4 text-center">
                          {formatarNumero(
                            item.quantidade
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right">
                          {formatarKz(
                            item.preco_unitario
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right">
                          {formatarKz(
                            item.mao_de_obra
                          )}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right font-semibold">
                          {formatarKz(
                            item.total
                          )}
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </section>

          {/* TOTAIS */}

          <section className="mt-8 flex justify-end">

            <div className="w-full max-w-md">

              <div className="space-y-3 rounded-xl border border-gray-200 p-5">

                <div className="flex justify-between gap-4 text-gray-600">

                  <span>
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatarKz(
                      fatura.subtotal
                    )}
                  </span>

                </div>

                <div className="flex justify-between gap-4 text-gray-600">

                  <span>
                    Desconto
                  </span>

                  <span className="font-semibold text-gray-900">
                    -{" "}
                    {formatarKz(
                      fatura.desconto
                    )}
                  </span>

                </div>

                <div className="flex justify-between gap-4 text-gray-600">

                  <span>
                    IVA{" "}

                    {fatura.aplicar_iva
                      ? `(${fatura.taxa_iva}%)`
                      : "(Não aplicado)"}
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatarKz(
                      fatura.valor_iva
                    )}
                  </span>

                </div>

                <div className="border-t border-gray-300 pt-4">

                  <div className="flex justify-between gap-4">

                    <span className="text-lg font-bold">
                      TOTAL
                    </span>

                    <span className="text-xl font-black text-blue-700">
                      {formatarKz(
                        totalFatura
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* RESUMO DE PAGAMENTO */}

          <section className="mt-8 rounded-xl border border-gray-200 p-5">

            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-blue-700">
              Resumo de pagamento
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-gray-50 p-4">

                <p className="text-xs font-semibold uppercase text-gray-500">
                  Total
                </p>

                <p className="mt-2 text-xl font-black text-gray-900">
                  {formatarKz(
                    totalFatura
                  )}
                </p>

              </div>

              <div className="rounded-xl bg-green-50 p-4">

                <p className="text-xs font-semibold uppercase text-green-700">
                  Total pago
                </p>

                <p className="mt-2 text-xl font-black text-green-700">
                  {formatarKz(
                    valorPago
                  )}
                </p>

              </div>

              <div className="rounded-xl bg-red-50 p-4">

                <p className="text-xs font-semibold uppercase text-red-700">
                  Saldo em dívida
                </p>

                <p className="mt-2 text-xl font-black text-red-700">
                  {formatarKz(
                    saldo
                  )}
                </p>

              </div>

            </div>

            <div className="mt-5">

              <div className="mb-2 flex justify-between text-xs text-gray-500">

                <span>
                  Pagamento recebido
                </span>

                <span>
                  {percentagemPaga.toFixed(0)}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                <div
                  className="h-full rounded-full bg-green-600 transition-all"
                  style={{
                    width: `${percentagemPaga}%`,
                  }}
                />

              </div>

            </div>

          </section>

          {/* HISTÓRICO DE PAGAMENTOS */}

          <section className="mt-8">

            <div className="flex items-center justify-between">

              <h3 className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Histórico de pagamentos
              </h3>

              {saldo > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setErro("");
                    setMensagem("");
                    setMostrarPagamento(true);
                  }}
                  className="no-print rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  + Pagamento
                </button>
              )}

            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">

              {pagamentos.length === 0 ? (

                <div className="p-6 text-center text-gray-500">
                  Nenhum pagamento registado.
                </div>

              ) : (

                <table className="w-full">

                  <thead className="bg-gray-100">

                    <tr>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Data
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Método
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Referência
                      </th>

                      <th className="px-4 py-3 text-right text-sm font-semibold">
                        Valor
                      </th>

                      <th className="no-print px-4 py-3 text-right text-sm font-semibold">
                        Ação
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {pagamentos.map(
                      (pagamento) => (

                        <tr
                          key={pagamento.id}
                          className="border-t border-gray-200"
                        >

                          <td className="px-4 py-3 text-sm">
                            {formatarData(
                              pagamento.data_pagamento
                            )}
                          </td>

                          <td className="px-4 py-3 text-sm">
                            {pagamento.metodo_pagamento}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-600">
                            {pagamento.referencia ||
                              "-"}
                          </td>

                          <td className="px-4 py-3 text-right font-semibold text-green-700">
                            {formatarKz(
                              pagamento.valor
                            )}
                          </td>

                          <td className="no-print px-4 py-3 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                eliminarPagamento(
                                  pagamento
                                )
                              }
                              className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                            >
                              Eliminar
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              )}

            </div>

          </section>

          {/* CONDIÇÕES + BANCOS */}

          <section className="mt-8 grid gap-6 md:grid-cols-2">

            <div className="rounded-xl border border-gray-200 p-5">

              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-700">
                Condições de pagamento
              </h3>

              <p className="text-gray-800">
                {fatura.modo_pagamento ||
                  "Pagamento integral"}
              </p>

            </div>

            <div className="rounded-xl border border-gray-200 p-5">

              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-700">
                Dados bancários
              </h3>

              <div className="space-y-3 text-sm text-gray-700">

                {empresa?.banco1 && (
                  <div>

                    <strong>
                      {empresa.banco1}
                    </strong>

                    {empresa.conta1 && (
                      <span>
                        {" "}
                        — Conta:{" "}
                        {empresa.conta1}
                      </span>
                    )}

                    {empresa.iban1 && (
                      <span>
                        {" "}
                        — IBAN:{" "}
                        {empresa.iban1}
                      </span>
                    )}

                  </div>
                )}

                {empresa?.banco2 && (
                  <div>

                    <strong>
                      {empresa.banco2}
                    </strong>

                    {empresa.conta2 && (
                      <span>
                        {" "}
                        — Conta:{" "}
                        {empresa.conta2}
                      </span>
                    )}

                    {empresa.iban2 && (
                      <span>
                        {" "}
                        — IBAN:{" "}
                        {empresa.iban2}
                      </span>
                    )}

                  </div>
                )}

                {!empresa?.banco1 &&
                  !empresa?.banco2 && (
                    <p className="text-gray-500">
                      Dados bancários não
                      configurados.
                    </p>
                  )}

              </div>

            </div>

          </section>

          {/* OBSERVAÇÕES */}

          {fatura.observacoes && (

            <section className="mt-8 rounded-xl border border-gray-200 p-5">

              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-700">
                Observações
              </h3>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {fatura.observacoes}
              </p>

            </section>

          )}

          {/* RODAPÉ */}

          <footer className="mt-12 border-t border-gray-300 pt-8">

            <div className="grid gap-10 md:grid-cols-2">

              <div>

                <p className="text-sm font-semibold">
                  Assinatura da DM-TECVOLT
                </p>

                <div className="mt-12 border-t border-gray-400 pt-2 text-sm text-gray-500">
                  Responsável
                </div>

              </div>

              <div>

                <p className="text-sm font-semibold">
                  Assinatura do cliente
                </p>

                <div className="mt-12 border-t border-gray-400 pt-2 text-sm text-gray-500">
                  Cliente
                </div>

              </div>

            </div>

            <p className="mt-10 text-center text-xs text-gray-500">
              Documento emitido por
              DM-TECVOLT.
            </p>

          </footer>

        </div>

      </main>

      {/* ESTILOS DE IMPRESSÃO */}

      <style jsx global>{`

        @media print {

          @page {
            size: A4;
            margin: 10mm;
          }

          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          #documento-fatura {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }

          table {
            page-break-inside: auto;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          section {
            page-break-inside: avoid;
          }

        }

      `}</style>

    </>
  );
}