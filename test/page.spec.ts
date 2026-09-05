import { expect, test } from "@playwright/test";

for (const width of [320, 375, 768, 1440]) {
  test("production build works under a slot at " + width + "px", async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    const badResponses: string[] = [];
    const externalRequests: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", response => { if (response.status() >= 400) badResponses.push(response.url()); });
    page.on("request", request => {
      if (new URL(request.url()).origin !== "http://127.0.0.1:4174") externalRequests.push(request.url());
    });
    await page.goto("/_cm_1/index.html");
    await expect(page).toHaveTitle("Cogover Custom Module");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hello from your first frontend module");
    await expect(page.getByText("This page was built with TypeScript and deployed on Cogover.")).toBeVisible();
    expect(await page.locator("html").getAttribute("lang")).toBe("en");
    expect(await page.locator("main").evaluate(el => getComputedStyle(el).backgroundColor)).toBe("rgb(255, 255, 255)");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("page.png"), fullPage: true });
    // Larger text must reflow rather than disappear or scroll horizontally.
    await page.addStyleTag({ content: ":root { font-size: 200%; }" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    expect(badResponses).toEqual([]);
    expect(externalRequests).toEqual([]);
  });
}
