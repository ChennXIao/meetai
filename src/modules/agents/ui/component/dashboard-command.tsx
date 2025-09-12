import { Dispatch,SetStateAction } from "react";    

import {
    CommandResponsiveDialog,
    CommandInput,
    CommandList,
    CommandItem, 
} from "@/components/ui/command";

interface DashboardCommandProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
    return (
        <CommandResponsiveDialog
            open={open}
            onOpenChange={setOpen}
        >
            <CommandInput placeholder="Find a meeting or agent" />
            <CommandList>
                <CommandItem onSelect={() => setOpen(false)}>
                    New Chat
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                    New Agent
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                    Settings
                </CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    );
};