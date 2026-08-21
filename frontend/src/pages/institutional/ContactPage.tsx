import {
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
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
        <ContactCard
          href={storeConfig.social.whatsapp}
          icon={<MessageCircle size={24} />}
          iconClassName="bg-emerald-50 text-emerald-600"
          hoverClassName="hover:border-emerald-300"
          title="WhatsApp"
          description="Tire dúvidas sobre produtos, pedidos, pagamentos ou entregas diretamente com nosso atendimento."
          action="Iniciar conversa"
          actionClassName="text-emerald-600"
          external
        />

        <ContactCard
          href={`mailto:${storeConfig.email}`}
          icon={<Mail size={24} />}
          iconClassName="bg-cyan-50 text-cyan-600"
          hoverClassName="hover:border-cyan-300"
          title="E-mail"
          description={storeConfig.email}
          action="Enviar e-mail"
          actionClassName="text-cyan-600"
        />

        <ContactCard
          href={storeConfig.social.instagram}
          icon={<Instagram size={24} />}
          iconClassName="bg-pink-50 text-pink-600"
          hoverClassName="hover:border-pink-300"
          title="Instagram"
          description="Acompanhe novidades, produtos e conteúdos da JKCards no Instagram."
          action="@jkcardsstore"
          actionClassName="text-pink-600"
          external
        />

        {storeConfig.social.youtube ? (
          <ContactCard
            href={storeConfig.social.youtube}
            icon={<Youtube size={24} />}
            iconClassName="bg-red-50 text-red-600"
            hoverClassName="hover:border-red-300"
            title="YouTube"
            description="Acompanhe vídeos e conteúdos da JKCards."
            action="Acessar canal"
            actionClassName="text-red-600"
            external
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <span className="grid size-12 place-items-center rounded-xl bg-slate-200 text-slate-500">
              <Youtube size={24} />
            </span>

            <h2 className="mt-4 text-lg font-bold text-[#00102D]">
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
        <div className="grid gap-3">
          <GuidanceItem>
            Se o contato estiver relacionado a uma compra, informe
            o número do pedido e o e-mail utilizado no cadastro.
          </GuidanceItem>

          <GuidanceItem>
            Em casos de avaria, produto incorreto ou divergência,
            envie também fotos que mostrem a embalagem e o produto
            recebido.
          </GuidanceItem>

          <GuidanceItem>
            Nunca envie sua senha, senha bancária ou dados completos
            do cartão pelos canais de atendimento.
          </GuidanceItem>
        </div>
      </InstitutionalSection>

      <InstitutionalSection title="Localização">
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
              <MapPin size={23} />
            </div>

            <div>
              <h3 className="font-bold text-[#00102D]">
                JKCards
              </h3>

              <address className="mt-2 text-sm not-italic leading-6 text-slate-600">
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
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#00102D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#06234A]"
          >
            Abrir no mapa
          </a>
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Antes de se deslocar até o endereço, consulte nosso
          atendimento para confirmar a disponibilidade de
          atendimento ou retirada presencial.
        </p>
      </InstitutionalSection>

      <div className="flex items-start gap-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-cyan-600 shadow-sm">
          <ShieldCheck size={21} />
        </div>

        <div>
          <h2 className="font-bold text-[#00102D]">
            Atendimento seguro
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Utilize somente os canais oficiais informados nesta
            página e nunca compartilhe senhas ou dados completos de
            pagamento.
          </p>
        </div>
      </div>
    </InstitutionalPage>
  );
}

type ContactCardProps = {
  href: string;
  icon: React.ReactNode;
  iconClassName: string;
  hoverClassName: string;
  title: string;
  description: string;
  action: string;
  actionClassName: string;
  external?: boolean;
};

function ContactCard({
  href,
  icon,
  iconClassName,
  hoverClassName,
  title,
  description,
  action,
  actionClassName,
  external = false,
}: ContactCardProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md ${hoverClassName}`}
    >
      <span
        className={`grid size-12 place-items-center rounded-xl ${iconClassName}`}
      >
        {icon}
      </span>

      <h2 className="mt-4 text-lg font-bold text-[#00102D]">
        {title}
      </h2>

      <p className="mt-2 break-words text-sm leading-6 text-slate-600">
        {description}
      </p>

      <span
        className={`mt-4 inline-block text-sm font-bold ${actionClassName}`}
      >
        {action}
      </span>
    </a>
  );
}

type GuidanceItemProps = {
  children: React.ReactNode;
};

function GuidanceItem({ children }: GuidanceItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <ShieldCheck
        size={19}
        className="mt-0.5 shrink-0 text-cyan-600"
      />

      <p className="text-sm leading-6 text-slate-600">
        {children}
      </p>
    </div>
  );
}