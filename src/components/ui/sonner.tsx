import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-surface text-fg border-border shadow-[0_0_0_1px_var(--color-border)]",
          description: "text-muted",
          actionButton: "bg-accent text-accent-fg",
          cancelButton: "bg-surface-2 text-fg",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
