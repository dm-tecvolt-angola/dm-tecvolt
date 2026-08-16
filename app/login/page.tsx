"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEntrando(true);
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      console.error("Erro no login:", error);
      setErro("E-mail ou senha incorretos.");
      setEntrando(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
          {/* Logo / Nome */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-3xl font-bold text-white">
              D
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              DM-TECVOLT
            </h1>

            <p className="mt-2 text-gray-500">
              Área administrativa
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={entrar} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-medium text-gray-900"
              >
                E-mail
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dm-tecvolt.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="mb-2 block font-medium text-gray-900"
              >
                Palavra-passe
              </label>

              <input
                id="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite a sua palavra-passe"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {erro && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={entrando}
              className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {entrando ? "A entrar..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}