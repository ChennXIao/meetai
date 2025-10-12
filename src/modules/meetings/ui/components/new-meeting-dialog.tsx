import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";

interface NewMeetingDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}
export const NewMeetingDialog = (
    {
        isOpen,
        onOpenChange
    }: NewMeetingDialogProps) => {
        const router = useRouter();
    return (
        <ResponsiveDialog
            open={isOpen}
            onOpenChange={onOpenChange}
            title="Create New Meeting"
            description="Create a new meeting to discuss important topics."
        >
            <MeetingForm
                onSuccess={(id) => {
                    onOpenChange(false);
                    router.push(`/meetings/${id}`);
                }}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    );
};
