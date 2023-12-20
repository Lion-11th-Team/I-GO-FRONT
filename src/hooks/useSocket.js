import io from "socket.io-client";
const socket = io(process.env.REACT_APP_CHAT_SERVER);
export default socket;
