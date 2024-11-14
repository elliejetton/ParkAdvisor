function log(...data) {
    console.log("SWv1.0", ...data);
  }
  
  log("SW Script executing - adding event listeners");
  
  
  const STATIC_CACHE_NAME = 'nparks-static-v0';
  
  self.addEventListener('install', event => {
    log('install', event);
    event.waitUntil(
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll([
          '/offline',
          '/',
          '/login',
          '/createAccount',
          '/trip',
          '/yourtrips',
          '/profile',
          //CSS
          '/css/addtrip.css',
          '/css/styles.css',
          '/css/yourtrips.css',
          '/css/log.css',
          //Images
          '/images/user-profile-logo.jpg',
          '/images/USA-National-Parks-Map.jpg.png',
          '/images/parkfinderlogo.png',
          //Scripts
          '/js/APIClient.js',
          '/js/common.js',
          '/js/createUser.js',
          '/js/distance.js',
          '/js/HTTPClient.js',
          '/js/login.js',
          '/js/trip.js',
          //External Resources
          'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
          'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        ]);
      })
    );
  });
  
  self.addEventListener('activate', event => {
    log('activate', event);
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('nparks-');
          }).map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });

  // self.addEventListener('activate', function(event) {
  //   console.log('Claiming control');
  //   return self.clients.claim();
  // });
  
  self.addEventListener('fetch', event => {
    var requestUrl = new URL(event.request.url);
    //Treat API calls (to our API) differently
    if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
      //If we are here, we are intercepting a call to our API
      if(event.request.method === "GET") {
        //Only intercept (and cache) GET API requests
        event.respondWith(
          cacheFirst(event.request)
        );
      }
      else {
        self.skipWaiting();
      }
    }
    else {
      //If we are here, this was not a call to our API
      event.respondWith(
        cacheFirst(event.request)
      );
    }
  
  });
  
  
  function cacheFirst(request) {
    return caches.match(request)
    .then(response => {
      //Return a response if we have one cached. Otherwise, get from the network
      
      return response || fetchAndCache(request);
    })
    .catch(error => {
      console.log(error);
      
      return caches.match('/offline');
    });
  }
  
  
  
  function fetchAndCache(request) {
    return fetch(request).then(response => {
      var requestUrl = new URL(request.url);
      //Cache everything except login
      if(response.ok && !requestUrl.pathname.startsWith('/login')) {
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
      return response.clone();
    });
  }
  
  
  
  self.addEventListener('message', event => {
    log('message', event.data);
    if(event.data.action === 'skipWaiting') {
      
      self.skipWaiting();
    }
  });