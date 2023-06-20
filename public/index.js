const socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');
var messages = document.getElementById('messages');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat_message', input.value);
        input.value = '';
    }
});

socket.on('new_broadcast', function (data) {
    var item = document.createElement('li');
    item.textContent = data.message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
