import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "../../hooks/use-meeting-filters";

export const MeetingsSearchFilter = () => {
  const [filter, setFilter] = useMeetingsFilters();
  return (
    <div className="relative">
      <Input
        value={filter.search}
        placeholder="Filter meetings by name"
        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        className="h-9 bg-white w-[200px] pl-7"
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};