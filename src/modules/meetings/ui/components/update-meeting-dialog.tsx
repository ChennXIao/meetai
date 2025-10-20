import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../type";

interface UpdateMeetingDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialValue?: MeetingGetOne;
}
export const UpdateMeetingDialog = (
    { 
    isOpen, 
    onOpenChange,
    initialValue
}: UpdateMeetingDialogProps) => {
    return (
        <ResponsiveDialog 
        open={isOpen} 
        onOpenChange ={onOpenChange}
        title="Update Meeting"
        description="Update the meeting's information."
        >
            <MeetingForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValue={initialValue}
            />
        </ResponsiveDialog>
    );
};
