"use client";


import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { MeetingIdViewHeader } from "../components/meetings-id-view-header";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelState } from "../components/cancel-state";
import { ProcessingState } from "../components/processing-state";


interface MeetingIdViewProps {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {

    const trpc = useTRPC();
    const router = useRouter();
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );
    const queryClient = useQueryClient();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                router.push('/meetings');
            },
            onError: (error) => {
                toast.error(error.message);
            }
        }),
    );
    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: meetingId }));
            },
            onError: (error) => {
                toast.error(error.message);
            }
        }),
    );

    const isCanceled = data.status === 'canceled';
    const isPending = data.status === 'pending';
    const isActive = data.status === 'active';
    const isCompleted = data.status === 'completed';
    const isUpcoming = data.status === 'upcoming';

    return (
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <MeetingIdViewHeader
                meetingId={meetingId}
                meetingName={data?.name}
                onEdit={() => setShowUpdateDialog(true)}
                onRemove={() => setShowDeleteDialog(true)}

            />
            {isCanceled && <CancelState />}
            {isPending && <ProcessingState />}
            {isActive && <ActiveState meetingId={meetingId} />}
            {isCompleted && <div>completed</div>}
            {isUpcoming && <UpcomingState meetingId={meetingId} onCancelMeeting={() => {}} isCanceled={isCanceled} />}
            <div className="background-white rounded-lg p-6 shadow-md">
                <div>
                    <div>
                    </div>
                    <h2 className="text-2xl font-bold mt-4">{data?.name}</h2>
                </div>
            </div>
            <ResponsiveDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Agent"
                description="Are you sure you want to delete this item?"
            >
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            removeMeeting.mutate({ id: meetingId });
                            setShowDeleteDialog(false);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </ResponsiveDialog>
            <UpdateMeetingDialog
                isOpen={showUpdateDialog}
                onOpenChange={setShowUpdateDialog}
                initialValue={data}
            />
        </div>

    )

};


export const MeetingIdViewWithErrorHandling = () => {
    return (
        <ErrorState
            message="Failed to load meeting"
            description="There was an issue loading the meeting. Please try again later."
        />
    );
};

export const MeetingIdViewWithLoading = () => {
    return (
        <LoadingState
            message="Loading Meeting"
            description="Please wait while we fetch the meeting."
        />
    );
};
