import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useSiteContent, buildWhatsappLink, type Product } from "@/lib/site-content";
import { AnimatedCanvas } from "@/components/AnimatedCanvas";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { ShoppingBag, ArrowLeft, Coffee, Heart, Plus, Minus, Trash2, CheckCircle2, Copy, Sparkles, ShoppingCart, Send, UserCheck, Shield } from "lucide-react";

export const Route = createFileRoute("/dxn")({
  head: () => ({
    meta: [
      { title: "DXN Global & Reishi — Santé & Vitalité avec Dounia Kabyle" },
      {
        name: "description",
        content:
          "Découvrez les produits bien-être et santé de DXN (Café au Ganoderma Reishi, Spiruline). Commandez en direct via WhatsApp et inscrivez-vous avec le code sponsor de Dounia.",
      },
    ],
  }),
  component: DxnPage,
});

type CartItem = {
  product: Product;
  quantity: number;
};

function DxnPage() {
  const [content] = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sponsor registration form
  const [regName, setRegName] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regMsg, setRegMsg] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log("Video auto-play delayed", err));
    }
  }, [content.dxnVideoUrl]);

  // Categories extraction
  const categories = ["Tous", ...Array.from(new Set(content.dxnProducts.map((p) => p.category)))];

  // Filtering products
  const filteredProducts = selectedCategory === "Tous"
    ? content.dxnProducts
    : content.dxnProducts.filter((p) => p.category === selectedCategory);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0).toFixed(2);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    let text = `Bonjour Dounia, je souhaite commander les produits DXN suivants depuis votre site :\n\n`;
    cart.forEach((item) => {
      text += `- ${item.quantity}x ${item.product.title} (${item.product.price} €/unité)\n`;
    });
    text += `\nTotal estimé : ${getCartTotal()} €\n\nMerci de me recontacter pour finaliser ma commande.`;
    window.open(buildWhatsappLink(content.whatsapp, text), "_blank", "noopener,noreferrer");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `Bonjour Dounia, je souhaite m'inscrire en tant que membre DXN sous votre parrainage.\n\n`;
    text += `Nom : ${regName}\n`;
    text += `Ville/Région : ${regCity}\n`;
    text += `Téléphone : ${regPhone}\n`;
    if (regMsg) text += `Motivation : ${regMsg}\n`;
    text += `\nMerci de me guider dans la procédure d'inscription avec votre Code Sponsor : ${content.dxnSponsorCode}.`;
    window.open(buildWhatsappLink(content.whatsapp, text), "_blank", "noopener,noreferrer");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(content.dxnSponsorCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dxnTestimonials = content.testimonials.filter(t => t.type === "dxn");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-amber-800 selection:text-cream relative">

      {/* NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 transition-all bg-stone-950/80 backdrop-blur-md border-b border-white/10 text-cream">
        <div className="container-editorial flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 hover:opacity-85 text-cream transition">
            <ArrowLeft className="h-5 w-5 text-gold" />
            <span className="text-xs uppercase font-bold tracking-widest hidden sm:inline">Accueil</span>
          </Link>
          <div className="font-serif text-xl md:text-2xl text-cream flex items-center gap-2">
            <span className="font-light tracking-wide">{content.name}</span>
            <span className="text-gold font-bold">·</span>
            <span className="font-semibold text-amber-500">DXN</span>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition flex items-center justify-center"
          >
            <ShoppingCart className="h-5 w-5" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-deep text-[10px] font-bold grid place-items-center animate-pulse">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO SECTION WITH VIDEO + AMBER CANVAS OVERLAY */}
      <section className="relative min-h-[65vh] flex items-center pt-20 overflow-hidden">
        <div className="video-bg-container">
          <video
            ref={videoRef}
            src={content.dxnVideoUrl}
            className="video-bg"
            loop
            muted
            playsInline
            autoPlay
          />
          <div className="video-overlay-dxn" />
        </div>

        {/* 60fps Amber/Gold Particle Canvas */}
        <AnimatedCanvas theme="dxn" />

        <div className="container-editorial relative z-10 py-16 text-center text-cream">
          <p className="eyebrow text-amber-400 flex items-center justify-center gap-2 animate-float">
            <Coffee className="h-4 w-4 text-amber-400" /> Santé, Vitalité & Énergie
          </p>
          <h1 className="mt-6 font-serif text-5xl md:text-7xl font-bold tracking-tight">
            {content.dxnHeroTitle}
          </h1>
          <p className="mt-6 text-base md:text-lg max-w-xl mx-auto text-cream/85 leading-relaxed font-light">
            {content.dxnHeroSubtitle}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="#shop" className="btn-dxn-red">
              Boutique Ganoderma
            </a>
            <a href="#opportunity" className="btn-secondary-custom">
              Rejoindre le Réseau
            </a>
          </div>
        </div>
      </section>

      {/* MARQUEE TICKER */}
      <MarqueeTicker theme="dxn" items={[
        "CAFÉ ALCALIN AU GANODERMA REISHI",
        "SUPER-ALIMENT SPIRULINE PUR",
        "RÉSEAU GLOBAL DXN EN PLUS DE 180 PAYS",
        "ACCOMPAGNEMENT D'ÉQUIPE AVEC DOUNIA KABYLE",
      ]} />

      {/* BRAND PRESENTATION WITH REAL IMAGE */}
      <section className="py-24 bg-card border-b border-border/50">
        <div className="container-editorial grid gap-12 md:grid-cols-2 items-center">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              La Puissance du Reishi
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-amber-950">Champignons Thérapeutiques & Nutrition</h2>
            <p className="mt-6 text-muted-foreground text-sm leading-relaxed">
              {content.dxnText}
            </p>
            <ul className="mt-8 space-y-4 text-sm font-medium">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-700" /> Booster d'immunité et régulateur métabolique
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-700" /> Désintoxication en douceur et équilibre cellulaire
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-700" /> Boissons saines alcalines brevetées
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-neutral-900 p-8 text-cream shadow-xl flex flex-col justify-between h-[360px] relative overflow-hidden group">
            <img src="/images/dxn_hero.jpg" alt="DXN Coffee & Ganoderma" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />

            <div className="relative z-10">
              <Shield className="h-8 w-8 text-gold" />
              <h3 className="text-2xl font-serif mt-4">Inscription Officielle Membre</h3>
              <p className="mt-2 text-xs text-cream/80 leading-relaxed">
                Devenez membre DXN directement via la plateforme eWorld internationale. Commandez à prix d'usine et commencez à parrainer mondialement.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 items-center relative z-10">
              <a
                href={content.dxnRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold !py-3.5 !px-6 !text-xs"
              >
                S'inscrire sur eWorld
              </a>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2 border border-white/20 bg-white/10 hover:bg-white/20 rounded-full px-5 py-3 text-xs tracking-wider uppercase font-semibold text-cream transition"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copié !" : `Code Sponsor : ${content.dxnSponsorCode}`}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT CATALOG */}
      <section id="shop" className="py-24 bg-background">
        <div className="container-editorial">
          <div className="text-center max-w-xl mx-auto">
            <p className="eyebrow text-gold"><span className="hairline mr-3" /> Nutrition & Énergie</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-amber-950">Le Catalogue Bien-être DXN</h2>
            <p className="mt-3 text-muted-foreground text-sm">
              Cafés fins au Ganoderma, Spiruline, compléments alimentaires et hygiène. Ajoutez au panier et commandez par WhatsApp.
            </p>
          </div>

          {/* Filters */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? "bg-amber-900 text-cream shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filteredProducts.map((p) => (
              <div key={p.id} className="rounded-3xl bg-card border border-border/80 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                      src={p.image || "/images/dxn_coffee.jpg"}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-amber-900/90 backdrop-blur-sm text-cream px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border border-white/10">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-serif font-bold text-amber-950 leading-snug">{p.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">{p.description}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center justify-between border-t border-border/40 mt-4">
                  <div className="text-xl font-serif text-amber-950 font-bold">{p.price} €</div>
                  <button
                    onClick={() => addToCart(p)}
                    className="inline-flex items-center gap-1.5 bg-amber-900 text-cream text-[10px] uppercase font-bold tracking-widest px-4 py-2.5 rounded-full hover:bg-amber-950 hover:scale-[1.03] transition shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" /> Ajouter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MLM OPPORTUNITY */}
      <section id="opportunity" className="py-24 bg-neutral-900 text-cream relative">
        <div className="container-editorial grid gap-16 md:grid-cols-2 items-center">
          <div>
            <p className="eyebrow text-gold"><span className="hairline mr-3" /> Un Réseau Mondial</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Rejoignez l'Opportunité Globale DXN</h2>
            <p className="mt-6 text-cream/80 text-sm leading-relaxed">
              DXN est présent dans plus de 180 pays. En devenant distributeur indépendant sous mon parrainage, vous intégrez un réseau mondial d'entraide et de réussite :
            </p>
            <div className="mt-8 space-y-6">
              {[
                { t: "Un Code Unique Mondial", d: "Votre code membre est valable partout. Parrainez des personnes en Europe, Afrique, ou Asie en toute simplicité." },
                { t: "Un Plan de Carrière Éprouvé", d: "Bénéficiez de bonus de groupe, bonus de développement, et partage des bénéfices mondiaux de l'entreprise." },
                { t: "Santé & Richesse", d: "Diffusez des produits de santé quotidiens (cafés alcalins, compléments essentiels) à forte récurrence d'achat." }
              ].map((b, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full border border-gold/30 grid place-items-center font-bold text-gold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-gold font-bold">{b.t}</h3>
                    <p className="text-xs text-cream/70 mt-1 leading-relaxed">{b.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="register-form" className="rounded-3xl bg-cream p-8 md:p-10 text-deep shadow-2xl">
            <h3 className="font-serif text-3xl text-amber-950">Accompagnement Inscription</h3>
            <p className="mt-2 text-xs text-muted-foreground">Laissez-moi vos coordonnées pour recevoir un guide pas-à-pas ou pour que je crée votre compte avec vous.</p>

            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Nom & Prénom</label>
                <input
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm focus:outline-none"
                  placeholder="Ex : Karim Bouzid"
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Ville & Pays</label>
                  <input
                    required
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm focus:outline-none"
                    placeholder="Ex : Marseille, France"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">N° Téléphone</label>
                  <input
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm focus:outline-none"
                    placeholder="Ex : +33..."
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Votre projet ou questions</label>
                <textarea
                  value={regMsg}
                  onChange={(e) => setRegMsg(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm focus:outline-none resize-none"
                  placeholder="Consommer à prix usine, vendre en réseau..."
                />
              </div>
              <button type="submit" className="w-full btn-gold !py-3.5 mt-2 flex items-center justify-center gap-2">
                <UserCheck className="h-4 w-4" /> Demander l'inscription WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {dxnTestimonials.length > 0 && (
        <section className="py-24 bg-card">
          <div className="container-editorial">
            <div className="text-center max-w-xl mx-auto">
              <p className="eyebrow text-gold"><span className="hairline mr-3" /> Avis Clients</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-amber-950">Ils partagent leur vitalité</h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {dxnTestimonials.map((t, idx) => (
                <div key={idx} className="bg-background border border-border/80 p-8 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition">
                  <p className="text-sm italic text-muted-foreground leading-relaxed">"{t.text}"</p>
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-amber-900/10 text-amber-950 grid place-items-center text-xs font-bold font-serif">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-amber-950">{t.name}</h4>
                      <p className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CART SIDEBAR / DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden text-deep">
          <div className="absolute inset-0 bg-deep/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-card shadow-2xl flex flex-col justify-between animate-slide-in-right">

              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-serif text-2xl text-amber-950 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-gold" /> Votre Panier DXN
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-muted-foreground hover:text-deep text-xs font-bold uppercase tracking-wider">
                  Fermer
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 py-6 overflow-y-auto px-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground/35 mb-4" />
                    <p className="text-sm">Votre panier DXN est vide.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-xs font-bold text-amber-900 uppercase tracking-widest hover:underline"
                    >
                      Voir le catalogue
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border border-border/60 p-4 rounded-2xl bg-background shadow-sm items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-serif font-bold text-amber-950 leading-snug">{item.product.title}</h4>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.product.price} € / unité</div>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="h-6 w-6 rounded-full border border-border grid place-items-center hover:bg-secondary text-xs font-bold"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="h-6 w-6 rounded-full border border-border grid place-items-center hover:bg-secondary text-xs font-bold"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-3">
                        <div className="text-sm font-serif font-bold text-amber-950">
                          {(parseFloat(item.product.price) * item.quantity).toFixed(2)} €
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-muted-foreground hover:text-destructive transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary & Send */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-border bg-secondary/35 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-muted-foreground">Total Estimé</span>
                    <span className="text-xl font-serif font-bold text-amber-950">{getCartTotal()} €</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    En cliquant ci-dessous, la liste de vos produits DXN sera compilée dans un message WhatsApp pré-rempli pour Dounia.
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-gold !py-4 flex items-center justify-center gap-2 font-bold"
                  >
                    <Send className="h-4 w-4" /> Commander via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
