# VêteMart - Guide Complet d'Utilisation

## 📋 Table des matières

1. [Installation et Configuration](#installation-et-configuration)
2. [Fonctionnalités Principales](#fonctionnalités-principales)
3. [Gestion des Vêtements](#gestion-des-vêtements)
4. [Images et Codes QR](#images-et-codes-qr)
5. [Alertes de Stock](#alertes-de-stock)
6. [Rapports et Analytics](#rapports-et-analytics)
7. [Mouvements de Stock](#mouvements-de-stock)
8. [FAQ et Dépannage](#faq-et-dépannage)

---

## Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Compte Supabase gratuit

### Étapes d'installation

```bash
# 1. Cloner ou télécharger le projet
git clone <repository-url>
cd vetement-stock

# 2. Installer les dépendances
pnpm install
# ou: npm install / yarn install / bun install

# 3. Créer le fichier .env.local
cp .env.example .env.local

# 4. Remplir les variables d'environnement Supabase
# Voir: ENV_A_COPIER.txt pour les détails

# 5. Exécuter les migrations
pnpm db:migrate

# 6. Lancer le serveur de développement
pnpm dev

# 7. Ouvrir http://localhost:3000
```

### Variables d'environnement requises

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_xxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Fonctionnalités Principales

### ✨ Tableau de bord (Dashboard)
- **Vue d'ensemble** des stocks
- **4 charts utiles**:
  - Mouvements de stock
  - Distribution par taille
  - Produits par catégorie
  - Tendances temporelles

### 👔 Gestion des Vêtements
- Ajouter/modifier/supprimer des produits
- Gérer les tailles (S, M, XL, XXL)
- Catégories: Hommes, Femmes, Enfants
- Suivi par couleur et matière
- Export/Import Excel

### 📸 Images et Codes QR
- **Ajouter des images** par vêtement
- **Générer des QR codes** automatiquement
- **Identification facile** des produits
- Télécharger les codes QR
- Galerie d'images complète

### 🚨 Alertes de Stock
- **Alertes automatiques** stock bas
- **Notifications rupture** de stock
- **Suivi des alertes** actives
- Marquer comme résolues
- Historique complet

### 📊 Rapports Avancés
- **Statistiques complètes**
- **Charts analytiques**
- **Export Excel** professionnel
- **Produits lents** (peu de mouvements)
- **Distribution par taille**

---

## Gestion des Vêtements

### Ajouter un nouveau vêtement

1. Allez dans **Vêtements** → **Ajouter**
2. Remplissez les informations:
   - **SKU** (code unique, ex: TSHIRT-001)
   - **Nom** du produit
   - **Catégorie** (Hommes/Femmes/Enfants)
   - **Couleur** et **Matière**
   - **Prix unitaire**
   - **Localisation** en entrepôt

3. Définissez les quantités par taille:
   - S, M, XL, XXL
   - Quantité en stock
   - Niveau de réapprovision

4. Cliquez sur **Créer produit**

### Modifier un vêtement

1. Cliquez sur le produit dans la liste
2. Cliquez sur l'icône **Modifier**
3. Changez les informations
4. Cliquez sur **Sauvegarder**

### Supprimer un vêtement

1. Sélectionnez le produit
2. Cliquez sur **Supprimer**
3. Confirmez la suppression

---

## Images et Codes QR

### Ajouter une image

1. Dans la fiche produit, cliquez sur **Ajouter une image**
2. Sélectionnez ou déposez une image:
   - Format: JPEG, PNG, WebP
   - Taille max: 5MB
   - Dimensions recommandées: 1000x1000px

3. Remplissez les détails:
   - **Taille** associée (optionnel)
   - **Variante couleur** (ex: "Rouge", "Bleu")
   - **Image principale** (si oui, elle s'affichera en priorité)

4. Cliquez sur **Ajouter image**

### Utiliser les codes QR

**Le système génère automatiquement** un code QR pour chaque image contenant:
- SKU du produit
- ID de l'image
- Taille (si applicable)
- Variante couleur

#### Cas d'usage des QR codes:

1. **Identification rapide**
   - Scannez avec un téléphone
   - Identifiez instantanément le vêtement

2. **Traçabilité**
   - Chaque image a un code unique
   - Suivi de variante précis

3. **Inventaire**
   - Réduisez les erreurs de comptage
   - Accélérez les audits

#### Télécharger les codes QR

1. Cliquez sur l'image dans la galerie
2. Cliquez sur **Télécharger**
3. Le fichier PNG s'enregistre automatiquement

---

## Alertes de Stock

### Alertes automatiques

Les alertes se créent **automatiquement** quand:
- Quantité ≤ Niveau de réapprovision
- Quantité = 0 (Rupture de stock)

### Consulter les alertes

1. Allez dans **Alertes** (barre latérale)
2. Voir les **alertes actives**
3. Filtrez par:
   - Toutes les alertes
   - Alertes actives
   - Alertes résolues

4. Recherchez par produit ou SKU

### Types d'alertes

| Type | Couleur | Signification |
|------|---------|---------------|
| **Rupture de stock** | Rouge | Quantité = 0 |
| **À réapprovisionner** | Orange | Quantité ≤ 1/3 de la limite |
| **Stock faible** | Jaune | Quantité ≤ Limite |

### Résoudre une alerte

1. Cliquez sur l'alerte
2. Cliquez sur **Résoudre**
3. L'alerte passe en "Résolue"
4. Vous pouvez la réactiver si nécessaire

---

## Rapports et Analytics

### Accéder aux rapports

1. Allez dans **Rapports** (barre latérale)
2. Visualisez automatiquement:
   - **Top 10 produits** (par ventes)
   - **Distribution par taille** (graphique en camembert)
   - **Performance par catégorie**
   - **Produits lents** (peu de mouvements)

### Exporter un rapport

1. Cliquez sur **Exporter Excel** en haut à droite
2. Un fichier Excel se télécharge contenant:
   - **Feuille 1**: Produits (détails complets)
   - **Feuille 2**: Catégories (résumé)
   - **Feuille 3**: Distribution tailles

### Interpréter les données

- **Mouvements totaux**: Nombre d'entrées/sorties
- **Vendu**: Nombre de pièces sorties
- **Acheté**: Nombre de pièces entrées
- **Dernier mouvement**: Dernière date d'activité

---

## Mouvements de Stock

### Enregistrer un mouvement

1. Allez dans **Mouvements**
2. Cliquez sur **Nouveau mouvement**
3. Sélectionnez:
   - **Produit** et **Taille**
   - **Type**: Entrée ou Sortie
   - **Quantité**
   - **Notes** (optionnel)

4. Cliquez sur **Enregistrer**

### Types de mouvements

| Type | Utilisation |
|------|------------|
| **Entrée** | Achat, retour, correction inventaire |
| **Sortie** | Vente, don, perte, correction |

### Historique des mouvements

1. Allez dans **Mouvements**
2. Consultez l'historique complet
3. Filtrez par:
   - Produit
   - Type
   - Période
   - Utilisateur

---

## FAQ et Dépannage

### Q: Le serveur ne démarre pas

**R**: Vérifiez que:
1. Les variables `.env.local` sont correctes
2. Node.js est installé (`node --version`)
3. Les dépendances sont installées (`pnpm install`)
4. Le port 3000 n'est pas utilisé

### Q: Les migrations ne s'exécutent pas

**R**: Essayez:
```bash
# Statut des migrations
pnpm db:migrate:status

# Forcer la réinitialisation (ATTENTION: perte de données)
pnpm db:reset

# Puis réappliquer
pnpm db:migrate
```

### Q: Les images ne s'affichent pas

**R**: 
1. Vérifiez le format (JPEG, PNG, WebP)
2. Vérifiez la taille (< 5MB)
3. Videz le cache du navigateur
4. Vérifiez les erreurs console (F12)

### Q: Comment réinitialiser le mot de passe admin?

**R**: 
1. Allez dans **Paramètres** → **Utilisateurs**
2. Sélectionnez l'utilisateur
3. Cliquez sur **Réinitialiser le mot de passe**

### Q: Je n'ai pas accès à une page

**R**:
1. Vérifiez votre rôle utilisateur
2. Allez dans **Paramètres** → **Permissions**
3. Demandez à l'administrateur d'ajuster vos droits

### Q: Où sont stockées les images?

**R**: Pour la démo, les images sont converties en base64 et stockées dans Supabase. Pour la production, configurez Vercel Blob ou AWS S3.

### Q: Puis-je importer depuis Excel?

**R**: Oui! Dans **Vêtements**, cliquez sur **Importer**. Le fichier doit avoir les colonnes:
- SKU
- Nom du produit
- Catégorie
- Prix unitaire
- Taille S, M, XL, XXL (quantités)

### Q: Comment obtenir mes clés Supabase?

**R**: 
1. Allez sur supabase.com
2. Créez un compte et un projet
3. Dans **Settings** → **API**, copiez:
   - Project URL
   - anon (public) key
   - service_role key

---

## Support et Documentation

- **Documentation Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com

---

**Version**: 2.0  
**Dernière mise à jour**: 2024  
**Licence**: MIT
