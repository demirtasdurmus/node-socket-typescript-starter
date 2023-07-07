async function joinRoom(roomName, namespaceId) {
    // option 1
    //   sockets.nameSpace[namespaceId].emit('joinRoom', roomName, (res) => {

    //     // append num users to the DOM
    //     document.querySelector('.curr-room-num-users').innerHTML = `${res.numUsers}<span class="fa-solid fa-user">`;

    //     document.querySelector('.curr-room-text').innerHTML = roomName;
    // });

    // option 2
    const res = await sockets.nameSpace[namespaceId].emitWithAck('joinRoom', {
        roomName,
        namespaceId,
    });

    // append num users to the DOM
    document.querySelector('.curr-room-num-users').innerHTML = `${res.numUsers}<span class="fa-solid fa-user">`;

    document.querySelector('.curr-room-text').innerHTML = roomName;

    // clear the messages
    document.querySelector('#messages').innerHTML = '';

    // append the history messages to the DOM
    res.history?.forEach((message) => {
        document.querySelector('#messages').innerHTML += outputMessage(message);
    });
}
