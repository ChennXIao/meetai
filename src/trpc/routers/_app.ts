import { agentRouter } from '@/modules/agents/server/procedure';
import { meetingRouter } from '@/modules/meetings/server/procedure';
import { createTRPCRouter } from '@/trpc/init';

export const appRouter = createTRPCRouter({
  agents: agentRouter, 
  meetings: meetingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
