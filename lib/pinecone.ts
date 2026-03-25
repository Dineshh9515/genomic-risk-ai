import { Pinecone } from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const getIndex = () => pinecone.index(process.env.PINECONE_INDEX_NAME || "genomic-embeddings");

export async function searchSimilarGenes(
  queryVector: number[],
  topK: number = 10,
  filter?: Record<string, unknown>
) {
  const index = getIndex();
  const results = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
    filter,
  });
  return results.matches || [];
}

export async function upsertGeneEmbeddings(
  vectors: {
    id: string;
    values: number[];
    metadata: {
      gene_name: string;
      analysis_id: string;
      user_id: string;
      shap_value: number;
      pathway: string;
    };
  }[]
) {
  const index = getIndex();
  await index.upsert(vectors);
}
