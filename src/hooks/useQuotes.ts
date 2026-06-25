import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { QuotesService } from "@/generated/services/QuotesService"
import type { Quotes } from "@/generated/models/QuotesModel"

export function useQuotes() {
  const [search, setSearch] = useState("")

  const query = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const result = await QuotesService.getAll({
        select: [
          "quoteid",
          "name",
          "total",
          "quotenumber",
          "statecode",
          "statuscode",
          "expireson",
          "description",
        ],
        filter: "statecode eq 0",
        orderBy: ["createdon desc"],
        top: 500,
      })
      if (!result.data) throw new Error("Failed to load quotes")
      return result.data
    },
  })

  const filtered = useMemo((): Quotes[] => {
    if (!query.data) return []
    const term = search.toLowerCase().trim()
    if (!term) return query.data
    return query.data.filter((q) =>
      q.name?.toLowerCase().includes(term) ||
      q.quotenumber?.toLowerCase().includes(term) ||
      q.description?.toLowerCase().includes(term)
    )
  }, [query.data, search])

  return { ...query, filtered, search, setSearch }
}
