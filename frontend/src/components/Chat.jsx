import { useState } from "react";
import "./Chat.css";

function Chat({ accountId }) {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!message.trim() || loading || !accountId) {
            return;
        }

        const token = localStorage.getItem("access_token");
        const userMessage = message.trim();

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage
            }
        ]);

        setMessage("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        message: userMessage,
                        account_id: accountId,
                        session_id: "session-1"
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to get response"
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.response
                }
            ]);

        } catch (error) {

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: error.message
                }
            ]);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="chat-container">

            {/* HEADER */}

            <div className="chat-header">

                <div className="ai-avatar">
                    ✦
                </div>

                <div>

                    <h2>
                        Bank AI
                    </h2>

                    <span>
                        Your personal banking assistant
                    </span>

                </div>

                <div className="ai-online">
                    <span></span>
                    Online
                </div>

            </div>


            {/* CHAT BODY */}

            <div className="chat-body">

                {messages.length === 0 && (

                    <div className="chat-welcome">

                        <div className="big-ai-icon">
                            ✦
                        </div>

                        <h3>
                            How can I help?
                        </h3>

                        <p>
                            Ask me about your balance,
                            transactions or banking policies.
                        </p>

                        <div className="suggestions">

                            <button
                                onClick={() =>
                                    setMessage("What is my balance?")
                                }
                            >
                                💰 Check my balance
                            </button>

                            <button
                                onClick={() =>
                                    setMessage("Show my recent transactions")
                                }
                            >
                                📊 Recent transactions
                            </button>

                            <button
                                onClick={() =>
                                    setMessage("What is KYC?")
                                }
                            >
                                🔐 What is KYC?
                            </button>

                        </div>

                    </div>

                )}


                {messages.map((msg, index) => (

                    <div
                        key={index}
                        className={
                            msg.role === "user"
                                ? "message user-message"
                                : "message ai-message"
                        }
                    >

                        {msg.role === "assistant" && (
                            <div className="message-avatar">
                                ✦
                            </div>
                        )}

                        <div className="message-bubble">

                            {msg.content}

                        </div>

                    </div>

                ))}


                {loading && (

                    <div className="message ai-message">

                        <div className="message-avatar">
                            ✦
                        </div>

                        <div className="typing">

                            <span></span>
                            <span></span>
                            <span></span>

                        </div>

                    </div>

                )}

            </div>


            {/* INPUT */}

            <div className="chat-input-area">

                <div className="chat-input-wrapper">

                    <input
                        type="text"
                        placeholder="Ask your banking assistant..."
                        value={message}
                        disabled={loading}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                sendMessage();
                            }

                        }}
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading || !message.trim()}
                    >
                        ↑
                    </button>

                </div>

                <p>
                    AI responses may be generated. Never share your password or PIN.
                </p>

            </div>

        </div>
    );
}

export default Chat;