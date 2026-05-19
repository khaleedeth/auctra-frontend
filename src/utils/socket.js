import { io } from "socket.io-client";


export const socket = io("http://localhost:5000", {
  autoConnect: false,  // Don't connect immediately
  auth: {
    token: localStorage.getItem("token") // ← sent to io.use() middleware on the server
  }
});