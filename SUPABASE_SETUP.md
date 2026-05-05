# Supabase Setup Guide - Système de Gestion des Stocks de Vêtements

Ce guide explique comment configurer Supabase pour le projet de gestion des stocks de vêtements.

## 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "New Project"
3. Remplissez les informations:
   - **Organization**: Créez une nouvelle organisation ou choisissez une existante
   - **Project Name**: Ex: "clothing-stock"
   - **Password**: Créez un mot de passe sécurisé pour l'utilisateur postgres
   - **Region**: Choisissez la région la plus proche de vous
4. Attendez que le projet soit créé (environ 2-3 minutes)

## 2. Obtenir les clés API

1. Allez dans **Project Settings** (roue dentée en bas à gauche)
2. Cliquez sur **API**
3. Vous verrez trois clés:

### 2.1 Variables à copier dans `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL = Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY = anon (public) key
SUPABASE_SERVICE_ROLE_KEY = service_role key
```

## 3. Configurer les migrations

1. Copiez les trois variables API ci-dessus dans votre fichier `.env.local`
2. Dans le terminal, exécutez:

```bash
pnpm db:migrate
```

Cela créera automatiquement:
- Table `products` (produits avec champs spécifiques aux vêtements)
- Table `product_sizes` (tailles: S, M, XL, XXL)
- Table `stock_movements` (historique des mouvements)
- Table `categories` (Hommes, Femmes, Enfants)
- Toutes les données initiales

## 4. Utilisateurs et Authentification

Pour tester, créez un utilisateur dans Supabase:

1. Allez dans **Authentication** → **Users**
2. Cliquez sur **Add user**
3. Entrez un email et un mot de passe
4. Vous pourrez vous connecter avec ces identifiants

## 5. Vérifier que tout fonctionne

1. Lancez le serveur de développement:

```bash
pnpm dev
```

2. Allez sur http://localhost:3000
3. Connectez-vous avec les identifiants créés
4. Vous devriez voir le dashboard avec les 4 charts

## Structure de la base de données

### Table: products
```sql
id (UUID) - Identifiant unique
sku (TEXT) - Code produit unique
name (TEXT) - Nom du produit
description (TEXT) - Description
category_id (UUID) - Référence à la catégorie
supplier_id (UUID) - Référence au fournisseur
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
user_id (UUID) - Utilisateur qui a effectué le mouvement
notes (TEXT) - Notes additionnelles
created_at (TIMESTAMP) - Date/heure du mouvement
```

### Table: categories
```sql
id (UUID)
name (TEXT) - Hommes, Femmes, Enfants
description (TEXT)
```

## Variables d'environnement complètes

```env
# ── Supabase (public) ─────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Supabase (server) ──────────────────────
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx
```

## Commandes utiles

```bash
# Appliquer les migrations
pnpm db:migrate

# Voir le statut des migrations
pnpm db:migrate:status

# Réinitialiser la base de données (attention!)
pnpm db:reset

# Lancer le serveur de développement
pnpm dev

# Builder l'application
pnpm build

# Lancer en production
pnpm start
```

## Features du système

✅ Gestion des vêtements par catégorie (Hommes, Femmes, Enfants)
✅ Gestion des tailles (S, M, XL, XXL)
✅ Suivi des stocks par taille
✅ 4 charts utiles sur le dashboard:
   - Mouvements de stock (7 derniers jours)
   - Quantités par taille
   - Distribution par taille
   - Distribution par catégorie
✅ Historique des mouvements
✅ Authentification sécurisée
✅ Export/Import Excel
✅ Row Level Security (RLS)

## Dépannage

### Les migrations ne s'appliquent pas
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont correctement configurés
- Vérifiez que le projet Supabase est bien créé
- Essayez `pnpm db:reset`

### Erreur de connexion
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects
- Assurez-vous que l'utilisateur est créé dans Supabase → Authentication

### Les données ne s'affichent pas
- Vérifiez que les migrations se sont bien appliquées: `pnpm db:migrate:status`
- Vérifiez les Row Level Security policies dans Supabase
