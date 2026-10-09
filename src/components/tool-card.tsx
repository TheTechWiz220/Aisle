import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { categoryLabel, type Tool, pricingLine } from "@/lib/catalog";
import { formatCompact, formatUsdc } from "@/lib/format";
import { useInstalled } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToolMark } from "@/components/tool-mark";
import { PayDialog } from "@/components/pay-dialog";

export function ToolCard({ tool, reason }: { tool: Tool; reason?: string }) {
  const installed = useInstalled(tool.id);
  const [pay, setPay] = useState(false);

  return (
    <article className="group flex flex-col rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]">
      <Link
        to="/tools/$toolId"
        params={{ toolId: tool.id }}
        className="flex flex-1 flex-col text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <ToolMark mark={tool.mark} />
          <div className="flex items-center gap-1.5">
            {tool.isNew ? <Badge variant="accent">New</Badge> : null}
            {installed ? <Badge variant="success">Installed</Badge> : null}
          </div>
        </div>
        <h3 className="mt-4 font-serif text-xl italic leading-snug text-fg">{tool.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-normal text-muted">{tool.tagline}</p>
        {reason ? (
          <p className="mt-2 text-sm leading-normal text-fg/80">{reason}</p>
        ) : null}
        <div className="mt-4 flex items-center gap-3 text-xs text-subtle">
          <span>{categoryLabel(tool.category)}</span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Star className="size-3 fill-current" />
            {tool.rating.toFixed(1)}
          </span>
          <span className="tabular-nums">{formatCompact(tool.installs)}</span>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-xs tabular-nums text-fg">{pricingLine(tool.pricing)}</p>
          <p className="text-xs text-subtle">
            {tool.installPrice === 0 ? "Free to install" : `Install ${formatUsdc(tool.installPrice)}`}
          </p>
        </div>
        {installed ? (
          <Button asChild size="sm" variant="secondary">
            <Link to="/installed">Open</Link>
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setPay(true);
            }}
          >
            {tool.installPrice === 0 ? "Install" : "Pay"}
          </Button>
        )}
      </div>

      <PayDialog tool={tool} open={pay} onOpenChange={setPay} />
    </article>
  );
}
