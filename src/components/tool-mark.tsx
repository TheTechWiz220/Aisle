import { cn } from "@/lib/utils";

export function ToolMark({
  mark,
  className,
}: {
  mark: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-md bg-surface-2 font-serif text-lg italic text-fg shadow-[0_0_0_1px_var(--color-border)]",
        className,
      )}
      aria-hidden="true"
    >
      {mark}
    </div>
  );
}
