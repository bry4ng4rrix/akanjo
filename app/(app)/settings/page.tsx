'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Lock, Users, Bell, Check, X, UserPlus, Clock, Building2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [addEmployerDialog, setAddEmployerDialog] = useState(false);
  const [newEmployer, setNewEmployer] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const [storeName, setStoreName] = useState('');
  const [storeId, setStoreId] = useState<string | null>(null);
  const [savingStore, setSavingStore] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          setUser(authUser);
          setFullName(authUser.user_metadata?.full_name || '');

          // Fetch user profile from users table
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

          setUserRole(userProfile?.role || '');

          // Fetch store info for admin/magasinier
          if (userProfile?.store_id) {
            const { data: storeData } = await supabase
              .from('stores')
              .select('id, name')
              .eq('id', userProfile.store_id)
              .single();
            if (storeData) {
              setStoreName(storeData.name || '');
              setStoreId(storeData.id);
            }
          }

          // Fetch all users if admin or magasinier (manager)
          if (userProfile?.role === 'admin' || userProfile?.role === 'magasinier') {
            const { data: allUsers } = await supabase
              .from('users')
              .select('*')
              .order('full_name');

            if (allUsers) {
              setUsers(allUsers);
              // Filter pending employers
              const pending = allUsers.filter(u => u.role === 'employer' && u.status === 'pending');
              setPendingUsers(pending);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (authError) {
        toast.error('Erreur lors de la mise à jour');
        return;
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (profileError) {
        toast.error('Erreur lors de la mise à jour du profil');
        return;
      }

      toast.success('Profil mis à jour avec succès');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error('Erreur lors du changement de mot de passe');
        return;
      }

      toast.success('Mot de passe changé avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Erreur lors du changement de mot de passe');
    }
  };

  const handleApproveUser = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase.rpc('approve_employer', {
        p_user_id: userId,
        p_status: status,
      });

      if (error) {
        toast.error('Erreur lors de l\'approbation');
        return;
      }

      toast.success(status === 'approved' ? 'Employé approuvé' : 'Demande rejetée');
      
      // Refresh users list
      const { data: allUsers } = await supabase
        .from('users')
        .select('*')
        .order('full_name');

      if (allUsers) {
        setUsers(allUsers);
        const pending = allUsers.filter(u => u.role === 'employer' && u.status === 'pending');
        setPendingUsers(pending);
      }
    } catch (err) {
      toast.error('Erreur lors de l\'opération');
    }
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;

    setSavingStore(true);
    try {
      const { error } = await supabase
        .from('stores')
        .update({ name: storeName })
        .eq('id', storeId);

      if (error) {
        toast.error('Erreur lors de la mise à jour du magasin');
        return;
      }

      toast.success('Nom du magasin mis à jour');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSavingStore(false);
    }
  };

  const handleAddEmployer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newEmployer.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('add_employer_by_manager', {
        p_email: newEmployer.email,
        p_password: newEmployer.password,
        p_full_name: newEmployer.full_name,
        p_manager_id: user.id,
      });

      if (error) {
        toast.error('Erreur lors de la création: ' + error.message);
        return;
      }

      toast.success('Employé ajouté avec succès');
      setAddEmployerDialog(false);
      setNewEmployer({ email: '', password: '', full_name: '' });

      // Refresh users list
      const { data: allUsers } = await supabase
        .from('users')
        .select('*')
        .order('full_name');

      if (allUsers) {
        setUsers(allUsers);
        const pending = allUsers.filter(u => u.role === 'employer' && u.status === 'pending');
        setPendingUsers(pending);
      }
    } catch (err: any) {
      toast.error('Erreur: ' + err.message);
    }
  };

  const getRoleBadgeColor = (role: string, status?: string) => {
    if (role === 'admin') return 'bg-red-100 text-red-800 border-red-200';
    if (role === 'magasinier') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (role === 'employer') {
      if (status === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      if (status === 'rejected') return 'bg-gray-100 text-gray-800 border-gray-200';
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string, status?: string) => {
    if (role === 'admin') return 'Administrateur';
    if (role === 'magasinier') return 'Manager';
    if (role === 'employer') {
      if (status === 'pending') return 'Employé (En attente)';
      if (status === 'rejected') return 'Employé (Rejeté)';
      return 'Employé';
    }
    return role;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Gérez vos paramètres et préférences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Mon profil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Mon profil</CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Votre adresse email ne peut pas être modifiée
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                <Button type="submit">
                  Enregistrer les modifications
                </Button>
              </form>
            </CardContent>
          </Card>

          {storeId && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Magasin</CardTitle>
                <CardDescription>
                  Modifier le nom de votre magasin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateStore} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nom du magasin</Label>
                    <Input
                      id="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Nom du magasin"
                    />
                  </div>
                  <Button type="submit" disabled={savingStore}>
                    {savingStore ? 'Enregistrement...' : 'Mettre à jour le magasin'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>
                Gérez votre mot de passe et vos paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground">
                    Note: Supabase Auth gère directement le changement de mot de passe
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit">
                  Changer le mot de passe
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  {userRole === 'admin' ? 'Accès administrateur complet' : 'Gestion des employés'}
                </CardDescription>
              </div>
              {(userRole === 'admin' || userRole === 'magasinier') && (
                <Button onClick={() => setAddEmployerDialog(true)} size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un employé
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Vous n&apos;avez pas accès à la gestion des utilisateurs
                </p>
              ) : (
                <div className="space-y-6">
                  {/* Pending Approvals Section */}
                  {pendingUsers.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-yellow-600">
                        <Clock className="h-4 w-4" />
                        Demandes en attente ({pendingUsers.length})
                      </h3>
                      <div className="space-y-2">
                        {pendingUsers.map((u) => (
                          <Card key={u.id} className="p-4 border-yellow-200 bg-yellow-50/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{u.full_name}</p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                                {u.referred_by_email && (
                                  <p className="text-xs text-muted-foreground">
                                    Référé par: {u.referred_by_email}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getRoleBadgeColor(u.role, u.status)}>
                                  {getRoleLabel(u.role, u.status)}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-500 text-green-600 hover:bg-green-50"
                                  onClick={() => handleApproveUser(u.id, 'approved')}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-600 hover:bg-red-50"
                                  onClick={() => handleApproveUser(u.id, 'rejected')}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Rejeter
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Users Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Tous les utilisateurs</h3>
                    <div className="space-y-2">
                      {users.map((u) => (
                        <Card key={u.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                u.role === 'admin' ? 'bg-red-100' : 
                                u.role === 'magasinier' ? 'bg-blue-100' : 'bg-green-100'
                              }`}>
                                {u.role === 'admin' ? <Building2 className="h-5 w-5 text-red-600" /> :
                                 u.role === 'magasinier' ? <Building2 className="h-5 w-5 text-blue-600" /> :
                                 <Users className="h-5 w-5 text-green-600" />}
                              </div>
                              <div>
                                <p className="font-medium">{u.full_name}</p>
                                <p className="text-sm text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                            <Badge className={getRoleBadgeColor(u.role, u.status)}>
                              {getRoleLabel(u.role, u.status)}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Gérez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Les paramètres de notification seront disponibles très bientôt.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Employer Dialog */}
      <Dialog open={addEmployerDialog} onOpenChange={setAddEmployerDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un employé</DialogTitle>
            <DialogDescription>
              Créer un compte employé approuvé directement
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEmployer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emp-email">Email</Label>
              <Input
                id="emp-email"
                type="email"
                value={newEmployer.email}
                onChange={(e) => setNewEmployer({ ...newEmployer, email: e.target.value })}
                placeholder="employe@entreprise.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-name">Nom complet</Label>
              <Input
                id="emp-name"
                value={newEmployer.full_name}
                onChange={(e) => setNewEmployer({ ...newEmployer, full_name: e.target.value })}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-password">Mot de passe</Label>
              <Input
                id="emp-password"
                type="password"
                value={newEmployer.password}
                onChange={(e) => setNewEmployer({ ...newEmployer, password: e.target.value })}
                placeholder="••••••••"
                minLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">Minimum 6 caractères</p>
            </div>
            <Button type="submit" className="w-full">
              Créer l&apos;employé
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
