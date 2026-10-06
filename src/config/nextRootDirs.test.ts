import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

type NextRootContext = {
	cwd: string;
	settings: { next: { rootDir?: string | string[] } };
};

type NextRootDirs = (context: NextRootContext) => string[];
type GetPagesUrls = (prefix: string, directories: string[]) => RegExp[];

const projectRequire = createRequire(import.meta.url);
const eslintConfigPath = projectRequire.resolve("eslint-config-next");
const pluginUtils = path.dirname(
	projectRequire.resolve("@next/eslint-plugin-next/dist/utils/get-root-dirs.js", {
		paths: [path.dirname(eslintConfigPath)],
	}),
);
const { getRootDirs } = projectRequire(
	path.join(pluginUtils, "get-root-dirs.js"),
) as { getRootDirs: NextRootDirs };
const { getUrlFromPagesDirectories } = projectRequire(
	path.join(pluginUtils, "url.js"),
) as { getUrlFromPagesDirectories: GetPagesUrls };

describe("Next ESLint rootDir resolver patch", () => {
	it("keeps symlinked page roots and their downstream route set", () => {
		const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "sovereign-next-root-"));
		const apps = path.join(fixture, "apps");
		const externalPages = path.join(fixture, "external", "linked-app", "pages");
		const linkedRoot = path.join(apps, "linked");

		try {
			fs.mkdirSync(apps, { recursive: true });
			const defaultPages = path.join(fixture, "pages");
			fs.mkdirSync(externalPages, { recursive: true });
			fs.mkdirSync(defaultPages, { recursive: true });
			fs.writeFileSync(path.join(defaultPages, "index.js"), "export default function Home() {}");
			fs.writeFileSync(path.join(externalPages, "index.js"), "export default function Page() {}");
			fs.writeFileSync(path.join(externalPages, "about.tsx"), "export default function About() {}");
			fs.symlinkSync(
				path.dirname(externalPages),
				linkedRoot,
				process.platform === "win32" ? "junction" : "dir",
			);

			const defaultRoots = getRootDirs({ cwd: fixture, settings: { next: {} } });
			expect(defaultRoots).toEqual([fixture]);
			expect(
				getUrlFromPagesDirectories(
					"/",
					defaultRoots.map((root) => path.join(root, "pages")),
				).map((route) => route.source),
			).toEqual(
				expect.arrayContaining([new RegExp("^/$").source, new RegExp("^/index/$").source]),
			);

			const wildcardContext: NextRootContext = {
				cwd: fixture,
				settings: { next: { rootDir: path.join(apps, "*") } },
			};
			const wildcardRoots = getRootDirs(wildcardContext);
			expect(wildcardRoots.map((root) => path.resolve(root))).toContain(
				path.resolve(linkedRoot),
			);

			const pageDirectories = wildcardRoots
				.map((root) => path.join(root, "pages"))
				.filter(fs.existsSync);
			const wildcardRoutes = getUrlFromPagesDirectories("/", pageDirectories).map(
				(route) => route.source,
			);
			expect(wildcardRoutes).toEqual(
				expect.arrayContaining([
					new RegExp("^/$").source,
					new RegExp("^/index/$").source,
					new RegExp("^/about/$").source,
				]),
			);

			const duplicateRoots = getRootDirs({
				cwd: fixture,
				settings: { next: { rootDir: [linkedRoot, linkedRoot] } },
			});
			expect(duplicateRoots.map((root) => path.resolve(root))).toEqual([
				path.resolve(linkedRoot),
				path.resolve(linkedRoot),
			]);

			const duplicateRoutes = getUrlFromPagesDirectories(
				"/",
				duplicateRoots.map((root) => path.join(root, "pages")),
			).map((route) => route.source);
			expect(duplicateRoutes).toEqual(wildcardRoutes);

			const noMatchRoots = getRootDirs({
				cwd: fixture,
				settings: { next: { rootDir: path.join(apps, "missing-*") } },
			});
			expect(noMatchRoots).toEqual([]);
			expect(
				getUrlFromPagesDirectories(
					"/",
					noMatchRoots.map((root) => path.join(root, "pages")),
				),
			).toEqual([]);
		} finally {
			fs.rmSync(fixture, { recursive: true, force: true });
		}
	});
});
