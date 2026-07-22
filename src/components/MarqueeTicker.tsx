import React from "react";
import { Sparkles, Leaf, Coffee, Award, Star } from "lucide-react";

interface MarqueeProps {
  items?: string[];
  theme?: "arvea" | "dxn" | "gold";
}

export const MarqueeTicker: React.FC<MarqueeProps> = ({
  items = [
    "ARVEA NATURE 🌿 100% BIO & NATUREL",
    "DXN GLOBAL ☕ CAFÉ AU GANODERMA REISHI",
    "ACCOMPAGNEMENT PERSONNALISÉ DOUNIA KABYLE",
    "LIVRAISON RAPIDE & CONSEILS SUR-MESURE",
    "OPPORTUNITÉ DE REVENU COMPLÉMENTAIRE",
  ],
  theme = "gold",
}) => {
  const bgClass =
    theme === "arvea"
      ? "bg-emerald-950 text-emerald-300 border-emerald-800/40"
      : theme === "dxn"
      ? "bg-neutral-950 text-amber-300 border-amber-800/40"
      : "bg-deep text-gold border-gold/20";

  return (
    <div className={`w-full overflow-hidden border-y py-4 ${bgClass} uppercase tracking-[0.25em] text-xs font-bold font-serif shadow-inner`}>
      <div className="flex w-max animate-marquee space-x-12 whitespace-nowrap">
        {[...items, ...items, ...items].map((text, idx) => (
          <span key={idx} className="flex items-center gap-4">
            <span>{text}</span>
            <Sparkles className="h-3.5 w-3.5 opacity-70" />
          </span>
        ))}
      </div>
    </div>
  );
};
