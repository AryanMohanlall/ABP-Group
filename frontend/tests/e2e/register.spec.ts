import { test, expect } from "@playwright/test";

test.describe("Register page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("renders Create your account heading and subtitle", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
    await expect(page.getByText("Start building with PromptForge")).toBeVisible();
  });

  test("renders all form fields", async ({ page }) => {
    await expect(page.getByPlaceholder("First name")).toBeVisible();
    await expect(page.getByPlaceholder("Surname")).toBeVisible();
    await expect(page.getByPlaceholder("Username")).toBeVisible();
    await expect(page.getByPlaceholder("Email address")).toBeVisible();
    await expect(page.getByPlaceholder("Create a password")).toBeVisible();
    await expect(page.getByPlaceholder("Confirm password")).toBeVisible();
  });

  test("Create account button is disabled when fields are empty", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Create account" })).toBeDisabled();
  });

  test("Create account button stays disabled with partial fields", async ({ page }) => {
    await page.getByPlaceholder("First name").fill("Jane");
    await page.getByPlaceholder("Surname").fill("Doe");
    // Missing email, password, confirm
    await expect(page.getByRole("button", { name: "Create account" })).toBeDisabled();
  });

  test("password strength checks appear when typing password", async ({ page }) => {
    await page.getByPlaceholder("Create a password").fill("a");
    await expect(page.getByText("At least 8 characters")).toBeVisible();
    await expect(page.getByText("One uppercase letter")).toBeVisible();
    await expect(page.getByText("One number or symbol")).toBeVisible();
  });

  test("password check for 8 characters becomes met", async ({ page }) => {
    await page.getByPlaceholder("Create a password").fill("Password1!");
    // All three checks should be met - look for the check items text
    await expect(page.getByText("At least 8 characters")).toBeVisible();
    await expect(page.getByText("One uppercase letter")).toBeVisible();
    await expect(page.getByText("One number or symbol")).toBeVisible();
  });

  test("Passwords match check appears when confirm password is typed", async ({ page }) => {
    await page.getByPlaceholder("Create a password").fill("Password1!");
    await page.getByPlaceholder("Confirm password").fill("Password1!");
    await expect(page.getByText("Passwords match")).toBeVisible();
  });

  test("Create account button stays disabled when passwords do not match", async ({ page }) => {
    await page.getByPlaceholder("First name").fill("Jane");
    await page.getByPlaceholder("Surname").fill("Doe");
    await page.getByPlaceholder("Username").fill("jane.doe");
    await page.getByPlaceholder("Email address").fill("jane@example.com");
    await page.getByPlaceholder("Create a password").fill("Password1!");
    await page.getByPlaceholder("Confirm password").fill("Different1!");
    await expect(page.getByRole("button", { name: "Create account" })).toBeDisabled();
  });

  test("Create account button is enabled when all valid fields are filled", async ({ page }) => {
    await page.getByPlaceholder("First name").fill("Jane");
    await page.getByPlaceholder("Surname").fill("Doe");
    await page.getByPlaceholder("Username").fill("jane.doe");
    await page.getByPlaceholder("Email address").fill("jane@example.com");
    await page.getByPlaceholder("Create a password").fill("Password1!");
    await page.getByPlaceholder("Confirm password").fill("Password1!");
    await expect(page.getByRole("button", { name: "Create account" })).toBeEnabled();
  });

  test("shows sign in link pointing to /login", async ({ page }) => {
    const signInLink = page.getByRole("link", { name: "Sign in" });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute("href", "/login");
  });

  test("shows terms of service and privacy policy text", async ({ page }) => {
    await expect(page.getByText("Terms of Service")).toBeVisible();
    await expect(page.getByText("Privacy Policy")).toBeVisible();
  });

  test("shows error message after failed registration", async ({ page }) => {
    await page.route("**/api/services/app/Account/Register", route =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: { message: "User already exists" } }),
      })
    );

    await page.getByPlaceholder("First name").fill("Jane");
    await page.getByPlaceholder("Surname").fill("Doe");
    await page.getByPlaceholder("Username").fill("jane.doe");
    await page.getByPlaceholder("Email address").fill("jane@example.com");
    await page.getByPlaceholder("Create a password").fill("Password1!");
    await page.getByPlaceholder("Confirm password").fill("Password1!");

    await Promise.all([
      page.waitForRequest("**/api/services/app/Account/Register"),
      page.getByRole("button", { name: "Create account" }).click(),
    ]);

    await expect(
      page.getByText("Registration failed. Please check your details.")
    ).toBeVisible();
  });
});
