export interface CreateEtudiantPayload {
  nom: string;
  prenom: string;
  email: string;
  parcours_id?: number | null; 
}