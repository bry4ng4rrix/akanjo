# 🚀 Démarrage Rapide - 5 minutes

## Avant de commencer
- Node.js 18+ installé
- Compte Supabase gratuit (supabase.com)

## Étape 1: Créer un projet Supabase (2 min)

1. Allez sur https://supabase.com
2. Cliquez **"New Project"**
3. Remplissez:
   - Organization: Créer nouveau
   - Name: `clothing-stock`
   - Password: Un mot de passe fort
   - Region: Choisissez proche de vous
4. Cliquez **Create new project**
5. ⏳ Attendez 2-3 minutes que le projet soit créé

## Étape 2: Copier les clés API (1 min)

1. Une fois le projet créé, cliquez sur **Settings** (⚙️ en bas à gauche)
2. Cliquez sur **API**
3. Vous verrez trois sections:
   - **Project URL** → Copier cette valeur
   - **anon (public) key** → Copier cette valeur
   - **service_role key** → Copier cette valeur

## Étape 3: Créer `.env.local` (1 min)

1. À la racine du projet, créez un fichier `.env.local`
2. Collez ce contenu:

```env
NEXT_PUBLIC_SUPABASE_URL=<votre Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre anon key>
SUPABASE_SERVICE_ROLE_KEY=<votre service_role key>
```

3. Remplacez les valeurs par celles copiées
4. Sauvegardez le fichier

**Exemple (fictif):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

## Étape 4: Appliquer les migrations (1 min)

```bash
pnpm db:migrate
```

Vous devriez voir:
```
✔  Applied:  20240010_clothing_stock_system.sql
✔  1 migration(s) applied successfully. ✨
```

## Étape 5: Créer un utilisateur (1 min)

1. Allez dans Supabase → **Authentication** → **Users**
2. Cliquez **Add user**
3. Email: `test@example.com`
4. Password: `Password123!`
5. Cliquez **Save**

## Étape 6: Démarrer! (30 sec)

```bash
pnpm dev
```

Ouvrez http://localhost:3000 et connectez-vous avec:
- Email: `test@example.com`
- Password: `Password123!`

## ✅ Bravo!

Vous devriez voir:
- 📊 Dashboard avec 4 charts
- 👕 Page Vêtements
- 📈 Mouvements de stock
- ⚙️ Paramètres

## 🎯 Premiers tests

### 1. Ajouter un produit
- **Vêtements** → **Ajouter**
- SKU: `TSHIRT-001`
- Nom: `T-Shirt Cotton`
- Catégorie: `Hommes`
- Couleur: `Bleu`
- Matière: `100% Coton`
- Prix: `25.99`
- Taille S: `10` unités
- Taille M: `15` unités
- Taille XL: `8` unités
- Taille XXL: `5` unités

### 2. Voir le dashboard
- 4 charts affichent les données
- KPIs mises à jour

### 3. Exporter
- **Vêtements** → **Exporter**
- Fichier Excel téléchargé

## 📚 Pour aller plus loin

| Document | Pour quoi? |
|----------|-----------|
| **ENV_VARIABLES.md** | Détails sur chaque variable |
| **SUPABASE_SETUP.md** | Configuration complète Supabase |
| **README_VETEMENTS.md** | Utilisation complète |
| **SETUP_FINAL.md** | Checklist détaillée |

## 🆘 Ça ne marche pas?

### Erreur: "Cannot connect to Supabase"
```
✅ Vérifiez NEXT_PUBLIC_SUPABASE_URL dans .env.local
✅ Vérifiez le projet Supabase existe
✅ Redémarrez: pnpm dev
```

### Erreur: "Migrations failed"
```
✅ Vérifiez SUPABASE_SERVICE_ROLE_KEY
✅ Essayez: pnpm db:migrate:status
✅ Essayez: pnpm db:reset
```

### Erreur: "Login failed"
```
✅ Vérifiez que l'utilisateur existe dans Supabase
✅ Vérifiez NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ Créez un nouvel utilisateur dans Supabase
```

## 🎉 Vous êtes prêt!

Vous avez maintenant un système complet de gestion des stocks de vêtements avec:
- ✅ Dashboard avec 4 charts
- ✅ Gestion des tailles (S, M, XL, XXL)
- ✅ Catégories (Hommes, Femmes, Enfants)
- ✅ Authentification sécurisée
- ✅ Export/Import Excel

**Durée totale: ~5 minutes** ⏱️
