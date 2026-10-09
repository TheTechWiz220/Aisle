export const DEMO_JOBS = [
  {
    id: "10k",
    label: "10-K research",
    task: "Search the web for Harbor Systems latest 10-K and cite sources.",
  },
  {
    id: "jobs",
    label: "Careers extract",
    task: "Crawl a careers site and extract structured job listings with salary.",
  },
  {
    id: "invoice",
    label: "Invoice to AP",
    task: "Parse an invoice PDF and email the total to AP.",
  },
  {
    id: "login",
    label: "Headed login",
    task: "Open a headed browser session and fill a login form.",
  },
  {
    id: "jail",
    label: "Untrusted code",
    task: "Run untrusted python in a sandbox with no network.",
  },
] as const;
