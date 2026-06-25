import { useQuery } from "@tanstack/react-query"
import { ContactsService } from "@/generated/services/ContactsService"

export function useContactDetail(contactId: string | null) {
  return useQuery({
    queryKey: ["contact", contactId],
    enabled: !!contactId,
    queryFn: async () => {
      const result = await ContactsService.get(contactId!, {
        select: [
          "contactid",
          "fullname",
          "firstname",
          "lastname",
          "jobtitle",
          "department",
          "emailaddress1",
          "emailaddress2",
          "telephone1",
          "telephone2",
          "mobilephone",
          "address1_line1",
          "address1_line2",
          "address1_city",
          "address1_stateorprovince",
          "address1_postalcode",
          "address1_country",
          "websiteurl",
          "description",
          "birthdate",
          "statecode",
        ],
      })
      if (!result.data) throw new Error("Failed to load contact details")
      return result.data
    },
  })
}
