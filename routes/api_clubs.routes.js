const express = require("express");
const router = express.Router();

const {
    insertClubJSON,
    updateClubJSON,
    getClubByIdJSON,
    deleteClubJSON,
    searchClubsJSON,
    joinClubJSON,
    leaveClubJSON,
} = require("../handlers/api_clubs.handlers");

router.get("/search", searchClubsJSON);
router.get("/:id", getClubByIdJSON);
router.put("/:id", updateClubJSON);
router.post("/", insertClubJSON);
router.delete("/:id", deleteClubJSON);
router.post("/:id/members", joinClubJSON);
router.delete("/:id/members", leaveClubJSON);

module.exports = router;