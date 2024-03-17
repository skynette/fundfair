'use client'

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { queryClientOptions } from './../lib/utils';
import { AuthContextProvider } from '@/lib/context/authContextProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    ...queryClientOptions,
    mutationCache: new MutationCache({
      onError: (error) => {
        // @ts-ignore
        if (error?.response.status >= 500) toast.error(error.message);
      }
    }),
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
      <Toaster richColors position='top-right' />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}