import { Input } from "@/components/ui/Input"
import { Modal } from "@/components/ui/Modal"
import { useCreateUe } from "../hooks/useCreateUe"
import { useUpdateParcours } from "../hooks/useUpdateUe"
import { useState, useEffect } from "react"
import type { Ue } from "../types"

type FormState = {
  id?: number
  intitule: string
  numeroUe: number
}

interface UeFormModalProps {
  isOpen: boolean
  editingUE?: Ue | null
  onClose: () => void
}

export const UeFormModal: React.FC<UeFormModalProps> = ({
  isOpen,
  editingUE,
  onClose,
}) => {
  const [formState, setFormState] = useState<FormState>({
    intitule: "",
    numeroUe: 0,
  })

  const createUeseMutation = useCreateUe()
  const updateUEMutation = useUpdateParcours()

  const isEditing = formState.id !== undefined
  const isLoading =
    createUeseMutation.isPending || updateUEMutation.isPending

  useEffect(() => {
    if (isOpen) {
      if (editingUE) {
        setFormState({
          id: editingUE.id,
          intitule: editingUE.intitule,
          numeroUe: editingUE.numeroUe,
        })
      } else {
        setFormState({
          intitule: "",
          numeroUe: 0,
        })
      }
    }
  }, [isOpen, editingUE])

  const handleSubmit = async () => {
    if (isEditing && formState.id) {
      await updateUEMutation.mutateAsync(
        {
          id: formState.id,
          payload: {
            intitule: formState.intitule,
            numeroUe: formState.numeroUe,
          },
        },
        {
          onSuccess: () => {
            onClose()
          },
          onError: (error) => {
            alert(
              `Erreur lors de la modification de l'ue: ${error.message}`
            )
          },
        }
      )
    } else {
      await createUeseMutation.mutateAsync(
        {
          intitule: formState.intitule,
          numeroUe: formState.numeroUe,
        },
        {
          onSuccess: () => {
            onClose()
          },
          onError: (error) => {
            alert(`Erreur lors de la création d'une Ue: ${error.message}`)
          },
        }
      )
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? "Modifier une Ue" : "Ajouter une Ue"}
      </h2>

      <div className="space-y-4">
        <Input
          id="Ue-Intituler"
          label="Intituler de l'Ue"
          value={formState.intitule}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, intitule: e.target.value }))
          }
          placeholder="Ex: Informatique, Droit..."
        />

        <Input
          id="ue-numeroUe"
          label="Numero de L'ue"
          value={formState.numeroUe}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, numeroUe: parseInt(e.target.value) || 0 }))
          }
          placeholder="1-2,1-7"
        />
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !formState.intitule}
          className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed p-2 rounded-lg text-white transition-colors"
        >
          {isLoading
            ? (isEditing ? "Modification..." : "Création...")
            : (isEditing ? "Modifier" : "Créer")}
        </button>
      </div>
    </Modal>
  )
}