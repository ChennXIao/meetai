interface PageProps {
    params: Promise<{ meetingId: string }>;
}

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MeetingIdView, MeetingIdViewWithErrorHandling, MeetingIdViewWithLoading } from "@/modules/meetings/ui/views/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";

const Page = async ({ params }: PageProps) => {
    const { meetingId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/sign-in');
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<MeetingIdViewWithLoading />}>
                    <ErrorBoundary fallback={<MeetingIdViewWithErrorHandling />}>
                        <MeetingIdView meetingId={meetingId} />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
};

export default Page;
