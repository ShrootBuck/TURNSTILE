// Enables Supabase Edge Function runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Import from JSR (Deno-native registry)
import { openai } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204, // No content
      headers: {
        "Access-Control-Allow-Origin": "*", // Or your specific frontend domain
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let messages;
  try {
    const body = await req.json();
    messages = body.messages;
    if (!messages) throw new Error("Missing messages");
  } catch (err) {
    return new Response("Invalid JSON or missing `messages`", { status: 400 });
  }

  const result = await streamText({
    model: openai("gpt-4o"), // Or 'gpt-4-turbo', etc.
    messages,
  });

  // Add CORS headers to the response
  const response = await result.toDataStreamResponse();
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "*"); // Or your specific frontend domain

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
});
