"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ItemProforma = {
  id: number;
  proforma_id: number;
  tipo: string | null;
  codigo: string | null;
  descricao: string;
  quantidade: number;
  preco_unitario: number;
  mao_de_obra: number;
  total: number;
  ordem: number | null;
};

type Proforma = {
  id: number;
  numero: string;
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

  modo_pagamento: string | null;
  observacoes: string | null;
  estado: string | null;

  data_emissao: string;
  data_validade: string | null;

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

function formatarData(data: string | null) {
  if (!data) return "-";

  return new Date(data).toLocaleDateString("pt-PT");
}

export default function ProformaDetalhePage() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [proforma, setProforma] =
    useState<Proforma | null>(null);

  const [empresa, setEmpresa] =
    useState<ConfiguracaoEmpresa | null>(null);

  const [itens, setItens] =
    useState<ItemProforma[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [emitindoFatura, setEmitindoFatura] =
    useState(false);

  const [erro, setErro] = useState("");

  const [mensagem, setMensagem] =
    useState("");

  async function carregarProforma() {
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
     * =====================================================
     * CARREGAR DADOS DA EMPRESA
     * =====================================================
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
        "Erro ao carregar dados da empresa:",
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
     * =====================================================
     * CARREGAR PROFORMA
     * =====================================================
     */

    const {
      data: proformaData,
      error: erroProforma,
    } = await supabase
      .from("proformas")
      .select("*")
      .eq("id", id)
      .single();

    if (erroProforma) {
      console.error(
        "Erro ao carregar Proforma:",
        erroProforma
      );

      setErro(
        "Não foi possível carregar esta Proforma."
      );

      setCarregando(false);
      return;
    }

    /*
     * =====================================================
     * CARREGAR ITENS
     * =====================================================
     */

    const {
      data: itensData,
      error: erroItens,
    } = await supabase
      .from("proforma_itens")
      .select(
        "id, proforma_id, tipo, codigo, descricao, quantidade, preco_unitario, mao_de_obra, total, ordem"
      )
      .eq("proforma_id", id)
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
        "A Proforma foi encontrada, mas não foi possível carregar os itens."
      );

      setCarregando(false);
      return;
    }

    setProforma(
      proformaData as Proforma
    );

    setItens(
      (itensData || []) as ItemProforma[]
    );

    setCarregando(false);
  }

  /*
   * =====================================================
   * EMITIR FATURA FINAL
   * =====================================================
   */

  async function emitirFatura() {
    if (!proforma) return;

    const confirmar = window.confirm(
      "Deseja emitir uma Fatura Final a partir desta Proforma?\n\nA Proforma será marcada como Faturada."
    );

    if (!confirmar) return;

    setEmitindoFatura(true);
    setErro("");
    setMensagem("");

    try {
      /*
       * ---------------------------------------------------
       * VERIFICAR UTILIZADOR
       * ---------------------------------------------------
       */

      const {
        data: { user },
        error: erroUsuario,
      } = await supabase.auth.getUser();

      if (erroUsuario || !user) {
        window.location.href = "/login";
        return;
      }

      /*
       * ---------------------------------------------------
       * VERIFICAR SE JÁ EXISTE UMA FATURA
       * ---------------------------------------------------
       */

      const {
        data: faturaExistente,
        error: erroVerificacao,
      } = await supabase
        .from("faturas")
        .select("id, numero, estado")
        .eq("proforma_id", proforma.id)
        .maybeSingle();

      if (erroVerificacao) {
        console.error(
          "Erro ao verificar fatura existente:",
          erroVerificacao
        );

        throw new Error(
          "Não foi possível verificar se já existe uma Fatura para esta Proforma."
        );
      }

      if (faturaExistente) {
        const abrirExistente = window.confirm(
          `Esta Proforma já possui a Fatura ${faturaExistente.numero}.\n\nDeseja abrir a Fatura existente?`
        );

        if (abrirExistente) {
          window.location.href =
            `/admin/faturas/${faturaExistente.id}`;
        }

        setEmitindoFatura(false);
        return;
      }

      /*
       * ---------------------------------------------------
       * GERAR NÚMERO DA FATURA
       *
       * Exemplo:
       * FT-2026-12345678
       * ---------------------------------------------------
       */

      const ano = new Date().getFullYear();

      const parteUnica =
        Date.now().toString().slice(-8);

      const numeroFatura =
        `FT-${ano}-${parteUnica}`;

      /*
       * ---------------------------------------------------
       * CRIAR FATURA
       * ---------------------------------------------------
       */

      const {
        data: novaFatura,
        error: erroFatura,
      } = await supabase
        .from("faturas")
        .insert({
          numero: numeroFatura,

          proforma_id: proforma.id,

          cliente_id:
            proforma.cliente_id || null,

          cliente_nome:
            proforma.cliente_nome,

          cliente_nif:
            proforma.cliente_nif,

          cliente_telefone:
            proforma.cliente_telefone,

          cliente_email:
            proforma.cliente_email,

          cliente_endereco:
            proforma.cliente_endereco,

          tipo_documento:
            "Fatura",

          subtotal:
            Number(proforma.subtotal || 0),

          desconto:
            Number(proforma.desconto || 0),

          aplicar_iva:
            Boolean(proforma.aplicar_iva),

          taxa_iva:
            Number(proforma.taxa_iva || 0),

          valor_iva:
            Number(proforma.valor_iva || 0),

          total:
            Number(proforma.total || 0),

          modo_pagamento:
            proforma.modo_pagamento,

          estado:
            "Pendente",

          data_emissao:
            new Date().toISOString(),

          data_vencimento:
            null,

          observacoes:
            proforma.observacoes,
        })
        .select("id, numero")
        .single();

      if (erroFatura || !novaFatura) {
        console.error(
          "Erro ao criar Fatura:",
          erroFatura
        );

        throw new Error(
          erroFatura?.message ||
          "Não foi possível criar a Fatura."
        );
      }

      /*
       * ---------------------------------------------------
       * COPIAR ITENS DA PROFORMA PARA A FATURA
       * ---------------------------------------------------
       */

      if (itens.length > 0) {
        const itensFatura = itens.map(
          (item, index) => ({
            fatura_id:
              novaFatura.id,

            tipo:
              item.tipo,

            codigo:
              item.codigo,

            descricao:
              item.descricao,

            quantidade:
              Number(item.quantidade || 0),

            preco_unitario:
              Number(
                item.preco_unitario || 0
              ),

            /*
             * A tabela de fatura_itens
             * já está preparada para desconto
             * e IVA.
             *
             * Como a tabela atual da Proforma
             * não possui essas duas colunas,
             * usamos 0 nesta etapa.
             */

            desconto:
              0,

            iva:
              0,

            subtotal:
              Number(
                item.total || 0
              ),

            mao_de_obra:
              Number(
                item.mao_de_obra || 0
              ),

            total:
              Number(
                item.total || 0
              ),

            ordem:
              item.ordem ?? index,
          })
        );

        const {
          error: erroItensFatura,
        } = await supabase
          .from("fatura_itens")
          .insert(itensFatura);

        if (erroItensFatura) {
          console.error(
            "Erro ao copiar itens para a Fatura:",
            erroItensFatura
          );

          /*
           * Apagar a Fatura incompleta.
           */

          await supabase
            .from("faturas")
            .delete()
            .eq("id", novaFatura.id);

          throw new Error(
            "A Fatura foi criada, mas os itens não puderam ser copiados. A operação foi cancelada."
          );
        }
      }

      /*
       * ---------------------------------------------------
       * ATUALIZAR ESTADO DA PROFORMA
       * ---------------------------------------------------
       */

      const {
        error: erroEstado,
      } = await supabase
        .from("proformas")
        .update({
          estado: "Faturada",
        })
        .eq("id", proforma.id);

      if (erroEstado) {
        console.warn(
          "A Fatura foi criada, mas não foi possível atualizar o estado da Proforma:",
          erroEstado
        );
      }

      /*
       * ---------------------------------------------------
       * ABRIR FATURA FINAL
       * ---------------------------------------------------
       */

      window.location.href =
        `/admin/faturas/${novaFatura.id}`;

    } catch (error) {
      console.error(
        "Erro ao emitir Fatura:",
        error
      );

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível emitir a Fatura."
      );

      setEmitindoFatura(false);
    }
  }

  /*
   * =====================================================
   * CARREGAMENTO INICIAL
   * =====================================================
   */

  useEffect(() => {
    if (id) {
      carregarProforma();
    }
  }, [id]);

  /*
   * =====================================================
   * CARREGANDO
   * =====================================================
   */

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-100 p-10">

        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow-sm">

          <p className="text-gray-500">
            A carregar Proforma...
          </p>

        </div>

      </main>
    );
  }

  /*
   * =====================================================
   * ERRO
   * =====================================================
   */

  if (erro && !proforma) {
    return (
      <main className="min-h-screen bg-gray-100 p-10">

        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow-sm">

          <div className="text-5xl">
            ⚠️
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Proforma não encontrada
          </h1>

          <p className="mt-2 text-red-600">
            {erro}
          </p>

          <Link
            href="/admin/proformas/lista"
            className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
          >
            Voltar às Proformas
          </Link>

        </div>

      </main>
    );
  }

  if (!proforma) {
    return null;
  }

  /*
   * =====================================================
   * DOCUMENTO
   * =====================================================
   */

  return (
    <>
      {/* =================================================
          BARRA DE AÇÕES
      ================================================= */}

      <div className="no-print sticky top-0 z-50 border-b bg-white shadow-sm">

        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">

          <Link
            href="/admin/proformas/lista"
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
          >
            ← Voltar
          </Link>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={emitirFatura}
              disabled={emitindoFatura}
              className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {emitindoFatura
                ? "A emitir Fatura..."
                : "🧾 Emitir Fatura"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-blue-700 px-5 py-2 font-semibold text-white hover:bg-blue-600"
            >
              🖨️ Imprimir / PDF
            </button>

          </div>

        </div>

      </div>

      {/* =================================================
          MENSAGEM
      ================================================= */}

      {mensagem && (
        <div className="no-print mx-auto mt-5 max-w-5xl rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {mensagem}
        </div>
      )}

      {/* =================================================
          ERRO
      ================================================= */}

      {erro && (
        <div className="no-print mx-auto mt-5 max-w-5xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {erro}
        </div>
      )}

      {/* =================================================
          DOCUMENTO
      ================================================= */}

      <main className="min-h-screen bg-gray-100 px-4 py-8 md:px-8">

        <div
          id="documento-proforma"
          className="mx-auto max-w-5xl bg-white p-8 shadow-lg md:p-12"
        >

          {/* =================================================
              CABEÇALHO
          ================================================= */}

          <header className="flex flex-col gap-8 border-b-2 border-blue-700 pb-8 md:flex-row md:items-start md:justify-between">

            <div>

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-700 text-2xl font-black text-white">
                DM
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                {empresa?.nome_empresa || "DM-TECVOLT"}
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
                  WhatsApp: {empresa.whatsapp}
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
                FATURA PROFORMA
              </h2>

              <p className="mt-3 text-lg font-bold">
                Nº {proforma.numero}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Data de emissão:{" "}

                {formatarData(
                  proforma.data_emissao
                )}
              </p>

              {proforma.data_validade && (
                <p className="text-sm text-gray-600">
                  Válida até:{" "}

                  {formatarData(
                    proforma.data_validade
                  )}
                </p>
              )}

              <div className="mt-4 inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
                {proforma.estado || "Rascunho"}
              </div>

            </div>

          </header>

          {/* =================================================
              CLIENTE
          ================================================= */}

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
                  {proforma.cliente_nome}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase text-gray-500">
                  NIF
                </p>

                <p className="mt-1 text-gray-800">
                  {proforma.cliente_nif ||
                    "Não informado"}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase text-gray-500">
                  Telefone
                </p>

                <p className="mt-1 text-gray-800">
                  {proforma.cliente_telefone ||
                    "Não informado"}
                </p>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase text-gray-500">
                  Email
                </p>

                <p className="mt-1 text-gray-800">
                  {proforma.cliente_email ||
                    "Não informado"}
                </p>

              </div>

              {proforma.cliente_endereco && (

                <div className="md:col-span-2">

                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Endereço
                  </p>

                  <p className="mt-1 text-gray-800">
                    {proforma.cliente_endereco}
                  </p>

                </div>

              )}

            </div>

          </section>

          {/* =================================================
              ITENS
          ================================================= */}

          <section className="mt-8">

            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-700">
              Descrição dos produtos / serviços
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

          {/* =================================================
              TOTAIS
          ================================================= */}

          <section className="mt-8 flex justify-end">

            <div className="w-full max-w-md">

              <div className="space-y-3 rounded-xl border border-gray-200 p-5">

                <div className="flex justify-between gap-4 text-gray-600">

                  <span>
                    Subtotal
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatarKz(
                      proforma.subtotal
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
                      proforma.desconto
                    )}
                  </span>

                </div>

                <div className="flex justify-between gap-4 text-gray-600">

                  <span>
                    IVA{" "}

                    {proforma.aplicar_iva
                      ? `(${proforma.taxa_iva}%)`
                      : "(Não aplicado)"}
                  </span>

                  <span className="font-semibold text-gray-900">
                    {formatarKz(
                      proforma.valor_iva
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
                        proforma.total
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              PAGAMENTO + BANCOS
          ================================================= */}

          <section className="mt-8 grid gap-6 md:grid-cols-2">

            <div className="rounded-xl border border-gray-200 p-5">

              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-700">
                Condições de pagamento
              </h3>

              <p className="text-gray-800">
                {proforma.modo_pagamento ||
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

          {/* =================================================
              OBSERVAÇÕES
          ================================================= */}

          {proforma.observacoes && (

            <section className="mt-8 rounded-xl border border-gray-200 p-5">

              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-700">
                Observações
              </h3>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {proforma.observacoes}
              </p>

            </section>

          )}

          {/* =================================================
              RODAPÉ
          ================================================= */}

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
              Este documento é uma Fatura Proforma
              e não constitui, por si só, uma
              fatura definitiva.
            </p>

          </footer>

        </div>

      </main>

      {/* =================================================
          ESTILOS DE IMPRESSÃO
      ================================================= */}

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

          #documento-proforma {
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