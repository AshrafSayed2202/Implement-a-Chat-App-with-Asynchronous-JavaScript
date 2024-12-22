const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (data) => {
        const parsedData = JSON.parse(data); // Parse incoming message data
        console.log(`Received: ${parsedData.message} from ${parsedData.sender}`);

        // Broadcast the message with sender's name to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedData)); // Send the message and sender info
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
