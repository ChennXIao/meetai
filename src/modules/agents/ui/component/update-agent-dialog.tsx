import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../type";

interface UpdateAgentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    initialValue?: AgentGetOne;
}
export const UpdateAgentDialog = (
    { 
    isOpen, 
    onOpenChange,
    initialValue
}: UpdateAgentDialogProps) => {
    return (
        <ResponsiveDialog 
        open={isOpen} 
        onOpenChange ={onOpenChange}
        title="Update Agent"
        description="Update the agent's information."
        >
            <AgentForm 
                onSuccess={() => onOpenChange(false)} 
                onCancel={() => onOpenChange(false)}
                initialValue={initialValue}
            />
        </ResponsiveDialog>
    );
};
