"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft, PanelLeftCloseIcon, PanelLeftIcon, Search, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    
    return (
        <>
            <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
            <nav className="flex gap-x-2 items-center px-4 py-3 bg-background border-b">
                <Button className="size-9" variant={"outline"} onClick={toggleSidebar}>
                    {(state === "collapsed" || isMobile)
                        ? <PanelLeftIcon />
                        : <PanelLeftCloseIcon />
                    }
                </Button>
                <Button
                    variant="outline"
                    className="h-9 w-[240px] justify-start font-normal text-sm text-muted-foreground
                hover:text-muted-foreground"
                    size="sm"
                    onClick={() => setCommandOpen((open) => !open)}
                >
                    <SearchIcon className="mr-2" />
                    Search...
                    <kbd className="ml-auto">
                        <kbd className="font-mono text-xs text-muted-foreground">⌘</kbd>
                    </kbd>
                </Button>
            </nav>
        </>
    );
};
