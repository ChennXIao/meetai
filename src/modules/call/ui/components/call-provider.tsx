"use client";
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { CallConnect } from "./call-connect";

interface CallProviderProps {
    meetingId: string;
    meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: CallProviderProps) => {
    const { data, isPending } = authClient.useSession();

    if (!data || isPending) {
        return (
            <div className="flex h-screen items-center bg-radial from-sidebar-accent-to-sidebar-accent-b via-transparent to-transparent justify-center">
                <Loader2Icon className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (!data?.user) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
                <p className="text-center text-lg">You must be logged in to join the call.</p>
                <a
                    href="/login"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Go to Login
                </a>
            </div>
        );
    }

    return (
        <CallConnect
            meetingId={meetingId}
            userId={data.user.id}
            meetingName={meetingName}
            userName={data.user.name}
            userImage={
                data.user.image ?? 
                generateAvatarUri(
                    { 
                        seed: data.user.name ?? "User", 
                        variant: "initials" 
                    }
                )}
        />
    );
};