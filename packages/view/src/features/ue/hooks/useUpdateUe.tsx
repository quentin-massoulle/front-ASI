import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type { Ue, UpdateUePayload } from "../types"


export const useUpdateParcours = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateUePayload;
    }): Promise<Ue> => {
      const response = await apiFetch(`/ues/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update Ue")
      }

      const data = await response.json()
      
      // --- DEBUG ---
      // Regarde dans ta console ce que l'API renvoie vraiment
      console.log("Réponse API Update:", data) 
      // -------------

      // CORRECTION ICI :
      // Si data contient une propriété "Ue", on la retourne.
      // Sinon, si data contient directement l'id (c'est l'UE elle-même), on retourne data.
      if (data.Ue) {
        return data.Ue
      } else if (data.id) {
        return data as Ue
      } else {
        // Cas de secours : on retourne ce qu'on a envoyé combiné à l'ID
        // pour éviter que le onSuccess ne plante
        return { id, ...payload } as Ue
      }
    },

    onSuccess: (updatedUe) => {
      // SÉCURITÉ SUPPLÉMENTAIRE
      if (!updatedUe || !updatedUe.id) {
        console.error("Erreur: updatedUe est invalide", updatedUe)
        return 
      }

      queryClient.setQueryData<Ue[]>(["ues"], (oldData) => {
        if (!oldData) return []
        return oldData.map((ue) =>
          ue.id === updatedUe.id ? updatedUe : ue
        )
      })
           
    },

  })
}