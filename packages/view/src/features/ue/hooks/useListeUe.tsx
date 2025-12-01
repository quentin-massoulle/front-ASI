import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Ue } from "../types"

export const useListeUe = () => {
  return useQuery({
    queryKey: ["ues"],
    queryFn: async (): Promise<Ue[]> => {
      const response = await apiFetch("/ues", {
        method: "GET",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch ue")
      }

      return response.json()
    },
  })
}
