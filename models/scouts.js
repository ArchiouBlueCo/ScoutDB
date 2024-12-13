const { required } = require("joi")
const mongoose = require("mongoose")

const ScoutSchema = new mongoose.Schema({

    
    Name: String,
    
    Email: {
        type: String,
        required: [true, "Email is required"],
        trim: true, 
        // unique: [true, "Email must be unique"],
        // minLength: [5, "Email must have more than 5 characters"],
        //lowercase: true

    },
    
    Password: {
        type: String,
        // required: [true, "Password must be provided"],
        trim: true,
        select: false
    },

    ForgotPasswordCode: {
        type: String,
        select: false,
    },

    ForgotPasswordCodeValidation: {
        type: Number,
        select: false,
    },

    PasswordChanged: {
        type: Boolean, 
        default: false
    }
}, {
    timestamps: true
})


const ScoutModel = mongoose.model("Scout", ScoutSchema)

module.exports = ScoutModel