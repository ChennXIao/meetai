import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}
export const NewAgentDialog = (
    { 
    isOpen, 
    onOpenChange 
}: NewAgentDialogProps) => {
    return (
        <ResponsiveDialog 
        open={isOpen} 
        onOpenChange ={onOpenChange}
        title="Create New Agent"
        description="Create a new agent to assist you with tasks."
        >
            <AgentForm 
                onSuccess={() => onOpenChange(false)} 
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    );
};
