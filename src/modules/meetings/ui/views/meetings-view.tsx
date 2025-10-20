"use client";

import { meetings } from "@/db/schema";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/modules/agents/ui/component/data-table";
import { GenerateAvatar } from "@/components/generate-avater";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useMeetingsFilters } from "../../hooks/use-meeting-filters";
import { MeetingsSearchFilter } from "../components/meetings-search-filter";
import { EmptyState } from "@/components/empty-state"; // adjust path as needed
import { Datapagination } from "@/modules/agents/ui/component/agents-data-pagination"; // adjust path as needed
import { useRouter } from "next/navigation";

export const meetingColumns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "Meeting Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                <GenerateAvatar
                    seed={row.original.name}
                    variant="botttsNeutral"
                    className="size-6"
                />
                <span className="font-semibold capitalize">{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
                <CalendarIcon className="inline h-4 w-4 mr-1" />
                {new Date(row.original.createdAt).toLocaleString()}
            </div>
        ),
    },
    {
        accessorKey: "participants",
        header: "Participants",
        cell: ({ row }) => (
            <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                <UsersIcon className="text-green-700" />
                {row.original.participants?.length ?? 0}
            </Badge>
        ),
    },
    {
        accessorKey: "instructions",
        header: "Instructions",
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground max-w-[200px] truncate capitalize">
                {row.original.instructions || "No instructions"}
            </span>
        ),
    },
];

export const MeetingsView = () => {
    const router = useRouter();

    const [filter, setFilter] = useMeetingsFilters();
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filter,
    }));


    return (
        <div>
            <h1 className="mb-4 text-xl font-bold">Meetings</h1>
            <div className="mb-4">
                <MeetingsSearchFilter />
            </div>
            <DataTable
                columns={meetingColumns}
                data={data?.items ?? []}
                onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
            <Datapagination
                page={filter.page}
                totalPage={data.totalPages}
                onPageChange={(page) => { setFilter({ page }) }}
            />
            {(data?.items?.length === 0) && (
                <div className="mt-10">
                    <EmptyState
                        message="No meetings found"
                        description="You have not created any meetings yet. Click the 'Create Meeting' button to get started."
                    />
                </div>
            )}
        </div>
    );
};

export const MeetingsViewWithErrorHandling = () => {
    return (
        <ErrorState
            message="Failed to load meetings"
            description="There was an issue loading the meetings. Please try again later."
        />
    );
};

export const MeetingsViewWithLoading = () => {
    return (
        <LoadingState
            message="Loading Meetings"
            description="Please wait while we fetch the meetings."
        />
    );
};

