"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Control, Resolver, FieldValues } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Info, Lock, Mail, ArrowRight, KeyRound, User } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  rememberMe: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

// Removidos exemplos de usuários

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  // Estado de loading para o botão de login

  // Verificar se há informações salvas no localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && savedRememberMe) {
      form.setValue('email', savedEmail);
      form.setValue('rememberMe', true);
    }
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as Resolver<FormData>,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: { email: string; password: string; rememberMe: boolean }) {
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

      // Autenticar com o Supabase
      const { success, error } = await login(values.email, values.password);

      if (success) {
        toast.success("Login realizado com sucesso", {
          position: "top-center",
        });
        // Forçar redirecionamento para o dashboard
        console.log('Redirecionamento manual após login bem-sucedido');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        toast.error(error?.message || "Credenciais inválidas. Verifique seu email e senha.", {
          position: "top-center",
          duration: 4000,
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error("Ocorreu um erro ao autenticar. Tente novamente mais tarde.", {
        position: "top-center",
      });
      console.error(error);
      setIsLoading(false);
    }
  }

  // Função removida de preenchimento de email de exemplo

  const [showPassword, setShowPassword] = useState(false);
  const [formFocus, setFormFocus] = useState<string | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<any>)} className="space-y-4">
        <FormField
          control={form.control as any}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</FormLabel>
              <FormControl>
                <div className={`relative transition-all duration-300 group ${formFocus === 'email' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-md' : ''}`}>
                  <Mail className={`absolute left-3 top-2 h-4 w-4 transition-colors duration-300 ${formFocus === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                  <Input
                    placeholder="seu@email.com"
                    className="pl-9 h-10 rounded-md border-slate-200 focus:ring-0 focus:border-transparent text-sm"
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
          control={form.control as any}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</FormLabel>
              <FormControl>
                <div className={`relative transition-all duration-300 group ${formFocus === 'password' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-md' : ''}`}>
                  <Lock className={`absolute left-3 top-2 h-4 w-4 transition-colors duration-300 ${formFocus === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    className="pl-9 h-10 pr-9 rounded-md border-slate-200 focus:ring-0 focus:border-transparent text-sm"
                    {...field}
                    onFocus={() => setFormFocus('password')}
                    onBlur={() => setFormFocus(null)}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                        <line x1="2" x2="22" y1="2" y2="22"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            control={form.control as any}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="rounded-sm data-[state=checked]:bg-blue-600 border-slate-300 h-3.5 w-3.5"
                  />
                </FormControl>
                <div className="leading-none">
                  <FormLabel className="cursor-pointer text-xs text-slate-700 dark:text-slate-300">
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
          className="w-full flex items-center gap-2 h-10 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/20 text-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 animate-pulse rounded-md"></div>
              <Loader2 className="h-4 w-4 animate-spin relative z-10" />
              <span className="relative z-10">Entrando...</span>
            </>
          ) : (
            <>
              <span>Entrar</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        {/* Seção de exemplos de usuários removida */}
      </form>
    </Form>
  );
}
