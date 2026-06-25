import { useState } from "react"
import { useContacts } from "@/hooks/useContacts"
import { useContactDetail } from "@/hooks/useContactDetail"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Search, Mail, Phone, Building2, User, AlertCircle,
  MapPin, Globe, Briefcase, Smartphone, CalendarDays, FileText,
} from "lucide-react"
import type { Contacts } from "@/generated/models/ContactsModel"

function DetailRow({ icon, label, value, href }: {
  icon: React.ReactNode
  label: string
  value?: string | null
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

function ContactDetailDialog({ contactId, onClose }: { contactId: string | null; onClose: () => void }) {
  const { data, isLoading, isError } = useContactDetail(contactId)

  const displayName = data?.fullname?.trim() ||
    [data?.firstname, data?.lastname].filter(Boolean).join(" ") ||
    "Contact"

  const addressParts = [
    data?.address1_line1,
    data?.address1_line2,
    data?.address1_city,
    data?.address1_stateorprovince,
    data?.address1_postalcode,
    data?.address1_country,
  ].filter(Boolean)
  const address = addressParts.join(", ")

  const initials = (data?.firstname?.[0] ?? data?.lastname?.[0] ?? "?").toUpperCase()

  return (
    <Dialog open={!!contactId} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-lg rounded-none p-0 overflow-hidden gap-0">
        {/* Coloured header */}
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
                {data?.jobtitle && (
                  <p className="text-zinc-400 text-sm truncate">{data.jobtitle}</p>
                )}
              </>
            }
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {isError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Failed to load contact details.
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
              {/* Organisation */}
              {(data.parentcustomeridname || data.department) && (
                <>
                  <div className="space-y-3">
                    <DetailRow icon={<Building2 className="h-4 w-4" />} label="Company" value={data.parentcustomeridname} />
                    <DetailRow icon={<Briefcase className="h-4 w-4" />} label="Department" value={data.department} />
                  </div>
                  <Separator />
                </>
              )}

              {/* Contact */}
              {(data.emailaddress1 || data.emailaddress2 || data.telephone1 || data.telephone2 || data.mobilephone) && (
                <>
                  <div className="space-y-3">
                    <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={data.emailaddress1} href={data.emailaddress1 ? `mailto:${data.emailaddress1}` : undefined} />
                    <DetailRow icon={<Mail className="h-4 w-4" />} label="Email 2" value={data.emailaddress2} href={data.emailaddress2 ? `mailto:${data.emailaddress2}` : undefined} />
                    <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={data.telephone1} href={data.telephone1 ? `tel:${data.telephone1}` : undefined} />
                    <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone 2" value={data.telephone2} href={data.telephone2 ? `tel:${data.telephone2}` : undefined} />
                    <DetailRow icon={<Smartphone className="h-4 w-4" />} label="Mobile" value={data.mobilephone} href={data.mobilephone ? `tel:${data.mobilephone}` : undefined} />
                  </div>
                  <Separator />
                </>
              )}

              {/* Location */}
              {address && (
                <>
                  <div className="space-y-3">
                    <DetailRow icon={<MapPin className="h-4 w-4" />} label="Address" value={address} />
                  </div>
                  <Separator />
                </>
              )}

              {/* Other */}
              <div className="space-y-3">
                <DetailRow icon={<Globe className="h-4 w-4" />} label="Website" value={data.websiteurl} href={data.websiteurl ?? undefined} />
                <DetailRow icon={<CalendarDays className="h-4 w-4" />} label="Birthday" value={data.birthdate ? new Date(data.birthdate).toLocaleDateString() : null} />
                <DetailRow icon={<FileText className="h-4 w-4" />} label="Notes" value={data.description} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ContactCard({ contact, onClick }: { contact: Contacts; onClick: () => void }) {
  const displayName = contact.fullname?.trim() ||
    [contact.firstname, contact.lastname].filter(Boolean).join(" ") ||
    "Unnamed Contact"
  const phone = contact.telephone1 || contact.mobilephone

  return (
    <Card
      onClick={onClick}
      className="group hover:shadow-md transition-shadow border border-zinc-200 rounded-none cursor-pointer hover:border-[#D32C1E]"
    >      <CardContent className="p-5 flex flex-col gap-3">
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
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
                <ContactCard
                  key={contact.contactid}
                  contact={contact}
                  onClick={() => setSelectedId(contact.contactid)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ContactDetailDialog contactId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  )
}