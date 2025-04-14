const {
    insertClub,
    updateClub,
    getClubById,
    deleteClub,
    searchClubs,
    joinClub,
    leaveClub,
    getUserById,
} = require("../lib/database");

const insertClubJSON = async (req, res) => {
    const club = req.body;
    if (!club.name || !club.description) {
        return res.status(400).json({ error: "Missing form data" });
    }
    club.profileImage = 'uploads/placeholder.jpg';
    club.members = [];
    club.members.push(req.user.uid);
    club.irons = 0;
    club.creator = req.user.uid;
    try {
        const newClub = await insertClub(club);
        res.status(201).json(newClub);
    }
    catch (error) {
        console.error("Error adding club:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateClubJSON = async (req, res) => {
    const clubId = req.params.id;
    const newData = req.body;
    if (!newData.name || !newData.description) {
        return res.status(400).json({ error: "Missing form data" });
    }
    // Check if the user is the creator of the club
    try {
        const updatedClub = await updateClub(clubId, newData, req.user.uid);
        if (updatedClub) {
            res.status(200).json(updatedClub);
        } else {
            res.status(404).json({ error: "Not authorised" });
        }
    } catch (error) {
        console.error("Error updating club name:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getClubByIdJSON = async (req, res) => {
    const clubId = req.params.id;
    try {
        const club = await getClubById(clubId);
        if (club) {
            res.status(200).json(club);
        } else {
            res.status(404).json({ error: "Club not found" });
        }
    } catch (error) {
        console.error("Error retrieving club:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteClubJSON = async (req, res) => {
    const clubId = req.params.id;
    try {
        const result = await deleteClub(clubId, req.user.uid);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Club deleted successfully" });
        } else {
            res.status(404).json({ error: "Club not found" });
        }
    } catch (error) {
        console.error("Error deleting club:", error);
        // check if the error is due to the user not being the creator
        res.status(500).json({ error: "Internal server error" });
    }

}

const searchClubsJSON = async (req, res) => {
    const searchQuery = req.query.q;
    if (!searchQuery) {
        return res.status(400).json({ error: "Enter search term!" });
    }
    const clubs = await searchClubs(searchQuery);
    if (!clubs || clubs.length === 0) {
        return res.status(404).json({ error: "No clubs found" });
    }
    res.status(200).json(clubs);
}

const joinClubJSON = async (req, res) => {
    const userId = req.user.uid;
    const clubId = req.params.id;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const club = await getClubById(clubId);
    if (!club) {
        return res.status(404).json({ error: "Club not found" });
    }
    if (currentUser.myClubs.includes(clubId)) {
        return res.status(400).json({ error: "Already joined this club" });
    }
    await joinClub(userId, clubId);
    res.status(200).json({ message: "Successfully joined club" });
}

const leaveClubJSON = async (req, res) => {
    const userId = req.user.uid;
    const clubId = req.params.id;
    const currentUser = await getUserById(userId);
    if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const club = await getClubById(clubId);
    if (!club) {
        return res.status(404).json({ error: "Club not found" });
    }
    if (!currentUser.myClubs.includes(clubId)) {
        return res.status(400).json({ error: "Not a member of this club" });
    }
    await leaveClub(userId, clubId);
    res.status(200).json({ message: "Successfully left club" });
}

module.exports = {
    insertClubJSON,
    updateClubJSON,
    getClubByIdJSON,
    deleteClubJSON,
    searchClubsJSON,
    joinClubJSON,
    leaveClubJSON,
};