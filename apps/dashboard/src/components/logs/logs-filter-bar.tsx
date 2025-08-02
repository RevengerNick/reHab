"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from 'use-debounce';

export function LogsFilterBar({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [status, setStatus] = useState('');
  const [channel, setChannel] = useState('');
  const [recipient, setRecipient] = useState('');
  const [debouncedRecipient] = useDebounce(recipient, 500); // Задержка для поля поиска

  useEffect(() => {
    const filters: any = {};
    if (status) filters.status = status;
    if (channel) filters.channel = channel;
    if (debouncedRecipient) filters.recipient = debouncedRecipient;
    onFilterChange(filters);
  }, [status, channel, debouncedRecipient, onFilterChange]);

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Input
        placeholder="Поиск по получателю..."
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Фильтр по статусу" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="">Все статусы</SelectItem>  <-- УДАЛЯЕМ ЭТУ СТРОКУ */}
          <SelectItem value="SENT">Отправлено</SelectItem>
          <SelectItem value="ACCEPTED">В очереди</SelectItem>
          <SelectItem value="FAILED">Ошибка</SelectItem>
        </SelectContent>
      </Select>
      
      {/* ИЗМЕНЕНИЕ ДЛЯ КАНАЛА */}
      <Select value={channel} onValueChange={setChannel}>
        <SelectTrigger>
          <SelectValue placeholder="Фильтр по каналу" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="">Все каналы</SelectItem> <-- УДАЛЯЕМ ЭТУ СТРОКУ */}
          <SelectItem value="EMAIL">Email</SelectItem>
          <SelectItem value="SMS">SMS</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}