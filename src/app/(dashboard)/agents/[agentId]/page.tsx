import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AgentsIdViewWithErrorHandling, AgentsIdViewWithLoading } from "@/modules/agents/ui/views/agents-id-view";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AgentsIdView } from "@/modules/agents/ui/views/agents-id-view";


interface Props {
    params: Promise<{ agentId: string }>
}

// not the same as tutorial
export default async function Page({ params }: Props) {
    const { agentId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({ id: agentId })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsIdViewWithLoading />}>
                <ErrorBoundary fallback={<AgentsIdViewWithErrorHandling/>}>
                    <AgentsIdView agentId={agentId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )


}