const express = require("express")
const recordRoutes = express.Router()
const dbo = require("../db/conn.js")
const {getScouts, createScouts, updatePassword, deleteScouts, signin} = require("../controllers/scout.js")


recordRoutes.route("/").get(getScouts)
recordRoutes.route("/").post(createScouts)
recordRoutes.route("/signin").post(signin)
recordRoutes.route("/updatePassword/:_id").put(updatePassword)

module.exports = recordRoutes 