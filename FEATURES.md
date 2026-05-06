# Fonctionnalités - VêteMart

## Dashboard (Accueil)

### Statistiques principales
- Total de produits en stock
- Valeur du stock
- Articles faibles
- Mouvements aujourd'hui

### 4 Graphiques analytiques
1. **Mouvements par jour** - Tendances des entrées/sorties
2. **Distribution par catégorie** - Homme, Femme, Enfant
3. **Tailles les plus vendues** - S, M, XL, XXL
4. **Top 10 produits** - Produits avec le plus de stock

## Gestion des Vêtements

### Ajouter un vêtement
- Nom du produit
- Référence (SKU)
- Catégorie: Homme, Femme, Enfant
- Tailles disponibles: S, M, XL, XXL
- Quantité par taille
- Fournisseur
- Prix d'achat et de vente
- Images (multiples)
- QR code auto-généré par image

### Modifier/Supprimer
- Éditer tous les champs
- Historique des modifications
- Suppression logique (archive)

### Recherche et filtrage
- Recherche par nom
- Filtrer par catégorie
- Filtrer par fournisseur
- Filtrer par taille
- Tri par stock, prix, date

### Galerie d'images
- Upload plusieurs images
- QR code unique par image
- Scan QR code pour identifier le produit
- Supprimer les images

## Alertes de Stock Bas

### Configuration
- Seuil de stock bas (par défaut: 10)
- Alertes en temps réel

### Gestion
- Liste complète des articles faibles
- Trier par urgence
- Marquer comme traité
- Exporter les alertes

### Notifications
- Badge sur le menu Alertes
- Nombre d'alertes actives

## Mouvements de Stock

### Enregistrer un mouvement
- Type: Entrée, Sortie, Retour, Ajustement
- Produit et taille
- Quantité
- Raison/Notes
- Utilisateur et date (auto)

### Historique
- Liste de tous les mouvements
- Filtrer par type, produit, date
- Recherche avancée
- Export en Excel

## Rapports

### Rapports disponibles

1. **Inventaire complet**
   - Liste tous les produits
   - Quantités par taille
   - Valeur du stock
   - PDF/Excel

2. **Mouvements mensuels**
   - Entrées vs sorties
   - Par produit, catégorie
   - Graphiques

3. **Analyse de catégories**
   - Répartition Homme/Femme/Enfant
   - Tailles les plus populaires
   - Tendances

4. **Fournisseurs**
   - Quantités reçues
   - Délais de livraison
   - Performances

5. **Stock par taille**
   - Distribution des tailles
   - Articles manquants
   - Recommandations

### Export
- Format Excel (.xlsx)
- Format PDF
- Graphiques intégrés
- Prêt pour l'impression

## Images et QR Codes

### Gestion des images
- Upload depuis appareil
- Drag & drop
- Compression automatique
- Stockage sécurisé

### QR Codes
- Généré automatiquement par image
- Code unique par vêtement+image
- Téléchargeable
- Imprimable
- Scanbale avec téléphone

### Utilisation
- Scanner le QR code
- Identifier le produit rapidement
- Vérifier le stock
- Enregistrer mouvements rapides

## Fournisseurs

### Gestion
- Nom, contact, email
- Adresse, téléphone
- Conditions de paiement
- Historique des commandes

### Suivi
- Commandes en attente
- Délais de livraison
- Prix des fournisseurs
- Performances

## Utilisateurs

### Gestion des comptes
- Créer/modifier/supprimer
- Rôles: Admin, Responsable, Opérateur
- Permissions granulaires

### Sécurité
- Authentification sécurisée
- Mots de passe hashés
- Sessions

## Notifications

### Types
- Stock bas
- Nouveau mouvement
- Rappels
- Messages

### Gestion
- Voir toutes les notifications
- Marquer comme lues
- Supprimer
- Paramètres de notification

## Paramètres

### Généraux
- Nom de l'entreprise
- Logo
- Devise
- Fuseau horaire

### Stock
- Seuil de stock bas
- Unités de mesure
- Catégories personnalisées

### Utilisateurs
- Gérer les comptes
- Permissions

### Système
- Sauvegardes
- Journaux d'activité
- Maintenance

## Sécurité

### Authentification
- Email + mot de passe
- Mots de passe sécurisés (bcrypt)
- Sessions sécurisées

### Autorisation
- Row Level Security (RLS)
- Contrôle d'accès par rôle
- Chiffrement des données sensibles

### Audit
- Journaux d'activité
- Qui a fait quoi et quand
- Traçabilité complète

## Performance

### Optimisations
- Cache des données
- Pagination
- Recherche indexée
- Requêtes optimisées

### Base de données
- Indexation automatique
- Requêtes pré-optimisées
- Gestion mémoire efficace

## Mobile

### Responsive design
- Fonctionne sur téléphone
- Tablette
- Ordinateur

### Fonctionnalités mobile
- Scan QR code
- Upload d'images
- Gestion de stock en mobilité

---

**Total: 50+ fonctionnalités** pour une gestion complète de votre stock de vêtements!
