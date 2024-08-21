const express = require('express')
const cors = require('cors')
const { Server } = require("socket.io");
const app = express();


app.use(cors())

app.use(express.json())

const dbConnect = require('./util/dbConnect')

const authRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/userRoute')

app.use('/auth', authRoutes)
app.use('/', userRoutes)



const server = app.listen(3000, () => {
    console.log('server started')
});


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});
const users = new Map()

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        setTimeout(() => {
            const userId = Array.from(users.keys()).find((key) => users.get(key) === socket.id);
            users.delete(userId);
            io.emit('online', Array.from(users.keys()));
        }, 1000);
        io.emit('offline', socket.id);
    });

    socket.on('uid', async (currentUser) => {
        if (!currentUser) return
        if (users.has(currentUser)) return;
        users.set(currentUser, socket.id);
        io.emit('online', Array.from(users.keys()));
    })

})