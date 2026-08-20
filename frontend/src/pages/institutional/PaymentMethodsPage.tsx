import {
  CreditCard,
  QrCode,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import {
  InstitutionalPage,
  InstitutionalSection,
} from "../../components/InstitutionalPage";
import { storeConfig } from "../../config/storeConfig";

const paymentMethods = [
  {
    title: "Pix",
    description:
      "Pagamento eletrônico com processamento rápido, sujeito à confirmação da instituição financeira.",
    icon: QrCode,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Cartão de crédito",
    description:
      "Pagamento processado por uma plataforma especializada, conforme as condições apresentadas na compra.",
    icon: CreditCard,
    iconClassName: "bg-cyan-50 text-cyan-600",
  },
];

export function PaymentMethodsPage() {
  return (
    <InstitutionalPage
      eyebrow="Compra segura"
      title="Formas de pagamento"
      description="Conheça as formas de pagamento disponíveis e os cuidados adotados durante o processamento da sua compra."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {paymentMethods.map((method) => {
          const Icon = method.icon;

          return (
            <article
              key={method.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-md"
            >
              <span
                className={`grid size-12 place-items-center rounded-xl ${method.iconClassName}`}
              >
                <Icon size={24} />
              </span>

              <h2 className="mt-4 text-lg font-bold text-[#00102D]">
                {method.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {method.description}
              </p>
            </article>
          );
        })}
      </div>

      <InstitutionalSection title="Formas disponíveis">
        <p>
          A JKCards aceita Pix e cartão de crédito. As opções
          efetivamente disponíveis serão apresentadas na página de
          pagamento do pedido.
        </p>

        <p>
          Condições como valor mínimo, parcelamento, acréscimos ou
          disponibilidade de uma modalidade poderão depender das
          configurações apresentadas pela plataforma responsável
          pelo pagamento.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Processamento do pagamento">
        <p>
          Depois da conclusão do pedido, o cliente será direcionado
          para a etapa de pagamento. O pedido começará a ser
          preparado após a confirmação da transação.
        </p>

        <p>
          O tempo de confirmação poderá variar conforme a forma
          escolhida, a instituição financeira e as verificações de
          segurança realizadas pelo processador.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Pagamento por Pix">
        <p>
          Ao selecionar o Pix, utilize as instruções apresentadas
          na página de pagamento e confira os dados antes de
          confirmar a transação no aplicativo da sua instituição
          financeira.
        </p>

        <p>
          O pedido somente será considerado pago depois que a
          plataforma identificar e confirmar a transação. Não
          realize transferências para dados enviados por contatos
          desconhecidos.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Pagamento com cartão">
        <p>
          Ao pagar com cartão de crédito, o cliente deverá fornecer
          as informações solicitadas diretamente no ambiente de
          pagamento.
        </p>

        <p>
          A aprovação depende da instituição emissora, dos limites
          disponíveis e das verificações de segurança. Uma
          transação poderá ser recusada mesmo quando os dados
          informados estiverem corretos.
        </p>

        <p>
          Caso o pagamento seja recusado, recomendamos conferir os
          dados, verificar o limite disponível ou entrar em contato
          com a instituição emissora do cartão.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Segurança">
        <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h3 className="font-bold text-[#00102D]">
              Proteja seus dados
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              A JKCards não solicita senha bancária, código
              completo de segurança do cartão ou senha do
              aplicativo financeiro por e-mail, WhatsApp ou redes
              sociais.
            </p>
          </div>
        </div>
      </InstitutionalSection>

      <InstitutionalSection title="Cobrança no cartão">
        <p>
          A identificação exibida na fatura poderá seguir o nome
          definido pela plataforma responsável pelo pagamento.
        </p>

        <p>
          Se identificar uma cobrança desconhecida, entre em
          contato com a JKCards e com a instituição emissora do
          cartão para que a situação seja analisada.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Cancelamento e reembolso">
        <p>
          Quando um cancelamento ou reembolso for aprovado, a
          solicitação será encaminhada conforme a forma de
          pagamento utilizada.
        </p>

        <p>
          O prazo para o valor aparecer na conta ou na fatura
          poderá depender da instituição financeira, da
          administradora do cartão ou da plataforma de pagamento.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Dificuldade no pagamento">
        <div className="flex items-start gap-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-cyan-600 shadow-sm">
            <WalletCards size={22} />
          </div>

          <div>
            <p>
              Caso o pagamento não seja concluído ou o status do
              pedido não seja atualizado, não realize um novo
              pagamento antes de conferir sua conta ou falar com
              nosso atendimento.
            </p>

            <p className="mt-3">
              E-mail:{" "}
              <a
                href={`mailto:${storeConfig.email}?subject=Pagamento%20do%20pedido`}
                className="font-semibold text-cyan-700 hover:underline"
              >
                {storeConfig.email}
              </a>
            </p>

            <p className="mt-2">
              WhatsApp:{" "}
              <a
                href={storeConfig.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-cyan-700 hover:underline"
              >
                falar com a JKCards
              </a>
            </p>
          </div>
        </div>
      </InstitutionalSection>
    </InstitutionalPage>
  );
}