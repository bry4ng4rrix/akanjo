# E-kajy Entana - API Endpoints Documentation

## Base URL

```
Local:    http://localhost:3000/api
Production: https://votre-app.vercel.app/api
```

---

## Configuration Requise

### Variables d'environnement (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role
```

> **⚠️ IMPORTANT** : La `SUPABASE_SERVICE_ROLE_KEY` est obligatoire. 
> Trouvez-la dans : Supabase Dashboard → Project Settings → API → "service_role" key

---

## 📡 Endpoints

### 🔐 1. AUTHENTIFICATION

#### 1.1 Inscription
```http
POST /api/auth/register
```

**Description** : Créer un nouveau compte utilisateur

**Body (JSON)** :
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Champs requis** :
- `email` (string) : Email valide
- `password` (string) : Minimum 6 caractères
- `full_name` (string, optionnel) : Nom complet

**Réponse succès (201)** :
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "role": "magasinier",
    "full_name": "John Doe"
  },
  "message": "Compte créé avec succès"
}
```

**Réponse erreur (400)** :
```json
{
  "error": "Le mot de passe doit faire au moins 6 caractères"
}
```

---

#### 1.2 Connexion
```http
POST /api/auth/login
```

**Description** : Connecter un utilisateur existant

**Body (JSON)** :
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Champs requis** :
- `email` (string)
- `password` (string)

**Réponse succès (200)** :
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "role": "admin",
    "full_name": "John Doe"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_at": 1704067200
  }
}
```

**Réponse erreur (401)** :
```json
{
  "error": "Invalid login credentials"
}
```

---

### 📦 2. PRODUITS

#### 2.1 Liste tous les produits
```http
GET /api/products
```

**Description** : Récupérer tous les produits avec leurs catégories et fournisseurs

**Réponse succès (200)** :
```json
{
  "products": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "sku": "LAPTOP-001",
      "name": "Ordinateur Portable ProBook 15",
      "description": "Ordinateur portable 15 pouces",
      "category_id": "550e8400-e29b-41d4-a716-446655440001",
      "supplier_id": "550e8400-e29b-41d4-a716-446655450001",
      "location": "Rayon A1",
      "quantity": 45,
      "unit_price": 899.99,
      "reorder_level": 10,
      "status": "in_stock",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z",
      "categories": {
        "name": "Électronique"
      },
      "suppliers": {
        "name": "TechDistribution SA"
      }
    }
  ]
}
```

---

#### 2.2 Détail d'un produit
```http
GET /api/products/{id}
```

**Description** : Récupérer les détails d'un produit spécifique

**Paramètres URL** :
- `id` (string, UUID) : ID du produit

**Réponse succès (200)** :
```json
{
  "product": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "sku": "LAPTOP-001",
    "name": "Ordinateur Portable ProBook 15",
    "description": "Ordinateur portable 15 pouces",
    "category_id": "550e8400-e29b-41d4-a716-446655440001",
    "supplier_id": "550e8400-e29b-41d4-a716-446655450001",
    "location": "Rayon A1",
    "quantity": 45,
    "unit_price": 899.99,
    "reorder_level": 10,
    "status": "in_stock",
    "categories": {
      "name": "Électronique"
    },
    "suppliers": {
      "name": "TechDistribution SA"
    }
  }
}
```

**Réponse erreur (404)** :
```json
{
  "error": "Produit non trouvé"
}
```

---

#### 2.3 Créer un produit
```http
POST /api/products
```

**Description** : Ajouter un nouveau produit au catalogue

**Body (JSON)** :
```json
{
  "sku": "NEW-001",
  "name": "Nouveau Produit",
  "description": "Description du produit",
  "category_id": "550e8400-e29b-41d4-a716-446655440001",
  "supplier_id": "550e8400-e29b-41d4-a716-446655450001",
  "location": "Rayon B2",
  "quantity": 20,
  "unit_price": 150.00,
  "reorder_level": 5
}
```

**Champs requis** :
- `sku` (string) : Référence unique
- `name` (string) : Nom du produit
- `unit_price` (number) : Prix unitaire

**Champs optionnels** :
- `description` (string)
- `category_id` (string, UUID)
- `supplier_id` (string, UUID)
- `location` (string)
- `quantity` (number, défaut: 0)
- `reorder_level` (number, défaut: 10)

**Réponse succès (201)** :
```json
{
  "product": {
    "id": "750e8400-e29b-41d4-a716-446655440001",
    "sku": "NEW-001",
    "name": "Nouveau Produit",
    "description": "Description du produit",
    "category_id": "550e8400-e29b-41d4-a716-446655440001",
    "supplier_id": "550e8400-e29b-41d4-a716-446655450001",
    "location": "Rayon B2",
    "quantity": 20,
    "unit_price": 150.00,
    "reorder_level": 5,
    "status": "in_stock",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**Réponse erreur (400)** :
```json
{
  "error": "SKU, nom et prix unitaire sont requis"
}
```

---

#### 2.4 Modifier un produit
```http
PUT /api/products/{id}
```

**Description** : Mettre à jour un produit existant

**Paramètres URL** :
- `id` (string, UUID) : ID du produit

**Body (JSON)** : Même format que POST (tous les champs optionnels)
```json
{
  "name": "Nom modifié",
  "unit_price": 199.99,
  "quantity": 50
}
```

**Réponse succès (200)** :
```json
{
  "product": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "sku": "LAPTOP-001",
    "name": "Nom modifié",
    "unit_price": 199.99,
    "quantity": 50,
    "updated_at": "2024-01-16T14:30:00Z"
  }
}
```

---

#### 2.5 Supprimer un produit
```http
DELETE /api/products/{id}
```

**Description** : Supprimer un produit du catalogue

**Paramètres URL** :
- `id` (string, UUID) : ID du produit

**Réponse succès (200)** :
```json
{
  "message": "Produit supprimé"
}
```

---

### 📂 3. CATÉGORIES

#### 3.1 Liste toutes les catégories
```http
GET /api/categories
```

**Description** : Récupérer toutes les catégories

**Réponse succès (200)** :
```json
{
  "categories": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Électronique",
      "description": "Produits électroniques",
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Vêtements",
      "description": "Vêtements et accessoires",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

#### 3.2 Créer une catégorie
```http
POST /api/categories
```

**Description** : Ajouter une nouvelle catégorie

**Body (JSON)** :
```json
{
  "name": "Nouvelle Catégorie",
  "description": "Description de la catégorie"
}
```

**Champs requis** :
- `name` (string) : Nom unique de la catégorie

**Champs optionnels** :
- `description` (string)

**Réponse succès (201)** :
```json
{
  "category": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "name": "Nouvelle Catégorie",
    "description": "Description de la catégorie",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**Réponse erreur (400)** :
```json
{
  "error": "Le nom est requis"
}
```

---

#### 3.3 Supprimer une catégorie
```http
DELETE /api/categories/{id}
```

**Description** : Supprimer une catégorie

**Paramètres URL** :
- `id` (string, UUID) : ID de la catégorie

**Réponse succès (200)** :
```json
{
  "message": "Catégorie supprimée"
}
```

---

### 🚚 4. FOURNISSEURS

#### 4.1 Liste tous les fournisseurs
```http
GET /api/suppliers
```

**Description** : Récupérer tous les fournisseurs

**Réponse succès (200)** :
```json
{
  "suppliers": [
    {
      "id": "550e8400-e29b-41d4-a716-446655450001",
      "name": "TechDistribution SA",
      "email": "contact@techdist.fr",
      "phone": "+33123456789",
      "address": "123 Rue de la Tech",
      "city": "Paris",
      "postal_code": "75001",
      "country": "France",
      "contact_person": "Marie Dupont",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

#### 4.2 Créer un fournisseur
```http
POST /api/suppliers
```

**Description** : Ajouter un nouveau fournisseur

**Body (JSON)** :
```json
{
  "name": "Nouveau Fournisseur",
  "email": "contact@example.com",
  "phone": "+33123456789",
  "address": "123 Rue Example",
  "city": "Paris",
  "postal_code": "75000",
  "country": "France",
  "contact_person": "Jean Dupont"
}
```

**Champs requis** :
- `name` (string) : Nom du fournisseur

**Champs optionnels** :
- `email` (string)
- `phone` (string)
- `address` (string)
- `city` (string)
- `postal_code` (string)
- `country` (string)
- `contact_person` (string)

**Réponse succès (201)** :
```json
{
  "supplier": {
    "id": "550e8400-e29b-41d4-a716-446655450004",
    "name": "Nouveau Fournisseur",
    "email": "contact@example.com",
    "phone": "+33123456789",
    "address": "123 Rue Example",
    "city": "Paris",
    "postal_code": "75000",
    "country": "France",
    "contact_person": "Jean Dupont",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

---

### 📈 5. MOUVEMENTS DE STOCK

#### 5.1 Liste tous les mouvements
```http
GET /api/movements
```

**Description** : Récupérer l'historique des entrées et sorties

**Réponse succès (200)** :
```json
{
  "movements": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440001",
      "product_id": "650e8400-e29b-41d4-a716-446655440001",
      "type": "entry",
      "quantity": 20,
      "notes": "Réception fournisseur",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2024-01-15T14:30:00Z",
      "products": {
        "name": "Ordinateur Portable ProBook 15",
        "sku": "LAPTOP-001"
      }
    },
    {
      "id": "750e8400-e29b-41d4-a716-446655440002",
      "product_id": "650e8400-e29b-41d4-a716-446655440001",
      "type": "exit",
      "quantity": 5,
      "notes": "Vente client",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2024-01-15T16:00:00Z",
      "products": {
        "name": "Ordinateur Portable ProBook 15",
        "sku": "LAPTOP-001"
      }
    }
  ]
}
```

---

#### 5.2 Créer un mouvement
```http
POST /api/movements
```

**Description** : Enregistrer une entrée ou sortie de stock. Met automatiquement à jour la quantité du produit.

**Body (JSON)** :
```json
{
  "product_id": "650e8400-e29b-41d4-a716-446655440001",
  "type": "entry",
  "quantity": 20,
  "notes": "Réception du 15/01",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Champs requis** :
- `product_id` (string, UUID) : ID du produit concerné
- `type` (string) : `"entry"` pour entrée, `"exit"` pour sortie
- `quantity` (number) : Quantité (doit être > 0)

**Champs optionnels** :
- `notes` (string) : Notes sur le mouvement
- `user_id` (string, UUID) : ID de l'utilisateur qui fait le mouvement

**Réponse succès (201)** :
```json
{
  "movement": {
    "id": "750e8400-e29b-41d4-a716-446655440003",
    "product_id": "650e8400-e29b-41d4-a716-446655440001",
    "type": "entry",
    "quantity": 20,
    "notes": "Réception du 15/01",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2024-01-15T14:30:00Z"
  }
}
```

> **Note importante** : La quantité du produit est automatiquement mise à jour :
> - `entry` : ajoute la quantité au stock
> - `exit` : retire la quantité du stock

**Réponse erreur (400)** :
```json
{
  "error": "Produit, type et quantité sont requis"
}
```

```json
{
  "error": "Type doit être \"entry\" ou \"exit\""
}
```

---

### 📊 6. DASHBOARD

#### 6.1 Statistiques complètes
```http
GET /api/dashboard/stats
```

**Description** : Récupérer toutes les statistiques pour le dashboard (KPIs, graphique, activités récentes)

**Réponse succès (200)** :
```json
{
  "stats": {
    "totalProducts": 50,
    "totalValue": 1250000.50,
    "lowStockCount": 5
  },
  "chartData": [
    {
      "date": "Lun",
      "entrées": 12,
      "sorties": 8
    },
    {
      "date": "Mar",
      "entrées": 19,
      "sorties": 12
    },
    {
      "date": "Mer",
      "entrées": 15,
      "sorties": 10
    },
    {
      "date": "Jeu",
      "entrées": 25,
      "sorties": 18
    },
    {
      "date": "Ven",
      "entrées": 22,
      "sorties": 15
    },
    {
      "date": "Sam",
      "entrées": 18,
      "sorties": 12
    },
    {
      "date": "Dim",
      "entrées": 14,
      "sorties": 9
    }
  ],
  "recentMovements": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440001",
      "type": "entry",
      "quantity": 20,
      "created_at": "2024-01-15T14:30:00Z",
      "products": {
        "name": "Ordinateur Portable ProBook 15"
      }
    },
    {
      "id": "750e8400-e29b-41d4-a716-446655440002",
      "type": "exit",
      "quantity": 5,
      "created_at": "2024-01-15T16:00:00Z",
      "products": {
        "name": "Souris sans fil Bluetooth"
      }
    }
  ]
}
```

**Description des champs** :
- `stats` : KPIs du dashboard
  - `totalProducts` : Nombre total de produits
  - `totalValue` : Valeur totale du stock (prix × quantité)
  - `lowStockCount` : Nombre de produits en stock faible
- `chartData` : Données pour le graphique des 7 derniers jours
  - `date` : Jour de la semaine (Lun, Mar, Mer...)
  - `entrées` : Quantité totale des entrées ce jour
  - `sorties` : Quantité totale des sorties ce jour
- `recentMovements` : 10 derniers mouvements avec nom du produit

---

## Codes de réponse HTTP

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 400 | Bad Request | Requête invalide (champs manquants ou invalides) |
| 401 | Unauthorized | Authentification échouée |
| 404 | Not Found | Ressource non trouvée |
| 500 | Internal Server Error | Erreur serveur |

---

## Exemples d'utilisation

### React Native / JavaScript

```javascript
const API_URL = 'https://votre-app.com/api';

// Helper pour les requêtes
const api = {
  // Auth
  register: (email, password, full_name) => 
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name }),
    }).then(r => r.json()),

  login: (email, password) => 
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json()),

  // Products
  getProducts: () => 
    fetch(`${API_URL}/products`).then(r => r.json()),

  getProduct: (id) => 
    fetch(`${API_URL}/products/${id}`).then(r => r.json()),

  createProduct: (data) => 
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  updateProduct: (id, data) => 
    fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  deleteProduct: (id) => 
    fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    }).then(r => r.json()),

  // Categories
  getCategories: () => 
    fetch(`${API_URL}/categories`).then(r => r.json()),

  createCategory: (name, description) => 
    fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    }).then(r => r.json()),

  deleteCategory: (id) => 
    fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
    }).then(r => r.json()),

  // Suppliers
  getSuppliers: () => 
    fetch(`${API_URL}/suppliers`).then(r => r.json()),

  createSupplier: (data) => 
    fetch(`${API_URL}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  // Movements
  getMovements: () => 
    fetch(`${API_URL}/movements`).then(r => r.json()),

  createMovement: (product_id, type, quantity, notes = '') => 
    fetch(`${API_URL}/movements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id, type, quantity, notes }),
    }).then(r => r.json()),

  // Dashboard
  getDashboardStats: () => 
    fetch(`${API_URL}/dashboard/stats`).then(r => r.json()),
};

// Usage exemple
async function example() {
  // Login
  const { user, session } = await api.login('user@example.com', 'password123');
  console.log('Connecté:', user.email, 'Rôle:', user.role);

  // Liste des produits
  const { products } = await api.getProducts();
  console.log('Produits:', products.length);

  // Sortie de stock (vente)
  const result = await api.createMovement(
    products[0].id,
    'exit',
    5,
    'Vente client #1234'
  );
  console.log('Mouvement créé:', result);

  // Stats dashboard
  const stats = await api.getDashboardStats();
  console.log('Valeur stock:', stats.stats.totalValue, 'Ar');
}
```

---

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Liste produits
curl http://localhost:3000/api/products

# Créer un produit
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"sku":"TEST-001","name":"Produit Test","unit_price":100}'

# Créer un mouvement (sortie de stock)
curl -X POST http://localhost:3000/api/movements \
  -H "Content-Type: application/json" \
  -d '{
    "product_id":"votre-uuid-produit",
    "type":"exit",
    "quantity":10,
    "notes":"Vente client"
  }'

# Dashboard stats
curl http://localhost:3000/api/dashboard/stats
```

---

## Notes importantes

1. **Service Role Key** : L'API utilise la clé service role côté serveur pour bypass RLS. Ne l'exposez jamais côté client.

2. **Mouvements de stock** : Lors de la création d'un mouvement (`POST /api/movements`), la quantité du produit est automatiquement mise à jour :
   - `entry` : ajoute la quantité
   - `exit` : retire la quantité

3. **Status produit** : Le status (`in_stock`, `low`, `out_of_stock`) est calculé automatiquement par rapport à `reorder_level`.

4. **Rôles utilisateur** : 
   - `admin` : accès complet
   - `magasinier` : accès limité (pas de gestion fournisseurs)

5. **Dates** : Toutes les dates sont au format ISO 8601 (ex: `2024-01-15T10:00:00Z`)

6. **UUIDs** : Tous les IDs sont des UUID v4 (ex: `550e8400-e29b-41d4-a716-446655440001`)

---

## Fichiers source de l'API

```
app/api/
├── auth/
│   ├── login/route.ts
│   └── register/route.ts
├── products/
│   ├── route.ts
│   └── [id]/route.ts
├── categories/
│   ├── route.ts
│   └── [id]/route.ts
├── suppliers/
│   └── route.ts
├── movements/
│   └── route.ts
└── dashboard/
    └── stats/route.ts
```

---

## Support et dépannage

### Erreur 500 "Internal server error"
→ Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est bien configurée dans `.env.local`

### Erreur 400 sur POST
→ Vérifiez que tous les champs requis sont présents dans le body JSON

### Données non mises à jour
→ Vérifiez que les migrations SQL sont appliquées (RLS policies)

---

**Version** : 1.0  
**Dernière mise à jour** : 2024-01-15
