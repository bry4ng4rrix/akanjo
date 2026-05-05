# 🚀 LIRE D'ABORD - Guide de démarrage

**Bienvenue dans VêteMart - Gestion des stocks de vêtements!**

Ce document contient TOUT ce qu'il faut savoir pour démarrer.

## ⚡ 60 secondes pour comprendre

- **Quoi?** Système complet de gestion des stocks pour vêtements
- **Stack?** Next.js 16, React 19, Supabase (PostgreSQL), shadcn/ui
- **Features?** Dashboard 4 charts, gestion par taille (S,M,XL,XXL), export Excel
- **Env vars?** 3 variables obligatoires de Supabase (voir plus bas)
- **Temps setup?** 5 minutes

## 📋 Les 3 variables d'environnement obligatoires

**Créez un fichier `.env.local` avec EXACTEMENT ceci:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_xxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx
```

**Où les obtenir?** Supabase Dashboard → Settings → API

## 🎯 5 étapes pour démarrer

### 1. Créer projet Supabase
- Allez sur https://supabase.com
- Cliquez "New Project"
- Attendez 2-3 minutes

### 2. Copier les 3 clés
- Settings → API
- Copier les 3 valeurs

### 3. Créer `.env.local`
- À la racine du projet
- Coller les 3 valeurs

### 4. Appliquer migrations
```bash
pnpm db:migrate
```

### 5. Lancer l'app
```bash
pnpm dev
```

**Fini!** Ouvrez http://localhost:3000

## 📚 Documentation par niveau

| Niveau | Fichier | Temps | Contenu |
|--------|---------|-------|---------|
| 🟢 Débutant | **DEMARRAGE_RAPIDE.md** | 5 min | Étapes simples |
| 🟡 Intermédiaire | **SETUP_FINAL.md** | 10 min | Checklist complète |
| 🔴 Avancé | **README_VETEMENTS.md** | 20 min | Guide complet |
| ⚙️ Technique | **TECH_CHANGES.md** | 15 min | Détails code |

## 🆘 Si ça ne marche pas

### "Cannot connect to Supabase"
```
→ Vérifiez NEXT_PUBLIC_SUPABASE_URL dans .env.local
→ Vérifiez le projet Supabase existe
→ Redémarrez: pnpm dev
```

### "Migrations failed"
```
→ Vérifiez SUPABASE_SERVICE_ROLE_KEY
→ Exécutez: pnpm db:migrate:status
→ Essayez: pnpm db:reset
```

### "Login échoue"
```
→ Créez un utilisateur dans Supabase Auth
→ Email doit être confirmé
```

## ✨ Fonctionnalités principales

✅ **Gestion vêtements**
- 3 catégories: Hommes, Femmes, Enfants
- 4 tailles: S, M, XL, XXL
- Couleur et matière

✅ **Dashboard 4 charts**
1. Mouvements stock (7j)
2. Quantités par taille
3. Distribution par taille
4. Distribution par catégorie

✅ **Gestion complète**
- CRUD produits
- Mouvements par taille
- Export Excel
- Authentification

## 🔐 Points de sécurité

❌ **Ne faites JAMAIS:**
- Committer `.env.local` en Git
- Sharer `SUPABASE_SERVICE_ROLE_KEY`
- Exposer les clés secrètes

✅ **Déjà fait:**
- Row Level Security activée
- Authentification Supabase
- `.gitignore` configuré

## 📊 Ce que vous verrez

### Dashboard
- 4 KPI cards (valeur, produits, quantité, stock faible)
- 4 charts interactifs
- Historique des mouvements

### Vêtements
- Tableau tous produits
- Filtre par catégorie
- CRUD complet
- Export Excel

### Mouvements
- Ajouter entrée/sortie
- Par taille
- Notes et utilisateur

## 📁 Fichiers importants

```
.env.local              ← VOS CLÉS (ne pas committer)
.env.example            ← Template à copier
LIRE_D_ABORD.md        ← Ce fichier
DEMARRAGE_RAPIDE.md    ← Étapes 5 min
SETUP_FINAL.md         ← Checklist complète
ENV_VARIABLES.md       ← Détails variables
SUPABASE_SETUP.md      ← Setup Supabase
README_VETEMENTS.md    ← Guide complet
TECH_CHANGES.md        ← Détails techniques
COMMANDES.md           ← Commandes utiles
```

## ⚡ Commandes rapides

```bash
# Installation
pnpm install

# Migrations
pnpm db:migrate

# Démarrage
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## 🎓 Ordre de lecture recommandé

1. **Ici** → LIRE_D_ABORD.md (ce fichier)
2. **Puis** → DEMARRAGE_RAPIDE.md (5 min)
3. **Ensuite** → Essayez de démarrer l'app
4. **Si problème** → SETUP_FINAL.md ou ENV_VARIABLES.md
5. **Pour approfondir** → README_VETEMENTS.md

## ✅ Checklist rapide

- [ ] Compte Supabase créé
- [ ] 3 clés API copiées
- [ ] Fichier `.env.local` créé
- [ ] Variables dans `.env.local`
- [ ] `pnpm db:migrate` exécuté
- [ ] `pnpm dev` fonctionne
- [ ] http://localhost:3000 accessible
- [ ] Login fonctionne
- [ ] Dashboard avec 4 charts visible

## 🎉 Vous êtes prêt!

Vous avez tout ce qu'il faut. Allez-y!

```bash
# 1. Créer .env.local (voir variables ci-dessus)
# 2. Exécuter:
pnpm db:migrate

# 3. Puis:
pnpm dev

# 4. Ouvrir http://localhost:3000
# 5. Se connecter et profiter!
```

---

**💡 Conseil**: Lisez rapidement DEMARRAGE_RAPIDE.md si c'est votre première fois!

**🆘 Besoin d'aide?** Tous les fichiers de doc sont là pour vous!

**🎯 Prêt à commencer?** Allez dans DEMARRAGE_RAPIDE.md →
