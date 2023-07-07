function joinNs(elem, nsData) {
    const nsEndpoint = elem.getAttribute('ns');
    const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);

    // global var
    selectedNsId = clickedNs.id;

    const rooms = clickedNs.rooms;

    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';

    // init first room var
    let firstRoom;

    rooms.forEach((room, i) => {
        if (i === 0) {
            firstRoom = room.name;
        }
        roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}><span class="fa-solid fa-${
            room.privateRoom ? 'lock' : 'globe'
        }"></span>${room.name}</li>`;
    });

    // join first room
    joinRoom(firstRoom, selectedNsId);

    // add click listener to join the room
    const roomNodes = document.querySelectorAll('.room');

    Array.from(roomNodes).forEach((element) => {
        element.addEventListener('click', (e) => {
            joinRoom(e.target.innerText, element.getAttribute('namespaceId'));
        });
    });

    localStorage.setItem('latestNs', JSON.stringify(clickedNs));
}
