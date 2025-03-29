import { Login } from "@/components/login";
import { RoletaForm } from "@/components/roletaForm";
import { RouletteList } from "@/components/rouletteList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchRoulettes } from "@/service/roulette";
import { RouletteForm1 } from "@/types/Roulette";
import { RouletteSlugResponse } from "@/types/rouletteslug.type";
import { useEffect, useState } from "react";

export interface DataType {
  option: string;
  probability: number;
}

export default function Dashboard() {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [rouletteList1, setRouletteList1] = useState<RouletteForm1[]>([]);
  const [editData, setEditData] = useState<RouletteSlugResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { isLogged, token, login, logout } = useAuth();

  const fetchAndUpdateRoulettes = async () => {
    try {
      const data = await fetchRoulettes(100, 0, token || "");
      setRouletteList1(data.data);
    } catch (error) {
      console.error("Error fetching roulettes", error);
    }
  };

  useEffect(() => {
    if (isLogged && token) {
      fetchAndUpdateRoulettes();
    }
  }, [isLogged, token]);

  const handleLogout = () => {
    logout();
  };

  const handleLoginSuccess = (newToken: string) => {
    login(newToken);
  };

  return (
    <>
      <div className="sticky top-0 z-50 border-b-2 py-4 px-8 backdrop-blur-sm bg-white shadow-md">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1D3557]">Roleta Premiada</h1>
          {isLogged && (
            <Button
              onClick={handleLogout}
              className="bg-[#E63946] hover:bg-[#c62b37] text-white"
            >
              Logout
            </Button>
          )}
        </header>
      </div>

      <div className="container flex justify-center items-start h-auto pt-16 bg-[#F1FAEE] min-h-screen">
        {isLogged ? (
          <div className="flex flex-col justify-center items-end gap-5 w-full">
            <RoletaForm
              isOpenForm={isOpenForm}
              setIsOpenForm={setIsOpenForm}
              editData={editData?.data}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              setEditData={setEditData}
              fetchAndUpdateRoulettes={fetchAndUpdateRoulettes}
            />
            <div className="w-full max-w-[100vw]">
              <RouletteList
                setIsOpenForm={setIsOpenForm}
                setEditData={setEditData}
                setIsEditMode={setIsEditMode}
                rouletteList={rouletteList1}
                setRouletteList={setRouletteList1}
                fetchAndUpdateRoulettes={fetchAndUpdateRoulettes}
              />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-[#1D3557]">
                Bem-vindo à Roleta Premiada
              </h1>
              <p className="text-[#457B9D]">
                Crie e gerencie roletas personalizadas para suas promoções
              </p>
            </div>
            <Login onLoginSuccess={handleLoginSuccess} />
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Este é um projeto de demonstração. Você pode entrar com qualquer
                email e senha.
              </p>
              <p>Todas as roletas são salvas localmente no seu navegador.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
