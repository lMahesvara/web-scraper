require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")

const fs = require("fs")
const scrapAll = require("./scraper/scrapAll.js")
const notFound = require("./middleware/notFound.js")
const handleErrors = require("./middleware/handleErrors.js")
const scrapPage = require("./scraper/scrapPage.js")

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

app.get("/all", (req, res) => {
  const data = fs.readFileSync("./shops/shops.json")
  res.json(JSON.parse(data))
})

app.get("/:page", (req, res) => {
  const { page } = req.params
  try {
    const data = fs.readFileSync(`./shops/${page}.json`)
    res.json(JSON.parse(data))
  } catch (error) {
    res.status(404).json({ message: "Page not found" })
  }
})

app.post("/all", (req, res) => {
  scrapAll()
  res.send("POST request to the homepage")
})

app.post("/:page", (req, res) => {
  const { page } = req.params

  try {
    scrapPage({ pageName: page })
    res.send("POST request to the homepage")
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
