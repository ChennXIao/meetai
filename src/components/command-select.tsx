// CommandSelect.tsx
import React from "react";
import { ReactNode } from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Option {
  id?: string;
  value: string;
  label?: ReactNode; // 用於顯示的內容
}

interface CommandSelectProps {
  options: Option[];
  value: string; // 當前值（value）
  onValueChange: (value: string) => void; // 當選擇/變動值時呼叫
  onSelect?: (value: string) => void; // 額外的 select callback（可選）
  onInputChange?: (value: string) => void; // 搜尋輸入變動
  placeholder?: string;
  className?: string;
  isSearchable?: boolean;
  isLoading?: boolean;
  open?: boolean; // 外部可控 open
  setOpen?: (open: boolean) => void; // 外部控制 open 的 setter
}

export const CommandSelect: React.FC<CommandSelectProps> = ({
  options,
  value,
  onValueChange,
  onSelect,
  onInputChange,
  placeholder,
  className,
  isSearchable = false,
  isLoading = false,
  open,
  setOpen,
}) => {
  // 如果沒有外部 open control，就在內部管理
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlledOpen = typeof open === "boolean" && typeof setOpen === "function";
  const actualOpen = isControlledOpen ? open! : internalOpen;
  const setActualOpen = (v: boolean) => {
    if (isControlledOpen) setOpen!(v);
    else setInternalOpen(v);
  };

  const selectedOption = options.find((o) => o.value === value);

  const handleSelect = (v: string) => {
    onValueChange(v);
    if (onSelect) onSelect(v);
    setActualOpen(false);
  };

  return (
    <Popover open={actualOpen} onOpenChange={setActualOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label ?? selectedOption.value : placeholder ?? "Select..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[260px] p-0">
        <Command>
          {isSearchable && (
            <CommandInput
              placeholder="Type to search..."
              onValueChange={(txt) => {
                if (onInputChange) onInputChange(txt);
              }}
            />
          )}

          <CommandList>
            {/* Loading 狀態顯示（可依 UI library 改） */}
            {isLoading ? (
              <div className="p-3 text-sm">Loading...</div>
            ) : (
              <>
                <CommandEmpty>
                  No results found.
                  <div>
                    <button
                      className="mt-2 text-blue-600 underline"
                      onClick={() => {
                        // 建立新項目的特別行為（使用者可以用 "create" 或其他語意）
                        handleSelect("create");
                      }}
                    >
                      Create new agent
                    </button>
                  </div>
                </CommandEmpty>

                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.id ?? opt.value}
                      onSelect={() => handleSelect(opt.value)}
                      className="text-sm"
                    >
                      {opt.label ?? opt.value}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CommandSelect;
