const shops = require("./infoShops.js")
const { chromium } = require("playwright")
const fs = require("fs")

module.exports = async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const shopsData = []

  for (const shop of shops) {
    console.log("Scraping: ", shop.name)
    let { name, url, products } = shop

    const page = await context.newPage()
    if (!Array.isArray(url)) await page.goto(url)

    const productsList = await products({ page, url })

    shopsData.push({ name, products: productsList })
    page.close()
  }
  fs.writeFile(
    `./shops/shops.json`,
    JSON.stringify(shopsData, null, 2),
    err => {
      if (err) {
        console.error(err)
        return
      }
      console.log("File has been created/updated")
    }
  )

  await browser.close()
}
