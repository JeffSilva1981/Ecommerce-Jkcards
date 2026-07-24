import {
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Youtube,
} from "lucide-react";
import {
  InstitutionalPage,
  InstitutionalSection,
} from "../../components/InstitutionalPage";
import { storeConfig } from "../../config/storeConfig";

const mapQuery = encodeURIComponent(
  `${storeConfig.address.street}, ${storeConfig.address.city}, ${storeConfig.address.state}`,
);

const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

export function ContactPage() {
  return (
    <InstitutionalPage
      eyebrow="Atendimento"
      title="Fale conosco"
      description="Escolha o canal mais conveniente para conversar com a JKCards."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href={storeConfig.social.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl border border-line bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-emerald-500/10"
        >
          <span className="grid size-12 place-items-center rounded-lg bg-emerald-500/10 text-emerald-300">
            <MessageCircle size={24} />
          </span>

          <h2 className="mt-4 text-lg font-bold text-white">
            WhatsApp
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Tire dúvidas sobre produtos, pedidos, pagamentos
            ou entregas diretamente com nosso atendimento.
          </p>

          <span className="mt-4 inline-block text-sm font-bold text-emerald-300">
            Iniciar conversa
          </span>
        </a>

        <a
          href={`mailto:${storeConfig.email}`}
          className="group rounded-xl border border-line bg-white/5 p-6 transition hover:-translate-y-1 hover:border-skybrand/50 hover:bg-skybrand/10"
        >
          <span className="grid size-12 place-items-center rounded-lg bg-skybrand/10 text-skysoft">
            <Mail size={24} />
          </span>

          <h2 className="mt-4 text-lg font-bold text-white">
            E-mail
          </h2>

          <p className="mt-2 break-all text-sm leading-6 text-slate-400">
            {storeConfig.email}
          </p>

          <span className="mt-4 inline-block text-sm font-bold text-skysoft">
            Enviar e-mail
          </span>
        </a>

        <a
          href={storeConfig.social.instagram}
          target="_blank"
          rel="noreferrer"
          className="group rounded-xl border border-line bg-white/5 p-6 transition hover:-translate-y-1 hover:border-pink-400/50 hover:bg-pink-500/10"
        >
          <span className="grid size-12 place-items-center rounded-lg bg-pink-500/10 text-pink-300">
            <Instagram size={24} />
          </span>

          <h2 className="mt-4 text-lg font-bold text-white">
            Instagram
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Acompanhe novidades e conteúdos da JKCards no
            Instagram.
          </p>

          <span className="mt-4 inline-block text-sm font-bold text-pink-300">
            @jkcardsstore
          </span>
        </a>

        {storeConfig.social.youtube ? (
          <a
            href={storeConfig.social.youtube}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-line bg-white/5 p-6 transition hover:-translate-y-1 hover:border-red-400/50 hover:bg-red-500/10"
          >
            <span className="grid size-12 place-items-center rounded-lg bg-red-500/10 text-red-300">
              <Youtube size={24} />
            </span>

            <h2 className="mt-4 text-lg font-bold text-white">
              YouTube
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Acompanhe vídeos e conteúdos da JKCards.
            </p>

            <span className="mt-4 inline-block text-sm font-bold text-red-300">
              Acessar canal
            </span>
          </a>
        ) : (
          <div className="rounded-xl border border-line bg-white/[0.03] p-6">
            <span className="grid size-12 place-items-center rounded-lg bg-white/5 text-slate-500">
              <Youtube size={24} />
            </span>

            <h2 className="mt-4 text-lg font-bold text-slate-300">
              YouTube
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Estamos preparando nosso canal no YouTube.
            </p>

            <span className="mt-4 inline-block text-sm font-bold text-slate-500">
              Em breve
            </span>
          </div>
        )}
      </div>

      <InstitutionalSection title="Para agilizar o atendimento">
        <p>
          Se o contato estiver relacionado a uma compra,
          informe o número do pedido e o e-mail utilizado no
          cadastro.
        </p>

        <p>
          Em casos de avaria, produto incorreto ou
          divergência, envie também fotos que mostrem a
          embalagem e o produto recebido.
        </p>

        <p>
          Nunca envie sua senha, senha bancária ou dados
          completos do cartão pelos canais de atendimento.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Localização">
        <div className="flex flex-col gap-5 rounded-xl border border-line bg-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <MapPin
              size={24}
              className="mt-0.5 shrink-0 text-skysoft"
            />

            <div>
              <h3 className="font-bold text-white">
                JKCards
              </h3>

              <address className="mt-2 text-sm not-italic leading-6 text-slate-300">
                {storeConfig.address.street}
                <br />
                {storeConfig.address.city}/
                {storeConfig.address.shortState}
              </address>
            </div>
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-line bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-skybrand/60 hover:text-skysoft"
          >
            Abrir no mapa
          </a>
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Antes de se deslocar até o endereço, consulte o
          atendimento para confirmar a disponibilidade de
          atendimento ou retirada presencial.
        </p>
      </InstitutionalSection>

      <div className="rounded-xl border border-gold/20 bg-gold/10 p-5 text-sm leading-6 text-slate-300">
        Esta página não possui um formulário de envio porque
        isso exigiria processamento no backend. Os botões
        acima abrem canais externos que já estão disponíveis
        e funcionando.
      </div>
    </InstitutionalPage>
  );
}