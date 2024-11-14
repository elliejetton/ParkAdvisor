const crytpo = require('crypto');

class User {

    /**The user name of the user */
    UserName = "default";
    /**The id of the user */
    ID = null;
    /**The reference to the user avatar */
    Avatar = "";
    /**The users password (private) */
    #password = null;;
    /**The users salt (private) */
    #salt = null;;

    constructor(data, salt, password) {
        Object.assign(this, data);
        this.#salt = salt;
        this.#password = password;
    }


    validateUser(password) {
        return new Promise((resolve, reject) => {
            crytpo.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if(err) {
                    console.log("****one");
                    reject("Error: " + err);
                }
                const digest = derivedKey.toString('hex');

                if(this.#password == digest) {
                    console.log("****user found");
                    resolve(this);
                }
                else {
                    console.log("two");
                    reject("Invalid user name or password");
                }
            });
        });
    }

    toJSON() {
        return {
            id: this.ID,
            username: this.UserName,
            avatar: this.Avatar,
        }
    }



}

module.exports = User;
