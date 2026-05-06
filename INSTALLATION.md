# Installation - VêteMart (Gestion des Stocks de Vêtements)

## Prerequisites
- Node.js 18+ (https://nodejs.org)
- pnpm (npm install -g pnpm)
- Compte Supabase gratuit (https://supabase.com)

## Étape 1: Créer un projet Supabase

1. Aller sur https://app.supabase.com
2. Créer un nouveau projet
3. Attendre que le projet soit créé (5-10 minutes)
4. Aller dans **Settings → API** et copier:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

## Étape 2: Configurer les variables d'environnement

1. À la racine du projet, créer un fichier `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_xxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

2. Remplacer les valeurs par vos vraies clés Supabase

## Étape 3: Installer les dépendances

```bash
pnpm install
```

## Étape 4: Appliquer les migrations

```bash
pnpm db:migrate
```

Cela créera toutes les tables nécessaires:
- `products` (vêtements)
- `product_images` (images avec QR codes)
- `product_sizes` (tailles par produit)
- `movements` (historique)
- `low_stock_alerts` (alertes)
- `users` (utilisateurs)

## Étape 5: Démarrer l'application

```bash
pnpm dev
```

L'application sera accessible à: **http://localhost:3000**

## Variables d'environnement complètes

| Variable | Description | Source |
|----------|-------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (client) | Supabase → Settings → API → anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé serveur (secret!) | Supabase → Settings → API → service_role |

## Commandes utiles

```bash
# Démarrer le développement
pnpm dev

# Construire pour la production
pnpm build

# Démarrer la production
pnpm start

# Vérifier les migrations
pnpm db:migrate:status

# Réinitialiser la base de données
pnpm db:reset

# Linter
pnpm lint
```

## Déploiement

### Sur Vercel (recommandé)

1. Push le code sur GitHub
2. Aller sur https://vercel.com
3. Importer le projet GitHub
4. Ajouter les 3 variables d'environnement dans Settings → Environment Variables
5. Déployer!

### Sur une autre plateforme

- Suivre la documentation de la plateforme
- S'assurer que Node 18+ est utilisé
- Ajouter les 3 variables d'environnement
- Exécuter `pnpm build` puis `pnpm start`

## Dépannage

### "NEXT_PUBLIC_SUPABASE_URL is not set"
- Vérifier que `.env.local` existe et contient `NEXT_PUBLIC_SUPABASE_URL`
- Redémarrer le serveur de développement

### "Failed to fetch from Supabase"
- Vérifier les clés Supabase sont correctes
- Vérifier que le projet Supabase est actif
- Vérifier les RLS policies en Supabase

### "Migration failed"
- Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est correct
- Vérifier la connexion internet
- Vérifier les logs Supabase

## Support

Consulter les fichiers de documentation:
- `GUIDE_COMPLET.md` - Guide complet des fonctionnalités
- `README.md` - Vue d'ensemble du projet
- `TECH_CHANGES.md` - Changements techniques

---

**Prêt?** Commencez par `pnpm install` puis `pnpm db:migrate` et `pnpm dev`!
