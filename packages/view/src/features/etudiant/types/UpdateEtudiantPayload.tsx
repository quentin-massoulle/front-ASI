export interface UpdateEtudiantPayload {
  nom?: string;
  prenom?: string;
  email?: string;
  // L'ID du parcours peut être présent, absent, ou mis à null (pour désaffecter l'étudiant).
  parcours_id?: number | null; 
}