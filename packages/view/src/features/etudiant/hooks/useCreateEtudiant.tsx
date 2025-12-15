import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
// CHANGEMENT 1 : Importer les types spécifiques à Etudiant
import type { Etudiant, CreateEtudiantPayload } from "../types" 

// CHANGEMENT 2 : Définir l'interface de réponse attendue par l'API
// Assurez-vous que le nom de la propriété de l'objet créé est correct (ici, 'etudiant')
interface CreateEtudiantResponse {
  message: string;
  etudiant: Etudiant; // Supposons que l'API renvoie l'objet créé sous la clé 'etudiant'
}

// CHANGEMENT 3 : Nommer le hook pour l'entité Etudiant
export const useCreateEtudiant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    // CHANGEMENT 4 : Utiliser le type CreateEtudiantPayload
    mutationFn: async (payload: CreateEtudiantPayload): Promise<Etudiant> => {
      // CHANGEMENT 5 : Pointer vers le bon endpoint API
      const response = await apiFetch("/etudiants", { 
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        // Gérer les erreurs de manière claire
        throw new Error(error.error || "Échec de la création de l'étudiant.")
      }

      const data = (await response.json()) as CreateEtudiantResponse
      // CHANGEMENT 6 : Renvoyer l'objet Etudiant
      return data.etudiant
    },
    
    onSuccess: () => {
      // CHANGEMENT 7 : Invalider la requête de la liste des étudiants
      queryClient.invalidateQueries({ queryKey: ["etudiants"] })
    },
    // Vous pouvez aussi ajouter onSettled, onError, etc., si nécessaire
  })
}