import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Layers, Store, Terminal, Wallet } from "lucide-react";
import { formatUsdc, shortAddress } from "@/lib/format";
import { spendableOf, useAisleStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const markHydrated = useAisleStore((s) => s.markHydrated);
  const hydrated = useAisleStore((s) => s.hydrated);
  const address = useAisleStore((s) => s.address);
  const liquid = useAisleStore((s) => s.liquid);
  const channel = useAisleStore((s) => s.channel);
  const purse = spendableOf(liquid, channel);
  const installedCount = useAisleStore((s) => s.installed.length);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const result = useAisleStore.persist.rehydrate();
    void Promise.resolve(result).then(() => markHydrated());
  }, [markHydrated]);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:h-16 md:px-6">
          <Link to="/" className="flex items-baseline gap-2 shrink-0">
            <span className="font-serif text-2xl italic leading-none text-fg">Aisle</span>
            <span className="hidden text-xs tracking-wide text-subtle sm:inline">
              for agents
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            <NavLink to="/" active={pathname === "/"}>
              Store
            </NavLink>
            <NavLink to="/run" active={pathname.startsWith("/run")}>
              Run
            </NavLink>
            <NavLink to="/installed" active={pathname.startsWith("/installed")}>
              Installed
              {installedCount > 0 ? (
                <span className="ml-1.5 tabular-nums text-subtle">{installedCount}</span>
              ) : null}
            </NavLink>
            <NavLink to="/protocol" active={pathname.startsWith("/protocol")}>
              Protocol
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden font-mono text-xs text-subtle lg:inline">
              {address ? shortAddress(address) : ""}
            </span>
            <Link
              to="/wallet"
              className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm text-fg shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow,background-color] duration-150 hover:bg-surface-2"
            >
              <Wallet className="size-4 text-muted" />
              <span className="hidden text-xs text-subtle sm:inline">
                {purse.kind === "channel" ? "channel" : "liquid"}
              </span>
              <span className="tabular-nums">{hydrated ? formatUsdc(purse.amount) : "—"}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 md:px-6 md:pb-16">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-sm md:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-4">
          <TabLink to="/" icon={Store} label="Store" active={pathname === "/"} />
          <TabLink to="/run" icon={Terminal} label="Run" active={pathname.startsWith("/run")} />
          <TabLink
            to="/installed"
            icon={Layers}
            label="Installed"
            active={pathname.startsWith("/installed")}
            badge={installedCount}
          />
          <TabLink
            to="/wallet"
            icon={Wallet}
            label="Wallet"
            active={pathname.startsWith("/wallet")}
          />
        </div>
      </nav>
    </div>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: "/" | "/installed" | "/protocol" | "/wallet" | "/run";
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors duration-150",
        active ? "text-fg" : "text-muted hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

function TabLink({
  to,
  icon: Icon,
  label,
  active,
  badge,
}: {
  to: "/" | "/installed" | "/wallet" | "/protocol" | "/run";
  icon: typeof Store;
  label: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "relative flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs tracking-wide",
        active ? "text-fg" : "text-muted",
      )}
    >
      <Icon className="size-5" />
      <span>{label}</span>
      {badge ? (
        <span className="absolute top-1 right-1/2 translate-x-5 rounded-full bg-accent px-1.5 text-xs tabular-nums text-accent-fg">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
