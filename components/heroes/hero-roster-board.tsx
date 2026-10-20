import { HeroRoster } from "@/components/heroes/hero-roster";
import { getHeroes } from "@/lib/heroes";

/** Server wrapper so the MDX body can drop the roster in without props. */
export function HeroRosterBoard() {
  return <HeroRoster heroes={getHeroes()} />;
}
