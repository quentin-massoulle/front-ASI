import { Table } from "@/components/ui/Table"
import { Pen } from "lucide-react"
import { useState } from "react"
import { ParcoursFormModal } from "./components/ParcoursFormModal"
import { useListParcours } from "./hooks"

import type { Parcours } from "./types"

export const ParcoursPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingParcours, setEditingParcours] = useState<Parcours | null>(null)

  const { data: parcours } = useListParcours()

  const handleOpenCreate = () => {
    setEditingParcours(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (parcours: Parcours) => {
    setEditingParcours(parcours)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingParcours(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={handleOpenCreate}
          className="bg-gray-800 p-2 rounded-lg text-white"
        >
          Ajouter un parcours
        </button>
      </div>

      <Table
        data={parcours}
        columns={[
          { key: "nomParcours", label: "Nom" },
          { key: "anneeFormation", label: "Année" },
          {
            key: "actions",
            label: "Actions",
            render: (row: Parcours) => (
              <div className="space-x-4">
                <button onClick={() => handleOpenEdit(row)}>
                  <Pen className="w-6 h-6" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <ParcoursFormModal
        isOpen={modalOpen}
        editingParcours={editingParcours}
        onClose={handleCloseModal}
      />
    </div>
  )
}
