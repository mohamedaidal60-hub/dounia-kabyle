import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useSiteContent, buildWhatsappLink, DEFAULT_CONTENT } from "@/lib/site-content";
import { Leaf, Coffee, ChevronRight, Heart, Star, Sparkles, Shield, User, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${DEFAULT_CONTENT.name} — Beauté Naturelle & Santé Globale` },
      {
        name: "description",
        content:
          "Découvrez deux univers exceptionnels avec Dounia Kabyle : Les cosmétiques naturels ARVEA pour sublimer votre beauté, et les compléments au Ganoderma DXN pour booster votre santé.",
      },
      { property: "og:title", content: `${DEFAULT_CONTENT.name} — ARVEA & DXN` },
      {
        property: "og:description",
        content: "Découvrez deux univers exceptionnels avec Dounia Kabyle : ARVEA Nature et DXN Global.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Gateway,
});

function Gateway() {
  const [content] = useSiteContent();
  const [contactName, setContactName] = useState("");
  const [interest, setInterest] = useState("general");
  const [message, setMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log("Video auto-play delayed", err));
    }
  }, [content.gatewayVideoUrl]);

  const getWaHref = () => {
    let customText = `Bonjour Dounia, `;
    if (contactName) customText += `je suis ${contactName}. `;
    
    if (interest === "arvea") {
      customText += `Je suis intéressé(e) par l'univers ARVEA Nature. `;
    } else if (interest === "dxn") {
      customText += `Je suis intéressé(e) par l'univers DXN Global & Ganoderma. `;
    } else {
      customText += `Je vous contacte depuis votre site internet. `;
    }
    
    if (message) {
      customText += `${message}`;
    } else {
      customText += `Je souhaite en savoir plus sur vos produits et opportunités.`;
    }

    return buildWhatsappLink(content.whatsapp, customText);
  };

  const generalTestimonials = content.testimonials.filter(t => t.type === "general" || !t.type);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-gold selection:text-deep">
      
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 transition-all bg-deep/20 backdrop-blur-md border-b border-white/10">
        <div className="container-editorial flex items-center justify-between h-20">
          <Link to="/" className="font-serif text-2xl text-cream flex items-center gap-2 hover:opacity-90">
            <span className="font-light tracking-wide">{content.name}</span>
            <span className="text-gold font-bold">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-widest text-cream/90 uppercase">
            <Link to="/arvea" className="hover:text-gold transition flex items-center gap-1.5"><Leaf className="h-4 w-4" /> ARVEA</Link>
            <Link to="/dxn" className="hover:text-gold transition flex items-center gap-1.5"><Coffee className="h-4 w-4" /> DXN</Link>
            <a href="#about" className="hover:text-gold transition">À propos</a>
            <a href="#contact" className="hover:text-gold transition">Contact</a>
          </nav>
          <a
            href={buildWhatsappLink(content.whatsapp, "Bonjour Dounia, je souhaite vous contacter.")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest rounded-full px-5 py-2.5 bg-gold text-deep transition-all duration-300 hover:shadow-[0_0_15px_rgba(201,169,97,0.5)] hover:scale-105"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* HERO SECTION WITH BG VIDEO */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-24 md:pt-0 overflow-hidden">
        <div className="video-bg-container">
          <video
            ref={videoRef}
            src={content.gatewayVideoUrl}
            className="video-bg"
            loop
            muted
            playsInline
            autoPlay
          />
          <div className="video-overlay-main" />
        </div>

        <div className="container-editorial relative z-10 w-full py-16 flex flex-col items-center text-center">
          <div className="max-w-3xl animate-fade-in">
            <p className="eyebrow inline-flex items-center gap-2 text-gold">
              <Sparkles className="h-4 w-4" /> Bienvenue dans mon univers
            </p>
            <h1 className="mt-6 font-serif text-5xl md:text-7xl text-cream leading-[1.1] font-medium tracking-tight">
              {content.gatewayHeroTitle}
            </h1>
            <p className="mt-8 text-base md:text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed">
              {content.gatewayHeroSubtitle}
            </p>
          </div>

          {/* TWO MAIN PORTALS / CARDS */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 w-full max-w-4xl">
            {/* ARVEA PORTAL */}
            <Link
              to="/arvea"
              className="group relative overflow-hidden rounded-3xl p-8 md:p-12 glass-card text-left flex flex-col justify-between h-[360px] md:h-[400px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              {/* Card visual elements */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-gold">
                  <Leaf className="h-7 w-7" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/20">
                  Cosmétique Naturelle
                </span>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-3xl font-serif text-cream group-hover:text-gold transition duration-300">
                  ARVEA Nature
                </h3>
                <p className="mt-3 text-sm text-cream/70 line-clamp-3 leading-relaxed">
                  Soins du visage, du corps, maquillage et parfums haut de gamme. Profitez de produits sains à base d'Aloe Vera et d'Huile d'Argan, et découvrez l'opportunité de devenir conseillère.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-bold group-hover:translate-x-2 transition-transform duration-300">
                  Entrer dans l'univers Arvea <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* DXN PORTAL */}
            <Link
              to="/dxn"
              className="group relative overflow-hidden rounded-3xl p-8 md:p-12 glass-card text-left flex flex-col justify-between h-[360px] md:h-[400px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 via-amber-950/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              {/* Card visual elements */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="h-14 w-14 rounded-2xl bg-amber-950/50 border border-amber-500/20 flex items-center justify-center text-gold">
                  <Coffee className="h-7 w-7" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/20">
                  Santé & Vitalité
                </span>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-3xl font-serif text-cream group-hover:text-gold transition duration-300">
                  DXN Global
                </h3>
                <p className="mt-3 text-sm text-cream/70 line-clamp-3 leading-relaxed">
                  Boostez votre immunité avec le Reishi (Ganoderma). Découvrez notre café santé emblématique, nos suppléments de Spiruline et une opportunité de réseau internationale.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-bold group-hover:translate-x-2 transition-transform duration-300">
                  Entrer dans l'univers DXN <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-24 bg-card border-y border-border/50">
        <div className="container-editorial">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow"><span className="hairline mr-3" /> Mes Engagements</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">La nature, la science et l'humain</h2>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              En combinant les cosmétiques ARVEA et les suppléments de santé DXN, je vous propose une approche holistique de la beauté et du bien-être.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mt-16">
            {[
              {
                icon: <Sparkles className="h-6 w-6 text-gold" />,
                title: "Produits Certifiés & Sains",
                desc: "Des compositions riches en actifs naturels (aloe vera, argan, ganoderma reishi, spiruline) rigoureusement sélectionnés pour leurs bénéfices réels.",
              },
              {
                icon: <Shield className="h-6 w-6 text-gold" />,
                title: "Accompagnement Personnalisé",
                desc: "Que vous cherchiez la routine idéale ou à lancer votre propre activité indépendante, je suis à vos côtés pour vous former et vous conseiller.",
              },
              {
                icon: <Heart className="h-6 w-6 text-gold" />,
                title: "Opportunités Clés en Main",
                desc: "Rejoignez des réseaux solides avec d'excellents plans de commissionnement. Gagnez en liberté financière à votre propre rythme.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-background border border-border/60 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-forest/5 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-serif text-forest">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about" className="py-24 bg-background">
        <div className="container-editorial grid gap-16 md:grid-cols-12 items-center">
          <div className="md:col-span-5 relative flex justify-center">
            {/* Elegant visual placeholder representing Dounia */}
            <div className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-[var(--shadow-elegant)] bg-gradient-to-br from-forest to-deep flex flex-col justify-end p-8 text-cream">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/30 via-transparent to-transparent" />
              <div className="absolute top-6 left-6 h-12 w-12 rounded-full border border-cream/20 grid place-items-center font-serif text-xl font-medium text-gold bg-deep/50 backdrop-blur">
                DK
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-serif">{content.name}</div>
                <div className="text-xs uppercase tracking-widest text-gold mt-1 font-bold">Conseillère Experte</div>
                <div className="h-px bg-white/20 my-4" />
                <p className="text-xs text-cream/70 italic leading-relaxed">
                  "Ma mission est de vous aider à vous sentir bien dans votre peau et épanoui(e) dans votre vie professionnelle."
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <p className="eyebrow"><span className="hairline mr-3" /> Votre Conseillère</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Qui est Dounia Kabyle ?</h2>
            <p className="mt-6 text-muted-foreground text-sm md:text-base leading-relaxed">
              Passionnée par le bien-être naturel et l'entrepreneuriat solidaire, je conseille et j'accompagne des centaines de personnes dans leur cheminement beauté et santé. 
            </p>
            <p className="mt-4 text-muted-foreground text-sm md:text-base leading-relaxed">
              À travers **ARVEA Nature**, je vous guide vers une cosmétique propre et sensorielle. À travers **DXN Global**, je vous invite à découvrir la nutrition préventive et l'excellence thérapeutique du Ganoderma pour régénérer votre métabolisme.
            </p>
            
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border/80 pt-8">
              <div>
                <div className="text-3xl font-serif text-forest font-bold">500+</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Clients Conseillés</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-forest font-bold">ARVEA & DXN</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Synergie Parfaite</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTAL TESTIMONIALS */}
      {generalTestimonials.length > 0 && (
        <section className="py-24 bg-forest text-cream">
          <div className="container-editorial">
            <div className="text-center max-w-2xl mx-auto">
              <p className="eyebrow"><span className="hairline mr-3" /> Témoignages</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">Une confiance partagée</h2>
            </div>
            
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {generalTestimonials.map((t, i) => (
                <figure key={i} className="rounded-3xl bg-cream/5 border border-cream/10 p-8 backdrop-blur flex flex-col justify-between">
                  <div>
                    <div className="text-gold text-4xl font-serif leading-none">“</div>
                    <blockquote className="mt-3 text-sm leading-relaxed text-cream/90 italic">
                      {t.text}
                    </blockquote>
                  </div>
                  <figcaption className="mt-8 pt-4 border-t border-cream/10 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gold/10 border border-gold/30 grid place-items-center text-gold font-serif text-sm font-semibold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-serif text-base text-cream">{t.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-cream/50">{t.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GENERAL CONTACT */}
      <section id="contact" className="py-24 bg-card">
        <div className="container-editorial grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5 flex flex-col justify-center">
            <p className="eyebrow"><span className="hairline mr-3" /> Contact direct</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Commençons à échanger</h2>
            <p className="mt-6 text-muted-foreground text-sm leading-relaxed">
              Une question sur les cosmétiques ARVEA, envie de commander du café DXN, ou intéressé(e) par l'opportunité de générer un revenu complémentaire ? Envoyez-moi un message, je réponds personnellement sous quelques heures.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="h-10 w-10 rounded-full bg-forest text-cream grid place-items-center font-bold">WA</span>
                <div>
                  <div className="text-xs uppercase text-muted-foreground font-semibold">WhatsApp Direct</div>
                  <a href={buildWhatsappLink(content.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-forest font-bold hover:underline">
                    {content.whatsappDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.open(getWaHref(), "_blank", "noopener,noreferrer");
              }}
              className="rounded-3xl bg-background border border-border p-8 md:p-10 shadow-sm space-y-5"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Votre Prénom</label>
                  <input
                    required
                    maxLength={80}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Sujet d'intérêt</label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="general">Renseignements généraux</option>
                    <option value="arvea">ARVEA Nature (Beauté & Cosmétique)</option>
                    <option value="dxn">DXN Global (Compléments & Café Santé)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Votre Message</label>
                <textarea
                  required
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                  placeholder="Expliquez en quelques mots votre demande..."
                />
              </div>

              <button type="submit" className="w-full btn-gold">
                <MessageCircle className="h-4 w-4" /> Envoyer sur WhatsApp
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                Le formulaire ouvre WhatsApp sur votre téléphone ou PC avec votre message pré-rempli.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border/80 bg-deep text-cream/70 text-sm">
        <div className="container-editorial py-16 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-serif text-3xl text-cream font-light">
              {content.name}<span className="text-gold font-bold">.</span>
            </div>
            <p className="mt-3 text-cream/60 max-w-sm text-xs leading-relaxed">{content.tagline}</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-gold font-bold">Navigation</div>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link to="/arvea" className="hover:text-cream transition">ARVEA Nature</Link></li>
              <li><Link to="/dxn" className="hover:text-cream transition">DXN Global</Link></li>
              <li><a href="#about" className="hover:text-cream transition">À propos de Dounia</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-gold font-bold">Contact</div>
            <ul className="mt-4 space-y-2 text-xs">
              <li>WhatsApp: {content.whatsappDisplay}</li>
              <li>Sponsor: {content.arveaAffiliateCode}</li>
              <li>
                <Link to="/admin" className="hover:text-gold transition font-bold text-cream">
                  Accès Administrateur
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-6">
          <div className="container-editorial flex items-center justify-between text-xs text-cream/40">
            <div>© {new Date().getFullYear()} {content.name}. Tous droits réservés.</div>
            <div>Créé pour votre bien-être</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
