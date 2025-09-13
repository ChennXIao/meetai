import { LoadingState } from "@/components/loading-state";
import { AgentsListHeader } from "@/modules/agents/ui/component/agents-list-header";
import { AgentsView, AgentsViewWithErrorHandling, AgentsViewWithLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/param";

interface Props{
    searchParams: Promise<SearchParams>;
}


const AgentPage = async ({searchParams}:Props) => {
    const filters = await loadSearchParams(searchParams);

    const session = await auth.api.getSession(
        {
            headers: await headers(),
        }
    );

    if (!session) {
        // Redirect to login page
        redirect('/sign-in');
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

    return (
        <>
            <AgentsListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<AgentsViewWithLoading />}>
                    <ErrorBoundary fallback={<AgentsViewWithErrorHandling />}>
                        <AgentsView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
};

export default AgentPage;
