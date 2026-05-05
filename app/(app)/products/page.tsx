'use client';

import { useEffect, useState, useCallback } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Upload, Pencil, Trash2, X, FileSpreadsheet, Loader2, Tag, ImagePlus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrentUser } from '@/lib/auth/useCurrentUser';
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
import { Skeleton } from '@/components/ui/skeleton';
import * as XLSX from 'xlsx';

const SIZES = ['S', 'M', 'XL', 'XXL'];
const CATEGORIES = ['Hommes', 'Femmes', 'Enfants'];

export default function ProductsPage() {
  return <ProductsContent />;
}

function ProductsContent() {
  const { isAdmin } = useCurrentUser();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [imagesModalOpen, setImagesModalOpen] = useState(false);
  const [selectedProductForImages, setSelectedProductForImages] = useState<any>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    sku: '',
    name: '',
    description: '',
    category_id: '',
    supplier_id: '',
    location: '',
    unit_price: '',
    color: '',
    material: '',
    size: '',
    quantity: 0,
    reorder_level: 5,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productsData } = await supabase
          .from('products')
          .select(`
            *,
            categories:category_id(name),
            product_sizes(size, quantity, reorder_level),
            suppliers:supplier_id(name),
            product_images(id, image_url, is_primary)
          `)
          .order('name');

        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*');

        const { data: suppliersData } = await supabase
          .from('suppliers')
          .select('*');

        if (productsData) setProducts(productsData);
        if (categoriesData) setCategories(categoriesData);
        if (suppliersData) setSuppliers(suppliersData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'low':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'En stock';
      case 'low':
        return 'Faible';
      case 'out_of_stock':
        return 'Rupture';
      default:
        return status;
    }
  };

  const getTotalQuantity = (product: any) => {
    return product.product_sizes?.reduce((sum: number, ps: any) => sum + (ps.quantity || 0), 0) || 0;
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = products.flatMap((p) => {
      const sizes = p.product_sizes || [];
      if (sizes.length === 0) {
        return [{
          SKU: p.sku,
          Nom: p.name,
          Catégorie: p.categories?.name || '',
          Couleur: p.color || '',
          Matière: p.material || '',
          'Prix unitaire': p.unit_price,
          Statut: getStatusLabel(p.status),
        }];
      }
      return sizes.map((size: any) => ({
        SKU: p.sku,
        Nom: p.name,
        Taille: size.size,
        Quantité: size.quantity,
        'Seuil alerte': size.reorder_level,
        Catégorie: p.categories?.name || '',
        Couleur: p.color || '',
        Matière: p.material || '',
        'Prix unitaire': p.unit_price,
        Statut: getStatusLabel(p.status),
      }));
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vêtements');
    
    const colWidths = [
      { wch: 15 }, { wch: 30 }, { wch: 10 }, { wch: 10 },
      { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
      { wch: 12 }, { wch: 12 },
    ];
    ws['!cols'] = colWidths;

    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `vetements_${date}.xlsx`);
    toast.success('Export Excel réussi !');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast.error('Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV');
      return;
    }

    setImportFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setImportPreview(jsonData.slice(0, 5));
        toast.success(`${jsonData.length} lignes trouvées dans le fichier`);
      } catch (err) {
        toast.error('Erreur lors de la lecture du fichier');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleAddAdditionalImage = async () => {
    if (!selectedProductForImages || !newImageFile) return;
    
    if (selectedProductForImages.product_images?.length >= 3) {
      toast.error('Maximum 3 images par produit');
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = newImageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(`public/${fileName}`, newImageFile);
      
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(`public/${fileName}`);
      const image_url = publicUrlData.publicUrl;

      const isPrimary = !selectedProductForImages.product_images || selectedProductForImages.product_images.length === 0;

      await supabase.from('product_images').insert({
        product_id: selectedProductForImages.id,
        image_url: image_url,
        qr_code_data: `${selectedProductForImages.sku}-${Date.now()}`,
        is_primary: isPrimary
      });

      toast.success('Image ajoutée');
      setNewImageFile(null);
      
      // Refresh data
      const { data: productsData } = await supabase
        .from('products')
        .select('*, categories:category_id(name), product_sizes(size, quantity, reorder_level), suppliers:supplier_id(name), product_images(id, image_url, is_primary)')
        .order('name');
      if (productsData) {
        setProducts(productsData);
        const updatedProduct = productsData.find(p => p.id === selectedProductForImages.id);
        if (updatedProduct) setSelectedProductForImages(updatedProduct);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de l\'ajout de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      await supabase.from('product_images').delete().eq('id', imageId);
      toast.success('Image supprimée');
      // Refresh data
      const { data: productsData } = await supabase
        .from('products')
        .select('*, categories:category_id(name), product_sizes(size, quantity, reorder_level), suppliers:supplier_id(name), product_images(id, image_url, is_primary)')
        .order('name');
      if (productsData) {
        setProducts(productsData);
        const updatedProduct = productsData.find(p => p.id === selectedProductForImages.id);
        if (updatedProduct) setSelectedProductForImages(updatedProduct);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAddProduct = async () => {
    if (!form.sku || !form.name || !form.category_id || !form.unit_price || !form.size) {
      toast.error('Veuillez remplir les champs obligatoires (incluant la taille)');
      return;
    }

    setSaving(true);
    try {
      let image_url = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(`public/${fileName}`, imageFile);
        
        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(`public/${fileName}`);
          image_url = publicUrlData.publicUrl;
        }
      }

      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          sku: form.sku,
          name: form.name,
          description: form.description,
          category_id: form.category_id,
          supplier_id: form.supplier_id || null,
          location: form.location,
          unit_price: parseFloat(form.unit_price),
          color: form.color,
          material: form.material,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Add image if exists
      if (image_url) {
        await supabase.from('product_images').insert({
          product_id: productData.id,
          image_url: image_url,
          qr_code_data: `${productData.sku}-${Date.now()}`,
          is_primary: true
        });
      }

      // Add size
      const sizesData = [{
        product_id: productData.id,
        size: form.size,
        quantity: parseInt(form.quantity.toString()) || 0,
        reorder_level: parseInt(form.reorder_level.toString()) || 5,
      }];

      const { data: insertedSizes, error: sizesError } = await supabase
        .from('product_sizes')
        .insert(sizesData)
        .select();

      if (sizesError) throw sizesError;

      // Log initial stock movement if quantity > 0
      if (insertedSizes && insertedSizes.length > 0 && form.quantity > 0) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        await supabase.from('stock_movements').insert({
          product_id: productData.id,
          product_size_id: insertedSizes[0].id,
          size: form.size,
          type: 'entry',
          quantity: parseInt(form.quantity.toString()),
          notes: 'Stock initial',
          user_id: currentUser?.id || null,
        });
      }

      toast.success('Produit ajouté avec succès');
      setForm({
        sku: '',
        name: '',
        description: '',
        category_id: '',
        supplier_id: '',
        location: '',
        unit_price: '',
        color: '',
        material: '',
        size: '',
        quantity: 0,
        reorder_level: 5,
      });
      setImageFile(null);
      setDialogOpen(false);

      // Refresh
      const { data: productsData } = await supabase
        .from('products')
        .select('*, categories:category_id(name), product_sizes(size, quantity, reorder_level), suppliers:supplier_id(name), product_images(id, image_url, is_primary)')
        .order('name');
      if (productsData) setProducts(productsData);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Erreur lors de l\'ajout du produit');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    if (!editingProduct.sku || !editingProduct.name || !editingProduct.category_id || !editingProduct.unit_price) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    setEditSaving(true);
    try {
      const { error: productError } = await supabase
        .from('products')
        .update({
          sku: editingProduct.sku,
          name: editingProduct.name,
          description: editingProduct.description,
          category_id: editingProduct.category_id,
          supplier_id: editingProduct.supplier_id || null,
          location: editingProduct.location,
          unit_price: parseFloat(editingProduct.unit_price),
          color: editingProduct.color,
          material: editingProduct.material,
        })
        .eq('id', editingProduct.id);

      if (productError) throw productError;

      toast.success('Produit modifié avec succès');
      setEditDialogOpen(false);

      // Refresh
      const { data: productsData } = await supabase
        .from('products')
        .select('*, categories:category_id(name), product_sizes(size, quantity, reorder_level), suppliers:supplier_id(name), product_images(id, image_url, is_primary)')
        .order('name');
      if (productsData) setProducts(productsData);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Erreur lors de la modification du produit');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deletingProduct.id);

      if (error) throw error;

      toast.success('Produit supprimé');
      setDeleteDialogOpen(false);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    } catch (err) {
      console.error('Error:', err);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vêtements</h1>
          <p className="text-muted-foreground mt-1">Gérez votre catalogue de vêtements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>

          {/* Add Product Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau produit</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image" className="text-sm font-medium">Image du produit</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setImageFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => document.getElementById('product-image-input')?.click()}
                  >
                    {imageFile ? (
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <ImagePlus className="h-5 w-5 text-green-500" />
                        <span>{imageFile.name}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImageFile(null); }}
                          className="ml-2 text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Glissez-déposez une image ici ou cliquez pour parcourir</p>
                      </>
                    )}
                    <Input
                      id="product-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-medium">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="Ex: VET-001"
                    className="focus-visible:ring-2"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nom du produit *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: T-Shirt Cotton"
                    className="focus-visible:ring-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Description détaillée du produit..."
                    className="resize-none focus-visible:ring-2"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Catégorie *</Label>
                  <Select
                    value={form.category_id}
                    onValueChange={(v) => setForm({ ...form, category_id: v })}
                  >
                    <SelectTrigger id="category" className="focus-visible:ring-2">
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">Prix unitaire (Ar) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="focus-visible:ring-2"
                    value={form.unit_price}
                    onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-sm font-medium">Couleur</Label>
                  <Input
                    id="color"
                    placeholder="Ex: Bleu"
                    className="focus-visible:ring-2"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material" className="text-sm font-medium">Matière</Label>
                  <Input
                    id="material"
                    placeholder="Ex: 100% Coton"
                    className="focus-visible:ring-2"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                  />
                </div>
                {/* Size and Quantity */}
                <div className="md:col-span-2 space-y-4 border-t pt-4 mt-2">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Stock et Limites</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="size" className="text-sm font-medium">Taille *</Label>
                      <Select
                        value={form.size}
                        onValueChange={(v) => setForm({ ...form, size: v })}
                      >
                        <SelectTrigger id="size" className="focus-visible:ring-2">
                          <SelectValue placeholder="Taille" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-medium">Quantité actuelle *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        placeholder="Ex: 50"
                        className="focus-visible:ring-2"
                        value={form.quantity || ''}
                        onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reorder_level" className="text-sm font-medium">Seuil d'alerte (Min) *</Label>
                      <Input
                        id="reorder_level"
                        type="number"
                        min="0"
                        placeholder="Ex: 5"
                        className="focus-visible:ring-2"
                        value={form.reorder_level || ''}
                        onChange={(e) => setForm({ ...form, reorder_level: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddProduct} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Rechercher par nom ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="in_stock">En stock</SelectItem>
            <SelectItem value="low">Faible</SelectItem>
            <SelectItem value="out_of_stock">Rupture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Catalogue ({filteredProducts.length})</CardTitle>
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
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Couleur</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        Aucun produit trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div 
                            className="w-10 h-10 rounded overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity border flex-shrink-0"
                            onClick={() => {
                              setSelectedProductForImages(product);
                              setImagesModalOpen(true);
                            }}
                          >
                            {product.product_images && product.product_images.length > 0 ? (
                              <img 
                                src={product.product_images[0].image_url} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[10px] text-muted-foreground">Vide</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.material}</p>
                          </div>
                        </TableCell>
                        <TableCell>{product.categories?.name}</TableCell>
                        <TableCell>
                          {product.color ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded border"
                                style={{
                                  backgroundColor: product.color.toLowerCase().includes('noir') ? '#000' :
                                                  product.color.toLowerCase().includes('blanc') ? '#fff' :
                                                  product.color.toLowerCase().includes('bleu') ? '#3b82f6' :
                                                  product.color.toLowerCase().includes('rouge') ? '#ef4444' :
                                                  product.color.toLowerCase().includes('vert') ? '#22c55e' :
                                                  '#ccc',
                                  border: product.color.toLowerCase().includes('blanc') ? '1px solid #ccc' : 'none',
                                }}
                              />
                              {product.color}
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getTotalQuantity(product)} unités
                          </Badge>
                        </TableCell>
                        <TableCell>{product.unit_price} Ar</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(product.status)}>
                            {getStatusLabel(product.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {isAdmin && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setDeletingProduct(product);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations du produit ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sku" className="text-sm font-medium">SKU *</Label>
                <Input
                  id="edit-sku"
                  className="focus-visible:ring-2"
                  value={editingProduct.sku || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm font-medium">Nom du produit *</Label>
                <Input
                  id="edit-name"
                  className="focus-visible:ring-2"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="edit-description"
                  className="resize-none focus-visible:ring-2"
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category" className="text-sm font-medium">Catégorie *</Label>
                <Select
                  value={editingProduct.category_id || ''}
                  onValueChange={(v) => setEditingProduct({ ...editingProduct, category_id: v })}
                >
                  <SelectTrigger id="edit-category" className="focus-visible:ring-2">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="text-sm font-medium">Prix unitaire (Ar) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  className="focus-visible:ring-2"
                  value={editingProduct.unit_price || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, unit_price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color" className="text-sm font-medium">Couleur</Label>
                <Input
                  id="edit-color"
                  className="focus-visible:ring-2"
                  value={editingProduct.color || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-material" className="text-sm font-medium">Matière</Label>
                <Input
                  id="edit-material"
                  className="focus-visible:ring-2"
                  value={editingProduct.material || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateProduct} disabled={editSaving}>
              {editSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Images Modal */}
      <Dialog open={imagesModalOpen} onOpenChange={setImagesModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Images du produit : {selectedProductForImages?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Existing Images */}
            <div className="grid grid-cols-3 gap-4">
              {selectedProductForImages?.product_images?.map((img: any) => (
                <div key={img.id} className="relative group rounded-md overflow-hidden border aspect-square">
                  <img src={img.image_url} alt="Product" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleRemoveImage(img.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {img.is_primary && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">Principal</Badge>
                    </div>
                  )}
                </div>
              ))}
              {(!selectedProductForImages?.product_images || selectedProductForImages?.product_images.length === 0) && (
                <div className="col-span-3 text-center py-8 text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                  Aucune image pour ce produit
                </div>
              )}
            </div>

            {/* Add New Image */}
            {isAdmin && selectedProductForImages?.product_images?.length < 3 && (
              <div className="space-y-4 border-t pt-4">
                <Label>Ajouter une nouvelle image ({selectedProductForImages.product_images.length}/3)</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setNewImageFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => document.getElementById('additional-image-input')?.click()}
                >
                  {newImageFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <ImagePlus className="h-5 w-5 text-green-500" />
                      <span>{newImageFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setNewImageFile(null); }}
                        className="ml-2 text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Glissez-déposez une image ici ou cliquez pour parcourir</p>
                    </>
                  )}
                  <Input
                    id="additional-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewImageFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleAddAdditionalImage}
                  disabled={!newImageFile || uploadingImage}
                  className="w-full"
                >
                  {uploadingImage ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Ajouter
                </Button>
              </div>
            )}
            {selectedProductForImages?.product_images?.length >= 3 && (
              <div className="text-sm text-center text-muted-foreground border-t pt-4">
                La limite de 3 images par produit est atteinte.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
