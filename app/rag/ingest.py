import os

import chromadb
from sentence_transformers import SentenceTransformer


DOCUMENT_PATH = "app/rag/documents/banking_faq.txt"

CHROMA_PATH = "chroma_db"
COLLECTION_NAME = "banking_faq"


def ingest_documents():

    with open(DOCUMENT_PATH, "r", encoding="utf-8") as file:
        text = file.read()

    chunks = [
        chunk.strip()
        for chunk in text.split("\n\n")
        if chunk.strip()
    ]

    model = SentenceTransformer(
        "all-MiniLM-L6-v2"
    )

    embeddings = model.encode(chunks).tolist()

    client = chromadb.PersistentClient(
        path=CHROMA_PATH
    )

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME
    )

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[
            f"faq_{i}"
            for i in range(len(chunks))
        ]
    )

    print("Documents successfully stored in ChromaDB.")
    print("Chunks:", len(chunks))


if __name__ == "__main__":
    ingest_documents()