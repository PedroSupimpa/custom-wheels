import { useAuth } from "@/context/AuthContext";
import { deleteRoulette, duplicateRoulette, fetchRouletteBySlug, fetchRouletteCustomization, fetchRoulettes } from "@/service/roulette";
import { RouletteForm1, RouletteForm2 } from "@/types/Roulette";
import { RouletteSlugResponse } from "@/types/rouletteslug.type";
import { mapToastType } from "@/utils/mapToastType";
import { CopyPlus, Link, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import DeleteConfirmationModal from "./deleteConfirmationModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useToast } from "./ui/use-toast";

interface RouletteListProps {
  setIsOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  setEditData: React.Dispatch<React.SetStateAction<RouletteSlugResponse | null>>;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  rouletteList: RouletteForm1[];
  setRouletteList: React.Dispatch<React.SetStateAction<RouletteForm1[]>>;
}



export function RouletteList({
  setIsOpenForm,
  setEditData,
  setIsEditMode,
  rouletteList,
  setRouletteList,
}: RouletteListProps) {
  const {  token } = useAuth();
  const [optionsList, setOptionsList] = useState<{ [key: string]: string[] }>({});
  const [toastState, setToastState] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const { toast } = useToast();

  const handleRemove = async (slug: string) => {
    try {
      await deleteRoulette(slug, token || "");
      const updatedRoulettes = await fetchRoulettes(10, 0, token || "");
      setRouletteList(updatedRoulettes.data);
      setToastState({ message: "Roleta deletada com sucesso!", type: 'success' });
    } catch (error) {
      setToastState({ message: "Erro deletando roleta", type: 'error' });
      console.error("Error deleting roulette", error);
    }
  };

  const handleDuplicate = async (slug: string) => {
    try{
      
       const result = await duplicateRoulette(slug, token || "")
       result.status === 201 ? setToastState({ message: "Roleta duplicada com sucesso!", type: 'success' }) : setToastState({ message: "Erro duplicando roleta", type: 'error' });
       const updatedRoulettes = await fetchRoulettes(10, 0, token || "");
        setRouletteList(updatedRoulettes.data);
    }catch(error){
      console.error("Error duplicating roulette", error);
      setToastState({ message: "Erro duplicando roleta", type: 'error' });
    }
  }

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(window.location.href + url);
      setToastState({ message: "URL copiado!", type: 'success' });
    } catch (err) {
      console.error("Failed to copy!", err);
      setToastState({ message: "Erro copiando url", type: 'error' });
    }
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

  const fetchCustomizationData = async (slug: string): Promise<string[]> => {
    const response = await fetchRouletteCustomization(slug);
    const data: RouletteForm2 = response.data;
    
    return data?.roulette?.options?.map(option => option.text);
  };


  useEffect(() => {
    const fetchAllCustomizations = async () => {
      const customizations: { [key: string]: string[] } = {};
      for (const roulette of rouletteList) {
        const texts = await fetchCustomizationData(roulette.slug);
        customizations[roulette.slug] = texts;
      }
      
      setOptionsList(customizations);
    };

    if (rouletteList.length > 0) {
      fetchAllCustomizations();
    }
  }, [rouletteList]);

  const handleEdit = async (slug: string) => {
    try {
      const data = await fetchRouletteBySlug(slug);
      if (data) {
        setEditData(data);
        setIsEditMode(true);
        setIsOpenForm(true);
      }
    } catch (error) {
      console.error("Error fetching roulette customization", error);
    }
  };

  const handleUrlSlug = (slug: string) => {
    const finalUrl = `${window.location.origin}/${slug}`;
    const a = document.createElement('a');
    a.href = finalUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Url</TableHead>
            <TableHead>Data de criação</TableHead>
            <TableHead>Lista de prêmios</TableHead>
            <TableHead>Opções</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rouletteList?.map((roulette, index) => (
            <TableRow key={index}>
              <TableCell>{roulette.title}</TableCell>
              <TableCell
                className="cursor-pointer"
                onClick={() => handleUrlSlug(roulette.slug)}
              >
                {`${window.location.origin}/${roulette.slug}`}
              </TableCell>
              <TableCell>{new Date().toLocaleDateString()}</TableCell>
              <TableCell>
                <ul>
                  {optionsList[roulette.slug]?.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>
                <div className="flex justify-evenly">
                  <CopyPlus 
                  size={20}
                  className="cursor-pointer"
                  onClick={()=> handleDuplicate(roulette.slug)}
                  />
                  <Pencil
                    size={20}
                    className="cursor-pointer"
                    onClick={() => handleEdit(roulette.slug)}
                  />
                  <Link
                    size={20}
                    onClick={() => handleCopy(roulette.slug)}
                    className="cursor-pointer"
                  />
                  <DeleteConfirmationModal
                    setConfirmationDelete={() => handleRemove(roulette.slug)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
