import React, { useState, useRef } from "react";

const CreateAd = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Function to send a message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: "client", text: input };
    setMessages((prev) => [...prev, newMessage]);

    // Simulated bot response (You can replace this with OpenAI or your backend)
    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: "Thanks for your message. How can I assist you further?",
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);

    setInput("");
  };

  // Start camera and mic
  const startCameraAndMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      if (audioRef.current) audioRef.current.srcObject = stream;
    } catch (err) {
      alert("Permission denied or error starting camera/mic.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Muhammad Noman Anwar — UI/UX Chatboard Assistant
      </h1>

      {/* Chat window */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-4 mb-6">
        <div className="h-72 overflow-y-auto mb-4 border rounded p-2 bg-gray-100">
          {messages.map((msg, idx) => (
            <div key={idx} className={`my-2 text-${msg.sender === "client" ? "right" : "left"}`}>
              <span
                className={`inline-block px-4 py-2 rounded-xl max-w-xs break-words ${
                  msg.sender === "client" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

      {/* Camera & Mic Section */}
      <button
        onClick={startCameraAndMic}
        className="bg-green-600 text-white px-6 py-2 rounded mb-4 hover:bg-green-700"
      >
        Start Camera & Microphone
      </button>

      <div className="w-full max-w-md flex flex-col items-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg shadow border mb-4"
        />
        <audio ref={audioRef} autoPlay controls className="hidden" />
      </div>
    </div>
  );
};

export default CreateAd;


