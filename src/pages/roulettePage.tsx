import { Roulette } from "@/components/roulette";
import { fetchRouletteBySlug } from "@/service/roulette";
import { RouletteSlugResponse } from "@/types/rouletteslug.type";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RoulettePage() {
  const { url } = useParams();


  const [roulleteData, setRoulleteData] = useState<RouletteSlugResponse>();

  useEffect(() => {
    if (roulleteData?.data.favicon) {
      const link =
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      (link as HTMLLinkElement).href = roulleteData?.data.favicon;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [roulleteData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rouletteData = await fetchRouletteBySlug(url ?? "");

        return setRoulleteData(rouletteData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [url]);

  return (
    <div
      style={{
        backgroundColor: roulleteData?.data.customization.backgroundColor,
        backgroundImage: `url(${roulleteData?.data.customization.backgroundImage})`,
        backgroundPosition: "center",
      }}
      className="flex flex-col h-[100vh] justify-center bg-auto md:bg-cover bg-no-repeat "
    >
      <div className="w-full items-start p-3 fixed top-0 max-h-28">
        { roulleteData?.data.customization.logoImage &&
          <img
          className="max-h-20"
          src={roulleteData?.data.customization.logoImage}
          alt="logo"
          />
        }
      </div>
      <div
        className="flex flex-col"
       
      >
        <h1 className="text-4xl md:text-6xl text-center font-bold"
         style={{ color: roulleteData?.data.customization.colorTitle }}
        >
          {roulleteData?.data.customization.title.toUpperCase()}
        </h1>
        <p className="text-xl md:text-4xl text-center font-semibold" style={{color:roulleteData?.data.customization.colorDescription}}>
          {roulleteData?.data.customization.description}
        </p>
      </div>

      <div
        className="mt-4"
        style={{ color: roulleteData?.data.customization.colorTitle }}
      >
        {/* <p className="text-center font-semibold">Você tem {2} tentativas!</p> */}

        {roulleteData?.data.customization.roulette.options && (
          <Roulette
            slug={roulleteData?.data.slug}
            data={roulleteData?.data.customization.roulette.options}
            spinButton={roulleteData?.data.customization.spinButton}
          />
        )}
      </div>
    </div>
  );
}
