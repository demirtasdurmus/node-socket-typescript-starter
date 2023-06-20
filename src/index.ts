import { createServer, Server as HttpServer } from 'http';
import { DisconnectReason, Socket, Server as SocketServer } from 'socket.io';
import { app } from './app';

const PORT = 3000;
const server: HttpServer = createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*',
    },
    cookie: true,
});

io.on('connect', (socket: Socket) => {
    console.log('a user connected', socket.id);
    // Broadcast to all clients
    io.emit('new_broadcast', { type: 'Broadcast', message: `User with id ${socket.id} connected` });

    socket.on('chat_message', (msg) => {
        console.log('message: ' + msg);

        // Broadcast to all clients except sender
        socket.broadcast.emit('new_broadcast', {
            type: 'Broadcast',
            message: 'THis message is only to you, not the sender',
        });
    });

    socket.on('disconnect', (reason: DisconnectReason) => {
        console.log('user disconnected', reason);
        // Broadcast to all clients except sender
        socket.broadcast.emit('new_broadcast', {
            type: 'Broadcast',
            message: `User with id ${socket.id} disconnected`,
        });
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
