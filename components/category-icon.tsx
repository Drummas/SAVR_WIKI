import {
  Biohazard,
  BookOpen,
  Boxes,
  Crosshair,
  Flag,
  HelpCircle,
  ImageIcon,
  Landmark,
  Radar,
  Radiation,
  Shield,
  Swords,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "Survival Battle": Radar,
  "Alliance vs Alliance": Swords,
  "State Events": Landmark,
  "Plague Events": Biohazard,
  "Doomsday Challenge": Radiation,
  "Resource Events": Boxes,
  "Hero Events": Shield,
  "Alliance Events": Users,
  Events: Radar,
  Guides: BookOpen,
  Strategies: Crosshair,
  FAQ: HelpCircle,
  "Image Library": ImageIcon,
  Calendar: Flag,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const Icon = iconMap[category] ?? Crosshair;
  return <Icon className={className} aria-hidden="true" />;
}
