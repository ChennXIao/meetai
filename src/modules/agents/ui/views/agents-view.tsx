"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

export const AgentsView = () => {
  const trpc = useTRPC();
  // Use the useSuspenseQuery hook to fetch data
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div>
      {JSON.stringify(data, null, 2)}
    </div>
  );
}

export const AgentsViewWithErrorHandling = () => {
    return (
        <ErrorState 
            message="Failed to load agents" 
            description="There was an issue loading the agents. Please try again later." 
        />
    );
}

export const AgentsViewWithLoading = () => {
    return (
        <LoadingState 
            message="Loading Agents" 
            description="Please wait while we fetch the agents." 
        />
    );
}
  