import { QueryClient } from '@tanstack/react-query';

/**
 * Instância global do TanStack Query.
 * Configurada para evitar re-fetches agressivos que gastam bateria e dados móveis.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Tenta novamente apenas 1 vez em caso de falha (além do fluxo de refresh token)
      refetchOnWindowFocus: false, // Em mobile, evitar refetch sempre que o ecrã ganha foco
      staleTime: 1000 * 60 * 5, // Os dados são considerados "frescos" durante 5 minutos
    },
  },
});
