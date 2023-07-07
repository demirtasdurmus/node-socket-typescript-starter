// const username = prompt('Enter your username');
// const password = prompt('Enter your password');

const userName = 'test';
const password = 'test';

const socket = io('http://localhost:3000', {
    query: {
        userName,
        password,
    },
    auth: {
        token: '123',
    },
});

// namespace sockets array
const sockets = {
    nameSpace: [],
};

// listeners
const listeners = {
    nsUpdate: [],
    messageToRoom: [],
};

// global variable to keep track of the selected namespace
let selectedNsId = 0;

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const message = document.querySelector('#user-message').value;

    // send message to the server
    sockets.nameSpace[selectedNsId].emit('newMessageToRoom', {
        message,
        date: Date.now(),
        avatar: 'https://via.placeholder.com/30',
        userName,
        selectedNsId,
    });

    // clear the input
    document.querySelector('#user-message').value = '';
});

function addListener(socketName, id, eventName) {
    if (!listeners[eventName][id]) {
        sockets[socketName][id].on(eventName, (data) => {
            if (eventName === 'nsUpdate') {
                // console.log(data);
            } else if (eventName === 'messageToRoom') {
                document.querySelector('#messages').innerHTML += outputMessage(data);
            }
        });
        listeners[eventName][id] = true;
    }
}

socket.on('connect', () => {
    console.log('connected');
    socket.emit('clientConnect');
});

socket.on('nsList', (nsData) => {
    // append the namespaces to the DOM
    let namespacesDiv = document.querySelector('.namespaces');
    // reset namespacesDiv initially
    namespacesDiv.innerHTML = '';
    nsData.forEach((ns) => {
        // append namespaces to the DOM
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.image}"></div>`;

        // check if there is already a connected namespace
        if (!sockets.nameSpace[ns.id]) {
            // add a connection for each namespace
            sockets.nameSpace[ns.id] = io(`http://localhost:3000${ns.endpoint}`);
        }

        // listen for ns update
        addListener('nameSpace', ns.id, 'nsUpdate');
        addListener('nameSpace', ns.id, 'messageToRoom');
    });

    // add a click listener for each namespace to change the rooms
    Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
        elem.addEventListener('click', (e) => {
            joinNs(elem, nsData);
        });
    });

    // fetch the latest namespace from local storage
    const latestNs = JSON.parse(localStorage.getItem('latestNs'));
    if (latestNs) {
        const elem = document.querySelector(`[ns="${latestNs.endpoint}"]`);
        joinNs(elem, nsData);
    } else {
        // get the rooms for the first namespace
        joinNs(document.querySelector('.namespace'), nsData);
    }
});
