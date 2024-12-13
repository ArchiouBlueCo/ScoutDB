const mongoose = require("mongoose")
// const { v4: uuidv4 } = require('uuid')

const PlayerSchema = new mongoose.Schema({
    First_name: String,
    Last_name: String,
    Gender: String,
    Date_of_Birth: Date,
    Height: String,
    Position: String,
    Nationality: String,
    NationalityISO: String,
    Club: String,
    Preferred_Foot: String,
    Status: String, 
    Region_scouted_in: String,
    Scouted_By: String,
    Image: String,
    Date_Added: Date,
    Agent: String,
    Number_of_agent: String,
    Market_Value: Number,
    Contract: Number,
    Link: [
        {
            url: String,
            title: String
        }
    ]
})

const PlayerModel = mongoose.model("Player", PlayerSchema) //creating a collection
module.exports = PlayerModel
