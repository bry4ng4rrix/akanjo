# 🎯 Configuration Finale - Système de Gestion des Stocks de Vêtements

## Vue d'ensemble du projet

Vous avez maintenant un système complet de gestion des stocks de vêtements avec:
- ✅ Gestion des vêtements par catégorie (Hommes, Femmes, Enfants)
- ✅ Gestion des tailles (S, M, XL, XXL)
- ✅ Dashboard avec 4 charts utiles
- ✅ Historique des mouvements
- ✅ Export/Import Excel
- ✅ Authentification sécurisée

## ⚙️ Variables d'environnement obligatoires

**Créez un fichier `.env.local` à la racine avec EXACTEMENT ces 3 variables:**

```env
# ══════════════════════════════════════════════════════════════
# SUPABASE - À obtenir de: supabase.com → Project → Settings → API
# ══════════════════════════════════════════════════════════════

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 📋 Checklist d'installation

### Étape 1: Créer un projet Supabase ✅
- [ ] Allez sur [supabase.com](https://supabase.com)
- [ ] Créez un nouveau projet
- [ ] Attendez que le projet soit créé (2-3 minutes)

### Étape 2: Copier les clés API ✅
- [ ] Dans Supabase, allez: **Settings** → **API**
- [ ] Copiez `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copiez `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon key)
- [ ] Copiez `SUPABASE_SERVICE_ROLE_KEY` (service_role key)

### Étape 3: Configurer .env.local ✅
- [ ] Créez un fichier `.env.local` à la racine du projet
- [ ] Collez les 3 variables ci-dessus
- [ ] Assurez-vous que le fichier est dans `.gitignore`

### Étape 4: Appliquer les migrations ✅
- [ ] Ouvrez un terminal
- [ ] Exécutez: `pnpm db:migrate`
- [ ] Attendez le message: "✔ X migration(s) applied successfully"

### Étape 5: Créer un utilisateur de test ✅
- [ ] Dans Supabase, allez: **Authentication** → **Users**
- [ ] Cliquez sur **Add user**
- [ ] Entrez un email et un mot de passe
- [ ] Confirmez

### Étape 6: Lancer l'application ✅
- [ ] Exécutez: `pnpm dev`
- [ ] Allez sur http://localhost:3000
- [ ] Connectez-vous avec l'utilisateur créé

## 🎓 Documentation complète

| Document | Contenu |
|----------|---------|
| **ENV_VARIABLES.md** | Guide détaillé sur chaque variable d'environnement |
| **SUPABASE_SETUP.md** | Configuration complète de Supabase |
| **README_VETEMENTS.md** | Guide d'utilisation du système |

## 🔍 Vérification rapide

### Test 1: Variables correctes

```bash
# Vérifiez que .env.local existe
ls -la | grep env.local

# Vérifiez le contenu (ne committez PAS)
cat .env.local
```

### Test 2: Migrations appliquées

```bash
pnpm db:migrate:status
# Devrait montrer: ✔ 20240010_clothing_stock_system.sql
```

### Test 3: Serveur de développement

```bash
pnpm dev
# Devrait afficher: ▲ Next.js started
# Ouvrez: http://localhost:3000
```

### Test 4: Connexion

- Email/mot de passe depuis l'étape 5
- Vous devriez voir le dashboard avec 4 charts

## 📊 Les 4 Charts du Dashboard

1. **Mouvements (7 jours)** - Graphique en ligne
   - Entrées vs Sorties de stock
   - Visualise la tendance

2. **Quantités par taille** - Graphique en barres
   - Stock pour S, M, XL, XXL
   - Facile à lire

3. **Distribution par taille** - Graphique camembert
   - Proportion du stock par taille
   - Visualise les déséquilibres

4. **Stock par catégorie** - Graphique camembert
   - Distribution par genre (Hommes, Femmes, Enfants)
   - Visualise la concentration du stock

## 🎯 Cas d'usage principaux

### Ajouter un produit
1. **Vêtements** → **Ajouter**
2. Remplir: SKU, Nom, Catégorie, Couleur, Matière, Prix
3. Entrer les quantités pour S, M, XL, XXL
4. Cliquer **Ajouter**

### Gérer les mouvements
1. **Mouvements**
2. Sélectionner le produit et la taille
3. Entrer la quantité (entrée ou sortie)
4. Notes optionnelles

### Exporter les données
1. **Vêtements** → **Exporter**
2. Télécharge un fichier Excel avec tous les produits
3. Chaque ligne = 1 produit + taille

## 🚨 Points importants

### ⚠️ Sécurité
- ❌ Ne commitez JAMAIS `.env.local` en Git
- ❌ Ne sharez JAMAIS `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Les variables `NEXT_PUBLIC_*` peuvent être publiques

### ⚠️ Migrations
- Les migrations se font automatiquement avec `pnpm db:migrate`
- Ne modifiez PAS les fichiers SQL sauf si vous savez ce que vous faites
- Pour réinitialiser: `pnpm db:reset` (attention!)

### ⚠️ Base de données
- Supabase = PostgreSQL gratuit jusqu'à 500 MB
- Row Level Security activée automatiquement
- Backups automatiques inclus

## 🔄 Workflow typique

```
1. Créer projet Supabase
   ↓
2. Copier clés API
   ↓
3. Créer .env.local
   ↓
4. pnpm db:migrate
   ↓
5. Créer utilisateur Supabase
   ↓
6. pnpm dev
   ↓
7. Login & utiliser l'app
```

## 📞 Troubleshooting rapide

| Erreur | Solution |
|--------|----------|
| "Cannot connect to Supabase" | Vérifiez NEXT_PUBLIC_SUPABASE_URL |
| "401 Unauthorized" | Vérifiez NEXT_PUBLIC_SUPABASE_ANON_KEY |
| "Migrations failed" | Vérifiez SUPABASE_SERVICE_ROLE_KEY |
| "No data showing" | Exécutez `pnpm db:migrate:status` |
| "Port 3000 already in use" | Utilisez `pnpm dev -- -p 3001` |

## 🎓 Fichiers de référence à lire

1. **Première fois?** → Commencez par ce fichier (celui-ci!)
2. **Configuration env?** → Lire [ENV_VARIABLES.md](./ENV_VARIABLES.md)
3. **Configuration Supabase?** → Lire [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
4. **Utilisation app?** → Lire [README_VETEMENTS.md](./README_VETEMENTS.md)

## 🚀 Prêt à démarrer?

```bash
# 1. Créer .env.local avec les 3 variables
# 2. Exécuter les migrations
pnpm db:migrate

# 3. Lancer le serveur
pnpm dev

# 4. Ouvrir http://localhost:3000
# 5. Vous connecter et commencer!
```

---

**Bonne chance! 🎉 Pour toute question, consultez la documentation complète ci-dessus.**
