import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function App() {
    const [msg, setMsg] = useState('');
    const [log, setLog] = useState([]);

    useEffect(() => {
        socket.on('receive-message', (data) => {
            setLog((prev) => [...prev, data]);
        });

        socket.on('nudge', () => {
            window.moveBy(10, 0);
            setTimeout(() => window.moveBy(-10, 0), 50);
            const audio = new Audio('/nudge.mp3');
            audio.play();
        });
    }, []);

    const send = () => {
        socket.emit('send-message', msg);
        setMsg('');
    };

    const nudge = () => {
        socket.emit('nudge');
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">MSN Clone</h1>
            <div className="mt-4">
                <input
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="border p-2 mr-2"
                />
                <button onClick={send} className="bg-blue-500 text-white px-4 py-2">Send</button>
                <button onClick={nudge} className="bg-yellow-500 text-black px-4 py-2 ml-2">Chamar Atenção</button>
            </div>
            <div className="mt-4">
                {log.map((line, i) => <div key={i}>{line}</div>)}
            </div>
        </div>
    );
}