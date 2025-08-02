"use client"; // Эта страница теперь интерактивная, это клиентский компонент

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { useAppDispatch } from '@/lib/hooks'; // Создадим этот файл с хуками
import { setCredentials } from '@/lib/features/auth/authSlice';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

// Определяем нашу GraphQL-мутацию
const LOGIN_MUTATION = gql`
  mutation Login($loginDto: LoginDto!) {
    login(loginDto: $loginDto) {
      accessToken
      user {
        id
        email
        # Добавьте другие поля пользователя, которые хотите получить
      }
    }
  }
`;

export default function LoginPage() {
  // Локальное состояние для полей формы и ошибок
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  // Хук Apollo Client для выполнения мутации
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      // Этот колбэк выполняется при УСПЕШНОМ завершении мутации
      dispatch(setCredentials({ 
        token: data.login.accessToken, 
        user: data.login.user 
      }));
      router.push('/'); // Перенаправляем на главную страницу дашборда
    },
    onError: (error) => {
      // Этот колбэк выполняется при ошибке
      setError(error.message);
    },
  });

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    setError(null); // Сбрасываем старые ошибки
    login({ variables: { loginDto: { email, password } } });
  };

  return (
    // Основной контейнер, занимающий весь экран и использующий серый фон
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-lg md:grid md:grid-cols-2">
        {/* Левая панель (видна на средних и больших экранах) */}
        <div className="hidden flex-col justify-between rounded-l-xl bg-slate-900 p-8 text-white md:flex">
          <h1 className="text-2xl font-bold">Xabar.dev</h1>
          <p className="text-slate-300">
            Единая платформа для всех ваших уведомлений. Надежно, быстро и с
            любовью.
          </p>
        </div>

        {/* Правая панель - Форма входа */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900">Вход в аккаунт</h2>
          <p className="mt-2 text-slate-600">
            Введите ваши данные для доступа к панели управления.
          </p>

          {/* Сама форма */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Поле для Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email} // Привязываем состояние
                onChange={(e) => setEmail(e.target.value)} // Обновляем состояние
              />
            </div>

            {/* Поле для Пароля */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Пароль</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Забыли пароль?
                </Link>
              </div>
              <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {/* Кнопка входа */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {/* Ссылка на регистрацию */}
          <p className="mt-8 text-center text-sm text-slate-600">
            Еще нет аккаунта?{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:underline"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}