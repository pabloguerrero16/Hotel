import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test("Should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);

  // Click sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  // Should see the title
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  // Add Email to Form
  await page.locator("[name=email]").fill("1@1.com");

  // Add Password to Form
  await page.locator("[name=password]").fill("password");

  // Click Login Button
  await page.getByRole("button", { name: "Login" }).click();

  // Should show success message
  await expect(page.getByText("Signed In Successfuly!")).toBeVisible();

  // Should show these buttons/links
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("Should allow user to register", async ({ page }) => {
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;
  await page.goto(UI_URL);

  // Click sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  // Click Create an account
  await page.getByRole("link", { name: "Create an account here" }).click();

  // Should be at Sign In Page
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  // Fill Form with Data
  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  // Click Create Account button
  await page.getByRole("button", { name: "Create Account" }).click();

  // Should show success message
  await expect(
    page.getByText("Registration has been successful!")
  ).toBeVisible();

  // Should show these buttons/links
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
