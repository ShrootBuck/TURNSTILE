"use client";

import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { useEffect } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "https://wrikpjquiollucsvgure.supabase.co/functions/v1/generate-message",
    initialMessages: [
      {
        role: "system",
        id: "SYSTEM_PRORMPT",
        content:
          "You are TURNSTILE, a helpful AI assistant. Answer questions clearly and concisely. Provide accurate information and be friendly in your responses. Use LaTeX for all math/science equations: $ inline $ and $$ block $$. Do not use any other formatting.",
      },
    ],
  });

  // Add effect to prevent scrolling beyond the viewport
  useEffect(() => {
    document.body.style.backgroundColor = "#111827"; // bg-gray-900
    document.body.style.overflow = "hidden";
    document.documentElement.style.backgroundColor = "#111827"; // bg-gray-900

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.overflow = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-900 text-gray-100">
      <div className="border-b border-gray-700 px-4 py-3 md:px-6">
        <h1 className="text-xl font-semibold text-purple-400 md:text-2xl">
          TURNSTILE
        </h1>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
        {messages.length === 1 && messages[0]?.role === "system" && (
          <div className="py-10 text-center text-gray-500">
            <p>What's up? Ask me anything.</p>
          </div>
        )}

        {messages
          .filter((message) => message.role !== "system")
          .map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <div className="prose prose-sm md:prose-base prose-invert max-w-[80%] whitespace-pre-wrap rounded-xl rounded-br-none bg-purple-700 p-3 text-white shadow-md sm:max-w-[70%] md:max-w-[60%] md:p-4">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <ReactMarkdown
                            key={`${message.id}-${i}`}
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {part.text}
                          </ReactMarkdown>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex justify-center">
                <div className="prose prose-sm md:prose-base prose-invert max-w-[75%] whitespace-pre-wrap pt-6 text-gray-100">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <ReactMarkdown
                            key={`${message.id}-${i}`}
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {part.text}
                          </ReactMarkdown>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ),
          )}
      </div>

      <div className="border-t border-gray-700 bg-gray-900 px-4 py-3 md:px-6 md:py-4">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            className="flex-1 rounded-full border border-gray-600 bg-gray-800 p-3 px-5 pr-12 text-gray-100 placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none "
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 transform rounded-full bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-50"
            disabled={!input.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3.105 3.105a.75.75 0 0 1 .814-.156l12.682 6.341a.75.75 0 0 1 0 1.312L3.919 17.05a.75.75 0 0 1-.814-.156l-.618-.618a.75.75 0 0 1 .156-.814L6.08 12.5H9a.75.75 0 0 0 0-1.5H6.08L2.643 7.09a.75.75 0 0 1-.156-.814l.618-.618Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
