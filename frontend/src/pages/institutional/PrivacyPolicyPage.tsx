import {
  InstitutionalPage,
  InstitutionalSection,
} from "../../components/InstitutionalPage";
import { storeConfig } from "../../config/storeConfig";

export function PrivacyPolicyPage() {
  return (
    <InstitutionalPage
      eyebrow="Privacidade e segurança"
      title="Política de privacidade"
      description="Entenda como a JKCards utiliza e protege os dados pessoais necessários para oferecer seus serviços."
    >
      <InstitutionalSection title="Sobre esta política">
        <p>
          A JKCards respeita a privacidade de seus clientes e
          busca tratar dados pessoais de maneira transparente,
          segura e compatível com a Lei Geral de Proteção de
          Dados Pessoais, a LGPD.
        </p>

        <p>
          Esta política explica quais informações podem ser
          utilizadas durante a navegação e a compra, por que
          elas são necessárias, quando podem ser
          compartilhadas e quais direitos podem ser
          exercidos pelo titular.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Dados que podem ser tratados">
        <p>
          Conforme a interação realizada no site, podemos
          tratar as seguintes categorias de dados:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>
            dados cadastrais, como nome, e-mail, telefone e
            data de nascimento;
          </li>

          <li>
            dados necessários para entrega, como endereço,
            cidade, estado e CEP;
          </li>

          <li>
            informações dos pedidos, incluindo produtos,
            quantidades, valores e histórico de compras;
          </li>

          <li>
            informações relacionadas ao pagamento e ao
            status da transação;
          </li>

          <li>
            mensagens e informações fornecidas durante o
            atendimento;
          </li>

          <li>
            dados técnicos necessários para segurança,
            funcionamento e diagnóstico da plataforma.
          </li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection title="Dados de pagamento">
        <p>
          Os pagamentos podem ser processados por
          plataformas especializadas. A JKCards não precisa
          armazenar a senha bancária ou os dados completos
          do cartão utilizado pelo cliente.
        </p>

        <p>
          A instituição responsável pelo pagamento poderá
          tratar os dados necessários para autorizar,
          recusar, cancelar ou analisar uma transação,
          conforme suas próprias políticas e obrigações
          legais.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Como os dados podem ser utilizados">
        <p>
          Os dados pessoais podem ser utilizados para:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>criar e manter a conta do cliente;</li>
          <li>identificar e autenticar o usuário;</li>
          <li>processar e acompanhar pedidos;</li>
          <li>processar pagamentos e reembolsos;</li>
          <li>preparar e realizar entregas;</li>
          <li>
            enviar comunicações relacionadas à compra;
          </li>
          <li>
            atender dúvidas, solicitações e reclamações;
          </li>
          <li>
            permitir a recuperação segura da senha;
          </li>
          <li>
            prevenir fraudes e proteger a plataforma;
          </li>
          <li>
            cumprir obrigações legais e regulatórias;
          </li>
          <li>
            exercer direitos em processos administrativos
            ou judiciais.
          </li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection title="Compartilhamento de dados">
        <p>
          A JKCards poderá compartilhar somente os dados
          necessários com empresas que participam da
          operação da loja, como:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>plataformas de processamento de pagamentos;</li>
          <li>transportadoras e serviços de entrega;</li>
          <li>
            provedores de hospedagem, infraestrutura e
            armazenamento;
          </li>
          <li>
            serviços utilizados para envio de e-mails
            transacionais;
          </li>
          <li>
            prestadores que auxiliem na segurança e no
            funcionamento da plataforma;
          </li>
          <li>
            autoridades públicas, quando houver obrigação
            legal ou determinação válida.
          </li>
        </ul>

        <p>
          Os dados não são comercializados pela JKCards.
          Quando houver compartilhamento, ele deverá estar
          relacionado a uma finalidade legítima e à execução
          dos serviços oferecidos.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Armazenamento no navegador">
        <p>
          O site pode utilizar recursos do navegador, como
          armazenamento local, para manter funcionalidades
          necessárias, incluindo sessão do usuário, carrinho
          de compras e preferências da plataforma.
        </p>

        <p>
          Esses recursos ajudam o site a funcionar
          corretamente. O usuário pode limpar os dados
          armazenados utilizando as configurações do próprio
          navegador, mas isso poderá encerrar a sessão,
          remover preferências ou esvaziar informações
          mantidas localmente.
        </p>

        <p>
          Caso ferramentas opcionais de análise, publicidade
          ou rastreamento sejam adicionadas futuramente, esta
          política e os controles de privacidade deverão ser
          atualizados antes de sua utilização.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Prazo de armazenamento">
        <p>
          Os dados serão mantidos pelo tempo necessário para
          cumprir as finalidades descritas nesta política,
          atender obrigações legais, manter registros de
          transações, prevenir fraudes e exercer direitos.
        </p>

        <p>
          Depois que o armazenamento deixar de ser
          necessário, os dados poderão ser eliminados,
          anonimizados ou conservados quando houver uma base
          legal que autorize sua manutenção.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Segurança">
        <p>
          A JKCards adota medidas técnicas e organizacionais
          destinadas a proteger os dados pessoais contra
          acesso não autorizado, perda, alteração, divulgação
          ou destruição indevida.
        </p>

        <p>
          Nenhum sistema conectado à internet é totalmente
          isento de riscos. Por isso, também recomendamos que
          o cliente utilize uma senha forte, não compartilhe
          suas credenciais e encerre a sessão em dispositivos
          compartilhados.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Direitos do titular">
        <p>
          Conforme as condições previstas na LGPD, o titular
          poderá solicitar:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>confirmação da existência de tratamento;</li>
          <li>acesso aos seus dados pessoais;</li>
          <li>
            correção de dados incompletos, inexatos ou
            desatualizados;
          </li>
          <li>
            informações sobre o compartilhamento de dados;
          </li>
          <li>
            anonimização, bloqueio ou eliminação de dados
            desnecessários ou tratados irregularmente;
          </li>
          <li>
            eliminação de dados tratados com consentimento,
            quando legalmente aplicável;
          </li>
          <li>revogação do consentimento;</li>
          <li>
            oposição ao tratamento, nas hipóteses previstas
            em lei;
          </li>
          <li>
            demais direitos garantidos pela legislação.
          </li>
        </ul>

        <p>
          Algumas solicitações poderão exigir a confirmação
          da identidade do titular para impedir o acesso
          indevido aos dados de outra pessoa.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Contato sobre privacidade">
        <p>
          Para esclarecer dúvidas ou exercer direitos
          relacionados aos dados pessoais, entre em contato
          pelo e-mail:
        </p>

        <p>
          <a
            href={`mailto:${storeConfig.email}?subject=Privacidade%20e%20dados%20pessoais`}
            className="font-semibold text-skysoft hover:underline"
          >
            {storeConfig.email}
          </a>
        </p>

        <p>
          Na mensagem, descreva sua solicitação de forma
          clara. Poderemos pedir informações adicionais para
          confirmar sua identidade e localizar os dados
          relacionados ao pedido.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Atualizações desta política">
        <p>
          Esta política poderá ser atualizada para refletir
          mudanças na plataforma, nos serviços utilizados ou
          na legislação aplicável. A versão mais recente
          permanecerá disponível nesta página.
        </p>

        <p>
          Última atualização: 22 de julho de 2026.
        </p>
      </InstitutionalSection>

      <div className="rounded-xl border border-skybrand/20 bg-skybrand/10 p-5 text-sm leading-6 text-slate-300">
        A exclusão da conta e de determinados registros pode
        exigir uma funcionalidade adicional no backend.
        Enquanto essa opção não estiver disponível
        diretamente no perfil, a solicitação poderá ser
        realizada pelo canal de contato informado acima.
      </div>
    </InstitutionalPage>
  );
}