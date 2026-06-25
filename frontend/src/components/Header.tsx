import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { Button } from "./Button";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const totalItems = useCartStore((state) => state.totalItems());
  const [mobileOpen, setMobileOpen] = useState(false);

  const canSeeOrders = user && !isAdmin;
  const canSeeCart = !isAdmin;
  const canSeeLogin = !user && location.pathname === "/";
  const hasMobileMenu = Boolean(isAdmin || canSeeOrders || user || canSeeLogin);

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/produtos" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-gradient font-black tracking-tight text-ink shadow-glow-soft">
            JK
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            JKCards
          </span>
        </Link>

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
  );
}