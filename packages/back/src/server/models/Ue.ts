export interface Ue {
  id: number
  numeroUe: string
  intitule: string
  created_at: string
}

export interface CreateUePayload {
  numeroUe: string
  intitule: string
}

export interface UpdateUePayload {
  numeroUe?: string
  intitule?: string
}

export interface UeWithParcours extends Ue {
  enseigneeDans: Array<{
    id: number
    nomParcours: string
    anneeFormation: number
  }>
}
