import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";

const mockChats = [
  { id: "1", name: "Алексей", lastMessage: "Здравствуйте, ещё продаёте?", time: "14:30", unread: 1 },
  { id: "2", name: "ЮганскАвто", lastMessage: "Да, машина в наличии. Когда удобно посмотреть?", time: "Вчера", unread: 0 },
  { id: "3", name: "Мария", lastMessage: "Спасибо, забрала!", time: "2 дн.", unread: 0 },
  { id: "4", name: "НефтеСтрой", lastMessage: "Можем доставить завтра", time: "3 дн.", unread: 0 },
];

const mockMessages = [
  { id: 1, from: "other", text: "Здравствуйте, ещё продаёте iPhone?", time: "14:28" },
  { id: 2, from: "me", text: "Да, в наличии. Состояние отличное.", time: "14:29" },
  { id: 3, from: "other", text: "Можно посмотреть сегодня?", time: "14:30" },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-main py-6">
        <h1 className="text-2xl font-extrabold text-foreground mb-6">Сообщения</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: "500px" }}>
          {/* Chat list */}
          <div className="space-y-2">
            {mockChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full bg-card rounded-xl border p-4 flex items-center gap-3 transition-colors text-left ${
                  selectedChat === chat.id ? "border-accent" : "border-border hover:border-accent/30"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-muted-foreground">{chat.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{chat.name}</span>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shrink-0">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Chat window */}
          <div className="md:col-span-2 bg-card rounded-2xl border border-border flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-border">
                  <span className="font-bold text-foreground">{mockChats.find(c => c.id === selectedChat)?.name}</span>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {mockMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.from === "me" ? "bg-accent text-accent-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                      }`}>
                        {msg.text}
                        <span className="block text-[10px] mt-1 opacity-60">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Написать сообщение..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="flex-1 h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    <button className="h-11 px-5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Выберите чат</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
