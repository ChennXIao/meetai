import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../type";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import{
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GenerateAvatar } from "@/components/generate-avater";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialValue?: AgentGetOne;
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValue
}: AgentFormProps) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: () => {
                // invalidation isssue to be refresh 5:25:00
                queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                if (initialValue?.id) {
                    trpc.agents.getOne.queryOptions({ id: initialValue.id });
                }         
            },
            onError: (error) => {
                toast.error(`Failed to create agent: ${error.message}`);
            }
        }),
    );

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: initialValue ?? {
            name: "",
            instructions: "",
        },
    });

    // not sure what isEdit and isPending used for
    const isEdit = !!initialValue;
    const isPending = createAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            console.log("Edit mode is not implemented yet");
        } else {
            createAgent.mutate(values);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <GenerateAvatar 
                    seed={form.watch("name")} 
                    variant="botttsNeutral"
                    className="mx-auto" 
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Agent Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Agent Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Instructions for the agent" 
                                    className="resize-none" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button 
                        variant="ghost" 
                        onClick={onCancel} 
                        disabled={isPending}
                        type="button"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isEdit ? "Updata" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

