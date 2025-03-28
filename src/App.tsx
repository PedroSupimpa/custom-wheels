import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import routes from "./routes/routes";

const App = () => {
  const elements = useRoutes(routes);

  return (
    <Suspense fallback={<div className="flex w-[100vw] h-[100vh] justify-center items-center">
      <Loader2 className="mr-2 h-20 w-20 animate-spin" />
    </div>}>
      {elements}
      <Toaster />
    </Suspense>
  );
};

export default App;
