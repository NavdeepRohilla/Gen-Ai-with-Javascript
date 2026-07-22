import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "ollama",
  baseURL: process.env.BASE_URL,
});

const stream = await client.chat.completions.create({
  model: "qwen2.5:latest",
  messages: [
    {
      role: "user",
      content: "Can uhh help me to build a reverse a string program in golang",
    }
  ],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}

console.log("\nDone!");