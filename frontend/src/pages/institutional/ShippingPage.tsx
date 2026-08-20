import {
  Clock3,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";
import {
  InstitutionalPage,
  InstitutionalSection,
} from "../../components/InstitutionalPage";
import { storeConfig } from "../../config/storeConfig";

const shippingSteps = [
  {
    title: "Pedido confirmado",
    description:
      "A preparação começa depois da confirmação do pagamento.",
    icon: PackageCheck,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Pedido preparado",
    description:
      "Os produtos são conferidos e embalados para o transporte.",
    icon: Clock3,
    iconClassName: "bg-amber-50 text-amber-600",
  },
  {
    title: "Pedido enviado",
    description:
      "A entrega passa a ser responsabilidade da transportadora selecionada.",
    icon: Truck,
    iconClassName: "bg-cyan-50 text-cyan-600",
  },
];

export function ShippingPage() {
  return (
    <InstitutionalPage
      eyebrow="Seu pedido"
      title="Envios e entregas"
      description="Entenda como funcionam a preparação, o envio e o acompanhamento dos pedidos realizados na JKCards."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {shippingSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article
              key={step.title}
              className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-md"
            >
              <span className="absolute right-4 top-4 text-xs font-black text-slate-300">
                0{index + 1}
              </span>

              <span
                className={`grid size-11 place-items-center rounded-xl ${step.iconClassName}`}
              >
                <Icon size={22} />
              </span>

              <h2 className="mt-4 font-bold text-[#00102D]">
                {step.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </article>
          );
        })}
      </div>

      <InstitutionalSection title="Regiões atendidas">
        <p>
          A JKCards realiza envios para endereços atendidos pelas
          modalidades de transporte disponibilizadas durante a
          compra.
        </p>

        <p>
          A disponibilidade, o valor do frete e o prazo estimado
          poderão variar conforme o CEP, o peso, as dimensões do
          pedido e a transportadora responsável.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Prazo de preparação">
        <p>
          A preparação do pedido começa após a confirmação do
          pagamento. Durante essa etapa, os produtos são
          separados, conferidos e embalados.
        </p>

        <p>
          O prazo de preparação não deve ser confundido com o prazo
          de transporte. A previsão total de entrega considera
          tanto a preparação quanto o período informado pela
          transportadora.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Cálculo do frete">
        <p>
          Quando disponível, o valor e as modalidades de envio
          serão apresentados durante a finalização da compra, com
          base no endereço informado pelo cliente.
        </p>

        <p>
          Antes de concluir o pedido, confira o endereço, a
          modalidade selecionada, o valor e a estimativa de
          entrega.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Endereço de entrega">
        <p>
          O cliente é responsável por informar um endereço
          completo, correto e acessível para entrega, incluindo
          número, complemento e referências quando necessárias.
        </p>

        <p>
          Depois que o pedido for enviado, poderá não ser possível
          alterar o endereço. Se identificar algum erro, entre em
          contato imediatamente.
        </p>

        <p>
          Caso o pedido seja devolvido por endereço incorreto,
          ausência de destinatário, recusa injustificada ou outra
          situação não causada pela JKCards, um novo envio poderá
          depender do pagamento de outro frete.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Acompanhamento">
        <p>
          Quando a modalidade de transporte oferecer rastreamento,
          as informações disponíveis serão utilizadas para
          acompanhar o envio.
        </p>

        <p>
          As atualizações são realizadas pela transportadora e
          podem levar algum tempo para aparecer depois da postagem.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Tentativas de entrega">
        <p>
          A quantidade de tentativas e os procedimentos em caso de
          ausência dependem das regras da transportadora
          responsável.
        </p>

        <p>
          Recomendamos acompanhar o envio e garantir que haja uma
          pessoa autorizada para receber o pedido no endereço
          informado.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Atrasos">
        <p>
          A previsão de entrega é uma estimativa. Situações como
          períodos de alta demanda, condições climáticas,
          restrições de transporte, fiscalizações ou eventos fora
          do controle da loja podem causar alterações.
        </p>

        <p>
          Caso a entrega ultrapasse significativamente a estimativa
          apresentada, entre em contato para que possamos verificar
          a situação.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Embalagem e proteção">
        <p>
          Os pedidos são preparados buscando proteger os produtos
          durante o transporte. Cartas e itens colecionáveis
          recebem atenção especial de acordo com suas
          características.
        </p>

        <p>
          Ao receber o pedido, verifique as condições da embalagem
          antes de descartar os materiais de proteção.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Avaria ou violação">
        <p>
          Se a embalagem estiver danificada, violada ou apresentar
          sinais relevantes de impacto, registre fotos antes da
          abertura.
        </p>

        <p>
          Caso o produto também esteja danificado, mantenha a
          embalagem e entre em contato com a JKCards para receber
          as orientações de atendimento.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Atendimento">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
          <p>
            Para dúvidas relacionadas ao envio, informe o número
            do pedido ao entrar em contato.
          </p>

          <p className="mt-3">
            E-mail:{" "}
            <a
              href={`mailto:${storeConfig.email}?subject=Envio%20do%20pedido`}
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
      </InstitutionalSection>

      <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
          <MapPin size={22} />
        </div>

        <div>
          <h2 className="font-bold text-[#00102D]">
            Localização da JKCards
          </h2>

          <address className="mt-1 text-sm not-italic leading-6 text-slate-600">
            {storeConfig.address.street}
            <br />
            {storeConfig.address.city}/
            {storeConfig.address.shortState}
          </address>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            O endereço informado não representa confirmação de
            retirada presencial. Consulte o atendimento antes de
            se deslocar até o local.
          </p>
        </div>
      </div>
    </InstitutionalPage>
  );
}