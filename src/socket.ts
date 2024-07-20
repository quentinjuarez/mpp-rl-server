import { Server as WSServer, Socket } from "socket.io";
import type http from "http";
import { whitelist } from "./config/constant";
import l from "./config/logger";

const getUsers = (onlineUsers: Map<string, WSData>, roomId: string) => {
  const users = [...onlineUsers]
    .filter((val) => val[1].roomId === roomId)
    .map((val) => val[1].connectionId);

  return users;
};

export default class SocketIO {
  io!: WSServer;
  onlineUsers: Map<string, WSData>;
  constructor() {
    this.onlineUsers = new Map();
  }

  init(httpServer: http.Server) {
    this.io = new WSServer(httpServer, {
      cors: {
        origin: whitelist,
        methods: ["GET", "POST"],
        allowedHeaders: ["x-socket"],
        credentials: true,
      },
    });

    return this.connect();
  }

  connect() {
    this.io.on("connection", (socket) => {
      this.disconnect(socket);
      // lobby
      this.join(socket);
      this.quit(socket);
    });
  }

  disconnect(socket: Socket) {
    socket.on("disconnect", async () => {
      const data = this.onlineUsers.get(socket.id);
      if (!data) return;
      const { roomId, connectionId } = data;

      this.onlineUsers.delete(socket.id);
      l.info(`${this.onlineUsers.size} user(s) online !`);
      const users = getUsers(this.onlineUsers, roomId);

      this.io.to(roomId).emit("quit", {
        ...data,
        users,
        connectionId,
      });
    });
  }

  join(socket: Socket) {
    socket.on("join", async (data: WSPayload) => {
      const { roomId, connectionId } = data;
      socket.join(roomId);
      this.onlineUsers.set(socket.id, { roomId, connectionId });
      l.info(`${this.onlineUsers.size} user(s) online !`);

      const users = getUsers(this.onlineUsers, roomId);

      this.io.to(roomId).emit("join", {
        ...data,
        users,
        connectionId,
      });
    });
  }

  quit(socket: Socket) {
    socket.on("quit", async (data: WSPayload) => {
      const { roomId, connectionId } = data;

      this.onlineUsers.delete(socket.id);
      l.info(`${this.onlineUsers.size} user(s) online !`);
      const users = getUsers(this.onlineUsers, roomId);

      this.io.to(roomId).emit("quit", { ...data, users, connectionId });
    });
  }
}
