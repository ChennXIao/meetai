"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, X, XCircleIcon, XIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { AgentsSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";
import { is } from "drizzle-orm";

export const AgentsListHeader = () => {
    const [filter, setFilter] = useAgentsFilters();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isAnyFilterModified = !!filter.search;
    const onClearFilters = () => {
        setFilter({ search: "", page: DEFAULT_PAGE });
    }

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
            <div className="px-6 md:px-8 py-4 flex items-center">
                <AgentsSearchFilter />
                {isAnyFilterModified && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={onClearFilters}
                    >
                        <XCircleIcon className=" h-2 w-2" />
                        Clear
                    </Button>
                )}
            </div>
        </>
    );
};
