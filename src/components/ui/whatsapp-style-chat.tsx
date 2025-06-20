"use client";

import dynamic from "next/dynamic";

// Dynamically import the WhatsAppStyleChat component to ensure proper SSR/client usage
const WhatsAppStyleChat = dynamic(() => import("./whatsapp-style-chat-component"), {
  ssr: false,
});

export default WhatsAppStyleChat;
