const { json } = require('express');
const DBConnection = require('./DBConnection.js');
const db = new DBConnection();
const Trip = require('./modules/Trip.js');

module.exports = {
    //post trip
    //     `trp_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    //   PRIMARY KEY(`trp_id`),
    //   `usr_id` int(11) unsigned NOT NULL,
    //   KEY `FK_USR_ID` (`usr_id`),
    //   `trp_name` varchar(201) NOT NULL,
    //   `trip_start_date` DATE NOT NULL,
    //
    //

    // `trc_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    //   PRIMARY KEY(`trc_id`),
    //   `trp_id` int(11) unsigned NOT NULL,
    //  KEY `FK_TRP_ID` (`trp_id`),
    //  `trc_date_visited` DATE NOT NULL,
    //  `trc_prk_name` varchar(201) NOT NULL,
    createTrip: async (trip, user) => {
        const { results } = await db.createQuery('INSERT INTO trips (usr_id, trp_name, trip_start_date) VALUES (?, ?, ?)', [user.id, trip.name, trip.date]);
        console.log(results);

        // for(let i = 0; i < trip.agenda.length; i++) {
        //     let data = trip.agenda[i];
        //     db.createQuery('INSERT INTO trips_records (trp_id, trc_date_visited, trc_prk_name) VALUES (?, ?, ?)', [results.insertId, i, data.name]);
        // }
        console.log(trip.agenda);
        let day = 0;
        //trip.agenda.reverse();
        trip.agenda.forEach( e => {
            //console.log('****' + e[0].name);
           e.forEach(async e2  => {
                await db.createQuery('INSERT INTO trips_records (trp_id, trc_date_visited, trc_prk_name) VALUES (?, ?, ?)', [results.insertId, day, e2.name]);
            });
            day++;
        });

        return results;
    },
    //update trip
    updateTrip: async (trip, user) => {
        const { results } = await db.createQuery('SELECT trp_id FROM trips WHERE trp_name = ?', [trip.name]);
        let id = results[0].trp_id;
        /**Delete the existing trip record */
        await db.createQuery('DELETE FROM trips_records WHERE trp_id = ?', [id]);
        await db.createQuery('DELETE FROM trips WHERE trp_id = ?', [id]);
        // const { results3 } = await db.createQuery('SELECT trp_id FROM trips WHERE trp_id = ?', [id]);
        // console.log(results3);
        /**Insert updated record with ID from old record */
        const { results2 } = await db.createQuery('INSERT INTO trips (trp_id, usr_id, trp_name, trip_start_date) VALUES (?, ?, ?, ?)', [id, user.id, trip.name, trip.date]);
        let day = 0;
        //trip.agenda.reverse();
        trip.agenda.forEach( e => {
            //console.log('****' + e[0].name);
           e.forEach(async e2  => {
                await db.createQuery('INSERT INTO trips_records (trp_id, trc_date_visited, trc_prk_name) VALUES (?, ?, ?)', [id, day, e2.name]);
            });
            day++;
        });

        console.log(results2);
        return results;
    },

    //delete trip
    deleteTrip: async (name) => {
        const { results } = await db.createQuery('SELECT trp_id FROM trips WHERE trp_name = ?', [name]);
        
        db.createQuery('DELETE FROM trips_records WHERE trp_id = ?', [results[0].trp_id]);
        db.createQuery('DELETE FROM trips WHERE trp_id = ?', [results[0].trp_id]);
        return name;
    },
    getUserTrips: async (id) => {
        const { results } = await db.createQuery('SELECT * FROM trips t WHERE t.usr_id=?', [id]);
        return results;
    },
    getUserTripsWithRecords: async (id) => {
        const { results } = await db.createQuery('SELECT * FROM trips t JOIN trips_records tr ON t.trp_id = tr.trp_id WHERE t.usr_id=?', [id]);
        return results;
    },
    getTripWithRecordsByName: async (name) => {
        const { results } = await db.createQuery('SELECT * FROM trips t JOIN trips_records tr ON t.trp_id = tr.trp_id WHERE t.trp_name=?', [name]);
        let tagenda = [];
        results.forEach(e => {
            let ob = {
                date_visited: e.trc_date_visited,
                name: e.trc_prk_name,
                id: e.trc_id,
            }
            tagenda.push(ob);
        });
        let date = new Date(results[0].trip_start_date).toISOString();
        console.log(date);
        let trip = new Trip({ID: results[0].trp_id, Name: results[0].trp_name, date:  date.split('T')[0] , agenda: tagenda});
        return trip.toJSON();
    },
}