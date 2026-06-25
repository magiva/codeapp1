import { useState } from "react"
import { useOpportunities } from "@/hooks/useOpportunities"
import { useOpportunityDetail } from "@/hooks/useOpportunityDetail"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Search, TrendingUp, AlertCircle, DollarSign, Calendar, Target } from "lucide-react"
import type { Opportunities } from "@/generated/models/OpportunitiesModel"

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

function OpportunityDetailDialog({ opportunityId, onClose }: { opportunityId: string | null; onClose: () => void }) {
  const { data, isLoading, isError } = useOpportunityDetail(opportunityId)

  const displayName = data?.name || "Opportunity"
  const initials = (data?.name?.[0] ?? "?").toUpperCase()

  return (
    <Dialog open={!!opportunityId} onOpenChange={(open) => { if (!open) onClose() }}>
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
                {data?.opportunityratingcode && (
                  <p className="text-zinc-400 text-sm truncate">Rating: {data.opportunityratingcode}</p>
                )}
              </>
            }
          </div>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {isError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Failed to load opportunity details.
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
                <DetailRow icon={<DollarSign className="h-4 w-4" />} label="Estimated Value" value={data.estimatedvalue ? `$${data.estimatedvalue.toLocaleString()}` : null} />
                <DetailRow icon={<DollarSign className="h-4 w-4" />} label="Actual Value" value={data.actualvalue ? `$${data.actualvalue.toLocaleString()}` : null} />
                <DetailRow icon={<Target className="h-4 w-4" />} label="Status" value={data.statuscode} />
                <DetailRow icon={<Calendar className="h-4 w-4" />} label="Close Date" value={data.estimatedclosedate ? new Date(data.estimatedclosedate).toLocaleDateString() : null} />
                <DetailRow icon={<Calendar className="h-4 w-4" />} label="Actual Close" value={data.actualclosedate ? new Date(data.actualclosedate).toLocaleDateString() : null} />
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

function OpportunityCard({ opportunity, onClick }: { opportunity: Opportunities; onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="group hover:shadow-md transition-shadow border border-zinc-200 rounded-none cursor-pointer hover:border-[#D32C1E]"
    >
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#D32C1E] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-semibold select-none">
              {(opportunity.name?.[0] ?? "?").toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900 truncate leading-tight">{opportunity.name}</p>
            {opportunity.opportunityratingcode && (
              <p className="text-xs text-zinc-500 truncate">{opportunity.opportunityratingcode}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-zinc-600">
          {opportunity.estimatedvalue && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span className="font-medium">${opportunity.estimatedvalue.toLocaleString()}</span>
            </div>
          )}
          {opportunity.statuscode && (
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span>{opportunity.statuscode}</span>
            </div>
          )}
          {opportunity.estimatedclosedate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span>{new Date(opportunity.estimatedclosedate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function OpportunitiesView() {
  const { filtered, isLoading, isError, error, search, setSearch } = useOpportunities()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="flex-1 flex flex-col">
      {/* Search */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 sticky top-0 z-10">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="search"
            placeholder="Search opportunities..."
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
              {error instanceof Error ? error.message : "Failed to load opportunities"}
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
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-zinc-300" />
            <p className="font-medium text-zinc-700">
              {search ? "No opportunities match your search" : "No opportunities found"}
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((opp) => (
              <OpportunityCard
                key={opp.opportunityid}
                opportunity={opp}
                onClick={() => setSelectedId(opp.opportunityid)}
              />
            ))}
          </div>
        )}
      </main>

      <OpportunityDetailDialog opportunityId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  )
}
