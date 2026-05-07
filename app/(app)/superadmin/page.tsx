'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SuperAdminGuard } from '@/components/auth/superadmin-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Shield, Store, Package, Users, TrendingUp, DollarSign,
  AlertTriangle, Plus, Edit, Trash2, Check, X, Loader2,
  Building2, ShoppingBag
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-MG', { minimumFractionDigits: 0 }).format(Math.round(n));

export default function SuperAdminPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  // Global Statistics
  const [globalStats, setGlobalStats] = useState({
    totalStores: 0,
    totalAdmins: 0,
    totalProducts: 0,
    totalQuantity: 0,
    totalValue: 0,
    totalEmployees: 0,
  });

  // Store Statistics
  const [storeStats, setStoreStats] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('all');

  // Admins Management
  const [admins, setAdmins] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    full_name: '',
    email: '',
    password: '',
    store_name: '',
  });

  // Edit role dialog
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newRoleValue, setNewRoleValue] = useState('');

  const fetchGlobalStats = async () => {
    try {
      // Fetch all stores
      const { data: stores } = await supabase.from('stores').select('*');
      
      // Fetch all admins
      const { data: adminsData } = await supabase
        .from('users')
        .select('*')
        .in('role', ['admin', 'superadmin']);

      // Fetch all products
      const { data: products } = await supabase.from('products').select('*');

      // Fetch all employees
      const { data: employees } = await supabase
        .from('users')
        .select('*')
        .in('role', ['employer', 'magasinier'])
        .eq('status', 'approved');

      let totalQuantity = 0;
      let totalValue = 0;

      products?.forEach((p) => {
        const qty = p.quantity ?? 0;
        totalQuantity += qty;
        totalValue += qty * (p.unit_price ?? 0);
      });

      setGlobalStats({
        totalStores: stores?.length ?? 0,
        totalAdmins: adminsData?.length ?? 0,
        totalProducts: products?.length ?? 0,
        totalQuantity,
        totalValue,
        totalEmployees: employees?.length ?? 0,
      });

      // Calculate per-store statistics
      const storeData = await Promise.all(
        (stores || []).map(async (store: any) => {
          const { data: storeProducts } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id);

          const { data: storeEmployees } = await supabase
            .from('users')
            .select('*')
            .eq('store_id', store.id)
            .in('role', ['employer', 'magasinier'])
            .eq('status', 'approved');

          let storeQty = 0;
          let storeValue = 0;

          storeProducts?.forEach((p) => {
            const qty = p.quantity ?? 0;
            storeQty += qty;
            storeValue += qty * (p.unit_price ?? 0);
          });

          return {
            id: store.id,
            name: store.name,
            owner_id: store.owner_id,
            products: storeProducts?.length ?? 0,
            quantity: storeQty,
            value: storeValue,
            employees: storeEmployees?.length ?? 0,
          };
        })
      );

      setStoreStats(storeData);
    } catch (err) {
      console.error('Error fetching global stats:', err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*, stores(name)')
        .in('role', ['admin', 'superadmin'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchGlobalStats(), fetchAdmins()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdmin.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { createClient: createSbClient } = await import('@supabase/supabase-js');
      const secondarySupabase = createSbClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        }
      );

      const { error } = await secondarySupabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password,
        options: {
          data: {
            full_name: newAdmin.full_name,
            role: 'admin',
            store_name: newAdmin.store_name,
          },
        },
      });

      if (error) throw error;

      toast.success('Administrateur créé avec succès.');
      setIsCreateAdminOpen(false);
      setNewAdmin({ full_name: '', email: '', password: '', store_name: '' });
      await Promise.all([fetchGlobalStats(), fetchAdmins()]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Rôle mis à jour : ${newRole}`);
      setEditRoleDialogOpen(false);
      setEditingUser(null);
      setNewRoleValue('');
      await fetchAdmins();
    } catch (err: any) {
      toast.error('Erreur lors de la mise à jour du rôle: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;
      toast.success('Utilisateur supprimé.');
      await Promise.all([fetchGlobalStats(), fetchAdmins()]);
    } catch (err: any) {
      toast.error('Erreur de suppression: ' + err.message);
    }
  };

  const filteredAdmins = admins.filter((a) =>
    a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.stores?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStoreStats = selectedStore === 'all' 
    ? storeStats 
    : storeStats.filter(s => s.id === selectedStore);

  return (
    <SuperAdminGuard>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-600" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestion globale de tous les magasins et administrateurs
          </p>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="xl:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valeur totale</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">{fmt(globalStats.totalValue)} Ar</div>
                    <p className="text-xs text-muted-foreground mt-1">Tous magasins confondus</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Magasins</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{globalStats.totalStores}</div>}
              <p className="text-xs text-muted-foreground mt-1">Actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{globalStats.totalAdmins}</div>}
              <p className="text-xs text-muted-foreground mt-1">Gestionnaires</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{globalStats.totalProducts}</div>}
              <p className="text-xs text-muted-foreground mt-1">Références totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{globalStats.totalEmployees}</div>}
              <p className="text-xs text-muted-foreground mt-1">Personnel actif</p>
            </CardContent>
          </Card>
        </div>

        {/* Store Statistics */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Statistiques par magasin
                </CardTitle>
                <CardDescription>Vue d'ensemble de tous les magasins</CardDescription>
              </div>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="Filtrer par magasin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les magasins</SelectItem>
                  {storeStats.map((store) => (
                    <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Magasin</TableHead>
                      <TableHead>Produits</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Employés</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStoreStats.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun magasin trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStoreStats.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell className="font-medium">{store.name}</TableCell>
                          <TableCell>{store.products}</TableCell>
                          <TableCell>{fmt(store.quantity)}</TableCell>
                          <TableCell>{fmt(store.value)} Ar</TableCell>
                          <TableCell>{store.employees}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Management */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Gestion des administrateurs et utilisateurs
                </CardTitle>
                <CardDescription>Créez et gérez les administrateurs de magasin</CardDescription>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                <Dialog open={isCreateAdminOpen} onOpenChange={setIsCreateAdminOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvel admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Créer un administrateur</DialogTitle>
                      <DialogDescription>
                        Créez un nouvel administrateur avec son magasin
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateAdmin} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Nom complet</Label>
                        <Input
                          id="full_name"
                          value={newAdmin.full_name}
                          onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newAdmin.password}
                          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                          minLength={6}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store_name">Nom du magasin</Label>
                        <Input
                          id="store_name"
                          value={newAdmin.store_name}
                          onChange={(e) => setNewAdmin({ ...newAdmin, store_name: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création...
                          </>
                        ) : (
                          'Créer l\'administrateur'
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Administrateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Magasin</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Aucun administrateur trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAdmins.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell>
                            <div className="font-medium">{admin.full_name || 'Sans nom'}</div>
                            <div className="text-xs text-muted-foreground">{admin.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={admin.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                              {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                            </Badge>
                          </TableCell>
                          <TableCell>{admin.stores?.name || '-'}</TableCell>
                          <TableCell>
                            <Badge className={
                              admin.status === 'approved' ? 'bg-green-100 text-green-800' :
                              admin.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {admin.status === 'approved' ? 'Approuvé' :
                               admin.status === 'pending' ? 'En attente' : 'Rejeté'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            {admin.created_at ? format(new Date(admin.created_at), 'dd MMM yyyy', { locale: fr }) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {admin.role !== 'superadmin' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingUser(admin);
                                      setNewRoleValue(admin.role);
                                      setEditRoleDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(admin.id)}
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

        {/* Edit Role Dialog */}
        <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le rôle</DialogTitle>
              <DialogDescription>
                Changer le rôle de {editingUser?.full_name || editingUser?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nouveau rôle</Label>
                <Select value={newRoleValue} onValueChange={setNewRoleValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="magasinier">Magasinier</SelectItem>
                    <SelectItem value="employer">Employé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditRoleDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    if (editingUser && newRoleValue) {
                      handleUpdateRole(editingUser.id, newRoleValue);
                    }
                  }}
                  disabled={!newRoleValue || newRoleValue === editingUser?.role}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminGuard>
  );
}
