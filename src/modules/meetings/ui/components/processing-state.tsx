import { EmptyState } from "@/components/empty-state";


export const ProcessingState = () => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center">
            <EmptyState
                message="Meeting is Processing"
                description="Summary will be processed soon."
                image="/processing.svg"
            />
            </div>

    );
};

