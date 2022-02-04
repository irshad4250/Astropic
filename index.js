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
  const date = req.body.date

  let timestampsArr = date.split("-")
  let year = timestampsArr[0]
  let month = timestampsArr[1] - 1
  let day = timestampsArr[2]
  let timestamp = new Date(year, month, day)

  const getUrl =
    process.env.GET_URL + `api_key=${process.env.NASA_APIKEY}&thumbs=true`
  const toUrl = getUrl + "&date=" + date

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

      let url
      if (response.data.media_type != "image") {
        url = response.data.thumbnail_url
      } else {
        url = response.data.url
      }

      let responseSimplification = { url: url, title: response.data.title }
      let toReturn = { response: responseSimplification, stringDate: userDate }
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
