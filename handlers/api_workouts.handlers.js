const {
    insertWorkout,
    getWorkoutById,
    deleteWorkout,
    searchWorkouts,
    completeAWorkout,
    saveWorkout,
    unsaveWorkout,
    getUserById,
    editWorkout,
} = require("../lib/database");

const insertWorkoutJSON = async (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.duration 
        || !req.body.exercises || !req.body.irons) {
        return res.status(400).json({ error: "All fields are required" });
      }
    if (req.body.exercises.length === 0) {
        return res.status(400).json({ error: "At least one exercise is required" });
    }
    for (const exercise of req.body.exercises) {
        if (!exercise._id || !exercise.sets || !exercise.reps || !exercise.dumbbellWeight) {
            return res.status(400).json({ error: "Each exercise must have an id, sets, reps and dumbbell weight" });
        }
    }
    const workoutData = {
        title: req.body.title,
        description: req.body.description,
        creator: req.user.uid,
        duration: req.body.duration,
        exercises: req.body.exercises,
        irons: req.body.irons
      };
    
      const result = await insertWorkout(workoutData);
      
      if (result.success) {
        res.status(201).json({
          message: 'Workout created successfully',
          workoutId: result.insertedId,
          workout: result.workout
        });
      } else {
        res.status(400).json({ error: result.error });
      }
    }

const getWorkoutByIdJSON = async (req, res) => {
    const workoutId = req.params.id;
    try {
        const workout = await getWorkoutById(workoutId);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.status(200).json(workout);
    } catch (error) {
        console.error("Error fetching workout:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteWorkoutJSON = async (req, res) => {
    const workoutId = req.params.id;
    const userId = req.user.uid;
    try {
        const result = await deleteWorkout(workoutId, userId);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting workout:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const searchWorkoutsJSON = async (req, res) => {
    const searchQuery = req.query.q;
    if (!searchQuery) {
        return res.status(400).json({ error: "Enter search term!" });
    }

    const workouts = await searchWorkouts(searchQuery);
    if (!workouts || workouts.length === 0) {
        return res.status(404).json({ error: "No workouts found" });
    }
    res.status(200).json(workouts);
}

const completeAWorkoutJSON = async (req, res) => {
    const userId = req.user.uid;
    const workoutId = req.params.id;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const workout = await getWorkoutById(workoutId);
    if (!workout) {
        return res.status(404).json({ error: "Workout not found" });
    }
    const result = await completeAWorkout(workoutId, userId);
    if (!result) {
        return res.status(500).json({ error: "Failed to complete workout" });
    }
    res.status(200).json(result);
}

const saveWorkoutJSON = async (req, res) => {
    try {
        const userId = req.user.uid;
        const workoutId = req.params.id;
        const result = await saveWorkout(userId, workoutId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error saving workout:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const unsaveWorkoutJSON = async (req, res) => {
    try {
        const userId = req.user.uid;
        const workoutId = req.params.id;
        const result = await unsaveWorkout(userId, workoutId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error unsaving workout:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const editWorkoutJSON = async (req, res) => {
    const workoutId = req.params.id;
    const userId = req.user.uid;

    if (!req.body.title || !req.body.description || !req.body.duration 
        || !req.body.exercises || !req.body.irons) {
        return res.status(400).json({ error: "All fields are required" });
      }
    if (req.body.exercises.length === 0) {
        return res.status(400).json({ error: "At least one exercise is required" });
    }
    for (const exercise of req.body.exercises) {
        if (!exercise._id || !exercise.sets || !exercise.reps || !exercise.dumbbellWeight) {
            return res.status(400).json({ error: "Each exercise must have an id, sets, reps and dumbbell weight" });
        }
    }

    const workoutData = {
        title: req.body.title,
        description: req.body.description,
        creator: userId,
        duration: req.body.duration,
        exercises: req.body.exercises,
        irons: req.body.irons
      };
    
      const result = await editWorkout(workoutId, workoutData, userId);
      
      if (result) {
        res.status(200).json({
          message: 'Workout updated successfully',
          workoutId: result.insertedId,
          workout: result.workout
        });
      } else {
        res.status(400).json({ error: result.error });
      }
}

module.exports = {
    insertWorkoutJSON,
    getWorkoutByIdJSON,
    deleteWorkoutJSON,
    searchWorkoutsJSON,
    saveWorkoutJSON,
    unsaveWorkoutJSON,
    completeAWorkoutJSON,
    editWorkoutJSON,
};