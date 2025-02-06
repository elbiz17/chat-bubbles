"use client"
import React, { useState } from "react";
import Bubbles from "@/components/bubbles/Bubbles";

function App() {
  const [inputText, setInputText] = useState("");
  const [currentMessage, setCurrentMessage] = useState(""); // New state for current message
  const [count, setCount] = useState(0);
  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (inputText.trim()) {
      setCurrentMessage(inputText); // Set only the newest message for Bubbles
      setInputText("");
    }
  };

  return (
    <div className="h-full min-h-screen relative" style={
      {
        backgroundImage: "url('/chris-barbalis--nYBR0LFTvQ-unsplash.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    }>
      {/* Bubbles component - pass only the current message */}
      <Bubbles message={currentMessage} username={`User-${count}`} />
      
      {/* Chat area */}
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 bg-opacity-50 bg-clip-padding backdrop-filter backdrop-blur-sm  z-10 absolute bottom-0 w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;