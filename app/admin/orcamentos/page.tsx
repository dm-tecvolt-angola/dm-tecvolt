"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ItemProforma = {
  descricao: string;
  quantidade: number;
  preco_unitario: number;
};

type Proforma = {
  id: number;
  numero: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  cliente_email: string | null;
  data_emissao: string;
  validade: string | null;
  estado: string;
  aplicar_iva: boolean;
  taxa_iva: number;
  subtotal: number;
  valor_iva: number;
  desconto: number;
  total: number;
  observacoes: string | null;
};

const estados = [
  "Pendente",
  "Enviada",
  "Aceite",
  "Recusada",
  "Expirada",
];

const taxasIVA = Array.from({ length: 15 }, (_, i) => i);

export default function OrcamentosPage() {
  const router = useRouter();

  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [clienteNome, setClienteNome] = useState("");
  const [clienteTelefone, setClienteTelefone] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");

  const [dataEmissao, setDataEmissao] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [validade, setValidade] = useState("");

  const [estado, setEstado] = useState("Pendente");

  const [aplicarIVA, setAplicarIVA] = useState(false);
  const [taxaIVA, setTaxaIVA] = useState(14);

  const [desconto, setDesconto] = useState(0);
  const [observacoes, setObservacoes] = useState("");

  const [itens, setItens] = useState<ItemProforma[]>([
    {
      descricao: "",
      quantidade: 1,
      preco_unitario: 0,
    },
  ]);

  function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
    }).format(valor);
  }

  function calcularSubtotal() {
    return itens.reduce(
      (total, item) =>
        total + Number(item.quantidade) * Number(item.preco_unitario),
      0
    );
  }

  const subtotal = calcularSubtotal();

  const valorIVA = aplicarIVA
    ? (subtotal - Number(desconto)) * (Number(taxaIVA) / 100)
    : 0;

  const total = subtotal - Number(desconto) + valorIVA;

  async function carregarProformas() {
    setCarregando(true);
    setErro("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("proformas")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      console.error(error);
      setErro("Não foi possível carregar as faturas proforma.");
      setCarregando(false);
      return;
    }

    setProformas(data || []);
    setCarregando(false);
  }

  useEffect(() => {
    carregarProformas();
  }, []);

  function adicionarItem() {
    setItens([
      ...itens,
      {
        descricao: "",
        quantidade: 1,
        preco_unitario: 0,
      },
    ]);
  }

  function removerItem(index: number) {
    if (itens.length === 1) return;

    setItens(itens.filter((_, i) => i !== index));
  }

  function atualizarItem(
    index: number,
    campo: keyof ItemProforma,
    valor: string
  ) {
    setItens(
      itens.map((item, i) =>
        i === index
          ? {
              ...item,
              [campo]:
                campo === "descricao"
                  ? valor
                  : Number(valor),
            }
          : item
      )
    );
  }

  function gerarNumeroProforma() {
    const ano = new Date().getFullYear();
    const numero = String(proformas.length + 1).padStart(4, "0");

    return `FP-${ano}-${numero}`;
  }

  async function criarProforma(e: React.FormEvent) {
    e.preventDefault();

    setErro("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!clienteNome.trim()) {
      setErro("Informe o nome do cliente.");
      return;
    }

    if (itens.some((item) => !item.descricao.trim())) {
      setErro("Preencha a descrição de todos os itens.");
      return;
    }

    if (desconto > subtotal) {
      setErro("O desconto não pode ser superior ao subtotal.");
      return;
    }

    const numero = gerarNumeroProforma();

    const { data: proforma, error: erroProforma } = await supabase
      .from("proformas")
      .insert({
        numero,
        cliente_nome: clienteNome.trim(),
        cliente_telefone: clienteTelefone.trim() || null,
        cliente_email: clienteEmail.trim() || null,
        data_emissao: dataEmissao,
        validade: validade || null,
        estado,
        aplicar_iva: aplicarIVA,
        taxa_iva: aplicarIVA ? Number(taxaIVA) : 0,
        subtotal,
        valor_iva: valorIVA,
        desconto: Number(desconto),
        total,
        observacoes: observacoes.trim() || null,
        criado_por: user.id,
      })
      .select()
      .single();

    if (erroProforma || !proforma) {
      console.error(erroProforma);
      setErro("Não foi possível criar a fatura proforma.");
      return;
    }

    const itensParaGuardar = itens.map((item) => ({
      proforma_id: proforma.id,
      descricao: item.descricao.trim(),
      quantidade: Number(item.quantidade),
      preco_unitario: Number(item.preco_unitario),
      subtotal:
        Number(item.quantidade) *
        Number(item.preco_unitario),
    }));

    const { error: erroItens } = await supabase
      .from("proforma_itens")
      .insert(itensParaGuardar);

    if (erroItens) {
      console.error(erroItens);

      await supabase
        .from("proformas")
        .delete()
        .eq("id", proforma.id);

      setErro("Não foi possível guardar os itens da proforma.");
      return;
    }

    setClienteNome("");
    setClienteTelefone("");
    setClienteEmail("");
    setValidade("");
    setEstado("Pendente");
    setAplicarIVA(false);
    setTaxaIVA(14);
    setDesconto(0);
    setObservacoes("");

    setItens([
      {
        descricao: "",
        quantidade: 1,
        preco_unitario: 0,
      },
    ]);

    setMostrarFormulario(false);

    await carregarProformas();
  }

  async function alterarEstado(id: number, novoEstado: string) {
    const { error } = await supabase
      .from("proformas")
      .update({ estado: novoEstado })
      .eq("id", id);

    if (error) {
      console.error(error);
      setErro("Não foi possível alterar o estado.");
      return;
    }

    setProformas((lista) =>
      lista.map((proforma) =>
        proforma.id === id
          ? { ...proforma, estado: novoEstado }
          : proforma
      )
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* CABEÇALHO */}
      <section className="bg-blue-700 py-10 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <button
            onClick={() => router.push("/admin")}
            className="mb-5 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
          >
            ← Voltar ao painel
          </button>

          <p className="font-semibold text-blue-200">
            Gestão comercial
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Faturas Proforma
          </h1>

          <p className="mt-3 text-blue-100">
            Crie e gerencie propostas comerciais da DM-TECVOLT.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          {/* AÇÕES */}
          <div className="mb-6 flex flex-wrap justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Proformas
              </h2>

              <p className="mt-1 text-gray-500">
                {proformas.length} documento(s)
              </p>
            </div>

            <button
              onClick={() =>
                setMostrarFormulario(!mostrarFormulario)
              }
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-600"
            >
              {mostrarFormulario
                ? "Fechar formulário"
                : "+ Nova Fatura Proforma"}
            </button>
          </div>

          {/* ERRO */}
          {erro && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {erro}
            </div>
          )}

          {/* FORMULÁRIO */}
          {mostrarFormulario && (
            <form
              onSubmit={criarProforma}
              className="mb-10 rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="mb-6 text-xl font-bold">
                Nova Fatura Proforma
              </h2>

              {/* CLIENTE */}
              <div className="mb-8">
                <h3 className="mb-4 font-bold text-gray-800">
                  Dados do cliente
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Nome *
                    </label>

                    <input
                      value={clienteNome}
                      onChange={(e) =>
                        setClienteNome(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                      placeholder="Nome do cliente"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                      placeholder="Telefone / WhatsApp"
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* DATAS */}
              <div className="mb-8 grid gap-4 md:grid-cols-3">
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
                    Validade
                  </label>

                  <input
                    type="date"
                    value={validade}
                    onChange={(e) =>
                      setValidade(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Estado
                  </label>

                  <select
                    value={estado}
                    onChange={(e) =>
                      setEstado(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                  >
                    {estados.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ITENS */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">
                    Produtos / Serviços
                  </h3>

                  <button
                    type="button"
                    onClick={adicionarItem}
                    className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
                  >
                    + Adicionar item
                  </button>
                </div>

                <div className="space-y-4">
                  {itens.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-xl border border-gray-200 p-4 md:grid-cols-[1fr_120px_180px_120px]"
                    >
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-gray-500">
                          Descrição
                        </label>

                        <input
                          value={item.descricao}
                          onChange={(e) =>
                            atualizarItem(
                              index,
                              "descricao",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                          placeholder="Ex.: Câmara Hikvision"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-gray-500">
                          Quantidade
                        </label>

                        <input
                          type="number"
                          min="0.001"
                          step="0.001"
                          value={item.quantidade}
                          onChange={(e) =>
                            atualizarItem(
                              index,
                              "quantidade",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-gray-500">
                          Preço unitário
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.preco_unitario}
                          onChange={(e) =>
                            atualizarItem(
                              index,
                              "preco_unitario",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-gray-500">
                          Subtotal
                        </label>

                        <div className="rounded-lg bg-gray-100 px-3 py-2 font-semibold">
                          {formatarMoeda(
                            Number(item.quantidade) *
                              Number(item.preco_unitario)
                          )}
                        </div>
                      </div>

                      {itens.length > 1 && (
                        <div className="md:col-span-4">
                          <button
                            type="button"
                            onClick={() =>
                              removerItem(index)
                            }
                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                          >
                            Remover item
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* IMPOSTOS */}
              <div className="mb-8 rounded-xl bg-gray-50 p-5">
                <h3 className="mb-4 font-bold">
                  Impostos e valores
                </h3>

                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Aplicar IVA?
                    </label>

                    <select
                      value={aplicarIVA ? "sim" : "nao"}
                      onChange={(e) =>
                        setAplicarIVA(
                          e.target.value === "sim"
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                    >
                      <option value="nao">Não</option>
                      <option value="sim">Sim</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Taxa IVA
                    </label>

                    <select
                      value={taxaIVA}
                      disabled={!aplicarIVA}
                      onChange={(e) =>
                        setTaxaIVA(Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 disabled:bg-gray-100"
                    >
                      {taxasIVA.map((taxa) => (
                        <option key={taxa} value={taxa}>
                          {taxa}%
                        </option>
                      ))}
                    </select>
                  </div>

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
                        setDesconto(Number(e.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3"
                    />
                  </div>

                  <div className="rounded-lg bg-white p-4">
                    <p className="text-sm text-gray-500">
                      IVA
                    </p>

                    <p className="mt-1 font-bold">
                      {formatarMoeda(valorIVA)}
                    </p>
                  </div>
                </div>
              </div>

              {/* TOTAIS */}
              <div className="mb-8 ml-auto max-w-md space-y-3 rounded-xl bg-gray-50 p-5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong>
                    {formatarMoeda(subtotal)}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>Desconto</span>
                  <strong>
                    - {formatarMoeda(Number(desconto))}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>
                    IVA ({aplicarIVA ? taxaIVA : 0}%)
                  </span>
                  <strong>
                    {formatarMoeda(valorIVA)}
                  </strong>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold">
                      TOTAL
                    </span>

                    <strong className="text-blue-700">
                      {formatarMoeda(total)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* OBSERVAÇÕES */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold">
                  Observações
                </label>

                <textarea
                  value={observacoes}
                  onChange={(e) =>
                    setObservacoes(e.target.value)
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="Condições, prazo de execução, garantia, forma de pagamento..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-600"
                >
                  Guardar Fatura Proforma
                </button>
              </div>
            </form>
          )}

          {/* LISTA */}
          {carregando ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              A carregar proformas...
            </div>
          ) : proformas.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">📄</div>

              <h2 className="mt-4 text-2xl font-bold">
                Nenhuma Fatura Proforma
              </h2>

              <p className="mt-2 text-gray-500">
                Crie a primeira Fatura Proforma da
                DM-TECVOLT.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm">
                        Número
                      </th>

                      <th className="px-6 py-4 text-left text-sm">
                        Cliente
                      </th>

                      <th className="px-6 py-4 text-left text-sm">
                        Data
                      </th>

                      <th className="px-6 py-4 text-left text-sm">
                        Estado
                      </th>

                      <th className="px-6 py-4 text-right text-sm">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {proformas.map((proforma) => (
                      <tr
                        key={proforma.id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-6 py-5 font-bold text-blue-700">
                          {proforma.numero}
                        </td>

                        <td className="px-6 py-5">
                          <div className="font-semibold">
                            {proforma.cliente_nome}
                          </div>

                          {proforma.cliente_telefone && (
                            <div className="text-sm text-gray-500">
                              {proforma.cliente_telefone}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          {new Date(
                            proforma.data_emissao
                          ).toLocaleDateString("pt-PT")}
                        </td>

                        <td className="px-6 py-5">
                          <select
                            value={proforma.estado}
                            onChange={(e) =>
                              alterarEstado(
                                proforma.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold"
                          >
                            {estados.map((item) => (
                              <option
                                key={item}
                                value={item}
                              >
                                {item}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-6 py-5 text-right font-bold">
                          {formatarMoeda(
                            Number(proforma.total)
                          )}
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