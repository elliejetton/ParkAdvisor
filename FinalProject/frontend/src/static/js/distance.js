import api from './APIClient.js';
const selectParkDropdown1 = document.createElement("select");
selectParkDropdown1.id = "origin";

const calculateBtn = document.createElement("button");
calculateBtn.id = "calculate";
calculateBtn.textContent = "Calculate Distance";
calculateBtn.classList.add("btn-format");


api.getParks().then(parks => {
    document.title = 'New Trip Page';
    let parkz = parks.results;
    for (let i = 0; i < parkz.length; i++) {
        let opt = parkz[i].prk_name;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectParkDropdown1.appendChild(el);
    }

});
selectParkDropdown1.classList.add("form-select")

const dropDiv = document.getElementById("distance");
selectParkDropdown1.classList.add("col-sm-4");
dropDiv.appendChild(selectParkDropdown1);

const selectParkDropdown2 = document.createElement("select");
selectParkDropdown2.id = "dest";

api.getParks().then(parks => {
    document.title = 'New Trip Page';
    let parkz = parks.results;
    for (let i = 0; i < parkz.length; i++) {
        let opt = parkz[i].prk_name;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectParkDropdown2.appendChild(el);
    }

});
selectParkDropdown2.classList.add("form-select")


selectParkDropdown2.classList.add("col-sm-4");
dropDiv.appendChild(selectParkDropdown2);
const calcDiv = document.createElement("div");
calcDiv.classList.add("col-sm-4");
calcDiv.appendChild(calculateBtn);
dropDiv.appendChild(calcDiv);








calculateBtn.addEventListener("click", async e => {
    const originPark = selectParkDropdown1.value;
    const destPark = selectParkDropdown2.value;


    let oLat = "";
    let oLong = "";
    let dLat = "";
    let dLong = "";


    await api.getParkByName(originPark).then(park => {
        oLat = park.lat;
        oLong = park.lon;
    });
    await api.getParkByName(destPark).then(park => {
        dLat = park.lat;
        dLong = park.lon;
    });
    const text = document.getElementById("disText");
    text.textContent = "loading...";
  
    await fetch(`https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${oLat},${oLong}&destinations=${dLat},${dLong}&key=H9iBvbYUJO35EzFCe3VRHtXNxtZfSQZpjtR2UC0kmKNRcUswa21t8mS5hLdb0rOq`).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {

            console.log(data);

            const distance = data.rows[0].elements[0].distance.text;
            const duration = data.rows[0].elements[0].duration.text;

            

            text.textContent = `Distance: ${distance}  Duration: ${duration}`;

            

           console.log(data.rows[0].elements[0]);


        })
        .catch(error => {

            text.textContent = `Cannot calculate distance for ${originPark} and ${destPark} `;
            console.error('Error during fetch:', error);
        });


});


