import { afterEach, beforeEach, describe, expect, setDefaultTimeout, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { PLANNING_NAMES } from "./no-planning-names";

setDefaultTimeout(30_000);

const SCRIPT = join(import.meta.dir, "no-planning-names.ts");
const SCRIPT_IN_REPO = ".github/scripts/no-planning-names.ts";
const NAME = PLANNING_NAMES[0];

let repo: string;

function childEnv(extra: Record<string, string> = {}): Record<string, string> {
  const env: Record<string, string> = { ...process.env, ...extra } as Record<string, string>;
  for (const key of ["GIT_DIR", "GIT_INDEX_FILE", "GIT_WORK_TREE"]) delete env[key];
  for (const key of ["PR_TITLE", "PR_BODY"]) if (!(key in extra)) delete env[key];
  return env;
}

function git(...args: string[]): void {
  const result = Bun.spawnSync(
    ["git", "-c", "user.name=test", "-c", "user.email=test@example.invalid", "-c", "commit.gpgsign=false", ...args],
    { cwd: repo, env: childEnv() },
  );
  if (result.exitCode !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr.toString()}`);
}

function write(path: string, content: string | Uint8Array): void {
  const full = join(repo, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
}

function track(path: string, content: string | Uint8Array): void {
  write(path, content);
  git("add", "--force", "--", path);
}

function commit(...messages: string[]): void {
  git("commit", "--allow-empty", ...messages.flatMap((message) => ["-m", message]));
}

function run(args: string[] = [], env: Record<string, string> = {}, cwd = repo) {
  const result = Bun.spawnSync(["bun", SCRIPT, ...args], { cwd, env: childEnv(env) });
  return { code: result.exitCode, output: result.stdout.toString() + result.stderr.toString() };
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), "no-planning-names-"));
  git("init", "--quiet");
});

afterEach(() => {
  rmSync(repo, { recursive: true, force: true });
});

describe("content", () => {
  test("a clean tree exits 0 with no output", () => {
    track("notes.txt", "nothing to see\n");
    expect(run()).toEqual({ code: 0, output: "" });
  });

  test.each([...PLANNING_NAMES])("a tracked file holding %s reports the file and the name", (name) => {
    track("notes.txt", `see ${name} for details\n`);
    const { code, output } = run();
    expect(code).toBe(1);
    expect(output).toContain("notes.txt");
    expect(output).toContain(name);
  });

  test("a name in another case exits 1", () => {
    track("notes.txt", `see ${NAME.toUpperCase()} for details\n`);
    expect(run().code).toBe(1);
  });

  test("every offender is reported before exiting", () => {
    track("first.txt", `${PLANNING_NAMES[0]}\n`);
    track("second.txt", `${PLANNING_NAMES[1]}\n`);
    const { code, output } = run();
    expect(code).toBe(1);
    expect(output).toContain("first.txt");
    expect(output).toContain("second.txt");
  });

  test("an untracked file that is not ignored exits 1", () => {
    write("notes.txt", `${NAME}\n`);
    expect(run().code).toBe(1);
  });

  test("an ignored file holding a name exits 0", () => {
    track(".gitignore", "secret.txt\n");
    write("secret.txt", `${NAME}\n`);
    expect(run()).toEqual({ code: 0, output: "" });
  });

  test("the ignore file and the script holding every name exit 0", () => {
    const all = `${PLANNING_NAMES.join("\n")}\n`;
    track(".gitignore", all);
    track(SCRIPT_IN_REPO, all);
    expect(run()).toEqual({ code: 0, output: "" });
  });

  test("a file beside the script holding a name exits 1", () => {
    track(".github/scripts/other.ts", `${NAME}\n`);
    expect(run().code).toBe(1);
  });

  test("an ignore file in a subfolder holding a name exits 1", () => {
    track("sub/.gitignore", `${NAME}\n`);
    expect(run().code).toBe(1);
  });

  test("a binary file holding a name exits 0", () => {
    track("data.bin", new Uint8Array([0, ...new TextEncoder().encode(NAME), 0]));
    expect(run()).toEqual({ code: 0, output: "" });
  });
});

describe("paths", () => {
  test.each([...PLANNING_NAMES])("a clean file whose path holds %s exits 1 on its path", (name) => {
    const path = name.endsWith("/") ? `${name}a.md` : `${name}-notes.txt`;
    track(path, "clean\n");
    const { code, output } = run();
    expect(code).toBe(1);
    expect(output).toContain(path);
  });

  test("a path holding a name in another case exits 1", () => {
    track(`${NAME.toUpperCase()}.txt`, "clean\n");
    expect(run().code).toBe(1);
  });

  test("a tracked local settings file exits 1 on its path", () => {
    track(".claude/settings.local.json", "{}\n");
    const { code, output } = run();
    expect(code).toBe(1);
    expect(output).toContain(".claude/settings.local.json");
  });

  test("an untracked file whose path holds a name exits 1", () => {
    write(`${NAME}.txt`, "clean\n");
    expect(run().code).toBe(1);
  });
});

describe("text", () => {
  test("a commit message inside the range exits 1 and names the name", () => {
    commit("base");
    git("tag", "base");
    commit("clean subject", `see ${NAME}`);
    const { code, output } = run(["--range", "base..HEAD"]);
    expect(code).toBe(1);
    expect(output).toContain(NAME);
  });

  test("a commit message outside the range exits 0", () => {
    commit("clean subject", `see ${NAME}`);
    git("tag", "base");
    commit("later");
    expect(run(["--range", "base..HEAD"])).toEqual({ code: 0, output: "" });
  });

  test("a commit message is not read without a range", () => {
    commit("clean subject", `see ${NAME}`);
    expect(run()).toEqual({ code: 0, output: "" });
  });

  test.each(["PR_TITLE", "PR_BODY"])("%s holding a name exits 1 and says which", (key) => {
    const { code, output } = run([], { [key]: `see ${NAME}` });
    expect(code).toBe(1);
    expect(output).toContain(key);
    expect(output).toContain(NAME);
  });

  test("clean pull request text exits 0", () => {
    expect(run([], { PR_TITLE: "bump a library", PR_BODY: "nothing here" })).toEqual({ code: 0, output: "" });
  });
});

describe("failures are never clean", () => {
  test("an unknown range does not exit 0", () => {
    commit("base");
    expect(run(["--range", "nope..HEAD"]).code).not.toBe(0);
  });

  test("--range with no value does not exit 0", () => {
    expect(run(["--range"]).code).not.toBe(0);
  });

  test("a misspelled flag does not exit 0", () => {
    commit("base");
    expect(run(["--rnage", "HEAD"]).code).not.toBe(0);
  });

  test("a folder outside any repo does not exit 0", () => {
    const outside = mkdtempSync(join(tmpdir(), "no-planning-names-outside-"));
    try {
      expect(run([], {}, outside).code).not.toBe(0);
    } finally {
      rmSync(outside, { recursive: true, force: true });
    }
  });
});
