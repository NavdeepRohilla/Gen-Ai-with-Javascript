import 'dotenv/config';
import {OpenAIEmbeddings} from "@langchain/openai";
import { QdrantVectorStore } from '@langchain/qdrant'
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function query(userQuery) {
    // Convert User query to vector embeddings
     const embeddings = new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.OPENAI_API_KEY,
    });

    // search the vectors in the quadrant 
    // The vector Store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings, // Use this embedding model
        {
            url: 'http://localhost:6333',
            collectionName: 'chaicode-docs'
        },
    );

    // get similar vectors and chunks?

    const vectorRetriver = vectorStore.asRetriever({ k : 5});
    const results = await vectorRetriver.invoke(userQuery);

    // feed those chunks to llm model and do a simple chat with {userQuery}
    const SYSTEM_PROMPT=`
        You are an expert in answering user query based on the provided context about documents. Do not answer anythin beyond what is not provided.

        Always also answer the user in short and tell on which page number that content is available And also the answer name of the book like from which bookname you taken this data. Book name is not replication yr there are only two books System Design and HyperFocus.

        User Document:

        ${results.map(e => JSON.stringify({ bookName: e.metadata.bookName, pageContent: e.pageContent, pageNumber: e.metadata.loc.pageNumber})).join("\n\n")}
    `;

    const llmResponse = await client.chat.completions.create({
        model: 'gpt-4o',
        messages:[
            {role:'system', content: SYSTEM_PROMPT},
            {role:'user', content: userQuery}
        ],
    });

    console.log(`LLM Response:`, llmResponse.choices[0].message.content);

}

query('What is hyperfocus? How can we improve focus')