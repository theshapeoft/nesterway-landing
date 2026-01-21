"use client";

import { useState, useEffect } from "react";
import { Copy, Check, CaretDown } from "@phosphor-icons/react";
import QRCode from "qrcode";
import { BottomSheet } from "@/components/ui";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";
import type { WiFiNetwork } from "@/types";

interface WiFiModalProps {
  isOpen: boolean;
  onClose: () => void;
  networks: WiFiNetwork[];
  onCopySuccess?: () => void;
}

export function WiFiModal({
  isOpen,
  onClose,
  networks,
  onCopySuccess,
}: WiFiModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const { copy, hasCopied } = useClipboard();

  const network = networks[selectedNetwork];

  // Generate QR code when network changes
  useEffect(() => {
    if (!network) return;

    const generateQR = async () => {
      const wifiString = `WIFI:T:${network.type};S:${network.name};P:${network.password};;`;
      try {
        const dataUrl = await QRCode.toDataURL(wifiString, {
          width: 160,
          margin: 2,
          errorCorrectionLevel: "M",
          color: {
            dark: "#171717",
            light: "#FFFFFF",
          },
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      }
    };

    generateQR();
  }, [network]);

  const handleCopy = async () => {
    const success = await copy(network.password);
    if (success && onCopySuccess) {
      onCopySuccess();
    }
  };

  if (!network) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Wi-Fi Connection">
      <div className="space-y-6">
        {/* Network selector (if multiple networks) */}
        {networks.length > 1 && (
          <div className="space-y-2">
            {networks.map((net, index) => (
              <button
                key={index}
                onClick={() => setSelectedNetwork(index)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  selectedNetwork === index
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-secondary"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{net.name}</p>
                    {net.description && (
                      <p className="text-sm text-muted-foreground">
                        {net.description}
                      </p>
                    )}
                  </div>
                  {selectedNetwork === index && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Network name */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Network Name
          </label>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {network.name}
          </p>
        </div>

        {/* Password with copy button */}
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Password
          </label>
          <div className="mt-1 flex items-stretch rounded-lg border border-border bg-secondary">
            <input
              type="text"
              value={network.password}
              readOnly
              className="flex-1 bg-transparent px-4 py-3 font-mono text-lg tracking-wide text-foreground outline-none select-all"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={handleCopy}
              className="touch-target flex items-center justify-center border-l border-border px-4 transition-colors hover:bg-muted"
              aria-label={hasCopied ? "Copied" : "Copy password"}
            >
              {hasCopied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* QR Code */}
        {qrDataUrl && (
          <div className="flex flex-col items-center rounded-xl bg-secondary p-6">
            <img
              src={qrDataUrl}
              alt="Wi-Fi QR Code"
              width={160}
              height={160}
              className="rounded-lg"
            />
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Scan to connect automatically
            </p>
          </div>
        )}

        {/* Troubleshooting */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => setShowTroubleshooting(!showTroubleshooting)}
            className="flex w-full items-center justify-between text-sm font-medium text-primary"
          >
            <span>Having trouble connecting?</span>
            <CaretDown
              weight="bold"
              className={cn(
                "h-4 w-4 transition-transform",
                showTroubleshooting && "rotate-180"
              )}
            />
          </button>

          {showTroubleshooting && (
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-1 pl-5">
                <li>Open your device&apos;s Wi-Fi settings</li>
                <li>
                  Look for &quot;<strong>{network.name}</strong>&quot; in the
                  list
                </li>
                <li>Tap to connect</li>
                <li>Enter the password shown above</li>
                <li>If it still doesn&apos;t work, try restarting Wi-Fi</li>
              </ol>
              <p className="pt-2 text-muted-foreground">
                Still having issues? Contact your host.
              </p>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
