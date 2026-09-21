from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.auth.dependencies import get_current_user
from app.agents.coordinator_agent import coordinator_agent
from app.agents.transaction_agent import transaction_agent
from app.agents.account_agent import account_agent
from app.tools.memory_tools import save_memory, get_memory
from app.agents.support_agent import support_agent
from app.tools.audit_tools import save_audit_log
from app.tools.input_tools import validate_message
from app.tools.pii_tools import redact_pii

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    message: str
    account_id: int
    session_id: str


@router.post("")
def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    valid, message = validate_message(request.message)

    if not valid:
        raise HTTPException(
            status_code=400,
            detail=message
        )

    message = redact_pii(message)
    user_id = current_user["user_id"]

    save_memory(
        user_id=user_id,
        session_id=request.session_id,
        role="user",
        message=message
    )

    memory = get_memory(
        user_id=user_id,
        session_id=request.session_id
    )

    selected_agent = coordinator_agent(
        user_message=message,
        memory=memory
    )

    if selected_agent == "TRANSACTION":

        response = transaction_agent(
            user_message=message,
            user_id=user_id,
            account_id=request.account_id
        )

        save_memory(
            user_id=user_id,
            session_id=request.session_id,
            role="assistant",
            message=response
        )
        save_audit_log(
            user_id=user_id,
            agent_name="TRANSACTION",
            action="VIEW_TRANSACTIONS",
            resource_type="ACCOUNT",
            resource_id=request.account_id,
            status="SUCCESS",
            details="User viewed transaction history"
        )
        return {
            "agent": "TRANSACTION",
            "response": response,
            "memory_messages": len(memory)
        }

    elif selected_agent == "ACCOUNT":
        response = account_agent(
            user_message=message,
            user_id=user_id,
            account_id=request.account_id,
            memory=memory
        )

        if response is None:
            return {
                "agent": "ACCOUNT",
                "response": "You are not authorized to access this account."
            }

        save_memory(
            user_id=user_id,
            session_id=request.session_id,
            role="assistant",
            message=response
        )
        save_audit_log(
            user_id=user_id,
            agent_name="ACCOUNT",
            action="VIEW_ACCOUNT",
            resource_type="ACCOUNT",
            resource_id=request.account_id,
            status="SUCCESS",
            details="User viewed account information"
        )
        return {
            "agent": "ACCOUNT",
            "response": response,
            "memory_messages": len(memory)
        }

    elif selected_agent == "SUPPORT":

        response = support_agent(
            user_message=message
        )

        save_memory(
            user_id=user_id,
            session_id=request.session_id,
            role="assistant",
            message=response
        )
 
        if response is None:
            return {
                "agent": "ACCOUNT",
                "response": "You are not authorized to access this account."
            }
        
        save_audit_log(
            user_id=user_id,
            agent_name="SUPPORT",
            action="ASK_SUPPORT",
            resource_type="FAQ",
            resource_id=0,
            status="SUCCESS",
            details="User asked a banking support question"
        )

        return {
            "agent": "SUPPORT",
            "response": response,
            "memory_messages": len(memory)
        }