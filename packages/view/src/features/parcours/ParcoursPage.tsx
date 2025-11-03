import { Input } from "@/components/ui/Input"
import { InputSelect } from "@/components/ui/InputSelect"
import { Modal } from "@/components/ui/Modal"
import { useState } from "react"

export const ParcoursPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-gray-800 p-2 rounded-lg text-white"
        >
          Ajouter un parcours
        </button>
      </div>

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Ajouter un parcours</h2>
        <Input id="parcours-name" label="Nom du parcours" />
        <InputSelect
          id="parcours-year"
          label="Année"
          options={[
            { value: "1", label: "1ère année" },
            { value: "2", label: "2ème année" },
          ]}
          value="1"
          onChange={() => {}}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setCreateModalOpen(false)}
            className="p-2 rounded-lg "
          >
            Annuler
          </button>
          <button
            onClick={() => setCreateModalOpen(false)}
            className="bg-gray-800 hover:bg-gray-600 p-2 rounded-lg text-white"
          >
            Créer
          </button>
        </div>
      </Modal>
    </>
  )
}
