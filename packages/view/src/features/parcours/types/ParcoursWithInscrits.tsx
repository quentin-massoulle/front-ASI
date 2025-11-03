import type { Parcours } from "./Parcours";
export interface ParcoursWithInscrits extends Parcours {
  inscrits: Array<{
    id: number;
    nom: string;
    prenom: string;
    email: string;
  }>;
}
