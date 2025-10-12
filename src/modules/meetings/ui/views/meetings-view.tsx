"use client";

import { meetings } from "@/db/schema";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";


export const MeetingsView = () => {
    const trpc = useTRPC();
    const { data: meetings } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return (
        <div>
            <h1>Meetings</h1>
            <ul>
                {meetings?.items.map((meeting) => (
                    <li key={meeting.id}>
                        {meeting.name} - Created At: {new Date(meeting.createdAt).toLocaleString()}
                    </li>
                ))}
            </ul>
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
}

export const MeetingsViewWithLoading = () => {
    return (
        <LoadingState 
            message="Loading Meetings" 
            description="Please wait while we fetch the meetings." 
        />
    );
}

