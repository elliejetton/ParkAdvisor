const DBConnection = require('./DBConnection');
const User = require('./modules/User');
const crypto = require('crypto');

const db = new DBConnection();


module.exports = {
  registerUser: (username, password) => {
    return new Promise((resolve, reject) => {
      let salt = crypto.randomBytes(16).toString('hex');
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          reject("Error: " + err);
        } else {
          const digest = derivedKey.toString('hex');
          db.createQuery('INSERT INTO users (usr_username, usr_password, usr_salt) VALUES (?, ?, ?)', [username, digest, salt])
            .then(({ results }) => {
              resolve(results);
            })
            .catch((dbError) => {
              reject("Error inserting user into the database: " + dbError);
            });
        }
      });
    });
  },

  loginUser: async (username, password) => {
    return db.createQuery('SELECT * FROM users u WHERE u.usr_username=?', [username]).then(({ results }) => {
      let data = results[0];
      //console.log("******** " + data.usr_salt + "************");
      const user = new User({ UserName: data.usr_username, ID: data.usr_id, Avatar: data.usr_avatar }, data.usr_salt, data.usr_password);
      if (user) {
        return user.validateUser(password);
      }
      else {
        console.log("three");
        throw new Error("No Such User");
      }
    });
  },
  

};





