import chromadb

from sentence_transformers import SentenceTransformer


CHROMA_PATH = "chroma_db"
COLLECTION_NAME = "banking_faq"


model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

client = chromadb.PersistentClient(
    path=CHROMA_PATH
)

collection = client.get_collection(
    name=COLLECTION_NAME
)


def retrieve_documents(
    query: str,
    top_k: int = 3
):

    query_embedding = model.encode(
        [query]
    ).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k
    )

    return results["documents"][0]


if __name__ == "__main__":

    results = retrieve_documents(
        "What documents are required for KYC?"
    )

    for result in results:
        print("\n---")
        print(result)