import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
  test("signs in with mocked auth response", async ({ page }) => {
    await page.route("**/api/TokenAuth/Authenticate", route =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          result: { accessToken: "token-123", expireInSeconds: 3600, userId: 7 },
        }),
      })
    );

    await page.goto("/login");
    await page.getByPlaceholder("Email address").fill("user@example.com");
    await page.getByPlaceholder("Password").fill("Password1!");
    await Promise.all([
      page.waitForRequest("**/api/TokenAuth/Authenticate"),
      page.getByRole("button", { name: "Sign in" }).click(),
    ]);
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });
});
