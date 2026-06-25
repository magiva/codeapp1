import { useQuery } from "@tanstack/react-query"
import { OpportunitiesService } from "@/generated/services/OpportunitiesService"

export function useOpportunityDetail(opportunityId: string | null) {
  return useQuery({
    queryKey: ["opportunity", opportunityId],
    queryFn: async () => {
      if (!opportunityId) return null
      const result = await OpportunitiesService.get(opportunityId, {
        select: [
          "opportunityid",
          "name",
          "opportunityratingcode",
          "estimatedvalue",
          "actualvalue",
          "statecode",
          "statuscode",
          "estimatedclosedate",
          "actualclosedate",
          "probability",
          "description",
          "stepname",
        ],
      })
      if (!result.data) throw new Error("Failed to load opportunity details")
      return result.data
    },
    enabled: !!opportunityId,
  })
}
