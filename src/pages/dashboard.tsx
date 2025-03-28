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

  const fetchAndUpdateRoulettes = async (authToken: string) => {
    try {
      const data = await fetchRoulettes(10, 0, authToken);
      setRouletteList1(data.data);
    } catch (error) {
      console.error("Error fetching roulettes", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      login(storedToken);
      fetchAndUpdateRoulettes(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAndUpdateRoulettes(token);
    }
  }, [token]);

  const handleLogout = () => {
    logout();
  };

  const handleLoginSuccess = (newToken: string) => {
    login(newToken);
    fetchAndUpdateRoulettes(newToken);
  };

  return (
    <>
      <div className="sticky top-0 z-50 border-b-2 py-4 px-8 backdrop-blur-sm">
        <header className="flex justify-end">
          {isLogged && <Button onClick={handleLogout}>Logout</Button>}
        </header>
      </div>

      <div className="container flex justify-center items-start h-auto pt-16">
        {isLogged ? (
          <div className="flex flex-col justify-center items-end gap-5 w-full">
            <RoletaForm
              isOpenForm={isOpenForm}
              setIsOpenForm={setIsOpenForm}
              editData={editData?.data}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              setEditData={setEditData}
              fetchAndUpdateRoulettes={() => fetchAndUpdateRoulettes(token!)}
            />
            <div className="w-full max-w-[100vw]">
              <RouletteList
                setIsOpenForm={setIsOpenForm}
                setEditData={setEditData}
                setIsEditMode={setIsEditMode}
                rouletteList={rouletteList1}
                setRouletteList={setRouletteList1}
              />
            </div>
          </div>
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </>
  );
}
