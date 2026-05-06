import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata = {
  title: 'Réinitialiser le mot de passe - E-kajy Entana',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <ResetPasswordForm />
    </div>
  );
}
