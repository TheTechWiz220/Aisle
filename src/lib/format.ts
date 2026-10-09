export function formatUsdc(n: number): string {
  const neg = n < 0;
  const atomic = Math.round(Math.abs(n) * 1_000_000);
  const fixed = (atomic / 1_000_000).toFixed(6);
  let body = fixed.replace(/0+$/, "").replace(/\.$/, "");
  if (!body.includes(".")) body += ".00";
  else if ((body.split(".")[1] ?? "").length === 1) body += "0";
  return `${neg ? "-" : ""}${body} USDC`;
}

export function shortAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function formatWhen(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
