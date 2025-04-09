import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import {
  updateRoulette,
  updateRouletteCustomization,
  uploadFile,
  upsertRoulette,
  upsertRouletteCustomization,
} from "@/service/roulette";
import {
  PrizeOption,
  RouletteConfirmationDialog,
  RouletteForm1,
  RouletteForm2,
} from "@/types/Roulette";
import { RouletteSlugResponse, SlugData } from "@/types/rouletteslug.type";
import { mapToastType } from "@/utils/mapToastType";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  CopyPlus,
  Edit,
  Loader2,
  PlusCircle,
  Settings,
  Trash,
  Verified,
} from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";

interface RoletaFormProps {
  isOpenForm: boolean;
  setIsOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  editData: SlugData | undefined;
  isEditMode?: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setEditData: React.Dispatch<
    React.SetStateAction<RouletteSlugResponse | null>
  >;
  fetchAndUpdateRoulettes: () => Promise<void>;
}

const step1Schema = z.object({
  name: z.string().min(1, "Nome da Roleta é obrigatório"),
  url: z
    .string()
    .min(1, "URL inválida")
    .refine((s) => !/\s/.test(s), "Não é permitido espaço em branco!"),
});

const step2Schema = z.object({
  title: z.string().min(1, "Campo obrigatório"),
  colorTitle: z.string().optional(),
  description: z.string().min(1, "Campo obrigatório"),
  colorDescription: z.string().optional(),
  backgroundImage: z.any().optional(),
  logoImage: z.any().optional(),
  backgroundColor: z.string().optional(),
  spinButton: z.object({
    textColor: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
  }),
});

const confirmationDialogSchema = z.object({
  title: z.string().min(1, "Campo obrigatório"),
  titleColor: z.string().optional(),
  subtitle: z.string().min(1, "Campo obrigatório"),
  subtitleColor: z.string().optional(),
  description: z.string().min(1, "Campo obrigatório"),
  descriptionColor: z.string().optional(),
  buttonText: z.string().min(1, "Campo obrigatório"),
  buttonTextColor: z.string().optional(),
  buttonBackground: z.string().optional(),
  backgroundColor: z.string().optional(),
  backgroundImage: z.any().optional(),
  linkTo: z.string().min(1, "Campo obrigatório"),
});

const defaultValues = {
  title: "Roleta Premiada",
  roulette: {
    options: [
      {
        text: "Sem Prêmio",
        textColor: "#FFFFFF",       // White text for contrast on the vibrant red background
        background: "#E74C3C",        // Vibrant Red
        percentage: 12,
        confirmationDialog: {
          title: "Poxa, não foi dessa vez!",
          linkTo: "#",
          subtitle: "Não desista, tente novamente!",
          buttonText: "TENTAR NOVAMENTE",
          titleColor: "#E74C3C",     // Match the slice’s energetic red
          description: "Continue tentando para ganhar prêmios incríveis!",
          subtitleColor: "#E74C3C",
          backgroundColor: "#FFFFFF", // Clean white for clear readability
          backgroundImage:
            "https://img.freepik.com/premium-vector/pedestal-rewarding-winners-white-podium-platform-with-spotlights_257584-2320.jpg",
          buttonTextColor: "#FFFFFF",
          buttonBackground: "#C0392B", // A slightly darker red for button contrast
          descriptionColor: "#333333",
        },
      },
      {
        text: "10% OFF",
        textColor: "#FFFFFF",
        background: "#2ECC71",       // Vibrant Green
        percentage: 30,
        confirmationDialog: {
          title: "Parabéns!",
          linkTo: "#",
          subtitle: "Você ganhou 10% de desconto na sua próxima compra!",
          buttonText: "RESGATAR PRÊMIO",
          titleColor: "#2ECC71",
          description: "Use o código PREMIO10 no checkout.",
          subtitleColor: "#2ECC71",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "https://img.freepik.com/premium-vector/pedestal-rewarding-winners-white-podium-platform-with-spotlights_257584-2320.jpg",
          buttonTextColor: "#FFFFFF",
          buttonBackground: "#27AE60", // Slightly deeper green for emphasis
          descriptionColor: "#333333",
        },
      },
      {
        text: "25% OFF",
        textColor: "#FFFFFF",
        background: "#F39C12",       // Vibrant Orange
        percentage: 15,
        confirmationDialog: {
          title: "Parabéns!",
          linkTo: "#",
          subtitle: "Você ganhou 25% de desconto na sua próxima compra!",
          buttonText: "RESGATAR PRÊMIO",
          titleColor: "#F39C12",
          description: "Use o código PREMIO25 no checkout.",
          subtitleColor: "#F39C12",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "https://img.freepik.com/premium-vector/pedestal-rewarding-winners-white-podium-platform-with-spotlights_257584-2320.jpg",
          buttonTextColor: "#FFFFFF",
          buttonBackground: "#E67E22", // Deeper orange for button
          descriptionColor: "#333333",
        },
      },
      {
        text: "R$ 5,00",
        textColor: "#FFFFFF",
        background: "#3498DB",       // Vibrant Blue
        percentage: 20,
        confirmationDialog: {
          title: "Parabéns!",
          linkTo: "#",
          subtitle: "Você ganhou R$5,00 de crédito!",
          buttonText: "RESGATAR PRÊMIO",
          titleColor: "#3498DB",
          description: "Use o código CREDITO5 no checkout.",
          subtitleColor: "#3498DB",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "https://img.freepik.com/premium-vector/pedestal-rewarding-winners-white-podium-platform-with-spotlights_257584-2320.jpg",
          buttonTextColor: "#FFFFFF",
          buttonBackground: "#2980B9", // Darker blue for the button
          descriptionColor: "#333333",
        },
      },
      {
        text: "R$ 10,00",
        textColor: "#FFFFFF",
        background: "#9B59B6",       // Vibrant Purple
        percentage: 10,
        confirmationDialog: {
          title: "Parabéns!",
          linkTo: "#",
          subtitle: "Você ganhou R$10,00 de crédito!",
          buttonText: "RESGATAR PRÊMIO",
          titleColor: "#9B59B6",
          description: "Use o código CREDITO10 no checkout.",
          subtitleColor: "#9B59B6",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "https://img.freepik.com/premium-vector/pedestal-rewarding-winners-white-podium-platform-with-spotlights_257584-2320.jpg",
          buttonTextColor: "#FFFFFF",
          buttonBackground: "#8E44AD", // A slightly darker purple for contrast
          descriptionColor: "#333333",
        },
      },
      {
        text: "R$ 20,00",
        textColor: "#FFFFFF",
        background: "#FF1493",       // Vibrant Pink
        percentage: 5,
        confirmationDialog: {
          title: "Parabéns!",
          linkTo: "#",
          subtitle: "Você ganhou R$20,00 de crédito!",
          buttonText: "RESGATAR PRÊMIO",
          titleColor: "#FF1493",
          description: "Use o código CREDITO20 no checkout.",
          subtitleColor: "#FF1493",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "https://img.freepik.com/premium-vector/pedestal-rewarding-winners-white-podium-platform-with-spotlights_257584-2320.jpg",
          buttonTextColor: "#FFFFFF",
          buttonBackground: "#D81B60", // A richer pink for button emphasis
          descriptionColor: "#333333",
        },
      },
      {
        text: "FRETE GRÁTIS",
        textColor: "#FFFFFF",
        background: "#1ABC9C",       // Vibrant Cyan
        percentage: 8,
        confirmationDialog: {
          title: "Parabéns!",
          linkTo: "#",
          subtitle: "Você ganhou frete grátis para sua próxima compra!",
          buttonText: "RESGATAR PRÊMIO",
          titleColor: "#1ABC9C",
          description: "Use o código FRETEGRATIS no checkout.",
          subtitleColor: "#1ABC9C",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "https://img.freepik.com/premium-vector/pedestal-rewarding-winners-white-podium-platform-with-spotlights_257584-2320.jpg",
          buttonTextColor: "#FFFFFF",
          buttonBackground: "#16A085", // Slightly deeper cyan
          descriptionColor: "#333333",
        },
      },
      {
        text: "BRINDE SURPRESA",
        textColor: "#000000",       // Black text for readability on vibrant yellow
        background: "#FFD700",       // Vibrant gold/yellow
        percentage: 0.5,
        confirmationDialog: {
          title: "Parabéns!",
          linkTo: "#",
          subtitle: "Você ganhou um brinde surpresa!",
          buttonText: "RESGATAR PRÊMIO",
          titleColor: "#FFD700",
          description: "Use o código SURPRESA no checkout.",
          subtitleColor: "#FFD700",
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "https://img.freepik.com/premium-vector/pedestal-rewarding-winners-white-podium-platform-with-spotlights_257584-2320.jpg",
          buttonTextColor: "#000000",
          buttonBackground: "#FFC107", // A bold amber for the button
          descriptionColor: "#333333",
        },
      },
    ],
  },
  logoImage:
    "https://sdmntprwestus.oaiusercontent.com/files/00000000-8c98-6230-92a2-e60463118549/raw?se=2025-04-09T16%3A03%3A20Z&sp=r&sv=2024-08-04&sr=b&scid=c99201b7-59cb-5ae7-963c-b76708ccabcc&skoid=aa8389fc-fad7-4f8c-9921-3c583664d512&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-09T04%3A08%3A18Z&ske=2025-04-10T04%3A08%3A18Z&sks=b&skv=2024-08-04&sig=F4MLOpdWZJN93xDrQX4K1js5uzW/Fr5F2pGoG7ULDP8%3D",
  colorTitle: "#000000",
  spinButton: {
    text: "Girar Roleta",
    textColor: "#ffffff",
    background: "#E74C3C", // Matches the vibrant red of "Sem Prêmio"
  },
  description: "Gire a roleta e ganhe prêmios incríveis!",
  backgroundColor: "#FFFFFF",  // A fresh white backdrop
  backgroundImage:
    "https://t3.ftcdn.net/jpg/04/12/82/16/360_F_412821610_95RpjzPXCE2LiWGVShIUCGJSktkJQh6P.jpg",
  colorDescription: "#333333",
};


export function RoletaForm({
  isOpenForm,
  setIsOpenForm,
  editData,
  isEditMode,
  setIsEditMode,
  setEditData,
  fetchAndUpdateRoulettes,
}: RoletaFormProps) {
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [optionText, setOptionText] = useState("");
  const [optionColor, setOptionColor] = useState("#23b328");
  const [optionProbability, setOptionProbability] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState<number | null>(null);
  const [filledOptions, setFilledOptions] = useState<boolean[]>([]);
  const [faviconUrl, setFaviconUrl] = useState<string>(
    "https://cdn-icons-png.flaticon.com/512/4992/4992618.png",
  );
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("");
  const [logoImageUrl, setLogoImageUrl] = useState<string>("");
  const [confirmationBackgroundImageUrl, setConfirmationBackgroundImageUrl] =
    useState<string>("");

  const [step1Data, setStep1Data] = useState<RouletteForm1 | null>(null);
  const [step2Data, setStep2Data] = useState<RouletteForm2 | null>(
    defaultValues,
  );
  const [options, setOptions] = useState<PrizeOption[]>(
    defaultValues.roulette.options,
  );
  const [selectedOption, setSelectedOption] =
    useState<RouletteConfirmationDialog>();

  const [toastState, setToastState] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const { toast } = useToast();

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editProbability, setEditProbability] = useState("");
  const [editColor, setEditColor] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const step1Resolver = zodResolver(step1Schema);
  const step2Resolver = zodResolver(step2Schema);
  const confirmationDialogResolver = zodResolver(confirmationDialogSchema);

  const handleFileUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    setImageUrl: (url: string) => void,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadFile(file, token || "");
      if (imageUrl) {
        setImageUrl(imageUrl);
      }
    }
  };

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
    reset: resetStep1,
  } = useForm({
    resolver: step1Resolver,
  });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
    reset: resetStep2,
  } = useForm({
    resolver: step2Resolver,
  });

  const {
    register: registerDialog,
    handleSubmit: handleSubmitDialog,
    formState: { errors: errorsDialog },
    reset: resetDialog,
  } = useForm({
    resolver: confirmationDialogResolver,
  });

  useEffect(() => {
    if (isEditMode && editData) {
      setStep1Data({
        title: editData.title,
        slug: editData.slug,
        favicon: editData.favicon,
      });
      setStep2Data({
        title: editData.customization.title,
        colorTitle: editData.customization.colorTitle,
        description: editData.customization.description,
        colorDescription: editData.customization.colorDescription,
        backgroundImage: editData.customization.backgroundImage,
        logoImage: editData.customization.logoImage,
        backgroundColor: editData.customization.backgroundColor,
        roulette: editData.customization.roulette,
        spinButton: {
          textColor: editData.customization.spinButton.textColor,
          background: editData.customization.spinButton.background,
          text: editData.customization.spinButton.text,
        },
      });
      setOptions(editData.customization.roulette.options);
      setFilledOptions(
        editData.customization.roulette.options.map(
          (option) =>
            !!(
              option.confirmationDialog.title !== "Parabens!" &&
              option.confirmationDialog.subtitle !== "Você ganhou!" &&
              option.confirmationDialog.description !==
                "Clique no botão para resgatar seu prêmio!" &&
              option.confirmationDialog.buttonText !== "Resgatar" &&
              option.confirmationDialog.linkTo !== ""
            ),
        ),
      );
      resetStep1({
        name: editData.title,
        url: editData.slug,
        favicon: editData.favicon,
      });
      resetStep2({
        title: editData.customization.title,
        colorTitle: editData.customization.colorTitle,
        description: editData.customization.description,
        colorDescription: editData.customization.colorDescription,
        backgroundImage: editData.customization.backgroundImage,
        logoImage: editData.customization.logoImage,
        backgroundColor: editData.customization.backgroundColor,
        spinButton: {
          textColor: editData.customization.spinButton.textColor,
          background: editData.customization.spinButton.background,
          text: editData.customization.spinButton.text,
        },
      });
    }
  }, [editData, isEditMode, resetStep1, resetStep2]);

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  const addOption = () => {
    if (optionText.length > 0) {
      setOptions([
        ...options,
        {
          text: optionText,
          background: optionColor,
          percentage: Number(optionProbability),
          confirmationDialog: {
            title: "Parabens!",
            titleColor: "#3ddb45",
            subtitle: "Você ganhou!",
            subtitleColor: "#3ddb45",
            description: "Clique no botão para resgatar seu prêmio!",
            descriptionColor: "#3ddb45",
            buttonText: "Resgatar",
            buttonTextColor: "#fff",
            buttonBackground: "#388623",
            backgroundColor: "#524e4e",
            backgroundImage: "",
            linkTo: "",
          },
        },
      ]);
      setFilledOptions([...filledOptions, false]);
      setOptionText("");
      setOptionColor("#23b328");
      setOptionProbability("");
    }
  };

  const onSubmitStep1 = async (data: any) => {
    setStep1Data({
      title: data.name,
      slug: data.url,
      favicon: faviconUrl,
    });
    handleNextStep();
  };

  const onSubmitStep2 = async (data: any) => {
    setIsLoading(true);
    if (!step1Data) {
      console.error("Step 1 data is missing");
      setIsLoading(false);
      return;
    }

    const finalData = {
      title: data.title,
      colorTitle: data.colorTitle,
      description: data.description,
      colorDescription: data.colorDescription,
      backgroundImage: backgroundImageUrl,
      logoImage: logoImageUrl,
      backgroundColor: data.backgroundColor,
      spinButton: data.spinButton,
      roulette: {
        options: options.map((option) => ({
          text: option.text,
          percentage: option.percentage,
          background: option.background,
          confirmationDialog: option.confirmationDialog,
        })),
      },
    };

    try {
      if (isEditMode) {
        const response = await updateRoulette(
          editData?.slug ?? "",
          step1Data,
          token || "",
        );
        if (response.status === 200) {
          await updateRouletteCustomization(
            step1Data.slug,
            finalData,
            token || "",
          );
          setIsOpenForm(false);
          setToastState({
            message: "Roleta atualizada com sucesso!",
            type: "success",
          });
        } else {
          setToastState({
            message: `Erro atualizando roleta: ${
              response.data.message || response.status
            }`,
            type: "error",
          });
        }
      } else {
        const response = await upsertRoulette(step1Data, token || "");
        if (response.status === 201) {
          await upsertRouletteCustomization(
            step1Data.slug,
            finalData,
            token || "",
          );
          setIsOpenForm(false);
          setToastState({
            message: "Roleta adicionada com sucesso!",
            type: "success",
          });
        } else {
          setToastState({
            message: `Erro adicionando roleta: ${
              response.data.message || response.status
            }`,
            type: "error",
          });
        }
      }
      await fetchAndUpdateRoulettes();
    } catch (error: any) {
      console.error("Error creating or updating roulette", error);
      setToastState({ message: `Erro: ${error.message}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetDialog({
      title: "",
      titleColor: "",
      subtitle: "",
      subtitleColor: "",
      description: "",
      descriptionColor: "",
      buttonText: "",
      buttonTextColor: "",
      buttonBackground: "",
      backgroundColor: "",
      backgroundImage: "",
      linkTo: "",
    });
    setIsDialogOpen(null);
  };

  const handleOptionDialogSubmit = (index: number, data: any) => {
    const newOptions = [...options];
    newOptions[index].confirmationDialog = {
      ...data,
      backgroundImage: confirmationBackgroundImageUrl,
    };
    setOptions(newOptions);
    const newFilledOptions = [...filledOptions];
    newFilledOptions[index] = true;
    setFilledOptions(newFilledOptions);
    setIsDialogOpen(null);
    resetDialog({
      title: "",
      titleColor: "",
      subtitle: "",
      subtitleColor: "",
      description: "",
      descriptionColor: "",
      buttonText: "",
      buttonTextColor: "",
      buttonBackground: "",
      backgroundColor: "",
      backgroundImage: "",
      linkTo: "",
    });
    setIsOpenForm(true);
  };

  useEffect(() => {
    if (isEditMode) {
      if (step === 1) {
        if (step1Data?.favicon) setFaviconUrl(step1Data?.favicon);
        resetStep1(step1Data || {});
      }
      if (step === 2) {
        if (step2Data?.backgroundImage) {
          setBackgroundImageUrl(step2Data?.backgroundImage);
        }
        if (step2Data?.logoImage) {
          setLogoImageUrl(step2Data?.backgroundImage);
        }
        resetStep2(step2Data || {});
      }
    }
  }, [step, resetStep1, resetStep2, step1Data, step2Data, isEditMode]);

  const handleDuplicate = (index: number) => {
    const newOptions = [...options];
    const newOption = { ...options[index] };
    newOptions.splice(index + 1, 0, newOption);
    setOptions(newOptions);
    const newFilledOptions = [...filledOptions];
    newFilledOptions.splice(index + 1, 0, false);
    setFilledOptions(newFilledOptions);
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    const newFilledOptions = [...filledOptions];
    newFilledOptions.splice(index, 1);
    setFilledOptions(newFilledOptions);
  };

  const handleSettingsClick = (index: number) => {
    setIsDialogOpen(index);

    const confirmationOptionData = options[index]?.confirmationDialog;

    setSelectedOption(confirmationOptionData);

    if (confirmationOptionData) {
      resetDialog(confirmationOptionData);
    } else {
      resetDialog({
        title: "",
        titleColor: "",
        subtitle: "",
        subtitleColor: "",
        description: "",
        descriptionColor: "",
        buttonText: "",
        buttonTextColor: "",
        buttonBackground: "",
        backgroundColor: "",
        backgroundImage: "",
        linkTo: "",
      });
    }
  };

  const resetAll = () => {
    setEditData(null);

    resetStep1({
      name: "",
      url: "",
      favicon:
        "https://images.unsplash.com/photo-1596367407372-96cb88503db6?w=100&q=80",
    });

    resetStep2({
      title: defaultValues.title,
      colorTitle: defaultValues.colorTitle,
      description: defaultValues.description,
      colorDescription: defaultValues.colorDescription,
      backgroundImage: defaultValues.backgroundImage,
      logoImage: defaultValues.logoImage,
      backgroundColor: defaultValues.backgroundColor,
      spinButton: {
        textColor: defaultValues.spinButton.textColor,
        background: defaultValues.spinButton.background,
        text: defaultValues.spinButton.text,
      },
    });

    resetDialog({
      title: "",
      titleColor: "",
      subtitle: "",
      subtitleColor: "",
      description: "",
      descriptionColor: "",
      buttonText: "",
      buttonTextColor: "",
      buttonBackground: "",
      backgroundColor: "",
      backgroundImage: "",
      linkTo: "",
    });

    setFilledOptions([]);
    setConfirmationBackgroundImageUrl("");
    setLogoImageUrl(defaultValues.logoImage);
    setBackgroundImageUrl(defaultValues.backgroundImage);
    setFaviconUrl(
      "https://cdn-icons-png.flaticon.com/512/4992/4992618.png",
    );
    setStep1Data(null);
    setStep2Data(defaultValues);
    setOptions(defaultValues.roulette.options);
  };

  const draggingItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (position: number) => {
    draggingItem.current = position;
  };

  const handleDragEnter = (position: number) => {
    dragOverItem.current = position;
    const newOptions = [...options];
    const newFilledOptions = [...filledOptions];

    const draggingItemContent = newOptions[draggingItem.current!];
    const draggingFilledOption = newFilledOptions[draggingItem.current!];

    newOptions.splice(draggingItem.current!, 1);
    newFilledOptions.splice(draggingItem.current!, 1);

    newOptions.splice(position, 0, draggingItemContent);
    newFilledOptions.splice(position, 0, draggingFilledOption);

    draggingItem.current = position;
    setOptions(newOptions);
    setFilledOptions(newFilledOptions);
  };

  const startEditOption = (index: number) => {
    setEditIndex(index);
    setEditText(options[index].text);
    setEditProbability(options[index].percentage.toString());
    setEditColor(options[index].background);
  };

  const saveEditOption = () => {
    const updatedOptions = [...options];
    updatedOptions[editIndex!] = {
      ...updatedOptions[editIndex!],
      text: editText,
      percentage: Number(editProbability),
      background: editColor,
    };
    setOptions(updatedOptions);
    setEditIndex(null);
    setEditText("");
    setEditProbability("");
    setEditColor("");
  };

  useEffect(() => {
    if (toastState) {
      toast({
        title: toastState.message,
        variant: mapToastType(toastState.type),
      });
      setToastState(null);
    }
  }, [toastState, toast]);

  const [isGrabbing, setIsGrabbing] = useState(false);

  const handleMouseDown = () => {
    setIsGrabbing(true);
  };

  const handleMouseUp = () => {
    setIsGrabbing(false);
  };

  return (
    <>
      {isDialogOpen === null && (
        <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
          <Button
            onClick={() => {
              setStep(1);
              resetAll();
              setIsEditMode(false);
              setIsOpenForm(true);
            }}
            className=" text-white"
          >
            Adicionar roleta
          </Button>
          <DialogContent className="max-w-[100vw] sm:max-w-[625px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="">
                {isEditMode ? "Editar roleta" : "Criar nova roleta"}
              </DialogTitle>
              <DialogDescription>
                <p className="">
                  {isEditMode
                    ? "Edite sua roleta personalizada."
                    : "Crie sua nova roleta personalizada."}
                </p>
                <p className="">
                  Clique no botão para ir para os próximos passos.
                </p>
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={
                step === 1
                  ? handleSubmitStep1(onSubmitStep1)
                  : handleSubmitStep2(onSubmitStep2)
              }
            >
              <div className="flex flex-col gap-4 py-4">
                {step === 1 && (
                  <>
                    <div className="flex flex-col">
                      <Label htmlFor="name" className="mb-2">
                        Nome da Roleta
                      </Label>
                      <Input id="name" {...registerStep1("name")} />
                      {errorsStep1.name?.message && (
                        <p className="text-red-500">
                          {errorsStep1.name.message.toString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="url" className="mb-2">
                        URL da Roleta
                      </Label>
                      <Input id="url" {...registerStep1("url")} />
                      {errorsStep1.url?.message && (
                        <p className="text-red-500">
                          {errorsStep1.url.message.toString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="favicon" className="mb-2">
                        Fav Icon
                      </Label>
                      <Input
                        id="favicon"
                        type="file"
                        onChange={(e) => handleFileUpload(e, setFaviconUrl)}
                      />
                      {faviconUrl ? (
                        <a
                          key={step}
                          href={faviconUrl}
                          className="text-[0.7rem] cursor-pointer text-blue-900"
                          target="_blank"
                        >
                          {faviconUrl}
                        </a>
                      ) : (
                        <span className="text-red-500">
                          Favicon obrigatorio!
                        </span>
                      )}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="flex justify-between">
                      <div className="flex flex-col w-1/2">
                        <Label htmlFor="title" className="mb-2">
                          Título
                        </Label>
                        <Input
                          id="title"
                          placeholder="Roleta Feliz"
                          {...registerStep2("title")}
                        />
                        {errorsStep2.title?.message && (
                          <p className="text-red-500">
                            {errorsStep2.title.message.toString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <Label htmlFor="colorTitle" className="mb-2">
                          Cor do Título
                        </Label>
                        <Input
                          className="w-25 p-0 border-none cursor-pointer"
                          type="color"
                          id="colorTitle"
                          {...registerStep2("colorTitle")}
                        />
                        {errorsStep2.colorTitle?.message && (
                          <p className="text-red-500">
                            {errorsStep2.colorTitle.message.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col w-1/2">
                        <Label htmlFor="description" className="mb-2">
                          Descrição
                        </Label>
                        <Input
                          id="description"
                          placeholder="Venha ganhar prêmios incríveis!"
                          {...registerStep2("description")}
                        />
                        {errorsStep2.description?.message && (
                          <p className="text-red-500">
                            {errorsStep2.description.message.toString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <Label htmlFor="colorDescription" className="mb-2">
                          Cor da Descrição
                        </Label>
                        <Input
                          className="w-25 p-0 border-none cursor-pointer"
                          type="color"
                          id="colorDescription"
                          {...registerStep2("colorDescription")}
                        />
                        {errorsStep2.colorDescription?.message && (
                          <p className="text-red-500">
                            {errorsStep2.colorDescription.message.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full justify-between gap-5">
                      <div className="flex flex-col w-1/2">
                        <Label htmlFor="backgroundImage" className="mb-2">
                          Imagem de Fundo
                        </Label>
                        <Input
                          type="file"
                          id="backgroundImage"
                          onChange={(e) =>
                            handleFileUpload(e, setBackgroundImageUrl)
                          }
                        />
                        {(step2Data?.backgroundImage || backgroundImageUrl) && (
                          <a
                            key={step}
                            href={
                              step2Data?.backgroundImage || backgroundImageUrl
                            }
                            className="text-[0.7rem] cursor-pointer text-blue-900"
                            target="_blank"
                          >
                            {step2Data?.backgroundImage || backgroundImageUrl}
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <Label htmlFor="backgroundColor" className="mb-2">
                          Cor de Fundo
                        </Label>
                        <Input
                          className="w-25 p-0 border-none cursor-pointer"
                          type="color"
                          id="backgroundColor"
                          {...registerStep2("backgroundColor")}
                        />
                        {errorsStep2.backgroundColor?.message && (
                          <p className="text-red-500">
                            {errorsStep2.backgroundColor.message.toString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Label htmlFor="logoImage" className="mb-2">
                        Imagem da Logo
                      </Label>
                      <Input
                        type="file"
                        id="logoImage"
                        onChange={(e) => handleFileUpload(e, setLogoImageUrl)}
                      />
                      {(step2Data?.logoImage || logoImageUrl) && (
                        <a
                          key={step}
                          href={step2Data?.logoImage || logoImageUrl}
                          className="text-[0.7rem] cursor-pointer text-blue-900"
                          target="_blank"
                        >
                          {step2Data?.logoImage || logoImageUrl}
                        </a>
                      )}
                    </div>

                    <div className="flex w-full justify-between">
                      <div className="flex flex-col w-1/2">
                        <Label htmlFor="spinButtonText" className="mb-2">
                          Botão de rodar
                        </Label>
                        <Input
                          id="spinButtonText"
                          placeholder="Girar"
                          {...registerStep2("spinButton.text")}
                        />
                      </div>
                      <div className="flex gap-5">
                        <div className="flex flex-col items-end">
                          <Label htmlFor="spinButtonTextColor" className="mb-2">
                            Cor do Texto
                          </Label>
                          <Input
                            className="w-25 p-0 border-none cursor-pointer"
                            type="color"
                            id="spinButtonTextColor"
                            {...registerStep2("spinButton.textColor")}
                          />
                        </div>
                        <div className="flex flex-col items-end">
                          <Label
                            htmlFor="spinButtonBackground"
                            className="mb-2"
                          >
                            Cor de Fundo
                          </Label>
                          <Input
                            className="w-25 p-0 border-none cursor-pointer"
                            type="color"
                            id="spinButtonBackground"
                            {...registerStep2("spinButton.background")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex w-full gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <Label htmlFor="optionText" className="mb-2">
                            Opções da Roleta
                          </Label>
                          <Input
                            id="optionText"
                            value={editIndex !== null ? editText : optionText}
                            onChange={(e) =>
                              editIndex !== null
                                ? setEditText(e.target.value)
                                : setOptionText(e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                          <Label htmlFor="probability" className="mb-2">
                            Probabilidade
                          </Label>
                          <Input
                            className={`${errorsStep2.probability ? "border-red-600" : ""}`}
                            id="probability"
                            value={
                              editIndex !== null
                                ? editProbability
                                : optionProbability
                            }
                            onChange={(e) =>
                              editIndex !== null
                                ? setEditProbability(e.target.value)
                                : setOptionProbability(e.target.value)
                            }
                          />
                        </div>
                        <div className="flex flex-col min-w-max items-end">
                          <Label htmlFor="corOption" className="mb-2">
                            Cor da Opção
                          </Label>
                          <Input
                            className="w-25 p-0 border-none cursor-pointer"
                            type="color"
                            id="corOption"
                            value={editIndex !== null ? editColor : optionColor}
                            onChange={(e) =>
                              editIndex !== null
                                ? setEditColor(e.target.value)
                                : setOptionColor(e.target.value)
                            }
                          />
                        </div>
                        <PlusCircle
                          className="cursor-pointer"
                          size={50}
                          onClick={
                            editIndex !== null ? saveEditOption : addOption
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 max-h-52 overflow-auto cursor-pointer cursor-grab">
                      {options.map((option, index) => (
                        <div key={option.text}>
                          <div
                            className={`flex items-center justify-between ${isGrabbing ? "cursor-grabbing" : "cursor-grab"}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={() => {
                              draggingItem.current = null;
                              handleMouseUp();
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                          >
                            <div className="flex flex-col">
                              <div className="flex gap-2 items-center">
                                <h3 className="text-sm">{`Item ${index + 1}:`}</h3>
                                <h3 className="font-semibold">{option.text}</h3>
                              </div>
                              <div className="flex gap-2 items-center">
                                <h3 className="text-sm">Probabilidade:</h3>
                                <h3 className="font-semibold">
                                  {option.percentage}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm">Cor:</h3>
                                <div
                                  className="w-4 h-4 mr-2 border"
                                  style={{ backgroundColor: option.background }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => startEditOption(index)}
                              >
                                <Edit />
                              </Button>
                              <div className="m-2">
                                {filledOptions[index] ? (
                                  <Verified size={20} color="#00ff00" />
                                ) : (
                                  <AlertCircleIcon
                                    size={20}
                                    color="#e6b01bdb"
                                  />
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => handleDuplicate(index)}
                              >
                                <CopyPlus />
                              </Button>
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => handleSettingsClick(index)}
                              >
                                <Settings />
                              </Button>
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => handleDeleteOption(index)}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <DialogFooter className="gap-y-2">
                {step > 1 && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handlePreviousStep}
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className=" "
                >
                  {isLoading ? (
                    <Loader2 className="h-[100%] w-[100%] animate-spin" />
                  ) : step < 2 ? (
                    "Próximo"
                  ) : (
                    "Finalizar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {isDialogOpen !== null && (
        <Dialog
          open={isDialogOpen !== null}
          onOpenChange={() => {
            setIsOpenForm(true);
            setIsDialogOpen(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar Confirmação</DialogTitle>
            </DialogHeader>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmitDialog((data) =>
                handleOptionDialogSubmit(isDialogOpen, data),
              )}
            >
              <div className="flex justify-between">
                <div className="flex flex-col w-1/2">
                  <Label htmlFor="title" className="mb-2">
                    Título
                  </Label>
                  <Input id="title" {...registerDialog("title")} />
                  {errorsDialog.title?.message && (
                    <p className="text-red-500">
                      {errorsDialog.title.message.toString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <Label htmlFor="titleColor" className="mb-2">
                    Cor do Título
                  </Label>
                  <Input
                    className="w-25 p-0 border-none cursor-pointer"
                    type="color"
                    id="titleColor"
                    {...registerDialog("titleColor")}
                  />
                  {errorsDialog.titleColor?.message && (
                    <p className="text-red-500">
                      {errorsDialog.titleColor.message.toString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col w-1/2">
                  <Label htmlFor="subtitle" className="mb-2">
                    Subtítulo
                  </Label>
                  <Input id="subtitle" {...registerDialog("subtitle")} />
                  {errorsDialog.subtitle?.message && (
                    <p className="text-red-500">
                      {errorsDialog.subtitle.message.toString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <Label htmlFor="subtitleColor" className="mb-2">
                    Cor do Subtítulo
                  </Label>
                  <Input
                    className="w-25 p-0 border-none cursor-pointer"
                    type="color"
                    id="subtitleColor"
                    {...registerDialog("subtitleColor")}
                  />
                  {errorsDialog.subtitleColor?.message && (
                    <p className="text-red-500">
                      {errorsDialog.subtitleColor.message.toString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col w-1/2">
                  <Label htmlFor="description" className="mb-2">
                    Descrição
                  </Label>
                  <Input id="description" {...registerDialog("description")} />
                  {errorsDialog.description?.message && (
                    <p className="text-red-500">
                      {errorsDialog.description.message.toString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <Label htmlFor="descriptionColor" className="mb-2">
                    Cor da Descrição
                  </Label>
                  <Input
                    className="w-25 p-0 border-none cursor-pointer"
                    type="color"
                    id="descriptionColor"
                    {...registerDialog("descriptionColor")}
                  />
                  {errorsDialog.descriptionColor?.message && (
                    <p className="text-red-500">
                      {errorsDialog.descriptionColor.message.toString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col w-1/2">
                  <Label htmlFor="buttonText" className="mb-2">
                    Texto do Botão
                  </Label>
                  <Input id="buttonText" {...registerDialog("buttonText")} />
                  {errorsDialog.buttonText?.message && (
                    <p className="text-red-500">
                      {errorsDialog.buttonText.message.toString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <Label htmlFor="buttonTextColor" className="mb-2">
                    Cor do Texto do Botão
                  </Label>
                  <Input
                    className="w-25 p-0 border-none cursor-pointer"
                    type="color"
                    id="buttonTextColor"
                    {...registerDialog("buttonTextColor")}
                  />
                  {errorsDialog.buttonTextColor?.message && (
                    <p className="text-red-500">
                      {errorsDialog.buttonTextColor.message.toString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-5">
                <div className="flex flex-col">
                  <Label htmlFor="buttonBackground" className="mb-2">
                    Cor do Botão
                  </Label>
                  <Input
                    className="w-25 p-0 border-none cursor-pointer"
                    type="color"
                    id="buttonBackground"
                    {...registerDialog("buttonBackground")}
                  />
                  {errorsDialog.buttonBackground?.message && (
                    <p className="text-red-500">
                      {errorsDialog.buttonBackground.message.toString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="backgroundColor" className="mb-2">
                    Cor de Fundo
                  </Label>
                  <Input
                    className="w-25 p-0 border-none cursor-pointer"
                    type="color"
                    id="backgroundColor"
                    {...registerDialog("backgroundColor")}
                  />
                  {errorsDialog.backgroundColor?.message && (
                    <p className="text-red-500">
                      {errorsDialog.backgroundColor.message.toString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="backgroundImage" className="mb-2">
                  Imagem de Fundo
                </Label>
                <Input
                  type="file"
                  id="backgroundImage"
                  onChange={(e) =>
                    handleFileUpload(e, setConfirmationBackgroundImageUrl)
                  }
                />
                {(selectedOption?.backgroundImage ||
                  confirmationBackgroundImageUrl) && (
                  <a
                    key={step}
                    href={
                      selectedOption?.backgroundImage ||
                      confirmationBackgroundImageUrl
                    }
                    className="text-[0.7rem] cursor-pointer text-blue-900"
                    target="_blank"
                  >
                    {selectedOption?.backgroundImage ||
                      confirmationBackgroundImageUrl}
                  </a>
                )}
              </div>
              <div className="flex flex-col">
                <Label htmlFor="linkTo" className="mb-2">
                  Link
                </Label>
                <Input id="linkTo" {...registerDialog("linkTo")} />
                {errorsDialog.linkTo?.message && (
                  <p className="text-red-500">
                    {errorsDialog.linkTo.message.toString()}
                  </p>
                )}
              </div>
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
