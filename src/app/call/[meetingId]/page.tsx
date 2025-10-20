import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CallView } from "@/modules/call/ui/views/call-views";


interface CallPageProps {
    params: { meetingId: string };
}
const CallPage = async ({ params }: CallPageProps) => {
    const session = await auth.api.getSession(
        {
            headers: await headers(),
        }
    );

    if (!session) {
        // Redirect to login page
        redirect('/sign-in');
    }
    const meetingId = params.meetingId;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    return (
        
        <HydrationBoundary state={dehydrate(queryClient)}> 
            <CallView meetingId={meetingId} />
        </HydrationBoundary>
    );
};

export default CallPage;