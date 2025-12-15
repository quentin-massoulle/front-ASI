import { Input } from "@/components/ui/Input"
// L'InputSelect n'est pas nécessaire ici, mais gardons l'import si jamais vous en avez besoin
// import { InputSelect } from "@/components/ui/InputSelect" 
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button" // Importez le Button
import { zodResolver } from "@hookform/resolvers/zod" // Pour la validation
import { useForm } from "react-hook-form" // Le hook de formulaire
import z from "zod" // Pour définir le schéma de validation
import { useCreateUe } from "../hooks/useCreateUe"
import { useUpdateParcours } from "../hooks/useUpdateUe"
// Suppression de useState et useEffect, car useForm gère l'état et le defaultValues
import type { Ue } from "../types"

// 1. Définir le type d'état basé sur le schéma Zod (sans l'ID optionnel)
type FormState = {
  intitule: string
  numeroUe: string
}

interface UeFormModalProps {
  isOpen: boolean
  editingUE?: Ue | null
  onClose: () => void
}

// 2. Définir le Schéma Zod pour la validation
const schema = z.object({
  intitule: z.string().min(1, { message: "L'intitulé de l'UE est requis" }),
  numeroUe: z.string().min(1, { message: "Le numéro de l'UE est requis" }),
  // Vous pourriez ajouter une validation plus spécifique pour le format '1-2, 1-7' ici si nécessaire
})

export const UeFormModal: React.FC<UeFormModalProps> = ({
  isOpen,
  editingUE, // Utilisé pour définir les valeurs par défaut
  onClose,
}) => {
  // 3. Initialiser useForm avec le resolver Zod et les defaultValues
  const { handleSubmit, control, reset } = useForm<FormState>({
    resolver: zodResolver(schema),
    defaultValues: editingUE
      ? {
          intitule: editingUE.intitule,
          numeroUe: editingUE.numeroUe,
        }
      : {
          intitule: "",
          numeroUe: "",
        },
  })

  const createUeseMutation = useCreateUe()
  const updateUEMutation = useUpdateParcours()

  // 4. Déterminer si l'on est en mode édition
  const isEditing = Boolean(editingUE)
  
  const isLoading =
    createUeseMutation.isPending || updateUEMutation.isPending

  // 5. La fonction de soumission gérée par handleSubmit
  const submitForm = async (formState: FormState) => {
    if (editingUE?.id) { // Utiliser editingUE pour la logique d'édition
      await updateUEMutation.mutateAsync(
        {
          id: editingUE.id, // L'ID vient de editingUE
          payload: {
            intitule: formState.intitule,
            numeroUe: formState.numeroUe,
          },
        },
        {
          onSuccess: () => {
            reset() // Réinitialise l'état du formulaire
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
            reset()
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
      {/* 6. Utiliser la balise <form> et handleSubmit de React Hook Form */}
      <form onSubmit={handleSubmit(submitForm)}>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Modifier une Ue" : "Ajouter une Ue"}
        </h2>

        <div className="space-y-4">
          {/* 7. Utiliser le composant <Input> en mode contrôlé par RHF */}
          <Input<FormState> // Ajoutez le type pour l'IntelliSense
            label="Intitulé de l'UE"
            control={control} // Passer l'objet de contrôle
            name="intitule" // Nom de champ correspondant au schéma Zod
            placeholder="Ex: Informatique, Droit..."
          />

          <Input<FormState>
            label="Numéro de l'UE"
            control={control}
            name="numeroUe"
            placeholder="1-2, 1-7"
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          {/* Bouton Annuler (utilise onClick et un variant de Button) */}
          <Button onClick={onClose} disabled={isLoading} variant="ghost">
            Annuler
          </Button>
          
          {/* Bouton Soumettre (utilise type="submit" et un variant de Button) */}
          <Button 
            type="submit" 
            disabled={isLoading}
            variant="secondary" // ou "default" selon le style souhaité
          >
            {isLoading
              ? (isEditing ? "Modification..." : "Création...")
              : (isEditing ? "Modifier" : "Créer")}
          </Button>
        </div>
      </form>
    </Modal>
  )
}