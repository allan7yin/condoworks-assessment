const puppeteer = require("puppeteer");

// Credentials
const username = "coop.test@condoworks.co";
const password = "TheTest139";

const url = "https://app-dev.condoworks.co";

const login = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 75,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: "./invoices_page_after_click_link.png" });

    // enter username and password
    await page.type("input#Email", username);
    await page.type("input#Password", password);
    await page.click('input[type="submit"]');

    // click on dropdoqn menu and select "all"
    await page.waitForSelector("li.nav-item.dropdown.mr-1");
    await page.click("li.nav-item.dropdown.mr-1");
    await page.click('.dropdown-item[href="/invoices/all"]');

    await page.waitForSelector("#gs_invoices.InvoiceNumber");

    // Type "123" into the input field
    await page.type("#gs_invoices.InvoiceNumber", "123");
    await page.click(".fa-search");
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });

    await page.click(
      'a[title="View/Edit"][href="https://app-dev.condoworks.co/invoiceadmin/edit/cooptest/61095?returnToList=%2Finvoices%2Fall"]'
    );
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });

    await page.screenshot({ path: "./invoices_page_after_click_link.png" });
  } catch (error) {
    console.log("Error duing web-scraping process:", error);
  } finally {
    await browser.close();
  }
};

login();
