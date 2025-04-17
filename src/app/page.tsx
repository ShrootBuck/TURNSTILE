// /src/app/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import remarkMath from "remark-math"; // Import remark-math
import rehypeKatex from "rehype-katex"; // Import rehype-katex

// You might need to import KaTeX CSS here if not using CDN
// import 'katex/dist/katex.min.css';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "https://wrikpjquiollucsvgure.supabase.co/functions/v1/generate-message",
  });

  return (
    <div className="flex flex-col w-full bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen rounded-lg shadow-lg">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          TURNSTILE
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-6 md:py-10 text-gray-500">
            <p>Start a conversation by typing a message below</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              // Add prose class for better markdown styling defaults if using Tailwind typography
              className={`prose prose-sm md:prose-base max-w-[80%] sm:max-w-[70%] md:max-w-[60%] whitespace-pre-wrap p-3 md:p-4 rounded-lg shadow-sm ${
                message.role === "user"
                  ? "bg-blue-600 text-white prose-invert" // prose-invert for dark backgrounds
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      // Replace the simple div with ReactMarkdown
                      <ReactMarkdown
                        key={`${message.id}-${i}`}
                        remarkPlugins={[remarkMath]} // Enable math parsing
                        rehypePlugins={[rehypeKatex]} // Enable math rendering
                        // Apply base text styles here if needed, or rely on prose/CSS
                        // className="text-sm md:text-base"
                      >
                        {part.text}
                      </ReactMarkdown>
                    );
                  // Handle other part types if they exist
                  default:
                    return null; // Or render something else
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 md:px-6 py-3 md:py-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="relative">
          <input
            className="w-full p-2 md:p-3 pr-10 md:pr-12 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 p-1.5 md:p-2 rounded-md hover:bg-blue-700 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!input.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 md:w-5 md:h-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
