'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ИСПРАВЛЕНИЕ ЗДЕСЬ:
  // Мы передаем `null` как начальное значение для ref.
  // Также мы указываем, что тип ref может быть AppStore ИЛИ null.
  const storeRef = useRef<AppStore | null>(null);

  // Эта логика остается прежней и теперь работает корректно.
  // Если store еще не создан...
  if (!storeRef.current) {
    // ...создаем его и сохраняем в ref, чтобы он не пересоздавался при ре-рендерах.
    storeRef.current = makeStore();
  }

  // Передаем созданный (или уже существующий) store в Provider.
  return <Provider store={storeRef.current}>{children}</Provider>;
}