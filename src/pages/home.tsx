import { useContacts } from "@/hooks/useContacts"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Mail, Phone, Building2, User, AlertCircle } from "lucide-react"
import type { Contacts } from "@/generated/models/ContactsModel"

function ContactCard({ contact }: { contact: Contacts }) {
  const displayName = contact.fullname?.trim() ||
    [contact.firstname, contact.lastname].filter(Boolean).join(" ") ||
    "Unnamed Contact"
  const phone = contact.telephone1 || contact.mobilephone

  return (
    <Card className="group hover:shadow-md transition-shadow border border-zinc-200 rounded-none">
      <CardContent className="p-5 flex flex-col gap-3">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#D32C1E] flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-semibold select-none">
              {(contact.firstname?.[0] ?? contact.lastname?.[0] ?? "?").toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-zinc-900 truncate leading-tight">{displayName}</p>
            {contact.jobtitle && (
              <p className="text-xs text-zinc-500 truncate">{contact.jobtitle}</p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1.5 text-sm text-zinc-600">
          {contact.parentcustomeridname && (
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span className="truncate">{contact.parentcustomeridname}</span>
            </div>
          )}
          {contact.emailaddress1 && (
            <div className="flex items-center gap-2 truncate">
              <Mail className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <a
                href={`mailto:${contact.emailaddress1}`}
                className="truncate hover:text-[#D32C1E] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {contact.emailaddress1}
              </a>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <a
                href={`tel:${phone}`}
                className="hover:text-[#D32C1E] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {phone}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <Card className="border border-zinc-200 rounded-none">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const { filtered, isLoading, isError, error, search, setSearch, data } = useContacts()

  return (
    <div className="min-h-full flex flex-col bg-zinc-50">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#D32C1E] font-black text-2xl tracking-widest uppercase select-none">
              Veidekke
            </span>
            <span className="text-zinc-500 text-sm hidden sm:block">|</span>
            <span className="text-zinc-300 text-sm hidden sm:block">Contacts</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <User className="h-4 w-4" />
            {isLoading ? (
              <Skeleton className="h-4 w-20 bg-zinc-700" />
            ) : (
              <span>{data?.length ?? 0} total</span>
            )}
          </div>
        </div>
      </header>

      {/* Search bar */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 sticky top-[68px] z-10">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="search"
              placeholder="Search by name, email, phone, company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-zinc-300 focus:outline-none focus:border-[#D32C1E] focus:ring-1 focus:ring-[#D32C1E] rounded-none bg-white text-zinc-900 placeholder:text-zinc-400 transition-colors"
            />
          </div>
          {!isLoading && (
            <p className="mt-2 text-xs text-zinc-500">
              {search
                ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
                : `Showing all ${filtered.length} active contact${filtered.length !== 1 ? "s" : ""}`}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Error state */}
          {isError && (
            <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 text-red-700 rounded-none">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Failed to load contacts</p>
                <p className="text-xs text-red-500 mt-0.5">
                  {error instanceof Error ? error.message : "An unexpected error occurred."}
                </p>
              </div>
            </div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              <User className="h-10 w-10 mx-auto mb-3 text-zinc-300" />
              <p className="font-medium text-zinc-700">
                {search ? "No contacts match your search" : "No contacts found"}
              </p>
              {search && (
                <p className="text-sm mt-1">
                  Try adjusting your search or{" "}
                  <button
                    onClick={() => setSearch("")}
                    className="text-[#D32C1E] underline-offset-2 hover:underline"
                  >
                    clear the filter
                  </button>
                </p>
              )}
            </div>
          )}

          {/* Contacts grid */}
          {!isLoading && !isError && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((contact) => (
                <ContactCard key={contact.contactid} contact={contact} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}