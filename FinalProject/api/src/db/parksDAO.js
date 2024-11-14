const DBConnection = require('./DBConnection.js');
const Park = require('./modules/Park.js');

//const NAT_PARKS_API = "AtAlzZTEqi3PNaezqCfZW8gYT3au9aAoqViSAyhI";
const db = new DBConnection();
// real park data will probably be pulled from the national
//parks service api
module.exports = {
    //return the list of parks
    getParks: async () => {
        return db.createQuery('SELECT * FROM parks ORDER BY prk_name').then(parks => {
            return parks;
        });
    },

    //get park by id, will have lat long, activities and description
    getParkById: async (idParam) => {
        const { results } = await db.createQuery('SELECT * FROM parks WHERE parks.prk_id=?', [idParam]);
        let data = results[0];
        let park = new Park({ ID: data.prk_id, Name: data.prk_name, Lat: data.prk_lat, Lon: data.prk_lon, Description: data.prk_description, Code: data.prk_code, Weather: data.prk_weather });
        if (park) {
            return park.toJSON();
        }
        else {
            throw new Error("No such park");
        }
    },
    getParkByName: async (nameParam) => {
        const { results } = await db.createQuery('SELECT * FROM parks WHERE parks.prk_name=?', [nameParam]);
        let data = results[0];
        let park = new Park({ ID: data.prk_id, Name: data.prk_name, Lat: data.prk_lat, Lon: data.prk_lon, Description: data.prk_description, Code: data.prk_code, Weather: data.prk_weather });
        if (park) {
            return park.toJSON();
        }
        else {
            throw new Error("No such park");
        }
    },

    //get travel time between two sets of lat/long
    getTimeByLatLong: (Parks) => {
        //i think this should be on the frontend using the
        //google distance api becuase this isn't information
        //we will store, its just info that we generate and then
        //show in real time
    },
    //get sunrise and sunset times of lat/long and date
    getSunByLatLongTime: (times) => {
        //i think this should be on the frontend using the
        //sunset sunrise api becuase this isn't information
        //we will store, its just info that we generate and then
        //show in real time

    },

    // createParksData: () => {

    //     const endpoint = `https://developer.nps.gov/api/v1/parks?limit=500&api_key=${NAT_PARKS_API}`;
    //     fetch(endpoint)
    //         .then(response => response.json())
    //         .then(data => {
    //             const nationalParks = data.data.filter(park => (park.fullName.includes("National Park")));

    //             //db.createQuery('DELETE FROM parks', []);
    //             nationalParks.forEach(parkData => {
    //                 const parkName = parkData.fullName;
    //                 const lat = parkData.latitude;
    //                 const lon = parkData.longitude;
    //                 const description = parkData.description;
    //                 const parkCode = parkData.parkCode;
    //                 const weatherInfo = parkData.weatherInfo;

    //                 /** */
    //                 return db.createQuery('INSERT INTO parks (prk_name, prk_code, prk_lat, prk_lon, prk_description, prk_weather) VALUES (?, ?, ?, ?, ?, ?)',
    //                     [parkName, parkCode, lat, lon, description, weatherInfo]).then(({ results }) => {
    //                         return results;
    //                     });


    //             });
    //         })
    //         .catch(error => {
    //             console.error("An error occurred:", error);
    //         });


    // }
}