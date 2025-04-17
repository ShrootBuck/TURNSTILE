"use client";

import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "https://wrikpjquiollucsvgure.supabase.co/functions/v1/generate-message",
    initialMessages: [
      {
        role: "system",
        id: "SYSTEM_PRORMPT",
        content:
          "You are TURNSTILE, a helpful AI assistant. Answer questions clearly and concisely. Provide accurate information and be friendly in your responses. By wrapping an equation in single dollar signs, you can display mathematical expressions inline. To display them as a block, wrap them in double dollar signs. Wrap all equations or variables in dollar signs to ensure they are displayed correctly.",
      },
    ],
  });

  return (
    <div className="flex min-h-screen w-full flex-col rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 shadow-lg">
      <div className="border-b border-gray-700 px-4 py-3 md:px-6 md:py-4">
        <h1 className="text-xl font-semibold text-purple-300 md:text-2xl">
          TURNSTILE
        </h1>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
        {messages.length === 1 &&
          messages.length > 0 &&
          messages[0]?.role === "system" && (
            <div className="py-6 text-center text-gray-400 md:py-10">
              <p>Start a conversation by typing a message below</p>
            </div>
          )}
        {messages
          .filter((message) => message.role !== "system")
          .map((message) =>
            message.role === "user" ? (
              // User messages as chat bubbles aligned to the right
              <div key={message.id} className="flex justify-end">
                <div className="prose prose-sm md:prose-base prose-invert max-w-[80%] whitespace-pre-wrap rounded-lg bg-purple-600 p-3 text-white shadow-md sm:max-w-[70%] md:max-w-[60%] md:p-4">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <ReactMarkdown
                            key={`${message.id}-${i}`}
                            remarkPlugins={[remarkMath]}
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
              // Assistant responses as centered main content
              <div key={message.id} className="flex justify-center">
                <div className="prose prose-sm md:prose-base prose-invert max-w-[95%] whitespace-pre-wrap rounded-lg border border-gray-700 bg-gray-800 p-4 text-gray-100 shadow-md md:p-6">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <ReactMarkdown
                            key={`${message.id}-${i}`}
                            remarkPlugins={[remarkMath]}
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

      <div className="border-t border-gray-700 bg-gray-800 px-4 py-3 md:px-6 md:py-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 pr-10 text-gray-100 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 md:p-3 md:pr-12"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-md bg-purple-600 p-1.5 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 md:p-2"
            disabled={!input.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 md:h-5 md:w-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
