"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type FormValues = z.infer<typeof formSchema>;

export function PasswordRecoveryForm({ onCancel }: { onCancel: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    try {
      // Em um cenário real, aqui faremos uma chamada à API para solicitar a recuperação de senha
      // Simulando um atraso para efeitos visuais
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulando que o email foi enviado com sucesso
      setIsSuccess(true);

      toast.success("Link de recuperação enviado para seu email", {
        position: "top-center",
        duration: 4000,
      });
    } catch (error) {
      toast.error("Ocorreu um erro ao enviar o email de recuperação. Tente novamente.", {
        position: "top-center",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Email enviado</h2>
        <p className="text-slate-600 text-sm">
          Enviamos instruções de recuperação para seu email. Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
        </p>
        <div className="pt-4">
          <Button
            onClick={onCancel}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Recuperar senha</h2>
        <p className="text-slate-600 text-sm">
          Informe seu email e enviaremos instruções para recuperar sua senha.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input
                      placeholder="seu@email.com"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full flex items-center gap-2 h-11 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span>Enviar instruções</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full flex items-center gap-2"
              onClick={onCancel}
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
