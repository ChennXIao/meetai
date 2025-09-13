import Image from "next/image";

interface EmptyStateProps {
    message?: string;
    description?: string;
}

export const EmptyState = ({ message = "No data available", description }: EmptyStateProps) => {
    return (
        <div className="py-4 px-8 flex flex-col flex-1 items-center justify-center">
            <Image src="/empty.svg" alt="Empty State" width={240} height={240} className="mb-4" />
            <div className="flex flex-col gap-y-6 items-center justify-center bg-background rounded-lg shadow-md p-10">
                <div className="flex flex-col gap-y-2 text-center">
                    <p className="text-lg font-medium">{message}</p>
                    {description && <p className="text-xs text-gray-500">{description}</p>}
                </div>
            </div>
        </div>
    );
};