import api from './APIClient.js'


const username = document.querySelector('#username');
const password = document.querySelector('#password');
const login = document.querySelector('#login');

login.addEventListener('click', () => {
    api.userLogin(username.value, password.value).then(resp => {
        localStorage.setItem("currentUser", username.value);
        document.location = "/";
    }).catch(err => {
        alert("User not found, error: ", + JSON.stringify(err));
    });

    // api.initializeParks().then(data => {
    //     console.log(data);
    // });
});
