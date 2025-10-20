

import { LogInIcon } from "lucide-react";
import Link from "next/link";

import {
    DefaultVideoPlaceholder,
    StreamVideoParticipant,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,

    VideoPreview,
}
    from "@stream-io/video-react-sdk";
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { Button } from "@/components/ui/button";



interface CallLobbyProps {
    onJoin: () => void;
}

const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();
    return (
        <DefaultVideoPlaceholder
            participant={
                {
                    image:
                        data?.user?.image ??
                        generateAvatarUri({ seed: data?.user?.name ?? "User", variant: "initials" }),

                    name: data?.user?.name ?? "",
                } as StreamVideoParticipant
            }


        />
    );
};

const AllowedPermission = () => {
    return (
        <p>
            Please enable camera and microphone to join the call.
        </p>
    );

};
export const CallLobby = ({ onJoin }: CallLobbyProps) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();
    const { hasBrowserPermission: microphone } = useMicrophoneState();
    const { hasBrowserPermission: camera } = useCameraState();
    const hasBothPermissions = microphone && camera;

    return (
        <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-1g p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-lg font-medium">Ready to join?</h6>
                        <p className="text-sm">Set up your call before joining</p>
                    </div>
                    <VideoPreview
                        DisabledVideoPreview={
                            hasBothPermissions
                                ? DisabledVideoPreview
                                : AllowedPermission
                        }
                    />
                    <div className="flex gap-x-2">
                        <ToggleAudioPreviewButton />
                        <ToggleVideoPreviewButton />

                    </div>
                    <div className="flex gap-x-2 justify-between w-full">
                        <Button asChild variant="ghost">
                            <Link href="/meetings">
                                Cancel

                            </Link>
                        </Button>
                        <Button
                            onClick={onJoin}
                        >
                            <LogInIcon />
                            Join Call
                        </Button>


                    </div>
                </div>
            </div>
        </div>
    );
};