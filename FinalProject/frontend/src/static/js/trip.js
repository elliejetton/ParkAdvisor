import api from './APIClient.js';


//on date change update all the sunrise sunsets

//calculate distance between parks on the same day

const addedParksByDay = [];

// Function to add a park to the array for a specific day
function addPark(dayIndex, parkName) {
    if (!addedParksByDay[dayIndex]) {
        addedParksByDay[dayIndex] = [];
    }
    addedParksByDay[dayIndex].push({ name: parkName });
}

// Function to remove a park from the array for a specific day
function removePark(dayIndex, parkIndex) {
    if (addedParksByDay[dayIndex]) {
        addedParksByDay[dayIndex].splice(parkIndex, 1);
    }
}

function removeDay(dayIndex) {
    //if (addedParksByDay[dayIndex]) {
    // Remove the day from the array
    addedParksByDay.splice(dayIndex, 1);

    //}
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

document.getElementById("addDayBtn").addEventListener("click", async function () {
    // Create a new day div
    const newDayId = "day" + (document.querySelectorAll('.day').length + 1);
    const newDayDiv = document.createElement("div");
    newDayDiv.id = newDayId;
    console.log(newDayId);
    newDayDiv.classList.add("day", "container-fluid");



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
    parksOnDayDiv.id = "parksOnDayDiv";

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
    document.getElementById("daysContainer").appendChild(newDayDiv);

    // Add event listener for the new "Add Park" button
    addParkBtn.addEventListener("click", async function () {
        // Get the selected park for this button
        const selectedPark = selectParkDropdown.value;

        // Create a new div element to hold the selected park and sunrise, sunset information
        const parkDiv = document.createElement("div");
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


            let dayIndex = parseInt(addParkBtn.dataset.day.slice(-1)) - 1;
            addPark(dayIndex, selectedPark);
            let date = document.getElementById("tripDate").value;

            console.log(date);

            deleteParkBtn.addEventListener("click", e => {
                dayIndex = parseInt(addParkBtn.dataset.day.slice(-1)) - 1;
                const parkIndex = addedParksByDay[dayIndex]?.findIndex(park => park.name === selectedPark);
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



                })

                .catch(error => {

                    console.error('Error during fetch:', error);
                });

            parkDiv.appendChild(parkNameDiv);
        });


        // Append the new div to the corresponding "parksOnDay" div
        parksOnDayDiv.appendChild(parkDiv);
    });





});

document.getElementById("submit").addEventListener("click", async function () {

    console.log("in event listener");
    if(!navigator.onLine) {
        alert("Trip data cannot be modified offline");
        return;
    }
    const tripName = document.getElementById("tripName").value;
    const tripDate = document.getElementById("tripDate").value;
    console.log(tripDate);

    if (tripName.length < 5 || tripDate == "") {
        alert("Name must be 5 characters and trip date cannot be empty.");


    }
    else {

        addedParksByDay.forEach(e => {
            e.reverse();
        });
        const trip = {
            name: tripName,
            date: tripDate,
            agenda: addedParksByDay
        }


        console.log("saving trip"+ trip);
        api.createTrip(trip);
        alert("Saved");
       // document.location = "/";

    }

})
