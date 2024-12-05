import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importe o gerador de UUID
import './Chat.css'; // Import your CSS file

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId] = useState(uuidv4()); // Gere o UUID no carregamento
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const chatContainer = document.querySelector('.messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const messageInput = document.getElementById("messageInput");
    const msg = messageInput.value.trim();
  
    if (msg) {
      // Adiciona a mensagem do usuário no estado
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: msg, isUser: true },
      ]);
      messageInput.value = "";
  
      try {
        // Faz a requisição ao backend
        const response = await fetch("http://66.179.240.12:6543/invoke", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: { input: msg },
            config: { configurable: { session_id: sessionId } },
            kwargs: {},
          }),
        });
  
        if (!response.ok) {
          throw new Error("Erro ao conectar ao backend.");
        }
  
        const data = await response.json();
  
        // Adiciona a resposta do backend no estado
        if (data.output.answer) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { content: data.output.answer, isUser: false },
          ]);
        } else {
          console.error("Resposta inesperada do backend:", data);
        }
      } catch (error) {
        console.error("Erro ao enviar a mensagem:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: "Erro ao processar a resposta.", isUser: false },
        ]);
      }
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents a new line in the textarea
      sendMessage(); // Call the send message function
    }
  };

  // const getFakeMessage = () => {
  //   const Fake = [
  //     'Hello!',
  //     'How can I help you?',
  //     'What are you looking for?',
  //     'Let me know if you have questions!',
  //   ];
  //   const randomIndex = Math.floor(Math.random() * Fake.length);
  //   return Fake[randomIndex];
  // };

  return (
    <div className="chat">
      <div className="chat-title">
        <h1>João</h1>
        <h2>AI agent</h2>
        <figure className="avatar">
          <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" alt="Avatar" />
        </figure>
      </div>
      <div className="messages">
        <div className="messages-content">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'message-personal' : ''}`}>
          {!message.isUser && (
          <figure className="avatar">
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" alt="Avatar" />
          </figure>
        )}
      {message.content}
      </div>
      ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="message-box">
        <textarea
          id="messageInput"
          type="text"
          className="message-input"
          placeholder="Type message..."
          onKeyDown={handleKeyDown} // Add the event listener here
        />
        <button type="submit" className="message-submit" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
