import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AdminAuth {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuth | null>(null);

const ADMIN_EMAIL = "info@tyumen.info";
const ADMIN_PASSWORD = "Zxcvbnm777!";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const login = useCallback((e: string, p: string) => {
    if (e === ADMIN_EMAIL && p === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setEmail(e);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setEmail(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, email, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
