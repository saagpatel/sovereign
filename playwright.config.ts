import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	use: {
		baseURL: "https://sovereign-sim.vercel.app",
		headless: true,
	},
	projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
