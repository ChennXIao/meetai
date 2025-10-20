import { EmptyState } from "@/components/empty-state";


export const CancelState = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <EmptyState
                message="Meeting is Canceled"
                description="You can no longer join the meeting."
                image="/cancelled.svg"
            />
            </div>

    );
};

