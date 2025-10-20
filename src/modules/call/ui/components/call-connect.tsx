import { useTRPC } from "@/trpc/client";
import {
    Call,
    CallingState,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
}
    from "@stream-io/video-react-sdk";

import { Loader2Icon, LoaderIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { CallUI } from "./call-ui";

interface CallConnectProps {
    meetingId: string;
    userId: string;
    meetingName: string;
    userName: string;
    userImage: string;
}

export const CallConnect = ({ meetingId, userId, meetingName, userName, userImage }: CallConnectProps) => {
    const trpc = useTRPC();
    const { mutateAsync: generateToken } = useMutation(
        trpc.meetings.generateToken.mutationOptions()
    );
    const [client, setClient] = useState<StreamVideoClient>();

    useEffect(() => {
        const _client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_VIDEO_STREAM_API_KEY || "EFEF",
            user: {
                id: userId,
                name: userName,
                image: userImage,
            },
            tokenProvider: generateToken,
        });
        setClient(_client);

        return () => {
            _client.disconnectUser();
            setClient(undefined);
        };
    }, [userId, userName, userImage, generateToken]);

    const [call, setCall] = useState<Call>();
    useEffect(() => {
        if (!client) return;

        const _call = client.call("default", meetingId);
        _call.camera.disable();
        _call.microphone.enable();
        setCall(_call);
        return () => {
            if (_call.state.callingState !== CallingState.LEFT) {
                _call.leave();
                _call.endCall();
                setCall(undefined);
            }
        };
    }, [client, meetingId]);
    if (!client || !call) {
        return (
            <div className="flex h-screen items-center bg-radial from-sidebar-accent-to-sidebar-accent-b via-transparent to-transparent justify-center">
                <Loader2Icon className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>


                    <CallUI meetingName={meetingName} />

            </StreamCall>
        </StreamVideo>

    );
}

