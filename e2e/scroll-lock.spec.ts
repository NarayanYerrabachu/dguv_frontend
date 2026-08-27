import { test, expect } from "@playwright/test";

// Simulate a slow SSE stream so we can scroll up mid-stream.
test("scroll lock: user can scroll up during streaming and view stays", async ({ page }) => {
  await page.route("**/api/chat/stream", async (route) => {
    // Build a large body with many tokens so the container gets tall enough to scroll
    const tokens = Array.from({ length: 120 }, (_, i) =>
      `Dies ist Token Nummer ${i + 1} und er enthält etwas Text damit die Seite scrollbar wird. `
    );
    const body =
      tokens.map((t) => `event: token\ndata: ${JSON.stringify({ token: t })}\n\n`).join("") +
      "event: done\ndata: {}\n\n";

    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      body: body,
    });
  });

  await page.goto("/chat");

  const textarea = page.locator("textarea");
  await textarea.fill("Test streaming scroll lock");
  await textarea.press("Enter");

  const container = page.locator(".chat-scrollbar");

  // Wait until the container is actually scrollable (content taller than viewport)
  await page.waitForFunction(() => {
    const el = document.querySelector(".chat-scrollbar") as HTMLElement | null;
    return el ? el.scrollHeight > el.clientHeight + 10 : false;
  }, { timeout: 5000 });

  // Record where we are — should be near bottom (auto-scroll has been running)
  const scrollTopBefore = await container.evaluate((el) => el.scrollTop);
  console.log("scrollTop before user scroll:", scrollTopBefore);
  expect(scrollTopBefore).toBeGreaterThan(0);

  // User scrolls up
  await container.evaluate((el) => { el.scrollTop = 0; });
  // Let the scroll event propagate to React's onScroll handler
  await page.waitForTimeout(100);

  const scrollTopAfterUserScroll = await container.evaluate((el) => el.scrollTop);
  console.log("scrollTop after user scroll up:", scrollTopAfterUserScroll);

  // Trigger a re-render by waiting a bit (more tokens / state updates)
  await page.waitForTimeout(400);

  const scrollTopAfterWait = await container.evaluate((el) => el.scrollTop);
  console.log("scrollTop after waiting (should still be near 0):", scrollTopAfterWait);

  // Must still be near the top — auto-scroll should be locked
  expect(scrollTopAfterWait).toBeLessThan(80);

  // --- Now scroll back to the bottom manually ---
  await container.evaluate((el) => { el.scrollTop = el.scrollHeight; });
  await page.waitForTimeout(150);

  // Verify IntersectionObserver had time to fire (sentinel is visible → isAtBottom = true)
  const distanceFromBottom = await container.evaluate(
    (el) => el.scrollHeight - el.scrollTop - el.clientHeight
  );
  console.log("distance from bottom after manual scroll back:", distanceFromBottom);
  expect(distanceFromBottom).toBeLessThan(10);
});
