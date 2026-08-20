import { ShieldCheck } from "lucide-react";
import {
  InstitutionalPage,
  InstitutionalSection,
} from "../../components/InstitutionalPage";
import { storeConfig } from "../../config/storeConfig";

export function ReturnsPolicyPage() {
  return (
    <InstitutionalPage
      eyebrow="Atendimento ao cliente"
      title="Trocas e devoluções"
      description="Saiba como solicitar o cancelamento, a troca ou a devolução de um produto adquirido na JKCards."
    >
      <InstitutionalSection title="Direito de arrependimento">
        <p>
          Nas compras realizadas pela internet, o cliente poderá
          exercer o direito de arrependimento no prazo de sete dias
          corridos, contado a partir do recebimento do produto,
          conforme a legislação brasileira.
        </p>

        <p>
          Dentro desse prazo, não é necessário apresentar uma
          justificativa para a desistência. Para iniciar o
          atendimento, o cliente deverá entrar em contato com a
          JKCards por um dos canais informados nesta página.
        </p>

        <p>
          Quando o direito de arrependimento for exercido
          corretamente, os valores pagos serão restituídos conforme
          a forma de pagamento utilizada e as regras da instituição
          responsável pelo processamento.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Como solicitar">
        <p>
          Antes de enviar qualquer produto, entre em contato com a
          JKCards e informe:
        </p>

        <ul className="list-disc space-y-2 pl-5 marker:text-cyan-600">
          <li>nome completo do comprador;</li>
          <li>número do pedido;</li>
          <li>produto relacionado à solicitação;</li>
          <li>
            motivo do contato, quando se tratar de defeito, avaria
            ou produto incorreto;
          </li>
          <li>
            fotos ou vídeos que ajudem na análise, quando
            aplicável.
          </li>
        </ul>

        <p>
          Após o contato, enviaremos as orientações necessárias
          para continuidade da solicitação. Produtos enviados sem
          atendimento prévio podem dificultar sua identificação e
          atrasar a análise.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Condições de devolução">
        <p>
          O produto deverá ser devolvido com os itens, acessórios e
          documentos que o acompanharam. Sempre que possível,
          utilize também a embalagem original para proteger o
          produto durante o transporte.
        </p>

        <p>
          O produto deverá ser embalado de maneira adequada para
          evitar danos no envio. Depois do recebimento, a JKCards
          poderá realizar uma análise para confirmar as condições
          do item e identificar eventuais sinais de dano causado
          por uso inadequado.
        </p>

        <p>
          A análise das condições do produto não limita o direito
          de arrependimento ou os demais direitos assegurados ao
          consumidor pela legislação.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Produto com avaria, defeito ou divergência">
        <p>
          Caso o pedido seja recebido com avaria aparente, defeito
          ou produto diferente do adquirido, entre em contato assim
          que identificar o problema.
        </p>

        <p>
          Recomendamos registrar fotos da embalagem antes da
          abertura e do produto recebido. Essas informações ajudam
          a tornar o atendimento e a análise mais rápidos.
        </p>

        <p>
          Confirmada a ocorrência, a solução poderá envolver troca,
          restituição do valor ou outra alternativa aceita pelo
          cliente, observadas a disponibilidade do produto e a
          legislação aplicável.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Cartas colecionáveis">
        <p>
          Para cartas anunciadas individualmente, serão
          consideradas as informações de idioma, tipo, edição e
          condição apresentadas na página do produto.
        </p>

        <p>
          Divergências relevantes entre o produto recebido e a
          descrição do anúncio devem ser comunicadas à JKCards para
          análise. Características normais do processo de impressão
          ou conservação serão avaliadas com base nas informações e
          imagens do anúncio.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Restituição do pagamento">
        <p>
          Após o recebimento e a identificação do produto
          devolvido, a restituição será solicitada de acordo com a
          forma de pagamento utilizada na compra.
        </p>

        <p>
          Em pagamentos processados por instituições financeiras
          ou plataformas externas, o prazo para o valor aparecer na
          conta ou fatura poderá depender da empresa responsável
          pelo pagamento.
        </p>

        <p>
          Quando aplicável, o cliente será informado sobre o
          andamento da solicitação pelos dados de contato
          cadastrados no pedido.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Problemas causados pelo transporte">
        <p>
          Se a embalagem apresentar sinais de violação ou dano
          relevante no momento da entrega, recomendamos registrar a
          situação com fotos e entrar em contato imediatamente.
        </p>

        <p>
          Não descarte a embalagem ou os materiais de proteção
          antes da conclusão da análise, pois eles podem ser
          necessários para a verificação junto à transportadora.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Canais de atendimento">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
          <p>
            Para solicitar atendimento, utilize um dos canais
            abaixo:
          </p>

          <p className="mt-3">
            E-mail:{" "}
            <a
              href={`mailto:${storeConfig.email}`}
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

      <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
          <ShieldCheck size={21} />
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Nenhuma condição desta página exclui ou reduz direitos
          assegurados pelo Código de Defesa do Consumidor e pelas
          demais normas brasileiras aplicáveis.
        </p>
      </div>
    </InstitutionalPage>
  );
}