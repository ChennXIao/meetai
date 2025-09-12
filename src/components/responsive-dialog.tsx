import { useIsMobile } from "@/hooks/use-mobile";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
    DrawerDescription,
} from "@/components/ui/drawer";



interface ResponsiveDialogProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ResponsiveDialog = ({
    title,
    description,
    children,
    open,
    onOpenChange,
}: ResponsiveDialogProps) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        {title && <DrawerTitle>{title}</DrawerTitle>}
                        <DrawerDescription>{description}</DrawerDescription>
                        <DrawerClose />
                    </DrawerHeader>
                    <div className="p-4">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    {title && <DialogTitle>{title}</DialogTitle>}
                    <DialogDescription>{description}</DialogDescription>
                    <DialogClose />
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}; 