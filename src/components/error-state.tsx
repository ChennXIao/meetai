import { AlertCircleIcon } from "lucide-react";

interface ErrorStateProps {
    message?: string;
    description?: string;
}

export const ErrorState = ({ message = "Error occurred", description }: ErrorStateProps) => {
    return (
        <div className="py-4 px-8 flex flex-col flex-1 items-center justify-center">
            <div className="flex flex-col gap-y-6 items-center justify-center bg-background rounded-lg shadow-md p-10">
                <AlertCircleIcon className="h-6 w-6 mb-2 text-red-500" />
                <div className="flex flex-col gap-y-2 text-center">
                    <p className="text-lg font-medium">{message}</p>
                    {description && <p className="text-xs text-gray-500">{description}</p>}
                </div>
            </div>
        </div>
    );
};