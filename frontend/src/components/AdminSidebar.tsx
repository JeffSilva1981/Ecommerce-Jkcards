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
    <aside
      className="border-b border-slate-200 bg-white lg:w-64 lg:shrink-0 lg:self-stretch lg:border-b-0 lg:border-r"
      style={{ colorScheme: "light" }}
    >
      <div className="hidden px-6 pb-3 pt-6 lg:block">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
          Administração
        </p>

        <p className="mt-2 text-lg font-black text-[#00102D]">
          Painel da loja
        </p>
      </div>

      <nav
        aria-label="Menu administrativo"
        className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 lg:flex-col lg:px-3 lg:pb-6"
      >
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-sky-500 bg-sky-500 text-white shadow-sm"
                    : "border-transparent text-slate-600 hover:border-sky-100 hover:bg-sky-50 hover:text-sky-700"
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}