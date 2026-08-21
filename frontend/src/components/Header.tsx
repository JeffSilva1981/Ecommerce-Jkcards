import { useQuery } from "@tanstack/react-query";
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
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { getCategories } from "../api/categoriesApi";
import jkcardsLogo from "../assets/jkcards-logo-header.png";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";

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

  const activeCategoryId = searchParams.get("categoryId");

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const canSeeProfile = Boolean(user && !isAdmin);
  const canSeeOrders = Boolean(user && !isAdmin);
  const canSeeCart = !isAdmin;

  const canSeeLogin =
    !user &&
    location.pathname !== "/login" &&
    location.pathname !== "/cadastro";

  const hasMobileMenu = Boolean(
    isAdmin ||
      canSeeProfile ||
      canSeeOrders ||
      user ||
      canSeeLogin,
  );

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

    navigate(
      value
        ? `/produtos?name=${encodeURIComponent(value)}`
        : "/produtos",
    );

    scrollToTop();
  }

  function handleCategoryClick(id?: number, name?: string) {
    setSearch("");
    setMobileOpen(false);

    navigate(
      id
        ? `/produtos?categoryId=${id}&categoryName=${encodeURIComponent(
            name ?? "",
          )}`
        : "/produtos",
    );

    scrollToTop();
  }

  return (
    <>
      <div className="border-b border-sky-400/20 bg-sky-500 px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
        Aceitamos Pix e cartão de crédito • Envio para todo o Brasil • Compra
        segura
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#00102D]/95 shadow-lg backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[88px] items-center justify-between gap-4">
            <Link
              to="/produtos"
              onClick={handleLogoClick}
              className="flex shrink-0 items-center"
            >
              <img
                src={jkcardsLogo}
                alt="JKCards"
                className="h-[68px] w-[116px] object-cover object-center sm:h-[76px] sm:w-[128px]"
              />
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="hidden min-w-0 max-w-2xl flex-1 md:block"
            >
              <div className="relative">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar Pokémon TCG, booster, deck, sleeve..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-5 pr-14 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
                />

                <button
                  type="submit"
                  aria-label="Buscar produto"
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-slate-700 transition hover:bg-sky-50 hover:text-sky-600"
                >
                  <Search size={21} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                <Link
                  to="/admin"
                  title="Painel administrativo"
                  className="hidden size-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-white md:flex"
                >
                  <LayoutDashboard size={19} />
                </Link>
              ) : null}

              {canSeeProfile ? (
                <Link
                  to="/perfil"
                  title="Meu perfil"
                  className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-white"
                >
                  <UserRound size={19} />
                </Link>
              ) : null}

              {canSeeOrders ? (
                <Link
                  to="/pedidos"
                  title="Meus pedidos"
                  className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-white"
                >
                  <Package size={19} />
                </Link>
              ) : null}

              {canSeeCart ? (
                <Link
                  to="/carrinho"
                  title="Carrinho"
                  className="relative flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-white"
                >
                  <ShoppingCart size={20} />

                  {totalItems > 0 ? (
                    <span className="absolute -right-2 -top-2 grid min-w-6 place-items-center rounded-full bg-yellow-400 px-1.5 py-0.5 text-xs font-black text-slate-950 shadow-md">
                      {totalItems}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white sm:flex"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              ) : null}

              {canSeeLogin ? (
                <Link
                  to="/login"
                  className="hidden h-11 items-center gap-2 rounded-xl bg-sky-500 px-4 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 sm:flex"
                >
                  <UserRound size={18} />
                  Entrar
                </Link>
              ) : null}

              {hasMobileMenu ? (
                <button
                  type="button"
                  onClick={() => setMobileOpen((value) => !value)}
                  aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                  className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:border-sky-400 hover:text-white md:hidden"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              ) : null}
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="pb-4 md:hidden"
          >
            <div className="relative">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar produto..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
              />

              <button
                type="submit"
                aria-label="Buscar produto"
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-700 transition hover:bg-sky-50 hover:text-sky-600"
              >
                <Search size={19} />
              </button>
            </div>
          </form>

          <nav className="flex gap-2 overflow-x-auto overscroll-x-contain border-t border-white/10 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              {
                id: undefined,
                name: "Todos",
              },
              ...(categoriesQuery.data ?? []),
            ].map((category) => {
              const isActive = category.id
                ? activeCategoryId === String(category.id)
                : !activeCategoryId && !search;

              return (
                <button
                  key={category.id ?? "all"}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(category.id, category.name)
                  }
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-sky-400 bg-sky-400 text-[#00102D] shadow-md shadow-sky-400/20"
                      : "border-white/15 bg-white/5 text-slate-300 hover:border-sky-400/70 hover:bg-sky-400/10 hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </nav>
        </div>

        {mobileOpen ? (
          <div className="border-t border-white/10 bg-[#00102D] md:hidden">
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <LayoutDashboard size={18} />
                  Painel administrativo
                </Link>
              ) : null}

              {canSeeProfile ? (
                <Link
                  to="/perfil"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <UserRound size={18} />
                  Meu perfil
                </Link>
              ) : null}

              {canSeeOrders ? (
                <Link
                  to="/pedidos"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Package size={18} />
                  Meus pedidos
                </Link>
              ) : null}

              {canSeeLogin ? (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <UserRound size={18} />
                  Entrar
                </Link>
              ) : null}

              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={18} />
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
