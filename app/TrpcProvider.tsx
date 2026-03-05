"use client"; // This component runs on the client side

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from '../utils/trpc'; // Import the tRPC instance we just created

// We define a provider component that we will wrap our entire application in.
// This allows all components anywhere in the app to use our `trpc` React hooks.
export function TrpcProvider({ children }: { children: React.ReactNode }) {
  // 1. Initialize React Query's underlying QueryClient.
  // We use useState so it's only created once per component lifecycle natively.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent random re-refetches on window focus for forms, usually a good default for forms
        refetchOnWindowFocus: false,
      },
    },
  }));

  // 2. Initialize the tRPC Client. 
  // Here we tell the client exactly WHERE the backend is listening.
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          // The URL matches our Fastify backend URL where tRPC is hosted
          url: 'http://localhost:3005/trpc',
          
          // Optionally, headers can be added here if sending auth tokens, like:
          // headers() {
          //   return { Authorization: 'Bearer my-token' };
          // },
        }),
      ],
    })
  );

  // 3. We use the Provider tree to wrap both `trpc` and `react-query` providers around our children.
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
