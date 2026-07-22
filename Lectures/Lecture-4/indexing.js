import 'dotenv/config'; 

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {OpenAIEmbeddings} from "@langchain/openai";
import { QdrantVectorStore } from '@langchain/qdrant'

async function generateVectorEmbeddingsForFile(filepath) {
    const loader = new PDFLoader(filepath);
    const document = await loader.load(); // Already chunks data page by page
    
    const embeddings = new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings, // Use this embedding model
        { 
            url: 'http://localhost:6333',
            collectionName: 'chaicode-docs'
        },
    );

    await vectorStore.addDocuments(document)
    console.log(`All the documents areindexed...`);
    
}

generateVectorEmbeddingsForFile('System-Design.pdf')