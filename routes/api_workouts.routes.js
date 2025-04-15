const express = require("express");
const router = express.Router();

const {
    insertWorkoutJSON,
    getWorkoutByIdJSON,
    deleteWorkoutJSON,
    searchWorkoutsJSON,
    saveWorkoutJSON,
    unsaveWorkoutJSON,
    completeAWorkoutJSON,
    editWorkoutJSON
} = require("../handlers/api_workouts.handlers");

router.post("/", insertWorkoutJSON);
router.get("/search", searchWorkoutsJSON);
router.get("/:id", getWorkoutByIdJSON);
router.delete("/:id", deleteWorkoutJSON);
router.put("/:id", editWorkoutJSON);
router.post("/:id/save", saveWorkoutJSON);
router.delete("/:id/unsave", unsaveWorkoutJSON);
router.post("/:id/complete", completeAWorkoutJSON); // need to create a field in users table to store completed workouts??

module.exports = router;