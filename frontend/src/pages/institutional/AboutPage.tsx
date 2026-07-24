import {
  HeartHandshake,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import {
  InstitutionalPage,
  InstitutionalSection,
} from "../../components/InstitutionalPage";
import { storeConfig } from "../../config/storeConfig";

const values = [
  {
    title: "Confiança",
    description:
      "Informações claras e um relacionamento transparente em todas as etapas da compra.",
    icon: ShieldCheck,
  },
  {
    title: "Cuidado",
    description:
      "Atenção com os produtos, a preparação dos pedidos e a experiência de cada cliente.",
    icon: PackageCheck,
  },
  {
    title: "Proximidade",
    description:
      "Atendimento acessível para jogadores, colecionadores e pessoas que estão começando.",
    icon: HeartHandshake,
  },
];

export function AboutPage() {
  return (
    <InstitutionalPage
      eyebrow="Nossa história"
      title="Sobre a JKCards"
      description="Conheça a história, os valores e o propósito que fazem parte da nossa loja."
    >
      <InstitutionalSection title="Nossa história">
        <p>
          A JKCards nasceu em {storeConfig.startedIn}, em{" "}
          {storeConfig.address.city},{" "}
          {storeConfig.address.state}, a partir da paixão
          pelo universo Pokémon e pelo colecionismo. Desde o
          início, nosso objetivo tem sido oferecer uma
          experiência de compra segura, transparente e
          próxima de cada cliente.
        </p>

        <p>
          Mais do que comercializar cartas e produtos
          colecionáveis, queremos participar das histórias
          construídas por jogadores e colecionadores: a
          primeira coleção, a carta tão procurada, a
          preparação de um novo deck ou aquele item especial
          que completa uma lembrança.
        </p>
      </InstitutionalSection>

      <div className="grid gap-4 md:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <article
              key={value.title}
              className="rounded-xl border border-line bg-white/5 p-5"
            >
              <span className="grid size-11 place-items-center rounded-lg bg-skybrand/10 text-skysoft">
                <Icon size={22} />
              </span>

              <h2 className="mt-4 font-bold text-white">
                {value.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {value.description}
              </p>
            </article>
          );
        })}
      </div>

      <InstitutionalSection title="Nossos valores">
        <p>
          Nossos valores estão baseados na confiança, no
          respeito e no cuidado em cada etapa. Trabalhamos
          para apresentar os produtos com informações
          claras, condições bem descritas e atendimento
          responsável, valorizando tanto quem está começando
          quanto quem já coleciona há muitos anos.
        </p>

        <p>
          Acreditamos que uma boa experiência não termina
          quando o pedido é realizado. Por isso, buscamos
          manter uma comunicação acessível, preparar cada
          envio com atenção e construir uma relação
          duradoura com nossa comunidade.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Seguimos evoluindo">
        <p>
          Seguimos evoluindo para tornar a JKCards uma loja
          cada vez mais completa, organizada e confiável,
          sem perder a proximidade que faz parte da nossa
          história.
        </p>

        <p>
          Seja para jogar, colecionar ou encontrar aquela
          carta especial, seja bem-vindo à JKCards.
        </p>
      </InstitutionalSection>

      <div className="flex items-start gap-4 rounded-xl border border-skybrand/20 bg-skybrand/10 p-5">
        <MapPin
          size={22}
          className="mt-0.5 shrink-0 text-skysoft"
        />

        <div>
          <h2 className="font-bold text-white">
            Onde estamos
          </h2>

          <address className="mt-1 text-sm not-italic leading-6 text-slate-300">
            {storeConfig.address.street}
            <br />
            {storeConfig.address.city}/
            {storeConfig.address.shortState}
          </address>
        </div>
      </div>
    </InstitutionalPage>
  );
}