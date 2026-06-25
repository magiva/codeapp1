import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { AccountsService } from "@/generated/services/AccountsService"
import type { Accounts } from "@/generated/models/AccountsModel"

export function useAccounts() {
  const [search, setSearch] = useState("")

  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const result = await AccountsService.getAll({
        select: [
          "accountid",
          "name",
          "accountnumber",
          "websiteurl",
          "telephone1",
          "numberofemployees",
          "revenue",
          "description",
          "statecode",
        ],
        filter: "statecode eq 0",
        orderBy: ["name asc"],
        top: 500,
      })
      if (!result.data) throw new Error("Failed to load accounts")
      return result.data
    },
  })

  const filtered = useMemo((): Accounts[] => {
    if (!query.data) return []
    const term = search.toLowerCase().trim()
    if (!term) return query.data
    const words = term.split(/\s+/).filter(Boolean)
    return query.data.filter((a) => {
      const haystack = [a.name, a.accountnumber, a.websiteurl, a.telephone1]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return words.every((word) => haystack.includes(word))
    })
  }, [query.data, search])

  return { ...query, filtered, search, setSearch }
}
