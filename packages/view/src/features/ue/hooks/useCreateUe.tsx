import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Ue, CreateUePayload } from "../types"

interface CreateUeResponse {
  message: string;
  parcours: Ue;
}

export const useCreateUe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUePayload): Promise<Ue> => {
      const response = await apiFetch("/Ue", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create parcours")
      }

      const data = (await response.json()) as CreateUeResponse
      return data.parcours
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcours"] })
    },
  })
}
