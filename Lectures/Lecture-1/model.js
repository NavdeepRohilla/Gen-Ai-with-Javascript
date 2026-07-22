import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_Key
});

client.chat.completions
    .create({
        model: 'gpt-4o',
        messages: [{role: 'user', content: 'Tell me a popular sites from which i can download books for free. i need this information for my new client. please provide me with the name of a popular site from which i can download books for free.'}],
})
.then(response => {
    console.log(response.choices[0].message.content);
});