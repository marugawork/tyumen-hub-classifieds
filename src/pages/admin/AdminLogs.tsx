import AdminLayout from "@/components/admin/AdminLayout";
import { adminLogs } from "@/data/adminMockData";
import { ScrollText } from "lucide-react";

export default function AdminLogs() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold text-foreground">Журнал действий</h1>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-semibold text-muted-foreground">Дата</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Время</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Администратор</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Действие</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Объект</th>
                </tr>
              </thead>
              <tbody>
                {adminLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-muted-foreground">{log.date}</td>
                    <td className="p-3 text-muted-foreground">{log.time}</td>
                    <td className="p-3 text-foreground font-medium text-xs">{log.admin}</td>
                    <td className="p-3 text-foreground">{log.action}</td>
                    <td className="p-3 text-muted-foreground">{log.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {adminLogs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ScrollText className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Нет записей</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
