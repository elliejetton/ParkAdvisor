
class Trip {
    /**The trips ID */
    ID = 0;
    /**The name of the trip */
    Name = ""
    /**The start date of the trip */
    date = ""
    /**The trips agenda information */
    agenda = []

    constructor(data) {
        Object.assign(this, data);
    }


    toJSON() {
        return {
            id: this.ID,
            name: this.Name,
            date: this.date,
            agenda: this.agenda
        }
    }

}

module.exports = Trip;