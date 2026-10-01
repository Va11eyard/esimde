import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const base = "http://127.0.0.1:5174";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir, size: { width: 1440, height: 900 } },
  locale: "ru-RU",
});
const page = await context.newPage();
const video = page.video();

const pause = (ms) => page.waitForTimeout(ms);

async function scrollPage() {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 520) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await pause(450);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await pause(700);
}

async function clickSvgNorm(nx, ny) {
  const svg = page.locator("svg").first();
  const box = await svg.boundingBox();
  if (!box) throw new Error("clock svg missing");
  await page.mouse.click(box.x + nx * box.width, box.y + ny * box.height);
}

await page.goto(base, { waitUntil: "networkidle" });
await pause(1200);
await scrollPage();

await page.getByRole("link", { name: "Войти" }).click();
await page.getByRole("heading", { name: "Вход в систему" }).waitFor();
await pause(1800);
await page.getByRole("button", { name: "На главную" }).click();
await pause(800);

await page.goto(`${base}/#register`, { waitUntil: "networkidle" });
await page.getByRole("heading", { name: /Регистрац/ }).waitFor();
await pause(1800);
await page.getByRole("button", { name: "На главную" }).click();
await pause(600);

await page.goto(`${base}/#privacy`, { waitUntil: "networkidle" });
await pause(1600);

await page.goto(`${base}/#screen`, { waitUntil: "networkidle" });
await page.getByRole("heading", { name: "Кому проверяем память" }).waitFor();
await pause(600);
await page.getByLabel("Имя родителя").fill("Асия");
await pause(250);
await page.getByLabel("Возраст родителя").fill("74");
await pause(250);
await page.getByLabel("Ваше имя").fill("Ерлан");
await pause(250);
await page.getByLabel("Ваш телефон").fill("+77001234567");
await pause(400);
await page.getByRole("checkbox").check();
await pause(400);
await page.getByRole("button", { name: "Дальше к тесту" }).click();

await page.getByRole("heading", { name: "Запомните три слова" }).waitFor();
await pause(1400);
await page.getByPlaceholder("Слово 1").fill("Банан");
await page.getByPlaceholder("Слово 2").fill("Восход");
await page.getByPlaceholder("Слово 3").fill("Стул");
await pause(500);
await page.getByRole("button", { name: "Проверить повтор" }).click();

await page.getByRole("heading", { name: "Циферблат" }).waitFor();
await pause(800);
for (let n = 1; n <= 12; n++) {
  const angle = (n % 12) * 30 * Math.PI / 180;
  const radius = 0.38;
  await clickSvgNorm(0.5 + radius * Math.sin(angle), 0.5 - radius * Math.cos(angle));
  await pause(160);
}
await pause(400);
const hour = 335 * Math.PI / 180;
await clickSvgNorm(0.5 + 0.32 * Math.sin(hour), 0.5 - 0.32 * Math.cos(hour));
await pause(400);
await page.getByRole("button", { name: "Минутная" }).click();
const minute = 60 * Math.PI / 180;
await clickSvgNorm(0.5 + 0.32 * Math.sin(minute), 0.5 - 0.32 * Math.cos(minute));
await pause(500);
await page.getByRole("button", { name: "Часы готовы" }).click();

await page.getByRole("heading", { name: "Какие были три слова?" }).waitFor();
await pause(700);
await page.getByPlaceholder("Слово 1").fill("банан");
await page.getByPlaceholder("Слово 2").fill("восход");
await page.getByPlaceholder("Слово 3").fill("стул");
await pause(400);
await page.getByRole("button", { name: "Узнать результат" }).click();

const branch = page.getByRole("heading", { name: "По этому тесту явных признаков не видно" });
const faq = page.getByRole("heading", { name: "Как родитель справлялся с этим в последний месяц?" });
await Promise.race([branch.waitFor(), faq.waitFor()]);
if (await branch.isVisible()) {
  await pause(1600);
  await page.getByRole("button", { name: "Всё равно продолжить" }).click();
  await faq.waitFor();
}

for (let i = 0; i < 10; i++) {
  await pause(350);
  await page.getByRole("button", { name: "Справляется самостоятельно" }).click();
}

await page.getByRole("heading", { name: "Результат скрининга" }).waitFor();
await pause(2500);
await page.mouse.wheel(0, 400);
await pause(1500);

await context.close();
await browser.close();
const saved = await video.path();
console.log(saved);
