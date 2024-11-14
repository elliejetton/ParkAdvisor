import HTTPClient from './HTTPClient.js';


export default {
    getParks: async () => {
        return HTTPClient.get('/api/parks');
    },

    initializeParks : async () => {
        return HTTPClient.post('/api/create/parks', {});
    },

    getTrips: async () => {
        return HTTPClient.get('/api/trips');
    },
    
    getParkById: async (id) => {
        return HTTPClient.get(`/api/parks/${id}`);
    },
    getParkByName: async (name) => {
        return HTTPClient.get(`/api/parks/${name}`);
    },

    getTripByUserId: async () => {
        return HTTPClient.get(`/api/trips/user`);
    },

    getTripWithRecordsByName: async (name) => {
        return HTTPClient.get(`/api/trips/${name}`);
    },

    userLogin: async (username, password) => {
        let data = {
            'username': username,
            'password': password
        }
        return HTTPClient.post(`/api/user/login`, data);

    },

    userLogout: async () => {
        return HTTPClient.post(`/api/user/logout`, {});
    },

    fetchUser: async () => {
        return HTTPClient.get(`/api/user/active`);
    },

    createUser: async (username, password) => {
        let data = {
            'username': username,
            'password': password
        }
        return HTTPClient.post(`/api/user/create`, data);

    },
    createTrip: async(park) => {
        return HTTPClient.post(`/api/trips`, park);
    },

    deleteTrip: async(trip) => {
        return HTTPClient.delete(`/api/trips`, trip);
    },

    updateTrip: async(trip) => {
        return HTTPClient.put(`/api/trips`, trip);
    }

}