const express = require("express")
const ScoutModel = require("../models/scouts.js")
const { doHash, doHashValidation } = require("../utils/hashing")
const dbo = require("../db/conn")
const jwt = require("jsonwebtoken")
const ObjectId = require("mongodb").ObjectId

const getScouts = async (req, res) => {
    const db_connect = dbo.getDb()
    try {
        const result = await db_connect.collection("scouts").find({}).toArray()
        res.status(200).json(result)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const createScouts = async (req, res) => {
    const db_connect = dbo.getDb();
    try {
        const {Name, Email, Password} = req.body; // Destructure email and password from request body
        // Check if a scout with the provided email already exists
        // const existingScout = await ScoutModel.findOne({ Email })
        const existingScout = await  db_connect.collection("scouts").findOne({ Email: Email })
        if (existingScout){
            return res.status(401).json({ success: false, message: "Scout exists!"})
        }
        // Hash the password for secure storage
        const hashedPassword = await doHash(Password, 12)
        
        // Create a new Scout object with hashed password
        const newScout = new ScoutModel ({
            Name,
            Email,
            Password: hashedPassword,
        })

        // Save the new scout to the database
        const result = await db_connect.collection("scouts").insertOne(newScout)

        // Exclude the password from the response for security reasons
        result.Password = undefined;
        
        // Send a successful signup response with the created scout (excluding password)
        res.status(201).json({
            success: true, message: "Your account has been successfully created", 
            result,
        })

    } catch (error) {
        console.log(error) // Log the error for debugging 
        return res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
}

const signin = async (req, res) => {
    const {Email, Password} = req.body
    const db_connect = dbo.getDb()
    try {        
        // Find the existing scout with the provided email and include the password field
        const existingScout = await db_connect.collection("scouts").findOne({ Email: Email})
        if (!existingScout){
            return res.status(401).json({ success: false, message: "Scout does not exist!"})
        }
        
        // Validate the password using doHashValidation (assuming it checks password against stored hash)
        const result = await doHashValidation(Password, existingScout.Password)
        if (!result){
            return res.status(401).json({ success: false, message: "Invalid Credentials"})
        }

        // Create a JWT token containing the scout's email for authorization
        const token = jwt.sign(
            {
                ScoutId: existingScout._id,
                ScoutName: existingScout.Name,
                Email: existingScout.Email,
                // Verified: existingScout.Verified
                
            }, 
            process.env.TOKEN_SECRET,
            { 
                expiresIn: "8h"
            }
    );

    // Set a cookie named "Authorization" with the JWT token and an expiry time
    res.cookie("Authorization", "Bearer" + token, { expires: new Date(Date.now() + 8 * 3600000)}) 
    .json({
        success: true,
        scoutId: existingScout._id,
        name: existingScout.Name,
        token,
        message:"Logged in successfully", // Send a successful signin response with the token and message
    })

    } catch (error) {
        console.log(error) // Log the error for debugging

    }
    
}

const updatePassword = async (req, res) => {
    const { currentPassword , newPassword } = req.body;
    const myquery = { _id: new ObjectId(req.params._id) }
    const db_connect = dbo.getDb()
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide current and new passwords.' });
    }

    try{
         const scout = await  db_connect.collection("scouts").findOne(myquery)
         
         if (!scout) {
              return res.status(404).json({ error: 'scout not found' });
         }
         // Verify current password
         const isMatch = await doHashValidation(currentPassword, scout.Password);
         if (!isMatch) {
              return res.status(400).json({ error: 'Current password is incorrect' });
         }

         const newPass = await doHash(newPassword, 12);
         const update = {
            $set : {Password: newPass}
         }
         await db_connect.collection("scouts").updateOne(myquery,update);
         res.json({ message: 'Password updated successfully' });

   } catch(error){
        res.status(500).json({message: error.message})
   }
}

module.exports = {
    getScouts,
    createScouts,
    signin,
    updatePassword
}