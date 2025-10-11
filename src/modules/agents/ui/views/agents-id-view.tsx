"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { AgentsIdViewHeader } from "../component/agents-id-view-header";
import { GenerateAvatar } from "@/components/generate-avater";
import { VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { UpdateAgentDialog } from "../component/update-agent-dialog";

interface Props {
    agentId: string,
}

export const AgentsIdView = ({ agentId }: Props) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    const { data: agent } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));
    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                router.push('/agents');            
            },
            onError: (error) => {
                toast.error(error.message);
            }
        }),
    );
    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: agentId }));
            },
            onError: (error) => {
                toast.error(error.message);
            }
        }),
    );

    return (
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <AgentsIdViewHeader
                agentId={agentId}
                // cannot access data.name directly, need to pass as prop
                agentName={agent?.name}
                onEdit={() => setShowUpdateDialog(true)}
                onRemove={() => setShowDeleteDialog(true)}

            />
            <div className="background-white rounded-lg p-6 shadow-md">
                <div>
                    <div>
                        <GenerateAvatar seed={agent?.name || "A"} variant="botttsNeutral" className="rounded-md" />
                    </div>
                    <h2 className="text-2xl font-bold mt-4">{agent?.name}</h2>
                </div>
                <Badge className="flex items-center gap-x-2 [&>svg]:size-4">
                    <VideoIcon />
                    {agent?.meetingCount || 0} Meetings

                </Badge>
                <div className="mt-4 whitespace-pre-wrap">
                    {agent?.instructions || "No instructions provided."}
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
                            removeAgent.mutate({ id: agentId });
                            setShowDeleteDialog(false);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </ResponsiveDialog>
            <UpdateAgentDialog
                isOpen={showUpdateDialog}
                onOpenChange={setShowUpdateDialog}
                initialValue={agent}
            />
        </div>

    )

};

export const AgentsIdViewWithErrorHandling = () => {
    return (
        <ErrorState
            message="Failed to load agents"
            description="There was an issue loading the agents. Please try again later."
        />
    );
}

export const AgentsIdViewWithLoading = () => {
    return (
        <LoadingState
            message="Loading Agents"
            description="Please wait while we fetch the agents."
        />
    );
}