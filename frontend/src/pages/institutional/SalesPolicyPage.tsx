import { FileText } from "lucide-react";
import {
  InstitutionalPage,
  InstitutionalSection,
} from "../../components/InstitutionalPage";
import { storeConfig } from "../../config/storeConfig";

export function SalesPolicyPage() {
  return (
    <InstitutionalPage
      eyebrow="Transparência"
      title="Política de vendas"
      description="Conheça as principais condições aplicáveis às compras realizadas na loja virtual da JKCards."
    >
      <InstitutionalSection title="Informações dos produtos">
        <p>
          A JKCards busca apresentar informações claras sobre os
          produtos disponíveis, incluindo nome, descrição, imagens,
          preço, quantidade em estoque e demais características
          relevantes para a decisão de compra.
        </p>

        <p>
          As imagens são utilizadas para representar os produtos.
          Dependendo da iluminação, da tela utilizada e das
          características do fabricante, pequenas diferenças de
          cor ou apresentação podem ocorrer.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Cartas colecionáveis">
        <p>
          Quando aplicável, as cartas colecionáveis são anunciadas
          com informações sobre idioma, tipo, edição e condição de
          conservação. Recomendamos que o cliente confira
          atentamente essas informações antes de concluir a compra.
        </p>

        <p>
          Por se tratarem de itens colecionáveis, pequenas
          características de impressão, centralização, acabamento
          ou conservação podem influenciar a avaliação individual
          do produto. A descrição do anúncio deve ser considerada
          em conjunto com as imagens apresentadas.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Preços e disponibilidade">
        <p>
          Os preços apresentados no site são informados em reais e
          podem ser alterados sem aviso prévio. A alteração não
          afeta pedidos que já tenham sido confirmados e pagos.
        </p>

        <p>
          A inclusão de um produto no carrinho não garante sua
          reserva. A disponibilidade será considerada no momento
          da conclusão do pedido, conforme o estoque registrado no
          sistema.
        </p>

        <p>
          Caso ocorra uma inconsistência de estoque após a compra,
          entraremos em contato para apresentar as opções
          disponíveis, incluindo a substituição do produto,
          crédito na loja quando aceito pelo cliente ou
          cancelamento com restituição do valor pago.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Conclusão do pedido">
        <p>
          Antes de finalizar a compra, o cliente deve conferir os
          produtos, quantidades, valores, endereço de entrega e
          informações de contato.
        </p>

        <p>
          O pedido será considerado confirmado após a aprovação do
          pagamento. Pagamentos não aprovados, recusados ou não
          concluídos poderão impedir o processamento do pedido.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Pagamento">
        <p>
          As formas de pagamento disponíveis serão apresentadas
          durante a finalização da compra. A aprovação poderá
          depender da instituição financeira ou da plataforma
          responsável pelo processamento do pagamento.
        </p>

        <p>
          A JKCards não solicita senhas bancárias ou senhas
          completas de cartões por e-mail, WhatsApp ou outros
          canais de atendimento.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Entrega">
        <p>
          O prazo e as condições de entrega dependem do endereço
          informado, da modalidade de envio escolhida e da
          transportadora responsável.
        </p>

        <p>
          É responsabilidade do cliente fornecer um endereço
          completo e correto, além de acompanhar as atualizações
          relacionadas ao envio do pedido. Informações incorretas
          podem causar atraso, devolução ou necessidade de um novo
          pagamento de frete.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Cancelamentos, trocas e devoluções">
        <p>
          Solicitações de cancelamento, troca ou devolução serão
          analisadas conforme a legislação aplicável e as condições
          apresentadas na página de Trocas e devoluções.
        </p>

        <p>
          O cliente deve entrar em contato antes de devolver
          qualquer produto, para receber as orientações necessárias
          e evitar problemas no atendimento da solicitação.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Atendimento">
        <p>
          Em caso de dúvida sobre um produto ou pedido, entre em
          contato antes de concluir a compra. Nossa equipe está
          disponível pelos canais informados no site.
        </p>

        <p>
          E-mail:{" "}
          <a
            href={`mailto:${storeConfig.email}`}
            className="font-semibold text-cyan-700 hover:underline"
          >
            {storeConfig.email}
          </a>
        </p>

        <p>
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
      </InstitutionalSection>

      <InstitutionalSection title="Legislação aplicável">
        <p>
          Esta política deve ser interpretada em conjunto com o
          Código de Defesa do Consumidor e as normas brasileiras
          aplicáveis ao comércio eletrônico. Nenhuma condição
          apresentada nesta página limita direitos garantidos pela
          legislação.
        </p>
      </InstitutionalSection>

      <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-amber-600 shadow-sm">
          <FileText size={21} />
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Esta política poderá ser atualizada para refletir
          melhorias na operação da loja ou alterações legais. A
          versão disponível no site será aplicada às compras
          realizadas após sua publicação.
        </p>
      </div>
    </InstitutionalPage>
  );
}