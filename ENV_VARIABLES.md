# Variables d'Environnement Nécessaires

## Vue d'ensemble

Ce projet requiert **3 variables d'environnement principales** de Supabase:

## 1. `NEXT_PUBLIC_SUPABASE_URL`

**Type**: URL  
**Visibilité**: Public (utilisé côté client)  
**Description**: L'URL de base de votre projet Supabase

**Comment obtenir**:
1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. Allez dans **Settings** (roue dentée) → **API**
4. Copiez **Project URL**

**Format attendu**:
```
https://your-project-name.supabase.co
```

**Exemple**:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
```

---

## 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Type**: JWT Token  
**Visibilité**: Public (utilisé côté client)  
**Description**: Clé d'authentification anonyme pour l'API Supabase

**Comment obtenir**:
1. Allez dans **Settings** → **API**
2. Sous "Project API keys", trouvez **anon key (public)**
3. Copiez cette clé

**Format attendu**:
```
sb_anon_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Exemple**:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV
```

---

## 3. `SUPABASE_SERVICE_ROLE_KEY`

**Type**: JWT Token (sécurisé)  
**Visibilité**: Secret (utilisé côté serveur SEULEMENT)  
**Description**: Clé de service avec droits administrateur pour les migrations et opérations serveur

**Comment obtenir**:
1. Allez dans **Settings** → **API**
2. Sous "Project API keys", trouvez **service_role key (secret)**
3. Copiez cette clé
4. ⚠️ **NE PAS EXPOSER cette clé en public**

**Format attendu**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxd3f...
```

**Exemple**:
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxx
```

---

## Fichier `.env.local` complet

Créez un fichier `.env.local` à la racine du projet avec:

```env
# ══════════════════════════════════════════════════════════════
# SUPABASE CONFIGURATION
# ══════════════════════════════════════════════════════════════

# ── Clés publiques (côté client) ──────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Clés secrètes (côté serveur) ──────────────────────────────
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx
```

---

## Comment configurer

### Option 1: Développement local

1. Créez un fichier `.env.local` à la racine
2. Copiez les 3 variables ci-dessus
3. Remplacez `your-project` et les clés par vos vraies valeurs
4. Sauvegardez le fichier
5. Redémarrez votre serveur de développement

### Option 2: Déploiement sur Vercel

1. Allez sur https://vercel.com
2. Ouvrez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez chaque variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Déployez le projet

### Option 3: Déploiement sur un autre serveur

Assurez-vous que les variables d'environnement sont définies:

```bash
export NEXT_PUBLIC_SUPABASE_URL=...
export NEXT_PUBLIC_SUPABASE_ANON_KEY=...
export SUPABASE_SERVICE_ROLE_KEY=...
pnpm build && pnpm start
```

---

## Vérification

Pour vérifier que les variables sont correctement configurées:

1. Lancez le serveur de développement:
```bash
pnpm dev
```

2. Allez sur http://localhost:3000

3. Essayez de vous connecter ou créer un compte

4. Si vous voyez le dashboard avec les données, c'est bon !

---

## Sécurité

### ⚠️ Points importants

1. **Ne commettez JAMAIS** `SUPABASE_SERVICE_ROLE_KEY` dans Git
2. Les variables commençant par `NEXT_PUBLIC_` sont visibles côté client - c'est normal
3. `SUPABASE_SERVICE_ROLE_KEY` doit TOUJOURS être secret
4. N'utilisez PAS la `SUPABASE_SERVICE_ROLE_KEY` côté client
5. Utilisez toujours `.env.local` en développement (ajoutez-le à `.gitignore`)

### Fichier `.gitignore` (déjà présent)

```
.env.local
.env.*.local
```

---

## Où se trouvent les clés dans Supabase

**Dashboard Supabase** → **Project** → **Settings** (⚙️) → **API**

```
┌─────────────────────────────────┐
│ Supabase Dashboard              │
├─────────────────────────────────┤
│ ⚙️  Settings                    │
│    ↓ API                        │
│                                 │
│ Project URL:                    │
│ https://xxx.supabase.co         │
│                                 │
│ Project API keys:               │
│ • anon (public)    [copy]       │
│ • service_role     [copy]       │
│                                 │
└─────────────────────────────────┘
```

---

## Tests de connexion

### Test 1: Vérifier la connexion basique

```javascript
// Dans la console du navigateur
fetch('https://your-project.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
  },
})
.then(r => r.json())
.then(console.log)
```

### Test 2: Vérifier les authentifications

```bash
pnpm dev
# Essayez de vous connecter avec un compte Supabase
```

---

## FAQ

**Q: Quelle est la différence entre les 3 clés?**
- `NEXT_PUBLIC_SUPABASE_URL`: URL de connexion au serveur Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Utilisé côté client pour les opérations basiques (lecture, insertion)
- `SUPABASE_SERVICE_ROLE_KEY`: Utilisé côté serveur pour les migrations et opérations privilégiées

**Q: Je peux utiliser la `SUPABASE_SERVICE_ROLE_KEY` côté client?**
- ❌ Non! Elle ne doit JAMAIS être exposée. Elle contient les droits administrateur.

**Q: Que faire si j'ai leaké une clé?**
- Régénérez-la immédiatement dans Supabase Settings → API
- Mettre à jour votre fichier `.env.local`
- Redéployer votre application

**Q: Les variables `.env.local` sont-elles automatiquement chargées?**
- Oui, Next.js les charge automatiquement en développement
- En production, vous devez les configurer dans votre plateforme d'hébergement

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase API Keys](https://supabase.com/docs/guides/api)
