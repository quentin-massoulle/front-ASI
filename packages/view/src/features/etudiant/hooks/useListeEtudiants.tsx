import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
// CHANGEMENT 1 : Importer le type spécifique à Etudiant
import type { Etudiant } from "../types" 

// CHANGEMENT 2 : Nommer le hook pour l'entité Etudiant
export const useListeEtudiants = () => {
  return useQuery({
    // CHANGEMENT 3 : Clé de requête pour le cache de la liste des étudiants
    queryKey: ["etudiants"],
    
    // CHANGEMENT 4 : Définir le type de retour comme un tableau d'Etudiant
    queryFn: async (): Promise<Etudiant[]> => {
      // CHANGEMENT 5 : Pointer vers le bon endpoint API
      const response = await apiFetch("/etudiants", { 
        method: "GET",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Échec de la récupération des étudiants.")
      }
      
      // CHANGEMENT 6 : S'assurer que le JSON retourné est bien un tableau d'Etudiant
      // Note: Si votre API renvoie un objet de pagination, ajustez ce type de retour.
      return response.json() as Promise<Etudiant[]> 
    },
  })
}