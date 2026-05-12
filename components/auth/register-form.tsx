'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Building2, Users, Shield, ImagePlus, Upload, X } from 'lucide-react';

const ERRORS: Record<string, string> = {
  'User already registered':       'Un compte existe déjà avec cet email.',
  'Password should be at least':   'Le mot de passe doit contenir au moins 6 caractères.',
  'Unable to validate email':      'Adresse email invalide.',
  'Too many requests':             'Trop de tentatives. Attendez quelques minutes.',
};

function friendlyError(msg: string) {
  for (const [key, val] of Object.entries(ERRORS)) {
    if (msg.includes(key)) return val;
  }
  return msg;
}

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [role, setRole] = useState<'superadmin' | 'admin' | 'magasinier' | 'employer'>('admin');
  const [referredByEmail, setReferredByEmail] = useState('');
  const [superAdminEmail, setSuperAdminEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [storeLogo, setStoreLogo] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);

    let logoUrl = null;
    if ((role === 'admin' || role === 'superadmin') && storeLogo) {
      setUploadingLogo(true);
      const fileExt = storeLogo.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(`logos/${fileName}`, storeLogo);

      if (!uploadError) {
        logoUrl = supabase.storage.from('products').getPublicUrl(`logos/${fileName}`).data.publicUrl;
      }
      setUploadingLogo(false);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          status: role === 'superadmin' ? 'approved' : 'pending',
          store_name: role === 'admin' ? storeName : null,
          company_name: role === 'superadmin' ? companyName : null,
          superadmin_email: role === 'admin' ? superAdminEmail : null,
          referred_by_email: (role === 'magasinier' || role === 'employer') ? referredByEmail : null,
          store_logo: logoUrl,
        },
      },
    });

    if (error) {
      toast.error(friendlyError(error.message));
      setLoading(false);
      return;
    }

    const msg = role === 'superadmin'
      ? 'Compte superadministrateur créé et approuvé avec succès !'
      : role === 'admin'
      ? 'Compte créé ! En attente d\'approbation par le superadministrateur.'
      : 'Compte créé ! En attente d\'approbation par un administrateur.';
    toast.success(msg);
    router.push('/login');
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
        <CardDescription>Rejoignez E-kajy Entana</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Type de compte</Label>
            <RadioGroup
              value={role}
              onValueChange={(v) => setRole(v as 'superadmin' | 'admin' | 'magasinier' | 'employer')}
              className="grid grid-cols-2 gap-2"
            >
              <div className={`flex items-center space-x-2 border rounded-lg p-2 cursor-pointer transition-colors ${role === 'superadmin' ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30' : 'hover:bg-muted/50'}`}>
                <RadioGroupItem value="superadmin" id="superadmin" />
                <Label htmlFor="superadmin" className="cursor-pointer text-xs flex items-center gap-1">
                  <Shield className="h-3 w-3 text-purple-600" />Super Admin
                </Label>
              </div>
              <div className={`flex items-center space-x-2 border rounded-lg p-2 cursor-pointer transition-colors ${role === 'admin' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : 'hover:bg-muted/50'}`}>
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="cursor-pointer text-xs">Admin</Label>
              </div>
              <div className={`flex items-center space-x-2 border rounded-lg p-2 cursor-pointer transition-colors ${role === 'magasinier' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30' : 'hover:bg-muted/50'}`}>
                <RadioGroupItem value="magasinier" id="magasinier" />
                <Label htmlFor="magasinier" className="cursor-pointer text-xs">Magasinier</Label>
              </div>
              <div className={`flex items-center space-x-2 border rounded-lg p-2 cursor-pointer transition-colors ${role === 'employer' ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'hover:bg-muted/50'}`}>
                <RadioGroupItem value="employer" id="employer" />
                <Label htmlFor="employer" className="cursor-pointer text-xs">Employé</Label>
              </div>
            </RadioGroup>
          </div>

          {/* ── Super Admin fields ── */}
          {role === 'superadmin' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 border border-purple-200 dark:border-purple-800 rounded-lg p-4 bg-purple-50/50 dark:bg-purple-950/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-purple-600" />
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">Compte Super Administrateur</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-company-name" className="text-sm font-medium">
                  Nom de la société <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="reg-company-name"
                    type="text"
                    placeholder="Ex: Groupe Akanjo SA"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Logo de la société (optionnel)
                </label>
                <div
                  className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 transition-colors"
                  onClick={() => document.getElementById('reg-superadmin-logo')?.click()}
                >
                  {storeLogo ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <ImagePlus className="h-5 w-5 text-green-500" />
                      <span className="truncate max-w-[180px]">{storeLogo.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setStoreLogo(null); }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-6 w-6 text-purple-400" />
                      <p className="text-xs text-muted-foreground">Cliquez pour choisir un logo</p>
                    </div>
                  )}
                  <input
                    id="reg-superadmin-logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setStoreLogo(e.target.files?.[0] || null)}
                    disabled={loading}
                  />
                </div>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Votre compte superadministrateur sera activé immédiatement après la création.
              </p>
            </div>
          )}

          {/* ── Admin fields ── */}
          {role === 'admin' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <label htmlFor="reg-store-name" className="text-sm font-medium">
                  Nom du magasin <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="reg-store-name"
                    type="text"
                    placeholder="Mon Super Magasin"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-superadmin-email" className="text-sm font-medium">
                  Email du Super Admin <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="reg-superadmin-email"
                    type="email"
                    placeholder="superadmin@societe.com"
                    value={superAdminEmail}
                    onChange={(e) => setSuperAdminEmail(e.target.value)}
                    disabled={loading}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Logo du magasin (optionnel)
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => document.getElementById('reg-store-logo')?.click()}
                >
                  {storeLogo ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <ImagePlus className="h-5 w-5 text-green-500" />
                      <span className="truncate max-w-[180px]">{storeLogo.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setStoreLogo(null); }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Cliquez pour choisir un logo</p>
                    </div>
                  )}
                  <input
                    id="reg-store-logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setStoreLogo(e.target.files?.[0] || null)}
                    disabled={loading}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                En attente d'approbation par un super administrateur
              </p>
            </div>
          )}

          {/* ── Employer / Magasinier fields ── */}
          {(role === 'magasinier' || role === 'employer') && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
              <label htmlFor="reg-manager-email" className="text-sm font-medium">
                Email de l'Admin ou Manager <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="reg-manager-email"
                  type="email"
                  placeholder="admin@entreprise.com"
                  value={referredByEmail}
                  onChange={(e) => setReferredByEmail(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Un administrateur devra approuver votre inscription
              </p>
            </div>
          )}

          {/* Full name */}
          <div className="space-y-1.5">
            <label htmlFor="reg-name" className="text-sm font-medium">
              Nom complet
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="reg-name"
                type="text"
                autoComplete="name"
                placeholder="Jean Dupont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                placeholder="vous@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-sm font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pl-10 pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
                aria-label={showPw ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Minimum 6 caractères</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création du compte…
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Déjà un compte?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
