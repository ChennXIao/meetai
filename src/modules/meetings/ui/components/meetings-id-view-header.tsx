"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Breadcrumb, BreadcrumbLink, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRightIcon, TrashIcon,PencilIcon, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
}
    from "@radix-ui/react-dropdown-menu";

interface Props {
    meetingId: string,
    meetingName: string,
    onEdit: () => void,
    onRemove: () => void,
}

export const MeetingIdViewHeader = ({
    meetingId,
    meetingName,
    onEdit,
    onRemove,

}: Props) => {
    return (
        <div className="flex items-center justify-between">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/meetings" className="font-medium text-xl">
                            my meeting
                        </BreadcrumbLink>

                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4">
                        <ChevronRightIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/meetings/${meetingId}`} className="font-medium text-xl">
                            {meetingName}
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                </BreadcrumbList>

            </Breadcrumb>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <MoreVertical/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}>
                        <PencilIcon className="size-4 text-black" />
                            Edit
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={onRemove}>
                        <TrashIcon className="size-4 text-black" />
                            Remove
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>

        </div>
    )

};
