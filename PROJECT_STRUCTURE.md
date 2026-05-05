# Structure du Projet

```
vetement-stock-app/
├── app/                                  # Application Next.js
│   ├── layout.tsx                       # Layout principal
│   ├── page.tsx                         # Page d'accueil
│   └── (app)/                           # Routes protégées
│       ├── layout.tsx                   # Layout avec sidebar
│       ├── dashboard/                   # 📊 Tableau de bord
│       │   └── page.tsx                 # Dashboard avec 4 charts
│       ├── products/                    # 👕 Gestion des vêtements
│       │   └── page.tsx                 # Liste, ajouter, modifier vêtements
│       ├── alerts/                      # 🚨 Alertes de stock bas
│       │   └── page.tsx                 # Alertes avec filtres
│       ├── reports/                     # 📈 Rapports avancés
│       │   └── page.tsx                 # 5 types de rapports + export
│       ├── movements/                   # 📝 Historique mouvements
│       │   └── page.tsx
│       ├── suppliers/                   # 🚚 Fournisseurs
│       │   └── page.tsx
│       ├── users/                       # 👥 Gestion utilisateurs
│       │   └── page.tsx
│       ├── notifications/               # 🔔 Notifications
│       │   └── page.tsx
│       └── settings/                    # ⚙️ Paramètres
│           └── page.tsx
│
├── components/                           # Composants réutilisables
│   ├── layout/
│   │   ├── sidebar.tsx                  # Navigation latérale
│   │   ├── navbar.tsx                   # Barre du haut
│   │   └── footer.tsx                   # Pied de page
│   ├── product-image-gallery.tsx        # Galerie d'images avec QR
│   ├── image-upload.tsx                 # Upload d'images
│   ├── charts/                          # Composants de graphiques
│   ├── forms/                           # Formulaires
│   └── ui/                              # Composants shadcn/ui
│
├── lib/                                  # Utilitaires
│   ├── qrcode-generator.ts              # Génération QR codes
│   ├── image-service.ts                 # Gestion des images
│   ├── validation.ts                    # Validation des données
│   ├── supabase.ts                      # Client Supabase
│   ├── api.ts                           # Fonctions API
│   └── utils.ts                         # Utilitaires généraux
│
├── public/                              # Fichiers statiques
│   ├── images/
│   └── icons/
│
├── supabase/                            # Configuration Supabase
│   └── migrations/                      # Migrations SQL
│       ├── 20240001_init_schema.sql     # Schéma initial
│       ├── 20240010_clothing_stock_system.sql  # Tables vêtements
│       └── 20240011_add_images_qrcode.sql    # Images et QR codes
│
├── scripts/                             # Scripts utilitaires
│   ├── migrate.mjs                      # Migration script
│   └── seed.mjs                         # Seed données
│
├── styles/                              # Styles globaux
│   ├── globals.css                      # Styles Tailwind
│   └── variables.css                    # Variables CSS
│
├── .env.example                         # Template variables d'env
├── .env.local                           # Variables d'env (⚠️ git ignore)
├── package.json                         # Dépendances
├── tsconfig.json                        # Configuration TypeScript
├── next.config.js                       # Configuration Next.js
├── tailwind.config.js                   # Configuration Tailwind
│
├── INSTALLATION.md                      # Guide d'installation
├── FEATURES.md                          # Liste des fonctionnalités
├── GUIDE_COMPLET.md                     # Guide utilisateur complet
├── README.md                            # Vue d'ensemble
├── TECH_CHANGES.md                      # Changements techniques
└── PROJECT_STRUCTURE.md                 # Ce fichier
```

## Hiérarchie des fichiers clés

### Pages principales
- `app/(app)/dashboard/page.tsx` - Statistiques et graphiques
- `app/(app)/products/page.tsx` - Gestion des vêtements + images
- `app/(app)/alerts/page.tsx` - Alertes de stock bas
- `app/(app)/reports/page.tsx` - Rapports exportables

### Composants réutilisables
- `components/product-image-gallery.tsx` - Galerie avec QR codes
- `components/image-upload.tsx` - Upload d'images
- `components/layout/sidebar.tsx` - Navigation

### Utilitaires
- `lib/qrcode-generator.ts` - Génération QR codes
- `lib/image-service.ts` - Gestion des images
- `lib/validation.ts` - Validation des données

### Base de données
- `supabase/migrations/` - Toutes les migrations SQL

## Flux des données

```
┌─────────────┐
│  UI (React) │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Components     │  (Affichage + Interaction)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  lib/ Services  │  (Logique métier)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Supabase API   │  (Backend)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  PostgreSQL DB  │  (Données)
└─────────────────┘
```

## Stack technique

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styles**: Tailwind CSS v3+
- **Validation**: React Hook Form + Zod

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **ORM**: Direct SQL queries (performant)
- **API**: Next.js API Routes

### Utilitaires
- **QR Codes**: qrcode library
- **Excel**: xlsx/exceljs
- **Charts**: Recharts
- **Date**: date-fns

### DevOps
- **Build**: Next.js Build
- **Package Manager**: pnpm
- **Node**: 18+ LTS
- **Runtime**: Node.js / Vercel Edge

## Configuration requise

```json
{
  "node": "18.17.0 ou plus",
  "pnpm": "8.0.0 ou plus",
  "supabase": "Projet gratuit ou payant",
  "navigateur": "Chrome 90+, Firefox 88+, Safari 14+"
}
```

## Performance

- **Bundle size**: ~200KB (gzipped)
- **First paint**: <1s
- **TTI**: <2s
- **Database queries**: Indexées et optimisées

## Sécurité

- **Authentification**: JWT tokens (Supabase)
- **Chiffrement**: HTTPS obligatoire
- **RLS**: Row Level Security (Supabase)
- **Validation**: Côté client et serveur
- **Sanitization**: Protection XSS/CSRF

---

Pour plus de détails, consulter `GUIDE_COMPLET.md` ou `TECH_CHANGES.md`
