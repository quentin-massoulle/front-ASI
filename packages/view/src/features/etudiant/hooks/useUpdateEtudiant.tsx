import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
// CHANGEMENT 1 : Importer les types spécifiques à Etudiant
import type { Etudiant, UpdateEtudiantPayload } from "../types" 

// CHANGEMENT 2 : Nommer le hook pour la mise à jour de l'étudiant
export const useUpdateEtudiant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      // CHANGEMENT 3 : Utiliser le type UpdateEtudiantPayload
      payload: UpdateEtudiantPayload;
    // CHANGEMENT 4 : Promettre de retourner l'objet Etudiant mis à jour
    }): Promise<Etudiant> => {
      // CHANGEMENT 5 : Pointer vers le bon endpoint API
      const response = await apiFetch(`/etudiants/${id}`, {
        method: "PUT", // Utilisation de PUT pour la mise à jour complète
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Échec de la modification de l'étudiant")
      }

      const data = await response.json()
      
      // LOGIQUE DE RETOUR (Adaptée pour Etudiant)
      // Ceci est pour gérer les variations de réponse d'API (certaines renvoient {etudiant: {...}}, d'autres {...})
      if (data.etudiant) {
        return data.etudiant as Etudiant
      } else if (data.id) {
        return data as Etudiant
      } else {
        // Cas de secours (non recommandé) : renvoyer les données envoyées + l'ID
        return { id, ...payload } as Etudiant
      }
    },

    // CHANGEMENT 6 : Logique onSuccess pour mettre à jour le cache de la liste des étudiants
    onSuccess: (updatedEtudiant) => {
      // SÉCURITÉ
      if (!updatedEtudiant || !updatedEtudiant.id) {
        console.error("Erreur: updatedEtudiant est invalide", updatedEtudiant)
        return 
      }

      // Mise à jour de la liste ["etudiants"]
      // CHANGEMENT 7 : Cibler la clé ["etudiants"] et utiliser le type Etudiant
      queryClient.setQueryData<Etudiant[]>(["etudiants"], (oldData) => {
        if (!oldData) return []
        return oldData.map((etudiant) =>
          // Remplacer l'ancien objet par le nouveau si l'ID correspond
          etudiant.id === updatedEtudiant.id ? updatedEtudiant : etudiant
        )
      })
           
    },
    // Le hook est prêt à être utilisé
  })
}