const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: "GET, POST",
    },
});

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("SEND_MESSAGE", function (data) {
        io.emit("RECEIVE_MESSAGE", data);
    });
});
server.listen(3001, () => {
    console.log("Server is running on port http://localhost:3001");
});
