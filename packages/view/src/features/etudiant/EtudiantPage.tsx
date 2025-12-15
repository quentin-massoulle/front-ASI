import { Table } from "@/components/ui/Table"
import { Pen, Trash } from "lucide-react"
import { useState, useMemo } from "react" // 👈 AJOUT DE useMemo
import { EtudiantFormModal } from "./components/EtudiantFormModal" 
import { useListeEtudiants, useDeleteEtudiant } from "./hooks"
import type { Etudiant } from "./types" 
import type {  Parcours } from "../parcours/types" 
import { useListParcours } from "../parcours/hooks"; // 👈 IMPORT DU HOOK DE PARCOURS

// Si votre type Parcours n'est pas importé, décommentez l'interface ici
// interface Parcours { id: number; nomParcours: string; /* ... */ } 

export const EtudiantPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEtudiant, setEditingEtudiant] = useState<Etudiant | null>(null)

  // 1. Récupération des deux listes nécessaires
  const { data: etudiants, isLoading: isLoadingEtudiants } = useListeEtudiants()
  const { data: parcoursList, isLoading: isLoadingParcours } = useListParcours() // 👈 Appel du hook
  
  const deleteEtudiantMutation = useDeleteEtudiant()
  const isDeleting = deleteEtudiantMutation.isPending;

  // 2. Création de la carte de recherche optimisée (Lookup Map)
  // Permet de trouver le nom du parcours rapidement à partir de son ID.
  const parcoursLookup = useMemo(() => {
    if (!parcoursList) return {};
    
    return parcoursList.reduce((acc, parcours) => {
      // Clé: parcours.id, Valeur: l'objet Parcours
      acc[parcours.id] = parcours; 
      return acc;
    }, {} as Record<number, Parcours>); 
  }, [parcoursList]);


  // --- Fonctions de gestion (inchangées) ---
  const handleOpenCreate = () => {
    setEditingEtudiant(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (etudiant: Etudiant) => {
    setEditingEtudiant(etudiant)
    setModalOpen(true)
  }

  const handleDelete = (etudiant: Etudiant) => {
    if (confirm(`Supprimer l'étudiant "${etudiant.nom} ${etudiant.prenom}" ?`)) {
      deleteEtudiantMutation.mutate(etudiant.id)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingEtudiant(null)
  }
  
  // 3. Gestion de l'état de chargement
  if (isLoadingEtudiants || isLoadingParcours) {
    return <div className="text-center py-8 text-gray-500">Chargement des données...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={handleOpenCreate}
          className="bg-gray-800 p-2 rounded-lg text-white"
        >
          Ajouter un étudiant
        </button>
      </div>
        
      <Table
        data={etudiants}
        columns={[
          { key: "nom", label: "Nom" },
          { key: "prenom", label: "Prénom" },
          { key: "email", label: "Email" },
          
          // 4. Colonne affichant le NOM du Parcours
          {
            key: "parcours", 
            label: "Parcours Affecté",
            render: (row: Etudiant) => {
              // Recherche du parcours dans la carte lookup via l'ID de l'étudiant
              const parcours = row.parcours_id ? parcoursLookup[row.parcours_id] : null;

              return ( 
                <span className={!parcours ? "text-gray-500 italic" : ""}>
                  {/* Affichage du nom trouvé, ou "Non affecté" si l'ID est null ou non trouvé */}
                  {parcours?.nomParcours ?? "Non affecté"}
                </span>
              );
            },
          },
          
          {
            key: "actions",
            label: "Actions",
            render: (row: Etudiant) => ( 
              <div className="space-x-4">
                <button onClick={() => handleOpenEdit(row)} disabled={isDeleting}>
                  <Pen className="w-6 h-6" />
                </button>
                <button onClick={() => handleDelete(row)} disabled={isDeleting}>
                  <Trash className="w-6 h-6" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <EtudiantFormModal 
        isOpen={modalOpen}
        editingEtudiant={editingEtudiant} 
        onClose={handleCloseModal}
        key={editingEtudiant?.id ?? "create"}
      />
    </div>
  )
}