import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AdminAuth {
  isAuthenticated: boolean;
  loading: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuth | null>(null);

async function checkSuperAdmin(userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "super_admin" });
  return data === true;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!user) { setIsAdmin(false); setLoading(false); return; }
    setLoading(true);
    checkSuperAdmin(user.id).then((ok) => {
      if (!cancelled) { setIsAdmin(ok); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [user, authLoading]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      const msg = error?.message?.includes("Email not confirmed")
        ? "Email не подтверждён — откройте письмо и подтвердите адрес"
        : "Неверный email или пароль";
      return { ok: false, error: msg };
    }
    const ok = await checkSuperAdmin(data.user.id);
    if (!ok) {
      await supabase.auth.signOut();
      return { ok: false, error: "Нет прав администратора" };
    }
    setIsAdmin(true);
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated: isAdmin, loading: loading || authLoading, email: isAdmin ? user?.email ?? null : null, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
