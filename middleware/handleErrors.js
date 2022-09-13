module.exports = (error, request, response, next) => {
  console.error(error)

  if (error.name === "CastError") {
    return response.status(400).end().send({ error: "malformatted page" })
  } else {
    response.status(500).end()
  }
}
