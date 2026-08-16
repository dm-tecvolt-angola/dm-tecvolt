"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/servicos", label: "Serviços" },
  { href: "/projetos", label: "Projetos" },
  { href: "/contactos", label: "Contactos" },
];

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo / Nome */}
        <Link
          href="/"
          onClick={() => setMenuAberto(false)}
          className="group"
        >
          <div className="flex items-center gap-3">
  <Image
    src="/images/logo/logo.jpeg"
    alt="DM-TECVOLT"
    width={180}
    height={60}
    className="h-12 w-auto object-contain"
    priority
  />

  <div className="hidden border-l border-gray-200 pl-3 sm:block">
    <div className="text-sm font-semibold text-gray-800">
      DM-TECVOLT
    </div>

    <div className="text-xs text-gray-500">
      Venda e Serviço (SU), LDA
    </div>
  </div>
</div>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-gray-700 transition hover:text-blue-700"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/solicitar-servico"
            className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-600"
          >
            Solicitar Serviço
          </Link>
        </nav>

        {/* Botão Mobile */}
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto(!menuAberto)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-2xl text-gray-700 md:hidden"
        >
          {menuAberto ? "×" : "☰"}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="border-t bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className="border-b border-gray-100 py-4 font-medium text-gray-700 hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/solicitar-servico"
              onClick={() => setMenuAberto(false)}
              className="mt-4 rounded-lg bg-blue-700 px-5 py-3 text-center font-semibold text-white hover:bg-blue-600"
            >
              Solicitar Serviço
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}