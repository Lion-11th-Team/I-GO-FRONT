import io from "socket.io-client";
// const socket = io("http://3.39.53.3:8000/");
const socket = io(process.env.REACT_APP_CHAT_SERVER);
export default socket;
