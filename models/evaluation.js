const mongoose = require("mongoose")

const EvaluationSchema = new mongoose.Schema({

    Player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
    },
    Technique: String,
    Endurance: String,
    Speed: String,
    Set_Pieces: String,
    Shooting: String,
    Work_rate: String,
    Jumping: String,
    Aggression: String,
    Strength: String,
    Build_up_play: String,
    Agility: String,
    Short_passes: String,
    Long_passes: String,
    onevone_attacking: String,
    onevone_defending: String,
    Decision_making: String,
    Crossing: String,
    Mentality: String,
    Goalscoring: String,
    Offensive_heading: String,
    Defensive_heading: String,
    Leadership: String,
    Scout: String,
    Average: String,
    Note: String,

}, {timestamps: true})

const EvaluationModel = mongoose.model("Evaluation", EvaluationSchema)

module.exports = EvaluationModel

