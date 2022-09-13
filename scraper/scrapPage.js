const shops = require("./infoShops.JS")
const { chromium } = require("playwright")
const fs = require("fs")

module.exports = async ({ pageName }) => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const shopsData = []

  const shop = shops.find(
    shop => shop.name.toLowerCase() === pageName.toLowerCase()
  )

  if (!shop) {
    throw new Error("Shop not found")
  }

  console.log("Scraping: ", shop.name)
  let { name, url, products } = shop

  const page = await context.newPage()
  if (!Array.isArray(url)) await page.goto(url)

  const productsList = await products({ page, url })

  shopsData.push({ name, products: productsList })
  page.close()

  fs.writeFile(
    `./shops/${name}.json`,
    JSON.stringify(...shopsData, null, 2),
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
