import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
app.get("/", (req: any, res: any) => {
  res.render("index");
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public"))); //because I am in dist folder when serving

const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  socket.on("send-location", function (data) {
    console.log(data);
    io.emit("receive-location", {
      id: socket.id,
      ...data,
    });
  });
  socket.on("disconnect", () => {
    socket.emit("user-disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
