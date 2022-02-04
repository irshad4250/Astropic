require("dotenv").config()
const axios = require("axios")
const express = require("express")
const BodyParser = require("body-parser")
const { MongoClient, ObjectId } = require("mongodb")

const mdbUri = process.env.MDB_URI
const client = new MongoClient(mdbUri)
const app = express()
const id = process.env.ID

let collection

app.use(express.json())
app.use("/public", express.static("public"))
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())

app.use("/public", express.static("public"))
app.set("view engine", "html")

app.get("/", (req, res) => {
  collection.updateOne({ _id: ObjectId(id) }, { $inc: { number: 1 } })
  res.sendFile(__dirname + "/Views/home.html")
})

app.post("/get_image", async (req, res) => {
  const timestampReq = req.body.timestamp

  let timestamp = new Date(timestampReq)
  let year = timestamp.getFullYear()
  let month = timestamp.getMonth() + 1
  let date = timestamp.getDate()

  const getUrl = process.env.GET_URL + `api_key=${process.env.NASA_APIKEY}`
  const toUrl = getUrl + "&date=" + year + "-" + month + "-" + date

  axios
    .get(toUrl)
    .then((response) => {
      let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      let userDate = timestamp.toLocaleDateString("en-US", options)
      let toReturn = { response: response.data, stringDate: userDate }
      res.send(toReturn)
    })
    .catch(() => {
      res.send({ error: true })
    })
})

client.connect().then(() => {
  collection = client.db("Astropic").collection("Users")
  app.listen(process.env.PORT || 5000, () => {
    console.log("Listening on PORT 5000")
  })
})
