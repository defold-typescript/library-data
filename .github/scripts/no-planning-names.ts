export const PLANNING_NAMES = [
  "plan-step",
  "implement-step",
  "verify-step",
  "step-pipeline",
  "docs/prd/",
  "docs/impl/",
] as const;

const EXCLUDED_PATHS = [".gitignore", ".github/scripts/no-planning-names.ts"];
const LOCAL_SETTINGS = ".claude/settings.local.json";

function git(args: string[], cleanExits: number[] = [0]): { code: number; stdout: string } {
  const result = Bun.spawnSync(["git", ...args]);
  if (!cleanExits.includes(result.exitCode)) {
    throw new Error(`git ${args.join(" ")} exited ${result.exitCode}: ${result.stderr.toString()}`);
  }
  return { code: result.exitCode, stdout: result.stdout.toString() };
}

function namesIn(text: string): string[] {
  const lower = text.toLowerCase();
  return PLANNING_NAMES.filter((name) => lower.includes(name));
}

function scanContent(): string[] {
  const pathspec = [".", ...EXCLUDED_PATHS.map((path) => `:(exclude,literal)${path}`)];
  return PLANNING_NAMES.flatMap((name) => {
    // git grep exits 1 on no match, so only 2 or more is a failure.
    const { stdout } = git(
      ["grep", "--no-color", "--untracked", "-I", "-i", "-F", "-l", "-z", "-e", name, "--", ...pathspec],
      [0, 1],
    );
    return stdout
      .split("\0")
      .filter(Boolean)
      .map((path) => `content: ${path}: ${name}`);
  });
}

function scanPaths(): string[] {
  const paths = git(["ls-files", "-c", "-o", "--exclude-standard", "-z"]).stdout.split("\0").filter(Boolean);
  return paths
    .filter((path) => !EXCLUDED_PATHS.includes(path))
    .flatMap((path) => [
      ...namesIn(path).map((name) => `path: ${path}: ${name}`),
      ...(path === LOCAL_SETTINGS ? [`path: ${path}`] : []),
    ]);
}

function scanCommits(range: string): string[] {
  const fields = git(["log", "--format=%h%x00%B%x00", range]).stdout.split("\0");
  const offenders: string[] = [];
  for (let i = 0; i + 1 < fields.length; i += 2) {
    const sha = fields[i].trim();
    offenders.push(...namesIn(fields[i + 1]).map((name) => `commit ${sha}: ${name}`));
  }
  return offenders;
}

function scanPullRequest(): string[] {
  return (["PR_TITLE", "PR_BODY"] as const).flatMap((key) =>
    namesIn(process.env[key] ?? "").map((name) => `${key}: ${name}`),
  );
}

function parseRange(args: string[]): string | undefined {
  if (args.length === 0) return undefined;
  const [flag, range] = args;
  if (args.length !== 2 || flag !== "--range" || range.startsWith("-")) {
    throw new Error("usage: no-planning-names.ts [--range <a>..<b>]");
  }
  return range;
}

if (import.meta.main) {
  const range = parseRange(process.argv.slice(2));
  const offenders = [
    ...scanContent(),
    ...scanPaths(),
    ...(range === undefined ? [] : scanCommits(range)),
    ...scanPullRequest(),
  ];
  for (const offender of offenders) console.log(offender);
  if (offenders.length > 0) process.exitCode = 1;
}
