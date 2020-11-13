const express = require('express');
// const os = require('os');
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const port  = process.env.PORT || 8080;
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const users = {};

const socketToRoom = {};

// Group chat
io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});

// One to one chat
// io.on('connection', socket => {
//     if (!users[socket.id]) {
//         users[socket.id] = socket.id;
//     }
//     socket.emit("yourID", socket.id);
//     io.sockets.emit("allUsers", users);
//
//     socket.on('disconnect', () => {
//         delete users[socket.id];
//     });
//
//     socket.on("callUser", (data) => {
//         io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
//     });
//
//     socket.on("acceptCall", (data) => {
//         io.to(data.to).emit('callAccepted', data.signal);
//     });
// });


app.use(express.static(path.join("dist")));

app.get('/api/getRooms', (req, res) => res.send({ rooms: users }));

app.get("*", (req, res) => {
	res.sendFile(path.join("dist", "index.html"), {root: path.join(__dirname, "..", "..")});
});

http.listen(port, () => console.log(`Listening on port ${port}!`));
