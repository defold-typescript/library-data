import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { searchIndexOutputs } from "../../scripts/build-search-index";
import { apiPages, libraryNavGroups, siteDirs, untypedListings } from "./api-content";
import { guides, renderGuideMarkdown } from "./guides";
import { allPageHeadings } from "./headings";
import { buildNav } from "./nav";

const folderSlugs = readdirSync(join(process.cwd(), "guides"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => file.replace(/\.md$/, ""))
  .sort();

const rendered = await Promise.all(
  guides().map(async (guide) => ({ guide, html: await renderGuideMarkdown(guide.markdown) })),
);

const headingIds = (html: string): Set<string> =>
  new Set(allPageHeadings(html).map((heading) => heading.id));

describe("guides", () => {
  test("every guide in the folder is listed at its /guides/<slug> route", () => {
    expect(
      guides()
        .map((guide) => guide.route)
        .sort(),
    ).toEqual(folderSlugs.map((slug) => `/guides/${slug}`));
  });

  test("every link inside the site names a page or listing that exists", () => {
    const routes = new Set([
      "/",
      ...apiPages().map((page) => page.route),
      ...untypedListings().map((listing) => listing.route),
      ...guides().map((guide) => guide.route),
    ]);
    const dead = rendered.flatMap(({ guide, html }) =>
      [...html.matchAll(/href="(\/[^"#]*)[^"]*"/g)]
        .map((match) => match[1] as string)
        .filter((route) => !routes.has(route))
        .map((route) => `${guide.slug}: ${route}`),
    );
    expect(dead).toEqual([]);
  });

  test("every anchor on a guide link resolves to a heading that guide renders", () => {
    const ids = new Map(rendered.map(({ guide, html }) => [guide.route, headingIds(html)]));
    const dead = rendered.flatMap(({ guide, html }) =>
      [...html.matchAll(/href="(\/guides\/[^"#]+)#([^"]+)"/g)]
        .filter((match) => !ids.get(match[1] as string)?.has(match[2] as string))
        .map((match) => `${guide.slug}: ${match[1]}#${match[2]}`),
    );
    expect(dead).toEqual([]);
  });

  test("a link to another guide keeps its anchor under /guides/<slug>", async () => {
    const target = rendered.find(({ guide }) => guide.slug === "refreshing-library-pins");
    const anchor = allPageHeadings(target?.html ?? "").find((heading) => heading.level === 2)?.id;
    expect(anchor).toBeDefined();
    const html = await renderGuideMarkdown(`[pins](./refreshing-library-pins.md#${anchor})`);
    expect(html).toContain(`href="/guides/refreshing-library-pins#${anchor}"`);
  });

  test("the sidebar lists every guide in a Guides group", () => {
    const group = buildNav(libraryNavGroups(apiPages(), siteDirs()), guides())[0]?.links.find(
      (link) => link.label === "Guides",
    );
    expect(group?.children?.map((link) => link.route).sort()).toEqual(
      folderSlugs.map((slug) => `/guides/${slug}`),
    );
  });

  test("search holds a record for each guide, titled by its heading", () => {
    const records = searchIndexOutputs().flatMap((output) => output.records);
    for (const guide of guides()) {
      const record = records.find((candidate) => candidate.route === guide.route);
      expect(record?.title).toBe(guide.title);
      expect(record?.text.length).toBeGreaterThan(0);
    }
    expect(guides().length).toBe(folderSlugs.length);
  });
});
