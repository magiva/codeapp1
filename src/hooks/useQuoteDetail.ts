import { useQuery } from "@tanstack/react-query"
import { QuotesService } from "@/generated/services/QuotesService"

export function useQuoteDetail(quoteId: string | null) {
  return useQuery({
    queryKey: ["quote", quoteId],
    queryFn: async () => {
      if (!quoteId) return null
      const result = await QuotesService.get(quoteId, {
        select: [
          "quoteid",
          "name",
          "quotenumber",
          "total",
          "subtotal",
          "totallineitemamount",
          "totaldiscount",
          "taxpercent",
          "statecode",
          "statuscode",
          "expireson",
          "description",
          "shipping",
        ],
      })
      if (!result.data) throw new Error("Failed to load quote details")
      return result.data
    },
    enabled: !!quoteId,
  })
}
