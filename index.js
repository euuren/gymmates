const express = require("express");
const bodyParser = require("body-parser");
const apiClubsRoutes = require("./routes/api_clubs.routes");
const apiExercisesRoutes = require("./routes/api_exercises.routes");
const apiUsersRoutes = require("./routes/api_users.routes");
const apiWorkoutsRoutes = require("./routes/api_workouts.routes");
const { loginHandler, requireAuthJWT } = require("./handlers/api_users.handlers");
const app = express();
const port = 3000;
const cors = require("cors");
const { insertUser } = require("./lib/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.post("/api/login", loginHandler);

const register = async (req, res) => {
    const userData = req.body;
    if (!userData.username || !userData.password || !userData.email) { 
        return res.status(400).json({ error: "Missing form data" });
    }
    userData.profileImage = 'uploads/placeholder.jpg';
    console.log(userData);
    userData.followers = [];
    userData.following = [];
    userData.irons = 0;
    userData.savedWorkouts = [];
    userData.myClubs = [];
    userData.myWorkouts = [];
    try {
        const user = await insertUser(userData);
        res.status(201).json(user);
    }
    catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

app.post("/api/register", register);
app.use("/api/users", requireAuthJWT, apiUsersRoutes);
app.use("/api/clubs", requireAuthJWT, apiClubsRoutes);
app.use("/api/exercises", requireAuthJWT, apiExercisesRoutes);
app.use("/api/workouts", requireAuthJWT, apiWorkoutsRoutes);
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});