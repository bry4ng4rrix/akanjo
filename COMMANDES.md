# 📟 Commandes Essentielles

## 🚀 Démarrage

```bash
# Installer les dépendances
pnpm install

# Lancer en développement
pnpm dev

# Voir à: http://localhost:3000
```

## 🗄️ Base de données (Migrations)

```bash
# Appliquer les migrations
pnpm db:migrate

# Voir le statut des migrations
pnpm db:migrate:status

# Réinitialiser la base de données (⚠️  supprime tout!)
pnpm db:reset

# Seed la base avec des données de test
pnpm db:seed
```

## 📦 Build & Production

```bash
# Builder l'application
pnpm build

# Lancer en production
pnpm start

# Linter le code
pnpm lint
```

## 📁 Fichier .env.local requis

```bash
# Créer le fichier
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_xxxx" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=eyJ..." >> .env.local

# Vérifier le contenu
cat .env.local
```

## 🔍 Diagnostic

```bash
# Vérifier migrations
pnpm db:migrate:status

# Voir les logs du serveur
pnpm dev

# Vérifier node_modules
ls node_modules | grep supabase

# Vérifier git
git status
```

## 🚢 Déploiement Vercel

```bash
# Installer Vercel CLI
pnpm add -g vercel

# Connecter à Vercel
vercel login

# Créer/linker le projet
vercel link

# Ajouter variables (interactive)
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Déployer
vercel deploy
```

## 🧹 Nettoyage

```bash
# Nettoyer node_modules
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Nettoyer cache Next.js
rm -rf .next

# Réinitialiser migrations
pnpm db:reset

# Réinitialiser git (⚠️  attention!)
git reset --hard HEAD
```

## 🆘 Troubleshooting

```bash
# Port 3000 déjà utilisé? Utiliser un autre port
pnpm dev -- -p 3001

# Voir les logs complets
pnpm dev 2>&1 | tee debug.log

# Vérifier les fichiers modifiés
git status

# Vérifier les changements
git diff

# Voir l'historique
git log --oneline
```

## 📊 Utilitaires

```bash
# Exporter un PDF du readme
pnpm add -D md-to-pdf
md-to-pdf README_VETEMENTS.md

# Compter les lignes de code
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l

# Vérifier la taille des fichiers
du -sh node_modules
du -sh .next
```

## ⚡ Alias utiles

Ajouter à votre `.bashrc` ou `.zshrc`:

```bash
# Démarrage rapide
alias dev='pnpm dev'
alias build='pnpm build'
alias start='pnpm start'

# Migrations
alias migrate='pnpm db:migrate'
alias migrate-status='pnpm db:migrate:status'
alias db-reset='pnpm db:reset'

# Utilitaires
alias install='pnpm install'
alias lint='pnpm lint'
```

Puis utiliser:
```bash
dev          # Lance le serveur
migrate      # Applique migrations
migrate-status # Voir statut
```

## 📋 Checklist démarrage

```bash
# 1. Créer .env.local avec les 3 variables
✅ Fichier créé

# 2. Appliquer migrations
✅ pnpm db:migrate

# 3. Lancer serveur
✅ pnpm dev

# 4. Vérifier http://localhost:3000
✅ Page accessible

# 5. Se connecter
✅ Login fonctionne

# 6. Voir dashboard
✅ 4 charts visibles
```

---

**Quick reference à garder sous la main!**
