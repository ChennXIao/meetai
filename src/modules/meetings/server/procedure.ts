import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { and, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { CarTaxiFront, Search } from "lucide-react";
import { TRPCError } from "@trpc/server";

export const meetingRouter = createTRPCRouter({
    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            // drizzle always returns an array for insert so doing [] here
            const [createdMeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userId: ctx.auth.session.user.id,
                })
                .returning();

            return createdMeeting;
        }),
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
                    ...getTableColumns(meetings),
                    meetingCount: sql<number>`5`,
                })
                .from(meetings)
                .where(and(
                    eq(meetings.userId, ctx.auth.session.user.id),
                    // bc using input to access search thus it is easier to access here (?
                    search ? ilike(meetings.name, `%${search}%`) : undefined,
                ))
                .orderBy(sql`${meetings.createdAt} DESC`)
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

    getOne: protectedProcedure.input(z.object({ id: z.string(), })).query(async ({ input, ctx }) => {
        const [existingMeeting] = await db
            .select({
                ...getTableColumns(meetings),
            })
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.session.user.id),
                )
            );
        if (!existingMeeting) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });

        }

        return existingMeeting;
    }),

     update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const { id } = input;
            // check if meeting exists and belongs to user
            const [existingMeeting] = await db
                .select()
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, id),
                        eq(meetings.userId, ctx.auth.session.user.id),
                    )
                );
            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
            }

            await db
                .update(meetings)
                .set(input)
                .where(
                    eq(meetings.id, id)
                );

            return existingMeeting;
        }),
});
