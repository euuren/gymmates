const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");

const {
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
} = require("../handlers/api_users.handlers");

router.get("/search", searchUsersJSON);
router.get("/:id", getAUserByIdJSON);
router.put("/:id", upload.single("profileImage"), updateUserJSON);
router.post("/:followerId/follow/:followeeId", followUserJSON);
router.delete("/:followerId/unfollow/:followeeId", unfollowUserJSON);
router.get("/:id/followers", getAllFollowersJSON);
router.get("/:id/following", getAllFollowingJSON);
router.get("/:id/my-clubs", getAllMyClubsJSON);
router.get("/:id/my-saved-workouts", getAllMySavedWorkoutsJSON);
router.get("/:id/my-workouts", getAllMyWorkoutsJSON);

module.exports = router;