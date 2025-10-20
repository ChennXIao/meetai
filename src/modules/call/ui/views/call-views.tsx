"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { CallProvider } from "../components/call-provider";
import { ErrorState } from "@/components/error-state";

interface CallViewProps {
    meetingId: string;
}


export const CallView = ({ meetingId }: CallViewProps) => {
        console.log("IS CLIENT RENDER?:", typeof window !== "undefined");


    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );
    if (data.status === "completed") {
        return <ErrorState
            message="Meeting has ended"
            description="You can no longer join the meeting."
        />;
    }


    // if (!data) {
    //     return <div>Loading...</div>;
    // }

    return (
        <CallProvider meetingId={meetingId} meetingName={data.name} />
    );
};