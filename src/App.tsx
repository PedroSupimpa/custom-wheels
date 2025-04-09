import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import tempoRoutes from "tempo-routes";
import { Toaster } from "./components/ui/toaster";
import routes from "./routes/routes";

const App = () => {
  const elements = useRoutes(routes);

  const tempoElements = import.meta.env.VITE_TEMPO
    ? useRoutes(tempoRoutes)
    : null;

  return (
    <Suspense
      fallback={
        <div className="flex w-[100vw] h-[100vh] justify-center items-center">
          <Loader2 className="mr-2 h-20 w-20 animate-spin" />
        </div>
      }
    >
      {tempoElements}
      {elements}
      <Toaster />
    </Suspense>
  );
};

export default App;
