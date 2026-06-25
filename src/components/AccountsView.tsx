import { useState } from "react"
import { useAccounts } from "@/hooks/useAccounts"
import { useAccountDetail } from "@/hooks/useAccountDetail"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Search, Building2, AlertCircle, Phone, Globe, Users, Briefcase } from "lucide-react"
import type { Accounts } from "@/generated/models/AccountsModel"

function DetailRow({ icon, label, value, href }: {
  icon: React.ReactNode
  label: string
  value?: string | number | null
  href?: string
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-zinc-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
        {href ? (
          <a href={href} className="text-sm text-zinc-800 hover:text-[#D32C1E] break-all transition-colors">
            {value}
          </a>
        ) : (
          <p className="text-sm text-zinc-800 break-words">{value}</p>
        )}
      </div>
    </div>
  )
}

function AccountDetailDialog({ accountId, onClose }: { accountId: string | null; onClose: () => void }) {
  const { data, isLoading, isError } = useAccountDetail(accountId)

  const displayName = data?.name || "Account"
  const initials = (data?.name?.[0] ?? "?").toUpperCase()

  return (
    <Dialog open={!!accountId} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-lg rounded-none p-0 overflow-hidden gap-0">
        <div className="bg-black px-6 py-5 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[#D32C1E] flex items-center justify-center shrink-0">
            {isLoading
              ? <Skeleton className="h-14 w-14 rounded-full bg-zinc-700" />
              : <span className="text-white text-xl font-bold select-none">{initials}</span>
            }
          </div>
          <div className="min-w-0">
            {isLoading
              ? <><Skeleton className="h-5 w-40 bg-zinc-700 mb-2" /><Skeleton className="h-3.5 w-28 bg-zinc-700" /></>
              : <>
                <DialogTitle className="text-white font-semibold text-lg leading-tight truncate">
                  {displayName}
                </DialogTitle>
                {data?.accountnumber && (
                  <p className="text-zinc-400 text-sm truncate">{data.accountnumber}</p>
                )}
              </>
            }
          </div>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {isError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Failed to load account details.
            </div>
          )}

          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="space-y-3">
                <DetailRow icon={<Globe className="h-4 w-4" />} label="Website" value={data.websiteurl} href={data.websiteurl ?? undefined} />
                <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={data.telephone1} href={data.telephone1 ? `tel:${data.telephone1}` : undefined} />
                <DetailRow icon={<Users className="h-4 w-4" />} label="Employees" value={data.numberofemployees} />
                <DetailRow icon={<Briefcase className="h-4 w-4" />} label="Revenue" value={data.revenue ? `$${data.revenue.toLocaleString()}` : null} />
              </div>
              {data.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-zinc-400 mb-2">Description</p>
                    <p className="text-sm text-zinc-800 whitespace-pre-wrap">{data.description}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AccountCard({ account, onClick }: { account: Accounts; onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="group hover:shadow-md transition-shadow border border-zinc-200 rounded-none cursor-pointer hover:border-[#D32C1E]"
    >
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#D32C1E] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-semibold select-none">
              {(account.name?.[0] ?? "?").toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900 truncate leading-tight">{account.name}</p>
            {account.accountnumber && (
              <p className="text-xs text-zinc-500 truncate">{account.accountnumber}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-zinc-600">
          {account.websiteurl && (
            <div className="flex items-center gap-2 truncate">
              <Globe className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <a
                href={account.websiteurl}
                target="_blank"
                rel="noreferrer"
                className="truncate hover:text-[#D32C1E] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {account.websiteurl}
              </a>
            </div>
          )}
          {account.telephone1 && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <a
                href={`tel:${account.telephone1}`}
                className="hover:text-[#D32C1E] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {account.telephone1}
              </a>
            </div>
          )}
          {account.numberofemployees && (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span>{account.numberofemployees} employees</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function AccountsView() {
  const { filtered, isLoading, isError, error, search, setSearch } = useAccounts()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="flex-1 flex flex-col">
      {/* Search */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 sticky top-0 z-10">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="search"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-300 focus:outline-none focus:border-[#D32C1E] focus:ring-1 focus:ring-[#D32C1E] rounded-none bg-white text-zinc-900 placeholder:text-zinc-400 transition-colors"
          />
        </div>
        {!isLoading && (
          <p className="text-xs text-zinc-500">
            {search
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
              : `${filtered.length} total`}
          </p>
        )}
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-6 overflow-auto">
        {isError && (
          <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 text-red-700 rounded-none">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">
              {error instanceof Error ? error.message : "Failed to load accounts"}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border border-zinc-200 rounded-none">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <Building2 className="h-10 w-10 mx-auto mb-3 text-zinc-300" />
            <p className="font-medium text-zinc-700">
              {search ? "No accounts match your search" : "No accounts found"}
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((account) => (
              <AccountCard
                key={account.accountid}
                account={account}
                onClick={() => setSelectedId(account.accountid)}
              />
            ))}
          </div>
        )}
      </main>

      <AccountDetailDialog accountId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  )
}
