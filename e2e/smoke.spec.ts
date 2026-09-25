import { expect, test } from "@playwright/test";

test("signs in, opens the dashboard, and keeps a theme change", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@example.com");
  await page.getByLabel("Password").fill("password1");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.getByRole("button", { name: "Theme", exact: true }).click();
  await page.getByRole("combobox", { name: /Radius/ }).selectOption("lg");
  await expect(page.locator("html")).toHaveAttribute("data-radius", "lg");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-radius", "lg");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
