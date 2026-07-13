import {
  Bug,
  Clapperboard,
  Flame,
  Fish,
  Flag,
  Map,
  Music2,
  PlugZap,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceId =
  | "apitherapy"
  | "miniGolf"
  | "openAirCinema"
  | "fishFeeding"
  | "silentParty"
  | "bonfireEvening"
  | "ecoEthnoKitchen"
  | "geepTour"
  | "evChargingParking"
  | "starlinkWifi";

export type ServiceDefinition = {
  id: ServiceId;
  icon: LucideIcon;
};

export const serviceDefinitions: ServiceDefinition[] = [
  { id: "apitherapy", icon: Bug },
  { id: "miniGolf", icon: Flag },
  { id: "openAirCinema", icon: Clapperboard },
  { id: "fishFeeding", icon: Fish },
  { id: "silentParty", icon: Music2 },
  { id: "bonfireEvening", icon: Flame },
  { id: "ecoEthnoKitchen", icon: UtensilsCrossed },
  { id: "geepTour", icon: Map },
  { id: "evChargingParking", icon: PlugZap },
  { id: "starlinkWifi", icon: Wifi },
];
