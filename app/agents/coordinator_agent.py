import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def coordinator_agent(
    user_message: str,
    memory: list
):

    conversation = ""

    for item in memory:
        conversation += f"{item['role']}: {item['message']}\n"

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": """
You are the Coordinator Agent for a banking system.

Your job is to identify which specialized agent should handle
the user's request.

Available agents:

ACCOUNT
- balance
- account details
- account status

TRANSACTION
- transaction history
- recent transactions
- transaction details

SUPPORT
- banking policies
- FAQs
- general banking questions

Return ONLY one of these three words:
ACCOUNT
TRANSACTION
SUPPORT
"""
            },
            {
                "role": "user",
                "content": f"""
Previous conversation:
{conversation}

Current user message:
{user_message}
"""
            }
        ]
    )

    return response.choices[0].message.content.strip().upper()