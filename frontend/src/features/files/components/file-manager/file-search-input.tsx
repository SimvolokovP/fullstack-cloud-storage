import { useEffect, useRef } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { Kbd } from "@/shared/ui/kbd";
import { Search, X } from "lucide-react";

interface FileSearchInputProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function FileSearchInput({
  search,
  onSearchChange,
}: FileSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "q") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative max-w-md">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>

        {search ? (
          <InputGroupAddon align="inline-end" className="p-0">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center h-full px-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Очистить поиск"
            >
              <X className="h-4 w-4" />
            </button>
          </InputGroupAddon>
        ) : (
          <InputGroupAddon align="inline-end">
            <Kbd>⌘</Kbd>
            <Kbd>Q</Kbd>
          </InputGroupAddon>
        )}

        <InputGroupInput
          ref={inputRef}
          type="text"
          placeholder="Поиск файлов и папок..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </InputGroup>
    </div>
  );
}
