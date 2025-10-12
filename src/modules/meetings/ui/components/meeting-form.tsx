import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { meetingsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
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
import { toast } from "sonner";
import { MeetingGetOne } from "../../type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GenerateAvatar } from "@/components/generate-avater";

interface MeetingFormProps {
    onSuccess: (id: string) => void;
    onCancel: () => void;
    initialValue?: MeetingGetOne;
}
// TODO: search meeting and if agent not found, show create agent link
export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValue
}: MeetingFormProps) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({ search: search, pageSize: 100 })
    );

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: (data) => {
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                if (initialValue?.id) {
                    trpc.meetings.getOne.queryOptions({ id: initialValue.id });
                }
                onSuccess(data.id);
            },
            onError: (error) => {
                toast.error(`Failed to create meeting: ${error.message}`);
            }
        }),
    );
    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: () => {
                // invalidation isssue to be refresh 5:25:00
                // fix render issue after update from getMany to getOne(update/delete vid)
                queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: initialValue!.id }));
                if (initialValue?.id) {
                    trpc.meetings.getOne.queryOptions({ id: initialValue.id });
                }
            },
            onError: (error) => {
                toast.error(`Failed to update meeting: ${error.message}`);
            }
        }),
    );

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: initialValue ?? {
            name: "",
            agentId: "",
        },
    });

    // not sure what isEdit and isPending used for
    const isEdit = !!initialValue;
    const isPending = createMeeting.isPending || updateMeeting.isPending;
    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            updateMeeting.mutate({
                id: initialValue!.id,
                ...values
            });
        } else {
            createMeeting.mutate(values);
        }
    }

    return (

        <Form {...form}>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Meeting name"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="agentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Agent Name</FormLabel>
                            <FormControl>
                                <CommandSelect
                                    open={open} // 你原本有的 open state
                                    setOpen={setOpen}
                                    placeholder="Select an agent"
                                    value={field.value}
                                    onValueChange={field.onChange} // name 與元件一致
                                    isLoading={agents.isLoading}
                                    onInputChange={(value) => setSearch(value)}
                                    isSearchable={true}
                                    options={
                                        agents.data?.items.map((agent) => ({
                                            id: agent.id,
                                            value: agent.id,
                                            label: (
                                                <div className="flex items-center gap-x-2">
                                                    <GenerateAvatar seed={agent.name} variant="botttsNeutral" className="border size-6" />
                                                    <span className="truncate">{agent.name}</span>
                                                </div>
                                            ),
                                        })) || []
                                    }
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
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

