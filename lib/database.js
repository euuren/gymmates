const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
let client = null;
let collectionUsers = null;
let collectionExercises = null;
let collectionWorkouts = null;
let collectionClubs = null;

const uri = "mongodb+srv://euren:1234@gymmates.gjrel.mongodb.net/forum?retryWrites=true&w=majority";

async function initDBIfNecessary() {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        try {
            await client.connect();
            await client.db("admin").command({ ping: 1 });
            console.log("Successfully connected to MongoDB Atlas!");
            
            const db = client.db("Gymmates");
            collectionUsers = db.collection("Users");
            collectionClubs = db.collection("Clubs");
            collectionWorkouts = db.collection("Workouts");
            collectionExercises = db.collection("Exercises");
        } catch (err) {
            console.error("Error connecting to MongoDB Atlas:", err);
            throw err;
        }
    }
}

async function disconnect() {
    if (client) {
        await client.close();
        client = null;
        console.log("Disconnected from MongoDB Atlas");
    }
}

async function insertUser(user) {
    await initDBIfNecessary();
    const result = await collectionUsers.insertOne(user);
    user._id = result.insertedId.toString();
    return user;
}

async function getUserByEmail(email) {
    await initDBIfNecessary();
    return await collectionUsers.findOne({ email: email });
}

async function getUserById(userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
  
    if (!user) {
      throw new Error("User not found");
    }
    return user;
}

async function followUser(userId, targetUserId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const followUser = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(targetUserId),
    });
    if (!user || !followUser) {
      throw new Error("User not found");
    }
    if (user.following.includes(targetUserId)) {
      throw new Error("You are already following this user");
    }
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(userId)
    }, {
      $push: {
        following: targetUserId
      }
    });
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(targetUserId)
    }, {
      $push: {
        followers: userId
      }
    });
    const updatedUser = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId)
    });
    const updatedFollowUser = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(targetUserId)
    });
    if (!updatedUser || !updatedFollowUser) {
      throw new Error("User not found");
    }
    return updatedUser
}

async function updateUser(userId, user) {
    await initDBIfNecessary();
    const { username, email, height, weight, profileImage} = user;
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(userId)
    }, {
      $set: {
        username,
        email,
        profileImage,
        height,
        weight
      }
    });
    const updatedUser = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId)
    });
    if (!updatedUser) {
      throw new Error("Unable to update user");
    }
    return updatedUser;
}

async function unfollowUser(userId, targetUserId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const followUser = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(targetUserId),
    });
    if (!user || !followUser) {
      throw new Error("User not found");
    }
    if (!user.following.includes(targetUserId)) {
      throw new Error("You are already not following this user");
    }
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(userId)
    }, {
      $pull: {
        following: targetUserId
      }
    });
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(targetUserId)
    }, {
      $pull: {
        followers: userId
      }
    });
    const updatedUser = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId)
    });
    const updatedFollowUser = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(targetUserId)
    });
    if (!updatedUser || !updatedFollowUser) {
      throw new Error("User not found");
    }
    return updatedUser
}

async function searchUsers(username) {
    await initDBIfNecessary();
    return await collectionUsers.find({ username: { $regex: username, $options: "i" } }).toArray();
}

async function searchClubs(name) {
    await initDBIfNecessary();
    return await collectionClubs.find({ name: { $regex: name, $options: "i" } }).toArray();
}

async function searchWorkouts(title) {
    await initDBIfNecessary();
    return await collectionWorkouts.find({ title: { $regex: title, $options: "i" } }).toArray();
}

async function getExerciseById(exerciseId) {
    await initDBIfNecessary();
    const exercise = await collectionExercises.findOne({
      _id: ObjectId.createFromHexString(exerciseId),
    });
  
    if (!exercise) {
      throw new Error("Exercise not found");
    }
    return exercise;
}

async function insertClub(club) {
    await initDBIfNecessary();
    const result = await collectionClubs.insertOne(club);
    club._id = result.insertedId.toString();
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(club.creator)
    }, {
      $push: {
        myClubs: club._id
      }
    });
    return club;
}

async function getClubById(clubId) {
    await initDBIfNecessary();
    const club = await collectionClubs.findOne({
      _id: ObjectId.createFromHexString(clubId),
    });
  
    if (!club) {
      throw new Error("Club not found");
    }
    return club;
}

async function joinClub(userId, clubId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const club = await collectionClubs.findOne({
      _id: ObjectId.createFromHexString(clubId),
    });
    if (!user || !club) {
      throw new Error("User or club not found");
    }
    if (user.myClubs.includes(clubId)) {
      throw new Error("You are already a member of this club");
    }
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(userId)
    }, {
      $push: {
        myClubs: clubId
      }
    });
    await collectionClubs.updateOne({
      _id: ObjectId.createFromHexString(clubId)
    }, {
      $push: {
        members: userId
      }
    });
}

async function leaveClub(userId, clubId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const club = await collectionClubs.findOne({
      _id: ObjectId.createFromHexString(clubId),
    });
    if (!user || !club) {
      throw new Error("User or club not found");
    }
    if (!user.myClubs.includes(clubId)) {
      throw new Error("You are already not a member of this club");
    }
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(userId)
    }, {
      $pull: {
        myClubs: clubId
      }
    });
    await collectionClubs.updateOne({
      _id: ObjectId.createFromHexString(clubId)
    }, {
      $pull: {
        members: userId
      }
    });
}

async function getAllFollowers(userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    if (!user) {
      throw new Error("User not found");
    }
    const followers = await collectionUsers.find({
      _id: { $in: user.followers.map(id => ObjectId.createFromHexString(id)) }
    }).toArray();
    return followers;
}

async function getAllFollowing(userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    if (!user) {
      throw new Error("User not found");
    }
    const following = await collectionUsers.find({
      _id: { $in: user.following.map(id => ObjectId.createFromHexString(id)) }
    }).toArray();
    return following;
}

async function getAllMyClubs(userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    if (!user) {
      throw new Error("User not found");
    }
    const myClubs = await collectionClubs.find({
      _id: { $in: user.myClubs.map(id => ObjectId.createFromHexString(id)) }
    }).toArray();
    return myClubs;
}

async function getAllMySavedWorkouts(userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    if (!user) {
      throw new Error("User not found");
    }
    const mySavedWorkouts = await collectionWorkouts.find({
      _id: { $in: user.savedWorkouts.map(id => ObjectId.createFromHexString(id)) }
    }).toArray();
    return mySavedWorkouts;
}

async function updateClub(clubId, newData, userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const club = await collectionClubs.findOne({
      _id: ObjectId.createFromHexString(clubId),
    });
    // check if the user trying to delete the club is the creator of the club
    if (user._id != club.creator) {
      throw new Error("You are not the creator of this club");
    }
    if (!club) {
      throw new Error("Club not found");
    }
    const { name, description, profileImage} = newData;
    const result = await collectionClubs.updateOne(
        { _id: ObjectId.createFromHexString(clubId) }
        , {
          $set: {
            name,
            description,
            profileImage
          }
        });
    const updatedClub = await collectionClubs.findOne({
      _id: ObjectId.createFromHexString(clubId),
    });
    if (!updatedClub) {
      throw new Error("Unable to update club");
    }
    return updatedClub;
}

async function deleteClub(clubId, userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const club = await collectionClubs.findOne({
      _id: ObjectId.createFromHexString(clubId),
    });
    // check if the user trying to delete the club is the creator of the club
    if (user._id != club.creator) {
      throw new Error("You are not the creator of this club");
    }
    if (!club) {
      throw new Error("Club not found");
    }
    // remove the club from all members' "myClubs" field
    for (const memberId of club.members) {
      await collectionUsers.updateOne({
        _id: ObjectId.createFromHexString(memberId)
      }, {
        $pull: {
          myClubs: clubId
        }
      });
    }
    const result = await collectionClubs.deleteOne({
        _id: ObjectId.createFromHexString(clubId),
    });
    return result;
}

async function saveWorkout(userId, workoutId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const workout = await collectionWorkouts.findOne({
      _id: ObjectId.createFromHexString(workoutId),
    });
    if (!user || !workout) {
      throw new Error("User or workout not found");
    }
    if (user.savedWorkouts.includes(workoutId)) {
      throw new Error("You have already saved this workout");
    }
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(userId)
    }, {
      $push: {
        savedWorkouts: workoutId
      }
    });
    await collectionWorkouts.updateOne({
      _id: ObjectId.createFromHexString(workoutId)
    }, {
      $push: {
        saved: userId
      }
    });
    const updatedUser = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId)
    });

    return updatedUser;
}

async function unsaveWorkout(userId, workoutId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const workout = await collectionWorkouts.findOne({
      _id: ObjectId.createFromHexString(workoutId),
    });
    if (!user || !workout) {
      throw new Error("User or workout not found");
    }
    if (!user.savedWorkouts.includes(workoutId)) {
      throw new Error("You have already unsaved this workout");
    }
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(userId)
    }, {
      $pull: {
        savedWorkouts: workoutId
      }
    });
    await collectionWorkouts.updateOne({
      _id: ObjectId.createFromHexString(workoutId)
    }, {
      $pull: {
        saved: userId
      }
    });
    const updatedUser = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId)
    });
    return updatedUser;
}

async function insertWorkout(workoutData) {
  try {
    await initDBIfNecessary();

    const newWorkout = {
      title: workoutData.title,
      description: workoutData.description,
      saved: [],
      duration: workoutData.duration,
      creator: workoutData.creator,
      irons: workoutData.irons,
      exercises: workoutData.exercises.map(ex => ({
        exerciseId: ex._id,
        dumbbellWeight: ex.dumbbellWeight,
        reps: ex.reps,
        sets: ex.sets
      })),
      createdAt: new Date()
    };

    const result = await collectionWorkouts.insertOne(newWorkout);
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(workoutData.creator)
    }, {
      $push: {
        myWorkouts: result.insertedId.toString()
      }
    });
    if (result.insertedCount === 0) {
      throw new Error("Failed to insert workout");
    }
    return {
      success: true,
      insertedId: result.insertedId,
      workout: newWorkout
    };
  } catch (error) {
    console.error('Error inserting workout:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function getWorkoutById(workoutId) {
    await initDBIfNecessary();
    const workout = await collectionWorkouts.findOne({
      _id: ObjectId.createFromHexString(workoutId),
    });
  
    if (!workout) {
      throw new Error("Workout not found");
    }
    return workout;
}

async function searchExercisesByNameAndMuscleGroup(searchTerm) {
    await initDBIfNecessary();
    const exercises = await collectionExercises.find({
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { muscleGroup: { $regex: searchTerm, $options: 'i' } }
        ]
    }).toArray();
    return exercises;
}

async function deleteWorkout(workoutId, userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const workout = await collectionWorkouts.findOne({
      _id: ObjectId.createFromHexString(workoutId),
    });
    // check if the user trying to delete the workout is the creator of the workout
    if (user._id != workout.creator) {
      throw new Error("You are not the creator of this workout");
    }
    if (!workout) {
      throw new Error("Workout not found");
    }
    // remove the workout from all users' "savedWorkouts" field
    for (const savedUserId of workout.saved) {
      await collectionUsers.updateOne({
        _id: ObjectId.createFromHexString(savedUserId)
      }, {
        $pull: {
          savedWorkouts: workoutId
        }
      });
    }
    // remove the workout from the creator's "myWorkouts" field
    await collectionUsers.updateOne({
      _id: ObjectId.createFromHexString(userId)
    }, {
      $pull: {
        myWorkouts: workoutId
      }
    });
    // remove the workout from the database
    const result = await collectionWorkouts.deleteOne({
        _id: ObjectId.createFromHexString(workoutId),
    });
    return result;
}

async function completeAWorkout(workoutId, userId) {
    await initDBIfNecessary();
    const workoutResult = await collectionWorkouts.findOne({
        _id: ObjectId.createFromHexString(workoutId),
    });
    if (!workoutResult) {
        throw new Error("Workout not found");
    }
    const userResult = await collectionUsers.findOne({
        _id: ObjectId.createFromHexString(userId),
    });
    if (!userResult) {
        throw new Error("User not found");
    }
    if (workoutResult.irons === "1") {
        await collectionUsers.updateOne({
            _id: ObjectId.createFromHexString(userId)
        }, {
            $set:{
                irons: userResult.irons + 1
            }
        });
    }
    if (workoutResult.irons === "2") {
        await collectionUsers.updateOne({
            _id: ObjectId.createFromHexString(userId)
        }, {
            $set:{
                irons: userResult.irons + 2
            }
        });
    }
    if (workoutResult.irons === "3") {
        await collectionUsers.updateOne({
            _id: ObjectId.createFromHexString(userId)
        }, {
            $set:{
                irons: userResult.irons + 3
            }
        });
    }
    
    const updatedUser = await collectionUsers.findOne({
        _id: ObjectId.createFromHexString(userId)
    });
    if (!updatedUser) {
        throw new Error("Unable to update user");
    }
    return updatedUser;
}

async function editWorkout(workoutId, workoutData, userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    const existingWorkout = await collectionWorkouts.findOne({
      _id: ObjectId.createFromHexString(workoutId),
    });
    // check if the user trying to edit the workout is the creator of the workout
    if (user._id != existingWorkout.creator) {
      throw new Error("You are not the creator of this workout");
    }

    if (!user || !existingWorkout) {
      throw new Error("User or workout not found");
    }
    
    const newData = {
      title: workoutData.title,
      description: workoutData.description,
      duration: workoutData.duration,
      creator: workoutData.creator,
      irons: workoutData.irons,
      exercises: workoutData.exercises.map(ex => ({
        exerciseId: ex._id,
        dumbbellWeight: ex.dumbbellWeight,
        reps: ex.reps,
        sets: ex.sets
      })),
    };
    const { saved, ...rest } = newData; // Exclude the 'saved' field from being updated
    if (!existingWorkout) {
      throw new Error("Workout not found");
    }
    await collectionWorkouts.updateOne(
      { _id: ObjectId.createFromHexString(workoutId) }
      , {
      $set: { ...rest, saved: existingWorkout.saved } // Ensure 'saved' remains unchanged
      });
    const updatedWorkout = await collectionWorkouts.findOne({
      _id: ObjectId.createFromHexString(workoutId),
    });
    if (!updatedWorkout) {
      throw new Error("Unable to update workout");
    }
    return updatedWorkout;
}

async function getAllMyWorkouts(userId) {
    await initDBIfNecessary();
    const user = await collectionUsers.findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    if (!user) {
      throw new Error("User not found");
    }
    const myWorkouts = await collectionWorkouts.find({
      _id: { $in: user.myWorkouts.map(id => ObjectId.createFromHexString(id)) }
    }).toArray();
    return myWorkouts;
}

module.exports = {
    getUserByEmail,
    disconnect,
    insertUser,
    getUserById,
    updateUser,
    getExerciseById,
    insertClub,
    updateClub,
    getClubById,
    deleteClub,
    insertWorkout,
    getWorkoutById,
    deleteWorkout,
    followUser,
    unfollowUser,
    searchUsers,
    searchClubs,
    searchWorkouts,
    joinClub,
    leaveClub,
    saveWorkout,
    unsaveWorkout,
    getAllFollowers,
    getAllFollowing,
    getAllMyClubs,
    getAllMySavedWorkouts,
    getAllMyWorkouts,
    searchExercisesByNameAndMuscleGroup,
    completeAWorkout,
    editWorkout,
};