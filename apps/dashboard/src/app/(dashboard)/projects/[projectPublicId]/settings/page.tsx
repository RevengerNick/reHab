"use client";

import { useParams } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';
import { ChannelCard } from '@/components/channels/channel-card';
import { ChannelFormDialog } from '@/components/channels/channel-form-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// 1. Обновляем GraphQL-запрос
const GET_CHANNELS_QUERY = gql`
  # Используем правильный тип ID! для переменной
  query GetChannels($publicId: ID!) {
    # Передаем переменную в аргумент с тем же именем
    channels(publicId: $publicId) {
      id          # <-- Запрашиваем собственный ID канала (для key и мутаций)
      type
      isEnabled
      config
      project {   # <-- ВАЖНО: Запрашиваем родительский проект
        publicId  # <-- чтобы передать его publicId в дочерние компоненты (ChannelCard)
      }
    }
  }
`;


export enum ChannelType {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    TELEGRAM = 'TELEGRAM'
  }
// Определяем тип для наших данных, чтобы избежать 'any'
interface Channel {
  id: string;
  type: ChannelType;
  isEnabled: boolean;   
  config: object;
  project: {
    publicId: string;
  };
}

export default function ProjectSettingsPage() {
  const params = useParams();
  // Для ясности, используем одно и то же имя переменной везде
  const projectPublicId = params.projectPublicId as string;

  const { data, loading, error, refetch } = useQuery(GET_CHANNELS_QUERY, {
    variables: { publicId: projectPublicId },
    skip: !projectPublicId, // Не выполнять запрос, если ID еще не доступен
  });

  if (loading) {
    // Показываем более красивый скелетон во время загрузки
    return (
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="mt-2 h-5 w-96" />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-500">Ошибка: {error.message}</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Настройка каналов</h1>
        <ChannelFormDialog
          publicId={projectPublicId}
          onCompleted={refetch}
        >
          <Button>Добавить канал</Button>
        </ChannelFormDialog>
      </div>
      <p className="mt-2 text-slate-600">
        Здесь вы можете добавлять и настраивать каналы доставки для вашего проекта.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Используем наш типизированный объект Channel */}
        {data?.channels.map((channel: Channel) => (
          // key используем собственный id канала
          // channel={channel} передаем весь объект целиком
          <ChannelCard key={channel.id} channel={channel} onChannelUpdated={refetch} />
        ))}
      </div>
    </div>
  );
}