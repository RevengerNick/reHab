// apps/dashboard/src/components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, FileText, Settings, Send } from "lucide-react"; // Убрали Home, т.к. /projects теперь главная

export function Sidebar() {
  const pathname = usePathname();

  const projectMatch = pathname.match(/^\/projects\/([^\/]+)/);
  const projectPublicId = projectMatch ? projectMatch[1] : null;

  // 1. Убираем дубликаты и приводим массив в порядок
  const navItems = [
    { href: "/projects", label: "Проекты", icon: Rocket, disabled: false },
    {
      href: projectPublicId ? `/projects/${projectPublicId}/logs` : "#",
      label: "Логи",
      icon: FileText,
      disabled: !projectPublicId,
    },
    {
      href: projectPublicId ? `/projects/${projectPublicId}/testing` : "#",
      label: "Песочница",
      icon: Send,
      disabled: !projectPublicId,
    },
    {
      href: projectPublicId ? `/projects/${projectPublicId}/settings` : "#",
      label: "Настройки",
      icon: Settings,
      disabled: !projectPublicId,
    },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r bg-slate-50 md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/projects" className="text-xl font-bold text-slate-900">
          Xabar.dev
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.href !== "#" && pathname.startsWith(item.href);

            // 2. Используем item.label как уникальный ключ, а не item.href
            return (
              <li key={item.label}> 
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors 
                    ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : item.disabled
                        ? "cursor-not-allowed text-slate-400"
                        : "text-slate-600 hover:bg-slate-200"
                    }
                    ${item.disabled ? "pointer-events-none" : ""}`
                  }
                  aria-disabled={item.disabled}
                  tabIndex={item.disabled ? -1 : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}