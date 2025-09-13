import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { and, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";


import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { CarTaxiFront, Search } from "lucide-react";
export const agentRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(z.object({
            page: z
                .number()
                .default(DEFAULT_PAGE),
            pageSize: z
                .number()
                .min(MIN_PAGE_SIZE)
                .max(MAX_PAGE_SIZE)
                .default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
        }))
        .query(async ({ ctx, input }) => {
            const { search, page, pageSize } = input;

            const data = await db
                .select({
                    ...getTableColumns(agents),
                    meetingCount: sql<number>`5`,
                })
                .from(agents)
                .where(and(
                    eq(agents.userId, ctx.auth.session.user.id),
                    // bc using input to access search thus it is easier to access here (?
                    search ? ilike(agents.name, `%${search}%`) : undefined,
                ))
                .orderBy(sql`${agents.createdAt} DESC`)
                .limit(pageSize)
                .offset((page - 1) * pageSize)
                ;

            const totalItems = await db
                .select({
                    count: sql<number>`count(${agents.id})`,
                })
                .from(agents)
                .where(and(
                    eq(agents.userId, ctx.auth.session.user.id),
                    search ? ilike(agents.name, `%${search}%`) : undefined,
                ))
                .then((res) => Number(res[0]?.count ?? 0));

            const totalPages = Math.ceil(totalItems / pageSize);

            return {
                items: data,
                totalItems,
                totalPages,
            };
        }),

    getOne: protectedProcedure.input(z.object({ id: z.string(), })).query(async ({ input }) => {
        const [existingAgent] = await db
            .select({
                ...getTableColumns(agents),
                meetingCount: sql<number>`5`,
            })
            .from(agents);

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
