import api from "./APIClient.js"



//button to log users out 
const logout = document.querySelector('#logout');
logout.addEventListener('click', e => {
    api.userLogout().then(() => {
        window.location = '/login';
    });
});

//check if user is authenticated and then redirect to login page if not
api.fetchUser().then(resp => {
    console.log(resp.username);
}).catch(err => {
    if(window.location !== '/createAccount') {
        window.location = '/login';
    }
})


//add map to map section on page
let myMap = L.map("map").setView([35, -100.71], 3);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    
	maxZoom: 20
}).addTo(myMap);


//get parks to add to the map
api.getParks().then(parks => {

    
    for(let i = 0; i < parks.results.length; i++) {
        //get lat and long of park to add to map
        let lon = parks.results[i].prk_lon;
        let lat = parks.results[i].prk_lat;
        //add park to map
        let park_marker = L.marker([lat, lon]).addTo(myMap);
        //create popup marker with the park description and weather information to show on hover over the map
        park_marker.bindPopup(`<h2>${parks.results[i].prk_name}</h2><p><b>Description:</b> ${parks.results[i].prk_description} <br><br><b>Weather:</b>${parks.results[i].prk_weather}  </p>`);
    }

});



/*********************\
* SERVICE WORKER CODE *
\*********************/

//Service workers can intercept network requests made by a web page, allowing you to cache resources 
//(e.g., HTML, CSS, JavaScript files, images, etc.). This allows your web app to load even when the user is offline
// or when the network is slow.

function registerServiceWorker() {
    if (!navigator.serviceWorker) { // Are SWs supported?
      return;
    }
  
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(registration => {
        if (!navigator.serviceWorker.controller) {
          //Our page is not yet controlled by anything. It's a new SW
          return;
        }
  
        if (registration.installing) {
          console.log('Service worker installing');
        } else if (registration.waiting) {
          console.log('Service worker installed, but waiting');
          //registration.waiting.postMessage({action: 'skipWaiting'});
          newServiceWorkerReady(registration.waiting);
        } else if (registration.active) {
          console.log('Service worker active');
        }
  
        registration.addEventListener('updatefound', () => {
          console.log("SW update found", registration, navigator.serviceWorker.controller);
          //registration.installing.postMessage({action: 'skipWaiting'});
          newServiceWorkerReady(registration.installing);
        });
      })
      .catch(error => {
        console.error(`Registration failed with error: ${error}`);
      });
  
    navigator.serviceWorker.addEventListener('message', event => {
      console.log('SW message', event.data);
    })
  
    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload" in dev tools.
    // let refreshing = false;
    // navigator.serviceWorker.addEventListener('controllerchange', () => {
    //   if(refreshing) return;
    //   window.location.reload();
    //   refreshing = true;
    // });
  
  };
  
  registerServiceWorker();
  
  
  //This method is used to notify the user of a new version
  function newServiceWorkerReady(worker) {
    const popup =  document.createElement('div');
    popup.className = "popup";
    popup.innerHTML = '<div>New Version Available</div>';
  
    const buttonOk = document.createElement('button');
    buttonOk.innerHTML = 'Update';
    buttonOk.addEventListener('click', e => {
      worker.postMessage({action: 'skipWaiting'});
    });
    popup.appendChild(buttonOk);
  
    const buttonCancel = document.createElement('button');
    buttonCancel.innerHTML = 'Dismiss';
    buttonCancel.addEventListener('click', e => {
      document.body.removeChild(popup);
    });
    popup.appendChild(buttonCancel);
  
    document.body.appendChild(popup);
  }