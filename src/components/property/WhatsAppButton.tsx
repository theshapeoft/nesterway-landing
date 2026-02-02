"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  propertyName: string;
  hostName?: string;
  className?: string;
}

/**
 * WhatsApp quick contact button for guests to message their host.
 * Uses WhatsApp's click-to-chat URL scheme with a pre-filled greeting.
 */
export function WhatsAppButton({
  phoneNumber,
  propertyName,
  hostName,
  className = "",
}: WhatsAppButtonProps) {
  // Clean phone number - remove spaces, dashes, parentheses, keep + for country code
  const cleanNumber = phoneNumber.replace(/[\s\-()]/g, "");
  
  // Pre-filled greeting message
  const greeting = encodeURIComponent(
    `Hi${hostName ? ` ${hostName}` : ""}! I'm staying at ${propertyName} and have a question.`
  );
  
  // WhatsApp URL - works on mobile (opens app) and desktop (opens web.whatsapp.com)
  const whatsappUrl = `https://wa.me/${cleanNumber.replace("+", "")}?text=${greeting}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-[#20bd5a] hover:shadow-lg active:scale-95 ${className}`}
      aria-label={`Message ${hostName || "host"} on WhatsApp`}
    >
      <MessageCircle className="h-4 w-4" />
      <span>Message {hostName || "Host"}</span>
    </a>
  );
}
