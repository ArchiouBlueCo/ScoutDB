
const PlayerModel = require("../models/players")
const path = require('path')
require('dotenv').config()
const dbo = require("../db/conn.js")
const ObjectId = require("mongodb").ObjectId
const cloudinary = require('../middlewares/cloudinaryService.js')


const getPlayers = async (req,res) => {
    const db_connect = dbo.getDb()
    try{
        const players = await db_connect.collection("player").find({}).toArray()
        res.status(200).json(players);
    } catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
}

const createPlayers = async (req, res) => {
     const db_connect = dbo.getDb()
     try{
          const { First_name, Last_name, Gender, Date_of_Birth, Height,
               Position, Nationality, NationalityISO, Club, Market_Value,
               Preferred_Foot, Status, Coach, Number_of_agent, Agent,
               Number_of_coach, Region_scouted_in, Scouted_By, Date_Added, Contract } = req.body;

          if (!req.file) {
               return res.status(400).json({ message: 'No file uploaded' });
          }

          const ImgFile = req.file; // The uploaded file
          const result = await cloudinary.uploader.upload(ImgFile.path, {
               folder: 'uploads', // Optional: Specify folder in Cloudinary
          });

          // Create a new image document
          const player = new PlayerModel({
               First_name, Last_name, Gender, Date_of_Birth, Height, Market_Value,
               Position, Nationality, NationalityISO, Club,  Number_of_agent, Agent,
               Preferred_Foot, Status, Coach, Number_of_coach, Region_scouted_in, Scouted_By, Date_Added, Contract,
               Image:  result.secure_url// store the image path
          });

          await  db_connect.collection("player").insertOne(player) //req.body is request.body which means whatever the clients sends to the server must be shown in the console screen or browser
          res.status(200).json(player)
     
     } catch (error) {
          console.log(error.message)
          res.status(500).json({message: error.message})
     }
}

const updatePlayers = async (req, res) => {
     const db_connect = dbo.getDb()
     const myquery = { _id: new ObjectId(req.params.id) }
     let body = {}
     if(req.file){
          const ImgFile = req.file; // The uploaded file
          const result = await cloudinary.uploader.upload(ImgFile.path, {
               folder: 'uploads', // Optional: Specify folder in Cloudinary
     });
          body =  {
               $set: {
                    First_name: req.body.First_name,
                    Last_name: req.body.Last_name,
                    Gender: req.body.Gender,
                    Date_of_Birth: req.body.Date_of_Birth,
                    Position: req.body.Position,
                    Height: req.body.Height,
                    Nationality: req.body.Nationality,
                    NationalityISO: req.body.NationalityISO,
                    Club: req.body.Club,
                    Preferred_Foot: req.body.Preferred_Foot,
                    Status: req.body.Status,
                    Coach: req.body.Coach,
                    Agent: req.body.Agent,
                    Number_of_coach: req.body.Number_of_coach,
                    Number_of_agent: req.body.Number_of_agent,
                    Region_scouted_in: req.body.Region_scouted_in,
                    Scouted_By: req.body.Scouted_By,
                    Market_Value: req.body.Market_Value,
                    Contract: req.body.Contract,
                    Image: result.secure_url,
               }}
     }else{
          body = {
               $set: {
                    First_name: req.body.First_name,
                    Last_name: req.body.Last_name,
                    Gender: req.body.Gender,
                    Date_of_Birth: req.body.Date_of_Birth,
                    Position: req.body.Position,
                    Height: req.body.Height,
                    Nationality: req.body.Nationality,
                    NationalityISO: req.body.NationalityISO,
                    Club: req.body.Club,
                    Preferred_Foot: req.body.Preferred_Foot,
                    Status: req.body.Status,
                    Agent: req.body.Agent,
                    Coach: req.body.Coach,
                    Number_of_coach: req.body.Number_of_coach,
                    Number_of_agent: req.body.Number_of_agent,
                    Region_scouted_in: req.body.Region_scouted_in,
                    Scouted_By: req.body.Scouted_By,
                    Market_Value: req.body.Market_Value,
                    Contract: req.body.Contract,
               }}
     }
     

     try{
          const player = await  db_connect.collection("player").updateOne(myquery, body)
          
          //if we cant find any player in database
          if(!player){
               return res.status(404).json({message: "cannot find any player with ID ${id}"})
          }
          res.status(200).json(player)
     } catch(error){
          res.status(500).json({message: error.message})
     }
}

const deletePlayers = async (req, res) => {
     const db_connect = dbo.getDb()
     const id = { _id: new ObjectId(req.params.id) }
     try{
          const player = await db_connect.collection("player").findOneAndDelete(id)
          if (!player) {
               return res.status(404).json({message: "cannot find any player with ID ${id}"})
          }
          const imgUrl =  player.Image
          const imgUrlEdited = `uploads/${imgUrl.split("/uploads/")[1].split(".")[0]}`
          const result = await cloudinary.api.delete_resources([`${imgUrlEdited}`], 
               { type: 'upload', resource_type: 'image' })
             .then(console.log("del successful"))
          res.status(200).json(player)
     }
     catch(error){
          res.status(500).json({message: error.message})
     }
}

const addLink = async (req, res) => {
     const db_connect = dbo.getDb()
     const myquery = { _id: new ObjectId(req.params.id) }
     const body =  {
          $push: {
               Link: req.body
          }}

     try{
          var player = await  db_connect.collection("player").updateOne(myquery, body)
          
          //if we cant find any player in database
          if(!player){
               return res.status(404).json({message: "cannot find any player with ID ${id}"})
          }
          res.status(200).json(player)
     } catch(error){
          res.status(500).json({message: error.message})
     }
}

const deleteLink = async (req, res) => {
     const db_connect = dbo.getDb()
     const myquery = { _id: new ObjectId(req.params.id) }
     const body =  {
          $pull: {
               Link: req.body.link
          }}

     try{
          const player = await  db_connect.collection("player").updateOne(myquery, body)
          
          //if we cant find any player in database
          if(!player){
               return res.status(404).json({message: "cannot find any player with ID ${id}"})
          }
          res.status(200).json(player.Link)
     } catch(error){
          res.status(500).json({message: error.message})
     }
}

const getLinks = async (req,res) => {
     const db_connect = dbo.getDb()
     try{
          const myquery = { _id: new ObjectId(req.params.id) }
         
          // Find players that belong toc the specified team and populate the team reference
          const search = await db_connect.collection("player").findOne(myquery)

          if (search.length === 0) {
               return res.status(404).json({ message: 'No player found' });
          }
        
          res.status(200).json(search);
   } catch(error){
        res.status(500).json({message:error.message})
   }
}


module.exports = {
     getPlayers,
     createPlayers,
     updatePlayers,
     deletePlayers,
     addLink,
     deleteLink,
     getLinks
}
