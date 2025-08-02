import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Импортируем шрифт
import './globals.css';
import { ApolloClientProvider } from '@/lib/apollo-provider';
import StoreProvider from '@/lib/store-provider';
import { Toaster } from "@/components/ui/sonner";

// Настраиваем шрифт
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Xabar.dev - Панель управления',
  description: 'Единая платформа для уведомлений',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`font-sans ${inter.variable}`}>
        <StoreProvider> {/* Redux - снаружи */}
          <ApolloClientProvider>
            {children}
            <Toaster />
          </ApolloClientProvider> {/* Apollo - внутри */}
        </StoreProvider>
      </body>
    </html>
  );
}