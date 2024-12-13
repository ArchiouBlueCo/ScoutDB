const { MongoClient } = require("mongodb")
const Db = process.env.ATLAS_URI
const client = new MongoClient(Db, { family: 4,})

var _db

module.exports = {
    connectToMongoDB: async function (callback) {
        try {
            await client.connect()
            _db = client.db("BlueCo")
            console.log("Successfully connected to MongoDB.")
            
            return callback(null)
        } catch (error) {
            return callback(error)
        }
    },

    getDb: function () {
        return _db
    }
}