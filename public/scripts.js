// const username = prompt('Enter your username');
// const password = prompt('Enter your password');

const username = 'test';
const password = 'test';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('connected');
    socket.emit('clientConnect');
});

socket.on('welcome', (data) => {
    console.log('welcome', data);
});

socket.on('nsList', (nsData) => {
    // append the namespaces to the DOM
    let namespacesDiv = document.querySelector('.namespaces');
    // reset namespacesDiv initially
    namespacesDiv.innerHTML = '';
    nsData.forEach((ns) => {
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.image}"></div>`;
    });

    // add a click listener for each namespace to change the rooms
    Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
        elem.addEventListener('click', (e) => {
            joinNs(elem, nsData);
        });
    });

    const latestNs = JSON.parse(localStorage.getItem('latestNs'));

    if (latestNs) {
        const elem = document.querySelector(`[ns="${latestNs.endpoint}"]`);
        joinNs(elem, nsData);
    } else {
        // get the rooms for the first namespace
        joinNs(document.querySelector('.namespace'), nsData);
    }
});
