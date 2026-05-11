import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F7F4EC] text-[#4A3528]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#D9D2C3] bg-[#FFFDF7]/80 px-5 py-4 shadow-xl shadow-[#4A3528]/10">
          <Loader2 className="h-5 w-5 animate-spin text-[#7D9275]" />
          <span className="text-sm font-bold">Preparing your business workspace</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
