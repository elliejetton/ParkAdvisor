class Park {

    /**Attributes for Park objects */
    ID = "";
    Name = "";
    Lat = "";
    Lon = "";
    Description = "";
    Code = "";
    Weather = "";

    constructor(data) {
        Object.assign(this, data);
    }

    toJSON() {
        return {
            id: this.ID,
            name: this.Name,
            lat: this.Lat,
            lon: this.Lon,
            description: this.Description,
            code: this.Code,
            weather: this.Weather
        }
    }

}

module.exports = Park;