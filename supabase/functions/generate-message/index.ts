// Enables Supabase Edge Function runtime types
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { openai } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";

// Dummy function to simulate saving to DB
async function saveResponseToDB(responseText) {
  // your DB saving logic here
  console.log("Saving response to DB:", responseText);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
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
    model: openai("gpt-4o-mini"),
    messages,
  });

  // Convert stream result to a response for the client
  const response = await result.toDataStreamResponse();
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "*");

  // Kick off a background task to save the response to your DB.
  EdgeRuntime.waitUntil(
    (async () => {
      try {
        const responseText = await result.text;
        await saveResponseToDB(responseText);
      } catch (err) {
        console.error("Error saving to DB:", err);
      }
    })(),
  );

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
});
