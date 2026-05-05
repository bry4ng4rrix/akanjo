'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const ERRORS: Record<string, string> = {
  'Invalid login credentials':    'Email ou mot de passe incorrect.',
  'Email not confirmed':          'Compte non confirmé. Contactez l\'administrateur.',
  'User not found':               'Aucun compte avec cet email.',
  'Too many requests':            'Trop de tentatives. Attendez quelques minutes.',
  'Account pending approval':     'Compte en attente d\'approbation. Contactez votre manager.',
  'Account rejected':             'Compte rejeté. Contactez votre manager.',
  'Password reset email sent':    'Email de réinitialisation envoyé ! Vérifiez votre boîte mail.',
};

function friendlyError(msg: string) {
  for (const [key, val] of Object.entries(ERRORS)) {
    if (msg.includes(key)) return val;
  }
  return msg;
}

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      toast.error(friendlyError(authError.message));
      setLoading(false);
      return;
    }

    // Check user status for employers
    if (authData.user) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('role, status')
        .eq('id', authData.user.id)
        .single();

      if (userProfile?.role === 'employer') {
        if (userProfile?.status === 'pending') {
          await supabase.auth.signOut();
          toast.error(ERRORS['Account pending approval']);
          setLoading(false);
          return;
        }
        if (userProfile?.status === 'rejected') {
          await supabase.auth.signOut();
          toast.error(ERRORS['Account rejected']);
          setLoading(false);
          return;
        }
      }
    }

    toast.success('Connexion réussie !');
    router.push('/dashboard');
    router.refresh();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail || resetEmail.length < 5) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }

    setResetLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(friendlyError(error.message));
      setResetLoading(false);
      return;
    }

    toast.success(ERRORS['Password reset email sent']);
    setForgotPasswordMode(false);
    setResetEmail('');
    setResetLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold">
          {forgotPasswordMode ? 'Mot de passe oublié' : 'Connexion'}
        </CardTitle>
        <CardDescription>
          {forgotPasswordMode 
            ? 'Saisissez votre email pour réinitialiser votre mot de passe'
            : 'Accédez à votre espace E-kajy Entana'
          }
        </CardDescription>
      </CardHeader>

      <CardContent>
        {forgotPasswordMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
            {/* Reset Email */}
            <div className="space-y-1.5">
              <label htmlFor="reset-email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={resetLoading}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Un lien de réinitialisation sera envoyé à cette adresse
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={resetLoading}>
              {resetLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi…
                </>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setForgotPasswordMode(false);
                setResetEmail('');
              }}
              className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Retour à la connexion
            </button>
          </form>
        ) : (
          <>
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="login-email"
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
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-sm font-medium">
                Mot de passe
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordMode(true);
                  setResetEmail(email);
                }}
                className="text-xs text-primary hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pl-10 pr-10"
                required
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
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion…
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Pas encore de compte?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Créer un compte
          </Link>
        </p>
        </>
      )}
      </CardContent>
    </Card>
  );
}
