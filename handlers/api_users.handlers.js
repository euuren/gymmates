const {
    getUserByEmail,
    getUserById,
    updateUser,
    followUser,
    unfollowUser,
    getAllFollowers,
    getAllFollowing,
    getAllMyClubs,
    getAllMySavedWorkouts,
    searchUsers,
    getAllMyWorkouts,
} = require("../lib/database");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "0000"; // Replace with your actual secret

const loginHandler = async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await getUserByEmail(email);
    if (foundUser && foundUser.password === password) {
        const userDetails = { uid: foundUser._id }
        const accessToken = jwt.sign(userDetails, JWT_SECRET, { expiresIn: "12h" });
        res.json({accessToken, userDetails});
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};

function requireAuthJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                res.sendStatus(401);
                return;
            }
        });
    } else { res.sendStatus(401); }
}

const getAUserByIdJSON = async (req, res) => {
    const userId = req.params.id;
    const user = await getUserById(userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
}

const updateUserJSON = async (req, res) => {
    const userId = req.params.id;
    const { username, email, height, weight } = req.body;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const profileImage = req.file ? req.file.path : currentUser.profileImage;
    if (!username || !email || !height || !weight) {
        return res.status(400).json("Missing form data");
    }
    const updatedUser = await updateUser(userId, { username, email, height, weight, profileImage });
    if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update user" });
    }
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
}

const followUserJSON = async (req, res) => {
    const userId = req.params.followerId;
    const targetUserId = req.params.followeeId;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const targetUser = await getUserById(targetUserId);
    if (!targetUser) {
        return res.status(404).json({ error: "Follow user not found" });
    }
    if (currentUser.following.includes(targetUserId)) {
        return res.status(400).json({ error: "Already following this user" });
    }
    await followUser(userId, targetUserId);
    res.status(200).json({ message: "Successfully followed user" });
}

const unfollowUserJSON = async (req, res) => {
    const userId = req.params.followerId;
    const targetUserId = req.params.followeeId;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const targetUser = await getUserById(targetUserId);
    if (!targetUser) {
        return res.status(404).json({ error: "Follow user not found" });
    }
    if (!currentUser.following.includes(targetUserId)) {
        return res.status(400).json({ error: "Not following this user" });
    }
    await unfollowUser(userId, targetUserId);
    res.status(200).json({ message: "Successfully unfollowed user" });
}

const searchUsersJSON = async (req, res) => {
    const searchQuery = req.query.q;
    if (!searchQuery) {
        return res.status(400).json({ error: "Enter search term!" });
    }
    const users = await searchUsers(searchQuery);
    if (!users || users.length === 0) {
        return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json(users);
}

const getAllFollowersJSON = async (req, res) => {
    const userId = req.user.uid;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const followers = await getAllFollowers(userId);
    res.status(200).json(followers);
}

const getAllFollowingJSON = async (req, res) => {
    const userId = req.user.uid;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const following = await getAllFollowing(userId);
    res.status(200).json(following);
}

const getAllMyClubsJSON = async (req, res) => {
    const userId = req.user.uid;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const clubs = await getAllMyClubs(userId);
    res.status(200).json(clubs);
}

const getAllMySavedWorkoutsJSON = async (req, res) => {
    const userId = req.user.uid;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const workouts = await getAllMySavedWorkouts(userId);
    res.status(200).json(workouts);
}

const getAllMyWorkoutsJSON = async (req, res) => {
    const userId = req.user.uid;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const workouts = await getAllMyWorkouts(userId);
    res.status(200).json(workouts);
}

module.exports = {
    loginHandler,
    requireAuthJWT,
    getAUserByIdJSON,
    updateUserJSON,
    followUserJSON,
    unfollowUserJSON,
    searchUsersJSON,
    getAllFollowersJSON,
    getAllFollowingJSON,
    getAllMyClubsJSON,
    getAllMySavedWorkoutsJSON,
    getAllMyWorkoutsJSON,
};