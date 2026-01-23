"use client";

import { useState, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Download, FileText, Printer, BookOpen, Settings2, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import type { DbProperty } from "@/lib/actions/properties";
import { getPropertyPdfData } from "@/lib/actions/pdf-export";
import { track } from "@/lib/analytics";

interface QrCodeTabProps {
  property: DbProperty;
}

type QrSize = "small" | "medium" | "large";
type PrintTemplate = "tent-card" | "wall-sign";

const sizes: Record<QrSize, { px: number; label: string }> = {
  small: { px: 200, label: "Small (200px)" },
  medium: { px: 400, label: "Medium (400px)" },
  large: { px: 800, label: "Large (800px)" },
};

// DPI for print-quality exports
const PRINT_DPI = 300;
const SCREEN_DPI = 96;
const DPI_SCALE = PRINT_DPI / SCREEN_DPI;

export function QrCodeTab({ property }: QrCodeTabProps) {
  const [size, setSize] = useState<QrSize>("medium");
  const [includeBranding, setIncludeBranding] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PrintTemplate | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const [pdfOptions, setPdfOptions] = useState({
    includeWifi: true,
    includeRules: true,
    includeAppliances: true,
    includeEmergency: true,
    includeSections: true,
    includeMap: true,
    includeBranding: true,
  });
  const qrRef = useRef<HTMLDivElement>(null);

  // Use environment variable or fallback for the base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://travelama.com";
  const propertyUrl = `${baseUrl}/stay/${property.slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    track("qr_link_copied", { property_id: property.id });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Generate QR code canvas with optional branding
  const generateQrCanvas = useCallback(
    async (targetSize: number, withBranding: boolean): Promise<HTMLCanvasElement> => {
      return new Promise((resolve) => {
        if (!qrRef.current) throw new Error("QR ref not found");

        const svg = qrRef.current.querySelector("svg");
        if (!svg) throw new Error("SVG not found");

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const img = new Image();

        // Clone SVG and set proper size
        const svgClone = svg.cloneNode(true) as SVGSVGElement;
        svgClone.setAttribute("width", String(targetSize));
        svgClone.setAttribute("height", String(targetSize));

        const svgData = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          // Calculate total canvas height based on branding
          const padding = Math.round(targetSize * 0.08);
          const textHeight = withBranding ? Math.round(targetSize * 0.25) : Math.round(targetSize * 0.15);
          const totalHeight = targetSize + textHeight + padding * 2;
          const totalWidth = targetSize + padding * 2;

          canvas.width = totalWidth;
          canvas.height = totalHeight;

          // White background
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, totalWidth, totalHeight);

          // Draw QR code
          ctx.drawImage(img, padding, padding, targetSize, targetSize);

          // Text settings
          const baseFontSize = Math.max(12, Math.round(targetSize * 0.045));
          let yOffset = padding + targetSize + Math.round(padding * 0.8);

          // Property name
          ctx.fillStyle = "#1e1e1e";
          ctx.font = `600 ${baseFontSize * 1.2}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(property.name, totalWidth / 2, yOffset, totalWidth - padding * 2);
          yOffset += baseFontSize * 1.6;

          // URL
          ctx.fillStyle = "#6b7280";
          ctx.font = `400 ${baseFontSize * 0.85}px system-ui, sans-serif`;
          ctx.fillText(propertyUrl, totalWidth / 2, yOffset, totalWidth - padding * 2);

          if (withBranding) {
            yOffset += baseFontSize * 1.8;
            ctx.fillStyle = "#9ca3af";
            ctx.font = `400 ${baseFontSize * 0.75}px system-ui, sans-serif`;
            ctx.fillText("travelama.com", totalWidth / 2, yOffset);
          }

          URL.revokeObjectURL(url);
          resolve(canvas);
        };

        img.src = url;
      });
    },
    [property.name, propertyUrl]
  );

  // Download PNG at 300dpi
  const downloadPNG = useCallback(async () => {
    const targetSize = sizes[size].px * DPI_SCALE; // Scale for 300dpi
    const canvas = await generateQrCanvas(targetSize, includeBranding);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const suffix = includeBranding ? "" : "-unbranded";
          downloadBlob(blob, `${property.slug}-qr-${size}${suffix}.png`);
          track("qr_downloaded", { property_id: property.id, format: "png", size });
        }
      },
      "image/png",
      1.0
    );
  }, [size, includeBranding, generateQrCanvas, downloadBlob, property.slug, property.id]);

  // Download SVG with branding text
  const downloadSVG = useCallback(() => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const targetSize = sizes[size].px;
    const padding = Math.round(targetSize * 0.08);
    const textHeight = includeBranding ? Math.round(targetSize * 0.25) : Math.round(targetSize * 0.15);
    const totalHeight = targetSize + textHeight + padding * 2;
    const totalWidth = targetSize + padding * 2;
    const baseFontSize = Math.max(12, Math.round(targetSize * 0.045));

    // Clone the SVG content
    const qrContent = svg.innerHTML;

    // Build SVG with text
    const yOffset = padding + targetSize + Math.round(padding * 0.8) + baseFontSize;

    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <rect width="100%" height="100%" fill="white"/>
  <g transform="translate(${padding}, ${padding})">
    <svg width="${targetSize}" height="${targetSize}" viewBox="0 0 200 200">
      ${qrContent}
    </svg>
  </g>
  <text x="${totalWidth / 2}" y="${yOffset}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${baseFontSize * 1.2}" font-weight="600" fill="#1e1e1e">${escapeXml(property.name)}</text>
  <text x="${totalWidth / 2}" y="${yOffset + baseFontSize * 1.6}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${baseFontSize * 0.85}" fill="#6b7280">${escapeXml(propertyUrl)}</text>`;

    if (includeBranding) {
      svgContent += `
  <text x="${totalWidth / 2}" y="${yOffset + baseFontSize * 3.4}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${baseFontSize * 0.75}" fill="#9ca3af">travelama.com</text>`;
    }

    svgContent += "\n</svg>";

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const suffix = includeBranding ? "" : "-unbranded";
    downloadBlob(blob, `${property.slug}-qr-${size}${suffix}.svg`);
    track("qr_downloaded", { property_id: property.id, format: "svg", size });
  }, [size, includeBranding, property.name, property.slug, property.id, propertyUrl, downloadBlob]);

  // Download basic PDF
  const downloadPDF = useCallback(async () => {
    const canvas = await generateQrCanvas(400 * DPI_SCALE, includeBranding);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Property name
    pdf.setFontSize(28);
    pdf.setTextColor(30, 30, 30);
    const propertyNameLines = pdf.splitTextToSize(property.name, pageWidth - 40);
    pdf.text(propertyNameLines, pageWidth / 2, 50, { align: "center" });

    // QR Code with labels (from canvas)
    const qrImageData = canvas.toDataURL("image/png");
    const qrPdfWidth = 120;
    const aspectRatio = canvas.height / canvas.width;
    const qrPdfHeight = qrPdfWidth * aspectRatio;
    const qrX = (pageWidth - qrPdfWidth) / 2;
    const qrY = 70;
    pdf.addImage(qrImageData, "PNG", qrX, qrY, qrPdfWidth, qrPdfHeight);

    // Scan instruction
    pdf.setFontSize(14);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Scan to access your guest guide", pageWidth / 2, qrY + qrPdfHeight + 15, {
      align: "center",
    });

    // Footer (only if branding enabled)
    if (includeBranding) {
      pdf.setFontSize(10);
      pdf.setTextColor(160, 160, 160);
      pdf.text("Powered by Travelama", pageWidth / 2, pageHeight - 20, {
        align: "center",
      });
    }

    const suffix = includeBranding ? "" : "-unbranded";
    pdf.save(`${property.slug}-qr${suffix}.pdf`);
    track("qr_downloaded", { property_id: property.id, format: "pdf", size: "medium" });
  }, [generateQrCanvas, includeBranding, property.name, property.slug, property.id]);

  // Download tent card template
  const downloadTentCard = useCallback(async () => {
    const qrCanvas = await generateQrCanvas(300 * DPI_SCALE, false);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [148, 105], // A6 landscape for tent card
    });

    const pageWidth = 148;
    const pageHeight = 105;
    const bleed = 3; // 3mm bleed for professional printing

    // Add bleed marks
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.25);
    // Corner marks
    const markLength = 5;
    // Top-left
    pdf.line(-bleed, -bleed - markLength, -bleed, -bleed);
    pdf.line(-bleed - markLength, -bleed, -bleed, -bleed);
    // Top-right
    pdf.line(pageWidth + bleed, -bleed - markLength, pageWidth + bleed, -bleed);
    pdf.line(pageWidth + bleed, -bleed, pageWidth + bleed + markLength, -bleed);
    // Bottom-left
    pdf.line(-bleed, pageHeight + bleed, -bleed, pageHeight + bleed + markLength);
    pdf.line(-bleed - markLength, pageHeight + bleed, -bleed, pageHeight + bleed);
    // Bottom-right
    pdf.line(pageWidth + bleed, pageHeight + bleed, pageWidth + bleed, pageHeight + bleed + markLength);
    pdf.line(pageWidth + bleed, pageHeight + bleed + markLength, pageWidth + bleed, pageHeight + bleed);

    // Fold line (dashed, in center)
    pdf.setLineDashPattern([2, 2], 0);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(pageWidth / 2, 0, pageWidth / 2, pageHeight);
    pdf.setLineDashPattern([], 0);

    // Left side (front when folded)
    const leftCenter = pageWidth / 4;
    const qrSize = 35;
    const qrImageData = qrCanvas.toDataURL("image/png");

    // QR Code
    pdf.addImage(qrImageData, "PNG", leftCenter - qrSize / 2, 20, qrSize, qrSize * (qrCanvas.height / qrCanvas.width));

    // "Scan for Property Info" text
    pdf.setFontSize(11);
    pdf.setTextColor(30, 30, 30);
    pdf.text("Scan for", leftCenter, 65, { align: "center" });
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Property Info", leftCenter, 72, { align: "center" });

    // Feature list
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    const features = ["WiFi Details", "House Rules", "Local Tips"];
    features.forEach((feature, i) => {
      pdf.text(`• ${feature}`, leftCenter, 82 + i * 6, { align: "center" });
    });

    // Right side (back when folded) - property name
    const rightCenter = (pageWidth * 3) / 4;
    pdf.setFontSize(14);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont("helvetica", "bold");
    const nameLines = pdf.splitTextToSize(property.name, 60);
    pdf.text(nameLines, rightCenter, 45, { align: "center" });

    if (includeBranding) {
      pdf.setFontSize(8);
      pdf.setTextColor(160, 160, 160);
      pdf.setFont("helvetica", "normal");
      pdf.text("travelama.com", rightCenter, pageHeight - 10, { align: "center" });
    }

    pdf.save(`${property.slug}-tent-card.pdf`);
    track("qr_template_downloaded", { property_id: property.id, template: "tent-card" });
  }, [generateQrCanvas, includeBranding, property.name, property.slug, property.id]);

  // Download wall sign template
  const downloadWallSign = useCallback(async () => {
    const qrCanvas = await generateQrCanvas(400 * DPI_SCALE, false);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5", // A5 for wall sign
    });

    const pageWidth = 148;
    const pageHeight = 210;
    const bleed = 3;

    // Add bleed marks
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.25);
    const markLength = 5;
    // Top-left
    pdf.line(-bleed, -bleed - markLength, -bleed, -bleed);
    pdf.line(-bleed - markLength, -bleed, -bleed, -bleed);
    // Top-right
    pdf.line(pageWidth + bleed, -bleed - markLength, pageWidth + bleed, -bleed);
    pdf.line(pageWidth + bleed, -bleed, pageWidth + bleed + markLength, -bleed);
    // Bottom-left
    pdf.line(-bleed, pageHeight + bleed, -bleed, pageHeight + bleed + markLength);
    pdf.line(-bleed - markLength, pageHeight + bleed, -bleed, pageHeight + bleed);
    // Bottom-right
    pdf.line(pageWidth + bleed, pageHeight + bleed, pageWidth + bleed, pageHeight + bleed + markLength);
    pdf.line(pageWidth + bleed, pageHeight + bleed + markLength, pageWidth + bleed, pageHeight + bleed);

    // Background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    // Welcome heading
    pdf.setFontSize(32);
    pdf.setTextColor(30, 30, 30);
    pdf.setFont("helvetica", "bold");
    pdf.text("Welcome!", pageWidth / 2, 35, { align: "center" });

    // Property name
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    const nameLines = pdf.splitTextToSize(property.name, pageWidth - 30);
    pdf.text(nameLines, pageWidth / 2, 50, { align: "center" });

    // QR Code
    const qrSize = 70;
    const qrImageData = qrCanvas.toDataURL("image/png");
    const qrY = 65;
    pdf.addImage(qrImageData, "PNG", (pageWidth - qrSize) / 2, qrY, qrSize, qrSize * (qrCanvas.height / qrCanvas.width));

    // Instructions
    const instructionY = qrY + qrSize * (qrCanvas.height / qrCanvas.width) + 15;
    pdf.setFontSize(14);
    pdf.setTextColor(60, 60, 60);
    pdf.text("Scan for everything", pageWidth / 2, instructionY, { align: "center" });
    pdf.text("you need to know", pageWidth / 2, instructionY + 8, { align: "center" });

    // Feature icons/text
    pdf.setFontSize(11);
    pdf.setTextColor(100, 100, 100);
    const features = ["WiFi Password", "House Rules", "Local Recommendations"];
    features.forEach((feature, i) => {
      pdf.text(`✓ ${feature}`, pageWidth / 2, instructionY + 25 + i * 8, { align: "center" });
    });

    // Footer
    if (includeBranding) {
      pdf.setFontSize(10);
      pdf.setTextColor(160, 160, 160);
      pdf.text("Powered by Travelama", pageWidth / 2, pageHeight - 15, { align: "center" });
    }

    pdf.save(`${property.slug}-wall-sign.pdf`);
    track("qr_template_downloaded", { property_id: property.id, template: "wall-sign" });
  }, [generateQrCanvas, includeBranding, property.name, property.slug, property.id]);

  // Generate full guide PDF
  const generateFullGuidePdf = useCallback(async () => {
    setIsGeneratingPdf(true);

    try {
      // Fetch property data
      const data = await getPropertyPdfData(property.id);

      if (!data) {
        toast.error("Failed to load property data");
        setIsGeneratingPdf(false);
        return;
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = margin;

      // Helper to add a new page if needed
      const checkPageBreak = (neededHeight: number) => {
        if (yPos + neededHeight > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
          return true;
        }
        return false;
      };

      // Helper to draw section header
      const drawSectionHeader = (title: string) => {
        checkPageBreak(20);
        pdf.setFontSize(16);
        pdf.setTextColor(30, 30, 30);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, margin, yPos);
        yPos += 8;
        // Draw line under header
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
        pdf.setFont("helvetica", "normal");
      };

      // ===== COVER PAGE =====
      // Property name (large, centered)
      pdf.setFontSize(32);
      pdf.setTextColor(30, 30, 30);
      pdf.setFont("helvetica", "bold");
      const nameLines = pdf.splitTextToSize(data.name, contentWidth);
      pdf.text(nameLines, pageWidth / 2, 60, { align: "center" });

      // Location info
      const locationParts = [data.city, data.country].filter(Boolean);
      if (locationParts.length > 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont("helvetica", "normal");
        pdf.text(locationParts.join(", "), pageWidth / 2, 75, { align: "center" });
      }

      // Welcome message
      if (data.welcomeMessage && pdfOptions.includeSections) {
        pdf.setFontSize(12);
        pdf.setTextColor(60, 60, 60);
        const welcomeLines = pdf.splitTextToSize(data.welcomeMessage, contentWidth - 20);
        pdf.text(welcomeLines, pageWidth / 2, 100, { align: "center" });
      }

      // Host info
      if (data.hostName) {
        pdf.setFontSize(12);
        pdf.setTextColor(80, 80, 80);
        pdf.text(`Your Host: ${data.hostName}`, pageWidth / 2, 140, { align: "center" });
      }

      // Property Guide title
      pdf.setFontSize(18);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Property Guide", pageWidth / 2, 170, { align: "center" });

      // Checkout time
      pdf.setFontSize(11);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Checkout: ${data.checkoutTime}`, pageWidth / 2, 185, { align: "center" });

      // Footer with branding
      if (pdfOptions.includeBranding) {
        pdf.setFontSize(10);
        pdf.setTextColor(160, 160, 160);
        pdf.text("Generated by Travelama.com", pageWidth / 2, pageHeight - 20, {
          align: "center",
        });
      }

      // ===== TABLE OF CONTENTS =====
      pdf.addPage();
      yPos = margin;

      pdf.setFontSize(24);
      pdf.setTextColor(30, 30, 30);
      pdf.setFont("helvetica", "bold");
      pdf.text("Contents", margin, yPos);
      yPos += 15;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);

      let pageNum = 3;
      const tocItems: { title: string; page: number }[] = [];

      if (pdfOptions.includeWifi && data.wifiNetworks.length > 0) {
        tocItems.push({ title: "WiFi Details", page: pageNum++ });
      }
      if (pdfOptions.includeRules && data.houseRules.length > 0) {
        tocItems.push({ title: "House Rules", page: pageNum++ });
      }
      if (pdfOptions.includeAppliances && data.appliances.length > 0) {
        tocItems.push({ title: "Appliances", page: pageNum++ });
      }
      if (pdfOptions.includeEmergency && data.emergencyContacts.length > 0) {
        tocItems.push({ title: "Emergency Contacts", page: pageNum++ });
      }
      if (pdfOptions.includeSections && data.customSections.length > 0) {
        data.customSections.forEach((section) => {
          tocItems.push({ title: section.title, page: pageNum++ });
        });
      }
      if (pdfOptions.includeMap && data.hasMap) {
        tocItems.push({ title: "Local Recommendations", page: pageNum });
      }

      tocItems.forEach((item) => {
        pdf.text(item.title, margin, yPos);
        pdf.text(String(item.page), pageWidth - margin, yPos, { align: "right" });
        yPos += 8;
      });

      // ===== WIFI SECTION =====
      if (pdfOptions.includeWifi && data.wifiNetworks.length > 0) {
        pdf.addPage();
        yPos = margin;
        drawSectionHeader("WiFi Details");

        pdf.setFontSize(11);
        pdf.setTextColor(50, 50, 50);

        data.wifiNetworks.forEach((network, idx) => {
          checkPageBreak(30);

          if (idx > 0) yPos += 5;

          // Network name
          pdf.setFont("helvetica", "bold");
          pdf.text(`Network: ${network.name}`, margin, yPos);
          yPos += 6;

          // Password
          pdf.setFont("helvetica", "normal");
          pdf.text(`Password: ${network.password}`, margin, yPos);
          yPos += 6;

          // Description if present
          if (network.description) {
            pdf.setTextColor(100, 100, 100);
            const descLines = pdf.splitTextToSize(network.description, contentWidth);
            pdf.text(descLines, margin, yPos);
            yPos += descLines.length * 5;
            pdf.setTextColor(50, 50, 50);
          }

          yPos += 4;
        });
      }

      // ===== HOUSE RULES SECTION =====
      if (pdfOptions.includeRules && data.houseRules.length > 0) {
        pdf.addPage();
        yPos = margin;
        drawSectionHeader("House Rules");

        pdf.setFontSize(11);

        data.houseRules.forEach((rule) => {
          checkPageBreak(15);

          // Critical rules in red
          if (rule.severity === "critical") {
            pdf.setTextColor(180, 50, 50);
            pdf.setFont("helvetica", "bold");
          } else {
            pdf.setTextColor(50, 50, 50);
            pdf.setFont("helvetica", "normal");
          }

          const ruleLines = pdf.splitTextToSize(`• ${rule.text}`, contentWidth - 5);
          pdf.text(ruleLines, margin, yPos);
          yPos += ruleLines.length * 5 + 3;
        });
      }

      // ===== APPLIANCES SECTION =====
      if (pdfOptions.includeAppliances && data.appliances.length > 0) {
        pdf.addPage();
        yPos = margin;
        drawSectionHeader("Appliances");

        pdf.setFontSize(11);
        pdf.setTextColor(50, 50, 50);

        data.appliances.forEach((appliance, idx) => {
          checkPageBreak(25);

          if (idx > 0) yPos += 4;

          // Appliance name and location
          pdf.setFont("helvetica", "bold");
          let title = appliance.name;
          if (appliance.location) {
            title += ` (${appliance.location})`;
          }
          pdf.text(title, margin, yPos);
          yPos += 6;

          // Instructions
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(60, 60, 60);
          const instrLines = pdf.splitTextToSize(appliance.instructions, contentWidth);
          pdf.text(instrLines, margin, yPos);
          yPos += instrLines.length * 5 + 2;
          pdf.setTextColor(50, 50, 50);
        });
      }

      // ===== EMERGENCY CONTACTS SECTION =====
      if (pdfOptions.includeEmergency && data.emergencyContacts.length > 0) {
        pdf.addPage();
        yPos = margin;
        drawSectionHeader("Emergency Contacts");

        pdf.setFontSize(11);
        pdf.setTextColor(50, 50, 50);

        data.emergencyContacts.forEach((contact, idx) => {
          checkPageBreak(20);

          if (idx > 0) yPos += 4;

          pdf.setFont("helvetica", "bold");
          pdf.text(contact.name, margin, yPos);
          yPos += 6;

          pdf.setFont("helvetica", "normal");
          if (contact.phone) {
            pdf.text(`Phone: ${contact.phone}`, margin, yPos);
            yPos += 5;
          }
          if (contact.email) {
            pdf.text(`Email: ${contact.email}`, margin, yPos);
            yPos += 5;
          }
          yPos += 2;
        });
      }

      // ===== CUSTOM SECTIONS =====
      if (pdfOptions.includeSections && data.customSections.length > 0) {
        data.customSections.forEach((section) => {
          pdf.addPage();
          yPos = margin;
          drawSectionHeader(section.title);

          pdf.setFontSize(11);
          pdf.setTextColor(50, 50, 50);
          pdf.setFont("helvetica", "normal");

          section.content.forEach((item) => {
            checkPageBreak(15);
            const itemLines = pdf.splitTextToSize(`• ${item}`, contentWidth - 5);
            pdf.text(itemLines, margin, yPos);
            yPos += itemLines.length * 5 + 3;
          });
        });
      }

      // ===== MAP / LOCAL RECOMMENDATIONS =====
      if (pdfOptions.includeMap && data.hasMap && data.mapPins.length > 0) {
        pdf.addPage();
        yPos = margin;
        drawSectionHeader("Local Recommendations");

        pdf.setFontSize(11);
        pdf.setTextColor(50, 50, 50);

        // Group pins by category
        const pinsByCategory: Record<string, typeof data.mapPins> = {};
        data.mapPins.forEach((pin) => {
          if (!pinsByCategory[pin.category]) {
            pinsByCategory[pin.category] = [];
          }
          pinsByCategory[pin.category].push(pin);
        });

        Object.entries(pinsByCategory).forEach(([category, pins]) => {
          checkPageBreak(20);

          pdf.setFont("helvetica", "bold");
          pdf.text(category, margin, yPos);
          yPos += 7;

          pdf.setFont("helvetica", "normal");
          pins.forEach((pin) => {
            checkPageBreak(12);
            pdf.text(`• ${pin.title}`, margin + 3, yPos);
            if (pin.address) {
              pdf.setTextColor(100, 100, 100);
              pdf.setFontSize(9);
              pdf.text(`  ${pin.address}`, margin + 3, yPos + 4);
              pdf.setFontSize(11);
              pdf.setTextColor(50, 50, 50);
              yPos += 9;
            } else {
              yPos += 5;
            }
          });
          yPos += 4;
        });
      }

      // Add page numbers to all pages (except cover)
      const totalPages = pdf.getNumberOfPages();
      for (let i = 2; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${i}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];
      const filename = `${data.slug}-guide-${date}.pdf`;

      // Save the PDF
      pdf.save(filename);

      // Track analytics
      const sectionsIncluded: string[] = [];
      if (pdfOptions.includeWifi) sectionsIncluded.push("wifi");
      if (pdfOptions.includeRules) sectionsIncluded.push("rules");
      if (pdfOptions.includeAppliances) sectionsIncluded.push("appliances");
      if (pdfOptions.includeEmergency) sectionsIncluded.push("emergency");
      if (pdfOptions.includeSections) sectionsIncluded.push("sections");
      if (pdfOptions.includeMap) sectionsIncluded.push("map");

      track("pdf_downloaded", {
        property_id: property.id,
        sections_included: sectionsIncluded,
        branded: pdfOptions.includeBranding,
      });

      toast.success("PDF generated successfully!", {
        description: filename,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF", {
        description: "Please try again.",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [property.id, pdfOptions]);

  const isPublished = property.status === "published";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Your QR Code</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Guests can scan this code to access your property manual.
        </p>
      </div>

      {!isPublished && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200">
          Your property is not published yet. The QR code will work once you publish.
        </div>
      )}

      {/* QR Code Preview */}
      <div className="flex justify-center">
        <div
          ref={qrRef}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >
          <QRCodeSVG
            value={propertyUrl}
            size={200}
            level="M"
            includeMargin={false}
          />
          <div className="mt-4 text-center">
            <p className="font-medium text-foreground">{property.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {propertyUrl}
            </p>
            {includeBranding && (
              <p className="mt-1 text-xs text-muted-foreground/70">travelama.com</p>
            )}
          </div>
        </div>
      </div>

      {/* Branding Toggle */}
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <input
          type="checkbox"
          id="branding"
          checked={includeBranding}
          onChange={(e) => setIncludeBranding(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="branding" className="text-sm">
          <span className="font-medium">Include Travelama branding</span>
          <span className="ml-1 text-muted-foreground">
            — adds &quot;travelama.com&quot; to downloads
          </span>
        </label>
      </div>

      {/* Download Options */}
      <div className="border-t pt-6">
        <h3 className="mb-3 font-medium">Download QR Code</h3>

        {/* Size Selector */}
        <div className="mb-4">
          <label className="mb-2 block text-sm text-muted-foreground">Size (300dpi print quality)</label>
          <div className="flex flex-wrap gap-2">
            {(["small", "medium", "large"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  size === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-accent"
                }`}
              >
                {sizes[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Format Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={downloadPNG}>
            <Download className="mr-2 h-4 w-4" />
            PNG
          </Button>
          <Button variant="outline" onClick={downloadSVG}>
            <Download className="mr-2 h-4 w-4" />
            SVG
          </Button>
          <Button variant="outline" onClick={downloadPDF}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Print Templates */}
      <div className="border-t pt-6">
        <h3 className="mb-3 font-medium">Print Templates</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Professional print-ready templates with bleed marks for commercial printing.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Tent Card */}
          <div
            className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
              selectedTemplate === "tent-card"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedTemplate("tent-card")}
          >
            <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-md bg-muted">
              <div className="text-center text-xs text-muted-foreground">
                <div className="mb-1 font-medium">┌───────────────┐</div>
                <div>│  [QR CODE]  │</div>
                <div>│  Scan for   │</div>
                <div>│  Property   │</div>
                <div>│  Info       │</div>
                <div className="font-medium">└───────────────┘</div>
              </div>
            </div>
            <h4 className="font-medium">Tent Card</h4>
            <p className="text-xs text-muted-foreground">
              Foldable card for tables & counters
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={(e) => {
                e.stopPropagation();
                downloadTentCard();
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>

          {/* Wall Sign */}
          <div
            className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
              selectedTemplate === "wall-sign"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedTemplate("wall-sign")}
          >
            <div className="mb-3 flex aspect-[4/3] items-center justify-center rounded-md bg-muted">
              <div className="text-center text-xs text-muted-foreground">
                <div className="mb-1 font-medium">┌─────────────────┐</div>
                <div>│   Welcome!    │</div>
                <div>│   [QR CODE]   │</div>
                <div>│   Scan for    │</div>
                <div>│   everything  │</div>
                <div className="font-medium">└─────────────────┘</div>
              </div>
            </div>
            <h4 className="font-medium">Wall Sign</h4>
            <p className="text-xs text-muted-foreground">
              A5 portrait for walls & doors
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={(e) => {
                e.stopPropagation();
                downloadWallSign();
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Full Guide PDF Export */}
      <div className="border-t pt-6">
        <h3 className="mb-3 font-medium">Full Guide PDF</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Generate a complete PDF version of your guide to email to guests or print physical copies.
        </p>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Property Guide PDF</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Includes cover page, WiFi details, house rules, appliances, emergency contacts, and custom sections.
              </p>
            </div>
          </div>

          {/* Customization Options */}
          {showPdfOptions && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <h5 className="text-sm font-medium">Include in PDF:</h5>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { key: "includeWifi", label: "WiFi Details" },
                  { key: "includeRules", label: "House Rules" },
                  { key: "includeAppliances", label: "Appliances" },
                  { key: "includeEmergency", label: "Emergency Contacts" },
                  { key: "includeSections", label: "Custom Sections" },
                  { key: "includeMap", label: "Map" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={pdfOptions[key as keyof typeof pdfOptions]}
                      onChange={(e) =>
                        setPdfOptions((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div className="border-t pt-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={pdfOptions.includeBranding}
                    onChange={(e) =>
                      setPdfOptions((prev) => ({
                        ...prev,
                        includeBranding: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  Include Travelama branding
                </label>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={generateFullGuidePdf}
              disabled={isGeneratingPdf || !isPublished}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate & Download
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPdfOptions(!showPdfOptions)}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              {showPdfOptions ? "Hide Options" : "Customization Options"}
            </Button>
          </div>

          {!isPublished && (
            <p className="mt-3 text-xs text-amber-600">
              Publish your property to generate a PDF guide.
            </p>
          )}
        </div>
      </div>

      {/* Direct Link */}
      <div className="border-t pt-6">
        <h3 className="mb-3 font-medium">Direct Link</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={propertyUrl}
            className="flex-1 rounded-lg border border-border bg-muted px-4 py-2 text-sm"
          />
          <Button variant="outline" onClick={copyLink}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper to escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
