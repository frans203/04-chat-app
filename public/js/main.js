const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const leaveBtn = document.querySelector("#leave-btn");
//Get username and room from URL
const queryObject = Qs.parse(location.search, {
  ingoreQueryPrefix: true,
});
const username = queryObject["?username"];
const room = queryObject.room;

//Join chat room
socket.emit("joinRoom", { username, room });

//Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //emit message to server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//listen to click on leave room btn

leaveBtn.addEventListener("click", (e) => {
  console.log("test");
  window.history.back();
});

//output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span><p>
  <p class="text">${message.text}</p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}

//add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//add users to DOM
function outputUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
  console.log(users);
}
