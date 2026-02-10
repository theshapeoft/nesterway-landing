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
  Image,
  RefreshCw,
  Palette
} from "lucide-react";
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
  image: Image,
  sync: RefreshCw,
  palette: Palette
};

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = iconMap[feature.icon as keyof typeof iconMap] || QrCode;

  return (
    <div className="group p-8 rounded-2xl bg-sand-50 hover:bg-sand-100 transition-all duration-300 hover:-translate-y-1">
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-ocean-500/10 text-ocean-600 flex items-center justify-center mb-6 group-hover:bg-ocean-600 group-hover:text-white transition-colors duration-300">
        <Icon className="w-7 h-7" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-neutral-900 mb-3">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-neutral-600 leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}
