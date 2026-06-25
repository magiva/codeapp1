import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { ContactsService } from "@/generated/services/ContactsService"
import type { Contacts } from "@/generated/models/ContactsModel"

export function useContacts() {
  const [search, setSearch] = useState("")

  const query = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const result = await ContactsService.getAll({
        // fullname is selectable; parentcustomeridname is a lookup display name — auto-returned, not selectable
        select: [
          "contactid",
          "fullname",
          "firstname",
          "lastname",
          "emailaddress1",
          "telephone1",
          "mobilephone",
          "jobtitle",
          "statecode",
        ],
        filter: "statecode eq 0",
        orderBy: ["lastname asc", "firstname asc"],
        top: 500,
      })
      if (!result.data) throw new Error("Failed to load contacts")
      return result.data
    },
  })

  const filtered = useMemo((): Contacts[] => {
    if (!query.data) return []
    const term = search.toLowerCase().trim()
    if (!term) return query.data
    const words = term.split(/\s+/).filter(Boolean)
    return query.data.filter((c) => {
      const haystack = [
        c.firstname,
        c.lastname,
        // fullname & parentcustomeridname are returned by API even without explicit select
        c.fullname,
        c.parentcustomeridname,
        c.emailaddress1,
        c.telephone1,
        c.mobilephone,
        c.jobtitle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return words.every((word) => haystack.includes(word))
    })
  }, [query.data, search])

  return { ...query, filtered, search, setSearch }
}
