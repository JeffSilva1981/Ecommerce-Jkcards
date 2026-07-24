import {
  InstitutionalPage,
  InstitutionalSection,
} from "../../components/InstitutionalPage";
import { storeConfig } from "../../config/storeConfig";

export function TermsOfUsePage() {
  return (
    <InstitutionalPage
      eyebrow="Regras da plataforma"
      title="Termos de uso"
      description="Conheça as condições gerais para navegar, criar uma conta e utilizar os serviços oferecidos pela JKCards."
    >
      <InstitutionalSection title="Aceitação dos termos">
        <p>
          Estes Termos de uso apresentam as condições gerais
          para acesso e utilização do site da JKCards.
        </p>

        <p>
          Ao navegar, criar uma conta ou realizar uma compra,
          o usuário declara estar ciente destes termos, da
          Política de privacidade, da Política de vendas e
          das demais condições disponibilizadas no site.
        </p>

        <p>
          Caso não concorde com alguma condição, o usuário
          deverá interromper a utilização da plataforma e
          entrar em contato para esclarecer suas dúvidas.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Uso da plataforma">
        <p>
          O site deve ser utilizado de maneira legítima,
          responsável e compatível com sua finalidade de
          apresentação e comercialização de produtos.
        </p>

        <p>Não é permitido utilizar a plataforma para:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>praticar atividades ilegais ou fraudulentas;</li>
          <li>
            tentar acessar contas, dados ou áreas restritas
            sem autorização;
          </li>
          <li>
            interferir no funcionamento, segurança ou
            disponibilidade do site;
          </li>
          <li>
            utilizar robôs ou mecanismos automatizados de
            forma abusiva;
          </li>
          <li>
            copiar, alterar ou distribuir conteúdos sem
            autorização;
          </li>
          <li>
            fornecer informações falsas para criar contas ou
            realizar pedidos.
          </li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection title="Cadastro e conta do usuário">
        <p>
          Para utilizar determinadas funcionalidades, o
          usuário poderá precisar criar uma conta e fornecer
          informações verdadeiras, completas e atualizadas.
        </p>

        <p>
          O usuário é responsável por proteger sua senha e
          por não compartilhar as credenciais de acesso com
          terceiros. Atividades realizadas por meio da conta
          poderão ser consideradas legítimas até que a
          JKCards seja informada sobre eventual acesso
          indevido.
        </p>

        <p>
          Caso identifique uso não autorizado, perda de
          acesso ou atividade suspeita, o usuário deverá
          alterar sua senha e comunicar a JKCards assim que
          possível.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Produtos e informações">
        <p>
          A JKCards busca manter as informações dos produtos
          corretas e atualizadas, incluindo descrições,
          imagens, preços e disponibilidade.
        </p>

        <p>
          Podem ocorrer diferenças de apresentação
          relacionadas à tela utilizada, iluminação,
          embalagem, lote ou características do fabricante.
          Para cartas colecionáveis, as informações
          específicas do anúncio devem ser verificadas antes
          da compra.
        </p>

        <p>
          Erros evidentes de digitação, cadastro ou
          funcionamento serão analisados de maneira
          transparente, respeitando a boa-fé e os direitos
          previstos na legislação.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Pedidos e pagamentos">
        <p>
          O envio de um pedido representa a intenção de
          adquirir os produtos selecionados. A confirmação
          dependerá da disponibilidade do estoque e da
          aprovação do pagamento.
        </p>

        <p>
          O processamento do pagamento poderá ser realizado
          por uma plataforma especializada, sujeita às suas
          verificações de segurança e regras operacionais.
        </p>

        <p>
          Pedidos com pagamento recusado, cancelado, não
          identificado ou não concluído poderão não ser
          processados.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Propriedade intelectual">
        <p>
          O nome JKCards, a identidade visual, os textos, a
          organização das páginas e os elementos próprios do
          site não podem ser reproduzidos ou utilizados
          comercialmente sem autorização.
        </p>

        <p>
          Marcas, personagens, imagens e nomes pertencentes a
          fabricantes, editoras ou outros titulares são
          utilizados para identificação dos produtos e
          permanecem sob os direitos de seus respectivos
          proprietários.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Links e serviços externos">
        <p>
          O site poderá oferecer links ou integrações com
          serviços externos, como plataformas de pagamento,
          redes sociais, transportadoras e aplicativos de
          mensagens.
        </p>

        <p>
          Esses serviços possuem termos e políticas
          próprios. A JKCards não controla integralmente sua
          disponibilidade, conteúdo ou forma de
          funcionamento.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Disponibilidade do site">
        <p>
          Trabalhamos para manter a plataforma disponível e
          segura, mas interrupções temporárias podem ocorrer
          por manutenção, atualização, falhas de
          infraestrutura, problemas de terceiros ou
          situações fora do controle da JKCards.
        </p>

        <p>
          Sempre que possível, as funcionalidades serão
          restabelecidas com segurança e no menor tempo
          razoável.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Suspensão de acesso">
        <p>
          O acesso a uma conta poderá ser temporariamente
          restringido quando houver indícios de fraude,
          ameaça à segurança, violação destes termos ou uso
          indevido da plataforma.
        </p>

        <p>
          A medida deverá ser aplicada de forma proporcional
          e não limitará os direitos do consumidor
          relacionados a pedidos já realizados.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Direitos do consumidor">
        <p>
          Nenhuma disposição destes termos exclui ou reduz
          direitos garantidos pelo Código de Defesa do
          Consumidor e pelas demais normas brasileiras
          aplicáveis.
        </p>

        <p>
          Em caso de conflito entre estes termos e uma norma
          obrigatória de proteção ao consumidor, será
          aplicada a condição prevista na legislação.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Alterações nos termos">
        <p>
          Estes termos poderão ser atualizados para refletir
          mudanças na plataforma, nos serviços ou na
          legislação. A versão mais recente permanecerá
          disponível nesta página.
        </p>

        <p>
          Última atualização: 22 de julho de 2026.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Contato">
        <p>
          Para esclarecer dúvidas sobre estes termos, entre
          em contato pelo e-mail:
        </p>

        <p>
          <a
            href={`mailto:${storeConfig.email}?subject=Termos%20de%20uso`}
            className="font-semibold text-skysoft hover:underline"
          >
            {storeConfig.email}
          </a>
        </p>
      </InstitutionalSection>
    </InstitutionalPage>
  );
}