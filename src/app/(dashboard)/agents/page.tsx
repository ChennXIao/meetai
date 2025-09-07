import { LoadingState } from "@/components/loading-state";
import { AgentsView, AgentsViewWithErrorHandling, AgentsViewWithLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


const AgentPage = async () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agent.getMany.queryOptions());
  
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsViewWithLoading />}>
                <ErrorBoundary fallback={<AgentsViewWithErrorHandling />}>
                    <AgentsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default AgentPage;
 