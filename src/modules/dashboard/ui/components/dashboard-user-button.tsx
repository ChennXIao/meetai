import { authClient } from "@/lib/auth-client";
import { GenerateAvatar } from "@/components/generate-avater";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
}
    from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDown, ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { ro } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export const DashboardUserButton = () => {
    const router = useRouter();
    const isMobile = useIsMobile();

    const { data, isPending } = authClient.useSession();

    if (isPending || !data?.user) {
        return null;
    }

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger>
                    {data.user.image ? (
                        <Avatar>
                            <AvatarImage src={data.user.image} alt={data.user.name} className="w-8 h-8 rounded-full" />
                        </Avatar>
                    ) : (
                        <GenerateAvatar
                            seed={data.user.name}
                            variant="initials"
                            className="size-9 mr-3"
                        />
                    )}
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-xs truncate w-full">
                            {data.user.name}
                        </p>
                        <p className="text-xs truncate w-full">
                            {data.user.email}
                        </p>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                </DrawerTrigger>
                <DrawerContent className="w-72">
                    <div className="p-4">
                        <div className="flex flex-col gap-1 mb-4">
                            <span className="font-medium truncate">
                                {data.user.name}
                            </span>
                            <span className="text-sm font-normal text-muted-foreground truncate">
                                {data.user.email}
                            </span>
                        </div>
                        <div className="h-px bg-border/50 mb-4" />
                        <div
                            onClick={() => {
                                router.push("/dashboard/billing");
                            }}
                            className="cursor-pointer flex items-center justify-between mb-4"
                        >
                            Billing
                            <CreditCardIcon className="ml-auto" />
                        </div>
                        <div
                            onClick={() => {
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push("/auth/sign-in");
                                        }
                                    }
                                });
                            }}
                            className="cursor-pointer flex items-center justify-between"
                        >
                            Log Out
                            <LogOutIcon className="ml-auto" />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }
    const onLogOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/sign-in");
                }
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
                {data.user.image ? (
                    <Avatar>
                        <AvatarImage src={data.user.image} alt={data.user.name} className="w-8 h-8 rounded-full" />
                    </Avatar>
                ) : (
                    <GenerateAvatar
                        seed={data.user.name}
                        variant="initials"
                        className="size-9 mr-3"
                    />
                )}
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-xs truncate w-full">
                        {data.user.name}
                    </p>
                    <p className="text-xs truncate w-full">
                        {data.user.email}
                    </p>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium truncate">
                            {data.user.name}
                        </span>
                        <span className="text-sm font-normal text-muted-foreground truncate">
                            {data.user.email}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer flex items-center justify-between"
                >
                    Billing
                    <CreditCardIcon className="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={onLogOut}
                    className="cursor-pointer flex items-center justify-between"
                >
                    Log Out
                    <LogOutIcon className="ml-auto" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
