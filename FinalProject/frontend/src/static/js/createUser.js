import api from './APIClient.js'


const username = document.querySelector('#username');
const password = document.querySelector('#password');
const passwordConfirm = document.querySelector('#passwordConfirm');
const create = document.querySelector('#create');

create.addEventListener('click', () => {

    if(password.value == passwordConfirm.value) {
        api.createUser(username.value, password.value).then(data => {
            document.location = '/login';
        }).catch(err => {
            console.log(err);
            alert("error creating user");
        });
    }
    else {
        alert("Passwords must match!");
    }
});