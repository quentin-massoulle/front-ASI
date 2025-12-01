import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Ue, UpdateParcoursPayload } from "../types"

interface UpdateParcoursResponse {
  message: string;
  parcours: Ue;
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
    }): Promise<Ue> => {
      const response = await apiFetch(`/ue/${id}`, {
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
      queryClient.setQueryData<Ue[]>(["ue"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((parcours) =>
          parcours.id === updatedParcours.id ? updatedParcours : parcours
        )
      })
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["ue"] })

      const previousUe = queryClient.getQueryData<Ue[]>([
        "ue",
      ])
      queryClient.setQueryData<Ue[]>(["ue"], (oldData) => {
        if (!oldData) return oldData
        return oldData.map((ue) =>
          ue.id === id ? { ...ue, ...payload } : ue
        )
      })
      return { previousUe }
    },
  })
}
