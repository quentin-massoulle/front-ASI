import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Parcours } from "../types"

export const useListParcours = () => {
  return useQuery({
    queryKey: ["parcours"],
    queryFn: async (): Promise<Parcours[]> => {
      const response = await apiFetch("/parcours", {
        method: "GET",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch parcours")
      }

      return response.json()
    },
  })
}
