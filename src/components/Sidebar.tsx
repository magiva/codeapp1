import { Building2, Users, TrendingUp, FileText } from "lucide-react"

export type ViewType = "contacts" | "accounts" | "opportunities" | "quotes"

interface NavItem {
  id: ViewType
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: "contacts", label: "Contacts", icon: <Users className="h-4 w-4" /> },
  { id: "accounts", label: "Accounts", icon: <Building2 className="h-4 w-4" /> },
  { id: "opportunities", label: "Opportunities", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "quotes", label: "Quotes", icon: <FileText className="h-4 w-4" /> },
]

export function Sidebar({ activeView, onViewChange }: { activeView: ViewType; onViewChange: (view: ViewType) => void }) {
  return (
    <aside className="w-48 bg-black text-white flex flex-col border-r border-zinc-800 h-[calc(100vh-68px)] sticky top-[68px]">
      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
              activeView === item.id
                ? "bg-[#D32C1E] text-white font-medium"
                : "text-zinc-300 hover:text-white hover:bg-zinc-900"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer info */}
      <div className="border-t border-zinc-800 p-3 text-xs text-zinc-400">
        <p className="text-[#D32C1E] font-semibold mb-1">Veidekke CRM</p>
        <p>Power Apps Code App</p>
      </div>
    </aside>
  )
}
