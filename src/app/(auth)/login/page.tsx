"use client";

import { useState } from "react";
import { LoginForm } from "@/components/forms/login-form";
import { PasswordRecoveryForm } from "@/components/forms/password-recovery-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { AnimatePresence, motion } from "framer-motion";

export default function LoginPage() {
  const [formMode, setFormMode] = useState<"login" | "recovery">("login");

  const toggleFormMode = () => {
    setFormMode(formMode === "login" ? "recovery" : "login");
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row items-stretch">
      {/* Left side - Background e Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-600 text-white flex-col justify-between p-6 lg:p-8 relative overflow-hidden">
        {/* Elementos decorativos para efeito visual moderno */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/20 filter blur-3xl"></div>
          <div className="absolute bottom-40 right-10 w-72 h-72 rounded-full bg-white/20 filter blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-blue-400/30 filter blur-2xl"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
            <Logo size="lg" variant="dark" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 font-display leading-tight">
            Gerencie seu negócio de móveis planejados com <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-200 to-white">inteligência</span>
          </h1>
          <p className="text-base lg:text-lg opacity-90 max-w-lg leading-relaxed">
            Uma plataforma completa para acompanhar seus clientes desde o primeiro contato até o suporte pós-venda, com automações que otimizam seu processo.
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/10 shadow-xl transform transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] hover:shadow-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-full shadow-inner shadow-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg font-display">Aumente suas vendas</h3>
                <p className="opacity-90 text-sm">Acompanhe leads e propostas, aumentando sua taxa de conversão</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/10 shadow-xl transform transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] hover:shadow-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-full shadow-inner shadow-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg font-display">Otimize seu tempo</h3>
                <p className="opacity-90 text-sm">Automações inteligentes para focar no que realmente importa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs opacity-70 text-center mt-4 relative z-10">
          © {new Date().getFullYear()} Planej.AI - Todos os direitos reservados.
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 relative overflow-y-auto max-h-screen">
        {/* Elementos decorativos para design moderno */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full filter blur-3xl opacity-70"></div>

        <div className="md:hidden mb-4 w-full max-w-md text-center">
          <Logo size="md" />
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Sistema inteligente para gestão de móveis planejados
          </p>
        </div>

        <Card className="w-full max-w-md border-slate-200 dark:border-slate-700 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm relative z-10 transform transition-all duration-500 hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-50 rounded-lg"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={formMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {formMode === "login" ? (
                <>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white font-display">Bem-vindo(a) de volta</CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Entre com suas credenciais para acessar o sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LoginForm />

                    <div className="mt-4 text-center">
                      <button
                        onClick={toggleFormMode}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="pt-6">
                  <PasswordRecoveryForm onCancel={toggleFormMode} />
                </CardContent>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>

        <div className="mt-6 md:hidden text-center text-sm text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} Planej.AI - Todos os direitos reservados.
        </div>

        {/* Links de ajuda */}
        <div className="mt-6 text-center flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            Ajuda
          </a>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <a href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            Termos de uso
          </a>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <a href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            Privacidade
          </a>
        </div>
      </div>
    </div>
  );
}
