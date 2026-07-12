import type { LucideIcon } from "lucide-react";
import {
  CarFront,
  Coffee,
  Film,
  Flag,
  Flame,
  PawPrint,
  Sparkles,
  TreePine,
  UtensilsCrossed,
  Waves,
  Wifi,
} from "lucide-react";

const amenityIcons: Record<string, LucideIcon> = {
  trees: TreePine,
  flame: Flame,
  waves: Waves,
  wifi: Wifi,
  car: CarFront,
  utensils: UtensilsCrossed,
  coffee: Coffee,
  film: Film,
  flag: Flag,
  "paw-print": PawPrint,
  sparkles: Sparkles,
};

export function getAmenityIcon(icon?: string | null) {
  if (!icon) return Sparkles;
  return amenityIcons[icon] ?? Sparkles;
}
