import { Server as WSServer, Socket } from "socket.io";
import type http from "http";
import { whitelist } from "./config/constant";
import l from "./config/logger";

const getPlayers = (onlinePlayers: Map<string, WSData>, roomId: string) => {
  const players = [...onlinePlayers]
    .filter((val) => val[1].roomId === roomId)
    .map((val) => val[1].connectionId);

  return players;
};

export default class SocketIO {
  io!: WSServer;
  onlinePlayers: Map<string, WSData>;
  constructor() {
    this.onlinePlayers = new Map();
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
      const data = this.onlinePlayers.get(socket.id);
      if (!data) return;
      const { roomId, connectionId } = data;

      this.onlinePlayers.delete(socket.id);
      l.info(`${this.onlinePlayers.size} player(s) online !`);
      const players = getPlayers(this.onlinePlayers, roomId);

      this.io.to(roomId).emit("quit", {
        ...data,
        players,
        connectionId,
      });
    });
  }

  join(socket: Socket) {
    socket.on("join", async (data: WSPayload) => {
      const { roomId, connectionId } = data;
      socket.join(roomId);
      this.onlinePlayers.set(socket.id, { roomId, connectionId });
      l.info(`${this.onlinePlayers.size} player(s) online !`);

      const players = getPlayers(this.onlinePlayers, roomId);

      this.io.to(roomId).emit("join", {
        ...data,
        players,
        connectionId,
      });
    });
  }

  quit(socket: Socket) {
    socket.on("quit", async (data: WSPayload) => {
      const { roomId, connectionId } = data;

      this.onlinePlayers.delete(socket.id);
      l.info(`${this.onlinePlayers.size} player(s) online !`);
      const players = getPlayers(this.onlinePlayers, roomId);

      this.io.to(roomId).emit("quit", { ...data, players, connectionId });
    });
  }
}
