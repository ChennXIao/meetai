import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { and, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { CarTaxiFront, Search } from "lucide-react";
import { TRPCError } from "@trpc/server";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatarUri } from "@/lib/avatar";

export const meetingRouter = createTRPCRouter({
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
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
                .delete(meetings)
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
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, id),
                        eq(meetings.userId, ctx.auth.session.user.id),
                    )
                );

            return { success: true };
        }),
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

                        const call = streamVideo.video.call("default", createdMeeting.id);
            await call.create({
                data: {
                    created_by_id: ctx.auth.session.user.id,
                    custom: {
                        meetingId: createdMeeting.id,
                        meetingName: createdMeeting.name,
                    },
                    settings_override: {
                        transcription: {
                            mode: "auto-on",
                            language: "en",
                            closed_caption_mode: "auto-on",
                        },
                        recording: {
                            mode: "auto-on",
                            quality: "1080p",
                        },

                    },
                },
            });

            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(
                    eq(agents.id, createdMeeting.agentId)
                );
            if (!existingAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
            }

            await streamVideo.upsertUsers([{
                id: existingAgent.id,
                name: existingAgent.name,
                role: 'user',
                image: generateAvatarUri({
                    seed: existingAgent.name,
                    variant: 'botttsNeutral'
                }),
            }]);


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

    generateToken: protectedProcedure
        .mutation(async ({ ctx }) => {
            try {
                  console.log(process.env.NEXT_PUBLIC_VIDEO_STREAM_API_KEY);

                await streamVideo.upsertUsers([{
                    id: ctx.auth.session.user.id,
                    name: ctx.auth.session.user.name,
                    role: "admin",
                    image:
                        ctx.auth.session.user.image ??
                        generateAvatarUri({ seed: ctx.auth.session.user.name }),
                }]);

                const iat = Math.floor(Date.now() / 1000) - 60;
                const exp = Math.floor(Date.now() / 1000) + 3600;

                const token = streamVideo.generateUserToken({
                    user_id: ctx.auth.session.user.id,
                    exp,
                    validity_in_seconds: iat,
                });


                // return as object so client can inspect token.token
                return token;
            } catch (err) {
                console.error("[stream] generateToken error:", err);
                throw err;
            }
        }),
});