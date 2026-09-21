import os

from dotenv import load_dotenv
from groq import Groq

from app.rag.retriever import retrieve_documents

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def support_agent(user_message: str):

    documents = retrieve_documents(
        user_message,
        top_k=3
    )

    context = "\n\n".join(documents)

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": """
You are a banking Support Agent.

Answer the user's question using ONLY the provided
banking knowledge.

Do not invent policies or information.

If the provided knowledge does not contain enough
information to answer the question, say that the
information is not available in the current knowledge base.

Keep the answer clear and concise.
"""
            },
            {
                "role": "user",
                "content": f"""
User question:
{user_message}

Relevant banking knowledge:
{context}
"""
            }
        ]
    )

    return response.choices[0].message.content