const {
    getExerciseById,
    searchExercisesByNameAndMuscleGroup,
} = require("../lib/database");

const getExerciseByIdJSON = async (req, res) => {
    const exerciseId = req.params.id;
    const exercise = await getExerciseById(exerciseId);
    if (!exercise) {
        return res.status(404).json({ error: "Exercise not found" });
    }
    res.status(200).json(exercise);
}

const searchExercisesJSON = async (req, res) => {
    const searchQuery = req.query.q;
    if (!searchQuery) {
        return res.status(400).json({ error: "Enter search term!" });
    }

    const result = await searchExercisesByNameAndMuscleGroup(searchQuery);
    if (!result || result.length === 0) {
        return res.status(404).json({ error: "No exercises found" });
    }
    res.status(200).json(result);
}

module.exports = {
    getExerciseByIdJSON,
    searchExercisesJSON,
};