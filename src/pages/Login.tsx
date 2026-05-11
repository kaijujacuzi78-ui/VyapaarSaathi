import { Navigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/auth-context";

export default function Login() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/" replace />;

  return (
    <AuthShell
      eyebrow="Secure founder access"
      title="AI business intelligence, ready when you are."
      subtitle="Login to continue building your launch plan, discovering schemes, and managing legal and growth decisions with confidence."
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
