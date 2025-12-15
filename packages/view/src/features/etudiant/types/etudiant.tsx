import  type {Parcours} from '../../parcours/types/Parcours';

export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  parcours_id?: number | null;
  created_at: string;
  parcours?: Parcours | null;
}