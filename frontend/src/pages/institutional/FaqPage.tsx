import {
  HelpCircle,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { InstitutionalPage } from "../../components/InstitutionalPage";
import { storeConfig } from "../../config/storeConfig";

const questions = [
  {
    question: "Preciso ter uma conta para comprar?",
    answer:
      "Você pode navegar e consultar os produtos sem estar conectado. Para concluir a compra e acompanhar seus pedidos, será necessário entrar em uma conta ou criar um cadastro.",
  },
  {
    question: "Como encontro um produto?",
    answer:
      "Utilize a barra de busca para pesquisar pelo nome ou selecione uma das categorias exibidas no topo da loja. Os resultados serão organizados conforme a busca ou categoria escolhida.",
  },
  {
    question: "Os produtos exibidos estão disponíveis?",
    answer:
      "A loja apresenta produtos cadastrados com estoque disponível para compra. Como o estoque pode mudar, a disponibilidade final será verificada durante a conclusão do pedido.",
  },
  {
    question: "Como as cartas são classificadas?",
    answer:
      "Quando aplicável, as cartas podem apresentar informações como condição de conservação, idioma e tipo. Confira todos os dados e a descrição do produto antes de concluir a compra.",
  },
  {
    question: "Quais são as condições das cartas?",
    answer:
      "A condição pode ser identificada por classificações como NM, SP, MP, HP ou D. A descrição do anúncio deve ser lida com atenção, pois pode conter observações específicas sobre a carta.",
  },
  {
    question: "Quais idiomas de cartas estão disponíveis?",
    answer:
      "As cartas poderão ser cadastradas em português, inglês ou japonês. O idioma disponível será informado nos dados do produto.",
  },
  {
    question: "Quais tipos de carta podem ser encontrados?",
    answer:
      "Conforme o cadastro do produto, a carta poderá ser identificada como normal, reverse, foil, full art, secreta, ultra rara ou promo.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "A JKCards aceita Pix e cartão de crédito. As opções efetivamente disponíveis e suas condições serão apresentadas na página de pagamento.",
  },
  {
    question: "Quando meu pedido começa a ser preparado?",
    answer:
      "A preparação começa depois da confirmação do pagamento. Antes disso, o pedido poderá permanecer aguardando pagamento ou aprovação.",
  },
  {
    question: "Como acompanho meus pedidos?",
    answer:
      'Entre na sua conta e acesse a opção "Meus pedidos". Nessa área você poderá visualizar os pedidos associados ao seu usuário e abrir os detalhes disponíveis.',
  },
  {
    question: "Posso alterar o endereço depois da compra?",
    answer:
      "Depois que o pedido for enviado, poderá não ser possível alterar o endereço. Caso identifique algum erro, entre em contato imediatamente e informe o número do pedido.",
  },
  {
    question: "Como funciona o direito de arrependimento?",
    answer:
      "Nas compras realizadas pela internet, o consumidor pode exercer o direito de arrependimento no prazo de sete dias corridos a partir do recebimento. Entre em contato antes de devolver o produto para receber as orientações.",
  },
  {
    question: "O que faço se receber um produto danificado?",
    answer:
      "Registre fotos da embalagem e do produto, mantenha os materiais de proteção e entre em contato com a JKCards. Informe o número do pedido e descreva o problema encontrado.",
  },
  {
    question: "Esqueci minha senha. Como recuperar?",
    answer:
      'Na página de login, selecione "Esqueci minha senha". Informe o e-mail cadastrado e siga as instruções enviadas para criar uma nova senha.',
  },
  {
    question: "Posso trocar minha senha estando conectado?",
    answer:
      'Sim. Acesse a página "Meu perfil" e utilize a opção de alteração de senha. Por segurança, o processo utiliza o e-mail cadastrado na conta.',
  },
  {
    question: "A JKCards possui loja física?",
    answer:
      "A JKCards está localizada em Sorocaba/SP. Antes de se deslocar até o endereço, consulte o atendimento para confirmar se existe disponibilidade de atendimento ou retirada presencial.",
  },
];

export function FaqPage() {
  return (
    <InstitutionalPage
      eyebrow="Central de ajuda"
      title="Dúvidas frequentes"
      description="Encontre respostas rápidas sobre cadastro, produtos, cartas, pagamentos, pedidos, entregas e atendimento."
    >
      <div className="space-y-3">
        {questions.map((item, index) => (
          <details
            key={item.question}
            className="group rounded-xl border border-line bg-white/5 open:border-skybrand/30 open:bg-skybrand/5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-white">
              <span className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-skybrand/10 text-xs font-black text-skysoft">
                  {index + 1}
                </span>

                {item.question}
              </span>

              <span className="text-xl text-skysoft transition group-open:rotate-45">
                +
              </span>
            </summary>

            <div className="border-t border-line/70 px-5 py-4">
              <p className="text-sm leading-7 text-slate-300">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      <div className="rounded-xl border border-skybrand/20 bg-skybrand/10 p-6">
        <div className="flex items-start gap-4">
          <HelpCircle
            size={24}
            className="mt-0.5 shrink-0 text-skysoft"
          />

          <div>
            <h2 className="text-lg font-bold text-white">
              Ainda ficou com alguma dúvida?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Entre em contato com a JKCards. Se a dúvida for
              sobre uma compra, informe também o número do
              pedido para facilitar o atendimento.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={storeConfig.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>

              <a
                href={`mailto:${storeConfig.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-skybrand/60"
              >
                <Mail size={17} />
                Enviar e-mail
              </a>

              <Link
                to="/contato"
                className="inline-flex items-center rounded-lg border border-line bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-skybrand/60"
              >
                Ver todos os contatos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </InstitutionalPage>
  );
}