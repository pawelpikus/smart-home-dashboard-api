const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 4001;
const app = express();
const pathToFile = path.resolve("./feed.json");
const getDeviceDetails = () => JSON.parse(fs.readFileSync(pathToFile));

app.get("/", (req, res) => {
  res.status(200).send("Server ready");
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://smart-home-dashboard-api.herokuapp.com/",
    ],
  },
});

const smartDeviceDetails = getDeviceDetails();

io.on("connection", (socket) => {
  console.log(`New client connected,${socket.id} `);

  setTimeout(() => getApiAndEmit(socket), 3000);
  socket.on("disconnect", () => {
    console.log(`Client disconnected, ${socket.id}`);
  });
});
const getApiAndEmit = (socket) => {
  socket.emit("refresh", smartDeviceDetails);
};
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
