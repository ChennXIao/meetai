"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DataTable, } from "../component/data-table";
import { columns } from "../component/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { Datapagination } from "@/modules/agents/ui/component/agents-data-pagination";

export const AgentsView = () => {
  const [filters, setFilters] = useAgentsFilters();
  const trpc = useTRPC();
  // Use the useSuspenseQuery hook to fetch data
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
    ...filters,
  }));

  return (
      <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data.items} />
      <Datapagination
        page={filters.page}
        totalPage={data.totalPages}
        onPageChange={(page)=>{setFilters({page})}}
      />
      {data.items.length === 0 && (
        <div className="mt-10">
          <EmptyState 
            message="No agents found" 
            description="You have not created any agents yet. Click the 'Create Agent' button to get started." 
          />
        </div>
      )}
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