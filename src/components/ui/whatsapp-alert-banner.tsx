import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface WhatsAppAlertBannerProps {
  onReconnect: () => void;
}

export function WhatsAppAlertBanner({ onReconnect }: WhatsAppAlertBannerProps) {
  return (
    <div className="sticky top-0 z-50 bg-red-500 text-white p-2 flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">A conexão com o WhatsApp foi perdida. Algumas funcionalidades podem estar indisponíveis.</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="text-white border-white/30 hover:bg-white/20 hover:text-white"
        onClick={onReconnect}
      >
        Reconectar
      </Button>
    </div>
  );
}
