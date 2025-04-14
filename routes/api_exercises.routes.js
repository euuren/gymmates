const express = require("express");
const router = express.Router();

const {
    getExerciseByIdJSON,
    searchExercisesJSON,
} = require("../handlers/api_exercises.handlers");

router.get("/search", searchExercisesJSON);
router.get("/:id", getExerciseByIdJSON);

module.exports = router;