"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";

export const AgentsListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <>
        <NewAgentDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        />
        <div className="py-4 px-6 md:px-8 border-b border-gray-200 dark:border-gray-700 ">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My agents</h5>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Agent
                </Button>
            </div>
        </div>
        </>
    );
};
