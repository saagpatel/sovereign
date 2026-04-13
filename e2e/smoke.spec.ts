import { expect, test } from "@playwright/test";

test("homepage loads with title", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle(/Sovereign/);
});

test("calibration page is accessible", async ({ page }) => {
	await page.goto("/calibration/");
	await expect(page.locator("body")).not.toContainText("404");
});
