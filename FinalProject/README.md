# [ParkAdvisor]
## Group [M]: Final Project

## Features:

### Interactive Map
Our interactive map used leaflet to build the map, we were able to place the parks on the map using they're latitude and longitude and then on click we display The park name, description, and weather information. All information was obtained from the National Parks Service API.

### Building Trip
Users can build a trip that includes a name, start day and then an agenda. The agenda is a schedule of days that contains multiple parks on each day. Dynamically creating these elements on the create trips page was difficult and implementing delete buttons for each day and park was also especially difficult. The trip must have a name of at least 5 characters and a non-empty date to be saved

### Sunset and Sunrise
When adding parks to a trip the sunset and sunrise are dynamically calulated using a sunset and sunrise API we pass the latitude and longitude as well as the trip start date. If no start day was selected it calculates it for the current day.

### Loading Existing Trips
The user can load and edit existing trips of theirs. It shows up the same way it would if you had built the trip to begin with. Reworking the code to populate the html elements of the days and parks from an array instead of user input was challenging and the organization of the js files for the "yourTrips" page and "newTrip" page could be substatially cleaner. None the less it works as intended.

### Distance Calculation
In our initial design we intended to include travel times between the parks on the same day. We changed the implementation so that the user can calculate the distance between two parks with a "calculate distance" button instead. This was easier to implement and I think still acheives the intedned purpose.

### Service Worker

### Mobile first
Our app is mobile first, we did have to make a few changes to account for this. First the interactive map was longer than a mobile screen, this was an issue because the user would get stuck zooming in and out of the map when they tried to scroll. To fix this we decreased the length of the screen so that the user can not get stuck with the map covering the entire screen.

## Authentication

We are using authentication cookies in a middleware for our authorization and authentication. We are using JWT to generate the token and verify the token for the user. We call this middleware for all of our protected pages which is all pages except for login and create user. In our database for each user we store a salt and a hashed password for the user. We store our secret needed for the middleware in our .env file that is kept from our version control for security.

## A list of all the pages in your app, how to navigate them, and the offline functionality they provide, if any
## A description of your caching strategy and why you chose it



## Contributions

### Milestone 1

Member | Activity
-------|----------
Sean   | Set up of environment in vm
Ellie  | Backend api sketches
Sean   | Frontend API routing
Tanvi  | HTML pages
Sean   | HTML pages
Tanvi  | CSS
Ellie  | Readme

### Milestone 2

Member | Activity
-------|----------
Sean   | Set up new Milestone 2 filesystem
Ellie  | wrote intial code to pull national parks service data
Sean   | wrote database schema and updated to use national parks data
Tanvi  | create "your trips" and "profile" page
Sean   | authentication code
Ellie  | debugged page redirection with login
Ellie  | created interactive map with national parks information using the database
Sean   | created "create user" and "login" page
S + E  | wrote the frontend javascript to pull database information for new trip page.
Sean   | ER diagram of database schema
Sean   | recording
Ellie  | report

## Final Project

Member | Activity
-------|----------
Ellie  | Created final Project folder
Ellie  | added New Trip frontend functionality to create trip
Ellie  | added sunrise sunset functionality
Sean   | Added Service Worker code
Sean   | Backend Trips endpoints
Ellie  | Frontend design for all pages
Ellie  | Frontend to load existing trips into html and edit
Sean   | Fixed opening existing trips
Sean   | Modified database trip storage
Ellie  | Added distance API functionality
Sean   | Completed Service Worker

## Rest Endpoints

Method   | Route                 | Description
---------| --------------------- | ---------
`POST`   | `/user/login`         | Receives an email and password
`POST`   | `/user/logout`        | logs current user out
`POST`   | `/user/create`        | creates a user with a password and username
`POST`   | `/Users`              | Creates a new user account and returns the new user object
`POST`   | `/trips`              | Creates a new trip with name, date and parks
`GET`    | `/users`              | Retrieves an array of all active users in the system
`GET`    | `/user/active`        | Retrieves the logged in user
`GET`    | `/trips`              | Retrieves a list of trips
`GET`    | `/trips/:tripId`      | Retrieves a trip by its Id
`GET`    | `/trips/:user`        | Retrieves the trips for a user
`GET`    | `/trips/:name`        | Retrieves the trip by the name
`GET`    | `/parks`              | Retrieves an array of parks
`GET`    | `/parks/:parkId`      | Retrieves a park by its Id
`GET`    | `/parks/:parkName`    | Retrieves a park by its Name
`DELETE` | `/trips/:tripId`      | Deletes a trip by Id
`GET`    | `/distance/:disInfo`  | Retrieves distance using lat and long of two parks
`GET`    | `/times/:latLong`     | Retrives sunset and sunrise time using lat long and date
`PUT`    | `/trips/:tripId`      | Updates a trip 

## Database Schema Diagram

![image](https://media.github.ncsu.edu/user/22136/files/f64d2504-830e-47e2-b356-56eb4f53676b)
