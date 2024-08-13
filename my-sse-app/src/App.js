import React, { useEffect, useState } from 'react';

function App() {
    const [events, setEvents] = useState([]);

    // useEffect(() => {
    //     const eventSource = new EventSource('https://sse-poc-fzbgasgjfxbqhwct.centralindia-01.azurewebsites.net/server-side-event');

    //     eventSource.onmessage = (event) => {
    //         setEvents((prevEvents) => [...prevEvents, JSON.parse(event.data)]);
    //     };

    //     eventSource.onerror = (err) => {
    //         console.error('EventSource failed:', err);
    //         eventSource.close();
    //     };

    //     return () => {
    //         eventSource.close();
    //     };
    // }, []);

    const handleClick = () => {
        const apiUrl = 'https://sse-poc-fzbgasgjfxbqhwct.centralindia-01.azurewebsites.net/server-side-event';
        const streamParagraph = document.getElementById('stream-paragraph');
        const startStreamButton = document.getElementById('start-stream');
        let buffer = "";
        startStreamButton.addEventListener('click', () => {
            const payload = {
                model_name: "gpt-4-128k",
                top_p: "0.95",
                presence_penalty: "0",
                frequency_penalty: "0",
                temperature: "0.5",
                max_tokens: "800",
                query: [
                    {
                        role: "system",
                        content: "You are an AI assistant that answers user's query."
                    },
                    {
                        role: "user",
                        content: "what is a car?"
                    }
                ]
            };
     
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(response => {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
     
                function readStream() {
                    return reader.read().then(({ done, value }) => {
                        if (done) {
                            console.log('Stream complete');
                            return;
                        }

                        buffer += decoder.decode(value, { stream: true });
 
                        let lines = buffer.split('\n');
                        buffer = lines.pop();
                        console.log(lines)

                        lines.forEach(line => {
                            if (line.startsWith('data: ')) {
                                const data = line.replace('data: ', '').trim();
                                streamParagraph.textContent += ` ${data}`;
                            }
                        });
     
                        // const chunk = decoder.decode(value, { stream: true });
                        // const data = JSON.parse(chunk)
     
                        // streamParagraph.textContent += ` ${data.data}`;
     
                        return readStream();
                    });
                }
     
                return readStream();
            }).catch(error => {
                console.error('Error fetching stream:', error);
            });
        });
    };

    return (
        <div>
            <h1>Streaming Data from API</h1>
            <button id="start-stream" onClick={handleClick}>Start Streaming</button>
            <div id="data-container">
                <p id="stream-paragraph"></p>
            </div>
        </div>
    );
}

export default App;
