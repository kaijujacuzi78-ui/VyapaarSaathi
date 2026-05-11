import { Navigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/auth-context";

export default function Register() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/" replace />;

  return (
    <AuthShell
      eyebrow="Founder workspace setup"
      title="Create the strategy room for your next business move."
      subtitle="Register for a secure AI-powered workspace that helps Indian founders plan compliance, funding, licenses, and growth from day one."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
