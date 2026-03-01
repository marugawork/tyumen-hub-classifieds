import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, CreditCard, Wallet, Smartphone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const [step, setStep] = useState<"select" | "pay" | "success">("select");
  const [selectedMethod, setSelectedMethod] = useState("");
  const navigate = useNavigate();

  const methods = [
    { id: "card", label: "Банковская карта", icon: CreditCard, desc: "Visa, MasterCard, МИР" },
    { id: "sbp", label: "СБП", icon: Smartphone, desc: "Система быстрых платежей" },
    { id: "balance", label: "С баланса", icon: Wallet, desc: "Текущий баланс: 0 ₽" },
  ];

  const handlePay = () => {
    setStep("success");
    setTimeout(() => navigate("/profile"), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-8 max-w-lg">
        {step === "select" && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-extrabold text-foreground mb-6">Оплата</h1>
            <div className="bg-card rounded-2xl border border-border p-6 mb-6">
              <h2 className="font-bold text-foreground mb-1">VIP продвижение</h2>
              <p className="text-2xl font-extrabold text-accent">299 ₽</p>
              <p className="text-sm text-muted-foreground mt-1">Срок действия: 7 дней</p>
            </div>

            <h3 className="font-bold text-foreground mb-3">Способ оплаты</h3>
            <div className="space-y-2 mb-6">
              {methods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                    selectedMethod === m.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"
                  }`}
                >
                  <m.icon className={`w-5 h-5 ${selectedMethod === m.id ? "text-accent" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className="font-bold text-sm text-foreground">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => selectedMethod && setStep("pay")}
              disabled={!selectedMethod}
              className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 disabled:opacity-50 transition-all"
            >
              Продолжить
            </button>
          </div>
        )}

        {step === "pay" && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-extrabold text-foreground mb-6">Подтверждение</h1>
            <div className="bg-card rounded-2xl border border-border p-6 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Услуга</span>
                <span className="text-foreground font-medium">VIP продвижение</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Срок</span>
                <span className="text-foreground font-medium">7 дней</span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-border">
                <span className="font-bold text-foreground">Итого</span>
                <span className="font-extrabold text-accent text-lg">299 ₽</span>
              </div>
            </div>
            <button
              onClick={handlePay}
              className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 transition-colors"
            >
              Оплатить 299 ₽
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="animate-fade-in text-center py-16">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">Оплата успешна!</h1>
            <p className="text-muted-foreground mb-4">VIP статус активирован на 7 дней</p>
            <p className="text-xs text-muted-foreground">Перенаправляем в личный кабинет...</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
