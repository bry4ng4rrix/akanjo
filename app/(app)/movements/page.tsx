'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Plus, Search, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function MovementsPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [movementType, setMovementType] = useState<'entry' | 'exit'>('entry');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductData, setSelectedProductData] = useState<any>(null);
  const supabase = createClient();

  // Filter products based on search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update selected product data when product changes
  useEffect(() => {
    const product = products.find((p) => p.id === selectedProduct);
    setSelectedProductData(product || null);
  }, [selectedProduct, products]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: movementsData } = await supabase
          .from('stock_movements')
          .select(`
            *,
            products:product_id(name, sku),
            users:user_id(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        const { data: productsData } = await supabase
          .from('products')
          .select('id, name, sku, quantity');

        if (movementsData) setMovements(movementsData);
        if (productsData) setProducts(productsData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const movementStats = useMemo(() => {
    const statsMap: Record<string, { name: string, outQty: number }> = {};
    movements.forEach(m => {
      if (!m.products?.name || m.type !== 'exit') return;
      if (!statsMap[m.products.name]) {
        statsMap[m.products.name] = { name: m.products.name, outQty: 0 };
      }
      statsMap[m.products.name].outQty += m.quantity;
    });
    
    // Add products with 0 exits
    products.forEach(p => {
      if (!statsMap[p.name]) {
        statsMap[p.name] = { name: p.name, outQty: 0 };
      }
    });

    const sorted = Object.values(statsMap).sort((a, b) => b.outQty - a.outQty);
    return {
      fastest: sorted.slice(0, 5),
      slowest: sorted.filter(s => s.outQty === 0 || s.outQty < 5).reverse().slice(0, 5)
    };
  }, [movements, products]);

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !quantity) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error('La quantité doit être un nombre positif');
      return;
    }

    try {
      // Get current product data
      const { data: productData } = await supabase
        .from('products')
        .select('quantity, name')
        .eq('id', selectedProduct)
        .single();

      if (!productData) {
        toast.error('Produit non trouvé');
        return;
      }

      const currentStock = productData.quantity || 0;

      // Check stock for exit movements
      if (movementType === 'exit') {
        if (qty > currentStock) {
          toast.error(`Stock épuisé ! Stock disponible: ${currentStock}, Quantité demandée: ${qty}`);
          return;
        }

        // Update product quantity (reduce)
        const newQuantity = currentStock - qty;
        const { error: updateError } = await supabase
          .from('products')
          .update({ quantity: newQuantity })
          .eq('id', selectedProduct);

        if (updateError) {
          toast.error('Erreur lors de la mise à jour du stock');
          return;
        }
      } else {
        // Entry movement - increase stock
        const newQuantity = currentStock + qty;
        const { error: updateError } = await supabase
          .from('products')
          .update({ quantity: newQuantity })
          .eq('id', selectedProduct);

        if (updateError) {
          toast.error('Erreur lors de la mise à jour du stock');
          return;
        }
      }

      // Add movement record
      const { error } = await supabase
        .from('stock_movements')
        .insert([
          {
            product_id: selectedProduct,
            type: movementType,
            quantity: qty,
            notes: notes || null,
          },
        ]);

      if (error) {
        toast.error('Erreur lors de l\'ajout du mouvement');
        return;
      }

      toast.success(
        movementType === 'exit'
          ? `Sortie de ${qty} unités enregistrée. Stock restant: ${productData.quantity - qty}`
          : `Entrée de ${qty} unités enregistrée. Nouveau stock: ${productData.quantity + qty}`
      );
      
      setOpenDialog(false);
      setSelectedProduct('');
      setQuantity('');
      setNotes('');
      setMovementType('entry');
      setSearchTerm('');
      setSelectedProductData(null);

      // Refresh movements and products
      const { data: movementsData } = await supabase
        .from('stock_movements')
        .select(`
          *,
          products:product_id(name, sku),
          users:user_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, sku, quantity');

      if (movementsData) setMovements(movementsData);
      if (productsData) setProducts(productsData);
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mouvements de stock</h1>
          <p className="text-muted-foreground mt-1">Traçabilité complète des entrées et sorties</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un mouvement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un mouvement de stock</DialogTitle>
              <DialogDescription>
                Enregistrez une entrée ou une sortie de stock
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMovement} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de mouvement</Label>
                  <Select value={movementType} onValueChange={(v: any) => setMovementType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entrée</SelectItem>
                      <SelectItem value="exit">Sortie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantité</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Produit</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {filteredProducts.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground text-center">
                      Aucun produit trouvé
                    </p>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`p-3 cursor-pointer hover:bg-muted transition-colors border-b last:border-b-0 ${
                          selectedProduct === product.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => setSelectedProduct(product.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.sku}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={product.quantity > 10 ? 'default' : product.quantity > 0 ? 'secondary' : 'destructive'}>
                              <Package className="h-3 w-3 mr-1" />
                              {product.quantity}
                            </Badge>
                            {selectedProduct === product.id && (
                              <span className="text-xs text-blue-600 font-medium">Sélectionné</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {selectedProductData && (
                  <div className={`p-2 rounded-md text-sm ${
                    movementType === 'exit' && selectedProductData.quantity <= 0
                      ? 'bg-red-50 text-red-700'
                      : movementType === 'exit' && selectedProductData.quantity < 10
                      ? 'bg-orange-50 text-orange-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    <p className="font-medium">
                      Stock disponible: {selectedProductData.quantity} unités
                    </p>
                    {movementType === 'exit' && selectedProductData.quantity <= 0 && (
                      <p className="text-xs mt-1">⚠️ Stock épuisé - Impossible de faire une sortie</p>
                    )}
                    {movementType === 'exit' && selectedProductData.quantity > 0 && selectedProductData.quantity < 10 && (
                      <p className="text-xs mt-1">⚠️ Stock faible</p>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes sur ce mouvement (optionnel)"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                Enregistrer le mouvement
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-green-600">
              <ArrowUp className="mr-2 h-5 w-5" />
              Plus rapides (Top Sorties)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {movementStats.fastest.length === 0 ? (
                <p className="text-sm text-muted-foreground">Pas assez de données.</p>
              ) : (
                movementStats.fastest.map((p, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-sm">{p.name}</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">{p.outQty} sorties</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-orange-600">
              <ArrowDown className="mr-2 h-5 w-5" />
              Plus lents (Peu de sorties)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {movementStats.slowest.length === 0 ? (
                <p className="text-sm text-muted-foreground">Pas assez de données.</p>
              ) : (
                movementStats.slowest.map((p, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-sm">{p.name}</span>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">{p.outQty} sorties</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des mouvements</CardTitle>
          <CardDescription>
            {movements.length} mouvements enregistrés
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Aucun mouvement enregistré
                      </TableCell>
                    </TableRow>
                  ) : (
                    movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="text-sm">
                          {formatDate(movement.created_at)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {movement.products?.name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {movement.products?.sku}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {movement.quantity}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={movement.type === 'entry' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                          >
                            {movement.type === 'entry' ? (
                              <>
                                <ArrowUp className="h-3 w-3 mr-1" />
                                Entrée
                              </>
                            ) : (
                              <>
                                <ArrowDown className="h-3 w-3 mr-1" />
                                Sortie
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {movement.users?.full_name || 'Système'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {movement.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
