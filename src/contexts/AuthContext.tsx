import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext, type AuthContextValue } from "@/contexts/auth-context";
import { getAuthMessage, normalizeIdentifier } from "@/lib/auth-utils";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    loading,
    signIn: async (identifier, password) => {
      const { email } = normalizeIdentifier(identifier);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(getAuthMessage(error.message, "Invalid password"));
    },
    signUp: async (identifier, password) => {
      const { email, username } = normalizeIdentifier(identifier);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            account_type: username ? "username" : "email",
          },
        },
      });

      if (error) throw new Error(getAuthMessage(error.message, "Account already exists"));
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error("Account already exists");
      }

      if (!data.session) {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw new Error("Registration created. Please verify your email to continue.");
      }
    },
    signInWithGoogle: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw new Error(error.message);
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    },
  }), [loading, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
