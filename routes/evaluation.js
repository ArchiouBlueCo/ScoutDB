const express = require("express")
const router = express.Router()
const EvaluationModel = require("../models/evaluation")
const { getEvaluation, createEvaluation, updateEvaluation, deleteEvaluation } = require("../controllers/evaluation")

router.route("/:Player_id").get(getEvaluation);
router.route("/").post(createEvaluation);
router.route("/delete/:Player_id").delete(deleteEvaluation);


module.exports = router