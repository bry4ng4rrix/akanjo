# E-kajy Entana - Guide d'Utilisation

## 🚀 Vue d'ensemble

E-kajy Entana est une application de gestion de stock moderne construite avec Next.js 13, Supabase et Tailwind CSS. Elle permet de gérer des produits, catégories, fournisseurs et mouvements de stock en temps réel.

---

## 🏗️ Architecture Technique

### Stack
- **Frontend** : Next.js 13 (App Router), React 18, TypeScript
- **Backend** : Supabase (PostgreSQL + Auth + Realtime)
- **UI** : Tailwind CSS, shadcn/ui components, Lucide icons
- **État** : React hooks (useState, useEffect)

### Structure des dossiers
```
app/
├── (app)/           # Routes groupées avec layout sidebar
│   ├── dashboard/   # Tableau de bord
│   ├── products/    # Gestion produits + catégories
│   ├── movements/   # Mouvements de stock
│   ├── suppliers/   # Fournisseurs
│   ├── scanner/     # Scanner QR
│   ├── settings/    # Paramètres
│   └── layout.tsx   # Layout avec sidebar
├── login/           # Page connexion
├── register/        # Page inscription
└── page.tsx         # Redirect vers /login

components/
├── layout/          # Sidebar, TopBar
└── ui/              # Composants shadcn/ui

supabase/migrations/ # Scripts SQL
```

---

## 👤 Création de Compte & Authentification

### Inscription
1. Accéder à `/register`
2. Saisir email et mot de passe
3. Un trigger Supabase crée automatiquement un profil dans la table `users` avec le rôle **'magasinier'** par défaut

### Connexion
1. Accéder à `/login`
2. Saisir identifiants
3. Redirection automatique vers `/dashboard`

### Rôles Utilisateur
| Rôle | Permissions | Statut |
|------|-------------|--------|
| **admin** | Toutes les opérations + gestion utilisateurs | Approuvé directement |
| **magasinier** (Manager) | CRUD produits, catégories, mouvements, gestion employés | Approuvé directement |
| **employer** (Employé) | Voir produits, ajouter mouvements | **En attente d'approbation** |

#### Système d'approbation Employé
1. **Inscription** : L'employé choisit "Employé" et saisit l'email de son manager
2. **En attente** : Le compte est créé mais l'employé ne peut pas se connecter
3. **Dashboard Settings** : Le manager voit les demandes en attente
4. **Approbation** : Le manager approuve ou rejète la demande
5. **Connexion** : Une fois approuvé, l'employé peut se connecter

#### Ajouter un employé directement (Manager)
Dans `Settings → Utilisateurs`, le manager peut créer un compte employé approuvé immédiatement sans passer par l'attente.

### Sécurité RLS (Row Level Security)
Les policies Supabase empêchent la récursion infinie via une fonction `get_user_role()` en `SECURITY DEFINER`.

---

## Fonctionnalités par Page
## 📦 Fonctionnalités par Page

### 1. Dashboard (`/dashboard`)
**Vue d'ensemble en temps réel**

- **KPI Cards** :
  - Valeur totale du stock (en Ariary)
  - Nombre total de produits
  - Produits en stock faible (alerte orange)
  - Tendance mouvements (+12%)

- **Graphique** : Mouvements des 7 derniers jours (entrées vs sorties)
  - Données réelles depuis `stock_movements`
  - Mise à jour automatique

- **Activités récentes** : Derniers 10 mouvements avec produit, type, quantité et date

### 2. Produits (`/products`)
**Gestion complète du catalogue**

- **Liste des produits** :
  - Tableau avec SKU, nom, catégorie, emplacement, quantité, prix, statut
  - Filtres par recherche, catégorie, statut
  - Pagination virtuelle (scroll)

- **CRUD Produits** :
  - **Ajouter** : Dialog avec formulaire (SKU, nom, description, catégorie, fournisseur, emplacement, quantité, prix, seuil réappro)
  - **Modifier** : Dialog pré-rempli
  - **Supprimer** : Dialog de confirmation (pas d'alert native)

- **Gestion Catégories** (bouton "Catégories") :
  - Grid 4 colonnes avec icônes rondes
  - Mapping icônes automatique :
    - Électronique → Monitor
    - Vêtements → ShoppingBag
    - Alimentaire → UtensilsCrossed
    - Maison → Home
    - Autres → Package
  - Suppression avec bouton X (hover)
  - Ajout via champ texte + bouton

### 3. Mouvements (`/movements`)
**Traçabilité des entrées/sorties**

- **Tableau historique** : Date, produit, SKU, quantité, type (entrée/sortie), utilisateur, notes
- **Ajouter un mouvement** :
  - Type : Entrée ou Sortie
  - Produit sélectionnable
  - Quantité
  - Notes optionnelles
- **Impact** : Les mouvements mettent à jour automatiquement la quantité du produit

### 4. Fournisseurs (`/suppliers`)
**Gestion des fournisseurs**

- Liste avec nom, email, téléphone, adresse, ville, code postal
- CRUD complet (ajout, modification, suppression)
- Liaison avec les produits

### 5. Scanner (`/scanner`)
**Scan QR Code**

- Génération de QR codes pour les produits
- Scan pour rechercher un produit par SKU
- Compatible avec `qrcode.react`

### 6. Paramètres (`/settings`)
**Configuration utilisateur**

- Profil utilisateur
- Préférences d'affichage
- Thème (light/dark)

---

## 🗄️ Schéma Base de Données

### Tables Principales

#### `users`
```sql
id: UUID (PK) - lié à auth.users
email: TEXT
full_name: TEXT
role: TEXT ('admin' | 'magasinier' | 'employer')
status: TEXT ('pending' | 'approved' | 'rejected') - défaut: 'approved'
referred_by: UUID (FK → users) - manager qui a approuvé
referred_by_email: TEXT - email du manager référent (pour pending)
created_at: TIMESTAMP
```

#### `categories`
```sql
id: UUID (PK)
name: TEXT UNIQUE
description: TEXT
created_at: TIMESTAMP
```

#### `suppliers`
```sql
id: UUID (PK)
name: TEXT
email: TEXT
phone: TEXT
address: TEXT
city: TEXT
postal_code: TEXT
country: TEXT
contact_person: TEXT
created_at: TIMESTAMP
```

#### `products`
```sql
id: UUID (PK)
sku: TEXT UNIQUE
name: TEXT
description: TEXT
category_id: UUID (FK → categories)
supplier_id: UUID (FK → suppliers)
location: TEXT
quantity: INTEGER DEFAULT 0
unit_price: DECIMAL(10,2)
reorder_level: INTEGER DEFAULT 10
status: TEXT ('in_stock' | 'low' | 'out_of_stock')
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### `stock_movements`
```sql
id: UUID (PK)
product_id: UUID (FK → products)
type: TEXT ('entry' | 'exit')
quantity: INTEGER
notes: TEXT
user_id: UUID (FK → users)
created_at: TIMESTAMP
```

---

## 🔧 Migrations SQL

Les migrations sont dans `supabase/migrations/` :

| Fichier | Description |
|---------|-------------|
| `20240001_init_schema.sql` | Création de toutes les tables |
| `20240002_seed_data.sql` | Données de test (catégories, fournisseurs, produits) |
| `20240003_fix_rls_recursion.sql` | Fix infinite recursion RLS |
| `20240004_fix_products_rls.sql` | Permissions pour magasinier |
| `20240005_add_employer_role.sql` | Ajout rôle employé + système d'approbation |

### Appliquer les migrations
```bash
# Copier-coller dans Supabase SQL Editor
# OU avec la service_role_key :
node scripts/migrate.mjs
```

---

## 🎨 UI/UX

### Thèmes
- **Light Mode** : Sidebar blanc/gris, texte slate-900
- **Dark Mode** : Sidebar stone-950, texte blanc (original)

### Composants clés
- **Dialog** : Tous les formulaires modaux (ajout, édit, suppression)
- **Toast** : Notifications (sonner)
- **Skeleton** : États de chargement
- **Badge** : Statuts des produits
- **Table** : Listes de données

### Responsive
- Mobile : Sidebar coulissant avec overlay
- Desktop : Sidebar fixe à gauche

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- pnpm
- Compte Supabase

### Installation
```bash
pnpm install
```

### Configuration
Créer `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### Développement
```bash
pnpm dev
# http://localhost:3000
```

---

## 📋 Checklist Fonctionnalités

- [x] Authentification (login/register/logout)
- [x] Rôles utilisateur (admin/magasinier)
- [x] CRUD Produits avec Dialog
- [x] CRUD Catégories avec icônes
- [x] CRUD Fournisseurs
- [x] Mouvements de stock (entrée/sortie)
- [x] Dashboard avec graphiques temps réel
- [x] Scanner QR Code
- [x] Sidebar responsive light/dark
- [x] Filtres et recherche produits
- [x] Notifications toast
- [x] RLS sécurisé sans récursion
- [x] Système d'approbation employés (pending/approved/rejected)
- [x] Manager peut ajouter/approuver des employés
- [x] CRUD complet fournisseurs

---

## 🐛 Dépannage

### Erreur "infinite recursion detected in policy"
→ Exécuter `20240003_fix_rls_recursion.sql`

### Erreur "violates row-level security policy"
→ Vérifier que la migration RLS est appliquée et que l'utilisateur a un rôle

### Erreur port 3000 occupé
```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📞 Support

Pour toute question ou bug, vérifier :
1. Les migrations SQL sont exécutées
2. Les variables d'environnement sont configurées
3. Les RLS policies permettent l'accès
