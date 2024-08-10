
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());


app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send a message every second
    const sendEvent = () => {
        const eventData = JSON.stringify({ time: new Date().toLocaleTimeString() });
        res.write(`data: ${eventData}\n\n`);
    };

    // Send an initial ping
    sendEvent();

    // Continue sending events at intervals
    const intervalId = setInterval(sendEvent, 1000);

    // Close connection on client disconnect
    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
});

app.listen(3001, () => {
    console.log('SSE server running on http://localhost:3001/events');
});
