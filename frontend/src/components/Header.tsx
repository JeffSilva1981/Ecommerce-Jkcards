import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { Button } from "./Button";
import jkcardsLogo from "../assets/jkcards-logo.png";

const categoryFilters = [
  { label: "Todos", value: "" },
  { label: "Selados", value: "Selado" },
  { label: "Acessórios", value: "Acessório" },
  { label: "Jogos", value: "Jogo" },
  { label: "Cartas", value: "Carta" },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const totalItems = useCartStore((state) => state.totalItems());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("name") ?? "");

  const canSeeOrders = user && !isAdmin;
  const canSeeCart = !isAdmin;
  const canSeeLogin =
    !user && location.pathname !== "/login" && location.pathname !== "/cadastro";
  const hasMobileMenu = Boolean(isAdmin || canSeeOrders || user || canSeeLogin);

  function scrollToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate("/");
  }

  function handleLogoClick() {
    setMobileOpen(false);
    scrollToTop();
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = search.trim();

    setMobileOpen(false);
    navigate(value ? `/produtos?name=${encodeURIComponent(value)}` : "/produtos");
    scrollToTop();
  }

  function handleCategoryClick(value: string) {
    setSearch(value);
    setMobileOpen(false);
    navigate(value ? `/produtos?name=${encodeURIComponent(value)}` : "/produtos");
    scrollToTop();
  }

  return (
    <>
      <div className="border-b border-yellow-400/30 bg-gold px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-ink sm:text-sm">
        Aceitamos Pix e cartão de crédito • Envio para todo Brasil • Compra
        segura
      </div>

      <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/produtos"
              onClick={handleLogoClick}
              className="flex shrink-0 items-center gap-2.5"
            >
              <img
                src={jkcardsLogo}
                alt="JKCards"
                className="h-14 w-auto object-contain sm:h-16"
              />
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="hidden min-w-0 flex-1 md:block md:max-w-2xl"
            >
              <div className="relative">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar Pokémon TCG, booster, deck, sleeve..."
                  className="h-11 w-full rounded-md border border-line bg-white px-4 pr-12 text-sm text-ink outline-none transition placeholder:text-slate-500 focus:border-skybrand focus:ring-2 focus:ring-skybrand/30"
                />

                <button
                  type="submit"
                  className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink transition hover:bg-slate-100"
                  aria-label="Buscar produto"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="hidden rounded-lg border border-line bg-white/5 p-2 text-slate-200 transition hover:border-skybrand/60 hover:text-white md:inline-flex"
                  title="Painel admin"
                >
                  <LayoutDashboard size={18} />
                </Link>
              ) : null}

              {canSeeOrders ? (
                <Link
                  to="/pedidos"
                  className="rounded-lg border border-line bg-white/5 p-2 text-slate-200 transition hover:border-skybrand/60 hover:text-white"
                  title="Meus pedidos"
                >
                  <Package size={18} />
                </Link>
              ) : null}

              {canSeeCart ? (
                <Link
                  to="/carrinho"
                  className="relative rounded-lg border border-line bg-white/5 p-2 text-slate-200 transition hover:border-skybrand/60 hover:text-white"
                  title="Carrinho"
                >
                  <ShoppingCart size={18} />

                  {totalItems > 0 ? (
                    <span className="absolute -right-2 -top-2 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-bold text-ink shadow-glow-gold">
                      {totalItems}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {user ? (
                <Button
                  variant="ghost"
                  icon={<LogOut size={17} />}
                  onClick={handleLogout}
                  className="hidden sm:inline-flex"
                >
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              ) : null}

              {canSeeLogin ? (
                <Link to="/login" className="hidden sm:block">
                  <Button variant="secondary" icon={<UserRound size={17} />}>
                    Entrar
                  </Button>
                </Link>
              ) : null}

              {hasMobileMenu ? (
                <button
                  type="button"
                  className="grid size-10 place-items-center rounded-lg border border-line bg-white/5 text-slate-200 transition hover:border-skybrand/60 hover:text-white md:hidden"
                  onClick={() => setMobileOpen((value) => !value)}
                  aria-label="Abrir menu"
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              ) : null}
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="md:hidden">
            <div className="relative">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar produto..."
                className="h-11 w-full rounded-md border border-line bg-white px-4 pr-12 text-sm text-ink outline-none transition placeholder:text-slate-500 focus:border-skybrand focus:ring-2 focus:ring-skybrand/30"
              />

              <button
                type="submit"
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink transition hover:bg-slate-100"
                aria-label="Buscar produto"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          <nav className="flex gap-2 overflow-x-auto pb-1">
            {categoryFilters.map((category) => {
              const isActive = search === category.value;

              return (
                <button
                  key={category.label}
                  type="button"
                  onClick={() => handleCategoryClick(category.value)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-skybrand bg-skybrand text-ink"
                      : "border-line bg-white/5 text-slate-300 hover:border-skybrand/60 hover:text-white"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </nav>
        </div>

        {mobileOpen ? (
          <div className="border-t border-line bg-ink/95 backdrop-blur-md md:hidden">
            <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-white/5"
                >
                  Painel admin
                </Link>
              ) : null}

              {canSeeOrders ? (
                <Link
                  to="/pedidos"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-white/5"
                >
                  Meus pedidos
                </Link>
              ) : null}

              {canSeeLogin ? (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-white/5"
                >
                  Entrar
                </Link>
              ) : null}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5"
                >
                  Sair
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}