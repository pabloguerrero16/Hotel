import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/";

//Sign In Before every test
test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Signed In Successfuly!")).toBeVisible();
});

// Search Test
test("Should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
});

// Show Hotel's details test
test("Should show hotel Details", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Getaways").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
});

// Book room test
test("Should book hotel", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Getaways").click();
  await page.getByRole("button", { name: "Book Now" }).click();

  await expect(page.getByText("Total Cost: $238.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator('[placeholder="Card number"]')
    .fill("4242424242424242");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
  await stripeFrame.locator('[placeholder="CVC"]').fill("242");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("45678");

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await page.waitForTimeout(5000);
  await expect(page.getByText("Booking Saved!")).toBeVisible();

  await page.getByRole("link", { name: "My Bookings" }).click();
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
});
