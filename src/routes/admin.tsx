import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSiteContent, DEFAULT_CONTENT, type SiteContent, type Product, type Testimonial } from "@/lib/site-content";
import { Plus, Trash2, Edit2, Download, RefreshCw, LogOut, LayoutGrid, Leaf, Coffee, MessageSquare, Settings, Save, Check } from "lucide-react";

const ADMIN_PASSWORD = "Azerty2026";
const AUTH_KEY = "admin-auth-v2";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Dounia Kabyle" },
      { name: "description", content: "Panneau d'administration sécurisé." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === "1") setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === ADMIN_PASSWORD) {
              sessionStorage.setItem(AUTH_KEY, "1");
              setAuthed(true);
            } else {
              setError(true);
            }
          }}
          className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]"
        >
          <div className="font-serif text-3xl text-forest">Accès Admin</div>
          <p className="mt-2 text-xs text-muted-foreground">Veuillez entrer le mot de passe d'administration.</p>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            className="mt-6 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            placeholder="Mot de passe"
          />
          {error && <p className="mt-2 text-xs text-destructive">Mot de passe incorrect.</p>}
          <button type="submit" className="btn-gold mt-6 w-full text-xs font-bold uppercase tracking-wider">Entrer</button>
          <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-forest transition">← Retour au site</Link>
        </form>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [content, setContent] = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [activeTab, setActiveTab] = useState<"general" | "arvea" | "dxn" | "testimonials" | "save">("general");
  const [saved, setSaved] = useState(false);

  // Editing forms state
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    title: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    name: "",
    role: "",
    text: "",
    type: "general"
  });

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const update = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  // Save/Reset
  const save = () => {
    setContent(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const reset = () => {
    if (confirm("Voulez-vous réinitialiser tout le contenu aux valeurs d'usine ? Les modifications locales seront perdues.")) {
      setContent(DEFAULT_CONTENT);
      setDraft(DEFAULT_CONTENT);
    }
  };

  // Product Operations
  const handleAddProduct = (brand: "arvea" | "dxn") => {
    if (!newProduct.title || !newProduct.price) {
      alert("Le titre et le prix sont obligatoires.");
      return;
    }
    const productListKey = brand === "arvea" ? "arveaProducts" : "dxnProducts";
    const productWithId: Product = {
      ...newProduct,
      id: `${brand}-${Date.now()}`
    };

    setDraft((prev) => ({
      ...prev,
      [productListKey]: [...prev[productListKey], productWithId]
    }));

    setNewProduct({ title: "", category: "", price: "", description: "", image: "" });
  };

  const handleDeleteProduct = (brand: "arvea" | "dxn", id: string) => {
    const productListKey = brand === "arvea" ? "arveaProducts" : "dxnProducts";
    setDraft((prev) => ({
      ...prev,
      [productListKey]: prev[productListKey].filter((p) => p.id !== id)
    }));
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setNewProduct({
      title: p.title,
      category: p.category,
      price: p.price,
      description: p.description,
      image: p.image || ""
    });
  };

  const handleSaveEditProduct = (brand: "arvea" | "dxn") => {
    if (!editingProductId) return;
    const productListKey = brand === "arvea" ? "arveaProducts" : "dxnProducts";
    setDraft((prev) => ({
      ...prev,
      [productListKey]: prev[productListKey].map((p) =>
        p.id === editingProductId ? { ...p, ...newProduct } : p
      )
    }));
    setEditingProductId(null);
    setNewProduct({ title: "", category: "", price: "", description: "", image: "" });
  };

  // Testimonial Operations
  const handleAddTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.text) {
      alert("Le nom et le texte du témoignage sont obligatoires.");
      return;
    }
    setDraft((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }));
    setNewTestimonial({ name: "", role: "", text: "", type: "general" });
  };

  const handleDeleteTestimonial = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  // Download Config File
  const handleDownloadConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draft, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "site-content.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-deep">
      
      {/* NAVBAR */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container-editorial flex items-center justify-between h-20">
          <div className="font-serif text-2xl text-forest flex items-center gap-2">
            <span>Admin Control Panel</span>
            <span className="text-gold font-bold">.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-forest transition">
              Voir le site →
            </Link>
            <button
              onClick={onLogout}
              className="p-2.5 rounded-full border border-border hover:bg-red-50 hover:text-red-700 transition flex items-center justify-center"
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="container-editorial py-12 flex-1 grid gap-8 md:grid-cols-12">
        
        {/* SIDEBAR TABS */}
        <aside className="md:col-span-3 flex flex-col gap-2">
          {[
            { id: "general", label: "Paramètres Généraux", icon: <Settings className="h-4 w-4" /> },
            { id: "arvea", label: "Espace ARVEA", icon: <Leaf className="h-4 w-4" /> },
            { id: "dxn", label: "Espace DXN", icon: <Coffee className="h-4 w-4" /> },
            { id: "testimonials", label: "Témoignages", icon: <MessageSquare className="h-4 w-4" /> },
            { id: "save", label: "Sauvegarde & Export", icon: <Download className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setEditingProductId(null);
                setNewProduct({ title: "", category: "", price: "", description: "", image: "" });
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-left transition ${
                activeTab === tab.id
                  ? "bg-forest text-cream shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          
          <div className="mt-8 border-t border-border pt-6 space-y-3">
            <button onClick={save} className="w-full btn-gold !py-3 !text-xs flex items-center justify-center gap-2">
              <Save className="h-4 w-4" /> Enregistrer tout
            </button>
            <button onClick={reset} className="w-full border border-border rounded-full py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary transition flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" /> Réinitialiser
            </button>
          </div>
        </aside>

        {/* CONTENT PANEL */}
        <main className="md:col-span-9 bg-card border border-border/80 rounded-3xl p-8 shadow-sm">
          
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-forest border-b border-border pb-4 flex items-center gap-2">
                <Settings className="h-6 w-6 text-gold" /> Config Générale
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nom Propriétaire" value={draft.name} onChange={(v) => update("name", v)} />
                <Field label="Tagline Globale" value={draft.tagline} onChange={(v) => update("tagline", v)} />
                <Field label="WhatsApp (Chiffres uniquement)" value={draft.whatsapp} onChange={(v) => update("whatsapp", v.replace(/\D/g, ""))} hint="Ex: 33793133650" />
                <Field label="WhatsApp (Affichage)" value={draft.whatsappDisplay} onChange={(v) => update("whatsappDisplay", v)} hint="Ex: 07 93 13 36 50" />
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="font-serif text-xl text-forest">Accueil Portail</h3>
                <Field label="Titre Principal" value={draft.gatewayHeroTitle} onChange={(v) => update("gatewayHeroTitle", v)} />
                <TextArea label="Description Sous-Titre" value={draft.gatewayHeroSubtitle} onChange={(v) => update("gatewayHeroSubtitle", v)} />
                <Field label="URL Vidéo Arrière-Plan (.mp4)" value={draft.gatewayVideoUrl} onChange={(v) => update("gatewayVideoUrl", v)} hint="Lien de flux vidéo direct" />
              </div>
            </div>
          )}

          {/* TAB 2: ARVEA */}
          {activeTab === "arvea" && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-forest border-b border-border pb-4 flex items-center gap-2">
                <Leaf className="h-6 w-6 text-gold" /> Univers ARVEA
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Titre Univers" value={draft.arveaHeroTitle} onChange={(v) => update("arveaHeroTitle", v)} />
                <Field label="Lien Affilié Boutique" value={draft.arveaAffiliateUrl} onChange={(v) => update("arveaAffiliateUrl", v)} />
                <Field label="Code Affilié ARVEA" value={draft.arveaAffiliateCode} onChange={(v) => update("arveaAffiliateCode", v)} />
                <Field label="URL Vidéo Arrière-Plan (.mp4)" value={draft.arveaVideoUrl} onChange={(v) => update("arveaVideoUrl", v)} />
              </div>
              <TextArea label="Description d'accroche Univers" value={draft.arveaHeroSubtitle} onChange={(v) => update("arveaHeroSubtitle", v)} />
              <TextArea label="Texte Présentation de la marque" value={draft.arveaText} onChange={(v) => update("arveaText", v)} />

              {/* ARVEA Product Catalog Editor */}
              <div className="border-t border-border pt-6 space-y-6">
                <h3 className="font-serif text-2xl text-forest">Catalogue ARVEA ({draft.arveaProducts.length} produits)</h3>
                
                {/* Product listing table */}
                <div className="border border-border rounded-2xl overflow-hidden bg-background">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-secondary/40 border-b border-border font-bold">
                        <th className="p-3">Produit</th>
                        <th className="p-3">Catégorie</th>
                        <th className="p-3">Prix</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {draft.arveaProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-secondary/15">
                          <td className="p-3 font-semibold">{p.title}</td>
                          <td className="p-3">{p.category}</td>
                          <td className="p-3">{p.price} €</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button
                              onClick={() => handleStartEditProduct(p)}
                              className="p-1 hover:text-gold transition"
                              title="Modifier"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct("arvea", p.id)}
                              className="p-1 hover:text-destructive transition"
                              title="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Form Add / Edit */}
                <div className="p-5 border border-border/80 rounded-2xl bg-secondary/25 space-y-4">
                  <h4 className="font-serif text-lg text-forest flex items-center gap-1.5">
                    {editingProductId ? <><Edit2 className="h-4 w-4 text-gold" /> Modifier le produit</> : <><Plus className="h-4 w-4 text-gold" /> Ajouter un produit</>}
                  </h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Nom Produit" value={newProduct.title} onChange={(v) => setNewProduct(d => ({ ...d, title: v }))} />
                    <Field label="Catégorie" value={newProduct.category} onChange={(v) => setNewProduct(d => ({ ...d, category: v }))} hint="Ex: Soins Visage, Soins Corps, Parfums" />
                    <Field label="Prix (€)" value={newProduct.price} onChange={(v) => setNewProduct(d => ({ ...d, price: v }))} hint="Ex: 12.90" />
                  </div>
                  <Field label="URL Image (Unsplash ou autre)" value={newProduct.image || ""} onChange={(v) => setNewProduct(d => ({ ...d, image: v }))} />
                  <TextArea label="Description" value={newProduct.description} onChange={(v) => setNewProduct(d => ({ ...d, description: v }))} />
                  
                  <div className="flex gap-2">
                    {editingProductId ? (
                      <>
                        <button onClick={() => handleSaveEditProduct("arvea")} className="bg-forest text-cream px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-forest/90">
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => {
                            setEditingProductId(null);
                            setNewProduct({ title: "", category: "", price: "", description: "", image: "" });
                          }}
                          className="border border-border px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-background"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleAddProduct("arvea")} className="bg-forest text-cream px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-forest/90">
                        Ajouter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DXN */}
          {activeTab === "dxn" && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-forest border-b border-border pb-4 flex items-center gap-2">
                <Coffee className="h-6 w-6 text-gold" /> Univers DXN
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Titre Univers" value={draft.dxnHeroTitle} onChange={(v) => update("dxnHeroTitle", v)} />
                <Field label="Code Sponsor (ID parrain)" value={draft.dxnSponsorCode} onChange={(v) => update("dxnSponsorCode", v)} />
                <Field label="Lien d'inscription eWorld DXN" value={draft.dxnRegistrationUrl} onChange={(v) => update("dxnRegistrationUrl", v)} />
                <Field label="URL Vidéo Arrière-Plan (.mp4)" value={draft.dxnVideoUrl} onChange={(v) => update("dxnVideoUrl", v)} />
              </div>
              <TextArea label="Description d'accroche Univers" value={draft.dxnHeroSubtitle} onChange={(v) => update("dxnHeroSubtitle", v)} />
              <TextArea label="Texte Présentation de la marque" value={draft.dxnText} onChange={(v) => update("dxnText", v)} />

              {/* DXN Product Catalog Editor */}
              <div className="border-t border-border pt-6 space-y-6">
                <h3 className="font-serif text-2xl text-forest">Catalogue DXN ({draft.dxnProducts.length} produits)</h3>

                {/* Product listing table */}
                <div className="border border-border rounded-2xl overflow-hidden bg-background">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-secondary/40 border-b border-border font-bold">
                        <th className="p-3">Produit</th>
                        <th className="p-3">Catégorie</th>
                        <th className="p-3">Prix</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {draft.dxnProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-secondary/15">
                          <td className="p-3 font-semibold">{p.title}</td>
                          <td className="p-3">{p.category}</td>
                          <td className="p-3">{p.price} €</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button
                              onClick={() => handleStartEditProduct(p)}
                              className="p-1 hover:text-gold transition"
                              title="Modifier"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct("dxn", p.id)}
                              className="p-1 hover:text-destructive transition"
                              title="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Form Add / Edit */}
                <div className="p-5 border border-border/80 rounded-2xl bg-secondary/25 space-y-4">
                  <h4 className="font-serif text-lg text-forest flex items-center gap-1.5">
                    {editingProductId ? <><Edit2 className="h-4 w-4 text-gold" /> Modifier le produit</> : <><Plus className="h-4 w-4 text-gold" /> Ajouter un produit</>}
                  </h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Nom Produit" value={newProduct.title} onChange={(v) => setNewProduct(d => ({ ...d, title: v }))} />
                    <Field label="Catégorie" value={newProduct.category} onChange={(v) => setNewProduct(d => ({ ...d, category: v }))} hint="Ex: Cafés & Boissons, Compléments" />
                    <Field label="Prix (€)" value={newProduct.price} onChange={(v) => setNewProduct(d => ({ ...d, price: v }))} hint="Ex: 19.50" />
                  </div>
                  <Field label="URL Image" value={newProduct.image || ""} onChange={(v) => setNewProduct(d => ({ ...d, image: v }))} />
                  <TextArea label="Description" value={newProduct.description} onChange={(v) => setNewProduct(d => ({ ...d, description: v }))} />

                  <div className="flex gap-2">
                    {editingProductId ? (
                      <>
                        <button onClick={() => handleSaveEditProduct("dxn")} className="bg-forest text-cream px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-forest/90">
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => {
                            setEditingProductId(null);
                            setNewProduct({ title: "", category: "", price: "", description: "", image: "" });
                          }}
                          className="border border-border px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-background"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleAddProduct("dxn")} className="bg-forest text-cream px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-forest/90">
                        Ajouter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-forest border-b border-border pb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-gold" /> Témoignages
              </h2>

              {/* Table testimonials */}
              <div className="border border-border rounded-2xl overflow-hidden bg-background">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border font-bold">
                      <th className="p-3">Nom</th>
                      <th className="p-3">Rôle</th>
                      <th className="p-3">Affiliation</th>
                      <th className="p-3">Message</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {draft.testimonials.map((t, idx) => (
                      <tr key={idx} className="hover:bg-secondary/15">
                        <td className="p-3 font-semibold">{t.name}</td>
                        <td className="p-3">{t.role}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            t.type === "arvea" ? "bg-emerald-100 text-emerald-800" :
                            t.type === "dxn" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {t.type || "général"}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs truncate">{t.text}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteTestimonial(idx)}
                            className="p-1 hover:text-destructive transition"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Form Add Testimonial */}
              <div className="p-5 border border-border/80 rounded-2xl bg-secondary/25 space-y-4">
                <h4 className="font-serif text-lg text-forest flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-gold" /> Ajouter un témoignage
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Nom Client" value={newTestimonial.name} onChange={(v) => setNewTestimonial(d => ({ ...d, name: v }))} />
                  <Field label="Rôle / Titre" value={newTestimonial.role} onChange={(v) => setNewTestimonial(d => ({ ...d, role: v }))} hint="Ex: Client fidèle" />
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Type d'avis</label>
                    <select
                      value={newTestimonial.type}
                      onChange={(e) => setNewTestimonial(d => ({ ...d, type: e.target.value as any }))}
                      className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-2.5 text-xs focus:outline-none"
                    >
                      <option value="general">Général (Portail)</option>
                      <option value="arvea">ARVEA Nature</option>
                      <option value="dxn">DXN Global</option>
                    </select>
                  </div>
                </div>
                <TextArea label="Contenu du témoignage" value={newTestimonial.text} onChange={(v) => setNewTestimonial(d => ({ ...d, text: v }))} />
                <button onClick={handleAddTestimonial} className="bg-forest text-cream px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-forest/90">
                  Ajouter l'avis
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SAVE */}
          {activeTab === "save" && (
            <div className="space-y-6">
              <h2 className="font-serif text-3xl text-forest border-b border-border pb-4 flex items-center gap-2">
                <Download className="h-6 w-6 text-gold" /> Sauvegarde de la Config
              </h2>
              
              <div className="rounded-2xl border border-border p-6 bg-background space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sur Vercel et en production, le stockage local (`localStorage`) conserve vos modifications uniquement sur votre propre navigateur. 
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pour appliquer vos modifications **définitivement pour tous les visiteurs du site**, cliquez sur le bouton ci-dessous pour télécharger le fichier de configuration mis à jour. Placez ensuite ce fichier `site-content.json` dans le dossier `src/lib/` du projet et relancez un déploiement.
                </p>
                
                <button onClick={handleDownloadConfig} className="btn-gold !py-3.5 flex items-center gap-2">
                  <Download className="h-4 w-4" /> Télécharger site-content.json
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Aperçu JSON actuel</label>
                <pre className="p-4 rounded-xl border border-border bg-stone-950 text-emerald-400 text-[10px] overflow-auto max-h-60 leading-relaxed font-mono">
                  {JSON.stringify(draft, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FLOAT SAVE BAR */}
      <div className="sticky bottom-0 inset-x-0 border-t border-border bg-card/90 backdrop-blur py-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="container-editorial flex items-center justify-between">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
            {saved ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <Check className="h-4 w-4" /> Enregistré dans le navigateur !
              </span>
            ) : (
              "Modifications non enregistrées dans la configuration active"
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={reset} className="border border-border rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary transition">
              Annuler
            </button>
            <button onClick={save} className="btn-gold !py-2.5 !px-6 !text-xs">
              Enregistrer
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="font-serif text-2xl text-forest border-b border-border pb-2">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-gold/50"
      />
      {hint && <span className="mt-1 block text-[10px] text-muted-foreground/60">{hint}</span>}
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-gold/50 resize-y"
      />
    </label>
  );
}
