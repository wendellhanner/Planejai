"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Info, Lock, Mail, ArrowRight, KeyRound, User } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  rememberMe: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

// Credenciais de teste para facilitar o acesso
const TEST_CREDENTIALS = [
  { email: "admin@moveisplanejados.com", password: "admin123", role: "ADMIN", color: "bg-blue-500" },
  { email: "vendedor@moveisplanejados.com", password: "vend123", role: "VENDEDOR", color: "bg-green-500" },
  { email: "producao@moveisplanejados.com", password: "prod123", role: "PRODUCAO", color: "bg-amber-500" },
];

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  // Verificar se há informações salvas no localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && savedRememberMe) {
      form.setValue('email', savedEmail);
      form.setValue('rememberMe', true);
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      // Salvar ou remover email do localStorage com base na opção "lembrar-me"
      if (values.rememberMe) {
        localStorage.setItem('savedEmail', values.email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.setItem('rememberMe', 'false');
      }

      // Verificar se as credenciais correspondem a uma das credenciais de teste
      const matchedUser = TEST_CREDENTIALS.find(
        (user) => user.email === values.email && user.password === values.password
      );

      if (matchedUser) {
        toast.success(`Login realizado com sucesso como ${matchedUser.role}`, {
          position: "top-center",
        });
        // Redirecionar diretamente para o dashboard
        router.push("/dashboard");
      } else {
        toast.error("Credenciais inválidas. Utilize uma das credenciais de teste disponíveis.", {
          position: "top-center",
          duration: 4000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao autenticar. Tente novamente mais tarde.", {
        position: "top-center",
      });
      console.error(error);
      setIsLoading(false);
    }
  }

  // Função para usar uma credencial de teste e fazer login automático
  const handleAutoLogin = (credIndex: number) => {
    if (credIndex >= 0 && credIndex < TEST_CREDENTIALS.length) {
      setIsLoading(true);
      const credential = TEST_CREDENTIALS[credIndex];

      // Preencher o formulário
      form.setValue("email", credential.email);
      form.setValue("password", credential.password);

      // Mostrar mensagem de sucesso e redirecionar
      toast.success(`Login automático como ${credential.role}`, {
        position: "top-center",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [formFocus, setFormFocus] = useState<string | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</FormLabel>
              <FormControl>
                <div className={`relative transition-all duration-300 group ${formFocus === 'email' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-md' : ''}`}>
                  <Mail className={`absolute left-3 top-2.5 h-5 w-5 transition-colors duration-300 ${formFocus === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                  <Input
                    placeholder="seu@email.com"
                    className="pl-10 h-11 rounded-md border-slate-200 focus:ring-0 focus:border-transparent"
                    {...field}
                    onFocus={() => setFormFocus('email')}
                    onBlur={() => setFormFocus(null)}
                  />
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${formFocus === 'email' ? 'w-full' : 'w-0'}`}></div>
                </div>
              </FormControl>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</FormLabel>
              <FormControl>
                <div className={`relative transition-all duration-300 group ${formFocus === 'password' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-md' : ''}`}>
                  <Lock className={`absolute left-3 top-2.5 h-5 w-5 transition-colors duration-300 ${formFocus === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    className="pl-10 h-11 pr-10 rounded-md border-slate-200 focus:ring-0 focus:border-transparent"
                    {...field}
                    onFocus={() => setFormFocus('password')}
                    onBlur={() => setFormFocus(null)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                        <line x1="2" x2="22" y1="2" y2="22"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${formFocus === 'password' ? 'w-full' : 'w-0'}`}></div>
                </div>
              </FormControl>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="rounded-sm data-[state=checked]:bg-blue-600 border-slate-300"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                    Lembrar credenciais
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium">Esqueceu a senha?</a>
        </div>

        <Button
          type="submit"
          className="w-full flex items-center gap-2 h-11 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 animate-pulse rounded-md"></div>
              <Loader2 className="h-5 w-5 animate-spin relative z-10" />
              <span className="relative z-10">Entrando...</span>
            </>
          ) : (
            <>
              <span>Entrar</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
              Acesso rápido
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {TEST_CREDENTIALS.map((cred, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              className="flex items-center justify-between group transition-all h-11 border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              onClick={() => handleAutoLogin(index)}
            >
              <div className="flex items-center gap-3">
                <div className={`${cred.color} rounded-full p-2 text-white shadow-sm`}>
                  <User className="h-4 w-4" />
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {cred.role === "ADMIN" ? "Administrador" : cred.role === "VENDEDOR" ? "Vendedor" : "Produção"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">Login rápido</span>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-1 text-slate-400 dark:text-slate-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all">
                  <KeyRound className="h-3.5 w-3.5" />
                </div>
              </div>
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs w-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          onClick={() => setShowCredentials(!showCredentials)}
        >
          <Info className="h-3.5 w-3.5 mr-1.5" />
          {showCredentials ? "Ocultar credenciais" : "Mostrar credenciais de teste"}
        </Button>

        {showCredentials && (
          <div className="rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border border-blue-100 dark:border-blue-800 shadow-sm animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Credenciais para teste:
                </p>
                <div className="mt-2 text-xs space-y-2">
                  {TEST_CREDENTIALS.map((cred, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:gap-2 pb-2 border-b border-blue-100 last:border-0">
                      <span className={`font-bold ${cred.color.replace('bg-', 'text-')}`}>{cred.role}:</span>
                      <div className="flex gap-1.5 items-center">
                        <span className="text-slate-600">{cred.email}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-600">{cred.password}</span>
                        <button
                          type="button"
                          className="text-blue-500 hover:text-blue-700 ml-1 p-1 rounded-full hover:bg-blue-100/50 transition-colors"
                          onClick={() => {
                            form.setValue("email", cred.email);
                            form.setValue("password", cred.password);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
