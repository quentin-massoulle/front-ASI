import { Table } from "@/components/ui/Table"
import { Pen, Trash } from "lucide-react"

import { useState } from "react"
import { UeFormModal } from "./components/UeFormModal"
import { useListeUe , useDeleteUe} from "./hooks"
import type { Ue } from "./types"

export const UePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUe, setEditingUe] = useState<Ue | null>(null)

  const { data: ue  } = useListeUe()
  const deleteUeMutation = useDeleteUe()

  const handleOpenCreate = () => {
    setEditingUe(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (ue: Ue) => {
    setEditingUe(ue)
    setModalOpen(true)
  }

  const handleDelete = (ue: Ue) => {
    if (confirm(`Supprimer l'ue "${ue.intitule}" ?`)) {
      deleteUeMutation.mutate(ue.id)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingUe(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={handleOpenCreate}
          className="bg-gray-800 p-2 rounded-lg text-white"
        >
          Ajouter une UE
        </button>
      </div>

      <Table
        data={ue}
        columns={[
          { key: "intitule", label: "intituler" },
          { key: "numeroUe", label: "Numero" },
          {
            key: "actions",
            label: "Actions",
            render: (row: Ue) => (
              <>
                <div className="space-x-4">
                  <button onClick={() => handleOpenEdit(row)}>
                    <Pen className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleDelete(row)}>
                    <Trash className="w-6 h-6" />
                  </button>
                </div>
              </>
            ),
          },
        ]}
      />

      <UeFormModal
        isOpen={modalOpen}
        editingUE={editingUe}
        onClose={handleCloseModal}
        // Pourquoi mettre une key ici est utile ?
        key={editingUe?.id ?? "create"}
      />
    </div>
  )
}
