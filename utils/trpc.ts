import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../ach-bff/src/routers/index';

// 1. We create a tRPC React client using our AppRouter type from the backend.
// This generic <AppRouter> tells TypeScript EXACTLY what endpoints exist, 
// what data they require (inputs), and what data they return (outputs).
// 2. We export `trpc` so that we can use it throughout our frontend components 
// like a standard React hook, e.g., `trpc.ach.submitForm.useMutation()`.
export const trpc = createTRPCReact<AppRouter>();
