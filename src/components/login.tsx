import { useAuth } from "@/context/AuthContext"; // Ajuste o caminho conforme necessário
import { userSignIn, userSignUp } from "@/service/roulette";
import { mapToastType } from "@/utils/mapToastType";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface LoginPros {
  onLoginSuccess?: (token: string) => void;
}

const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export function Login({ onLoginSuccess }: LoginPros) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [toastState, setToastState] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleAction = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = isSignUp
        ? await userSignUp(email, password)
        : await userSignIn(email, password);

      if (response.status === 200 || response.status === 201) {
        const token = response.data.token;
        login(token);
        setToastState({
          message: isSignUp
            ? "Conta criada com sucesso"
            : "Login efetuado com sucesso",
          type: "success",
        });
        if (onLoginSuccess) {
          onLoginSuccess(token);
        }
      } else if (response.status === 401) {
        setToastState({
          message: "Usuário ou senha inválidos",
          type: "error",
        });
      } else {
        setToastState({
          message: "Erro ao tentar fazer login",
          type: "error",
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setToastState({
          message: "Usuário ou senha inválidos",
          type: "error",
        });
      } else {
        setToastState({
          message: `Erro ao tentar fazer login: ${error.message}`,
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0] as keyof typeof fieldErrors] = error.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
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

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{isSignUp ? "Cadastre-se" : "Logar"}</CardTitle>
        <CardDescription>
          {isSignUp ? "Crie sua conta" : "Entre com suas credenciais"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="user">Email</Label>
              <Input
                id="user"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password}</span>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-3">
        <Button onClick={() => setIsSignUp(!isSignUp)} disabled={isLoading}>
          {isSignUp
            ? "Já tem uma conta? Entrar"
            : "Não tem uma conta? Cadastre-se"}
        </Button>
        <Button onClick={handleAction} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-[100%] w-[100%] animate-spin" />
          ) : isSignUp ? (
            "Cadastrar"
          ) : (
            "Entrar"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
