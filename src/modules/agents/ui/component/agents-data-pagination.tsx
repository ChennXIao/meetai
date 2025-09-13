import { Button } from "@/components/ui/button";

interface Props{
    page: number;
    totalPage : number;
    onPageChange: (page: number) => void;
}

export const Datapagination = ({
    page,
    totalPage,
    onPageChange,
}: Props) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {page} of {totalPage}
            </div>
            <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                disabled={page === totalPage}
                onClick={() => onPageChange(Math.min(totalPage, page + 1))}
            >
                Next
            </Button>
        </div>
    );
};
