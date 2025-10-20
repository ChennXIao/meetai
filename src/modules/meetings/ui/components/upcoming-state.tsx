import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
interface UpcomingStateProps {
    meetingId: string,
    onCancelMeeting: () => void,
    isCanceled: boolean
}

export const UpcomingState = ({ meetingId, onCancelMeeting, isCanceled }: UpcomingStateProps) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <EmptyState
                message="No upcoming meetings"
                description="There are no upcoming meetings scheduled."
                image="/upcoming.svg"
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full" >
                <Button variant="secondary" className="w-full lg:w-auto" onClick={onCancelMeeting} disabled={isCanceled}>

                    <BanIcon />
                    Cancel meeting
                </Button>
                {/* not knowing asChild works here */}
                <Button asChild className="w-full lg:w-auto" disabled={isCanceled}>
                    <Link href={`/call/${meetingId}`}>
                        Schedule a Meeting
                        <VideoIcon />

                    </Link>

                </Button>
            </div>
        </div>



    );
};


