import { agentRouter } from '@/modules/agents/server/procedure';
import { createTRPCRouter } from '@/trpc/init';

export const appRouter = createTRPCRouter({
  agent: agentRouter, 
});

// export type definition of API
export type AppRouter = typeof appRouter;
