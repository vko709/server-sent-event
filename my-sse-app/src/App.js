import React, { useEffect, useState } from 'react';

function App() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3001/events');

        eventSource.onmessage = (event) => {
            setEvents((prevEvents) => [...prevEvents, JSON.parse(event.data)]);
        };

        eventSource.onerror = (err) => {
            console.error('EventSource failed:', err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h1>Server-Sent Events in React</h1>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>{event.time}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
