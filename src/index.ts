import { createServer, Server as HttpServer } from 'http';
import { Socket, Server as SocketServer } from 'socket.io';
import { app } from './app';
import namespaces from './data/namespaces';

const PORT = 3000;
const server: HttpServer = createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*',
    },
    cookie: true,
});

io.on('connect', (socket: Socket) => {
    // eslint-disable-next-line no-console
    console.log('a user connected', socket.id);

    socket.emit('welcome', 'Hello from server');

    socket.on('clientConnect', () => {
        // eslint-disable-next-line no-console
        console.log(socket.id, 'has connected');
    });

    socket.emit('nsList', namespaces);
});

server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}`);
});
