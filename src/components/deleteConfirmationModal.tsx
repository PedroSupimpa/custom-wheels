import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

interface DeleteConfirmationModalProps {
  setConfirmationDelete: () => void;
}
  
export function DeleteConfirmationModal({ setConfirmationDelete }: DeleteConfirmationModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash
          size={20}
          className="cursor-pointer"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja excluir este item?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={setConfirmationDelete}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteConfirmationModal;
