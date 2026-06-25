import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { OpportunitiesService } from "@/generated/services/OpportunitiesService"
import type { Opportunities } from "@/generated/models/OpportunitiesModel"

export function useOpportunities() {
  const [search, setSearch] = useState("")

  const query = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const result = await OpportunitiesService.getAll({
        select: [
          "opportunityid",
          "name",
          "opportunityratingcode",
          "estimatedvalue",
          "statecode",
          "statuscode",
          "estimatedclosedate",
          "description",
        ],
        filter: "statecode eq 0",
        orderBy: ["createdon desc"],
        top: 500,
      })
      if (!result.data) throw new Error("Failed to load opportunities")
      return result.data
    },
  })

  const filtered = useMemo((): Opportunities[] => {
    if (!query.data) return []
    const term = search.toLowerCase().trim()
    if (!term) return query.data
    return query.data.filter((o) =>
      o.name?.toLowerCase().includes(term) || o.description?.toLowerCase().includes(term)
    )
  }, [query.data, search])

  return { ...query, filtered, search, setSearch }
}
