import React, { useState, useRef, useEffect } from 'react';
import './Chat.css'; // Import your CSS file

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom on message update
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const messageInput = document.getElementById('messageInput');
    const msg = messageInput.value.trim();

    if (msg) {
      setMessages([...messages, { content: msg, isUser: true }]);
      messageInput.value = '';

      // Simulate fake response (optional)
      setTimeout(() => {
        setMessages([...messages, { content: getFakeMessage(), isUser: false }]);
      }, 1000);
    }
  };

  const getFakeMessage = () => {
    const Fake = [
      // Your fake message array here
    ];
    const randomIndex = Math.floor(Math.random() * Fake.length);
    return Fake[randomIndex];
  };

  return (
    <div className="chat">
      <div className="chat-title">
        <h1>Fabio Ottaviani</h1>
        <h2>Supah</h2>
        <figure className="avatar">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" alt="Avatar" />
        </figure>
      </div>
      <div className="messages">
        <div className="messages-content">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? 'message-personal' : ''}`}>
              <figure className="avatar">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" alt="Avatar" />
              </figure>
              {message.content}
              {message.isUser && <span className="timestamp">{new Date().toLocaleTimeString()}</span>}
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="message-box">
        <textarea id="messageInput" type="text" className="message-input" placeholder="Type message..." />
        <button type="submit" className="message-submit" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;