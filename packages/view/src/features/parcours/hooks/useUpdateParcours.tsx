import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Parcours, UpdateParcoursPayload } from "../types"

interface UpdateParcoursResponse {
  message: string;
  parcours: Parcours;
}

export const useUpdateParcours = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateParcoursPayload;
    }): Promise<Parcours> => {
      const response = await apiFetch(`/parcours/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update parcours")
      }

      const data = (await response.json()) as UpdateParcoursResponse
      return data.parcours
    },
    onSuccess: (updatedParcours) => {
      queryClient.setQueryData<Parcours[]>(["parcours"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((parcours) =>
          parcours.id === updatedParcours.id ? updatedParcours : parcours
        )
      })
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["parcours"] })

      const previousParcours = queryClient.getQueryData<Parcours[]>([
        "parcours",
      ])
      queryClient.setQueryData<Parcours[]>(["parcours"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((parcours) =>
          parcours.id === id ? { ...parcours, ...payload } : parcours
        )
      })
      return { previousParcours }
    },
  })
}
