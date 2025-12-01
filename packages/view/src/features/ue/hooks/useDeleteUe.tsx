import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Ue } from "../types"

export const useDeleteUe = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const response = await apiFetch(`/ue/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete parcours")
      }
    },
    onSuccess: (_, id) => {
      const previousParcours = queryClient.getQueryData<Ue[]>([
        "parcours",
      ])
      queryClient.setQueryData<Ue[]>(["parcours"], (old) => {
        return old?.filter((parcours) => parcours.id !== id)
      })
      return { previousParcours }
    },
  })
}
