
import api from './APIClient.js';
const addedParksByDay = [];
let ogName = "";

// Function to add a park to the array for a specific day
function addPark(dayIndex, parkName) {
    if (!addedParksByDay[dayIndex]) {
        addedParksByDay[dayIndex] = [];
    }
    addedParksByDay[dayIndex].push({ name: parkName });
}

// Function to remove a park from the array for a specific day
function removePark(dayIndex, parkIndex) {
    console.log(dayIndex);
    console.log(parkIndex);
    if (addedParksByDay[dayIndex]) {
        console.log(addedParksByDay);
        addedParksByDay[dayIndex].splice(parkIndex, 1);
        console.log(addedParksByDay);
    }
}


function removeDay(dayIndex) {
    if (addedParksByDay[dayIndex]) {
        // Remove the day from the array
        addedParksByDay.splice(dayIndex, 1);

    }
    // Remove the day's HTML element
    console.log("here");
    const dayElement = document.getElementById(`day${dayIndex + 1}`);
    if (dayElement) {
        console.log(dayElement);
        dayElement.remove();
        // Update day numbers in the remaining days


        const remainingDays = document.querySelectorAll('.day');
        remainingDays.forEach((day, index) => {
            // Extract the day number from the day's id attribute
            const dayNumber = parseInt(day.id.replace('day', ''));

            // Update day numbers after the deleted day
            if (dayNumber > (dayIndex + 1)) {
                day.querySelector('h5').textContent = `Day ${dayNumber - 1}`;
                day.id = `day${dayNumber - 1}`;
                const deleteDayBtn = day.querySelector('.deleteDayBtn');
                if (deleteDayBtn) {
                    deleteDayBtn.dataset.day = `day${dayNumber - 1}`;
                }
                const addParkBtn = day.querySelector('.addParkBtn');
                if (addParkBtn) {
                    addParkBtn.dataset.day = `day${dayNumber - 1}`;
                }
                const parkSelect = day.querySelector('.form-select');
                if (parkSelect) {
                    parkSelect.dataset.day = `day${dayNumber - 1}`;
                }
            }
        });
    }


}

async function addParkToUI(parksOnDayDiv, dayIndexInput, newDayId, selectedPark) {


    // Create a new div element to hold the selected park and sunrise, sunset information
    const parkDiv = document.createElement("div");
    parkDiv.id = "parkDiv"
    parkDiv.classList.add("container-fluid");
    const sunDiv = document.createElement("div");
    sunDiv.classList.add("row");
    const setDiv = document.createElement("div");
    const riseDiv = document.createElement("div");
    setDiv.classList.add("col-sm-5");
    riseDiv.classList.add("col-sm-5");
    const setHead = document.createElement("p");
    const riseHead = document.createElement("p");

    const parkNameDiv = document.createElement("div");
    parkNameDiv.classList.add("row");

    const parkName = document.createElement("h6");
    parkName.classList.add("col-sm-12");

    // Add "Delete park" button
    const deleteParkBtn = document.createElement("button");
    deleteParkBtn.classList.add("deleteParkBtn", "btn", "col-sm-2");
    deleteParkBtn.dataset.day = newDayId;
    deleteParkBtn.textContent = "x";

    sunDiv.appendChild(deleteParkBtn);


    //get the park and the lat and long to calculate data
    await api.getParkByName(selectedPark).then(park => {

        parkName.textContent = park.name;
        parkNameDiv.appendChild(parkName);
        let lat = park.lat;
        let long = park.lon;


        let dayIndex = dayIndexInput;
        addPark(dayIndex, selectedPark);
        let date = document.getElementById("tripDate").value;

        console.log(date);

        deleteParkBtn.addEventListener("click", e => {
            dayIndex = dayIndexInput;
            const parkIndex = addedParksByDay[dayIndex]?.findIndex(park => park.name === selectedPark);
            console.log(selectedPark);
            if (parkIndex !== -1) {
                removePark(dayIndex, parkIndex);
                parkDiv.remove();
            }
            console.log(addedParksByDay);
        })


        fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${long}&date=${date}`).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(data => {

                riseHead.textContent = `Sunrise:  ${data.results.sunrise}`;
                setHead.textContent = `Sunset: ${data.results.sunset}`;

                setDiv.appendChild(setHead);
                riseDiv.appendChild(riseHead);

                sunDiv.appendChild(riseDiv);
                sunDiv.appendChild(setDiv);
                parkDiv.appendChild(sunDiv);
                parkDiv.appendChild(parkNameDiv);


            })
            .catch(error => {

                console.error('Error during fetch:', error);
            });


    });


    // Append the new div to the corresponding "parksOnDay" div

    parksOnDayDiv.appendChild(parkDiv);
}

function loadExistingTrip(existingTrip) {
    document.getElementById("tripName").value = existingTrip.name;
    console.log(existingTrip.date);
    document.getElementById("tripDate").value = existingTrip.date;

    // Loop through each day in the agenda
    console.log(existingTrip.agenda);
    existingTrip.agenda.sort((a, b) => a.id - b.id);

    existingTrip.agenda.forEach(async (dayParks, dayIndex) => {
        console.log(dayParks);
        console.log(dayIndex);
        const newDayId = `day${dayIndex + 1}`;

        // Create a new day div
        const newDayDiv = document.createElement("div");
        newDayDiv.id = newDayId;
        newDayDiv.classList.add("day", "container-fluid");

        //create delete day 
        //create add park btn and drop down
        //row one
        const row1 = document.createElement("div");
        //row1.id = newDayId;
        row1.classList.add("row");

        // Add "Delete Day" button
        const deleteDayBtn = document.createElement("button");
        deleteDayBtn.classList.add("deleteDayBtn", "btn", "col-sm-1");
        deleteDayBtn.dataset.day = newDayId;
        deleteDayBtn.textContent = "x";

        row1.appendChild(deleteDayBtn);

        deleteDayBtn.addEventListener("click", function () {
            const dayIndex = parseInt(deleteDayBtn.dataset.day.slice(-1)) - 1; // Assuming day IDs are numerical (e.g., day1, day2)
            console.log(`newDayIndex ${newDayId} dayIndex ${dayIndex}`);
            removeDay(dayIndex);
        });

        // Add heading for the day
        const dayHeading = document.createElement("h5");
        dayHeading.textContent = "Day " + (document.querySelectorAll('.day').length + 1);
        dayHeading.classList.add("col-sm-11");
        row1.appendChild(dayHeading);
        newDayDiv.appendChild(row1);

        // Add container for parks on this day
        const parksOnDayDiv = document.createElement("div");
        parksOnDayDiv.classList.add("parksOnDay", "row");
        newDayDiv.appendChild(parksOnDayDiv);

        //row two
        const row2 = document.createElement("div");
        //row2.id = newDayId;
        row2.classList.add("row", "no-gutter");

        // Add dropdown for parks
        const selectParkId = "selectPark" + (document.querySelectorAll('.day').length + 1);


        //fill dropdown with parks
        const selectParkDropdown = document.createElement("select");
        selectParkDropdown.id = selectParkId;
        selectParkDropdown.dataset.day = newDayId;
        api.getParks().then(parks => {
            document.title = 'New Trip Page';
            let parkz = parks.results;
            for (let i = 0; i < parkz.length; i++) {
                let opt = parkz[i].prk_name;
                let el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                selectParkDropdown.appendChild(el);
            }

        });
        selectParkDropdown.classList.add("form-select")

        const dropDiv = document.createElement("div");
        dropDiv.classList.add("col-sm-8");
        dropDiv.appendChild(selectParkDropdown);
        row2.appendChild(dropDiv);

        // Add "Add Park" button
        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("col-sm-4", "addParkDiv");
        const addParkBtn = document.createElement("button");
        addParkBtn.classList.add("addParkBtn");
        addParkBtn.dataset.day = newDayId;
        addParkBtn.textContent = "Add Park";
        buttonDiv.appendChild(addParkBtn);
        row2.appendChild(buttonDiv);
        newDayDiv.appendChild(row2);



        // Add the new day div to the days container


        // Add the new day div to the days container
        document.getElementById("daysContainer").appendChild(newDayDiv);

        addParkBtn.addEventListener("click", async function () {
            const selectedPark = selectParkDropdown.value;
            const dayIndex = parseInt(addParkBtn.dataset.day.slice(-1)) - 1;





            // Use the addPark function
            addParkToUI(parksOnDayDiv, dayIndex, newDayId, selectedPark);

        });
        // Loop through each park in the day
        //dayParks.sort((a, b) => a.id - b.id);
        dayParks.forEach(async (park, parkIndex) => {
            const selectedPark = park.name;

            await addParkToUI(parksOnDayDiv, dayIndex, newDayId, selectedPark);


        });
    });
}

// Call the function to load the existing trip

const selectTripDropdown = document.getElementById("selectTrip");
api.getTripByUserId().then(trips => {
    document.title = 'New Trip Page';
    console.log(trips);
    //let tripz = trips.results;
    for (let i = 0; i < trips.length; i++) {
        let opt = trips[i].trp_name;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectTripDropdown.appendChild(el);
    }

});

const openTrip = document.getElementById("openTrip");

openTrip.addEventListener("click", e => {

    const trip = selectTripDropdown.value;
    api.getTripWithRecordsByName(trip).then(existingTrip => {
        ogName = selectTripDropdown.value;
        const tripCon = document.getElementById("tripContainer");
        tripCon.style.display = "block";

        const agenda = [];



        for (let i = 0; i < existingTrip.trip.agenda.length; i++) {

            console.log(existingTrip.trip.agenda[i]);

            let dayIndex = existingTrip.trip.agenda[i].date_visited;

            console.log(dayIndex);
            let parkName = existingTrip.trip.agenda[i].name;
            let id = existingTrip.trip.agenda[i].id;
            if (!agenda[dayIndex]) {
                agenda[dayIndex] = [];
            }
            agenda[dayIndex].push({ name: parkName, id: id });

        }

        const trip = {
            name: existingTrip.trip.name,
            date: existingTrip.trip.date,
            agenda: agenda
        }

        console.log(trip);
        loadExistingTrip(trip);
    });

    //hide previously shown trip
});

document.addEventListener("DOMContentLoaded", (event) => {
    const tripCon = document.getElementById("tripContainer");
    tripCon.style.display = "none";
});


document.getElementById("submit").addEventListener("click", async function () {

    if(!navigator.onLine) {
        alert("Trip data cannot be modified offline");
        return;
    }
    const tripName = document.getElementById("tripName").value;
    if (tripName.length < 5) {
        alert("Name must be 5 characters");


    }
    else {
        const tripDate = document.getElementById("tripDate").value;
        // addedParksByDay.forEach(e => {
        //     e.reverse();
        // });
        const trip = {
            name: tripName,
            date: tripDate,
            agenda: addedParksByDay
        }


        api.updateTrip(trip);
        alert("Saved");
        document.location = "/";

    }

});
document.getElementById("deleteTrip").addEventListener("click", async function () {

    if(!navigator.onLine) {
        alert("Trip data cannot be modified offline");
        return;
    }
    console.log(ogName);
    let ob = {
        name: ogName
    }

    api.deleteTrip(ob);
    document.getElementById("tripContainer").style.display = "none";
    document.getElementById("daysContainer").innerHTML ='';
    window.location.reload();
});

document.getElementById("addDayBtn").addEventListener("click", async function () {
    // Create a new day div
    const newDayId = "day" + (document.querySelectorAll('.day').length + 1);
    const newDayDiv = document.createElement("div");
    newDayDiv.id = newDayId;
    newDayDiv.classList.add("day", "container-fluid");

    //create delete day 
    //create add park btn and drop down
    //row one
    const row1 = document.createElement("div");
    //row1.id = newDayId;
    row1.classList.add("row");

    // Add "Delete Day" button
    const deleteDayBtn = document.createElement("button");
    deleteDayBtn.classList.add("deleteDayBtn", "btn", "col-sm-1");
    deleteDayBtn.dataset.day = newDayId;
    deleteDayBtn.textContent = "x";

    row1.appendChild(deleteDayBtn);

    deleteDayBtn.addEventListener("click", function () {
        const dayIndex = parseInt(deleteDayBtn.dataset.day.slice(-1)) - 1; // Assuming day IDs are numerical (e.g., day1, day2)
        console.log(`newDayIndex ${newDayId} dayIndex ${dayIndex}`);
        removeDay(dayIndex);
    });

    // Add heading for the day
    const dayHeading = document.createElement("h5");
    dayHeading.textContent = "Day " + (document.querySelectorAll('.day').length + 1);
    dayHeading.classList.add("col-sm-11");
    row1.appendChild(dayHeading);
    newDayDiv.appendChild(row1);

    // Add container for parks on this day
    const parksOnDayDiv = document.createElement("div");
    parksOnDayDiv.classList.add("parksOnDay", "row");
    newDayDiv.appendChild(parksOnDayDiv);

    //row two
    const row2 = document.createElement("div");
    //row2.id = newDayId;
    row2.classList.add("row", "no-gutter");

    // Add dropdown for parks
    const selectParkId = "selectPark" + (document.querySelectorAll('.day').length + 1);


    //fill dropdown with parks
    const selectParkDropdown = document.createElement("select");
    selectParkDropdown.id = selectParkId;
    selectParkDropdown.dataset.day = newDayId;
    api.getParks().then(parks => {
        document.title = 'New Trip Page';
        let parkz = parks.results;
        for (let i = 0; i < parkz.length; i++) {
            let opt = parkz[i].prk_name;
            let el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            selectParkDropdown.appendChild(el);
        }

    });
    selectParkDropdown.classList.add("form-select")

    const dropDiv = document.createElement("div");
    dropDiv.classList.add("col-sm-8");
    dropDiv.appendChild(selectParkDropdown);
    row2.appendChild(dropDiv);

    // Add "Add Park" button
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("col-sm-4", "addParkDiv");
    const addParkBtn = document.createElement("button");
    addParkBtn.classList.add("addParkBtn");
    addParkBtn.dataset.day = newDayId;
    addParkBtn.textContent = "Add Park";
    buttonDiv.appendChild(addParkBtn);
    row2.appendChild(buttonDiv);
    newDayDiv.appendChild(row2);



    // Add the new day div to the days container


    // Add the new day div to the days container
    document.getElementById("daysContainer").appendChild(newDayDiv);

    addParkBtn.addEventListener("click", async function () {
        const selectedPark = selectParkDropdown.value;
        const dayIndex = parseInt(addParkBtn.dataset.day.slice(-1)) - 1;





        // Use the addPark function
        addParkToUI(parksOnDayDiv, dayIndex, newDayId, selectedPark);

    });

})







