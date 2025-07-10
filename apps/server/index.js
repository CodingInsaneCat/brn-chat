import Fastify from 'fastify';
import { Server } from 'socket.io';
import cors from '@fastify/cors';

const fastify = Fastify();
await fastify.register(cors);

const io = new Server(fastify.server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('send-message', ({ username, msg }) => {
        const fullMessage = `${username}: ${msg}`;
        socket.broadcast.emit('receive-message', fullMessage);
    });

    socket.on('nudge', (username) => {
        socket.broadcast.emit('nudge', username);
    });
});

fastify.listen({ port: 3001 }, () => {
    console.log('Server running on http://localhost:3001');
});