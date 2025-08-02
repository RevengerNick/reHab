"use client";

import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Separator } from '@/components/ui/separator';

// 1. Обновляем мутации, чтобы они использовали правильные имена DTO
const CREATE_CHANNEL_MUTATION = gql`
  mutation CreateChannel($createChannelDto: CreateChannelDto!) {
    createChannel(createChannelDto: $createChannelDto) { id }
  }
`;
const UPDATE_CHANNEL_MUTATION = gql`
  mutation UpdateChannel($updateChannelDto: UpdateChannelDto!) {
    updateChannel(updateChannelDto: $updateChannelDto) { id }
  }
`;

export function ChannelFormDialog({
  publicId,
  isEditing = false,
  channelToEdit,
  onCompleted,
  children,
}: {
  publicId: string;
  isEditing?: boolean;
  channelToEdit?: any;
  onCompleted: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('GENERIC_SMTP');
  const [config, setConfig] = useState<Record<string, any>>({}); // Типизируем config

  useEffect(() => {
    if (open) { // Заполняем стейт только при открытии
      if (isEditing && channelToEdit) {
        setName(channelToEdit.name || '');
        setProvider(channelToEdit.provider || 'GENERIC_SMTP');
        setConfig(channelToEdit.config || {});
      } else {
        // Сбрасываем до дефолтных значений для формы создания
        setName('');
        setProvider('GENERIC_SMTP');
        setConfig({});
      }
    }
  }, [isEditing, channelToEdit, open]);

  const mutation = isEditing ? UPDATE_CHANNEL_MUTATION : CREATE_CHANNEL_MUTATION;
  const [saveChannel, { loading }] = useMutation(mutation, {
    onCompleted: () => {
      toast.success(`Канал успешно ${isEditing ? 'обновлен' : 'создан'}.`);
      setOpen(false);
      onCompleted();
    },
    onError: (error) => toast.error("Ошибка!", { description: error.message }),
  });

  const handleConfigChange = (path: string, value: any) => {
    setConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev)); // Глубокое копирование
      const keys = path.split('.');
      let current: any = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = current[keys[i]] || {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };
  
  const handleSubmit = () => {
    const port = parseInt(config.port, 10);
    const finalConfig = { ...config, port: isNaN(port) ? undefined : port };

    // 2. Собираем DTO для создания или обновления
    const createDto = { 
      publicId,
      name,
      type: 'EMAIL', // Пока только Email
      provider,
      config: finalConfig,
      priority: 0, // Пока хардкодим
    };
    
    const updateDto = {
      id: channelToEdit?.id,
      publicId,
      name,
      provider,
      config: finalConfig,
      priority: 0,
    };

    const variables = isEditing
      ? { updateChannelDto: updateDto }
      // Убедимся, что имя переменной совпадает с мутацией
      : { createChannelDto: createDto };
      
    saveChannel({ variables });
  };

  const renderConfigFields = () => {
    // 3. Динамически рендерим поля
    switch (provider) {
      case 'GENERIC_SMTP':
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">Настройки для стандартного SMTP сервера.</p>
            <div>
              <Label htmlFor="host">SMTP Host</Label>
              <Input id="host" placeholder="smtp.example.com" value={config.host || ''} onChange={(e) => handleConfigChange('host', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input id="port" type="number" placeholder="587" value={config.port || ''} onChange={(e) => handleConfigChange('port', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="user">Username</Label>
              <Input id="user" value={config.auth?.user || ''} onChange={(e) => handleConfigChange('auth.user', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pass">Password</Label>
              <Input id="pass" type="password" value={config.auth?.pass || ''} onChange={(e) => handleConfigChange('auth.pass', e.target.value)} />
            </div>
          </div>
        );
      case 'MAILTRAP_API':
          return (
             <div className="space-y-4">
               <p className="text-sm text-slate-500">Введите API токен из раздела "Email Sending" в вашем аккаунте Mailtrap.</p>
               <div>
                 <Label htmlFor="apiToken">API Token</Label>
                 <Input 
                   id="apiToken" 
                   type="password" 
                   placeholder="Ваш Mailtrap API токен" 
                   value={(config as any).apiToken || ''} 
                   onChange={(e) => handleConfigChange('apiToken', e.target.value)} 
                 />
               </div>
             </div>
          );
      default:
        return <p className="text-sm text-slate-500">Пожалуйста, выберите провайдера.</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Редактировать "${channelToEdit?.name}"` : 'Новый канал'}</DialogTitle>
          <DialogDescription>Настройте параметры для канала доставки.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input id="name" placeholder="Мой рабочий email (Mailtrap)" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Провайдер</Label>
            <Select value={provider} onValueChange={setProvider} disabled={loading}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERIC_SMTP">Общий SMTP</SelectItem>
                <SelectItem value="MAILTRAP_API">Mailtrap API</SelectItem>
                <SelectItem value="SENDGRID" disabled>SendGrid (скоро)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          {renderConfigFields()}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Сохранение..." : "Сохранить"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}