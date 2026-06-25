import { useQuery } from "@tanstack/react-query"
import { AccountsService } from "@/generated/services/AccountsService"

export function useAccountDetail(accountId: string | null) {
  return useQuery({
    queryKey: ["account", accountId],
    queryFn: async () => {
      if (!accountId) return null
      const result = await AccountsService.get(accountId, {
        select: [
          "accountid",
          "name",
          "accountnumber",
          "websiteurl",
          "telephone1",
          "fax",
          "numberofemployees",
          "revenue",
          "description",
          "address1_city",
          "address1_country",
          "address1_line1",
          "address1_postalcode",
          "address1_stateorprovince",
        ],
      })
      if (!result.data) throw new Error("Failed to load account details")
      return result.data
    },
    enabled: !!accountId,
  })
}
