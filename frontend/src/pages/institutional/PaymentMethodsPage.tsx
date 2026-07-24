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
  },
  {
    title: "Cartão de crédito",
    description:
      "Pagamento processado por uma plataforma especializada, conforme as condições apresentadas na compra.",
    icon: CreditCard,
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
              className="rounded-xl border border-line bg-white/5 p-6"
            >
              <span className="grid size-12 place-items-center rounded-lg bg-skybrand/10 text-skysoft">
                <Icon size={24} />
              </span>

              <h2 className="mt-4 text-lg font-bold text-white">
                {method.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {method.description}
              </p>
            </article>
          );
        })}
      </div>

      <InstitutionalSection title="Formas disponíveis">
        <p>
          A JKCards aceita Pix e cartão de crédito. As opções
          efetivamente disponíveis serão apresentadas na
          página de pagamento do pedido.
        </p>

        <p>
          Condições como valor mínimo, parcelamento,
          acréscimos ou disponibilidade de uma modalidade
          poderão depender das configurações apresentadas
          pela plataforma responsável pelo pagamento.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Processamento do pagamento">
        <p>
          Depois da conclusão do pedido, o cliente será
          direcionado para a etapa de pagamento. O pedido
          começará a ser preparado após a confirmação da
          transação.
        </p>

        <p>
          O tempo de confirmação poderá variar conforme a
          forma escolhida, a instituição financeira e as
          verificações de segurança realizadas pelo
          processador.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Pagamento por Pix">
        <p>
          Ao selecionar o Pix, utilize as instruções
          apresentadas na página de pagamento e confira os
          dados antes de confirmar a transação no aplicativo
          da sua instituição financeira.
        </p>

        <p>
          O pedido somente será considerado pago depois que
          a plataforma identificar e confirmar a transação.
          Não realize transferências para dados enviados por
          contatos desconhecidos.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Pagamento com cartão">
        <p>
          Ao pagar com cartão de crédito, o cliente deverá
          fornecer as informações solicitadas diretamente no
          ambiente de pagamento.
        </p>

        <p>
          A aprovação depende da instituição emissora, dos
          limites disponíveis e das verificações de
          segurança. Uma transação poderá ser recusada mesmo
          quando os dados informados estiverem corretos.
        </p>

        <p>
          Caso o pagamento seja recusado, recomendamos
          conferir os dados, verificar o limite disponível ou
          entrar em contato com a instituição emissora do
          cartão.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Segurança">
        <div className="flex items-start gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
          <ShieldCheck
            size={24}
            className="mt-0.5 shrink-0 text-emerald-300"
          />

          <div>
            <h3 className="font-bold text-white">
              Proteja seus dados
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              A JKCards não solicita senha bancária, código
              completo de segurança do cartão ou senha do
              aplicativo financeiro por e-mail, WhatsApp ou
              redes sociais.
            </p>
          </div>
        </div>
      </InstitutionalSection>

      <InstitutionalSection title="Cobrança no cartão">
        <p>
          A identificação exibida na fatura poderá seguir o
          nome definido pela plataforma responsável pelo
          pagamento.
        </p>

        <p>
          Se identificar uma cobrança desconhecida, entre em
          contato com a JKCards e com a instituição emissora
          do cartão para que a situação seja analisada.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Cancelamento e reembolso">
        <p>
          Quando um cancelamento ou reembolso for aprovado,
          a solicitação será encaminhada conforme a forma de
          pagamento utilizada.
        </p>

        <p>
          O prazo para o valor aparecer na conta ou na fatura
          poderá depender da instituição financeira, da
          administradora do cartão ou da plataforma de
          pagamento.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Dificuldade no pagamento">
        <div className="flex items-start gap-4">
          <WalletCards
            size={22}
            className="mt-0.5 shrink-0 text-skysoft"
          />

          <div>
            <p>
              Caso o pagamento não seja concluído ou o status
              do pedido não seja atualizado, não realize um
              novo pagamento antes de conferir sua conta ou
              falar com nosso atendimento.
            </p>

            <p className="mt-3">
              E-mail:{" "}
              <a
                href={`mailto:${storeConfig.email}?subject=Pagamento%20do%20pedido`}
                className="font-semibold text-skysoft hover:underline"
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
                className="font-semibold text-skysoft hover:underline"
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