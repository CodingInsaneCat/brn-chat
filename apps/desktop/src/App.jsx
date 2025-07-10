import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

export default function App() {
  const [username, setUsername] = useState('');
  const [msg, setMsg] = useState('');
  const [log, setLog] = useState([]);

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setLog((prev) => [...prev, data]);
    });

    socket.on('nudge', (from) => {
      alert(`📢 ${from} está chamando sua atenção!`);

      // Efeito visual
      document.body.style.backgroundColor = 'yellow';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 300);

      // Toca o som
      const audio = new Audio('/nudge.mp3');
      audio.play();
    });
  }, []);

  const send = () => {
    if (!msg || !username) return;
    socket.emit('send-message', { username, msg });
    setLog((prev) => [...prev, `${username} (você): ${msg}`]);
    setMsg('');
  };

  const nudge = () => {
    if (!username) return;
    socket.emit('nudge', username);
  };

  if (!username) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Qual seu nome?</h1>
        <input
          className="border p-2 text-black rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite seu nome..."
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">MSN Clone</h1>
      <p className="text-sm text-gray-400 mb-2">Usuário: {username}</p>
      <div className="mt-4">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={send} className="bg-blue-500 text-white px-4 py-2">Send</button>
        <button onClick={nudge} className="bg-yellow-500 text-black px-4 py-2 ml-2">Chamar Atenção</button>
      </div>
      <div className="mt-4 space-y-1">
        {log.map((line, i) => <div key={i} className="text-sm">{line}</div>)}
      </div>
    </div>
  );
}