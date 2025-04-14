// api.js - Consolidated API helper for the application
const SERVER_PREFIX = "http://localhost:3000/api";

const Api = {
    loginApi(email, password) {
        return fetch(`${SERVER_PREFIX}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
    },

    registerApi(userData) {
        return fetch(`${SERVER_PREFIX}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
    },

    searchUsersApi(query) {
        return fetch(`${SERVER_PREFIX}/users/search?q=${query}`, { 
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },
    
    getUserByIdApi(id) {
        return fetch(`${SERVER_PREFIX}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },
    
    updateUserApi(id, userData) {
        const formData = new FormData();
        for (const key in userData) {
            formData.append(key, userData[key]);
        }
    
        return fetch(`${SERVER_PREFIX}/users/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: formData
        });
    },
    
    followUserApi(followerId, followeeId) {
        return fetch(`${SERVER_PREFIX}/users/${followerId}/follow/${followeeId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },
    
    unfollowUserApi(followerId, followeeId) {
        return fetch(`${SERVER_PREFIX}/users/${followerId}/unfollow/${followeeId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },
    
    getFollowersApi(id) {
        return fetch(`${SERVER_PREFIX}/users/${id}/followers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },
    
    getFollowingApi(id) {
        return fetch(`${SERVER_PREFIX}/users/${id}/following`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },
    
    getMyClubsApi(id) {
        return fetch(`${SERVER_PREFIX}/users/${id}/my-clubs`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },
    
    getMySavedWorkoutsApi(id) {
        return fetch(`${SERVER_PREFIX}/users/${id}/my-saved-workouts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },
    
    getMyWorkoutsApi(id) {
        return fetch(`${SERVER_PREFIX}/users/${id}/my-workouts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },
    
    searchClubsApi(query) {
        return fetch(`${SERVER_PREFIX}/clubs/search?q=${query}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },
    
    getClubByIdApi(id) {
        return fetch(`${SERVER_PREFIX}/clubs/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },
    
    updateClubApi(id, clubData) {
        return fetch(`${SERVER_PREFIX}/clubs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(clubData),
        });
    },
    
    insertClubApi(clubData) {
        return fetch(`${SERVER_PREFIX}/clubs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(clubData),
        });
    },
    
    deleteClubApi(id) {
        return fetch(`${SERVER_PREFIX}/clubs/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },
    
    joinClubApi(clubId) {
        return fetch(`${SERVER_PREFIX}/clubs/${clubId}/members`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },
    
    leaveClubApi(clubId) {
        return fetch(`${SERVER_PREFIX}/clubs/${clubId}/members`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },

    getExerciseByIdApi(id) {
        return fetch(`${SERVER_PREFIX}/exercises/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },

    searchExercisesApi(query) {
        return fetch(`${SERVER_PREFIX}/exercises/search?q=${query}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },
    
    insertWorkoutApi(workoutData) {
        return fetch(`${SERVER_PREFIX}/workouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(workoutData),
        });
    },

    searchWorkoutsApi(query) {
        return fetch(`${SERVER_PREFIX}/workouts/search?q=${query}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },

    getWorkoutByIdApi(id) {
        return fetch(`${SERVER_PREFIX}/workouts/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },

    deleteWorkoutApi(id) {
        return fetch(`${SERVER_PREFIX}/workouts/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },

    editWorkoutApi(id, workoutData) {
        return fetch(`${SERVER_PREFIX}/workouts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(workoutData),
        });
    },

    saveWorkoutApi(id) {
        return fetch(`${SERVER_PREFIX}/workouts/${id}/save`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },

    unsaveWorkoutApi(id) {
        return fetch(`${SERVER_PREFIX}/workouts/${id}/unsave`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    },

    completeAWorkoutApi(id) {
        return fetch(`${SERVER_PREFIX}/workouts/${id}/complete`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    }
};

export default Api;