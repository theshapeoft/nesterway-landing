import {
  Wifi,
  QrCode,
  MapPin,
  Download,
  ClipboardList,
  Phone,
  LogOut,
  Wrench,
  PlusCircle,
  Smartphone,
  LayoutGrid,
  Image
} from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { Feature } from "@/lib/data/features";

const iconMap = {
  wifi: Wifi,
  qrcode: QrCode,
  'map-pin': MapPin,
  download: Download,
  'clipboard-list': ClipboardList,
  phone: Phone,
  'log-out': LogOut,
  tool: Wrench,
  'plus-circle': PlusCircle,
  smartphone: Smartphone,
  'layout-grid': LayoutGrid,
  image: Image
};

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = iconMap[feature.icon as keyof typeof iconMap] || QrCode;

  return (
    <Card className="group border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-ocean-100 text-ocean-600 flex items-center justify-center mb-4 group-hover:bg-ocean-600 group-hover:text-white transition-colors">
          <Icon className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
}
