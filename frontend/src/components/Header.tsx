import { LayoutDashboard, LogOut, Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { Button } from "./Button";

export function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const totalItems = useCartStore((state) => state.totalItems());
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate("/");
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = String(form.get("name") ?? "").trim();
    setMobileOpen(false);
    navigate(value ? `/produtos?name=${encodeURIComponent(value)}` : "/produtos");
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-skysoft after:bg-skybrand"
      : "text-slate-300 hover:text-white after:bg-transparent";

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-gradient font-black tracking-tight text-ink shadow-glow-soft">
            JK
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            JKCards
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          <NavLink
            to="/produtos"
            className={({ isActive }) =>
              `relative px-3 py-2 transition after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:transition ${navLinkClass({ isActive })}`
            }
          >
            Produtos
          </NavLink>
          <NavLink
            to="/pedidos"
            className={({ isActive }) =>
              `relative px-3 py-2 transition after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:transition ${navLinkClass({ isActive })}`
            }
          >
            Pedidos
          </NavLink>
        </nav>

        <form
          className="ml-auto hidden w-full max-w-sm items-center rounded-lg border border-line bg-white/5 px-3 transition focus-within:border-skybrand/60 focus-within:bg-white/10 md:flex"
          onSubmit={handleSearchSubmit}
        >
          <Search size={16} className="text-slate-400" />
          <input
            name="name"
            placeholder="Buscar cards, decks, sleeves..."
            className="h-10 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {isAdmin ? (
            <Link
              to="/admin"
              className="hidden rounded-lg border border-line bg-white/5 p-2 text-slate-200 transition hover:border-skybrand/60 hover:text-white md:inline-flex"
              title="Painel admin"
            >
              <LayoutDashboard size={18} />
            </Link>
          ) : null}

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

          {user ? (
            <Button
              variant="ghost"
              icon={<LogOut size={17} />}
              onClick={handleLogout}
              className="hidden sm:inline-flex"
            >
              <span className="hidden sm:inline">Sair</span>
            </Button>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button variant="secondary" icon={<UserRound size={17} />}>
                Entrar
              </Button>
            </Link>
          )}

          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg border border-line bg-white/5 text-slate-200 transition hover:border-skybrand/60 hover:text-white md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-line bg-ink/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
            <form
              className="flex items-center rounded-lg border border-line bg-white/5 px-3"
              onSubmit={handleSearchSubmit}
            >
              <Search size={16} className="text-slate-400" />
              <input
                name="name"
                placeholder="Buscar..."
                className="h-10 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </form>
            <nav className="grid gap-1 text-sm font-medium">
              <NavLink
                to="/produtos"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition ${
                    isActive ? "bg-white/10 text-skysoft" : "text-slate-300 hover:bg-white/5"
                  }`
                }
              >
                Produtos
              </NavLink>
              <NavLink
                to="/pedidos"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition ${
                    isActive ? "bg-white/10 text-skysoft" : "text-slate-300 hover:bg-white/5"
                  }`
                }
              >
                Pedidos
              </NavLink>
              {isAdmin ? (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 transition ${
                      isActive ? "bg-white/10 text-skysoft" : "text-slate-300 hover:bg-white/5"
                    }`
                  }
                >
                  Painel admin
                </NavLink>
              ) : null}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5"
                >
                  Sair
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-slate-300 hover:bg-white/5"
                >
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
