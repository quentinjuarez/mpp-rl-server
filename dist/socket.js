"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const constant_1 = require("./config/constant");
const logger_1 = __importDefault(require("./config/logger"));
const getUsers = (onlineUsers, roomId) => {
    const users = [...onlineUsers]
        .filter((val) => val[1].roomId === roomId)
        .map((val) => val[1].connectionId);
    return users;
};
class SocketIO {
    io;
    onlineUsers;
    constructor() {
        this.onlineUsers = new Map();
    }
    init(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: constant_1.whitelist,
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
    disconnect(socket) {
        socket.on("disconnect", async () => {
            const data = this.onlineUsers.get(socket.id);
            if (!data)
                return;
            const { roomId, connectionId } = data;
            this.onlineUsers.delete(socket.id);
            logger_1.default.info(`${this.onlineUsers.size} user(s) online !`);
            const users = getUsers(this.onlineUsers, roomId);
            this.io.to(roomId).emit("quit", {
                ...data,
                users,
                connectionId,
            });
        });
    }
    join(socket) {
        socket.on("join", async (data) => {
            const { roomId, connectionId } = data;
            socket.join(roomId);
            this.onlineUsers.set(socket.id, { roomId, connectionId });
            logger_1.default.info(`${this.onlineUsers.size} user(s) online !`);
            const users = getUsers(this.onlineUsers, roomId);
            this.io.to(roomId).emit("join", {
                ...data,
                users,
                connectionId,
            });
        });
    }
    quit(socket) {
        socket.on("quit", async (data) => {
            const { roomId, connectionId } = data;
            this.onlineUsers.delete(socket.id);
            logger_1.default.info(`${this.onlineUsers.size} user(s) online !`);
            const users = getUsers(this.onlineUsers, roomId);
            this.io.to(roomId).emit("quit", { ...data, users, connectionId });
        });
    }
}
exports.default = SocketIO;
