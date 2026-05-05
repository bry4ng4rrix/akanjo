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
import { Loader2, Mail, Lock, User, Eye, EyeOff, Building2, Users } from 'lucide-react';

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
  const [role, setRole]         = useState<'admin' | 'magasinier' | 'employer'>('admin');
  const [referredByEmail, setReferredByEmail] = useState('');
  const [storeName, setStoreName] = useState('');
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
    if (role === 'admin' && storeLogo) {
      setUploadingLogo(true);
      const fileExt = storeLogo.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products') // Using products bucket for now or create a stores bucket
        .upload(`logos/${fileName}`, storeLogo);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(`logos/${fileName}`);
        logoUrl = publicUrl;
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
          status: role === 'admin' ? 'approved' : 'pending',
          referred_by_email: role !== 'admin' ? referredByEmail : null,
          store_name: role === 'admin' ? storeName : null,
          store_logo: logoUrl,
        },
        // No emailRedirectTo → no confirmation link sent
      },
    });

    if (error) {
      toast.error(friendlyError(error.message));
      setLoading(false);
      return;
    }

    // If email confirmation is DISABLED in Supabase → session is immediately available
    if (data.session) {
      if (role !== 'admin') {
        toast.success(`Compte créé — en attente d\'approbation.`);
        router.push('/login');
      } else {
        toast.success('Compte créé — bienvenue !');
        router.push('/dashboard');
      }
      router.refresh();
      return;
    }

    if (role !== 'admin') {
      toast.success('Compte créé ! En attente d\'approbation.');
    } else {
      toast.success('Compte créé ! Vous pouvez maintenant vous connecter.');
    }
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
              onValueChange={(v) => setRole(v as 'admin' | 'magasinier' | 'employer')}
              className="grid grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="cursor-pointer text-xs">Admin</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="magasinier" id="magasinier" />
                <Label htmlFor="magasinier" className="cursor-pointer text-xs">Magasinier</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-2 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="employer" id="employer" />
                <Label htmlFor="employer" className="cursor-pointer text-xs">Employé</Label>
              </div>
            </RadioGroup>
          </div>

          {role === 'admin' && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
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
                  required={role === 'admin'}
                />
              </div>
            </div>
          )}

          {role !== 'admin' && (
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
                  required={role !== 'admin'}
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
