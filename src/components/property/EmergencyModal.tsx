"use client";

import { Phone, EnvelopeSimple } from "@phosphor-icons/react";
import { BottomSheet } from "@/components/ui";
import type { EmergencyContact } from "@/types";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: EmergencyContact;
  propertyName: string;
}

export function EmergencyModal({
  isOpen,
  onClose,
  contact,
  propertyName,
}: EmergencyModalProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Emergency Contact">
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
            <span className="text-2xl font-bold">
              {contact.name[0]?.toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            {contact.name}
          </h3>
          <p className="text-sm text-muted-foreground">Host of {propertyName}</p>
        </div>

        <div className="space-y-3">
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="touch-target flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Phone weight="fill" className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{contact.phone}</p>
              </div>
            </a>
          )}

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="touch-target flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <EnvelopeSimple weight="fill" className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{contact.email}</p>
              </div>
            </a>
          )}
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-800">
            <strong>For life-threatening emergencies</strong>, call the local
            emergency services first (112 in EU).
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}
