"use client";

export default function WhatsAppButton() {
  const numero = "244949450344";

  const mensagem = encodeURIComponent(
    "Olá, DM-TECVOLT! Gostaria de obter informações sobre os vossos serviços."
  );

  return (
    <a
      href={`https://wa.me/${numero}?text=${mensagem}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a DM-TECVOLT pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-lg transition duration-300 hover:scale-110 hover:bg-green-600 md:h-16 md:w-16 md:text-3xl"
    >
      💬
    </a>
  );
}