import {
  Boxes,
  FolderTree,
  Layers,
  LayoutDashboard,
  PackageCheck,
  PlusCircle,
  UsersRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/produtos",
    label: "Produtos",
    icon: Boxes,
    end: false,
  },
  {
    to: "/admin/cartas",
    label: "Cartas",
    icon: Layers,
    end: true,
  },
  {
    to: "/admin/cartas/nova",
    label: "Nova carta",
    icon: PlusCircle,
    end: true,
  },
  {
    to: "/admin/categorias",
    label: "Categorias",
    icon: FolderTree,
    end: false,
  },
  {
    to: "/admin/pedidos",
    label: "Pedidos",
    icon: PackageCheck,
    end: false,
  },
  {
    to: "/admin/usuarios",
    label: "Usuários",
    icon: UsersRound,
    end: false,
  },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-line/80 bg-panel/70 backdrop-blur lg:min-h-[calc(100vh-65px)] lg:w-64 lg:border-b-0 lg:border-r">
      <div className="hidden px-6 pb-2 pt-6 lg:block">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Painel
        </p>
      </div>

      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 lg:flex-col lg:px-3 lg:py-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `inline-flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-gradient text-ink shadow-glow-soft"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}