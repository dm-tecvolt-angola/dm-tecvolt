"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Configuracao = {
  id: number;
  nome_empresa: string;
  nif: string;
  endereco: string;
  bairro: string;
  provincia: string;
  telefone1: string;
  telefone2: string;
  whatsapp: string;
  email: string;
  website: string;
  banco1: string;
  conta1: string;
  iban1: string;
  banco2: string;
  conta2: string;
  iban2: string;
  observacoes: string;
};

const valoresIniciais: Configuracao = {
  id: 1,
  nome_empresa: "",
  nif: "",
  endereco: "",
  bairro: "",
  provincia: "",
  telefone1: "",
  telefone2: "",
  whatsapp: "",
  email: "",
  website: "",
  banco1: "",
  conta1: "",
  iban1: "",
  banco2: "",
  conta2: "",
  iban2: "",
  observacoes: "",
};

export default function ConfiguracoesPage() {
  const [config, setConfig] =
    useState<Configuracao>(valoresIniciais);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [mensagem, setMensagem] =
    useState("");

  const [erro, setErro] =
    useState("");

  useEffect(() => {
    carregarConfiguracao();
  }, []);

  async function carregarConfiguracao() {
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
      .from("configuracoes_empresa")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error(
        "Erro ao carregar configurações:",
        error
      );

      setErro(
        "Não foi possível carregar as configurações."
      );

      setCarregando(false);
      return;
    }

    if (data) {
      setConfig({
        ...valoresIniciais,
        ...data,
      });
    }

    setCarregando(false);
  }

  function alterarCampo(
    campo: keyof Configuracao,
    valor: string
  ) {
    setConfig((atual) => ({
      ...atual,
      [campo]: valor,
    }));

    setMensagem("");
    setErro("");
  }

  async function guardarConfiguracao(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSalvando(true);
    setMensagem("");
    setErro("");

    const {
      data: { user },
      error: erroUsuario,
    } = await supabase.auth.getUser();

    if (erroUsuario || !user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase
      .from("configuracoes_empresa")
      .upsert(
        {
          id: 1,
          nome_empresa: config.nome_empresa,
          nif: config.nif,
          endereco: config.endereco,
          bairro: config.bairro,
          provincia: config.provincia,
          telefone1: config.telefone1,
          telefone2: config.telefone2,
          whatsapp: config.whatsapp,
          email: config.email,
          website: config.website,
          banco1: config.banco1,
          conta1: config.conta1,
          iban1: config.iban1,
          banco2: config.banco2,
          conta2: config.conta2,
          iban2: config.iban2,
          observacoes: config.observacoes,
          atualizado_em: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

    if (error) {
      console.error(
        "Erro ao guardar configurações:",
        error
      );

      setErro(
        "Não foi possível guardar as configurações."
      );

      setSalvando(false);
      return;
    }

    setMensagem(
      "Dados da empresa guardados com sucesso."
    );

    setSalvando(false);
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            A carregar configurações...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="bg-blue-700 py-10 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <p className="font-semibold text-blue-200">
            Administração
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Configurações da empresa
          </h1>

          <p className="mt-2 text-blue-100">
            Estes dados serão utilizados
            automaticamente nos documentos
            comerciais.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-5xl px-6">
          {mensagem && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 font-medium text-green-700">
              {mensagem}
            </div>
          )}

          {erro && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">
              {erro}
            </div>
          )}

          <form
            onSubmit={guardarConfiguracao}
            className="space-y-8"
          >
            {/* EMPRESA */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Dados da empresa
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Informações que aparecerão nos
                documentos.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Campo
                  label="Nome da empresa"
                  value={config.nome_empresa}
                  onChange={(v) =>
                    alterarCampo(
                      "nome_empresa",
                      v
                    )
                  }
                  required
                />

                <Campo
                  label="NIF"
                  value={config.nif}
                  onChange={(v) =>
                    alterarCampo("nif", v)
                  }
                />

                <Campo
                  label="Endereço"
                  value={config.endereco}
                  onChange={(v) =>
                    alterarCampo(
                      "endereco",
                      v
                    )
                  }
                />

                <Campo
                  label="Bairro"
                  value={config.bairro}
                  onChange={(v) =>
                    alterarCampo(
                      "bairro",
                      v
                    )
                  }
                />

                <Campo
                  label="Província"
                  value={config.provincia}
                  onChange={(v) =>
                    alterarCampo(
                      "provincia",
                      v
                    )
                  }
                />

                <Campo
                  label="Website"
                  value={config.website}
                  onChange={(v) =>
                    alterarCampo(
                      "website",
                      v
                    )
                  }
                />
              </div>
            </section>

            {/* CONTACTOS */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Contactos
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Campo
                  label="Telefone 1"
                  value={config.telefone1}
                  onChange={(v) =>
                    alterarCampo(
                      "telefone1",
                      v
                    )
                  }
                />

                <Campo
                  label="Telefone 2"
                  value={config.telefone2}
                  onChange={(v) =>
                    alterarCampo(
                      "telefone2",
                      v
                    )
                  }
                />

                <Campo
                  label="WhatsApp"
                  value={config.whatsapp}
                  onChange={(v) =>
                    alterarCampo(
                      "whatsapp",
                      v
                    )
                  }
                />

                <Campo
                  label="Email"
                  type="email"
                  value={config.email}
                  onChange={(v) =>
                    alterarCampo(
                      "email",
                      v
                    )
                  }
                />
              </div>
            </section>

            {/* BANCO 1 */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Dados bancários
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                O primeiro banco será apresentado
                nos documentos da empresa.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <Campo
                  label="Banco"
                  value={config.banco1}
                  onChange={(v) =>
                    alterarCampo(
                      "banco1",
                      v
                    )
                  }
                />

                <Campo
                  label="Número da conta"
                  value={config.conta1}
                  onChange={(v) =>
                    alterarCampo(
                      "conta1",
                      v
                    )
                  }
                />

                <Campo
                  label="IBAN"
                  value={config.iban1}
                  onChange={(v) =>
                    alterarCampo(
                      "iban1",
                      v
                    )
                  }
                />
              </div>
            </section>

            {/* BANCO 2 */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Segundo banco
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <Campo
                  label="Banco"
                  value={config.banco2}
                  onChange={(v) =>
                    alterarCampo(
                      "banco2",
                      v
                    )
                  }
                />

                <Campo
                  label="Número da conta"
                  value={config.conta2}
                  onChange={(v) =>
                    alterarCampo(
                      "conta2",
                      v
                    )
                  }
                />

                <Campo
                  label="IBAN"
                  value={config.iban2}
                  onChange={(v) =>
                    alterarCampo(
                      "iban2",
                      v
                    )
                  }
                />
              </div>
            </section>

            {/* OBSERVAÇÕES */}

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Observações
              </h2>

              <textarea
                value={config.observacoes}
                onChange={(e) =>
                  alterarCampo(
                    "observacoes",
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Informações adicionais da empresa..."
                className="mt-5 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </section>

            {/* BOTÃO */}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={salvando}
                className="rounded-lg bg-blue-700 px-8 py-3 font-bold text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {salvando
                  ? "A guardar..."
                  : "Guardar dados da empresa"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        required={required}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}