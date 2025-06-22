"use client";

import dynamic from 'next/dynamic';

// Importações dinâmicas para componentes PWA
const InstallPWAPrompt = dynamic(
  () => import('@/components/pwa/install-prompt').then(mod => mod.InstallPWAPrompt),
  { ssr: false }
);

const UpdateNotification = dynamic(
  () => import('@/components/pwa/update-notification').then(mod => mod.UpdateNotification),
  { ssr: false }
);

const OfflineNotification = dynamic(
  () => import('@/components/pwa/offline-notification').then(mod => mod.OfflineNotification),
  { ssr: false }
);

export function PWAContainer() {
  return (
    <>
      <InstallPWAPrompt />
      <UpdateNotification />
      <OfflineNotification />
    </>
  );
}
