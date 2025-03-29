import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RouletteConfirmationDialog } from "@/types/Roulette";

interface WinModalProps {
  onClose: () => void;
  prize: string | undefined;
  open: boolean;
  modalData: RouletteConfirmationDialog;
}

export function WinModal({ onClose, prize, open, modalData }: WinModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent
        style={{
          backgroundColor: modalData.backgroundColor,
          backgroundImage: `url(${modalData?.backgroundImage})`,
          backgroundSize: "cover",
        }}
      >
        <AlertDialogHeader className="gap-4">
          <AlertDialogTitle
            className="text-center text-4xl"
            style={{ color: modalData.titleColor }}
          >
            {modalData.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col text-center gap-4">
            <p style={{ color: modalData.subtitleColor }}>
              {modalData.subtitle}
            </p>
            <p style={{ color: modalData.descriptionColor }}>
              {modalData.description}
            </p>
            <p
              style={{ color: modalData.descriptionColor }}
              className="font-bold"
            >
              Prêmio: {prize}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="w-full"
            style={{
              backgroundColor: modalData.buttonBackground,
              color: modalData.buttonTextColor,
            }}
          >
            {modalData.buttonText}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
