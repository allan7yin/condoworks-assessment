const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const filePath = process.env.CUSTOMER_INVOICE_FILE_PATH;

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found at path: ${filePath}`);
  process.exit(1);
}

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  // parse data via a 'extractCustomerInfo` function fall
  extractInformation(data);
});

function extractInformation(content) {
  console.log("starting anaylsis now");
  // obtain custoemr number and account number
  const customerAccountMatch = content.match(
    /Customer no\. - Account no\.\s+(\d+)\s*-\s*(\d+)/
  );

  const customerNumber = customerAccountMatch[1];
  const accountNumber = customerAccountMatch[2];

  // ii. The bill period
  const billPeriodMatch = content.match(
    /Bill period:\s+([\s\S]*?(\w{3} \d{1,2}, \d{4} to \w+ \d{1,2}, \d{4}))/
  );
  const billPeriod = billPeriodMatch ? billPeriodMatch[2].trim() : null;

  // iii. The bill number
  const billNumberMatch = content.match(/Bill number:\s+(\d+)/);
  const billNumber = billNumberMatch[1];

  // iv. The bill date
  const billDateMatch = content.match(
    /Bill date:\s+([a-zA-Z]+\s+\d{1,2},\s+\d{4})/
  );
  const billDate = billDateMatch[1];

  // v. The amount in the “total new charges” line
  const totalChargesMatch = content.match(
    /Total new charges\s+\$([\d,]+.\d{2})/
  );
  const totalChargesAmount = totalChargesMatch[1];

  // Output the results
  console.log(`Customer Number: ${customerNumber}`);
  console.log(`Account Number: ${accountNumber}`);
  console.log(`Bill Period: ${billPeriod}`);
  console.log(`Bill Number: ${billNumber}`);
  console.log(`Bill Date: ${billDate}`);
  console.log(`Total New Charges Amount: $${totalChargesAmount}`);
}
