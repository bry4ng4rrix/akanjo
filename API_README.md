# E-kajy Entana - API REST Mobile

## Configuration

Ajoutez la **Service Role Key** dans votre `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role  # ⚠️ Requis pour l'API
```

> **⚠️ IMPORTANT** : La `SUPABASE_SERVICE_ROLE_KEY` est requise. Trouvez-la dans Supabase Dashboard → Project Settings → API → "service_role" key.

---

## Endpoints API

Base URL : `https://votre-app.vercel.app/api` ou `http://localhost:3000/api`

### 🔐 Authentification

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "magasinier",
    "full_name": "John Doe"
  },
  "message": "Compte créé avec succès"
}
```

---

#### POST `/api/auth/login`
Connexion.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "admin",
    "full_name": "John Doe"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_at": 1234567890
  }
}
```

---

### 📦 Produits

#### GET `/api/products`
Liste tous les produits.

**Response :**
```json
{
  "products": [
    {
      "id": "uuid",
      "sku": "LAPTOP-001",
      "name": "Ordinateur Portable",
      "description": "...",
      "category_id": "uuid",
      "supplier_id": "uuid",
      "location": "Rayon A1",
      "quantity": 45,
      "unit_price": 899.99,
      "reorder_level": 10,
      "status": "in_stock",
      "categories": { "name": "Électronique" },
      "suppliers": { "name": "TechDistribution" }
    }
  ]
}
```

---

#### GET `/api/products/[id]`
Détail d'un produit.

---

#### POST `/api/products`
Créer un produit.

**Body :**
```json
{
  "sku": "NEW-001",
  "name": "Nouveau Produit",
  "description": "Description",
  "category_id": "uuid-categorie",
  "supplier_id": "uuid-fournisseur",
  "location": "Rayon B2",
  "quantity": 20,
  "unit_price": 150.00,
  "reorder_level": 5
}
```

---

#### PUT `/api/products/[id]`
Modifier un produit.

**Body :** Même format que POST (tous les champs optionnels)

---

#### DELETE `/api/products/[id]`
Supprimer un produit.

---

### 📂 Catégories

#### GET `/api/categories`
Liste toutes les catégories.

**Response :**
```json
{
  "categories": [
    { "id": "uuid", "name": "Électronique", "description": "..." }
  ]
}
```

---

#### POST `/api/categories`
Créer une catégorie.

**Body :**
```json
{
  "name": "Nouvelle Catégorie",
  "description": "Description"
}
```

---

#### DELETE `/api/categories/[id]`
Supprimer une catégorie.

---

### 🚚 Fournisseurs

#### GET `/api/suppliers`
Liste tous les fournisseurs.

**Response :**
```json
{
  "suppliers": [
    {
      "id": "uuid",
      "name": "TechDistribution SA",
      "email": "contact@techdist.fr",
      "phone": "+33123456789",
      "address": "123 Rue de la Tech",
      "city": "Paris",
      "postal_code": "75001",
      "country": "France",
      "contact_person": "Marie Dupont"
    }
  ]
}
```

---

#### POST `/api/suppliers`
Créer un fournisseur.

**Body :**
```json
{
  "name": "Nouveau Fournisseur",
  "email": "contact@example.com",
  "phone": "+123456789",
  "address": "123 Rue...",
  "city": "Paris",
  "postal_code": "75000",
  "country": "France",
  "contact_person": "Jean Dupont"
}
```

---

### 📈 Mouvements de Stock

#### GET `/api/movements`
Liste tous les mouvements.

**Response :**
```json
{
  "movements": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "type": "entry",
      "quantity": 20,
      "notes": "Réception fournisseur",
      "created_at": "2024-01-15T10:30:00Z",
      "products": { "name": "Ordinateur Portable", "sku": "LAPTOP-001" }
    }
  ]
}
```

---

#### POST `/api/movements`
Créer un mouvement (entrée ou sortie). Met automatiquement à jour la quantité du produit.

**Body :**
```json
{
  "product_id": "uuid-produit",
  "type": "entry",  // ou "exit"
  "quantity": 20,
  "notes": "Réception du 15/01",
  "user_id": "uuid-utilisateur"  // optionnel
}
```

> **Note** : Si `type` = `exit`, la quantité du produit sera décrémentée.

---

### 📊 Dashboard

#### GET `/api/dashboard/stats`
Statistiques complètes du dashboard.

**Response :**
```json
{
  "stats": {
    "totalProducts": 50,
    "totalValue": 1250000.50,
    "lowStockCount": 5
  },
  "chartData": [
    { "date": "Lun", "entrées": 12, "sorties": 8 },
    { "date": "Mar", "entrées": 19, "sorties": 12 }
  ],
  "recentMovements": [
    {
      "id": "uuid",
      "type": "entry",
      "quantity": 20,
      "created_at": "2024-01-15T10:30:00Z",
      "products": { "name": "Ordinateur Portable" }
    }
  ]
}
```

---

## Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide (champs manquants) |
| 401 | Non autorisé (login échoué) |
| 404 | Non trouvé |
| 500 | Erreur serveur |

---

## Exemple d'utilisation avec fetch (React Native / Flutter)

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('https://votre-app.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// Liste des produits
const getProducts = async () => {
  const response = await fetch('https://votre-app.com/api/products');
  return response.json();
};

// Créer un mouvement (sortie de stock)
const createMovement = async (productId, quantity) => {
  const response = await fetch('https://votre-app.com/api/movements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      type: 'exit',
      quantity: quantity,
      notes: 'Vente client',
    }),
  });
  return response.json();
};
```

---

## Sécurité

- L'API utilise la **Service Role Key** côté serveur pour bypass RLS
- Pas d'authentification JWT requise sur les endpoints (à ajouter si besoin)
- En production, ajoutez rate limiting et validation JWT si nécessaire
