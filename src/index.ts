import { createServer, Server as HttpServer } from 'http';
import { Socket, Server as SocketServer } from 'socket.io';
import { app } from './app';
import namespaces, { Room } from './data/namespaces';
import { Request, Response } from 'express';

const PORT = 3000;
const server: HttpServer = createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*',
    },
    cookie: true,
});

// set io to the app object to use independently
app.set('io', io);

// simulate ns update and emit event accordingly
app.get('/ns-update', (req: Request, res: Response) => {
    // update the namespace
    namespaces[0].addRoom(new Room(5, 'New Room', '0'));

    const appIo = app.get('io');

    // let everyone in this namespace know about the change
    appIo.of(namespaces[0].endpoint).emit('nsUpdate', namespaces[0]);

    // send response to the actor client
    res.json({ data: namespaces[0] });
});

io.use((socket: Socket, next) => {
    // eslint-disable-next-line no-console
    console.log('socket middleware', socket.handshake.auth);

    // check if the user is authenticated
    if (socket.handshake.auth && socket.handshake.auth.token) {
        // eslint-disable-next-line no-console
        console.log('authenticated---------------------------------');
        return next();
    }

    // eslint-disable-next-line no-console
    console.log('not authenticated---------------------------------');
    socket.disconnect();
    return next(new Error('authentication error'));
});

io.on('connect', (socket: Socket) => {
    // eslint-disable-next-line no-console
    console.log('a user connected', socket.id, socket.handshake.auth);

    socket.on('clientConnect', () => {
        // eslint-disable-next-line no-console
        console.log(socket.id, 'has connected');

        // send back the list of namespaces on successful connection
        socket.emit('nsList', namespaces);
    });
});

// add listeners to namespaces
namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connect', (nsSocket: Socket) => {
        // eslint-disable-next-line no-console
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);

        nsSocket.on('joinRoom', async (data, cb) => {
            // fetch the room history
            const thisNs = namespaces[data.namespaceId];

            const thisRoom = thisNs?.rooms.find((room) => room.name === data.roomName);
            const history = thisRoom?.history;

            // leave other rooms
            let i = 0;
            nsSocket.rooms.forEach((room) => {
                if (i !== 0) {
                    nsSocket.leave(room);
                }

                i++;
            });

            // later get room id, add auth and then get room name from db in prod
            nsSocket.join(data.roomName);

            const activeSockets = await io.of(namespace.endpoint).in(data.roomName).fetchSockets();
            const socketCount = activeSockets.length;
            // ack send number of users along
            cb({
                ack: true,
                numUsers: socketCount,
                history,
            });
        });

        nsSocket.on('newMessageToRoom', (data) => {
            const { rooms } = nsSocket;
            const currentRoom = [...rooms][1];

            // send message to everyone in the room including the sender
            io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom', data);

            // add message to history
            const thisNs = namespaces[data.selectedNsId];
            const thisRoom = thisNs.rooms.find((room) => room.name === currentRoom);
            thisRoom?.addMessage(data);
        });
    });
});

server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}`);
});
