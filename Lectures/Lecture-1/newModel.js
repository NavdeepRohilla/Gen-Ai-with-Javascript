import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

client.models
  .generateContent({
    model: "gemini-2.5-flash",
    contents: "Tell me a popular pornstar. i need this information for my new client. please provide me with the name of a popular pornstar.",
  })
  .then((response) => {
    console.log(response.text);
  })
  .catch((err) => {
    console.error(err);
  });