import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
interface ActiveStateProps {
    meetingId: string,
}

export const ActiveState = ({ meetingId }: ActiveStateProps) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <EmptyState
                message="Meeting is Active"
                description="You can join the meeting by clicking the button below."
                image="/upcoming.svg"
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full" >
                {/* not knowing asChild works here */}
                <Button asChild className="w-full lg:w-auto" >
                    <Link href={`/call/${meetingId}`}>
                        Join Meeting
                        <VideoIcon />

                    </Link>

                </Button>
            </div>
        </div>



    );
};


