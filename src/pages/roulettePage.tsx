import { Roulette } from "@/components/roulette";
import { fetchRouletteBySlug } from "@/service/roulette";
import { RouletteSlugResponse } from "@/types/rouletteslug.type";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function RoulettePage() {
  const { url } = useParams();
  const [rouletteData, setRouletteData] = useState<RouletteSlugResponse>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rouletteData?.data.favicon) {
      const link =
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      (link as HTMLLinkElement).href = rouletteData?.data.favicon;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [rouletteData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const rouletteData = await fetchRouletteBySlug(url ?? "");
        setRouletteData(rouletteData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "Roleta não encontrada. Verifique a URL ou crie uma nova roleta.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) {
    return (
      <div className="flex flex-col h-[100vh] justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-4 text-xl">Carregando roleta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[100vh] justify-center items-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Erro</h1>
          <p className="mb-6">{error}</p>
          <Link
            to="/"
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor:
          rouletteData?.data.customization.backgroundColor || "#f0f0f0",
        backgroundImage: rouletteData?.data.customization.backgroundImage
          ? `url(${rouletteData.data.customization.backgroundImage})`
          : "none",
        backgroundPosition: "center",
      }}
      className="flex flex-col h-[100vh] justify-center bg-auto md:bg-cover bg-no-repeat"
    >
      <div className="w-full items-start p-3 fixed top-0 max-h-28 flex justify-between">
        {rouletteData?.data.customization.logoImage && (
          <img
            className="max-h-20"
            src={rouletteData.data.customization.logoImage}
            alt="logo"
          />
        )}
        <Link
          to="/"
          className="bg-white/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-md hover:bg-white transition-colors"
        >
          Voltar ao Dashboard
        </Link>
      </div>

      <div className="flex flex-col my-8">
        <h1
          className="text-4xl md:text-6xl text-center font-bold px-4"
          style={{
            color: rouletteData?.data.customization.colorTitle || "#000",
          }}
        >
          {rouletteData?.data.customization.title.toUpperCase()}
        </h1>
        <p
          className="text-xl md:text-4xl text-center font-semibold mt-4 px-4"
          style={{
            color: rouletteData?.data.customization.colorDescription || "#333",
          }}
        >
          {rouletteData?.data.customization.description}
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        {rouletteData?.data.customization.roulette.options && (
          <Roulette
            slug={rouletteData.data.slug}
            data={rouletteData.data.customization.roulette.options}
            spinButton={rouletteData.data.customization.spinButton}
          />
        )}
      </div>
    </div>
  );
}
