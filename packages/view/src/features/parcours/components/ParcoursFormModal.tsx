import { Input } from "@/components/ui/Input"
import { InputSelect } from "@/components/ui/InputSelect"
import { Modal } from "@/components/ui/Modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useCreateParcours } from "../hooks/useCreateParcours"
import { useUpdateParcours } from "../hooks/useUpdateParcours"
import type { Parcours } from "../types"
import { Button } from "@/components/ui/Button"

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

const schema = z.object({
  nomParcours: z.string()
    .min(1, { message: "Le nom du parcours est requis" })
    .max(30, {message: 'le nom du parcour est trop long'})
  ,
  anneeFormation: z
    .string()
    .min(1, {
      message: "Doit être premier ou deuxième année",
    })
    .max(2, {
      message: "Doit être premier ou deuxième année",
    }),
})

export const ParcoursFormModal: React.FC<ParcoursFormModalProps> = ({
  isOpen,
  editingParcours,
  onClose,
}) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: editingParcours
      ? {
          id: editingParcours.id,
          nomParcours: editingParcours.nomParcours,
          anneeFormation: String(editingParcours.anneeFormation),
        }
      : {
          anneeFormation: "1",
          nomParcours: "",
        },
  })

  const createParcourseMutation = useCreateParcours()
  const updateParcourseMutation = useUpdateParcours()

  const isEditing = Boolean(editingParcours)
  const isLoading =
    createParcourseMutation.isPending || updateParcourseMutation.isPending

  const submitForm = async (formState: FormState) => {
    if (editingParcours?.id) {
      await updateParcourseMutation.mutateAsync(
        {
          id: editingParcours?.id,
          payload: {
            nomParcours: formState.nomParcours,
            anneeFormation: parseInt(formState.anneeFormation, 10),
          },
        },
        {
          onSuccess: () => {
            reset()
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
          anneeFormation: parseInt(formState.anneeFormation, 10),
        },
        {
          onSuccess: () => {
            reset()
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
      <form onSubmit={handleSubmit(submitForm)}>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Modifier un parcours" : "Ajouter un parcours"}
        </h2>
        <Input
          label="Nom du parcours"
          control={control}
          name="nomParcours"
          type="string"
        />

        <InputSelect
          label="Année"
          options={[
            { value: "1", label: "1ère année" },
            { value: "2", label: "2ème année" },
          ]}
          control={control}
          name="anneeFormation"
        />
        <div className="flex justify-end space-x-2 mt-2">
          <Button onClick={onClose} disabled={isLoading} variant="ghost">
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading} variant="secondary" >
            {isLoading
              ? isEditing
                ? "Modification..."
                : "Création..."
              : isEditing
              ? "Modifier"
              : "Créer"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
