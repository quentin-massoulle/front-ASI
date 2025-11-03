import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Parcours } from "../types"

export const useDeleteParcours = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await apiFetch(`/parcours/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete parcours")
      }
    },
    onSuccess: (_, id) => {
      const previousParcours = queryClient.getQueryData<Parcours[]>([
        "parcours",
      ])
      queryClient.setQueryData<Parcours[]>(["parcours"], (old) => {
        return old?.filter((parcours) => parcours.id !== id)
      })
      return { previousParcours }
    },
  })
}
