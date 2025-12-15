import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
// CHANGEMENT 1 : Importer le type spécifique à Etudiant
import type { Etudiant } from "../types" 

// CHANGEMENT 2 : Nommer le hook pour l'entité Etudiant
export const useDeleteEtudiant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    // CHANGEMENT 3 : La fonction de mutation reste simple (suppression par ID)
    mutationFn: async (id: number): Promise<void> => {
      // CHANGEMENT 4 : Pointer vers le bon endpoint API
      const response = await apiFetch(`/etudiants/${id}`, { 
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Échec de la suppression de l'étudiant.")
      }
    },
    
    // La logique onSuccess utilise l'approche de mise à jour optimiste du cache
    // CHANGEMENT 5 : Utiliser la clé de requête ["etudiants"] et le type Etudiant
    onSuccess: (_, id) => {
      const previousEtudiants = queryClient.getQueryData<Etudiant[]>(["etudiants"])

      // Mettre à jour le cache localement : retirer l'étudiant de la liste
      queryClient.setQueryData<Etudiant[]>(["etudiants"], (old) => {
        // CHANGEMENT 6 : Filtrer l'étudiant par son ID
        return old?.filter((etudiant) => etudiant.id !== id) 
      })

      // Renvoyer les données précédentes (pour un éventuel rollback en cas d'erreur)
      return { previousEtudiants }
    },
    
    // Optionnel : Si vous aviez un contexte d'erreur global, vous feriez un rollback ici
    /*
    onError: (err, id, context) => {
        if (context?.previousEtudiants) {
            queryClient.setQueryData(['etudiants'], context.previousEtudiants)
        }
    }
    */
  })
}