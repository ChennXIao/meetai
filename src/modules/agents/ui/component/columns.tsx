"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetOne } from "../../type"
import { GenerateAvatar } from "@/components/generate-avater"
import { Badge } from "@/components/ui/badge"
import { VideoIcon, CornerDownRightIcon } from "lucide-react" 

export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2"
        >
            <GenerateAvatar
                seed={row.original.name}
                variant="botttsNeutral"
                className="size-6"
            />
          <span className="font-semibold capitalize">{row.original.name}</span>
        </div>
         <div className="flex items-center text-xs text-muted-foreground">
            <CornerDownRightIcon className="inline mr-1 h-4 w-4" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                {row.original.instructions}
            </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meeting",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-x-2 [&>svg]:size-4">
        <VideoIcon className="text-blue-700" />
        {row.original.meetingCount} {row.original.meetingCount !== 1 ? "meeting" : "meetings"}
      </Badge>
    ),
  },

]