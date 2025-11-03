import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Parcours, CreateParcoursPayload } from "../types"

interface CreateParcoursResponse {
  message: string;
  parcours: Parcours;
}

export const useCreateParcours = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateParcoursPayload): Promise<Parcours> => {
      const response = await apiFetch("/parcours", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create parcours")
      }

      const data = (await response.json()) as CreateParcoursResponse
      return data.parcours
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcours"] })
    },
  })
}
