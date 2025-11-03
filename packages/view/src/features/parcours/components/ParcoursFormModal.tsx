import { Input } from "@/components/ui/Input"
import { InputSelect } from "@/components/ui/InputSelect"
import { Modal } from "@/components/ui/Modal"
import { useCreateParcours } from "../hooks/useCreateParcours"
import { useUpdateParcours } from "../hooks/useUpdateParcours"
import { useState, useEffect } from "react"
import type { Parcours } from "../types"

type FormState = {
  id?: number
  nomParcours: string
  anneeFormation: string
}

interface ParcoursFormModalProps {
  isOpen: boolean
  editingParcours?: Parcours | null
  onClose: () => void
}

export const ParcoursFormModal: React.FC<ParcoursFormModalProps> = ({
  isOpen,
  editingParcours,
  onClose,
}) => {
  const [formState, setFormState] = useState<FormState>({
    nomParcours: "",
    anneeFormation: "1",
  })

  const createParcourseMutation = useCreateParcours()
  const updateParcourseMutation = useUpdateParcours()

  const isEditing = formState.id !== undefined
  const isLoading =
    createParcourseMutation.isPending || updateParcourseMutation.isPending

  useEffect(() => {
    if (isOpen) {
      if (editingParcours) {
        setFormState({
          id: editingParcours.id,
          nomParcours: editingParcours.nomParcours,
          anneeFormation: editingParcours.anneeFormation.toString(),
        })
      } else {
        setFormState({
          nomParcours: "",
          anneeFormation: "1",
        })
      }
    }
  }, [isOpen, editingParcours])

  const handleSubmit = async () => {
    if (isEditing && formState.id) {
      await updateParcourseMutation.mutateAsync(
        {
          id: formState.id,
          payload: {
            nomParcours: formState.nomParcours,
            anneeFormation: parseInt(formState.anneeFormation),
          },
        },
        {
          onSuccess: () => {
            onClose()
          },
          onError: (error) => {
            alert(
              `Erreur lors de la modification du parcours: ${error.message}`
            )
          },
        }
      )
    } else {
      await createParcourseMutation.mutateAsync(
        {
          nomParcours: formState.nomParcours,
          anneeFormation: parseInt(formState.anneeFormation),
        },
        {
          onSuccess: () => {
            onClose()
          },
          onError: (error) => {
            alert(`Erreur lors de la création du parcours: ${error.message}`)
          },
        }
      )
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Modifier un parcours" : "Ajouter un parcours"}
      </h2>
      <Input
        id="parcours-name"
        label="Nom du parcours"
        value={formState.nomParcours}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, nomParcours: e.target.value }))
        }
      />
      <InputSelect
        id="parcours-year"
        label="Année"
        options={[
          { value: "1", label: "1ère année" },
          { value: "2", label: "2ème année" },
        ]}
        value={formState.anneeFormation}
        onChange={(value) =>
          setFormState((prev) => ({ ...prev, anneeFormation: value }))
        }
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="p-2 rounded-lg "
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !formState.nomParcours}
          className="bg-gray-800 hover:bg-gray-600 disabled:bg-gray-400 p-2 rounded-lg text-white"
        >
          {isLoading
            ? isEditing
              ? "Modification..."
              : "Création..."
            : isEditing
            ? "Modifier"
            : "Créer"}
        </button>
      </div>
    </Modal>
  )
}
