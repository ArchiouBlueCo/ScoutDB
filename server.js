const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path")
require("dotenv").config()
const port = process.env.PORT || 5000
const scoutRoute = require("./routes/scout")
const playerRoute = require("./routes/players")
const evaluationRoute = require("./routes/evaluation")
const fileUpload = require('express-fileupload') // Middleware for handling file uploads

app.use(cors())
app.use(express.json())
app.use("/scouts", scoutRoute)
app.use("/players", playerRoute)
app.use("/evaluation", evaluationRoute)
app.use('/uploads', express.static('uploads'))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/', // Temporary directory for file uploads
  }))


const client = express.static(path.join(__dirname, '/client/dist'))
const indexHTML = path.join(__dirname, '/client/dist/index.html')
app.use(client)
app.get("*", (req,res) => res.sendFile(indexHTML))


const dbo = require("./db/conn")

dbo.connectToMongoDB(function (error) {
    if (error) throw error

    app.listen(port, () => {
        console.log("Server is running on port: " + port)
    })
})