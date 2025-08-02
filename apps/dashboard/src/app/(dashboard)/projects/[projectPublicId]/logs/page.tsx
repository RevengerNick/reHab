// полный путь: apps/dashboard/src/app/(dashboard)/logs/page.tsx
"use client";

import { useState } from 'react';
import { gql, useQuery } from "@apollo/client";
import { LogsTable } from '@/components/logs/logs-table';
import { LogsFilterBar } from '@/components/logs/logs-filter-bar';
import { useParams } from 'next/navigation';

// 1. Обновляем GraphQL-запрос, чтобы он использовал projectPublicId
const GET_LOGS_QUERY = gql`
  query GetLogs($publicId: ID!, $skip: Int, $take: Int, $filter: LogsFilterDto) {
    logs(publicId: $publicId, skip: $skip, take: $take, filter: $filter) {
      id
      status
      channel
      recipient
      errorDetails
      createdAt
    }
  }
`;

export default function LogsPage() {
  const params = useParams();
  const projectPublicId = params.projectPublicId as string; 
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });

  const { data, loading, error } = useQuery(GET_LOGS_QUERY, {
    // 3. Обновляем переменные для запроса
    variables: {
      publicId: projectPublicId,
      skip: pagination.skip,
      take: pagination.take,
      filter: filters,
    },
    // Поллинг: автоматически перезапрашивать данные каждые 5 секунд
    pollInterval: 5000,
    // Не выполнять запрос, если projectPublicId еще не доступен
    skip: !projectPublicId,
  });

  // Обработка ошибки загрузки
  if (error) {
    return (
      <div className="text-red-500">
        <h2 className="text-lg font-semibold">Ошибка загрузки логов</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  // Сообщение, если проект не выбран (для будущего, когда ID будет динамическим)
  if (!projectPublicId) {
    return <p>Пожалуйста, выберите проект для просмотра логов.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">История отправок</h1>
      <p className="mt-2 text-slate-600">
        Здесь отображаются все попытки отправки уведомлений для вашего проекта.
      </p>

      {/* Передаем функцию для обновления фильтров */}
      <LogsFilterBar onFilterChange={setFilters} />

      <div className="mt-6 rounded-lg border">
        <LogsTable
          logs={data?.logs || []}
          loading={loading && data?.logs?.length === 0} // Показываем скелетон только при первой загрузке
        />
      </div>

      {/* TODO: Здесь будет компонент для управления пагинацией (кнопки "Вперед"/"Назад") */}
      <div className="mt-4 flex items-center justify-end space-x-2">
        {/* Пример кнопок пагинации. Логика для них пока не реализована. */}
        <button
          className="rounded-md bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300 disabled:opacity-50"
          disabled={pagination.skip === 0}
        >
          Назад
        </button>
        <button
          className="rounded-md bg-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-300 disabled:opacity-50"
        >
          Вперед
        </button>
      </div>
    </div>
  );
}