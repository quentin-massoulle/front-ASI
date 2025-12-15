import { Input } from "@/components/ui/Input"
import { InputSelect } from "@/components/ui/InputSelect" // Pour le champ parcours_id
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
// Hooks de mutation pour Etudiant
import { useCreateEtudiant, useUpdateEtudiant } from "../hooks" 
// Hook pour la liste des parcours
import { useListParcours } from '../../parcours/hooks' 
// Types
import type { Etudiant } from "../types"

// Définition de l'état du formulaire
type FormState = {
  nom: string
  prenom: string
  email: string
  parcours_id: string // L'ID du parcours est géré comme une chaîne (value de InputSelect)
}

interface EtudiantFormModalProps {
  isOpen: boolean
  editingEtudiant?: Etudiant | null 
  onClose: () => void
}

// Schéma Zod pour la validation
const schema = z.object({
  nom: z.string().trim().min(2, { message: "Le nom est requis." }).max(50, { message: "Nom trop long." }),
  prenom: z.string().trim().min(2, { message: "Le prénom est requis." }).max(50, { message: "Prénom trop long." }),
  email: z.string().trim().email({ message: "Email non valide." }),
  // Le parcours_id est toujours une chaîne (potentiellement vide)
  parcours_id: z.string().optional(),
})


export const EtudiantFormModal: React.FC<EtudiantFormModalProps> = ({
  isOpen,
  editingEtudiant, 
  onClose,
}) => {
  // Récupération de la liste des parcours pour le InputSelect
  const { data: parcoursOptions } = useListParcours() 

  // Formatage des options de parcours pour InputSelect
  const formattedParcoursOptions = parcoursOptions
    ? parcoursOptions.map(p => ({ value: String(p.id), label: p.nomParcours }))
    : []
  
  // 💡 LOGIQUE POUR DÉFINIR LA PREMIÈRE OPTION PAR DÉFAUT (si en mode création)
  const defaultParcoursId = formattedParcoursOptions.length > 0 
    ? formattedParcoursOptions[0].value 
    : ""

  const { handleSubmit, control, reset } = useForm<FormState>({
    resolver: zodResolver(schema),
    defaultValues: editingEtudiant
      ? {
          nom: editingEtudiant.nom,
          prenom: editingEtudiant.prenom,
          email: editingEtudiant.email,
          // Édition : Utilise l'ID existant ou une chaîne vide ("")
          parcours_id: editingEtudiant.parcours_id?.toString() || "", 
        }
      : {
          nom: "",
          prenom: "",
          email: "",
          // Création : Utilise la première option par défaut trouvée
          parcours_id: defaultParcoursId,
        },
  })

  const createEtudiantMutation = useCreateEtudiant()
  const updateEtudiantMutation = useUpdateEtudiant()

  const isEditing = Boolean(editingEtudiant)
  const isLoading =
    createEtudiantMutation.isPending || updateEtudiantMutation.isPending

  const submitForm = async (formState: FormState) => {
    // Préparer le payload en convertissant l'ID en nombre (ou null)
    const payload = {
      nom: formState.nom,
      prenom: formState.prenom,
      email: formState.email,
      // Si la chaîne n'est pas vide, convertit en nombre. Sinon, c'est null.
      parcours_id: formState.parcours_id ? parseInt(formState.parcours_id, 10) : null,
    }

    if (editingEtudiant?.id) {
      await updateEtudiantMutation.mutateAsync(
        {
          id: editingEtudiant.id,
          payload: payload,
        },
        {
          onSuccess: () => {
            reset()
            onClose()
          },
          onError: (error) => {
            alert(`Erreur lors de la modification de l'étudiant: ${error.message}`)
          },
        }
      )
    } else {
      await createEtudiantMutation.mutateAsync(
        payload as any, 
        {
          onSuccess: () => {
            reset()
            onClose()
          },
          onError: (error) => {
            alert(`Erreur lors de la création de l'étudiant: ${error.message}`)
          },
        }
      )
    }
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(submitForm)}>
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Modifier un étudiant" : "Ajouter un étudiant"}
        </h2>

        <div className="space-y-4">
          {/* Nom */}
          <Input<FormState>
            label="Nom"
            control={control}
            name="nom"
            placeholder="Ex: Dupont"
          />
          {/* Prénom */}
          <Input<FormState>
            label="Prénom"
            control={control}
            name="prenom"
            placeholder="Ex: Jean"
          />
          {/* Email */}
          <Input<FormState>
            label="Email"
            control={control}
            name="email"
            type="email"
            placeholder="ex: jean.dupont@example.com"
          />

          {/* InputSelect pour le Parcours */}
          <InputSelect<FormState>
            label="Parcours (Optionnel)"
            options={formattedParcoursOptions}
            control={control}
            name="parcours_id"
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button onClick={onClose} disabled={isLoading} variant="ghost">
            Annuler
          </Button>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            variant="secondary"
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