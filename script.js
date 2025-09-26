const socket = io();

const form = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const usernameInput = document.getElementById('username-input');
const messages = document.getElementById('messages');
const onlineUsersList = document.getElementById('online-users');

let username = "";

// Handle form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!username) {
        username = usernameInput.value.trim();
        if (!username) return alert("Enter your name!");
        socket.emit('join', username);
    }
    const msg = messageInput.value.trim();
    if (!msg) return;
    socket.emit('chat message', { user: username, msg });
    messageInput.value = '';
});

// Listen for chat messages
socket.on('chat message', (data) => {
    const li = document.createElement('li');
    li.className = 'p-2 rounded-lg max-w-xs break-words';
    if (data.user === username) {
        li.style.backgroundColor = '#D3E4CD'; // light olive for own messages
        li.classList.add('self-end');
    } else if (data.user === "System") {
        li.style.backgroundColor = '#F0F0F0';
        li.classList.add('self-center');
        li.style.fontStyle = 'italic';
    } else {
        li.style.backgroundColor = '#E8F5E9'; // lighter olive for others
        li.classList.add('self-start');
    }
    li.innerHTML = `<strong>${data.user}</strong> <span class="text-sm text-gray-600">[${data.time}]</span>: ${data.msg}`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});

// Online users
socket.on('online users', (users) => {
    onlineUsersList.innerHTML = '';
    users.forEach(u => {
        const li = document.createElement('li');
        li.textContent = u;
        onlineUsersList.appendChild(li);
    });
});
