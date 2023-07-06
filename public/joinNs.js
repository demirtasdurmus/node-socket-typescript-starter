function joinNs(elem, nsData) {
    const nsEndpoint = elem.getAttribute('ns');
    const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);
    const rooms = clickedNs.rooms;

    let roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';

    rooms.forEach((room) => {
        roomList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.name}</li>`;
    });

    localStorage.setItem('latestNs', JSON.stringify(clickedNs));
}
