"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
  SENT: "default",
  ACCEPTED: "secondary",
  FAILED: "destructive",
};

export function LogsTable({ logs, loading }: { logs: any[], loading: boolean }) {
  if (loading && logs.length === 0) {
    return <p>Загрузка...</p>; // Или можно добавить скелетоны для таблицы
  }

  if (!loading && logs.length === 0) {
    return <p>Для данного проекта и фильтров логи не найдены.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Статус</TableHead>
          <TableHead>Канал</TableHead>
          <TableHead>Получатель</TableHead>
          <TableHead>Время</TableHead>
          <TableHead>Детали</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              <Badge variant={statusVariantMap[log.status] || 'secondary'}>
                {log.status}
              </Badge>
            </TableCell>
            <TableCell>{log.channel}</TableCell>
            <TableCell className="font-medium">{log.recipient}</TableCell>
            <TableCell>{format(new Date(log.createdAt), 'dd.MM.yyyy HH:mm')}</TableCell>
            <TableCell className="text-xs text-slate-500 truncate max-w-xs">
              {log.errorDetails || '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}