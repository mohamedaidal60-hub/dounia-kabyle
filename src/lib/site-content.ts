import { useEffect, useState } from "react";

export type Product = {
  id: string;
  title: string;
  category: string;
  price: string;
  description: string;
  image?: string;
};

export type Testimonial = {
  name: string;
  text: string;
  role: string;
  type: "arvea" | "dxn" | "general";
};

export type SiteContent = {
  name: string;
  tagline: string;
  whatsapp: string; // digits with country code, e.g. 33793133650
  whatsappDisplay: string;
  
  // Gateway Portal
  gatewayHeroTitle: string;
  gatewayHeroSubtitle: string;
  gatewayVideoUrl: string;

  // ARVEA Nature
  arveaHeroTitle: string;
  arveaHeroSubtitle: string;
  arveaText: string;
  arveaAffiliateUrl: string;
  arveaAffiliateCode: string;
  arveaVideoUrl: string;
  arveaProducts: Product[];

  // DXN Global
  dxnHeroTitle: string;
  dxnHeroSubtitle: string;
  dxnText: string;
  dxnSponsorCode: string;
  dxnRegistrationUrl: string;
  dxnVideoUrl: string;
  dxnProducts: Product[];

  // Testimonials
  testimonials: Testimonial[];
};

export const DEFAULT_CONTENT: SiteContent = {
  name: "Dounia Kabyle",
  tagline: "Conseillère en beauté naturelle & bien-être",
  whatsapp: "33793133650",
  whatsappDisplay: "07 93 13 36 50",

  // Gateway
  gatewayHeroTitle: "Votre voyage vers le bien-être & l'indépendance",
  gatewayHeroSubtitle: "Découvrez des soins naturels de haute qualité avec ARVEA et explorez la puissance de la santé globale avec les compléments DXN. Deux opportunités d'épanouissement guidées par votre conseillère Dounia.",
  gatewayVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-green-and-gold-liquid-background-40019-large.mp4",

  // ARVEA
  arveaHeroTitle: "ARVEA Nature",
  arveaHeroSubtitle: "Le meilleur de la nature pour votre peau. Cosmétiques naturels, soins bien-être et parfums délicats.",
  arveaText: "ARVEA Nature propose une gamme complète de cosmétiques à base d'ingrédients naturels de haute qualité comme l'aloe vera et l'huile d'argan : soins visage, corps, cheveux, parfums et maquillage. Une routine bien-être authentique, testée et approuvée.",
  arveaAffiliateUrl: "https://arvea-nature.com/fr?ref=00349352",
  arveaAffiliateCode: "830182824",
  arveaVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-water-droplets-on-leaves-42247-large.mp4",
  arveaProducts: [
    {
      id: "arvea-1",
      title: "Gel Nettoyant Aloe Vera",
      category: "Soins Visage",
      price: "12.90",
      description: "Nettoie en profondeur tout en respectant le pH naturel de la peau. Enrichi à l'aloe vera pour hydrater et apaiser les peaux sensibles.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "arvea-2",
      title: "Crème Gommante Exfoliante",
      category: "Soins Visage",
      price: "14.50",
      description: "Élimine les cellules mortes et affine le grain de peau grâce à des micro-particules douces et naturelles de noyaux d'abricot.",
      image: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "arvea-3",
      title: "Lait Corporel Hydratant Miracle",
      category: "Soins Corps",
      price: "18.00",
      description: "Une formule ultra-riche à base de beurre de karité et d'aloe vera qui nourrit intensément les peaux sèches et abîmées.",
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "arvea-4",
      title: "Shampoing Nourrissant Huile d'Argan",
      category: "Cheveux",
      price: "11.20",
      description: "Répare et fortifie les cheveux secs ou abîmés de la racine aux pointes, leur redonnant brillance et douceur.",
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "arvea-5",
      title: "Parfum Unique pour Elle",
      category: "Parfums",
      price: "24.90",
      description: "Une fragrance florale et fruitée irrésistible, mêlant des notes fraîches de jasmin et de vanille pour une élégance quotidienne.",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop"
    }
  ],

  // DXN
  dxnHeroTitle: "DXN Global & Ganoderma",
  dxnHeroSubtitle: "La force des champignons thérapeutiques au service de votre santé et énergie au quotidien.",
  dxnText: "DXN est mondialement réputé pour ses produits de santé à base de Ganoderma Lucidum (Reishi). Connu pour renforcer le système immunitaire, détoxifier le corps et améliorer la vitalité générale grâce à des boissons (cafés, thés), des compléments alimentaires et des soins d'hygiène.",
  dxnSponsorCode: "830182824",
  dxnRegistrationUrl: "https://eworld.dxn2u.com/index.php?r=account%2Fregister&s_id=830182824&s_name=Dounia&lang=fr",
  dxnVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cup-of-coffee-brewing-close-up-39909-large.mp4",
  dxnProducts: [
    {
      id: "dxn-1",
      title: "Café Lingzhi 3-en-1 au Ganoderma",
      category: "Cafés & Boissons",
      price: "19.50",
      description: "Mélange raffiné de grains de café de qualité supérieure, de crème végétale et d'extrait de pur Ganoderma. Un délice fortifiant et digeste.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "dxn-2",
      title: "Café Noir Lingzhi 2-en-1 (Sans sucre)",
      category: "Cafés & Boissons",
      price: "18.90",
      description: "Café noir instantané de qualité gourmande infusé à l'extrait de Ganoderma. Parfait pour les amateurs de café fort, sain et sans sucre.",
      image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "dxn-3",
      title: "Cocozhi (Boisson au Cacao)",
      category: "Cafés & Boissons",
      price: "22.00",
      description: "Boisson au chocolat riche en cacao de qualité supérieure avec des extraits de Ganoderma. Idéale pour toute la famille, apporte énergie et concentration.",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "dxn-4",
      title: "Spiruline DXN en Comprimés",
      category: "Compléments",
      price: "34.00",
      description: "Super-aliment 100% naturel riche en protéines, vitamines et antioxydants. Idéal pour combler les carences, détoxifier et booster le tonus musculaire.",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "dxn-5",
      title: "Savon Ganozhi au Ganoderma",
      category: "Soins Personnels",
      price: "8.50",
      description: "Enrichi en extrait de Ganoderma et huile de palme, nettoie la peau en douceur tout en préservant son hydratation et son élasticité naturelle.",
      image: "https://images.unsplash.com/photo-1607006342411-b01354179923?q=80&w=600&auto=format&fit=crop"
    }
  ],

  // Testimonials
  testimonials: [
    {
      name: "Amina L.",
      role: "Cliente fidèle",
      text: "Ma peau n'a jamais été aussi éclatante. Les produits ARVEA sont doux, efficaces et je sens vraiment la différence après quelques semaines.",
      type: "arvea"
    },
    {
      name: "Karim B.",
      role: "Client",
      text: "Enfin des produits naturels qui tiennent leurs promesses. Le parfum Arvea est mon coup de cœur, je ne peux plus m'en passer.",
      type: "arvea"
    },
    {
      name: "Sofia M.",
      role: "Partenaire Beauté",
      text: "Grâce à Dounia, j'ai lancé mon activité de conseillère ARVEA en toute sérénité. Un accompagnement humain et précieux.",
      type: "arvea"
    },
    {
      name: "Jean-Pierre D.",
      role: "Adepte du Café Lingzhi",
      text: "Le Café Noir de DXN a complètement changé mes matins. Plus d'acidité d'estomac, beaucoup plus d'énergie constante sans palpitations.",
      type: "dxn"
    },
    {
      name: "Nadia T.",
      role: "Consommatrice Spiruline",
      text: "Je prends la spiruline DXN depuis 3 mois. Ma fatigue chronique a disparu, ma peau et mes cheveux se portent nettement mieux.",
      type: "dxn"
    },
    {
      name: "Fatima Z.",
      role: "Cliente & Distributrice",
      text: "Dounia est une conseillère hors pair. Elle connaît ses produits par cœur, que ce soit pour la beauté ou la santé globale.",
      type: "general"
    }
  ]
};

const STORAGE_KEY = "site-content-v2";

export function loadContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONTENT,
      ...parsed,
      // Merge sub-arrays to make sure schema upgrades don't cause undefined arrays
      arveaProducts: parsed.arveaProducts || DEFAULT_CONTENT.arveaProducts,
      dxnProducts: parsed.dxnProducts || DEFAULT_CONTENT.dxnProducts,
      testimonials: parsed.testimonials || DEFAULT_CONTENT.testimonials
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveContent(c: SiteContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  window.dispatchEvent(new Event("site-content-updated"));
}

export function useSiteContent(): [SiteContent, (c: SiteContent) => void] {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  useEffect(() => {
    setContent(loadContent());
    const onUpdate = () => setContent(loadContent());
    window.addEventListener("site-content-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("site-content-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);
  return [content, (c) => { saveContent(c); setContent(c); }];
}

export function buildWhatsappLink(phone: string, message = "") {
  const digits = phone.replace(/\D/g, "");
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${q}`;
}
