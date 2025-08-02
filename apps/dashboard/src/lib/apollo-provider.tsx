"use client";

import { 
  ApolloClient, 
  ApolloProvider, 
  InMemoryCache, 
  createHttpLink // Импортируем createHttpLink
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context'; // Импортируем setContext

// Шаг 1: Создаем "HTTP Link" - это основное соединение с нашим API
const httpLink = createHttpLink({
  uri: "/api/graphql", // Теперь запросы пойдут на наш собственный сервер
});

// Шаг 2: Создаем "Auth Link" - это middleware, которое добавляет токен
const authLink = setContext((_, { headers }) => {
  // Получаем токен из localStorage при каждом запросе
  const token = localStorage.getItem('token');
  
  // Возвращаем заголовки в контекст, чтобы httpLink мог их использовать
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Шаг 3: Создаем финальный клиент, объединяя Auth Link и HTTP Link.
// authLink идет первым, чтобы модифицировать запрос ПЕРЕД отправкой.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function ApolloClientProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}