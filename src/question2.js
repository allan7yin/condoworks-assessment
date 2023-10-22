const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const os = require("os");
const path = require("path");

dotenv.config();

const homeDir = os.homedir();
const donwloadPath = path.join(homeDir, "Downloads");

// Credentials
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const url = process.env.URL;

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

    // grab the input field to enter 123
    await page.waitForSelector("#gs_invoices\\.InvoiceNumber");
    const inputElement = await page.$("#gs_invoices\\.InvoiceNumber");
    await inputElement.type("123");

    // now, we click on the row of 123444
    await page.waitForSelector(
      'a[title="View/Edit"][href="https://app-dev.condoworks.co/invoiceadmin/edit/cooptest/61095?returnToList=%2Finvoices%2Fall"]',
      { visible: true }
    );

    await page.click(
      'a[title="View/Edit"][href="https://app-dev.condoworks.co/invoiceadmin/edit/cooptest/61095?returnToList=%2Finvoices%2Fall"]'
    );

    // now, we click on the download button
    await page.waitForSelector('a.kv-file-download[title="Download file"]', {
      visible: true,
    });

    await page.click('a.kv-file-download[title="Download file"]');

    console.log(donwloadPath);
  } catch (error) {
    console.log("Error duing web-scraping process:", error);
  } finally {
    await browser.close();
  }
};

login();
