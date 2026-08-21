import { useRef } from "react";
import type { MouseEvent } from "react";
import energyBackground from "../assets/jkcards-home-energy-background.png";
import heroCharizard from "../assets/hero-charizard.jpg";
import heroDarkrai from "../assets/hero-darkrai.jpg";
import heroGreninja from "../assets/hero-greninja.jpg";
import logo from "../assets/jkcards-logo-header.png";

export function HomeHero() {
  const backgroundRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const darkraiRef = useRef<HTMLDivElement>(null);
  const charizardRef = useRef<HTMLDivElement>(null);
  const greninjaRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

    if (backgroundRef.current) {
      backgroundRef.current.style.transform = `scale(1.035) translate(${pointerX * -8}px, ${pointerY * -5}px)`;
    }

    if (logoRef.current) {
      logoRef.current.style.transform = `translate(-50%, -50%) translate(${pointerX * 12}px, ${pointerY * 8}px) rotateX(${pointerY * -5}deg) rotateY(${pointerX * 7}deg)`;
    }

    if (darkraiRef.current) {
      darkraiRef.current.style.transform = `translate(-50%, -50%) translate(${pointerX * 18}px, ${pointerY * 10}px) rotate(-10deg) rotateX(${pointerY * -7}deg) rotateY(${pointerX * 9}deg)`;
    }

    if (charizardRef.current) {
      charizardRef.current.style.transform = `translate(-50%, -50%) translate(${pointerX * 24}px, ${pointerY * 14}px) rotateX(${pointerY * -8}deg) rotateY(${pointerX * 10}deg)`;
    }

    if (greninjaRef.current) {
      greninjaRef.current.style.transform = `translate(-50%, -50%) translate(${pointerX * 20}px, ${pointerY * 11}px) rotate(10deg) rotateX(${pointerY * -7}deg) rotateY(${pointerX * 9}deg)`;
    }

    if (shineRef.current) {
      shineRef.current.style.opacity = "1";
      shineRef.current.style.background = `radial-gradient(circle at ${(pointerX + 0.5) * 100}% ${(pointerY + 0.5) * 100}%, rgba(103, 232, 249, 0.18), transparent 24%)`;
    }
  }

  function handleMouseLeave() {
    if (backgroundRef.current) {
      backgroundRef.current.style.transform = "scale(1.01) translate(0, 0)";
    }

    if (logoRef.current) {
      logoRef.current.style.transform = "translate(-50%, -50%)";
    }

    if (darkraiRef.current) {
      darkraiRef.current.style.transform = "translate(-50%, -50%) rotate(-10deg)";
    }

    if (charizardRef.current) {
      charizardRef.current.style.transform = "translate(-50%, -50%)";
    }

    if (greninjaRef.current) {
      greninjaRef.current.style.transform = "translate(-50%, -50%) rotate(10deg)";
    }

    if (shineRef.current) {
      shineRef.current.style.opacity = "0";
    }
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#020b28] [perspective:1400px]"
    >
      <div className="relative h-[430px] overflow-hidden sm:h-[500px] lg:hidden">
        <img
          src={energyBackground}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
        />

        <div className="pointer-events-none absolute left-1/2 top-[17%] h-32 w-[82%] -translate-x-1/2 rounded-[100%] bg-cyan-400/15 blur-3xl" />

        <div className="absolute left-1/2 top-4 z-20 w-[68%] max-w-[310px] -translate-x-1/2 sm:top-6 sm:w-[58%]">
          <img
            src={logo}
            alt="JKCards"
            style={{
              filter:
                "drop-shadow(0 18px 11px rgba(0, 0, 0, 0.72)) drop-shadow(0 0 9px rgba(34, 211, 238, 0.72))",
            }}
            className="w-full"
          />

          <p className="absolute bottom-[1%] left-1/2 origin-top -translate-x-1/2 scale-y-110 whitespace-nowrap text-[clamp(0.68rem,3vw,0.88rem)] font-extrabold uppercase tracking-[0.07em] text-cyan-50 drop-shadow-[0_3px_4px_rgba(0,0,0,0.9)]">
            Pokémon TCG <span className="text-cyan-300">•</span> Acessórios <span className="text-cyan-300">•</span> Colecionáveis
          </p>
        </div>

        <div className="pointer-events-none absolute bottom-[3%] left-1/2 z-10 h-8 w-[86%] -translate-x-1/2 rounded-[100%] bg-black/60 blur-xl" />
        <div className="pointer-events-none absolute bottom-[7%] left-1/2 z-10 h-6 w-[76%] -translate-x-1/2 rounded-[100%] bg-cyan-300/30 blur-lg" />

        <div className="absolute bottom-2 left-[23%] z-20 w-[38%] -translate-x-1/2 -rotate-[9deg] sm:bottom-4 sm:w-[35%]">
          <img
            src={heroDarkrai}
            alt="Carta Mega Darkrai EX"
            style={{
              filter:
                "drop-shadow(9px 18px 9px rgba(0, 0, 0, 0.72)) drop-shadow(0 0 7px rgba(34, 211, 238, 0.75))",
            }}
            className="w-full rounded-[4%]"
          />
        </div>

        <div
          style={{
            filter:
              "drop-shadow(0 20px 10px rgba(0, 0, 0, 0.78)) drop-shadow(0 0 8px rgba(34, 211, 238, 0.82))",
          }}
          className="absolute -bottom-1 left-1/2 z-30 w-[66%] -translate-x-1/2 sm:bottom-0 sm:w-[59%]"
        >
          <img
            src={heroCharizard}
            alt="Carta Mega Charizard X EX"
            style={{
              clipPath: "inset(5% 18.2% 5% 18.2% round 3%)",
            }}
            className="w-full"
          />
        </div>

        <div className="absolute bottom-2 left-[77%] z-20 w-[38%] -translate-x-1/2 rotate-[9deg] sm:bottom-4 sm:w-[35%]">
          <img
            src={heroGreninja}
            alt="Carta Mega Greninja EX"
            style={{
              filter:
                "drop-shadow(-9px 18px 9px rgba(0, 0, 0, 0.72)) drop-shadow(0 0 7px rgba(34, 211, 238, 0.75))",
            }}
            className="w-full rounded-[4%]"
          />
        </div>
      </div>

      <div className="relative hidden h-[380px] overflow-hidden lg:block">
        <img
          ref={backgroundRef}
          src={energyBackground}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.01] object-cover object-center transition-transform duration-500 ease-out will-change-transform"
        />

        <div
          ref={logoRef}
          className="absolute left-[22%] top-1/2 z-10 w-[30%] max-w-[570px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out will-change-transform"
        >
          <img
            src={logo}
            alt="JKCards"
            style={{
              filter:
                "drop-shadow(0 20px 12px rgba(0, 0, 0, 0.72)) drop-shadow(0 4px 4px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 10px rgba(34, 211, 238, 0.75))",
            }}
            className="w-full transition duration-300 hover:-translate-y-2 hover:scale-105"
          />

          <p className="absolute bottom-[5%] left-1/2 origin-top -translate-x-1/2 scale-y-125 whitespace-nowrap text-[clamp(0.85rem,1vw,1.2rem)] font-extrabold uppercase tracking-[0.16em] text-cyan-50 drop-shadow-[0_4px_5px_rgba(0,0,0,0.85)]">
            Pokémon TCG <span className="text-cyan-300">•</span> Acessórios <span className="text-cyan-300">•</span> Colecionáveis
          </p>
        </div>

        <div className="pointer-events-none absolute left-[65%] top-[82%] z-10 h-9 w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-black/55 blur-xl" />

        <div className="pointer-events-none absolute left-[65%] top-[79%] z-10 h-5 w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-cyan-400/25 blur-lg" />

        <div
          ref={darkraiRef}
          className="absolute left-[53%] top-1/2 z-20 w-[16%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 -rotate-[10deg] transition-transform duration-300 ease-out will-change-transform"
        >
          <img
            src={heroDarkrai}
            alt="Carta Mega Darkrai EX"
            style={{
              filter:
                "drop-shadow(12px 24px 12px rgba(0, 0, 0, 0.68)) drop-shadow(0 0 8px rgba(34, 211, 238, 0.72))",
            }}
            className="w-full rounded-[4%] transition duration-300 hover:-translate-y-3 hover:scale-105"
          />
        </div>

        <div
          ref={charizardRef}
          style={{
            filter:
              "drop-shadow(0 26px 13px rgba(0, 0, 0, 0.74)) drop-shadow(0 5px 5px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 9px rgba(34, 211, 238, 0.78))",
          }}
          className="absolute left-[65%] top-1/2 z-30 w-[27.5%] max-w-[525px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out will-change-transform"
        >
          <img
            src={heroCharizard}
            alt="Carta Mega Charizard X EX"
            style={{
              clipPath: "inset(5% 18.2% 5% 18.2% round 3%)",
            }}
            className="w-full transition duration-300 hover:-translate-y-3 hover:scale-105"
          />
        </div>

        <div
          ref={greninjaRef}
          className="absolute left-[77%] top-1/2 z-20 w-[16%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 rotate-[10deg] transition-transform duration-300 ease-out will-change-transform"
        >
          <img
            src={heroGreninja}
            alt="Carta Mega Greninja EX"
            style={{
              filter:
                "drop-shadow(-12px 24px 12px rgba(0, 0, 0, 0.68)) drop-shadow(0 0 8px rgba(34, 211, 238, 0.72))",
            }}
            className="w-full rounded-[4%] transition duration-300 hover:-translate-y-3 hover:scale-105"
          />
        </div>

        <div
          ref={shineRef}
          className="pointer-events-none absolute inset-0 z-40 opacity-0 transition-opacity duration-300"
        />
      </div>
    </section>
  );
}
