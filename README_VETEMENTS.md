# VêteMart - Système de Gestion des Stocks de Vêtements

Un système de gestion des stocks complet et moderne pour les vêtements, construit avec Next.js, Supabase et shadcn/ui.

## 🎯 Fonctionnalités

### ✨ Gestion des Vêtements
- ✅ Gestion par catégorie: **Hommes**, **Femmes**, **Enfants**
- ✅ Gestion des tailles: **S, M, XL, XXL**
- ✅ Suivi du stock par taille
- ✅ Couleur et matière des produits
- ✅ Fournisseurs et emplacements

### 📊 Dashboard avec 4 Charts

1. **Mouvements (7 jours)** - Graphique en ligne des entrées et sorties
2. **Quantités par taille** - Graphique en barres du stock par taille
3. **Distribution par taille** - Graphique en camembert
4. **Stock par catégorie** - Distribution par genre (Hommes, Femmes, Enfants)

### 📈 Statistiques en temps réel
- Valeur totale du stock
- Nombre total de produits
- Quantité totale en stock
- Articles avec stock faible

### 🔄 Historique des mouvements
- Suivi des entrées/sorties de stock
- Date et heure des mouvements
- Utilisateur responsable
- Notes sur le mouvement

### 📁 Export/Import
- Export Excel des produits
- Import Excel en masse

## 🚀 Démarrage rapide

### 1. Prérequis
- Node.js 18+
- npm, yarn, ou pnpm

### 2. Installation

```bash
# Cloner le projet
git clone <your-repo>
cd clothing-stock

# Installer les dépendances
pnpm install
# ou
npm install
# ou
yarn install
```

### 3. Configuration Supabase

#### Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans **Settings → API**, copiez:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

#### Configurer les variables d'environnement

Créez un fichier `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx
```

#### Appliquer les migrations

```bash
pnpm db:migrate
```

Cela créera automatiquement:
- Tables `products`, `product_sizes`, `stock_movements`, `categories`
- Catégories initiales (Hommes, Femmes, Enfants)
- Row Level Security policies

### 4. Lancer le serveur de développement

```bash
pnpm dev
```

Allez sur [http://localhost:3000](http://localhost:3000)

### 5. Créer un compte

1. Allez dans **Authentication → Users** dans Supabase
2. Créez un nouvel utilisateur
3. Connectez-vous sur l'application

## 📚 Utilisation

### Dashboard

Le dashboard affiche automatiquement:
- 4 KPI cards (valeur, produits, quantité, stock faible)
- 4 charts utiles
- Historique des 8 derniers mouvements

### Ajouter un produit

1. Allez dans **Vêtements**
2. Cliquez sur **Ajouter**
3. Remplissez les informations:
   - SKU (code unique)
   - Nom du produit
   - Catégorie (Hommes, Femmes, Enfants)
   - Couleur
   - Matière
   - Prix unitaire
   - Quantités par taille (S, M, XL, XXL)
4. Cliquez sur **Ajouter**

### Gérer les mouvements de stock

1. Allez dans **Mouvements**
2. Entrez/sortez du stock par taille
3. Chaque mouvement est enregistré avec date, utilisateur et notes

### Exporter les données

1. Allez dans **Vêtements**
2. Cliquez sur **Exporter**
3. Un fichier Excel est généré avec tous les produits

## 📁 Structure du projet

```
.
├── app/
│   ├── (app)/
│   │   ├── dashboard/      # Tableau de bord avec charts
│   │   ├── products/       # Gestion des vêtements
│   │   ├── movements/      # Mouvements de stock
│   │   ├── suppliers/      # Fournisseurs
│   │   ├── users/          # Gestion des utilisateurs
│   │   ├── settings/       # Paramètres
│   │   └── layout.tsx      # Layout principal
│   ├── login/              # Page de connexion
│   ├── register/           # Page d'inscription
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Composants shadcn/ui
│   └── layout/             # Sidebar, TopBar
├── supabase/
│   └── migrations/         # Migrations SQL
│   ├── 20240010_clothing_stock_system.sql
├── utils/
│   └── supabase/           # Clients Supabase
├── .env.local              # Variables d'environnement
├── ENV_VARIABLES.md        # Documentation des env vars
└── SUPABASE_SETUP.md       # Guide d'installation Supabase
```

## 🗄️ Structure de la base de données

### Table: products
```sql
id (UUID) - Identifiant unique
sku (TEXT) - Code produit unique
name (TEXT) - Nom du produit
description (TEXT) - Description
category_id (UUID) - Catégorie (Hommes, Femmes, Enfants)
supplier_id (UUID) - Fournisseur
unit_price (DECIMAL) - Prix unitaire
color (TEXT) - Couleur
material (TEXT) - Matière (ex: 100% Coton)
status (TEXT) - in_stock, low, out_of_stock
```

### Table: product_sizes
```sql
id (UUID) - Identifiant unique
product_id (UUID) - Référence au produit
size (TEXT) - S, M, XL, XXL
quantity (INTEGER) - Quantité en stock
reorder_level (INTEGER) - Seuil de réapprovisionnement
```

### Table: stock_movements
```sql
id (UUID) - Identifiant unique
product_id (UUID) - Référence au produit
product_size_id (UUID) - Référence à la taille
size (TEXT) - Taille du mouvement
type (TEXT) - entry (entrée) ou exit (sortie)
quantity (INTEGER) - Quantité
user_id (UUID) - Utilisateur
notes (TEXT) - Notes
created_at (TIMESTAMP) - Date du mouvement
```

## 🎨 Stack Technologique

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Validation**: Zod
- **Export**: XLSX

## 📊 Commands

```bash
# Développement
pnpm dev

# Build
pnpm build

# Production
pnpm start

# Migrations
pnpm db:migrate        # Appliquer les migrations
pnpm db:migrate:status # Voir le statut
pnpm db:reset          # Réinitialiser (attention!)

# Linting
pnpm lint
```

## 🔒 Sécurité

✅ Row Level Security (RLS) activée
✅ Authentification Supabase
✅ Clés d'API sécurisées (public/secret)
✅ Validation des données côté serveur
✅ Protection contre les injections SQL

## 🚀 Déploiement

### Vercel (recommandé)

```bash
# Connecter le repo
vercel link

# Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Déployer
vercel deploy
```

### Autre serveur

```bash
pnpm build
export NODE_ENV=production
export NEXT_PUBLIC_SUPABASE_URL=...
export NEXT_PUBLIC_SUPABASE_ANON_KEY=...
export SUPABASE_SERVICE_ROLE_KEY=...
pnpm start
```

## 🐛 Dépannage

### "Cannot connect to Supabase"
- Vérifiez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Vérifiez que le projet Supabase existe

### "Migrations failed"
- Vérifiez `SUPABASE_SERVICE_ROLE_KEY`
- Essayez `pnpm db:reset`
- Vérifiez les logs dans Supabase

### "No data showing"
- Vérifiez les migrations: `pnpm db:migrate:status`
- Vérifiez les RLS policies dans Supabase
- Vérifiez que vous êtes connecté

## 📞 Support

Pour plus de support:
1. Consultez [ENV_VARIABLES.md](./ENV_VARIABLES.md)
2. Consultez [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Vérifiez les [Supabase Docs](https://supabase.com/docs)

## 📝 License

MIT

---

**Créé avec ❤️ pour la gestion des stocks de vêtements**
