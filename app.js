const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer'); // Make sure this div exists to show the chat

// WebSocket connection
const socket = new WebSocket('ws://localhost:8080'); // Replace with your WebSocket server URL

let userName = '';

// Function to ask for name and store it in localStorage if it's not set
function askForName() {
    // Check if the name is already stored in localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
        userName = storedName;
        chatContainer.style.display = 'block'; // Show chat container once name is available
    } else {
        // If no name is in localStorage, ask for it
        const namePrompt = prompt("Please enter your name:");
        if (namePrompt) {
            userName = namePrompt;
            localStorage.setItem('userName', userName); // Save the name to localStorage
            chatContainer.style.display = 'block'; // Show chat container once name is available
        } else {
            askForName(); // Retry if the user doesn't enter a name
        }
    }
}

// Function to append messages to the chat
function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}

// Handle incoming messages from the WebSocket server
socket.addEventListener('message', (event) => {
    const { message, sender } = JSON.parse(event.data); // Parse message with sender name

    // Prevent the sender from seeing their own message twice
    if (sender !== userName) {
        // Append message if it's not from the sender
        appendMessage(message, sender);
    }
});

// Send message function
async function sendMessage(message) {
    try {
        // Send the message along with the sender's name
        const messageData = JSON.stringify({ message, sender: userName });
        socket.send(messageData); // Send to the WebSocket server
        appendMessage(message, 'You'); // Show the message locally with "You"
        messageInput.value = ''; // Clear input
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Event listener for the send button
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        sendMessage(message);
    }
});

// Event listener for Enter key to send messages
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
        }
    }
});

// WebSocket events for connection, error, and close
socket.addEventListener('open', () => {
    console.log('Connected to the server');
    askForName(); // Prompt for name after the connection is open
});

socket.addEventListener('error', (error) => {
    console.error('WebSocket Error: ', error);
});

socket.addEventListener('close', () => {
    console.log('Disconnected from the server');
});
