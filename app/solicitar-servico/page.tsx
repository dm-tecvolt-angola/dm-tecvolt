"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

const provinciasMunicipios: Record<string, string[]> = {
  Bengo: [
    "Dembos",
    "Nambuangongo",
    "Pango Aluquém",
    "Ambriz",
    "Dande",
    "Bula Atumba",
    "Quibaxe",
  ],

  Benguela: [
    "Benguela",
    "Lobito",
    "Baía Farta",
    "Catumbela",
    "Chongoroi",
    "Cubal",
    "Ganda",
    "Balombo",
    "Bocoio",
    "Caimbambo",
  ],

  Bié: [
    "Cuito",
    "Andulo",
    "Camacupa",
    "Catabola",
    "Chitembo",
    "Cuemba",
    "Cunhinga",
    "Nharea",
  ],

  Cabinda: [
    "Cabinda",
    "Cacongo",
    "Buco-Zau",
    "Belize",
  ],

  "Cuando Cubango": [
    "Menongue",
    "Cuchi",
    "Cuito Cuanavale",
    "Dirico",
    "Mavinga",
    "Nancova",
    "Rivungo",
  ],

  "Cuanza Norte": [
    "Cazengo",
    "Ambaca",
    "Banga",
    "Bolongongo",
    "Cambambe",
    "Golungo Alto",
    "Lucala",
    "Quiculungo",
    "Samba Cajú",
  ],

  "Cuanza Sul": [
    "Sumbe",
    "Amboim",
    "Cassongue",
    "Conda",
    "Ebo",
    "Libolo",
    "Mussende",
    "Porto Amboim",
    "Quibala",
    "Quilenda",
    "Seles",
  ],

  Cunene: [
    "Ondjiva",
    "Cahama",
    "Curoca",
    "Cuvelai",
    "Namacunde",
    "Ombadja",
  ],

  Huambo: [
    "Huambo",
    "Bailundo",
    "Caála",
    "Catchiungo",
    "Ecunha",
    "Longonjo",
    "Londuimbali",
    "Mungo",
    "Tchicala-Tcholoanga",
    "Ucuma",
  ],

  Huíla: [
    "Lubango",
    "Caconda",
    "Caluquembe",
    "Chibia",
    "Chicomba",
    "Chipindo",
    "Cuvango",
    "Humpata",
    "Jamba",
    "Matala",
    "Quilengues",
    "Quipungo",
  ],

  "Icolo e Bengo": [
    "Catete",
    "Quiçama",
    "Mussulo",
  ],

  Luanda: [
    "Luanda",
    "Belas",
    "Cacuaco",
    "Cazenga",
    "Kilamba Kiaxi",
    "Talatona",
    "Viana",
  ],

  "Lunda Norte": [
    "Dundo",
    "Cambulo",
    "Capenda Camulemba",
    "Caungula",
    "Chitato",
    "Cuango",
    "Cuílo",
    "Lubalo",
    "Lucapa",
    "Xá-Muteba",
  ],

  "Lunda Sul": [
    "Saurimo",
    "Cacolo",
    "Dala",
    "Muconda",
    "Quirima",
  ],

  Malanje: [
    "Malanje",
    "Cacuso",
    "Calandula",
    "Cambundi-Catembo",
    "Cangandala",
    "Caombo",
    "Kiwaba Nzoji",
    "Luquembo",
    "Massango",
    "Mucari",
    "Quela",
    "Quirima",
  ],

  Moxico: [
    "Luena",
    "Alto Cuito",
    "Bundas",
    "Camanongue",
    "Cameia",
    "Léua",
    "Luau",
    "Luacano",
    "Luchazes",
  ],

  "Moxico Leste": [
    "Cazombo",
    "Macondo",
    "Luacano",
    "Lago",
  ],

  Namibe: [
    "Moçâmedes",
    "Bibala",
    "Camucuio",
    "Tômbwa",
    "Virei",
  ],

  Uíge: [
    "Uíge",
    "Alto Cauale",
    "Ambuila",
    "Bembe",
    "Buengas",
    "Damba",
    "Maquela do Zombo",
    "Mucaba",
    "Negage",
    "Puri",
    "Quimbele",
    "Quitexe",
    "Songo",
  ],

  Zaire: [
    "Mbanza Kongo",
    "Cuimba",
    "Nóqui",
    "Nzeto",
    "Soyo",
    "Tomboco",
  ],
};

const servicos = [
  "CCTV e Videovigilância",
  "Instalações Elétricas",
  "Cerca Elétrica",
  "Videoporteiro",
  "Manutenção Técnica",
  "Segurança Eletrónica",
];

export default function SolicitarServicoPage() {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  const [provinciaSelecionada, setProvinciaSelecionada] = useState("");
  const [municipioSelecionado, setMunicipioSelecionado] = useState("");

  const [dadosPedido, setDadosPedido] = useState({
    nome: "",
    telefone: "",
    provincia: "",
    municipio: "",
    servico: "",
    descricao: "",
  });

  const municipios =
    provinciaSelecionada !== ""
      ? provinciasMunicipios[provinciaSelecionada] || []
      : [];

  async function enviarPedido(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setEnviando(true);
    setErro("");

    const form = event.currentTarget;
    const dados = new FormData(form);

    const nome = String(dados.get("nome") || "").trim();
    const telefone = String(dados.get("telefone") || "").trim();
    const provincia = String(dados.get("provincia") || "").trim();
    const municipio = String(dados.get("municipio") || "").trim();
    const servico = String(dados.get("servico") || "").trim();
    const descricao = String(dados.get("descricao") || "").trim();

    const pedido = {
      nome,
      telefone,
      provincia,
      municipio,
      servico,
      descricao,
    };

    const { error } = await supabase.from("clientes").insert({
      nome,
      telefone,
      provincia,
      municipio,
      servico,
      descricao,
      estado: "pendente",
    });

    if (error) {
      console.error(
        "Erro ao enviar pedido:",
        JSON.stringify(error, null, 2)
      );

      setErro(
        "Não foi possível enviar o pedido. Verifique a ligação e tente novamente."
      );

      setEnviando(false);
      return;
    }

    setDadosPedido(pedido);

    setEnviado(true);
    setEnviando(false);

    form.reset();

    setProvinciaSelecionada("");
    setMunicipioSelecionado("");
  }

  function abrirWhatsApp() {
    const numeroDMTECVOLT = "244949450344";

    const mensagem = `Olá, DM-TECVOLT!

Acabei de enviar um pedido de serviço através do vosso site.

Nome: ${dadosPedido.nome}
Telefone/WhatsApp: ${dadosPedido.telefone}
Província: ${dadosPedido.provincia}
Município: ${dadosPedido.municipio}
Serviço: ${dadosPedido.servico}

Descrição:
${dadosPedido.descricao}

Gostaria de confirmar o envio do meu pedido.`;

    const mensagemCodificada = encodeURIComponent(mensagem);

    window.open(
      `https://wa.me/${numeroDMTECVOLT}?text=${mensagemCodificada}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Cabeçalho */}
      <section className="bg-blue-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-semibold text-blue-200">
            Solicitação de serviço
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Conte-nos o que precisa
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Preencha o formulário abaixo com os detalhes do seu projeto.
            Entraremos em contacto para analisar a sua necessidade.
          </p>
        </div>
      </section>

      {/* Formulário */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg md:p-10">
            {enviado ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700">
                  ✓
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  Pedido recebido!
                </h2>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
                  O seu pedido foi enviado com sucesso para a
                  <strong> DM-TECVOLT</strong>.
                </p>

                <div className="mx-auto mt-8 max-w-xl rounded-xl border border-gray-200 bg-gray-50 p-6 text-left">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    Resumo do pedido
                  </h3>

                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Nome:</strong> {dadosPedido.nome}
                    </p>

                    <p>
                      <strong>Telefone:</strong> {dadosPedido.telefone}
                    </p>

                    <p>
                      <strong>Localização:</strong>{" "}
                      {dadosPedido.municipio}, {dadosPedido.provincia}
                    </p>

                    <p>
                      <strong>Serviço:</strong> {dadosPedido.servico}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="mb-4 text-sm text-gray-500">
                    Para agilizar o atendimento, envie também a confirmação
                    pelo WhatsApp.
                  </p>

                  <button
                    type="button"
                    onClick={abrirWhatsApp}
                    className="inline-flex items-center justify-center gap-3 rounded-lg bg-green-600 px-7 py-4 font-semibold text-white shadow-md transition hover:bg-green-700 hover:shadow-lg"
                  >
                    <span className="text-xl">💬</span>
                    Confirmar pelo WhatsApp
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEnviado(false);
                    setErro("");
                    setDadosPedido({
                      nome: "",
                      telefone: "",
                      provincia: "",
                      municipio: "",
                      servico: "",
                      descricao: "",
                    });
                  }}
                  className="mt-6 block w-full text-center text-sm font-medium text-blue-700 hover:underline"
                >
                  Enviar outro pedido
                </button>
              </div>
            ) : (
              <form onSubmit={enviarPedido} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Dados do cliente
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Preencha os seus dados para podermos entrar em contacto.
                  </p>
                </div>

                {/* Nome */}
                <div>
                  <label
                    htmlFor="nome"
                    className="mb-2 block font-medium"
                  >
                    Nome completo
                  </label>

                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    placeholder="Digite o seu nome completo"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label
                    htmlFor="telefone"
                    className="mb-2 block font-medium"
                  >
                    Telefone / WhatsApp
                  </label>

                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    required
                    placeholder="Ex.: +244 9XX XXX XXX"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Localização */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Província */}
                  <div>
                    <label
                      htmlFor="provincia"
                      className="mb-2 block font-medium"
                    >
                      Província
                    </label>

                    <select
                      id="provincia"
                      name="provincia"
                      required
                      value={provinciaSelecionada}
                      onChange={(event) => {
                        setProvinciaSelecionada(event.target.value);
                        setMunicipioSelecionado("");
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="" disabled>
                        Selecione a província
                      </option>

                      {Object.keys(provinciasMunicipios)
                        .sort((a, b) => a.localeCompare(b, "pt"))
                        .map((provincia) => (
                          <option key={provincia} value={provincia}>
                            {provincia}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Município */}
                  <div>
                    <label
                      htmlFor="municipio"
                      className="mb-2 block font-medium"
                    >
                      Município
                    </label>

                    <select
                      id="municipio"
                      name="municipio"
                      required
                      value={municipioSelecionado}
                      onChange={(event) =>
                        setMunicipioSelecionado(event.target.value)
                      }
                      disabled={!provinciaSelecionada}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <option value="" disabled>
                        {provinciaSelecionada
                          ? "Selecione o município"
                          : "Selecione primeiro a província"}
                      </option>

                      {municipios
                        .sort((a, b) => a.localeCompare(b, "pt"))
                        .map((municipio) => (
                          <option key={municipio} value={municipio}>
                            {municipio}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Serviço */}
                <div>
                  <label
                    htmlFor="servico"
                    className="mb-2 block font-medium"
                  >
                    Serviço pretendido
                  </label>

                  <select
                    id="servico"
                    name="servico"
                    required
                    defaultValue=""
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      Selecione um serviço
                    </option>

                    {servicos.map((servico) => (
                      <option key={servico} value={servico}>
                        {servico}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label
                    htmlFor="descricao"
                    className="mb-2 block font-medium"
                  >
                    Descrição do pedido
                  </label>

                  <textarea
                    id="descricao"
                    name="descricao"
                    required
                    rows={6}
                    placeholder="Descreva o trabalho que pretende realizar..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Erro */}
                {erro && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {erro}
                  </div>
                )}

                {/* Botão */}
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {enviando
                    ? "A enviar pedido..."
                    : "Enviar Pedido"}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Os seus dados serão utilizados apenas para responder à sua
                  solicitação.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}