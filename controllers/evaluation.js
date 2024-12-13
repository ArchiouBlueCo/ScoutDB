const EvaluationModel = require("../models/evaluation")
const mongoose = require('mongoose');
const dbo = require("../db/conn")


const createEvaluation = async (req, res) => {
     const db_connect = dbo.getDb()
    try{
         const evaluation = await db_connect.collection("evaluation").insertOne(req.body) //req.body is request.body which means whatever the clients sends to the server must be shown in the console screen or browser
         res.status(200).json(evaluation) 
    } catch (error) {
         console.log(error.message)
         res.status(500).json({message: error.message})
    }
}

const getEvaluation = async (req,res) => {
     const db_connect = dbo.getDb()
     try{
          const { Player_id } = req.params
         
          // Find players that belong toc the specified team and populate the team reference
          const evaluation = await db_connect.collection("evaluation").findOne({ Player_id: Player_id})

          if (evaluation.length === 0) {
               return res.status(404).json({ message: 'No evaluation found' });
          }
        
          res.status(200).json(evaluation);
   } catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
   }
}

const deleteEvaluation = async (req, res) => {
     const db_connect = dbo.getDb()
    try{
         const {Player_id} = req.params
         const evaluation = await db_connect.collection("evaluation").deleteOne({ Player_id: Player_id})
         if (!evaluation) {
              return res.status(404).json({message: "cannot find any player with ID ${id}"})
         }
         res.status(200).json(evaluation)
    }
    catch(error){
         res.status(500).json({message: error.message})
    }
}

module.exports = {
    getEvaluation,
    createEvaluation,
    deleteEvaluation,
}