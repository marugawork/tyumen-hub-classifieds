import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(email, password)) {
      navigate("/admin");
    } else {
      setError("Неверный email или пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-premium flex items-center justify-center mb-3">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-foreground">Админ-панель</h1>
            <p className="text-sm text-muted-foreground">Нефтеюганск.Инфо</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Пароль</label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button type="submit" className="w-full font-bold">
              Войти
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
