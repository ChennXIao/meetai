import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { eq } from "drizzle-orm";
import { z } from "zod";
export const agentRouter = createTRPCRouter({
    getMany: protectedProcedure.query(async () => {
        const data = await db
            .select()
            .from(agents);

        return data;
    }),
    
    getOne: protectedProcedure.input(z.object({id: z.string(),})).query(async ({ input }) => {
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, input.id));

        return existingAgent;
    }),
    
    // not sure how does it work
    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            // drizzle always returns an array for insert so doing [] here
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.session.user.id,
                })
                .returning();

            return createdAgent;
        })
});
