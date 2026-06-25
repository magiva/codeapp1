import { useState } from "react"
import { User } from "lucide-react"
import { Sidebar, type ViewType } from "@/components/Sidebar"
import { ContactsView } from "@/components/ContactsView"
import { AccountsView } from "@/components/AccountsView"
import { OpportunitiesView } from "@/components/OpportunitiesView"
import { QuotesView } from "@/components/QuotesView"

const viewLabels: Record<ViewType, string> = {
  contacts: "Contacts",
  accounts: "Accounts",
  opportunities: "Opportunities",
  quotes: "Quotes",
}

export default function HomePage() {
  const [activeView, setActiveView] = useState<ViewType>("contacts")

  return (
    <div className="min-h-full flex flex-col bg-zinc-50">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#D32C1E] font-black text-2xl tracking-widest uppercase select-none">
              Veidekke
            </span>
            <span className="text-zinc-500 text-sm hidden sm:block">|</span>
            <span className="text-zinc-300 text-sm hidden sm:block">{viewLabels[activeView]}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <User className="h-4 w-4" />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {activeView === "contacts" && <ContactsView />}
          {activeView === "accounts" && <AccountsView />}
          {activeView === "opportunities" && <OpportunitiesView />}
          {activeView === "quotes" && <QuotesView />}
        </div>
      </div>
    </div>
  )
}