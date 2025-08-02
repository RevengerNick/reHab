"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const REGISTER_MUTATION = gql`
  mutation Register($registerDto: RegisterDto!) {
    register(registerDto: $registerDto) {
      name
      id
      email
    }
  }
`;

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      router.push('/login');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    register({ variables: { registerDto: { email, password, name } } });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100">
      <div className="w-full max-w-4xl rounded-xl bg-white shadow-lg md:grid md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900">Создать аккаунт</h2>
          <p className="mt-2 text-slate-600">
            Присоединяйтесь к Xabar.dev, чтобы начать работу.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Создание...' : 'Зарегистрироваться'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}