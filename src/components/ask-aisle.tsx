import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { getTool } from "@/lib/catalog";
import { recommendTools, type ToolPick } from "@/lib/recommend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ToolCard } from "@/components/tool-card";

export function AskAisle() {
  const recommend = useServerFn(recommendTools);
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picks, setPicks] = useState<ToolPick[] | null>(null);
  const [source, setSource] = useState<"model" | "index" | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = task.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    try {
      const result = await recommend({ data: { task: trimmed } });
      if (!result.ok) {
        setError(result.error);
        setPicks(null);
      } else {
        setPicks(result.picks);
        setSource(result.source);
      }
    } catch {
      setError("Could not reach Aisle. Try the catalog search.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setPicks(null);
          setError(null);
          setSource(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" className="h-12">
          Describe a job
          <ArrowRight className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Describe a job</DialogTitle>
          <DialogDescription>
            Aisle matches the task to tools in the catalog. Pay only if you install — or send an agent to shop and run.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <Textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Scrape a careers page, extract salaries, and email a digest."
            maxLength={500}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-subtle">
              {source === "model"
                ? "Matched by model."
                : source === "index"
                  ? "Matched from the catalog index."
                  : "One request. Nothing is charged to describe."}
            </p>
            <Button type="submit" disabled={busy || task.trim().length === 0}>
              {busy ? "Matching…" : "Find tools"}
            </Button>
          </div>
        </form>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        {picks && picks.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {picks.map((p) => {
              const tool = getTool(p.id);
              if (!tool) return null;
              return <ToolCard key={p.id} tool={tool} reason={p.reason} />;
            })}
            <Button asChild variant="secondary" className="w-full">
              <Link
                to="/run"
                search={{ task: task.trim() }}
                onClick={() => setOpen(false)}
              >
                Let an agent run this
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
