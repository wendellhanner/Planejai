"use client";

import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { SessionProvider } from "next-auth/react";

// Dynamically import the WhatsAppStyleChat component with no SSR
const WhatsAppStyleChat = dynamic(
  () => import("@/components/ui/whatsapp-style-chat"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Carregando WhatsApp...</p>
        </div>
      </div>
    )
  }
);

export default function WhatsAppChatPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Mark component as loaded after first render
    setIsLoaded(true);
  }, []);

  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Chat com Clientes</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Comunicação com clientes usando a interface similar ao WhatsApp
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex h-[calc(100vh-200px)] items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">Carregando WhatsApp...</p>
            </div>
          </div>
        }
      >
        {isLoaded && (
          <SessionProvider>
            <WhatsAppStyleChat />
          </SessionProvider>
        )}
      </Suspense>
    </div>
  );
}
