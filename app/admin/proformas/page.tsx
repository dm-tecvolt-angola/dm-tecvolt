"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type TipoItem = "Produto" | "Serviço";

type Item = {
  id: number;
  tipo: TipoItem;
  codigo: string;
  descricao: string;
  quantidade: string;
  precoUnitario: string;
  maoDeObra: string;
};

type Pagamento = {
  id: number;
  numero: number;
  descricao: string;
  percentual: string;
  valor: string;
  dataPrevista: string;
};

function numero(valor: string) {
  if (!valor) return 0;

  const normalizado = valor
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const resultado = Number(normalizado);

  return Number.isFinite(resultado) ? resultado : 0;
}

function formatarKz(valor: number) {
  return new Intl.NumberFormat("pt-AO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor) + " Kz";
}

export default function ProformaPage() {
  const [clienteNome, setClienteNome] = useState("");
  const [clienteNif, setClienteNif] = useState("");
  const [clienteTelefone, setClienteTelefone] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteEndereco, setClienteEndereco] = useState("");

  const [dataEmissao, setDataEmissao] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [dataValidade, setDataValidade] = useState("");

  const [itens, setItens] = useState<Item[]>([
    {
      id: 1,
      tipo: "Produto",
      codigo: "",
      descricao: "",
      quantidade: "",
      precoUnitario: "",
      maoDeObra: "",
    },
  ]);

  const [desconto, setDesconto] = useState("");

  const [aplicarIva, setAplicarIva] = useState(false);
  const [taxaIva, setTaxaIva] = useState("");

  const [modoPagamento, setModoPagamento] =
    useState("Integral");

  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  const [observacoes, setObservacoes] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const subtotal = useMemo(() => {
    return itens.reduce((total, item) => {
      const quantidade =
        item.tipo === "Serviço"
          ? 1
          : numero(item.quantidade);

      const preco = numero(item.precoUnitario);

      const maoDeObra =
        item.tipo === "Serviço"
          ? numero(item.maoDeObra)
          : 0;

      return total + quantidade * preco + maoDeObra;
    }, 0);
  }, [itens]);

  const valorDesconto = Math.min(
    numero(desconto),
    subtotal
  );

  const baseTributavel = Math.max(
    subtotal - valorDesconto,
    0
  );

  const valorIva =
    aplicarIva && numero(taxaIva) > 0
      ? baseTributavel * (numero(taxaIva) / 100)
      : 0;

  const total = baseTributavel + valorIva;

  function adicionarItem() {
    setItens((atuais) => [
      ...atuais,
      {
        id: Date.now(),
        tipo: "Produto",
        codigo: "",
        descricao: "",
        quantidade: "",
        precoUnitario: "",
        maoDeObra: "",
      },
    ]);
  }

  function removerItem(id: number) {
    if (itens.length === 1) return;

    setItens((atuais) =>
      atuais.filter((item) => item.id !== id)
    );
  }

  function atualizarItem(
    id: number,
    campo: keyof Item,
    valor: string
  ) {
    setItens((atuais) =>
      atuais.map((item) =>
        item.id === id
          ? { ...item, [campo]: valor }
          : item
      )
    );
  }

  function adicionarPagamento() {
    setPagamentos((atuais) => [
      ...atuais,
      {
        id: Date.now(),
        numero: atuais.length + 1,
        descricao: "",
        percentual: "",
        valor: "",
        dataPrevista: "",
      },
    ]);
  }

  function removerPagamento(id: number) {
    setPagamentos((atuais) =>
      atuais.filter((pagamento) => pagamento.id !== id)
    );
  }

  function atualizarPagamento(
    id: number,
    campo: keyof Pagamento,
    valor: string
  ) {
    setPagamentos((atuais) =>
      atuais.map((pagamento) =>
        pagamento.id === id
          ? { ...pagamento, [campo]: valor }
          : pagamento
      )
    );
  }

  async function guardarProforma() {
    setErro("");
    setMensagem("");

    if (!clienteNome.trim()) {
      setErro("Informe o nome do cliente.");
      return;
    }

    const itensValidos = itens.filter(
      (item) => item.descricao.trim() !== ""
    );

    if (itensValidos.length === 0) {
      setErro("Adicione pelo menos um produto ou serviço.");
      return;
    }

    setSalvando(true);

    try {
      const {
        data: ultima,
        error: erroUltima,
      } = await supabase
        .from("proformas")
        .select("numero")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (erroUltima) {
        throw erroUltima;
      }

      let proximoNumero = 1;

      if (ultima?.numero) {
        const numeroAtual = Number(
          String(ultima.numero).replace(/\D/g, "")
        );

        if (Number.isFinite(numeroAtual)) {
          proximoNumero = numeroAtual + 1;
        }
      }

      const numeroDocumento = `PRO-${String(
        proximoNumero
      ).padStart(5, "0")}`;

      const { data: proforma, error: erroProforma } =
        await supabase
          .from("proformas")
          .insert({
            numero: numeroDocumento,
            cliente_nome: clienteNome.trim(),
            cliente_nif: clienteNif.trim() || null,
            cliente_telefone:
              clienteTelefone.trim() || null,
            cliente_email:
              clienteEmail.trim() || null,
            cliente_endereco:
              clienteEndereco.trim() || null,
            tipo_documento: "Proforma",
            subtotal,
            desconto: valorDesconto,
            aplicar_iva: aplicarIva,
            taxa_iva: aplicarIva
              ? numero(taxaIva)
              : 0,
            valor_iva: valorIva,
            total,
            modo_pagamento: modoPagamento,
            observacoes:
              observacoes.trim() || null,
            estado: "Rascunho",
            data_emissao: dataEmissao,
            data_validade:
              dataValidade || null,
          })
          .select()
          .single();

      if (erroProforma || !proforma) {
        throw erroProforma;
      }

      const itensParaGuardar = itensValidos.map(
        (item, index) => {
          const quantidade =
            item.tipo === "Serviço"
              ? 1
              : numero(item.quantidade);

          const precoUnitario =
            numero(item.precoUnitario);

          const maoDeObra =
            item.tipo === "Serviço"
              ? numero(item.maoDeObra)
              : 0;

          const totalItem =
            quantidade * precoUnitario +
            maoDeObra;

          return {
            proforma_id: proforma.id,
            tipo: item.tipo,
            codigo: item.codigo.trim() || null,
            descricao: item.descricao.trim(),
            quantidade,
            preco_unitario: precoUnitario,
            mao_de_obra: maoDeObra,
            total: totalItem,
            ordem: index,
          };
        }
      );

      const { error: erroItens } = await supabase
        .from("proforma_itens")
        .insert(itensParaGuardar);

      if (erroItens) {
        throw erroItens;
      }

      if (modoPagamento !== "Integral") {
        const pagamentosValidos = pagamentos.filter(
          (pagamento) =>
            numero(pagamento.valor) > 0
        );

        if (pagamentosValidos.length > 0) {
          const pagamentosParaGuardar =
            pagamentosValidos.map(
              (pagamento, index) => ({
                proforma_id: proforma.id,
                numero: index + 1,
                descricao:
                  pagamento.descricao.trim() ||
                  `Pagamento ${index + 1}`,
                percentual:
                  pagamento.percentual
                    ? numero(pagamento.percentual)
                    : null,
                valor: numero(pagamento.valor),
                data_prevista:
                  pagamento.dataPrevista || null,
                estado: "Pendente",
              })
            );

          const { error: erroPagamentos } =
            await supabase
              .from("proforma_pagamentos")
              .insert(
                pagamentosParaGuardar
              );

          if (erroPagamentos) {
            throw erroPagamentos;
          }
        }
      }

      setMensagem(
        `Proforma ${numeroDocumento} criada com sucesso.`
      );

      setTimeout(() => {
        window.location.href = "/admin/proformas";
      }, 1200);
    } catch (error) {
      console.error(
        "Erro ao guardar proforma:",
        error
      );

      setErro(
        "Não foi possível guardar a Proforma."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="bg-blue-700 py-10 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-semibold text-blue-200">
            DM-TECVOLT
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Nova Fatura Proforma
          </h1>

          <p className="mt-2 text-blue-100">
            Criação de orçamento comercial para cliente.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          {erro && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
              {erro}
            </div>
          )}

          {mensagem && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 font-medium text-green-700">
              {mensagem}
            </div>
          )}

          {/* CLIENTE */}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Dados do cliente
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nome do cliente *
                </label>

                <input
                  value={clienteNome}
                  onChange={(e) =>
                    setClienteNome(e.target.value)
                  }
                  placeholder="Nome completo ou empresa"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  NIF
                </label>

                <input
                  value={clienteNif}
                  onChange={(e) =>
                    setClienteNif(e.target.value)
                  }
                  placeholder="NIF do cliente"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Telefone
                </label>

                <input
                  value={clienteTelefone}
                  onChange={(e) =>
                    setClienteTelefone(e.target.value)
                  }
                  placeholder="Telefone / WhatsApp"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  E-mail
                </label>

                <input
                  type="email"
                  value={clienteEmail}
                  onChange={(e) =>
                    setClienteEmail(e.target.value)
                  }
                  placeholder="email@cliente.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Endereço
                </label>

                <input
                  value={clienteEndereco}
                  onChange={(e) =>
                    setClienteEndereco(e.target.value)
                  }
                  placeholder="Morada / endereço do cliente"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* DOCUMENTO */}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Dados da Proforma
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Data de emissão
                </label>

                <input
                  type="date"
                  value={dataEmissao}
                  onChange={(e) =>
                    setDataEmissao(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Validade da Proforma
                </label>

                <input
                  type="date"
                  value={dataValidade}
                  onChange={(e) =>
                    setDataValidade(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>
            </div>
          </div>

          {/* ITENS */}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">
                  Produtos e serviços
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Adicione produtos ou serviços diretamente.
                </p>
              </div>

              <button
                type="button"
                onClick={adicionarItem}
                className="rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-600"
              >
                + Adicionar item
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {itens.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold">
                      Item {index + 1}
                    </h3>

                    {itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removerItem(item.id)
                        }
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Tipo
                      </label>

                      <select
                        value={item.tipo}
                        onChange={(e) =>
                          atualizarItem(
                            item.id,
                            "tipo",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                      >
                        <option value="Produto">
                          Produto
                        </option>

                        <option value="Serviço">
                          Serviço
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Código
                      </label>

                      <input
                        value={item.codigo}
                        onChange={(e) =>
                          atualizarItem(
                            item.id,
                            "codigo",
                            e.target.value
                          )
                        }
                        placeholder="Código manual"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold">
                        Nome / descrição *
                      </label>

                      <input
                        value={item.descricao}
                        onChange={(e) =>
                          atualizarItem(
                            item.id,
                            "descricao",
                            e.target.value
                          )
                        }
                        placeholder="Nome do produto ou serviço"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {item.tipo === "Produto" && (
                      <>
                        <div>
                          <label className="mb-2 block text-sm font-semibold">
                            Quantidade
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantidade}
                            onChange={(e) =>
                              atualizarItem(
                                item.id,
                                "quantidade",
                                e.target.value
                              )
                            }
                            placeholder="Quantidade"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold">
                            Preço unitário
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.precoUnitario}
                            onChange={(e) =>
                              atualizarItem(
                                item.id,
                                "precoUnitario",
                                e.target.value
                              )
                            }
                            placeholder="Preço unitário"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                          />
                        </div>
                      </>
                    )}

                    {item.tipo === "Serviço" && (
                      <>
                        <div>
                          <label className="mb-2 block text-sm font-semibold">
                            Valor do serviço
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.precoUnitario}
                            onChange={(e) =>
                              atualizarItem(
                                item.id,
                                "precoUnitario",
                                e.target.value
                              )
                            }
                            placeholder="Valor do serviço"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold">
                            Mão de obra
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.maoDeObra}
                            onChange={(e) =>
                              atualizarItem(
                                item.id,
                                "maoDeObra",
                                e.target.value
                              )
                            }
                            placeholder="Mão de obra"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                          />
                        </div>
                      </>
                    )}

                    <div className="rounded-lg bg-white p-4">
                      <p className="text-sm text-gray-500">
                        Total do item
                      </p>

                      <p className="mt-1 text-lg font-bold text-blue-700">
                        {formatarKz(
                          item.tipo === "Produto"
                            ? numero(item.quantidade) *
                                numero(
                                  item.precoUnitario
                                )
                            : numero(
                                item.precoUnitario
                              ) +
                              numero(
                                item.maoDeObra
                              )
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VALORES */}

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Desconto e imposto
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Desconto
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={desconto}
                    onChange={(e) =>
                      setDesconto(e.target.value)
                    }
                    placeholder="0,00"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div>
                    <p className="font-semibold">
                      Aplicar IVA / Imposto?
                    </p>

                    <p className="text-sm text-gray-500">
                      Escolha no momento da emissão.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={aplicarIva}
                    onChange={(e) =>
                      setAplicarIva(e.target.checked)
                    }
                    className="h-5 w-5"
                  />
                </div>

                {aplicarIva && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Taxa do IVA / Imposto (%)
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={taxaIva}
                      onChange={(e) =>
                        setTaxaIva(e.target.value)
                      }
                      placeholder="Ex.: 14"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Resumo
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    {formatarKz(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Desconto
                  </span>

                  <span className="font-semibold text-red-600">
                    - {formatarKz(valorDesconto)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Base tributável
                  </span>

                  <span className="font-semibold">
                    {formatarKz(baseTributavel)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    IVA
                    {aplicarIva
                      ? ` (${numero(taxaIva)}%)`
                      : " (0%)"}
                  </span>

                  <span className="font-semibold">
                    {formatarKz(valorIva)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-blue-700">
                      {formatarKz(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGAMENTO */}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Condições de pagamento
            </h2>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">
                Modo de pagamento
              </label>

              <select
                value={modoPagamento}
                onChange={(e) => {
                  setModoPagamento(e.target.value);

                  if (
                    e.target.value ===
                    "Integral"
                  ) {
                    setPagamentos([]);
                  }
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 md:max-w-md"
              >
                <option value="Integral">
                  Pagamento integral
                </option>

                <option value="Em prestações">
                  Em prestações
                </option>

                <option value="Faseado">
                  Faseado por etapas
                </option>
              </select>
            </div>

            {modoPagamento !== "Integral" && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">
                    {modoPagamento ===
                    "Faseado"
                      ? "Etapas de pagamento"
                      : "Prestações"}
                  </h3>

                  <button
                    type="button"
                    onClick={
                      adicionarPagamento
                    }
                    className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
                  >
                    + Adicionar
                  </button>
                </div>

                {pagamentos.length === 0 && (
                  <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                    Adicione as condições de pagamento.
                  </p>
                )}

                <div className="mt-4 space-y-4">
                  {pagamentos.map(
                    (pagamento, index) => (
                      <div
                        key={pagamento.id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="mb-4 flex justify-between">
                          <strong>
                            {modoPagamento ===
                            "Faseado"
                              ? `Etapa ${
                                  index + 1
                                }`
                              : `Prestação ${
                                  index + 1
                                }`}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              removerPagamento(
                                pagamento.id
                              )
                            }
                            className="text-sm font-semibold text-red-600"
                          >
                            Remover
                          </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                          <input
                            value={
                              pagamento.descricao
                            }
                            onChange={(e) =>
                              atualizarPagamento(
                                pagamento.id,
                                "descricao",
                                e.target.value
                              )
                            }
                            placeholder={
                              modoPagamento ===
                              "Faseado"
                                ? "Ex.: Instalação"
                                : "Descrição"
                            }
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                          />

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              pagamento.percentual
                            }
                            onChange={(e) =>
                              atualizarPagamento(
                                pagamento.id,
                                "percentual",
                                e.target.value
                              )
                            }
                            placeholder="%"
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                          />

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={pagamento.valor}
                            onChange={(e) =>
                              atualizarPagamento(
                                pagamento.id,
                                "valor",
                                e.target.value
                              )
                            }
                            placeholder="Valor"
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                          />

                          <input
                            type="date"
                            value={
                              pagamento.dataPrevista
                            }
                            onChange={(e) =>
                              atualizarPagamento(
                                pagamento.id,
                                "dataPrevista",
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* OBSERVAÇÕES */}

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Observações
            </h2>

            <textarea
              value={observacoes}
              onChange={(e) =>
                setObservacoes(e.target.value)
              }
              rows={5}
              placeholder="Observações ou condições adicionais..."
              className="mt-5 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* BOTÃO */}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={guardarProforma}
              disabled={salvando}
              className="rounded-xl bg-blue-700 px-8 py-4 text-lg font-bold text-white shadow-sm hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando
                ? "A guardar..."
                : "Guardar Fatura Proforma"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}