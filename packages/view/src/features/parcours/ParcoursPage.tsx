import { Input } from "@/components/ui/Input"
import { InputSelect } from "@/components/ui/InputSelect"
import { Modal } from "@/components/ui/Modal"
import { useState } from "react"
import { useCreateParcours } from "./hooks/useCreateParcours"

export const ParcoursPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    nomParcours: "",
    anneeFormation: "1",
  })

  const createParcourseMutation = useCreateParcours()

  const handleCreate = async () => {
    await createParcourseMutation.mutateAsync(
      {
        nomParcours: formData.nomParcours,
        anneeFormation: parseInt(formData.anneeFormation),
      },
      {
        onSuccess: () => {
          setFormData({
            nomParcours: "",
            anneeFormation: "1",
          })
          setCreateModalOpen(false)
        },
        onError: (error) => {
          alert(`Erreur lors de la création du parcours: ${error.message}`)
        },
      }
    )
  }

  const handleCancel = () => {
    setFormData({
      nomParcours: "",
      anneeFormation: "1",
    })
    setCreateModalOpen(false)
  }

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

      <Modal isOpen={createModalOpen} onClose={handleCancel}>
        <h2 className="text-xl font-bold mb-4">Ajouter un parcours</h2>
        <Input
          id="parcours-name"
          label="Nom du parcours"
          value={formData.nomParcours}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, nomParcours: e.target.value }))
          }
        />
        <InputSelect
          id="parcours-year"
          label="Année"
          options={[
            { value: "1", label: "1ère année" },
            { value: "2", label: "2ème année" },
          ]}
          value={formData.anneeFormation}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, anneeFormation: value }))
          }
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            disabled={createParcourseMutation.isPending}
            className="p-2 rounded-lg "
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={
              createParcourseMutation.isPending || !formData.nomParcours
            }
            className="bg-gray-800 hover:bg-gray-600 disabled:bg-gray-400 p-2 rounded-lg text-white"
          >
            {createParcourseMutation.isPending ? "Création..." : "Créer"}
          </button>
        </div>
      </Modal>
    </>
  )
}
