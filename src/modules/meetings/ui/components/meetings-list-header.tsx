"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, X, XCircleIcon, XIcon } from "lucide-react";

import { useState } from "react";
import { DEFAULT_PAGE } from "@/constants";
import { is } from "drizzle-orm";
import { NewMeetingDialog } from "./new-meeting-dialog";

export const MeetingsListHeader = () => {
    // const [filter, setFilter] = useAgentsFilters();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
        <NewMeetingDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        /> 
            <div className="py-4 px-6 md:px-8 border-b border-gray-200 dark:border-gray-700 ">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My meetings</h5>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create meetings
                    </Button>
                </div>
            </div>
            <div className="px-6 md:px-8 py-4 flex items-center">
            </div>
        </>
    );
};
