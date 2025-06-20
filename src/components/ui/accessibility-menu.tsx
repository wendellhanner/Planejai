"use client";

import React, { useState, useEffect } from "react";
import { Accessibility, ZoomIn, ZoomOut, SunMoon, Type, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AccessibilitySettings {
  fontSize: number;
  contrastMode: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  dyslexicFont: boolean;
}

interface AccessibilityMenuProps {
  openFromSettings?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 1, // 1 = normal, 0.8 = smaller, 1.2 = larger
  contrastMode: false,
  reducedMotion: false,
  highContrast: false,
  dyslexicFont: false,
};

export function AccessibilityMenu({ openFromSettings = false, setIsOpen }: AccessibilityMenuProps) {
  const [isOpen, setIsOpenState] = useState(openFromSettings);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  // Para caso o componente seja aberto diretamente das configurações
  useEffect(() => {
    if (openFromSettings) {
      setIsOpenState(true);
    }
  }, [openFromSettings]);

  // Carregar configurações salvas quando o componente montar
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Aplicar configurações sempre que elas mudarem
  useEffect(() => {
    // Aplicar tamanho da fonte
    document.documentElement.style.setProperty('--accessibility-font-scale', settings.fontSize.toString());

    // Aplicar modo de contraste
    if (settings.contrastMode) {
      document.documentElement.classList.add('contrast-mode');
    } else {
      document.documentElement.classList.remove('contrast-mode');
    }

    // Aplicar redução de movimento
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    // Aplicar alto contraste
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Aplicar fonte para dislexia
    if (settings.dyslexicFont) {
      document.documentElement.classList.add('dyslexic-font');
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }

    // Salvar configurações no localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  const handleChangeFontSize = (value: number[]) => {
    setSettings({ ...settings, fontSize: value[0] });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    toast.success("Configurações de acessibilidade redefinidas");
  };

  const handleClose = () => {
    setIsOpenState(false);
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  // Renderiza apenas o conteúdo se aberto das configurações
  if (openFromSettings) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-blue-500" />
              <CardTitle>Configurações de Acessibilidade</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleClose}
            >
              <span className="sr-only">Fechar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          </div>
          <CardDescription>
            Personalize sua experiência para melhor acessibilidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span>Tamanho do texto: {Math.round(settings.fontSize * 100)}%</span>
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSettings({ ...settings, fontSize: Math.max(0.8, settings.fontSize - 0.1) })}
                  disabled={settings.fontSize <= 0.8}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSettings({ ...settings, fontSize: Math.min(1.5, settings.fontSize + 0.1) })}
                  disabled={settings.fontSize >= 1.5}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Slider
              defaultValue={[1]}
              min={0.8}
              max={1.5}
              step={0.1}
              value={[settings.fontSize]}
              onValueChange={handleChangeFontSize}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Modos de Visualização</h3>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="flex items-center gap-2 cursor-pointer">
                  <SunMoon className="h-4 w-4" />
                  <span>Alto Contraste</span>
                </Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reduced-motion" className="flex items-center gap-2 cursor-pointer">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    <line x1="4" y1="4" x2="20" y2="20"></line>
                  </svg>
                  <span>Reduzir Animações</span>
                </Label>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => setSettings({ ...settings, reducedMotion: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dyslexic-font" className="flex items-center gap-2 cursor-pointer">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7V4h16v3"></path>
                    <path d="M9 20h6"></path>
                    <path d="M12 4v16"></path>
                  </svg>
                  <span>Fonte para Dislexia</span>
                </Label>
                <Switch
                  id="dyslexic-font"
                  checked={settings.dyslexicFont}
                  onCheckedChange={(checked) => setSettings({ ...settings, dyslexicFont: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            className="gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restaurar Padrão</span>
          </Button>
          <Button
            size="sm"
            onClick={handleClose}
          >
            Aplicar e Fechar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 bottom-16 z-50 h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md"
        onClick={() => setIsOpenState(!isOpen)}
        aria-label="Acessibilidade"
      >
        <Accessibility className="h-5 w-5 text-blue-500" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5 text-blue-500" />
                  <CardTitle>Configurações de Acessibilidade</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleClose}
                >
                  <span className="sr-only">Fechar</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>
              <CardDescription>
                Personalize sua experiência para melhor acessibilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <span>Tamanho do texto: {Math.round(settings.fontSize * 100)}%</span>
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSettings({ ...settings, fontSize: Math.max(0.8, settings.fontSize - 0.1) })}
                      disabled={settings.fontSize <= 0.8}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSettings({ ...settings, fontSize: Math.min(1.5, settings.fontSize + 0.1) })}
                      disabled={settings.fontSize >= 1.5}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Slider
                  defaultValue={[1]}
                  min={0.8}
                  max={1.5}
                  step={0.1}
                  value={[settings.fontSize]}
                  onValueChange={handleChangeFontSize}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Modos de Visualização</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-contrast" className="flex items-center gap-2 cursor-pointer">
                      <SunMoon className="h-4 w-4" />
                      <span>Alto Contraste</span>
                    </Label>
                    <Switch
                      id="high-contrast"
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reduced-motion" className="flex items-center gap-2 cursor-pointer">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        <line x1="4" y1="4" x2="20" y2="20"></line>
                      </svg>
                      <span>Reduzir Animações</span>
                    </Label>
                    <Switch
                      id="reduced-motion"
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => setSettings({ ...settings, reducedMotion: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dyslexic-font" className="flex items-center gap-2 cursor-pointer">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 7V4h16v3"></path>
                        <path d="M9 20h6"></path>
                        <path d="M12 4v16"></path>
                      </svg>
                      <span>Fonte para Dislexia</span>
                    </Label>
                    <Switch
                      id="dyslexic-font"
                      checked={settings.dyslexicFont}
                      onCheckedChange={(checked) => setSettings({ ...settings, dyslexicFont: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSettings}
                className="gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restaurar Padrão</span>
              </Button>
              <Button
                size="sm"
                onClick={handleClose}
              >
                Aplicar e Fechar
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
